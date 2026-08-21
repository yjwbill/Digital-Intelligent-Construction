let mobileSelectedProjectNameV2290="上海示范线工程15标";

function renderMobileWorkbenchTitleV2290(){
  setTimeout(()=>{
    const title=document.querySelector(".mobile-workbench .mobile-titlebar h1");
    if(title)title.textContent=mobileSelectedProjectNameV2290;
  },0);
}

const renderMobileWorkbenchV2290Base=renderMobileWorkbench;
renderMobileWorkbench=function(){
  renderMobileWorkbenchV2290Base();
  renderMobileWorkbenchTitleV2290();
};

function openTodoDetail(id){
  const t=todoData.find(x=>x.id===id);
  if(!t)return;
  openModal("待办详情",`
    <div class="receiver-message-popup todo-detail-popup">
      <div class="popup-meta"><span>${t.module1} / ${t.module2}</span><span>${t.sendTime}</span></div>
      <h2>${t.title}</h2>
      <p>${t.content}</p>
      <div class="message-admin-muted">所属组织：${t.org}</div>
      <div class="message-admin-muted">待办编号：${t.sourceNo}</div>
      <div class="message-admin-muted">办理时限：${t.deadline}</div>
    </div>
  `,`
    <button class="btn" onclick="closeModal();renderTodoCenter()">我已知晓</button>
    <button class="btn primary" onclick="handlePcTodoV2290(${t.id})">去办理</button>
  `);
}

function handlePcTodoV2290(id){
  const t=todoData.find(x=>x.id===id);
  if(t)t.status="已办理";
  closeModal();
  showToast("已进入待办办理");
  renderTodoCenter();
}

function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  const layer=document.createElement("div");
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <section class="mobile-message-dialog normal todo-dialog">
      <div class="mobile-message-dialog-head"><h2>${item.title}</h2><p>更新发布于 ${item.time}</p></div>
      <div class="mobile-message-dialog-content"><p>${item.content}</p></div>
      <div class="mobile-message-dialog-actions">
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
      </div>
    </section>
  `;
  document.body.appendChild(layer);
}

function handleMobileTodoV2272(id){
  mobileTodoListV2271=mobileTodoListV2271.map(item=>item.id===id?{...item,status:"done"}:item);
  showToast("已进入待办办理");
  closeMobileTodoDialogV2272();
}

function selectMobileProjectV2290(encodedName){
  const name=decodeURIComponent(encodedName || "");
  const project=mobileProjectSwitchListV2283.find(item=>item.name===name);
  mobileSelectedProjectNameV2290=project?.name || name || mobileSelectedProjectNameV2290;
  mobileProjectSwitchStateV2283.openFilter="";
  renderMobileWorkbench();
}

function renderMobileProjectCardV2283(item){
  const encodedName=encodeURIComponent(item.name);
  return `
    <button class="mobile-project-card" type="button" onclick="selectMobileProjectV2290('${encodedName}')">
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
    </button>
  `;
}

/* V2.2.91 EOF message/todo detail time and close polish */
function formatPublishMinuteV2291(value){
  const raw=String(value || "").trim();
  const matched=raw.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{1,2}/);
  const text=(matched ? matched[0] : raw).replace(/\//g,"-");
  return `发布于 ${text}`;
}

function closeMobileTodoDialogV2272(){
  document.querySelectorAll(".mobile-message-dialog-layer").forEach(layer=>layer.remove());
  if(window.__mobileTodoDialogSource==="workbench"){
    const primary=window.__mobileDialogReturnPrimary || "todo";
    const notice=window.__mobileDialogReturnNotice || "message";
    renderMobileWorkbench();
    mobileWorkbenchV2256.primaryTab=primary;
    mobileWorkbenchV2256.noticeType=notice;
    setTimeout(()=>{
      const tabs=document.getElementById("mobilePrimaryTabs");
      const panel=document.getElementById("mobilePrimaryPanel");
      if(tabs)tabs.innerHTML=renderMobilePrimaryTabsV2262();
      if(panel)panel.innerHTML=renderMobilePrimaryPanelV2262();
    },0);
  }else if(typeof renderMobileTodoCenterV2271==="function"){
    renderMobileTodoCenterV2271();
  }
}

function openReceiverMessageDetail(id){
  const m=messageData.find(x=>x.id===id);
  if(!m)return;
  m.status="已读";
  const timeText=formatPublishMinuteV2291(m.sendTime);
  const isWarning=m.type==="预警通知";
  const html=isWarning?`
    <div class="receiver-message-popup warning">
      <div class="receiver-message-title">⚠️ ${m.title}</div>
      <div class="receiver-message-time">${timeText}</div>
      <div class="receiver-message-body">
        <div class="receiver-message-warning-icon">暴雨</div>
        <p>${m.content}</p>
        <p><strong>防御指南：</strong></p>
        <p>1. 请相关项目负责人及时关注现场风险，做好隐患排查。</p>
        <p>2. 对涉及重大风险源的项目，应及时组织复核并闭环。</p>
      </div>
    </div>
  `:`
    <div class="receiver-message-popup">
      <div class="receiver-message-title">${m.title}</div>
      <div class="receiver-message-time">${timeText}</div>
      <div class="receiver-message-body">
        <p>${m.content}</p>
        <p class="message-admin-muted">附件：${m.type==="通知公告"?"版本更新说明.pdf":"无"}</p>
      </div>
    </div>
  `;
  openModal("消息详情",html,`
    <button class="btn" onclick="closeModal();renderMessageCenter()">我已知晓</button>
    ${m.jumpLink?`<button class="btn primary" onclick="jumpReceiverMessage('${m.jumpLink}')">跳转</button>`:""}
  `,"large");
  renderMessageCenter();
}

function openTodoDetail(id){
  const t=todoData.find(x=>x.id===id);
  if(!t)return;
  openModal("待办详情",`
    <div class="receiver-message-popup todo-detail-popup">
      <div class="receiver-message-title">${t.title}</div>
      <div class="receiver-message-time">${formatPublishMinuteV2291(t.sendTime)}</div>
      <div class="receiver-message-body">
        <p>${t.content}</p>
        <p class="message-admin-muted">所属组织：${t.org}</p>
        <p class="message-admin-muted">待办编号：${t.sourceNo}</p>
        <p class="message-admin-muted">办理时限：${t.deadline}</p>
      </div>
    </div>
  `,`
    <button class="btn" onclick="closeModal();renderTodoCenter()">我已知晓</button>
    <button class="btn primary" onclick="handlePcTodoV2290(${t.id})">去办理</button>
  `);
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
          <p>${formatPublishMinuteV2291(item.time)}</p>
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

function openMobileTodoDetailV2272(id){
  const item=mobileTodoListV2271.find(x=>x.id===id);
  if(!item)return;
  window.__mobileTodoDialogSource=document.querySelector(".mobile-todo-page")?"todoCenter":"workbench";
  window.__mobileDialogReturnPrimary=mobileWorkbenchV2256.primaryTab;
  window.__mobileDialogReturnNotice=mobileWorkbenchV2256.noticeType;
  document.querySelectorAll(".mobile-message-dialog-layer").forEach(layer=>layer.remove());
  const layer=document.createElement("div");
  layer.className="mobile-message-dialog-layer";
  layer.innerHTML=`
    <div class="mobile-message-dialog-mask" onclick="closeMobileTodoDialogV2272()"></div>
    <section class="mobile-message-dialog normal todo-dialog">
      <div class="mobile-message-dialog-head">
        <div>
          <h2>${item.title}</h2>
          <p>${formatPublishMinuteV2291(item.time)}</p>
        </div>
      </div>
      <div class="mobile-message-dialog-content"><p>${item.content}</p></div>
      <div class="mobile-message-dialog-actions two">
        <button class="plain" onclick="closeMobileTodoDialogV2272()">我已知晓</button>
        <button class="primary" onclick="handleMobileTodoV2272('${item.id}')">去办理</button>
      </div>
    </section>
  `;
  (document.querySelector(".mobile-workbench") || document.body).appendChild(layer);
}

/* V2.2.95 mobile more apps page */
const mobileMoreAppGroupsV2295=[
  {
    key:"production",
    title:"生产",
    apps:["项目状态管理","项目经理变更","分公司变更","里程碑完成","风险变更","风险条件验收","期初产值上报","月度产值上报"]
  },
  {
    key:"safety",
    title:"安全",
    apps:["劳务工花名册","登记进场","劳务工考勤","移动打卡","每日监督","隐患排查","视频监控","AI抓拍"]
  },
  {
    key:"economy",
    title:"经济",
    apps:["项目经济总览","经济诊断报告"]
  }
];
let mobileMoreAppsActiveV2295="production";

function renderMobileMoreAppIconV2295(name,index,groupKey){
  const iconText=(name || "").slice(0,1);
  const action=groupKey==="production" && name==="月度产值上报"
    ?"renderMobileMonthlyOutputReportPageV2292()"
    :`showToast('${name}')`;
  return `
    <button class="mobile-more-app" type="button" onclick="${action}">
      <span class="more-app-icon ${groupKey} tone-${index%8}"><i>${iconText}</i></span>
      <strong>${name}</strong>
    </button>
  `;
}

function renderMobileMoreGroupV2295(group){
  return `
    <section class="mobile-more-group" id="more-group-${group.key}">
      <h2>${group.title}</h2>
      <div class="mobile-more-grid">
        ${group.apps.map((name,index)=>renderMobileMoreAppIconV2295(name,index,group.key)).join("")}
      </div>
    </section>
  `;
}

function setMobileMoreActiveV2295(key){
  mobileMoreAppsActiveV2295=key;
  document.querySelectorAll(".mobile-more-tabs button").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.key===key);
  });
}

function scrollMobileMoreGroupV2295(key){
  setMobileMoreActiveV2295(key);
  const target=document.getElementById(`more-group-${key}`);
  const scroller=document.querySelector(".mobile-more-scroll");
  if(target && scroller){
    const top=target.offsetTop-scroller.offsetTop;
    scroller.scrollTo({top:Math.max(0,top-8),behavior:"smooth"});
  }
}

function handleMobileMoreScrollV2295(){
  const scroller=document.querySelector(".mobile-more-scroll");
  if(!scroller)return;
  const current=[...mobileMoreAppGroupsV2295].reverse().find(group=>{
    const target=document.getElementById(`more-group-${group.key}`);
    return target && scroller.scrollTop>=target.offsetTop-scroller.offsetTop-40;
  });
  if(current)setMobileMoreActiveV2295(current.key);
}

function renderMobileMoreAppsPageV2295(){
  const app=document.querySelector(".app");
  if(!app)return;
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  mobileMoreAppsActiveV2295=mobileMoreAppsActiveV2295 || "production";
  app.innerHTML=`
    <div class="mobile-workbench mobile-more-apps-page">
      <header class="mobile-more-top">
        <div class="mobile-statusbar">
          <span>16:41</span>
          <div class="mobile-status-icons"><span class="signal"></span><span class="wifi"></span><span class="battery"></span></div>
        </div>
        <div class="mobile-more-titlebar">
          <button class="mobile-version-back" onclick="renderMobileWorkbench()" aria-label="返回"></button>
          <h1>全部应用</h1>
        </div>
        <nav class="mobile-more-tabs" aria-label="应用分组">
          ${mobileMoreAppGroupsV2295.map(group=>`<button type="button" data-key="${group.key}" class="${group.key===mobileMoreAppsActiveV2295?"active":""}" onclick="scrollMobileMoreGroupV2295('${group.key}')">${group.title}</button>`).join("")}
        </nav>
      </header>
      <main class="mobile-more-scroll" onscroll="handleMobileMoreScrollV2295()">
        ${mobileMoreAppGroupsV2295.map(renderMobileMoreGroupV2295).join("")}
      </main>
    </div>
  `;
}

if(!window.__mobileMoreAppsBoundV2295){
  window.__mobileMoreAppsBoundV2295=true;
  document.addEventListener("click",event=>{
    const trigger=event.target.closest?.(".apps-card .mobile-section-head button");
    if(!trigger)return;
    event.preventDefault();
    event.stopPropagation();
    renderMobileMoreAppsPageV2295();
  },true);
}

/* V2.2.192 mobile monthly output report */
const mobileMonthlyOutputStateV2292={
  outputMonth:getCurrentReportMonth(),
  isSettlement:"否",
  monthlyOutputTaxIncluded:"18520.00",
  managerPhoneRevealUntil:0,
  attachments:[
    {name:"项目产值确认单.pdf",size:"1.47M",type:"pdf"},
    {name:"监理签认进度表.docx",size:"1.12M",type:"doc"}
  ]
};

function getMobileMonthlyOutputBaseV2292(){
  const row=actualOutputReportRows[0];
  const meta=getActualOutputDetailMeta(row);
  return {row,meta};
}

function formatMobileOutputMoneyV2292(value,precision=2){
  const num=Number(String(value ?? "").replace(/,/g,""));
  if(!Number.isFinite(num))return "0.00";
  return num.toLocaleString("zh-CN",{minimumFractionDigits:precision,maximumFractionDigits:precision});
}

function parseMobileOutputMoneyV2292(value){
  const num=Number(String(value ?? "").replace(/,/g,""));
  return Number.isFinite(num)?num:0;
}

function getMobileMonthlyOutputComputedV2292(){
  const output=parseMobileOutputMoneyV2292(mobileMonthlyOutputStateV2292.monthlyOutputTaxIncluded);
  const revenue=output/1.09;
  return {
    monthlyRevenueTaxExcluded:revenue,
    yearOutput:output*5.6,
    yearRevenue:revenue*5.6,
    cumulativeOutput:output*18.4,
    cumulativeRevenue:revenue*18.4,
    annualForecast:output*7.2,
    annualCompletionRate:68.42
  };
}

function syncMobileMonthlyOutputFieldV2292(field,value){
  mobileMonthlyOutputStateV2292[field]=value;
}

function getMobileMonthlyOutputManagerPhoneV2292(){
  const phone="17082575703";
  return Date.now()<mobileMonthlyOutputStateV2292.managerPhoneRevealUntil?phone:maskPhone(phone);
}

function renderMobileMonthlyOutputManagerV2292(){
  return `项目经理：施嘉乐 | <span id="mobileOutputManagerPhone">${getMobileMonthlyOutputManagerPhoneV2292()}</span> <button class="mobile-output-phone-eye" type="button" title="查看完整手机号" onclick="revealMobileMonthlyOutputManagerPhoneV2292(event)">👁️</button>`;
}

function revealMobileMonthlyOutputManagerPhoneV2292(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
  }
  mobileMonthlyOutputStateV2292.managerPhoneRevealUntil=Date.now()+3000;
  const phone=document.getElementById("mobileOutputManagerPhone");
  if(phone)phone.textContent=getMobileMonthlyOutputManagerPhoneV2292();
  setTimeout(()=>{
    const target=document.getElementById("mobileOutputManagerPhone");
    if(target)target.textContent=getMobileMonthlyOutputManagerPhoneV2292();
  },3000);
}

function formatMobileMonthlyOutputInputV2292(input){
  const value=parseMobileOutputMoneyV2292(input.value);
  mobileMonthlyOutputStateV2292.monthlyOutputTaxIncluded=value.toFixed(2);
  input.value=value.toFixed(2);
  refreshMobileMonthlyOutputComputedFieldsV2292();
}

function setMobileMonthlyOutputComputedValueV2292(key,value,unit){
  const target=document.querySelector(`[data-mobile-output-computed="${key}"]`);
  if(!target)return;
  target.innerHTML=`<span>${value}</span>${unit?`<em>${unit}</em>`:""}`;
}

function refreshMobileMonthlyOutputComputedFieldsV2292(){
  const computed=getMobileMonthlyOutputComputedV2292();
  setMobileMonthlyOutputComputedValueV2292("monthlyRevenueTaxExcluded",formatMobileOutputMoneyV2292(computed.monthlyRevenueTaxExcluded),"万元");
  setMobileMonthlyOutputComputedValueV2292("yearOutput",formatMobileOutputMoneyV2292(computed.yearOutput),"万元");
  setMobileMonthlyOutputComputedValueV2292("yearRevenue",formatMobileOutputMoneyV2292(computed.yearRevenue),"万元");
  setMobileMonthlyOutputComputedValueV2292("cumulativeOutput",formatMobileOutputMoneyV2292(computed.cumulativeOutput),"万元");
  setMobileMonthlyOutputComputedValueV2292("cumulativeRevenue",formatMobileOutputMoneyV2292(computed.cumulativeRevenue),"万元");
  setMobileMonthlyOutputComputedValueV2292("annualForecast",formatMobileOutputMoneyV2292(computed.annualForecast),"万元");
  setMobileMonthlyOutputComputedValueV2292("annualCompletionRate",computed.annualCompletionRate.toFixed(2),"%");
}

function setMobileMonthlyOutputSettlementV2292(value){
  mobileMonthlyOutputStateV2292.isSettlement=value;
  document.querySelectorAll(".mobile-output-radio button").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.value===value);
  });
}

function addMobileMonthlyOutputAttachmentsV2292(input){
  const files=[...(input.files || [])];
  if(!files.length)return;
  const remain=9-mobileMonthlyOutputStateV2292.attachments.length;
  if(remain<=0){
    showToast("相关附件最多上传9个");
    input.value="";
    return;
  }
  files.slice(0,remain).forEach(file=>{
    const ext=(file.name.split(".").pop() || "file").toLowerCase();
    const size=file.size?`${Math.max(.01,file.size/1024/1024).toFixed(2)}M`:"-";
    mobileMonthlyOutputStateV2292.attachments.push({name:file.name,size,type:ext});
  });
  if(files.length>remain)showToast("相关附件最多上传9个，已自动截取");
  input.value="";
  refreshMobileMonthlyOutputAttachmentsV2292();
}

function removeMobileMonthlyOutputAttachmentV2292(index){
  mobileMonthlyOutputStateV2292.attachments.splice(index,1);
  refreshMobileMonthlyOutputAttachmentsV2292();
}

function renderMobileMonthlyOutputTagV2292(text,type){
  return `<span class="mobile-output-tag ${type || ""}">${text}</span>`;
}

function renderMobileMonthlyOutputMetricV2292(label,value,unit){
  return `
    <div class="mobile-output-metric">
      <span>${label}</span>
      <strong>${value}${unit?`<em>${unit}</em>`:""}</strong>
    </div>
  `;
}

function renderMobileMonthlyOutputAutoFieldV2292(label,value,unit,key){
  return `
    <div class="mobile-output-field readonly">
      <label>${label}</label>
      <div class="mobile-output-readonly-value" ${key?`data-mobile-output-computed="${key}"`:""}><span>${value}</span>${unit?`<em>${unit}</em>`:""}</div>
    </div>
  `;
}

function renderMobileMonthlyOutputAttachmentsV2292(){
  const list=mobileMonthlyOutputStateV2292.attachments;
  return `
    <div class="mobile-output-upload-row">
      <label class="mobile-output-upload-btn ${list.length>=9?"disabled":""}">
        <input type="file" multiple ${list.length>=9?"disabled":""} onchange="addMobileMonthlyOutputAttachmentsV2292(this)"/>
        <span>上传附件</span>
      </label>
      <em>${list.length}/9</em>
    </div>
    <div class="mobile-output-attachment-list">
      ${list.map((file,index)=>`
        <div class="mobile-output-attachment">
          <i class="${file.type.includes("pdf")?"pdf":"doc"}">${file.type.includes("pdf")?"PDF":"DOC"}</i>
          <div>
            <strong>${file.name}</strong>
            <span>${file.size}</span>
          </div>
          <button type="button" onclick="removeMobileMonthlyOutputAttachmentV2292(${index})" aria-label="删除附件">×</button>
        </div>
      `).join("")}
    </div>
  `;
}

function refreshMobileMonthlyOutputAttachmentsV2292(){
  const target=document.querySelector(".mobile-output-attachment-wrap");
  if(target)target.innerHTML=renderMobileMonthlyOutputAttachmentsV2292();
}

function renderMobileMonthlyOutputApprovalV2292(){
  const nodes=[
    "发起审批",
    "项目部总工",
    "分公司管理部门终审",
    "结束审批"
  ];
  return `
    <section class="mobile-output-card mobile-output-approval-card">
      <h2>审批记录</h2>
      <p class="mobile-output-approval-tip">发起后按如下流程审批</p>
      <div class="mobile-output-approval-flow">
        ${nodes.map((node,index)=>`
          <div class="mobile-output-approval-step ${index===0?"active":""}">
            <span>${index+1}</span>
            <div>
              <strong>${node}</strong>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMobileMonthlyOutputHeaderV2295(title,backAction="renderMobileMoreAppsPageV2295()"){
  return `
    <header class="mobile-feedback-top mobile-output-top">
      <div class="mobile-statusbar">
        <div class="mobile-time">16:41</div>
        <div class="mobile-phone-icons" aria-hidden="true">
          <span class="mobile-signal"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="mobile-wifi"></span>
          <span class="mobile-battery"></span>
        </div>
      </div>
      <div class="mobile-feedback-titlebar mobile-output-titlebar">
        <button class="mobile-version-back" onclick="${backAction}" aria-label="返回"></button>
        <h1>${title}</h1>
        ${renderMobileMiniProgramCapsuleV2297()}
      </div>
    </header>
  `;
}

function handleMobileMonthlyOutputSubmitV2292(type){
  showToast(type==="submit"?"月度实际产值上报已保存并提交":"月度实际产值上报已保存");
}

function renderMobileMonthlyOutputReportPageV2292(){
  const app=document.querySelector(".app");
  if(!app)return;
  const {row,meta}=getMobileMonthlyOutputBaseV2292();
  const computed=getMobileMonthlyOutputComputedV2292();
  window.__digitalConstructionMode="mobile";
  removeBottomFixedMenu();
  document.body.classList.add("mobile-mode");
  document.body.classList.remove("entry-mode");
  app.innerHTML=`
    <div class="mobile-workbench mobile-output-report-page">
      ${renderMobileMonthlyOutputHeaderV2295("月度实际产值上报","renderMobileMoreAppsPageV2295()")}
      <main class="mobile-output-scroll">
        <section class="mobile-output-project-card">
          <h2>上海示范区线工程 SFQSG-15 标施工</h2>
          <div class="mobile-output-tags">
            ${renderMobileMonthlyOutputTagV2292(row.projectStatus,row.projectStatus==="在建"?"green":"red")}
            ${renderMobileMonthlyOutputTagV2292(meta.projectType,"blue")}
            ${meta.isShareKey?renderMobileMonthlyOutputTagV2292("股份重点关注","red"):""}
            ${renderMobileMonthlyOutputTagV2292(meta.controlLevel,"orange")}
            ${renderMobileMonthlyOutputTagV2292(meta.implementMode,"green")}
            ${meta.isShanghaiMajor?renderMobileMonthlyOutputTagV2292("上海市重大项目","green"):""}
            ${renderMobileMonthlyOutputTagV2292("重点客户","pink")}
            ${meta.isSafetyManaged?renderMobileMonthlyOutputTagV2292("安全纳管","blue"):""}
          </div>
          <div class="mobile-output-basic">
            <div class="mobile-output-basic-row">
              <span>子公司：${row.company}</span>
              <span>分公司：${row.branch}</span>
            </div>
            <span class="mobile-output-manager-line">${renderMobileMonthlyOutputManagerV2292()}</span>
          </div>
          <div class="mobile-output-metrics">
            ${renderMobileMonthlyOutputMetricV2292("项目造价",formatMobileOutputMoneyV2292(meta.contractAmount),"万元")}
            ${renderMobileMonthlyOutputMetricV2292("增值税税率",meta.vatRate)}
            ${renderMobileMonthlyOutputMetricV2292("合同预测可转化产值",formatMobileOutputMoneyV2292(meta.predictedOutput),"万元")}
            ${renderMobileMonthlyOutputMetricV2292("合同预测可转化营收",formatMobileOutputMoneyV2292(meta.predictedRevenue),"万元")}
          </div>
        </section>

        <section class="mobile-output-card">
          <h2>上报信息</h2>
          <div class="mobile-output-form">
            <div class="mobile-output-field">
              <label><em>*</em>上报月份</label>
              <input type="month" value="${mobileMonthlyOutputStateV2292.outputMonth}" onchange="syncMobileMonthlyOutputFieldV2292('outputMonth',this.value)"/>
            </div>
            <div class="mobile-output-field">
              <label><em>*</em>是否结算</label>
              <div class="mobile-output-radio">
                ${["是","否"].map(value=>`<button type="button" data-value="${value}" class="${mobileMonthlyOutputStateV2292.isSettlement===value?"active":""}" onclick="setMobileMonthlyOutputSettlementV2292('${value}')">${value}</button>`).join("")}
              </div>
            </div>
            <div class="mobile-output-field">
              <label><em>*</em>本月完成产值（含税）</label>
              <div class="mobile-output-input-with-unit">
                <input class="money" inputmode="decimal" value="${mobileMonthlyOutputStateV2292.monthlyOutputTaxIncluded}" oninput="syncMobileMonthlyOutputFieldV2292('monthlyOutputTaxIncluded',this.value)" onblur="formatMobileMonthlyOutputInputV2292(this)" placeholder="请输入金额"/>
                <em>万元</em>
              </div>
            </div>
            ${renderMobileMonthlyOutputAutoFieldV2292("本月完成营收（不含税）",formatMobileOutputMoneyV2292(computed.monthlyRevenueTaxExcluded),"万元","monthlyRevenueTaxExcluded")}
            ${renderMobileMonthlyOutputAutoFieldV2292("年累产值（含税）",formatMobileOutputMoneyV2292(computed.yearOutput),"万元","yearOutput")}
            ${renderMobileMonthlyOutputAutoFieldV2292("年累营收（不含税）",formatMobileOutputMoneyV2292(computed.yearRevenue),"万元","yearRevenue")}
            ${renderMobileMonthlyOutputAutoFieldV2292("开累产值（含税）",formatMobileOutputMoneyV2292(computed.cumulativeOutput),"万元","cumulativeOutput")}
            ${renderMobileMonthlyOutputAutoFieldV2292("开累营收（不含税）",formatMobileOutputMoneyV2292(computed.cumulativeRevenue),"万元","cumulativeRevenue")}
            ${renderMobileMonthlyOutputAutoFieldV2292("项目预测全年产值（含税）",formatMobileOutputMoneyV2292(computed.annualForecast),"万元","annualForecast")}
            ${renderMobileMonthlyOutputAutoFieldV2292("年度产值总目标完成率",computed.annualCompletionRate.toFixed(2),"%","annualCompletionRate")}
            <div class="mobile-output-field attachment">
              <label><em>*</em>相关附件</label>
              <p>请上传本次产值上报的相关支撑文件（如客户/监理确认的进度确认单）</p>
              <div class="mobile-output-attachment-wrap">${renderMobileMonthlyOutputAttachmentsV2292()}</div>
            </div>
          </div>
        </section>
        ${renderMobileMonthlyOutputApprovalV2292()}
      </main>
      <footer class="mobile-output-bottom">
        <button class="plain" onclick="renderMobileMoreAppsPageV2295()">取消</button>
        <button class="primary" onclick="handleMobileMonthlyOutputSubmitV2292('submit')">保存并提交</button>
        <button class="secondary" onclick="handleMobileMonthlyOutputSubmitV2292('save')">保存</button>
      </footer>
    </div>
  `;
}

