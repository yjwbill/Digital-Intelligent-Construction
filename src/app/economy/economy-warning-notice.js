/* 经济预警 / 预警通知：诊断后生成短信并支持批量、单个发送 */
const economyWarningNoticeState={phone:"",name:"",department:"",post:"",source:"",status:"",selected:[]};
let economyWarningNoticeRows=[];
function generateEconomyWarningNoticeBatch(){
  if(economyWarningNoticeRows.length)return;
  const source="202607期诊断";
  const preview="【数智施工】经济风险月度检验单（26年07月）【隧道股份】经济风险预警，请相关负责人及时处理。";
  const seed=[
    ["13816046044","楼微微","机场建设工程公司","分公司经济审核岗"],["admin","超级管理员","隧道股份","管理员"],["13564675397","邓慧","上海隧道","子公司经济审核岗"],["13333333333","数据验证和结果","隧道股份","管理员"],["18616616660","陈荣辉","地结公司","管理员"],["18817677387","陈学","道桥公司","管理员"],["13921136334","马超","地结公司","分公司经济审核岗"],["15821711001","杨程民","交环公司","管理员"],["18602110320","沈君华","隧道股份","股份领导岗"],["19900009999","数字集团运维","隧道股份","数字集团运维岗"],["13611986456","晏军钧","市政集团","子公司生产项目岗"],["15380844694","黄涛","江苏分公司","分公司项目数据岗"],["13601697743","钱峰","道路工程公司","分公司材料岗"],["13764214462","姚泓","道桥公司","管理员"],["15601837339","李传军","地结公司","分公司经济审核岗"]
  ];
  economyWarningNoticeRows=seed.map((item,index)=>({id:`economy-notice-${index+1}`,phone:item[0],name:item[1],department:item[2],post:item[3],source,preview,status:index===8?"已发送":"待发送",sendTime:index===8?"2026-07-06 10:22:24":""}));
}
function getEconomyWarningNoticeFiltered(){
  return economyWarningNoticeRows.filter(row=>(!economyWarningNoticeState.phone||row.phone.includes(economyWarningNoticeState.phone))&&(!economyWarningNoticeState.name||row.name.includes(economyWarningNoticeState.name))&&(!economyWarningNoticeState.department||row.department===economyWarningNoticeState.department)&&(!economyWarningNoticeState.post||row.post===economyWarningNoticeState.post)&&(!economyWarningNoticeState.source||row.source===economyWarningNoticeState.source)&&(!economyWarningNoticeState.status||row.status===economyWarningNoticeState.status));
}
function setEconomyWarningNoticeFilter(key,value){economyWarningNoticeState[key]=String(value||"").trim();renderEconomyWarningNoticePage();}
function resetEconomyWarningNoticeFilters(){Object.assign(economyWarningNoticeState,{phone:"",name:"",department:"",post:"",source:"",status:"",selected:[]});renderEconomyWarningNoticePage();}
function toggleEconomyWarningNoticeSelection(id,checked){
  const selected=new Set(economyWarningNoticeState.selected);
  checked?selected.add(id):selected.delete(id);
  economyWarningNoticeState.selected=[...selected];
  const bulk=document.getElementById("economyWarningNoticeBulkSend");
  const del=document.getElementById("economyWarningNoticeBulkDelete");
  if(bulk)bulk.disabled=!economyWarningNoticeState.selected.length;
  if(del)del.disabled=!economyWarningNoticeState.selected.length;
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
  listPage.innerHTML=StandardList.render({variant:"table",className:"economy-warning-notice-page-shell",titleHtml:`<div class="compact-title-row"><div class="module-title">经济预警 / 预警通知</div></div>`,contentHtml:`<section class="economy-warning-notice-page"><section class="card unified-query-card economy-warning-notice-query"><div class="card-bd"><div class="search-grid economy-warning-notice-search"><div class="form-item"><label>手机号码</label><input class="input" id="economyNoticePhone" placeholder="输入手机号码" value="${escapeAttr(economyWarningNoticeState.phone)}"></div><div class="form-item"><label>姓名</label><input class="input" id="economyNoticeName" placeholder="输入姓名" value="${escapeAttr(economyWarningNoticeState.name)}"></div><div class="form-item"><label>所属部门</label><select class="select" id="economyNoticeDepartment"><option value="">请选择部门</option>${departments.map(item=>`<option ${item===economyWarningNoticeState.department?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>岗位</label><select class="select" id="economyNoticePost"><option value="">请选择岗位</option>${posts.map(item=>`<option ${item===economyWarningNoticeState.post?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>创建来源</label><select class="select" id="economyNoticeSource"><option value="">请选择创建来源</option>${sources.map(item=>`<option ${item===economyWarningNoticeState.source?"selected":""}>${escapeAttr(item)}</option>`).join("")}</select></div><div class="form-item"><label>发送状态</label><select class="select" id="economyNoticeStatus"><option value="">请选择发送状态</option>${["待发送","已发送"].map(item=>`<option ${item===economyWarningNoticeState.status?"selected":""}>${item}</option>`).join("")}</select></div><div class="form-item economy-warning-notice-query-actions"><button class="btn primary" onclick="setEconomyWarningNoticeFilter('phone',document.getElementById('economyNoticePhone').value);economyWarningNoticeState.name=document.getElementById('economyNoticeName').value;economyWarningNoticeState.department=document.getElementById('economyNoticeDepartment').value;economyWarningNoticeState.post=document.getElementById('economyNoticePost').value;economyWarningNoticeState.source=document.getElementById('economyNoticeSource').value;economyWarningNoticeState.status=document.getElementById('economyNoticeStatus').value;renderEconomyWarningNoticePage()">查询</button><button class="btn" onclick="resetEconomyWarningNoticeFilters()">重置</button></div></div></div></section><section class="card table-card economy-warning-notice-table-card"><div class="card-hd"><div class="actions"><button id="economyWarningNoticeBulkSend" class="btn primary" disabled onclick="batchSendEconomyWarningNotices()">批量发送</button><button id="economyWarningNoticeBulkDelete" class="btn danger" disabled onclick="batchDeleteEconomyWarningNotices()">批量删除</button></div></div><div class="table-wrap roster-table-wrap"><table><thead><tr><th style="width:52px;text-align:center"><input type="checkbox" aria-label="全选预警通知" onchange="toggleAllEconomyWarningNoticeSelection(this.checked)"></th><th style="width:70px;text-align:center">序号</th><th style="width:170px">手机号</th><th style="width:150px">姓名</th><th style="width:190px">所属部门</th><th style="width:290px">岗位</th><th style="width:180px">创建来源</th><th style="min-width:520px">短信预览</th><th style="width:130px;text-align:center">发送状态</th><th style="width:125px;text-align:center">操作</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td style="text-align:center"><input type="checkbox" aria-label="选择${escapeAttr(row.name)}" ${economyWarningNoticeState.selected.includes(row.id)?"checked":""} onchange="toggleEconomyWarningNoticeSelection('${row.id}',this.checked)"></td><td style="text-align:center">${index+1}</td><td>${escapeAttr(row.phone)}</td><td>${escapeAttr(row.name)}</td><td>${escapeAttr(row.department)}</td><td class="economy-warning-notice-ellipsis" title="${escapeAttr(row.post)}">${escapeAttr(row.post)}</td><td>${escapeAttr(row.source)}</td><td class="economy-warning-notice-ellipsis" title="${escapeAttr(row.preview)}">${escapeAttr(row.preview)}</td><td style="text-align:center">${messageStatusTag(row.status)}</td><td class="economy-warning-notice-actions">${row.status!=="已发送"?`<button class="link" onclick="sendEconomyWarningNotice('${row.id}')">发送</button>`:""}<button class="link danger-link" onclick="batchDeleteEconomyWarningNoticesById('${row.id}')">删除</button></td></tr>`).join("")||`<tr><td colspan="10" class="center">暂无预警通知</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section></section>`});
}
function batchDeleteEconomyWarningNoticesById(id){economyWarningNoticeRows=economyWarningNoticeRows.filter(row=>row.id!==id);economyWarningNoticeState.selected=economyWarningNoticeState.selected.filter(item=>item!==id);renderEconomyWarningNoticePage();showToast("预警通知已删除");}
