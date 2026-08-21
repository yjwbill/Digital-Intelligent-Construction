const projectSafetyPersonnelUnits=[
  {id:"all",name:"全部"},
  {id:"general",name:"上海隧道工程有限公司大盾构工程分公司",unitTypeCode:"GENERAL_CONTRACTOR"},
  {id:"foundation",name:"上海城建市政工程（集团）有限公司",unitTypeCode:"CONSTRUCTION_UNIT"},
  {id:"installation",name:"上海市隧道工程轨道交通设计研究院",unitTypeCode:"DESIGN_UNIT"},
  {id:"survey",name:"上海岩土工程勘察设计研究院有限公司",unitTypeCode:"SURVEY_UNIT"},
  {id:"supervision",name:"上海建科工程咨询有限公司",unitTypeCode:"SUPERVISION_UNIT"}
];

const projectSafetyPersonnelRows=[
  {id:1,name:"王磊",phone:"177****3010",gender:"男",post:"安全主管",workArea:"大门外",photo:"王磊.jpg",unitId:"general",unit:"上海隧道工程有限公司大盾构工程分公司",certificate:"已上传",accountStatus:"启用"},
  {id:2,name:"刘孙祥",phone:"188****1196",gender:"男",post:"项目经理",workArea:"全部工区",photo:"刘孙祥.jpg",unitId:"general",unit:"上海隧道工程有限公司大盾构工程分公司",certificate:"未上传",accountStatus:"启用"},
  {id:3,name:"张海峰",phone:"139****5268",gender:"男",post:"安全员",workArea:"A工区、C工区",photo:"张海峰.jpg",unitId:"foundation",unit:"上海城建市政工程（集团）有限公司",certificate:"已上传",accountStatus:"启用"},
  {id:4,name:"周敏",phone:"136****8073",gender:"女",post:"资料员",workArea:"全部工区",photo:"周敏.jpg",unitId:"installation",unit:"上海隧道工程有限公司机电设备安装分公司",certificate:"未上传",accountStatus:"启用"},
  {id:5,name:"陈志强",phone:"158****2641",gender:"男",post:"安全总监",workArea:"B工区",photo:"陈志强.jpg",unitId:"supervision",unit:"上海建科工程咨询有限公司",certificate:"已上传",accountStatus:"停用"}
];

function getProjectSafetyPersonnelRows(){
  return projectSafetyPersonnelRows;
}
window.__PROJECT_SAFETY_PERSONNEL_ROWS__=projectSafetyPersonnelRows;

const projectSafetyPersonnelState={unitId:"all",unitKeyword:"",name:"",phone:"",post:"",workArea:"",certificate:"",page:1,pageSize:50};

tableColumnDefinitions.projectSafetyManagementPersonnel=[
  {key:"selection",title:'<input type="checkbox" aria-label="全选" onclick="toggleProjectSafetyPersonnelSelection(this.checked)"/>',width:52,align:"center",render:row=>`<input type="checkbox" class="project-safety-personnel-checkbox" value="${row.id}" aria-label="选择${row.name}"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(projectSafetyPersonnelState.page-1)*projectSafetyPersonnelState.pageSize+index+1},
  {key:"name",title:"姓名",width:110,align:"center",render:row=>`<a class="link" onclick="showToast('查看人员：${escapeAttr(row.name)}')">${row.name}</a>`},
  {key:"phone",title:"手机号码",width:130,align:"center",render:row=>row.phone},
  {key:"gender",title:"性别",width:80,align:"center",render:row=>row.gender},
  {key:"post",title:"岗位",width:120,align:"center",render:row=>row.post},
  {key:"workArea",title:"工区",width:160,align:"center",render:row=>row.workArea},
  {key:"photo",title:"识别照片",width:110,align:"center",render:row=>`<span class="tag blue">已上传</span>`},
  {key:"unit",title:"单位",width:300,align:"left",render:row=>row.unit},
  {key:"certificate",title:`专业证书${renderInfoTip("安全总监和安全主管必须上传专业证书，其他岗位可选上传专业证书")}`,width:130,align:"center",render:row=>tag(row.certificate,row.certificate==="已上传"?"green":"orange")},
  {key:"accountStatus",title:"账号状态",width:110,align:"center",render:row=>tag(row.accountStatus,row.accountStatus==="启用"?"green":"gray")},
  {key:"operation",title:"操作",width:210,align:"center",render:row=>`<a class="link" onclick="showToast('编辑：${escapeAttr(row.name)}')">编辑</a>　<a class="link" onclick="showToast('已重置${escapeAttr(row.name)}的密码')">密码重置</a>　<a class="link danger" onclick="showToast('删除操作需要二次确认')">删除</a>`}
];

function getProjectSafetyPersonnelFilteredRows(){
  return projectSafetyPersonnelRows.filter(row=>{
    if(projectSafetyPersonnelState.unitId!=="all"&&row.unitId!==projectSafetyPersonnelState.unitId)return false;
    if(projectSafetyPersonnelState.name&&!row.name.includes(projectSafetyPersonnelState.name))return false;
    if(projectSafetyPersonnelState.phone&&!row.phone.includes(projectSafetyPersonnelState.phone))return false;
    if(projectSafetyPersonnelState.post&&row.post!==projectSafetyPersonnelState.post)return false;
    if(projectSafetyPersonnelState.workArea&&!row.workArea.includes(projectSafetyPersonnelState.workArea))return false;
    if(projectSafetyPersonnelState.certificate&&row.certificate!==projectSafetyPersonnelState.certificate)return false;
    return true;
  });
}

function renderProjectSafetyPersonnelUnitRail(){
  const keyword=projectSafetyPersonnelState.unitKeyword.trim();
  const units=projectSafetyPersonnelUnits.filter(unit=>!keyword||unit.name.includes(keyword));
  return units.map(unit=>{
    const typeItem=typeof dataDictionaryValuesV2284!=="undefined"?(dataDictionaryValuesV2284.PARTICIPANT_UNIT_TYPE||[]).find(item=>item.code===unit.unitTypeCode&&item.status==="启用"):null;
    const palette=typeItem&&typeof getDataDictionaryPalette==="function"?getDataDictionaryPalette(typeItem):null;
    const badgeStyle=palette?`color:${palette.text};border-color:${palette.border};background:${palette.bg}`:"";
    return `<div class="org-tree-node project-safety-unit-node ${projectSafetyPersonnelState.unitId===unit.id?"active":""}" onclick="switchProjectSafetyPersonnelUnit('${unit.id}')"><span class="org-node-left project-safety-unit-name" title="${escapeAttr(unit.name)}"><span class="project-safety-unit-icon">🏢</span><span class="org-node-name">${unit.name}</span></span>${typeItem?`<span class="project-safety-unit-badge" style="${badgeStyle}">${typeItem.name}</span>`:""}</div>`;
  }).join("")||'<div class="unified-org-tree-empty">暂无匹配的参建单位</div>';
}

function renderProjectSafetyManagementPersonnelPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const rows=getProjectSafetyPersonnelFilteredRows();
  const totalPages=Math.max(1,Math.ceil(rows.length/projectSafetyPersonnelState.pageSize));
  listPage.innerHTML=`<div class="project-safety-personnel-page"><div class="compact-title-row"><div class="module-title">管理人员 / 管理人员名单</div></div><div class="base-auth-layout project-safety-personnel-layout"><section class="org-tree-panel"><div class="org-tree-hd"><div class="card-title">参建单位</div></div><div class="project-safety-personnel-unit-search"><input class="input" value="${escapeAttr(projectSafetyPersonnelState.unitKeyword)}" placeholder="输入关键字进行过滤" oninput="filterProjectSafetyPersonnelUnits(this.value)"/></div><div id="projectSafetyPersonnelUnitRail" class="org-tree-body">${renderProjectSafetyPersonnelUnitRail()}</div></section><section class="org-user-panel"><div class="org-user-body project-safety-personnel-main">${renderUnifiedQueryCard(`
    <div class="form-item"><label>姓名</label><input class="input" id="projectSafetyPersonnelName" value="${escapeAttr(projectSafetyPersonnelState.name)}" placeholder="请输入姓名"/></div>
    <div class="form-item"><label>手机号码</label><input class="input" id="projectSafetyPersonnelPhone" value="${escapeAttr(projectSafetyPersonnelState.phone)}" placeholder="请输入手机号码"/></div>
    <div class="form-item"><label>人员岗位</label><select class="select" id="projectSafetyPersonnelPost">${renderActualOutputOptions(["项目经理","安全总监","安全主管","安全员","资料员"],projectSafetyPersonnelState.post,"全部")}</select></div>
    <div class="form-item"><label>工区权限</label><input class="input" id="projectSafetyPersonnelWorkArea" value="${escapeAttr(projectSafetyPersonnelState.workArea)}" placeholder="请输入工区"/></div>
    <div class="form-item"><label>专业证书</label><select class="select" id="projectSafetyPersonnelCertificate">${renderActualOutputOptions(["已上传","未上传"],projectSafetyPersonnelState.certificate,"全部")}</select></div>
  `,{id:"projectSafetyPersonnelQueryCard",queryFn:"queryProjectSafetyPersonnel()",resetFn:"resetProjectSafetyPersonnel()",canCollapse:false})}${renderUnifiedTableCard({tableKey:"projectSafetyManagementPersonnel",tbodyId:"projectSafetyPersonnelTbody",renderFnName:"renderProjectSafetyPersonnelTable",refreshAction:"renderProjectSafetyManagementPersonnelPage()",exportAction:"showToast('管理人员名单导出任务已创建')",beforeActions:'<button class="btn primary" onclick="showToast(\'打开管理人员登记\')">登记</button>',title:"管理人员名单",className:"project-safety-personnel-table-card",total:rows.length,pageText:`<span id="projectSafetyPersonnelPageText">第 1 / ${totalPages} 页　每页 ${projectSafetyPersonnelState.pageSize} 条</span>`})}</div></section></div></div>`;
  renderProjectSafetyPersonnelTable();
}

function filterProjectSafetyPersonnelUnits(value){projectSafetyPersonnelState.unitKeyword=value||"";const rail=document.getElementById("projectSafetyPersonnelUnitRail");if(rail)rail.innerHTML=renderProjectSafetyPersonnelUnitRail();}
function switchProjectSafetyPersonnelUnit(unitId){projectSafetyPersonnelState.unitId=unitId;projectSafetyPersonnelState.page=1;renderProjectSafetyManagementPersonnelPage();}
function syncProjectSafetyPersonnelQuery(){projectSafetyPersonnelState.name=document.getElementById("projectSafetyPersonnelName")?.value.trim()||"";projectSafetyPersonnelState.phone=document.getElementById("projectSafetyPersonnelPhone")?.value.trim()||"";projectSafetyPersonnelState.post=document.getElementById("projectSafetyPersonnelPost")?.value||"";projectSafetyPersonnelState.workArea=document.getElementById("projectSafetyPersonnelWorkArea")?.value.trim()||"";projectSafetyPersonnelState.certificate=document.getElementById("projectSafetyPersonnelCertificate")?.value||"";}
function queryProjectSafetyPersonnel(){syncProjectSafetyPersonnelQuery();projectSafetyPersonnelState.page=1;renderProjectSafetyManagementPersonnelPage();}
function resetProjectSafetyPersonnel(){Object.assign(projectSafetyPersonnelState,{name:"",phone:"",post:"",workArea:"",certificate:"",page:1});renderProjectSafetyManagementPersonnelPage();}
function renderProjectSafetyPersonnelTable(){const rows=getProjectSafetyPersonnelFilteredRows();const pages=Math.max(1,Math.ceil(rows.length/projectSafetyPersonnelState.pageSize));projectSafetyPersonnelState.page=Math.min(projectSafetyPersonnelState.page,pages);const start=(projectSafetyPersonnelState.page-1)*projectSafetyPersonnelState.pageSize;renderTableByColumns("projectSafetyManagementPersonnel",rows.slice(start,start+projectSafetyPersonnelState.pageSize),"projectSafetyPersonnelTbody");const total=document.getElementById("projectSafetyManagementPersonnelTotalText");const page=document.getElementById("projectSafetyPersonnelPageText");if(total)total.textContent=`共 ${rows.length} 条`;if(page)page.innerHTML=`<button class="btn mini" ${projectSafetyPersonnelState.page<=1?"disabled":""} onclick="changeProjectSafetyPersonnelPage(-1)">上一页</button><b>第 ${projectSafetyPersonnelState.page} / ${pages} 页</b><button class="btn mini" ${projectSafetyPersonnelState.page>=pages?"disabled":""} onclick="changeProjectSafetyPersonnelPage(1)">下一页</button><select class="select mini-select" onchange="changeProjectSafetyPersonnelPageSize(this.value)">${[20,50,100].map(size=>`<option value="${size}" ${size===projectSafetyPersonnelState.pageSize?"selected":""}>${size}条/页</option>`).join("")}</select>`;}
function changeProjectSafetyPersonnelPage(dir){const pages=Math.max(1,Math.ceil(getProjectSafetyPersonnelFilteredRows().length/projectSafetyPersonnelState.pageSize));projectSafetyPersonnelState.page=Math.max(1,Math.min(pages,projectSafetyPersonnelState.page+Number(dir||0)));renderProjectSafetyPersonnelTable();}
function changeProjectSafetyPersonnelPageSize(value){projectSafetyPersonnelState.pageSize=[20,50,100].includes(Number(value))?Number(value):50;projectSafetyPersonnelState.page=1;renderProjectSafetyPersonnelTable();}
function toggleProjectSafetyPersonnelSelection(checked){document.querySelectorAll(".project-safety-personnel-checkbox").forEach(item=>item.checked=checked);}
