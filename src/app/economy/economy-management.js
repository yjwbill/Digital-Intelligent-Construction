/* 企业管理 / 经济 / 经济纳管 / 纳管项目 */
const economyManagementFilterDefaults={
  projectName:"",projectCode:"",company:"",branch:"",batch:"",easCode:"",cmNo:"",projectStatus:"",region:"",projectType:"",
  implementationMode:"",provinceCity:"",subcontractMode:"",cooperationMode:"",classInvestment:"",investment:"",manager:"",owner:""
};
const economyManagementState={tab:"pending",...economyManagementFilterDefaults};
const economyManagementFallbacks={
  region:["长三角区域","大湾区域","中原区域"],
  projectType:["市政工程","道路工程","轨交工程"],
  implementationMode:["施工总承包","EPC","PPP"],
  provinceCity:["上海市/松江区","上海市/静安区","浙江省/杭州市"],
  subcontractMode:["专业分包","劳务分包","无分包"],
  cooperationMode:["自营","合作经营","联合体"],
  owner:["上海市道路运输事业发展中心","上海市城市建设投资开发总公司","上海申通地铁建设集团"]
};
let economyManagementRows=[];

function getEconomyManagementSeedRows(){
  const approved=Array.isArray(window.economyProjectInitiationApprovedData)?window.economyProjectInitiationApprovedData:[];
  const source=approved.length?approved:(typeof constructionProjectData!=="undefined"&&Array.isArray(constructionProjectData)?constructionProjectData.slice(0,18):[]);
  const seededRows=source.map((row,index)=>({
    id:String(row.id||`economy-management-${index+1}`),
    projectCode:row.productionProjectNo||row.projectCode||row.code||`SUCG2026${String(index+1).padStart(6,"0")}`,
    projectName:row.projectName||row.name||"经济纳管示范项目",
    contractAmount:Number(row.contractAmount||row.projectCost||0),
    orderCode:row.cmNo||row.orderProjectNo||row.orderCode||`ProjectMdm${String(199725+index).padStart(8,"0")}`,
    company:row.company||row.subCompany||"上海隧道",
    branch:row.branch||row.branchCompany||"轨道交通分公司",
    manager:row.manager||row.projectManager||["王凡","孙金耀","朱良超","秦宝宝","张力"][index%5],
    managerPhone:row.managerPhone||["15971550913","15000513577","13671833289","13621937561","18721987921"][index%5],
    startDate:row.establishDate||row.startDate||"2026-01-11",
    establishDate:row.establishDate||row.startDate||"--",
    bidAmount:Number(row.bidAmount||row.bidPrice||0),
    bidDate:row.bidDate||"--",
    endDate:row.endDate||"2026-12-31",
    easCode:row.easCode||row.projectCode||"",
    internalEasCode:row.internalEasCode||row.internalSubcontractEasCode||"--",
    subsidiaryCode:row.subsidiaryCode||row.pushCode||"--",
    projectStatus:row.projectStatus||"在建",
    region:row.region||economyManagementFallbacks.region[index%economyManagementFallbacks.region.length],
    projectType:row.projectType||economyManagementFallbacks.projectType[index%economyManagementFallbacks.projectType.length],
    implementationMode:row.implementationMode||economyManagementFallbacks.implementationMode[index%economyManagementFallbacks.implementationMode.length],
    provinceCity:row.provinceCity||economyManagementFallbacks.provinceCity[index%economyManagementFallbacks.provinceCity.length],
    pushCode:row.pushCode||"",
    subcontractMode:row.subcontractMode||economyManagementFallbacks.subcontractMode[index%economyManagementFallbacks.subcontractMode.length],
    cooperationMode:row.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length],
    classInvestment:row.classInvestment||row.isClassInvestment||(index%4===0?"是":"否"),
    investment:row.investment||row.isInvestment||(row.implementationMode==="PPP"?"是":"否"),
    owner:row.owner||row.builder||economyManagementFallbacks.owner[index%economyManagementFallbacks.owner.length],
    builder:row.builder||row.owner||"--",
    batch:row.approvalMonth||row.batch||"--",
    uploadBatch:row.uploadBatch||row.managementBatch||"--",
    budgetIncluded:row.budgetIncluded||row.fullBudgetIncluded||"未纳入",
    budgetYear:row.budgetYear||"",
    status:row.status||"pending",managementStatus:row.managementStatus||(row.status==="managed"?"纳管中":"待纳管")
  }));
  const managedDemoRows=[
    {id:"economy-managed-demo-001",projectCode:"CM20260001",projectName:"上海市轨道交通示范线工程",contractAmount:286500,orderCode:"CM-ORD-2026-001",company:"上海隧道",branch:"轨道交通分公司",manager:"王凡",managerPhone:"15971550913",startDate:"2026-01-10",establishDate:"2026-01-10",bidAmount:281800,bidDate:"2025-12-18",endDate:"2028-06-30",easCode:"EAS20260001",internalEasCode:"EAS-SUB-0001",subsidiaryCode:"SHSD-001",projectStatus:"在建",region:"长三角区域",projectType:"轨交工程",implementationMode:"施工总承包",provinceCity:"上海市/松江区",subcontractMode:"专业分包",cooperationMode:"自营",classInvestment:"否",investment:"否",owner:"上海市城市建设投资开发总公司",builder:"上海市城市建设投资开发总公司",batch:"2026-01",uploadBatch:"2026-02",budgetIncluded:"已纳入",budgetYear:"2026",status:"managed",managementStatus:"纳管中"},
    {id:"economy-managed-demo-002",projectCode:"CM20260002",projectName:"临港综合管廊建设项目",contractAmount:198000,orderCode:"CM-ORD-2026-002",company:"市政集团",branch:"水务分公司",manager:"孙金耀",managerPhone:"15000513577",startDate:"2026-02-15",establishDate:"2026-02-15",bidAmount:193600,bidDate:"2026-01-22",endDate:"2027-12-31",easCode:"EAS20260002",internalEasCode:"EAS-SUB-0002",subsidiaryCode:"SZJT-002",projectStatus:"在建",region:"大湾区域",projectType:"市政工程",implementationMode:"EPC",provinceCity:"上海市/静安区",subcontractMode:"劳务分包",cooperationMode:"合作经营",classInvestment:"是",investment:"否",owner:"上海申通地铁建设集团",builder:"上海申通地铁建设集团",batch:"2026-02",uploadBatch:"2026-03",budgetIncluded:"未纳入",budgetYear:"",status:"managed",managementStatus:"纳管中"},
    {id:"economy-managed-demo-003",projectCode:"CM20260003",projectName:"G60科创走廊道路改扩建工程",contractAmount:125600,orderCode:"CM-ORD-2026-003",company:"上海路桥",branch:"道路工程公司",manager:"朱良超",managerPhone:"13671833289",startDate:"2026-03-08",establishDate:"2026-03-08",bidAmount:126800,bidDate:"2026-02-11",endDate:"2027-09-30",easCode:"EAS20260003",internalEasCode:"EAS-SUB-0003",subsidiaryCode:"SHLQ-003",projectStatus:"完工",region:"中原区域",projectType:"道路工程",implementationMode:"PPP",provinceCity:"浙江省/杭州市",subcontractMode:"无分包",cooperationMode:"联合体",classInvestment:"否",investment:"是",owner:"上海市道路运输事业发展中心",builder:"上海市道路运输事业发展中心",batch:"2026-03",uploadBatch:"2026-04",budgetIncluded:"已纳入",budgetYear:"2027",status:"managed",managementStatus:"纳管中"}
  ];
  return seededRows.concat(managedDemoRows);
}
economyManagementRows=getEconomyManagementSeedRows();
function syncEconomyManagementApprovedRows(){
  const approved=Array.isArray(window.economyProjectInitiationApprovedData)?window.economyProjectInitiationApprovedData:[];
  approved.forEach((project,index)=>{
    const id=String(project.id||`approved-${index+1}`);
    const existing=economyManagementRows.find(row=>row.id===id);
    if(existing){if(existing.status!=="managed")existing.status="pending";return;}
    economyManagementRows.push({id,projectCode:project.productionProjectNo||project.projectCode||`SUCG2026${String(index+1).padStart(6,"0")}`,projectName:project.projectName||"经济纳管示范项目",contractAmount:Number(project.contractAmount||project.projectCost||0),orderCode:project.cmNo||project.orderProjectNo||project.orderCode||"--",company:project.company||project.subCompany||"",branch:project.branch||project.branchCompany||"",manager:project.manager||project.projectManager||"--",managerPhone:project.managerPhone||"--",startDate:project.establishDate||project.startDate||"--",establishDate:project.establishDate||project.startDate||"--",bidAmount:Number(project.bidAmount||project.bidPrice||0),bidDate:project.bidDate||"--",endDate:project.endDate||"--",easCode:project.easCode||project.projectCode||"",internalEasCode:project.internalEasCode||"--",subsidiaryCode:project.subsidiaryCode||"--",projectStatus:project.projectStatus||"在建",region:project.region||economyManagementFallbacks.region[index%economyManagementFallbacks.region.length],projectType:project.projectType||economyManagementFallbacks.projectType[index%economyManagementFallbacks.projectType.length],implementationMode:project.implementationMode||economyManagementFallbacks.implementationMode[index%economyManagementFallbacks.implementationMode.length],provinceCity:project.provinceCity||economyManagementFallbacks.provinceCity[index%economyManagementFallbacks.provinceCity.length],pushCode:"",batch:project.approvalMonth||"--",uploadBatch:project.uploadBatch||"--",budgetIncluded:project.budgetIncluded||"未纳入",budgetYear:project.budgetYear||"",subcontractMode:project.subcontractMode||economyManagementFallbacks.subcontractMode[index%economyManagementFallbacks.subcontractMode.length],cooperationMode:project.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length],classInvestment:project.classInvestment||project.isClassInvestment||(index%4===0?"是":"否"),investment:project.investment||project.isInvestment||(project.implementationMode==="PPP"?"是":"否"),owner:project.owner||project.builder||economyManagementFallbacks.owner[index%economyManagementFallbacks.owner.length],builder:project.builder||project.owner||"--",status:"pending",managementStatus:project.managementStatus||"待纳管"});
  });
}

function setEconomyManagementTab(tab){economyManagementState.tab=tab==="managed"?"managed":"pending";renderEconomyManagementPage();}
function getEconomyManagementFilteredRows(){
  const state=economyManagementState;
  return economyManagementRows.filter(row=>row.status===state.tab
    &&(!state.projectName||row.projectName.includes(state.projectName))
    &&(!state.projectCode||row.projectCode.includes(state.projectCode))
    &&(!state.company||row.company===state.company)
    &&(!state.branch||row.branch.includes(state.branch))
    &&(state.tab!=="pending"||!state.batch||row.batch===state.batch)
    &&(!state.easCode||row.easCode.includes(state.easCode))
    &&(!state.cmNo||row.orderCode.includes(state.cmNo))
    &&(!state.projectStatus||row.projectStatus===state.projectStatus)
    &&(!state.region||row.region===state.region)
    &&(!state.projectType||row.projectType===state.projectType)
    &&(!state.implementationMode||row.implementationMode===state.implementationMode)
    &&(!state.provinceCity||row.provinceCity===state.provinceCity)
    &&(!state.subcontractMode||row.subcontractMode===state.subcontractMode)
    &&(!state.cooperationMode||row.cooperationMode===state.cooperationMode)
    &&(!state.classInvestment||row.classInvestment===state.classInvestment)
    &&(!state.investment||row.investment===state.investment)
    &&(!state.manager||row.manager.includes(state.manager))
    &&(!state.owner||row.owner.includes(state.owner)));
}
function syncEconomyManagementFilters(){
  Object.assign(economyManagementState,{
    projectName:document.getElementById("economyManagementProjectName")?.value.trim()||"",
    projectCode:document.getElementById("economyManagementProjectCode")?.value.trim()||"",
    company:document.getElementById("economyManagementCompany")?.value||"",
    branch:document.getElementById("economyManagementBranch")?.value.trim()||"",
    batch:document.getElementById("economyManagementBatch")?.value||"",
    easCode:document.getElementById("economyManagementEasCode")?.value.trim()||"",
    cmNo:document.getElementById("economyManagementCmNo")?.value.trim()||"",
    projectStatus:document.getElementById("economyManagementProjectStatus")?.value||"",
    region:document.getElementById("economyManagementRegion")?.value||"",
    projectType:document.getElementById("economyManagementProjectType")?.value||"",
    implementationMode:document.getElementById("economyManagementImplementationMode")?.value||"",
    provinceCity:document.getElementById("economyManagementProvinceCity")?.value||"",
    subcontractMode:document.getElementById("economyManagementSubcontractMode")?.value||"",
    cooperationMode:document.getElementById("economyManagementCooperationMode")?.value||"",
    classInvestment:document.getElementById("economyManagementClassInvestment")?.value||"",
    investment:document.getElementById("economyManagementInvestment")?.value||"",
    manager:document.getElementById("economyManagementManager")?.value.trim()||"",
    owner:document.getElementById("economyManagementOwner")?.value.trim()||""
  });
  renderEconomyManagementPage();
}
function resetEconomyManagementFilters(){Object.assign(economyManagementState,economyManagementFilterDefaults);renderEconomyManagementPage();}
function escapeEconomyManagement(value){return escapeAttr(value||"");}
function economyManagementStatusTag(status){return tag(status==="managed"?"纳管中":"待纳管",status==="managed"?"green":"orange");}
function economyManagementProjectStatusTag(status){
  const color={"在建":"blue","完工":"green","停工":"orange","已结算":"gray"}[status]||"gray";
  return tag(status||"--",color);
}
function getEconomyManagementOptions(values,current,placeholder){return `<option value="">${placeholder}</option>${[...new Set(values.filter(Boolean))].map(value=>`<option value="${escapeEconomyManagement(value)}" ${value===current?"selected":""}>${escapeEconomyManagement(value)}</option>`).join("")}`;}

function economyManagementMoney(value){
  return Number(value||0)?(Number(value)*10000).toLocaleString("zh-CN"):"--";
}

function economyManagementBudgetLabel(row){
  return row.budgetIncluded==="已纳入"&&row.budgetYear?`已纳入 ${row.budgetYear}`:"未纳入";
}

function cancelEconomyManagement(id){
  const row=economyManagementRows.find(item=>item.id===String(id));
  if(!row)return;
  row.status="pending";
  renderEconomyManagementPage();
  showToast("已取消纳管，项目返回待纳管");
}

function openEconomyManagementModal(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budgetValue=row.budgetIncluded==="已纳入"?row.budgetYear:"未纳入";
  openModal("纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInputV2" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>EAS内部分包编号</label><input class="input" id="economyManagementInternalEasInputV2" value="${escapeEconomyManagement(row.internalEasCode==="--"?"":row.internalEasCode)}" placeholder="请输入EAS内部分包编号"></div><div class="economy-management-modal-field required"><label>子公司项目编号</label><input class="input" id="economyManagementSubsidiaryCodeInputV2" value="${escapeEconomyManagement(row.subsidiaryCode==="--"?"":row.subsidiaryCode)}" placeholder="请输入子公司项目编号"></div><div class="economy-management-modal-field required"><label>上线批次</label><input class="input" id="economyManagementUploadBatchInputV2" type="month" value="${escapeEconomyManagement(row.uploadBatch==="--"?"":row.uploadBatch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><select class="select" id="economyManagementSubcontractInputV2">${getEconomyManagementOptions(economyManagementFallbacks.subcontractMode,row.subcontractMode,"请选择分包模式")}</select></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInputV2">${getEconomyManagementOptions(economyManagementFallbacks.cooperationMode,row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label><select class="select" id="economyManagementClassInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.classInvestment,"请选择是否类投资项目")}</select></div><div class="economy-management-modal-field required"><label>是否投资项目</label><select class="select" id="economyManagementInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.investment,"请选择是否投资项目")}</select></div><div class="economy-management-modal-field required"><label>纳入全面预算</label><select class="select" id="economyManagementBudgetInputV2">${getEconomyManagementOptions(["未纳入","2026","2027","2028"],budgetValue,"请选择预算状态")}</select></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagementV2('${escapeEconomyManagement(row.id)}')">保存</button>` ,"large");
}

function submitEconomyManagementV2(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budget=document.getElementById("economyManagementBudgetInputV2")?.value||"";
  const values={easCode:document.getElementById("economyManagementEasInputV2")?.value.trim()||"",internalEasCode:document.getElementById("economyManagementInternalEasInputV2")?.value.trim()||"",subsidiaryCode:document.getElementById("economyManagementSubsidiaryCodeInputV2")?.value.trim()||"",uploadBatch:document.getElementById("economyManagementUploadBatchInputV2")?.value||"",subcontractMode:document.getElementById("economyManagementSubcontractInputV2")?.value||"",cooperationMode:document.getElementById("economyManagementCooperationInputV2")?.value||"",classInvestment:document.getElementById("economyManagementClassInvestmentInputV2")?.value||"",investment:document.getElementById("economyManagementInvestmentInputV2")?.value||"",budgetIncluded:budget==="未纳入"?"未纳入":"已纳入",budgetYear:budget==="未纳入"?"":budget};
  if(Object.entries(values).some(([key,value])=>["easCode","internalEasCode","subsidiaryCode","uploadBatch","subcontractMode","cooperationMode","classInvestment","investment"].includes(key)&&!value)){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="managed";renderEconomyManagementPage();showToast("项目已纳入经济管控");
}

function renderEconomyManagementManagedTable(rows){
  const header=`<tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th style="width:130px">项目状态</th><th style="width:140px">子公司</th><th style="width:180px">分公司</th><th style="width:200px">项目经理</th><th style="width:160px">项目造价（元）</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th><th style="width:120px">开项批次</th><th style="width:120px">上线批次</th><th style="width:150px">EAS编号</th><th style="width:170px">内部分包EAS编号</th><th style="width:130px">子公司编号</th><th style="width:130px">分包模式</th><th style="width:130px">合作模式</th><th style="width:150px">是否类投资项目</th><th style="width:130px">是否投资项目</th><th style="width:180px">纳入全面预算</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr>`;
  const body=rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td>${economyManagementProjectStatusTag(row.projectStatus)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-managed-${row.id}`})}</td><td class="right">${economyManagementMoney(row.contractAmount)}</td><td>${escapeEconomyManagement(row.establishDate||"--")}</td><td>${escapeEconomyManagement(row.orderCode)}</td><td class="right">${economyManagementMoney(row.bidAmount)}</td><td>${escapeEconomyManagement(row.bidDate||"--")}</td><td>${escapeEconomyManagement(row.builder||"--")}</td><td>${escapeEconomyManagement(row.batch||"--")}</td><td>${escapeEconomyManagement(row.uploadBatch||"--")}</td><td>${escapeEconomyManagement(row.easCode||"--")}</td><td>${escapeEconomyManagement(row.internalEasCode||"--")}</td><td>${escapeEconomyManagement(row.subsidiaryCode||"--")}</td><td>${escapeEconomyManagement(row.subcontractMode||"--")}</td><td>${escapeEconomyManagement(row.cooperationMode||"--")}</td><td>${escapeEconomyManagement(row.classInvestment||"--")}</td><td>${escapeEconomyManagement(row.investment||"--")}</td><td>${escapeEconomyManagement(economyManagementBudgetLabel(row))}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button><button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">编辑</button><button class="link" onclick="cancelEconomyManagement('${escapeEconomyManagement(row.id)}')">取消纳管</button></td></tr>`).join("")||`<tr><td colspan="24" class="empty-state">暂无符合条件的项目</td></tr>`;
  return `<section class="card table-card economy-management-table-card economy-management-managed-table-card"><div class="card-hd"><div class="card-title">纳管中项目列表</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
}

function renderEconomyManagementPendingTable(rows){
  const header=`<tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th style="width:130px">项目状态</th><th style="width:140px">子公司</th><th style="width:180px">分公司</th><th style="width:200px">项目经理</th><th style="width:160px">项目造价（元）</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th><th style="width:120px">开项批次</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr>`;
  const body=rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td>${economyManagementProjectStatusTag(row.projectStatus)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-management-${row.id}`})}</td><td class="right">${economyManagementMoney(row.contractAmount)}</td><td>${escapeEconomyManagement(row.establishDate||"--")}</td><td>${escapeEconomyManagement(row.orderCode)}</td><td class="right">${economyManagementMoney(row.bidAmount)}</td><td>${escapeEconomyManagement(row.bidDate||"--")}</td><td>${escapeEconomyManagement(row.builder||"--")}</td><td>${escapeEconomyManagement(row.batch||"--")}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button><button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">纳入管控</button></td></tr>`).join("")||`<tr><td colspan="15" class="empty-state">暂无符合条件的项目</td></tr>`;
  return `<section class="card table-card economy-management-table-card economy-management-pending-table-card"><div class="card-hd"><div class="card-title">待纳管项目列表</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
}

function openEconomyManagementModal(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  openModal("纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInput" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>EAS内部分包编号</label><input class="input" id="economyManagementInternalEasInput" value="${escapeEconomyManagement(row.internalEasCode==="--"?"":row.internalEasCode)}" placeholder="请输入EAS内部分包编号"></div><div class="economy-management-modal-field required"><label>子公司项目编号</label><input class="input" id="economyManagementSubsidiaryCodeInput" value="${escapeEconomyManagement(row.subsidiaryCode==="--"?(row.pushCode||""):row.subsidiaryCode)}" placeholder="请输入子公司项目编号"></div><div class="economy-management-modal-field required"><label>上线批次</label><input class="input" id="economyManagementUploadBatchInput" type="month" value="${escapeEconomyManagement(row.uploadBatch==="--"?"":row.uploadBatch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><select class="select" id="economyManagementSubcontractInput">${getEconomyManagementOptions(["专业分包","劳务分包","无分包"],row.subcontractMode,"请选择分包模式")}</select></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInput">${getEconomyManagementOptions(["自营","合作经营","联合体"],row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label><select class="select" id="economyManagementClassInvestmentInput">${getEconomyManagementOptions(["是","否"],row.classInvestment,"请选择是否类投资项目")}</select></div><div class="economy-management-modal-field required"><label>是否投资项目</label><select class="select" id="economyManagementInvestmentInput">${getEconomyManagementOptions(["是","否"],row.investment,"请选择是否投资项目")}</select></div></div>`, `<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagement('${escapeEconomyManagement(row.id)}')">保存</button>`,"large");
}
function submitEconomyManagement(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const values={easCode:document.getElementById("economyManagementEasInput")?.value.trim()||"",internalEasCode:document.getElementById("economyManagementInternalEasInput")?.value.trim()||"",subsidiaryCode:document.getElementById("economyManagementSubsidiaryCodeInput")?.value.trim()||"",uploadBatch:document.getElementById("economyManagementUploadBatchInput")?.value||"",subcontractMode:document.getElementById("economyManagementSubcontractInput")?.value||"",cooperationMode:document.getElementById("economyManagementCooperationInput")?.value||"",classInvestment:document.getElementById("economyManagementClassInvestmentInput")?.value||"",investment:document.getElementById("economyManagementInvestmentInput")?.value||""};
  const missing=Object.values(values).some(value=>!value);if(missing){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="pending";renderEconomyManagementPage();showToast("项目已纳入经济管控");
}
function renderEconomyManagementPage(){
  detailPage.style.display="none";listPage.style.display="flex";
  syncEconomyManagementApprovedRows();
  const rows=getEconomyManagementFilteredRows();
  const values=key=>economyManagementRows.map(row=>row[key]);
  const managedQueryFields=`
    <div class="form-item"><label>项目名称</label><input class="input" id="economyManagementProjectName" placeholder="请输入项目名称" value="${escapeEconomyManagement(economyManagementState.projectName)}"></div>
    <div class="form-item"><label>项目编号</label><input class="input" id="economyManagementProjectCode" placeholder="请输入项目编号" value="${escapeEconomyManagement(economyManagementState.projectCode)}"></div>
    <div class="form-item"><label>子公司</label><select class="select" id="economyManagementCompany">${getEconomyManagementOptions(values("company"),economyManagementState.company,"请选择子公司")}</select></div>
    <div class="form-item"><label>分公司</label><select class="select" id="economyManagementBranch">${getEconomyManagementOptions(values("branch"),economyManagementState.branch,"请选择分公司")}</select></div>
    <div class="form-item"><label>EAS编号</label><input class="input" id="economyManagementEasCode" placeholder="请输入EAS编号" value="${escapeEconomyManagement(economyManagementState.easCode)}"></div>
    <div class="form-item"><label>CM编号</label><input class="input" id="economyManagementCmNo" placeholder="请输入CM编号" value="${escapeEconomyManagement(economyManagementState.cmNo)}"></div>
    <div class="form-item"><label>项目状态</label><select class="select" id="economyManagementProjectStatus">${getEconomyManagementOptions(values("projectStatus"),economyManagementState.projectStatus,"请选择项目状态")}</select></div>
    <div class="form-item"><label>区域市场</label><select class="select" id="economyManagementRegion">${getEconomyManagementOptions(values("region"),economyManagementState.region,"请选择区域市场")}</select></div>
    <div class="form-item"><label>项目类型</label><select class="select" id="economyManagementProjectType">${getEconomyManagementOptions(values("projectType"),economyManagementState.projectType,"请选择项目类型")}</select></div>
    <div class="form-item"><label>实施模式</label><select class="select" id="economyManagementImplementationMode">${getEconomyManagementOptions(values("implementationMode"),economyManagementState.implementationMode,"请选择实施模式")}</select></div>
    <div class="form-item"><label>所在省市</label><select class="select" id="economyManagementProvinceCity">${getEconomyManagementOptions(values("provinceCity"),economyManagementState.provinceCity,"请选择所在省市")}</select></div>
    <div class="form-item"><label>分包模式</label><select class="select" id="economyManagementSubcontractMode">${getEconomyManagementOptions(values("subcontractMode"),economyManagementState.subcontractMode,"请选择分包模式")}</select></div>
    <div class="form-item"><label>合作模式</label><select class="select" id="economyManagementCooperationMode">${getEconomyManagementOptions(values("cooperationMode"),economyManagementState.cooperationMode,"请选择合作模式")}</select></div>
    <div class="form-item"><label>是否类投资</label><select class="select" id="economyManagementClassInvestment">${getEconomyManagementOptions(["是","否"],economyManagementState.classInvestment,"请选择是否类投资")}</select></div>
    <div class="form-item"><label>是否投资</label><select class="select" id="economyManagementInvestment">${getEconomyManagementOptions(["是","否"],economyManagementState.investment,"请选择是否投资")}</select></div>
    <div class="form-item"><label>项目经理</label><input class="input" id="economyManagementManager" placeholder="请输入项目经理" value="${escapeEconomyManagement(economyManagementState.manager)}"></div>
    <div class="form-item"><label>业主单位</label><input class="input" id="economyManagementOwner" placeholder="请输入业主单位" value="${escapeEconomyManagement(economyManagementState.owner)}"></div>`;
  const pendingBatchOptions=values("batch").filter(value=>/^\d{4}-\d{2}$/.test(value));
  const pendingQueryFields=`<div class="form-item"><label>项目名称</label><input class="input" id="economyManagementProjectName" placeholder="请输入项目名称" value="${escapeEconomyManagement(economyManagementState.projectName)}"></div><div class="form-item"><label>项目编号</label><input class="input" id="economyManagementProjectCode" placeholder="请输入项目编号" value="${escapeEconomyManagement(economyManagementState.projectCode)}"></div><div class="form-item"><label>项目状态</label><select class="select" id="economyManagementProjectStatus">${getEconomyManagementOptions(values("projectStatus"),economyManagementState.projectStatus,"请选择项目状态")}</select></div><div class="form-item"><label>子公司</label><select class="select" id="economyManagementCompany">${getEconomyManagementOptions(values("company"),economyManagementState.company,"请选择子公司")}</select></div><div class="form-item"><label>分公司</label><input class="input" id="economyManagementBranch" placeholder="请输入分公司" value="${escapeEconomyManagement(economyManagementState.branch)}"></div><div class="form-item"><label>项目经理</label><input class="input" id="economyManagementManager" placeholder="请输入项目经理" value="${escapeEconomyManagement(economyManagementState.manager)}"></div><div class="form-item"><label>订单项目编号</label><input class="input" id="economyManagementCmNo" placeholder="请输入订单项目编号" value="${escapeEconomyManagement(economyManagementState.cmNo)}"></div><div class="form-item"><label>建设单位</label><input class="input" id="economyManagementOwner" placeholder="请输入建设单位" value="${escapeEconomyManagement(economyManagementState.owner)}"></div><div class="form-item"><label>开项批次</label><select class="select" id="economyManagementBatch">${getEconomyManagementOptions(pendingBatchOptions,economyManagementState.batch,"请选择开项批次")}</select></div>`;
  const queryFields=economyManagementState.tab==="pending"?pendingQueryFields:managedQueryFields;
  const table=`<section class="card table-card economy-management-table-card"><div class="card-hd"><div class="card-title">${economyManagementState.tab==="managed"?"纳管中项目列表":"待纳管项目列表"}</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead><tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th style="width:140px">子公司名称</th><th style="width:180px">分公司名称</th><th style="width:190px">项目经理</th><th style="width:130px">计划开工日期</th><th style="width:130px">计划完工日期</th><th style="width:110px">状态</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-management-${row.id}`})}</td><td>${escapeEconomyManagement(row.startDate)}</td><td>${escapeEconomyManagement(row.endDate)}</td><td>${economyManagementStatusTag(row.status)}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button>${row.status==="pending"?`<button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">纳入管控</button>`:"--"}</td></tr>`).join("")||`<tr><td colspan="10" class="empty-state">暂无符合条件的项目</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
  const contentHtml=`<div class="economy-management-page"><div class="economy-management-tabs"><button class="${economyManagementState.tab==="pending"?"active":""}" onclick="setEconomyManagementTab('pending')">待纳管 <b>${economyManagementRows.filter(row=>row.status==="pending").length}</b></button><button class="${economyManagementState.tab==="managed"?"active":""}" onclick="setEconomyManagementTab('managed')">纳管中 <b>${economyManagementRows.filter(row=>row.status==="managed").length}</b></button></div>${renderUnifiedQueryCard(queryFields,{id:"economyManagementQuery",gridClass:"search-grid economy-management-search",queryFn:"syncEconomyManagementFilters()",resetFn:"resetEconomyManagementFilters()"})}${economyManagementState.tab==="pending"?renderEconomyManagementPendingTable(rows):renderEconomyManagementManagedTable(rows)}</div>`;
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-management-standard-list",titleHtml:`<div class="compact-title-row"><div class="module-title">经济纳管 / 纳管项目</div></div>`,contentHtml});
  const managementPendingColumns=["序号","项目名称","项目编号","项目状态","子公司","分公司","项目经理","项目造价（元）","立项完成日期","订单项目编号","中标价（元）","中标日期","建设单位","开项批次","操作"];
  const managementManagedColumns=[...managementPendingColumns.slice(0,-1),"上线批次","EAS编号","EAS内部分包编号","子公司编号","分包模式","合作模式","是否类投资项目","是否投资项目","纳入全面预算","操作"];
  const pendingColumnStorageKey=getEconomyCustomColumnStorageKey("managementPending");
  const managedColumnStorageKey=getEconomyCustomColumnStorageKey("managementManaged");
  if(localStorage.getItem(pendingColumnStorageKey)){
    try{
      const pendingConfig=JSON.parse(localStorage.getItem(pendingColumnStorageKey));
      if(Array.isArray(pendingConfig)){
        const pendingNonOperation=pendingConfig.filter(column=>column.index!==managementPendingColumns.length-1);
        const pendingOperation=pendingConfig.find(column=>column.index===managementPendingColumns.length-1)||{key:`column-${managementPendingColumns.length-1}`,title:"操作",width:120,minWidth:60,visible:true,align:"center"};
        const managedConfig=[...pendingNonOperation.map(column=>({...column})),...managementManagedColumns.slice(managementPendingColumns.length-1,-1).map((title,index)=>({key:`column-${managementPendingColumns.length-1+index}`,index:managementPendingColumns.length-1+index,title,width:120,minWidth:60,visible:true,order:pendingNonOperation.length+index+1,align:"left"})),{...pendingOperation,index:managementManagedColumns.length-1,key:`column-${managementManagedColumns.length-1}`,title:"操作",order:managementManagedColumns.length,align:"center"}];
        localStorage.setItem(managedColumnStorageKey,JSON.stringify(managedConfig));
        const pendingFreeze=localStorage.getItem(getEconomyCustomFreezeStorageKey("managementPending"));
        if(pendingFreeze!==null)localStorage.setItem(getEconomyCustomFreezeStorageKey("managementManaged"),pendingFreeze);
      }
    }catch(error){}
  }
  mountEconomyCustomColumnSettingButton("managementPending",managementPendingColumns,".economy-management-pending-table-card",".economy-management-pending-table-card table","renderEconomyManagementPage");
  mountEconomyCustomColumnSettingButton("managementManaged",managementManagedColumns,".economy-management-managed-table-card",".economy-management-managed-table-card table","renderEconomyManagementPage");
}
