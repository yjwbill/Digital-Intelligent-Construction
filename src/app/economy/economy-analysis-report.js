const economyAnalysisReportState={page:0,wheelLocked:false};
const economyReportCompanies=["隧道股份","上海隧道","市政集团","上海路桥","城建集团","城市环境","运营集团","城建设计"];
const economyReportOverviewFallback={onlineProjectCount:187,onlineContractAmount:919.94,standardOnlineRate:100,cmProjectCount:936,projectCoverageRate:19.56,contractCoverageRate:19.56};

function getEconomyReportOverviewSummary(){
  const [year,month]=String(economyDashboardState.month||"2026-06").split("-");
  const source={...economyReportOverviewFallback,...(globalThis.economyReportOverviewData||{})};
  return {...source,year,month:Number(month),warningBatch:`${Number(month)}/17`};
}

function renderEconomyReportOverviewCopy(){
  const data=getEconomyReportOverviewSummary();
  return `截止${data.year}年${data.month}月底（即${data.warningBatch}预警），根据产运部项目经济管理平台上线标准（项目合同总额＞4000万元且至2024年3月底开累施工产值≤合同总额50%），合计在建项目上线总数 <b>${data.onlineProjectCount}</b> 个，合同金额 <b>${Number(data.onlineContractAmount).toFixed(2)}</b> 亿，符合标准项目已${data.standardOnlineRate}%全部上线。同期，集团CM平台（项目合同总额＞300万元）所登记的上线单位所涉及在建项目 <b>${data.cmProjectCount}</b> 个，经济平台已覆盖其数量 <b>${data.projectCoverageRate}%</b>；合同额总额 <b>${Number(data.onlineContractAmount).toFixed(2)}</b> 亿，经济平台已覆盖其体量 <b>${data.contractCoverageRate}%</b>。`;
}
function getEconomyReportCompanyMetrics(index=-1){
  if(index<0)return [{label:"个数",total:248,value:146,rate:59},{label:"合同金额",total:1461,value:829,rate:59}];
  const countTotal=186+index*17,countRate=56+index%4,amountTotal=1050+index*135,amountRate=58+index%3;
  return [{label:"个数",total:countTotal,value:Math.round(countTotal*countRate/100),rate:countRate},{label:"合同金额",total:amountTotal,value:Math.round(amountTotal*amountRate/100),rate:amountRate}];
}
function renderEconomyReportOverviewMetrics(metrics){
  return `<div class="eco-report-overview-metrics">${metrics.map(item=>`<div class="eco-report-overview-metric"><div class="eco-report-rate-bubble"><i></i><b>${item.rate}%</b></div><div class="eco-report-value-column"><em>${item.total}</em><div class="eco-report-value-bar"><i style="height:${Math.max(8,Math.min(100,item.value/item.total*100))}%"></i><b style="bottom:${Math.max(8,Math.min(100,item.value/item.total*100))}%">${item.value}</b></div></div><small>${item.label}</small></div>`).join("")}</div>`;
}
const economyReportColors=["#FF0013","#FF9933","#FFF44F","#4596E2","#dfe5ee","#343434"];

function economyReportMonthLabel(){const [year,month]=(economyDashboardState.month||"2026-06").split("-");return `${year}年${Number(month)}月`;}
function renderEconomyReportLogo(compact=false){return `<div class="eco-report-logo ${compact?'compact':''}"><span>TEC</span></div>`;}
function renderEconomyReportPageHead(series,title,page){return `<div class="eco-report-page-head"><div><b>${series}</b><h2>${title}</h2></div><span>${String(page).padStart(2,"0")}</span></div>`;}
function renderEconomyReportLegend(labels=["红色预警","橙色预警","黄色预警","蓝色预警","未预警","未及时整改"]){return `<div class="eco-report-legend">${labels.map((x,i)=>`<span><i style="background:${economyReportColors[i]}"></i>${x}</span>`).join("")}</div>`;}
function renderEconomyReportBars(values,index=0,labels){return `<div class="eco-report-bars">${values.map((value,i)=>`<div class="eco-report-bar-item"><em>${value}%</em><div class="eco-report-bar"><i style="height:${Math.max(8,value)}%;background:${i===0?'#2383df':'#75d9f4'}"></i><u style="height:${Math.max(0,100-value)}%"></u></div><small><span>${labels?.[i]||economyReportCompanies[(i+index)%economyReportCompanies.length]}</span></small></div>`).join("")}</div>`;}
function renderEconomyReportStackedChart(seed=0,labels=economyReportCompanies){return `<div class="eco-report-stack-chart">${labels.map((name,i)=>{const a=3+(i+seed)%5,b=7+(i*2+seed)%7,c=9+(i*3+seed)%10,d=6+(i+seed)%7,e=Math.max(0,30-a-b-c-d);return `<div class="eco-report-stack-item"><div class="eco-report-stack"><i style="height:${a*2}px;background:#FF0013">${a}</i><i style="height:${b*2}px;background:#FF9933">${b}</i><i style="height:${c*2}px;background:#FFF44F">${c}</i><i style="height:${d*2}px;background:#4596E2">${d}</i>${e?`<i style="height:${e*2}px;background:#dfe5ee">${e}</i>`:""}</div><small>${name}</small></div>`}).join("")}</div>`;}
function renderEconomyReportCompanyWarningCopy(){
  const companies=[
    {name:"市政集团",projectRate:68,onlineProjects:47,warningProjects:33,contractRate:82,onlineContract:277,warningContract:228},
    {name:"上海路桥",projectRate:51,onlineProjects:55,warningProjects:24,contractRate:55,onlineContract:188,warningContract:104},
    {name:"上海隧道",projectRate:34,onlineProjects:44,warningProjects:15,contractRate:40,onlineContract:363,warningContract:144}
  ];
  return `本期预警项目个数比例较高的是${companies.map((item,index)=>`${index===0?"":index===1?"其次":""}<b class="danger">${item.name}</b>${index?"预警项目个数比例":""} <b class="danger">${item.projectRate}%</b>（上线 <b class="danger">${item.onlineProjects}</b> 个，预警 <b class="danger">${item.warningProjects}</b> 个），合同比例 <b class="danger">${item.contractRate}%</b>（上线 <b class="danger">${item.onlineContract}</b> 亿，预警 <b class="danger">${item.warningContract}</b> 亿）`).join("；")}。`;
}
function buildEconomyReportConicGradient(parts){
  const total=parts.reduce((sum,item)=>sum+item.value,0)||1;
  let cursor=0;
  return `conic-gradient(${parts.map(item=>{const start=cursor/total*100;cursor+=item.value;const end=cursor/total*100;return `${item.color} ${start.toFixed(3)}% ${end.toFixed(3)}%`;}).join(",")})`;
}
function formatEconomyReportSunburstValue(value,unit){
  if(unit==="个")return `${Math.round(value)}个`;
  return `${Number(value).toFixed(2)}亿元`;
}
function renderEconomyReportSunburst(iconSrc,iconAlt,items,unit){
  const innerParts=items.map(item=>({value:item.value,color:item.color}));
  const total=items.reduce((sum,item)=>sum+item.value,0)||1;
  const outerParts=items.flatMap(item=>{
    const overdue=Math.max(0,Math.min(item.value,item.overdue||0));
    const rectified=item.value-overdue;
    return [
      ...(rectified?[{value:rectified,color:item.color}]:[]),
      ...(overdue?[{value:overdue,color:"#343434"}]:[])
    ];
  });
  const positions=["red","orange","yellow","blue","none"];
  const lineTargets=[[396,36,520,36],[416,94,540,94],[464,160,574,160],[426,284,548,284],[136,204,36,204]];
  let lineCursor=0;
  const lines=items.map((item,index)=>{
    const rectified=Math.max(0,item.value-(item.overdue||0));
    const anchorValue=lineCursor+(rectified?rectified/2:item.value/2);
    const angle=anchorValue/total*Math.PI*2;
    const x=310+Math.sin(angle)*125;
    const y=165-Math.cos(angle)*125;
    lineCursor+=item.value;
    return `<polyline class="line-${positions[index]}" points="${x.toFixed(1)},${y.toFixed(1)} ${lineTargets[index].join(" ")}"/>`;
  }).join("");
  const labels=items.map((item,index)=>{
    const rate=item.rate??(item.value/total*100).toFixed(2);
    const overdueRate=((item.overdue||0)/total*100).toFixed(2);
    return `<div class="eco-report-sunburst-label ${positions[index]}"><span><i style="background:${item.color}"></i>${formatEconomyReportSunburstValue(item.value,unit)} | ${rate}%</span>${item.overdue?`<span><i style="background:#343434"></i>${formatEconomyReportSunburstValue(item.overdue,unit)} | ${overdueRate}%</span>`:""}</div>`;
  }).join("");
  return `<div class="eco-report-sunburst-visual"><svg class="eco-report-sunburst-lines" viewBox="0 0 620 330" preserveAspectRatio="none" aria-hidden="true">${lines}</svg><div class="eco-report-donut eco-report-sunburst"><div class="eco-report-sunburst-outer" style="background:${buildEconomyReportConicGradient(outerParts)}"></div><div class="eco-report-sunburst-inner" style="background:${buildEconomyReportConicGradient(innerParts)}"></div><strong><img src="${iconSrc}" alt="${iconAlt}"/></strong></div>${labels}</div>`;
}

function renderEconomyReportSlide(index){
  const month=economyReportMonthLabel();
  if(index===0)return `<section class="eco-report-slide cover"><img class="cover-background" src="./src/assets/economy/analysis-report-cover-bg.svg" alt=""/><div class="cover-brand"><img src="./src/assets/economy/tunnel-group-logo.svg" alt="隧道股份"/></div><div class="cover-copy"><h1>隧道股份<br>项目<span>经济分析报告</span></h1><b>${month}</b></div></section>`;
  if(index===1)return `<section class="eco-report-slide contents"><div class="contents-mark"><b>目录</b><span>CONTENTS</span></div><div class="contents-main"><div class="contents-part"><strong data-number="01">01</strong><span>项目经济管理平台上线项目经济情况总览</span><em>Part</em></div>${[["系列一","平台整体上线率情况","01"],["系列二","上线项目一级预警指标情况","02"],["系列三","上线项目主要二级预警指标情况","04"],["系列四","近五期预警情况对比","05"],["系列五","纳入年度全面预算利润贡献前十位范围的已上线项目经济指标汇总","06"]].map(x=>`<div class="contents-row"><div class="contents-entry"><b>${x[0]}</b><div class="contents-line"><span>${x[1]}</span><i></i></div></div><em>${x[2]}</em></div>`).join("")}<div class="contents-part second"><strong data-number="02">02</strong><span>相关附件</span><em>Part</em></div><p>附件一：隧道股份工程项目经济风险月度检验单（${economyDashboardState.month.replace('-','')}）</p><p>附件二：纳入“年度全面预算利润贡献前十位范围”的已上线项目情况汇总表</p></div></section>`;
  if(index===2){const overviewData=getEconomyReportOverviewSummary();return `<section class="eco-report-slide report-page overview-report-page">${renderEconomyReportPageHead("系列一","平台整体上线率情况",1)}<div class="eco-report-copy overview-copy">${renderEconomyReportOverviewCopy()}</div><div class="eco-report-overview"><article>${renderEconomyReportOverviewMetrics(getEconomyReportCompanyMetrics())}<h3>隧道股份</h3></article><div class="eco-report-company-grid">${economyReportCompanies.slice(1).map((name,i)=>`<article>${renderEconomyReportOverviewMetrics(getEconomyReportCompanyMetrics(i))}<h3>${name}</h3></article>`).join("")}</div></div><div class="eco-report-overview-footer">${renderEconomyReportLegend(["数智经济纳管项目数","CM在建项目数"])}<p class="eco-report-note">注：在建项目总数及合同金额汇总以${overviewData.month}月17日CM平台所登记的三大包在建项目清单</p></div></section>`;}
  if(index===3){
    const warningCountData=[
      {value:4,overdue:3,rate:"3.25",color:economyReportColors[0]},
      {value:12,overdue:10,rate:"8.51",color:economyReportColors[1]},
      {value:32,overdue:18,rate:"22.23",color:economyReportColors[2]},
      {value:24,overdue:8,rate:"14.23",color:economyReportColors[3]},
      {value:74,overdue:0,rate:"51.25",color:economyReportColors[4]}
    ];
    const warningAmountData=[
      {value:8.25,overdue:8.25*3/4,rate:"1.25",color:economyReportColors[0]},
      {value:60.03,overdue:60.03*10/12,rate:"7.11",color:economyReportColors[1]},
      {value:268.23,overdue:268.23*18/32,rate:"33.11",color:economyReportColors[2]},
      {value:112.21,overdue:112.21*8/24,rate:"15.54",color:economyReportColors[3]},
      {value:355.99,overdue:0,rate:"43.29",color:economyReportColors[4]}
    ];
    const reportMonth=getEconomyReportOverviewSummary();
    return `<section class="eco-report-slide report-page warning-report-page">${renderEconomyReportPageHead("系列二","上线项目一级预警指标情况",2)}<div class="eco-report-copy warning-report-copy"><p>截止${reportMonth.year}年${reportMonth.month}月底（即${reportMonth.warningBatch}预警），隧道股份共上线 <b>146</b> 个项目。经平台诊断：</p><p><i class="red"></i>红色预警项目 <b>4</b> 个（其中黑色预警项目 <b>3</b> 个），较上月减少 <b>1</b> 个，预警比例 <b>3.25%</b>，所涉合同金额 <b>8.25</b> 亿元，占上线合同总额 <b>1.25%</b>；</p><p><i class="orange"></i>橙色预警项目 <b>12</b> 个（其中黑色预警项目 <b>10</b> 个），无变化，预警比例 <b>8.51%</b>，所涉合同金额 <b>60.03</b> 亿元，占上线合同总额 <b>7.11%</b>；</p><p><i class="yellow"></i>黄色预警项目 <b>32</b> 个（其中黑色预警项目 <b>18</b> 个），较上月减少 <b>6</b> 个，预警比例 <b>22.23%</b>，所涉合同金额 <b>268.23</b> 亿元，占上线合同总额 <b>33.11%</b>；</p><p><i class="blue"></i>蓝色预警项目 <b>24</b> 个（其中黑色预警项目 <b>8</b> 个），较上月增加 <b>7</b> 个，预警比例 <b>14.23%</b>，所涉合同金额 <b>112.21</b> 亿元，占上线合同总额 <b>15.54%</b>；</p><p><i class="none"></i>未报警项目 <b>74</b> 个，无变化，比例 <b>51.25%</b>，所涉合同金额 <b>355.99</b> 亿元，占上线合同总额 <b>43.29%</b>。具体如下图：</p></div><div class="eco-report-two-charts warning-sunburst-charts"><article><h3>子公司一级指标预警项目数量总览（个数及占比）</h3>${renderEconomyReportSunburst("./src/assets/economy/warning-project-count.svg","项目数量",warningCountData,"个")}</article><article><h3>子公司一级指标预警合同金额总览（金额及占比）</h3>${renderEconomyReportSunburst("./src/assets/economy/warning-contract-amount.svg","合同金额",warningAmountData,"亿元")}</article></div>${renderEconomyReportLegend()}</section>`;
  }
  if(index===4){const companyLabels=["上海隧道","市政集团","上海路桥","城建集团","城市环境","运营集团","城建设计","数字集团"],regionLabels=["上海","浙江","江苏","江西","广东","河南","安徽","其他"];return `<section class="eco-report-slide report-page company-warning-report-page">${renderEconomyReportPageHead("系列二","上线项目一级预警指标情况",3)}<div class="eco-report-copy company-warning-copy">${renderEconomyReportCompanyWarningCopy()}</div><div class="eco-report-two-charts compact company-warning-chart"><article><h3>各子公司预警项目数量（个）</h3>${renderEconomyReportStackedChart(0,companyLabels)}</article><article><h3>各子公司预警项目合同（亿）</h3>${renderEconomyReportStackedChart(3,companyLabels)}</article></div><div class="eco-report-copy company-warning-region-copy">本期隧道股份上线项目区域个数比例前两位分别为 <b class="danger">上海、浙江</b>，合计占比 <b class="danger">88%</b>。</div><article class="eco-report-wide-chart company-warning-chart"><h3>区域市场维度预警展示</h3>${renderEconomyReportStackedChart(5,regionLabels)}</article>${renderEconomyReportLegend(["红色预警","橙色预警","黄色预警","蓝色预警","未预警"])}</section>`;}
  if(index===5)return `<section class="eco-report-slide report-page secondary-warning-report-page">${renderEconomyReportPageHead("系列三","上线项目主要二级预警指标情况",5)}<div class="eco-report-copy">根据本期预警结果，上线单位本期予以警示的问题主要集中在 <b class="danger">3</b> 个方面，如下图所示。</div><p class="eco-report-muted">（预警占比=预警个数/报警项目总个数；预警占比超过30%予以警示）</p><div class="eco-report-six-charts">${["项目管理费预警","工期异常预警","资金存货关联预警","合同个数预警","分包商产值计量超合同预警","拖欠款预警"].map((name,i)=>`<article><h3>${i+1}.${name}（占比 <b>${[56,49,18,18,14,60][i]}%</b>）</h3>${renderEconomyReportBars([56,62,20,66,58,42,66,47],i)}</article>`).join("")}</div></section>`;
  if(index===6)return `<section class="eco-report-slide report-page secondary-warning-report-page series-five-report-page">${renderEconomyReportPageHead("系列五","纳入“年度全面预算利润贡献前十位范围”的已上线项目经济指标汇总",6)}<div class="eco-report-copy">结合隧道股份已上线单位年度全面预算营收安排，纳入对应单位利润贡献前十位范围的已上线项目个数共 <b class="danger">10</b> 个。</div><div class="eco-report-table"><table><thead><tr><th>序号</th><th>单位</th><th>目标值（万元）</th><th>实际值（万元）</th><th>完成进度</th><th>目标利润率</th><th>存货率</th><th>偏离度</th></tr></thead><tbody>${[1,2,3,4].map((x,i)=>`<tr><td>${x}</td><td>${economyReportCompanies[i+1]}</td><td>2,281,877.92</td><td>667,300.24</td><td>${37+i*8}.66%</td><td>12.93%</td><td>${i===0?'-11.43%':'5.61%'}</td><td>${i===0?'-24.36%':'-7.53%'}</td></tr>`).join("")}<tr class="total"><td></td><td>合计</td><td>33,082,575.82</td><td>5,412,691.93</td><td></td><td>7.75%</td><td>-0.22%</td><td>-7.53%</td></tr></tbody></table></div><div class="eco-report-two-charts finance"><article><h3>当年营收完成进度（亿元）</h3>${renderEconomyReportBars([89,89,72,94],0)}</article><article><h3>加权平均目标利润率与加权平均存货率</h3>${renderEconomyReportBars([13,6,28,6],2)}</article></div></section>`;
  {const companyLabels=["上海隧道","市政集团","上海路桥","城建集团","城市环境","运营集团","城建设计","数字集团"];return `<section class="eco-report-slide report-page series-four-report-page">${renderEconomyReportPageHead("系列四","近五期预警情况对比",7)}<div class="eco-report-copy">根据隧道股份近五期预警情况展示，预警项目数量较上期 <b class="danger">整体持平</b>。一级指标未整改黑色预警 50 个，主要集中在合同预警、潜亏预警、结算预警。</div><div class="eco-report-two-charts trend company-warning-chart"><article><h3>一级预警指标对比</h3>${renderEconomyReportStackedChart(2,companyLabels)}</article><article><h3>二级预警指标对比</h3><div class="eco-report-trend-points">${["7/17","8/17","9/17","10/17","11/17"].map((x,i)=>`<span><i style="bottom:${40+i%2*12}px"></i><b>${x}</b></span>`).join("")}</div></article></div>${renderEconomyReportLegend()}</section>`;}
}

function renderEconomyAnalysisReport(){const total=8;return `<div class="eco-report-viewer" onwheel="handleEconomyReportWheel(event)"><div class="eco-report-stage">${renderEconomyReportSlide(economyAnalysisReportState.page)}</div><button class="eco-report-arrow prev" title="上一页" onclick="changeEconomyReportPage(-1)" ${economyAnalysisReportState.page===0?'disabled':''}>‹</button><button class="eco-report-arrow next" title="下一页" onclick="changeEconomyReportPage(1)" ${economyAnalysisReportState.page===total-1?'disabled':''}>›</button><div class="eco-report-pager"><span>${economyAnalysisReportState.page+1} / ${total}</span>${Array.from({length:total},(_,i)=>`<button class="${i===economyAnalysisReportState.page?'active':''}" title="第${i+1}页" onclick="goEconomyReportPage(${i})"></button>`).join("")}</div></div>`;}
function refreshEconomyAnalysisReport(){const body=document.querySelector(".economy-report-modal .modal-bd");if(body)body.innerHTML=renderEconomyAnalysisReport();}
function goEconomyReportPage(page){economyAnalysisReportState.page=Math.max(0,Math.min(7,page));refreshEconomyAnalysisReport();}
function changeEconomyReportPage(step){goEconomyReportPage(economyAnalysisReportState.page+step);}
function handleEconomyReportWheel(event){event.preventDefault();if(economyAnalysisReportState.wheelLocked||Math.abs(event.deltaY)<8)return;economyAnalysisReportState.wheelLocked=true;changeEconomyReportPage(event.deltaY>0?1:-1);setTimeout(()=>{economyAnalysisReportState.wheelLocked=false;},420);}
function openEconomyAnalysisReport(){economyAnalysisReportState.page=0;openModal("项目经济分析报告预览",renderEconomyAnalysisReport(),`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="showToast('分析报告下载成功')"><span aria-hidden="true">⇩</span> 下载报告</button>`,"large");modalBox.classList.add("economy-report-modal");toggleModalFullscreen();}
