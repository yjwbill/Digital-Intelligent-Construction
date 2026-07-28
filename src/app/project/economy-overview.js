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
function renderProjectEconomyPeriodPicker(){return `<div class="SafetyMonthPicker project-economy-period-picker" onclick="event.stopPropagation()"><button type="button" class="SafetyMonthPicker__input" id="projectEconomyPeriodInput" onclick="toggleProjectEconomyPeriodPicker(event)"><span class="SafetyMonthPicker__calendar" aria-hidden="true">▣</span><span class="SafetyMonthPicker__value">${getProjectEconomyPeriodLabel(projectEconomyOverviewState.period)}</span><span class="SafetyMonthPicker__arrow" aria-hidden="true">⌄</span></button><div class="SafetyMonthPicker__panel" id="projectEconomyPeriodPanel"></div></div>`;}
document.addEventListener("click",closeProjectEconomyPeriodPicker);

function getProjectEconomyOverviewData(project){
  const seed=Number(project?.id)||1;
  const contract=Number(project?.projectCost)||67920.4;
  const completed=Math.min(contract,Number(project?.accumulatedOutput)||contract*.62);
  const progress=contract?completed/contract*100:0;
  const levels=["red","orange","yellow","blue"];
  const riskColor=levels[seed%levels.length];
  const trendNames=["分包分供等合同实际总额(万元)","主体劳务分包含同签订数(个)","专业分包合同匹配率","存货(万元)","资金结余(万元)","单个分包商最大产值计量率","项目管理费使用度","实际税负成本(万元)","关键节点偏差(天)","总包结算价(万元)","结算上报时长(天)","劳务人员一周变化率"];
  return {
    riskColor,
    riskLabel:{red:"高风险",orange:"较高风险",yellow:"一般风险",blue:"低风险"}[riskColor],
    contract,completed,progress,
    targetProfit:(1.2+(seed%7)*.15).toFixed(2),
    alerts:[
      {name:"分包分供等合同预警",color:seed%2?"red":"orange"},
      {name:"潜亏预警（目标利润率负向偏差）",color:riskColor}
    ],
    reminders:[
      ["完工风险存货(万元)",(32.3+seed*1.1).toFixed(2),"danger"],
      ["安措费核销比例",`${8+seed%9}.00%`,""],
      ["安措费剩余核销金额(万元)",(72.5+seed*2.4).toFixed(2),""],
      ["项目管理费使用度",`${88+seed%14}.60%`,seed%3===0?"danger":""]
    ],
    warnings:[
      ["分包分供等合同预警","合同额度预警","严重","分包分供合同实际签署总额超过签署总额控制标准","2026-06-18"],
      ["潜亏预警","增值税税负预警","较高","进项税额低于计划值，存在税负上升风险","2026-06-15"],
      ["潜亏预警","项目管理费预警","较高","项目管理费使用度超过阶段控制标准","2026-06-12"],
      ["潜亏预警","资金存货目标利润率关联预警","一般","存货与目标利润率出现负向偏差","2026-06-08"]
    ],
    trends:trendNames.map((name,index)=>{
      const base=Math.max(0,(seed*13+index*17)%160);
      const unit=name.includes("率")?"%":name.includes("天")?"天":name.includes("个")?"个":"万元";
      const value=unit==="%"?Math.min(126,45+base/2):unit==="个"?2+seed%12:unit==="天"?(index%2?70:-12+seed%30):(base*42.6+82.85);
      const threshold=unit==="%"?80:unit==="个"?12:unit==="天"?45:Math.max(90,value*.82);
      const currentValue=Number(value.toFixed?.(2)??value);
      const series=getProjectEconomyTrendPeriods().map((period,i)=>({period,value:Number(Math.max(0,currentValue*(.72+i*.065)+(((seed+index*3+i*5)%9)-4)*(unit==="%"?.8:unit==="个"?.12:unit==="天"?.35:6.8)).toFixed(2))}));
      series[series.length-1].value=currentValue;
      return {name,value:currentValue,threshold:Number(threshold.toFixed?.(2)??threshold),unit,color:index%4===0?"red":index%4===1?"orange":"blue",series};
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
function renderProjectEconomyTrendSvg(item){
  const values=item.series.map(point=>point.value).concat(item.threshold),min=Math.min(...values),max=Math.max(...values),range=Math.max(1,max-min);
  const points=item.series.map((point,index)=>({x:6+index*22,y:61-(point.value-min)/range*45,...point}));
  const thresholdY=61-(item.threshold-min)/range*45;
  const curve=points.reduce((path,point,index)=>{if(!index)return `M ${point.x} ${point.y}`;const previous=points[index-1],mid=(previous.x+point.x)/2;return `${path} C ${mid} ${previous.y}, ${mid} ${point.y}, ${point.x} ${point.y}`;},"");
  const area=`${curve} L ${points.at(-1).x} 68 L ${points[0].x} 68 Z`;
  return `<svg viewBox="0 0 100 72" preserveAspectRatio="none" role="img" aria-label="${item.name}近五期趋势"><line x1="2" y1="${thresholdY}" x2="98" y2="${thresholdY}" class="threshold"></line><path d="${area}" class="trend-area"></path><path d="${curve}" class="trend-line"></path>${points.map(point=>`<circle class="trend-point" cx="${point.x}" cy="${point.y}" r="2.6"></circle>`).join("")}</svg>`;
}
function renderProjectEconomyTrendHover(item){
  return `<div class="project-economy-trend-hover-layer">${item.series.map((point,index)=>`<button type="button" class="project-economy-trend-hit ${index<2?"align-left":index>2?"align-right":"align-center"}" style="left:${6+index*22}%" aria-label="${point.period} ${item.name} ${point.value}${item.unit}"><i></i><span class="project-economy-trend-tooltip"><b>${point.period}</b><span><u class="${item.color}"></u><em title="${item.name}">${item.name}</em><strong>${Number(point.value).toLocaleString("zh-CN",{maximumFractionDigits:2})}${item.unit}</strong></span></span></button>`).join("")}</div>`;
}
function renderProjectEconomyTrendCard(item){
  const valueText=`${item.value.toLocaleString('zh-CN',{maximumFractionDigits:2})}${item.unit}`;
  return `<article class="project-economy-trend-card ${item.color}"><h4>${item.name}<span title="指标说明">i</span></h4><strong>${valueText}</strong><div class="project-economy-trend-chart">${renderProjectEconomyTrendSvg(item)}<em>${item.threshold}${item.unit}</em>${renderProjectEconomyTrendHover(item)}</div></article>`;
}
function renderProjectEconomyOverviewContent(project){
  if(!project)return "";
  const data=getProjectEconomyOverviewData(project);
  const [province,city]=(project.provinceCity||"上海市/上海市").split("/");
  return `<div class="project-economy-overview-page">
    <header class="project-economy-overview-header"><div><span>↗</span><h1>数智施工项目经济管理平台</h1></div><div class="project-economy-header-actions"><label>诊断期数</label>${renderProjectEconomyPeriodPicker()}<button class="btn primary" onclick="showToast('月度检验报告下载成功')"><span aria-hidden="true">⇩</span>月度检验报告</button></div></header>
    <div class="project-economy-dashboard-grid">
      <div class="project-economy-left">
        <section class="project-economy-project-card ${data.riskColor}"><div class="project-economy-project-head"><h2>${project.projectName}</h2><div>风险状态：<b>${data.riskLabel}</b><i></i></div></div><div class="project-economy-project-info">${[["所属公司",`${project.subCompany}/${project.branchCompany}`],["建设单位",project.builder],["项目经理",project.projectManager],["项目状态",project.projectStatus],["项目板块",project.projectType],["项目区域",project.region||`${province}${city}`],["计划开工",project.planStart||"2026-01-15"],["计划完工",project.planEnd||"2027-12-20"],["项目工期",`${project.planDuration||365}天`],["项目合同总额",`${(data.contract/10).toLocaleString('zh-CN',{maximumFractionDigits:2})}万元`],["目标利润率（含税）",`${data.targetProfit}%`]].map(([label,value])=>`<div><span>${label}：</span><strong>${value||"-"}</strong></div>`).join("")}</div></section>
        <div class="project-economy-risk-row"><section class="project-economy-panel">${renderProjectEconomySectionTitle("一级指标风险状态")}<div class="project-economy-risk-list">${data.alerts.map(item=>`<div class="${item.color}"><strong>${item.name}</strong><i></i></div>`).join("")}</div></section><section class="project-economy-panel">${renderProjectEconomySectionTitle("提醒指标")}<div class="project-economy-reminders">${data.reminders.map(([label,value,state])=>`<div class="${state}"><strong>${value}</strong><span>${label}</span></div>`).join("")}</div></section></div>
        <section class="project-economy-panel project-economy-warning-panel">${renderProjectEconomySectionTitle("预警明细")}<div class="table-wrap"><table><thead><tr><th>一级指标</th><th>二级指标</th><th>等级</th><th>预警提示</th><th>预警日期</th></tr></thead><tbody>${data.warnings.map((row,index)=>`<tr><td><i class="project-economy-level-block ${index===0?'red':index===1?'orange':index===2?'yellow':'blue'}"></i>${row[0]}</td><td>${row[1]}</td><td><span class="project-economy-level-bombs">${row[2]==="严重"?"●●●":row[2]==="较高"?"●●":"●"}</span></td><td>${row[3]}</td><td class="center">${row[4]}</td></tr>`).join("")}</tbody></table></div></section>
      </div>
      <div class="project-economy-right"><section class="project-economy-panel project-economy-live-panel">${renderProjectEconomySectionTitle("实时项目数据")}<div class="project-economy-live-metrics">${[["开累产值(万元)",data.contract/10,"▰"],["开累营收(万元)",data.completed/10,"▰"],["开累产值完成率",data.progress,"%"]].map(([label,value,unit])=>`<div><i>${unit}</i><strong>${Number(value).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}<em>${unit==="%"?"%":""}</em></strong><span>${label}</span></div>`).join("")}</div></section><section class="project-economy-panel project-economy-trends-panel">${renderProjectEconomySectionTitle("实时趋势分析",'<em>（近5次）</em><div class="project-economy-trend-legend"><span>⌁ 实际值</span><span>┄ 阈值</span></div>')}<div class="project-economy-trend-grid">${data.trends.map(renderProjectEconomyTrendCard).join("")}</div></section></div>
    </div></div>`;
}
function renderProjectEconomyOverviewPage(){
  const project=getCurrentProjectContext();
  if(!project)return renderProjectPlaceholderPage("经济总览");
  window.__economyProjectOverviewEmbedProject=null;
  detailPage.style.display="none";
  listPage.style.display="flex";
  listPage.innerHTML=renderProjectEconomyOverviewContent(project);
}
