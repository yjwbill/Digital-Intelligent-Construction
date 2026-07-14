const productionOverviewFilterState={
  company:"",
  branch:"",
  region:"",
  client:"",
  projectType:""
};
const productionDashboardTemplatePath="src/app/production/dashboard-projects.html";
let productionDashboardTemplatePromise=null;
let productionDashboardRenderToken=0;

function getProductionDashboardTemplatesFromDocument(){
  const templates=new Map();
  document.querySelectorAll("template[data-production-dashboard-template]").forEach(template=>{
    templates.set(template.dataset.productionDashboardTemplate,template);
  });
  return templates.size?templates:null;
}

function parseProductionDashboardFragment(html,targetTag=""){
  const parser=new DOMParser();
  const tag=String(targetTag||"").toUpperCase();
  const wrapper=tag==="THEAD"
    ? `<table><thead>${html}</thead></table>`
    : tag==="TBODY"
      ? `<table><tbody>${html}</tbody></table>`
      : tag==="TR"
        ? `<table><tbody><tr>${html}</tr></tbody></table>`
        : tag==="SELECT"
          ? `<select>${html}</select>`
          : html;
  const doc=parser.parseFromString(wrapper,"text/html");
  if(tag==="THEAD")return Array.from(doc.querySelector("thead")?.childNodes||[]);
  if(tag==="TBODY")return Array.from(doc.querySelector("tbody")?.childNodes||[]);
  if(tag==="TR")return Array.from(doc.querySelector("tr")?.childNodes||[]);
  if(tag==="SELECT")return Array.from(doc.querySelector("select")?.childNodes||[]);
  return Array.from(doc.body.childNodes);
}

function replaceProductionDashboardFragment(target,html){
  if(!target)return;
  const nodes=parseProductionDashboardFragment(html,target.tagName)
    .map(node=>document.importNode(node,true));
  target.replaceChildren(...nodes);
}

function replaceProductionDashboardText(node,from,to){
  if(!node)return;
  if(node.nodeType===Node.TEXT_NODE){
    node.nodeValue=node.nodeValue.replaceAll(from,to);
    return;
  }
  node.childNodes.forEach(child=>replaceProductionDashboardText(child,from,to));
}

function loadProductionDashboardTemplates(){
  const inlineTemplates=getProductionDashboardTemplatesFromDocument();
  if(inlineTemplates)return Promise.resolve(inlineTemplates);

  if(!productionDashboardTemplatePromise){
    productionDashboardTemplatePromise=fetch(productionDashboardTemplatePath)
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,"text/html");
        const templates=new Map();
        doc.querySelectorAll("template[data-production-dashboard-template]").forEach(template=>{
          templates.set(template.dataset.productionDashboardTemplate,template);
        });
        return templates;
      })
      .catch(error=>{
        console.warn("load production templates failed",error);
        productionDashboardTemplatePromise=null;
        return new Map();
      });
  }
  return productionDashboardTemplatePromise;
}

async function mountProductionDashboardTemplate(name,display="block"){
  const token=++productionDashboardRenderToken;
  const templates=await loadProductionDashboardTemplates();
  if(token!==productionDashboardRenderToken)return {stale:true,root:null};
  const template=templates.get(name);
  if(!template){
    const fallback=document.createElement("div");
    fallback.className="project-log-empty";
    fallback.textContent="生产模块页面模板加载失败";
    listPage.replaceChildren(fallback);
    return {stale:false,root:fallback};
  }
  listPage.style.display=display;
  listPage.replaceChildren(document.importNode(template.content,true));
  return {stale:false,root:listPage};
}

function productionDashboardSlot(name){
  return document.querySelector(`[data-production-slot="${name}"]`);
}

const productionMajorFilterState={
  year:"2026",
  region:"",
  projectType:"",
  client:""
};
const productionOverviewRegions=["长三角区域","中原区域","大湾区","华北区域","西南区域","海外区域"];
const productionOverviewClients=["上海久事","上海机场","上海申通","上海城投水务","前海建设投资","上海轨道交通建设管理中心"];
const productionOverviewDeviceData={
  current:{
    label:"当前在场设备",
    total:490,
    bars:[
      {name:"自有",value:166,group:"设备产权组"},
      {name:"租赁",value:324,group:"设备产权组"},
      {name:"进口",value:167,group:"设备国别组"},
      {name:"国产",value:323,group:"设备国别组"}
    ]
  },
  monitor:{
    label:"运行监测",
    total:31,
    bars:[
      {name:"自有",value:12,group:"设备产权组"},
      {name:"租赁",value:19,group:"设备产权组"},
      {name:"进口",value:8,group:"设备国别组"},
      {name:"国产",value:23,group:"设备国别组"}
    ]
  }
};

function switchProductionScreenTab(tab){
  if(tab==="生产总览")return renderProductionOverviewDashboardPreservingScroll();
  if(tab==="重大工程项目看板")return renderProductionMajorDashboardPreservingScroll();
  if(tab==="产值看板")return renderProductionValueDashboardPreservingScroll();
  return renderProductionScreenEmptyPage(tab);
}

function renderProductionOverviewOptions(options,value,placeholder){
  return `<option value="">${placeholder}</option>${options.map(option=>`<option value="${escapeAttr(option)}" ${option===value?"selected":""}>${option}</option>`).join("")}`;
}

function getProductionOverviewProjectTypeOptions(){
  if(typeof getDictEnabledOptionsV2285==="function")return getDictEnabledOptionsV2285("PROJECT_TYPE");
  return ["轨交","公路","市政","建筑","环境","能源","机场","港口","园林","片区开发","产品","租售","企业管理"];
}

function setProductionOverviewFilter(key,value){
  productionOverviewFilterState[key]=value || "";
  if(key==="company")productionOverviewFilterState.branch="";
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionMajorFilter(key,value){
  productionMajorFilterState[key]=value || "";
  renderProductionMajorDashboardPreservingScroll();
}

function setProductionOverviewCompletionMode(mode){
  productionOverviewCompletionMode=mode;
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionOverviewDeviceMode(mode){
  productionOverviewDeviceMode=mode==="monitor"?"monitor":"current";
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionOverviewAnalysisMode(type,mode){
  const nextMode=mode==="progress"?"progress":"value";
  if(type==="client")productionOverviewClientMode=nextMode;
  else productionOverviewMarketMode=nextMode;
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionOverviewMaterialMode(mode){
  productionOverviewMaterialMode=mode==="trend"?"trend":"stat";
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionOverviewMaterialActive(name){
  productionOverviewMaterialActive=name || "混凝土";
  renderProductionOverviewDashboardPreservingScroll();
}

function setProductionValueOrg(org){
  productionValueOrgActive=org;
  renderProductionValueDashboardPreservingScroll();
}

function setProductionValueBizTab(tab){
  productionValueBizActive=tab;
  if(productionValueBizSubTabs[tab] && !productionValueBizSubActive[tab]){
    productionValueBizSubActive[tab]=productionValueBizSubTabs[tab][0];
  }
  renderProductionValueDashboardPreservingScroll();
}

function setProductionValueBizSubTab(parent,tab){
  productionValueBizActive=parent;
  productionValueBizSubActive[parent]=tab;
  renderProductionValueDashboardPreservingScroll();
}

function setProductionValueBizPanel(tab){
  productionValueBizPanelActive=tab;
  renderProductionValueDashboardPreservingScroll();
}

function setProductionValueCompanyMode(mode){
  productionValueCompanyMode=mode;
  renderProductionValueDashboardPreservingScroll();
}

function renderProductionScreenHeader(activeTab="产值看板"){
  const isOverview=activeTab==="生产总览";
  const isMajor=activeTab==="重大工程项目看板";
  const overviewCompanyOptions=getOrganizationCompanies();
  const overviewBranchOptions=getOrganizationBranchOptions(productionOverviewFilterState.company);
  return `
    <div class="safety-screen-header">
      <div class="screen-brand"><span class="screen-logo">P</span><strong>生产在线管控平台</strong></div>
      <div class="screen-tabs production-screen-tabs">
        ${productionScreenTabs.map(x=>`<button class="${x===activeTab?"active":""} ${productionScreenEmptyTabs.includes(x)?"muted":""}" onclick="switchProductionScreenTab('${x}')">${x}</button>`).join("")}
      </div>
      ${isOverview?`
        <div class="production-overview-filters">
          <select class="select" onchange="setProductionOverviewFilter('company',this.value)">${renderProductionOverviewOptions(overviewCompanyOptions,productionOverviewFilterState.company,"子公司")}</select>
          <select class="select" onchange="setProductionOverviewFilter('branch',this.value)">${renderProductionOverviewOptions(overviewBranchOptions,productionOverviewFilterState.branch,"分公司")}</select>
          <select class="select" onchange="setProductionOverviewFilter('region',this.value)">${renderProductionOverviewOptions(productionOverviewRegions,productionOverviewFilterState.region,"所属区域")}</select>
          <select class="select" onchange="setProductionOverviewFilter('client',this.value)">${renderProductionOverviewOptions(productionOverviewClients,productionOverviewFilterState.client,"重点客户")}</select>
          <select class="select" onchange="setProductionOverviewFilter('projectType',this.value)">${renderProductionOverviewOptions(getProductionOverviewProjectTypeOptions(),productionOverviewFilterState.projectType,"项目类型")}</select>
        </div>
      `:isMajor?`
        <div class="production-overview-filters production-major-filters">
          <select class="select" onchange="setProductionMajorFilter('year',this.value)">${["2026","2025","2024"].map(year=>`<option value="${year}" ${year===productionMajorFilterState.year?"selected":""}>${year}年</option>`).join("")}</select>
          <select class="select" onchange="setProductionMajorFilter('region',this.value)">${renderProductionOverviewOptions(productionOverviewRegions,productionMajorFilterState.region,"所属区域")}</select>
          <select class="select" onchange="setProductionMajorFilter('projectType',this.value)">${renderProductionOverviewOptions(getProductionOverviewProjectTypeOptions(),productionMajorFilterState.projectType,"项目类型")}</select>
          <select class="select" onchange="setProductionMajorFilter('client',this.value)">${renderProductionOverviewOptions(productionOverviewClients,productionMajorFilterState.client,"重点客户")}</select>
        </div>
      `:`
        <div class="screen-company screen-month-actions">
          ${renderSafetyMonthPicker("productionValueMonth")}
        </div>
      `}
    </div>
  `;
}

async function renderProductionScreenEmptyPage(tab){
  detailPage.style.display="none";
  const mounted=await mountProductionDashboardTemplate("empty","block");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(productionDashboardSlot("header"),renderProductionScreenHeader(tab));
  const title=document.querySelector("[data-production-empty-title]");
  if(title)title.textContent=tab;
}

const productionMajorCompanyRows=[
  ["上海隧道",57,"651,326.41","#316CEB"],["上海路桥",24,"211,653.08","#25A9F2"],["市政集团",24,"191,132.92","#2BC7C9"],["城市环境",22,"33,760.82","#FF765F"],["运营集团",11,"22,570.98","#5BD9B2"],["上海能建",3,"823.30","#FFCE5A"],["城建设计",36,"0.00","#8BCB69"]
];
const productionMajorOwnerRows=[
  ["申通地铁",61,"484,824.01","#316CEB"],["上海城投",39,"361,327.54","#25A9F2"],["上海公投",10,"115,868.71","#2BC7C9"],["松江区市政水务",6,"10,432.00","#FF765F"],["普陀区市政水务",5,"1,200.00","#5BD9B2"],["上海机场",4,"34,600.00","#FFCE5A"],["沪宁城际",2,"46,087.00","#8BCB69"]
];
const productionMajorSubjectRows=[
  ["城市基础设施类",48,"996,056.40","#316CEB"],["生态文明建设类",7,"113,705.84","#25A9F2"],["城乡融合与乡村振兴类",1,"1,505.27","#2BC7C9"],["科技产业类",5,"0.00","#FF765F"],["社会民生类",8,"0.00","#5BD9B2"],["预备项目",0,"0.00","#FFCE5A"]
];
const productionMajorProjectRows=[
  ["城市基础设施类",136,"996,056.40","#316CEB"],["生态文明建设类",27,"113,705.84","#25A9F2"],["科技产业类",5,"0.00","#2BC7C9"],["城乡融合与乡村振兴类",1,"1,505.27","#FF765F"],["社会民生类",8,"0.00","#5BD9B2"],["预备项目",0,"0.00","#FFCE5A"]
];

function renderProductionMajorRing(total,segments){
  const sum=segments.reduce((value,item)=>value+item[1],0)||1;
  let offset=0;
  const gradient=segments.map(item=>{
    const start=offset/sum*100;
    offset+=item[1];
    return `${item[3]} ${start}% ${offset/sum*100}%`;
  }).join(",");
  return `<div class="production-major-ring" style="background:conic-gradient(${gradient})"><div><span>项目总数</span><strong>${total}</strong></div></div>`;
}

function renderProductionMajorDistribution(title,rows,total,label){
  return `
    <section class="production-major-card">
      <div class="production-major-card-hd"><h2>${title}</h2><button type="button" title="导出" onclick="showToast('${title}导出成功')">⇩</button></div>
      <div class="production-major-distribution">
        ${renderProductionMajorRing(total,rows)}
        <div class="production-major-table-wrap">
          <table class="production-major-table"><thead><tr><th>${label}</th><th>重大工程项目数</th><th>全年投资计划(万元)</th></tr></thead>
          <tbody>${rows.map(row=>`<tr><td><i style="background:${row[3]}"></i>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}</tbody></table>
        </div>
      </div>
    </section>
  `;
}

function renderProductionMajorCompletion(title,rows){
  const max=Math.max(...rows.map(row=>row[1]));
  return `
    <section class="production-major-card production-major-completion-card">
      <div class="production-major-card-hd"><h2>${title}</h2><div class="production-major-quarter-tabs"><button class="active">全年</button><button>第一季度</button><button>第二季度</button><button>第三季度</button><button>第四季度</button></div><button type="button" title="导出" onclick="showToast('${title}导出成功')">⇩</button></div>
      <div class="production-major-completion-summary">年度计划 <b>2,491,195.50万元</b>，实际完成 <b>176,404.09万元</b>，完成率 <b>7.08%</b></div>
      <div class="production-major-chart">
        <div class="production-major-axis left">金额（万元）</div><div class="production-major-axis right">完成率</div>
        <div class="production-major-bars">${rows.map((row,index)=>`<div class="production-major-bar-group"><div class="production-major-tooltip"><strong>${row[0]}</strong><span>年度计划：${row[1].toLocaleString()}万元</span><span>实际完成：${row[2].toLocaleString()}万元</span><span>完成率：${row[3]}%</span></div><div class="production-major-bars-pair"><i class="plan" style="height:${Math.max(10,row[1]/max*100)}%"></i><i class="actual" style="height:${Math.max(6,row[2]/max*100)}%"></i></div><em>${row[0]}</em>${index<rows.length-1?`<b class="line-dot" style="bottom:${row[3]}%"></b>`:""}</div>`).join("")}</div>
        <div class="production-major-chart-legend"><span><i class="plan"></i>计划值</span><span><i class="actual"></i>完成值</span><span><i class="line"></i>完成率</span></div>
      </div>
    </section>
  `;
}

async function renderProductionMajorDashboardPage(){
  detailPage.style.display="none";
  const companyCompletion=[["上海隧道",1300000,92000,7.1],["上海路桥",360000,25000,6.9],["城市环境",110000,6200,5.6],["市政集团",590000,44500,7.5],["上海能建",45000,3200,7.1],["运营集团",42000,5100,12.1],["城建设计",44000,1600,3.6]];
  const ownerCompletion=[["申通地铁",480000,62000,12.9],["上海城投",365000,34000,9.3],["上海公投",160000,9600,6.0],["松江区市政水务",110000,4300,3.9],["普陀区市政水务",95000,3200,3.4],["上海机场",78000,2800,3.6],["沪宁城际",46000,1100,2.4]];
  const topMetrics=[
    ["全年计划","249.12","亿","¥"],
    ["全年产值实际完成","17.64","亿","✓"],
    ["完成占比","7.08","%","◔"],
    ["科目数","198","个","▣"],
    ["股份参与科目数","51","个","◎"],
    ["重大工程项目数","177","个","◆","待建16 · 在建91 · 停工16 · 完工15 · 竣工3"]
  ];
  const mounted=await mountProductionDashboardTemplate("major","block");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(productionDashboardSlot("header"),renderProductionScreenHeader("重大工程项目看板"));
  replaceProductionDashboardFragment(productionDashboardSlot("top"),topMetrics.map(item=>renderProductionValueMetric(...item)).join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("grid"),[
    renderProductionMajorDistribution("子公司重大工程项目分布",productionMajorCompanyRows,177,"子公司"),
    renderProductionMajorDistribution("业主重大工程项目分布",productionMajorOwnerRows,147,"业主单位"),
    renderProductionMajorDistribution("股份参与科目数",productionMajorSubjectRows,69,"主科目类"),
    renderProductionMajorCompletion("子公司产值完成情况",companyCompletion),
    renderProductionMajorCompletion("业主产值完成情况",ownerCompletion),
    renderProductionMajorDistribution("股份参与项目数",productionMajorProjectRows,177,"主科目类")
  ].join(""));
}

function renderProductionMajorDashboardPreservingScroll(){
  renderWithPreservedScroll(renderProductionMajorDashboardPage,[".production-major-dashboard",".production-major-card","#listPage",".main"]);
}

function renderProductionOverviewMetricCard(title,value,items,type="blue"){
  const titleIcon=type==="warn"
    ? `<img class="production-overview-title-svg" src="./src/assets/production-risk-warning.svg" alt="风险预警"/>`
    : `<span class="production-overview-title-icon ${type}">▣</span>`;
  return `
    <section class="production-overview-card production-overview-metric-card ${type}">
      <div class="production-overview-card-title">
        ${titleIcon}
        <strong>${title}</strong>
        ${value?`<b>${value}</b>`:""}
      </div>
      <div class="production-overview-metric-list">
        ${items.map(item=>`
          <div>
            <strong>${item[0]}<em>个</em></strong>
            <span>${item[1]} ${item[2]?"ⓘ":""}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProductionOverviewRing(centerTop,centerValue,colorClass="blue"){
  const valueText=String(centerValue || "");
  const unitMatch=valueText.match(/^(.+?)(亿|个)$/);
  const valueHtml=unitMatch?`${unitMatch[1]}<em>${unitMatch[2]}</em>`:valueText;
  return `
    <div class="production-overview-ring ${colorClass}">
      <div><span>${centerTop}</span><strong>${valueHtml}</strong></div>
    </div>
  `;
}

function getProductionOverviewAnalysisData(type,mode){
  const label=type==="client"?"重点客户":"区域市场";
  if(mode==="progress"){
    return {
      ringLabel:"总节点",
      ringValue:type==="client"?"403个":"326个",
      projectCount:type==="client"?"95个":"103个",
      headers:[label,"项目数","计划里程碑","完成里程碑","完成进度"],
      rows:type==="client"
        ? [["上海久事","27","176个","149个","85%"],["上海机场","44","176个","135个","77%"],["上海申通","32","176个","134个","76%"]]
        : [["中原","27","142个","121个","85%"],["江苏","44","128个","99个","77%"],["浙江","32","156个","119个","76%"]]
    };
  }
  return {
    ringLabel:"总产值",
    ringValue:type==="client"?"403.1亿":"403.1亿",
    projectCount:type==="client"?"95个":"95个",
    headers:[label,"项目数","计划产值","完成产值","产值完成率"],
    rows:type==="client"
      ? [["上海久事","27","177.07亿","150.50亿","85%"],["上海机场","44","130.25亿","100.29亿","77%"],["上海申通","32","153.25亿","116.47亿","76%"]]
      : [["中原","27","177.07亿","177.07亿","85%"],["江苏","44","130.25亿","130.25亿","77%"],["浙江","32","153.25亿","153.25亿","76%"]]
  };
}

function renderProductionOverviewMiniTable(title,type="market"){
  const mode=type==="client"?productionOverviewClientMode:productionOverviewMarketMode;
  const data=getProductionOverviewAnalysisData(type,mode);
  return `
    <section class="production-overview-card production-overview-analysis-card">
      <div class="production-overview-panel-hd">
        <h3>${title}</h3>
        <div class="production-overview-switch">
          <button class="${mode==="value"?"active":""}" onclick="setProductionOverviewAnalysisMode('${type}','value')">产值</button>
          <button class="${mode==="progress"?"active":""}" onclick="setProductionOverviewAnalysisMode('${type}','progress')">进度</button>
          <select class="select"><option>2025年</option></select>
        </div>
      </div>
      <div class="production-overview-analysis-body">
        <div>
          ${renderProductionOverviewRing(data.ringLabel,data.ringValue)}
          <p>项目数 <b>${data.projectCount}</b></p>
        </div>
        <table>
          <thead><tr>${data.headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead>
          <tbody>${data.rows.map(row=>`<tr>${row.map((cell,index)=>`<td>${index===0?`<i></i>`:""}${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderProductionOverviewManageTip(){
  const items=[["72","%","基本信息<br>完成率"],["45","%","项目筹划<br>完成率"],["2","个","施工许可证<br>未上传项目"],["2","个","期初值未上报<br>项目"]];
  return `
    <section class="production-overview-card production-overview-manage-tip">
      <div class="production-overview-panel-hd"><h3><img class="production-overview-panel-title-svg" src="./src/assets/production-manage-tip.svg" alt="管理提示"/>管理提示</h3></div>
      <div class="production-overview-tip-list">
        ${items.map(item=>`<div><strong>${item[0]}<em>${item[1]}</em></strong><span>${item[2]}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function renderProductionOverviewCompletion(){
  const rows=[
    {company:"上海隧道",actual:2153002,target:3230000,plan:2856000},
    {company:"市政集团",actual:2153002,target:3230000,plan:2710000},
    {company:"上海路桥",actual:1153002,target:1930000,plan:1842000},
    {company:"城市环境",actual:2153002,target:2290000,plan:2218000},
    {company:"数字集团",actual:2153002,target:2290010,plan:2366000},
    {company:"运营集团",actual:253002,target:540040,plan:628000},
    {company:"城建设计",actual:393002,target:790550,plan:702600},
    {company:"上海能建",actual:453002,target:890230,plan:874200}
  ];
  const isPlan=productionOverviewCompletionMode==="plan";
  const denominatorKey=isPlan?"plan":"target";
  const denominatorTitle=isPlan?"年度计划值":"年度目标值";
  return `
    <section class="production-overview-card production-overview-completion">
      <div class="production-overview-panel-hd">
        <h3>当年产值/营收完成情况</h3>
        <div class="production-overview-switch"><button class="active">产值</button><button>营收</button><select class="select"><option>2025年</option></select></div>
      </div>
      <div class="production-overview-kpis">
        ${[["当年完成产值","70.53","亿元"],["当年预测产值","90.80","亿元"],["当年完成率","65.5","%"],["年度产值增量预测","90.80","亿元"]].map(x=>`<div><span>${x[0]} ⓘ</span><strong>${x[1]}<em>${x[2]}</em></strong></div>`).join("")}
      </div>
      <div class="production-overview-sub-hd">
        <b>各子公司产值完成情况</b>
        <span class="production-value-switch">
          <button class="${!isPlan?"active":""}" onclick="setProductionOverviewCompletionMode('actual')">实际完成</button>
          <button class="${isPlan?"active":""}" onclick="setProductionOverviewCompletionMode('plan')">全年计划</button>
        </span>
      </div>
      <table class="production-overview-progress-table production-overview-company-table">
        <thead><tr><th>公司名称</th><th>完成情况</th><th>实际完成</th><th>${denominatorTitle}</th></tr></thead>
        <tbody>${rows.map(row=>{
          const denominator=row[denominatorKey] || 0;
          const percent=denominator?row.actual/denominator*100:0;
          const status=percent>=70?"normal":percent>=50?"lag":percent>0?"danger":"none";
          return `
          <tr>
            <td>${row.company}</td>
            <td>
              <div class="production-progress-cell">
                <span><b class="${status}" style="width:${Math.min(100,Math.max(0,percent)).toFixed(2)}%"></b></span>
                <em>${percent.toFixed(1)}%</em>
              </div>
            </td>
            <td>${Number(row.actual).toLocaleString("zh-CN")} 万元</td>
            <td>${Number(denominator).toLocaleString("zh-CN")} 万元</td>
          </tr>
        `}).join("")}</tbody>
      </table>
      <div class="production-value-legend"><span><i class="normal"></i>正常</span><span><i class="danger"></i>严重滞后</span><span><i class="lag"></i>滞后</span><span><i class="none"></i>未完成</span></div>
    </section>
  `;
}

function renderProductionOverviewProgress(){
  return `
    <section class="production-overview-card production-overview-progress-panel">
      <div class="production-overview-panel-hd"><h3>生产进度情况</h3><select class="select"><option>2025年</option></select></div>
      <div class="production-overview-node-cards">
        <div class="active"><span>里程碑节点</span><b>计划 145</b></div>
        <div><span>重点管控里程碑节点</span><b>计划 145</b></div>
      </div>
      <div class="production-overview-progress-grid">
        <div>
          <h4>节点完成情况</h4>
          <div class="production-overview-donut-row">
            ${renderProductionOverviewRing("里程碑","145","red")}
            <ul><li>已完成 <b>25</b></li><li>未完成 <b>120</b></li><li>两周内完成 <b>11</b></li><li>其余待完成 <b>109</b></li></ul>
          </div>
        </div>
        <div>
          <h4>重点进度节点预警情况</h4>
          <div class="production-overview-alert-boxes"><div><b>黑色预警</b><strong>2<em>个</em></strong></div><div><b>红色预警</b><strong>2<em>个</em></strong></div></div>
        </div>
      </div>
    </section>
  `;
}

function renderProductionOverviewMaterial(){
  const rows=[["混凝土",93,"27,156 万方"],["钢材",81,"27,156 万吨"],["水泥",88,"27,156 万吨"],["钢管",29,"27,156 万米"],["光伏板",8,"27,156 万平"]];
  const isTrend=productionOverviewMaterialMode==="trend";
  return `
    <section class="production-overview-card production-overview-material">
      <div class="production-overview-panel-hd">
        <h3>主材情况</h3>
        <div class="production-overview-switch">
          <button class="${!isTrend?"active":""}" onclick="setProductionOverviewMaterialMode('stat')">统计</button>
          <button class="${isTrend?"active":""}" onclick="setProductionOverviewMaterialMode('trend')">趋势</button>
          <select class="select"><option>2025年</option></select>
        </div>
      </div>
      ${isTrend?renderProductionOverviewMaterialTrend(rows):`
        <table>
          <thead><tr><th>主材名称</th><th>实际领用占比 ⓘ</th><th>实际领用量</th><th>其中供应链采购</th><th>计划用量</th></tr></thead>
          <tbody>${rows.map(row=>`<tr><td>${row[0]}</td><td><div class="production-overview-material-bar"><span style="width:${row[1]}%">${row[1]}%</span></div></td><td>${row[2]}</td><td>${row[2]}</td><td>${row[2]}</td></tr>`).join("")}</tbody>
        </table>
      `}
    </section>
  `;
}

function getProductionOverviewMaterialTrendData(material){
  const currentSeries={
    "混凝土":[12,29,36,38,44,52,61,68,74,82,87],
    "钢材":[9,19,28,31,36,43,49,55,62,68,75],
    "水泥":[7,16,23,30,34,39,46,52,57,64,70],
    "钢管":[4,9,14,18,22,27,31,37,43,49,55],
    "光伏板":[2,5,9,13,17,22,28,34,40,47,53]
  }[material] || [12,29,36,38,44,52,61,68,74,82,87];
  const unitMap={"混凝土":"万方","钢材":"万吨","水泥":"万吨","钢管":"万米","光伏板":"万平"};
  return {
    currentSeries,
    supplySeries:currentSeries.map((value,index)=>Math.max(0,Math.round(value*.68-index%2*2))),
    unit:unitMap[material] || "万方"
  };
}

function getProductionOverviewMaterialTrendX(index){
  return 42+index*50;
}

function getProductionOverviewMaterialTooltipLeft(index){
  return Math.max(8,Math.min(64,(getProductionOverviewMaterialTrendX(index)/620)*100-8));
}

function setProductionOverviewMaterialTrendHover(index){
  const chart=document.querySelector(".production-material-chart");
  if(!chart)return;
  const material=chart.dataset.material || productionOverviewMaterialActive;
  const {currentSeries,supplySeries,unit}=getProductionOverviewMaterialTrendData(material);
  const safeIndex=Math.max(0,Math.min(currentSeries.length-1,Number(index)||0));
  const x=getProductionOverviewMaterialTrendX(safeIndex);
  const currentValue=currentSeries[safeIndex];
  const supplyValue=supplySeries[safeIndex];
  productionOverviewMaterialHoverIndex=safeIndex;
  chart.dataset.hoverIndex=String(safeIndex);
  chart.querySelector(".hover-line")?.setAttribute("x1",String(x));
  chart.querySelector(".hover-line")?.setAttribute("x2",String(x));
  const blueDot=chart.querySelector(".material-dot.blue");
  const orangeDot=chart.querySelector(".material-dot.orange");
  blueDot?.setAttribute("cx",String(x));
  blueDot?.setAttribute("cy",String((210-currentValue*1.65).toFixed(1)));
  orangeDot?.setAttribute("cx",String(x));
  orangeDot?.setAttribute("cy",String((210-supplyValue*1.65).toFixed(1)));
  const tooltip=chart.querySelector(".production-material-tooltip");
  if(tooltip){
    tooltip.style.left=`${getProductionOverviewMaterialTooltipLeft(safeIndex)}%`;
    tooltip.style.right="auto";
  }
  const month=chart.querySelector(".production-material-tooltip strong");
  const current=chart.querySelector("[data-production-material-current]");
  const supply=chart.querySelector("[data-production-material-supply]");
  if(month)month.textContent=`2025年${safeIndex+1}月`;
  if(current)current.textContent=`${currentValue} ${unit}`;
  if(supply)supply.textContent=`${supplyValue} ${unit}`;
}

function bindProductionOverviewMaterialTrendHover(){
  const chart=document.querySelector(".production-material-chart");
  if(!chart)return;
  chart.querySelectorAll("[data-production-material-index]").forEach(item=>{
    item.addEventListener("mouseenter",()=>setProductionOverviewMaterialTrendHover(item.dataset.productionMaterialIndex));
  });
}

function renderProductionOverviewMaterialTrend(rows){
  const materials=rows.map(row=>row[0]);
  const active=materials.includes(productionOverviewMaterialActive)?productionOverviewMaterialActive:materials[0];
  const {currentSeries,supplySeries,unit}=getProductionOverviewMaterialTrendData(active);
  const hoverIndex=Math.max(0,Math.min(currentSeries.length-1,productionOverviewMaterialHoverIndex));
  const toPoints=series=>series.map((value,index)=>{
    const x=getProductionOverviewMaterialTrendX(index);
    const y=210-value*1.65;
    return `${x},${y.toFixed(1)}`;
  }).join(" ");
  const hoverX=getProductionOverviewMaterialTrendX(hoverIndex);
  const currentValue=currentSeries[hoverIndex];
  const supplyValue=supplySeries[hoverIndex];
  return `
    <div class="production-material-trend">
      <div class="production-material-tabs">
        ${materials.map(name=>`<button class="${name===active?"active":""}" onclick="setProductionOverviewMaterialActive('${name}')">${name}</button>`).join("")}
      </div>
      <div class="production-material-chart" title="${active}" data-material="${active}" data-hover-index="${hoverIndex}">
        <div class="production-material-max">${Math.max(...currentSeries)+5}${unit}</div>
        <svg viewBox="0 0 620 252" preserveAspectRatio="none" aria-label="${active}趋势图">
          <defs>
            <linearGradient id="materialSupplyFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#FF7A45" stop-opacity=".24"/>
              <stop offset="1" stop-color="#FF7A45" stop-opacity="0"/>
            </linearGradient>
          </defs>
          ${[0,1,2,3,4].map(i=>`<line x1="42" y1="${30+i*42}" x2="542" y2="${30+i*42}" class="grid"/>`).join("")}
          <polyline class="material-line blue" points="${toPoints(currentSeries)}"/>
          <polyline class="material-line orange" points="${toPoints(supplySeries)}"/>
          <polygon class="material-area" points="42,210 ${toPoints(supplySeries)} 542,210"/>
          <line class="hover-line" x1="${hoverX}" y1="30" x2="${hoverX}" y2="210"/>
          <circle class="material-dot blue" cx="${hoverX}" cy="${(210-currentValue*1.65).toFixed(1)}" r="5"/>
          <circle class="material-dot orange" cx="${hoverX}" cy="${(210-supplyValue*1.65).toFixed(1)}" r="5"/>
          ${currentSeries.map((_,index)=>`<rect class="production-material-hit" data-production-material-index="${index}" x="${getProductionOverviewMaterialTrendX(index)-25}" y="24" width="50" height="190"/>`).join("")}
        </svg>
        <div class="production-material-y-axis"><span>100万方</span><span>80万方</span><span>60万方</span><span>40万方</span><span>20万方</span><span>0万方</span></div>
        <div class="production-material-x-axis"><span>1月</span><span>3月</span><span>5月</span><span>7月</span><span>9月</span><span>11月</span></div>
        <div class="production-material-tooltip" style="left:${getProductionOverviewMaterialTooltipLeft(hoverIndex)}%;right:auto">
          <strong>2025年${hoverIndex+1}月</strong>
          <p><i class="blue"></i>开累领用量 <b data-production-material-current>${currentValue} ${unit}</b></p>
          <p><i class="orange"></i>其中供应链采购 <b data-production-material-supply>${supplyValue} ${unit}</b></p>
        </div>
        <div class="production-material-legend"><span><i class="blue"></i>开累领用量</span><span><i class="orange"></i>其中供应链采购</span></div>
      </div>
    </div>
  `;
}

function renderProductionOverviewRisk(){
  return `
    <section class="production-overview-card production-overview-risk">
      <div class="production-overview-panel-hd"><h3>生产风险情况</h3><label><input type="checkbox" checked> 仅统计年度风险管控清单</label><select class="select"><option>2025年</option></select></div>
      <div class="production-overview-risk-levels">
        ${[["I 级风险","2"],["II级风险","6"],["III级风险","8"]].map((item,index)=>`
          <div>
            <h4>${item[0]}</h4><strong>${item[1]}<em>个</em><span>未完成</span></strong>
            <p><i></i>已完成 <b>${index}</b>个</p><p><i class="orange"></i>未来两周进入 <b>${index===1?0:index+1}</b>个</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProductionOverviewDeviceLowCarbon(){
  const currentDevice=productionOverviewDeviceData.current;
  const monitorDevice=productionOverviewDeviceData.monitor;
  const deviceData=productionOverviewDeviceData[productionOverviewDeviceMode] || currentDevice;
  const maxValue=Math.max(...deviceData.bars.map(item=>item.value),1);
  return `
    <div class="production-overview-side-bottom">
      <section class="production-overview-card production-overview-device">
        <div class="production-overview-panel-hd"><h3>设备情况</h3></div>
        <div class="production-overview-device-kpis">
          <button class="${productionOverviewDeviceMode==="current"?"active":""}" onclick="setProductionOverviewDeviceMode('current')">当前在场设备<b>${currentDevice.total}台</b></button>
          <button class="${productionOverviewDeviceMode==="monitor"?"active":""}" onclick="setProductionOverviewDeviceMode('monitor')">运行监测<b>${monitorDevice.total}台</b></button>
        </div>
        <h4>${deviceData.label}分析</h4>
        <div class="production-overview-device-bars">
          ${deviceData.bars.map(item=>`
            <div title="${item.group}">
              <span style="height:${Math.max(18,item.value/maxValue*100).toFixed(1)}%"></span>
              <b>${item.value}</b>
              <em>${item.name}</em>
            </div>
          `).join("")}
        </div>
      </section>
      <section class="production-overview-card production-overview-carbon">
        <div class="production-overview-panel-hd"><h3>低碳管理 ⓘ</h3><div class="production-overview-switch"><button class="active">年度</button><button>累计</button></div></div>
        <p>合规处置率 <b>71%</b>，资源化率 <b class="blue">14%</b></p>
        <div class="production-overview-carbon-kpis"><div>实际外运量<span>待接入</span></div><div class="active">申报后处置量<strong>65.5<em>万吨</em></strong></div><div>资源化总量<span>待接入</span></div></div>
        <h4>项目处置类型分析</h4>
        <div class="production-overview-carbon-bottom">${renderProductionOverviewRing("项目数","212","orange")}<ul><li>工程渣土 <b>114 | 22.4万吨</b></li><li>工程泥浆(含干化) <b>51 | 12.4万吨</b></li><li>废弃混凝土 <b>48 | 12.3万吨</b></li></ul></div>
      </section>
    </div>
  `;
}

function renderProductionOverviewDashboardPreservingScroll(){
  renderWithPreservedScroll(renderProductionOverviewDashboardPage,[".production-overview-dashboard","#listPage",".main"]);
}

async function renderProductionOverviewDashboardPage(){
  detailPage.style.display="none";
  const projectItems=[["3264","待建"],["772","在建"],["287","停工",true],["288","完工"],["81","竣工"],["1","当年开工"],["3","当年完工",true],["1","当年竣工",true],["1","结算中"],["3","当年结算"],["97","历年结算"],["21","获奖项目"]];
  const warnItems=[["2","延期项目",true],["2","进度预警项目",true],["2","风险项目",true],["2","险情/事故项目",true]];
  const mounted=await mountProductionDashboardTemplate("overview","block");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(productionDashboardSlot("header"),renderProductionScreenHeader("生产总览"));
  replaceProductionDashboardFragment(productionDashboardSlot("top-grid"),[
    renderProductionOverviewMetricCard("项目总数","4692",projectItems),
    renderProductionOverviewMetricCard("风险预警","",warnItems,"warn")
  ].join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("row-analysis"),[
    renderProductionOverviewMiniTable("区域市场经营分析","market"),
    renderProductionOverviewMiniTable("重点客户经营分析","client"),
    renderProductionOverviewManageTip()
  ].join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("completion"),renderProductionOverviewCompletion());
  replaceProductionDashboardFragment(productionDashboardSlot("middle"),[
    renderProductionOverviewProgress(),
    renderProductionOverviewRisk()
  ].join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("right"),[
    renderProductionOverviewMaterial(),
    renderProductionOverviewDeviceLowCarbon()
  ].join(""));
  bindProductionOverviewMaterialTrendHover();
}

function renderProductionValueMetric(label,value,unit,icon,extra=""){
  const isImageIcon=String(icon).endsWith(".svg");
  const iconHtml=isImageIcon?`<img src="${icon}" alt=""/>`:icon;
  return `
    <div class="production-value-metric">
      <span class="production-value-icon ${isImageIcon?"image":""}">${iconHtml}</span>
      <div>
        <p>${label}</p>
        <strong>${value}<em>${unit}</em></strong>
        ${extra?`<small>${extra}</small>`:""}
      </div>
    </div>
  `;
}

function renderProductionValueMiniKpis(items){
  return `
    <div class="production-value-mini-kpis">
      ${items.map(item=>`
        <div>
          <span class="production-value-icon small ${String(item[3]).endsWith(".svg")?"image":""}">${String(item[3]).endsWith(".svg")?`<img src="${item[3]}" alt=""/>`:item[3]}</span>
          <p>${item[0]}</p>
          <strong>${item[1]}<em>${item[2]}</em></strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProductionValueProjectCard(title,items){
  return `
    <article class="production-value-project-card">
      <h3>${title}</h3>
      ${items.map(item=>`
        <div>
          <span>${item[0]}</span>
          <strong>${item[1]}</strong>
        </div>
      `).join("")}
    </article>
  `;
}

function renderProductionValueMainSummaryCard(item){
  const isImageIcon=String(item.icon).endsWith(".svg");
  return `
    <div class="production-value-main-summary-card">
      <span class="production-value-icon ${isImageIcon?"image":""}">${isImageIcon?`<img src="${item.icon}" alt=""/>`:item.icon}</span>
      <div>
        <p>${item.label}</p>
        <strong>${item.value}<em>${item.unit}</em></strong>
      </div>
    </div>
  `;
}

function renderProductionValueMainCategoryCard(category){
  return `
    <article class="production-value-main-category ${category.type}">
      <h3><i></i>${category.title}</h3>
      <div class="production-value-main-category-grid">
        ${category.metrics.map(metric=>`
          <div class="production-value-main-category-metric">
            <span>${metric.label}</span>
            <strong>${metric.value}<em>${metric.unit}</em></strong>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderProductionValueMainMatrixRow(row){
  return `
    <div class="production-value-main-row">
      <div class="production-value-main-row-label">${row.name}</div>
      <div class="production-value-main-categories">
        ${row.categories.map(renderProductionValueMainCategoryCard).join("")}
      </div>
    </div>
  `;
}

function getProductionValueBizDataKey(tab=productionValueBizActive){
  const subTabs=productionValueBizSubTabs[tab];
  if(!subTabs)return tab;
  const activeSub=productionValueBizSubActive[tab] || subTabs[0];
  return `${tab}【${activeSub}】`;
}

function renderProductionValueBizTabLabel(tab){
  return `<span class="biz-single">${tab}</span>`;
}

function renderProductionValueBizPanel(){
  const isBizPanel=productionValueBizPanelActive==="六大业态产值";
  const dataKey=getProductionValueBizDataKey();
  const values=isBizPanel
    ? (productionValueBizData[dataKey] || productionValueBizData[productionValueBizTabs[0]])
    : productionValueOrderForecastData;
  const cards=[
    ["年度计划产值总额",values[0],"万元","¥"],
    ["年度累计已完成产值",values[1],"万元","✓"],
    ["产值完成率",values[2],"","◔"],
    ["剩余合同产值",values[3],"万元","♟"]
  ];
  const activeSubTabs=isBizPanel ? productionValueBizSubTabs[productionValueBizActive] : null;
  return `
    <section class="production-value-panel biz-output ${isBizPanel?"":"order-forecast"}">
      <div class="production-value-biz-panel-tabs">
        ${["六大业态产值","订单项目预测产值"].map(tab=>`
          <button class="${productionValueBizPanelActive===tab?"active":""}" onclick="setProductionValueBizPanel('${tab}')">${tab}</button>
        `).join("")}
      </div>
      ${isBizPanel?`
        <div class="production-value-biz-tabs">
          ${productionValueBizTabs.map(tab=>`
            <button title="${escapeAttr(tab)}" class="${tab===productionValueBizActive?"active":""}" onclick="setProductionValueBizTab('${tab}')">${renderProductionValueBizTabLabel(tab)}</button>
          `).join("")}
        </div>
        ${activeSubTabs?`
          <div class="production-value-biz-sub-tabs">
            ${activeSubTabs.map(tab=>`
              <button class="${tab===(productionValueBizSubActive[productionValueBizActive] || activeSubTabs[0])?"active":""}" onclick="setProductionValueBizSubTab('${productionValueBizActive}','${tab}')">${tab}</button>
            `).join("")}
          </div>
        `:""}
      `:""}
      <div class="production-value-biz-card-grid">
        ${cards.map(card=>`
          <div class="production-value-biz-card">
            <span class="production-value-icon small">${card[3]}</span>
            <div>
              <p>${card[0]} <i>ⓘ</i></p>
              <strong>${card[1]}${card[2]?`<em>${card[2]}</em>`:""}</strong>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function formatProductionValueAmount(value){
  return `${Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2})}万元`;
}

function formatProductionValueAxis(value){
  const num=Number(value||0);
  if(num>=10000)return `${(num/10000).toFixed(num%10000===0?0:1)}万`;
  if(num>=1000)return `${Math.round(num/100)/10}k`;
  return `${num}`;
}

function formatProductionValuePlain(value,digits=2){
  return Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:digits,maximumFractionDigits:digits});
}

function getProductionLinePoints(rows,valueKey,maxValue){
  const total=Math.max(rows.length,1);
  return rows.map((row,index)=>{
    const x=((index+.5)/total*100).toFixed(2);
    const y=(100-Math.min(100,Number(row[valueKey]||0)/maxValue*100)).toFixed(2);
    return `${x},${y}`;
  }).join(" ");
}

function renderProductionDualAxisShell({rows,projectMax,valueMax,lineKey,groupsHtml,legendHtml}){
  const projectTicks=[projectMax,projectMax*.75,projectMax*.5,projectMax*.25,0];
  const valueTicks=[valueMax,valueMax*.75,valueMax*.5,valueMax*.25,0];
  return `
    <div class="production-dual-chart" style="--group-count:${rows.length}">
      <div class="production-dual-axis left">
        <strong>项目数量</strong>
        ${projectTicks.map(v=>`<span>${Math.round(v)}</span>`).join("")}
      </div>
      <div class="production-dual-plot">
        <div class="production-dual-grid"></div>
        <svg class="production-dual-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${getProductionLinePoints(rows,lineKey,valueMax)}"></polyline>
          ${rows.map((row,index)=>{
            const x=((index+.5)/rows.length*100).toFixed(2);
            const y=(100-Math.min(100,Number(row[lineKey]||0)/valueMax*100)).toFixed(2);
            return `<circle cx="${x}" cy="${y}" r="3"></circle>`;
          }).join("")}
        </svg>
        <div class="production-dual-groups">
          ${groupsHtml}
        </div>
      </div>
      <div class="production-dual-axis right">
        <strong>产值(万元)</strong>
        ${valueTicks.map(v=>`<span>${formatProductionValueAxis(v)}</span>`).join("")}
      </div>
    </div>
    ${legendHtml}
  `;
}

function renderProductionValueCompanyTable(){
  const rows=[
    {company:"上海隧道",actual:151417.30,target:2200000.00,plan:1307975.59},
    {company:"市政集团",actual:173125.60,target:1200000.00,plan:1240805.41},
    {company:"上海路桥",actual:35496.99,target:1100000.00,plan:348930.33},
    {company:"城市环境",actual:42860.22,target:780000.00,plan:580260.00},
    {company:"城建国际",actual:0.00,target:600000.00,plan:355309.72},
    {company:"城建设计",actual:9300.31,target:330000.00,plan:187067.19},
    {company:"上海能建",actual:26800.00,target:520000.00,plan:486280.80},
    {company:"城建物资",actual:18620.45,target:410000.00,plan:329650.20},
    {company:"运营集团",actual:32500.60,target:680000.00,plan:468920.55}
  ];
  const isPlan=productionValueCompanyMode==="plan";
  const denominatorKey=isPlan?"plan":"target";
  const denominatorTitle=isPlan?"年度计划值":"年度目标值";
  return `
    <section class="production-value-panel company-table">
      <div class="production-value-panel-hd">
        <h2>各公司产值完成情况</h2>
        <div class="production-value-switch">
          <button class="${!isPlan?"active":""}" onclick="setProductionValueCompanyMode('actual')">实际完成</button>
          <button class="${isPlan?"active":""}" onclick="setProductionValueCompanyMode('plan')">全年计划</button>
        </div>
      </div>
      <table>
        <thead><tr><th>公司名称</th><th>完成情况</th><th>实际完成</th><th>${denominatorTitle}</th></tr></thead>
        <tbody>
          ${rows.map(row=>{
            const denominator=row[denominatorKey];
            const percent=denominator?row.actual/denominator*100:0;
            const status=percent>=10?"normal":percent>0?"lag":"none";
            return `
            <tr>
              <td>${row.company}</td>
              <td>
                <div class="production-progress-cell">
                  <span><b class="${status}" style="width:${Math.min(100,Math.max(0,percent)).toFixed(2)}%"></b></span><em>${percent.toFixed(2)}%</em>
                </div>
              </td>
              <td>${formatProductionValueAmount(row.actual)}</td>
              <td>${formatProductionValueAmount(denominator)}</td>
            </tr>
          `}).join("")}
        </tbody>
      </table>
      <div class="production-value-legend"><span><i class="normal"></i>进度正常</span><span><i class="danger"></i>严重滞后</span><span><i class="lag"></i>滞后</span><span><i class="none"></i>未完成</span></div>
    </section>
  `;
}

function renderProductionValueReportChart(){
  const rows=[
    {company:"上海隧道",reported:94,unreported:64,value:5200},
    {company:"市政集团",reported:72,unreported:64,value:6100},
    {company:"上海路桥",reported:35,unreported:52,value:4900},
    {company:"城市环境",reported:8,unreported:27,value:4800},
    {company:"上海能建",reported:44,unreported:43,value:5000},
    {company:"城建物资",reported:28,unreported:18,value:5600},
    {company:"城建设计",reported:3,unreported:18,value:6000},
    {company:"城建国际",reported:22,unreported:13,value:5200},
    {company:"数字集团",reported:7,unreported:13,value:2100},
    {company:"运营集团",reported:30,unreported:13,value:2400}
  ];
  const projectMax=100;
  const valueMax=10000;
  const groupsHtml=rows.map(row=>`
    <div class="production-dual-group" tabindex="0">
      <div class="production-chart-tooltip">
        <h4>${row.company}</h4>
        <p><i class="reported"></i><span>已上报项目数</span><b>${row.reported}</b></p>
        <p><i class="unreported"></i><span>未上报项目数</span><b>${row.unreported}</b></p>
        <p><i class="line"></i><span>已上报产值</span><b>${formatProductionValuePlain(row.value,0)}万元</b></p>
      </div>
      <div class="production-dual-bars">
        <span class="reported" style="height:${Math.max(2,row.reported/projectMax*100)}%"></span>
        <span class="unreported" style="height:${Math.max(2,row.unreported/projectMax*100)}%"></span>
      </div>
      <em>${row.company}</em>
    </div>
  `).join("");
  return `
    <section class="production-value-panel chart-panel">
      <div class="production-value-panel-hd">
        <h2>实际产值上报情况</h2>
      </div>
      ${renderProductionDualAxisShell({
        rows,
        projectMax,
        valueMax,
        lineKey:"value",
        groupsHtml,
        legendHtml:`<div class="production-value-legend"><span><i class="reported"></i>已上报项目数</span><span><i class="unreported"></i>未上报项目数</span><span><i class="line"></i>已上报产值</span></div>`
      })}
    </section>
  `;
}

function renderProductionValueMonthlyChart(){
  const months=[
    {month:"2026年2月",newCount:8,carryCount:70,doneCount:0,newValue:960.40,carryValue:26800.00,doneValue:0.00},
    {month:"2026年3月",newCount:12,carryCount:92,doneCount:0,newValue:1480.75,carryValue:40250.60,doneValue:0.00},
    {month:"2026年4月",newCount:16,carryCount:282,doneCount:1,newValue:1898.90,carryValue:85210.80,doneValue:120.00},
    {month:"2026年5月",newCount:20,carryCount:189,doneCount:1,newValue:2995.25,carryValue:90248.18,doneValue:0.00},
    {month:"2026年6月",newCount:10,carryCount:188,doneCount:0,newValue:1880.65,carryValue:70200.36,doneValue:0.00},
    {month:"2026年7月",newCount:6,carryCount:86,doneCount:0,newValue:760.25,carryValue:30680.20,doneValue:0.00}
  ];
  const rows=months.map(item=>{
    const value=item.newValue+item.carryValue+item.doneValue;
    const count=item.newCount+item.carryCount+item.doneCount;
    return {...item,value,count};
  });
  const projectMax=300;
  const valueMax=100000;
  const groupsHtml=rows.map(row=>{
    const totalValue=row.value || 1;
    return `
      <div class="production-dual-group monthly" tabindex="0">
        <div class="production-chart-tooltip wide">
          <h4>${row.month}</h4>
          <p><i class="new"></i><span>新接项目</span><b>${row.newCount}</b><em>${formatProductionValuePlain(row.newValue)}万元</em><strong>${(row.newValue/totalValue*100).toFixed(2)}%</strong></p>
          <p><i class="carry"></i><span>转接项目</span><b>${row.carryCount}</b><em>${formatProductionValuePlain(row.carryValue)}万元</em><strong>${(row.carryValue/totalValue*100).toFixed(2)}%</strong></p>
          <p><i class="done"></i><span>完工未结算项目</span><b>${row.doneCount}</b><em>${formatProductionValuePlain(row.doneValue)}万元</em><strong>${(row.doneValue/totalValue*100).toFixed(2)}%</strong></p>
        </div>
        <div class="production-dual-bars monthly">
          <span class="new" style="height:${Math.max(2,row.newCount/projectMax*100)}%"></span>
          <span class="carry" style="height:${Math.max(2,row.carryCount/projectMax*100)}%"></span>
          <span class="done" style="height:${Math.max(2,row.doneCount/projectMax*100)}%"></span>
        </div>
        <em>${row.month}</em>
      </div>
    `;
  }).join("");
  return `
    <section class="production-value-panel chart-panel">
      <div class="production-value-panel-hd"><h2>产值月度统计</h2></div>
      ${renderProductionDualAxisShell({
        rows,
        projectMax,
        valueMax,
        lineKey:"value",
        groupsHtml,
        legendHtml:`<div class="production-value-legend"><span><i class="new"></i>新接项目</span><span><i class="carry"></i>转接项目</span><span><i class="done"></i>完工未结算项目</span><span><i class="line"></i>已上报产值</span></div>`
      })}
    </section>
  `;
}

async function renderProductionValueDashboardPage(){
  detailPage.style.display="none";
  const isAll=productionValueOrgActive==="全部";
  const topStats=[
    ["年度目标产值","4,349,038.13","万元","./src/assets/production-value/top-plan-total.svg"],
    ["年度累计已完成产值",isAll?"566,416.19":"151,417.30","万元","./src/assets/production-value/top-completed-contract.svg"],
    ["剩余合同产值","52,733,458.84","万元","./src/assets/production-value/top-completed-contract.svg"],
    ["产值完成率",isAll?"13.02":"6.88","%","./src/assets/production-value/top-progress.svg"]
  ];
  const mainItems=[
    {label:"年度计划产值总额",value:"4,349,038.13",unit:"万元",icon:"./src/assets/production-value/main-plan-total.svg"},
    {label:"年度累计已完成产值",value:isAll?"401,192.61":"151,417.30",unit:"万元",icon:"./src/assets/production-value/main-completed.svg"},
    {label:"产值完成率",value:isAll?"9.22":"6.88",unit:"%",icon:"./src/assets/production-value/main-rate.svg"},
    {label:"剩余合同产值",value:"52,208,882.36",unit:"万元",icon:"./src/assets/production-value/main-contract.svg"}
  ];
  const constructionMainRows=[
    {
      name:"总承包",
      categories:[
        {type:"new",title:"新接",metrics:[
          {label:"年度计划产值总额",value:"623,649.45",unit:"万元"},
          {label:"年度累计已完成产值",value:"41,952.85",unit:"万元"},
          {label:"产值完成率",value:"6.73",unit:"%"},
          {label:"剩余合同产值",value:"6,125,500.04",unit:"万元"}
        ]},
        {type:"carry",title:"转接",metrics:[
          {label:"年度计划产值总额",value:"1,927,643.74",unit:"万元"},
          {label:"年度累计已完成产值",value:"204,520.13",unit:"万元"},
          {label:"产值完成率",value:"10.61",unit:"%"},
          {label:"剩余合同产值",value:"24,502,000.15",unit:"万元"}
        ]},
        {type:"done",title:"完工未结算",metrics:[
          {label:"年度计划产值总额",value:"283,477.02",unit:"万元"},
          {label:"年度累计已完成产值",value:"15,732.32",unit:"万元"},
          {label:"产值完成率",value:"5.55",unit:"%"},
          {label:"剩余合同产值",value:"3,403,055.57",unit:"万元"}
        ]}
      ]
    },
    {
      name:"管线",
      categories:[
        {type:"new",title:"新接",metrics:[
          {label:"年度计划产值总额",value:"105,441.44",unit:"万元"},
          {label:"年度累计已完成产值",value:"7,354.71",unit:"万元"},
          {label:"产值完成率",value:"6.98",unit:"%"},
          {label:"剩余合同产值",value:"1,384,460.51",unit:"万元"}
        ]},
        {type:"carry",title:"转接",metrics:[
          {label:"年度计划产值总额",value:"197,702.70",unit:"万元"},
          {label:"年度累计已完成产值",value:"21,451.25",unit:"万元"},
          {label:"产值完成率",value:"10.85",unit:"%"},
          {label:"剩余合同产值",value:"2,175,580.81",unit:"万元"}
        ]},
        {type:"done",title:"完工未结算",metrics:[
          {label:"年度计划产值总额",value:"26,360.36",unit:"万元"},
          {label:"年度累计已完成产值",value:"1,838.68",unit:"万元"},
          {label:"产值完成率",value:"6.98",unit:"%"},
          {label:"剩余合同产值",value:"395,560.15",unit:"万元"}
        ]}
      ]
    }
  ];
  const mounted=await mountProductionDashboardTemplate("value","block");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(productionDashboardSlot("header"),renderProductionScreenHeader("产值看板"));
  replaceProductionDashboardFragment(productionDashboardSlot("org-tabs"),productionValueOrgs.map(org=>`<button class="${org===productionValueOrgActive?"active":""}" onclick="setProductionValueOrg('${org}')">${org}</button>`).join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("top"),topStats.map(item=>renderProductionValueMetric(...item)).join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("main-summary"),mainItems.map(renderProductionValueMainSummaryCard).join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("main-matrix"),constructionMainRows.map(renderProductionValueMainMatrixRow).join(""));
  replaceProductionDashboardFragment(productionDashboardSlot("right"),renderProductionValueBizPanel());
  replaceProductionDashboardFragment(productionDashboardSlot("bottom"),[
    renderProductionValueCompanyTable(),
    renderProductionValueReportChart(),
    renderProductionValueMonthlyChart()
  ].join(""));
}

function renderProductionValueDashboardPreservingScroll(){
  renderWithPreservedScroll(renderProductionValueDashboardPage,[".production-value-dashboard",".production-value-panel.company-table table","#listPage",".main"]);
}

async function renderBusinessModulePage(line,name){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const iconMap={home:"🏠",production:"🏗️",safety:"🛡️",economy:"💰",operation:"📁",base:"🔐"};
  const mounted=await mountProductionDashboardTemplate("placeholder","flex");
  if(mounted.stale)return;
  const icon=iconMap[line] || "📄";
  const desc="当前模块页面待扩展。";
  const title=document.querySelector("[data-placeholder-title]");
  const iconNode=document.querySelector("[data-placeholder-icon]");
  const nameNode=document.querySelector("[data-placeholder-name]");
  const descNode=document.querySelector("[data-placeholder-desc]");
  if(title)title.textContent=name;
  if(iconNode)iconNode.textContent=icon;
  if(nameNode)nameNode.textContent=name;
  if(descNode)descNode.textContent=desc;
}

const componentDemoOptions=[
  {label:"风险管控清单",value:"risk"},
  {label:"消息模板",value:"template"},
  {label:"发送记录",value:"send"},
  {label:"消息记录",value:"record"},
  {label:"禁用选项",value:"disabled",disabled:true}
];
const componentDemoMultiOptions=[
  {label:"I级风险",value:"level1"},
  {label:"II级风险",value:"level2"},
  {label:"III级风险",value:"level3"},
  {label:"起重吊装",value:"lifting"},
  {label:"深基坑开挖",value:"pit"},
  {label:"承重支模架",value:"support"},
  {label:"禁用选项",value:"disabled",disabled:true}
];
const componentDemoState={
  selectValue:"risk",
  disabledValue:"template",
  multiValues:["level1","pit"],
  selectKeyword:"",
  multiKeyword:"",
  activeSelectIndex:0,
  activeMultiIndex:0
};

async function renderComponentDemoPage(){
  detailPage.style.display="none";
  const mounted=await mountProductionDashboardTemplate("component-demo","block");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(productionDashboardSlot("demo-select"),renderDemoBaseSelect("demoBaseSelect",componentDemoOptions,componentDemoState.selectValue,"请选择模块",false,componentDemoState.selectKeyword));
  replaceProductionDashboardFragment(productionDashboardSlot("demo-disabled-select"),renderDemoBaseSelect("demoDisabledSelect",componentDemoOptions,componentDemoState.disabledValue,"请选择模块",true,""));
  replaceProductionDashboardFragment(productionDashboardSlot("demo-multi-select"),renderDemoBaseMultiSelect("demoBaseMultiSelect",componentDemoMultiOptions,componentDemoState.multiValues,"请选择风险类型",componentDemoState.multiKeyword));
  const result=document.querySelector("[data-production-demo-result]");
  if(result)result.textContent=JSON.stringify({BaseSelect:componentDemoState.selectValue,BaseMultiSelect:componentDemoState.multiValues},null,2);
}

function getDemoFilteredOptions(options,keyword){
  return options.filter(x=>!keyword||x.label.includes(keyword));
}
function renderDemoBaseSelect(id,options,value,placeholder,disabled=false,keyword=""){
  const selected=options.find(x=>x.value===value);
  const list=getDemoFilteredOptions(options,keyword);
  return `
    <div id="${id}" class="base-select demo-base-select ${disabled?"is-disabled":""}" data-value="${value||""}">
      <div class="base-select__control" tabindex="${disabled?-1:0}" role="combobox" aria-expanded="false" aria-disabled="${disabled}" onclick="toggleDemoSelect('${id}')">
        <input class="base-select__input" value="${keyword || selected?.label || ""}" placeholder="${selected?.label || placeholder}" ${disabled?"disabled":""} oninput="filterDemoSelect('${id}',this.value)" onkeydown="handleDemoSelectKey(event,'${id}')"/>
        <span class="base-select__arrow">⌄</span>
      </div>
      <div class="base-select__dropdown" role="listbox" style="display:none">
        ${list.map((option,index)=>`
          <div class="base-select__option ${index===componentDemoState.activeSelectIndex?"is-hovered":""} ${option.value===value?"is-selected":""} ${option.disabled?"is-disabled":""}" role="option" data-index="${index}" onclick="selectDemoOption('${id}','${option.value}')">
            <span class="base-select__label">${option.label}</span>
          </div>
        `).join("") || `<div class="base-select__empty">暂无数据</div>`}
      </div>
    </div>
  `;
}
function renderDemoBaseMultiSelect(id,options,values,placeholder,keyword=""){
  const selected=options.filter(x=>values.includes(x.value));
  const list=getDemoFilteredOptions(options,keyword);
  return `
    <div id="${id}" class="base-multi-select demo-base-multi-select" data-values="${values.join(",")}">
      <div class="base-multi-select__control" tabindex="0" role="combobox" aria-expanded="false" onclick="toggleDemoMultiSelect('${id}')">
        <div class="base-multi-select__tags">
          ${selected.map(option=>`
            <span class="base-multi-select__tag">
              <span class="base-multi-select__tag-text">${option.label}</span>
              <button class="base-multi-select__tag-remove" type="button" onclick="removeDemoMultiTag(event,'${option.value}')">×</button>
            </span>
          `).join("")}
          <input class="base-multi-select__input" value="${keyword||""}" placeholder="${selected.length?"":placeholder}" oninput="filterDemoMultiSelect(this.value)" onkeydown="handleDemoMultiKey(event)"/>
        </div>
        <span class="base-multi-select__arrow">⌄</span>
      </div>
      <div class="base-multi-select__dropdown" role="listbox" aria-multiselectable="true" style="display:none">
        <div class="base-multi-select__actions">
          <div class="base-multi-select__action" onclick="selectAllDemoMulti()">全选</div>
          <div class="base-multi-select__action" onclick="clearDemoMulti()">清空</div>
        </div>
        ${list.map((option,index)=>`
          <div class="base-multi-select__option ${index===componentDemoState.activeMultiIndex?"is-hovered":""} ${values.includes(option.value)?"is-selected":""} ${option.disabled?"is-disabled":""}" role="option" data-index="${index}" onclick="toggleDemoMultiOption('${option.value}')">
            <span class="base-multi-select__checkbox"></span>
            <span class="base-multi-select__label">${option.label}</span>
          </div>
        `).join("") || `<div class="base-multi-select__empty">暂无数据</div>`}
      </div>
    </div>
  `;
}
function closeDemoDropdowns(exceptId){
  document.querySelectorAll(".demo-base-select,.demo-base-multi-select").forEach(box=>{
    if(box.id!==exceptId){
      box.classList.remove("is-open");
      const dropdown=box.querySelector(".base-select__dropdown,.base-multi-select__dropdown");
      if(dropdown)dropdown.style.display="none";
    }
  });
}
function openDemoDropdown(id){
  const box=document.getElementById(id);
  if(!box||box.classList.contains("is-disabled"))return;
  closeDemoDropdowns(id);
  box.classList.add("is-open");
  const dropdown=box.querySelector(".base-select__dropdown,.base-multi-select__dropdown");
  if(dropdown)dropdown.style.display="block";
}
function toggleDemoSelect(id){
  const box=document.getElementById(id);
  if(!box||box.classList.contains("is-disabled"))return;
  box.classList.contains("is-open")?closeDemoDropdowns():openDemoDropdown(id);
}
function toggleDemoMultiSelect(id){
  const box=document.getElementById(id);
  box?.classList.contains("is-open")?closeDemoDropdowns():openDemoDropdown(id);
}
function filterDemoSelect(id,value){
  componentDemoState.selectKeyword=value;
  componentDemoState.activeSelectIndex=0;
  renderComponentDemoPage();
  openDemoDropdown(id);
}
function selectDemoOption(id,value){
  const option=componentDemoOptions.find(x=>x.value===value);
  if(!option||option.disabled)return;
  componentDemoState.selectValue=value;
  componentDemoState.selectKeyword="";
  renderComponentDemoPage();
}
function handleDemoSelectKey(event,id){
  const list=getDemoFilteredOptions(componentDemoOptions,componentDemoState.selectKeyword);
  if(event.key==="ArrowDown"){event.preventDefault();componentDemoState.activeSelectIndex=Math.min(list.length-1,componentDemoState.activeSelectIndex+1);renderComponentDemoPage();openDemoDropdown(id);}
  if(event.key==="ArrowUp"){event.preventDefault();componentDemoState.activeSelectIndex=Math.max(0,componentDemoState.activeSelectIndex-1);renderComponentDemoPage();openDemoDropdown(id);}
  if(event.key==="Enter"){event.preventDefault();selectDemoOption(id,list[componentDemoState.activeSelectIndex]?.value);}
  if(event.key==="Escape")closeDemoDropdowns();
}
function filterDemoMultiSelect(value){
  componentDemoState.multiKeyword=value;
  componentDemoState.activeMultiIndex=0;
  renderComponentDemoPage();
  openDemoDropdown("demoBaseMultiSelect");
}
function toggleDemoMultiOption(value){
  const option=componentDemoMultiOptions.find(x=>x.value===value);
  if(!option||option.disabled)return;
  const i=componentDemoState.multiValues.indexOf(value);
  if(i>=0)componentDemoState.multiValues.splice(i,1);
  else componentDemoState.multiValues.push(value);
  renderComponentDemoPage();
  openDemoDropdown("demoBaseMultiSelect");
}
function removeDemoMultiTag(event,value){
  event.stopPropagation();
  componentDemoState.multiValues=componentDemoState.multiValues.filter(x=>x!==value);
  renderComponentDemoPage();
}
function selectAllDemoMulti(){
  componentDemoState.multiValues=componentDemoMultiOptions.filter(x=>!x.disabled).map(x=>x.value);
  renderComponentDemoPage();
  openDemoDropdown("demoBaseMultiSelect");
}
function clearDemoMulti(){
  componentDemoState.multiValues=[];
  renderComponentDemoPage();
  openDemoDropdown("demoBaseMultiSelect");
}
function handleDemoMultiKey(event){
  const list=getDemoFilteredOptions(componentDemoMultiOptions,componentDemoState.multiKeyword);
  if(event.key==="ArrowDown"){event.preventDefault();componentDemoState.activeMultiIndex=Math.min(list.length-1,componentDemoState.activeMultiIndex+1);renderComponentDemoPage();openDemoDropdown("demoBaseMultiSelect");}
  if(event.key==="ArrowUp"){event.preventDefault();componentDemoState.activeMultiIndex=Math.max(0,componentDemoState.activeMultiIndex-1);renderComponentDemoPage();openDemoDropdown("demoBaseMultiSelect");}
  if(event.key==="Enter"){event.preventDefault();toggleDemoMultiOption(list[componentDemoState.activeMultiIndex]?.value);}
  if(event.key==="Escape")closeDemoDropdowns();
}
function maskPhone(phone){
  if(!phone)return "--";
  const str=String(phone);
  if(str.includes("*"))return str;
  return str.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");
}

/* =========================
   施工项目一览
========================= */
const constructionProjectBase=[
  ["机场联络线工程","PJ20260001","上海隧道","市政分公司","在建","张项目","长三角区域","上海市","浦东新区","市政工程","施工总承包","股份重大工程项目","是","ORD20260001","PROD20260001","隧道股份总包公司","上海机场建设集团","张项目","房建市政","上海地产","已办理",365000,"2026-01-16","2026-02","2027-12"],
  ["大外环西段项目","PJ20260002","上海隧道","轨交分公司","停工","王经理","长三角区域","上海市","闵行区","轨交工程","PPP","子公司重大项目","是","ORD20260002","PROD20260002","上海隧道","上海城投","王经理","轨道交通","上海地产","未办理",182500,"2026-02-20","2026-03","2027-08"],
  ["湾区金融中心项目","PJ20260003","城建国际","新加坡分公司","在建","李项目","大湾区域","广东省","深圳市","房建工程","施工总承包","子公司一般项目","否","ORD20260003","PROD20260003","城建国际","前海建设投资","李项目","房建市政","重点客户A","已办理",276800,"2025-12-08","2026-01","2027-06"],
  ["北方数据中心项目","PJ20260004","市政集团","第一建筑","完工","赵经理","中原区域","河南省","郑州市","房建工程","EPC","子公司重大项目","否","ORD20260004","PROD20260004","市政集团","北方云计算公司","赵经理","产业园区","重点客户B","已办理",98000,"2025-08-11","2025-09","2026-10"],
  ["奉贤新城18单元项目","PJ20260005","市政集团","第二建筑","在建","俞华杰","长三角区域","上海市","奉贤区","房建工程","施工总承包","股份重大工程项目","是","ORD20260005","PROD20260005","市政集团","上海肖塘投资","俞华杰","房建市政","无","已办理",457000,"2026-03-10","2026-04","2028-03"],
  ["海南自贸港市政配套","PJ20260006","市政集团","福建分公司","完工","陈海南","海南","海南省","海口市","市政工程","施工总承包","子公司一般项目","否","ORD20260006","PROD20260006","市政集团","海口城投","陈海南","市政配套","海南重点客户","已办理",63500,"2025-05-20","2025-06","2026-05"],
  ["境外港口物流园","PJ20260007","上海路桥","大湾区公司","在建","周海外","境外区域","境外","境外","港口工程","EPC","子公司重大项目","是","ORD20260007","PROD20260007","上海路桥","海外业主","周海外","海外工程","境外重点客户","未办理",310000,"2026-04-01","2026-05","2028-12"],
  ["中原快速路提升工程","PJ20260008","市政集团","河南分公司","停工","孙中原","中原区域","河南省","郑州市","道路工程","PPP","子公司一般项目","否","ORD20260008","PROD20260008","市政集团","郑州建投","孙中原","道路桥梁","无","已办理",126000,"2025-10-12","2025-11","2027-04"]
];
let constructionProjectData=constructionProjectBase.map((x,i)=>createConstructionProject(x,i+1));
for(let i=9;i<=35;i++){
  const base=constructionProjectBase[(i-1)%constructionProjectBase.length];
  const clone=[...base];
  clone[0]=`${base[0]}（${i}标段）`;
  clone[1]=`PJ2026${String(i).padStart(4,"0")}`;
  clone[12]=i%3===0?"是":"否";
  clone[18]=i%4===0?"重点客户C":base[18];
  clone[21]=Number(base[21]) + i*3200;
  constructionProjectData.push(createConstructionProject(clone,i));
}
[
  ["上海示范区线工程 SFQSG-15 标","PJ20260036","上海隧道","轨交分公司","在建","赵菁","长三角区域","上海市","青浦区","轨交工程","施工总承包","股份重大工程项目","是","ORD20260036","PROD20260036","上海隧道","上海申铁投资有限公司","赵菁","轨道交通","上海地产","已办理",286500,"2026-05-12","2026-06","2028-12"],
  ["上海市轨道交通23号线一期土建工程","PJ20260037","上海隧道","轨交分公司","在建","李峻","长三角区域","上海市","闵行区","轨交工程","施工总承包","子公司重大项目","是","ORD20260037","PROD20260037","上海隧道","上海申通地铁建设集团","李峻","轨道交通","重点客户A","已办理",318000,"2026-04-08","2026-06","2029-06"],
  ["两湖隧道东湖段附属配套工程","PJ20260038","市政集团","湖北分公司","停工","王晨","中原区域","湖北省","武汉市","市政工程","施工总承包","股份重大工程项目","是","ORD20260038","PROD20260038","市政集团","武汉城投集团","王晨","市政配套","重点客户B","已办理",196800,"2026-03-20","2026-06","2028-05"]
].forEach((item,index)=>constructionProjectData.push(createConstructionProject(item,36+index)));
constructionProjectData=window.EMMasterData?.ensure("projects",constructionProjectData) || constructionProjectData;
if(constructionProjectData.length<38){
  const existingNames=new Set(constructionProjectData.map(project=>project.projectName));
  const defaults=[
    createConstructionProject(["上海示范区线工程 SFQSG-15 标","PJ20260036","上海隧道","轨交分公司","在建","赵菁","长三角区域","上海市","青浦区","轨交工程","施工总承包","股份重大工程项目","是","ORD20260036","PROD20260036","上海隧道","上海申铁投资有限公司","赵菁","轨道交通","上海地产","已办理",286500,"2026-05-12","2026-06","2028-12"],36),
    createConstructionProject(["上海市轨道交通23号线一期土建工程","PJ20260037","上海隧道","轨交分公司","在建","李峻","长三角区域","上海市","闵行区","轨交工程","施工总承包","子公司重大项目","是","ORD20260037","PROD20260037","上海隧道","上海申通地铁建设集团","李峻","轨道交通","重点客户A","已办理",318000,"2026-04-08","2026-06","2029-06"],37),
    createConstructionProject(["两湖隧道东湖段附属配套工程","PJ20260038","市政集团","湖北分公司","停工","王晨","中原区域","湖北省","武汉市","市政工程","施工总承包","股份重大工程项目","是","ORD20260038","PROD20260038","市政集团","武汉城投集团","王晨","市政配套","重点客户B","已办理",196800,"2026-03-20","2026-06","2028-05"],38)
  ];
  defaults.forEach(project=>{
    if(constructionProjectData.length<38&&!existingNames.has(project.projectName))constructionProjectData.push(project);
  });
}
function createConstructionProject(x,i){
  const cost=Number(x[21]);
  const status=x[4];
  const registered=i%5===0?"未登记":"已登记";
  const planned=i%4===0?"未筹划":"已筹划";
  const finished=status==="完工";
  const stopped=status==="停工";
  const startMonth=x[23];
  const endMonth=x[24];
  const planStart=`${startMonth}-15`;
  const planEnd=`${endMonth}-20`;
  return {
    id:i,projectName:x[0],projectCode:x[1],subCompany:x[2],branchCompany:x[3],projectStatus:status,projectManager:x[5],
    managerPhone:["13688886666","13812345678","13955558888"][i%3],region:x[6],provinceCity:x[7]+"/"+x[8],projectType:x[9],
    implementationMode:x[10],controlLevel:x[11],integratedManagement:x[12],orderProjectNo:x[13],productionProjectNo:x[14],
    generalContractor:x[15],builder:x[16],contractProjectManager:x[17],productionBizType:x[18],keyCustomer:x[19],
    constructionPermit:x[20],projectCost:cost,approvalDate:x[22],contractStartMonth:x[23],contractEndMonth:x[24],
    totalContractor:x[15],detailAddress:`${x[7]}${x[8]}示范路${100+i}号`,accumulatedOutput:Math.round(cost*(status==="完工"?0.98:status==="停工"?0.36:0.58)),
    remainingWorkload:Math.round(cost*(status==="完工"?0.02:status==="停工"?0.64:0.42)),yearPlanOutput:Math.round(cost*.28),
    monthlyAccumulatedOutput:Math.round(cost*(i%3===0?.18:.24)),currentMonthOutput:Math.round(cost*(i%4===0?.015:.035)),
    planStart,planEnd,planDuration:Math.max(180,540+i*8),actualStart:i%4===0?"":planStart,actualEnd:finished?planEnd:"",
    registered,shouldRegisterDays:7,actualRegisterDays:registered==="已登记"?Math.min(7,3+i%5):0,
    planned,shouldPlanDays:15,actualPlanDays:planned==="已筹划"?Math.min(15,8+i%6):0,
    isShareInternal:i%2===0?"是":"否",isSubCompanyInternal:i%3===0?"是":"否",isConstructionProject:i%6===0?"否":"是",
    isMajorRisk:i%5===0?"是":"否",isSafetyManaged:i%4===0?"否":"是",isKeyProject:i%3===0?"是":"否",
    completedSettled:finished && i%2===0?"是":"否",resumeInTwoWeeks:stopped && i%2===0?"是":"否"
  };
}
let constructionProjectCurrentList=[...constructionProjectData];
let constructionProjectBaseFilteredList=[...constructionProjectData];
let constructionProjectActiveStat=null;
let constructionProjectPageSize=10;
let constructionProjectCurrentPage=1;

function moneyWan(v){return Number(v||0).toLocaleString("zh-CN");}
function projectStatusTag(v){return tag(v,v==="在建"?"blue":v==="完工"?"green":v==="停工"?"orange":"gray");}
function yesNoTag(v){return tag(v,v==="是"?"green":"gray");}
function projectMonthValue(id){return document.getElementById(id)?.value || "";}
function projectDateValue(id){return document.getElementById(id)?.value || "";}
function projectTextValue(id){return document.getElementById(id)?.value.trim() || "";}
function projectInRange(value,start,end){
  if(!start&&!end)return true;
  if(value===""||value==null)return false;
  const n=Number(value);
  return (!start||n>=Number(start))&&(!end||n<=Number(end));
}
function projectDateInRange(value,start,end){
  if(!start&&!end)return true;
  if(!value)return false;
  return (!start||value>=start)&&(!end||value<=end);
}
function projectIncludes(v,k){return !k||String(v||"").includes(k);}
function renderProjectOptions(values,placeholder="全部"){
  return `<option value="">${placeholder}</option>${values.map(x=>`<option value="${x}">${x}</option>`).join("")}`;
}
function renderProjectRange(startId,endId,type="text",placeholderA="起始",placeholderB="结束"){
  return `<div class="date-range ep-date-range project-range"><input id="${startId}" class="input" type="${type}" placeholder="${placeholderA}"/><span>至</span><input id="${endId}" class="input" type="${type}" placeholder="${placeholderB}"/></div>`;
}

tableColumnDefinitions.constructionProject=[
  {key:"index",title:"序号",width:70,align:"center",render:(r,i)=>(constructionProjectCurrentPage-1)*constructionProjectPageSize+i+1},
  {key:"projectName",title:"项目名称",width:240,render:r=>`<button type="button" class="link project-name-link text-ellipsis" title="${r.projectName}" data-construction-project-detail="${r.id}">${r.projectName}</button>`},
  {key:"productionBizType",title:"生产业务类型",width:130,render:r=>r.productionBizType},
  {key:"subCompany",title:"子公司",width:120,render:r=>r.subCompany},
  {key:"branchCompany",title:"分公司",width:120,render:r=>r.branchCompany},
  {key:"projectCost",title:"项目造价",width:120,align:"right",render:r=>`${moneyWan(r.projectCost)}万`},
  {key:"projectManager",title:"项目经理",width:170,render:r=>`${r.projectManager} | ${maskPhone(r.managerPhone)} <span class="link" onclick="showToast('查看手机号权限')">👁️</span>`},
  {key:"provinceCity",title:"所在省市",width:130,render:r=>r.provinceCity},
  {key:"region",title:"所属区域",width:120,render:r=>r.region},
  {key:"detailAddress",title:"详细地址",width:240,render:r=>`<span class="text-ellipsis" title="${r.detailAddress}">${r.detailAddress}</span>`},
  {key:"builder",title:"建设单位",width:220,render:r=>`<span class="text-ellipsis" title="${r.builder}">${r.builder}</span>`},
  {key:"accumulatedOutput",title:"开累完成产值",width:130,align:"right",render:r=>moneyWan(r.accumulatedOutput)},
  {key:"remainingWorkload",title:"剩余工作量",width:120,align:"right",render:r=>moneyWan(r.remainingWorkload)},
  {key:"yearPlanOutput",title:"当年计划完成产值",width:150,align:"right",render:r=>moneyWan(r.yearPlanOutput)},
  {key:"monthlyAccumulatedOutput",title:"1-X月累计完成产值",width:160,align:"right",render:r=>moneyWan(r.monthlyAccumulatedOutput)},
  {key:"completePercent",title:"累计完成百分比",width:140,align:"center",render:r=>`${Math.round((r.accumulatedOutput/r.projectCost)*100)}%`},
  {key:"currentMonthOutput",title:"X月完成产值",width:120,align:"right",render:r=>moneyWan(r.currentMonthOutput)},
  {key:"planStart",title:"计划开工日期",width:130,align:"center",render:r=>r.planStart},
  {key:"planEnd",title:"计划完工日期",width:130,align:"center",render:r=>r.planEnd},
  {key:"planDuration",title:"计划工期(天)",width:120,align:"right",render:r=>r.planDuration},
  {key:"actualStart",title:"实际开工日期",width:130,align:"center",render:r=>r.actualStart||"-"},
  {key:"actualEnd",title:"实际完工日期",width:130,align:"center",render:r=>r.actualEnd||"-"},
  {key:"projectStatus",title:"项目状态",width:100,align:"center",render:r=>projectStatusTag(r.projectStatus)},
  {key:"projectType",title:"项目类型",width:110,render:r=>r.projectType},
  {key:"controlLevel",title:"管控等级",width:110,render:r=>r.controlLevel},
  {key:"integratedManagement",title:"股份一体化",width:110,align:"center",render:r=>yesNoTag(r.integratedManagement)},
  {key:"orderProjectNo",title:"订单项目编号",width:150,render:r=>r.orderProjectNo},
  {key:"generalContractor",title:"总包单位",width:160,render:r=>r.generalContractor},
  {key:"keyCustomer",title:"重点客户",width:120,render:r=>r.keyCustomer||"无"},
  {key:"constructionPermit",title:"施工许可证",width:110,align:"center",render:r=>tag(r.constructionPermit,r.constructionPermit==="已办理"?"green":"orange")},
  {key:"registered",title:"基本信息登记",width:130,align:"center",render:r=>tag(r.registered,r.registered==="已登记"?"green":"orange")},
  {key:"shouldRegisterDays",title:"应登记天数",width:110,align:"right",render:r=>r.shouldRegisterDays},
  {key:"actualRegisterDays",title:"实际登记天数",width:120,align:"right",render:r=>r.actualRegisterDays},
  {key:"planned",title:"工程总体筹划",width:130,align:"center",render:r=>tag(r.planned,r.planned==="已筹划"?"green":"orange")},
  {key:"shouldPlanDays",title:"应筹划天数",width:110,align:"right",render:r=>r.shouldPlanDays},
  {key:"actualPlanDays",title:"实际筹划天数",width:120,align:"right",render:r=>r.actualPlanDays},
  {key:"approvalDate",title:"立项时间",width:120,align:"center",render:r=>r.approvalDate},
  {key:"isShareInternal",title:"是否股份内部",width:120,align:"center",render:r=>yesNoTag(r.isShareInternal)},
  {key:"isSubCompanyInternal",title:"是否子公司内部",width:130,align:"center",render:r=>yesNoTag(r.isSubCompanyInternal)},
  {key:"isKeyProject",title:"是否重点项目",width:120,align:"center",render:r=>yesNoTag(r.isKeyProject)},
  {key:"projectCode",title:"项目编号",width:140,render:r=>r.projectCode},
  {key:"productionProjectNo",title:"生产项目编号",width:150,render:r=>r.productionProjectNo},
  {key:"operation",title:"操作",width:110,align:"center",render:r=>`<a class="link" onclick="openProjectEditModal(${r.id})">编辑</a> ｜ <a class="link danger-link" onclick="deleteConstructionProject(${r.id})">删除</a>`}
];

function cpUnique(key){
  return [...new Set(constructionProjectData.map(x=>x[key]).filter(Boolean))];
}

function renderConstructionProjectSelect(id,label,values){
  return `
    <div class="form-item">
      <label>${label}</label>
      <select id="${id}" class="select">
        ${renderProjectOptions(values)}
      </select>
    </div>
  `;
}

function renderConstructionProjectInput(id,label,placeholder="请输入"){
  return `
    <div class="form-item">
      <label>${label}</label>
      <input id="${id}" class="input" placeholder="${placeholder}"/>
    </div>
  `;
}

function renderConstructionProjectRangeItem(label,html){
  return `
    <div class="form-item">
      <label>${label}</label>
      ${html}
    </div>
  `;
}

function renderConstructionProjectFilterFields(collapsed=false){
  const yesNo=["是","否"];
  const projectStatusOptions=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_STATUS"):["在建","完工","停工"];
  const projectTypeOptions=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_TYPE"):cpUnique("projectType");
  const implementationModeOptions=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE"):cpUnique("implementationMode");
  const controlLevelOptions=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL"):cpUnique("controlLevel");
  const basicRows=`
    ${renderConstructionProjectInput("cpProjectName","项目名称","模糊搜索")}
    ${renderConstructionProjectInput("cpProjectCode","项目编号","模糊搜索")}
    ${renderConstructionProjectSelect("cpSubCompany","子公司",cpUnique("subCompany"))}
    ${renderConstructionProjectSelect("cpBranchCompany","分公司",cpUnique("branchCompany"))}
    ${renderConstructionProjectSelect("cpProjectStatus","项目状态",projectStatusOptions)}
    ${renderConstructionProjectInput("cpProjectManager","项目经理","模糊搜索")}
    ${renderConstructionProjectSelect("cpRegion","所属区域",["长三角区域","大湾区域","中原区域","海南","境外区域"])}
    ${renderConstructionProjectInput("cpProvinceCity","所在省市","模糊搜索")}
  `;
  if(collapsed)return basicRows;
  return `
    ${basicRows}
    ${renderConstructionProjectSelect("cpProjectType","项目类型",projectTypeOptions)}
    ${renderConstructionProjectSelect("cpImplementationMode","实施模式",implementationModeOptions)}
    ${renderConstructionProjectSelect("cpControlLevel","管控等级",controlLevelOptions)}
    ${renderConstructionProjectSelect("cpIntegratedManagement","股份一体化管理",yesNo)}
    ${renderConstructionProjectInput("cpOrderProjectNo","订单项目编号","模糊搜索")}
    ${renderConstructionProjectInput("cpProductionProjectNo","生产项目编号","模糊搜索")}
    ${renderConstructionProjectInput("cpGeneralContractor","总包单位","模糊搜索")}
    ${renderConstructionProjectInput("cpBuilder","建设单位","模糊搜索")}
    ${renderConstructionProjectInput("cpContractProjectManager","合同项目经理","模糊搜索")}
    ${renderConstructionProjectSelect("cpProductionBizType","生产业务类型",cpUnique("productionBizType"))}
    ${renderConstructionProjectSelect("cpKeyCustomer","重点客户",cpUnique("keyCustomer"))}
    ${renderConstructionProjectSelect("cpConstructionPermit","施工许可证",["已办理","未办理"])}
    ${renderConstructionProjectRangeItem("立项日期",renderProjectRange("cpApprovalStart","cpApprovalEnd","date"))}
    ${renderConstructionProjectRangeItem("合同开工月份",renderProjectRange("cpContractStartBegin","cpContractStartEnd","month"))}
    ${renderConstructionProjectRangeItem("合同完工月份",renderProjectRange("cpContractEndBegin","cpContractEndEnd","month"))}
    ${renderConstructionProjectRangeItem("项目造价(万元)",renderProjectRange("cpCostMin","cpCostMax","number","最小","最大"))}
    ${renderConstructionProjectSelect("cpIsShareInternal","是否股份内部",yesNo)}
    ${renderConstructionProjectSelect("cpIsSubCompanyInternal","是否子公司内部",yesNo)}
    ${renderConstructionProjectSelect("cpIsConstructionProject","是否施工类项目",yesNo)}
    ${renderConstructionProjectSelect("cpIsMajorRisk","是否重大风险",yesNo)}
    ${renderConstructionProjectSelect("cpIsSafetyManaged","是否安全纳管",yesNo)}
  `;
}

async function renderConstructionProjectPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  constructionProjectCurrentPage=1;
  constructionProjectActiveStat=null;
  constructionProjectBaseFilteredList=applyConstructionProjectFilter(false);
  constructionProjectCurrentList=[...constructionProjectBaseFilteredList];

  const mounted=await mountProductionDashboardTemplate("construction-project","flex");
  if(mounted.stale)return;
  replaceProductionDashboardFragment(document.getElementById("constructionProjectSearchGrid"),renderConstructionProjectFilterFields(false));
  const table=document.getElementById("constructionProjectTable");
  if(table)table.style.minWidth=getTableMinWidth("constructionProject")+"px";
  document.querySelector("[data-construction-project-reset]")?.addEventListener("click",resetConstructionProjectFilter);
  document.querySelector("[data-construction-project-query]")?.addEventListener("click",queryConstructionProject);
  document.querySelector("[data-construction-project-query-toggle]")?.addEventListener("click",()=>toggleUnifiedQueryCard("constructionProjectQueryCard"));
  document.querySelector("[data-construction-project-add]")?.addEventListener("click",openProjectAddModal);
  document.querySelector("[data-construction-project-refresh]")?.addEventListener("click",renderConstructionProjectTable);
  document.querySelector("[data-construction-project-export]")?.addEventListener("click",()=>showToast("导出成功：施工项目一览.xlsx"));
  document.querySelector("[data-construction-project-column-setting]")?.addEventListener("click",()=>openColumnSetting("constructionProject","renderConstructionProjectTable"));
  document.querySelector("[data-construction-project-prev]")?.addEventListener("click",()=>changeConstructionProjectPage(-1));
  document.querySelector("[data-construction-project-next]")?.addEventListener("click",()=>changeConstructionProjectPage(1));
  document.querySelector("[data-construction-project-page-size]")?.addEventListener("change",event=>changeConstructionProjectPageSize(event.target.value));
  document.getElementById("cpSubCompany")?.addEventListener("change",syncConstructionProjectBranchOptions);
  renderConstructionProjectStats();
  renderConstructionProjectTable();
}

function getConstructionProjectFilterValues(){
  return {
    projectName:projectTextValue("cpProjectName"),
    projectCode:projectTextValue("cpProjectCode"),
    subCompany:projectTextValue("cpSubCompany"),
    branchCompany:projectTextValue("cpBranchCompany"),
    projectStatus:projectTextValue("cpProjectStatus"),
    projectManager:projectTextValue("cpProjectManager"),
    region:projectTextValue("cpRegion"),
    provinceCity:projectTextValue("cpProvinceCity"),
    projectType:projectTextValue("cpProjectType"),
    implementationMode:projectTextValue("cpImplementationMode"),
    controlLevel:projectTextValue("cpControlLevel"),
    integratedManagement:projectTextValue("cpIntegratedManagement"),
    orderProjectNo:projectTextValue("cpOrderProjectNo"),
    productionProjectNo:projectTextValue("cpProductionProjectNo"),
    generalContractor:projectTextValue("cpGeneralContractor"),
    builder:projectTextValue("cpBuilder"),
    contractProjectManager:projectTextValue("cpContractProjectManager"),
    productionBizType:projectTextValue("cpProductionBizType"),
    keyCustomer:projectTextValue("cpKeyCustomer"),
    constructionPermit:projectTextValue("cpConstructionPermit"),
    approvalStart:projectDateValue("cpApprovalStart"),
    approvalEnd:projectDateValue("cpApprovalEnd"),
    contractStartBegin:projectMonthValue("cpContractStartBegin"),
    contractStartEnd:projectMonthValue("cpContractStartEnd"),
    contractEndBegin:projectMonthValue("cpContractEndBegin"),
    contractEndEnd:projectMonthValue("cpContractEndEnd"),
    costMin:projectTextValue("cpCostMin"),
    costMax:projectTextValue("cpCostMax"),
    isShareInternal:projectTextValue("cpIsShareInternal"),
    isSubCompanyInternal:projectTextValue("cpIsSubCompanyInternal"),
    isConstructionProject:projectTextValue("cpIsConstructionProject"),
    isMajorRisk:projectTextValue("cpIsMajorRisk"),
    isSafetyManaged:projectTextValue("cpIsSafetyManaged")
  };
}

function applyConstructionProjectFilter(update=true){
  const f=getConstructionProjectFilterValues();
  const list=constructionProjectData.filter(p=>
    projectIncludes(p.projectName,f.projectName)&&
    projectIncludes(p.projectCode,f.projectCode)&&
    (!f.subCompany||p.subCompany===f.subCompany)&&
    (!f.branchCompany||p.branchCompany===f.branchCompany)&&
    (!f.projectStatus||p.projectStatus===f.projectStatus)&&
    projectIncludes(p.projectManager,f.projectManager)&&
    (!f.region||p.region===f.region)&&
    projectIncludes(p.provinceCity,f.provinceCity)&&
    (!f.projectType||p.projectType===f.projectType)&&
    (!f.implementationMode||p.implementationMode===f.implementationMode)&&
    (!f.controlLevel||p.controlLevel===f.controlLevel)&&
    (!f.integratedManagement||p.integratedManagement===f.integratedManagement)&&
    projectIncludes(p.orderProjectNo,f.orderProjectNo)&&
    projectIncludes(p.productionProjectNo,f.productionProjectNo)&&
    projectIncludes(p.generalContractor,f.generalContractor)&&
    projectIncludes(p.builder,f.builder)&&
    projectIncludes(p.contractProjectManager,f.contractProjectManager)&&
    (!f.productionBizType||p.productionBizType===f.productionBizType)&&
    (!f.keyCustomer||p.keyCustomer===f.keyCustomer)&&
    (!f.constructionPermit||p.constructionPermit===f.constructionPermit)&&
    projectDateInRange(p.approvalDate,f.approvalStart,f.approvalEnd)&&
    projectDateInRange(p.contractStartMonth,f.contractStartBegin,f.contractStartEnd)&&
    projectDateInRange(p.contractEndMonth,f.contractEndBegin,f.contractEndEnd)&&
    projectInRange(p.projectCost,f.costMin,f.costMax)&&
    (!f.isShareInternal||p.isShareInternal===f.isShareInternal)&&
    (!f.isSubCompanyInternal||p.isSubCompanyInternal===f.isSubCompanyInternal)&&
    (!f.isConstructionProject||p.isConstructionProject===f.isConstructionProject)&&
    (!f.isMajorRisk||p.isMajorRisk===f.isMajorRisk)&&
    (!f.isSafetyManaged||p.isSafetyManaged===f.isSafetyManaged)
  );
  if(update){
    constructionProjectBaseFilteredList=list;
    constructionProjectCurrentList=applyConstructionProjectStatFilter(list);
    constructionProjectCurrentPage=1;
    renderConstructionProjectStats();
    renderConstructionProjectTable();
  }
  return list;
}

function queryConstructionProject(){
  constructionProjectActiveStat=null;
  applyConstructionProjectFilter(true);
}

function resetConstructionProjectFilter(){
  [...document.querySelectorAll(".construction-project-search-card input,.construction-project-search-card select")].forEach(el=>el.value="");
  syncConstructionProjectBranchOptions();
  constructionProjectActiveStat=null;
  queryConstructionProject();
}

function toggleConstructionProjectFilter(){
  const grid=document.getElementById("constructionProjectSearchGrid");
  if(!grid)return;
  const collapsed=grid.dataset.collapsed==="1";
  grid.dataset.collapsed=collapsed?"0":"1";
  replaceProductionDashboardFragment(grid,`
    ${renderConstructionProjectFilterFields(!collapsed)}
    <div class="construction-project-search-actions">
      <button class="btn" onclick="resetConstructionProjectFilter()">重置</button>
      <button class="btn primary" onclick="queryConstructionProject()">查询</button>
      <button id="cpCollapseBtn" class="btn" onclick="toggleConstructionProjectFilter()">${collapsed?"收起":"展开"}</button>
    </div>
  `);
  document.getElementById("cpSubCompany")?.addEventListener("change",syncConstructionProjectBranchOptions);
}

function syncConstructionProjectBranchOptions(){
  const sub=document.getElementById("cpSubCompany")?.value || "";
  const branch=document.getElementById("cpBranchCompany");
  if(!branch)return;
  const values=cpUnique("branchCompany").filter(x=>!sub||constructionProjectData.some(p=>p.subCompany===sub&&p.branchCompany===x));
  replaceProductionDashboardFragment(branch,renderProjectOptions(values));
}

function getConstructionProjectStatPredicate(key){
  const currentYear=String(new Date().getFullYear());
  const map={
    total:x=>true,
    registeredDone:x=>x.registered==="已登记",
    registeredTodo:x=>x.registered==="未登记",
    registeredOverdue:x=>x.registered==="未登记"&&x.actualRegisterDays===0,
    plannedDone:x=>x.planned==="已筹划",
    plannedTodo:x=>x.planned==="未筹划",
    plannedOverdue:x=>x.planned==="未筹划"&&x.actualPlanDays===0,
    startedThisYear:x=>(x.actualStart||x.planStart||"").startsWith(currentYear),
    stoppedNow:x=>x.projectStatus==="停工",
    resumeSoon:x=>x.resumeInTwoWeeks==="是",
    finishedAll:x=>x.projectStatus==="完工",
    finishedThisYear:x=>(x.actualEnd||"").startsWith(currentYear),
    finishedUnsettled:x=>x.projectStatus==="完工"&&x.completedSettled!=="是",
    finishedSettled:x=>x.projectStatus==="完工"&&x.completedSettled==="是",
    completedAll:x=>x.projectStatus==="完工",
    completedSettled:x=>x.projectStatus==="完工"&&x.completedSettled==="是"
  };
  return map[key] || (()=>true);
}

function applyConstructionProjectStatFilter(list){
  if(!constructionProjectActiveStat)return list;
  const predicate=getConstructionProjectStatPredicate(constructionProjectActiveStat.key);
  return list.filter(predicate);
}

function filterConstructionProjectByStat(key){
  if(constructionProjectActiveStat?.key===key){
    constructionProjectActiveStat=null;
  }else{
    constructionProjectActiveStat={key};
  }
  constructionProjectCurrentList=applyConstructionProjectStatFilter(constructionProjectBaseFilteredList);
  constructionProjectCurrentPage=1;
  renderConstructionProjectStats();
  renderConstructionProjectTable();
}

function renderConstructionProjectStats(){
  const box=document.getElementById("constructionProjectStats");
  if(!box)return;
  const data=constructionProjectBaseFilteredList;
  const total=data.length || 0;
  const count=fn=>data.filter(fn).length;
  const percent=n=>total?`${Math.round(n*100/total)}%`:"0%";
  const registered=count(x=>x.registered==="已登记");
  const planned=count(x=>x.planned==="已筹划");
  const currentYear=String(new Date().getFullYear());
  const groups=[
    {name:"项目总数",items:[{key:"total",label:"项目总数",value:total}]},
    {name:"登记情况",items:[{key:"registeredRate",label:"登记完成率",value:percent(registered),metric:true},{key:"registeredDone",label:"已登记",value:registered},{key:"registeredTodo",label:"未登记",value:count(x=>x.registered==="未登记")},{key:"registeredOverdue",label:"超期未登记",value:count(x=>x.registered==="未登记"&&x.actualRegisterDays===0)}]},
    {name:"筹划情况",items:[{key:"plannedRate",label:"筹划完成率",value:percent(planned),metric:true},{key:"plannedDone",label:"已筹划",value:planned},{key:"plannedTodo",label:"未筹划",value:count(x=>x.planned==="未筹划")},{key:"plannedOverdue",label:"超期未筹划",value:count(x=>x.planned==="未筹划"&&x.actualPlanDays===0)}]},
    {name:"项目开工",items:[{key:"startedThisYear",label:"当年开工",value:count(x=>(x.actualStart||x.planStart||"").startsWith(currentYear))}]},
    {name:"项目停工",items:[{key:"stoppedNow",label:"当前停工",value:count(x=>x.projectStatus==="停工")},{key:"resumeSoon",label:"计划两周内复工",value:count(x=>x.resumeInTwoWeeks==="是")}]},
    {name:"项目完工",items:[{key:"finishedAll",label:"所有完工",value:count(x=>x.projectStatus==="完工")},{key:"finishedThisYear",label:"当年完工",value:count(x=>(x.actualEnd||"").startsWith(currentYear))},{key:"finishedUnsettled",label:"完工未结算",value:count(x=>x.projectStatus==="完工"&&x.completedSettled!=="是")},{key:"finishedSettled",label:"完工已结算",value:count(x=>x.projectStatus==="完工"&&x.completedSettled==="是")}]},
    {name:"项目竣工",items:[{key:"completedAll",label:"所有竣工",value:count(x=>x.projectStatus==="完工")},{key:"completedSettled",label:"竣工已结算",value:count(x=>x.projectStatus==="完工"&&x.completedSettled==="是")}]}
  ];
  replaceProductionDashboardFragment(box,`
    <div class="construction-project-stats">
      ${groups.map(g=>`
        <div class="construction-project-stat-group">
          <div class="construction-project-stat-name">${g.name}</div>
          <div class="construction-project-stat-items">
            ${g.items.map(item=>`
              <div class="construction-project-stat-item ${constructionProjectActiveStat?.key===item.key?"active":""} ${item.metric?"metric-only":""}" onclick="${item.metric?"showToast('比例指标用于观察，不参与筛选')":`filterConstructionProjectByStat('${item.key}')`}">
                <strong>${item.value}</strong>
                <span>${item.label}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `);
}

function renderConstructionProjectTableHeader(){
  return getVisibleColumns("constructionProject").map(col=>`
    <th class="${col.key==="operation"?"project-operation-col":""}" style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
      ${col.title}
    </th>
  `).join("");
}

function getConstructionProjectPagedList(){
  const total=constructionProjectCurrentList.length;
  const totalPages=Math.max(1,Math.ceil(total/constructionProjectPageSize));
  constructionProjectCurrentPage=Math.min(Math.max(1,constructionProjectCurrentPage),totalPages);
  const start=(constructionProjectCurrentPage-1)*constructionProjectPageSize;
  return constructionProjectCurrentList.slice(start,start+constructionProjectPageSize);
}

function renderConstructionProjectTable(){
  const table=document.getElementById("constructionProjectTable");
  const thead=document.getElementById("constructionProjectThead");
  const tbody=document.getElementById("constructionProjectTbody");
  if(!table||!thead||!tbody)return;
  const columns=getVisibleColumns("constructionProject");
  const list=getConstructionProjectPagedList();
  table.style.minWidth=getTableMinWidth("constructionProject")+"px";
  replaceProductionDashboardFragment(thead,renderConstructionProjectTableHeader());
  replaceProductionDashboardFragment(tbody,list.map((row,index)=>`
    <tr>
      ${columns.map(col=>`
        <td class="${col.key==="operation"?"project-operation-col":""}" style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
          ${col.render(row,index)}
        </td>
      `).join("")}
    </tr>
  `).join("") || `<tr><td colspan="${columns.length}" style="text-align:center;color:var(--muted);height:120px">暂无数据</td></tr>`);
  const total=constructionProjectCurrentList.length;
  const totalPages=Math.max(1,Math.ceil(total/constructionProjectPageSize));
  const totalText=document.getElementById("constructionProjectTotalText");
  const pageText=document.getElementById("constructionProjectPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.textContent=`第 ${constructionProjectCurrentPage} / ${totalPages} 页`;
  bindConstructionProjectDetailButtons();
}

function bindConstructionProjectDetailButtons(){
  document.querySelectorAll("#constructionProjectTbody [data-construction-project-detail]").forEach(button=>{
    button.onclick=()=>openConstructionProjectDetailModal(button.dataset.constructionProjectDetail);
  });
}

function changeConstructionProjectPage(delta){
  const totalPages=Math.max(1,Math.ceil(constructionProjectCurrentList.length/constructionProjectPageSize));
  constructionProjectCurrentPage=Math.min(Math.max(1,constructionProjectCurrentPage+delta),totalPages);
  renderConstructionProjectTable();
}

function changeConstructionProjectPageSize(value){
  constructionProjectPageSize=Number(value)||10;
  constructionProjectCurrentPage=1;
  renderConstructionProjectTable();
}

function renderProjectMasterForm(project={}){
  const statuses=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_STATUS"):["在建","停工","完工"];
  const types=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_TYPE"):cpUnique("projectType");
  const modes=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE"):cpUnique("implementationMode");
  const levels=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL"):cpUnique("controlLevel");
  const options=(items,value)=>items.map(item=>`<option value="${item}" ${item===value?"selected":""}>${item}</option>`).join("");
  return `<div class="form-grid-2">
    <div class="form-item"><label>项目名称 <span style="color:var(--danger)">*</span></label><input id="projectFormName" class="input" value="${project.projectName || ""}"/></div>
    <div class="form-item"><label>项目编号 <span style="color:var(--danger)">*</span></label><input id="projectFormCode" class="input" value="${project.projectCode || ""}"/></div>
    <div class="form-item"><label>子公司</label><select id="projectFormSub" class="select" onchange="syncProjectMasterBranchOptions()"><option value="">请选择</option>${options(getOrganizationCompanies(),project.subCompany)}</select></div>
    <div class="form-item"><label>分公司</label><select id="projectFormBranch" class="select"><option value="">请选择</option>${options(getOrganizationBranchOptions(project.subCompany || ""),project.branchCompany)}</select></div>
    <div class="form-item"><label>项目状态</label><select id="projectFormStatus" class="select">${options(statuses,project.projectStatus || "在建")}</select></div>
    <div class="form-item"><label>项目经理</label><input id="projectFormManager" class="input" value="${project.projectManager || ""}"/></div>
    <div class="form-item"><label>项目类型</label><select id="projectFormType" class="select">${options(types,project.projectType)}</select></div>
    <div class="form-item"><label>实施模式</label><select id="projectFormMode" class="select">${options(modes,project.implementationMode)}</select></div>
    <div class="form-item"><label>管控等级</label><select id="projectFormLevel" class="select">${options(levels,project.controlLevel)}</select></div>
    <div class="form-item"><label>建设单位</label><input id="projectFormBuilder" class="input" value="${project.builder || ""}"/></div>
    <div class="form-item"><label>立项日期</label><input id="projectFormApproval" type="date" class="input" value="${project.approvalDate || ""}"/></div>
    <div class="form-item"><label>项目造价（万元）</label><input id="projectFormCost" type="number" class="input" value="${project.projectCost || ""}"/></div>
  </div>`;
}

function syncProjectMasterBranchOptions(){
  const sub=document.getElementById("projectFormSub")?.value || "";
  const branch=document.getElementById("projectFormBranch");
  if(branch)replaceProductionDashboardFragment(branch,`<option value="">请选择</option>${getOrganizationBranchOptions(sub).map(item=>`<option>${item}</option>`).join("")}`);
}

function openProjectAddModal(){
  openModal("新增项目",renderProjectMasterForm(),`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveConstructionProject()">保存</button>`,"large");
}

function openProjectEditModal(id){
  const project=constructionProjectData.find(item=>String(item.id)===String(id));
  if(!project)return;
  openModal("编辑项目",renderProjectMasterForm(project),`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveConstructionProject(${id})">保存</button>`,"large");
}

function saveConstructionProject(id){
  const projectName=document.getElementById("projectFormName").value.trim();
  const projectCode=document.getElementById("projectFormCode").value.trim();
  if(!projectName||!projectCode)return showToast("请填写项目名称和项目编号");
  if(constructionProjectData.some(item=>item.projectCode===projectCode&&String(item.id)!==String(id)))return showToast("项目编号不可重复");
  const existing=id==null?null:constructionProjectData.find(item=>String(item.id)===String(id));
  const project=existing || {
    id:Math.max(0,...constructionProjectData.map(item=>Number(item.id)||0))+1, managerPhone:"13800000000",region:"长三角区域",provinceCity:"上海市/上海市",orderProjectNo:"",productionProjectNo:"",generalContractor:"",contractProjectManager:"",productionBizType:"房建市政",keyCustomer:"无",constructionPermit:"未办理",totalContractor:"",detailAddress:"",accumulatedOutput:0,remainingWorkload:0,yearPlanOutput:0,monthlyAccumulatedOutput:0,currentMonthOutput:0,planStart:"",planEnd:"",planDuration:0,actualStart:"",actualEnd:"",registered:"未登记",shouldRegisterDays:7,actualRegisterDays:0,planned:"未筹划",shouldPlanDays:15,actualPlanDays:0,isShareInternal:"否",isSubCompanyInternal:"否",isConstructionProject:"是",isMajorRisk:"否",isSafetyManaged:"是",isKeyProject:"否",completedSettled:"否",resumeInTwoWeeks:"否"
  };
  Object.assign(project,{
    projectName,projectCode,subCompany:document.getElementById("projectFormSub").value,branchCompany:document.getElementById("projectFormBranch").value,
    projectStatus:document.getElementById("projectFormStatus").value,projectManager:document.getElementById("projectFormManager").value.trim(),
    projectType:document.getElementById("projectFormType").value,implementationMode:document.getElementById("projectFormMode").value,controlLevel:document.getElementById("projectFormLevel").value,
    builder:document.getElementById("projectFormBuilder").value.trim(),approvalDate:document.getElementById("projectFormApproval").value,projectCost:Number(document.getElementById("projectFormCost").value || 0)
  });
  if(!existing)constructionProjectData.unshift(project);
  constructionProjectCurrentList=[...constructionProjectData];
  constructionProjectBaseFilteredList=[...constructionProjectData];
  persistMasterData("projects",constructionProjectData);
  closeModal();
  renderConstructionProjectPage();
  showToast(existing?"项目已保存":"项目新增成功");
}

function deleteConstructionProject(id){
  const project=constructionProjectData.find(item=>String(item.id)===String(id));
  if(!project||!confirm(`确认删除项目：${project.projectName}？`))return;
  constructionProjectData=constructionProjectData.filter(item=>String(item.id)!==String(id));
  constructionProjectCurrentList=[...constructionProjectData];
  constructionProjectBaseFilteredList=[...constructionProjectData];
  persistMasterData("projects",constructionProjectData);
  renderConstructionProjectPage();
  showToast("项目已删除");
}

function openConstructionProjectDetailModal(id){
  const project=constructionProjectData.find(item=>String(item.id)===String(id));
  if(!project)return;
  const originalListNodes=[...listPage.childNodes];
  const originalListDisplay=listPage.style.display;
  const originalDetailDisplay=detailPage.style.display;

  // Reuse the existing project-management detail content rather than maintaining a second detail template.
  renderProjectDetailPage();
  const contentNodes=[...listPage.childNodes].map(node=>node.cloneNode(true));
  contentNodes.forEach(node=>replaceProductionDashboardText(node,"华翔路（兴虹-申兰）非开挖修复工程",project.projectName));
  listPage.replaceChildren(...originalListNodes);
  listPage.style.display=originalListDisplay;
  detailPage.style.display=originalDetailDisplay;

  openModal("项目详情",`<div class="construction-project-detail-modal-content"></div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  document.querySelector(".construction-project-detail-modal-content")?.replaceChildren(...contentNodes);
  modalBox.classList.add("construction-project-detail-modal");
}

if(!window.__constructionProjectDetailDelegateV2252){
  window.__constructionProjectDetailDelegateV2252=true;
  document.addEventListener("click",event=>{
    const trigger=event.target.closest?.("[data-construction-project-detail]");
    if(!trigger)return;
    event.preventDefault();
    openConstructionProjectDetailModal(trigger.dataset.constructionProjectDetail);
  });
}

function getCurrentReportMonth(){
  return "2026-07";
}
