/* 企业管理 / 经济 / 经济报表 / 进度节点 */
const economyProgressNodeRows=[
  {id:"PN001",projectName:"漕河泾创新水岸建设工程",company:"城建集团",branch:"第一工程公司",nodeName:"地下结构封顶",plannedDate:"2026-08-18",actualDate:"2026-08-23",deviation:5,status:"已延期完成",controlLevel:"股份管控",keyNode:"是",rectificationCount:2,changeCount:1,adjustedDate:"2026-08-25",manager:"张伟",managerPhone:"13812345678",projectCode:"CJ20240018",delayDays:5,calculationDate:"2026-09-04"},
  {id:"PN002",projectName:"漕河泾创新水岸建设工程",company:"城建集团",branch:"第一工程公司",nodeName:"主体结构验收",plannedDate:"2026-10-30",actualDate:"--",deviation:0,status:"进行中",controlLevel:"二级",keyNode:"是",rectificationCount:0,changeCount:2,adjustedDate:"2026-08-29",manager:"张伟",managerPhone:"13812345678",projectCode:"CJ20240018",delayDays:0,calculationDate:"2026-09-04"},
  {id:"PN003",projectName:"浦东机场四期扩建工程",company:"上海隧道",branch:"轨道交通分公司",nodeName:"盾构始发",plannedDate:"2026-07-12",actualDate:"2026-07-10",deviation:-2,status:"已完成",controlLevel:"一级",keyNode:"是",rectificationCount:0,changeCount:0,adjustedDate:"2026-07-10",manager:"王磊",managerPhone:"13987654321",projectCode:"SD20250036",delayDays:0,calculationDate:"2026-09-04"},
  {id:"PN004",projectName:"浦东机场四期扩建工程",company:"上海隧道",branch:"轨道交通分公司",nodeName:"区间贯通",plannedDate:"2026-09-01",actualDate:"--",deviation:3,status:"已延期",controlLevel:"一级",keyNode:"是",rectificationCount:1,changeCount:1,adjustedDate:"2026-08-31",manager:"王磊",managerPhone:"13987654321",projectCode:"SD20250036",delayDays:3,calculationDate:"2026-09-04"},
  {id:"PN005",projectName:"北横通道东段工程",company:"市政集团",branch:"隧道工程分公司",nodeName:"道路翻交完成",plannedDate:"2026-08-28",actualDate:"2026-08-28",deviation:0,status:"已完成",controlLevel:"二级",keyNode:"否",rectificationCount:0,changeCount:1,adjustedDate:"2026-08-28",manager:"李娜",managerPhone:"13655556666",projectCode:"SZ20230027",delayDays:0,calculationDate:"2026-09-04"},
  {id:"PN006",projectName:"北横通道东段工程",company:"市政集团",branch:"隧道工程分公司",nodeName:"机电安装完成",plannedDate:"2026-11-15",actualDate:"--",deviation:0,status:"未开始",controlLevel:"三级",keyNode:"否",rectificationCount:0,changeCount:0,adjustedDate:"--",manager:"李娜",managerPhone:"13655556666",projectCode:"SZ20230027",delayDays:0,calculationDate:"2026-09-04"},
  {id:"PN007",projectName:"临港新片区综合管廊工程",company:"路桥集团",branch:"浦东分公司",nodeName:"基坑围护完成",plannedDate:"2026-08-20",actualDate:"2026-08-26",deviation:6,status:"已延期完成",controlLevel:"二级",keyNode:"是",rectificationCount:3,changeCount:2,adjustedDate:"2026-08-27",manager:"陈杰",managerPhone:"13722223333",projectCode:"LQ20250041",delayDays:6,calculationDate:"2026-09-03"},
  {id:"PN008",projectName:"临港新片区综合管廊工程",company:"路桥集团",branch:"浦东分公司",nodeName:"首段结构验收",plannedDate:"2026-09-18",actualDate:"--",deviation:0,status:"进行中",controlLevel:"二级",keyNode:"否",rectificationCount:1,changeCount:0,adjustedDate:"2026-08-20",manager:"陈杰",managerPhone:"13722223333",projectCode:"LQ20250041",delayDays:0,calculationDate:"2026-09-03"},
  {id:"PN009",projectName:"嘉闵线城北路站工程",company:"城建集团",branch:"第二工程公司",nodeName:"车站底板完成",plannedDate:"2026-08-31",actualDate:"--",deviation:4,status:"已延期",controlLevel:"一级",keyNode:"是",rectificationCount:2,changeCount:3,adjustedDate:"2026-09-01",manager:"周敏",managerPhone:"13588889999",projectCode:"CJ20250052",delayDays:4,calculationDate:"2026-09-04"},
  {id:"PN010",projectName:"嘉闵线城北路站工程",company:"城建集团",branch:"第二工程公司",nodeName:"车站中板完成",plannedDate:"2026-10-25",actualDate:"--",deviation:0,status:"未开始",controlLevel:"三级",keyNode:"否",rectificationCount:0,changeCount:1,adjustedDate:"2026-08-15",manager:"周敏",managerPhone:"13588889999",projectCode:"CJ20250052",delayDays:0,calculationDate:"2026-09-04"},
  {id:"PN011",projectName:"苏州河深层排水调蓄管道工程",company:"上海隧道",branch:"地下工程分公司",nodeName:"工作井结构完成",plannedDate:"2026-08-16",actualDate:"2026-08-14",deviation:-2,status:"已完成",controlLevel:"一级",keyNode:"是",rectificationCount:0,changeCount:1,adjustedDate:"2026-08-14",manager:"赵强",managerPhone:"13366667777",projectCode:"SD20240063",delayDays:0,calculationDate:"2026-09-02"},
  {id:"PN012",projectName:"苏州河深层排水调蓄管道工程",company:"上海隧道",branch:"地下工程分公司",nodeName:"顶管始发",plannedDate:"2026-09-20",actualDate:"--",deviation:0,status:"进行中",controlLevel:"二级",keyNode:"是",rectificationCount:1,changeCount:0,adjustedDate:"2026-08-30",manager:"赵强",managerPhone:"13366667777",projectCode:"SD20240063",delayDays:0,calculationDate:"2026-09-02"}
];

const economyProgressNodeState={projectName:"",company:"",branch:"",nodeName:"",manager:"",projectCode:"",calculationDate:"20260904",page:1,pageSize:10,rowOffset:0,scrollLeft:0,scrollTop:0};
function economyProgressNodeDateValue(value){const text=String(value||"").replace(/-/g,"");return /^\d{8}$/.test(text)?new Date(`${text.slice(0,4)}-${text.slice(4,6)}-${text.slice(6,8)}`):null;}
function economyProgressNodeDateInputValue(value){const text=String(value||"").replace(/-/g,"");return /^\d{8}$/.test(text)?`${text.slice(0,4)}-${text.slice(4,6)}-${text.slice(6,8)}`:"";}
function economyProgressNodeDelay(row){const plan=economyProgressNodeDateValue(row.plannedDate),actual=economyProgressNodeDateValue(row.actualDate),simulation=economyProgressNodeDateValue(economyProgressNodeState.calculationDate);const end=actual||simulation;if(!plan||!end)return 0;return Math.round((end-plan)/86400000);}

function economyProgressNodeOptions(key){return [...new Set(economyProgressNodeRows.map(row=>row[key]).filter(Boolean))];}
function economyProgressNodeOption(value,current){return `<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${escapeAttr(value)}</option>`;}
function renderEconomyProgressNodeStatus(value){const palette={"已完成":"green","已延期完成":"orange","已延期":"red","进行中":"blue","未开始":"gray"};return tag(value,palette[value]||"gray");}
function renderEconomyProgressNodeDeviation(value){const days=Number(value)||0;if(days<0)return `<span class="economy-progress-node-deviation early">提前${Math.abs(days)}天</span>`;if(days>0)return `<span class="economy-progress-node-deviation late">延期${days}天</span>`;return `<span class="economy-progress-node-deviation normal">无偏差</span>`;}
function openEconomyProgressNodeChangeRecords(id){const row=economyProgressNodeRows.find(item=>item.id===id);if(!row)return;const count=Math.max(0,Number(row.changeCount)||0);const records=Array.from({length:count},(_,index)=>{const sequence=index+1;const latest=row.plannedDate;const previous=index===0?row.plannedDate:(economyProgressNodeDateValue(row.plannedDate)?new Date(economyProgressNodeDateValue(row.plannedDate).getTime()-(count-index)*86400000).toISOString().slice(0,10):row.plannedDate);return {nodeName:row.nodeName,first:row.plannedDate,last:previous,latest,重点:row.keyNode,person:index%2?"项目计划部 王芳":"项目计划部 李明",time:index===count-1?row.adjustedDate:(row.adjustedDate==="--"?"--":row.adjustedDate),content:`${row.nodeName}计划节点调整（第${sequence}次）`};});openModal("变更记录",`<section class="modal-standard-content"><div class="table-wrap roster-table-wrap"><table><thead><tr><th>序号</th><th>里程碑节点名称</th><th>计划完成日期（首次）</th><th>计划完成日期（上次）</th><th>计划完成日期（最新）</th><th>是否重点管控</th><th>调整人姓名</th><th>调整时间</th><th>变更内容</th></tr></thead><tbody>${records.map((item,index)=>`<tr><td>${index+1}</td><td>${escapeAttr(item.nodeName)}</td><td>${item.first}</td><td>${item.last}</td><td>${item.latest}</td><td>${item.重点}</td><td>${item.person}</td><td>${item.time}</td><td>${item.content}</td></tr>`).join("")}</tbody></table></div></section>`,`<button class="btn" onclick="closeModal()">关闭</button>`);}

tableColumnDefinitions.economyProgressNodeReport=[
  {key:"index",title:"序号",width:60,align:"center",render:(row,index)=>economyProgressNodeState.rowOffset+index+1},
  {key:"projectName",title:"项目名称",width:280,align:"left",render:row=>escapeAttr(row.projectName)},
  {key:"company",title:"子公司",width:150,align:"center",render:row=>escapeAttr(row.company)},
  {key:"branch",title:"分公司",width:180,align:"center",render:row=>escapeAttr(row.branch)},
  {key:"nodeName",title:"里程碑节点名称",width:180,align:"left",render:row=>escapeAttr(row.nodeName)},
  {key:"plannedDate",title:"计划完成日期",width:130,align:"center",render:row=>row.plannedDate},
  {key:"actualDate",title:"实际完成日期",width:130,align:"center",render:row=>row.actualDate},
  {key:"deviation",title:"实际完成偏差",width:130,align:"center",render:row=>row.actualDate==="--"?"--":renderEconomyProgressNodeDeviation(row.deviation)},
  {key:"status",title:"节点状态",width:110,align:"center",render:row=>renderEconomyProgressNodeStatus(row.status)},
  {key:"controlLevel",title:"管控等级",width:120,align:"center",render:row=>{const level={"一级":"股份管控","二级":"子公司管控","三级":"分公司管控"}[row.controlLevel]||row.controlLevel;return tag(level,level==="股份管控"?"red":level==="子公司管控"?"orange":"blue");}},
  {key:"keyNode",title:"是否重点进度节点",width:150,align:"center",render:row=>tag(row.keyNode,row.keyNode==="是"?"blue":"gray")},
  {key:"rectificationCount",title:"整改次数",width:100,align:"center",render:row=>row.rectificationCount>0?`<button type="button" class="link" onclick="showToast('整改记录将在后续版本开放')">${row.rectificationCount}</button>`:row.rectificationCount},
  {key:"changeCount",title:"变更次数",width:100,align:"center",render:row=>row.changeCount>0?`<button type="button" class="link" onclick="openEconomyProgressNodeChangeRecords('${row.id}')">${row.changeCount}</button>`:row.changeCount},
  {key:"adjustedDate",title:"最新调整日期",width:130,align:"center",render:row=>row.adjustedDate},
  {key:"manager",title:"项目经理",width:220,align:"center",render:row=>renderProjectManagerContact(row.manager,row.managerPhone,{key:`economy-progress-${row.id}`})},
  {key:"projectCode",title:"项目编号",width:150,align:"center",render:row=>escapeAttr(row.projectCode)},
  {key:"delayDays",title:"延期天数",width:100,align:"center",render:row=>{const days=economyProgressNodeDelay(row);return days>0?`<span class="economy-progress-node-deviation late">${days}</span>`:days<0?`<span class="economy-progress-node-deviation early">${days}</span>`:"0";}}
];
tableColumnDefinitions.economyProgressNodeReport.rightFreezeCount=1;

function getEconomyProgressNodeFilteredRows(){
  const state=economyProgressNodeState;
  return economyProgressNodeRows.filter(row=>(!state.projectName||row.projectName.includes(state.projectName))&&(!state.company||row.company===state.company)&&(!state.branch||row.branch===state.branch)&&(!state.nodeName||row.nodeName.includes(state.nodeName))&&(!state.manager||row.manager.includes(state.manager))&&(!state.projectCode||row.projectCode.includes(state.projectCode)));
}

function syncEconomyProgressNodeFilters(){
  economyProgressNodeState.projectName=document.getElementById("economyProgressProjectName")?.value.trim()||"";
  economyProgressNodeState.company=document.getElementById("economyProgressCompany")?.value||"";
  economyProgressNodeState.branch=document.getElementById("economyProgressBranch")?.value||"";
  economyProgressNodeState.nodeName=document.getElementById("economyProgressNodeName")?.value.trim()||"";
  economyProgressNodeState.manager=document.getElementById("economyProgressManager")?.value.trim()||"";
  economyProgressNodeState.projectCode=document.getElementById("economyProgressProjectCode")?.value.trim()||"";
  economyProgressNodeState.calculationDate=(document.getElementById("economyProgressCalculationDate")?.value||"").replace(/-/g,"");
  const wrap=document.querySelector(".economy-progress-node-table-card .roster-table-wrap");if(wrap){economyProgressNodeState.scrollLeft=wrap.scrollLeft;economyProgressNodeState.scrollTop=wrap.scrollTop;}
  economyProgressNodeState.page=1;renderEconomyProgressNodeReportPage();
}

function resetEconomyProgressNodeFilters(){Object.assign(economyProgressNodeState,{projectName:"",company:"",branch:"",nodeName:"",manager:"",projectCode:"",calculationDate:"20260904",page:1});renderEconomyProgressNodeReportPage();}
function changeEconomyProgressNodePage(page){economyProgressNodeState.page=Number(page)||1;renderEconomyProgressNodeReportPage();}
function changeEconomyProgressNodePageSize(value){economyProgressNodeState.pageSize=Number(value)||10;economyProgressNodeState.page=1;renderEconomyProgressNodeReportPage();}

function renderEconomyProgressNodeReportPage(){
  const rows=getEconomyProgressNodeFilteredRows(),totalPages=Math.max(1,Math.ceil(rows.length/economyProgressNodeState.pageSize));
  economyProgressNodeState.page=Math.min(economyProgressNodeState.page,totalPages);
  const start=(economyProgressNodeState.page-1)*economyProgressNodeState.pageSize,pageRows=rows.slice(start,start+economyProgressNodeState.pageSize);economyProgressNodeState.rowOffset=start;
  const companies=economyProgressNodeOptions("company"),branches=economyProgressNodeOptions("branch");
  const queryFields=`<div class="form-item"><label>项目名称</label><input class="input" id="economyProgressProjectName" placeholder="请输入项目名称" value="${escapeAttr(economyProgressNodeState.projectName)}"></div><div class="form-item"><label>子公司</label><select class="select" id="economyProgressCompany"><option value="">全部</option>${companies.map(value=>economyProgressNodeOption(value,economyProgressNodeState.company)).join("")}</select></div><div class="form-item"><label>分公司</label><select class="select" id="economyProgressBranch"><option value="">全部</option>${branches.map(value=>economyProgressNodeOption(value,economyProgressNodeState.branch)).join("")}</select></div><div class="form-item"><label>里程碑节点名称</label><input class="input" id="economyProgressNodeName" placeholder="请输入节点名称" value="${escapeAttr(economyProgressNodeState.nodeName)}"></div><div class="form-item"><label>项目经理</label><input class="input" id="economyProgressManager" placeholder="请输入项目经理" value="${escapeAttr(economyProgressNodeState.manager)}"></div><div class="form-item"><label>项目编号</label><input class="input" id="economyProgressProjectCode" placeholder="请输入项目编号" value="${escapeAttr(economyProgressNodeState.projectCode)}"></div><div class="form-item"><label>模拟计算日期</label><input class="input" type="date" id="economyProgressCalculationDate" value="${escapeAttr(economyProgressNodeDateInputValue(economyProgressNodeState.calculationDate))}"></div>`;
  const query=renderUnifiedQueryCard(queryFields,{id:"economyProgressNodeQuery",gridClass:"search-grid",queryFn:"syncEconomyProgressNodeFilters()",resetFn:"resetEconomyProgressNodeFilters()",canCollapse:false});
  const pagination=`<span>共 ${rows.length} 条记录</span><div class="pager"><button class="btn mini" type="button" ${economyProgressNodeState.page<=1?"disabled":""} onclick="changeEconomyProgressNodePage(${economyProgressNodeState.page-1})">上一页</button><b>第 ${economyProgressNodeState.page} / ${totalPages} 页</b><button class="btn mini" type="button" ${economyProgressNodeState.page>=totalPages?"disabled":""} onclick="changeEconomyProgressNodePage(${economyProgressNodeState.page+1})">下一页</button><select class="select mini-select" onchange="changeEconomyProgressNodePageSize(this.value)"><option value="10" ${economyProgressNodeState.pageSize===10?"selected":""}>10条/页</option><option value="20" ${economyProgressNodeState.pageSize===20?"selected":""}>20条/页</option><option value="50" ${economyProgressNodeState.pageSize===50?"selected":""}>50条/页</option></select></div>`;
  const table=renderUnifiedTableCard({title:"进度节点列表",className:"economy-progress-node-table-card",tableKey:"economyProgressNodeReport",tbodyId:"economyProgressNodeTbody",total:rows.length,paginationHtml:pagination,renderFnName:"renderEconomyProgressNodeReportPage",refreshAction:"renderEconomyProgressNodeReportPage();showToast('进度节点列表已刷新')",exportAction:"showToast('导出成功：进度节点列表.xlsx')"});
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-progress-node-report-page",titleHtml:`<div class="compact-title-row"><div class="module-title">经济报表 / 进度节点</div></div>`,queryHtml:query,contentHtml:table});
  renderTableByColumns("economyProgressNodeReport",pageRows,"economyProgressNodeTbody");
  const nextWrap=document.querySelector(".economy-progress-node-table-card .roster-table-wrap");if(nextWrap){nextWrap.scrollLeft=economyProgressNodeState.scrollLeft;nextWrap.scrollTop=economyProgressNodeState.scrollTop;}
}
