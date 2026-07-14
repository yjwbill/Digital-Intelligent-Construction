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

function renderPcContextSwitcher(){
  const label=document.querySelector(".org-label");
  const name=document.getElementById("currentOrgName");
  const dropdown=document.querySelector(".org-dropdown");
  if(!label||!name||!dropdown)return;
  if(pcPortalState.mode==="project"){
    const currentProject=getCurrentProjectContext();
    const projects=getProjectContextOptions();
    label.textContent="【项目】";
    name.textContent=currentProject?.projectName||pcPortalState.currentProject;
    dropdown.innerHTML=`
      <div class="org-dropdown-title">切换项目</div>
      ${projects.map(project=>`
        <div class="org-option ${String(project.id)===String(currentProject?.id)?"active":""}" onclick="selectProjectContext(event,'${escapeAttr(project.id)}')">
          <div>
            <div class="org-name">${project.projectName}</div>
            <div class="org-desc">${project.subCompany} · ${project.branchCompany} · ${project.projectStatus}</div>
          </div>
          <span class="org-check">✓</span>
        </div>
      `).join("")}
    `;
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
          <div class="org-option ${index===0?"active":""}" onclick="selectOrg(event,'${item.name}')">
            <div><div class="org-name">${item.name}</div><div class="org-desc">${desc}</div></div>
            <span class="org-check">✓</span>
          </div>
        `;
      }).join("")}
    `;
  }
}

function getProjectContextOptions(){
  return Array.isArray(constructionProjectData)?constructionProjectData.slice(0,38):[];
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
  pageSize:12,
  month:"2026-07",
  selectedDate:"2026-07-13",
  workArea:"",
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

function getCurrentProjectLogProject(){
  return getCurrentProjectContext();
}

function getProjectLogRows(){
  const project=getCurrentProjectLogProject();
  if(!project)return projectLogCustomRows;
  const generated=["2026-06","2026-07"].flatMap(monthValue=>{
    const meta=getEnterpriseConstructionLogMonthMetaByValue(monthValue);
    return Array.from({length:meta.days},(_,index)=>index+1)
      .filter(day=>getEnterpriseConstructionLogDayStateForMonth(project,day,monthValue)==="reported")
      .map(day=>getEnterpriseConstructionLogReportRecord(project,day,monthValue));
  });
  return [...projectLogCustomRows.filter(row=>row.projectName===project.projectName),...generated]
    .filter((row,index,rows)=>rows.findIndex(item=>item.date===row.date)===index)
    .sort((a,b)=>b.date.localeCompare(a.date));
}
let projectLogReportPhotoList=[];
let projectLogReportFileList=[];

function getProjectLogFilteredRows(){
  return getProjectLogRows().filter(row=>{
    if(!row.date.startsWith(projectLogState.month+"-"))return false;
    if(projectLogState.workArea&&row.workArea!==projectLogState.workArea)return false;
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
  return `
    <button class="project-log-report-card ${row.mode}" data-project-log-detail="${row.id}" onclick="openProjectLogDetail('${escapeAttr(row.id)}')">
      <span class="project-log-mode ${row.mode}">${row.mode==="online"?"在线上报":"文件上报"}</span>
      ${row.mode==="online"?`
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
    </button>
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
        <select class="select mini-select" onchange="projectLogState.pageSize=Number(this.value)||12;projectLogState.page=1;renderProjectLogPage()">
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
  for(let i=offset-1;i>=0;i--)days.push({day:prevDays-i,muted:true});
  for(let day=1;day<=totalDays;day++){
    const date=`${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const project=getCurrentProjectLogProject();
    const customReported=projectLogCustomRows.some(row=>row.projectName===project?.projectName&&row.date===date);
    const status=customReported?"reported":getEnterpriseConstructionLogDayStateForMonth(project,day,projectLogState.month);
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
            <strong class="${row.mode}">${row.mode==="online"?"在线上报":"文件上报"}</strong>
            <p>施工区域：${row.workArea}</p>
            <p>上传人：${row.uploader}</p>
            <p>上传时间：${row.uploadTime}</p>
          </div>
          ${row.mode==="online"?`<img src="${row.cover || "./src/assets/project-log-building.png"}" alt="${row.title}"/>`:`<span class="project-log-day-file">PDF</span>`}
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
  projectLogState.selectedDate=getFirstUploadedProjectLogDate();
  renderProjectLogPage();
}

function changeProjectLogYear(delta){
  const [year,month]=projectLogState.month.split("-").map(Number);
  projectLogState.month=`${year+delta}-${String(month).padStart(2,"0")}`;
  projectLogState.selectedDate=getFirstUploadedProjectLogDate();
  renderProjectLogPage();
}

function selectProjectLogDate(date){
  projectLogState.selectedDate=date;
  renderProjectLogPage();
}

function queryProjectLogs(){
  projectLogState.workArea=document.getElementById("projectLogArea")?.value || "";
  projectLogState.startDate=document.getElementById("projectLogStart")?.value || "";
  projectLogState.endDate=document.getElementById("projectLogEnd")?.value || "";
  projectLogState.keyword=document.getElementById("projectLogKeyword")?.value.trim() || "";
  projectLogState.page=1;
  renderProjectLogPage();
}

function resetProjectLogs(){
  projectLogState.workArea="";
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
  return {
    temperature:`${22+variation}℃`,
    weather:variation===2?"小雨":"晴",
    weatherImpact:variation===2?"是":"否",
    personnel:[
      ["总包管理人员",String(20+variation)],
      ["分包管理人员",String(11+variation)],
      ["劳务人员",String(36+variation*3)]
    ],
    today:[{area:row.workArea,content:row.summary,progress:`${82+variation*3}%`,remark:"现场材料、机具及安全防护检查正常"}],
    tomorrow:[{area:row.workArea,content:"继续开展主体结构施工及现场安全巡查",progress:"90%",remark:"提前落实材料进场计划"}],
    risks:[
      ["风险类型","深基坑开挖","风险名称","附属结构土方开挖","风险等级","II级","是否完成","否","是否受控","是","风险情况","现场监测数据正常，风险处于受控状态"],
      ["风险类型","承重支模架","风险名称","主体结构模板支撑","风险等级","II级","是否完成","否","是否受控","是","风险情况","按专项方案组织施工，验收记录齐全"]
    ],
    photos:[{name:row.title,url:row.cover || "./src/assets/project-log-building.png"}],
    stop:variation===3?"因短时降雨暂停室外作业2小时，已完成复工安全检查。":"无停工情况。"
  };
}

function renderProjectLogReadonlyWorkTable(rows,showProgress=true){
  return `
    <table class="project-log-report-table project-log-readonly-work-table">
      <thead><tr><th>序号</th><th>施工工区</th><th>工作内容</th>${showProgress?"<th>工作进度</th>":""}<th>备注</th></tr></thead>
      <tbody>${rows.map((item,index)=>`<tr><td>${index+1}</td><td>${item.area}</td><td>${item.content}</td>${showProgress?`<td>${item.progress}</td>`:""}<td>${item.remark||"-"}</td></tr>`).join("")}</tbody>
    </table>
  `;
}

function renderProjectLogReadonlyRiskCards(risks){
  return `<div class="project-log-readonly-risk-list">
    ${risks.map(risk=>`
      <div class="project-log-readonly-risk-card project-detail-info-grid three">
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
        <div><strong>${escapeAttr(file.name)}</strong><span>${file.sizeText||"-"}</span></div>
      </div>
    `).join("")}
  </div>`;
}

function renderProjectLogReadonlyBaseInfo(row,projectName){
  if(row.mode==="file")return `
    <div class="project-detail-info-grid">
      ${renderProjectLogReadonlyField("工区",row.workArea)}
      ${renderProjectLogReadonlyField("日期",row.date)}
    </div>
  `;
  const detail=getProjectLogReadonlyOnlineDetail(row);
  return `
    <div class="project-detail-info-grid">
      ${renderProjectLogReadonlyField("项目名称",projectName)}
      ${renderProjectLogReadonlyField("工区",row.workArea)}
      ${renderProjectLogReadonlyField("日期",row.date)}
      ${renderProjectLogReadonlyField("星期",getProjectLogReadonlyWeekday(row.date))}
      ${renderProjectLogReadonlyField("温度",detail.temperature)}
      ${renderProjectLogReadonlyField("天气是否影响工作",detail.weatherImpact)}
      ${renderProjectLogReadonlyField("记录人姓名",row.uploader)}
      ${renderProjectLogReadonlyField("上报时间",row.uploadTime)}
    </div>
  `;
}

function openProjectLogDetail(id){
  const row=getProjectLogRows().find(item=>String(item.id)===String(id));
  if(!row)return;
  const baseInfo=renderProjectLogReadonlyBaseInfo(row,pcPortalState.currentProject);
  const content=row.mode==="online"?(()=>{
    const detail=getProjectLogReadonlyOnlineDetail(row);
    return `
      ${renderProjectLogReadonlySection("基础信息",baseInfo)}
      ${renderProjectLogReadonlySection("人员信息",`<div class="project-detail-info-grid three">${detail.personnel.map(item=>renderProjectLogReadonlyField(item[0],`${item[1]}人`)).join("")}</div>`)}
      ${renderProjectLogReadonlySection("今日主要工作",renderProjectLogReadonlyWorkTable(detail.today))}
      ${renderProjectLogReadonlySection("明日主要工作",renderProjectLogReadonlyWorkTable(detail.tomorrow,false))}
      ${renderProjectLogReadonlySection("风险情况",renderProjectLogReadonlyRiskCards(detail.risks))}
      ${renderProjectLogReadonlySection("施工照片",renderProjectLogReadonlyPhotos(detail.photos))}
      ${renderProjectLogReadonlySection("发生停工情况",`<div class="project-log-readonly-text">${detail.stop}</div>`)}
    `;
  })():`
    ${renderProjectLogReadonlySection("基础信息",baseInfo)}
    ${renderProjectLogReadonlySection("施工日志文件",renderProjectLogReadonlyFiles(getProjectLogReadonlyFiles(row)))}
    ${renderProjectLogReadonlySection("备注说明",`<div class="project-log-readonly-text">${row.summary||"-"}</div>`)}
  `;
  openModal("施工日志详情",`<div class="project-log-readonly-detail">${content}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("project-log-online-report-modal");
}

function renderProjectLogWorkAreaOptions(value=""){
  const areas=[...new Set(getProjectLogRows().map(row=>row.workArea))];
  return `<option value="">请选择工区</option>${areas.map(area=>`<option value="${escapeAttr(area)}" ${area===value?"selected":""}>${area}</option>`).join("")}`;
}

function renderProjectLogWorkTable(type="today"){
  const isToday=type==="today";
  const rows=isToday?[{
    area:"主体结构区",
    content:"完成钢筋绑扎、模板加固及现场安全巡查",
    progress:"85",
    remark:"现场材料已完成验收"
  }]:[];
  const columnCount=isToday?6:5;
  const emptyRow=`
    <tr class="project-log-report-empty-row"><td colspan="${columnCount}">暂无数据</td></tr>
  `;
  return `
    <div class="project-log-report-table-head">
      <span>工作内容${isToday?'<em>*</em>':""}</span>
      <button class="btn primary small" onclick="addProjectLogWorkRow('${type}')">添加</button>
    </div>
    <table class="project-log-report-table">
      <thead>
        <tr><th>序号</th><th>施工工区</th><th>工作内容</th>${isToday?"<th>工作进度</th>":""}<th>备注</th><th>操作</th></tr>
      </thead>
      <tbody id="projectLogWorkTbody-${type}">
        ${rows.length?rows.map((row,index)=>renderProjectLogWorkRow(type,row,index)).join(""):emptyRow}
      </tbody>
    </table>
  `;
}

function renderProjectLogWorkRow(type,row={},index=0){
  const isToday=type==="today";
  return `
    <tr class="project-log-report-work-row" data-project-log-work-type="${type}">
      <td class="project-log-work-index">${index+1}</td>
      <td><select class="select project-log-work-area">${renderProjectLogWorkAreaOptions(row.area || "")}</select></td>
      <td><input class="input project-log-work-content" value="${escapeAttr(row.content || "")}" placeholder="请输入工作内容"/></td>
      ${isToday?`<td><div class="project-log-percent-input"><input class="input project-log-work-progress" type="number" min="0" max="100" value="${escapeAttr(row.progress || "")}" placeholder="请输入"/><span>%</span></div></td>`:""}
      <td><input class="input project-log-work-remark" value="${escapeAttr(row.remark || "")}" placeholder="请输入备注"/></td>
      <td><button class="btn danger small" onclick="removeProjectLogWorkRow(this)">删除</button></td>
    </tr>
  `;
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
    tbody.innerHTML=`<tr class="project-log-report-empty-row"><td colspan="${type==="today"?6:5}">暂无数据</td></tr>`;
  }
}

function addProjectLogWorkRow(type){
  const tbody=document.getElementById(`projectLogWorkTbody-${type}`);
  if(!tbody)return;
  tbody.querySelector(".project-log-report-empty-row")?.remove();
  const index=tbody.querySelectorAll(".project-log-report-work-row").length;
  tbody.insertAdjacentHTML("beforeend",renderProjectLogWorkRow(type,{area:"",content:"",progress:"",remark:""},index));
}

function removeProjectLogWorkRow(btn){
  const row=btn?.closest(".project-log-report-work-row");
  const type=row?.dataset.projectLogWorkType;
  row?.remove();
  refreshProjectLogWorkIndexes(type);
}

function renderProjectLogRiskRows(){
  const risks=[
    ["风险类型","深基坑开挖","风险名称","深基坑开挖","风险等级","II级","计划开始日期","2026-01-01","计划完成日期","2026-09-16","实际开始日期","2026-03-26","风险描述","附属土方开挖","挂牌领导","蔡群群","计划持续时间","258天"],
    ["风险类型","承重支模架","风险名称","承重支模架","风险等级","II级","计划开始日期","2026-03-31","计划完成日期","2026-11-15","实际开始日期","2026-04-15","风险描述","附属主体结构","挂牌领导","蔡群群","计划持续时间","229天"]
  ];
  return risks.map((risk,index)=>`
    <div class="project-log-risk-row">
      <div class="project-log-risk-info">
        ${Array.from({length:Math.ceil(risk.length/2)},(_,i)=>`
          <div><span>${risk[i*2]}</span><strong>${risk[i*2+1]}</strong></div>
        `).join("")}
      </div>
      <div class="project-log-risk-form">
        <div class="form-item"><label>是否完成 <em>*</em></label><select class="select"><option>否</option><option>是</option></select></div>
        <div class="form-item"><label>是否受控 <em>*</em></label><select class="select"><option selected>是</option><option>否</option></select></div>
        <div class="form-item"><label>风险情况 <em>*</em></label><textarea class="input" placeholder="请输入"></textarea></div>
      </div>
    </div>
  `).join("");
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

function renderProjectLogFileUpload(){
  return `
    <div class="project-log-file-upload">
      <input id="projectLogFileInput" type="file" multiple onchange="handleProjectLogFileFiles(this.files)" hidden/>
      <p>最多上传9个施工日志文件</p>
      <button class="btn primary project-log-file-upload-btn" type="button" onclick="document.getElementById('projectLogFileInput')?.click()">文件上传</button>
      <div class="project-log-file-preview" id="projectLogFilePreview">
        ${projectLogReportFileList.map((file,index)=>renderProjectLogFileItem(file,index)).join("")}
      </div>
    </div>
  `;
}

function renderProjectLogFileItem(file,index){
  return `
    <div class="project-log-file-upload-item">
      <div class="project-log-file-icon">▤</div>
      <div>
        <strong>${escapeAttr(file.name || "施工日志文件")}</strong>
        <span>${file.sizeText || "-"}</span>
      </div>
      <button type="button" onclick="removeProjectLogFile(${index})">×</button>
    </div>
  `;
}

function refreshProjectLogFilePreview(){
  const box=document.getElementById("projectLogFilePreview");
  if(box)box.innerHTML=projectLogReportFileList.map((file,index)=>renderProjectLogFileItem(file,index)).join("");
}

function handleProjectLogFileFiles(files){
  const incoming=[...(files || [])];
  if(!incoming.length)return;
  const available=Math.max(0,9-projectLogReportFileList.length);
  incoming.slice(0,available).forEach(file=>{
    projectLogReportFileList.push({
      name:file.name,
      size:file.size,
      sizeText:formatProjectLogFileSize(file.size),
      type:file.type || ""
    });
  });
  refreshProjectLogFilePreview();
  if(incoming.length>available)showToast("施工日志文件最多上传9个");
  const input=document.getElementById("projectLogFileInput");
  if(input)input.value="";
}

function removeProjectLogFile(index){
  projectLogReportFileList.splice(index,1);
  refreshProjectLogFilePreview();
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
  if(incoming.length>available)showToast("施工照片最多上传9张");
  const input=document.getElementById("projectLogPhotoInput");
  if(input)input.value="";
}

function removeProjectLogPhoto(index){
  projectLogReportPhotoList.splice(index,1);
  refreshProjectLogPhotoPreview();
}

function renderProjectLogReportBaseInfo(prefix="projectLogReport",defaultArea="主体结构区",mode="online"){
  const today="2026-07-09";
  const isFile=mode==="file";
  return `
    <section class="project-log-report-section">
      <h3>基础信息</h3>
      <div class="project-log-report-grid four">
        ${isFile?"":`<div class="form-item"><label>项目名称 <em>*</em></label><input class="input" value="${escapeAttr(pcPortalState.currentProject)}" disabled/></div>`}
        <div class="form-item"><label>工区 <em>*</em></label><select class="select" id="${prefix}Area">${renderProjectLogWorkAreaOptions(defaultArea)}</select></div>
        <div class="form-item"><label>日期 <em>*</em></label><input class="input" id="${prefix}Date" type="date" value="${today}"/></div>
        ${isFile?"":`
          <div class="form-item"><label>星期 <em>*</em></label><input class="input" value="星期四" disabled/></div>
          <div class="form-item"><label>温度 <em>*</em></label><div class="project-log-unit-input"><input class="input" placeholder="请输入"/><span>℃</span></div></div>
          <div class="form-item"><label>天气是否影响工作 <em>*</em></label><select class="select"><option value="">请选择天气是否影响工作</option><option>是</option><option>否</option></select></div>
          <div class="form-item"><label>记录人姓名 <em>*</em></label><input class="input" id="${prefix}Recorder" value="楼力栋" disabled/></div>
        `}
      </div>
    </section>
  `;
}

function openProjectLogReportModal(){
  projectLogReportPhotoList=[];
  openModal("施工日志在线上报",`
    <div class="project-log-online-report">
      ${renderProjectLogReportBaseInfo("projectLogReport","主体结构区")}

      <section class="project-log-report-section">
        <h3>人员信息</h3>
        <div class="project-log-report-grid three">
          <div class="form-item"><label>总包管理人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportMainStaff",21)}</div>
          <div class="form-item"><label>分包管理人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportSubStaff",12)}</div>
          <div class="form-item"><label>劳务人员 <em>*</em></label>${renderProjectLogPersonInput("projectLogReportWorker",3)}</div>
        </div>
      </section>

      <section class="project-log-report-section">
        <h3>今日主要工作</h3>
        ${renderProjectLogWorkTable("today")}
      </section>

      <section class="project-log-report-section">
        <h3>明日主要工作</h3>
        ${renderProjectLogWorkTable("tomorrow")}
      </section>

      <section class="project-log-report-section">
        <h3>风险情况</h3>
        ${renderProjectLogRiskRows()}
      </section>

      <section class="project-log-report-section">
        <h3>施工照片</h3>
        <p class="project-log-upload-hint">最多上传9张施工照片</p>
        ${renderProjectLogPhotoUpload()}
      </section>

      <section class="project-log-report-section">
        <h3>发生停工情况</h3>
        <textarea class="input project-log-stop-textarea" placeholder="请输入"></textarea>
      </section>
    </div>
  `,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn" onclick="showToast('施工日志已暂存')">暂存</button>
    <button class="btn primary" onclick="submitProjectLogReport()">提交上报</button>
  `,"large");
  modalBox.classList.add("project-log-online-report-modal");
}

function openProjectLogFileReportModal(){
  projectLogReportFileList=[];
  openModal("施工日志文件上报",`
    <div class="project-log-online-report">
      ${renderProjectLogReportBaseInfo("projectLogFileReport","主体结构区","file")}
      <section class="project-log-report-section">
        <h3>施工日志文件</h3>
        <div class="project-log-report-grid file">
          <div class="form-item project-log-file-form-item">
            <label>文件上传 <em>*</em></label>
            ${renderProjectLogFileUpload()}
          </div>
          <div class="form-item project-log-file-remark-item">
            <label>备注说明</label>
            <textarea class="input project-log-stop-textarea" id="projectLogFileReportRemark" placeholder="请输入备注说明"></textarea>
          </div>
        </div>
      </section>
    </div>
  `,`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitProjectLogFileReport()">提交上报</button>
  `,"large");
  modalBox.classList.add("project-log-online-report-modal");
}

function submitProjectLogReport(){
  const recorder=document.getElementById("projectLogReportRecorder")?.value || "楼力栋";
  const date=document.getElementById("projectLogReportDate")?.value || "2026-07-09";
  const area=document.getElementById("projectLogReportArea")?.value || "主体结构区";
  const now=new Date();
  const uploadTime=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const firstContent=document.querySelector("#projectLogWorkTbody-today .project-log-work-content")?.value?.trim();
  projectLogCustomRows.unshift({
    id:Date.now(),
    projectName:pcPortalState.currentProject,
    mode:"online",
    date,
    title:"在线上报施工日志",
    workArea:area,
    uploader:recorder,
    uploadTime,
    fileName:"",
    fileSize:"",
    summary:firstContent || "完成施工日志在线上报。",
    cover:projectLogReportPhotoList[0]?.url || ""
  });
  projectLogStatusMap[date]="uploaded";
  projectLogState.page=1;
  projectLogState.workArea="";
  projectLogState.keyword="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.selectedDate=date;
  closeModal();
  renderProjectLogPage();
  showToast("施工日志上报成功");
}

function submitProjectLogFileReport(){
  if(!projectLogReportFileList.length){
    showToast("请上传施工日志文件");
    return;
  }
  const recorder=document.getElementById("projectLogFileReportRecorder")?.value || "楼力栋";
  const date=document.getElementById("projectLogFileReportDate")?.value || "2026-07-09";
  const area=document.getElementById("projectLogFileReportArea")?.value || "主体结构区";
  const remark=document.getElementById("projectLogFileReportRemark")?.value?.trim() || "";
  const now=new Date();
  const uploadTime=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const totalSize=projectLogReportFileList.reduce((sum,file)=>sum+(Number(file.size)||0),0);
  const firstFile=projectLogReportFileList[0];
  projectLogCustomRows.unshift({
    id:Date.now(),
    projectName:pcPortalState.currentProject,
    mode:"file",
    date,
    title:"文件上报施工日志",
    workArea:area,
    uploader:recorder,
    uploadTime,
    fileName:projectLogReportFileList.length>1?`${firstFile.name} 等${projectLogReportFileList.length}个文件`:firstFile.name,
    fileSize:formatProjectLogFileSize(totalSize),
    summary:remark || "完成施工日志文件上报。",
    files:projectLogReportFileList.map(file=>({...file}))
  });
  projectLogStatusMap[date]="uploaded";
  projectLogState.page=1;
  projectLogState.workArea="";
  projectLogState.keyword="";
  projectLogState.startDate="";
  projectLogState.endDate="";
  projectLogState.selectedDate=date;
  closeModal();
  renderProjectLogPage();
  showToast("施工日志文件上报成功");
}

function renderProjectPortalPage(name){
  if(pcPortalState.projectLine==="production"&&name==="里程碑节点")return renderProjectMilestoneNodePage();
  if(pcPortalState.projectLine==="production"&&name==="风险管控清单")return renderProjectRiskControlPage();
  if(pcPortalState.projectLine==="production"&&name==="创奖管理")return renderProjectAwardManagementPage();
  if(pcPortalState.projectLine==="production"&&name==="技术方案管理")return renderProjectTechSchemePage();
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
  pageSize:10
};

const projectMilestoneNodeRows=[
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
    pageSize:10
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
  projectMilestoneNodeState.pageSize=Number(value)||10;
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
  pageSize:10
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
    pageSize:10
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
  projectRiskControlState.pageSize=Number(value)||10;
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
  pageSize:10
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
  const statItem=(key,label,value)=>`
    <div class="construction-project-stat-item ${projectAwardManagementState.statKey===key?"active":""}" onclick="setProjectAwardStat('${key}')">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">统计筛选</div>
        <div class="construction-project-stat-items">
          ${statItem("all","计划创奖数",rows.length)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">上报情况</div>
        <div class="construction-project-stat-items">
          ${statItem("participated","已参评",count(row=>!!row.participateDate))}
          ${statItem("awarded","已获奖",count(row=>!!row.awardDate))}
          ${statItem("issued","已颁发",count(row=>!!row.certificateMonth))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">创奖等级</div>
        <div class="construction-project-stat-items">
          ${statItem("gradeNational","国家级",count(row=>row.awardLevel==="国家级"))}
          ${statItem("gradeProvince","省部级/直辖市",count(row=>row.awardLevel==="省部级/直辖市"))}
          ${statItem("gradeBelow","省部级以下",count(row=>row.awardLevel==="省部级以下"))}
        </div>
      </div>
    </div>
  `);
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
    pageSize:10
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
  projectAwardManagementState.pageSize=Number(value)||10;
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
  pageSize:10
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
  const statItem=(key,label,value)=>`
    <div class="construction-project-stat-item ${projectTechSchemeState.statKey===key?"active":""}" onclick="setProjectTechSchemeStat('${key}')">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">计划总数</div>
        <div class="construction-project-stat-items">
          ${statItem("all","计划总数",rows.length)}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">技术方案</div>
        <div class="construction-project-stat-items">
          ${statItem("unapproved","未审批",count(row=>row.approvalStatus==="未审批"))}
          ${statItem("approved","已审批",count(row=>row.approvalStatus==="已审批"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">方案关联</div>
        <div class="construction-project-stat-items">
          ${statItem("linkedMilestone","已关联里程碑",count(row=>Number(row.milestoneCount)>0))}
          ${statItem("linkedRisk","已关联风险",count(row=>Number(row.riskCount)>0))}
        </div>
      </div>
    </div>
  `);
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
    pageSize:10
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
  projectTechSchemeState.pageSize=Number(value)||10;
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
  const rows=getProjectLogPagedRows();
  const areas=[...new Set(getProjectLogRows().map(row=>row.workArea))];
  renderProjectPageShell("施工日志","",`
    <div class="project-log-template-page">
      <section class="card project-log-list-panel">
        <div class="project-log-panel-head">
          <h3>施工日志列表</h3>
          <div class="actions">
            <button class="btn project-log-action-btn online" onclick="openProjectLogReportModal()">在线上报</button>
            <button class="btn project-log-action-btn file" onclick="openProjectLogFileReportModal()">文件上报</button>
          </div>
        </div>
        <div class="project-log-filter-row">
          <label class="project-log-filter-item">
            <span>施工工区</span>
            <select id="projectLogArea" class="select">
              <option value="">请选择施工工区</option>
              ${areas.map(area=>`<option value="${area}" ${projectLogState.workArea===area?"selected":""}>${area}</option>`).join("")}
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
  removeProjectLogFile
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

