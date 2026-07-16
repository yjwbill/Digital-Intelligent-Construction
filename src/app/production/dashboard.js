const productionScreenTabs=["生产总览","圆顶管看板（试运行）","重大工程项目看板","产值看板","纳统看板"];
const productionScreenEmptyTabs=["圆顶管看板（试运行）"];
const productionValueCompanies=[
  "上海隧道",
  "市政集团",
  "上海路桥",
  "城市环境",
  "上海能建",
  "城建国际",
  "城建投资",
  "城建设计",
  "城市运营",
  "建元资管",
  "数字集团",
  "城建物资",
  "地空公司"
];
const productionValueOrgs=["全部",...productionValueCompanies];
let productionValueOrgActive="全部";
const productionValueBizTabs=[
  "产品销售",
  "设计",
  "数字",
  "城市运营",
  "房产",
  "投资"
];
const productionValueBizSubTabs={
  "房产":["物业管理","商业运营","房产开发"],
  "投资":["股权项目","基建项目","租赁及保理"]
};
let productionValueBizActive=productionValueBizTabs[0];
let productionValueBizSubActive={
  "房产":"物业管理",
  "投资":"股权项目"
};
let productionOverviewDeviceMode="current";
let productionOverviewMarketMode="value";
let productionOverviewClientMode="progress";
let productionOverviewMaterialMode="stat";
let productionOverviewMaterialActive="混凝土";
let productionOverviewMaterialHoverIndex=10;
const productionValueBizData={
  "产品销售":["185,200","128,900","70.0%","3.56"],
  "设计":["326,800","214,620","65.7%","112,180"],
  "数字":["96,500","58,320","60.4%","38,180"],
  "城市运营":["248,600","157,860","63.5%","90,740"],
  "房产【物业管理】":["78,900","55,260","70.0%","23,640"],
  "房产【商业运营】":["142,300","84,880","59.6%","57,420"],
  "房产【房产开发】":["620,000","318,600","51.4%","301,400"],
  "投资【股权项目】":["430,000","271,900","63.2%","158,100"],
  "投资【基建项目】":["1,185,000","694,200","58.6%","490,800"],
  "投资【租赁及保理】":["268,600","186,400","69.4%","82,200"]
};
let productionValueCompanyMode="actual";
let productionOverviewCompletionMode="actual";

const productionOverviewFilterState={
  company:"",
  branch:"",
  region:"",
  client:"",
  projectType:""
};
const productionStatisticsState={
  industry:"",
  company:"全部"
};
const productionScreenTemplatePaths={
  overview:"src/app/production/dashboard.html",
  statistics:"src/app/production/dashboard-statistics.html",
  pipe:"src/app/production/dashboard-pipe.html",
  major:"src/app/production/dashboard-major.html",
  value:"src/app/production/dashboard-value.html",
  empty:"src/app/production/dashboard-pipe.html"
};
const productionScreenTemplatePromises=new Map();
let productionScreenRenderToken=0;

function getProductionScreenTemplatesFromDocument(){
  const templates=new Map();
  document.querySelectorAll("template[data-production-dashboard-template]").forEach(template=>{
    templates.set(template.dataset.productionDashboardTemplate,template);
  });
  return templates.size?templates:null;
}

function parseProductionScreenFragment(html,targetTag=""){
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

function replaceProductionScreenFragment(target,html){
  if(!target)return;
  const nodes=parseProductionScreenFragment(html,target.tagName)
    .map(node=>document.importNode(node,true));
  target.replaceChildren(...nodes);
}

function replaceProductionScreenText(node,from,to){
  if(!node)return;
  if(node.nodeType===Node.TEXT_NODE){
    node.nodeValue=node.nodeValue.replaceAll(from,to);
    return;
  }
  node.childNodes.forEach(child=>replaceProductionScreenText(child,from,to));
}

function loadProductionScreenTemplates(name="overview"){
  const inlineTemplates=getProductionScreenTemplatesFromDocument();
  if(inlineTemplates?.has(name))return Promise.resolve(inlineTemplates);

  const path=productionScreenTemplatePaths[name] || productionScreenTemplatePaths.overview;
  if(!path)return Promise.resolve(inlineTemplates || new Map());

  if(!productionScreenTemplatePromises.has(path)){
    const promise=fetch(path)
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
        productionScreenTemplatePromises.delete(path);
        return new Map();
      });
    productionScreenTemplatePromises.set(path,promise);
  }
  return productionScreenTemplatePromises.get(path).then(templates=>{
    if(!inlineTemplates)return templates;
    const merged=new Map(inlineTemplates);
    templates.forEach((template,key)=>merged.set(key,template));
    return merged;
  });
}

async function mountProductionScreenTemplate(name,display="block"){
  const token=++productionScreenRenderToken;
  const templates=await loadProductionScreenTemplates(name);
  if(token!==productionScreenRenderToken)return {stale:true,root:null};
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

function productionScreenSlot(name){
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

const productionDashboardScreenRoutes={
  overview:"src/app/production/dashboard.html",
  pipe:"src/app/production/dashboard-pipe.html",
  major:"src/app/production/dashboard-major.html",
  value:"src/app/production/dashboard-value.html",
  statistics:"src/app/production/dashboard-statistics.html"
};
const productionDashboardScreenKeys={
  "生产总览":"overview",
  "圆顶管看板（试运行）":"pipe",
  "重大工程项目看板":"major",
  "产值看板":"value",
  "纳统看板":"statistics",
  overview:"overview",
  pipe:"pipe",
  major:"major",
  value:"value",
  statistics:"statistics"
};

function getProductionDashboardScreenKey(screen){
  return productionDashboardScreenKeys[screen] || productionDashboardScreenKeys[String(screen||"").toLowerCase()] || "overview";
}

function navigateProductionDashboardPath(path){
  const target=new URL(path,document.baseURI);
  const current=new URL(location.href);
  if(target.pathname===current.pathname && target.search===current.search)return false;
  location.assign(target.href);
  return true;
}

function switchProductionScreenTab(tab){
  const key=getProductionDashboardScreenKey(tab);
  const path=productionDashboardScreenRoutes[key];
  if(path && navigateProductionDashboardPath(path))return true;
  return renderProductionDashboardByKey(key,{preserveScroll:true});
}

function renderProductionDashboardByKey(screen,options={}){
  const key=getProductionDashboardScreenKey(screen);
  const preserve=!!options.preserveScroll;
  if(key==="major")return preserve?renderProductionMajorDashboardPreservingScroll():renderProductionMajorDashboardPage();
  if(key==="value")return preserve?renderProductionValueDashboardPreservingScroll():renderProductionValueDashboardPage();
  if(key==="statistics")return preserve?renderProductionStatisticsDashboardPreservingScroll():renderProductionStatisticsDashboardPage();
  if(key==="pipe")return renderProductionScreenEmptyPage("圆顶管看板（试运行）");
  return preserve?renderProductionOverviewDashboardPreservingScroll():renderProductionOverviewDashboardPage();
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

function setProductionValueCompanyMode(mode){
  productionValueCompanyMode=mode;
  renderProductionValueDashboardPreservingScroll();
}

function renderProductionScreenHeader(activeTab="产值看板"){
  const isOverview=activeTab==="生产总览";
  const isMajor=activeTab==="重大工程项目看板";
  const isStatistics=activeTab==="纳统看板";
  const statisticsData=getProductionStatisticsData();
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
      `:isStatistics?`
        <div class="screen-company screen-month-actions production-statistics-source">
          <span>${formatProductionStatisticsReportMonth(statisticsData.reportMonth)}</span>
          <b title="${escapeAttr(statisticsData.sourceFile || "")}">纳统数据</b>
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
  const mounted=await mountProductionScreenTemplate("empty","block");
  if(mounted.stale)return;
  replaceProductionScreenFragment(productionScreenSlot("header"),renderProductionScreenHeader(tab));
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
  const mounted=await mountProductionScreenTemplate("major","block");
  if(mounted.stale)return;
  replaceProductionScreenFragment(productionScreenSlot("header"),renderProductionScreenHeader("重大工程项目看板"));
  replaceProductionScreenFragment(productionScreenSlot("top"),topMetrics.map(item=>renderProductionValueMetric(...item)).join(""));
  replaceProductionScreenFragment(productionScreenSlot("grid"),[
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
  const mounted=await mountProductionScreenTemplate("overview","block");
  if(mounted.stale)return;
  replaceProductionScreenFragment(productionScreenSlot("header"),renderProductionScreenHeader("生产总览"));
  replaceProductionScreenFragment(productionScreenSlot("top-grid"),[
    renderProductionOverviewMetricCard("项目总数","4692",projectItems),
    renderProductionOverviewMetricCard("风险预警","",warnItems,"warn")
  ].join(""));
  replaceProductionScreenFragment(productionScreenSlot("row-analysis"),[
    renderProductionOverviewMiniTable("区域市场经营分析","market"),
    renderProductionOverviewMiniTable("重点客户经营分析","client"),
    renderProductionOverviewManageTip()
  ].join(""));
  replaceProductionScreenFragment(productionScreenSlot("completion"),renderProductionOverviewCompletion());
  replaceProductionScreenFragment(productionScreenSlot("middle"),[
    renderProductionOverviewProgress(),
    renderProductionOverviewRisk()
  ].join(""));
  replaceProductionScreenFragment(productionScreenSlot("right"),[
    renderProductionOverviewMaterial(),
    renderProductionOverviewDeviceLowCarbon()
  ].join(""));
  bindProductionOverviewMaterialTrendHover();
}

function getProductionStatisticsData(){
  return window.productionStatisticsDashboardData || {industries:[],overall:{}};
}

function getProductionStatisticsIndustries(){
  const data=getProductionStatisticsData();
  return Array.isArray(data.industries)?data.industries:[];
}

function formatProductionStatisticsReportMonth(value){
  const text=String(value || "").trim();
  const match=text.match(/^(\d{4})-(\d{1,2})$/);
  if(match)return `${match[1]}年${match[2].padStart(2,"0")}月`;
  return text || "数据月份";
}

function productionStatisticsText(value,fallback="-"){
  if(value===0)return "0";
  const text=value===undefined || value===null || value==="" ? fallback : String(value);
  return escapeAttr(text);
}

function productionStatisticsJsArg(value){
  return escapeAttr(String(value || "").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r?\n/g," "));
}

function formatProductionStatisticsNumber(value,digits=2){
  if(value===undefined || value===null || value==="")return "-";
  const num=Number(value);
  if(!Number.isFinite(num))return String(value);
  const hasDecimal=Math.abs(num-Math.trunc(num))>.000001;
  return num.toLocaleString("zh-CN",{
    minimumFractionDigits:hasDecimal?Math.min(digits,2):0,
    maximumFractionDigits:digits
  });
}

function formatProductionStatisticsAmount(value){
  const num=Number(value || 0);
  if(!Number.isFinite(num))return "-";
  if(Math.abs(num)>=10000)return `${formatProductionStatisticsNumber(num/10000,2)}亿元`;
  return `${formatProductionStatisticsNumber(num,0)}万元`;
}

function formatProductionStatisticsProgress(numerator,denominator){
  const den=Number(denominator || 0);
  if(!den)return "-";
  const percent=Number(numerator || 0)/den*100;
  return `${formatProductionStatisticsNumber(percent,2)}%`;
}

function getProductionStatisticsProgressValue(numerator,denominator){
  const den=Number(denominator || 0);
  if(!den)return 0;
  return Math.max(0,Math.min(100,Number(numerator || 0)/den*100));
}

function getProductionStatisticsYoYClass(value){
  const num=parseFloat(String(value || "").replace("%",""));
  if(!Number.isFinite(num) || num===0)return "flat";
  return num>0?"up":"down";
}

function getProductionStatisticsMetricName(industry){
  if(industry?.name==="房地产业")return "产值/营收/投资/销售面积";
  return industry?.metricName || industry?.summary?.metricName || "纳统值";
}

function getActiveProductionStatisticsIndustry(){
  const industries=getProductionStatisticsIndustries();
  if(!industries.length)return null;
  let active=industries.find(item=>item.name===productionStatisticsState.industry);
  if(!active){
    active=industries[0];
    productionStatisticsState.industry=active.name;
    productionStatisticsState.company="全部";
  }
  return active;
}

function getProductionStatisticsCompanyRows(industry){
  if(!industry)return [];
  const summary=industry.summary || {};
  const companies=Array.isArray(summary.companies)?summary.companies:[];
  return [
    {
      company:"全部",
      entityCount:summary.entityCount || 0,
      includedCount:summary.includedCount || 0,
      plan2026:summary.plan2026 || 0,
      month2026:summary.month2026 || 0,
      ytd2026:summary.ytd2026 || 0,
      salesAreaYtd2026:summary.salesAreaYtd2026 || 0,
      isAll:true
    },
    ...companies
  ];
}

function getActiveProductionStatisticsCompany(industry){
  const rows=getProductionStatisticsCompanyRows(industry);
  if(!rows.some(row=>row.company===productionStatisticsState.company)){
    productionStatisticsState.company="全部";
  }
  return productionStatisticsState.company || "全部";
}

function getProductionStatisticsFilteredRecords(industry){
  if(!industry)return [];
  const company=getActiveProductionStatisticsCompany(industry);
  const records=Array.isArray(industry.records)?industry.records:[];
  if(company==="全部")return records;
  return records.filter(record=>record.company===company);
}

function setProductionStatisticsIndustry(industry){
  productionStatisticsState.industry=industry || "";
  productionStatisticsState.company="全部";
  renderProductionStatisticsDashboardPreservingScroll();
}

function setProductionStatisticsCompany(company){
  productionStatisticsState.company=company || "全部";
  renderProductionStatisticsDashboardPreservingScroll();
}

function renderProductionStatisticsIncludedValue(record){
  return `<span class="production-statistics-include ${record.included==="是"?"yes":record.included==="否"?"no":""}">${productionStatisticsText(record.included)}</span>`;
}

function renderProductionStatisticsMetricValue(value){
  return productionStatisticsText(formatProductionStatisticsNumber(value,2));
}

function renderProductionStatisticsYoYValue(value){
  return `<span class="yoy ${getProductionStatisticsYoYClass(value)}">${productionStatisticsText(value)}</span>`;
}

function getProductionStatisticsRealEstateMetricValue(record,period,key){
  const value=record?.metrics?.[period]?.[key];
  return value===undefined || value===null ? "" : value;
}

if(typeof tableColumnDefinitions!=="undefined"){
  const productionStatisticsCommonColumns=[
    {key:"index",title:"序号",width:70,align:"center",render:(record,index)=>index+1},
    {key:"legalEntity",title:"纳统企业",width:240,render:record=>productionStatisticsText(record.legalEntity)},
    {key:"company",title:"所属公司",width:120,render:record=>productionStatisticsText(record.company)},
    {key:"industryCategory",title:"行业",width:120,render:record=>productionStatisticsText(record.industryCategory)},
    {key:"scale",title:"规上/规下",width:100,align:"center",render:record=>productionStatisticsText(record.scale)},
    {key:"registeredCapital",title:"注册资本",width:110,align:"right",render:record=>productionStatisticsText(record.registeredCapital)},
    {key:"registeredCity",title:"注册市",width:110,render:record=>productionStatisticsText(record.registeredCity)},
    {key:"registeredDistrict",title:"注册区",width:110,render:record=>productionStatisticsText(record.registeredDistrict)},
    {key:"businessPlace",title:"经营地",width:120,render:record=>productionStatisticsText(record.businessPlace)},
    {key:"constructionQualification",title:"建筑资质",width:100,align:"center",render:record=>productionStatisticsText(record.constructionQualification)},
    {key:"realEstateQualification",title:"房产资质",width:100,align:"center",render:record=>productionStatisticsText(record.realEstateQualification)},
    {key:"financialSupervision",title:"金融监管",width:100,align:"center",render:record=>productionStatisticsText(record.financialSupervision)},
    {key:"financialLicense",title:"金融牌照",width:100,align:"center",render:record=>productionStatisticsText(record.financialLicense)},
    {key:"included",title:"是否纳统",width:100,align:"center",render:record=>renderProductionStatisticsIncludedValue(record)},
    {key:"statisticsPlace",title:"纳统地",width:160,render:record=>productionStatisticsText(record.statisticsPlace)},
    {key:"lineType",title:"在地",width:90,align:"center",render:record=>productionStatisticsText(record.lineType)}
  ];
  const productionStatisticsTailColumns=[
    {key:"department",title:"负责部门",width:140,render:record=>productionStatisticsText(record.department)},
    {key:"contact",title:"联系人",width:100,render:record=>productionStatisticsText(record.contact)},
    {key:"phone",title:"电话",width:130,render:record=>productionStatisticsText(record.phone)}
  ];

  tableColumnDefinitions.productionStatisticsDetail=[
    ...productionStatisticsCommonColumns,
    {key:"annual2025",title:"2025全年",width:110,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.annual2025)},
    {key:"plan2026",title:"2026计划",width:110,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.plan2026)},
    {key:"planYoY",title:"计划同比",width:100,align:"right",render:record=>renderProductionStatisticsYoYValue(record.metrics?.planYoY)},
    {key:"month2025",title:"2025年06月",width:120,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.month2025)},
    {key:"month2026",title:"2026年06月",width:120,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.month2026)},
    {key:"monthYoY",title:"月同比",width:100,align:"right",render:record=>renderProductionStatisticsYoYValue(record.metrics?.monthYoY)},
    {key:"ytd2025",title:"2025年累计",width:120,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.ytd2025)},
    {key:"ytd2026",title:"2026年累计",width:120,align:"right",render:record=>renderProductionStatisticsMetricValue(record.metrics?.ytd2026)},
    {key:"ytdYoY",title:"累计同比",width:100,align:"right",render:record=>renderProductionStatisticsYoYValue(record.metrics?.ytdYoY)},
    ...productionStatisticsTailColumns
  ];

  tableColumnDefinitions.productionStatisticsRealEstateDetail=[
    ...productionStatisticsCommonColumns,
    ...["annual2025","month2025","ytd2025","plan2026","month2026","ytd2026"].flatMap(period=>{
      const periodTitle={
        annual2025:"2025全年",
        month2025:"2025年06月",
        ytd2025:"2025年累计",
        plan2026:"2026计划",
        month2026:"2026年06月",
        ytd2026:"2026年累计"
      }[period];
      return [
        {key:`${period}Output`,title:`${periodTitle}产值`,width:130,align:"right",render:record=>renderProductionStatisticsMetricValue(getProductionStatisticsRealEstateMetricValue(record,period,"output"))},
        {key:`${period}Revenue`,title:`${periodTitle}营收`,width:130,align:"right",render:record=>renderProductionStatisticsMetricValue(getProductionStatisticsRealEstateMetricValue(record,period,"revenue"))},
        {key:`${period}Investment`,title:`${periodTitle}投资`,width:130,align:"right",render:record=>renderProductionStatisticsMetricValue(getProductionStatisticsRealEstateMetricValue(record,period,"investment"))},
        {key:`${period}SalesArea`,title:`${periodTitle}销售面积`,width:150,align:"right",render:record=>renderProductionStatisticsMetricValue(getProductionStatisticsRealEstateMetricValue(record,period,"salesArea"))}
      ];
    }),
    ...productionStatisticsTailColumns
  ];
}

function getProductionStatisticsDetailTableKey(industry){
  return industry?.name==="房地产业" ? "productionStatisticsRealEstateDetail" : "productionStatisticsDetail";
}

function openProductionStatisticsColumnSetting(){
  const industry=getActiveProductionStatisticsIndustry();
  const tableKey=getProductionStatisticsDetailTableKey(industry);
  if(typeof openColumnSetting==="function"){
    openColumnSetting(tableKey,"renderProductionStatisticsDetailsAfterColumnSetting");
  }
}

function renderProductionStatisticsDetailsAfterColumnSetting(){
  replaceProductionScreenFragment(productionScreenSlot("statistics-details"),renderProductionStatisticsDetails());
}

function renderProductionStatisticsKpis(){
  const data=getProductionStatisticsData();
  const overall=data.overall || {};
  const industries=getProductionStatisticsIndustries();
  const includedRate=formatProductionStatisticsProgress(overall.includedCount,overall.entityCount);
  const cards=[
    {label:"纳统企业",value:overall.entityCount || 0,unit:"家",note:``,tone:"cyan"},
    {label:"已纳统企业",value:overall.includedCount || 0,unit:"家",note:`纳统率 ${includedRate}`,tone:"green"},
    {label:"2026计划纳统值",value:formatProductionStatisticsAmount(overall.plan2026),unit:"",note:"按各业态计划汇总",tone:"orange"},
    {label:"2026年6月纳统值",value:formatProductionStatisticsAmount(overall.month2026),unit:"",note:"按各业态本月汇总",tone:"blue"},
    {label:"1-6月累计纳统值",value:formatProductionStatisticsAmount(overall.ytd2026),unit:"",note:`计划完成 ${formatProductionStatisticsProgress(overall.ytd2026,overall.plan2026)}`,tone:"purple"}
  ];
  return cards.map(card=>`
    <article class="production-statistics-kpi ${card.tone}">
      <span>${card.label}</span>
      <strong>${card.value}<em>${card.unit}</em></strong>
      <p>${card.note}</p>
    </article>
  `).join("");
}

function renderProductionStatisticsIndustryCards(){
  const industries=getProductionStatisticsIndustries();
  const active=getActiveProductionStatisticsIndustry();
  return industries.map((industry,index)=>{
    const summary=industry.summary || {};
    const progressText=formatProductionStatisticsProgress(summary.ytd2026,summary.plan2026);
    const progressValue=getProductionStatisticsProgressValue(summary.ytd2026,summary.plan2026);
    const includedRate=formatProductionStatisticsProgress(summary.includedCount,summary.entityCount);
    return `
      <button type="button" class="production-statistics-industry-card tone-${index%6} ${active?.name===industry.name?"active":""}" onclick="setProductionStatisticsIndustry('${productionStatisticsJsArg(industry.name)}')">
        <span>${productionStatisticsText(industry.name)}</span>
        <strong>${productionStatisticsText(getProductionStatisticsMetricName(industry))}</strong>
        <div class="production-statistics-industry-meta">
          <b>${formatProductionStatisticsNumber(summary.entityCount || 0,0)}<em>企业</em></b>
          <b>${formatProductionStatisticsNumber(summary.includedCount || 0,0)}<em>已纳统</em></b>
        </div>
        <div class="production-statistics-industry-values">
          <p><i>年度计划</i><em>${formatProductionStatisticsAmount(summary.plan2026)}</em></p>
          <p><i>本月</i><em>${formatProductionStatisticsAmount(summary.month2026)}</em></p>
          <p><i>累计</i><em>${formatProductionStatisticsAmount(summary.ytd2026)}</em></p>
        </div>
        <div class="production-statistics-progress">
          <span><i style="width:${progressValue.toFixed(2)}%"></i></span>
          <em>${progressText}</em>
        </div>
        <small>纳统率 ${includedRate}</small>
      </button>
    `;
  }).join("");
}

function renderProductionStatisticsCompanyHeader(){
  const industry=getActiveProductionStatisticsIndustry();
  const company=getActiveProductionStatisticsCompany(industry);
  if(!industry)return "";
  return `
    <div class="production-overview-panel-hd production-statistics-panel-hd">
      <h3>${productionStatisticsText(industry.name)}公司维度</h3>
      <div class="production-statistics-panel-actions">
        <span>${productionStatisticsText(getProductionStatisticsMetricName(industry))}</span>
        <b>${productionStatisticsText(company)}</b>
      </div>
    </div>
  `;
}

function renderProductionStatisticsCompanies(){
  const industry=getActiveProductionStatisticsIndustry();
  if(!industry)return `<div class="project-log-empty">暂无纳统数据</div>`;
  const activeCompany=getActiveProductionStatisticsCompany(industry);
  return `
    <div class="production-statistics-company-list">
      ${getProductionStatisticsCompanyRows(industry).map(row=>{
        const progressValue=getProductionStatisticsProgressValue(row.ytd2026,row.plan2026);
        const progressText=formatProductionStatisticsProgress(row.ytd2026,row.plan2026);
        return `
          <button type="button" class="production-statistics-company-row ${row.company===activeCompany?"active":""} ${row.isAll?"all":""}" onclick="setProductionStatisticsCompany('${productionStatisticsJsArg(row.company)}')">
            <span class="name">${productionStatisticsText(row.company)}</span>
            <span><b>${formatProductionStatisticsNumber(row.entityCount || 0,0)}</b><em>企业</em></span>
            <span><b>${formatProductionStatisticsNumber(row.includedCount || 0,0)}</b><em>已纳统</em></span>
            <span><b>${formatProductionStatisticsAmount(row.ytd2026)}</b><em>累计</em></span>
            <span class="bar"><i style="width:${progressValue.toFixed(2)}%"></i><em>${progressText}</em></span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderProductionStatisticsDetailHeader(){
  const industry=getActiveProductionStatisticsIndustry();
  if(!industry)return "";
  const activeCompany=getActiveProductionStatisticsCompany(industry);
  const records=getProductionStatisticsFilteredRecords(industry);
  return `
    <div class="production-overview-panel-hd production-statistics-panel-hd">
      <h3>${productionStatisticsText(industry.name)}纳统企业明细</h3>
      <div class="production-statistics-panel-actions">
        <span>${productionStatisticsText(activeCompany)}</span>
        <b>${records.length} 行</b>
        <button class="column-setting-icon-btn" type="button" title="列设置" onclick="openProductionStatisticsColumnSetting()">⚙</button>
      </div>
    </div>
  `;
}

function renderProductionStatisticsRecordType(record){
  const labels={detail:"明细",line:"分行",subtotal:"小计",total:"合计"};
  return labels[record?.recordType] || record?.recordType || "-";
}

function getProductionStatisticsEntityMergeRows(records){
  const rows=new Array(records.length).fill(null);
  for(let index=0;index<records.length;){
    const legalEntity=records[index]?.legalEntity || "";
    let end=index+1;
    while(legalEntity && end<records.length && records[end]?.legalEntity===legalEntity){
      end++;
    }
    const rowspan=end-index;
    rows[index]={visible:true,rowspan};
    for(let hiddenIndex=index+1;hiddenIndex<end;hiddenIndex++){
      rows[hiddenIndex]={visible:false,rowspan:0};
    }
    index=end;
  }
  return rows;
}

function renderProductionStatisticsLegalEntityCell(record,mergeRow){
  if(mergeRow && !mergeRow.visible)return "";
  const rowspan=mergeRow?.rowspan>1 ? ` rowspan="${mergeRow.rowspan}"` : "";
  return `<td${rowspan} class="name production-statistics-merged-cell">${productionStatisticsText(record.legalEntity)}</td>`;
}

function renderProductionStatisticsCommonCells(record,index,mergeRow){
  return `
    <td>${index+1}</td>
    ${renderProductionStatisticsLegalEntityCell(record,mergeRow)}
    <td>${productionStatisticsText(record.company)}</td>
    <td>${productionStatisticsText(record.industryCategory)}</td>
    <td>${productionStatisticsText(record.scale)}</td>
    <td>${productionStatisticsText(record.registeredCapital)}</td>
    <td>${productionStatisticsText(record.registeredCity)}</td>
    <td>${productionStatisticsText(record.registeredDistrict)}</td>
    <td>${productionStatisticsText(record.businessPlace)}</td>
    <td>${productionStatisticsText(record.constructionQualification)}</td>
    <td>${productionStatisticsText(record.realEstateQualification)}</td>
    <td>${productionStatisticsText(record.financialSupervision)}</td>
    <td>${productionStatisticsText(record.financialLicense)}</td>
    <td><span class="production-statistics-include ${record.included==="是"?"yes":record.included==="否"?"no":""}">${productionStatisticsText(record.included)}</span></td>
    <td>${productionStatisticsText(record.statisticsPlace)}</td>
    <td>${productionStatisticsText(record.lineType)}</td>
  `;
}

function renderProductionStatisticsCommonTailCells(record){
  return `
    <td>${productionStatisticsText(record.department)}</td>
    <td>${productionStatisticsText(record.contact)}</td>
    <td>${productionStatisticsText(record.phone)}</td>
  `;
}

function renderProductionStatisticsMetricCell(value){
  return `<td>${productionStatisticsText(formatProductionStatisticsNumber(value,2))}</td>`;
}

function renderProductionStatisticsYoYCell(value){
  return `<td class="yoy ${getProductionStatisticsYoYClass(value)}">${productionStatisticsText(value)}</td>`;
}

function getProductionStatisticsColumnStyle(col){
  const width=Number(col.width)||120;
  const sticky=col.statisticsFrozen ? `;position:sticky;left:${col.statisticsFrozenLeft}px` : "";
  return `width:${width}px;min-width:${width}px;max-width:${width}px;text-align:${col.align||"left"}${sticky}`;
}

function getProductionStatisticsConfiguredColumns(tableKey){
  const frozenKeys=["index","legalEntity"];
  let left=0;
  return getVisibleColumns(tableKey).map(col=>{
    if(!frozenKeys.includes(col.key))return col;
    const frozenCol={...col,statisticsFrozen:true,statisticsFrozenLeft:left};
    left+=Number(col.width)||120;
    return frozenCol;
  });
}

function renderProductionStatisticsConfiguredHeader(columns){
  return columns.map(col=>`
    <th class="${col.statisticsFrozen?"production-statistics-sticky-col":""}" style="${getProductionStatisticsColumnStyle(col)}">${col.title}</th>
  `).join("");
}

function renderProductionStatisticsConfiguredCell(record,index,col,mergeRow){
  if(col.key==="legalEntity"){
    if(mergeRow && !mergeRow.visible)return "";
    const rowspan=mergeRow?.rowspan>1 ? ` rowspan="${mergeRow.rowspan}"` : "";
    return `<td${rowspan} class="name production-statistics-merged-cell ${col.statisticsFrozen?"production-statistics-sticky-col":""}" style="${getProductionStatisticsColumnStyle(col)}">${col.render(record,index)}</td>`;
  }
  return `<td class="${col.statisticsFrozen?"production-statistics-sticky-col":""}" style="${getProductionStatisticsColumnStyle(col)}">${col.render(record,index)}</td>`;
}

function renderProductionStatisticsConfiguredTable(tableKey,records,options={}){
  const columns=getProductionStatisticsConfiguredColumns(tableKey);
  const mergeRows=options.mergeLegalEntity && columns.some(col=>col.key==="legalEntity")
    ? getProductionStatisticsEntityMergeRows(records)
    : [];
  const minWidth=Math.max(getTableMinWidth(tableKey),columns.length*70);
  return `
    <table class="production-statistics-table ${options.className || ""}" style="min-width:${minWidth}px">
      <thead>
        <tr>${renderProductionStatisticsConfiguredHeader(columns)}</tr>
      </thead>
      <tbody>
        ${records.map((record,index)=>`
          <tr class="${productionStatisticsText(record.recordType)}">
            ${columns.map(col=>renderProductionStatisticsConfiguredCell(record,index,col,mergeRows[index])).join("")}
          </tr>
        `).join("") || `<tr><td colspan="${Math.max(columns.length,1)}" style="text-align:center;color:#8a94a6;height:80px">暂无数据</td></tr>`}
      </tbody>
    </table>
  `;
}

function renderProductionStatisticsGenericDetails(records,mergeLegalEntity=false){
  return renderProductionStatisticsConfiguredTable("productionStatisticsDetail",records,{mergeLegalEntity});
}

function getProductionStatisticsRealEstateMetric(record,period,key){
  const value=record?.metrics?.[period]?.[key];
  return value===undefined || value===null ? "" : value;
}

function renderProductionStatisticsRealEstateMetricCells(record,period){
  return ["output","revenue","investment","salesArea"].map(key=>renderProductionStatisticsMetricCell(getProductionStatisticsRealEstateMetric(record,period,key))).join("");
}

function renderProductionStatisticsRealEstateDetails(records){
  return renderProductionStatisticsConfiguredTable("productionStatisticsRealEstateDetail",records,{className:"production-statistics-real-estate-table"});
}

function renderProductionStatisticsDetails(){
  const industry=getActiveProductionStatisticsIndustry();
  if(!industry)return `<div class="project-log-empty">暂无纳统数据</div>`;
  const records=getProductionStatisticsFilteredRecords(industry);
  if(!records.length)return `<div class="project-log-empty">暂无匹配数据</div>`;
  return industry.name==="房地产业"
    ? renderProductionStatisticsRealEstateDetails(records)
    : renderProductionStatisticsGenericDetails(records,industry.name==="建筑业");
}

async function renderProductionStatisticsDashboardPage(){
  detailPage.style.display="none";
  const mounted=await mountProductionScreenTemplate("statistics","block");
  if(mounted.stale)return;
  getActiveProductionStatisticsIndustry();
  replaceProductionScreenFragment(productionScreenSlot("header"),renderProductionScreenHeader("纳统看板"));
  replaceProductionScreenFragment(productionScreenSlot("statistics-kpis"),renderProductionStatisticsKpis());
  replaceProductionScreenFragment(productionScreenSlot("statistics-industries"),renderProductionStatisticsIndustryCards());
  replaceProductionScreenFragment(productionScreenSlot("statistics-company-header"),renderProductionStatisticsCompanyHeader());
  replaceProductionScreenFragment(productionScreenSlot("statistics-companies"),renderProductionStatisticsCompanies());
  replaceProductionScreenFragment(productionScreenSlot("statistics-detail-header"),renderProductionStatisticsDetailHeader());
  replaceProductionScreenFragment(productionScreenSlot("statistics-details"),renderProductionStatisticsDetails());
}

function renderProductionStatisticsDashboardPreservingScroll(){
  renderWithPreservedScroll(renderProductionStatisticsDashboardPage,[".production-statistics-dashboard",".production-statistics-table-wrap","#listPage",".main"]);
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
      <div class="production-value-main-categories" style="--category-count:${Math.max(1,row.categories.length)}">
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
  const isBizPanel=true;
  const dataKey=getProductionValueBizDataKey();
  const values=productionValueBizData[dataKey] || productionValueBizData[productionValueBizTabs[0]];
  const cards=[
    ["年度计划产值总额",values[0],"万元","¥"],
    ["年度累计已完成产值",values[1],"万元","✓"],
    ["产值完成率",values[2],"","◔"],
    ["剩余合同产值",values[3],"万元","♟"]
  ];
  const activeSubTabs=isBizPanel ? productionValueBizSubTabs[productionValueBizActive] : null;
  return `
    <section class="production-value-panel biz-output">
      <div class="production-value-panel-hd"><h2>六大业态产值</h2></div>
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

const productionValueCompanyBusinessRules={
  "上海隧道":["总承包","管线","设计","产品销售"],
  "市政集团":["总承包","设计","产品销售"],
  "上海路桥":["总承包","产品销售"],
  "城建国际":["总承包"],
  "城市环境":["总承包","管线","产品销售"],
  "上海能建":["总承包","管线","设计"],
  "城市运营":["总承包","城市运营","数字"],
  "运营集团":["总承包","城市运营","数字"],
  "地空公司":["总承包","产品销售","房产"],
  "地空":["总承包","产品销售","房产"],
  "城建设计":["总承包","设计"],
  "数字集团":["总承包","数字"],
  "城建投资":["投资"],
  "建元资管":["房产"],
  "城建物资":["产品销售"]
};

const productionValueBusinessDataKeys={
  "产品销售":["产品销售"],
  "设计":["设计"],
  "数字":["数字"],
  "城市运营":["城市运营"],
  "房产":["房产【物业管理】","房产【商业运营】","房产【房产开发】"],
  "投资":["投资【股权项目】","投资【基建项目】","投资【租赁及保理】"]
};

function parseProductionValueMetricNumber(value){
  const num=Number(String(value||"0").replace(/,/g,"").replace("%",""));
  return Number.isFinite(num)?num:0;
}

function cloneProductionValueMainRow(row){
  return {
    ...row,
    categories:row.categories.map(category=>({
      ...category,
      metrics:category.metrics.map(metric=>({...metric}))
    }))
  };
}

function getProductionValueBusinessMetrics(type){
  const keys=productionValueBusinessDataKeys[type] || [];
  const totals=keys.reduce((sum,key)=>{
    const values=productionValueBizData[key] || [];
    sum.plan+=parseProductionValueMetricNumber(values[0]);
    sum.completed+=parseProductionValueMetricNumber(values[1]);
    sum.remaining+=parseProductionValueMetricNumber(values[3]);
    return sum;
  },{plan:0,completed:0,remaining:0});
  const rate=totals.plan?totals.completed/totals.plan*100:0;
  return [
    {label:"年度计划产值总额",value:formatProductionValuePlain(totals.plan,2),unit:"万元"},
    {label:"年度累计已完成产值",value:formatProductionValuePlain(totals.completed,2),unit:"万元"},
    {label:"产值完成率",value:formatProductionValuePlain(rate,2),unit:"%"},
    {label:"剩余合同产值",value:formatProductionValuePlain(totals.remaining,2),unit:"万元"}
  ];
}

function buildProductionValueBusinessMainRow(type){
  return {
    name:type,
    categories:[{
      type:"biz",
      title:"年度统计",
      metrics:getProductionValueBusinessMetrics(type)
    }]
  };
}

function getProductionValueCompanyMainRows(company,baseRows){
  const rules=productionValueCompanyBusinessRules[company] || ["总承包"];
  const baseMap=Object.fromEntries(baseRows.map(row=>[row.name,row]));
  return rules.map(type=>baseMap[type]
    ? cloneProductionValueMainRow(baseMap[type])
    : buildProductionValueBusinessMainRow(type)
  );
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
  const displayMainRows=isAll
    ? constructionMainRows
    : getProductionValueCompanyMainRows(productionValueOrgActive,constructionMainRows);
  const mounted=await mountProductionScreenTemplate("value","block");
  if(mounted.stale)return;
  const dashboard=document.querySelector(".production-value-dashboard");
  if(dashboard)dashboard.classList.toggle("single-company",!isAll);
  replaceProductionScreenFragment(productionScreenSlot("header"),renderProductionScreenHeader("产值看板"));
  replaceProductionScreenFragment(productionScreenSlot("org-tabs"),productionValueOrgs.map(org=>`<button class="${org===productionValueOrgActive?"active":""}" onclick="setProductionValueOrg('${org}')">${org}</button>`).join(""));
  replaceProductionScreenFragment(productionScreenSlot("top"),topStats.map(item=>renderProductionValueMetric(...item)).join(""));
  replaceProductionScreenFragment(productionScreenSlot("main-summary"),mainItems.map(renderProductionValueMainSummaryCard).join(""));
  const matrixSlot=productionScreenSlot("main-matrix");
  if(matrixSlot){
    const useMultiColumn=!isAll && displayMainRows.length>=2;
    const matrixRows=useMultiColumn && displayMainRows.length===2 ? 1 : useMultiColumn ? 2 : Math.max(1,displayMainRows.length);
    const matrixColumns=useMultiColumn && displayMainRows.length===2 ? 2 : useMultiColumn ? Math.ceil(displayMainRows.length/2) : 1;
    matrixSlot.classList.toggle("multi-column",useMultiColumn);
    matrixSlot.style.setProperty("--matrix-row-count",matrixRows);
    matrixSlot.style.setProperty("--matrix-column-count",matrixColumns);
  }
  replaceProductionScreenFragment(matrixSlot,displayMainRows.map(renderProductionValueMainMatrixRow).join(""));
  replaceProductionScreenFragment(productionScreenSlot("right"),isAll?renderProductionValueBizPanel():"");
  replaceProductionScreenFragment(productionScreenSlot("bottom"),[
    renderProductionValueCompanyTable(),
    renderProductionValueReportChart(),
    renderProductionValueMonthlyChart()
  ].join(""));
}

function renderProductionValueDashboardPreservingScroll(){
  renderWithPreservedScroll(renderProductionValueDashboardPage,[".production-value-dashboard",".production-value-panel.company-table table","#listPage",".main"]);
}

Object.assign(window,{
  renderProductionDashboardByKey,
  renderProductionOverviewDashboardPage,
  renderProductionStatisticsDashboardPage,
  renderProductionMajorDashboardPage,
  renderProductionValueDashboardPage,
  renderProductionOverviewDashboardPreservingScroll,
  renderProductionStatisticsDashboardPreservingScroll,
  renderProductionMajorDashboardPreservingScroll,
  renderProductionValueDashboardPreservingScroll,
  renderProductionScreenEmptyPage,
  switchProductionScreenTab,
  setProductionStatisticsIndustry,
  setProductionStatisticsCompany,
  setProductionOverviewFilter,
  setProductionMajorFilter,
  setProductionOverviewCompletionMode,
  setProductionOverviewDeviceMode,
  setProductionOverviewAnalysisMode,
  setProductionOverviewMaterialMode,
  setProductionOverviewMaterialActive,
  setProductionValueOrg,
  setProductionValueBizTab,
  setProductionValueBizSubTab,
  setProductionValueCompanyMode
});
