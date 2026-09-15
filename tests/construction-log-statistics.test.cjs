const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {test}=require('node:test');

const source=fs.readFileSync(path.join(__dirname,'../src/app/home/construction-log.js'),'utf8');

function createContext(){
  const types=Array.from({length:18},(_,index)=>index===9?'施工类（大于400万）':`其他业务${index}`);
  const projects=[
    [9,'应报已报','在建','甲公司'],
    [27,'应报未报','在建','甲公司'],
    [45,'应报停工','停工','乙公司'],
    [63,'应报未开始','在建','乙公司'],
    [1,'其他已报','在建','甲公司'],
    [2,'其他未报','在建','甲公司'],
    [3,'其他停工','停工','乙公司'],
    [4,'其他未开始','在建','乙公司']
  ].map(([id,projectName,projectStatus,subCompany])=>({id,projectName,projectStatus,subCompany}));
  const context=vm.createContext({
    window:{},
    constructionProjectData:projects,
    getCurrentReportMonth:()=> '2026-07',
    getDictEnabledOptionsV2285:()=> types,
    projectLogDeletedKeys:new Set(['应报未报|2026-07-13','其他未报|2026-07-13']),
    StatisticsFilter:{render:config=>config},
    renderProjectLogStatusIcon:state=>`<icon state="${state}"></icon>`
  });
  vm.runInContext(source,context);
  // 仅隔离详情内容生成；统计使用页面的真实数据生成、每日状态和筛选函数。
  vm.runInContext(`
    getEnterpriseConstructionLogReportRecord=()=>({mode:'online'});
    const actualDayState=getEnterpriseConstructionLogDayStateForMonth;
    getEnterpriseConstructionLogDayStateForMonth=(project,day,month)=>
      [4,63].includes(project.id)?'not-started':actualDayState(project,day,month);
  `,context);
  return context;
}

function evaluate(context,expression){
  return JSON.parse(vm.runInContext(`JSON.stringify(${expression})`,context));
}

test('应报限定业务类型，实报与停工统计包含其他业务类型，未开始不误算已报',()=>{
  const context=createContext();
  const buckets=evaluate(context,'Object.fromEntries(Object.entries(getEnterpriseConstructionLogStatBuckets()).map(([key,rows])=>[key,rows.map(row=>row.id)]))');
  assert.deepEqual(buckets,{
    required:[9,27,45,63],reported:[9,1],unreported:[27,45,63],stopped:[45,3],onTime:[9],notOnTime:[27,45,63]
  });
});

test('每个统计数字与点击后的完整列表数量一致，默认仍能查看全部项目',()=>{
  const context=createContext();
  assert.equal(evaluate(context,'getEnterpriseConstructionLogFilteredRows().length'),8);
  const items=evaluate(context,'renderEnterpriseConstructionLogStats().groups.flatMap(group=>group.items)');
  for(const {key,value} of items){
    vm.runInContext(`enterpriseConstructionLogState.statKey=${JSON.stringify(key)}`,context);
    assert.equal(evaluate(context,'getEnterpriseConstructionLogFilteredRows().length'),value,key);
    vm.runInContext('enterpriseConstructionLogState.pageSize=1; enterpriseConstructionLogState.page=1',context);
    assert.equal(evaluate(context,'getEnterpriseConstructionLogPagedRows().length'),Math.min(1,value));
  }
});

test('查询条件同时限制统计和列表，按要求上报仍与当前月份的是/否一致',()=>{
  const context=createContext();
  vm.runInContext("enterpriseConstructionLogState.company='甲公司'",context);
  const counts=evaluate(context,'Object.fromEntries(Object.entries(getEnterpriseConstructionLogStatBuckets()).map(([key,rows])=>[key,rows.length]))');
  assert.deepEqual(counts,{required:2,reported:2,unreported:1,stopped:0,onTime:1,notOnTime:1});
  vm.runInContext("enterpriseConstructionLogState.reportMonth='2026-06'",context);
  for(const [key,value] of [['onTime','是'],['notOnTime','否']]){
    assert.equal(evaluate(context,`getEnterpriseConstructionLogStatBuckets().${key}.length`),evaluate(context,`getEnterpriseConstructionLogSearchRows().filter(row=>row.onTimeUpload==='${value}').length`));
  }
  assert.equal(evaluate(context,'getEnterpriseConstructionLogStatBuckets().reported.length'),2);
  vm.runInContext("enterpriseConstructionLogState.projectName='不存在的项目'",context);
  assert.equal(evaluate(context,'renderEnterpriseConstructionLogStats().groups.flatMap(group=>group.items).every(item=>item.value===0)'),true);
});

test('每日图标保留两类项目差异：其他类型已报绿勾、未报未开始，目标类型四种状态',()=>{
  const context=createContext();
  const expected={9:'uploaded',27:'missing',45:'stopped',63:'not-started',1:'uploaded',2:'not-started',3:'not-started',4:'not-started'};
  for(const [id,state] of Object.entries(expected)){
    const html=evaluate(context,`renderEnterpriseConstructionLogDayCell(getEnterpriseConstructionLogRows().find(row=>row.id===${id}),13)`);
    assert.ok(html.includes(`state="${state}"`),`项目 ${id} 应显示 ${state}`);
    if(state==='uploaded')assert.ok(html.includes('openEnterpriseConstructionLogReportDetail'));
  }
});
