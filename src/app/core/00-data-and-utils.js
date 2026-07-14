
const APP_CODE_VERSION="EM-20260701-V2.2.274";
const APP_CODE_VERSION_NAME="产值完成率口径统一";
const APP_CODE_VERSION_TIME="2026-07-14 18:11";
const APP_CODE_VERSION_DESC="企业生产产值看板统一将产值进度及相关完成率指标命名为产值完成率。";
window.__APP_VERSION__={
  code:APP_CODE_VERSION,
  name:APP_CODE_VERSION_NAME,
  time:APP_CODE_VERSION_TIME,
  desc:APP_CODE_VERSION_DESC
};

let organizationMasterData=(window.EMMasterData?.ensure("organizations",(window.__ORGANIZATION_MASTER_DATA__ || []).map(item=>({
  code:item.code,
  name:item.name,
  level:Number(item.level),
  parentCode:item.parent_code || ""
}))) || []).map(item=>({
  code:item.code,
  name:item.name,
  level:Number(item.level),
  parentCode:item.parentCode || item.parent_code || ""
}));

function persistMasterData(entity,data){
  window.EMMasterData?.set(entity,data);
}

const organizationLevelNameMap={1:"股份",2:"子公司",3:"分公司"};
function getOrganizationLevelName(level){
  return organizationLevelNameMap[Number(level)] || "-";
}
function getOrganizationByCode(code){
  return organizationMasterData.find(item=>item.code===code);
}
function getOrganizationByName(name,level){
  return organizationMasterData.find(item=>item.name===name && (!level || item.level===level));
}
function getOrganizationRoot(){
  return organizationMasterData.find(item=>item.level===1) || {code:"G001",name:"隧道股份",level:1,parentCode:""};
}
function getOrganizationCompanies(){
  return organizationMasterData.filter(item=>item.level===2).map(item=>item.name);
}
function getOrganizationCompanyOptions(includeRoot=false){
  const root=getOrganizationRoot();
  return includeRoot?[root.name,...getOrganizationCompanies()]:getOrganizationCompanies();
}
function getOrganizationBranches(companyName){
  const company=getOrganizationByName(companyName,2);
  if(!company)return organizationMasterData.filter(item=>item.level===3).map(item=>item.name);
  return organizationMasterData.filter(item=>item.level===3 && item.parentCode===company.code).map(item=>item.name);
}
function getOrganizationBranchOptions(companyName=""){
  return companyName?getOrganizationBranches(companyName):organizationMasterData.filter(item=>item.level===3).map(item=>item.name);
}
function getOrganizationDisplayOptions(){
  return organizationMasterData.map(item=>item.name);
}
function getOrganizationPairs(limit=12){
  const pairs=[];
  getOrganizationCompanies().forEach(company=>{
    getOrganizationBranches(company).forEach(branch=>pairs.push([company,branch]));
  });
  return pairs.slice(0,limit);
}
function buildOrgTreeDataFromOrganizationMaster(){
  const nodeMap=new Map();
  organizationMasterData.forEach(item=>{
    nodeMap.set(item.code,{
      id:`org-${item.code}`,
      name:item.name,
      shortName:item.name,
      type:getOrganizationLevelName(item.level),
      level:item.level,
      areaTag:"",
      code:item.code,
      mdmCode:item.code,
      parentCode:item.parentCode,
      remark:item.level===1?"根组织，不可删除":"",
      children:[]
    });
  });
  organizationMasterData.forEach(item=>{
    const node=nodeMap.get(item.code);
    const parent=nodeMap.get(item.parentCode);
    if(parent)parent.children.push(node);
  });
  return nodeMap.get(getOrganizationRoot().code) || {
    id:"org-G001",
    name:"隧道股份",
    shortName:"隧道股份",
    type:"股份",
    level:1,
    areaTag:"",
    code:"G001",
    mdmCode:"G001",
    parentCode:"",
    remark:"根组织，不可删除",
    children:[]
  };
}

let workers=[
  {
    id:1,
    name:"张建国",
    gender:"男",
    birth:"1986-04",
    age:40,
    area:"四川省成都市",
    project:"华东智慧产业园一期",
    sub:"上海隧道",
    branch:"轨交分公司",
    type:"特种作业人员",
    unit:"四川宏安劳务有限公司",
    team:"钢筋一班",
    job:"焊工",
    status:"已进场",
    lastInOut:"2026-04-12 进场",
    lastClock:"2026-05-29 08:12",
    clockDays:43,
    contract:true,
    education:true,
    special:true,
    cert:true,
    insurance:true,
    black:false,
    phone:"138****5621",
    address:"四川省成都市武侯区建设路88号",
    inDate:"2026-04-12",
    outDate:"--",
    records:[
  {
    person:"王安全",
    time:"2026-05-20 10:30",
    result:"合格",
    remark:"证照齐全，安全帽佩戴规范"
  },
  {
    person:"陈主任",
    time:"2026-05-12 15:18",
    result:"合格",
    remark:"进场教育记录完整，现场作业符合要求"
  },
  {
    person:"赵经理",
    time:"2026-04-28 09:42",
    result:"不合格",
    remark:"焊工作业区域灭火器摆放距离偏远，已要求现场整改"
  }
],
    violations:[
      {time:"2026-05-18 14:20",content:"重大隐患/起重吊装/无司索指挥证书上岗",project:"华东智慧产业园一期",unit:"四川宏安劳务有限公司"},
      {time:"2026-04-30 09:15",content:"一般隐患/动火作业/作业点灭火器配置不足",project:"华东智慧产业园一期",unit:"四川宏安劳务有限公司"}
    ]

  },
  {
    id:2,
    name:"李明",
    gender:"男",
    birth:"1991-09",
    age:34,
    area:"河南省郑州市",
    project:"湾区金融中心项目",
    sub:"城建国际",
    branch:"新加坡分公司",
    type:"劳务工人",
    unit:"豫达建筑劳务有限公司",
    team:"木工三班",
    job:"木工",
    status:"已进场",
    lastInOut:"2026-05-01 进场",
    lastClock:"2026-05-28 18:05",
    clockDays:25,
    contract:false,
    education:true,
    special:false,
    cert:false,
    insurance:true,
    black:false,
    phone:"156****8134",
    address:"河南省郑州市中原区桐柏路16号",
    inDate:"2026-05-01",
    outDate:"--",
    records:[
      {
        person:"赵经理",
        time:"2026-05-26 09:20",
        result:"不合格",
        remark:"用工合同未上传，需限期整改"
      }
    ],
    violations:[
      {time:"2026-05-22 11:05",content:"一般隐患/临边防护/作业面临边防护缺失",project:"湾区金融中心项目",unit:"豫达建筑劳务有限公司"}
    ]
  },
  {
    id:3,
    name:"赵强",
    gender:"男",
    birth:"1982-07",
    age:43,
    area:"山东省济南市",
    project:"北方数据中心项目",
    sub:"市政集团",
    branch:"第一建筑",
    type:"特种作业人员",
    unit:"鲁建劳务有限公司",
    team:"架子工二班",
    job:"架子工",
    status:"已进场",
    lastInOut:"2026-02-18 进场",
    lastClock:"2026-05-29 07:58",
    clockDays:91,
    contract:true,
    education:false,
    special:true,
    cert:false,
    insurance:false,
    black:true,
    phone:"139****6510",
    address:"山东省济南市历下区山大路32号",
    inDate:"2026-02-18",
    outDate:"--",
    records:[
      {
        person:"陈主任",
        time:"2026-05-27 16:00",
        result:"不合格",
        remark:"资质证书未上传，保险缺失"
      }
    ],
    violations:[
      {time:"2026-05-25 08:50",content:"重大隐患/脚手架/未按方案搭设连墙件",project:"北方数据中心项目",unit:"鲁建劳务有限公司"},
      {time:"2026-05-10 16:30",content:"一般隐患/高处作业/安全带未高挂低用",project:"北方数据中心项目",unit:"鲁建劳务有限公司"}
    ]
  }
];
workers=window.EMMasterData?.ensure("workers",workers) || workers;

const supplierLedgerData=[
  {
    id:1,
    level:"股份级",
    subCompany:"隧道股份",
    name:"上海宏筑建设劳务有限公司",
    nature:"有限责任公司",
    capital:"5000万",
    legal:"张宏伟",
    contact:"李建军",
    phone:"138****6001",
    project:"城市轨道交通区间结构工程",
    mainBiz:"隧道结构、土建劳务、盾构辅助施工",
    expandBiz:"市政道路、地下空间结构、综合管廊",
    coopYears:8,
    avgOutput:12600,
    lastOutput:13800,
    outputRatio:12.5,
    staff:86,
    teams:6,
    workers:520,
    wage:"银行代发+实名制考勤联动",
    assets:"钢筋加工设备、模板支架、周转材料",
    debtRatio:48,
    nonAdminAssets:"1860万",
    loan:"流动资金贷款1200万，正常还款",
    scheduleRate:96,
    qualityRate:98,
    safety:"是",
    punished:"否",
    visa:"规范",
    settlement:"高",
    evalCount:5,
    complaint:"否"
  },
  {
    id:2,
    level:"子公司级",
    subCompany:"上海隧道",
    name:"江苏恒安建筑工程有限公司",
    nature:"民营企业",
    capital:"3000万",
    legal:"王志强",
    contact:"赵明",
    phone:"139****8120",
    project:"大型基坑围护及主体结构劳务",
    mainBiz:"基坑支护、主体结构、钢筋模板劳务",
    expandBiz:"装饰装修、机电预埋",
    coopYears:5,
    avgOutput:8600,
    lastOutput:9200,
    outputRatio:18.2,
    staff:54,
    teams:4,
    workers:360,
    wage:"总包监管专户发放",
    assets:"挖机、钢支撑、模板体系",
    debtRatio:56,
    nonAdminAssets:"980万",
    loan:"无重大融资贷款",
    scheduleRate:92,
    qualityRate:96,
    safety:"是",
    punished:"否",
    visa:"较规范",
    settlement:"中",
    evalCount:3,
    complaint:"否"
  },
  {
    id:3,
    level:"股份级",
    subCompany:"隧道股份",
    name:"安徽众联劳务服务有限公司",
    nature:"民营企业",
    capital:"1200万",
    legal:"刘正平",
    contact:"孙杰",
    phone:"150****7902",
    project:"车站主体结构及附属工程",
    mainBiz:"钢筋、木工、混凝土劳务",
    expandBiz:"临建施工、文明施工维护",
    coopYears:3,
    avgOutput:4300,
    lastOutput:5100,
    outputRatio:8.4,
    staff:31,
    teams:3,
    workers:210,
    wage:"劳务专户按月发放",
    assets:"小型机具、模板、脚手架",
    debtRatio:42,
    nonAdminAssets:"320万",
    loan:"短期经营贷款300万",
    scheduleRate:89,
    qualityRate:94,
    safety:"否",
    punished:"是",
    visa:"一般",
    settlement:"中",
    evalCount:2,
    complaint:"是"
  },
  {
    id:4,
    level:"子公司级",
    subCompany:"市政集团",
    name:"山东鲁建机电安装有限公司",
    nature:"有限责任公司",
    capital:"6000万",
    legal:"郑立新",
    contact:"高鹏",
    phone:"136****4498",
    project:"机电安装及管线综合工程",
    mainBiz:"机电安装、消防、给排水、电气预埋",
    expandBiz:"智能化、暖通、运维服务",
    coopYears:6,
    avgOutput:15200,
    lastOutput:16800,
    outputRatio:15.8,
    staff:98,
    teams:5,
    workers:430,
    wage:"企业直发+项目审核",
    assets:"套丝机、升降平台、检测仪器",
    debtRatio:39,
    nonAdminAssets:"2400万",
    loan:"银行授信2000万，使用800万",
    scheduleRate:97,
    qualityRate:99,
    safety:"是",
    punished:"否",
    visa:"规范",
    settlement:"高",
    evalCount:6,
    complaint:"否"
  }
];

const supplierScoreRecordData=[
  {
    id:1,
    year:"2026",
    supplierName:"上海宏筑建设劳务有限公司",
    category:"劳务分包",
    purchaserName:"隧道股份第一项目管理部",
    baseScore:18,
    bidScore:17,
    contractScore:36,
    activeScore:18,
    totalScore:89,
    scoreTime:"2026-05-20 14:30"
  },
  {
    id:2,
    year:"2026",
    supplierName:"江苏恒安建筑工程有限公司",
    category:"专业分包",
    purchaserName:"上海隧道采购中心",
    baseScore:16,
    bidScore:15,
    contractScore:33,
    activeScore:16,
    totalScore:80,
    scoreTime:"2026-05-18 10:12"
  },
  {
    id:3,
    year:"2026",
    supplierName:"安徽众联劳务服务有限公司",
    category:"劳务分包",
    purchaserName:"市政集团华东项目部",
    baseScore:12,
    bidScore:13,
    contractScore:25,
    activeScore:9,
    totalScore:59,
    scoreTime:"2026-04-28 09:45"
  }
];

const performanceEvaluationData=[
  {
    id:1,
    subCompany:"隧道股份",
    projectUnit:"隧道股份第一项目管理部",
    projectName:"城市轨道交通区间结构工程",
    jointManager:"上海宏筑建设劳务有限公司",
    projectManager:"张建军",
    contractPrice:12800.50,
    baseEconomicB:6.50,
    forecastEconomicA:9.20,
    beyondACompanyC:45.00,
    result:"合格",
    createTime:"2026-05-20 14:30"
  },
  {
    id:2,
    subCompany:"上海隧道",
    projectUnit:"上海隧道采购中心",
    projectName:"大型基坑围护及主体结构劳务",
    jointManager:"江苏恒安建筑工程有限公司",
    projectManager:"王明",
    contractPrice:8650.00,
    baseEconomicB:5.80,
    forecastEconomicA:7.40,
    beyondACompanyC:40.00,
    result:"合格",
    createTime:"2026-05-18 10:12"
  },
  {
    id:3,
    subCompany:"市政集团",
    projectUnit:"市政集团华东项目部",
    projectName:"车站主体结构及附属工程",
    jointManager:"安徽众联劳务服务有限公司",
    projectManager:"李强",
    contractPrice:4300.00,
    baseEconomicB:4.50,
    forecastEconomicA:4.20,
    beyondACompanyC:35.00,
    result:"待整改",
    createTime:"2026-04-28 09:45"
  },
  {
    id:4,
    subCompany:"市政集团",
    projectUnit:"市政集团采购管理部",
    projectName:"机电安装及管线综合工程",
    jointManager:"山东鲁建机电安装有限公司",
    projectManager:"赵鹏",
    contractPrice:15200.80,
    baseEconomicB:6.00,
    forecastEconomicA:8.60,
    beyondACompanyC:42.00,
    result:"优秀",
    createTime:"2026-04-25 11:20"
  }
];

const performanceOptions={
  subCompanies:getOrganizationCompanyOptions(true),
  projectUnits:["隧道股份第一项目管理部","上海隧道采购中心","市政集团华东项目部","市政集团采购管理部","上海路桥装饰项目部"],
  projects:["城市轨道交通区间结构工程","大型基坑围护及主体结构劳务","车站主体结构及附属工程","机电安装及管线综合工程","钢结构加工安装工程"],
  jointManagers:["上海宏筑建设劳务有限公司","江苏恒安建筑工程有限公司","安徽众联劳务服务有限公司","山东鲁建机电安装有限公司","福建海诚钢结构有限公司"],
  managers:["张建军","王明","李强","赵鹏","陈安全","刘质量","孙经济"]
};

const versionHistory=[
  {
    versionNo:"V1.0.5",
    versionName:"劳务工清单列设置增强版",
    generateTime:"2026-05-29 16:28",
    versionDesc:"劳务工清单表格新增列宽拖动、自定义字段显示隐藏能力。"
  },
  {
    versionNo:"EM-20260601-V1.0.8",
    versionName:"企业管理系统-完整集成基准版",
    generateTime:"2026-06-01 11:29",
    versionDesc:"完整集成安全劳务工花名册、生产供应商基础画像、供应商评分记录等能力。"
  },
  {
    versionNo:"EM-20260601-V1.0.9",
    versionName:"企业管理系统-列设置增强版",
    generateTime:"2026-06-01 13:31",
    versionDesc:"列表表格新增列设置能力，支持列宽、列展示和列排序。"
  },
  {
    versionNo:"EM-20260601-V1.0.10",
    versionName:"企业管理系统-详情分组与列设置对齐增强版",
    generateTime:"2026-06-01 15:20",
    versionDesc:"修复下拉icon居中，基础画像详情分组，评分记录去掉评分文案，列设置支持列内容对齐。"
  },
  {
    versionNo:"EM-20260601-V1.0.11",
    versionName:"企业管理系统-履约评价平台升级版",
    generateTime:"2026-06-01 16:58",
    versionDesc:"基于EM-20260601-V1.0.10，新增生产管理-供应商管理-履约评价平台，包含履约评价列表、详情、发起评价表单、项目基本信息、履约评分表和审批流程预览。"
  },
{
  versionNo:"EM-20260601-V1.0.12",
  versionName:"企业管理系统-履约评价流程增强版",
  generateTime:"2026-06-01 17:31",
  versionDesc:"基于EM-20260601-V1.0.11，履约评价发起弹窗支持全屏/退出全屏，调整审批流程节点，详情页右侧由审批流程预览升级为审批记录，并展示完整审批状态、审批人、审批结果和审批时间。"
},
{
  versionNo:"EM-20260601-V1.0.13",
 versionName:"企业管理系统-历史版本记录重建版",
  generateTime:"2026-06-02 09:44",
  versionDesc:"基于EM-20260601-V1.0.13，新增基础一级菜单，增加组织权限下的组织管理、岗位管理、角色管理；组织管理支持组织树、新增组织、删除叶子组织、同级排序、人员清单和新增人员；岗位管理支持新增、编辑、启用禁用和批量授权。"
},
  {
  versionNo:"EM-20260601-V1.0.14",
  versionName:"企业管理系统-基础组织权限管理版",
  generateTime:"2026-06-02 09:44",
  versionDesc:"基于EM-20260601-V1.0.13，新增基础一级菜单，增加组织权限下的组织管理、岗位管理、角色管理；组织管理支持组织树、新增组织、删除叶子组织、同级排序、人员清单和新增人员；岗位管理支持新增、编辑、启用禁用和批量授权。"
},
{
  versionNo:"EM-20260601-V1.0.22",
  versionName:"企业管理系统-劳务工详情增强版",
  generateTime:"2026-06-02 18:10",
  versionDesc:"基于EM-20260601-V1.0.18-WORK_HISTORY_UNIFIED，优化劳务工花名册进退场状态标签、特殊工种资质证书展示、工作履历/抽查记录弹框按钮与尺寸，以及详情页头部人员类型和岗位标签展示。"
},
{
  versionNo:APP_CODE_VERSION,
  versionName:APP_CODE_VERSION_NAME,
  generateTime:APP_CODE_VERSION_TIME,
  versionDesc:APP_CODE_VERSION_DESC
}
];

const businessMenus={
  home:{
    title:"首页",
    menus:[
      {icon:"🖼️",name:"项目相册",active:true},
      {icon:"📝",name:"施工日志",active:false}
    ]
  },
  base:{
    title:"基础",
    menus:[
      {
        icon:"🔐",
        name:"组织权限",
        open:true,
        children:[
          {name:"组织管理",active:true},
          {name:"岗位管理"},
          {name:"角色管理"}
        ]
      },
      {
        icon:"✉️",
        name:"消息管理",
        open:false,
        children:[
          {name:"消息模板"},
          {name:"发送记录"},
          {name:"消息记录"}
        ]
      }
    ]
  },
  production:{
    title:"生产管理",
    menus:[
      {icon:"📺",name:"大屏看板",active:false},
      {icon:"🏗️",name:"施工项目一览",active:false},
      {
        icon:"📅",
        name:"进度管理",
        open:false,
        children:[
          {name:"里程碑节点"},
          {name:"年度重点进度节点"},
          {name:"延期整改单"},
          {name:"重大工程项目"}
        ]
      },
      {
        icon:"⚠️",
        name:"风险管理",
        open:false,
        children:[
          {name:"风险管控清单"},
          {name:"年度风险管控清单"}
        ]
      },
      {
        icon:"📈",
        name:"产值管理",
        open:false,
        children:[
          {name:"产值预测分析报表"},
          {name:"目标设置"},
          {name:"产值申报"},
          {name:"实际产值上报"},
          {name:"完工未结算管理"},
          {name:"其他业态产值申报"}
        ]
      },
      {
        icon:"✅",
        name:"质量管理",
        open:false,
        children:[
          {name:"创奖管理"},
          {name:"巡检单整改"},
          {name:"质量事故列表"}
        ]
      },
      {
        icon:"🏭",
        name:"供应商管理",
        open:false,
        children:[
          {name:"基础画像"},
          {name:"评分记录"},
          {name:"履约评价"}
        ]
      },
      {
        icon:"🌱",
        name:"低碳管理",
        open:false,
        children:[
          {name:"建筑垃圾筹划"},
          {name:"建筑垃圾外运申报"}
        ]
      }
    ]
  },
  safety:{
    title:"安全管理",
    menus:[
      {icon:"📺",name:"大屏看板",active:false},
      {
        icon:"👷",
        name:"实名制",
        open:true,
        children:[
          {name:"劳务工花名册",active:true},
          {name:"管理人员白名单"},
          {name:"管理人员进出流水"},
          {name:"电子工牌"}
        ]
      },
      {
        icon:"🎥",
        name:"视频监控",
        open:false,
        children:[
          {name:"视频监控"},
          {name:"AI违规抓拍"}
        ]
      },
      {
        icon:"⚠️",
        name:"重大风险管理",
        open:false,
        children:[
          {name:"重大风险列表"}
        ]
      },
      {
        icon:"🚧",
        name:"轻微事故",
        open:false,
        children:[
          {name:"轻微事故列表"}
        ]
      },
      {
        icon:"📝",
        name:"安全每日监督",
        open:false,
        children:[
          {name:"安全每日监督"}
        ]
      },
      {
        icon:"📊",
        name:"安全评价",
        open:false,
        children:[
          {name:"指标管理"},
          {name:"月度评价填报"},
          {name:"评价模型"},
          {name:"评价任务管理"},
          {name:"评价结果管理"},
          {name:"源数据管理"},
          {name:"对象管理（禁）"}
        ]
      },
      {icon:"🛡️",name:"安全纳管一览",active:false}
    ]
  },
  economy:{
    title:"经济管理",
    menus:[
      {icon:"💰",name:"成本总览",active:false},
      {icon:"📑",name:"合同管理",active:false},
      {icon:"🧾",name:"结算管理",active:false},
      {icon:"📈",name:"经营分析",active:false},
      {icon:"🏦",name:"资金计划",active:false}
    ]
  },
  operation:{
    title:"产运",
    menus:[
      {
        icon:"📁",
        name:"生产项目",
        open:true,
        children:[
          {name:"生产项目报表",active:true}
        ]
      }
    ]
  }
};
const orgTypeOptions=["行政组织","区域组织"];
const areaTagOptions=["华东区域","华南区域","华北区域","西南区域","海外区域"];
const genderOptions=["男","女"];

let orgTreeData=buildOrgTreeDataFromOrganizationMaster();

let postData=[
  {
    id:"post-1",
    code:"SAFE_LEADER",
    name:"安全领导",
    level:"股份级",
    status:"启用",
    remark:"集团安全条线领导岗位"
  },
  {
    id:"post-2",
    code:"PROJECT_MANAGER",
    name:"项目经理",
    level:"子公司级",
    status:"启用",
    remark:"项目负责人"
  },
  {
    id:"post-3",
    code:"ORG_ADMIN",
    name:"组织管理员",
    level:"股份级",
    status:"启用",
    remark:"组织权限维护人员"
  }
];

let roleData=[
  {
    id:"role-1",
    code:"ROLE_ADMIN",
    name:"系统管理员",
    status:"启用",
    remark:"拥有基础配置权限"
  },
  {
    id:"role-2",
    code:"ROLE_SAFE_LEADER",
    name:"安全领导",
    status:"启用",
    remark:"安全管理权限"
  },
  {
    id:"role-3",
    code:"ROLE_USER",
    name:"普通用户",
    status:"启用",
    remark:"普通业务用户"
  }
];

let orgUserData=[
  {
    id:"user-1",
    name:"王安全",
    username:"wangsafe",
    phone:"13800000001",
    gender:"男",
    orgId:"org-G001",
    postId:"post-1",
    roleIds:["role-2"],
    status:"启用"
  },
  {
    id:"user-2",
    name:"张组织",
    username:"zhangorg",
    phone:"13800000002",
    gender:"男",
    orgId:"org-C001",
    postId:"post-3",
    roleIds:["role-1"],
    status:"启用"
  },
  {
    id:"user-3",
    name:"李项目",
    username:"lipm",
    phone:"13800000003",
    gender:"男",
    orgId:"org-D004",
    postId:"post-2",
    roleIds:["role-3"],
    status:"禁用"
  }
];
orgUserData=window.EMMasterData?.ensure("users",orgUserData) || orgUserData;

let messageTemplateData=[
  {
    id:"tpl-001",
    code:"MSG-SAFE-DAILY-001",
    type:"消息通知",
    biz:"安全>安全每日监督",
    title:"每日安全监督填报提醒",
    content:"今日共${projectCount}个项目需进行安全每日监督，剩余${unfilledCount}个项目未填报，请关注",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全员",
    jumpLink:"/pages/safety/daily-supervision",
    popup:"关闭",
    status:"启用",
    callCount:7856,
    updatedAt:"2026-06-09 09:30"
  },
  {
    id:"tpl-002",
    code:"MSG-SAFE-RECTIFY-002",
    type:"消息通知",
    biz:"安全>隐患排查",
    title:"隐患整改闭环提醒",
    content:"${projectName}存在${riskCount}项隐患超期未闭环，请及时完成整改复核",
    channel:"站内信",
    targetType:"动态参数",
    targetValue:"业务接口传入",
    jumpLink:"/pages/safety/rectify?id=${id}",
    popup:"关闭",
    status:"启用",
    callCount:555,
    updatedAt:"2026-06-08 17:18"
  },
  {
    id:"tpl-003",
    code:"MSG-NOTICE-VERSION-003",
    type:"消息通知",
    biz:"通用",
    title:"版本更新提醒",
    content:"数智施工正式发布V${versionNo}版本，详情请点击消息查看",
    channel:"站内信",
    targetType:"所有人",
    targetValue:"所有人",
    jumpLink:"",
    popup:"开启",
    status:"禁用",
    callCount:690,
    updatedAt:"2026-06-07 14:12"
  },
  {
    id:"tpl-004",
    code:"MSG-WARN-DEVICE-004",
    type:"预警通知",
    biz:"生产>设备",
    title:"履带吊限重提醒",
    content:"${projectName}的${deviceName}吊重${weight}吨，已超过预警值，请关注",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全总监",
    jumpLink:"/pages/device/warning?id=${id}",
    popup:"开启",
    status:"启用",
    callCount:43688,
    updatedAt:"2026-06-06 11:05"
  }
,
  {
    id:"tpl-005",
    code:"MSG-TODO-RECTIFY-005",
    type:"待办任务",
    biz:"安全>隐患整改",
    title:"隐患整改待办任务",
    content:"${projectName}存在${riskCount}项隐患需完成整改，请在${deadline}前闭环处理",
    channel:"站内信",
    targetType:"动态参数",
    targetValue:"{%RECTIFY_OWNER%}",
    jumpLink:"/pages/safety/rectify?id=${id}",
    popup:"开启",
    status:"启用",
    callCount:1288,
    updatedAt:"2026-06-17 10:20"
  },
  {
    id:"tpl-006",
    code:"MSG-ANNOUNCE-FILE-006",
    type:"通知公告",
    biz:"通用>制度文件",
    title:"关于加强高温天气施工安全管理的通知",
    content:"请各单位落实高温天气施工安全管理要求，合理安排作业时间，加强现场防暑降温保障。",
    channel:"站内信",
    targetType:"所有人",
    targetValue:"所有人",
    jumpLink:"",
    popup:"开启",
    status:"启用",
    callCount:326,
    updatedAt:"2026-06-17 15:40"
  }];

const messageBizDictionary=[
  {name:"项目管理",children:["项目认领","项目变更","项目创建审批"]},
  {name:"劳务管理",children:["花名册","抽查管理","进退场管理"]},
  {name:"安全管理",children:["隐患整改","违章管理","安全每日监督"]},
  {name:"设备管理",children:["视频监控","塔机管理","扬尘设备"]},
  {name:"通用",children:["版本更新","企业宣传","制度文件"]}
];

const messagePostOptions=["项目经理","安全员","安全总监","设备管理员","施工员","质量员","资料员","班组长","项目负责人"];
const messageOrgOptions=getOrganizationDisplayOptions();
const messagePersonOptions=["王安全","张项目","李项目","陈安全","赵经理","刘设备","何施工","周资料"];
const messageDynamicParamOptions=["{%PROJECT_MANAGER%}","{%OWNER_MANAGER%}","{%SUPERVISOR%}","{%SAFETY_OFFICER%}","{%RECTIFY_OWNER%}","{%CURRENT_USER%}"];
const messageMenuPageOptions=["工作台","劳务管理 / 花名册","劳务管理 / 抽查管理","安全管理 / 隐患整改","安全管理 / 违章管理","设备管理 / 视频中心","设备管理 / 塔机管理","消息中心 / 消息记录"];

let messageSendRecordData=[
  {
    id:"send-001",
    batchNo:"MS202606090001",
    source:"定时任务",
    templateId:"tpl-001",
    type:"消息通知",
    biz:"安全>安全每日监督",
    title:"每日安全监督填报提醒",
    content:"今日共247个项目需进行安全每日监督，剩余66个项目未填报，请关注",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全员",
    jumpLink:"/pages/safety/daily-supervision",
    popup:"关闭",
    shouldCount:7856,
    sentCount:7856,
    readCount:6120,
    clickCount:2186,
    failCount:0,
    status:"已发送",
    sendTime:"2026-06-09 17:00:02"
  },
  {
    id:"send-002",
    batchNo:"MS202606090002",
    source:"手动发布",
    templateId:"tpl-003",
    type:"通知公告",
    biz:"通用",
    title:"V2.8.4 安全在线全面升级",
    content:"安全在线实名制区域更新、实名制专版更新，管理更高效。",
    channel:"站内信",
    targetType:"所有人",
    targetValue:"所有人",
    jumpLink:"",
    popup:"开启",
    shouldCount:690,
    sentCount:690,
    readCount:222,
    clickCount:0,
    failCount:0,
    status:"已发送",
    sendTime:"2026-06-08 10:22:24"
  },
  {
    id:"send-003",
    batchNo:"MS202606090003",
    source:"业务接口",
    templateId:"tpl-002",
    type:"消息通知",
    biz:"安全>隐患排查",
    title:"安全纳管状态更新提醒",
    content:"大外环西段项目状态已由在建变更为停工，安全纳管状态调整为暂停纳管。",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全员",
    jumpLink:"/pages/safety/rectify?id=123",
    popup:"关闭",
    shouldCount:102,
    sentCount:96,
    readCount:23,
    clickCount:11,
    failCount:6,
    status:"部分发送",
    sendTime:"2026-06-09 08:25:11"
  },
  {
    id:"send-004",
    batchNo:"MS202606090004",
    source:"业务接口",
    templateId:"tpl-004",
    type:"预警通知",
    biz:"生产>设备",
    title:"履带吊限重提醒",
    content:"示范线项目1#履带吊吊重46吨，限重48吨，吊重比92%，已超过预警值。",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全总监",
    jumpLink:"/pages/device/warning?id=3001",
    popup:"开启",
    shouldCount:555,
    sentCount:555,
    readCount:455,
    clickCount:310,
    failCount:0,
    status:"已发送",
    sendTime:"2026-06-09 07:40:16"
  },
  {
    id:"send-005",
    batchNo:"MS202606090005",
    source:"手动发布",
    templateId:"",
    type:"通知公告",
    biz:"企业宣传",
    title:"直面问题抓整改 凝心聚力促发展",
    content:"希望各单位打通企业人员主数据，快速登记管理人员。",
    channel:"站内信",
    targetType:"指定岗位",
    targetValue:"项目经理，安全员",
    jumpLink:"",
    popup:"关闭",
    shouldCount:1080,
    sentCount:0,
    readCount:0,
    clickCount:0,
    failCount:0,
    status:"待发送",
    sendTime:""
  }
];

let messageRecordData=[
  {id:"msg-001",batchNo:"MS202606090001",receiver:"王安全",account:"wangsafe",org:"市政集团",project:"机场联络线工程",post:"安全总监",type:"消息通知",biz:"安全>安全每日监督",title:"每日安全监督填报提醒",content:"机场联络线工程今日安全每日监督未填报，请及时处理。",channel:"站内信",deliverStatus:"发送成功",readStatus:"未读",sendTime:"2026-06-09 17:00:02",readTime:"",clickStatus:"未点击",clickTime:"",failReason:""},
  {id:"msg-002",batchNo:"MS202606090001",receiver:"张项目",account:"zhangpm",org:"上海隧道",project:"大外环西段",post:"项目经理",type:"消息通知",biz:"安全>安全每日监督",title:"每日安全监督填报提醒",content:"大外环西段今日安全每日监督未填报，请及时处理。",channel:"站内信",deliverStatus:"发送成功",readStatus:"已读",sendTime:"2026-06-09 17:00:02",readTime:"2026-06-09 17:20:11",clickStatus:"已点击",clickTime:"2026-06-09 17:21:36",failReason:""},
  {id:"msg-003",batchNo:"MS202606090002",receiver:"李项目",account:"lipm",org:"上海隧道",project:"湾区金融中心项目",post:"项目经理",type:"通知公告",biz:"通用",title:"V2.8.4 安全在线全面升级",content:"安全在线实名制区域更新、实名制专版更新，管理更高效。",channel:"站内信",deliverStatus:"发送成功",readStatus:"未读",sendTime:"2026-06-08 10:22:24",readTime:"",clickStatus:"未点击",clickTime:"",failReason:""},
  {id:"msg-004",batchNo:"MS202606090003",receiver:"陈安全",account:"chensafe",org:"上海路桥",project:"上海市轨道交通23号线",post:"安全员",type:"消息通知",biz:"安全>隐患排查",title:"安全纳管状态更新提醒",content:"项目状态已由在建变更为停工，安全纳管状态调整为暂停纳管。",channel:"站内信",deliverStatus:"发送成功",readStatus:"已读",sendTime:"2026-06-09 08:25:11",readTime:"2026-06-09 09:11:03",clickStatus:"已点击",clickTime:"2026-06-09 09:12:18",failReason:""},
  {id:"msg-005",batchNo:"MS202606090003",receiver:"赵经理",account:"zhaopm",org:"上海路桥",project:"北方数据中心项目",post:"项目经理",type:"消息通知",biz:"安全>隐患排查",title:"安全纳管状态更新提醒",content:"项目状态已由在建变更为停工，安全纳管状态调整为暂停纳管。",channel:"站内信",deliverStatus:"发送失败",readStatus:"未读",sendTime:"2026-06-09 08:25:11",readTime:"",clickStatus:"未点击",clickTime:"",failReason:"账号已停用"},
  {id:"msg-006",batchNo:"MS202606090004",receiver:"刘设备",account:"liudevice",org:"市政集团",project:"示范线项目",post:"设备管理员",type:"预警通知",biz:"生产>设备",title:"履带吊限重提醒",content:"示范线项目1#履带吊吊重46吨，吊重比92%，已超过预警值。",channel:"站内信",deliverStatus:"发送成功",readStatus:"已读",sendTime:"2026-06-09 07:40:16",readTime:"2026-06-09 07:46:20",clickStatus:"已点击",clickTime:"2026-06-09 07:47:08",failReason:""}
];

const messageAdminState={
  templateType:"",
  templateBiz:"",
  templateBizList:[],
  templateStatus:"",
  templateTitle:"",
  templateContent:"",
  templateKeyword:"",
  sendType:"",
  sendBizList:[],
  sendTitle:"",
  sendContent:"",
  sendReceiver:"",
  sendOrg:"",
  sendProject:"",
  sendPost:"",
  sendStatus:"",
  sendTrigger:"",
  sendKeyword:"",
  recordType:"",
  recordBizList:[],
  recordTitle:"",
  recordContent:"",
  recordReceiver:"",
  recordOrg:"",
  recordProject:"",
  recordPost:"",
  recordDeliver:"",
  recordRead:"",
  recordClick:"",
  recordKeyword:""
};

const messageSendDrillState={
  batchNo:"",
  deliver:"",
  read:"",
  click:"",
  title:""
};

let currentOrgId="org-G001";
let currentOrgUserList=[];

let currentBusinessLine="production";
const pcPortalState={
  mode:"enterprise",
  projectLine:"home",
  currentProjectId:null,
  currentProject:"上海示范区线工程 SFQSG-15 标"
};
const enterprisePrimaryMenus=[
  {key:"home",name:"首页"},
  {key:"production",name:"生产"},
  {key:"safety",name:"安全"},
  {key:"economy",name:"经济"},
  {key:"operation",name:"产运"},
  {key:"base",name:"基础"}
];
const projectPrimaryMenus=[
  {key:"home",name:"首页"},
  {key:"production",name:"生产"},
  {key:"safety",name:"安全"},
  {key:"economy",name:"经济"}
];
const projectPortalMenus={
  home:{
    title:"首页",
    menus:[
      {icon:"📊",name:"项目总览",active:true},
      {icon:"🧭",name:"工作桌面"},
      {icon:"📁",name:"项目详情"},
      {icon:"🎯",name:"工程总体筹划"},
      {icon:"📝",name:"施工日志"}
    ]
  },
  production:{
    title:"生产",
    menus:[
      {icon:"📈",name:"进度管理",open:true,children:[{name:"总进度计划",active:true},{name:"里程碑节点"},{name:"延期整改单"}]},
      {icon:"⚠️",name:"风险管理",children:[{name:"风险管控清单"}]},
      {icon:"💰",name:"产值管理",children:[{name:"产值滚动更新"},{name:"实际产值上报"}]},
      {icon:"🏆",name:"质量管理",children:[{name:"创奖管理"},{name:"工程巡查整改"},{name:"质量事故上报"}]},
      {icon:"👷",name:"劳动力管理",children:[{name:"资源计划"},{name:"劳动力动态"}]},
      {icon:"🧪",name:"技术管理",children:[{name:"技术方案管理"}]},
      {icon:"🚨",name:"险情管理",children:[{name:"险情列表"}]},
      {icon:"🏗️",name:"设备管理",children:[{name:"设备进退场"},{name:"设备台账"}]},
      {icon:"📦",name:"材料管理",children:[{name:"材料筹划"},{name:"材料台账"},{name:"材料出入库"}]},
      {icon:"🌿",name:"低碳管理",children:[{name:"建筑垃圾筹划"},{name:"建筑垃圾外运申请"},{name:"建筑垃圾信息"}]}
    ]
  },
  safety:{title:"安全",menus:[{icon:"🛡️",name:"安全应用占位",active:true}]},
  economy:{title:"经济",menus:[{icon:"💴",name:"经济应用占位",active:true}]}
};
let currentList=[...workers];
let activeStat=null;
let supplierCurrentList=[...supplierLedgerData];
let supplierActiveStat=null;
let supplierScoreCurrentList=supplierScoreRecordData.filter(x=>x.year==="2026");
let supplierScoreActiveStat=null;
let performanceCurrentList=[...performanceEvaluationData];
function tag(text,type){
  return `<span class="tag ${type}">${text}</span>`;
}

function latestCheck(w){
  return w.records?.length?w.records[0].result:"-";
}

function info(label,value){
  return `
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${value??"-"}</div>
    </div>
  `;
}

function scoreTag(s){
  return s<60?tag(s+"分","red"):s<80?tag(s+"分","orange"):tag(s+"分","green");
}

function levelTag(v){
  return v==="股份级"?tag(v,"blue"):tag(v,"purple");
}

function yesNoTag(v){
  return v==="是"?tag("是","red"):tag("否","green");
}

function safetyTag(v){
  return v==="是"?tag("达标","green"):tag("未达标","red");
}

function settlementTag(v){
  return v==="高"?tag("高","green"):v==="中"?tag("中","orange"):tag("低","red");
}

function lastInOutTag(value){
  if(!value)return "-";
  const parts=String(value).trim().split(/\s+/);
  const action=parts.pop() || "";
  const date=parts.join(" ") || value;
  if(action==="进场"){
    return `${date} ${tag("进场","green")}`;
  }
  if(action==="退场"){
    return `${date} ${tag("退场","red")}`;
  }
  return value;
}

function boolFile(ok,name){
  return ok
    ? `<span class="link" onclick="previewFile('${name}')">📎 ${name}.pdf</span>`
    : tag("未上传","orange");
}

const tableColumnDefinitions={
  safetyEvalMonthlyCompany:[
    {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalMonthlyFillState.page.company-1)*safetyEvalMonthlyFillState.pageSize+index+1},
    {key:"company",title:"子公司",width:220,align:"left",render:row=>row.company},
    {key:"realNameOpened",title:"是否已开通",group:"实名系统开通",width:120,align:"center",render:row=>tag(row.realNameOpen.opened,row.realNameOpen.opened==="是"?"green":"red")},
    {key:"realNameOpenDays",title:"开通天数",group:"实名系统开通",width:120,align:"center",render:row=>row.realNameOpen.openDays},
    {key:"realNameOpenScore",title:"得分",group:"实名系统开通",width:100,align:"center",render:row=>row.realNameOpen.score},
    {key:"fourElementsMismatchCount",title:"四要素不一致人数",group:"实名四要素一致性",width:180,align:"center",render:row=>row.fourElements.mismatchCount},
    {key:"fourElementsScore",title:"得分",group:"实名四要素一致性",width:100,align:"center",render:row=>row.fourElements.score},
    {key:"videoSiteCameraCount",title:"施工现场摄像头数",group:"监控视频开通",width:180,align:"center",render:row=>row.videoOpen.siteCameraCount},
    {key:"videoAiCameraCount",title:"AI摄像头数",group:"监控视频开通",width:120,align:"center",render:row=>row.videoOpen.aiCameraCount},
    {key:"videoOpenScore",title:"得分",group:"监控视频开通",width:100,align:"center",render:row=>row.videoOpen.score},
    {key:"score4",title:"评价项4",width:120,align:"center",render:row=>row.scores[3]},
    {key:"insuranceWorkInjury",title:"工伤险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.workInjury,row.insurance.workInjury==="是"?"green":"red")},
    {key:"insuranceWorkInjuryDays",title:"工伤险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.workInjuryDays},
    {key:"insuranceSafetyLiability",title:"安责险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.safetyLiability,row.insurance.safetyLiability==="是"?"green":"red")},
    {key:"insuranceSafetyLiabilityDays",title:"安责险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.safetyLiabilityDays},
    {key:"insuranceAllRisk",title:"一切险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.allRisk,row.insurance.allRisk==="是"?"green":"red")},
    {key:"insuranceAllRiskDays",title:"一切险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.allRiskDays},
    {key:"insuranceScore",title:"得分",group:"保险集中管理",width:100,align:"center",render:row=>row.insurance.score},
    {key:"planningProductionDate",title:"生产立项日期",group:"项目筹划信息",width:140,align:"center",render:row=>row.planning.productionDate},
    {key:"planningPlanDays",title:"筹划天数",group:"项目筹划信息",width:110,align:"center",render:row=>row.planning.planDays},
    {key:"planningStatus",title:"筹划状态",group:"项目筹划信息",width:120,align:"center",render:row=>tag(row.planning.status,row.planning.status==="已筹划"?"green":"orange")},
    {key:"planningActualDays",title:"实际筹划天数",group:"项目筹划信息",width:130,align:"center",render:row=>row.planning.actualDays},
    {key:"planningScore",title:"得分",group:"项目筹划信息",width:100,align:"center",render:row=>row.planning.score},
    ...Array.from({length:4},(_,i)=>({key:`score${i+7}`,title:`评价项${i+7}`,width:120,align:"center",render:row=>row.scores[i+6]}))
  ],
  safetyEvalMonthlyBranch:[
    {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalMonthlyFillState.page.branch-1)*safetyEvalMonthlyFillState.pageSize+index+1},
    {key:"company",title:"子公司",width:200,align:"left",render:row=>row.company},
    {key:"branch",title:"分公司",width:180,align:"left",render:row=>row.branch},
    {key:"realNameOpened",title:"是否已开通",group:"实名系统开通",width:120,align:"center",render:row=>tag(row.realNameOpen.opened,row.realNameOpen.opened==="是"?"green":"red")},
    {key:"realNameOpenDays",title:"开通天数",group:"实名系统开通",width:120,align:"center",render:row=>row.realNameOpen.openDays},
    {key:"realNameOpenScore",title:"得分",group:"实名系统开通",width:100,align:"center",render:row=>row.realNameOpen.score},
    {key:"fourElementsMismatchCount",title:"四要素不一致人数",group:"实名四要素一致性",width:180,align:"center",render:row=>row.fourElements.mismatchCount},
    {key:"fourElementsScore",title:"得分",group:"实名四要素一致性",width:100,align:"center",render:row=>row.fourElements.score},
    {key:"videoSiteCameraCount",title:"施工现场摄像头数",group:"监控视频开通",width:180,align:"center",render:row=>row.videoOpen.siteCameraCount},
    {key:"videoAiCameraCount",title:"AI摄像头数",group:"监控视频开通",width:120,align:"center",render:row=>row.videoOpen.aiCameraCount},
    {key:"videoOpenScore",title:"得分",group:"监控视频开通",width:100,align:"center",render:row=>row.videoOpen.score},
    {key:"score4",title:"评价项4",width:120,align:"center",render:row=>row.scores[3]},
    {key:"insuranceWorkInjury",title:"工伤险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.workInjury,row.insurance.workInjury==="是"?"green":"red")},
    {key:"insuranceWorkInjuryDays",title:"工伤险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.workInjuryDays},
    {key:"insuranceSafetyLiability",title:"安责险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.safetyLiability,row.insurance.safetyLiability==="是"?"green":"red")},
    {key:"insuranceSafetyLiabilityDays",title:"安责险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.safetyLiabilityDays},
    {key:"insuranceAllRisk",title:"一切险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.allRisk,row.insurance.allRisk==="是"?"green":"red")},
    {key:"insuranceAllRiskDays",title:"一切险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.allRiskDays},
    {key:"insuranceScore",title:"得分",group:"保险集中管理",width:100,align:"center",render:row=>row.insurance.score},
    {key:"planningProductionDate",title:"生产立项日期",group:"项目筹划信息",width:140,align:"center",render:row=>row.planning.productionDate},
    {key:"planningPlanDays",title:"筹划天数",group:"项目筹划信息",width:110,align:"center",render:row=>row.planning.planDays},
    {key:"planningStatus",title:"筹划状态",group:"项目筹划信息",width:120,align:"center",render:row=>tag(row.planning.status,row.planning.status==="已筹划"?"green":"orange")},
    {key:"planningActualDays",title:"实际筹划天数",group:"项目筹划信息",width:130,align:"center",render:row=>row.planning.actualDays},
    {key:"planningScore",title:"得分",group:"项目筹划信息",width:100,align:"center",render:row=>row.planning.score},
    ...Array.from({length:4},(_,i)=>({key:`score${i+7}`,title:`评价项${i+7}`,width:120,align:"center",render:row=>row.scores[i+6]}))
  ],
  safetyEvalMonthlyProject:[
    {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(safetyEvalMonthlyFillState.page.project-1)*safetyEvalMonthlyFillState.pageSize+index+1},
    {key:"projectName",title:"项目名称",width:280,align:"left",render:row=>row.projectName},
    {key:"company",title:"子公司",width:160,align:"center",render:row=>row.company},
    {key:"branch",title:"分公司",width:160,align:"center",render:row=>row.branch},
    {key:"manager",title:"项目经理",width:120,align:"center",render:row=>row.manager},
    {key:"status",title:"项目状态",width:120,align:"center",render:row=>renderSafetyEvalMonthlyProjectStatusTag(row.status)},
    {key:"realNameOpened",title:"是否已开通",group:"实名系统开通",width:120,align:"center",render:row=>tag(row.realNameOpen.opened,row.realNameOpen.opened==="是"?"green":"red")},
    {key:"realNameOpenDays",title:"开通天数",group:"实名系统开通",width:120,align:"center",render:row=>row.realNameOpen.openDays},
    {key:"realNameOpenScore",title:"得分",group:"实名系统开通",width:100,align:"center",render:row=>row.realNameOpen.score},
    {key:"fourElementsMismatchCount",title:"四要素不一致人数",group:"实名四要素一致性",width:180,align:"center",render:row=>row.fourElements.mismatchCount},
    {key:"fourElementsScore",title:"得分",group:"实名四要素一致性",width:100,align:"center",render:row=>row.fourElements.score},
    {key:"videoSiteCameraCount",title:"施工现场摄像头数",group:"监控视频开通",width:180,align:"center",render:row=>row.videoOpen.siteCameraCount},
    {key:"videoAiCameraCount",title:"AI摄像头数",group:"监控视频开通",width:120,align:"center",render:row=>row.videoOpen.aiCameraCount},
    {key:"videoOpenScore",title:"得分",group:"监控视频开通",width:100,align:"center",render:row=>row.videoOpen.score},
    {key:"score4",title:"评价项4",width:120,align:"center",render:row=>row.scores[3]},
    {key:"insuranceWorkInjury",title:"工伤险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.workInjury,row.insurance.workInjury==="是"?"green":"red")},
    {key:"insuranceWorkInjuryDays",title:"工伤险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.workInjuryDays},
    {key:"insuranceSafetyLiability",title:"安责险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.safetyLiability,row.insurance.safetyLiability==="是"?"green":"red")},
    {key:"insuranceSafetyLiabilityDays",title:"安责险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.safetyLiabilityDays},
    {key:"insuranceAllRisk",title:"一切险",group:"保险集中管理",width:100,align:"center",render:row=>tag(row.insurance.allRisk,row.insurance.allRisk==="是"?"green":"red")},
    {key:"insuranceAllRiskDays",title:"一切险登记天数",group:"保险集中管理",width:140,align:"center",render:row=>row.insurance.allRiskDays},
    {key:"insuranceScore",title:"得分",group:"保险集中管理",width:100,align:"center",render:row=>row.insurance.score},
    {key:"planningProductionDate",title:"生产立项日期",group:"项目筹划信息",width:140,align:"center",render:row=>row.planning.productionDate},
    {key:"planningPlanDays",title:"筹划天数",group:"项目筹划信息",width:110,align:"center",render:row=>row.planning.planDays},
    {key:"planningStatus",title:"筹划状态",group:"项目筹划信息",width:120,align:"center",render:row=>tag(row.planning.status,row.planning.status==="已筹划"?"green":"orange")},
    {key:"planningActualDays",title:"实际筹划天数",group:"项目筹划信息",width:130,align:"center",render:row=>row.planning.actualDays},
    {key:"planningScore",title:"得分",group:"项目筹划信息",width:100,align:"center",render:row=>row.planning.score},
    ...Array.from({length:4},(_,i)=>({key:`score${i+7}`,title:`评价项${i+7}`,width:120,align:"center",render:row=>row.scores[i+6]}))
  ],
  worker:[
    {
      key:"index",
      title:"序号",
      width:70,
      align:"center",
      render:(w,i)=>i+1
    },
    {
      key:"name",
      title:"姓名",
      width:110,
      align:"left",
      render:w=>`<a class="link" onclick="openDetail(${w.id})">${w.name}</a>`
    },
    {
      key:"gender",
      title:"性别",
      width:80,
      align:"center",
      render:w=>w.gender
    },
    {
      key:"birth",
      title:"出生日期",
      width:120,
      align:"center",
      render:w=>w.birth,
    },
    {
      key:"age",
      title:"年龄",
      width:80,
      align:"center",
      render:w=>w.age
    },
    {
      key:"area",
      title:"省市区",
      width:150,
      align:"left",
      render:w=>w.area
    },
    {
      key:"check",
      title:"抽查结果",
      width:100,
      align:"center",
      render:w=>latestCheck(w)==="合格"?tag("合格","green"):tag("不合格","red")
    },
    {
      key:"project",
      title:"当前项目",
      width:190,
      align:"left",
      render:w=>w.project
    },
    {
      key:"sub",
      title:"子公司",
      width:120,
      align:"left",
      render:w=>w.sub||"-"
    },
    {
      key:"branch",
      title:"分公司",
      width:120,
      align:"left",
      render:w=>w.branch||"-"
    },
    {
      key:"type",
      title:"人员类型",
      width:130,
      align:"center",
      render:w=>w.type==="特种作业人员"?tag(w.type,"purple"):tag(w.type,"gray")
    },
    {
      key:"unit",
      title:"当前分包单位",
      width:210,
      align:"left",
      render:w=>w.unit
    },
    {
      key:"team",
      title:"当前班组",
      width:120,
      align:"left",
      render:w=>w.team
    },
    {
      key:"job",
      title:"岗位/工种",
      width:110,
      align:"center",
      render:w=>tag(w.job,"blue")
    },
    {
      key:"lastInOut",
      title:"最近进退场时间",
      width:150,
      align:"center",
      render:w=>lastInOutTag(w.lastInOut)
    },
    {
      key:"lastClock",
      title:"最近打卡时间",
      width:150,
      align:"center",
      render:w=>w.lastClock||"-"
    },
    {
      key:"clockDays",
      title:"打卡天数",
      width:100,
      align:"center",
      render:w=>w.clockDays||0
    },
    {
      key:"contract",
      title:"用工合同",
      width:140,
      align:"center",
      render:w=>boolFile(w.contract,"用工合同")
    },
    {
      key:"education",
      title:"进场教育",
      width:140,
      align:"center",
      render:w=>boolFile(w.education,"进场教育")
    },
    {
      key:"special",
      title:"是否特殊工种",
      width:120,
      align:"center",
      render:w=>w.special?tag("是","orange"):tag("否","gray")
    },
    {
      key:"cert",
      title:"资质证书",
      width:140,
      align:"center",
      render:w=>w.special?boolFile(w.cert,"资质证书"):tag("非必传","gray")
    },
    {
      key:"black",
      title:"是否黑名单",
      width:110,
      align:"center",
      render:w=>w.black?tag("是","red"):tag("否","green")
    },
    {
      key:"resume",
      title:"工作履历",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openWorkHistory(${w.id})">${getWorkerResumeList(w).length}条</a>`
    },
    {
      key:"violations",
      title:"违章记录",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openViolations(${w.id})">${w.violations?.length||0}条</a>`
    },
    {
      key:"records",
      title:"抽查记录",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openChecks(${w.id})">${w.records?.length||0}条</a>`
    },
    {
      key:"operation",
      title:"操作",
      width:130,
      align:"center",
      render:w=>`<a class="link" onclick="openDetail(${w.id})">详情</a> ｜ <a class="link" onclick="openWorkerEditModal(${w.id})">编辑</a> ｜ <a class="link danger-link" onclick="deleteWorker(${w.id})">删除</a>`
    }
  ],

  supplier:[
    {
      key:"index",
      title:"序号",
      width:70,
      align:"center",
      render:(s,i)=>i+1
    },
    {
      key:"level",
      title:"所属层级",
      width:110,
      align:"center",
      render:s=>levelTag(s.level)
    },
    {
      key:"subCompany",
      title:"所属子公司",
      width:130,
      align:"left",
      render:s=>s.subCompany
    },
    {
      key:"name",
      title:"分包商",
      width:240,
      align:"left",
      render:s=>`<a class="link" onclick="openSupplierDetail(${s.id})">${s.name}</a>`
    },
    {
      key:"nature",
      title:"企业性质",
      width:130,
      align:"left",
      render:s=>s.nature
    },
    {
      key:"capital",
      title:"注册资本",
      width:110,
      align:"right",
      render:s=>s.capital
    },
    {
      key:"legal",
      title:"法人代表",
      width:100,
      align:"left",
      render:s=>s.legal
    },
    {
      key:"contact",
      title:"联系人",
      width:100,
      align:"left",
      render:s=>s.contact
    },
    {
      key:"phone",
      title:"联系电话",
      width:130,
      align:"center",
      render:s=>s.phone
    },
    {
      key:"project",
      title:"主要承建分包工程名称",
      width:220,
      align:"left",
      render:s=>s.project
    },
    {
      key:"mainBiz",
      title:"承建主营业务范围",
      width:260,
      align:"left",
      render:s=>s.mainBiz
    },
    {
      key:"expandBiz",
      title:"拓展业务范围",
      width:220,
      align:"left",
      render:s=>s.expandBiz
    },
    {
      key:"coopYears",
      title:"合作时间",
      width:100,
      align:"right",
      render:s=>s.coopYears
    },
    {
      key:"avgOutput",
      title:"近三年平均年产值",
      width:150,
      align:"right",
      render:s=>s.avgOutput
    },
    {
      key:"lastOutput",
      title:"上年度产值",
      width:120,
      align:"right",
      render:s=>s.lastOutput
    },
    {
      key:"outputRatio",
      title:"产值占比",
      width:110,
      align:"right",
      render:s=>s.outputRatio+"%"
    },
    {
      key:"safety",
      title:"安全文明施工",
      width:130,
      align:"center",
      render:s=>safetyTag(s.safety)
    },
    {
      key:"punished",
      title:"是否受到处罚",
      width:130,
      align:"center",
      render:s=>yesNoTag(s.punished)
    },
    {
      key:"settlement",
      title:"结算配合度",
      width:120,
      align:"center",
      render:s=>settlementTag(s.settlement)
    },
    {
      key:"evalCount",
      title:"过往合作评价",
      width:130,
      align:"center",
      render:s=>`<a class="link" onclick="openSupplierEvaluations(${s.id})">${s.evalCount} 次</a>`
    },
    {
      key:"complaint",
      title:"是否有重大投诉",
      width:140,
      align:"center",
      render:s=>yesNoTag(s.complaint)
    }
  ],

  supplierScore:[
    {
      key:"index",
      title:"序号",
      width:70,
      align:"center",
      render:(x,i)=>i+1
    },
    {
      key:"year",
      title:"评价年份",
      width:100,
      align:"center",
      render:x=>x.year
    },
    {
      key:"supplierName",
      title:"供应商名称",
      width:240,
      align:"left",
      render:x=>x.supplierName
    },
    {
      key:"category",
      title:"供应商分类",
      width:120,
      align:"center",
      render:x=>tag(x.category,"blue")
    },
    {
      key:"purchaserName",
      title:"采购商名称",
      width:230,
      align:"left",
      render:x=>x.purchaserName
    },
    {
      key:"baseScore",
      title:"评价明细-基础资料",
      width:170,
      align:"right",
      render:x=>x.baseScore+"分"
    },
    {
      key:"bidScore",
      title:"评价明细-投标响应",
      width:170,
      align:"right",
      render:x=>x.bidScore+"分"
    },
    {
      key:"contractScore",
      title:"评价明细-合同履约",
      width:170,
      align:"right",
      render:x=>x.contractScore+"分"
    },
    {
      key:"activeScore",
      title:"评价明细-活跃度数据",
      width:170,
      align:"right",
      render:x=>x.activeScore+"分"
    },
    {
      key:"totalScore",
      title:"总分",
      width:100,
      align:"center",
      render:x=>scoreTag(x.totalScore)
    },
    {
      key:"scoreTime",
      title:"评分时间",
      width:170,
      align:"center",
      render:x=>x.scoreTime
    },
    {
      key:"resume",
      title:"工作履历",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openWorkHistory(${w.id})">${getWorkerResumeList(w).length}条</a>`
    },
    {
      key:"records",
      title:"抽查记录",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openChecks(${w.id})">${w.records?.length||0}条</a>`
    },
    {
      key:"operation",
      title:"操作",
      width:100,
      align:"center",
      render:x=>`<a class="link" onclick="openSupplierScoreDetail(${x.id})">查看</a>`
    }
  ],

  performance:[
    {
      key:"index",
      title:"序号",
      width:70,
      align:"center",
      render:(x,i)=>i+1
    },
    {
      key:"subCompany",
      title:"集团下属子公司",
      width:150,
      align:"left",
      render:x=>x.subCompany
    },
    {
      key:"projectUnit",
      title:"项目主管单位",
      width:210,
      align:"left",
      render:x=>x.projectUnit
    },
    {
      key:"projectName",
      title:"项目名称",
      width:240,
      align:"left",
      render:x=>x.projectName
    },
    {
      key:"jointManager",
      title:"项目联合管理方",
      width:230,
      align:"left",
      render:x=>x.jointManager
    },
    {
      key:"projectManager",
      title:"项目经理",
      width:120,
      align:"left",
      render:x=>x.projectManager
    },
    {
      key:"contractPrice",
      title:"合同价（万元）",
      width:140,
      align:"right",
      render:x=>Number(x.contractPrice).toFixed(2)
    },
    {
      key:"baseEconomicB",
      title:"项目保底经济指标B（%）",
      width:190,
      align:"right",
      render:x=>Number(x.baseEconomicB).toFixed(2)+"%"
    },
    {
      key:"forecastEconomicA",
      title:"预测项目经济指标A（%）",
      width:190,
      align:"right",
      render:x=>Number(x.forecastEconomicA).toFixed(2)+"%"
    },
    {
      key:"beyondACompanyC",
      title:"超A以外公司占比C（%）",
      width:190,
      align:"right",
      render:x=>Number(x.beyondACompanyC).toFixed(2)+"%"
    },
    {
      key:"result",
      title:"评价结果",
      width:120,
      align:"center",
      render:x=>x.result==="优秀"?tag("优秀","green"):x.result==="合格"?tag("合格","blue"):tag(x.result,"orange")
    },
    {
      key:"resume",
      title:"工作履历",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openWorkHistory(${w.id})">${getWorkerResumeList(w).length}条</a>`
    },
    {
      key:"records",
      title:"抽查记录",
      width:110,
      align:"center",
      render:w=>`<a class="link" onclick="openChecks(${w.id})">${w.records?.length||0}条</a>`
    },
    {
      key:"operation",
      title:"操作",
      width:100,
      align:"center",
      render:x=>`<a class="link" onclick="openPerformanceDetail(${x.id})">查看</a>`
    }
  ]
};

function getColumnStorageKey(tableKey){
  return "EM_TABLE_COLUMNS_" + APP_CODE_VERSION + "_" + tableKey;
}

function getDefaultColumnConfig(tableKey){
  return tableColumnDefinitions[tableKey].map((col,index)=>({
    key:col.key,
    title:col.title,
    width:col.width || 120,
    visible:true,
    order:index + 1,
    align:col.align || "left"
  }));
}

function getColumnConfig(tableKey){
  const defaults=getDefaultColumnConfig(tableKey);
  let saved=null;

  try{
    saved=JSON.parse(localStorage.getItem(getColumnStorageKey(tableKey))||"null");
  }catch(e){}

  if(!saved || !Array.isArray(saved))return defaults;

  const merged=defaults.map(def=>{
    const old=saved.find(x=>x.key===def.key);
    return old?{
      ...def,
      width:Number(old.width)||def.width,
      visible:old.visible!==false,
      order:Number(old.order)||def.order,
      align:old.align||def.align||"left"
    }:def;
  });

  return merged
    .sort((a,b)=>a.order-b.order)
    .map((item,index)=>({...item,order:index+1}));
}

function getVisibleColumns(tableKey){
  const config=getColumnConfig(tableKey);
  const defs=tableColumnDefinitions[tableKey];

  return config
    .filter(c=>c.visible)
    .sort((a,b)=>a.order-b.order)
    .map(c=>({
      ...defs.find(d=>d.key===c.key),
      ...c,
      align:c.align||"left"
    }))
    .filter(c=>c.key);
}

function getTableMinWidth(tableKey){
  return getVisibleColumns(tableKey).reduce((sum,c)=>sum+(Number(c.width)||120),0);
}

function renderTableHeaderByColumns(tableKey){
  return getVisibleColumns(tableKey).map(col=>`
    <th style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
      ${col.title}
    </th>
  `).join("");
}

function renderTableByColumns(tableKey,data,tbodyId){
  const columns=getVisibleColumns(tableKey);
  const tbody=document.getElementById(tbodyId);
  if(!tbody)return;

  tbody.innerHTML=data.map((row,index)=>`
    <tr>
      ${columns.map(col=>`
        <td style="width:${col.width}px;min-width:${col.width}px;max-width:${col.width}px;text-align:${col.align||"left"}">
          ${col.render(row,index)}
        </td>
      `).join("")}
    </tr>
  `).join("");
}

function openColumnSetting(tableKey,afterSaveFnName){
  const config=getColumnConfig(tableKey);

  openModal(
    "列设置",
    `
      <div class="setting-tip">
        可设置当前列表的列宽、是否展示、显示顺序、内容对齐方式。设置会自动保存到浏览器本地缓存。
        排序数字越小越靠前；也可使用上移、下移快速调整。
      </div>
      <div style="overflow:auto">
        <table class="column-setting-table">
          <thead>
            <tr>
              <th style="width:80px">展示</th>
              <th>列名</th>
              <th style="width:130px">列宽(px)</th>
              <th style="width:130px">内容对齐</th>
              <th style="width:120px">排序</th>
              <th style="width:150px">快捷排序</th>
            </tr>
          </thead>
          <tbody id="columnSettingTbody">
            ${config.map(col=>`
              <tr data-key="${col.key}">
                <td style="text-align:center">
                  <input type="checkbox" class="col-visible" ${col.visible?"checked":""}>
                </td>
                <td>${col.title}</td>
                <td>
                  <input type="number" class="col-width" min="60" max="600" value="${col.width}">
                </td>
                <td>
                  <select class="col-align">
                    <option value="left" ${col.align==="left"?"selected":""}>居左</option>
                    <option value="center" ${col.align==="center"?"selected":""}>居中</option>
                    <option value="right" ${col.align==="right"?"selected":""}>居右</option>
                  </select>
                </td>
                <td>
                  <input type="number" class="col-order" min="1" max="${config.length}" value="${col.order}">
                </td>
                <td>
                  <button class="mini-btn" onclick="moveColumnSettingRow(this,-1)">上移</button>
                  <button class="mini-btn" onclick="moveColumnSettingRow(this,1)">下移</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,
    `
      <button class="btn" onclick="resetColumnSetting('${tableKey}','${afterSaveFnName}')">恢复默认</button>
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="saveColumnSetting('${tableKey}','${afterSaveFnName}')">保存</button>
    `,
    "large"
  );
}

function refreshColumnOrderInputs(){
  [...document.querySelectorAll("#columnSettingTbody tr")].forEach((row,index)=>{
    const orderInput=row.querySelector(".col-order");
    if(orderInput)orderInput.value=index+1;
  });
}

function moveColumnSettingRow(btn,dir){
  const row=btn.closest("tr");
  const tbody=row.parentElement;

  if(dir<0 && row.previousElementSibling){
    tbody.insertBefore(row,row.previousElementSibling);
  }

  if(dir>0 && row.nextElementSibling){
    tbody.insertBefore(row.nextElementSibling,row);
  }

  refreshColumnOrderInputs();
}

function saveColumnSetting(tableKey,afterSaveFnName){
  const rows=[...document.querySelectorAll("#columnSettingTbody tr")];

  let config=rows.map(row=>({
    key:row.dataset.key,
    title:tableColumnDefinitions[tableKey].find(c=>c.key===row.dataset.key)?.title || row.dataset.key,
    visible:row.querySelector(".col-visible").checked,
    width:Math.max(60,Number(row.querySelector(".col-width").value)||120),
    align:row.querySelector(".col-align")?.value || "left",
    order:Number(row.querySelector(".col-order").value)||999
  }));

  config.sort((a,b)=>a.order-b.order);
  config=config.map((item,index)=>({...item,order:index+1}));

  localStorage.setItem(getColumnStorageKey(tableKey),JSON.stringify(config));

  closeModal();

  if(typeof window[afterSaveFnName]==="function"){
    window[afterSaveFnName]();
  }

  showToast("列设置已保存");
}

function resetColumnSetting(tableKey,afterSaveFnName){
  localStorage.removeItem(getColumnStorageKey(tableKey));
  closeModal();

  if(typeof window[afterSaveFnName]==="function"){
    window[afterSaveFnName]();
  }

  showToast("已恢复默认列设置");
}

function renderUnifiedQueryCard(fieldsHtml, options={}){
  const title=options.title || "查询条件";
  const resetFn=options.resetFn || "";
  const queryFn=options.queryFn || "";
  const gridClass=options.gridClass || "search-grid";
  const cardId=options.id || "unifiedQueryCard";
  const fieldCount=(fieldsHtml.match(/class="form-item/g)||[]).length;
  const canCollapse=options.canCollapse ?? fieldCount>8;
  const collapsed=canCollapse && options.collapsed!==false;
  return `
    <section id="${cardId}" class="card unified-query-card ${collapsed?"collapsed":""}">
      <div class="card-hd">
        <div class="card-title">${title}</div>
        <div class="actions">
          <button class="btn" onclick="${resetFn}">重置</button>
          <button class="btn primary" onclick="${queryFn}">查询</button>
          ${canCollapse?`<button id="${cardId}Toggle" class="btn" onclick="toggleUnifiedQueryCard('${cardId}')">${collapsed?"展开":"收起"}</button>`:""}
        </div>
      </div>
      <div class="card-bd">
        <div class="${gridClass}">
          ${fieldsHtml}
        </div>
      </div>
    </section>
  `;
}

function toggleUnifiedQueryCard(cardId){
  const card=document.getElementById(cardId);
  if(!card)return;
  const collapsed=!card.classList.contains("collapsed");
  card.classList.toggle("collapsed",collapsed);
  const btn=document.getElementById(`${cardId}Toggle`);
  if(btn)btn.textContent=collapsed?"展开":"收起";
}

function escapeAttr(value){
  return String(value||"")
    .replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function showFloatingInfoTip(el){
  const text=el?.dataset?.tip;
  if(!text)return;

  let tip=document.getElementById("floatingInfoTip");
  if(!tip){
    tip=document.createElement("div");
    tip.id="floatingInfoTip";
    tip.className="floating-info-tip";
    document.body.appendChild(tip);
  }

  tip.textContent=text;
  tip.style.display="block";

  const rect=el.getBoundingClientRect();
  const gap=8;
  const width=Math.min(260,window.innerWidth-24);
  tip.style.maxWidth=width+"px";

  const tipRect=tip.getBoundingClientRect();
  let left=rect.left + rect.width/2 - tipRect.width/2;
  left=Math.max(12,Math.min(left,window.innerWidth-tipRect.width-12));

  let top=rect.top - tipRect.height - gap;
  if(top<8)top=rect.bottom + gap;

  tip.style.left=left+"px";
  tip.style.top=top+"px";
}

function hideFloatingInfoTip(){
  const tip=document.getElementById("floatingInfoTip");
  if(tip)tip.style.display="none";
}

function renderInfoTip(text){
  if(!text)return "";
  return `<span class="info-tip" tabindex="0" data-tip="${escapeAttr(text)}" onmouseenter="showFloatingInfoTip(this)" onmouseleave="hideFloatingInfoTip()" onfocus="showFloatingInfoTip(this)" onblur="hideFloatingInfoTip()">i</span>`;
}

function renderUnifiedStatsCard(statsHtml, options={}){
  const titleHtml=options.showTitle?`
      <div class="card-hd">
        <div class="card-title">${options.title || "筛选统计"}${renderInfoTip(options.tip || "")}</div>
      </div>
  `:"";
  return `
    <section class="card unified-stats-card">
      ${titleHtml}
      <div class="card-bd">
        ${statsHtml}
      </div>
    </section>
  `;
}

function renderUnifiedTableCard(options){
  const tableKey=options.tableKey;
  const tbodyId=options.tbodyId;
  return `
    <section class="card table-card ${options.className || ""}">
      <div class="card-hd">
        <div class="card-title">${options.title || "列表"}</div>
        <div class="actions">
          ${options.beforeActions || ""}
          <button class="btn" onclick="${options.refreshAction || ""}">刷新</button>
          <button class="btn primary" onclick="${options.exportAction || ""}">导出</button>
          <button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('${tableKey}','${options.renderFnName}')">⚙</button>
        </div>
      </div>

      <div class="table-wrap roster-table-wrap">
        <table id="${options.tableId || tableKey + 'Table'}" style="min-width:${getTableMinWidth(tableKey)}px">
          <thead>
            <tr id="${options.theadId || tableKey + 'Thead'}">${renderTableHeaderByColumns(tableKey)}</tr>
          </thead>
          <tbody id="${tbodyId}"></tbody>
        </table>
      </div>

      <div class="pagination">
        <span id="${options.totalId || tableKey + 'TotalText'}">共 ${options.total || 0} 条</span>
        <span>${options.pageText || "第 1 / 1 页　每页 10 条"}</span>
      </div>
    </section>
  `;
}

