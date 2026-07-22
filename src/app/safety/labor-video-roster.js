/* =========================
   劳务工花名册
========================= */
const safetyVideoTree=[
  {id:"org-sd",name:"上海隧道",type:"company",children:[
    {id:"branch-sz",name:"市政分公司",type:"branch",children:[
      {id:"project-sfq",name:"上海示范区线工程 SFQSG-15 标",type:"project",children:[
        {id:"cam-sfq-1",name:"项目部大门口球机",type:"ptz",status:"online",scene:"入口全景",ai:true,voice:true},
        {id:"cam-sfq-2",name:"二工区南侧枪机",type:"gun",status:"online",scene:"道路施工区",ai:true},
        {id:"cam-sfq-3",name:"三工区北侧枪机",type:"gun",status:"online",scene:"基坑作业区",voice:true},
        {id:"cam-sfq-4",name:"材料堆场球机",type:"ptz",status:"offline",scene:"材料堆场",ai:true,voice:true}
      ]},
      {id:"project-hxl",name:"华翔路非开挖修复工程",type:"project",children:[
        {id:"cam-hxl-1",name:"顶管始发井球机",type:"ptz",status:"online",scene:"始发井",ai:true},
        {id:"cam-hxl-2",name:"施工围挡枪机",type:"gun",status:"online",scene:"围挡道路",voice:true}
      ]}
    ]},
    {id:"branch-gj",name:"轨交分公司",type:"branch",children:[
      {id:"project-21",name:"轨道交通21号线一期工程",type:"project",children:[
        {id:"cam-21-1",name:"盾构始发球机",type:"ptz",status:"online",scene:"盾构始发",ai:true,voice:true},
        {id:"cam-21-2",name:"车站东侧枪机",type:"gun",status:"online",scene:"车站现场",ai:true}
      ]}
    ]}
  ]},
  {id:"org-sz",name:"市政集团",type:"company",children:[
    {id:"branch-js",name:"江苏分公司",type:"branch",children:[
      {id:"project-js",name:"南京江北新区综合管廊二期工程",type:"project",children:[
        {id:"cam-js-1",name:"综合管廊入口球机",type:"ptz",status:"online",scene:"管廊入口",voice:true},
        {id:"cam-js-2",name:"施工便道枪机",type:"gun",status:"offline",scene:"施工便道",ai:true}
      ]}
    ]}
  ]}
];
const safetyVideoState={
  tab:"live",
  layout:1,
  selectedCamera:"cam-sfq-1",
  selectedSlot:0,
  keyword:"",
  organization:"",
  expanded:new Set(["org-sd","branch-sz","project-sfq"]),
  selectedCameras:["cam-sfq-1"]
};

function getSafetyVideoCameras(nodes=safetyVideoTree,result=[]){
  nodes.forEach(node=>node.children?getSafetyVideoCameras(node.children,result):result.push(node));
  return result;
}

function getSafetyVideoCamera(id){
  return getSafetyVideoCameras().find(item=>item.id===id) || getSafetyVideoCameras()[0];
}

function toggleSafetyVideoTree(id){
  safetyVideoState.expanded.has(id)?safetyVideoState.expanded.delete(id):safetyVideoState.expanded.add(id);
  renderSafetyVideoMonitorPage();
}

function setSafetyVideoSearch(value){
  safetyVideoState.keyword=value || "";
  renderSafetyVideoMonitorPage();
}

function setSafetyVideoOrganization(value){
  safetyVideoState.organization=value || "";
  renderSafetyVideoMonitorPage();
}

function selectSafetyVideoCamera(id,slot=0){
  if(!id)return;
  safetyVideoState.selectedCamera=id;
  safetyVideoState.selectedSlot=slot;
  renderSafetyVideoMonitorPage();
}

function toggleSafetyVideoCamera(id){
  const selected=safetyVideoState.selectedCameras;
  const index=selected.indexOf(id);
  if(index>=0){
    selected.splice(index,1);
    if(safetyVideoState.selectedCamera===id){
      safetyVideoState.selectedCamera=selected[0] || getSafetyVideoCameras()[0]?.id || "";
      safetyVideoState.selectedSlot=0;
    }
  }else{
    if(selected.length>=9){
      showToast("单次最多允许选择9个摄像头");
      return;
    }
    selected.push(id);
    safetyVideoState.selectedCamera=id;
    safetyVideoState.selectedSlot=selected.length-1;
  }
  safetyVideoState.layout=selected.length<=1?1:selected.length<=4?4:9;
  safetyVideoState.selectedSlot=Math.min(safetyVideoState.selectedSlot,Math.max(0,safetyVideoState.layout-1));
  renderSafetyVideoMonitorPage();
}

function setSafetyVideoLayout(layout){
  safetyVideoState.layout=Number(layout)||4;
  safetyVideoState.selectedSlot=Math.min(safetyVideoState.selectedSlot,Math.max(0,safetyVideoState.layout-1));
  renderSafetyVideoMonitorPage();
}

function setSafetyVideoTab(tab){
  safetyVideoState.tab=tab;
  renderSafetyVideoMonitorPage();
}

function safetyVideoAction(message){
  showToast(message);
}

function renderSafetyVideoTree(nodes,depth=0,forceVisible=false){
  const keyword=safetyVideoState.keyword.trim().toLowerCase();
  return nodes.map(node=>{
    const matching=!keyword||forceVisible||node.name.toLowerCase().includes(keyword);
    const children=node.children?renderSafetyVideoTree(node.children,depth+1,forceVisible||node.name.toLowerCase().includes(keyword)):"";
    const expanded=safetyVideoState.expanded.has(node.id)||Boolean(keyword&&(matching||children));
    if(node.children){
      if(keyword&&!matching&&!children)return "";
      const treeToggle=`<img class="video-tree-toggle-icon ${expanded?"expanded":""}" src="./src/assets/video-tree-expand.svg" alt="${expanded?"收起":"展开"}"/>`;
      const treeIcon=node.type==="company"?`<img class="tree-company-icon" src="./src/assets/video-tree-company.svg" alt="子公司"/>`:`<span class="tree-icon ${node.type}">${node.type==="branch"?"⌂":"▣"}</span>`;
      return `<div class="video-tree-node group depth-${depth}"><button type="button" onclick="toggleSafetyVideoTree('${node.id}')">${treeToggle}${treeIcon}<strong>${node.name}</strong><em>${node.type==="project"?`${getSafetyVideoCameras(node.children).length}路`:""}</em></button>${expanded?`<div class="video-tree-children">${children}</div>`:""}</div>`;
    }
    if(!matching)return "";
    const selected=safetyVideoState.selectedCameras.includes(node.id);
    const typeIcon=node.type==="ptz"?"video-camera-ptz.svg":"video-camera-gun.svg";
    const statusIcon=node.status==="online"?"video-status-online.svg":"video-status-offline.svg";
    return `<button type="button" class="video-tree-camera ${selected?"active":""} ${node.status}" onclick="toggleSafetyVideoCamera('${node.id}')"><span class="tree-check">${selected?"✓":""}</span><img class="camera-type-icon" src="./src/assets/${typeIcon}" alt="${node.type==="ptz"?"球机":"枪机"}"/><strong>${node.name}</strong><span class="video-camera-attributes">${node.voice?`<img src="./src/assets/video-feature-voice.svg" alt="支持语音播报"/>`:""}${node.ai?`<img src="./src/assets/video-feature-ai.svg" alt="AI摄像头"/>`:""}<img src="./src/assets/${statusIcon}" alt="${node.status==="online"?"在线":"离线"}"/></span></button>`;
  }).join("");
}

function renderSafetyVideoFrame(camera,slot){
  const active=slot===safetyVideoState.selectedSlot;
  if(!camera)return `<button type="button" class="video-frame empty" onclick="safetyVideoAction('请从左侧选择摄像头')"><span>＋</span><em>未选择摄像头</em></button>`;
  const filters=["", "hue-rotate(14deg) saturate(.8)", "hue-rotate(-12deg) brightness(.78)", "hue-rotate(24deg) brightness(.88)"];
  return `<button type="button" class="video-frame ${active?"active":""} ${camera.status}" onclick="selectSafetyVideoCamera('${camera.id}',${slot})"><img src="./src/assets/project-log-building.png" alt="${camera.name}" style="filter:${filters[slot%filters.length]}"/><span class="video-frame-shade"></span><span class="video-frame-top"><i>${camera.status==="online"?"LIVE":"离线"}</i><em>${camera.type==="ptz"?"球机":"枪机"}</em></span><strong>${camera.name}</strong><small>${camera.scene}</small>${camera.status==="offline"?`<b class="video-offline-mask">设备离线</b>`:""}</button>`;
}

function renderSafetyVideoPtz(camera){
  if(camera.type!=="ptz")return `<section class="video-ptz-panel disabled"><div class="video-ptz-title"><span>▰</span><strong>固定枪机</strong></div><p>当前选择枪机，不支持云台、变焦与聚焦控制。</p><div class="video-basic-actions"><button onclick="safetyVideoAction('已发送违章抓拍指令')">违章抓拍</button><button onclick="safetyVideoAction('已开始本地录制')">录像</button></div></section>`;
  return `<section class="video-ptz-panel"><div class="video-ptz-title"><span>◉</span><strong>云台控制</strong><em>球机</em></div><div class="video-ptz-main"><div class="video-ptz-zoom"><button onclick="safetyVideoAction('焦距放大')">＋</button><span>变焦</span><button onclick="safetyVideoAction('焦距缩小')">－</button></div><div class="video-ptz-wheel"><button class="up" onclick="safetyVideoAction('云台向上转动')">▲</button><button class="left" onclick="safetyVideoAction('云台向左转动')">◀</button><button class="center" onclick="safetyVideoAction('云台停止')">■</button><button class="right" onclick="safetyVideoAction('云台向右转动')">▶</button><button class="down" onclick="safetyVideoAction('云台向下转动')">▼</button></div><div class="video-ptz-zoom"><button onclick="safetyVideoAction('开始聚焦')">＋</button><span>聚焦</span><button onclick="safetyVideoAction('停止聚焦')">－</button></div></div><div class="video-basic-actions"><button onclick="safetyVideoAction('已发送违章抓拍指令')">违章抓拍</button><button onclick="safetyVideoAction('已发起语音广播')">语音广播</button></div></section>`;
}

function renderSafetyVideoMonitorPage(){
  detailPage.style.display="none";
  listPage.style.display="block";
  const selected=getSafetyVideoCamera(safetyVideoState.selectedCamera);
  const slots=Array.from({length:safetyVideoState.layout},(_,index)=>safetyVideoState.selectedCameras[index]?getSafetyVideoCamera(safetyVideoState.selectedCameras[index]):null);
  const orgTree=safetyVideoState.organization?safetyVideoTree.filter(node=>node.name===safetyVideoState.organization):safetyVideoTree;
  listPage.innerHTML=`<div class="safety-video-page"><aside class="safety-video-sidebar"><div class="video-sidebar-tabs"><button class="${safetyVideoState.tab==="live"?"active":""}" onclick="setSafetyVideoTab('live')">视频直播</button><button class="${safetyVideoState.tab==="replay"?"active":""}" onclick="setSafetyVideoTab('replay')">视频回放</button><button class="${safetyVideoState.tab==="preview"?"active":""}" onclick="setSafetyVideoTab('preview')">视频预案</button></div><div class="video-tree-filter"><select class="select" onchange="setSafetyVideoOrganization(this.value)"><option value="">全部组织</option>${safetyVideoTree.map(node=>`<option value="${node.name}" ${node.name===safetyVideoState.organization?"selected":""}>${node.name}</option>`).join("")}</select><div><input class="input" value="${escapeAttr(safetyVideoState.keyword)}" placeholder="搜索项目或摄像头" onkeydown="if(event.key==='Enter'){event.preventDefault();setSafetyVideoSearch(this.value)}" onchange="setSafetyVideoSearch(this.value)"/><span>⌕</span></div></div><div class="video-tree">${renderSafetyVideoTree(orgTree)}</div>${renderSafetyVideoPtz(selected)}</aside><main class="safety-video-main"><div class="video-main-head"><div><strong>${safetyVideoState.tab==="live"?"实时监控":"视频回放"}</strong><span>${selected.name} · ${selected.status==="online"?"在线":"离线"}</span></div><div class="video-layout-actions"><button class="${safetyVideoState.layout===1?"active":""}" onclick="setSafetyVideoLayout(1)">▣</button><button class="${safetyVideoState.layout===4?"active":""}" onclick="setSafetyVideoLayout(4)">▦</button><button class="${safetyVideoState.layout===9?"active":""}" onclick="setSafetyVideoLayout(9)">▦₉</button><button title="全屏" onclick="safetyVideoAction('已进入全屏预览')">⛶</button></div></div><div class="video-wall layout-${safetyVideoState.layout}">${slots.map(renderSafetyVideoFrame).join("")}</div><div class="video-player-bar"><div><button title="静音" onclick="safetyVideoAction('已切换静音')">♬</button><button title="截图" onclick="safetyVideoAction('监控截图已保存')">▣</button><button title="录像" onclick="safetyVideoAction('本地录像已开始')">●</button></div><span>2026-07-12 10:28:36</span><div><button title="清晰度" onclick="safetyVideoAction('已切换高清码流')">HD</button><button title="全屏" onclick="safetyVideoAction('已进入全屏预览')">⛶</button></div></div></main></div>`;
}

const safetyAiCaptureRows=[
  {id:1,type:"人机碰撞",status:"待确认",company:"上海隧道",branch:"市政分公司",camera:"现场枪机",project:"上海示范区线工程 SFQSG-15 标",time:"2026-07-12 10:24:23",resource:"2026年第28周/碰撞检测",read:"王先国等23人已读",box:"large"},
  {id:2,type:"未带安全帽",status:"有效",company:"上海隧道",branch:"市政分公司",camera:"二工区南侧枪机",project:"华翔路非开挖修复工程",time:"2026-07-12 09:41:08",resource:"2026年第28周/劳动防护",read:"项目安全组已读",box:"person"},
  {id:3,type:"危险区域闯入",status:"无效",company:"市政集团",branch:"江苏分公司",camera:"材料堆场球机",project:"南京江北新区综合管廊二期工程",time:"2026-07-12 09:15:36",resource:"2026年第28周/区域入侵",read:"张建国等18人已读",box:"area"},
  {id:4,type:"人机碰撞",status:"待确认",company:"上海隧道",branch:"市政分公司",camera:"项目部大门口球机",project:"上海示范区线工程 SFQSG-15 标",time:"2026-07-12 08:55:12",resource:"2026年第28周/碰撞检测",read:"王先国等23人已读",box:"large"},
  {id:5,type:"火光识别",status:"待确认",company:"上海隧道",branch:"轨交分公司",camera:"盾构始发球机",project:"轨道交通21号线一期工程",time:"2026-07-11 18:20:31",resource:"2026年第28周/火光识别",read:"项目负责人待阅",box:"fire"},
  {id:6,type:"未带安全帽",status:"有效",company:"上海隧道",branch:"市政分公司",camera:"施工围挡枪机",project:"华翔路非开挖修复工程",time:"2026-07-11 16:42:15",resource:"2026年第28周/劳动防护",read:"章爱云等6人已读",box:"person"},
  {id:7,type:"危险区域闯入",status:"无效",company:"市政集团",branch:"江苏分公司",camera:"综合管廊入口球机",project:"南京江北新区综合管廊二期工程",time:"2026-07-11 15:18:42",resource:"2026年第28周/区域入侵",read:"处置完成",box:"area"},
  {id:8,type:"人机碰撞",status:"待确认",company:"上海隧道",branch:"市政分公司",camera:"顶管始发井球机",project:"华翔路非开挖修复工程",time:"2026-07-11 13:06:09",resource:"2026年第28周/碰撞检测",read:"项目安全组待阅",box:"large"}
];
const safetyAiCaptureState={company:"",branch:"",type:"",camera:"",date:"",projectName:"",statStatus:"",statType:"",page:1,pageSize:50};

function getSafetyAiCaptureBaseRows(){
  const state=safetyAiCaptureState;
  return safetyAiCaptureRows.filter(row=>(!state.projectName||row.project.includes(state.projectName))&&(!state.company||row.company===state.company)&&(!state.branch||row.branch===state.branch)&&(!state.type||row.type===state.type)&&(!state.camera||row.camera===state.camera)&&(!state.date||row.time.slice(0,10)===state.date));
}

function getSafetyAiCaptureRows(){
  const state=safetyAiCaptureState;
  return getSafetyAiCaptureBaseRows().filter(row=>(!state.statStatus||row.status===state.statStatus)&&(!state.statType||row.type===state.statType));
}

function setSafetyAiCaptureFilter(key,value){
  safetyAiCaptureState[key]=value || "";
  if(key==="company")safetyAiCaptureState.branch="";
  safetyAiCaptureState.page=1;
  renderSafetyAiCapturePage();
}

function querySafetyAiCapture(){
  safetyAiCaptureState.projectName=document.getElementById("safetyAiCaptureProjectName")?.value.trim()||"";
  safetyAiCaptureState.date=document.getElementById("safetyAiCaptureDate")?.value||"";
  safetyAiCaptureState.page=1;
  renderSafetyAiCapturePage();
  showToast("查询成功");
}

function setSafetyAiCaptureStat(group,value){
  const key=group==="status"?"statStatus":"statType";
  safetyAiCaptureState[key]=safetyAiCaptureState[key]===value?"":value;
  safetyAiCaptureState.page=1;
  renderSafetyAiCapturePage();
}

function resetSafetyAiCapture(){
  Object.assign(safetyAiCaptureState,{company:"",branch:"",type:"",camera:"",date:"",projectName:"",statStatus:"",statType:"",page:1});
  renderSafetyAiCapturePage();
}

function reviewSafetyAiCapture(id,status){
  const row=safetyAiCaptureRows.find(item=>item.id===Number(id));
  if(!row)return;
  row.status=status;
  renderSafetyAiCapturePage();
  showToast(`抓拍记录已复核为${status}`);
}

function deleteSafetyAiCapture(id){
  const index=safetyAiCaptureRows.findIndex(item=>item.id===Number(id));
  if(index<0)return;
  safetyAiCaptureRows.splice(index,1);
  renderSafetyAiCapturePage();
  showToast("抓拍记录已删除");
}

function renderSafetyAiCaptureBoxes(kind){
  const map={large:`<i class="ai-box b1">人员</i><i class="ai-box b2">车辆</i><i class="ai-box b3">碰撞风险</i>`,person:`<i class="ai-box p1">未戴安全帽</i><i class="ai-box p2">人员</i>`,area:`<i class="ai-box a1">危险区域</i><i class="ai-box a2">人员闯入</i>`,fire:`<i class="ai-box f1">火光</i><i class="ai-box f2">烟雾</i>`};
  return map[kind] || map.large;
}

function renderSafetyAiCaptureActions(row){
  if(row.status==="待确认")return `<button class="ai-action muted" onclick="reviewSafetyAiCapture(${row.id},'无效')">× 无效</button><button class="ai-action primary" onclick="reviewSafetyAiCapture(${row.id},'有效')">✓ 有效</button>`;
  if(row.status==="有效")return `<button class="ai-action muted" onclick="reviewSafetyAiCapture(${row.id},'无效')">× 复核无效</button><button class="ai-action success" onclick="safetyVideoAction('已创建隐患整改任务')">▣ 隐患整改</button><button class="ai-action primary" onclick="safetyVideoAction('已增加项目积分')">▤ 积分增加</button>`;
  return `<button class="ai-action danger" onclick="deleteSafetyAiCapture(${row.id})">× 删除</button><button class="ai-action primary" onclick="reviewSafetyAiCapture(${row.id},'有效')">✓ 复核有效</button>`;
}

function renderSafetyAiCaptureCard(row){
  const statusClass=({"待确认":"pending","有效":"valid","无效":"invalid"})[row.status];
  return `<article class="ai-capture-card"><button type="button" class="ai-capture-image" onclick="openSafetyAiCapturePreview(${row.id})" aria-label="预览${row.type}抓拍图片"><img src="./src/assets/project-log-building.png" alt="${row.type}"/>${renderSafetyAiCaptureBoxes(row.box)}<span class="ai-capture-stamp">AI DETECTION · ${row.time.slice(11)}</span><span class="ai-capture-preview-hint">⌕ 点击预览</span></button><div class="ai-capture-content"><div class="ai-capture-title"><h3>${row.type}</h3><span class="${statusClass}">${row.status}</span><time>${row.time}</time></div><div class="ai-capture-meta"><p>◉ ${row.project} · ${row.camera}<a onclick="safetyVideoAction('已打开实时监控')">观看实时监控</a></p><p>◉ ${row.read}</p></div><div class="ai-capture-actions">${renderSafetyAiCaptureActions(row)}</div></div></article>`;
}

function openSafetyAiCapturePreview(id){
  const row=safetyAiCaptureRows.find(item=>item.id===Number(id));
  if(!row)return;
  const statusClass=({"待确认":"pending","有效":"valid","无效":"invalid"})[row.status];
  openModal("AI抓拍预览",`
    <div class="ai-capture-preview-content">
      <div class="ai-capture-preview-image">
        <img src="./src/assets/project-log-building.png" alt="${row.type}"/>
        ${renderSafetyAiCaptureBoxes(row.box)}
        <span class="ai-capture-stamp">AI DETECTION · ${row.time}</span>
      </div>
      <div class="ai-capture-preview-info">
        <div><h3>${row.type}</h3><span class="${statusClass}">${row.status}</span></div>
        <p>抓拍项目：${row.project}</p>
        <p>摄像头点位：${row.camera}</p>
        <p>抓拍时间：${row.time}</p>
        <p>识别来源：${row.resource}</p>
      </div>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  document.querySelector(".modal")?.classList.add("ai-capture-preview-modal");
}

function renderSafetyAiCaptureStats(stats){
  const item=(group,key,label,value,status="")=>`<div class="construction-project-stat-item ${status} ${safetyAiCaptureState[group==="status"?"statStatus":"statType"]===key?"active":""}" onclick="setSafetyAiCaptureStat('${group}','${key}')"><strong>${value}</strong><span>${label}</span></div>`;
  return renderUnifiedStatsCard(`
    <div class="construction-project-stats ai-capture-standard-stats">
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">复核 状态</div>
        <div class="construction-project-stat-items">
          ${item("status","待确认","待确认",stats.pending,"pending")}
          ${item("status","有效","有效",stats.valid,"valid")}
          ${item("status","无效","无效",stats.invalid,"invalid")}
        </div>
      </div>
      <div class="construction-project-stat-group">
        <div class="construction-project-stat-name">抓拍 类型</div>
        <div class="construction-project-stat-items">
          ${item("type","未带安全帽","未带安全帽",stats.helmet)}
          ${item("type","人机碰撞","人机碰撞",stats.collision)}
          ${item("type","危险区域闯入","危险区域",stats.area)}
          ${item("type","火光识别","火光识别",stats.fire)}
        </div>
      </div>
    </div>
  `);
}

function renderSafetyAiCapturePage(){
  detailPage.style.display="none";
  listPage.style.display="block";
  const rows=getSafetyAiCaptureRows();
  const baseRows=getSafetyAiCaptureBaseRows();
  const count=predicate=>baseRows.filter(predicate).length;
  const stats={pending:count(row=>row.status==="待确认"),valid:count(row=>row.status==="有效"),invalid:count(row=>row.status==="无效"),helmet:count(row=>row.type==="未带安全帽"),collision:count(row=>row.type==="人机碰撞"),area:count(row=>row.type==="危险区域闯入"),fire:count(row=>row.type==="火光识别")};
  const companies=[...new Set(safetyAiCaptureRows.map(row=>row.company))];
  const branches=[...new Set(safetyAiCaptureRows.filter(row=>!safetyAiCaptureState.company||row.company===safetyAiCaptureState.company).map(row=>row.branch))];
  const fields=`
    <div class="form-item"><label>项目名称</label><input id="safetyAiCaptureProjectName" class="input" placeholder="请输入项目名称" value="${escapeAttr(safetyAiCaptureState.projectName)}" onkeydown="if(event.key==='Enter'){event.preventDefault();querySafetyAiCapture()}"/></div>
    <div class="form-item"><label>子公司</label><select class="select" onchange="setSafetyAiCaptureFilter('company',this.value)"><option value="">全部</option>${companies.map(item=>`<option value="${item}" ${item===safetyAiCaptureState.company?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>分公司</label><select class="select" onchange="setSafetyAiCaptureFilter('branch',this.value)"><option value="">全部</option>${branches.map(item=>`<option value="${item}" ${item===safetyAiCaptureState.branch?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>抓拍类型</label><select class="select" onchange="setSafetyAiCaptureFilter('type',this.value)"><option value="">全部</option>${["人机碰撞","未带安全帽","危险区域闯入","火光识别"].map(item=>`<option value="${item}" ${item===safetyAiCaptureState.type?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>摄像头点位</label><select class="select" onchange="setSafetyAiCaptureFilter('camera',this.value)"><option value="">全部</option>${[...new Set(safetyAiCaptureRows.map(row=>row.camera))].map(item=>`<option value="${item}" ${item===safetyAiCaptureState.camera?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>抓拍日期</label><input id="safetyAiCaptureDate" class="input" type="date" value="${safetyAiCaptureState.date}" aria-label="抓拍日期"/></div>
  `;
  listPage.innerHTML=`<div class="safety-ai-capture-page">${renderUnifiedQueryCard(fields,{title:"查询条件",queryFn:"querySafetyAiCapture()",resetFn:"resetSafetyAiCapture()",id:"safetyAiCaptureQueryCard",canCollapse:false})}${renderSafetyAiCaptureStats(stats)}<section class="ai-capture-grid">${rows.map(renderSafetyAiCaptureCard).join("") || `<div class="ai-capture-empty">暂无符合条件的抓拍记录</div>`}</section><div class="ai-capture-pagination"><span>共 ${rows.length} 条</span><div><button disabled>‹</button><button class="active">1</button><button>2</button><button>3</button><button>›</button><select><option>20条/页</option></select></div></div></div>`;
}

function renderRosterPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">劳务工花名册</div>
    </div>

    <section class="card unified-query-card">
      <div class="card-hd">
        <div class="card-title">查询条件</div>
        <div class="actions">
          <button class="btn" onclick="resetFilter()">重置</button>
          <button class="btn primary" onclick="applyFilter()">查询</button>
        </div>
      </div>
      <div class="card-bd">
        <div class="search-grid">
          <div class="form-item">
            <label>姓名</label>
            <input id="fName" class="input" placeholder="请输入姓名"/>
          </div>
          <div class="form-item">
            <label>人员类型</label>
            <select id="fType" class="select">
              <option value="">全部</option>
              <option>管理人员</option>
              <option>劳务工人</option>
              <option>特种作业人员</option>
            </select>
          </div>
          <div class="form-item">
            <label>岗位/工种</label>
            <select id="fJob" class="select">
              <option value="">全部</option>
              <option>钢筋工</option>
              <option>木工</option>
              <option>架子工</option>
              <option>电工</option>
              <option>焊工</option>
            </select>
          </div>
          <div class="form-item">
            <label>分包单位</label>
            <input id="fUnit" class="input" placeholder="请输入分包单位"/>
          </div>
          <div class="form-item">
            <label>项目名称</label>
            <input id="fProject" class="input" placeholder="请输入项目名称"/>
          </div>
          <div class="form-item">
            <label>子公司</label>
            <input id="fSub" class="input" placeholder="请输入子公司"/>
          </div>
          <div class="form-item">
            <label>分公司</label>
            <input id="fBranch" class="input" placeholder="请输入分公司"/>
          </div>
          <div class="form-item">
            <label>性别</label>
            <select id="fGender" class="select">
              <option value="">全部</option>
              <option>男</option>
              <option>女</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <section class="card unified-stats-card roster-stat-card">
      <div class="card-bd">
        <div class="stats" id="statsBox"></div>
      </div>
    </section>

    <section class="card table-card">
      <div class="card-hd">
        <div class="card-title">劳务工清单</div>
        <div class="actions">
          <button class="btn primary" onclick="openWorkerAddModal()">新增劳务工</button>
          <button class="btn" onclick="showToast('已刷新最新劳务工数据')">刷新</button>
          <button class="btn primary" onclick="showToast('导出成功：已生成劳务工花名册.xlsx')">导出</button>
          <button class="column-setting-icon-btn" title="列设置" onclick="openColumnSetting('worker','renderTable')">⚙</button>
        </div>
      </div>

      <div class="table-wrap roster-table-wrap">
        <table id="workerTable" style="min-width:${getTableMinWidth("worker")}px">
          <thead>
            <tr id="workerThead">${renderTableHeaderByColumns("worker")}</tr>
          </thead>
          <tbody id="workerTbody"></tbody>
        </table>
      </div>

      <div class="pagination">
        <span id="totalText">共 0 条</span>
        <span>第 1 / 1 页　每页 50 条</span>
      </div>
    </section>
  `;

  currentList=[...workers];
  activeStat=null;
  renderTable();
}

function renderTable(){
  const table=document.getElementById("workerTable");
  const thead=document.getElementById("workerThead");

  if(table)table.style.minWidth=getTableMinWidth("worker")+"px";
  if(thead)thead.innerHTML=renderTableHeaderByColumns("worker");

  renderTableByColumns("worker",currentList,"workerTbody");

  const total=document.getElementById("totalText");
  if(total)total.innerText=`共 ${currentList.length} 条`;

  renderStats();
}

function renderStats(){
  const box=document.getElementById("statsBox");
  if(!box)return;

  const c=fn=>workers.filter(fn).length;

  const stats=[
    ["进场状态",["已进场",c(w=>w.status==="已进场")],["已退场",c(w=>w.status==="已退场")],"status"],
    ["抽查结果",["合格",c(w=>latestCheck(w)==="合格")],["不合格",c(w=>latestCheck(w)==="不合格")],"check"],
    ["用工合同",["已上传",c(w=>w.contract)],["未上传",c(w=>!w.contract)],"contract"],
    ["安全教育",["已上传",c(w=>w.education)],["未上传",c(w=>!w.education)],"education"],
    ["资质证书",["已上传",c(w=>w.special&&w.cert)],["未上传",c(w=>w.special&&!w.cert)],"cert"]
  ];

  box.innerHTML=stats.map(s=>`
    <div class="stat">
      <div class="stat-name">${s[0]}</div>
      <div class="stat-row">
        <div class="stat-chip ${activeStat?.key===s[3]&&activeStat?.val===s[1][0]?"active":""}" onclick="filterByStat('${s[3]}','${s[1][0]}')">
          <strong>${s[1][1]}</strong>
          <span>${s[1][0]}</span>
        </div>
        <div class="stat-chip ${activeStat?.key===s[3]&&activeStat?.val===s[2][0]?"active":""}" onclick="filterByStat('${s[3]}','${s[2][0]}')">
          <strong>${s[2][1]}</strong>
          <span>${s[2][0]}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function applyFilter(){
  const name=fName.value.trim();
  const type=fType.value;
  const job=fJob.value;
  const unit=fUnit.value.trim();
  const project=fProject.value.trim();
  const sub=fSub.value.trim();
  const branch=fBranch.value.trim();
  const gender=fGender.value;

  currentList=workers.filter(w=>
    (!name||w.name.includes(name))&&
    (!type||w.type===type)&&
    (!job||w.job===job)&&
    (!unit||w.unit.includes(unit))&&
    (!project||(w.project||"").includes(project))&&
    (!sub||(w.sub||"").includes(sub))&&
    (!branch||(w.branch||"").includes(branch))&&
    (!gender||w.gender===gender)
  );

  activeStat=null;
  renderTable();
}

function resetFilter(){
  fName.value="";
  fType.value="";
  fJob.value="";
  fUnit.value="";
  fProject.value="";
  fSub.value="";
  fBranch.value="";
  fGender.value="";
  currentList=[...workers];
  activeStat=null;
  renderTable();
}

function filterByStat(key,val){
  activeStat={key,val};

  currentList=workers.filter(w=>{
    if(key==="status")return w.status===val;
    if(key==="check")return latestCheck(w)===val;
    if(key==="contract")return val==="已上传"?w.contract:!w.contract;
    if(key==="education")return val==="已上传"?w.education:!w.education;
    if(key==="cert")return val==="已上传"?(w.special&&w.cert):(w.special&&!w.cert);
    return true;
  });

  renderTable();
}

function renderWorkerForm(worker={}){
  const projectOptions=constructionProjectData.map(project=>`<option value="${project.projectName}" ${project.projectName===worker.project?"selected":""}>${project.projectName}</option>`).join("");
  const companyOptions=getOrganizationCompanies().map(name=>`<option ${name===worker.sub?"selected":""}>${name}</option>`).join("");
  const branchOptions=getOrganizationBranchOptions(worker.sub || "").map(name=>`<option ${name===worker.branch?"selected":""}>${name}</option>`).join("");
  return `<div class="form-grid-2">
    <div class="form-item"><label>姓名 <span style="color:var(--danger)">*</span></label><input id="workerFormName" class="input" value="${worker.name || ""}"/></div>
    <div class="form-item"><label>手机号</label><input id="workerFormPhone" class="input" value="${worker.phone || ""}" placeholder="请输入手机号"/></div>
    <div class="form-item"><label>性别</label><select id="workerFormGender" class="select">${genderOptions.map(item=>`<option ${item===worker.gender?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>出生日期</label><input id="workerFormBirth" type="month" class="input" value="${worker.birth || ""}"/></div>
    <div class="form-item"><label>人员类型</label><select id="workerFormType" class="select">${["劳务工人","特种作业人员","管理人员"].map(item=>`<option ${item===worker.type?"selected":""}>${item}</option>`).join("")}</select></div>
    <div class="form-item"><label>岗位/工种</label><input id="workerFormJob" class="input" value="${worker.job || ""}" placeholder="如：钢筋工"/></div>
    <div class="form-item"><label>当前项目</label><select id="workerFormProject" class="select"><option value="">请选择项目</option>${projectOptions}</select></div>
    <div class="form-item"><label>子公司</label><select id="workerFormSub" class="select" onchange="syncWorkerBranchOptions()"><option value="">请选择</option>${companyOptions}</select></div>
    <div class="form-item"><label>分公司</label><select id="workerFormBranch" class="select"><option value="">请选择</option>${branchOptions}</select></div>
    <div class="form-item"><label>分包单位</label><input id="workerFormUnit" class="input" value="${worker.unit || ""}"/></div>
    <div class="form-item"><label>所属班组</label><input id="workerFormTeam" class="input" value="${worker.team || ""}"/></div>
    <div class="form-item"><label>进场状态</label><select id="workerFormStatus" class="select">${["已进场","已退场"].map(item=>`<option ${item===(worker.status || "已进场")?"selected":""}>${item}</option>`).join("")}</select></div>
  </div>`;
}

function syncWorkerBranchOptions(){
  const sub=document.getElementById("workerFormSub")?.value || "";
  const branch=document.getElementById("workerFormBranch");
  if(branch)branch.innerHTML=`<option value="">请选择</option>${getOrganizationBranchOptions(sub).map(name=>`<option>${name}</option>`).join("")}`;
}

function openWorkerAddModal(){
  openModal("新增劳务工",renderWorkerForm(),`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveWorker()">保存</button>`,"large");
}

function openWorkerEditModal(id){
  const worker=workers.find(item=>String(item.id)===String(id));
  if(!worker)return;
  openModal("编辑劳务工",renderWorkerForm(worker),`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveWorker(${id})">保存</button>`,"large");
}

function saveWorker(id){
  const name=document.getElementById("workerFormName").value.trim();
  if(!name)return showToast("请输入姓名");
  const birth=document.getElementById("workerFormBirth").value;
  const target=id==null?{id:Date.now(),records:[],violations:[],contract:false,education:false,special:false,cert:false,insurance:false,black:false}:{...workers.find(item=>String(item.id)===String(id))};
  Object.assign(target,{
    name,phone:document.getElementById("workerFormPhone").value.trim(),gender:document.getElementById("workerFormGender").value,birth,
    age:birth?new Date().getFullYear()-Number(birth.slice(0,4)):"-",type:document.getElementById("workerFormType").value,
    job:document.getElementById("workerFormJob").value.trim(),project:document.getElementById("workerFormProject").value,
    sub:document.getElementById("workerFormSub").value,branch:document.getElementById("workerFormBranch").value,
    unit:document.getElementById("workerFormUnit").value.trim(),team:document.getElementById("workerFormTeam").value.trim(),
    status:document.getElementById("workerFormStatus").value,lastInOut:`${new Date().toISOString().slice(0,10)} ${document.getElementById("workerFormStatus").value==="已进场"?"进场":"退场"}`
  });
  if(id==null)workers.unshift(target);else Object.assign(workers.find(item=>String(item.id)===String(id)),target);
  persistMasterData("workers",workers);
  closeModal();
  renderRosterPage();
  showToast(id==null?"劳务工新增成功":"劳务工已保存");
}

function deleteWorker(id){
  const worker=workers.find(item=>String(item.id)===String(id));
  if(!worker||!confirm(`确认删除劳务工：${worker.name}？`))return;
  workers=workers.filter(item=>String(item.id)!==String(id));
  persistMasterData("workers",workers);
  renderRosterPage();
  showToast("劳务工已删除");
}

