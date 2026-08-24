/* 企业管理 / 经济 / 经济纳管 / 纳管项目 */
const economyManagementFilterDefaults={
  projectName:"",projectCode:"",company:"",easCode:"",cmNo:"",projectStatus:"",region:"",projectType:"",
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
  return source.map((row,index)=>({
    id:String(row.id||`economy-management-${index+1}`),
    projectCode:row.productionProjectNo||row.projectCode||row.code||`SUCG2026${String(index+1).padStart(6,"0")}`,
    projectName:row.projectName||row.name||"经济纳管示范项目",
    orderCode:row.cmNo||row.orderProjectNo||row.orderCode||`ProjectMdm${String(199725+index).padStart(8,"0")}`,
    company:row.company||row.subCompany||"上海隧道",
    branch:row.branch||row.branchCompany||"轨道交通分公司",
    manager:row.manager||row.projectManager||["王凡","孙金耀","朱良超","秦宝宝","张力"][index%5],
    managerPhone:row.managerPhone||["15971550913","15000513577","13671833289","13621937561","18721987921"][index%5],
    startDate:row.establishDate||row.startDate||"2026-01-11",
    endDate:row.endDate||"2026-12-31",
    easCode:row.easCode||row.projectCode||"",
    projectStatus:row.projectStatus||"在建",
    region:row.region||economyManagementFallbacks.region[index%economyManagementFallbacks.region.length],
    projectType:row.projectType||economyManagementFallbacks.projectType[index%economyManagementFallbacks.projectType.length],
    implementationMode:row.implementationMode||economyManagementFallbacks.implementationMode[index%economyManagementFallbacks.implementationMode.length],
    provinceCity:row.provinceCity||economyManagementFallbacks.provinceCity[index%economyManagementFallbacks.provinceCity.length],
    pushCode:row.pushCode||"",
    batch:row.batch||"",
    subcontractMode:row.subcontractMode||economyManagementFallbacks.subcontractMode[index%economyManagementFallbacks.subcontractMode.length],
    cooperationMode:row.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length],
    classInvestment:row.classInvestment||row.isClassInvestment||(index%4===0?"是":"否"),
    investment:row.investment||row.isInvestment||(row.implementationMode==="PPP"?"是":"否"),
    owner:row.owner||row.builder||economyManagementFallbacks.owner[index%economyManagementFallbacks.owner.length],
    status:row.managementStatus||"pending"
  }));
}
economyManagementRows=getEconomyManagementSeedRows();
function syncEconomyManagementApprovedRows(){
  const approved=Array.isArray(window.economyProjectInitiationApprovedData)?window.economyProjectInitiationApprovedData:[];
  approved.forEach((project,index)=>{
    const id=String(project.id||`approved-${index+1}`);
    const existing=economyManagementRows.find(row=>row.id===id);
    if(existing){if(existing.status!=="managed")existing.status="pending";return;}
    economyManagementRows.push({id,projectCode:project.productionProjectNo||project.projectCode||`SUCG2026${String(index+1).padStart(6,"0")}`,projectName:project.projectName||"经济纳管示范项目",orderCode:project.cmNo||project.orderProjectNo||project.orderCode||"--",company:project.company||project.subCompany||"",branch:project.branch||project.branchCompany||"",manager:project.manager||project.projectManager||"--",managerPhone:project.managerPhone||"--",startDate:project.establishDate||project.startDate||"--",endDate:project.endDate||"--",easCode:project.easCode||project.projectCode||"",projectStatus:project.projectStatus||"在建",region:project.region||economyManagementFallbacks.region[index%economyManagementFallbacks.region.length],projectType:project.projectType||economyManagementFallbacks.projectType[index%economyManagementFallbacks.projectType.length],implementationMode:project.implementationMode||economyManagementFallbacks.implementationMode[index%economyManagementFallbacks.implementationMode.length],provinceCity:project.provinceCity||economyManagementFallbacks.provinceCity[index%economyManagementFallbacks.provinceCity.length],pushCode:"",batch:"",subcontractMode:project.subcontractMode||economyManagementFallbacks.subcontractMode[index%economyManagementFallbacks.subcontractMode.length],cooperationMode:project.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length],classInvestment:project.classInvestment||project.isClassInvestment||(index%4===0?"是":"否"),investment:project.investment||project.isInvestment||(project.implementationMode==="PPP"?"是":"否"),owner:project.owner||project.builder||economyManagementFallbacks.owner[index%economyManagementFallbacks.owner.length],status:"pending"});
  });
}

function setEconomyManagementTab(tab){economyManagementState.tab=tab==="managed"?"managed":"pending";renderEconomyManagementPage();}
function getEconomyManagementFilteredRows(){
  const state=economyManagementState;
  return economyManagementRows.filter(row=>row.status===state.tab
    &&(!state.projectName||row.projectName.includes(state.projectName))
    &&(!state.projectCode||row.projectCode.includes(state.projectCode))
    &&(!state.company||row.company===state.company)
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
function getEconomyManagementOptions(values,current,placeholder){return `<option value="">${placeholder}</option>${[...new Set(values.filter(Boolean))].map(value=>`<option value="${escapeEconomyManagement(value)}" ${value===current?"selected":""}>${escapeEconomyManagement(value)}</option>`).join("")}`;}

function openEconomyManagementModal(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  openModal("纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInput" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>子公司推送编号</label><input class="input" id="economyManagementPushInput" value="${escapeEconomyManagement(row.pushCode)}" placeholder="请输入子公司推送编号"></div><div class="economy-management-modal-field required"><label>批次</label><input class="input" id="economyManagementBatchInput" type="month" value="${escapeEconomyManagement(row.batch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><select class="select" id="economyManagementSubcontractInput">${getEconomyManagementOptions(["专业分包","劳务分包","无分包"],row.subcontractMode,"请选择分包模式")}</select></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInput">${getEconomyManagementOptions(["自营","合作经营","联合体"],row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label><select class="select" id="economyManagementClassInvestmentInput">${getEconomyManagementOptions(["是","否"],row.classInvestment,"请选择是否类投资项目")}</select></div><div class="economy-management-modal-field required"><label>是否投资项目</label><select class="select" id="economyManagementInvestmentInput">${getEconomyManagementOptions(["是","否"],row.investment,"请选择是否投资项目")}</select></div></div>`, `<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagement('${escapeEconomyManagement(row.id)}')">保存</button>`,"large");
}
function submitEconomyManagement(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const values={easCode:document.getElementById("economyManagementEasInput")?.value.trim()||"",pushCode:document.getElementById("economyManagementPushInput")?.value.trim()||"",batch:document.getElementById("economyManagementBatchInput")?.value||"",subcontractMode:document.getElementById("economyManagementSubcontractInput")?.value||"",cooperationMode:document.getElementById("economyManagementCooperationInput")?.value||"",classInvestment:document.getElementById("economyManagementClassInvestmentInput")?.value||"",investment:document.getElementById("economyManagementInvestmentInput")?.value||""};
  const missing=Object.values(values).some(value=>!value);if(missing){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="pending";renderEconomyManagementPage();showToast("项目已纳入经济管控");
}
function renderEconomyManagementPage(){
  detailPage.style.display="none";listPage.style.display="flex";
  syncEconomyManagementApprovedRows();
  const rows=getEconomyManagementFilteredRows();
  const values=key=>economyManagementRows.map(row=>row[key]);
  const queryFields=`
    <div class="form-item"><label>项目名称</label><input class="input" id="economyManagementProjectName" placeholder="请输入项目名称" value="${escapeEconomyManagement(economyManagementState.projectName)}"></div>
    <div class="form-item"><label>项目编号</label><input class="input" id="economyManagementProjectCode" placeholder="请输入项目编号" value="${escapeEconomyManagement(economyManagementState.projectCode)}"></div>
    <div class="form-item"><label>所属组织</label><select class="select" id="economyManagementCompany">${getEconomyManagementOptions(values("company"),economyManagementState.company,"请选择所属组织")}</select></div>
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
  const table=`<section class="card table-card economy-management-table-card"><div class="card-hd"><div class="card-title">${economyManagementState.tab==="managed"?"纳管中项目列表":"待纳管项目列表"}</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead><tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th style="width:140px">子公司名称</th><th style="width:180px">分公司名称</th><th style="width:190px">项目经理</th><th style="width:130px">计划开工日期</th><th style="width:130px">计划完工日期</th><th style="width:110px">状态</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-management-${row.id}`})}</td><td>${escapeEconomyManagement(row.startDate)}</td><td>${escapeEconomyManagement(row.endDate)}</td><td>${economyManagementStatusTag(row.status)}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button>${row.status==="pending"?`<button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">纳入管控</button>`:"--"}</td></tr>`).join("")||`<tr><td colspan="10" class="empty-state">暂无符合条件的项目</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
  const contentHtml=`<div class="economy-management-page"><div class="economy-management-tabs"><button class="${economyManagementState.tab==="pending"?"active":""}" onclick="setEconomyManagementTab('pending')">待纳管 <b>${economyManagementRows.filter(row=>row.status==="pending").length}</b></button><button class="${economyManagementState.tab==="managed"?"active":""}" onclick="setEconomyManagementTab('managed')">纳管中 <b>${economyManagementRows.filter(row=>row.status==="managed").length}</b></button></div>${renderUnifiedQueryCard(queryFields,{id:"economyManagementQuery",gridClass:"search-grid economy-management-search",queryFn:"syncEconomyManagementFilters()",resetFn:"resetEconomyManagementFilters()"})}${table}</div>`;
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-management-standard-list",titleHtml:`<div class="compact-title-row"><div class="module-title">经济纳管 / 纳管项目</div></div>`,contentHtml});
}
