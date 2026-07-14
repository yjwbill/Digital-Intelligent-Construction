/* V2.2.107 operation production project report */
const operationBusinessTypes=[
  "总承包",
  "管线",
  "城市运营",
  "投资-股权项目",
  "投资-基建项目",
  "投资-租赁及保理",
  "房产-房产开发",
  "房产-商业运营",
  "房产-物业管理",
  "设计",
  "产品销售",
  "数字"
];

const operationLeaseReportState={
  bizType:"投资-租赁及保理",
  relationStatus:"all",
  pushStatus:"",
  projectName:"",
  org:"",
  projectManager:"",
  productionProjectNo:"",
  subProjectNo:"",
  createMode:"",
  managementUnit:"",
  orderProjectNo:"",
  accountingProjectNo:"",
  businessType:"",
  lesseeBuyerNature:"",
  source:"",
  isRealEstate:"",
  projectStatus:"",
  operatingLease:"",
  projectMode:"",
  isAcquisition:"",
  projectType:"",
  feeSource:"",
  feeCategory:"",
  incomeSource:"",
  investmentType:""
};

const operationProjectStatusOptions=["授信","提款","结清","逾期","出险","核损","在用","正常","已废止"];

const operationLeaseReportData=[
  {
    projectName:"随建协作-江苏丰和20260526-006",
    roe:"0.0200",
    profit:"1,560,000.00",
    term:"2026-06-22",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2026-06-22",
    endDate:"2027-06-22",
    createDate:"2026-06-29 09:32",
    loanRegisterTime:"2026.6.30",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060031",
    subProjectNo:"SUCG042026060031",
    createMode:"手动",
    org:"上海元晟融资租赁有限公司",
    projectManager:"王志华",
    managementUnit:"上海元晟融资租赁有限公司",
    orderProjectNo:"SUCG1022-03-0001-006",
    accountingProjectNo:"HS202606001",
    relationStatus:"linked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00207343",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-提效",
    projectMode:"建设金融-经营性租赁",
    totalInvestment:"1560000.0000"
  },
  {
    projectName:"随建协作-江苏丰和20260526-005",
    roe:"0.0200",
    profit:"1,560,000.00",
    term:"2026-06-22",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2026-06-22",
    endDate:"2027-06-22",
    createDate:"2026-06-29 09:25",
    loanRegisterTime:"2026.6.30",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060030",
    subProjectNo:"SUCG042026060030",
    createMode:"手动",
    org:"上海元晟融资租赁有限公司",
    projectManager:"王志华",
    managementUnit:"上海元晟融资租赁有限公司",
    orderProjectNo:"SUCG1022-03-0001-005",
    accountingProjectNo:"HS202606002",
    relationStatus:"linked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00207342",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-提效",
    projectMode:"建设金融-经营性租赁",
    totalInvestment:"1560000.0000"
  },
  {
    projectName:"新城资产20260622045",
    roe:"0.0000",
    profit:"0",
    term:"2026-05-10",
    source:"集团外项目",
    leaseObject:"",
    creditEnhancement:"无锡市太湖新城产业投资集团有限公司",
    startDate:"2025-07-15",
    endDate:"2026-05-10",
    createDate:"2026-06-26 16:24",
    loanRegisterTime:"2025-07-15",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060028",
    subProjectNo:"SUCG1022-02-0048-001",
    createMode:"集成",
    org:"上海元晟融资租赁有限公司",
    projectManager:"陈晓",
    managementUnit:"上海元晟融资租赁有限公司",
    orderProjectNo:"",
    accountingProjectNo:"HS202606003",
    relationStatus:"unlinked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00206737",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-结清",
    projectMode:"建设金融-售后回租",
    totalInvestment:"100000000.0000"
  },
  {
    projectName:"扬州融通20260612041",
    roe:"0.0000",
    profit:"0",
    term:"2026-06-18",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2025-06-25",
    endDate:"2026-06-18",
    createDate:"2026-06-18 11:01",
    loanRegisterTime:"2025-06-25",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060023",
    subProjectNo:"SUCG1001-01-0160-001",
    createMode:"集成",
    org:"上海元晟商业保理有限公司",
    projectManager:"赵青",
    managementUnit:"上海元晟商业保理有限公司",
    orderProjectNo:"",
    accountingProjectNo:"HS202606004",
    relationStatus:"unlinked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00158804",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-反向无追",
    projectMode:"建设金融-反向无追",
    totalInvestment:"1582200.0000"
  },
  {
    projectName:"城市建设20250624",
    roe:"0.0000",
    profit:"0",
    term:"2026-06-11",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2025-06-24",
    endDate:"2026-06-11",
    createDate:"2026-06-11 14:39",
    loanRegisterTime:"2025-06-24",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060021",
    subProjectNo:"SUCG1001-01-0190-001",
    createMode:"集成",
    org:"上海元晟商业保理有限公司",
    projectManager:"张宁",
    managementUnit:"上海元晟商业保理有限公司",
    orderProjectNo:"",
    accountingProjectNo:"HS202606005",
    relationStatus:"unlinked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00158499",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-结清",
    projectMode:"建设金融-反向无追",
    totalInvestment:"1472900.0000"
  },
  {
    projectName:"上海润耀20260529",
    roe:"0.0000",
    profit:"0",
    term:"2027-04-28",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2025-06-30",
    endDate:"2026-06-04",
    createDate:"2026-06-04 14:03",
    loanRegisterTime:"2025-06-30",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060020",
    subProjectNo:"SUCG1001-01-0180-001",
    createMode:"集成",
    org:"上海元晟商业保理有限公司",
    projectManager:"李敏",
    managementUnit:"上海元晟商业保理有限公司",
    orderProjectNo:"",
    accountingProjectNo:"HS202606006",
    relationStatus:"unlinked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00206396",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-结清",
    projectMode:"建设金融-反向无追",
    totalInvestment:"1695142.3200"
  },
  {
    projectName:"上海虹桥20250627",
    roe:"0.0000",
    profit:"0",
    term:"2026-06-04",
    source:"集团内项目",
    leaseObject:"",
    creditEnhancement:"无",
    startDate:"2025-06-27",
    endDate:"2026-06-04",
    createDate:"2026-06-04 14:03",
    loanRegisterTime:"2025-06-27",
    riskClass:"正常",
    productionProjectNo:"SUCG042026060018",
    subProjectNo:"SUCG1001-01-0060-001",
    createMode:"集成",
    org:"上海元晟商业保理有限公司",
    projectManager:"王晨",
    managementUnit:"上海元晟商业保理有限公司",
    orderProjectNo:"",
    accountingProjectNo:"HS202606007",
    relationStatus:"unlinked",
    isRealEstate:"否",
    relatedOrderProject:"ProjectMdm00159105",
    lesseeRealEstate:"否",
    guarantorRealEstate:"否",
    realEstateIncome:"0.0000",
    projectStatus:"建设金融-结清",
    projectMode:"建设金融-反向无追",
    totalInvestment:"1300000.0000"
  }
];

operationLeaseReportData.forEach((item,index)=>{
  const amount=Number(String(item.totalInvestment||"0").replace(/,/g,""))||0;
  Object.assign(item,{
    projectCostYuan:item.projectCostYuan || item.totalInvestment,
    executiveProjectManager:item.executiveProjectManager || item.projectManager,
    contactPhone:item.contactPhone || ["138****2601","139****2602","136****2603","135****2604","137****2605","150****2606","151****2607"][index] || "-",
    fullContactPhone:item.fullContactPhone || ["13816262601","13916262602","13616262603","13516262604","13716262605","15016262606","15116262607"][index] || "",
    bidPriceYuan:item.bidPriceYuan || item.totalInvestment,
    projectBizType:item.projectBizType || "投资-租赁及保理",
    pushStatus:item.pushStatus || (index<5?"成功":"失败"),
    pushTime:item.pushTime || (index<5?`2026-06-${String(29-index).padStart(2,"0")} 10:${String(18+index).padStart(2,"0")}`:"-"),
    accountingProjectNo:index===0?"HS202606001;HS202606001-01":item.accountingProjectNo || "",
    businessType:item.businessType || item.projectMode,
    lesseeBuyerNature:item.lesseeBuyerNature || (item.source==="集团内项目"?"集团内企业":"外部国企"),
    projectStatus:operationProjectStatusOptions[index%operationProjectStatusOptions.length],
    operatingLease:item.operatingLease || (item.projectMode?.includes("经营性租赁")?"是":"否"),
    orderType:item.orderType || (index<2?"备案制订单":"审批制订单"),
    subCompany:item.subCompany || (item.managementUnit?.includes("融资租赁")?"城建投资":"元晟保理"),
    ownerUnit:item.ownerUnit || (item.source==="集团内项目"?"上海城建隧道装备科技发展有限公司":"外部业主单位"),
    orderProjectType:item.orderProjectType || "产品租售-租赁-经营性租赁",
    regionalMarket:item.regionalMarket || "全部",
    bidDate:item.bidDate || "-",
    legalUnit:item.legalUnit || "上海城建投资发展有限公司",
    baseUnit:item.baseUnit || "推送报账后自动获取",
    projectDept:item.projectDept || "",
    contractManager:item.contractManager || "",
    contractPriceYuan:item.contractPriceYuan || item.totalInvestment,
    businessCategory:item.businessCategory || "战略性业务",
    businessSector:item.businessSector || "培育业务",
    businessSectorLevel2:item.businessSectorLevel2 || "工程与装备相关融资租赁",
    businessSectorLevel3:item.businessSectorLevel3 || "融资租赁",
    coreArea:item.coreArea || "",
    coreCity:item.coreCity || "",
    country:item.country || "中国",
    provinceCity:item.provinceCity || "",
    projectAddress:item.projectAddress || "上海",
    currency:item.currency || "人民币",
    settlementReportedAmount:item.settlementReportedAmount || "0.00",
    groupIntegratedMode:item.groupIntegratedMode || "否",
    projectAmountBillion:item.projectAmountBillion || (amount/100000000).toFixed(4),
    serviceFeeYuan:item.serviceFeeYuan || (index<2?"12,000.00":"0.00"),
    projectXirrBeforeTax:item.projectXirrBeforeTax || (index<2?"3.80%":"2.10%"),
    ownFundXirrAfterTax:item.ownFundXirrAfterTax || (index<2?"2.45%":"1.68%")
  });
});

const operationInfraReportData=[
  {
    projectName:"杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段",
    productionProjectNo:"SUCG052026070001",
    subProjectNo:"JJXM-2026-001",
    createMode:"集成",
    projectCostYuan:"2,480,000,000.00",
    executiveProjectManager:"周明",
    contactPhone:"138****7001",
    fullContactPhone:"13817007001",
    managementUnit:"上海路桥集团有限公司",
    bidPriceYuan:"2,368,800,000.00",
    projectBizType:"投资-基建项目",
    pushStatus:"成功",
    pushTime:"2026-07-01 09:28",
    accountingProjectNo:"HSJJ202607001;HSJJ202607001-01",
    businessType:"PPP投资建设",
    finalReviewAmountYuan:"2,355,600,000.00",
    actualStartDate:"2025-03-18",
    actualFinishDate:"2027-12-30",
    settlementReportDate:"2028-03-20",
    finalAuditDate:"2028-06-15",
    settlementStatus:"未结算",
    projectLocation:"浙江省绍兴市",
    investmentEntityName:"内部-上海路桥基础设施投资有限公司",
    projectCompanyEquity:"上海路桥60%;社会资本40%",
    userPaymentRatio:"35%",
    ownInvestmentRatio:"60%",
    feeSource:"政府付费",
    feeCategory:"可用性服务费",
    incomeSource:"运营补贴",
    initialCapitalReturnRate:"5.80%",
    shInfraRetentionReturn:"1.20%",
    contractorRetentionReturn:"0.85%",
    constructionDiscountRate:"4.50%",
    projectType:"PPP",
    projectStatus:"在用",
    isAcquisition:"否",
    investmentType:"新建投资",
    relationStatus:"linked"
  },
  {
    projectName:"新马工业园节能环保产业园基础设施配套项目",
    productionProjectNo:"SUCG052026070002",
    subProjectNo:"JJXM-2026-002",
    createMode:"手动",
    projectCostYuan:"860,000,000.00",
    executiveProjectManager:"赵菁",
    contactPhone:"139****7002",
    fullContactPhone:"13917007002",
    managementUnit:"市政集团有限公司",
    bidPriceYuan:"842,500,000.00",
    projectBizType:"投资-基建项目",
    pushStatus:"成功",
    pushTime:"2026-06-28 14:16",
    accountingProjectNo:"HSJJ202607002",
    businessType:"基础设施投资",
    finalReviewAmountYuan:"838,200,000.00",
    actualStartDate:"2025-08-01",
    actualFinishDate:"2027-05-31",
    settlementReportDate:"2027-08-18",
    finalAuditDate:"2027-11-20",
    settlementStatus:"过程结算",
    projectLocation:"湖南省株洲市",
    investmentEntityName:"外部-新马工业园投资发展有限公司",
    projectCompanyEquity:"园区平台70%;市政集团30%",
    userPaymentRatio:"20%",
    ownInvestmentRatio:"30%",
    feeSource:"使用者付费",
    feeCategory:"运营维护费",
    incomeSource:"园区租售收入",
    initialCapitalReturnRate:"6.20%",
    shInfraRetentionReturn:"0.90%",
    contractorRetentionReturn:"0.70%",
    constructionDiscountRate:"3.80%",
    projectType:"产业园配套",
    projectStatus:"正常",
    isAcquisition:"否",
    investmentType:"联合投资",
    relationStatus:"linked"
  },
  {
    projectName:"临港新片区综合管廊及市政道路投资建设项目",
    productionProjectNo:"SUCG052026070003",
    subProjectNo:"JJXM-2026-003",
    createMode:"集成",
    projectCostYuan:"1,320,000,000.00",
    executiveProjectManager:"陈启航",
    contactPhone:"136****7003",
    fullContactPhone:"13617007003",
    managementUnit:"上海隧道",
    bidPriceYuan:"1,286,000,000.00",
    projectBizType:"投资-基建项目",
    pushStatus:"失败",
    pushTime:"-",
    accountingProjectNo:"HSJJ202607003",
    businessType:"BOT投资建设",
    finalReviewAmountYuan:"1,274,500,000.00",
    actualStartDate:"2025-11-12",
    actualFinishDate:"2028-02-28",
    settlementReportDate:"2028-05-10",
    finalAuditDate:"2028-09-30",
    settlementStatus:"未结算",
    projectLocation:"上海市浦东新区",
    investmentEntityName:"内部-上海隧道基础设施投资有限公司",
    projectCompanyEquity:"上海隧道55%;产业基金45%",
    userPaymentRatio:"55%",
    ownInvestmentRatio:"55%",
    feeSource:"财政补贴",
    feeCategory:"建设服务费",
    incomeSource:"管廊租赁收入",
    initialCapitalReturnRate:"5.45%",
    shInfraRetentionReturn:"1.05%",
    contractorRetentionReturn:"0.62%",
    constructionDiscountRate:"4.10%",
    projectType:"综合管廊",
    projectStatus:"提款",
    isAcquisition:"否",
    investmentType:"新建投资",
    relationStatus:"unlinked"
  },
  {
    projectName:"北横通道周边配套停车及地下空间收并购项目",
    productionProjectNo:"SUCG052026070004",
    subProjectNo:"JJXM-2026-004",
    createMode:"手动",
    projectCostYuan:"520,000,000.00",
    executiveProjectManager:"吴越",
    contactPhone:"135****7004",
    fullContactPhone:"13517007004",
    managementUnit:"运营集团",
    bidPriceYuan:"508,300,000.00",
    projectBizType:"投资-基建项目",
    pushStatus:"成功",
    pushTime:"2026-06-24 16:42",
    accountingProjectNo:"HSJJ202607004",
    businessType:"资产收并购",
    finalReviewAmountYuan:"501,900,000.00",
    actualStartDate:"2026-01-05",
    actualFinishDate:"2026-12-31",
    settlementReportDate:"2027-02-15",
    finalAuditDate:"2027-04-20",
    settlementStatus:"已结算",
    projectLocation:"上海市静安区",
    investmentEntityName:"外部-城市更新资产管理有限公司",
    projectCompanyEquity:"运营集团51%;外部股东49%",
    userPaymentRatio:"80%",
    ownInvestmentRatio:"51%",
    feeSource:"使用者付费",
    feeCategory:"停车服务费",
    incomeSource:"停车运营收入",
    initialCapitalReturnRate:"7.10%",
    shInfraRetentionReturn:"0.75%",
    contractorRetentionReturn:"0.55%",
    constructionDiscountRate:"2.60%",
    projectType:"城市更新",
    projectStatus:"正常",
    isAcquisition:"是",
    investmentType:"收并购投资",
    relationStatus:"linked"
  },
  {
    projectName:"苏州河综合治理三期基础设施投资项目",
    productionProjectNo:"SUCG052026070005",
    subProjectNo:"JJXM-2026-005",
    createMode:"集成",
    projectCostYuan:"740,000,000.00",
    executiveProjectManager:"郭琳",
    contactPhone:"137****7005",
    fullContactPhone:"13717007005",
    managementUnit:"城市环境",
    bidPriceYuan:"721,600,000.00",
    projectBizType:"投资-基建项目",
    pushStatus:"成功",
    pushTime:"2026-06-20 11:08",
    accountingProjectNo:"HSJJ202607005;HSJJ202607005-02",
    businessType:"EOD投资",
    finalReviewAmountYuan:"719,000,000.00",
    actualStartDate:"2025-09-26",
    actualFinishDate:"2027-03-30",
    settlementReportDate:"2027-06-12",
    finalAuditDate:"2027-09-01",
    settlementStatus:"过程结算",
    projectLocation:"上海市普陀区",
    investmentEntityName:"内部-城市环境投资有限公司",
    projectCompanyEquity:"城市环境65%;生态基金35%",
    userPaymentRatio:"15%",
    ownInvestmentRatio:"65%",
    feeSource:"政府付费",
    feeCategory:"生态治理服务费",
    incomeSource:"治理服务收入",
    initialCapitalReturnRate:"5.95%",
    shInfraRetentionReturn:"0.88%",
    contractorRetentionReturn:"0.50%",
    constructionDiscountRate:"3.20%",
    projectType:"生态治理",
    projectStatus:"在用",
    isAcquisition:"否",
    investmentType:"专项投资",
    relationStatus:"linked"
  }
];

const operationPhoneRevealMap={};

function renderOperationPhone(r){
  const key=r.productionProjectNo || r.projectName;
  const visible=operationPhoneRevealMap[key]&&operationPhoneRevealMap[key]>Date.now();
  const phone=visible?(r.fullContactPhone||r.contactPhone):r.contactPhone;
  return `
    <span>${phone||"-"}</span>
    ${r.fullContactPhone?`<button class="link" title="查看完整手机号" onclick="revealOperationPhone('${escapeAttr(key)}')">👁️</button>`:""}
  `;
}

function revealOperationPhone(key){
  operationPhoneRevealMap[key]=Date.now()+3000;
  renderOperationLeaseTable();
  setTimeout(()=>renderOperationLeaseTable(),3000);
}

tableColumnDefinitions.operationLeaseProject=[
  {key:"index",title:"序号",width:70,align:"center",render:(r,i)=>i+1},
  {key:"projectName",title:"生产项目名称",width:220,render:r=>`<a class="link" onclick="openOperationLeaseDetail('${escapeAttr(r.productionProjectNo)}')">${r.projectName}</a>`},
  {key:"subProjectNo",title:"子公司项目编号",width:170,render:r=>r.subProjectNo||"-"},
  {key:"createMode",title:"创建模式",width:110,align:"center",render:r=>tag(r.createMode||"-",r.createMode==="集成"?"blue":"orange")},
  {key:"projectCostYuan",title:"项目造价（元）",width:140,align:"right",render:r=>r.projectCostYuan||r.totalInvestment||"-"},
  {key:"executiveProjectManager",title:"常务项目经理",width:120,align:"center",render:r=>r.executiveProjectManager||r.projectManager||"-"},
  {key:"contactPhone",title:"联系方式",width:140,align:"center",render:r=>renderOperationPhone(r)},
  {key:"managementUnit",title:"子公司管理单位",width:210,render:r=>r.managementUnit||"-"},
  {key:"bidPriceYuan",title:"中标价（元）",width:140,align:"right",render:r=>r.bidPriceYuan||"-"},
  {key:"projectBizType",title:"项目业态",width:140,align:"center",render:r=>r.projectBizType||operationLeaseReportState.bizType||"-"},
  {key:"pushStatus",title:"报账推送状态",width:130,align:"center",render:r=>tag(r.pushStatus||"-",r.pushStatus==="成功"?"green":"red")},
  {key:"pushTime",title:"报账推送时间",width:160,align:"center",render:r=>r.pushTime||"-"},
  {key:"accountingProjectNo",title:"关联核算项目",width:210,render:r=>r.accountingProjectNo||"-"},
  {key:"businessType",title:"业务类型",width:160,align:"center",render:r=>r.businessType||r.projectMode||"-"},
  {key:"lesseeBuyerNature",title:"承租人性质/买方性质",width:170,align:"center",render:r=>r.lesseeBuyerNature||"-"},
  {key:"projectAmountBillion",title:"项目金额（亿元）",width:140,align:"right",render:r=>r.projectAmountBillion||"-"},
  {key:"serviceFeeYuan",title:"手续费（元）",width:130,align:"right",render:r=>r.serviceFeeYuan||"-"},
  {key:"projectXirrBeforeTax",title:"全项目XIRR（税前）",width:150,align:"right",render:r=>r.projectXirrBeforeTax||"-"},
  {key:"ownFundXirrAfterTax",title:"自有资金XIRR（税后）",width:160,align:"right",render:r=>r.ownFundXirrAfterTax||"-"},
  {key:"roe",title:"项目ROE（静态）",width:130,align:"right",render:r=>r.roe||"-"},
  {key:"profit",title:"项目净利润",width:130,align:"right",render:r=>r.profit||"-"},
  {key:"term",title:"期限/保理期限",width:130,align:"center",render:r=>r.term||"-"},
  {key:"source",title:"项目来源",width:120,render:r=>r.source||"-"},
  {key:"leaseObject",title:"租赁物",width:120,render:r=>r.leaseObject||"-"},
  {key:"creditEnhancement",title:"增信措施",width:180,render:r=>`<span class="text-ellipsis" title="${escapeAttr(r.creditEnhancement||'-')}">${r.creditEnhancement||"-"}</span>`},
  {key:"startDate",title:"业务起始日",width:130,align:"center",render:r=>r.startDate||"-"},
  {key:"endDate",title:"业务到期日",width:130,align:"center",render:r=>r.endDate||"-"},
  {key:"createDate",title:"创建日期",width:150,align:"center",render:r=>r.createDate||"-"},
  {key:"loanRegisterTime",title:"放款登记时间",width:130,align:"center",render:r=>r.loanRegisterTime||"-"},
  {key:"riskClass",title:"当前风险资产分类",width:150,align:"center",render:r=>r.riskClass||"-"},
  {key:"productionProjectNo",title:"生产项目编号",width:160,render:r=>r.productionProjectNo||"-"},
  {key:"isRealEstate",title:"是否涉房",width:100,align:"center",render:r=>r.isRealEstate||"-"},
  {key:"relatedOrderProject",title:"关联订单项目",width:170,render:r=>r.relatedOrderProject||"-"},
  {key:"lesseeRealEstate",title:"承租人主涉房",width:130,align:"center",render:r=>r.lesseeRealEstate||"-"},
  {key:"guarantorRealEstate",title:"担保人主涉房",width:130,align:"center",render:r=>r.guarantorRealEstate||"-"},
  {key:"realEstateIncome",title:"涉房收入金额（元）",width:150,align:"right",render:r=>r.realEstateIncome||"-"},
  {key:"projectStatus",title:"项目状态",width:150,align:"center",render:r=>r.projectStatus||"-"},
  {key:"operatingLease",title:"是否经营性租赁",width:140,align:"center",render:r=>r.operatingLease||"-"},
  {key:"projectMode",title:"项目模式",width:170,align:"center",render:r=>r.projectMode||"-"},
  {key:"totalInvestment",title:"项目总投（元）",width:140,align:"right",render:r=>r.totalInvestment||"-"},
  {key:"operation",title:"操作",width:180,align:"center",render:r=>`<a class="link" onclick="openOperationLeaseDetail('${escapeAttr(r.productionProjectNo)}')">详情</a>　<a class="link" onclick="showToast('编辑：${r.projectName}')">编辑</a>　<a class="link" onclick="showToast('推送至报账：${r.projectName}')">推送至报账</a>`}
];

tableColumnDefinitions.operationInfraProject=[
  {key:"index",title:"序号",width:70,align:"center",render:(r,i)=>i+1},
  {key:"projectName",title:"生产项目名称",width:260,render:r=>`<a class="link" onclick="openOperationLeaseDetail('${escapeAttr(r.productionProjectNo)}')">${r.projectName}</a>`},
  {key:"subProjectNo",title:"子公司项目编号",width:170,render:r=>r.subProjectNo||"-"},
  {key:"createMode",title:"创建模式",width:110,align:"center",render:r=>tag(r.createMode||"-",r.createMode==="集成"?"blue":"orange")},
  {key:"projectCostYuan",title:"项目造价（元）",width:150,align:"right",render:r=>r.projectCostYuan||"-"},
  {key:"executiveProjectManager",title:"常务项目经理",width:120,align:"center",render:r=>r.executiveProjectManager||"-"},
  {key:"contactPhone",title:"联系方式",width:140,align:"center",render:r=>renderOperationPhone(r)},
  {key:"managementUnit",title:"子公司管理单位",width:210,render:r=>r.managementUnit||"-"},
  {key:"bidPriceYuan",title:"中标价（元）",width:150,align:"right",render:r=>r.bidPriceYuan||"-"},
  {key:"projectBizType",title:"项目业态",width:140,align:"center",render:r=>r.projectBizType||"-"},
  {key:"pushStatus",title:"报账推送状态",width:130,align:"center",render:r=>tag(r.pushStatus||"-",r.pushStatus==="成功"?"green":"red")},
  {key:"pushTime",title:"报账推送时间",width:160,align:"center",render:r=>r.pushTime||"-"},
  {key:"accountingProjectNo",title:"关联核算项目",width:220,render:r=>r.accountingProjectNo||"-"},
  {key:"businessType",title:"业务类型",width:150,align:"center",render:r=>r.businessType||"-"},
  {key:"finalReviewAmountYuan",title:"终审金额（元）",width:150,align:"right",render:r=>r.finalReviewAmountYuan||"-"},
  {key:"actualStartDate",title:"实际开工日期",width:130,align:"center",render:r=>r.actualStartDate||"-"},
  {key:"actualFinishDate",title:"实际完工日期",width:130,align:"center",render:r=>r.actualFinishDate||"-"},
  {key:"settlementReportDate",title:"结算上报日期",width:130,align:"center",render:r=>r.settlementReportDate||"-"},
  {key:"finalAuditDate",title:"最终审定日期",width:130,align:"center",render:r=>r.finalAuditDate||"-"},
  {key:"settlementStatus",title:"项目结算状态",width:130,align:"center",render:r=>r.settlementStatus||"-"},
  {key:"projectLocation",title:"项目所在地",width:160,render:r=>r.projectLocation||"-"},
  {key:"investmentEntityName",title:"项目投资主体名称【内部、外部】",width:250,render:r=>r.investmentEntityName||"-"},
  {key:"projectCompanyEquity",title:"项目公司股权结构",width:220,render:r=>r.projectCompanyEquity||"-"},
  {key:"userPaymentRatio",title:"使用者付费占比",width:130,align:"right",render:r=>r.userPaymentRatio||"-"},
  {key:"ownInvestmentRatio",title:"己方投资比例",width:120,align:"right",render:r=>r.ownInvestmentRatio||"-"},
  {key:"feeSource",title:"支付费用来源",width:130,align:"center",render:r=>r.feeSource||"-"},
  {key:"feeCategory",title:"支付费用类别",width:150,align:"center",render:r=>r.feeCategory||"-"},
  {key:"incomeSource",title:"收入来源",width:150,align:"center",render:r=>r.incomeSource||"-"},
  {key:"initialCapitalReturnRate",title:"初始资金收益率",width:140,align:"right",render:r=>r.initialCapitalReturnRate||"-"},
  {key:"shInfraRetentionReturn",title:"总包下浮部分收益率--留存上海基建",width:250,align:"right",render:r=>r.shInfraRetentionReturn||"-"},
  {key:"contractorRetentionReturn",title:"总包下浮部分收益率--留存总包",width:230,align:"right",render:r=>r.contractorRetentionReturn||"-"},
  {key:"constructionDiscountRate",title:"施工下浮率",width:120,align:"right",render:r=>r.constructionDiscountRate||"-"},
  {key:"projectType",title:"项目类型",width:130,align:"center",render:r=>r.projectType||"-"},
  {key:"projectStatus",title:"项目状态",width:120,align:"center",render:r=>r.projectStatus||"-"},
  {key:"isAcquisition",title:"是否收并购项目",width:140,align:"center",render:r=>r.isAcquisition||"-"},
  {key:"investmentType",title:"投资类型",width:130,align:"center",render:r=>r.investmentType||"-"},
  {key:"operation",title:"操作",width:180,align:"center",render:r=>`<a class="link" onclick="openOperationLeaseDetail('${escapeAttr(r.productionProjectNo)}')">详情</a>　<a class="link" onclick="showToast('编辑：${r.projectName}')">编辑</a>　<a class="link" onclick="showToast('推送至报账：${r.projectName}')">推送至报账</a>`}
];

function operationLeaseUnique(key){
  return [...new Set(operationLeaseReportData.map(item=>item[key]).filter(Boolean))];
}

function getOperationCurrentData(){
  return operationLeaseReportState.bizType==="投资-基建项目"?operationInfraReportData:operationLeaseReportData;
}

function operationCurrentUnique(key){
  return [...new Set(getOperationCurrentData().map(item=>item[key]).filter(Boolean))];
}

function renderOperationOptions(values,selected=""){
  return `<option value="">全部</option>${values.map(value=>`
    <option value="${escapeAttr(value)}" ${value===selected?"selected":""}>${value}</option>
  `).join("")}`;
}

function renderOperationInput(id,label,value,placeholder="请输入"){
  return `
    <div class="form-item">
      <label>${label}</label>
      <input id="${id}" class="input" value="${escapeAttr(value)}" placeholder="${placeholder}"/>
    </div>
  `;
}

function renderOperationSelect(id,label,values,value){
  return `
    <div class="form-item">
      <label>${label}</label>
      <select id="${id}" class="select">
        ${renderOperationOptions(values,value)}
      </select>
    </div>
  `;
}

function operationReadonlyField(label,value,required=false,wide=false){
  return `
    <div class="operation-detail-field ${wide?"wide":""}">
      <label>${label}${required?` <span>*</span>`:""}</label>
      <div class="operation-detail-value">${value || "请选择"}</div>
    </div>
  `;
}

function operationRadioField(label,value){
  return `
    <div class="operation-detail-field">
      <label>${label} <span>*</span></label>
      <div class="operation-detail-radio">
        <span class="${value==="是"?"checked":""}">○ 是</span>
        <span class="${value==="否"?"checked":""}">○ 否</span>
      </div>
    </div>
  `;
}

function renderOperationDetailSection(title,body,extra=""){
  return `
    <section class="operation-detail-section">
      <div class="operation-detail-section-hd">
        <div class="operation-detail-section-title">${title}</div>
        ${extra}
      </div>
      ${body}
    </section>
  `;
}

function openOperationLeaseDetail(projectNo){
  const item=[...operationLeaseReportData,...operationInfraReportData].find(r=>r.productionProjectNo===projectNo);
  if(!item)return showToast("未找到生产项目详情");

  const mdmInfo=`
    <div class="operation-mdm-card">
      <div class="operation-mdm-title-row">
        <strong>${item.projectName}</strong>
        ${tag(item.orderType || "备案制订单","green")}
      </div>
      <div class="operation-mdm-line">
        <span>订单项目编号：${item.relatedOrderProject || "-"}</span>
        <span>子公司：${item.subCompany || "-"}</span>
        <span>子公司管理单位：${item.managementUnit || "-"}</span>
        <span>业主单位：${item.ownerUnit || "-"}</span>
      </div>
      <div class="operation-mdm-metrics">
        <div><label>订单项目类型</label><strong>${item.orderProjectType || "-"}</strong></div>
        <div><label>区域市场</label><strong>${item.regionalMarket || "-"}</strong></div>
        <div><label>中标日期</label><strong>${item.bidDate || "-"}</strong></div>
        <div><label>中标价（预估价）（元）</label><strong>${item.bidPriceYuan || "-"}</strong></div>
      </div>
    </div>
  `;

  const baseInfo=`
    <div class="operation-detail-grid">
      ${operationReadonlyField("项目名称",item.projectName,true,true)}
      ${operationReadonlyField("项目简称",item.projectName.slice(0,18),false)}
      ${operationReadonlyField("子公司项目编号",item.productionProjectNo,true)}
      ${operationReadonlyField("核算项目编号",item.orderProjectNo || item.accountingProjectNo,false)}
      ${operationReadonlyField("子公司管理单位",item.managementUnit,true)}
      ${operationReadonlyField("子公司法人单位",item.legalUnit,false)}
      ${operationReadonlyField("子公司基层单位",item.baseUnit,false)}
      ${operationReadonlyField("项目经理部",item.projectDept || "请选择",false)}
      ${operationReadonlyField("项目经理（合同）",item.contractManager || "请选择",false)}
      ${operationReadonlyField("中标日期",item.startDate,true)}
      ${operationReadonlyField("合同签约价（元）",item.contractPriceYuan,true)}
      ${operationReadonlyField("项目造价（元）",item.projectCostYuan,true)}
      ${operationReadonlyField("业务分类",item.businessCategory,true)}
      ${operationReadonlyField("业务板块",item.businessSector,true)}
      ${operationReadonlyField("业务板块二级",item.businessSectorLevel2,true)}
      ${operationReadonlyField("业务板块三级",item.businessSectorLevel3,true)}
      ${operationReadonlyField("所属核心区域",item.coreArea || "请选择",false)}
      ${operationReadonlyField("所属核心城市",item.coreCity || "请选择",false)}
      ${operationReadonlyField("国家",item.country,true)}
      ${operationReadonlyField("省市区",item.provinceCity || "请选择省市",false)}
      ${operationReadonlyField("项目地址",item.projectAddress,true)}
      ${operationReadonlyField("币种",item.currency,true)}
      ${operationReadonlyField("结算上报金额（元）",item.settlementReportedAmount,false)}
      ${operationRadioField("是否集团一体化管理模式项目",item.groupIntegratedMode)}
    </div>
  `;

  const leaseBizInfo=`
    <div class="operation-detail-grid">
      ${operationReadonlyField("业务类型",item.businessType,true)}
      ${operationReadonlyField("承租人性质/买方性质",item.lesseeBuyerNature,true)}
      ${operationReadonlyField("项目金额（亿元）",item.projectAmountBillion,true)}
      ${operationReadonlyField("手续费",item.serviceFeeYuan,false)}
      ${operationReadonlyField("全项目XIRR（税前）",item.projectXirrBeforeTax,false)}
      ${operationReadonlyField("自有资金XIRR（税后）",item.ownFundXirrAfterTax,false)}
      ${operationReadonlyField("项目ROE（静态）",item.roe || "请输入",false)}
      ${operationReadonlyField("项目净利润",item.profit || "0.0000",false)}
      ${operationReadonlyField("期限/保理期限",item.term,true)}
      ${operationReadonlyField("项目来源",item.source,true)}
      ${operationReadonlyField("租赁物",item.leaseObject || "请输入",false)}
      ${operationReadonlyField("增信措施",item.creditEnhancement,true)}
      ${operationReadonlyField("业务起始日",item.startDate,true)}
      ${operationReadonlyField("业务到期日",item.endDate,true)}
      ${operationReadonlyField("放款落地时间",item.loanRegisterTime,true)}
      ${operationReadonlyField("当前风险资产分类",item.riskClass,true)}
      ${operationRadioField("是否涉房",item.isRealEstate)}
      ${operationRadioField("承租人主涉房",item.lesseeRealEstate)}
      ${operationRadioField("担保人主涉房",item.guarantorRealEstate)}
      ${operationReadonlyField("涉房收入金额",item.realEstateIncome,true)}
      ${operationReadonlyField("项目状态",item.projectStatus,true)}
      ${operationReadonlyField("是否经营性租赁",item.operatingLease,true)}
      ${operationReadonlyField("项目模式",item.projectMode,true)}
      ${operationReadonlyField("项目总投",item.totalInvestment,true)}
    </div>
  `;
  const infraBizInfo=`
    <div class="operation-detail-grid">
      ${operationReadonlyField("终审金额（元）",item.finalReviewAmountYuan || "0.00",false)}
      ${operationReadonlyField("实际开工日期",item.actualStartDate || "请选择",true)}
      ${operationReadonlyField("实际完工日期",item.actualFinishDate || "请选择",false)}
      ${operationReadonlyField("结算上报日期",item.settlementReportDate || "请选择",false)}
      ${operationReadonlyField("最终审定日期",item.finalAuditDate || "请选择",false)}
      ${operationReadonlyField("结算状态",item.settlementStatus || "未完工",true)}
      ${operationReadonlyField("项目所在地",item.projectLocation || "请选择",true)}
      ${operationReadonlyField("项目投资主体名称【内部、外部】",item.investmentEntityName || "请选择",true)}
      ${operationReadonlyField("项目公司股权结构",item.projectCompanyEquity || "请输入",true)}
      ${operationReadonlyField("使用者付费占比",item.userPaymentRatio || "0.0000",true)}
      ${operationReadonlyField("己方投资比例",item.ownInvestmentRatio || "0.0000",true)}
      ${operationReadonlyField("支付费用来源",item.feeSource || "请选择",false)}
      ${operationReadonlyField("支付费用类别",item.feeCategory || "请选择",false)}
      ${operationReadonlyField("收入来源",item.incomeSource || "请选择",false)}
      ${operationReadonlyField("初始资金收益率",item.initialCapitalReturnRate || "0.0000",true)}
      ${operationReadonlyField("总包下浮部分收益率-留存上海基建",item.shInfraRetentionReturn || "0.0000",true)}
      ${operationReadonlyField("总包下浮部分收益率-留存总包",item.contractorRetentionReturn || "0.0000",true)}
      ${operationReadonlyField("施工下浮率",item.constructionDiscountRate || "0.0000",true)}
      ${operationReadonlyField("项目类型",item.projectType || "请选择",false)}
      ${operationReadonlyField("项目状态",item.projectStatus || "请选择",true)}
      ${operationRadioField("是否收并购项目",item.isAcquisition || "否")}
      ${operationReadonlyField("投资类型",item.investmentType || "请选择",true)}
      ${operationReadonlyField("子公司副经理/负责人（常务）",item.infraExecutiveManager || "请选择",false)}
    </div>
  `;
  const bizInfo=item.projectBizType==="投资-基建项目"?infraBizInfo:leaseBizInfo;

  openModal("项目详情",`
    <div class="operation-detail-page">
      ${renderOperationDetailSection("MDM项目信息",mdmInfo)}
      ${renderOperationDetailSection("项目基础信息",baseInfo,`<div class="operation-current-type">当前选择业态：${tag(item.projectBizType || "投资-租赁及保理","orange")}</div>`)}
      ${renderOperationDetailSection("项目业态信息",bizInfo)}
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

function getOperationLeaseFilteredData(){
  const s=operationLeaseReportState;
  if(!["投资-租赁及保理","投资-基建项目"].includes(s.bizType))return [];
  return getOperationCurrentData().filter(item=>{
    if(s.relationStatus!=="all"&&item.relationStatus!==s.relationStatus)return false;
    if(s.pushStatus&&item.pushStatus!==s.pushStatus)return false;
    if(s.projectName&&!item.projectName.includes(s.projectName))return false;
    if(s.org&&item.org!==s.org)return false;
    if(s.projectManager&&(item.executiveProjectManager||item.projectManager)!==s.projectManager)return false;
    if(s.productionProjectNo&&!item.productionProjectNo.includes(s.productionProjectNo))return false;
    if(s.subProjectNo&&!item.subProjectNo.includes(s.subProjectNo))return false;
    if(s.createMode&&item.createMode!==s.createMode)return false;
    if(s.managementUnit&&item.managementUnit!==s.managementUnit)return false;
    if(s.orderProjectNo&&!item.orderProjectNo.includes(s.orderProjectNo))return false;
    if(s.accountingProjectNo&&!item.accountingProjectNo.includes(s.accountingProjectNo))return false;
    if(s.businessType&&item.businessType!==s.businessType)return false;
    if(s.lesseeBuyerNature&&item.lesseeBuyerNature!==s.lesseeBuyerNature)return false;
    if(s.source&&item.source!==s.source)return false;
    if(s.isRealEstate&&item.isRealEstate!==s.isRealEstate)return false;
    if(s.projectStatus&&item.projectStatus!==s.projectStatus)return false;
    if(s.operatingLease&&item.operatingLease!==s.operatingLease)return false;
    if(s.projectMode&&item.projectMode!==s.projectMode)return false;
    if(s.isAcquisition&&item.isAcquisition!==s.isAcquisition)return false;
    if(s.projectType&&item.projectType!==s.projectType)return false;
    if(s.feeSource&&item.feeSource!==s.feeSource)return false;
    if(s.feeCategory&&item.feeCategory!==s.feeCategory)return false;
    if(s.incomeSource&&item.incomeSource!==s.incomeSource)return false;
    if(s.investmentType&&item.investmentType!==s.investmentType)return false;
    return true;
  });
}

function getOperationLeaseBaseFilteredData(){
  const oldRelationStatus=operationLeaseReportState.relationStatus;
  const oldCreateMode=operationLeaseReportState.createMode;
  const oldPushStatus=operationLeaseReportState.pushStatus;
  operationLeaseReportState.relationStatus="all";
  operationLeaseReportState.createMode="";
  operationLeaseReportState.pushStatus="";
  const list=getOperationLeaseFilteredData();
  operationLeaseReportState.relationStatus=oldRelationStatus;
  operationLeaseReportState.createMode=oldCreateMode;
  operationLeaseReportState.pushStatus=oldPushStatus;
  return list;
}

function getOperationBizCount(type){
  if(type==="投资-租赁及保理")return operationLeaseReportData.length;
  if(type==="投资-基建项目")return operationInfraReportData.length;
  return 0;
}

function renderOperationBizTree(){
  return operationBusinessTypes.map(type=>`
    <div class="org-tree-node ${operationLeaseReportState.bizType===type?"active":""}" onclick="selectOperationBizType('${escapeAttr(type)}')">
      <div class="org-node-left">
        <span class="org-node-icon">📁</span>
        <span class="org-node-name">${type}（${getOperationBizCount(type)}条）</span>
      </div>
    </div>
  `).join("");
}

function selectOperationBizType(type){
  operationLeaseReportState.bizType=type;
  renderOperationProductionProjectReportPage();
}

function queryOperationLeaseReport(){
  operationLeaseReportState.projectName=document.getElementById("opProjectName")?.value.trim()||"";
  operationLeaseReportState.projectManager=document.getElementById("opProjectManager")?.value||"";
  operationLeaseReportState.productionProjectNo=document.getElementById("opProductionProjectNo")?.value.trim()||"";
  operationLeaseReportState.subProjectNo=document.getElementById("opSubProjectNo")?.value.trim()||"";
  operationLeaseReportState.createMode=document.getElementById("opCreateMode")?.value||"";
  operationLeaseReportState.managementUnit=document.getElementById("opManagementUnit")?.value||"";
  operationLeaseReportState.orderProjectNo=document.getElementById("opOrderProjectNo")?.value.trim()||"";
  operationLeaseReportState.accountingProjectNo=document.getElementById("opAccountingProjectNo")?.value.trim()||"";
  operationLeaseReportState.businessType=document.getElementById("opBusinessType")?.value||"";
  operationLeaseReportState.lesseeBuyerNature=document.getElementById("opLesseeBuyerNature")?.value||"";
  operationLeaseReportState.source=document.getElementById("opSource")?.value||"";
  operationLeaseReportState.isRealEstate=document.getElementById("opIsRealEstate")?.value||"";
  operationLeaseReportState.projectStatus=document.getElementById("opProjectStatus")?.value||"";
  operationLeaseReportState.operatingLease=document.getElementById("opOperatingLease")?.value||"";
  operationLeaseReportState.projectMode=document.getElementById("opProjectMode")?.value||"";
  operationLeaseReportState.isAcquisition=document.getElementById("opIsAcquisition")?.value||"";
  operationLeaseReportState.projectType=document.getElementById("opProjectType")?.value||"";
  operationLeaseReportState.feeSource=document.getElementById("opFeeSource")?.value||"";
  operationLeaseReportState.feeCategory=document.getElementById("opFeeCategory")?.value||"";
  operationLeaseReportState.incomeSource=document.getElementById("opIncomeSource")?.value||"";
  operationLeaseReportState.investmentType=document.getElementById("opInvestmentType")?.value||"";
  renderOperationProductionProjectReportPage();
}

function resetOperationLeaseReport(){
  operationLeaseReportState.relationStatus="all";
  operationLeaseReportState.pushStatus="";
  operationLeaseReportState.projectName="";
  operationLeaseReportState.org="";
  operationLeaseReportState.projectManager="";
  operationLeaseReportState.productionProjectNo="";
  operationLeaseReportState.subProjectNo="";
  operationLeaseReportState.createMode="";
  operationLeaseReportState.managementUnit="";
  operationLeaseReportState.orderProjectNo="";
  operationLeaseReportState.accountingProjectNo="";
  operationLeaseReportState.businessType="";
  operationLeaseReportState.lesseeBuyerNature="";
  operationLeaseReportState.source="";
  operationLeaseReportState.isRealEstate="";
  operationLeaseReportState.projectStatus="";
  operationLeaseReportState.operatingLease="";
  operationLeaseReportState.projectMode="";
  operationLeaseReportState.isAcquisition="";
  operationLeaseReportState.projectType="";
  operationLeaseReportState.feeSource="";
  operationLeaseReportState.feeCategory="";
  operationLeaseReportState.incomeSource="";
  operationLeaseReportState.investmentType="";
  renderOperationProductionProjectReportPage();
}

function setOperationLeaseRelationStatus(status){
  operationLeaseReportState.relationStatus=status;
  renderOperationProductionProjectReportPage();
}

function setOperationLeaseCreateMode(mode){
  operationLeaseReportState.createMode=mode;
  renderOperationProductionProjectReportPage();
}

function setOperationLeasePushStatus(status){
  operationLeaseReportState.pushStatus=status;
  renderOperationProductionProjectReportPage();
}

function renderOperationLeaseQueryCard(){
  const s=operationLeaseReportState;
  const fieldsHtml=[
    renderOperationInput("opProjectName","生产项目名称",s.projectName,"请输入生产项目名称"),
    renderOperationSelect("opProjectManager","常务项目经理",operationLeaseUnique("executiveProjectManager"),s.projectManager),
    renderOperationInput("opProductionProjectNo","生产项目编号",s.productionProjectNo,"请输入生产项目编号"),
    renderOperationInput("opSubProjectNo","子公司项目编号",s.subProjectNo,"请输入子公司项目编号"),
    renderOperationSelect("opCreateMode","创建模式",operationLeaseUnique("createMode"),s.createMode),
    renderOperationSelect("opManagementUnit","子公司管理单位",operationLeaseUnique("managementUnit"),s.managementUnit),
    renderOperationSelect("opBusinessType","业务类型",operationLeaseUnique("businessType"),s.businessType),
    renderOperationSelect("opLesseeBuyerNature","承租人性质/买方性质",operationLeaseUnique("lesseeBuyerNature"),s.lesseeBuyerNature),
    renderOperationSelect("opSource","项目来源",operationLeaseUnique("source"),s.source),
    renderOperationSelect("opIsRealEstate","是否涉房",["是","否"],s.isRealEstate),
    renderOperationSelect("opProjectStatus","项目状态",operationProjectStatusOptions,s.projectStatus),
    renderOperationSelect("opOperatingLease","是否经营性租赁",["是","否"],s.operatingLease),
    renderOperationSelect("opProjectMode","项目模式",operationLeaseUnique("projectMode"),s.projectMode),
    renderOperationInput("opOrderProjectNo","订单项目编号",s.orderProjectNo,"请输入订单项目编号"),
    renderOperationInput("opAccountingProjectNo","核算项目编号",s.accountingProjectNo,"请输入核算项目编号")
  ].join("");
  return renderUnifiedQueryCard(fieldsHtml,{
    id:"operationLeaseQueryCard",
    resetFn:"resetOperationLeaseReport()",
    queryFn:"queryOperationLeaseReport()"
  });
}

function renderOperationInfraQueryCard(){
  const s=operationLeaseReportState;
  const fieldsHtml=[
    renderOperationInput("opProjectName","生产项目名称",s.projectName,"请输入生产项目名称"),
    renderOperationSelect("opProjectManager","常务项目经理",operationCurrentUnique("executiveProjectManager"),s.projectManager),
    renderOperationInput("opProductionProjectNo","生产项目编号",s.productionProjectNo,"请输入生产项目编号"),
    renderOperationInput("opSubProjectNo","子公司项目编号",s.subProjectNo,"请输入子公司项目编号"),
    renderOperationSelect("opCreateMode","创建模式",operationCurrentUnique("createMode"),s.createMode),
    renderOperationSelect("opManagementUnit","子公司管理单位",operationCurrentUnique("managementUnit"),s.managementUnit),
    renderOperationSelect("opBusinessType","业务类型",operationCurrentUnique("businessType"),s.businessType),
    renderOperationSelect("opIsAcquisition","是否收并购项目",["是","否"],s.isAcquisition),
    renderOperationSelect("opProjectStatus","项目状态",operationProjectStatusOptions,s.projectStatus),
    renderOperationSelect("opProjectType","项目类型",operationCurrentUnique("projectType"),s.projectType),
    renderOperationSelect("opFeeSource","支付费用来源",operationCurrentUnique("feeSource"),s.feeSource),
    renderOperationSelect("opFeeCategory","支付费用类别",operationCurrentUnique("feeCategory"),s.feeCategory),
    renderOperationSelect("opIncomeSource","收入来源",operationCurrentUnique("incomeSource"),s.incomeSource),
    renderOperationSelect("opInvestmentType","投资类型",operationCurrentUnique("investmentType"),s.investmentType)
  ].join("");
  return renderUnifiedQueryCard(fieldsHtml,{
    id:"operationInfraQueryCard",
    resetFn:"resetOperationLeaseReport()",
    queryFn:"queryOperationLeaseReport()"
  });
}

function renderOperationLeaseStatsCard(){
  const base=getOperationLeaseBaseFilteredData();
  const totals={
    all:base.length,
    unlinked:base.filter(item=>item.relationStatus==="unlinked").length,
    linked:base.filter(item=>item.relationStatus==="linked").length
  };
  const createTotals={
    all:base.length,
    manual:base.filter(item=>item.createMode==="手动").length,
    integrate:base.filter(item=>item.createMode==="集成").length
  };
  const pushTotals={
    all:base.length,
    success:base.filter(item=>item.pushStatus==="成功").length,
    fail:base.filter(item=>item.pushStatus==="失败").length
  };
  const chip=(active,key,label,count,fn)=>`
    <button class="stat-chip ${active===key?"active":""}" onclick="${fn}">
      <strong>${count}</strong>
      <span>${label}</span>
    </button>
  `;
  return renderUnifiedStatsCard(`
    <div class="stats">
      <div class="stat">
        <div class="stat-name">核算项目</div>
        <div class="stat-row">
          ${chip(operationLeaseReportState.relationStatus,"all","全部",totals.all,"setOperationLeaseRelationStatus('all')")}
          ${chip(operationLeaseReportState.relationStatus,"unlinked","未关联",totals.unlinked,"setOperationLeaseRelationStatus('unlinked')")}
          ${chip(operationLeaseReportState.relationStatus,"linked","已关联",totals.linked,"setOperationLeaseRelationStatus('linked')")}
        </div>
      </div>
      <div class="stat">
        <div class="stat-name">创建模式</div>
        <div class="stat-row">
          ${chip(operationLeaseReportState.createMode,"","全部",createTotals.all,"setOperationLeaseCreateMode('')")}
          ${chip(operationLeaseReportState.createMode,"手动","手动",createTotals.manual,"setOperationLeaseCreateMode('手动')")}
          ${chip(operationLeaseReportState.createMode,"集成","集成",createTotals.integrate,"setOperationLeaseCreateMode('集成')")}
        </div>
      </div>
      <div class="stat">
        <div class="stat-name">报账推送</div>
        <div class="stat-row">
          ${chip(operationLeaseReportState.pushStatus,"","全部",pushTotals.all,"setOperationLeasePushStatus('')")}
          ${chip(operationLeaseReportState.pushStatus,"成功","成功",pushTotals.success,"setOperationLeasePushStatus('成功')")}
          ${chip(operationLeaseReportState.pushStatus,"失败","失败",pushTotals.fail,"setOperationLeasePushStatus('失败')")}
        </div>
      </div>
    </div>
  `);
}

function renderOperationLeaseTable(){
  const list=getOperationLeaseFilteredData();
  renderTableByColumns("operationLeaseProject",list,"operationLeaseProjectTbody");
  const totalCount=list.length;
  const pageSize=50;
  const totalPages=Math.max(1,Math.ceil(totalCount/pageSize));
  const total=document.getElementById("operationLeaseProjectTotalText");
  const page=document.getElementById("operationLeaseProjectPageText");
  if(total)total.textContent=`共 ${totalCount} 条记录`;
  if(page)page.textContent=`第 1 / ${totalPages} 页　每页 ${pageSize} 条`;
}

function renderOperationInfraTable(){
  const list=getOperationLeaseFilteredData();
  renderTableByColumns("operationInfraProject",list,"operationInfraProjectTbody");
  const totalCount=list.length;
  const pageSize=50;
  const totalPages=Math.max(1,Math.ceil(totalCount/pageSize));
  const total=document.getElementById("operationInfraProjectTotalText");
  const page=document.getElementById("operationInfraProjectPageText");
  if(total)total.textContent=`共 ${totalCount} 条记录`;
  if(page)page.textContent=`第 1 / ${totalPages} 页　每页 ${pageSize} 条`;
}

function exportOperationLeaseReport(){
  showToast("已导出生产项目报表");
}

function renderOperationLeaseRightPanel(){
  const list=getOperationLeaseFilteredData();
  const pageSize=50;
  const totalPages=Math.max(1,Math.ceil(list.length/pageSize));
  return `
    ${renderOperationLeaseQueryCard()}
    ${renderOperationLeaseStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"operationLeaseProject",
      tbodyId:"operationLeaseProjectTbody",
      renderFnName:"renderOperationLeaseTable",
      refreshAction:"renderOperationProductionProjectReportPage()",
      exportAction:"exportOperationLeaseReport()",
      title:"生产项目列表",
      total:list.length,
      pageText:`<span id="operationLeaseProjectPageText">第 1 / ${totalPages} 页　每页 ${pageSize} 条</span>`
    })}
  `;
}

function renderOperationInfraRightPanel(){
  const list=getOperationLeaseFilteredData();
  const pageSize=50;
  const totalPages=Math.max(1,Math.ceil(list.length/pageSize));
  return `
    ${renderOperationInfraQueryCard()}
    ${renderOperationLeaseStatsCard()}
    ${renderUnifiedTableCard({
      tableKey:"operationInfraProject",
      tbodyId:"operationInfraProjectTbody",
      renderFnName:"renderOperationInfraTable",
      refreshAction:"renderOperationProductionProjectReportPage()",
      exportAction:"exportOperationLeaseReport()",
      title:"生产项目列表",
      total:list.length,
      pageText:`<span id="operationInfraProjectPageText">第 1 / ${totalPages} 页　每页 ${pageSize} 条</span>`
    })}
  `;
}

function renderOperationBizPlaceholder(){
  return `
    ${renderUnifiedQueryCard(`
      ${renderOperationInput("opPlaceholderName","项目名称","","请输入项目名称")}
      ${renderOperationInput("opPlaceholderNo","项目编号","","请输入项目编号")}
      ${renderOperationSelect("opPlaceholderStatus","项目状态",["待建","在建","停工","完工","竣工","终止"],"")}
      ${renderOperationSelect("opPlaceholderOrg","所属组织",getOrganizationPairs(8).map(pair=>pair.join("/")),"")}
    `,{
      id:"operationPlaceholderQuery",
      resetFn:"showToast('已重置')",
      queryFn:"showToast('当前业态列表待配置')",
      canCollapse:false
    })}
    <section class="card table-card">
      <div class="empty-state">当前业态的生产项目报表待配置</div>
    </section>
  `;
}

function renderOperationProductionProjectReportPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  const isLease=operationLeaseReportState.bizType==="投资-租赁及保理";
  const isInfra=operationLeaseReportState.bizType==="投资-基建项目";
  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">生产项目报表</div>
    </div>
    <div class="base-auth-layout">
      <section class="org-tree-panel">
        <div class="org-tree-hd">
          <div class="card-title">业态选择</div>
        </div>
        <div class="org-tree-body">
          ${renderOperationBizTree()}
        </div>
      </section>
      <section class="org-user-panel">
        <div class="org-user-body">
          ${isLease?renderOperationLeaseRightPanel():isInfra?renderOperationInfraRightPanel():renderOperationBizPlaceholder()}
        </div>
      </section>
    </div>
  `;

  if(isLease)renderOperationLeaseTable();
  if(isInfra)renderOperationInfraTable();
}

