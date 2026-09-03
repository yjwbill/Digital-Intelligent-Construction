/* =========================
   V2.0.1 消息中心
========================= */
const messageCenterState={
  type:"消息通知",
  status:"全部",
  module1:"",
  module2:"",
  search:"",
  orgAggregate:false,
  org:"",
  orgKeyword:"",
  page:1,
  pageSize:50
};

const messageTypeConfig=[
  {name:"消息通知"},
  {name:"通知公告"},
  {name:"预警通知"}
];

const messageModuleGroups=[
  {
    name:"安全",
    children:[
      {name:"实名制",count:12},
      {name:"隐患排查",count:9},
      {name:"视频监控",count:8},
      {name:"每日监督",count:6},
      {name:"工程保险",count:6},
      {name:"重大风险",count:2},
      {name:"安全纳管",count:2}
    ]
  },
  {
    name:"风险",
    children:[
      {name:"进度",count:2},
      {name:"风险",count:2},
      {name:"产值",count:2},
      {name:"质量",count:2},
      {name:"纳统",count:2},
      {name:"材料",count:1}
    ]
  },
  {
    name:"经济",
    children:[
      {name:"经济诊断",count:1},
      {name:"合同管理",count:2},
      {name:"结算管理",count:1}
    ]
  }
];

const messageOrgTree=[
  {name:"隧道股份",count:205,children:[
    {name:"上海隧道",count:85},
    {name:"市政集团",count:77},
    {name:"上海路桥",count:66},
    {name:"城市环境",count:25},
    {name:"城建国际",count:15},
    {name:"城建设计",count:5}
  ]}
];

let messageData=[
  {id:1,type:"消息通知",module1:"安全",module2:"每日监督",title:"每日安全监督填报提醒",content:"今日共247个项目需进行安全每日监督，剩余66个项目未填报，请关注",org:"市政集团",status:"未读",sendTime:"2024-05-06 10:22:24",level:"orange",jumpLink:"/pages/safety/daily-supervision"},
  {id:2,type:"消息通知",module1:"安全",module2:"安全纳管",title:"安全纳管状态更新提醒",content:"大外环西段（求雨岭门站～深莞分界处）天然气高压管线工程项目状态已由在建变更为停工，安全纳管状态已纳管调整为暂停纳管",org:"上海隧道",status:"未读",sendTime:"2024-05-06 10:22:24",level:"orange",jumpLink:"/pages/safety/rectify?id=123"},
  {id:3,type:"消息通知",module1:"安全",module2:"工程保险",title:"安全纳管状态更新提醒",content:"上海市轨道交通23号线一期工程上水管线临搬及复位工程1标项目的项目状态已由在建变更为停工，安全纳管状态由已纳管调整为暂停纳管",org:"上海路桥",status:"未读",sendTime:"2024-05-06 10:22:24",level:"orange",jumpLink:"/pages/safety/rectify?id=124"},
  {id:4,type:"消息通知",module1:"安全",module2:"实名制",title:"总包安全员未配足项目提醒",content:"截至至今日**点，本集团内“总包安全员未配足项目”共有**个。其中上海隧道**个，上海路桥**个，市政集团**个，城市环境**个，上海能建**个",org:"隧道股份",status:"已读",sendTime:"2024-05-06 10:22:24",level:"green",jumpLink:""},
  {id:5,type:"消息通知",module1:"安全",module2:"隐患排查",title:"系统版本更新提醒",content:"数智施工正式发布V2.8.4版本—安全板块变更内容，详情请点击消息查看或进入版本更新记录查看",org:"上海隧道",status:"已读",sendTime:"2024-05-06 10:22:24",level:"green",jumpLink:""},
  {id:6,type:"消息通知",module1:"安全",module2:"视频监控",title:"视频监控离线提醒",content:"华东智慧产业园一期3个摄像头离线超过30分钟，请项目部及时排查网络和电源情况",org:"市政集团",status:"未读",sendTime:"2024-05-06 09:58:12",level:"orange",jumpLink:"/pages/video/offline"},
  {id:7,type:"消息通知",module1:"安全",module2:"实名制",title:"实名制考勤异常提醒",content:"湾区金融中心项目今日劳务工考勤异常人数12人，请核实进退场及打卡记录",org:"上海隧道",status:"未读",sendTime:"2024-05-06 09:35:18",level:"orange",jumpLink:"/pages/labor/attendance"},
  {id:8,type:"消息通知",module1:"风险",module2:"进度",title:"关键节点延期预警",content:"北方数据中心项目关键里程碑节点存在延期风险，请项目负责人及时处理",org:"上海路桥",status:"已读",sendTime:"2024-05-05 18:20:02",level:"green",jumpLink:"/pages/progress/milestone"},
  {id:9,type:"通知公告",module1:"安全",module2:"安全纳管",title:"关于加强节假日期间安全巡查的通知",content:"各单位需加强节假日期间安全巡查，重点关注深基坑、临边洞口、起重机械等重大风险源。",org:"隧道股份",status:"未读",sendTime:"2024-05-04 15:30:00",level:"green"},
  {id:10,type:"通知公告",module1:"经济",module2:"合同管理",title:"合同归档材料提交公告",content:"请各项目在本周五前完成合同归档材料提交，逾期将纳入月度管理通报。",org:"上海隧道",status:"已读",sendTime:"2024-05-03 11:00:00",level:"green"},
  {id:11,type:"预警通知",module1:"安全",module2:"重大风险",title:"重大风险超期未整改预警",content:"市政集团共有2项重大风险隐患超过整改期限，请立即组织复查并闭环。",org:"市政集团",status:"未读",sendTime:"2024-05-06 08:10:00",level:"orange",jumpLink:"/pages/risk/detail?id=11"},
  {id:12,type:"预警通知",module1:"经济",module2:"结算管理",title:"结算资料缺失预警",content:"上海路桥部分项目结算资料缺失，请在系统中补充上传并提交审核。",org:"上海路桥",status:"未读",sendTime:"2024-05-05 13:42:12",level:"orange",jumpLink:"/pages/economy/settlement"}
];

const todoCenterState={
  status:"全部",
  module1:"",
  module2:"",
  search:"",
  orgAggregate:false,
  org:"",
  orgKeyword:"",
  page:1,
  pageSize:50
};

const approvalCenterState={
  tab:"待我审批",
  category:"",
  categorySearch:"",
  search:"",
  page:1,
  pageSize:50,
  sortKey:"startTime",
  sortDir:"desc",
  openGroups:new Set(["项目状态","产值管理","进度管理","风险管理"])
};

const approvalCategoryGroups=[
  {name:"项目状态",children:["工程总体筹划","停工申请","项目终止"]},
  {name:"产值管理",children:["实际产值上报","期初产值上报","产值滚动更新"]},
  {name:"进度管理",children:["进度变更","进度变更分公司"]},
  {name:"风险管理",children:["II级风险变更","II级风险条件验收","I级风险条件验收"]}
];

let approvalCenterData=[
  {id:1,scope:"企业",name:"内部测试专用（数字集团）",category:"I级风险条件验收",content:"风险条件验收",initiator:"楼力栋",startTime:"2026-06-16 14:14",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:2,scope:"项目",name:"G1503公路同三段部分路段综合整治及长周期养护工程",category:"进度变更",content:"无数据变更",initiator:"楼力栋",startTime:"2026-04-07 18:18",status:"审批中",tabs:["我发起的"]},
  {id:3,scope:"项目",name:"景德镇陶阳里历史文化街区配套项目酒店工程",category:"进度变更分公司",content:"更新工程开工预计开始日期，调整关键节点计划。",initiator:"楼力栋",startTime:"2026-01-30 14:38",status:"已作废",tabs:["我发起的"]},
  {id:4,scope:"项目",name:"景德镇陶阳里历史文化街区配套项目酒店工程",category:"进度变更分公司",content:"工程开工删除，更新普通节点1个。",initiator:"楼力栋",startTime:"2026-01-30 14:32",status:"已作废",tabs:["我发起的"]},
  {id:5,scope:"项目",name:"内部测试专用（数字集团）",category:"项目终止",content:"终止日期：2026-01-13，终止原因：项目实施条件变化。",initiator:"楼力栋",startTime:"2026-01-13 15:00",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:6,scope:"项目",name:"内部测试专用（数字集团）",category:"工程总体筹划",content:"工程总体筹划提交审批",initiator:"楼力栋",startTime:"2026-01-12 13:32",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:7,scope:"项目",name:"上海示范区线工程 SFQSG-15 标",category:"I级风险条件验收",content:"深基坑开挖前置条件验收，请审批。",initiator:"张建国",startTime:"2026-08-03 09:10",status:"待审批",tabs:["待我审批"]},
  {id:8,scope:"项目",name:"机场联络线工程 JCXSG-4 标",category:"II级风险变更",content:"风险等级及管控措施变更审批。",initiator:"王晨",startTime:"2026-08-03 08:42",status:"待审批",tabs:["待我审批"]},
  {id:9,scope:"企业",name:"上海隧道工程有限公司",category:"实际产值上报",content:"2026年7月实际产值上报审批。",initiator:"赵经营",startTime:"2026-08-02 17:30",status:"待审批",tabs:["待我审批"]},
  {id:10,scope:"项目",name:"北方数据中心项目",category:"停工申请",content:"计划停工日期：2026-08-05，申请临时停工。",initiator:"陈启航",startTime:"2026-08-02 16:05",status:"已驳回",tabs:["已办审批"]},
  {id:11,scope:"项目",name:"西湖区朝阳污水处理厂收集范围排水单元改造工程",category:"期初产值上报",content:"期初产值：12780.53万元，期初营收：11725.26万元。",initiator:"楼力栋",startTime:"2025-11-20 15:43",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:12,scope:"项目",name:"内部测试专用（数字集团）",category:"产值滚动更新",content:"计划工期及总计划产值滚动更新。",initiator:"楼力栋",startTime:"2025-11-20 19:03",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:13,scope:"项目",name:"内部测试专用（数字集团）",category:"停工申请",content:"计划停工日期：2025-11-19，计划复工日期：2025-11-20。",initiator:"楼力栋",startTime:"2025-11-19 02:33",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:14,scope:"项目",name:"内部测试专用（数字集团）",category:"工程总体筹划",content:"工程总体筹划提交审批。",initiator:"楼力栋",startTime:"2025-11-19 02:29",status:"已通过",tabs:["我发起的","已办审批"]},
  {id:15,scope:"项目",name:"上海示范区线工程 SFQSG-15 标",category:"进度变更",content:"施工进度计划调整草稿，尚未提交审批。",initiator:"楼力栋",startTime:"2026-08-03 10:26",status:"草稿",tabs:["我发起的"]},
  {id:16,scope:"项目",name:"机场联络线工程 JCXSG-4 标",category:"II级风险条件验收",content:"盾构始发条件验收审批已抄送，请查阅。",initiator:"张建国",startTime:"2026-08-02 15:20",status:"已通过",tabs:["抄送我的"]},
  {id:17,scope:"企业",name:"上海隧道工程有限公司",category:"产值滚动更新",content:"2026年三季度产值滚动更新审批结果抄送。",initiator:"赵经营",startTime:"2026-08-01 11:08",status:"已通过",tabs:["抄送我的"]}
];

approvalCenterData=approvalCenterData.map((row,index)=>({
  ...row,
  approver:row.status==="草稿"?"-":row.status==="待审批"?"当前登录人":["陈审批","王经理","赵主管"][index%3]
}));

tableColumnDefinitions.approvalCenter=[
  {key:"index",title:"序号",width:70,align:"center",sortable:false,render:(row,index)=>(approvalCenterState.page-1)*approvalCenterState.pageSize+index+1},
  {key:"scope",title:"审批对象",width:100,align:"center",render:row=>tag(row.scope,row.scope==="企业"?"red":"blue")},
  {key:"name",title:"对象名称",width:280,align:"left",render:row=>`<span class="approval-cell-ellipsis" title="${escapeAttr(row.name)}">${row.name}</span>`},
  {key:"category",title:"审批类型",width:180,align:"center",render:row=>tag(row.category,"blue")},
  {key:"content",title:"审批内容",width:440,align:"left",render:row=>`<span class="approval-cell-ellipsis" title="${escapeAttr(row.content)}">${row.content}</span>`},
  {key:"initiator",title:"审批发起人",width:110,align:"center",render:row=>row.initiator},
  {key:"startTime",title:"审批发起时间",width:160,align:"center",render:row=>row.startTime},
  {key:"status",title:"审批状态",width:110,align:"center",render:row=>renderApprovalStatus(row.status)},
  {key:"operation",title:"操作",width:120,align:"center",sortable:false,render:row=>renderApprovalCenterActions(row)}
];

let todoData=[
  {id:1,module1:"安全",module2:"隐患排查",title:"隐患整改闭环处理",content:"机场联络线工程 3 条重大隐患整改超期，请完成复核并提交闭环资料。",org:"市政集团",status:"未办理",sendTime:"2026-06-26 08:30:24",level:"orange",jumpLink:"/pages/safety/rectify?id=todo001",deadline:"2026-06-27 18:00:00",sourceNo:"TODO202606260001"},
  {id:2,module1:"安全",module2:"每日监督",title:"每日安全监督填报",content:"大外环西段今日安全每日监督尚未填报，请在 17:00 前完成。",org:"上海隧道",status:"未办理",sendTime:"2026-06-26 09:00:00",level:"orange",jumpLink:"/pages/safety/daily-supervision",deadline:"2026-06-26 17:00:00",sourceNo:"TODO202606260002"},
  {id:3,module1:"安全",module2:"实名制",title:"劳务人员实名信息补全",content:"湾区金融中心项目有 12 名劳务人员实名信息缺失，请补全证件与班组信息。",org:"上海隧道",status:"未办理",sendTime:"2026-06-26 09:18:12",level:"orange",jumpLink:"/pages/labor/roster",deadline:"2026-06-28 18:00:00",sourceNo:"TODO202606260003"},
  {id:4,module1:"风险",module2:"进度",title:"里程碑节点延期确认",content:"北方数据中心项目关键里程碑存在延期风险，请确认延期原因并提交调整说明。",org:"上海路桥",status:"已办理",sendTime:"2026-06-25 16:20:02",level:"green",jumpLink:"/pages/progress/milestone",deadline:"2026-06-26 18:00:00",sourceNo:"TODO202606250004"},
  {id:5,module1:"经济",module2:"合同管理",title:"合同归档材料审核",content:"请审核上海隧道提交的合同归档材料，确认无误后完成办理。",org:"上海隧道",status:"未办理",sendTime:"2026-06-25 14:10:00",level:"orange",jumpLink:"/pages/contract/archive",deadline:"2026-06-29 18:00:00",sourceNo:"TODO202606250005"},
  {id:6,module1:"经济",module2:"结算管理",title:"结算资料补充确认",content:"上海路桥部分项目结算资料已补充上传，请确认资料完整性。",org:"上海路桥",status:"已办理",sendTime:"2026-06-24 11:42:12",level:"green",jumpLink:"/pages/economy/settlement",deadline:"2026-06-26 12:00:00",sourceNo:"TODO202606240006"}
];

const projectMessageModuleGroups=[
  {name:"首页",children:[{name:"工作桌面",count:3},{name:"项目详情",count:1},{name:"施工日志",count:2}]},
  {name:"生产",children:[{name:"进度填报",count:2},{name:"产值上报",count:1},{name:"施工日志",count:2}]},
  {name:"安全",children:[{name:"隐患整改",count:2},{name:"每日监督",count:1},{name:"实名制",count:1}]},
  {name:"经济",children:[{name:"合同付款",count:1},{name:"签证变更",count:1}]}
];
const projectMessageOrgTree=[
  {name:"上海示范区线工程 SFQSG-15 标",count:18,children:[
    {name:"项目经理部",count:8},
    {name:"工程技术组",count:5},
    {name:"安全管理组",count:3},
    {name:"商务合约组",count:2}
  ]}
];
let projectMessageData=[
  {id:101,type:"消息通知",module1:"生产",module2:"施工日志",title:"今日施工日志填报提醒",content:"今日施工日志尚未完成，请项目施工员在 20:00 前提交。",org:"项目经理部",status:"未读",sendTime:"2026-07-06 09:20:00",level:"orange",jumpLink:"/project/log"},
  {id:102,type:"消息通知",module1:"安全",module2:"隐患整改",title:"临边防护整改复核提醒",content:"A 区临边防护整改已提交，请安全员完成现场复核。",org:"安全管理组",status:"未读",sendTime:"2026-07-06 10:15:00",level:"orange",jumpLink:"/project/safety/rectify"},
  {id:103,type:"通知公告",module1:"首页",module2:"工作桌面",title:"项目周例会通知",content:"本周项目生产协调会调整至周三 14:00，请相关岗位准时参加。",org:"项目经理部",status:"已读",sendTime:"2026-07-05 17:30:00",level:"green"},
  {id:104,type:"预警通知",module1:"生产",module2:"进度填报",title:"区间贯通节点存在延期风险",content:"盾构区间右线推进进度低于计划 2.3%，请工程技术组补充纠偏措施。",org:"工程技术组",status:"未读",sendTime:"2026-07-06 08:50:00",level:"orange",jumpLink:"/project/progress"},
  {id:105,type:"消息通知",module1:"经济",module2:"合同付款",title:"合同付款资料补充提醒",content:"第 4 期进度款资料缺少现场确认单，请商务合约组补充上传。",org:"商务合约组",status:"未读",sendTime:"2026-07-04 15:12:00",level:"orange",jumpLink:"/project/economy/payment"}
];
let projectTodoData=[
  {id:101,module1:"生产",module2:"施工日志",title:"补充今日施工日志",content:"请补充 2026-07-06 施工日志中的作业人数、机械台班和照片附件。",org:"项目经理部",status:"未办理",sendTime:"2026-07-06 09:00:00",level:"orange",jumpLink:"/project/log",deadline:"2026-07-06 20:00:00",sourceNo:"PTODO202607060001"},
  {id:102,module1:"安全",module2:"隐患整改",title:"完成临边防护整改复核",content:"A 区临边防护整改已由班组提交，请安全员现场复核并关闭隐患。",org:"安全管理组",status:"未办理",sendTime:"2026-07-06 09:35:00",level:"orange",jumpLink:"/project/safety/rectify",deadline:"2026-07-06 18:00:00",sourceNo:"PTODO202607060002"},
  {id:103,module1:"生产",module2:"进度填报",title:"提交本周进度纠偏措施",content:"区间贯通节点进度偏差，请工程技术组提交纠偏措施。",org:"工程技术组",status:"未办理",sendTime:"2026-07-06 10:05:00",level:"orange",jumpLink:"/project/progress",deadline:"2026-07-07 12:00:00",sourceNo:"PTODO202607060003"},
  {id:104,module1:"经济",module2:"合同付款",title:"补充第 4 期进度款资料",content:"第 4 期进度款缺少现场确认单，请商务合约组补充。",org:"商务合约组",status:"已办理",sendTime:"2026-07-05 16:30:00",level:"green",jumpLink:"/project/economy/payment",deadline:"2026-07-06 17:00:00",sourceNo:"PTODO202607050004"}
];

function isProjectPortalMode(){
  return pcPortalState.mode==="project";
}

function getActiveMessageData(){
  return isProjectPortalMode()?projectMessageData:messageData;
}

function getActiveTodoData(){
  return isProjectPortalMode()?projectTodoData:todoData;
}

function getActiveMessageModuleGroups(){
  return isProjectPortalMode()?projectMessageModuleGroups:messageModuleGroups;
}

function getActiveMessageOrgTree(){
  return typeof orgTreeData!=="undefined"&&orgTreeData?[orgTreeData]:[];
}

function getActiveOrgNames(){
  return getUnifiedOrgDescendantNames(getActiveMessageOrgTree()[0],[]);
}

function findActiveMessageOrgNode(name,node=getActiveMessageOrgTree()[0]){
  if(!node)return null;
  if(node.name===name)return node;
  for(const child of node.children||[]){
    const found=findActiveMessageOrgNode(name,child);
    if(found)return found;
  }
  return null;
}

function getActiveMessageOrgScopeNames(name){
  return getUnifiedOrgDescendantNames(findActiveMessageOrgNode(name),[]);
}

function ensureBottomFixedMenu(){
  if(window.__digitalConstructionMode!=="pc")return;
  if(document.getElementById("bottomFixedMenu"))return;

  const box=document.createElement("div");
  box.id="bottomFixedMenu";
  box.className="bottom-fixed-workbench";
  box.innerHTML=`
    <div class="bottom-menu-item todo" onclick="openTodoCenter()">
      <span class="bottom-menu-left"><i class="bottom-menu-icon">✅</i><span>待办</span></span>
      <span class="bottom-menu-badge" id="bottomTodoPending">${getTodoCount()}</span>
    </div>
    <div class="bottom-menu-item approval" onclick="openApprovalCenter()">
      <span class="bottom-menu-left"><i class="bottom-menu-icon">🧾</i><span>审批</span></span>
      <span class="bottom-menu-badge">${getApprovalCount()}</span>
    </div>
    <div class="bottom-menu-item message" onclick="openMessageCenter()">
      <span class="bottom-menu-left"><i class="bottom-menu-icon">💬</i><span>消息</span></span>
      <span class="bottom-menu-badge" id="bottomMessageUnread">${getUnreadMessageCount()}</span>
    </div>
  `;
  document.body.appendChild(box);
}

function removeBottomFixedMenu(){
  document.getElementById("bottomFixedMenu")?.remove();
}

function refreshBottomFixedMenu(){
  const box=document.getElementById("bottomFixedMenu");
  if(!box)return ensureBottomFixedMenu();
  const todoBadge=document.getElementById("bottomTodoPending");
  const msgBadge=document.getElementById("bottomMessageUnread");
  const approvalBadge=box.querySelector(".bottom-menu-item.approval .bottom-menu-badge");
  if(todoBadge)todoBadge.innerText=getTodoCount();
  if(msgBadge)msgBadge.innerText=getUnreadMessageCount();
  if(approvalBadge)approvalBadge.innerText=getApprovalCount();
}

function getTodoCount(){return getActiveTodoData().filter(x=>x.status==="未办理").length;}
function getApprovalCount(){return approvalCenterData.filter(row=>row.tabs.includes("待我审批")&&row.status==="待审批").length;}
function getUnreadMessageCount(){
  return getActiveMessageData().filter(x=>x.status==="未读").length;
}

function getMessagesByType(type=messageCenterState.type){
  return getActiveMessageData().filter(x=>x.type===type);
}

function getMessageStatusCounts(){
  const list=getMessagesByType();
  return {
    all:list.length,
    unread:list.filter(x=>x.status==="未读").length,
    read:list.filter(x=>x.status==="已读").length
  };
}

function setMessageType(type){
  messageCenterState.type=type;
  messageCenterState.status="全部";
  messageCenterState.page=1;
  messageCenterState.module1="";
  messageCenterState.module2="";
  renderMessageCenter();
}

function setMessageStatus(status){
  messageCenterState.status=status;
  messageCenterState.page=1;
  renderMessageCenter();
}

function toggleMessageModuleGroup(module1){
  if(messageCenterState.module1===module1 && !messageCenterState.module2){
    messageCenterState.module1="";
    messageCenterState.module2="";
  }else{
    messageCenterState.module1=module1 || "";
    messageCenterState.module2="";
  }
  messageCenterState.page=1;
  renderMessageCenter();
}

function setMessageModule(module1,module2){
  messageCenterState.module1=module1 || "";
  messageCenterState.module2=module2 || "";
  messageCenterState.page=1;
  renderMessageCenter();
}

function setMessageOrg(org){
  messageCenterState.org=org || "";
  messageCenterState.page=1;
  renderMessageCenter();
}

function toggleOrgAggregate(){
  messageCenterState.orgAggregate=document.getElementById("messageOrgAggregate")?.checked || false;
  if(!messageCenterState.orgAggregate)messageCenterState.org="";
  messageCenterState.page=1;
  renderMessageCenter();
}

function searchMessageByInput(){
  messageCenterState.search=document.getElementById("messageSearchInput")?.value.trim() || "";
  messageCenterState.page=1;
  renderMessageCenter();
}

function markAllMessageRead(){
  const unread=getMessagesByType().filter(x=>x.status==="未读");
  if(!unread.length)return;
  unread.forEach(x=>x.status="已读");
  showToast("当前消息通知已全部标记为已读");
  renderMessageCenter();
}

function getFilteredMessages(){
  let list=getMessagesByType();

  if(messageCenterState.status==="未读")list=list.filter(x=>x.status==="未读");
  if(messageCenterState.status==="已读")list=list.filter(x=>x.status==="已读");

  if(messageCenterState.module1)list=list.filter(x=>x.module1===messageCenterState.module1);
  if(messageCenterState.module2)list=list.filter(x=>x.module2===messageCenterState.module2);

  if(messageCenterState.search){
    const kw=messageCenterState.search;
    list=list.filter(x=>x.title.includes(kw)||x.content.includes(kw));
  }

  return list.slice().sort((a,b)=>{
    if(messageCenterState.status==="全部"&&a.status!==b.status){
      return a.status==="未读"?-1:1;
    }
    return new Date(b.sendTime)-new Date(a.sendTime);
  });
}

function getMessagePageData(){
  const all=getFilteredMessages();
  const total=all.length;
  const pageSize=messageCenterState.pageSize;
  const pageCount=Math.max(1,Math.ceil(total/pageSize));
  messageCenterState.page=Math.min(messageCenterState.page,pageCount);
  const start=(messageCenterState.page-1)*pageSize;
  return {total,pageCount,list:all.slice(start,start+pageSize)};
}

function getMessageTypeCount(type){
  return getActiveMessageData().filter(x=>x.type===type).length;
}

function renderMessageTypeTabs(){
  return `
    <div class="message-type-tabs center-top-status-switch">
      ${messageTypeConfig.map(t=>{
        const active=messageCenterState.type===t.name;
        const count=getMessageTypeCount(t.name);
        return `
          <button type="button" class="center-status-option ${active?"active":""}" onclick="setMessageType('${t.name}')">
            <span>${t.name}</span>
            <em class="center-status-badge ${t.name==="消息通知"?"orange":t.name==="通知公告"?"blue":"red"}">${count}</em>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderMessageTopActions(){
  const unread=getMessagesByType().some(x=>x.status==="未读");
  return `
    <div class="message-actions">
      ${messageCenterState.type==="消息通知"?`<button class="btn primary ${unread?"":"disabled"}" ${unread?'onclick="markAllMessageRead()"':""}>一键已读</button>`:""}
      <div class="message-search-box">
        <input id="messageSearchInput" value="${messageCenterState.search}" onkeydown="if(event.key==='Enter')searchMessageByInput()" onchange="searchMessageByInput()" placeholder="输入消息内容搜索"/>
        <span onclick="searchMessageByInput()">⌕</span>
      </div>
    </div>
  `;
}

function renderMessageStatusTabs(){
  const c=getMessageStatusCounts();
  return `
    <div class="message-status-tabs">
      <span class="${messageCenterState.status==="全部"?"active":""}" onclick="setMessageStatus('全部')">全部（${c.all}）</span>
      <span class="${messageCenterState.status==="未读"?"active":""}" onclick="setMessageStatus('未读')">未读（${c.unread}）</span>
      <span class="${messageCenterState.status==="已读"?"active":""}" onclick="setMessageStatus('已读')">已读（${c.read}）</span>
    </div>
  `;
}


function getMessageModuleCount(module1,module2){
  return getActiveMessageData().filter(x=>x.type===messageCenterState.type && x.module1===module1 && x.module2===module2).length;
}

function getMessageOrgCount(org){
  const names=getActiveMessageOrgScopeNames(org);
  return getActiveMessageData().filter(x=>names.includes(x.org)).length;
}

function renderCenterOrgNodes(kind,node=getActiveMessageOrgTree()[0],level=1){
  if(!node)return "";
  const state=kind==="message"?messageCenterState:todoCenterState;
  if(!unifiedOrgTreeMatches(node,state.orgKeyword))return "";
  const selectFn=kind==="message"?"setMessageOrg":"setTodoOrg";
  const count=kind==="message"?getMessageOrgCount(node.name):getTodoOrgCount(node.name);
  return `<div class="org-node ${state.org===node.name?"active":""}" style="--unified-org-level:${level}" onclick="${selectFn}('${escapeAttr(node.name)}')"><span><i class="unified-org-level-icon">${getUnifiedOrgTreeIcon(level)}</i>${node.name}</span><em>${count}</em></div>${(node.children||[]).map(child=>renderCenterOrgNodes(kind,child,level+1)).join("")}`;
}

function filterCenterOrgTree(kind,keyword){
  const state=kind==="message"?messageCenterState:todoCenterState;
  state.orgKeyword=String(keyword||"");
  const body=document.getElementById(`${kind}CenterOrgTreeBody`);
  if(body)body.innerHTML=renderCenterOrgNodes(kind) || '<div class="unified-org-tree-empty">暂无匹配的组织</div>';
}

function renderMessageModuleFilter(){
  return `
    <div class="message-module-filter">
      <div class="message-module-scroll">
        ${getActiveMessageModuleGroups().map(g=>{
          const groupCount=getActiveMessageData().filter(x=>x.type===messageCenterState.type && x.module1===g.name).length;
          const groupActive=messageCenterState.module1===g.name && !messageCenterState.module2;
          return `
            <div class="message-module-row">
              <strong class="${groupActive?"active":""}" onclick="toggleMessageModuleGroup('${g.name}')">${g.name}（${groupCount}）</strong>
              ${g.children.map(c=>{
                const count=getMessageModuleCount(g.name,c.name);
                return `<span class="${messageCenterState.module1===g.name&&messageCenterState.module2===c.name?"active":""}" onclick="setMessageModule('${g.name}','${c.name}')">${c.name}（${count}）</span>`;
              }).join("")}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderMessageOrgTree(){
  if(!messageCenterState.orgAggregate)return "";

  return `
    <aside class="message-org-panel unified-org-tree-panel">
      <div class="message-org-title">组织聚合</div>
      <div class="message-org-search">
        <input value="${escapeAttr(messageCenterState.orgKeyword)}" placeholder="请输入组织名称" oninput="filterCenterOrgTree('message',this.value)"/>
        <button type="button" title="搜索">⌕</button>
      </div>
      <div id="messageCenterOrgTreeBody">${renderCenterOrgNodes("message")}</div>
    </aside>
  `;
}

function renderMessageCards(){
  const page=getMessagePageData();

  if(!page.list.length){
    return `<div class="message-empty">暂无消息</div>`;
  }

  return page.list.map(m=>`
    <div class="message-card ${m.status==="未读"?"unread orange":"read"}" onclick="openReceiverMessageDetail(${m.id})">
      <div class="message-card-main">
        <div class="message-card-title">
          <span class="message-card-module">${m.module2}</span>
          <strong>${m.title}</strong>
          ${m.status==="未读"?`<span class="message-read-tag unread">未读</span>`:""}
        </div>
        <div class="message-card-content">${m.content}</div>
      </div>
      <div class="message-card-time">${m.sendTime}</div>
    </div>
  `).join("");
}

function renderMessagePagination(){
  const page=getMessagePageData();
  const pages=Array.from({length:Math.min(5,page.pageCount)},(_,i)=>i+1);
  return `
    <div class="message-pagination">
      <span>共 ${page.total} 条</span>
      <div class="message-page-btns">
        <button onclick="setMessagePage(1)">«</button>
        <button onclick="setMessagePage(${Math.max(1,messageCenterState.page-1)})">‹</button>
        ${pages.map(p=>`<button class="${messageCenterState.page===p?"active":""}" onclick="setMessagePage(${p})">${p}</button>`).join("")}
        ${page.pageCount>5?`<span>…</span><button onclick="setMessagePage(${page.pageCount})">${page.pageCount}</button>`:""}
        <button onclick="setMessagePage(${Math.min(page.pageCount,messageCenterState.page+1)})">›</button>
        <button onclick="setMessagePage(${page.pageCount})">»</button>
        <select onchange="setMessagePageSize(this.value)">
          <option value="20" ${messageCenterState.pageSize===20?"selected":""}>20条/页</option>
          <option value="50" ${messageCenterState.pageSize===50?"selected":""}>50条/页</option>
          <option value="100" ${messageCenterState.pageSize===100?"selected":""}>100条/页</option>
        </select>
      </div>
    </div>
  `;
}

function setMessagePage(p){
  messageCenterState.page=Number(p)||1;
  renderMessageCenter();
}

function setMessagePageSize(v){
  messageCenterState.pageSize=Number(v)||50;
  messageCenterState.page=1;
  renderMessageCenter();
}

function openReceiverMessageDetail(id){
  const m=getActiveMessageData().find(x=>x.id===id);
  if(!m)return;
  m.status="已读";
  const isWarning=m.type==="预警通知";
  const html=isWarning?`
    <div class="receiver-message-popup warning">
      <div class="receiver-message-title">⚠️ ${m.title}</div>
      <div class="receiver-message-time">更新发布于 ${m.sendTime}</div>
      <div class="receiver-message-body">
        <div class="receiver-message-warning-icon">暴雨</div>
        <p>${m.content}</p>
        <p><strong>防御指南：</strong></p>
        <p>1. 请相关项目负责人及时关注现场风险，做好隐患排查。</p>
        <p>2. 对涉及重大风险源的项目，应及时组织复核并闭环。</p>
      </div>
    </div>
  `:`
    <div class="receiver-message-popup">
      <div class="receiver-message-title">${m.title}</div>
      <div class="receiver-message-time">更新发布于 ${m.sendTime}</div>
      <div class="receiver-message-body">
        <p>${m.content}</p>
        <p class="message-admin-muted">附件：${m.type==="通知公告"?"版本更新说明.pdf":"无"}</p>
      </div>
    </div>
  `;
  openModal("消息详情",html,`
    <button class="btn" onclick="closeModal();renderMessageCenter()">我已知晓</button>
    ${m.jumpLink?`<button class="btn primary" onclick="jumpReceiverMessage('${m.jumpLink}')">跳转</button>`:""}
  `,"large");
  renderMessageCenter();
}

function jumpReceiverMessage(link){
  closeModal();
  showToast(`已跳转到：${link}`);
}

function getTodoStatusCounts(){
  const rows=getActiveTodoData();
  return {
    all:rows.length,
    pending:rows.filter(x=>x.status==="未办理").length,
    done:rows.filter(x=>x.status==="已办理").length
  };
}

function setTodoStatus(status){
  todoCenterState.status=status;
  todoCenterState.page=1;
  renderTodoCenter();
}

function toggleTodoModuleGroup(module1){
  if(todoCenterState.module1===module1 && !todoCenterState.module2){
    todoCenterState.module1="";
    todoCenterState.module2="";
  }else{
    todoCenterState.module1=module1 || "";
    todoCenterState.module2="";
  }
  todoCenterState.page=1;
  renderTodoCenter();
}

function setTodoModule(module1,module2){
  todoCenterState.module1=module1 || "";
  todoCenterState.module2=module2 || "";
  todoCenterState.page=1;
  renderTodoCenter();
}

function setTodoOrg(org){
  todoCenterState.org=org || "";
  todoCenterState.page=1;
  renderTodoCenter();
}

function toggleTodoOrgAggregate(){
  todoCenterState.orgAggregate=document.getElementById("todoOrgAggregate")?.checked || false;
  if(!todoCenterState.orgAggregate)todoCenterState.org="";
  todoCenterState.page=1;
  renderTodoCenter();
}

function searchTodoByInput(){
  todoCenterState.search=document.getElementById("todoSearchInput")?.value.trim() || "";
  todoCenterState.page=1;
  renderTodoCenter();
}

function getFilteredTodos(){
  let list=[...getActiveTodoData()];

  if(todoCenterState.status==="未办理")list=list.filter(x=>x.status==="未办理");
  if(todoCenterState.status==="已办理")list=list.filter(x=>x.status==="已办理");
  if(todoCenterState.module1)list=list.filter(x=>x.module1===todoCenterState.module1);
  if(todoCenterState.module2)list=list.filter(x=>x.module2===todoCenterState.module2);

  if(todoCenterState.search){
    const kw=todoCenterState.search;
    list=list.filter(x=>x.title.includes(kw)||x.content.includes(kw)||x.sourceNo.includes(kw));
  }

  return list.sort((a,b)=>{
    if(todoCenterState.status==="全部"&&a.status!==b.status){
      return a.status==="未办理"?-1:1;
    }
    return new Date(b.sendTime)-new Date(a.sendTime);
  });
}

function getTodoPageData(){
  const all=getFilteredTodos();
  const total=all.length;
  const pageSize=todoCenterState.pageSize;
  const pageCount=Math.max(1,Math.ceil(total/pageSize));
  todoCenterState.page=Math.min(todoCenterState.page,pageCount);
  const start=(todoCenterState.page-1)*pageSize;
  return {total,pageCount,list:all.slice(start,start+pageSize)};
}

function getTodoModuleCount(module1,module2){
  return getActiveTodoData().filter(x=>x.module1===module1 && x.module2===module2).length;
}

function renderTodoToolbar(){
  const c=getTodoStatusCounts();
  return `
    <div class="todo-toolbar">
      <div class="message-status-tabs todo-status-tabs center-top-status-switch">
        <button type="button" class="center-status-option ${todoCenterState.status==="全部"?"active":""}" onclick="setTodoStatus('全部')"><span>全部</span><em class="center-status-badge blue">${c.all}</em></button>
        <button type="button" class="center-status-option ${todoCenterState.status==="未办理"?"active":""}" onclick="setTodoStatus('未办理')"><span>未办理</span><em class="center-status-badge red">${c.pending}</em></button>
        <button type="button" class="center-status-option ${todoCenterState.status==="已办理"?"active":""}" onclick="setTodoStatus('已办理')"><span>已办理</span><em class="center-status-badge blue">${c.done}</em></button>
      </div>
      <div class="message-actions">
        <div class="message-search-box">
          <input id="todoSearchInput" value="${todoCenterState.search}" onkeydown="if(event.key==='Enter')searchTodoByInput()" onchange="searchTodoByInput()" placeholder="输入待办内容搜索"/>
          <span onclick="searchTodoByInput()">⌕</span>
        </div>
      </div>
    </div>
  `;
}

function renderTodoModuleFilter(){
  return `
    <div class="message-module-filter">
      <div class="message-module-scroll">
        ${getActiveMessageModuleGroups().map(g=>{
          const groupCount=getActiveTodoData().filter(x=>x.module1===g.name).length;
          const groupActive=todoCenterState.module1===g.name && !todoCenterState.module2;
          return `
            <div class="message-module-row">
              <strong class="${groupActive?"active":""}" onclick="toggleTodoModuleGroup('${g.name}')">${g.name}（${groupCount}）</strong>
              ${g.children.map(c=>{
                const count=getTodoModuleCount(g.name,c.name);
                return `<span class="${todoCenterState.module1===g.name&&todoCenterState.module2===c.name?"active":""}" onclick="setTodoModule('${g.name}','${c.name}')">${c.name}（${count}）</span>`;
              }).join("")}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function getTodoOrgCount(org){
  const names=getActiveMessageOrgScopeNames(org);
  return getActiveTodoData().filter(x=>names.includes(x.org)).length;
}

function renderTodoOrgTree(){
  if(!todoCenterState.orgAggregate)return "";
  return `
    <aside class="message-org-panel unified-org-tree-panel">
      <div class="message-org-title">组织聚合</div>
      <div class="message-org-search">
        <input value="${escapeAttr(todoCenterState.orgKeyword)}" placeholder="请输入组织名称" oninput="filterCenterOrgTree('todo',this.value)"/>
        <button type="button" title="搜索">⌕</button>
      </div>
      <div id="todoCenterOrgTreeBody">${renderCenterOrgNodes("todo")}</div>
    </aside>
  `;
}

function renderTodoCards(){
  const page=getTodoPageData();
  if(!page.list.length)return `<div class="message-empty">暂无待办</div>`;
  return page.list.map(t=>`
    <div class="message-card todo-card ${t.status==="未办理"?"unread orange":"read"}" onclick="openTodoDetail(${t.id})">
      <div class="message-card-main">
        <div class="message-card-title">
          <span class="message-card-module">${t.module2}</span>
          <strong>${t.title}</strong>
          ${t.status==="未办理"?`<span class="message-read-tag unread todo-pending-tag">未办理</span>`:""}
        </div>
        <div class="message-card-content">${t.content}</div>
      </div>
      <div class="message-card-time">${t.sendTime}</div>
    </div>
  `).join("");
}

function renderTodoPagination(){
  const page=getTodoPageData();
  const pages=Array.from({length:Math.min(5,page.pageCount)},(_,i)=>i+1);
  return `
    <div class="message-pagination">
      <span>共 ${page.total} 条</span>
      <div class="message-page-btns">
        <button onclick="setTodoPage(1)">«</button>
        <button onclick="setTodoPage(${Math.max(1,todoCenterState.page-1)})">‹</button>
        ${pages.map(p=>`<button class="${todoCenterState.page===p?"active":""}" onclick="setTodoPage(${p})">${p}</button>`).join("")}
        ${page.pageCount>5?`<span>…</span><button onclick="setTodoPage(${page.pageCount})">${page.pageCount}</button>`:""}
        <button onclick="setTodoPage(${Math.min(page.pageCount,todoCenterState.page+1)})">›</button>
        <button onclick="setTodoPage(${page.pageCount})">»</button>
        <select onchange="setTodoPageSize(this.value)">
          <option value="20" ${todoCenterState.pageSize===20?"selected":""}>20条/页</option>
          <option value="50" ${todoCenterState.pageSize===50?"selected":""}>50条/页</option>
          <option value="100" ${todoCenterState.pageSize===100?"selected":""}>100条/页</option>
        </select>
      </div>
    </div>
  `;
}

function setTodoPage(p){
  todoCenterState.page=Number(p)||1;
  renderTodoCenter();
}

function setTodoPageSize(v){
  todoCenterState.pageSize=Number(v)||50;
  todoCenterState.page=1;
  renderTodoCenter();
}

function openTodoDetail(id){
  const t=getActiveTodoData().find(x=>x.id===id);
  if(!t)return;
  openModal("待办详情",`
    <div class="receiver-message-popup todo-detail-popup">
      <div class="receiver-message-title">${t.title}</div>
      <div class="receiver-message-time">创建于 ${t.sendTime}</div>
      <div class="receiver-message-body">
        <p>${t.content}</p>
        <p class="message-admin-muted">待办编号：${t.sourceNo}</p>
        <p class="message-admin-muted">截止时间：${t.deadline}</p>
        <p class="message-admin-muted">办理状态：${t.status}</p>
      </div>
    </div>
  `,`
    <button class="btn" onclick="closeModal();renderTodoCenter()">关闭</button>
    ${t.jumpLink?`<button class="btn" onclick="jumpTodo('${t.jumpLink}')">跳转</button>`:""}
    ${t.status==="未办理"?`<button class="btn primary" onclick="finishTodo(${t.id})">办理完成</button>`:""}
  `,"large");
}

function jumpTodo(link){
  closeModal();
  showToast(`已跳转到：${link}`);
}

function finishTodo(id){
  const t=getActiveTodoData().find(x=>x.id===id);
  if(!t)return;
  t.status="已办理";
  closeModal();
  showToast("待办已办理");
  renderTodoCenter();
}

function setApprovalCenterTab(tab){
  approvalCenterState.tab=tab;
  approvalCenterState.category="";
  approvalCenterState.page=1;
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function searchApprovalCenter(){
  approvalCenterState.search=document.getElementById("approvalCenterSearch")?.value.trim()||"";
  approvalCenterState.page=1;
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function searchApprovalCategory(){
  approvalCenterState.categorySearch=document.getElementById("approvalCategorySearch")?.value.trim()||"";
  approvalCenterState.page=1;
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function selectApprovalCategory(category=""){
  approvalCenterState.category=approvalCenterState.category===category?"":category;
  approvalCenterState.page=1;
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function toggleApprovalCategoryGroup(group){
  if(approvalCenterState.openGroups.has(group))approvalCenterState.openGroups.delete(group);
  else approvalCenterState.openGroups.add(group);
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function selectApprovalCategoryGroup(group){
  approvalCenterState.category=approvalCenterState.category===group?"":group;
  approvalCenterState.openGroups.add(group);
  approvalCenterState.page=1;
  window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();
}

function getApprovalCenterRows(){
  const state=approvalCenterState;
  const selectedGroup=approvalCategoryGroups.find(group=>group.name===state.category);
  const rows=approvalCenterData.filter(row=>{
    if(!row.tabs.includes(state.tab))return false;
    if(selectedGroup&&!selectedGroup.children.includes(row.category))return false;
    if(state.category&&!selectedGroup&&row.category!==state.category)return false;
    if(state.search&&!`${row.content}${row.initiator}${row.approver}${row.scope}${row.name}${row.category}${row.status}`.toLowerCase().includes(state.search.toLowerCase()))return false;
    return true;
  });
  const direction=state.sortDir==="asc"?1:-1;
  return rows.sort((a,b)=>String(a[state.sortKey]??"").localeCompare(String(b[state.sortKey]??""),"zh-CN",{numeric:true})*direction);
}

function getApprovalCenterPageData(){
  const rows=getApprovalCenterRows();
  const pageCount=Math.max(1,Math.ceil(rows.length/approvalCenterState.pageSize));
  approvalCenterState.page=Math.min(approvalCenterState.page,pageCount);
  const start=(approvalCenterState.page-1)*approvalCenterState.pageSize;
  return {total:rows.length,pageCount,list:rows.slice(start,start+approvalCenterState.pageSize)};
}

function renderApprovalCenterTabs(){
  return `<div class="approval-center-tabs center-top-status-switch">${["待我审批","我发起的","已办审批","抄送我的"].map(tab=>{
    const count=approvalCenterData.filter(row=>row.tabs.includes(tab)).length;
    return `<button type="button" class="center-status-option ${approvalCenterState.tab===tab?"active":""}" onclick="setApprovalCenterTab('${tab}')"><span>${tab}</span><em class="center-status-badge ${tab==="待我审批"?"red":"blue"}">${count}</em></button>`;
  }).join("")}</div>`;
}

function renderApprovalCategoryTree(){
  const keyword=approvalCenterState.categorySearch.toLowerCase();
  const tabRows=approvalCenterData.filter(row=>row.tabs.includes(approvalCenterState.tab));
  const groups=approvalCategoryGroups.map(group=>({
    ...group,
    children:group.children.filter(child=>tabRows.some(row=>row.category===child)&&(!keyword||group.name.toLowerCase().includes(keyword)||child.toLowerCase().includes(keyword)))
  })).filter(group=>group.children.length);
  return `<aside class="approval-category-panel">
    <div class="approval-category-title"><strong>审批分类</strong><button type="button" title="刷新" onclick="approvalCenterState.category='';approvalCenterState.categorySearch='';renderApprovalCenter()">↻</button></div>
    <div class="approval-category-search"><input id="approvalCategorySearch" value="${escapeAttr(approvalCenterState.categorySearch)}" placeholder="搜索" onkeydown="if(event.key==='Enter')searchApprovalCategory()"/><button type="button" onclick="searchApprovalCategory()">⌕</button></div>
    <button type="button" class="approval-tree-all ${approvalCenterState.category?"":"active"}" onclick="selectApprovalCategory('')"><span>全部审批</span><em>${tabRows.length}</em></button>
    <div class="approval-category-tree">${groups.map(group=>{
      const open=approvalCenterState.openGroups.has(group.name)||Boolean(keyword);
      const count=tabRows.filter(row=>group.children.includes(row.category)).length;
      return `<div class="approval-tree-group">
        <button type="button" class="approval-tree-group-name ${approvalCenterState.category===group.name?"active":""}" onclick="selectApprovalCategoryGroup('${group.name}')"><span><i title="${open?"收起":"展开"}" onclick="event.stopPropagation();toggleApprovalCategoryGroup('${group.name}')">${open?"▾":"▸"}</i>${group.name}</span><em>${count}</em></button>
        ${open?`<div class="approval-tree-children">${group.children.map(child=>{
          const childCount=tabRows.filter(row=>row.category===child).length;
          return `<button type="button" class="${approvalCenterState.category===child?"active":""}" onclick="selectApprovalCategory('${child}')"><span>${child}</span><em>${childCount||""}</em></button>`;
        }).join("")}</div>`:""}
      </div>`;
    }).join("")}</div>
  </aside>`;
}

function renderApprovalStatus(status){
  const type=status==="已通过"?"green":status==="已作废"||status==="已驳回"?"red":status==="待审批"?"orange":status==="草稿"?"gray":"blue";
  return tag(status,type);
}

function renderApprovalCenterActions(row){
  if(approvalCenterState.tab==="待我审批")return `<button class="link" onclick="openApprovalCenterDetail(${row.id},'approve')">审批</button>`;
  if(approvalCenterState.tab==="我发起的"&&row.status==="草稿")return `<button class="link" onclick="openApprovalCenterDetail(${row.id},'edit')">编辑</button>`;
  if(approvalCenterState.tab==="我发起的"&&row.status==="审批中")return `<button class="link" onclick="openApprovalCenterDetail(${row.id},'view')">查看</button><button class="link danger-link" onclick="voidApprovalCenterItem(${row.id})">作废</button>`;
  return `<button class="link" onclick="openApprovalCenterDetail(${row.id},'view')">查看</button>`;
}

function toggleApprovalCenterSort(key){
  if(approvalCenterState.sortKey===key)approvalCenterState.sortDir=approvalCenterState.sortDir==="asc"?"desc":"asc";
  else{approvalCenterState.sortKey=key;approvalCenterState.sortDir="asc";}
  approvalCenterState.page=1;
  renderApprovalCenter();
}

function renderApprovalCenterHeader(column,columns){
  const sortable=column.sortable!==false&&column.key!=="operation"&&column.key!=="index";
  const active=approvalCenterState.sortKey===column.key;
  const title=sortable?`<button type="button" class="economy-table-sort ${active?"active":""}" onclick="toggleApprovalCenterSort('${column.key}')"><span>${column.title}</span><i>${active?(approvalCenterState.sortDir==="asc"?"↑":"↓"):"↕"}</i></button>`:column.title;
  return `<th class="${getTableColumnClass("approvalCenter",column,columns)}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("approvalCenter",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${title}</th>`;
}

function exportApprovalCenter(){
  const columns=getVisibleColumns("approvalCenter").filter(column=>column.key!=="operation");
  const plainValue=(row,column,index)=>column.key==="index"?index+1:row[column.key]??"";
  const csv=[columns.map(column=>column.title),...getApprovalCenterRows().map((row,index)=>columns.map(column=>plainValue(row,column,index)))]
    .map(line=>line.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download=`审批中心_${approvalCenterState.tab}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(`已导出 ${getApprovalCenterRows().length} 条审批记录`);
}

function renderApprovalCenterTable(){
  const page=getApprovalCenterPageData();
  const columns=getVisibleColumns("approvalCenter");
  return `<div class="table-card approval-center-table-card">
    <div class="card-hd approval-center-table-hd"><div class="card-title">审批列表</div><div class="actions"><button type="button" class="btn" onclick="exportApprovalCenter()">导出</button><button type="button" class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('approvalCenter','renderApprovalCenter')">⚙</button></div></div>
    <div class="table-wrap"><table style="min-width:${getTableMinWidth("approvalCenter")}px">
      <thead><tr>${columns.map(column=>renderApprovalCenterHeader(column,columns)).join("")}</tr></thead>
      <tbody>${page.list.length?page.list.map((row,index)=>`<tr>${columns.map(column=>`<td class="${getTableColumnClass("approvalCenter",column,columns)} ${column.key==="operation"?"approval-row-actions":""}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("approvalCenter",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${column.render(row,index)}</td>`).join("")}</tr>`).join(""):`<tr><td colspan="${columns.length}"><div class="message-empty">暂无审批记录</div></td></tr>`}</tbody>
    </table></div>
    ${renderApprovalCenterPagination(page)}
  </div>`;
}

function renderApprovalCenterPagination(page=getApprovalCenterPageData()){
  const pages=Array.from({length:Math.min(5,page.pageCount)},(_,index)=>index+1);
  return `<div class="message-pagination approval-pagination"><span>共 ${page.total} 条记录</span><div class="message-page-btns">
    <button onclick="setApprovalCenterPage(1)">«</button><button onclick="setApprovalCenterPage(${Math.max(1,approvalCenterState.page-1)})">‹</button>
    ${pages.map(item=>`<button class="${item===approvalCenterState.page?"active":""}" onclick="setApprovalCenterPage(${item})">${item}</button>`).join("")}
    <button onclick="setApprovalCenterPage(${Math.min(page.pageCount,approvalCenterState.page+1)})">›</button><button onclick="setApprovalCenterPage(${page.pageCount})">»</button>
    <select onchange="setApprovalCenterPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${size===approvalCenterState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>
  </div></div>`;
}

function setApprovalCenterPage(page){approvalCenterState.page=Number(page)||1;window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();}
function setApprovalCenterPageSize(size){approvalCenterState.pageSize=Number(size)||50;approvalCenterState.page=1;window.__projectWorkbenchApprovalEmbedded?renderProjectWorkspacePage():renderApprovalCenter();}

function openApprovalCenterDetail(id,mode="view"){
  const row=approvalCenterData.find(item=>item.id===Number(id));
  if(!row)return;
  const body=`<div class="approval-detail-grid">
    ${renderProjectLogReadonlyField("审批对象",row.scope)}${renderProjectLogReadonlyField("对象名称",row.name)}
    ${renderProjectLogReadonlyField("审批类型",row.category)}${renderProjectLogReadonlyField("审批发起人",row.initiator)}
    ${renderProjectLogReadonlyField("审批人",row.approver||"-")}
    ${renderProjectLogReadonlyField("审批发起时间",row.startTime)}${renderProjectLogReadonlyField("审批状态",row.status)}
    <div class="approval-detail-content"><label>审批内容</label><div>${row.content}</div></div>
  </div>`;
  const footer=mode==="approve"?`<button class="btn" onclick="closeModal()">取消</button><button class="btn danger" onclick="finishApprovalCenterItem(${row.id},'已驳回')">驳回</button><button class="btn primary" onclick="finishApprovalCenterItem(${row.id},'已通过')">通过</button>`:`<button class="btn" onclick="closeModal()">关闭</button>`;
  openModal(mode==="approve"?"审批办理":mode==="edit"?"编辑审批":"审批详情",body,footer,"large");
}

function finishApprovalCenterItem(id,status){
  const row=approvalCenterData.find(item=>item.id===Number(id));
  if(!row)return;
  row.status=status;
  row.tabs=[...new Set([...row.tabs.filter(tab=>tab!=="待我审批"),"已办审批"])];
  closeModal();refreshBottomFixedMenu();renderApprovalCenter();showToast(`审批已${status==="已通过"?"通过":"驳回"}`);
}

function voidApprovalCenterItem(id){
  const row=approvalCenterData.find(item=>item.id===Number(id));
  if(!row)return;
  row.status="已作废";renderApprovalCenter();showToast("审批已作废");
}

function openApprovalCenter(){
  document.querySelectorAll(".bottom-menu-item").forEach(item=>item.classList.remove("active"));
  document.querySelector(".bottom-menu-item.approval")?.classList.add("active");
  listPage.style.display="none";detailPage.style.display="block";detailPage.scrollTop=0;
  renderApprovalCenter();
}

function renderApprovalCenter(){
  detailPage.innerHTML=`<div class="message-page approval-center-page">
    <div class="message-hero"><div><div class="message-hero-title">审批中心</div><div class="message-hero-sub">统一处理待审批事项，集中查看我发起及已办理的审批记录</div></div><button class="message-hero-view-all" type="button" onclick="renderApprovalFlowDetailPage()">查看所有审批</button></div>
    <div class="message-page-hd approval-center-hd">${renderApprovalCenterTabs()}<div class="message-search-box approval-center-search"><input id="approvalCenterSearch" value="${escapeAttr(approvalCenterState.search)}" placeholder="输入审批内容、审批人姓名、审批对象名称搜索" title="支持搜索审批内容、审批发起人、审批人、审批对象" onkeydown="if(event.key==='Enter')searchApprovalCenter()"/><span onclick="searchApprovalCenter()">⌕</span></div></div>
    <div class="approval-center-body">${renderApprovalCategoryTree()}<main class="approval-center-main">${renderApprovalCenterTable()}</main></div>
  </div>`;
}

function openMessageCenter(){
  document.querySelectorAll(".bottom-menu-item").forEach(x=>x.classList.remove("active"));

  listPage.style.display="none";
  detailPage.style.display="block";
  detailPage.scrollTop=0;
  renderMessageCenter();
}

function openTodoCenter(){
  document.querySelectorAll(".bottom-menu-item").forEach(x=>x.classList.remove("active"));
  listPage.style.display="none";
  detailPage.style.display="block";
  detailPage.scrollTop=0;
  renderTodoCenter();
}

function renderTodoCenter(){
  const todoBadge=document.getElementById("bottomTodoPending");
  if(todoBadge)todoBadge.innerText=getTodoCount();

  detailPage.innerHTML=`
    <div class="message-page todo-page">
      <div class="message-hero">
        <div>
          <div class="message-hero-title">待办中心</div>
          <div class="message-hero-sub">统一查看待办理事项，支持状态筛选与业务模块过滤</div>
        </div><button class="message-hero-view-all" type="button" onclick="openMessageTodoReachDetailPage()">查看所有待办</button>
      </div>
      <div class="message-page-hd todo-page-hd">
        ${renderTodoToolbar()}
      </div>
      <div class="message-page-bd">
        ${renderTodoModuleFilter()}
        <div class="message-layout">
          <main class="message-list-panel">
            ${renderTodoCards()}
          </main>
        </div>
        ${renderTodoPagination()}
      </div>
    </div>
  `;
}

function renderMessageCenter(){
  const unread=getUnreadMessageCount();
  const msgBadge=document.getElementById("bottomMessageUnread");
  if(msgBadge)msgBadge.innerText=unread;

  detailPage.innerHTML=`
    <div class="message-page">
      <div class="message-hero">
        <div>
          <div class="message-hero-title">消息中心</div>
          <div class="message-hero-sub">统一查看消息通知、通知公告与预警通知，支持业务模块过滤</div>
        </div><button class="message-hero-view-all" type="button" onclick="openMessageSendDetailPage()">查看所有消息</button>
      </div>
      <div class="message-page-hd">
        ${renderMessageTypeTabs()}
        ${renderMessageTopActions()}
      </div>
      <div class="message-page-bd">
        ${renderMessageStatusTabs()}
        ${renderMessageModuleFilter()}
        <div class="message-layout">
          <main class="message-list-panel">
            ${renderMessageCards()}
          </main>
        </div>
        ${renderMessagePagination()}
      </div>
    </div>
  `;
}

ensureBottomFixedMenu();



function syncTodoAdvancedControl(){
  const type = document.getElementById("msgTplFormType")?.value;
  const show = type === "待办任务";
  const panel = document.getElementById("msgTplAdvancedControl");
  if(panel) panel.style.display = show ? "block" : "none";

  const control = document.getElementById("msgTplTimeControl")?.checked;
  const overdue = document.getElementById("msgTplOverdueNotify")?.checked;

  document.getElementById("msgTplTimeValueField").style.display = (show && control) ? "block" : "none";
  document.getElementById("msgTplOverdueNotifyField").style.display = (show && control) ? "block" : "none";

  document.getElementById("msgTplOverdueTargetTypeField").style.display = (show && control && overdue) ? "block" : "none";
  document.getElementById("msgTplOverdueTargetPicker").style.display = (show && control && overdue) ? "block" : "none";

  document.getElementById("msgTplTimeControlText").innerText = control ? "开启" : "关闭";
  document.getElementById("msgTplOverdueNotifyText").innerText = overdue ? "开启" : "关闭";
}

function validateTaskTimeInput(){
  const el = document.getElementById("msgTplTimeValue");
  if(!el) return;
  el.value = el.value.replace(/[^0-9]/g,'');
  if(el.value && parseInt(el.value,10) <= 0){
    el.value = "";
  }
}

// extend type switch
const _oldSelect = window.selectMessageTemplateType;
window.selectMessageTemplateType = function(type){
  if(_oldSelect) _oldSelect(type);
  syncTodoAdvancedControl();
};



function syncTodoOverdueTargetSelector(){
  const type=document.getElementById("msgTplOverdueTargetType")?.value || "post";
  const picker=document.getElementById("msgTplOverdueTargetPicker");
  if(!picker)return;
  picker.innerHTML=renderTodoOverdueTargetPicker(type);
  const shouldShow=type!=="all";
  picker.style.display=shouldShow?"":"none";
  setTimeout(()=>{
    refreshTemplateTreeStates("msgTplOverdueTargetValue");
    updateTemplateCheckTreeValue("msgTplOverdueTargetValue");
  },0);
}

function syncTodoAdvancedControl(){
  const type=document.getElementById("msgTplFormType")?.value;
  const show=type==="待办任务";
  const panel=document.getElementById("msgTplAdvancedControl");
  if(panel)panel.style.display=show?"block":"none";

  const control=!!document.getElementById("msgTplTimeControl")?.checked;
  const overdue=!!document.getElementById("msgTplOverdueNotify")?.checked;

  const timeField=document.getElementById("msgTplTimeValueField");
  const overdueField=document.getElementById("msgTplOverdueNotifyField");
  const targetTypeField=document.getElementById("msgTplOverdueTargetTypeField");
  const targetPicker=document.getElementById("msgTplOverdueTargetPicker");
  const timeText=document.getElementById("msgTplTimeControlText");
  const overdueText=document.getElementById("msgTplOverdueNotifyText");

  if(timeField)timeField.style.display=(show&&control)?"":"none";
  if(overdueField)overdueField.style.display=(show&&control)?"":"none";
  if(targetTypeField)targetTypeField.style.display=(show&&control&&overdue)?"":"none";
  if(targetPicker)targetPicker.style.display=(show&&control&&overdue&&document.getElementById("msgTplOverdueTargetType")?.value!=="all")?"":"none";
  if(timeText)timeText.innerText=control?"开启":"关闭";
  if(overdueText)overdueText.innerText=overdue?"开启":"关闭";

  if(show&&control&&overdue){
    syncTodoOverdueTargetSelector();
  }
}

function validateTaskTimeInput(){
  const el=document.getElementById("msgTplTimeValue");
  if(!el)return;
  el.value=String(el.value||"").replace(/[^0-9]/g,"");
  if(el.value&&parseInt(el.value,10)<=0)el.value="";
}



/* V2.2.73 final todo dialog source override */
function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <div class="mobile-message-dialog normal">
      <div class="mobile-message-dialog-head">
        <div><h2>${item.title}</h2><p>创建于 ${item.time}</p></div>
      </div>
      <div class="mobile-message-dialog-content">${item.content}</div>
      <div class="mobile-message-dialog-actions two">
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function closeMobileTodoDialogV2272(){
  document.getElementById("mobileMessageDialogLayer")?.remove();
  if(window.__mobileTodoDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || "todo";
    const notice=window.__mobileDialogReturnNotice || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setMobilePrimaryTabV2262(primary);
    if(primary==="message")setMobileNoticeTypeV2256(notice);
  }else{
    renderMobileTodoCenterV2271();
  }
}

/* V2.2.74 FINAL effective mobile mine center */
function mobileTabIconV2256(name,label,active=false){
  const actions={
    workbench:"renderMobileWorkbench()",
    mine:"renderMobileMineCenterV2274()"
  };
  return `
    <button class="${active?"active":""}" ${actions[name]?`onclick="${actions[name]}"`:""}>
      <span class="tab-svg">
        <img class="tab-img inactive" src="./src/assets/mobile-tab/${name}.svg" alt=""/>
        <img class="tab-img active-img" src="./src/assets/mobile-tab/${name}-active.svg" alt=""/>
      </span>
      <strong>${label}</strong>
    </button>
  `;
}

function renderMobileBottomTabbarV2274(active="workbench"){
  return `
    <nav class="mobile-tabbar" aria-label="底部导航">
      ${mobileTabIconV2256("workbench","工作台",active==="workbench")}
      ${mobileTabIconV2256("overview","总览",active==="overview")}
      <button class="tab-create"><span>+</span><strong>发起整改单</strong></button>
      ${mobileTabIconV2256("warning","预警",active==="warning")}
      ${mobileTabIconV2256("mine","我的",active==="mine")}
    </nav>
  `;
}

function renderMobileMineMenuItemV2274(type,title,extra){
  return `
    <button class="mobile-mine-menu-item" type="button">
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileMineCenterV2274(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-mine-page">
      <header class="mobile-top mobile-mine-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-mine-titlebar">
          <h1>个人中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-mine-scroll">
        <section class="mobile-mine-profile mobile-card">
          <div class="mobile-mine-avatar" aria-hidden="true">
            <span class="avatar-head"></span>
            <span class="avatar-neck"></span>
            <span class="avatar-suit left"></span>
            <span class="avatar-suit right"></span>
            <span class="avatar-shirt"></span>
            <span class="avatar-tie"></span>
          </div>
          <div class="mobile-mine-user">
            <div class="mobile-mine-name-row">
              <strong>王力群</strong>
              <span>经济审批专员</span>
            </div>
            <p>城市环境/环境建设公司</p>
          </div>
        </section>
        <section class="mobile-mine-menu mobile-card">
          ${renderMobileMineMenuItemV2274("version","版本记录",`<span class="mobile-mine-current">当前</span><em>1.12.8正式版</em>`)}
          ${renderMobileMineMenuItemV2274("manual","操作手册","")}
          ${renderMobileMineMenuItemV2274("feedback","意见反馈","")}
          ${renderMobileMineMenuItemV2274("setting","设置","")}
        </section>
      </main>
      ${renderMobileBottomTabbarV2274("mine")}
    </div>
  `;
}

/* V2.2.74 mobile mine center */
function mobileTabIconV2256(name,label,active=false){
  const actions={
    workbench:"renderMobileWorkbench()",
    mine:"renderMobileMineCenterV2274()"
  };
  return `
    <button class="${active?"active":""}" ${actions[name]?`onclick="${actions[name]}"`:""}>
      <span class="tab-svg">
        <img class="tab-img inactive" src="./src/assets/mobile-tab/${name}.svg" alt=""/>
        <img class="tab-img active-img" src="./src/assets/mobile-tab/${name}-active.svg" alt=""/>
      </span>
      <strong>${label}</strong>
    </button>
  `;
}

function renderMobileBottomTabbarV2274(active="workbench"){
  return `
    <nav class="mobile-tabbar" aria-label="底部导航">
      ${mobileTabIconV2256("workbench","工作台",active==="workbench")}
      ${mobileTabIconV2256("overview","总览",active==="overview")}
      <button class="tab-create"><span>+</span><strong>发起整改单</strong></button>
      ${mobileTabIconV2256("warning","预警",active==="warning")}
      ${mobileTabIconV2256("mine","我的",active==="mine")}
    </nav>
  `;
}

function renderMobileMineCenterV2274(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-mine-page">
      <header class="mobile-top mobile-mine-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-mine-titlebar">
          <h1>个人中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-mine-scroll">
        <section class="mobile-mine-profile mobile-card">
          <div class="mobile-mine-avatar" aria-hidden="true">
            <span class="avatar-head"></span>
            <span class="avatar-neck"></span>
            <span class="avatar-suit left"></span>
            <span class="avatar-suit right"></span>
            <span class="avatar-shirt"></span>
            <span class="avatar-tie"></span>
          </div>
          <div class="mobile-mine-user">
            <div class="mobile-mine-name-row">
              <strong>王力群</strong>
              <span>经济审批专员</span>
            </div>
            <p>城市环境/环境建设公司</p>
          </div>
        </section>
        <section class="mobile-mine-menu mobile-card">
          ${renderMobileMineMenuItemV2274("version","版本记录",`<span class="mobile-mine-current">当前</span><em>1.12.8正式版</em>`)}
          ${renderMobileMineMenuItemV2274("manual","操作手册","")}
          ${renderMobileMineMenuItemV2274("feedback","意见反馈","")}
          ${renderMobileMineMenuItemV2274("setting","设置","")}
        </section>
      </main>
      ${renderMobileBottomTabbarV2274("mine")}
    </div>
  `;
}

function renderMobileMineMenuItemV2274(type,title,extra){
  return `
    <button class="mobile-mine-menu-item" type="button">
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

(function(){
  const origin=window.selectMessageTemplateType;
  window.selectMessageTemplateType=function(type){
    if(typeof origin==="function")origin(type);
    syncTodoAdvancedControl();
  };
})();

/* V2.2.73 FINAL effective todo dialog source override */
function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <div class="mobile-message-dialog normal">
      <div class="mobile-message-dialog-head">
        <div><h2>${item.title}</h2><p>创建于 ${item.time}</p></div>
      </div>
      <div class="mobile-message-dialog-content">${item.content}</div>
      <div class="mobile-message-dialog-actions two">
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function closeMobileTodoDialogV2272(){
  document.getElementById("mobileMessageDialogLayer")?.remove();
  if(window.__mobileTodoDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || "todo";
    const notice=window.__mobileDialogReturnNotice || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setMobilePrimaryTabV2262(primary);
    if(primary==="message")setMobileNoticeTypeV2256(notice);
  }else{
    renderMobileTodoCenterV2271();
  }
}




function enforceTodoAdvancedLayout(){
  const combo=document.querySelector("#msgTplTimeValueField .trigger-time-combo");
  if(combo){
    combo.classList.add("todo-time-combo");
    combo.style.display="grid";
    combo.style.gridTemplateColumns="75% 25%";
    combo.style.gap="8px";
    combo.style.width="100%";
  }
  const number=document.getElementById("msgTplTimeValue");
  const unit=document.getElementById("msgTplTimeUnit");
  if(number){
    number.classList.add("todo-time-number");
    number.style.width="100%";
    number.style.minWidth="0";
  }
  if(unit){
    unit.classList.add("todo-time-unit");
    unit.style.width="100%";
    unit.style.minWidth="0";
  }
  const notify=document.getElementById("msgTplOverdueNotifyField");
  const type=document.getElementById("msgTplOverdueTargetTypeField");
  const picker=document.getElementById("msgTplOverdueTargetPicker");
  if(notify){notify.style.gridRow="2";notify.style.gridColumn="1";}
  if(type){type.style.gridRow="2";type.style.gridColumn="2";}
  if(picker){picker.style.gridRow="2";picker.style.gridColumn="3 / span 2";}
}
(function(){
  const oldSync=window.syncTodoAdvancedControl;
  window.syncTodoAdvancedControl=function(){
    if(typeof oldSync==="function")oldSync();
    enforceTodoAdvancedLayout();
  };
  const oldTarget=window.syncTodoOverdueTargetSelector;
  window.syncTodoOverdueTargetSelector=function(){
    if(typeof oldTarget==="function")oldTarget();
    enforceTodoAdvancedLayout();
  };
})();




function getReceiverObjectLabel(type){
  switch(type){
    case "post": return "选择岗位";
    case "org": return "选择组织";
    case "person": return "选择人员";
    case "dynamic": return "选择动态参数";
    default: return "";
  }
}




const receiverDataset = {
  enterprise:{
    post:["安全总监","生产总监","经济主管"],
    org:["上海隧道","市政集团","上海路桥"],
    person:["张主管","李主管","王领导","金领导"],
    dynamic:["{%业务操作人直属领导}","{%RECTIFY_OWNER%}","业务接口传入"]
  },
  project:{
    post:["项目经理","安全员","质量员","机械员","项目副经理","生产副经理","经济副经理"],
    org:["XXX项目A","XXX项目B"],
    person:["张工","李工","王工","金工"],
    dynamic:["{%业务操作人}","{%RECTIFY_OWNER%}","业务接口传入"]
  }
};

function getReceiverOptions(level,type){
  const ds = receiverDataset[level || "enterprise"];
  return ds[type] || [];
}

function syncReceiverLevel(){
  const level=document.getElementById("msgTplReceiverLevel")?.value || "enterprise";
  window.__receiverLevel = level;
  if(typeof refreshReceiverUI==="function") refreshReceiverUI();
}

/* override target render */
/* advanced reuse */
window.__receiverLevel = "enterprise";

function refreshReceiverUI(){
  const t1=document.getElementById("msgTplTargetType")?.value;
  const t2=document.getElementById("msgTplOverdueTargetType")?.value;
  if(typeof syncTodoOverdueTargetSelector==="function") syncTodoOverdueTargetSelector();
}


/* V2.2.28 Receiver Engine Unified */
const ReceiverEngine = {
  dataset:{
    enterprise:{
      post:["安全总监","生产总监","经济主管"],
      org:["上海隧道","市政集团","上海路桥"],
      person:["张主管","李主管","王领导","金领导"],
      dynamic:["{%业务操作人直属领导}","{%RECTIFY_OWNER%}","业务接口传入"]
    },
    project:{
      post:["项目经理","安全员","质量员","机械员","项目副经理","生产副经理","经济副经理"],
      org:["XXX项目A","XXX项目B"],
      person:["张工","李工","王工","金工"],
      dynamic:["{%业务操作人}","{%RECTIFY_OWNER%}","业务接口传入"]
    }
  },
  level:"enterprise",
  get(type){
    return this.dataset[this.level]?.[type] || [];
  },
  label(type){
    return ({
      post:"选择岗位",
      org:"选择组织",
      person:"选择人员",
      dynamic:"选择动态参数"
    })[type] || "";
  }
};

function syncReceiverLevel(){
  const el=document.getElementById("msgTplReceiverLevel");
  if(el) ReceiverEngine.level = el.value;
  if(typeof refreshReceiverUI==="function") refreshReceiverUI();
}

function renderReceiver(type, targetVar){
  if(type==="all") return "";
  const data = ReceiverEngine.get(type);
  return `<label class="target-inner-label">${ReceiverEngine.label(type)}
    ${renderTemplateCheckTreeSelect(targetVar,
      [{label:"列表",children:data.map(x=>({label:x}))}],
      "请选择",
      data
    )}
  </label>`;
}

function renderTemplateTargetPicker(type){
  return renderReceiver(type,"msgTplTargetValue");
}

function renderTodoOverdueTargetPicker(type){
  return renderReceiver(type,"msgTplOverdueTargetValue");
}


window.__receiverLevel = window.__receiverLevel || "enterprise";

const ReceiverLevelData = {
  enterprise:{
    post:["安全总监","生产总监","经济主管"],
    org:["上海隧道","市政集团","上海路桥"],
    person:["张主管","李主管","王领导","金领导"],
    dynamic:["{%业务操作人直属领导}","{%RECTIFY_OWNER%}","业务接口传入"]
  },
  project:{
    post:["项目经理","安全员","质量员","机械员","项目副经理","生产副经理","经济副经理"],
    org:["XXX项目A","XXX项目B"],
    person:["张工","李工","王工","金工"],
    dynamic:["{%业务操作人}","{%RECTIFY_OWNER%}","业务接口传入"]
  }
};

function getRL(){
  return document.getElementById("msgTplReceiverLevel")?.value || window.__receiverLevel || "enterprise";
}

function getReceiverData(type){
  const level=getRL();
  return ReceiverLevelData[level][type] || [];
}

function labelMap(type){
  return ({post:"选择岗位",org:"选择组织",person:"选择人员",dynamic:"选择动态参数"})[type]||"";
}

function renderMessageReceiverTargetPicker(type,id){
  if(type==="all")return "";
  const data=getReceiverData(type);
  const picker=type==="org" && typeof renderMessageOrganizationTreeMultiSelect==="function"
    ?renderMessageOrganizationTreeMultiSelect(id,[])
    :type==="post" && typeof renderMessageRouteMultiSelect==="function"
      ?renderMessageRouteMultiSelect(id,data,[])
      :type==="person" && typeof renderMessagePersonPicker==="function"
        ?renderMessagePersonPicker(id,[])
      :type==="dynamic" && typeof renderMessageRouteSingleSelect==="function"
        ?renderMessageRouteSingleSelect(id,data,{ariaLabel:labelMap(type)})
      :renderTemplateCheckTreeSelect(id,[{label:"列表",children:data.map(x=>({label:x}))}],"请选择",data);
  return `<label class="target-inner-label">${labelMap(type)}${picker}</label>`;
}

function renderTemplateTargetPicker(type){
  return renderMessageReceiverTargetPicker(type,"msgTplTargetValue");
}

function renderTodoOverdueTargetPicker(type){
  return renderMessageReceiverTargetPicker(type,"msgTplOverdueTargetValue");
}

function syncReceiverLevel(){
  const el=document.getElementById("msgTplReceiverLevel");
  if(el) window.__receiverLevel=el.value;

  // clear values safely
  try{
    if(typeof refreshTemplateCheckTreeValue==="function"){
      refreshTemplateCheckTreeValue("msgTplTargetValue");
      refreshTemplateCheckTreeValue("msgTplOverdueTargetValue");
    }
  }catch(e){}
}


/* V2.2.35-RECOVERY popup style lock (safe) */
function initTemplatePopupStyleLock(){
  const type=document.getElementById("msgTplFormType");
  const sel=document.querySelector("#msgTplPopupStyleWrap select");
  if(!type || !sel) return;

  const map={
    "消息通知":"普通样式",
    "预警通知":"预警样式",
    "待办任务":"待办样式"
  };

  function apply(){
    const v=type.value;
    if(map[v]){
      sel.value=map[v];
      sel.disabled=true;
    }else{
      sel.disabled=false;
    }
  }

  type.addEventListener("change",apply);
  apply();
}

setTimeout(initTemplatePopupStyleLock,0);



/* V2.2.36 popup lock SAFE */
function initTemplatePopupStyleLock(){
  const type=document.getElementById("msgTplFormType");
  const sel=document.querySelector("#msgTplPopupStyleWrap select");
  if(!type || !sel) return;

  const map={
    "消息通知":"普通样式",
    "预警通知":"预警样式",
    "待办任务":"待办样式"
  };

  const apply=()=>{
    const v=type.value;
    if(map[v]){
      sel.value=map[v];
      sel.disabled=true;
    }else{
      sel.disabled=false;
    }
  };

  type.addEventListener("change",apply);
  apply();
}
setTimeout(initTemplatePopupStyleLock,0);



/* V2.2.36 safe enhancement wrapper */
(function(){
  const old = window.syncTodoAdvancedControl;
  window.syncTodoAdvancedControl = function(){
    if(typeof old === "function") old();

    try{
      const type = document.getElementById("msgTplFormType")?.value;
      if(type !== "待办任务") return;

      const over = document.getElementById("msgTplOverdueNotify")?.checked;

      const rType = document.getElementById("msgTplOverdueTargetTypeField");
      const picker = document.getElementById("msgTplOverdueTargetPicker");

      // enforce route-like sequence only when enabled
      if(over){
        if(rType) rType.style.display="";
        if(picker) picker.style.display="";
      }else{
        if(rType) rType.style.display="none";
        if(picker) picker.style.display="none";
      }
    }catch(e){}
  };
})();



function syncTemplatePopupStyleLock(){
  const type=document.getElementById("msgTplFormType");
  const sel=document.querySelector("#msgTplPopupStyleWrap select");
  if(!type || !sel) return;

  const map={
    "消息通知":"普通样式",
    "预警通知":"预警样式",
    "待办任务":"待办样式"
  };

  const v = type.value;
  if(map[v]){
    sel.value = map[v];
    sel.disabled = true;
  }else{
    sel.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  try{ syncTemplatePopupStyleLock(); }catch(e){}
});



/* V2.2.38 SAFE STRUCTURE LAYER */

function $(id){
  return document.getElementById(id);
}

function safeBind(el, event, fn){
  if(!el) return;
  el.addEventListener(event, function(e){
    try{ fn(e); }catch(err){ console.warn("safeBind error", err); }
  });
}

function initApp(){
  const formType = $("msgTplFormType");
  const level = $("msgTplReceiverLevel");
  const overdue = $("msgTplOverdueNotify");
  const typeSel = $("msgTplTargetType");
  const overTypeSel = $("msgTplOverdueTargetType");

  safeBind(formType,"change",()=>{
    if(typeof syncTemplatePopupStyleLock==="function") syncTemplatePopupStyleLock();
    if(typeof syncTodoAdvancedControl==="function") syncTodoAdvancedControl();
  });

  safeBind(level,"change",()=>{
    if(typeof syncReceiverLevel==="function") syncReceiverLevel();
  });

  safeBind(overdue,"change",()=>{
    if(typeof syncTodoAdvancedControl==="function") syncTodoAdvancedControl();
  });

  safeBind(typeSel,"change",()=>{
    if(typeof renderAllReceiverPickers==="function") renderAllReceiverPickers();
  });

  safeBind(overTypeSel,"change",()=>{
    if(typeof syncTodoOverdueTargetSelector==="function") syncTodoOverdueTargetSelector();
  });
}

document.addEventListener("DOMContentLoaded",initApp);



function syncTemplatePopupStyleLock(){
  const type=document.getElementById("msgTplFormType");
  const sel=document.getElementById("msgTplPopupStyle") || document.querySelector("#msgTplPopupStyleWrap select");
  if(!type || !sel) return;

  const map={
    "消息通知":"普通样式",
    "预警通知":"预警样式",
    "待办任务":"待办样式",
    "待办通知":"待办样式"
  };

  const v=type.value;
  if(map[v]){
    sel.value=map[v];
    sel.disabled=true;
    sel.classList.add("locked-select");
    sel.title="弹框样式由消息类型自动锁定";
  }else{
    sel.disabled=false;
    sel.classList.remove("locked-select");
    sel.removeAttribute("title");
  }
}

/* V2.2.39 template route lock and todo overdue receiver route */
function isTodoTemplateType(type){
  return type==="待办任务" || type==="待办通知";
}

function isTodoOverdueRouteEnabled(){
  const type=document.getElementById("msgTplFormType")?.value;
  const control=!!document.getElementById("msgTplTimeControl")?.checked;
  const overdue=!!document.getElementById("msgTplOverdueNotify")?.checked;
  return isTodoTemplateType(type) && control && overdue;
}

function getReceiverDataByLevel(level,type){
  const data=ReceiverLevelData?.[level || "enterprise"] || ReceiverLevelData?.enterprise || {};
  return data[type] || [];
}

function getOverdueReceiverLevel(){
  return document.getElementById("msgTplOverdueReceiverLevel")?.value || window.__overdueReceiverLevel || getRL();
}

function renderTodoOverdueTargetPicker(type){
  if(type==="all") return "";
  const data=getReceiverDataByLevel(getOverdueReceiverLevel(),type);
  const picker=type==="org" && typeof renderMessageOrganizationTreeMultiSelect==="function"
    ?renderMessageOrganizationTreeMultiSelect("msgTplOverdueTargetValue",[])
    :type==="post" && typeof renderMessageRouteMultiSelect==="function"
      ?renderMessageRouteMultiSelect("msgTplOverdueTargetValue",data,[])
      :type==="person" && typeof renderMessagePersonPicker==="function"
        ?renderMessagePersonPicker("msgTplOverdueTargetValue",[])
      :type==="dynamic" && typeof renderMessageRouteSingleSelect==="function"
        ?renderMessageRouteSingleSelect("msgTplOverdueTargetValue",data,{ariaLabel:labelMap(type)})
      :renderTemplateCheckTreeSelect("msgTplOverdueTargetValue",[{label:"列表",children:data.map(x=>({label:x}))}],"请选择",data);
  return `<label class="target-inner-label">${labelMap(type)}${picker}</label>`;
}

function syncTemplatePopupStyleLock(){
  const type=document.getElementById("msgTplFormType");
  const sel=document.getElementById("msgTplPopupStyle") || document.querySelector("#msgTplPopupStyleWrap select");
  if(!type || !sel) return;
  const map={
    "消息通知":"普通样式",
    "预警通知":"预警样式",
    "待办任务":"待办样式",
    "待办通知":"待办样式"
  };
  const value=map[type.value];
  if(value){
    sel.value=value;
    sel.disabled=true;
    sel.classList.add("locked-select");
    sel.title="弹框样式由消息类型自动锁定";
  }else{
    sel.disabled=false;
    sel.classList.remove("locked-select");
    sel.removeAttribute("title");
  }
}

function syncTodoOverdueReceiverLevel(){
  const level=document.getElementById("msgTplOverdueReceiverLevel")?.value;
  if(level) window.__overdueReceiverLevel=level;
  syncTodoOverdueTargetSelector();
}

function syncTodoOverdueTargetSelector(){
  const type=document.getElementById("msgTplOverdueTargetType")?.value || "post";
  const picker=document.getElementById("msgTplOverdueTargetPicker");
  if(!picker)return;
  const enabled=isTodoOverdueRouteEnabled();
  if(!enabled || type==="all"){
    picker.style.display="none";
    picker.innerHTML="";
    return;
  }
  picker.innerHTML=renderTodoOverdueTargetPicker(type);
  picker.style.display="";
  setTimeout(()=>{
    try{
      refreshTemplateTreeStates("msgTplOverdueTargetValue");
      updateTemplateCheckTreeValue("msgTplOverdueTargetValue");
    }catch(e){}
  },0);
}

function syncTodoAdvancedControl(){
  const type=document.getElementById("msgTplFormType")?.value;
  const show=isTodoTemplateType(type);
  const panel=document.getElementById("msgTplAdvancedControl");
  if(panel)panel.style.display=show?"block":"none";

  const control=!!document.getElementById("msgTplTimeControl")?.checked;
  const overdue=!!document.getElementById("msgTplOverdueNotify")?.checked;
  const routeEnabled=show && control && overdue;

  const timeField=document.getElementById("msgTplTimeValueField");
  const overdueField=document.getElementById("msgTplOverdueNotifyField");
  const levelField=document.getElementById("msgTplOverdueReceiverLevelField");
  const targetTypeField=document.getElementById("msgTplOverdueTargetTypeField");
  const targetPicker=document.getElementById("msgTplOverdueTargetPicker");
  const timeText=document.getElementById("msgTplTimeControlText");
  const overdueText=document.getElementById("msgTplOverdueNotifyText");

  if(timeField)timeField.style.display=(show&&control)?"":"none";
  if(overdueField)overdueField.style.display=(show&&control)?"":"none";
  if(levelField)levelField.style.display=routeEnabled?"":"none";
  if(targetTypeField)targetTypeField.style.display=routeEnabled?"":"none";
  if(targetPicker)targetPicker.style.display=(routeEnabled && document.getElementById("msgTplOverdueTargetType")?.value!=="all")?"":"none";
  if(timeText)timeText.innerText=control?"开启":"关闭";
  if(overdueText)overdueText.innerText=overdue?"开启":"关闭";

  enforceTodoAdvancedLayout();
  syncTemplatePopupStyleLock();
  if(routeEnabled) syncTodoOverdueTargetSelector();
}

function enforceTodoAdvancedLayout(){
  const combo=document.querySelector("#msgTplTimeValueField .trigger-time-combo");
  if(combo){
    combo.classList.add("todo-time-combo");
    combo.style.display="grid";
    combo.style.gridTemplateColumns="75% 25%";
    combo.style.gap="8px";
    combo.style.width="100%";
  }
  const notify=document.getElementById("msgTplOverdueNotifyField");
  const level=document.getElementById("msgTplOverdueReceiverLevelField");
  const type=document.getElementById("msgTplOverdueTargetTypeField");
  const picker=document.getElementById("msgTplOverdueTargetPicker");
  if(notify){notify.style.gridRow="2";notify.style.gridColumn="1";}
  if(level){level.style.gridRow="2";level.style.gridColumn="2";}
  if(type){type.style.gridRow="2";type.style.gridColumn="3";}
  if(picker){picker.style.gridRow="2";picker.style.gridColumn="4";}
}

function syncReceiverLevel(){
  const el=document.getElementById("msgTplReceiverLevel");
  if(el) window.__receiverLevel=el.value;
  syncTemplateTargetSelector();
  try{
    refreshTemplateTreeStates("msgTplTargetValue");
    updateTemplateCheckTreeValue("msgTplTargetValue");
  }catch(e){}
}

(function(){
  const origin=window.selectMessageTemplateType;
  window.selectMessageTemplateType=function(type){
    if(typeof origin==="function")origin(type);
    syncTemplatePopupStyleLock();
    syncTodoAdvancedControl();
  };
})();

