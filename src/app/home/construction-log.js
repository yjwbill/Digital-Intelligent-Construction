/* =========================
   企业首页 / 施工日志
========================= */
const enterpriseConstructionLogState={
  projectName:"",
  company:"",
  branch:"",
  manager:"",
  controlLevel:"",
  builder:"",
  keyCustomer:"",
  region:"",
  projectStatus:"",
  projectCode:"",
  reportMonth:getCurrentReportMonth(),
  statKey:"all",
  page:1,
  pageSize:50
};

function getEnterpriseConstructionLogMonthMeta(){
  const [year,month]=enterpriseConstructionLogState.reportMonth.split("-").map(Number);
  return {
    year,
    month,
    days:new Date(year,month,0).getDate(),
    label:`${year}年${String(month).padStart(2,"0")}月`
  };
}

function isEnterpriseConstructionLogFutureMonth(monthValue){
  return String(monthValue)>getCurrentReportMonth();
}

const constructionLogDataRange={start:"2026-06-18",end:"2026-07-13"};

const enterpriseConstructionLogTemplatePath="src/app/home/construction-log.html";
let enterpriseConstructionLogTemplatePromise=null;
let enterpriseConstructionLogRenderToken=0;

function getEnterpriseConstructionLogTemplateFromDocument(){
  return document.querySelector("template[data-enterprise-construction-log-template]") || null;
}

function parseEnterpriseConstructionLogFragment(html,targetTag=""){
  const parser=new DOMParser();
  const tag=String(targetTag||"").toUpperCase();
  const wrapper=tag==="THEAD"
    ? `<table><thead>${html}</thead></table>`
    : tag==="TBODY"
      ? `<table><tbody>${html}</tbody></table>`
      : tag==="SELECT"
        ? `<select>${html}</select>`
        : html;
  const doc=parser.parseFromString(wrapper,"text/html");
  if(tag==="THEAD")return Array.from(doc.querySelector("thead")?.childNodes||[]);
  if(tag==="TBODY")return Array.from(doc.querySelector("tbody")?.childNodes||[]);
  if(tag==="SELECT")return Array.from(doc.querySelector("select")?.childNodes||[]);
  return Array.from(doc.body.childNodes);
}

function replaceEnterpriseConstructionLogFragment(target,html){
  if(!target)return;
  const nodes=parseEnterpriseConstructionLogFragment(html,target.tagName)
    .map(node=>document.importNode(node,true));
  target.replaceChildren(...nodes);
}

function loadEnterpriseConstructionLogTemplate(){
  const inlineTemplate=getEnterpriseConstructionLogTemplateFromDocument();
  if(inlineTemplate)return Promise.resolve(inlineTemplate);

  if(!enterpriseConstructionLogTemplatePromise){
    enterpriseConstructionLogTemplatePromise=fetch(enterpriseConstructionLogTemplatePath)
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,"text/html");
        const template=doc.querySelector("template[data-enterprise-construction-log-template]");
        if(!template)throw new Error("施工日志页面模板缺失");
        return template;
      })
      .catch(error=>{
        console.warn("load construction log template failed",error);
        enterpriseConstructionLogTemplatePromise=null;
        return null;
      });
  }
  return enterpriseConstructionLogTemplatePromise;
}

function renderEnterpriseConstructionLogMonthSwitch(){
  const {label}=getEnterpriseConstructionLogMonthMeta();
  const nextMonth=new Date(enterpriseConstructionLogState.reportMonth+"-01");
  nextMonth.setMonth(nextMonth.getMonth()+1);
  const nextValue=`${nextMonth.getFullYear()}-${String(nextMonth.getMonth()+1).padStart(2,"0")}`;
  const labelEl=document.querySelector("[data-enterprise-log-month-label]");
  const prevButton=document.querySelector("[data-enterprise-log-month-prev]");
  const nextButton=document.querySelector("[data-enterprise-log-month-next]");
  if(labelEl)labelEl.textContent=label;
  if(prevButton)prevButton.onclick=()=>changeEnterpriseConstructionLogMonth(-1);
  if(nextButton){
    nextButton.disabled=isEnterpriseConstructionLogFutureMonth(nextValue);
    nextButton.onclick=()=>changeEnterpriseConstructionLogMonth(1);
  }
}

function getEnterpriseConstructionLogDayState(project,day){
  return getEnterpriseConstructionLogDayStateForMonth(project,day,enterpriseConstructionLogState.reportMonth);
}

function getEnterpriseConstructionLogRows(){
  const meta=getEnterpriseConstructionLogMonthMeta();
  const latestDay=enterpriseConstructionLogState.reportMonth==="2026-07"?13:meta.days;
  return constructionProjectData.map(project=>{
    const latestDayState=getEnterpriseConstructionLogDayState(project,latestDay);
    const reportStatus=latestDayState==="stopped"
      ? "停工未上报"
      : latestDayState==="missing"?"未上报":latestDayState==="reported"?"已上报":"未开始";
    const uploadedDay=reportStatus==="停工未上报"||reportStatus==="未开始"
      ? 0
      : reportStatus==="未上报"?Math.max(1,latestDay-1):Math.max(1,latestDay-(project.id%3));
    return {
      ...project,
      reportStatus,
      reportMethod:reportStatus==="已上报"?(getEnterpriseConstructionLogReportRecord(project,latestDay,enterpriseConstructionLogState.reportMonth).mode==="file"?"文件上报":"在线上报"):"",
      onTimeUpload:reportStatus==="已上报"?(project.id%5===0?"否":"是"):"否",
      latestUploadDate:uploadedDay
        ? `${enterpriseConstructionLogState.reportMonth}-${String(uploadedDay).padStart(2,"0")}`
        : "-"
    };
  });
}

function getEnterpriseConstructionLogSearchRows(){
  return filterEnterpriseConstructionLogSearchRows(getEnterpriseConstructionLogRows());
}

function filterEnterpriseConstructionLogSearchRows(rows){
  const s=enterpriseConstructionLogState;
  return rows.filter(row=>{
    if(s.projectName&&!row.projectName.includes(s.projectName))return false;
    if(s.company&&row.subCompany!==s.company)return false;
    if(s.branch&&row.branchCompany!==s.branch)return false;
    if(s.manager&&!row.projectManager.includes(s.manager))return false;
    if(s.controlLevel&&row.controlLevel!==s.controlLevel)return false;
    if(s.builder&&!row.builder.includes(s.builder))return false;
    if(s.keyCustomer&&(row.keyCustomer||"无")!==s.keyCustomer)return false;
    if(s.region&&row.region!==s.region)return false;
    if(s.projectStatus&&row.projectStatus!==s.projectStatus)return false;
    if(s.projectCode&&!row.projectCode.includes(s.projectCode))return false;
    return true;
  });
}

function getEnterpriseConstructionLogTodayStatRows(){
  const day=13;
  return filterEnterpriseConstructionLogSearchRows(constructionProjectData.map(project=>{
    const dailyState=getEnterpriseConstructionLogDayStateForMonth(project,day,"2026-07");
    const reportStatus=dailyState==="stopped"?"停工未上报":dailyState==="missing"?"未上报":"已上报";
    const reportMethod=dailyState==="reported"?(getEnterpriseConstructionLogReportRecord(project,day,"2026-07").mode==="file"?"文件上报":"在线上报"):"";
    return {...project,reportStatus,reportMethod};
  }));
}

function getEnterpriseConstructionLogFilteredRows(){
  const rows=getEnterpriseConstructionLogSearchRows();
  if(enterpriseConstructionLogState.statKey==="reported")return rows.filter(row=>row.reportStatus==="已上报");
  if(enterpriseConstructionLogState.statKey==="unreported")return rows.filter(row=>row.reportStatus==="未上报");
  if(enterpriseConstructionLogState.statKey==="stopped")return rows.filter(row=>row.reportStatus==="停工未上报");
  if(enterpriseConstructionLogState.statKey==="online")return rows.filter(row=>row.reportMethod==="在线上报");
  if(enterpriseConstructionLogState.statKey==="file")return rows.filter(row=>row.reportMethod==="文件上报");
  return rows;
}

function getEnterpriseConstructionLogPagedRows(){
  const rows=getEnterpriseConstructionLogFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/enterpriseConstructionLogState.pageSize));
  enterpriseConstructionLogState.page=Math.min(Math.max(1,enterpriseConstructionLogState.page),totalPages);
  const start=(enterpriseConstructionLogState.page-1)*enterpriseConstructionLogState.pageSize;
  return rows.slice(start,start+enterpriseConstructionLogState.pageSize);
}

function renderEnterpriseConstructionLogDayCell(row,day){
  const state=getEnterpriseConstructionLogDayState(row,day);
  if(state==="reported")return `<button type="button" class="enterprise-log-day-drill" title="查看当日施工日志" data-enterprise-log-report-id="${row.id}" data-enterprise-log-day="${day}">${renderProjectLogStatusIcon("uploaded")}</button>`;
  if(state==="missing")return `<span class="enterprise-log-day-status" title="未上报">${renderProjectLogStatusIcon("missing")}</span>`;
  if(state==="stopped")return `<span class="enterprise-log-day-status" title="停工未上报">${renderProjectLogStatusIcon("stopped")}</span>`;
  return `<span class="enterprise-log-day-status" title="未开始">${renderProjectLogStatusIcon("not-started")}</span>`;
}

function refreshEnterpriseConstructionLogColumns(){
  const meta=getEnterpriseConstructionLogMonthMeta();
  tableColumnDefinitions.enterpriseConstructionLog=[
    {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(enterpriseConstructionLogState.page-1)*enterpriseConstructionLogState.pageSize+index+1},
    {key:"projectName",title:"项目名称",width:240,align:"left",render:row=>`<button type="button" class="link" data-log-detail-id="${row.id}">${row.projectName}</button>`},
    {key:"projectStatus",title:"项目状态",width:80,align:"center",render:row=>projectStatusTag(row.projectStatus)},
    {key:"subCompany",title:"子公司",width:130,align:"center",render:row=>row.subCompany},
    {key:"branchCompany",title:"分公司",width:140,align:"center",render:row=>row.branchCompany},
    {key:"onTimeUpload",title:"是否按时上报",width:110,align:"center",render:row=>tag(row.onTimeUpload,row.onTimeUpload==="是"?"green":"red")},
    {key:"latestUploadDate",title:"最新上报日期",width:110,align:"center",render:row=>row.latestUploadDate},
    ...Array.from({length:meta.days},(_,index)=>({
      key:`day${index+1}`,
      title:`${index+1}日`,
      group:meta.label,
      width:58,
      align:"center",
      render:row=>renderEnterpriseConstructionLogDayCell(row,index+1)
    })),
    {key:"projectManager",title:"项目经理",width:190,align:"center",render:row=>`${row.projectManager} | ${maskPhone(row.managerPhone||"18000005555")} <button type="button" class="link" title="查看完整手机号" onclick="showToast('查看手机号权限')">👁️</button>`},
    {key:"controlLevel",title:"管控等级",width:150,align:"center",render:row=>row.controlLevel},
    {key:"builder",title:"建设单位",width:220,align:"left",render:row=>row.builder},
    {key:"keyCustomer",title:"重点客户",width:130,align:"center",render:row=>row.keyCustomer||"无"},
    {key:"region",title:"所属区域",width:120,align:"center",render:row=>row.region},
    {key:"projectCode",title:"项目编号",width:150,align:"center",render:row=>row.projectCode},
    {key:"operation",title:"操作",width:100,align:"center",render:row=>`<button type="button" class="link" data-log-detail-id="${row.id}">查看</button>`}
  ];
}

function renderEnterpriseConstructionLogStats(){
  const rows=getEnterpriseConstructionLogTodayStatRows();
  const count=status=>rows.filter(row=>row.reportStatus===status).length;
  const item=(key,label,value)=>`
    <div class="construction-project-stat-item ${enterpriseConstructionLogState.statKey===key?"active":""}" onclick="setEnterpriseConstructionLogStat('${key}')">
      <strong>${value}</strong><span>${label}</span>
    </div>
  `;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">今日 上报</div>
        <div class="construction-project-stat-items">
          ${item("all","应上报",rows.length)}
          ${item("reported","已上报",count("已上报"))}
          ${item("unreported","应报未报",count("未上报"))}
          ${item("stopped","停工未上报",count("停工未上报"))}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">上报方式</div>
        <div class="construction-project-stat-items">
          ${item("online","在线上报",rows.filter(row=>row.reportMethod==="在线上报").length)}
          ${item("file","文件上报",rows.filter(row=>row.reportMethod==="文件上报").length)}
        </div>
      </div>
    </div>
  `);
}

function renderEnterpriseConstructionLogQueryFields(){
  const s=enterpriseConstructionLogState;
  const companies=cpUnique("subCompany");
  const branches=s.company?getOrganizationBranchOptions(s.company):cpUnique("branchCompany");
  const controlLevels=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL"):cpUnique("controlLevel");
  return `
    <div class="form-item"><label>项目名称</label><input id="enterpriseLogProjectName" class="input" value="${escapeAttr(s.projectName)}" placeholder="请输入项目名称模糊搜索"/></div>
    <div class="form-item"><label>子公司</label><select id="enterpriseLogCompany" class="select" onchange="syncEnterpriseConstructionLogBranchOptions()">${renderActualOutputOptions(companies,s.company,"全部")}</select></div>
    <div class="form-item"><label>分公司</label><select id="enterpriseLogBranch" class="select">${renderActualOutputOptions(branches,s.branch,"全部")}</select></div>
    <div class="form-item"><label>项目经理</label><input id="enterpriseLogManager" class="input" value="${escapeAttr(s.manager)}" placeholder="请输入项目经理模糊搜索"/></div>
    <div class="form-item"><label>管控等级</label><select id="enterpriseLogControlLevel" class="select">${renderActualOutputOptions(controlLevels,s.controlLevel,"全部")}</select></div>
    <div class="form-item"><label>建设单位</label><input id="enterpriseLogBuilder" class="input" value="${escapeAttr(s.builder)}" placeholder="请输入建设单位模糊搜索"/></div>
    <div class="form-item"><label>重点客户</label><select id="enterpriseLogKeyCustomer" class="select">${renderActualOutputOptions(cpUnique("keyCustomer").map(value=>value||"无"),s.keyCustomer,"全部")}</select></div>
    <div class="form-item"><label>所属区域</label><select id="enterpriseLogRegion" class="select">${renderActualOutputOptions(cpUnique("region"),s.region,"全部")}</select></div>
    <div class="form-item"><label>项目状态</label><select id="enterpriseLogProjectStatus" class="select">${renderActualOutputOptions(cpUnique("projectStatus"),s.projectStatus,"全部")}</select></div>
    <div class="form-item"><label>项目编号</label><input id="enterpriseLogProjectCode" class="input" value="${escapeAttr(s.projectCode)}" placeholder="请输入项目编号模糊搜索"/></div>
  `;
}

async function renderEnterpriseConstructionLogPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  refreshEnterpriseConstructionLogColumns();
  const token=++enterpriseConstructionLogRenderToken;
  const rows=getEnterpriseConstructionLogFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/enterpriseConstructionLogState.pageSize));
  const template=await loadEnterpriseConstructionLogTemplate();
  if(token!==enterpriseConstructionLogRenderToken)return;
  if(!template){
    const fallback=document.createElement("div");
    fallback.className="project-log-empty";
    fallback.textContent="施工日志页面模板加载失败";
    listPage.replaceChildren(fallback);
    return;
  }
  listPage.replaceChildren(document.importNode(template.content,true));
  replaceEnterpriseConstructionLogFragment(document.querySelector("[data-enterprise-log-query]"),renderUnifiedQueryCard(renderEnterpriseConstructionLogQueryFields(),{
    title:"查询条件",
    queryFn:"queryEnterpriseConstructionLog()",
    resetFn:"resetEnterpriseConstructionLog()",
    gridClass:"search-grid",
    id:"enterpriseConstructionLogQueryCard",
    canCollapse:true
  }));
  replaceEnterpriseConstructionLogFragment(document.querySelector("[data-enterprise-log-stats]"),renderEnterpriseConstructionLogStats());
  const table=document.getElementById("enterpriseConstructionLogTable");
  if(table)table.style.minWidth=getTableMinWidth("enterpriseConstructionLog")+"px";
  const totalText=document.getElementById("enterpriseConstructionLogTotalText");
  const pageText=document.getElementById("enterpriseConstructionLogPageText");
  if(totalText)totalText.textContent=`共 ${rows.length} 条`;
  if(pageText)pageText.textContent=`第 1 / ${totalPages} 页　每页 ${enterpriseConstructionLogState.pageSize} 条`;
  document.querySelector("[data-enterprise-log-refresh]")?.addEventListener("click",()=>renderEnterpriseConstructionLogPage());
  document.querySelector("[data-enterprise-log-export]")?.addEventListener("click",()=>showToast("施工日志上报明细导出成功"));
  document.querySelector("[data-enterprise-log-column-setting]")?.addEventListener("click",()=>openColumnSetting("enterpriseConstructionLog","renderEnterpriseConstructionLogTable"));
  renderEnterpriseConstructionLogMonthSwitch();
  renderEnterpriseConstructionLogTable();
}

function renderEnterpriseConstructionLogTable(){
  refreshEnterpriseConstructionLogColumns();
  const table=document.getElementById("enterpriseConstructionLogTable");
  const thead=document.getElementById("enterpriseConstructionLogThead");
  if(table)table.style.minWidth=getTableMinWidth("enterpriseConstructionLog")+"px";
  replaceEnterpriseConstructionLogFragment(thead,renderSafetyEvalMonthlyGroupedHeader("enterpriseConstructionLog"));
  renderTableByColumns("enterpriseConstructionLog",getEnterpriseConstructionLogPagedRows(),"enterpriseConstructionLogTbody");
  bindEnterpriseConstructionLogDetailButtons();
  const tbody=document.getElementById("enterpriseConstructionLogTbody");
  const columns=getVisibleColumns("enterpriseConstructionLog");
  if(tbody&&!tbody.children.length){
    const row=document.createElement("tr");
    const cell=document.createElement("td");
    cell.colSpan=columns.length;
    cell.style.height="100px";
    cell.style.textAlign="center";
    cell.style.color="var(--muted)";
    cell.textContent="暂无数据";
    row.appendChild(cell);
    tbody.replaceChildren(row);
  }
  const total=getEnterpriseConstructionLogFilteredRows().length;
  const totalPages=Math.max(1,Math.ceil(total/enterpriseConstructionLogState.pageSize));
  const totalText=document.getElementById("enterpriseConstructionLogTotalText");
  const pageText=document.getElementById("enterpriseConstructionLogPageText");
  if(totalText)totalText.textContent=`共 ${total} 条`;
  if(pageText){
    const prevButton=document.createElement("button");
    prevButton.className="btn mini";
    prevButton.textContent="上一页";
    prevButton.disabled=enterpriseConstructionLogState.page<=1;
    prevButton.addEventListener("click",()=>changeEnterpriseConstructionLogPage(-1));

    const pageInfo=document.createElement("b");
    pageInfo.textContent=`第 ${enterpriseConstructionLogState.page} / ${totalPages} 页`;

    const nextButton=document.createElement("button");
    nextButton.className="btn mini";
    nextButton.textContent="下一页";
    nextButton.disabled=enterpriseConstructionLogState.page>=totalPages;
    nextButton.addEventListener("click",()=>changeEnterpriseConstructionLogPage(1));

    const pageSizeSelect=document.createElement("select");
    pageSizeSelect.className="select mini-select";
    pageSizeSelect.addEventListener("change",event=>changeEnterpriseConstructionLogPageSize(event.target.value));
    [10,20,50].forEach(size=>{
      const option=document.createElement("option");
      option.value=String(size);
      option.textContent=`${size}条/页`;
      option.selected=size===enterpriseConstructionLogState.pageSize;
      pageSizeSelect.appendChild(option);
    });

    pageText.replaceChildren(prevButton,pageInfo,nextButton,pageSizeSelect);
  }
}

function bindEnterpriseConstructionLogDetailButtons(){
  document.querySelectorAll("#enterpriseConstructionLogTbody [data-log-detail-id]").forEach(button=>{
    button.addEventListener("click",()=>openEnterpriseConstructionLogDetail(button.dataset.logDetailId));
  });
  document.querySelectorAll("#enterpriseConstructionLogTbody [data-enterprise-log-report-id]").forEach(button=>{
    button.addEventListener("click",()=>openEnterpriseConstructionLogReportDetail(button.dataset.enterpriseLogReportId,button.dataset.enterpriseLogDay));
  });
}

function syncEnterpriseConstructionLogBranchOptions(){
  const company=document.getElementById("enterpriseLogCompany")?.value||"";
  const branch=document.getElementById("enterpriseLogBranch");
  if(!branch)return;
  const options=company?getOrganizationBranchOptions(company):cpUnique("branchCompany");
  replaceEnterpriseConstructionLogFragment(branch,renderActualOutputOptions(options,"","全部"));
}

function syncEnterpriseConstructionLogQueryState(){
  enterpriseConstructionLogState.projectName=document.getElementById("enterpriseLogProjectName")?.value.trim()||"";
  enterpriseConstructionLogState.company=document.getElementById("enterpriseLogCompany")?.value||"";
  enterpriseConstructionLogState.branch=document.getElementById("enterpriseLogBranch")?.value||"";
  enterpriseConstructionLogState.manager=document.getElementById("enterpriseLogManager")?.value.trim()||"";
  enterpriseConstructionLogState.controlLevel=document.getElementById("enterpriseLogControlLevel")?.value||"";
  enterpriseConstructionLogState.builder=document.getElementById("enterpriseLogBuilder")?.value.trim()||"";
  enterpriseConstructionLogState.keyCustomer=document.getElementById("enterpriseLogKeyCustomer")?.value||"";
  enterpriseConstructionLogState.region=document.getElementById("enterpriseLogRegion")?.value||"";
  enterpriseConstructionLogState.projectStatus=document.getElementById("enterpriseLogProjectStatus")?.value||"";
  enterpriseConstructionLogState.projectCode=document.getElementById("enterpriseLogProjectCode")?.value.trim()||"";
}

function queryEnterpriseConstructionLog(){
  syncEnterpriseConstructionLogQueryState();
  enterpriseConstructionLogState.statKey="all";
  enterpriseConstructionLogState.page=1;
  renderEnterpriseConstructionLogPage();
}

function resetEnterpriseConstructionLog(){
  Object.assign(enterpriseConstructionLogState,{
    projectName:"",company:"",branch:"",manager:"",controlLevel:"",builder:"",keyCustomer:"",region:"",projectStatus:"",projectCode:"",statKey:"all",page:1,pageSize:50
  });
  renderEnterpriseConstructionLogPage();
}

function setEnterpriseConstructionLogStat(key){
  enterpriseConstructionLogState.statKey=key;
  enterpriseConstructionLogState.page=1;
  renderEnterpriseConstructionLogPage();
}

function changeEnterpriseConstructionLogPage(delta){
  const totalPages=Math.max(1,Math.ceil(getEnterpriseConstructionLogFilteredRows().length/enterpriseConstructionLogState.pageSize));
  enterpriseConstructionLogState.page=Math.min(Math.max(1,enterpriseConstructionLogState.page+delta),totalPages);
  renderEnterpriseConstructionLogTable();
}

function changeEnterpriseConstructionLogPageSize(value){
  enterpriseConstructionLogState.pageSize=Number(value)||50;
  enterpriseConstructionLogState.page=1;
  renderEnterpriseConstructionLogTable();
}

function changeEnterpriseConstructionLogMonth(delta){
  const {year,month}=getEnterpriseConstructionLogMonthMeta();
  const nextMonth=new Date(year,month-1+Number(delta||0),1);
  const nextValue=`${nextMonth.getFullYear()}-${String(nextMonth.getMonth()+1).padStart(2,"0")}`;
  if(isEnterpriseConstructionLogFutureMonth(nextValue))return;
  enterpriseConstructionLogState.reportMonth=nextValue;
  enterpriseConstructionLogState.page=1;
  renderEnterpriseConstructionLogPage();
}

const enterpriseConstructionLogProjectViewState={
  projectId:null,
  month:"",
  selectedDate:"",
  workArea:"",
  keyword:"",
  startDate:"",
  endDate:"",
  page:1,
  pageSize:50
};

function getEnterpriseConstructionLogMonthMetaByValue(monthValue){
  const [year,month]=String(monthValue).split("-").map(Number);
  return {year,month,days:new Date(year,month,0).getDate(),label:`${year}年${String(month).padStart(2,"0")}月`};
}

function getEnterpriseConstructionLogDayStateForMonth(project,day,monthValue){
  if(!project)return "not-started";
  const date=`${monthValue}-${String(day).padStart(2,"0")}`;
  if(globalThis.projectLogDeletedKeys?.has(`${project.projectName}|${date}`))return "missing";
  if(date<constructionLogDataRange.start||date>constructionLogDataRange.end)return "not-started";
  if(project.projectStatus==="停工")return "stopped";
  if((Number(project.id)*3+Number(day))%11===0||(Number(project.id)+Number(day)*2)%17===0)return "missing";
  return "reported";
}

function getEnterpriseConstructionLogReportRecord(project,day,monthValue=enterpriseConstructionLogProjectViewState.month){
  const mode=(Number(project.id)+Number(day))%5===0?"file":"online";
  const date=`${monthValue}-${String(day).padStart(2,"0")}`;
  const workAreas=["主体结构区","盾构区间右线","附属结构A区","材料加工区","地下连续墙工区","检验工地"];
  const uploaderNames=[project.projectManager,"张三","王晨","赵菁","陈启航"];
  const uploader=uploaderNames[(Number(project.id)+Number(day))%uploaderNames.length];
  return {
    id:`enterprise-log-${project.id}-${day}`,
    seed:Number(project.id)*100+Number(day),
    projectId:project.id,
    day:Number(day),
    mode,
    date,
    title:mode==="online"?"在线上报施工日志":"文件上报施工日志",
    workArea:workAreas[(Number(project.id)+Number(day))%workAreas.length],
    uploader,
    uploadTime:`${date} ${String(8+(Number(day)%10)).padStart(2,"0")}:${String(8+(Number(project.id)*7+Number(day)*3)%50).padStart(2,"0")}`,
    fileName:mode==="file"?`施工日志_${project.projectCode}_${String(day).padStart(2,"0")}.pdf`:"",
    fileSize:mode==="file"?`${(1.1+(Number(day)%5)*0.18).toFixed(2)}MB`:"",
    summary:mode==="online"?"完成当日施工记录、机械台班和隐患排查记录上报。":"施工日志文件及当日施工说明已上传。",
    cover:"./src/assets/project-log-building.png"
  };
}

function getEnterpriseConstructionLogProjectRecords(project){
  const monthValue=enterpriseConstructionLogProjectViewState.month || enterpriseConstructionLogState.reportMonth;
  const meta=getEnterpriseConstructionLogMonthMetaByValue(monthValue);
  return Array.from({length:meta.days},(_,index)=>index+1)
    .filter(day=>getEnterpriseConstructionLogDayStateForMonth(project,day,monthValue)==="reported")
    .map(day=>getEnterpriseConstructionLogReportRecord(project,day,monthValue))
    .reverse();
}

function getEnterpriseConstructionLogProjectById(id){
  return constructionProjectData.find(item=>item.id===Number(id));
}

function renderEnterpriseConstructionLogProjectCard(record){
  return `
    <button type="button" class="project-log-report-card ${record.mode}" onclick="openEnterpriseConstructionLogReportDetail(${record.projectId},${record.day})">
      <span class="project-log-mode ${record.mode}">${record.mode==="online"?"在线上报":"文件上报"}</span>
      ${record.mode==="online"?`
        <img src="${record.cover}" alt="${record.title}"/>
      `:`
        <div class="project-log-file-box">
          <div class="project-log-file-icon">▤</div>
          <strong>${record.fileName}</strong>
          <span>${record.fileSize}</span>
        </div>
      `}
      <div class="project-log-card-body">
        <h3>${record.workArea}</h3>
        <p>上传人：${record.uploader}</p>
        <p>上传时间：${record.uploadTime}</p>
      </div>
    </button>
  `;
}

function getEnterpriseConstructionLogProjectCalendarDays(project){
  const monthValue=enterpriseConstructionLogProjectViewState.month || enterpriseConstructionLogState.reportMonth;
  const meta=getEnterpriseConstructionLogMonthMetaByValue(monthValue);
  const first=new Date(meta.year,meta.month-1,1);
  const previousMonthDays=new Date(meta.year,meta.month-1,0).getDate();
  const days=[];
  for(let index=first.getDay()-1;index>=0;index--)days.push({day:previousMonthDays-index,muted:true});
  for(let day=1;day<=meta.days;day++){
    const date=`${monthValue}-${String(day).padStart(2,"0")}`;
    days.push({
      day,
      date,
      state:getEnterpriseConstructionLogDayStateForMonth(project,day,monthValue),
      selected:enterpriseConstructionLogProjectViewState.selectedDate===date
    });
  }
  let nextDay=1;
  while(days.length<42)days.push({day:nextDay++,muted:true});
  return days;
}

function renderEnterpriseConstructionLogProjectCalendar(project){
  const monthValue=enterpriseConstructionLogProjectViewState.month || enterpriseConstructionLogState.reportMonth;
  const meta=getEnterpriseConstructionLogMonthMetaByValue(monthValue);
  const next=new Date(`${monthValue}-01`);
  next.setMonth(next.getMonth()+1);
  const nextValue=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`;
  return `
    <section class="card project-log-calendar-card enterprise-log-project-calendar">
      <div class="project-log-calendar-head">
        <h3>施工日历</h3>
        <div class="enterprise-log-month-switch" aria-label="施工日志月份">
          <button type="button" title="上一个月" onclick="changeEnterpriseConstructionLogProjectMonth(-1)">&#8249;</button>
          <strong>${meta.label}</strong>
          <button type="button" title="下一个月" ${isEnterpriseConstructionLogFutureMonth(nextValue)?"disabled":""} onclick="changeEnterpriseConstructionLogProjectMonth(1)">&#8250;</button>
        </div>
      </div>
      <div class="project-log-weekdays">${["日","一","二","三","四","五","六"].map(item=>`<span>${item}</span>`).join("")}</div>
      <div class="project-log-calendar-grid">
        ${getEnterpriseConstructionLogProjectCalendarDays(project).map(item=>{
          const canOpen=!item.muted&&item.state==="reported";
          return `
            <button class="${item.muted?"muted":""} ${item.selected?"selected":""} ${item.state||""}" ${canOpen?`onclick="selectEnterpriseConstructionLogProjectDate('${item.date}')"`:"disabled"}>
              <span>${item.day}</span>
              ${item.muted?"":renderProjectLogStatusIcon(item.state==="reported"?"uploaded":item.state)}
            </button>
          `;
        }).join("")}
      </div>
      <div class="project-log-legend">
        <span>${renderProjectLogStatusIcon("uploaded")}已上报</span>
        <span>${renderProjectLogStatusIcon("missing")}未上报</span>
        <span>${renderProjectLogStatusIcon("stopped")}停工未上报</span>
        <span>${renderProjectLogStatusIcon("not-started")}未开始</span>
      </div>
    </section>
    ${renderEnterpriseConstructionLogProjectSelectedDay(project)}
  `;
}

function renderEnterpriseConstructionLogProjectSelectedDay(project){
  const record=getEnterpriseConstructionLogProjectRecords(project).find(item=>item.date===enterpriseConstructionLogProjectViewState.selectedDate);
  if(!record)return `
    <section class="card project-log-day-card project-log-day-empty-card">
      <div class="project-log-empty">请选择已上报日期查看施工日志</div>
    </section>
  `;
  const date=new Date(record.date.replace(/-/g,"/"));
  const weekday=["日","一","二","三","四","五","六"][date.getDay()];
  return `
    <section class="card project-log-day-card">
      <h3>${record.date}（星期${weekday}）</h3>
      <button type="button" class="project-log-day-item" onclick="openEnterpriseConstructionLogReportDetail(${record.projectId},${record.day})">
        <div>
          <strong class="${record.mode}">${record.mode==="online"?"在线上报":"文件上报"}</strong>
          <p>施工区域：${record.workArea}</p>
          <p>上传人：${record.uploader}</p>
          <p>上传时间：${record.uploadTime}</p>
        </div>
        ${record.mode==="online"?`<img src="${record.cover}" alt="${record.title}"/>`:`<span class="project-log-day-file">PDF</span>`}
      </button>
    </section>
  `;
}

function renderEnterpriseConstructionLogProjectPagination(records){
  const totalPages=Math.max(1,Math.ceil(records.length/enterpriseConstructionLogProjectViewState.pageSize));
  const page=enterpriseConstructionLogProjectViewState.page;
  return `
    <div class="pagination project-log-pagination">
      <span>共 ${records.length} 条</span>
      <div class="pager">
        <button class="btn mini" ${page<=1?"disabled":""} onclick="changeEnterpriseConstructionLogProjectPage(-1)">上一页</button>
        <b>第 ${page} / ${totalPages} 页</b>
        <button class="btn mini" ${page>=totalPages?"disabled":""} onclick="changeEnterpriseConstructionLogProjectPage(1)">下一页</button>
        <select class="select mini-select" onchange="changeEnterpriseConstructionLogProjectPageSize(this.value)">${[12,24,50].map(size=>`<option value="${size}" ${size===enterpriseConstructionLogProjectViewState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>
      </div>
    </div>
  `;
}

function getEnterpriseConstructionLogProjectFilteredRecords(records){
  const s=enterpriseConstructionLogProjectViewState;
  return records.filter(record=>{
    if(s.workArea&&record.workArea!==s.workArea)return false;
    if(s.keyword&&!`${record.title}${record.workArea}${record.uploader}${record.summary}${record.fileName}`.includes(s.keyword))return false;
    if(s.startDate&&record.date<s.startDate)return false;
    if(s.endDate&&record.date>s.endDate)return false;
    return true;
  });
}

function renderEnterpriseConstructionLogProjectFilters(records){
  const s=enterpriseConstructionLogProjectViewState;
  const areas=[...new Set(records.map(record=>record.workArea))];
  return `<div class="project-log-filter-row enterprise-log-project-filter-row">
    <label class="project-log-filter-item"><span>施工工区</span><select id="enterpriseProjectLogArea" class="select"><option value="">请选择施工工区</option>${areas.map(area=>`<option ${area===s.workArea?"selected":""}>${area}</option>`).join("")}</select></label>
    <label class="project-log-filter-item project-log-date-filter"><span>上报日期</span><div><input id="enterpriseProjectLogStart" class="input" type="date" value="${s.startDate}"/><em>-</em><input id="enterpriseProjectLogEnd" class="input" type="date" value="${s.endDate}"/></div></label>
    <label class="project-log-filter-item"><span>关键内容</span><input id="enterpriseProjectLogKeyword" class="input" value="${escapeAttr(s.keyword)}" placeholder="请输入施工日志内容关键字" onkeydown="if(event.key==='Enter')queryEnterpriseConstructionLogProject()"/></label>
    <button class="btn primary" onclick="queryEnterpriseConstructionLogProject()">查询</button><button class="btn" onclick="resetEnterpriseConstructionLogProject()">重置</button>
  </div>`;
}

function renderEnterpriseConstructionLogProjectView(){
  const project=getEnterpriseConstructionLogProjectById(enterpriseConstructionLogProjectViewState.projectId);
  if(!project)return;
  const records=getEnterpriseConstructionLogProjectRecords(project);
  if(!records.some(item=>item.date===enterpriseConstructionLogProjectViewState.selectedDate)){
    enterpriseConstructionLogProjectViewState.selectedDate=records[0]?.date||"";
  }
  const filteredRecords=getEnterpriseConstructionLogProjectFilteredRecords(records);
  const totalPages=Math.max(1,Math.ceil(filteredRecords.length/enterpriseConstructionLogProjectViewState.pageSize));
  enterpriseConstructionLogProjectViewState.page=Math.min(Math.max(1,enterpriseConstructionLogProjectViewState.page),totalPages);
  const start=(enterpriseConstructionLogProjectViewState.page-1)*enterpriseConstructionLogProjectViewState.pageSize;
  const pageRecords=filteredRecords.slice(start,start+enterpriseConstructionLogProjectViewState.pageSize);
  const html=`
    <div class="enterprise-log-project-view">
      <section class="card project-log-list-panel">
        <div class="project-log-panel-head enterprise-log-project-panel-head">
          <div>
            <h3>施工日志列表</h3>
          </div>
        </div>
        ${renderEnterpriseConstructionLogProjectFilters(records)}
        <div class="project-log-card-grid enterprise-log-project-card-grid">
          ${pageRecords.length?pageRecords.map(renderEnterpriseConstructionLogProjectCard).join(""):`<div class="project-log-empty">本月暂无已上报施工日志</div>`}
        </div>
        ${renderEnterpriseConstructionLogProjectPagination(filteredRecords)}
      </section>
      <aside class="project-log-right-panel enterprise-log-project-right-panel">
        ${renderEnterpriseConstructionLogProjectCalendar(project)}
      </aside>
    </div>
  `;
  replaceEnterpriseConstructionLogFragment(modalBody,html);
}

function openEnterpriseConstructionLogReportDetail(projectId,day){
  const project=getEnterpriseConstructionLogProjectById(projectId);
  const record=project&&getEnterpriseConstructionLogProjectRecords(project).find(item=>item.day===Number(day));
  if(!record)return;
  const detail=getProjectLogReadonlyOnlineDetail(record);
  const baseInfo=renderProjectLogReadonlyBaseInfo(record,project.projectName);
  const content=record.mode==="online"?`
    ${renderProjectLogReadonlySection("基础信息",baseInfo)}
    ${renderProjectLogReadonlySection("人员信息",`<div class="project-detail-info-grid three">${detail.personnel.map(item=>renderProjectLogReadonlyField(item[0],`${item[1]}人`)).join("")}</div>`)}
    ${renderProjectLogReadonlySection("今日主要工作",renderProjectLogReadonlyWorkTable(detail.today))}
    ${renderProjectLogReadonlySection("明日主要工作",renderProjectLogReadonlyWorkTable(detail.tomorrow,false))}
    ${renderProjectLogReadonlySection("风险情况",renderProjectLogReadonlyRiskCards(detail.risks))}
    ${renderProjectLogReadonlySection("施工照片",renderProjectLogReadonlyPhotos(detail.photos))}
    ${renderProjectLogReadonlySection("发生停工情况",`<div class="project-log-readonly-text">${detail.stop}</div>`)}
  `:`
    ${renderProjectLogReadonlySection("基础信息",baseInfo)}
    ${renderProjectLogReadonlySection("施工日志文件",renderProjectLogReadonlyFiles(getProjectLogReadonlyFiles(record)))}
    ${renderProjectLogReadonlySection("备注说明",`<div class="project-log-readonly-text">${record.summary}</div>`)}
  `;
  openModal("施工日志详情",`<div class="project-log-readonly-detail">${content}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("project-log-online-report-modal");
}

function selectEnterpriseConstructionLogProjectDate(date){
  enterpriseConstructionLogProjectViewState.selectedDate=date;
  renderEnterpriseConstructionLogProjectView();
}

function changeEnterpriseConstructionLogProjectPage(delta){
  enterpriseConstructionLogProjectViewState.page=Math.max(1,enterpriseConstructionLogProjectViewState.page+Number(delta||0));
  renderEnterpriseConstructionLogProjectView();
}

function changeEnterpriseConstructionLogProjectPageSize(value){
  enterpriseConstructionLogProjectViewState.pageSize=Number(value)||50;
  enterpriseConstructionLogProjectViewState.page=1;
  renderEnterpriseConstructionLogProjectView();
}

function queryEnterpriseConstructionLogProject(){
  const s=enterpriseConstructionLogProjectViewState;
  s.workArea=document.getElementById("enterpriseProjectLogArea")?.value||"";
  s.startDate=document.getElementById("enterpriseProjectLogStart")?.value||"";
  s.endDate=document.getElementById("enterpriseProjectLogEnd")?.value||"";
  s.keyword=document.getElementById("enterpriseProjectLogKeyword")?.value.trim()||"";
  s.page=1;
  renderEnterpriseConstructionLogProjectView();
}

function resetEnterpriseConstructionLogProject(){
  Object.assign(enterpriseConstructionLogProjectViewState,{workArea:"",keyword:"",startDate:"",endDate:"",page:1});
  renderEnterpriseConstructionLogProjectView();
}

function changeEnterpriseConstructionLogProjectMonth(delta){
  const meta=getEnterpriseConstructionLogMonthMetaByValue(enterpriseConstructionLogProjectViewState.month);
  const next=new Date(meta.year,meta.month-1+Number(delta||0),1);
  const nextValue=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,"0")}`;
  if(isEnterpriseConstructionLogFutureMonth(nextValue))return;
  enterpriseConstructionLogProjectViewState.month=nextValue;
  enterpriseConstructionLogProjectViewState.selectedDate="";
  enterpriseConstructionLogProjectViewState.page=1;
  renderEnterpriseConstructionLogProjectView();
}

function openEnterpriseConstructionLogDetail(id){
  const project=getEnterpriseConstructionLogProjectById(id);
  if(!project)return;
  Object.assign(enterpriseConstructionLogProjectViewState,{
    projectId:project.id,
    month:enterpriseConstructionLogState.reportMonth,
    selectedDate:"",
    workArea:"",keyword:"",startDate:"",endDate:"",
    page:1,
    pageSize:50
  });
  const records=getEnterpriseConstructionLogProjectRecords(project);
  enterpriseConstructionLogProjectViewState.selectedDate=records[0]?.date||"";
  openModal("项目施工日志",`<div class="enterprise-log-project-view"></div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("enterprise-log-project-modal");
  renderEnterpriseConstructionLogProjectView();
}

Object.assign(window,{
  renderEnterpriseConstructionLogPage,
  renderEnterpriseConstructionLogTable,
  bindEnterpriseConstructionLogDetailButtons,
  syncEnterpriseConstructionLogBranchOptions,
  queryEnterpriseConstructionLog,
  resetEnterpriseConstructionLog,
  setEnterpriseConstructionLogStat,
  changeEnterpriseConstructionLogPage,
  changeEnterpriseConstructionLogPageSize,
  changeEnterpriseConstructionLogMonth,
  openEnterpriseConstructionLogDetail,
  openEnterpriseConstructionLogReportDetail,
  selectEnterpriseConstructionLogProjectDate,
  changeEnterpriseConstructionLogProjectPage,
  changeEnterpriseConstructionLogProjectPageSize
  ,queryEnterpriseConstructionLogProject
  ,resetEnterpriseConstructionLogProject
  ,changeEnterpriseConstructionLogProjectMonth
});

const outputForecastTabs=["施工项目（已立项）","订单项目（未立项）"];
