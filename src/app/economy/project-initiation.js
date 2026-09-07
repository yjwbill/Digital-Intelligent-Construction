/* 企业管理 / 经济 / 经济纳管 / 经济开项 */
const economyInitiationApplications=[
  {
    id:"init-202607-st",month:"2026-07",company:"上海隧道",status:"待子公司提交",applicant:"上海隧道经营管理部",submitTime:"--",currentNode:"子公司申请",
    projects:[
      {id:"init-p-001",sourceType:"新增",projectCode:"SCG202606001",projectName:"上海市轨道交通21号线一期土建8标项目",company:"上海隧道",branch:"上海隧道第一分公司",contractAmount:186500,manager:"张建军",establishDate:"2026-06-08",orderCode:"DD202606001",bidAmount:188200,bidDate:"2026-06-03",online:"是",reason:""},
      {id:"init-p-002",sourceType:"新增",projectCode:"SCG202606002",projectName:"临港新片区综合管廊南区工程",company:"上海隧道",branch:"上海隧道市政分公司",contractAmount:92500,manager:"王明",establishDate:"2026-06-16",orderCode:"DD202606002",bidAmount:93800,bidDate:"2026-06-11",online:"否",reason:"项目当前仅处于前期准备阶段，暂不具备上线条件"},
      {id:"init-p-003",sourceType:"新增",projectCode:"SCG202606003",projectName:"浦东新区雨污水管网提标改造工程",company:"上海隧道",branch:"上海隧道西南分公司",contractAmount:64800,manager:"李强",establishDate:"2026-06-24",orderCode:"DD202606003",bidAmount:65120,bidDate:"2026-06-20",online:"",reason:""}
    ]
  },
  {
    id:"init-202607-sz",month:"2026-07",company:"市政集团",status:"产运部审批",applicant:"市政集团经营管理部",submitterName:"王安全",submitterRole:"安全领导",submitTime:"2026-07-18 10:26",currentNode:"产运部审批",
    projects:[
      {id:"init-p-004",sourceType:"新增",projectCode:"SCG202606011",projectName:"虹桥商务区道路品质提升工程",company:"市政集团",branch:"市政集团第一分公司",contractAmount:48600,manager:"赵鹏",establishDate:"2026-06-12",orderCode:"DD202606011",bidAmount:49100,bidDate:"2026-06-08",online:"是",reason:""},
      {id:"init-p-005",sourceType:"历史",projectCode:"SCG202604021",projectName:"嘉定新城河道综合整治二期工程",company:"市政集团",branch:"市政集团水务分公司",contractAmount:71200,manager:"陈安全",establishDate:"2026-04-21",orderCode:"DD202604021",bidAmount:71900,bidDate:"2026-04-17",online:"否",reason:"项目已进入收尾阶段，不再纳入平台开项"}
    ]
  },
  {
    id:"init-202607-lq",month:"2026-07",company:"上海路桥",status:"已完成",applicant:"上海路桥经营管理部",submitterName:"王安全",submitterRole:"安全领导",submitTime:"2026-07-15 09:18",approverName:"王安全",approverRole:"安全领导",approveTime:"2026-07-17 16:05",currentNode:"申请结束",
    projects:[
      {id:"init-p-006",sourceType:"新增",projectCode:"SCG202606031",projectName:"G60科创走廊道路改扩建工程",company:"上海路桥",branch:"上海路桥道路工程公司",contractAmount:125600,manager:"孙经济",establishDate:"2026-06-19",orderCode:"DD202606031",bidAmount:126800,bidDate:"2026-06-15",online:"是",reason:""},
      {id:"init-p-007",sourceType:"新增",projectCode:"SCG202606032",projectName:"北横通道地面道路景观提升工程",company:"上海路桥",branch:"上海路桥景观分公司",contractAmount:32800,manager:"刘质量",establishDate:"2026-06-27",orderCode:"DD202606032",bidAmount:33100,bidDate:"2026-06-22",online:"是",reason:""}
    ]
  },
  {id:"init-202606-st",month:"2026-06",company:"上海隧道",status:"已完成",applicant:"上海隧道经营管理部",submitTime:"2026-06-16 11:20",approveTime:"2026-06-18 14:30",currentNode:"申请结束",projects:[]},
  {id:"init-202606-sz",month:"2026-06",company:"市政集团",status:"已完成",applicant:"市政集团经营管理部",submitTime:"2026-06-14 09:45",approveTime:"2026-06-17 10:18",currentNode:"申请结束",projects:[]},
  {id:"init-202606-lq",month:"2026-06",company:"上海路桥",status:"已完成",applicant:"上海路桥经营管理部",submitTime:"2026-06-15 15:12",approveTime:"2026-06-19 09:08",currentNode:"申请结束",projects:[]},
  {id:"init-202605-st",month:"2026-05",company:"上海隧道",status:"已完成",applicant:"上海隧道经营管理部",submitTime:"2026-05-13 10:25",approveTime:"2026-05-16 16:40",currentNode:"申请结束",projects:[]},
  {id:"init-202605-sz",month:"2026-05",company:"市政集团",status:"已完成",applicant:"市政集团经营管理部",submitTime:"2026-05-12 14:16",approveTime:"2026-05-15 11:36",currentNode:"申请结束",projects:[]}
];
const economyInitiationHistoryProjects=[
  {id:"history-001",sourceType:"历史",projectCode:"SCG202603018",projectName:"长三角一体化示范区地下通道工程",company:"上海隧道",branch:"上海隧道第一分公司",contractAmount:85600,manager:"周工",establishDate:"2026-03-22",orderCode:"DD202603018",bidAmount:86100,bidDate:"2026-03-18",online:"",reason:""},
  {id:"history-002",sourceType:"历史",projectCode:"SCG202602009",projectName:"浦东机场四期捷运区间工程",company:"上海隧道",branch:"上海隧道轨道分公司",contractAmount:136800,manager:"吴工",establishDate:"2026-02-17",orderCode:"DD202602009",bidAmount:138000,bidDate:"2026-02-12",online:"",reason:""},
  {id:"history-003",sourceType:"历史",projectCode:"SCG202604036",projectName:"苏州河沿岸排水系统提升工程",company:"市政集团",branch:"市政集团水务分公司",contractAmount:44500,manager:"郑工",establishDate:"2026-04-28",orderCode:"DD202604036",bidAmount:44920,bidDate:"2026-04-24",online:"",reason:""}
];

const economyInitiationLatestMonth=[...new Set(economyInitiationApplications.map(x=>x.month))].sort().reverse()[0];
const economyInitiationState={selectedId:"init-202607-st",projectName:"",projectCode:"",orderCode:"",branch:"",manager:"",builder:"",historySelected:[],expandedMonths:new Set([economyInitiationLatestMonth]),sidebarCollapsed:false,tableExpanded:false};
window.economyProjectInitiationApprovedData=economyInitiationApplications.filter(x=>x.status==="已完成").flatMap(x=>x.projects.map(project=>({...project,managementStatus:project.online==="是"?(project.managementStatus||"待纳管"):"--",applicationId:x.id,approvalMonth:x.month,approveTime:x.approveTime})));

function getEconomyInitiationSelected(){
  return economyInitiationApplications.find(x=>x.id===economyInitiationState.selectedId)||economyInitiationApplications[0];
}

function economyInitiationStatusTag(status){
  const color={"待子公司提交":"orange","产运部审批":"blue","已完成":"green"}[status]||"gray";
  const label={"待子公司提交":"待提交","产运部审批":"待审批","已完成":"已结束"}[status]||status;
  return tag(label,color);
}

function getEconomyInitiationCurrentOperator(){
  return {
    name:document.querySelector(".user-name")?.textContent.trim()||"王安全",
    role:document.querySelector(".user-dropdown-role")?.textContent.trim()||"安全领导"
  };
}

function formatEconomyInitiationActionTime(value=new Date()){
  const pad=number=>String(number).padStart(2,"0");
  return `${value.getFullYear()}-${pad(value.getMonth()+1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function toggleEconomyInitiationMonth(month){
  if(economyInitiationState.expandedMonths.has(month))economyInitiationState.expandedMonths.delete(month);
  else economyInitiationState.expandedMonths.add(month);
  const list=document.querySelector(".economy-init-application-list");
  if(list)list.innerHTML=renderEconomyInitiationApplicationList();
}

function selectEconomyInitiationApplication(id){
  economyInitiationState.selectedId=id;
  economyInitiationState.projectName="";economyInitiationState.projectCode="";economyInitiationState.orderCode="";economyInitiationState.branch="";economyInitiationState.manager="";economyInitiationState.builder="";
  renderEconomyProjectInitiationPage();
}

function getEconomyInitiationFilteredProjects(){
  const app=getEconomyInitiationSelected();
  return app.projects.filter(x=>(!economyInitiationState.projectName||x.projectName.includes(economyInitiationState.projectName))&&(!economyInitiationState.projectCode||x.projectCode.includes(economyInitiationState.projectCode))&&(!economyInitiationState.orderCode||x.orderCode.includes(economyInitiationState.orderCode))&&(!economyInitiationState.branch||x.branch.includes(economyInitiationState.branch))&&(!economyInitiationState.manager||x.manager.includes(economyInitiationState.manager))&&(!economyInitiationState.builder||String(x.builder||"").includes(economyInitiationState.builder)));
}

function syncEconomyInitiationFilters(){
  economyInitiationState.projectName=document.getElementById("economyInitProjectName")?.value.trim()||"";
  economyInitiationState.projectCode=document.getElementById("economyInitProjectCode")?.value.trim()||"";
  economyInitiationState.orderCode=document.getElementById("economyInitOrderCode")?.value.trim()||"";
  economyInitiationState.branch=document.getElementById("economyInitBranch")?.value.trim()||"";
  economyInitiationState.manager=document.getElementById("economyInitManager")?.value.trim()||"";
  economyInitiationState.builder=document.getElementById("economyInitBuilder")?.value.trim()||"";
  renderEconomyProjectInitiationPage();
}

function resetEconomyInitiationFilters(){
  economyInitiationState.projectName="";economyInitiationState.projectCode="";economyInitiationState.orderCode="";economyInitiationState.branch="";economyInitiationState.manager="";economyInitiationState.builder="";
  renderEconomyProjectInitiationPage();
}

function toggleEconomyInitiationSidebar(){
  economyInitiationState.sidebarCollapsed=!economyInitiationState.sidebarCollapsed;
  renderEconomyProjectInitiationPage({preserveTablePosition:true});
}

function renderEconomyInitiationFullscreenButton(){
  const active=economyInitiationState.tableExpanded;
  return `<button type="button" class="column-setting-icon-btn economy-init-fullscreen-btn" title="${active?"退出全屏":"全屏"}" aria-label="${active?"退出全屏":"全屏查看开项申请项目清单"}" onclick="toggleEconomyInitiationTableFullscreen()">${renderTDesignIcon(active?"fullscreen-exit":"fullscreen",{size:16})}</button>`;
}

function toggleEconomyInitiationTableFullscreen(){
  const card=document.querySelector(".economy-init-project-table-card");
  if(!card)return;
  economyInitiationState.tableExpanded=!economyInitiationState.tableExpanded;
  card.classList.toggle("economy-init-browser-expanded",economyInitiationState.tableExpanded);
  document.body.classList.toggle("economy-init-browser-expanded-active",economyInitiationState.tableExpanded);
  syncEconomyInitiationFullscreenButton();
}

function syncEconomyInitiationFullscreenButton(){
  const button=document.querySelector(".economy-init-fullscreen-btn");
  if(button)button.outerHTML=renderEconomyInitiationFullscreenButton();
}

document.addEventListener("keydown",event=>{
  if(event.key!=="Escape"||!economyInitiationState.tableExpanded)return;
  economyInitiationState.tableExpanded=false;
  document.querySelector(".economy-init-project-table-card")?.classList.remove("economy-init-browser-expanded");
  document.body.classList.remove("economy-init-browser-expanded-active");
  syncEconomyInitiationFullscreenButton();
});

function updateEconomyInitiationOnline(projectId,value){
  const app=getEconomyInitiationSelected();
  const project=app.projects.find(x=>x.id===projectId);
  if(!project)return;
  project.online=value;
  if(value==="是")project.reason="";
  renderEconomyProjectInitiationPage({preserveTablePosition:true});
}

function updateEconomyInitiationReason(projectId,value){
  const project=getEconomyInitiationSelected().projects.find(x=>x.id===projectId);
  if(project)project.reason=value;
}

function removeEconomyInitiationHistoryProject(projectId){
  const app=getEconomyInitiationSelected();
  app.projects=app.projects.filter(x=>x.id!==projectId||x.sourceType!=="历史");
  renderEconomyProjectInitiationPage({preserveTablePosition:true});showToast("已移除历史项目");
}

tableColumnDefinitions.economyInitiationProjects=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"sourceType",title:"项目性质",width:100,align:"center",render:x=>tag(x.sourceType==="新增"?"新开":"历史",x.sourceType==="新增"?"green":"red")},
  {key:"projectName",title:"项目名称",width:280,align:"left",render:x=>x.projectName},
  {key:"projectCode",title:"项目编号",width:150,align:"center",render:x=>x.projectCode},
  {key:"company",title:"子公司",width:130,align:"center",render:x=>x.company},
  {key:"branch",title:"分公司",width:180,align:"center",render:x=>x.branch},
  {key:"contractAmount",title:"项目造价（元）",width:160,align:"right",render:x=>(Number(x.contractAmount)*10000).toLocaleString()},
  {key:"manager",title:"项目经理",width:190,align:"center",render:x=>renderProjectManagerContact(x.manager,x.managerPhone,{key:`economy-initiation-${x.id}`})},
  {key:"establishDate",title:"立项完成日期",width:140,align:"center",render:x=>x.establishDate},
  {key:"orderCode",title:"订单项目编号",width:150,align:"center",render:x=>x.orderCode},
  {key:"bidAmount",title:"中标价（元）",width:140,align:"right",render:x=>(Number(x.bidAmount)*10000).toLocaleString()},
  {key:"bidDate",title:"中标日期",width:130,align:"center",render:x=>x.bidDate},
  {key:"builder",title:"建设单位",width:190,align:"left",render:x=>x.builder||"--"},
  {key:"managementStatus",title:"纳管状态",width:120,align:"center",hidden:()=>getEconomyInitiationSelected()?.status!=="已完成",render:x=>x.online==="是"?tag(x.managementStatus||"待纳管",x.managementStatus==="纳管中"?"green":"orange"):"--"},
  {key:"online",title:"本期是否上线",width:130,align:"center",render:x=>{
    const app=getEconomyInitiationSelected();
    if(app.status==="已完成")return messageStatusTag(x.online||"--");
    return `<select class="select economy-init-online-select" onchange="updateEconomyInitiationOnline('${x.id}',this.value)"><option value="">请选择</option><option value="是" ${x.online==="是"?"selected":""}>是</option><option value="否" ${x.online==="否"?"selected":""}>否</option></select>`;
  }},
  {key:"reason",title:"开项备注",width:260,align:"left",render:x=>{
    const app=getEconomyInitiationSelected();
    if(app.status==="已完成")return x.online==="否"?(x.reason||"--"):"--";
    if(x.online!=="否")return "--";
    return `<input class="input economy-init-reason-input ${x.reason?'':'invalid'}" value="${escapeAttr(x.reason||'')}" placeholder="请输入不上线理由" oninput="updateEconomyInitiationReason('${x.id}',this.value)"/>`;
  }},
  {key:"operation",title:"操作",width:100,align:"center",render:x=>x.sourceType==="历史"&&getEconomyInitiationSelected().status==="待子公司提交"?`<a class="link" onclick="removeEconomyInitiationHistoryProject('${x.id}')">删除</a>`:"--"}
];
tableColumnDefinitions.economyInitiationProjects.freezeCount=3;
tableColumnDefinitions.economyInitiationProjects.rightFreezeCount=4;

function renderEconomyInitiationApplicationList(){
  const months=[...new Set(economyInitiationApplications.map(x=>x.month))].sort().reverse();
  return months.map(month=>{const expanded=economyInitiationState.expandedMonths.has(month);return `<section class="economy-init-month ${expanded?'expanded':'collapsed'}"><button type="button" class="economy-init-month-title" aria-expanded="${expanded}" onclick="toggleEconomyInitiationMonth('${month}')"><strong>${month}</strong>${renderTDesignIcon("chevron-down",{size:16,className:`economy-init-month-arrow ${expanded?'expanded':''}`})}</button><div class="economy-init-month-applications">${economyInitiationApplications.filter(x=>x.month===month).map(app=>`<button class="economy-init-application-card ${app.id===economyInitiationState.selectedId?'active':''}" onclick="selectEconomyInitiationApplication('${app.id}')"><div><strong>${app.company}开项申请</strong>${economyInitiationStatusTag(app.status)}</div><p><span>提交组织</span><b>${app.company}</b></p><p><span>提交时间</span><b>${app.submitTime}</b></p><p><span>当前节点</span><b>${app.currentNode}</b></p></button>`).join("")}</div></section>`;}).join("");
}

function renderEconomyInitiationProgress(app){
  const creationTime=`${app.month}-01 09:00`;
  const submitted=app.submitterName||(app.submitTime&&app.submitTime!=="--"?"王安全":"");
  const submittedRole=app.submitterRole||(submitted?"安全领导":"--");
  const approved=app.approverName||(app.status==="已完成"?"王安全":"");
  const approvedRole=app.approverRole||(approved?"安全领导":"--");
  const steps=[
    {name:"申请发起",person:"系统创建",role:"系统",time:creationTime,reached:true},
    {name:"子公司申请",person:submitted||"提交人",role:submittedRole,time:app.submitTime||"--",reached:!!submitted},
    {name:"产运部审批",person:approved||"审批人",role:approvedRole,time:app.approveTime||"--",reached:!!approved},
    {name:"申请结束",person:"流程结束",role:"系统",time:app.status==="已完成"?(app.approveTime||"--"):"--",reached:app.status==="已完成"}
  ];
  return `<div class="economy-init-flow" aria-label="审批流程"><div class="economy-init-flow-track">${steps.map((step,index)=>`${index?'<i class="economy-init-flow-arrow" aria-hidden="true">→</i>':''}<div class="economy-init-flow-node ${step.reached?'reached':'pending'}"><b class="economy-init-flow-number">${index+1}</b><div class="economy-init-flow-group"><div class="economy-init-flow-title"><strong>${step.name}</strong></div><div class="economy-init-flow-meta"><span>${step.person}<em>${step.role}</em></span><time>${step.time||"--"}</time></div></div></div>`).join("")}</div></div>`;
}

function openEconomyInitiationHistoryProjectsLegacy(){
  const app=getEconomyInitiationSelected();
  const available=economyInitiationHistoryProjects.filter(x=>x.company===app.company&&!app.projects.some(p=>p.id===x.id));
  economyInitiationState.historySelected=[];
  openModal("选择历史项目",`<div class="economy-init-history-tip">仅展示上月之前尚未完成开项的历史项目，支持多选加入本月清单。</div><div class="table-wrap economy-init-history-table-wrap"><table class="economy-init-history-table"><thead><tr><th style="width:60px">选择</th><th style="width:150px">项目编号</th><th style="width:260px">项目名称</th><th style="width:130px">子公司</th><th style="width:180px">分公司</th><th style="width:190px">项目经理</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（万元）</th><th style="width:130px">中标日期</th></tr></thead><tbody>${available.length?available.map(x=>`<tr><td style="text-align:center"><input type="checkbox" onchange="toggleEconomyInitiationHistorySelection('${x.id}',this.checked)"/></td><td>${x.projectCode}</td><td title="${escapeAttr(x.projectName)}">${x.projectName}</td><td>${x.company}</td><td>${x.branch}</td><td>${renderProjectManagerContact(x.manager,x.managerPhone,{key:`economy-history-picker-${x.id}`})}</td><td>${x.establishDate}</td><td>${x.orderCode}</td><td class="right">${Number(x.bidAmount).toLocaleString()}</td><td>${x.bidDate}</td></tr>`).join(""):'<tr><td colspan="10" class="empty-state">暂无可选择的历史项目</td></tr>'}</tbody></table></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="confirmEconomyInitiationHistorySelection()">确定</button>`,"large");
}

function openEconomyInitiationHistoryProjects(){
  const app=getEconomyInitiationSelected();
  const available=economyInitiationHistoryProjects.filter(x=>x.company===app.company&&!app.projects.some(p=>p.id===x.id));
  economyInitiationState.historySelected=[];
  const head=`<tr><th style="width:60px">多选</th><th style="width:60px">序号</th><th style="width:260px">项目名称</th><th style="width:150px">项目编号</th><th style="width:130px">子公司</th><th style="width:180px">分公司</th><th style="width:160px">项目造价（元）</th><th style="width:190px">项目经理</th><th style="width:140px">立项完成日期</th><th style="width:150px">订单项目编号</th><th style="width:140px">中标价（元）</th><th style="width:130px">中标日期</th><th style="width:190px">建设单位</th></tr>`;
  const body=available.length?available.map((x,index)=>`<tr><td style="text-align:center"><input type="checkbox" onchange="toggleEconomyInitiationHistorySelection('${x.id}',this.checked)"/></td><td style="text-align:center">${index+1}</td><td title="${escapeAttr(x.projectName)}">${x.projectName}</td><td>${x.projectCode}</td><td>${x.company}</td><td>${x.branch}</td><td class="right">${(Number(x.contractAmount)*10000).toLocaleString()}</td><td>${renderProjectManagerContact(x.manager,x.managerPhone,{key:`economy-history-picker-${x.id}`})}</td><td>${x.establishDate}</td><td>${x.orderCode}</td><td class="right">${(Number(x.bidAmount)*10000).toLocaleString()}</td><td>${x.bidDate}</td><td>${x.builder||"--"}</td></tr>`).join(""):'<tr><td colspan="13" class="empty-state">暂无可选择的历史项目</td></tr>';
  openModal("选择历史项目",`<div class="economy-init-history-tip">仅展示上月之前尚未完成开项的历史项目，支持多选加入本月清单。</div><div class="table-wrap economy-init-history-table-wrap"><table class="economy-init-history-table"><thead>${head}</thead><tbody>${body}</tbody></table></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="confirmEconomyInitiationHistorySelection()">确定</button>` ,"large");
}

function toggleEconomyInitiationHistorySelection(id,checked){
  economyInitiationState.historySelected=checked?[...new Set([...economyInitiationState.historySelected,id])]:economyInitiationState.historySelected.filter(x=>x!==id);
}

function confirmEconomyInitiationHistorySelection(){
  if(!economyInitiationState.historySelected.length){showToast("请至少选择一个历史项目");return;}
  const app=getEconomyInitiationSelected();
  economyInitiationState.historySelected.forEach(id=>{const project=economyInitiationHistoryProjects.find(x=>x.id===id);if(project&&!app.projects.some(x=>x.id===id))app.projects.push({...project});});
  closeModal();renderEconomyProjectInitiationPage({preserveTablePosition:true});showToast("历史项目已加入本月开项清单");
}

function validateEconomyInitiationProjects(app){
  const missing=app.projects.find(x=>!x.online||(x.online==="否"&&!String(x.reason||"").trim()));
  if(missing){showToast(`请完善“${missing.projectName}”的是否上线及理由`);return false;}
  return true;
}

function submitEconomyInitiationApplication(){
  const app=getEconomyInitiationSelected();
  if(!app.projects.length){showToast("当前清单暂无项目，无法提交");return;}
  if(!validateEconomyInitiationProjects(app))return;
  const onlineCount=app.projects.filter(project=>project.online==="是").length;
  const offlineCount=app.projects.length-onlineCount;
  openStandardConfirmModal({
    title:"提交申请确认",
    message:`<p>确认提交${escapeAttr(app.month)} ${escapeAttr(app.company)}开项申请吗？</p><p>本次上线项目 <strong>${onlineCount}</strong> 个，不上线项目 <strong>${offlineCount}</strong> 个，提交后将流转至产运部审批。</p>`,
    confirmText:"确认提交",
    onConfirm:confirmSubmitEconomyInitiationApplication
  });
}

function confirmSubmitEconomyInitiationApplication(){
  const app=getEconomyInitiationSelected();
  const operator=getEconomyInitiationCurrentOperator();
  app.status="产运部审批";app.currentNode="产运部审批";app.submitterName=operator.name;app.submitterRole=operator.role;app.submitTime=formatEconomyInitiationActionTime();
  closeModal();renderEconomyProjectInitiationPage();showToast("开项申请已提交，等待产运部审批");
}

function approveEconomyInitiationApplication(){
  const app=getEconomyInitiationSelected();
  if(!validateEconomyInitiationProjects(app))return;
  openModal("审批确认",`<div style="padding:12px 0">产运部可调整项目是否上线及理由。确认后本月开项流程将结束，是否继续？</div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="confirmApproveEconomyInitiationApplication()">确认审批</button>`);
}

function confirmApproveEconomyInitiationApplication(){
  const app=getEconomyInitiationSelected();
  const operator=getEconomyInitiationCurrentOperator();
  app.status="已完成";app.currentNode="申请结束";app.approverName=operator.name;app.approverRole=operator.role;app.approveTime=formatEconomyInitiationActionTime();
  window.economyProjectInitiationApprovedData=economyInitiationApplications.filter(x=>x.status==="已完成").flatMap(x=>x.projects.map(project=>({...project,managementStatus:project.online==="是"?(project.managementStatus||"待纳管"):"--",applicationId:x.id,approvalMonth:x.month,approveTime:x.approveTime})));
  closeModal();renderEconomyProjectInitiationPage();showToast("产运部已确认，开项审批流程结束");
}

function renderEconomyProjectInitiationPage(options={}){
  const currentTableWrap=options.preserveTablePosition?document.querySelector(".economy-init-project-table-card .roster-table-wrap"):null;
  const tablePosition=currentTableWrap?{left:currentTableWrap.scrollLeft,top:currentTableWrap.scrollTop}:null;
  detailPage.style.display="none";listPage.style.display="flex";
  const app=getEconomyInitiationSelected();
  tableColumnDefinitions.economyInitiationProjects.rightFreezeCount=app.status==="已完成"?4:3;
  const list=getEconomyInitiationFilteredProjects();
  const queryFields=`<div class="form-item"><label>项目名称</label><input class="input" id="economyInitProjectName" placeholder="请输入项目名称" value="${escapeAttr(economyInitiationState.projectName)}"/></div><div class="form-item"><label>项目编号</label><input class="input" id="economyInitProjectCode" placeholder="请输入项目编号" value="${escapeAttr(economyInitiationState.projectCode)}"/></div><div class="form-item"><label>订单项目编号</label><input class="input" id="economyInitOrderCode" placeholder="请输入订单项目编号" value="${escapeAttr(economyInitiationState.orderCode)}"/></div><div class="form-item"><label>分公司</label><input class="input" id="economyInitBranch" placeholder="请输入分公司" value="${escapeAttr(economyInitiationState.branch)}"/></div><div class="form-item"><label>项目经理</label><input class="input" id="economyInitManager" placeholder="请输入项目经理" value="${escapeAttr(economyInitiationState.manager)}"/></div><div class="form-item"><label>建设单位</label><input class="input" id="economyInitBuilder" placeholder="请输入建设单位" value="${escapeAttr(economyInitiationState.builder)}"/></div>`;
  const actions=app.status==="待子公司提交"?`<button class="btn primary" onclick="submitEconomyInitiationApplication()">提交申请</button>`:app.status==="产运部审批"?`<button class="btn primary" onclick="approveEconomyInitiationApplication()">确认审批</button>`:"";
  const sideHtml=`<aside class="card economy-init-sidebar"><div class="card-hd"><div class="card-title">子公司开项申请</div></div><div class="economy-init-auto-tip">每月自动生成，自动纳入上月新立项项目</div><div class="economy-init-application-list">${renderEconomyInitiationApplicationList()}</div></aside><button type="button" class="economy-init-sidebar-toggle" title="隐藏子公司开项申请" aria-label="隐藏子公司开项申请" onclick="toggleEconomyInitiationSidebar()">&#8249;</button>`;
  const mainHtml=`<main class="economy-init-main">${economyInitiationState.sidebarCollapsed?`<button type="button" class="economy-init-sidebar-restore" title="展开子公司开项申请" aria-label="展开子公司开项申请" onclick="toggleEconomyInitiationSidebar()">&#8250;</button>`:""}<section class="card economy-init-header-card"><div class="economy-init-header-content"><div class="economy-init-header-title"><h2>${app.month} ${app.company}子公司开项申请</h2></div>${renderEconomyInitiationProgress(app)}</div><div class="economy-init-header-actions actions">${actions}</div></section>${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid economy-init-search-grid",queryFn:"syncEconomyInitiationFilters()",resetFn:"resetEconomyInitiationFilters()"})}${renderUnifiedTableCard({title:"开项申请项目清单",className:`economy-init-project-table-card economy-init-status-${app.status==="已完成"?"finished":app.status==="产运部审批"?"review":"submit"}`,tableKey:"economyInitiationProjects",tableId:"economyInitiationProjectTable",theadId:"economyInitiationProjectThead",tbodyId:"economyInitiationProjectTbody",totalId:"economyInitiationProjectTotal",total:list.length,renderFnName:"renderEconomyProjectInitiationPage",beforeActions:app.status==="待子公司提交"?`<button class="btn" onclick="openEconomyInitiationHistoryProjects()">选择历史项目</button>`:"",beforeColumnSetting:renderEconomyInitiationFullscreenButton(),refreshAction:"renderEconomyProjectInitiationPage();showToast('已刷新开项申请清单')",exportAction:"showToast('导出成功：开项申请项目清单.xlsx')"})}</main>`;
  listPage.innerHTML=StandardList.render({variant:"split",className:`economy-init-page ${economyInitiationState.sidebarCollapsed?"economy-init-sidebar-collapsed":""}`,titleHtml:`<div class="compact-title-row"><div class="module-title">经济纳管 / 经济开项</div></div>`,sideHtml,mainHtml});
  renderTableByColumns("economyInitiationProjects",list,"economyInitiationProjectTbody");
  if(economyInitiationState.tableExpanded){document.querySelector(".economy-init-project-table-card")?.classList.add("economy-init-browser-expanded");document.body.classList.add("economy-init-browser-expanded-active");}
  if(tablePosition){const nextTableWrap=document.querySelector(".economy-init-project-table-card .roster-table-wrap");if(nextTableWrap){nextTableWrap.scrollLeft=tablePosition.left;nextTableWrap.scrollTop=tablePosition.top;}}
}
