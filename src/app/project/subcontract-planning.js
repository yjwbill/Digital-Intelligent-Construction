/* Overall planning: subcontract and supply contract plans, isolated per project. */
const subcontractPlanCategories=["劳务分包","专业分包","材料采购","设备租赁","其他"];
let subcontractPlanDraft=null;
let subcontractPlanProjectId="";
let subcontractPlanSource=null;
const subcontractPlanMoney=value=>Number(value).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2});
const subcontractPlanCents=value=>Math.round(Number(value||0)*100);

function getSubcontractPlanSource(){
  const project=getCurrentProjectContext()||{};
  const store=getProjectEconomyInfoStore();
  const number=value=>Number(String(value).replace(/[,，%元\s]/g,""));
  const rawCost=Number(project.projectCost)||67920364.89;
  const contract=number(store["总包含税价（元）"]??(rawCost<1000000?rawCost*10000:rawCost));
  const rate=number(store["目标利润率（含税）"]??(1.2+(Number(project.id||1)%7)*.15).toFixed(2));
  return {contract,rate,profit:Math.round(contract*rate)/100,
    management:number(store["项目部目标管理费"]??1008400),tax:number(store["预计税金成本"]??62583.58),
    finance:store["财务费用"]??"",provisional:store["暂列金额（元）"]??""};
}
function getSubcontractPlanTotals(){
  const source=subcontractPlanSource;
  const available=(subcontractPlanCents(source.contract)-subcontractPlanCents(source.profit)-subcontractPlanCents(source.management)-subcontractPlanCents(source.tax)-subcontractPlanCents(subcontractPlanDraft.finance)-subcontractPlanCents(subcontractPlanDraft.provisional))/100;
  const planned=subcontractPlanDraft.groups.reduce((sum,group)=>sum+group.reduce((total,row)=>total+subcontractPlanCents(row.amount),0),0)/100;
  return {available,planned};
}
function refreshSubcontractPlanTotals(){
  const totals=getSubcontractPlanTotals();
  for(const key of ["available","planned"]){
    const el=document.getElementById(`subcontractPlan-${key}`);
    if(el)el.textContent=subcontractPlanMoney(totals[key]);
  }
  subcontractPlanDraft.groups.forEach((rows,index)=>{
    const el=document.getElementById(`subcontractPlanSubtotal-${index}`);
    if(el)el.textContent=subcontractPlanMoney(rows.reduce((sum,row)=>sum+subcontractPlanCents(row.amount),0)/100);
  });
}
function renderSubcontractPlanSummary(){
  const s=subcontractPlanSource;
  const stats=[["目标利润率(%)",s.rate],["上缴利润(元)",s.profit],["项目管理费(元)",s.management],["税金成本(元)",s.tax]];
  return `<div class="subcontract-plan-stats">${stats.map(([label,value])=>`<div class="subcontract-plan-stat"><span>${label}</span><strong>${subcontractPlanMoney(value)}</strong></div>`).join("")}
    ${[["finance","财务费用(元)"],["provisional","暂列金额(元)"]].map(([key,label])=>`<div class="subcontract-plan-stat"><label for="subcontractPlan-${key}">${label}<em> *</em></label><div class="subcontract-plan-money"><input class="input" id="subcontractPlan-${key}" type="number" min="0" step="0.01" required placeholder="请输入" value="${escapeAttr(String(subcontractPlanDraft[key]))}" oninput="updateSubcontractPlanSummary(this,'${key}')"><span>元</span></div></div>`).join("")}
    <div class="subcontract-plan-stat"><span>分包分供等合同可签总额(元) ${renderInfoTip("可签总额 = 总包合同价 − 上缴利润 − 项目管理费 − 税金成本 − 财务费用 − 暂列金额","subcontract-plan-formula-tip")}</span><strong id="subcontractPlan-available"></strong></div>
    <div class="subcontract-plan-stat"><span>分包分供等合同计划签订总额(元)</span><strong id="subcontractPlan-planned"></strong></div></div>`;
}
function renderSubcontractPlanInput(row,i,j,key,label){
  const disabled=(key==="matter"&&i!==1)||(key==="feature"&&i>1);
  const numeric=key==="amount"||key==="threshold";
  const input=`<input class="input" aria-label="${i+1}.${j+1} ${label}" type="${numeric?"number":"text"}" ${numeric?`min="0" step="${key==="amount"?"0.01":"1"}"`:'maxlength="500"'} value="${escapeAttr(String(disabled?"":row[key]??""))}" placeholder="${disabled?"不适用":"请输入"}" ${disabled?"disabled":""} oninput="updateSubcontractPlanRow(this,${i},${j},'${key}')">`;
  return key==="amount"?`<div class="subcontract-plan-money">${input}<span>元</span></div>`:input;
}
function getSubcontractPlanThreshold(row,category){
  if(category>1||!(row.feature||row.matter||"").trim())return "—";
  // Stable mock result until the business calculation rules are available.
  const seed=`${category}:${row.feature||""}:${category===1?row.matter||"":""}`;
  let hash=0;
  for(const char of seed)hash=(hash*31+char.charCodeAt(0))>>>0;
  return hash%10+1;
}
function renderSubcontractPlanRows(){
  return subcontractPlanCategories.map((category,i)=>`<tr class="subcontract-plan-category"><td>${i+1}</td><td><strong>${category}</strong></td><td></td><td></td><td class="subcontract-plan-number" id="subcontractPlanSubtotal-${i}"></td><td colspan="4"></td><td class="subcontract-plan-actions"><button class="subcontract-plan-link" type="button" onclick="addSubcontractPlanRow(${i})">新增合同计划</button></td></tr>
    ${subcontractPlanDraft.groups[i].map((row,j)=>`<tr><td>${i+1}.${j+1}</td><td>${renderSubcontractPlanInput(row,i,j,"name","合同计划项")}</td>
      <td title="${escapeAttr(row.code||"保存并提交后自动生成")}">${escapeAttr(row.code||"提交后自动生成")}</td><td>${renderSubcontractPlanInput(row,i,j,"contractName","计划签订合同名称")}</td><td>${renderSubcontractPlanInput(row,i,j,"amount","计划签订金额")}</td>
      <td><select class="select" aria-label="${i+1}.${j+1} 是否主体/主要" ${i>1?"disabled":""} onchange="updateSubcontractPlanRow(this,${i},${j},'main')"><option value="">${i>1?"不适用":"请选择"}</option>${i>1?"": ["是","否"].map(value=>`<option ${row.main===value?"selected":""}>${value}</option>`).join("")}</select></td>
      <td>${renderSubcontractPlanInput(row,i,j,"matter","分包事项")}</td><td>${renderSubcontractPlanInput(row,i,j,"feature","特征值")}</td><td><span id="subcontractPlanThreshold-${i}-${j}">${getSubcontractPlanThreshold(row,i)}</span></td><td class="subcontract-plan-actions"><button class="subcontract-plan-link danger" type="button" aria-label="移除 ${i+1}.${j+1}" onclick="removeSubcontractPlanRow(${i},${j})">移除</button></td></tr>`).join("")}`).join("");
}
function updateSubcontractPlanSummary(input,key){
  subcontractPlanDraft[key]=input.value;
  refreshSubcontractPlanTotals();
}
function updateSubcontractPlanRow(input,i,j,key){
  if(key==="code"||key==="threshold"||(key==="main"&&i>1)||(key==="feature"&&i>1)||(key==="matter"&&i!==1))return;
  subcontractPlanDraft.groups[i][j][key]=input.value;
  if(key==="amount")refreshSubcontractPlanTotals();
  if(key==="matter"||key==="feature"){
    const el=document.getElementById(`subcontractPlanThreshold-${i}-${j}`);
    if(el)el.textContent=getSubcontractPlanThreshold(subcontractPlanDraft.groups[i][j],i);
  }
}
function refreshSubcontractPlanRows(){
  document.getElementById("subcontractPlanRows").innerHTML=renderSubcontractPlanRows();
  refreshSubcontractPlanTotals();
}
function addSubcontractPlanRow(i){
  subcontractPlanDraft.groups[i].push({name:"",code:"",contractName:"",amount:"",main:"",matter:"",feature:"",threshold:""});
  refreshSubcontractPlanRows();
  document.querySelector(`[aria-label="${i+1}.${subcontractPlanDraft.groups[i].length} 合同计划项"]`)?.focus();
}
function removeSubcontractPlanRow(i,j){
  subcontractPlanDraft.groups[i].splice(j,1);
  refreshSubcontractPlanRows();
}
function saveSubcontractPlan(submit=false){
  const invalid=[...document.querySelectorAll(".subcontract-planning-modal input")].find(input=>!input.checkValidity());
  if(invalid){invalid.reportValidity();invalid.focus();return;}
  const saved=JSON.parse(JSON.stringify(subcontractPlanDraft));
  saved.submitted=submit;
  saved.nextNumber=Number(saved.nextNumber)||1;
  const codes=new Set(saved.groups.flat().map(row=>row.code).filter(Boolean));
  saved.groups.forEach((rows,i)=>rows.forEach(row=>{
    if(i>1){row.main="";row.feature="";}
    if(i!==1)row.matter="";
    row.threshold=getSubcontractPlanThreshold(row,i);
    if(submit&&!row.code){
      let code;
      do{code=`HTJH-${subcontractPlanProjectId}-${String(saved.nextNumber++).padStart(4,"0")}`;}while(codes.has(code));
      row.code=code;codes.add(code);
    }
  }));
  try{localStorage.setItem(`subcontract-plan:${subcontractPlanProjectId}`,JSON.stringify(saved));}
  catch(error){showToast("保存失败，请检查浏览器存储后重试");return;}
  if(submit)getCurrentProjectPlanningCompletedKeys().add("subcontract");
  else getCurrentProjectPlanningCompletedKeys().delete("subcontract");
  closeModal();
  renderProjectOverallPlanningPage();
  showToast(submit?"分包分供筹划已保存并提交":"分包分供筹划已保存");
}
function openProjectSubcontractPlanningModal(){
  subcontractPlanProjectId=String(getCurrentProjectContext()?.id||"default");
  subcontractPlanSource=getSubcontractPlanSource();
  let saved;
  try{saved=JSON.parse(localStorage.getItem(`subcontract-plan:${subcontractPlanProjectId}`)||"null");}catch(error){saved=null;}
  subcontractPlanDraft=saved&&Array.isArray(saved.groups)&&saved.groups.length===5&&saved.groups.every(Array.isArray)?saved:{finance:subcontractPlanSource.finance,provisional:subcontractPlanSource.provisional,groups:subcontractPlanCategories.map(()=>[])};
  const table=`<div class="subcontract-plan-table-wrap"><table class="comprehensive-actual-output-project-table subcontract-plan-table"><colgroup>${[60,260,150,220,170,130,190,170,190,110].map(width=>`<col style="width:${width}px">`).join("")}</colgroup><thead><tr>${["序号","合同计划项","计划项编号","计划签订合同名称","计划签订金额(元)","是否主体/主要","分包事项","特征值","建议签订合同数量阈值","操作"].map(title=>`<th>${title}${title==="是否主体/主要"?renderInfoTip("永久性结构对应的分包分供合同","subcontract-plan-formula-tip"):""}</th>`).join("")}</tr></thead><tbody id="subcontractPlanRows">${renderSubcontractPlanRows()}</tbody></table></div>`;
  openModal("分包分供筹划",`<div class="subcontract-plan-body">${renderStandardFormGroup("分包分供等合同计划数据",renderSubcontractPlanSummary())}${renderStandardFormGroup("合同计划明细表",table)}</div>`,`<button class="btn primary" onclick="saveSubcontractPlan()">保存</button><button class="btn primary" onclick="saveSubcontractPlan(true)">保存并提交</button><button class="btn" onclick="closeModal()">取消</button>`,"large");
  modalBox.classList.add("subcontract-planning-modal");
  refreshSubcontractPlanTotals();
}
