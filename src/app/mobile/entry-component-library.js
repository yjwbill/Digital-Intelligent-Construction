/* =========================
   数智施工移动端 - 工作台
========================= */
const mobileWorkbenchMessages=[
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
  },
  {
    tag:"安全纳管",
    title:"安全纳管状态更新提醒",
    content:"上海示范线工程15标安全纳管信息已更新，请及时查看项目详情",
    time:"2025-4-10 23:04:23"
  }
];

function renderMobileAppIcon(name){
  return `
    <div class="mobile-app-item">
      <div class="mobile-app-placeholder" aria-hidden="true"></div>
      <div class="mobile-app-name">${name}</div>
    </div>
  `;
}

function renderMobileNotice(item,index){
  return `
    <article class="mobile-notice-item ${index>1?"with-divider":""}">
      <div class="mobile-notice-title-row">
        <span class="mobile-notice-tag">${item.tag}</span>
        <strong>${item.title}</strong>
        <span class="mobile-unread">未读</span>
      </div>
      <div class="mobile-notice-content">${item.content}</div>
      <time>${item.time}</time>
    </article>
  `;
}

function renderMobileWorkbench(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  const appNames=["花名册","考勤流水","视频监控","花名册","考勤流水","花名册","考勤流水","视频监控","花名册","考勤流水"];
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
          <div class="mobile-app-grid">${appNames.map(renderMobileAppIcon).join("")}</div>
          <div class="mobile-carousel"><i></i><i></i></div>
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
          <div class="mobile-pill-tabs">
            <button class="active">消息通知（2）</button>
            <button>通知公告（1）</button>
            <button>预警通知（1）</button>
          </div>
          <div class="mobile-notice-list">
            ${mobileWorkbenchMessages.map(renderMobileNotice).join("")}
          </div>
        </section>
      </main>

      <nav class="mobile-tabbar" aria-label="底部导航">
        <button class="active"><span class="tab-icon workbench"></span><strong>工作台</strong></button>
        <button><span class="tab-icon overview"></span><strong>总览</strong></button>
        <button class="tab-create" onclick="toggleMobileQuickActionOverlayV2287(event)" aria-label="快捷操作"><span>+</span></button>
        <button><span class="tab-icon warning"></span><strong>预警</strong></button>
        <button><span class="tab-icon mine"></span><strong>我的</strong></button>
      </nav>
    </div>
  `;
}

let digitalConstructionPcShell="";

function renderDigitalConstructionEntry(){
  const app=document.querySelector(".app");
  if(!app)return;
  if(!digitalConstructionPcShell)digitalConstructionPcShell=app.innerHTML;
  window.__digitalConstructionMode="entry";
  removeBottomFixedMenu();
  document.body.classList.remove("mobile-mode","component-library-mode");
  document.body.classList.add("entry-mode");
  app.innerHTML=`
    <main class="digital-entry">
      <div class="digital-entry-brand">
        <span class="digital-entry-logo"></span>
        <strong>数智施工</strong>
      </div>
      <div class="digital-entry-safe"><span></span>演示环境 · 安全隔离</div>
      <section class="digital-entry-hero">
        <h1>数智施工 · 智建未来</h1>
        <p class="digital-entry-subtitle">选择产品与终端，进入演示环境体验完整功能</p>
        <div class="digital-entry-divider"><i></i><b></b><i></i></div>
        <div class="entry-platform-grid">
          <section class="entry-product-card construction">
            <header class="entry-product-header"><span class="entry-product-logo building" aria-hidden="true"></span><div><h2>数智施工</h2><p>一体化数字建造解决方案，赋能工程项目高效协同与智慧管理</p></div></header>
            <div class="entry-terminal-grid">
              <button class="entry-terminal-card" onclick="enterDigitalConstructionPc()"><span class="entry-terminal-icon terminal-image pc" aria-hidden="true"></span><strong>PC端</strong><em>项目管理与数据运营</em><b>立即体验　→</b></button>
              <button class="entry-terminal-card" onclick="enterDigitalConstructionMobile()"><span class="entry-terminal-icon terminal-image mobile" aria-hidden="true"></span><strong>移动端</strong><em>现场作业与移动协同</em><b>立即体验　→</b></button>
              <button class="entry-terminal-card" onclick="enterDigitalConstructionComponentLibrary()"><span class="entry-terminal-icon library" aria-hidden="true"></span><strong>组件库</strong><em>灵活组件与复用沉淀</em><b>立即体验　→</b></button>
            </div>
          </section>
          <section class="entry-product-card housing">
            <header class="entry-product-header"><span class="entry-product-logo government" aria-hidden="true"><img src="src/assets/zjw-logo.png" alt="住建委"></span><div><h2>住建委</h2><p>监管服务一体化，赋能城市治理</p></div></header>
            <div class="entry-terminal-grid">
              <button class="entry-terminal-card" onclick="openDigitalConstructionExternalEntry('住建委PC端')"><span class="entry-terminal-icon terminal-image pc" aria-hidden="true"></span><span class="entry-terminal-copy"><strong>PC端</strong><em>监管协同与业务办理</em></span><b>立即体验　→</b></button>
              <button class="entry-terminal-card" onclick="enterZjwMobileDemo()"><span class="entry-terminal-icon terminal-image mobile" aria-hidden="true"></span><span class="entry-terminal-copy"><strong>移动端</strong><em>移动审批与进度管理</em></span><b>立即体验　→</b></button>
              <button class="entry-terminal-card" onclick="openDigitalConstructionExternalEntry('住建委大屏端')"><span class="entry-terminal-icon terminal-image screen" aria-hidden="true"></span><span class="entry-terminal-copy"><strong>大屏端</strong><em>可视化综合分析展示</em></span><b>立即体验　→</b></button>
            </div>
          </section>
          <div class="entry-side-products">
            <section class="entry-compact-product tunnel"><header><span class="entry-product-logo tunnel" aria-hidden="true"><img src="src/assets/shareholder-dashboard/tunnel-shareholder-logo.png" alt="隧道股份 上海城建"></span><div><h2>股份大屏</h2><p>工程管理驾驶舱，助力智慧决策</p></div></header><button onclick="openDigitalConstructionExternalEntry('股份看板')"><span class="entry-terminal-icon terminal-image screen" aria-hidden="true"></span><span><strong>大屏端</strong><em>工程态势与实时监控</em></span><b>立即体验　→</b></button></section>
            <section class="entry-compact-product environment"><header><span class="entry-product-logo entry-emoji-product" aria-hidden="true">🌿</span><div><h2>环境集团</h2><p>环境治理智慧平台，助力绿色发展与运营管理</p></div></header><button onclick="openDigitalConstructionExternalEntry('环境集团PC端')"><span class="entry-terminal-icon terminal-image pc" aria-hidden="true"></span><span><strong>PC端</strong><em>运营管理与数据看板</em></span><b>立即体验　→</b></button></section>
          </div>
        </div>
        <div class="digital-entry-values">
          <div><span class="safe"></span><strong>安全合规</strong><em>企业级安全防护体系</em></div>
          <div><span class="data"></span><strong>数据驱动</strong><em>全要素数据贯通融合</em></div>
          <div><span class="team"></span><strong>高效协同</strong><em>多端协同提升效率</em></div>
          <div><span class="growth"></span><strong>持续创新</strong><em>技术引领智慧建造</em></div>
        </div>
        <footer class="digital-entry-footer">© 2026 数智施工演示环境 仅供产品演示使用</footer>
      </section>
    </main>
  `;
}

function openDigitalConstructionExternalEntry(name){
  if(name==="股份看板"){
    renderShareholderDashboardPage();
    return;
  }
  const entry=document.querySelector(".digital-entry");
  if(!entry)return;
  let notice=entry.querySelector(".digital-entry-notice");
  if(!notice){
    notice=document.createElement("div");
    notice.className="digital-entry-notice";
    entry.appendChild(notice);
  }
  notice.textContent=`${name}入口暂未配置`;
  notice.classList.add("show");
  clearTimeout(window.__digitalEntryNoticeTimer);
  window.__digitalEntryNoticeTimer=setTimeout(()=>notice.classList.remove("show"),1800);
}

function enterZjwMobileDemo(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="zjw-mobile";
  removeBottomFixedMenu();
  document.body.classList.remove("mobile-mode","entry-mode","component-library-mode");
  document.body.classList.add("zjw-demo-mode");
  app.innerHTML=`
    <main class="zjw-demo-host">
      <header class="zjw-demo-toolbar">
        <div><strong>住建委移动端</strong><span>独立产品 · ZJW V2.10.0</span></div>
        <button type="button" onclick="exitZjwMobileDemo()">返回 Demo 入口</button>
      </header>
      <iframe class="zjw-demo-frame" src="./src/products/zjw-mobile/index.html" title="住建委移动端" loading="eager"></iframe>
    </main>
  `;
}

function exitZjwMobileDemo(){
  document.body.classList.remove("zjw-demo-mode");
  renderDigitalConstructionEntry();
}

function enterDigitalConstructionPc(options={}){
  const app=document.querySelector(".app");
  if(!app)return;
  const skipDefaultRender=!!options.skipDefaultRender;
  window.__digitalConstructionMode="pc";
  document.body.classList.remove("mobile-mode","entry-mode","component-library-mode");
  app.innerHTML=digitalConstructionPcShell;
  try{
    if(!skipDefaultRender){
      pcPortalState.mode="enterprise";
      currentBusinessLine="production";
      activateProductionDashboardMenu();
      renderPcTopNavigation();
      renderSideMenu("production");
      renderProductionOverviewDashboardPage();
    }
    ensureBottomFixedMenu();
  }catch(e){
    console.warn("restore pc failed",e);
  }
}

function enterDigitalConstructionMobile(){
  renderMobileWorkbench();
}

const componentLibraryStateV2288={
  platform:"pc",
  active:"button"
};
const componentDashboardOrgStateV2276={company:"",branch:""};
const componentStatisticsFilterState={activeKey:"registeredDone"};

const componentLibraryDatePickerStateV2297={
  size:"default",
  value1:"",
  value2:"",
  open:"default",
  viewYear:2026,
  viewMonth:6
};

const componentLibraryMonthPickerState={
  normal:"2026-06",
  screen:"2025-03"
};

const componentMobilePickerStateV2298={
  orgSingle:{company:"",branches:[]},
  orgMultiple:{company:"",branches:[]},
  areaSingle:{province:"福建",city:"福州市",districts:["鼓楼区"],provinces:[],cities:[]},
  areaMultiple:{
    province:"福建",
    city:"福州市",
    districts:["鼓楼区","台江区","仓山区","马尾区","晋安区","长乐区","闽侯县","连江县","罗源县","闽清县"],
    provinces:["安徽","北京","重庆","福建"],
    cities:["福州市"]
  }
};

const componentChinaAreaDataV2298={
  安徽:{
    合肥市:["瑶海区","庐阳区","蜀山区","包河区","长丰县","肥东县","肥西县"],
    芜湖市:["镜湖区","弋江区","鸠江区","湾沚区","繁昌区"],
    蚌埠市:["龙子湖区","蚌山区","禹会区","淮上区","怀远县"]
  },
  北京:{
    北京市:["东城区","西城区","朝阳区","丰台区","石景山区","海淀区","通州区","顺义区"]
  },
  重庆:{
    重庆市:["万州区","涪陵区","渝中区","大渡口区","江北区","沙坪坝区","九龙坡区","南岸区"]
  },
  福建:{
    福州市:["鼓楼区","台江区","仓山区","马尾区","晋安区","长乐区","闽侯县","连江县","罗源县","闽清县"],
    厦门市:["思明区","海沧区","湖里区","集美区","同安区","翔安区"],
    莆田市:["城厢区","涵江区","荔城区","秀屿区","仙游县"],
    三明市:["三元区","沙县区","明溪县","清流县","宁化县"],
    泉州市:["鲤城区","丰泽区","洛江区","泉港区","惠安县"],
    漳州市:["芗城区","龙文区","龙海区","长泰区","云霄县"],
    南平市:["延平区","建阳区","顺昌县","浦城县","光泽县"],
    龙岩市:["新罗区","永定区","长汀县","上杭县","武平县"],
    宁德市:["蕉城区","霞浦县","古田县","屏南县","寿宁县"]
  },
  广东:{
    广州市:["越秀区","海珠区","荔湾区","天河区","白云区","黄埔区"],
    深圳市:["福田区","罗湖区","南山区","宝安区","龙岗区","龙华区"],
    佛山市:["禅城区","南海区","顺德区","三水区","高明区"]
  },
  广西壮族自治区:{
    南宁市:["兴宁区","青秀区","江南区","西乡塘区","良庆区"],
    柳州市:["城中区","鱼峰区","柳南区","柳北区","柳江区"]
  },
  甘肃:{
    兰州市:["城关区","七里河区","西固区","安宁区","红古区"],
    天水市:["秦州区","麦积区","清水县","秦安县","甘谷县"]
  },
  贵州:{
    贵阳市:["南明区","云岩区","花溪区","乌当区","白云区","观山湖区"],
    遵义市:["红花岗区","汇川区","播州区","桐梓县","绥阳县"]
  },
  海南:{
    海口市:["秀英区","龙华区","琼山区","美兰区"],
    三亚市:["海棠区","吉阳区","天涯区","崖州区"]
  },
  河北:{
    石家庄市:["长安区","桥西区","新华区","裕华区","藁城区"],
    唐山市:["路南区","路北区","古冶区","开平区","丰南区"]
  }
};

const componentLibraryMenusV2288={
  pc:[
    {group:"设计规范",items:[["design-token","设计变量 Design Token"]]},
    {group:"基础组件",items:[["button","按钮 Button"],["radio","单选框 Radio"],["date","日期选择器 DatePicker"],["month","年月选择器 MonthPicker"]]},
    {group:"表单组件",items:[["input","输入框 Input"],["select","选择器 Select"]]},
    {group:"数据展示",items:[["tag","标签 Tag"],["table","表格 Table"],["row-span-table","纵跨行组件 RowSpanTable"]]},
    {group:"弹层组件",items:[["modal-standard","基础标准弹框 Modal"],["modal-fullscreen","全屏弹框 FullscreenModal"],["modal-nested","嵌套弹框 NestedModal"],["modal-business","业务定制弹框 BusinessModal"],["modal-immersive","沉浸式预览弹框 ImmersiveModal"],["modal-mobile","移动端弹层 MobileOverlay"],["modal-lightweight","轻量浮层 Popover"]]},
    {group:"业务组件",items:[["statistics-filter","统计筛选 StatisticsFilter"],["dashboard-org-switch","看板组织切换 DashboardOrgSwitch"],["project-selector","项目选择器 ProjectSelector"]]}
  ],
  mobile:[
    {group:"基础组件",items:[["button","按钮 Button"],["radio","单选框 Radio"],["date","日期选择器 DatePicker"]]},
    {group:"组织选择器 OrganizationPicker",items:[["org-single-picker","组织选择器-单选 OrgSinglePicker"],["org-multiple-picker","组织选择器-多选 OrgMultiplePicker"]]},
    {group:"省市区选择器 AreaPicker",items:[["area-single-picker","省市区选择器-单选 AreaSinglePicker"],["area-multiple-picker","省市区选择器-多选 AreaMultiplePicker"]]},
    {group:"反馈组件",items:[["toast","轻提示 Toast"],["sheet","底部面板 ActionSheet"]]},
    {group:"导航组件",items:[["tabbar","底部导航 Tabbar"],["card","信息卡片 Card"]]}
  ]
};

function getComponentLibraryItemPartsV2300(item){
  const label=item[1] || "";
  if(item[2])return {name:label,en:item[2]};
  const match=label.match(/^(.+?)\s+([A-Za-z][A-Za-z0-9]*)$/);
  if(match)return {name:match[1],en:match[2]};
  return {name:label,en:""};
}

function renderComponentLibraryMenuLabelV2300(item){
  const parts=getComponentLibraryItemPartsV2300(item);
  return `<span>${parts.name}</span>${parts.en?`<em>${parts.en}</em>`:""}`;
}

function getComponentLibraryTitleV2288(){
  const menus=componentLibraryMenusV2288[componentLibraryStateV2288.platform] || componentLibraryMenusV2288.pc;
  for(const group of menus){
    const found=group.items.find(item=>item[0]===componentLibraryStateV2288.active);
    if(found)return found[1];
  }
  return "按钮 Button";
}

function renderComponentLibrarySidebarV2288(){
  const menus=componentLibraryMenusV2288[componentLibraryStateV2288.platform] || componentLibraryMenusV2288.pc;
  return menus.map(group=>`
    <section>
      <h4>${group.group}</h4>
      ${group.items.map(item=>`
        <button class="${componentLibraryStateV2288.active===item[0]?"active":""}" onclick="selectComponentLibraryItemV2288('${item[0]}')">${renderComponentLibraryMenuLabelV2300(item)}</button>
      `).join("")}
    </section>
  `).join("");
}

function renderComponentDemoCardV2300(){
  return `
    <div class="component-demo-card" id="componentDemoCardV2300">
      <h3>基础用法</h3>
      <div class="component-demo-preview" id="componentDemoPreviewV2300">
        ${renderComponentLibraryPreviewV2288()}
      </div>
    </div>
  `;
}

function refreshComponentLibraryPreviewV2300(){
  const preview=document.getElementById("componentDemoPreviewV2300");
  if(!preview){
    renderComponentLibraryPageV2288();
    return;
  }
  const content=document.querySelector(".component-library-content");
  const contentScroll=content?.scrollTop || 0;
  const columnScrolls=Array.from(document.querySelectorAll(".mobile-picker-column")).map(col=>col.scrollTop);
  const bodyScroll=document.querySelector(".component-phone-body")?.scrollTop || 0;
  preview.innerHTML=renderComponentLibraryPreviewV2288();
  const newColumns=Array.from(document.querySelectorAll(".mobile-picker-column"));
  newColumns.forEach((col,index)=>{
    col.scrollTop=columnScrolls[index] || 0;
  });
  const newPhoneBody=document.querySelector(".component-phone-body");
  if(newPhoneBody)newPhoneBody.scrollTop=bodyScroll;
  if(content)content.scrollTop=contentScroll;
}

function renderComponentLibraryPreviewV2288(){
  const isMobile=componentLibraryStateV2288.platform==="mobile";
  const type=componentLibraryStateV2288.active;
  if(isMobile)return renderMobileComponentPreviewV2288(type);
  return renderPcComponentPreviewV2288(type);
}

function padComponentDateV2297(value){
  return String(value).padStart(2,"0");
}

function formatComponentDateV2297(date){
  return `${date.getFullYear()}-${padComponentDateV2297(date.getMonth()+1)}-${padComponentDateV2297(date.getDate())}`;
}

function parseComponentDateV2297(value){
  if(!value)return null;
  const parts=value.split("-").map(Number);
  if(parts.length!==3 || parts.some(Number.isNaN))return null;
  return new Date(parts[0],parts[1]-1,parts[2]);
}

function componentDateTodayV2297(){
  return new Date(2026,6,9);
}

function componentDateIsFutureV2297(date){
  const today=componentDateTodayV2297();
  return date.getTime()>new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
}

function setComponentDatePickerSizeV2297(size){
  componentLibraryDatePickerStateV2297.size=size;
  renderComponentLibraryPageV2288();
}

function openComponentDatePickerV2297(which){
  const state=componentLibraryDatePickerStateV2297;
  const value=parseComponentDateV2297(state[which==="quick"?"value2":"value1"]);
  state.open=which;
  if(value){
    state.viewYear=value.getFullYear();
    state.viewMonth=value.getMonth();
  }
  renderComponentLibraryPageV2288();
}

function shiftComponentDatePickerMonthV2297(delta){
  const state=componentLibraryDatePickerStateV2297;
  const date=new Date(state.viewYear,state.viewMonth+delta,1);
  state.viewYear=date.getFullYear();
  state.viewMonth=date.getMonth();
  renderComponentLibraryPageV2288();
}

function shiftComponentDatePickerYearV2297(delta){
  componentLibraryDatePickerStateV2297.viewYear+=delta;
  renderComponentLibraryPageV2288();
}

function selectComponentDateV2297(dateValue){
  const state=componentLibraryDatePickerStateV2297;
  const date=parseComponentDateV2297(dateValue);
  if(!date || componentDateIsFutureV2297(date))return;
  if(state.open==="quick")state.value2=dateValue;
  else state.value1=dateValue;
  state.viewYear=date.getFullYear();
  state.viewMonth=date.getMonth();
  renderComponentLibraryPageV2288();
}

function applyComponentDateShortcutV2297(type){
  const today=componentDateTodayV2297();
  const date=new Date(today);
  if(type==="yesterday")date.setDate(date.getDate()-1);
  if(type==="week")date.setDate(date.getDate()-7);
  const value=formatComponentDateV2297(date);
  componentLibraryDatePickerStateV2297.value2=value;
  componentLibraryDatePickerStateV2297.open="quick";
  componentLibraryDatePickerStateV2297.viewYear=date.getFullYear();
  componentLibraryDatePickerStateV2297.viewMonth=date.getMonth();
  renderComponentLibraryPageV2288();
}

function clearComponentDatePickerV2297(which){
  componentLibraryDatePickerStateV2297[which==="quick"?"value2":"value1"]="";
  renderComponentLibraryPageV2288();
}

function renderComponentDateInputV2297(which,label,placeholder){
  const state=componentLibraryDatePickerStateV2297;
  const key=which==="quick"?"value2":"value1";
  const value=state[key];
  return `
    <div class="component-date-block">
      <span class="component-date-demonstration">${label}</span>
      <button class="component-date-input ${state.size} ${state.open===which?"active":""}" type="button" onclick="openComponentDatePickerV2297('${which}')">
        <i aria-hidden="true"></i>
        <strong>${value || "请选择日期"}</strong>
        ${value?`<em onclick="event.stopPropagation();clearComponentDatePickerV2297('${which}')">×</em>`:`<b></b>`}
      </button>
    </div>
  `;
}

function renderComponentDatePickerPanelV2297(){
  const state=componentLibraryDatePickerStateV2297;
  const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekNames=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const firstDay=new Date(state.viewYear,state.viewMonth,1);
  const start=new Date(state.viewYear,state.viewMonth,1-firstDay.getDay());
  const selected=state.open==="quick"?state.value2:state.value1;
  const cells=Array.from({length:42},(_,index)=>{
    const date=new Date(start);
    date.setDate(start.getDate()+index);
    const value=formatComponentDateV2297(date);
    const muted=date.getMonth()!==state.viewMonth;
    const disabled=componentDateIsFutureV2297(date);
    const isSelected=value===selected;
    const isToday=value===formatComponentDateV2297(componentDateTodayV2297());
    return `
      <button type="button" class="${muted?"muted":""} ${disabled?"disabled":""} ${isSelected?"selected":""} ${isToday?"today":""}" ${disabled?"disabled":""} onclick="selectComponentDateV2297('${value}')">
        ${date.getDate()}
      </button>
    `;
  }).join("");
  const shortcuts=state.open==="quick"?`
    <aside class="component-date-shortcuts">
      <button onclick="applyComponentDateShortcutV2297('today')">Today</button>
      <button onclick="applyComponentDateShortcutV2297('yesterday')">Yesterday</button>
      <button onclick="applyComponentDateShortcutV2297('week')">A week ago</button>
    </aside>
  `:"";
  return `
    <div class="component-date-picker-pop ${state.open==="quick"?"with-shortcuts":""}">
      ${shortcuts}
      <section class="component-date-calendar">
        <header>
          <button onclick="shiftComponentDatePickerYearV2297(-1)" aria-label="上一年">«</button>
          <button onclick="shiftComponentDatePickerMonthV2297(-1)" aria-label="上一月">‹</button>
          <strong>${state.viewYear}<span>${monthNames[state.viewMonth]}</span></strong>
          <button onclick="shiftComponentDatePickerMonthV2297(1)" aria-label="下一月">›</button>
          <button onclick="shiftComponentDatePickerYearV2297(1)" aria-label="下一年">»</button>
        </header>
        <div class="component-date-week">${weekNames.map(day=>`<span>${day}</span>`).join("")}</div>
        <div class="component-date-days">${cells}</div>
        <footer><button onclick="renderComponentLibraryPageV2288()">OK</button></footer>
      </section>
    </div>
  `;
}

function renderPcDatePickerPreviewV2297(){
  const state=componentLibraryDatePickerStateV2297;
  return `
    <div class="component-date-size-control" aria-label="size control">
      ${["large","default","small"].map(size=>`<button class="${state.size===size?"active":""}" onclick="setComponentDatePickerSizeV2297('${size}')">${size}</button>`).join("")}
    </div>
    <div class="component-date-demo">
      ${renderComponentDateInputV2297("default","Default","请选择日期")}
      ${renderComponentDateInputV2297("quick","Picker with quick options","请选择日期")}
    </div>
    <div class="component-date-pop-wrap">${renderComponentDatePickerPanelV2297()}</div>
    <p>参考 Element Plus DatePicker：支持 large / default / small 尺寸切换、日期面板、快捷选项以及未来日期禁用。当前组件仍处于组件库沉淀阶段，暂不替换业务页面。</p>
  `;
}

function renderPcMonthPickerPreview(){
  return `
    <div class="component-month-picker-demo">
      <section>
        <span class="component-date-demonstration">通用样式</span>
        <div class="component-month-picker-stage normal">
          ${MonthPicker.render({
            id:"componentMonthPickerNormal",
            value:componentLibraryMonthPickerState.normal,
            max:"2026-08",
            onChange:value=>{componentLibraryMonthPickerState.normal=value;}
          })}
        </div>
        <p>用于标准列表、查询条件和普通表单，采用通用浅色表单规范。</p>
      </section>
      <section>
        <span class="component-date-demonstration">大屏深色样式</span>
        <div class="component-month-picker-stage screen">
          ${MonthPicker.render({
            id:"componentMonthPickerScreen",
            value:componentLibraryMonthPickerState.screen,
            max:"2026-08",
            theme:"screen",
            onChange:value=>{componentLibraryMonthPickerState.screen=value;}
          })}
        </div>
        <p>用于蓝黑大屏和全屏投屏场景，交互逻辑与通用样式完全一致。</p>
      </section>
    </div>
    <p>基础能力统一包含年份切换、月份选择、选中回显、未来月份禁用和点击外部关闭；业务页面只需传入当前值、最大可选月份、主题及变更回调。</p>
  `;
}

function renderPcRowSpanTablePreviewV2609(){
  const data=[
    {orderNo:"DD20260018",orderName:"上海轨道交通23号线项目",company:"上海隧道",detailNo:"MX-01",detailName:"土建工程",amount:"12,800.00",status:"已拆分"},
    {orderNo:"DD20260018",orderName:"上海轨道交通23号线项目",company:"上海隧道",detailNo:"MX-02",detailName:"机电安装",amount:"3,600.00",status:"已拆分"},
    {orderNo:"DD20260018",orderName:"上海轨道交通23号线项目",company:"上海隧道",detailNo:"MX-03",detailName:"装饰装修",amount:"2,400.00",status:"已拆分"},
    {orderNo:"DD20260031",orderName:"长三角示范区线工程",company:"市政集团",detailNo:"MX-04",detailName:"主体施工",amount:"9,680.00",status:"已拆分"},
    {orderNo:"DD20260031",orderName:"长三角示范区线工程",company:"市政集团",detailNo:"MX-05",detailName:"附属工程",amount:"1,920.00",status:"已拆分"}
  ];
  const columns=[
    {key:"orderNo",title:"订单项目编号",width:130,align:"center",rowSpan:"orderNo"},
    {key:"orderName",title:"订单项目名称",width:220,rowSpan:"orderNo"},
    {key:"company",title:"子公司",width:110,align:"center",rowSpan:"orderNo"},
    {key:"detailNo",title:"明细编号",width:100,align:"center"},
    {key:"detailName",title:"明细名称",width:150},
    {key:"amount",title:"明细金额（万元）",width:140,align:"right"},
    {key:"status",title:"状态",width:100,align:"center",render:row=>tag(row.status,"blue")}
  ];
  return `${RowSpanTable.render({data,columns})}<p>用于“一个主对象拆分为多条明细”的场景。配置列的 <code>rowSpan</code> 分组键后，连续相同分组的公共字段自动纵向合并；明细字段仍逐行独立展示。表头固定 44px、数据行固定 40px，完整复用标准 Table 视觉规范。</p>`;
}

function renderPcComponentPreviewV2288(type){
  const dashboardOrgDemoRecords=getOrganizationCompanies().slice(0,3).flatMap(company=>getOrganizationBranches(company).slice(0,3).map((branch,index)=>({company,branch,project:`示例项目${index+1}`})));
  const demos={
    "design-token":renderDesignTokenPreviewV01(),
    button:`
      <div class="component-demo-row">
        <button class="btn primary">主要按钮</button><button class="btn">默认按钮</button><button class="btn danger">危险按钮</button><button class="btn" disabled>禁用按钮</button>
      </div>
      <p>用于页面主操作、次操作和危险操作。PC 端按钮高度建议 32px，列表工具栏按钮保持紧凑。</p>
    `,
    radio:`
      <div class="component-demo-row" role="radiogroup" aria-label="接入方式">
        <label class="component-radio"><input type="radio" name="component-radio-basic" value="manual" checked> 手动</label>
        <label class="component-radio"><input type="radio" name="component-radio-basic" value="integrated"> 集成</label>
        <label class="component-radio disabled"><input type="radio" name="component-radio-basic" value="disabled" disabled> 禁用</label>
      </div>
      <p>用于少量互斥选项，标题和值需清晰对齐，业务枚举优先读取数据字典。</p>
    `,
    date:renderPcDatePickerPreviewV2297(),
    month:renderPcMonthPickerPreview(),
    input:`
      <div class="component-demo-row"><input class="input component-input-demo" placeholder="请输入项目名称" value="上海示范区线工程"></div>
      <p>输入框用于模糊搜索和表单录入，搜索场景建议失焦或回车后触发查询。</p>
    `,
    select:`
      <div class="component-demo-row"><select class="select component-input-demo"><option>全部</option><option>已启用</option><option>已停用</option></select></div>
      <p>选择器用于枚举筛选，选项来源优先使用数据字典或组织树等基础数据。</p>
    `,
    tag:`
      <div class="component-demo-row">${tag("Primary","primary")}${tag("Success","success")}${tag("Info","info")}${tag("Warning","warning")}${tag("Danger","danger")}</div>
      <p>参考 Element Plus Tag 基础用法，提供 Primary、Success、Info、Warning、Danger 五种语义浅色标签；业务状态应按语义映射，避免同一状态使用不同颜色。</p>
    `,
    table:`
      <div class="component-table-demo-group">
        <section>
          <h4><span>单行表头</span><em>44px</em></h4>
          <div class="component-mini-table"><table><thead><tr><th>序号</th><th>组件名称</th><th>状态</th></tr></thead><tbody><tr><td>1</td><td>按钮 Button</td><td>${tag("已启用","green")}</td></tr><tr><td>2</td><td>日期选择器</td><td>${tag("设计中","blue")}</td></tr></tbody></table></div>
        </section>
        <section>
          <h4><span>双行/多行表头</span><em>每层 40px</em></h4>
          <div class="component-mini-table component-multiline-table"><table class="table-multiline-header"><thead><tr><th rowspan="2">序号</th><th rowspan="2">项目名称</th><th colspan="3">本月完成情况</th><th rowspan="2">状态</th></tr><tr><th>计划值</th><th>实际值</th><th>完成率</th></tr></thead><tbody><tr><td>1</td><td>机场联络线工程</td><td>1,200</td><td>1,080</td><td>90.00%</td><td>${tag("正常","green")}</td></tr><tr><td>2</td><td>轨道交通示范项目</td><td>860</td><td>720</td><td>83.72%</td><td>${tag("关注","orange")}</td></tr></tbody></table></div>
        </section>
      </div>
      <p>标准 Table 提供单行和多行两种表头模式。单行表头固定 44px；使用 <code>table-multiline-header</code> 标识双行或多级表头，每层固定 40px，并通过 rowspan / colspan 表达分组关系。所有数据行统一 40px，支持列设置、分页、导出和固定表头。</p>
    `,
    "row-span-table":renderPcRowSpanTablePreviewV2609(),
    "modal-standard":ModalGallery.renderPreview("standard"),
    "modal-fullscreen":ModalGallery.renderPreview("fullscreen"),
    "modal-nested":ModalGallery.renderPreview("nested"),
    "modal-business":ModalGallery.renderPreview("business"),
    "modal-immersive":ModalGallery.renderPreview("immersive"),
    "modal-mobile":ModalGallery.renderPreview("mobile"),
    "modal-lightweight":ModalGallery.renderPreview("lightweight"),
    "statistics-filter":`
      <div class="component-statistics-filter-demo">${StatisticsFilter.render({
        id:"component-library-statistics-filter",
        activeKey:componentStatisticsFilterState.activeKey,
        groups:[
          {label:"项目总数",items:[{key:"total",label:"项目总数",value:128}]},
          {label:"登记情况",items:[{key:"registeredRate",label:"登记完成率",value:"86%",metric:true},{key:"registeredDone",label:"已登记",value:110},{key:"registeredTodo",label:"未登记",value:18}]},
          {label:"项目状态",items:[{key:"active",label:"在建",value:76},{key:"finished",label:"完工",value:32},{key:"stopped",label:"停工",value:20}]}
        ],
        onChange:key=>{componentStatisticsFilterState.activeKey=componentStatisticsFilterState.activeKey===key?"":key;refreshComponentLibraryPreviewV2300();}
      })}</div>
      <p>列表页统计筛选的标准业务组件。页面只配置分组、统计项、只读指标和筛选回调；布局、选中态、键盘操作及横向适配由组件统一控制。</p>
    `,
    "dashboard-org-switch":`
      <div class="component-dashboard-org-demo">${DashboardOrgSwitch.render({id:"component-dashboard-org-switch",records:dashboardOrgDemoRecords,state:componentDashboardOrgStateV2276,onChange:selection=>{Object.assign(componentDashboardOrgStateV2276,selection);refreshComponentLibraryPreviewV2300();}})}</div>
      <p>根据项目所属组织反推可选子公司和分公司，并通过组织管理主数据校验父子关系。选择子公司后自动展开第二行分公司选项。</p>
    `,
    "project-selector":ProjectSelector.renderLibraryPreview()
  };
  return demos[type] || demos.button;
}

function renderDesignTokenPreviewV01(){
  const colorGroups=[
    ["语义颜色",[["主色","--dsc-color-primary","#165DFF"],["页面背景","--dsc-color-bg-page","#F5F7FA"],["容器背景","--dsc-color-bg-container","#FFFFFF"],["主文字","--dsc-color-text-primary","#1D2129"],["次文字","--dsc-color-text-secondary","#4E5969"],["边框","--dsc-color-border","#E5E6EB"],["成功","--dsc-color-success","#00B42A"],["警告","--dsc-color-warning","#FF7D00"],["危险","--dsc-color-danger","#F53F3F"]]],
    ["经济预警",[["红色预警","--dsc-risk-economy-red","#FF0013"],["橙色预警","--dsc-risk-economy-orange","#FF9933"],["黄色预警","--dsc-risk-economy-yellow","#FFF44F"],["蓝色预警","--dsc-risk-economy-blue","#4596E2"]]]
  ];
  const questionGroups=[
    ["默认控件高度","36px / 40px；历史值 30px"],
    ["Card Padding","16px / 20px / 24px"],
    ["Modal 尺寸","固定 480/640/800/1120px 或 75vw × 75vh"],
    ["Chart 图例尺寸","图例标记待确认"]
  ];
  return `
    <div class="token-doc-intro"><strong>Design Token v0.1.0</strong><span>Draft · 已接入组件库，但暂不覆盖历史页面</span></div>
    ${colorGroups.map(([title,items])=>`<section class="token-doc-section"><h4>${title}</h4><div class="token-color-grid">${items.map(([name,token,color])=>`<div><i style="background:var(${token})"></i><b>${name}<em>${color}</em></b><code>${token}</code></div>`).join("")}</div></section>`).join("")}
    <section class="token-doc-section"><h4>表格 Table</h4><div class="token-confirmed-grid">
      <article><span class="token-confirmed-table"><i style="height:44px">单行表头</i><i style="height:40px">多行表头</i></span><div><b>表头高度</b><strong>44px / 40px</strong><code>--dsc-table-header-height</code></div></article>
      <article><span class="token-confirmed-row"><i>数据行</i></span><div><b>数据行高</b><strong>40px</strong><code>--dsc-table-row-height</code></div></article>
    </div><p>单行表头固定44px；双行或多级表头每层固定40px；所有数据行统一40px，不保留48px和52px。</p></section>
    <section class="token-doc-section"><h4>圆角与容器</h4><div class="token-confirmed-grid">
      <article><span class="token-confirmed-radius"><i>8</i><i>12</i></span><div><b>标准圆角</b><strong>8px / 12px</strong><code>--dsc-radius-md / --dsc-radius-lg</code></div></article>
    </div><p>普通Card及常规控件容器使用8px；强调容器和Modal使用12px。历史16px及以上归并为12px，10px和6px归并为8px。</p></section>
    <section class="token-doc-section"><h4>图表 Chart</h4><div class="token-confirmed-grid">
      <article><span class="token-confirmed-row"><i>1px</i></span><div><b>折线与辅助线</b><strong>1px</strong><code>--dsc-chart-line-width</code></div></article>
      <article><span class="token-confirmed-table"><i style="width:18px">18</i><i style="width:28px">28</i></span><div><b>柱状图柱宽</b><strong>18px / 28px</strong><code>--dsc-chart-bar-width-*</code></div></article>
    </div><p>数据折线、辅助线和平均线统一1px；坐标轴1px，网格线0.5px；紧凑型柱宽18px，标准型柱宽28px。</p></section>
    <section class="token-doc-section"><h4>标准字号</h4><div class="token-type-list">${[12,14,16,18,20,24,28,32].map(size=>`<span style="font-size:${size}px"><b>${size}px</b> 数智施工 Design Token</span>`).join("")}</div></section>
    <section class="token-doc-section"><h4>4px 间距栅格</h4><div class="token-space-list">${[4,8,12,16,20,24,28,32,40,48,64].map(size=>`<span><i style="width:${size}px"></i><b>${size}px</b></span>`).join("")}</div></section>
    <section class="token-doc-section token-question-section"><h4>❓ 待 UI 确认</h4><p>以下值目前存在歧义，已全部保留在 <code>--dsc-candidate-*</code> 命名空间；确认前不建议用于新业务。</p><div class="token-question-grid">${questionGroups.map(([name,value])=>`<div><b>❓ ${name}</b><span>${value}</span></div>`).join("")}</div></section>
    <p>完整变量与说明位于 <code>src/components/design-tokens/tokens.css</code> 和 <code>README.md</code>。业务状态色不得与通用反馈色混用。</p>
  `;
}

function encodeComponentPickerValueV2298(value){
  return encodeURIComponent(String(value || ""));
}

function decodeComponentPickerValueV2298(value){
  return decodeURIComponent(String(value || ""));
}

function getComponentOrgCompaniesV2298(){
  const companies=getOrganizationCompanies();
  return companies.length?companies:["上海隧道","市政集团","上海路桥","城建水务"];
}

function getComponentOrgBranchesV2298(company){
  const branches=getOrganizationBranchOptions(company);
  if(branches.length)return branches;
  return ["河南分公司","轨交分公司","市政分公司","基础设施分公司"];
}

function getComponentOrgPickerModeV2298(mode){
  if(mode)return mode;
  return componentLibraryStateV2288.active==="org-multiple-picker"?"multi":"single";
}

function getComponentAreaPickerModeV2298(mode){
  if(mode)return mode;
  return componentLibraryStateV2288.active==="area-multiple-picker"?"multi":"single";
}

function getComponentOrgPickerStateV2298(mode){
  return getComponentOrgPickerModeV2298(mode)==="multi"
    ?componentMobilePickerStateV2298.orgMultiple
    :componentMobilePickerStateV2298.orgSingle;
}

function getComponentAreaPickerStateV2298(mode){
  return getComponentAreaPickerModeV2298(mode)==="multi"
    ?componentMobilePickerStateV2298.areaMultiple
    :componentMobilePickerStateV2298.areaSingle;
}

function ensureComponentOrgPickerStateV2298(mode){
  const pickerMode=getComponentOrgPickerModeV2298(mode);
  const state=getComponentOrgPickerStateV2298(pickerMode);
  const companies=getComponentOrgCompaniesV2298();
  if(!state.company || !companies.includes(state.company))state.company=companies[0] || "";
  const branches=getComponentOrgBranchesV2298(state.company);
  state.branches=state.branches.filter(item=>branches.includes(item));
  if(pickerMode==="single" && state.branches.length!==1)state.branches=branches[0]?[branches[0]]:[];
}

function selectComponentOrgCompanyV2298(value){
  const pickerMode=getComponentOrgPickerModeV2298();
  const state=getComponentOrgPickerStateV2298(pickerMode);
  const company=decodeComponentPickerValueV2298(value);
  state.company=company;
  const branches=getComponentOrgBranchesV2298(company);
  if(pickerMode==="single")state.branches=branches[0]?[branches[0]]:[];
  else state.branches=state.branches.filter(item=>branches.includes(item));
  refreshComponentLibraryPreviewV2300();
}

function toggleComponentOrgBranchV2298(value){
  const pickerMode=getComponentOrgPickerModeV2298();
  const state=getComponentOrgPickerStateV2298(pickerMode);
  const branch=decodeComponentPickerValueV2298(value);
  if(pickerMode==="single"){
    state.branches=[branch];
  }else if(state.branches.includes(branch)){
    state.branches=state.branches.filter(item=>item!==branch);
  }else{
    state.branches=[...state.branches,branch];
  }
  refreshComponentLibraryPreviewV2300();
}

function resetComponentOrgPickerV2298(){
  const pickerMode=getComponentOrgPickerModeV2298();
  const state=getComponentOrgPickerStateV2298(pickerMode);
  const companies=getComponentOrgCompaniesV2298();
  state.company=companies[0] || "";
  const branches=getComponentOrgBranchesV2298(state.company);
  state.branches=pickerMode==="single" && branches[0]?[branches[0]]:[];
  refreshComponentLibraryPreviewV2300();
}

function getComponentAreaProvincesV2298(){
  return Object.keys(componentChinaAreaDataV2298);
}

function getComponentAreaCitiesV2298(province=getComponentAreaPickerStateV2298().province){
  return Object.keys(componentChinaAreaDataV2298[province] || {});
}

function getComponentAreaDistrictsV2298(province=getComponentAreaPickerStateV2298().province,city=getComponentAreaPickerStateV2298().city){
  return (componentChinaAreaDataV2298[province] && componentChinaAreaDataV2298[province][city]) || [];
}

function ensureComponentAreaPickerStateV2298(mode){
  const pickerMode=getComponentAreaPickerModeV2298(mode);
  const state=getComponentAreaPickerStateV2298(pickerMode);
  const provinces=getComponentAreaProvincesV2298();
  if(!state.province || !provinces.includes(state.province))state.province=provinces[0] || "";
  const cities=getComponentAreaCitiesV2298(state.province);
  if(!state.city || !cities.includes(state.city))state.city=cities[0] || "";
  const districts=getComponentAreaDistrictsV2298(state.province,state.city);
  state.districts=state.districts.filter(item=>districts.includes(item));
  if(pickerMode==="single" && state.districts.length!==1)state.districts=districts[0]?[districts[0]]:[];
}

function selectComponentAreaProvinceV2298(value){
  const pickerMode=getComponentAreaPickerModeV2298();
  const state=getComponentAreaPickerStateV2298(pickerMode);
  const province=decodeComponentPickerValueV2298(value);
  state.province=province;
  const cities=getComponentAreaCitiesV2298(province);
  state.city=cities[0] || "";
  const districts=getComponentAreaDistrictsV2298(province,state.city);
  if(pickerMode==="single"){
    state.districts=districts[0]?[districts[0]]:[];
  }else{
    if(state.provinces.includes(province))state.provinces=state.provinces.filter(item=>item!==province);
    else state.provinces=[...state.provinces,province];
    state.districts=state.districts.filter(item=>districts.includes(item));
  }
  refreshComponentLibraryPreviewV2300();
}

function selectComponentAreaCityV2298(value){
  const pickerMode=getComponentAreaPickerModeV2298();
  const state=getComponentAreaPickerStateV2298(pickerMode);
  const city=decodeComponentPickerValueV2298(value);
  state.city=city;
  const districts=getComponentAreaDistrictsV2298(state.province,city);
  if(pickerMode==="single"){
    state.districts=districts[0]?[districts[0]]:[];
  }else{
    if(state.cities.includes(city))state.cities=state.cities.filter(item=>item!==city);
    else state.cities=[...state.cities,city];
    state.districts=state.districts.filter(item=>districts.includes(item));
  }
  refreshComponentLibraryPreviewV2300();
}

function toggleComponentAreaDistrictV2298(value){
  const pickerMode=getComponentAreaPickerModeV2298();
  const state=getComponentAreaPickerStateV2298(pickerMode);
  const district=decodeComponentPickerValueV2298(value);
  if(pickerMode==="single"){
    state.districts=[district];
  }else if(state.districts.includes(district)){
    state.districts=state.districts.filter(item=>item!==district);
  }else{
    state.districts=[...state.districts,district];
  }
  refreshComponentLibraryPreviewV2300();
}

function resetComponentAreaPickerV2298(){
  const pickerMode=getComponentAreaPickerModeV2298();
  const state=getComponentAreaPickerStateV2298(pickerMode);
  state.province="福建";
  state.city="福州市";
  state.provinces=pickerMode==="multi"?["安徽","北京","重庆","福建"]:[];
  state.cities=pickerMode==="multi"?["福州市"]:[];
  state.districts=pickerMode==="multi"
    ?["鼓楼区","台江区","仓山区","马尾区","晋安区","长乐区","闽侯县","连江县","罗源县","闽清县"]
    :["鼓楼区"];
  ensureComponentAreaPickerStateV2298();
  refreshComponentLibraryPreviewV2300();
}

function confirmComponentPickerV2298(kind){
  if(kind==="org"){
    const state=getComponentOrgPickerStateV2298();
    showToast(`已选择：${state.company}${state.branches.length?" / "+state.branches.join("、"):""}`);
  }else{
    const state=getComponentAreaPickerStateV2298();
    showToast(`已选择：${state.province} / ${state.city}${state.districts.length?" / "+state.districts.join("、"):""}`);
  }
}

function renderComponentPickerCheckV2298(selected){
  return `<i class="mobile-picker-check ${selected?"checked":""}"></i>`;
}

function renderMobileOrgPickerPreviewV2298(mode,title){
  ensureComponentOrgPickerStateV2298(mode);
  const state=getComponentOrgPickerStateV2298(mode);
  const companies=getComponentOrgCompaniesV2298();
  const branches=getComponentOrgBranchesV2298(state.company);
  const selectedSummary=state.branches.length?state.branches.join("、"):"请选择分公司";
  return `
    <div class="mobile-picker-demo">
      <header class="mobile-picker-header"><strong>${title}</strong></header>
      <div class="mobile-picker-summary">
        <span>当前选择</span>
        <b>${state.company || "-"} / ${selectedSummary}</b>
      </div>
      <div class="mobile-picker-columns two">
        <section class="mobile-picker-column">
          ${companies.map(company=>`
            <button class="mobile-picker-row ${state.company===company?"active":""}" onclick="selectComponentOrgCompanyV2298('${encodeComponentPickerValueV2298(company)}')">
              <span>${company}</span>
            </button>
          `).join("")}
        </section>
        <section class="mobile-picker-column">
          ${branches.map(branch=>`
            <button class="mobile-picker-row ${state.branches.includes(branch)?"selected":""}" onclick="toggleComponentOrgBranchV2298('${encodeComponentPickerValueV2298(branch)}')">
              <span>${branch}</span>
              ${renderComponentPickerCheckV2298(state.branches.includes(branch))}
            </button>
          `).join("")}
        </section>
      </div>
      <footer class="mobile-picker-footer">
        <button onclick="resetComponentOrgPickerV2298()">重置</button>
        <button class="primary" onclick="confirmComponentPickerV2298('org')">确定</button>
      </footer>
    </div>
  `;
}

function renderMobileAreaPickerPreviewV2298(mode,title){
  ensureComponentAreaPickerStateV2298(mode);
  const state=getComponentAreaPickerStateV2298(mode);
  const provinces=getComponentAreaProvincesV2298();
  const cities=getComponentAreaCitiesV2298(state.province);
  const districts=getComponentAreaDistrictsV2298(state.province,state.city);
  return `
    <div class="mobile-picker-demo">
      <header class="mobile-picker-header"><strong>${title}</strong></header>
      <div class="mobile-picker-summary">
        <span>当前选择</span>
        <b>${state.province} / ${state.city} / ${state.districts.length?state.districts.join("、"):"请选择区县"}</b>
      </div>
      <div class="mobile-picker-columns three">
        <section class="mobile-picker-column">
          ${provinces.map(province=>`
            <button class="mobile-picker-row ${state.province===province?"active":""} ${state.provinces.includes(province)?"selected":""}" onclick="selectComponentAreaProvinceV2298('${encodeComponentPickerValueV2298(province)}')">
              <span>${province}</span>
              ${mode==="multi"?renderComponentPickerCheckV2298(state.provinces.includes(province)):""}
            </button>
          `).join("")}
        </section>
        <section class="mobile-picker-column">
          ${cities.map(city=>`
            <button class="mobile-picker-row ${state.city===city?"active":""} ${state.cities.includes(city)?"selected":""}" onclick="selectComponentAreaCityV2298('${encodeComponentPickerValueV2298(city)}')">
              <span>${city}</span>
              ${mode==="multi"?renderComponentPickerCheckV2298(state.cities.includes(city)):""}
            </button>
          `).join("")}
        </section>
        <section class="mobile-picker-column">
          ${districts.map(district=>`
            <button class="mobile-picker-row ${state.districts.includes(district)?"selected":""}" onclick="toggleComponentAreaDistrictV2298('${encodeComponentPickerValueV2298(district)}')">
              <span>${district}</span>
              ${renderComponentPickerCheckV2298(state.districts.includes(district))}
            </button>
          `).join("")}
        </section>
      </div>
      <footer class="mobile-picker-footer">
        <button onclick="resetComponentAreaPickerV2298()">重置</button>
        <button class="primary" onclick="confirmComponentPickerV2298('area')">确定</button>
      </footer>
    </div>
  `;
}

function renderMobileComponentPreviewV2288(type){
  const demos={
    button:`
      <button class="mobile-component-button primary">主要按钮</button>
      <button class="mobile-component-button">默认按钮</button>
      <button class="mobile-component-button danger">危险按钮</button>
    `,
    radio:`
      <div class="mobile-component-radio"><button class="active">手动</button><button>集成</button><button>全部</button></div>
    `,
    date:`
      <div class="mobile-component-picker"><span>评价月份</span><strong>2026年07月</strong><i></i></div>
      <div class="mobile-component-picker"><span>上报日期</span><strong>2026-07-09</strong><i></i></div>
    `,
    toast:`
      <div class="mobile-component-toast">操作成功</div>
      <div class="mobile-component-toast warning">请完善必填信息</div>
    `,
    sheet:`
      <div class="mobile-component-sheet"><b>请选择操作</b><button>隐患整改</button><button>意见反馈</button><button>险情速报</button></div>
    `,
    tabbar:`
      <div class="mobile-component-tabbar"><button class="active">工作台</button><button>总览</button><button>预警</button><button>我的</button></div>
    `,
    card:`
      <div class="mobile-component-card"><strong>上海示范区线工程</strong><span>项目状态：在建</span><em>今日待办 2 条，消息 4 条</em></div>
    `,
    "org-single-picker":renderMobileOrgPickerPreviewV2298("single","组织选择器-单选"),
    "org-multiple-picker":renderMobileOrgPickerPreviewV2298("multi","组织选择器-多选"),
    "area-single-picker":renderMobileAreaPickerPreviewV2298("single","省市区选择器-单选"),
    "area-multiple-picker":renderMobileAreaPickerPreviewV2298("multi","省市区选择器-多选")
  };
  const pickerTypes=["org-single-picker","org-multiple-picker","area-single-picker","area-multiple-picker"];
  return `
    <div class="component-phone-frame ${pickerTypes.includes(type)?"picker-phone":""}">
      <div class="component-phone-top"></div>
      <div class="component-phone-body">${demos[type] || demos.button}</div>
    </div>
    <p>移动端组件优先考虑触控面积、单手操作和轻量反馈，基础字号建议不低于 14px。</p>
  `;
}

function renderComponentLibraryPageV2288(){
  const app=document.querySelector(".app");
  if(!app)return;
  window.__digitalConstructionMode="component-library";
  removeBottomFixedMenu();
  document.body.classList.remove("mobile-mode","entry-mode");
  document.body.classList.add("component-library-mode");
  app.innerHTML=`
    <main class="component-library-page">
      <header class="component-library-header">
        <button class="component-library-brand" onclick="renderDigitalConstructionEntry()"><span></span><strong>数智施工组件库</strong></button>
        <nav>
          <button class="${componentLibraryStateV2288.platform==="pc"?"active":""}" onclick="switchComponentLibraryPlatformV2288('pc')">PC端</button>
          <button class="${componentLibraryStateV2288.platform==="mobile"?"active":""}" onclick="switchComponentLibraryPlatformV2288('mobile')">移动端</button>
        </nav>
        <button class="btn" onclick="renderDigitalConstructionEntry()">返回入口</button>
      </header>
      <div class="component-library-layout">
        <aside class="component-library-sidebar">${renderComponentLibrarySidebarV2288()}</aside>
        <section class="component-library-content">
          <div class="component-library-title">
            <span>${componentLibraryStateV2288.platform==="pc"?"PC端基础组件":"移动端基础组件"}</span>
            <h2>${getComponentLibraryTitleV2288()}</h2>
            <p>参考 Element Plus 文档式目录结构，先建立基础组件、表单组件、反馈组件和数据展示组件的沉淀入口。</p>
          </div>
          ${renderComponentDemoCardV2300()}
        </section>
      </div>
    </main>
  `;
}

function switchComponentLibraryPlatformV2288(platform){
  componentLibraryStateV2288.platform=platform;
  componentLibraryStateV2288.active="button";
  renderComponentLibraryPageV2288();
}

function selectComponentLibraryItemV2288(active){
  window.ModalGallery?.close?.();
  componentLibraryStateV2288.active=active;
  renderComponentLibraryPageV2288();
}

function enterDigitalConstructionComponentLibrary(){
  componentLibraryStateV2288.platform="pc";
  componentLibraryStateV2288.active="button";
  renderComponentLibraryPageV2288();
}

Object.assign(window,{
  renderDigitalConstructionEntry,
  enterDigitalConstructionPc,
  enterDigitalConstructionMobile,
  enterDigitalConstructionComponentLibrary,
  switchComponentLibraryPlatformV2288,
  selectComponentLibraryItemV2288
});

document.addEventListener("DOMContentLoaded",()=>{
  if(!window.__APP_INITIAL_ROUTE__)renderDigitalConstructionEntry();
});
