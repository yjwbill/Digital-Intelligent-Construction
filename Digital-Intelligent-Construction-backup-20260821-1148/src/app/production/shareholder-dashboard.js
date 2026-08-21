/* 股份看板 / 集团工程管理驾驶舱 */
(function(){
  const topMetrics=[
    ["src/assets/shareholder-dashboard/01_生产项目.svg","生产项目","2,365","个","当月立项","+128 ↑"],
    ["src/assets/shareholder-dashboard/02_合同总额.svg","合同总额（亿元）","2,943.52","","",""],
    ["src/assets/shareholder-dashboard/03_年度累计产值.svg","年度累计产值（亿元）","1,892.47","","",""],
    ["src/assets/shareholder-dashboard/04_产值完成率.svg","产值完成率","68.42","%","",""],
    ["src/assets/shareholder-dashboard/05_安全纳管项目.svg","安全纳管项目","1,428","个","覆盖率","75.8%"],
    ["src/assets/shareholder-dashboard/06_经济纳管项目.svg","经济纳管项目","1,892","个","覆盖率","72.8%"],
    ["src/assets/shareholder-dashboard/07_重大风险项目.svg","重大风险项目","67","个","",""],
    ["src/assets/shareholder-dashboard/08_重大工程项目.svg","重大工程项目","71","个","",""]
  ];
  const riskItems=[
    ["production","生产","进度延期项目","⏳","82","个","+12 ↑"],["production","生产","产值滞后项目","📉","67","个","+9 ↑"],["production","生产","风险施工项目","🚧","31","个","+6 ↑"],["production","生产","技术方案超期项目","📋","14","个","+2 ↑"],["production","生产","工程巡查单未闭环项目","🔄","101","个","+11 ↑"],["production","生产","发生险情/质量事故项目","🚨","12","个","+4 ↑"],
    ["safety","安全","关键岗位未配足项目","👥","23","个","+3 ↑"],["safety","安全","关键岗位未到岗项目","👷","36","个","+5 ↑"],["safety","安全","隐患升级项目","🔥","18","个","+4 ↑"],["safety","安全","重大事故隐患项目","⚠️","24","个","+5 ↑"],["safety","安全","重复隐患项目","🔁","42","个","+7 ↑"],["safety","安全","监控长时间离线项目","📹","17","个","+3 ↑"]
  ];
  const factors=[["👥","劳动力",["进场人数","21,860","人"],["关键岗位配足率","90.8","%"],["关键岗位到岗率","91.3","%"]],["🏗","设备",["进场设备数","698","台"],["智能监管接入数","664","台"],["智能监管接入率","95.2","%"]],["📦","材料",["合同用量","52.13","万吨"],["开累领用量","20.14","万吨"],["超领项目数","23","个"]],["🍃","低碳",["申报量","38.76","万吨"],["外运量","20.45","万吨"],["外运完成率","78.5","%"]]];
  let shareFulfillmentMode="output";
  let lifecycleAnalysisMode="company";
  let shareDashboardMode="engineering";
  const fulfillmentModes={
    output:{title:"产值履约趋势",barLabel:"产值（亿元）",bars:[142.35,318.72,501.48,689.63,882.17,1086.42,1288.76,1462.38,1607.44,1749.68,1881.36,2000],scale:2000,ticks:[2000,1500,1000,500,0],bar:"#267cff",plan:"#55728d",decimals:2},
    progress:{title:"进度履约趋势",barLabel:"进度节点",bars:[118,256,402,563,728,891,1058,1216,1332,1436,1524,1600],scale:1600,ticks:[1600,1200,800,400,0],bar:"#20cbcd",plan:"#55728d",decimals:0},
    risk:{title:"风险履约趋势",barLabel:"风险项",bars:[24,55,91,132,177,224,270,312,341,364,384,400],scale:400,ticks:[400,300,200,100,0],bar:"#ffa52f",plan:"#55728d",decimals:0},
    award:{title:"创奖履约趋势",barLabel:"创奖项",bars:[3,7,12,18,25,32,39,45,50,54,57,60],scale:60,ticks:[60,45,30,15,0],bar:"#a879f8",plan:"#55728d",decimals:0}
  };
  function panelTitle(no,title){return `<div class="share-panel-title"><b>${no}</b><strong>${title}</strong></div>`;}
  function topHtml(){return topMetrics.map((x,i)=>`<div class="share-top-metric ${i>5?'danger':''}" role="button" tabindex="0" onclick="shareDashboardDrill('${x[1]}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><i><img src="${x[0]}" alt="" aria-hidden="true"></i><div><span>${x[1]}</span><strong>${x[2]}<em>${x[3]}</em></strong>${x[4]?`<small>${x[4]} <b>${x[5]}</b></small>`:""}</div></div>`).join("");}
  function dashboardCompanyNames(){
    const companies=typeof getOrganizationCompanies==="function"?getOrganizationCompanies():[];
    return companies.length?companies:["上海隧道","市政集团","上海路桥","城市环境","上海能建","城建设计","城市运营","数字集团","地空公司","城建国际","轨交分公司","江西分公司"];
  }
  function lifecycle(){
    const companyNames=dashboardCompanyNames();
    const analysisModes={
      company:{label:"按公司",donut:"按公司<br>项目数占比",items:companyNames.map((name,index)=>[name,Math.max(136,426-index*21)])},
      type:{label:"按类型",donut:"按类型<br>项目数占比",items:[["市政工程",648],["轨道交通",536],["公路工程",428],["房建工程",316],["水利工程",244]]},
      customer:{label:"按重点客户",donut:"按重点客户<br>项目数占比",items:[["上海申通地铁",286],["上海城投",253],["上海建工",217],["杭州地铁",196],["江苏交投",164]]},
      region:{label:"按区域",donut:"按区域<br>项目数占比",items:[["长三角区域",816],["大湾区域",544],["中原区域",388],["海南",173],["境外区域",245]]}
    };
    const analysis=analysisModes[lifecycleAnalysisMode]||analysisModes.company;
    const maxAnalysisValue=Math.max(...analysis.items.map(x=>x[1]));
    const lifecycleNodes=[["src/assets/shareholder-dashboard/lifecycle-pending.png","待建","177"],["src/assets/shareholder-dashboard/lifecycle-building.png","在建","1,196"],["src/assets/shareholder-dashboard/lifecycle-completed.png","完工","489"],["src/assets/shareholder-dashboard/lifecycle-closed.png","竣工","503"]];
    return `<section class="share-panel lifecycle">${panelTitle(1,"项目全生命周期")}<div class="life-flow">${lifecycleNodes.map((x,i)=>`${i?'<i class="flow-arrow">➜</i>':''}<div><b><img src="${x[0]}" alt="" aria-hidden="true"></b><span>${x[1]}</span><strong>${x[2]}</strong></div>`).join("")}</div><div class="life-summary">${[["当年开工","351"],["当年完工","284"],["当年竣工","163"],["当前停工","48"]].map(x=>`<div><span>${x[0]}</span><b>${x[1]}<em> 个</em></b></div>`).join("")}</div><div class="project-analysis"><h4><span>项目分析</span><div class="lifecycle-analysis-tabs" role="tablist" aria-label="项目分析维度">${Object.entries(analysisModes).map(([key,x])=>`<button type="button" role="tab" class="${lifecycleAnalysisMode===key?'active':''}" aria-selected="${lifecycleAnalysisMode===key}" onclick="setLifecycleAnalysisMode('${key}')">${x.label}</button>`).join("")}</div></h4><div class="analysis-body"><div class="rank-list">${analysis.items.map((x,i)=>`<p><i>${i+1}</i><span title="${x[0]}">${x[0]}</span><b style="--w:${x[1]/maxAnalysisValue*100}%"></b><em>${x[1]}</em></p>`).join("")}</div><div class="share-donut"><b>${analysis.donut}</b></div></div></div></section>`;
  }
  function fulfillment(){
    const cards=[
      ["output","src/assets/shareholder-dashboard/fulfillment-output.png","产值",[["计划（亿元）","2,000.00"],["完成（亿元）","1,462.38"],["完成率","73.12%"]]],
      ["progress","src/assets/shareholder-dashboard/fulfillment-progress.png","进度",[["计划节点","1,600"],["完成节点","1,216"],["完成率","76%"]]],
      ["risk","src/assets/shareholder-dashboard/fulfillment-risk.png","风险",[["计划项","400"],["完成项","312"],["完成率","78%"]]],
      ["award","src/assets/shareholder-dashboard/fulfillment-award.png","创奖",[["年度目标","60"],["创奖数","45"],["达成率","75%"]]]
    ];
    const mode=fulfillmentModes[shareFulfillmentMode]||fulfillmentModes.output;
    const waterfallScale=mode.scale;
    const monthlyValues=mode.bars.map((value,index)=>index===0?value:value-mode.bars[index-1]);
    return `<section class="share-panel fulfillment" style="--fulfill-bar:${mode.bar};--fulfill-plan:${mode.plan}">${panelTitle(2,"年度生产履约")}<div class="fulfill-cards">${cards.map(x=>`<div class="fulfill-mode-card ${shareFulfillmentMode===x[0]?'selected':''}" role="button" tabindex="0" aria-pressed="${shareFulfillmentMode===x[0]}" onclick="setShareFulfillmentMode('${x[0]}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><h4><img src="${x[1]}" alt="" aria-hidden="true"><span>${x[2]}</span></h4>${x[3].map(y=>`<p><span>${y[0]}</span><b>${y[1]}</b></p>`).join("")}</div>`).join("")}</div><div class="trend-title">${mode.title}</div><div class="share-chart"><div class="chart-y-axis" aria-hidden="true">${mode.ticks.map(x=>`<span>${x}</span>`).join("")}</div><div class="chart-grid"></div><div class="chart-bars waterfall-bars">${monthlyValues.map((value,index)=>{const start=index===0?0:mode.bars[index-1];const display=Number(value.toFixed(mode.decimals)).toLocaleString('zh-CN',{minimumFractionDigits:mode.decimals,maximumFractionDigits:mode.decimals});return `<div class="${index<8?'actual':'planned'}" style="--waterfall-bottom:${start/waterfallScale*100}%;--waterfall-height:${value/waterfallScale*100}%"><em>${display}</em><b></b><span>${index+1}月</span></div>`;}).join("")}</div></div><div class="fulfillment-chart-legend"><span class="bar actual"><i></i>实际完成值</span><span class="bar planned"><i></i>计划完成值</span></div></section>`;
  }
  function risks(){return `<section class="share-panel risks">${panelTitle(3,"异常指标总览")}<div class="risk-grid">${riskItems.map(x=>`<div class="${x[0]}"><h4>${x[2]}</h4><i>${x[3]}</i><strong>${x[4]}<em>${x[5]}</em></strong><p>较上月　<b>${x[6]}</b></p></div>`).join("")}</div></section>`;}
  function guarantee(){return `<section class="share-panel guarantee">${panelTitle(4,"生产要素保障")}<div class="factor-grid">${factors.map(x=>`<div><i>${x[0]}</i><h3>${x[1]}</h3>${x.slice(2).map(y=>`<p><span>${y[0]}</span><b>${y[1]}<em>${y[2]}</em></b></p>`).join("")}</div>`).join("")}</div></section>`;}
  function safety(){
    const companies=dashboardCompanyNames().map((name,index)=>[name,Math.max(84,456-index*24),Math.max(12,95-index*6),Math.max(1,11-index)]);
    const maxTotal=Math.max(...companies.map(x=>x[1]+x[2]+x[3]));
    return `<section class="share-panel safety-posture">${panelTitle(5,"安全总体态势")}<div class="risk-power"><p>风险管控能力指数 <b>62.57</b><em>分</em></p><img src="src/assets/shareholder-dashboard/risk-control-index.png" alt="" aria-hidden="true"></div><div class="risk-levels"><div><span>风险极高项目</span><b>35<em> 个</em></b></div><div><span>风险较高项目</span><b>311<em> 个</em></b></div><div><span>风险可控项目</span><b>1,563<em> 个</em></b></div></div><div class="safety-distribution"><div class="safety-distribution-head"><h4>子公司安全态势分布</h4><div class="safety-distribution-legend"><span class="extreme">风险极高</span><span class="high">风险较高</span><span class="controlled">风险可控</span></div></div><div class="safety-distribution-list">${companies.map(x=>{const total=x[1]+x[2]+x[3];return `<div class="safety-company-row"><strong>${x[0]}</strong><div class="safety-bar-track"><div class="safety-stacked-bar" style="width:${total/maxTotal*94}%" aria-label="${x[0]}：共${total}项，风险可控${x[1]}项，风险较高${x[2]}项，风险极高${x[3]}项"><i class="controlled" style="--ratio:${x[1]/total*100}%"><b>${x[1]}</b></i><i class="high" style="--ratio:${x[2]/total*100}%"><b>${x[2]}</b></i><i class="extreme" style="--ratio:${x[3]/total*100}%"></i></div><em title="风险极高项目数">${x[3]}</em></div></div>`;}).join("")}</div></div></section>`;
  }
  function monitoring(){
    const groups=[["1","实名制 / 岗位",[["已进场劳务工","21,860 人"],["今日出勤劳务工","19,734 人"],["总包关键岗位人数/到岗率","1,428人 / 96.2%"],["分包关键岗位人数/到岗率","3,286人 / 93.8%"],["特殊工种人数/持证率","2,164人 / 98.6%"]]],["2","隐患排查",[["隐患排查覆盖项目数","1,427 个"],["近一周开展隐患排查项目/率","987个 / 69.2%"],["近一周开单人数/率","1,864人 / 85.3%"],["近一周开单数/人均开单数","12,486单 / 6.7单"]]],["3","视频监控",[["已安装监控数","3,204 路"],["当前在线率","92.3%"],["离线设备数","247 路"],["AI监控数","1,286 路"]]],["4","过程管控",[["过程监管项目数","1,427 个"],["当日完成数/完成率","1,037个 / 72.6%"],["验收完成数/验收完成率","1,278个 / 89.5%"],["明日计划数/计划率","1,116个 / 78.2%"]]]];
    return `<section class="share-panel monitoring">${panelTitle(6,"安全过程监测")}<div class="monitor-grid">${groups.map(x=>`<div><h4><b>${x[0]}</b>${x[1]}</h4>${x[2].map(y=>`<p><span>${y[0]}</span><b>${y[1]}</b></p>`).join("")}</div>`).join("")}</div></section>`;
  }
  function modeSwitcher(){return `<div class="share-mode-switch"><button class="share-mode-trigger" aria-label="切换看板" onclick="this.parentElement.classList.toggle('open')">⇄</button><div class="share-mode-menu"><button class="${shareDashboardMode==='engineering'?'active':''}" onclick="setShareDashboardMode('engineering')">工程管理</button><button class="${shareDashboardMode==='economic'?'active':''}" onclick="setShareDashboardMode('economic')">经济管理</button></div></div>`;}
  function engineeringDashboard(){return `<div class="share-dashboard"><header><div class="refresh">刷新时间：2026-06-13 10:15:30　<button onclick="renderShareholderDashboardPage()">↻</button></div><div class="share-main-title"><h1>集团工程管理驾驶舱</h1><p>生产安全一体化管控大屏</p></div><div class="share-filters"><label>组织：<select><option>集团总部</option></select></label><label>区域：<select><option>全部区域</option></select></label><label>公司：<select><option>全部公司</option></select></label><label>时间：<select><option>2026年度</option></select></label><button class="share-close" onclick="closeShareholderDashboard()">×</button></div></header><div class="share-top-strip">${topHtml()}</div><main>${lifecycle()}${fulfillment()}${risks()}${guarantee()}${safety()}${monitoring()}</main>${modeSwitcher()}<div class="share-dashboard-toast" aria-live="polite"></div></div>`;}
  const economicKpis=[
    ["src/assets/shareholder-dashboard/economic-production.svg","生产项目","2,365","个","当月立项","+128 ↑"],
    ["src/assets/shareholder-dashboard/economic-contract-total.svg","合同总额（亿元）","2,943.52","","",""] ,
    ["src/assets/shareholder-dashboard/economic-managed-project.svg","经济纳管项目数","1,892","个","纳管率","72.8%"],
    ["src/assets/shareholder-dashboard/economic-managed-contract.svg","纳管项目合同总额（亿元）","1,272.35","","合同额占比","43.2%"] ,
    ["src/assets/shareholder-dashboard/economic-warning-red.svg","红色预警项目数","18","个","较上月","+3"],
    ["src/assets/shareholder-dashboard/economic-warning-orange.svg","橙色预警项目数","54","个","较上月","+11"],
    ["src/assets/shareholder-dashboard/economic-warning-yellow.svg","黄色预警项目数","102","个","较上月","+11"],
    ["src/assets/shareholder-dashboard/economic-warning-blue.svg","蓝色预警项目数","26","个","较上月","-5"]
  ];
  let economicIndicatorMode="profit";
  let economicAnalysisMode="trend";
  const economicIndicators={
    profit:{icon:"src/assets/shareholder-dashboard/indicator-profit-custom.png",name:"目标利润率（含税）",value:"4.75%",change:"↑ 1.21%",legend:"目标利润率（含税）",average:"加权平均值",averageValue:4.21,unit:"利润率：%",total:"4.75%",isPercent:true,trend:[3.82,4.06,4.18,4.12,4.26,4.39,4.31,4.45,4.58,4.62,4.69,4.75],types:[5.12,4.86,4.32,4.07,3.68,3.42],regions:[4.92,4.61,4.35,3.94,3.58]},
    inventory:{icon:"src/assets/shareholder-dashboard/indicator-inventory-custom.png",name:"项目存货率",value:"2.79%",change:"↓ 0.53%",legend:"项目存货率",average:"加权平均值",averageValue:3.02,unit:"存货率：%",total:"2.79%",isPercent:true,trend:[3.56,3.48,3.42,3.35,3.27,3.19,3.12,3.06,2.98,2.91,2.85,2.79],types:[3.26,3.08,2.91,2.73,2.58,2.41],regions:[2.66,2.92,3.17,3.38,3.08]},
    safetyCost:{icon:"src/assets/shareholder-dashboard/indicator-safety-cost-custom.png",name:"安措费核销比例",value:"7.28%",change:"↑ 1.21%",legend:"安措费核销比例",average:"加权平均值",averageValue:6.84,unit:"核销比例：%",total:"7.28%",isPercent:true,trend:[6.12,6.25,6.39,6.48,6.57,6.69,6.78,6.86,6.97,7.08,7.16,7.28],types:[8.12,7.76,7.39,6.95,6.62,6.28],regions:[7.86,7.42,6.95,6.58,6.21]},
    arrears:{icon:"src/assets/shareholder-dashboard/indicator-arrears-custom.png",name:"业主拖欠款（万元）",value:"116,943.00",change:"↑ 8,542.12",legend:"业主拖欠款",average:"加权平均值",averageValue:61.25,unit:"金额：万元",total:"11.69亿",isPercent:false,trend:[43,47,51,50,55,59,62,66,70,75,82,88],types:[41,24,13,9,8,5],regions:[87,69,55,41,28]},
    fee:{icon:"src/assets/shareholder-dashboard/indicator-management-fee-custom.png",name:"目标管理费率",value:"2.26%",change:"↑ 0.14%",legend:"目标管理费率",average:"加权平均值",averageValue:2.04,unit:"管理费率：%",total:"2.26%",isPercent:true,trend:[1.68,1.74,1.81,1.79,1.86,1.93,1.98,2.03,2.08,2.14,2.19,2.26],types:[2.58,2.43,2.31,2.17,2.04,1.92],regions:[2.52,2.31,2.16,1.98,1.76]}
  };
  function economicProjectTypeNames(){
    const options=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_TYPE"):[];
    if(Array.isArray(options)&&options.length)return options.slice();
    const rows=typeof dataDictionaryValuesV2284!=="undefined"&&Array.isArray(dataDictionaryValuesV2284.PROJECT_TYPE)?dataDictionaryValuesV2284.PROJECT_TYPE:[];
    const enabled=rows.filter(x=>x.status!=="禁用").map(x=>x.name);
    return enabled.length?enabled:["轨交","公路","市政","建筑","环境","能源","机场","港口","园林","片区开发","产品","租售","企业管理"];
  }
  function economicRegionNames(){return ["长三角区域","大湾区域","中原区域","海南","境外区域"];}
  function econTitle(no,title){return `<div class="econ-panel-title"><b>${no}</b><strong>${title}</strong></div>`;}
  function econBars(values,labels){const max=Math.max(...values);return `<div class="econ-bars">${values.map((v,i)=>`<div><em>${v}</em><i style="height:${38+v/max*104}px"></i><span>${labels[i]}</span></div>`).join("")}</div>`;}
  function economicMetricChart(current,months){
    const companies=["上海隧道","市政集团","上海路桥","城建设计","城市环境","上海能建","运营集团","数字集团"];
    const labels=economicAnalysisMode==="trend"?months.map(month=>month.slice(2)):companies;
    const values=economicAnalysisMode==="trend"?current.trend:current.trend.slice(0,8).map((value,index)=>current.isPercent?Math.max(.1,Math.min(9.99,value+(index%3-1)*.35)):Math.max(8,Math.min(96,value+(index%3-1)*7)));
    const averageValue=current.averageValue;
    const rawMax=Math.max(...values,averageValue,0);
    const rawStep=Math.max(rawMax*1.06/4,0.01);
    const magnitude=Math.pow(10,Math.floor(Math.log10(rawStep)));
    const normalized=rawStep/magnitude;
    const stepFactor=[1,1.25,1.5,2,2.5,3,4,5,7.5,10].find(x=>x>=normalized)||10;
    const tickStep=stepFactor*magnitude;
    const scaleMax=tickStep*4;
    const averageY=154-Math.min(1,averageValue/scaleMax)*146;
    const formatValue=value=>current.isPercent?`${Number(value).toFixed(2)}%`:Number(value).toFixed(2);
    const yTicks=[scaleMax,tickStep*3,tickStep*2,tickStep,0];
    return `<div class="economic-metric-chart ${economicAnalysisMode}"><div class="economic-metric-y">${yTicks.map(x=>`<span>${formatValue(x)}</span>`).join("")}</div><div class="economic-metric-plot"><div class="economic-metric-bars">${values.map((value,index)=>`<div style="--metric-value:${value/scaleMax*100}"><em>${formatValue(value)}</em><i style="height:${Math.max(8,value/scaleMax*100)}%"></i><span title="${labels[index]}">${labels[index]}</span></div>`).join("")}</div><svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true"><line class="metric-average-line" x1="0" y1="${averageY}" x2="600" y2="${averageY}"/><text class="metric-average-label" x="596" y="${Math.max(14,averageY-5)}" text-anchor="end">${current.average} ${formatValue(averageValue)}</text></svg></div><div class="economic-metric-legend"><span class="bar"><i></i>${current.legend}统计值</span><span class="line"><i></i>${current.average}</span></div></div>`;
  }
  function economicOverview(){
    const months=["2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
    const typeNames=economicProjectTypeNames();
    const regionNames=economicRegionNames();
    const current=economicIndicators[economicIndicatorMode]||economicIndicators.profit;
    const formatAnalysisValue=value=>current.isPercent?`${Number(value).toFixed(2)}%`:Number(value).toFixed(2);
    const typeValues=typeNames.map((name,index)=>{if(index<current.types.length)return current.types[index];const factor=Math.max(.55,1-(index-current.types.length+1)*.07);return Number((current.types[current.types.length-1]*factor).toFixed(current.isPercent?2:0));});
    const typeScale=Math.max(...typeValues);
    const regionScale=Math.max(...current.regions);
    return `<section class="share-panel economic-overview">${econTitle(1,"项目经济指标总览")}<div class="econ-summary">${Object.entries(economicIndicators).map(([key,x])=>`<div class="${key===economicIndicatorMode?'selected':''}" role="button" tabindex="0" aria-pressed="${key===economicIndicatorMode}" onclick="setEconomicIndicatorMode('${key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><i><img src="${x.icon}" alt="" aria-hidden="true"></i><span>${x.name}</span><strong>${x.value}</strong><small>较上月 <b>${x.change}</b></small></div>`).join("")}</div><div class="econ-analysis"><article class="economic-metric-analysis"><h4><span>${current.name}分析</span><div class="economic-analysis-tabs" role="tablist" aria-label="分析维度"><button type="button" role="tab" class="${economicAnalysisMode==='trend'?'active':''}" aria-selected="${economicAnalysisMode==='trend'}" onclick="setEconomicAnalysisMode('trend')">按趋势</button><button type="button" role="tab" class="${economicAnalysisMode==='company'?'active':''}" aria-selected="${economicAnalysisMode==='company'}" onclick="setEconomicAnalysisMode('company')">按公司</button></div></h4>${economicMetricChart(current,months)}</article><article class="economic-type-analysis"><h4>项目类型分析 <small>${current.unit}</small></h4><div class="econ-type-bars"><ul>${typeNames.map((name,i)=>`<li><span>${name}　${formatAnalysisValue(typeValues[i])}</span><i style="width:${typeValues[i]/typeScale*100}%"></i></li>`).join("")}</ul></div></article><article class="economic-region-analysis"><h4>项目区域分析 <small>${current.unit}</small></h4><div class="econ-region"><ul>${regionNames.map((name,i)=>`<li><span>${name}　${formatAnalysisValue(current.regions[i])}</span><i style="width:${current.regions[i]/regionScale*100}%"></i></li>`).join("")}</ul></div></article></div></section>`;
  }
  function warningPanel(){
    const rows=[["市政集团",326,2,5,16,16],["上海路桥",284,1,4,16,9],["上海隧道",268,2,4,14,6],["城建设计",231,1,3,12,6],["数字集团",196,1,2,8,3],["运营集团",178,1,2,6,2],["城市环境",164,2,1,5,2],["上海能建",145,1,2,3,0]];
    const warningHeaders=[["red","红色预警"],["orange","橙色预警"],["yellow","黄色预警"],["blue","蓝色预警"]];
    return `<section class="share-panel economic-warning">${econTitle(3,"公司预警情况分析")}<table><thead><tr><th>序号</th><th>公司名称</th><th>纳管项目数</th>${warningHeaders.map(x=>`<th title="${x[1]}" aria-label="${x[1]}"><i class="risk-dot ${x[0]}"></i></th>`).join("")}</tr></thead><tbody>${rows.map((x,i)=>`<tr><td>${i+1}</td><td>${x[0]}</td><td>${x[1]}</td><td class="red">${x[2]}</td><td class="orange">${x[3]}</td><td class="yellow">${x[4]}</td><td class="blue">${x[5]}</td></tr>`).join("")}</tbody></table></section>`;
  }
  function reasonPanel(){const data=[["分包分供合同预警",40,"25.81%"],["潜亏预警（目标利润率向负偏差）",35,"22.58%"],["总包结算预警",24,"15.48%"],["业主拖欠款预警",22,"14.19%"],["资金存货目标利润率关联预警",16,"10.32%"],["合同个数预警",9,"5.81%"],["其他预警",9,"5.81%"]];return `<section class="share-panel economic-reasons">${econTitle(4,"预警主要原因分析")}<div class="reason-head"><span>排名</span><span>预警原因</span><span>预警项目数</span><span></span><span>占比</span></div><div class="reason-list">${data.map((x,i)=>`<p><i>${i+1}</i><span>${x[0]}</span><b>${x[1]}</b><em><u style="width:${parseFloat(x[2])}%"></u></em><strong>${x[2]}</strong></p>`).join("")}</div></section>`;}
  function contractPanel(){
    const categoryCount=["专业分包　390　14.66%","劳务分包　638　23.98%","材料采购　696　26.17%","设备采购　286　10.75%","设备租赁　412　15.49%","其他合同　238　8.95%"];
    const categoryAmount=["专业分包　516.46　67.27%","劳务分包　81.76　10.64%","材料采购　89.23　11.61%","设备采购　31.56　4.11%","设备租赁　33.40　4.35%","其他合同　15.54　2.02%"];
    const regionAmounts=[["328.46",100],["216.78",82],["147.36",64],["68.52",38],["93.18",48]];
    const contractRegions=economicRegionNames().map((name,index)=>[name,...(regionAmounts[index]||["0.00",8])]);
    const trendMonths=["07","08","09","10","11","12","01","02","03","04","05","06"];
    const trendCounts=[86,102,94,118,106,132,127,115,143,158,149,166];
    const trendAmounts=[42.8,51.6,47.2,63.4,58.1,71.5,68.7,61.9,76.8,84.2,81.6,92.4];
    const maxCount=Math.max(...trendCounts), maxAmount=Math.max(...trendAmounts);
    const trendBars=trendMonths.map((m,i)=>`<div class="contract-trend-point"><i style="height:${trendCounts[i]/maxCount*100}%"><b>${trendCounts[i]}</b></i><span>${m}月</span></div>`).join("");
    const linePoints=trendAmounts.map((v,i)=>`${(i/(trendAmounts.length-1)*100).toFixed(2)},${(100-v/maxAmount*88).toFixed(2)}`).join(" ");
    const settlement=[['签约额','395.62亿元'],['计量额','308.58亿元'],['结算额','249.24亿元']];
    return `<section class="share-panel economic-contract">${econTitle(5,"合同总览")}<div class="contract-kpis">${[["总包合同数","1,184 个"],["总包合同总额（亿元）","372.99"],["分包合同数","1,476 个"],["分包合同总额（亿元）","395.62"]].map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join("")}</div><div class="contract-grid"><article class="contract-composition count"><h4>合同类别构成（个数）</h4><div class="contract-donut"></div><ul>${categoryCount.map(x=>`<li>${x}</li>`).join("")}</ul></article><article class="contract-composition amount"><h4>合同类别构成（金额）</h4><div class="contract-donut"></div><ul>${categoryAmount.map(x=>`<li>${x}</li>`).join("")}</ul></article><article class="contract-region-bars"><h4>市场区域合同分布（亿元）</h4>${contractRegions.map(x=>`<p><span>${x[0]}　${x[1]}</span><i style="width:${x[2]}%"></i></p>`).join("")}</article><article class="contract-settlement"><h4>分包合同结算分析</h4><div class="settlement-funnel"><div class="settlement-stages">${settlement.map((x,i)=>`<div class="settlement-stage stage-${i}"><b>${x[0]}</b><strong>${x[1]}</strong></div>`).join("")}</div><div class="settlement-conversions"><span><b>78.00%</b><em>计量转化率</em></span><span><b>80.77%</b><em>结算转化率</em></span></div></div></article></div><article class="contract-trend-wide"><h4>近12个月签约趋势 <small><i class="legend-count"></i>签约个数 <i class="legend-amount"></i>签约金额（亿元）</small></h4><div class="contract-dual-chart"><div class="dual-axis left"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div><div class="dual-axis right"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="dual-plot"><div class="dual-grid"></div><div class="contract-trend-bars">${trendBars}</div><svg class="contract-trend-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${linePoints}" fill="none" stroke="#ff9f43" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></div></div></article></section>`;
  }
  function economicDashboard(){return `<div class="share-dashboard economic-dashboard"><header><div class="refresh">更新时间：2025-06-13 10:15:39　<button onclick="renderShareholderDashboardPage()">↻</button></div><div class="share-main-title"><h1>集团经济管理驾驶舱</h1><p>经济诊断 + 合同一体化管控大屏</p></div><div class="share-filters"><label>组织：<select><option>集团总部</option></select></label><label>区域：<select><option>全部区域</option></select></label><label>公司：<select><option>全部公司</option></select></label><label>时间：<select><option>2026年度</option></select></label><button class="share-close" onclick="closeShareholderDashboard()">×</button></div></header><div class="share-top-strip">${economicKpis.map((x,i)=>`<div class="share-top-metric econ-kpi kpi-${i}"><i>${i>=4?`<span class="risk-kpi-swatch ${["red","orange","yellow","blue"][i-4]}" aria-hidden="true"></span>`:`<img src="${x[0]}" alt="" aria-hidden="true">`}</i><div><span>${x[1]}</span><strong>${x[2]}<em>${x[3]}</em></strong>${x[4]?`<small>${x[4]}　<b>${x[5]}</b></small>`:""}</div></div>`).join("")}</div><main>${economicOverview()}${warningPanel()}${reasonPanel()}${contractPanel()}</main>${modeSwitcher()}</div>`;}
  window.renderShareholderDashboard=function(){return shareDashboardMode==='economic'?economicDashboard():engineeringDashboard();};
  window.setShareDashboardMode=function(mode){if(!['engineering','economic'].includes(mode)||shareDashboardMode===mode)return;shareDashboardMode=mode;renderShareholderDashboardPage();};
  window.setEconomicIndicatorMode=function(mode){
    if(!economicIndicators[mode]||economicIndicatorMode===mode)return;
    economicIndicatorMode=mode;
    const current=document.querySelector(".economic-overview");
    if(!current)return;
    const template=document.createElement("template");
    template.innerHTML=economicOverview().trim();
    current.replaceWith(template.content.firstElementChild);
  };
  window.setEconomicAnalysisMode=function(mode){
    if(!["trend","company"].includes(mode)||economicAnalysisMode===mode)return;
    economicAnalysisMode=mode;
    const current=document.querySelector(".economic-overview");
    if(!current)return;
    const template=document.createElement("template");
    template.innerHTML=economicOverview().trim();
    current.replaceWith(template.content.firstElementChild);
  };
  window.fitShareholderDashboard=function(){const root=document.querySelector(".share-dashboard");if(!root)return;const scale=Math.min(window.innerWidth/1920,window.innerHeight/1080);root.style.setProperty("--share-scale",String(scale));root.style.left=`${Math.max(0,(window.innerWidth-1920*scale)/2)}px`;root.style.top=`${Math.max(0,(window.innerHeight-1080*scale)/2)}px`;};
  window.setShareFulfillmentMode=function(mode){
    if(!fulfillmentModes[mode]||shareFulfillmentMode===mode)return;
    shareFulfillmentMode=mode;
    const current=document.querySelector(".share-panel.fulfillment");
    if(!current)return;
    const template=document.createElement("template");
    template.innerHTML=fulfillment().trim();
    current.replaceWith(template.content.firstElementChild);
  };
  window.setLifecycleAnalysisMode=function(mode){
    if(!["company","type","customer","region"].includes(mode)||lifecycleAnalysisMode===mode)return;
    lifecycleAnalysisMode=mode;
    const current=document.querySelector(".share-panel.lifecycle");
    if(!current)return;
    const template=document.createElement("template");
    template.innerHTML=lifecycle().trim();
    current.replaceWith(template.content.firstElementChild);
  };
  window.shareDashboardDrill=function(name){const toast=document.querySelector(".share-dashboard-toast");if(!toast)return;toast.textContent=`${name}下钻数据加载中`;toast.classList.add("show");clearTimeout(window.__shareDashboardToastTimer);window.__shareDashboardToastTimer=setTimeout(()=>toast.classList.remove("show"),1500);};
  window.renderShareholderDashboardPage=function(){let host=document.getElementById("shareholderDashboardHost");if(!host){host=document.createElement("div");host.id="shareholderDashboardHost";document.body.appendChild(host);}host.innerHTML=renderShareholderDashboard();document.body.classList.add("shareholder-dashboard-open");fitShareholderDashboard();window.removeEventListener("resize",fitShareholderDashboard);window.addEventListener("resize",fitShareholderDashboard);};
  window.closeShareholderDashboard=function(){window.removeEventListener("resize",fitShareholderDashboard);document.getElementById("shareholderDashboardHost")?.remove();document.body.classList.remove("shareholder-dashboard-open");};
})();
