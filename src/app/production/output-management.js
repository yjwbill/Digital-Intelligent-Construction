const outputForecastState={
  activeTab:"施工项目（已立项）",
  projectName:"",
  company:"",
  branch:"",
  projectStatus:"",
  bidMonth:"",
  projectNo:"",
  orderProjectName:"",
  orderCompany:"",
  orderBidMonth:"",
  orderProjectNo:"",
  ownerUnit:"",
  statKey:"all",
  page:1,
  pageSize:10
};
const outputManagementTemplatePath="src/app/production/output-management.html";
let outputManagementTemplatePromise=null;

function getOutputManagementTemplatesFromDocument(){
  const templates=new Map();
  document.querySelectorAll("template[data-output-management-template]").forEach(template=>{
    templates.set(template.dataset.outputManagementTemplate,template);
  });
  return templates.size?templates:null;
}

function loadOutputManagementTemplates(){
  const inlineTemplates=getOutputManagementTemplatesFromDocument();
  if(inlineTemplates)return Promise.resolve(inlineTemplates);

  if(!outputManagementTemplatePromise){
    outputManagementTemplatePromise=fetch(outputManagementTemplatePath)
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,"text/html");
        const templates=new Map();
        doc.querySelectorAll("template[data-output-management-template]").forEach(template=>{
          templates.set(template.dataset.outputManagementTemplate,template);
        });
        return templates;
      })
      .catch(error=>{
        console.warn("load output templates failed",error);
        outputManagementTemplatePromise=null;
        return new Map();
      });
  }
  return outputManagementTemplatePromise;
}

async function mountOutputManagementTemplate(name){
  const templates=await loadOutputManagementTemplates();
  const template=templates.get(name);
  if(!template){
    const fallback=document.createElement("div");
    fallback.className="project-log-empty";
    fallback.textContent="产值管理页面模板加载失败";
    listPage.replaceChildren(fallback);
    return false;
  }
  listPage.replaceChildren(document.importNode(template.content,true));
  return true;
}

function outputSlot(name){
  return document.querySelector(`[data-output-slot="${name}"]`);
}

function getOutputForecastProjectStatusOptions(){
  return typeof getDictEnabledOptionsV2285==="function"
    ? getDictEnabledOptionsV2285("PROJECT_STATUS")
    : ["待建","在建","停工","完工","竣工","终止"];
}

const outputForecastConstructionRows=[
  ["PRJ-SD-2026-001","上海示范区线工程 SFQSG-15 标","上海隧道","轨交分公司","在建",286500,"2026-05-12","新接",0,52000,13850,12865,272650,82000,76000,13850],
  ["PRJ-SD-2025-018","郑州航空港片区综合管廊工程","上海隧道","河南分公司","在建",168900,"2025-11-20","转接",35200,42000,19150,7356,114550,39000,32000,54350],
  ["PRJ-SD-2024-023","临港新片区地下通道工程","上海隧道","市政分公司","在建",226300,"2024-09-08","转接",88420,50000,21500,8560,116380,46000,35800,109920],
  ["PRJ-LQ-2026-006","杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段","上海路桥","总承包一部","在建",319800,"2026-05-22","新接",0,68000,9632,9632,310168,92000,88000,9632],
  ["PRJ-LQ-2025-011","嘉闵线北延伸道路配套工程","上海路桥","总承包二部","停工",120600,"2025-08-16","转接",41200,26000,7200,0,72200,17000,15000,48400],
  ["PRJ-SZ-2026-003","新马工业园节能环保产业园项目","市政集团","上海分公司","在建",98600,"2026-05-06","新接",0,24000,6250,4567.8,92350,28000,22000,6250],
  ["PRJ-SZ-2025-021","深圳前海综合交通枢纽配套工程","市政集团","福建分公司","在建",264500,"2025-12-18","转接",56200,59000,24800,11890.5,183500,67000,52000,81000],
  ["PRJ-SZ-2026-009","南京江北新区综合管廊二期工程","市政集团","江苏分公司","在建",145800,"2026-05-28","新接",0,31000,6755.5,6755.5,139044.5,41000,33000,6755.5],
  ["PRJ-HJ-2024-017","苏州河深隧调蓄池工程","城市环境","上海城建水务工程有限公司","在建",184200,"2024-06-20","转接",104300,36000,17680,5234,62220,23000,16000,121980],
  ["PRJ-HJ-2023-029","浦东新区雨污分流提升工程","城市环境","浦东供排水分公司","停工",76800,"2023-10-14","完工未结算",64500,0,0,0,12300,0,0,64500],
  ["PRJ-SJ-2026-004","张江科学城创新中心项目","城建设计","长三院","在建",206400,"2026-05-19","新接",0,47000,15078,15078,191322,58000,42000,15078],
  ["PRJ-SJ-2025-015","松江枢纽综合开发项目","城建设计","南京分公司","在建",132900,"2025-07-26","转接",48860,30000,12360,8845,71680,26000,18500,61220],
  ["PRJ-NJ-2024-008","上海市轨道交通23号线一期土建工程","上海隧道","轨交分公司","在建",298000,"2024-12-06","转接",125600,64000,32100,10123,140300,56000,42000,157700],
  ["PRJ-LQ-2023-033","G318沪青平公路快速化改建工程","上海路桥","总承包一部","竣工",92000,"2023-09-11","完工未结算",83700,0,0,0,8300,0,0,83700],
  ["PRJ-WZ-2026-002","装配式构件供应基地扩建项目","城建物资","材料供应分公司","待建",68800,"2026-05-31","新接",0,18000,4620,3980,64180,17000,12500,4620]
].map((item,index)=>({
  id:index+1,
  projectNo:item[0],
  projectName:item[1],
  company:item[2],
  branch:item[3],
  projectStatus:item[4],
  contractAmount:item[5],
  totalContractPriceYuan:Math.round(item[5]*10000),
  approvalDate:item[6].slice(0,4)+"-"+String(Math.max(1,Number(item[6].slice(5,7))-1)).padStart(2,"0")+"-"+item[6].slice(8,10),
  bidDate:item[6],
  bidPriceEstimateYuan:Math.round(item[5]*10000*0.965),
  statisticNature:item[7],
  completedTo2025:item[8],
  annualPlanOutput:item[9],
  annualCompletedOutput:item[10],
  mayOutput:item[11],
  remainingContractOutput:item[12],
  remaining2026Forecast:item[13],
  forecast2027:item[14],
  accumulatedOutput:item[15]
}));

const outputForecastOrderRows=[
  ["ORD-2026-001","浦东机场四期配套市政道路工程","上海隧道","上海机场集团有限公司","2026-05-08",1865000000],
  ["ORD-2026-002","临港综合能源站及配套管廊项目","上海隧道","临港新片区投资控股有限公司","2026-05-16",958000000],
  ["ORD-2026-003","苏州河沿线排水系统提标工程","城市环境","上海城投水务集团有限公司","2026-04-22",728000000],
  ["ORD-2026-004","南京江北新区综合交通枢纽工程","市政集团","南京江北新区建设投资集团有限公司","2026-05-21",1436000000],
  ["ORD-2026-005","杭州湾跨海通道连接线改造工程","上海路桥","浙江交通投资集团有限公司","2026-03-30",2688000000],
  ["ORD-2026-006","张江中区地下空间综合开发项目","城建设计","上海张江集团有限公司","2026-05-26",866000000],
  ["ORD-2026-007","雄安新区地下综合管廊二期项目","上海隧道","中国雄安集团基础建设有限公司","2026-02-18",2190000000],
  ["ORD-2026-008","虹桥商务区慢行系统提升工程","市政集团","上海虹桥商务区开发建设有限公司","2026-04-11",356000000],
  ["ORD-2026-009","太湖新城水环境综合治理项目","城市环境","苏州吴中水务发展集团有限公司","2026-05-29",612000000],
  ["ORD-2026-010","奉贤新城高架快速路工程","上海路桥","上海奉贤交通能源集团有限公司","2026-01-25",1755000000],
  ["ORD-2026-011","上海国际旅游度假区配套道路项目","城建国际","上海申迪建设有限公司","2026-05-14",498000000],
  ["ORD-2026-012","轨交市域线车辆基地土建预订单","上海隧道","上海申通地铁建设集团有限公司","2026-04-27",1189000000]
].map((item,index)=>{
  const bidAmountWan=item[5]/10000;
  return {
    id:index+1,
    orderProjectNo:item[0],
    orderProjectName:item[1],
    managementUnit:item[2],
    ownerUnit:item[3],
    bidDate:item[4],
    bidPriceEstimateYuan:item[5],
    annualPlanOutput:Number((bidAmountWan*(0.18+(index%4)*0.025)).toFixed(2)),
    remainingContractOutput:Number((bidAmountWan*(0.72-(index%3)*0.035)).toFixed(2)),
    remaining2026Forecast:Number((bidAmountWan*(0.32+(index%5)*0.018)).toFixed(2)),
    forecast2027:Number((bidAmountWan*(0.24+(index%4)*0.015)).toFixed(2))
  };
});

function formatForecastAmount(value){
  return Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2});
}

function formatForecastYuan(value){
  return Number(value||0).toLocaleString("zh-CN",{maximumFractionDigits:0});
}

function getOutputForecastOrderSearchRows(){
  const s=outputForecastState;
  return outputForecastOrderRows.filter(row=>{
    if(s.orderProjectName&&!row.orderProjectName.includes(s.orderProjectName))return false;
    if(s.orderCompany&&row.managementUnit!==s.orderCompany)return false;
    if(s.orderBidMonth&&row.bidDate.slice(0,7)!==s.orderBidMonth)return false;
    if(s.orderProjectNo&&!row.orderProjectNo.toLowerCase().includes(s.orderProjectNo.toLowerCase()))return false;
    if(s.ownerUnit&&!row.ownerUnit.includes(s.ownerUnit))return false;
    return true;
  });
}

function getOutputForecastOrderPagedRows(){
  const rows=getOutputForecastOrderSearchRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/outputForecastState.pageSize));
  outputForecastState.page=Math.min(Math.max(1,outputForecastState.page),totalPages);
  const start=(outputForecastState.page-1)*outputForecastState.pageSize;
  return rows.slice(start,start+outputForecastState.pageSize);
}

function syncOutputForecastBranchOptions(){
  const company=document.getElementById("outputForecastCompany")?.value || "";
  const branch=document.getElementById("outputForecastBranch");
  if(!branch)return;
  const values=getOrganizationBranchOptions(company);
  const current=values.includes(branch.value)?branch.value:"";
  replaceProductionDashboardFragment(branch,renderActualOutputOptions(values,current,"全部"));
}

function getOutputForecastSearchRows(){
  const s=outputForecastState;
  return outputForecastConstructionRows.filter(row=>{
    if(s.projectName&&!row.projectName.includes(s.projectName))return false;
    if(s.company&&row.company!==s.company)return false;
    if(s.branch&&row.branch!==s.branch)return false;
    if(s.projectStatus&&row.projectStatus!==s.projectStatus)return false;
    if(s.bidMonth&&row.bidDate.slice(0,7)!==s.bidMonth)return false;
    if(s.projectNo&&!row.projectNo.toLowerCase().includes(s.projectNo.toLowerCase()))return false;
    return true;
  });
}

function getOutputForecastFilteredRows(){
  const rows=getOutputForecastSearchRows();
  if(outputForecastState.statKey==="new")return rows.filter(row=>row.statisticNature==="新接");
  if(outputForecastState.statKey==="transfer")return rows.filter(row=>row.statisticNature==="转接");
  if(outputForecastState.statKey==="finished")return rows.filter(row=>row.statisticNature==="完工未结算");
  return rows;
}

function getOutputForecastPagedRows(){
  const rows=getOutputForecastFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/outputForecastState.pageSize));
  outputForecastState.page=Math.min(Math.max(1,outputForecastState.page),totalPages);
  const start=(outputForecastState.page-1)*outputForecastState.pageSize;
  return rows.slice(start,start+outputForecastState.pageSize);
}

function queryOutputForecastAnalysis(){
  if(outputForecastState.activeTab==="订单项目（未立项）"){
    outputForecastState.orderProjectName=document.getElementById("outputForecastOrderProjectName")?.value.trim() || "";
    outputForecastState.orderCompany=document.getElementById("outputForecastOrderCompany")?.value || "";
    outputForecastState.orderBidMonth=document.getElementById("outputForecastOrderBidMonth")?.value || "";
    outputForecastState.orderProjectNo=document.getElementById("outputForecastOrderProjectNo")?.value.trim() || "";
    outputForecastState.ownerUnit=document.getElementById("outputForecastOwnerUnit")?.value.trim() || "";
  }else{
    outputForecastState.projectName=document.getElementById("outputForecastProjectName")?.value.trim() || "";
    outputForecastState.company=document.getElementById("outputForecastCompany")?.value || "";
    outputForecastState.branch=document.getElementById("outputForecastBranch")?.value || "";
    outputForecastState.projectStatus=document.getElementById("outputForecastProjectStatus")?.value || "";
    outputForecastState.bidMonth=document.getElementById("outputForecastBidMonth")?.value || "";
    outputForecastState.projectNo=document.getElementById("outputForecastProjectNo")?.value.trim() || "";
  }
  outputForecastState.statKey="all";
  outputForecastState.page=1;
  renderOutputForecastAnalysisPage();
}

function resetOutputForecastAnalysis(){
  Object.assign(outputForecastState,{
    projectName:"",
    company:"",
    branch:"",
    projectStatus:"",
    bidMonth:"",
    projectNo:"",
    orderProjectName:"",
    orderCompany:"",
    orderBidMonth:"",
    orderProjectNo:"",
    ownerUnit:"",
    statKey:"all",
    page:1
  });
  renderOutputForecastAnalysisPage();
}

function setOutputForecastStat(key){
  outputForecastState.statKey=outputForecastState.statKey===key&&key!=="all"?"all":key;
  outputForecastState.page=1;
  renderOutputForecastAnalysisPage();
}

function changeOutputForecastPage(delta){
  const rows=outputForecastState.activeTab==="订单项目（未立项）"?getOutputForecastOrderSearchRows():getOutputForecastFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/outputForecastState.pageSize));
  outputForecastState.page=Math.min(Math.max(1,outputForecastState.page+delta),totalPages);
  renderOutputForecastTable();
}

function changeOutputForecastPageSize(value){
  outputForecastState.pageSize=Number(value)||10;
  outputForecastState.page=1;
  renderOutputForecastTable();
}

function setOutputForecastTab(tab){
  outputForecastState.activeTab=tab;
  outputForecastState.page=1;
  renderOutputForecastAnalysisPage();
}

function renderOutputForecastTitleRow(){
  return `
    <div class="compact-title-row output-forecast-title-row">
      <div class="module-title">产值预测分析报表</div>
      <div class="screen-tabs output-forecast-tabs">
        ${outputForecastTabs.map(tab=>`<button class="${outputForecastState.activeTab===tab?"active":""}" onclick="setOutputForecastTab('${tab}')">${tab}</button>`).join("")}
      </div>
    </div>
  `;
}

function renderOutputForecastStatsCard(){
  const rows=getOutputForecastSearchRows();
  const newCount=rows.filter(row=>row.statisticNature==="新接").length;
  const transferCount=rows.filter(row=>row.statisticNature==="转接").length;
  const finishedCount=rows.filter(row=>row.statisticNature==="完工未结算").length;
  const sumValue=key=>rows.reduce((sum,row)=>sum+(Number(row[key])||0),0);
  const item=(key,label,value)=>`
    <div class="construction-project-stat-item ${outputForecastState.statKey===key?"active":""}" onclick="setOutputForecastStat('${key}')">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  const metric=(label,value)=>`
    <div class="construction-project-stat-item metric-only">
      <strong>${formatForecastAmount(value)}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">统计 性质</div>
        <div class="construction-project-stat-items">
          ${item("new","新接",newCount)}
          ${item("transfer","转接",transferCount)}
          ${item("finished","完工未结算",finishedCount)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">产值 合计</div>
        <div class="construction-project-stat-items">
          ${metric("至2025年末累计完成产值(万元)",sumValue("completedTo2025"))}
          ${metric("年度计划产值(万元)",sumValue("annualPlanOutput"))}
          ${metric("年度累计已完成产值(万元)",sumValue("annualCompletedOutput"))}
          ${metric("5月完成产值(万元)",sumValue("mayOutput"))}
          ${metric("剩余合同产值(万元)",sumValue("remainingContractOutput"))}
          ${metric("2026年剩余合同产值预计完成(万元)",sumValue("remaining2026Forecast"))}
          ${metric("2027年剩余合同产值预计完成(万元)",sumValue("forecast2027"))}
          ${metric("开累产值(万元)",sumValue("accumulatedOutput"))}
        </div>
      </div>
    </div>
  `);
}

tableColumnDefinitions.outputForecastConstruction=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(outputForecastState.page-1)*outputForecastState.pageSize+index+1},
  {key:"projectName",title:"项目名称",width:300,align:"left",render:row=>row.projectName},
  {key:"company",title:"子公司",width:140,align:"center",render:row=>row.company},
  {key:"branch",title:"分公司",width:160,align:"center",render:row=>row.branch},
  {key:"projectStatus",title:"项目状态",width:110,align:"center",render:row=>projectStatusTag(row.projectStatus)},
  {key:"approvalDate",title:"立项日期",width:120,align:"center",render:row=>row.approvalDate},
  {key:"totalContractPriceYuan",title:"总包合同价（元）",width:170,align:"right",render:row=>formatForecastYuan(row.totalContractPriceYuan)},
  {key:"bidDate",title:"中标日期",width:120,align:"center",render:row=>row.bidDate},
  {key:"bidPriceEstimateYuan",title:"中标价（预估价）（元）",width:190,align:"right",render:row=>formatForecastYuan(row.bidPriceEstimateYuan)},
  {key:"statisticNature",title:"统计性质",width:120,align:"center",render:row=>tag(row.statisticNature,row.statisticNature==="新接"?"green":row.statisticNature==="转接"?"blue":"orange")},
  {key:"completedTo2025",title:"至2025年末累计完成产值(万元)",width:230,align:"right",render:row=>formatForecastAmount(row.completedTo2025)},
  {key:"annualPlanOutput",title:"年度计划产值(万元)",width:180,align:"right",render:row=>formatForecastAmount(row.annualPlanOutput)},
  {key:"annualCompletedOutput",title:"年度累计已完成产值(万元)",width:210,align:"right",render:row=>formatForecastAmount(row.annualCompletedOutput)},
  {key:"mayOutput",title:"5月完成产值(万元)",width:170,align:"right",render:row=>formatForecastAmount(row.mayOutput)},
  {key:"remainingContractOutput",title:"剩余合同产值(万元)",width:180,align:"right",render:row=>formatForecastAmount(row.remainingContractOutput)},
  {key:"remaining2026Forecast",title:"2026年剩余合同产值预计完成(万元)",width:260,align:"right",render:row=>formatForecastAmount(row.remaining2026Forecast)},
  {key:"forecast2027",title:"2027年剩余合同产值预计完成(万元)",width:260,align:"right",render:row=>formatForecastAmount(row.forecast2027)},
  {key:"accumulatedOutput",title:"开累产值(万元)",width:160,align:"right",render:row=>formatForecastAmount(row.accumulatedOutput)}
];

tableColumnDefinitions.outputForecastOrder=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(outputForecastState.page-1)*outputForecastState.pageSize+index+1},
  {key:"orderProjectName",title:"订单项目名称",width:320,align:"left",render:row=>row.orderProjectName},
  {key:"managementUnit",title:"子公司管理单位",width:180,align:"center",render:row=>row.managementUnit},
  {key:"ownerUnit",title:"建设单位",width:260,align:"left",render:row=>row.ownerUnit},
  {key:"bidDate",title:"中标日期",width:130,align:"center",render:row=>row.bidDate},
  {key:"bidPriceEstimateYuan",title:"中标价（预估价）（元）",width:190,align:"right",render:row=>formatForecastYuan(row.bidPriceEstimateYuan)},
  {key:"annualPlanOutput",title:"年度计划产值(万元)",width:180,align:"right",render:row=>formatForecastAmount(row.annualPlanOutput)},
  {key:"remainingContractOutput",title:"剩余合同产值(万元)",width:180,align:"right",render:row=>formatForecastAmount(row.remainingContractOutput)},
  {key:"remaining2026Forecast",title:"2026年剩余合同产值预计完成(万元)",width:260,align:"right",render:row=>formatForecastAmount(row.remaining2026Forecast)},
  {key:"forecast2027",title:"2027年剩余合同产值预计完成(万元)",width:260,align:"right",render:row=>formatForecastAmount(row.forecast2027)}
];

function renderOutputForecastTable(){
  const isOrder=outputForecastState.activeTab==="订单项目（未立项）";
  const tableKey=isOrder?"outputForecastOrder":"outputForecastConstruction";
  const tbodyId=isOrder?"outputForecastOrderTbody":"outputForecastTbody";
  const rows=isOrder?getOutputForecastOrderSearchRows():getOutputForecastFilteredRows();
  renderTableByColumns(tableKey,isOrder?getOutputForecastOrderPagedRows():getOutputForecastPagedRows(),tbodyId);
  const total=rows.length;
  const totalPages=Math.max(1,Math.ceil(total/outputForecastState.pageSize));
  const totalText=document.getElementById(isOrder?"outputForecastOrderTotalText":"outputForecastTotalText");
  const pageText=document.getElementById("outputForecastPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)replaceProductionDashboardFragment(pageText,`
    <button class="btn mini" onclick="changeOutputForecastPage(-1)" ${outputForecastState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${outputForecastState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeOutputForecastPage(1)" ${outputForecastState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeOutputForecastPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===outputForecastState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `);
}

function renderOutputForecastConstructionPage(){
  const companyOptions=getOrganizationCompanies();
  const branchOptions=getOrganizationBranchOptions(outputForecastState.company);
  const projectStatusOptions=getOutputForecastProjectStatusOptions();
  const rows=getOutputForecastFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/outputForecastState.pageSize));
  return `
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>项目名称</label><input class="input" id="outputForecastProjectName" value="${escapeAttr(outputForecastState.projectName)}" placeholder="请输入项目名称"/></div>
      <div class="form-item"><label>子公司</label><select class="select" id="outputForecastCompany" onchange="syncOutputForecastBranchOptions()">${renderActualOutputOptions(companyOptions,outputForecastState.company,"全部")}</select></div>
      <div class="form-item"><label>分公司</label><select class="select" id="outputForecastBranch">${renderActualOutputOptions(branchOptions,outputForecastState.branch,"全部")}</select></div>
      <div class="form-item"><label>项目状态</label><select class="select" id="outputForecastProjectStatus">${renderActualOutputOptions(projectStatusOptions,outputForecastState.projectStatus,"全部")}</select></div>
      <div class="form-item"><label>中标月份</label><input class="input" id="outputForecastBidMonth" type="month" value="${outputForecastState.bidMonth}"/></div>
      <div class="form-item"><label>项目编号</label><input class="input" id="outputForecastProjectNo" value="${escapeAttr(outputForecastState.projectNo)}" placeholder="请输入项目编号"/></div>
    `,{title:"查询条件",queryFn:"queryOutputForecastAnalysis()",resetFn:"resetOutputForecastAnalysis()",gridClass:"search-grid",canCollapse:false})}
    ${renderOutputForecastStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"outputForecastConstruction",
      tbodyId:"outputForecastTbody",
      totalId:"outputForecastTotalText",
      renderFnName:"renderOutputForecastAnalysisPage",
      refreshAction:"renderOutputForecastAnalysisPage()",
      exportAction:"showToast('产值分析明细导出成功')",
      title:"产值分析明细",
      total:rows.length,
      pageText:`<span id="outputForecastPageText">第 1 / ${totalPages} 页　每页 ${outputForecastState.pageSize} 条</span>`,
      className:"construction-project-table-card output-forecast-table-card"
    })}
  `;
}

function renderOutputForecastOrderPage(){
  const companyOptions=getOrganizationCompanies();
  const rows=getOutputForecastOrderSearchRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/outputForecastState.pageSize));
  return `
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>订单项目名称</label><input class="input" id="outputForecastOrderProjectName" value="${escapeAttr(outputForecastState.orderProjectName)}" placeholder="请输入订单项目名称"/></div>
      <div class="form-item"><label>子公司管理单位</label><select class="select" id="outputForecastOrderCompany">${renderActualOutputOptions(companyOptions,outputForecastState.orderCompany,"全部")}</select></div>
      <div class="form-item"><label>中标月份</label><input class="input" id="outputForecastOrderBidMonth" type="month" value="${outputForecastState.orderBidMonth}"/></div>
      <div class="form-item"><label>订单项目编号</label><input class="input" id="outputForecastOrderProjectNo" value="${escapeAttr(outputForecastState.orderProjectNo)}" placeholder="请输入订单项目编号"/></div>
      <div class="form-item"><label>建设单位</label><input class="input" id="outputForecastOwnerUnit" value="${escapeAttr(outputForecastState.ownerUnit)}" placeholder="请输入建设单位"/></div>
    `,{title:"查询条件",queryFn:"queryOutputForecastAnalysis()",resetFn:"resetOutputForecastAnalysis()",gridClass:"search-grid",canCollapse:false})}
    ${renderUnifiedTableCard({
      tableKey:"outputForecastOrder",
      tbodyId:"outputForecastOrderTbody",
      totalId:"outputForecastOrderTotalText",
      renderFnName:"renderOutputForecastAnalysisPage",
      refreshAction:"renderOutputForecastAnalysisPage()",
      exportAction:"showToast('订单项目产值分析明细导出成功')",
      title:"产值分析明细",
      total:rows.length,
      pageText:`<span id="outputForecastPageText">第 1 / ${totalPages} 页　每页 ${outputForecastState.pageSize} 条</span>`,
      className:"construction-project-table-card output-forecast-table-card"
    })}
  `;
}

async function renderOutputForecastAnalysisPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const mounted=await mountOutputManagementTemplate("forecast");
  if(!mounted)return;
  replaceProductionDashboardFragment(outputSlot("title"),renderOutputForecastTitleRow());
  replaceProductionDashboardFragment(outputSlot("body"),outputForecastState.activeTab==="施工项目（已立项）"?renderOutputForecastConstructionPage():renderOutputForecastOrderPage());
  renderOutputForecastTable();
}

const actualOutputReportState={
  company:"",
  branch:"",
  projectName:"",
  projectStatus:"",
  projectManager:"",
  outputMonth:getCurrentReportMonth(),
  reportStatus:"",
  statKey:"all",
  page:1,
  pageSize:10
};

const actualOutputManagerPhoneMap={
  "赵菁":"15712349999",
  "李峻":"15723459999",
  "张三":"15734569999",
  "王晨":"15745679999",
  "陈启航":"15756789999"
};
const actualOutputManagerPhoneRevealMap={};

const actualOutputReportRows=[
  ["上海隧道","轨交分公司","上海示范区线工程 SFQSG-15 标","在建","赵菁","已上报",12865.000012,12136.792464,"周敏","2026-07-03"],
  ["上海隧道","河南分公司","郑州航空港片区综合管廊工程","在建","李峻","上报审批中",7356.000046,6939.622685,"刘洋","2026-07-04"],
  ["上海隧道","市政分公司","临港新片区地下通道工程","在建","张三","未上报",0,0,"",""],
  ["上海路桥","总承包一部","杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段","在建","王晨","已上报",9632.000099,9086.792546,"沈越","2026-07-02"],
  ["上海路桥","总承包二部","嘉闵线北延伸道路配套工程","停工","陈启航","未上报",0,0,"",""],
  ["市政集团","上海分公司","新马工业园节能环保产业园项目","在建","赵菁","上报审批中",4567.800012,4309.245294,"周敏","2026-07-05"],
  ["市政集团","福建分公司","深圳前海综合交通枢纽配套工程","在建","李峻","已上报",11890.500065,11217.452892,"刘洋","2026-07-01"],
  ["城市环境","上海城建水务工程有限公司","苏州河深隧调蓄池工程","在建","张三","已上报",5234.000089,4937.735933,"唐宁","2026-07-03"],
  ["城市环境","浦东供排水分公司","浦东新区雨污分流提升工程","停工","王晨","未上报",0,0,"",""],
  ["城建设计","长三院","张江科学城创新中心项目","在建","陈启航","已上报",15078.000000,14224.528302,"沈越","2026-07-04"],
  ["城建设计","南京分公司","松江枢纽综合开发项目","在建","赵菁","上报审批中",8845.000033,8344.339654,"周敏","2026-07-05"],
  ["上海隧道","轨交分公司","上海市轨道交通23号线一期土建工程","在建","李峻","已上报",10123.000078,9550.000073,"刘洋","2026-07-02"],
  ["上海路桥","总承包一部","G318沪青平公路快速化改建工程","停工","张三","未上报",0,0,"",""],
  ["市政集团","江苏分公司","南京江北新区综合管廊二期工程","在建","王晨","已上报",6755.500025,6373.113231,"唐宁","2026-07-06"]
].map((item,index)=>({
  id:index+1,
  company:item[0],
  branch:item[1],
  projectName:item[2],
  projectStatus:item[3],
  projectManager:item[4],
  managerPhone:actualOutputManagerPhoneMap[item[4]] || "15700009999",
  outputMonth:getCurrentReportMonth(),
  reportStatus:item[5],
  monthlyOutputTaxIncluded:item[6],
  monthlyRevenueTaxExcluded:item[7],
  reporter:item[8],
  reportDate:item[9]
}));

tableColumnDefinitions.actualOutputReport=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(actualOutputReportState.page-1)*actualOutputReportState.pageSize+index+1},
  {key:"projectName",title:"项目名称",width:280,align:"left",render:row=>row.projectName},
  {key:"projectStatus",title:"项目状态",width:110,align:"center",render:row=>tag(row.projectStatus,row.projectStatus==="在建"?"green":"red")},
  {key:"company",title:"子公司",width:140,align:"center",render:row=>row.company},
  {key:"branch",title:"分公司",width:150,align:"center",render:row=>row.branch},
  {key:"projectManager",title:"项目经理",width:190,align:"center",render:row=>renderActualOutputManager(row)},
  {key:"outputMonth",title:"产值月份",width:120,align:"center",render:row=>row.outputMonth},
  {key:"reportStatus",title:"上报情况",width:120,align:"center",render:row=>renderActualOutputStatusTag(row.reportStatus)},
  {key:"monthlyOutputTaxIncluded",title:"本月完成产值（含税）（万元）",width:220,align:"right",render:row=>row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.monthlyOutputTaxIncluded)},
  {key:"monthlyRevenueTaxExcluded",title:"本月完成营收（不含税）（万元）",width:230,align:"right",render:row=>row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.monthlyRevenueTaxExcluded)},
  {key:"reporter",title:"上报人",width:100,align:"center",render:row=>row.reporter||"-"},
  {key:"reportDate",title:"上报日期",width:130,align:"center",render:row=>row.reportDate||"-"},
  {key:"operation",title:"操作",width:90,align:"center",render:row=>`<a class="link" onclick="openActualOutputReportDetail(${row.id})">查看</a>`}
];

function formatActualOutputAmount(value){
  return Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:6,maximumFractionDigits:6});
}

function renderActualOutputManager(row){
  const revealUntil=actualOutputManagerPhoneRevealMap[row.id] || 0;
  const phone=Date.now()<revealUntil?row.managerPhone:maskPhone(row.managerPhone);
  return `${row.projectManager} | ${phone} <button class="link" title="查看完整手机号" onclick="revealActualOutputManagerPhone(${row.id})">👁️</button>`;
}

function revealActualOutputManagerPhone(id){
  actualOutputManagerPhoneRevealMap[id]=Date.now()+3000;
  renderActualOutputReportTable();
  setTimeout(()=>renderActualOutputReportTable(),3000);
}

function renderActualOutputStatusTag(status){
  const color=status==="已上报"?"green":status==="上报审批中"?"blue":"orange";
  return tag(status,color);
}

function actualOutputUnique(key,rows=actualOutputReportRows){
  return [...new Set(rows.map(row=>row[key]).filter(Boolean))];
}

function renderActualOutputOptions(values,current,placeholder="全部"){
  return `<option value="">${placeholder}</option>${values.map(value=>`<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function getActualOutputSearchRows(){
  const s=actualOutputReportState;
  return actualOutputReportRows.filter(row=>{
    if(s.company&&row.company!==s.company)return false;
    if(s.branch&&row.branch!==s.branch)return false;
    if(s.projectName&&!row.projectName.includes(s.projectName))return false;
    if(s.projectStatus&&row.projectStatus!==s.projectStatus)return false;
    if(s.projectManager&&!row.projectManager.includes(s.projectManager))return false;
    if(s.outputMonth&&row.outputMonth!==s.outputMonth)return false;
    if(s.reportStatus&&row.reportStatus!==s.reportStatus)return false;
    return true;
  });
}

function getActualOutputFilteredRows(){
  const rows=getActualOutputSearchRows();
  if(actualOutputReportState.statKey==="reported")return rows.filter(row=>row.reportStatus==="已上报");
  if(actualOutputReportState.statKey==="approving")return rows.filter(row=>row.reportStatus==="上报审批中");
  if(actualOutputReportState.statKey==="unreported")return rows.filter(row=>row.reportStatus==="未上报");
  return rows;
}

function getActualOutputPagedRows(){
  const rows=getActualOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/actualOutputReportState.pageSize));
  actualOutputReportState.page=Math.min(Math.max(1,actualOutputReportState.page),totalPages);
  const start=(actualOutputReportState.page-1)*actualOutputReportState.pageSize;
  return rows.slice(start,start+actualOutputReportState.pageSize);
}

function queryActualOutputReport(){
  actualOutputReportState.company=document.getElementById("actualOutputCompany")?.value || "";
  actualOutputReportState.branch=document.getElementById("actualOutputBranch")?.value || "";
  actualOutputReportState.projectName=document.getElementById("actualOutputProjectName")?.value.trim() || "";
  actualOutputReportState.projectStatus=document.getElementById("actualOutputProjectStatus")?.value || "";
  actualOutputReportState.projectManager=document.getElementById("actualOutputProjectManager")?.value.trim() || "";
  actualOutputReportState.outputMonth=document.getElementById("actualOutputMonth")?.value || "";
  actualOutputReportState.reportStatus=document.getElementById("actualOutputReportStatus")?.value || "";
  actualOutputReportState.statKey="all";
  actualOutputReportState.page=1;
  renderActualOutputReportPage();
}

function resetActualOutputReport(){
  Object.assign(actualOutputReportState,{
    company:"",
    branch:"",
    projectName:"",
    projectStatus:"",
    projectManager:"",
    outputMonth:getCurrentReportMonth(),
    reportStatus:"",
    statKey:"all",
    page:1
  });
  renderActualOutputReportPage();
}

function setActualOutputReportStat(key){
  actualOutputReportState.statKey=actualOutputReportState.statKey===key&&key!=="all"?"all":key;
  actualOutputReportState.page=1;
  renderActualOutputReportPage();
}

function changeActualOutputReportPage(dir){
  const total=getActualOutputFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/actualOutputReportState.pageSize));
  actualOutputReportState.page=Math.min(max,Math.max(1,actualOutputReportState.page+dir));
  renderActualOutputReportTable();
}

function changeActualOutputReportPageSize(value){
  actualOutputReportState.pageSize=Number(value)||10;
  actualOutputReportState.page=1;
  renderActualOutputReportTable();
}

function syncActualOutputBranchOptions(){
  const company=document.getElementById("actualOutputCompany")?.value || "";
  const branch=document.getElementById("actualOutputBranch");
  if(!branch)return;
  const values=getOrganizationBranchOptions(company);
  const current=values.includes(branch.value)?branch.value:"";
  replaceProductionDashboardFragment(branch,renderActualOutputOptions(values,current,"全部"));
}

function renderActualOutputStatsCard(){
  const rows=getActualOutputSearchRows();
  const required=rows.length;
  const reported=rows.filter(row=>row.reportStatus==="已上报").length;
  const approving=rows.filter(row=>row.reportStatus==="上报审批中").length;
  const unreported=rows.filter(row=>row.reportStatus==="未上报").length;
  const completion=required?Math.round(reported*100/required):0;
  const item=(key,label,value,metric=false)=>`
    <div class="construction-project-stat-item ${actualOutputReportState.statKey===key?"active":""} ${metric?"metric-only":""}" onclick="${metric?"showToast('上报完成率=已上报/应上报总数')":`setActualOutputReportStat('${key}')`}">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">上报情况</div>
        <div class="construction-project-stat-items">
          ${item("all","应上报",required)}
          ${item("reported","已上报",reported)}
          ${item("approving","上报审批中",approving)}
          ${item("unreported","应报未报",unreported)}
          ${item("completion","上报完成率",`${completion}%`,true)}
        </div>
      </div>
    </div>
  `);
}

function renderActualOutputReportTable(){
  renderTableByColumns("actualOutputReport",getActualOutputPagedRows(),"actualOutputReportTbody");
  const total=getActualOutputFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/actualOutputReportState.pageSize));
  const totalText=document.getElementById("actualOutputReportTotalText");
  const pageText=document.getElementById("actualOutputReportPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)replaceProductionDashboardFragment(pageText,`
    <button class="btn mini" onclick="changeActualOutputReportPage(-1)" ${actualOutputReportState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${actualOutputReportState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeActualOutputReportPage(1)" ${actualOutputReportState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeActualOutputReportPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===actualOutputReportState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `);
}

function getActualOutputDetailMeta(row){
  const config=[
    ["轨交","股份重点关注","施工总承包","股份重大工程项目",true,true,"新接",114306.00],
    ["市政","省级重点","PPP","子公司重大项目",false,true,"结转",86280.50],
    ["基建","区级重点","EPC","子公司重大项目",false,true,"结转",73566.20],
    ["公路","股份重点关注","PPP","股份重大工程项目",true,true,"新接",128945.00],
    ["市政","一般项目","施工总承包","子公司一般项目",false,false,"结转",42518.40],
    ["产业园","重点客户","EPC","子公司重大项目",false,true,"新接",68892.30],
    ["综合交通","股份重点关注","施工总承包","股份重大工程项目",true,true,"新接",136775.60],
    ["水务","民生工程","BOT","子公司重大项目",false,true,"结转",58960.00],
    ["水务","一般项目","专业分包","子公司一般项目",false,false,"结转",31880.00],
    ["房建","重点客户","施工总承包","子公司重大项目",false,true,"新接",165420.80],
    ["综合开发","股份重点关注","EPC","股份重大工程项目",true,true,"结转",108906.20],
    ["轨交","上海市重大项目","施工总承包","股份重大工程项目",true,true,"新接",120540.10],
    ["公路","一般项目","专业分包","子公司一般项目",false,false,"结转",39720.00],
    ["市政","重点客户","PPP","子公司重大项目",false,true,"结转",75840.90]
  ][(row.id-1)%14];
  const contractAmount=config[7];
  const predictedOutput=contractAmount;
  const predictedRevenue=contractAmount/1.09;
  const reported=row.reportStatus!=="未上报";
  const monthlyOutput=reported?row.monthlyOutputTaxIncluded:0;
  const monthlyRevenue=reported?row.monthlyRevenueTaxExcluded:0;
  const yearOutput=reported?monthlyOutput*(row.id%3+1.8):0;
  const yearRevenue=reported?monthlyRevenue*(row.id%3+1.8):0;
  const cumulativeOutput=reported?yearOutput*(row.id%4+3.2):0;
  const cumulativeRevenue=reported?yearRevenue*(row.id%4+3.2):0;
  const annualTarget=contractAmount*0.42;
  const completionRate=annualTarget?Math.min(99.8,yearOutput/annualTarget*100):0;

  return {
    projectType:config[0],
    attentionTag:config[1],
    implementMode:config[2],
    controlLevel:config[3],
    isShareKey:config[4],
    isSafetyManaged:config[5],
    isShanghaiMajor:config[1]==="上海市重大项目" || row.id===1,
    outputCategory:config[6],
    constructionNo:`SG-${String(row.id).padStart(4,"0")}`,
    contractAmount,
    vatRate:"9%",
    predictedOutput,
    predictedRevenue,
    isSettlement:row.reportStatus==="已上报" && row.id%2===0?"是":"否",
    yearOutput,
    yearRevenue,
    cumulativeOutput,
    cumulativeRevenue,
    annualForecast:reported?Math.max(yearOutput*1.45,monthlyOutput*6.2):0,
    annualCompletionRate:reported?completionRate:0,
    attachments:reported?[
      `${row.projectName}产值确认单.pdf`,
      `${row.projectName}监理签认进度表.xlsx`
    ]:[],
    approvalStatus:row.reportStatus==="已上报"?"审批通过":row.reportStatus==="上报审批中"?"审批中":"未发起"
  };
}

function renderActualOutputDetailTag(text,type){
  return `<span class="actual-output-soft-tag ${type||""}">${text}</span>`;
}

function renderActualOutputDetailField(label,value,suffix){
  return `
    <div class="actual-output-detail-field">
      <span>${label}</span>
      <strong>${value??"-"}${suffix?`<em>${suffix}</em>`:""}</strong>
    </div>
  `;
}

function renderActualOutputReadonly(label,value,suffix){
  return `
    <div class="actual-output-readonly">
      <label>${label}</label>
      <div><span>${value??"-"}</span>${suffix?`<em>${suffix}</em>`:""}</div>
    </div>
  `;
}

function getActualOutputApprovalRecords(row){
  if(row.reportStatus==="未上报"){
    return [
      {node:"项目部发起",status:"wait",time:"-",person:row.projectManager,org:row.branch,action:"待提交",opinion:"-",receiver:"分公司工程部副经理"},
      {node:"分公司工程部副经理",status:"wait",time:"-",person:"王峰",org:row.branch,action:"待审批",opinion:"-",receiver:"子公司生产管理部"}
    ];
  }
  if(row.reportStatus==="上报审批中"){
    return [
      {node:"发起审批",status:"done",time:`${row.reportDate} 09:18:24`,person:row.reporter||row.projectManager,org:row.branch,action:"提交审批",opinion:"提交本月实际产值上报",receiver:"分公司工程部副经理"},
      {node:"分公司工程部副经理",status:"processing",time:"待处理",person:"王峰",org:row.branch,action:"审批中",opinion:"待审批",receiver:"子公司生产管理部"},
      {node:"子公司生产管理部",status:"wait",time:"-",person:"刘佳",org:row.company,action:"待审批",opinion:"-",receiver:"集团生产管理部"}
    ];
  }
  return [
    {node:"发起审批",status:"done",time:`${row.reportDate} 09:16:35`,person:row.reporter||row.projectManager,org:row.branch,action:"提交审批",opinion:"提交本月实际产值上报",receiver:"分公司工程部副经理"},
    {node:"分公司工程部副经理",status:"done",time:`${row.reportDate} 14:28:10`,person:"王峰",org:row.branch,action:"已通过",opinion:"同意本次产值上报",receiver:"子公司生产管理部"},
    {node:"子公司生产管理部",status:"done",time:`${row.reportDate} 17:42:53`,person:"秦群群",org:row.company,action:"已通过",opinion:"资料完整，审批通过",receiver:"集团生产管理部"}
  ];
}

function renderActualOutputApprovalPanel(row,meta){
  const records=getActualOutputApprovalRecords(row);
  const statusClass=meta.approvalStatus==="审批通过"?"done":meta.approvalStatus==="审批中"?"processing":"draft";
  return `
    <aside class="actual-output-approval">
      <div class="actual-output-section-title">审批记录</div>
      <div class="actual-output-approval-status">
        <span>整体审批状态</span>
        <b class="${statusClass}">${meta.approvalStatus}</b>
      </div>
      <div class="actual-output-approval-body">
        ${records.map((record,index)=>`
          <div class="actual-output-approval-step ${record.status}">
            <div class="actual-output-approval-dot">${record.status==="done"?"✓":index+1}</div>
            <div class="actual-output-approval-content">
              <div class="actual-output-approval-node">
                <strong>${record.node}</strong>
                <span>${record.time}</span>
              </div>
              <div class="actual-output-approval-card">
                <b>${record.person}</b>
                <p>${record.org}</p>
                <p>操作：<em>${record.action}</em></p>
                <p>意见：${record.opinion}</p>
                <p>接收人：${record.receiver}</p>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function previewActualOutputAttachment(id,index){
  const row=actualOutputReportRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到附件");
  const meta=getActualOutputDetailMeta(row);
  const file=meta.attachments[Number(index)];
  if(!file)return showToast("未找到附件");
  openNestedModal("附件预览",`
    <div class="actual-output-attachment-preview">
      <div class="actual-output-preview-page">
        <div class="actual-output-preview-title">${file}</div>
        <div class="actual-output-preview-line"></div>
        <p>项目名称：${row.projectName}</p>
        <p>上报月份：${row.outputMonth}</p>
        <p>本月完成产值（含税）：${row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.monthlyOutputTaxIncluded)} 万元</p>
        <p>本月完成营收（不含税）：${row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.monthlyRevenueTaxExcluded)} 万元</p>
        <div class="actual-output-preview-stamp">预览</div>
      </div>
    </div>
  `);
}

function openActualOutputReportDetail(id){
  const row=actualOutputReportRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到产值上报明细");
  const meta=getActualOutputDetailMeta(row);
  const reported=row.reportStatus!=="未上报";
  const html=`
    <div class="actual-output-detail">
      <div class="actual-output-detail-main">
        <section class="actual-output-project-card">
          <h2>${row.projectName}</h2>
          <div class="actual-output-tags">
            ${renderActualOutputDetailTag(row.projectStatus,row.projectStatus==="在建"?"green":"red")}
            ${renderActualOutputDetailTag(meta.projectType,"blue")}
            ${meta.isShareKey?renderActualOutputDetailTag("股份重点关注","red"):""}
            ${renderActualOutputDetailTag(meta.controlLevel,"orange")}
            ${renderActualOutputDetailTag(meta.implementMode,"green")}
            ${meta.isShanghaiMajor?renderActualOutputDetailTag("上海市重大项目","green"):""}
            ${renderActualOutputDetailTag("重点客户","pink")}
            ${meta.isSafetyManaged?renderActualOutputDetailTag("安全纳管","blue"):renderActualOutputDetailTag("未纳管","gray")}
          </div>
          <div class="actual-output-basic-grid">
            ${renderActualOutputDetailField("施工编号",meta.constructionNo)}
            ${renderActualOutputDetailField("子公司",row.company)}
            ${renderActualOutputDetailField("分公司",row.branch)}
            ${renderActualOutputDetailField("产值统计类别",meta.outputCategory)}
          </div>
          <div class="actual-output-contract-strip">
            ${renderActualOutputDetailField("合同签约额",formatActualOutputAmount(meta.contractAmount),"万元")}
            ${renderActualOutputDetailField("增值税税率",meta.vatRate)}
            ${renderActualOutputDetailField("合同预测可转化产值",formatActualOutputAmount(meta.predictedOutput),"万元")}
            ${renderActualOutputDetailField("合同预测可转化营收",formatActualOutputAmount(meta.predictedRevenue),"万元")}
          </div>
        </section>

        <section class="actual-output-report-card">
          <div class="actual-output-section-title">上报信息</div>
          <div class="actual-output-form-grid two">
            ${renderActualOutputReadonly("上报月份",row.outputMonth)}
            <div class="actual-output-readonly">
              <label>是否结算</label>
              <div class="actual-output-radio">
                <span class="${meta.isSettlement==="是"?"active":""}">是</span>
                <span class="${meta.isSettlement==="否"?"active":""}">否</span>
              </div>
            </div>
          </div>
          <div class="actual-output-form-grid four">
            ${renderActualOutputReadonly("本月完成产值（含税）",reported?formatActualOutputAmount(row.monthlyOutputTaxIncluded):"-","万元")}
            ${renderActualOutputReadonly("本月完成营收（不含税）",reported?formatActualOutputAmount(row.monthlyRevenueTaxExcluded):"-","万元")}
            ${renderActualOutputReadonly("年累产值（含税）",reported?formatActualOutputAmount(meta.yearOutput):"-","万元")}
            ${renderActualOutputReadonly("年累营收（不含税）",reported?formatActualOutputAmount(meta.yearRevenue):"-","万元")}
            ${renderActualOutputReadonly("开累产值（含税）",reported?formatActualOutputAmount(meta.cumulativeOutput):"-","万元")}
            ${renderActualOutputReadonly("开累营收（不含税）",reported?formatActualOutputAmount(meta.cumulativeRevenue):"-","万元")}
            ${renderActualOutputReadonly("项目预测全年产值（含税）",reported?formatActualOutputAmount(meta.annualForecast):"-","万元")}
            ${renderActualOutputReadonly("年度产值总目标（含税）完成率",reported?meta.annualCompletionRate.toFixed(2):"-","%")}
          </div>
          <div class="actual-output-attachment-block">
            <label>相关附件</label>
            <p>请上传本次产值上报的相关支撑文件（如客户/监理确认的进度确认单）</p>
            <div class="actual-output-attachment-list">
              ${meta.attachments.length?meta.attachments.map((file,index)=>`
                <button type="button" onclick="previewActualOutputAttachment(${row.id},${index})">
                  <span>📄</span>${file}
                </button>
              `).join(""):`<span class="actual-output-empty-attachment">暂无附件</span>`}
            </div>
          </div>
        </section>
      </div>
      ${renderActualOutputApprovalPanel(row,meta)}
    </div>
  `;
  openModal("实际产值上报详情",html,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("actual-output-detail-modal");
}

async function renderActualOutputReportPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const companyOptions=getOrganizationCompanies();
  const branchOptions=getOrganizationBranchOptions(actualOutputReportState.company);
  const rows=getActualOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/actualOutputReportState.pageSize));
  const mounted=await mountOutputManagementTemplate("actual");
  if(!mounted)return;
  replaceProductionDashboardFragment(outputSlot("query"),renderUnifiedQueryCard(`
      <div class="form-item"><label>上报月份</label><input class="input" id="actualOutputMonth" type="month" value="${actualOutputReportState.outputMonth}"/></div>
      <div class="form-item"><label>上报情况</label><select class="select" id="actualOutputReportStatus">${renderActualOutputOptions(["未上报","上报审批中","已上报"],actualOutputReportState.reportStatus,"全部")}</select></div>
      <div class="form-item"><label>子公司</label><select class="select" id="actualOutputCompany" onchange="syncActualOutputBranchOptions()">${renderActualOutputOptions(companyOptions,actualOutputReportState.company,"全部")}</select></div>
      <div class="form-item"><label>分公司</label><select class="select" id="actualOutputBranch">${renderActualOutputOptions(branchOptions,actualOutputReportState.branch,"全部")}</select></div>
      <div class="form-item"><label>项目名称</label><input class="input" id="actualOutputProjectName" value="${escapeAttr(actualOutputReportState.projectName)}" placeholder="请输入项目名称"/></div>
      <div class="form-item"><label>项目状态</label><select class="select" id="actualOutputProjectStatus">${renderActualOutputOptions(["在建","停工"],actualOutputReportState.projectStatus,"全部")}</select></div>
      <div class="form-item"><label>项目经理</label><input class="input" id="actualOutputProjectManager" value="${escapeAttr(actualOutputReportState.projectManager)}" placeholder="请输入项目经理"/></div>
    `,{title:"查询条件",queryFn:"queryActualOutputReport()",resetFn:"resetActualOutputReport()",gridClass:"search-grid",canCollapse:false}));
  replaceProductionDashboardFragment(outputSlot("stats"),renderActualOutputStatsCard());
  replaceProductionDashboardFragment(outputSlot("table"),renderUnifiedTableCard({
      tableKey:"actualOutputReport",
      tbodyId:"actualOutputReportTbody",
      renderFnName:"renderActualOutputReportTable",
      refreshAction:"renderActualOutputReportPage()",
      exportAction:"showToast('实际产值上报明细导出成功')",
      title:"产值上报明细",
      total:rows.length,
      pageText:`<span id="actualOutputReportPageText">第 1 / ${totalPages} 页　每页 ${actualOutputReportState.pageSize} 条</span>`
    }));
  renderActualOutputReportTable();
}

function getPreviousReportMonth(){
  const now=new Date();
  const date=new Date(now.getFullYear(),now.getMonth()-1,1);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
}

const otherBizOutputState={
  outputMonth:getPreviousReportMonth(),
  company:"",
  branch:"",
  reportStatus:"",
  statKey:"all",
  page:1,
  pageSize:10
};

const otherBizOutputBizColumns=[
  {key:"total",label:"合计",width:120},
  {key:"product",label:"产品销售",width:120},
  {key:"design",label:"设计",width:110},
  {key:"digital",label:"数字",width:110},
  {key:"cityOperation",label:"城市运营",width:120},
  {key:"propertyManage",label:"房产【物业管理】",width:150},
  {key:"businessOperation",label:"房产【商业运营】",width:150},
  {key:"propertyDevelop",label:"房产【房产开发】",width:150},
  {key:"equityInvestment",label:"投资【股权项目】",width:150},
  {key:"infrastructureInvestment",label:"投资【基建项目】",width:150},
  {key:"leaseFactoring",label:"投资【租赁及保理】",width:160}
];

const otherBizOutputInputColumns=otherBizOutputBizColumns.filter(col=>col.key!=="total");
const otherBizOutputIndustryGroups=[
  {key:"product",label:"产品销售",columns:["product"]},
  {key:"design",label:"设计",columns:["design"]},
  {key:"digital",label:"数字",columns:["digital"]},
  {key:"cityOperation",label:"城市运营",columns:["cityOperation"]},
  {key:"property",label:"房产",columns:["propertyManage","businessOperation","propertyDevelop"]},
  {key:"investment",label:"投资",columns:["equityInvestment","infrastructureInvestment","leaseFactoring"]}
];
const otherBizOutputColumnIndustryMap=Object.fromEntries(
  otherBizOutputIndustryGroups.flatMap(group=>group.columns.map(key=>[key,group.key]))
);
const otherBizOutputReportMetricFields=[
  {key:"annualPlan",label:"年度计划产值"},
  {key:"monthlyActual",label:"本月度实际完成产值"},
  {key:"remainingContract",label:"剩余合同产值"}
];

tableColumnDefinitions.otherBizOutputReport=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(otherBizOutputState.page-1)*otherBizOutputState.pageSize+index+1},
  {key:"company",title:"子公司",width:140,align:"center",render:row=>row.company},
  {key:"branch",title:"分公司",width:160,align:"center",render:row=>row.branch},
  {key:"outputMonth",title:"产值月份",width:120,align:"center",render:row=>row.outputMonth},
  {key:"reportStatus",title:"填报情况",width:140,align:"center",render:row=>renderActualOutputStatusTag(row.reportStatus)},
  ...otherBizOutputBizColumns.map(col=>({
    key:col.key,
    title:col.label,
    group:"本月完成产值（含税）（万元）",
    width:col.width,
    align:"right",
    render:row=>renderOtherBizOutputAmount(row,col.key)
  })),
  {key:"reporter",title:"上报人",width:110,align:"center",render:row=>row.reporter||"-"},
  {key:"reportDate",title:"上报日期",width:130,align:"center",render:row=>row.reportDate||"-"},
  {key:"operation",title:"操作",width:90,align:"center",render:row=>`<a class="link" onclick="openOtherBizOutputDetail(${row.id})">查看</a>`}
];

const otherBizOutputSeedRows=[
  ["上海隧道","轨交分公司","已上报","张三","2026-06-21",[580.126531,160.335201,42.119830,68.660352,39.228000,62.785100,55.317300,71.320600,34.991800,20.668100,24.700248]],
  ["上海隧道","河南分公司","上报审批中","李四","2026-06-18",[438.673920,88.220100,30.671200,72.388000,43.772100,45.231600,37.110800,55.789300,24.663200,19.506900,21.320720]],
  ["市政集团","上海分公司","已上报","王敏","2026-06-19",[692.553618,172.223100,58.663900,80.115800,64.551200,73.008000,69.443200,91.662100,34.771500,22.779000,25.335818]],
  ["市政集团","江苏分公司","未上报","","",null],
  ["市政集团","福建分公司","已上报","赵一鸣","2026-06-20",[501.227315,104.880000,44.105600,70.228300,48.332100,51.778900,42.903100,68.117200,25.667100,18.880500,26.334515]],
  ["上海路桥","总承包一部","未上报","","",null],
  ["上海路桥","总承包二部","上报审批中","周宁","2026-06-17",[326.993208,75.223400,28.440600,52.118900,21.889000,35.662300,31.554800,42.990100,15.770900,9.880700,13.462508]],
  ["城市环境","上海城建水务工程有限公司","已上报","陈杰","2026-06-22",[418.662508,82.220000,36.771400,44.118800,88.552300,39.113200,35.779100,46.001900,19.225600,12.880500,14.000708]],
  ["城市环境","浦东供排水分公司","未上报","","",null],
  ["城建国际","国际工程分公司","已上报","钱进","2026-06-23",[289.660100,46.118800,23.006700,37.889000,18.552100,28.663300,27.110500,36.001800,30.226600,24.558300,17.532000]],
  ["城建设计","长三院","已上报","沈越","2026-06-21",[377.113906,62.778900,96.220100,41.338800,26.770000,31.552300,29.881100,43.006200,18.770600,11.552100,15.243806]],
  ["上海能建","电力工程分公司","上报审批中","黄晨","2026-06-24",[236.880122,38.331000,21.110800,52.771000,14.330200,18.773400,17.552100,28.110800,16.992000,13.772600,14.136222]],
  ["城建物资","材料供应分公司","已上报","孙倩","2026-06-25",[322.771612,126.443000,12.663200,34.880100,9.552100,21.771200,18.663300,26.118600,28.552700,21.110900,22.923512]],
  ["运营集团","运营管理分公司","未上报","","",null]
];

const otherBizOutputRows=otherBizOutputSeedRows.map((item,index)=>{
  const values=item[5];
  const row={
    id:index+1,
    company:item[0],
    branch:item[1],
    outputMonth:getPreviousReportMonth(),
    reportStatus:item[2],
    reporter:item[3],
    reportDate:item[4],
    values:{}
  };
  otherBizOutputBizColumns.forEach((col,colIndex)=>{
    row.values[col.key]=values?values[colIndex]:0;
  });
  return row;
});

function syncOtherBizOutputBranchOptions(){
  const company=document.getElementById("otherBizOutputCompany")?.value || "";
  const branch=document.getElementById("otherBizOutputBranch");
  if(!branch)return;
  const values=getOrganizationBranchOptions(company);
  const current=values.includes(branch.value)?branch.value:"";
  replaceProductionDashboardFragment(branch,renderActualOutputOptions(values,current,"全部"));
}

function queryOtherBizOutputReport(){
  otherBizOutputState.outputMonth=document.getElementById("otherBizOutputMonth")?.value || "";
  otherBizOutputState.company=document.getElementById("otherBizOutputCompany")?.value || "";
  otherBizOutputState.branch=document.getElementById("otherBizOutputBranch")?.value || "";
  otherBizOutputState.reportStatus=document.getElementById("otherBizOutputStatus")?.value || "";
  otherBizOutputState.statKey="all";
  otherBizOutputState.page=1;
  renderOtherBizOutputReportPage();
}

function resetOtherBizOutputReport(){
  Object.assign(otherBizOutputState,{
    outputMonth:getPreviousReportMonth(),
    company:"",
    branch:"",
    reportStatus:"",
    statKey:"all",
    page:1
  });
  renderOtherBizOutputReportPage();
}

function getOtherBizOutputSearchRows(){
  const s=otherBizOutputState;
  return otherBizOutputRows.filter(row=>{
    if(s.outputMonth&&row.outputMonth!==s.outputMonth)return false;
    if(s.company&&row.company!==s.company)return false;
    if(s.branch&&row.branch!==s.branch)return false;
    if(s.reportStatus&&row.reportStatus!==s.reportStatus)return false;
    return true;
  });
}

function getOtherBizOutputFilteredRows(){
  const rows=getOtherBizOutputSearchRows();
  if(otherBizOutputState.statKey==="reported")return rows.filter(row=>row.reportStatus==="已上报");
  if(otherBizOutputState.statKey==="approving")return rows.filter(row=>row.reportStatus==="上报审批中");
  if(otherBizOutputState.statKey==="unreported")return rows.filter(row=>row.reportStatus==="未上报");
  return rows;
}

function getOtherBizOutputPagedRows(){
  const rows=getOtherBizOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/otherBizOutputState.pageSize));
  otherBizOutputState.page=Math.min(Math.max(1,otherBizOutputState.page),totalPages);
  const start=(otherBizOutputState.page-1)*otherBizOutputState.pageSize;
  return rows.slice(start,start+otherBizOutputState.pageSize);
}

function setOtherBizOutputStat(key){
  otherBizOutputState.statKey=otherBizOutputState.statKey===key&&key!=="all"?"all":key;
  otherBizOutputState.page=1;
  renderOtherBizOutputReportPage();
}

function changeOtherBizOutputPage(dir){
  const total=getOtherBizOutputFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/otherBizOutputState.pageSize));
  otherBizOutputState.page=Math.min(max,Math.max(1,otherBizOutputState.page+dir));
  renderOtherBizOutputTable();
}

function changeOtherBizOutputPageSize(value){
  otherBizOutputState.pageSize=Number(value)||10;
  otherBizOutputState.page=1;
  renderOtherBizOutputTable();
}

function renderOtherBizOutputStatsCard(){
  const rows=getOtherBizOutputSearchRows();
  const required=rows.length;
  const reported=rows.filter(row=>row.reportStatus==="已上报").length;
  const approving=rows.filter(row=>row.reportStatus==="上报审批中").length;
  const unreported=rows.filter(row=>row.reportStatus==="未上报").length;
  const completion=required?Math.round(reported*100/required):0;
  const item=(key,label,value,metric=false)=>`
    <div class="construction-project-stat-item ${otherBizOutputState.statKey===key?"active":""} ${metric?"metric-only":""}" onclick="${metric?"showToast('上报完成率=已上报/应上报总数')":`setOtherBizOutputStat('${key}')`}">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">上报情况</div>
        <div class="construction-project-stat-items">
          ${item("all","应上报",required)}
          ${item("reported","已上报",reported)}
          ${item("approving","上报审批中",approving)}
          ${item("unreported","应报未报",unreported)}
          ${item("completion","上报完成率",`${completion}%`,true)}
        </div>
      </div>
    </div>
  `);
}

function renderOtherBizOutputAmount(row,key){
  if(row.reportStatus==="未上报")return "-";
  return `${formatActualOutputAmount(row.values[key])}`;
}

function renderOtherBizOutputGroupedHeader(){
  return renderSafetyEvalMonthlyGroupedHeader("otherBizOutputReport");
}

function renderOtherBizOutputTableRows(){
  return "";
}

function renderOtherBizOutputTable(){
  const tbody=document.getElementById("otherBizOutputTbody");
  renderTableByColumns("otherBizOutputReport",getOtherBizOutputPagedRows(),"otherBizOutputTbody");
  const table=document.getElementById("otherBizOutputTable");
  const thead=document.getElementById("otherBizOutputThead");
  if(table)table.style.minWidth=getTableMinWidth("otherBizOutputReport")+"px";
  replaceProductionDashboardFragment(thead,renderOtherBizOutputGroupedHeader());
  const total=getOtherBizOutputFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/otherBizOutputState.pageSize));
  const totalText=document.getElementById("otherBizOutputTotalText");
  const pageText=document.getElementById("otherBizOutputPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)replaceProductionDashboardFragment(pageText,`
    <button class="btn mini" onclick="changeOtherBizOutputPage(-1)" ${otherBizOutputState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${otherBizOutputState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeOtherBizOutputPage(1)" ${otherBizOutputState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeOtherBizOutputPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===otherBizOutputState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `);
}

function openOtherBizOutputDetail(id){
  const row=otherBizOutputRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到其他业态产值申报明细");
  const html=`
    <div class="actual-output-detail">
      <div class="actual-output-detail-main">
        <section class="actual-output-project-card">
          <h2>${row.company} / ${row.branch}</h2>
          <div class="actual-output-basic-grid">
            ${renderActualOutputDetailField("子公司",row.company)}
            ${renderActualOutputDetailField("分公司",row.branch)}
            ${renderActualOutputDetailField("产值月份",row.outputMonth)}
            ${renderActualOutputDetailField("上报情况",row.reportStatus)}
          </div>
        </section>
        <section class="actual-output-report-card">
          <div class="actual-output-section-title">上报信息</div>
          <div class="other-biz-report-metric-list readonly">
            ${otherBizOutputBizColumns.map(col=>{
              const values=Object.fromEntries(otherBizOutputReportMetricFields.map(field=>[
                field.key,
                {[col.key]:row.reportStatus==="未上报"?0:getOtherBizOutputReportMetricValue(row,col.key,field.key)}
              ]));
              return renderOtherBizOutputReportInput(col.label,col.key,values,{readonly:true});
            }).join("")}
          </div>
        </section>
      </div>
      ${renderActualOutputApprovalPanel({
        id:row.id,
        reportStatus:row.reportStatus,
        reportDate:row.reportDate,
        reporter:row.reporter,
        projectManager:row.reporter||"填报人",
        branch:row.branch,
        company:row.company
      },{approvalStatus:row.reportStatus==="已上报"?"审批通过":row.reportStatus==="上报审批中"?"审批中":"未发起"})}
    </div>
  `;
  openModal("其他业态产值申报详情",html,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("actual-output-detail-modal");
}

function getOtherBizOutputReportBase(){
  const rows=getOtherBizOutputFilteredRows();
  const row=rows.find(item=>item.reportStatus==="未上报") || rows[0] || otherBizOutputRows[0];
  const company=otherBizOutputState.company || row?.company || "上海隧道";
  const branch=otherBizOutputState.branch || row?.branch || getOrganizationBranchOptions(company)[0] || "轨交分公司";
  return {
    company,
    branch,
    outputMonth:otherBizOutputState.outputMonth || getPreviousReportMonth(),
    reportStatus:"上报审批中"
  };
}

function buildOtherBizOutputReportInitialValues(){
  const values=Object.fromEntries(otherBizOutputReportMetricFields.map(field=>[field.key,{}]));
  otherBizOutputInputColumns.forEach((col,index)=>{
    const monthlyActual=Number((18+index*3.65).toFixed(6));
    values.monthlyActual[col.key]=monthlyActual;
    values.annualPlan[col.key]=Number((monthlyActual*12).toFixed(6));
    values.remainingContract[col.key]=Number((monthlyActual*36).toFixed(6));
  });
  otherBizOutputReportMetricFields.forEach(field=>{
    values[field.key].total=otherBizOutputInputColumns.reduce((sum,col)=>sum+(Number(values[field.key][col.key])||0),0);
  });
  return values;
}

function getOtherBizOutputReportMetricValue(row,colKey,metricKey){
  if(row?.reportMetrics?.[metricKey] && row.reportMetrics[metricKey][colKey]!=null){
    return row.reportMetrics[metricKey][colKey];
  }
  const base=Number(row?.values?.[colKey]||0);
  if(metricKey==="annualPlan")return Number((base*12).toFixed(6));
  if(metricKey==="remainingContract")return Number((base*36).toFixed(6));
  return base;
}

function getOtherBizOutputInitialIndustryKeys(values){
  const active=otherBizOutputIndustryGroups
    .filter(group=>group.columns.some(colKey=>otherBizOutputReportMetricFields.some(field=>Number(values?.[field.key]?.[colKey]||0)>0)))
    .map(group=>group.key);
  return active.length?active:otherBizOutputIndustryGroups.map(group=>group.key);
}

function renderOtherBizOutputIndustrySelector(activeKeys){
  return `
    <div class="other-biz-industry-selector">
      <div>
        <strong>填报业态</strong>
        <span>仅勾选需要填报的业态</span>
      </div>
      <div class="other-biz-industry-options">
        ${otherBizOutputIndustryGroups.map(group=>`
          <label>
            <input type="checkbox" class="other-biz-industry-check" value="${group.key}" ${activeKeys.includes(group.key)?"checked":""} onchange="toggleOtherBizOutputIndustry('${group.key}',this.checked)"/>
            <span>${group.label}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `;
}

function renderOtherBizOutputReportInput(label,key,values,options={}){
  const readonly=!!options.readonly;
  const industry=options.industry || otherBizOutputColumnIndustryMap[key] || "";
  return `
    <article class="other-biz-report-metric-card ${readonly?"total":""}" ${industry?`data-industry="${industry}"`:""}>
      <h3>${label}</h3>
      <div class="other-biz-report-metric-fields">
        ${otherBizOutputReportMetricFields.map(field=>`
          <label>
            <span>${field.label}</span>
            <div class="${readonly?"readonly-total":""}">
              <input
                ${readonly?"readonly":""}
                class="other-biz-report-amount ${readonly?"readonly":""}"
                data-key="${key}"
                data-metric="${field.key}"
                type="number"
                min="0"
                step="0.000001"
                value="${Number(values?.[field.key]?.[key]||0).toFixed(6)}"
                oninput="updateOtherBizOutputReportTotal()"
              />
              <em>万元</em>
            </div>
          </label>
        `).join("")}
      </div>
    </article>
  `;
}

function renderOtherBizOutputReportTotal(values){
  return `
    <div class="other-biz-report-total">
      <h3>合计</h3>
      <div class="other-biz-report-total-values">
        ${otherBizOutputReportMetricFields.map(field=>`
          <div>
            <span>${field.label}</span>
            <strong class="other-biz-report-total-value" data-key="total" data-metric="${field.key}">${Number(values?.[field.key]?.total||0).toFixed(6)}</strong>
            <em>万元</em>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function updateOtherBizOutputReportTotal(){
  otherBizOutputReportMetricFields.forEach(field=>{
    const inputs=[...document.querySelectorAll(`.other-biz-report-metric-card:not(.is-hidden) .other-biz-report-amount[data-metric="${field.key}"]:not(.readonly)`)]; 
    const total=inputs.reduce((sum,input)=>sum+(Number(input.value)||0),0);
    const totalInput=document.querySelector(`.other-biz-report-amount[data-key="total"][data-metric="${field.key}"]`);
    if(totalInput)totalInput.value=total.toFixed(6);
    const totalText=document.querySelector(`.other-biz-report-total-value[data-key="total"][data-metric="${field.key}"]`);
    if(totalText)totalText.textContent=total.toFixed(6);
  });
}

function toggleOtherBizOutputIndustry(groupKey,checked){
  document.querySelectorAll(`.other-biz-report-metric-card[data-industry="${groupKey}"]`).forEach(card=>{
    card.classList.toggle("is-hidden",!checked);
    card.querySelectorAll(".other-biz-report-amount:not(.readonly)").forEach(input=>{
      input.disabled=!checked;
    });
  });
  updateOtherBizOutputReportTotal();
}

function syncOtherBizOutputIndustrySelection(){
  document.querySelectorAll(".other-biz-industry-check").forEach(input=>{
    toggleOtherBizOutputIndustry(input.value,input.checked);
  });
}

function renderOtherBizOutputPresetFlow(){
  const steps=[
    ["审批发起","active"],
    ["项目部发起开工申请",""],
    ["项目经理审批",""],
    ["分公司领导审批",""],
    ["审批结束","end"]
  ];
  return `
    <aside class="other-biz-report-flow">
      <div class="other-biz-flow-title">发起后按如下流程审批</div>
      <div class="other-biz-flow-body">
        ${steps.map(([label,state],index)=>`
          <div class="other-biz-flow-step ${state}">
            <div class="other-biz-flow-pill"><span>♟</span>${label}</div>
            ${index<steps.length-1?`<div class="other-biz-flow-line">↓</div>`:""}
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function openOtherBizOutputReportForm(){
  const base=getOtherBizOutputReportBase();
  const values=buildOtherBizOutputReportInitialValues();
  const activeIndustryKeys=getOtherBizOutputInitialIndustryKeys(values);
  const html=`
    <div class="actual-output-detail other-biz-report-form">
      <div class="actual-output-detail-main">
        <section class="actual-output-project-card">
          <h2>${base.company} / ${base.branch}</h2>
          <div class="actual-output-basic-grid">
            ${renderActualOutputDetailField("子公司",base.company)}
            ${renderActualOutputDetailField("分公司",base.branch)}
            ${renderActualOutputDetailField("产值月份",base.outputMonth)}
            ${renderActualOutputDetailField("上报情况",base.reportStatus)}
          </div>
        </section>
        <section class="actual-output-report-card">
          <div class="actual-output-section-title">上报信息</div>
          ${renderOtherBizOutputIndustrySelector(activeIndustryKeys)}
          <div class="other-biz-report-metric-list">
            ${otherBizOutputInputColumns.map(col=>renderOtherBizOutputReportInput(col.label,col.key,values,{industry:otherBizOutputColumnIndustryMap[col.key]})).join("")}
          </div>
          ${renderOtherBizOutputReportTotal(values)}
        </section>
      </div>
      ${renderOtherBizOutputPresetFlow()}
    </div>
  `;
  openModal("其他业态产值上报",html,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitOtherBizOutputReportForm()">提交</button>
  `,"large");
  modalBox.classList.add("actual-output-detail-modal");
  syncOtherBizOutputIndustrySelection();
}

function submitOtherBizOutputReportForm(){
  const base=getOtherBizOutputReportBase();
  const values={};
  const reportMetrics=Object.fromEntries(otherBizOutputReportMetricFields.map(field=>[field.key,{}]));
  const activeIndustryKeys=[...document.querySelectorAll(".other-biz-industry-check:checked")].map(input=>input.value);
  if(!activeIndustryKeys.length)return showToast("请至少选择一个需要填报的业态");
  otherBizOutputBizColumns.forEach(col=>{
    const isActive=col.key==="total" || activeIndustryKeys.includes(otherBizOutputColumnIndustryMap[col.key]);
    otherBizOutputReportMetricFields.forEach(field=>{
      const input=document.querySelector(`.other-biz-report-amount[data-key="${col.key}"][data-metric="${field.key}"]`);
      const totalText=document.querySelector(`.other-biz-report-total-value[data-key="${col.key}"][data-metric="${field.key}"]`);
      reportMetrics[field.key][col.key]=isActive ? Number(input?.value || totalText?.textContent)||0 : 0;
    });
    values[col.key]=reportMetrics.monthlyActual[col.key]||0;
  });
  const now=new Date();
  const pad=value=>String(value).padStart(2,"0");
  const reportDate=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  otherBizOutputRows.unshift({
    id:Math.max(...otherBizOutputRows.map(item=>item.id))+1,
    company:base.company,
    branch:base.branch,
    outputMonth:base.outputMonth,
    reportStatus:"上报审批中",
    reporter:"王安全",
    reportDate,
    values,
    reportMetrics
  });
  closeModal();
  otherBizOutputState.page=1;
  otherBizOutputState.statKey="all";
  renderOtherBizOutputReportPage();
  showToast("其他业态产值上报已提交，进入审批流程");
}

function renderOtherBizOutputTableCard(total,totalPages){
  return `
    <section class="card table-card construction-project-table-card monthly-fill-table-card">
      <div class="card-hd">
        <div class="card-title">产值上报明细</div>
        <div class="actions">
          <button class="btn primary" onclick="openOtherBizOutputReportForm()">产值上报</button>
          <button class="btn" onclick="renderOtherBizOutputReportPage()">刷新</button>
          <button class="btn" onclick="showToast('其他业态产值上报明细导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('otherBizOutputReport','renderOtherBizOutputReportPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        <table id="otherBizOutputTable" class="monthly-fill-group-table" style="min-width:${getTableMinWidth("otherBizOutputReport")}px">
          <thead id="otherBizOutputThead">${renderOtherBizOutputGroupedHeader()}</thead>
          <tbody id="otherBizOutputTbody"></tbody>
        </table>
      </div>
      <div class="pagination">
        <span id="otherBizOutputTotalText">共 ${total} 条</span>
        <span id="otherBizOutputPageText">
          <button class="btn mini" onclick="changeOtherBizOutputPage(-1)" ${otherBizOutputState.page<=1?"disabled":""}>上一页</button>
          <b>第 ${otherBizOutputState.page} / ${totalPages} 页</b>
          <button class="btn mini" onclick="changeOtherBizOutputPage(1)" ${otherBizOutputState.page>=totalPages?"disabled":""}>下一页</button>
          <select class="select mini-select" onchange="changeOtherBizOutputPageSize(this.value)">
            ${[10,20,50].map(size=>`<option value="${size}" ${size===otherBizOutputState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

async function renderOtherBizOutputReportPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const companyOptions=getOrganizationCompanies();
  const branchOptions=getOrganizationBranchOptions(otherBizOutputState.company);
  const rows=getOtherBizOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/otherBizOutputState.pageSize));
  const mounted=await mountOutputManagementTemplate("other-biz");
  if(!mounted)return;
  replaceProductionDashboardFragment(outputSlot("query"),renderUnifiedQueryCard(`
        <div class="form-item"><label>上报月份</label><input class="input" id="otherBizOutputMonth" type="month" value="${otherBizOutputState.outputMonth}"/></div>
        <div class="form-item"><label>子公司</label><select class="select" id="otherBizOutputCompany" onchange="syncOtherBizOutputBranchOptions()">${renderActualOutputOptions(companyOptions,otherBizOutputState.company,"全部")}</select></div>
        <div class="form-item"><label>分公司</label><select class="select" id="otherBizOutputBranch">${renderActualOutputOptions(branchOptions,otherBizOutputState.branch,"全部")}</select></div>
        <div class="form-item"><label>上报情况</label><select class="select" id="otherBizOutputStatus">${renderActualOutputOptions(["未上报","上报审批中","已上报"],otherBizOutputState.reportStatus,"全部")}</select></div>
      `,{title:"查询条件",queryFn:"queryOtherBizOutputReport()",resetFn:"resetOtherBizOutputReport()",gridClass:"search-grid",canCollapse:false}));
  replaceProductionDashboardFragment(outputSlot("stats"),renderOtherBizOutputStatsCard());
  replaceProductionDashboardFragment(outputSlot("table"),renderOtherBizOutputTableCard(rows.length,totalPages));
  renderOtherBizOutputTable();
}

const finishedUnsettledOutputState={
  outputMonth:getPreviousReportMonth(),
  company:"",
  branch:"",
  projectName:"",
  projectStatus:"",
  reportStatus:"",
  page:1,
  pageSize:10
};

const finishedUnsettledMetricFields=[
  {key:"annualPlan",label:"年度计划产值"},
  {key:"monthlyActual",label:"实际完成产值"},
  {key:"remainingContract",label:"剩余合同产值"}
];
const finishedUnsettledProjectStatuses=["完工","竣工"];

const finishedUnsettledOutputRows=[
  {
    id:1,
    projectCode:"WJ-2026-001",
    projectName:"G318沪青平公路快速化改建工程",
    company:"上海路桥",
    branch:"总承包一部",
    projectStatus:"完工",
    projectManager:"张三",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"未上报",
    annualPlan:0,
    monthlyActual:0,
    remainingContract:0,
    reporter:"",
    reportDate:""
  },
  {
    id:2,
    projectCode:"WJ-2026-002",
    projectName:"嘉闵线北延伸道路配套工程",
    company:"上海路桥",
    branch:"总承包二部",
    projectStatus:"竣工",
    projectManager:"陈启航",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"上报审批中",
    annualPlan:26000.000000,
    monthlyActual:7200.000000,
    remainingContract:72200.000000,
    reporter:"周宁",
    reportDate:"2026-06-17"
  },
  {
    id:3,
    projectCode:"WJ-2026-003",
    projectName:"海南自贸港市政配套完工结算项目",
    company:"市政集团",
    branch:"福建分公司",
    projectStatus:"完工",
    projectManager:"陈海南",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"已上报",
    annualPlan:18600.000000,
    monthlyActual:3850.000000,
    remainingContract:42600.000000,
    reporter:"赵一鸣",
    reportDate:"2026-06-20"
  },
  {
    id:4,
    projectCode:"WJ-2026-004",
    projectName:"浦东供排水设施更新工程",
    company:"城市环境",
    branch:"浦东供排水分公司",
    projectStatus:"完工",
    projectManager:"刘洋",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"未上报",
    annualPlan:0,
    monthlyActual:0,
    remainingContract:0,
    reporter:"",
    reportDate:""
  },
  {
    id:5,
    projectCode:"WJ-2026-005",
    projectName:"上海示范区线工程附属清算项目",
    company:"上海隧道",
    branch:"轨交分公司",
    projectStatus:"完工",
    projectManager:"赵菁",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"未上报",
    annualPlan:0,
    monthlyActual:0,
    remainingContract:0,
    reporter:"",
    reportDate:""
  },
  {
    id:6,
    projectCode:"WJ-2026-006",
    projectName:"电力管廊迁改完工未结算项目",
    company:"上海能建",
    branch:"电力工程分公司",
    projectStatus:"完工",
    projectManager:"黄晨",
    outputMonth:getPreviousReportMonth(),
    reportStatus:"上报审批中",
    annualPlan:9800.000000,
    monthlyActual:1620.000000,
    remainingContract:18800.000000,
    reporter:"黄晨",
    reportDate:"2026-06-24"
  }
];

tableColumnDefinitions.finishedUnsettledOutput=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(finishedUnsettledOutputState.page-1)*finishedUnsettledOutputState.pageSize+index+1},
  {key:"projectCode",title:"项目编号",width:130,align:"center",render:row=>row.projectCode},
  {key:"projectName",title:"项目名称",width:260,render:row=>row.projectName},
  {key:"company",title:"子公司",width:130,align:"center",render:row=>row.company},
  {key:"branch",title:"分公司",width:160,align:"center",render:row=>row.branch},
  {key:"projectStatus",title:"项目状态",width:110,align:"center",render:row=>row.projectStatus},
  {key:"projectManager",title:"项目经理",width:110,align:"center",render:row=>row.projectManager},
  {key:"outputMonth",title:"上报月份",width:120,align:"center",render:row=>row.outputMonth},
  {key:"reportStatus",title:"上报情况",width:130,align:"center",render:row=>renderActualOutputStatusTag(row.reportStatus)},
  {key:"annualPlan",title:"年度计划产值（万元）",width:170,align:"right",render:row=>row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.annualPlan)},
  {key:"monthlyActual",title:"实际完成产值（万元）",width:170,align:"right",render:row=>row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.monthlyActual)},
  {key:"remainingContract",title:"剩余合同产值（万元）",width:170,align:"right",render:row=>row.reportStatus==="未上报"?"-":formatActualOutputAmount(row.remainingContract)},
  {key:"reporter",title:"上报人",width:110,align:"center",render:row=>row.reporter||"-"},
  {key:"reportDate",title:"上报日期",width:130,align:"center",render:row=>row.reportDate||"-"},
  {key:"operation",title:"操作",width:90,align:"center",render:row=>`<a class="link" onclick="openFinishedUnsettledOutputReportForm(${row.id})">上报</a>`}
];

function syncFinishedUnsettledOutputBranchOptions(){
  const company=document.getElementById("finishedUnsettledCompany")?.value || "";
  const branch=document.getElementById("finishedUnsettledBranch");
  if(!branch)return;
  const values=getOrganizationBranchOptions(company);
  const current=values.includes(branch.value)?branch.value:"";
  replaceProductionDashboardFragment(branch,renderActualOutputOptions(values,current,"全部"));
}

function queryFinishedUnsettledOutput(){
  finishedUnsettledOutputState.outputMonth=document.getElementById("finishedUnsettledMonth")?.value || "";
  finishedUnsettledOutputState.company=document.getElementById("finishedUnsettledCompany")?.value || "";
  finishedUnsettledOutputState.branch=document.getElementById("finishedUnsettledBranch")?.value || "";
  finishedUnsettledOutputState.projectName=document.getElementById("finishedUnsettledProjectName")?.value.trim() || "";
  finishedUnsettledOutputState.projectStatus=document.getElementById("finishedUnsettledProjectStatus")?.value || "";
  finishedUnsettledOutputState.reportStatus=document.getElementById("finishedUnsettledReportStatus")?.value || "";
  finishedUnsettledOutputState.page=1;
  renderFinishedUnsettledOutputPage();
}

function resetFinishedUnsettledOutput(){
  Object.assign(finishedUnsettledOutputState,{
    outputMonth:getPreviousReportMonth(),
    company:"",
    branch:"",
    projectName:"",
    projectStatus:"",
    reportStatus:"",
    page:1
  });
  renderFinishedUnsettledOutputPage();
}

function getFinishedUnsettledOutputFilteredRows(){
  const s=finishedUnsettledOutputState;
  return finishedUnsettledOutputRows.filter(row=>{
    if(!finishedUnsettledProjectStatuses.includes(row.projectStatus))return false;
    if(s.outputMonth&&row.outputMonth!==s.outputMonth)return false;
    if(s.company&&row.company!==s.company)return false;
    if(s.branch&&row.branch!==s.branch)return false;
    if(s.projectName&&!row.projectName.includes(s.projectName))return false;
    if(s.projectStatus&&row.projectStatus!==s.projectStatus)return false;
    if(s.reportStatus&&row.reportStatus!==s.reportStatus)return false;
    return true;
  });
}

function getFinishedUnsettledOutputPagedRows(){
  const rows=getFinishedUnsettledOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/finishedUnsettledOutputState.pageSize));
  finishedUnsettledOutputState.page=Math.min(Math.max(1,finishedUnsettledOutputState.page),totalPages);
  const start=(finishedUnsettledOutputState.page-1)*finishedUnsettledOutputState.pageSize;
  return rows.slice(start,start+finishedUnsettledOutputState.pageSize);
}

function changeFinishedUnsettledOutputPage(dir){
  const total=getFinishedUnsettledOutputFilteredRows().length;
  const max=Math.max(1,Math.ceil(total/finishedUnsettledOutputState.pageSize));
  finishedUnsettledOutputState.page=Math.min(max,Math.max(1,finishedUnsettledOutputState.page+dir));
  renderFinishedUnsettledOutputTable();
}

function changeFinishedUnsettledOutputPageSize(value){
  finishedUnsettledOutputState.pageSize=Number(value)||10;
  finishedUnsettledOutputState.page=1;
  renderFinishedUnsettledOutputTable();
}

function renderFinishedUnsettledOutputTable(){
  renderTableByColumns("finishedUnsettledOutput",getFinishedUnsettledOutputPagedRows(),"finishedUnsettledOutputTbody");
  const table=document.getElementById("finishedUnsettledOutputTable");
  if(table)table.style.minWidth=getTableMinWidth("finishedUnsettledOutput")+"px";
  const total=getFinishedUnsettledOutputFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/finishedUnsettledOutputState.pageSize));
  const totalText=document.getElementById("finishedUnsettledTotalText");
  const pageText=document.getElementById("finishedUnsettledPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)replaceProductionDashboardFragment(pageText,`
    <button class="btn mini" onclick="changeFinishedUnsettledOutputPage(-1)" ${finishedUnsettledOutputState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${finishedUnsettledOutputState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeFinishedUnsettledOutputPage(1)" ${finishedUnsettledOutputState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeFinishedUnsettledOutputPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===finishedUnsettledOutputState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `);
}

function renderFinishedUnsettledOutputTableCard(total,totalPages){
  return `
    <section class="card table-card construction-project-table-card monthly-fill-table-card">
      <div class="card-hd">
        <div class="card-title">完工未结算台账</div>
        <div class="actions">
          <button class="btn" onclick="renderFinishedUnsettledOutputPage()">刷新</button>
          <button class="btn" onclick="showToast('完工未结算台账导出成功')">导出</button>
          <button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('finishedUnsettledOutput','renderFinishedUnsettledOutputPage')">⚙</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        <table id="finishedUnsettledOutputTable" class="monthly-fill-group-table" style="min-width:${getTableMinWidth("finishedUnsettledOutput")}px">
          <thead><tr>${renderTableHeaderByColumns("finishedUnsettledOutput")}</tr></thead>
          <tbody id="finishedUnsettledOutputTbody"></tbody>
        </table>
      </div>
      <div class="pagination">
        <span id="finishedUnsettledTotalText">共 ${total} 条</span>
        <span id="finishedUnsettledPageText">
          <button class="btn mini" onclick="changeFinishedUnsettledOutputPage(-1)" ${finishedUnsettledOutputState.page<=1?"disabled":""}>上一页</button>
          <b>第 ${finishedUnsettledOutputState.page} / ${totalPages} 页</b>
          <button class="btn mini" onclick="changeFinishedUnsettledOutputPage(1)" ${finishedUnsettledOutputState.page>=totalPages?"disabled":""}>下一页</button>
          <select class="select mini-select" onchange="changeFinishedUnsettledOutputPageSize(this.value)">
            ${[10,20,50].map(size=>`<option value="${size}" ${size===finishedUnsettledOutputState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </span>
      </div>
    </section>
  `;
}

function renderFinishedUnsettledOutputReportInput(field,value){
  return `
    <div class="actual-output-readonly other-biz-report-field">
      <label>${field.label}</label>
      <div>
        <input
          class="other-biz-report-amount"
          data-metric="${field.key}"
          type="number"
          min="0"
          step="0.000001"
          value="${Number(value||0).toFixed(6)}"
        />
        <em>万元</em>
      </div>
    </div>
  `;
}

function openFinishedUnsettledOutputReportForm(id){
  const row=finishedUnsettledOutputRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到完工未结算项目");
  const defaults={
    annualPlan:row.annualPlan || 12000,
    monthlyActual:row.monthlyActual || 1200,
    remainingContract:row.remainingContract || 36000
  };
  const html=`
    <div class="actual-output-detail">
      <div class="actual-output-detail-main">
        <section class="actual-output-project-card">
          <h2>${row.projectName}</h2>
          <div class="actual-output-basic-grid">
            ${renderActualOutputDetailField("项目编号",row.projectCode)}
            ${renderActualOutputDetailField("子公司",row.company)}
            ${renderActualOutputDetailField("分公司",row.branch)}
            ${renderActualOutputDetailField("项目经理",row.projectManager)}
            ${renderActualOutputDetailField("项目状态",row.projectStatus)}
            ${renderActualOutputDetailField("上报月份",finishedUnsettledOutputState.outputMonth || row.outputMonth)}
            ${renderActualOutputDetailField("上报情况","上报审批中")}
          </div>
        </section>
        <section class="actual-output-report-card">
          <div class="actual-output-section-title">上报信息</div>
          <div class="actual-output-form-grid three">
            ${finishedUnsettledMetricFields.map(field=>renderFinishedUnsettledOutputReportInput(field,defaults[field.key])).join("")}
          </div>
        </section>
      </div>
      ${renderActualOutputApprovalPanel({
        id:row.id,
        reportStatus:"上报审批中",
        reportDate:getPreviousReportMonth(),
        reporter:"王安全",
        projectManager:row.projectManager,
        branch:row.branch,
        company:row.company
      },{approvalStatus:"待提交"})}
    </div>
  `;
  openModal("完工未结算产值上报",html,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitFinishedUnsettledOutputReport(${row.id})">提交</button>
  `,"large");
  modalBox.classList.add("actual-output-detail-modal");
}

function submitFinishedUnsettledOutputReport(id){
  const row=finishedUnsettledOutputRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到完工未结算项目");
  finishedUnsettledMetricFields.forEach(field=>{
    const input=document.querySelector(`.other-biz-report-amount[data-metric="${field.key}"]`);
    row[field.key]=Number(input?.value)||0;
  });
  const now=new Date();
  const pad=value=>String(value).padStart(2,"0");
  row.outputMonth=finishedUnsettledOutputState.outputMonth || row.outputMonth || getPreviousReportMonth();
  row.reportStatus="上报审批中";
  row.reporter="王安全";
  row.reportDate=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  closeModal();
  renderFinishedUnsettledOutputPage();
  showToast("完工未结算产值上报已提交，进入审批流程");
}

async function renderFinishedUnsettledOutputPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const companyOptions=getOrganizationCompanies();
  const branchOptions=getOrganizationBranchOptions(finishedUnsettledOutputState.company);
  const rows=getFinishedUnsettledOutputFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/finishedUnsettledOutputState.pageSize));
  const mounted=await mountOutputManagementTemplate("finished-unsettled");
  if(!mounted)return;
  replaceProductionDashboardFragment(outputSlot("query"),renderUnifiedQueryCard(`
        <div class="form-item"><label>上报月份</label><input class="input" id="finishedUnsettledMonth" type="month" value="${finishedUnsettledOutputState.outputMonth}"/></div>
        <div class="form-item"><label>子公司</label><select class="select" id="finishedUnsettledCompany" onchange="syncFinishedUnsettledOutputBranchOptions()">${renderActualOutputOptions(companyOptions,finishedUnsettledOutputState.company,"全部")}</select></div>
        <div class="form-item"><label>分公司</label><select class="select" id="finishedUnsettledBranch">${renderActualOutputOptions(branchOptions,finishedUnsettledOutputState.branch,"全部")}</select></div>
        <div class="form-item"><label>项目名称</label><input class="input" id="finishedUnsettledProjectName" value="${escapeAttr(finishedUnsettledOutputState.projectName)}" placeholder="请输入项目名称"/></div>
        <div class="form-item"><label>项目状态</label><select class="select" id="finishedUnsettledProjectStatus">${renderActualOutputOptions(finishedUnsettledProjectStatuses,finishedUnsettledOutputState.projectStatus,"全部")}</select></div>
        <div class="form-item"><label>上报情况</label><select class="select" id="finishedUnsettledReportStatus">${renderActualOutputOptions(["未上报","上报审批中","已上报"],finishedUnsettledOutputState.reportStatus,"全部")}</select></div>
      `,{title:"查询条件",queryFn:"queryFinishedUnsettledOutput()",resetFn:"resetFinishedUnsettledOutput()",gridClass:"search-grid",canCollapse:false}));
  replaceProductionDashboardFragment(outputSlot("table"),renderFinishedUnsettledOutputTableCard(rows.length,totalPages));
  renderFinishedUnsettledOutputTable();
}

function maskIdNo(idNo){
  if(!idNo)return "--";
  const str=String(idNo);
  if(str.includes("*"))return str;
  if(str.length<=8)return str;
  return str.slice(0,4) + "**********" + str.slice(-4);
}

function getWorkerExtraInfo(w){
  const presets={
    1:{
      politics:"群众",
      educationLevel:"高中",
      maritalStatus:"已婚",
      nation:"汉族",
      majorDisease:"无",
      emergencyContact:"张丽",
      emergencyPhone:"13988885621",
      workStartDate:"2006-03-01",
      unionJoined:"是",
      unionJoinDate:"2021-06-18",
      idType:"居民身份证",
      idNo:"510107198604128856",
      idValidDate:"2024-01-01 至 2044-01-01"
    },
    2:{
      politics:"群众",
      educationLevel:"初中",
      maritalStatus:"已婚",
      nation:"汉族",
      majorDisease:"无",
      emergencyContact:"李芳",
      emergencyPhone:"15888888134",
      workStartDate:"2010-05-12",
      unionJoined:"否",
      unionJoinDate:"",
      idType:"居民身份证",
      idNo:"410102199109218134",
      idValidDate:"2023-09-01 至 2043-09-01"
    },
    3:{
      politics:"群众",
      educationLevel:"高中",
      maritalStatus:"已婚",
      nation:"汉族",
      majorDisease:"无",
      emergencyContact:"赵敏",
      emergencyPhone:"13788886510",
      workStartDate:"2002-07-20",
      unionJoined:"是",
      unionJoinDate:"2020-04-10",
      idType:"居民身份证",
      idNo:"370102198207166510",
      idValidDate:"2022-02-01 至 2042-02-01"
    }
  };

  return presets[w.id] || {
    politics:"群众",
    educationLevel:"高中",
    maritalStatus:"已婚",
    nation:"汉族",
    majorDisease:"无",
    emergencyContact:"--",
    emergencyPhone:"--",
    workStartDate:"--",
    unionJoined:"否",
    unionJoinDate:"",
    idType:"居民身份证",
    idNo:"310000198801010000",
    idValidDate:"2024-01-01 至 2044-01-01"
  };
}

function getWorkerResumeList(w){
  if(!w)return [];

  const projectOrgMap={
    "虹桥地下综合管廊项目":{sub:"上海隧道",branch:"轨交分公司"},
    "北横通道改造项目":{sub:"上海隧道",branch:"轨交分公司"},
    "华东智慧产业园一期":{sub:"上海隧道",branch:"轨交分公司"},
    "深圳前海市政配套项目":{sub:"城建国际",branch:"新加坡分公司"},
    "湾区金融中心项目":{sub:"城建国际",branch:"新加坡分公司"},
    "济南地铁车站主体项目":{sub:"市政集团",branch:"第一建筑"},
    "北方数据中心项目":{sub:"市政集团",branch:"第一建筑"}
  };

  const normalize=(r={})=>{
    const org=projectOrgMap[r.project] || {};
    return {
      project:r.project || "--",
      sub:r.sub || r.subCompany || org.sub || w.sub || "--",
      branch:r.branch || org.branch || w.branch || "--",
      unit:r.unit || r.currentUnit || w.unit || "--",
      team:r.team || r.currentTeam || w.team || "--",
      type:r.type || w.type || "--",
      job:r.job || r.position || w.job || "--",
      inDate:r.inDate || r.startDate || "--",
      outDate:r.outDate || r.endDate || "--"
    };
  };

  const current=normalize({
    project:w.project,
    sub:w.sub,
    branch:w.branch,
    unit:w.unit,
    team:w.team,
    type:w.type,
    job:w.job,
    inDate:w.inDate,
    outDate:w.outDate || "--"
  });

  const historyMap={
    1:[
      {
        project:"虹桥地下综合管廊项目",
        sub:"上海隧道",
        branch:"轨交分公司",
        unit:"四川宏安劳务有限公司",
        team:"钢筋二班",
        type:"劳务工人",
        job:"钢筋工",
        inDate:"2024-03-10",
        outDate:"2025-01-20"
      },
      {
        project:"北横通道改造项目",
        sub:"上海隧道",
        branch:"轨交分公司",
        unit:"四川宏安劳务有限公司",
        team:"焊工一班",
        type:"特种作业人员",
        job:"焊工",
        inDate:"2025-03-08",
        outDate:"2025-12-30"
      }
    ],
    2:[
      {
        project:"深圳前海市政配套项目",
        sub:"城建国际",
        branch:"新加坡分公司",
        unit:"豫达建筑劳务有限公司",
        team:"木工二班",
        type:"劳务工人",
        job:"木工",
        inDate:"2024-06-12",
        outDate:"2025-05-18"
      }
    ],
    3:[
      {
        project:"济南地铁车站主体项目",
        sub:"市政集团",
        branch:"第一建筑",
        unit:"鲁建劳务有限公司",
        team:"架子工一班",
        type:"特种作业人员",
        job:"架子工",
        inDate:"2023-09-01",
        outDate:"2024-10-30"
      }
    ]
  };

  const rawHistory=(w.workHistory || w.resume || historyMap[w.id] || []).map(normalize);
  return [...rawHistory, current];
}

function workerMeta(label,value){
  return `
    <div class="worker-meta-item">
      <div class="worker-meta-label">${label}</div>
      <div class="worker-meta-value" title="${value || "--"}">${value || "--"}</div>
    </div>
  `;
}

function scrollToWorkerSection(id){
  const el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
}
