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
function economyManagementDerivedSubcontract(cooperation,classInvestment){return cooperation==="合作"||cooperation==="合作经营"?(classInvestment==="是"?"合作垫资":"合作不垫资"):(classInvestment==="是"?"自营垫资":"自营不垫资");}
function economyManagementDictOptions(code,fallback){const values=typeof dataDictionaryValuesV2284!=="undefined"&&Array.isArray(dataDictionaryValuesV2284[code])?dataDictionaryValuesV2284[code].filter(item=>item.status!=="禁用").map(item=>item.name):[];return values.length?values:fallback;}
function economyManagementNormalizeCooperation(value){return value==="合作经营"||value==="联合体"||value==="合作"?"合作":"自营";}
function economyManagementNormalizeClassInvestment(value){return value==="是"||value==="1"?"是":"否";}
function economyManagementNormalizeInvestment(value){return value==="是"||value==="1"?"是":"否";}
function economyManagementNormalizeImplementation(value){const allowed=economyManagementDictOptions("PROJECT_DELIVERY_MODE",economyManagementFallbacks.implementationMode);return allowed.includes(value)?value:allowed[0];}
function syncEconomyManagementDerivedSubcontract(){const cooperation=document.getElementById("economyManagementCooperationInput")?.value||"";const classInvestment=document.querySelector('input[name="economyManagementClassInvestment"]:checked')?.value||"";const target=document.getElementById("economyManagementSubcontractInput");if(target)target.value=economyManagementDerivedSubcontract(cooperation,classInvestment);}

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
    implementationMode:economyManagementNormalizeImplementation(row.implementationMode||economyManagementFallbacks.implementationMode[index%economyManagementFallbacks.implementationMode.length]),
    provinceCity:row.provinceCity||economyManagementFallbacks.provinceCity[index%economyManagementFallbacks.provinceCity.length],
    pushCode:row.pushCode||"",
    subcontractMode:economyManagementDerivedSubcontract(economyManagementNormalizeCooperation(row.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length]),economyManagementNormalizeClassInvestment(row.classInvestment||row.isClassInvestment||(index%4===0?"是":"否"))),
    cooperationMode:economyManagementNormalizeCooperation(row.cooperationMode||economyManagementFallbacks.cooperationMode[index%economyManagementFallbacks.cooperationMode.length]),
    classInvestment:economyManagementNormalizeClassInvestment(row.classInvestment||row.isClassInvestment||(index%4===0?"是":"否")),
    investment:economyManagementNormalizeInvestment(row.investment||row.isInvestment||(row.implementationMode==="PPP"?"是":"否")),
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
    {id:"economy-managed-demo-003",projectCode:"CM20260003",projectName:"G60科创走廊道路改扩建工程",contractAmount:125600,orderCode:"CM-ORD-2026-003",company:"上海路桥",branch:"道路工程公司",manager:"朱良超",managerPhone:"13671833289",startDate:"2026-03-08",establishDate:"2026-03-08",bidAmount:126800,bidDate:"2026-02-11",endDate:"2027-09-30",easCode:"EAS20260003",internalEasCode:"EAS-SUB-0003",subsidiaryCode:"SHLQ-003",projectStatus:"完工",region:"中原区域",projectType:"道路工程",implementationMode:"PPP",provinceCity:"浙江省/杭州市",subcontractMode:"无分包",cooperationMode:"联合体",classInvestment:"否",investment:"是",owner:"上海市道路运输事业发展中心",builder:"上海市道路运输事业发展中心",batch:"2026-03",uploadBatch:"2026-04",budgetIncluded:"已纳入",budgetYear:"2027",status:"managed",managementStatus:"纳管中"},
    {id:"economy-ended-demo-001",projectCode:"CM20250018",projectName:"虹桥商务区综合交通枢纽工程",contractAmount:168000,orderCode:"CM-ORD-2025-018",company:"上海隧道",branch:"轨道交通分公司",manager:"陈立",managerPhone:"13800011223",startDate:"2025-04-01",establishDate:"2025-04-01",bidAmount:165500,bidDate:"2025-03-12",endDate:"2026-08-31",easCode:"EAS20250018",internalEasCode:"EAS-SUB-0018",subsidiaryCode:"SHSD-018",projectStatus:"完工",region:"长三角区域",projectType:"轨交工程",implementationMode:"施工总承包",provinceCity:"上海市/闵行区",cooperationMode:"自营",classInvestment:"否",investment:"否",owner:"上海虹桥商务区建设管理委员会",builder:"上海虹桥商务区建设管理委员会",batch:"2025-04",uploadBatch:"2025-05",budgetIncluded:"已纳入",budgetYear:"2025",status:"ended",managementStatus:"已结束"},
    {id:"economy-ended-demo-002",projectCode:"CM20250027",projectName:"苏州河东段综合治理项目",contractAmount:97200,orderCode:"CM-ORD-2025-027",company:"市政集团",branch:"水务分公司",manager:"赵宁",managerPhone:"13900022334",startDate:"2025-06-15",establishDate:"2025-06-15",bidAmount:95100,bidDate:"2025-05-20",endDate:"2026-06-30",easCode:"EAS20250027",internalEasCode:"EAS-SUB-0027",subsidiaryCode:"SZJT-027",projectStatus:"完工",region:"长三角区域",projectType:"市政工程",implementationMode:"EPC",provinceCity:"上海市/普陀区",cooperationMode:"合作",classInvestment:"是",investment:"否",owner:"上海市水务局",builder:"上海市水务局",batch:"2025-06",uploadBatch:"2025-07",budgetIncluded:"未纳入",budgetYear:"",status:"ended",managementStatus:"已结束"}
  ];
  return seededRows.concat(managedDemoRows).map(row=>({...row,projectFeature:row.projectFeature||row.projectType,cumulativeOutput:row.cumulativeOutput!==undefined?Number(row.cumulativeOutput):Number(row.contractAmount||0)*.36,cooperationMode:economyManagementNormalizeCooperation(row.cooperationMode),classInvestment:economyManagementNormalizeClassInvestment(row.classInvestment),investment:economyManagementNormalizeInvestment(row.investment),implementationMode:economyManagementNormalizeImplementation(row.implementationMode),subcontractMode:economyManagementDerivedSubcontract(economyManagementNormalizeCooperation(row.cooperationMode),economyManagementNormalizeClassInvestment(row.classInvestment))}));
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

function setEconomyManagementTab(tab){economyManagementState.tab=["pending","managed","ended"].includes(tab)?tab:"pending";renderEconomyManagementPage();}
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
const economyManagementDiagnosisTip=`影响经济诊断健康度最基础的字段如下：
1）影响诊断的前置字段：项目状态、合作模式、是否类投资、是否投资、项目特征、总包含税价（元）、计划开工日期、计划完工日期、开累产值、建设单位
2）影响系统取值的字段：EAS 编号（本项目）、EAS编号（内部分包）、子公司项目编号
3）影响大屏、诊断结果汇总统计的字段：所在省市、区域市场、项目类型、项目实施模式
请仔细检查以上字段是否完善，另外为了保证诊断的真实可信，财务、合同、主材、工期等内容信息也请及时更新`;
function economyManagementHasDiagnosticValue(value){return value!==undefined&&value!==null&&value!==""&&value!=="--";}
function economyManagementMeetsDiagnosis(row){
  const required=[row.projectStatus,row.cooperationMode,row.classInvestment,row.investment,row.projectFeature||row.projectType,Number(row.contractAmount)>0?row.contractAmount:"",row.startDate,row.endDate,Number(row.cumulativeOutput)>0?row.cumulativeOutput:"",row.builder||row.owner,row.easCode,row.internalEasCode,row.subsidiaryCode,row.provinceCity,row.region,row.projectType,row.implementationMode];
  return required.every(economyManagementHasDiagnosticValue);
}
function economyManagementDiagnosisResult(row){
  const meets=economyManagementMeetsDiagnosis(row);
  return `<span class="economy-management-diagnosis-result ${meets?"met":"unmet"}"><i aria-hidden="true"></i>${meets?"已满足":"未满足"}</span>`;
}
function economyManagementDiagnosisHeader(){return `<span class="economy-management-diagnosis-header">满足诊断初步判断${renderInfoTip(economyManagementDiagnosisTip,"economy-management-diagnosis-info")}</span>`;}
function economyManagementLatestUpdate(row,index){return escapeEconomyManagement(row.latestDataUpdatedAt||row.updatedAt||`2026-09-${String(Math.max(1,7-index%7)).padStart(2,"0")} ${String(9+index%8).padStart(2,"0")}:${String((index*7)%60).padStart(2,"0")}`);}
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
  openModal(
    "结束纳管确认",
    `<div class="standard-confirm-modal-content">确认结束“${escapeEconomyManagement(row.projectName)}”的经济纳管吗？结束后项目将移入“结束纳管”列表。</div>`,
    `<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="confirmEndEconomyManagement('${escapeEconomyManagement(row.id)}')">确认结束纳管</button>`
  );
}
function confirmEndEconomyManagement(id){
  const row=economyManagementRows.find(item=>item.id===String(id));
  if(!row)return;
  row.status="ended";
  closeModal();
  economyManagementState.tab="ended";
  renderEconomyManagementPage();
  showToast("已结束纳管，项目已移入结束纳管");
}
function restoreEconomyManagement(id){const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;openEconomyManagementModal(id,true);}

function openEconomyManagementModal(id,isRestore=false){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budgetValue=row.budgetIncluded==="已纳入"?row.budgetYear:"未纳入";
  openModal(isRestore?"恢复经济管控":"纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInputV2" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>EAS内部分包编号</label><input class="input" id="economyManagementInternalEasInputV2" value="${escapeEconomyManagement(row.internalEasCode==="--"?"":row.internalEasCode)}" placeholder="请输入EAS内部分包编号"></div><div class="economy-management-modal-field required"><label>子公司项目编号</label><input class="input" id="economyManagementSubsidiaryCodeInputV2" value="${escapeEconomyManagement(row.subsidiaryCode==="--"?"":row.subsidiaryCode)}" placeholder="请输入子公司项目编号"></div><div class="economy-management-modal-field required"><label>上线批次</label><input class="input" id="economyManagementUploadBatchInputV2" type="month" value="${escapeEconomyManagement(row.uploadBatch==="--"?"":row.uploadBatch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><select class="select" id="economyManagementSubcontractInputV2">${getEconomyManagementOptions(economyManagementFallbacks.subcontractMode,row.subcontractMode,"请选择分包模式")}</select></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInputV2">${getEconomyManagementOptions(economyManagementFallbacks.cooperationMode,row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label><select class="select" id="economyManagementClassInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.classInvestment,"请选择是否类投资项目")}</select></div><div class="economy-management-modal-field required"><label>是否投资项目</label><select class="select" id="economyManagementInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.investment,"请选择是否投资项目")}</select></div><div class="economy-management-modal-field required"><label>纳入全面预算</label><select class="select" id="economyManagementBudgetInputV2">${getEconomyManagementOptions(["未纳入","2026","2027","2028"],budgetValue,"请选择预算状态")}</select></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagementV2('${escapeEconomyManagement(row.id)}')">保存</button>` ,"large");
}

function submitEconomyManagementV2(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budget=document.getElementById("economyManagementBudgetInputV2")?.value||"";
  const values={easCode:document.getElementById("economyManagementEasInputV2")?.value.trim()||"",internalEasCode:document.getElementById("economyManagementInternalEasInputV2")?.value.trim()||"",subsidiaryCode:document.getElementById("economyManagementSubsidiaryCodeInputV2")?.value.trim()||"",uploadBatch:document.getElementById("economyManagementUploadBatchInputV2")?.value||"",subcontractMode:document.getElementById("economyManagementSubcontractInputV2")?.value||"",cooperationMode:document.getElementById("economyManagementCooperationInputV2")?.value||"",classInvestment:document.getElementById("economyManagementClassInvestmentInputV2")?.value||"",investment:document.getElementById("economyManagementInvestmentInputV2")?.value||"",budgetIncluded:budget==="未纳入"?"未纳入":"已纳入",budgetYear:budget==="未纳入"?"":budget};
  if(Object.entries(values).some(([key,value])=>["easCode","internalEasCode","subsidiaryCode","uploadBatch","subcontractMode","cooperationMode","classInvestment","investment"].includes(key)&&!value)){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="managed";renderEconomyManagementPage();showToast("项目已纳入经济管控");
}

function renderEconomyManagementManagedTable(rows){
  const includeDiagnosis=economyManagementState.tab==="managed";
  const header=`<tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="economy-management-diagnosis-column">${economyManagementDiagnosisHeader()}</th><th class="economy-management-update-column">最新数据更新时间</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th style="width:130px">项目状态</th><th style="width:140px">子公司</th><th style="width:180px">分公司</th><th style="width:180px">项目经理</th><th style="width:160px">项目造价（元）</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th><th style="width:120px">开项批次</th><th style="width:120px">上线批次</th><th style="width:150px">EAS编号</th><th style="width:200px">EAS编号（内部分包）</th><th style="width:150px">子公司项目编号</th><th style="width:140px">所在省市</th><th style="width:140px">区域市场</th><th style="width:140px">项目类型</th><th style="width:160px">项目实施模式</th><th style="width:130px;text-align:center">分包模式</th><th style="width:130px;text-align:center">合作模式</th><th style="width:150px;text-align:center">是否类投资项目</th><th style="width:130px;text-align:center">是否投资项目</th><th style="width:180px">纳入全面预算</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr>`;
  const body=rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="economy-management-diagnosis-column">${economyManagementDiagnosisResult(row)}</td><td class="economy-management-update-column">${economyManagementLatestUpdate(row,index)}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td>${economyManagementProjectStatusTag(row.projectStatus)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-managed-${row.id}`})}</td><td class="right">${economyManagementMoney(row.contractAmount)}</td><td>${escapeEconomyManagement(row.establishDate||"--")}</td><td>${escapeEconomyManagement(row.orderCode)}</td><td class="right">${economyManagementMoney(row.bidAmount)}</td><td>${escapeEconomyManagement(row.bidDate||"--")}</td><td>${escapeEconomyManagement(row.builder||"--")}</td><td>${escapeEconomyManagement(row.batch||"--")}</td><td>${escapeEconomyManagement(row.uploadBatch||"--")}</td><td>${escapeEconomyManagement(row.easCode||"--")}</td><td>${escapeEconomyManagement(row.internalEasCode||"--")}</td><td>${escapeEconomyManagement(row.subsidiaryCode||"--")}</td><td>${escapeEconomyManagement(row.provinceCity||"--")}</td><td>${tag(row.region||"--","blue")}</td><td>${tag(row.projectType||"--","gray")}</td><td>${tag(row.implementationMode||"--","blue")}</td><td>${tag(economyManagementDerivedSubcontract(economyManagementNormalizeCooperation(row.cooperationMode),economyManagementNormalizeClassInvestment(row.classInvestment)),"blue")}</td><td>${tag(economyManagementNormalizeCooperation(row.cooperationMode),economyManagementNormalizeCooperation(row.cooperationMode)==="合作"?"orange":"blue")}</td><td>${tag(economyManagementNormalizeClassInvestment(row.classInvestment),economyManagementNormalizeClassInvestment(row.classInvestment)==="是"?"blue":"gray")}</td><td>${tag(economyManagementNormalizeInvestment(row.investment),economyManagementNormalizeInvestment(row.investment)==="是"?"blue":"gray")}</td><td>${(Array.isArray(row.budgetYears)&&row.budgetYears.length?row.budgetYears:(row.budgetYear?[row.budgetYear]:[])).map(year=>tag(year,"blue")).join("")||tag("--","gray")}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button><button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">编辑</button><button class="link" onclick="cancelEconomyManagement('${escapeEconomyManagement(row.id)}')">结束纳管</button></td></tr>`).join("")||`<tr><td colspan="26" class="empty-state">暂无符合条件的项目</td></tr>`;
  const displayHeader=includeDiagnosis?header:header.replace(/<th class="economy-management-diagnosis-column">[\s\S]*?<\/th><th class="economy-management-update-column">[\s\S]*?<\/th>/,"");
  const displayBody=includeDiagnosis?body:body.replace(/<td class="economy-management-diagnosis-column">[\s\S]*?<\/td><td class="economy-management-update-column">[\s\S]*?<\/td>/g,"");
  return `<section class="card table-card economy-management-table-card economy-management-managed-table-card"><div class="card-hd"><div class="card-title">纳管中项目列表</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead>${displayHeader}</thead><tbody>${displayBody}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
}

function renderEconomyManagementEndedTable(rows){
  const html=renderEconomyManagementManagedTable(rows);
  return html.replace("纳管中项目列表","结束纳管项目列表").replace(/cancelEconomyManagement/g,"restoreEconomyManagement").replace(/结束纳管/g,"恢复纳管").replace("恢复纳管项目列表","结束纳管项目列表");
}

function openEconomyManagementModal(id,isRestore=false){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budgetValue=row.budgetIncluded==="已纳入"?row.budgetYear:"未纳入";
  openModal(isRestore?"恢复经济管控":"纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInputV2" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>EAS内部分包编号</label><input class="input" id="economyManagementInternalEasInputV2" value="${escapeEconomyManagement(row.internalEasCode==="--"?"":row.internalEasCode)}" placeholder="请输入EAS内部分包编号"></div><div class="economy-management-modal-field required"><label>子公司项目编号</label><input class="input" id="economyManagementSubsidiaryCodeInputV2" value="${escapeEconomyManagement(row.subsidiaryCode==="--"?"":row.subsidiaryCode)}" placeholder="请输入子公司项目编号"></div><div class="economy-management-modal-field required"><label>上线批次</label><input class="input" id="economyManagementUploadBatchInputV2" type="month" value="${escapeEconomyManagement(row.uploadBatch==="--"?"":row.uploadBatch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><select class="select" id="economyManagementSubcontractInputV2">${getEconomyManagementOptions(economyManagementFallbacks.subcontractMode,row.subcontractMode,"请选择分包模式")}</select></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInputV2">${getEconomyManagementOptions(economyManagementFallbacks.cooperationMode,row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label><select class="select" id="economyManagementClassInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.classInvestment,"请选择是否类投资项目")}</select></div><div class="economy-management-modal-field required"><label>是否投资项目</label><select class="select" id="economyManagementInvestmentInputV2">${getEconomyManagementOptions(["是","否"],row.investment,"请选择是否投资项目")}</select></div><div class="economy-management-modal-field required"><label>纳入全面预算</label><select class="select" id="economyManagementBudgetInputV2">${getEconomyManagementOptions(["未纳入","2026","2027","2028"],budgetValue,"请选择预算状态")}</select></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagementV2('${escapeEconomyManagement(row.id)}')">保存</button>` ,"large");
}

function submitEconomyManagementV2(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budget=document.getElementById("economyManagementBudgetInputV2")?.value||"";
  const values={easCode:document.getElementById("economyManagementEasInputV2")?.value.trim()||"",internalEasCode:document.getElementById("economyManagementInternalEasInputV2")?.value.trim()||"",subsidiaryCode:document.getElementById("economyManagementSubsidiaryCodeInputV2")?.value.trim()||"",uploadBatch:document.getElementById("economyManagementUploadBatchInputV2")?.value||"",subcontractMode:document.getElementById("economyManagementSubcontractInputV2")?.value||"",cooperationMode:document.getElementById("economyManagementCooperationInputV2")?.value||"",classInvestment:document.getElementById("economyManagementClassInvestmentInputV2")?.value||"",investment:document.getElementById("economyManagementInvestmentInputV2")?.value||"",budgetIncluded:budget==="未纳入"?"未纳入":"已纳入",budgetYear:budget==="未纳入"?"":budget};
  if(Object.entries(values).some(([key,value])=>["easCode","internalEasCode","subsidiaryCode","uploadBatch","subcontractMode","cooperationMode","classInvestment","investment"].includes(key)&&!value)){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="managed";renderEconomyManagementPage();showToast("项目已纳入经济管控");
}

function renderEconomyManagementManagedTable(rows){
  const includeDiagnosis=economyManagementState.tab==="managed";
  const header=`<tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="economy-management-diagnosis-column">${economyManagementDiagnosisHeader()}</th><th class="economy-management-update-column">最新数据更新时间</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th style="width:130px">项目状态</th><th style="width:140px">子公司</th><th style="width:180px">分公司</th><th style="width:180px">项目经理</th><th style="width:160px">项目造价（元）</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th><th style="width:120px">开项批次</th><th style="width:120px">上线批次</th><th style="width:150px">EAS编号</th><th style="width:200px">EAS编号（内部分包）</th><th style="width:150px">子公司项目编号</th><th style="width:140px">所在省市</th><th style="width:140px">区域市场</th><th style="width:140px">项目类型</th><th style="width:160px">项目实施模式</th><th style="width:130px;text-align:center">分包模式</th><th style="width:130px;text-align:center">合作模式</th><th style="width:150px;text-align:center">是否类投资项目</th><th style="width:130px;text-align:center">是否投资项目</th><th style="width:180px">纳入全面预算</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr>`;
  const body=rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="economy-management-diagnosis-column">${economyManagementDiagnosisResult(row)}</td><td class="economy-management-update-column">${economyManagementLatestUpdate(row,index)}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td>${economyManagementProjectStatusTag(row.projectStatus)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-managed-${row.id}`})}</td><td class="right">${economyManagementMoney(row.contractAmount)}</td><td>${escapeEconomyManagement(row.establishDate||"--")}</td><td>${escapeEconomyManagement(row.orderCode)}</td><td class="right">${economyManagementMoney(row.bidAmount)}</td><td>${escapeEconomyManagement(row.bidDate||"--")}</td><td>${escapeEconomyManagement(row.builder||"--")}</td><td>${escapeEconomyManagement(row.batch||"--")}</td><td>${escapeEconomyManagement(row.uploadBatch||"--")}</td><td>${escapeEconomyManagement(row.easCode||"--")}</td><td>${escapeEconomyManagement(row.internalEasCode||"--")}</td><td>${escapeEconomyManagement(row.subsidiaryCode||"--")}</td><td>${escapeEconomyManagement(row.provinceCity||"--")}</td><td>${tag(row.region||"--","blue")}</td><td>${tag(row.projectType||"--","gray")}</td><td>${tag(row.implementationMode||"--","blue")}</td><td>${tag(economyManagementDerivedSubcontract(economyManagementNormalizeCooperation(row.cooperationMode),economyManagementNormalizeClassInvestment(row.classInvestment)),"blue")}</td><td>${tag(economyManagementNormalizeCooperation(row.cooperationMode),economyManagementNormalizeCooperation(row.cooperationMode)==="合作"?"orange":"blue")}</td><td>${tag(economyManagementNormalizeClassInvestment(row.classInvestment),economyManagementNormalizeClassInvestment(row.classInvestment)==="是"?"blue":"gray")}</td><td>${tag(economyManagementNormalizeInvestment(row.investment),economyManagementNormalizeInvestment(row.investment)==="是"?"blue":"gray")}</td><td>${(Array.isArray(row.budgetYears)&&row.budgetYears.length?row.budgetYears:(row.budgetYear?[row.budgetYear]:[])).map(year=>tag(year,"blue")).join("")||tag("--","gray")}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button><button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">编辑</button><button class="link" onclick="cancelEconomyManagement('${escapeEconomyManagement(row.id)}')">结束纳管</button></td></tr>`).join("")||`<tr><td colspan="26" class="empty-state">暂无符合条件的项目</td></tr>`;
  const displayHeader=includeDiagnosis?header:header.replace(/<th class="economy-management-diagnosis-column">[\s\S]*?<\/th><th class="economy-management-update-column">[\s\S]*?<\/th>/,"");
  const displayBody=includeDiagnosis?body:body.replace(/<td class="economy-management-diagnosis-column">[\s\S]*?<\/td><td class="economy-management-update-column">[\s\S]*?<\/td>/g,"");
  return `<section class="card table-card economy-management-table-card economy-management-managed-table-card"><div class="card-hd"><div class="card-title">纳管中项目列表</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead>${displayHeader}</thead><tbody>${displayBody}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
}

function renderEconomyManagementEndedTable(rows){
  const html=renderEconomyManagementManagedTable(rows);
  return html.replace("纳管中项目列表","结束纳管项目列表").replace(/cancelEconomyManagement/g,"restoreEconomyManagement").replace(/结束纳管/g,"恢复纳管").replace("恢复纳管项目列表","结束纳管项目列表");
}

function renderEconomyManagementPendingTable(rows){
  const headerWithoutDiagnosis=()=>header.replace(/<th class="economy-management-diagnosis-column">[\s\S]*?<\/th><th class="economy-management-update-column">[\s\S]*?<\/th>/,"");
  let header=`<tr><th class="table-sticky-left economy-management-sequence-column">序号</th><th class="table-sticky-left table-sticky-left-edge economy-management-name-column">项目名称</th><th class="table-sticky-left economy-management-code-column">项目编号</th><th style="width:130px">项目状态</th><th style="width:140px">子公司</th><th style="width:180px">分公司</th><th style="width:180px">项目经理</th><th style="width:160px">项目造价（元）</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th><th style="width:120px">开项批次</th><th class="table-sticky-operation economy-management-operation-column">操作</th></tr>`;
  let body=rows.map((row,index)=>`<tr><td class="table-sticky-left economy-management-sequence-column">${index+1}</td><td class="table-sticky-left table-sticky-left-edge economy-management-name-column ellipsis" title="${escapeEconomyManagement(row.projectName)}">${escapeEconomyManagement(row.projectName)}</td><td class="table-sticky-left economy-management-code-column">${escapeEconomyManagement(row.projectCode)}</td><td>${economyManagementProjectStatusTag(row.projectStatus)}</td><td>${escapeEconomyManagement(row.company)}</td><td>${escapeEconomyManagement(row.branch)}</td><td>${renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-management-${row.id}`})}</td><td class="right">${economyManagementMoney(row.contractAmount)}</td><td>${escapeEconomyManagement(row.establishDate||"--")}</td><td>${escapeEconomyManagement(row.orderCode)}</td><td class="right">${economyManagementMoney(row.bidAmount)}</td><td>${escapeEconomyManagement(row.bidDate||"--")}</td><td>${escapeEconomyManagement(row.builder||"--")}</td><td>${escapeEconomyManagement(row.batch||"--")}</td><td class="actions table-sticky-operation economy-management-operation-column"><button class="link" onclick="showToast('已打开${escapeEconomyManagement(row.projectName)}详情')">查看</button><button class="link" onclick="openEconomyManagementModal('${escapeEconomyManagement(row.id)}')">纳入管控</button></td></tr>`).join("")||`<tr><td colspan="17" class="empty-state">暂无符合条件的项目</td></tr>`;
  header=header.replace(/<th class="economy-management-diagnosis-column">[\s\S]*?<\/th><th class="economy-management-update-column">[\s\S]*?<\/th>/,""); body=body.replace(/<td class="economy-management-diagnosis-column">[\s\S]*?<\/td><td class="economy-management-update-column">[\s\S]*?<\/td>/g,"");  return `<section class="card table-card economy-management-table-card economy-management-pending-table-card"><div class="card-hd"><div class="card-title">待纳管项目列表</div><div class="actions"><button class="btn" onclick="renderEconomyManagementPage();showToast('经济纳管项目已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济纳管项目列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
}

function openEconomyManagementModal(id,isRestore=false){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const budgetYears=Array.isArray(row.budgetYears)?row.budgetYears:(row.budgetYear?[row.budgetYear]:[]);
  const classInvestment=economyManagementNormalizeClassInvestment(row.classInvestment);
  const investment=economyManagementNormalizeInvestment(row.investment);
  const budgetControl=DscMultiSelect.render({
    id:"economyManagementBudgetInput",
    options:["2025","2026","2027"],
    values:budgetYears,
    placeholder:"请选择全面预算",
    searchPlaceholder:"搜索预算年度",
    maxTagCount:2
  });
  const basicRadio=(name,current,onchange="")=>`<div class="economy-management-radio-group" role="radiogroup">${["是","否"].map(value=>`<label class="component-radio"><input type="radio" name="${name}" value="${value}" ${current===value?"checked":""} ${onchange?`onchange="${onchange}"`:""}>${value}</label>`).join("")}</div>`;
  openModal(isRestore?"恢复经济管控":"纳入经济管控",`<div class="economy-management-modal-form"><div class="economy-management-modal-field"><label>项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.projectCode)}" readonly></div><div class="economy-management-modal-field"><label>订单项目编号</label><input class="input readonly" value="${escapeEconomyManagement(row.orderCode)}" readonly></div><div class="economy-management-modal-field required"><label>EAS编号</label><input class="input" id="economyManagementEasInput" value="${escapeEconomyManagement(row.easCode)}" placeholder="请输入EAS编号"></div><div class="economy-management-modal-field required"><label>EAS内部分包编号</label><input class="input" id="economyManagementInternalEasInput" value="${escapeEconomyManagement(row.internalEasCode==="--"?"":row.internalEasCode)}" placeholder="请输入EAS内部分包编号"></div><div class="economy-management-modal-field required"><label>子公司项目编号</label><input class="input" id="economyManagementSubsidiaryCodeInput" value="${escapeEconomyManagement(row.subsidiaryCode==="--"?(row.pushCode||""):row.subsidiaryCode)}" placeholder="请输入子公司项目编号"></div><div class="economy-management-modal-field required"><label>上线批次</label><input class="input" id="economyManagementUploadBatchInput" type="month" value="${escapeEconomyManagement(row.uploadBatch==="--"?"":row.uploadBatch)}"></div><div class="economy-management-modal-field required"><label>分包模式</label><input class="input readonly" id="economyManagementSubcontractInput" readonly value="${escapeEconomyManagement(economyManagementDerivedSubcontract(row.cooperationMode,classInvestment))}"></div><div class="economy-management-modal-field required"><label>合作模式</label><select class="select" id="economyManagementCooperationInput" onchange="syncEconomyManagementDerivedSubcontract()">${getEconomyManagementOptions(["自营","合作"],row.cooperationMode==="合作经营"?"合作":row.cooperationMode,"请选择项目合作模式")}</select></div><div class="economy-management-modal-field required"><label>是否类投资项目</label>${basicRadio("economyManagementClassInvestment",classInvestment,"syncEconomyManagementDerivedSubcontract()")}</div><div class="economy-management-modal-field required"><label>是否投资项目</label>${basicRadio("economyManagementInvestment",investment)}</div><div class="economy-management-modal-field required"><label>项目实施模式</label><select class="select" id="economyManagementImplementationModeInput">${getEconomyManagementOptions(economyManagementDictOptions("PROJECT_DELIVERY_MODE",economyManagementFallbacks.implementationMode),row.implementationMode,"请选择项目实施模式")}</select></div><div class="economy-management-modal-field required"><label>项目板块</label><select class="select" id="economyManagementProjectPlateInput">${getEconomyManagementOptions(economyManagementDictOptions("CM_PROJECT_PLATE",["市政","建筑","轨交"]),row.projectPlate||row.projectType,"请选择项目板块")}</select></div><div class="economy-management-modal-field"><label>全面预算</label>${budgetControl}</div></div>`, `<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitEconomyManagement('${escapeEconomyManagement(row.id)}')">保存</button>`,"large");
}
function submitEconomyManagement(id){
  const row=economyManagementRows.find(item=>item.id===String(id));if(!row)return;
  const cooperationMode=document.getElementById("economyManagementCooperationInput")?.value||"";
  const classInvestment=document.querySelector('input[name="economyManagementClassInvestment"]:checked')?.value||"";
  const budgetYears=DscMultiSelect.getValue("economyManagementBudgetInput");
  const values={easCode:document.getElementById("economyManagementEasInput")?.value.trim()||"",internalEasCode:document.getElementById("economyManagementInternalEasInput")?.value.trim()||"",subsidiaryCode:document.getElementById("economyManagementSubsidiaryCodeInput")?.value.trim()||"",uploadBatch:document.getElementById("economyManagementUploadBatchInput")?.value||"",subcontractMode:economyManagementDerivedSubcontract(cooperationMode,classInvestment),cooperationMode,classInvestment,investment:document.querySelector('input[name="economyManagementInvestment"]:checked')?.value||"",implementationMode:document.getElementById("economyManagementImplementationModeInput")?.value||"",projectPlate:document.getElementById("economyManagementProjectPlateInput")?.value||"",budgetYears,budgetIncluded:budgetYears.length?"已纳入":"未纳入",budgetYear:budgetYears.join("、")};
  const requiredKeys=["easCode","internalEasCode","subsidiaryCode","uploadBatch","subcontractMode","cooperationMode","classInvestment","investment","implementationMode","projectPlate"];
  const missing=requiredKeys.some(key=>!values[key]);if(missing){showToast("请完善纳入管控信息");return;}
  Object.assign(row,values,{status:"managed"});closeModal();economyManagementState.tab="managed";renderEconomyManagementPage();showToast("项目已纳入经济管控");
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
  const contentHtml=`<div class="economy-management-page"><div class="economy-management-tabs"><button class="${economyManagementState.tab==="pending"?"active":""}" onclick="setEconomyManagementTab('pending')">待纳管 <b>${economyManagementRows.filter(row=>row.status==="pending").length}</b></button><button class="${economyManagementState.tab==="managed"?"active":""}" onclick="setEconomyManagementTab('managed')">纳管中 <b>${economyManagementRows.filter(row=>row.status==="managed").length}</b></button><button class="${economyManagementState.tab==="ended"?"active":""}" onclick="setEconomyManagementTab('ended')">结束纳管 <b>${economyManagementRows.filter(row=>row.status==="ended").length}</b></button></div>${renderUnifiedQueryCard(queryFields,{id:"economyManagementQuery",gridClass:"search-grid economy-management-search",queryFn:"syncEconomyManagementFilters()",resetFn:"resetEconomyManagementFilters()"})}${economyManagementState.tab==="pending"?renderEconomyManagementPendingTable(rows):economyManagementState.tab==="ended"?renderEconomyManagementEndedTable(rows):renderEconomyManagementManagedTable(rows)}</div>`;
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-management-standard-list",titleHtml:`<div class="compact-title-row"><div class="module-title">经济纳管 / 纳管项目</div></div>`,contentHtml});
  const managementPendingColumns=[
    {key:"sequence",title:"序号",width:60,align:"center"},
    {key:"projectName",title:"项目名称",width:220,align:"left"},
    {key:"projectCode",title:"项目编号",width:130,align:"center"},
    ...["项目状态","子公司","分公司","项目经理","项目造价（元）","立项完成日期","订单项目编号","中标价（元）","中标日期","建设单位","开项批次"].map((title,index)=>({key:`pending-${index}`,title,width:120,align:"center"})),
    {key:"operation",title:"操作",width:180,align:"center"}
  ];
  const managementManagedColumns=[
    managementPendingColumns[0],
    {key:"diagnosisReady",title:"满足诊断初步判断",width:170,align:"center"},
    {key:"latestUpdate",title:"最新数据更新时间",width:160,align:"center"},
    ...managementPendingColumns.slice(1,-1),
    ...["上线批次","EAS编号","EAS编号（内部分包）","子公司项目编号","所在省市","区域市场","项目类型","项目实施模式","分包模式","合作模式","是否类投资项目","是否投资项目","纳入全面预算"].map((title,index)=>({key:`managed-${index}`,title,width:title==="EAS编号（内部分包）"?200:(title==="项目经理"?180:120),align:"center"})),
    {key:"operation",title:"操作",width:260,align:"center"}
  ];
  const pendingSettingKey="managementPendingDiagnosis";
  const managedSettingKey="managementManagedDiagnosis";
  mountEconomyCustomColumnSettingButton(pendingSettingKey,managementPendingColumns,".economy-management-pending-table-card",".economy-management-pending-table-card table","renderEconomyManagementPage");
  mountEconomyCustomColumnSettingButton(managedSettingKey,managementManagedColumns,".economy-management-managed-table-card",".economy-management-managed-table-card table","renderEconomyManagementPage");
  setTimeout(()=>{applyEconomyCustomColumnVisibility(pendingSettingKey);applyEconomyCustomColumnVisibility(managedSettingKey);},0);
}







