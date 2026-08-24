(function(){
  const companies=["上海隧道","市政集团","上海路桥","城建物资"];
  const branches=["轨交分公司","上海分公司","道路分公司","物资事业部"];
  const managers=["王自立","吴平","周坤","金文皓","陈晓","赵青"];
  const bizTypes=["数字","设计","总承包","管线","产品销售"];
  const names=[
    "数智建材系统UI集成与共享大屏建设项目","陆家嘴项目小程序对接开发服务采购合同","上海闵行区浦江镇江月路500号3号厂房室内装修工程",
    "江杨水产品市场A、B、C、D楼钢结构构件供应项目","雪茄经济开发区网络食品产业园项目二期","上海银行股份有限公司江湾支行装修工程",
    "西政工出[2025]15号商业航天智能制造基地项目EPC工程","上海福虹家园养老服务有限公司改造项目","上海市虹口区瑞仙餐饮店",
    "上海灿臻电子有限公司燃气预埋工程","泉州小小铺珠宝工商商业用户","原水西环线南段工程技术服务"
  ];
  const operationProductionProjectListData=Array.from({length:36},(_,index)=>{
    const created=index%5!==4;
    const reported=index%7!==3;
    const linkedOrder=index%4!==1;
    const linkedConstruction=index%3===0;
    const date=`2026-08-${String(6-Math.floor(index/8)).padStart(2,"0")} ${String(13-index%5).padStart(2,"0")}:${String((index*7)%60).padStart(2,"0")}`;
    return {
      id:index+1,
      projectName:names[index%names.length],
      productionProjectNo:`SUCG${String(10+index%9).padStart(2,"0")}202608${String(index+1).padStart(4,"0")}`,
      subProjectNo:index%3===0?`XM-STSH2600${String(1601+index).padStart(4,"0")}`:String(26240+index),
      createMode:index%6===0?"手动":"集成",
      projectManager:managers[index%managers.length],
      contact:`13${5+index%4}****${String(7800+index).slice(-4)}`,
      fullContact:`13${5+index%4}${String(62007800+index).slice(-8)}`,
      managementUnit:`${companies[index%companies.length]}${branches[index%branches.length]}`,
      company:companies[index%companies.length],
      branch:branches[index%branches.length],
      bidAmount:(30000+(index+1)*262800).toLocaleString("zh-CN",{minimumFractionDigits:2}),
      projectCost:(index%4?30000+(index+1)*238000:0).toLocaleString("zh-CN",{minimumFractionDigits:2}),
      productionDate:date,
      businessType:bizTypes[index%bizTypes.length],
      relatedOrderProject:`ProjectMdm00${String(208000+index).padStart(6,"0")}`,
      reportStatus:reported?"推送成功":"推送失败",
      reportDate:"2026-08-06",
      linkedOrderProject:linkedOrder?`S${String(762210000+index)}`:"",
      linkedConstructionProject:linkedConstruction?`SUCG${String(2202608000+index)}`:"",
      constructionDate:linkedConstruction?date:"",
      orderStatus:linkedOrder?"已关联":"未关联",
      accountingStatus:index%5===0?"已关联":"未关联",
      constructionStatus:linkedConstruction?"已立项":"未立项",
      createdStatus:created?"已立项":"未立项"
    };
  });

  const state={filters:{},stat:"",page:1,pageSize:50};
  const orderPickerState={targetId:null,filters:{},page:1,pageSize:10};
  const orderProjects=Array.from({length:49},(_,index)=>({
    id:index+1,
    projectName:["苏河美欣公寓保障性租赁住房装修工程项目","深国际上海闵行 B-1厂房（配送中心）装修工程","金海路（杨高中路-华东路东侧）改建工程2标","嘉定粮食仓库仓房改建项目","新建市北高新技术服务园区N07地块项目"][index%5],
    projectNo:`ProjectMdm${String(20192101+index).padStart(8,"0")}`,
    masterType:index%3===0?"审批制":"备案制",
    company:companies[index%companies.length],
    managementUnit:companies[index%companies.length],
    category:index%4===0?"市政-城市道路":"房建-装饰装修",
    customer:["申铁","上海地产","临港集团","上海城投"][index%4],
    location:["上海/上海市","四川/成都","江苏/苏州","江西/南昌"][index%4],
    region:["上海","成都","江苏","江西"][index%4],
    bidDate:`202${4+index%2}-${String(index%12+1).padStart(2,"0")}-${String(index%27+1).padStart(2,"0")}`,
    bidPrice:(100000+index*2680).toLocaleString("zh-CN",{minimumFractionDigits:2}),
    splitAmount:(index%5===0?0:89000+index*1860).toLocaleString("zh-CN",{minimumFractionDigits:2}),
    createStatus:index%4===0?"待立项":index%4===2?"未完成":"已立项",
    linkedCount:index%6===0?0:1
  }));
  let current=[...operationProductionProjectListData];
  const input=(id,label,placeholder,value="")=>`<div class="form-item"><label>${label}</label><input class="input" id="${id}" value="${escapeAttr(value)}" placeholder="${placeholder}"/></div>`;
  const select=(id,label,values,value="")=>`<div class="form-item"><label>${label}</label><select class="select" id="${id}"><option value="">全部</option>${values.map(item=>`<option value="${item}" ${item===value?"selected":""}>${item}</option>`).join("")}</select></div>`;
  const dateRange=(label,startId,endId,start="",end="")=>`<div class="form-item"><label>${label}</label><div class="date-range ep-date-range"><input class="input" type="date" id="${startId}" value="${start}"/><span>至</span><input class="input" type="date" id="${endId}" value="${end}"/></div></div>`;
  const yesNoTag=(value,yes="已关联",no="未关联")=>value===yes?tag(value,"green"):`<span style="color:#f53f3f">● ${value||no}</span>`;
  const linkCell=value=>value?`<span title="${escapeAttr(value)}">${value}</span>`:`<span class="operation-unbound-link" title="未绑定"><svg class="operation-unbound-icon" viewBox="0 0 1024 1024" aria-hidden="true"><path d="M510.983345 63.599504c246.331291 0 447.87554 201.544249 447.87554 447.87554 0 246.332315-201.544249 447.87554-447.87554 447.87554S63.108828 757.806335 63.108828 511.474021C63.108828 265.143753 264.652054 63.599504 510.983345 63.599504L510.983345 63.599504zM575.273581 639.544885l-127.913275 0 0 127.913275 127.913275 0L575.273581 639.544885zM575.273581 255.42132l-127.913275 0 0 320.67858 127.913275 0L575.273581 255.42132z" fill="currentColor"></path></svg><span>未绑定</span></span>`;

  tableColumnDefinitions.operationProductionProjectList=[
    {key:"selection",title:"",width:48,align:"center",render:()=>`<input type="checkbox"/>`},
    {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(state.page-1)*state.pageSize+index+1},
    {key:"projectName",title:"生产项目名称",width:300,render:row=>`<a class="link text-ellipsis" title="${escapeAttr(row.projectName)}">${row.projectName}</a>`},
    {key:"productionProjectNo",title:"生产项目编号",width:170,align:"center",render:row=>row.productionProjectNo},
    {key:"subProjectNo",title:"子公司项目编号",width:160,align:"center",render:row=>row.subProjectNo},
    {key:"createMode",title:"创建模式",width:100,align:"center",render:row=>tag(row.createMode,row.createMode==="集成"?"green":"orange")},
    {key:"projectManager",title:"项目经理",width:190,align:"center",render:row=>renderProjectManagerContact(row.projectManager,row.fullContact||row.contact,{key:`operation-production-${row.id}`})},
    {key:"managementUnit",title:"子公司管理单位",width:190,render:row=>`<span class="text-ellipsis" title="${escapeAttr(row.managementUnit)}">${row.managementUnit}</span>`},
    {key:"bidAmount",title:"中标价(元)",width:140,align:"right",render:row=>row.bidAmount},
    {key:"projectCost",title:"项目造价(元)",width:140,align:"right",render:row=>row.projectCost},
    {key:"productionDate",title:"生产立项日期",width:165,align:"center",render:row=>row.productionDate},
    {key:"businessType",title:"项目业态",width:110,align:"center",render:row=>tag(row.businessType,"blue")},
    {key:"relatedOrderProject",title:"关联订单项目",width:180,align:"center",render:row=>row.relatedOrderProject},
    {key:"reportStatus",title:"报账推送状态",width:125,align:"center",render:row=>tag(row.reportStatus,row.reportStatus==="推送成功"?"green":"red")},
    {key:"reportDate",title:"报账推送时间",width:140,align:"center",render:row=>row.reportDate},
    {key:"linkedOrderProject",title:"关联核算项目",width:165,align:"center",render:row=>linkCell(row.linkedOrderProject)},
    {key:"linkedConstructionProject",title:"关联施工项目",width:175,align:"center",render:row=>linkCell(row.linkedConstructionProject)},
    {key:"constructionDate",title:"施工立项时间",width:165,align:"center",render:row=>row.constructionDate||"-"},
    {key:"operation",title:"操作",width:190,align:"center",render:row=>`<a class="link" onclick="showOperationProductionProjectDetail(${row.id})">详情</a> <a class="link" onclick="editOperationProductionProject(${row.id})">编辑</a> <a class="link" onclick="openOperationOrderProjectRebindPicker(${row.id})">换绑</a>`}
  ];

  function readFilters(){return {
    projectName:document.getElementById("opplName")?.value.trim()||"",org:document.getElementById("opplOrg")?.value||"",manager:document.getElementById("opplManager")?.value.trim()||"",productionNo:document.getElementById("opplProductionNo")?.value.trim()||"",subNo:document.getElementById("opplSubNo")?.value.trim()||"",createMode:document.getElementById("opplCreateMode")?.value||"",managementUnit:document.getElementById("opplManagementUnit")?.value.trim()||"",bizType:document.getElementById("opplBizType")?.value||"",orderNo:document.getElementById("opplOrderNo")?.value.trim()||"",accountNo:document.getElementById("opplAccountNo")?.value.trim()||"",productionStart:document.getElementById("opplProductionStart")?.value||"",productionEnd:document.getElementById("opplProductionEnd")?.value||"",constructionStart:document.getElementById("opplConstructionStart")?.value||"",constructionEnd:document.getElementById("opplConstructionEnd")?.value||""
  };}
  function matchesStat(row){if(!state.stat)return true;const [key,value]=state.stat.split(":");return row[key]===value;}
  function apply(){const f=state.filters;current=operationProductionProjectListData.filter(row=>{
    const productionDay=row.productionDate.slice(0,10),constructionDay=(row.constructionDate||"").slice(0,10);
    return (!f.projectName||row.projectName.includes(f.projectName))&&(!f.org||row.company===f.org)&&(!f.manager||row.projectManager.includes(f.manager))&&(!f.productionNo||row.productionProjectNo.includes(f.productionNo))&&(!f.subNo||row.subProjectNo.includes(f.subNo))&&(!f.createMode||row.createMode===f.createMode)&&(!f.managementUnit||row.managementUnit.includes(f.managementUnit))&&(!f.bizType||row.businessType===f.bizType)&&(!f.orderNo||row.relatedOrderProject.includes(f.orderNo))&&(!f.accountNo||row.linkedOrderProject.includes(f.accountNo))&&(!f.productionStart||productionDay>=f.productionStart)&&(!f.productionEnd||productionDay<=f.productionEnd)&&(!f.constructionStart||constructionDay>=f.constructionStart)&&(!f.constructionEnd||constructionDay<=f.constructionEnd)&&matchesStat(row);
  });}
  function stats(){const base=operationProductionProjectListData;return StatisticsFilter.render({id:"operation-production-project-list-stats",activeKey:state.stat,groups:[
    {label:"订单项目",items:[["orderStatus:未关联","未关联"],["orderStatus:已关联","已关联"]].map(([key,label])=>({key,label,value:base.filter(row=>row.orderStatus===key.split(":")[1]).length}))},
    {label:"核算项目",items:[["accountingStatus:未关联","未关联"],["accountingStatus:已关联","已关联"]].map(([key,label])=>({key,label,value:base.filter(row=>row.accountingStatus===key.split(":")[1]).length}))},
    {label:"施工项目",items:[["constructionStatus:未立项","未立项"],["constructionStatus:已立项","已立项"]].map(([key,label])=>({key,label,value:base.filter(row=>row.constructionStatus===key.split(":")[1]).length}))}
  ],onChange:key=>setOperationProductionProjectListStat(key)});}
  function query(){state.filters=readFilters();state.page=1;apply();renderOperationProductionProjectListPage();}
  function reset(){state.filters={};state.stat="";state.page=1;apply();renderOperationProductionProjectListPage();}
  function setStat(key){state.filters=readFilters();state.stat=state.stat===key?"":key;state.page=1;apply();renderOperationProductionProjectListPage();}
  function renderTable(){const start=(state.page-1)*state.pageSize;renderTableByColumns("operationProductionProjectList",current.slice(start,start+state.pageSize),"operationProductionProjectListTbody");}
  function renderPage(){
    detailPage.style.display="none";listPage.style.display="flex";apply();const f=state.filters;const pages=Math.max(1,Math.ceil(current.length/state.pageSize));
    const fields=`${input("opplName","项目名称","请输入项目名称",f.projectName)}${select("opplOrg","所属组织",companies,f.org)}${input("opplManager","项目经理","请输入项目经理",f.manager)}${input("opplProductionNo","生产项目编号","请输入生产项目编号",f.productionNo)}${input("opplSubNo","子公司项目编号","请输入子公司项目编号",f.subNo)}${select("opplCreateMode","创建模式",["集成","手动"],f.createMode)}${input("opplManagementUnit","子公司管理单位","请输入管理单位名称",f.managementUnit)}${select("opplBizType","项目业态",bizTypes,f.bizType)}${input("opplOrderNo","订单项目编号","请输入订单项目编号",f.orderNo)}${input("opplAccountNo","核算项目编号","请输入核算项目编号",f.accountNo)}${dateRange("生产立项日期","opplProductionStart","opplProductionEnd",f.productionStart,f.productionEnd)}${dateRange("施工立项日期","opplConstructionStart","opplConstructionEnd",f.constructionStart,f.constructionEnd)}`;
    state.page=Math.min(state.page,pages);
    const paginationHtml=`<span>共 ${current.length} 条记录</span><div class="pager"><button class="btn mini" onclick="changeOperationProductionProjectListPage(-1)" ${state.page<=1?"disabled":""}>上一页</button><b>第 ${state.page} / ${pages} 页</b><button class="btn mini" onclick="changeOperationProductionProjectListPage(1)" ${state.page>=pages?"disabled":""}>下一页</button><select class="select mini-select" onchange="changeOperationProductionProjectListPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${state.pageSize===size?"selected":""}>${size}条/页</option>`).join("")}</select></div>`;
    listPage.innerHTML=`<div class="compact-title-row"><div class="module-title">生产项目 / 生产项目列表</div></div>${renderUnifiedQueryCard(fields,{id:"operationProductionProjectListQuery",queryFn:"queryOperationProductionProjectList()",resetFn:"resetOperationProductionProjectList()",canCollapse:true})}${stats()}${renderUnifiedTableCard({title:"生产项目列表",tableKey:"operationProductionProjectList",tbodyId:"operationProductionProjectListTbody",renderFnName:"renderOperationProductionProjectListTable",refreshAction:"refreshOperationProductionProjectList()",exportAction:"exportOperationProductionProjectList()",total:current.length,paginationHtml})}`;
    renderTable();
  }
  window.renderOperationProductionProjectListPage=renderPage;
  window.queryOperationProductionProjectList=query;
  window.resetOperationProductionProjectList=reset;
  window.setOperationProductionProjectListStat=setStat;
  window.renderOperationProductionProjectListTable=renderTable;
  window.changeOperationProductionProjectListPage=direction=>{const pages=Math.max(1,Math.ceil(current.length/state.pageSize));state.page=Math.min(pages,Math.max(1,state.page+Number(direction)));renderPage();};
  window.changeOperationProductionProjectListPageSize=size=>{state.pageSize=Number(size)||50;state.page=1;renderPage();};
  window.refreshOperationProductionProjectList=()=>{query();showToast("生产项目列表已刷新");};
  window.exportOperationProductionProjectList=()=>showToast(`已导出生产项目列表（${current.length}条）`);
  window.showOperationProductionProjectDetail=id=>{const row=operationProductionProjectListData.find(item=>item.id===Number(id));if(!row)return;openModal("生产项目详情",`<div class="detail-info-grid">${Object.entries({生产项目名称:row.projectName,生产项目编号:row.productionProjectNo,子公司项目编号:row.subProjectNo,创建模式:row.createMode,项目经理:row.projectManager,联系方式:standardProjectManagerMaskPhone(row.fullContact||row.contact),管理单位:row.managementUnit,项目业态:row.businessType,生产立项日期:row.productionDate,报账推送状态:row.reportStatus,关联订单项目:row.relatedOrderProject,关联施工项目:row.linkedConstructionProject||"-"}).map(([label,value])=>`<span>${label}：<b>${value}</b></span>`).join("")}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");};
  window.editOperationProductionProject=id=>showToast(`进入生产项目编辑：${id}`);

  function readOrderPickerFilters(){return {name:document.getElementById("orderPickerName")?.value.trim()||"",no:document.getElementById("orderPickerNo")?.value.trim()||"",company:document.getElementById("orderPickerCompany")?.value.trim()||"",customer:document.getElementById("orderPickerCustomer")?.value.trim()||"",unit:document.getElementById("orderPickerUnit")?.value.trim()||""};}
  function filteredOrderProjects(){const f=orderPickerState.filters;return orderProjects.filter(row=>(!f.name||row.projectName.includes(f.name))&&(!f.no||row.projectNo.includes(f.no))&&(!f.company||row.company.includes(f.company))&&(!f.customer||row.customer.includes(f.customer))&&(!f.unit||row.managementUnit.includes(f.unit)));}
  function renderOrderPickerTable(){
    const rows=filteredOrderProjects(),pages=Math.max(1,Math.ceil(rows.length/orderPickerState.pageSize));orderPickerState.page=Math.min(orderPickerState.page,pages);
    const start=(orderPickerState.page-1)*orderPickerState.pageSize,shown=rows.slice(start,start+orderPickerState.pageSize);
    const tbody=document.getElementById("operationOrderPickerTbody");if(tbody)tbody.innerHTML=shown.map((row,index)=>`<tr><td class="center">${start+index+1}</td><td class="text-ellipsis" title="${escapeAttr(row.projectName)}">${row.projectName}</td><td class="center">${row.projectNo}</td><td class="center">${tag(row.masterType,row.masterType==="备案制"?"green":"orange")}</td><td class="center">${row.company}</td><td class="center">${row.managementUnit}</td><td class="center">${tag(row.category,"blue")}</td><td class="center">${row.customer}</td><td class="center">${row.location}</td><td class="center">${tag(row.region,"cyan")}</td><td class="center">${row.bidDate}</td><td class="right">${row.bidPrice}</td><td class="right">${row.splitAmount}</td><td class="center">${tag(row.createStatus,row.createStatus==="已立项"?"green":row.createStatus==="待立项"?"red":"orange")}</td><td class="center">${tag(String(row.linkedCount),"blue")}</td><td class="center"><button class="btn primary mini" onclick="confirmOperationOrderProjectRebind(${row.id})">确认选择</button></td></tr>`).join("")||`<tr><td colspan="16" class="empty">暂无数据</td></tr>`;
    const total=document.getElementById("operationOrderPickerTotal");if(total)total.textContent=`共 ${rows.length} 条数据`;
    const pager=document.getElementById("operationOrderPickerPager");if(pager)pager.innerHTML=`<button class="btn mini" ${orderPickerState.page<=1?"disabled":""} onclick="changeOperationOrderPickerPage(-1)">上一页</button><b>第 ${orderPickerState.page} / ${pages} 页</b><button class="btn mini" ${orderPickerState.page>=pages?"disabled":""} onclick="changeOperationOrderPickerPage(1)">下一页</button><select class="select mini-select" onchange="changeOperationOrderPickerPageSize(this.value)">${[10,20,50].map(size=>`<option value="${size}" ${size===orderPickerState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;
  }
  window.openOperationOrderProjectRebindPicker=id=>{
    orderPickerState.targetId=Number(id);orderPickerState.filters={};orderPickerState.page=1;
    const fields=`${input("orderPickerName","订单项目名称","请输入")}${input("orderPickerNo","订单项目编号","请输入")}${input("orderPickerCompany","子公司","请输入")}${input("orderPickerCustomer","客户名称","请输入")}${input("orderPickerUnit","子公司管理单位","请输入")}`;
    openNestedModal("绑定订单项目",`${renderUnifiedQueryCard(fields,{id:"operationOrderPickerQuery",queryFn:"queryOperationOrderPicker()",resetFn:"resetOperationOrderPicker()"})}<section class="card table-card operation-order-picker-card"><div class="card-hd"><div class="card-title">订单项目列表</div><div class="actions"><button class="btn" type="button" onclick="refreshOperationOrderPicker()">刷新</button><button class="column-setting-icon-btn" type="button" title="列设置" onclick="showToast('列设置功能已打开')">⚙</button></div></div><div class="table-wrap"><table><thead><tr><th class="center" style="width:70px">序号</th><th style="width:280px">订单项目名称</th><th class="center" style="width:180px">订单项目编号</th><th class="center" style="width:100px">主数据类型</th><th class="center" style="width:130px">子公司</th><th class="center" style="width:150px">子公司管理单位</th><th class="center" style="width:150px">项目类型</th><th class="center" style="width:120px">客户名称</th><th class="center" style="width:130px">项目所在地</th><th class="center" style="width:100px">所属区域</th><th class="center" style="width:120px">中标日期</th><th style="width:140px">中标价（万元）</th><th style="width:150px">已拆分金额（万元）</th><th class="center" style="width:110px">创建状态</th><th class="center" style="width:120px">关联生产项目</th><th class="center" style="width:110px">操作</th></tr></thead><tbody id="operationOrderPickerTbody"></tbody></table></div><div class="pagination"><span id="operationOrderPickerTotal"></span><div class="pager" id="operationOrderPickerPager"></div></div></section>`);
    document.querySelector(".nested-modal-mask:last-of-type .nested-modal")?.classList.add("operation-order-project-picker-modal");renderOrderPickerTable();
  };
  window.queryOperationOrderPicker=()=>{orderPickerState.filters=readOrderPickerFilters();orderPickerState.page=1;renderOrderPickerTable();};
  window.resetOperationOrderPicker=()=>{orderPickerState.filters={};orderPickerState.page=1;["orderPickerName","orderPickerNo","orderPickerCompany","orderPickerCustomer","orderPickerUnit"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});renderOrderPickerTable();};
  window.refreshOperationOrderPicker=()=>{renderOrderPickerTable();showToast("订单项目列表已刷新");};
  window.changeOperationOrderPickerPage=direction=>{const pages=Math.max(1,Math.ceil(filteredOrderProjects().length/orderPickerState.pageSize));orderPickerState.page=Math.min(pages,Math.max(1,orderPickerState.page+Number(direction)));renderOrderPickerTable();};
  window.changeOperationOrderPickerPageSize=size=>{orderPickerState.pageSize=Number(size)||10;orderPickerState.page=1;renderOrderPickerTable();};
  window.confirmOperationOrderProjectRebind=orderId=>{
    const target=operationProductionProjectListData.find(row=>row.id===orderPickerState.targetId),selected=orderProjects.find(row=>row.id===Number(orderId));
    if(!target||!selected)return;
    const previous=orderProjects.find(row=>row.projectNo===target.relatedOrderProject);
    if(previous&&previous.id!==selected.id&&previous.linkedCount>0)previous.linkedCount-=1;
    if(!previous||previous.id!==selected.id)selected.linkedCount+=1;
    target.relatedOrderProject=selected.projectNo;target.orderStatus="已关联";
    closeNestedModal();apply();renderOperationProductionProjectListPage();showToast("订单项目已绑定成功");
  };
})();
