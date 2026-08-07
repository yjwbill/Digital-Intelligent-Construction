/* =========================
   左侧菜单
========================= */
function hasActiveChild(item){
  return item.children&&item.children.some(c=>c.active);
}

function clearBusinessMenuActive(line){
  (businessMenus[line]?.menus||[]).forEach(item=>{
    item.active=false;
    if(item.children)item.children.forEach(c=>c.active=false);
  });
}

function collapseInactiveGroups(line){
  (businessMenus[line]?.menus||[]).forEach(item=>{
    if(item.children)item.open=hasActiveChild(item);
  });
}

function renderPcTopNavigation(){
  const nav=document.getElementById("primaryNav");
  const title=document.getElementById("portalTitle");
  const icon=document.getElementById("portalLogoIcon");
  const pop=document.getElementById("portalSwitchPop");
  if(title)title.textContent=pcPortalState.mode==="project"?"项目管理":"企业管理";
  if(icon)icon.textContent="";
  document.body.classList.toggle("project-portal-mode",pcPortalState.mode==="project");
  document.body.classList.toggle("enterprise-portal-mode",pcPortalState.mode!=="project");
  renderPcContextSwitcher();
  if(pop){
    pop.querySelectorAll("[data-portal]").forEach(btn=>{
      btn.classList.toggle("active",btn.dataset.portal===pcPortalState.mode);
    });
  }
  if(!nav)return;
  if(pcPortalState.mode==="project"){
    nav.innerHTML=projectPrimaryMenus.map(item=>`
      <div class="primary-menu-item ${pcPortalState.projectLine===item.key?"active":""}" data-line="${item.key}" onclick="switchProjectLine('${item.key}')">${item.name}</div>
    `).join("");
  }else{
    nav.innerHTML=enterprisePrimaryMenus.map(item=>`
      <div class="primary-menu-item ${currentBusinessLine===item.key?"active":""}" data-line="${item.key}" onclick="switchBusinessLine('${item.key}')">${item.name}</div>
    `).join("");
  }
}

const projectContextSwitchState={
  projectName:"",subCompany:"",branchCompany:"",projectStatus:"",projectManager:"",region:"",provinceCity:"",isSafetyManaged:"",
  page:1,pageSize:50
};

function getProjectContextUniqueOptions(key,rows=getProjectContextOptions()){
  return [...new Set(rows.map(item=>String(item?.[key]||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"zh-CN"));
}

function renderProjectContextSelect(id,label,key,rows,sourceRows=rows){
  const value=projectContextSwitchState[key]||"";
  return `<label class="project-switch-field"><span>${label}</span><select id="${id}" class="select"><option value="">全部</option>${getProjectContextUniqueOptions(key,sourceRows).map(item=>`<option value="${escapeAttr(item)}" ${item===value?"selected":""}>${item}</option>`).join("")}</select></label>`;
}

function getFilteredProjectContextOptions(){
  const state=projectContextSwitchState;
  return getProjectContextOptions().filter(project=>{
    const includes=(key,value)=>!value||String(project[key]||"").toLowerCase().includes(String(value).toLowerCase());
    const equals=(key,value)=>!value||String(project[key]||"")===String(value);
    return includes("projectName",state.projectName)&&equals("subCompany",state.subCompany)&&equals("branchCompany",state.branchCompany)
      &&equals("projectStatus",state.projectStatus)&&includes("projectManager",state.projectManager)&&equals("region",state.region)
      &&includes("provinceCity",state.provinceCity)&&equals("isSafetyManaged",state.isSafetyManaged);
  });
}

function syncProjectContextFilters(){
  projectContextSwitchState.projectName=document.getElementById("projectSwitchName")?.value.trim()||"";
  projectContextSwitchState.subCompany=document.getElementById("projectSwitchSubCompany")?.value||"";
  projectContextSwitchState.branchCompany=document.getElementById("projectSwitchBranchCompany")?.value||"";
  projectContextSwitchState.projectStatus=document.getElementById("projectSwitchStatus")?.value||"";
  projectContextSwitchState.projectManager=document.getElementById("projectSwitchManager")?.value.trim()||"";
  projectContextSwitchState.region=document.getElementById("projectSwitchRegion")?.value||"";
  projectContextSwitchState.provinceCity=document.getElementById("projectSwitchProvinceCity")?.value.trim()||"";
  projectContextSwitchState.isSafetyManaged=document.getElementById("projectSwitchSafetyManaged")?.value||"";
  projectContextSwitchState.page=1;
  renderPcContextSwitcher();
}

function resetProjectContextFilters(){
  Object.assign(projectContextSwitchState,{projectName:"",subCompany:"",branchCompany:"",projectStatus:"",projectManager:"",region:"",provinceCity:"",isSafetyManaged:"",page:1});
  renderPcContextSwitcher();
}

function changeProjectContextPage(page){
  const totalPages=Math.max(1,Math.ceil(getFilteredProjectContextOptions().length/projectContextSwitchState.pageSize));
  projectContextSwitchState.page=Math.max(1,Math.min(totalPages,Number(page)||1));
  renderPcContextSwitcher();
}

function changeProjectContextPageSize(size){
  projectContextSwitchState.pageSize=[10,20,50,100].includes(Number(size))?Number(size):50;
  projectContextSwitchState.page=1;
  renderPcContextSwitcher();
}

function renderProjectContextPager(total,totalPages){
  const current=projectContextSwitchState.page;
  return `<div class="pagination project-switch-pagination"><span>共 ${total} 个项目</span><div class="pager"><button type="button" class="btn mini" ${current<=1?"disabled":""} onclick="changeProjectContextPage(${current-1})">上一页</button><b>第 ${current} / ${totalPages} 页</b><button type="button" class="btn mini" ${current>=totalPages?"disabled":""} onclick="changeProjectContextPage(${current+1})">下一页</button><select class="select mini-select" onchange="changeProjectContextPageSize(this.value)">${[10,20,50,100].map(size=>`<option value="${size}" ${size===projectContextSwitchState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select></div></div>`;
}

function renderProjectContextDropdown(currentProject){
  const allProjects=getProjectContextOptions();
  const filtered=getFilteredProjectContextOptions().sort((a,b)=>Number(String(b.id)===String(currentProject?.id))-Number(String(a.id)===String(currentProject?.id)));
  const totalPages=Math.max(1,Math.ceil(filtered.length/projectContextSwitchState.pageSize));
  if(projectContextSwitchState.page>totalPages)projectContextSwitchState.page=totalPages;
  const start=(projectContextSwitchState.page-1)*projectContextSwitchState.pageSize;
  const rows=filtered.slice(start,start+projectContextSwitchState.pageSize);
  const branchSource=projectContextSwitchState.subCompany?allProjects.filter(item=>item.subCompany===projectContextSwitchState.subCompany):allProjects;
  return `
    <div class="project-switch-panel" onclick="event.stopPropagation()">
      <div class="project-switch-heading"><div><strong>我的项目</strong><span>选择项目后进入对应项目管理空间</span></div><span class="project-switch-current">当前：${escapeAttr(currentProject?.projectName||"--")}</span></div>
      <div class="project-switch-filters">
        <label class="project-switch-field"><span>项目名称</span><input id="projectSwitchName" class="input" value="${escapeAttr(projectContextSwitchState.projectName)}" placeholder="请输入项目名称" onkeydown="if(event.key==='Enter')syncProjectContextFilters()"/></label>
        ${renderProjectContextSelect("projectSwitchSubCompany","子公司","subCompany",allProjects)}
        ${renderProjectContextSelect("projectSwitchBranchCompany","分公司","branchCompany",allProjects,branchSource)}
        ${renderProjectContextSelect("projectSwitchStatus","项目状态","projectStatus",allProjects)}
        <label class="project-switch-field"><span>项目经理</span><input id="projectSwitchManager" class="input" value="${escapeAttr(projectContextSwitchState.projectManager)}" placeholder="请输入项目经理" onkeydown="if(event.key==='Enter')syncProjectContextFilters()"/></label>
        ${renderProjectContextSelect("projectSwitchRegion","所属区域","region",allProjects)}
        <label class="project-switch-field"><span>所在省市</span><input id="projectSwitchProvinceCity" class="input" value="${escapeAttr(projectContextSwitchState.provinceCity)}" placeholder="请输入省/市" onkeydown="if(event.key==='Enter')syncProjectContextFilters()"/></label>
        ${renderProjectContextSelect("projectSwitchSafetyManaged","安全纳管","isSafetyManaged",allProjects)}
      </div>
      <div class="project-switch-actions"><button type="button" class="btn" onclick="resetProjectContextFilters()">重置</button><button type="button" class="btn primary" onclick="syncProjectContextFilters()">查询</button></div>
      <div class="project-switch-list">
        ${rows.length?rows.map(project=>`<button type="button" class="project-switch-item ${String(project.id)===String(currentProject?.id)?"active":""}" onclick="selectProjectContext(event,'${escapeAttr(project.id)}')">
          <span class="project-switch-avatar">${escapeAttr((project.projectName||"项").trim().slice(0,1))}</span>
          <span class="project-switch-info"><strong>${escapeAttr(project.projectName)}</strong><span>${escapeAttr(project.subCompany||"--")} / ${escapeAttr(project.branchCompany||"--")}</span><em><i class="status-${project.projectStatus}">${escapeAttr(project.projectStatus||"--")}</i><b>${escapeAttr(project.region||"--")}</b><b>${escapeAttr(project.projectType||"--")}</b><b>${escapeAttr(project.projectManager||"--")}</b><b>${escapeAttr(project.provinceCity||"--")}</b><b class="safety-${project.isSafetyManaged}">安全纳管：${escapeAttr(project.isSafetyManaged||"--")}</b></em></span>
          <span class="org-check">✓</span>
        </button>`).join(""):'<div class="project-switch-empty">暂无符合条件的项目，请调整查询条件</div>'}
      </div>
      ${renderProjectContextPager(filtered.length,totalPages)}
    </div>`;
}

function renderPcContextSwitcher(){
  const label=document.querySelector(".org-label");
  const name=document.getElementById("currentOrgName");
  const dropdown=document.querySelector(".org-dropdown");
  if(!label||!name||!dropdown)return;
  if(pcPortalState.mode==="project"){
    const currentProject=getCurrentProjectContext();
    label.textContent="【项目】";
    name.textContent=currentProject?.projectName||pcPortalState.currentProject;
    dropdown.innerHTML=renderProjectContextDropdown(currentProject);
  }else{
    label.textContent="组织";
    const root=getOrganizationRoot();
    name.textContent=root.name;
    const topOptions=[
      root,
      ...organizationMasterData.filter(item=>item.level===2),
      ...organizationMasterData.filter(item=>item.level===3).slice(0,8)
    ];
    dropdown.innerHTML=`
      <div class="org-dropdown-title">切换组织</div>
      ${topOptions.map((item,index)=>{
        const parent=getOrganizationByCode(item.parentCode);
        const desc=item.level===1?"股份级 · 查看全部组织数据":`${getOrganizationLevelName(item.level)} · ${parent?`${parent.name}下属组织`:"按组织权限查看"}`;
        return `
          <div class="org-option ${index===0?"active":""}" onclick="selectOrg(event,'${item.name}','${parent?.name||""}')">
            <div><div class="org-name">${item.name}</div><div class="org-desc">${desc}</div></div>
            <span class="org-check">✓</span>
          </div>
        `;
      }).join("")}
    `;
  }
}

function getProjectContextOptions(){
  return Array.isArray(constructionProjectData)?constructionProjectData:[];
}

function getCurrentProjectContext(){
  const projects=getProjectContextOptions();
  let project=projects.find(item=>String(item.id)===String(pcPortalState.currentProjectId));
  if(!project)project=projects.find(item=>item.projectName===pcPortalState.currentProject);
  if(!project)project=projects[0];
  if(project){
    pcPortalState.currentProjectId=project.id;
    pcPortalState.currentProject=project.projectName;
  }
  return project||null;
}

function resetProjectContextViewState(){
  projectLogState.page=1;
  projectLogState.workArea="";
  projectLogState.mode="";
  projectLogState.keyword="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.selectedDate=getFirstUploadedProjectLogDate();
  projectOverviewImageIndex=0;
  closeModal();
}

function selectProjectContext(event,projectId){
  event?.stopPropagation?.();
  const project=getProjectContextOptions().find(item=>String(item.id)===String(projectId)||item.projectName===projectId);
  if(!project)return;
  pcPortalState.currentProjectId=project.id;
  pcPortalState.currentProject=project.projectName;
  resetProjectContextViewState();
  document.getElementById("currentOrgName").textContent=project.projectName;
  document.querySelector(".org-switch")?.classList.remove("open");
  renderPcContextSwitcher();
  if(pcPortalState.mode==="project"){
    renderProjectPortalPage(getActiveProjectMenuName(pcPortalState.projectLine));
  }
  window.dispatchEvent(new CustomEvent("projectcontextchange",{detail:{project:{...project}}}));
  showToast(`已切换项目：${project.projectName}`);
}

function togglePcPortalDropdown(event){
  event?.stopPropagation?.();
  document.querySelector(".portal-switch")?.classList.toggle("open");
}

function switchPcPortal(event,mode){
  event?.stopPropagation?.();
  pcPortalState.mode=mode==="project"?"project":"enterprise";
  document.querySelector(".portal-switch")?.classList.remove("open");
  listPage.style.display="flex";
  detailPage.style.display="none";
  renderPcTopNavigation();
  resetBottomCenterState();
  if(pcPortalState.mode==="project"){
    pcPortalState.projectLine=pcPortalState.projectLine || "home";
    renderProjectSideMenu(pcPortalState.projectLine);
    renderProjectPortalPage("项目总览");
    showToast("已切换到项目管理");
  }else{
    activateProductionDashboardMenu();
    currentBusinessLine="production";
    renderPcTopNavigation();
    renderSideMenu("production");
    renderProductionOverviewDashboardPage();
    showToast("已切换到企业管理");
  }
  refreshBottomFixedMenu();
}

function resetBottomCenterState(){
  messageCenterState.type="消息通知";
  messageCenterState.status="全部";
  messageCenterState.module1="";
  messageCenterState.module2="";
  messageCenterState.org="";
  messageCenterState.orgAggregate=false;
  messageCenterState.search="";
  messageCenterState.page=1;
  todoCenterState.status="全部";
  todoCenterState.module1="";
  todoCenterState.module2="";
  todoCenterState.org="";
  todoCenterState.orgAggregate=false;
  todoCenterState.search="";
  todoCenterState.page=1;
}

function clearProjectMenuActive(line){
  (projectPortalMenus[line]?.menus||[]).forEach(item=>{
    item.active=false;
    if(item.children)item.children.forEach(child=>child.active=false);
  });
}

function getActiveProjectMenuName(line){
  const menus=projectPortalMenus[line]?.menus||[];
  for(const item of menus){
    if(item.active)return item.name;
    const child=item.children?.find(child=>child.active);
    if(child)return child.name;
  }
  return menus[0]?.children?.[0]?.name || menus[0]?.name || projectPortalMenus[line]?.title || "项目管理";
}

function activateFirstProjectMenu(line){
  const menus=projectPortalMenus[line]?.menus||[];
  menus.forEach((item,index)=>{
    item.active=false;
    if(item.children?.length){
      item.open=index===0;
      item.children.forEach((child,childIndex)=>child.active=index===0&&childIndex===0);
    }else{
      item.active=index===0;
      if(item.children)item.children.forEach(child=>child.active=false);
    }
  });
}

function renderProjectSideMenu(line){
  const side=document.getElementById("sideMenu");
  const config=projectPortalMenus[line];
  if(!side||!config)return;
  side.innerHTML=`
    <div class="menu-title">${config.title}</div>
    ${config.menus.map((item,i)=>{
      if(item.children?.length){
        const isOpen=item.open||hasActiveChild(item);
        return `
          <div class="menu-group project-menu-group ${isOpen?"open":""}" data-project-group-index="${i}">
            <div class="menu-group-title" onclick="toggleProjectSideGroup('${line}',${i})">
              <div class="menu-group-title-left">
                <span>${item.icon}</span>
                <span>${item.name}</span>
              </div>
              <span class="menu-group-arrow" aria-hidden="true"></span>
            </div>
            <div class="menu-children">
              ${item.children.map((child,j)=>`
                <div class="menu-child-item ${child.active?"active":""}" onclick="selectProjectChildMenu('${line}',${i},${j},'${child.name}')">
                  ${child.name}
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
      return `
        <div class="menu-item ${item.active?"active":""}" onclick="selectProjectMenu('${line}',${i},'${item.name}')">
          ${item.icon} ${item.name}
        </div>
      `;
    }).join("")}
  `;
}

function switchProjectLine(line){
  pcPortalState.mode="project";
  pcPortalState.projectLine=line;
  activateFirstProjectMenu(line);
  listPage.style.display="flex";
  detailPage.style.display="none";
  renderPcTopNavigation();
  renderProjectSideMenu(line);
  renderProjectPortalPage(getActiveProjectMenuName(line));
}

function selectProjectMenu(line,index,name){
  pcPortalState.mode="project";
  pcPortalState.projectLine=line;
  const config=projectPortalMenus[line];
  if(config?.menus?.length){
    clearProjectMenuActive(line);
    config.menus.forEach((item,i)=>{
      if(item.children)item.open=false;
      item.active=i===index;
    });
  }
  listPage.style.display="flex";
  detailPage.style.display="none";
  renderPcTopNavigation();
  renderProjectSideMenu(line);
  renderProjectPortalPage(name);
}

function toggleProjectSideGroup(line,index){
  const group=document.querySelector(`.project-menu-group[data-project-group-index="${index}"]`);
  if(group)group.classList.toggle("open");
  const item=projectPortalMenus[line]?.menus?.[index];
  if(item)item.open=!item.open;
}

function selectProjectChildMenu(line,groupIndex,childIndex,name){
  pcPortalState.mode="project";
  pcPortalState.projectLine=line;
  const menus=projectPortalMenus[line]?.menus||[];
  clearProjectMenuActive(line);
  menus.forEach((item,index)=>{
    if(item.children)item.open=index===groupIndex;
  });
  const parent=menus[groupIndex];
  if(parent?.children?.[childIndex]){
    parent.open=true;
    parent.children[childIndex].active=true;
  }
  listPage.style.display="flex";
  detailPage.style.display="none";
  renderPcTopNavigation();
  renderProjectSideMenu(line);
  renderProjectPortalPage(name);
}

const projectLogState={
  page:1,
  pageSize:50,
  month:"2026-07",
  selectedDate:"2026-07-13",
  workArea:"",
  mode:"",
  keyword:"",
  startDate:"",
  endDate:""
};

const projectLogStatusMap={};

const projectLogStatusIconMap={
  uploaded:{src:"./src/assets/log-status-reported.svg",label:"已上报"},
  missing:{src:"./src/assets/log-status-missing.svg",label:"未上报"},
  stopped:{src:"./src/assets/log-status-stopped.svg",label:"停工未上报"},
  "not-started":{src:"./src/assets/log-status-not-started.svg",label:"未开始"},
  future:{src:"./src/assets/log-status-not-started.svg",label:"未开始"}
};

function renderProjectLogStatusIcon(status){
  const icon=projectLogStatusIconMap[status]||projectLogStatusIconMap["not-started"];
  return `<img class="project-log-status-icon ${status}" src="${icon.src}" alt="${icon.label}"/>`;
}

const projectLogCustomRows=[];
const projectLogDeletedKeys=new Set();
globalThis.projectLogDeletedKeys=projectLogDeletedKeys;
let projectLogEditingRow=null;

function getProjectLogRecordKey(row){
  return `${row.projectName||pcPortalState.currentProject}|${row.date}`;
}

function getProjectLogModeRecordKey(row){
  return `${getProjectLogRecordKey(row)}|${row.mode||""}`;
}

function removeProjectLogCustomRowForEdit(editing){
  if(!editing)return;
  const targetId=editing.sourceId||editing.id;
  const targetMode=editing.sourceMode||editing.mode;
  for(let index=projectLogCustomRows.length-1;index>=0;index--){
    const row=projectLogCustomRows[index];
    if(String(row.id)===String(targetId)||(row.projectName===(editing.projectName||pcPortalState.currentProject)&&row.date===editing.date&&row.mode===targetMode)){
      projectLogCustomRows.splice(index,1);
    }
  }
}

function getCurrentProjectLogProject(){
  return getCurrentProjectContext();
}

function getProjectLogRows(){
  const project=getCurrentProjectLogProject();
  if(!project)return sortProjectLogRows(mergeProjectLogRowsByDate(projectLogCustomRows));
  const generated=["2026-06","2026-07"].flatMap(monthValue=>{
    const meta=getEnterpriseConstructionLogMonthMetaByValue(monthValue);
    return Array.from({length:meta.days},(_,index)=>index+1)
      .filter(day=>getEnterpriseConstructionLogDayStateForMonth(project,day,monthValue)==="reported")
      .map(day=>({...getEnterpriseConstructionLogReportRecord(project,day,monthValue),projectName:project.projectName}));
  });
  const customRows=projectLogCustomRows.filter(row=>row.projectName===project.projectName&&!projectLogDeletedKeys.has(getProjectLogRecordKey(row)));
  const customModeKeys=new Set(customRows.map(row=>getProjectLogModeRecordKey(row)));
  const sourceRows=[
    ...customRows,
    ...generated.filter(row=>!customModeKeys.has(getProjectLogModeRecordKey(row))&&!projectLogDeletedKeys.has(getProjectLogRecordKey(row)))
  ];
  return sortProjectLogRows(mergeProjectLogRowsByDate(sourceRows));
}

function sortProjectLogRows(rows){
  return rows.sort((a,b)=>(Number(b.customUpdatedAt)||0)-(Number(a.customUpdatedAt)||0)||b.date.localeCompare(a.date));
}

function splitProjectLogAreaText(value){
  return String(value||"")
    .split(/[、,，;；/／+＋\s]+/)
    .map(area=>area.trim())
    .filter(Boolean);
}

function getProjectLogRowAreas(row){
  const areas=[
    ...splitProjectLogAreaText(row?.workArea),
    ...splitProjectLogAreaText(row?.onlineRecord?.workArea),
    ...splitProjectLogAreaText(row?.fileRecord?.workArea),
    ...(Array.isArray(row?.fileEntries)?row.fileEntries.flatMap(entry=>splitProjectLogAreaText(entry.area)):[]),
    ...(Array.isArray(row?.fileRecord?.fileEntries)?row.fileRecord.fileEntries.flatMap(entry=>splitProjectLogAreaText(entry.area)):[]),
    ...(Array.isArray(row?.today)?row.today.flatMap(item=>splitProjectLogAreaText(item.area)):[]),
    ...(Array.isArray(row?.tomorrow)?row.tomorrow.flatMap(item=>splitProjectLogAreaText(item.area)):[])
  ];
  return [...new Set(areas)];
}

function getProjectLogFilterAreas(){
  return [...new Set(getProjectLogRows().flatMap(row=>getProjectLogRowAreas(row)))];
}

function normalizeProjectLogAreaFilter(){
  if(projectLogState.workArea&&!getProjectLogFilterAreas().includes(projectLogState.workArea)){
    projectLogState.workArea="";
  }
}

function mergeProjectLogRowsByDate(rows){
  const groups=new Map();
  rows.forEach(row=>{
    const key=getProjectLogRecordKey(row);
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(row);
  });
  return [...groups.values()].map(group=>mergeProjectLogDateGroup(group));
}

function mergeProjectLogDateGroup(group){
  const merged=group.find(row=>row.mode==="merged")||null;
  const online=group.find(row=>row.mode==="online")||merged;
  const file=group.find(row=>row.mode==="file")||merged;
  const primary=online||file||group[0];
  const latest=group.slice().sort((a,b)=>String(b.uploadTime||"").localeCompare(String(a.uploadTime||"")))[0]||primary;
  const areas=[...new Set(group.flatMap(row=>getProjectLogRowAreas(row)))];
  const uploaders=[...new Set(group.map(row=>row.uploader).filter(Boolean))];
  const customUpdatedAt=Math.max(0,...group.map(row=>Number(row.customUpdatedAt)||0));
  const hasOnline=Boolean(online);
  const hasFile=Boolean(file);
  return {
    ...primary,
    id:`project-log-${primary.projectName||pcPortalState.currentProject}-${primary.date}`,
    sourceId:primary.id,
    sourceMode:primary.mode,
    mode:hasOnline&&hasFile?"merged":primary.mode,
    hasOnline,
    hasFile,
    onlineRecord:online,
    fileRecord:file,
    title:hasOnline&&hasFile?"施工日志":primary.title,
    workArea:getProjectLogAreaSummary(areas)||primary.workArea,
    uploader:uploaders.join("、")||primary.uploader,
    uploadTime:latest.uploadTime||primary.uploadTime,
    customUpdatedAt,
    fileName:file?.fileName||primary.fileName||"",
    fileSize:file?.fileSize||primary.fileSize||"",
    files:file?.files||primary.files||[],
    summary:online?.summary||file?.summary||primary.summary||"",
    cover:online?.cover||primary.cover||""
  };
}
let projectLogReportPhotoList=[];
let projectLogReportFileList=[];
let projectLogReportFileRows=[];
let projectLogCurrentAssignment=null;
const projectLogAssignments=[];
let projectLogMilestoneTab="ongoing";
let projectLogMilestoneDraftRows=[];

function getProjectLogSharedDetail(row){
  return {
    milestones:Array.isArray(row?.milestones)?row.milestones:[],
    risks:Array.isArray(row?.risks)?row.risks:[]
  };
}

function getProjectLogSyncedSharedDetail(targetMode,date,area,editRow=null){
  const own=getProjectLogSharedDetail(editRow);
  const projectName=editRow?.projectName||pcPortalState.currentProject;
  const oppositeMode=targetMode==="online"?"file":"online";
  const candidates=projectLogCustomRows.filter(row=>
    row.projectName===projectName&&
    row.date===date&&
    row.mode===oppositeMode&&
    (Array.isArray(row.milestones)||Array.isArray(row.risks))
  );
  const opposite=(candidates.find(row=>row.workArea===area)||candidates[0])||null;
  const synced=getProjectLogSharedDetail(opposite);
  return {
    milestones:own.milestones.length?own.milestones:synced.milestones,
    risks:own.risks.length?own.risks:synced.risks
  };
}

function refreshProjectLogSharedSections(prefix){
  const mode=prefix==="projectLogFileReport"?"file":"online";
  const date=document.getElementById(`${prefix}Date`)?.value||getProjectLogTodayValue();
  const area=document.getElementById(`${prefix}Area`)?.value||document.querySelector(".project-log-file-row-area")?.value||"";
  const detail=getProjectLogSyncedSharedDetail(mode,date,area,projectLogEditingRow);
  projectLogMilestoneDraftRows=Array.isArray(detail.milestones)?detail.milestones.map(item=>({...item})):[];
  const milestoneBox=document.getElementById("projectLogMilestoneRows");
  if(milestoneBox)milestoneBox.innerHTML=renderProjectLogMilestoneRows(projectLogMilestoneDraftRows,date);
  const riskBox=document.getElementById("projectLogRiskRows");
  if(riskBox)riskBox.innerHTML=renderProjectLogRiskRows(detail.risks);
}

function getProjectLogFilteredRows(){
  return getProjectLogRows().filter(row=>{
    if(projectLogState.workArea&&!getProjectLogRowAreas(row).includes(projectLogState.workArea))return false;
    if(projectLogState.mode&&row.mode!==projectLogState.mode)return false;
    if(projectLogState.keyword&&!(row.title.includes(projectLogState.keyword)||row.uploader.includes(projectLogState.keyword)||row.workArea.includes(projectLogState.keyword)||row.summary.includes(projectLogState.keyword)||row.fileName.includes(projectLogState.keyword)))return false;
    if(projectLogState.startDate&&row.date<projectLogState.startDate)return false;
    if(projectLogState.endDate&&row.date>projectLogState.endDate)return false;
    return true;
  });
}

function getProjectLogPagedRows(){
  const rows=getProjectLogFilteredRows();
  const pageCount=Math.max(1,Math.ceil(rows.length/projectLogState.pageSize));
  projectLogState.page=Math.min(Math.max(1,projectLogState.page),pageCount);
  const start=(projectLogState.page-1)*projectLogState.pageSize;
  return rows.slice(start,start+projectLogState.pageSize);
}

function renderProjectLogCard(row){
  const modeLabel=row.mode==="merged"?"在线+文件":row.mode==="online"?"在线上报":"文件上报";
  const previewMode=row.hasOnline||row.mode==="online"?"online":"file";
  return `
    <article class="project-log-report-card ${row.mode}" data-project-log-detail="${row.id}" onclick="openProjectLogDetail('${escapeAttr(row.id)}')">
      <span class="project-log-mode ${row.mode}">${modeLabel}</span>
      ${previewMode==="online"?`
        <img src="${row.cover || "./src/assets/project-log-building.png"}" alt="${row.title}"/>
      `:`
        <div class="project-log-file-box">
          <div class="project-log-file-icon">▤</div>
          <strong>${row.fileName}</strong>
          <span>${row.fileSize}</span>
        </div>
      `}
      <div class="project-log-card-body">
        <h3>${row.workArea}</h3>
        <p>上传人：${row.uploader}</p>
        <p>上传时间：${row.uploadTime}</p>
      </div>
      <div class="project-log-card-actions" onclick="event.stopPropagation()">
        <button type="button" onclick="exportProjectLog('${escapeAttr(row.id)}')">导出</button>
        <button type="button" onclick="editProjectLog('${escapeAttr(row.id)}')">编辑</button>
        <button type="button" class="danger" onclick="deleteProjectLog('${escapeAttr(row.id)}')">删除</button>
      </div>
    </article>
  `;
}

function renderProjectLogPagination(){
  const total=getProjectLogFilteredRows().length;
  const pageCount=Math.max(1,Math.ceil(total/projectLogState.pageSize));
  return `
    <div class="pagination project-log-pagination">
      <span>共 ${total} 条</span>
      <div class="pager">
        <button class="btn mini" ${projectLogState.page<=1?"disabled":""} onclick="changeProjectLogPage(${projectLogState.page-1})">上一页</button>
        <b>第 ${projectLogState.page} / ${pageCount} 页</b>
        <button class="btn mini" ${projectLogState.page>=pageCount?"disabled":""} onclick="changeProjectLogPage(${projectLogState.page+1})">下一页</button>
        <select class="select mini-select" onchange="projectLogState.pageSize=Number(this.value)||50;projectLogState.page=1;renderProjectLogPage()">
          <option value="12" ${projectLogState.pageSize===12?"selected":""}>12条/页</option>
          <option value="24" ${projectLogState.pageSize===24?"selected":""}>24条/页</option>
        </select>
      </div>
    </div>
  `;
}

function renderProjectLogMonthSwitch(){
  const [year,month]=projectLogState.month.split("-").map(Number);
  const label=`${year}年${String(month).padStart(2,"0")}月`;
  const next=new Date(year,month,1);
  const nextValue=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`;
  return `<div class="enterprise-log-month-switch" aria-label="施工日志月份">
    <button type="button" title="上一个月" onclick="changeProjectLogMonth(-1)">&#8249;</button>
    <strong>${label}</strong>
    <button type="button" title="下一个月" ${isEnterpriseConstructionLogFutureMonth(nextValue)?"disabled":""} onclick="changeProjectLogMonth(1)">&#8250;</button>
  </div>`;
}

function getProjectLogCalendarDays(){
  const [year,month]=projectLogState.month.split("-").map(Number);
  const first=new Date(year,month-1,1);
  const totalDays=new Date(year,month,0).getDate();
  const prevDays=new Date(year,month-1,0).getDate();
  const offset=first.getDay();
  const days=[];
  const project=getCurrentProjectLogProject();
  const uploadedDates=new Set(getProjectLogRows().map(row=>row.date));
  const todayValue=getProjectLogTodayValue();
  for(let i=offset-1;i>=0;i--)days.push({day:prevDays-i,muted:true});
  for(let day=1;day<=totalDays;day++){
    const date=`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const key=`${project?.projectName||""}|${date}`;
    const status=projectLogDeletedKeys.has(key)
      ?"missing"
      :uploadedDates.has(date)
        ?"uploaded"
        :date>todayValue
          ?"not-started"
          :project?.projectStatus==="停工"
            ?"stopped"
            :"missing";
    days.push({day,date,status:status==="reported"?"uploaded":status,selected:projectLogState.selectedDate===date});
  }
  let next=1;
  while(days.length<42)days.push({day:next++,muted:true});
  return days;
}

function getProjectLogDateStatus(date){
  return getProjectLogCalendarDays().find(item=>item.date===date)?.status || "not-started";
}

function getFirstUploadedProjectLogDate(){
  return getProjectLogCalendarDays().find(item=>!item.muted&&item.status==="uploaded")?.date || "";
}

function renderProjectLogCalendar(){
  return `
    <section class="card project-log-calendar-card">
      <div class="project-log-calendar-head">
        <h3>施工日历</h3>
        ${renderProjectLogMonthSwitch()}
      </div>
      <div class="project-log-weekdays">${["日","一","二","三","四","五","六"].map(x=>`<span>${x}</span>`).join("")}</div>
      <div class="project-log-calendar-grid">
        ${getProjectLogCalendarDays().map(item=>`
          <button class="${item.muted?"muted":""} ${item.selected?"selected":""} ${item.status||""}" ${item.muted?"":"data-project-log-date=\""+item.date+"\""}>
            <span>${item.day}</span>
            ${item.muted?"":renderProjectLogStatusIcon(item.status)}
          </button>
        `).join("")}
      </div>
      <div class="project-log-legend">
        <span>${renderProjectLogStatusIcon("uploaded")}已上报</span>
        <span>${renderProjectLogStatusIcon("missing")}未上报</span>
        <span>${renderProjectLogStatusIcon("stopped")}停工未上报</span>
        <span>${renderProjectLogStatusIcon("not-started")}未开始</span>
      </div>
    </section>
    ${renderProjectLogSelectedDay()}
  `;
}

function renderProjectLogSelectedDay(){
  const status=getProjectLogDateStatus(projectLogState.selectedDate);
  if(status!=="uploaded"){
    return `
      <section class="card project-log-day-card project-log-day-empty-card">
        <div class="project-log-empty">请选择已上报日期查看施工日志</div>
      </section>
    `;
  }
  const rows=getProjectLogRows().filter(row=>row.date===projectLogState.selectedDate).slice(0,3);
  const date=new Date(projectLogState.selectedDate.replace(/-/g,"/"));
  const week=["日","一","二","三","四","五","六"][date.getDay()];
  return `
    <section class="card project-log-day-card">
      <h3>${projectLogState.selectedDate}（星期${week}）</h3>
      ${rows.length?rows.map(row=>`
        <button class="project-log-day-item" data-project-log-detail="${row.id}" onclick="openProjectLogDetail('${escapeAttr(row.id)}')">
          <div>
            <strong class="${row.mode}">${row.mode==="merged"?"在线+文件":row.mode==="online"?"在线上报":"文件上报"}</strong>
            <p>施工工区：${row.workArea}</p>
            <p>上传人：${row.uploader}</p>
            <p>上传时间：${row.uploadTime}</p>
          </div>
          ${row.hasOnline||row.mode==="online"?`<img src="${row.cover || "./src/assets/project-log-building.png"}" alt="${row.title}"/>`:`<span class="project-log-day-file">PDF</span>`}
        </button>
      `).join(""):`<div class="project-log-empty">当天暂无上报内容</div>`}
    </section>
  `;
}

function changeProjectLogPage(page){
  projectLogState.page=page;
  renderProjectLogPage();
}

function changeProjectLogMonth(delta){
  const [year,month]=projectLogState.month.split("-").map(Number);
  const date=new Date(year,month-1+delta,1);
  const nextValue=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
  if(isEnterpriseConstructionLogFutureMonth(nextValue))return;
  projectLogState.month=nextValue;
  normalizeProjectLogAreaFilter();
  projectLogState.selectedDate=getFirstUploadedProjectLogDate();
  renderProjectLogPage();
}

function changeProjectLogYear(delta){
  const [year,month]=projectLogState.month.split("-").map(Number);
  projectLogState.month=`${year+delta}-${String(month).padStart(2,"0")}`;
  normalizeProjectLogAreaFilter();
  projectLogState.selectedDate=getFirstUploadedProjectLogDate();
  renderProjectLogPage();
}

function selectProjectLogDate(date){
  projectLogState.selectedDate=date;
  renderProjectLogPage();
}

function queryProjectLogs(){
  projectLogState.workArea=document.getElementById("projectLogArea")?.value || "";
  projectLogState.mode=document.getElementById("projectLogMode")?.value || "";
  projectLogState.startDate=document.getElementById("projectLogStart")?.value || "";
  projectLogState.endDate=document.getElementById("projectLogEnd")?.value || "";
  projectLogState.keyword=document.getElementById("projectLogKeyword")?.value.trim() || "";
  projectLogState.page=1;
  renderProjectLogPage();
}

function resetProjectLogs(){
  projectLogState.workArea="";
  projectLogState.mode="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.keyword="";
  projectLogState.page=1;
  renderProjectLogPage();
}

function renderProjectLogReadonlyField(label,value){
  return `<div class="project-detail-field"><span>${label}</span><strong>${value||"-"}</strong></div>`;
}

function renderProjectLogReadonlySection(title,body,extraClass=""){
  return `
    <section class="project-detail-section project-log-readonly-section ${extraClass}">
      <div class="project-detail-section-title"><h3>${title}</h3></div>
      ${body}
    </section>
  `;
}

function getProjectLogReadonlyWeekday(date){
  const day=new Date(String(date).replace(/-/g,"/")).getDay();
  return `星期${["日","一","二","三","四","五","六"][day]}`;
}

function getProjectLogReadonlyOnlineDetail(row){
  const variation=Number(row.seed??row.id)%4;
  const risks=Array.isArray(row.risks)&&row.risks.length?row.risks:[
    ["风险类型","深基坑开挖","风险名称","附属结构土方开挖","风险等级","II级","计划开始日期","2026-01-01","计划完成日期","2026-09-16","实际开始日期","2026-03-26","风险描述","附属土方开挖","挂牌领导","蔡群群","计划持续时间","258天","是否完成","否","是否受控","是","风险情况","风险可控","风险进展情况","现场监测数据正常，风险处于受控状态"],
    ["风险类型","承重支模架","风险名称","主体结构模板支撑","风险等级","II级","计划开始日期","2026-03-31","计划完成日期","2026-11-15","实际开始日期","2026-04-15","风险描述","附属主体结构","挂牌领导","蔡群群","计划持续时间","229天","是否完成","否","是否受控","是","风险情况","风险可控","风险进展情况","按专项方案组织施工，验收记录齐全"]
  ];
  const milestones=Array.isArray(row.milestones)?row.milestones:[];
  const today=Array.isArray(row.today)&&row.today.length?row.today:[{area:row.workArea,subitem:"主体结构施工",position:"主体结构区",content:row.summary,progress:"按计划推进",imageName:"",reporter:row.uploader,remark:"现场材料、机具及安全防护检查正常"}];
  const tomorrow=Array.isArray(row.tomorrow)&&row.tomorrow.length?row.tomorrow:[{area:row.workArea,subitem:"主体结构施工",position:"主体结构区",content:"继续开展主体结构施工及现场安全巡查",progress:"计划继续推进",imageName:"",reporter:row.uploader,remark:"提前落实材料进场计划"}];
  return {
    temperature:`${22+variation}℃`,
    weather:variation===2?"小雨":"晴",
    weatherImpact:variation===2?"是":"否",
    personnel:[
      ["总包管理人员",String(20+variation)],
      ["分包管理人员",String(11+variation)],
      ["劳务人员",String(36+variation*3)]
    ],
    today,
    tomorrow,
    milestones,
    risks,
    photos:[{name:row.title,url:row.cover || "./src/assets/project-log-building.png"}],
    stop:variation===3?"因短时降雨暂停室外作业2小时，已完成复工安全检查。":"无停工情况。"
  };
}

function renderProjectLogReadonlyWorkTable(rows,showProgress=true){
  return `
    <table class="project-log-report-table project-log-readonly-work-table">
      <thead><tr><th>序号</th><th>施工工区</th><th>施工分项</th><th>施工部位</th><th>工作内容</th>${showProgress?"<th>工作进度</th>":""}<th>施工图片</th><th>记录人</th><th>备注</th></tr></thead>
      <tbody>${rows.map((item,index)=>`<tr><td>${index+1}</td><td>${item.area}</td><td>${item.subitem||"-"}</td><td>${item.position||"-"}</td><td>${item.content}</td>${showProgress?`<td>${item.progress}</td>`:""}<td>${renderProjectLogReadonlyWorkImages(item)}</td><td>${item.reporter||"-"}</td><td>${item.remark||"-"}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function renderProjectLogReadonlyMilestoneTable(rows){
  const ongoingRows=(rows||[]).filter(item=>!item.actualDate);
  const completedMap=new Map([
    ...getProjectLogCompletedMilestoneRows(),
    ...(rows||[]).filter(item=>item.actualDate)
  ].map(item=>[item.nodeName,item]));
  const completedRows=[...completedMap.values()];
  const cards=items=>items.length?`<div class="project-log-readonly-risk-list">
    ${items.map(item=>`
      <div class="project-log-readonly-risk-card project-detail-info-grid">
        ${renderProjectLogReadonlyField("里程碑节点名称",item.nodeName)}
        ${renderProjectLogReadonlyField("计划完成日期（最新）",item.planLatestDate)}
        ${renderProjectLogReadonlyField("节点状态",item.nodeStatus)}
        ${renderProjectLogReadonlyField("管控等级",item.controlLevel)}
        ${renderProjectLogReadonlyField("是否重点进度节点",item.keyNode)}
        ${item.actualDate?renderProjectLogReadonlyField("实际完成日期",item.actualDate):""}
        ${item.actualDate?"":renderProjectLogReadonlyField("里程碑情况",item.milestoneStatus||"-")}
        ${item.actualDate?"":renderProjectLogReadonlyField("里程碑进展情况",item.milestoneProgress||"-")}
      </div>
    `).join("")}
  </div>`:`<div class="project-log-empty project-log-milestone-empty">暂无数据</div>`;
  return `<div class="project-log-readonly-milestone">
    <div class="project-log-readonly-milestone-panel" data-readonly-milestone-panel="ongoing">${cards(ongoingRows)}</div>
    <div class="project-log-readonly-milestone-panel" data-readonly-milestone-panel="completed" hidden>${cards(completedRows)}</div>
  </div>`;
}

function renderProjectLogReadonlyWorkImages(item={}){
  const images=Array.isArray(item.images)&&item.images.length?item.images:(item.imageUrl?[{name:item.imageName||"施工图片",url:item.imageUrl}]:[]);
  if(!images.length)return "-";
  return `<div class="project-log-work-readonly-images">${images.slice(0,9).map(image=>`<button type="button" class="project-log-work-thumb-btn" onclick="openProjectLogWorkImagePreview('${escapeAttr(image.url)}','${escapeAttr(image.name||"施工图片")}')"><img class="project-log-work-thumb" src="${image.url}" alt="${escapeAttr(image.name||"施工图片")}"/></button>`).join("")}</div>`;
}

function renderProjectLogReadonlyMilestoneSection(rows){
  return `
    <section class="project-detail-section project-log-readonly-section project-log-readonly-milestone-section">
      <div class="project-detail-section-title project-log-report-section-title-row project-log-milestone-title-row">
        <h3>里程碑节点情况</h3>
        <div class="project-log-milestone-tabs">
          <button type="button" class="active" onclick="switchProjectLogReadonlyMilestoneTab(this,'ongoing')">进行中</button>
          <button type="button" onclick="switchProjectLogReadonlyMilestoneTab(this,'completed')">已完成</button>
        </div>
      </div>
      ${renderProjectLogReadonlyMilestoneTable(rows)}
    </section>
  `;
}

function switchProjectLogReadonlyMilestoneTab(button,tab){
  const section=button?.closest(".project-log-readonly-milestone-section");
  if(!section)return;
  section.querySelectorAll(".project-log-milestone-tabs button").forEach(item=>item.classList.toggle("active",item===button));
  section.querySelectorAll("[data-readonly-milestone-panel]").forEach(panel=>{
    panel.hidden=panel.dataset.readonlyMilestonePanel!==tab;
  });
}

function renderProjectLogReadonlyRiskCards(risks){
  return `<div class="project-log-readonly-risk-list">
    ${risks.map(risk=>`
      <div class="project-log-readonly-risk-card project-detail-info-grid">
        ${Array.from({length:risk.length/2},(_,index)=>renderProjectLogReadonlyField(risk[index*2],risk[index*2+1])).join("")}
      </div>
    `).join("")}
  </div>`;
}

function renderProjectLogReadonlyPhotos(photos){
  return `<div class="project-log-photo-preview project-log-readonly-photo-list">
    ${photos.map(photo=>`<div class="project-log-photo-item"><img src="${photo.url}" alt="${escapeAttr(photo.name)}"/></div>`).join("")}
  </div>`;
}

function getProjectLogReadonlyFiles(row){
  if(Array.isArray(row.files)&&row.files.length)return row.files.map(file=>({name:file.name||"施工日志文件",sizeText:file.sizeText||formatProjectLogFileSize(Number(file.size))}));
  return [{name:row.fileName||"施工日志文件.pdf",sizeText:row.fileSize||"-"}];
}

function renderProjectLogReadonlyFiles(files){
  return `<div class="project-log-file-preview project-log-readonly-file-list">
    ${files.map(file=>`
      <div class="project-log-file-upload-item">
        <div class="project-log-file-icon">▤</div>
        <button type="button" class="project-log-file-preview-trigger" onclick="showToast('打开预览文件')"><strong>${escapeAttr(file.name)}</strong><span>${file.sizeText||"-"}</span></button>
      </div>
    `).join("")}
  </div>`;
}

function renderProjectLogReadonlyFileUploadSection(row){
  if(!row)return "";
  if(Array.isArray(row.fileEntries)&&row.fileEntries.length){
    return renderProjectLogReadonlySection("文件上传",`
      ${row.fileEntries.map((entry,index)=>`
        <div class="project-log-readonly-file-entry">
          <div class="project-detail-info-grid">
            ${renderProjectLogReadonlyField("施工工区",entry.area||row.workArea)}
            ${renderProjectLogReadonlyField("记录人",entry.reporter||row.uploader||"-")}
          </div>
          <div class="project-log-readonly-subtitle">当日施工情况描述</div>
          <div class="project-log-readonly-text">${entry.remark||entry.summary||"-"}</div>
          <div class="project-log-readonly-subtitle">施工相关附件</div>
          ${renderProjectLogReadonlyFiles(getProjectLogReadonlyFiles(entry))}
        </div>
      `).join("")}
    `);
  }
  return renderProjectLogReadonlySection("文件上传",`
    <div class="project-detail-info-grid">
      ${renderProjectLogReadonlyField("施工工区",row.workArea)}
      ${renderProjectLogReadonlyField("记录人",row.uploader||"-")}
    </div>
    <div class="project-log-readonly-subtitle">当日施工情况描述</div>
    <div class="project-log-readonly-text">${row.summary||"-"}</div>
    <div class="project-log-readonly-subtitle">施工相关附件</div>
    ${renderProjectLogReadonlyFiles(getProjectLogReadonlyFiles(row))}
  `);
}

function getProjectLogReadonlyFileRecorder(row){
  const names=(Array.isArray(row?.fileEntries)?row.fileEntries:[])
    .flatMap(entry=>String(entry?.reporter||"").split(/[、,，]/))
    .map(name=>name.trim())
    .filter(Boolean);
  return [...new Set(names)].join("、")||row?.uploader||"-";
}

function renderProjectLogReadonlyBaseInfo(row,projectName){
  if(row.mode==="file")return `
    <div class="project-detail-info-grid">
      ${renderProjectLogReadonlyField("施工工区",row.workArea)}
      ${renderProjectLogReadonlyField("日期",row.date)}
      ${renderProjectLogReadonlyField("记录人",getProjectLogReadonlyFileRecorder(row))}
    </div>
  `;
  const detail=getProjectLogReadonlyOnlineDetail(row);
  return `
    <div class="project-detail-info-grid">
      ${renderProjectLogReadonlyField("项目名称",projectName)}
      ${renderProjectLogReadonlyField("施工工区",row.workArea)}
      ${renderProjectLogReadonlyField("日期",row.date)}
      ${renderProjectLogReadonlyField("星期",getProjectLogReadonlyWeekday(row.date))}
      ${renderProjectLogReadonlyField("温度",detail.temperature)}
      ${renderProjectLogReadonlyField("天气是否影响工作",detail.weatherImpact)}
      ${renderProjectLogReadonlyField("记录人",row.uploader)}
      ${renderProjectLogReadonlyField("上报时间",row.uploadTime)}
    </div>
  `;
}

function openProjectLogDetail(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  const onlineRow=row.onlineRecord||((row.mode==="online"||row.mode==="merged")?row:null);
  const fileRow=row.fileRecord||(row.mode==="file"?row:null);
  const baseInfo=renderProjectLogReadonlyBaseInfo(onlineRow||fileRow||row,pcPortalState.currentProject);
  const content=onlineRow?(()=>{
    const detail=getProjectLogReadonlyOnlineDetail(onlineRow);
    const todayTitle=renderProjectLogWorkSectionTitle("今日主要工作",onlineRow.date);
    const tomorrowTitle=renderProjectLogWorkSectionTitle("明日主要工作",getProjectLogNextDateValue(onlineRow.date));
    return `
      ${renderProjectLogReadonlySection("基础信息",baseInfo)}
      ${renderProjectLogReadonlySection("人员信息",`<div class="project-detail-info-grid">${detail.personnel.map(item=>renderProjectLogReadonlyField(item[0],`${item[1]}人`)).join("")}</div>`)}
      ${renderProjectLogReadonlySection(todayTitle,renderProjectLogReadonlyWorkTable(detail.today))}
      ${renderProjectLogReadonlySection(tomorrowTitle,renderProjectLogReadonlyWorkTable(detail.tomorrow,false))}
      ${renderProjectLogReadonlyMilestoneSection(detail.milestones)}
      ${renderProjectLogReadonlySection("风险情况",renderProjectLogReadonlyRiskCards(detail.risks))}
      ${renderProjectLogReadonlySection("发生停工情况",`<div class="project-log-readonly-text">${detail.stop}</div>`)}
      ${fileRow?renderProjectLogReadonlyFileUploadSection(fileRow):""}
    `;
  })():(()=>{
    const detail=getProjectLogReadonlyOnlineDetail(row);
    return `
      ${renderProjectLogReadonlySection("基础信息",baseInfo)}
      ${Array.isArray(row.fileEntries)&&row.fileEntries.length?renderProjectLogReadonlyFileUploadSection(row):`
        ${renderProjectLogReadonlySection("施工日志文件",renderProjectLogReadonlyFiles(getProjectLogReadonlyFiles(row)))}
        ${renderProjectLogReadonlySection("备注说明",`<div class="project-log-readonly-text">${row.summary||"-"}</div>`)}
      `}
      ${renderProjectLogReadonlyMilestoneSection(detail.milestones)}
      ${renderProjectLogReadonlySection("风险情况",renderProjectLogReadonlyRiskCards(detail.risks))}
    `;
  })();
  openModal("施工日志详情",`<div class="project-log-readonly-detail">${content}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("project-log-online-report-modal");
}

async function exportProjectLog(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  try{
    const result=await exportConstructionLogRecords([row],{
      projectName:row.projectName||pcPortalState.currentProject,
      detailBuilder:getProjectLogReadonlyOnlineDetail,
      completedMilestones:typeof getProjectLogCompletedMilestoneRows==="function"?getProjectLogCompletedMilestoneRows():[]
    });
    showToast(result.type==="day-zip"?"当日施工日志压缩包导出成功":"施工日志导出成功");
  }catch(error){
    console.error("施工日志导出失败",error);
    showToast("施工日志导出失败，请稍后重试");
  }
}

function editProjectLog(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  projectLogEditingRow={...row,projectName:row.projectName||pcPortalState.currentProject};
  if(row.mode==="file")openProjectLogFileReportModal(row);
  else openProjectLogReportModal(row);
}

function deleteProjectLog(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  openModal("删除施工日志",`<div class="project-log-delete-confirm"><strong>是否删除该施工日志？</strong><p>删除后，企业端及施工日历中的相关统计将同步刷新。</p></div>`,`
    <button class="btn" onclick="closeModal()">否</button>
    <button class="btn danger" onclick="confirmDeleteProjectLog('${escapeAttr(id)}')">是</button>
  `);
}

function confirmDeleteProjectLog(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  const key=getProjectLogRecordKey({...row,projectName:row.projectName||pcPortalState.currentProject});
  projectLogDeletedKeys.add(key);
  for(let index=projectLogCustomRows.length-1;index>=0;index--){
    if(getProjectLogRecordKey(projectLogCustomRows[index])===key)projectLogCustomRows.splice(index,1);
  }
  if(projectLogState.selectedDate===row.date)projectLogState.selectedDate="";
  closeModal();
  renderProjectLogPage();
  showToast("施工日志删除成功");
}

function renderProjectLogWorkAreaOptions(value=""){
  const areas=[...new Set(getProjectLogRows().flatMap(row=>getProjectLogRowAreas(row)))];
  if(value&&!areas.includes(value))areas.unshift(value);
  ["主体结构区","附属结构区","基坑施工区","材料加工区"].forEach(area=>{
    if(!areas.includes(area))areas.push(area);
  });
  return `<option value="">请选择施工工区</option>${areas.map(area=>`<option value="${escapeAttr(area)}" ${area===value?"selected":""}>${area}</option>`).join("")}`;
}

function renderProjectLogWorkTable(type="today",defaultRows=null){
  const isToday=type==="today";
  const rows=Array.isArray(defaultRows)?defaultRows:(isToday?[{
    area:"主体结构区",
    subitem:"主体结构施工",
    position:"主体结构区",
    content:"完成钢筋绑扎、模板加固及现场安全巡查",
    progress:"按计划推进",
    imageName:"",
    reporter:getProjectLogWorkReporterByArea("主体结构区"),
    remark:"现场材料已完成验收"
  }]:[]);
  const columnCount=isToday?10:9;
  const emptyRow=`
    <tr class="project-log-report-empty-row"><td colspan="${columnCount}">暂无数据</td></tr>
  `;
  return `
    <div class="project-log-report-table-head">
      <span>工作内容${isToday?'<em>*</em>':""}</span>
      <button class="btn primary small" onclick="addProjectLogWorkRow('${type}')">添加</button>
    </div>
    <div class="project-log-work-table-wrap">
      <table class="project-log-report-table project-log-work-table">
        <thead>
          <tr><th>序号</th><th>施工工区</th><th>施工分项</th><th>施工部位</th><th>工作内容</th>${isToday?"<th>工作进度</th>":""}<th>施工图片</th><th>记录人</th><th>备注</th><th>操作</th></tr>
        </thead>
        <tbody id="projectLogWorkTbody-${type}">
          ${rows.length?rows.map((row,index)=>renderProjectLogWorkRow(type,row,index)).join(""):emptyRow}
        </tbody>
      </table>
    </div>
  `;
}

function getProjectLogWorkReporterByArea(area,fallback=""){
  const managers=getProjectLogReporterPersonnel();
  const fallbackNames=String(fallback||"").split(/[、,，]/).map(name=>name.trim()).filter(Boolean);
  const match=fallbackNames.find(name=>managers.some(item=>item.name===name));
  return match||managers[0]?.name||document.getElementById("projectLogReportRecorder")?.value||"楼力栋";
}

function renderProjectLogReporterOptions(value=""){
  const managers=getProjectLogReporterPersonnel();
  const selectedValue=managers.some(item=>item.name===value)?value:managers[0]?.name||"";
  return `<option value="">请选择记录人</option>${managers.map(item=>`<option value="${escapeAttr(item.name)}" ${item.name===selectedValue?"selected":""}>${escapeAttr(item.name)}（${escapeAttr(item.job||"管理人员")}）</option>`).join("")}`;
}

function renderProjectLogWorkImageUpload(row={}){
  const images=Array.isArray(row.images)&&row.images.length
    ?row.images.slice(0,9)
    :(row.imageUrl?[{name:row.imageName||"施工图片",url:row.imageUrl}]:[]);
  return `
    <div class="project-log-work-image-upload">
      <input type="file" accept="image/*" multiple hidden onchange="handleProjectLogWorkImageFiles(this)"/>
      <div class="project-log-work-image-grid">
        ${images.map((image,index)=>renderProjectLogWorkImageItem(image,index)).join("")}
        ${images.length<9?renderProjectLogWorkImageAdd():""}
      </div>
    </div>
  `;
}

function renderProjectLogWorkImageItem(image,index){
  const name=image?.name||"施工图片";
  const url=image?.url||"";
  return `<div class="project-log-work-image-item" data-image-name="${escapeAttr(name)}" data-image-url="${escapeAttr(url)}">
    <button type="button" class="project-log-work-image-view" onclick="openProjectLogWorkImagePreview('${escapeAttr(url)}','${escapeAttr(name)}')"><img src="${url}" alt="${escapeAttr(name)}"/></button>
    <button type="button" class="project-log-work-image-remove" title="删除图片" aria-label="删除图片" onclick="removeProjectLogWorkImage(this)">×</button>
  </div>`;
}

function renderProjectLogWorkImageAdd(){
  return `<button type="button" class="project-log-work-image-add" onclick="this.closest('.project-log-work-image-upload')?.querySelector('input[type=file]')?.click()"><span>＋</span><em>上传图片</em></button>`;
}

function renderProjectLogWorkRow(type,row={},index=0){
  const isToday=type==="today";
  const reporter=getProjectLogWorkReporterByArea(row.area||"",row.reporter||"");
  return `
    <tr class="project-log-report-work-row" data-project-log-work-type="${type}">
      <td class="project-log-work-index">${index+1}</td>
      <td><input class="input project-log-work-area" list="projectLogWorkAreaList-${type}-${index}" value="${escapeAttr(row.area||"")}" placeholder="请选择或输入施工工区" oninput="syncProjectLogOnlineWorkAreas()" onchange="syncProjectLogWorkReporter(this)"/><datalist id="projectLogWorkAreaList-${type}-${index}">${renderProjectLogWorkAreaOptions(row.area||"").replace('<option value="">请选择施工工区</option>',"")}</datalist></td>
      <td><input class="input project-log-work-subitem" value="${escapeAttr(row.subitem || "")}" placeholder="请输入施工分项"/></td>
      <td><input class="input project-log-work-position" value="${escapeAttr(row.position || "")}" placeholder="请输入施工部位"/></td>
      <td><input class="input project-log-work-content" value="${escapeAttr(row.content || "")}" placeholder="请输入工作内容"/></td>
      ${isToday?`<td><input class="input project-log-work-progress" value="${escapeAttr(row.progress || "")}" placeholder="请输入工作进度"/></td>`:""}
      <td>${renderProjectLogWorkImageUpload(row)}</td>
      <td><select class="select project-log-work-reporter" onchange="syncProjectLogRecorderFromWorkRows()">${renderProjectLogReporterOptions(reporter)}</select></td>
      <td><input class="input project-log-work-remark" value="${escapeAttr(row.remark || "")}" placeholder="请输入备注"/></td>
      <td><button class="btn danger small" onclick="removeProjectLogWorkRow(this)">删除</button></td>
    </tr>
  `;
}

function syncProjectLogWorkReporter(select){
  const row=select?.closest(".project-log-report-work-row");
  syncProjectLogOnlineWorkAreas();
  syncProjectLogRecorderFromWorkRows();
}

function getProjectLogAreaSummary(values){
  return [...new Set((values||[]).map(value=>String(value||"").trim()).filter(Boolean))].join("、");
}

function syncProjectLogOnlineWorkAreas(){
  const areaInput=document.getElementById("projectLogReportArea");
  if(!areaInput)return "";
  const areas=[...document.querySelectorAll('#projectLogWorkTbody-today .project-log-work-area')].map(input=>input.value);
  const summary=getProjectLogAreaSummary(areas);
  areaInput.value=summary;
  return summary;
}

function refreshProjectLogWorkReporters(){
  document.querySelectorAll(".project-log-report-work-row").forEach(row=>{
    const reporter=row.querySelector(".project-log-work-reporter");
    if(reporter&&!reporter.value)reporter.value=getProjectLogWorkReporterByArea("");
  });
  syncProjectLogOnlineWorkAreas();
  syncProjectLogRecorderFromWorkRows();
}

function getProjectLogWorkImages(upload){
  return [...(upload?.querySelectorAll(".project-log-work-image-item")||[])].map(item=>({
    name:item.dataset.imageName||"施工图片",
    url:item.dataset.imageUrl||""
  })).filter(item=>item.url);
}

function refreshProjectLogWorkImageGrid(upload,images){
  const grid=upload?.querySelector(".project-log-work-image-grid");
  if(!grid)return;
  const list=(images||[]).slice(0,9);
  grid.innerHTML=`${list.map((image,index)=>renderProjectLogWorkImageItem(image,index)).join("")}${list.length<9?renderProjectLogWorkImageAdd():""}`;
}

function handleProjectLogWorkImageFiles(input){
  const upload=input.closest(".project-log-work-image-upload");
  if(!upload)return;
  const current=getProjectLogWorkImages(upload);
  const incoming=[...(input.files||[])].filter(file=>file.type.startsWith("image/"));
  const available=Math.max(0,9-current.length);
  incoming.slice(0,available).forEach(file=>{
    const reader=new FileReader();
    reader.onload=event=>{
      current.push({name:file.name,url:event.target.result});
      refreshProjectLogWorkImageGrid(upload,current);
    };
    reader.readAsDataURL(file);
  });
  if(incoming.length>available)showToast("施工图片最多上传9张");
  input.value="";
}

function removeProjectLogWorkImage(button){
  const upload=button?.closest(".project-log-work-image-upload");
  const item=button?.closest(".project-log-work-image-item");
  if(!upload||!item)return;
  item.remove();
  refreshProjectLogWorkImageGrid(upload,getProjectLogWorkImages(upload));
}

function openProjectLogWorkImagePreview(url,name="施工图片"){
  if(!url)return;
  openNestedModal("施工图片预览",`<div class="project-log-work-image-viewer"><img src="${url}" alt="${escapeAttr(name)}"/></div>`,`<button class="btn" type="button" onclick="closeNestedModal(this)">关闭</button>`);
  document.querySelector(".nested-modal-mask:last-of-type .nested-modal")?.classList.add("project-log-work-image-modal");
}

function collectProjectLogWorkRows(type){
  const rows=[...document.querySelectorAll(`#projectLogWorkTbody-${type} .project-log-report-work-row`)];
  return rows.map(row=>{
    const images=getProjectLogWorkImages(row.querySelector(".project-log-work-image-upload"));
    return {
      area:row.querySelector(".project-log-work-area")?.value||"",
      subitem:row.querySelector(".project-log-work-subitem")?.value.trim()||"",
      position:row.querySelector(".project-log-work-position")?.value.trim()||"",
      content:row.querySelector(".project-log-work-content")?.value.trim()||"",
      progress:row.querySelector(".project-log-work-progress")?.value||"",
      images,
      imageName:images[0]?.name||"",
      imageUrl:images[0]?.url||"",
      reporter:row.querySelector(".project-log-work-reporter")?.value||"",
      remark:row.querySelector(".project-log-work-remark")?.value.trim()||""
    };
  }).filter(row=>row.area||row.subitem||row.position||row.content||row.progress||row.images.length||row.remark);
}

function getProjectLogDueMilestoneRows(reportDate=getProjectLogTodayValue()){
  const date=reportDate||getProjectLogTodayValue();
  return projectMilestoneNodeRows
    .filter(row=>row.planLatestDate&&row.planLatestDate<=date&&!row.actualDate)
    .sort((a,b)=>a.planLatestDate.localeCompare(b.planLatestDate));
}

function getProjectLogCompletedMilestoneRows(){
  return projectMilestoneNodeRows
    .filter(row=>row.actualDate)
    .sort((a,b)=>String(b.actualDate).localeCompare(String(a.actualDate)));
}

function renderProjectLogMilestoneSectionHeader(){
  return `<div class="project-log-report-section-title-row project-log-milestone-title-row"><h3>里程碑节点情况</h3><div class="project-log-milestone-tabs"><button type="button" class="${projectLogMilestoneTab==="ongoing"?"active":""}" onclick="switchProjectLogMilestoneTab('ongoing')">进行中</button><button type="button" class="${projectLogMilestoneTab==="completed"?"active":""}" onclick="switchProjectLogMilestoneTab('completed')">已完成</button></div></div>`;
}

function renderProjectLogMilestoneRows(savedRows=[],reportDate=getProjectLogTodayValue()){
  if(projectLogMilestoneTab==="completed"){
    const completedRows=getProjectLogCompletedMilestoneRows();
    if(!completedRows.length)return `<div class="project-log-empty project-log-milestone-empty">暂无已完成里程碑节点</div>`;
    return `<div class="project-log-milestone-card-list">${completedRows.map(row=>`
      <div class="project-log-milestone-row completed" data-milestone-mode="completed">
        <div class="project-log-risk-info project-log-milestone-info">
          <div><span>里程碑节点名称</span><strong>${row.nodeName}</strong></div>
          <div><span>计划完成日期（最新）</span><strong>${row.planLatestDate}</strong></div>
          <div><span>节点状态</span><strong>${row.nodeStatus}</strong></div>
          <div><span>管控等级</span><strong>${row.controlLevel}</strong></div>
          <div><span>是否重点进度节点</span><strong>${row.keyNode}</strong></div>
          <div><span>实际完成日期</span><strong>${row.actualDate}</strong></div>
        </div>
      </div>`).join("")}</div>`;
  }
  const savedMap=new Map((savedRows||[]).map(row=>[row.nodeName,row]));
  const dueRows=getProjectLogDueMilestoneRows(reportDate);
  const rows=dueRows.length?dueRows:(savedRows||[]);
  if(!rows.length)return `<div class="project-log-empty project-log-milestone-empty">暂无到期未完成里程碑节点</div>`;
  return `<div class="project-log-milestone-card-list">
    ${rows.map(row=>{
      const saved=savedMap.get(row.nodeName)||{};
      const status=saved.milestoneStatus||"进度可控";
      return `
        <div class="project-log-milestone-row" data-milestone-mode="ongoing"
          data-node-name="${escapeAttr(row.nodeName)}"
          data-plan-latest-date="${escapeAttr(row.planLatestDate)}"
          data-node-status="${escapeAttr(row.nodeStatus)}"
          data-control-level="${escapeAttr(row.controlLevel)}"
          data-key-node="${escapeAttr(row.keyNode)}">
          <div class="project-log-risk-info project-log-milestone-info">
            <div><span>里程碑节点名称</span><strong>${row.nodeName}</strong></div>
            <div><span>计划完成日期（最新）</span><strong>${row.planLatestDate}</strong></div>
            <div><span>节点状态</span><strong>${row.nodeStatus}</strong></div>
            <div><span>管控等级</span><strong>${row.controlLevel}</strong></div>
            <div><span>是否重点进度节点</span><strong>${row.keyNode}</strong></div>
          </div>
          <div class="project-log-risk-form project-log-milestone-form">
            <div class="form-item"><label>里程碑情况 <em>*</em></label><select class="select project-log-milestone-status"><option value="">请选择</option><option ${status==="进度可控"?"selected":""}>进度可控</option><option ${status==="进度预警"?"selected":""}>进度预警</option></select></div>
            <div class="form-item"><label>里程碑进展情况 <em>*</em></label><textarea class="input project-log-milestone-progress" placeholder="请输入">${escapeAttr(saved.milestoneProgress||"")}</textarea></div>
          </div>
        </div>
      `;
    }).join("")}
  </div>`;
}

function refreshProjectLogMilestoneRows(savedRows=[]){
  const box=document.getElementById("projectLogMilestoneRows");
  if(!box)return;
  const date=document.getElementById("projectLogReportDate")?.value||document.getElementById("projectLogFileReportDate")?.value||getProjectLogTodayValue();
  box.innerHTML=renderProjectLogMilestoneRows(savedRows,date);
}

function switchProjectLogMilestoneTab(tab){
  if(tab!=="ongoing"&&tab!=="completed")return;
  if(projectLogMilestoneTab==="ongoing"){
    const draft=collectProjectLogMilestoneRows(false);
    if(Array.isArray(draft))projectLogMilestoneDraftRows=draft;
  }
  projectLogMilestoneTab=tab;
  const date=document.getElementById("projectLogReportDate")?.value||document.getElementById("projectLogFileReportDate")?.value||getProjectLogTodayValue();
  const box=document.getElementById("projectLogMilestoneRows");
  if(box)box.innerHTML=renderProjectLogMilestoneRows(projectLogMilestoneDraftRows,date);
  const titleRow=box?.closest(".project-log-report-section")?.querySelector(".project-log-milestone-title-row");
  if(titleRow)titleRow.outerHTML=renderProjectLogMilestoneSectionHeader();
}

function collectProjectLogMilestoneRows(validate=true){
  const rows=[...document.querySelectorAll('.project-log-milestone-row[data-milestone-mode="ongoing"]')];
  if(!rows.length&&projectLogMilestoneTab==="completed"){
    if(validate){switchProjectLogMilestoneTab("ongoing");showToast("请先完善进行中的里程碑节点情况");return null;}
    return projectLogMilestoneDraftRows;
  }
  const reports=[];
  for(const row of rows){
    const milestoneStatus=row.querySelector(".project-log-milestone-status")?.value||"";
    const milestoneProgress=row.querySelector(".project-log-milestone-progress")?.value.trim()||"";
    if(validate&&!milestoneStatus){
      showToast("请选择里程碑情况");
      row.querySelector(".project-log-milestone-status")?.focus();
      return null;
    }
    if(validate&&!milestoneProgress){
      showToast("请输入里程碑进展情况");
      row.querySelector(".project-log-milestone-progress")?.focus();
      return null;
    }
    reports.push({
      nodeName:row.dataset.nodeName||"",
      planLatestDate:row.dataset.planLatestDate||"",
      nodeStatus:row.dataset.nodeStatus||"",
      controlLevel:row.dataset.controlLevel||"",
      keyNode:row.dataset.keyNode||"",
      milestoneStatus,
      milestoneProgress
    });
  }
  return reports;
}

function refreshProjectLogWorkIndexes(type){
  const tbody=document.getElementById(`projectLogWorkTbody-${type}`);
  if(!tbody)return;
  const rows=[...tbody.querySelectorAll(".project-log-report-work-row")];
  rows.forEach((row,index)=>{
    const cell=row.querySelector(".project-log-work-index");
    if(cell)cell.textContent=String(index+1);
  });
  if(!rows.length){
    tbody.innerHTML=`<tr class="project-log-report-empty-row"><td colspan="${type==="today"?10:9}">暂无数据</td></tr>`;
  }
}

function addProjectLogWorkRow(type){
  const tbody=document.getElementById(`projectLogWorkTbody-${type}`);
  if(!tbody)return;
  tbody.querySelector(".project-log-report-empty-row")?.remove();
  const index=tbody.querySelectorAll(".project-log-report-work-row").length;
  tbody.insertAdjacentHTML("beforeend",renderProjectLogWorkRow(type,{area:"",subitem:"",position:"",content:"",progress:"",imageName:"",reporter:"",remark:""},index));
  if(type==="today")syncProjectLogOnlineWorkAreas();
}

function removeProjectLogWorkRow(btn){
  const row=btn?.closest(".project-log-report-work-row");
  const type=row?.dataset.projectLogWorkType;
  row?.remove();
  refreshProjectLogWorkIndexes(type);
  if(type==="today")syncProjectLogOnlineWorkAreas();
}

function getProjectLogRiskFieldValue(risk,label){
  if(!Array.isArray(risk))return "";
  const index=risk.findIndex(item=>item===label);
  return index>=0?risk[index+1]||"":"";
}

function getProjectLogRiskBaseRows(){
  return [
    ["风险类型","深基坑开挖","风险名称","深基坑开挖","风险等级","II级","计划开始日期","2026-01-01","计划完成日期","2026-09-16","实际开始日期","2026-03-26","风险描述","附属土方开挖","挂牌领导","蔡群群","计划持续时间","258天"],
    ["风险类型","承重支模架","风险名称","承重支模架","风险等级","II级","计划开始日期","2026-03-31","计划完成日期","2026-11-15","实际开始日期","2026-04-15","风险描述","附属主体结构","挂牌领导","蔡群群","计划持续时间","229天"]
  ];
}

function renderProjectLogRiskSituationSelect(value=""){
  const options=["风险可控","风险预警"];
  return `<select class="select project-log-risk-situation"><option value="">请选择</option>${options.map(option=>`<option ${option===value?"selected":""}>${option}</option>`).join("")}</select>`;
}

function renderProjectLogRiskRows(savedRisks=[]){
  const risks=getProjectLogRiskBaseRows();
  return risks.map((risk,index)=>{
    const savedRisk=savedRisks[index];
    const completeValue=getProjectLogRiskFieldValue(savedRisk,"是否完成")||"否";
    const controlledValue=getProjectLogRiskFieldValue(savedRisk,"是否受控")||"是";
    const situationValue=getProjectLogRiskFieldValue(savedRisk,"风险情况")||"风险可控";
    const progressValue=getProjectLogRiskFieldValue(savedRisk,"风险进展情况");
    return `
    <div class="project-log-risk-row" data-project-log-risk-index="${index}">
      <div class="project-log-risk-info">
        ${Array.from({length:Math.ceil(risk.length/2)},(_,i)=>`
          <div><span>${risk[i*2]}</span><strong>${risk[i*2+1]}</strong></div>
        `).join("")}
      </div>
      <div class="project-log-risk-form">
        <div class="form-item"><label>是否完成 <em>*</em></label><select class="select"><option ${completeValue==="否"?"selected":""}>否</option><option ${completeValue==="是"?"selected":""}>是</option></select></div>
        <div class="form-item"><label>是否受控 <em>*</em></label><select class="select"><option ${controlledValue==="是"?"selected":""}>是</option><option ${controlledValue==="否"?"selected":""}>否</option></select></div>
        <div class="form-item"><label>风险情况 <em>*</em></label>${renderProjectLogRiskSituationSelect(situationValue)}</div>
        <div class="form-item"><label>风险进展情况 <em>*</em></label><textarea class="input project-log-risk-progress" placeholder="请输入" required>${escapeAttr(progressValue)}</textarea></div>
      </div>
    </div>
  `;
  }).join("");
}

function collectProjectLogRiskRows(){
  const baseRows=getProjectLogRiskBaseRows();
  const rows=[...document.querySelectorAll(".project-log-risk-row")];
  const reports=[];
  for(const row of rows){
    const index=Number(row.dataset.projectLogRiskIndex)||0;
    const situation=row.querySelector(".project-log-risk-situation")?.value||"";
    const progress=row.querySelector(".project-log-risk-progress")?.value.trim()||"";
    if(!situation){
      showToast("请选择风险情况");
      row.querySelector(".project-log-risk-situation")?.focus();
      return null;
    }
    if(!progress){
      showToast("请输入风险进展情况");
      row.querySelector(".project-log-risk-progress")?.focus();
      return null;
    }
    reports.push([...baseRows[index],"是否完成",row.querySelector("select")?.value||"否","是否受控",row.querySelectorAll("select")[1]?.value||"是","风险情况",situation,"风险进展情况",progress]);
  }
  return reports;
}

function getProjectLogAssignmentPeople(assignment){
  if(!assignment)return [];
  if(Array.isArray(assignment.people)&&assignment.people.length)return assignment.people;
  if(assignment.personName)return [{
    id:assignment.personId||"",
    name:assignment.personName,
    job:assignment.personJob||"管理人员",
    phone:assignment.personPhone||""
  }];
  return [];
}

function getProjectLogAssignmentNames(assignment){
  return getProjectLogAssignmentPeople(assignment).map(item=>item.name).filter(Boolean);
}

function getProjectLogRecorderValue(defaultName="楼力栋"){
  const workNames=[...document.querySelectorAll(".project-log-work-reporter")]
    .flatMap(input=>String(input.value||"").split(/[、,，]/))
    .map(name=>name.trim())
    .filter(Boolean);
  const names=[...new Set(workNames)];
  return names.length?names.join("、"):defaultName;
}

function syncProjectLogRecorderFromWorkRows(){
  const recorder=document.getElementById("projectLogReportRecorder");
  if(recorder)recorder.value=getProjectLogRecorderValue(recorder.value||"楼力栋");
}

function getProjectLogFileRecorderValue(defaultName="楼力栋"){
  const fileNames=[...document.querySelectorAll(".project-log-file-row-reporter")]
    .flatMap(input=>String(input.value||"").split(/[、,，]/))
    .map(name=>name.trim())
    .filter(Boolean);
  const names=[...new Set(fileNames)];
  return names.length?names.join("、"):defaultName;
}

function syncProjectLogFileRecorderFromRows(){
  const recorder=document.getElementById("projectLogFileReportRecorder");
  if(recorder)recorder.value=getProjectLogFileRecorderValue(recorder.value||"楼力栋");
}

function renderProjectLogRecorderReadonly(id,selectedName="楼力栋"){
  return `<input class="input project-log-recorder-readonly" id="${id}" value="${escapeAttr(selectedName)}" readonly/>`;
}

function getProjectLogReporterPersonnel(){
  const currentProject=pcPortalState.currentProject;
  const managerRows=(Array.isArray(workers)?workers:[])
    .filter(worker=>worker.type==="管理人员"&&worker.status!=="已退场")
    .map(worker=>({
      id:`worker-${worker.id}`,
      name:worker.name,
      job:worker.job||"管理人员",
      phone:worker.phone||"",
      project:worker.project||"",
      source:"实名制"
    }));
  const currentProjectRows=managerRows.filter(worker=>worker.project===currentProject);
  const rows=currentProjectRows.length?currentProjectRows:managerRows;
  if(rows.length)return rows;
  return [
    {id:"fallback-safety",name:"陈安全",job:"安全员",phone:"138****6608",project:currentProject,source:"项目管理人员"},
    {id:"fallback-production",name:"赵经理",job:"生产经理",phone:"136****8812",project:currentProject,source:"项目管理人员"},
    {id:"fallback-quality",name:"刘质量",job:"质量员",phone:"139****6021",project:currentProject,source:"项目管理人员"}
  ];
}

function getProjectLogSubitemOptions(){
  return ["主体结构施工","附属结构施工","深基坑开挖","承重支模架","钢筋模板工程","机电安装工程","现场安全巡查"];
}

function getProjectLogManagementPersonnel(){
  const currentProject=pcPortalState.currentProject;
  const project=getCurrentProjectContext();
  const assignerName=project?.projectManager||"赵菁";
  const canBeAssigned=worker=>worker.name!==assignerName&&worker.job!=="项目经理";
  const managerRows=(Array.isArray(workers)?workers:[])
    .filter(worker=>worker.type==="管理人员"&&worker.status!=="已退场"&&canBeAssigned(worker))
    .map(worker=>({
      id:`worker-${worker.id}`,
      name:worker.name,
      job:worker.job||"管理人员",
      phone:worker.phone||"",
      project:worker.project||"",
      source:"实名制"
    }));
  const currentProjectRows=managerRows.filter(worker=>worker.project===currentProject);
  const rows=currentProjectRows.length?currentProjectRows:managerRows;
  if(rows.length)return rows;
  return [
    {id:"fallback-safety",name:"陈安全",job:"安全员",phone:"138****6608",project:currentProject,source:"项目管理人员"},
    {id:"fallback-production",name:"赵经理",job:"生产经理",phone:"136****8812",project:currentProject,source:"项目管理人员"},
    {id:"fallback-quality",name:"刘质量",job:"质量员",phone:"139****6021",project:currentProject,source:"项目管理人员"}
  ];
}

function renderProjectLogAssignmentToolbar(){
  const peopleText=getProjectLogAssignmentNames(projectLogCurrentAssignment).join("、");
  const text=projectLogCurrentAssignment?`已分配：${projectLogCurrentAssignment.area} / ${projectLogCurrentAssignment.subitem} / ${peopleText}`:"未分配填报人员";
  return `
    <div class="project-log-report-toolbar">
      <span id="projectLogAssignmentInfo">${text}</span>
      <button class="btn primary" type="button" onclick="openProjectLogAssignmentModal()">分配</button>
    </div>
  `;
}

function openProjectLogAssignmentModal(){
  const currentArea=document.getElementById("projectLogReportArea")?.value||projectLogCurrentAssignment?.area||"主体结构区";
  const currentSubitem=projectLogCurrentAssignment?.subitem||"主体结构施工";
  const currentPersonIds=getProjectLogAssignmentPeople(projectLogCurrentAssignment).map(item=>item.id);
  const managers=getProjectLogManagementPersonnel();
  const body=`
    <div class="project-log-assignment-form">
      <div class="form-item">
        <label>施工工区 <em>*</em></label>
        <select class="select" id="projectLogAssignArea">${renderProjectLogWorkAreaOptions(currentArea)}</select>
      </div>
      <div class="form-item">
        <label>分部分项 <em>*</em></label>
        <select class="select" id="projectLogAssignSubitem">
          <option value="">请选择分部分项</option>
          ${getProjectLogSubitemOptions().map(item=>`<option value="${escapeAttr(item)}" ${item===currentSubitem?"selected":""}>${item}</option>`).join("")}
        </select>
      </div>
      <div class="form-item">
        <label>分配人员 <em>*</em></label>
        <div class="project-log-assignment-source" id="projectLogAssignPeople">
          ${managers.map(item=>`
            <label class="project-log-assignment-person">
              <input type="checkbox" value="${escapeAttr(item.id)}" ${currentPersonIds.includes(item.id)?"checked":""}/>
              <span><strong>${escapeAttr(item.name)}</strong><em>${escapeAttr(item.job)} · ${escapeAttr(item.project||pcPortalState.currentProject)} · ${escapeAttr(item.source)}</em></span>
            </label>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  openNestedModal("分配施工日志填报",body,`<button class="btn" type="button" onclick="closeNestedModal(this)">取消</button><button class="btn primary" type="button" onclick="confirmProjectLogAssignment(this)">确定</button>`);
  document.querySelector(".nested-modal-mask:last-of-type .nested-modal")?.classList.add("project-log-assignment-modal");
}

function confirmProjectLogAssignment(btn){
  const area=document.getElementById("projectLogAssignArea")?.value||"";
  const subitem=document.getElementById("projectLogAssignSubitem")?.value||"";
  const personIds=[...document.querySelectorAll("#projectLogAssignPeople input:checked")].map(input=>input.value);
  if(!area)return showToast("请选择施工工区");
  if(!subitem)return showToast("请选择分部分项");
  if(!personIds.length)return showToast("请选择分配人员");
  const people=getProjectLogManagementPersonnel()
    .filter(item=>personIds.includes(item.id))
    .map(item=>({id:item.id,name:item.name,job:item.job,phone:item.phone}));
  if(!people.length)return showToast("分配人员不存在");
  const personNames=people.map(item=>item.name).join("、");
  projectLogCurrentAssignment={id:Date.now(),date:document.getElementById("projectLogReportDate")?.value||"",area,subitem,people};
  projectLogAssignments.unshift(projectLogCurrentAssignment);
  const areaSelect=document.getElementById("projectLogReportArea");
  if(areaSelect)areaSelect.value=area;
  refreshProjectLogSharedSections("projectLogReport");
  const info=document.getElementById("projectLogAssignmentInfo");
  if(info)info.textContent=`已分配：${area} / ${subitem} / ${personNames}`;
  refreshProjectLogWorkReporters();
  syncProjectLogRecorderFromWorkRows();
  closeNestedModal(btn);
  showToast(`已分配给${personNames}填报`);
}

function renderProjectLogPersonInput(id,value){
  return `<div class="project-log-unit-input"><input class="input" id="${id}" type="number" value="${value}"/><span>人</span></div>`;
}

function renderProjectLogPhotoUpload(){
  return `
    <div class="project-log-photo-upload">
      <input id="projectLogPhotoInput" type="file" accept="image/*" multiple onchange="handleProjectLogPhotoFiles(this.files)" hidden/>
      <button type="button" onclick="document.getElementById('projectLogPhotoInput')?.click()"><span>＋</span></button>
      <div class="project-log-photo-side">
        <div class="project-log-photo-preview" id="projectLogPhotoPreview">
          ${projectLogReportPhotoList.map((photo,index)=>renderProjectLogPhotoItem(photo,index)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderProjectLogPhotoItem(photo,index){
  return `
    <div class="project-log-photo-item">
      <img src="${photo.url}" alt="${escapeAttr(photo.name)}"/>
      <button type="button" onclick="removeProjectLogPhoto(${index})">×</button>
    </div>
  `;
}

function formatProjectLogFileSize(size){
  if(!Number.isFinite(size))return "-";
  if(size>=1024*1024)return `${(size/1024/1024).toFixed(2)}MB`;
  if(size>=1024)return `${(size/1024).toFixed(1)}KB`;
  return `${size}B`;
}

function renderProjectLogFileUpload(rowIndex=0){
  const row=projectLogReportFileRows[rowIndex]||{files:projectLogReportFileList};
  const files=row.files||[];
  return `
    <div class="project-log-file-upload">
      <input id="projectLogFileInput-${rowIndex}" type="file" multiple onchange="handleProjectLogFileFiles(this.files,${rowIndex})" hidden/>
      <p>最多上传9个施工日志文件</p>
      <button class="btn primary project-log-file-upload-btn" type="button" onclick="document.getElementById('projectLogFileInput-${rowIndex}')?.click()">文件上传</button>
      <div class="project-log-file-preview" id="projectLogFilePreview-${rowIndex}">
        ${files.map((file,index)=>renderProjectLogFileItem(file,index,rowIndex)).join("")}
      </div>
    </div>
  `;
}

function renderProjectLogFileItem(file,index,rowIndex=0){
  return `
    <div class="project-log-file-upload-item">
      <div class="project-log-file-icon">▤</div>
      <button type="button" class="project-log-file-preview-trigger" onclick="showToast('打开预览文件')">
        <strong>${escapeAttr(file.name || "施工日志文件")}</strong>
        <span>${file.sizeText || "-"}</span>
      </button>
      <button type="button" onclick="removeProjectLogFile(${index},${rowIndex})">×</button>
    </div>
  `;
}

function refreshProjectLogFilePreview(rowIndex=0){
  const row=projectLogReportFileRows[rowIndex];
  if(!row)return;
  const box=document.getElementById(`projectLogFilePreview-${rowIndex}`);
  if(box)box.innerHTML=(row.files||[]).map((file,index)=>renderProjectLogFileItem(file,index,rowIndex)).join("");
}

function handleProjectLogFileFiles(files,rowIndex=0){
  const row=projectLogReportFileRows[rowIndex];
  if(!row)return;
  const incoming=[...(files || [])];
  if(!incoming.length)return;
  row.files=row.files||[];
  const available=Math.max(0,9-row.files.length);
  incoming.slice(0,available).forEach(file=>{
    row.files.push({
      name:file.name,
      size:file.size,
      sizeText:formatProjectLogFileSize(file.size),
      type:file.type || "",
      blob:file
    });
  });
  projectLogReportFileList=projectLogReportFileRows.flatMap(item=>item.files||[]);
  refreshProjectLogFilePreview(rowIndex);
  if(incoming.length>available)showToast("施工日志文件最多上传9个");
  const input=document.getElementById(`projectLogFileInput-${rowIndex}`);
  if(input)input.value="";
}

function removeProjectLogFile(index,rowIndex=0){
  const row=projectLogReportFileRows[rowIndex];
  if(!row)return;
  row.files.splice(index,1);
  projectLogReportFileList=projectLogReportFileRows.flatMap(item=>item.files||[]);
  refreshProjectLogFilePreview(rowIndex);
}

function renderProjectLogFileReportRow(row={},index=0){
  const reporter=getProjectLogWorkReporterByArea(row.area||"主体结构区",row.reporter||"");
  return `
    <div class="project-log-file-report-row" data-project-log-file-row="${index}">
      <div class="form-item project-log-file-area-item">
        <label>施工工区 <em>*</em></label>
        <select class="select project-log-file-row-area" onchange="syncProjectLogFileReportRow(${index});syncProjectLogFileWorkAreas();refreshProjectLogSharedSections('projectLogFileReport')">${renderProjectLogWorkAreaOptions(row.area||"主体结构区")}</select>
      </div>
      <div class="form-item project-log-file-reporter-item">
        <label>记录人 <em>*</em></label>
        <select class="select project-log-file-row-reporter" onchange="syncProjectLogFileReportRow(${index});syncProjectLogFileRecorderFromRows()">${renderProjectLogReporterOptions(reporter)}</select>
      </div>
      <div class="form-item project-log-file-remark-item">
        <label>当日施工情况描述 <em>*</em></label>
        <textarea class="input project-log-stop-textarea project-log-file-row-remark" placeholder="请输入备注说明" oninput="syncProjectLogFileReportRow(${index})">${escapeAttr(row.remark||"")}</textarea>
      </div>
      <div class="form-item project-log-file-form-item">
        <label>施工相关附件 <em>*</em></label>
        ${renderProjectLogFileUpload(index)}
      </div>
      <button class="btn danger small project-log-file-row-remove" type="button" onclick="removeProjectLogFileReportRow(${index})" ${projectLogReportFileRows.length<=1?"disabled":""}>删除</button>
    </div>
  `;
}

function refreshProjectLogFileReportRows(){
  const box=document.getElementById("projectLogFileReportRows");
  if(!box)return;
  box.innerHTML=projectLogReportFileRows.map((row,index)=>renderProjectLogFileReportRow(row,index)).join("");
  syncProjectLogFileWorkAreas();
  syncProjectLogFileRecorderFromRows();
}

function syncProjectLogFileWorkAreas(){
  const areaInput=document.getElementById("projectLogFileReportArea");
  if(!areaInput)return "";
  const summary=getProjectLogAreaSummary(projectLogReportFileRows.map(row=>row.area));
  areaInput.value=summary;
  return summary;
}

function syncProjectLogFileReportRow(index){
  const row=projectLogReportFileRows[index];
  const node=document.querySelector(`[data-project-log-file-row="${index}"]`);
  if(!row||!node)return;
  row.area=node.querySelector(".project-log-file-row-area")?.value||"";
  row.reporter=node.querySelector(".project-log-file-row-reporter")?.value||"";
  row.remark=node.querySelector(".project-log-file-row-remark")?.value.trim()||"";
  syncProjectLogFileRecorderFromRows();
}

function addProjectLogFileReportRow(){
  projectLogReportFileRows.push({area:"主体结构区",reporter:getProjectLogWorkReporterByArea("主体结构区"),remark:"",files:[]});
  refreshProjectLogFileReportRows();
}

function removeProjectLogFileReportRow(index){
  if(projectLogReportFileRows.length<=1)return;
  projectLogReportFileRows.splice(index,1);
  projectLogReportFileList=projectLogReportFileRows.flatMap(item=>item.files||[]);
  refreshProjectLogFileReportRows();
}

function refreshProjectLogPhotoPreview(){
  const box=document.getElementById("projectLogPhotoPreview");
  if(box)box.innerHTML=projectLogReportPhotoList.map((photo,index)=>renderProjectLogPhotoItem(photo,index)).join("");
}

function handleProjectLogPhotoFiles(files){
  const incoming=[...(files || [])].filter(file=>file.type.startsWith("image/"));
  if(!incoming.length)return;
  const available=Math.max(0,9-projectLogReportPhotoList.length);
  incoming.slice(0,available).forEach(file=>{
    const reader=new FileReader();
    reader.onload=event=>{
      projectLogReportPhotoList.push({name:file.name,url:event.target.result});
      refreshProjectLogPhotoPreview();
    };
    reader.readAsDataURL(file);
  });
  if(incoming.length>available)showToast("施工图片最多上传9张");
  const input=document.getElementById("projectLogPhotoInput");
  if(input)input.value="";
}

function removeProjectLogPhoto(index){
  projectLogReportPhotoList.splice(index,1);
  refreshProjectLogPhotoPreview();
}

function getProjectLogTodayValue(){
  const now=new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
}

function getProjectLogNextDateValue(date){
  const base=new Date(String(date||getProjectLogTodayValue()).replace(/-/g,"/"));
  if(Number.isNaN(base.getTime()))return getProjectLogTodayValue();
  base.setDate(base.getDate()+1);
  return `${base.getFullYear()}-${String(base.getMonth()+1).padStart(2,"0")}-${String(base.getDate()).padStart(2,"0")}`;
}

function renderProjectLogWorkSectionTitle(label,date){
  return `${label}（${date||"-"}）`;
}

function refreshProjectLogWorkSectionTitles(date=getProjectLogTodayValue()){
  const todayTitle=document.getElementById("projectLogTodayWorkTitle");
  const tomorrowTitle=document.getElementById("projectLogTomorrowWorkTitle");
  if(todayTitle)todayTitle.textContent=renderProjectLogWorkSectionTitle("今日主要工作",date);
  if(tomorrowTitle)tomorrowTitle.textContent=renderProjectLogWorkSectionTitle("明日主要工作",getProjectLogNextDateValue(date));
}

function syncProjectLogReportWeekday(prefix){
  const date=document.getElementById(`${prefix}Date`)?.value||getProjectLogTodayValue();
  const weekday=document.getElementById(`${prefix}Weekday`);
  if(weekday)weekday.value=getProjectLogReadonlyWeekday(date);
  if(prefix==="projectLogReport")refreshProjectLogWorkSectionTitles(date);
  if(prefix==="projectLogReport"||prefix==="projectLogFileReport")refreshProjectLogSharedSections(prefix);
}

function renderProjectLogReportBaseInfo(prefix="projectLogReport",defaultArea="主体结构区",mode="online",defaultDate=getProjectLogTodayValue(),defaultRecorder="楼力栋"){
  const today=defaultDate;
  const isFile=mode==="file";
  return `
    <section class="project-log-report-section">
      <h3>基础信息</h3>
      <div class="project-log-report-grid four">
        ${isFile?"":`<div class="form-item"><label>项目名称 <em>*</em></label><input class="input project-log-recorder-readonly" value="${escapeAttr(pcPortalState.currentProject)}" readonly/></div>`}
        <div class="form-item"><label>施工工区 <em>*</em></label><input class="input project-log-recorder-readonly" id="${prefix}Area" value="${escapeAttr(defaultArea)}" readonly/></div>
        <div class="form-item"><label>日期 <em>*</em></label><input class="input" id="${prefix}Date" type="date" value="${today}" onchange="syncProjectLogReportWeekday('${prefix}')"/></div>
        ${isFile?"":`
          <div class="form-item"><label>星期 <em>*</em></label><input class="input project-log-recorder-readonly" id="${prefix}Weekday" value="${getProjectLogReadonlyWeekday(today)}" readonly/></div>
          <div class="form-item"><label>温度 <em>*</em></label><div class="project-log-unit-input"><input class="input" placeholder="请输入"/><span>℃</span></div></div>
          <div class="form-item"><label>天气是否影响工作 <em>*</em></label><select class="select"><option>是</option><option selected>否</option></select></div>
        `}
        <div class="form-item"><label>记录人 <em>*</em></label>${renderProjectLogRecorderReadonly(`${prefix}Recorder`,defaultRecorder)}</div>
      </div>
    </section>
  `;
}

function openProjectLogReportModal(editRow=null){
  if(!editRow)projectLogEditingRow=null;
  projectLogCurrentAssignment=null;
  const detail=editRow?getProjectLogReadonlyOnlineDetail(editRow):null;
  const reportDate=editRow?.date||getProjectLogTodayValue();
  const sharedDetail=getProjectLogSyncedSharedDetail("online",reportDate,editRow?.workArea||"主体结构区",editRow);
  projectLogMilestoneTab="ongoing";
  projectLogMilestoneDraftRows=sharedDetail.milestones.map(item=>({...item}));
  projectLogReportPhotoList=detail?.photos?.map(photo=>({...photo}))||[];
  openModal(editRow?"编辑施工日志":"施工日志在线上报",`
    <div class="project-log-online-report">
      ${renderProjectLogReportBaseInfo("projectLogReport",editRow?.workArea||"主体结构区","online",reportDate,editRow?.uploader||"楼力栋")}

      <section class="project-log-report-section">
        <h3>人员信息</h3>
        <div class="project-log-report-grid four">
          <div class="form-item"><label>总包管理人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportMainStaff",21)}</div>
          <div class="form-item"><label>分包管理人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportSubStaff",12)}</div>
          <div class="form-item"><label>劳务人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportWorker",3)}</div>
        </div>
      </section>

      <section class="project-log-report-section">
        <h3 id="projectLogTodayWorkTitle">${renderProjectLogWorkSectionTitle("今日主要工作",reportDate)}</h3>
        ${renderProjectLogWorkTable("today",detail?.today)}
      </section>

      <section class="project-log-report-section">
        <h3 id="projectLogTomorrowWorkTitle">${renderProjectLogWorkSectionTitle("明日主要工作",getProjectLogNextDateValue(reportDate))}</h3>
        ${renderProjectLogWorkTable("tomorrow",detail?.tomorrow)}
      </section>

      <section class="project-log-report-section">
        ${renderProjectLogMilestoneSectionHeader()}
        <div id="projectLogMilestoneRows">
          ${renderProjectLogMilestoneRows(sharedDetail.milestones,reportDate)}
        </div>
      </section>

      <section class="project-log-report-section">
        <h3>风险情况</h3>
        <div id="projectLogRiskRows">
          ${renderProjectLogRiskRows(sharedDetail.risks)}
        </div>
      </section>

      <section class="project-log-report-section">
        <h3>发生停工情况</h3>
        <textarea class="input project-log-stop-textarea" placeholder="请输入"></textarea>
      </section>
    </div>
  `,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn" onclick="showToast('施工日志已暂存')">暂存</button>
    <button class="btn primary" onclick="submitProjectLogReport()">${editRow?"保存修改":"提交上报"}</button>
  `,"large");
  modalBox.classList.add("project-log-online-report-modal");
  refreshProjectLogWorkReporters();
  syncProjectLogOnlineWorkAreas();
}

function openProjectLogFileReportModal(editRow=null){
  if(!editRow)projectLogEditingRow=null;
  const fileEntries=Array.isArray(editRow?.fileEntries)&&editRow.fileEntries.length
    ?editRow.fileEntries.map(entry=>({area:entry.area||editRow.workArea||"主体结构区",reporter:entry.reporter||editRow.uploader||"",remark:entry.remark||entry.summary||"",files:getProjectLogReadonlyFiles(entry).map(file=>({...file,size:0}))}))
    :[{area:editRow?.workArea||"主体结构区",reporter:editRow?.uploader||"",remark:editRow?.summary||"",files:editRow?getProjectLogReadonlyFiles(editRow).map(file=>({...file,size:0})):[]}];
  projectLogReportFileRows=fileEntries;
  projectLogReportFileList=projectLogReportFileRows.flatMap(row=>row.files||[]);
  const reportDate=editRow?.date||getProjectLogTodayValue();
  const sharedDetail=getProjectLogSyncedSharedDetail("file",reportDate,editRow?.workArea||"主体结构区",editRow);
  projectLogMilestoneTab="ongoing";
  projectLogMilestoneDraftRows=sharedDetail.milestones.map(item=>({...item}));
  openModal(editRow?"编辑施工日志":"施工日志文件上报",`
    <div class="project-log-online-report">
      ${renderProjectLogReportBaseInfo("projectLogFileReport",editRow?.workArea||"主体结构区","file",reportDate,editRow?.uploader||"楼力栋")}
      <section class="project-log-report-section">
        <div class="project-log-report-section-title-row">
          <h3>施工日志文件</h3>
          <button class="btn primary mini" type="button" onclick="addProjectLogFileReportRow()">添加</button>
        </div>
        <div id="projectLogFileReportRows" class="project-log-file-report-rows">
          ${projectLogReportFileRows.map((row,index)=>renderProjectLogFileReportRow(row,index)).join("")}
        </div>
      </section>

      <section class="project-log-report-section">
        ${renderProjectLogMilestoneSectionHeader()}
        <div id="projectLogMilestoneRows">
          ${renderProjectLogMilestoneRows(sharedDetail.milestones,reportDate)}
        </div>
      </section>

      <section class="project-log-report-section">
        <h3>风险情况</h3>
        <div id="projectLogRiskRows">
          ${renderProjectLogRiskRows(sharedDetail.risks)}
        </div>
      </section>
    </div>
  `,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitProjectLogFileReport()">${editRow?"保存修改":"提交上报"}</button>
  `,"large");
  modalBox.classList.add("project-log-online-report-modal");
  syncProjectLogFileWorkAreas();
  syncProjectLogFileRecorderFromRows();
}

function submitProjectLogReport(){
  const risks=collectProjectLogRiskRows();
  if(!risks)return;
  const milestones=collectProjectLogMilestoneRows();
  if(!milestones)return;
  refreshProjectLogWorkReporters();
  const today=collectProjectLogWorkRows("today");
  const tomorrow=collectProjectLogWorkRows("tomorrow");
  const editing=projectLogEditingRow;
  const recorder=getProjectLogRecorderValue("楼力栋");
  const recorderInput=document.getElementById("projectLogReportRecorder");
  if(recorderInput)recorderInput.value=recorder;
  const date=document.getElementById("projectLogReportDate")?.value || getProjectLogTodayValue();
  const area=document.getElementById("projectLogReportArea")?.value || "主体结构区";
  const now=new Date();
  const uploadTime=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const firstContent=today[0]?.content||"";
  removeProjectLogCustomRowForEdit(editing);
  const newRow={
    id:editing?.id||Date.now(),
    projectName:pcPortalState.currentProject,
    mode:"online",
    customUpdatedAt:Date.now(),
    date,
    title:"在线上报施工日志",
    workArea:area,
    uploader:recorder,
    uploadTime,
    fileName:"",
    fileSize:"",
    summary:firstContent || "完成施工日志在线上报。",
    today,
    tomorrow,
    milestones,
    risks,
    cover:editing?.cover || ""
  };
  projectLogDeletedKeys.delete(getProjectLogRecordKey(newRow));
  projectLogCustomRows.unshift(newRow);
  projectLogStatusMap[date]="uploaded";
  projectLogState.month=date.slice(0,7);
  projectLogState.page=1;
  projectLogState.workArea="";
  projectLogState.mode="";
  projectLogState.keyword="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.selectedDate=date;
  closeModal();
  projectLogEditingRow=null;
  renderProjectLogPage();
  showToast(editing?"施工日志修改成功":"施工日志上报成功");
}

function submitProjectLogFileReport(){
  projectLogReportFileRows.forEach((_,index)=>syncProjectLogFileReportRow(index));
  for(let index=0;index<projectLogReportFileRows.length;index++){
    const row=projectLogReportFileRows[index];
    const node=document.querySelector(`[data-project-log-file-row="${index}"]`);
    if(!row.area){
      showToast(`请选择第${index+1}行施工工区`);
      node?.querySelector(".project-log-file-row-area")?.focus();
      return;
    }
    if(!row.reporter){
      showToast(`请选择第${index+1}行记录人`);
      node?.querySelector(".project-log-file-row-reporter")?.focus();
      return;
    }
    if(!row.remark){
      showToast(`请输入第${index+1}行当日施工情况描述`);
      node?.querySelector(".project-log-file-row-remark")?.focus();
      return;
    }
    if(!(row.files||[]).length){
      showToast(`请上传第${index+1}行施工日志文件`);
      return;
    }
  }
  projectLogReportFileList=projectLogReportFileRows.flatMap(row=>row.files||[]);
  const risks=collectProjectLogRiskRows();
  if(!risks)return;
  const milestones=collectProjectLogMilestoneRows();
  if(!milestones)return;
  const editing=projectLogEditingRow;
  const recorder=getProjectLogFileRecorderValue(editing?.uploader || "楼力栋");
  const date=document.getElementById("projectLogFileReportDate")?.value || getProjectLogTodayValue();
  const areas=[...new Set(projectLogReportFileRows.map(row=>row.area).filter(Boolean))];
  const area=getProjectLogAreaSummary(areas) || "主体结构区";
  const remark=projectLogReportFileRows.map(row=>row.remark).filter(Boolean).join("；");
  const now=new Date();
  const uploadTime=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const totalSize=projectLogReportFileList.reduce((sum,file)=>sum+(Number(file.size)||0),0);
  const firstFile=projectLogReportFileList[0];
  removeProjectLogCustomRowForEdit(editing);
  const newRow={
    id:editing?.id||Date.now(),
    projectName:pcPortalState.currentProject,
    mode:"file",
    customUpdatedAt:Date.now(),
    date,
    title:"文件上报施工日志",
    workArea:area,
    uploader:recorder,
    uploadTime,
    fileName:projectLogReportFileList.length>1?`${firstFile.name} 等${projectLogReportFileList.length}个文件`:firstFile.name,
    fileSize:totalSize?formatProjectLogFileSize(totalSize):(editing?.fileSize||firstFile.sizeText||"-"),
    summary:remark || "完成施工日志文件上报。",
    files:projectLogReportFileList.map(file=>({...file})),
    fileEntries:projectLogReportFileRows.map(row=>({
      area:row.area,
      reporter:row.reporter,
      remark:row.remark,
      summary:row.remark,
      files:(row.files||[]).map(file=>({...file}))
    })),
    milestones,
    risks
  };
  projectLogDeletedKeys.delete(getProjectLogRecordKey(newRow));
  projectLogCustomRows.unshift(newRow);
  projectLogStatusMap[date]="uploaded";
  projectLogState.month=date.slice(0,7);
  projectLogState.page=1;
  projectLogState.workArea="";
  projectLogState.mode="";
  projectLogState.keyword="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.selectedDate=date;
  closeModal();
  projectLogEditingRow=null;
  renderProjectLogPage();
  showToast(editing?"施工日志修改成功":"施工日志文件上报成功");
}

function renderProjectPortalPage(name){
  listPage.style.overflow="hidden";
  if(pcPortalState.projectLine==="economy"&&name==="经济总览")return renderProjectEconomyOverviewPage();
  if(pcPortalState.projectLine==="economy"&&name==="项目基本信息")return renderProjectEconomyBasicInfoPage();
  if(pcPortalState.projectLine==="production"&&name==="里程碑节点")return renderProjectMilestoneNodePage();
  if(pcPortalState.projectLine==="production"&&name==="风险管控清单")return renderProjectRiskControlPage();
  if(pcPortalState.projectLine==="production"&&name==="创奖管理")return renderProjectAwardManagementPage();
  if(pcPortalState.projectLine==="production"&&name==="技术方案管理")return renderProjectTechSchemePage();
  if(pcPortalState.projectLine==="safety"&&name==="管理人员名单"&&typeof renderProjectSafetyManagementPersonnelPage==="function")return renderProjectSafetyManagementPersonnelPage();
  if(pcPortalState.projectLine!=="home"){
    return renderProjectPlaceholderPage(name || projectPortalMenus[pcPortalState.projectLine]?.title || "项目管理");
  }
  if(name==="工作桌面")return renderProjectWorkspacePage();
  if(name==="项目详情")return renderProjectDetailPage();
  if(name==="工程总体筹划")return renderProjectOverallPlanningPage();
  if(name==="施工日志")return renderProjectLogPage();
  return renderProjectOverviewPage();
}

function renderProjectPageShell(title,subtitle,body){
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=`
    <div class="compact-title-row project-page-title-row">
      <div class="module-title">${title}</div>
    </div>
    ${body}
  `;
}

const projectMilestoneNodeState={
  nodeName:"",
  controlLevel:"",
  planLatestStart:"",
  planLatestEnd:"",
  planFirstStart:"",
  planFirstEnd:"",
  actualStart:"",
  actualEnd:"",
  statKey:"all",
  page:1,
  pageSize:50
};

const projectMilestoneNodeRows=[
  {id:5,nodeName:"主体结构封顶",planFirstDate:"2026-07-20",planLatestDate:"2026-07-20",actualDate:"",actualDeviation:"延期未完成",nodeStatus:"延期",controlLevel:"子公司管控",keyNode:"是",warningStatus:"红色预警",rectifyCount:1,changeCount:0,lastAdjustDate:"2026-07-18",remark:"需在施工日志中持续跟踪节点进展"},
  {id:1,nodeName:"附属结构基本完成",planFirstDate:"2026-08-20",planLatestDate:"2026-08-20",actualDate:"",actualDeviation:"--",nodeStatus:"正常",controlLevel:"分公司管控",keyNode:"否",warningStatus:"",rectifyCount:0,changeCount:0,lastAdjustDate:"2025-12-05",remark:""},
  {id:2,nodeName:"工程完工",planFirstDate:"2026-12-23",planLatestDate:"2026-12-23",actualDate:"",actualDeviation:"--",nodeStatus:"正常",controlLevel:"分公司管控",keyNode:"否",warningStatus:"",rectifyCount:0,changeCount:0,lastAdjustDate:"2025-12-05",remark:""},
  {id:3,nodeName:"工程竣工",planFirstDate:"2026-12-26",planLatestDate:"2026-12-26",actualDate:"",actualDeviation:"--",nodeStatus:"正常",controlLevel:"分公司管控",keyNode:"否",warningStatus:"",rectifyCount:0,changeCount:0,lastAdjustDate:"2025-12-05",remark:""},
  {id:4,nodeName:"工程开工",planFirstDate:"2023-05-23",planLatestDate:"2023-05-23",actualDate:"2023-05-23",actualDeviation:"按时完成",nodeStatus:"已完成",controlLevel:"分公司管控",keyNode:"否",warningStatus:"",rectifyCount:0,changeCount:0,lastAdjustDate:"2025-12-05",remark:""}
];

tableColumnDefinitions.projectMilestoneNode=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(projectMilestoneNodeState.page-1)*projectMilestoneNodeState.pageSize+index+1},
  {key:"nodeName",title:"里程碑节点名称",width:220,align:"left",render:row=>row.nodeName},
  {key:"planFirstDate",title:"计划完成日期(首次筹划)",width:170,align:"center",render:row=>row.planFirstDate},
  {key:"planLatestDate",title:"计划完成日期(最新)",width:170,align:"center",render:row=>row.planLatestDate},
  {key:"actualDate",title:"实际完成日期",width:140,align:"center",render:row=>row.actualDate||"-"},
  {key:"actualDeviation",title:"实际完成偏差",width:140,align:"center",render:row=>row.actualDeviation==="按时完成"?`<span class="milestone-success-text">按时完成</span>`:row.actualDeviation},
  {key:"nodeStatus",title:"节点状态",width:120,align:"center",render:row=>row.nodeStatus==="已完成"?tag("已完成","green"):tag("正常","blue")},
  {key:"controlLevel",title:"管控等级",width:130,align:"center",render:row=>row.controlLevel},
  {key:"keyNode",title:"是否重点进度节点",width:150,align:"center",render:row=>row.keyNode},
  {key:"warningStatus",title:"预警状态",width:120,align:"center",render:row=>row.warningStatus||"-"},
  {key:"rectifyCount",title:"整改次数",width:100,align:"center",render:row=>`<a class="link" onclick="showToast('查看整改记录')">${row.rectifyCount}</a>`},
  {key:"changeCount",title:"变更次数",width:100,align:"center",render:row=>`<a class="link" onclick="showToast('查看变更记录')">${row.changeCount}</a>`},
  {key:"lastAdjustDate",title:"最新调整日期",width:140,align:"center",render:row=>row.lastAdjustDate},
  {key:"remark",title:"备注",width:180,align:"left",render:row=>row.remark||""},
  {key:"action",title:"操作",width:100,align:"center",render:row=>row.nodeStatus==="已完成"?`<a class="link" onclick="showToast('节点已完成')">查看</a>`:`<a class="link" onclick="showToast('进入节点完成填报')">去完成</a>`}
];

function getProjectMilestoneFilteredRows(){
  return projectMilestoneNodeRows.filter(row=>{
    const s=projectMilestoneNodeState;
    if(s.nodeName&&!row.nodeName.includes(s.nodeName))return false;
    if(s.controlLevel&&row.controlLevel!==s.controlLevel)return false;
    if(s.planLatestStart&&row.planLatestDate<s.planLatestStart)return false;
    if(s.planLatestEnd&&row.planLatestDate>s.planLatestEnd)return false;
    if(s.planFirstStart&&row.planFirstDate<s.planFirstStart)return false;
    if(s.planFirstEnd&&row.planFirstDate>s.planFirstEnd)return false;
    if(s.actualStart&&(!row.actualDate||row.actualDate<s.actualStart))return false;
    if(s.actualEnd&&(!row.actualDate||row.actualDate>s.actualEnd))return false;
    if(s.statKey==="normal"&&row.nodeStatus!=="正常")return false;
    if(s.statKey==="finished"&&row.nodeStatus!=="已完成")return false;
    if(s.statKey==="delayed"&&row.nodeStatus!=="延期")return false;
    if(s.statKey==="due"&&row.actualDeviation!=="按时完成")return false;
    if(s.statKey==="ontime"&&row.actualDeviation!=="按时完成")return false;
    if(s.statKey==="delayedFinished"&&row.actualDeviation!=="延期完成")return false;
    if(s.statKey==="delayedUnfinished"&&row.actualDeviation!=="延期未完成")return false;
    if(s.statKey==="keyNode"&&row.keyNode!=="是")return false;
    if(s.statKey==="redWarning"&&row.warningStatus!=="红色预警")return false;
    if(s.statKey==="blackWarning"&&row.warningStatus!=="黑色预警")return false;
    return true;
  });
}

function getProjectMilestonePagedRows(){
  const rows=getProjectMilestoneFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectMilestoneNodeState.pageSize));
  projectMilestoneNodeState.page=Math.min(projectMilestoneNodeState.page,totalPages);
  const start=(projectMilestoneNodeState.page-1)*projectMilestoneNodeState.pageSize;
  return rows.slice(start,start+projectMilestoneNodeState.pageSize);
}

function setProjectMilestoneStat(key){
  projectMilestoneNodeState.statKey=key;
  projectMilestoneNodeState.page=1;
  renderProjectMilestoneNodePage();
}

function renderProjectMilestoneStatsCard(){
  const rows=projectMilestoneNodeRows;
  const count=predicate=>rows.filter(predicate).length;
  const all=rows.length;
  const normal=count(row=>row.nodeStatus==="正常");
  const finished=count(row=>row.nodeStatus==="已完成");
  const delayed=count(row=>row.nodeStatus==="延期");
  const due=count(row=>row.planLatestDate<="2026-07-10"&&row.nodeStatus!=="已完成");
  const ontime=count(row=>row.actualDeviation==="按时完成");
  const delayedFinished=count(row=>row.actualDeviation==="延期完成");
  const delayedUnfinished=count(row=>row.actualDeviation==="延期未完成");
  const ontimeRate=due?Math.round(ontime*100/due):0;
  return StatisticsFilter.render({id:"project-milestone-statistics-filter",activeKey:projectMilestoneNodeState.statKey,groups:[
    {label:"全部节点",items:[{key:"all",label:"全部节点",value:all}]},
    {label:"节点状态",items:[{key:"normal",label:"正常",value:normal},{key:"finished",label:"已完成",value:finished},{key:"delayed",label:"延期",value:delayed}]},
    {label:"实际完成偏差",items:[{key:"due",label:"应完成",value:due},{key:"ontime",label:"按期完成",value:ontime},{key:"delayedFinished",label:"延期完成",value:delayedFinished},{key:"delayedUnfinished",label:"延期未完成",value:delayedUnfinished},{key:"ontimeRate",label:"按期完成率",value:`${ontimeRate}%`,metric:true}]},
    {label:"重点管控",items:[{key:"keyNode",label:"重点进度节点",value:count(row=>row.keyNode==="是")},{key:"redWarning",label:"红色预警",value:count(row=>row.warningStatus==="红色预警")},{key:"blackWarning",label:"黑色预警",value:count(row=>row.warningStatus==="黑色预警")}]}
  ],onChange:key=>setProjectMilestoneStat(key)});
  const statItem=(key,label,value,metric=false)=>`
    <div class="construction-project-stat-item ${projectMilestoneNodeState.statKey===key?"active":""} ${metric?"metric-only":""}" onclick="${metric?"showToast('按期完成率=按期完成/应完成')":`setProjectMilestoneStat('${key}')`}">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">全部节点</div>
        <div class="construction-project-stat-items">
          ${statItem("all","全部节点",all)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">节点状态</div>
        <div class="construction-project-stat-items">
          ${statItem("normal","正常",normal)}
          ${statItem("finished","已完成",finished)}
          ${statItem("delayed","延期",delayed)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">实际完成偏差</div>
        <div class="construction-project-stat-items">
          ${statItem("due","应完成",due)}
          ${statItem("ontime","按期完成",ontime)}
          ${statItem("delayedFinished","延期完成",delayedFinished)}
          ${statItem("delayedUnfinished","延期未完成",delayedUnfinished)}
          ${statItem("ontimeRate","按期完成率",`${ontimeRate}%`,true)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">重点管控</div>
        <div class="construction-project-stat-items">
          ${statItem("keyNode","重点进度节点",count(row=>row.keyNode==="是"))}
          ${statItem("redWarning","红色预警",count(row=>row.warningStatus==="红色预警"))}
          ${statItem("blackWarning","黑色预警",count(row=>row.warningStatus==="黑色预警"))}
        </div>
      </div>
    </div>
  `);
}

function renderProjectMilestoneNodePage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const rows=getProjectMilestoneFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectMilestoneNodeState.pageSize));
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">里程碑节点</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>里程碑节点名称</label><input class="input" id="projectMilestoneNodeName" value="${escapeAttr(projectMilestoneNodeState.nodeName)}" placeholder="请输入里程碑节点名称"/></div>
      <div class="form-item"><label>管控等级</label><select class="select" id="projectMilestoneControlLevel">
        ${renderActualOutputOptions(["分公司管控","子公司管控","集团管控"],projectMilestoneNodeState.controlLevel,"全部")}
      </select></div>
      <div class="form-item"><label>计划完成日期(最新)</label><div class="date-range"><input class="input" id="projectMilestonePlanLatestStart" type="date" value="${projectMilestoneNodeState.planLatestStart}"/><span>至</span><input class="input" id="projectMilestonePlanLatestEnd" type="date" value="${projectMilestoneNodeState.planLatestEnd}"/></div></div>
      <div class="form-item"><label>计划完成日期（首次筹划）</label><div class="date-range"><input class="input" id="projectMilestonePlanFirstStart" type="date" value="${projectMilestoneNodeState.planFirstStart}"/><span>至</span><input class="input" id="projectMilestonePlanFirstEnd" type="date" value="${projectMilestoneNodeState.planFirstEnd}"/></div></div>
      <div class="form-item"><label>实际完成日期</label><div class="date-range"><input class="input" id="projectMilestoneActualStart" type="date" value="${projectMilestoneNodeState.actualStart}"/><span>至</span><input class="input" id="projectMilestoneActualEnd" type="date" value="${projectMilestoneNodeState.actualEnd}"/></div></div>
    `,{title:"查询条件",queryFn:"queryProjectMilestoneNode()",resetFn:"resetProjectMilestoneNode()",gridClass:"search-grid",canCollapse:false})}
    ${renderProjectMilestoneStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"projectMilestoneNode",
      tbodyId:"projectMilestoneNodeTbody",
      renderFnName:"renderProjectMilestoneNodeTable",
      refreshAction:"renderProjectMilestoneNodePage()",
      exportAction:"showToast('里程碑节点数据导出成功')",
      beforeActions:`<button class="btn" onclick="showToast('历史版本功能待接入')">历史版本</button>`,
      title:"里程碑节点列表",
      total:rows.length,
      pageText:`<span id="projectMilestoneNodePageText">第 1 / ${totalPages} 页　每页 ${projectMilestoneNodeState.pageSize} 条</span>`
    })}
  `;
  renderProjectMilestoneNodeTable();
}

function syncProjectMilestoneQueryState(){
  projectMilestoneNodeState.nodeName=document.getElementById("projectMilestoneNodeName")?.value?.trim()||"";
  projectMilestoneNodeState.controlLevel=document.getElementById("projectMilestoneControlLevel")?.value||"";
  projectMilestoneNodeState.planLatestStart=document.getElementById("projectMilestonePlanLatestStart")?.value||"";
  projectMilestoneNodeState.planLatestEnd=document.getElementById("projectMilestonePlanLatestEnd")?.value||"";
  projectMilestoneNodeState.planFirstStart=document.getElementById("projectMilestonePlanFirstStart")?.value||"";
  projectMilestoneNodeState.planFirstEnd=document.getElementById("projectMilestonePlanFirstEnd")?.value||"";
  projectMilestoneNodeState.actualStart=document.getElementById("projectMilestoneActualStart")?.value||"";
  projectMilestoneNodeState.actualEnd=document.getElementById("projectMilestoneActualEnd")?.value||"";
}

function queryProjectMilestoneNode(){
  syncProjectMilestoneQueryState();
  projectMilestoneNodeState.page=1;
  renderProjectMilestoneNodePage();
}

function resetProjectMilestoneNode(){
  Object.assign(projectMilestoneNodeState,{
    nodeName:"",
    controlLevel:"",
    planLatestStart:"",
    planLatestEnd:"",
    planFirstStart:"",
    planFirstEnd:"",
    actualStart:"",
    actualEnd:"",
    statKey:"all",
    page:1,
    pageSize:50
  });
  renderProjectMilestoneNodePage();
}

function renderProjectMilestoneNodeTable(){
  renderTableByColumns("projectMilestoneNode",getProjectMilestonePagedRows(),"projectMilestoneNodeTbody");
  const total=getProjectMilestoneFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectMilestoneNodeState.pageSize));
  const totalText=document.getElementById("projectMilestoneNodeTotalText");
  const pageText=document.getElementById("projectMilestoneNodePageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.innerHTML=`
    <button class="btn mini" onclick="changeProjectMilestoneNodePage(-1)" ${projectMilestoneNodeState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${projectMilestoneNodeState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeProjectMilestoneNodePage(1)" ${projectMilestoneNodeState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeProjectMilestoneNodePageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===projectMilestoneNodeState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `;
}

function changeProjectMilestoneNodePage(dir){
  const total=getProjectMilestoneFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectMilestoneNodeState.pageSize));
  projectMilestoneNodeState.page=Math.min(totalPages,Math.max(1,projectMilestoneNodeState.page+dir));
  renderProjectMilestoneNodeTable();
}

function changeProjectMilestoneNodePageSize(value){
  projectMilestoneNodeState.pageSize=Number(value)||50;
  projectMilestoneNodeState.page=1;
  renderProjectMilestoneNodeTable();
}

const projectRiskControlState={
  riskType:"",
  riskName:"",
  planStartStart:"",
  planStartEnd:"",
  planFinishStart:"",
  planFinishEnd:"",
  riskDesc:"",
  leader:"",
  statKey:"all",
  page:1,
  pageSize:50
};

const projectRiskControlRows=[
  {id:1,riskType:"深基坑开挖",riskName:"深基坑开挖",riskLevel:"II级",annualRisk:"否",nearHighway:"否",planStartDate:"2026-01-01",actualStartDate:"2026-03-26",planFinishDate:"2026-09-16",actualEndDate:"",duration:"258天",riskDesc:"附属土方开挖",leader:"蔡群群 | 156****6265",acceptance:"是",startWork:"1",riskStatus:"未完成"},
  {id:2,riskType:"承重支模架",riskName:"承重支模架",riskLevel:"II级",annualRisk:"否",nearHighway:"否",planStartDate:"2026-03-31",actualStartDate:"2026-04-15",planFinishDate:"2026-11-15",actualEndDate:"",duration:"229天",riskDesc:"附属主体结构",leader:"蔡群群 | 156****6265",acceptance:"是",startWork:"1",riskStatus:"未完成"}
];

tableColumnDefinitions.projectRiskControl=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(projectRiskControlState.page-1)*projectRiskControlState.pageSize+index+1},
  {key:"riskType",title:"风险类型",width:150,align:"left",render:row=>row.riskType},
  {key:"riskName",title:"风险名称",width:220,align:"left",render:row=>row.riskName},
  {key:"riskLevel",title:"风险等级",width:100,align:"center",render:row=>row.riskLevel},
  {key:"annualRisk",title:"是否年度风险",width:130,align:"center",render:row=>row.annualRisk},
  {key:"nearHighway",title:"是否临铁/临高速",width:150,align:"center",render:row=>row.nearHighway},
  {key:"planStartDate",title:"计划开始日期",width:130,align:"center",render:row=>row.planStartDate},
  {key:"actualStartDate",title:"实际开始日期",width:130,align:"center",render:row=>row.actualStartDate||"-"},
  {key:"planFinishDate",title:"计划完成日期",width:130,align:"center",render:row=>row.planFinishDate},
  {key:"actualEndDate",title:"实际结束日期",width:130,align:"center",render:row=>row.actualEndDate||"-"},
  {key:"duration",title:"计划持续时间",width:120,align:"center",render:row=>row.duration},
  {key:"riskDesc",title:"风险描述",width:220,align:"left",render:row=>row.riskDesc},
  {key:"leader",title:"挂牌领导",width:180,align:"center",render:row=>row.leader},
  {key:"acceptance",title:"条件验收",width:100,align:"center",render:row=>row.acceptance},
  {key:"startWork",title:"开工令",width:90,align:"center",render:row=>`<a class="link" onclick="showToast('查看开工令')">🔗${row.startWork}</a>`},
  {key:"riskStatus",title:"风险状态",width:110,align:"center",render:row=>row.riskStatus==="已完成"?tag("已完成","green"):tag("未完成","orange")},
  {key:"action",title:"操作",width:100,align:"center",render:row=>row.riskStatus==="已完成"?`<a class="link" onclick="showToast('风险已完成')">查看</a>`:`<a class="link" onclick="showToast('进入风险完成填报')">去完成</a>`}
];

function getProjectRiskControlFilteredRows(){
  return projectRiskControlRows.filter(row=>{
    const s=projectRiskControlState;
    if(s.riskType&&row.riskType!==s.riskType)return false;
    if(s.riskName&&!row.riskName.includes(s.riskName))return false;
    if(s.riskDesc&&!row.riskDesc.includes(s.riskDesc))return false;
    if(s.leader&&!row.leader.includes(s.leader))return false;
    if(s.planStartStart&&row.planStartDate<s.planStartStart)return false;
    if(s.planStartEnd&&row.planStartDate>s.planStartEnd)return false;
    if(s.planFinishStart&&row.planFinishDate<s.planFinishStart)return false;
    if(s.planFinishEnd&&row.planFinishDate>s.planFinishEnd)return false;
    if(s.statKey==="level1"&&row.riskLevel!=="I级")return false;
    if(s.statKey==="level2"&&row.riskLevel!=="II级")return false;
    if(s.statKey==="level3"&&row.riskLevel!=="III级")return false;
    if(s.statKey==="annualAll"&&row.annualRisk!=="是")return false;
    if(s.statKey==="annual1"&&!(row.annualRisk==="是"&&row.riskLevel==="I级"))return false;
    if(s.statKey==="annual2"&&!(row.annualRisk==="是"&&row.riskLevel==="II级"))return false;
    if(s.statKey==="annual3"&&!(row.annualRisk==="是"&&row.riskLevel==="III级"))return false;
    if((s.statKey==="currentAll"||s.statKey==="progressAll")&&row.riskStatus!=="未完成")return false;
    if((s.statKey==="current1"||s.statKey==="progress1")&&!(row.riskStatus==="未完成"&&row.riskLevel==="I级"))return false;
    if((s.statKey==="current2"||s.statKey==="progress2")&&!(row.riskStatus==="未完成"&&row.riskLevel==="II级"))return false;
    if((s.statKey==="current3"||s.statKey==="progress3")&&!(row.riskStatus==="未完成"&&row.riskLevel==="III级"))return false;
    if(s.statKey==="nextTwoWeeks")return false;
    if(s.statKey==="finished"&&row.riskStatus!=="已完成")return false;
    if(s.statKey==="unfinished"&&row.riskStatus!=="未完成")return false;
    if(s.statKey==="acceptYes"&&row.acceptance!=="是")return false;
    if(s.statKey==="acceptNo"&&row.acceptance!=="否")return false;
    return true;
  });
}

function getProjectRiskControlPagedRows(){
  const rows=getProjectRiskControlFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectRiskControlState.pageSize));
  projectRiskControlState.page=Math.min(projectRiskControlState.page,totalPages);
  const start=(projectRiskControlState.page-1)*projectRiskControlState.pageSize;
  return rows.slice(start,start+projectRiskControlState.pageSize);
}

function setProjectRiskControlStat(key){
  projectRiskControlState.statKey=key;
  projectRiskControlState.page=1;
  renderProjectRiskControlPage();
}

function renderProjectRiskControlStatsCard(){
  const rows=projectRiskControlRows;
  const count=predicate=>rows.filter(predicate).length;
  return StatisticsFilter.render({id:"project-risk-control-statistics-filter",activeKey:projectRiskControlState.statKey,groups:[
    {label:"风险等级",items:[["level1","I级",count(row=>row.riskLevel==="I级")],["level2","II级",count(row=>row.riskLevel==="II级")],["level3","III级",count(row=>row.riskLevel==="III级")]].map(item=>({key:item[0],label:item[1],value:item[2]}))},
    {label:"当年完成",items:[["annualAll","全部",count(row=>row.annualRisk==="是")],["annual1","I级",count(row=>row.annualRisk==="是"&&row.riskLevel==="I级")],["annual2","II级",count(row=>row.annualRisk==="是"&&row.riskLevel==="II级")],["annual3","III级",count(row=>row.annualRisk==="是"&&row.riskLevel==="III级")]].map(item=>({key:item[0],label:item[1],value:item[2]}))},
    {label:"当年进入",items:[["currentAll","全部",count(row=>row.riskStatus==="未完成")],["current1","I级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="I级")],["current2","II级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="II级")],["current3","III级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="III级")]].map(item=>({key:item[0],label:item[1],value:item[2]}))},
    {label:"进行中",items:[["progressAll","全部",count(row=>row.riskStatus==="未完成")],["progress1","I级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="I级")],["progress2","II级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="II级")],["progress3","III级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="III级")]].map(item=>({key:item[0],label:item[1],value:item[2]}))},
    {label:"未来两周",items:[{key:"nextTwoWeeks",label:"全部",value:0}]},
    {label:"风险状态",items:[{key:"finished",label:"已完成",value:count(row=>row.riskStatus==="已完成")},{key:"unfinished",label:"未完成",value:count(row=>row.riskStatus==="未完成")}]},
    {label:"条件验收",items:[{key:"acceptYes",label:"是",value:count(row=>row.acceptance==="是")},{key:"acceptNo",label:"否",value:count(row=>row.acceptance==="否")}]}
  ],onChange:key=>setProjectRiskControlStat(key)});
  const statItem=(key,label,value,metric=false)=>`
    <div class="construction-project-stat-item ${projectRiskControlState.statKey===key?"active":""} ${metric?"metric-only":""}" onclick="${metric?"showToast('该统计项用于展示占比/提示')":`setProjectRiskControlStat('${key}')`}">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">风险等级</div>
        <div class="construction-project-stat-items">
          ${statItem("level1","I级",count(row=>row.riskLevel==="I级"))}
          ${statItem("level2","II级",count(row=>row.riskLevel==="II级"))}
          ${statItem("level3","III级",count(row=>row.riskLevel==="III级"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">当年完成</div>
        <div class="construction-project-stat-items">
          ${statItem("annualAll","全部",count(row=>row.annualRisk==="是"))}
          ${statItem("annual1","I级",count(row=>row.annualRisk==="是"&&row.riskLevel==="I级"))}
          ${statItem("annual2","II级",count(row=>row.annualRisk==="是"&&row.riskLevel==="II级"))}
          ${statItem("annual3","III级",count(row=>row.annualRisk==="是"&&row.riskLevel==="III级"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">当年进入</div>
        <div class="construction-project-stat-items">
          ${statItem("currentAll","全部",count(row=>row.riskStatus==="未完成"))}
          ${statItem("current1","I级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="I级"))}
          ${statItem("current2","II级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="II级"))}
          ${statItem("current3","III级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="III级"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">进行中</div>
        <div class="construction-project-stat-items">
          ${statItem("progressAll","全部",count(row=>row.riskStatus==="未完成"))}
          ${statItem("progress1","I级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="I级"))}
          ${statItem("progress2","II级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="II级"))}
          ${statItem("progress3","III级",count(row=>row.riskStatus==="未完成"&&row.riskLevel==="III级"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">未来两周</div>
        <div class="construction-project-stat-items">
          ${statItem("nextTwoWeeks","全部",0)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">风险状态</div>
        <div class="construction-project-stat-items">
          ${statItem("finished","已完成",count(row=>row.riskStatus==="已完成"))}
          ${statItem("unfinished","未完成",count(row=>row.riskStatus==="未完成"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">条件验收</div>
        <div class="construction-project-stat-items">
          ${statItem("acceptYes","是",count(row=>row.acceptance==="是"))}
          ${statItem("acceptNo","否",count(row=>row.acceptance==="否"))}
        </div>
      </div>
    </div>
  `);
}

function renderProjectRiskControlPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const rows=getProjectRiskControlFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectRiskControlState.pageSize));
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">风险管控清单</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>风险类型</label><select class="select" id="projectRiskType">
        ${renderActualOutputOptions(["深基坑开挖","承重支模架"],projectRiskControlState.riskType,"全部")}
      </select></div>
      <div class="form-item"><label>风险名称</label><input class="input" id="projectRiskName" value="${escapeAttr(projectRiskControlState.riskName)}" placeholder="请输入风险名称"/></div>
      <div class="form-item"><label>计划开始日期</label><div class="date-range"><input class="input" id="projectRiskPlanStartStart" type="date" value="${projectRiskControlState.planStartStart}"/><span>至</span><input class="input" id="projectRiskPlanStartEnd" type="date" value="${projectRiskControlState.planStartEnd}"/></div></div>
      <div class="form-item"><label>计划完成日期</label><div class="date-range"><input class="input" id="projectRiskPlanFinishStart" type="date" value="${projectRiskControlState.planFinishStart}"/><span>至</span><input class="input" id="projectRiskPlanFinishEnd" type="date" value="${projectRiskControlState.planFinishEnd}"/></div></div>
      <div class="form-item"><label>风险描述</label><input class="input" id="projectRiskDesc" value="${escapeAttr(projectRiskControlState.riskDesc)}" placeholder="请输入风险描述"/></div>
      <div class="form-item"><label>挂牌领导</label><input class="input" id="projectRiskLeader" value="${escapeAttr(projectRiskControlState.leader)}" placeholder="请输入挂牌领导"/></div>
    `,{title:"查询条件",queryFn:"queryProjectRiskControl()",resetFn:"resetProjectRiskControl()",gridClass:"search-grid",canCollapse:false})}
    ${renderProjectRiskControlStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"projectRiskControl",
      tbodyId:"projectRiskControlTbody",
      renderFnName:"renderProjectRiskControlTable",
      refreshAction:"renderProjectRiskControlPage()",
      exportAction:"showToast('风险管控清单导出成功')",
      beforeActions:`<button class="btn primary" onclick="showToast('风险变更功能待接入')">变更</button><button class="btn" onclick="showToast('历史版本功能待接入')">历史版本</button>`,
      title:"风险管控清单",
      total:rows.length,
      pageText:`<span id="projectRiskControlPageText">第 1 / ${totalPages} 页　每页 ${projectRiskControlState.pageSize} 条</span>`
    })}
  `;
  renderProjectRiskControlTable();
}

function syncProjectRiskControlQueryState(){
  projectRiskControlState.riskType=document.getElementById("projectRiskType")?.value||"";
  projectRiskControlState.riskName=document.getElementById("projectRiskName")?.value?.trim()||"";
  projectRiskControlState.planStartStart=document.getElementById("projectRiskPlanStartStart")?.value||"";
  projectRiskControlState.planStartEnd=document.getElementById("projectRiskPlanStartEnd")?.value||"";
  projectRiskControlState.planFinishStart=document.getElementById("projectRiskPlanFinishStart")?.value||"";
  projectRiskControlState.planFinishEnd=document.getElementById("projectRiskPlanFinishEnd")?.value||"";
  projectRiskControlState.riskDesc=document.getElementById("projectRiskDesc")?.value?.trim()||"";
  projectRiskControlState.leader=document.getElementById("projectRiskLeader")?.value?.trim()||"";
}

function queryProjectRiskControl(){
  syncProjectRiskControlQueryState();
  projectRiskControlState.page=1;
  renderProjectRiskControlPage();
}

function resetProjectRiskControl(){
  Object.assign(projectRiskControlState,{
    riskType:"",
    riskName:"",
    planStartStart:"",
    planStartEnd:"",
    planFinishStart:"",
    planFinishEnd:"",
    riskDesc:"",
    leader:"",
    statKey:"all",
    page:1,
    pageSize:50
  });
  renderProjectRiskControlPage();
}

function renderProjectRiskControlTable(){
  renderTableByColumns("projectRiskControl",getProjectRiskControlPagedRows(),"projectRiskControlTbody");
  const total=getProjectRiskControlFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectRiskControlState.pageSize));
  const totalText=document.getElementById("projectRiskControlTotalText");
  const pageText=document.getElementById("projectRiskControlPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.innerHTML=`
    <button class="btn mini" onclick="changeProjectRiskControlPage(-1)" ${projectRiskControlState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${projectRiskControlState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeProjectRiskControlPage(1)" ${projectRiskControlState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeProjectRiskControlPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===projectRiskControlState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `;
}

function changeProjectRiskControlPage(dir){
  const total=getProjectRiskControlFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectRiskControlState.pageSize));
  projectRiskControlState.page=Math.min(totalPages,Math.max(1,projectRiskControlState.page+dir));
  renderProjectRiskControlTable();
}

function changeProjectRiskControlPageSize(value){
  projectRiskControlState.pageSize=Number(value)||50;
  projectRiskControlState.page=1;
  renderProjectRiskControlTable();
}

const projectAwardManagementState={
  awardName:"",
  awardType:"",
  awardLevel:"",
  issuingUnit:"",
  planReportStart:"",
  planReportEnd:"",
  participateStart:"",
  participateEnd:"",
  awardStart:"",
  awardEnd:"",
  certificateStart:"",
  certificateEnd:"",
  statKey:"all",
  page:1,
  pageSize:50
};

const projectAwardManagementRows=[
  {id:1,awardName:"上海市文明工地",awardType:"安全类",awardLevel:"省部级/直辖市",keyControl:"否",issuingUnit:"上海市住房和城乡建设管理委员会",planReportDate:"2025-06-11",planReportMonth:"2025-06",participateDate:"",participateMaterial:"",awardDate:"",awardDocument:"",certificateMonth:"",certificate:""},
  {id:2,awardName:"优质结构",awardType:"质量类",awardLevel:"省部级/直辖市",keyControl:"否",issuingUnit:"上海市建筑施工行业协会",planReportDate:"2025-06-10",planReportMonth:"2025-06",participateDate:"",participateMaterial:"",awardDate:"",awardDocument:"",certificateMonth:"",certificate:""}
];

tableColumnDefinitions.projectAwardManagement=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(projectAwardManagementState.page-1)*projectAwardManagementState.pageSize+index+1},
  {key:"awardName",title:"创奖名称",width:220,align:"left",render:row=>row.awardName},
  {key:"awardType",title:"创奖类型",width:120,align:"center",render:row=>tag(row.awardType,"blue")},
  {key:"awardLevel",title:"创奖等级",width:150,align:"center",render:row=>tag(row.awardLevel,"blue")},
  {key:"keyControl",title:"是否重点管控",width:130,align:"center",render:row=>row.keyControl},
  {key:"issuingUnit",title:"奖项发放单位",width:260,align:"left",render:row=>row.issuingUnit},
  {key:"planReportDate",title:"计划申报日期",width:140,align:"center",render:row=>row.planReportDate},
  {key:"participateDate",title:"参评日期",width:130,align:"center",render:row=>row.participateDate||"-"},
  {key:"participateMaterial",title:"参评材料",width:130,align:"center",render:row=>row.participateMaterial?`<a class="link" onclick="showToast('查看参评材料')">${row.participateMaterial}</a>`:"-"},
  {key:"awardDate",title:"获奖日期",width:130,align:"center",render:row=>row.awardDate||"-"},
  {key:"awardDocument",title:"获奖发文",width:130,align:"center",render:row=>row.awardDocument?`<a class="link" onclick="showToast('查看获奖发文')">${row.awardDocument}</a>`:"-"},
  {key:"certificateMonth",title:"颁发月份",width:130,align:"center",render:row=>row.certificateMonth||"-"},
  {key:"certificate",title:"获奖证书",width:130,align:"center",render:row=>row.certificate?`<a class="link" onclick="showToast('查看获奖证书')">${row.certificate}</a>`:"-"},
  {key:"action",title:"操作",width:150,align:"center",render:row=>`<a class="link" onclick="showToast('查看创奖详情')">查看</a>&nbsp;&nbsp;<a class="link" onclick="showToast('进入成果上报')">成果上报</a>`}
];

function getProjectAwardFilteredRows(){
  return projectAwardManagementRows.filter(row=>{
    const s=projectAwardManagementState;
    if(s.awardName&&!row.awardName.includes(s.awardName))return false;
    if(s.awardType&&row.awardType!==s.awardType)return false;
    if(s.awardLevel&&row.awardLevel!==s.awardLevel)return false;
    if(s.issuingUnit&&!row.issuingUnit.includes(s.issuingUnit))return false;
    if(s.planReportStart&&row.planReportMonth<s.planReportStart)return false;
    if(s.planReportEnd&&row.planReportMonth>s.planReportEnd)return false;
    if(s.participateStart&&(!row.participateDate||row.participateDate.slice(0,7)<s.participateStart))return false;
    if(s.participateEnd&&(!row.participateDate||row.participateDate.slice(0,7)>s.participateEnd))return false;
    if(s.awardStart&&(!row.awardDate||row.awardDate.slice(0,7)<s.awardStart))return false;
    if(s.awardEnd&&(!row.awardDate||row.awardDate.slice(0,7)>s.awardEnd))return false;
    if(s.certificateStart&&(!row.certificateMonth||row.certificateMonth<s.certificateStart))return false;
    if(s.certificateEnd&&(!row.certificateMonth||row.certificateMonth>s.certificateEnd))return false;
    if(s.statKey==="participated"&&!row.participateDate)return false;
    if(s.statKey==="awarded"&&!row.awardDate)return false;
    if(s.statKey==="issued"&&!row.certificateMonth)return false;
    if(s.statKey==="gradeNational"&&row.awardLevel!=="国家级")return false;
    if(s.statKey==="gradeProvince"&&row.awardLevel!=="省部级/直辖市")return false;
    if(s.statKey==="gradeBelow"&&row.awardLevel!=="省部级以下")return false;
    return true;
  });
}

function getProjectAwardPagedRows(){
  const rows=getProjectAwardFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectAwardManagementState.pageSize));
  projectAwardManagementState.page=Math.min(projectAwardManagementState.page,totalPages);
  const start=(projectAwardManagementState.page-1)*projectAwardManagementState.pageSize;
  return rows.slice(start,start+projectAwardManagementState.pageSize);
}

function setProjectAwardStat(key){
  projectAwardManagementState.statKey=key;
  projectAwardManagementState.page=1;
  renderProjectAwardManagementPage();
}

function renderProjectAwardStatsCard(){
  const rows=projectAwardManagementRows;
  const count=predicate=>rows.filter(predicate).length;
  return StatisticsFilter.render({id:"project-award-statistics-filter",activeKey:projectAwardManagementState.statKey,groups:[
    {label:"统计筛选",items:[{key:"all",label:"计划创奖数",value:rows.length}]},
    {label:"上报情况",items:[{key:"participated",label:"已参评",value:count(row=>!!row.participateDate)},{key:"awarded",label:"已获奖",value:count(row=>!!row.awardDate)},{key:"issued",label:"已颁发",value:count(row=>!!row.certificateMonth)}]},
    {label:"创奖等级",items:[{key:"gradeNational",label:"国家级",value:count(row=>row.awardLevel==="国家级")},{key:"gradeProvince",label:"省部级/直辖市",value:count(row=>row.awardLevel==="省部级/直辖市")},{key:"gradeBelow",label:"省部级以下",value:count(row=>row.awardLevel==="省部级以下")}]}
  ],onChange:key=>setProjectAwardStat(key)});
}

function renderProjectAwardManagementPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const rows=getProjectAwardFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectAwardManagementState.pageSize));
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">创奖管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>创奖名称</label><input class="input" id="projectAwardName" value="${escapeAttr(projectAwardManagementState.awardName)}" placeholder="请输入创奖名称"/></div>
      <div class="form-item"><label>创奖类型</label><select class="select" id="projectAwardType">
        ${renderActualOutputOptions(["安全类","质量类"],projectAwardManagementState.awardType,"全部")}
      </select></div>
      <div class="form-item"><label>创奖等级</label><select class="select" id="projectAwardLevel">
        ${renderActualOutputOptions(["国家级","省部级/直辖市","省部级以下"],projectAwardManagementState.awardLevel,"全部")}
      </select></div>
      <div class="form-item"><label>奖项发放单位</label><input class="input" id="projectAwardIssuingUnit" value="${escapeAttr(projectAwardManagementState.issuingUnit)}" placeholder="请输入奖项发放单位"/></div>
      <div class="form-item"><label>计划申报月份</label><div class="date-range"><input class="input" id="projectAwardPlanStart" type="month" value="${projectAwardManagementState.planReportStart}"/><span>至</span><input class="input" id="projectAwardPlanEnd" type="month" value="${projectAwardManagementState.planReportEnd}"/></div></div>
      <div class="form-item"><label>获奖月份</label><div class="date-range"><input class="input" id="projectAwardWinStart" type="month" value="${projectAwardManagementState.awardStart}"/><span>至</span><input class="input" id="projectAwardWinEnd" type="month" value="${projectAwardManagementState.awardEnd}"/></div></div>
      <div class="form-item"><label>颁发月份</label><div class="date-range"><input class="input" id="projectAwardCertStart" type="month" value="${projectAwardManagementState.certificateStart}"/><span>至</span><input class="input" id="projectAwardCertEnd" type="month" value="${projectAwardManagementState.certificateEnd}"/></div></div>
      <div class="form-item"><label>参评月份</label><div class="date-range"><input class="input" id="projectAwardParticipateStart" type="month" value="${projectAwardManagementState.participateStart}"/><span>至</span><input class="input" id="projectAwardParticipateEnd" type="month" value="${projectAwardManagementState.participateEnd}"/></div></div>
    `,{title:"查询条件",queryFn:"queryProjectAwardManagement()",resetFn:"resetProjectAwardManagement()",gridClass:"search-grid",canCollapse:false})}
    ${renderProjectAwardStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"projectAwardManagement",
      tbodyId:"projectAwardManagementTbody",
      renderFnName:"renderProjectAwardManagementTable",
      refreshAction:"renderProjectAwardManagementPage()",
      exportAction:"showToast('创奖管理数据导出成功')",
      beforeActions:`<button class="btn primary" onclick="showToast('创奖变更功能待接入')">变更</button><button class="btn" onclick="showToast('历史版本功能待接入')">历史版本</button>`,
      title:"创奖管理列表",
      total:rows.length,
      pageText:`<span id="projectAwardManagementPageText">第 1 / ${totalPages} 页　每页 ${projectAwardManagementState.pageSize} 条</span>`
    })}
  `;
  renderProjectAwardManagementTable();
}

function syncProjectAwardQueryState(){
  projectAwardManagementState.awardName=document.getElementById("projectAwardName")?.value?.trim()||"";
  projectAwardManagementState.awardType=document.getElementById("projectAwardType")?.value||"";
  projectAwardManagementState.awardLevel=document.getElementById("projectAwardLevel")?.value||"";
  projectAwardManagementState.issuingUnit=document.getElementById("projectAwardIssuingUnit")?.value?.trim()||"";
  projectAwardManagementState.planReportStart=document.getElementById("projectAwardPlanStart")?.value||"";
  projectAwardManagementState.planReportEnd=document.getElementById("projectAwardPlanEnd")?.value||"";
  projectAwardManagementState.awardStart=document.getElementById("projectAwardWinStart")?.value||"";
  projectAwardManagementState.awardEnd=document.getElementById("projectAwardWinEnd")?.value||"";
  projectAwardManagementState.certificateStart=document.getElementById("projectAwardCertStart")?.value||"";
  projectAwardManagementState.certificateEnd=document.getElementById("projectAwardCertEnd")?.value||"";
  projectAwardManagementState.participateStart=document.getElementById("projectAwardParticipateStart")?.value||"";
  projectAwardManagementState.participateEnd=document.getElementById("projectAwardParticipateEnd")?.value||"";
}

function queryProjectAwardManagement(){
  syncProjectAwardQueryState();
  projectAwardManagementState.page=1;
  renderProjectAwardManagementPage();
}

function resetProjectAwardManagement(){
  Object.assign(projectAwardManagementState,{
    awardName:"",
    awardType:"",
    awardLevel:"",
    issuingUnit:"",
    planReportStart:"",
    planReportEnd:"",
    participateStart:"",
    participateEnd:"",
    awardStart:"",
    awardEnd:"",
    certificateStart:"",
    certificateEnd:"",
    statKey:"all",
    page:1,
    pageSize:50
  });
  renderProjectAwardManagementPage();
}

function renderProjectAwardManagementTable(){
  renderTableByColumns("projectAwardManagement",getProjectAwardPagedRows(),"projectAwardManagementTbody");
  const total=getProjectAwardFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectAwardManagementState.pageSize));
  const totalText=document.getElementById("projectAwardManagementTotalText");
  const pageText=document.getElementById("projectAwardManagementPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.innerHTML=`
    <button class="btn mini" onclick="changeProjectAwardManagementPage(-1)" ${projectAwardManagementState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${projectAwardManagementState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeProjectAwardManagementPage(1)" ${projectAwardManagementState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeProjectAwardManagementPageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===projectAwardManagementState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `;
}

function changeProjectAwardManagementPage(dir){
  const total=getProjectAwardFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectAwardManagementState.pageSize));
  projectAwardManagementState.page=Math.min(totalPages,Math.max(1,projectAwardManagementState.page+dir));
  renderProjectAwardManagementTable();
}

function changeProjectAwardManagementPageSize(value){
  projectAwardManagementState.pageSize=Number(value)||50;
  projectAwardManagementState.page=1;
  renderProjectAwardManagementTable();
}

const projectTechSchemeState={
  schemeName:"",
  schemeType:"",
  schemeTag:"",
  dangerous:"",
  subcontract:"",
  expertReview:"",
  statKey:"all",
  page:1,
  pageSize:50
};

const projectTechSchemeRows=[
  {id:1,approvalStatus:"未审批",schemeType:"施工专项方案",schemeName:"芳乐路站附属基坑施工专项方案",schemeTag:"质量方案",dangerous:"否",subcontract:"否",planFinishDate:"2026-01-22",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"否",planReviewDate:"",expertFinishDate:"",milestoneCount:0,riskCount:0},
  {id:2,approvalStatus:"未审批",schemeType:"施工专项方案",schemeName:"附属深基坑工程施工专项方案",schemeTag:"质量方案",dangerous:"否",subcontract:"否",planFinishDate:"2025-12-15",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"是",planReviewDate:"2025-12-22",expertFinishDate:"",milestoneCount:0,riskCount:0},
  {id:3,approvalStatus:"未审批",schemeType:"施工专项方案",schemeName:"芳乐路站附属基坑降水专项方案",schemeTag:"质量方案",dangerous:"否",subcontract:"是",planFinishDate:"2025-12-15",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"否",planReviewDate:"",expertFinishDate:"",milestoneCount:0,riskCount:0},
  {id:4,approvalStatus:"未审批",schemeType:"施工专项方案",schemeName:"附属基坑SMW工法桩施工方案",schemeTag:"质量方案",dangerous:"否",subcontract:"否",planFinishDate:"2025-07-21",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"否",planReviewDate:"",expertFinishDate:"",milestoneCount:0,riskCount:0},
  {id:5,approvalStatus:"未审批",schemeType:"施工专项方案",schemeName:"附属基坑钻孔灌注桩施工方案",schemeTag:"质量方案",dangerous:"否",subcontract:"否",planFinishDate:"2025-07-10",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"否",planReviewDate:"",expertFinishDate:"",milestoneCount:0,riskCount:0},
  {id:6,approvalStatus:"未审批",schemeType:"总体施工组织",schemeName:"总体施工组织",schemeTag:"",dangerous:"否",subcontract:"否",planFinishDate:"2022-12-15",actualApprovalDate:"",approvalFile:"",schemeFile:"",expertReview:"否",planReviewDate:"",expertFinishDate:"",milestoneCount:null,riskCount:null}
];

tableColumnDefinitions.projectTechScheme=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(projectTechSchemeState.page-1)*projectTechSchemeState.pageSize+index+1},
  {key:"approvalStatus",title:"方案审批状态",width:130,align:"center",render:row=>row.approvalStatus==="已审批"?tag("已审批","green"):tag("未审批","red")},
  {key:"schemeType",title:"方案类型",width:150,align:"center",render:row=>row.schemeType},
  {key:"schemeName",title:"方案名称",width:220,align:"left",render:row=>row.schemeName},
  {key:"schemeTag",title:"方案标签",width:130,align:"center",render:row=>row.schemeTag||"-"},
  {key:"dangerous",title:"是否危大工序/工程",width:160,align:"center",render:row=>row.dangerous},
  {key:"subcontract",title:"是否专业分包",width:130,align:"center",render:row=>row.subcontract},
  {key:"planFinishDate",title:"计划完成日期",width:130,align:"center",render:row=>row.planFinishDate},
  {key:"actualApprovalDate",title:"实际审批完成日期",width:160,align:"center",render:row=>row.actualApprovalDate||"-"},
  {key:"approvalFile",title:"方案批复文件",width:130,align:"center",render:row=>row.approvalFile?`<a class="link" onclick="showToast('查看方案批复文件')">${row.approvalFile}</a>`:"-"},
  {key:"schemeFile",title:"方案文件",width:120,align:"center",render:row=>row.schemeFile?`<a class="link" onclick="showToast('查看方案文件')">${row.schemeFile}</a>`:"-"},
  {key:"expertReview",title:"是否专家评审",width:130,align:"center",render:row=>row.expertReview},
  {key:"planReviewDate",title:"计划评审日期",width:130,align:"center",render:row=>row.planReviewDate||"-"},
  {key:"expertFinishDate",title:"专家评审完成日期",width:160,align:"center",render:row=>row.expertFinishDate||"-"},
  {key:"milestoneCount",title:"关联里程碑",width:120,align:"center",render:row=>row.milestoneCount===null?"-":`<a class="link" onclick="showToast('查看关联里程碑')">${row.milestoneCount}</a>`},
  {key:"riskCount",title:"关联风险",width:110,align:"center",render:row=>row.riskCount===null?"-":`<a class="link" onclick="showToast('查看关联风险')">${row.riskCount}</a>`},
  {key:"action",title:"操作",width:150,align:"center",render:row=>`<a class="link" onclick="showToast('查看方案详情')">查看</a>&nbsp;&nbsp;<a class="link" onclick="showToast('进入方案上报')">方案上报</a>`}
];

function getProjectTechSchemeFilteredRows(){
  return projectTechSchemeRows.filter(row=>{
    const s=projectTechSchemeState;
    if(s.schemeName&&!row.schemeName.includes(s.schemeName))return false;
    if(s.schemeType&&row.schemeType!==s.schemeType)return false;
    if(s.schemeTag&&row.schemeTag!==s.schemeTag)return false;
    if(s.dangerous&&row.dangerous!==s.dangerous)return false;
    if(s.subcontract&&row.subcontract!==s.subcontract)return false;
    if(s.expertReview&&row.expertReview!==s.expertReview)return false;
    if(s.statKey==="unapproved"&&row.approvalStatus!=="未审批")return false;
    if(s.statKey==="approved"&&row.approvalStatus!=="已审批")return false;
    if(s.statKey==="linkedMilestone"&&!(Number(row.milestoneCount)>0))return false;
    if(s.statKey==="linkedRisk"&&!(Number(row.riskCount)>0))return false;
    return true;
  });
}

function getProjectTechSchemePagedRows(){
  const rows=getProjectTechSchemeFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectTechSchemeState.pageSize));
  projectTechSchemeState.page=Math.min(projectTechSchemeState.page,totalPages);
  const start=(projectTechSchemeState.page-1)*projectTechSchemeState.pageSize;
  return rows.slice(start,start+projectTechSchemeState.pageSize);
}

function setProjectTechSchemeStat(key){
  projectTechSchemeState.statKey=key;
  projectTechSchemeState.page=1;
  renderProjectTechSchemePage();
}

function renderProjectTechSchemeStatsCard(){
  const rows=projectTechSchemeRows;
  const count=predicate=>rows.filter(predicate).length;
  return StatisticsFilter.render({id:"project-tech-scheme-statistics-filter",activeKey:projectTechSchemeState.statKey,groups:[
    {label:"计划总数",items:[{key:"all",label:"计划总数",value:rows.length}]},
    {label:"技术方案",items:[{key:"unapproved",label:"未审批",value:count(row=>row.approvalStatus==="未审批")},{key:"approved",label:"已审批",value:count(row=>row.approvalStatus==="已审批")}]},
    {label:"方案关联",items:[{key:"linkedMilestone",label:"已关联里程碑",value:count(row=>Number(row.milestoneCount)>0)},{key:"linkedRisk",label:"已关联风险",value:count(row=>Number(row.riskCount)>0)}]}
  ],onChange:key=>setProjectTechSchemeStat(key)});
}

function renderProjectTechSchemePage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const rows=getProjectTechSchemeFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectTechSchemeState.pageSize));
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">技术方案管理</div>
    </div>
    ${renderUnifiedQueryCard(`
      <div class="form-item"><label>方案名称</label><input class="input" id="projectTechSchemeName" value="${escapeAttr(projectTechSchemeState.schemeName)}" placeholder="请输入方案名称"/></div>
      <div class="form-item"><label>方案类型</label><select class="select" id="projectTechSchemeType">
        ${renderActualOutputOptions(["施工专项方案","总体施工组织"],projectTechSchemeState.schemeType,"全部")}
      </select></div>
      <div class="form-item"><label>方案标签</label><select class="select" id="projectTechSchemeTag">
        ${renderActualOutputOptions(["质量方案","安全方案","进度方案"],projectTechSchemeState.schemeTag,"全部")}
      </select></div>
      <div class="form-item"><label>是否危大工序/工程</label><select class="select" id="projectTechSchemeDangerous">
        ${renderActualOutputOptions(["是","否"],projectTechSchemeState.dangerous,"全部")}
      </select></div>
      <div class="form-item"><label>是否专业分包</label><select class="select" id="projectTechSchemeSubcontract">
        ${renderActualOutputOptions(["是","否"],projectTechSchemeState.subcontract,"全部")}
      </select></div>
      <div class="form-item"><label>是否专家评审</label><select class="select" id="projectTechSchemeExpert">
        ${renderActualOutputOptions(["是","否"],projectTechSchemeState.expertReview,"全部")}
      </select></div>
    `,{title:"查询条件",queryFn:"queryProjectTechScheme()",resetFn:"resetProjectTechScheme()",gridClass:"search-grid",canCollapse:false})}
    ${renderProjectTechSchemeStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"projectTechScheme",
      tbodyId:"projectTechSchemeTbody",
      renderFnName:"renderProjectTechSchemeTable",
      refreshAction:"renderProjectTechSchemePage()",
      exportAction:"showToast('技术方案管理数据导出成功')",
      beforeActions:`<button class="btn primary" onclick="showToast('技术方案变更功能待接入')">变更</button><button class="btn" onclick="showToast('历史版本功能待接入')">历史版本</button>`,
      title:"技术方案管理列表",
      total:rows.length,
      pageText:`<span id="projectTechSchemePageText">第 1 / ${totalPages} 页　每页 ${projectTechSchemeState.pageSize} 条</span>`
    })}
  `;
  renderProjectTechSchemeTable();
}

function syncProjectTechSchemeQueryState(){
  projectTechSchemeState.schemeName=document.getElementById("projectTechSchemeName")?.value?.trim()||"";
  projectTechSchemeState.schemeType=document.getElementById("projectTechSchemeType")?.value||"";
  projectTechSchemeState.schemeTag=document.getElementById("projectTechSchemeTag")?.value||"";
  projectTechSchemeState.dangerous=document.getElementById("projectTechSchemeDangerous")?.value||"";
  projectTechSchemeState.subcontract=document.getElementById("projectTechSchemeSubcontract")?.value||"";
  projectTechSchemeState.expertReview=document.getElementById("projectTechSchemeExpert")?.value||"";
}

function queryProjectTechScheme(){
  syncProjectTechSchemeQueryState();
  projectTechSchemeState.page=1;
  renderProjectTechSchemePage();
}

function resetProjectTechScheme(){
  Object.assign(projectTechSchemeState,{
    schemeName:"",
    schemeType:"",
    schemeTag:"",
    dangerous:"",
    subcontract:"",
    expertReview:"",
    statKey:"all",
    page:1,
    pageSize:50
  });
  renderProjectTechSchemePage();
}

function renderProjectTechSchemeTable(){
  renderTableByColumns("projectTechScheme",getProjectTechSchemePagedRows(),"projectTechSchemeTbody");
  const total=getProjectTechSchemeFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectTechSchemeState.pageSize));
  const totalText=document.getElementById("projectTechSchemeTotalText");
  const pageText=document.getElementById("projectTechSchemePageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText)pageText.innerHTML=`
    <button class="btn mini" onclick="changeProjectTechSchemePage(-1)" ${projectTechSchemeState.page<=1?"disabled":""}>上一页</button>
    <b>第 ${projectTechSchemeState.page} / ${totalPages} 页</b>
    <button class="btn mini" onclick="changeProjectTechSchemePage(1)" ${projectTechSchemeState.page>=totalPages?"disabled":""}>下一页</button>
    <select class="select mini-select" onchange="changeProjectTechSchemePageSize(this.value)">
      ${[10,20,50].map(size=>`<option value="${size}" ${size===projectTechSchemeState.pageSize?"selected":""}>${size}条/页</option>`).join("")}
    </select>
  `;
}

function changeProjectTechSchemePage(dir){
  const total=getProjectTechSchemeFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/projectTechSchemeState.pageSize));
  projectTechSchemeState.page=Math.min(totalPages,Math.max(1,projectTechSchemeState.page+dir));
  renderProjectTechSchemeTable();
}

function changeProjectTechSchemePageSize(value){
  projectTechSchemeState.pageSize=Number(value)||50;
  projectTechSchemeState.page=1;
  renderProjectTechSchemeTable();
}

const projectPlanningModules=[
  {
    key:"progress",
    title:"进度筹划",
    required:true,
    status:"done",
    contentType:"tiles",
    tiles:[["关键节点","23","个"],["重点管控里程碑","6","个"]]
  },
  {
    key:"risk",
    title:"风险筹划",
    required:true,
    status:"planning",
    contentType:"levels",
    levels:[["一级风险","2","red"],["二级风险","5","orange"],["一般风险","15","yellow"]]
  },
  {
    key:"output",
    title:"总体产值筹划",
    required:true,
    status:"done",
    contentType:"amounts",
    amounts:[["总计划","23,564.56","万元"],["当年计划","10,577.24","万元"],["次年计划","8,564.79","万元"]]
  },
  {
    key:"tech",
    title:"技术方案筹划",
    required:true,
    status:"done",
    contentType:"tiles",
    tiles:[["通用类方案","6","个"],["业务类方案","6","个"]]
  },
  {
    key:"award",
    title:"创奖筹划",
    required:true,
    status:"done",
    contentType:"levels",
    levels:[["国家级","1","red"],["省部级","2","orange"],["市级及以下","5","yellow"]]
  },
  {
    key:"device",
    title:"设备筹划",
    required:true,
    status:"done",
    contentType:"tiles",
    tiles:[["设备类型","8","类"],["设备数","55","台"]]
  },
  {
    key:"labor",
    title:"劳动力筹划",
    required:true,
    status:"done",
    contentType:"tiles",
    tiles:[["计划工种","20","种"],["计划劳务人员数","256","人"]]
  },
  {
    key:"material",
    title:"主材总量筹划",
    required:true,
    status:"planning",
    contentType:"amounts",
    amounts:[["混凝土","23,564.56","m³"],["水泥","10,577.24","t"],["钢材","228,564.79","t"]]
  },
  {
    key:"constructionWaste",
    title:"建筑垃圾筹划",
    required:true,
    status:"planning",
    contentType:"amounts",
    amounts:[["工程渣土","5,000","吨"],["工程泥浆","5,000","吨"],["装修垃圾","5,000","吨"]]
  },
  {key:"cost",title:"目标成本计划",required:false,status:"future",contentType:"future"},
  {key:"subcontract",title:"分包分供筹划",required:false,status:"future",contentType:"future"}
];

const projectPlanningState={
  completedByProject:new Map()
};

function getCurrentProjectPlanningCompletedKeys(){
  const projectId=String(getCurrentProjectContext()?.id||"default");
  if(!projectPlanningState.completedByProject.has(projectId)){
    projectPlanningState.completedByProject.set(projectId,new Set(projectPlanningModules.filter(item=>item.status==="done").map(item=>item.key)));
  }
  return projectPlanningState.completedByProject.get(projectId);
}

function getProjectPlanningStatus(module){
  if(module.status==="future")return "future";
  return getCurrentProjectPlanningCompletedKeys().has(module.key)?"done":"planning";
}

function renderProjectPlanningCardContent(module,status){
  if(status==="future"){
    return `
      <div class="project-planning-future">
        <div class="project-planning-empty-icon">▤</div>
        <span>暂未开放</span>
      </div>
    `;
  }
  if(module.contentType==="levels"){
    return `
      <div class="project-planning-current">当前已筹划内容：</div>
      <div class="project-planning-levels">
        ${module.levels.map(item=>`
          <div>
            <span>${item[0]}</span>
            <strong class="${item[2]}">${item[1]}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }
  if(module.contentType==="amounts"){
    return `
      <div class="project-planning-current">当前已筹划内容：</div>
      <div class="project-planning-amounts">
        ${module.amounts.map(item=>`
          <div><span>${item[0]}</span><strong>${item[1]} <em>${item[2]}</em></strong></div>
        `).join("")}
      </div>
    `;
  }
  return `
    <div class="project-planning-current">当前已筹划内容：</div>
    <div class="project-planning-tiles">
      ${module.tiles.map(item=>`
        <div>
          <span>${item[0]}</span>
          <strong>${item[1]}<em>${item[2]}</em></strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProjectPlanningModule(module){
  const status=getProjectPlanningStatus(module);
  const statusText=status==="done"?"已筹划":status==="planning"?"待筹划":"暂未开放";
  const canPlan=status!=="future";
  return `
    <section class="project-planning-card ${status} type-${module.contentType} module-${module.key}">
      <header>
        <h3>${module.title}${module.required?`<em>*</em>`:""}</h3>
        ${canPlan?`<button type="button" onclick="completeProjectPlanningModule('${module.key}')">去筹划 <span>→</span></button>`:""}
      </header>
      <div class="project-planning-card-body">
        ${status!=="future"?`
          <div class="project-planning-status ${status}">
            <i>${status==="done"?"!":"!"}</i>
            <strong>${statusText}</strong>
          </div>
        `:""}
        ${renderProjectPlanningCardContent(module,status)}
      </div>
    </section>
  `;
}

const projectConstructionWasteRows=[
  {type:"工程渣土",amount:5000,contract:5000,dry:"",dryAmount:"",transport:5000,backfill:5000,duration:5000,batches:1},
  {type:"工程泥浆",amount:5000,contract:5000,dry:"是",dryAmount:5000,transport:5000,backfill:5000,duration:5000,batches:2},
  {type:"装修垃圾",amount:5000,contract:5000,dry:"",dryAmount:"",transport:5000,backfill:5000,duration:5000,batches:2},
  {type:"拆房垃圾",amount:5000,contract:5000,dry:"",dryAmount:"",transport:5000,backfill:5000,duration:5000,batches:2},
  {type:"废弃混凝土",amount:5000,contract:5000,dry:"",dryAmount:"",transport:5000,backfill:5000,duration:5000,batches:1}
];

function updateProjectWastePlanningRow(rowIndex,key,value){
  const row=projectConstructionWasteRows[rowIndex];
  if(!row)return;
  if(key==="dry"){
    row.dry=value;
    if(value==="否")row.dryAmount=0;
    renderProjectWastePlanningTable();
    return;
  }
  row[key]=value;
  if(row.type==="工程泥浆" && key==="amount" && Number(row.dryAmount)>Number(value||0)){
    row.dryAmount=Number(value||0);
    showToast("泥浆干化量不应超过产生量");
    renderProjectWastePlanningTable();
  }
}

function validateProjectWasteDryAmount(rowIndex,value){
  const row=projectConstructionWasteRows[rowIndex];
  if(!row)return;
  const amount=Number(row.amount||0);
  const next=Number(value||0);
  if(next>amount){
    row.dryAmount=amount;
    showToast("泥浆干化量不应超过产生量");
    renderProjectWastePlanningTable();
    return;
  }
  row.dryAmount=value;
}

function renderProjectWastePlanningCell(rowIndex,key,value,type="number",unit="",disabled=false,onchange=""){
  const inputStyle=unit?' style="width:78px;height:32px;border-top-right-radius:0;border-bottom-right-radius:0;text-align:left;"':'';
  const handler=onchange || `oninput="updateProjectWastePlanningRow(${rowIndex},'${key}',this.value)"`;
  const input=`<input class="input project-waste-input" id="projectWaste_${rowIndex}_${key}" type="${type}" value="${value??""}" ${handler} ${disabled?"disabled":""}${inputStyle}/>`;
  if(!unit)return input;
  return `<div class="project-waste-unit-field" style="width:104px;display:inline-flex;align-items:center;">${input}<span style="width:26px;height:32px;border:1px solid #D9E1EC;border-left:0;border-radius:0 4px 4px 0;background:#F7F8FA;color:#4E5969;font-size:12px;display:inline-flex;align-items:center;justify-content:center;">${unit}</span></div>`;
}

function renderProjectWastePlanningRows(){
  return projectConstructionWasteRows.map((row,index)=>`
    <tr>
      <td>${index+1}</td>
      <td>${row.type}</td>
      <td>${renderProjectWastePlanningCell(index,"amount",row.amount,"number","吨")}</td>
      <td>${renderProjectWastePlanningCell(index,"contract",row.contract,"number","吨")}</td>
      <td>
        ${row.type==="工程泥浆"?`
          <select class="select project-waste-select" id="projectWaste_${index}_dry" onchange="updateProjectWastePlanningRow(${index},'dry',this.value)">
            <option value="是" ${row.dry==="是"?"selected":""}>是</option>
            <option value="否" ${row.dry==="否"?"selected":""}>否</option>
          </select>
        `:""}
      </td>
      <td>${row.type==="工程泥浆"?renderProjectWastePlanningCell(index,"dryAmount",row.dry==="否"?0:row.dryAmount,"number","吨",row.dry==="否",`oninput="validateProjectWasteDryAmount(${index},this.value)"`):""}</td>
      <td>${renderProjectWastePlanningCell(index,"transport",row.transport,"number","吨")}</td>
      <td>${renderProjectWastePlanningCell(index,"backfill",row.backfill,"number","吨")}</td>
      <td>${renderProjectWastePlanningCell(index,"duration",row.duration,"number","天")}</td>
      <td>${renderProjectWastePlanningCell(index,"batches",row.batches)}</td>
    </tr>
  `).join("");
}

function renderProjectWastePlanningTable(){
  const body=document.getElementById("projectWastePlanningTableBody");
  if(body)body.innerHTML=renderProjectWastePlanningRows();
}

function openProjectConstructionWastePlanningModal(){
  const html=`
    <div class="project-waste-planning-modal-body" style="min-width:1120px;">
      <table class="project-log-report-table project-waste-planning-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>建筑垃圾产生种类</th>
            <th>产生量（吨）</th>
            <th>施工合同量（吨）</th>
            <th>泥浆是否源头干化</th>
            <th>泥浆干化量（吨）</th>
            <th>外运量（吨）</th>
            <th>回填自用量（吨）</th>
            <th>计划处置总工期（天）</th>
            <th>计划排放批次</th>
          </tr>
        </thead>
        <tbody id="projectWastePlanningTableBody"></tbody>
      </table>
    </div>
  `;
  openModal("建筑垃圾筹划",html,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitProjectConstructionWastePlanning()">保存并提交</button>
    <button class="btn" onclick="saveProjectConstructionWastePlanning()">保存</button>
  `,"large");
  modalBox.classList.add("project-waste-planning-modal");
  renderProjectWastePlanningTable();
}

function saveProjectConstructionWastePlanning(){
  showToast("建筑垃圾筹划已保存");
}

function submitProjectConstructionWastePlanning(){
  getCurrentProjectPlanningCompletedKeys().add("constructionWaste");
  closeModal();
  renderProjectOverallPlanningPage();
  showToast("建筑垃圾筹划已保存并提交");
}

let projectRiskPlanningRows=[
  {riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""},
  {riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""},
  {riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""},
  {riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""},
  {riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""}
];
let projectRiskPlanningFilter={nearRailway:""};

const projectRiskPlanningOptions={
  riskType:["深基坑","盾构施工","临边洞口","大型机械","高支模","起重吊装","有限空间","管线迁改"],
  riskLevel:["I级风险","II级风险","III级风险","一般风险"],
  nearRailway:["是","否"],
  leader:["樊力栋","章爱云","李志强","王建国","赵明"]
};

function renderProjectRiskPlanningOptions(type,value,placeholder="请选择"){
  const options=projectRiskPlanningOptions[type] || [];
  return `<option value="">${placeholder}</option>${options.map(item=>`<option value="${item}" ${item===value?"selected":""}>${item}</option>`).join("")}`;
}

function updateProjectRiskPlanningRow(index,key,value){
  const row=projectRiskPlanningRows[index];
  if(!row)return;
  row[key]=value;
  if(key==="planStartDate" || key==="planEndDate"){
    row.duration=getProjectRiskPlanningDuration(row.planStartDate,row.planEndDate);
    renderProjectRiskPlanningTable();
  }
}

function getProjectRiskPlanningDuration(start,end){
  if(!start || !end)return "";
  const startDate=new Date(start);
  const endDate=new Date(end);
  if(Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))return "";
  const diff=Math.ceil((endDate.getTime()-startDate.getTime())/(24*60*60*1000))+1;
  return diff>0?String(diff):"";
}

function addProjectRiskPlanningRow(){
  projectRiskPlanningRows.push({riskType:"",riskName:"",riskLevel:"",nearRailway:"",planStartDate:"",planEndDate:"",leader:"",duration:"",riskDesc:""});
  renderProjectRiskPlanningTable();
}

function deleteProjectRiskPlanningRow(index){
  if(projectRiskPlanningRows.length<=1){
    showToast("至少保留一条风险筹划明细");
    return;
  }
  projectRiskPlanningRows.splice(index,1);
  renderProjectRiskPlanningTable();
}

function setProjectRiskPlanningFilter(value){
  projectRiskPlanningFilter.nearRailway=value;
  renderProjectRiskPlanningTable();
}

function renderProjectRiskPlanningTable(){
  const body=document.getElementById("projectRiskPlanningTableBody");
  if(!body)return;
  const displayRows=projectRiskPlanningRows
    .map((row,index)=>({row,index}))
    .filter(item=>!projectRiskPlanningFilter.nearRailway || item.row.nearRailway===projectRiskPlanningFilter.nearRailway);
  body.innerHTML=(displayRows.length?displayRows.map(({row,index},displayIndex)=>`
    <tr>
      <td>${displayIndex+1}</td>
      <td>
        <select class="select" onchange="updateProjectRiskPlanningRow(${index},'riskType',this.value)">
          ${renderProjectRiskPlanningOptions("riskType",row.riskType)}
        </select>
      </td>
      <td><input class="input" value="${row.riskName}" placeholder="请输入" oninput="updateProjectRiskPlanningRow(${index},'riskName',this.value)"/></td>
      <td>
        <select class="select" onchange="updateProjectRiskPlanningRow(${index},'riskLevel',this.value)">
          ${renderProjectRiskPlanningOptions("riskLevel",row.riskLevel)}
        </select>
      </td>
      <td>
        <select class="select" onchange="updateProjectRiskPlanningRow(${index},'nearRailway',this.value)">
          ${renderProjectRiskPlanningOptions("nearRailway",row.nearRailway,"未选择")}
        </select>
      </td>
      <td><input class="input" type="date" value="${row.planStartDate}" onchange="updateProjectRiskPlanningRow(${index},'planStartDate',this.value)"/></td>
      <td><input class="input" type="date" value="${row.planEndDate}" onchange="updateProjectRiskPlanningRow(${index},'planEndDate',this.value)"/></td>
      <td>
        <select class="select" onchange="updateProjectRiskPlanningRow(${index},'leader',this.value)">
          ${renderProjectRiskPlanningOptions("leader",row.leader,"请输入")}
        </select>
      </td>
      <td><div class="project-risk-duration-display">${row.duration?`${row.duration}天`:"-"}</div></td>
      <td><input class="input" value="${row.riskDesc}" placeholder="请输入" oninput="updateProjectRiskPlanningRow(${index},'riskDesc',this.value)"/></td>
      <td><a class="project-risk-delete" onclick="deleteProjectRiskPlanningRow(${index})">删除</a></td>
    </tr>
  `).join(""):`<tr><td colspan="11" class="empty-cell">暂无匹配的风险筹划明细</td></tr>`);
}

function openProjectRiskPlanningModal(){
  const html=`
    <div class="project-risk-planning-modal-body" style="min-width:1340px;">
      <div class="table-toolbar" style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div>
          <button class="btn primary" type="button" onclick="addProjectRiskPlanningRow()">＋ 新增</button>
        </div>
        <div>
          <select class="select" style="width:150px;" onchange="setProjectRiskPlanningFilter(this.value)">
            <option value="">是否临铁/临高速</option>
            <option value="是" ${projectRiskPlanningFilter.nearRailway==="是"?"selected":""}>是</option>
            <option value="否" ${projectRiskPlanningFilter.nearRailway==="否"?"selected":""}>否</option>
          </select>
        </div>
      </div>
      <table class="project-log-report-table">
        <thead>
          <tr>
            <th style="width:56px;">序号</th>
            <th style="width:150px;">风险类型</th>
            <th style="width:190px;">风险名称</th>
            <th style="width:110px;">风险等级</th>
            <th style="width:130px;">是否临铁/临高速</th>
            <th style="width:150px;">计划开始日期</th>
            <th style="width:150px;">计划完成日期</th>
            <th style="width:110px;">挂牌领导</th>
            <th style="width:150px;">计划持续天数</th>
            <th style="width:300px;">风险描述</th>
            <th style="width:80px;">操作</th>
          </tr>
        </thead>
        <tbody id="projectRiskPlanningTableBody"></tbody>
      </table>
    </div>
  `;
  openModal("风险筹划",html,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitProjectRiskPlanning()">保存并提交</button>
    <button class="btn primary" onclick="saveProjectRiskPlanning()">保存</button>
  `,"large");
  modalBox.classList.add("project-risk-planning-modal");
  renderProjectRiskPlanningTable();
}

function saveProjectRiskPlanning(){
  showToast("风险筹划已保存");
}

function submitProjectRiskPlanning(){
  getCurrentProjectPlanningCompletedKeys().add("risk");
  closeModal();
  renderProjectOverallPlanningPage();
  showToast("风险筹划已保存并提交");
}

function renderProjectOverallPlanningPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const requiredModules=projectPlanningModules.filter(item=>item.required);
  const completedCount=requiredModules.filter(item=>getProjectPlanningStatus(item)==="done").length;
  const canSubmit=completedCount===requiredModules.length;
  const project=getCurrentProjectContext();
  listPage.innerHTML=`
    <div class="project-overall-planning-page">
      <div class="compact-title-row project-page-title-row project-planning-head">
        <div class="module-title">工程总体筹划</div>
        <div class="project-planning-head-actions">
          <span>已筹划<b>76</b>天，已确认完成筹划<b>${completedCount}</b>项</span>
          <button class="btn primary" ${canSubmit?"":"disabled"} onclick="submitProjectOverallPlanning()">✈ 发起审批</button>
          <button class="btn" onclick="showToast('工程总体筹划预览已生成')">👁 预览</button>
        </div>
      </div>
      <section class="project-overview-project-card actual-output-project-card project-planning-project-card">
        <h2>${project?.projectName||"-"}</h2>
        <div class="actual-output-tags project-overview-tags">
          ${renderActualOutputDetailTag(project?.projectStatus||"-",project?.projectStatus==="停工"?"red":project?.projectStatus==="完工"?"blue":"green")}
          ${renderActualOutputDetailTag(project?.projectType||"-","blue")}
          ${renderActualOutputDetailTag(project?.region||"-","green")}
          ${renderActualOutputDetailTag("集团一体化管理模式","blue")}
          ${renderActualOutputDetailTag(project?.controlLevel||"-","red")}
          ${renderActualOutputDetailTag(project?.implementationMode||"-","green")}
        </div>
        <div class="project-planning-info-grid">
          ${renderActualOutputDetailField("子公司",project?.subCompany)}
          ${renderActualOutputDetailField("分公司/项管部",project?.branchCompany)}
          ${renderActualOutputDetailField("子公司分管领导","李四")}
          ${renderActualOutputDetailField("分公司分管领导","张三")}
          ${renderActualOutputDetailField("项目经理",project?.projectManager)}
        </div>
      </section>
      <section class="project-planning-grid">
        ${projectPlanningModules.map(renderProjectPlanningModule).join("")}
      </section>
    </div>
  `;
}

function completeProjectPlanningModule(key){
  const module=projectPlanningModules.find(item=>item.key===key);
  if(!module)return;
  if(module.status==="future"){
    showToast("该筹划模块暂未开放");
    return;
  }
  if(key==="constructionWaste"){
    openProjectConstructionWastePlanningModal();
    return;
  }
  if(key==="risk"){
    openProjectRiskPlanningModal();
    return;
  }
  getCurrentProjectPlanningCompletedKeys().add(key);
  renderProjectOverallPlanningPage();
  showToast(`${module.title}已完成筹划`);
}

function submitProjectOverallPlanning(){
  const requiredModules=projectPlanningModules.filter(item=>item.required);
  const completedCount=requiredModules.filter(item=>getProjectPlanningStatus(item)==="done").length;
  if(completedCount!==requiredModules.length){
    showToast("请先完成全部必填筹划模块");
    return;
  }
  showToast("工程总体筹划已发起审批");
}

const projectOverviewImages=[
  {type:"image",title:"工程现场形象",src:"./src/assets/project-log-building.png"},
  {type:"drawing",title:"非开挖修复工程设计图"},
  {type:"image",title:"施工工区形象",src:"./src/assets/project-log-building.png"}
];
let projectOverviewImageIndex=0;

function renderProjectOverviewImageViewer(){
  const item=projectOverviewImages[projectOverviewImageIndex]||projectOverviewImages[0];
  return `
    <div class="project-image-viewer">
      <button class="project-image-viewer-nav prev" type="button" onclick="changeProjectOverviewImage(-1)">‹</button>
      <div class="project-image-viewer-stage">
        ${item.type==="image"
          ?`<img src="${item.src}" alt="${item.title}"/>`
          :`<div class="project-image-viewer-drawing"><span>设计图纸</span></div>`
        }
      </div>
      <button class="project-image-viewer-nav next" type="button" onclick="changeProjectOverviewImage(1)">›</button>
      <div class="project-image-viewer-caption">${projectOverviewImageIndex+1}/${projectOverviewImages.length} ${item.title}</div>
    </div>
  `;
}

function openProjectOverviewImageViewer(index){
  projectOverviewImageIndex=Math.max(0,Math.min(projectOverviewImages.length-1,Number(index)||0));
  openModal("工程形象",renderProjectOverviewImageViewer(),`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("project-image-viewer-modal");
}

function changeProjectOverviewImage(delta){
  projectOverviewImageIndex=(projectOverviewImageIndex+delta+projectOverviewImages.length)%projectOverviewImages.length;
  const viewer=document.querySelector(".project-image-viewer");
  if(viewer)viewer.outerHTML=renderProjectOverviewImageViewer();
}

function renderProjectOverviewPage(){
  detailPage.style.display="none";
  listPage.style.display="block";
  const progressNodes=[
    {name:"实际开工",date:"02-01",year:"2025年",status:"active"},
    {name:"桩桥工程",date:"2025-03-11",status:"done",flag:true},
    {name:"桩桥工程",date:"2025-05-01（变更）",status:"normal",flag:true},
    {name:"道路摊铺",date:"2025-07-01",status:"normal"},
    {name:"计划完工",date:"10-01",year:"2025年",status:"future"},
    {name:"交工验收",date:"2025-11-10",status:"normal"},
    {name:"计划竣工",date:"12-19",year:"2025年",status:"future"}
  ];
  const outputNodes=[
    {name:"实际：3,234.11万元",date:"2025年1季度",status:"done"},
    {name:"实际：3,234.11万元",date:"2025年2季度",status:"done"},
    {name:"实际：3,234.11万元",date:"2025年3季度",status:"more"},
    {name:"计划：4,000.00万元",date:"2025年4季度",status:"normal"},
    {name:"计划：4,000.00万元",date:"2026年1季度",status:"normal"},
    {name:"计划：4,000.00万元",date:"2026年2季度",status:"normal"}
  ];
  const riskItems=[["I 级风险","2","0","1"],["II 风险","6","1","0"],["III 风险","8","2","2"]];
  const safetyStats=[["隐患整改","100.0","%"],["每日监管","100.0","%"],["视频监控","11","个"],["整改及时率","100.0","%"],["关键步骤完成率","100.0","%"],["在线率","100.0","%"],["重复隐患","3","个"],["计划填报率","100.0","%"],["AI点位","3","个"]];
  const project=getCurrentProjectContext();
  const seed=Number(project?.id)||1;
  const registeredManagers=18+seed%9;
  const onsiteManagers=Math.max(6,registeredManagers-7-seed%4);
  const registeredWorkers=168+(seed*17)%140;
  const onsiteWorkers=52+(seed*11)%76;
  const totalPlan=Number(project?.projectCost)||82540;
  const completionRate=project?.projectStatus==="完工"?100:project?.projectStatus==="停工"?38.6:55+(seed*7)%36;
  const totalOutput=totalPlan*completionRate/100;
  listPage.innerHTML=`
    <div class="project-overview-dashboard-page">
      <section class="project-overview-project-card actual-output-project-card">
        <h2>${project?.projectName||"-"}</h2>
        <div class="actual-output-tags project-overview-tags">
          ${renderActualOutputDetailTag(project?.projectStatus||"-",project?.projectStatus==="停工"?"red":project?.projectStatus==="完工"?"blue":"green")}
          ${renderActualOutputDetailTag(project?.projectType||"-","blue")}
          ${renderActualOutputDetailTag(project?.controlLevel||"-","red")}
          ${renderActualOutputDetailTag(project?.implementationMode||"-","green")}
          ${renderActualOutputDetailTag(project?.provinceCity?.split("/")[0]||"-","green")}
          ${renderActualOutputDetailTag(project?.keyCustomer||"无","pink")}
          ${renderActualOutputDetailTag("安全纳管","blue")}
        </div>
        <div class="actual-output-basic-grid project-overview-basic-grid">
          ${renderActualOutputDetailField("施工编号",project?.projectCode)}
          ${renderActualOutputDetailField("子公司",project?.subCompany)}
          ${renderActualOutputDetailField("分公司",project?.branchCompany)}
          ${renderActualOutputDetailField("项目经理",project?.projectManager)}
        </div>
      </section>

      <section class="project-overview-grid">
        <div class="project-overview-card project-progress-card">
          <div class="project-card-title"><h3>工程进度</h3><button>2025年 ▾</button></div>
          <div class="project-progress-section">
            <span class="project-progress-label blue">进度</span>
            <div class="project-progress-summary">已施工 <b>415</b> 天，2025年里程碑节点 <b>7</b> 个，已完成 <b>1</b> 个，延期 <em>40</em> 天</div>
            <button class="project-progress-select">已选7个节点 ▾</button>
            <div class="project-progress-line">
              ${progressNodes.map(node=>`
                <div class="project-progress-node ${node.status}">
                  <i>${node.status==="active"?"实际<br/>开工":node.status==="done"?"✓":node.status==="future"?(node.name==="计划完工"?"计划<br/>完工":"计划<br/>竣工"):"▣"}</i>
                  <strong>${node.name}${node.flag?`<span></span>`:""}</strong>
                  <small>${node.date}</small>
                  ${node.year?`<em>${node.year}</em>`:""}
                </div>
              `).join("")}
            </div>
          </div>
          <div class="project-progress-section output">
            <span class="project-progress-label green">产值</span>
            <div class="project-progress-summary">开累产值完成率 <b class="green">${completionRate.toFixed(1)}%</b>，2026年年累产值完成率 <b>${Math.max(0,completionRate-8.5).toFixed(1)}%</b></div>
            <div class="project-output-total">
              <span>产值总完成 <b>${moneyWan(totalOutput.toFixed(2))}</b> 万元</span>
              <span>产值总计划 <b>${moneyWan(totalPlan.toFixed(2))}</b> 万元</span>
            </div>
            <div class="project-progress-line output-line">
              ${outputNodes.map(node=>`
                <div class="project-progress-node ${node.status}">
                  <i>${node.status==="done"?"✓":node.status==="more"?"···":"▣"}</i>
                  <strong>${node.name}</strong>
                  <small>${node.date}</small>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="project-overview-card project-image-card">
          <div class="project-card-title"><h3>工程形象</h3></div>
          <div class="project-image-grid">
            <button class="project-image-main" type="button" onclick="openProjectOverviewImageViewer(0)"><img src="./src/assets/project-log-building.png" alt="工程形象"/><span>▣ 全屏</span></button>
            <button class="project-image-drawing" type="button" onclick="openProjectOverviewImageViewer(1)"><span>▣ 全屏</span></button>
          </div>
          <div class="project-report-grid">
            <div><strong>日报</strong><b>今日已上报</b><em>2025-09-01</em><a>查看日报</a></div>
            <div><strong>周报</strong><span>▤</span><em>暂未启用</em></div>
            <div><strong>月报</strong><span>▤</span><em>暂未启用</em></div>
          </div>
        </div>

        <div class="project-overview-card project-finance-card">
          <div class="project-card-title"><h3>财经情况</h3><div><button class="active">开累</button><button>年度</button></div></div>
          <div class="project-finance-main">
            <span>对上合同产值 <b>产值 ▾</b></span>
            <strong>28,875.25<em> 万元</em></strong>
            <p>计划值 <b>38,432.94 万元</b></p>
            <div class="project-finance-bar"><i style="width:75.1%"></i><em>产值完成率<br/>75.1%</em></div>
            <footer>实际计量 <b>28,875.25 万元</b></footer>
          </div>
          <div class="project-finance-empty">
            <strong>对下合同计量</strong>
            <span>▭</span>
            <em>功能开发中</em>
          </div>
        </div>

        <div class="project-overview-card project-person-card">
          <div class="project-card-title"><h3>现场人员</h3><div><button class="active">按天</button><button>按时</button></div></div>
          <div class="project-person-body">
            <div class="project-person-stat">
              <div><span>管理<br/>人员</span><b>已登记 <strong>${registeredManagers}</strong>人</b><b>当前在场 <strong>${onsiteManagers}</strong>人</b><b>总包安全岗 <strong>${3+seed%5}</strong>人</b></div>
              <div><span class="blue">劳务<br/>人员</span><b>已登记 <strong>${registeredWorkers}</strong>人</b><b>当前在场 <strong>${onsiteWorkers}</strong>人</b><b>分包关键人员 <strong>${2+seed%6}</strong>人</b></div>
            </div>
            <div class="project-person-chart">
              <svg viewBox="0 0 520 210" preserveAspectRatio="none">
                ${[0,1,2,3,4].map(i=>`<line x1="30" y1="${20+i*40}" x2="510" y2="${20+i*40}" class="grid"/>`).join("")}
                <path d="M30 95 C105 50,150 50,210 75 S300 115,365 82 S455 65,510 58" class="line blue"/>
                <path d="M30 175 C95 145,150 160,225 158 S315 148,365 164 S455 162,510 145" class="line cyan"/>
                <path d="M30 95 C105 50,150 50,210 75 S300 115,365 82 S455 65,510 58 L510 188 L30 188 Z" class="area blue"/>
              </svg>
              <div class="project-person-tooltip"><b>2025-12-17</b><span><i></i>当前在场管理人员 12人</span><span><i class="purple"></i>当前在场劳务人员 77人</span></div>
              <div class="project-person-axis"><span>10-22</span><span>10-23</span><span>10-24</span><span>10-25</span><span>10-26</span><span>10-27</span></div>
            </div>
          </div>
        </div>

        <div class="project-overview-card project-risk-card">
          <div class="project-card-title"><h3>风险情况</h3><select><option>2025年</option></select></div>
          <div class="project-risk-list">
            ${riskItems.map(item=>`
              <div>
                <strong>${item[0]}</strong>
                <p><b>${item[1]}</b> 个 <em>未完成</em></p>
                <span><i></i>已完成 <b>${item[2]}</b> 个</span>
                <span><i class="orange"></i>未来两周进入 <b>${item[3]}</b> 个</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="project-overview-card project-safety-card">
          <div class="project-card-title"><h3>安全情况</h3></div>
          <div class="project-safety-body">
            <div class="project-safety-score">
              <span>当周安全可控指数</span>
              <strong>70.5 <em>分</em></strong>
              <b>基本可控</b>
            </div>
            <div class="project-safety-stats">
              ${safetyStats.map((item,index)=>`<div><span class="${index%3===0?"red":index%3===1?"blue":"green"}">${item[0]}</span><strong>${item[1]}<em>${item[2]}</em></strong></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="project-overview-card project-economy-card">
          <div class="project-card-title"><h3>经济情况</h3><button>2025-11 ▣</button></div>
          <div class="project-economy-body">
            <div class="project-economy-status">
              <h4>▣ 经济风险状态</h4>
              <div><span>一级预警</span><strong>1 个</strong></div>
              <div><span>二级预警雷数</span><strong>🟡 × 1</strong></div>
            </div>
            <div class="project-economy-warning"><strong>潜亏预警<br/>（目标利润率负向偏差）</strong></div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderProjectWorkspacePage(){
  renderProjectPageShell("工作桌面","项目人员处理待办、审批与消息的统一入口。",`
    <section class="project-workbench-grid">
      <div class="card project-workbench-card">
        <div class="card-hd"><div class="card-title">项目待办</div><button class="link" onclick="openTodoCenter()">全部</button></div>
        ${projectTodoData.map(x=>`<div class="project-task-row"><span>${x.module1}</span><strong>${x.title}</strong><em>${x.status}</em></div>`).join("")}
      </div>
      <div class="card project-workbench-card">
        <div class="card-hd"><div class="card-title">项目消息</div><button class="link" onclick="openMessageCenter()">全部</button></div>
        ${projectMessageData.map(x=>`<div class="project-task-row message"><span>${x.type}</span><strong>${x.title}</strong><em>${x.status}</em></div>`).join("")}
      </div>
      <div class="card project-workbench-card approval">
        <div class="card-hd"><div class="card-title">待审批</div></div>
        ${["施工日志补录审批","进度计划调整审批","合同付款节点确认","安全整改闭环审批"].map((x,i)=>`<div class="project-task-row"><span>审批</span><strong>${x}</strong><em>${i<2?"待处理":"已提交"}</em></div>`).join("")}
      </div>
    </section>
  `);
}

function renderProjectDetailField(label,value){
  return `<div class="project-detail-field"><span>${label}</span><strong>${value||"-"}</strong></div>`;
}

function renderProjectDetailSection(title,body,extraClass=""){
  return `
    <section class="project-detail-section ${extraClass}">
      <div class="project-detail-section-title">
        <h3>${title}</h3>
        <span>⌄</span>
      </div>
      ${body}
    </section>
  `;
}

function renderProjectDetailAttachment(name,type="pdf"){
  return `
    <button class="project-detail-attachment" type="button" onclick="showToast('${name}预览已打开')">
      <span class="${type}">${type==="ppt"?"P":"PDF"}</span>
      <strong>${name}</strong>
      <em>👁</em>
    </button>
  `;
}

function renderProjectDetailAddressCard(title){
  return `
    <div class="project-detail-address-card">
      <div class="project-detail-map">
        <div class="project-detail-map-line"></div>
        <div class="project-detail-map-pin">⌖</div>
      </div>
      <div class="project-detail-address-info">
        <h4>${title}</h4>
        <strong>📍 上海市闵行区联友路669号</strong>
        <div>
          <span>上海/上海市/闵行区<em>省市区</em></span>
          <span>66°33′38″ W<em>经度</em></span>
          <span>66°33′38″ N<em>纬度</em></span>
        </div>
      </div>
    </div>
  `;
}

function renderProjectDetailPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const project=getCurrentProjectContext();
  listPage.innerHTML=`
    <div class="project-detail-page-v218">
      <section class="project-detail-hero-card actual-output-project-card">
        <div class="project-detail-hero-top">
          <div>
            <h2>${project?.projectName||"-"}</h2>
            <div class="actual-output-tags project-overview-tags">
              ${renderActualOutputDetailTag(project?.projectStatus||"-",project?.projectStatus==="停工"?"red":project?.projectStatus==="完工"?"blue":"green")}
              ${renderActualOutputDetailTag(project?.projectType||"-","blue")}
              ${renderActualOutputDetailTag(project?.region||"-","green")}
              ${renderActualOutputDetailTag("集团一体化管理模式","blue")}
              ${renderActualOutputDetailTag(project?.controlLevel||"-","red")}
              ${renderActualOutputDetailTag(project?.implementationMode||"-","green")}
            </div>
          </div>
          <div class="project-detail-hero-actions">
            <span>🔔 开工提醒</span>
            <button class="btn primary" onclick="showToast('项目状态已切换为已纳管')">已纳管 ▾</button>
          </div>
        </div>
        <div class="project-detail-basic-grid">
          ${[
            ["项目简称",project?.projectName],
            ["项目名称",project?.projectName],
            ["子公司",project?.subCompany],
            ["分公司",project?.branchCompany],
            ["项目编号",project?.projectCode],
            ["生产业务类型",project?.productionBizType],
            ["计划开工日期",project?.planStart],
            ["计划完工日期",project?.planEnd],
            ["计划工期（天）",`${project?.planDuration||0}天`],
            ["实际开工日期",project?.actualStart||"-"],
            ["实际完工日期",project?.actualEnd||"-"],
            ["项目经理",`${project?.projectManager||"-"} | ${maskPhone(project?.managerPhone)}`]
          ].map(item=>renderProjectDetailField(item[0],item[1])).join("")}
        </div>
        <div class="project-detail-summary">
          <span>项目概况</span>
          <p>上海示范区线起自芳乐路站，向西接至未来乡客厅，主要沿规划芳乐路、北青公路、外青松公路、G50和G318走行，涉及地下非开挖修复、道路恢复及配套管线改造等内容。</p>
        </div>
      </section>

      ${renderProjectDetailSection("项目进度",`
        <div class="project-detail-progress-box">
          <div class="project-detail-progress-row progress">
            <b>进度</b>
            <div class="project-detail-progress-summary">已施工 <strong>415</strong> 天，工期进度 <strong>40.5%</strong>，延期 <em>40</em> 天</div>
            <div class="project-detail-timeline">
              ${[
                ["实际开工","08-01","2023年","done"],
                ["桩桥工程","10-01","2023年","done"],
                ["桥梁道路","10-01（变更）","2023年","active"],
                ["道路摊铺","03-01","2026年","future"],
                ["沥青摊铺","03-01","2026年","future"],
                ["计划竣工","09-01","2026年","future"]
              ].map(item=>`<div class="${item[3]}"><i>${item[3]==="done"?"✓":item[3]==="active"?"▣":"·"}</i><strong>${item[0]}</strong><span>${item[1]}</span><em>${item[2]}</em></div>`).join("")}
            </div>
          </div>
          <div class="project-detail-progress-row output">
            <b>产值</b>
            <div class="project-detail-progress-summary">产值完成率 <strong class="green">31.22%</strong></div>
            <div class="project-detail-timeline">
              ${[
                ["实际：3,234.11万元","2025年1季度","done"],
                ["实际：3,234.11万元","2025年2季度","done"],
                ["实际：3,234.11万元","2025年3季度","active"],
                ["计划：4,000.00万元","2025年4季度","future"],
                ["计划：4,000.00万元","2026年1季度","future"],
                ["计划：4,000.00万元","2026年2季度","future"]
              ].map(item=>`<div class="${item[2]}"><i>${item[2]==="done"?"✓":item[2]==="active"?"▣":"·"}</i><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join("")}
            </div>
            <aside><span>产值总完成 <strong>${moneyWan(project?.accumulatedOutput)}</strong> 万元</span><span>产值总计划 <strong>${moneyWan(project?.projectCost)}</strong> 万元</span></aside>
          </div>
        </div>
      `)}

      ${renderProjectDetailSection("项目管理",`
        <div class="project-detail-info-grid">
          ${[
            ["总包单位",project?.totalContractor],
            ["建设单位",project?.builder],
            ["设计单位","上海市城市建设设计研究总院（集团）有限公司"],
            ["监理单位","上海市建设工程监理咨询有限公司"],
            ["勘察单位","上海市建设工程监理咨询有限公司"],
            ["子公司分管领导","张三 | 18090809992"],
            ["分公司分管领导","万三 | 13690809111"],
            ["项目经理",`${project?.projectManager||"-"} | ${maskPhone(project?.managerPhone)}`]
          ].map(item=>renderProjectDetailField(item[0],item[1])).join("")}
        </div>
      `)}

      ${renderProjectDetailSection("地理信息",`
        <div class="project-detail-geo-grid">
          <div class="project-detail-image-panel">
            <h4>工程效果（平面）图</h4>
            <div class="project-detail-image-main">
              <img src="./src/assets/project-log-building.png" alt="工程效果图"/>
              <button type="button" onclick="openProjectOverviewImageViewer(0)">全屏</button>
            </div>
            <div class="project-detail-thumbs">
              <img src="./src/assets/project-log-building.png" alt="缩略图"/>
              <span>图纸</span>
              <span>图纸</span>
            </div>
          </div>
          <div class="project-detail-address-list">
            ${renderProjectDetailAddressCard("项目地址")}
            ${renderProjectDetailAddressCard("办公地址")}
          </div>
        </div>
      `,"open")}

      ${renderProjectDetailSection("股份一体化管理信息",`
        <div class="project-detail-info-grid two">
          ${renderProjectDetailField("一体化管理主体单位","上海真如城市副中心开发建设投资有限公司")}
          ${renderProjectDetailField("一体化管理负责人","陈晓农")}
        </div>
        <div class="project-detail-attachment-grid">
          <div><h4>一体化管理相关附件</h4>${renderProjectDetailAttachment("一体化管理相关附件.pdf")}</div>
          <div><h4>一体化内部协议</h4>${renderProjectDetailAttachment("一体化管理相关附件.pdf")}</div>
          <div><h4>一体化考核责任书</h4>${renderProjectDetailAttachment("一体化管理相关附件.pdf")}</div>
        </div>
      `)}

      ${renderProjectDetailSection("中标信息",`
        <div class="project-detail-subtitle">${project?.projectName||"-"} ${renderActualOutputDetailTag("备案制订单","orange")}</div>
        <div class="project-detail-info-grid">
          ${[
            ["股份项目编号",project?.orderProjectNo],
            ["子公司管理单位",project?.subCompany],
            ["子公司法人单位",project?.subCompany],
            ["业主单位",project?.builder],
            ["中标日期",project?.approvalDate],
            ["中标价（预估价）",`${moneyWan(project?.projectCost)}万元`]
          ].map(item=>renderProjectDetailField(item[0],item[1])).join("")}
        </div>
        <div class="project-detail-attachment-grid small">
          <div><h4>中标通知书</h4>${renderProjectDetailAttachment("中标通知书.pdf")}</div>
        </div>
      `)}

      ${renderProjectDetailSection("立项信息",`
        <div class="project-detail-info-grid">
          ${[
            ["生产项目编号","SUCG2025009109"],
            ["子公司项目编号","2025精神 · 人民币"],
            ["项目造价（元）","1366940.20元"],
            ["业务分类","重点业务"],
            ["业务板块","核心业务"],
            ["业务板块二级","主业以外业务"],
            ["业务板块三级","市政基础设施工程建设总承包及设施更新"],
            ["所属核心区域","上海"],
            ["所属核心城市","-"]
          ].map(item=>renderProjectDetailField(item[0],item[1])).join("")}
        </div>
      `)}

      ${renderProjectDetailSection("总包合同",`
        <div class="project-detail-info-grid">
          ${[
            ["合同编号","HT-20250908121213"],
            ["合同甲方","上海真如城市副中心开发建设投资有限公司"],
            ["合同乙方","上海城市环境集团有限公司"],
            ["合同项目经理","万三 | 13690809111"],
            ["合同签订日期","2025-10-10"],
            ["合同开工日期","2025-10-10"],
            ["合同竣工日期","2025-10-10"],
            ["合同工期","365天"],
            ["是否多税率","否"],
            ["总包合同价（含税）","15,022,365.00元"],
            ["税率","6.00%"],
            ["总包合同价（不含税）","15,022,365.00元"],
            ["税金（元）","15,022,365.00元"],
            ["可转化产值（元）","15,022,365.00元"],
            ["可转化营收（元）","15,022,365.00元"]
          ].map(item=>renderProjectDetailField(item[0],item[1])).join("")}
        </div>
        <div class="project-detail-attachment-grid small">
          <div><h4>盖章版总包合同和相关附件</h4>${renderProjectDetailAttachment("中标通知书.pdf")}${renderProjectDetailAttachment("总包合同.pdf","ppt")}</div>
        </div>
      `)}

      ${renderProjectDetailSection("施工许可证",`
        <div class="project-detail-attachment-grid small">
          <div><h4>施工许可证</h4>${renderProjectDetailAttachment("中标通知书.pdf")}${renderProjectDetailAttachment("总包合同.pdf","ppt")}</div>
        </div>
      `)}

      ${renderProjectDetailSection("项目特征",`
        <div class="project-detail-feature-tags">
          <span class="green">✓ 市政板块</span>
          <span class="blue">✓ 公路板块</span>
          <span class="red">↑ 隧道板块</span>
        </div>
      `,"open")}

      ${renderProjectDetailSection("关联核算项目",`
        <div class="project-detail-subtitle">${project?.projectName||"-"}</div>
        <div class="project-detail-info-grid three">
          ${renderProjectDetailField("核算项目编号",project?.productionProjectNo)}
          ${renderProjectDetailField("基层单位",project?.branchCompany)}
          ${renderProjectDetailField("基层单位编号",`Org${String(project?.id||0).padStart(6,"0")}`)}
        </div>
      `)}
    </div>
  `;
}

function renderProjectLogPage(){
  normalizeProjectLogAreaFilter();
  const rows=getProjectLogPagedRows();
  const areas=getProjectLogFilterAreas();
  renderProjectPageShell("施工日志","",`
    <div class="project-log-template-page">
      <section class="card project-log-list-panel">
        <div class="project-log-panel-head">
          <h3>施工日志列表</h3>
          <div class="actions">
            <button class="btn project-log-action-btn online" onclick="openProjectLogReportModal()">在线上报</button>
            <button class="btn project-log-action-btn file" onclick="openProjectLogFileReportModal()">文件上报</button>
            <button class="btn" onclick="exportFilteredProjectLogs()">导出</button>
          </div>
        </div>
        <div class="project-log-filter-row">
          <label class="project-log-filter-item">
            <span>施工工区</span>
            <select id="projectLogArea" class="select" onchange="queryProjectLogs()">
              <option value="">全部</option>
              ${areas.map(area=>`<option value="${escapeAttr(area)}" ${projectLogState.workArea===area?"selected":""}>${escapeAttr(area)}</option>`).join("")}
            </select>
          </label>
          <label class="project-log-filter-item project-log-date-filter">
            <span>上报日期</span>
            <div>
              <input id="projectLogStart" class="input" type="date" value="${projectLogState.startDate}"/>
              <em>-</em>
              <input id="projectLogEnd" class="input" type="date" value="${projectLogState.endDate}"/>
            </div>
          </label>
          <label class="project-log-filter-item">
            <span>关键内容</span>
            <input id="projectLogKeyword" class="input" value="${projectLogState.keyword}" placeholder="请输入施工日志内容关键字" onkeydown="if(event.key==='Enter')queryProjectLogs()"/>
          </label>
          <button class="btn primary" data-project-log-action="query" onclick="queryProjectLogs()">查询</button>
          <button class="btn" data-project-log-action="reset" onclick="resetProjectLogs()">重置</button>
        </div>
        <div class="project-log-filter-row project-log-mode-filter-row">
          <label class="project-log-filter-item">
            <span>上报方式</span>
            <select id="projectLogMode" class="select" onchange="queryProjectLogs()">
              <option value="">全部</option>
              <option value="online" ${projectLogState.mode==="online"?"selected":""}>在线上报</option>
              <option value="file" ${projectLogState.mode==="file"?"selected":""}>文件上报</option>
              <option value="merged" ${projectLogState.mode==="merged"?"selected":""}>在线+文件</option>
            </select>
          </label>
        </div>
        <div class="project-log-card-grid">
          ${rows.map(renderProjectLogCard).join("")}
        </div>
        ${renderProjectLogPagination()}
      </section>
      <aside class="project-log-right-panel">
        ${renderProjectLogCalendar()}
      </aside>
    </div>
  `);
  bindProjectLogControls();
}

async function exportFilteredProjectLogs(){
  const rows=getProjectLogFilteredRows();
  if(!rows.length){
    showToast("当前筛选条件下暂无可导出的施工日志");
    return;
  }
  try{
    const result=await exportConstructionLogRecords(rows,{
      projectName:pcPortalState.currentProject,
      detailBuilder:getProjectLogReadonlyOnlineDetail,
      completedMilestones:typeof getProjectLogCompletedMilestoneRows==="function"?getProjectLogCompletedMilestoneRows():[]
    });
    showToast(result.type==="multi-day-zip"?`已导出 ${result.days} 天施工日志压缩包`:`已导出 ${result.count} 个施工日志文件`);
  }catch(error){
    console.error("筛选施工日志导出失败",error);
    showToast("施工日志导出失败，请稍后重试");
  }
}

function bindProjectLogControls(){
  const queryBtn=document.querySelector('[data-project-log-action="query"]');
  const resetBtn=document.querySelector('[data-project-log-action="reset"]');
  if(queryBtn)queryBtn.onclick=event=>{
    event.preventDefault();
    queryProjectLogs();
  };
  if(resetBtn)resetBtn.onclick=event=>{
    event.preventDefault();
    resetProjectLogs();
  };
  document.querySelectorAll('[data-project-log-date]').forEach(button=>{
    button.onclick=()=>selectProjectLogDate(button.dataset.projectLogDate);
  });
}

Object.assign(window,{
  changeProjectLogPage,
  changeProjectLogMonth,
  changeProjectLogYear,
  selectProjectLogDate,
  queryProjectLogs,
  resetProjectLogs,
  completeProjectPlanningModule,
  submitProjectOverallPlanning,
  openProjectConstructionWastePlanningModal,
  saveProjectConstructionWastePlanning,
  submitProjectConstructionWastePlanning,
  openProjectRiskPlanningModal,
  addProjectRiskPlanningRow,
  deleteProjectRiskPlanningRow,
  updateProjectRiskPlanningRow,
  saveProjectRiskPlanning,
  submitProjectRiskPlanning,
  renderProjectMilestoneNodeTable,
  queryProjectMilestoneNode,
  resetProjectMilestoneNode,
  setProjectMilestoneStat,
  changeProjectMilestoneNodePage,
  changeProjectMilestoneNodePageSize,
  renderProjectRiskControlTable,
  queryProjectRiskControl,
  resetProjectRiskControl,
  setProjectRiskControlStat,
  changeProjectRiskControlPage,
  changeProjectRiskControlPageSize,
  renderProjectAwardManagementTable,
  queryProjectAwardManagement,
  resetProjectAwardManagement,
  setProjectAwardStat,
  changeProjectAwardManagementPage,
  changeProjectAwardManagementPageSize,
  renderProjectTechSchemeTable,
  queryProjectTechScheme,
  resetProjectTechScheme,
  setProjectTechSchemeStat,
  changeProjectTechSchemePage,
  changeProjectTechSchemePageSize,
  toggleProjectSideGroup,
  selectProjectChildMenu,
  openProjectOverviewImageViewer,
  changeProjectOverviewImage,
  openProjectLogDetail,
  openProjectLogReportModal,
  openProjectLogFileReportModal,
  submitProjectLogReport,
  submitProjectLogFileReport,
  addProjectLogWorkRow,
  removeProjectLogWorkRow,
  handleProjectLogPhotoFiles,
  removeProjectLogPhoto,
  handleProjectLogFileFiles,
  removeProjectLogFile,
  addProjectLogFileReportRow,
  removeProjectLogFileReportRow,
  syncProjectLogFileReportRow
});

function renderProjectPlaceholderPage(title){
  renderProjectPageShell(title,`${title}项目端菜单已预留，后续按项目人员工作流配置功能。`,`
    <section class="project-placeholder">
      <div>
        <strong>${title}</strong>
        <p>当前为项目管理端占位页面，后续将按项目级数据权限、项目人员角色和移动端协同场景继续扩展。</p>
      </div>
    </section>
  `);
}

