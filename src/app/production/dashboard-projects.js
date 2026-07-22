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
let constructionProjectPageSize=50;
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
    <th class="${col.key==="operation"?"project-operation-col ":""}${getTableColumnClass("constructionProject",col,getVisibleColumns("constructionProject"))}" data-column-key="${escapeAttr(col.key)}" style="${getTableColumnStickyStyle("constructionProject",col,getVisibleColumns("constructionProject"))}width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
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
        <td class="${col.key==="operation"?"project-operation-col ":""}${getTableColumnClass("constructionProject",col,columns)}" data-column-key="${escapeAttr(col.key)}" style="${getTableColumnStickyStyle("constructionProject",col,columns)}width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
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
  constructionProjectPageSize=Number(value)||50;
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
