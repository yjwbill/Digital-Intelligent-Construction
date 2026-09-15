const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=read('src/app/operation/production-project-list.js');
const constructionSource=read('src/app/production/dashboard-projects.js');
const modalSource=read('src/app/shared/worker-detail.js');
const reportSource=read('src/app/operation/production-project-report.js');

function setup({savedColumns=null,constructionProjects=[]}={}){
  const storage=new Map(),messages=[];
  if(savedColumns)storage.set('columns-operationProductionProjectList',JSON.stringify(savedColumns));
  let rows=[],savedProjects=[],button=null;
  const element=()=>({dataset:{},style:{},className:'',innerHTML:'',classList:{add(){}},querySelector:()=>null});
  const footer=element();
  let footerHtml='';
  Object.defineProperty(footer,'innerHTML',{
    get:()=>footerHtml,
    set:html=>{if(button)button.isConnected=false;footerHtml=html;button=html.includes('data-construction-confirm')?{isConnected:true,disabled:false}:null;}
  });
  footer.querySelector=()=>button;
  const context=vm.createContext({
    console,document:{getElementById:()=>null},tableColumnDefinitions:{},detailPage:element(),listPage:element(),
    modalBox:element(),modalBody:element(),modalFooter:footer,modalTitle:element(),modalMask:element(),
    constructionProjectData:constructionProjects,constructionProjectCurrentList:[],constructionProjectBaseFilteredList:[],
    persistMasterData:(entity,data)=>{assert.equal(entity,'projects');savedProjects=JSON.parse(JSON.stringify(data));},
    escapeAttr:value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),
    getColumnStorageKey:key=>'columns-'+key,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
    tag:value=>`<span>${value}</span>`,renderUnifiedQueryCard:()=>'',renderUnifiedTableCard:()=>'',
    StatisticsFilter:{render:()=>''},renderTableByColumns:(key,data)=>{rows=data;},showToast:message=>messages.push(message)
  });
  context.window=context;
  vm.runInContext(modalSource.slice(modalSource.indexOf('function openModal('),modalSource.indexOf('function showToast(')),context);
  vm.runInContext(reportSource.slice(reportSource.indexOf('function operationReadonlyField('),reportSource.indexOf('function operationRadioField(')),context);
  vm.runInContext(constructionSource.slice(constructionSource.indexOf('function getNewConstructionProjectDefaults('),constructionSource.indexOf('function saveConstructionProject(')),context);
  vm.runInContext(source,context);
  context.renderOperationProductionProjectListPage();
  return {context,storage,messages,get rows(){return rows;},get button(){return button;},get savedProjects(){return savedProjects;},
    operation:row=>context.tableColumnDefinitions.operationProductionProjectList.find(column=>column.key==='operation').render(row)};
}

test('操作列默认220px，仅总承包、管线且未关联、无立项时间时提供创建入口，旧默认宽度迁移后仍可自定义',()=>{
  const env=setup({savedColumns:[{key:'operation',width:250},{key:'projectName',width:350}]});
  assert.equal(env.context.tableColumnDefinitions.operationProductionProjectList.at(-1).width,220);
  assert.deepEqual(JSON.parse(env.storage.get('columns-operationProductionProjectList')),[{key:'operation',width:220},{key:'projectName',width:350}]);
  assert.ok(!env.operation(env.rows[0]).includes('创建施工项目'));
  const row=env.rows[2];
  for(const businessType of ['总承包','管线']){
    assert.ok(env.operation({...row,businessType}).includes('创建施工项目'));
    assert.ok(!env.operation({...row,businessType,linkedConstructionProject:'SG-EXISTING'}).includes('创建施工项目'));
    assert.ok(!env.operation({...row,businessType,constructionDate:'2026-09-15'}).includes('创建施工项目'));
  }
  for(const businessType of ['数字','设计','产品销售','',undefined]){
    row.businessType=businessType;
    assert.ok(!env.operation(row).includes('创建施工项目'));
    env.context.createOperationConstructionProject(row.id);
    assert.equal(env.button,null);
    assert.equal(env.context.constructionProjectData.length,0);
  }
  const custom=setup({savedColumns:[{key:'operation',width:310}]});
  assert.equal(JSON.parse(custom.storage.get('columns-operationProductionProjectList'))[0].width,310);
});

test('业务弹框展示10个只读字段，四列排列；取消或关闭不创建且旧确认不可执行',()=>{
  const env=setup(),ctx=env.context,row=env.rows[2];
  row.projectName='<项目名称>';
  ctx.createOperationConstructionProject(row.id);
  assert.equal(ctx.modalTitle.innerText,'施工立项确认');
  assert.equal(ctx.modalBox.className,'modal large');
  assert.ok(ctx.modalBody.innerHTML.includes('repeat(4,minmax(0,1fr))'));
  assert.equal((ctx.modalBody.innerHTML.match(/<label>/g)||[]).length,10);
  for(const field of ['项目名称','项目简称','子公司','分公司','项目经理','国家','省市区','项目地址','是否集团一体化管理模式项目','项目状态'])assert.ok(ctx.modalBody.innerHTML.includes(`<label>${field}</label>`));
  assert.ok(ctx.modalBody.innerHTML.includes('&lt;项目名称&gt;'));
  assert.ok(ctx.modalFooter.innerHTML.includes('取消'));
  assert.ok(ctx.modalFooter.innerHTML.includes('确认'));
  assert.equal(row.linkedConstructionProject,'');
  assert.equal(row.constructionDate,'');
  const stale=env.button;
  ctx.closeModal();
  ctx.confirmOperationConstructionProject(stale);
  assert.equal(ctx.constructionProjectData.length,0);
  assert.equal(env.messages.length,0);
});

for(const rowIndex of [2,8])test(`${rowIndex===2?'总承包':'管线'}确认后创建施工项目，关联编号和时间同步，按钮消失，刷新保持且重复确认不重复创建`,()=>{
  const env=setup(),ctx=env.context,row=env.rows[rowIndex];
  ctx.createOperationConstructionProject(row.id);
  const confirm=env.button;
  ctx.confirmOperationConstructionProject(confirm);
  assert.equal(ctx.constructionProjectData.length,1);
  const project=ctx.constructionProjectData[0];
  assert.equal(project.projectName,row.projectName);
  assert.equal(project.productionProjectNo,row.productionProjectNo);
  assert.equal(project.subCompany,row.company);
  assert.equal(project.branchCompany,row.branch);
  assert.equal(project.projectManager,row.projectManager);
  assert.equal(row.linkedConstructionProject,project.projectCode);
  assert.equal(row.constructionDate,project.constructionCreatedAt);
  assert.match(row.constructionDate,/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.equal(row.constructionStatus,'已立项');
  assert.ok(!env.operation(row).includes('创建施工项目'));
  assert.equal(ctx.modalMask.style.display,'none');
  assert.deepEqual(env.messages,[`项目：${row.projectName} 已在施工项目一览表中完成创建`]);
  ctx.confirmOperationConstructionProject(confirm);
  ctx.createOperationConstructionProject(row.id);
  assert.equal(ctx.constructionProjectData.length,1);
  assert.equal(env.messages.length,1);
  const reloaded=setup({constructionProjects:env.savedProjects});
  assert.equal(reloaded.rows[rowIndex].linkedConstructionProject,project.projectCode);
  assert.equal(reloaded.rows[rowIndex].constructionDate,project.constructionCreatedAt);
  assert.ok(!reloaded.operation(reloaded.rows[rowIndex]).includes('创建施工项目'));
});

test('弹框打开后若项目已立项，确认不会重复创建',()=>{
  const env=setup(),ctx=env.context,row=env.rows[2];
  ctx.createOperationConstructionProject(row.id);
  ctx.constructionProjectData.push({productionProjectNo:row.productionProjectNo,projectCode:'SG-EXISTING',approvalDate:'2026-09-15'});
  ctx.confirmOperationConstructionProject(env.button);
  assert.equal(ctx.constructionProjectData.length,1);
  assert.equal(row.linkedConstructionProject,'SG-EXISTING');
  assert.equal(row.constructionDate,'2026-09-15');
  assert.equal(env.messages.length,0);
});

test('确认时重新校验业态，弹框打开后变更为不支持的业态不会创建',()=>{
  const env=setup(),ctx=env.context,row=env.rows[2];
  ctx.createOperationConstructionProject(row.id);
  row.businessType='设计';
  ctx.confirmOperationConstructionProject(env.button);
  assert.equal(ctx.constructionProjectData.length,0);
  assert.equal(row.linkedConstructionProject,'');
  assert.equal(row.constructionDate,'');
  assert.equal(env.messages.length,0);
});
