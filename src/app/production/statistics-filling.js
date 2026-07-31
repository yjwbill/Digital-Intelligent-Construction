const statisticsFillingIndustryConfigs=[
  {key:"服务业",label:"服务业",badge:30,metric:"营收",groups:["当月发生数","当月预计数","次月预计数（预测）","1-2月累计数（预测）","1-5月累计数（预测）","1-8月累计数（预测）","1-11月累计数（预测）"]},
  {key:"建筑业",label:"建筑业",badge:22,metric:"产值",dual:true,groups:["当月发生数","当月累计数","次月累计数（预测）","季度累计数（预测）","全年累计数（预测）"]},
  {key:"工业",sourceKey:"制造业（工业）",label:"工业",badge:7,metric:"产值",groups:["当月发生数","当月累计数","次月累计数（预测）","季度累计数（预测）","全年累计数（预测）"]},
  {key:"房地产业",label:"房地产业",badge:9,realEstate:true,groups:["当月发生数","当月累计数","次月累计数（预测）","季度累计数（预测）","全年累计数（预测）"]},
  {key:"零售批发",label:"批发零售业",badge:1,metric:"销售额",groups:["当月发生数","当月累计数","次月累计数（预测）","季度累计数（预测）","全年累计数（预测）"]},
  {key:"金融业",label:"金融业",badge:1,metric:"营收",groups:["当月发生数","当月预计数","次月预计数（预测）","1-2月累计数（预测）","1-5月累计数（预测）","1-8月累计数（预测）","1-11月累计数（预测）"]}
];

const statisticsFillingState={industry:"服务业",month:"2026-06",focus:"",enterprise:"",company:"",status:"",startDate:"",endDate:"",page:1,pageSize:50};

function getStatisticsFillingConfig(){
  return statisticsFillingIndustryConfigs.find(item=>item.key===statisticsFillingState.industry)||statisticsFillingIndustryConfigs[0];
}

function getStatisticsFillingSourceIndustry(config=getStatisticsFillingConfig()){
  return (typeof getProductionStatisticsIndustries==="function"?getProductionStatisticsIndustries():[]).find(item=>item.name===(config.sourceKey||config.key));
}

function getStatisticsFillingRows(config=getStatisticsFillingConfig()){
  const source=getStatisticsFillingSourceIndustry(config);
  const rows=(source?.records||[]).filter(item=>item.recordType==="detail").map((item,index)=>{
    const hasValue=statisticsFillingHasValue(item.metrics);
    return {...item,__status:hasValue?(index%11===4?"待审核":"已上报"):"未上报",__focus:index%5===0?"是":"否",__time:hasValue?`2026-07-${String(6+index%18).padStart(2,"0")} ${String(8+index%9).padStart(2,"0")}:${String(index*7%60).padStart(2,"0")}`:"",__filler:hasValue?(item.contact||"系统填报人"):""};
  });
  return rows.filter(item=>(!statisticsFillingState.focus||item.__focus===statisticsFillingState.focus)
    &&(!statisticsFillingState.enterprise||String(item.legalEntity||"").includes(statisticsFillingState.enterprise))
    &&(!statisticsFillingState.company||item.company===statisticsFillingState.company)
    &&(!statisticsFillingState.status||item.__status===statisticsFillingState.status)
    &&(!statisticsFillingState.startDate||!item.__time||item.__time.slice(0,10)>=statisticsFillingState.startDate)
    &&(!statisticsFillingState.endDate||!item.__time||item.__time.slice(0,10)<=statisticsFillingState.endDate));
}

function statisticsFillingHasValue(value){
  if(value&&typeof value==="object")return Object.values(value).some(statisticsFillingHasValue);
  return Number(value)!==0&&value!==""&&value!==null&&value!==undefined;
}

function statisticsFillingNumber(value,digits=4){
  const num=Number(value||0);
  if(!Number.isFinite(num))return "-";
  return (num/10000).toFixed(digits).replace(/\.?0+$/,"")||"0";
}

function statisticsFillingGrowth(current,previous){
  const now=Number(current||0),before=Number(previous||0);
  if(!before)return "-";
  const value=(now-before)/Math.abs(before)*100;
  return `${value.toFixed(2).replace(/\.00$/,"")}%`;
}

function getStatisticsFillingSimpleValues(record,groupIndex,local=false){
  const metrics=record.metrics||{};
  const month=Number(metrics.month2026||0),monthLast=Number(metrics.month2025||0),ytd=Number(metrics.ytd2026||0),ytdLast=Number(metrics.ytd2025||0),plan=Number(metrics.plan2026||0);
  const factors=[1,1,1.12,1.5,2.6,3.8,5.2];
  const cumulative=groupIndex===0?month:groupIndex===1?ytd:(plan||ytd)*Math.min(1,factors[groupIndex]/5.2);
  const previous=groupIndex===0?monthLast:groupIndex===1?ytdLast:(ytdLast||monthLast)*factors[groupIndex];
  const ratio=local?.68:1;
  return [cumulative*ratio,previous*ratio,statisticsFillingGrowth(cumulative*ratio,previous*ratio)];
}

function getStatisticsFillingRealEstateValues(record,groupIndex){
  const periods=["month2026","ytd2026","plan2026","plan2026","plan2026"];
  const previousPeriods=["month2025","ytd2025","annual2025","annual2025","annual2025"];
  const factor=[1,1,.35,.65,1][groupIndex]||1;
  const current=record.metrics?.[periods[groupIndex]]||{};
  const previous=record.metrics?.[previousPeriods[groupIndex]]||{};
  return ["output","revenue","investment","salesArea"].flatMap(key=>{
    const now=Number(current[key]||0)*factor,before=Number(previous[key]||0)*factor;
    return [now,before,statisticsFillingGrowth(now,before)];
  });
}

function renderStatisticsFillingIndustryRail(){
  return statisticsFillingIndustryConfigs.map(item=>{
    const count=getStatisticsFillingRowsUnfiltered(item).length;
    const reported=item.badge??getStatisticsFillingRowsUnfiltered(item).filter(row=>statisticsFillingHasValue(row.metrics)).length;
    return `<div class="org-tree-node ${item.key===statisticsFillingState.industry?"active":""}" onclick="switchStatisticsFillingIndustry('${item.key}')">
      <div class="org-node-left"><span class="org-node-icon">📁</span><span class="org-node-name">${item.label}（${count}条）</span></div>
      <span class="statistics-filling-reported" title="已填报 ${reported} 条">${reported}</span>
    </div>`;
  }).join("");
}

function getStatisticsFillingRowsUnfiltered(config){
  return (getStatisticsFillingSourceIndustry(config)?.records||[]).filter(row=>row.recordType==="detail");
}

function renderStatisticsFillingFilters(){
  const companies=[...new Set(getStatisticsFillingRowsUnfiltered(getStatisticsFillingConfig()).map(row=>row.company).filter(Boolean))];
  const fieldsHtml=`
    <div class="form-item"><label>纳统年月</label><input id="statisticsFillingMonth" class="input" type="month" value="${statisticsFillingState.month}"/></div>
    ${renderOperationSelect("statisticsFillingFocus","是否重点关注",["是","否"],statisticsFillingState.focus)}
    ${renderOperationInput("statisticsFillingEnterprise","企业名称",statisticsFillingState.enterprise,"请输入企业名称")}
    ${renderOperationSelect("statisticsFillingStatus","填报状态",["未上报","待审核","已上报"],statisticsFillingState.status)}
    ${renderOperationSelect("statisticsFillingCompany","所属单位",companies,statisticsFillingState.company)}
    <div class="form-item statistics-filling-date-item"><label>填报时间</label><div class="statistics-filling-date-range"><input id="statisticsFillingStartDate" class="input" type="date" value="${statisticsFillingState.startDate}"/><span>至</span><input id="statisticsFillingEndDate" class="input" type="date" value="${statisticsFillingState.endDate}"/></div></div>`;
  return renderUnifiedQueryCard(fieldsHtml,{id:"statisticsFillingQueryCard",resetFn:"resetStatisticsFilling()",queryFn:"queryStatisticsFilling()",canCollapse:false});
}

function renderStatisticsFillingHeader(config){
  const common=`<th rowspan="3">序号</th><th rowspan="3">填报状态</th><th rowspan="3" class="enterprise">企业名称</th><th rowspan="3">所属单位</th><th rowspan="3">所属行业类别</th><th rowspan="3">填报时间</th><th rowspan="3">填报人</th>`;
  if(config.realEstate){
    return `<thead><tr>${common}${config.groups.map(group=>`<th colspan="12">${group}</th>`).join("")}<th rowspan="3">操作</th></tr><tr>${config.groups.map(()=>["产值","营收","投资额","销售面积"].map(metric=>`<th colspan="3">${metric}</th>`).join("")).join("")}</tr><tr>${config.groups.map(()=>["产值（亿元）","上年同期（亿元）","增长率","营收（亿元）","上年同期（亿元）","增长率","投资额（亿元）","上年同期（亿元）","增长率","销售面积","上年同期","增长率"].map(item=>`<th>${item}</th>`).join("")).join("")}</tr></thead>`;
  }
  if(config.dual){
    return `<thead><tr>${common}${config.groups.map(group=>`<th colspan="6">${group}</th>`).join("")}<th rowspan="3">操作</th></tr><tr>${config.groups.map(()=>`<th colspan="3">建筑业总产值</th><th colspan="3">其中在地建筑业产值</th>`).join("")}</tr><tr>${config.groups.map(()=>["产值（亿元）","上年同期（亿元）","增长率","产值（亿元）","上年同期（亿元）","增长率"].map(item=>`<th>${item}</th>`).join("")).join("")}</tr></thead>`;
  }
  return `<thead><tr>${common}${config.groups.map(group=>`<th colspan="3">${group}</th>`).join("")}<th rowspan="3">操作</th></tr><tr>${config.groups.map(()=>`<th colspan="3">${config.metric}</th>`).join("")}</tr><tr>${config.groups.map(()=>[`${config.metric}（亿元）`,`上年同期（亿元）`,`增长率`].map(item=>`<th>${item}</th>`).join("")).join("")}</tr></thead>`;
}

function renderStatisticsFillingMetricCells(record,config){
  if(config.realEstate)return config.groups.map((_,index)=>getStatisticsFillingRealEstateValues(record,index).map((value,valueIndex)=>`<td class="number">${valueIndex%3===2?value:statisticsFillingNumber(value,valueIndex%12>=9?2:4)}</td>`).join("")).join("");
  if(config.dual)return config.groups.map((_,index)=>[...getStatisticsFillingSimpleValues(record,index),...getStatisticsFillingSimpleValues(record,index,true)].map((value,valueIndex)=>`<td class="number">${valueIndex%3===2?value:statisticsFillingNumber(value)}</td>`).join("")).join("");
  return config.groups.map((_,index)=>getStatisticsFillingSimpleValues(record,index).map((value,valueIndex)=>`<td class="number">${valueIndex===2?value:statisticsFillingNumber(value)}</td>`).join("")).join("");
}

function renderStatisticsFillingTable(){
  const config=getStatisticsFillingConfig(),rows=getStatisticsFillingRows(config);
  const totalPages=Math.max(1,Math.ceil(rows.length/statisticsFillingState.pageSize));
  if(statisticsFillingState.page>totalPages)statisticsFillingState.page=totalPages;
  const start=(statisticsFillingState.page-1)*statisticsFillingState.pageSize;
  const pageRows=rows.slice(start,start+statisticsFillingState.pageSize);
  const metricColCount=config.realEstate?config.groups.length*12:config.dual?config.groups.length*6:config.groups.length*3;
  return `<section class="card table-card statistics-filling-table-card"><div class="card-hd"><div class="card-title">纳统填报列表</div><div class="actions"><button class="btn" onclick="renderStatisticsFillingPage()">刷新</button><button class="btn primary" onclick="showToast('导出任务已创建')">导出</button></div></div><div class="table-wrap statistics-filling-table-wrap"><table>${renderStatisticsFillingHeader(config)}<tbody>${pageRows.map((record,index)=>`<tr><td>${start+index+1}</td><td><span class="statistics-fill-status ${record.__status}">${record.__status}</span></td><td class="enterprise" title="${escapeAttr(record.legalEntity)}">${record.legalEntity}</td><td>${record.company||"-"}</td><td>${config.label}</td><td>${record.__time||"-"}</td><td>${record.__filler||"-"}</td>${renderStatisticsFillingMetricCells(record,config)}<td class="actions"><a onclick="showToast('查看：${escapeAttr(record.legalEntity)}')">查看</a>${record.__status!=="已上报"?`<a onclick="showToast('编辑：${escapeAttr(record.legalEntity)}')">编辑</a>`:""}</td></tr>`).join("")||`<tr><td colspan="${metricColCount+8}" class="statistics-filling-empty">暂无符合条件的数据</td></tr>`}</tbody></table></div><div class="pagination statistics-filling-pagination"><span>共 ${rows.length} 条记录</span><div class="pager"><button class="btn mini" ${statisticsFillingState.page<=1?"disabled":""} onclick="changeStatisticsFillingPage(-1)">上一页</button><b>第 ${statisticsFillingState.page} / ${totalPages} 页</b><button class="btn mini" ${statisticsFillingState.page>=totalPages?"disabled":""} onclick="changeStatisticsFillingPage(1)">下一页</button><select class="select mini-select" onchange="changeStatisticsFillingPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${statisticsFillingState.pageSize===size?"selected":""}>${size}条/页</option>`).join("")}</select></div></div></section>`;
}

function renderStatisticsFillingPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=`<div class="statistics-filling-page"><div class="compact-title-row"><div class="module-title">纳统管理 / 纳统填报</div></div><div class="base-auth-layout statistics-filling-layout"><section class="org-tree-panel"><div class="org-tree-hd"><div class="card-title">业态选择</div></div><div class="org-tree-body">${renderStatisticsFillingIndustryRail()}</div></section><section class="org-user-panel"><div class="org-user-body statistics-filling-main">${renderStatisticsFillingFilters()}${renderStatisticsFillingTable()}</div></section></div></div>`;
}

function switchStatisticsFillingIndustry(industry){statisticsFillingState.industry=industry;statisticsFillingState.company="";statisticsFillingState.page=1;renderStatisticsFillingPage();}
function queryStatisticsFilling(){Object.assign(statisticsFillingState,{month:document.getElementById("statisticsFillingMonth")?.value||"2026-06",focus:document.getElementById("statisticsFillingFocus")?.value||"",enterprise:document.getElementById("statisticsFillingEnterprise")?.value.trim()||"",status:document.getElementById("statisticsFillingStatus")?.value||"",company:document.getElementById("statisticsFillingCompany")?.value||"",startDate:document.getElementById("statisticsFillingStartDate")?.value||"",endDate:document.getElementById("statisticsFillingEndDate")?.value||"",page:1});renderStatisticsFillingPage();}
function resetStatisticsFilling(){Object.assign(statisticsFillingState,{month:"2026-06",focus:"",enterprise:"",company:"",status:"",startDate:"",endDate:"",page:1});renderStatisticsFillingPage();}
function changeStatisticsFillingPage(delta){const pages=Math.max(1,Math.ceil(getStatisticsFillingRows().length/statisticsFillingState.pageSize));statisticsFillingState.page=Math.max(1,Math.min(pages,statisticsFillingState.page+Number(delta||0)));renderStatisticsFillingPage();}
function changeStatisticsFillingPageSize(size){statisticsFillingState.pageSize=[20,50,100].includes(Number(size))?Number(size):50;statisticsFillingState.page=1;renderStatisticsFillingPage();}
