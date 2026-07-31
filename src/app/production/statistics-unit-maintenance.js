const statisticsUnitState={enterprise:"",company:"",industry:"",category:"",included:"",output:"",registeredPlace:"",businessPlace:"",page:1,pageSize:50};

const statisticsUnitNames=[
  "上海城建投资发展有限公司","上海城建国际工程有限公司","上海汇臻资产管理有限公司","上海城建新业态发展有限公司","上海城建置业发展有限公司","上海城建商业发展有限公司","上海城建物业有限公司","上海城建隧道运营管理有限公司","上海城建环境发展有限公司","上海市政设计研究总院有限公司","上海隧道工程有限公司","上海路桥发展有限公司","上海城建水务工程有限公司","上海城建物资有限公司","上海能建工程有限公司","上海城建城市运营集团有限公司","上海城建数字产业有限公司"
];
const statisticsUnitCompanies=["城建投资","隧道股份","市政集团","上海路桥","城市环境","城建设计","上海能建","城建物资","运营集团"];
const statisticsUnitDictionaries={
  industries:["建筑业","房地产业","服务业","工业","批发零售业","金融业"],
  categories:["建筑业","房地产业","租赁和商务服务业","制造业","批发业","金融业"],
  relations:["规上","规下"],
  levels:["1|一级次","2|二级次","3|三级次","4|四级次","5|五级次","6|六级次"]
};
const statisticsUnitIndustryPairs=statisticsUnitDictionaries.industries.map((industry,index)=>[industry,statisticsUnitDictionaries.categories[index]]);
const statisticsUnitSubclasses=[["5165","建材批发"],["7010","房地产开发经营"],["7299","其他商务服务业"],["4813","市政道路工程建筑"],["4999","其他建筑安装"],["6999","其他未列明金融业"]];
const statisticsUnitAreas=[["上海市浦东新区","浦东新区"],["上海市徐汇区","徐汇区"],["上海市虹口区","虹口区"],["上海市杨浦区","杨浦区"],["上海市静安区","静安区"],["江苏省无锡市滨湖区","无锡市滨湖区"],["浙江省杭州市上城区","杭州市上城区"]];

const statisticsUnitRows=Array.from({length:85},(_,index)=>{
  const pair=statisticsUnitIndustryPairs[index%statisticsUnitIndustryPairs.length];
  const area=statisticsUnitAreas[index%statisticsUnitAreas.length];
  const name=index<statisticsUnitNames.length?statisticsUnitNames[index]:`${statisticsUnitCompanies[index%statisticsUnitCompanies.length]}第${String(index-16).padStart(2,"0")}建设发展有限公司`;
  return {
    id:index+1,enterpriseName:name,company:statisticsUnitCompanies[index%statisticsUnitCompanies.length],industry:pair[0],category:pair[1],department:["贸易部","综合办","市场经营部","行政办公室","生产统计室"][index%5],contact:["张明","周梅","陈杰","李强","王敏"][index%5],phone:`13${8+index%2}****${String(3100+index).slice(-4)}`,fullPhone:`13${8+index%2}${String(62003100+index).slice(-8)}`,
    registeredAddress:area[0],level:statisticsUnitDictionaries.levels[index%statisticsUnitDictionaries.levels.length],keyFocus:index%9===0?"是":"否",industryCode:["51","70","72","48","49","69"][index%6],subclassCode:statisticsUnitSubclasses[index%statisticsUnitSubclasses.length][0],subclassName:statisticsUnitSubclasses[index%statisticsUnitSubclasses.length][1],businessPlace:area[1],businessAddress:`${area[0]}城建路${168+index}号`,relation:statisticsUnitDictionaries.relations[index%5===0?0:1],registeredCapital:[5000,20000,15000,250000,54000][index%5],registeredCity:index%6===0?"无锡":index%7===0?"杭州":"上海",
    constructionQualification:index%3===0?"是":"否",realEstateQualification:index%6===1?"是":"否",financialRegulated:index%7===2?"是":"否",financialLicense:index%8===3?"是":"否",legalEntityIncluded:index%4===0?"是":"否",enabled:index%13!==0,statisticsEnabled:index%4===0?"是":"否",outputEnabled:index%3===0?"是":"否"
  };
});

tableColumnDefinitions.statisticsUnitMaintenance=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(statisticsUnitState.page-1)*statisticsUnitState.pageSize+index+1},
  {key:"enterpriseName",title:"企业名称",width:240,render:row=>`<a class="link" onclick="openStatisticsUnitDetail(${row.id})">${row.enterpriseName}</a>`},
  {key:"company",title:"所属单位",width:120,align:"center",render:row=>row.company},
  {key:"industry",title:"所属行业类别",width:130,align:"center",render:row=>tag(row.industry,"blue")},
  {key:"category",title:"类别名称",width:170,align:"center",render:row=>tag(row.category,"purple")},
  {key:"department",title:"纳统联系部门",width:140,align:"center",render:row=>row.department},
  {key:"contact",title:"纳统联系人",width:110,align:"center",render:row=>row.contact},
  {key:"phone",title:"联系电话",width:150,align:"center",render:row=>`${row.phone} <a class="link" title="查看完整手机号" onclick="showStatisticsUnitPhone(${row.id})">👁️</a>`},
  {key:"registeredAddress",title:"纳统地（省、市、区）",width:190,render:row=>row.registeredAddress},
  {key:"level",title:"级次",width:110,align:"center",render:row=>row.level},
  {key:"keyFocus",title:"重点关注",width:100,align:"center",render:row=>row.keyFocus},
  {key:"industryCode",title:"行业大类",width:140,align:"center",render:row=>row.industryCode},
  {key:"subclass",title:"行业小类",width:190,align:"center",render:row=>`${row.subclassCode}|${row.subclassName}`},
  {key:"businessPlace",title:"经营地（所在区）",width:140,align:"center",render:row=>row.businessPlace},
  {key:"businessAddress",title:"经营地（详细地址）",width:220,render:row=>row.businessAddress},
  {key:"relation",title:"规上/规下",width:100,align:"center",render:row=>tag(row.relation,row.relation==="规上"?"green":"gray")},
  {key:"registeredCapital",title:"注册资本（万元）",width:140,align:"right",render:row=>Number(row.registeredCapital).toLocaleString()},
  {key:"registeredCity",title:"注册地",width:100,align:"center",render:row=>row.registeredCity},
  {key:"constructionQualification",title:"是否具有施工总承包及专业承包资质",width:230,align:"center",render:row=>row.constructionQualification},
  {key:"realEstateQualification",title:"是否具有房地产开发经营资质证书",width:230,align:"center",render:row=>row.realEstateQualification},
  {key:"financialRegulated",title:"是否纳入“一行两会”金融监管",width:210,align:"center",render:row=>row.financialRegulated},
  {key:"financialLicense",title:"是否持有金融类牌照",width:160,align:"center",render:row=>row.financialLicense},
  {key:"legalEntityIncluded",title:"该法人是否纳统",width:140,align:"center",render:row=>row.legalEntityIncluded},
  {key:"enabled",title:"是否启用",width:100,align:"center",render:row=>tag(row.enabled?"启用":"停用",row.enabled?"green":"gray")},
  {key:"statisticsEnabled",title:"是否开启纳统",width:130,align:"center",render:row=>row.statisticsEnabled},
  {key:"outputEnabled",title:"是否开启产值",width:130,align:"center",render:row=>row.outputEnabled},
  {key:"operation",title:"操作",width:170,align:"center",render:row=>`<a class="link" onclick="openStatisticsUnitDetail(${row.id})">查看</a>　<a class="link" onclick="openStatisticsUnitEdit(${row.id})">编辑</a>　<a class="link" onclick="toggleStatisticsUnit(${row.id})">${row.enabled?"停用":"启用"}</a>`}
];
tableColumnDefinitions.statisticsUnitMaintenance.freezeCount=2;

function statisticsUnitUnique(key){return [...new Set(statisticsUnitRows.map(row=>row[key]).filter(Boolean))];}
function statisticsUnitOptions(values,current){return `<option value="">全部</option>${values.map(value=>`<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;}
function statisticsUnitValueOptions(values,current){return values.map(value=>`<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("");}

function getStatisticsUnitFilteredRows(){
  const s=statisticsUnitState;
  return statisticsUnitRows.filter(row=>(!s.enterprise||row.enterpriseName.includes(s.enterprise))&&(!s.company||row.company===s.company)&&(!s.industry||row.industry===s.industry)&&(!s.category||row.category===s.category)&&(!s.included||row.legalEntityIncluded===s.included)&&(!s.output||row.outputEnabled===s.output)&&(!s.registeredPlace||row.registeredCity===s.registeredPlace)&&(!s.businessPlace||row.businessPlace===s.businessPlace));
}

function getStatisticsUnitPagedRows(){
  const rows=getStatisticsUnitFilteredRows(),pages=Math.max(1,Math.ceil(rows.length/statisticsUnitState.pageSize));
  statisticsUnitState.page=Math.min(pages,Math.max(1,statisticsUnitState.page));
  const start=(statisticsUnitState.page-1)*statisticsUnitState.pageSize;
  return rows.slice(start,start+statisticsUnitState.pageSize);
}

function queryStatisticsUnits(){Object.assign(statisticsUnitState,{enterprise:document.getElementById("statisticsUnitEnterprise")?.value.trim()||"",company:document.getElementById("statisticsUnitCompany")?.value||"",industry:document.getElementById("statisticsUnitIndustry")?.value||"",category:document.getElementById("statisticsUnitCategory")?.value||"",included:document.getElementById("statisticsUnitIncluded")?.value||"",output:document.getElementById("statisticsUnitOutput")?.value||"",registeredPlace:document.getElementById("statisticsUnitRegisteredPlace")?.value||"",businessPlace:document.getElementById("statisticsUnitBusinessPlace")?.value||"",page:1});renderStatisticsUnitMaintenancePage();}
function resetStatisticsUnits(){Object.assign(statisticsUnitState,{enterprise:"",company:"",industry:"",category:"",included:"",output:"",registeredPlace:"",businessPlace:"",page:1});renderStatisticsUnitMaintenancePage();}
function changeStatisticsUnitPage(delta){const pages=Math.max(1,Math.ceil(getStatisticsUnitFilteredRows().length/statisticsUnitState.pageSize));statisticsUnitState.page=Math.min(pages,Math.max(1,statisticsUnitState.page+Number(delta||0)));renderStatisticsUnitTable();}
function changeStatisticsUnitPageSize(value){statisticsUnitState.pageSize=Number(value)||50;statisticsUnitState.page=1;renderStatisticsUnitTable();}

function renderStatisticsUnitTable(){
  renderTableByColumns("statisticsUnitMaintenance",getStatisticsUnitPagedRows(),"statisticsUnitMaintenanceTbody");
  const total=getStatisticsUnitFilteredRows().length,pages=Math.max(1,Math.ceil(total/statisticsUnitState.pageSize));
  const totalNode=document.getElementById("statisticsUnitMaintenanceTotalText"),pageNode=document.getElementById("statisticsUnitMaintenancePageText");
  if(totalNode)totalNode.textContent=`共 ${total} 条`;
  if(pageNode)pageNode.innerHTML=`<button class="btn mini" onclick="changeStatisticsUnitPage(-1)" ${statisticsUnitState.page<=1?"disabled":""}>上一页</button><b>第 ${statisticsUnitState.page} / ${pages} 页</b><button class="btn mini" onclick="changeStatisticsUnitPage(1)" ${statisticsUnitState.page>=pages?"disabled":""}>下一页</button><select class="select mini-select" onchange="changeStatisticsUnitPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${size===statisticsUnitState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;
}

function showStatisticsUnitPhone(id){const row=statisticsUnitRows.find(item=>item.id===Number(id));if(row)showToast(`${row.contact}：${row.fullPhone}`);}

function openStatisticsUnitDetail(id){
  const row=statisticsUnitRows.find(item=>item.id===Number(id));if(!row)return;
  const fields=[["企业名称",row.enterpriseName],["所属单位",row.company],["所属行业类别",row.industry],["类别名称",row.category],["纳统联系部门",row.department],["纳统联系人",row.contact],["联系电话",row.fullPhone],["纳统地",row.registeredAddress],["级次",row.level],["重点关注",row.keyFocus],["行业大类",row.industryCode],["行业小类",`${row.subclassCode}|${row.subclassName}`],["经营地",`${row.businessPlace} ${row.businessAddress}`],["规上/规下",row.relation],["注册资本",`${row.registeredCapital.toLocaleString()} 万元`],["注册地",row.registeredCity],["是否具有施工总承包及专业承包资质",row.constructionQualification],["是否具有房地产开发经营资质证书",row.realEstateQualification],["是否纳入“一行两会”金融监管",row.financialRegulated],["是否持有金融类牌照",row.financialLicense],["该法人是否纳统",row.legalEntityIncluded],["是否启用",row.enabled?"启用":"停用"],["是否开启纳统",row.statisticsEnabled],["是否开启产值",row.outputEnabled]];
  openModal("单位详情",`<div class="operation-detail-grid">${fields.map(item=>operationReadonlyField(item[0],String(item[1]),false,item[0]==="企业名称"||item[0]==="经营地")).join("")}</div>`,`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="closeModal();openStatisticsUnitEdit(${row.id})">编辑</button>`,"large");
}

function openStatisticsUnitEdit(id){
  const row=statisticsUnitRows.find(item=>item.id===Number(id));if(!row)return;
  openModal("编辑单位",`<div class="form-grid-2"><div class="form-item"><label>企业名称</label><input id="statisticsUnitEditName" class="input" value="${escapeAttr(row.enterpriseName)}"/></div><div class="form-item"><label>所属单位</label><select id="statisticsUnitEditCompany" class="select">${statisticsUnitValueOptions(statisticsUnitUnique("company"),row.company)}</select></div><div class="form-item"><label>所属行业类别</label><select id="statisticsUnitEditIndustry" class="select">${statisticsUnitValueOptions(statisticsUnitDictionaries.industries,row.industry)}</select></div><div class="form-item"><label>类别名称</label><select id="statisticsUnitEditCategory" class="select">${statisticsUnitValueOptions(statisticsUnitDictionaries.categories,row.category)}</select></div><div class="form-item"><label>规上/规下</label><select id="statisticsUnitEditRelation" class="select">${statisticsUnitValueOptions(statisticsUnitDictionaries.relations,row.relation)}</select></div><div class="form-item"><label>级次</label><select id="statisticsUnitEditLevel" class="select">${statisticsUnitValueOptions(statisticsUnitDictionaries.levels,row.level)}</select></div><div class="form-item"><label>纳统联系人</label><input id="statisticsUnitEditContact" class="input" value="${escapeAttr(row.contact)}"/></div><div class="form-item"><label>联系电话</label><input id="statisticsUnitEditPhone" class="input" value="${escapeAttr(row.fullPhone)}"/></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveStatisticsUnit(${row.id})">保存</button>`,"large");
}

function saveStatisticsUnit(id){const row=statisticsUnitRows.find(item=>item.id===Number(id));if(!row)return;row.enterpriseName=document.getElementById("statisticsUnitEditName")?.value.trim()||row.enterpriseName;row.company=document.getElementById("statisticsUnitEditCompany")?.value||row.company;row.industry=document.getElementById("statisticsUnitEditIndustry")?.value||row.industry;row.category=document.getElementById("statisticsUnitEditCategory")?.value||row.category;row.relation=document.getElementById("statisticsUnitEditRelation")?.value||row.relation;row.level=document.getElementById("statisticsUnitEditLevel")?.value||row.level;row.contact=document.getElementById("statisticsUnitEditContact")?.value.trim()||row.contact;row.fullPhone=document.getElementById("statisticsUnitEditPhone")?.value.trim()||row.fullPhone;closeModal();renderStatisticsUnitTable();showToast("单位信息已保存");}
function toggleStatisticsUnit(id){const row=statisticsUnitRows.find(item=>item.id===Number(id));if(!row)return;row.enabled=!row.enabled;renderStatisticsUnitTable();showToast(`${row.enterpriseName}已${row.enabled?"启用":"停用"}`);}
function createStatisticsUnit(){showToast("请在实际系统中接入单位新增流程");}

function renderStatisticsUnitMaintenancePage(){
  detailPage.style.display="none";listPage.style.display="flex";
  const rows=getStatisticsUnitFilteredRows(),pages=Math.max(1,Math.ceil(rows.length/statisticsUnitState.pageSize));
  const queryHtml=`${renderOperationInput("statisticsUnitEnterprise","企业名称",statisticsUnitState.enterprise,"请输入企业名称")}${renderOperationSelect("statisticsUnitCompany","所属单位",statisticsUnitUnique("company"),statisticsUnitState.company)}${renderOperationSelect("statisticsUnitIndustry","所属行业类别",statisticsUnitDictionaries.industries,statisticsUnitState.industry)}${renderOperationSelect("statisticsUnitCategory","类别名称",statisticsUnitDictionaries.categories,statisticsUnitState.category)}${renderOperationSelect("statisticsUnitIncluded","纳统",["是","否"],statisticsUnitState.included)}${renderOperationSelect("statisticsUnitOutput","产值",["是","否"],statisticsUnitState.output)}${renderOperationSelect("statisticsUnitRegisteredPlace","注册地",statisticsUnitUnique("registeredCity"),statisticsUnitState.registeredPlace)}${renderOperationSelect("statisticsUnitBusinessPlace","经营地",statisticsUnitUnique("businessPlace"),statisticsUnitState.businessPlace)}`;
  listPage.innerHTML=`<div class="compact-title-row"><div class="module-title">纳统管理 / 单位维护</div></div>${renderUnifiedQueryCard(queryHtml,{id:"statisticsUnitQueryCard",queryFn:"queryStatisticsUnits()",resetFn:"resetStatisticsUnits()",canCollapse:false})}${renderUnifiedTableCard({title:"单位维护列表",tableKey:"statisticsUnitMaintenance",tbodyId:"statisticsUnitMaintenanceTbody",renderFnName:"renderStatisticsUnitTable",total:rows.length,beforeActions:`<button class="btn primary" onclick="createStatisticsUnit()">新增单位</button>`,refreshAction:"renderStatisticsUnitMaintenancePage()",exportAction:"showToast('单位维护列表导出成功')",pageText:`<span id="statisticsUnitMaintenancePageText">第 1 / ${pages} 页　每页 ${statisticsUnitState.pageSize} 条</span>`})}`;
  renderStatisticsUnitTable();
}
