/* 经济管理 / 经济预警 / 规则设置 */
const economyWarningRuleState={tab:"primary",primaryKey:"contract",secondaryKey:"steelpipe"};
const economyWarningPrimaryRules=[
  {key:"contract",name:"分包分供等合同预警",rules:[
    {id:"ContractWarning_1",name:"合同个数预警",type:"分包分供等合同预警",remark:"合同个数-劳务*1 or 合同个数-专业*1=黄",enabled:true},
    {id:"ContractWarning_2",name:"合同额度预警",type:"分包分供等合同预警",remark:"合同额度预警*2=红",enabled:true}
  ]},
  {key:"loss",name:"潜亏预警",rules:[]},
  {key:"settlement",name:"总包结算预警",rules:[]},
  {key:"arrears",name:"业主拖欠款预警",rules:[]}
];
const economyWarningSecondaryRules=[
  {key:"steelpipe",name:"主材超领预警（钢管）",parent:"分包分供等合同预警",rules:[
    {id:"Steelpipe_requisition_1",name:"钢管超控制标准领用",type:"主材超领预警（钢管）",remark:"",enabled:true},
    {id:"Steelpipe_requisition_2",name:"钢管超控制标准领用",type:"主材超领预警（钢管）",remark:"",enabled:true}
  ]},
  {key:"contract-amount",name:"合同额度预警",parent:"分包分供等合同预警",rules:[]},
  {key:"contract-count-labor",name:"合同个数预警-劳务",parent:"分包分供等合同预警",rules:[]},
  {key:"contract-count-specialty",name:"合同个数预警-专业",parent:"分包分供等合同预警",rules:[]},
  {key:"fund-inventory-margin",name:"资金存货目标利润率关联预警",parent:"潜亏预警",rules:[]},
  {key:"subcontract-output",name:"分包商产值计量预警",parent:"分包分供等合同预警",rules:[]},
  {key:"rebar",name:"主材超领预警（钢材）",parent:"分包分供等合同预警",rules:[]},
  {key:"concrete",name:"主材超领预警（砼）",parent:"分包分供等合同预警",rules:[]},
  {key:"project-management-fee",name:"项目管理费预警",parent:"潜亏预警",rules:[]},
  {key:"solar-panel",name:"主材超领预警（光伏板）",parent:"分包分供等合同预警",rules:[]},
  {key:"cement",name:"主材超领预警（水泥）",parent:"分包分供等合同预警",rules:[]},
  {key:"vat-burden",name:"增值税税负预警",parent:"潜亏预警",rules:[]},
  {key:"schedule-abnormal",name:"工期异常预警",parent:"总包结算预警",rules:[]},
  {key:"labor-abnormal",name:"劳务工异常预警",parent:"分包分供等合同预警",rules:[]},
  {key:"reported-settlement",name:"上报结算价预警",parent:"总包结算预警",rules:[]},
  {key:"loss-margin",name:"目标利润率预警",parent:"潜亏预警",rules:[]}
];
function escapeEconomyRuleText(value){
  return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[char]));
}
function getEconomyWarningRuleGroups(){
  return economyWarningRuleState.tab==="primary"?economyWarningPrimaryRules:economyWarningSecondaryRules;
}
function getSelectedEconomyWarningRuleGroup(){
  const key=economyWarningRuleState.tab==="primary"?economyWarningRuleState.primaryKey:economyWarningRuleState.secondaryKey;
  return getEconomyWarningRuleGroups().find(item=>item.key===key)||getEconomyWarningRuleGroups()[0];
}
function getEconomyWarningRuleTotal(tab){
  const groups=tab==="primary"?economyWarningPrimaryRules:economyWarningSecondaryRules;
  return groups.reduce((total,item)=>total+item.rules.length,0)+(tab==="primary"?31:71);
}
function setEconomyWarningRuleTab(tab){
  economyWarningRuleState.tab=tab==="secondary"?"secondary":"primary";
  renderEconomyWarningRuleSettingsPage();
}
function selectEconomyWarningRuleGroup(key){
  if(economyWarningRuleState.tab==="primary")economyWarningRuleState.primaryKey=key;
  else economyWarningRuleState.secondaryKey=key;
  renderEconomyWarningRuleSettingsPage();
}
function toggleEconomyWarningRule(ruleId){
  const group=getSelectedEconomyWarningRuleGroup();
  const rule=group?.rules.find(item=>item.id===ruleId);
  if(rule)rule.enabled=!rule.enabled;
  renderEconomyWarningRuleSettingsPage();
}
function openEconomyWarningRuleEditor(mode,ruleId=""){
  const group=getSelectedEconomyWarningRuleGroup();
  const rule=group?.rules.find(item=>item.id===ruleId);
  if(mode==="edit"&&economyWarningRuleState.tab==="secondary"){
    renderEconomyWarningRuleMaintenancePage(ruleId);
    return;
  }
  const title=mode==="edit"?"编辑预警规则":"新建一级指标";
  openModal(title,`<div class="economy-rule-modal-form">
    <label>规则编号<input class="input" value="${escapeEconomyRuleText(rule?.id||"")}" placeholder="请输入规则编号"></label>
    <label>规则名称<input class="input" value="${escapeEconomyRuleText(rule?.name||group?.name||"")}" placeholder="请输入规则名称"></label>
    <label>预警类型<select class="select"><option>${escapeEconomyRuleText(group?.name||"")}</option></select></label>
    <label>备注<textarea class="input" rows="4" placeholder="请输入规则说明">${escapeEconomyRuleText(rule?.remark||"")}</textarea></label>
  </div>`, `<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="closeModal();showToast('规则已保存')">保存</button>`,"large");
}
const economyMaintenanceState={ruleId:"",conditionRows:[
  ["进度钢管用量比","大于","1"],
  ["进度钢管理论用量（吨）","大于","0"],
  ["开累产值占总包含同价比例","大于","0.3"],
  ["总包含合同含税价（元）","大于","0"]
]};
function getEconomyMaintenanceRule(ruleId){
  return economyWarningSecondaryRules.flatMap(group=>group.rules).find(rule=>rule.id===ruleId)||economyWarningSecondaryRules[0].rules[0];
}
function renderEconomyMaintenanceTokenSelect(id,labels){
  return `<div class="economy-maintenance-select">${renderMessageRouteMultiSelect(id,labels,labels,{placeholder:"请选择"})}</div>`;
}
function toggleEconomyMaintenanceSelect(id){
  const box=document.getElementById(id); if(!box)return;
  const dropdown=box.querySelector(".base-multi-select__dropdown");
  const open=dropdown?.style.display!=="none";
  document.querySelectorAll(".economy-maintenance-select .base-multi-select__dropdown").forEach(item=>{item.style.display="none";item.closest(".base-multi-select")?.classList.remove("is-open");});
  if(!open&&dropdown){dropdown.style.display="block";box.classList.add("is-open");}
}
function addEconomyMaintenanceCondition(){
  economyMaintenanceState.conditionRows.push(["统计指标","大于","0"]);
  renderEconomyWarningRuleMaintenancePage(economyMaintenanceState.ruleId);
}
function removeEconomyMaintenanceCondition(index){
  economyMaintenanceState.conditionRows.splice(index,1);
  renderEconomyWarningRuleMaintenancePage(economyMaintenanceState.ruleId);
}
function backEconomyWarningRuleSettings(){renderEconomyWarningRuleSettingsPage();}
function saveEconomyWarningRuleMaintenance(){showToast("二级预警规则已保存");renderEconomyWarningRuleSettingsPage();}
function renderEconomyMaintenanceSingle(id,options,selected){
  return renderMessageRouteSingleSelect(id,options,{selectedValue:selected||options[0],ariaLabel:id});
}
function renderEconomyWarningRuleMaintenancePage(ruleId=""){
  const listPage=document.getElementById("listPage");
  if(!listPage)return;
  const rule=getEconomyMaintenanceRule(ruleId);
  economyMaintenanceState.ruleId=rule?.id||ruleId;
  listPage.innerHTML=`<section class="economy-warning-maintenance-page">
    <div class="card economy-maintenance-head"><div class="economy-maintenance-title"><button type="button" class="economy-maintenance-back" onclick="backEconomyWarningRuleSettings()" aria-label="返回">←</button><strong>二级指标预警</strong></div><div class="actions"><button class="btn primary" onclick="saveEconomyWarningRuleMaintenance()">保存</button><button class="btn" onclick="backEconomyWarningRuleSettings()">取消</button></div></div>
    <section class="card economy-maintenance-basic"><h2 class="economy-maintenance-section-title">基础信息</h2><div class="economy-maintenance-basic-grid"><label><span>预警编号：<em>*</em></span><input class="input" value="${escapeEconomyRuleText(rule?.id||"")}"></label><label><span>预警名称：<em>*</em></span><input class="input" value="${escapeEconomyRuleText(rule?.name||"")}"></label><label><span>备注：</span><textarea class="input" placeholder="请输入备注">${escapeEconomyRuleText(rule?.remark||"")}</textarea></label></div></section>
    <section class="card economy-maintenance-detail"><h2 class="economy-maintenance-section-title">规则明细</h2><div class="economy-maintenance-prerequisite"><div class="economy-maintenance-ribbon">项目<br>前置<br>条件</div><div class="economy-maintenance-prerequisite-fields"><div class="economy-maintenance-field"><span>项目管理模式：</span>${renderEconomyMaintenanceSingle("maintenanceProjectModeOperator",["包含","不包含"],"包含")}${renderEconomyMaintenanceTokenSelect("maintenanceProjectMode",["全部项目","自营不垫资","自营垫资","合作不垫资","合作垫资"])}</div><div class="economy-maintenance-field"><span>项目状态：</span>${renderEconomyMaintenanceSingle("maintenanceProjectStatusOperator",["包含","不包含"],"包含")}${renderEconomyMaintenanceTokenSelect("maintenanceProjectStatus",["待建","在建","停工","完工"])}</div><div class="economy-maintenance-field"><span>是否投资项目：</span>${renderEconomyMaintenanceSingle("maintenanceInvestmentOperator",["包含","不包含"],"包含")}${renderEconomyMaintenanceTokenSelect("maintenanceInvestment",["是","否"])}</div></div></div><button class="economy-maintenance-add-detail" type="button" onclick="showToast('已新增规则明细')">⊕ 新增规则明细</button><div class="economy-maintenance-rule-grid"><div class="economy-maintenance-condition-panel"><div class="economy-maintenance-panel-head"><strong>经济指标条件</strong><button type="button" onclick="addEconomyMaintenanceCondition()">＋新增指标条件</button></div><div class="economy-maintenance-condition-rows">${economyMaintenanceState.conditionRows.map((row,index)=>`<div class="economy-maintenance-condition-row">${renderEconomyMaintenanceSingle(`maintenanceMetric${index}`,[row[0],"项目管理费","目标利润率"],row[0])}${renderEconomyMaintenanceSingle(`maintenanceOperator${index}`,["大于","大于等于","小于","小于等于","等于"],row[1])}<input class="input" value="${escapeEconomyRuleText(row[2])}"><button type="button" class="economy-maintenance-circle-btn" aria-label="新增条件">＋</button><button type="button" class="economy-maintenance-delete-btn" aria-label="删除条件" onclick="removeEconomyMaintenanceCondition(${index})">▣</button></div>`).join("")}</div></div><div class="economy-maintenance-trigger-panel"><div class="economy-maintenance-panel-head"><strong>触发后</strong><button type="button" class="economy-maintenance-delete-detail" aria-label="删除规则明细">▢</button></div><div class="economy-maintenance-trigger-form"><label>预警等级：<em>*</em><span class="economy-maintenance-radio"><input type="radio" checked name="maintenanceLevel">一颗雷</span><span class="economy-maintenance-radio"><input type="radio" name="maintenanceLevel">两颗雷</span></label><label>预警控制：<em>*</em><span class="economy-maintenance-radio"><input type="radio" checked name="maintenanceControl">触发即报警</span><span class="economy-maintenance-radio"><input type="radio" name="maintenanceControl">连续</span><input class="input compact" value="1">${renderEconomyMaintenanceSingle("maintenanceUnit",["月","周","日"],"月")}<b>满足条件报警</b></label><label>预警内容：<em>*</em><input class="input" value="${escapeEconomyRuleText(rule?.name||"")}"></label><label>权重值：<em>*</em><input class="input" value="10"></label><label>统计指标：<em>*</em>${renderEconomyMaintenanceSingle("maintenanceStatistic",["开累产值占总包含同价比例","进度钢管用量比","总包含合同含税价（元）"],"开累产值占总包含同价比例")}</label></div></div></div></section>
  </section>`;
}
function deleteEconomyWarningRule(ruleId){
  const group=getSelectedEconomyWarningRuleGroup();
  const index=group?.rules.findIndex(item=>item.id===ruleId);
  if(index<0)return;
  if(!confirm("确认删除这条预警规则？"))return;
  group.rules.splice(index,1);
  renderEconomyWarningRuleSettingsPage();
  showToast("规则已删除");
}
function renderEconomyWarningRuleTable(group){
  const rows=group?.rules||[];
  if(!rows.length)return `<div class="economy-rule-empty">暂无规则</div>`;
  return `<div class="economy-rule-table-wrap"><table class="economy-rule-table"><colgroup><col style="width:48px"><col style="width:82px"><col style="width:205px"><col style="width:220px"><col style="width:220px"><col style="width:160px"><col><col style="width:130px"></colgroup><thead><tr><th><input type="checkbox" aria-label="全选"></th><th>序号</th><th>规则编号</th><th>规则名称</th><th>预警类型</th><th>启用状态</th><th>备注</th><th>操作</th></tr></thead><tbody>${rows.map((rule,index)=>`<tr><td><input type="checkbox" aria-label="选择第${index+1}条规则"></td><td>${index+1}</td><td class="rule-code" title="${escapeEconomyRuleText(rule.id)}">${escapeEconomyRuleText(rule.id)} <span class="rule-copy">▣</span></td><td>${escapeEconomyRuleText(rule.name)}</td><td title="${escapeEconomyRuleText(rule.type)}">${escapeEconomyRuleText(rule.type)}</td><td><button type="button" class="economy-rule-switch ${rule.enabled?"on":""}" aria-label="${rule.enabled?"已启用":"已停用"}" onclick="toggleEconomyWarningRule('${escapeEconomyRuleText(rule.id)}')"><i></i></button></td><td class="rule-remark" title="${escapeEconomyRuleText(rule.remark)}">${escapeEconomyRuleText(rule.remark)}</td><td class="rule-actions"><button type="button" onclick="openEconomyWarningRuleEditor('edit','${escapeEconomyRuleText(rule.id)}')">编辑</button><button type="button" onclick="deleteEconomyWarningRule('${escapeEconomyRuleText(rule.id)}')">删除</button></td></tr>`).join("")}</tbody></table></div>`;
}
function renderEconomyWarningRuleSettingsPage(){
  const listPage=document.getElementById("listPage");
  if(!listPage)return;
  const isPrimary=economyWarningRuleState.tab==="primary";
  const groups=getEconomyWarningRuleGroups();
  const selected=getSelectedEconomyWarningRuleGroup();
  const sideHtml=`<aside class="card economy-warning-rule-categories"><div class="economy-warning-rule-category-title"><i></i><strong>${isPrimary?"一级预警类型":"二级预警类型"}</strong></div><div class="economy-warning-rule-category-list">${groups.map(item=>`<button class="${item.key===selected?.key?"active":""}" onclick="selectEconomyWarningRuleGroup('${item.key}')">${escapeEconomyRuleText(item.name)}</button>`).join("")}</div></aside>`;
  const mainHtml=`<div class="economy-warning-rule-tabs"><button class="${isPrimary?"active":""}" onclick="setEconomyWarningRuleTab('primary')">一级指标预警 <b>${getEconomyWarningRuleTotal("primary")}</b></button><button class="${!isPrimary?"active":""}" onclick="setEconomyWarningRuleTab('secondary')">二级指标预警 <b>${getEconomyWarningRuleTotal("secondary")}</b></button></div><section class="card table-card economy-warning-rule-content"><div class="card-hd economy-warning-rule-toolbar"><button class="btn primary economy-warning-rule-add" onclick="openEconomyWarningRuleEditor('create')">新建${isPrimary?"一级指标":"二级指标"}</button></div><div class="table-wrap roster-table-wrap">${renderEconomyWarningRuleTable(selected)}</div><div class="pagination"><span>共 ${selected?.rules.length||0} 条记录</span><span>第 1 / 1 页　每页 50 条</span></div></section>`;
  listPage.innerHTML=StandardList.render({variant:"split",className:"economy-warning-rule-page",titleHtml:`<div class="compact-title-row"><div class="module-title">经济预警 / 规则设置</div></div>`,sideHtml,mainHtml});
}
