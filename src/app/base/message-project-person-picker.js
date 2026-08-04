const messageProjectPersonPickerState={
  targetId:"",activeProjectId:"",draftSelectedIds:[],
  filters:{projectName:"",subCompany:"",branchCompany:"",projectManager:"",name:"",post:"",unit:"",projectCode:""}
};

function getMessageProjectPersonProjects(){
  return typeof constructionProjectData!=="undefined"&&Array.isArray(constructionProjectData)?constructionProjectData:[];
}

function getMessageProjectPersonRows(){
  const templates=Array.isArray(window.__PROJECT_SAFETY_PERSONNEL_ROWS__)?window.__PROJECT_SAFETY_PERSONNEL_ROWS__:[];
  return getMessageProjectPersonProjects().flatMap((project,projectIndex)=>{
    const count=3+(projectIndex%3);
    return templates.slice(0,count).map((person,personIndex)=>({
      ...person,
      pickerId:`${project.id}-${person.id}`,
      projectId:String(project.id),projectName:project.projectName,projectCode:project.projectCode,
      subCompany:project.subCompany,branchCompany:project.branchCompany,projectStatus:project.projectStatus,
      name:personIndex===1&&project.projectManager?project.projectManager:person.name,
      post:personIndex===1?"项目经理":person.post
    }));
  });
}

function getMessageProjectPersonPickerSelectedIds(id){
  const box=document.getElementById(id);if(!box)return [];
  try{return JSON.parse(box.dataset.values||"[]").map(String);}catch(error){return [];}
}

function resolveMessageProjectPersonPickerIds(values=[]){
  const rows=getMessageProjectPersonRows(),result=[];
  (values||[]).forEach(value=>{
    const normalized=String(value||"").trim();
    const row=rows.find(item=>item.pickerId===normalized||item.name===normalized);
    if(row&&!result.includes(row.pickerId))result.push(row.pickerId);
  });
  return result;
}

function getMessageProjectPersonPickerLabels(id){
  const ids=new Set(getMessageProjectPersonPickerSelectedIds(id));
  return getMessageProjectPersonRows().filter(row=>ids.has(row.pickerId)).map(row=>row.name);
}

function renderMessageProjectPersonPickerControl(id,selectedIds=[]){
  const ids=new Set(resolveMessageProjectPersonPickerIds(selectedIds));
  const selected=getMessageProjectPersonRows().filter(row=>ids.has(row.pickerId));
  return `<div class="base-multi-select__control" tabindex="0" role="combobox" aria-haspopup="dialog" onclick="openMessageProjectPersonPicker('${id}')">
    <div class="base-multi-select__tags">${selected[0]?`<span class="base-multi-select__tag message-route-selection-tag" title="${escapeTplAttr(selected[0].name)}"><span class="base-multi-select__tag-text">${selected[0].name}</span></span>${selected.length>1?`<span class="base-multi-select__tag message-route-selection-tag message-route-count-tag">+${selected.length-1}</span>`:""}`:'<span class="message-person-picker__placeholder">请选择项目管理人员</span>'}</div>
    <button class="message-route-multi-select__clear" type="button" title="清空已选人员" ${selected.length?"":"hidden"} onclick="clearMessageProjectPersonPicker(event,'${id}')">×</button><span class="base-multi-select__arrow">⌄</span>
  </div>`;
}

function renderMessageProjectPersonPicker(id,selected=[]){
  const ids=resolveMessageProjectPersonPickerIds(selected);
  return `<div id="${id}" class="base-multi-select message-project-person-picker" data-values="${escapeTplAttr(JSON.stringify(ids))}">${renderMessageProjectPersonPickerControl(id,ids)}</div>`;
}
function setMessageProjectPersonPickerValues(id,values=[]){const box=document.getElementById(id);if(!box)return;const ids=resolveMessageProjectPersonPickerIds(values);box.dataset.values=JSON.stringify(ids);box.innerHTML=renderMessageProjectPersonPickerControl(id,ids);}
function clearMessageProjectPersonPicker(event,id){event?.preventDefault?.();event?.stopPropagation?.();setMessageProjectPersonPickerValues(id,[]);}

function messageProjectPersonUnique(key){return [...new Set(getMessageProjectPersonProjects().map(row=>row[key]).filter(Boolean))];}
function messageProjectPersonOptions(key,current){return `<option value="">全部</option>${messageProjectPersonUnique(key).map(value=>`<option value="${escapeTplAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;}
function messageProjectPersonRowOptions(key,current){return `<option value="">全部</option>${[...new Set(getMessageProjectPersonRows().map(row=>row[key]).filter(Boolean))].map(value=>`<option value="${escapeTplAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;}
function syncMessageProjectPersonFilters(){Object.keys(messageProjectPersonPickerState.filters).forEach(key=>messageProjectPersonPickerState.filters[key]=document.getElementById(`messageProjectPerson-${key}`)?.value?.trim()||"");}

function getMessageProjectPersonFilteredProjects(){
  const f=messageProjectPersonPickerState.filters,personRows=getMessageProjectPersonRows();
  return getMessageProjectPersonProjects().filter(project=>{
    if(f.projectName&&!project.projectName?.includes(f.projectName))return false;if(f.projectCode&&!project.projectCode?.includes(f.projectCode))return false;
    if(f.subCompany&&project.subCompany!==f.subCompany)return false;if(f.branchCompany&&project.branchCompany!==f.branchCompany)return false;
    if(f.projectManager&&!project.projectManager?.includes(f.projectManager))return false;
    if((f.name||f.post||f.unit)&&!personRows.some(row=>row.projectId===String(project.id)&&(!f.name||row.name.includes(f.name))&&(!f.post||row.post===f.post)&&(!f.unit||row.unit===f.unit)))return false;
    return true;
  });
}
function getMessageProjectPersonFilteredRows(){const f=messageProjectPersonPickerState.filters;return getMessageProjectPersonRows().filter(row=>row.projectId===String(messageProjectPersonPickerState.activeProjectId)&&(!f.name||row.name.includes(f.name))&&(!f.post||row.post===f.post)&&(!f.unit||row.unit===f.unit));}

function renderMessageProjectPersonQuery(){const f=messageProjectPersonPickerState.filters;return renderUnifiedQueryCard(`
  <div class="form-item"><label>项目名称</label><input class="input" id="messageProjectPerson-projectName" value="${escapeTplAttr(f.projectName)}" placeholder="请输入项目名称"/></div>
  <div class="form-item"><label>子公司</label><select class="select" id="messageProjectPerson-subCompany">${messageProjectPersonOptions("subCompany",f.subCompany)}</select></div>
  <div class="form-item"><label>分公司</label><select class="select" id="messageProjectPerson-branchCompany">${messageProjectPersonOptions("branchCompany",f.branchCompany)}</select></div>
  <div class="form-item"><label>项目经理</label><input class="input" id="messageProjectPerson-projectManager" value="${escapeTplAttr(f.projectManager)}" placeholder="请输入项目经理姓名"/></div>
  <div class="form-item"><label>管理人员姓名</label><input class="input" id="messageProjectPerson-name" value="${escapeTplAttr(f.name)}" placeholder="请输入管理人员姓名"/></div>
  <div class="form-item"><label>人员岗位</label><select class="select" id="messageProjectPerson-post">${messageProjectPersonRowOptions("post",f.post)}</select></div>
  <div class="form-item"><label>参建单位</label><select class="select" id="messageProjectPerson-unit">${messageProjectPersonRowOptions("unit",f.unit)}</select></div>
  <div class="form-item"><label>项目编号</label><input class="input" id="messageProjectPerson-projectCode" value="${escapeTplAttr(f.projectCode)}" placeholder="请输入项目编号"/></div>
`,{id:"messageProjectPersonQueryCard",queryFn:"queryMessageProjectPersonPicker()",resetFn:"resetMessageProjectPersonPicker()",canCollapse:false});}

tableColumnDefinitions.messageProjectManagementPersonPicker=[
  {key:"selection",title:'<input type="checkbox" aria-label="全选当前项目人员" onclick="toggleMessageProjectPersonAll(this.checked)"/>',width:52,align:"center",render:row=>`<input type="checkbox" class="message-project-person-row-check" value="${row.pickerId}" ${messageProjectPersonPickerState.draftSelectedIds.includes(row.pickerId)?"checked":""} onchange="toggleMessageProjectPersonRow('${row.pickerId}',this.checked)"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>index+1},{key:"name",title:"姓名",width:110,render:row=>row.name||"--"},{key:"phone",title:"手机号码",width:130,render:row=>row.phone||"--"},{key:"gender",title:"性别",width:70,align:"center",render:row=>row.gender||"--"},{key:"post",title:"岗位",width:110,render:row=>row.post||"--"},{key:"workArea",title:"工区权限",width:150,render:row=>row.workArea||"--"},{key:"unit",title:"参建单位",width:240,render:row=>`<span class="text-ellipsis" title="${escapeTplAttr(row.unit)}">${row.unit||"--"}</span>`},{key:"certificate",title:"专业证书",width:100,align:"center",render:row=>tag(row.certificate,row.certificate==="已上传"?"green":"gray")},{key:"accountStatus",title:"账号状态",width:100,align:"center",render:row=>tag(row.accountStatus,row.accountStatus==="启用"?"green":"gray")}
];
tableColumnDefinitions.messageProjectManagementPersonPicker.freezeCount=3;

function renderMessageProjectPersonProjectList(){
  const projects=getMessageProjectPersonFilteredProjects(),rows=getMessageProjectPersonRows(),selected=new Set(messageProjectPersonPickerState.draftSelectedIds);
  return projects.map(project=>{
    const projectRows=rows.filter(row=>row.projectId===String(project.id));
    const selectedCount=projectRows.filter(row=>selected.has(row.pickerId)).length;
    return `<button type="button" class="message-project-person-project ${String(project.id)===String(messageProjectPersonPickerState.activeProjectId)?"active":""}" onclick="switchMessageProjectPersonProject('${project.id}')"><span class="message-project-person-project-name" title="${escapeTplAttr(project.projectName)}">${project.projectName}</span><span class="message-project-person-project-meta">共 ${projectRows.length} 人，已选 ${selectedCount} 人</span></button>`;
  }).join("")||'<div class="unified-org-tree-empty">暂无匹配项目</div>';
}
function renderMessageProjectPersonPickerModalBody(){return `<div class="message-project-person-selector">${renderMessageProjectPersonQuery()}<div class="message-project-person-content"><section class="message-project-person-project-panel"><div class="message-project-person-panel-hd"><strong>项目清单</strong><span>共 ${getMessageProjectPersonFilteredProjects().length} 项目</span></div><div class="message-project-person-project-list">${renderMessageProjectPersonProjectList()}</div></section><section class="card table-card message-project-person-table-card"><div class="card-hd"><div class="card-title">管理人员名单</div><div class="message-project-person-selected">已选 <b>${messageProjectPersonPickerState.draftSelectedIds.length}</b> 人 <a onclick="clearMessageProjectPersonDraft()">清空</a></div></div><div class="table-wrap roster-table-wrap"><table style="min-width:${getTableMinWidth('messageProjectManagementPersonPicker')}px"><thead><tr>${renderTableHeaderByColumns("messageProjectManagementPersonPicker")}</tr></thead><tbody id="messageProjectPersonTbody"></tbody></table></div><div class="pagination"><span id="messageProjectPersonTotal">共 0 条</span><span>当前项目全部管理人员</span></div></section></div></div>`;}

function openMessageProjectPersonPicker(targetId){
  messageProjectPersonPickerState.targetId=targetId;messageProjectPersonPickerState.draftSelectedIds=getMessageProjectPersonPickerSelectedIds(targetId);messageProjectPersonPickerState.filters={projectName:"",subCompany:"",branchCompany:"",projectManager:"",name:"",post:"",unit:"",projectCode:""};
  messageProjectPersonPickerState.activeProjectId=String(getMessageProjectPersonProjects()[0]?.id||"");
  openNestedModal("选择项目管理人员",renderMessageProjectPersonPickerModalBody(),`<button class="btn" onclick="closeNestedModal(this)">取消</button><button class="btn primary" onclick="confirmMessageProjectPersonPicker(this)">确定</button>`);
  document.querySelector(".nested-modal-mask:last-child .nested-modal")?.classList.add("message-project-person-picker-modal");renderMessageProjectPersonTable();
}
function renderMessageProjectPersonPickerModal(){const projects=getMessageProjectPersonFilteredProjects();if(!projects.some(row=>String(row.id)===String(messageProjectPersonPickerState.activeProjectId)))messageProjectPersonPickerState.activeProjectId=String(projects[0]?.id||"");const body=document.querySelector(".message-project-person-picker-modal .modal-bd");if(body){body.innerHTML=renderMessageProjectPersonPickerModalBody();renderMessageProjectPersonTable();}}
function renderMessageProjectPersonTable(){const rows=getMessageProjectPersonFilteredRows();renderTableByColumns("messageProjectManagementPersonPicker",rows,"messageProjectPersonTbody");const total=document.getElementById("messageProjectPersonTotal");if(total)total.textContent=`共 ${rows.length} 条`;}
function queryMessageProjectPersonPicker(){syncMessageProjectPersonFilters();renderMessageProjectPersonPickerModal();}
function resetMessageProjectPersonPicker(){messageProjectPersonPickerState.filters={projectName:"",subCompany:"",branchCompany:"",projectManager:"",name:"",post:"",unit:"",projectCode:""};renderMessageProjectPersonPickerModal();}
function switchMessageProjectPersonProject(id){messageProjectPersonPickerState.activeProjectId=String(id);renderMessageProjectPersonPickerModal();}
function toggleMessageProjectPersonRow(id,checked){const selected=new Set(messageProjectPersonPickerState.draftSelectedIds);checked?selected.add(String(id)):selected.delete(String(id));messageProjectPersonPickerState.draftSelectedIds=[...selected];document.querySelector(".message-project-person-selected b")?.replaceChildren(document.createTextNode(String(selected.size)));const list=document.querySelector(".message-project-person-project-list");if(list)list.innerHTML=renderMessageProjectPersonProjectList();}
function toggleMessageProjectPersonAll(checked){document.querySelectorAll(".message-project-person-row-check").forEach(box=>{box.checked=checked;toggleMessageProjectPersonRow(box.value,checked);});}
function clearMessageProjectPersonDraft(){messageProjectPersonPickerState.draftSelectedIds=[];renderMessageProjectPersonPickerModal();}
function confirmMessageProjectPersonPicker(button){setMessageProjectPersonPickerValues(messageProjectPersonPickerState.targetId,messageProjectPersonPickerState.draftSelectedIds);closeNestedModal(button);}

const __originRenderMessageReceiverTargetPickerV2564=renderMessageReceiverTargetPicker;
renderMessageReceiverTargetPicker=function(type,id){if(type==="person"&&getMessageProjectPickerReceiverLevel(id)==="project")return `<label class="target-inner-label">选择人员${renderMessageProjectPersonPicker(id,[])}</label>`;return __originRenderMessageReceiverTargetPickerV2564(type,id);};
const __originSetMessagePersonPickerValuesV2564=setMessagePersonPickerValues;
setMessagePersonPickerValues=function(id,values=[]){if(document.getElementById(id)?.classList.contains("message-project-person-picker"))return setMessageProjectPersonPickerValues(id,values);return __originSetMessagePersonPickerValuesV2564(id,values);};
const __originGetMessagePersonPickerValuesV2564=getMessagePersonPickerValues;
getMessagePersonPickerValues=function(id){if(document.getElementById(id)?.classList.contains("message-project-person-picker"))return getMessageProjectPersonPickerSelectedIds(id);return __originGetMessagePersonPickerValuesV2564(id);};
const __originGetTemplateTargetValueForSendV2564=getTemplateTargetValueForSend;
getTemplateTargetValueForSend=function(){if(document.getElementById("msgTplTargetValue")?.classList.contains("message-project-person-picker"))return getMessageProjectPersonPickerLabels("msgTplTargetValue").join("，");return __originGetTemplateTargetValueForSendV2564();};
