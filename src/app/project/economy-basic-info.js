const projectEconomyInfoState={active:"basic",values:{},editingGroup:""};

function projectEconomyMoney(value){return Number(value||0).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2});}
function projectEconomyContractTag(value,type){const tone=type==="status"?(value==="在建"?"green":"blue"):(value==="是"?"green":"gray");return `<span class="project-economy-contract-tag ${tone}">${value}</span>`;}
function projectEconomySource(text="子公司"){return `<span class="project-economy-source">↗ ${text}</span>`;}
function getProjectEconomyInfoStore(){const projectId=String(getCurrentProjectContext()?.id||"default");return projectEconomyInfoState.values[projectId]||(projectEconomyInfoState.values[projectId]={});}
function projectEconomyField(label,value,unit="",source="子公司"){const current=getProjectEconomyInfoStore()[label];const shown=current===undefined?value:current;return `<div class="project-detail-field project-economy-view-field" data-label="${label}" data-unit="${unit}" data-source="${source||""}"><span>${label} ${source?projectEconomySource(source):""}</span><strong>${shown===""||shown==null?"-":shown}${unit?` <em>${unit}</em>`:""}</strong></div>`;}
function projectEconomyRadioField(label,value="否"){const current=getProjectEconomyInfoStore()[label]??value;return `<div class="project-detail-field project-economy-view-field" data-label="${label}" data-unit="" data-source="子公司" data-options="是,否"><span>${label} ${projectEconomySource()}</span><strong>${current}</strong></div>`;}
function projectEconomySectionTitle(title){return `<div class="project-economy-info-section-title"><strong>${title}</strong><div><button class="btn" onclick="openProjectEconomySectionEditor('${title}',this)">编辑</button></div></div>`;}
function projectEconomySubTitle(title,key=""){const groupKey=key||`group-${encodeURIComponent(title)}`;return `<h3 class="project-economy-info-subtitle" data-group="${groupKey}"><span><i></i>${title}</span></h3>`;}
function openProjectEconomySectionEditor(title,button){
  const section=button.closest(".project-economy-info-card");
  const fields=Array.from(section.querySelectorAll(".project-economy-view-field")).map(field=>({label:field.dataset.label,unit:field.dataset.unit,source:field.dataset.source,options:field.dataset.options,value:(field.querySelector("strong")?.textContent||"").replace(field.dataset.unit||"","").trim().replace(/^-$|^暂无$/g,"")}));
  openProjectEconomyFieldsEditor(title,fields);
}
function openProjectEconomyFieldsEditor(title,fields){
  if(!fields.length){showToast("该分组暂无可编辑字段");return;}
  openModal(`编辑${title}`,`<div class="project-economy-edit-grid">${fields.map((field,index)=>`<label class="form-item"><span>${field.label} ${field.source?projectEconomySource(field.source):""}</span>${field.options?`<select class="input" data-economy-edit-index="${index}">${field.options.split(",").map(option=>`<option ${option===field.value?"selected":""}>${option}</option>`).join("")}</select>`:`<div class="project-economy-edit-input"><input class="input" data-economy-edit-index="${index}" value="${field.value}" placeholder="请输入"/>${field.unit?`<em>${field.unit}</em>`:""}</div>`}</label>`).join("")}</div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick='saveProjectEconomyGroupEditor(${JSON.stringify(fields)})'>保存</button>`,"large");
}
function openProjectEconomyGroupEditor(key,title,button){
  const heading=button.closest(".project-economy-info-subtitle");let node=heading.nextElementSibling;const fields=[];
  while(node&&!node.classList.contains("project-economy-info-subtitle")){node.querySelectorAll?.(".project-economy-view-field").forEach(field=>fields.push({label:field.dataset.label,unit:field.dataset.unit,source:field.dataset.source,options:field.dataset.options,value:(field.querySelector("strong")?.textContent||"").replace(field.dataset.unit||"","").trim().replace(/^-$|^暂无$/g,"")}));node=node.nextElementSibling;}
  projectEconomyInfoState.editingGroup=key;openProjectEconomyFieldsEditor(title,fields);
}
function saveProjectEconomyGroupEditor(fields){const store=getProjectEconomyInfoStore();const scrollTop=document.querySelector(".project-economy-info-page")?.scrollTop||0;fields.forEach((field,index)=>{store[field.label]=document.querySelector(`[data-economy-edit-index="${index}"]`)?.value??field.value;});closeModal();renderProjectEconomyBasicInfoPage();requestAnimationFrame(()=>{const page=document.querySelector(".project-economy-info-page");if(page)page.scrollTop=scrollTop;});showToast("保存成功");}
function saveProjectEconomyInfo(){showToast("请通过各分组的编辑按钮修改数据");}
function scrollProjectEconomyInfo(key){projectEconomyInfoState.active=key;document.querySelectorAll(".project-economy-info-tabs button").forEach(item=>item.classList.toggle("active",item.dataset.key===key));const target=document.getElementById(`projectEconomyInfo-${key}`);const page=document.querySelector(".project-economy-info-page");if(target&&page)page.scrollTop=Math.max(0,target.offsetTop-58);}

function renderProjectEconomySummary(project){
  const phone=typeof maskPhone==="function"?maskPhone(project.managerPhone):"137****6898";
  return `<div class="project-economy-info-summary-wrap"><section class="project-economy-info-summary"><div class="project-economy-summary-name"><strong>${project.projectName}</strong><span>${project.projectStatus||"在建"}</span></div><div class="project-economy-summary-grid">${[
    ["项目编号",project.projectCode],["所属公司",project.subCompany],["基层单位/项目公司",project.branchCompany],["项目区域",project.region],["项目经理",project.projectManager],["联系方式",phone],["项目板块",project.projectType],["项目实施模式",project.implementationMode||"施工总承包"],["建设单位",project.builder],["计划开工",project.planStart],["计划完工",project.planEnd],["工期",`${project.planDuration||365} 天`]
  ].map(([label,value])=>`<div><span>${label}：</span><strong>${value||"-"}</strong></div>`).join("")}</div></section><aside class="project-economy-monitor"><header><strong>未满足诊断要求</strong><button type="button" onclick="showToast('已打开详细监控')">详细监控 ›</button></header><div>${[["诊断前置条件不为空",true],["项目板块及特征不为空",true],["带有子公司标签/必填字段填写完整",false],["已签合同主要主体/分包事项/特征值",true]].map(([label,ok])=>`<p>${label}<i class="${ok?"ok":"error"}">${ok?"✓":"×"}</i></p>`).join("")}</div></aside></div>`;
}

function renderProjectEconomyBasic(project,data){return `<section id="projectEconomyInfo-basic" class="project-economy-info-card">${projectEconomySectionTitle("项目基本信息")}${projectEconomySubTitle("经济基本信息","economic-basic")}<div class="project-economy-form-grid">${[
  ["子公司项目名称",project.projectName],["子公司项目编号",project.orderProjectNo||project.projectCode],["EAS 编号（本项目）",project.projectCode],["EAS编号（内部分包）",""],["总包含税价（元）",projectEconomyMoney(data.contract)],["总合同价（税率）","9.00","%"],["总包不含税价（元）",projectEconomyMoney(data.contract/1.09)],["目标利润率（含税）",data.profit,"%"],["项目目标成本总集采费用(元)","0","元"],["项目部目标管理费","1008400","元"],["暂列金额（元）","0","元"],["财务费用","","元"],["预计税金成本","62583.58","元"],["安措费计提比例","3.00","%"]
].map(item=>projectEconomyField(...item)).join("")}${projectEconomyRadioField("是否类投资项目")}${projectEconomyRadioField("是否投资项目")}</div>${projectEconomySubTitle("项目特征","project-feature",false)}<div class="project-economy-feature-list"><span>✓ 建筑</span><span>✓ 附属设施</span></div></section>`;}

function renderProjectEconomyPlanning(data){const contractRows=[["株洲新民租赁有限公司","材料","脚手架租赁",1276920],["株洲万多木业有限公司","材料","木方木模板工矿产品采购",783200],["株洲天地中亿混凝土有限公司","材料","商品混凝土采购",6076755.4],["株洲市云龙强力新型建材有限公司","材料","预拌砂浆工矿产品采购",904960],["株洲建茂建材实业有限公司","材料","砂石料砖材工矿产品采购",1723721]];return `<section id="projectEconomyInfo-planning" class="project-economy-info-card">${projectEconomySectionTitle("项目经济筹划",`<button class="btn primary" onclick="saveProjectEconomyInfo()">保存</button>`)}${projectEconomySubTitle("经济筹划")}<div class="project-economy-form-grid three">${projectEconomyField("核定项目管理人员数量","2","人")}${projectEconomyField("目标管理费中招待费","0","元")}${projectEconomyField("目标管理费中人工成本","520000","元")}</div>${projectEconomySubTitle("合同筹划")}<div class="project-economy-form-grid four">${projectEconomyField("目标成本中劳务分包总额","15232719.03","元")}${projectEconomyField("目标成本中专业分包总额","13678345.67","元")}${projectEconomyField("目标成本中材料分包总额","34133061.33","元")}${projectEconomyField("目标成本中其他分包总额","2022200","元")}</div><div class="table-wrap project-economy-info-table"><table><thead><tr><th>序号</th><th>分包单位名称</th><th>分包性质（类型）</th><th>分包事项</th><th>合同含税金额（筹划）</th><th>税率</th><th>主要施工内容</th></tr></thead><tbody>${contractRows.map((row,index)=>`<tr><td>${index+1}</td><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${projectEconomyMoney(row[3])}元</td><td>13.0%</td><td>${row[2]}</td></tr>`).join("")}</tbody><tfoot><tr><td colspan="4">合计</td><td>${projectEconomyMoney(contractRows.reduce((sum,row)=>sum+row[3],0))}元</td><td colspan="2"></td></tr></tfoot></table></div>${projectEconomySubTitle("主材料总量筹划")}<div class="project-economy-form-grid four">${[["商品混凝土合同总用量","26692","方"],["预拌混凝土合同总用量","0","方"],["钢筋合同总用量","2464","吨"],["钢板合同总用量","0","吨"],["钢绞线合同总用量","0","吨"],["水泥合同总用量","0","吨"]].map(item=>projectEconomyField(...item)).join("")}</div></section>`;}

function renderProjectEconomyProcess(){const rows=[["新马工业园节能环保产业园二次结构工程劳务分包合同","11221607.45","劳务","南通鑫联建筑劳务有限公司","在建"],["建设工程施工劳务分包合同","8892834.62","劳务","株洲创胜建设有限公司","在建"],["脚手架-材料-材料合同","2474554.00","材料","株洲新民租赁有限公司","结算"],["PHC管桩工矿产品采购合同","3158800.00","材料","长沙产投泽禹产业园发展有限公司","结算"]];return `<section id="projectEconomyInfo-process" class="project-economy-info-card">${projectEconomySectionTitle("过程动态信息",`<button class="btn" onclick="showToast('已打开往期数据')">查看往期数据</button><button class="btn primary" onclick="saveProjectEconomyInfo()">保存</button>`)}${projectEconomySubTitle("已填过程动态")}<div class="project-economy-form-grid four">${[["开累产值","68258615.56","元","子公司"],["开累营业收入","62622583.07","元","财务EAS系统"],["开累实际管理费","2274975.66","元","财务EAS系统"],["当期资金结余","-14313296.38","元","财务EAS系统"],["工程存货","6282574.41","元","财务EAS系统"],["内部专业分包存货总额","","元","财务EAS系统"],["安措费核销金额","93933.88","元","子公司"],["安措费剩余核销金额","845404.86","元","子公司"],["实际人工成本","1894987.67","元","财务EAS系统"],["实际项目管理人员数量","","人","数智施工"],["业主拖欠款（到期应收未收款）","0","元","子公司"],["到期长期应收未收款账龄","0","月","子公司"]].map(item=>projectEconomyField(...item)).join("")}</div>${projectEconomySubTitle("主材料过程动态")}<div class="table-wrap project-economy-info-table compact"><table><thead><tr><th></th><th>商品混凝土（方）</th><th>预拌混凝土（方）</th><th>钢筋（吨）</th><th>钢板（吨）</th><th>钢绞线（吨）</th><th>水泥（吨）</th></tr></thead><tbody><tr><td>进度理论用量</td><td>26020</td><td>0</td><td>2283.49</td><td>0</td><td>0</td><td>0</td></tr><tr><td>开累领用量</td><td>25991</td><td>0</td><td>1980.6</td><td>-</td><td>-</td><td>-</td></tr></tbody></table></div>${projectEconomySubTitle("已签合同动态")}<div class="project-economy-contract-stats"><div><strong>合同价统计</strong><span>已签合同总额</span><b>71,775,315.29 元</b><span>专业类型 11,028,408.52元</span><span>劳务类型 20,114,442.07元</span><span>材料类型 39,997,038.70元</span></div><div><strong>结算价统计</strong><span>已签合同总额</span><b>71,414,315.79 元</b><span>专业类型 11,028,408.52元</span><span>劳务类型 20,114,442.07元</span><span>材料类型 39,994,039.20元</span></div></div><div class="table-wrap project-economy-info-table"><table><thead><tr><th>序号</th><th>已签约分包分供以及其他合同名称</th><th>合同金额（元）</th><th>合同类型</th><th>分包单位名称</th><th>信息获取时间</th><th>分包合同状态</th><th>结算价（元）</th></tr></thead><tbody>${rows.map((row,index)=>`<tr><td>${index+1}</td><td>${row[0]}</td><td>${row[1]}元</td><td>${row[2]}</td><td>${row[3]}</td><td>2026-06-${String(12+index).padStart(2,"0")}</td><td>${row[4]}</td><td>${index>1?row[1]:"0.00"}</td></tr>`).join("")}</tbody></table></div></section>`;}

function renderProjectEconomySettlement(data){return `<section id="projectEconomyInfo-settlement" class="project-economy-info-card">${projectEconomySectionTitle("结算动态",`<button class="btn primary" onclick="saveProjectEconomyInfo()">保存</button>`)}<div class="project-economy-form-grid four">${[["结算初稿上报日期","2026-05-06","","子公司"],["上报结算价（元）",projectEconomyMoney(data.contract*.97),"元","子公司"],["项目预计实际成本（元）","0","元","子公司"],["结算完成日期","","","子公司"],["实际利润率（含税）","","%","子公司"],["项目终审价（元）","","元","子公司"],["实际附加税（元）","0","元","财务EAS系统"]].map(item=>projectEconomyField(...item)).join("")}</div></section>`;}

function renderProjectEconomyBasicInfoPage(){
  const project=getCurrentProjectContext();
  if(!project)return renderProjectPlaceholderPage("项目基本信息");
  const contract=Number(project.projectCost)||67920364.89;
  const data={contract:contract<1000000?contract*10000:contract,profit:(1.2+(Number(project.id||1)%7)*.15).toFixed(2)};
  detailPage.style.display="none";listPage.style.display="block";listPage.style.overflow="auto";
  listPage.innerHTML=`<div class="project-economy-info-page">${renderProjectEconomySummary(project)}<nav class="project-economy-info-tabs">${[["basic","项目基本信息"],["planning","项目经济筹划"],["process","过程动态信息"],["settlement","结算动态"]].map(([key,label])=>`<button data-key="${key}" class="${projectEconomyInfoState.active===key?"active":""}" onclick="scrollProjectEconomyInfo('${key}')">${label}</button>`).join("")}</nav>${renderProjectEconomyBasic(project,data)}${renderProjectEconomyPlanning(data)}${renderProjectEconomyProcess()}${renderProjectEconomySettlement(data)}</div>`;
}

function renderProjectEconomyPlanning(data){
  const contractRows=[
    ["HTJH-2026-001","株洲新民租赁有限公司","材料","脚手架租赁",1276920,13,"脚手架租赁",1216800],
    ["HTJH-2026-002","株洲万多木业有限公司","材料","木方木模板工矿产品采购",783200,13,"木方木模板采购",755600],
    ["HTJH-2026-003","株洲天地中亿混凝土有限公司","材料","商品混凝土采购",6076755.4,13,"商品混凝土供应",5948260],
    ["HTJH-2026-004","株洲市云龙强力新型建材有限公司","材料","预拌砂浆工矿产品采购",904960,13,"预拌砂浆供应",882400],
    ["HTJH-2026-005","株洲建茂建材实业有限公司","材料","砂石料砖材工矿产品采购",1723721,13,"砂石料及砖材供应",1685360]
  ];
  const plannedTotal=contractRows.reduce((sum,row)=>sum+row[4],0);
  const actualTotal=contractRows.reduce((sum,row)=>sum+row[7],0);
  return `<section id="projectEconomyInfo-planning" class="project-economy-info-card">
    ${projectEconomySectionTitle("项目经济筹划",`<button class="btn primary" onclick="saveProjectEconomyInfo()">保存</button>`)}
    ${projectEconomySubTitle("经济筹划")}
    <div class="project-economy-form-grid three">
      ${projectEconomyField("核定项目管理人员数量","2","人")}
      ${projectEconomyField("目标管理费中招待费","0","元")}
      ${projectEconomyField("目标管理费中人工成本","520000","元")}
    </div>
    ${projectEconomySubTitle("合同筹划")}
    <div class="project-economy-form-grid four">
      ${projectEconomyField("目标成本中劳务分包总额","15232719.03","元")}
      ${projectEconomyField("目标成本中专业分包总额","13678345.67","元")}
      ${projectEconomyField("目标成本中材料分包总额","34133061.33","元")}
      ${projectEconomyField("目标成本中其他分包总额","2022200","元")}
    </div>
    <div class="table-wrap project-economy-info-table project-economy-contract-plan-table"><table>
      <thead><tr><th>序号</th><th>合同计划编号</th><th>分包单位名称</th><th>分包性质（类型）</th><th>分包事项</th><th>含税金额（筹划）</th><th>税率</th><th>主要施工内容</th><th>含税金额（实际）</th></tr></thead>
      <tbody>${contractRows.map((row,index)=>`<tr><td>${index+1}</td><td>${row[0]}</td><td title="${row[1]}">${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${projectEconomyMoney(row[4])}元</td><td>${row[5].toFixed(1)}%</td><td>${row[6]}</td><td>${projectEconomyMoney(row[7])}元</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>合计</td><td colspan="4"></td><td>${projectEconomyMoney(plannedTotal)}元</td><td colspan="2"></td><td>${projectEconomyMoney(actualTotal)}元</td></tr></tfoot>
    </table></div>
    ${projectEconomySubTitle("主材料总量筹划")}
    <div class="project-economy-form-grid four">${[["商品混凝土合同总用量","26692","方"],["预拌混凝土合同总用量","0","方"],["钢筋合同总用量","2464","吨"],["钢板合同总用量","0","吨"],["钢绞线合同总用量","0","吨"],["水泥合同总用量","0","吨"]].map(item=>projectEconomyField(...item)).join("")}</div>
  </section>`;
}

function renderProjectEconomyProcess(){
  const rows=[
    ["新马工业园节能环保产业园二次结构工程劳务分包合同",11221607.45,"劳务","南通鑫联建筑劳务有限公司","91320623050243852K","2026-06-12",projectEconomyContractTag("是","boolean"),"二次结构施工","二结构",projectEconomyContractTag("在建","status"),10218420.00],
    ["建设工程施工劳务分包合同",8892834.62,"劳务","株洲创胜建设有限公司","91430221MA4T1H3X6D","2026-06-13",projectEconomyContractTag("是","boolean"),"主体劳务施工","建筑面积",projectEconomyContractTag("在建","status"),8241680.00],
    ["脚手架-材料-材料合同",2474554.00,"材料","株洲新民租赁有限公司","91430200753357476W","2026-06-14",projectEconomyContractTag("否","boolean"),"脚手架租赁","租赁周期",projectEconomyContractTag("结算","status"),2474554.00],
    ["PHC管桩工矿产品采购合同",3158800.00,"材料","长沙产投泽禹产业园发展有限公司","91430112MAC6M8W41Q","2026-06-15",projectEconomyContractTag("否","boolean"),"PHC管桩采购","桩基数量",projectEconomyContractTag("结算","status"),3158800.00]
  ];
  const signedContractTotal=rows.reduce((sum,row)=>sum+row[1],0);
  const signedSettlementTotal=rows.reduce((sum,row)=>sum+row[10],0);
  const materials=[
    ["进度理论用量","26020","0","2283.49","0","0","0"],
    ["开累领用量","25991","0","1980.6","-","-","-"]
  ];
  const contractSummary=[
    ["已签合同总额","71,775,315.29 元"],["专业类型","11,028,408.52 元"],["劳务类型","20,114,442.07 元"],["材料类型","39,997,038.70 元"],["其他类型","635,426.00 元"]
  ];
  const settlementSummary=[
    ["已签合同总额","71,414,315.79 元"],["专业类型","11,028,408.52 元"],["劳务类型","20,114,442.07 元"],["材料类型","39,994,039.20 元"],["其他类型","277,426.00 元"]
  ];
  const renderSummary=(title,list)=>`<div class="project-economy-contract-summary"><strong>${title}</strong><div>${list.map(([label,value])=>`<span><em>${label}</em><b>${value}</b></span>`).join("")}</div></div>`;
  return `<section id="projectEconomyInfo-process" class="project-economy-info-card">
    ${projectEconomySectionTitle("过程动态信息")}
    ${projectEconomySubTitle("已填过程动态")}
    <div class="project-economy-form-grid four">${[
      ["开累产值","68258615.56","元","子公司"],["开累营业收入","62622583.07","元","财务EAS系统"],["开累实际管理费","2274975.66","元","财务EAS系统"],["当期资金结余","-14313296.38","元","财务EAS系统"],
      ["工程存货","6282574.41","元","财务EAS系统"],["内部专业分包存货总额","","元","财务EAS系统"],["安措费核销金额","93933.88","元","子公司"],["安措费剩余核销金额","845404.86","元","子公司"],
      ["实际人工成本","1894987.67","元","财务EAS系统"],["实际项目管理人员数量","","人","数智施工"],["业主拖欠款（到期应收未收款）","0","元","子公司"],["到期长期应收未收款账龄","0","月","子公司"]
    ].map(item=>projectEconomyField(...item)).join("")}</div>
    ${projectEconomySubTitle("主材料过程动态")}
    <div class="table-wrap project-economy-info-table compact project-economy-material-process-table"><table><thead><tr><th></th><th>商品混凝土（方）</th><th>预拌混凝土（方）</th><th>钢筋（吨）</th><th>钢板（吨）</th><th>钢绞线（吨）</th><th>水泥（吨）</th></tr></thead><tbody>${materials.map(row=>`<tr><td>${row[0]}</td>${row.slice(1).map(value=>`<td><span>${value}</span>${projectEconomySource("子公司")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    ${projectEconomySubTitle("已签合同动态")}
    <div class="project-economy-contract-stats">${renderSummary("合同价统计",contractSummary)}${renderSummary("结算价统计",settlementSummary)}</div>
    <div class="table-wrap project-economy-info-table project-economy-signed-contract-table"><table>
      <thead><tr><th>序号</th><th>已签约分包分供以及其他合同名称</th><th>合同金额（元）</th><th>合同类型</th><th>分包单位名称</th><th>分包单位信用代码</th><th>信息获取时间</th><th>是否主体（主要）</th><th>分包事项</th><th>特征值</th><th>分包合同状态</th><th>结算价（元）</th></tr></thead>
      <tbody>${rows.map((row,index)=>`<tr><td>${index+1}</td><td title="${row[0]}">${row[0]}</td><td>${projectEconomyMoney(row[1])}</td><td>${row[2]}</td><td title="${row[3]}">${row[3]}</td><td>${row[4]}</td><td>${row[5]}</td><td>${row[6]}</td><td>${row[7]}</td><td>${row[8]}</td><td>${row[9]}</td><td>${projectEconomyMoney(row[10])}</td></tr>`).join("")}</tbody>
      <tfoot><tr><td>合计</td><td></td><td>${projectEconomyMoney(signedContractTotal)}</td><td colspan="4"></td><td></td><td></td><td></td><td></td><td>${projectEconomyMoney(signedSettlementTotal)}</td></tr></tfoot>
    </table></div>
  </section>`;
}
