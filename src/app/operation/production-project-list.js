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
      projectShortName:names[index%names.length].slice(0,12),
      country:"中国",
      provinceCity:index%names.length===10?"福建省 / 泉州市 / 鲤城区":"上海市 / 上海市 / 闵行区",
      projectAddress:index%names.length===2?"浦江镇江月路500号3号厂房":`项目所在地示范路${100+index}号`,
      groupIntegratedMode:index%2===0?"是":"否",
      projectStatus:linkedConstruction?"在建":"筹备",
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
  let pendingOrderRebind=null;
  let pendingConstructionProject=null;
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
  // 为现有模拟关联编号补齐订单快照，供换绑前的信息对比使用。
  const boundOrderProjects=new Map(operationProductionProjectListData.map((project,index)=>[
    project.relatedOrderProject,{
      ...orderProjects[index%orderProjects.length],
      id:orderProjects.length+index+1,
      projectNo:project.relatedOrderProject,
      projectName:project.projectName,
      company:project.company,
      managementUnit:project.managementUnit,
      category:project.businessType,
      bidPrice:(Number(project.bidAmount.replace(/,/g,""))/10000).toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2}),
      linkedCount:1
    }
  ]));
  const getBoundOrderProject=project=>orderProjects.find(row=>row.projectNo===project.relatedOrderProject)||boundOrderProjects.get(project.relatedOrderProject)||null;
  let current=[...operationProductionProjectListData];
  const input=(id,label,placeholder,value="")=>`<div class="form-item"><label>${label}</label><input class="input" id="${id}" value="${escapeAttr(value)}" placeholder="${placeholder}"/></div>`;
  const select=(id,label,values,value="")=>`<div class="form-item"><label>${label}</label><select class="select" id="${id}"><option value="">全部</option>${values.map(item=>`<option value="${item}" ${item===value?"selected":""}>${item}</option>`).join("")}</select></div>`;
  const dateRange=(label,startId,endId,start="",end="")=>`<div class="form-item"><label>${label}</label><div class="date-range ep-date-range"><input class="input" type="date" id="${startId}" value="${start}"/><span>至</span><input class="input" type="date" id="${endId}" value="${end}"/></div></div>`;
  const yesNoTag=(value,yes="已关联",no="未关联")=>value===yes?tag(value,"green"):`<span style="color:#f53f3f">● ${value||no}</span>`;
  const linkCell=value=>value?`<span title="${escapeAttr(value)}">${value}</span>`:`<span class="operation-unbound-link" title="未绑定"><svg class="operation-unbound-icon" viewBox="0 0 1024 1024" aria-hidden="true"><path d="M510.983345 63.599504c246.331291 0 447.87554 201.544249 447.87554 447.87554 0 246.332315-201.544249 447.87554-447.87554 447.87554S63.108828 757.806335 63.108828 511.474021C63.108828 265.143753 264.652054 63.599504 510.983345 63.599504L510.983345 63.599504zM575.273581 639.544885l-127.913275 0 0 127.913275 127.913275 0L575.273581 639.544885zM575.273581 255.42132l-127.913275 0 0 320.67858 127.913275 0L575.273581 255.42132z" fill="currentColor"></path></svg><span>未绑定</span></span>`;

  function getProductionProjectPushRecords(project){
    const index=Math.max(0,Number(project.id)||0)-1;
    const count=2+(index%3);
    const records=[];
    for(let offset=0;offset<count;offset++){
      const failed=(index+offset)%5===0;
      const hour=String(8+(index+offset)%9).padStart(2,"0");
      const minute=String((index*7+offset*11)%60).padStart(2,"0");
      const start=`2026-08-${String(6-Math.floor(index/8)).padStart(2,"0")} ${hour}:${minute}:00`;
      const endMinute=String((Number(minute)+3+offset)%60).padStart(2,"0");
      records.push({
        index:offset+1,
        dataName:project.projectName,
        dataCode:project.productionProjectNo,
        dataType:"生产项目",
        interfaceName:offset%2===0?"生产项目主数据同步接口":"生产项目状态同步接口",
        consumer:offset%2===0?"数智施工平台":"生产管理平台",
        provider:offset%2===0?"主数据平台":"数智施工平台",
        startTime:start,
        endTime:`2026-08-${String(6-Math.floor(index/8)).padStart(2,"0")} ${hour}:${endMinute}:00`,
        status:failed?"异常":"正常",
        errorCode:failed?(offset%2===0?"504":"422"):"-",
        errorReason:failed?(offset%2===0?"接口响应超时":"生产项目字段校验失败"):"-"
      });
    }
    return records;
  }

  function openProductionProjectPushRecords(id){
    const project=operationProductionProjectListData.find(row=>row.id===Number(id));
    if(!project)return;
    const records=getProductionProjectPushRecords(project);
    const columns=[
      ["序号",row=>row.index,"center",70],["数据名称",row=>escapeAttr(row.dataName),"left",260],["数据编号",row=>escapeAttr(row.dataCode),"center",170],["数据类型",row=>tag(row.dataType,"blue"),"center",120],
      ["接口名称",row=>escapeAttr(row.interfaceName),"center",180],["消费方系统",row=>escapeAttr(row.consumer),"center",150],["提供方系统",row=>escapeAttr(row.provider),"center",150],["开始时间",row=>escapeAttr(row.startTime),"center",170],
      ["结束时间",row=>escapeAttr(row.endTime),"center",170],["状态",row=>tag(row.status,row.status==="正常"?"green":"red"),"center",100],["报错代码",row=>escapeAttr(row.errorCode),"center",100],["报错原因",row=>escapeAttr(row.errorReason),"left",260]
    ];
    const table=`<div class="operation-production-push-record-table table-card"><div class="table-wrap"><table><thead><tr>${columns.map(([title,,align,width])=>`<th class="${align}" style="width:${width}px;min-width:${width}px;max-width:${width}px">${title}</th>`).join("")}</tr></thead><tbody>${records.map(row=>`<tr>${columns.map(([,render,align,width])=>`<td class="${align}" style="width:${width}px;min-width:${width}px;max-width:${width}px">${render(row)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
    openModal("推送记录",`<div class="operation-production-push-record-modal">${table}</div>`,`<button class="btn" type="button" onclick="closeModal()">关闭</button>`,"large");
    modalBox.classList.add("operation-production-push-record-modal-box");
  }

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
    {key:"pushRecords",title:"推送记录",width:100,align:"center",render:row=>`<button type="button" class="link operation-push-record-count" onclick="openProductionProjectPushRecords(${row.id})">${getProductionProjectPushRecords(row).length}</button>`},
    {key:"operation",title:"操作",width:220,align:"center",render:row=>`<a class="link" onclick="showOperationProductionProjectDetail(${row.id})">详情</a> <a class="link" onclick="editOperationProductionProject(${row.id})">编辑</a> <a class="link" onclick="openOperationOrderProjectRebindPicker(${row.id})">换绑</a>${canCreateConstructionProject(row)?` <a class="link" onclick="createOperationConstructionProject(${row.id})">创建施工项目</a>`:""}`}
  ];

  // 仅迁移原操作列默认宽度，保留其他列及用户自定义宽度。
  if(typeof getColumnStorageKey==="function"&&typeof localStorage!=="undefined"){
    const storageKey=getColumnStorageKey("operationProductionProjectList"),migrationKey=storageKey+"_operation220";
    try{
      if(!localStorage.getItem(migrationKey)){
        const saved=JSON.parse(localStorage.getItem(storageKey)||"null");
        const operation=Array.isArray(saved)?saved.find(column=>column.key==="operation"):null;
        if(operation&&[190,250].includes(Number(operation.width))){operation.width=220;localStorage.setItem(storageKey,JSON.stringify(saved));}
        localStorage.setItem(migrationKey,"1");
      }
    }catch(error){console.warn("生产项目操作列默认宽度更新失败",error);}
  }

  function canCreateConstructionProject(row){return ["总承包","管线"].includes(row.businessType)&&!row.linkedConstructionProject&&!row.constructionDate;}
  function syncConstructionProjectLinks(){
    if(typeof constructionProjectData==="undefined")return;
    operationProductionProjectListData.forEach(row=>{
      const project=constructionProjectData.find(item=>item.productionProjectNo===row.productionProjectNo);
      if(!project)return;
      row.linkedConstructionProject=project.projectCode;
      row.constructionDate=project.constructionCreatedAt||project.approvalDate||"";
      row.constructionStatus="已立项";
    });
  }

  function readFilters(){return {
    projectName:document.getElementById("opplName")?.value.trim()||"",org:document.getElementById("opplOrg")?.value||"",manager:document.getElementById("opplManager")?.value.trim()||"",productionNo:document.getElementById("opplProductionNo")?.value.trim()||"",subNo:document.getElementById("opplSubNo")?.value.trim()||"",createMode:document.getElementById("opplCreateMode")?.value||"",managementUnit:document.getElementById("opplManagementUnit")?.value.trim()||"",bizType:document.getElementById("opplBizType")?.value||"",orderNo:document.getElementById("opplOrderNo")?.value.trim()||"",accountNo:document.getElementById("opplAccountNo")?.value.trim()||"",productionStart:document.getElementById("opplProductionStart")?.value||"",productionEnd:document.getElementById("opplProductionEnd")?.value||"",constructionStart:document.getElementById("opplConstructionStart")?.value||"",constructionEnd:document.getElementById("opplConstructionEnd")?.value||""
  };}
  function matchesStat(row){if(!state.stat)return true;const [key,value]=state.stat.split(":");return row[key]===value;}
  function apply(){syncConstructionProjectLinks();const f=state.filters;current=operationProductionProjectListData.filter(row=>{
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
  window.openProductionProjectPushRecords=openProductionProjectPushRecords;
  window.showOperationProductionProjectDetail=id=>{const row=operationProductionProjectListData.find(item=>item.id===Number(id));if(!row)return;openModal("生产项目详情",`<div class="detail-info-grid">${Object.entries({生产项目名称:row.projectName,生产项目编号:row.productionProjectNo,子公司项目编号:row.subProjectNo,创建模式:row.createMode,项目经理:row.projectManager,联系方式:standardProjectManagerMaskPhone(row.fullContact||row.contact),管理单位:row.managementUnit,项目业态:row.businessType,生产立项日期:row.productionDate,报账推送状态:row.reportStatus,关联订单项目:row.relatedOrderProject,关联施工项目:row.linkedConstructionProject||"-"}).map(([label,value])=>`<span>${label}：<b>${value}</b></span>`).join("")}</div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");};
  window.editOperationProductionProject=id=>showToast(`进入生产项目编辑：${id}`);
  window.createOperationConstructionProject=id=>{
    syncConstructionProjectLinks();
    const row=operationProductionProjectListData.find(item=>item.id===Number(id));
    if(!row||!canCreateConstructionProject(row))return;
    const fields=[
      ["项目名称",row.projectName],["项目简称",row.projectShortName],["子公司",row.company],["分公司",row.branch],
      ["项目经理",row.projectManager],["国家",row.country],["省市区",row.provinceCity],["项目地址",row.projectAddress],
      ["是否集团一体化管理模式项目",row.groupIntegratedMode],["项目状态",row.projectStatus]
    ];
    const body=`<div class="operation-detail-grid" style="grid-template-columns:repeat(4,minmax(0,1fr))">${fields.map(([label,value])=>operationReadonlyField(label,`<span class="text-ellipsis" title="${escapeAttr(value||"-")}">${escapeAttr(value||"-")}</span>`)).join("")}</div>`;
    openModal("施工立项确认",body,`<button class="btn" type="button" onclick="closeModal()">取消</button><button class="btn primary" type="button" data-construction-confirm onclick="confirmOperationConstructionProject(this)">确认</button>`,"large");
    pendingConstructionProject={id:row.id,button:modalFooter.querySelector("[data-construction-confirm]")};
  };
  window.confirmOperationConstructionProject=source=>{
    const pending=pendingConstructionProject;
    if(!pending||source!==pending.button||!source?.isConnected||modalMask.style.display!=="flex")return;
    syncConstructionProjectLinks();
    const row=operationProductionProjectListData.find(item=>item.id===pending.id);
    if(!row||!canCreateConstructionProject(row)){pendingConstructionProject=null;closeModal();renderPage();return;}
    source.disabled=true;
    let project;
    try{project=createConstructionProjectFromProductionProject(row);}
    catch(error){source.disabled=false;console.error("施工立项保存失败",error);showToast("施工立项保存失败，请重试");return;}
    pendingConstructionProject=null;
    row.linkedConstructionProject=project.projectCode;
    row.constructionDate=project.constructionCreatedAt||project.approvalDate;
    row.constructionStatus="已立项";
    closeModal();
    renderPage();
    showToast(`项目：${row.projectName} 已在施工项目一览表中完成创建`);
  };

  const orderProjectTypeOptions=typeof getDictEnabledOptionsV2285==="function"?getDictEnabledOptionsV2285("PROJECT_TYPE"):['轨交','公路','市政','建筑','环境','能源','机场','港口','园林','片区开发','产品','租售','企业管理'];
  const orderRegionOptions=[...new Set(orderProjects.map(row=>row.region))];
  tableColumnDefinitions.operationOrderPicker=[
    {key:"index",title:"序号",width:70,align:"center",headerAlign:"center"},{key:"projectName",title:"订单项目名称",width:280,align:"left",headerAlign:"left"},
    {key:"projectNo",title:"订单项目编号",width:180,align:"center",headerAlign:"center"},{key:"masterType",title:"主数据类型",width:100,align:"center",headerAlign:"center"},
    {key:"company",title:"子公司",width:130,align:"center",headerAlign:"center"},{key:"unit",title:"子公司管理单位",width:150,align:"center",headerAlign:"center"},{key:"category",title:"项目类型",width:150,align:"center",headerAlign:"center"},
    {key:"customer",title:"客户名称",width:120,align:"center",headerAlign:"center"},{key:"location",title:"项目所在地",width:130,align:"center",headerAlign:"center"},{key:"region",title:"区域市场",width:100,align:"center",headerAlign:"center"},
    {key:"bidDate",title:"中标日期",width:120,align:"center",headerAlign:"center"},{key:"bidPrice",title:"中标价（万元）",width:140,align:"center",headerAlign:"center"},{key:"splitAmount",title:"已拆分金额（万元）",width:150,align:"center",headerAlign:"center"},
    {key:"createStatus",title:"创建状态",width:110,align:"center",headerAlign:"center"},{key:"linkedCount",title:"关联生产项目",width:120,align:"center",headerAlign:"center"},{key:"operation",title:"操作",width:110,align:"center",headerAlign:"center"}
  ];
  tableColumnDefinitions.operationOrderPicker.freezeCount=0;
  function readOrderPickerFilters(){return {name:document.getElementById("orderPickerName")?.value.trim()||"",no:document.getElementById("orderPickerNo")?.value.trim()||"",company:document.getElementById("orderPickerCompany")?.value.trim()||"",customer:document.getElementById("orderPickerCustomer")?.value.trim()||"",unit:document.getElementById("orderPickerUnit")?.value.trim()||"",masterType:document.getElementById("orderPickerMasterType")?.value||"",projectType:document.getElementById("orderPickerProjectType")?.value||"",region:document.getElementById("orderPickerRegion")?.value||""};}
  function filteredOrderProjects(){const f=orderPickerState.filters;return orderProjects.filter(row=>(!f.name||row.projectName.includes(f.name))&&(!f.no||row.projectNo.includes(f.no))&&(!f.company||row.company.includes(f.company))&&(!f.customer||row.customer.includes(f.customer))&&(!f.unit||row.managementUnit.includes(f.unit))&&(!f.masterType||row.masterType===f.masterType)&&(!f.projectType||row.category===f.projectType||row.category.includes(f.projectType))&&(!f.region||row.region===f.region));}
  function renderOrderPickerTable(){
    const rows=filteredOrderProjects(),pages=Math.max(1,Math.ceil(rows.length/orderPickerState.pageSize));orderPickerState.page=Math.min(orderPickerState.page,pages);
    const start=(orderPickerState.page-1)*orderPickerState.pageSize,shown=rows.slice(start,start+orderPickerState.pageSize);
    const tbody=document.getElementById("operationOrderPickerTbody");if(tbody)tbody.innerHTML=shown.map((row,index)=>`<tr><td class="center">${start+index+1}</td><td class="text-ellipsis" title="${escapeAttr(row.projectName)}">${row.projectName}</td><td class="center">${row.projectNo}</td><td class="center">${tag(row.masterType,row.masterType==="备案制"?"green":"orange")}</td><td class="center">${row.company}</td><td class="center">${row.managementUnit}</td><td class="center">${tag(row.category,"blue")}</td><td class="center">${row.customer}</td><td class="center">${row.location}</td><td class="center">${tag(row.region,"cyan")}</td><td class="center">${row.bidDate}</td><td class="right">${row.bidPrice}</td><td class="right">${row.splitAmount}</td><td class="center">${tag(row.createStatus,row.createStatus==="已立项"?"green":row.createStatus==="待立项"?"red":"orange")}</td><td class="center">${tag(String(row.linkedCount),"blue")}</td><td class="center"><button class="btn primary mini" onclick="openOperationOrderProjectRebindConfirm(${row.id})">确认选择</button></td></tr>`).join("")||`<tr><td colspan="16" class="empty">暂无数据</td></tr>`;
    if(tbody){const visible=getVisibleColumns("operationOrderPicker"),keys=["index","projectName","projectNo","masterType","company","unit","category","customer","location","region","bidDate","bidPrice","splitAmount","createStatus","linkedCount","operation"];[...tbody.rows].forEach(row=>{const cells=[...row.cells];visible.forEach(column=>{const cell=cells[keys.indexOf(column.key)];if(cell)row.appendChild(cell);});});}
    const pickerTable=document.querySelector(".operation-order-project-picker-modal .operation-order-picker-card table");
    if(pickerTable){
      [...pickerTable.rows].forEach(row=>{
        const cells=[...row.cells];
        cells.forEach(cell=>cell.classList.remove("table-sticky-left","table-sticky-left-edge","table-sticky-operation"));
        const columns=getVisibleColumns("operationOrderPicker");
        cells.forEach((cell,index)=>{const column=columns[index];if(!column)return;const meta=getTableColumnStickyMeta("operationOrderPicker",column,columns);cell.className=`${getTableColumnClass("operationOrderPicker",column,columns)} ${cell.className}`.trim();if(meta.left)cell.style.setProperty("--table-sticky-left",`${meta.leftOffset}px`);if(meta.right)cell.style.setProperty("--table-sticky-right",`${meta.rightOffset}px`);cell.style.width=`${column.width}px`;cell.style.minWidth=`${column.width}px`;cell.style.maxWidth=`${column.width}px`;});
      });
    }
    const total=document.getElementById("operationOrderPickerTotal");if(total)total.textContent=`共 ${rows.length} 条数据`;
    const pager=document.getElementById("operationOrderPickerPager");if(pager)pager.innerHTML=`<button class="btn mini" ${orderPickerState.page<=1?"disabled":""} onclick="changeOperationOrderPickerPage(-1)">上一页</button><b>第 ${orderPickerState.page} / ${pages} 页</b><button class="btn mini" ${orderPickerState.page>=pages?"disabled":""} onclick="changeOperationOrderPickerPage(1)">下一页</button><select class="select mini-select" onchange="changeOperationOrderPickerPageSize(this.value)">${[10,20,50].map(size=>`<option value="${size}" ${size===orderPickerState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;
  }
  window.openOperationOrderProjectRebindPicker=id=>{
    orderPickerState.targetId=Number(id);orderPickerState.filters={};orderPickerState.page=1;
    const fields=`${input("orderPickerName","订单项目名称","请输入")}${input("orderPickerNo","订单项目编号","请输入")}${input("orderPickerCompany","子公司","请输入")}${input("orderPickerCustomer","客户名称","请输入")}${input("orderPickerUnit","子公司管理单位","请输入")}${select("orderPickerMasterType","主数据类型",["审批制","备案制"],orderPickerState.filters.masterType)}${select("orderPickerProjectType","项目类型",orderProjectTypeOptions,orderPickerState.filters.projectType)}${select("orderPickerRegion","区域市场",orderRegionOptions,orderPickerState.filters.region)}`;
    openNestedModal("绑定订单项目",`${renderUnifiedQueryCard(fields,{id:"operationOrderPickerQuery",queryFn:"queryOperationOrderPicker()",resetFn:"resetOperationOrderPicker()"})}<section class="card table-card operation-order-picker-card"><div class="card-hd"><div class="card-title">订单项目列表</div><div class="actions"><button class="btn" type="button" onclick="refreshOperationOrderPicker()">刷新</button><button class="column-setting-icon-btn" type="button" title="列设置" onclick="openColumnSetting('operationOrderPicker','renderOrderPickerTable')">⚙</button></div></div><div class="table-wrap"><table><thead><tr id="operationOrderPickerThead">${renderTableHeaderByColumns("operationOrderPicker")}</tr></thead><tbody id="operationOrderPickerTbody"></tbody></table></div><div class="pagination"><span id="operationOrderPickerTotal"></span><div class="pager" id="operationOrderPickerPager"></div></div></section>`);
    document.querySelector(".nested-modal-mask:last-of-type .nested-modal")?.classList.add("operation-order-project-picker-modal");renderOrderPickerTable();
  };
  window.queryOperationOrderPicker=()=>{orderPickerState.filters=readOrderPickerFilters();orderPickerState.page=1;renderOrderPickerTable();};
  window.resetOperationOrderPicker=()=>{orderPickerState.filters={};orderPickerState.page=1;["orderPickerName","orderPickerNo","orderPickerCompany","orderPickerCustomer","orderPickerUnit","orderPickerMasterType","orderPickerProjectType","orderPickerRegion"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});renderOrderPickerTable();};
  window.renderOrderPickerTable=renderOrderPickerTable;
  window.refreshOperationOrderPicker=()=>{renderOrderPickerTable();showToast("订单项目列表已刷新");};
  window.changeOperationOrderPickerPage=direction=>{const pages=Math.max(1,Math.ceil(filteredOrderProjects().length/orderPickerState.pageSize));orderPickerState.page=Math.min(pages,Math.max(1,orderPickerState.page+Number(direction)));renderOrderPickerTable();};
  window.changeOperationOrderPickerPageSize=size=>{orderPickerState.pageSize=Number(size)||10;orderPickerState.page=1;renderOrderPickerTable();};
  function renderOperationOrderProjectRebindInfo(project,emptyLabel="未关联订单项目"){
    if(!project)return `<div class="operation-rebind-empty">${emptyLabel}</div>`;
    const fields=[
      ["订单项目名称",project.projectName],
      ["订单项目编号",project.projectNo],
      ["子公司管理单位",project.managementUnit],
      ["客户名称",project.customer],
      ["中标日期",project.bidDate],
      ["中标价（万元）",project.bidPrice],
      ["项目类型",project.category],
      ["区域市场",project.region],
      ["项目所在地",project.location]
    ];
    return `<dl class="operation-rebind-info-grid">${fields.map(([label,value])=>`<div><dt>${label}</dt><dd>${escapeAttr(value??"-")}</dd></div>`).join("")}</dl>`;
  }

  function openOperationOrderProjectRebindConfirm(orderId){
    const pickerMask=document.getElementById("operationOrderPickerTbody")?.closest(".nested-modal-mask");
    if(!pickerMask||pendingOrderRebind?.mask.isConnected)return;
    const target=operationProductionProjectListData.find(row=>row.id===orderPickerState.targetId),selected=orderProjects.find(row=>row.id===Number(orderId));
    if(!target||!selected)return;
    const previous=getBoundOrderProject(target)||(target.relatedOrderProject?{projectNo:target.relatedOrderProject}:null);
    const body=`<div class="operation-order-rebind-confirm-body">
      <div class="operation-rebind-question"><span>?</span><div><strong>是否确认换绑？</strong><p>确认后将执行订单项目换绑操作，原订单项目的关联关系将被解除，请谨慎操作。</p></div></div>
      <div class="operation-rebind-panels">
        <section class="operation-rebind-panel before"><header><span class="operation-rebind-panel-icon">${renderTDesignIcon("link",{size:20})}</span><strong>换绑前订单项目信息</strong><em>当前关联</em></header><div class="operation-rebind-panel-body">${renderOperationOrderProjectRebindInfo(previous)}</div></section>
        <div class="operation-rebind-vs" aria-hidden="true"><b>VS</b><span>→</span></div>
        <section class="operation-rebind-panel after"><header><span class="operation-rebind-panel-icon">${renderTDesignIcon("link",{size:20})}</span><strong>换绑后订单项目信息</strong><em>新关联</em></header><div class="operation-rebind-panel-body">${renderOperationOrderProjectRebindInfo(selected)}</div></section>
      </div>
    </div>`;
    const mask=openNestedModal("订单项目换绑确认",body,`<button class="btn" type="button" onclick="cancelOperationOrderProjectRebind(this)">取消</button><button class="btn primary" type="button" onclick="applyOperationOrderProjectRebind(this)">确认</button>`);
    mask.classList.add("operation-order-rebind-confirm-mask");
    mask.querySelector(".nested-modal").classList.add("large","operation-order-rebind-confirm-modal");
    pendingOrderRebind={mask,pickerMask,targetId:target.id,orderId:selected.id,previousOrderNo:target.relatedOrderProject};
  }

  window.openOperationOrderProjectRebindConfirm=openOperationOrderProjectRebindConfirm;
  window.confirmOperationOrderProjectRebind=openOperationOrderProjectRebindConfirm;
  window.cancelOperationOrderProjectRebind=source=>{
    const mask=source?.closest(".operation-order-rebind-confirm-mask");
    if(!mask)return;
    if(pendingOrderRebind?.mask===mask)pendingOrderRebind=null;
    closeNestedModal(mask);
  };
  window.applyOperationOrderProjectRebind=source=>{
    const pending=pendingOrderRebind;
    if(!pending||!pending.mask.isConnected||!pending.pickerMask.isConnected||source?.closest(".operation-order-rebind-confirm-mask")!==pending.mask)return;
    const target=operationProductionProjectListData.find(row=>row.id===pending.targetId),selected=orderProjects.find(row=>row.id===pending.orderId);
    if(!target||!selected)return;
    if(target.relatedOrderProject!==pending.previousOrderNo){cancelOperationOrderProjectRebind(source);showToast("当前关联已变化，请重新选择订单项目");return;}
    pendingOrderRebind=null;
    source.disabled=true;
    const previous=getBoundOrderProject(target);
    if(previous&&previous.id!==selected.id&&previous.linkedCount>0)previous.linkedCount-=1;
    if(!previous||previous.id!==selected.id)selected.linkedCount+=1;
    target.relatedOrderProject=selected.projectNo;target.orderStatus="已关联";
    closeNestedModal(pending.mask);
    closeNestedModal(pending.pickerMask);
    apply();renderOperationProductionProjectListPage();showToast("订单项目已换绑成功");
  };
})();
