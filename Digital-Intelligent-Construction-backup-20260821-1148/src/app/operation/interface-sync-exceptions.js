/* V2.2.301 interface synchronization exception records */
const interfaceSyncExceptionState={consumer:"",provider:"",dataType:"",type:"",startTime:"",endTime:"",page:1,pageSize:50};
const interfaceSyncSystemNames=["数智施工平台","数智业财平台","主数据平台","子公司业务系统"];
const interfaceSyncDataTypes=["生产项目","核算项目","订单项目"];
const interfaceSyncInterfaceNames=["生产项目查询接口","核算项目查询接口"];

const interfaceSyncExceptionRows=[
  ["上海示范区线工程 SFQSG-15 标","PRJ-SD-2026-001","数智施工平台","项目主数据平台","接口超时","2026-07-21 08:00","2026-07-21 08:12","504","上游服务响应超时",3],
  ["郑州航空港片区综合管廊工程","PRJ-SD-2025-018","产值管理系统","项目主数据平台","权限异常","2026-07-21 09:00","2026-07-21 09:03","403","调用方接口权限校验失败",2],
  ["临港新片区地下通道工程","PRJ-SD-2024-023","数智施工平台","合同管理系统","资源不存在","2026-07-21 09:00","2026-07-21 09:01","404","未找到对应合同主数据",1],
  ["杭金衢高速至杭绍台高速联络线工程PPP项目第1合同段","PRJ-LQ-2025-011","经营分析平台","产值管理系统","服务异常","2026-07-21 10:00","2026-07-21 10:08","500","产值汇总服务内部处理异常",4],
  ["嘉闵线北延伸道路配套工程","PRJ-LQ-2024-016","项目主数据平台","组织管理系统","数据校验异常","2026-07-21 10:00","2026-07-21 10:02","422","分公司组织编码不能为空",2],
  ["新马工业园节能环保产业园项目","PRJ-SZ-2026-003","数智施工平台","投资管理系统","接口超时","2026-07-21 11:00","2026-07-21 11:15","504","投资项目信息查询超时",3],
  ["深圳前海综合交通枢纽配套工程","PRJ-SZ-2025-021","财务共享平台","数智施工平台","认证异常","2026-07-21 11:00","2026-07-21 11:01","401","接口访问令牌已失效",1],
  ["苏州河深隧调蓄池工程","PRJ-HJ-2025-007","低碳管理系统","项目主数据平台","服务异常","2026-07-21 12:00","2026-07-21 12:06","500","项目碳排放基础数据转换失败",5],
  ["浦东新区雨污分流提升工程","PRJ-HJ-2023-029","数智施工平台","物资管理系统","资源不存在","2026-07-21 13:00","2026-07-21 13:01","404","物料分类编码不存在",2],
  ["张江科学城创新中心项目","PRJ-SJ-2026-006","设计协同平台","项目主数据平台","数据校验异常","2026-07-21 13:00","2026-07-21 13:04","422","生产项目编号格式校验失败",3],
  ["松江枢纽综合开发项目","PRJ-SJ-2025-015","数智施工平台","设计协同平台","权限异常","2026-07-21 14:00","2026-07-21 14:02","403","当前应用无图纸目录读取权限",2],
  ["上海市轨道交通23号线一期土建工程","PRJ-NJ-2024-008","安全管理系统","实名制平台","接口超时","2026-07-21 14:00","2026-07-21 14:10","504","实名制人员数据同步超时",4],
  ["G318沪青平公路快速化改建工程","PRJ-LQ-2025-030","数智施工平台","进度管理系统","服务异常","2026-07-21 15:00","2026-07-21 15:07","500","里程碑计划解析失败",3],
  ["南京江北新区综合管廊二期工程","PRJ-SZ-2026-009","经营分析平台","合同管理系统","认证异常","2026-07-21 16:00","2026-07-21 16:01","401","系统签名校验未通过",1],
  ["装配式构件供应基地扩建项目","PRJ-WZ-2026-002","物资管理系统","项目主数据平台","资源不存在","2026-07-21 16:00","2026-07-21 16:02","404","生产项目尚未完成主数据发布",2]
].map((row,index)=>({id:index+1,dataName:row[0],dataCode:row[1],dataType:interfaceSyncDataTypes[index%interfaceSyncDataTypes.length],interfaceName:interfaceSyncInterfaceNames[index%interfaceSyncInterfaceNames.length],consumer:interfaceSyncSystemNames[index%interfaceSyncSystemNames.length],provider:interfaceSyncSystemNames[(index+1)%interfaceSyncSystemNames.length],exceptionType:row[4],startTime:row[5],endTime:row[6],status:"异常",errorCode:row[7],errorReason:row[8],pushCount:row[9]}));

tableColumnDefinitions.interfaceSyncException=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(interfaceSyncExceptionState.page-1)*interfaceSyncExceptionState.pageSize+index+1},
  {key:"dataName",title:"数据名称",width:280,render:row=>row.dataName},
  {key:"dataCode",title:"数据编号",width:170,align:"center",render:row=>row.dataCode},
  {key:"dataType",title:"数据类型",width:120,align:"center",render:row=>tag(row.dataType,row.dataType==="生产项目"?"blue":row.dataType==="核算项目"?"green":"orange")},
  {key:"interfaceName",title:"接口名称",width:180,align:"center",render:row=>row.interfaceName},
  {key:"consumer",title:"消费方系统",width:150,align:"center",render:row=>row.consumer},
  {key:"provider",title:"提供方系统",width:150,align:"center",render:row=>row.provider},
  {key:"startTime",title:"开始时间",width:170,align:"center",render:row=>row.startTime},
  {key:"endTime",title:"结束时间",width:170,align:"center",render:row=>row.endTime},
  {key:"status",title:"状态",width:100,align:"center",render:row=>tag(row.status,"red")},
  {key:"errorCode",title:"报错代码",width:100,align:"center",render:row=>row.errorCode},
  {key:"errorReason",title:"报错原因",width:260,render:row=>`<span class="text-ellipsis" title="${escapeAttr(row.errorReason)}">${row.errorReason}</span>`},
  {key:"pushCount",title:"推送次数",width:100,align:"center",render:row=>row.pushCount},
  {key:"operation",title:"操作",width:150,align:"center",render:row=>`<a class="link" onclick="openInterfaceSyncExceptionDetail(${row.id})">详情</a>　<a class="link" onclick="retryInterfaceSyncException(${row.id})">重新推送</a>`}
];

function interfaceSyncExceptionUnique(key){return [...new Set(interfaceSyncExceptionRows.map(row=>row[key]).filter(Boolean))];}
function renderInterfaceSyncExceptionOptions(values,current){return `<option value="">全部</option>${values.map(value=>`<option value="${escapeAttr(value)}" ${value===current?"selected":""}>${value}</option>`).join("")}`;}

function getInterfaceSyncExceptionFilteredRows(){
  const state=interfaceSyncExceptionState;
  return interfaceSyncExceptionRows.filter(row=>{
    if(state.consumer&&row.consumer!==state.consumer)return false;
    if(state.provider&&row.provider!==state.provider)return false;
    if(state.dataType&&row.dataType!==state.dataType)return false;
    if(state.type&&row.exceptionType!==state.type)return false;
    if(state.startTime&&row.startTime<state.startTime.replace("T"," "))return false;
    if(state.endTime&&row.endTime>state.endTime.replace("T"," "))return false;
    return true;
  });
}

function getInterfaceSyncExceptionPagedRows(){
  const rows=getInterfaceSyncExceptionFilteredRows();
  const pages=Math.max(1,Math.ceil(rows.length/interfaceSyncExceptionState.pageSize));
  interfaceSyncExceptionState.page=Math.min(pages,Math.max(1,interfaceSyncExceptionState.page));
  const start=(interfaceSyncExceptionState.page-1)*interfaceSyncExceptionState.pageSize;
  return rows.slice(start,start+interfaceSyncExceptionState.pageSize);
}

function queryInterfaceSyncExceptions(){
  interfaceSyncExceptionState.consumer=document.getElementById("interfaceSyncConsumer")?.value||"";
  interfaceSyncExceptionState.provider=document.getElementById("interfaceSyncProvider")?.value||"";
  interfaceSyncExceptionState.dataType=document.getElementById("interfaceSyncDataType")?.value||"";
  interfaceSyncExceptionState.type=document.getElementById("interfaceSyncType")?.value||"";
  interfaceSyncExceptionState.startTime=document.getElementById("interfaceSyncStartTime")?.value||"";
  interfaceSyncExceptionState.endTime=document.getElementById("interfaceSyncEndTime")?.value||"";
  interfaceSyncExceptionState.page=1;
  renderInterfaceSyncExceptionPage();
}

function resetInterfaceSyncExceptions(){Object.assign(interfaceSyncExceptionState,{consumer:"",provider:"",dataType:"",type:"",startTime:"",endTime:"",page:1});renderInterfaceSyncExceptionPage();}
function changeInterfaceSyncExceptionPage(delta){const pages=Math.max(1,Math.ceil(getInterfaceSyncExceptionFilteredRows().length/interfaceSyncExceptionState.pageSize));interfaceSyncExceptionState.page=Math.min(pages,Math.max(1,interfaceSyncExceptionState.page+Number(delta||0)));renderInterfaceSyncExceptionTable();}
function changeInterfaceSyncExceptionPageSize(value){interfaceSyncExceptionState.pageSize=Number(value)||50;interfaceSyncExceptionState.page=1;renderInterfaceSyncExceptionTable();}

function renderInterfaceSyncExceptionTable(){
  renderTableByColumns("interfaceSyncException",getInterfaceSyncExceptionPagedRows(),"interfaceSyncExceptionTbody");
  const total=getInterfaceSyncExceptionFilteredRows().length;
  const pages=Math.max(1,Math.ceil(total/interfaceSyncExceptionState.pageSize));
  const totalNode=document.getElementById("interfaceSyncExceptionTotalText");
  const pageNode=document.getElementById("interfaceSyncExceptionPageText");
  if(totalNode)totalNode.textContent=`共 ${total} 条`;
  if(pageNode)pageNode.innerHTML=`<button class="btn mini" onclick="changeInterfaceSyncExceptionPage(-1)" ${interfaceSyncExceptionState.page<=1?"disabled":""}>上一页</button><b>第 ${interfaceSyncExceptionState.page} / ${pages} 页</b><button class="btn mini" onclick="changeInterfaceSyncExceptionPage(1)" ${interfaceSyncExceptionState.page>=pages?"disabled":""}>下一页</button><select class="select mini-select" onchange="changeInterfaceSyncExceptionPageSize(this.value)">${[10,20,50].map(size=>`<option value="${size}" ${size===interfaceSyncExceptionState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;
}

function openInterfaceSyncExceptionDetail(id){
  const row=interfaceSyncExceptionRows.find(item=>item.id===Number(id));
  if(!row)return showToast("未找到异常记录");
  openModal("接口同步异常详情",`<div class="operation-detail-grid">${[
    ["数据名称",row.dataName],["数据编号",row.dataCode],["数据类型",row.dataType],["接口名称",row.interfaceName],["消费方系统",row.consumer],["提供方系统",row.provider],["异常类型",row.exceptionType],["开始时间",row.startTime],["结束时间",row.endTime],["状态",row.status],["报错代码",row.errorCode],["报错原因",row.errorReason],["推送次数",row.pushCount]
  ].map(item=>operationReadonlyField(item[0],String(item[1]),false,item[0]==="数据名称"||item[0]==="报错原因")).join("")}</div>`,`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="retryInterfaceSyncException(${row.id});closeModal()">重新推送</button>`,"large");
}

function retryInterfaceSyncException(id){const row=interfaceSyncExceptionRows.find(item=>item.id===Number(id));if(!row)return;row.pushCount+=1;renderInterfaceSyncExceptionTable();showToast(`已重新推送：${row.dataName}`);}

function renderInterfaceSyncExceptionPage(){
  detailPage.style.display="none";listPage.style.display="flex";
  const rows=getInterfaceSyncExceptionFilteredRows();
  const pages=Math.max(1,Math.ceil(rows.length/interfaceSyncExceptionState.pageSize));
  listPage.innerHTML=`<div class="compact-title-row"><div class="module-title">接口同步异常记录</div></div>${renderUnifiedQueryCard(`
    <div class="form-item"><label>消费方系统</label><select class="select" id="interfaceSyncConsumer">${renderInterfaceSyncExceptionOptions(interfaceSyncExceptionUnique("consumer"),interfaceSyncExceptionState.consumer)}</select></div>
    <div class="form-item"><label>提供方系统</label><select class="select" id="interfaceSyncProvider">${renderInterfaceSyncExceptionOptions(interfaceSyncExceptionUnique("provider"),interfaceSyncExceptionState.provider)}</select></div>
    <div class="form-item"><label>数据类型</label><select class="select" id="interfaceSyncDataType">${renderInterfaceSyncExceptionOptions(interfaceSyncDataTypes,interfaceSyncExceptionState.dataType)}</select></div>
    <div class="form-item"><label>异常类型</label><select class="select" id="interfaceSyncType">${renderInterfaceSyncExceptionOptions(interfaceSyncExceptionUnique("exceptionType"),interfaceSyncExceptionState.type)}</select></div>
    <div class="form-item"><label>接口时段</label><div class="date-range ep-date-range"><input class="input" id="interfaceSyncStartTime" type="datetime-local" step="3600" value="${interfaceSyncExceptionState.startTime}"/><span>至</span><input class="input" id="interfaceSyncEndTime" type="datetime-local" step="3600" value="${interfaceSyncExceptionState.endTime}"/></div></div>
  `,{title:"查询条件",queryFn:"queryInterfaceSyncExceptions()",resetFn:"resetInterfaceSyncExceptions()",canCollapse:false})}${renderUnifiedTableCard({tableKey:"interfaceSyncException",tbodyId:"interfaceSyncExceptionTbody",renderFnName:"renderInterfaceSyncExceptionTable",refreshAction:"renderInterfaceSyncExceptionPage()",exportAction:"showToast('对接异常明细导出成功')",title:"对接异常明细",total:rows.length,pageText:`<span id="interfaceSyncExceptionPageText">第 1 / ${pages} 页　每页 ${interfaceSyncExceptionState.pageSize} 条</span>`})}`;
  renderInterfaceSyncExceptionTable();
}
