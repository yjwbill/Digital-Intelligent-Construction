const economyMonthlyCheckMeta={
  red:{label:"红色预警",className:"red"},
  orange:{label:"橙色预警",className:"orange"},
  yellow:{label:"黄色预警",className:"yellow"},
  blue:{label:"蓝色预警",className:"blue"}
};

const economyMonthlyCheckColumns=[
  {key:"contractLevel",label:"一级预警",group:"分包分供等合同预警",source:"subcontract"},
  {key:"contractQuota",label:"合同额度",group:"分包分供等合同预警",source:"subcontract"},
  {key:"laborCount",label:"主体劳务合同个数",group:"分包分供等合同预警",source:"subcontract"},
  {key:"professionalCount",label:"主体专业合同个数",group:"分包分供等合同预警",source:"subcontract"},
  {key:"inventory",label:"资金存货关联",group:"分包分供等合同预警",source:"subcontract"},
  {key:"measurement",label:"分包商计量额超合同",group:"分包分供等合同预警",source:"subcontract"},
  {key:"concrete",label:"砼",group:"分包分供等合同预警",source:"subcontract"},
  {key:"steel",label:"钢材",group:"分包分供等合同预警",source:"subcontract"},
  {key:"cement",label:"水泥",group:"分包分供等合同预警",source:"subcontract"},
  {key:"pipe",label:"钢管",group:"分包分供等合同预警",source:"subcontract"},
  {key:"pv",label:"光伏板",group:"分包分供等合同预警",source:"subcontract"},
  {key:"lossLevel",label:"一级预警",group:"潜亏预警（目标利润率负向偏差）",source:"loss"},
  {key:"managementFee",label:"项目管理费",group:"潜亏预警（目标利润率负向偏差）",source:"loss"},
  {key:"vat",label:"增值税税负",group:"潜亏预警（目标利润率负向偏差）",source:"loss"},
  {key:"schedule",label:"工期异常",group:"潜亏预警（目标利润率负向偏差）",source:"loss"},
  {key:"labor",label:"劳务工异常",group:"潜亏预警（目标利润率负向偏差）",source:"loss"},
  {key:"settlementLevel",label:"一级预警",group:"总包结算预警",source:"settlement"},
  {key:"settlementPrice",label:"上报结算价",group:"总包结算预警",source:"settlement"},
  {key:"draftOverdue",label:"结算上报初稿超期",group:"总包结算预警",source:"settlement"},
  {key:"dataOverdue",label:"结算上报数据超期",group:"总包结算预警",source:"settlement"},
  {key:"arrearsLevel",label:"一级预警",group:"业主拖欠款预警",source:"arrears"},
  {key:"arrearsAmount",label:"金额预警",group:"业主拖欠款预警",source:"arrears"},
  {key:"arrearsAge",label:"账龄预警",group:"业主拖欠款预警",source:"arrears"}
];

const economyMonthlyCheckInternationalColumns=[
  {key:"targetCostLevel",label:"一级预警",group:"目标成本预警",source:"subcontract"},
  {key:"targetCostQuota",label:"目标成本额度预警（cost清单额度预警）",group:"目标成本预警",source:"subcontract"},
  {key:"targetProfitLevel",label:"一级预警",group:"目标利润率预警",source:"loss"},
  {key:"funds",label:"资金预警",group:"目标利润率预警",source:"loss"},
  {key:"subcontractMeasurement",label:"分包合同产值计量预警",group:"目标利润率预警",source:"loss"},
  {key:"materialOverdraw",label:"主材超领预警（钢材、砼、水泥）",group:"目标利润率预警",source:"loss"},
  {key:"scheduleAbnormal",label:"工期异常预警",group:"目标利润率预警",source:"loss"},
  {key:"settlementLevel",label:"一级预警",group:"结算预警",source:"settlement"},
  {key:"settlementAmount",label:"结算金额预警",group:"结算预警",source:"settlement"},
  {key:"settlementCycle",label:"结算周期预警",group:"结算预警",source:"settlement"},
  {key:"arrearsLevel",label:"一级预警",group:"拖欠款预警",source:"arrears"},
  {key:"arrearsAmount",label:"拖欠款金额预警",group:"拖欠款预警",source:"arrears"},
  {key:"arrearsAge",label:"拖欠款账龄预警",group:"拖欠款预警",source:"arrears"}
];

function isEconomyMonthlyCheckInternational(){return economyDashboardState.edition==="international";}
function getEconomyMonthlyCheckColumns(){return isEconomyMonthlyCheckInternational()?economyMonthlyCheckInternationalColumns:economyMonthlyCheckColumns;}
function getEconomyMonthlyCheckTableWidth(){return Math.round(740+1571/23*getEconomyMonthlyCheckColumns().length);}

function getEconomyMonthlyCheckSeed(row,index){
  return Number(row.sourceProjectId)||Number(String(row.id||"").replace(/\D/g,""))||index+1;
}

function getEconomyMonthlyCheckCell(row,column,index){
  const columns=getEconomyMonthlyCheckColumns();
  const rowSeed=getEconomyMonthlyCheckSeed(row,index);
  const seed=rowSeed+columns.indexOf(column)*3;
  const baseColor=rowSeed%3===0?"":(row.warnings?.[column.source]||"");
  const isLevel=column.key.endsWith("Level");
  const unavailable=!isLevel&&((seed%7===0)||(column.source==="settlement"&&row.outputProgress<55)||(column.source==="arrears"&&seed%5===0));
  if(unavailable)return {unavailable:true};
  if(!baseColor)return {color:"",overdue:false};
  const visible=isLevel||seed%4===0||seed%5===1;
  return {color:visible?baseColor:"",overdue:visible&&!!row.overdue?.[column.source]};
}

function renderEconomyMonthlyThunder(cell,column){
  if(cell.unavailable)return `<span class="economy-monthly-check-na">-</span>`;
  if(!cell.color)return `<span class="economy-monthly-check-empty">-</span>`;
  const meta=economyMonthlyCheckMeta[cell.color];
  if(column?.key.endsWith("Level"))return `<span class="economy-monthly-check-thunder ${meta.className}" title="${meta.label}"></span>`;
  const count=cell.overdue?2:1;
  return `<span class="economy-monthly-check-thunder ${meta.className}" title="${meta.label}${count===2?'，连续未整改':''}"><img src="./src/assets/economy-warning/${count===2?'two-thunders.svg':'one-thunder.svg'}" alt="${count===2?'二颗雷':'一颗雷'}"></span>`;
}

function getEconomyMonthlyCheckRows(){
  const rows=typeof getEconomyDiagnosisFiltered==="function"?getEconomyDiagnosisFiltered():[];
  const fallback=rows.length?rows:(typeof getEconomyEditionProjects==="function"?getEconomyEditionProjects():[]);
  return isEconomyMonthlyCheckInternational()?fallback.filter(row=>row.company==="城建国际"):fallback.filter(row=>row.company!=="城建国际");
}

function getEconomyMonthlyCheckGroups(){
  const rows=getEconomyMonthlyCheckRows();
  const map=new Map();
  rows.forEach(row=>{
    const company=row.company||"未归属子公司";
    if(!map.has(company))map.set(company,[]);
    map.get(company).push(row);
  });
  return [...map.entries()].map(([company,projects])=>({company,projects}));
}

function getEconomyMonthlyCheckStats(projects){
  const columns=getEconomyMonthlyCheckColumns();
  const warningProjects=projects.filter((row,index)=>columns.some(column=>getEconomyMonthlyCheckCell(row,column,index).color));
  const unresolved=warningProjects.filter((row,index)=>columns.some(column=>getEconomyMonthlyCheckCell(row,column,index).overdue));
  return {total:projects.length,warning:warningProjects.length,unresolved:unresolved.length,normal:projects.length-warningProjects.length};
}

function renderEconomyMonthlyCheckHeader(){
  const columns=getEconomyMonthlyCheckColumns();
  const groups=[];
  columns.forEach(column=>{
    const current=groups[groups.length-1];
    if(current?.label===column.group)current.count+=1;
    else groups.push({label:column.group,count:1});
  });
  return `<thead><tr><th rowspan="2" class="sticky-seq">序号</th><th rowspan="2" class="sticky-company">子公司</th><th rowspan="2" class="sticky-branch">分公司</th><th rowspan="2" class="sticky-project">项目名称</th><th rowspan="2">合同金额<br>（万元）</th><th rowspan="2">目标利润率<br>（含税）</th><th rowspan="2">开累产值<br>完成率</th>${groups.map(group=>`<th colspan="${group.count}" class="warning-group">${group.label}</th>`).join("")}</tr><tr>${columns.map(column=>`<th class="${column.key.endsWith("Level")?'primary-warning-title':''}">${column.label}</th>`).join("")}</tr></thead>`;
}

function renderEconomyMonthlyCheckCompany(group,groupIndex){
  const stats=getEconomyMonthlyCheckStats(group.projects);
  const month=(economyDashboardState.month||"2026-06").replace("-","");
  const columns=getEconomyMonthlyCheckColumns();
  const tableWidth=getEconomyMonthlyCheckTableWidth();
  return `<section class="economy-monthly-company" id="economyMonthlyCompany${groupIndex}">
    <div class="economy-monthly-company-head" style="min-width:${tableWidth}px">
      <div><h2>${group.company}工程项目经济风险月度检验单（${month}）</h2><p>在线项目 <b>${stats.total}</b> 个，其中：预警项目 <b>${stats.warning}</b> 个、未整改项目 <b>${stats.unresolved}</b> 个、未预警项目 <b>${stats.normal}</b> 个。</p></div>
      <span>未达到预警前置条件及未实现功能的二级指标以灰色底纹标注</span>
    </div>
    <div class="economy-monthly-table-wrap"><table style="width:${tableWidth}px">${renderEconomyMonthlyCheckHeader()}<tbody>${group.projects.map((row,index)=>{
      const seed=getEconomyMonthlyCheckSeed(row,index);
      const profit=(.5+(seed%145)/10).toFixed(1);
      return `<tr><td class="sticky-seq">${index+1}</td><td class="sticky-company">${group.company}</td><td class="sticky-branch">${row.branch||"-"}</td><td class="sticky-project"><button type="button" title="查看项目经济总览" onclick="openEconomyDiagnosisProjectOverview('${escapeAttr(row.sourceProjectId)}')">${row.projectName}</button></td><td class="number" title="${Number(row.contractAmount||0).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})} 万元">${Math.round(Number(row.contractAmount||0))}</td><td>${profit}%</td><td>${Math.round(Number(row.outputProgress||0))}%</td>${columns.map(column=>{const cell=getEconomyMonthlyCheckCell(row,column,index);return `<td class="warning-cell ${cell.unavailable?'unavailable':''}">${renderEconomyMonthlyThunder(cell,column)}</td>`;}).join("")}</tr>`;
    }).join("")}</tbody></table></div>
  </section>`;
}

function scrollEconomyMonthlyCheckCompany(index){
  document.getElementById(`economyMonthlyCompany${index}`)?.scrollIntoView({behavior:"smooth",block:"start"});
}

function renderEconomyMonthlyCheckReport(){
  const groups=getEconomyMonthlyCheckGroups();
  const total=groups.reduce((sum,group)=>sum+group.projects.length,0);
  const warning=groups.reduce((sum,group)=>sum+getEconomyMonthlyCheckStats(group.projects).warning,0);
  const unresolved=groups.reduce((sum,group)=>sum+getEconomyMonthlyCheckStats(group.projects).unresolved,0);
  const editionName=isEconomyMonthlyCheckInternational()?"国际工程":"企业工程";
  return `<div class="economy-monthly-check-report ${isEconomyMonthlyCheckInternational()?'international':''}">
    <header class="economy-monthly-check-toolbar">
      <div><h1>${editionName}项目经济风险月度检验单</h1><p>${(economyDashboardState.month||"2026-06").replace("-","年")}月</p></div>
      <div class="economy-monthly-check-summary"><span>子公司<strong>${groups.length}</strong></span><span>在线项目<strong>${total}</strong></span><span>预警项目<strong>${warning}</strong></span><span>未整改项目<strong>${unresolved}</strong></span></div>
      <div class="economy-monthly-check-legend">${Object.entries(economyMonthlyCheckMeta).map(([key,item])=>`<span><i class="${key}"></i>${item.label}</span>`).join("")}<span><i class="gray"></i>不满足前置条件</span></div>
    </header>
    <nav class="economy-monthly-check-nav">${groups.map((group,index)=>`<button type="button" onclick="scrollEconomyMonthlyCheckCompany(${index})">${group.company}<b>${group.projects.length}</b></button>`).join("")}</nav>
    <main class="economy-monthly-check-content">${groups.map(renderEconomyMonthlyCheckCompany).join("")||`<div class="project-log-empty">当前筛选范围暂无项目</div>`}</main>
  </div>`;
}

function openEconomyMonthlyCheckReport(){
  openModal(isEconomyMonthlyCheckInternational()?"国际版月度检验单":"月度检验单",renderEconomyMonthlyCheckReport(),`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="showToast('月度检验单导出成功')"><span aria-hidden="true">⇩</span> 导出</button>`,"large");
  modalBox.classList.add("economy-monthly-check-modal");
  if(!modalBox.classList.contains("fullscreen"))toggleModalFullscreen();
}

Object.assign(window,{openEconomyMonthlyCheckReport,scrollEconomyMonthlyCheckCompany});
