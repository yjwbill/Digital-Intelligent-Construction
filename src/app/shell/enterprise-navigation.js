document.addEventListener("click",event=>{
  if(!event.target.closest?.(".portal-switch")){
    document.querySelector(".portal-switch")?.classList.remove("open");
  }
});

document.addEventListener("change",event=>{
  const projectLogPageSize=event.target.closest?.("[data-project-log-page-size]");
  if(projectLogPageSize){
    projectLogState.pageSize=Number(projectLogPageSize.value)||50;
    projectLogState.page=1;
    renderProjectLogPage();
  }
});

function activateSafetyLaborRosterMenu(){
  clearBusinessMenuActive("safety");

  const m=businessMenus.safety.menus.find(x=>x.name==="实名制");

  if(m?.children){
    m.children.forEach(c=>c.active=c.name==="劳务工花名册");
    m.open=true;
  }

  collapseInactiveGroups("safety");
}

function activateSafetyDashboardMenu(){
  clearBusinessMenuActive("safety");
  const first=businessMenus.safety?.menus?.[0];
  if(first)first.active=true;
  collapseInactiveGroups("safety");
}

function activateProductionDashboardMenu(){
  clearBusinessMenuActive("production");
  const first=businessMenus.production?.menus?.[0];
  if(first)first.active=true;
  collapseInactiveGroups("production");
}

function activateEnterpriseHomeMenu(){
  clearBusinessMenuActive("home");
  const first=businessMenus.home?.menus?.[0];
  if(first)first.active=true;
  collapseInactiveGroups("home");
}

function activateBaseOrgMenu(){
  clearBusinessMenuActive("base");

  const m=businessMenus.base?.menus?.find(x=>x.name==="组织权限");

  if(m && m.children){
    m.children.forEach(c=>{
      c.active=c.name==="组织管理";
    });
    m.open=true;
  }

  collapseInactiveGroups("base");
}

function activateOperationProjectReportMenu(){
  clearBusinessMenuActive("operation");
  const group=businessMenus.operation?.menus?.[0];
  if(group?.children){
    group.open=true;
    group.children.forEach((child,index)=>child.active=index===0);
  }
  collapseInactiveGroups("operation");
}


function renderSideMenu(line){
  const side=document.getElementById("sideMenu");
  const config=businessMenus[line];

  if(!side||!config)return;

  side.innerHTML=`
    <div class="menu-title">${config.title}</div>
    ${config.menus.map((item,i)=>{
      if(item.children?.length){
        const isOpen=item.open||hasActiveChild(item);

        return `
          <div class="menu-group ${isOpen?"open":""}" data-group-index="${i}">
            <div class="menu-group-title" onclick="toggleSideGroup(${i})">
              <div class="menu-group-title-left">
                <span>${item.icon}</span>
                <span>${item.name}</span>
              </div>
              <span class="menu-group-arrow" aria-hidden="true"></span>
            </div>
            <div class="menu-children">
              ${item.children.map((c,j)=>`
                <div class="menu-child-item ${c.active?"active":""}" onclick="selectBusinessChildMenu('${line}',${i},${j},'${c.name}')">
                  ${c.name}
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }

      return `
        <div class="menu-item ${item.active?"active":""}" onclick="selectBusinessSingleMenu('${line}',${i},'${item.name}')">
          ${item.icon} ${item.name}
        </div>
      `;
    }).join("")}
  `;
}
function activateBaseOrgMenu(){
  clearBusinessMenuActive("base");

  const m=businessMenus.base?.menus?.find(x=>x.name==="组织权限");

  if(m && m.children){
    m.children.forEach(c=>{
      c.active=c.name==="组织管理";
    });
    m.open=true;
  }

  collapseInactiveGroups("base");
}

function toggleSideGroup(i){
  const g=document.querySelector(`.menu-group[data-group-index="${i}"]`);
  if(g)g.classList.toggle("open");

  const m=businessMenus[currentBusinessLine]?.menus?.[i];
  if(m)m.open=!m.open;
}

function switchBusinessLine(line){
  pcPortalState.mode="enterprise";
  currentBusinessLine=line;

  renderPcTopNavigation();

if(line==="home"){
  activateEnterpriseHomeMenu();
  renderSideMenu(line);
  renderBusinessModulePage(line,"项目相册");
  showToast("已切换到首页");
}else if(line==="safety"){
  activateSafetyDashboardMenu();
  renderSideMenu(line);
  renderSafetyOnlineDashboardPage();
  showToast("已切换到安全条线");
}else if(line==="production"){
  activateProductionDashboardMenu();
  renderSideMenu(line);
  renderProductionDashboardByKey("overview");
  showToast("已切换到生产条线");
}else if(line==="base"){
  activateBaseOrgMenu();
  renderSideMenu(line);
  renderOrgManagementPage();
  showToast("已切换到基础条线");
}else if(line==="operation"){
  activateOperationProjectReportMenu();
  renderSideMenu(line);
  renderOperationProductionProjectReportPage();
  showToast("已切换到产运");
}else{
  clearBusinessMenuActive(line);
  collapseInactiveGroups(line);
  renderSideMenu(line);
  renderBusinessModulePage(line,businessMenus[line].title);
 }
}

function selectBusinessChildMenu(line,gi,ci,name){
  currentBusinessLine=line;
  clearBusinessMenuActive(line);

  const menus=businessMenus[line]?.menus||[];
  const parent=menus[gi];

  menus.forEach((m,i)=>{
    if(m.children)m.open=i===gi;
  });

  if(parent?.children?.[ci]){
    parent.open=true;
    parent.children[ci].active=true;
  }

  renderSideMenu(line);

  if(line==="base"&&name==="组织管理")return renderOrgManagementPage();
  if(line==="base"&&name==="岗位管理")return renderPostManagementPage();
  if(line==="base"&&name==="角色管理")return renderRoleManagementPage();
  if(line==="base"&&name==="消息模板")return renderMessageTemplatePage();
  if(line==="base"&&name==="发送记录")return renderMessageSendRecordPage();
  if(line==="base"&&name==="消息记录")return renderMessageRecordPage();

  if(line==="safety"&&name==="劳务工花名册")return renderRosterPage();
  if(line==="safety"&&name==="视频监控")return renderSafetyVideoMonitorPage();
  if(line==="safety"&&name==="AI违规抓拍")return renderSafetyAiCapturePage();
  if(line==="safety"&&parent?.name==="安全评价")return renderSafetyEvaluationManagePage(name);
  if(line==="operation")return renderOperationProductionProjectReportPage();

  if(line==="safety")return renderSafetyPlaceholder(name);

  if(line==="production"&&parent?.name==="风险管理"&&(name==="风险管控清单"||name==="风险管理台账"))return renderRiskLedgerPage();
  if(line==="production"&&parent?.name==="产值管理"&&name==="产值预测分析报表")return renderOutputForecastAnalysisPage();
  if(line==="production"&&parent?.name==="产值管理"&&name==="项目产值上报（废）")return renderActualOutputReportPage();
  if(line==="production"&&parent?.name==="产值管理"&&name==="实际产值上报")return renderComprehensiveActualOutputReportPage();
  if(line==="production"&&parent?.name==="产值管理"&&name==="完工未结算管理")return renderFinishedUnsettledOutputPage();
  if(line==="production"&&parent?.name==="产值管理"&&name==="其他业态产值申报")return renderOtherBizOutputReportPage();

  if(line==="production"&&parent?.name==="供应商管理"&&name==="基础画像"){
    return renderSupplierLedgerPage();
  }

  if(line==="production"&&parent?.name==="供应商管理"&&name==="评分记录"){
    return renderSupplierScoreRecordPage();
  }

  if(line==="production"&&parent?.name==="供应商管理"&&name==="履约评价"){
    return renderPerformanceEvaluationPage();
  }

  renderBusinessModulePage(line,name);
}

function selectBusinessSingleMenu(line,i,name){
  currentBusinessLine=line;
  clearBusinessMenuActive(line);

  const menus=businessMenus[line]?.menus||[];
  menus.forEach(m=>{
    if(m.children)m.open=false;
  });

  if(menus[i])menus[i].active=true;

  renderSideMenu(line);

  if(line==="home"&&name==="施工日志")return renderEnterpriseConstructionLogPage();
  if(line==="safety"&&i===0)return renderSafetyOnlineDashboardPage();
  if(line==="production"&&name==="大屏看板")return renderProductionDashboardByKey(window.__APP_PRODUCTION_DASHBOARD_ROUTE_KEY__ || "overview");
  if(line==="production"&&name==="施工项目一览")return renderConstructionProjectPage();
  if(line==="operation"&&name==="接口同步异常记录")return renderInterfaceSyncExceptionPage();

  line==="safety"
    ? renderSafetyPlaceholder(name)
    : renderBusinessModulePage(line,name);
}
