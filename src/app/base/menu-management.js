const menuManagementState={selectedId:"",keyword:"",roleFilters:{code:"",name:"",remark:""},page:1,pageSize:50,collapsed:new Set(),selectedRoleIds:new Set(),visibleRoleIds:[]};
const menuManagementIconOptions=[["📁","文件夹"],["📋","菜单"],["🏠","首页"],["⚙️","设置"],["🏢","组织"],["👤","人员"],["👥","用户组"],["🛡️","角色权限"],["🔐","组织权限"],["📊","统计分析"],["📄","文件"],["📅","日历"],["🔔","通知"],["📺","看板"],["✅","审批任务"],["🧰","设备工具"],["🔍","搜索"],["🗄️","数据管理"],["🧩","模板"],["💬","消息"],["📨","待办"],["📐","规则配置"],["⚠️","风险预警"],["🏗️","项目工程"],["📈","产值"],["🌱","低碳"],["📦","材料"],["👷","劳务"],["🧪","技术"],["📑","合同"],["🏅","质量"],["🏭","供应商"],["🎥","视频"],["🕘","历史"]];
const menuManagementActionDefinitions=["查看","新增","编辑","删除","导入","导出"];
Object.values(businessMenus).forEach(line=>{
  const collect=items=>items.forEach(item=>{
    const icon=getBusinessMenuEmoji(item);
    if(!menuManagementIconOptions.some(([value])=>value===icon))menuManagementIconOptions.push([icon,item.name]);
    collect(item.children||[]);
  });
  collect(line.menus||[]);
});
let menuManagementOverrides={};
try{
  const saved=JSON.parse(localStorage.getItem("menuManagementDisplayOverrides")||"{}");
  if(saved&&typeof saved==="object"&&!Array.isArray(saved))menuManagementOverrides=saved;
}catch(error){console.warn("Unable to load menu display settings",error);}

function getMenuManagementDisplay(id,name,defaultIcon){
  const saved=menuManagementOverrides[id];
  return {name:typeof saved?.name==="string"&&saved.name.trim()?saved.name:name,
    icon:isMenuEmojiAvailable(saved?.icon)?saved.icon:defaultIcon};
}

function getMenuManagementTree(){
  function actionChildren(parentId,line,itemName){
    const actions=/看板|总览|首页/.test(itemName)?["查看","刷新","导出"]:/查询|列表|管理|台账|名单|记录|明细|填报|上报/.test(itemName)?menuManagementActionDefinitions:["查看","新增","编辑"];
    return actions.map(action=>{const id=parentId+"/action-"+encodeURIComponent(action);return {id,name:action,line,icon:getMenuManagementDisplay(id,action,"🔘").icon,children:[]};});
  }
  function children(items,parentId,line){
    return items.map(item=>{
      const id=parentId+"/"+encodeURIComponent(item.name);
      const childItems=item.children||[];
      return {id,...getMenuManagementDisplay(id,item.name,getBusinessMenuEmoji(item)),line,children:childItems.length?children(childItems,id,line):actionChildren(id,line,item.name)};
    });
  }
  const lineIcons={home:"🏠",base:"⚙️",production:"🏗️",safety:"🛡️",economy:"📊",operation:"🏭"};
  return Object.entries(businessMenus).map(([line,item])=>({id:line,...getMenuManagementDisplay(line,item.title,lineIcons[line]||"📋"),line,children:children(item.menus||[],line,line)}));
}

function flattenMenuManagementTree(nodes=getMenuManagementTree()){
  return nodes.flatMap(node=>[node,...flattenMenuManagementTree(node.children)]);
}

function getMenuManagementRoles(node){
  const nodes=flattenMenuManagementTree();
  // Seed the static demo once; subsequent reads use explicit resource bindings.
  roleData.forEach(role=>{
    if(Array.isArray(role.menuResourceIds))return;
    role.menuResourceIds=nodes.filter(item=>role.code==="ROLE_ADMIN" ||
      (role.code==="ROLE_SAFE_LEADER"&&item.line==="safety") ||
      (role.code==="ROLE_USER"&&item.line==="home")).map(item=>item.id);
  });
  return roleData.filter(role=>role.menuResourceIds.includes(node.id));
}

function renderMenuManagementTree(nodes=getMenuManagementTree(),level=0){
  const keyword=menuManagementState.keyword.trim().toLowerCase();
  const matches=node=>node.name.toLowerCase().includes(keyword)||node.children.some(matches);
  return nodes.filter(matches).map(node=>{
    const branch=node.children.length>0;
    const expanded=Boolean(keyword)||!menuManagementState.collapsed.has(node.id);
    const id=escapeAttr(node.id);
    return `<div class="org-tree-node ${menuManagementState.selectedId===node.id?"active":""}" style="padding-left:${8+level*16}px">
      <button type="button" class="org-tree-depth-btn" ${branch?`aria-label="${expanded?"收起":"展开"}${escapeAttr(node.name)}" title="${expanded?"收起":"展开"}" aria-expanded="${expanded}" onclick="toggleMenuManagementNode('${id}')"`:'disabled aria-hidden="true"'}>${branch?renderTDesignIcon(expanded?"chevron-down":"chevron-right",{size:16}):""}</button>
      <button type="button" class="menu-management-node-label" aria-pressed="${menuManagementState.selectedId===node.id}" title="${escapeAttr(node.name)}" onclick="selectMenuManagementNode('${id}')"><span class="menu-management-node-emoji" aria-hidden="true">${escapeAttr(node.icon)}</span><span>${escapeAttr(node.name)}</span></button>
      <div class="org-node-tools"><button type="button" class="org-tool-btn" title="编辑菜单" aria-label="编辑${escapeAttr(node.name)}" onclick="event.stopPropagation();openMenuManagementEdit('${id}')">${renderTDesignIcon("edit",{size:16})}</button></div>
    </div>${branch&&expanded?renderMenuManagementTree(node.children,level+1):""}`;
  }).join("");
}

function openMenuManagementEdit(id){
  const node=flattenMenuManagementTree().find(item=>item.id===id);
  if(!node)return;
  openModal("编辑菜单",`<div class="menu-management-edit-form">
    <div class="form-item"><label for="menuManagementEditName">菜单名称 <span style="color:var(--danger)">*</span></label><input class="input" id="menuManagementEditName" maxlength="50" value="${escapeAttr(node.name)}" placeholder="请输入菜单名称"/></div>
    <div class="form-item"><label>菜单图标</label>${renderMenuEmojiPicker(node.icon)}</div>
  </div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveMenuManagementEdit('${escapeAttr(id)}')">保存</button>`);
  renderMenuEmojiResults();
}

function selectMenuManagementEditIcon(button){
  document.querySelectorAll("[data-menu-icon]").forEach(item=>{
    item.classList.toggle("active",item===button);
    item.setAttribute("aria-pressed",String(item===button));
  });
}

function saveMenuManagementEdit(id){
  const input=document.getElementById("menuManagementEditName");
  const name=input?.value.trim();
  if(!name){showToast("请输入菜单名称");input?.focus();return;}
  if(name.length>50){showToast("菜单名称不能超过50个字符");return;}
  const icon=menuEmojiPickerState.selected;
  if(!isMenuEmojiAvailable(icon))return showToast("请选择菜单图标");
  const next={...menuManagementOverrides,[id]:{name,icon}};
  try{localStorage.setItem("menuManagementDisplayOverrides",JSON.stringify(next));}
  catch(error){showToast("保存失败，请检查浏览器存储空间后重试");return;}
  menuManagementOverrides=next;
  rememberMenuEmoji(icon);
  closeModal();
  renderWithPreservedScroll(updateMenuManagementTree,["#menuManagementTree"]);
  renderMenuManagementRoles();
  showToast("菜单已更新");
}

function updateMenuManagementTree(){
  const body=document.getElementById("menuManagementTree");
  if(body)body.innerHTML=renderMenuManagementTree()||'<div class="unified-org-tree-empty">暂无匹配的菜单</div>';
}

function toggleMenuManagementNode(id){
  const collapsed=menuManagementState.collapsed;
  collapsed.has(id)?collapsed.delete(id):collapsed.add(id);
  renderWithPreservedScroll(updateMenuManagementTree,["#menuManagementTree"]);
}

function getMenuManagementTreeExpanded(){
  const nodes=flattenMenuManagementTree();
  return nodes.filter(node=>node.children.length).every(node=>!menuManagementState.collapsed.has(node.id));
}

function toggleMenuManagementTree(){
  const expanded=getMenuManagementTreeExpanded();
  menuManagementState.collapsed=expanded?new Set(flattenMenuManagementTree().map(node=>node.id)):new Set();
  updateMenuManagementTreeControls();
  updateMenuManagementTree();
}

function updateMenuManagementTreeControls(){
  const button=document.getElementById("menuManagementTreeToggle");
  if(!button)return;
  const expanded=getMenuManagementTreeExpanded();
  button.title=expanded?"全部收起":"全部展开";
  button.setAttribute("aria-label",expanded?"全部收起":"全部展开");
  button.innerHTML=renderTDesignIcon(expanded?"unfold-less":"unfold-more",{size:16});
}

function selectMenuManagementNode(id){
  menuManagementState.selectedRoleIds.clear();
  menuManagementState.selectedId=id;
  menuManagementState.page=1;
  renderWithPreservedScroll(updateMenuManagementTree,["#menuManagementTree"]);
  renderMenuManagementRoles();
}

function updateMenuManagementRoleSelection(){
  const state=menuManagementState;
  const selected=state.visibleRoleIds.filter(id=>state.selectedRoleIds.has(id));
  const all=document.getElementById("menuManagementSelectAll");
  if(all){
    all.checked=state.visibleRoleIds.length>0&&selected.length===state.visibleRoleIds.length;
    all.indeterminate=selected.length>0&&selected.length<state.visibleRoleIds.length;
    all.disabled=!state.visibleRoleIds.length;
  }
  document.querySelectorAll("[data-menu-role-check]").forEach(input=>input.checked=state.selectedRoleIds.has(input.dataset.menuRoleCheck));
  const button=document.getElementById("menuManagementBatchUnlink");
  if(button)button.disabled=!selected.length;
}

function toggleMenuManagementRoleSelection(id,checked){
  if(!menuManagementState.visibleRoleIds.includes(id))return;
  checked?menuManagementState.selectedRoleIds.add(id):menuManagementState.selectedRoleIds.delete(id);
  updateMenuManagementRoleSelection();
}

function toggleMenuManagementAllRoles(checked){
  menuManagementState.visibleRoleIds.forEach(id=>{
    checked?menuManagementState.selectedRoleIds.add(id):menuManagementState.selectedRoleIds.delete(id);
  });
  updateMenuManagementRoleSelection();
}

function unlinkMenuManagementRoles(roleId){
  const state=menuManagementState;
  const ids=roleId?[roleId]:state.visibleRoleIds.filter(id=>state.selectedRoleIds.has(id));
  if(!ids.length)return;
  let count=0;
  roleData.forEach(role=>{
    if(ids.includes(role.id)&&role.menuResourceIds?.includes(state.selectedId)){
      role.menuResourceIds=role.menuResourceIds.filter(id=>id!==state.selectedId);
      state.selectedRoleIds.delete(role.id);
      count++;
    }
  });
  renderWithPreservedScroll(renderMenuManagementRoles,[".menu-management-layout .org-user-body"]);
  if(count)showToast(`已取消 ${count} 个角色与当前菜单的关联`);
}

function queryMenuManagementRoles(){const filters=menuManagementState.roleFilters;Object.keys(filters).forEach(key=>filters[key]=document.getElementById(`menuManagementRole-${key}`)?.value.trim()||"");menuManagementState.page=1;renderMenuManagementRoles();}
function resetMenuManagementRoles(){menuManagementState.roleFilters={code:"",name:"",remark:""};menuManagementState.page=1;renderMenuManagementRoles();}

function renderMenuManagementRoles(){
  const node=flattenMenuManagementTree().find(item=>item.id===menuManagementState.selectedId);
  if(!node||!document.getElementById("menuManagementRoleBody"))return;
  const filters=menuManagementState.roleFilters;
  const rows=getMenuManagementRoles(node).filter(role=>(!filters.code||role.code===filters.code)&&(!filters.name||String(role.name||"").includes(filters.name))&&(!filters.remark||String(role.remark||"").includes(filters.remark)));
  const state=menuManagementState;
  const pages=Math.max(1,Math.ceil(rows.length/state.pageSize));
  state.page=Math.max(1,Math.min(state.page,pages));
  const pageRows=rows.slice((state.page-1)*state.pageSize,state.page*state.pageSize);
  state.visibleRoleIds=pageRows.map(role=>role.id);
  state.selectedRoleIds=new Set([...state.selectedRoleIds].filter(id=>state.visibleRoleIds.includes(id)));
  document.getElementById("menuManagementRoleHead").innerHTML=renderTableHeaderByColumns("menuManagementRoles");
  document.getElementById("menuManagementRoleTable").style.minWidth=getTableMinWidth("menuManagementRoles")+"px";
  renderTableByColumns("menuManagementRoles",pageRows,"menuManagementRoleBody");
  const selectionHead=document.querySelector('#menuManagementRoleHead [data-column-key="selection"]');
  if(selectionHead)selectionHead.innerHTML='<input type="checkbox" id="menuManagementSelectAll" aria-label="全选当前页角色" onchange="toggleMenuManagementAllRoles(this.checked)"/>';
  updateMenuManagementRoleSelection();
  if(!rows.length)document.getElementById("menuManagementRoleBody").innerHTML=`<tr><td colspan="${getVisibleColumns("menuManagementRoles").length}" class="unified-org-tree-empty">${filters.code||filters.name||filters.remark?"暂无匹配的角色":"该菜单暂无关联角色"}</td></tr>`;
}

function renderMenuManagementPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const nodes=flattenMenuManagementTree();
  if(!nodes.some(node=>node.id===menuManagementState.selectedId))menuManagementState.selectedId="base";
  tableColumnDefinitions.menuManagementRoles=[
    {key:"selection",title:"选择",width:54,align:"center",render:role=>`<input type="checkbox" data-menu-role-check="${escapeAttr(role.id)}" aria-label="选择${escapeAttr(role.name)}" onchange="toggleMenuManagementRoleSelection(this.dataset.menuRoleCheck,this.checked)"/>`},
    {key:"index",title:"序号",width:70,align:"center",render:(_,i)=>(menuManagementState.page-1)*menuManagementState.pageSize+i+1},
    {key:"code",title:"角色编码",width:220,render:role=>escapeAttr(role.code)},
    {key:"name",title:"角色名称",width:180,render:role=>escapeAttr(role.name)},
    {key:"status",title:"状态",width:100,align:"center",render:role=>tag(role.status,role.status==="启用"?"green":"gray")},
    {key:"remark",title:"备注",width:280,render:role=>escapeAttr(role.remark||"-")},
    {key:"operation",title:"操作",width:130,align:"center",render:role=>`<button type="button" class="link" data-menu-role-id="${escapeAttr(role.id)}" onclick="unlinkMenuManagementRoles(this.dataset.menuRoleId)">取消关联</button>`}
  ];
  listPage.innerHTML=`<div class="compact-title-row"><div class="module-title">菜单管理</div></div>
    <div class="base-auth-layout organization-management-layout menu-management-layout">
      <section class="org-tree-panel unified-org-tree-panel">
        <div class="org-tree-hd"><div class="card-title">菜单树</div><div class="actions">
          <button id="menuManagementTreeToggle" class="org-tree-depth-btn" title="全部收起" aria-label="全部收起" onclick="toggleMenuManagementTree()">${renderTDesignIcon("unfold-less",{size:16})}</button>
        </div></div>
        <div class="unified-org-tree-search"><input class="input" aria-label="菜单名称" placeholder="请输入菜单名称" value="${escapeAttr(menuManagementState.keyword)}" oninput="menuManagementState.keyword=this.value;updateMenuManagementTree()"/></div>
        <div class="org-tree-body" id="menuManagementTree">${renderMenuManagementTree()}</div>
      </section>
      <section class="org-user-panel menu-management-role-panel">
        ${renderUnifiedQueryCard(`<div class="form-item"><label>角色编码</label><input class="input" aria-label="角色编码" id="menuManagementRole-code" placeholder="请输入角色编码" value="${escapeAttr(menuManagementState.roleFilters.code)}" onkeydown="if(event.key==='Enter'){event.preventDefault();queryMenuManagementRoles()}"/></div><div class="form-item"><label>角色名称</label><input class="input" aria-label="角色名称" id="menuManagementRole-name" placeholder="请输入角色名称" value="${escapeAttr(menuManagementState.roleFilters.name)}" onkeydown="if(event.key==='Enter'){event.preventDefault();queryMenuManagementRoles()}"/></div><div class="form-item"><label>备注</label><input class="input" aria-label="备注" id="menuManagementRole-remark" placeholder="请输入备注" value="${escapeAttr(menuManagementState.roleFilters.remark)}" onkeydown="if(event.key==='Enter'){event.preventDefault();queryMenuManagementRoles()}"/></div>`,{id:"menuManagementRoleQuery",queryFn:"queryMenuManagementRoles()",resetFn:"resetMenuManagementRoles()",canCollapse:false})}
        ${renderUnifiedTableCard({title:"已关联角色",tableKey:"menuManagementRoles",tableId:"menuManagementRoleTable",theadId:"menuManagementRoleHead",tbodyId:"menuManagementRoleBody",totalId:"menuManagementRoleTotal",total:0,renderFnName:"renderMenuManagementRoles",beforeActions:'<button class="btn primary" onclick="openMenuRolePicker()">关联角色</button><button class="btn" id="menuManagementBatchUnlink" disabled onclick="unlinkMenuManagementRoles()">批量取消关联</button>',refreshAction:"renderMenuManagementRoles()",exportAction:"showToast('导出成功：已关联角色列表.xlsx')"})}
      </section>
    </div>`;
  updateMenuManagementTreeControls();
  renderMenuManagementRoles();
}

const menuRolePickerState={menuId:"",selected:new Set(),filters:{code:"",name:"",remark:""},page:1,pageSize:50};

function getMenuRolePickerRows(){
  const f=menuRolePickerState.filters;
  return roleData.filter(role=>(!f.code||role.code===f.code)&&(!f.name||String(role.name||"").includes(f.name))&&(!f.remark||String(role.remark||"").includes(f.remark)));
}

function menuRolePickerIsBound(role){return role.menuResourceIds?.includes(menuRolePickerState.menuId);}
function getMenuRolePickerPageRows(){
  const state=menuRolePickerState;
  return getMenuRolePickerRows().slice((state.page-1)*state.pageSize,state.page*state.pageSize);
}

function openMenuRolePicker(){
  const node=flattenMenuManagementTree().find(item=>item.id===menuManagementState.selectedId);
  if(!node)return;
  getMenuManagementRoles(node);
  Object.assign(menuRolePickerState,{menuId:node.id,selected:new Set(),filters:{code:"",name:"",remark:""},page:1,pageSize:50});
  tableColumnDefinitions.menuRolePicker=[
    {key:"selection",title:"选择",width:54,align:"center",render:role=>`<input type="checkbox" data-picker-role="${escapeAttr(role.id)}" aria-label="选择${escapeAttr(role.name)}" ${menuRolePickerIsBound(role)?'disabled checked title="已关联"':""} onchange="toggleMenuRolePickerRow(this.dataset.pickerRole,this.checked)"/>`},
    {key:"index",title:"序号",width:70,align:"center",render:(_,index)=>(menuRolePickerState.page-1)*menuRolePickerState.pageSize+index+1},
    {key:"code",title:"角色编码",width:220,render:role=>escapeAttr(role.code)},
    {key:"name",title:"角色名称",width:180,render:role=>escapeAttr(role.name)},
    {key:"status",title:"状态",width:100,align:"center",render:role=>tag(role.status,role.status==="启用"?"green":"gray")},
    {key:"remark",title:"备注",width:280,render:role=>escapeAttr(role.remark||"-")}
  ];
  openNestedModal("选择角色",renderMenuRolePickerBody(),'<button class="btn" onclick="closeNestedModal(this)">取消</button><button class="btn primary" onclick="confirmMenuRolePicker(this)">确定</button>');
  document.querySelector(".nested-modal-mask:last-child .nested-modal")?.classList.add("message-project-person-picker-modal","menu-role-picker-modal");
  renderMenuRolePickerTable();
}

function renderMenuRolePickerBody(){
  const f=menuRolePickerState.filters;
  const query=renderUnifiedQueryCard([['code','角色编码'],['name','角色名称'],['remark','备注']].map(([key,label])=>`<div class="form-item"><label for="menuRolePicker-${key}">${label}</label><input class="input" id="menuRolePicker-${key}" value="${escapeAttr(f[key])}" placeholder="请输入${label}" onkeydown="if(event.key==='Enter'){event.preventDefault();queryMenuRolePicker()}"/></div>`).join(""),{id:"menuRolePickerQuery",queryFn:"queryMenuRolePicker()",resetFn:"resetMenuRolePicker()",canCollapse:false});
  return `<div class="message-project-person-selector menu-role-picker-selector">${query}<section class="card table-card message-project-person-table-card"><div class="card-hd"><div class="card-title">角色列表</div><div class="message-project-person-selected">已选 <b id="menuRolePickerSelectedCount">0</b> 个角色</div></div><div class="table-wrap roster-table-wrap"><table id="menuRolePickerTable"><thead><tr id="menuRolePickerHead"></tr></thead><tbody id="menuRolePickerBody"></tbody></table></div><div class="pagination" id="menuRolePickerPagination"></div></section></div>`;
}

function renderMenuRolePickerTable(){
  const state=menuRolePickerState,rows=getMenuRolePickerRows(),pages=Math.max(1,Math.ceil(rows.length/state.pageSize));
  state.page=Math.min(Math.max(1,state.page),pages);
  document.getElementById("menuRolePickerTable").style.minWidth=getTableMinWidth("menuRolePicker")+"px";
  document.getElementById("menuRolePickerHead").innerHTML=renderTableHeaderByColumns("menuRolePicker");
  document.querySelector('#menuRolePickerHead [data-column-key="selection"]').innerHTML='<input type="checkbox" id="menuRolePickerAll" aria-label="全选当前页可关联角色" onchange="toggleMenuRolePickerAll(this.checked)"/>';
  renderTableByColumns("menuRolePicker",getMenuRolePickerPageRows(),"menuRolePickerBody");
  if(!rows.length)document.getElementById("menuRolePickerBody").innerHTML='<tr><td colspan="6" class="unified-org-tree-empty">暂无匹配的角色</td></tr>';
  document.getElementById("menuRolePickerPagination").innerHTML=`<span>共 ${rows.length} 条</span><div class="actions"><select class="select" aria-label="角色选择器每页条数" onchange="menuRolePickerState.pageSize=Number(this.value);menuRolePickerState.page=1;renderMenuRolePickerTable()">${[20,50,100].map(size=>`<option value="${size}" ${size===state.pageSize?"selected":""}>每页 ${size} 条</option>`).join("")}</select><button class="org-tree-depth-btn" aria-label="角色选择器上一页" ${state.page===1?"disabled":""} onclick="menuRolePickerState.page--;renderMenuRolePickerTable()">${renderTDesignIcon("chevron-left",{size:16})}</button><span>第 ${state.page} / ${pages} 页</span><button class="org-tree-depth-btn" aria-label="角色选择器下一页" ${state.page===pages?"disabled":""} onclick="menuRolePickerState.page++;renderMenuRolePickerTable()">${renderTDesignIcon("chevron-right",{size:16})}</button></div>`;
  updateMenuRolePickerSelection();
}

function updateMenuRolePickerSelection(){
  const state=menuRolePickerState,available=getMenuRolePickerPageRows().filter(role=>!menuRolePickerIsBound(role));
  const selected=available.filter(role=>state.selected.has(role.id));
  const all=document.getElementById("menuRolePickerAll");
  all.checked=available.length>0&&selected.length===available.length;
  all.indeterminate=selected.length>0&&selected.length<available.length;
  all.disabled=!available.length;
  document.querySelectorAll("[data-picker-role]:not(:disabled)").forEach(input=>input.checked=state.selected.has(input.dataset.pickerRole));
  document.getElementById("menuRolePickerSelectedCount").textContent=state.selected.size;
}

function toggleMenuRolePickerRow(id,checked){
  const role=roleData.find(item=>item.id===id);
  if(!role||menuRolePickerIsBound(role))return;
  checked?menuRolePickerState.selected.add(id):menuRolePickerState.selected.delete(id);
  updateMenuRolePickerSelection();
}
function toggleMenuRolePickerAll(checked){
  getMenuRolePickerPageRows().filter(role=>!menuRolePickerIsBound(role)).forEach(role=>checked?menuRolePickerState.selected.add(role.id):menuRolePickerState.selected.delete(role.id));
  updateMenuRolePickerSelection();
}
function queryMenuRolePicker(){
  Object.keys(menuRolePickerState.filters).forEach(key=>menuRolePickerState.filters[key]=document.getElementById(`menuRolePicker-${key}`).value.trim());
  menuRolePickerState.page=1;
  renderMenuRolePickerTable();
}
function resetMenuRolePicker(){
  Object.keys(menuRolePickerState.filters).forEach(key=>{menuRolePickerState.filters[key]="";document.getElementById(`menuRolePicker-${key}`).value="";});
  menuRolePickerState.page=1;
  renderMenuRolePickerTable();
}
function confirmMenuRolePicker(button){
  const state=menuRolePickerState;
  if(!state.selected.size)return showToast("请先选择角色");
  let count=0;
  roleData.forEach(role=>{
    if(state.selected.has(role.id)&&!menuRolePickerIsBound(role)){
      role.menuResourceIds=[...(role.menuResourceIds||[]),state.menuId];count++;
    }
  });
  closeNestedModal(button);
  renderWithPreservedScroll(renderMenuManagementRoles,[".menu-management-layout .org-user-body"]);
  showToast(`已关联 ${count} 个角色`);
}
