(function(global){
  const componentScriptUrl=String(document.currentScript?.src||"");
  let componentStyle=[...document.querySelectorAll('link[rel="stylesheet"]')].find(link=>String(link.href||"").includes("/approval-dialog/approval-dialog.css"));
  if(!componentStyle){
    componentStyle=document.createElement("link");
    componentStyle.rel="stylesheet";
  }
  componentStyle.href=componentScriptUrl.replace(/approval-dialog\.js(?:\?.*)?$/,"approval-dialog.css?v=1.3.0-dialog-modes");
  document.head.appendChild(componentStyle);

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  }

  function recordStatusClass(status){
    const value=String(status||"").toLowerCase();
    if(["done","approved","已完成","审批通过","已通过"].includes(value))return "done";
    if(["processing","审批中","处理中"].includes(value))return "processing";
    if(["reject","rejected","已驳回","驳回"].includes(value))return "reject";
    return "wait";
  }

  function approvalStatusClass(status){
    const value=String(status||"");
    if(["审批通过","已通过","已完成"].includes(value))return "done";
    if(["审批中","处理中"].includes(value))return "processing";
    if(["已驳回","驳回"].includes(value))return "reject";
    return "draft";
  }

  const demoViewRecords=[
    {person:"秦群群",time:"2026-07-24 16:42"},
    {person:"王安全",time:"2026-07-24 15:18"},
    {person:"王安全",time:"2026-07-24 10:06"},
    {person:"刘佳",time:"2026-07-23 17:35"},
    {person:"王峰",time:"2026-07-23 09:20"}
  ];

  function normalizeViewTime(value){
    const matched=String(value||"").match(/(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})(?:日)?(?:\s+(\d{1,2}):(\d{2}))?/);
    if(!matched)return {timestamp:0,date:"日期未知",time:"-"};
    const [,year,month,day,hour="00",minute="00"]=matched;
    const paddedMonth=month.padStart(2,"0"),paddedDay=day.padStart(2,"0"),paddedHour=hour.padStart(2,"0");
    return {timestamp:new Date(Number(year),Number(month)-1,Number(day),Number(hour),Number(minute)).getTime(),date:`${year}年${Number(month)}月${Number(day)}日`,time:`${year}-${paddedMonth}-${paddedDay} ${paddedHour}:${minute}`};
  }

  function renderViewRecords(records){
    const normalized=(Array.isArray(records)?records:demoViewRecords).map((record,index)=>({...record,index,...normalizeViewTime(record.time||record.viewTime)})).sort((a,b)=>b.timestamp-a.timestamp||a.index-b.index);
    if(!normalized.length)return `<div class="approval-dialog-empty">暂无浏览记录</div>`;
    const groups=[];
    normalized.forEach(record=>{let group=groups.find(item=>item.date===record.date);if(!group){group={date:record.date,records:[]};groups.push(group);}group.records.push(record);});
    return groups.map(group=>`<section class="approval-dialog-view-day"><h4>${escapeHtml(group.date)}</h4><div>${group.records.map(record=>{
      const person=record.person||record.name||"-";
      const avatar=record.avatar?`<img src="${escapeHtml(record.avatar)}" alt="${escapeHtml(person)}">`:`<span role="img" aria-label="${escapeHtml(person)}头像">${escapeHtml(person.slice(-2))}</span>`;
      const role=record.role||record.post||"-";
      const org=record.project||record.company||record.org||"项目管理人员";
      return `<article class="approval-dialog-view-item"><div class="approval-dialog-view-avatar">${avatar}</div><div class="approval-dialog-view-person"><div class="approval-dialog-view-name-line"><strong>${escapeHtml(person)}</strong><span class="project-visit-role-tags"><span class="project-visit-role-tag">${escapeHtml(role)}</span></span></div><small>${escapeHtml(org)}</small></div><time datetime="${escapeHtml(record.time||record.viewTime||"")}">${escapeHtml(record.time)}</time></article>`;
    }).join("")}</div></section>`).join("");
  }

  function renderPanel(options={}){
    const records=Array.isArray(options.records)?options.records:[];
    const title=options.approvalTitle||"审批记录";
    const status=options.status||"未发起";
    const collapsible=options.collapsible!==false;
    return `<aside class="approval-dialog-panel">
      ${collapsible?`<button class="approval-dialog-toggle" type="button" title="收起记录面板" aria-label="收起记录面板" onclick="ApprovalDialog.togglePanel(this)">&#8250;</button>`:""}
      <div class="approval-dialog-tabs" role="tablist" aria-label="记录类型"><button class="active" type="button" role="tab" aria-selected="true" onclick="ApprovalDialog.switchTab(this,'approval')">${escapeHtml(title)}</button><button type="button" role="tab" aria-selected="false" onclick="ApprovalDialog.switchTab(this,'view')">浏览记录</button></div>
      <div class="approval-dialog-tab-panel active" data-approval-dialog-tab="approval" role="tabpanel">
        <div class="approval-dialog-status"><span>${escapeHtml(options.statusLabel||"整体审批状态")}</span><b class="${approvalStatusClass(status)}">${escapeHtml(status)}</b></div>
        <div class="approval-dialog-records">
        ${records.length?records.map((record,index)=>{
          const statusClass=recordStatusClass(record.status);
          return `<div class="approval-dialog-step ${statusClass}">
            <div class="approval-dialog-dot">${statusClass==="done"?"✓":index+1}</div>
            <div class="approval-dialog-step-content">
              <div class="approval-dialog-node"><strong>${escapeHtml(record.node||record.nodeName||`审批节点${index+1}`)}</strong><span>${escapeHtml(record.time||record.handleTime||"-")}</span></div>
              <div class="approval-dialog-record-card">
                <b>${escapeHtml(record.person||record.handler||"-")}</b>
                ${record.org?`<p>${escapeHtml(record.org)}</p>`:""}
                <p>操作：<em>${escapeHtml(record.action||record.statusText||"-")}</em></p>
                <p>意见：${escapeHtml(record.opinion||record.comment||"-")}</p>
                ${record.receiver?`<p>接收人：${escapeHtml(record.receiver)}</p>`:""}
              </div>
            </div>
          </div>`;
        }).join(""):`<div class="approval-dialog-empty">暂无审批记录</div>`}
        </div>
      </div>
      <div class="approval-dialog-tab-panel" data-approval-dialog-tab="view" role="tabpanel">${renderViewRecords(options.viewRecords)}</div>
    </aside>`;
  }

  function renderPreviewPanel(options={}){
    const nodes=(Array.isArray(options.previewNodes)?options.previewNodes:[]).map(node=>typeof node==="string"?{name:node}:node);
    return `<aside class="approval-dialog-panel approval-dialog-preview-panel">
      <div class="approval-dialog-preview-title">${escapeHtml(options.previewTitle||"流程预览")}</div>
      <div class="approval-dialog-preview-tip">${escapeHtml(options.previewTip||"发起后按如下流程审批")}</div>
      <div class="approval-dialog-preview-flow">
        ${nodes.length?nodes.map((node,index)=>`<div class="approval-dialog-preview-node ${index===0||index===nodes.length-1?"terminal":""}">
          <span>${index+1}</span><strong>${escapeHtml(node.name||node.node||`流程节点${index+1}`)}</strong>${node.role?`<em>${escapeHtml(node.role)}</em>`:""}
        </div>`).join(""):'<div class="approval-dialog-empty">暂无流程节点</div>'}
      </div>
    </aside>`;
  }

  function switchTab(button,name){
    const panel=button?.closest(".approval-dialog-panel");
    if(!panel)return;
    panel.querySelectorAll(".approval-dialog-tabs button").forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active));});
    panel.querySelectorAll(".approval-dialog-tab-panel").forEach(item=>item.classList.toggle("active",item.dataset.approvalDialogTab===name));
  }

  function renderLayout(options={}){
    const className=String(options.className||"").trim();
    const initiationMode=options.mode==="initiation"||options.mode==="before-start";
    return `<div class="approval-dialog-layout ${initiationMode?"approval-dialog-initiation-mode":"approval-dialog-process-mode"} ${className}"><div class="approval-dialog-main">${options.content||""}</div>${initiationMode?renderPreviewPanel(options):renderPanel(options)}</div>`;
  }

  function togglePanel(button){
    const panel=button?.closest(".approval-dialog-panel");
    const layout=button?.closest(".approval-dialog-layout,.actual-output-detail");
    if(!panel)return;
    const collapsed=panel.classList.toggle("collapsed");
    layout?.classList.toggle("approval-collapsed",collapsed);
    button.title=collapsed?"展开记录面板":"收起记录面板";
    button.setAttribute("aria-label",button.title);
    button.innerHTML=collapsed?"&#8249;":"&#8250;";
  }

  function open(options={}){
    openModal(options.title||"审批详情",renderLayout(options),options.footer||`<button class="btn" onclick="closeModal()">关闭</button>`,options.size||"large");
    modalBox.classList.add("approval-dialog-modal");
    String(options.modalClass||"").split(/\s+/).filter(Boolean).forEach(name=>modalBox.classList.add(name));
  }

  const demoRecords=[
    {node:"发起审批",status:"done",time:"2026-08-27 09:18",person:"王安全",org:"轨交分公司",action:"提交审批",opinion:"提交本月实际产值上报",receiver:"分公司工程部副经理"},
    {node:"分公司工程部副经理",status:"processing",time:"待处理",person:"王峰",org:"轨交分公司",action:"审批中",opinion:"待审批",receiver:"子公司生产管理部"},
    {node:"子公司生产管理部",status:"wait",time:"-",person:"刘佳",org:"上海隧道",action:"待审批",opinion:"-",receiver:"集团生产管理部"}
  ];

  function renderLibraryPreview(){
    const nodes=["发起审批","项目部总工","分公司管理员","结束审批"];
    return `<div class="approval-dialog-library-modes"><section><h4>流程发起前</h4>${renderPreviewPanel({previewNodes:nodes})}<button class="btn primary" type="button" onclick="ApprovalDialog.openInitiationDemo()">打开示例</button></section><section><h4>流程处理过程</h4>${renderPanel({records:demoRecords,status:"审批中",collapsible:false})}<button class="btn primary" type="button" onclick="ApprovalDialog.openDemo()">打开示例</button></section></div><p>发起前只展示即将进入的流程节点；流程发起后展示审批记录、浏览记录、节点处理人、意见和状态。</p>`;
  }

  function openInitiationDemo(){
    open({title:"停工申请",mode:"initiation",previewNodes:["发起审批","项目部总工","分公司管理员","结束审批"],content:`<section class="approval-dialog-demo-card"><h3>上海示范区线工程</h3><p>流程发起表单内容区域</p></section>`,footer:`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="closeModal()">保存并提交</button>`});
  }

  function openDemo(){
    open({
      title:"实际产值上报详情",
      status:"审批中",
      records:demoRecords,
      content:`<section class="approval-dialog-demo-card"><h3>机场联络线工程</h3><div><span>所属公司</span><strong>上海隧道</strong><span>所属分公司</span><strong>轨交分公司</strong><span>上报月份</span><strong>2026-08</strong><span>本月完成产值</span><strong>1,280.00 万元</strong></div></section><section class="approval-dialog-demo-card"><h3>上报信息</h3><p>审批弹框的左侧区域由业务内容插槽承载，右侧审批记录保持统一。</p></section>`
    });
  }

  global.ApprovalDialog={open,renderLayout,renderPanel,renderPreviewPanel,switchTab,togglePanel,renderLibraryPreview,openDemo,openInitiationDemo};
})(window);
