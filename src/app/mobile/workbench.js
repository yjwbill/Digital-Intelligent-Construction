/* V2.2.56 mobile interaction upgrade */
const mobileWorkbenchV2256={
  appPage:0,
  noticeType:"message",
  touchX:0
};

const mobileAppNamesV2256=[
  "花名册","考勤流水","视频监控","安全巡检","隐患整改",
  "班组管理","设备台账","质量检查","项目日报","物资验收",
  "劳务实名","进度填报","风险管控","技术交底","资料归档"
];

const mobileNoticeGroupsV2256={
  message:{
    label:"消息通知",
    items:[
      {
        tag:"每日监督",
        title:"每日安全监督填报提醒",
        content:"今日共247个项目需进行安全每日监督，剩余66个项目未填报，请关注",
        time:"2025-4-10 23:04:23"
      },
      {
        tag:"安全纳管",
        title:"安全纳管状态更新提醒",
        content:"大外环西段（求雨岭门站～深莞分界处）天然气高压管线工程（重新招标）项目的项目状态已由在建变更为停工，安全纳管状态由已纳管调整为暂停纳管",
        time:"2025-4-10 23:04:23"
      }
    ]
  },
  announcement:{
    label:"通知公告",
    items:[
      {
        tag:"通知公告",
        title:"项目周例会通知",
        content:"上海示范线工程15标本周安全生产例会将于周五上午召开，请相关人员准时参加。",
        time:"2025-4-10 18:30:00"
      }
    ]
  },
  warning:{
    label:"预警通知",
    items:[
      {
        tag:"风险预警",
        title:"重大风险超期未整改预警",
        content:"项目现场存在1项重大风险隐患超过整改期限，请项目负责人组织复查并完成闭环。",
        time:"2025-4-10 16:12:35"
      }
    ]
  }
};

function mobileChunkV2256(list,size){
  const pages=[];
  for(let i=0;i<list.length;i+=size)pages.push(list.slice(i,i+size));
  return pages;
}

function renderMobileAppIconV2256(name){
  return `
    <div class="mobile-app-item">
      <div class="mobile-app-placeholder" aria-hidden="true"></div>
      <div class="mobile-app-name">${name}</div>
    </div>
  `;
}

function renderMobileAppsV2256(){
  const pages=mobileChunkV2256(mobileAppNamesV2256,10);
  const showCarousel=pages.length>1;
  return `
    <div class="mobile-app-viewport" ontouchstart="mobileAppTouchStartV2256(event)" ontouchend="mobileAppTouchEndV2256(event)" onmousedown="mobileAppMouseStartV2256(event)" onmouseup="mobileAppMouseEndV2256(event)" onmouseleave="mobileAppMouseEndV2256(event)">
      <div class="mobile-app-pages" id="mobileAppPages" style="transform:translateX(-${mobileWorkbenchV2256.appPage*100}%)">
        ${pages.map(page=>`
          <div class="mobile-app-page">
            <div class="mobile-app-grid">${page.map(renderMobileAppIconV2256).join("")}</div>
          </div>
        `).join("")}
      </div>
    </div>
    ${showCarousel?`
      <div class="mobile-carousel">
        ${pages.map((_,i)=>`<button class="${i===mobileWorkbenchV2256.appPage?"active":""}" onclick="setMobileAppPageV2256(${i})" aria-label="应用第${i+1}页"></button>`).join("")}
      </div>
    `:""}
  `;
}

function setMobileAppPageV2256(page){
  const pages=mobileChunkV2256(mobileAppNamesV2256,10);
  mobileWorkbenchV2256.appPage=Math.max(0,Math.min(page,pages.length-1));
  const strip=document.getElementById("mobileAppPages");
  if(strip)strip.style.transform=`translateX(-${mobileWorkbenchV2256.appPage*100}%)`;
  document.querySelectorAll(".mobile-carousel button").forEach((btn,i)=>{
    btn.classList.toggle("active",i===mobileWorkbenchV2256.appPage);
  });
}

function mobileAppTouchStartV2256(event){
  mobileWorkbenchV2256.touchX=event.changedTouches?.[0]?.clientX || 0;
}

function mobileAppTouchEndV2256(event){
  const endX=event.changedTouches?.[0]?.clientX || 0;
  const delta=endX-mobileWorkbenchV2256.touchX;
  if(Math.abs(delta)<36)return;
  setMobileAppPageV2256(mobileWorkbenchV2256.appPage+(delta<0?1:-1));
}

function mobileAppMouseStartV2256(event){
  mobileWorkbenchV2256.mouseDown=true;
  mobileWorkbenchV2256.touchX=event.clientX || 0;
}

function mobileAppMouseEndV2256(event){
  if(!mobileWorkbenchV2256.mouseDown)return;
  mobileWorkbenchV2256.mouseDown=false;
  const delta=(event.clientX || 0)-mobileWorkbenchV2256.touchX;
  if(Math.abs(delta)<36)return;
  setMobileAppPageV2256(mobileWorkbenchV2256.appPage+(delta<0?1:-1));
}

function renderMobileNoticeV2256(item,index){
  return `
    <article class="mobile-notice-item ${index>1?"with-divider":""}">
      <div class="mobile-notice-title-row">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        <span class="mobile-unread-bubble">未读</span>
      </div>
      <div class="mobile-notice-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `;
}

function renderMobileNoticeTabsV2256(){
  return Object.keys(mobileNoticeGroupsV2256).map(key=>{
    const group=mobileNoticeGroupsV2256[key];
    return `<button class="${mobileWorkbenchV2256.noticeType===key?"active":""}" onclick="setMobileNoticeTypeV2256('${key}')">${group.label}（${group.items.length}）</button>`;
  }).join("");
}

function renderMobileNoticeListV2256(){
  const group=mobileNoticeGroupsV2256[mobileWorkbenchV2256.noticeType] || mobileNoticeGroupsV2256.message;
  return group.items.map(renderMobileNoticeV2256).join("");
}

function setMobileNoticeTypeV2256(type){
  mobileWorkbenchV2256.noticeType=type;
  const tabs=document.getElementById("mobileNoticeTabs");
  const list=document.getElementById("mobileNoticeList");
  if(tabs)tabs.innerHTML=renderMobileNoticeTabsV2256();
  if(list)list.innerHTML=renderMobileNoticeListV2256();
}

function mobileTabIconV2256(name,label,active=false){
  return `
    <button class="${active?"active":""}">
      <span class="tab-svg">
        <img class="tab-img inactive" src="./src/assets/mobile-tab/${name}.svg" alt=""/>
        <img class="tab-img active-img" src="./src/assets/mobile-tab/${name}-active.svg" alt=""/>
      </span>
      <strong>${label}</strong>
    </button>
  `;
}

function renderMobileWorkbench(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  mobileWorkbenchV2256.appPage=0;
  mobileWorkbenchV2256.noticeType="message";
  app.innerHTML=`
    <div class="mobile-workbench">
      <header class="mobile-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-titlebar">
          <button class="mobile-menu-btn" aria-label="菜单"><span></span><span></span><span></span></button>
          <h1>上海示范线工程15标</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>

      <main class="mobile-scroll">
        <section class="mobile-card project-card">
          <div class="project-card-head">
            <div><span>项目状态</span><strong>在建</strong></div>
            <button>项目日报</button>
          </div>
          <div class="project-progress-box">
            <div class="project-progress-row">
              <div class="project-percent-icon">%</div>
              <div class="project-progress-track">
                <div class="project-progress-fill"></div>
                <div class="project-progress-dots"><i></i><i></i><i></i></div>
                <div class="project-progress-bubble">30%</div>
              </div>
            </div>
            <div class="project-output-row">
              <div>
                <span>开累产值</span>
                <strong><span class="project-money-number">345,212.98</span><span class="project-money-unit">万元</span></strong>
              </div>
              <div>
                <span>计划产值</span>
                <strong><span class="project-money-number">905,200.00</span><span class="project-money-unit">万元</span></strong>
              </div>
            </div>
          </div>
        </section>

        <section class="mobile-card apps-card">
          <div class="mobile-section-head">
            <div class="mobile-section-title"><span class="mobile-grid-icon"></span><strong>我的应用</strong></div>
            <button>更多&gt;</button>
          </div>
          ${renderMobileAppsV2256()}
        </section>

        <section class="mobile-card notice-card">
          <div class="mobile-message-top">
            <div class="mobile-message-tabs">
              <button>待办 <span>2</span></button>
              <button class="active">消息 <span>4</span></button>
              <button>审批 <span>2</span></button>
            </div>
            <button class="mobile-view-all">查看全部<span></span></button>
          </div>
          <div class="mobile-pill-tabs" id="mobileNoticeTabs">${renderMobileNoticeTabsV2256()}</div>
          <div class="mobile-notice-list" id="mobileNoticeList">${renderMobileNoticeListV2256()}</div>
        </section>
      </main>

      <nav class="mobile-tabbar" aria-label="底部导航">
        ${mobileTabIconV2256("workbench","工作台",true)}
        ${mobileTabIconV2256("overview","总览")}
        <button class="tab-create" onclick="toggleMobileQuickActionOverlayV2287(event)" aria-label="快捷操作"><span>+</span></button>
        ${mobileTabIconV2256("warning","预警")}
        ${mobileTabIconV2256("mine","我的")}
      </nav>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded",()=>{
  if(window.__digitalConstructionMode!=="pc")renderDigitalConstructionEntry();
});

/* V2.2.62 mobile primary tab and center action fix */
const mobilePrimaryGroupsV2262={
  todo:{
    label:"待办",
    count:2,
    items:[
      {tag:"每日监督",title:"每日安全监督填报待办",content:"今日仍有66个项目未完成安全每日监督，请及时跟进填报。",time:"2025-4-10 23:04:23"},
      {tag:"隐患整改",title:"重大隐患整改复核待办",content:"上海示范线工程15标存在1项整改复核待办，请项目负责人完成处理。",time:"2025-4-10 20:16:08"}
    ]
  },
  message:{
    label:"消息",
    count:4
  },
  approval:{
    label:"审批",
    count:2,
    items:[
      {tag:"流程审批",title:"项目日报提交审批",content:"上海示范线工程15标项目日报已提交，请及时查看并完成审批。",time:"2025-4-10 19:30:18"},
      {tag:"安全审批",title:"安全措施变更审批",content:"现场安全措施调整申请待审批，请确认变更内容与责任人。",time:"2025-4-10 17:45:02"}
    ]
  }
};

const mobileMessageCenterStateV2263={
  type:"message",
  status:"all",
  keyword:"",
  module:"all",
  filterOpen:false,
  hasFilter:false,
  timeRange:"all"
};

let mobileMessageListV2263=[
  {id:"msg-001",type:"message",status:"unread",module:"safety",tag:"每日监督",title:"每日安全监督填报提醒",content:"今日共247个项目需进行安全每日监督，剩余66个项目未填报，请关注",time:"2025-4-10 23:04:23"},
  {id:"msg-002",type:"message",status:"unread",module:"safety",tag:"安全纳管",title:"安全纳管状态更新提醒",content:"大外环西段（求雨岭门站～深莞分界处）天然气高压管线工程（重新招标）项目的项目状态已由在建变更为停工，安全纳管状态由已纳管调整为暂停纳管",time:"2025-4-10 23:04:23",jumpLink:"/pages/safety/project-status"},
  {id:"msg-003",type:"message",status:"unread",module:"safety",tag:"安全纳管",title:"系统版本更新提醒",content:"数智施工正式发布V2.8.4版本—安全板块变更内容，详情请点击消息查看或进入版本更新记录查看",time:"2025-4-10 23:04:23",version:"V2.8.4",jumpLink:"/pages/version/history"},
  {id:"msg-004",type:"message",status:"read",module:"safety",tag:"安全纳管",title:"总包安全员未配足项目提醒",content:"截至至今日**点，本集团内“总包安全员未配足项目”共有**个。其中上海隧道**个，上海路桥**个，市政集团**个，城市环境**个，上海能建**个",time:"2025-4-10 23:04:23"},
  {id:"ann-001",type:"announcement",status:"unread",module:"production",tag:"通知公告",title:"安全&生产板块内容升级",content:"【安全板块】\n1. 新建实验支持 1 天统计周期，可快速出实验结论。\n2. 支持修改实验，未发布实验可修改指标、实验组等。\n【生产板块】\n1. 新建实验支持 1 天统计周期，可快速出实验结论。",time:"2025-4-10 18:30:00",version:"V2.8.4",jumpLink:"/pages/version/detail"},
  {id:"warn-001",type:"warning",status:"unread",module:"production",tag:"风险预警",title:"贵州省黔西南布依族苗族自治州晴隆县气象台发布暴雨黄色预警信号",content:"晴隆县气象台5月28日14时11分发布暴雨黄色预警信号：预计未来6小时我县长流、中营、花贡、茶马、大厂、紫马、安谷、鸡场、碧痕、三宝、沙子、腾龙、光照、东观、莲城等乡镇降雨量将达到50毫米以上，且降雨持续，请相关乡镇和部门加强高危地区监测预警。",time:"2025-4-10 16:12:35"}
];

function renderMobilePrimaryTabsV2262(){
  return Object.keys(mobilePrimaryGroupsV2262).map(key=>{
    const item=mobilePrimaryGroupsV2262[key];
    return `<button class="${mobileWorkbenchV2256.primaryTab===key?"active":""}" onclick="setMobilePrimaryTabV2262('${key}')">${item.label} <span>${item.count}</span></button>`;
  }).join("");
}

function renderMobilePrimaryPanelV2262(){
  if(mobileWorkbenchV2256.primaryTab==="message"){
    return `
      <div class="mobile-pill-tabs" id="mobileNoticeTabs">${renderMobileNoticeTabsV2256()}</div>
      <div class="mobile-notice-list" id="mobileNoticeList">${renderMobileNoticeListV2256()}</div>
    `;
  }
  const group=mobilePrimaryGroupsV2262[mobileWorkbenchV2256.primaryTab] || mobilePrimaryGroupsV2262.todo;
  return `<div class="mobile-notice-list" id="mobileNoticeList">${group.items.map(renderMobileNoticeV2256).join("")}</div>`;
}

function openMobileMessageCenterV2263(){
  if(mobileWorkbenchV2256.primaryTab!=="message")return;
  mobileMessageCenterStateV2263.type=mobileWorkbenchV2256.noticeType || "message";
  mobileMessageCenterStateV2263.status="all";
  mobileMessageCenterStateV2263.keyword="";
  mobileMessageCenterStateV2263.module="all";
  renderMobileMessageCenterV2263();
}

function setMobilePrimaryTabV2262(type){
  mobileWorkbenchV2256.primaryTab=type;
  const tabs=document.getElementById("mobilePrimaryTabs");
  const panel=document.getElementById("mobilePrimaryPanel");
  if(tabs)tabs.innerHTML=renderMobilePrimaryTabsV2262();
  if(panel)panel.innerHTML=renderMobilePrimaryPanelV2262();
}

function renderMobileWorkbench(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  mobileWorkbenchV2256.appPage=0;
  mobileWorkbenchV2256.noticeType="message";
  mobileWorkbenchV2256.primaryTab="message";
  app.innerHTML=`
    <div class="mobile-workbench">
      <header class="mobile-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-titlebar">
          <button class="mobile-menu-btn" aria-label="菜单"><span></span><span></span><span></span></button>
          <h1>上海示范线工程15标</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-scroll">
        <section class="mobile-card project-card">
          <div class="project-card-head">
            <div><span>项目状态</span><strong>在建</strong></div>
            <button>项目日报</button>
          </div>
          <div class="project-progress-box">
            <div class="project-progress-row">
              <div class="project-percent-icon">%</div>
              <div class="project-progress-track">
                <div class="project-progress-fill"></div>
                <div class="project-progress-dots"><i></i><i></i><i></i></div>
                <div class="project-progress-bubble">30%</div>
              </div>
            </div>
            <div class="project-output-row">
              <div>
                <span>开累产值</span>
                <strong><span class="project-money-number">345,212.98</span><span class="project-money-unit">万元</span></strong>
              </div>
              <div>
                <span>计划产值</span>
                <strong><span class="project-money-number">905,200.00</span><span class="project-money-unit">万元</span></strong>
              </div>
            </div>
          </div>
        </section>
        <section class="mobile-card apps-card">
          <div class="mobile-section-head">
            <div class="mobile-section-title"><span class="mobile-grid-icon"></span><strong>我的应用</strong></div>
            <button>更多&gt;</button>
          </div>
          ${renderMobileAppsV2256()}
        </section>
        <section class="mobile-card notice-card">
          <div class="mobile-message-top">
            <div class="mobile-message-tabs" id="mobilePrimaryTabs">${renderMobilePrimaryTabsV2262()}</div>
            <button class="mobile-view-all" onclick="openMobilePrimaryListV2271()">查看全部<span></span></button>
          </div>
          <div id="mobilePrimaryPanel">${renderMobilePrimaryPanelV2262()}</div>
        </section>
      </main>
      <nav class="mobile-tabbar" aria-label="底部导航">
        ${mobileTabIconV2256("workbench","工作台",true)}
        ${mobileTabIconV2256("overview","总览")}
        <button class="tab-create" onclick="toggleMobileQuickActionOverlayV2287(event)" aria-label="快捷操作"><span>+</span></button>
        ${mobileTabIconV2256("warning","预警")}
        ${mobileTabIconV2256("mine","我的")}
      </nav>
    </div>
  `;
}

function renderMobileQuickActionOverlayV2287(){
  return `
    <div class="mobile-quick-action-overlay" onclick="closeMobileQuickActionOverlayV2287(event)">
      <div class="mobile-quick-action-panel" onclick="event.stopPropagation()">
        <button class="mobile-quick-action issue" onclick="closeMobileQuickActionOverlayV2287(event);showToast('进入隐患整改')">
          <span><i></i></span>
          <strong>隐患整改</strong>
        </button>
        <button class="mobile-quick-action feedback" onclick="closeMobileQuickActionOverlayV2287(event);showToast('进入意见反馈')">
          <span><i></i></span>
          <strong>意见反馈</strong>
        </button>
        <button class="mobile-quick-action danger" onclick="closeMobileQuickActionOverlayV2287(event);showToast('进入险情速报')">
          <span><i></i></span>
          <strong>险情速报</strong>
        </button>
      </div>
    </div>
  `;
}

function openMobileQuickActionOverlayV2287(){
  const page=document.querySelector(".mobile-workbench");
  if(!page)return;
  let overlay=page.querySelector(".mobile-quick-action-overlay");
  if(!overlay){
    page.insertAdjacentHTML("beforeend",renderMobileQuickActionOverlayV2287());
    overlay=page.querySelector(".mobile-quick-action-overlay");
  }
  page.classList.add("quick-action-open");
  page.querySelector(".mobile-tabbar .tab-create")?.classList.add("active");
  requestAnimationFrame(()=>overlay?.classList.add("active"));
}

function closeMobileQuickActionOverlayV2287(event){
  if(event)event.stopPropagation();
  const page=document.querySelector(".mobile-workbench");
  if(!page)return;
  const overlay=page.querySelector(".mobile-quick-action-overlay");
  page.classList.remove("quick-action-open");
  page.querySelector(".mobile-tabbar .tab-create")?.classList.remove("active");
  if(!overlay)return;
  overlay.classList.remove("active");
  setTimeout(()=>overlay.remove(),260);
}

function toggleMobileQuickActionOverlayV2287(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  const page=document.querySelector(".mobile-workbench");
  if(!page)return;
  if(page.classList.contains("quick-action-open")){
    closeMobileQuickActionOverlayV2287(event);
  }else{
    openMobileQuickActionOverlayV2287();
  }
}

if(!window.__mobileQuickActionBoundV2287){
  window.__mobileQuickActionBoundV2287=true;
  document.addEventListener("click",function(event){
    const btn=event.target.closest && event.target.closest(".mobile-tabbar .tab-create");
    if(!btn || btn.getAttribute("onclick") || btn.querySelector("strong"))return;
    toggleMobileQuickActionOverlayV2287(event);
  },true);
}

function getMobileMessageFilteredV2263(){
  const state=mobileMessageCenterStateV2263;
  return mobileMessageListV2263.filter(item=>{
    if(item.type!==state.type)return false;
    if(state.status!=="all" && item.status!==state.status)return false;
    if(state.module!=="all" && item.module!==state.module)return false;
    if(state.keyword){
      const kw=state.keyword.trim();
      if(kw && !(item.title.includes(kw)||item.content.includes(kw)||item.tag.includes(kw)))return false;
    }
    return true;
  });
}

function countMobileMessageV2263(type,status){
  return mobileMessageListV2263.filter(item=>item.type===type && (!status || item.status===status)).length;
}

function setMobileMessageTypeV2263(type){
  mobileMessageCenterStateV2263.type=type;
  mobileMessageCenterStateV2263.status="all";
  mobileMessageCenterStateV2263.module="all";
  renderMobileMessageCenterV2263();
}

function setMobileMessageStatusV2263(status){
  mobileMessageCenterStateV2263.status=status;
  renderMobileMessageCenterV2263();
}

function setMobileMessageModuleV2263(module){
  mobileMessageCenterStateV2263.module=module;
  renderMobileMessageCenterV2263();
}

function searchMobileMessageV2263(value){
  mobileMessageCenterStateV2263.keyword=value || "";
  renderMobileMessageCenterV2263();
}

function toggleMobileMessageFilterV2266(){
  mobileMessageCenterStateV2263.filterOpen=!mobileMessageCenterStateV2263.filterOpen;
  renderMobileMessageCenterV2263();
}

function setMobileFilterModuleV2266(module){
  mobileMessageCenterStateV2263.module=module;
  mobileMessageCenterStateV2263.hasFilter=module!=="all" || mobileMessageCenterStateV2263.timeRange!=="all";
  renderMobileMessageCenterV2263();
}

function setMobileFilterTimeV2266(range){
  mobileMessageCenterStateV2263.timeRange=range;
  mobileMessageCenterStateV2263.hasFilter=mobileMessageCenterStateV2263.module!=="all" || range!=="all";
  renderMobileMessageCenterV2263();
}

function resetMobileMessageFilterV2266(){
  mobileMessageCenterStateV2263.module="all";
  mobileMessageCenterStateV2263.timeRange="all";
  mobileMessageCenterStateV2263.hasFilter=false;
  renderMobileMessageCenterV2263();
}

function queryMobileMessageFilterV2266(){
  mobileMessageCenterStateV2263.hasFilter=mobileMessageCenterStateV2263.module!=="all" || mobileMessageCenterStateV2263.timeRange!=="all";
  mobileMessageCenterStateV2263.filterOpen=false;
  renderMobileMessageCenterV2263();
}

function renderMobileMessageCenterCardsV2263(){
  const list=getMobileMessageFilteredV2263();
  if(!list.length)return `<div class="mobile-message-empty">暂无消息</div>`;
  return list.map((item,index)=>`
    <article class="mobile-message-list-card" onclick="openMobileMessageDetailV2270('${item.id}')">
      <div class="mobile-message-card-title">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        ${item.status==="unread"?`<span class="mobile-unread-bubble">未读</span>`:""}
      </div>
      <div class="mobile-message-card-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `).join("");
}

function getMobileMessageByIdV2270(id){
  return mobileMessageListV2263.find(item=>item.id===id);
}

function markMobileMessageReadByIdV2270(id){
  mobileMessageListV2263=mobileMessageListV2263.map(item=>item.id===id?{...item,status:"read"}:item);
}

function closeMobileMessageDialogV2270(){
  const dialog=document.getElementById("mobileMessageDialogLayer");
  if(dialog)dialog.remove();
  if(window.__mobileMessageDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || mobileWorkbenchV2256.primaryTab || "message";
    const notice=window.__mobileDialogReturnNotice || mobileWorkbenchV2256.noticeType || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setMobilePrimaryTabV2262(primary);
    if(primary==="message")setMobileNoticeTypeV2256(notice);
  }else renderMobileMessageCenterV2263();
}

function jumpMobileMessageV2270(id){
  const item=getMobileMessageByIdV2270(id);
  if(item)markMobileMessageReadByIdV2270(id);
  showToast(item?.jumpLink?`跳转至：${item.jumpLink}`:"暂无跳转链接");
  closeMobileMessageDialogV2270();
}

function acknowledgeMobileMessageV2270(id){
  markMobileMessageReadByIdV2270(id);
  closeMobileMessageDialogV2270();
}

function openMobileMessageDetailV2270(id){
  const item=getMobileMessageByIdV2270(id);
  if(!item)return;
  window.__mobileMessageDialogSource=document.querySelector(".mobile-message-page")?"center":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  const isVersion=item.type==="announcement" || !!item.version;
  const isWarning=item.type==="warning";
  const jumpBtn=item.jumpLink?`<button class="primary" onclick="jumpMobileMessageV2270('${item.id}')">跳转</button>`:"";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileMessageDialogV2270()"></div>
    <div class="mobile-message-dialog ${isWarning?"warning":isVersion?"version":"normal"}">
      <div class="mobile-message-dialog-head">
        ${isVersion?`<div class="version-no">${item.version || "V2.8.4"}</div>`:""}
        ${isWarning?`<div class="warning-icon">!</div>`:""}
        <div>
          <h2>${item.title}</h2>
          <p>更新发布于 ${item.time}</p>
        </div>
      </div>
      <div class="mobile-message-dialog-content">${String(item.content).replace(/\n/g,"<br/>")}</div>
      <div class="mobile-message-dialog-actions ${jumpBtn?"two":""}">
        ${jumpBtn}
        <button class="plain" onclick="acknowledgeMobileMessageV2270('${item.id}')">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function markFilteredMobileMessagesReadV2269(){
  const ids=new Set(getMobileMessageFilteredV2263().filter(item=>item.status==="unread").map(item=>item._id || `${item.type}-${item.title}-${item.time}`));
  mobileMessageListV2263=mobileMessageListV2263.map(item=>{
    const id=item._id || `${item.type}-${item.title}-${item.time}`;
    return ids.has(id)?{...item,status:"read"}:item;
  });
  renderMobileMessageCenterV2263();
}

function renderMobileMessageCenterV2263(){
  const app=document.querySelector(".app");
  if(!app)return;
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const state=mobileMessageCenterStateV2263;
  const typeTabs=[
    {key:"message",label:"消息通知"},
    {key:"announcement",label:"通知公告"},
    {key:"warning",label:"预警通知"}
  ];
  const all=countMobileMessageV2263(state.type);
  const unread=countMobileMessageV2263(state.type,"unread");
  const read=countMobileMessageV2263(state.type,"read");
  app.innerHTML=`
    <div class="mobile-workbench mobile-message-page">
      <header class="mobile-message-header">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-message-titlebar">
          <button class="mobile-back-btn" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>消息中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-message-scroll">
        <label class="mobile-message-search top">
          <span></span>
          <input value="${state.keyword}" placeholder="输入标题、内容进行搜索" onchange="searchMobileMessageV2263(this.value)" onkeydown="if(event.key==='Enter')searchMobileMessageV2263(this.value)"/>
        </label>
        <div class="mobile-message-type-tabs">
          ${typeTabs.map(t=>`<button class="${state.type===t.key?"active":""}" onclick="setMobileMessageTypeV2263('${t.key}')">${t.label}（${countMobileMessageV2263(t.key)}）</button>`).join("")}
        </div>
        <div class="mobile-message-filter-panel">
          <div class="mobile-message-status-row design">
            <div class="mobile-message-status-tabs design">
              <button class="${state.status==="all"?"active":""}" onclick="setMobileMessageStatusV2263('all')">全部787</button>
              <button class="${state.status==="unread"?"active":""}" onclick="setMobileMessageStatusV2263('unread')">未读700</button>
              <button class="${state.status==="read"?"active":""}" onclick="setMobileMessageStatusV2263('read')">已读87</button>
            </div>
            <button class="mobile-message-filter-btn ${state.hasFilter?"has-filter":""} ${state.filterOpen?"open":""}" onclick="toggleMobileMessageFilterV2266()"><span></span>筛选<i></i></button>
          </div>
          ${state.filterOpen?renderMobileMessageFilterDrawerV2266():""}
        </div>
        <section class="mobile-message-list">${renderMobileMessageCenterCardsV2263()}</section>
        <button class="mobile-message-float-read"><span></span><em>500</em><strong>一键已读</strong></button>
      </main>
    </div>
  `;
}

/* V2.2.71 workbench message dialogs and todo list */
let mobileTodoListV2271=[
  {id:"todo-001",status:"pending",tag:"每日监督",title:"每日安全监督填报待办",content:"今日仍有66个项目未完成安全每日监督，请及时跟进填报。",time:"2025-4-10 23:04:23"},
  {id:"todo-002",status:"pending",tag:"隐患整改",title:"重大隐患整改复核待办",content:"上海示范线工程15标存在1项整改复核待办，请项目负责人完成处理。",time:"2025-4-10 20:16:08"},
  {id:"todo-003",status:"done",tag:"流程审批",title:"项目日报提交审批",content:"上海示范线工程15标项目日报已提交，已完成办理。",time:"2025-4-10 19:30:18"}
];

const mobileTodoCenterStateV2271={
  status:"all",
  keyword:""
};

function renderMobileNoticeTabsV2256(){
  return Object.keys(mobileNoticeGroupsV2256).map(key=>{
    const group=mobileNoticeGroupsV2256[key];
    return `<button class="${mobileWorkbenchV2256.noticeType===key?"active":""}" onclick="setMobileNoticeTypeV2256('${key}')">${group.label}（${group.items.length}）</button>`;
  }).join("");
}

function renderMobileNoticeListV2256(){
  const type=mobileWorkbenchV2256.noticeType || "message";
  const list=mobileMessageListV2263.filter(item=>item.type===type).slice(0,3);
  return list.map((item,index)=>`
    <article class="mobile-notice-item ${index>1?"with-divider":""}" onclick="openMobileMessageDetailV2270('${item.id}')">
      <div class="mobile-notice-title-row">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        ${item.status==="unread"?`<span class="mobile-unread-bubble">未读</span>`:""}
      </div>
      <div class="mobile-notice-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `).join("");
}

function openMobilePrimaryListV2271(){
  if(mobileWorkbenchV2256.primaryTab==="todo")return renderMobileTodoCenterV2271();
  if(mobileWorkbenchV2256.primaryTab==="message")return openMobileMessageCenterV2263();
  showToast("审批列表将在后续版本开放");
}

function getMobileTodoFilteredV2271(){
  return mobileTodoListV2271.filter(item=>{
    if(mobileTodoCenterStateV2271.status!=="all" && item.status!==mobileTodoCenterStateV2271.status)return false;
    const kw=mobileTodoCenterStateV2271.keyword.trim();
    if(kw && !(item.title.includes(kw)||item.content.includes(kw)||item.tag.includes(kw)))return false;
    return true;
  });
}

function getMobileTodoCountsV2271(){
  return {
    all:mobileTodoListV2271.length,
    pending:mobileTodoListV2271.filter(x=>x.status==="pending").length,
    done:mobileTodoListV2271.filter(x=>x.status==="done").length
  };
}

function setMobileTodoStatusV2271(status){
  mobileTodoCenterStateV2271.status=status;
  renderMobileTodoCenterV2271();
}

function searchMobileTodoV2271(value){
  mobileTodoCenterStateV2271.keyword=value || "";
  renderMobileTodoCenterV2271();
}

function markFilteredMobileTodosDoneV2271(){
  const ids=new Set(getMobileTodoFilteredV2271().filter(x=>x.status==="pending").map(x=>x.id));
  mobileTodoListV2271=mobileTodoListV2271.map(item=>ids.has(item.id)?{...item,status:"done"}:item);
  renderMobileTodoCenterV2271();
}

function renderMobileTodoCardsV2271(){
  const list=getMobileTodoFilteredV2271();
  if(!list.length)return `<div class="mobile-message-empty">暂无待办</div>`;
  return list.map(item=>`
    <article class="mobile-message-list-card">
      <div class="mobile-message-card-title">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        ${item.status==="pending"?`<span class="mobile-unread-bubble">未办理</span>`:""}
      </div>
      <div class="mobile-message-card-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `).join("");
}

function renderMobileTodoCenterV2271(){
  const app=document.querySelector(".app");
  if(!app)return;
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const counts=getMobileTodoCountsV2271();
  app.innerHTML=`
    <div class="mobile-workbench mobile-message-page mobile-todo-page">
      <header class="mobile-message-header">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-message-titlebar">
          <button class="mobile-back-btn" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>待办中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-message-scroll">
        <label class="mobile-message-search top">
          <span></span>
          <input value="${mobileTodoCenterStateV2271.keyword}" placeholder="输入标题、内容进行搜索" onchange="searchMobileTodoV2271(this.value)" onkeydown="if(event.key==='Enter')searchMobileTodoV2271(this.value)"/>
        </label>
        <div class="mobile-message-filter-panel">
          <div class="mobile-message-status-row design todo-status-row">
            <div class="mobile-message-status-tabs design">
              <button class="${mobileTodoCenterStateV2271.status==="all"?"active":""}" onclick="setMobileTodoStatusV2271('all')">全部${counts.all}</button>
              <button class="${mobileTodoCenterStateV2271.status==="pending"?"active":""}" onclick="setMobileTodoStatusV2271('pending')">未办理${counts.pending}</button>
              <button class="${mobileTodoCenterStateV2271.status==="done"?"active":""}" onclick="setMobileTodoStatusV2271('done')">已办理${counts.done}</button>
            </div>
          </div>
        </div>
        <section class="mobile-message-list">${renderMobileTodoCardsV2271()}</section>
        <button class="mobile-message-float-read" onclick="markFilteredMobileTodosDoneV2271()"><span></span><em>${counts.pending}</em><strong>一键办理</strong></button>
      </main>
    </div>
  `;
}

/* V2.2.73 workbench todo card and bottom/project polish */
function renderMobilePrimaryPanelV2262(){
  if(mobileWorkbenchV2256.primaryTab==="message"){
    return `
      <div class="mobile-pill-tabs" id="mobileNoticeTabs">${renderMobileNoticeTabsV2256()}</div>
      <div class="mobile-notice-list" id="mobileNoticeList">${renderMobileNoticeListV2256()}</div>
    `;
  }
  if(mobileWorkbenchV2256.primaryTab==="todo"){
    return `<div class="mobile-notice-list" id="mobileNoticeList">${mobileTodoListV2271.slice(0,2).map((item,index)=>`
      <article class="mobile-notice-item ${index>1?"with-divider":""}" onclick="openMobileTodoDetailV2272('${item.id}')">
        <div class="mobile-notice-title-row">
          <span class="mobile-notice-tag">${item.tag}</span>
          <strong>${item.title}</strong>
          ${item.status==="pending"?`<span class="mobile-unread-bubble">未办理</span>`:""}
        </div>
        <div class="mobile-notice-content">${item.content}</div>
        <time>${item.time}</time>
      </article>
    `).join("")}</div>`;
  }
  const group=mobilePrimaryGroupsV2262[mobileWorkbenchV2256.primaryTab] || mobilePrimaryGroupsV2262.approval;
  return `<div class="mobile-notice-list" id="mobileNoticeList">${group.items.map(renderMobileNoticeV2256).join("")}</div>`;
}

function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <div class="mobile-message-dialog normal">
      <div class="mobile-message-dialog-head">
        <div><h2>${item.title}</h2><p>创建于 ${item.time}</p></div>
      </div>
      <div class="mobile-message-dialog-content">${item.content}</div>
      <div class="mobile-message-dialog-actions two">
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function closeMobileTodoDialogV2272(){
  document.getElementById("mobileMessageDialogLayer")?.remove();
  if(window.__mobileTodoDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || "todo";
    const notice=window.__mobileDialogReturnNotice || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setMobilePrimaryTabV2262(primary);
    if(primary==="message")setMobileNoticeTypeV2256(notice);
  }else{
    renderMobileTodoCenterV2271();
  }
}

/* V2.2.72 todo filter and todo detail dialog */
function ensureMobileTodoFilterStateV2272(){
  const state=mobileTodoCenterStateV2271;
  if(!Array.isArray(state.selectedFilterKeys))state.selectedFilterKeys=[];
  if(!state.expandedFilterGroups)state.expandedFilterGroups={safety:true,production:true,economy:false};
  if(!state.timeRange)state.timeRange="all";
  state.hasFilter=(state.selectedFilterKeys.length>0 || state.timeRange!=="all");
}

function getTodoFilterGroupStateV2272(group){
  ensureMobileTodoFilterStateV2272();
  const keys=group.children.map(c=>c.key);
  const selected=keys.filter(k=>mobileTodoCenterStateV2271.selectedFilterKeys.includes(k)).length;
  return selected===0?"none":selected===keys.length?"selected":"partial";
}

function syncTodoFilterHasStateV2272(){
  ensureMobileTodoFilterStateV2272();
  mobileTodoCenterStateV2271.hasFilter=mobileTodoCenterStateV2271.selectedFilterKeys.length>0 || mobileTodoCenterStateV2271.timeRange!=="all";
}

function toggleMobileTodoFilterV2272(){
  ensureMobileTodoFilterStateV2272();
  mobileTodoCenterStateV2271.filterOpen=!mobileTodoCenterStateV2271.filterOpen;
  renderMobileTodoCenterV2271();
}

function toggleTodoFilterGroupV2272(groupKey,event){
  event?.stopPropagation?.();
  ensureMobileTodoFilterStateV2272();
  mobileTodoCenterStateV2271.expandedFilterGroups[groupKey]=!mobileTodoCenterStateV2271.expandedFilterGroups[groupKey];
  refreshTodoFilterDrawerV2272();
}

function toggleTodoFilterNodeV2272(key,event){
  event?.stopPropagation?.();
  ensureMobileTodoFilterStateV2272();
  const group=mobileFilterTreeV2267.find(g=>g.key===key);
  if(group){
    const keys=group.children.map(c=>c.key);
    const allSelected=keys.every(k=>mobileTodoCenterStateV2271.selectedFilterKeys.includes(k));
    mobileTodoCenterStateV2271.selectedFilterKeys=allSelected
      ? mobileTodoCenterStateV2271.selectedFilterKeys.filter(k=>!keys.includes(k))
      : [...new Set([...mobileTodoCenterStateV2271.selectedFilterKeys,...keys])];
  }else{
    mobileTodoCenterStateV2271.selectedFilterKeys=mobileTodoCenterStateV2271.selectedFilterKeys.includes(key)
      ? mobileTodoCenterStateV2271.selectedFilterKeys.filter(k=>k!==key)
      : [...mobileTodoCenterStateV2271.selectedFilterKeys,key];
  }
  syncTodoFilterHasStateV2272();
  refreshTodoFilterDrawerV2272();
}

function setTodoFilterTimeV2272(range){
  ensureMobileTodoFilterStateV2272();
  mobileTodoCenterStateV2271.timeRange=range;
  syncTodoFilterHasStateV2272();
  refreshTodoFilterDrawerV2272();
}

function resetTodoFilterV2272(){
  ensureMobileTodoFilterStateV2272();
  mobileTodoCenterStateV2271.selectedFilterKeys=[];
  mobileTodoCenterStateV2271.timeRange="all";
  mobileTodoCenterStateV2271.hasFilter=false;
  refreshTodoFilterDrawerV2272();
}

function queryTodoFilterV2272(){
  syncTodoFilterHasStateV2272();
  mobileTodoCenterStateV2271.filterOpen=false;
  renderMobileTodoCenterV2271();
}

function closeTodoFilterV2272(){
  mobileTodoCenterStateV2271.filterOpen=false;
  renderMobileTodoCenterV2271();
}

function getTodoSelectedModulesV2272(){
  ensureMobileTodoFilterStateV2272();
  return [...new Set(mobileTodoCenterStateV2271.selectedFilterKeys.map(key=>{
    for(const group of mobileFilterTreeV2267){
      const child=group.children.find(c=>c.key===key);
      if(child)return child.module;
    }
    return "";
  }).filter(Boolean))];
}

function getMobileTodoFilteredV2271(){
  const modules=getTodoSelectedModulesV2272();
  return mobileTodoListV2271.filter(item=>{
    if(mobileTodoCenterStateV2271.status!=="all" && item.status!==mobileTodoCenterStateV2271.status)return false;
    if(modules.length && !modules.includes(item.module || "safety"))return false;
    const kw=(mobileTodoCenterStateV2271.keyword||"").trim();
    if(kw && !(item.title.includes(kw)||item.content.includes(kw)||item.tag.includes(kw)))return false;
    return true;
  });
}

function renderTodoFilterDrawerV2272(){
  ensureMobileTodoFilterStateV2272();
  const state=mobileTodoCenterStateV2271;
  const timeBtn=(key,label)=>`<button class="${state.timeRange===key?"active":""}" onclick="setTodoFilterTimeV2272('${key}')">${label}</button>`;
  const rows=mobileFilterTreeV2267.map(group=>{
    const expanded=state.expandedFilterGroups[group.key]!==false;
    const groupState=getTodoFilterGroupStateV2272(group);
    const childRows=expanded?group.children.map(child=>{
      const selected=state.selectedFilterKeys.includes(child.key);
      return `<div class="filter-tree-row child ${selected?"selected":""}" onclick="toggleTodoFilterNodeV2272('${child.key}',event)"><b>▶</b><span class="check"></span><strong>${child.label}</strong></div>`;
    }).join(""):"";
    return `
      <div class="filter-tree-row root ${groupState}" onclick="toggleTodoFilterNodeV2272('${group.key}',event)">
        <b class="tree-arrow" onclick="toggleTodoFilterGroupV2272('${group.key}',event)">${expanded?"▼":"▶"}</b>
        <span class="check"></span><strong>${group.label}</strong>
      </div>${childRows}
    `;
  }).join("");
  return `
    <div class="mobile-filter-drawer">
      <h2>业务分类</h2>
      <div class="mobile-filter-tree">${rows}</div>
      <h2>时间范围</h2>
      <div class="mobile-filter-time">${timeBtn("all","全部")}${timeBtn("today","今天")}${timeBtn("30","近三十天")}${timeBtn("custom","自定义")}</div>
      <div class="mobile-filter-date"><span>开始日期</span><i>-</i><span>结束日期</span><b></b></div>
      <div class="mobile-filter-actions"><button onclick="resetTodoFilterV2272()">重置</button><button class="primary" onclick="queryTodoFilterV2272()">查询</button></div>
    </div>
  `;
}

function refreshTodoFilterDrawerV2272(){
  const holder=document.getElementById("todoFilterDrawerMount");
  if(holder){
    holder.classList.add("no-anim");
    holder.innerHTML=renderTodoFilterDrawerV2272();
  }
  const btn=document.querySelector(".mobile-message-filter-btn");
  if(btn){
    btn.classList.toggle("has-filter",!!mobileTodoCenterStateV2271.hasFilter);
    btn.classList.toggle("open",!!mobileTodoCenterStateV2271.filterOpen);
  }
}

function getMobileTodoCountsV2271(){
  const old=mobileTodoCenterStateV2271.status;
  mobileTodoCenterStateV2271.status="all";
  const base=getMobileTodoFilteredV2271();
  mobileTodoCenterStateV2271.status=old;
  return {
    all:base.length,
    pending:base.filter(x=>x.status==="pending").length,
    done:base.filter(x=>x.status==="done").length
  };
}

function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <div class="mobile-message-dialog normal">
      <div class="mobile-message-dialog-head">
        <div><h2>${item.title}</h2><p>创建于 ${item.time}</p></div>
      </div>
      <div class="mobile-message-dialog-content">${item.content}</div>
      <div class="mobile-message-dialog-actions two">
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function closeMobileTodoDialogV2272(){
  document.getElementById("mobileMessageDialogLayer")?.remove();
  renderMobileTodoCenterV2271();
}

function handleMobileTodoV2272(id){
  mobileTodoListV2271=mobileTodoListV2271.map(item=>item.id===id?{...item,status:"done"}:item);
  closeMobileTodoDialogV2272();
}

function renderMobileTodoCardsV2271(){
  const list=getMobileTodoFilteredV2271();
  if(!list.length)return `<div class="mobile-message-empty">暂无待办</div>`;
  return list.map(item=>`
    <article class="mobile-message-list-card" onclick="openMobileTodoDetailV2272('${item.id}')">
      <div class="mobile-message-card-title">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        ${item.status==="pending"?`<span class="mobile-unread-bubble">未办理</span>`:""}
      </div>
      <div class="mobile-message-card-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `).join("");
}

function renderMobileTodoCenterV2271(){
  const app=document.querySelector(".app");
  if(!app)return;
  ensureMobileTodoFilterStateV2272();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const counts=getMobileTodoCountsV2271();
  app.innerHTML=`
    <div class="mobile-workbench mobile-message-page mobile-todo-page">
      <header class="mobile-message-header">
        <div class="mobile-statusbar"><div class="mobile-time">16:41</div><div class="mobile-phone-icons" aria-hidden="true"><span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span><span class="mobile-wifi"></span><span class="mobile-battery"></span></div></div>
        <div class="mobile-message-titlebar"><button class="mobile-back-btn" onclick="renderMobileWorkbench()" aria-label="返回"></button><h1>待办中心</h1><div class="mobile-capsule" aria-hidden="true"><span class="mobile-dots"><i></i><i></i><i></i></span><span class="mobile-capsule-line"></span><span class="mobile-circle"></span></div></div>
      </header>
      <main class="mobile-message-scroll">
        <label class="mobile-message-search top"><span></span><input value="${mobileTodoCenterStateV2271.keyword||""}" placeholder="输入标题、内容进行搜索" onchange="searchMobileTodoV2271(this.value)" onkeydown="if(event.key==='Enter')searchMobileTodoV2271(this.value)"/></label>
        <div class="mobile-message-filter-panel ${mobileTodoCenterStateV2271.filterOpen?"open":""}">
          <div class="mobile-message-status-row design">
            <div class="mobile-message-status-tabs design">
              <button class="${mobileTodoCenterStateV2271.status==="all"?"active":""}" onclick="setMobileTodoStatusV2271('all')">全部${counts.all}</button>
              <button class="${mobileTodoCenterStateV2271.status==="pending"?"active":""}" onclick="setMobileTodoStatusV2271('pending')">未办理${counts.pending}</button>
              <button class="${mobileTodoCenterStateV2271.status==="done"?"active":""}" onclick="setMobileTodoStatusV2271('done')">已办理${counts.done}</button>
            </div>
            <button class="mobile-message-filter-btn ${mobileTodoCenterStateV2271.hasFilter?"has-filter":""} ${mobileTodoCenterStateV2271.filterOpen?"open":""}" onclick="toggleMobileTodoFilterV2272()"><span></span>筛选<i></i></button>
          </div>
          <div id="todoFilterDrawerMount">${mobileTodoCenterStateV2271.filterOpen?renderTodoFilterDrawerV2272():""}</div>
        </div>
        ${mobileTodoCenterStateV2271.filterOpen?`<div class="mobile-filter-lower-mask" onclick="closeTodoFilterV2272()"></div>`:""}
        <section class="mobile-message-list">${renderMobileTodoCardsV2271()}</section>
      </main>
    </div>
  `;
}

function renderMobileMessageFilterDrawerV2266(){
  const state=mobileMessageCenterStateV2263;
  const moduleBtn=(key,label,extra="")=>`<button class="${state.module===key?"active":""}" onclick="setMobileFilterModuleV2266('${key}')">${label}</button>`;
  const timeBtn=(key,label)=>`<button class="${state.timeRange===key?"active":""}" onclick="setMobileFilterTimeV2266('${key}')">${label}</button>`;
  return `
    <div class="mobile-filter-drawer">
      <h2>业务分类</h2>
      <div class="mobile-filter-tree">
        <div class="filter-tree-row root ${state.module==="safety"?"selected":""}" onclick="setMobileFilterModuleV2266('safety')"><b>▼</b><span class="check"></span><strong>安全</strong></div>
        <div class="filter-tree-row child ${state.module==="safety"?"selected":""}" onclick="setMobileFilterModuleV2266('safety')"><b>▶</b><span class="check"></span><strong>隐患排查</strong></div>
        <div class="filter-tree-row child"><b>▶</b><span class="check"></span><strong>重大风险</strong></div>
        <div class="filter-tree-row child"><b>▶</b><span class="check"></span><strong>每日安全监督</strong></div>
        <div class="filter-tree-row root"><b>▼</b><span class="check"></span><strong>生产</strong></div>
        <div class="filter-tree-row child ${state.module==="production"?"selected":""}" onclick="setMobileFilterModuleV2266('production')"><b>▶</b><span class="check"></span><strong>施工管理</strong></div>
        <div class="filter-tree-row child ${state.module==="production"?"selected":""}" onclick="setMobileFilterModuleV2266('production')"><b>▶</b><span class="check"></span><strong>二级树</strong></div>
        <div class="filter-tree-row child"><b>▶</b><span class="check"></span><strong>质量管理</strong></div>
        <div class="filter-tree-row root collapsed"><b>▶</b><span class="check"></span><strong>经济</strong></div>
      </div>
      <h2>时间范围</h2>
      <div class="mobile-filter-time">
        ${timeBtn("all","全部")}
        ${timeBtn("today","今天")}
        ${timeBtn("30","近三十天")}
        ${timeBtn("custom","自定义")}
      </div>
      <div class="mobile-filter-date">
        <span>开始日期</span><i>-</i><span>结束日期</span><b></b>
      </div>
      <div class="mobile-filter-actions">
        <button onclick="resetMobileMessageFilterV2266()">重置</button>
        <button class="primary" onclick="queryMobileMessageFilterV2266()">查询</button>
      </div>
    </div>
  `;
}

/* V2.2.67 message filter mask and tree interaction */
const mobileFilterTreeV2267=[
  {key:"safety",label:"安全",children:[
    {key:"hazard",label:"隐患排查",module:"safety"},
    {key:"majorRisk",label:"重大风险",module:"safety"},
    {key:"dailySafe",label:"每日安全监督",module:"safety"}
  ]},
  {key:"production",label:"生产",children:[
    {key:"construction",label:"施工管理",module:"production"},
    {key:"secondTree",label:"二级树",module:"production"},
    {key:"quality",label:"质量管理",module:"production"}
  ]},
  {key:"economy",label:"经济",children:[
    {key:"contract",label:"合同管理",module:"economy"}
  ]}
];

function ensureMobileFilterStateV2267(){
  const state=mobileMessageCenterStateV2263;
  if(!Array.isArray(state.selectedFilterKeys)){
    state.selectedFilterKeys=state.module&&state.module!=="all"
      ? mobileFilterTreeV2267.flatMap(g=>g.children.filter(c=>c.module===state.module).map(c=>c.key))
      : [];
  }
  if(!state.expandedFilterGroups){
    state.expandedFilterGroups={safety:true,production:true,economy:false};
  }
}

function getMobileFilterGroupStateV2267(group){
  ensureMobileFilterStateV2267();
  const keys=group.children.map(c=>c.key);
  const selected=keys.filter(k=>mobileMessageCenterStateV2263.selectedFilterKeys.includes(k)).length;
  return selected===0?"none":selected===keys.length?"selected":"partial";
}

function syncMobileFilterHasStateV2267(){
  const state=mobileMessageCenterStateV2263;
  state.hasFilter=(state.selectedFilterKeys?.length||0)>0 || state.timeRange!=="all";
  const modules=[...new Set((state.selectedFilterKeys||[]).map(key=>{
    for(const group of mobileFilterTreeV2267){
      const child=group.children.find(c=>c.key===key);
      if(child)return child.module;
    }
    return "";
  }).filter(Boolean))];
  state.module=modules.length===1?modules[0]:modules.length>1?"mixed":"all";
}

function toggleMobileFilterGroupV2267(groupKey,event){
  event?.stopPropagation?.();
  ensureMobileFilterStateV2267();
  const state=mobileMessageCenterStateV2263;
  state.expandedFilterGroups[groupKey]=!state.expandedFilterGroups[groupKey];
  refreshMobileFilterDrawerV2267();
}

function toggleMobileFilterNodeV2267(key,event){
  event?.stopPropagation?.();
  ensureMobileFilterStateV2267();
  const state=mobileMessageCenterStateV2263;
  const group=mobileFilterTreeV2267.find(g=>g.key===key);
  if(group){
    const keys=group.children.map(c=>c.key);
    const allSelected=keys.every(k=>state.selectedFilterKeys.includes(k));
    state.selectedFilterKeys=allSelected
      ? state.selectedFilterKeys.filter(k=>!keys.includes(k))
      : [...new Set([...state.selectedFilterKeys,...keys])];
  }else{
    state.selectedFilterKeys=state.selectedFilterKeys.includes(key)
      ? state.selectedFilterKeys.filter(k=>k!==key)
      : [...state.selectedFilterKeys,key];
  }
  syncMobileFilterHasStateV2267();
  refreshMobileFilterDrawerV2267();
}

function setMobileFilterTimeV2266(range){
  ensureMobileFilterStateV2267();
  mobileMessageCenterStateV2263.timeRange=range;
  syncMobileFilterHasStateV2267();
  refreshMobileFilterDrawerV2267();
}

function resetMobileMessageFilterV2266(){
  ensureMobileFilterStateV2267();
  mobileMessageCenterStateV2263.selectedFilterKeys=[];
  mobileMessageCenterStateV2263.module="all";
  mobileMessageCenterStateV2263.timeRange="all";
  mobileMessageCenterStateV2263.hasFilter=false;
  refreshMobileFilterDrawerV2267();
}

function queryMobileMessageFilterV2266(){
  ensureMobileFilterStateV2267();
  syncMobileFilterHasStateV2267();
  mobileMessageCenterStateV2263.filterOpen=false;
  renderMobileMessageCenterV2263();
}

function closeMobileMessageFilterV2267(){
  mobileMessageCenterStateV2263.filterOpen=false;
  renderMobileMessageCenterV2263();
}

function refreshMobileFilterDrawerV2267(){
  const holder=document.getElementById("mobileFilterDrawerMount");
  if(holder)holder.innerHTML=renderMobileMessageFilterDrawerV2266();
  const btn=document.querySelector(".mobile-message-filter-btn");
  if(btn){
    btn.classList.toggle("has-filter",!!mobileMessageCenterStateV2263.hasFilter);
    btn.classList.toggle("open",!!mobileMessageCenterStateV2263.filterOpen);
  }
}

function getMobileMessageFilteredV2263(){
  ensureMobileFilterStateV2267();
  const state=mobileMessageCenterStateV2263;
  const selectedModules=[...new Set((state.selectedFilterKeys||[]).map(key=>{
    for(const group of mobileFilterTreeV2267){
      const child=group.children.find(c=>c.key===key);
      if(child)return child.module;
    }
    return "";
  }).filter(Boolean))];
  return mobileMessageListV2263.filter(item=>{
    if(item.type!==state.type)return false;
    if(state.status!=="all" && item.status!==state.status)return false;
    if(selectedModules.length && !selectedModules.includes(item.module))return false;
    if(!selectedModules.length && state.module!=="all" && state.module!=="mixed" && item.module!==state.module)return false;
    if(state.keyword){
      const kw=state.keyword.trim();
      if(kw && !(item.title.includes(kw)||item.content.includes(kw)||item.tag.includes(kw)))return false;
    }
    return true;
  });
}

function renderMobileMessageFilterDrawerV2266(){
  ensureMobileFilterStateV2267();
  const state=mobileMessageCenterStateV2263;
  const timeBtn=(key,label)=>`<button class="${state.timeRange===key?"active":""}" onclick="setMobileFilterTimeV2266('${key}')">${label}</button>`;
  const rows=mobileFilterTreeV2267.map(group=>{
    const expanded=state.expandedFilterGroups[group.key]!==false;
    const groupState=getMobileFilterGroupStateV2267(group);
    const childRows=expanded?group.children.map(child=>{
      const selected=state.selectedFilterKeys.includes(child.key);
      return `<div class="filter-tree-row child ${selected?"selected":""}" onclick="toggleMobileFilterNodeV2267('${child.key}',event)"><b>▶</b><span class="check"></span><strong>${child.label}</strong></div>`;
    }).join(""):"";
    return `
      <div class="filter-tree-row root ${groupState}" onclick="toggleMobileFilterNodeV2267('${group.key}',event)">
        <b class="tree-arrow" onclick="toggleMobileFilterGroupV2267('${group.key}',event)">${expanded?"▼":"▶"}</b>
        <span class="check"></span><strong>${group.label}</strong>
      </div>
      ${childRows}
    `;
  }).join("");
  return `
    <div class="mobile-filter-drawer">
      <h2>业务分类</h2>
      <div class="mobile-filter-tree">${rows}</div>
      <h2>时间范围</h2>
      <div class="mobile-filter-time">
        ${timeBtn("all","全部")}
        ${timeBtn("today","今天")}
        ${timeBtn("30","近三十天")}
        ${timeBtn("custom","自定义")}
      </div>
      <div class="mobile-filter-date">
        <span>开始日期</span><i>-</i><span>结束日期</span><b></b>
      </div>
      <div class="mobile-filter-actions">
        <button onclick="resetMobileMessageFilterV2266()">重置</button>
        <button class="primary" onclick="queryMobileMessageFilterV2266()">查询</button>
      </div>
    </div>
  `;
}

function renderMobileMessageCenterV2263(){
  const app=document.querySelector(".app");
  if(!app)return;
  ensureMobileFilterStateV2267();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const state=mobileMessageCenterStateV2263;
  const typeTabs=[
    {key:"message",label:"消息通知"},
    {key:"announcement",label:"通知公告"},
    {key:"warning",label:"预警通知"}
  ];
  const all=countMobileMessageV2263(state.type);
  const unread=countMobileMessageV2263(state.type,"unread");
  const read=countMobileMessageV2263(state.type,"read");
  app.innerHTML=`
    <div class="mobile-workbench mobile-message-page">
      ${state.filterOpen?`<div class="mobile-filter-mask" onclick="closeMobileMessageFilterV2267()"></div>`:""}
      <header class="mobile-message-header">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-message-titlebar">
          <button class="mobile-back-btn" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>消息中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-message-scroll">
        <label class="mobile-message-search top">
          <span></span>
          <input value="${state.keyword}" placeholder="输入标题、内容进行搜索" onchange="searchMobileMessageV2263(this.value)" onkeydown="if(event.key==='Enter')searchMobileMessageV2263(this.value)"/>
        </label>
        <div class="mobile-message-type-tabs">
          ${typeTabs.map(t=>`<button class="${state.type===t.key?"active":""}" onclick="setMobileMessageTypeV2263('${t.key}')">${t.label}（${countMobileMessageV2263(t.key)}）</button>`).join("")}
        </div>
        <div class="mobile-message-filter-panel ${state.filterOpen?"open":""}">
          <div class="mobile-message-status-row design">
            <div class="mobile-message-status-tabs design">
              <button class="${state.status==="all"?"active":""}" onclick="setMobileMessageStatusV2263('all')">全部787</button>
              <button class="${state.status==="unread"?"active":""}" onclick="setMobileMessageStatusV2263('unread')">未读700</button>
              <button class="${state.status==="read"?"active":""}" onclick="setMobileMessageStatusV2263('read')">已读87</button>
            </div>
            <button class="mobile-message-filter-btn ${state.hasFilter?"has-filter":""} ${state.filterOpen?"open":""}" onclick="toggleMobileMessageFilterV2266()"><span></span>筛选<i></i></button>
          </div>
          <div id="mobileFilterDrawerMount">${state.filterOpen?renderMobileMessageFilterDrawerV2266():""}</div>
        </div>
        <section class="mobile-message-list">${renderMobileMessageCenterCardsV2263()}</section>
        <button class="mobile-message-float-read"><span></span><em>500</em><strong>一键已读</strong></button>
      </main>
    </div>
  `;
}

/* V2.2.68 message filter no-flicker and live counts */
function getMobileMessageBaseFilteredV2268(){
  ensureMobileFilterStateV2267();
  const state=mobileMessageCenterStateV2263;
  const selectedModules=[...new Set((state.selectedFilterKeys||[]).map(key=>{
    for(const group of mobileFilterTreeV2267){
      const child=group.children.find(c=>c.key===key);
      if(child)return child.module;
    }
    return "";
  }).filter(Boolean))];
  return mobileMessageListV2263.filter(item=>{
    if(item.type!==state.type)return false;
    if(selectedModules.length && !selectedModules.includes(item.module))return false;
    if(!selectedModules.length && state.module!=="all" && state.module!=="mixed" && item.module!==state.module)return false;
    if(state.keyword){
      const kw=state.keyword.trim();
      if(kw && !(item.title.includes(kw)||item.content.includes(kw)||item.tag.includes(kw)))return false;
    }
    return true;
  });
}

function getMobileMessageFilteredV2263(){
  const state=mobileMessageCenterStateV2263;
  return getMobileMessageBaseFilteredV2268().filter(item=>state.status==="all" || item.status===state.status);
}

function getMobileMessageLiveCountsV2268(){
  const base=getMobileMessageBaseFilteredV2268();
  return {
    all:base.length,
    unread:base.filter(x=>x.status==="unread").length,
    read:base.filter(x=>x.status==="read").length
  };
}

function refreshMobileFilterDrawerV2267(){
  const holder=document.getElementById("mobileFilterDrawerMount");
  if(holder){
    holder.classList.add("no-anim");
    holder.innerHTML=renderMobileMessageFilterDrawerV2266();
  }
  const btn=document.querySelector(".mobile-message-filter-btn");
  if(btn){
    btn.classList.toggle("has-filter",!!mobileMessageCenterStateV2263.hasFilter);
    btn.classList.toggle("open",!!mobileMessageCenterStateV2263.filterOpen);
  }
}

function renderMobileMessageCenterV2263(){
  const app=document.querySelector(".app");
  if(!app)return;
  ensureMobileFilterStateV2267();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const state=mobileMessageCenterStateV2263;
  const typeTabs=[
    {key:"message",label:"消息通知"},
    {key:"announcement",label:"通知公告"},
    {key:"warning",label:"预警通知"}
  ];
  const live=getMobileMessageLiveCountsV2268();
  app.innerHTML=`
    <div class="mobile-workbench mobile-message-page">
      <header class="mobile-message-header">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-message-titlebar">
          <button class="mobile-back-btn" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>消息中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-message-scroll">
        <label class="mobile-message-search top">
          <span></span>
          <input value="${state.keyword}" placeholder="输入标题、内容进行搜索" onchange="searchMobileMessageV2263(this.value)" onkeydown="if(event.key==='Enter')searchMobileMessageV2263(this.value)"/>
        </label>
        <div class="mobile-message-type-tabs">
          ${typeTabs.map(t=>`<button class="${state.type===t.key?"active":""}" onclick="setMobileMessageTypeV2263('${t.key}')">${t.label}（${countMobileMessageV2263(t.key)}）</button>`).join("")}
        </div>
        <div class="mobile-message-filter-panel ${state.filterOpen?"open":""}">
          <div class="mobile-message-status-row design">
            <div class="mobile-message-status-tabs design">
              <button class="${state.status==="all"?"active":""}" onclick="setMobileMessageStatusV2263('all')">全部${live.all}</button>
              <button class="${state.status==="unread"?"active":""}" onclick="setMobileMessageStatusV2263('unread')">未读${live.unread}</button>
              <button class="${state.status==="read"?"active":""}" onclick="setMobileMessageStatusV2263('read')">已读${live.read}</button>
            </div>
            <button class="mobile-message-filter-btn ${state.hasFilter?"has-filter":""} ${state.filterOpen?"open":""}" onclick="toggleMobileMessageFilterV2266()"><span></span>筛选<i></i></button>
          </div>
          <div id="mobileFilterDrawerMount">${state.filterOpen?renderMobileMessageFilterDrawerV2266():""}</div>
        </div>
        ${state.filterOpen?`<div class="mobile-filter-lower-mask" onclick="closeMobileMessageFilterV2267()"></div>`:""}
        <section class="mobile-message-list">${renderMobileMessageCenterCardsV2263()}</section>
        <button class="mobile-message-float-read" onclick="markFilteredMobileMessagesReadV2269()"><span></span><em>${live.unread}</em><strong>一键已读</strong></button>
      </main>
    </div>
  `;
}

(function(){
  function todoType(type){
    return type==="待办任务" || type==="待办通知";
  }
  function receiverData(level,type){
    const source=(window.ReceiverLevelData || (typeof ReceiverLevelData!=="undefined" ? ReceiverLevelData : {}));
    return source[level || "enterprise"]?.[type] || [];
  }
  function popupLock(){
    const type=document.getElementById("msgTplFormType");
    const sel=document.getElementById("msgTplPopupStyle") || document.querySelector("#msgTplPopupStyleWrap select");
    if(!type || !sel)return;
    const map={
      "消息通知":"普通样式",
      "通知公告":"普通样式",
      "预警通知":"预警样式",
      "待办任务":"待办样式",
      "待办通知":"待办样式"
    };
    const value=map[type.value];
    if(value){
      sel.value=value;
      sel.disabled=true;
      sel.classList.add("locked-select");
      sel.title="弹框样式由消息类型自动锁定";
    }else{
      sel.disabled=false;
      sel.classList.remove("locked-select");
      sel.removeAttribute("title");
    }
  }
  function overdueEnabled(){
    const type=document.getElementById("msgTplFormType")?.value;
    return todoType(type)
      && !!document.getElementById("msgTplTimeControl")?.checked
      && !!document.getElementById("msgTplOverdueNotify")?.checked;
  }
  function overdueLevel(){
    return document.getElementById("msgTplOverdueReceiverLevel")?.value
      || window.__overdueReceiverLevel
      || document.getElementById("msgTplReceiverLevel")?.value
      || "enterprise";
  }
  function renderOverduePicker(type){
    if(type==="all")return "";
    const data=receiverData(overdueLevel(),type);
    return `<label class="target-inner-label">${labelMap(type)}
      ${renderTemplateCheckTreeSelect("msgTplOverdueTargetValue",
        [{label:"列表",children:data.map(x=>({label:x}))}],
        "请选择",
        data
      )}
    </label>`;
  }
  function layoutAdvanced(){
    const combo=document.querySelector("#msgTplTimeValueField .trigger-time-combo");
    if(combo){
      combo.classList.add("todo-time-combo");
      combo.style.display="grid";
      combo.style.gridTemplateColumns="75% 25%";
      combo.style.gap="8px";
      combo.style.width="100%";
    }
    const notify=document.getElementById("msgTplOverdueNotifyField");
    const level=document.getElementById("msgTplOverdueReceiverLevelField");
    const type=document.getElementById("msgTplOverdueTargetTypeField");
    const picker=document.getElementById("msgTplOverdueTargetPicker");
    if(notify){notify.style.gridRow="2";notify.style.gridColumn="1";}
    if(level){level.style.gridRow="2";level.style.gridColumn="2";}
    if(type){type.style.gridRow="2";type.style.gridColumn="3";}
    if(picker){picker.style.gridRow="2";picker.style.gridColumn="4";}
  }
  function syncOverduePicker(){
    const type=document.getElementById("msgTplOverdueTargetType")?.value || "post";
    const picker=document.getElementById("msgTplOverdueTargetPicker");
    if(!picker)return;
    if(!overdueEnabled() || type==="all"){
      picker.style.display="none";
      picker.innerHTML="";
      return;
    }
    picker.innerHTML=renderOverduePicker(type);
    picker.style.display="";
    setTimeout(()=>{
      try{
        refreshTemplateTreeStates("msgTplOverdueTargetValue");
        updateTemplateCheckTreeValue("msgTplOverdueTargetValue");
      }catch(e){}
    },0);
  }
  function syncAdvanced(){
    const type=document.getElementById("msgTplFormType")?.value;
    const show=todoType(type);
    const panel=document.getElementById("msgTplAdvancedControl");
    if(panel)panel.style.display=show?"block":"none";

    const control=!!document.getElementById("msgTplTimeControl")?.checked;
    const overdue=!!document.getElementById("msgTplOverdueNotify")?.checked;
    const route=show && control && overdue;

    const timeField=document.getElementById("msgTplTimeValueField");
    const overdueField=document.getElementById("msgTplOverdueNotifyField");
    const levelField=document.getElementById("msgTplOverdueReceiverLevelField");
    const targetTypeField=document.getElementById("msgTplOverdueTargetTypeField");
    const targetPicker=document.getElementById("msgTplOverdueTargetPicker");
    const timeText=document.getElementById("msgTplTimeControlText");
    const overdueText=document.getElementById("msgTplOverdueNotifyText");

    if(timeField)timeField.style.display=(show&&control)?"":"none";
    if(overdueField)overdueField.style.display=(show&&control)?"":"none";
    if(levelField)levelField.style.display=route?"":"none";
    if(targetTypeField)targetTypeField.style.display=route?"":"none";
    if(targetPicker)targetPicker.style.display=(route && document.getElementById("msgTplOverdueTargetType")?.value!=="all")?"":"none";
    if(timeText)timeText.innerText=control?"开启":"关闭";
    if(overdueText)overdueText.innerText=overdue?"开启":"关闭";

    layoutAdvanced();
    popupLock();
    if(route)syncOverduePicker();
  }
  function syncMainLevel(){
    const level=document.getElementById("msgTplReceiverLevel")?.value;
    if(level)window.__receiverLevel=level;
    if(typeof syncTemplateTargetSelector==="function")syncTemplateTargetSelector();
    try{
      refreshTemplateTreeStates("msgTplTargetValue");
      updateTemplateCheckTreeValue("msgTplTargetValue");
    }catch(e){}
  }
  function syncOverdueLevel(){
    const level=document.getElementById("msgTplOverdueReceiverLevel")?.value;
    if(level)window.__overdueReceiverLevel=level;
    syncOverduePicker();
  }

  window.syncTemplatePopupStyleLock=popupLock;
  window.renderTodoOverdueTargetPicker=renderOverduePicker;
  window.syncTodoOverdueTargetSelector=syncOverduePicker;
  window.syncTodoAdvancedControl=syncAdvanced;
  window.enforceTodoAdvancedLayout=layoutAdvanced;
  window.syncReceiverLevel=syncMainLevel;
  window.syncTodoOverdueReceiverLevel=syncOverdueLevel;

  const origin=window.selectMessageTemplateType;
  window.selectMessageTemplateType=function(type){
    if(typeof origin==="function")origin(type);
    popupLock();
    syncAdvanced();
  };
})();

/* V2.2.73 FINAL effective todo dialog source override */
function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  const old=document.getElementById("mobileMessageDialogLayer");
  if(old)old.remove();
  const layer=document.createElement("div");
  layer.id="mobileMessageDialogLayer";
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <div class="mobile-message-dialog normal">
      <div class="mobile-message-dialog-head">
        <div><h2>${item.title}</h2><p>创建于 ${item.time}</p></div>
      </div>
      <div class="mobile-message-dialog-content">${item.content}</div>
      <div class="mobile-message-dialog-actions two">
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
      </div>
    </div>
  `;
  document.querySelector(".mobile-workbench")?.appendChild(layer);
}

function closeMobileTodoDialogV2272(){
  document.getElementById("mobileMessageDialogLayer")?.remove();
  if(window.__mobileTodoDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || "todo";
    const notice=window.__mobileDialogReturnNotice || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setMobilePrimaryTabV2262(primary);
    if(primary==="message")setMobileNoticeTypeV2256(notice);
  }else{
    renderMobileTodoCenterV2271();
  }
}

/* V2.2.74 EOF effective mobile mine center */
function mobileTabIconV2256(name,label,active=false){
  const actions={
    workbench:"renderMobileWorkbench()",
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
      <button class="tab-create"><span>+</span><strong>发起整改单</strong></button>
      ${mobileTabIconV2256("warning","预警",active==="warning")}
      ${mobileTabIconV2256("mine","我的",active==="mine")}
    </nav>
  `;
}

function renderMobileMineMenuItemV2274(type,title,extra){
  return `
    <button class="mobile-mine-menu-item" type="button">
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileMineCenterV2274(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-mine-page">
      <header class="mobile-top mobile-mine-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-mine-titlebar">
          <h1>个人中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-mine-scroll">
        <section class="mobile-mine-profile mobile-card">
          <div class="mobile-mine-avatar" aria-hidden="true">
            <span class="avatar-head"></span>
            <span class="avatar-neck"></span>
            <span class="avatar-suit left"></span>
            <span class="avatar-suit right"></span>
            <span class="avatar-shirt"></span>
            <span class="avatar-tie"></span>
          </div>
          <div class="mobile-mine-user">
            <div class="mobile-mine-name-row">
              <strong>王力群</strong>
              <span>经济审批专员</span>
            </div>
            <p>城市环境/环境建设公司</p>
          </div>
        </section>
        <section class="mobile-mine-menu mobile-card">
          ${renderMobileMineMenuItemV2274("version","版本记录",`<span class="mobile-mine-current">当前</span><em>1.12.8正式版</em>`)}
          ${renderMobileMineMenuItemV2274("manual","操作手册","")}
          ${renderMobileMineMenuItemV2274("feedback","意见反馈","")}
          ${renderMobileMineMenuItemV2274("setting","设置","")}
        </section>
      </main>
      ${renderMobileBottomTabbarV2274("mine")}
    </div>
  `;
}

/* V2.2.75 EOF effective version record pages */
const mobileVersionRecordsV2275=[
  {
    id:"v284",
    version:"V2.8.4",
    current:true,
    time:"2025-04-10 23:04:23",
    title:"系统版本更新提醒",
    summary:"数智施工正式发布V2.8.4版本一安全板块变更内容，详情请点击消息查看或进入版本更新记录查看",
    detail:["【安全板块】","1. 新建实验支持 1 天统计周期，可快速出实验结论。","2. 支持修改实验，未发布实验可修改指标、实验组等；进行中实验只支持修改实验分组比例，满足实验流量灰度功能。","3. 通用指标支持分享指标，事件上报支持查看事件data。","4. 新建实验定向人群支持自定义人群包。","【生产板块】","1. 隐患排查流程优化，提升隐患上报与整改闭环效率。","2. 视频监控支持多画面同时播放，优化回放体验。"]
  },
  {
    id:"v283",
    version:"V2.8.3",
    current:false,
    time:"2025-03-28 18:20:11",
    title:"隐患排查功能优化",
    summary:"优化隐患排查流程，提升隐患上报与整改闭环效率，修复已知问题",
    detail:["1. 优化隐患排查任务流转规则。","2. 增加整改超期提醒与复核状态展示。","3. 修复部分列表筛选条件回显异常问题。"]
  },
  {
    id:"v282",
    version:"V2.8.2",
    current:false,
    time:"2025-03-15 14:10:05",
    title:"视频监控功能升级",
    summary:"支持多画面同时播放，优化视频回放体验，修复部分设备接入问题",
    detail:["1. 新增多画面视频播放能力。","2. 优化监控回放加载速度。","3. 修复部分设备离线状态不同步问题。"]
  },
  {
    id:"v281",
    version:"V2.8.1",
    current:false,
    time:"2025-02-27 09:30:45",
    title:"待办流程优化",
    summary:"优化待办任务提醒机制，提升任务处理效率，修复部分已知问题",
    detail:["1. 优化待办任务提醒与状态同步。","2. 支持从工作台快速查看待办详情。","3. 修复待办筛选数量统计异常问题。"]
  },
  {
    id:"v280",
    version:"V2.8.0",
    current:false,
    time:"2025-02-10 10:00:00",
    title:"新版本发布",
    summary:"数智施工V2.8.0版本正式发布，新增多项功能及性能优化",
    detail:["1. 新增移动端工作台基础能力。","2. 优化消息中心、预警通知与待办流程。","3. 提升页面加载性能与基础交互体验。"]
  }
];

function renderMobileMineMenuItemV2274(type,title,extra){
  const action=type==="version" ? "onclick=\"renderMobileVersionListV2275()\"" : "";
  return `
    <button class="mobile-mine-menu-item" type="button" ${action}>
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileVersionHeaderV2275(title,backAction="renderMobileMineCenterV2274()"){
  return `
    <header class="mobile-version-top">
      <div class="mobile-statusbar">
        <div class="mobile-time">16:41</div>
        <div class="mobile-phone-icons" aria-hidden="true">
          <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="mobile-wifi"></span>
          <span class="mobile-battery"></span>
        </div>
      </div>
      <div class="mobile-version-titlebar">
        <button class="mobile-version-back" onclick="${backAction}" aria-label="返回"></button>
        <h1>${title}</h1>
        <button class="mobile-version-help" aria-label="帮助">?</button>
      </div>
    </header>
  `;
}

function renderMobileVersionCurrentCardV2275(){
  const current=mobileVersionRecordsV2275.find(item=>item.current) || mobileVersionRecordsV2275[0];
  return `
    <section class="mobile-version-current-card" onclick="renderMobileVersionDetailV2275('${current.id}')">
      <div class="mobile-version-cube primary" aria-hidden="true"><span></span></div>
      <div class="mobile-version-current-info">
        <div class="mobile-version-current-row">
          <strong>当前版本</strong>
          <span>当前版本</span>
        </div>
        <h2>${current.version}</h2>
        <p>更新于 ${current.time}</p>
      </div>
      <div class="mobile-version-cube ghost" aria-hidden="true"><span></span></div>
    </section>
  `;
}

function renderMobileVersionCardV2275(item,index){
  return `
    <div class="mobile-version-line-item ${index===0?"active":""}">
      <span class="mobile-version-dot"></span>
      <button class="mobile-version-card" type="button" onclick="renderMobileVersionDetailV2275('${item.id}')">
        <div class="mobile-version-card-head">
          <div class="mobile-version-name">
            <strong>${item.version}</strong>
            ${item.current?`<span>当前版本</span>`:""}
          </div>
          <time>${item.time}</time>
          <i aria-hidden="true"></i>
        </div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </button>
    </div>
  `;
}

function renderMobileVersionListV2275(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-version-page">
      ${renderMobileVersionHeaderV2275("版本记录")}
      <main class="mobile-version-scroll">
        ${renderMobileVersionCurrentCardV2275()}
        <section class="mobile-version-timeline">
          ${mobileVersionRecordsV2275.map(renderMobileVersionCardV2275).join("")}
        </section>
      </main>
    </div>
  `;
}

function renderMobileVersionDetailV2275(id){
  const item=mobileVersionRecordsV2275.find(record=>record.id===id) || mobileVersionRecordsV2275[0];
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-version-page mobile-version-detail-page">
      ${renderMobileVersionHeaderV2275("版本详情","renderMobileVersionListV2275()")}
      <main class="mobile-version-scroll">
        <section class="mobile-version-detail-card">
          <div class="mobile-version-detail-head">
            <div class="mobile-version-cube primary" aria-hidden="true"><span></span></div>
            <div>
              <div class="mobile-version-name">
                <strong>${item.version}</strong>
                ${item.current?`<span>当前版本</span>`:""}
              </div>
              <h2>${item.title}</h2>
              <p>更新于 ${item.time}</p>
            </div>
          </div>
          <div class="mobile-version-detail-content">
            ${item.detail.map(line=>line.startsWith("【")?`<h3>${line}</h3>`:`<p>${line}</p>`).join("")}
          </div>
        </section>
      </main>
    </div>
  `;
}

/* V2.2.76 EOF effective version record polish */
function getMobileCurrentVersionV2276(){
  return mobileVersionRecordsV2275.find(item=>item.current) || mobileVersionRecordsV2275[0];
}

function renderMobileVersionCurrentCardV2275(){
  const current=getMobileCurrentVersionV2276();
  return `
    <section class="mobile-version-current-card mobile-version-current-tip">
      <div class="mobile-version-cube primary" aria-hidden="true"><span></span></div>
      <div class="mobile-version-current-info">
        <div class="mobile-version-current-line">
          <strong>${current.version}</strong>
          <span>当前版本</span>
        </div>
        <p>更新于 ${current.time.slice(0,16)}</p>
      </div>
      <div class="mobile-version-cube ghost" aria-hidden="true"><span></span></div>
    </section>
  `;
}

function renderMobileMineCenterV2274(){
  const app=document.querySelector(".app");
  if(!app)return;
  const current=getMobileCurrentVersionV2276();
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-mine-page">
      <header class="mobile-top mobile-mine-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">16:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-mine-titlebar">
          <h1>个人中心</h1>
          <div class="mobile-capsule" aria-hidden="true">
            <span class="mobile-dots"><i></i><i></i><i></i></span>
            <span class="mobile-capsule-line"></span>
            <span class="mobile-circle"></span>
          </div>
        </div>
      </header>
      <main class="mobile-mine-scroll">
        <section class="mobile-mine-profile mobile-card">
          <div class="mobile-mine-avatar" aria-hidden="true">
            <span class="avatar-head"></span>
            <span class="avatar-neck"></span>
            <span class="avatar-suit left"></span>
            <span class="avatar-suit right"></span>
            <span class="avatar-shirt"></span>
            <span class="avatar-tie"></span>
          </div>
          <div class="mobile-mine-user">
            <div class="mobile-mine-name-row">
              <strong>王力群</strong>
              <span>经济审批专员</span>
            </div>
            <p>城市环境/环境建设公司</p>
          </div>
        </section>
        <section class="mobile-mine-menu mobile-card">
          ${renderMobileMineMenuItemV2274("version","版本记录",`<span class="mobile-mine-current">当前</span><em>${current.version}正式版</em>`)}
          ${renderMobileMineMenuItemV2274("manual","操作手册","")}
          ${renderMobileMineMenuItemV2274("feedback","意见反馈","")}
          ${renderMobileMineMenuItemV2274("setting","设置","")}
        </section>
      </main>
      ${renderMobileBottomTabbarV2274("mine")}
    </div>
  `;
}

/* V2.2.77 EOF effective feedback pages */
const mobileFeedbackModulesV2277=["实名制","安全","隐患排查","经济诊断","进度","风险","质量","材料","设备","三合一","环境","市场","基础能力","数据"];
const mobileFeedbackHistoryV2277=[
  {
    id:"fb1",
    type:"优化建议",
    status:"processing",
    statusText:"处理中",
    modules:["设备","基础能力"],
    desc:"目前数智平台主要为人员、安全、经济管理，缺乏设备管理模块。例如通过平台设备设施管理模块，上传验收合格后的设备资料并现场张贴设备设施二维码。",
    time:"2025-09-16 18:56"
  },
  {
    id:"fb2",
    type:"优化建议",
    status:"replied",
    statusText:"已答复",
    modules:["设备","基础能力"],
    desc:"目前数智平台主要为人员、安全、经济管理，缺乏设备管理模块。例如通过平台设备设施管理模块，上传验收合格后的设备资料并现场张贴设备设施二维码。",
    time:"2025-09-16 18:56",
    reply:"已与技术沟通优化方案，预计在10月9日发布的版本中完成优化",
    replyTime:"2025-09-16 18:56"
  }
];
const mobileFeedbackStateV2277={
  type:"优化建议",
  modules:["设备","基础能力"],
  desc:"目前数智平台主要为人员、安全、经济管理，缺乏设备管理模块。例如：通过平台设备设施管理模块，上传验收合格后的设备资料并现场张贴设备设施二维码。专管机械员在APP上每月对现场设备进行巡检，若逾期未巡检，平台会进行短信提醒。",
  contact:"18013419982",
  images:["photo","doc"]
};

function renderMobileMineMenuItemV2274(type,title,extra){
  const actions={
    version:"renderMobileVersionListV2275()",
    feedback:"renderMobileFeedbackFormV2277()"
  };
  const action=actions[type] ? `onclick="${actions[type]}"` : "";
  return `
    <button class="mobile-mine-menu-item" type="button" ${action}>
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileFeedbackHeaderV2277(title,backAction="renderMobileMineCenterV2274()"){
  return `
    <header class="mobile-feedback-top">
      <div class="mobile-statusbar">
        <div class="mobile-time">16:41</div>
        <div class="mobile-phone-icons" aria-hidden="true">
          <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="mobile-wifi"></span>
          <span class="mobile-battery"></span>
        </div>
      </div>
      <div class="mobile-feedback-titlebar">
        <button class="mobile-version-back" onclick="${backAction}" aria-label="返回"></button>
        <h1>${title}</h1>
        <div class="mobile-capsule" aria-hidden="true">
          <span class="mobile-dots"><i></i><i></i><i></i></span>
          <span class="mobile-capsule-line"></span>
          <span class="mobile-circle minus"></span>
        </div>
      </div>
    </header>
  `;
}

function setMobileFeedbackTypeV2277(type){
  mobileFeedbackStateV2277.type=type;
  renderMobileFeedbackFormV2277();
}

function toggleMobileFeedbackModuleV2277(module){
  const list=mobileFeedbackStateV2277.modules;
  if(list.includes(module)){
    mobileFeedbackStateV2277.modules=list.filter(item=>item!==module);
  }else{
    list.push(module);
  }
  renderMobileFeedbackFormV2277();
}

function syncMobileFeedbackFieldV2277(field,value){
  mobileFeedbackStateV2277[field]=value;
}

function addMobileFeedbackImageV2277(input){
  const file=input.files && input.files[0];
  if(!file)return;
  mobileFeedbackStateV2277.images.push(file.name || "image");
  renderMobileFeedbackFormV2277();
}

function removeMobileFeedbackImageV2277(index){
  mobileFeedbackStateV2277.images.splice(index,1);
  renderMobileFeedbackFormV2277();
}

function submitMobileFeedbackV2277(){
  if(!mobileFeedbackStateV2277.type || !mobileFeedbackStateV2277.modules.length || !mobileFeedbackStateV2277.desc.trim())return;
  renderMobileFeedbackSuccessV2277();
}

function renderMobileFeedbackImagesV2277(){
  const imgs=mobileFeedbackStateV2277.images.slice(0,3);
  return `
    <div class="mobile-feedback-images">
      ${imgs.map((name,index)=>`
        <div class="mobile-feedback-thumb ${name==="doc"?"doc":"photo"}">
          <button type="button" onclick="removeMobileFeedbackImageV2277(${index})">×</button>
        </div>
      `).join("")}
      ${imgs.length<3?`
        <label class="mobile-feedback-upload">
          <input type="file" accept="image/*" onchange="addMobileFeedbackImageV2277(this)"/>
          <span></span>
        </label>
      `:""}
    </div>
  `;
}

function renderMobileFeedbackFormV2277(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const typeOptions=["优化建议","功能问题","功能价值点"];
  app.innerHTML=`
    <div class="mobile-workbench mobile-feedback-page">
      ${renderMobileFeedbackHeaderV2277("")}
      <main class="mobile-feedback-scroll form">
        <section class="mobile-feedback-hero">
          <div>
            <div class="mobile-feedback-hero-title">
              <h1>意见反馈</h1>
              <button onclick="renderMobileFeedbackListV2277()">查看历史反馈 <span>${mobileFeedbackHistoryV2277.length+10}</span></button>
            </div>
            <p>您的反馈是我们改进的动力</p>
          </div>
          <div class="mobile-feedback-art" aria-hidden="true"></div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈类型 <em>*</em></h2>
          <div class="mobile-feedback-pills type">
            ${typeOptions.map(type=>`<button class="${mobileFeedbackStateV2277.type===type?"active":""}" onclick="setMobileFeedbackTypeV2277('${type}')">${type}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>相关模块（可多选） <em>*</em></h2>
          <div class="mobile-feedback-pills modules">
            ${mobileFeedbackModulesV2277.map(module=>`<button class="${mobileFeedbackStateV2277.modules.includes(module)?"active":""}" onclick="toggleMobileFeedbackModuleV2277('${module}')">${module}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈描述 <em>*</em></h2>
          <textarea onchange="syncMobileFeedbackFieldV2277('desc',this.value)" oninput="syncMobileFeedbackFieldV2277('desc',this.value)">${mobileFeedbackStateV2277.desc}</textarea>
          ${renderMobileFeedbackImagesV2277()}
          <p class="mobile-feedback-tip">上传图片有助于我们更好理解您的需求</p>
        </section>
        <section class="mobile-feedback-card contact">
          <h2>联系方式</h2>
          <input value="${mobileFeedbackStateV2277.contact}" onchange="syncMobileFeedbackFieldV2277('contact',this.value)" oninput="syncMobileFeedbackFieldV2277('contact',this.value)"/>
        </section>
      </main>
      <footer class="mobile-feedback-bottom">
        <button onclick="submitMobileFeedbackV2277()">提交反馈</button>
      </footer>
    </div>
  `;
}

function renderMobileFeedbackSuccessV2277(){
  const app=document.querySelector(".app");
  if(!app)return;
  app.innerHTML=`
    <div class="mobile-workbench mobile-feedback-page">
      ${renderMobileFeedbackHeaderV2277("意见反馈","renderMobileFeedbackFormV2277()")}
      <main class="mobile-feedback-success-wrap">
        <section class="mobile-feedback-success-card">
          <div class="mobile-feedback-success-icon" aria-hidden="true"><span></span></div>
          <h2>反馈成功</h2>
          <p>运维人员将在三个工作日内为您答复</p>
        </section>
      </main>
      <footer class="mobile-feedback-bottom">
        <button onclick="renderMobileMineCenterV2274()">返回</button>
      </footer>
    </div>
  `;
}

function renderMobileFeedbackHistoryCardV2277(item){
  return `
    <section class="mobile-feedback-history-card ${item.status}">
      <div class="mobile-feedback-status"><i></i><span>${item.statusText}</span></div>
      <h2><i></i>${item.type}</h2>
      <dl>
        <dt>相关模块</dt>
        <dd>${item.modules.map(module=>`<span>${module}</span>`).join("")}</dd>
        <dt>反馈描述</dt>
        <dd>${item.desc}</dd>
        <dt>反馈时间</dt>
        <dd>${item.time}</dd>
        ${item.reply?`<dt>答复内容</dt><dd>${item.reply}</dd><dt>答复时间</dt><dd>${item.replyTime}</dd>`:""}
      </dl>
    </section>
  `;
}

function renderMobileFeedbackListV2277(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-feedback-page mobile-feedback-list-page">
      ${renderMobileFeedbackHeaderV2277("意见反馈","renderMobileFeedbackFormV2277()")}
      <main class="mobile-feedback-list-scroll">
        ${mobileFeedbackHistoryV2277.map(renderMobileFeedbackHistoryCardV2277).join("")}
      </main>
      <footer class="mobile-feedback-bottom">
        <button onclick="renderMobileFeedbackFormV2277()">我要反馈</button>
      </footer>
    </div>
  `;
}

/* V2.2.78 EOF effective feedback density polish */
function renderMobileFeedbackFormV2277(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const typeOptions=["优化建议","功能问题","功能价值点"];
  app.innerHTML=`
    <div class="mobile-workbench mobile-feedback-page">
      ${renderMobileFeedbackHeaderV2277("")}
      <main class="mobile-feedback-scroll form compact">
        <section class="mobile-feedback-hero compact">
          <div>
            <div class="mobile-feedback-hero-title compact">
              <h1>意见反馈</h1>
              <button onclick="renderMobileFeedbackListV2277()">查看历史反馈 <span>${mobileFeedbackHistoryV2277.length}</span></button>
            </div>
            <p>您的反馈是我们改进的动力</p>
          </div>
          <div class="mobile-feedback-art" aria-hidden="true"></div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈类型 <em>*</em></h2>
          <div class="mobile-feedback-pills type">
            ${typeOptions.map(type=>`<button class="${mobileFeedbackStateV2277.type===type?"active":""}" onclick="setMobileFeedbackTypeV2277('${type}')">${type}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>相关模块（可多选） <em>*</em></h2>
          <div class="mobile-feedback-pills modules">
            ${mobileFeedbackModulesV2277.map(module=>`<button class="${mobileFeedbackStateV2277.modules.includes(module)?"active":""}" onclick="toggleMobileFeedbackModuleV2277('${module}')">${module}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈描述 <em>*</em></h2>
          <textarea onchange="syncMobileFeedbackFieldV2277('desc',this.value)" oninput="syncMobileFeedbackFieldV2277('desc',this.value)">${mobileFeedbackStateV2277.desc}</textarea>
          ${renderMobileFeedbackImagesV2277()}
          <p class="mobile-feedback-tip">上传图片有助于我们更好理解您的需求</p>
        </section>
        <section class="mobile-feedback-card contact">
          <h2>联系方式</h2>
          <input value="${mobileFeedbackStateV2277.contact}" onchange="syncMobileFeedbackFieldV2277('contact',this.value)" oninput="syncMobileFeedbackFieldV2277('contact',this.value)"/>
        </section>
      </main>
      <footer class="mobile-feedback-bottom">
        <button onclick="submitMobileFeedbackV2277()">提交反馈</button>
      </footer>
    </div>
  `;
}

/* V2.2.79 EOF effective mobile manual pages */
const mobileManualStateV2279={tab:"production",subTab:""};
const mobileManualDataV2279={
  production:{
    label:"生产",
    color:"#3B82F6",
    subtabs:[],
    title:"生产管理",
    items:[
      {title:"项目管理",desc:"项目创建、项目设置、项目状态管理等功能操作说明"},
      {title:"进度管理",desc:"进度计划编制、进度填报、进度对比分析等功能操作说明"},
      {title:"产值管理",desc:"产值期初上报、实际产值上报、产值确认等功能操作说明"},
      {title:"合同管理",desc:"合同登记、合同变更、合同结算等功能操作说明"},
      {title:"物资管理",desc:"物资计划、物资采购、物资验收等功能操作说明"}
    ]
  },
  safety:{
    label:"安全",
    color:"#FF4D57",
    subtabs:["人员实名制","视频监控","安全每日监督","白名单","轻微事故"],
    title:"人员实名制",
    items:[
      {title:"项目人员录入操作手册",desc:"项目人员信息录入、人员批量导入、人员信息维护等操作说明"},
      {title:"人员信息变更操作手册",desc:"人员信息修改、岗位变更、证件更新等操作说明"},
      {title:"人员离场管理操作手册",desc:"人员离场申请、离场审核、离场记录查询等操作说明"},
      {title:"权限管理操作手册",desc:"人员角色分配、权限设置、权限调整等操作说明"},
      {title:"人员统计分析操作手册",desc:"人员数据统计、人员考勤分析、人员构成分析等操作说明"}
    ]
  },
  economy:{
    label:"经济",
    color:"#F59E0B",
    subtabs:[],
    title:"经济管理",
    items:[
      {title:"成本登记操作手册",desc:"项目成本录入、成本分类维护、成本台账查询等操作说明"},
      {title:"经济诊断操作手册",desc:"经营指标诊断、异常项分析、整改建议查看等操作说明"},
      {title:"合同结算操作手册",desc:"合同结算申报、审核流转、结算记录查询等操作说明"},
      {title:"产值确认操作手册",desc:"产值确认、审批流转、历史数据追踪等操作说明"}
    ]
  }
};

function renderMobileMineMenuItemV2274(type,title,extra){
  const actions={
    version:"renderMobileVersionListV2275()",
    manual:"renderMobileManualPageV2279()",
    feedback:"renderMobileFeedbackFormV2277()"
  };
  const action=actions[type] ? `onclick="${actions[type]}"` : "";
  return `
    <button class="mobile-mine-menu-item" type="button" ${action}>
      <span class="mobile-mine-menu-icon ${type}" aria-hidden="true"></span>
      <strong>${title}</strong>
      <span class="mobile-mine-menu-extra">${extra || ""}</span>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function setMobileManualTabV2279(tab){
  mobileManualStateV2279.tab=tab;
  const config=mobileManualDataV2279[tab];
  mobileManualStateV2279.subTab=config.subtabs[0] || "";
  renderMobileManualPageV2279();
}

function setMobileManualSubTabV2279(tab){
  mobileManualStateV2279.subTab=tab;
  renderMobileManualPageV2279();
}

function renderMobileManualHeaderV2279(){
  return `
    <header class="mobile-manual-top">
      <div class="mobile-statusbar">
        <div class="mobile-time">16:41</div>
        <div class="mobile-phone-icons" aria-hidden="true">
          <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="mobile-wifi"></span>
          <span class="mobile-battery"></span>
        </div>
      </div>
      <div class="mobile-manual-titlebar">
        <button class="mobile-version-back" onclick="renderMobileMineCenterV2274()" aria-label="返回"></button>
        <h1>操作手册</h1>
        <button class="mobile-manual-search" aria-label="搜索"></button>
      </div>
    </header>
  `;
}

function renderMobileManualTipV2279(){
  return `
    <section class="mobile-manual-tip">
      <div class="mobile-manual-tip-icon" aria-hidden="true"></div>
      <div>
        <h2>数智施工生产管理平台操作手册</h2>
        <p>快速了解系统功能与操作流程</p>
      </div>
      <i aria-hidden="true"></i>
    </section>
  `;
}

function renderMobileManualMainTabsV2279(){
  return `
    <div class="mobile-manual-main-tabs">
      ${Object.entries(mobileManualDataV2279).map(([key,item])=>`
        <button class="${mobileManualStateV2279.tab===key?"active":""} ${key}" onclick="setMobileManualTabV2279('${key}')">
          <span></span>${item.label}
        </button>
      `).join("")}
    </div>
  `;
}

function renderMobileManualSubTabsV2279(config){
  if(!config.subtabs.length)return "";
  const active=mobileManualStateV2279.subTab || config.subtabs[0];
  return `
    <div class="mobile-manual-subtabs">
      ${config.subtabs.map(tab=>`<button class="${active===tab?"active":""}" onclick="setMobileManualSubTabV2279('${tab}')">${tab}</button>`).join("")}
    </div>
  `;
}

function renderMobileManualItemV2279(item,index,tab){
  return `
    <button class="mobile-manual-card ${tab}" type="button">
      <div class="mobile-manual-card-cover">
        <span>管理</span>
        <strong>${String(index+1).padStart(2,"0")}</strong>
      </div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
      <i aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileManualPageV2279(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const tab=mobileManualStateV2279.tab || "production";
  const config=mobileManualDataV2279[tab];
  if(config.subtabs.length && !mobileManualStateV2279.subTab)mobileManualStateV2279.subTab=config.subtabs[0];
  app.innerHTML=`
    <div class="mobile-workbench mobile-manual-page">
      ${renderMobileManualHeaderV2279()}
      <main class="mobile-manual-scroll">
        ${renderMobileManualTipV2279()}
        ${renderMobileManualMainTabsV2279()}
        ${renderMobileManualSubTabsV2279(config)}
        <section class="mobile-manual-section">
          <h2>${config.subtabs.length ? (mobileManualStateV2279.subTab || config.title) : config.title}</h2>
          <div class="mobile-manual-list">
            ${config.items.map((item,index)=>renderMobileManualItemV2279(item,index,tab)).join("")}
          </div>
          <p class="mobile-manual-loaded">已加载全部</p>
        </section>
      </main>
    </div>
  `;
}

/* V2.2.80 EOF effective manual title polish */
function renderMobileManualTipV2279(){
  return `
    <section class="mobile-manual-tip">
      <div class="mobile-manual-tip-icon" aria-hidden="true"></div>
      <div>
        <h2>数智施工平台操作手册</h2>
        <p>快速了解系统功能与操作流程</p>
      </div>
    </section>
  `;
}

/* V2.2.81 EOF effective mobile detail polish */
function renderMobileFeedbackFormV2277(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const typeOptions=["优化建议","功能问题","功能价值点"];
  app.innerHTML=`
    <div class="mobile-workbench mobile-feedback-page">
      ${renderMobileFeedbackHeaderV2277("意见反馈")}
      <main class="mobile-feedback-scroll form compact">
        <section class="mobile-feedback-hero compact v2281">
          <div class="mobile-feedback-hero-copy">您的反馈是我们改进的动力</div>
          <button class="mobile-feedback-history-link" onclick="renderMobileFeedbackListV2277()">查看历史反馈 <span>${mobileFeedbackHistoryV2277.length}</span></button>
          <div class="mobile-feedback-art" aria-hidden="true"></div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈类型 <em>*</em></h2>
          <div class="mobile-feedback-pills type">
            ${typeOptions.map(type=>`<button class="${mobileFeedbackStateV2277.type===type?"active":""}" onclick="setMobileFeedbackTypeV2277('${type}')">${type}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>相关模块（可多选） <em>*</em></h2>
          <div class="mobile-feedback-pills modules">
            ${mobileFeedbackModulesV2277.map(module=>`<button class="${mobileFeedbackStateV2277.modules.includes(module)?"active":""}" onclick="toggleMobileFeedbackModuleV2277('${module}')">${module}</button>`).join("")}
          </div>
        </section>
        <section class="mobile-feedback-card">
          <h2>反馈描述 <em>*</em></h2>
          <textarea onchange="syncMobileFeedbackFieldV2277('desc',this.value)" oninput="syncMobileFeedbackFieldV2277('desc',this.value)">${mobileFeedbackStateV2277.desc}</textarea>
          ${renderMobileFeedbackImagesV2277()}
          <p class="mobile-feedback-tip">上传图片有助于我们更好理解您的需求</p>
        </section>
        <section class="mobile-feedback-card contact">
          <h2>联系方式</h2>
          <input value="${mobileFeedbackStateV2277.contact}" onchange="syncMobileFeedbackFieldV2277('contact',this.value)" oninput="syncMobileFeedbackFieldV2277('contact',this.value)"/>
        </section>
      </main>
      <footer class="mobile-feedback-bottom">
        <button onclick="submitMobileFeedbackV2277()">提交反馈</button>
      </footer>
    </div>
  `;
}

function mobileManualSubTabDragStartV2281(event){
  const el=event.currentTarget;
  el.dataset.dragging="1";
  el.dataset.startX=String(event.clientX);
  el.dataset.scrollLeft=String(el.scrollLeft);
}

function mobileManualSubTabDragMoveV2281(event){
  const el=event.currentTarget;
  if(el.dataset.dragging!=="1")return;
  event.preventDefault();
  const startX=Number(el.dataset.startX || 0);
  const scrollLeft=Number(el.dataset.scrollLeft || 0);
  el.scrollLeft=scrollLeft-(event.clientX-startX);
}

function mobileManualSubTabDragEndV2281(event){
  event.currentTarget.dataset.dragging="0";
}

function renderMobileManualSubTabsV2279(config){
  if(!config.subtabs.length)return "";
  const active=mobileManualStateV2279.subTab || config.subtabs[0];
  return `
    <div class="mobile-manual-subtabs" onmousedown="mobileManualSubTabDragStartV2281(event)" onmousemove="mobileManualSubTabDragMoveV2281(event)" onmouseup="mobileManualSubTabDragEndV2281(event)" onmouseleave="mobileManualSubTabDragEndV2281(event)">
      ${config.subtabs.map(tab=>`<button class="${active===tab?"active":""}" onclick="setMobileManualSubTabV2279('${tab}')">${tab}</button>`).join("")}
    </div>
  `;
}

function renderMobileManualPageV2279(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const tab=mobileManualStateV2279.tab || "production";
  const config=mobileManualDataV2279[tab];
  if(config.subtabs.length && !mobileManualStateV2279.subTab)mobileManualStateV2279.subTab=config.subtabs[0];
  app.innerHTML=`
    <div class="mobile-workbench mobile-manual-page">
      ${renderMobileManualHeaderV2279()}
      <main class="mobile-manual-scroll">
        ${renderMobileManualTipV2279()}
        ${renderMobileManualMainTabsV2279()}
        ${renderMobileManualSubTabsV2279(config)}
        <section class="mobile-manual-section no-title">
          <div class="mobile-manual-list">
            ${config.items.map((item,index)=>renderMobileManualItemV2279(item,index,tab)).join("")}
          </div>
          <p class="mobile-manual-loaded">已加载全部</p>
        </section>
      </main>
    </div>
  `;
}

/* V2.2.83 EOF effective mobile project switch */
const mobileProjectSwitchStateV2283={
  keyword:"",
  openFilter:"",
  filters:{status:[],org:[],type:[]}
};
const mobileProjectSwitchOptionsV2283={
  status:["在建","停工","完工","筹备"],
  org:["上海隧道>轨交分公司","上海路桥>总承包一部","城市环境>环境建设公司","上海能建>工程管理部"],
  type:["轨道交通","房建工程","市政工程","水务工程","公路工程"]
};
const mobileProjectSwitchListV2283=[
  {name:"上海市轨道交通23号线一期工程土建12标（龙瑞路站、上海植物园、徐浦大桥站-龙瑞路区间）",short:"上",status:"在建",type:"轨道交通",mode:"EPC",level:"股份重大工程项目",org:"上海隧道>轨交分公司",color:"blue"},
  {name:"深国际上海闵行 B-1厂房（配送中心）装修工程 EPC施工总承包工程",short:"深",status:"在建",type:"房建工程",mode:"EPC",level:"子公司重大项目",org:"上海能建>工程管理部",color:"green"},
  {name:"上海示范区线工程SFQSG-15标施工",short:"上",status:"在建",type:"市政工程",mode:"施工总承包",level:"子公司重大项目",org:"上海路桥>总承包一部",color:"purple"},
  {name:"真如副中心B片区广宁路及南石一路(北段)H型地下公共车行通道工程",short:"真",status:"在建",type:"市政工程",mode:"EPC",level:"子公司一般项目",org:"城市环境>环境建设公司",color:"cyan"},
  {name:"上海市轨道交通13号线西延伸工程102标（纪翟路站、纪翟路站-芳乐路站区间）",short:"上",status:"停工",type:"轨道交通",mode:"施工总承包",level:"股份重大工程项目",org:"上海隧道>轨交分公司",color:"red"}
];

function openMobileProjectSwitchV2283(){
  renderMobileProjectSwitchV2283();
}

function setMobileProjectKeywordV2283(value){
  mobileProjectSwitchStateV2283.keyword=value || "";
  renderMobileProjectSwitchV2283();
}

function toggleMobileProjectFilterPanelV2283(key){
  mobileProjectSwitchStateV2283.openFilter=mobileProjectSwitchStateV2283.openFilter===key ? "" : key;
  renderMobileProjectSwitchV2283();
}

function toggleMobileProjectFilterValueV2283(key,value){
  const list=mobileProjectSwitchStateV2283.filters[key];
  if(list.includes(value)){
    mobileProjectSwitchStateV2283.filters[key]=list.filter(item=>item!==value);
  }else{
    list.push(value);
  }
  renderMobileProjectSwitchV2283();
}

function getMobileProjectFilteredV2283(){
  const {keyword,filters}=mobileProjectSwitchStateV2283;
  return mobileProjectSwitchListV2283.filter(item=>{
    const kw=keyword.trim();
    if(kw && !(item.name.includes(kw)||item.org.includes(kw)))return false;
    if(filters.status.length && !filters.status.includes(item.status))return false;
    if(filters.org.length && !filters.org.includes(item.org))return false;
    if(filters.type.length && !filters.type.includes(item.type))return false;
    return true;
  });
}

function renderMobileProjectFilterPanelV2283(key){
  if(mobileProjectSwitchStateV2283.openFilter!==key)return "";
  const titles={status:"项目状态",org:"所属组织",type:"项目类型"};
  return `
    <div class="mobile-project-filter-pop ${key}">
      <label class="mobile-project-filter-search"><span></span><input placeholder="请输入关键字搜索"/></label>
      <div class="mobile-project-filter-title">${titles[key]}</div>
      <div class="mobile-project-filter-options">
        ${mobileProjectSwitchOptionsV2283[key].map(option=>`
          <button class="${mobileProjectSwitchStateV2283.filters[key].includes(option)?"active":""}" onclick="toggleMobileProjectFilterValueV2283('${key}','${option}')">
            <span></span>${option}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMobileProjectCardV2283(item){
  return `
    <button class="mobile-project-card" type="button" onclick="renderMobileWorkbench()">
      <div class="mobile-project-avatar ${item.color}">${item.short}</div>
      <div class="mobile-project-info">
        <h2>${item.name}</h2>
        <div class="mobile-project-tags">
          <span class="status ${item.status==="停工"?"stop":"build"}">${item.status}</span>
          <span class="type">${item.type}</span>
          <span class="mode">${item.mode}</span>
          <span class="level">${item.level}</span>
        </div>
      </div>
      <i class="mobile-project-star" aria-hidden="true"></i>
    </button>
  `;
}

function renderMobileProjectSwitchV2283(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const list=getMobileProjectFilteredV2283();
  app.innerHTML=`
    <div class="mobile-workbench mobile-project-switch-page">
      <header class="mobile-project-switch-top">
        <div class="mobile-statusbar">
          <div class="mobile-time">9:41</div>
          <div class="mobile-phone-icons" aria-hidden="true">
            <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="mobile-wifi"></span>
            <span class="mobile-battery"></span>
          </div>
        </div>
        <div class="mobile-project-switch-titlebar">
          <button class="mobile-version-back" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>切换项目</h1>
        </div>
      </header>
      <main class="mobile-project-switch-scroll">
        <section class="mobile-project-filter-area">
          <div class="mobile-project-search-line">
            <label class="mobile-project-search">
              <span></span>
              <input value="${mobileProjectSwitchStateV2283.keyword}" placeholder="请输入项目名称、项目编号进行搜索" onchange="setMobileProjectKeywordV2283(this.value)" onkeydown="if(event.key==='Enter')setMobileProjectKeywordV2283(this.value)"/>
            </label>
            <div class="mobile-project-count-inline">共 ${list.length} 个项目</div>
          </div>
          <div class="mobile-project-filter-row">
            <button onclick="toggleMobileProjectFilterPanelV2283('status')">项目状态<i></i></button>
            <button onclick="toggleMobileProjectFilterPanelV2283('org')">所属组织<i></i></button>
            <button onclick="toggleMobileProjectFilterPanelV2283('type')">项目类型<i></i></button>
            <button class="more">更多搜索<i></i></button>
          </div>
          ${renderMobileProjectFilterPanelV2283("status")}
          ${renderMobileProjectFilterPanelV2283("org")}
          ${renderMobileProjectFilterPanelV2283("type")}
        </section>
        <section class="mobile-project-list">
          ${list.map(renderMobileProjectCardV2283).join("")}
        </section>
      </main>
    </div>
  `;
}

if(!window.__mobileProjectSwitchMenuBoundV2283){
  window.__mobileProjectSwitchMenuBoundV2283=true;
  document.addEventListener("click",function(event){
    const btn=event.target.closest && event.target.closest(".mobile-workbench .mobile-menu-btn");
    if(!btn)return;
    event.preventDefault();
    openMobileProjectSwitchV2283();
  });
}

