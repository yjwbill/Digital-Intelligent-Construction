/* 企业管理 / 经济 / 大屏看板 */
const economyDashboardState={tab:"diagnosis",edition:"domestic",projectName:"",projectType:"",region:"",month:"2026-06",sortKey:"",sortDirection:""};
const economyDashboardOrgState={company:"",branch:""};
const economyWarningTypes=[
  {key:"subcontract",name:"分包分供等合同预警",total:19,red:7,orange:0,yellow:25,blue:0,delta:[-1,0,1,0]},
  {key:"loss",name:"潜亏预警（目标利润率负向偏差）",total:85,red:8,orange:15,yellow:117,blue:35,delta:[1,3,18,-8]},
  {key:"settlement",name:"总包结算预警",total:0,red:1,orange:4,yellow:0,blue:0,delta:[1,2,0,0]},
  {key:"arrears",name:"业主拖欠款预警",total:6,red:4,orange:40,yellow:0,blue:0,delta:[0,6,0,0]}
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
const economyDiagnosisProjects=economyProjectNames.map((projectName,index)=>({
  id:`eco-${index+1}`,projectName,projectType:economyProjectTypes[index%economyProjectTypes.length],company:economyCompanies[index%economyCompanies.length],branch:economyBranches[index%economyBranches.length],city:economyCities[index%economyCities.length],region:["华东区域","华南区域","华北区域","西南区域"][index%4],contractAmount:5539.06+index*6329.47,outputProgress:[22.23,100.5,90.39,94.66,73.43,75.62,102.73,50.98,82.73,92.92][index%10],
  warnings:{subcontract:index%3===1?"":(["red","orange","yellow","blue"][index%4]),loss:["red","red","yellow","yellow","red","orange","orange","yellow"][index%8],settlement:index%4===3?"red":index%5===4?"orange":"",arrears:index%3===0?"red":index%4===2?"orange":""},
  overdue:{subcontract:index%5===2,loss:index%4===1,settlement:index%6===3,arrears:index%5===0}
}));

function setEconomyDashboardTab(tab){renderEconomyDashboardPage(tab);}
function setEconomyDashboardEdition(edition){economyDashboardState.edition=edition==="international"?"international":"domestic";renderEconomyDashboardPage("diagnosis");}
function setEconomyDashboardOrg(selection){Object.assign(economyDashboardOrgState,selection);renderEconomyDashboardPage();}
function setEconomyDashboardFilter(key,value){economyDashboardState[key]=typeof value==="string"?value.trim():value;renderEconomyDashboardPage();}
function resetEconomyDashboardFilters(){Object.assign(economyDashboardState,{projectName:"",projectType:"",region:"",month:"2026-06"});renderEconomyDashboardPage();}
function getEconomyDiagnosisFiltered(){return economyDiagnosisProjects.filter(x=>(!economyDashboardOrgState.company||x.company===economyDashboardOrgState.company)&&(!economyDashboardOrgState.branch||x.branch===economyDashboardOrgState.branch)&&(!economyDashboardState.projectName||x.projectName.includes(economyDashboardState.projectName))&&(!economyDashboardState.projectType||x.projectType===economyDashboardState.projectType)&&(economyDashboardState.edition==="international"||!economyDashboardState.region||x.region===economyDashboardState.region));}
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
  const filters=view==="diagnosis"?`<div class="economy-dashboard-filters ${economyDashboardState.edition}"><input id="economyDashboardProject" class="input" placeholder="项目名称" value="${escapeAttr(economyDashboardState.projectName)}" onchange="setEconomyDashboardFilter('projectName',this.value)" onkeydown="if(event.key==='Enter'){this.blur()}"/><select id="economyDashboardType" class="select" onchange="setEconomyDashboardFilter('projectType',this.value)"><option value="">项目类型</option>${economyProjectTypes.map(x=>`<option ${economyDashboardState.projectType===x?'selected':''}>${x}</option>`).join('')}</select>${regionFilter}<input id="economyDashboardMonth" class="input" type="month" value="${economyDashboardState.month}" max="2026-07" onchange="setEconomyDashboardFilter('month',this.value)"/><button class="btn primary economy-dashboard-download monthly" onclick="showToast('月度检验单下载成功')"><span aria-hidden="true">⇩</span>月度检验单</button><button class="btn primary economy-dashboard-download report" onclick="openEconomyAnalysisReport()"><span aria-hidden="true">⇩</span>分析报告</button></div>`:"";
  const editionTabs=view==="diagnosis"?`<div class="screen-tabs production-screen-tabs economy-edition-tabs" role="tablist" aria-label="经济诊断版本"><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="domestic"}" class="${economyDashboardState.edition==="domestic"?"active":""}" onclick="setEconomyDashboardEdition('domestic')">国内版</button><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="international"}" class="${economyDashboardState.edition==="international"?"active":""}" onclick="setEconomyDashboardEdition('international')">国际版</button></div>`:"";
  return `<div class="safety-screen-header economy-screen-header"><div class="screen-brand"><span class="screen-logo">P</span><strong>数智施工项目经济管理平台</strong></div>${editionTabs}${filters}</div>`;
}
function renderEconomyOrgSwitch(){return DashboardOrgSwitch.render({id:"economy-dashboard-org",records:economyDiagnosisProjects,state:economyDashboardOrgState,onChange:setEconomyDashboardOrg});}
function renderEconomyWarningMark(color,overdue){return color?`<span class="economy-warning-mark ${color} ${overdue?'overdue':''}"></span>`:"";}
function renderEconomyProjectTypeTag(value){
  const rows=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.PROJECT_TYPE||[]):[];
  const row=rows.find(item=>item.name===value);
  const palettes=typeof dataDictionaryPaletteV2284!=="undefined"?dataDictionaryPaletteV2284:[];
  const palette=palettes[Number(row?.palette)]||palettes[0];
  return palette?`<span class="dict-value-name" style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${value}</span>`:tag(value,"blue");
}
function renderEconomyDiagnosisMetrics(list){const contract=list.reduce((sum,x)=>sum+x.contractAmount,0);const counts={red:0,orange:0,yellow:0,blue:0};list.forEach(row=>Object.values(row.warnings).forEach(color=>{if(color)counts[color]++;}));const items=[{label:"项目总数",value:list.length,unit:"个",icon:"▣",color:"blue"},{label:"合同总金额",value:(contract/10000).toFixed(4),unit:"亿元",icon:"￥",color:"orange"},...[ ["红色预警项目",counts.red,"个","红","red"],["橙色预警项目",counts.orange,"个","橙","orange"],["黄色预警项目",counts.yellow,"个","黄","yellow"],["蓝色预警项目",counts.blue,"个","蓝","blue"] ].map(([label,value,unit,icon,color])=>({label,value,unit,icon,color}))];return `<section class="production-value-top-strip economy-diagnosis-metrics">${items.map(item=>`<div class="production-value-metric economy-diagnosis-metric ${item.color}"><span class="production-value-icon">${item.icon}</span><div><p>${item.label}</p><strong>${item.value}<em>${item.unit}</em></strong></div></div>`).join('')}</section>`;}
function getEconomyWarningDisplayName(type,forCard=false){if(economyDashboardState.edition==="international"){if(type.key==="subcontract")return "目标成本预警";if(type.key==="loss")return "目标利润率预警";}return forCard&&type.key==="loss"?`潜亏预警<span class="economy-warning-subtitle">（目标利润率负向偏差）</span>`:type.name;}
function renderEconomyWarningCards(){return `<section class="economy-warning-card-grid">${economyWarningTypes.map(type=>`<article class="economy-warning-card"><h3>${getEconomyWarningDisplayName(type,true)}<b>${type.total}</b></h3><div class="economy-warning-card-values">${[[type.red,type.delta[0],"red"],[type.orange,type.delta[1],"orange"],[type.yellow,type.delta[2],"yellow"],[type.blue,type.delta[3],"blue"]].map(([value,delta,color])=>`<div class="${color}"><strong>${value}</strong><span>${delta>0?'+':''}${delta}</span></div>`).join('')}</div></article>`).join('')}</section>`;}
tableColumnDefinitions.economyDiagnosis=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,index)=>index+1},
  {key:"projectType",title:"项目类型",width:100,align:"center",render:x=>renderEconomyProjectTypeTag(x.projectType)},
  {key:"projectName",title:"项目名称",width:210,align:"left",render:x=>`<div class="economy-project-name-cell"><a class="link" title="${escapeAttr(x.projectName)}">${x.projectName}</a></div>`},
  {key:"organization",title:"子公司/分公司（项管部）",width:190,align:"center",render:x=>`${x.company}/${x.branch}`},
  {key:"contractAmount",title:"合同金额（万元）",width:140,align:"center",sortable:true,render:x=>x.contractAmount.toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2})},
  {key:"outputProgress",title:"产值进度",width:110,align:"center",sortable:true,render:x=>`${x.outputProgress.toFixed(2)}%`},
  ...economyWarningTypes.map(type=>({key:type.key,title:type.name,width:165,align:"center",sortable:true,render:x=>renderEconomyWarningMark(x.warnings[type.key],x.overdue[type.key])}))
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
  const columns=getVisibleColumns("economyDiagnosis");
  const card=renderUnifiedTableCard({
    title:"经济诊断项目清单",
    className:"economy-diagnosis-table-card",
    tableKey:"economyDiagnosis",
    tableId:"economyDiagnosisTable",
    theadId:"economyDiagnosisThead",
    tbodyId:"economyDiagnosisTbody",
    totalId:"economyDiagnosisTotal",
    total:sortedList.length,
    renderFnName:"renderEconomyDashboardPage",
    refreshAction:"renderEconomyDashboardPage('diagnosis');showToast('经济诊断项目清单已刷新')",
    exportAction:"showToast('导出成功：经济诊断项目清单.xlsx')"
  });
  return card.replace(`<tr id="economyDiagnosisThead">${renderTableHeaderByColumns("economyDiagnosis")}</tr>`,`<tr id="economyDiagnosisThead">${columns.map(column=>renderEconomyDiagnosisSortHeader(column,columns)).join("")}</tr>`).replace('<tbody id="economyDiagnosisTbody"></tbody>',`<tbody id="economyDiagnosisTbody">${sortedList.map((row,index)=>`<tr>${columns.map(column=>`<td class="${getTableColumnClass("economyDiagnosis",column,columns)}" data-column-key="${escapeAttr(column.key)}" style="${getTableColumnStickyStyle("economyDiagnosis",column,columns)}width:${column.width}px;min-width:${column.width}px;max-width:${column.width}px;text-align:${column.align||"left"}">${column.render(row,index)}</td>`).join("")}</tr>`).join("")}</tbody>`);
}
function renderEconomyOverview(){return `<section class="card economy-overview-placeholder"><div class="card-hd"><div class="card-title">经济总览</div></div><div class="economy-overview-note">经济总览功能建设中</div></section>`;}
function renderEconomyDashboardPage(view="diagnosis"){
  economyDashboardState.tab=view==="overview"?"overview":"diagnosis";
  detailPage.style.display="none";
  listPage.style.display="flex";
  const diagnosis=economyDashboardState.tab==="diagnosis";
  const list=diagnosis?getEconomyDiagnosisFiltered():[];
  listPage.innerHTML=`<div class="safety-screen-page economy-dashboard-page">${renderEconomyDashboardHeader(economyDashboardState.tab)}<div class="economy-dashboard-content">${diagnosis?`${renderEconomyOrgSwitch()}<div class="economy-dashboard-body">${renderEconomyDiagnosisMetrics(list)}${renderEconomyWarningCards()}${renderEconomyDiagnosisTable(list)}</div>`:`<div class="economy-dashboard-body">${renderEconomyOverview()}</div>`}</div></div>`;
}
