/* 企业管理 / 经济 / 大屏看板 */
const economyDashboardState={tab:"diagnosis",edition:"domestic",projectName:"",projectType:"",region:"",month:"2026-06",sortKey:"",sortDirection:"",page:1,pageSize:50};
window.economyDashboardState=economyDashboardState;
const economyDiagnosisTaskState={period:"",edition:"",diagnosisStatus:"",publishStatus:"",page:1,pageSize:15};
let economyDiagnosisTasks=[
  {id:1,period:"202607",edition:"international",projects:86,managed:86,diagnosisStatus:"待诊断",publishStatus:"待发布",publicTime:"",sent:0,generated:0},
  {id:2,period:"202606",projects:343,managed:343,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-07-15",sent:309,generated:393},
  {id:3,period:"202605",projects:336,managed:336,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-06-15",sent:308,generated:392},
  {id:4,period:"202604",projects:325,managed:325,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-05-15",sent:300,generated:381},
  {id:5,period:"202603",projects:306,managed:306,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-04-15",sent:292,generated:375},
  {id:6,period:"202602",projects:302,managed:302,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-03-17",sent:288,generated:370},
  {id:7,period:"202601",projects:325,managed:325,diagnosisStatus:"待诊断",publishStatus:"待发布",publicTime:"",sent:0,generated:0},
  {id:8,period:"202512",projects:298,managed:298,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2026-01-15",sent:0,generated:367},
  {id:9,period:"202511",projects:292,managed:292,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-12-16",sent:0,generated:370},
  {id:10,period:"202510",projects:288,managed:288,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-11-15",sent:2,generated:372},
  {id:11,period:"202509",projects:279,managed:279,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-10-16",sent:0,generated:365},
  {id:12,period:"202508",projects:277,managed:277,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-09-19",sent:0,generated:362},
  {id:13,period:"202507",projects:276,managed:276,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-08-18",sent:0,generated:357},
  {id:14,period:"202506",projects:271,managed:271,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-07-15",sent:0,generated:352},
  {id:15,period:"202505",projects:262,managed:262,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-06-16",sent:0,generated:350},
  {id:16,period:"202504",projects:239,managed:239,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-05-19",sent:1,generated:348},
  {id:17,period:"202503",projects:231,managed:231,diagnosisStatus:"已诊断",publishStatus:"已公开",publicTime:"2025-04-17",sent:5,generated:316}
];
economyDiagnosisTasks.forEach(row=>{row.edition=row.edition||"domestic";});
let economyDiagnosisResults=[
  {id:1,resultCode:"ECO-202606-001",period:"202606",edition:"domestic",taskName:"2026年06月国内版经济诊断",taskCode:"TASK-ECO-202606-001",projectCount:343,warningCount:126,diagnosisStatus:"已完成",publishStatus:"已发布",createdAt:"2026-07-15 09:20",createdBy:"王安全",publishedAt:"2026-07-15 14:30"},
  {id:2,resultCode:"ECO-202606-002",period:"202606",edition:"domestic",taskName:"2026年06月国内版经济诊断（重跑）",taskCode:"TASK-ECO-202606-002",projectCount:343,warningCount:119,diagnosisStatus:"已完成",publishStatus:"未发布",createdAt:"2026-07-16 10:10",createdBy:"李明",publishedAt:""},
  {id:3,resultCode:"ECO-202607-001",period:"202607",edition:"international",taskName:"2026年07月国际版经济诊断",taskCode:"TASK-ECO-202607-001",projectCount:86,warningCount:32,diagnosisStatus:"已完成",publishStatus:"未发布",createdAt:"2026-08-01 09:00",createdBy:"王安全",publishedAt:""}
];
const economyDiagnosisResultState={period:"",edition:"",diagnosisStatus:"",publishStatus:"",page:1,pageSize:15};
function getEconomyDiagnosisResultRows(){return economyDiagnosisResults.filter(row=>(!economyDiagnosisResultState.period||row.period===economyDiagnosisResultState.period)&&(!economyDiagnosisResultState.edition||row.edition===economyDiagnosisResultState.edition)&&(!economyDiagnosisResultState.diagnosisStatus||row.diagnosisStatus===economyDiagnosisResultState.diagnosisStatus)&&(!economyDiagnosisResultState.publishStatus||row.publishStatus===economyDiagnosisResultState.publishStatus));}
function resetEconomyDiagnosisResultFilters(){Object.assign(economyDiagnosisResultState,{period:"",edition:"",diagnosisStatus:"",publishStatus:"",page:1});renderEconomyDiagnosisResultPage();}
function queryEconomyDiagnosisResults(){economyDiagnosisResultState.period=document.getElementById("economyDiagnosisResultPeriod")?.value||"";economyDiagnosisResultState.edition=document.getElementById("economyDiagnosisResultEdition")?.value||"";economyDiagnosisResultState.diagnosisStatus=document.getElementById("economyDiagnosisResultDiagnosisStatus")?.value||"";economyDiagnosisResultState.publishStatus=document.getElementById("economyDiagnosisResultPublishStatus")?.value||"";economyDiagnosisResultState.page=1;renderEconomyDiagnosisResultPage();}
function changeEconomyDiagnosisResultPage(page){economyDiagnosisResultState.page=Math.max(1,Number(page)||1);renderEconomyDiagnosisResultPage();}
function publishEconomyDiagnosisResult(id){const result=economyDiagnosisResults.find(row=>row.id===Number(id));if(!result)return;if(result.diagnosisStatus!=="已完成")return showToast("诊断未完成，暂不能发布");economyDiagnosisResults.forEach(row=>{if(row.period===result.period)row.publishStatus="未发布";});result.publishStatus="已发布";result.publishedAt="2026-08-22 10:30";renderEconomyDiagnosisResultPage();showToast(`已发布${result.resultCode}，同一期其他结果已自动取消发布`);}
function revokeEconomyDiagnosisResult(id){const result=economyDiagnosisResults.find(row=>row.id===Number(id));if(!result)return;result.publishStatus="未发布";result.publishedAt="";renderEconomyDiagnosisResultPage();showToast("诊断结果已撤回");}
function addEconomyDiagnosisResult(task){
  const samePeriod=economyDiagnosisResults.filter(row=>row.period===task.period);
  economyDiagnosisResults.push({id:Date.now(),resultCode:`ECO-${task.period}-${String(samePeriod.length+1).padStart(3,"0")}`,period:task.period,edition:task.edition,taskName:`${task.period.slice(0,4)}年${task.period.slice(4)}月${task.edition==="international"?"国际版":"国内版"}经济诊断`,taskCode:`TASK-ECO-${task.period}-${String(samePeriod.length+1).padStart(3,"0")}`,projectCount:task.projects,warningCount:task.generated?Math.max(0,task.generated-50):0,diagnosisStatus:"已完成",publishStatus:"未发布",createdAt:"2026-08-22 10:30",createdBy:"王安全",publishedAt:""});
}
function renderEconomyDiagnosisResultPage(){
  detailPage.style.display="none";listPage.style.display="flex";
  const rows=getEconomyDiagnosisResultRows(),totalPages=Math.max(1,Math.ceil(rows.length/economyDiagnosisResultState.pageSize));economyDiagnosisResultState.page=Math.min(economyDiagnosisResultState.page,totalPages);const start=(economyDiagnosisResultState.page-1)*economyDiagnosisResultState.pageSize,pageRows=rows.slice(start,start+economyDiagnosisResultState.pageSize);const periods=[...new Set(economyDiagnosisResults.map(row=>row.period))];
  const titleHtml=`<div class="compact-title-row"><div class="module-title">经济诊断 / 诊断结果</div></div>`;
  const queryHtml=`<section class="card unified-query-card"><div class="card-hd"><div class="card-title">查询条件</div><div class="actions"><button class="btn" onclick="resetEconomyDiagnosisResultFilters()">重置</button><button class="btn primary" onclick="queryEconomyDiagnosisResults()">查询</button></div></div><div class="card-bd"><div class="search-grid"><div class="form-item"><label>诊断期数</label><select id="economyDiagnosisResultPeriod" class="select"><option value="">全部</option>${periods.map(value=>`<option value="${value}" ${value===economyDiagnosisResultState.period?"selected":""}>${value}</option>`).join("")}</select></div><div class="form-item"><label>适用版本</label><select id="economyDiagnosisResultEdition" class="select"><option value="">全部</option><option value="domestic" ${economyDiagnosisResultState.edition==="domestic"?"selected":""}>国内版</option><option value="international" ${economyDiagnosisResultState.edition==="international"?"selected":""}>国际版</option></select></div><div class="form-item"><label>诊断状态</label><select id="economyDiagnosisResultDiagnosisStatus" class="select"><option value="">全部</option><option value="已完成" ${economyDiagnosisResultState.diagnosisStatus==="已完成"?"selected":""}>已完成</option></select></div><div class="form-item"><label>发布状态</label><select id="economyDiagnosisResultPublishStatus" class="select"><option value="">全部</option><option value="已发布" ${economyDiagnosisResultState.publishStatus==="已发布"?"selected":""}>已发布</option><option value="未发布" ${economyDiagnosisResultState.publishStatus==="未发布"?"selected":""}>未发布</option></select></div></div></div></section>`;
  const contentHtml=`<section class="card table-card economy-diagnosis-result-table-card"><div class="card-hd"><div class="card-title">诊断结果列表</div><div class="actions"><button class="btn" onclick="renderEconomyDiagnosisResultPage();showToast('诊断结果已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济诊断结果列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table><thead><tr><th>序号</th><th>结果编号</th><th>诊断期数</th><th>适用版本</th><th>诊断任务</th><th>诊断项目数量</th><th>预警数量</th><th>诊断状态</th><th>发布状态</th><th>生成时间</th><th>创建人</th><th>操作</th></tr></thead><tbody>${pageRows.map((row,index)=>`<tr><td>${start+index+1}</td><td>${row.resultCode}</td><td>${row.period}</td><td>${row.edition==="international"?"国际版":"国内版"}</td><td class="ellipsis" title="${escapeAttr(row.taskName)}">${escapeAttr(row.taskName)}</td><td>${row.projectCount}</td><td>${row.warningCount}</td><td>${renderEconomyDiagnosisTaskStatus(row.diagnosisStatus)}</td><td>${renderEconomyDiagnosisTaskStatus(row.publishStatus)}</td><td>${row.createdAt}</td><td>${row.createdBy}</td><td class="actions"><button class="link" onclick="showToast('已打开${row.resultCode}详情')">查看</button>${row.publishStatus==="已发布"?`<button class="link" onclick="revokeEconomyDiagnosisResult(${row.id})">撤回</button>`:`<button class="link" onclick="publishEconomyDiagnosisResult(${row.id})">发布</button>`}</td></tr>`).join("")||`<tr><td colspan="12" class="empty-state">暂无诊断结果</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><div class="pager"><button class="btn mini" ${economyDiagnosisResultState.page<=1?"disabled":""} onclick="changeEconomyDiagnosisResultPage(${economyDiagnosisResultState.page-1})">上一页</button><b>第 ${economyDiagnosisResultState.page} / ${totalPages} 页</b><button class="btn mini" ${economyDiagnosisResultState.page>=totalPages?"disabled":""} onclick="changeEconomyDiagnosisResultPage(${economyDiagnosisResultState.page+1})">下一页</button></div></div></section>`;
  listPage.innerHTML=StandardList.render({variant:"table",titleHtml,queryHtml,contentHtml});
}
function getEconomyDiagnosisTaskRows(){
  return economyDiagnosisTasks.filter(row=>(!economyDiagnosisTaskState.period||row.period.includes(economyDiagnosisTaskState.period))&&(!economyDiagnosisTaskState.edition||row.edition===economyDiagnosisTaskState.edition)&&(!economyDiagnosisTaskState.diagnosisStatus||row.diagnosisStatus===economyDiagnosisTaskState.diagnosisStatus)&&(!economyDiagnosisTaskState.publishStatus||row.publishStatus===economyDiagnosisTaskState.publishStatus));
}
function setEconomyDiagnosisTaskFilter(key,value){economyDiagnosisTaskState[key]=String(value||"").trim();economyDiagnosisTaskState.page=1;renderEconomyDiagnosisTaskPageRoute();}
function changeEconomyDiagnosisTaskPage(page){economyDiagnosisTaskState.page=Math.max(1,Number(page)||1);renderEconomyDiagnosisTaskPageRoute();}
function resetEconomyDiagnosisTaskFilters(){Object.assign(economyDiagnosisTaskState,{period:"",edition:"",diagnosisStatus:"",publishStatus:"",page:1});renderEconomyDiagnosisTaskPageRoute();}
function renderEconomyDiagnosisTaskStatus(value,type){const cls=value==="已诊断"||value==="已公开"?"success":value==="待诊断"||value==="待发布"?"pending":"";return `<span class="economy-diagnosis-task-status ${cls}">${value||"-"}</span>`;}
const economyDiagnosisTaskProjectState={period:"202608",edition:"domestic",need:"",status:"",company:"",projectName:"",cmNo:"",selected:new Set(),editingId:0};
function getEconomyDiagnosisTaskProjects(){
  const source=typeof constructionProjectData!=="undefined"&&Array.isArray(constructionProjectData)?constructionProjectData:[];
  const sourceById=new Map(source.map(row=>[String(row.id),row]));
  return getEconomyDiagnosisProjects().map((row,index)=>{
    const sourceRow=sourceById.get(String(row.sourceProjectId))||{};
    return {id:String(row.sourceProjectId||row.id||index+1),projectName:row.projectName||"",cmNo:sourceRow.projectCode||`CM${String(index+1).padStart(6,"0")}`,company:row.company||"",branch:row.branch||"",status:sourceRow.status||"在建",manager:sourceRow.projectManager||sourceRow.manager||"--",quality:index%9===0?"待补充":"正常",warnings:Object.values(row.warnings||{}).filter(Boolean).length};
  });
}
function getEconomyDiagnosisTaskFilteredProjects(){
  const state=economyDiagnosisTaskProjectState;
  return getEconomyDiagnosisTaskProjects().filter(row=>(!state.need||(state.need==="yes"?state.selected.has(row.id):!state.selected.has(row.id)))&&(!state.status||row.status===state.status)&&(!state.company||row.company===state.company)&&(!state.projectName||row.projectName.includes(state.projectName))&&(!state.cmNo||row.cmNo.includes(state.cmNo)));
}
function renderEconomyDiagnosisTaskOptions(values,current,allText="请选择"){
  return `<option value="">${allText}</option>${[...new Set(values.filter(Boolean))].map(value=>`<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${escapeAttr(value)}</option>`).join("")}`;
}
function queryEconomyDiagnosisTaskProjects(){
  Object.assign(economyDiagnosisTaskProjectState,{need:document.getElementById("economyDiagnosisTaskNeed")?.value||"",status:document.getElementById("economyDiagnosisTaskProjectStatus")?.value||"",company:document.getElementById("economyDiagnosisTaskCompany")?.value||"",projectName:document.getElementById("economyDiagnosisTaskProjectName")?.value.trim()||"",cmNo:document.getElementById("economyDiagnosisTaskCmNo")?.value.trim()||""});
  renderEconomyDiagnosisTaskPicker();
}
function resetEconomyDiagnosisTaskProjects(){Object.assign(economyDiagnosisTaskProjectState,{need:"",status:"",company:"",projectName:"",cmNo:""});renderEconomyDiagnosisTaskPicker();}
function toggleEconomyDiagnosisTaskProject(id,checked){checked?economyDiagnosisTaskProjectState.selected.add(String(id)):economyDiagnosisTaskProjectState.selected.delete(String(id));renderEconomyDiagnosisTaskPicker();}
function toggleAllEconomyDiagnosisTaskProjects(checked){getEconomyDiagnosisTaskFilteredProjects().forEach(row=>checked?economyDiagnosisTaskProjectState.selected.add(row.id):economyDiagnosisTaskProjectState.selected.delete(row.id));renderEconomyDiagnosisTaskPicker();}
function setEconomyDiagnosisTaskNeed(value){const rows=getEconomyDiagnosisTaskFilteredProjects();if(!rows.length)return showToast("当前没有可操作的项目");rows.forEach(row=>value==="yes"?economyDiagnosisTaskProjectState.selected.add(row.id):economyDiagnosisTaskProjectState.selected.delete(row.id));renderEconomyDiagnosisTaskPicker();}
function renderEconomyDiagnosisTaskPicker(){
  const body=document.getElementById("modalBody");if(!body)return;
  const all=getEconomyDiagnosisTaskProjects(),rows=getEconomyDiagnosisTaskFilteredProjects(),selected=getEconomyDiagnosisTaskProjects().filter(row=>economyDiagnosisTaskProjectState.selected.has(row.id));
  const warningCount=selected.reduce((sum,row)=>sum+row.warnings,0),qualityCount=selected.filter(row=>row.quality!=="正常").length;
  const companies=[...new Set(all.map(row=>row.company))];
  body.innerHTML=`<div class="economy-diagnosis-task-picker"><input type="hidden" id="economyTaskPeriod" value="${escapeAttr(economyDiagnosisTaskProjectState.period)}"><input type="hidden" id="economyTaskEdition" value="${escapeAttr(economyDiagnosisTaskProjectState.edition)}"><section class="economy-diagnosis-task-picker-query"><div class="form-item"><label>是否需要诊断</label><select class="select" id="economyDiagnosisTaskNeed"><option value="">请选择</option><option value="yes" ${economyDiagnosisTaskProjectState.need==="yes"?"selected":""}>是</option><option value="no" ${economyDiagnosisTaskProjectState.need==="no"?"selected":""}>否</option></select></div><div class="form-item"><label>诊断状态</label><select class="select" id="economyDiagnosisTaskProjectStatus">${renderEconomyDiagnosisTaskOptions(all.map(row=>"待诊断"),economyDiagnosisTaskProjectState.status,"请选择")}</select></div><div class="form-item"><label>所属组织</label><select class="select" id="economyDiagnosisTaskCompany">${renderEconomyDiagnosisTaskOptions(companies,economyDiagnosisTaskProjectState.company,"请选择组织")}</select></div><div class="form-item"><label>项目名称</label><input class="input" id="economyDiagnosisTaskProjectName" value="${escapeAttr(economyDiagnosisTaskProjectState.projectName)}" placeholder="请输入项目名称"></div><div class="form-item"><label>CM编号</label><input class="input" id="economyDiagnosisTaskCmNo" value="${escapeAttr(economyDiagnosisTaskProjectState.cmNo)}" placeholder="请输入CM编号"></div><div class="economy-diagnosis-task-picker-query-actions"><button class="btn primary" onclick="queryEconomyDiagnosisTaskProjects()">查询</button><button class="btn" onclick="resetEconomyDiagnosisTaskProjects()">刷新</button></div></section><section class="economy-diagnosis-task-picker-summary"><strong>当期经济纳管项目清单</strong><span class="tag blue">${economyDiagnosisTaskProjectState.edition==="international"?"国际版":"国内版"}</span><div><span>纳管项目数量：<b>${all.length}</b></span><span>标记为不需要诊断的项目数：<b>${all.length-selected.length}</b></span><span>本次需要诊断的项目数：<b>${selected.length}</b></span><span>本次已诊断的项目数：<b>0</b></span><span>本次待诊断的项目数：<b>${selected.length}</b></span><span>汇总预警数：<b>${warningCount}</b></span><span>数据质量待补充：<b>${qualityCount}</b></span></div></section><div class="economy-diagnosis-task-picker-actions"><button class="btn primary" onclick="showToast('诊断数据已刷新')">刷新诊断数据</button><button class="btn primary" onclick="saveEconomyDiagnosisTask(${economyDiagnosisTaskProjectState.editingId||0})">提交诊断</button><button class="btn success" onclick="setEconomyDiagnosisTaskNeed('yes')">标记为需诊断</button><button class="btn danger" onclick="setEconomyDiagnosisTaskNeed('no')">标记为不诊断</button><button class="btn" onclick="showToast('发布功能将在诊断完成后启用')">发布</button><button class="btn" onclick="showToast('公开功能将在发布后启用')">公开</button><button class="btn" onclick="showToast('发布退回功能已触发')">发布退回</button><button class="btn" onclick="showToast('数据导出任务已创建')">数据导出⌄</button></div><div class="table-wrap roster-table-wrap economy-diagnosis-task-picker-table"><table><thead><tr><th class="check"><input type="checkbox" id="economyDiagnosisTaskProjectAll" onchange="toggleAllEconomyDiagnosisTaskProjects(this.checked)"></th><th>序号</th><th>是否需要诊断</th><th>诊断状态</th><th>CM编号</th><th>项目名称</th><th>公司/分公司</th><th>项目数据质量情况</th><th>二级预警及雷数</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td class="check"><input type="checkbox" ${economyDiagnosisTaskProjectState.selected.has(row.id)?"checked":""} onchange="toggleEconomyDiagnosisTaskProject('${escapeAttr(row.id)}',this.checked)"></td><td>${index+1}</td><td><span class="economy-diagnosis-need-indicator ${economyDiagnosisTaskProjectState.selected.has(row.id)?"active":""}">●</span><b>${economyDiagnosisTaskProjectState.selected.has(row.id)?"是":"否"}</b></td><td>${renderEconomyDiagnosisTaskStatus("待诊断","diagnosis")}</td><td>${escapeAttr(row.cmNo)}</td><td class="ellipsis" title="${escapeAttr(row.projectName)}">${escapeAttr(row.projectName)}</td><td>${escapeAttr(row.company)}/${escapeAttr(row.branch)}</td><td>${row.quality}</td><td>${row.warnings}</td></tr>`).join("")||`<tr><td colspan="9" class="empty-state">暂无符合条件的项目</td></tr>`}</tbody></table></div></div>`;
}
function openEconomyDiagnosisTaskEditor(id=""){
  const row=economyDiagnosisTasks.find(item=>item.id===Number(id));
  Object.assign(economyDiagnosisTaskProjectState,{period:row?.period||"202608",edition:row?.edition||"domestic",need:"",status:"",company:"",projectName:"",cmNo:"",editingId:Number(id)||0,selected:new Set()});
  getEconomyDiagnosisTaskProjects().slice(0,row?.projects||getEconomyDiagnosisTaskProjects().length).forEach(item=>economyDiagnosisTaskProjectState.selected.add(item.id));
  const period=economyDiagnosisTaskProjectState.period;
  openModal(`${period.slice(0,4)}年${period.slice(4,6)}月诊断配置`,"",`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveEconomyDiagnosisTask(${Number(id)||0})">保存</button>` ,"large");
  renderEconomyDiagnosisTaskPicker();
}
function saveEconomyDiagnosisTask(id){
  const period=document.getElementById("economyTaskPeriod")?.value.trim();
  if(!/^\d{6}$/.test(period||"")){showToast("请输入6位诊断期数，例如202607");return;}
  const existing=economyDiagnosisTasks.find(item=>item.id===Number(id));
  const edition=document.getElementById("economyTaskEdition")?.value||"domestic";
  const selectedCount=economyDiagnosisTaskProjectState.selected?.size||0;
  if(!selectedCount){showToast("请至少选择一个需要诊断的项目");return;}
  if(existing){existing.period=period;existing.edition=edition;existing.projects=selectedCount;existing.managed=selectedCount;existing.generated=selectedCount+50;}
  else economyDiagnosisTasks.unshift({id:Date.now(),period,edition,projects:selectedCount,managed:selectedCount,diagnosisStatus:"待诊断",publishStatus:"待发布",publicTime:"",sent:0,generated:selectedCount+50});
  closeModal();renderEconomyDiagnosisTaskPageRoute();showToast(id?"诊断任务已保存":"诊断任务已创建");
}
function openEconomyDiagnosisTaskView(id){const row=economyDiagnosisTasks.find(item=>item.id===Number(id));if(!row)return;showToast(`已打开${row.period}诊断任务`);}
function startEconomyDiagnosisTask(id){const row=economyDiagnosisTasks.find(item=>item.id===Number(id));if(row){row.diagnosisStatus="已诊断";row.projects=row.managed||343;row.generated=row.projects+50;addEconomyDiagnosisResult(row);renderEconomyDiagnosisTaskPageRoute();showToast("诊断任务已完成，并生成一条诊断结果");}}
function getEconomyDiagnosisTaskAction(row){return `<button class="link" onclick="openEconomyDiagnosisTaskView(${row.id})">查看</button><button class="link ${row.diagnosisStatus!=="待诊断"?"disabled":""}" ${row.diagnosisStatus!=="待诊断"?"disabled":""} onclick="startEconomyDiagnosisTask(${row.id})">${row.diagnosisStatus==="待诊断"?"开始诊断":"编辑"}</button>`;}
function syncEconomyDiagnosisTaskFilters(){
  economyDiagnosisTaskState.period=document.getElementById("economyDiagnosisTaskPeriod")?.value||"";
  economyDiagnosisTaskState.edition=document.getElementById("economyDiagnosisTaskEdition")?.value||"";
  economyDiagnosisTaskState.diagnosisStatus=document.getElementById("economyDiagnosisTaskDiagnosisStatus")?.value||"";
  economyDiagnosisTaskState.publishStatus=document.getElementById("economyDiagnosisTaskPublishStatus")?.value||"";
  economyDiagnosisTaskState.page=1;
  renderEconomyDiagnosisTaskPageRoute();
}
function renderEconomyDiagnosisTaskPage(){
  const rows=getEconomyDiagnosisTaskRows(),totalPages=Math.max(1,Math.ceil(rows.length/economyDiagnosisTaskState.pageSize));
  economyDiagnosisTaskState.page=Math.min(Math.max(1,economyDiagnosisTaskState.page),totalPages);
  const start=(economyDiagnosisTaskState.page-1)*economyDiagnosisTaskState.pageSize,pageRows=rows.slice(start,start+economyDiagnosisTaskState.pageSize);
  const periods=[...new Set(economyDiagnosisTasks.map(row=>row.period))];
  const queryFields=`<div class="form-item"><label>诊断期数</label><select id="economyDiagnosisTaskPeriod" class="select"><option value="">请选择诊断期数</option>${periods.map(value=>`<option value="${value}" ${value===economyDiagnosisTaskState.period?"selected":""}>${value}</option>`).join("")}</select></div><div class="form-item"><label>适用版本</label><select id="economyDiagnosisTaskEdition" class="select"><option value="">请选择适用版本</option><option value="domestic" ${economyDiagnosisTaskState.edition==="domestic"?"selected":""}>国内版</option><option value="international" ${economyDiagnosisTaskState.edition==="international"?"selected":""}>国际版</option></select></div><div class="form-item"><label>诊断状态</label><select id="economyDiagnosisTaskDiagnosisStatus" class="select"><option value="">请选择</option><option value="已诊断" ${economyDiagnosisTaskState.diagnosisStatus==="已诊断"?"selected":""}>已诊断</option><option value="待诊断" ${economyDiagnosisTaskState.diagnosisStatus==="待诊断"?"selected":""}>待诊断</option></select></div><div class="form-item"><label>发布状态</label><select id="economyDiagnosisTaskPublishStatus" class="select"><option value="">请选择</option><option value="已公开" ${economyDiagnosisTaskState.publishStatus==="已公开"?"selected":""}>已公开</option><option value="待发布" ${economyDiagnosisTaskState.publishStatus==="待发布"?"selected":""}>待发布</option></select></div>`;
  const query=renderUnifiedQueryCard(queryFields,{id:"economyDiagnosisTaskQuery",gridClass:"search-grid economy-diagnosis-task-search",queryFn:"syncEconomyDiagnosisTaskFilters()",resetFn:"resetEconomyDiagnosisTaskFilters()",canCollapse:false});
  const table=`<section class="card table-card economy-diagnosis-task-table-card"><div class="card-hd"><div class="card-title">经济诊断任务列表</div><div class="actions"><button class="btn primary" onclick="openEconomyDiagnosisTaskEditor()">新增</button><button class="btn" onclick="renderEconomyDiagnosisTaskPageRoute();showToast('经济诊断任务已刷新')">刷新</button><button class="btn" onclick="showToast('导出成功：经济诊断任务列表.xlsx')">导出</button></div></div><div class="table-wrap roster-table-wrap"><table class="economy-diagnosis-task-table"><thead><tr><th class="check"><input type="checkbox" aria-label="全选诊断任务"></th><th>序号</th><th>诊断期数</th><th>适用版本</th><th>诊断项目数量</th><th>经济纳管项目数量</th><th>纳管项目诊断率%</th><th>诊断状态</th><th>发布状态</th><th>公开时间</th><th>短信发送情况<br>已发条数 / 生成条数</th><th>操作</th></tr></thead><tbody>${pageRows.map((row,index)=>`<tr><td class="check"><input type="checkbox" aria-label="选择${row.period}"></td><td>${start+index+1}</td><td>${row.period}</td><td>${row.edition==="international"?"国际版":"国内版"}</td><td>${row.projects}</td><td>${row.managed}</td><td>${row.managed?Math.round(row.projects/row.managed*100):0}</td><td>${renderEconomyDiagnosisTaskStatus(row.diagnosisStatus,"diagnosis")}</td><td>${renderEconomyDiagnosisTaskStatus(row.publishStatus,"publish")}</td><td>${row.publicTime||""}</td><td>${row.sent} / ${row.generated}</td><td class="actions">${getEconomyDiagnosisTaskAction(row)}</td></tr>`).join("")||`<tr><td colspan="12" class="empty-state">暂无诊断任务</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><div class="pager"><button class="btn mini" ${economyDiagnosisTaskState.page<=1?"disabled":""} onclick="changeEconomyDiagnosisTaskPage(${economyDiagnosisTaskState.page-1})">上一页</button><b>第 ${economyDiagnosisTaskState.page} / ${totalPages} 页</b><button class="btn mini" ${economyDiagnosisTaskState.page>=totalPages?"disabled":""} onclick="changeEconomyDiagnosisTaskPage(${economyDiagnosisTaskState.page+1})">下一页</button></div></div></section>`;
  return `<div class="economy-diagnosis-task-page">${query}${table}</div>`;
}
function renderEconomyDiagnosisTaskPageRoute(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=StandardList.render({variant:"table",titleHtml:`<div class="compact-title-row"><div class="module-title">经济诊断 / 诊断任务</div></div>`,contentHtml:`<div class="economy-diagnosis-task-page-shell">${renderEconomyDiagnosisTaskPage()}</div>`});
}
const economyDashboardOrgState={company:"",branch:""};
const economyWarningTypes=[
  {key:"subcontract",name:"分包分供等合同预警",internationalCode:"GJ-01",internationalName:"目标成本预警",total:19,red:7,orange:0,yellow:25,blue:0,delta:[-1,0,1,0]},
  {key:"loss",name:"潜亏预警（目标利润率负向偏差）",internationalCode:"GJ-02",internationalName:"目标利润率预警",total:85,red:8,orange:15,yellow:117,blue:35,delta:[1,3,18,-8]},
  {key:"settlement",name:"总包结算预警",internationalCode:"GJ-03",internationalName:"结算预警",total:0,red:1,orange:4,yellow:0,blue:0,delta:[1,2,0,0]},
  {key:"arrears",name:"业主拖欠款预警",internationalCode:"GJ-04",internationalName:"拖欠款预警",total:6,red:4,orange:40,yellow:0,blue:0,delta:[0,6,0,0]}
];
const economyProjectNames=["福建福州保福220千伏输变电工程（电缆隧道部分）施工","新马工业园节能环保产业园项目","杭金衢高速至杭州合高速联络线工程PPP项目第1合同段","内环高架设施提升及功能完善工程","SUOG-2023-CSGX-0423-2023年S32公路独柱墩桥梁加固工程","景德镇记忆旅游休闲街区基础设施项目（一期）","20240040外高桥新市镇G09-01地块幼儿园新建工程","大冶市城乡一体化综合能源站EPC项目","S506 屈原至湘阴公路一期工程施工","三林滨江南片区28-03地块社区中心新建工程","机场联络线工程JCXSG-4标","上海轨道交通23号线一期工程土建8标","北横通道新建工程Ⅵ标","竹园污水处理厂四期工程","临港新片区综合管廊工程","长三角智慧物流园项目","浦东新区雨污混接改造工程","湾区金融中心项目"];
const economyCompanies=["市政集团","上海隧道","上海路桥","运营集团","城市环境","城建设计"];
const economyBranches=["机顶公司","湖南分公司","总承包一部","城市更新工程公司","江西分公司","区域发展事业部"];
const economyCities=["福建省福州市","上海市浦东新区","浙江省杭州市","上海市杨浦区","江苏省苏州市","江西省景德镇市"];
const economyProjectTypeFallback=["轨交","公路","市政","建筑","环境","能源","机场","港口","园林","片区开发","产品","租售","企业管理"];
function getEconomyProjectTypes(){
  const options=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_TYPE"):[];
  return options.length?options:economyProjectTypeFallback;
}
const economyProjectTypes=getEconomyProjectTypes();
function getEconomyDiagnosisProjects(){
  const projects=typeof constructionProjectData!=="undefined"&&Array.isArray(constructionProjectData)?constructionProjectData:[];
  const colors=["red","orange","yellow","blue"];
  return projects.map((project,index)=>{
    const seed=Number(project.id)||index+1;
    const contractAmount=Number(project.projectCost)||0;
    const completed=Number(project.accumulatedOutput)||0;
    return {
      id:`eco-${project.id}`,sourceProjectId:project.id,projectName:project.projectName,projectType:project.projectType,
      company:project.subCompany,branch:project.branchCompany,city:project.provinceCity,region:project.region,
      contractAmount,outputProgress:contractAmount?completed/contractAmount*100:0,
      warnings:{subcontract:seed%3===1?"":colors[seed%4],loss:["red","red","yellow","yellow","red","orange","orange","yellow"][seed%8],settlement:seed%4===3?"red":seed%5===4?"orange":"",arrears:seed%3===0?"red":seed%4===2?"orange":""},
      overdue:{subcontract:seed%5===2,loss:seed%4===1,settlement:seed%6===3,arrears:seed%5===0}
    };
  });
}
function getEconomyEditionProjects(){
  return getEconomyDiagnosisProjects().filter(project=>economyDashboardState.edition==="international"?project.company==="城建国际":project.company!=="城建国际");
}

function setEconomyDashboardTab(tab){renderEconomyDashboardPage(tab);}
function setEconomyDashboardEdition(edition){
  economyDashboardState.edition=edition==="international"?"international":"domestic";
  economyDashboardState.page=1;
  Object.assign(economyDashboardOrgState,{company:"",branch:""});
  renderEconomyDashboardPage("diagnosis");
}
function setEconomyDashboardOrg(selection){Object.assign(economyDashboardOrgState,selection);economyDashboardState.page=1;renderEconomyDashboardPage();}
function setEconomyDashboardFilter(key,value){economyDashboardState[key]=typeof value==="string"?value.trim():value;economyDashboardState.page=1;renderEconomyDashboardPage();}
function resetEconomyDashboardFilters(){Object.assign(economyDashboardState,{projectName:"",projectType:"",region:"",month:"2026-06",page:1});renderEconomyDashboardPage();}
function getEconomyDiagnosisFiltered(){return getEconomyEditionProjects().filter(x=>(!economyDashboardOrgState.company||x.company===economyDashboardOrgState.company)&&(!economyDashboardOrgState.branch||x.branch===economyDashboardOrgState.branch)&&(!economyDashboardState.projectName||x.projectName.includes(economyDashboardState.projectName))&&(!economyDashboardState.projectType||x.projectType===economyDashboardState.projectType)&&(economyDashboardState.edition==="international"||!economyDashboardState.region||x.region===economyDashboardState.region));}
function getEconomyWarningSortValue(row,key){
  const colorWeight={blue:1,yellow:3,orange:5,red:7};
  const color=row.warnings[key];
  return color?(colorWeight[color]||0)+(row.overdue[key]?1:0):0;
}
function getEconomyDiagnosisSorted(list){
  const {sortKey,sortDirection}=economyDashboardState;
  if(!sortKey||!sortDirection)return list;
  const direction=sortDirection==="asc"?1:-1;
  return [...list].sort((a,b)=>{
    const aValue=sortKey==="contractAmount"||sortKey==="outputProgress"?a[sortKey]:getEconomyWarningSortValue(a,sortKey);
    const bValue=sortKey==="contractAmount"||sortKey==="outputProgress"?b[sortKey]:getEconomyWarningSortValue(b,sortKey);
    return (aValue-bValue)*direction;
  });
}
function toggleEconomyDiagnosisSort(key){
  economyDashboardState.page=1;
  if(economyDashboardState.sortKey!==key){
    economyDashboardState.sortKey=key;
    economyDashboardState.sortDirection="asc";
  }else if(economyDashboardState.sortDirection==="asc")economyDashboardState.sortDirection="desc";
  else if(economyDashboardState.sortDirection==="desc"){
    economyDashboardState.sortKey="";
    economyDashboardState.sortDirection="";
  }else economyDashboardState.sortDirection="asc";
  renderEconomyDashboardPage("diagnosis");
}
function renderEconomyDashboardHeader(view="diagnosis"){
  const regionFilter=economyDashboardState.edition==="domestic"?`<select id="economyDashboardRegion" class="select" onchange="setEconomyDashboardFilter('region',this.value)"><option value="">所属区域</option>${["华东区域","华南区域","华北区域","西南区域"].map(x=>`<option ${economyDashboardState.region===x?'selected':''}>${x}</option>`).join('')}</select>`:"";
  const monthPicker=MonthPicker.render({id:"economyDashboardMonth",value:economyDashboardState.month,max:"2026-07",locale:economyDashboardState.edition==="international"&&EconomyI18n.isEnglish()?"en":"zh",placeholder:economyDashboardState.edition==="international"&&EconomyI18n.isEnglish()?"Select month":"请选择年月",className:"economy-diagnosis-month-picker",onChange:value=>setEconomyDashboardFilter("month",value)});
  const filters=view==="diagnosis"?`<div class="economy-dashboard-filters ${economyDashboardState.edition}"><input id="economyDashboardProject" class="input" placeholder="项目名称" value="${escapeAttr(economyDashboardState.projectName)}" onchange="setEconomyDashboardFilter('projectName',this.value)" onkeydown="if(event.key==='Enter'){this.blur()}"/><select id="economyDashboardType" class="select" onchange="setEconomyDashboardFilter('projectType',this.value)"><option value="">项目类型</option>${economyProjectTypes.map(x=>`<option ${economyDashboardState.projectType===x?'selected':''}>${x}</option>`).join('')}</select>${regionFilter}${monthPicker}<button class="btn primary economy-dashboard-download monthly" onclick="openEconomyMonthlyCheckReport()"><img src="./src/assets/economy/download.svg" alt="" aria-hidden="true">月度检验单</button><button class="btn primary economy-dashboard-download report" onclick="openEconomyAnalysisReport()"><img src="./src/assets/economy/download.svg" alt="" aria-hidden="true">分析报告</button>${EconomyI18n.renderSwitch()}</div>`:"";
  const editionTabs=view==="diagnosis"?`<div class="screen-tabs production-screen-tabs economy-edition-tabs" role="tablist" aria-label="经济诊断版本"><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="domestic"}" class="${economyDashboardState.edition==="domestic"?"active":""}" onclick="setEconomyDashboardEdition('domestic')">国内版</button><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="international"}" class="${economyDashboardState.edition==="international"?"active":""}" onclick="setEconomyDashboardEdition('international')">国际版</button></div>`:"";
  const modeTools=editionTabs?`<div class="economy-screen-mode-tools">${editionTabs}</div>`:"";
  return `<div class="safety-screen-header economy-screen-header"><div class="screen-brand"><span class="screen-logo">P</span><strong>数智施工项目经济管理平台</strong></div>${modeTools}${filters}</div>`;
}
function renderEconomyOrgSwitch(){return DashboardOrgSwitch.render({id:"economy-dashboard-org",records:getEconomyEditionProjects(),state:economyDashboardOrgState,onChange:setEconomyDashboardOrg});}
function renderEconomyWarningMark(color,overdue){return color?`<span class="economy-warning-mark ${color} ${overdue?'overdue':''}"></span>`:"";}
function renderEconomyProjectTypeTag(value){
  const rows=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.PROJECT_TYPE||[]):[];
  const row=rows.find(item=>item.name===value);
  const palettes=typeof dataDictionaryPaletteV2284!=="undefined"?dataDictionaryPaletteV2284:[];
  const palette=palettes[Number(row?.palette)]||palettes[0];
  return palette?`<span class="tag" style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${value}</span>`:tag(value,"blue");
}
function openEconomyDiagnosisProjectOverview(projectId){
  const project=typeof constructionProjectData!=="undefined"?constructionProjectData.find(item=>String(item.id)===String(projectId)):null;
  if(!project)return showToast("未找到项目经济数据");
  window.__economyProjectOverviewEmbedProject=project;
  FullscreenModal.open({title:`经济总览 - ${project.projectName}`,content:`<div id="economyProjectOverviewEmbed" class="economy-project-overview-embed">${renderProjectEconomyOverviewContent(project)}</div>`,footer:`<button class="btn" onclick="FullscreenModal.close()">关闭</button>`,className:"economy-project-overview-modal"});
  EconomyI18n.refreshFullscreenChrome();
}
const economyWarningColorMeta={red:{label:"红色",icon:"红"},orange:{label:"橙色",icon:"橙"},yellow:{label:"黄色",icon:"黄"},blue:{label:"蓝色",icon:"蓝"}};
const economyWarningDrillState={color:"",warningTypeKey:"",projectName:"",projectType:"",company:"",branch:""};
function getEconomyWarningProjectCounts(list){
  return Object.fromEntries(Object.keys(economyWarningColorMeta).map(color=>[color,getEconomyWarningProjects(list,color).length]));
}
function getEconomyWarningProjects(list,color,warningTypeKey=""){
  const seen=new Set();
  const rows=list.filter((row,index)=>{
    if(warningTypeKey?row.warnings?.[warningTypeKey]!==color:!new Set(Object.values(row.warnings).filter(Boolean)).has(color))return false;
    const rowKey=String(row.sourceProjectId||row.projectCode||row.projectName||index);
    if(seen.has(rowKey))return false;
    seen.add(rowKey);
    return true;
  });
  return rows.slice(0,Math.max(0,list.length-1));
}
function getEconomyWarningTrend(color,current,total){
  const desired=(economyDashboardState.edition==="international"?{red:-1,orange:1,yellow:0,blue:2}:{red:1,orange:-2,yellow:0,blue:-1})[color]||0;
  const delta=Math.max(current-total,Math.min(current,desired));
  return {delta,direction:delta>0?"up":delta<0?"down":"flat",symbol:delta>0?"↑":delta<0?"↓":"—",label:delta>0?"增加":delta<0?"减少":"持平"};
}
function renderEconomyWarningMetricValue(item,total){
  const trend=getEconomyWarningTrend(item.color,item.value,total);
  const trendIcon=trend.direction==="up"?`<img src="./src/assets/economy-warning/trend-up.svg" alt="上升">`:trend.direction==="down"?`<img src="./src/assets/economy-warning/trend-down.svg" alt="下降">`:`<i aria-label="持平">—</i>`;
  return `<strong class="economy-warning-metric-value"><button type="button" onclick="openEconomyWarningProjectDrill('${item.color}')" title="查看${item.label}列表">${item.value}</button><span class="economy-warning-metric-trend ${trend.direction}" title="较上期${trend.label}${Math.abs(trend.delta)}个"><b>${Math.abs(trend.delta)}</b>${trendIcon}</span></strong>`;
}
function renderEconomyDiagnosisMetrics(list){
  const contract=list.reduce((sum,x)=>sum+x.contractAmount,0);
  const counts=getEconomyWarningProjectCounts(list);
  const warningItems=Object.entries(economyWarningColorMeta).map(([color,meta])=>({label:`${meta.label}预警项目`,value:counts[color],icon:meta.icon,color,warning:true}));
  const summaryItems=[{label:"项目总数",value:list.length,unit:"个",iconSrc:"./src/assets/economy/project-total.svg",color:"blue"},{label:"合同总金额",value:(contract/10000).toFixed(4),unit:"亿元",iconSrc:"./src/assets/economy/contract-total.svg",color:"orange"}];
  const renderItem=item=>`<div class="production-value-metric economy-diagnosis-metric ${item.color} ${item.warning?"warning-clickable":""}">${item.warning?"":`<img class="economy-diagnosis-summary-icon" src="${item.iconSrc}" alt=""/>`}<div><p>${item.label}</p>${item.warning?renderEconomyWarningMetricValue(item,list.length):`<strong>${item.value}<em>${item.unit}</em></strong>`}</div></div>`;
  return `<section class="production-value-top-strip economy-diagnosis-metrics"><div class="economy-diagnosis-summary-group">${summaryItems.map(renderItem).join("")}</div><div class="economy-diagnosis-warning-group">${warningItems.map(renderItem).join("")}</div></section>`;
}
function getEconomyWarningDrillBaseRows(){
  const color=economyWarningDrillState.color;
  return getEconomyWarningProjects(getEconomyDiagnosisFiltered(),color,economyWarningDrillState.warningTypeKey);
}
function getEconomyWarningDrillRows(){
  return getEconomyWarningDrillBaseRows().filter(row=>(!economyWarningDrillState.projectName||row.projectName.includes(economyWarningDrillState.projectName))&&(!economyWarningDrillState.projectType||row.projectType===economyWarningDrillState.projectType)&&(!economyWarningDrillState.company||row.company===economyWarningDrillState.company)&&(!economyWarningDrillState.branch||row.branch===economyWarningDrillState.branch));
}
function getEconomyWarningDrillOptions(key,rows=getEconomyWarningDrillBaseRows()){return [...new Set(rows.map(row=>row[key]).filter(Boolean))];}
function renderEconomyWarningDrillOption(value,current){return `<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${value}</option>`;}
function renderEconomyWarningProjectDrill(){
  syncEconomyDiagnosisColumnTitles();
  const baseRows=getEconomyWarningDrillBaseRows();
  const rows=getEconomyWarningDrillRows();
  const companies=getEconomyWarningDrillOptions("company",baseRows);
  const branchSource=economyWarningDrillState.company?baseRows.filter(row=>row.company===economyWarningDrillState.company):baseRows;
  const branches=getEconomyWarningDrillOptions("branch",branchSource);
  const columns=getVisibleColumns("economyDiagnosis");
  const body=document.getElementById("modalBody");
  if(!body)return;
  body.innerHTML=`<div class="send-drill-modal economy-warning-project-drill">
    ${renderUnifiedQueryCard(`<div class="form-item"><label>项目名称</label><input class="input" id="economyWarningDrillProject" value="${escapeAttr(economyWarningDrillState.projectName)}" placeholder="请输入项目名称"/></div><div class="form-item"><label>项目类型</label><select class="select" id="economyWarningDrillType"><option value="">全部</option>${getEconomyWarningDrillOptions("projectType",baseRows).map(value=>renderEconomyWarningDrillOption(value,economyWarningDrillState.projectType)).join("")}</select></div><div class="form-item"><label>子公司</label><select class="select" id="economyWarningDrillCompany"><option value="">全部</option>${companies.map(value=>renderEconomyWarningDrillOption(value,economyWarningDrillState.company)).join("")}</select></div><div class="form-item"><label>分公司</label><select class="select" id="economyWarningDrillBranch"><option value="">全部</option>${branches.map(value=>renderEconomyWarningDrillOption(value,economyWarningDrillState.branch)).join("")}</select></div>`,{id:"economyWarningDrillQueryCard",title:"查询条件",resetFn:"resetEconomyWarningProjectDrill()",queryFn:"queryEconomyWarningProjectDrill()",gridClass:"search-grid"})}
    <section class="card table-card economy-diagnosis-table-card economy-warning-drill-table-card"><div class="card-hd"><div class="card-title">经济诊断项目清单</div><div class="actions"><button class="btn" onclick="renderEconomyWarningProjectDrill();showToast('经济诊断项目清单已刷新')">刷新</button><button class="btn primary" onclick="showToast('导出成功：经济诊断项目清单.xlsx')">导出</button><button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('economyDiagnosis','renderEconomyWarningProjectDrill')">⚙</button></div></div><div class="table-wrap"><table style="min-width:${getTableMinWidth("economyDiagnosis")}px"><thead><tr>${columns.map(column=>renderEconomyDiagnosisSortHeader({...column,sortable:false},columns)).join("")}</tr></thead><tbody>${rows.map((row,index)=>`<tr>${columns.map(column=>`<td class="${getTableColumnClass("economyDiagnosis",column,columns)}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("economyDiagnosis",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${column.render(row,index)}</td>`).join("")}</tr>`).join("")||`<tr><td colspan="${columns.length}" class="center">暂无项目数据</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页&nbsp;&nbsp;每页 50 条</span></div></section>
  </div>`;
}
function openEconomyWarningProjectDrill(color,warningTypeKey=""){
  Object.assign(economyWarningDrillState,{color,warningTypeKey,projectName:"",projectType:"",company:"",branch:""});
  const warningType=economyWarningTypes.find(type=>type.key===warningTypeKey);
  const titlePrefix=warningType?`${getEconomyWarningDisplayName(warningType)} - `:"";
  openModal(`${titlePrefix}${economyWarningColorMeta[color]?.label||""}预警项目`,"",`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("send-drill-modal-box","economy-warning-drill-modal");
  renderEconomyWarningProjectDrill();
}
function queryEconomyWarningProjectDrill(){
  economyWarningDrillState.projectName=document.getElementById("economyWarningDrillProject")?.value.trim()||"";
  economyWarningDrillState.projectType=document.getElementById("economyWarningDrillType")?.value||"";
  economyWarningDrillState.company=document.getElementById("economyWarningDrillCompany")?.value||"";
  economyWarningDrillState.branch=document.getElementById("economyWarningDrillBranch")?.value||"";
  renderEconomyWarningProjectDrill();
}
function resetEconomyWarningProjectDrill(){Object.assign(economyWarningDrillState,{projectName:"",projectType:"",company:"",branch:""});renderEconomyWarningProjectDrill();}
function getEconomyWarningDisplayName(type,forCard=false,edition=economyDashboardState.edition){
  if(edition==="international")return typeof getProjectEconomyInternationalWarningName==="function"&&type.internationalCode?getProjectEconomyInternationalWarningName(type.internationalCode):(type.internationalName||type.name);
  return forCard&&type.key==="loss"?`潜亏预警<span class="economy-warning-subtitle">（目标利润率负向偏差）</span>`:type.name;
}
function getEconomyWarningCardTrend(typeIndex,colorIndex,current,desiredDelta){
  const patterns=[[1,-1,2,-1],[-1,1,1,-2],[2,-1,-1,1],[0,1,-2,1],[-1,2,-1,0]];
  const steps=[...patterns[(typeIndex*2+colorIndex)%patterns.length]];
  const delta=desiredDelta>0?Math.min(current,desiredDelta):desiredDelta;
  steps[3]=delta;
  const values=[0,0,0,0,Math.max(0,current)];
  for(let index=3;index>=0;index--)values[index]=Math.max(0,values[index+1]-steps[index]);
  return {delta,values};
}
function renderEconomyWarningMiniTrend(values){
  const width=48,height=24,padding=3;
  const min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
  const points=values.map((value,index)=>`${padding+index*(width-padding*2)/(values.length-1)},${height-padding-(value-min)*(height-padding*2)/range}`);
  const labels=values.map((value,index)=>`P-${4-index}：${value}`).join("，").replace("P-0","P0（本期）");
  return `<svg class="economy-warning-mini-trend" viewBox="0 0 ${width} ${height}" role="img" aria-label="${labels}"><title>${labels}</title><polyline points="${points.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>${points.map(point=>{const [cx,cy]=point.split(",");return `<circle cx="${cx}" cy="${cy}" r="1.5" fill="currentColor"/>`;}).join("")}</svg>`;
}
function renderEconomyWarningCards(list){return `<section class="economy-warning-card-grid">${economyWarningTypes.map((type,typeIndex)=>{const counts={red:0,orange:0,yellow:0,blue:0};list.forEach(project=>{const color=project.warnings[type.key];if(color)counts[color]++;});const total=Object.values(counts).reduce((sum,value)=>sum+value,0);return `<article class="economy-warning-card"><h3><img src="./src/assets/economy-warning/level-one-warning-title.svg" alt="">${getEconomyWarningDisplayName(type,true)}<b>${total}</b></h3><div class="economy-warning-card-values">${[[counts.red,type.delta[0],"red"],[counts.orange,type.delta[1],"orange"],[counts.yellow,type.delta[2],"yellow"],[counts.blue,type.delta[3],"blue"]].map(([value,desiredDelta,color],colorIndex)=>{const trend=getEconomyWarningCardTrend(typeIndex,colorIndex,value,desiredDelta);return `<button type="button" class="economy-warning-card-value ${color}" onclick="openEconomyWarningProjectDrill('${color}','${type.key}')" title="查看${getEconomyWarningDisplayName(type)}的${economyWarningColorMeta[color].label}预警项目"><strong>${value}</strong><span><em>${trend.delta>0?'+':''}${trend.delta}</em>${renderEconomyWarningMiniTrend(trend.values)}</span></button>`;}).join('')}</div></article>`;}).join('')}</section>`;}
tableColumnDefinitions.economyDiagnosis=[
  {key:"index",title:"序号",width:50,minWidth:40,align:"center",render:(x,index)=>index+1},
  {key:"projectType",title:"项目类型",width:80,align:"center",render:x=>renderEconomyProjectTypeTag(x.projectType)},
  {key:"projectName",title:"项目名称",width:360,align:"left",render:x=>`<div class="economy-project-name-cell"><button type="button" class="link" title="${escapeAttr(x.projectName)}" onclick="openEconomyDiagnosisProjectOverview('${escapeAttr(x.sourceProjectId)}')">${x.projectName}</button></div>`},
  {key:"organization",title:"子公司/分公司（项管部）",width:220,align:"center",render:x=>`${x.company}/${x.branch}`},
  {key:"contractAmount",title:"合同金额（万元）",width:140,align:"center",sortable:true,render:x=>x.contractAmount.toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2})},
  {key:"outputProgress",title:"产值进度",width:90,align:"center",sortable:true,render:x=>`${x.outputProgress.toFixed(2)}%`},
  ...economyWarningTypes.map(type=>({key:type.key,title:type.name,width:160,align:"center",sortable:true,render:x=>renderEconomyWarningMark(x.warnings[type.key],x.overdue[type.key])}))
];
function syncEconomyDiagnosisColumnTitles(){
  economyWarningTypes.forEach(type=>{
    const column=tableColumnDefinitions.economyDiagnosis.find(item=>item.key===type.key);
    if(column)column.title=getEconomyWarningDisplayName(type);
  });
}
function renderEconomyDiagnosisSortHeader(column,columns){
  const active=economyDashboardState.sortKey===column.key?economyDashboardState.sortDirection:"";
  const symbol=active==="asc"?"↑":active==="desc"?"↓":"↕";
  return `<th class="${getTableColumnClass("economyDiagnosis",column,columns)}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("economyDiagnosis",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${column.sortable?`<button type="button" class="economy-table-sort ${active?"active":""}" onclick="toggleEconomyDiagnosisSort('${column.key}')"><span>${column.title}</span><i aria-hidden="true">${symbol}</i></button>`:column.title}</th>`;
}
function renderEconomyDiagnosisTable(list){
  syncEconomyDiagnosisColumnTitles();
  const sortedList=getEconomyDiagnosisSorted(list);
  const total=sortedList.length;
  const totalPages=Math.max(1,Math.ceil(total/economyDashboardState.pageSize));
  economyDashboardState.page=Math.min(Math.max(1,economyDashboardState.page),totalPages);
  const start=(economyDashboardState.page-1)*economyDashboardState.pageSize;
  const pageRows=sortedList.slice(start,start+economyDashboardState.pageSize);
  const columns=getVisibleColumns("economyDiagnosis");
  const card=renderUnifiedTableCard({
    title:"经济诊断项目清单",
    className:"economy-diagnosis-table-card",
    tableKey:"economyDiagnosis",
    tableId:"economyDiagnosisTable",
    theadId:"economyDiagnosisThead",
    tbodyId:"economyDiagnosisTbody",
    totalId:"economyDiagnosisTotal",
    total,
    paginationHtml:`<span id="economyDiagnosisTotal">共 ${total} 条</span><div class="pager"><button class="btn mini" type="button" ${economyDashboardState.page<=1?"disabled":""} onclick="changeEconomyDiagnosisPage(-1)">上一页</button><b>第 ${economyDashboardState.page} / ${totalPages} 页</b><button class="btn mini" type="button" ${economyDashboardState.page>=totalPages?"disabled":""} onclick="changeEconomyDiagnosisPage(1)">下一页</button><select class="select mini-select" onchange="changeEconomyDiagnosisPageSize(this.value)"><option value="10" ${economyDashboardState.pageSize===10?"selected":""}>10条/页</option><option value="20" ${economyDashboardState.pageSize===20?"selected":""}>20条/页</option><option value="50" ${economyDashboardState.pageSize===50?"selected":""}>50条/页</option></select></div>`,
    renderFnName:"renderEconomyDashboardPage",
    refreshAction:"renderEconomyDashboardPage('diagnosis');showToast('经济诊断项目清单已刷新')",
    exportAction:"showToast('导出成功：经济诊断项目清单.xlsx')"
  });
  return card.replace(`<tr id="economyDiagnosisThead">${renderTableHeaderByColumns("economyDiagnosis")}</tr>`,`<tr id="economyDiagnosisThead">${columns.map(column=>renderEconomyDiagnosisSortHeader(column,columns)).join("")}</tr>`).replace('<tbody id="economyDiagnosisTbody"></tbody>',`<tbody id="economyDiagnosisTbody">${pageRows.map((row,index)=>`<tr>${columns.map(column=>`<td class="${getTableColumnClass("economyDiagnosis",column,columns)}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("economyDiagnosis",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${column.key==="index"?start+index+1:column.render(row,index)}</td>`).join("")}</tr>`).join("")||`<tr><td colspan="${columns.length}" class="center">暂无项目数据</td></tr>`}</tbody>`);
}
function changeEconomyDiagnosisPage(delta){economyDashboardState.page+=Number(delta)||0;renderEconomyDashboardPage("diagnosis");}
function changeEconomyDiagnosisPageSize(value){economyDashboardState.pageSize=Number(value)||50;economyDashboardState.page=1;renderEconomyDashboardPage("diagnosis");}
const economyCommandState={month:"2025-03",monthPanelOpen:false,monthPanelYear:2025,organization:"",client:"",projectType:"",headquarters:"",region:"",kpi:"managementFee",trendMode:"company"};
const economyCommandKpis=[
  {key:"profit",label:"目标利润率(含税)",value:"5.12",unit:"%",average:5.12,values:[38.12,30.48,18.62,9.82,16.35,13.46,5.76]},
  {key:"inventory",label:"项目存货率",value:"12.56",unit:"%",average:12.56,values:[41.26,35.88,20.16,12.52,19.84,15.72,8.66]},
  {key:"safetyCost",label:"安措费核销比例",value:"57.11",unit:"%",average:57.11,values:[46.55,38.68,31.22,24.86,18.54,14.35,8.62]},
  {key:"arrears",label:"业主拖欠款",value:"3435.2",unit:"万元",average:34.35,values:[46.55,34.65,10.8,3.98,16.57,13.98,2.1]},
  {key:"managementFee",label:"目标管理费率",value:"3.56",unit:"%",average:3.56,values:[46.55,34.65,10.8,3.98,16.57,13.98,2.1]}
];
const economyCommandCompanies=[
  {name:"市政集团",projects:67,levels:[1,13,15,10],alarms:105},
  {name:"上海路桥",projects:66,levels:[1,5,9,14],alarms:101},
  {name:"数字集团",projects:7,levels:[1,0,3,0],alarms:14},
  {name:"上海隧道",projects:49,levels:[0,2,11,7],alarms:98},
  {name:"城市环境",projects:3,levels:[0,6,6,6],alarms:8},
  {name:"城建设计",projects:1,levels:[0,6,6,6],alarms:8},
  {name:"上海能建",projects:2,levels:[0,6,6,6],alarms:5},
  {name:"运营集团",projects:1,levels:[0,6,6,6],alarms:4}
];
function setEconomyCommandFilter(key,value){economyCommandState[key]=value;renderEconomyDashboardPage("overview");}
function setEconomyCommandKpi(key){economyCommandState.kpi=key;renderEconomyDashboardPage("overview");}
function setEconomyCommandTrendMode(mode){economyCommandState.trendMode=mode==="trend"?"trend":"company";renderEconomyDashboardPage("overview");}
function getEconomyCommandMonthLabel(value=economyCommandState.month){const [year,month]=String(value).split("-");return `${year}年${month}月`;}
function toggleEconomyCommandMonthPicker(event){event?.stopPropagation?.();economyCommandState.monthPanelOpen=!economyCommandState.monthPanelOpen;economyCommandState.monthPanelYear=Number(economyCommandState.month.slice(0,4));renderEconomyCommandMonthPanel();}
function moveEconomyCommandMonthYear(delta,event){event?.stopPropagation?.();economyCommandState.monthPanelYear+=Number(delta)||0;renderEconomyCommandMonthPanel();}
function selectEconomyCommandMonth(month,event){event?.stopPropagation?.();const value=`${economyCommandState.monthPanelYear}-${String(month).padStart(2,"0")}`;if(value>getCurrentMonthValue())return;economyCommandState.month=value;economyCommandState.monthPanelOpen=false;renderEconomyDashboardPage("overview");}
function closeEconomyCommandMonthPicker(){if(!economyCommandState.monthPanelOpen)return;economyCommandState.monthPanelOpen=false;document.getElementById("economyCommandMonthPanel")?.classList.remove("open");document.getElementById("economyCommandMonthInput")?.classList.remove("active");}
function renderEconomyCommandMonthPanel(){
  const panel=document.getElementById("economyCommandMonthPanel"),input=document.getElementById("economyCommandMonthInput");
  if(!panel)return;
  const year=economyCommandState.monthPanelYear,currentMonth=getCurrentMonthValue();
  panel.classList.toggle("open",economyCommandState.monthPanelOpen);input?.classList.toggle("active",economyCommandState.monthPanelOpen);
  panel.innerHTML=economyCommandState.monthPanelOpen?`<div class="SafetyMonthPicker__head"><button type="button" title="上一年" onclick="moveEconomyCommandMonthYear(-1,event)">‹</button><strong>${year}年</strong><button type="button" title="下一年" onclick="moveEconomyCommandMonthYear(1,event)">›</button></div><div class="SafetyMonthPicker__grid">${Array.from({length:12},(_,index)=>index+1).map(month=>{const value=`${year}-${String(month).padStart(2,"0")}`;const disabled=value>currentMonth;return `<button type="button" class="${value===economyCommandState.month?"selected":""} ${disabled?"disabled":""}" ${disabled?"disabled":""} onclick="selectEconomyCommandMonth(${month},event)"><span>${month}月</span></button>`;}).join("")}</div>`:"";
}
function renderEconomyCommandMonthPicker(){return `<div class="SafetyMonthPicker economy-command-month-picker" onclick="event.stopPropagation()"><button type="button" class="SafetyMonthPicker__input ${economyCommandState.monthPanelOpen?"active":""}" id="economyCommandMonthInput" onclick="toggleEconomyCommandMonthPicker(event)"><img class="SafetyMonthPicker__calendar" src="./src/assets/economy/economy-month-picker-file.svg" alt=""><span class="SafetyMonthPicker__value">${getEconomyCommandMonthLabel()}</span><img class="SafetyMonthPicker__arrow" src="./src/assets/economy/economy-month-picker-arrow.svg" alt=""></button><div class="SafetyMonthPicker__panel ${economyCommandState.monthPanelOpen?"open":""}" id="economyCommandMonthPanel"></div></div>`;}
document.addEventListener("click",closeEconomyCommandMonthPicker);
function toggleEconomyCommandFullscreen(){
  const screen=document.getElementById("economyCommandScreen");
  if(!screen)return;
  if(document.fullscreenElement)document.exitFullscreen?.();
  else screen.requestFullscreen?.();
}
function renderEconomyCommandSelect(key,label,options){return `<label class="economy-command-select"><span>${label}</span><select aria-label="${label}" onchange="setEconomyCommandFilter('${key}',this.value)"><option value="">${label}</option>${options.map(item=>`<option value="${item}" ${economyCommandState[key]===item?"selected":""}>${item}</option>`).join("")}</select></label>`;}
function renderEconomyCommandSectionTitle(title,extra=""){return `<div class="economy-command-section-title"><strong>${title}</strong>${extra}</div>`;}
function renderEconomyCommandTrendTabs(){return `<div class="economy-command-trend-tabs" role="tablist" aria-label="统计维度"><button type="button" role="tab" class="${economyCommandState.trendMode==="trend"?"active":""}" aria-selected="${economyCommandState.trendMode==="trend"}" onclick="setEconomyCommandTrendMode('trend')">按趋势</button><button type="button" role="tab" class="${economyCommandState.trendMode==="company"?"active":""}" aria-selected="${economyCommandState.trendMode==="company"}" onclick="setEconomyCommandTrendMode('company')">按公司</button></div>`;}
function getEconomyCommandKpi(){return economyCommandKpis.find(item=>item.key===economyCommandState.kpi)||economyCommandKpis[economyCommandKpis.length-1];}
function renderEconomyCommandKpis(){return `<div class="economy-command-kpis">${economyCommandKpis.map(item=>`<button type="button" class="economy-command-kpi ${item.key===economyCommandState.kpi?"active":""}" aria-pressed="${item.key===economyCommandState.kpi}" onclick="setEconomyCommandKpi('${item.key}')"><span>${item.label}<i title="${item.label}说明">i</i></span><strong>${item.value}<em>${item.unit}</em></strong></button>`).join("")}</div>`;}
const economyCommandMarketAreaPositions={
  CSJ:{left:85,top:64,factor:1.08},
  DW:{left:79,top:83,factor:.96},
  HZ:{left:72,top:64,factor:.92},
  ZY:{left:73,top:54,factor:1.03},
  CY:{left:54,top:55,factor:.88},
  HN:{left:71,top:84,factor:.81},
  JW:{left:34,top:72,factor:.76}
};
function getEconomyCommandMarketAreas(){
  if(typeof ensureMarketAreaDictionaryV2608==="function")ensureMarketAreaDictionaryV2608();
  const rows=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.MARKET_AREA||[]):[];
  return rows.filter(item=>item.status==="启用"&&economyCommandMarketAreaPositions[item.code]).map(item=>({...item,...economyCommandMarketAreaPositions[item.code]}));
}
function renderEconomyCommandMap(){
  const activeKpi=getEconomyCommandKpi();
  const areas=getEconomyCommandMarketAreas();
  return `<div class="economy-command-map"><img class="economy-command-map-image" src="./src/assets/economy/economy-visual-map.svg" alt="项目经济指标区域分布地图">${areas.map(area=>{const value=(Number(activeKpi.value)*area.factor).toFixed(2);return `<button type="button" class="economy-map-point level-${area.level}" data-market-area-code="${area.code}" style="left:${area.left}%;top:${area.top}%" onclick="showToast('${area.name}：${activeKpi.label} ${value}${activeKpi.unit}')"><b>${area.name}</b><span>${value}${activeKpi.unit}</span></button>`;}).join("")}</div>`;
}
function renderEconomyCommandTrend(kpi=getEconomyCommandKpi()){
  const values=kpi.values;
  const companyNames=["上海隧道","市政集团","上海路桥","上海能建","环境集团","城市运营","数字集团"];
  const [selectedYear,selectedMonth]=economyCommandState.month.split("-").map(Number);
  const monthNames=Array.from({length:values.length},(_,index)=>{
    const date=new Date(selectedYear,selectedMonth-1-(values.length-1-index),1);
    return `${String(date.getMonth()+1).padStart(2,"0")}月`;
  });
  const names=economyCommandState.trendMode==="trend"?monthNames:companyNames;
  return `<div class="economy-command-trend ${economyCommandState.trendMode==="trend"?"is-trend":"is-company"}"><div class="economy-trend-y">${[50,40,30,20,10,0].map(value=>`<span>${value}</span>`).join("")}</div><div class="economy-trend-plot"><div class="economy-trend-average" style="bottom:${Math.min(92,Math.max(8,kpi.average))}%"><span>加权平均值 ${kpi.value}${kpi.unit}</span></div>${values.map((value,index)=>{const barHeight=Math.max(5,value/50*100);return `<div class="economy-trend-column" style="--bar-height:${barHeight}%"><span class="economy-trend-value">${value.toFixed(2)}</span><i style="height:var(--bar-height)"></i><b title="${names[index]}">${names[index]}</b></div>`;}).join("")}<svg viewBox="0 0 700 180" preserveAspectRatio="none" aria-hidden="true"><polyline points="50,40 150,65 250,72 350,104 450,115 550,134 650,169"/></svg></div><div class="economy-trend-legend"><span class="line">${kpi.label}（${kpi.unit}）</span><span class="dash">加权平均值</span><span class="bar">${kpi.label}统计值</span></div></div>`;
}
function renderEconomyCommandTypes(){
  const groups=[["市政","12 | 5.71%","能源","12 | 4.46%","公路","25 | 5.43%","机场","2 | 5.01%"],["市政-大隧道","12 | 5.71%","片区开发","5 | 3.99%","地下工程","4 | 3.98%"],["市政-非大隧道","12 | 5.71%","轨交","7 | 5.42%","排水环保","2 | 3.68%"]];
  return `<div class="economy-command-type-grid">${groups.map(group=>`<div><header><span>类型</span><span>个数|比例</span></header>${Array.from({length:Math.ceil(group.length/2)},(_,index)=>`<p><span>${group[index*2]||""}</span><b>${group[index*2+1]||""}</b></p>`).join("")}</div>`).join("")}</div>`;
}
function renderEconomyCommandWarningTable(){return `<div class="economy-command-warning-table"><header><span>公司</span><span>纳管项目数</span><i class="red"></i><i class="orange"></i><i class="yellow"></i><i class="blue"></i><span>报警数</span></header>${economyCommandCompanies.map(row=>`<div><span>${row.name}</span><span>${row.projects}</span>${row.levels.map((value,index)=>`<b class="c${index}">${value}</b>`).join("")}<strong>🔥 × ${row.alarms}</strong></div>`).join("")}</div>`;}
function renderEconomyCommandReasons(){
  const reasons=[
    {name:"项目管理费预警",ratio:56.8},
    {name:"业主拖欠款金额预警",ratio:42.6},
    {name:"工期异常预警",ratio:41.9},
    {name:"资金存货目标利润率关联预警",ratio:39.7},
    {name:"增值税税负预警",ratio:31.2},
    {name:"专业合同个数预警",ratio:18.4}
  ].sort((a,b)=>b.ratio-a.ratio);
  const maxRatio=Math.max(...reasons.map(item=>item.ratio),1);
  return `<div class="economy-command-reason-ranking" aria-label="报警比例最高的六个二级预警">${reasons.map(item=>`<div class="economy-command-reason-row"><span title="${item.name}">${item.name}</span><div><span class="economy-command-reason-track"><i style="width:${item.ratio/maxRatio*100}%"></i></span><b>${item.ratio.toFixed(1)}%</b></div></div>`).join("")}</div>`;
}
function renderEconomyOverview(){
  const activeKpi=getEconomyCommandKpi();
  const selectOptions={organization:["隧道股份","上海隧道","市政集团","上海路桥"],client:["申铁","久事集团","上海机场"],projectType:["轨道交通","市政工程","公路工程"],headquarters:["华东总部","华南总部","西南总部"],region:["华东区域","华南区域","西南区域"]};
  const metricAssetVersion="2.2.683";
  const metrics=[["纳管项目","195","941.14",`./src/assets/economy/economy-metric-managed.svg?v=${metricAssetVersion}`],["在建项目","188","888.64",`./src/assets/economy/economy-metric-under-construction.svg?v=${metricAssetVersion}`],["完工待结算项目","8","49.4",`./src/assets/economy/economy-metric-pending-settlement.svg?v=${metricAssetVersion}`],["已结算未销项项目","1","1.99",`./src/assets/economy/economy-metric-settled-unclosed.svg?v=${metricAssetVersion}`]];
  return `<section class="economy-command-screen" id="economyCommandScreen">
    <header class="economy-command-head"><div class="economy-command-brand"><span><img src="./src/assets/digital-construction-logo.svg" alt="数智施工"></span><strong>数智施工项目经济管理平台</strong></div><div class="economy-command-head-actions">${renderEconomyCommandMonthPicker()}<button type="button" title="全屏投屏" onclick="toggleEconomyCommandFullscreen()">⛶</button></div></header>
    <div class="economy-command-filters"><div class="economy-command-filter-fields">${renderEconomyCommandSelect("organization","所属组织",selectOptions.organization)}${renderEconomyCommandSelect("client","集团重点客户",selectOptions.client)}${renderEconomyCommandSelect("projectType","项目类型",selectOptions.projectType)}${renderEconomyCommandSelect("headquarters","区域总部",selectOptions.headquarters)}${renderEconomyCommandSelect("region","所属区域",selectOptions.region)}</div><nav><button>项目风险预警</button><button>业务可视化分析</button><button onclick="openEconomyAnalysisReport()">经济分析报告</button></nav></div>
    <div class="economy-command-grid">
      <main class="economy-command-main"><div class="economy-command-metrics">${metrics.map(item=>`<article><i><img src="${item[3]}" alt="${item[0]}"></i><div><span>${item[0]} ⓘ</span><strong>${item[1]}<em>个</em><small>|</small>${item[2]}<em>亿元</em></strong></div></article>`).join("")}</div>
        <section class="economy-command-overview">${renderEconomyCommandSectionTitle("项目经济指标总览",`<span>当前主题为 <b>【${activeKpi.label}】</b>，数据范围 <b>【所属组织：上海隧道】、【集团重点客户：申铁】</b></span>`)}<div class="economy-command-map-layout">${renderEconomyCommandKpis()}${renderEconomyCommandMap()}</div></section>
        <div class="economy-command-bottom"><section>${renderEconomyCommandSectionTitle(activeKpi.label,renderEconomyCommandTrendTabs())}${renderEconomyCommandTrend(activeKpi)}</section><section>${renderEconomyCommandSectionTitle("项目类型分析")}${renderEconomyCommandTypes()}</section></div>
      </main>
      <aside class="economy-command-side"><div class="economy-command-risk-total"><img class="economy-command-risk-alert" src="./src/assets/economy/economy-risk-alert.png" alt="风险警示"><span>经济风险项目（红色/橙色/黄色/蓝色风险）</span><div><b class="red"><i></i>11<em>个</em> | 40.59<em>亿元</em></b><b class="orange"><i></i>44<em>个</em> | 222.65<em>亿元</em></b><b class="yellow"><i></i>49<em>个</em> | 17111.77<em>亿元</em></b><b class="blue"><i></i>29<em>个</em> | 1111119.81<em>亿元</em></b></div><div class="economy-command-mascot"><img src="./src/assets/economy/economy-xiaoan.png" alt="小安"><strong>🔥 × 122</strong></div></div><section>${renderEconomyCommandSectionTitle("风险预警分布")}${renderEconomyCommandWarningTable()}</section><section class="economy-command-reasons">${renderEconomyCommandSectionTitle("主要原因分析")}${renderEconomyCommandReasons()}</section></aside>
    </div>
  </section>`;
}
function renderEconomyDashboardPage(view="diagnosis"){
  economyDashboardState.tab=view==="overview"?"overview":"diagnosis";
  detailPage.style.display="none";
  listPage.style.display="flex";
  const diagnosis=economyDashboardState.tab==="diagnosis";
  if(diagnosis&&typeof generateEconomyWarningNoticeBatch==="function")generateEconomyWarningNoticeBatch();
  const list=diagnosis?getEconomyDiagnosisFiltered():[];
  listPage.innerHTML=`<div class="safety-screen-page economy-dashboard-page">${renderEconomyDashboardHeader(economyDashboardState.tab)}<div class="economy-dashboard-content">${diagnosis?`${renderEconomyOrgSwitch()}<div class="economy-dashboard-body">${renderEconomyDiagnosisMetrics(list)}${renderEconomyWarningCards(list)}${renderEconomyDiagnosisTable(list)}</div>`:`<div class="economy-dashboard-body">${renderEconomyOverview()}</div>`}</div></div>`;
  if(economyDashboardState.edition==="international")EconomyI18n.apply(listPage);
}
