/* V2.2.97 unified mobile header standard */
function getMobileDeviceTimeV2297(){
  const now=new Date();
  const hour=String(now.getHours()).padStart(2,"0");
  const minute=String(now.getMinutes()).padStart(2,"0");
  return `${hour}:${minute}`;
}

function renderMobileMiniProgramCapsuleV2297(){
  return `
    <div class="mobile-capsule" aria-hidden="true">
      <span class="mobile-dots"><i></i><i></i><i></i></span>
      <span class="mobile-capsule-line"></span>
      <span class="mobile-circle"></span>
    </div>
  `;
}

function normalizeMobileStatusbarV2297(){
  const time=getMobileDeviceTimeV2297();
  document.querySelectorAll(".mobile-statusbar").forEach(bar=>{
    bar.classList.add("mobile-standard-statusbar");
    if(bar.dataset.standardTime===time)return;
    bar.dataset.standardTime=time;
    bar.innerHTML=`
      <div class="mobile-time">${time}</div>
      <div class="mobile-phone-icons" aria-hidden="true">
        <span class="mobile-signal"><i></i><i></i><i></i><i></i></span>
        <span class="mobile-wifi"></span>
        <span class="mobile-battery"></span>
      </div>
    `;
  });
}

function normalizeMobileTitlebarV2297(){
  const selectors=[
    ".mobile-titlebar",
    ".mobile-message-titlebar",
    ".mobile-mine-titlebar",
    ".mobile-version-titlebar",
    ".mobile-feedback-titlebar",
    ".mobile-manual-titlebar",
    ".mobile-project-switch-titlebar",
    ".mobile-more-titlebar"
  ].join(",");
  document.querySelectorAll(selectors).forEach(titlebar=>{
    titlebar.classList.add("mobile-standard-titlebar");
    if(!titlebar.querySelector(".mobile-capsule")){
      titlebar.insertAdjacentHTML("beforeend",renderMobileMiniProgramCapsuleV2297());
    }
  });
}

function normalizeMobileHeaderV2297(){
  if(!document.body.classList.contains("mobile-mode"))return;
  normalizeMobileStatusbarV2297();
  normalizeMobileTitlebarV2297();
}

if(!window.__mobileHeaderStandardBoundV2297){
  window.__mobileHeaderStandardBoundV2297=true;
  let headerNormalizePendingV2297=false;
  const scheduleNormalizeV2297=()=>{
    if(headerNormalizePendingV2297)return;
    headerNormalizePendingV2297=true;
    requestAnimationFrame(()=>{
      headerNormalizePendingV2297=false;
      normalizeMobileHeaderV2297();
    });
  };
  document.addEventListener("click",()=>setTimeout(scheduleNormalizeV2297,0),true);
  const observerV2297=new MutationObserver(scheduleNormalizeV2297);
  observerV2297.observe(document.body,{childList:true,subtree:true});
  setInterval(normalizeMobileHeaderV2297,30000);
  scheduleNormalizeV2297();
}

/* Mobile project overview page */
function getMobileProjectOverviewDataV2227(){
  return {
    projectName:"上海示范区线工程SFQSG-15标施工",
    tags:[
      {text:"在建",type:"green"},
      {text:"轨交",type:"blue"},
      {text:"股份重点关注",type:"red"},
      {text:"上海市重大项目",type:"green"}
    ],
    overview:[
      {title:"工期进度",value:"67.09",unit:"%",type:"schedule"},
      {title:"产值",value:"3005.31",unit:"万元",type:"output"},
      {title:"安全指数",value:"88.9",unit:"分",type:"safety",badge:"安全可控"},
      {title:"风险情况",value:"II级风险",unit:"2个",type:"risk"}
    ],
    milestones:[
      {title:"开工",date:"2023-05-23",state:"done"},
      {title:"围护结构",date:"2023-11-18",state:"done"},
      {title:"主体结构",date:"2024-06-30",state:"done"},
      {title:"盾构始发",date:"2024-12-15",state:"done"},
      {title:"区间贯通",date:"2025-09-28",state:"done"},
      {title:"附属结构施工",date:"2026-08-20",state:"current"},
      {title:"机电安装",date:"2026-10-10",state:"future"},
      {title:"装饰装修",date:"2026-11-08",state:"future"},
      {title:"联调联试",date:"2026-12-02",state:"future"},
      {title:"计划竣工",date:"2026-12-26",state:"future"}
    ],
    siteStats:[
      {title:"分包管理人员",value:"35",sub:"已登记 107 人"},
      {title:"劳务人员",value:"432",sub:"已登记 2429 人"},
      {title:"当前在场人数",value:"9",sub:"当前在场"}
    ],
    riskRows:[
      {level:"I 级风险",value:"0",current:"当前进入 0 个",future:"未来两周进入 0 个"},
      {level:"II 级风险",value:"2",current:"当前进入 2 个",future:"未来两周进入 0 个",warn:true},
      {level:"III 级风险",value:"0",current:"当前进入 0 个",future:"未来两周进入 0 个"}
    ],
    safetyRows:[
      ["隐患整改率","99.61%"],
      ["整治及时率","100%"],
      ["每日巡查","100%"],
      ["关键步骤完成率","100%"],
      ["视频监控","10个"],
      ["AI点位","2个"]
    ],
    economyRows:["分包分供等合同预警","潜亏预警（目标利润率负向偏差）"]
  };
}

function renderMobileProjectOverviewHeaderV2227(){
  return `
    <header class="mobile-top mobile-project-overview-top">
      <div class="mobile-statusbar">
        <div class="mobile-time">${typeof getMobileDeviceTimeV2297==="function"?getMobileDeviceTimeV2297():"16:41"}</div>
        <div class="mobile-phone-icons" aria-hidden="true">
          <span class="mobile-signal"><i></i><i></i><i></i><i></i></span>
          <span class="mobile-wifi"></span>
          <span class="mobile-battery"></span>
        </div>
      </div>
      <div class="mobile-titlebar mobile-standard-titlebar">
        <button class="mobile-version-back" onclick="renderMobileWorkbench()" aria-label="返回"></button>
        <h1>项目总览</h1>
        ${typeof renderMobileMiniProgramCapsuleV2297==="function"?renderMobileMiniProgramCapsuleV2297():""}
      </div>
    </header>
  `;
}

function renderMobileProjectOverviewTitleV2227(title,type="blue",right=""){
  return `
    <div class="mobile-project-overview-section-title">
      <span class="${type}"></span>
      <strong>${title}</strong>
      ${right?`<div>${right}</div>`:""}
    </div>
  `;
}

function renderMobileProjectOverviewHeroV2227(){
  const data=getMobileProjectOverviewDataV2227();
  const firstChar=(data.projectName || "项").trim().charAt(0) || "项";
  return `
    <section class="mobile-project-overview-hero">
      <div class="mobile-project-overview-hero-main">
        <span class="mobile-project-overview-building" aria-hidden="true">${firstChar}</span>
        <div>
          <h2>${data.projectName}</h2>
          <div class="mobile-project-overview-tags">
            ${data.tags.map(tag=>`<span class="${tag.type}">${tag.text}</span>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewMetricV2227(item){
  if(item.type==="risk"){
    return `
      <div class="mobile-project-overview-metric risk">
        <i></i>
        <span>${item.title}</span>
        <p><b>${item.value}</b><strong>2</strong><em>个</em></p>
      </div>
    `;
  }
  return `
    <div class="mobile-project-overview-metric ${item.type}">
      <i></i>
      <span>${item.title}</span>
      <p><strong>${item.value}</strong><em>${item.unit}</em>${item.badge?`<mark>${item.badge}</mark>`:""}</p>
      ${item.type==="schedule"?`<div class="mobile-project-overview-mini-progress"><b style="width:67.09%"></b></div>`:""}
    </div>
  `;
}

function renderMobileProjectOverviewCoreV2227(){
  return `
    <section class="mobile-project-overview-card">
      ${renderMobileProjectOverviewTitleV2227("核心概览")}
      <div class="mobile-project-overview-core-grid">
        ${getMobileProjectOverviewDataV2227().overview.map(renderMobileProjectOverviewMetricV2227).join("")}
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewScheduleV2227(){
  const items=getMobileProjectOverviewDataV2227().milestones;
  const currentIndex=Math.max(0,items.findIndex(item=>item.state==="current"));
  const doneCount=items.filter(item=>item.state==="done").length;
  return `
    <section class="mobile-project-overview-card">
      ${renderMobileProjectOverviewTitleV2227("工期进度")}
      <p class="mobile-project-overview-summary">已施工<b>1143</b>天，共<b>${items.length}</b>个里程碑节点，已完成<b>${doneCount}</b>个，延期<b class="red">0</b>天</p>
      <div class="mobile-project-overview-timeline-scroll" id="mobileOverviewTimelineV2230" data-current-index="${currentIndex}">
        <div class="mobile-project-overview-timeline" style="--done-width:${currentIndex*82}px;">
          ${items.map(item=>`
          <div class="${item.state||"future"}">
            <span></span>
            <strong>${item.title}</strong>
            <em>${item.date}</em>
          </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function scrollMobileProjectOverviewTimelineV2230(){
  const scroller=document.getElementById("mobileOverviewTimelineV2230");
  if(!scroller)return;
  const index=Number(scroller.dataset.currentIndex)||0;
  const node=scroller.querySelectorAll(".mobile-project-overview-timeline>div")[index];
  if(!node)return;
  const target=node.offsetLeft-(scroller.clientWidth-node.offsetWidth)/2;
  scroller.scrollLeft=Math.max(0,target);
}

function renderMobileProjectOverviewOutputV2227(){
  return `
    <section class="mobile-project-overview-card mobile-project-overview-output">
      ${renderMobileProjectOverviewTitleV2227("产值","green")}
      <h3>3005.31<em>万元</em></h3>
      <p>开累产值完成率 <b>67.09%</b> · 2026年度产值完成率 <b>42.93%</b></p>
      <div class="mobile-project-overview-output-grid">
        <div><span>计划产值</span><strong>7000.00<em>万元</em></strong></div>
        <div><span>实际产值</span><strong>3005.31<em>万元</em></strong></div>
        <div><span>计划完成率</span><strong>42.93<em>%</em></strong></div>
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewImageV2227(){
  return `
    <section class="mobile-project-overview-card">
      ${renderMobileProjectOverviewTitleV2227("工程形象")}
      <div class="mobile-project-overview-drawing">
        <svg viewBox="0 0 620 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 38 C90 38 110 36 160 34 L250 30 L365 26 L500 25 L620 24" fill="none" stroke="#165DFF" stroke-width="3"/>
          <path d="M0 48 H620" stroke="#165DFF" stroke-width="2"/>
          <path d="M230 20 H385 V54 H230 Z" fill="#E8F3FF" stroke="#69A7FF" stroke-dasharray="4 4"/>
          <path d="M470 15 H590 V54 H470 Z" fill="#F0F7FF" stroke="#165DFF" stroke-dasharray="4 4"/>
          <path d="M180 36 V55 M365 25 V55 M470 24 V55" stroke="#165DFF" stroke-width="3"/>
          <text x="250" y="18" font-size="12" fill="#111">2号出入口</text>
          <text x="498" y="14" font-size="12" fill="#111">10号线入井</text>
          <text x="210" y="48" font-size="11" fill="#F53F3F">20风井</text>
          <text x="430" y="47" font-size="11" fill="#F53F3F">30风井</text>
        </svg>
      </div>
      <div class="mobile-project-overview-report-grid">
        <button onclick="showToast('进入项目日报')"><strong>日报</strong><span>2026-07-08</span><b>查看日报</b><i></i></button>
        <button><strong>周报</strong><span>暂未启用</span><i></i></button>
        <button><strong>月报</strong><span>暂未启用</span><i></i></button>
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewSiteV2227(){
  return `
    <section class="mobile-project-overview-card">
      ${renderMobileProjectOverviewTitleV2227("现场情况")}
      <div class="mobile-project-overview-site-grid">
        ${getMobileProjectOverviewDataV2227().siteStats.map(item=>`
          <div><span>${item.title}</span><strong>${item.value}<em>人</em></strong><small>${item.sub}</small></div>
        `).join("")}
      </div>
      <h4>当前在场劳务人员趋势</h4>
      <div class="mobile-project-overview-trend">
        <svg viewBox="0 0 320 92" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="mobileOverviewAreaV2227" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#1664FF" stop-opacity=".24"/>
              <stop offset="1" stop-color="#1664FF" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0 78 C18 36 33 74 50 68 S80 59 100 65 S138 37 166 46 S202 43 226 45 S252 34 270 58 S292 22 320 49 V92 H0 Z" fill="url(#mobileOverviewAreaV2227)"/>
          <path d="M0 78 C18 36 33 74 50 68 S80 59 100 65 S138 37 166 46 S202 43 226 45 S252 34 270 58 S292 22 320 49" fill="none" stroke="#165DFF" stroke-width="2"/>
          <g fill="#77839A" font-size="10">
            <text x="6" y="90">06-25</text><text x="118" y="90">06-29</text><text x="218" y="90">07-03</text>
          </g>
        </svg>
        <div class="mobile-project-overview-trend-tip"><span>2026-07-01</span><b>当前在场人数：5</b></div>
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewRiskV2227(){
  return `
    <section class="mobile-project-overview-card mobile-project-overview-risk-card">
      ${renderMobileProjectOverviewTitleV2227("风险情况","red")}
      <div class="mobile-project-overview-risk-list">
        ${getMobileProjectOverviewDataV2227().riskRows.map(row=>`
          <div class="${row.warn?"warn":""}">
            <strong>${row.level}</strong>
            <b>${row.value}<em>个</em></b>
            ${row.warn?`<mark>未完成</mark>`:"<span></span>"}
            <p>${row.current}<i></i>${row.future}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewSafetyV2227(){
  return `
    <section class="mobile-project-overview-card">
      ${renderMobileProjectOverviewTitleV2227("安全情况","green")}
      <div class="mobile-project-overview-safety">
        <div class="mobile-project-overview-safe-score">
          <span>当前安全可控指数</span>
          <strong>88.9<em>分</em></strong>
          <mark>安全可控</mark>
        </div>
        <div class="mobile-project-overview-safe-grid">
          ${getMobileProjectOverviewDataV2227().safetyRows.map(row=>`<div><span>${row[0]}</span><strong>${row[1]}</strong></div>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewEconomyV2227(){
  return `
    <section class="mobile-project-overview-card mobile-project-overview-economy">
      ${renderMobileProjectOverviewTitleV2227("经济情况","blue",`<button>2026-05<span></span></button>`)}
      <div class="mobile-project-overview-economy-status">
        <div><span>经济风险状态</span><mark>正常</mark></div>
        <div><span>一级预警</span><strong>2<em>个</em></strong></div>
        <div><span>二级预警雷达</span><b>x4</b></div>
      </div>
      <div class="mobile-project-overview-economy-list">
        ${getMobileProjectOverviewDataV2227().economyRows.map((name,index)=>`<button><i class="${index?"orange":""}"></i><strong>${name}</strong><span></span></button>`).join("")}
      </div>
    </section>
  `;
}

function renderMobileProjectOverviewPageV2227(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode","component-library-mode","enterprise-portal-mode","project-portal-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-project-overview-page">
      ${renderMobileProjectOverviewHeaderV2227()}
      <main class="mobile-project-overview-scroll">
        ${renderMobileProjectOverviewHeroV2227()}
        ${renderMobileProjectOverviewCoreV2227()}
        ${renderMobileProjectOverviewScheduleV2227()}
        ${renderMobileProjectOverviewOutputV2227()}
        ${renderMobileProjectOverviewImageV2227()}
        ${renderMobileProjectOverviewSiteV2227()}
        ${renderMobileProjectOverviewRiskV2227()}
        ${renderMobileProjectOverviewSafetyV2227()}
        ${renderMobileProjectOverviewEconomyV2227()}
      </main>
      ${renderMobileBottomTabbarV2274("overview")}
    </div>
  `;
  if(typeof normalizeMobileHeaderV2297==="function")normalizeMobileHeaderV2297();
  requestAnimationFrame(()=>scrollMobileProjectOverviewTimelineV2230());
}

function mobileTabIconV2256(name,label,active=false){
  const actions={
    workbench:"renderMobileWorkbench()",
    overview:"renderMobileProjectOverviewPageV2227()",
    warning:"showToast('预警中心待接入')",
    mine:"renderMobileMineCenterV2274()"
  };
  return `
    <button class="${active?"active":""}" ${actions[name]?`onclick="${actions[name]}"`:""}>
      <span class="tab-svg">
        <img class="tab-img inactive" src="./src/assets/mobile-tab/${name}.svg" alt=""/>
        <img class="tab-img active-img" src="./src/assets/mobile-tab/${name}-active.svg" alt=""/>
      </span>
      <strong>${label}</strong>
    </button>
  `;
}

function renderMobileBottomTabbarV2274(active="workbench"){
  return `
    <nav class="mobile-tabbar" aria-label="底部导航">
      ${mobileTabIconV2256("workbench","工作台",active==="workbench")}
      ${mobileTabIconV2256("overview","总览",active==="overview")}
      <button class="tab-create" onclick="toggleMobileQuickActionOverlayV2287(event)" aria-label="快捷操作"><span>+</span><strong>发起整改单</strong></button>
      ${mobileTabIconV2256("warning","预警",active==="warning")}
      ${mobileTabIconV2256("mine","我的",active==="mine")}
    </nav>
  `;
}

const mobileTabIconV2227Base=mobileTabIconV2256;
mobileTabIconV2256=function(name,label,active=false){
  const actions={
    workbench:"renderMobileWorkbench()",
    overview:"renderMobileProjectOverviewPageV2227()",
    warning:"showToast('预警中心待接入')",
    mine:"renderMobileMineCenterV2274()"
  };
  return `
    <button class="${active?"active":""}" ${actions[name]?`onclick="${actions[name]}"`:""}>
      <span class="tab-svg">
        <img class="tab-img inactive" src="./src/assets/mobile-tab/${name}.svg" alt=""/>
        <img class="tab-img active-img" src="./src/assets/mobile-tab/${name}-active.svg" alt=""/>
      </span>
      <strong>${label}</strong>
    </button>
  `;
};

if(typeof renderMobileBottomTabbarV2274==="function"){
  const renderMobileBottomTabbarV2227Base=renderMobileBottomTabbarV2274;
  renderMobileBottomTabbarV2274=function(active="workbench"){
    return `
      <nav class="mobile-tabbar" aria-label="底部导航">
        ${mobileTabIconV2256("workbench","工作台",active==="workbench")}
        ${mobileTabIconV2256("overview","总览",active==="overview")}
        <button class="tab-create" onclick="toggleMobileQuickActionOverlayV2287(event)" aria-label="快捷操作"><span>+</span><strong>发起整改单</strong></button>
        ${mobileTabIconV2256("warning","预警",active==="warning")}
        ${mobileTabIconV2256("mine","我的",active==="mine")}
      </nav>
    `;
  };
}

Object.assign(window,{
  renderMobileProjectOverviewPageV2227
});

function initMobileProjectOverviewPreviewV2227(){
  const query=new URLSearchParams(location.search || "");
  if(query.get("mobileOverview")!=="1" && location.hash!=="#mobile-overview")return;
  setTimeout(()=>renderMobileProjectOverviewPageV2227(),0);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",initMobileProjectOverviewPreviewV2227);
}else{
  initMobileProjectOverviewPreviewV2227();
}
