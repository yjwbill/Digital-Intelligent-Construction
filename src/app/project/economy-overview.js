const projectEconomyOverviewState={period:"2026-06",periodPanelOpen:false,periodPanelYear:2026};

function getProjectEconomyPeriodLabel(value){
  const [year,month]=String(value||"2026-06").split("-");
  return `${year}年${month}月`;
}
function getProjectEconomyTrendPeriods(){
  const [year,month]=projectEconomyOverviewState.period.split("-").map(Number);
  return Array.from({length:5},(_,index)=>{
    const date=new Date(year,month-1-(4-index),1);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
  });
}
function toggleProjectEconomyPeriodPicker(event){event?.stopPropagation?.();projectEconomyOverviewState.periodPanelOpen=!projectEconomyOverviewState.periodPanelOpen;projectEconomyOverviewState.periodPanelYear=Number(projectEconomyOverviewState.period.slice(0,4));renderProjectEconomyPeriodPanel();}
function moveProjectEconomyPeriodYear(delta,event){event?.stopPropagation?.();projectEconomyOverviewState.periodPanelYear+=Number(delta)||0;renderProjectEconomyPeriodPanel();}
function selectProjectEconomyPeriod(month,event){event?.stopPropagation?.();const value=`${projectEconomyOverviewState.periodPanelYear}-${String(month).padStart(2,"0")}`;if(value>"2026-07")return;projectEconomyOverviewState.periodPanelOpen=false;setProjectEconomyPeriod(value);}
function closeProjectEconomyPeriodPicker(){if(!projectEconomyOverviewState.periodPanelOpen)return;projectEconomyOverviewState.periodPanelOpen=false;document.getElementById("projectEconomyPeriodPanel")?.classList.remove("open");document.getElementById("projectEconomyPeriodInput")?.classList.remove("active");}
function renderProjectEconomyPeriodPanel(){
  const panel=document.getElementById("projectEconomyPeriodPanel"),input=document.getElementById("projectEconomyPeriodInput");
  if(!panel)return;
  const year=projectEconomyOverviewState.periodPanelYear;
  panel.classList.toggle("open",projectEconomyOverviewState.periodPanelOpen);input?.classList.toggle("active",projectEconomyOverviewState.periodPanelOpen);
  panel.innerHTML=projectEconomyOverviewState.periodPanelOpen?`<div class="SafetyMonthPicker__head"><button type="button" title="上一年" onclick="moveProjectEconomyPeriodYear(-1,event)">‹</button><strong>${year}年</strong><button type="button" title="下一年" onclick="moveProjectEconomyPeriodYear(1,event)">›</button></div><div class="SafetyMonthPicker__grid">${Array.from({length:12},(_,i)=>i+1).map(month=>{const value=`${year}-${String(month).padStart(2,"0")}`;const disabled=value>"2026-07";return `<button type="button" class="${value===projectEconomyOverviewState.period?"selected":""} ${disabled?"disabled":""}" ${disabled?"disabled":""} onclick="selectProjectEconomyPeriod(${month},event)"><span>${month}月</span></button>`;}).join("")}</div>`:"";
}
function renderProjectEconomyPeriodPicker(){return `<div class="SafetyMonthPicker project-economy-period-picker" onclick="event.stopPropagation()"><button type="button" class="SafetyMonthPicker__input" id="projectEconomyPeriodInput" onclick="toggleProjectEconomyPeriodPicker(event)"><img class="SafetyMonthPicker__calendar" src="./src/components/month-picker/calendar.svg" alt="" aria-hidden="true"/><span class="SafetyMonthPicker__value">${getProjectEconomyPeriodLabel(projectEconomyOverviewState.period)}</span><img class="SafetyMonthPicker__arrow" src="./src/components/month-picker/chevron-down.svg" alt="" aria-hidden="true"/></button><div class="SafetyMonthPicker__panel" id="projectEconomyPeriodPanel"></div></div>`;}
document.addEventListener("click",closeProjectEconomyPeriodPicker);

const projectEconomyInternationalWarningFallback=[
  {name:"目标成本预警",code:"GJ-01",level:1,parentCode:""},
  {name:"目标成本额度预警（cost清单额度预警）",code:"GJ-01-01",level:2,parentCode:"GJ-01"},
  {name:"目标利润率预警",code:"GJ-02",level:1,parentCode:""},
  {name:"资金预警",code:"GJ-02-02",level:2,parentCode:"GJ-02"},
  {name:"分包合同产值计量预警",code:"GJ-02-03",level:2,parentCode:"GJ-02"},
  {name:"主材超领预警（钢材、砼、水泥）",code:"GJ-02-04",level:2,parentCode:"GJ-02"},
  {name:"工期异常预警",code:"GJ-02-05",level:2,parentCode:"GJ-02"},
  {name:"结算预警",code:"GJ-03",level:1,parentCode:""},
  {name:"结算金额预警",code:"GJ-03-06",level:2,parentCode:"GJ-03"},
  {name:"结算周期预警",code:"GJ-03-07",level:2,parentCode:"GJ-03"},
  {name:"拖欠款预警",code:"GJ-04",level:1,parentCode:""},
  {name:"拖欠款金额预警",code:"GJ-04-08",level:2,parentCode:"GJ-04"},
  {name:"拖欠款账龄预警",code:"GJ-04-09",level:2,parentCode:"GJ-04"}
];
function getProjectEconomyInternationalWarningItems(){
  if(typeof ensureDataDictionaryLocalLoadedV2284==="function")ensureDataDictionaryLocalLoadedV2284();
  const rows=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.ECONOMY_WARNING_INDEX_INTL||[]):[];
  return rows.length?rows:projectEconomyInternationalWarningFallback;
}
function getProjectEconomyInternationalWarningName(code){
  return getProjectEconomyInternationalWarningItems().find(item=>item.code===code)?.name || projectEconomyInternationalWarningFallback.find(item=>item.code===code)?.name || code;
}
function renderProjectEconomyThunderLevel(value){
  const count=Number(value)===2?2:1;
  return `<img class="project-economy-thunder-level" src="./src/assets/economy-warning/${count===2?"two-thunders.svg":"one-thunder.svg"}" alt="${count===2?"二颗雷":"一颗雷"}"/>`;
}
const projectEconomySubcontractDrillState={subcontractorName:"",creditCode:""};
function getProjectEconomySubcontractMeasurementRows(){
  const source=typeof getProjectEconomyInternationalSignedContractRows==="function"?getProjectEconomyInternationalSignedContractRows():[
    ["劳务分包合同一","劳务","南通鑫联建筑劳务有限公司","2026-06-12",11221607.45,13860000,0,0,"91320623050243852K"],
    ["劳务分包合同二","劳务","南通鑫联建筑劳务有限公司","2026-06-18",3200000,4050000,0,0,"91320623050243852K"]
  ];
  const grouped=new Map();
  source.forEach(row=>{
    const name=row[2]||"-",creditCode=row[8]||"-",key=`${name}|${creditCode}`;
    const current=grouped.get(key)||{subcontractorName:name,creditCode,signedAmount:0,measuredAmount:0};
    current.signedAmount+=Number(row[4])||0;
    current.measuredAmount+=Number(row[5])||0;
    grouped.set(key,current);
  });
  return [...grouped.values()].map(row=>({...row,measurementRate:row.signedAmount?row.measuredAmount/row.signedAmount*100:0})).sort((a,b)=>b.measurementRate-a.measurementRate);
}
function getProjectEconomySubcontractDrillRows(){
  return getProjectEconomySubcontractMeasurementRows().filter(row=>(!projectEconomySubcontractDrillState.subcontractorName||row.subcontractorName.includes(projectEconomySubcontractDrillState.subcontractorName))&&(!projectEconomySubcontractDrillState.creditCode||row.creditCode.includes(projectEconomySubcontractDrillState.creditCode)));
}
function parseProjectEconomyNumber(value,fallback=0){
  const parsed=Number(String(value??"").replace(/,/g,"").replace(/%/g,"").trim());
  return Number.isFinite(parsed)?parsed:fallback;
}
function getProjectEconomyInternationalCostMetrics(project){
  const store=typeof getProjectEconomyInfoStore==="function"?getProjectEconomyInfoStore():{};
  const rawContract=parseProjectEconomyNumber(project?.projectCost,67920364.89);
  const contractWithTax=rawContract<1000000?rawContract*10000:rawContract;
  const contractWithoutTax=parseProjectEconomyNumber(store["总包合同价（不含税）"],contractWithTax/1.09);
  const accruedProfitRate=parseProjectEconomyNumber(store["计提利润率"],4.5)/100;
  const financialExpense=parseProjectEconomyNumber(store["财务费用"],1280000);
  const projectType=typeof getProjectInternationalType==="function"?getProjectInternationalType(project):(store["国际项目属性"]||"非港澳JV项目");
  const taxField=projectType==="港澳JV项目"?store["预计税金成本（含所得税）"]:store["预计税金成本"];
  const estimatedTaxCost=parseProjectEconomyNumber(taxField??store["预计税金成本"],3560000);
  const actualCost=parseProjectEconomyNumber(store["COST总额实际数（不含税）"],86450000);
  return {
    actual:actualCost/10000,
    threshold:Math.max(0,contractWithoutTax-contractWithoutTax*accruedProfitRate-financialExpense-estimatedTaxCost)/10000
  };
}

function getProjectEconomyOverviewData(project){
  const seed=Number(project?.id)||1;
  const contract=Number(project?.projectCost)||67920.4;
  const completed=Math.min(contract,Number(project?.accumulatedOutput)||contract*.62);
  const progress=contract?completed/contract*100:0;
  const international=getProjectEconomyOverviewEdition(project)==="international";
  const domesticTrendDefinitions=["分包分供等合同实际总额(万元)","主体劳务分包含同签订数(个)","专业分包合同匹配率","存货(万元)","资金结余(万元)","单个分包商最大产值计量率","项目管理费使用度","实际税负成本(万元)","关键节点偏差(天)","总包结算价(万元)","结算上报时长(天)","劳务人员一周变化率"].map(name=>({name}));
  const internationalTrendDefinitions=[
    {name:"COST总额实际数（不含税）",unit:"万元",key:"costActual"},
    {name:"所有专业/劳务计量总和",unit:"万元"},
    {name:"单个分包商最大产值计量",unit:"%",key:"subcontractMeasurement",drilldown:true},
    {name:"当期资金结余",unit:"万元"},
    {name:"完工后实际签证额",unit:"万元"},
    {name:"项目预计实际总成本",unit:"万元"},
    {name:"财务费用",unit:"万元"},
    {name:"预计税金成本（含所得税）",unit:"万元"},
    {name:"工程关键节点偏差",unit:"天"},
    {name:"钢筋开累领用量",unit:"t",valueTone:"neutral"},
    {name:"水泥开累领用量",unit:"t",valueTone:"neutral"},
    {name:"商品混凝土开累领用量",unit:"m³",valueTone:"neutral"},
    {name:"业主已计量产值（不含税）",unit:"万元"},
    {name:"到期应收未收款",unit:"万元"},
    {name:"到期应收未收款账龄",unit:"天"}
  ];
  const domesticAlerts=[
    {name:"分包分供等合同预警",color:seed%2?"red":"orange"},
    {name:"潜亏预警（目标利润率负向偏差）",color:["blue","yellow","orange","red"][seed%4]}
  ];
  const internationalAlerts=[
    {name:getProjectEconomyInternationalWarningName("GJ-01"),color:"orange"},
    {name:getProjectEconomyInternationalWarningName("GJ-02"),color:"blue"},
    {name:getProjectEconomyInternationalWarningName("GJ-03"),color:"orange"},
    {name:getProjectEconomyInternationalWarningName("GJ-04"),color:"red"}
  ];
  const alerts=international?internationalAlerts:domesticAlerts;
  const internationalCostMetrics=international?getProjectEconomyInternationalCostMetrics(project):null;
  const riskPriority={red:4,orange:3,yellow:2,blue:1};
  const riskColor=alerts.reduce((highest,item)=>riskPriority[item.color]>riskPriority[highest]?item.color:highest,"blue");
  const domesticWarnings=[
    [domesticAlerts[0].name,"合同额度预警",2,"分包分供合同实际签署总额超过签署总额控制标准","2026-06-18"],
    [domesticAlerts[1].name,"增值税税负预警",2,"进项税额低于计划值，存在税负上升风险","2026-06-15"],
    [domesticAlerts[1].name,"项目管理费预警",1,"项目管理费使用度超过阶段控制标准","2026-06-12"],
    [domesticAlerts[1].name,"资金存货目标利润率关联预警",1,"存货与目标利润率出现负向偏差","2026-06-08"]
  ];
  const internationalWarningCodes=[
    ["GJ-01","GJ-01-01",2,"cost清单额度超过目标成本控制标准","2026-06-18"],
    ["GJ-02","GJ-02-02",2,"项目资金使用情况触发目标利润率风险阈值","2026-06-15"],
    ["GJ-03","GJ-03-06",1,"结算金额与过程确认金额存在异常偏差","2026-06-12"],
    ["GJ-04","GJ-04-09",1,"拖欠款账龄超过国际项目管理控制标准","2026-06-08"]
  ];
  const internationalWarnings=internationalWarningCodes.map(([parentCode,childCode,count,message,date])=>[
    getProjectEconomyInternationalWarningName(parentCode),
    getProjectEconomyInternationalWarningName(childCode),
    count,message,date
  ]);
  return {
    riskColor,
    riskLabel:{red:"高风险",orange:"较高风险",yellow:"一般风险",blue:"低风险"}[riskColor],
    contract,completed,progress,
    targetProfit:(1.2+(seed%7)*.15).toFixed(2),
    alerts,
    reminders:[
      ["完工风险存货<br>（万元）",(32.3+seed*1.1).toFixed(2),"danger"],
      ["安措费<br>核销比例",`${8+seed%9}.00%`,""],
      ["安措费剩余核销<br>金额（万元）",(72.5+seed*2.4).toFixed(2),""],
      ["项目管理费<br>使用度",`${88+seed%14}.60%`,seed%3===0?"danger":""]
    ],
    warnings:international?internationalWarnings:domesticWarnings,
    trends:(international?internationalTrendDefinitions:domesticTrendDefinitions).map((definition,index)=>{
      const {name}=definition;
      const base=Math.max(0,(seed*13+index*17)%160);
      const unit=definition.unit|| (name.includes("率")?"%":name.includes("天")?"天":name.includes("个")?"个":"万元");
      const subcontractMaxRate=definition.key==="subcontractMeasurement"?(getProjectEconomySubcontractMeasurementRows()[0]?.measurementRate||0):0;
      const value=definition.key==="costActual"?internationalCostMetrics.actual:definition.key==="subcontractMeasurement"?subcontractMaxRate:unit==="%"?Math.min(126,45+base/2):unit==="个"?2+seed%12:unit==="天"?(index%2?70:-12+seed%30):(base*42.6+82.85);
      const threshold=definition.key==="costActual"?internationalCostMetrics.threshold:definition.key==="subcontractMeasurement"?100:unit==="%"?80:unit==="个"?12:unit==="天"?45:Math.max(90,value*.82);
      const currentValue=Number(value.toFixed?.(2)??value);
      const wavePattern=[.86,1.02,.91,1.07,1];
      const waveScale=unit==="%"?.9:unit==="个"?.15:unit==="天"?.45:7.2;
      const series=getProjectEconomyTrendPeriods().map((period,i)=>({period,value:Number(Math.max(0,currentValue*wavePattern[i]+(((seed+index*3+i*5)%7)-3)*waveScale).toFixed(2))}));
      series[series.length-1].value=currentValue;
      return {name,value:currentValue,threshold:Number(threshold.toFixed?.(2)??threshold),unit,color:definition.valueTone||(index%4===0?"red":index%4===1?"orange":"blue"),showInfo:!international,drilldown:definition.drilldown,series};
    })
  };
}

function setProjectEconomyPeriod(value){
  projectEconomyOverviewState.period=value||"2026-06";
  const embed=document.getElementById("economyProjectOverviewEmbed");
  if(embed&&window.__economyProjectOverviewEmbedProject){
    embed.innerHTML=renderProjectEconomyOverviewContent(window.__economyProjectOverviewEmbedProject);
    return;
  }
  renderProjectEconomyOverviewPage();
}
function renderProjectEconomySectionTitle(title,extra=""){return `<div class="project-economy-section-title"><span></span><strong>${title}</strong>${extra}</div>`;}
function getProjectEconomyTrendGeometry(item){
  const values=item.series.map(point=>point.value).concat(item.threshold),min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
  const points=item.series.map((point,index)=>({x:6+index*22,y:70-(point.value-min)/range*53,...point}));
  return {points,thresholdY:70-(item.threshold-min)/range*53};
}
function renderProjectEconomyTrendSvg(item){
  const {points,thresholdY}=getProjectEconomyTrendGeometry(item);
  const curve=points.reduce((path,point,index)=>{if(!index)return `M ${point.x} ${point.y}`;const previous=points[index-1],mid=(previous.x+point.x)/2;return `${path} C ${mid} ${previous.y}, ${mid} ${point.y}, ${point.x} ${point.y}`;},"");
  const area=`${curve} L ${points.at(-1).x} 82 L ${points[0].x} 82 Z`;
  return `<svg viewBox="0 0 100 82" preserveAspectRatio="none" role="img" aria-label="${item.name}近五期趋势"><line x1="2" y1="${thresholdY}" x2="98" y2="${thresholdY}" class="threshold"></line><path d="${area}" class="trend-area"></path><path d="${curve}" class="trend-line"></path></svg>`;
}
function renderProjectEconomyTrendHover(item){
  const {points}=getProjectEconomyTrendGeometry(item);
  return `<div class="project-economy-trend-hover-layer">${points.map((point,index)=>{
    const [year,month]=String(point.period).split("-");
    const periodText=`${year}年${month}月`;
    const displayValue=formatProjectEconomyTrendValue(item,point.value,true);
    return `<button type="button" class="project-economy-trend-hit ${index<2?"align-left":index>2?"align-right":"align-center"}" style="left:${point.x}%;--point-top:${(point.y/82*100).toFixed(2)}%" aria-label="${point.period} ${item.name} ${displayValue}"><i></i><span class="project-economy-trend-tooltip"><b>诊断期数<span>（${periodText}）</span></b><span class="project-economy-trend-tooltip-head"><em>统计指标</em><strong>统计值</strong></span><span class="project-economy-trend-tooltip-value"><u></u><em title="${item.name}">${item.name}</em><strong>${displayValue}</strong></span></span></button>`;
  }).join("")}</div>`;
}
function formatProjectEconomyTrendValue(item,value,withUnit=false){
  if(item.format==="date"){
    const date=new Date(Number(value));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}-${String(date.getUTCDate()).padStart(2,"0")}`;
  }
  const text=Number(value).toLocaleString("zh-CN",{maximumFractionDigits:2});
  return withUnit?`${text}${item.unit}`:text;
}
function renderProjectEconomyTrendCard(item){
  const {thresholdY}=getProjectEconomyTrendGeometry(item);
  const valueText=formatProjectEconomyTrendValue(item,item.value);
  const thresholdText=formatProjectEconomyTrendValue(item,item.threshold,true);
  const valueContent=item.drilldown?`<button type="button" class="project-economy-trend-drill-value" onclick="openProjectEconomySubcontractMeasurementDrill()" title="查看分包产值计量率">${valueText}<small>${item.unit}</small></button>`:`${valueText}<small>${item.unit}</small>`;
  return `<article class="project-economy-trend-card ${item.color}"><h4>${item.name}${item.showInfo===false?"":'<span title="指标说明">i</span>'}</h4><strong>${valueContent}</strong><div class="project-economy-trend-chart" style="--threshold-top:${(thresholdY/82*100).toFixed(2)}%">${renderProjectEconomyTrendSvg(item)}<em>${thresholdText}</em>${renderProjectEconomyTrendHover(item)}</div></article>`;
}
function renderProjectEconomySubcontractMeasurementDrill(){
  const rows=getProjectEconomySubcontractDrillRows();
  const body=document.getElementById("projectEconomySubcontractDrillBody");
  if(!body)return;
  const money=value=>Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2});
  body.innerHTML=`<div class="send-drill-modal economy-warning-project-drill project-economy-subcontract-drill">
    ${renderUnifiedQueryCard(`<div class="form-item"><label>分包商名称</label><input class="input" id="projectEconomySubcontractName" value="${escapeAttr(projectEconomySubcontractDrillState.subcontractorName)}" placeholder="请输入分包商名称"/></div><div class="form-item"><label>分包商信用代码</label><input class="input" id="projectEconomySubcontractCredit" value="${escapeAttr(projectEconomySubcontractDrillState.creditCode)}" placeholder="请输入分包商信用代码"/></div>`,{id:"projectEconomySubcontractQuery",title:"查询条件",resetFn:"resetProjectEconomySubcontractMeasurementDrill()",queryFn:"queryProjectEconomySubcontractMeasurementDrill()",gridClass:"search-grid"})}
    <section class="card table-card economy-warning-drill-table-card project-economy-subcontract-table"><div class="card-hd"><div class="card-title">分包产值计量率</div></div><div class="table-wrap"><table><thead><tr><th>序号</th><th>分包单位名称</th><th>实际签署合同额（元）</th><th>产值计量额（元）</th><th>计量率</th></tr></thead><tbody>${rows.map((row,index)=>`<tr class="${row.measurementRate>=100?'measurement-rate-overrun':''}"><td>${index+1}</td><td title="${escapeAttr(row.subcontractorName)}">${row.subcontractorName}</td><td>${money(row.signedAmount)}</td><td>${money(row.measuredAmount)}</td><td>${row.measurementRate.toFixed(2)}%</td></tr>`).join("")||'<tr><td colspan="5" class="center">暂无数据</td></tr>'}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页&nbsp;&nbsp;每页 50 条</span></div></section>
  </div>`;
}
function openProjectEconomySubcontractMeasurementDrill(){
  Object.assign(projectEconomySubcontractDrillState,{subcontractorName:"",creditCode:""});
  closeProjectEconomySubcontractMeasurementDrill();
  const layer=document.createElement("div");
  layer.id="projectEconomySubcontractDrillLayer";
  layer.className="project-economy-nested-modal-layer";
  layer.innerHTML=`<div class="project-economy-nested-modal-mask" onclick="closeProjectEconomySubcontractMeasurementDrill()"></div>
    <section class="modal large send-drill-modal-box economy-warning-drill-modal project-economy-subcontract-modal nested-modal" role="dialog" aria-modal="true" aria-labelledby="projectEconomySubcontractDrillTitle">
      <div class="modal-hd"><span id="projectEconomySubcontractDrillTitle">单个分包商最大产值计量</span><div class="modal-hd-actions"><span class="close" onclick="closeProjectEconomySubcontractMeasurementDrill()">×</span></div></div>
      <div class="modal-bd" id="projectEconomySubcontractDrillBody"></div>
      <div class="modal-ft"><button class="btn" onclick="closeProjectEconomySubcontractMeasurementDrill()">关闭</button></div>
    </section>`;
  document.body.appendChild(layer);
  renderProjectEconomySubcontractMeasurementDrill();
}
function closeProjectEconomySubcontractMeasurementDrill(){document.getElementById("projectEconomySubcontractDrillLayer")?.remove();}
function queryProjectEconomySubcontractMeasurementDrill(){
  projectEconomySubcontractDrillState.subcontractorName=document.getElementById("projectEconomySubcontractName")?.value.trim()||"";
  projectEconomySubcontractDrillState.creditCode=document.getElementById("projectEconomySubcontractCredit")?.value.trim()||"";
  renderProjectEconomySubcontractMeasurementDrill();
}
function resetProjectEconomySubcontractMeasurementDrill(){Object.assign(projectEconomySubcontractDrillState,{subcontractorName:"",creditCode:""});renderProjectEconomySubcontractMeasurementDrill();}
function renderProjectEconomyInternationalReminderGrid(){
  return `<div class="project-economy-key-reminder-grid">
    <article class="project-economy-key-reminder-card general"><h3><i>♙</i>通用提醒指标</h3><div class="project-economy-key-reminder-values three"><div class="danger"><span>营收产值偏差值</span><div class="project-economy-reminder-inline-value"><strong>-32.17</strong><em>万元</em></div></div><div><span>计提利润率</span><strong>4.82<small>%</small></strong></div><div><span>考核目标利润率</span><strong>5.20<small>%</small></strong></div></div></article>
    <article class="project-economy-key-reminder-card contract"><h3><i>▣</i>合同类提醒指标</h3><div class="project-economy-key-reminder-values two"><div><span>主体（主要）<br>劳务合同实际签署个数</span><strong>32 <small>个</small></strong></div><div><span>主体（主要）<br>专业分包合同实际签署个数</span><strong>18 <small>个</small></strong></div></div></article>
    <article class="project-economy-key-reminder-card exchange"><h3><i>◉</i>汇率相关提醒指标<em>本币：USD / 原币：CNY</em></h3><div class="project-economy-key-reminder-values three"><div><span>目标成本测算时的<br>目标汇率</span><strong>1 <small>USD</small> = 7.10 <small>CNY</small></strong></div><div><span>交割兑换时的<br>实际汇率</span><strong>1 <small>USD</small> = 7.24 <small>CNY</small></strong></div><div><span>当前汇率</span><strong>1 <small>USD</small> = 7.18 <small>CNY</small></strong></div></div></article>
    <article class="project-economy-key-reminder-card jv"><h3><i>♟</i>JV项目专属提醒指标<em>JV项目适用</em></h3><div class="project-economy-jv-reminder-table"><b aria-hidden="true"></b><b>分成比例</b><b>投入资金</b><b>管理人员数量</b><strong>我方</strong><span>55<small>%</small></span><span>860.00<small>万元</small></span><span>12<small>人</small></span><strong>合作方</strong><span>45<small>%</small></span><span>700.00<small>万元</small></span><span>9<small>人</small></span></div></article>
  </div>`;
}
function renderProjectEconomyWarningPanel(data,international){
  const alertTags=international?`<div class="project-economy-warning-alerts">${data.alerts.map(item=>`<div class="${item.color}"><strong>${item.name}</strong><i></i></div>`).join("")}</div>`:"";
  const alertColors=new Map(data.alerts.map(item=>[item.name,item.color]));
  return `<section class="project-economy-panel project-economy-warning-panel">${renderProjectEconomySectionTitle("预警明细")}${alertTags}<div class="table-wrap"><table><thead><tr><th>一级指标</th><th>二级指标</th><th>等级</th><th>预警提示</th><th>预警日期</th></tr></thead><tbody>${data.warnings.map(row=>`<tr><td><i class="project-economy-level-block ${alertColors.get(row[0])||'blue'}"></i>${row[0]}</td><td>${row[1]}</td><td><span class="project-economy-level-bombs">${renderProjectEconomyThunderLevel(row[2])}</span></td><td>${row[3]}</td><td class="center">${row[4]}</td></tr>`).join("")}</tbody></table></div></section>`;
}
function getProjectEconomyOverviewEdition(project){return project?.subCompany==="城建国际"?"international":"domestic";}
function renderProjectEconomyOverviewEditionContent(project,edition){
  if(!project)return "";
  const data=getProjectEconomyOverviewData(project);
  const [province,city]=(project.provinceCity||"上海市/上海市").split("/");
  const editionName=edition==="international"?"国际版":"国内版";
  return `<div class="project-economy-overview-page ${edition}">
    <header class="project-economy-overview-header"><div><span>↗</span><h1>数智施工项目经济管理平台 -${editionName}</h1></div><div class="project-economy-header-actions"><label>诊断期数</label>${renderProjectEconomyPeriodPicker()}<button class="btn primary project-economy-download" onclick="showToast('月度检验报告下载成功')"><img src="./src/assets/economy/download.svg" alt="" aria-hidden="true">月度检验报告</button></div></header>
    <div class="project-economy-dashboard-grid">
      <div class="project-economy-left">
        <section class="project-economy-project-card ${data.riskColor}"><div class="project-economy-project-head"><h2>${project.projectName}</h2><div>风险状态：<b>${data.riskLabel}</b><i></i></div></div><div class="project-economy-project-info">${[["所属公司",`${project.subCompany}/${project.branchCompany}`],["建设单位",project.builder],["项目经理",project.projectManager],["项目状态",project.projectStatus],["项目板块",project.projectType],["项目区域",project.region||`${province}${city}`],["计划开工",project.planStart||"2026-01-15"],["计划完工",project.planEnd||"2027-12-20"],["项目工期",`${project.planDuration||365}天`],["项目合同总额",`${(data.contract/10).toLocaleString('zh-CN',{maximumFractionDigits:2})}万元`],["目标利润率（含税）",`${data.targetProfit}%`]].map(([label,value])=>`<div><span>${label}：</span><strong>${value||"-"}</strong></div>`).join("")}</div></section>
        ${edition==="international"?renderProjectEconomyInternationalReminderGrid():`<div class="project-economy-risk-row"><section class="project-economy-panel">${renderProjectEconomySectionTitle("一级指标风险状态")}<div class="project-economy-risk-list">${data.alerts.map(item=>`<div class="${item.color}"><strong>${item.name}</strong><i></i></div>`).join("")}</div></section><section class="project-economy-panel">${renderProjectEconomySectionTitle("提醒指标")}<div class="project-economy-reminders">${data.reminders.map(([label,value,state])=>`<div class="${state}"><strong>${value}</strong><span>${label}</span></div>`).join("")}</div></section></div>`}
        ${renderProjectEconomyWarningPanel(data,edition==="international")}
      </div>
      <div class="project-economy-right"><section class="project-economy-panel project-economy-live-panel">${renderProjectEconomySectionTitle("实时项目数据")}<div class="project-economy-live-metrics">${[["开累产值(万元)",data.contract/10,"▰"],["开累营收(万元)",data.completed/10,"▰"],["开累产值完成率",data.progress,"%"]].map(([label,value,unit])=>`<div><i>${unit}</i><strong>${Number(value).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}<em>${unit==="%"?"%":""}</em></strong><span>${label}</span></div>`).join("")}</div></section><section class="project-economy-panel project-economy-trends-panel">${renderProjectEconomySectionTitle("实时趋势分析",'<em>（近5次）</em><div class="project-economy-trend-legend"><span><img src="./src/assets/economy/trend-actual.svg" alt="">实际值</span><span><img src="./src/assets/economy/trend-threshold.svg" alt="">阈值</span></div>')}<div class="project-economy-trend-grid">${data.trends.map(renderProjectEconomyTrendCard).join("")}</div></section></div>
    </div></div>`;
}
function renderProjectEconomyOverviewDomesticContent(project){return renderProjectEconomyOverviewEditionContent(project,"domestic");}
function renderProjectEconomyOverviewInternationalContent(project){return renderProjectEconomyOverviewEditionContent(project,"international");}
function renderProjectEconomyOverviewContent(project){
  return getProjectEconomyOverviewEdition(project)==="international"?renderProjectEconomyOverviewInternationalContent(project):renderProjectEconomyOverviewDomesticContent(project);
}
function renderProjectEconomyOverviewPage(){
  const project=getCurrentProjectContext();
  if(!project)return renderProjectPlaceholderPage("经济总览");
  window.__economyProjectOverviewEmbedProject=null;
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.style.overflow="auto";
  listPage.innerHTML=renderProjectEconomyOverviewContent(project);
}
