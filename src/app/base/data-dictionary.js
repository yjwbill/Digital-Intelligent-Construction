/* V2.2.84 EOF effective PC data dictionary */
const dataDictionaryPaletteV2284=[
  {name:"默认灰",text:"#909399",border:"#D9DDE5",bg:"#F4F4F5"},
  {name:"成功绿",text:"#00A94F",border:"#AEEBC2",bg:"#EAFBF0"},
  {name:"主蓝",text:"#1F6BFF",border:"#CDE2FF",bg:"#EAF4FF"},
  {name:"警告橙",text:"#F59E0B",border:"#FFE1B5",bg:"#FFF6E8"},
  {name:"危险红",text:"#F04438",border:"#FFC3C3",bg:"#FFF0F0"},
  {name:"紫色",text:"#7C3AED",border:"#E1D0FF",bg:"#F5F0FF"},
  {name:"青色",text:"#0891B2",border:"#A5F3FC",bg:"#ECFEFF"},
  {name:"粉色",text:"#DB2777",border:"#FBCFE8",bg:"#FDF2F8"},
  {name:"靛蓝",text:"#4F46E5",border:"#C7D2FE",bg:"#EEF2FF"},
  {name:"棕色",text:"#A16207",border:"#FDE68A",bg:"#FEFCE8"}
];
const dataDictionaryPaletteKeysV2284=["gray","green","blue","orange","red","purple","cyan","pink","indigo","yellow"];
const dataDictionaryPaletteIndexV2284={default:0,gray:0,green:1,blue:2,orange:3,red:4,purple:5,cyan:6,pink:7,indigo:8,yellow:9,brown:9};
const dataDictionaryExcludedCodesV2284=new Set(["ORG_TREE"]);
const dataDictionaryStateV2284={active:"PROJECT_STATUS",dictKeyword:"",valueKeyword:"",valuePage:1,valuePageSize:50,localLoaded:false,localLoading:false};
const dataDictionaryListV2284=[
  {name:"项目状态",code:"PROJECT_STATUS",remark:"项目全生命周期状态"},
  {name:"项目类型",code:"PROJECT_TYPE",remark:"项目业务类型"},
  {name:"项目实施模式",code:"PROJECT_DELIVERY_MODE",remark:"项目承发包/实施模式"},
  {name:"项目管控等级",code:"PROJECT_CONTROL_LEVEL",remark:"项目分级管控口径"},
  {name:"隐患状态",code:"ISSUE_STATUS",remark:"隐患治理状态"},
  {name:"升级状态",code:"UPGRADE_STATUS",remark:"升级闭环状态"},
  {name:"人员状态",code:"PERSONNEL_STATUS",remark:"实名制人员状态"},
  {name:"预警类型",code:"ALERT_TYPE",remark:"预警消息分类"},
  {name:"劳务类型",code:"LABOR_TYPE",remark:"劳务人员类型"}
];
const dataDictionaryValuesV2284={
  PROJECT_STATUS:[
    {name:"在建",code:"BUILDING",status:"启用",palette:1,remark:"可被新项目选择"},
    {name:"停工",code:"STOPPED",status:"启用",palette:4,remark:"可用于项目临时停工"},
    {name:"完工",code:"FINISHED",status:"启用",palette:2,remark:"项目已完工"},
    {name:"筹备",code:"PREPARING",status:"启用",palette:3,remark:"项目前期筹备"},
    {name:"作废",code:"VOID",status:"禁用",palette:0,remark:"禁用值不允许新增选择，历史数据保留"}
  ],
  PROJECT_TYPE:[
    {name:"轨道交通",code:"RAIL_TRANSIT",status:"启用",palette:2,remark:"地铁、轨交区间与车站"},
    {name:"房建工程",code:"BUILDING",status:"启用",palette:2,remark:"房屋建筑工程"},
    {name:"市政工程",code:"MUNICIPAL",status:"启用",palette:6,remark:"市政道路、桥梁、管线"},
    {name:"水务工程",code:"WATER",status:"启用",palette:6,remark:"水务与环境治理"},
    {name:"旧类型",code:"OLD_TYPE",status:"禁用",palette:0,remark:"历史兼容"}
  ],
  PROJECT_DELIVERY_MODE:[
    {name:"施工总承包",code:"GCC",status:"启用",palette:3,remark:"项目实施模式"},
    {name:"BOT",code:"BOT",status:"启用",palette:2,remark:"项目实施模式"},
    {name:"EPC",code:"EPC",status:"启用",palette:3,remark:"项目实施模式"},
    {name:"F+",code:"F+",status:"启用",palette:8,remark:"项目实施模式"},
    {name:"PPP",code:"PPP",status:"启用",palette:5,remark:"项目实施模式"},
    {name:"专业分包",code:"zyfb",status:"启用",palette:8,remark:"项目实施模式"},
    {name:"劳务分包",code:"lwfb",status:"启用",palette:6,remark:"项目实施模式"},
    {name:"其他",code:"Other",status:"启用",palette:0,remark:"项目实施模式"}
  ],
  PROJECT_CONTROL_LEVEL:[
    {name:"股份重大工程项目",code:"01",status:"启用",palette:5,remark:"项目管控等级"},
    {name:"子公司重大项目",code:"02",status:"启用",palette:3,remark:"项目管控等级"},
    {name:"子公司一般项目",code:"03",status:"启用",palette:0,remark:"项目管控等级"}
  ],
  ISSUE_STATUS:[
    {name:"草稿",code:"DRAFT",status:"启用",palette:0,remark:""},
    {name:"待指派",code:"WAIT_ASSIGN",status:"启用",palette:0,remark:""},
    {name:"待整改",code:"WAIT_RECTIFY",status:"启用",palette:3,remark:""},
    {name:"待核验",code:"WAIT_VERIFY",status:"启用",palette:2,remark:""},
    {name:"已完成",code:"DONE",status:"启用",palette:1,remark:""},
    {name:"作废",code:"VOID",status:"禁用",palette:0,remark:"历史兼容"}
  ],
  UPGRADE_STATUS:[
    {name:"未升级",code:"NONE",status:"启用",palette:0,remark:""},
    {name:"已升级",code:"UPGRADED",status:"启用",palette:3,remark:""},
    {name:"已闭环",code:"CLOSED",status:"启用",palette:1,remark:""}
  ],
  PERSONNEL_STATUS:[
    {name:"已进场",code:"IN",status:"启用",palette:1,remark:""},
    {name:"已退场",code:"OUT",status:"启用",palette:0,remark:""},
    {name:"黑名单",code:"BLACK",status:"启用",palette:4,remark:""}
  ],
  ALERT_TYPE:[
    {name:"安全预警",code:"SAFETY",status:"启用",palette:4,remark:""},
    {name:"进度预警",code:"SCHEDULE",status:"启用",palette:3,remark:""},
    {name:"经济预警",code:"ECONOMY",status:"启用",palette:8,remark:""}
  ],
  LABOR_TYPE:[
    {name:"劳务工人",code:"WORKER",status:"启用",palette:2,remark:""},
    {name:"特种作业人员",code:"SPECIAL",status:"启用",palette:5,remark:""},
    {name:"管理人员",code:"MANAGER",status:"启用",palette:6,remark:""}
  ]
};

function ensureBaseDataDictionaryMenuV2284(){
  const base=businessMenus.base;
  if(!base || base.menus.some(item=>item.name==="数据配置"))return;
  base.menus.push({
    icon:"▦",
    name:"数据配置",
    open:false,
    children:[{name:"数据字典"}]
  });
}

function selectDataDictionaryV2284(code){
  dataDictionaryStateV2284.active=code;
  dataDictionaryStateV2284.valueKeyword="";
  dataDictionaryStateV2284.valuePage=1;
  renderDataDictionaryPageV2284();
}

function searchDataDictionaryV2284(value){
  dataDictionaryStateV2284.dictKeyword=value || "";
  dataDictionaryStateV2284.valuePage=1;
  renderDataDictionaryPageV2284();
}

function searchDataDictionaryValueV2284(value){
  dataDictionaryStateV2284.valueKeyword=value || "";
  dataDictionaryStateV2284.valuePage=1;
  renderDataDictionaryPageV2284();
}

function getActiveDataDictionaryV2284(){
  return dataDictionaryListV2284.find(item=>item.code===dataDictionaryStateV2284.active) || dataDictionaryListV2284[0];
}

function getDataDictionaryFilteredListV2284(){
  const kw=dataDictionaryStateV2284.dictKeyword.trim().toLowerCase();
  return dataDictionaryListV2284.filter(item=>!dataDictionaryExcludedCodesV2284.has(item.code) && (!kw || item.name.toLowerCase().includes(kw) || item.code.toLowerCase().includes(kw)));
}

function getDataDictionaryFilteredValuesV2284(){
  const active=getActiveDataDictionaryV2284();
  const kw=dataDictionaryStateV2284.valueKeyword.trim().toLowerCase();
  return (dataDictionaryValuesV2284[active.code] || []).filter(item=>!kw || item.name.toLowerCase().includes(kw) || item.code.toLowerCase().includes(kw));
}

function getDataDictionaryPagedValuesV2284(){
  const rows=getDataDictionaryFilteredValuesV2284();
  const totalPages=Math.max(1,Math.ceil(rows.length/dataDictionaryStateV2284.valuePageSize));
  dataDictionaryStateV2284.valuePage=Math.min(Math.max(1,dataDictionaryStateV2284.valuePage),totalPages);
  const start=(dataDictionaryStateV2284.valuePage-1)*dataDictionaryStateV2284.valuePageSize;
  return rows.slice(start,start+dataDictionaryStateV2284.valuePageSize);
}

function changeDataDictionaryValuePageV2284(dir){
  const total=getDataDictionaryFilteredValuesV2284().length;
  const totalPages=Math.max(1,Math.ceil(total/dataDictionaryStateV2284.valuePageSize));
  dataDictionaryStateV2284.valuePage=Math.min(Math.max(1,dataDictionaryStateV2284.valuePage+dir),totalPages);
  renderDataDictionaryPageV2284();
}

function changeDataDictionaryValuePageSizeV2284(value){
  dataDictionaryStateV2284.valuePageSize=Number(value)||50;
  dataDictionaryStateV2284.valuePage=1;
  renderDataDictionaryPageV2284();
}

function normalizeDataDictionaryPaletteV2284(value){
  if(typeof value==="number")return value;
  const raw=String(value ?? "").trim();
  if(raw==="")return 0;
  if(/^\d+$/.test(raw))return Number(raw);
  return dataDictionaryPaletteIndexV2284[raw.toLowerCase()] ?? 0;
}

function getDataDictionaryPaletteKeyV2284(value){
  const index=normalizeDataDictionaryPaletteV2284(value);
  return dataDictionaryPaletteKeysV2284[index] || "gray";
}

function getDataDictionaryPalette(row){
  return dataDictionaryPaletteV2284[normalizeDataDictionaryPaletteV2284(row.palette)] || dataDictionaryPaletteV2284[0];
}

function renderDataDictionaryPaletteTagV2284(row){
  const palette=getDataDictionaryPalette(row);
  return `<span class="dict-value-name" style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${row.name}</span>`;
}

function renderDataDictionaryStatusTagV2284(status){
  return `<span class="dict-status ${status==="启用"?"enabled":"disabled"}">${status}</span>`;
}

function refreshDataDictionaryConsumersV2284(){
  if(typeof applyDictionaryToProjectMockDataV2285==="function"){
    applyDictionaryToProjectMockDataV2285();
  }
}

function buildDataDictionaryPayloadV2284(){
  return {
    schemaVersion:"1.0.0",
    dataVersion:"browser-working-copy",
    generatedAt:new Date().toISOString().slice(0,19).replace("T"," "),
    description:"Data dictionary working copy from demo UI.",
    dictTypes:dataDictionaryListV2284.filter(item=>!dataDictionaryExcludedCodesV2284.has(item.code)).map((item,index)=>({
      id:`dict-type-${item.code}`,
      dictCode:item.code,
      dictName:item.name,
      remark:item.remark || "",
      sortNo:index+1,
      status:"ENABLED",
      createdAt:"",
      updatedAt:""
    })),
    dictItems:Object.entries(dataDictionaryValuesV2284).filter(([dictCode])=>!dataDictionaryExcludedCodesV2284.has(dictCode)).flatMap(([dictCode,items])=>items.map((item,index)=>({
      id:`dict-item-${dictCode}-${String(index+1).padStart(3,"0")}`,
      dictCode,
      itemCode:item.code,
      itemName:item.name,
      status:item.status==="启用"?"ENABLED":"DISABLED",
      sortNo:index+1,
      palette:getDataDictionaryPaletteKeyV2284(item.palette),
      remark:item.remark || "",
      createdAt:"",
      updatedAt:""
    })))
  };
}

function syncDataDictionaryToLocalStoreV2284(){
  // Static deployments have no writeable API. Keep the working copy in the shared browser master-data store.
  persistMasterData("dictionaries",[buildDataDictionaryPayloadV2284()]);
}

function applyDataDictionaryPayloadV2284(payload){
  if(!payload || !Array.isArray(payload.dictTypes) || !Array.isArray(payload.dictItems))return false;
  const types=[...payload.dictTypes]
    .sort((a,b)=>(Number(a.sortNo)||999)-(Number(b.sortNo)||999))
    .map(item=>({
      name:item.dictName || item.name || item.dictCode,
      code:item.dictCode,
      remark:item.remark || ""
    }))
    .filter(item=>item.code && !dataDictionaryExcludedCodesV2284.has(item.code));
  if(!types.length)return false;

  dataDictionaryListV2284.splice(0,dataDictionaryListV2284.length,...types);
  Object.keys(dataDictionaryValuesV2284).forEach(key=>delete dataDictionaryValuesV2284[key]);
  payload.dictItems
    .slice()
    .sort((a,b)=>(Number(a.sortNo)||999)-(Number(b.sortNo)||999))
    .forEach(item=>{
      const dictCode=item.dictCode;
      if(!dictCode || dataDictionaryExcludedCodesV2284.has(dictCode))return;
      if(!dataDictionaryValuesV2284[dictCode])dataDictionaryValuesV2284[dictCode]=[];
      dataDictionaryValuesV2284[dictCode].push({
        name:item.itemName || item.name || item.itemCode,
        code:item.itemCode || item.code,
        status:item.status==="DISABLED"?"禁用":"启用",
        palette:normalizeDataDictionaryPaletteV2284(item.palette),
        remark:item.remark || ""
      });
    });
  if(!dataDictionaryListV2284.some(item=>item.code===dataDictionaryStateV2284.active)){
    dataDictionaryStateV2284.active=dataDictionaryListV2284[0]?.code || "";
  }
  refreshDataDictionaryConsumersV2284();
  return true;
}

function ensureDataDictionaryLocalLoadedV2284(){
  if(dataDictionaryStateV2284.localLoaded || dataDictionaryStateV2284.localLoading)return;
  dataDictionaryStateV2284.localLoading=true;
  const seed=buildDataDictionaryPayloadV2284();
  const stored=window.EMMasterData?.ensure("dictionaries",[seed]);
  const payload=Array.isArray(stored) && stored[0] ? stored[0] : seed;
  applyDataDictionaryPayloadV2284(payload);
  dataDictionaryStateV2284.localLoaded=true;
  dataDictionaryStateV2284.localLoading=false;
}

tableColumnDefinitions.dataDictionaryValue=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(dataDictionaryStateV2284.valuePage-1)*dataDictionaryStateV2284.valuePageSize+index+1},
  {key:"name",title:"字典值名称",width:180,align:"left",render:row=>renderDataDictionaryPaletteTagV2284(row)},
  {key:"code",title:"字典值编码",width:100,align:"center",render:row=>row.code},
  {key:"textColor",title:"文字颜色值",width:100,align:"center",render:row=>`<code>${getDataDictionaryPalette(row).text}</code>`},
  {key:"borderColor",title:"外框颜色值",width:100,align:"center",render:row=>`<code>${getDataDictionaryPalette(row).border}</code>`},
  {key:"bgColor",title:"背景颜色值",width:100,align:"center",render:row=>`<code>${getDataDictionaryPalette(row).bg}</code>`},
  {key:"palette",title:"标签配色",width:100,align:"center",render:row=>{
    const palette=getDataDictionaryPalette(row);
    return `<span class="dict-value-name" style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${palette.name}</span>`;
  }},
  {key:"status",title:"状态",width:80,align:"center",render:row=>renderDataDictionaryStatusTagV2284(row.status)},
  {key:"remark",title:"备注",width:260,align:"left",render:row=>`<span class="text-ellipsis" title="${escapeAttr(row.remark || "-")}">${row.remark || "-"}</span>`},
  {key:"operation",title:"操作",width:150,align:"center",render:row=>`
    <a class="link" onclick="openDataDictionaryValueModalV2284('${row.code}')">编辑</a>
    ｜
    <a class="link" onclick="toggleDataDictionaryValueStatusV2284('${row.code}')">${row.status==="启用"?"停用":"启用"}</a>
  `}
];

function renderDictionaryPaletteSelectV2284(row,index){
  const palette=dataDictionaryPaletteV2284[row.palette] || dataDictionaryPaletteV2284[0];
  return `
    <div class="dict-color-select">
      <span style="color:${palette.text};border-color:${palette.border};background:${palette.bg}">${palette.name}</span>
      <select onchange="showToast('已切换为标准配色：'+this.options[this.selectedIndex].text)">
        ${dataDictionaryPaletteV2284.map((item,i)=>`<option ${i===row.palette?"selected":""}>${item.name}｜${item.text} / ${item.border} / ${item.bg}</option>`).join("")}
      </select>
    </div>
  `;
}

function getDataDictionaryModalGridV2284(fields){
  return `<div class="actual-output-form-grid two data-dict-modal-grid">${fields}</div>`;
}

function openDataDictionaryTypeModalV2284(){
  openModal("新增字典",getDataDictionaryModalGridV2284(`
    <div class="form-item"><label>字典名称</label><input class="input" id="dictTypeName" placeholder="请输入字典名称"/></div>
    <div class="form-item"><label>字典编码</label><input class="input" id="dictTypeCode" placeholder="请输入大写英文编码"/></div>
    <div class="form-item" style="grid-column:1 / -1"><label>备注</label><textarea class="input data-dict-textarea" id="dictTypeRemark" placeholder="请输入备注"></textarea></div>
  `),`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitDataDictionaryTypeV2284()">保存</button>
  `,"large");
}

function submitDataDictionaryTypeV2284(){
  const name=document.getElementById("dictTypeName")?.value.trim();
  const code=document.getElementById("dictTypeCode")?.value.trim().toUpperCase();
  const remark=document.getElementById("dictTypeRemark")?.value.trim() || "";
  if(!name)return showToast("请输入字典名称");
  if(!code)return showToast("请输入字典编码");
  if(dataDictionaryListV2284.some(item=>item.code===code))return showToast("字典编码已存在");
  dataDictionaryListV2284.push({name,code,remark});
  dataDictionaryValuesV2284[code]=[];
  dataDictionaryStateV2284.active=code;
  dataDictionaryStateV2284.dictKeyword="";
  dataDictionaryStateV2284.valueKeyword="";
  dataDictionaryStateV2284.valuePage=1;
  syncDataDictionaryToLocalStoreV2284();
  refreshDataDictionaryConsumersV2284();
  closeModal();
  renderDataDictionaryPageV2284();
  showToast("字典新增成功");
}

function openDataDictionaryValueModalV2284(code=""){
  const active=getActiveDataDictionaryV2284();
  const list=dataDictionaryValuesV2284[active.code] || [];
  const row=code?list.find(item=>item.code===code):null;
  const isEdit=!!row;
  const currentPalette=normalizeDataDictionaryPaletteV2284(row?.palette ?? 0);
  openModal(isEdit?"编辑字典值":"新增字典值",getDataDictionaryModalGridV2284(`
    <div class="form-item"><label>所属字典</label><input class="input" value="${escapeAttr(active.name)} / ${escapeAttr(active.code)}" disabled/></div>
    <div class="form-item"><label>字典值名称</label><input class="input" id="dictValueName" value="${escapeAttr(row?.name || "")}" placeholder="请输入字典值名称"/></div>
    <div class="form-item"><label>字典值编码</label><input class="input" id="dictValueCode" value="${escapeAttr(row?.code || "")}" ${isEdit?"disabled":""} placeholder="请输入字典值编码"/></div>
    <div class="form-item"><label>状态</label><select class="select" id="dictValueStatus">
      ${["启用","禁用"].map(status=>`<option value="${status}" ${status===(row?.status||"启用")?"selected":""}>${status}</option>`).join("")}
    </select></div>
    <div class="form-item"><label>标签配色</label><select class="select" id="dictValuePalette">
      ${dataDictionaryPaletteV2284.map((item,index)=>`<option value="${index}" ${index===currentPalette?"selected":""}>${item.name}</option>`).join("")}
    </select></div>
    <div class="form-item" style="grid-column:1 / -1"><label>备注</label><textarea class="input data-dict-textarea" id="dictValueRemark" placeholder="请输入备注">${escapeAttr(row?.remark || "")}</textarea></div>
  `),`
    <button class="btn" onclick="closeModal()">取消</button>
    <button class="btn primary" onclick="submitDataDictionaryValueV2284('${escapeAttr(code)}')">保存</button>
  `,"large");
}

function submitDataDictionaryValueV2284(oldCode=""){
  const active=getActiveDataDictionaryV2284();
  const list=dataDictionaryValuesV2284[active.code] || (dataDictionaryValuesV2284[active.code]=[]);
  const name=document.getElementById("dictValueName")?.value.trim();
  const code=document.getElementById("dictValueCode")?.value.trim();
  const status=document.getElementById("dictValueStatus")?.value || "启用";
  const palette=Number(document.getElementById("dictValuePalette")?.value)||0;
  const remark=document.getElementById("dictValueRemark")?.value.trim() || "";
  if(!name)return showToast("请输入字典值名称");
  if(!code)return showToast("请输入字典值编码");
  const exists=list.some(item=>item.code===code && item.code!==oldCode);
  if(exists)return showToast("字典值编码已存在");
  const row=oldCode?list.find(item=>item.code===oldCode):null;
  if(row){
    Object.assign(row,{name,code,status,palette,remark});
  }else{
    list.push({name,code,status,palette,remark});
  }
  dataDictionaryStateV2284.valuePage=1;
  syncDataDictionaryToLocalStoreV2284();
  refreshDataDictionaryConsumersV2284();
  closeModal();
  renderDataDictionaryPageV2284();
  showToast(oldCode?"字典值已更新":"字典值新增成功");
}

function toggleDataDictionaryValueStatusV2284(code){
  const active=getActiveDataDictionaryV2284();
  const row=(dataDictionaryValuesV2284[active.code] || []).find(item=>item.code===code);
  if(!row)return;
  row.status=row.status==="启用"?"禁用":"启用";
  syncDataDictionaryToLocalStoreV2284();
  refreshDataDictionaryConsumersV2284();
  renderDataDictionaryPageV2284();
  showToast(`已${row.status==="启用"?"启用":"停用"}：${row.name}`);
}

function renderDataDictionaryValueTableV2284(){
  renderTableByColumns("dataDictionaryValue",getDataDictionaryPagedValuesV2284(),"dataDictionaryValueTbody");
}

function renderDataDictionaryPageV2284(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  ensureDataDictionaryLocalLoadedV2284();
  ensureBaseDataDictionaryMenuV2284();
  const active=getActiveDataDictionaryV2284();
  const dicts=getDataDictionaryFilteredListV2284();
  const rows=getDataDictionaryFilteredValuesV2284();
  const totalPages=Math.max(1,Math.ceil(rows.length/dataDictionaryStateV2284.valuePageSize));
  listPage.innerHTML=`
    <div class="data-dict-page">
      <aside class="data-dict-side">
        <div class="data-dict-side-head">
          <strong>数据字典</strong>
          <button class="mini-icon-btn" onclick="renderDataDictionaryPageV2284()">↻</button>
        </div>
        <div class="data-dict-side-search">
          <input value="${dataDictionaryStateV2284.dictKeyword}" placeholder="字典名称搜索" oninput="searchDataDictionaryV2284(this.value)"/>
          <button onclick="openDataDictionaryTypeModalV2284()">新增</button>
        </div>
        <div class="data-dict-list">
          ${dicts.map(item=>`
            <button class="${item.code===active.code?"active":""}" onclick="selectDataDictionaryV2284('${item.code}')">
              <span>${item.name}</span>
              <em>${item.code}</em>
            </button>
          `).join("")}
        </div>
      </aside>
      <section class="data-dict-main">
        <div class="data-dict-toolbar">
          <input class="input" value="${dataDictionaryStateV2284.valueKeyword}" placeholder="请输入字典项名称/编码" oninput="searchDataDictionaryValueV2284(this.value)"/>
          <button class="btn primary" onclick="renderDataDictionaryPageV2284()">查询</button>
          <button class="btn" onclick="dataDictionaryStateV2284.valueKeyword='';renderDataDictionaryPageV2284()">刷新</button>
        </div>
        <div class="data-dict-active-info">
          <strong>${active.name}</strong><span>${active.code}</span><em>${active.remark}</em>
          <b>禁用的字典值不允许被新增选择，历史已选数据不受影响。</b>
        </div>
        ${renderUnifiedTableCard({
          tableKey:"dataDictionaryValue",
          tbodyId:"dataDictionaryValueTbody",
          totalId:"dataDictionaryValueTotalText",
          renderFnName:"renderDataDictionaryPageV2284",
          refreshAction:"renderDataDictionaryPageV2284()",
          exportAction:"showToast('数据字典值导出成功')",
          beforeActions:`<button class="btn primary" onclick="openDataDictionaryValueModalV2284()">新增</button>`,
          title:"字典值列表",
          total:rows.length,
          pageText:`<span id="dataDictionaryValuePageText">
            <button class="btn mini" onclick="changeDataDictionaryValuePageV2284(-1)" ${dataDictionaryStateV2284.valuePage<=1?"disabled":""}>上一页</button>
            <b>第 ${dataDictionaryStateV2284.valuePage} / ${totalPages} 页</b>
            <button class="btn mini" onclick="changeDataDictionaryValuePageV2284(1)" ${dataDictionaryStateV2284.valuePage>=totalPages?"disabled":""}>下一页</button>
            <select class="select mini-select" onchange="changeDataDictionaryValuePageSizeV2284(this.value)">
              ${[10,20,50].map(size=>`<option value="${size}" ${size===dataDictionaryStateV2284.valuePageSize?"selected":""}>${size}条/页</option>`).join("")}
            </select>
          </span>`,
          className:"data-dict-value-table-card"
        })}
      </section>
    </div>
  `;
  renderDataDictionaryValueTableV2284();
}

ensureBaseDataDictionaryMenuV2284();
const __originSelectBusinessChildMenuV2284=selectBusinessChildMenu;
selectBusinessChildMenu=function(line,gi,ci,name){
  if(line==="base" && name==="数据字典"){
    currentBusinessLine=line;
    clearBusinessMenuActive(line);
    const menus=businessMenus[line]?.menus||[];
    menus.forEach((m,i)=>{if(m.children)m.open=i===gi;});
    const parent=menus[gi];
    if(parent?.children?.[ci]){
      parent.open=true;
      parent.children[ci].active=true;
    }
    renderSideMenu(line);
    return renderDataDictionaryPageV2284();
  }
  return __originSelectBusinessChildMenuV2284(line,gi,ci,name);
};

/* V2.2.85 EOF effective dictionary standards */
function getDictEnabledOptionsV2285(code){
  return (dataDictionaryValuesV2284[code] || []).filter(item=>item.status==="启用").map(item=>item.name);
}

function applyStandardDataDictionaryV2285(){
  const statusPalette={orange:3,green:1,red:4,blue:2,yellow:9,gray:0};
  dataDictionaryValuesV2284.PROJECT_STATUS=[
    {name:"待建",code:"1",status:"启用",palette:statusPalette.orange,remark:"标准项目状态"},
    {name:"在建",code:"2",status:"启用",palette:statusPalette.green,remark:"标准项目状态"},
    {name:"停工",code:"3",status:"启用",palette:statusPalette.red,remark:"标准项目状态"},
    {name:"完工",code:"4",status:"启用",palette:statusPalette.blue,remark:"标准项目状态"},
    {name:"竣工",code:"5",status:"启用",palette:statusPalette.yellow,remark:"标准项目状态"},
    {name:"终止",code:"6",status:"启用",palette:statusPalette.gray,remark:"标准项目状态"}
  ];
  dataDictionaryValuesV2284.PROJECT_TYPE=[
    {name:"轨交",code:"01",status:"启用",palette:2,remark:"标准项目类型"},
    {name:"公路",code:"02",status:"启用",palette:8,remark:"标准项目类型"},
    {name:"市政",code:"03",status:"启用",palette:6,remark:"标准项目类型"},
    {name:"建筑",code:"04",status:"启用",palette:5,remark:"标准项目类型"},
    {name:"环境",code:"05",status:"启用",palette:1,remark:"标准项目类型"},
    {name:"能源",code:"06",status:"启用",palette:3,remark:"标准项目类型"},
    {name:"机场",code:"07",status:"启用",palette:7,remark:"标准项目类型"},
    {name:"港口",code:"08",status:"启用",palette:6,remark:"标准项目类型"},
    {name:"园林",code:"09",status:"启用",palette:1,remark:"标准项目类型"},
    {name:"片区开发",code:"10",status:"启用",palette:9,remark:"标准项目类型"},
    {name:"产品",code:"11",status:"启用",palette:2,remark:"标准项目类型"},
    {name:"租售",code:"12",status:"启用",palette:4,remark:"标准项目类型"},
    {name:"企业管理",code:"13",status:"启用",palette:0,remark:"标准项目类型"}
  ];
  dataDictionaryValuesV2284.PROJECT_DELIVERY_MODE=[
    {name:"施工总承包",code:"GCC",status:"启用",palette:3,remark:"项目实施模式"},
    {name:"BOT",code:"BOT",status:"启用",palette:2,remark:"项目实施模式"},
    {name:"EPC",code:"EPC",status:"启用",palette:3,remark:"项目实施模式"},
    {name:"F+",code:"F+",status:"启用",palette:8,remark:"项目实施模式"},
    {name:"PPP",code:"PPP",status:"启用",palette:5,remark:"项目实施模式"},
    {name:"专业分包",code:"zyfb",status:"启用",palette:8,remark:"项目实施模式"},
    {name:"劳务分包",code:"lwfb",status:"启用",palette:6,remark:"项目实施模式"},
    {name:"其他",code:"Other",status:"启用",palette:0,remark:"项目实施模式"}
  ];
  dataDictionaryValuesV2284.PROJECT_CONTROL_LEVEL=[
    {name:"股份重大工程项目",code:"01",status:"启用",palette:5,remark:"项目管控等级"},
    {name:"子公司重大项目",code:"02",status:"启用",palette:3,remark:"项目管控等级"},
    {name:"子公司一般项目",code:"03",status:"启用",palette:0,remark:"项目管控等级"}
  ];
  dataDictionaryListV2284.forEach(item=>{
    if(item.code==="PROJECT_STATUS")item.remark="项目状态标准字典：禁用值不允许新增选择，历史选择保留";
    if(item.code==="PROJECT_TYPE")item.remark="项目类型标准字典，全局统一引用";
    if(item.code==="PROJECT_DELIVERY_MODE")item.remark="项目实施模式标准字典，全局统一引用";
    if(item.code==="PROJECT_CONTROL_LEVEL")item.remark="项目管控等级标准字典，全局统一引用";
  });
  if(window.mobileProjectSwitchOptionsV2283 || typeof mobileProjectSwitchOptionsV2283!=="undefined"){
    mobileProjectSwitchOptionsV2283.status=getDictEnabledOptionsV2285("PROJECT_STATUS");
    mobileProjectSwitchOptionsV2283.type=getDictEnabledOptionsV2285("PROJECT_TYPE");
  }
  if(window.mobileProjectSwitchListV2283 || typeof mobileProjectSwitchListV2283!=="undefined"){
    const normalized=[
      ["在建","轨交"],["在建","建筑"],["在建","市政"],["待建","市政"],["停工","轨交"]
    ];
    mobileProjectSwitchListV2283.forEach((item,index)=>{
      item.status=normalized[index]?.[0] || item.status;
      item.type=normalized[index]?.[1] || item.type;
      item.mode=getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE")[index%getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE").length] || item.mode;
      item.level=getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL")[index%getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL").length] || item.level;
    });
  }
}

applyStandardDataDictionaryV2285();

/* V2.2.85 project mock data dictionary binding */
function applyDictionaryToProjectMockDataV2285(){
  if(typeof constructionProjectData==="undefined")return;
  const statusOptions=getDictEnabledOptionsV2285("PROJECT_STATUS");
  const typeOptions=getDictEnabledOptionsV2285("PROJECT_TYPE");
  const implementationModeOptions=getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE");
  const controlLevelOptions=getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL");
  const typeMap={
    "轨道交通":"轨交",
    "轨交工程":"轨交",
    "房建工程":"建筑",
    "市政工程":"市政",
    "港口工程":"港口",
    "道路工程":"公路",
    "水务工程":"环境"
  };
  const implementationModeMap={
    "施工总承包":"施工总承包",
    "EPC":"EPC",
    "联合体":"PPP",
    "专业分包":"专业分包",
    "劳务分包":"劳务分包"
  };
  const controlLevelMap={
    "集团管控":"股份重大工程项目",
    "一级管控":"股份重大工程项目",
    "重点管控":"子公司重大项目",
    "二级管控":"子公司重大项目",
    "一般管控":"子公司一般项目",
    "三级管控":"子公司一般项目"
  };
  constructionProjectData.forEach((item,index)=>{
    if(!statusOptions.includes(item.projectStatus)){
      item.projectStatus=statusOptions[index%statusOptions.length] || item.projectStatus;
    }
    item.projectType=typeMap[item.projectType] || item.projectType;
    if(!typeOptions.includes(item.projectType)){
      item.projectType=typeOptions[index%typeOptions.length] || item.projectType;
    }
    item.implementationMode=implementationModeMap[item.implementationMode] || item.implementationMode;
    if(!implementationModeOptions.includes(item.implementationMode)){
      item.implementationMode=implementationModeOptions[index%implementationModeOptions.length] || item.implementationMode;
    }
    item.controlLevel=controlLevelMap[item.controlLevel] || item.controlLevel;
    if(!controlLevelOptions.includes(item.controlLevel)){
      item.controlLevel=controlLevelOptions[index%controlLevelOptions.length] || item.controlLevel;
    }
  });
  constructionProjectCurrentList=[...constructionProjectData];
  constructionProjectBaseFilteredList=[...constructionProjectData];
}

function projectStatusTag(v){
  const colorMap={
    "待建":"orange",
    "在建":"green",
    "停工":"red",
    "完工":"blue",
    "竣工":"yellow",
    "终止":"gray"
  };
  return tag(v,colorMap[v] || "gray");
}

applyDictionaryToProjectMockDataV2285();

function renderConstructionProjectFilterFields(collapsed=false){
  const yesNo=["是","否"];
  const projectStatusOptions=getDictEnabledOptionsV2285("PROJECT_STATUS");
  const projectTypeOptions=getDictEnabledOptionsV2285("PROJECT_TYPE");
  const implementationModeOptions=getDictEnabledOptionsV2285("PROJECT_DELIVERY_MODE");
  const controlLevelOptions=getDictEnabledOptionsV2285("PROJECT_CONTROL_LEVEL");
  const basicRows=`
    ${renderConstructionProjectInput("cpProjectName","项目名称","模糊搜索")}
    ${renderConstructionProjectInput("cpProjectCode","项目编号","模糊搜索")}
    ${renderConstructionProjectSelect("cpSubCompany","子公司",cpUnique("subCompany"))}
    ${renderConstructionProjectSelect("cpBranchCompany","分公司",cpUnique("branchCompany"))}
    ${renderConstructionProjectSelect("cpProjectStatus","项目状态",projectStatusOptions)}
    ${renderConstructionProjectInput("cpProjectManager","项目经理","模糊搜索")}
    ${renderConstructionProjectSelect("cpRegion","所属区域",["长三角区域","大湾区域","中原区域","海南","境外区域"])}
    ${renderConstructionProjectInput("cpProvinceCity","所在省市","模糊搜索")}
  `;
  if(collapsed)return basicRows;
  return `
    ${basicRows}
    ${renderConstructionProjectSelect("cpProjectType","项目类型",projectTypeOptions)}
    ${renderConstructionProjectSelect("cpImplementationMode","实施模式",implementationModeOptions)}
    ${renderConstructionProjectSelect("cpControlLevel","管控等级",controlLevelOptions)}
    ${renderConstructionProjectSelect("cpIntegratedManagement","股份一体化管理",yesNo)}
    ${renderConstructionProjectInput("cpOrderProjectNo","订单项目编号","模糊搜索")}
    ${renderConstructionProjectInput("cpProductionProjectNo","生产项目编号","模糊搜索")}
    ${renderConstructionProjectInput("cpGeneralContractor","总包单位","模糊搜索")}
    ${renderConstructionProjectInput("cpBuilder","建设单位","模糊搜索")}
    ${renderConstructionProjectInput("cpContractProjectManager","合同项目经理","模糊搜索")}
    ${renderConstructionProjectSelect("cpProductionBizType","生产业务类型",cpUnique("productionBizType"))}
    ${renderConstructionProjectSelect("cpKeyCustomer","重点客户",cpUnique("keyCustomer"))}
    ${renderConstructionProjectSelect("cpConstructionPermit","施工许可证",["已办理","未办理"])}
    ${renderConstructionProjectRangeItem("立项日期",renderProjectRange("cpApprovalStart","cpApprovalEnd","date"))}
    ${renderConstructionProjectRangeItem("合同开工月份",renderProjectRange("cpContractStartBegin","cpContractStartEnd","month"))}
    ${renderConstructionProjectRangeItem("合同完工月份",renderProjectRange("cpContractEndBegin","cpContractEndEnd","month"))}
    ${renderConstructionProjectRangeItem("项目造价(万元)",renderProjectRange("cpCostMin","cpCostMax","number","最小","最大"))}
    ${renderConstructionProjectSelect("cpIsShareInternal","是否股份内部",yesNo)}
    ${renderConstructionProjectSelect("cpIsSubCompanyInternal","是否子公司内部",yesNo)}
    ${renderConstructionProjectSelect("cpIsConstructionProject","是否施工类项目",yesNo)}
    ${renderConstructionProjectSelect("cpIsMajorRisk","是否重大风险",yesNo)}
    ${renderConstructionProjectSelect("cpIsSafetyManaged","是否安全纳管",yesNo)}
  `;
}

/* V2.2.90 EOF todo dialog and mobile project switch polish */
