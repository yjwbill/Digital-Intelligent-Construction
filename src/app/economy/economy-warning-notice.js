/* 经济预警 / 预警通知：诊断后生成短信并支持批量、单个发送 */
const economyWarningNoticeState={phone:"",name:"",department:"",post:"",diagnosisPeriod:"",source:"",status:"",selected:[]};
let economyWarningNoticeRows=[];
function generateEconomyWarningNoticeBatch(){
  if(economyWarningNoticeRows.length)return;
  const diagnosisPeriod="202607";
  const sourceOptions=["项目完整度提醒","公司完整度提醒","诊断结果"];
  const preview="【数智施工】经济风险月度检验单（26年07月）【隧道股份】经济风险预警，请相关负责人及时处理。";
  const seed=[
    ["13816046044","楼微微","机场建设工程公司","分公司经济审核岗"],["admin","超级管理员","隧道股份","管理员"],["13564675397","邓慧","上海隧道","子公司经济审核岗"],["13333333333","数据验证和结果","隧道股份","管理员"],["18616616660","陈荣辉","地结公司","管理员"],["18817677387","陈学","道桥公司","管理员"],["13921136334","马超","地结公司","分公司经济审核岗"],["15821711001","杨程民","交环公司","管理员"],["18602110320","沈君华","隧道股份","股份领导岗"],["19900009999","数字集团运维","隧道股份","数字集团运维岗"],["13611986456","晏军钧","市政集团","子公司生产项目岗"],["15380844694","黄涛","江苏分公司","分公司项目数据岗"],["13601697743","钱峰","道路工程公司","分公司材料岗"],["13764214462","姚泓","道桥公司","管理员"],["15601837339","李传军","地结公司","分公司经济审核岗"]
  ];
  economyWarningNoticeRows=seed.map((item,index)=>({id:`economy-notice-${index+1}`,phone:item[0],name:item[1],department:item[2],post:item[3],diagnosisPeriod,source:sourceOptions[index%sourceOptions.length],preview,status:index===8?"已发送":"待发送",sendTime:index===8?"2026-07-06 10:22:24":""}));
}
function getEconomyWarningNoticeFiltered(){
  return economyWarningNoticeRows.filter(row=>(!economyWarningNoticeState.phone||row.phone.includes(economyWarningNoticeState.phone))&&(!economyWarningNoticeState.name||row.name.includes(economyWarningNoticeState.name))&&(!economyWarningNoticeState.department||row.department===economyWarningNoticeState.department)&&(!economyWarningNoticeState.post||row.post===economyWarningNoticeState.post)&&(!economyWarningNoticeState.diagnosisPeriod||row.diagnosisPeriod===economyWarningNoticeState.diagnosisPeriod)&&(!economyWarningNoticeState.source||row.source===economyWarningNoticeState.source)&&(!economyWarningNoticeState.status||row.status===economyWarningNoticeState.status));
}
function setEconomyWarningNoticeFilter(key,value){economyWarningNoticeState[key]=String(value||"").trim();renderEconomyWarningNoticePage();}
function resetEconomyWarningNoticeFilters(){Object.assign(economyWarningNoticeState,{phone:"",name:"",department:"",post:"",diagnosisPeriod:"",source:"",status:"",selected:[]});renderEconomyWarningNoticePage();}
function queryEconomyWarningNoticeFilters(){economyWarningNoticeState.phone=document.getElementById("economyNoticePhone")?.value.trim()||"";economyWarningNoticeState.name=document.getElementById("economyNoticeName")?.value.trim()||"";economyWarningNoticeState.department=document.getElementById("economyNoticeDepartment")?.value||"";economyWarningNoticeState.post=document.getElementById("economyNoticePost")?.value||"";economyWarningNoticeState.diagnosisPeriod=document.getElementById("economyNoticeDiagnosisPeriod")?.value||"";economyWarningNoticeState.source=document.getElementById("economyNoticeSource")?.value||"";economyWarningNoticeState.status=document.getElementById("economyNoticeStatus")?.value||"";renderEconomyWarningNoticePage();}
function toggleEconomyWarningNoticeSelection(id,checked){
  const selected=new Set(economyWarningNoticeState.selected);
  checked?selected.add(id):selected.delete(id);
  economyWarningNoticeState.selected=[...selected];
  const bulk=document.getElementById("economyWarningNoticeBulkSend");
  if(bulk)bulk.disabled=!economyWarningNoticeState.selected.length;
}
function toggleAllEconomyWarningNoticeSelection(checked){
  economyWarningNoticeState.selected=checked?getEconomyWarningNoticeFiltered().map(row=>row.id):[];
  renderEconomyWarningNoticePage();
}
function sendEconomyWarningNotice(id){
  const row=economyWarningNoticeRows.find(item=>item.id===id); if(!row)return;
  row.status="已发送";row.sendTime=new Date().toISOString().slice(0,19).replace("T"," ");
  renderEconomyWarningNoticePage();showToast(`已向 ${row.name} 发送预警短信`);
}
function batchSendEconomyWarningNotices(){
  const selected=new Set(economyWarningNoticeState.selected);if(!selected.size)return showToast("请先选择待发送记录");
  const count=economyWarningNoticeRows.filter(row=>selected.has(row.id)&&row.status!=="已发送").length;
  economyWarningNoticeRows.forEach(row=>{if(selected.has(row.id)){row.status="已发送";row.sendTime=new Date().toISOString().slice(0,19).replace("T"," ");}});
  economyWarningNoticeState.selected=[];renderEconomyWarningNoticePage();showToast(`已批量发送 ${count} 条预警短信`);
}
function batchDeleteEconomyWarningNotices(){
  const selected=new Set(economyWarningNoticeState.selected);if(!selected.size)return showToast("请先选择记录");
  economyWarningNoticeRows=economyWarningNoticeRows.filter(row=>!selected.has(row.id));economyWarningNoticeState.selected=[];renderEconomyWarningNoticePage();showToast("已删除选中的预警通知");
}
function renderEconomyWarningNoticePage(){
  generateEconomyWarningNoticeBatch();
  const listPage=document.getElementById("listPage");if(!listPage)return;
  const rows=getEconomyWarningNoticeFiltered();
  const departments=[...new Set(economyWarningNoticeRows.map(row=>row.department))];
  const posts=[...new Set(economyWarningNoticeRows.map(row=>row.post))];
  const sources=[...new Set(economyWarningNoticeRows.map(row=>row.source))];
  const diagnosisPeriods=[...new Set(economyWarningNoticeRows.map(row=>row.diagnosisPeriod))];
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-warning-notice-page-shell",titleHtml:`<div class="compact-title-row"><div class="module-title">经济预警 / 预警通知</div></div>`,contentHtml:`<section class="economy-warning-notice-page"><section class="card unified-query-card economy-warning-notice-query"><div class="card-hd"><div class="card-title">查询条件</div><div class="actions"><button class="btn" onclick="resetEconomyWarningNoticeFilters()">重置</button><button class="btn primary" onclick="queryEconomyWarningNoticeFilters()">查询</button></div></div><div class="card-bd"><div class="search-grid economy-warning-notice-search"><div class="form-item"><label>手机号码</label><input class="input" id="economyNoticePhone" placeholder="输入手机号码" value="${escapeAttr(economyWarningNoticeState.phone)}"></div><div class="form-item"><label>姓名</label><input class="input" id="economyNoticeName" placeholder="输入姓名" value="${escapeAttr(economyWarningNoticeState.name)}"></div><div class="form-item"><label>所属部门</label><select class="select" id="economyNoticeDepartment"><option value="">请选择部门</option>${departments.map(item=>`<option ${item===economyWarningNoticeState.department?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>岗位</label><select class="select" id="economyNoticePost"><option value="">请选择岗位</option>${posts.map(item=>`<option ${item===economyWarningNoticeState.post?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>诊断期数</label><select class="select" id="economyNoticeDiagnosisPeriod"><option value="">请选择诊断期数</option>${diagnosisPeriods.map(item=>`<option ${item===economyWarningNoticeState.diagnosisPeriod?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>创建来源</label><select class="select" id="economyNoticeSource"><option value="">请选择创建来源</option>${sources.map(item=>`<option ${item===economyWarningNoticeState.source?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>发送状态</label><select class="select" id="economyNoticeStatus"><option value="">请选择发送状态</option>${["待发送","已发送"].map(item=>`<option ${item===economyWarningNoticeState.status?"selected":""}>${item}</option>`).join("")}</select></div></div></div></section><section class="card table-card economy-warning-notice-table-card"><div class="card-hd"><div class="card-title">预警通知列表</div><div class="actions"><button id="economyWarningNoticeBulkSend" class="btn primary" disabled onclick="batchSendEconomyWarningNotices()">批量发送</button></div></div><div class="table-wrap roster-table-wrap"><table><thead><tr><th style="width:40px;text-align:center"><input type="checkbox" aria-label="全选预警通知" onchange="toggleAllEconomyWarningNoticeSelection(this.checked)"></th><th style="width:40px;text-align:center">序号</th><th style="width:80px;text-align:center">手机号</th><th style="width:90px;text-align:center">姓名</th><th style="width:170px">所属部门</th><th style="width:180px">岗位</th><th style="width:90px;text-align:center">诊断期数</th><th style="width:120px">创建来源</th><th style="width:360px">短信预览</th><th style="width:100px;text-align:center">发送状态</th><th style="width:100px;text-align:center">操作</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td><input type="checkbox" aria-label="选择${escapeAttr(row.name)}" ${economyWarningNoticeState.selected.includes(row.id)?"checked":""} onchange="toggleEconomyWarningNoticeSelection('${row.id}',this.checked)"></td><td>${index+1}</td><td>${escapeAttr(row.phone)}</td><td style="text-align:center">${escapeAttr(row.name)}</td><td>${escapeAttr(row.department)}</td><td class="economy-warning-notice-ellipsis" title="${escapeAttr(row.post)}">${tag(row.post,"gray")}</td><td style="text-align:center">${escapeAttr(row.diagnosisPeriod||"-")}</td><td style="text-align:center">${tag(row.source,"blue")}</td><td class="economy-warning-notice-ellipsis" title="${escapeAttr(row.preview)}">${escapeAttr(row.preview)}</td><td>${messageStatusTag(row.status)}</td><td class="economy-warning-notice-actions"><button class="link" onclick="sendEconomyWarningNotice('${row.id}')">${row.status==="已发送"?"重发":"发送"}</button></td></tr>`).join("")||`<tr><td colspan="11" class="center">暂无预警通知</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section></section>`});
  const columns=[
    {key:"select",title:"选择",width:40,minWidth:40,align:"center"},
    {key:"sequence",title:"序号",width:60,minWidth:40,align:"center"},
    {key:"phone",title:"手机号",width:100,minWidth:80,align:"center"},
    {key:"name",title:"姓名",width:90,minWidth:90,align:"center"},
    {key:"department",title:"所属部门",width:170,align:"left"},
    {key:"post",title:"岗位",width:180,align:"center"},
    {key:"diagnosisPeriod",title:"诊断期数",width:90,minWidth:60,align:"center"},
    {key:"source",title:"创建来源",width:110,minWidth:60,align:"center"},
    {key:"preview",title:"短信预览",width:360,align:"left"},
    {key:"status",title:"发送状态",width:90,minWidth:60,align:"center"},
    {key:"operation",title:"操作",width:100,minWidth:100,align:"center"}
  ];
  migrateEconomyWarningNoticeColumns(columns);
  mountEconomyCustomColumnSettingButton("warningNotice",columns,".economy-warning-notice-table-card",".economy-warning-notice-table-card table","renderEconomyWarningNoticePage");
  const appliedColumns=getEconomyCustomColumnConfig("warningNotice",columns).sort((a,b)=>a.order-b.order);
  applyEconomyWarningNoticeColumnLayout(appliedColumns);
}
function migrateEconomyWarningNoticeColumns(columns){
  const storageKey=getEconomyCustomColumnStorageKey("warningNotice");
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||localStorage.getItem("ECONOMY_COLUMN_SETTINGS_V1_warningNotice")||"null");
    if(!Array.isArray(saved))return;
    const oldKeys=["select","sequence","phone","name","diagnosisPeriod","department","post","source","preview","status","operation"];
    const defaults=normalizeEconomyCustomColumns(columns);
    if(saved.every(item=>typeof item==="number")){
      localStorage.setItem(storageKey,JSON.stringify(defaults.map(column=>({...column,visible:column.key==="operation"||saved.includes(oldKeys.indexOf(column.key))}))));
      return;
    }
    const period=saved.find(column=>column.key==="diagnosisPeriod"||(!column.key&&Number(column.index)===4));
    if(!period||Number(period.index)===6)return;
    // 更新旧布局的期数位置和默认宽度，保留其他字段的自定义设置。
    const migrated=saved.map(column=>{
      const key=column.key||oldKeys[Number(column.index)];
      return {...column,key,index:columns.findIndex(item=>item.key===key)};
    }).filter(column=>column.index>=0).sort((a,b)=>Number(a.order)-Number(b.order));
    const periodIndex=migrated.findIndex(column=>column.key==="diagnosisPeriod");
    const [diagnosisPeriod]=migrated.splice(periodIndex,1);
    if(Number(diagnosisPeriod.width)===100)diagnosisPeriod.width=90;
    const sourceIndex=migrated.findIndex(column=>column.key==="source");
    migrated.splice(sourceIndex<0?Math.min(6,migrated.length):sourceIndex,0,diagnosisPeriod);
    localStorage.setItem(storageKey,JSON.stringify(migrated.map((column,index)=>({...column,order:index+1}))));
  }catch(error){}
}
function applyEconomyWarningNoticeColumnLayout(columns){
  const table=document.querySelector(".economy-warning-notice-table-card table");
  if(!table)return;
  const widths=columns.map(column=>Number(column.width)||120);
  const total=columns.reduce((sum,column,index)=>sum+(column.visible===false?0:widths[index]),0);
  table.style.setProperty("width",`${total}px`,"important");
  table.style.setProperty("min-width",`${total}px`,"important");
  table.style.setProperty("max-width",`${total}px`,"important");
  [...table.rows].filter(row=>row.cells.length===columns.length).forEach(row=>[...row.cells].forEach((cell,index)=>{
    const column=columns[index],width=widths[index];
    if(!column||!width)return;
    cell.style.setProperty("display",column.visible===false?"none":"table-cell","important");
    cell.style.setProperty("width",`${width}px`,"important");
    cell.style.setProperty("min-width",`${width}px`,"important");
    cell.style.setProperty("max-width",`${width}px`,"important");
    cell.style.setProperty("text-align",column.align||"left","important");
  }));
}
function batchDeleteEconomyWarningNoticesById(id){economyWarningNoticeRows=economyWarningNoticeRows.filter(row=>row.id!==id);economyWarningNoticeState.selected=economyWarningNoticeState.selected.filter(item=>item!==id);renderEconomyWarningNoticePage();showToast("预警通知已删除");}



