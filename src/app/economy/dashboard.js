/* 企业管理 / 经济 / 大屏看板 */
const economyDashboardState={tab:"diagnosis",edition:"domestic",projectName:"",projectType:"",region:"",month:"2026-06",sortKey:"",sortDirection:"",page:1,pageSize:50};
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
  const filters=view==="diagnosis"?`<div class="economy-dashboard-filters ${economyDashboardState.edition}"><input id="economyDashboardProject" class="input" placeholder="项目名称" value="${escapeAttr(economyDashboardState.projectName)}" onchange="setEconomyDashboardFilter('projectName',this.value)" onkeydown="if(event.key==='Enter'){this.blur()}"/><select id="economyDashboardType" class="select" onchange="setEconomyDashboardFilter('projectType',this.value)"><option value="">项目类型</option>${economyProjectTypes.map(x=>`<option ${economyDashboardState.projectType===x?'selected':''}>${x}</option>`).join('')}</select>${regionFilter}<input id="economyDashboardMonth" class="input" type="month" value="${economyDashboardState.month}" max="2026-07" onchange="setEconomyDashboardFilter('month',this.value)"/><button class="btn primary economy-dashboard-download monthly" onclick="showToast('月度检验单下载成功')"><span aria-hidden="true">⇩</span>月度检验单</button><button class="btn primary economy-dashboard-download report" onclick="openEconomyAnalysisReport()"><span aria-hidden="true">⇩</span>分析报告</button></div>`:"";
  const editionTabs=view==="diagnosis"?`<div class="screen-tabs production-screen-tabs economy-edition-tabs" role="tablist" aria-label="经济诊断版本"><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="domestic"}" class="${economyDashboardState.edition==="domestic"?"active":""}" onclick="setEconomyDashboardEdition('domestic')">国内版</button><button type="button" role="tab" aria-selected="${economyDashboardState.edition==="international"}" class="${economyDashboardState.edition==="international"?"active":""}" onclick="setEconomyDashboardEdition('international')">国际版</button></div>`:"";
  return `<div class="safety-screen-header economy-screen-header"><div class="screen-brand"><span class="screen-logo">P</span><strong>数智施工项目经济管理平台</strong></div>${editionTabs}${filters}</div>`;
}
function renderEconomyOrgSwitch(){return DashboardOrgSwitch.render({id:"economy-dashboard-org",records:getEconomyEditionProjects(),state:economyDashboardOrgState,onChange:setEconomyDashboardOrg});}
function renderEconomyWarningMark(color,overdue){return color?`<span class="economy-warning-mark ${color} ${overdue?'overdue':''}"></span>`:"";}
function renderEconomyProjectTypeTag(value){
  const rows=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.PROJECT_TYPE||[]):[];
  const row=rows.find(item=>item.name===value);
  const palettes=typeof dataDictionaryPaletteV2284!=="undefined"?dataDictionaryPaletteV2284:[];
  const palette=palettes[Number(row?.palette)]||palettes[0];
  return palette?`<span class="dict-value-name" style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${value}</span>`:tag(value,"blue");
}
function openEconomyDiagnosisProjectOverview(projectId){
  const project=typeof constructionProjectData!=="undefined"?constructionProjectData.find(item=>String(item.id)===String(projectId)):null;
  if(!project)return showToast("未找到项目经济数据");
  window.__economyProjectOverviewEmbedProject=project;
  openModal(`经济总览 - ${project.projectName}`,`<div id="economyProjectOverviewEmbed" class="economy-project-overview-embed">${renderProjectEconomyOverviewContent(project)}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("economy-project-overview-modal");
  toggleModalFullscreen();
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
  const summaryItems=[{label:"项目总数",value:list.length,unit:"个",icon:"▣",color:"blue"},{label:"合同总金额",value:(contract/10000).toFixed(4),unit:"亿元",icon:"￥",color:"orange"}];
  const renderItem=item=>`<div class="production-value-metric economy-diagnosis-metric ${item.color} ${item.warning?"warning-clickable":""}">${item.warning?"":`<span class="production-value-icon">${item.icon}</span>`}<div><p>${item.label}</p>${item.warning?renderEconomyWarningMetricValue(item,list.length):`<strong>${item.value}<em>${item.unit}</em></strong>`}</div></div>`;
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
function getEconomyWarningDisplayName(type,forCard=false){if(economyDashboardState.edition==="international"){if(type.key==="subcontract")return "目标成本预警";if(type.key==="loss")return "目标利润率预警";}return forCard&&type.key==="loss"?`潜亏预警<span class="economy-warning-subtitle">（目标利润率负向偏差）</span>`:type.name;}
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
function renderEconomyOverview(){return `<section class="card economy-overview-placeholder"><div class="card-hd"><div class="card-title">经济总览</div></div><div class="economy-overview-note">经济总览功能建设中</div></section>`;}
function renderEconomyDashboardPage(view="diagnosis"){
  economyDashboardState.tab=view==="overview"?"overview":"diagnosis";
  detailPage.style.display="none";
  listPage.style.display="flex";
  const diagnosis=economyDashboardState.tab==="diagnosis";
  const list=diagnosis?getEconomyDiagnosisFiltered():[];
  listPage.innerHTML=`<div class="safety-screen-page economy-dashboard-page">${renderEconomyDashboardHeader(economyDashboardState.tab)}<div class="economy-dashboard-content">${diagnosis?`${renderEconomyOrgSwitch()}<div class="economy-dashboard-body">${renderEconomyDiagnosisMetrics(list)}${renderEconomyWarningCards(list)}${renderEconomyDiagnosisTable(list)}</div>`:`<div class="economy-dashboard-body">${renderEconomyOverview()}</div>`}</div></div>`;
}
