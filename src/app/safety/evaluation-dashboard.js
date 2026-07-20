/* =========================
   详情、弹窗和其它
========================= */
function renderSafetyPlaceholder(name){
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=placeholderHTML(
    name,
    "🛠️",
    "当前模块已纳入安全管理菜单，后续可继续扩展业务页面。"
  );
}

function renderSafetyEvaluationManagePage(name){
  if(name==="指标管理")return renderSafetyEvaluationIndicatorPage();
  if(name==="月度评价填报")return renderSafetyEvaluationMonthlyFillCurrentPage();
  if(name==="月度评价填报（禁）"){
    safetyEvalMonthlyFillState.activeTab="company";
    return renderSafetyEvaluationMonthlyFillPage(true);
  }
  if(name==="对象管理（禁）")return renderSafetyEvaluationObjectPage();
  if(name==="评价模型")return renderSafetyEvaluationModelPage();
  if(name==="评价任务管理")return renderSafetyEvaluationTaskPage();
  if(name==="评价结果管理")return renderSafetyEvaluationResultPage();
  if(name==="源数据管理")return renderSafetyEvaluationSourcePage();
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / ${name}</div>
    </div>
    <section class="card">
      <div class="card-hd">
        <div class="card-title">${name}</div>
        <div class="actions">
          <button class="btn">导入</button>
          <button class="btn">导出</button>
          <button class="btn primary">新增</button>
        </div>
      </div>
      <div class="card-bd safety-eval-manage-empty">
        <strong>${name}</strong>
        <p>当前为安全评价管理功能入口，后续可在此维护评价指标、评价对象、模型、任务、结果和源数据。</p>
      </div>
    </section>
  `;
}

const safetyEvalMonthlyFillState={
  activePlan:"2026-06",
  selectedYear:"2026",
  activeTab:"company",
  page:{company:1,branch:1,project:1},
  pageSize:10
};
try{
  ["safetyEvalMonthlyCompany","safetyEvalMonthlyBranch","safetyEvalMonthlyProject"].forEach(key=>localStorage.removeItem(getColumnStorageKey(key)));
}catch(e){}
const safetyEvalMonthlyPlans=[
  {month:"2026-06",status:"进行中",company:"已填报",branch:"未填报",project:"已填报",updatedAt:"2026-06-23 09:30"},
  {month:"2026-05",status:"已结束",company:"已填报",branch:"已填报",project:"已填报",updatedAt:"2026-06-22 18:15"},
  {month:"2026-04",status:"已结束",company:"已填报",branch:"已填报",project:"未填报",updatedAt:"2026-04-22 17:45"},
  {month:"2025-12",status:"已结束",company:"已填报",branch:"未填报",project:"未填报",updatedAt:"2025-12-24 16:20"},
  {month:"2025-11",status:"已结束",company:"已填报",branch:"已填报",project:"已填报",updatedAt:"2025-11-25 17:05"},
  {month:"2025-10",status:"已结束",company:"未填报",branch:"已填报",project:"未填报",updatedAt:"2025-10-23 15:40"}
];

function getSafetyEvalMonthlyMetric(index,offset=0){
  return (78+((index*7+offset*3)%17)+((offset%3)*0.3)).toFixed(1);
}

function getSafetyEvalMonthlyRealNameOpen(index,score){
  const opened=index % 6 === 0 ? "否" : "是";
  return {
    opened,
    openDays:opened==="是" ? 1 + (index % 9) : "-",
    score
  };
}

function getSafetyEvalMonthlyFourElements(index,score){
  return {
    mismatchCount:(index * 3) % 7,
    score
  };
}

function getSafetyEvalMonthlyVideoOpen(index,score){
  return {
    siteCameraCount:8 + ((index * 4) % 18),
    aiCameraCount:1 + ((index + 1) % 6),
    score
  };
}

function getSafetyEvalMonthlyInsurance(index,score){
  const workInjury=index % 5 === 0 ? "否" : "是";
  const safetyLiability=index % 4 === 0 ? "否" : "是";
  const allRisk=index % 6 === 0 ? "否" : "是";
  return {
    workInjury,
    workInjuryDays:workInjury==="是" ? 2 + (index % 8) : "-",
    safetyLiability,
    safetyLiabilityDays:safetyLiability==="是" ? 3 + ((index + 2) % 9) : "-",
    allRisk,
    allRiskDays:allRisk==="是" ? 1 + ((index + 4) % 10) : "-",
    score
  };
}

function getSafetyEvalMonthlyPlanning(index,score,month){
  const planned=index % 3 !== 0;
  const day=String(2 + (index % 18)).padStart(2,"0");
  return {
    productionDate:`${month}-${day}`,
    planDays:120,
    status:planned ? "已筹划" : "未筹划",
    actualDays:planned ? 95 + ((index + 3) % 36) : "-",
    score
  };
}

function renderSafetyEvalMonthlyProjectStatusTag(status){
  return projectStatusTag(status);
}

const safetyEvalMonthlyCompanyRows=getOrganizationCompanies().map((company,index)=>{
  const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(index,i));
  return {
    company,
    realNameOpen:getSafetyEvalMonthlyRealNameOpen(index,scores[0]),
    fourElements:getSafetyEvalMonthlyFourElements(index,scores[1]),
    videoOpen:getSafetyEvalMonthlyVideoOpen(index,scores[2]),
    insurance:getSafetyEvalMonthlyInsurance(index,scores[4]),
    planning:getSafetyEvalMonthlyPlanning(index,scores[5],"2026-06"),
    scores
  };
});

const safetyEvalMonthlyBranchRows=getOrganizationPairs(10).map((row,index)=>{
  const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(index+2,i));
  return {
    company:row[0],
    branch:row[1],
    realNameOpen:getSafetyEvalMonthlyRealNameOpen(index+2,scores[0]),
    fourElements:getSafetyEvalMonthlyFourElements(index+2,scores[1]),
    videoOpen:getSafetyEvalMonthlyVideoOpen(index+2,scores[2]),
    insurance:getSafetyEvalMonthlyInsurance(index+2,scores[4]),
    planning:getSafetyEvalMonthlyPlanning(index+2,scores[5],"2026-06"),
    scores
  };
});

const safetyEvalMonthlyProjectRows=[
  ["两湖隧道（东湖段）主体及附属配套工程施工2标","市政集团","上海分公司","商凌锋","在建"],
  ["武汉市轨道交通12号线科普公园站土建预埋工程","上海隧道","河南分公司","李峻","在建"],
  ["上海示范区线工程SFQSG-15标施工","上海路桥","总承包一部","赵菁","在建"],
  ["深国际上海闵行B-1厂房装修工程 EPC","上海能建","工程管理部","王晨","待建"],
  ["真如副中心地下公共车行通道工程","城市环境","环境建设公司","李敏","在建"],
  ["临港新片区综合管廊及市政道路投资建设项目","上海隧道","浙江分公司","陈启航","在建"],
  ["苏州河综合治理三期基础设施投资项目","城市环境","水务建设管道分公司","郭琳","在建"],
  ["北横通道周边配套停车及地下空间项目","运营集团","城市更新工程公司","吴越","完工"],
  ["杭金衢高速至杭绍台高速联络线工程PPP项目","上海路桥","总承包二部","周明","竣工"],
  ["新马工业园节能环保产业园基础设施配套项目","市政集团","湖南分公司","赵菁","在建"]
].map((row,index)=>{
  const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(index+4,i));
  return {
    projectName:row[0],
    company:row[1],
    branch:row[2],
    manager:row[3],
    status:row[4],
    realNameOpen:getSafetyEvalMonthlyRealNameOpen(index+4,scores[0]),
    fourElements:getSafetyEvalMonthlyFourElements(index+4,scores[1]),
    videoOpen:getSafetyEvalMonthlyVideoOpen(index+4,scores[2]),
    insurance:getSafetyEvalMonthlyInsurance(index+4,scores[4]),
    planning:getSafetyEvalMonthlyPlanning(index+4,scores[5],"2026-06"),
    scores
  };
});

function buildSafetyEvalMonthlyCompanyRows(names,seedOffset,month){
  return names.map((name,index)=>{
    const seed=index+seedOffset;
    const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(seed,i));
    return {
      company:name,
      realNameOpen:getSafetyEvalMonthlyRealNameOpen(seed,scores[0]),
      fourElements:getSafetyEvalMonthlyFourElements(seed,scores[1]),
      videoOpen:getSafetyEvalMonthlyVideoOpen(seed,scores[2]),
      insurance:getSafetyEvalMonthlyInsurance(seed,scores[4]),
      planning:getSafetyEvalMonthlyPlanning(seed,scores[5],month),
      scores
    };
  });
}

function buildSafetyEvalMonthlyBranchRows(records,seedOffset,month){
  return records.map((row,index)=>{
    const seed=index+seedOffset;
    const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(seed,i));
    return {
      company:row[0],
      branch:row[1],
      realNameOpen:getSafetyEvalMonthlyRealNameOpen(seed,scores[0]),
      fourElements:getSafetyEvalMonthlyFourElements(seed,scores[1]),
      videoOpen:getSafetyEvalMonthlyVideoOpen(seed,scores[2]),
      insurance:getSafetyEvalMonthlyInsurance(seed,scores[4]),
      planning:getSafetyEvalMonthlyPlanning(seed,scores[5],month),
      scores
    };
  });
}

function buildSafetyEvalMonthlyProjectRows(records,seedOffset,month){
  return records.map((row,index)=>{
    const seed=index+seedOffset;
    const scores=Array.from({length:10},(_,i)=>getSafetyEvalMonthlyMetric(seed,i));
    return {
      projectName:row[0],
      company:row[1],
      branch:row[2],
      manager:row[3],
      status:row[4],
      realNameOpen:getSafetyEvalMonthlyRealNameOpen(seed,scores[0]),
      fourElements:getSafetyEvalMonthlyFourElements(seed,scores[1]),
      videoOpen:getSafetyEvalMonthlyVideoOpen(seed,scores[2]),
      insurance:getSafetyEvalMonthlyInsurance(seed,scores[4]),
      planning:getSafetyEvalMonthlyPlanning(seed,scores[5],month),
      scores
    };
  });
}

const safetyEvalMonthlyRowsByMonth={
  "2026-06":{
    company:safetyEvalMonthlyCompanyRows,
    branch:safetyEvalMonthlyBranchRows,
    project:safetyEvalMonthlyProjectRows
  },
  "2026-05":{
    company:buildSafetyEvalMonthlyCompanyRows(getOrganizationCompanies().slice(0,8),12,"2026-05"),
    branch:buildSafetyEvalMonthlyBranchRows([
      ["上海隧道","河南分公司"],
      ["上海隧道","浙江分公司"],
      ["市政集团","湖南分公司"],
      ["上海路桥","总承包一部"],
      ["城市环境","上海城建水务工程有限公司"],
      ["上海能建","工程管理部"],
      ["运营集团","城市更新工程公司"]
    ],14,"2026-05"),
    project:buildSafetyEvalMonthlyProjectRows([
      ["上海市轨道交通23号线一期土建工程","上海隧道","浙江分公司","陈启航","在建"],
      ["苏州河综合治理三期基础设施项目","城市环境","水务建设管道分公司","郭琳","在建"],
      ["北横通道周边配套停车及地下空间项目","运营集团","城市更新工程公司","吴越","完工"],
      ["杭金衢高速至杭绍台高速联络线工程PPP项目","上海路桥","总承包一部","周明","竣工"],
      ["新马工业园节能环保产业园项目","市政集团","湖南分公司","赵菁","在建"],
      ["临港新片区综合管廊及市政道路项目","上海隧道","浙江分公司","李峻","在建"],
      ["上海示范区线工程SFQSG-08标施工","上海路桥","总承包二部","王晨","待建"]
    ],18,"2026-05")
  },
  "2026-04":{
    company:buildSafetyEvalMonthlyCompanyRows(getOrganizationCompanies().slice(1,7),24,"2026-04"),
    branch:buildSafetyEvalMonthlyBranchRows([
      ["市政集团","道桥公司"],
      ["上海路桥","机械施工公司"],
      ["城市环境","区域发展事业部"],
      ["城建国际","上海总部"],
      ["城建设计","总承包部"],
      ["上海能建","运维分公司"]
    ],27,"2026-04"),
    project:buildSafetyEvalMonthlyProjectRows([
      ["真如副中心地下公共车行通道工程","城市环境","环境建设公司","李敏","在建"],
      ["深国际上海闵行B-1厂房装修工程 EPC","上海能建","工程管理部","王晨","待建"],
      ["武汉市轨道交通12号线科普公园站土建预埋工程","上海隧道","河南分公司","李峻","在建"],
      ["两湖隧道东湖段附属配套工程","市政集团","上海分公司","商凌锋","停工"],
      ["海外港区市政道路综合提升工程","城建国际","香港分公司","林海","在建"],
      ["科技园区数字化管控平台配套项目","城建设计","智慧城市设计研究院","许青","终止"]
    ],30,"2026-04")
  },
  "2025-12":{
    company:buildSafetyEvalMonthlyCompanyRows(getOrganizationCompanies().slice(0,5),36,"2025-12"),
    branch:buildSafetyEvalMonthlyBranchRows([
      ["上海隧道","轨交分公司"],
      ["市政集团","道桥公司"],
      ["上海路桥","总承包三部"],
      ["城市环境","管网运维事业部"]
    ],38,"2025-12"),
    project:buildSafetyEvalMonthlyProjectRows([
      ["浦东机场联络线周边配套工程","上海隧道","轨交分公司","刘洋","在建"],
      ["嘉闵线综合管廊施工配套工程","市政集团","道桥公司","何佳","停工"],
      ["苏州河滨水空间提升项目","城市环境","管网运维事业部","郭琳","完工"],
      ["G60科创走廊道路节点改造项目","上海路桥","总承包三部","周明","竣工"]
    ],40,"2025-12")
  },
  "2025-11":{
    company:buildSafetyEvalMonthlyCompanyRows(getOrganizationCompanies().slice(3,9),44,"2025-11"),
    branch:buildSafetyEvalMonthlyBranchRows([
      ["城市环境","安装分公司"],
      ["城建国际","上海总部"],
      ["城建设计","地空设计院"],
      ["上海能建","新能源公司"],
      ["城建物资","城建物资本部"]
    ],46,"2025-11"),
    project:buildSafetyEvalMonthlyProjectRows([
      ["临港数字化安全管控平台建设项目","城建设计","智慧城市设计研究院","许青","在建"],
      ["海外港区综合提升一期工程","城建国际","香港分公司","林海","在建"],
      ["城市更新示范片区配套道路工程","城市环境","区域发展事业部","李敏","完工"],
      ["轨交机电系统改造专项工程","上海隧道","机电设备安装分公司","陈晨","待建"],
      ["设计院智慧工地数据治理项目","城建设计","地空设计院","王佳","竣工"]
    ],48,"2025-11")
  },
  "2025-10":{
    company:buildSafetyEvalMonthlyCompanyRows(getOrganizationCompanies().slice(0,4),52,"2025-10"),
    branch:buildSafetyEvalMonthlyBranchRows([
      ["市政集团","湖南分公司"],
      ["上海隧道","浙江分公司"],
      ["城建物资","城建物资本部"]
    ],54,"2025-10"),
    project:buildSafetyEvalMonthlyProjectRows([
      ["新马工业园节能环保产业园配套工程","市政集团","湖南分公司","赵菁","在建"],
      ["临港综合管廊智能化提升项目","上海隧道","浙江分公司","陈启航","在建"],
      ["建筑产业园区设备更新项目","城建物资","城建物资本部","吴越","终止"]
    ],56,"2025-10")
  }
};

function getSafetyEvalMonthlyYears(){
  return [...new Set(safetyEvalMonthlyPlans.map(plan=>plan.month.slice(0,4)))].sort((a,b)=>Number(b)-Number(a));
}

function getSafetyEvalMonthlyPlansByYear(){
  return safetyEvalMonthlyPlans.filter(plan=>plan.month.startsWith(`${safetyEvalMonthlyFillState.selectedYear}-`));
}

function setSafetyEvalMonthlyYear(year){
  safetyEvalMonthlyFillState.selectedYear=String(year);
  const plans=getSafetyEvalMonthlyPlansByYear();
  safetyEvalMonthlyFillState.activePlan=plans[0]?.month || safetyEvalMonthlyPlans[0].month;
  safetyEvalMonthlyFillState.page={company:1,branch:1,project:1};
  if(safetyEvalMonthlyFillState.legacyView)renderSafetyEvaluationMonthlyFillPage(true);
  else renderSafetyEvaluationMonthlyFillCurrentPage();
}

function setSafetyEvalMonthlyPlan(month){
  safetyEvalMonthlyFillState.activePlan=month;
  safetyEvalMonthlyFillState.selectedYear=String(month).slice(0,4);
  safetyEvalMonthlyFillState.page={company:1,branch:1,project:1};
  renderSafetyEvaluationMonthlyFillPage();
}

function setSafetyEvalMonthlyTab(tab){
  safetyEvalMonthlyFillState.activeTab=tab;
  renderSafetyEvaluationMonthlyFillPage();
}

function getSafetyEvalMonthlyTableKey(){
  if(safetyEvalMonthlyFillState.activeTab==="branch")return "safetyEvalMonthlyBranch";
  if(safetyEvalMonthlyFillState.activeTab==="project")return "safetyEvalMonthlyProject";
  return "safetyEvalMonthlyCompany";
}

function getSafetyEvalMonthlyPagedRows(){
  const rows=getSafetyEvalMonthlyActiveRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/safetyEvalMonthlyFillState.pageSize));
  const tab=safetyEvalMonthlyFillState.activeTab;
  safetyEvalMonthlyFillState.page[tab]=Math.min(Math.max(1,safetyEvalMonthlyFillState.page[tab]||1),totalPages);
  const start=(safetyEvalMonthlyFillState.page[tab]-1)*safetyEvalMonthlyFillState.pageSize;
  return rows.slice(start,start+safetyEvalMonthlyFillState.pageSize);
}

function renderSafetyEvalMonthlyGroupedHeader(tableKey){
  const columns=getVisibleColumns(tableKey);
  const top=[];
  const bottom=[];
  for(let i=0;i<columns.length;i++){
    const col=columns[i];
    if(!col.group){
      top.push(`
        <th rowspan="2" class="monthly-fill-rowspan-th" style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
          ${col.title}
        </th>
      `);
      continue;
    }
    const group=col.group;
    const groupCols=[];
    while(i<columns.length && columns[i].group===group){
      groupCols.push(columns[i]);
      i++;
    }
    i--;
    const groupWidth=groupCols.reduce((sum,item)=>sum+(Number(item.width)||120),0);
    top.push(`
      <th colspan="${groupCols.length}" class="monthly-fill-group-th" style="width:${groupWidth}px;min-width:${groupWidth}px;text-align:center">
        ${group}
      </th>
    `);
    bottom.push(groupCols.map(child=>`
      <th class="monthly-fill-child-th" style="width:${child.width}px;min-width:${child.width}px;max-width:${child.width}px;text-align:${child.align||"center"}">
        ${child.title}
      </th>
    `).join(""));
  }
  return `<tr>${top.join("")}</tr><tr>${bottom.join("")}</tr>`;
}

function renderSafetyEvalMonthlyTable(){
  const tableKey=getSafetyEvalMonthlyTableKey();
  const table=document.getElementById("safetyEvalMonthlyTable");
  const thead=document.getElementById("safetyEvalMonthlyThead");
  if(table)table.style.minWidth=getTableMinWidth(tableKey)+"px";
  if(thead)thead.innerHTML=renderSafetyEvalMonthlyGroupedHeader(tableKey);
  renderTableByColumns(tableKey,getSafetyEvalMonthlyPagedRows(),"safetyEvalMonthlyTbody");
  renderSafetyEvalMonthlyPager();
}

function renderSafetyEvalMonthlyPager(){
  const rows=getSafetyEvalMonthlyActiveRows();
  const total=rows.length;
  const totalPages=Math.max(1,Math.ceil(total/safetyEvalMonthlyFillState.pageSize));
  const tab=safetyEvalMonthlyFillState.activeTab;
  safetyEvalMonthlyFillState.page[tab]=Math.min(Math.max(1,safetyEvalMonthlyFillState.page[tab]||1),totalPages);
  const totalText=document.getElementById("safetyEvalMonthlyTotalText");
  const pageText=document.getElementById("safetyEvalMonthlyPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.textContent=`第 ${safetyEvalMonthlyFillState.page[tab]} / ${totalPages} 页`;
}

function changeSafetyEvalMonthlyPage(delta){
  const rows=getSafetyEvalMonthlyActiveRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/safetyEvalMonthlyFillState.pageSize));
  const tab=safetyEvalMonthlyFillState.activeTab;
  safetyEvalMonthlyFillState.page[tab]=Math.min(Math.max(1,(safetyEvalMonthlyFillState.page[tab]||1)+delta),totalPages);
  renderSafetyEvalMonthlyTable();
}

function changeSafetyEvalMonthlyPageSize(value){
  safetyEvalMonthlyFillState.pageSize=Number(value)||10;
  safetyEvalMonthlyFillState.page={company:1,branch:1,project:1};
  renderSafetyEvalMonthlyTable();
}

function submitSafetyEvalMonthlyFill(){
  const plan=safetyEvalMonthlyPlans.find(item=>item.month===safetyEvalMonthlyFillState.activePlan);
  if(!plan)return;
  plan[safetyEvalMonthlyFillState.activeTab]="已填报";
  const now=new Date();
  const pad=value=>String(value).padStart(2,"0");
  plan.updatedAt=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  if(safetyEvalMonthlyFillState.legacyView)renderSafetyEvaluationMonthlyFillPage(true);
  else renderSafetyEvaluationMonthlyFillCurrentPage();
  const tabLabel={company:"子公司评价数据",branch:"分公司评价数据",project:"项目评价数据"}[safetyEvalMonthlyFillState.activeTab] || "评价数据";
  showToast(`${plan.month}${tabLabel}已提交`);
}

function renderSafetyEvalMonthlyStatus(status){
  const done=status==="已填报";
  return `<span class="monthly-fill-status ${done?"done":"todo"}"><i>${done?"✓":"!"}</i>${status}</span>`;
}

function renderSafetyEvalMonthlyPlanCard(plan){
  const active=safetyEvalMonthlyFillState.activePlan===plan.month;
  return `
    <div class="monthly-plan-card ${active?"active":""}" onclick="setSafetyEvalMonthlyPlan('${plan.month}')">
      <div class="monthly-plan-card-hd">
        <strong>${plan.month}评价数据填报</strong>
        <span class="monthly-plan-badge ${plan.status==="进行中"?"running":"ended"}">${plan.status}</span>
      </div>
      <div class="monthly-plan-lines">
        <div><span>子公司评价数据</span>${renderSafetyEvalMonthlyStatus(plan.company)}</div>
        <div><span>分公司评价数据</span>${renderSafetyEvalMonthlyStatus(plan.branch)}</div>
        <div><span>项目评价数据</span>${renderSafetyEvalMonthlyStatus(plan.project)}</div>
      </div>
      <div class="monthly-plan-update">◷ 更新于 ${plan.updatedAt}</div>
    </div>
  `;
}

function getSafetyEvalMonthlyActiveRows(){
  const monthRows=safetyEvalMonthlyRowsByMonth[safetyEvalMonthlyFillState.activePlan] || safetyEvalMonthlyRowsByMonth["2026-06"];
  return monthRows[safetyEvalMonthlyFillState.activeTab] || monthRows.company || [];
}

const safetyEvalMonthlyCurrentQuery={projectName:"",company:"",branch:""};

function getSafetyEvalMonthlyCurrentProjectRows(){
  const rows=(safetyEvalMonthlyRowsByMonth[safetyEvalMonthlyFillState.activePlan] || safetyEvalMonthlyRowsByMonth["2026-06"]).project || [];
  return rows.filter(row=>{
    if(safetyEvalMonthlyCurrentQuery.projectName&&!row.projectName.includes(safetyEvalMonthlyCurrentQuery.projectName))return false;
    if(safetyEvalMonthlyCurrentQuery.company&&row.company!==safetyEvalMonthlyCurrentQuery.company)return false;
    if(safetyEvalMonthlyCurrentQuery.branch&&row.branch!==safetyEvalMonthlyCurrentQuery.branch)return false;
    return true;
  });
}

function getSafetyEvalMonthlyCurrentOptions(){
  const rows=(safetyEvalMonthlyRowsByMonth[safetyEvalMonthlyFillState.activePlan] || safetyEvalMonthlyRowsByMonth["2026-06"]).project || [];
  const companies=[...new Set(rows.map(row=>row.company))];
  const branches=[...new Set(rows.filter(row=>!safetyEvalMonthlyCurrentQuery.company||row.company===safetyEvalMonthlyCurrentQuery.company).map(row=>row.branch))];
  return {companies,branches};
}

function renderSafetyEvalMonthlyCurrentPlanCard(plan){
  const rows=safetyEvalMonthlyRowsByMonth[plan.month] || {company:[],branch:[],project:[]};
  const active=safetyEvalMonthlyFillState.activePlan===plan.month;
  return `
    <div class="monthly-plan-card ${active?"active":""}" onclick="setSafetyEvalMonthlyCurrentPlan('${plan.month}')">
      <div class="monthly-plan-card-hd">
        <strong>${plan.month}评价数据填报</strong>
        <span class="monthly-plan-badge ${plan.status==="进行中"?"running":"ended"}">${plan.status}</span>
      </div>
      <div class="monthly-plan-lines monthly-plan-count-lines">
        <div><span>评价子公司数</span><strong>${rows.company.length}</strong></div>
        <div><span>评价分公司数</span><strong>${rows.branch.length}</strong></div>
        <div><span>评价项目数</span><strong>${rows.project.length}</strong></div>
      </div>
      <div class="monthly-plan-update">◷ 更新于 ${plan.updatedAt}</div>
    </div>
  `;
}

function setSafetyEvalMonthlyCurrentYear(year){
  safetyEvalMonthlyFillState.selectedYear=String(year);
  const plans=getSafetyEvalMonthlyPlansByYear();
  safetyEvalMonthlyFillState.activePlan=plans[0]?.month || safetyEvalMonthlyPlans[0].month;
  safetyEvalMonthlyFillState.page.project=1;
  safetyEvalMonthlyTreeExpandedCompanies.clear();
  safetyEvalMonthlyTreeExpandedBranches.clear();
  safetyEvalMonthlyTreeExpansionInitialized=false;
  Object.assign(safetyEvalMonthlyCurrentQuery,{projectName:"",company:"",branch:""});
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function setSafetyEvalMonthlyCurrentPlan(month){
  safetyEvalMonthlyFillState.activePlan=month;
  safetyEvalMonthlyFillState.selectedYear=String(month).slice(0,4);
  safetyEvalMonthlyFillState.page.project=1;
  safetyEvalMonthlyTreeExpandedCompanies.clear();
  safetyEvalMonthlyTreeExpandedBranches.clear();
  safetyEvalMonthlyTreeExpansionInitialized=false;
  Object.assign(safetyEvalMonthlyCurrentQuery,{projectName:"",company:"",branch:""});
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function querySafetyEvalMonthlyCurrent(){
  safetyEvalMonthlyCurrentQuery.projectName=document.getElementById("semProjectName")?.value.trim() || "";
  safetyEvalMonthlyCurrentQuery.company=document.getElementById("semCompany")?.value || "";
  safetyEvalMonthlyCurrentQuery.branch=document.getElementById("semBranch")?.value || "";
  safetyEvalMonthlyFillState.page.project=1;
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function resetSafetyEvalMonthlyCurrent(){
  Object.assign(safetyEvalMonthlyCurrentQuery,{projectName:"",company:"",branch:""});
  safetyEvalMonthlyFillState.page.project=1;
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function changeSafetyEvalMonthlyCurrentPage(delta){
  const totalPages=Math.max(1,Math.ceil(getSafetyEvalMonthlyCurrentProjectRows().length/safetyEvalMonthlyFillState.pageSize));
  safetyEvalMonthlyFillState.page.project=Math.min(totalPages,Math.max(1,(safetyEvalMonthlyFillState.page.project||1)+delta));
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function changeSafetyEvalMonthlyCurrentPageSize(value){
  safetyEvalMonthlyFillState.pageSize=Number(value)||10;
  safetyEvalMonthlyFillState.page.project=1;
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

const safetyEvalMonthlyTreeExpandedCompanies=new Set();
const safetyEvalMonthlyTreeExpandedBranches=new Set();
const safetyEvalMonthlyTreeValues={};
let safetyEvalMonthlyTreeInputTimer=null;
let safetyEvalMonthlyTreeExpansionInitialized=false;
const safetyEvalMonthlyTreeInputKeys=["fourMismatch","injury","pipelineAccident","fireAccident","lateReport","concealedReport","publicOpinion","opinionConceal","administrativePenalty","minorReport","minorApproved","laborDispute","honorNational","honorProvincial","honorDistrict"];
const safetyEvalMonthlyTreeFixedKeys=["sequence","company","branch","projectName"];

tableColumnDefinitions.safetyEvalMonthlyTree=[
  {key:"sequence",title:"序号",width:92,align:"center",kind:"entity",render:()=>""},
  {key:"company",title:"子公司",width:150,align:"center",kind:"entity",render:()=>""},
  {key:"branch",title:"分公司",width:160,align:"center",kind:"entity",render:()=>""},
  {key:"projectName",title:"项目名称",width:300,align:"left",kind:"entity",render:()=>""},
  {key:"fourMismatch",title:"四要素不一致人数",group:"实名四要素一致性",width:150,align:"center",kind:"input",render:()=>""},
  {key:"fourScore",title:"得分",group:"实名四要素一致性",width:100,align:"center",kind:"score",scoreKey:"fourScore",render:()=>""},
  {key:"injury",title:"人身伤亡事故",group:"人身伤亡事故",width:130,align:"center",kind:"input",render:()=>""},
  {key:"pipelineAccident",title:"重大管线事故",group:"人身伤亡事故",width:130,align:"center",kind:"input",render:()=>""},
  {key:"fireAccident",title:"消防事故",group:"人身伤亡事故",width:110,align:"center",kind:"input",render:()=>""},
  {key:"accidentScore",title:"得分",group:"人身伤亡事故",width:100,align:"center",kind:"score",scoreKey:"accidentScore",render:()=>""},
  {key:"lateReport",title:"迟报数",group:"事故迟报瞒报",width:100,align:"center",kind:"input",render:()=>""},
  {key:"concealedReport",title:"瞒报数",group:"事故迟报瞒报",width:100,align:"center",kind:"input",render:()=>""},
  {key:"reportScore",title:"得分",group:"事故迟报瞒报",width:100,align:"center",kind:"score",scoreKey:"reportScore",render:()=>""},
  {key:"publicOpinion",title:"舆情事件数",group:"重大舆情事件",width:120,align:"center",kind:"input",render:()=>""},
  {key:"opinionConceal",title:"瞒报数",group:"重大舆情事件",width:100,align:"center",kind:"input",render:()=>""},
  {key:"opinionScore",title:"得分",group:"重大舆情事件",width:100,align:"center",kind:"score",scoreKey:"opinionScore",render:()=>""},
  {key:"administrativePenalty",title:"行政处罚数",group:"行政处罚记录",width:120,align:"center",kind:"input",render:()=>""},
  {key:"penaltyScore",title:"得分",group:"行政处罚记录",width:100,align:"center",kind:"score",scoreKey:"penaltyScore",render:()=>""},
  {key:"minorReport",title:"轻微事故上报数",group:"轻微事故上报",width:140,align:"center",kind:"input",render:()=>""},
  {key:"minorApproved",title:"审核通过数",group:"轻微事故上报",width:120,align:"center",kind:"input",render:()=>""},
  {key:"minorScore",title:"得分",group:"轻微事故上报",width:100,align:"center",kind:"score",scoreKey:"minorScore",render:()=>""},
  {key:"laborDispute",title:"工伤信访数",group:"工伤信访维稳",width:120,align:"center",kind:"input",render:()=>""},
  {key:"laborScore",title:"得分",group:"工伤信访维稳",width:100,align:"center",kind:"score",scoreKey:"laborScore",render:()=>""},
  {key:"honorNational",title:"国际级和国家级",group:"荣誉表彰奖励",width:140,align:"center",kind:"input",render:()=>""},
  {key:"honorProvincial",title:"省部级",group:"荣誉表彰奖励",width:100,align:"center",kind:"input",render:()=>""},
  {key:"honorDistrict",title:"县区级和企业级",group:"荣誉表彰奖励",width:150,align:"center",kind:"input",render:()=>""},
  {key:"honorScore",title:"得分",group:"荣誉表彰奖励",width:100,align:"center",kind:"score",scoreKey:"honorScore",render:()=>""}
];

function getSafetyEvalMonthlyTreeVisibleColumns(){
  const definitions=tableColumnDefinitions.safetyEvalMonthlyTree;
  const config=getColumnConfig("safetyEvalMonthlyTree");
  const fixed=safetyEvalMonthlyTreeFixedKeys.map(key=>{
    const definition=definitions.find(item=>item.key===key);
    const saved=config.find(item=>item.key===key);
    return {...definition,...saved,visible:true};
  });
  const optional=getVisibleColumns("safetyEvalMonthlyTree").filter(item=>!safetyEvalMonthlyTreeFixedKeys.includes(item.key));
  return [...fixed,...optional];
}

function openSafetyEvalMonthlyTreeColumnSetting(){
  openColumnSetting("safetyEvalMonthlyTree","renderSafetyEvaluationMonthlyFillCurrentPage");
  safetyEvalMonthlyTreeFixedKeys.forEach(key=>{
    const row=document.querySelector(`#columnSettingTbody tr[data-key="${key}"]`);
    if(!row)return;
    const visible=row.querySelector(".col-visible");
    const width=row.querySelector(".col-width");
    const order=row.querySelector(".col-order");
    if(visible){visible.checked=true;visible.disabled=true;}
    if(width)width.disabled=true;
    if(order)order.disabled=true;
    row.querySelectorAll(".mini-btn").forEach(button=>button.disabled=true);
    row.title="基础冻结列始终显示并固定在表格左侧";
  });
}

function getSafetyEvalMonthlyTreeProjectValues(projectName){
  const storageKey=`${safetyEvalMonthlyFillState.activePlan}|${projectName}`;
  if(!safetyEvalMonthlyTreeValues[storageKey]){
    safetyEvalMonthlyTreeValues[storageKey]=Object.fromEntries(safetyEvalMonthlyTreeInputKeys.map(key=>[key,0]));
  }
  return safetyEvalMonthlyTreeValues[storageKey];
}

function isSafetyEvalMonthlyTreeEditable(){
  return safetyEvalMonthlyPlans.find(plan=>plan.month===safetyEvalMonthlyFillState.activePlan)?.status==="进行中";
}

function calculateSafetyEvalMonthlyTreeScores(values){
  return {
    fourScore:Math.max(0,100-values.fourMismatch*10),
    accidentScore:Math.max(0,100-values.injury*100-values.pipelineAccident*50-values.fireAccident*50),
    reportScore:Math.max(0,100-values.concealedReport*100-values.lateReport*50),
    opinionScore:Math.max(0,100-values.publicOpinion*10),
    penaltyScore:Math.max(0,100-values.administrativePenalty*10),
    minorScore:60+values.minorReport*5+values.minorApproved*30,
    laborScore:Math.max(0,100-values.laborDispute*10),
    honorScore:100+values.honorNational*40+values.honorProvincial*30+values.honorDistrict*20
  };
}

function getSafetyEvalMonthlyTreeAverage(rows,scoreKey){
  if(!rows.length)return 0;
  return rows.reduce((sum,row)=>sum+calculateSafetyEvalMonthlyTreeScores(getSafetyEvalMonthlyTreeProjectValues(row.projectName))[scoreKey],0)/rows.length;
}

function formatSafetyEvalMonthlyTreeScore(value){
  const number=Number(value)||0;
  return Number.isInteger(number)?String(number):number.toFixed(1);
}

function updateSafetyEvalMonthlyTreeInput(projectName,key,value){
  const values=getSafetyEvalMonthlyTreeProjectValues(decodeURIComponent(projectName));
  values[key]=Math.max(0,Number(value)||0);
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function scheduleSafetyEvalMonthlyTreeInput(projectName,key,value){
  clearTimeout(safetyEvalMonthlyTreeInputTimer);
  safetyEvalMonthlyTreeInputTimer=setTimeout(()=>updateSafetyEvalMonthlyTreeInput(projectName,key,value),180);
}

function toggleSafetyEvalMonthlyTreeCompany(encodedName){
  const name=decodeURIComponent(encodedName);
  if(safetyEvalMonthlyTreeExpandedCompanies.has(name))safetyEvalMonthlyTreeExpandedCompanies.delete(name);
  else safetyEvalMonthlyTreeExpandedCompanies.add(name);
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

function toggleSafetyEvalMonthlyTreeBranch(encodedKey){
  const key=decodeURIComponent(encodedKey);
  if(safetyEvalMonthlyTreeExpandedBranches.has(key))safetyEvalMonthlyTreeExpandedBranches.delete(key);
  else safetyEvalMonthlyTreeExpandedBranches.add(key);
  renderSafetyEvaluationMonthlyFillCurrentPage();
}

document.addEventListener("click",event=>{
  const companyToggle=event.target.closest?.("[data-monthly-tree-company]");
  if(companyToggle){
    event.preventDefault();
    toggleSafetyEvalMonthlyTreeCompany(companyToggle.dataset.monthlyTreeCompany);
    return;
  }
  const branchToggle=event.target.closest?.("[data-monthly-tree-branch]");
  if(branchToggle){
    event.preventDefault();
    toggleSafetyEvalMonthlyTreeBranch(branchToggle.dataset.monthlyTreeBranch);
  }
});

function renderSafetyEvalMonthlyTreeInput(projectName,key){
  const values=getSafetyEvalMonthlyTreeProjectValues(projectName);
  if(!isSafetyEvalMonthlyTreeEditable())return `<span class="monthly-tree-readonly-value">${values[key]}</span>`;
  return `<input class="monthly-tree-input" type="number" min="0" step="1" value="${values[key]}" aria-label="${key}" oninput="scheduleSafetyEvalMonthlyTreeInput('${encodeURIComponent(projectName)}','${key}',this.value)" onchange="updateSafetyEvalMonthlyTreeInput('${encodeURIComponent(projectName)}','${key}',this.value)"/>`;
}

function renderSafetyEvalMonthlyTreeMetricCells(type,rows,project){
  const scores=type==="project"?calculateSafetyEvalMonthlyTreeScores(getSafetyEvalMonthlyTreeProjectValues(project.projectName)):null;
  return getSafetyEvalMonthlyTreeVisibleColumns().filter(column=>column.kind!=="entity").map(column=>{
    const style=`width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"center"}`;
    if(column.kind==="input"){
      return type==="project"
        ?`<td style="${style}">${renderSafetyEvalMonthlyTreeInput(project.projectName,column.key)}</td>`
        :`<td class="monthly-tree-disabled-cell" style="${style}">-</td>`;
    }
    const value=type==="project"?scores[column.scoreKey]:getSafetyEvalMonthlyTreeAverage(rows,column.scoreKey);
    return `<td class="monthly-tree-score-cell" style="${style}">${formatSafetyEvalMonthlyTreeScore(value)}</td>`;
  }).join("");
}

function renderSafetyEvalMonthlyTreeHeader(){
  const columns=getSafetyEvalMonthlyTreeVisibleColumns();
  const firstRow=[];
  const secondRow=[];
  for(let index=0;index<columns.length;index++){
    const column=columns[index];
    if(column.kind==="entity"){
      firstRow.push(`<th rowspan="2" data-column-key="${column.key}" style="width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"center"}">${column.title}</th>`);
      continue;
    }
    const group=column.group||column.title;
    const groupColumns=[column];
    while(index+1<columns.length&&columns[index+1].kind!=="entity"&&(columns[index+1].group||columns[index+1].title)===group){
      groupColumns.push(columns[++index]);
    }
    const width=groupColumns.reduce((sum,item)=>sum+(Number(item.width)||100),0);
    firstRow.push(`<th colspan="${groupColumns.length}" style="width:${width}px;min-width:${width}px">${group}</th>`);
    secondRow.push(groupColumns.map(item=>`<th style="width:${item.width}px;min-width:${item.width}px;max-width:${item.width}px;text-align:${item.align||"center"}">${item.title}</th>`).join(""));
  }
  return `<tr>${firstRow.join("")}</tr><tr>${secondRow.join("")}</tr>`;
}

function renderSafetyEvalMonthlyTreeTable(projectRows){
  const companies=[];
  projectRows.forEach(project=>{
    let company=companies.find(item=>item.name===project.company);
    if(!company){company={name:project.company,branches:[]};companies.push(company);}
    let branch=company.branches.find(item=>item.name===project.branch);
    if(!branch){branch={name:project.branch,projects:[]};company.branches.push(branch);}
    branch.projects.push(project);
  });
  if(!safetyEvalMonthlyTreeExpansionInitialized){
    if(companies.length)safetyEvalMonthlyTreeExpandedCompanies.add(companies[0].name);
    if(companies[0]?.branches.length)safetyEvalMonthlyTreeExpandedBranches.add(`${companies[0].name}|${companies[0].branches[0].name}`);
    safetyEvalMonthlyTreeExpansionInitialized=true;
  }
  const body=[];
  companies.forEach((company,companyIndex)=>{
    const companyProjects=company.branches.flatMap(branch=>branch.projects);
    const companyOpen=safetyEvalMonthlyTreeExpandedCompanies.has(company.name);
    body.push(`<tr class="monthly-tree-company-row"><td><button class="monthly-tree-toggle" data-monthly-tree-company="${encodeURIComponent(company.name)}">${companyOpen?"▼":"▶"}</button>${companyIndex+1}</td><td>${company.name}</td><td>-</td><td>-</td>${renderSafetyEvalMonthlyTreeMetricCells("company",companyProjects,null)}</tr>`);
    if(!companyOpen)return;
    company.branches.forEach((branch,branchIndex)=>{
      const branchKey=`${company.name}|${branch.name}`;
      const branchOpen=safetyEvalMonthlyTreeExpandedBranches.has(branchKey);
      body.push(`<tr class="monthly-tree-branch-row"><td><button class="monthly-tree-toggle" data-monthly-tree-branch="${encodeURIComponent(branchKey)}">${branchOpen?"▼":"▶"}</button>${companyIndex+1}.${branchIndex+1}</td><td>-</td><td>${branch.name}</td><td>-</td>${renderSafetyEvalMonthlyTreeMetricCells("branch",branch.projects,null)}</tr>`);
      if(!branchOpen)return;
      branch.projects.forEach((project,projectIndex)=>{
        body.push(`<tr class="monthly-tree-project-row"><td>${companyIndex+1}.${branchIndex+1}.${projectIndex+1}</td><td>-</td><td>-</td><td class="monthly-tree-project-name" title="${escapeAttr(project.projectName)}">${project.projectName}</td>${renderSafetyEvalMonthlyTreeMetricCells("project",[project],project)}</tr>`);
      });
    });
  });
  return `
    <table class="monthly-fill-tree-table" style="min-width:${getSafetyEvalMonthlyTreeVisibleColumns().reduce((sum,column)=>sum+(Number(column.width)||100),0)}px">
      <thead>${renderSafetyEvalMonthlyTreeHeader()}</thead>
      <tbody>${body.join("")||`<tr><td colspan="${getSafetyEvalMonthlyTreeVisibleColumns().length}" class="safety-eval-empty-rank">暂无数据</td></tr>`}</tbody>
    </table>
  `;
}

function renderSafetyEvaluationMonthlyFillCurrentPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  safetyEvalMonthlyFillState.legacyView=false;
  safetyEvalMonthlyFillState.activeTab="project";
  const currentYear=String(new Date().getFullYear());
  if(!safetyEvalMonthlyFillState.selectedYear)safetyEvalMonthlyFillState.selectedYear=currentYear;
  const years=getSafetyEvalMonthlyYears();
  const visiblePlans=getSafetyEvalMonthlyPlansByYear();
  if(!visiblePlans.some(plan=>plan.month===safetyEvalMonthlyFillState.activePlan)&&visiblePlans.length)safetyEvalMonthlyFillState.activePlan=visiblePlans[0].month;
  const activePlan=safetyEvalMonthlyPlans.find(plan=>plan.month===safetyEvalMonthlyFillState.activePlan)||safetyEvalMonthlyPlans[0];
  const options=getSafetyEvalMonthlyCurrentOptions();
  const allRows=getSafetyEvalMonthlyCurrentProjectRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalMonthlyFillState.pageSize));
  safetyEvalMonthlyFillState.page.project=Math.min(totalPages,Math.max(1,safetyEvalMonthlyFillState.page.project||1));
  const start=(safetyEvalMonthlyFillState.page.project-1)*safetyEvalMonthlyFillState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalMonthlyFillState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row"><div class="module-title">安全评价 / 月度评价填报</div></div>
    <div class="base-auth-layout safety-monthly-fill-layout safety-monthly-fill-current-layout">
      <section class="org-tree-panel monthly-plan-panel">
        <div class="org-tree-hd">
          <div class="card-title">月度计划</div>
          <select class="monthly-plan-year-select" onchange="setSafetyEvalMonthlyCurrentYear(this.value)">
            ${years.map(year=>`<option value="${year}" ${year===safetyEvalMonthlyFillState.selectedYear?"selected":""}>${year}年</option>`).join("")}
          </select>
        </div>
        <div class="monthly-plan-list">${visiblePlans.map(renderSafetyEvalMonthlyCurrentPlanCard).join("")}</div>
      </section>
      <section class="org-user-panel monthly-fill-panel monthly-fill-current-panel">
        ${renderUnifiedQueryCard(`
          <div class="form-item"><label>项目名称</label><input class="input" id="semProjectName" value="${escapeAttr(safetyEvalMonthlyCurrentQuery.projectName)}" placeholder="请输入项目名称"/></div>
          <div class="form-item"><label>子公司</label><select class="select" id="semCompany"><option value="">全部</option>${options.companies.map(value=>`<option value="${value}" ${value===safetyEvalMonthlyCurrentQuery.company?"selected":""}>${value}</option>`).join("")}</select></div>
          <div class="form-item"><label>分公司</label><select class="select" id="semBranch"><option value="">全部</option>${options.branches.map(value=>`<option value="${value}" ${value===safetyEvalMonthlyCurrentQuery.branch?"selected":""}>${value}</option>`).join("")}</select></div>
        `,{title:"查询条件",queryFn:"querySafetyEvalMonthlyCurrent()",resetFn:"resetSafetyEvalMonthlyCurrent()",gridClass:"search-grid"})}
        <section class="card table-card construction-project-table-card monthly-fill-table-card monthly-fill-current-table-card">
          <div class="card-hd">
            <div class="card-title">评价数据</div>
            <div class="actions">
              <button class="btn" onclick="renderSafetyEvaluationMonthlyFillCurrentPage()">刷新</button>
              <button class="btn" onclick="showToast('导出成功：${activePlan.month}月项目评价数据.xlsx')">导出</button>
              <button class="btn primary" onclick="submitSafetyEvalMonthlyFill()" ${activePlan.status!=="进行中"?"disabled":""}>提交</button>
              <button class="column-setting-icon-btn" title="列设置" onclick="openSafetyEvalMonthlyTreeColumnSetting()">⚙</button>
            </div>
          </div>
          <div class="table-wrap roster-table-wrap">
            ${renderSafetyEvalMonthlyTreeTable(pageRows)}
          </div>
          <div class="pagination">
            <span>共 ${allRows.length} 条</span>
            <div class="pager">
              <button class="btn mini" onclick="changeSafetyEvalMonthlyCurrentPage(-1)" ${safetyEvalMonthlyFillState.page.project<=1?"disabled":""}>上一页</button>
              <b>第 ${safetyEvalMonthlyFillState.page.project} / ${totalPages} 页</b>
              <button class="btn mini" onclick="changeSafetyEvalMonthlyCurrentPage(1)" ${safetyEvalMonthlyFillState.page.project>=totalPages?"disabled":""}>下一页</button>
              <select class="select mini-select" onchange="changeSafetyEvalMonthlyCurrentPageSize(this.value)">${[10,20,50].map(size=>`<option value="${size}" ${size===safetyEvalMonthlyFillState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>
            </div>
          </div>
        </section>
      </section>
    </div>
  `;
}

function renderSafetyEvaluationMonthlyFillPage(legacyView=safetyEvalMonthlyFillState.legacyView||false){
  detailPage.style.display="none";
  listPage.style.display="flex";
  safetyEvalMonthlyFillState.legacyView=Boolean(legacyView);
  const currentYear=String(new Date().getFullYear());
  if(!safetyEvalMonthlyFillState.selectedYear)safetyEvalMonthlyFillState.selectedYear=currentYear;
  const years=getSafetyEvalMonthlyYears();
  const visiblePlans=getSafetyEvalMonthlyPlansByYear();
  if(!visiblePlans.some(plan=>plan.month===safetyEvalMonthlyFillState.activePlan) && visiblePlans.length){
    safetyEvalMonthlyFillState.activePlan=visiblePlans[0].month;
  }
  const activePlan=safetyEvalMonthlyPlans.find(plan=>plan.month===safetyEvalMonthlyFillState.activePlan) || safetyEvalMonthlyPlans[0];
  const tabs=[["company","子公司评价数据"],["branch","分公司评价数据"],["project","项目评价数据"]];
  const tableKey=getSafetyEvalMonthlyTableKey();
  const tableTitle=tabs.find(item=>item[0]===safetyEvalMonthlyFillState.activeTab)?.[1] || "评价数据";
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 月度评价填报${safetyEvalMonthlyFillState.legacyView?"（禁）":""}</div>
    </div>
    <div class="base-auth-layout safety-monthly-fill-layout">
      <section class="org-tree-panel monthly-plan-panel">
        <div class="org-tree-hd">
          <div class="card-title">月度计划</div>
          <select class="monthly-plan-year-select" onchange="setSafetyEvalMonthlyYear(this.value)">
            ${years.map(year=>`<option value="${year}" ${year===safetyEvalMonthlyFillState.selectedYear?"selected":""}>${year}年</option>`).join("")}
          </select>
        </div>
        <div class="monthly-plan-list">
          ${visiblePlans.map(renderSafetyEvalMonthlyPlanCard).join("")}
        </div>
      </section>
      <section class="org-user-panel monthly-fill-panel">
        <div class="monthly-fill-card">
          <div class="monthly-fill-topline">
            <div class="monthly-fill-tabs">
              ${tabs.map(([key,label])=>`<button class="${safetyEvalMonthlyFillState.activeTab===key?"active":""}" onclick="setSafetyEvalMonthlyTab('${key}')">${label}</button>`).join("")}
            </div>
            <button class="btn primary monthly-submit-btn" onclick="submitSafetyEvalMonthlyFill()">提交</button>
          </div>
          <section class="card table-card construction-project-table-card monthly-fill-table-card">
            <div class="card-hd">
              <div class="card-title">${tableTitle}</div>
              <div class="actions">
                <button class="btn" onclick="renderSafetyEvalMonthlyTable()">刷新</button>
                <button class="btn primary" onclick="showToast('导出成功：${activePlan.month}月${tableTitle}.xlsx')">导出</button>
                <button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('${tableKey}','renderSafetyEvaluationMonthlyFillPage')">⚙</button>
              </div>
            </div>
            <div class="table-wrap roster-table-wrap">
              <table id="safetyEvalMonthlyTable" class="monthly-fill-group-table" style="min-width:${getTableMinWidth(tableKey)}px">
                <thead id="safetyEvalMonthlyThead">${renderSafetyEvalMonthlyGroupedHeader(tableKey)}</thead>
                <tbody id="safetyEvalMonthlyTbody"></tbody>
              </table>
            </div>
            <div class="pagination">
              <span id="safetyEvalMonthlyTotalText">共 0 条</span>
              <div class="pager">
                <button class="btn mini" onclick="changeSafetyEvalMonthlyPage(-1)">上一页</button>
                <b id="safetyEvalMonthlyPageText">第 1 / 1 页</b>
                <button class="btn mini" onclick="changeSafetyEvalMonthlyPage(1)">下一页</button>
                <select id="safetyEvalMonthlyPageSize" class="select mini-select" onchange="changeSafetyEvalMonthlyPageSize(this.value)">
                  <option value="10" ${safetyEvalMonthlyFillState.pageSize===10?"selected":""}>10条/页</option>
                  <option value="20" ${safetyEvalMonthlyFillState.pageSize===20?"selected":""}>20条/页</option>
                  <option value="50" ${safetyEvalMonthlyFillState.pageSize===50?"selected":""}>50条/页</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  `;
  renderSafetyEvalMonthlyTable();
}

window.renderSafetyEvaluationMonthlyFillPage=renderSafetyEvaluationMonthlyFillPage;
window.renderSafetyEvaluationMonthlyFillCurrentPage=renderSafetyEvaluationMonthlyFillCurrentPage;

const safetyEvalIndicatorOptions={
  categories:["事故指标","行为指标","管理指标","风险指标","现场指标","综合指标"],
  types:["评价因子","评价维度"],
  sources:["实名制系统","视频监控系统","隐患管理系统","分包管理系统","经济管理系统","保险管理系统","手工填报"],
  status:["启用","停用"]
};

const safetyEvalIndicatorRows=[
  ["IND-001","实名系统开通","信息保障","自动指标","实名制系统","是","启用","新开项目安全纳管后三天内开通实名制系统。","2026-06-01 09:30","2026-06-28 15:12"],
  ["IND-002","实名四要素一致性","信息保障","规则指标","实名制系统","是","启用","校验姓名、三级教育、合同、操作证四类关键要素一致性。","2026-06-01 09:30","2026-06-28 15:12"],
  ["IND-003","监控视频在线","信息保障","自动指标","视频监控系统","是","启用","统计项目监控设备在线情况。","2026-06-02 10:20","2026-06-29 11:05"],
  ["IND-004","隐患整改闭环","现场指标","规则指标","隐患管理系统","是","启用","按期完成隐患整改并闭环验收。","2026-06-03 14:10","2026-06-29 18:22"],
  ["IND-005","重复隐患发生","风险指标","规则指标","隐患管理系统","是","启用","识别同类隐患重复发生次数。","2026-06-03 14:10","2026-06-29 18:22"],
  ["IND-006","安全每日监督","行为指标","手工指标","手工填报","是","启用","项目安全每日监督记录完整性。","2026-06-04 08:50","2026-06-25 09:44"],
  ["IND-007","关键岗位在岗","现场指标","自动指标","分包管理系统","是","启用","现场负责人、专职安全员等关键岗位到岗情况。","2026-06-04 08:50","2026-06-30 10:02"],
  ["IND-008","工人工资核验","管理指标","规则指标","分包管理系统","是","启用","核验农民工工资表上传及一致性。","2026-06-05 16:30","2026-06-29 16:03"],
  ["IND-009","技术方案审批","管理指标","规则指标","经济管理系统","是","启用","重大技术方案审批是否按要求完成。","2026-06-06 13:15","2026-06-27 14:18"],
  ["IND-010","保险集中管理","综合指标","自动指标","保险管理系统","否","停用","保险集中管理数据采集指标，当前暂停参与评分。","2026-06-07 10:00","2026-06-20 10:00"],
  ["IND-011","保险理赔止损","综合指标","评价维度","保险管理系统","是","启用","结合理赔流程、止损结果进行综合评价。","2026-06-08 11:25","2026-06-30 17:10"],
  ["IND-012","重大舆情事件","事故指标","手工指标","手工填报","否","停用","重大舆情事件人工确认和记录。","2026-06-09 12:10","2026-06-22 13:36"]
].map((row,index)=>({
  id:index+1,
  code:row[0],
  name:row[1],
  category:row[2],
  type:row[3],
  source:row[4],
  score:row[5],
  status:row[6],
  remark:row[7],
  createTime:row[8],
  updateTime:row[9]
}));

const safetyEvalIndicatorState={name:"",code:"",category:"",type:"",source:"",score:"",status:"",statKey:"all",page:1,pageSize:10};

tableColumnDefinitions.safetyEvalIndicator=[
  {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalIndicatorState.page-1)*safetyEvalIndicatorState.pageSize+index+1},
  {key:"code",title:"指标编码",width:120,align:"left",render:row=>row.code},
  {key:"name",title:"指标名称",width:180,align:"left",render:row=>`<a class="link" onclick="openSafetyEvalIndicatorDetailModal(${row.id})">${row.name}</a>`},
  {key:"category",title:"指标分类",width:120,align:"center",render:row=>row.category},
  {key:"type",title:"指标类型",width:120,align:"center",render:row=>tag(row.type,row.type==="自动指标"?"blue":row.type==="手工指标"?"orange":row.type==="规则指标"?"green":"purple")},
  {key:"source",title:"数据来源",width:150,align:"left",render:row=>row.source},
  {key:"score",title:"是否参与评分",width:130,align:"center",render:row=>tag(row.score,row.score==="是"?"green":"gray")},
  {key:"status",title:"状态",width:100,align:"center",render:row=>tag(row.status,row.status==="启用"?"green":"red")},
  {key:"remark",title:"指标说明",width:260,align:"left",render:row=>`<span class="indicator-remark" title="${escapeAttr(row.remark)}">${row.remark}</span>`},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"updateTime",title:"更新时间",width:170,align:"center",render:row=>row.updateTime},
  {key:"operation",title:"操作",width:220,align:"center",render:row=>`
    <a class="link" onclick="openSafetyEvalIndicatorEditModal(${row.id})">编辑</a>
    <a class="link" onclick="showToast('配置规则：${row.name}')">规则</a>
    <a class="link" onclick="showToast('配置权重：${row.name}')">权重</a>
    <a class="link" onclick="toggleSafetyEvalIndicatorStatus(${row.id})">${row.status==="启用"?"停用":"启用"}</a>
  `}
];
try{localStorage.removeItem(getColumnStorageKey("safetyEvalIndicator"));}catch(e){}

function getSafetyEvalIndicatorFilteredRows(){
  const s=safetyEvalIndicatorState;
  return safetyEvalIndicatorRows.filter(row=>{
    if(s.statKey==="auto"&&row.type!=="自动指标")return false;
    if(s.statKey==="manual"&&row.type!=="手工指标")return false;
    if(s.statKey==="rule"&&row.type!=="规则指标")return false;
    if(s.statKey==="enabled"&&row.status!=="启用")return false;
    if(s.statKey==="disabled"&&row.status!=="停用")return false;
    if(s.name&&!row.name.includes(s.name))return false;
    if(s.code&&!row.code.includes(s.code))return false;
    if(s.category&&row.category!==s.category)return false;
    if(s.type&&row.type!==s.type)return false;
    if(s.source&&row.source!==s.source)return false;
    if(s.score&&row.score!==s.score)return false;
    if(s.status&&row.status!==s.status)return false;
    return true;
  });
}

function renderSafetyEvalIndicatorOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function querySafetyEvalIndicators(){
  safetyEvalIndicatorState.name=document.getElementById("seiName")?.value.trim() || "";
  safetyEvalIndicatorState.code=document.getElementById("seiCode")?.value.trim() || "";
  safetyEvalIndicatorState.category=document.getElementById("seiCategory")?.value || "";
  safetyEvalIndicatorState.type=document.getElementById("seiType")?.value || "";
  safetyEvalIndicatorState.source=document.getElementById("seiSource")?.value || "";
  safetyEvalIndicatorState.score=document.getElementById("seiScore")?.value || "";
  safetyEvalIndicatorState.status=document.getElementById("seiStatus")?.value || "";
  safetyEvalIndicatorState.page=1;
  renderSafetyEvaluationIndicatorPage();
}

function resetSafetyEvalIndicators(){
  Object.assign(safetyEvalIndicatorState,{name:"",code:"",category:"",type:"",source:"",score:"",status:"",statKey:"all",page:1});
  renderSafetyEvaluationIndicatorPage();
}

function setSafetyEvalIndicatorStat(key){
  safetyEvalIndicatorState.statKey=safetyEvalIndicatorState.statKey===key&&key!=="all"?"all":key;
  safetyEvalIndicatorState.page=1;
  renderSafetyEvaluationIndicatorPage();
}

function changeSafetyEvalIndicatorPage(dir){
  const total=getSafetyEvalIndicatorFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalIndicatorState.pageSize));
  safetyEvalIndicatorState.page=Math.min(max,Math.max(1,safetyEvalIndicatorState.page+dir));
  renderSafetyEvaluationIndicatorPage();
}

function toggleSafetyEvalIndicatorStatus(id){
  const row=safetyEvalIndicatorRows.find(item=>item.id===Number(id));
  if(row){
    row.status=row.status==="启用"?"停用":"启用";
    showToast(`已${row.status}：${row.name}`);
  }
  renderSafetyEvaluationIndicatorPage();
}

function renderSafetyEvalIndicatorStats(){
  const total=safetyEvalIndicatorRows.length;
  const auto=safetyEvalIndicatorRows.filter(row=>row.type==="自动指标").length;
  const manual=safetyEvalIndicatorRows.filter(row=>row.type==="手工指标").length;
  const rule=safetyEvalIndicatorRows.filter(row=>row.type==="规则指标").length;
  const enabled=safetyEvalIndicatorRows.filter(row=>row.status==="启用").length;
  const disabled=safetyEvalIndicatorRows.filter(row=>row.status==="停用").length;
  return `
    <section class="card construction-project-stat-card safety-eval-management-stat-card">
      <div class="card-bd">
        <div class="construction-project-stats">
          <div class="construction-project-stat-group single">
            <div class="construction-project-stat-items">
              <div class="construction-project-stat-item ${safetyEvalIndicatorState.statKey==="all"?"active":""}" onclick="setSafetyEvalIndicatorStat('all')">
                <strong>${total}</strong><span>全部指标</span>
              </div>
            </div>
          </div>
          ${[
            ["指标类型",[["auto","自动指标",auto],["manual","手工指标",manual],["rule","规则指标",rule]]],
            ["指标状态",[["enabled","启用指标",enabled],["disabled","停用指标",disabled]]]
          ].map(group=>`
            <div class="construction-project-stat-group">
              <div class="construction-project-stat-name">${group[0]}</div>
              <div class="construction-project-stat-items">
                ${group[1].map(item=>`
                  <div class="construction-project-stat-item ${safetyEvalIndicatorState.statKey===item[0]?"active":""}" onclick="setSafetyEvalIndicatorStat('${item[0]}')">
                    <strong>${item[2]}</strong><span>${item[1]}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderSafetyEvalIndicatorTable(rows){
  const columns=getVisibleColumns("safetyEvalIndicator");
  return `
    <table class="safety-eval-indicator-table" style="min-width:${getTableMinWidth("safetyEvalIndicator")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalIndicator")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationIndicatorPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalIndicatorFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalIndicatorState.pageSize));
  safetyEvalIndicatorState.page=Math.min(safetyEvalIndicatorState.page,totalPages);
  const start=(safetyEvalIndicatorState.page-1)*safetyEvalIndicatorState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalIndicatorState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 指标管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>指标名称</label><input class="input" id="seiName" value="${escapeAttr(safetyEvalIndicatorState.name)}" placeholder="请输入指标名称"/></div>
      <div class="form-item"><label>指标编码</label><input class="input" id="seiCode" value="${escapeAttr(safetyEvalIndicatorState.code)}" placeholder="请输入指标编码"/></div>
      <div class="form-item"><label>指标分类</label><select class="select" id="seiCategory">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.categories,safetyEvalIndicatorState.category,"请选择指标分类")}</select></div>
      <div class="form-item"><label>指标类型</label><select class="select" id="seiType">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.types,safetyEvalIndicatorState.type,"请选择指标类型")}</select></div>
      <div class="form-item"><label>数据来源</label><select class="select" id="seiSource">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.sources,safetyEvalIndicatorState.source,"请选择数据来源")}</select></div>
      <div class="form-item"><label>是否参与评分</label><select class="select" id="seiScore">${renderSafetyEvalIndicatorOptions(["是","否"],safetyEvalIndicatorState.score,"请选择")}</select></div>
      <div class="form-item"><label>状态</label><select class="select" id="seiStatus">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.status,safetyEvalIndicatorState.status,"请选择状态")}</select></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalIndicators()",resetFn:"resetSafetyEvalIndicators()",gridClass:"search-grid"})}
    ${renderSafetyEvalIndicatorStats()}
    <section class="card table-card safety-eval-indicator-card">
      <div class="card-hd">
        <div class="card-title">指标列表</div>
        <div class="actions">
          <button class="btn primary" onclick="showToast('新增指标功能演示')">新增指标</button>
          <button class="btn" onclick="showToast('批量导出成功')">批量导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalIndicator','renderSafetyEvaluationIndicatorPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalIndicatorTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalIndicatorPage(-1)" ${safetyEvalIndicatorState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalIndicatorState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalIndicatorPage(1)" ${safetyEvalIndicatorState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalIndicatorState.pageSize=Number(this.value);safetyEvalIndicatorState.page=1;renderSafetyEvaluationIndicatorPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalIndicatorState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

safetyEvalIndicatorOptions.types=["基础指标","复合指标"];
safetyEvalIndicatorOptions.methods=["自动计算","规则计算","手动计算"];
safetyEvalIndicatorOptions.sources=["实名制人员到岗数据","实名制四要素校验数据","视频监控在线数据","隐患整改闭环数据","重复隐患发生数据","分包人员配置数据","安全每日监督填报数据","保险集中管理数据","技术方案审批数据","工人工资核验数据"];

safetyEvalIndicatorRows.splice(0,safetyEvalIndicatorRows.length,...[
  ["IND-001","实名系统开通","基础指标","自动计算","实名制人员到岗数据",4,"启用","新开项目安全纳管后三天内开通实名制系统。","2026-06-01 09:30","2026-06-28 15:12"],
  ["IND-002","实名四要素一致性","复合指标","规则计算","-",3,"启用","校验姓名、三级教育、合同、操作证四类关键要素一致性。","2026-06-01 09:30","2026-06-28 15:12"],
  ["IND-003","监控视频在线","基础指标","自动计算","视频监控在线数据",5,"启用","统计项目监控设备在线情况。","2026-06-02 10:20","2026-06-29 11:05"],
  ["IND-004","隐患整改闭环","复合指标","规则计算","-",4,"启用","按期完成隐患整改并闭环验收。","2026-06-03 14:10","2026-06-29 18:22"],
  ["IND-005","重复隐患发生","复合指标","规则计算","-",4,"启用","识别同类隐患重复发生次数。","2026-06-03 14:10","2026-06-29 18:22"],
  ["IND-006","安全每日监督","基础指标","手动计算","-",2,"启用","项目安全每日监督记录完整性。","2026-06-04 08:50","2026-06-25 09:44"],
  ["IND-007","关键岗位在岗","基础指标","自动计算","实名制人员到岗数据",6,"启用","现场负责人、专职安全员等关键岗位到岗情况。","2026-06-04 08:50","2026-06-30 10:02"],
  ["IND-008","工人工资核验","复合指标","规则计算","-",2,"启用","校验农民工工资表上传及一致性。","2026-06-05 16:30","2026-06-29 16:03"],
  ["IND-009","技术方案审批","复合指标","规则计算","-",3,"启用","重大技术方案审批是否按要求完成。","2026-06-06 13:15","2026-06-27 14:18"],
  ["IND-010","保险集中管理","基础指标","自动计算","保险集中管理数据",1,"停用","保险集中管理数据采集指标，当前暂停参与评价。","2026-06-07 10:00","2026-06-20 10:00"],
  ["IND-011","保险理赔止损","复合指标","规则计算","-",2,"启用","结合理赔流程、止损结果进行综合评价。","2026-06-08 11:25","2026-06-30 17:10"],
  ["IND-012","重大舆情事件","基础指标","手动计算","-",0,"停用","重大舆情事件人工确认和记录。","2026-06-09 12:10","2026-06-22 13:36"]
].map((row,index)=>({
  id:index+1,
  code:row[0],
  name:row[1],
  type:row[2],
  calculationMethod:row[3],
  linkedSource:row[4],
  source:row[4],
  templateRefCount:row[5],
  status:row[6],
  remark:row[7],
  createTime:row[8],
  updateTime:row[9]
})));

Object.assign(safetyEvalIndicatorState,{calculationMethod:"",linkedSource:""});

function getSafetyEvalIndicatorReferencedModels(indicator){
  const models=Array.isArray(safetyEvalModelRows)?safetyEvalModelRows:[];
  const count=Math.min(models.length,Math.max(0,Number(indicator?.templateRefCount)||0));
  if(!count)return [];
  const start=((Number(indicator.id)||1)*2-2)%models.length;
  return Array.from({length:count},(_,index)=>models[(start+index)%models.length]);
}

function openSafetyEvalIndicatorModels(id){
  const indicator=safetyEvalIndicatorRows.find(item=>item.id===Number(id));
  if(!indicator)return;
  const models=getSafetyEvalIndicatorReferencedModels(indicator);
  const html=`
    <div class="safety-eval-indicator-model-modal">
      <div class="safety-eval-indicator-model-summary">
        <span>当前指标</span><strong>${indicator.name}</strong><em>${indicator.code}</em>
        <b>关联模型 ${models.length} 个</b>
      </div>
      <div class="table-wrap safety-eval-indicator-model-table-wrap">
        ${renderSafetyEvalModelTable(models)}
      </div>
    </div>
  `;
  openModal("引用模型",html,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

tableColumnDefinitions.safetyEvalIndicator=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalIndicatorState.page-1)*safetyEvalIndicatorState.pageSize+index+1},
  {key:"code",title:"指标编号",width:120,align:"left",render:row=>row.code},
  {key:"name",title:"指标名称",width:190,align:"left",render:row=>`<a class="link" onclick="openSafetyEvalIndicatorDetailModal(${row.id})">${row.name}</a>`},
  {key:"type",title:"指标类型",width:120,align:"center",render:row=>tag(row.type,row.type==="基础指标"?"blue":"purple")},
  {key:"calculationMethod",title:"计算方式",width:120,align:"center",render:row=>tag(row.calculationMethod,row.calculationMethod==="自动计算"?"green":row.calculationMethod==="规则计算"?"orange":"gray")},
  {key:"linkedSource",title:"关联源数据",width:180,align:"left",render:row=>row.calculationMethod==="自动计算"?(row.linkedSource || "-"):"-"},
  {key:"templateRefCount",title:"引用模型数",width:110,align:"center",render:row=>{
    const count=getSafetyEvalIndicatorReferencedModels(row).length;
    return count?`<a class="link safety-eval-model-count-link" onclick="openSafetyEvalIndicatorModels(${row.id})">${count}</a>`:"0";
  }},
  {key:"status",title:"状态",width:100,align:"center",render:row=>tag(row.status,row.status==="启用"?"green":"red")},
  {key:"remark",title:"指标说明",width:280,align:"left",render:row=>`<span class="indicator-remark" title="${escapeAttr(row.remark)}">${row.remark}</span>`},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"updateTime",title:"更新时间",width:170,align:"center",render:row=>row.updateTime},
  {key:"operation",title:"操作",width:120,align:"center",render:row=>`
    <a class="link" onclick="openSafetyEvalIndicatorEditModal(${row.id})">编辑</a>
    <a class="link" onclick="toggleSafetyEvalIndicatorStatus(${row.id})">${row.status==="启用"?"停用":"启用"}</a>
  `}
];

function getSafetyEvalIndicatorFilteredRows(){
  const s=safetyEvalIndicatorState;
  return safetyEvalIndicatorRows.filter(row=>{
    if(s.statKey==="basic"&&row.type!=="基础指标")return false;
    if(s.statKey==="composite"&&row.type!=="复合指标")return false;
    if(s.statKey==="calcAuto"&&row.calculationMethod!=="自动计算")return false;
    if(s.statKey==="calcManual"&&row.calculationMethod!=="手动计算")return false;
    if(s.statKey==="calcRule"&&row.calculationMethod!=="规则计算")return false;
    if(s.statKey==="enabled"&&row.status!=="启用")return false;
    if(s.statKey==="disabled"&&row.status!=="停用")return false;
    if(s.name&&!row.name.includes(s.name))return false;
    if(s.code&&!row.code.includes(s.code))return false;
    if(s.type&&row.type!==s.type)return false;
    if(s.calculationMethod&&row.calculationMethod!==s.calculationMethod)return false;
    if(s.linkedSource&&row.linkedSource!==s.linkedSource)return false;
    if(s.status&&row.status!==s.status)return false;
    return true;
  });
}

function querySafetyEvalIndicators(){
  safetyEvalIndicatorState.name=document.getElementById("seiName")?.value.trim() || "";
  safetyEvalIndicatorState.code=document.getElementById("seiCode")?.value.trim() || "";
  safetyEvalIndicatorState.type=document.getElementById("seiType")?.value || "";
  safetyEvalIndicatorState.calculationMethod=document.getElementById("seiMethod")?.value || "";
  safetyEvalIndicatorState.linkedSource=document.getElementById("seiSource")?.value || "";
  safetyEvalIndicatorState.status=document.getElementById("seiStatus")?.value || "";
  safetyEvalIndicatorState.page=1;
  renderSafetyEvaluationIndicatorPage();
}

function resetSafetyEvalIndicators(){
  Object.assign(safetyEvalIndicatorState,{name:"",code:"",category:"",type:"",calculationMethod:"",linkedSource:"",source:"",score:"",status:"",statKey:"all",page:1});
  renderSafetyEvaluationIndicatorPage();
}

function renderSafetyEvalIndicatorStats(){
  const total=safetyEvalIndicatorRows.length;
  const basic=safetyEvalIndicatorRows.filter(row=>row.type==="基础指标").length;
  const composite=safetyEvalIndicatorRows.filter(row=>row.type==="复合指标").length;
  const calcAuto=safetyEvalIndicatorRows.filter(row=>row.calculationMethod==="自动计算").length;
  const calcManual=safetyEvalIndicatorRows.filter(row=>row.calculationMethod==="手动计算").length;
  const calcRule=safetyEvalIndicatorRows.filter(row=>row.calculationMethod==="规则计算").length;
  const enabled=safetyEvalIndicatorRows.filter(row=>row.status==="启用").length;
  const disabled=safetyEvalIndicatorRows.filter(row=>row.status==="停用").length;
  return `
    <section class="card construction-project-stat-card safety-eval-management-stat-card">
      <div class="card-bd">
        <div class="construction-project-stats">
          <div class="construction-project-stat-group single">
            <div class="construction-project-stat-items">
              <div class="construction-project-stat-item ${safetyEvalIndicatorState.statKey==="all"?"active":""}" onclick="setSafetyEvalIndicatorStat('all')">
                <strong>${total}</strong><span>全部指标</span>
              </div>
            </div>
          </div>
          ${[
            ["指标类型",[["basic","基础指标",basic],["composite","复合指标",composite]]],
            ["计算方式",[["calcAuto","自动计算",calcAuto],["calcManual","手动计算",calcManual],["calcRule","规则计算",calcRule]]],
            ["指标状态",[["enabled","启用指标",enabled],["disabled","停用指标",disabled]]]
          ].map(group=>`
            <div class="construction-project-stat-group">
              <div class="construction-project-stat-name">${group[0]}</div>
              <div class="construction-project-stat-items">
                ${group[1].map(item=>`
                  <div class="construction-project-stat-item ${safetyEvalIndicatorState.statKey===item[0]?"active":""}" onclick="setSafetyEvalIndicatorStat('${item[0]}')">
                    <strong>${item[2]}</strong><span>${item[1]}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

let safetyEvalIndicatorEditingId=null;

function openSafetyEvalIndicatorCreateModal(editingId=null,viewOnly=false){
  const editingRow=safetyEvalIndicatorRows.find(item=>item.id===Number(editingId)) || null;
  document.getElementById("modalBody")?.classList.remove("safety-eval-detail-mode");
  safetyEvalIndicatorEditingId=viewOnly?null:(editingRow?.id || null);
  const locked=Boolean(editingRow);
  openModal(viewOnly?"指标详情":locked?"编辑指标":"新增指标",`
    <div class="search-grid">
      <div class="form-item"><label>指标名称</label><input class="input" id="seiCreateName" value="${escapeAttr(editingRow?.name||"")}" placeholder="请输入指标名称"/></div>
      <div class="form-item"><label>指标编号</label><input class="input ${locked?"safety-eval-locked-field":""}" id="seiCreateCode" value="${escapeAttr(editingRow?.code||"")}" placeholder="请输入指标编号" ${locked?"disabled":""}/></div>
      <div class="form-item"><label>指标类型</label><select class="select ${locked?"safety-eval-locked-field":""}" id="seiCreateType" onchange="updateSafetyEvalIndicatorCreateForm()" ${locked?"disabled":""}>${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.types,editingRow?.type||"基础指标","请选择")}</select></div>
      <div class="form-item"><label>计算方式</label><select class="select" id="seiCreateMethod" onchange="updateSafetyEvalIndicatorCreateForm()"></select></div>
      <div class="form-item safety-eval-create-field" id="seiCreateSourceWrap"><label>关联源数据</label><select class="select" id="seiCreateSource">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.sources,"","请选择关联源数据")}</select></div>
      <div class="form-item safety-eval-formula-field" id="seiCreateRuleWrap">
        <label>计算规则</label>
        <div class="message-rich-editor safety-formula-editor">
          <div class="message-rich-toolbar safety-formula-toolbar" ${viewOnly?'style="display:none"':''}>
            <div class="template-param-insert">
              <button class="template-param-btn" type="button" onclick="toggleSafetyEvalFormulaMenu(event)"><span>＋</span>插入指标</button>
              <div class="template-param-menu safety-formula-menu" id="seiFormulaIndicatorMenu">
                ${renderSafetyEvalFormulaIndicatorMenu()}
              </div>
            </div>
            <div class="safety-formula-operators">
              ${["+","-","*","/","=","(",")"].map(op=>`<button type="button" data-formula-token="${escapeAttr(op)}">${op}</button>`).join("")}
            </div>
          </div>
          <div id="seiCreateRule" class="message-rich-content template-rich-content safety-formula-content" contenteditable="true" onmouseup="saveSafetyEvalFormulaRange()" onkeyup="saveSafetyEvalFormulaRange()" onfocus="saveSafetyEvalFormulaRange()" oninput="saveSafetyEvalFormulaRange()" data-placeholder="请输入或通过插入指标构建计算公式"></div>
        </div>
      </div>
      <div class="form-item" style="grid-column:1/-1"><label>指标说明</label><textarea class="input" id="seiCreateRemark" placeholder="请输入指标说明" style="min-height:92px;resize:vertical;padding-top:8px">${editingRow?.remark||""}</textarea></div>
    </div>
  `,viewOnly?`<button class="btn" onclick="closeModal()">关闭</button>`:`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveSafetyEvalIndicator()">保存</button>`,"large");
  updateSafetyEvalIndicatorCreateForm();
  if(editingRow){
    const method=document.getElementById("seiCreateMethod");
    if(method)method.value=editingRow.calculationMethod;
    updateSafetyEvalIndicatorCreateForm();
    const source=document.getElementById("seiCreateSource");
    if(source&&editingRow.linkedSource!=="-")source.value=editingRow.linkedSource;
    const rule=document.getElementById("seiCreateRule");
    if(rule)rule.textContent=editingRow.calculationRule||"";
  }
  if(viewOnly){
    document.querySelectorAll("#modalBody input,#modalBody select,#modalBody textarea,#modalBody button").forEach(control=>control.disabled=true);
    const editor=document.getElementById("seiCreateRule");
    if(editor)editor.setAttribute("contenteditable","false");
    const toolbar=document.querySelector("#modalBody .safety-formula-toolbar");
    if(toolbar)toolbar.style.display="none";
    document.getElementById("modalBody")?.classList.add("safety-eval-detail-mode");
  }
}

function openSafetyEvalIndicatorEditModal(id){
  openSafetyEvalIndicatorCreateModal(id);
}

function openSafetyEvalIndicatorDetailModal(id){
  openSafetyEvalIndicatorCreateModal(id,true);
}

let safetyEvalFormulaRange=null;
function renderSafetyEvalFormulaIndicatorMenu(){
  return safetyEvalIndicatorRows.slice(0,16).map(item=>{
    const token=`{${item.name}}`;
    return `<button type="button" data-formula-token="${escapeAttr(token)}">${item.name}</button>`;
  }).join("");
}
function saveSafetyEvalFormulaRange(){
  const editor=document.getElementById("seiCreateRule");
  const sel=window.getSelection?.();
  if(!editor || !sel || !sel.rangeCount)return;
  const range=sel.getRangeAt(0);
  if(editor.contains(range.commonAncestorContainer))safetyEvalFormulaRange=range.cloneRange();
}
function restoreSafetyEvalFormulaRange(){
  const editor=document.getElementById("seiCreateRule");
  const sel=window.getSelection?.();
  if(!editor || !sel)return false;
  editor.focus();
  sel.removeAllRanges();
  if(safetyEvalFormulaRange){sel.addRange(safetyEvalFormulaRange);return true;}
  const range=document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  sel.addRange(range);
  return true;
}
function toggleSafetyEvalFormulaMenu(event){
  event?.stopPropagation?.();
  saveSafetyEvalFormulaRange();
  const menu=document.getElementById("seiFormulaIndicatorMenu");
  if(menu)menu.classList.toggle("open");
  if(typeof syncModalDropdownLayer==="function")syncModalDropdownLayer();
}
function insertSafetyEvalFormulaFromMenu(token){
  insertSafetyEvalFormulaToken(token);
  const menu=document.getElementById("seiFormulaIndicatorMenu");
  if(menu)menu.classList.remove("open");
  if(typeof syncModalDropdownLayer==="function")syncModalDropdownLayer();
}
function insertSafetyEvalFormulaToken(token){
  const editor=document.getElementById("seiCreateRule");
  if(!editor)return;
  restoreSafetyEvalFormulaRange();
  const value=/^[+\-*/=()]$/.test(token)?` ${token} `:token;
  const sel=window.getSelection?.();
  if(sel && sel.rangeCount){
    const range=sel.getRangeAt(0);
    range.deleteContents();
    const node=document.createTextNode(value);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
    safetyEvalFormulaRange=range.cloneRange();
  }else{
    editor.textContent=(editor.textContent||"")+value;
  }
  editor.focus();
}

document.addEventListener("click",function(e){
  const formulaMenuBtn=e.target.closest?.("#seiFormulaIndicatorMenu [data-formula-token]");
  if(formulaMenuBtn){
    e.preventDefault();
    e.stopPropagation();
    insertSafetyEvalFormulaFromMenu(formulaMenuBtn.dataset.formulaToken || formulaMenuBtn.textContent.trim());
    return;
  }
  const formulaOpBtn=e.target.closest?.(".safety-formula-operators [data-formula-token]");
  if(formulaOpBtn){
    e.preventDefault();
    insertSafetyEvalFormulaToken(formulaOpBtn.dataset.formulaToken || formulaOpBtn.textContent.trim());
  }
});

function updateSafetyEvalIndicatorCreateForm(){
  const type=document.getElementById("seiCreateType")?.value || "基础指标";
  const method=document.getElementById("seiCreateMethod");
  if(method){
    const methods=type==="复合指标"?["规则计算"]:["自动计算","手动计算"];
    const current=methods.includes(method.value)?method.value:methods[0];
    method.innerHTML=methods.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("");
  }
  const selectedMethod=method?.value || (type==="复合指标"?"规则计算":"自动计算");
  const sourceWrap=document.getElementById("seiCreateSourceWrap");
  const ruleWrap=document.getElementById("seiCreateRuleWrap");
  if(sourceWrap)sourceWrap.style.display=selectedMethod==="自动计算"?"block":"none";
  if(ruleWrap)ruleWrap.style.display=type==="复合指标"&&selectedMethod==="规则计算"?"block":"none";
}

function saveSafetyEvalIndicator(){
  const editingRow=safetyEvalIndicatorRows.find(item=>item.id===Number(safetyEvalIndicatorEditingId)) || null;
  const type=document.getElementById("seiCreateType")?.value || "基础指标";
  const method=document.getElementById("seiCreateMethod")?.value || (type==="复合指标"?"规则计算":"自动计算");
  const name=document.getElementById("seiCreateName")?.value.trim() || "新建安全评价指标";
  const code=document.getElementById("seiCreateCode")?.value.trim() || `IND-${String(safetyEvalIndicatorRows.length+1).padStart(3,"0")}`;
  const linkedSource=method==="自动计算"?(document.getElementById("seiCreateSource")?.value || safetyEvalIndicatorOptions.sources[0]):"-";
  const rule=document.getElementById("seiCreateRule")?.textContent.trim();
  const remark=document.getElementById("seiCreateRemark")?.value.trim() || (rule?`计算规则：${rule}`:"新增指标说明");
  if(editingRow){
    Object.assign(editingRow,{name,calculationMethod:method,linkedSource,source:linkedSource,remark,calculationRule:rule||"",updateTime:"2026-07-20 10:30"});
  }else{
    safetyEvalIndicatorRows.unshift({
      id:Math.max(0,...safetyEvalIndicatorRows.map(row=>row.id))+1,
      code,
      name,
      type,
      calculationMethod:method,
      linkedSource,
      source:linkedSource,
      calculationRule:rule||"",
      templateRefCount:0,
      status:"启用",
      remark,
      createTime:"2026-07-20 10:30",
      updateTime:"2026-07-20 10:30"
    });
  }
  closeModal();
  safetyEvalIndicatorEditingId=null;
  safetyEvalIndicatorState.page=1;
  renderSafetyEvaluationIndicatorPage();
  showToast(`${editingRow?"已更新":"已新增"}指标：${name}`);
}

function renderSafetyEvaluationIndicatorPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalIndicatorFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalIndicatorState.pageSize));
  safetyEvalIndicatorState.page=Math.min(safetyEvalIndicatorState.page,totalPages);
  const start=(safetyEvalIndicatorState.page-1)*safetyEvalIndicatorState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalIndicatorState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 指标管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>指标名称</label><input class="input" id="seiName" value="${escapeAttr(safetyEvalIndicatorState.name)}" placeholder="请输入指标名称"/></div>
      <div class="form-item"><label>指标编号</label><input class="input" id="seiCode" value="${escapeAttr(safetyEvalIndicatorState.code)}" placeholder="请输入指标编号"/></div>
      <div class="form-item"><label>指标类型</label><select class="select" id="seiType">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.types,safetyEvalIndicatorState.type,"请选择指标类型")}</select></div>
      <div class="form-item"><label>计算方式</label><select class="select" id="seiMethod">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.methods,safetyEvalIndicatorState.calculationMethod,"请选择计算方式")}</select></div>
      <div class="form-item"><label>关联源数据</label><select class="select" id="seiSource">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.sources,safetyEvalIndicatorState.linkedSource,"请选择关联源数据")}</select></div>
      <div class="form-item"><label>状态</label><select class="select" id="seiStatus">${renderSafetyEvalIndicatorOptions(safetyEvalIndicatorOptions.status,safetyEvalIndicatorState.status,"请选择状态")}</select></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalIndicators()",resetFn:"resetSafetyEvalIndicators()",gridClass:"search-grid"})}
    ${renderSafetyEvalIndicatorStats()}
    <section class="card table-card safety-eval-indicator-card">
      <div class="card-hd">
        <div class="card-title">指标列表</div>
        <div class="actions">
          <button class="btn primary" onclick="openSafetyEvalIndicatorCreateModal()">新增指标</button>
          <button class="btn" onclick="showToast('批量导出成功')">批量导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalIndicator','renderSafetyEvaluationIndicatorPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalIndicatorTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalIndicatorPage(-1)" ${safetyEvalIndicatorState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalIndicatorState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalIndicatorPage(1)" ${safetyEvalIndicatorState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalIndicatorState.pageSize=Number(this.value);safetyEvalIndicatorState.page=1;renderSafetyEvaluationIndicatorPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalIndicatorState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

const safetyEvalObjectOptions={
  types:["企业","项目","供应链","岗位"],
  orgs:getOrganizationDisplayOptions(),
  parents:getOrganizationCompanyOptions(true),
  bindStatus:["已绑定","未绑定"],
  status:["启用","停用"]
};

const safetyEvalObjectRows=[
  ["OBJ-ENT-001","市政集团","企业","市政集团","隧道股份",3,"集团安全评价模型;企业风险管控模型;年度安全评价模型","已绑定","启用","2026-06-30 10:20","2026-05-21 09:15","2026-06-30 10:20"],
  ["OBJ-ENT-002","上海隧道","企业","上海隧道","隧道股份",2,"集团安全评价模型;轨交施工评价模型","已绑定","启用","2026-06-29 17:30","2026-05-22 10:00","2026-06-29 17:30"],
  ["OBJ-ENT-003","上海能建","企业","上海能建","隧道股份",0,"","未绑定","停用","-","2026-05-23 14:30","2026-06-18 11:20"],
  ["OBJ-PRO-001","两湖隧道（东湖段）主体及附属配套工程施工2标","项目","上海分公司","市政集团",2,"施工项目周评价模型;地下工程安全评价模型","已绑定","启用","2026-06-30 08:50","2026-05-25 11:10","2026-06-30 08:50"],
  ["OBJ-PRO-002","上海示范区线工程SFQSG-15标施工","项目","总承包一部","上海路桥",1,"施工项目周评价模型","已绑定","启用","2026-06-28 18:10","2026-05-25 13:45","2026-06-28 18:10"],
  ["OBJ-PRO-003","临港新片区综合管廊工程","项目","上海分公司","市政集团",0,"","未绑定","启用","-","2026-05-28 16:12","2026-06-15 10:38"],
  ["OBJ-SUP-001","上海XXX劳务有限公司","供应链","轨交分公司","上海隧道",1,"供应链安全履约评价模型","已绑定","启用","2026-06-26 09:00","2026-06-01 09:30","2026-06-26 09:00"],
  ["OBJ-SUP-002","华东材料供应中心","供应链","总承包二部","上海路桥",0,"","未绑定","启用","-","2026-06-02 10:25","2026-06-20 15:30"],
  ["OBJ-SUP-003","城环设备租赁单位","供应链","环境建设公司","城市环境",1,"设备安全评价模型","已绑定","停用","2026-06-10 10:00","2026-06-03 15:20","2026-06-19 12:00"],
  ["OBJ-POS-001","项目经理岗位","岗位","上海分公司","市政集团",1,"关键岗位履职评价模型","已绑定","启用","2026-06-30 12:20","2026-06-04 09:10","2026-06-30 12:20"],
  ["OBJ-POS-002","专职安全员岗位","岗位","轨交分公司","上海隧道",2,"关键岗位履职评价模型;安全岗位配置评价模型","已绑定","启用","2026-06-30 12:35","2026-06-04 09:20","2026-06-30 12:35"],
  ["OBJ-POS-003","安全总监岗位","岗位","总承包一部","上海路桥",0,"","未绑定","启用","-","2026-06-05 11:05","2026-06-21 17:16"]
].map((row,index)=>({
  id:index+1,
  objectCode:row[0],
  objectName:row[1],
  objectType:row[2],
  orgName:row[3],
  parentOrg:row[4],
  modelCount:row[5],
  modelNames:row[6],
  modelBindStatus:row[7],
  status:row[8],
  lastEvalTime:row[9],
  createTime:row[10],
  updateTime:row[11]
}));

const safetyEvalObjectState={
  objectName:"",
  objectCode:"",
  objectType:"",
  orgName:"",
  parentOrg:"",
  modelBindStatus:"",
  status:"",
  createStartTime:"",
  createEndTime:"",
  statKey:"",
  page:1,
  pageSize:10
};

tableColumnDefinitions.safetyEvalObject=[
  {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalObjectState.page-1)*safetyEvalObjectState.pageSize+index+1},
  {key:"objectCode",title:"对象编码",width:130,align:"left",render:row=>row.objectCode},
  {key:"objectName",title:"对象名称",width:260,align:"left",render:row=>`<a class="link" onclick="showToast('查看对象详情：${row.objectName}')">${row.objectName}</a>`},
  {key:"objectType",title:"对象类型",width:110,align:"center",render:row=>tag(row.objectType,({企业:"blue",项目:"green",供应链:"orange",岗位:"purple"})[row.objectType] || "gray")},
  {key:"orgName",title:"所属组织",width:150,align:"left",render:row=>row.orgName},
  {key:"parentOrg",title:"上级单位",width:150,align:"left",render:row=>row.parentOrg},
  {key:"modelCount",title:"评价模型数量",width:120,align:"center",render:row=>row.modelCount},
  {key:"modelNames",title:"模型名称列表",width:240,align:"left",render:row=>`<span class="object-model-names" title="${escapeAttr(row.modelNames || "未绑定模型")}">${row.modelNames || "-"}</span>`},
  {key:"modelBindStatus",title:"模型绑定状态",width:120,align:"center",render:row=>tag(row.modelBindStatus,row.modelBindStatus==="已绑定"?"green":"orange")},
  {key:"status",title:"对象状态",width:100,align:"center",render:row=>tag(row.status,row.status==="启用"?"green":"red")},
  {key:"lastEvalTime",title:"最近评价时间",width:170,align:"center",render:row=>row.lastEvalTime},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"updateTime",title:"更新时间",width:170,align:"center",render:row=>row.updateTime},
  {key:"operation",title:"操作",width:260,align:"center",render:row=>`
    <a class="link" onclick="showToast('查看对象详情：${row.objectName}')">查看</a>
    <a class="link" onclick="showToast('绑定模型：${row.objectName}')">绑定模型</a>
    <a class="link" onclick="showToast('编辑对象：${row.objectName}')">编辑</a>
    <a class="link" onclick="toggleSafetyEvalObjectStatus(${row.id})">${row.status==="启用"?"停用":"启用"}</a>
    <a class="link danger-link" onclick="deleteSafetyEvalObject(${row.id})">删除</a>
  `}
];

function getSafetyEvalObjectFilteredRows(){
  const s=safetyEvalObjectState;
  return safetyEvalObjectRows.filter(row=>{
    if(s.statKey==="enterprise"&&row.objectType!=="企业")return false;
    if(s.statKey==="project"&&row.objectType!=="项目")return false;
    if(s.statKey==="supply"&&row.objectType!=="供应链")return false;
    if(s.statKey==="position"&&row.objectType!=="岗位")return false;
    if(s.statKey==="enabled"&&row.status!=="启用")return false;
    if(s.statKey==="disabled"&&row.status!=="停用")return false;
    if(s.statKey==="pendingConfig"&&row.modelBindStatus!=="未绑定")return false;
    if(s.statKey==="bound"&&row.modelBindStatus!=="已绑定")return false;
    if(s.statKey==="unbound"&&row.modelBindStatus!=="未绑定")return false;
    if(s.objectName&&!row.objectName.includes(s.objectName))return false;
    if(s.objectCode&&!row.objectCode.includes(s.objectCode))return false;
    if(s.objectType&&row.objectType!==s.objectType)return false;
    if(s.orgName&&!row.orgName.includes(s.orgName))return false;
    if(s.parentOrg&&row.parentOrg!==s.parentOrg)return false;
    if(s.modelBindStatus&&row.modelBindStatus!==s.modelBindStatus)return false;
    if(s.status&&row.status!==s.status)return false;
    if(s.createStartTime&&row.createTime.slice(0,10)<s.createStartTime)return false;
    if(s.createEndTime&&row.createTime.slice(0,10)>s.createEndTime)return false;
    return true;
  });
}

function querySafetyEvalObjects(){
  safetyEvalObjectState.objectName=document.getElementById("seoName")?.value.trim() || "";
  safetyEvalObjectState.objectCode=document.getElementById("seoCode")?.value.trim() || "";
  safetyEvalObjectState.objectType=document.getElementById("seoType")?.value || "";
  safetyEvalObjectState.orgName=document.getElementById("seoOrg")?.value.trim() || "";
  safetyEvalObjectState.parentOrg=document.getElementById("seoParent")?.value || "";
  safetyEvalObjectState.modelBindStatus=document.getElementById("seoBind")?.value || "";
  safetyEvalObjectState.status=document.getElementById("seoStatus")?.value || "";
  safetyEvalObjectState.createStartTime=document.getElementById("seoStart")?.value || "";
  safetyEvalObjectState.createEndTime=document.getElementById("seoEnd")?.value || "";
  safetyEvalObjectState.page=1;
  renderSafetyEvaluationObjectPage();
}

function resetSafetyEvalObjects(){
  Object.assign(safetyEvalObjectState,{objectName:"",objectCode:"",objectType:"",orgName:"",parentOrg:"",modelBindStatus:"",status:"",createStartTime:"",createEndTime:"",statKey:"",page:1});
  renderSafetyEvaluationObjectPage();
}

function setSafetyEvalObjectStat(key){
  safetyEvalObjectState.statKey=safetyEvalObjectState.statKey===key?"":key;
  safetyEvalObjectState.page=1;
  renderSafetyEvaluationObjectPage();
}

function changeSafetyEvalObjectPage(dir){
  const total=getSafetyEvalObjectFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalObjectState.pageSize));
  safetyEvalObjectState.page=Math.min(max,Math.max(1,safetyEvalObjectState.page+dir));
  renderSafetyEvaluationObjectPage();
}

function toggleSafetyEvalObjectStatus(id){
  const row=safetyEvalObjectRows.find(item=>item.id===Number(id));
  if(row){
    row.status=row.status==="启用"?"停用":"启用";
    showToast(`已${row.status}：${row.objectName}`);
  }
  renderSafetyEvaluationObjectPage();
}

function deleteSafetyEvalObject(id){
  const row=safetyEvalObjectRows.find(item=>item.id===Number(id));
  showToast(`删除对象演示：${row?.objectName || id}`);
}

function renderSafetyEvalObjectOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function countSafetyEvalObjects(predicate){
  return safetyEvalObjectRows.filter(predicate).length;
}

function renderSafetyEvalObjectStats(){
  const typeItems=[
    ["enterprise","企业对象",countSafetyEvalObjects(row=>row.objectType==="企业"),"子公司/分公司"],
    ["project","项目对象",countSafetyEvalObjects(row=>row.objectType==="项目"),"施工项目"],
    ["supply","供应链对象",countSafetyEvalObjects(row=>row.objectType==="供应链"),"分包/材料/设备"],
    ["position","岗位对象",countSafetyEvalObjects(row=>row.objectType==="岗位"),"人员/岗位"]
  ];
  const statusItems=[
    ["enabled","启用对象",countSafetyEvalObjects(row=>row.status==="启用"),"正常参与评价"],
    ["disabled","停用对象",countSafetyEvalObjects(row=>row.status==="停用"),"不参与评价"],
    ["pendingConfig","待配置对象",countSafetyEvalObjects(row=>row.modelBindStatus==="未绑定"),"未绑定评价模型"],
    ["bound","已绑定模型对象",countSafetyEvalObjects(row=>row.modelBindStatus==="已绑定"),"已配置评价体系"],
    ["unbound","未绑定模型对象",countSafetyEvalObjects(row=>row.modelBindStatus==="未绑定"),"未配置评价体系"]
  ];
  const renderGroup=(title,items)=>`
    <div class="construction-project-stat-group">
      <div class="construction-project-stat-name">${title}</div>
      <div class="construction-project-stat-items">
        ${items.map(item=>`
          <div class="construction-project-stat-item ${safetyEvalObjectState.statKey===item[0]?"active":""}" onclick="setSafetyEvalObjectStat('${item[0]}')">
            <strong>${item[2]}</strong><span>${item[1]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  return `<section class="card construction-project-stat-card safety-eval-management-stat-card"><div class="card-bd"><div class="construction-project-stats">${renderGroup("类型分布",typeItems)}${renderGroup("对象状态",statusItems)}</div></div></section>`;
}

function renderSafetyEvalObjectTable(rows){
  const columns=getVisibleColumns("safetyEvalObject");
  return `
    <table class="safety-eval-object-table" style="min-width:${getTableMinWidth("safetyEvalObject")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalObject")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationObjectPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalObjectFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalObjectState.pageSize));
  safetyEvalObjectState.page=Math.min(safetyEvalObjectState.page,totalPages);
  const start=(safetyEvalObjectState.page-1)*safetyEvalObjectState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalObjectState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 对象管理（禁）</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>对象名称</label><input class="input" id="seoName" value="${escapeAttr(safetyEvalObjectState.objectName)}" placeholder="支持企业/项目/岗位名称搜索"/></div>
      <div class="form-item"><label>对象编码</label><input class="input" id="seoCode" value="${escapeAttr(safetyEvalObjectState.objectCode)}" placeholder="请输入统一编码"/></div>
      <div class="form-item"><label>对象类型</label><select class="select" id="seoType">${renderSafetyEvalObjectOptions(safetyEvalObjectOptions.types,safetyEvalObjectState.objectType,"全部")}</select></div>
      <div class="form-item"><label>所属组织</label><input class="input" id="seoOrg" value="${escapeAttr(safetyEvalObjectState.orgName)}" placeholder="子公司/分公司过滤"/></div>
      <div class="form-item"><label>上级单位</label><select class="select" id="seoParent">${renderSafetyEvalObjectOptions(safetyEvalObjectOptions.parents,safetyEvalObjectState.parentOrg,"全部")}</select></div>
      <div class="form-item"><label>模型绑定状态</label><select class="select" id="seoBind">${renderSafetyEvalObjectOptions(safetyEvalObjectOptions.bindStatus,safetyEvalObjectState.modelBindStatus,"全部")}</select></div>
      <div class="form-item"><label>启用状态</label><select class="select" id="seoStatus">${renderSafetyEvalObjectOptions(safetyEvalObjectOptions.status,safetyEvalObjectState.status,"全部")}</select></div>
      <div class="form-item"><label>创建时间-开始</label><input class="input" type="date" id="seoStart" value="${escapeAttr(safetyEvalObjectState.createStartTime)}"/></div>
      <div class="form-item"><label>创建时间-结束</label><input class="input" type="date" id="seoEnd" value="${escapeAttr(safetyEvalObjectState.createEndTime)}"/></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalObjects()",resetFn:"resetSafetyEvalObjects()",gridClass:"search-grid"})}
    ${renderSafetyEvalObjectStats()}
    <section class="card table-card safety-eval-object-card">
      <div class="card-hd">
        <div class="card-title">对象列表</div>
        <div class="actions">
          <button class="btn primary" onclick="showToast('新增对象功能演示')">新增对象</button>
          <button class="btn" onclick="showToast('批量绑定模型功能演示')">批量绑定模型</button>
          <button class="btn" onclick="showToast('批量导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalObject','renderSafetyEvaluationObjectPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalObjectTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalObjectPage(-1)" ${safetyEvalObjectState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalObjectState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalObjectPage(1)" ${safetyEvalObjectState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalObjectState.pageSize=Number(this.value);safetyEvalObjectState.page=1;renderSafetyEvaluationObjectPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalObjectState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

const safetyEvalModelOptions={
  types:["企业","项目","供应链","岗位","综合"],
  status:["草稿","已发布","已停用","版本中"],
  objectTypes:["企业","项目","供应链","岗位","综合对象"]
};

const safetyEvalModelRows=[
  ["MOD-ENT-001","集团安全评价模型","企业","企业",42,100,"v2.0","已发布",8,"2026-07-01 10:20","系统管理员","2026-05-20 09:30","2026-06-30 16:10","2026-06-28 09:00"],
  ["MOD-PRO-001","施工项目周评价模型","项目","项目",58,100,"v2.3","已发布",57,"2026-07-01 09:00","李明","2026-05-22 10:15","2026-06-30 17:25","2026-06-29 14:00"],
  ["MOD-SUP-001","供应链安全履约评价模型","供应链","供应链",31,100,"v1.6","已发布",24,"2026-07-01 09:20","王佳","2026-06-01 11:10","2026-06-29 14:10","2026-06-25 10:30"],
  ["MOD-POS-001","关键岗位履职评价模型","岗位","岗位",26,100,"v1.2","已发布",36,"2026-06-30 12:35","张强","2026-06-04 09:20","2026-06-28 11:45","2026-06-26 15:40"],
  ["MOD-COM-001","企业风险管控综合模型","综合","综合对象",65,100,"v1.0","版本中",6,"2026-06-24 10:00","赵敏","2026-06-10 14:30","2026-06-24 09:30","2026-06-20 09:00"],
  ["MOD-PRO-002","地下工程安全评价模型","项目","项目",47,100,"v1.4","已发布",12,"2026-06-26 08:40","陈晨","2026-05-28 15:20","2026-06-25 18:00","2026-06-24 17:20"],
  ["MOD-SUP-002","设备安全评价模型","供应链","供应链",22,96,"v0.9","草稿",0,"-","沈洁","2026-06-18 10:00","2026-06-27 13:20","-"],
  ["MOD-POS-002","安全岗位配置评价模型","岗位","岗位",18,100,"v1.1","已发布",15,"2026-06-12 08:50","刘洋","2026-06-05 11:05","2026-06-21 17:16","2026-06-18 16:00"],
  ["MOD-ENT-002","年度安全评价模型","企业","企业",54,100,"v1.8","已停用",2,"2026-06-18 09:00","系统管理员","2026-04-12 09:30","2026-06-17 15:40","2026-06-10 09:00"],
  ["MOD-COM-002","专项风险评价模型","综合","项目",39,100,"v1.0","已发布",7,"2026-06-15 14:00","陈晨","2026-06-06 13:15","2026-06-14 17:15","2026-06-12 10:00"],
  ["MOD-PRO-003","轨交施工评价模型","项目","项目",44,100,"v2.1","版本中",9,"2026-06-28 18:10","李明","2026-05-25 13:45","2026-06-28 18:10","2026-06-23 11:00"],
  ["MOD-SUP-003","分包单位月度安全评价模型","供应链","供应链",28,100,"v1.3","草稿",0,"-","王佳","2026-06-19 09:10","2026-06-30 10:05","-"]
].map((row,index)=>({
  id:index+1,
  modelCode:row[0],
  modelName:row[1],
  modelType:row[2],
  objectType:row[3],
  indicatorCount:row[4],
  totalWeight:row[5],
  currentVersion:row[6],
  versionRecordCount:Number(String(row[6]).match(/\d+/)?.[0] || 1),
  modelStatus:row[7],
  taskUsageCount:row[8],
  lastExecuteTime:row[9],
  creator:row[10],
  createTime:row[11],
  updateTime:row[12],
  publishTime:row[13]
}));

const safetyEvalModelState={
  modelName:"",
  modelCode:"",
  modelStatus:"",
  objectType:"",
  creator:"",
  publishStartTime:"",
  publishEndTime:"",
  page:1,
  pageSize:10
};

function safetyEvalModelTypeTag(value){
  return tag(value,({企业:"blue",项目:"green",供应链:"orange",岗位:"purple",综合:"cyan",综合对象:"cyan"})[value] || "gray");
}

function safetyEvalModelStatusTag(value){
  return tag(value,({草稿:"gray",已发布:"green",已停用:"red",版本中:"orange"})[value] || "gray");
}

tableColumnDefinitions.safetyEvalModel=[
  {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalModelState.page-1)*safetyEvalModelState.pageSize+index+1},
  {key:"modelCode",title:"模型编码",width:140,align:"left",render:row=>row.modelCode},
  {key:"modelName",title:"模型名称",width:230,align:"left",render:row=>`<a class="link" onclick="openSafetyEvalModelDetail(${row.id})">${row.modelName}</a>`},
  {key:"objectType",title:"适用对象类型",width:130,align:"center",render:row=>safetyEvalModelTypeTag(row.objectType)},
  {key:"indicatorCount",title:"指标数量",width:100,align:"center",render:row=>row.indicatorCount},
  {key:"totalWeight",title:"权重总和",width:100,align:"center",render:row=>`${row.totalWeight}%`},
  {key:"currentVersion",title:"当前版本",width:110,align:"center",render:row=>row.currentVersion},
  {key:"versionRecordCount",title:"版本记录",width:100,align:"center",render:row=>row.versionRecordCount},
  {key:"modelStatus",title:"发布状态",width:110,align:"center",render:row=>safetyEvalModelStatusTag(row.modelStatus)},
  {key:"taskUsageCount",title:"使用任务数",width:110,align:"center",render:row=>row.taskUsageCount},
  {key:"lastExecuteTime",title:"最近执行时间",width:170,align:"center",render:row=>row.lastExecuteTime},
  {key:"creator",title:"创建人",width:110,align:"center",render:row=>row.creator},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"updateTime",title:"更新时间",width:170,align:"center",render:row=>row.updateTime},
  {key:"operation",title:"操作",width:320,align:"center",render:row=>`
    <a class="link" onclick="showToast('编辑模型：${row.modelName}')">编辑</a>
    <a class="link" onclick="openSafetyEvalModelDetail(${row.id})">查看</a>
    <a class="link" onclick="showToast('配置指标：${row.modelName}')">配置指标</a>
    <a class="link" onclick="publishSafetyEvalModel(${row.id})">发布</a>
    <a class="link" onclick="toggleSafetyEvalModelStatus(${row.id})">${row.modelStatus==="已停用"?"启用":"停用"}</a>
    <a class="link" onclick="copySafetyEvalModel(${row.id})">复制</a>
    <a class="link danger-link" onclick="deleteSafetyEvalModel(${row.id})">删除</a>
  `}
];

function renderSafetyEvalModelOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function getSafetyEvalModelFilteredRows(){
  const s=safetyEvalModelState;
  return safetyEvalModelRows.filter(row=>{
    if(s.modelName&&!row.modelName.includes(s.modelName))return false;
    if(s.modelCode&&!row.modelCode.includes(s.modelCode))return false;
    if(s.modelStatus&&row.modelStatus!==s.modelStatus)return false;
    if(s.objectType&&row.objectType!==s.objectType)return false;
    if(s.creator&&!row.creator.includes(s.creator))return false;
    if(s.publishStartTime&&row.publishTime!=="-"&&row.publishTime.slice(0,10)<s.publishStartTime)return false;
    if(s.publishStartTime&&row.publishTime==="-")return false;
    if(s.publishEndTime&&row.publishTime!=="-"&&row.publishTime.slice(0,10)>s.publishEndTime)return false;
    if(s.publishEndTime&&row.publishTime==="-")return false;
    return true;
  });
}

function querySafetyEvalModels(){
  safetyEvalModelState.modelName=document.getElementById("semName")?.value.trim() || "";
  safetyEvalModelState.modelCode=document.getElementById("semCode")?.value.trim() || "";
  safetyEvalModelState.modelStatus=document.getElementById("semStatus")?.value || "";
  safetyEvalModelState.objectType=document.getElementById("semObjectType")?.value || "";
  safetyEvalModelState.creator=document.getElementById("semCreator")?.value.trim() || "";
  safetyEvalModelState.publishStartTime=document.getElementById("semPublishStart")?.value || "";
  safetyEvalModelState.publishEndTime=document.getElementById("semPublishEnd")?.value || "";
  safetyEvalModelState.page=1;
  renderSafetyEvaluationModelPage();
}

function resetSafetyEvalModels(){
  Object.assign(safetyEvalModelState,{modelName:"",modelCode:"",modelStatus:"",objectType:"",creator:"",publishStartTime:"",publishEndTime:"",page:1});
  renderSafetyEvaluationModelPage();
}

function changeSafetyEvalModelPage(dir){
  const total=getSafetyEvalModelFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalModelState.pageSize));
  safetyEvalModelState.page=Math.min(max,Math.max(1,safetyEvalModelState.page+dir));
  renderSafetyEvaluationModelPage();
}

function publishSafetyEvalModel(id){
  const row=safetyEvalModelRows.find(item=>item.id===Number(id));
  if(row){
    row.modelStatus="已发布";
    row.publishTime="2026-07-02 09:20";
    row.versionRecordCount=(row.versionRecordCount || 0)+1;
    showToast(`已发布模型：${row.modelName}`);
  }
  renderSafetyEvaluationModelPage();
}

function toggleSafetyEvalModelStatus(id){
  const row=safetyEvalModelRows.find(item=>item.id===Number(id));
  if(row){
    row.modelStatus=row.modelStatus==="已停用"?"已发布":"已停用";
    showToast(`${row.modelStatus==="已停用"?"已停用":"已启用"}模型：${row.modelName}`);
  }
  renderSafetyEvaluationModelPage();
}

function copySafetyEvalModel(id){
  const row=safetyEvalModelRows.find(item=>item.id===Number(id));
  showToast(`复制模型演示：${row?.modelName || id}`);
}

function deleteSafetyEvalModel(id){
  const row=safetyEvalModelRows.find(item=>item.id===Number(id));
  showToast(`删除模型演示：${row?.modelName || id}`);
}

const safetyEvalModelDimensionTemplate=[
  {name:"信息保障",score:20,color:"blue",children:[
    {code:"INF-01",name:"实名系统开通",type:"评价因子",method:"自动计算",source:"实名制人员到岗数据",score:5,deduct:"否"},
    {code:"INF-02",name:"实名证 4 要素一致性",type:"评价因子",method:"自动计算",source:"实名制四要素校验数据",score:5,deduct:"否"},
    {code:"INF-03",name:"监控视频在线",type:"评价因子",method:"自动计算",source:"视频监控在线数据",score:5,deduct:"否"},
    {code:"INF-04",name:"监控视频开通",type:"评价因子",method:"自动计算",source:"视频监控在线数据",score:5,deduct:"否"}
  ]},
  {name:"现场管控",score:30,color:"green",children:[
    {code:"SITE-01",name:"隐患整改闭环",type:"评价因子",method:"自动计算",source:"隐患整改闭环数据",score:7.5,deduct:"是"},
    {code:"SITE-02",name:"重复隐患发生",type:"评价维度",method:"规则计算",source:"重复隐患发生数据",score:7.5,deduct:"是"},
    {code:"SITE-03",name:"安全每日监督",type:"评价因子",method:"手动计算",source:"人工填报",score:7.5,deduct:"否"},
    {code:"SITE-04",name:"关键岗位在岗",type:"评价因子",method:"自动计算",source:"实名制人员到岗数据",score:7.5,deduct:"是"}
  ]},
  {name:"组织行为",score:20,color:"orange",children:[
    {code:"ORG-01",name:"全员责任出勤",type:"评价因子",method:"自动计算",source:"实名制人员到岗数据",score:6.7,deduct:"否"},
    {code:"ORG-02",name:"专职岗位配置",type:"评价维度",method:"规则计算",source:"岗位配置数据",score:6.7,deduct:"否"},
    {code:"ORG-03",name:"安全总监配置",type:"评价因子",method:"手动计算",source:"人工填报",score:6.6,deduct:"否"}
  ]},
  {name:"技经融合",score:20,color:"purple",children:[
    {code:"ECO-01",name:"技术方案审批",type:"评价因子",method:"自动计算",source:"技术方案审批数据",score:5,deduct:"否"},
    {code:"ECO-02",name:"分包分供预警",type:"评价维度",method:"规则计算",source:"分包分供预警数据",score:5,deduct:"是"},
    {code:"ECO-03",name:"项目潜亏预警",type:"评价维度",method:"规则计算",source:"项目潜亏预警数据",score:5,deduct:"是"},
    {code:"ECO-04",name:"保险理赔止损",type:"评价因子",method:"手动计算",source:"人工填报",score:5,deduct:"否"}
  ]},
  {name:"溯源问效",score:10,color:"cyan",children:[
    {code:"TRACE-01",name:"人身伤亡事故",type:"评价维度",method:"规则计算",source:"事故上报数据",score:3.4,deduct:"是"},
    {code:"TRACE-02",name:"事故迟报瞒报",type:"评价维度",method:"规则计算",source:"安全监督数据",score:3.3,deduct:"是"},
    {code:"TRACE-03",name:"重大舆情事件",type:"评价因子",method:"手动计算",source:"人工填报",score:3.3,deduct:"否"}
  ]}
];

function getSafetyEvalModelGroupScore(group){
  return Number(group.children.reduce((sum,item)=>sum+(Number(item.score)||0),0).toFixed(1));
}

function formatSafetyEvalModelScore(value){
  return Number.isInteger(Number(value)) ? String(Number(value)) : String(Number(value).toFixed(1));
}

function getSafetyEvalModelStats(model){
  const dimensions=safetyEvalModelDimensionTemplate;
  const childRows=dimensions.flatMap(group=>group.children);
  return {
    dimensionCount:dimensions.length,
    indicatorCount:model.indicatorCount || childRows.length,
    totalScore:model.totalWeight || dimensions.reduce((sum,item)=>sum+getSafetyEvalModelGroupScore(item),0),
    basicCount:childRows.filter(item=>item.type==="评价因子").length,
    compositeCount:childRows.filter(item=>item.type==="评价维度").length,
    autoCount:childRows.filter(item=>item.method==="自动计算").length,
    manualCount:childRows.filter(item=>item.method==="手动计算").length
  };
}

function renderSafetyEvalModelMetric(label,value,unit,type="blue"){
  return `
    <div class="model-detail-metric">
      <span class="summary-icon ${type}">▣</span>
      <div><p>${label}</p><strong>${value}<em>${unit}</em></strong></div>
    </div>
  `;
}

function renderSafetyEvalModelStructure(activeIndex=0){
  const activeGroup=safetyEvalModelDimensionTemplate[activeIndex] || safetyEvalModelDimensionTemplate[0];
  return `
    <section class="model-detail-structure">
      <div class="model-detail-tree">
        <h4>模型结构</h4>
        <div class="model-detail-tree-list">
          ${safetyEvalModelDimensionTemplate.map((group,index)=>`
            <button class="${index===activeIndex?"active":""}" onclick="renderSafetyEvalModelIndicators(${index})">
              <span>${index+1}. ${group.name}</span><b>${formatSafetyEvalModelScore(getSafetyEvalModelGroupScore(group))}分</b>
            </button>
            <div class="model-detail-tree-children">
              ${group.children.map((item,childIndex)=>`<span>${index+1}.${childIndex+1} ${item.name}<em>${formatSafetyEvalModelScore(item.score)}分</em></span>`).join("")}
            </div>
          `).join("")}
        </div>
      </div>
      <div class="model-detail-indicators" id="modelDetailIndicators">
        ${renderSafetyEvalModelIndicatorPanel(activeIndex)}
      </div>
    </section>
  `;
}

function renderSafetyEvalModelIndicatorPanel(activeIndex=0){
  const group=safetyEvalModelDimensionTemplate[activeIndex] || safetyEvalModelDimensionTemplate[0];
  return `
    <div class="model-detail-indicator-head">
      <h4>指标列表（${group.name}）</h4>
      <span>共 ${group.children.length} 条，合计 ${formatSafetyEvalModelScore(getSafetyEvalModelGroupScore(group))} 分</span>
    </div>
    <table class="safety-eval-detail-table model-detail-indicator-table">
      <thead>
        <tr><th>指标编码</th><th>指标名称</th><th>指标类型</th><th>数据来源</th><th>计算方式</th><th>分值</th><th>是否扣分</th></tr>
      </thead>
      <tbody>
        ${group.children.map(item=>`
          <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${tag(item.type,item.type==="评价因子"?"blue":"purple")}</td>
            <td>${item.source}</td>
            <td>${tag(item.method,item.method==="自动计算"?"green":item.method==="规则计算"?"orange":"gray")}</td>
            <td>${formatSafetyEvalModelScore(item.score)}</td>
            <td>${item.deduct}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderSafetyEvalModelIndicators(activeIndex){
  const panel=document.getElementById("modelDetailIndicators");
  if(panel)panel.innerHTML=renderSafetyEvalModelIndicatorPanel(activeIndex);
  document.querySelectorAll(".model-detail-tree-list > button").forEach((button,index)=>{
    button.classList.toggle("active",index===Number(activeIndex));
  });
}

function openSafetyEvalModelDetail(id){
  const model=safetyEvalModelRows.find(item=>item.id===Number(id)) || safetyEvalModelRows[0];
  const stats=getSafetyEvalModelStats(model);
  const html=`
    <div class="safety-eval-detail-page model-detail-page">
      <section class="safety-eval-detail-hero">
        <div class="detail-hero-top">
          <div>
            <h3 class="model-detail-title-line"><span>${model.modelName}</span>${safetyEvalModelStatusTag(model.modelStatus)}<span class="detail-soft-tag">${model.currentVersion}</span></h3>
          </div>
          <span class="detail-update">最近执行：${model.lastExecuteTime}</span>
        </div>
        <div class="detail-info-grid model-detail-info-grid">
          <span>模型编号：<b>${model.modelCode}</b></span>
          <span>适用对象：<b>${model.objectType}</b></span>
          <span>创建人：<b>${model.creator}</b></span>
          <span>创建时间：<b>${model.createTime}</b></span>
          <span>更新时间：<b>${model.updateTime}</b></span>
          <span>发布时间：<b>${model.publishTime}</b></span>
        </div>
      </section>
      <section class="model-detail-metrics">
        ${renderSafetyEvalModelMetric("指标总数",stats.indicatorCount,"个","blue")}
        ${renderSafetyEvalModelMetric("总分值",stats.totalScore,"分","orange")}
        ${renderSafetyEvalModelMetric("评价因子",stats.basicCount,"个","green")}
        ${renderSafetyEvalModelMetric("评价维度",stats.compositeCount,"个","purple")}
        ${renderSafetyEvalModelMetric("自动计算",stats.autoCount,"个","blue")}
        ${renderSafetyEvalModelMetric("人工填写",stats.manualCount,"个","orange")}
      </section>
      ${renderSafetyEvalModelStructure(0)}
    </div>
  `;
  openModal("模型详情",html,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

function renderSafetyEvalModelTable(rows){
  const columns=getVisibleColumns("safetyEvalModel");
  return `
    <table class="safety-eval-model-table" style="min-width:${getTableMinWidth("safetyEvalModel")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalModel")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationModelPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalModelFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalModelState.pageSize));
  safetyEvalModelState.page=Math.min(safetyEvalModelState.page,totalPages);
  const start=(safetyEvalModelState.page-1)*safetyEvalModelState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalModelState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 评价模型</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>模型名称</label><input class="input" id="semName" value="${escapeAttr(safetyEvalModelState.modelName)}" placeholder="支持模糊搜索"/></div>
      <div class="form-item"><label>模型编码</label><input class="input" id="semCode" value="${escapeAttr(safetyEvalModelState.modelCode)}" placeholder="请输入唯一编码"/></div>
      <div class="form-item"><label>模型状态</label><select class="select" id="semStatus">${renderSafetyEvalModelOptions(safetyEvalModelOptions.status,safetyEvalModelState.modelStatus,"全部")}</select></div>
      <div class="form-item"><label>适用对象类型</label><select class="select" id="semObjectType">${renderSafetyEvalModelOptions(safetyEvalModelOptions.objectTypes,safetyEvalModelState.objectType,"全部")}</select></div>
      <div class="form-item"><label>创建人</label><input class="input" id="semCreator" value="${escapeAttr(safetyEvalModelState.creator)}" placeholder="支持搜索"/></div>
      <div class="form-item"><label>发布时间-开始</label><input class="input" type="date" id="semPublishStart" value="${escapeAttr(safetyEvalModelState.publishStartTime)}"/></div>
      <div class="form-item"><label>发布时间-结束</label><input class="input" type="date" id="semPublishEnd" value="${escapeAttr(safetyEvalModelState.publishEndTime)}"/></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalModels()",resetFn:"resetSafetyEvalModels()",gridClass:"search-grid"})}
    <section class="card table-card safety-eval-model-card">
      <div class="card-hd">
        <div class="card-title">评价模型列表</div>
        <div class="actions">
          <button class="btn primary" onclick="showToast('新增评价模型功能演示')">新增模型</button>
          <button class="btn" onclick="showToast('批量发布功能演示')">批量发布</button>
          <button class="btn" onclick="showToast('导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalModel','renderSafetyEvaluationModelPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalModelTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalModelPage(-1)" ${safetyEvalModelState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalModelState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalModelPage(1)" ${safetyEvalModelState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalModelState.pageSize=Number(this.value);safetyEvalModelState.page=1;renderSafetyEvaluationModelPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalModelState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

function getCurrentEvalMonth(){
  const date=new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}

const safetyEvalResultOptions={
  objectTypes:["子公司","分公司","项目","供应链","岗位"],
  companies:getOrganizationCompanies(),
  branches:getOrganizationBranchOptions(),
  models:["集团安全评价模型","施工项目周评价模型","供应链安全履约评价模型","关键岗位履职评价模型","专项风险评价模型"],
  riskLevels:["风险极高","风险较高","风险可控"],
  status:["待确认","已确认","已归档"]
};

const safetyEvalResultRows=[
  ["RES-202607-001","2026-07","两湖隧道（东湖段）主体及附属配套工程施工2标","项目","市政集团","上海分公司","施工项目周评价模型","v2.3",86,"风险可控",18.5,18.5,18.5,18.5,18.5,5.2,3,"已确认","2026-07-01 09:20"],
  ["RES-202607-002","2026-07","武汉市轨道交通12号线科普公园站土建预埋工程","项目","上海隧道","轨交分公司","施工项目周评价模型","v2.3",74,"风险可控",16.5,14.5,15.0,14.0,14.0,-3.2,6,"待确认","2026-07-01 09:25"],
  ["RES-202607-003","2026-07","上海路桥","子公司","上海路桥","-","集团安全评价模型","v2.0",94.5,"风险可控",19.0,18.5,19.5,18.5,19.0,2.4,1,"已归档","2026-07-01 10:05"],
  ["RES-202607-004","2026-07","杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段","项目","上海路桥","道路分公司","专项风险评价模型","v1.0",42,"风险极高",8.5,7.0,10.0,8.0,8.5,3.0,12,"待确认","2026-07-01 10:15"],
  ["RES-202607-005","2026-07","新马工业园节能环保产业园项目","项目","市政集团","湖南分公司","施工项目周评价模型","v2.3",58,"风险较高",12.0,9.5,11.0,13.0,12.5,2.0,9,"待确认","2026-07-01 10:22"],
  ["RES-202607-006","2026-07","上海XXX劳务有限公司","供应链","上海隧道","轨交分公司","供应链安全履约评价模型","v1.6",67,"风险较高",13.5,12.0,14.0,13.0,14.5,-1.5,7,"已确认","2026-07-01 10:30"],
  ["RES-202607-007","2026-07","项目经理岗位","岗位","市政集团","上海分公司","关键岗位履职评价模型","v1.2",91,"风险可控",18.0,18.5,19.0,17.5,18.0,4.1,2,"已确认","2026-07-01 10:36"],
  ["RES-202607-008","2026-07","城市环境","子公司","城市环境","-","集团安全评价模型","v2.0",89.5,"风险可控",17.5,18.0,18.5,17.5,18.0,1.3,2,"已归档","2026-07-01 10:42"],
  ["RES-202607-009","2026-07","苏州河综合治理三期工程","项目","城市环境","水务建设管道分公司","施工项目周评价模型","v2.3",62,"风险较高",12.5,11.0,13.5,12.0,13.0,-2.8,8,"待确认","2026-07-01 10:48"],
  ["RES-202607-010","2026-07","专职安全员岗位","岗位","上海隧道","轨交分公司","关键岗位履职评价模型","v1.2",88,"风险可控",17.5,17.0,18.5,17.0,18.0,3.6,2,"已确认","2026-07-01 10:55"],
  ["RES-202606-011","2026-06","市政集团","子公司","市政集团","-","集团安全评价模型","v2.0",95.5,"风险可控",19.5,19.0,19.0,19.0,19.0,1.6,1,"已归档","2026-06-30 18:00"],
  ["RES-202606-012","2026-06","城环设备租赁单位","供应链","城市环境","环境建设公司","供应链安全履约评价模型","v1.6",49,"风险极高",9.0,8.0,10.5,10.0,11.5,-4.4,13,"已确认","2026-06-30 17:30"]
].map((row,index)=>({
  id:index+1,
  resultCode:row[0],
  evalMonth:row[1],
  objectName:row[2],
  objectType:row[3],
  companyName:row[4],
  branchName:row[5],
  modelName:row[6],
  modelId:row[6],
  modelVersion:row[7],
  taskName:row[3]==="项目"?"施工项目月度安全评价任务":row[3]==="供应链"?"供应链安全履约专项评价":row[3]==="岗位"?"关键岗位履职季度评价":"集团月度安全评价任务",
  evaluatedObjectCount:row[3]==="项目"?10:row[3]==="供应链"?18:row[3]==="岗位"?12:8,
  indicatorCount:({ "集团安全评价模型":42,"施工项目周评价模型":58,"供应链安全履约评价模型":31,"关键岗位履职评价模型":26,"专项风险评价模型":39 })[row[6]] || 30,
  totalScore:row[8],
  riskLevel:row[9],
  infoSecurityScore:row[10],
  siteControlScore:row[11],
  orgBehaviorScore:row[12],
  techEconomicScore:row[13],
  traceabilityScore:row[14],
  monthOnMonthChange:row[15],
  deductionFactorCount:row[16],
  resultStatus:row[17],
  calculateTime:row[18],
  confirmTime:row[17]==="待确认"?"-":row[18]
}));

const safetyEvalResultState={
  evalMonth:getCurrentEvalMonth(),
  resultCode:"",
  objectName:"",
  objectType:"",
  companyName:"",
  branchName:"",
  modelId:"",
  riskLevel:"",
  resultStatus:"",
  scoreMin:"",
  scoreMax:"",
  page:1,
  pageSize:10
};

function safetyEvalRiskTag(value){
  return tag(value,value==="风险极高"?"red":value==="风险较高"?"orange":"green");
}

function safetyEvalResultStatusTag(value){
  return tag(value,({待确认:"orange",已确认:"green",已归档:"blue"})[value] || "gray");
}

function renderSafetyEvalResultTrend(value){
  const num=Number(value)||0;
  const color=num>=0?"#ff4d4f":"#12b76a";
  const arrow=num>=0?"↑":"↓";
  return `<span style="color:${color};font-weight:700">${arrow} ${Math.abs(num).toFixed(1)}</span>`;
}

tableColumnDefinitions.safetyEvalResult=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalResultState.page-1)*safetyEvalResultState.pageSize+index+1},
  {key:"resultCode",title:"结果编号",width:150,align:"left",render:row=>row.resultCode},
  {key:"taskName",title:"评价任务",width:210,align:"left",render:row=>row.taskName},
  {key:"modelName",title:"评价模型",width:190,align:"left",render:row=>row.modelName},
  {key:"modelVersion",title:"模型版本",width:100,align:"center",render:row=>row.modelVersion},
  {key:"objectType",title:"评价对象",width:190,align:"center",render:row=>`${safetyEvalModelTypeTag(row.objectType==="子公司"?"企业":row.objectType==="分公司"?"企业":row.objectType)}<span style="margin-left:6px;color:#667085">${row.objectName}</span>`},
  {key:"evaluatedObjectCount",title:"评价对象数",width:110,align:"center",render:row=>row.evaluatedObjectCount},
  {key:"indicatorCount",title:"评价指标数",width:110,align:"center",render:row=>row.indicatorCount},
  {key:"totalScore",title:"综合得分",width:100,align:"center",render:row=>row.totalScore},
  {key:"resultStatus",title:"评价结果",width:110,align:"center",render:row=>safetyEvalResultStatusTag(row.resultStatus)},
  {key:"calculateTime",title:"评价时间",width:170,align:"center",render:row=>row.calculateTime},
  {key:"confirmTime",title:"确认时间",width:170,align:"center",render:row=>row.confirmTime},
  {key:"operation",title:"操作",width:220,align:"center",render:row=>`
    <a class="link" onclick="showSafetyEvalResultDetail(${row.id})">查看详情</a>
    <a class="link" onclick="confirmSafetyEvalResult(${row.id})">确认结果</a>
    <a class="link" onclick="exportSafetyEvalResult(${row.id})">导出报告</a>
  `}
];

function renderSafetyEvalResultOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function getSafetyEvalResultFilteredRows(){
  const s=safetyEvalResultState;
  const min=s.scoreMin===""?null:Number(s.scoreMin);
  const max=s.scoreMax===""?null:Number(s.scoreMax);
  return safetyEvalResultRows.filter(row=>{
    if(s.evalMonth&&row.evalMonth!==s.evalMonth)return false;
    if(s.resultCode&&!row.resultCode.includes(s.resultCode))return false;
    if(s.objectName&&!row.objectName.includes(s.objectName))return false;
    if(s.objectType&&row.objectType!==s.objectType)return false;
    if(s.companyName&&row.companyName!==s.companyName)return false;
    if(s.branchName&&row.branchName!==s.branchName)return false;
    if(s.modelId&&row.modelId!==s.modelId)return false;
    if(s.riskLevel&&row.riskLevel!==s.riskLevel)return false;
    if(s.resultStatus&&row.resultStatus!==s.resultStatus)return false;
    if(min!==null&&row.totalScore<min)return false;
    if(max!==null&&row.totalScore>max)return false;
    return true;
  });
}

function querySafetyEvalResults(){
  safetyEvalResultState.evalMonth=document.getElementById("serMonth")?.value || "";
  safetyEvalResultState.resultCode=document.getElementById("serCode")?.value.trim() || "";
  safetyEvalResultState.objectName=document.getElementById("serObject")?.value.trim() || "";
  safetyEvalResultState.objectType=document.getElementById("serObjectType")?.value || "";
  safetyEvalResultState.companyName=document.getElementById("serCompany")?.value || "";
  safetyEvalResultState.branchName=document.getElementById("serBranch")?.value || "";
  safetyEvalResultState.modelId=document.getElementById("serModel")?.value || "";
  safetyEvalResultState.riskLevel=document.getElementById("serRisk")?.value || "";
  safetyEvalResultState.resultStatus=document.getElementById("serStatus")?.value || "";
  safetyEvalResultState.scoreMin=document.getElementById("serScoreMin")?.value || "";
  safetyEvalResultState.scoreMax=document.getElementById("serScoreMax")?.value || "";
  safetyEvalResultState.page=1;
  renderSafetyEvaluationResultPage();
}

function resetSafetyEvalResults(){
  Object.assign(safetyEvalResultState,{evalMonth:getCurrentEvalMonth(),resultCode:"",objectName:"",objectType:"",companyName:"",branchName:"",modelId:"",riskLevel:"",resultStatus:"",scoreMin:"",scoreMax:"",page:1});
  renderSafetyEvaluationResultPage();
}

function changeSafetyEvalResultPage(dir){
  const total=getSafetyEvalResultFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalResultState.pageSize));
  safetyEvalResultState.page=Math.min(max,Math.max(1,safetyEvalResultState.page+dir));
  renderSafetyEvaluationResultPage();
}

function showSafetyEvalResultDetail(id){
  const row=safetyEvalResultRows.find(item=>item.id===Number(id));
  if(!row)return;
  showToast(`查看评价详情：${row.objectName}`);
}

function confirmSafetyEvalResult(id){
  const row=safetyEvalResultRows.find(item=>item.id===Number(id));
  if(row){
    row.resultStatus="已确认";
    row.confirmTime="2026-07-02 09:30";
    showToast(`已确认结果：${row.resultCode}`);
  }
  renderSafetyEvaluationResultPage();
}

function exportSafetyEvalResult(id){
  const row=safetyEvalResultRows.find(item=>item.id===Number(id));
  showToast(`导出报告成功：${row?.resultCode || id}`);
}

function renderSafetyEvalResultTable(rows){
  const columns=getVisibleColumns("safetyEvalResult");
  return `
    <table class="safety-eval-result-table" style="min-width:${getTableMinWidth("safetyEvalResult")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalResult")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationResultPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalResultFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalResultState.pageSize));
  safetyEvalResultState.page=Math.min(safetyEvalResultState.page,totalPages);
  const start=(safetyEvalResultState.page-1)*safetyEvalResultState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalResultState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 评价结果管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>评价月份</label><input class="input" type="month" id="serMonth" value="${escapeAttr(safetyEvalResultState.evalMonth)}"/></div>
      <div class="form-item"><label>结果编号</label><input class="input" id="serCode" value="${escapeAttr(safetyEvalResultState.resultCode)}" placeholder="支持模糊搜索"/></div>
      <div class="form-item"><label>评价对象</label><input class="input" id="serObject" value="${escapeAttr(safetyEvalResultState.objectName)}" placeholder="支持项目/组织名称搜索"/></div>
      <div class="form-item"><label>对象类型</label><select class="select" id="serObjectType">${renderSafetyEvalResultOptions(safetyEvalResultOptions.objectTypes,safetyEvalResultState.objectType,"全部")}</select></div>
      <div class="form-item"><label>所属子公司</label><select class="select" id="serCompany">${renderSafetyEvalResultOptions(safetyEvalResultOptions.companies,safetyEvalResultState.companyName,"全部")}</select></div>
      <div class="form-item"><label>所属分公司</label><select class="select" id="serBranch">${renderSafetyEvalResultOptions(safetyEvalResultOptions.branches,safetyEvalResultState.branchName,"全部")}</select></div>
      <div class="form-item"><label>评价模型</label><select class="select" id="serModel">${renderSafetyEvalResultOptions(safetyEvalResultOptions.models,safetyEvalResultState.modelId,"全部")}</select></div>
      <div class="form-item"><label>风险等级</label><select class="select" id="serRisk">${renderSafetyEvalResultOptions(safetyEvalResultOptions.riskLevels,safetyEvalResultState.riskLevel,"全部")}</select></div>
      <div class="form-item"><label>结果状态</label><select class="select" id="serStatus">${renderSafetyEvalResultOptions(safetyEvalResultOptions.status,safetyEvalResultState.resultStatus,"全部")}</select></div>
      <div class="form-item"><label>得分区间</label><div style="display:flex;align-items:center;gap:6px"><input class="input" type="number" id="serScoreMin" value="${escapeAttr(safetyEvalResultState.scoreMin)}" placeholder="最低"/><span>-</span><input class="input" type="number" id="serScoreMax" value="${escapeAttr(safetyEvalResultState.scoreMax)}" placeholder="最高"/></div></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalResults()",resetFn:"resetSafetyEvalResults()",gridClass:"search-grid"})}
    <section class="card table-card safety-eval-result-card">
      <div class="card-hd">
        <div class="card-title">评价结果列表</div>
        <div class="actions">
          <button class="btn" onclick="showToast('批量确认功能演示')">批量确认</button>
          <button class="btn" onclick="showToast('批量归档功能演示')">批量归档</button>
          <button class="btn" onclick="showToast('导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalResult','renderSafetyEvaluationResultPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalResultTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalResultPage(-1)" ${safetyEvalResultState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalResultState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalResultPage(1)" ${safetyEvalResultState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalResultState.pageSize=Number(this.value);safetyEvalResultState.page=1;renderSafetyEvaluationResultPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalResultState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

const safetyEvalSourceOptions={
  categories:["自动采集","手工填报"],
  systems:["实名制系统","视频监控系统","隐患管理系统","安全每日监督","分包管理系统","保险管理系统","经济管理系统"],
  dataStatus:["正常","异常","缺失"],
  syncStatus:["已同步","同步中","同步失败"],
  yesNo:["是","否"],
  indicatorTypes:["自动指标","规则指标","评价维度"],
  referenceStatus:["已引用","未引用"],
  fieldTypes:["数值","文本","日期","布尔","枚举"]
};

const safetyEvalSourceRows=[
  ["SRC-REAL-001","实名制人员到岗数据","FIELD-REAL-001","关键岗位到岗率","数值","自动采集","实名制系统","2026-07-02 08:30","2026-07-02 08:35","正常","已同步",98,"是",3,"关键岗位在岗","自动指标","已引用","是","影响现场管控模型、施工项目周评价任务","2026-05-20 09:30"],
  ["SRC-REAL-002","实名制四要素校验数据","FIELD-REAL-002","四要素一致性","布尔","自动采集","实名制系统","2026-07-02 08:20","2026-07-02 08:28","正常","已同步",96,"是",2,"实名四要素一致性","规则指标","已引用","是","影响信息保障维度评分","2026-05-22 10:15"],
  ["SRC-VIDEO-001","视频监控在线数据","FIELD-VIDEO-001","视频在线率","数值","自动采集","视频监控系统","2026-07-02 08:10","2026-07-02 08:18","异常","同步失败",72,"是",4,"监控视频在线","自动指标","已引用","否","影响视频开通及稳定在线指标、风险预警任务","2026-05-25 11:00"],
  ["SRC-HAZ-001","隐患整改闭环数据","FIELD-HAZ-001","整改闭环率","数值","自动采集","隐患管理系统","2026-07-02 08:40","2026-07-02 08:42","正常","已同步",99,"是",5,"隐患整改闭环","规则指标","已引用","是","影响现场管控模型","2026-06-01 09:10"],
  ["SRC-HAZ-002","重复隐患发生数据","FIELD-HAZ-002","重复隐患次数","数值","自动采集","隐患管理系统","2026-07-02 08:40","2026-07-02 08:42","正常","已同步",97,"是",3,"重复隐患发生","规则指标","已引用","是","影响现场管控模型、项目风险等级","2026-06-01 09:15"],
  ["SRC-SUP-001","分包人员配置数据","FIELD-SUP-001","分包安全员配置率","数值","自动采集","分包管理系统","2026-07-01 22:10","2026-07-02 08:00","缺失","同步失败",48,"是",2,"分包人员配置","评价维度","已引用","否","影响组织行为及现场管控维度","2026-06-05 14:00"],
  ["SRC-DAILY-001","安全每日监督填报数据","FIELD-DAILY-001","每日监督完成状态","枚举","手工填报","安全每日监督","2026-07-01 20:00","2026-07-01 20:05","正常","已同步",94,"是",2,"安全每日监督","评价维度","已引用","是","影响现场管控模型","2026-06-08 10:30"],
  ["SRC-INS-001","保险集中管理数据","FIELD-INS-001","保险覆盖状态","布尔","自动采集","保险管理系统","2026-07-01 18:10","2026-07-01 18:20","正常","同步中",88,"是",1,"保险集中管理","自动指标","已引用","是","影响信息保障维度","2026-06-10 09:45"],
  ["SRC-ECO-001","技术方案审批数据","FIELD-ECO-001","方案审批完成率","数值","自动采集","经济管理系统","2026-07-01 17:30","2026-07-01 17:50","正常","已同步",91,"是",2,"技术方案审批","规则指标","已引用","是","影响技经融合模型","2026-06-12 11:20"],
  ["SRC-MAN-001","重大舆情事件填报","FIELD-MAN-001","舆情事件等级","枚举","手工填报","安全每日监督","2026-06-30 17:00","2026-06-30 17:10","正常","已同步",100,"否",0,"","评价维度","未引用","否","暂未影响模型计算","2026-06-20 10:00"],
  ["SRC-REAL-003","工人工资核验数据","FIELD-REAL-003","工资表上传状态","布尔","自动采集","实名制系统","2026-07-02 08:30","2026-07-02 08:35","异常","已同步",76,"是",1,"工人工资核验","规则指标","已引用","否","影响现场管控模型、扣分因子计算","2026-06-22 13:40"],
  ["SRC-VIDEO-002","视频开通项目数据","FIELD-VIDEO-002","视频开通状态","布尔","自动采集","视频监控系统","2026-07-02 08:10","2026-07-02 08:18","正常","已同步",95,"是",2,"监控视频开通","自动指标","已引用","是","影响信息保障模型","2026-06-25 15:00"]
].map((row,index)=>({
  id:index+1,
  sourceCode:row[0],
  sourceName:row[1],
  sourceFieldCode:row[2],
  sourceFieldName:row[3],
  fieldType:row[4],
  sourceCategory:row[5],
  sourceSystem:row[6],
  syncRule:["每日8:00同步","每日8:00同步","每5分钟同步","每日8:30同步","每日8:30同步","每日22:00同步","每日20:00同步","每周周三12:00同步","每日18:00同步","手工触发同步","每日8:00同步","每5分钟同步"][index],
  dataUpdateTime:row[7],
  lastSyncTime:row[8],
  dataStatus:row[9],
  syncStatus:row[10],
  integrityRate:row[11],
  participateEvaluation:row[12],
  referencedIndicatorCount:row[13],
  referencedIndicatorName:row[14],
  referencedIndicatorType:row[15],
  referenceStatus:row[16],
  calculable:row[17],
  abnormalImpact:row[18],
  createTime:row[19]
}));

const safetyEvalSourceState={
  sourceName:"",
  sourceCode:"",
  sourceFieldCode:"",
  sourceFieldName:"",
  sourceCategory:"",
  sourceSystem:"",
  dataStatus:"",
  syncStatus:"",
  participateEvaluation:"",
  referencedIndicatorName:"",
  referencedIndicatorType:"",
  referenceStatus:"",
  updateStartTime:"",
  updateEndTime:"",
  page:1,
  pageSize:10
};

function safetyEvalSourceFieldTag(value){
  return tag(value,({数值:"blue",文本:"gray",日期:"green",布尔:"purple",枚举:"orange"})[value] || "gray");
}

function safetyEvalSourceCategoryTag(value){
  return tag(value,value==="自动采集"?"blue":"orange");
}

function safetyEvalSourceSystemTag(value){
  return tag(value,({实名制系统:"blue",视频监控系统:"purple",隐患管理系统:"orange",安全每日监督:"green",分包管理系统:"cyan",保险管理系统:"gray",经济管理系统:"red"})[value] || "gray");
}

function safetyEvalDataStatusTag(value){
  return tag(value,({正常:"green",异常:"orange",缺失:"red"})[value] || "gray");
}

function safetyEvalSyncStatusTag(value){
  return tag(value,({已同步:"green",同步中:"blue",同步失败:"red"})[value] || "gray");
}

function renderSafetyEvalSourceProgress(value){
  const num=Math.max(0,Math.min(100,Number(value)||0));
  const color=num>=90?"#165DFF":num>=70?"#ff9f1c":"#ff4d4f";
  return `<div style="display:flex;align-items:center;justify-content:center;gap:8px"><div style="width:82px;height:8px;background:#eef1f5;border-radius:8px;overflow:hidden"><div style="width:${num}%;height:100%;background:${color};border-radius:8px"></div></div><span>${num}%</span></div>`;
}

tableColumnDefinitions.safetyEvalSource=[
  {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalSourceState.page-1)*safetyEvalSourceState.pageSize+index+1},
  {key:"sourceFieldCode",title:"数据字段编码",width:150,align:"left",render:row=>row.sourceFieldCode},
  {key:"sourceFieldName",title:"数据字段名称",width:150,align:"left",render:row=>row.sourceFieldName},
  {key:"sourceSystem",title:"来源系统",width:130,align:"center",render:row=>safetyEvalSourceSystemTag(row.sourceSystem)},
  {key:"syncRule",title:"同步规则",width:170,align:"center",render:row=>row.syncRule},
  {key:"dataUpdateTime",title:"数据更新时间",width:170,align:"center",render:row=>row.dataUpdateTime},
  {key:"lastSyncTime",title:"最近同步时间",width:170,align:"center",render:row=>row.lastSyncTime},
  {key:"syncStatus",title:"同步状态",width:110,align:"center",render:row=>safetyEvalSyncStatusTag(row.syncStatus)},
  {key:"integrityRate",title:"数据完整率",width:140,align:"center",render:row=>renderSafetyEvalSourceProgress(row.integrityRate)},
  {key:"referencedIndicatorCount",title:"关联指标数",width:110,align:"center",render:row=>`<a class="link" onclick="showToast('查看关联指标：${row.sourceName}')">${row.referencedIndicatorCount}</a>`},
  {key:"abnormalImpact",title:"异常影响",width:260,align:"left",render:row=>`<span title="${escapeAttr(row.abnormalImpact)}">${row.abnormalImpact}</span>`},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"operation",title:"操作",width:230,align:"center",render:row=>`
    <a class="link" onclick="showToast('查看数据：${row.sourceName}')">查看数据</a>
    <a class="link" onclick="resyncSafetyEvalSource(${row.id})">重新同步</a>
    <a class="link" onclick="openSafetyEvalSourceSyncLog(${row.id})">同步日志</a>
  `}
];
try{localStorage.removeItem(getColumnStorageKey("safetyEvalSource"));}catch(e){}

function renderSafetyEvalSourceOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function getSafetyEvalSourceFilteredRows(){
  const s=safetyEvalSourceState;
  return safetyEvalSourceRows.filter(row=>{
    if(s.sourceFieldName&&!row.sourceFieldName.includes(s.sourceFieldName))return false;
    if(s.sourceFieldCode&&!row.sourceFieldCode.includes(s.sourceFieldCode))return false;
    if(s.sourceSystem&&row.sourceSystem!==s.sourceSystem)return false;
    if(s.syncStatus&&row.syncStatus!==s.syncStatus)return false;
    if(s.referencedIndicatorName&&!row.referencedIndicatorName.includes(s.referencedIndicatorName))return false;
    if(s.referencedIndicatorType&&row.referencedIndicatorType!==s.referencedIndicatorType)return false;
    if(s.referenceStatus&&row.referenceStatus!==s.referenceStatus)return false;
    if(s.updateStartTime&&row.dataUpdateTime.slice(0,10)<s.updateStartTime)return false;
    if(s.updateEndTime&&row.dataUpdateTime.slice(0,10)>s.updateEndTime)return false;
    return true;
  });
}

function querySafetyEvalSources(){
  safetyEvalSourceState.sourceFieldName=document.getElementById("sesField")?.value.trim() || "";
  safetyEvalSourceState.sourceFieldCode=document.getElementById("sesFieldCode")?.value.trim() || "";
  safetyEvalSourceState.sourceSystem=document.getElementById("sesSystem")?.value || "";
  safetyEvalSourceState.syncStatus=document.getElementById("sesSyncStatus")?.value || "";
  safetyEvalSourceState.referencedIndicatorName=document.getElementById("sesRefName")?.value.trim() || "";
  safetyEvalSourceState.referencedIndicatorType=document.getElementById("sesRefType")?.value || "";
  safetyEvalSourceState.referenceStatus=document.getElementById("sesRefStatus")?.value || "";
  safetyEvalSourceState.updateStartTime=document.getElementById("sesUpdateStart")?.value || "";
  safetyEvalSourceState.updateEndTime=document.getElementById("sesUpdateEnd")?.value || "";
  safetyEvalSourceState.page=1;
  renderSafetyEvaluationSourcePage();
}

function resetSafetyEvalSources(){
  Object.assign(safetyEvalSourceState,{sourceName:"",sourceCode:"",sourceFieldCode:"",sourceFieldName:"",sourceCategory:"",sourceSystem:"",dataStatus:"",syncStatus:"",participateEvaluation:"",referencedIndicatorName:"",referencedIndicatorType:"",referenceStatus:"",updateStartTime:"",updateEndTime:"",page:1});
  renderSafetyEvaluationSourcePage();
}

function changeSafetyEvalSourcePage(dir){
  const total=getSafetyEvalSourceFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalSourceState.pageSize));
  safetyEvalSourceState.page=Math.min(max,Math.max(1,safetyEvalSourceState.page+dir));
  renderSafetyEvaluationSourcePage();
}

function resyncSafetyEvalSource(id){
  const row=safetyEvalSourceRows.find(item=>item.id===Number(id));
  if(row){
    row.syncStatus="同步中";
    showToast(`已发起重新同步：${row.sourceName}`);
  }
  renderSafetyEvaluationSourcePage();
}

function openSafetyEvalSourceSyncLog(id){
  const row=safetyEvalSourceRows.find(item=>item.id===Number(id));
  if(!row)return;
  const failed=row.syncStatus==="同步失败";
  const logs=[
    {time:row.lastSyncTime,status:row.syncStatus,count:failed?0:1286,duration:failed?"12秒":"18秒",message:failed?"来源系统连接超时":"同步完成"},
    {time:"2026-07-01 08:00",status:"已同步",count:1248,duration:"17秒",message:"同步完成"},
    {time:"2026-06-30 08:00",status:"已同步",count:1221,duration:"16秒",message:"同步完成"}
  ];
  openModal("同步日志",`
    <div class="safety-eval-sync-log-summary"><span>数据字段</span><strong>${row.sourceFieldName}</strong><em>${row.sourceFieldCode}</em><b>${row.syncRule}</b></div>
    <div class="table-wrap">
      <table class="safety-eval-detail-table">
        <thead><tr><th>同步时间</th><th>同步状态</th><th>同步数据量</th><th>耗时</th><th>执行结果</th></tr></thead>
        <tbody>${logs.map(log=>`<tr><td>${log.time}</td><td>${safetyEvalSyncStatusTag(log.status)}</td><td>${log.count} 条</td><td>${log.duration}</td><td>${log.message}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

function renderSafetyEvalSourceTable(rows){
  const columns=getVisibleColumns("safetyEvalSource");
  return `
    <table class="safety-eval-source-table" style="min-width:${getTableMinWidth("safetyEvalSource")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalSource")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationSourcePage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalSourceFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalSourceState.pageSize));
  safetyEvalSourceState.page=Math.min(safetyEvalSourceState.page,totalPages);
  const start=(safetyEvalSourceState.page-1)*safetyEvalSourceState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalSourceState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 源数据管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>数据字段名称</label><input class="input" id="sesField" value="${escapeAttr(safetyEvalSourceState.sourceFieldName)}" placeholder="被评价引用的数据字段"/></div>
      <div class="form-item"><label>数据字段编码</label><input class="input" id="sesFieldCode" value="${escapeAttr(safetyEvalSourceState.sourceFieldCode)}" placeholder="请输入数据字段编码"/></div>
      <div class="form-item"><label>来源系统</label><select class="select" id="sesSystem">${renderSafetyEvalSourceOptions(safetyEvalSourceOptions.systems,safetyEvalSourceState.sourceSystem,"全部")}</select></div>
      <div class="form-item"><label>同步状态</label><select class="select" id="sesSyncStatus">${renderSafetyEvalSourceOptions(safetyEvalSourceOptions.syncStatus,safetyEvalSourceState.syncStatus,"全部")}</select></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalSources()",resetFn:"resetSafetyEvalSources()",gridClass:"search-grid"})}
    <section class="card table-card safety-eval-source-card">
      <div class="card-hd">
        <div class="card-title">源数据列表</div>
        <div class="actions">
          <button class="btn" onclick="showToast('批量同步功能演示')">批量同步</button>
          <button class="btn" onclick="showToast('异常重试功能演示')">异常重试</button>
          <button class="btn" onclick="showToast('导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalSource','renderSafetyEvaluationSourcePage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalSourceTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalSourcePage(-1)" ${safetyEvalSourceState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalSourceState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalSourcePage(1)" ${safetyEvalSourceState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalSourceState.pageSize=Number(this.value);safetyEvalSourceState.page=1;renderSafetyEvaluationSourcePage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalSourceState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

const safetyEvalTaskOptions={
  models:["集团安全评价模型","施工项目周评价模型","供应链安全履约评价模型","关键岗位履职评价模型","专项风险评价模型"],
  types:["企业","项目","供应链","岗位"],
  status:["未开始","进行中","已完成","已终止"],
  cycles:["月度","季度","临时","专项"],
  executeModes:["自动","手动"]
};

const safetyEvalTaskRows=[
  ["TASK-202607-001","集团月度安全评价任务","集团安全评价模型","企业","月度","已完成",100,8,8,0,"2026-07-01 08:30","2026-07-01 10:20","系统管理员","2026-06-30 16:10"],
  ["TASK-202607-002","施工项目月度安全评价任务","施工项目周评价模型","项目","月度","进行中",68,57,39,2,"2026-07-01 09:00","-","李明","2026-06-30 17:25"],
  ["TASK-202607-003","供应链安全履约专项评价","供应链安全履约评价模型","供应链","专项","进行中",45,24,11,1,"2026-07-01 09:20","-","王佳","2026-06-29 14:10"],
  ["TASK-202607-004","关键岗位履职季度评价","关键岗位履职评价模型","岗位","季度","未开始",0,36,0,0,"-","-","张强","2026-06-28 11:45"],
  ["TASK-202607-005","轨交项目专项安全评价","施工项目周评价模型","项目","专项","已完成",100,12,12,0,"2026-06-26 08:40","2026-06-26 12:30","陈晨","2026-06-25 18:00"],
  ["TASK-202607-006","企业风险管控临时评价","专项风险评价模型","企业","临时","已终止",32,6,2,1,"2026-06-24 10:00","2026-06-24 10:45","赵敏","2026-06-24 09:30"],
  ["TASK-202607-007","分包单位安全履约月评","供应链安全履约评价模型","供应链","月度","已完成",100,18,17,1,"2026-06-22 08:30","2026-06-22 15:50","王佳","2026-06-21 16:00"],
  ["TASK-202607-008","项目经理岗位履职评价","关键岗位履职评价模型","岗位","月度","进行中",76,22,16,0,"2026-07-01 10:10","-","刘洋","2026-06-30 19:10"],
  ["TASK-202607-009","城市更新项目临时评价","施工项目周评价模型","项目","临时","未开始",0,9,0,0,"-","-","沈洁","2026-06-27 13:20"],
  ["TASK-202607-010","季度企业安全综合评价","集团安全评价模型","企业","季度","已完成",100,10,10,0,"2026-06-18 09:00","2026-06-18 11:05","系统管理员","2026-06-17 15:40"],
  ["TASK-202607-011","设备租赁供应商专项评价","供应链安全履约评价模型","供应链","专项","已终止",58,7,4,2,"2026-06-15 14:00","2026-06-15 16:10","陈晨","2026-06-14 17:15"],
  ["TASK-202607-012","安全总监岗位配置评价","关键岗位履职评价模型","岗位","专项","已完成",100,15,15,0,"2026-06-12 08:50","2026-06-12 10:30","李明","2026-06-11 18:30"]
].map((row,index)=>({
  id:index+1,
  taskCode:row[0],
  taskName:row[1],
  modelName:row[2],
  modelId:row[2],
  evaluationType:row[3],
  cycleType:row[4],
  executeMode:row[14] || (["临时","专项"].includes(row[4])?"手动":"自动"),
  taskStatus:row[5],
  progress:row[6],
  objectCount:row[7],
  finishedObjectCount:row[8],
  failedObjectCount:row[9],
  startTime:row[10],
  endTime:row[11],
  creator:row[12],
  createTime:row[13]
}));

const safetyEvalTaskState={
  taskName:"",
  taskCode:"",
  modelId:"",
  evaluationType:"",
  taskStatus:"",
  cycleType:"",
  executeMode:"",
  creator:"",
  createStartTime:"",
  createEndTime:"",
  page:1,
  pageSize:10
};

tableColumnDefinitions.safetyEvalTask=[
  {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
  {key:"taskCode",title:"任务编号",width:150,align:"left",render:row=>row.taskCode},
  {key:"taskName",title:"任务名称",width:230,align:"left",render:row=>`<a class="link" onclick="showToast('查看任务详情：${row.taskName}')">${row.taskName}</a>`},
  {key:"modelName",title:"评价模型",width:190,align:"left",render:row=>row.modelName},
  {key:"evaluationType",title:"评价对象",width:110,align:"center",render:row=>tag(row.evaluationType,({企业:"blue",项目:"green",供应链:"orange",岗位:"purple"})[row.evaluationType] || "gray")},
  {key:"cycleType",title:"执行周期",width:110,align:"center",render:row=>tag(row.cycleType,({月度:"blue",季度:"green",临时:"orange",专项:"purple"})[row.cycleType] || "gray")},
  {key:"executeMode",title:"执行方式",width:100,align:"center",render:row=>tag(row.executeMode,row.executeMode==="自动"?"blue":"orange")},
  {key:"taskStatus",title:"任务状态",width:110,align:"center",render:row=>tag(row.taskStatus,({未开始:"gray",进行中:"blue",已完成:"green",已终止:"red"})[row.taskStatus] || "gray")},
  {key:"progress",title:"任务进度",width:160,align:"center",render:row=>renderSafetyEvalTaskProgress(row.progress)},
  {key:"objectCount",title:"评价对象数",width:110,align:"center",render:row=>row.objectCount},
  {key:"finishedObjectCount",title:"已完成对象数",width:120,align:"center",render:row=>row.finishedObjectCount},
  {key:"failedObjectCount",title:"失败对象数",width:110,align:"center",render:row=>row.failedObjectCount},
  {key:"startTime",title:"任务开始时间",width:170,align:"center",render:row=>row.startTime},
  {key:"endTime",title:"任务结束时间",width:170,align:"center",render:row=>row.endTime},
  {key:"creator",title:"创建人",width:110,align:"center",render:row=>row.creator},
  {key:"createTime",title:"创建时间",width:170,align:"center",render:row=>row.createTime},
  {key:"operation",title:"操作",width:300,align:"center",render:row=>`
    <a class="link" onclick="showToast('查看任务详情：${row.taskName}')">查看</a>
    <a class="link" onclick="showToast('查看进度：${row.taskName}')">查看进度</a>
    <a class="link" onclick="retrySafetyEvalTask(${row.id})">重新执行</a>
    <a class="link" onclick="stopSafetyEvalTask(${row.id})">终止</a>
    <a class="link danger-link" onclick="deleteSafetyEvalTask(${row.id})">删除</a>
    <a class="link" onclick="exportSafetyEvalTask(${row.id})">导出结果</a>
  `}
];

function getSafetyEvalTaskCreateModels(){
  return safetyEvalModelRows.filter(row=>row.modelStatus!=="已停用");
}

function getSafetyEvalTaskDefaultModel(){
  return getSafetyEvalTaskCreateModels().find(row=>row.modelName==="施工项目周评价模型") || getSafetyEvalTaskCreateModels()[0];
}

function getSafetyEvalTaskObjectType(model){
  if(!model)return "项目";
  return model.objectType==="综合对象" || model.objectType==="综合" ? "项目" : model.objectType;
}

function getSafetyEvalTaskObjectsByModel(model){
  const type=getSafetyEvalTaskObjectType(model);
  return safetyEvalObjectRows.filter(row=>row.objectType===type && row.status==="启用");
}

function renderSafetyEvalTaskCreateModelOptions(current){
  return getSafetyEvalTaskCreateModels().map(model=>`<option value="${escapeAttr(model.modelName)}" ${model.modelName===current?"selected":""}>${model.modelName}</option>`).join("");
}

function renderSafetyEvalTaskModelInfo(model){
  if(!model)return `<div class="info-grid"><div class="info-item"><div class="info-label">模型信息</div><strong>-</strong></div></div>`;
  return `
    <div class="info-grid">
      <div class="info-item"><div class="info-label">模型名称</div><strong>${model.modelName}</strong></div>
      <div class="info-item"><div class="info-label">模型版本</div><strong>${model.currentVersion}</strong></div>
      <div class="info-item"><div class="info-label">风险等级划分</div><strong>可控 ≥80；较高 60-80；极高 &lt;60</strong></div>
      <div class="info-item"><div class="info-label">适用对象</div><strong>${safetyEvalModelTypeTag(getSafetyEvalTaskObjectType(model))}</strong></div>
      <div class="info-item"><div class="info-label">指标数量</div><strong>${model.indicatorCount}</strong></div>
      <div class="info-item"><div class="info-label">权重总和</div><strong>${model.totalWeight}%</strong></div>
    </div>
  `;
}

function getSafetyEvalTaskDefaultName(modelName,cycleType){
  const cycle=cycleType || "月度";
  const model=safetyEvalModelRows.find(row=>row.modelName===modelName) || getSafetyEvalTaskDefaultModel();
  const objectType=getSafetyEvalTaskObjectType(model);
  return `${objectType}${cycle}安全评价任务`;
}

function renderSafetyEvalTaskObjectChooser(model,selectedCodes=[]){
  const objects=getSafetyEvalTaskObjectsByModel(model);
  return `
    <div class="table-wrap roster-table-wrap" style="max-height:230px;overflow:auto">
      <table style="min-width:760px">
        <thead>
          <tr>
            <th style="width:54px;text-align:center"><input type="checkbox" id="setCreateObjectAll" onchange="toggleSafetyEvalTaskCreateObjects(this.checked)"/></th>
            <th style="width:140px">对象编码</th>
            <th>对象名称</th>
            <th style="width:140px">所属组织</th>
            <th style="width:140px">上级单位</th>
            <th style="width:110px;text-align:center">对象状态</th>
          </tr>
        </thead>
        <tbody>
          ${objects.map(item=>`
            <tr>
              <td style="text-align:center"><input type="checkbox" class="set-create-object-checkbox" value="${escapeAttr(item.objectCode)}" ${selectedCodes.includes(item.objectCode)?"checked":""} onchange="syncSafetyEvalTaskCreateSummary()"/></td>
              <td>${item.objectCode}</td>
              <td>${item.objectName}</td>
              <td>${item.orgName}</td>
              <td>${item.parentOrg}</td>
              <td style="text-align:center">${tag(item.status,item.status==="启用"?"green":"red")}</td>
            </tr>
          `).join("") || `<tr><td colspan="6" style="text-align:center;color:var(--muted);height:64px">当前模型暂无可选评价对象</td></tr>`}
        </tbody>
      </table>
    </div>
    <div style="margin-top:8px;color:var(--sub)">已选择 <strong id="setCreateObjectCount">${selectedCodes.length}</strong> 个${getSafetyEvalTaskObjectType(model)}对象，可批量选择。</div>
  `;
}

function openSafetyEvalTaskCreateModal(){
  const model=getSafetyEvalTaskDefaultModel();
  const modelName=model?.modelName || "";
  const cycleType="月度";
  const executeMode="自动";
  openModal("发起评价任务",`
    <div class="detail-group">
      <div class="detail-group-header"><div class="detail-group-title">模型选择</div></div>
      <div class="detail-group-body">
        <div class="search-grid">
          <div class="form-item"><label>选择模型</label><select class="select" id="setCreateModel" onchange="updateSafetyEvalTaskCreateByModel()">${renderSafetyEvalTaskCreateModelOptions(modelName)}</select></div>
        </div>
        <div id="setCreateModelInfo" style="margin-top:12px">${renderSafetyEvalTaskModelInfo(model)}</div>
      </div>
    </div>
    <div class="detail-group">
      <div class="detail-group-header"><div class="detail-group-title">任务基础信息</div></div>
      <div class="detail-group-body">
        <div class="search-grid">
          <div class="form-item"><label>任务名称</label><input class="input" id="setCreateTaskName" value="${escapeAttr(getSafetyEvalTaskDefaultName(modelName,cycleType))}" placeholder="选择模型后自动填充，可修改"/></div>
          <div class="form-item"><label>任务类型</label><select class="select" id="setCreateCycle" onchange="syncSafetyEvalTaskCreateCycle()">${safetyEvalTaskOptions.cycles.map(value=>`<option value="${value}" ${value===cycleType?"selected":""}>${value}</option>`).join("")}</select></div>
          <div class="form-item"><label>执行方式</label><select class="select" id="setCreateExecuteMode" onchange="syncSafetyEvalTaskExecuteTime()">${safetyEvalTaskOptions.executeModes.map(value=>`<option value="${value}" ${value===executeMode?"selected":""}>${value}</option>`).join("")}</select></div>
          <div class="form-item"><label>执行时间</label><input class="input" type="datetime-local" id="setCreateExecuteTime" value="2026-07-03T08:30"/></div>
          <div class="form-item" style="grid-column:1/-1"><label>任务描述</label><textarea class="input" id="setCreateTaskDesc" placeholder="请输入任务描述" style="min-height:76px;resize:vertical;padding-top:8px"></textarea></div>
        </div>
      </div>
    </div>
    <div class="detail-group">
      <div class="detail-group-header">
        <div class="detail-group-title">选择评价对象</div>
        <span id="setCreateObjectTypeTag">${safetyEvalModelTypeTag(getSafetyEvalTaskObjectType(model))}</span>
      </div>
      <div class="detail-group-body" id="setCreateObjectWrap">
        ${renderSafetyEvalTaskObjectChooser(model)}
      </div>
    </div>
  `,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveSafetyEvalTaskCreate()">发起任务</button>`,"large");
  syncSafetyEvalTaskCreateSummary();
}

function updateSafetyEvalTaskCreateByModel(){
  const modelName=document.getElementById("setCreateModel")?.value || "";
  const model=safetyEvalModelRows.find(row=>row.modelName===modelName) || getSafetyEvalTaskDefaultModel();
  const modelInfo=document.getElementById("setCreateModelInfo");
  if(modelInfo)modelInfo.innerHTML=renderSafetyEvalTaskModelInfo(model);
  const cycle=document.getElementById("setCreateCycle")?.value || "月度";
  const taskName=document.getElementById("setCreateTaskName");
  if(taskName)taskName.value=getSafetyEvalTaskDefaultName(model?.modelName || "",cycle);
  const tagBox=document.getElementById("setCreateObjectTypeTag");
  if(tagBox)tagBox.innerHTML=safetyEvalModelTypeTag(getSafetyEvalTaskObjectType(model));
  const objectWrap=document.getElementById("setCreateObjectWrap");
  if(objectWrap)objectWrap.innerHTML=renderSafetyEvalTaskObjectChooser(model);
  syncSafetyEvalTaskCreateSummary();
}

function syncSafetyEvalTaskCreateCycle(){
  const cycle=document.getElementById("setCreateCycle")?.value || "月度";
  const mode=document.getElementById("setCreateExecuteMode");
  if(mode)mode.value=["月度","季度"].includes(cycle)?"自动":"手动";
  const modelName=document.getElementById("setCreateModel")?.value || "";
  const taskName=document.getElementById("setCreateTaskName");
  if(taskName)taskName.value=getSafetyEvalTaskDefaultName(modelName,cycle);
  syncSafetyEvalTaskExecuteTime();
}

function syncSafetyEvalTaskExecuteTime(){
  const mode=document.getElementById("setCreateExecuteMode")?.value || "自动";
  const time=document.getElementById("setCreateExecuteTime");
  if(time){
    time.disabled=mode!=="自动";
    time.placeholder=mode==="自动"?"请选择自动执行时间":"手动任务无需填写";
    if(mode!=="自动")time.value="";
    if(mode==="自动"&&!time.value)time.value="2026-07-03T08:30";
  }
}

function toggleSafetyEvalTaskCreateObjects(checked){
  document.querySelectorAll(".set-create-object-checkbox").forEach(input=>{input.checked=checked;});
  syncSafetyEvalTaskCreateSummary();
}

function syncSafetyEvalTaskCreateSummary(){
  const checks=Array.from(document.querySelectorAll(".set-create-object-checkbox"));
  const selected=checks.filter(input=>input.checked);
  const count=document.getElementById("setCreateObjectCount");
  if(count)count.innerText=selected.length;
  const all=document.getElementById("setCreateObjectAll");
  if(all){
    all.checked=checks.length>0 && selected.length===checks.length;
    all.indeterminate=selected.length>0 && selected.length<checks.length;
  }
}

function saveSafetyEvalTaskCreate(){
  const modelName=document.getElementById("setCreateModel")?.value || "";
  const model=safetyEvalModelRows.find(row=>row.modelName===modelName) || getSafetyEvalTaskDefaultModel();
  const selected=Array.from(document.querySelectorAll(".set-create-object-checkbox:checked")).map(input=>input.value);
  if(!model){showToast("请先选择评价模型");return;}
  if(!selected.length){showToast("请至少选择一个评价对象");return;}
  const cycle=document.getElementById("setCreateCycle")?.value || "月度";
  const executeMode=document.getElementById("setCreateExecuteMode")?.value || (["月度","季度"].includes(cycle)?"自动":"手动");
  const executeTime=document.getElementById("setCreateExecuteTime")?.value || "";
  if(executeMode==="自动"&&!executeTime){showToast("请填写自动执行时间");return;}
  const taskName=document.getElementById("setCreateTaskName")?.value.trim() || getSafetyEvalTaskDefaultName(model.modelName,cycle);
  const id=Math.max(0,...safetyEvalTaskRows.map(row=>row.id))+1;
  const code=`TASK-202607-${String(id).padStart(3,"0")}`;
  safetyEvalTaskRows.unshift({
    id,
    taskCode:code,
    taskName,
    modelName:model.modelName,
    modelId:model.modelName,
    evaluationType:getSafetyEvalTaskObjectType(model),
    cycleType:cycle,
    executeMode,
    taskStatus:"未开始",
    progress:0,
    objectCount:selected.length,
    finishedObjectCount:0,
    failedObjectCount:0,
    startTime:executeMode==="自动"?executeTime.replace("T"," "):"-",
    endTime:"-",
    creator:"王安全",
    createTime:"2026-07-02 13:50"
  });
  closeModal();
  safetyEvalTaskState.page=1;
  renderSafetyEvaluationTaskPage();
  showToast(`已发起评价任务：${taskName}`);
}

function renderSafetyEvalTaskOptions(values,current,allText="全部"){
  return `<option value="">${allText}</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function renderSafetyEvalTaskProgress(progress){
  const value=Math.max(0,Math.min(100,Number(progress)||0));
  return `<div style="display:flex;align-items:center;justify-content:center;gap:8px"><div style="width:88px;height:8px;background:#eef1f5;border-radius:8px;overflow:hidden"><div style="width:${value}%;height:100%;background:#165DFF;border-radius:8px"></div></div><span>${value}%</span></div>`;
}

function getSafetyEvalTaskFilteredRows(){
  const s=safetyEvalTaskState;
  return safetyEvalTaskRows.filter(row=>{
    if(s.taskName&&!row.taskName.includes(s.taskName))return false;
    if(s.taskCode&&!row.taskCode.includes(s.taskCode))return false;
    if(s.modelId&&row.modelId!==s.modelId)return false;
    if(s.evaluationType&&row.evaluationType!==s.evaluationType)return false;
    if(s.taskStatus&&row.taskStatus!==s.taskStatus)return false;
    if(s.cycleType&&row.cycleType!==s.cycleType)return false;
    if(s.executeMode&&row.executeMode!==s.executeMode)return false;
    if(s.creator&&!row.creator.includes(s.creator))return false;
    if(s.createStartTime&&row.createTime.slice(0,10)<s.createStartTime)return false;
    if(s.createEndTime&&row.createTime.slice(0,10)>s.createEndTime)return false;
    return true;
  });
}

function querySafetyEvalTasks(){
  safetyEvalTaskState.taskName=document.getElementById("setTaskName")?.value.trim() || "";
  safetyEvalTaskState.taskCode=document.getElementById("setTaskCode")?.value.trim() || "";
  safetyEvalTaskState.modelId=document.getElementById("setModel")?.value || "";
  safetyEvalTaskState.evaluationType=document.getElementById("setType")?.value || "";
  safetyEvalTaskState.taskStatus=document.getElementById("setStatus")?.value || "";
  safetyEvalTaskState.cycleType=document.getElementById("setCycle")?.value || "";
  safetyEvalTaskState.executeMode=document.getElementById("setExecuteMode")?.value || "";
  safetyEvalTaskState.creator=document.getElementById("setCreator")?.value.trim() || "";
  safetyEvalTaskState.createStartTime=document.getElementById("setStart")?.value || "";
  safetyEvalTaskState.createEndTime=document.getElementById("setEnd")?.value || "";
  safetyEvalTaskState.page=1;
  renderSafetyEvaluationTaskPage();
}

function resetSafetyEvalTasks(){
  Object.assign(safetyEvalTaskState,{taskName:"",taskCode:"",modelId:"",evaluationType:"",taskStatus:"",cycleType:"",executeMode:"",creator:"",createStartTime:"",createEndTime:"",page:1});
  renderSafetyEvaluationTaskPage();
}

function changeSafetyEvalTaskPage(dir){
  const total=getSafetyEvalTaskFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/safetyEvalTaskState.pageSize));
  safetyEvalTaskState.page=Math.min(max,Math.max(1,safetyEvalTaskState.page+dir));
  renderSafetyEvaluationTaskPage();
}

function retrySafetyEvalTask(id){
  const row=safetyEvalTaskRows.find(item=>item.id===Number(id));
  if(row){
    row.taskStatus="进行中";
    row.progress=Math.max(row.progress,5);
    row.startTime=row.startTime==="-"?"2026-07-02 09:00":row.startTime;
    row.endTime="-";
    showToast(`已重新执行：${row.taskName}`);
  }
  renderSafetyEvaluationTaskPage();
}

function stopSafetyEvalTask(id){
  const row=safetyEvalTaskRows.find(item=>item.id===Number(id));
  if(row){
    row.taskStatus="已终止";
    row.endTime="2026-07-02 09:30";
    showToast(`已终止任务：${row.taskName}`);
  }
  renderSafetyEvaluationTaskPage();
}

function deleteSafetyEvalTask(id){
  const row=safetyEvalTaskRows.find(item=>item.id===Number(id));
  showToast(`删除任务演示：${row?.taskName || id}`);
}

function exportSafetyEvalTask(id){
  const row=safetyEvalTaskRows.find(item=>item.id===Number(id));
  showToast(`导出结果成功：${row?.taskName || id}`);
}

function renderSafetyEvalTaskTable(rows){
  const columns=getVisibleColumns("safetyEvalTask");
  return `
    <table class="safety-eval-task-table" style="min-width:${getTableMinWidth("safetyEvalTask")}px">
      <thead>
        <tr>
          ${renderTableHeaderByColumns("safetyEvalTask")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row,index)=>`
          <tr>
            ${columns.map(col=>`
              <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">${col.render(row,index)}</td>
            `).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderSafetyEvaluationTaskPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const allRows=getSafetyEvalTaskFilteredRows();
  const totalPages=Math.max(1,Math.ceil(allRows.length/safetyEvalTaskState.pageSize));
  safetyEvalTaskState.page=Math.min(safetyEvalTaskState.page,totalPages);
  const start=(safetyEvalTaskState.page-1)*safetyEvalTaskState.pageSize;
  const pageRows=allRows.slice(start,start+safetyEvalTaskState.pageSize);
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">安全评价 / 评价任务管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>任务名称</label><input class="input" id="setTaskName" value="${escapeAttr(safetyEvalTaskState.taskName)}" placeholder="支持模糊搜索"/></div>
      <div class="form-item"><label>任务编号</label><input class="input" id="setTaskCode" value="${escapeAttr(safetyEvalTaskState.taskCode)}" placeholder="请输入唯一任务ID"/></div>
      <div class="form-item"><label>评价模型</label><select class="select" id="setModel">${renderSafetyEvalTaskOptions(safetyEvalTaskOptions.models,safetyEvalTaskState.modelId,"全部")}</select></div>
      <div class="form-item"><label>评价对象</label><select class="select" id="setType">${renderSafetyEvalTaskOptions(safetyEvalTaskOptions.types,safetyEvalTaskState.evaluationType,"全部")}</select></div>
      <div class="form-item"><label>任务状态</label><select class="select" id="setStatus">${renderSafetyEvalTaskOptions(safetyEvalTaskOptions.status,safetyEvalTaskState.taskStatus,"全部")}</select></div>
      <div class="form-item"><label>执行周期</label><select class="select" id="setCycle">${renderSafetyEvalTaskOptions(safetyEvalTaskOptions.cycles,safetyEvalTaskState.cycleType,"全部")}</select></div>
      <div class="form-item"><label>执行方式</label><select class="select" id="setExecuteMode">${renderSafetyEvalTaskOptions(safetyEvalTaskOptions.executeModes,safetyEvalTaskState.executeMode,"全部")}</select></div>
      <div class="form-item"><label>创建人</label><input class="input" id="setCreator" value="${escapeAttr(safetyEvalTaskState.creator)}" placeholder="支持人员搜索"/></div>
      <div class="form-item"><label>创建时间-开始</label><input class="input" type="date" id="setStart" value="${escapeAttr(safetyEvalTaskState.createStartTime)}"/></div>
      <div class="form-item"><label>创建时间-结束</label><input class="input" type="date" id="setEnd" value="${escapeAttr(safetyEvalTaskState.createEndTime)}"/></div>
    `,{title:"查询条件",queryFn:"querySafetyEvalTasks()",resetFn:"resetSafetyEvalTasks()",gridClass:"search-grid"})}
    <section class="card table-card safety-eval-task-card">
      <div class="card-hd">
        <div class="card-title">评价任务列表</div>
        <div class="actions">
          <button class="btn primary" onclick="openSafetyEvalTaskCreateModal()">新增任务</button>
          <button class="btn" onclick="showToast('批量执行功能演示')">批量执行</button>
          <button class="btn" onclick="showToast('导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyEvalTask','renderSafetyEvaluationTaskPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        ${renderSafetyEvalTaskTable(pageRows)}
      </div>
      <div class="pagination">
        <span>共 ${allRows.length} 条记录</span>
        <span class="page-controls">
          <button class="btn mini" onclick="changeSafetyEvalTaskPage(-1)" ${safetyEvalTaskState.page<=1?"disabled":""}>‹</button>
          <b>${safetyEvalTaskState.page} / ${totalPages}</b>
          <button class="btn mini" onclick="changeSafetyEvalTaskPage(1)" ${safetyEvalTaskState.page>=totalPages?"disabled":""}>›</button>
          <select class="select mini-select" onchange="safetyEvalTaskState.pageSize=Number(this.value);safetyEvalTaskState.page=1;renderSafetyEvaluationTaskPage()">
            ${[10,20,50,100].map(size=>`<option value="${size}" ${size===safetyEvalTaskState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

function getIsoWeekInfo(date=new Date()){
  const d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  const day=d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate()+4-day);
  const yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return {year:d.getUTCFullYear(),week:Math.ceil((((d-yearStart)/86400000)+1)/7)};
}

const safetyWeekPickerState={
  selected:getIsoWeekInfo(),
  draft:null,
  open:false
};

function getCurrentMonthValue(){
  const now=new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
}

const safetyMonthPickerState={
  safetyEvaluationMonth:{
    selectedMonth:getCurrentMonthValue(),
    currentMonth:getCurrentMonthValue(),
    panelYear:Number(getCurrentMonthValue().slice(0,4)),
    open:false
  }
};

let safetyXiaoAnDialogOpen=false;

const safetyXiaoAnReport=[
  "HI下午好！",
  "我是安全小警。",
  "截止2026年7月，平台安全纳管项目331个，股份内重点关注项目9个。",
  "经安全动态分析：风险极高项目12个(较上期+3)，风险较高项目21个(+2)，风险可控项目47个(-4)。涉及的预警问题集中在：工地关键岗位人员综合到岗率过低、重复隐患发生率过高、视频开通及稳定在线情况不佳。",
  "上线项目中需重点关注：上海路桥所属的杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段(现场人员行为不安全)、市政集团所属的新马工业园节能环保产业园项目(总包监管落实不到位)…",
  "以上就是本月最新安全评价报告，咱们一起提升现场安全可控度，保障施工生产平稳可控。那今天就先说到这儿，咱们下月见哦！"
];

function openSafetyXiaoAnDialog(){
  safetyXiaoAnDialogOpen=true;
  renderSafetyEvaluationDashboardPreservingScroll();
}

function closeSafetyXiaoAnDialog(event){
  event?.stopPropagation?.();
  safetyXiaoAnDialogOpen=false;
  const dialog=document.getElementById("safetyXiaoAnDialog");
  if(dialog)dialog.remove();
}

function renderSafetyXiaoAnDialog(){
  if(!safetyXiaoAnDialogOpen)return "";
  return `
    <div class="safety-xiaoan-dialog" id="safetyXiaoAnDialog">
      <button class="safety-xiaoan-close" title="关闭" onclick="closeSafetyXiaoAnDialog(event)">×</button>
      <div class="safety-xiaoan-dialog-head"></div>
      <div class="safety-xiaoan-message">
        <h3>${safetyXiaoAnReport[0]}</h3>
        ${safetyXiaoAnReport.slice(1).map((line,index)=>`<p style="--delay:${index+1}">${line}</p>`).join("")}
      </div>
    </div>
  `;
}

function getSafetyWeekYears(){
  const year=getIsoWeekInfo().year;
  return [year-1,year,year+1];
}

function getSafetyWeekLabel(){
  return `${safetyWeekPickerState.selected.year}年第${String(safetyWeekPickerState.selected.week).padStart(2,"0")}周`;
}

function toggleSafetyWeekPicker(event){
  event?.stopPropagation?.();
  safetyWeekPickerState.open=!safetyWeekPickerState.open;
  safetyWeekPickerState.draft={...safetyWeekPickerState.selected};
  renderSafetyWeekPickerPanel();
}

function setSafetyWeekDraft(key,value){
  safetyWeekPickerState.draft=safetyWeekPickerState.draft || {...safetyWeekPickerState.selected};
  safetyWeekPickerState.draft[key]=Number(value);
  renderSafetyWeekPickerPanel();
}

function applySafetyWeekPicker(){
  if(safetyWeekPickerState.draft){
    safetyWeekPickerState.selected={...safetyWeekPickerState.draft};
  }
  safetyWeekPickerState.open=false;
  const label=document.getElementById("safetyWeekLabel");
  if(label)label.textContent=getSafetyWeekLabel();
  renderSafetyWeekPickerPanel();
}

function renderSafetyWeekPickerPanel(){
  const panel=document.getElementById("safetyWeekPickerPanel");
  if(!panel)return;
  panel.classList.toggle("open",safetyWeekPickerState.open);
  if(!safetyWeekPickerState.open){
    panel.innerHTML="";
    return;
  }
  const draft=safetyWeekPickerState.draft || safetyWeekPickerState.selected;
  panel.innerHTML=`
    <div class="week-picker-row">
      <label>年份</label>
      <select onchange="setSafetyWeekDraft('year',this.value)">
        ${getSafetyWeekYears().map(year=>`<option value="${year}" ${year===draft.year?"selected":""}>${year}年</option>`).join("")}
      </select>
    </div>
    <div class="week-picker-row">
      <label>周次</label>
      <select onchange="setSafetyWeekDraft('week',this.value)">
        ${Array.from({length:53},(_,i)=>i+1).map(week=>`<option value="${week}" ${week===draft.week?"selected":""}>第${String(week).padStart(2,"0")}周</option>`).join("")}
      </select>
    </div>
    <div class="week-picker-actions">
      <button onclick="safetyWeekPickerState.open=false;renderSafetyWeekPickerPanel()">取消</button>
      <button class="primary" onclick="applySafetyWeekPicker()">确定</button>
    </div>
  `;
}

function getSafetyMonthPickerState(pickerId="safetyEvaluationMonth"){
  if(!safetyMonthPickerState[pickerId]){
    safetyMonthPickerState[pickerId]={
      selectedMonth:getCurrentMonthValue(),
      currentMonth:getCurrentMonthValue(),
      panelYear:Number(getCurrentMonthValue().slice(0,4)),
      open:false
    };
  }
  return safetyMonthPickerState[pickerId];
}

function formatSafetyMonthLabel(monthValue){
  const [year,month]=String(monthValue).split("-");
  return `${year}年${month}月`;
}

function getSafetyMonthValue(year,month){
  return `${year}-${String(month).padStart(2,"0")}`;
}

function toggleSafetyMonthPicker(pickerId,event){
  event?.stopPropagation?.();
  const state=getSafetyMonthPickerState(pickerId);
  Object.entries(safetyMonthPickerState).forEach(([id,item])=>{
    if(id!==pickerId)item.open=false;
  });
  state.open=!state.open;
  state.panelYear=Number(state.selectedMonth.slice(0,4));
  renderSafetyMonthPickerPanel(pickerId);
}

function closeSafetyMonthPickers(){
  let changed=false;
  Object.values(safetyMonthPickerState).forEach(state=>{
    if(state.open){
      state.open=false;
      changed=true;
    }
  });
  if(changed){
    document.querySelectorAll(".SafetyMonthPicker__panel.open").forEach(panel=>panel.classList.remove("open"));
    document.querySelectorAll(".SafetyMonthPicker__input.active").forEach(input=>input.classList.remove("active"));
  }
}

function moveSafetyMonthYear(pickerId,delta,event){
  event?.stopPropagation?.();
  const state=getSafetyMonthPickerState(pickerId);
  state.panelYear+=delta;
  renderSafetyMonthPickerPanel(pickerId);
}

function selectSafetyMonth(pickerId,month,event){
  event?.stopPropagation?.();
  const state=getSafetyMonthPickerState(pickerId);
  const monthValue=getSafetyMonthValue(state.panelYear,month);
  if(monthValue>state.currentMonth)return;
  state.selectedMonth=monthValue;
  state.open=false;
  const label=document.getElementById(`${pickerId}Label`);
  if(label)label.textContent=formatSafetyMonthLabel(state.selectedMonth);
  renderSafetyMonthPickerPanel(pickerId);
}

function renderSafetyMonthPickerPanel(pickerId="safetyEvaluationMonth"){
  const panel=document.getElementById(`${pickerId}Panel`);
  const input=document.getElementById(`${pickerId}Input`);
  if(!panel)return;
  const state=getSafetyMonthPickerState(pickerId);
  panel.classList.toggle("open",state.open);
  input?.classList.toggle("active",state.open);
  if(!state.open){
    panel.innerHTML="";
    return;
  }
  panel.innerHTML=`
    <div class="SafetyMonthPicker__head">
      <button type="button" title="上一年" onclick="moveSafetyMonthYear('${pickerId}',-1,event)">‹</button>
      <strong>${state.panelYear}年</strong>
      <button type="button" title="下一年" onclick="moveSafetyMonthYear('${pickerId}',1,event)">›</button>
    </div>
    <div class="SafetyMonthPicker__grid">
      ${Array.from({length:12},(_,i)=>i+1).map(month=>{
        const monthValue=getSafetyMonthValue(state.panelYear,month);
        const disabled=monthValue>state.currentMonth;
        const selected=monthValue===state.selectedMonth;
        return `
          <button type="button" class="${selected?"selected":""} ${disabled?"disabled":""}" ${disabled?"disabled":""} onclick="selectSafetyMonth('${pickerId}',${month},event)">
            <span>${month}月</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderSafetyMonthPicker(pickerId="safetyEvaluationMonth"){
  const state=getSafetyMonthPickerState(pickerId);
  return `
    <div class="SafetyMonthPicker" data-picker-id="${pickerId}" onclick="event.stopPropagation()">
      <button type="button" class="SafetyMonthPicker__input ${state.open?"active":""}" id="${pickerId}Input" onclick="toggleSafetyMonthPicker('${pickerId}',event)">
        <span class="SafetyMonthPicker__calendar" aria-hidden="true">▣</span>
        <span class="SafetyMonthPicker__value" id="${pickerId}Label">${formatSafetyMonthLabel(state.selectedMonth)}</span>
        <span class="SafetyMonthPicker__arrow" aria-hidden="true">⌄</span>
      </button>
      <div class="SafetyMonthPicker__panel ${state.open?"open":""}" id="${pickerId}Panel"></div>
    </div>
  `;
}

document.addEventListener("click",closeSafetyMonthPickers);

function downloadSafetyEvaluationCompanyMonthlyReport(){
  showToast("企业安全评价月报告下载成功");
}

const safetyScreenTabs=["安全在线","过程管控","预警看板","设备管理","轻微事故","安全评价","工程保险"];
const safetyScreenEmptyTabs=["预警看板","设备管理","轻微事故","工程保险"];

function switchSafetyScreenTab(tab){
  if(tab==="安全评价")return renderSafetyEvaluationDashboardPreservingScroll();
  if(tab==="过程管控")return renderSafetyProcessDashboardPreservingScroll();
  if(safetyScreenEmptyTabs.includes(tab))return renderSafetyScreenEmptyPage(tab);
  return renderSafetyOnlineDashboardPage(tab);
}

function renderSafetyScreenHeader(activeTab="安全在线"){
  const isEvaluation=activeTab==="安全评价";
  const isProcess=activeTab==="过程管控";
  return `
    <div class="safety-screen-header">
      <div class="screen-brand"><span class="screen-logo">S</span><strong>安全在线管控平台</strong></div>
      <div class="screen-tabs">
        ${safetyScreenTabs.map(x=>`<button class="${x===activeTab?"active":""} ${safetyScreenEmptyTabs.includes(x)?"muted":""}" onclick="switchSafetyScreenTab('${x}')">${x}</button>`).join("")}
      </div>
      ${isEvaluation?`
        <div class="screen-company screen-month-actions">
          <button class="safety-month-report-btn" onclick="downloadSafetyEvaluationCompanyMonthlyReport()">安全评价月报<span>⬇</span></button>
          ${renderSafetyMonthPicker("safetyEvaluationMonth")}
        </div>
      `:`
        <div class="screen-company screen-week-picker">
          <button onclick="toggleSafetyWeekPicker(event)"><span id="safetyWeekLabel">${getSafetyWeekLabel()}</span><b>▣</b></button>
          <div class="week-picker-panel" id="safetyWeekPickerPanel"></div>
        </div>
      `}
    </div>
  `;
}

function renderSafetyScreenEmptyPage(tab){
  detailPage.style.display="none";
  listPage.style.display="block";
  listPage.innerHTML=`
    <div class="safety-screen-page safety-screen-empty-page">
      ${renderSafetyScreenHeader(tab)}
      <div class="safety-screen-empty">
        <h2>${tab}</h2>
        <p>当前看板待配置</p>
      </div>
    </div>
  `;
}

const safetyProcessOrgState={active:"全部",company:"",branch:""};
const safetyProcessRows=[
  [1,"2026-07-12","星期日","青浦区外青松公路（城中段）整治工程","上海隧道-市政分公司",["进行中","orange"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"]],
  [2,"2026-07-12","星期日","上海市轨道交通21号线一期工程","上海隧道-轨交分公司",["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"]],
  [3,"2026-07-12","星期日","定海社区N090603单元N6项目","城市环境-环境建设公司",["已完成","green"],["已完成","green"],["未完成","gray"],["进行中","orange"],["未完成","gray"],["未完成","gray"]],
  [4,"2026-07-12","星期日","天然气乌江支线项目管线工程","上海能建-油气储运分公司",["已完成","green"],["已完成","green"],["未完成","gray"],["进行中","orange"],["未完成","gray"],["未完成","gray"]],
  [5,"2026-07-12","星期日","新建沪通铁路太仓至四团段工程","上海隧道-市政分公司",["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"]],
  [6,"2026-07-12","星期日","上海示范区线工程SFQSG-15标","上海隧道-大盾构分公司",["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"]],
  [7,"2026-07-12","星期日","建宁西路过江通道工程机电安装项目","上海隧道-机电安装分公司",["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"],["未完成","gray"]],
  [8,"2026-07-12","星期日","郑州新区污水处理厂再生水利用工程","上海隧道-河南分公司",["已完成","green"],["已完成","green"],["未完成","gray"],["进行中","orange"],["未完成","gray"],["未完成","gray"]]
];

function setSafetyProcessOrg(org){
  safetyProcessOrgState.company=org&&org!=="全部"?org:"";
  safetyProcessOrgState.branch="";
  safetyProcessOrgState.active=safetyProcessOrgState.company||"全部";
  renderSafetyProcessDashboardPreservingScroll();
}

function getSafetyProcessOrgRecords(){
  return safetyProcessRows.map(row=>{
    const [company,branch]=String(row[4]||"").split("-");
    return {row,company,branch};
  });
}

function getSafetyProcessFilteredRows(){
  return DashboardOrgSwitch.filter(getSafetyProcessOrgRecords(),safetyProcessOrgState).map(item=>item.row);
}

function setSafetyProcessOrgSelection(selection){
  Object.assign(safetyProcessOrgState,selection);
  safetyProcessOrgState.active=safetyProcessOrgState.company||"全部";
  renderSafetyProcessDashboardPreservingScroll();
}

function renderSafetyProcessStatus(item){
  return `<span class="safety-process-status ${item[1]}">${item[0]}</span>`;
}

function renderSafetyProcessOverview(){
  const rows=[
    ["上海隧道",78,[1,76],[1,76],[0,77],[4,74],[14,64],[25,53],[23,54]],
    ["市政集团",74,[8,65],[6,66],[6,68],[16,58],[25,49],[23,51],[32,41]],
    ["上海路桥",57,[3,53],[0,55],[0,56],[1,56],[7,48],[8,47],[10,45]],
    ["城市环境",34,[5,27],[1,32],[3,31],[2,31],[11,21],[1,31],[6,25]],
    ["上海能建",8,[1,7],[2,6],[1,7],[5,3],[4,4],[4,4],[4,4]],
    ["城建物资",9,[0,9],[0,9],[0,9],[0,9],[0,9],[1,8],[7,2]]
  ];
  return `<section class="safety-process-card safety-process-overview"><div class="safety-process-card-hd"><h2>总体情况</h2><div class="safety-process-legend"><span class="done"></span>已完成数量 <span class="undone"></span>未完成数量</div></div><div class="safety-process-overview-table"><table><thead><tr><th rowspan="2">单位</th><th rowspan="2">项目数量</th><th colspan="7">本周未完成情况</th></tr><tr>${["一","二","三","四","五","六","日"].map(day=>`<th>${day}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td>${row.slice(2).map(value=>`<td><b>${value[0]}</b><i>/</i><em>${value[1]}</em></td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`;
}

function renderSafetyProcessRank(){
  const rows=[["上海路桥",92.5],["上海隧道",87.5],["城建物资",87.3],["城市环境",87.2],["市政集团",77.4],["上海能建",62.5]];
  return `<section class="safety-process-card safety-process-rank"><div class="safety-process-card-hd"><h2>排名列表</h2></div><p>各单位完成情况排名（按周更新）</p><div class="safety-process-rank-head"><span>序号</span><span>公司</span><span>完成率</span></div>${rows.map((row,index)=>`<div class="safety-process-rank-row"><b class="rank-${index+1}">${index+1}</b><strong>${row[0]}</strong><i><em style="width:${row[1]}%"></em></i><span>${row[1]}%</span></div>`).join("")}</section>`;
}

const safetyProcessChartState={trendRange:"month",trafficMode:"pv"};
const safetyProcessTrendData={
  month:{labels:["2026/06/18","2026/06/19","2026/06/20","2026/06/21","2026/06/22","2026/06/23","2026/06/24","2026/06/25","2026/06/26","2026/06/27","2026/06/28","2026/06/29","2026/06/30","2026/07/01","2026/07/02","2026/07/03","2026/07/04","2026/07/05","2026/07/06","2026/07/07","2026/07/08","2026/07/09","2026/07/10","2026/07/11","2026/07/12"],values:[228,236,242,241,236,235,231,233,237,244,239,240,238,244,235,240,239,246,248,239,235,244,193,191,168],rates:[89.3,91.2,92.8,92.6,91.6,90.7,89.9,90.8,91.5,93.1,92.0,92.6,91.8,93.6,90.7,92.4,91.3,94.4,95.2,91.8,90.2,92.1,76.8,75.4,72.7]},
  half:{labels:["2026/02","2026/03","2026/04","2026/05","2026/06","2026/07"],values:[218,224,231,238,227,233],rates:[86.4,88.1,90.3,92.5,89.6,91.2]},
  year:{labels:["2025/08","2025/09","2025/10","2025/11","2025/12","2026/01","2026/02","2026/03","2026/04","2026/05","2026/06","2026/07"],values:[196,205,212,208,219,221,218,224,231,238,227,233],rates:[80.6,82.4,85.2,83.7,87.6,88.4,86.4,88.1,90.3,92.5,89.6,91.2]}
};
const safetyProcessTrafficPv=[3012,3780,3038,2974,2940,2478,2430,3340,2892,2780,3108,3036,2810,2604,2506,3260,2492,2380,2254,2028,2056,3188,2674,2608,2486,0];
const safetyProcessTrafficLabels=["2026-06-19","2026-06-20","2026-06-21","2026-06-22","2026-06-23","2026-06-24","2026-06-25","2026-06-26","2026-06-27","2026-06-28","2026-06-29","2026-06-30","2026-07-01","2026-07-02","2026-07-03","2026-07-04","2026-07-05","2026-07-06","2026-07-07","2026-07-08","2026-07-09","2026-07-10","2026-07-11","2026-07-12","2026-07-13","2026-07-14"];

function setSafetyProcessTrendRange(range){
  safetyProcessChartState.trendRange=["month","half","year"].includes(range)?range:"month";
  renderSafetyProcessDashboardPreservingScroll();
}

function setSafetyProcessTrafficMode(mode){
  safetyProcessChartState.trafficMode=mode==="uv"?"uv":"pv";
  renderSafetyProcessDashboardPreservingScroll();
}

function buildSafetyProcessLinePoints(values,max){
  const length=Math.max(values.length-1,1);
  return values.map((value,index)=>`${(index/length*100).toFixed(2)},${(96-Math.max(0,value)/max*88).toFixed(2)}`).join(" ");
}

function renderSafetyProcessTrendChart(){
  const active=safetyProcessChartState.trendRange;
  const data=safetyProcessTrendData[active];
  const max=250;
  const labels={month:"近一月",half:"近半年",year:"近一年"};
  const avg=Math.round(data.values.reduce((sum,value)=>sum+value,0)/data.values.length);
  return `<section class="safety-process-card safety-process-chart-card safety-process-interactive-card"><div class="safety-process-card-hd"><h2>完成情况趋势图</h2><div class="safety-process-chart-tabs">${Object.entries(labels).map(([key,label])=>`<button class="${key===active?"active":""}" onclick="setSafetyProcessTrendRange('${key}')">${label}</button>`).join("")}</div></div><p>${active==="month"?`过去30天日均完成项目数量${avg}个`:`${labels[active]}平均完成项目数量${avg}个`}</p><div class="safety-process-interactive-chart trend"><span class="chart-axis left">250</span><span class="chart-axis right">100.0%</span><div class="safety-process-trend-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${buildSafetyProcessLinePoints(data.rates,100)}"/></svg><div class="trend-bars">${data.values.map((value,index)=>`<div class="chart-hover-zone"><i style="height:${value/max*100}%"></i><b style="bottom:${data.rates[index]}%"></b><span class="chart-tooltip"><strong>${data.labels[index]}</strong><p><i class="blue"></i>完成数量：<em>${value}</em></p><p><i class="cyan"></i>完成比例：<em>${data.rates[index]}%</em></p></span></div>`).join("")}</div></div><div class="chart-x-labels"><span>${data.labels[0]}</span><span>${data.labels[Math.floor((data.labels.length-1)/2)]}</span><span>${data.labels.at(-1)}</span></div><div class="chart-range-bar"><i></i></div></div></section>`;
}

function renderSafetyProcessTrafficChart(){
  const isUv=safetyProcessChartState.trafficMode==="uv";
  const total=safetyProcessTrafficPv.map(value=>isUv?Math.round(value*.58):value);
  const project=total.map(value=>Math.round(value*.932));
  const management=total.map((value,index)=>Math.max(0,value-project[index]));
  const max=Math.max(...total,1);
  const totalCount=total.reduce((sum,value)=>sum+value,0).toLocaleString("zh-CN");
  const projectCount=project.reduce((sum,value)=>sum+value,0).toLocaleString("zh-CN");
  const managementCount=management.reduce((sum,value)=>sum+value,0).toLocaleString("zh-CN");
  return `<section class="safety-process-card safety-process-chart-card safety-process-interactive-card safety-process-traffic-card"><div class="safety-process-card-hd"><h2>访问量统计</h2><div class="safety-process-chart-tabs"><button class="${!isUv?"active":""}" onclick="setSafetyProcessTrafficMode('pv')">访问次数</button><button class="${isUv?"active":""}" onclick="setSafetyProcessTrafficMode('uv')">访问人次</button></div></div><p>过去30天累计${isUv?"访问人次":"访问量"}${totalCount}，项目层${projectCount}，管理层${managementCount}</p><div class="safety-process-interactive-chart traffic"><span class="chart-axis left">${max.toLocaleString("zh-CN")}</span><div class="safety-process-line-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline class="project" points="${buildSafetyProcessLinePoints(project,max)}"/><polyline class="management" points="${buildSafetyProcessLinePoints(management,max)}"/><polyline class="total" points="${buildSafetyProcessLinePoints(total,max)}"/></svg>${total.map((value,index)=>`<div class="chart-hover-zone"><span class="chart-tooltip"><strong>${safetyProcessTrafficLabels[index]}</strong><p><i class="blue"></i>项目层 <em>${project[index].toLocaleString("zh-CN")}</em></p><p><i class="cyan"></i>管理层 <em>${management[index].toLocaleString("zh-CN")}</em></p><p><i class="orange"></i>总体 <em>${value.toLocaleString("zh-CN")}</em></p></span></div>`).join("")}</div><div class="chart-x-labels"><span>06-19</span><span>06-26</span><span>07-03</span><span>07-10</span></div><div class="safety-process-line-legend"><span><i class="blue"></i>项目层</span><span><i class="cyan"></i>管理层</span><span><i class="orange"></i>总体</span></div></div></section>`;
}

function renderSafetyProcessProjectList(){
  const rows=getSafetyProcessFilteredRows();
  return `<section class="safety-process-card safety-process-list"><div class="safety-process-list-tabs"><button class="active">未完成项目列表</button><button>已完成项目列表</button></div><div class="safety-process-filter"><label>所属组织：<select class="select"><option>请选择组织</option><option>上海隧道</option><option>市政集团</option></select></label><label>项目名称：<input class="input" placeholder="请输入项目名称"/></label><label>看板日期：<button class="component-date-input"><i></i><strong>${getSafetyWeekLabel()}</strong></button></label><label><input class="input" placeholder="选择日期"/></label><button class="btn primary" onclick="showToast('查询成功')">查询</button><button class="btn" onclick="showToast('已重置')">重置</button></div><div class="safety-process-table-wrap"><table><thead><tr><th>序号</th><th>日期</th><th>星期</th><th>项目名称</th><th>所属单位</th><th>计划状态</th><th>审批状态</th><th>班会状态</th><th>验收状态</th><th>旁站状态</th><th>核验状态</th><th>操作</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td title="${escapeAttr(row[3])}">${row[3]}</td><td>${row[4]}</td>${row.slice(5).map(item=>`<td>${renderSafetyProcessStatus(item)}</td>`).join("")}<td><a onclick="showToast('施工日志已打印')">打印</a><a onclick="showToast('已打开项目过程详情')">查看详情</a></td></tr>`).join("")||`<tr><td colspan="12">暂无项目数据</td></tr>`}</tbody></table></div><div class="safety-process-pagination"><span>共 ${rows.length} 条记录</span><div><button disabled>‹‹</button><button disabled>‹</button><button class="active">1</button><button>›</button><button>››</button><select><option>50条/页</option></select></div></div></section>`;
}

function renderSafetyProcessDashboardPage(){
  detailPage.style.display="none";
  listPage.style.display="block";
  listPage.innerHTML=`<div class="safety-screen-page safety-process-page">${renderSafetyScreenHeader("过程管控")}${DashboardOrgSwitch.render({id:"safety-process-org",records:getSafetyProcessOrgRecords(),state:safetyProcessOrgState,onChange:setSafetyProcessOrgSelection})}<div class="safety-process-body"><section class="safety-process-top-grid">${renderSafetyProcessOverview()}${renderSafetyProcessRank()}${renderSafetyProcessTrendChart()}</section><section class="safety-process-bottom-grid">${renderSafetyProcessProjectList()}${renderSafetyProcessTrafficChart()}</section></div></div>`;
}

function renderSafetyProcessDashboardPreservingScroll(){
  renderWithPreservedScroll(renderSafetyProcessDashboardPage,[".safety-process-page",".safety-process-table-wrap","#listPage",".main"]);
}

function renderSafetyOnlineDashboardPage(activeTab="安全在线"){
  detailPage.style.display="none";
  listPage.style.display="block";
  const stats=[
    ["生产项目","5786","个","doc"],
    ["安全纳管项目","239","个","shield"],
    ["开通实名制项目","228","个","person"],
    ["未及时登记实名制项目","8","个","person-warn"],
    ["开通视频监控项目","157","个","camera"],
    ["开通AI监控项目","8","个","ai"],
    ["近一周开展隐患排查项目","186","个","search"],
    ["重大安全风险项目","5","个","warn"]
  ];
  const realNameTop=[
    ["登记进场人数","18865","人","今日236"],
    ["今日计划人数","8672","人",""],
    ["今日出勤人数","7360","人",""],
    ["现场施工人数","5264","人",""],
    ["总包安全员数量","215 / 117","人","今日出勤 / 当前在场"],
    ["分包安全员数量","247 / 163","人","今日出勤 / 当前在场"]
  ];
  const realNameWarn=[
    ["总包安全员未配足项目数","136"],
    ["总包安全员未到岗项目数","127"],
    ["分包安全员未配足项目数","226"],
    ["分包安全员未到岗项目数","130"],
    ["人员即将超龄预警","48"],
    ["证书即将过期预警","37"]
  ];
  const hazardTop=[
    ["隐患开单数","8380","今日427"],
    ["整改率","93.1%",""],
    ["隐患升级数","23",""],
    ["重大隐患数","21",""]
  ];
  const hazardWarn=[
    ["未开单项目","40"],
    ["存在隐患升级项目","15"],
    ["存在未整改重大隐患项目","7"],
    ["整改不合格项目","0"]
  ];
  const videoTop=[
    ["已安装监控数","710 台",""],
    ["AI点位数","16 台",""],
    ["当前在线","649 台",""],
    ["在线率","91.4%",""]
  ];
  const videoWarn=[
    ["视频离线项目","28"],
    ["AI监控离线项目","3"],
    ["监控未安装项目","82"]
  ];
  listPage.innerHTML=`
    <div class="safety-screen-page">
      ${renderSafetyScreenHeader(activeTab)}
      <div class="safety-screen-body">
        <section class="screen-stat-strip">
          ${stats.map(item=>`
            <div class="screen-stat-item">
              <span class="screen-stat-icon ${item[3]}"></span>
              <div><p>${item[0]}</p><strong>${item[1]}<em>${item[2]}</em></strong></div>
            </div>
          `).join("")}
        </section>
        <section class="screen-main-grid">
          ${renderSafetyScreenPanel("实名制",realNameTop,realNameWarn,"realname")}
          ${renderSafetyScreenPanel("隐患排查",hazardTop,hazardWarn,"hazard",true)}
          ${renderSafetyScreenPanel("视频监控",videoTop,videoWarn,"video")}
          ${renderSafetyWarningPanel()}
        </section>
        ${renderSafetyRiskProjects()}
      </div>
    </div>
  `;
}

const safetyEvaluationOrgs=["全部",...getOrganizationCompanies()];
const safetyEvaluationOrgState={active:safetyEvaluationOrgs[0],company:"",branch:""};
const safetyEvaluationSummaryMeta=[
  {label:"安全纳管项目数",level:"",color:"blue",icon:"▣",trend:"↑ 4"},
  {label:"风险极高项目",level:"风险极高",color:"red",icon:"src/assets/risk-extreme.png",trend:"↑ 3",iconType:"image"},
  {label:"风险较高项目",level:"风险较高",color:"orange",icon:"src/assets/risk-high.png",trend:"↑ 2",iconType:"image"},
  {label:"风险可控项目",level:"风险可控",color:"green",icon:"src/assets/risk-control.png",trend:"↓ 1",iconType:"image"}
];
const safetyEvaluationDimensions=[
  {title:"现场管控",spark:[29,25,27,30,33],items:[["隐患整改闭环",69],["重复隐患发生",99],["安全每日监督",4],["关键岗位在岗",18,"red"],["分包人员配置",3],["工人工资核验",4]]},
  {title:"信息保障",spark:[22,18,20,17,24,27,31],items:[["实名系统开通",91],["实名四要素一致性",80,"red"],["监控视频在线",97],["监控视频开通",83],["保险集中管理",45],["项目筹划信息",3],["低碳管理",6],["险情信息填报",14]]},
  {title:"组织行为",spark:[18,15,16,19,21],items:[["全员责任出勤",6],["专职岗位配置",3],["安全总监配置",68]]},
  {title:"技经融合",spark:[12,14,13,16,18],items:[["技术方案审批",3],["分包分供预警",62],["项目潜亏预警",98,"red"],["保险理赔止损",2]]},
  {title:"溯源问效",wide:true,spark:[16,14,15,18,20,22],items:[["人身伤亡事故",3],["事故迟报瞒报",95],["重大舆情事件",7],["行政处罚记录",88],["轻微事故上报",58],["工伤信访维稳",79],["荣誉表彰奖励",4]]}
];
const safetyEvaluationRank=[
  ["市政集团","95.5","8","17","65","65"],
  ["上海路桥","94.5","7","12","55","55"],
  ["上海隧道","92.6","7","11","51","51"],
  ["城市环境","89.5","7","14","41","41"],
  ["城建国际","87.5","6","5","7","7"],
  ["城建设计","86.5","2","0","1","1"],
  ["上海能建","82.5","2","0","1","1"],
  ["运营集团","76.5","1","0","1","1"]
];
const safetyEvaluationRows=[
  ["1","两湖隧道（东湖段）主体及附属配套工程施工2标","市政集团","上海分公司","商凌锋","在建","86","风险可控","18.5","18.5","18.5","18.5","18.5","↑ 5.2","up"],
  ["2","武汉市轨道交通12号线科普公园站、国博中心南站土建预埋工程","上海隧道","河南分公司","李峻","在建","19","风险可控","18.5","18.5","18.5","18.5","18.5","↓ 3.2","down"],
  ["3","上海市轨道交通23号线一期工程土建12标（龙瑞路站、上海植物园站...","市政集团","上海分公司","商凌锋","竣工","39","风险较高","18.5","18.5","18.5","18.5","18.5","↑ 5.2","up"],
  ["4","两湖隧道（东湖段）主体及附属配套工程施工2标","市政集团","上海分公司","商凌锋","在建","7","风险极高","18.5","18.5","18.5","18.5","18.5","↑ 5.2","up"],
  ["5","上海示范区线工程SFQSG-15标施工","上海路桥","总承包一部","赵菁","在建","73","风险可控","17.0","18.0","16.5","17.5","18.0","↑ 1.8","up"],
  ["6","深国际上海闵行 B-1厂房装修工程 EPC施工总承包工程","上海能建","工程管理部","王晨","筹备","58","风险较高","15.0","16.5","14.5","17.0","15.5","↓ 2.1","down"],
  ["7","真如副中心地下公共车行通道工程","城市环境","环境建设公司","李敏","在建","91","风险可控","19.0","18.5","18.0","17.5","18.5","↑ 4.6","up"]
];
[
  ["8","上海机场联络线配套市政道路工程","上海路桥","总承包二部","赵一鸣","在建","82","风险可控","17.5","16.5","18.0","15.5","17.0","↑ 2.4","up"],
  ["9","苏州河综合治理三期工程","城市环境","水务建设管道分公司","陈启航","在建","67","风险较高","15.5","13.0","16.0","14.5","15.0","↓ 1.6","down"],
  ["10","临港新片区综合管廊工程","市政集团","上海分公司","周明","筹备","76","风险可控","16.0","15.0","16.5","14.0","15.5","↑ 1.2","up"],
  ["11","北横通道机电安装工程","上海隧道","轨交分公司","吴越","竣工","88","风险可控","18.0","18.5","17.5","17.0","18.0","↑ 3.1","up"],
  ["12","嘉闵线站点附属结构工程","上海隧道","轨交分公司","孙杰","在建","54","风险较高","14.0","11.5","15.0","13.5","14.0","↓ 2.8","down"],
  ["13","浦东新区雨污水改造工程","市政集团","江苏分公司","郭琳","在建","93","风险可控","19.5","18.5","18.5","18.0","19.0","↑ 4.0","up"],
  ["14","外环东段交通功能提升工程","上海路桥","道路分公司","高峰","在建","42","风险较高","12.0","10.5","13.0","11.0","12.5","↓ 3.2","down"]
].forEach(row=>safetyEvaluationRows.push(row));
const safetyEvaluationDimensionProfiles={
  "1":[18,17,17,17,17],
  "2":[11,10,12,10,12],
  "3":[14,13,15,13,15],
  "4":[8,7,9,8,10],
  "5":[17,18,16,17,18],
  "6":[15,14,14,15,16],
  "7":[19,18,18,18,18],
  "8":[17,16,17,16,16],
  "9":[15,14,16,14,15],
  "10":[16,15,16,14,15],
  "11":[18,18,18,17,18],
  "12":[14,13,15,13,13],
  "13":[19,19,18,18,19],
  "14":[12,11,13,11,12]
};
function getSafetyEvalRiskLevelByScore(score){
  const value=Number(score)||0;
  if(value<=60)return "风险极高";
  if(value<80)return "风险较高";
  return "风险可控";
}
function normalizeSafetyEvaluationRows(){
  safetyEvaluationRows.forEach(row=>{
    const dims=safetyEvaluationDimensionProfiles[String(row[0])] || row.slice(8,13).map(Number);
    const score=Number(dims.reduce((sum,value)=>sum+Number(value||0),0).toFixed(1));
    dims.forEach((value,index)=>{row[8+index]=String(value);});
    row[6]=String(score);
    row[7]=getSafetyEvalRiskLevelByScore(score);
  });
}
normalizeSafetyEvaluationRows();
const safetyEvaluationTablePageSize=10;
const safetyEvaluationFilterState={projectName:"",subCompany:"",branch:"",manager:"",status:"",riskLevel:"",scoreSort:"",selectedIds:[]};
const safetyEvaluationDetailMeta=[
  {cost:"220,0900.00万元",tags:["地下工程","浙江区域","集团一体化管理模式","集团重点关注","EPC"]},
  {cost:"186,420.00万元",tags:["地下工程","华中区域","集团一体化管理模式","EPC"]},
  {cost:"249,388.00万元",tags:["轨道交通","上海区域","集团重点关注"]},
  {cost:"220,0900.00万元",tags:["地下工程","浙江区域","集团一体化管理模式","集团重点关注","EPC"]},
  {cost:"154,858.24万元",tags:["市政工程","上海区域","集团一体化管理模式"]},
  {cost:"9,860.00万元",tags:["房建工程","上海区域","EPC"]},
  {cost:"98,000.00万元",tags:["地下通道","上海区域","集团重点关注"]}
];
const safetyEvaluationDetailGroups=[
  {name:"信息保障",score:"17/20",items:[["实名系统开通","0/12.5","新开项目未按要求在安全纳管三天之内开通实名制，得0分",true],["实名证 4 关键要素一致性","10/12.5","该项目有2人信息检查一致性（姓名+三级教育+合同+操作证）未通过，扣20分",true],["监控视频在线","10/12.5","----",false],["监控视频开通","10/12.5","----",false],["保险集中管理","10/12.5","----",false],["项目筹划信息","10/12.5","----",false],["低碳管理","10/12.5","----",false],["险情信息填报","10/12.5","----",false]]},
  {name:"现场管控",score:"5.8/20",items:[["隐患整改闭环","12.5/16.67","存在5个隐患未完成并出现升级，扣25分",true],["重复隐患发生","0/16.67","未戴安全帽重复隐患超周上限（5次），直接判定为0分",true],["安全每日监督","16.67/16.67","----",false],["关键岗位在岗","0/16.67","劳务分包上海XXX劳务有限公司的现场负责人当月未到岗，直接判定为0分",true],["工人工资核验","0/16.67","该项目本月未上传农民工工资表，直接判定为0分",true]]},
  {name:"组织行为",score:"20/20",items:[["全员责任出勤","33.33/33.33","----",false],["专职岗位配置","33.33/33.33","----",false],["安全总监配置","33.33/33.33","----",false]]},
  {name:"技经融合",score:"20/20",items:[["技术方案审批","25/25","----",false],["分包分供预警","25/25","----",false],["项目潜亏预警","25/25","----",false],["保险理赔止损","25/25","----",false]]},
  {name:"溯源问效",score:"20/20",items:[["人身伤亡事故","--/--","----",false],["事故迟报瞒报","--/--","----",false],["重大舆情事件","--/--","----",false],["行政处罚记录","--/--","----",false],["轻微事故上报","--/--","----",false],["工伤信访维稳","--/--","----",false],["荣誉表彰奖励","--/--","----",false]]}
];

function renderSafetyEvalSpark(values){
  if(values.length<2)values=[values[0] || 0,values[0] || 0];
  const max=Math.max(...values),min=Math.min(...values);
  const pts=values.map((v,i)=>{
    const x=8+i*(84/(values.length-1));
    const y=26-((v-min)/(max-min||1))*18;
    return `${x},${y}`;
  }).join(" ");
  return `<svg class="safety-eval-spark" viewBox="0 0 100 32" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#2d73ff" stroke-width="2"/><circle cx="92" cy="${pts.split(" ").at(-1).split(",")[1]}" r="2" fill="#2d73ff"/></svg>`;
}

function getSafetyEvaluationAverageStats(rows=getSafetyEvaluationFilteredRows()){
  const scores=rows.map(row=>Number(row[6] || 0)).filter(score=>!Number.isNaN(score));
  const avg=scores.length?scores.reduce((sum,score)=>sum+score,0)/scores.length:0;
  const previousScores=rows.map(row=>{
    const score=Number(row[6] || 0);
    const trendText=String(row[13] || "");
    const match=trendText.match(/([↑↓])\s*([\d.]+)/);
    if(!match)return score;
    const delta=Number(match[2]) || 0;
    return match[1]==="↑"?score-delta:score+delta;
  });
  const previousAvg=previousScores.length?previousScores.reduce((sum,score)=>sum+score,0)/previousScores.length:avg;
  const diff=avg-previousAvg;
  return {
    avg:avg.toFixed(1),
    trend:`${diff>=0?"↑":"↓"} ${Math.abs(diff).toFixed(1)}`,
    trendClass:diff>=0?"up":"down",
    spark:scores.length?scores:safetyEvaluationRows.map(row=>Number(row[6] || 0)).slice(0,6)
  };
}

function renderSafetyEvalRadar(){
  return `
    <div class="safety-eval-radar">
      <svg viewBox="0 0 260 210" aria-hidden="true">
        <polygon points="130,18 228,84 190,190 70,190 32,84" fill="none" stroke="#d7e0ec"/>
        <polygon points="130,54 192,96 168,164 92,164 68,96" fill="none" stroke="#d7e0ec"/>
        <line x1="130" y1="18" x2="130" y2="190" stroke="#d7e0ec"/>
        <line x1="32" y1="84" x2="190" y2="190" stroke="#d7e0ec"/>
        <line x1="228" y1="84" x2="70" y2="190" stroke="#d7e0ec"/>
        <polygon points="130,62 210,90 170,170 84,180 54,96" fill="rgba(45,115,255,.16)" stroke="#2d73ff" stroke-width="2"/>
        <polygon points="130,86 178,104 158,148 102,152 82,104" fill="rgba(148,163,184,.18)" stroke="#94a3b8" stroke-width="1.5"/>
      </svg>
      <span class="radar-label top">信息保障<br><b>17.0/20</b><em>↑ 3.6</em></span>
      <span class="radar-label right">现场管控<br><b>17.0/20</b><em>↑ 3.6</em></span>
      <span class="radar-label bottom-right">组织行为<br><b>17.0/20</b><em class="down">↓ 3.6</em></span>
      <span class="radar-label bottom-left">技经融合<br><b>17.0/20</b><em>↑ 3.6</em></span>
      <span class="radar-label left">溯源问效<br><b>17.0/20</b><em>↑ 3.6</em></span>
      <div class="radar-legend"><span class="current"></span>本月得分<span class="previous"></span>上月得分</div>
    </div>
  `;
}

function renderSafetyEvalDimensionCard(group){
  return `
    <section class="safety-eval-dim-card ${group.wide?"wide":""}">
      <div class="safety-eval-dim-hd"><h3>${group.title} <i>i</i></h3>${renderSafetyEvalSpark(group.spark)}</div>
      <div class="safety-eval-mini-grid">
        ${group.items.map(item=>`
          <div class="safety-eval-mini">
            <span>${item[0]}</span>
            <strong class="${item[2]||""}">${item[1]}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

const safetyEvaluationRadarAxes=[
  {name:"信息保障",score:17.0,lastScore:15.6,count:22,trend:"↑ 1.4",pos:"top",x:130,y:18,labelX:98,labelY:0},
  {name:"现场管控",score:16.6,lastScore:15.1,count:22,trend:"↑ 1.5",pos:"right",x:228,y:84,labelX:208,labelY:106},
  {name:"组织行为",score:18.2,lastScore:18.9,count:22,trend:"↓ 0.7",pos:"bottom-right",x:190,y:190,labelX:190,labelY:236,down:true},
  {name:"技经融合",score:17.4,lastScore:16.3,count:22,trend:"↑ 1.1",pos:"bottom-left",x:70,y:190,labelX:42,labelY:236},
  {name:"溯源问效",score:15.8,lastScore:14.6,count:22,trend:"↑ 1.2",pos:"left",x:32,y:84,labelX:0,labelY:106}
];

function getSafetyEvaluationActiveRows(){
  return DashboardOrgSwitch.filter(safetyEvaluationRows,safetyEvaluationOrgState,row=>row[2],row=>row[3]);
}

function setSafetyEvaluationOrg(org){
  safetyEvaluationOrgState.company=org&&org!==safetyEvaluationOrgs[0]?org:"";
  safetyEvaluationOrgState.branch="";
  safetyEvaluationOrgState.active=safetyEvaluationOrgState.company||safetyEvaluationOrgs[0];
  safetyEvaluationFilterState.subCompany=safetyEvaluationOrgState.company;
  safetyEvaluationFilterState.branch="";
  safetyEvaluationFilterState.selectedIds=[];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function setSafetyEvaluationOrgSelection(selection){
  Object.assign(safetyEvaluationOrgState,selection);
  safetyEvaluationOrgState.active=safetyEvaluationOrgState.company||safetyEvaluationOrgs[0];
  safetyEvaluationFilterState.subCompany=safetyEvaluationOrgState.company;
  safetyEvaluationFilterState.branch=safetyEvaluationOrgState.branch;
  safetyEvaluationFilterState.selectedIds=[];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function getSafetyRadarPolygonPoints(axisData,key){
  const center={x:130,y:116};
  return axisData.map(axis=>{
    const ratio=Math.max(0,Math.min(1,Number(axis[key] || 0)/20));
    const x=center.x+(axis.x-center.x)*ratio;
    const y=center.y+(axis.y-center.y)*ratio;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function renderSafetyEvalRadar(){
  const activeRows=getSafetyEvaluationActiveRows();
  const axisData=safetyEvaluationRadarAxes.map((axis,index)=>{
    const values=activeRows.map(row=>Number(row[8+index])).filter(value=>!Number.isNaN(value));
    const score=values.length?Number((values.reduce((sum,value)=>sum+value,0)/values.length).toFixed(1)):axis.score;
    const lastScore=Number(axis.lastScore || Math.max(0,score-1));
    return {...axis,score,lastScore,count:activeRows.length || axis.count};
  });
  const currentPoints=getSafetyRadarPolygonPoints(axisData,"score");
  const previousPoints=getSafetyRadarPolygonPoints(axisData,"lastScore");
  return `
    <div class="safety-eval-radar interactive">
      <svg viewBox="0 0 260 210" aria-hidden="true">
        <polygon points="130,18 228,84 190,190 70,190 32,84" fill="none" stroke="#d7e0ec"/>
        <polygon points="130,54 192,96 168,164 92,164 68,96" fill="none" stroke="#d7e0ec"/>
        <line x1="130" y1="18" x2="130" y2="190" stroke="#d7e0ec"/>
        <line x1="32" y1="84" x2="190" y2="190" stroke="#d7e0ec"/>
        <line x1="228" y1="84" x2="70" y2="190" stroke="#d7e0ec"/>
        <polygon points="${previousPoints}" fill="rgba(148,163,184,.18)" stroke="#94a3b8" stroke-width="1.5"/>
        <polygon points="${currentPoints}" fill="rgba(45,115,255,.16)" stroke="#2d73ff" stroke-width="2"/>
        ${axisData.map((axis,index)=>`
          <g class="radar-axis radar-axis-${index}">
            <line class="radar-axis-line" x1="130" y1="116" x2="${axis.x}" y2="${axis.y}"/>
            <circle class="radar-axis-dot" cx="${axis.x}" cy="${axis.y}" r="4"/>
          </g>
        `).join("")}
      </svg>
      ${axisData.map((axis,index)=>`
        <span class="radar-label ${axis.pos} radar-hover-target radar-target-${index}">
          ${axis.name}<br><b>${axis.score.toFixed(1)}/20</b><em class="${axis.down?"down":""}">${axis.trend}</em>
          <span class="radar-tooltip">
            <strong>${axis.name}</strong>
            <i>平均得分：${axis.score.toFixed(1)}分</i>
            <i>参与评价项目数：${axis.count}个</i>
          </span>
        </span>
      `).join("")}
      <div class="radar-hotspots">
        ${axisData.map((axis,index)=>`
          <span class="radar-hotspot radar-target-${index}" style="left:${Math.round(14+axis.x*230/260-28)}px;top:${Math.round(38+axis.y*190/210-22)}px">
            <span class="radar-tooltip">
              <strong>${axis.name}</strong>
              <i>平均得分：${axis.score.toFixed(1)}分</i>
              <i>参与评价项目数：${axis.count}个</i>
            </span>
          </span>
        `).join("")}
      </div>
      <div class="radar-legend"><span class="current"></span>本月得分<span class="previous"></span>上月得分</div>
    </div>
  `;
}

function safetyEvalUnique(index){
  return [...new Set(safetyEvaluationRows.map(row=>row[index]).filter(Boolean))];
}

function getSafetyEvaluationRowsBeforeRiskFilter(){
  const s=safetyEvaluationFilterState;
  return getSafetyEvaluationActiveRows().filter(row=>{
    if(s.projectName&&!row[1].includes(s.projectName))return false;
    if(s.subCompany&&row[2]!==s.subCompany)return false;
    if(s.branch&&row[3]!==s.branch)return false;
    if(s.manager&&!row[4].includes(s.manager))return false;
    if(s.status&&row[5]!==s.status)return false;
    return true;
  });
}

function getSafetyEvaluationFilteredRows(){
  const s=safetyEvaluationFilterState;
  let rows=getSafetyEvaluationRowsBeforeRiskFilter().filter(row=>!s.riskLevel||row[7]===s.riskLevel);
  if(s.scoreSort){
    rows=[...rows].sort((a,b)=>{
      const diff=Number(a[6])-Number(b[6]);
      return s.scoreSort==="asc"?diff:-diff;
    });
  }
  return rows;
}

function getSafetyEvaluationSummaryItems(){
  const rows=getSafetyEvaluationRowsBeforeRiskFilter();
  const countByRisk=level=>rows.filter(row=>row[7]===level).length;
  return safetyEvaluationSummaryMeta.map(item=>({
    ...item,
    value:item.level?countByRisk(item.level):rows.length
  }));
}

function getSafetyEvalSelectedIdsInRows(rows=getSafetyEvaluationFilteredRows()){
  const ids=new Set(rows.map(row=>String(row[0])));
  return safetyEvaluationFilterState.selectedIds.filter(id=>ids.has(String(id)));
}

function isSafetyEvalRowSelected(id){
  return safetyEvaluationFilterState.selectedIds.includes(String(id));
}

function toggleSafetyEvalRowSelect(id,checked){
  const rowId=String(id);
  const ids=new Set(safetyEvaluationFilterState.selectedIds.map(String));
  if(checked)ids.add(rowId);
  else ids.delete(rowId);
  safetyEvaluationFilterState.selectedIds=[...ids];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function toggleSafetyEvalSelectAll(checked){
  const pageIds=getSafetyEvaluationFilteredRows().slice(0,safetyEvaluationTablePageSize).map(row=>String(row[0]));
  const ids=new Set(safetyEvaluationFilterState.selectedIds.map(String));
  pageIds.forEach(id=>checked?ids.add(id):ids.delete(id));
  safetyEvaluationFilterState.selectedIds=[...ids];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function getSafetyEvaluationRankRows(){
  const rows=getSafetyEvaluationFilteredRows();
  const active=safetyEvaluationOrgState.active;
  const groupIndex=active&&active!==safetyEvaluationOrgs[0]?3:2;
  const groups=[...new Set(rows.map(row=>row[groupIndex]).filter(Boolean))];
  return groups.map(name=>{
    const items=rows.filter(row=>row[groupIndex]===name);
    const avg=items.length?(items.reduce((sum,row)=>sum+Number(row[6]||0),0)/items.length).toFixed(1):"0.0";
    const count=level=>items.filter(row=>row[7]===level).length;
    return [name,avg,String(items.length),String(count("风险极高")),String(count("风险较高")),String(count("风险可控"))];
  }).sort((a,b)=>Number(b[1])-Number(a[1]));
}

function renderSafetyEvaluationRankTable(){
  const rows=getSafetyEvaluationRankRows();
  const active=safetyEvaluationOrgState.active;
  const firstTitle=active&&active!==safetyEvaluationOrgs[0]?"分公司":"公司";
  const title=active&&active!==safetyEvaluationOrgs[0]?`${active}分公司风险管控能力评价`:"公司风险管控能力评价";
  return `
    <section class="safety-eval-rank-card">
      <div class="rank-title"><span>🛡</span><h3>${title}</h3></div>
      <table>
        <thead><tr><th>${firstTitle}</th><th>评价得分</th><th>参评项目数</th><th>风险极高</th><th>风险较高</th><th>风险可控</th></tr></thead>
        <tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="6" class="safety-eval-empty-rank">暂无数据</td></tr>`}</tbody>
      </table>
    </section>
  `;
}

function setSafetyEvalRiskFilter(level){
  safetyEvaluationFilterState.riskLevel=safetyEvaluationFilterState.riskLevel===level?"":level;
  safetyEvaluationFilterState.selectedIds=[];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function toggleSafetyEvalScoreSort(){
  safetyEvaluationFilterState.scoreSort=safetyEvaluationFilterState.scoreSort==="desc"?"asc":"desc";
  renderSafetyEvaluationDashboardPreservingScroll();
}

function setSafetyEvalFilter(key,value){
  safetyEvaluationFilterState[key]=value;
  if(key==="subCompany"){
    safetyEvaluationOrgState.company=value;
    safetyEvaluationOrgState.branch="";
    safetyEvaluationOrgState.active=value || safetyEvaluationOrgs[0];
    safetyEvaluationFilterState.branch="";
  }
  if(key==="branch")safetyEvaluationOrgState.branch=value;
  safetyEvaluationFilterState.selectedIds=[];
  renderSafetyEvaluationDashboardPreservingScroll();
}

function sendSafetyEvalMonthlyReport(manager){
  showToast(`项目的安全评价月报已成功发送给项目经理${manager}`);
}

function downloadSafetyEvalMonthlyReport(){
  showToast("项目安全评价月报下载成功");
}

function batchSendSafetyEvalMonthlyReport(){
  const count=getSafetyEvalSelectedIdsInRows().length;
  if(!count)return;
  showToast(`已批量发送 ${count} 个项目的安全评价月报至项目经理`);
}

function batchDownloadSafetyEvalMonthlyReport(){
  const count=getSafetyEvalSelectedIdsInRows().length;
  if(!count)return;
  showToast(`已批量下载 ${count} 个项目安全评价月报`);
}

function renderSafetyEvalOptions(values,current){
  return `<option value="">全部</option>${values.map(value=>`<option value="${value}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function renderSafetyEvaluationDetailRows(){
  return safetyEvaluationDetailGroups.map(group=>group.items.map((item,index)=>`
    <tr>
      ${index===0?`<td class="detail-dim" rowspan="${group.items.length}">${group.name}<i>i</i></td><td class="detail-dim-score ${group.score.startsWith("20")?"":"deduct"}" rowspan="${group.items.length}">${group.score}</td>`:""}
      <td>${item[0]}</td>
      <td class="${item[3]?"deduct":""}">${item[1]}</td>
      <td class="${item[3]?"deduct":""}">${item[2]}</td>
    </tr>
  `).join("")).join("");
}

function openSafetyEvaluationDetail(rowNo){
  const row=safetyEvaluationRows.find(item=>String(item[0])===String(rowNo)) || safetyEvaluationRows[0];
  const meta=safetyEvaluationDetailMeta[(Number(row[0])||1)-1] || safetyEvaluationDetailMeta[0];
  const dims=safetyEvaluationRadarAxes.map((axis,index)=>[axis.name,row[8+index]]);
  const riskType=row[7]==="风险可控"?"green":row[7]==="风险较高"?"orange":"red";
  const html=`
    <div class="safety-eval-detail-page">
      <section class="safety-eval-detail-hero">
        <div class="detail-hero-top">
          <div>
            <h3>${row[1]}</h3>
            <div class="detail-tags">
              ${tag(row[5],"green")}
              ${meta.tags.map((text,index)=>`<span class="detail-soft-tag ${index===3?"red":index===4?"green":""}">${text}</span>`).join("")}
            </div>
          </div>
          <span class="detail-update">当前为2025年45周评分，更新于：2025-12-31 08:22</span>
        </div>
        <div class="detail-info-grid">
          <span>子公司：<b>${row[2]}</b></span>
          <span>分公司：<b>${row[3]}</b></span>
          <span>项目经理：<b>${row[4]}</b></span>
          <span>项目造价：<b>${meta.cost}</b></span>
        </div>
      </section>

      <section class="safety-eval-detail-score">
        <div class="detail-score-main">
          <div>
            <h4>项目总分</h4>
            <strong>${row[6]}<em>分</em></strong>
            <p>较上月 <b class="${row[14]}">${row[13]}</b></p>
          </div>
          ${renderSafetyEvalSpark([10,13,11,17,14,18])}
        </div>
        <div class="detail-score-level">
          <h4>项目安全等级</h4>
          ${tag(row[7],riskType)}
        </div>
        <div class="detail-dim-scores">
          ${dims.map(item=>`
            <div>
              <span>${item[0]}</span>
              <strong>${item[1]}<em>/20</em></strong>
              <p>较上月 <b>↑ 3.6</b></p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="safety-eval-detail-table-wrap">
        <table class="safety-eval-detail-table">
          <thead>
            <tr><th>评价维度</th><th>得分/总分</th><th>评价因子</th><th>得分/总分</th><th>扣分原因</th></tr>
          </thead>
          <tbody>${renderSafetyEvaluationDetailRows()}</tbody>
        </table>
      </section>
    </div>
  `;
  openModal("评分详情",html,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("safety-eval-detail-modal");
}

function renderSafetyEvaluationTable(){
  const rows=getSafetyEvaluationFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/safetyEvaluationTablePageSize));
  const pageRows=rows.slice(0,safetyEvaluationTablePageSize);
  const pageIds=pageRows.map(row=>String(row[0]));
  const selectedIds=getSafetyEvalSelectedIdsInRows(rows);
  const selectedCount=selectedIds.length;
  const isAllPageSelected=pageIds.length>0&&pageIds.every(id=>isSafetyEvalRowSelected(id));
  const scoreSort=safetyEvaluationFilterState.scoreSort;
  const sortMark=scoreSort==="asc"?"↑":scoreSort==="desc"?"↓":"↕";
  const riskFilter=safetyEvaluationFilterState.riskLevel?`<span class="safety-eval-active-filter">风险等级：${safetyEvaluationFilterState.riskLevel}<button onclick="setSafetyEvalRiskFilter('${safetyEvaluationFilterState.riskLevel}')">×</button></span>`:"";
  return `
    <section class="safety-eval-table-card">
      <div class="safety-eval-table-toolbar">
        <h3>评价项目${riskFilter}</h3>
        <div class="safety-eval-table-tools">
          <div class="safety-eval-batch-actions">
            <button class="${selectedCount?"active":""}" ${selectedCount?"":"disabled"} onclick="batchSendSafetyEvalMonthlyReport()">批量发送报告</button>
            <button class="${selectedCount?"active":""}" ${selectedCount?"":"disabled"} onclick="batchDownloadSafetyEvalMonthlyReport()">批量下载报告</button>
          </div>
          <div class="safety-eval-filters">
            <label>项目名称<input value="${escapeAttr(safetyEvaluationFilterState.projectName)}" placeholder="请输入项目名称" onblur="setSafetyEvalFilter('projectName',this.value.trim())"/></label>
            <label>子公司<select onchange="setSafetyEvalFilter('subCompany',this.value)">${renderSafetyEvalOptions(safetyEvalUnique(2),safetyEvaluationFilterState.subCompany)}</select></label>
            <label>分公司<select onchange="setSafetyEvalFilter('branch',this.value)">${renderSafetyEvalOptions(safetyEvalUnique(3),safetyEvaluationFilterState.branch)}</select></label>
            <label>项目经理<input value="${escapeAttr(safetyEvaluationFilterState.manager)}" placeholder="请输入项目经理" onblur="setSafetyEvalFilter('manager',this.value.trim())"/></label>
            <label>项目状态<select onchange="setSafetyEvalFilter('status',this.value)">${renderSafetyEvalOptions(safetyEvalUnique(5),safetyEvaluationFilterState.status)}</select></label>
          </div>
        </div>
      </div>
      <div class="safety-eval-table-scroll">
        <table>
          <thead>
            <tr><th class="center col-select"><input type="checkbox" ${isAllPageSelected?"checked":""} onchange="toggleSafetyEvalSelectAll(this.checked)"/></th><th class="center col-index">序号</th><th class="col-project">项目名称</th><th class="center">子公司</th><th class="center">分公司</th><th class="center">项目经理</th><th class="center">项目状态</th><th class="center sortable-score" onclick="toggleSafetyEvalScoreSort()">综合得分 <span>${sortMark}</span></th><th class="center">风险等级</th><th class="center" colspan="5">五大维度得分（信息保障/现场管控/组织行为/技经融合/溯源问效）</th><th class="center">较上月</th><th class="center col-report-action">操作</th></tr>
          </thead>
          <tbody>
            ${pageRows.map((row,index)=>`
              <tr>
                <td class="center col-select"><input type="checkbox" ${isSafetyEvalRowSelected(row[0])?"checked":""} onchange="toggleSafetyEvalRowSelect('${escapeAttr(row[0])}',this.checked)"/></td><td class="center col-index">${index+1}</td><td class="project-name col-project"><a class="link" onclick="openSafetyEvaluationDetail('${escapeAttr(row[0])}')">${row[1]}</a></td><td class="center">${row[2]}</td><td class="center">${row[3]}</td><td class="center">${row[4]}</td>
                <td class="center"><span class="dot ${row[5]==="竣工"?"blue":"green"}"></span>${row[5]}</td><td class="center">${row[6]}</td>
                <td class="center">${tag(row[7],row[7]==="风险可控"?"green":row[7]==="风险较高"?"orange":"red")}</td>
                <td>${row[8]}</td><td>${row[9]}</td><td>${row[10]}</td><td>${row[11]}</td><td>${row[12]}</td>
                <td class="center ${row[14]}">${row[13]}</td>
                <td class="center col-report-action"><div class="report-actions"><a class="link" onclick="sendSafetyEvalMonthlyReport('${escapeAttr(row[4])}')">发送报告</a><a class="link" onclick="downloadSafetyEvalMonthlyReport()">下载报告</a></div></td>
              </tr>
            `).join("") || `<tr><td colspan="16" class="safety-eval-empty-row">暂无数据</td></tr>`}
          </tbody>
        </table>
      </div>
      <div class="safety-eval-pagination"><span>共 ${rows.length} 条数据</span><div><button>‹</button><button class="active">1</button><span>/ ${totalPages}</span><button>›</button></div></div>
    </section>
  `;
}

function renderSafetyEvaluationDashboardPage(){
  detailPage.style.display="none";
  listPage.style.display="block";
  const summaryItems=getSafetyEvaluationSummaryItems();
  const averageStats=getSafetyEvaluationAverageStats();
  listPage.innerHTML=`
    <div class="safety-screen-page safety-eval-page">
      ${renderSafetyScreenHeader("安全评价")}
      <div class="safety-eval-org-switch-wrap">
        ${DashboardOrgSwitch.render({id:"safety-evaluation-org",records:safetyEvaluationRows,state:safetyEvaluationOrgState,companyKey:row=>row[2],branchKey:row=>row[3],onChange:setSafetyEvaluationOrgSelection})}
        <div class="safety-eval-worker">
          ${renderSafetyXiaoAnDialog()}
          <button class="safety-xiaoan-avatar" title="安全小警" onclick="openSafetyXiaoAnDialog()">
            <img src="src/assets/safety-xiaoan.png" alt="安全小警小安"/>
          </button>
        </div>
      </div>
      <div class="safety-eval-body">
        <aside class="safety-eval-left">
          <section class="safety-eval-score-card">
            <h3>评价项目平均得分</h3>
            <div class="score-row"><strong>${averageStats.avg}</strong><span>分</span></div>
            <div class="score-trend"><span>较上月 <b class="${averageStats.trendClass}">${averageStats.trend}</b></span>${renderSafetyEvalSpark(averageStats.spark)}</div>
          </section>
          <section class="safety-eval-radar-card">
            <h3>五大维度得分分布</h3>
            ${renderSafetyEvalRadar()}
          </section>
        </aside>
        <main class="safety-eval-main">
          <section class="safety-eval-summary">
            ${summaryItems.map(item=>`
              <div class="safety-eval-summary-item ${item.level?"clickable":""} ${item.level&&safetyEvaluationFilterState.riskLevel===item.level?"active":""}" ${item.level?`onclick="setSafetyEvalRiskFilter('${item.level}')"`:""}>
                <div class="summary-icon ${item.color}">${item.iconType==="image"?`<img src="${item.icon}" alt="${item.label}"/>`:item.icon}</div>
                <div><span>${item.label}</span><strong>${item.value}<em>个</em></strong><p>较上月 <b>${item.trend || "↑ 4"}</b></p></div>
              </div>
            `).join("")}
          </section>
          <div class="safety-eval-dim-grid">
            ${safetyEvaluationDimensions.map(renderSafetyEvalDimensionCard).join("")}
          </div>
        </main>
        <aside class="safety-eval-right">
          ${renderSafetyEvaluationRankTable()}
        </aside>
        ${renderSafetyEvaluationTable()}
      </div>
    </div>
  `;
}

function renderSafetyEvaluationDashboardPreservingScroll(){
  renderWithPreservedScroll(renderSafetyEvaluationDashboardPage,[".safety-eval-page",".safety-eval-table-scroll","#listPage",".main"]);
}

function renderSafetyScreenPanel(title,topItems,warnItems,type,withInfo=false){
  return `
    <div class="screen-panel ${type}">
      <div class="screen-panel-hd"><h2>${title}${withInfo?`<i>i</i>`:""}</h2><button>进入专版 →</button></div>
      <div class="screen-kpi-grid">
        ${topItems.map(item=>{
          const hasUnit=item.length>3;
          let displayValue=String(item[1] || "");
          let inferredUnit="";
          if(!hasUnit){
            const valueMatch=displayValue.match(/^([\d,.]+)\s*([^\d,.\s]+)$/);
            if(valueMatch){
              displayValue=valueMatch[1];
              inferredUnit=valueMatch[2];
            }else if(type==="hazard"){
              inferredUnit="个";
            }
          }
          const unitText=hasUnit?item[2]:inferredUnit;
          const noteText=hasUnit?item[3]:item[2];
          const isDual=hasUnit && String(item[1]).includes("/");
          if(isDual){
            const values=String(item[1]).split("/").map(x=>x.trim());
            const labels=String(item[3] || "").split("/").map(x=>x.trim());
            return `
              <div class="screen-kpi-card kpi-card-dual">
                <span>${item[0]}</span>
                <div class="kpi-dual-row">
                  <div><i>${labels[0] || ""}</i><b>${values[0] || "-"}<em class="kpi-unit">${item[2]}</em></b></div>
                  <div><i>${labels[1] || ""}</i><b>${values[1] || "-"}<em class="kpi-unit">${item[2]}</em></b></div>
                </div>
              </div>
            `;
          }
          return `
            <div class="screen-kpi-card">
              <span>${item[0]}</span>
              <strong>${displayValue}${unitText?`<em class="kpi-unit">${unitText}</em>`:""}</strong>
              ${noteText?`<em class="kpi-note">${noteText}</em>`:""}
            </div>
          `;
        }).join("")}
      </div>
      <div class="screen-warn-grid">
        ${warnItems.map(item=>`
          <div class="screen-warn-card"><span>${item[0]}</span><strong>${item[1]}<em>个</em></strong></div>
        `).join("")}
      </div>
    </div>
  `;
}

const safetyStaffShortageRows=[
  {project:"上海市轨道交通23号线一期工程土建12标",sub:"上海隧道",branch:"市政分公司",manager:"王志华",status:"在建",cost:"249,388.00万元",actual:1,required:3,areaCity:"上海市 浦东新区",region:"长三角区域",owner:"上海轨道交通建设管理中心"},
  {project:"大外环西段天然气高压管线工程",sub:"上海隧道",branch:"轨交分公司",manager:"张建军",status:"在建",cost:"182,500.00万元",actual:0,required:2,areaCity:"上海市 闵行区",region:"长三角区域",owner:"上海燃气集团"},
  {project:"青草沙-陈行库管连通工程KG1.6标",sub:"市政集团",branch:"机顶公司",manager:"陈建胜",status:"在建",cost:"41,335.16万元",actual:0,required:1,areaCity:"上海市 崇明区",region:"长三角区域",owner:"上海城投水务"},
  {project:"新建莘庄镇222号地块三期工程",sub:"上海路桥",branch:"总承包二部",manager:"赵菁",status:"在建",cost:"154,858.24万元",actual:1,required:2,areaCity:"上海市 闵行区",region:"长三角区域",owner:"上海莘天置业"},
  {project:"深国际上海闵行B-1厂房装修工程",sub:"市政集团",branch:"第一建筑",manager:"李强",status:"待建",cost:"9,860.00万元",actual:0,required:1,areaCity:"上海市 闵行区",region:"长三角区域",owner:"深国际物流发展"},
  {project:"湾区金融中心项目",sub:"城建国际",branch:"新加坡分公司",manager:"李项目",status:"在建",cost:"276,800.00万元",actual:2,required:3,areaCity:"广东省 深圳市",region:"大湾区",owner:"前海建设投资"},
  {project:"北方数据中心项目",sub:"市政集团",branch:"第一建筑",manager:"赵经理",status:"完工",cost:"98,000.00万元",actual:0,required:1,areaCity:"河南省 郑州市",region:"中原区域",owner:"北方云计算公司"},
  {project:"奉贤新城18单元项目",sub:"市政集团",branch:"第二建筑",manager:"俞华杰",status:"在建",cost:"457,000.00万元",actual:2,required:4,areaCity:"上海市 奉贤区",region:"长三角区域",owner:"上海肖塘投资"}
];

tableColumnDefinitions.safetyStaffShortage=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>index+1},
  {key:"project",title:"项目名称",width:260,align:"left",render:row=>row.project},
  {key:"sub",title:"子公司",width:120,align:"center",render:row=>row.sub},
  {key:"branch",title:"分公司",width:140,align:"center",render:row=>row.branch},
  {key:"manager",title:"项目经理",width:110,align:"center",render:row=>row.manager},
  {key:"status",title:"项目状态",width:100,align:"center",render:row=>tag(row.status,row.status==="在建"?"green":row.status==="待建"?"orange":"blue")},
  {key:"cost",title:"项目造价",width:140,align:"right",render:row=>row.cost},
  {key:"actual",title:"已配置安全岗人数",width:150,align:"right",render:row=>row.actual},
  {key:"required",title:`应配置安全岗人数 <span class="help-ico" data-tip="【总包安全员数量规定： \n1）5000万元以下的项目不少于1人\n2）5000万～2亿元的项目不少于2人\n3）2亿元以上的项目不少于3人，且每增加2亿元，应当至少增加1名专职安全生产管理人员】" onmouseenter="showFloatingInfoTip(this)" onmouseleave="hideFloatingInfoTip()">💬</span>`,width:170,align:"right",render:row=>row.required},
  {key:"areaCity",title:"所在省市",width:140,align:"center",render:row=>row.areaCity},
  {key:"region",title:"所属区域",width:130,align:"center",render:row=>row.region},
  {key:"owner",title:"建设单位",width:220,align:"left",render:row=>row.owner}
];

const safetyStaffShortageState={project:"",sub:"",branch:"",manager:"",status:""};

function getSafetyStaffShortageFiltered(){
  return safetyStaffShortageRows.filter(row=>{
    if(safetyStaffShortageState.project && !row.project.includes(safetyStaffShortageState.project))return false;
    if(safetyStaffShortageState.sub && row.sub!==safetyStaffShortageState.sub)return false;
    if(safetyStaffShortageState.branch && row.branch!==safetyStaffShortageState.branch)return false;
    if(safetyStaffShortageState.manager && !row.manager.includes(safetyStaffShortageState.manager))return false;
    if(safetyStaffShortageState.status && row.status!==safetyStaffShortageState.status)return false;
    return true;
  });
}

function uniqueSafetyStaffOptions(key){
  return [...new Set(safetyStaffShortageRows.map(row=>row[key]).filter(Boolean))];
}

function renderSafetyStaffOption(value,current){
  return `<option value="${value}" ${value===current?"selected":""}>${value}</option>`;
}

function renderSafetyStaffShortageBody(){
  const list=getSafetyStaffShortageFiltered();
  const body=document.getElementById("modalBody");
  if(!body)return;
  body.innerHTML=`
    <div class="send-drill-modal">
      ${renderUnifiedQueryCard(`
        <div class="form-item"><label>项目名称</label><input class="input" id="safetyDrillProject" value="${safetyStaffShortageState.project}" placeholder="模糊搜索"/></div>
        <div class="form-item"><label>子公司</label><select class="select" id="safetyDrillSub"><option value="">全部</option>${uniqueSafetyStaffOptions("sub").map(x=>renderSafetyStaffOption(x,safetyStaffShortageState.sub)).join("")}</select></div>
        <div class="form-item"><label>分公司</label><select class="select" id="safetyDrillBranch"><option value="">全部</option>${uniqueSafetyStaffOptions("branch").map(x=>renderSafetyStaffOption(x,safetyStaffShortageState.branch)).join("")}</select></div>
        <div class="form-item"><label>项目经理</label><input class="input" id="safetyDrillManager" value="${safetyStaffShortageState.manager}" placeholder="模糊搜索"/></div>
        <div class="form-item"><label>项目状态</label><select class="select" id="safetyDrillStatus"><option value="">全部</option>${uniqueSafetyStaffOptions("status").map(x=>renderSafetyStaffOption(x,safetyStaffShortageState.status)).join("")}</select></div>
      `,{
        id:"safetyStaffShortageQueryCard",
        title:"查询条件",
        resetFn:"resetSafetyStaffShortageDrill()",
        queryFn:"querySafetyStaffShortageDrill()",
        gridClass:"search-grid"
      })}
      <section class="card table-card send-drill-table-card">
        <div class="card-hd">
          <div class="card-title">项目列表</div>
          <div class="actions">
            <button class="btn" onclick="renderSafetyStaffShortageBody();showToast('已刷新明细')">刷新</button>
            <button class="btn primary" onclick="exportSafetyStaffShortageDrill()">导出</button>
            <button class="column-setting-icon-btn" title="列配置" onclick="openColumnSetting('safetyStaffShortage','reopenSafetyStaffShortageDrillAfterColumnSetting')">⚙</button>
          </div>
        </div>
        <div class="table-wrap roster-table-wrap">
          <table id="safetyStaffShortageTable" style="min-width:${getTableMinWidth("safetyStaffShortage")}px">
            <thead>
              <tr id="safetyStaffShortageThead">${renderTableHeaderByColumns("safetyStaffShortage")}</tr>
            </thead>
            <tbody id="safetyStaffShortageTbody"></tbody>
          </table>
        </div>
        <div class="pagination"><span>共 ${list.length} 条记录</span><span>第 1 / 1 页&nbsp;&nbsp;每页 10 条</span></div>
      </section>
    </div>
  `;
  renderTableByColumns("safetyStaffShortage",list,"safetyStaffShortageTbody");
}

function openTotalContractorSafetyStaffShortageDrill(){
  safetyStaffShortageState.project="";
  safetyStaffShortageState.sub="";
  safetyStaffShortageState.branch="";
  safetyStaffShortageState.manager="";
  safetyStaffShortageState.status="";
  openModal("总包安全员未配足项目数","",`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("send-drill-modal-box");
  renderSafetyStaffShortageBody();
}

function querySafetyStaffShortageDrill(){
  safetyStaffShortageState.project=document.getElementById("safetyDrillProject")?.value.trim() || "";
  safetyStaffShortageState.sub=document.getElementById("safetyDrillSub")?.value || "";
  safetyStaffShortageState.branch=document.getElementById("safetyDrillBranch")?.value || "";
  safetyStaffShortageState.manager=document.getElementById("safetyDrillManager")?.value.trim() || "";
  safetyStaffShortageState.status=document.getElementById("safetyDrillStatus")?.value || "";
  renderSafetyStaffShortageBody();
}

function resetSafetyStaffShortageDrill(){
  safetyStaffShortageState.project="";
  safetyStaffShortageState.sub="";
  safetyStaffShortageState.branch="";
  safetyStaffShortageState.manager="";
  safetyStaffShortageState.status="";
  renderSafetyStaffShortageBody();
}

function exportSafetyStaffShortageDrill(){
  showToast("导出成功：总包安全员未配足项目数明细.xlsx");
}

function reopenSafetyStaffShortageDrillAfterColumnSetting(){
  openModal("总包安全员未配足项目数","",`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("send-drill-modal-box");
  renderSafetyStaffShortageBody();
}

if(!window.__safetyDashboardDrillBoundV22102){
  window.__safetyDashboardDrillBoundV22102=true;
  document.addEventListener("click",event=>{
    const card=event.target.closest?.(".screen-panel.realname .screen-warn-card:first-child");
    if(!card)return;
    openTotalContractorSafetyStaffShortageDrill();
  });
}

function renderSafetyWarningPanel(){
  const items=[
    ["170","重复隐患项目"],
    ["1","隐患整改不及时项目预警"],
    ["11","重大事故隐患预警项目"],
    ["163","上级单位检查预警"],
    ["-","安全投入预警项目"],
    ["236","总包、分包关键岗位不到位项目"]
  ];
  return `
    <div class="screen-panel screen-warning-panel">
      <div class="screen-warning-title"><span>⚡</span><h2>预警项</h2></div>
      <div class="screen-warning-grid">
        ${items.map((item,index)=>`
          <div class="screen-warning-cell ${item[0]==="-"?"empty":""}">
            <strong>${item[0]}${item[0]!=="-"?`<em>个</em>`:""}</strong>
            <span>${item[1]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderSafetyRiskProjects(){
  const projects=[
    {
      name:"新建上海至南通铁路太仓至四团段吴淞口长江隧道越江段及外高桥集装箱作业站工程HTZ...",
      company:"上海隧道/市政分公司",
      manager:"王志华",
      amount:"249,388.00万元",
      rate:"-",
      risk:"旁通道施工",
      category:"工程类风险",
      time:"2026-03-06 ~ 2026-06-30",
      desc:"4#，8#旁通道施工，联络通道采用冻结法加固土层、暗挖法施工，复合式衬砌",
      video:"1个",
      days:"117天",
      checks:["06月29日 3条","06月22日 7条"]
    },
    {
      name:"青草沙-陈行库管连通工程KG1.6标",
      company:"市政集团/机顶公司",
      manager:"陈建胜",
      amount:"41,335.16万元",
      rate:"14.63%",
      risk:"深基坑开挖",
      category:"工程类风险",
      time:"2026-03-31 ~ 2026-09-30",
      desc:"基坑开挖深度30.08米（明挖逆作法），距离外环线高速25.4米，距离35KV架空...",
      video:"2个",
      days:"92天",
      checks:["06月20日 2条","06月25日 2条"]
    },
    {
      name:"新建莘庄镇222号地块（莘庄地铁站上盖综合开发项目）三期工程总承包工程",
      company:"上海路桥/总承包二部",
      manager:"赵菁",
      amount:"154,858.24万元",
      rate:"-",
      risk:"承台施工、预制梁架设",
      category:"工程类风险",
      time:"2026-05-11 ~ 2026-12-31",
      desc:"地铁1号线莘庄站站厅东西两侧立柱基础、触网改造、上建结构拆除等施工。距...",
      video:"2个",
      days:"49天",
      checks:["06月29日 2条","06月25日 1条"]
    }
  ];
  return `
    <section class="screen-risk-section">
      <div class="screen-risk-tabs"><button class="active">重大安全风险项目(5)</button><button>项目现场AI抓拍</button></div>
      <div class="screen-risk-list">
        ${projects.map(p=>`
          <article class="screen-risk-card">
            <span class="risk-status">实施中</span>
            <h3>${p.name}</h3>
            <div class="risk-info-grid">
              <span>所属公司<b>${p.company}</b></span>
              <span>项目经理<b>${p.manager}</b></span>
              <span>总包合同含税价<b>${p.amount}</b></span>
              <span>产值完成率<b>${p.rate}</b></span>
            </div>
            <div class="risk-focus-grid">
              <span>风险内容<b>${p.risk}</b></span>
              <span>风险类别<b>${p.category}</b></span>
              <span>风险预计时间<b>${p.time}</b></span>
            </div>
            <p class="risk-desc"><b>危险有害因素描述</b>${p.desc}</p>
            <div class="risk-bottom">
              <div><span>📘 风险跟踪情况</span><b>视频监控 ${p.video}</b><em>已上传日报 ${p.days}</em></div>
              <div><span>▣ 近期隐患排查情况</span>${p.checks.map(x=>`<b>${x}</b>`).join("")}</div>
              <div><span>👥 关键岗位到岗履职情况</span><em>暂无数据</em></div>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
