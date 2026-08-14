const economyAnalysisReportState={page:0,wheelLocked:false};
const economyReportCompanies=["隧道股份","上海隧道","市政集团","上海路桥","城建集团","城市环境","运营集团","城建设计"];
function formatEconomyReportCompanyLabel(name){const value=String(name||"");return value.length===4?`<span class="eco-report-company-label">${value.slice(0,2)}<br>${value.slice(2)}</span>`:value;}
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
function renderEconomyReportPageHead(series,title,page){const displayPage=page===6?7:page===7?6:page;return `<div class="eco-report-page-head"><div><b>${series}</b><h2>${title}</h2></div><span>${String(displayPage).padStart(2,"0")}</span></div>`;}
function renderEconomyReportLegend(labels=["红色预警","橙色预警","黄色预警","蓝色预警","未预警","未及时整改"]){return `<div class="eco-report-legend">${labels.map((x,i)=>`<span><i style="background:${economyReportColors[i]}"></i>${x}</span>`).join("")}</div>`;}
function renderEconomyReportYAxis(max,step,unit=""){const ticks=[];for(let value=0;value<=max;value+=step)ticks.push(value);return `<div class="eco-report-y-axis">${ticks.map(value=>`<span style="bottom:${value/max*100}%"><b>${value}${unit}</b><i></i></span>`).join("")}</div>`;}
function renderEconomyReportBars(values,index=0,labels){return `<div class="eco-report-bars economy-report-axis-chart">${renderEconomyReportYAxis(100,20,"%")}${values.map((value,i)=>{const label=labels?.[i]||economyReportCompanies[(i+index)%economyReportCompanies.length];return `<div class="eco-report-bar-item"><div class="eco-report-bar"><em style="bottom:${Math.max(8,value)}%">${value}%</em><i style="height:${Math.max(8,value)}%;background:${i===0?'#2383df':'#75d9f4'}"></i><u style="height:${Math.max(0,100-value)}%"></u></div><small>${formatEconomyReportCompanyLabel(label)}</small></div>`;}).join("")}</div>`;}
function renderEconomyReportStackedChart(seed=0,labels=economyReportCompanies){const rows=labels.map((name,i)=>{const values=[3+(i+seed)%5,7+(i*2+seed)%7,9+(i*3+seed)%10,6+(i+seed)%7];values.push(Math.max(0,30-values.reduce((sum,value)=>sum+value,0)));return {name,values,total:values.reduce((sum,value)=>sum+value,0)};});const axisMax=Math.max(20,Math.ceil(Math.max(...rows.map(row=>row.total))/5)*5);return `<div class="eco-report-stack-chart economy-report-axis-chart">${renderEconomyReportYAxis(axisMax,5)}${rows.map(row=>`<div class="eco-report-stack-item"><div class="eco-report-stack">${row.values.map((value,index)=>value?`<i style="height:${value/axisMax*100}%;background:${economyReportColors[index]}">${value}</i>`:"").join("")}</div><small>${formatEconomyReportCompanyLabel(row.name)}</small></div>`).join("")}</div>`;}
function renderEconomyReportSecondaryTrend(){
  const months=["7/17","8/17","9/17","10/17","11/17"];
  const series=[
    {name:"合同个数",color:"#06a9e0",shape:"circle",values:[18,20,22,21,24]},
    {name:"资金存货关联",color:"#ff8617",shape:"triangle",values:[30,34,32,31,36]},
    {name:"分包商产值计量",color:"#2383df",shape:"star",values:[15,17,18,16,20]},
    {name:"项目管理费",color:"#ffd500",shape:"square",values:[24,27,26,25,29]},
    {name:"工期异常",color:"#6bd5f1",shape:"diamond",values:[10,12,13,11,15]},
    {name:"拖欠款预警",color:"#ef1018",shape:"octagon",values:[27,29,28,30,32]}
  ];
  const xs=[72,168,264,360,456],y=value=>196-value/50*164;
  const marker=(shape,x,cy,color)=>{
    if(shape==="circle")return `<circle cx="${x}" cy="${cy}" r="5.5" fill="${color}"/>`;
    if(shape==="triangle")return `<polygon points="${x},${cy-7} ${x-7},${cy+6} ${x+7},${cy+6}" fill="${color}"/>`;
    if(shape==="square")return `<rect x="${x-6}" y="${cy-6}" width="12" height="12" fill="${color}"/>`;
    if(shape==="diamond")return `<polygon points="${x},${cy-7} ${x-7},${cy} ${x},${cy+7} ${x+7},${cy}" fill="${color}"/>`;
    if(shape==="star")return `<polygon points="${x},${cy-8} ${x+2.4},${cy-2.7} ${x+8},${cy-2} ${x+3.8},${cy+1.8} ${x+5},${cy+7} ${x},${cy+4.2} ${x-5},${cy+7} ${x-3.8},${cy+1.8} ${x-8},${cy-2} ${x-2.4},${cy-2.7}" fill="${color}"/>`;
    return `<polygon points="${x-3},${cy-7} ${x+3},${cy-7} ${x+7},${cy-3} ${x+7},${cy+3} ${x+3},${cy+7} ${x-3},${cy+7} ${x-7},${cy+3} ${x-7},${cy-3}" fill="${color}"/>`;
  };
  return `<div class="eco-report-secondary-trend"><svg viewBox="0 0 520 238" role="img" aria-label="近五期二级预警数量趋势">${[0,5,10,15,20,25,30,35,40,45,50].map(value=>`<g><line x1="52" y1="${y(value)}" x2="500" y2="${y(value)}"/><text x="42" y="${y(value)+5}" text-anchor="end">${value}</text></g>`).join("")}<line class="axis" x1="52" y1="32" x2="52" y2="196"/><line class="axis" x1="52" y1="196" x2="500" y2="196"/>${months.map((month,index)=>`<text class="month" x="${xs[index]}" y="220" text-anchor="middle">${month}</text>`).join("")}${series.map(item=>`<polyline points="${item.values.map((value,index)=>`${xs[index]},${y(value)}`).join(" ")}" fill="none" stroke="${item.color}" stroke-width="2"/>${item.values.map((value,index)=>`${marker(item.shape,xs[index],y(value),item.color)}<text class="value" x="${xs[index]+9}" y="${y(value)+4}" style="fill:${item.color}">${value}</text>`).join("")}`).join("")}</svg><div class="eco-report-secondary-legend">${series.map(item=>`<span><i class="${item.shape}" style="--legend-color:${item.color}"></i>${item.name}</span>`).join("")}</div></div>`;
}
function renderEconomyReportRevenueProgress(){
  const rows=[
    {name:"隧道股份",plan:60.71,actual:57.16,rate:89.22},
    {name:"上海隧道",plan:60.71,actual:57.16,rate:89.22},
    {name:"市政集团",plan:48.22,actual:45.13,rate:89.22},
    {name:"上海路桥",plan:67.16,actual:62.16,rate:89.22}
  ];
  const amountMax=Math.max(70,Math.ceil(Math.max(...rows.flatMap(row=>[row.plan,row.actual]))/10)*10);
  const rateMax=Math.max(120,Math.ceil(Math.max(...rows.map(row=>row.rate))/20)*20);
  const top=24,bottom=188,amountY=value=>bottom-value/amountMax*(bottom-top),rateY=value=>bottom-value/rateMax*(bottom-top),xs=[104,224,344,464];
  return `<div class="eco-report-revenue-progress"><svg viewBox="0 0 570 250" role="img" aria-label="子公司当年营收计划、实际值及完成进度">${Array.from({length:amountMax/10+1},(_,i)=>i*10).map(value=>`<g><line x1="48" y1="${amountY(value)}" x2="522" y2="${amountY(value)}"/><text x="39" y="${amountY(value)+5}" text-anchor="end">${value}</text></g>`).join("")}${Array.from({length:rateMax/20+1},(_,i)=>i*20).map(value=>`<text class="right-axis" x="532" y="${rateY(value)+5}">${value}%</text>`).join("")}<line class="axis" x1="48" y1="${top}" x2="48" y2="${bottom}"/><line class="axis" x1="48" y1="${bottom}" x2="522" y2="${bottom}"/>${rows.map((row,index)=>`<rect class="plan" x="${xs[index]-23}" y="${amountY(row.plan)}" width="22" height="${bottom-amountY(row.plan)}"/><rect class="actual" x="${xs[index]+1}" y="${amountY(row.actual)}" width="22" height="${bottom-amountY(row.actual)}"/><text class="amount" x="${xs[index]-12}" y="${amountY(row.plan)-5}" text-anchor="middle">${row.plan.toFixed(2)}</text><text class="amount" x="${xs[index]+12}" y="${amountY(row.actual)-5}" text-anchor="middle">${row.actual.toFixed(2)}</text><text class="company" x="${xs[index]}" y="211" text-anchor="middle">${row.name}</text>`).join("")}<polyline class="progress-line" points="${rows.map((row,index)=>`${xs[index]},${rateY(row.rate)}`).join(" ")}"/>${rows.map((row,index)=>`<circle class="progress-dot" cx="${xs[index]}" cy="${rateY(row.rate)}" r="5.5"/><text class="rate" x="${xs[index]}" y="${rateY(row.rate)-9}" text-anchor="middle">${row.rate.toFixed(2)}%</text>`).join("")}</svg><div class="eco-report-revenue-legend"><span><i class="actual"></i>实际值</span><span><i class="plan"></i>计划值</span><span><i class="progress"></i>完成进度</span></div></div>`;
}
function renderEconomyReportWeightedRates(){
  const rows=[
    {name:"隧道股份",inventory:-11.43,target:12.93},
    {name:"上海隧道",inventory:5.61,target:6.00},
    {name:"市政集团",inventory:8.40,target:28.00},
    {name:"上海路桥",inventory:-4.20,target:6.00}
  ];
  const axisMax=30,top=24,bottom=188,zero=(top+bottom)/2,y=value=>zero-value/axisMax*(bottom-top)/2,xs=[104,224,344,464];
  const bar=(value,x,kind)=>{const valueY=y(value),barY=Math.min(zero,valueY),height=Math.abs(zero-valueY),labelY=value>=0?valueY-(kind==="target"?18:6):valueY+16;return `<rect class="${kind}" x="${x}" y="${barY}" width="22" height="${height}"/><text class="rate-value ${value<0?'negative':''}" x="${x+11}" y="${labelY}" text-anchor="middle">${value.toFixed(2)}%</text>`;};
  return `<div class="eco-report-weighted-rates"><svg viewBox="0 0 570 250" role="img" aria-label="子公司加权平均目标利润率与加权平均存货率">${[-30,-20,-10,0,10,20,30].map(value=>`<g><line class="${value===0?'zero':''}" x1="48" y1="${y(value)}" x2="522" y2="${y(value)}"/><text x="39" y="${y(value)+5}" text-anchor="end">${value}%</text></g>`).join("")}<line class="axis" x1="48" y1="${top}" x2="48" y2="${bottom}"/>${rows.map((row,index)=>`${bar(row.inventory,xs[index]-23,"inventory")}${bar(row.target,xs[index]+1,"target")}<text class="company" x="${xs[index]}" y="211" text-anchor="middle">${row.name}</text>`).join("")}</svg><div class="eco-report-weighted-legend"><span><i class="inventory"></i>加权平均存货率</span><span><i class="target"></i>加权平均目标利润率（不含税）</span></div></div>`;
}
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
  const lineTargets=[[190,52,40,52],[430,60,565,60],[452,150,575,150],[430,255,560,255],[180,258,35,258]];
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
  if(index===6)index=7;
  else if(index===7)index=6;
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
  if(index===6){const reportYear=Number(String(economyDashboardState.month||"2026-06").slice(0,4))||2026,budgetYear=String(reportYear-1).slice(-2);return `<section class="eco-report-slide report-page secondary-warning-report-page series-five-report-page">${renderEconomyReportPageHead("系列五","纳入“年度全面预算利润贡献前十位范围”的已上线项目经济指标汇总",6)}<div class="eco-report-copy series-five-summary"><p>结合隧道股份已上线单位 <b class="danger">${budgetYear}年</b> 全面预算营收安排，纳入对应单位利润贡献前十位范围的已上线项目个数共 <b class="danger">10</b> 个：</p><ol><li>上海隧道纳入利润贡献前十位范围的项目个数 <b class="danger">3</b> 个；</li><li>市政集团纳入利润贡献前十位范围的项目个数 <b class="danger">5</b> 个；</li><li>上海路桥纳入利润贡献前十位范围的项目个数 <b class="danger">2</b> 个。</li></ol></div><div class="eco-report-table"><table><thead><tr><th>序号</th><th>单位</th><th>目标值（万元）</th><th>实际值（万元）</th><th>完成进度</th><th>目标利润率</th><th>存货率</th><th>偏离度</th></tr></thead><tbody>${[1,2,3,4].map((x,i)=>`<tr><td>${x}</td><td>${economyReportCompanies[i+1]}</td><td>2,281,877.92</td><td>667,300.24</td><td>${37+i*8}.66%</td><td>12.93%</td><td>${i===0?'-11.43%':'5.61%'}</td><td>${i===0?'-24.36%':'-7.53%'}</td></tr>`).join("")}<tr class="total"><td></td><td>合计</td><td>33,082,575.82</td><td>5,412,691.93</td><td></td><td>7.75%</td><td>-0.22%</td><td>-7.53%</td></tr></tbody></table></div><div class="eco-report-two-charts finance"><article><h3>当年营收完成进度（亿元）</h3>${renderEconomyReportRevenueProgress()}</article><article><h3>加权平均目标利润率与加权平均存货率</h3>${renderEconomyReportWeightedRates()}</article></div></section>`;}
  {const companyLabels=["上海隧道","市政集团","上海路桥","城建集团","城市环境","运营集团","城建设计","数字集团"];return `<section class="eco-report-slide report-page series-four-report-page">${renderEconomyReportPageHead("系列四","近五期预警情况对比",7)}<div class="eco-report-copy series-four-summary"><p>根据隧道股份近两期预警情况展示，隧道股份 <b class="danger">11/17</b> 预警项目数量较上期 <b class="danger">整体持平</b>，主要变化：</p><p>一级指标方面：未整改黑色预警 <b class="danger">50</b> 个，前三名分别为 <b class="danger">合同预警、潜亏预警、结算预警</b>；红色预警 <b class="danger">新增5个</b>，橙色预警 <b class="danger">减少5个</b>，黄色预警 <b class="danger">新增1个</b>，蓝色预警 <b class="danger">整体持平</b>。</p><p>二级指标方面：本期二级预警 <b class="danger">新增5个</b>，前三名分别为 <b class="danger">资金存货关联、拖欠款预警、项目管理费</b>。</p></div><div class="eco-report-two-charts trend company-warning-chart"><article><h3>一级预警指标对比</h3>${renderEconomyReportStackedChart(2,companyLabels)}${renderEconomyReportLegend()}</article><article><h3>二级预警指标对比</h3>${renderEconomyReportSecondaryTrend()}</article></div></section>`;}
}

function renderEconomyAnalysisReport(){const total=8;return `<div class="eco-report-viewer" onwheel="handleEconomyReportWheel(event)"><div class="eco-report-stage">${renderEconomyReportSlide(economyAnalysisReportState.page)}</div><button class="eco-report-arrow prev" title="上一页" onclick="changeEconomyReportPage(-1)" ${economyAnalysisReportState.page===0?'disabled':''}>‹</button><button class="eco-report-arrow next" title="下一页" onclick="changeEconomyReportPage(1)" ${economyAnalysisReportState.page===total-1?'disabled':''}>›</button><div class="eco-report-pager"><span>${economyAnalysisReportState.page+1} / ${total}</span>${Array.from({length:total},(_,i)=>`<button class="${i===economyAnalysisReportState.page?'active':''}" title="第${i+1}页" onclick="goEconomyReportPage(${i})"></button>`).join("")}</div></div>`;}
function refreshEconomyAnalysisReport(){const body=document.querySelector(".economy-report-modal .modal-bd");if(body)body.innerHTML=renderEconomyAnalysisReport();}
function goEconomyReportPage(page){economyAnalysisReportState.page=Math.max(0,Math.min(7,page));refreshEconomyAnalysisReport();}
function changeEconomyReportPage(step){goEconomyReportPage(economyAnalysisReportState.page+step);}
function handleEconomyReportWheel(event){event.preventDefault();if(economyAnalysisReportState.wheelLocked||Math.abs(event.deltaY)<8)return;economyAnalysisReportState.wheelLocked=true;changeEconomyReportPage(event.deltaY>0?1:-1);setTimeout(()=>{economyAnalysisReportState.wheelLocked=false;},420);}
function openEconomyAnalysisReport(){economyAnalysisReportState.page=0;openModal("经济分析报告",renderEconomyAnalysisReport(),`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="showToast('分析报告下载成功')"><span aria-hidden="true">⇩</span> 下载报告</button>`,"large");modalBox.classList.add("economy-report-modal");toggleModalFullscreen();}
