const messageProjectPickerState={
  targetId:"",
  confirmHandler:null,
  initialSelectedIds:[],
  excludedSelectedIds:[],
  draftSelectedIds:[],
  mode:"select",
  resourceId:"",
  filters:{projectName:"",projectCode:"",subCompany:"",branchCompany:"",projectManager:"",projectStatus:"",region:"",provinceCity:"",projectType:"",implementationMode:"",controlLevel:"",generalContractor:"",builder:""},
  page:1,
  pageSize:50
};

function getMessageProjectPickerRows(){
  return typeof constructionProjectData!=="undefined"&&Array.isArray(constructionProjectData)?constructionProjectData:[];
}

function getMessageProjectPickerSelectedIds(id){
  const box=document.getElementById(id);
  if(!box)return [];
  try{return JSON.parse(box.dataset.values||"[]").map(String);}catch(error){return [];}
}

function resolveMessageProjectPickerIds(values=[]){
  const rows=getMessageProjectPickerRows();
  const result=[];
  (values||[]).forEach(value=>{
    const normalized=String(value||"").trim();
    const row=rows.find(item=>String(item.id)===normalized||item.projectCode===normalized||item.projectName===normalized);
    if(row&&!result.includes(String(row.id)))result.push(String(row.id));
  });
  return result;
}

function getMessageProjectPickerLabels(id){
  const ids=new Set(getMessageProjectPickerSelectedIds(id));
  return getMessageProjectPickerRows().filter(row=>ids.has(String(row.id))).map(row=>row.projectName);
}

function renderMessageProjectPickerControl(id,selectedIds=[]){
  const ids=new Set(resolveMessageProjectPickerIds(selectedIds));
  const selected=getMessageProjectPickerRows().filter(row=>ids.has(String(row.id)));
  const first=selected[0];
  return `<div class="base-multi-select__control" tabindex="0" role="combobox" aria-haspopup="dialog" aria-expanded="false" onclick="openMessageProjectPicker('${id}')">
    <div class="base-multi-select__tags">
      ${first?`<span class="base-multi-select__tag message-route-selection-tag" title="${escapeTplAttr(first.projectName)}"><span class="base-multi-select__tag-text">${first.projectName}</span></span>${selected.length>1?`<span class="base-multi-select__tag message-route-selection-tag message-route-count-tag">+${selected.length-1}</span>`:""}`:'<span class="message-person-picker__placeholder">请选择项目</span>'}
    </div>
    <button class="message-route-multi-select__clear" type="button" title="清空已选项目" aria-label="清空已选项目" ${selected.length?"":"hidden"} onclick="clearMessageProjectPicker(event,'${id}')">${renderTDesignIcon("close",{size:14})}</button>
    <span class="base-multi-select__arrow" aria-hidden="true"></span>
  </div>`;
}

function renderMessageProjectPicker(id,selected=[]){
  const selectedIds=resolveMessageProjectPickerIds(selected);
  return `<div id="${id}" class="base-multi-select message-project-picker" data-values="${escapeTplAttr(JSON.stringify(selectedIds))}">${renderMessageProjectPickerControl(id,selectedIds)}</div>`;
}

function setMessageProjectPickerValues(id,values=[]){
  const box=document.getElementById(id);
  if(!box)return;
  const ids=resolveMessageProjectPickerIds(values);
  box.dataset.values=JSON.stringify(ids);
  box.innerHTML=renderMessageProjectPickerControl(id,ids);
}

function clearMessageProjectPicker(event,id){
  event?.preventDefault?.();event?.stopPropagation?.();
  setMessageProjectPickerValues(id,[]);
}

function getMessageProjectPickerUnique(key){
  return [...new Set(getMessageProjectPickerRows().map(row=>row[key]).filter(Boolean))];
}

function renderMessageProjectPickerOptions(key,current){
  return `<option value="">全部</option>${getMessageProjectPickerUnique(key).map(value=>`<option value="${escapeTplAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;
}

function getMessageProjectPickerFilteredRows(){
  const f=messageProjectPickerState.filters;
  const rows=messageProjectPickerState.mode==="manage"
    ?getMessageProjectPickerRows().filter(row=>messageProjectPickerState.initialSelectedIds.includes(String(row.id)))
    :ProjectSelector.getAvailableRows(messageProjectPickerState,getMessageProjectPickerRows());
  return rows.filter(row=>{
    if(f.projectName&&!row.projectName?.includes(f.projectName))return false;
    if(f.projectCode&&!row.projectCode?.includes(f.projectCode))return false;
    if(f.subCompany&&row.subCompany!==f.subCompany)return false;
    if(f.branchCompany&&row.branchCompany!==f.branchCompany)return false;
    if(f.projectManager&&!row.projectManager?.includes(f.projectManager))return false;
    if(f.projectStatus&&row.projectStatus!==f.projectStatus)return false;
    if(f.region&&row.region!==f.region)return false;
    if(f.provinceCity&&!row.provinceCity?.includes(f.provinceCity))return false;
    if(f.projectType&&row.projectType!==f.projectType)return false;
    if(f.implementationMode&&row.implementationMode!==f.implementationMode)return false;
    if(f.controlLevel&&row.controlLevel!==f.controlLevel)return false;
    if(f.generalContractor&&!String(row.generalContractor||row.totalContractor||"").includes(f.generalContractor))return false;
    if(f.builder&&!row.builder?.includes(f.builder))return false;
    return true;
  });
}

function syncMessageProjectPickerFilters(){
  Object.keys(messageProjectPickerState.filters).forEach(key=>{
    messageProjectPickerState.filters[key]=document.getElementById(`messageProjectPicker-${key}`)?.value?.trim()||"";
  });
}

function renderMessageProjectPickerQuery(){
  const f=messageProjectPickerState.filters;
  return renderUnifiedQueryCard(`
    <div class="form-item"><label>项目名称</label><input class="input" id="messageProjectPicker-projectName" value="${escapeTplAttr(f.projectName)}" placeholder="请输入项目名称"/></div>
    <div class="form-item"><label>项目编号</label><input class="input" id="messageProjectPicker-projectCode" value="${escapeTplAttr(f.projectCode)}" placeholder="请输入项目编号"/></div>
    <div class="form-item"><label>子公司</label><select class="select" id="messageProjectPicker-subCompany">${renderMessageProjectPickerOptions("subCompany",f.subCompany)}</select></div>
    <div class="form-item"><label>分公司</label><select class="select" id="messageProjectPicker-branchCompany">${renderMessageProjectPickerOptions("branchCompany",f.branchCompany)}</select></div>
    <div class="form-item"><label>项目经理</label><input class="input" id="messageProjectPicker-projectManager" value="${escapeTplAttr(f.projectManager)}" placeholder="请输入项目经理"/></div>
    <div class="form-item"><label>项目状态</label><select class="select" id="messageProjectPicker-projectStatus">${renderMessageProjectPickerOptions("projectStatus",f.projectStatus)}</select></div>
    <div class="form-item"><label>所属区域</label><select class="select" id="messageProjectPicker-region">${renderMessageProjectPickerOptions("region",f.region)}</select></div>
    <div class="form-item"><label>所在省市</label><input class="input" id="messageProjectPicker-provinceCity" value="${escapeTplAttr(f.provinceCity)}" placeholder="请输入省市"/></div>
    <div class="form-item"><label>项目类型</label><select class="select" id="messageProjectPicker-projectType">${renderMessageProjectPickerOptions("projectType",f.projectType)}</select></div>
    <div class="form-item"><label>实施模式</label><select class="select" id="messageProjectPicker-implementationMode">${renderMessageProjectPickerOptions("implementationMode",f.implementationMode)}</select></div>
    <div class="form-item"><label>管控等级</label><select class="select" id="messageProjectPicker-controlLevel">${renderMessageProjectPickerOptions("controlLevel",f.controlLevel)}</select></div>
    <div class="form-item"><label>总包单位</label><input class="input" id="messageProjectPicker-generalContractor" value="${escapeTplAttr(f.generalContractor)}" placeholder="请输入总包单位"/></div>
    <div class="form-item"><label>建设单位</label><input class="input" id="messageProjectPicker-builder" value="${escapeTplAttr(f.builder)}" placeholder="请输入建设单位"/></div>
  `,{id:"messageProjectPickerQueryCard",title:"查询条件",queryFn:"queryMessageProjectPicker()",resetFn:"resetMessageProjectPicker()",gridClass:"search-grid"});
}

tableColumnDefinitions.messageReceiverProjectPicker=[
  {key:"selection",title:'<input type="checkbox" aria-label="全选当前页" onclick="toggleMessageProjectPickerPageSelection(this.checked)"/>',width:52,align:"center",render:row=>`<input type="checkbox" class="message-project-picker-row-check" value="${row.id}" ${messageProjectPickerState.draftSelectedIds.includes(String(row.id))?"checked":""} onchange="toggleMessageProjectPickerRow('${row.id}',this.checked)"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(messageProjectPickerState.page-1)*messageProjectPickerState.pageSize+index+1},
  {key:"projectName",title:"项目名称",width:240,render:row=>`<span class="text-ellipsis" title="${escapeTplAttr(row.projectName)}">${row.projectName}</span>`},
  {key:"productionBizType",title:"生产业务类型",width:130,render:row=>row.productionBizType||"--"},
  {key:"subCompany",title:"子公司",width:120,render:row=>row.subCompany||"--"},
  {key:"branchCompany",title:"分公司",width:150,render:row=>row.branchCompany||"--"},
  {key:"projectCost",title:"项目造价",width:130,align:"right",render:row=>`${typeof moneyWan==="function"?moneyWan(row.projectCost):row.projectCost}万`},
  {key:"projectManager",title:"项目经理",width:190,render:row=>renderProjectManagerContact(row.projectManager,row.managerPhone,{key:`message-project-picker-${row.id}`})},
  {key:"provinceCity",title:"省市区",width:160,render:row=>row.provinceCity||"--"},
  {key:"region",title:"所属区域",width:120,render:row=>row.region||"--"},
  {key:"builder",title:"建设单位",width:220,render:row=>`<span class="text-ellipsis" title="${escapeTplAttr(row.builder||'--')}">${row.builder||"--"}</span>`},
  {key:"projectStatus",title:"项目状态",width:100,align:"center",render:row=>typeof projectStatusTag==="function"?projectStatusTag(row.projectStatus):row.projectStatus},
  {key:"projectType",title:"项目类型",width:110,render:row=>row.projectType||"--"},
  {key:"controlLevel",title:"管控等级",width:140,render:row=>row.controlLevel||"--"},
  {key:"integratedManagement",title:"股份一体化管理",width:140,align:"center",render:row=>yesNoTag(row.integratedManagement||"否")},
  {key:"generalContractor",title:"总包单位",width:180,render:row=>row.generalContractor||row.totalContractor||"--"},
  {key:"keyCustomer",title:"重点客户",width:130,render:row=>row.keyCustomer||"无"},
  {key:"isShareInternal",title:"是否股份内部",width:130,align:"center",render:row=>yesNoTag(row.isShareInternal||"否")},
  {key:"isSubCompanyInternal",title:"是否子公司内部",width:140,align:"center",render:row=>yesNoTag(row.isSubCompanyInternal||"否")},
  {key:"isKeyProject",title:"是否重点项目",width:130,align:"center",render:row=>yesNoTag(row.isKeyProject||"否")},
  {key:"approvalDate",title:"立项时间",width:120,align:"center",render:row=>row.approvalDate||"--"},
  {key:"projectCode",title:"项目编号",width:170,render:row=>row.projectCode||"--"}
];
tableColumnDefinitions.messageReceiverProjectPicker.freezeCount=3;

tableColumnDefinitions.projectResourceAuthorizedProjectPicker=[
  ...tableColumnDefinitions.messageReceiverProjectPicker.map(column=>({...column})),
  {key:"operation",title:"操作",width:110,align:"center",render:row=>`<a class="link danger-link" onclick="cancelProjectResourceAuthorization('${row.id}')">取消授权</a>`}
];
tableColumnDefinitions.projectResourceAuthorizedProjectPicker.freezeCount=3;

function getMessageProjectPickerTableKey(){return messageProjectPickerState.mode==="manage"?"projectResourceAuthorizedProjectPicker":"messageReceiverProjectPicker";}

function getMessageProjectPickerPage(){
  const rows=getMessageProjectPickerFilteredRows();
  const pages=Math.max(1,Math.ceil(rows.length/messageProjectPickerState.pageSize));
  messageProjectPickerState.page=Math.min(Math.max(1,messageProjectPickerState.page),pages);
  const start=(messageProjectPickerState.page-1)*messageProjectPickerState.pageSize;
  return {rows,pages,pageRows:rows.slice(start,start+messageProjectPickerState.pageSize)};
}

function renderMessageProjectPickerModalBody(){
  const page=getMessageProjectPickerPage();
  const manageMode=messageProjectPickerState.mode==="manage";
  const tableKey=getMessageProjectPickerTableKey();
  return `<div class="message-project-selector">${renderMessageProjectPickerQuery()}${renderUnifiedTableCard({
    tableKey,tbodyId:"messageProjectPickerTbody",renderFnName:"renderMessageProjectPickerTable",refreshAction:"renderMessageProjectPickerModal()",exportAction:"showToast('项目选择数据导出任务已创建')",title:"项目列表",className:"message-project-picker-table-card",beforeActions:manageMode?`<button class="btn danger" type="button" onclick="batchCancelProjectResourceAuthorization()">批量取消授权</button>`:"",paginationHtml:ProjectSelector.renderPagination(messageProjectPickerState,page.rows.length,messageProjectPickerState.page,page.pages,messageProjectPickerState.pageSize)
  })}</div>`;
}

function openMessageProjectPicker(targetId,options={}){
  document.querySelectorAll(".nested-modal-mask .message-project-picker-modal").forEach(mask=>mask.closest(".nested-modal-mask")?.remove());
  ProjectSelector.initializeState(messageProjectPickerState,{targetId,rows:getMessageProjectPickerRows(),selectedIds:Array.isArray(options.selectedIds)?options.selectedIds:getMessageProjectPickerSelectedIds(targetId),excludeSelected:options.excludeSelected!==false,onConfirm:options.onConfirm,pageSize:50});
  messageProjectPickerState.mode=options.mode||"select";
  messageProjectPickerState.resourceId=options.resourceId||"";
  if(messageProjectPickerState.mode==="manage")messageProjectPickerState.draftSelectedIds=[];
  const footer=messageProjectPickerState.mode==="manage"?`<span class="project-selector-footer-actions"><button class="btn" type="button" onclick="closeNestedModal(this)">关闭</button></span>`:ProjectSelector.renderFooter(messageProjectPickerState,`<button class="btn" type="button" onclick="closeNestedModal(this)">取消</button><button class="btn primary" type="button" onclick="confirmMessageProjectPicker(this)">确定</button>`);
  openNestedModal(options.title||"选择项目",renderMessageProjectPickerModalBody(),footer);
  const modal=document.querySelector(".nested-modal-mask:last-child .nested-modal");
  modal?.classList.add("message-project-picker-modal");
  renderMessageProjectPickerTable();
}

function renderMessageProjectPickerModal(){
  const body=document.querySelector(".message-project-picker-modal .modal-bd");
  if(!body)return;
  body.innerHTML=renderMessageProjectPickerModalBody();
  renderMessageProjectPickerTable();
}

function renderMessageProjectPickerTable(){
  const page=getMessageProjectPickerPage();
  renderTableByColumns(getMessageProjectPickerTableKey(),page.pageRows,"messageProjectPickerTbody");
  const total=document.getElementById("messageReceiverProjectPickerTotalText");
  const pageText=document.getElementById("messageProjectPickerPageText");
  if(total)total.textContent=`共 ${page.rows.length} 条`;
  if(pageText)pageText.innerHTML=`<button class="btn mini" ${messageProjectPickerState.page<=1?"disabled":""} onclick="changeMessageProjectPickerPage(-1)">上一页</button><b>第 ${messageProjectPickerState.page} / ${page.pages} 页</b><button class="btn mini" ${messageProjectPickerState.page>=page.pages?"disabled":""} onclick="changeMessageProjectPickerPage(1)">下一页</button><select class="select mini-select" onchange="changeMessageProjectPickerPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${size===messageProjectPickerState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;
}

function queryMessageProjectPicker(){syncMessageProjectPickerFilters();messageProjectPickerState.page=1;renderMessageProjectPickerModal();}
function resetMessageProjectPicker(){Object.keys(messageProjectPickerState.filters).forEach(key=>messageProjectPickerState.filters[key]="");messageProjectPickerState.page=1;renderMessageProjectPickerModal();}
function changeMessageProjectPickerPage(step){messageProjectPickerState.page+=Number(step||0);renderMessageProjectPickerTable();}
function changeMessageProjectPickerPageSize(value){messageProjectPickerState.pageSize=Number(value)||50;messageProjectPickerState.page=1;renderMessageProjectPickerTable();}
function toggleMessageProjectPickerRow(id,checked){ProjectSelector.toggle(messageProjectPickerState,id,checked);ProjectSelector.updateSelectedCount(messageProjectPickerState);}
function toggleMessageProjectPickerPageSelection(checked){document.querySelectorAll(".message-project-picker-row-check").forEach(box=>{box.checked=checked;toggleMessageProjectPickerRow(box.value,checked);});}
function confirmMessageProjectPicker(button){
  const selectedIds=ProjectSelector.getConfirmedIds(messageProjectPickerState);
  const handler=messageProjectPickerState.confirmHandler;
  messageProjectPickerState.confirmHandler=null;
  if(handler)handler(selectedIds);
  else setMessageProjectPickerValues(messageProjectPickerState.targetId,selectedIds);
  closeNestedModal(button);
}

function removeProjectResourceAuthorizationIds(ids=[]){
  const row=typeof getProjectResourceAuthorizationById==="function"?getProjectResourceAuthorizationById(messageProjectPickerState.resourceId):null;
  if(!row)return 0;
  const removeIds=new Set(ids.map(String));
  const removeRows=getMessageProjectPickerRows().filter(project=>removeIds.has(String(project.id)));
  const removeCodes=new Set(removeRows.map(project=>String(project.projectCode||"")));
  const removeNames=new Set(removeRows.map(project=>String(project.projectName||"")));
  const before=(row.projects||[]).length;
  row.projects=(row.projects||[]).filter(project=>!removeCodes.has(String(project.code||""))&&!removeNames.has(String(project.name||"")));
  return before-row.projects.length;
}

function refreshProjectResourceAuthorizationManager(message){
  const row=typeof getProjectResourceAuthorizationById==="function"?getProjectResourceAuthorizationById(messageProjectPickerState.resourceId):null;
  const selectedIds=(row?.projects||[]).map(project=>getMessageProjectPickerRows().find(item=>String(item.projectCode||"")===String(project.code||"")||String(item.projectName||"")===String(project.name||""))?.id).filter(Boolean);
  messageProjectPickerState.initialSelectedIds=selectedIds.map(String);
  messageProjectPickerState.draftSelectedIds=[];
  messageProjectPickerState.page=1;
  if(typeof renderProjectResourceAuthorizationPage==="function")renderProjectResourceAuthorizationPage();
  renderMessageProjectPickerModal();
  if(message)showToast(message);
}

function cancelProjectResourceAuthorization(projectId){
  const count=removeProjectResourceAuthorizationIds([projectId]);
  refreshProjectResourceAuthorizationManager(count?"项目授权已取消":"未找到可取消的项目授权");
}

function batchCancelProjectResourceAuthorization(){
  const ids=[...messageProjectPickerState.draftSelectedIds];
  if(!ids.length)return showToast("请先勾选需要取消授权的项目");
  const count=removeProjectResourceAuthorizationIds(ids);
  refreshProjectResourceAuthorizationManager(`已取消 ${count} 个项目的授权`);
}

function getMessageProjectPickerReceiverLevel(id){
  return document.getElementById(id==="msgTplOverdueTargetValue"?"msgTplOverdueReceiverLevel":"msgTplReceiverLevel")?.value||"enterprise";
}

const __originRenderMessageReceiverTargetPickerV2563=renderMessageReceiverTargetPicker;
renderMessageReceiverTargetPicker=function(type,id){
  if(type==="org"&&getMessageProjectPickerReceiverLevel(id)==="project")return `<label class="target-inner-label">选择组织${renderMessageProjectPicker(id,[])}</label>`;
  return __originRenderMessageReceiverTargetPickerV2563(type,id);
};

const __originSetMessageRouteMultiSelectValuesV2563=setMessageRouteMultiSelectValues;
setMessageRouteMultiSelectValues=function(id,values=[]){
  const box=document.getElementById(id);
  if(box?.classList.contains("message-project-picker"))return setMessageProjectPickerValues(id,values);
  return __originSetMessageRouteMultiSelectValuesV2563(id,values);
};

const __originGetTemplateTargetValueForSendV2563=getTemplateTargetValueForSend;
getTemplateTargetValueForSend=function(){
  const picker=document.getElementById("msgTplTargetValue");
  if(picker?.classList.contains("message-project-picker"))return getMessageProjectPickerLabels("msgTplTargetValue").join("，");
  return __originGetTemplateTargetValueForSendV2563();
};
