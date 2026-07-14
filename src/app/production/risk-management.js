/* =========================
   风险管理台账
========================= */
const riskManagementTemplatePath="src/app/production/risk-management.html";
let riskManagementTemplatePromise=null;

function getRiskManagementTemplatesFromDocument(){
  const templates=new Map();
  document.querySelectorAll("template[data-risk-management-template]").forEach(template=>{
    templates.set(template.dataset.riskManagementTemplate,template);
  });
  return templates.size?templates:null;
}

function loadRiskManagementTemplates(){
  const inlineTemplates=getRiskManagementTemplatesFromDocument();
  if(inlineTemplates)return Promise.resolve(inlineTemplates);

  if(!riskManagementTemplatePromise){
    riskManagementTemplatePromise=fetch(riskManagementTemplatePath)
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,"text/html");
        const templates=new Map();
        doc.querySelectorAll("template[data-risk-management-template]").forEach(template=>{
          templates.set(template.dataset.riskManagementTemplate,template);
        });
        return templates;
      })
      .catch(error=>{
        console.warn("load risk templates failed",error);
        riskManagementTemplatePromise=null;
        return new Map();
      });
  }
  return riskManagementTemplatePromise;
}

async function mountRiskManagementTemplate(name){
  const templates=await loadRiskManagementTemplates();
  const template=templates.get(name);
  if(!template){
    const fallback=document.createElement("div");
    fallback.className="project-log-empty";
    fallback.textContent="风险管理页面模板加载失败";
    listPage.replaceChildren(fallback);
    return false;
  }
  listPage.replaceChildren(document.importNode(template.content,true));
  return true;
}

function riskSlot(name){
  return document.querySelector(`[data-risk-slot="${name}"]`);
}

const riskLedgerData=[
  {id:1,orgType:"市政集团",projectName:"安义路商业办公项目",subCompany:"江西分公司",branchCompany:"市政分公司",riskType:"拆除作业",riskName:"拆除作业",riskLevel:"III级",projectManager:"应强 | 131****2829",major:"否",accepted:"否",planStart:"2025-12-20",actualStart:"2025-12-20",planEnd:"2026-01-20",actualEnd:"2026-01-20",duration:"31天",description:"脚手架拆除高度达到24m",supervisor:"应强 | 131****2829",startCount:1,conditionAccepted:"是",status:"已完成",builder:"安义县工业投资发展有限公司",keyCustomer:"",region:"",projectCode:"SUCG03000253"},
  {id:2,orgType:"市政集团",projectName:"安义县新城区产业园标准厂房建设项目一期",subCompany:"江西分公司",branchCompany:"市政分公司",riskType:"高空作业",riskName:"高空作业",riskLevel:"III级",projectManager:"应强 | 131****2829",major:"否",accepted:"否",planStart:"2026-01-01",actualStart:"2026-01-01",planEnd:"2026-02-05",actualEnd:"2026-02-05",duration:"35天",description:"外立面施工高度达到24m",supervisor:"应强 | 131****2829",startCount:1,conditionAccepted:"是",status:"已完成",builder:"安义县工业投资发展有限公司",keyCustomer:"",region:"",projectCode:"SUCG03000253"},
  {id:3,orgType:"市政集团",projectName:"三林滨江南片区项目",subCompany:"第一建筑",branchCompany:"第一建筑",riskType:"起重吊装",riskName:"起重吊装",riskLevel:"II级",projectManager:"程智峰 | 137****5053",major:"否",accepted:"否",planStart:"2025-08-31",actualStart:"2025-08-31",planEnd:"2025-08-28",actualEnd:"2025-08-28",duration:"181天",description:"采用塔吊起重机进行吊装作业",supervisor:"程智峰 | 137****5053",startCount:1,conditionAccepted:"是",status:"已完成",builder:"上海地产三林滨江生态建设有限公司",keyCustomer:"上海地产",region:"上海浦东",projectCode:"smart2507001"},
  {id:4,orgType:"上海隧道",projectName:"漕河泾创新水岸建设工程",subCompany:"市政分公司",branchCompany:"市政分公司",riskType:"深基坑开挖",riskName:"深基坑开挖",riskLevel:"III级",projectManager:"孙伟 | 180****0669",major:"否",accepted:"否",planStart:"2026-01-02",actualStart:"",planEnd:"2026-01-31",actualEnd:"",duration:"29天",description:"基坑开挖深度10m",supervisor:"孙伟 | 180****0669",startCount:0,conditionAccepted:"否",status:"未完成",builder:"上海市漕河泾新兴技术开发区发展有限公司",keyCustomer:"无",region:"",projectCode:"SUCG01000207"},
  {id:5,orgType:"市政集团",projectName:"奉贤新城18单元项目",subCompany:"第二建筑",branchCompany:"第二建筑",riskType:"深基坑开挖",riskName:"A1深基坑开挖",riskLevel:"II级",projectManager:"俞华杰 | 134****0102",major:"否",accepted:"否",planStart:"2025-09-13",actualStart:"",planEnd:"2026-06-30",actualEnd:"",duration:"290天",description:"本工程基坑总面积约45700㎡，基坑总延长约940m",supervisor:"王华明 | 133****2922",startCount:0,conditionAccepted:"否",status:"未完成",builder:"上海肖塘投资发展有限公司",keyCustomer:"无",region:"",projectCode:"SUCG03000260"},
  {id:6,orgType:"市政集团",projectName:"奉贤新城18单元项目",subCompany:"第二建筑",branchCompany:"第二建筑",riskType:"深基坑开挖",riskName:"B1深基坑开挖",riskLevel:"II级",projectManager:"俞华杰 | 134****0102",major:"否",accepted:"否",planStart:"2026-06-01",actualStart:"",planEnd:"2027-03-12",actualEnd:"",duration:"284天",description:"本工程基坑总面积约45700㎡，支护结构复杂",supervisor:"王华明 | 133****2922",startCount:0,conditionAccepted:"否",status:"未完成",builder:"上海肖塘投资发展有限公司",keyCustomer:"无",region:"",projectCode:"SUCG03000260"},
  {id:7,orgType:"市政集团",projectName:"奉贤新城18单元项目",subCompany:"第二建筑",branchCompany:"第二建筑",riskType:"起重吊装",riskName:"A2区装配式吊装",riskLevel:"II级",projectManager:"俞华杰 | 134****0102",major:"否",accepted:"否",planStart:"2025-08-01",actualStart:"",planEnd:"2025-08-09",actualEnd:"",duration:"8天",description:"本项目装配式构件吊装及双机抬吊",supervisor:"王华明 | 133****2922",startCount:0,conditionAccepted:"否",status:"未完成",builder:"上海肖塘投资发展有限公司",keyCustomer:"无",region:"",projectCode:"SUCG03000260"},
  {id:8,orgType:"市政集团",projectName:"龙华西路站改扩建工程",subCompany:"市政分公司",branchCompany:"市政分公司",riskType:"承重支模架",riskName:"承重支模架",riskLevel:"III级",projectManager:"叶飞 | 135****1358",major:"否",accepted:"否",planStart:"2025-11-19",actualStart:"",planEnd:"2026-06-14",actualEnd:"",duration:"207天",description:"模板支撑体系搭设，跨度2米—6米",supervisor:"叶飞 | 135****1358",startCount:1,conditionAccepted:"是",status:"未完成",builder:"景德镇城建开发有限公司",keyCustomer:"",region:"",projectCode:"SUCG03000273"}
];
for(let i=9;i<=26;i++){
  const base=riskLedgerData[(i-1)%8];
  riskLedgerData.push({...base,id:i,projectName:base.projectName+"（第"+i+"标段）",planStart:i%2?"2026-07-01":"2025-09-01",planEnd:i%3?"2027-04-30":"2026-10-31",duration:(90+i*17)+"天",status:i%4===0?"已完成":"未完成",conditionAccepted:i%5===0?"是":"否",startCount:i%3===0?1:0});
}
riskLedgerData.forEach((r,i)=>{
  const areaOptions=["长三角区域","大湾区域","中原区域","海南","境外区域"];
  const provinceOptions=[
    {province:"上海市",city:"上海市",district:"浦东新区"},
    {province:"江西省",city:"南昌市",district:"安义县"},
    {province:"广东省",city:"深圳市",district:"南山区"},
    {province:"河南省",city:"郑州市",district:"郑东新区"},
    {province:"海南省",city:"海口市",district:"美兰区"}
  ];
  const loc=provinceOptions[i%provinceOptions.length];
  r.riskArea=r.riskArea || areaOptions[i%areaOptions.length];
  r.province=r.province || loc.province;
  r.city=r.city || loc.city;
  r.district=r.district || loc.district;
  r.railHighway=r.railHighway || (i%3===0?"是":"否");
  r.startOrderStatus=r.startOrderStatus || (r.startCount>0?"已上传":"未上传");
});
let currentRiskList=[...riskLedgerData];
let activeRiskStat=null;
let riskPageSize=50;
let riskCurrentPage=1;

const riskTypeOptions=["爆破","冰冻法","人工挖孔","起重吊装","深基坑开挖","沉井下沉承台施工","承重支模架","高空作业","爬模","顶管进洞","顶管出洞","顶管近距离穿越","盾构出洞","盾构进洞","盾构近距离穿越","联络通道","拆除作业","水下切割","隧道暗挖","竣密闭空间施工","其他"];
const riskAreaOptions=["长三角区域","大湾区域","中原区域","海南","境外区域"];
const riskProvinceTree={
  "上海市":{"上海市":["浦东新区","徐汇区","闵行区"]},
  "江西省":{"南昌市":["安义县","红谷滩区"],"景德镇市":["昌江区"]},
  "广东省":{"深圳市":["南山区","福田区"],"广州市":["天河区"]},
  "河南省":{"郑州市":["郑东新区","中原区"]},
  "海南省":{"海口市":["美兰区","龙华区"]}
};
function uniqueValues(list,key){
  return [...new Set(list.map(x=>x[key]).filter(Boolean))];
}
function renderRiskMultiSelect(id,options,placeholder){
  return `<select id="${id}" class="select risk-multi-select" multiple size="1" title="${placeholder}">${options.map(x=>`<option value="${x}">${x}</option>`).join("")}</select>`;
}
function renderRiskDateRange(idStart,idEnd){
  return `<div class="date-range ep-date-range"><input id="${idStart}" class="input" type="date"/><span>至</span><input id="${idEnd}" class="input" type="date"/></div>`;
}
function renderRiskSearchableSelect(id,options,placeholder){
  return `<input id="${id}" class="input" list="${id}List" placeholder="${placeholder}"/><datalist id="${id}List">${options.map(x=>`<option value="${x}"></option>`).join("")}</datalist>`;
}
function getSelectedMulti(id){
  const el=document.getElementById(id);
  if(!el)return [];
  return [...el.selectedOptions].map(x=>x.value).filter(Boolean);
}
function inDateRange(value,start,end){
  if(!start&&!end)return true;
  if(!value)return false;
  return (!start||value>=start)&&(!end||value<=end);
}
function includesText(value,keyword){
  return !keyword || String(value||"").includes(keyword);
}
function renderRiskProvinceSelects(){
  const provinces=Object.keys(riskProvinceTree);
  return `
    <select id="riskProvinceFilter" class="select" onchange="syncRiskCityOptions()"><option value="">省</option>${provinces.map(x=>`<option>${x}</option>`).join("")}</select>
    <select id="riskCityFilter" class="select" onchange="syncRiskDistrictOptions()"><option value="">市</option></select>
    <select id="riskDistrictFilter" class="select"><option value="">区</option></select>
  `;
}
function syncRiskCityOptions(){
  const province=document.getElementById("riskProvinceFilter")?.value || "";
  const city=document.getElementById("riskCityFilter");
  const district=document.getElementById("riskDistrictFilter");
  if(city)replaceProductionDashboardFragment(city,`<option value="">市</option>${Object.keys(riskProvinceTree[province]||{}).map(x=>`<option>${x}</option>`).join("")}`);
  if(district)replaceProductionDashboardFragment(district,`<option value="">区</option>`);
}
function syncRiskDistrictOptions(){
  const province=document.getElementById("riskProvinceFilter")?.value || "";
  const city=document.getElementById("riskCityFilter")?.value || "";
  const district=document.getElementById("riskDistrictFilter");
  const list=riskProvinceTree[province]?.[city] || [];
  if(district)replaceProductionDashboardFragment(district,`<option value="">区</option>${list.map(x=>`<option>${x}</option>`).join("")}`);
}

tableColumnDefinitions.riskLedger=[
  {key:"index",title:"序号",width:70,align:"center",render:(r,i)=>i+1},
  {key:"orgType",title:"子公司",width:110,align:"center",render:r=>r.orgType},
  {key:"projectName",title:"项目名称",width:260,render:r=>`<span class="text-ellipsis" title="${r.projectName}">${r.projectName}</span>`},
  {key:"subCompany",title:"分公司",width:130,render:r=>r.subCompany},
  {key:"riskType",title:"风险类型",width:130,render:r=>r.riskType},
  {key:"riskName",title:"风险名称",width:150,render:r=>r.riskName},
  {key:"riskLevel",title:"风险等级",width:100,align:"center",render:r=>tag(r.riskLevel,r.riskLevel==="I级"?"red":r.riskLevel==="II级"?"orange":"blue")},
  {key:"projectManager",title:"项目经理",width:170,render:r=>r.projectManager},
  {key:"major",title:"是否年度风险",width:120,align:"center",render:r=>r.major},
  {key:"accepted",title:"是否特殊/危大验收",width:150,align:"center",render:r=>r.accepted},
  {key:"planStart",title:"计划开始日期",width:130,align:"center",render:r=>r.planStart||"-"},
  {key:"actualStart",title:"实际开始日期",width:130,align:"center",render:r=>r.actualStart||"-"},
  {key:"planEnd",title:"计划完成日期",width:130,align:"center",render:r=>r.planEnd||"-"},
  {key:"actualEnd",title:"实际结束日期",width:130,align:"center",render:r=>r.actualEnd||"-"},
  {key:"duration",title:"持续时间",width:100,align:"center",render:r=>r.duration},
  {key:"description",title:"风险描述",width:280,render:r=>`<span class="text-ellipsis" title="${r.description}">${r.description}</span>`},
  {key:"supervisor",title:"挂牌领导",width:170,render:r=>r.supervisor},
  {key:"startCount",title:"开工令",width:90,align:"center",render:r=>r.startCount?`<a class="link" onclick="showToast('打开开工令')">${r.startCount}</a>`:"-"},
  {key:"conditionAccepted",title:"条件验收",width:100,align:"center",render:r=>r.conditionAccepted},
  {key:"status",title:"风险状态",width:110,align:"center",render:r=>r.status==="已完成"?tag("已完成","green"):tag("未完成","orange")},
  {key:"builder",title:"建设单位",width:240,render:r=>`<span class="text-ellipsis" title="${r.builder}">${r.builder}</span>`},
  {key:"keyCustomer",title:"重点客户",width:110,align:"center",render:r=>r.keyCustomer||"无"},
  {key:"region",title:"核心区域/城市",width:130,render:r=>r.region||"-"},
  {key:"projectCode",title:"项目编号",width:150,render:r=>r.projectCode},
  {key:"operation",title:"操作",width:120,align:"center",render:r=>`<a class="link" onclick="showToast('查看风险：${r.riskName}')">查看</a> ｜ <a class="link" onclick="showToast('编辑风险：${r.riskName}')">编辑</a>`}
];

async function renderRiskLedgerPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  riskCurrentPage=1;
  const subCompanyOptions=uniqueValues(riskLedgerData,"orgType").concat(uniqueValues(riskLedgerData,"subCompany")).filter((x,i,a)=>a.indexOf(x)===i);
  const branchCompanyOptions=uniqueValues(riskLedgerData,"branchCompany");
  const mounted=await mountRiskManagementTemplate("ledger");
  if(!mounted)return;
  replaceProductionDashboardFragment(riskSlot("level"),renderRiskMultiSelect("riskLevelFilter",["I级","II级","III级"],"请选择风险等级"));
  replaceProductionDashboardFragment(riskSlot("type"),renderRiskMultiSelect("riskTypeFilter",riskTypeOptions,"请选择风险类型"));
  replaceProductionDashboardFragment(riskSlot("sub-company"),renderRiskSearchableSelect("riskSubCompany",subCompanyOptions,"输入关键字选择子公司"));
  replaceProductionDashboardFragment(riskSlot("branch-company"),renderRiskSearchableSelect("riskBranchCompany",branchCompanyOptions,"输入关键字选择分公司"));
  replaceProductionDashboardFragment(riskSlot("plan-start"),renderRiskDateRange("riskPlanStartFrom","riskPlanStartTo"));
  replaceProductionDashboardFragment(riskSlot("actual-start"),renderRiskDateRange("riskActualStartFrom","riskActualStartTo"));
  replaceProductionDashboardFragment(riskSlot("plan-end"),renderRiskDateRange("riskPlanEndFrom","riskPlanEndTo"));
  replaceProductionDashboardFragment(riskSlot("actual-end"),renderRiskDateRange("riskActualEndFrom","riskActualEndTo"));
  replaceProductionDashboardFragment(riskSlot("area"),renderRiskMultiSelect("riskAreaFilter",riskAreaOptions,"请选择所属区域"));
  replaceProductionDashboardFragment(riskSlot("province"),renderRiskProvinceSelects());
  const table=document.getElementById("riskTable");
  if(table)table.style.minWidth=getTableMinWidth("riskLedger")+"px";
  document.querySelector("[data-risk-reset]")?.addEventListener("click",resetRiskFilter);
  document.querySelector("[data-risk-query]")?.addEventListener("click",applyRiskFilter);
  document.querySelector("[data-risk-query-toggle]")?.addEventListener("click",()=>toggleUnifiedQueryCard("riskQueryCard"));
  document.querySelector("[data-risk-export]")?.addEventListener("click",()=>showToast("导出成功：已生成风险管控清单.xlsx"));
  document.querySelector("[data-risk-refresh]")?.addEventListener("click",()=>showToast("已刷新风险台账数据"));
  document.querySelector("[data-risk-column-setting]")?.addEventListener("click",()=>openColumnSetting("riskLedger","renderRiskTable"));
  document.querySelector("[data-risk-page-prev]")?.addEventListener("click",()=>changeRiskPage(-1));
  document.querySelector("[data-risk-page-next]")?.addEventListener("click",()=>changeRiskPage(1));
  document.querySelector("[data-risk-page-size]")?.addEventListener("change",event=>changeRiskPageSize(event.target.value));
  currentRiskList=[...riskLedgerData];
  activeRiskStat=null;
  renderRiskTable();
}
function getRiskPagedList(){const start=(riskCurrentPage-1)*riskPageSize;return currentRiskList.slice(start,start+riskPageSize);}
function renderRiskTable(){
  const table=document.getElementById('riskTable'); const thead=document.getElementById('riskThead');
  if(table)table.style.minWidth=getTableMinWidth('riskLedger')+'px';
  replaceProductionDashboardFragment(thead,renderTableHeaderByColumns('riskLedger'));
  renderTableByColumns('riskLedger',getRiskPagedList(),'riskTbody');
  const total=document.getElementById('riskTotalText'); if(total)total.innerText=`共 ${currentRiskList.length} 条记录`;
  const pageText=document.getElementById('riskPageText'); if(pageText)pageText.innerText=`${riskCurrentPage} / ${Math.max(1,Math.ceil(currentRiskList.length/riskPageSize))}`;
  renderRiskStats();
}
function renderRiskStats(){
  const box=document.getElementById('riskStatsBox'); if(!box)return;
  const c=fn=>riskLedgerData.filter(fn).length;
  const groups=[
    {name:'风险等级',key:'level',items:[['I级',c(r=>r.riskLevel==='I级')],['II级',c(r=>r.riskLevel==='II级')],['III级',c(r=>r.riskLevel==='III级')]]},
    {name:'今年完成',key:'finished',items:[['全部',c(r=>r.status==='已完成')],['I级',c(r=>r.status==='已完成'&&r.riskLevel==='I级')],['II级',c(r=>r.status==='已完成'&&r.riskLevel==='II级')],['III级',c(r=>r.status==='已完成'&&r.riskLevel==='III级')]]},
    {name:'进行中',key:'running',items:[['全部',c(r=>r.status==='未完成')],['I级',c(r=>r.status==='未完成'&&r.riskLevel==='I级')],['II级',c(r=>r.status==='未完成'&&r.riskLevel==='II级')],['III级',c(r=>r.status==='未完成'&&r.riskLevel==='III级')]]},
    {name:'风险状态',key:'status',items:[['已完成',c(r=>r.status==='已完成')],['未完成',c(r=>r.status==='未完成')]]},
    {name:'条件验收',key:'accepted',items:[['是',c(r=>r.conditionAccepted==='是')],['否',c(r=>r.conditionAccepted==='否')]]}
  ];
  replaceProductionDashboardFragment(box,groups.map(g=>`<div class="risk-stat"><div class="risk-stat-name">${g.name}</div><div class="risk-stat-items">${g.items.map(it=>`<div class="risk-stat-chip ${activeRiskStat?.key===g.key&&activeRiskStat?.val===it[0]?'active':''}" onclick="filterRiskByStat('${g.key}','${it[0]}')"><strong>${it[1]}</strong><span>${it[0]}</span></div>`).join('')}</div></div>`).join(''));
}
function applyRiskFilter(){
  const name=document.getElementById("riskNameFilter")?.value.trim() || "";
  const desc=document.getElementById("riskDescFilter")?.value.trim() || "";
  const levels=getSelectedMulti("riskLevelFilter");
  const types=getSelectedMulti("riskTypeFilter");
  const projectName=document.getElementById("riskProjectNameFilter")?.value.trim() || "";
  const sub=document.getElementById("riskSubCompany")?.value.trim() || "";
  const branch=document.getElementById("riskBranchCompany")?.value.trim() || "";
  const manager=document.getElementById("riskProjectManagerFilter")?.value.trim() || "";
  const supervisor=document.getElementById("riskSupervisorFilter")?.value.trim() || "";
  const startOrder=document.getElementById("riskStartOrderFilter")?.value || "";
  const major=document.getElementById("riskMajorFilter")?.value || "";
  const railHighway=document.getElementById("riskRailHighwayFilter")?.value || "";
  const condition=document.getElementById("riskConditionFilter")?.value || "";
  const status=document.getElementById("riskStatusFilter")?.value || "";
  const areas=getSelectedMulti("riskAreaFilter");
  const province=document.getElementById("riskProvinceFilter")?.value || "";
  const city=document.getElementById("riskCityFilter")?.value || "";
  const district=document.getElementById("riskDistrictFilter")?.value || "";

  currentRiskList=riskLedgerData.filter(r=>
    includesText(r.riskName,name) &&
    includesText(r.description,desc) &&
    (!levels.length || levels.includes(r.riskLevel)) &&
    (!types.length || types.includes(r.riskType)) &&
    includesText(r.projectName,projectName) &&
    (!sub || includesText(r.orgType,sub) || includesText(r.subCompany,sub)) &&
    (!branch || includesText(r.branchCompany,branch) || includesText(r.subCompany,branch)) &&
    includesText(r.projectManager,manager) &&
    inDateRange(r.planStart,document.getElementById("riskPlanStartFrom")?.value,document.getElementById("riskPlanStartTo")?.value) &&
    inDateRange(r.actualStart,document.getElementById("riskActualStartFrom")?.value,document.getElementById("riskActualStartTo")?.value) &&
    inDateRange(r.planEnd,document.getElementById("riskPlanEndFrom")?.value,document.getElementById("riskPlanEndTo")?.value) &&
    inDateRange(r.actualEnd,document.getElementById("riskActualEndFrom")?.value,document.getElementById("riskActualEndTo")?.value) &&
    includesText(r.supervisor,supervisor) &&
    (!startOrder || r.startOrderStatus===startOrder) &&
    (!major || r.major===major) &&
    (!railHighway || r.railHighway===railHighway) &&
    (!condition || r.conditionAccepted===condition) &&
    (!status || r.status===status) &&
    (!areas.length || areas.includes(r.riskArea)) &&
    (!province || r.province===province) &&
    (!city || r.city===city) &&
    (!district || r.district===district)
  );
  activeRiskStat=null; riskCurrentPage=1; renderRiskTable();
}
function resetRiskFilter(){
  [
    "riskNameFilter","riskDescFilter","riskLevelFilter","riskTypeFilter","riskProjectNameFilter","riskSubCompany","riskBranchCompany","riskProjectManagerFilter",
    "riskPlanStartFrom","riskPlanStartTo","riskActualStartFrom","riskActualStartTo","riskPlanEndFrom","riskPlanEndTo","riskActualEndFrom","riskActualEndTo",
    "riskSupervisorFilter","riskStartOrderFilter","riskMajorFilter","riskRailHighwayFilter","riskConditionFilter","riskStatusFilter","riskAreaFilter",
    "riskProvinceFilter","riskCityFilter","riskDistrictFilter"
  ].forEach(id=>{const el=document.getElementById(id); if(el)el.value="";});
  syncRiskCityOptions();
  currentRiskList=[...riskLedgerData]; activeRiskStat=null; riskCurrentPage=1; renderRiskTable();
}
function filterRiskByStat(key,val){
  if(activeRiskStat?.key===key&&activeRiskStat?.val===val){activeRiskStat=null; currentRiskList=[...riskLedgerData]; renderRiskTable(); return;}
  activeRiskStat={key,val};
  currentRiskList=riskLedgerData.filter(r=> key==='level'?r.riskLevel===val : key==='finished'?(r.status==='已完成'&&(val==='全部'||r.riskLevel===val)) : key==='running'?(r.status==='未完成'&&(val==='全部'||r.riskLevel===val)) : key==='status'?r.status===val : key==='accepted'?r.conditionAccepted===val : true);
  riskCurrentPage=1; renderRiskTable();
}
function changeRiskPage(delta){const max=Math.max(1,Math.ceil(currentRiskList.length/riskPageSize)); riskCurrentPage=Math.min(max,Math.max(1,riskCurrentPage+delta)); renderRiskTable();}
function changeRiskPageSize(v){riskPageSize=Number(v)||50; riskCurrentPage=1; renderRiskTable();}

function renderPcProductionDashboardStartupV2229(){
  if(window.__digitalConstructionMode!=="pc")return;
  activateProductionDashboardMenu();
  renderPcTopNavigation();
  renderSideMenu("production");
  renderProductionOverviewDashboardPage();
}


// V1.0.17_CODE_UPGRADE
// 统一工作履历和抽查记录数据源
window.getWorkHistory = function(worker){
  return worker.workHistory || worker.resume || [];
};
window.getInspectRecords = function(worker){
  return (worker.inspectRecords || worker.records || []).map(r=>{
    if(r.ai || r.inspector==='AI'){
      r.inspector='AI自动抽查';
    }
    return r;
  }).sort((a,b)=>new Date(b.time||b.inspectTime)-new Date(a.time||a.inspectTime));
};
