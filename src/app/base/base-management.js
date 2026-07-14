/* =========================
   基础 - 组织权限
========================= */

/* ---------- 通用工具 ---------- */
function findOrgById(id,node=orgTreeData,parent=null,level=1){
  if(node.id===id){
    return {node,parent,level};
  }

  for(const child of node.children || []){
    const found=findOrgById(id,child,node,level+1);
    if(found)return found;
  }

  return null;
}

function flattenOrgTree(node=orgTreeData,level=1,result=[]){
  result.push({...node,level});

  (node.children || []).forEach(child=>{
    flattenOrgTree(child,level+1,result);
  });

  return result;
}

function persistOrganizationTree(){
  organizationMasterData=flattenOrgTree().map(item=>({
    code:item.code,
    name:item.name,
    level:Number(item.level),
    parentCode:item.parentCode || ""
  }));
  window.__ORGANIZATION_MASTER_DATA__=organizationMasterData.map(item=>({
    code:item.code,name:item.name,level:String(item.level),parent_code:item.parentCode
  }));
  persistMasterData("organizations",organizationMasterData);
}

function exportMasterData(){
  const blob=new Blob([JSON.stringify(window.EMMasterData?.export() || {},null,2)],{type:"application/json"});
  const link=document.createElement("a");
  link.href=URL.createObjectURL(blob);
  link.download=`数智施工主数据_${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("主数据已导出");
}

function importMasterDataFile(input){
  const file=input.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      window.EMMasterData?.import(JSON.parse(reader.result));
      showToast("主数据已导入，正在刷新页面");
      setTimeout(()=>window.location.reload(),300);
    }catch(error){
      showToast("导入失败：请选择有效的主数据文件");
    }
  };
  reader.readAsText(file,"UTF-8");
}

function resetMasterData(){
  if(!confirm("确认恢复为系统初始主数据？当前浏览器内维护的数据将被清除。"))return;
  window.EMMasterData?.reset();
  window.location.reload();
}

function getOrgDisplayName(org){
  return org.shortName || org.name;
}

function getOrgNameById(id){
  return findOrgById(id)?.node?.name || "-";
}

function getPostById(id){
  return postData.find(x=>x.id===id);
}

function getPostNameById(id){
  if(!id)return "-";
  return getPostById(id)?.name || "-";
}

function getRoleById(id){
  return roleData.find(x=>x.id===id);
}

function getRoleNameById(id){
  return getRoleById(id)?.name || "-";
}

function getUserRoleNames(user){
  return (user.roleIds || []).map(getRoleNameById).filter(Boolean).join("、") || "-";
}

function getUsersByOrgId(orgId){
  return orgUserData.filter(u=>u.orgId===orgId);
}

function getEnabledPostOptions(selectedId){
  return postData
    .filter(x=>x.status==="启用" || x.id===selectedId)
    .map(x=>`
      <option value="${x.id}" ${selectedId===x.id?"selected":""} ${x.status==="禁用"?"disabled":""}>
        ${x.name}${x.status==="禁用"?"（已禁用）":""}
      </option>
    `)
    .join("");
}

function getEnabledRoleChecks(selectedIds=[]){
  return roleData
    .filter(x=>x.status==="启用" || selectedIds.includes(x.id))
    .map(x=>`
      <label style="display:inline-flex;align-items:center;gap:4px;margin-right:14px;margin-bottom:8px">
        <input type="checkbox" class="user-role-check" value="${x.id}" ${selectedIds.includes(x.id)?"checked":""} ${x.status==="禁用"?"disabled":""}/>
        ${x.name}${x.status==="禁用"?"（已禁用）":""}
      </label>
    `)
    .join("");
}

function getOrgSelectOptions(selectedId,currentNode=orgTreeData,level=1){
  const prefix="　".repeat(level-1);

  return `
    <option value="${currentNode.id}" ${selectedId===currentNode.id?"selected":""}>
      ${prefix}${getOrgDisplayName(currentNode)}
    </option>
    ${(currentNode.children || []).map(child=>getOrgSelectOptions(selectedId,child,level+1)).join("")}
  `;
}

function getSelectedRoleIdsFromModal(){
  return [...document.querySelectorAll(".user-role-check:checked")].map(x=>x.value);
}

/* ---------- 组织树渲染 ---------- */
function captureScrollPositions(selectors=[]){
  const states=[];
  const seen=new Set();
  selectors.forEach(selector=>{
    if(!selector||seen.has(selector))return;
    seen.add(selector);
    const element=document.querySelector(selector);
    if(element)states.push({selector,top:element.scrollTop,left:element.scrollLeft});
  });
  return states;
}

function restoreScrollPositions(states=[]){
  const restore=()=>{
    states.forEach(state=>{
      const element=document.querySelector(state.selector);
      if(element){
        element.scrollTop=state.top;
        element.scrollLeft=state.left;
      }
    });
  };
  // Restore before the browser paints the newly rendered content to avoid a visible jump to the top.
  restore();
  requestAnimationFrame(restore);
}

function renderWithPreservedScroll(render,selectors=[]){
  const states=captureScrollPositions(selectors);
  const result=render();
  if(result&&typeof result.then==="function"){
    result.then(()=>restoreScrollPositions(states)).catch(error=>{
      console.warn("renderWithPreservedScroll async render failed",error);
      restoreScrollPositions(states);
    });
  }else{
    restoreScrollPositions(states);
  }
}

function renderOrgTreeNodes(node=orgTreeData,level=1){
  const isActive=node.id===currentOrgId;
  const hasChildren=node.children && node.children.length;

  return `
    <div class="org-tree-node org-level-indent-${Math.min(level,5)} ${isActive?"active":""}" onclick="selectOrgNode('${node.id}')">
      <div class="org-node-left">
        <span>${hasChildren?"📂":"📄"}</span>
        <span class="org-node-name" title="${node.name}">${getOrgDisplayName(node)}</span>
      </div>

      <div class="org-node-tools" onclick="event.stopPropagation()">
        <button class="org-tool-btn" title="新增下级" onclick="openOrgAddModal('${node.id}')">＋</button>
        <button class="org-tool-btn" title="编辑组织" onclick="openOrgEditModal('${node.id}')">✎</button>
        <button class="org-tool-btn" title="上移" onclick="moveOrgNode('${node.id}',-1)">↑</button>
        <button class="org-tool-btn" title="下移" onclick="moveOrgNode('${node.id}',1)">↓</button>
        <button class="org-tool-btn" title="删除" onclick="deleteOrgNode('${node.id}')">🗑</button>
      </div>
    </div>

    ${(node.children || []).map(child=>renderOrgTreeNodes(child,level+1)).join("")}
  `;
}

function renderOrgManagementPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  const found=findOrgById(currentOrgId);
  const current=found?.node || orgTreeData;
  currentOrgId=current.id;

  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">组织管理</div>
    </div>

    <div class="base-auth-layout">
      <section class="org-tree-panel">
        <div class="org-tree-hd">
          <div class="card-title">组织树</div>
          <div class="actions">
            <button class="btn" onclick="exportMasterData()">导出数据</button>
            <label class="btn" style="margin:0;cursor:pointer">导入数据<input type="file" accept="application/json" onchange="importMasterDataFile(this)" style="display:none"/></label>
            <button class="btn" onclick="resetMasterData()">恢复默认</button>
            <button class="btn primary" onclick="openOrgAddModal('${currentOrgId}')">新增组织</button>
          </div>
        </div>

        <div class="org-tree-body" id="orgTreeBody">
          ${renderOrgTreeNodes()}
        </div>
      </section>

      <section class="org-user-panel">
        <div class="org-user-hd">
          <div>
            <div class="card-title">${current.name}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">
              类型：${current.type || "-"}
              ${current.areaTag?` · 区域标签：${current.areaTag}`:""}
              · 组织编号：${current.code || "-"}
              · MDM编号：${current.mdmCode || "-"}
            </div>
          </div>

          <div class="actions">
            <button class="btn primary" onclick="openOrgUserAddModal('${currentOrgId}')">新增人员</button>
          </div>
        </div>

        <div class="org-user-body">
          <table style="min-width:1180px">
            <thead>
              <tr>
                <th style="width:70px;text-align:center">序号</th>
                <th>姓名</th>
                <th>用户名</th>
                <th>手机号</th>
                <th>性别</th>
                <th>所属组织</th>
                <th>岗位</th>
                <th>角色</th>
                <th>状态</th>
                <th style="width:240px;text-align:center">操作</th>
              </tr>
            </thead>
            <tbody id="orgUserTbody"></tbody>
          </table>
        </div>

        <div class="pagination">
          <span id="orgUserTotalText">共 0 条</span>
          <span>第 1 / 1 页　每页 10 条</span>
        </div>
      </section>
    </div>
  `;

  renderOrgUserTable();
}

function renderOrgManagementPagePreservingScroll(){
  renderWithPreservedScroll(renderOrgManagementPage,["#orgTreeBody",".org-user-body","#listPage"]);
}

function renderOrgUserTable(){
  currentOrgUserList=getUsersByOrgId(currentOrgId);

  const tbody=document.getElementById("orgUserTbody");
  if(!tbody)return;

  tbody.innerHTML=currentOrgUserList.map((u,i)=>`
    <tr>
      <td style="text-align:center">${i+1}</td>
      <td>${u.name}</td>
      <td>${u.username}</td>
      <td>${maskPhone(u.phone)}</td>
      <td>${u.gender}</td>
      <td>${getOrgNameById(u.orgId)}</td>
      <td>${getPostNameById(u.postId)}</td>
      <td>${getUserRoleNames(u)}</td>
      <td>${u.status==="启用"?tag("启用","green"):tag("禁用","gray")}</td>
      <td style="text-align:center">
        <a class="link" onclick="openOrgUserEditModal('${u.id}')">编辑</a>
        ｜
        <a class="link" onclick="openOrgUserDetail('${u.id}')">查看</a>
        ｜
        <a class="link" onclick="toggleOrgUserStatus('${u.id}')">${u.status==="启用"?"禁用":"启用"}</a>
        ｜
        <a class="link" onclick="resetOrgUserPassword('${u.id}')">重置密码</a>
      </td>
    </tr>
  `).join("");

  const total=document.getElementById("orgUserTotalText");
  if(total)total.innerText=`共 ${currentOrgUserList.length} 条`;
}

function selectOrgNode(id){
  currentOrgId=id;
  renderOrgManagementPagePreservingScroll();
}

/* ---------- 组织新增、删除、排序 ---------- */
function getSiblingList(id){
  const found=findOrgById(id);
  if(!found || !found.parent)return null;
  return found.parent.children || [];
}

function moveOrgNode(id,dir){
  if(id===orgTreeData.id){
    showToast("根节点隧道股份不可排序");
    return;
  }

  const list=getSiblingList(id);
  if(!list)return;

  const index=list.findIndex(x=>x.id===id);
  const target=index+dir;

  if(index<0)return;

  if(target<0 || target>=list.length){
    showToast("当前组织已在该方向的边界");
    return;
  }

  const temp=list[index];
  list[index]=list[target];
  list[target]=temp;

  persistOrganizationTree();
  renderOrgManagementPagePreservingScroll();
  showToast("组织排序已调整");
}

function deleteOrgNode(id){
  if(id===orgTreeData.id){
    showToast("根节点隧道股份不可删除");
    return;
  }

  const found=findOrgById(id);
  if(!found || !found.parent)return;

  const org=found.node;

  if(org.children && org.children.length){
    showToast("只能删除叶子组织，请先删除下级组织");
    return;
  }

  const hasUser=orgUserData.some(u=>u.orgId===id);
  if(hasUser){
    showToast("该组织下存在人员，不能删除");
    return;
  }

  if(!confirm(`确认删除组织：${org.name}？`))return;

  found.parent.children=(found.parent.children || []).filter(x=>x.id!==id);
  currentOrgId=found.parent.id;

  persistOrganizationTree();
  renderOrgManagementPagePreservingScroll();
  showToast("组织已删除");
}

function openOrgAddModal(parentId){
  const found=findOrgById(parentId);
  if(!found)return;

  if(found.level>=5){
    showToast("组织树最多支持五级");
    return;
  }

  openModal(
    "新增组织",
    `
      <div class="form-grid-2">
        <div class="form-item">
          <label>上级组织</label>
          <input class="input" value="${found.node.name}" disabled/>
        </div>

        <div class="form-item">
          <label>组织名称 <span style="color:var(--danger)">*</span></label>
          <input id="orgFormName" class="input" placeholder="请输入组织名称"/>
        </div>

        <div class="form-item">
          <label>组织类型 <span style="color:var(--danger)">*</span></label>
          <select id="orgFormType" class="select" onchange="toggleOrgAreaTag()">
            ${orgTypeOptions.map(x=>`<option>${x}</option>`).join("")}
          </select>
        </div>

        <div class="form-item" id="orgAreaTagFormItem" style="display:none">
          <label>区域标签 <span style="color:var(--danger)">*</span></label>
          <select id="orgFormAreaTag" class="select">
            <option value="">请选择</option>
            ${areaTagOptions.map(x=>`<option>${x}</option>`).join("")}
          </select>
        </div>

        <div class="form-item">
          <label>组织简称</label>
          <input id="orgFormShortName" class="input" placeholder="若填写，组织树优先展示简称"/>
        </div>

        <div class="form-item">
          <label>组织编号 <span style="color:var(--danger)">*</span></label>
          <input id="orgFormCode" class="input" placeholder="请输入组织编号"/>
        </div>

        <div class="form-item">
          <label>MDM组织编号</label>
          <input id="orgFormMdmCode" class="input" placeholder="请输入MDM组织编号"/>
        </div>

        <div class="form-item" style="grid-column:1/-1">
          <label>备注</label>
          <textarea id="orgFormRemark" class="input" style="height:72px;padding-top:8px" placeholder="请输入备注"></textarea>
        </div>
      </div>
    `,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="saveOrgAdd('${parentId}')">保存</button>
    `
  );
}

function toggleOrgAreaTag(){
  const type=document.getElementById("orgFormType")?.value;
  const item=document.getElementById("orgAreaTagFormItem");

  if(item){
    item.style.display=type==="区域组织"?"block":"none";
  }
}

function saveOrgAdd(parentId){
  const parent=findOrgById(parentId)?.node;
  if(!parent)return;

  const name=document.getElementById("orgFormName").value.trim();
  const type=document.getElementById("orgFormType").value;
  const areaTag=document.getElementById("orgFormAreaTag")?.value || "";
  const shortName=document.getElementById("orgFormShortName").value.trim();
  const code=document.getElementById("orgFormCode").value.trim();
  const mdmCode=document.getElementById("orgFormMdmCode").value.trim();
  const remark=document.getElementById("orgFormRemark").value.trim();

  if(!name){
    showToast("请输入组织名称");
    return;
  }

  if(type==="区域组织" && !areaTag){
    showToast("请选择区域标签");
    return;
  }

  if(!code){
    showToast("请输入组织编号");
    return;
  }

  const all=flattenOrgTree();
  if(all.some(x=>x.code===code)){
    showToast("组织编号不可重复");
    return;
  }

  const newOrg={
    id:"org-"+Date.now(),
    name,
    shortName,
    type,
    areaTag:type==="区域组织"?areaTag:"",
    code,
    parentCode:parent.code,
    mdmCode,
    remark,
    children:[]
  };

  parent.children=parent.children || [];
  parent.children.push(newOrg);
  currentOrgId=newOrg.id;

  persistOrganizationTree();
  closeModal();
  renderOrgManagementPagePreservingScroll();
  showToast("组织新增成功");
}

function openOrgEditModal(id){
  const org=findOrgById(id)?.node;
  if(!org)return;
  openModal("编辑组织",`
    <div class="form-grid-2">
      <div class="form-item"><label>组织名称 <span style="color:var(--danger)">*</span></label><input id="orgEditName" class="input" value="${org.name}"/></div>
      <div class="form-item"><label>组织简称</label><input id="orgEditShortName" class="input" value="${org.shortName || ""}"/></div>
      <div class="form-item"><label>组织类型</label><input class="input" value="${org.type || "-"}" disabled/></div>
      <div class="form-item"><label>组织编号</label><input class="input" value="${org.code || "-"}" disabled/></div>
      <div class="form-item"><label>MDM组织编号</label><input id="orgEditMdmCode" class="input" value="${org.mdmCode || ""}"/></div>
      <div class="form-item" style="grid-column:1/-1"><label>备注</label><textarea id="orgEditRemark" class="input" style="height:72px;padding-top:8px">${org.remark || ""}</textarea></div>
    </div>
  `,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveOrgEdit('${id}')">保存</button>`);
}

function saveOrgEdit(id){
  const org=findOrgById(id)?.node;
  if(!org)return;
  const name=document.getElementById("orgEditName").value.trim();
  if(!name)return showToast("请输入组织名称");
  org.name=name;
  org.shortName=document.getElementById("orgEditShortName").value.trim();
  org.mdmCode=document.getElementById("orgEditMdmCode").value.trim();
  org.remark=document.getElementById("orgEditRemark").value.trim();
  persistOrganizationTree();
  closeModal();
  renderOrgManagementPagePreservingScroll();
  showToast("组织已保存");
}

/* ---------- 人员新增、详情、状态、重置密码 ---------- */
function openOrgUserAddModal(orgId){
  const org=findOrgById(orgId)?.node;
  if(!org)return;

  openModal(
    "新增人员",
    `
      <div class="form-grid-2">
        <div class="form-item">
          <label>姓名 <span style="color:var(--danger)">*</span></label>
          <input id="userFormName" class="input" placeholder="请输入姓名"/>
        </div>

        <div class="form-item">
          <label>用户名 <span style="color:var(--danger)">*</span></label>
          <input id="userFormUsername" class="input" placeholder="请输入用户名"/>
        </div>

        <div class="form-item">
          <label>手机号 <span style="color:var(--danger)">*</span></label>
          <input id="userFormPhone" class="input" placeholder="请输入手机号"/>
        </div>

        <div class="form-item">
          <label>性别 <span style="color:var(--danger)">*</span></label>
          <select id="userFormGender" class="select">
            ${genderOptions.map(x=>`<option>${x}</option>`).join("")}
          </select>
        </div>

        <div class="form-item">
          <label>所属组织 <span style="color:var(--danger)">*</span></label>
          <select id="userFormOrg" class="select">
            ${getOrgSelectOptions(orgId)}
          </select>
        </div>

        <div class="form-item">
          <label>岗位 <span style="color:var(--danger)">*</span></label>
          <select id="userFormPost" class="select">
            <option value="">请选择岗位</option>
            ${getEnabledPostOptions("")}
          </select>
        </div>

        <div class="form-item" style="grid-column:1/-1">
          <label>角色 <span style="color:var(--danger)">*</span></label>
          <div style="padding:8px 0">
            ${getEnabledRoleChecks([])}
          </div>
        </div>
      </div>
    `,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="saveOrgUserAdd()">保存</button>
    `
  );
}

function saveOrgUserAdd(){
  const name=document.getElementById("userFormName").value.trim();
  const username=document.getElementById("userFormUsername").value.trim();
  const phone=document.getElementById("userFormPhone").value.trim();
  const gender=document.getElementById("userFormGender").value;
  const orgId=document.getElementById("userFormOrg").value;
  const postId=document.getElementById("userFormPost").value;
  const roleIds=getSelectedRoleIdsFromModal();

  if(!name)return showToast("请输入姓名");
  if(!username)return showToast("请输入用户名");
  if(!phone)return showToast("请输入手机号");
  if(!orgId)return showToast("请选择所属组织");
  if(!postId)return showToast("请选择岗位");
  if(!roleIds.length)return showToast("请选择角色");

  if(orgUserData.some(u=>u.username===username)){
    showToast("用户名不可重复");
    return;
  }

  const user={
    id:"user-"+Date.now(),
    name,
    username,
    phone,
    gender,
    orgId,
    postId,
    roleIds,
    status:"启用"
  };

  orgUserData.push(user);
  currentOrgId=orgId;

  persistMasterData("users",orgUserData);
  closeModal();
  renderOrgManagementPagePreservingScroll();
  showToast("人员新增成功");
}

function openOrgUserEditModal(userId){
  const u=orgUserData.find(x=>x.id===userId);
  if(!u)return;
  openModal("编辑人员",`
    <div class="form-grid-2">
      <div class="form-item"><label>姓名 <span style="color:var(--danger)">*</span></label><input id="userEditName" class="input" value="${u.name}"/></div>
      <div class="form-item"><label>用户名</label><input class="input" value="${u.username}" disabled/></div>
      <div class="form-item"><label>手机号 <span style="color:var(--danger)">*</span></label><input id="userEditPhone" class="input" value="${u.phone}"/></div>
      <div class="form-item"><label>性别</label><select id="userEditGender" class="select">${genderOptions.map(x=>`<option ${x===u.gender?"selected":""}>${x}</option>`).join("")}</select></div>
      <div class="form-item"><label>所属组织</label><select id="userEditOrg" class="select">${getOrgSelectOptions(u.orgId)}</select></div>
      <div class="form-item"><label>岗位</label><select id="userEditPost" class="select">${getEnabledPostOptions(u.postId)}</select></div>
      <div class="form-item" style="grid-column:1/-1"><label>角色</label><div style="padding:8px 0">${getEnabledRoleChecks(u.roleIds || [])}</div></div>
    </div>
  `,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveOrgUserEdit('${userId}')">保存</button>`);
}

function saveOrgUserEdit(userId){
  const u=orgUserData.find(x=>x.id===userId);
  if(!u)return;
  const name=document.getElementById("userEditName").value.trim();
  const phone=document.getElementById("userEditPhone").value.trim();
  if(!name||!phone)return showToast("请完善姓名和手机号");
  u.name=name;
  u.phone=phone;
  u.gender=document.getElementById("userEditGender").value;
  u.orgId=document.getElementById("userEditOrg").value;
  u.postId=document.getElementById("userEditPost").value;
  u.roleIds=getSelectedRoleIdsFromModal();
  currentOrgId=u.orgId;
  persistMasterData("users",orgUserData);
  closeModal();
  renderOrgManagementPagePreservingScroll();
  showToast("人员已保存");
}

function openOrgUserDetail(userId){
  const u=orgUserData.find(x=>x.id===userId);
  if(!u)return;

  openModal(
    "人员详情",
    `
      <div class="info-grid">
        ${info("姓名",u.name)}
        ${info("用户名",u.username)}
        ${info("手机号",maskPhone(u.phone))}
        ${info("性别",u.gender)}
        ${info("所属组织",getOrgNameById(u.orgId))}
        ${info("岗位",getPostNameById(u.postId))}
        ${info("角色",getUserRoleNames(u))}
        ${info("状态",u.status)}
      </div>
    `
  );
}

function toggleOrgUserStatus(userId){
  const u=orgUserData.find(x=>x.id===userId);
  if(!u)return;

  u.status=u.status==="启用"?"禁用":"启用";

  persistMasterData("users",orgUserData);
  renderOrgUserTable();
  showToast(`${u.name} 已${u.status}`);
}

function resetOrgUserPassword(userId){
  const u=orgUserData.find(x=>x.id===userId);
  if(!u)return;

  showToast(`已重置 ${u.name} 的密码为默认密码`);
}

/* ---------- 岗位管理 ---------- */
function renderPostManagementPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">岗位管理</div>
    </div>

    <section class="card table-card">
      <div class="card-hd">
        <div class="card-title">岗位列表</div>
        <div class="actions">
          <button class="btn primary" onclick="openPostAddModal()">新增岗位</button>
          <button class="btn" onclick="renderPostManagementPage()">刷新</button>
        </div>
      </div>

      <div class="table-wrap roster-table-wrap">
        <table style="min-width:1100px">
          <thead>
            <tr>
              <th style="width:70px;text-align:center">序号</th>
              <th>岗位编码</th>
              <th>岗位名称</th>
              <th>岗位层级</th>
              <th style="text-align:right">岗位人数</th>
              <th>状态</th>
              <th>备注</th>
              <th style="width:230px;text-align:center">操作</th>
            </tr>
          </thead>
          <tbody id="postTbody"></tbody>
        </table>
      </div>

      <div class="pagination">
        <span id="postTotalText">共 ${postData.length} 条</span>
        <span>第 1 / 1 页　每页 10 条</span>
      </div>
    </section>
  `;

  renderPostTable();
}

function renderPostTable(){
  const tbody=document.getElementById("postTbody");
  if(!tbody)return;

  tbody.innerHTML=postData.map((p,i)=>{
    const count=orgUserData.filter(u=>u.postId===p.id).length;

    return `
      <tr>
        <td style="text-align:center">${i+1}</td>
        <td>${p.code}</td>
        <td>${p.name}</td>
        <td>${p.level}</td>
        <td style="text-align:right">${count}</td>
        <td>${p.status==="启用"?tag("启用","green"):tag("禁用","gray")}</td>
        <td>${p.remark || "-"}</td>
        <td style="text-align:center">
          <a class="link" onclick="openPostEditModal('${p.id}')">编辑</a>
          ｜
          <a class="link" onclick="togglePostStatus('${p.id}')">${p.status==="启用"?"禁用":"启用"}</a>
          ｜
          <a class="link" onclick="openPostBatchAuthorize('${p.id}')">批量授权</a>
        </td>
      </tr>
    `;
  }).join("");

  const total=document.getElementById("postTotalText");
  if(total)total.innerText=`共 ${postData.length} 条`;
}

function openPostAddModal(){
  openPostFormModal();
}

function openPostEditModal(postId){
  const post=postData.find(x=>x.id===postId);
  if(!post)return;

  openPostFormModal(post);
}

function openPostFormModal(post){
  const isEdit=!!post;

  openModal(
    isEdit?"编辑岗位":"新增岗位",
    `
      <div class="form-grid-2">
        <div class="form-item">
          <label>岗位编码 <span style="color:var(--danger)">*</span></label>
          <input id="postFormCode" class="input" value="${post?.code || ""}" placeholder="请输入岗位编码"/>
        </div>

        <div class="form-item">
          <label>岗位名称 <span style="color:var(--danger)">*</span></label>
          <input id="postFormName" class="input" value="${post?.name || ""}" placeholder="请输入岗位名称"/>
        </div>

        <div class="form-item">
          <label>岗位层级 <span style="color:var(--danger)">*</span></label>
          <select id="postFormLevel" class="select">
            ${["股份级","子公司级","分公司级"].map(x=>`
              <option ${post?.level===x?"selected":""}>${x}</option>
            `).join("")}
          </select>
        </div>

        <div class="form-item" style="grid-column:1/-1">
          <label>备注</label>
          <textarea id="postFormRemark" class="input" style="height:72px;padding-top:8px" placeholder="请输入备注">${post?.remark || ""}</textarea>
        </div>
      </div>
    `,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="${isEdit?`savePostEdit('${post.id}')`:"savePostAdd()"}">保存</button>
    `
  );
}

function savePostAdd(){
  const code=document.getElementById("postFormCode").value.trim();
  const name=document.getElementById("postFormName").value.trim();
  const level=document.getElementById("postFormLevel").value;
  const remark=document.getElementById("postFormRemark").value.trim();

  if(!code)return showToast("请输入岗位编码");
  if(!name)return showToast("请输入岗位名称");

  if(postData.some(p=>p.code===code)){
    showToast("岗位编码不可重复");
    return;
  }

  postData.push({
    id:"post-"+Date.now(),
    code,
    name,
    level,
    status:"启用",
    remark
  });

  closeModal();
  renderPostManagementPage();
  showToast("岗位新增成功");
}

function savePostEdit(postId){
  const post=postData.find(x=>x.id===postId);
  if(!post)return;

  const code=document.getElementById("postFormCode").value.trim();
  const name=document.getElementById("postFormName").value.trim();
  const level=document.getElementById("postFormLevel").value;
  const remark=document.getElementById("postFormRemark").value.trim();

  if(!code)return showToast("请输入岗位编码");
  if(!name)return showToast("请输入岗位名称");

  if(postData.some(p=>p.id!==postId && p.code===code)){
    showToast("岗位编码不可重复");
    return;
  }

  post.code=code;
  post.name=name;
  post.level=level;
  post.remark=remark;

  closeModal();
  renderPostManagementPage();
  showToast("岗位已保存");
}

function togglePostStatus(postId){
  const post=postData.find(x=>x.id===postId);
  if(!post)return;

  if(post.status==="启用"){
    post.status="禁用";

    orgUserData.forEach(u=>{
      if(u.postId===postId){
        u.postId="";
      }
    });

    showToast("岗位已禁用，已自动移除人员已选岗位");
  }else{
    post.status="启用";
    showToast("岗位已启用");
  }

  renderPostManagementPage();
}

function openPostBatchAuthorize(postId){
  const post=postData.find(x=>x.id===postId);
  if(!post)return;

  const selectedUserIds=orgUserData
    .filter(u=>u.postId===postId)
    .map(u=>u.id);

  openModal(
    `批量授权 - ${post.name}`,
    `
      <div class="setting-tip">
        勾选需要授权该岗位的人员后保存。已授权人员会自动回显勾选。
      </div>

      <div class="auth-selector-list">
        ${orgUserData.map(u=>`
          <div class="auth-selector-item">
            <label class="auth-selector-left">
              <input type="checkbox" class="post-auth-user-check" value="${u.id}" ${selectedUserIds.includes(u.id)?"checked":""}>
              <div>
                <div>${u.name} <span style="color:var(--muted)">(${u.username})</span></div>
                <div class="auth-selector-meta">
                  ${getOrgNameById(u.orgId)} · 当前岗位：${getPostNameById(u.postId)} · ${u.status}
                </div>
              </div>
            </label>
          </div>
        `).join("")}
      </div>
    `,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="savePostBatchAuthorize('${postId}')">保存</button>
    `,
    "large"
  );
}

function savePostBatchAuthorize(postId){
  const checkedIds=[...document.querySelectorAll(".post-auth-user-check:checked")].map(x=>x.value);

  orgUserData.forEach(u=>{
    if(checkedIds.includes(u.id)){
      u.postId=postId;
    }else if(u.postId===postId){
      u.postId="";
    }
  });

  closeModal();
  renderPostManagementPage();
  showToast("批量授权已保存");
}

/* ---------- 角色管理：基础维护，供新增人员选择 ---------- */
function renderRoleManagementPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  listPage.innerHTML=`
    <div class="compact-title-row">
      <div class="module-title">角色管理</div>
    </div>

    <section class="card table-card">
      <div class="card-hd">
        <div class="card-title">角色列表</div>
        <div class="actions">
          <button class="btn primary" onclick="openRoleAddModal()">新增角色</button>
          <button class="btn" onclick="renderRoleManagementPage()">刷新</button>
        </div>
      </div>

      <div class="table-wrap roster-table-wrap">
        <table style="min-width:900px">
          <thead>
            <tr>
              <th style="width:70px;text-align:center">序号</th>
              <th>角色编码</th>
              <th>角色名称</th>
              <th>状态</th>
              <th>备注</th>
              <th style="width:160px;text-align:center">操作</th>
            </tr>
          </thead>
          <tbody>
            ${roleData.map((r,i)=>`
              <tr>
                <td style="text-align:center">${i+1}</td>
                <td>${r.code}</td>
                <td>${r.name}</td>
                <td>${r.status==="启用"?tag("启用","green"):tag("禁用","gray")}</td>
                <td>${r.remark || "-"}</td>
                <td style="text-align:center">
                  <a class="link" onclick="openRoleEditModal('${r.id}')">编辑</a>
                  ｜
                  <a class="link" onclick="toggleRoleStatus('${r.id}')">${r.status==="启用"?"禁用":"启用"}</a>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span>共 ${roleData.length} 条</span>
        <span>第 1 / 1 页　每页 10 条</span>
      </div>
    </section>
  `;
}

function openRoleAddModal(){
  openRoleFormModal();
}

function openRoleEditModal(roleId){
  const role=roleData.find(x=>x.id===roleId);
  if(!role)return;

  openRoleFormModal(role);
}

function openRoleFormModal(role){
  const isEdit=!!role;

  openModal(
    isEdit?"编辑角色":"新增角色",
    `
      <div class="form-grid-2">
        <div class="form-item">
          <label>角色编码 <span style="color:var(--danger)">*</span></label>
          <input id="roleFormCode" class="input" value="${role?.code || ""}" placeholder="请输入角色编码"/>
        </div>

        <div class="form-item">
          <label>角色名称 <span style="color:var(--danger)">*</span></label>
          <input id="roleFormName" class="input" value="${role?.name || ""}" placeholder="请输入角色名称"/>
        </div>

        <div class="form-item" style="grid-column:1/-1">
          <label>备注</label>
          <textarea id="roleFormRemark" class="input" style="height:72px;padding-top:8px" placeholder="请输入备注">${role?.remark || ""}</textarea>
        </div>
      </div>
    `,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn primary" onclick="${isEdit?`saveRoleEdit('${role.id}')`:"saveRoleAdd()"}">保存</button>
    `
  );
}

function saveRoleAdd(){
  const code=document.getElementById("roleFormCode").value.trim();
  const name=document.getElementById("roleFormName").value.trim();
  const remark=document.getElementById("roleFormRemark").value.trim();

  if(!code)return showToast("请输入角色编码");
  if(!name)return showToast("请输入角色名称");

  if(roleData.some(r=>r.code===code)){
    showToast("角色编码不可重复");
    return;
  }

  roleData.push({
    id:"role-"+Date.now(),
    code,
    name,
    status:"启用",
    remark
  });

  closeModal();
  renderRoleManagementPage();
  showToast("角色新增成功");
}

function saveRoleEdit(roleId){
  const role=roleData.find(x=>x.id===roleId);
  if(!role)return;

  const code=document.getElementById("roleFormCode").value.trim();
  const name=document.getElementById("roleFormName").value.trim();
  const remark=document.getElementById("roleFormRemark").value.trim();

  if(!code)return showToast("请输入角色编码");
  if(!name)return showToast("请输入角色名称");

  if(roleData.some(r=>r.id!==roleId && r.code===code)){
    showToast("角色编码不可重复");
    return;
  }

  role.code=code;
  role.name=name;
  role.remark=remark;

  closeModal();
  renderRoleManagementPage();
  showToast("角色已保存");
}

function toggleRoleStatus(roleId){
  const role=roleData.find(x=>x.id===roleId);
  if(!role)return;

  if(role.status==="启用"){
    role.status="禁用";

    orgUserData.forEach(u=>{
      u.roleIds=(u.roleIds || []).filter(id=>id!==roleId);
    });

    showToast("角色已禁用，已自动从人员角色中移除");
  }else{
    role.status="启用";
    showToast("角色已启用");
  }

  renderRoleManagementPage();
}

/* ---------- 消息管理：模板、发送记录、消息记录 ---------- */
function messageStatusTag(v){
  const map={启用:"green",禁用:"gray",已发送:"green",待发送:"orange",发送中:"blue",部分发送:"orange",部分失败:"orange",失败:"red",已撤回:"gray",发送成功:"green",发送失败:"red",未读:"orange",已读:"green",未点击:"gray",已点击:"blue",开启:"orange",关闭:"gray"};
  return tag(v,map[v]||"gray");
}

function getMessageTemplateById(id){
  return messageTemplateData.find(x=>x.id===id);
}

function getSendRecordByBatch(batchNo){
  return messageSendRecordData.find(x=>x.batchNo===batchNo);
}

function getSendTriggerMode(record){
  const source=record?.triggerMode || record?.source || "";
  if(source==="手动发布" || source==="手动发送")return "手动发送";
  if(source==="业务接口")return "业务接口";
  if(source==="定时任务")return "定时任务";
  return source || "--";
}

function sendTriggerTag(record){
  const mode=getSendTriggerMode(record);
  const map={手动发送:"blue",业务接口:"green",定时任务:"orange"};
  return tag(mode,map[mode]||"gray");
}

function getMessageTemplateFiltered(){
  return messageTemplateData.filter(x=>{
    if(messageAdminState.templateType&&x.type!==messageAdminState.templateType)return false;
    if(messageAdminState.templateStatus&&x.status!==messageAdminState.templateStatus)return false;
    const bizList=messageAdminState.templateBizList||[];
    if(bizList.length && !bizList.some(b=>x.biz.includes(b.replace(/ \/ /g,">").replace(/\//g,">").trim()) || x.biz.includes(b.split(" / ").pop())))return false;
    const titleKw=messageAdminState.templateTitle||"";
    if(titleKw && !x.title.includes(titleKw))return false;
    const contentKw=messageAdminState.templateContent||"";
    if(contentKw && !x.content.includes(contentKw))return false;
    return true;
  });
}

function getMessageSendFiltered(){
  return messageSendRecordData.filter(x=>{
    if(messageAdminState.sendType&&x.type!==messageAdminState.sendType)return false;
    if(messageAdminState.sendStatus&&x.status!==messageAdminState.sendStatus)return false;
    if(messageAdminState.sendTrigger&&getSendTriggerMode(x)!==messageAdminState.sendTrigger)return false;
    const bizList=messageAdminState.sendBizList||[];
    if(bizList.length && !bizList.some(b=>x.biz.includes(b.replace(/ \/ /g,">").replace(/\//g,">").trim()) || x.biz.includes(b.split(" / ").pop())))return false;
    const titleKw=messageAdminState.sendTitle||"";
    if(titleKw && !x.title.includes(titleKw))return false;
    const contentKw=messageAdminState.sendContent||"";
    if(contentKw && !x.content.includes(contentKw))return false;
    const details=messageRecordData.filter(r=>r.batchNo===x.batchNo);
    const receiverKw=messageAdminState.sendReceiver||"";
    if(receiverKw && !details.some(r=>r.receiver.includes(receiverKw)||r.account.includes(receiverKw)))return false;
    const orgKw=messageAdminState.sendOrg||"";
    if(orgKw && !details.some(r=>r.org.includes(orgKw)))return false;
    const projectKw=messageAdminState.sendProject||"";
    if(projectKw && !details.some(r=>r.project.includes(projectKw)))return false;
    const postKw=messageAdminState.sendPost||"";
    if(postKw && !details.some(r=>r.post.includes(postKw)))return false;
    const kw=messageAdminState.sendKeyword||"";
    if(kw && !(x.title.includes(kw)||x.content.includes(kw)||x.batchNo.includes(kw)||x.biz.includes(kw)))return false;
    return true;
  });
}

function getMessageRecordFiltered(){
  return messageRecordData.filter(x=>{
    if(messageAdminState.recordType&&x.type!==messageAdminState.recordType)return false;
    const bizList=messageAdminState.recordBizList||[];
    if(bizList.length && !bizList.some(b=>x.biz.includes(b.replace(/ \/ /g,">").replace(/\//g,">").trim()) || x.biz.includes(b.split(" / ").pop())))return false;
    const titleKw=messageAdminState.recordTitle||"";
    if(titleKw && !x.title.includes(titleKw))return false;
    const contentKw=messageAdminState.recordContent||"";
    if(contentKw && !x.content.includes(contentKw))return false;
    const receiverKw=messageAdminState.recordReceiver||"";
    if(receiverKw && !(x.receiver.includes(receiverKw)||x.account.includes(receiverKw)))return false;
    const orgKw=messageAdminState.recordOrg||"";
    if(orgKw && !x.org.includes(orgKw))return false;
    const projectKw=messageAdminState.recordProject||"";
    if(projectKw && !x.project.includes(projectKw))return false;
    const postKw=messageAdminState.recordPost||"";
    if(postKw && !x.post.includes(postKw))return false;
    if(messageAdminState.recordDeliver&&x.deliverStatus!==messageAdminState.recordDeliver)return false;
    if(messageAdminState.recordRead&&x.readStatus!==messageAdminState.recordRead)return false;
    if(messageAdminState.recordClick&&x.clickStatus!==messageAdminState.recordClick)return false;
    const kw=messageAdminState.recordKeyword||"";
    if(kw && !(x.title.includes(kw)||x.content.includes(kw)||x.receiver.includes(kw)||x.account.includes(kw)||x.project.includes(kw)||x.batchNo.includes(kw)))return false;
    return true;
  });
}

function syncMessageAdminFilters(scope){
  if(scope==="template"){
    messageAdminState.templateType=document.getElementById("msgTplType")?.value || "";
    messageAdminState.templateBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgTplBizTreeFilter")).map(x=>x.dataset.label || x.value);
    messageAdminState.templateBiz=messageAdminState.templateBizList.join("、");
    messageAdminState.templateStatus=document.getElementById("msgTplStatus")?.value || "";
    messageAdminState.templateTitle=document.getElementById("msgTplTitleFilter")?.value.trim() || "";
    messageAdminState.templateContent=document.getElementById("msgTplContentFilter")?.value.trim() || "";
    messageAdminState.templateKeyword="";
    renderMessageTemplatePage();
  }
  if(scope==="send"){
    messageAdminState.sendType=document.getElementById("msgSendType")?.value || "";
    messageAdminState.sendTitle=document.getElementById("msgSendTitle")?.value.trim() || "";
    messageAdminState.sendContent=document.getElementById("msgSendContent")?.value.trim() || "";
    messageAdminState.sendBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgSendBizTreeFilter")).map(x=>x.dataset.label || x.value);
    messageAdminState.sendReceiver=document.getElementById("msgSendReceiver")?.value.trim() || "";
    messageAdminState.sendOrg=document.getElementById("msgSendOrg")?.value.trim() || "";
    messageAdminState.sendProject=document.getElementById("msgSendProject")?.value.trim() || "";
    messageAdminState.sendPost=document.getElementById("msgSendPost")?.value.trim() || "";
    messageAdminState.sendKeyword="";
    renderMessageSendRecordPage();
  }
  if(scope==="record"){
    messageAdminState.recordType=document.getElementById("msgRecordType")?.value || "";
    messageAdminState.recordTitle=document.getElementById("msgRecordTitle")?.value.trim() || "";
    messageAdminState.recordContent=document.getElementById("msgRecordContent")?.value.trim() || "";
    messageAdminState.recordBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgRecordBizTreeFilter")).map(x=>x.dataset.label || x.value);
    messageAdminState.recordReceiver=document.getElementById("msgRecordReceiver")?.value.trim() || "";
    messageAdminState.recordOrg=document.getElementById("msgRecordOrg")?.value.trim() || "";
    messageAdminState.recordProject=document.getElementById("msgRecordProject")?.value.trim() || "";
    messageAdminState.recordPost=document.getElementById("msgRecordPost")?.value.trim() || "";
    messageAdminState.recordDeliver=messageAdminState.recordDeliver || "";
    messageAdminState.recordRead=messageAdminState.recordRead || "";
    messageAdminState.recordClick=messageAdminState.recordClick || "";
    messageAdminState.recordKeyword="";
    renderMessageRecordPage();
  }
}

function resetMessageAdminFilters(scope){
  Object.keys(messageAdminState).forEach(k=>{
    if(k.toLowerCase().startsWith(scope))messageAdminState[k]=Array.isArray(messageAdminState[k])?[]:"";
  });
  if(scope==="template")renderMessageTemplatePage();
  if(scope==="send")renderMessageSendRecordPage();
  if(scope==="record")renderMessageRecordPage();
}

function messageAdminHeader(title,sub){
  return `
    <div class="compact-title-row">
      <div>
        <div class="module-title">${title}</div>
      </div>
    </div>
  `;
}


function setMessageTemplateStatFilter(type,value){
  if(type==="type"){
    messageAdminState.templateType=messageAdminState.templateType===value?"":value;
  }
  if(type==="status"){
    messageAdminState.templateStatus=messageAdminState.templateStatus===value?"":value;
  }
  renderMessageTemplatePage();
}
function renderMessageStatItem(filterType,value,count,label){
  const active=(filterType==="type"&&messageAdminState.templateType===value)||(filterType==="status"&&messageAdminState.templateStatus===value);
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageTemplateStatFilter('${filterType}','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}
function renderMessageTemplatePreviewBody(x){
  const content=String(x.content||"")
    .replace(/\$\{projectName\}/g,"机场联络线工程")
    .replace(/\$\{riskCount\}/g,"3")
    .replace(/\$\{projectCount\}/g,"247")
    .replace(/\$\{unfilledCount\}/g,"66")
    .replace(/\$\{deviceName\}/g,"1#履带吊")
    .replace(/\$\{weight\}/g,"46")
    .replace(/\$\{versionNo\}/g,"2.2.5")
    .replace(/\$\{id\}/g,"HD20260616001");
  const publishTime=x.updatedAt || "2026-06-16 09:30:00";
  const isWarn=x.type==="预警通知" || x.popup==="开启";
  const detailContent=content
    .split(/\n+/)
    .filter(Boolean)
    .map(t=>`<p>${t}</p>`)
    .join("");
  return `<div class="message-detail-preview-page ${isWarn?'warning-preview':''}">
    <div class="message-detail-preview-hero">
      <div class="message-detail-preview-title-row">
        <div>
          <div class="message-detail-preview-title">${x.title}</div>
          <div class="message-detail-preview-time">更新发布于 ${publishTime}</div>
        </div>
        ${isWarn?`<span class="message-detail-preview-badge">预警通知</span>`:`<span class="message-detail-preview-badge normal">消息通知</span>`}
      </div>
      <div class="message-detail-preview-content-card">
        <div class="message-detail-preview-richtext">
          ${detailContent || '<p>暂无消息内容</p>'}
        </div>
        <div class="message-detail-preview-attach">附件：无</div>
      </div>
    </div>
  </div>`;
}
function openMessageTemplatePreview(id){
  const x=getMessageTemplateById(id);
  if(!x)return;
  openModal("消息预览",renderMessageTemplatePreviewBody(x),`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("message-detail-preview-modal");
}

tableColumnDefinitions.messageTemplate=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"type",title:"消息类型",width:120,align:"center",render:x=>messageStatusTag(x.type)},
  {key:"biz",title:"业务分类",width:150,align:"center",render:x=>tag(x.biz,"blue")},
  {key:"title",title:"消息标题",width:220,align:"left",render:x=>x.title},
  {key:"content",title:"消息内容",width:300,align:"left",render:x=>`<span class="message-admin-ellipsis">${x.content}</span>`},
  {key:"channel",title:"发送通道",width:100,align:"center",render:x=>x.channel},
  {key:"targetType",title:"接收人员类型",width:130,align:"center",render:x=>x.targetType},
  {key:"targetValue",title:"接收对象选择",width:170,align:"left",render:x=>x.targetValue},
  {key:"jump",title:"是否跳转",width:100,align:"center",render:x=>messageStatusTag(x.jumpLink?"开启":"关闭")},
  {key:"jumpLink",title:"跳转链接",width:220,align:"left",render:x=>x.jumpLink||"无"},
  {key:"popup",title:"是否弹框",width:100,align:"center",render:x=>messageStatusTag(x.popup)},
  {key:"callCount",title:"调用次数",width:100,align:"right",render:x=>`<a class="link" onclick="openTemplateSendRecords('${x.id}')">${x.callCount}</a>`},
  {key:"status",title:"状态",width:90,align:"center",render:x=>messageStatusTag(x.status)},
  {key:"operation",title:"操作",width:170,align:"center",render:x=>`<a class="link" onclick="openMessageTemplateDetail('${x.id}')">查看</a> <a class="link" onclick="openMessageTemplatePreview('${x.id}')">预览</a> <a class="link" onclick="toggleMessageTemplateStatus('${x.id}')">${x.status==="启用"?"禁用":"启用"}</a>`}
];

function renderMessageTemplatePage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const list=getMessageTemplateFiltered();
  const enabled=messageTemplateData.filter(x=>x.status==="启用").length;
  const disabled=messageTemplateData.filter(x=>x.status==="禁用").length;
  const typeNotice=messageTemplateData.filter(x=>x.type==="消息通知").length;
  const typeWarn=messageTemplateData.filter(x=>x.type==="预警通知").length;
  const calls=messageTemplateData.reduce((sum,x)=>sum+x.callCount,0);
  const systemCalls=Math.round(calls*0.82);
  const manualCalls=calls-systemCalls;
  const queryFields=`
    <div class="form-item"><label>消息类型</label><select class="select" id="msgTplType"><option value="">全部</option><option ${messageAdminState.templateType==="消息通知"?'selected':''}>消息通知</option></select></div>
    <div class="form-item"><label>业务分类</label>${renderTemplateBizFilterTreeSelect()}</div>
    <div class="form-item"><label>模板状态</label><select class="select" id="msgTplStatus"><option value="">全部</option><option ${messageAdminState.templateStatus==="启用"?'selected':''}>启用</option><option ${messageAdminState.templateStatus==="禁用"?'selected':''}>禁用</option></select></div>
    <div class="form-item"><label>消息标题</label><input class="input" id="msgTplTitleFilter" placeholder="请输入消息标题" value="${messageAdminState.templateTitle||''}"/></div>
    <div class="form-item"><label>消息内容</label><input class="input" id="msgTplContentFilter" placeholder="请输入消息内容" value="${messageAdminState.templateContent||''}"/></div>
  `;
  const statsHtml=`
    <div class="stats message-admin-stats message-template-stats">
      <div class="stat message-type-stat"><div class="stat-name">消息类型</div><div class="message-call-stat-grid stat-click-grid">${renderMessageStatItem("type","消息通知",typeNotice,"消息通知")}${renderMessageStatItem("type","预警通知",typeWarn,"预警通知")}</div></div>
      <div class="stat message-type-stat"><div class="stat-name">模板状态</div><div class="message-call-stat-grid stat-click-grid">${renderMessageStatItem("status","启用",enabled,"启用模板")}${renderMessageStatItem("status","禁用",disabled,"禁用模板")}</div></div>
      <div class="stat message-call-stat"><div class="stat-name">累计调用</div><div class="message-call-stat-grid"><div><strong>${calls}</strong><span>累计调用</span></div><div><strong>${systemCalls}</strong><span>系统调用</span></div><div><strong>${manualCalls}</strong><span>手动调用</span></div></div></div>
    </div>
  `;

  listPage.innerHTML=`
    ${messageAdminHeader("消息模板","配置业务触发和手动发送可复用的消息内容、接收路由与展示方式")}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-template-search-grid",queryFn:"syncMessageAdminFilters('template')",resetFn:"resetMessageAdminFilters('template')"})}
    ${renderUnifiedStatsCard(statsHtml)}
    ${renderUnifiedTableCard({
      title:"模板列表",
      tableKey:"messageTemplate",
      tableId:"messageTemplateTable",
      theadId:"messageTemplateThead",
      tbodyId:"messageTemplateTbody",
      totalId:"messageTemplateTotalText",
      total:list.length,
      renderFnName:"renderMessageTemplatePage",
      beforeActions:`<button class="btn primary" onclick="openMessageTemplateForm()">模板创建</button>`,
      refreshAction:"renderMessageTemplatePage();showToast('已刷新消息模板数据')",
      exportAction:"showToast('导出成功：消息模板.xlsx')"
    })}
  `;
  setSelectValue("msgTplType",messageAdminState.templateType);
  setSelectValue("msgTplStatus",messageAdminState.templateStatus);
  renderTableByColumns("messageTemplate",list,"messageTemplateTbody");
  setTimeout(()=>{refreshTemplateTreeStates("msgTplBizTreeFilter");updateTemplateCheckTreeValue("msgTplBizTreeFilter");},0);
}

function renderMessageSendBizFilterTreeSelect(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgSendBizTreeFilter",tree,"请选择业务分类",messageAdminState.sendBizList||[]);
}

function calcPercent(numerator,denominator){
  return denominator?`${Math.round((Number(numerator)||0)/(Number(denominator)||0)*100)}%`:"0%";
}

function getSendMetric(record,key){
  if(key==="touchRate")return calcPercent(record.sentCount,record.shouldCount);
  if(key==="readRate")return calcPercent(record.readCount,record.sentCount);
  if(key==="clickRate")return calcPercent(record.clickCount,record.readCount);
  return "0%";
}

function setMessageSendStatFilter(type,value){
  if(type==="status")messageAdminState.sendStatus=messageAdminState.sendStatus===value?"":value;
  if(type==="trigger")messageAdminState.sendTrigger=messageAdminState.sendTrigger===value?"":value;
  if(type==="type")messageAdminState.sendType=messageAdminState.sendType===value?"":value;
  renderMessageSendRecordPage();
}

function renderMessageSendTypeStat(value,count,label){
  const active=messageAdminState.sendType===value;
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageSendStatFilter('type','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}

function renderMessageSendStatusStat(value,count,label){
  const active=messageAdminState.sendStatus===value;
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageSendStatFilter('status','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}

function renderMessageSendTriggerStat(value,count,label){
  const active=messageAdminState.sendTrigger===value;
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageSendStatFilter('trigger','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}

function renderMessageSendMetricStat(label,value,desc){
  return `<div class="message-stat-option metric-only"><strong>${value}</strong><span>${label}${renderInfoTip(desc)}</span></div>`;
}

function getSendDrillRecords(){
  return messageRecordData.filter(x=>{
    if(x.batchNo!==messageSendDrillState.batchNo)return false;
    if(messageSendDrillState.deliver&&x.deliverStatus!==messageSendDrillState.deliver)return false;
    if(messageSendDrillState.read&&x.readStatus!==messageSendDrillState.read)return false;
    if(messageSendDrillState.click&&x.clickStatus!==messageSendDrillState.click)return false;
    return true;
  });
}

function setSendDrillStatFilter(type,value){
  if(type==="deliver")messageSendDrillState.deliver=messageSendDrillState.deliver===value?"":value;
  if(type==="read")messageSendDrillState.read=messageSendDrillState.read===value?"":value;
  if(type==="click")messageSendDrillState.click=messageSendDrillState.click===value?"":value;
  renderSendDrillModalBody();
}

function renderSendDrillStatItem(type,value,count,label){
  const active=(type==="deliver"&&messageSendDrillState.deliver===value)||(type==="read"&&messageSendDrillState.read===value)||(type==="click"&&messageSendDrillState.click===value);
  return `<button class="message-stat-option ${active?'active':''}" onclick="setSendDrillStatFilter('${type}','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}

function renderSendDrillStats(){
  const all=messageRecordData.filter(x=>x.batchNo===messageSendDrillState.batchNo);
  const success=all.filter(x=>x.deliverStatus==="发送成功").length;
  const failed=all.filter(x=>x.deliverStatus==="发送失败").length;
  const unread=all.filter(x=>x.readStatus==="未读").length;
  const read=all.filter(x=>x.readStatus==="已读").length;
  const unclicked=all.filter(x=>x.clickStatus==="未点击").length;
  const clicked=all.filter(x=>x.clickStatus==="已点击").length;
  return `
    <div class="stats message-record-stats send-drill-stats">
      <div class="stat message-record-stat-group"><div class="stat-name">送达状态</div><div class="message-call-stat-grid stat-click-grid">${renderSendDrillStatItem("deliver","发送成功",success,"发送成功")}${renderSendDrillStatItem("deliver","发送失败",failed,"发送失败")}</div></div>
      <div class="stat message-record-stat-group"><div class="stat-name">阅读状态</div><div class="message-call-stat-grid stat-click-grid">${renderSendDrillStatItem("read","未读",unread,"未读")}${renderSendDrillStatItem("read","已读",read,"已读")}</div></div>
      <div class="stat message-record-stat-group"><div class="stat-name">点击状态</div><div class="message-call-stat-grid stat-click-grid">${renderSendDrillStatItem("click","未点击",unclicked,"未点击")}${renderSendDrillStatItem("click","已点击",clicked,"已点击")}</div></div>
    </div>
  `;
}

function renderSendDrillModalBody(){
  const list=getSendDrillRecords();
  const body=document.getElementById("modalBody");
  if(!body)return;
  body.innerHTML=`
    <div class="send-drill-modal">
      <div class="send-drill-summary">
        <span>发送批次号：<strong>${messageSendDrillState.batchNo}</strong></span>
        <span>当前明细：<strong>${list.length}</strong> 条</span>
      </div>
      <section class="card unified-stats-card send-drill-stats-card">
        <div class="card-bd">${renderSendDrillStats()}</div>
      </section>
      <section class="card table-card send-drill-table-card">
        <div class="card-hd">
          <div class="card-title">触达明细</div>
          <div class="actions">
            <button class="btn" onclick="renderSendDrillModalBody();showToast('已刷新触达明细')">刷新</button>
            <button class="btn primary" onclick="showToast('导出成功：触达明细.xlsx')">导出</button>
          </div>
        </div>
        <div class="table-wrap roster-table-wrap">
          <table style="min-width:${getTableMinWidth('messageRecord')}px">
            <thead><tr>${renderTableHeaderByColumns('messageRecord')}</tr></thead>
            <tbody id="sendDrillRecordTbody"></tbody>
          </table>
        </div>
        <div class="pagination"><span>共 ${list.length} 条</span><span>第 1 / 1 页　每页 10 条</span></div>
      </section>
    </div>
  `;
  renderTableByColumns("messageRecord",list,"sendDrillRecordTbody");
}

function openSendRecordDrilldown(batchNo,type){
  messageSendDrillState.batchNo=batchNo;
  messageSendDrillState.deliver="";
  messageSendDrillState.read="";
  messageSendDrillState.click="";
  messageSendDrillState.title=type==="read"?"已读人数":type==="click"?"点击人数":"实发人数";
  if(type==="read")messageSendDrillState.read="已读";
  if(type==="click")messageSendDrillState.click="已点击";
  openModal(`${messageSendDrillState.title}明细`,"",`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("send-drill-modal-box");
  renderSendDrillModalBody();
}

tableColumnDefinitions.messageSend=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"status",title:"发送状态",width:100,align:"center",render:x=>messageStatusTag(x.status)},
  {key:"type",title:"消息类型",width:120,align:"center",render:x=>messageStatusTag(x.type)},
  {key:"biz",title:"业务分类",width:140,align:"center",render:x=>tag(x.biz,"blue")},
  {key:"title",title:"消息标题",width:220,align:"left",render:x=>x.title},
  {key:"content",title:"消息内容",width:280,align:"left",render:x=>`<span class="message-admin-ellipsis">${x.content}</span>`},
  {key:"sendTime",title:"发送时间",width:170,align:"center",render:x=>x.sendTime||"--"},
  {key:"shouldCount",title:"应发人数",width:100,align:"right",render:x=>x.shouldCount},
  {key:"sentCount",title:"实发人数",width:100,align:"right",render:x=>`<a class="link" onclick="openSendRecordDrilldown('${x.batchNo}','sent')">${x.sentCount}</a>`},
  {key:"touchRate",title:"触达率",width:90,align:"center",render:x=>getSendMetric(x,"touchRate")},
  {key:"readCount",title:"已读人数",width:100,align:"right",render:x=>`<a class="link" onclick="openSendRecordDrilldown('${x.batchNo}','read')">${x.readCount}</a>`},
  {key:"readRate",title:"阅读率",width:90,align:"center",render:x=>getSendMetric(x,"readRate")},
  {key:"clickCount",title:"点击人数",width:100,align:"right",render:x=>`<a class="link" onclick="openSendRecordDrilldown('${x.batchNo}','click')">${x.clickCount}</a>`},
  {key:"clickRate",title:"点击率",width:90,align:"center",render:x=>getSendMetric(x,"clickRate")},
  {key:"channel",title:"发送通道",width:100,align:"center",render:x=>x.channel},
  {key:"triggerMode",title:"触发方式",width:110,align:"center",render:x=>sendTriggerTag(x)},
  {key:"targetType",title:"接收人员类型",width:130,align:"center",render:x=>x.targetType},
  {key:"targetValue",title:"接收对象选择",width:170,align:"left",render:x=>x.targetValue},
  {key:"jump",title:"是否跳转",width:100,align:"center",render:x=>messageStatusTag(x.jumpLink?"开启":"关闭")},
  {key:"jumpLink",title:"跳转链接",width:220,align:"left",render:x=>x.jumpLink||"无"},
  {key:"popup",title:"是否弹框",width:100,align:"center",render:x=>messageStatusTag(x.popup)},
  {key:"popupStyle",title:"弹框样式",width:110,align:"center",render:x=>x.popupStyle || (x.popup==="开启" ? "普通样式" : "--")},
  {key:"operation",title:"操作",width:180,align:"center",render:x=>`<a class="link" onclick="openMessageSendDetail('${x.id}')">查看</a> ${x.status==="待发送"?`<a class="link" onclick="sendPendingMessage('${x.id}')">发送</a>`:""} ${x.failCount?`<a class="link" onclick="retrySendRecord('${x.id}')">重发</a>`:""} ${["已发送","部分发送","部分失败"].includes(x.status)?`<a class="link" onclick="withdrawSendRecord('${x.id}')">撤回</a>`:""}`}
];

function renderMessageSendRecordPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const list=getMessageSendFiltered();
  const should=list.reduce((sum,x)=>sum+x.shouldCount,0);
  const sent=list.reduce((sum,x)=>sum+x.sentCount,0);
  const read=list.reduce((sum,x)=>sum+x.readCount,0);
  const clicked=list.reduce((sum,x)=>sum+x.clickCount,0);
  const all=messageSendRecordData;
  const statusCounts={
    wait:all.filter(x=>x.status==="待发送").length,
    sent:all.filter(x=>x.status==="已发送").length,
    partial:all.filter(x=>x.status==="部分发送").length,
    failed:all.filter(x=>x.status==="失败").length,
    withdrawn:all.filter(x=>x.status==="已撤回").length
  };
  const triggerCounts={
    manual:all.filter(x=>getSendTriggerMode(x)==="手动发送").length,
    api:all.filter(x=>getSendTriggerMode(x)==="业务接口").length,
    timer:all.filter(x=>getSendTriggerMode(x)==="定时任务").length
  };
  const typeCounts={
    notice:all.filter(x=>x.type==="消息通知").length,
    announcement:all.filter(x=>x.type==="通知公告").length,
    todo:all.filter(x=>x.type==="待办任务" || x.type==="代办任务").length,
    warning:all.filter(x=>x.type==="预警通知").length
  };
  const queryFields=`
    <div class="form-item"><label>消息类型</label><select class="select" id="msgSendType"><option value="">全部</option><option>消息通知</option><option>通知公告</option><option value="待办任务">代办任务</option><option>预警通知</option></select></div>
    <div class="form-item"><label>消息标题</label><input class="input" id="msgSendTitle" placeholder="请输入消息标题" value="${messageAdminState.sendTitle||''}"/></div>
    <div class="form-item"><label>消息内容</label><input class="input" id="msgSendContent" placeholder="请输入消息内容" value="${messageAdminState.sendContent||''}"/></div>
    <div class="form-item"><label>业务分类</label>${renderMessageSendBizFilterTreeSelect()}</div>
    <div class="form-item"><label>接收人姓名</label><input class="input" id="msgSendReceiver" placeholder="匹配消息记录接收人" value="${messageAdminState.sendReceiver||''}"/></div>
    <div class="form-item"><label>接收人组织</label><input class="input" id="msgSendOrg" placeholder="匹配消息记录组织" value="${messageAdminState.sendOrg||''}"/></div>
    <div class="form-item"><label>接收人项目</label><input class="input" id="msgSendProject" placeholder="匹配消息记录项目" value="${messageAdminState.sendProject||''}"/></div>
    <div class="form-item"><label>接收人岗位</label><input class="input" id="msgSendPost" placeholder="匹配消息记录岗位" value="${messageAdminState.sendPost||''}"/></div>
  `;
  const statsHtml=`
    <div class="stats message-send-stats">
      <div class="stat message-send-stat-group type-group">
        <div class="stat-name">消息类型</div>
        <div class="message-call-stat-grid stat-click-grid four-col">
          ${renderMessageSendTypeStat("消息通知",typeCounts.notice,"消息通知")}
          ${renderMessageSendTypeStat("通知公告",typeCounts.announcement,"通知公告")}
          ${renderMessageSendTypeStat("待办任务",typeCounts.todo,"代办任务")}
          ${renderMessageSendTypeStat("预警通知",typeCounts.warning,"预警通知")}
        </div>
      </div>
      <div class="stat message-send-stat-group status-group">
        <div class="stat-name">发送状态</div>
        <div class="message-call-stat-grid stat-click-grid five-col">
          ${renderMessageSendStatusStat("待发送",statusCounts.wait,"待发送")}
          ${renderMessageSendStatusStat("已发送",statusCounts.sent,"已发送")}
          ${renderMessageSendStatusStat("部分发送",statusCounts.partial,"部分发送")}
          ${renderMessageSendStatusStat("失败",statusCounts.failed,"失败")}
          ${renderMessageSendStatusStat("已撤回",statusCounts.withdrawn,"已撤回")}
        </div>
      </div>
      <div class="stat message-send-stat-group trigger-group">
        <div class="stat-name">触发方式</div>
        <div class="message-call-stat-grid stat-click-grid">
          ${renderMessageSendTriggerStat("手动发送",triggerCounts.manual,"手动发送")}
          ${renderMessageSendTriggerStat("业务接口",triggerCounts.api,"业务接口")}
          ${renderMessageSendTriggerStat("定时任务",triggerCounts.timer,"定时任务")}
        </div>
      </div>
      <div class="stat message-send-stat-group metric-group">
        <div class="stat-name">指标统计</div>
        <div class="message-call-stat-grid stat-click-grid">
          ${renderMessageSendMetricStat("触达率",calcPercent(sent,should),"实发 / 应发")}
          ${renderMessageSendMetricStat("阅读率",calcPercent(read,sent),"已读 / 实发")}
          ${renderMessageSendMetricStat("点击率",calcPercent(clicked,read),"点击 / 已读")}
        </div>
      </div>
    </div>
  `;

  listPage.innerHTML=`
    ${messageAdminHeader("发送记录","按发送批次查看每一次消息发送的内容、范围、状态和触达统计")}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-send-search-grid",queryFn:"syncMessageAdminFilters('send')",resetFn:"resetMessageAdminFilters('send')"})}
    ${renderUnifiedStatsCard(statsHtml)}
    ${renderUnifiedTableCard({
      title:"发送批次",
      tableKey:"messageSend",
      tableId:"messageSendTable",
      theadId:"messageSendThead",
      tbodyId:"messageSendTbody",
      totalId:"messageSendTotalText",
      total:list.length,
      renderFnName:"renderMessageSendRecordPage",
      beforeActions:`<button class="btn primary" onclick="openMessageTemplateSend()">引用模板创建</button><button class="btn" onclick="openMessageManualSend()">手动创建</button>`,
      refreshAction:"renderMessageSendRecordPage();showToast('已刷新发送记录数据')",
      exportAction:"showToast('导出成功：发送记录.xlsx')"
    })}
  `;
  setSelectValue("msgSendType",messageAdminState.sendType);
  renderTableByColumns("messageSend",list,"messageSendTbody");
  setTimeout(()=>refreshTemplateTreeStates("msgSendBizTreeFilter"),0);
}



/* V2.2.19 消息记录字段顺序优化：主表与实发/已读/点击人数弹框统一引用；保留触达明细最后一列“操作” */
tableColumnDefinitions.messageRecord=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"type",title:"消息类型",width:120,align:"center",render:x=>messageStatusTag(x.type)},
  {key:"biz",title:"业务分类",width:140,align:"center",render:x=>tag(x.biz,"blue")},
  {key:"title",title:"消息标题",width:220,align:"left",render:x=>x.title||"--"},
  {key:"content",title:"消息内容",width:280,align:"left",render:x=>`<span class="message-admin-ellipsis">${x.content||"--"}</span>`},
  {key:"receiver",title:"接收人",width:130,align:"left",render:x=>`${x.receiver||"--"}${x.account?`<span class="message-admin-muted">${x.account}</span>`:""}`},
  {key:"org",title:"接收人组织",width:170,align:"left",render:x=>x.org||"--"},
  {key:"project",title:"接收人项目",width:190,align:"left",render:x=>x.project||"--"},
  {key:"post",title:"接收人岗位",width:130,align:"left",render:x=>x.post||"--"},
  {key:"deliverStatus",title:"送达状态",width:120,align:"center",render:x=>messageStatusTag(x.deliverStatus||x.status||"--")},
  {key:"deliverTime",title:"送达时间",width:170,align:"center",render:x=>x.deliverTime||x.sendTime||"--"},
  {key:"readStatus",title:"阅读状态",width:120,align:"center",render:x=>messageStatusTag(x.readStatus||"--")},
  {key:"readTime",title:"阅读时间",width:170,align:"center",render:x=>x.readTime||"--"},
  {key:"clickStatus",title:"点击状态",width:120,align:"center",render:x=>messageStatusTag(x.clickStatus||"--")},
  {key:"clickTime",title:"点击时间",width:170,align:"center",render:x=>x.clickTime||"--"},
  {key:"batchNo",title:"发送批次号",width:180,align:"left",render:x=>x.batchNo||"--"},
  {key:"channel",title:"发送通道",width:120,align:"center",render:x=>x.channel||"--"},
  {key:"failReason",title:"失败原因",width:180,align:"left",render:x=>x.failReason||"--"},
  {key:"operation",title:"操作",width:120,align:"center",render:x=>`<a class="link" onclick="openMessageRecordDetail('${x.id}')">查看</a> ${x.deliverStatus==="发送失败"?`<a class="link" onclick="retryMessageRecord('${x.id}')">重发</a>`:""}`}
];

function renderMessageRecordBizFilterTreeSelect(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgRecordBizTreeFilter",tree,"请选择业务分类",messageAdminState.recordBizList||[]);
}
function setMessageRecordStatFilter(type,value){
  if(type==="deliver")messageAdminState.recordDeliver=messageAdminState.recordDeliver===value?"":value;
  if(type==="read")messageAdminState.recordRead=messageAdminState.recordRead===value?"":value;
  if(type==="click")messageAdminState.recordClick=messageAdminState.recordClick===value?"":value;
  renderMessageRecordPage();
}
function renderMessageRecordStatItem(filterType,value,count,label){
  const active=(filterType==="deliver"&&messageAdminState.recordDeliver===value)||(filterType==="read"&&messageAdminState.recordRead===value)||(filterType==="click"&&messageAdminState.recordClick===value);
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageRecordStatFilter('${filterType}','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}
function renderMessageRecordPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const list=getMessageRecordFiltered();
  const all=messageRecordData;
  const success=all.filter(x=>x.deliverStatus==="发送成功").length;
  const failed=all.filter(x=>x.deliverStatus==="发送失败").length;
  const unread=all.filter(x=>x.readStatus==="未读").length;
  const read=all.filter(x=>x.readStatus==="已读").length;
  const unclicked=all.filter(x=>x.clickStatus==="未点击").length;
  const clicked=all.filter(x=>x.clickStatus==="已点击").length;
  const queryFields=`
    <div class="form-item"><label>消息类型</label><select class="select" id="msgRecordType"><option value="">全部</option><option>消息通知</option><option>预警通知</option><option>待办任务</option></select></div>
    <div class="form-item"><label>消息标题</label><input class="input" id="msgRecordTitle" placeholder="请输入消息标题" value="${messageAdminState.recordTitle||''}"/></div>
    <div class="form-item"><label>消息内容</label><input class="input" id="msgRecordContent" placeholder="请输入消息内容" value="${messageAdminState.recordContent||''}"/></div>
    <div class="form-item"><label>业务分类</label>${renderMessageRecordBizFilterTreeSelect()}</div>
    <div class="form-item"><label>接收人姓名</label><input class="input" id="msgRecordReceiver" placeholder="请输入接收人姓名" value="${messageAdminState.recordReceiver||''}"/></div>
    <div class="form-item"><label>接收人组织</label><input class="input" id="msgRecordOrg" placeholder="请输入接收人组织" value="${messageAdminState.recordOrg||''}"/></div>
    <div class="form-item"><label>接收人项目</label><input class="input" id="msgRecordProject" placeholder="请输入接收人项目" value="${messageAdminState.recordProject||''}"/></div>
    <div class="form-item"><label>接收人岗位</label><input class="input" id="msgRecordPost" placeholder="请输入接收人岗位" value="${messageAdminState.recordPost||''}"/></div>
  `;
  const statsHtml=`
    <div class="stats message-record-stats">
      <div class="stat message-record-stat-group"><div class="stat-name">送达状态</div><div class="message-call-stat-grid stat-click-grid">${renderMessageRecordStatItem("deliver","发送成功",success,"发送成功")}${renderMessageRecordStatItem("deliver","发送失败",failed,"发送失败")}</div></div>
      <div class="stat message-record-stat-group"><div class="stat-name">阅读状态</div><div class="message-call-stat-grid stat-click-grid">${renderMessageRecordStatItem("read","未读",unread,"未读")}${renderMessageRecordStatItem("read","已读",read,"已读")}</div></div>
      <div class="stat message-record-stat-group"><div class="stat-name">点击状态</div><div class="message-call-stat-grid stat-click-grid">${renderMessageRecordStatItem("click","未点击",unclicked,"未点击")}${renderMessageRecordStatItem("click","已点击",clicked,"已点击")}</div></div>
    </div>
  `;

  listPage.innerHTML=`
    ${messageAdminHeader("消息记录","按接收人查看每一条消息触达明细，包含送达、阅读、点击和失败原因")}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-record-search-grid",queryFn:"syncMessageAdminFilters('record')",resetFn:"resetMessageAdminFilters('record')"})}
    ${renderUnifiedStatsCard(statsHtml)}
    ${renderUnifiedTableCard({
      title:"触达明细",
      tableKey:"messageRecord",
      tableId:"messageRecordTable",
      theadId:"messageRecordThead",
      tbodyId:"messageRecordTbody",
      totalId:"messageRecordTotalText",
      total:list.length,
      renderFnName:"renderMessageRecordPage",
      refreshAction:"renderMessageRecordPage();showToast('已刷新消息记录数据')",
      exportAction:"showToast('导出成功：消息记录.xlsx')"
    })}
  `;
  setSelectValue("msgRecordType",messageAdminState.recordType);
  renderTableByColumns('messageRecord',list,'messageRecordTbody');
  setTimeout(()=>refreshTemplateTreeStates("msgRecordBizTreeFilter"),0);
}

function setSelectValue(id,value){
  const el=document.getElementById(id);
  if(el)el.value=value || "";
}

const messageTemplateInterfaceOptions=[
  "每日安全监督验收未完成接口",
  "里程碑节点超期未闭环接口",
  "劳务工超龄预警接口",
  "劳务工进场48小时未出场接口",
  "设备IoT预警接入接口",
  "审批节点到达通知接口",
  "待办临期/逾期提醒接口"
];

function renderTemplateInterfaceOptions(){
  return messageTemplateInterfaceOptions.map((x,i)=>`<option value="api_${i+1}">${x}</option>`).join("");
}

function renderMonthDayOptions(){
  return Array.from({length:31},(_,i)=>`<option value="${i+1}">${i+1}日</option>`).join("");
}

function syncTemplateTriggerRule(){
  const rule=document.getElementById("msgTplTriggerRule")?.value || "api";
  const apiField=document.getElementById("msgTplApiField");
  const cycleField=document.getElementById("msgTplCycleField");
  const isTimer=rule==="timer";
  if(apiField)apiField.style.display=isTimer?"none":"flex";
  if(cycleField)cycleField.style.display=isTimer?"flex":"none";
  syncTemplateTriggerCycle();
}

function syncTemplateTriggerCycle(){
  const rule=document.getElementById("msgTplTriggerRule")?.value || "api";
  const cycle=document.getElementById("msgTplTriggerCycle")?.value || "day";
  const daily=document.getElementById("msgTplDailyTimeField");
  const weekly=document.getElementById("msgTplWeeklyTimeField");
  const monthly=document.getElementById("msgTplMonthlyTimeField");
  const showTimer=rule==="timer";
  if(daily)daily.style.display=showTimer&&cycle==="day"?"flex":"none";
  if(weekly)weekly.style.display=showTimer&&cycle==="week"?"flex":"none";
  if(monthly)monthly.style.display=showTimer&&cycle==="month"?"flex":"none";
}

function selectMessageTemplateType(type){
  const input=document.getElementById("msgTplFormType");
  if(input)input.value=type;
  document.querySelectorAll(".message-type-card").forEach(card=>{
    card.classList.toggle("active",card.dataset.type===type);
  });
  const hint=document.getElementById("msgTplTypeHint");
  if(hint){
    hint.textContent=type==="待办任务"
      ?"待办任务需用户完成任务后才形成闭环，可用于审批、整改、填报等任务型消息。"
      :type==="通知公告"
        ?"通知公告适用于制度文件、重要通知和公司公告等集中触达场景。"
      :type==="预警通知"
        ?"预警通知适用于风险、异常、超期等强提醒场景。"
        :"消息通知适用于普通提醒、公告触达和业务结果通知。";
  }
  if(typeof syncTemplatePopupStyleLock==="function")syncTemplatePopupStyleLock();
  if(typeof syncTodoAdvancedControl==="function")syncTodoAdvancedControl();
  if(document.getElementById("msgTplFormMode")?.value==="send" && typeof syncMessageTemplateSendTypeTemplates==="function")syncMessageTemplateSendTypeTemplates();
}

function openMessageTemplateForm(mode){
  const isSendMode=mode==="send";
  const isManualMode=mode==="manual";
  const isCreateMode=isSendMode || isManualMode;
  const defaultSendTemplate=isSendMode ? getDefaultTemplateByType("消息通知") : null;
  openModal(isSendMode?"引用模板创建":isManualMode?"手动创建":"消息模板配置",`
    <div class="message-template-pro message-template-v2220">
      <input type="hidden" id="msgTplFormType" value="消息通知"/>
      <input type="hidden" id="msgTplFormMode" value="${isSendMode?"send":isManualMode?"manual":"template"}"/>

      <div class="message-type-card-switch">
        <button type="button" class="message-type-card active" data-type="消息通知" onclick="selectMessageTemplateType('消息通知')">
          <strong>消息通知</strong>
          <span>普通触达提醒</span>
        </button>
        ${isManualMode?`
        <button type="button" class="message-type-card" data-type="通知公告" onclick="selectMessageTemplateType('通知公告')">
          <strong>通知公告</strong>
          <span>公告文件触达</span>
        </button>`:""}
        <button type="button" class="message-type-card" data-type="预警通知" onclick="selectMessageTemplateType('预警通知')">
          <strong>预警通知</strong>
          <span>风险预警提醒</span>
        </button>
        <button type="button" class="message-type-card" data-type="待办任务" onclick="selectMessageTemplateType('待办任务')">
          <strong>待办任务</strong>
          <span>任务完成闭环</span>
        </button>
      </div>

      ${isSendMode?`
      <section class="template-form-section template-selector-section">
        <div class="template-section-title"><span>选择消息模板</span><em>选择模板后自动带出下方配置，支持继续修改后发送</em></div>
        <div class="template-grid four-col">
          <label class="template-field span-4">选择消息模板
            <select class="select" id="msgTplSendTemplateSelect" onchange="syncMessageTemplateSendTemplate()">
              ${renderMessageCreateTemplateOptions("消息通知",defaultSendTemplate?.id || "")}
            </select>
          </label>
        </div>
      </section>`:""}

      <section class="template-form-section">
        <div class="template-section-title"><span>基础信息</span><em>${isSendMode?"模板内容已带出，可继续修改后发送":isManualMode?"填写消息标题、业务分类和消息正文":"配置模板标题、业务分类和消息正文"}</em></div>
        <div class="template-grid four-col template-basic-grid">
          <label class="template-field span-3">消息标题
            <input class="input" id="msgTplTitleInput" maxlength="100" value="${escapeMessageFormValue(defaultSendTemplate?.title || (isManualMode?"":"每日安全监督填报提醒"))}" placeholder="请输入消息标题" oninput="updateTemplateTitleCount()"/>
            <span class="template-count" id="msgTplTitleCount">10/100</span>
          </label>
          <label class="template-field">业务分类
            <select class="select" id="msgTplBizTree">
              ${messageBizDictionary.map(group=>`<optgroup label="${group.name}">${group.children.map(child=>`<option value="${group.name} / ${child}">${child}</option>`).join("")}</optgroup>`).join("")}
            </select>
          </label>
          <label class="template-field span-4 rich-field">消息内容
            <div class="message-rich-editor template-rich-editor">
              <div class="message-rich-toolbar">
                <button type="button" onclick="document.execCommand('bold')"><b>B</b></button>
                <button type="button" onclick="document.execCommand('italic')"><i>I</i></button>
                <button type="button" onclick="document.execCommand('underline')"><u>U</u></button>
                <div class="template-param-insert">
                  <button class="template-param-btn" type="button" onclick="toggleTemplateParamMenu(event)"><span>＋</span>插入参数</button>
                  <div class="template-param-menu" id="msgTplParamMenu">
                    ${renderTemplateParamMenu()}
                  </div>
                </div>
              </div>
              <div id="msgTplRichContent" class="message-rich-content template-rich-content" contenteditable="true" onmouseup="saveTemplateEditorRange()" onkeyup="saveTemplateEditorRange()" onfocus="saveTemplateEditorRange()" oninput="saveTemplateEditorRange()">${escapeMessageFormValue(defaultSendTemplate?.content || (isManualMode?"":"今日共{项目数量}个项目需进行安全每日监督，剩余{未完成项目数}个项目未填报，请关注。"))}</div>
            </div>
          </label>
        </div>
      </section>

      <section class="template-form-section">
        <div class="template-section-title"><span>发送控制</span><em>配置发送通道，以及由接口触发或按周期自动发送</em></div>
        <div class="template-grid four-col template-send-control-grid">
          <label class="template-field">发送通道
            <select class="select" id="msgTplChannel"><option>站内信</option></select>
          </label>
          <label class="template-field">触发规则
            <select class="select" id="msgTplTriggerRule" onchange="syncTemplateTriggerRule()">
              <option value="api" selected>业务接口</option>
              <option value="timer">定时任务</option>
            </select>
          </label>
          <label class="template-field" id="msgTplApiField">选择接口
            <select class="select" id="msgTplApiSelect">
              ${renderTemplateInterfaceOptions()}
            </select>
          </label>
          <label class="template-field" id="msgTplCycleField" style="display:none">触发周期
            <select class="select" id="msgTplTriggerCycle" onchange="syncTemplateTriggerCycle()">
              <option value="day" selected>按天</option>
              <option value="week">按周</option>
              <option value="month">按月</option>
            </select>
          </label>
          <label class="template-field" id="msgTplDailyTimeField" style="display:none">触发时间
            <input class="input" type="time" id="msgTplDailyTime" value="17:00"/>
          </label>
          <label class="template-field trigger-time-field" id="msgTplWeeklyTimeField" style="display:none">触发时间
            <div class="trigger-time-combo">
              <select class="select" id="msgTplWeekDay">
                <option value="1">周一</option><option value="2">周二</option><option value="3">周三</option><option value="4">周四</option><option value="5">周五</option><option value="6">周六</option><option value="7">周日</option>
              </select>
              <input class="input" type="time" id="msgTplWeeklyTime" value="17:00"/>
            </div>
          </label>
          <label class="template-field trigger-time-field" id="msgTplMonthlyTimeField" style="display:none">触发时间
            <div class="trigger-time-combo">
              <select class="select" id="msgTplMonthDay">${renderMonthDayOptions()}</select>
              <input class="input" type="time" id="msgTplMonthlyTime" value="17:00"/>
            </div>
          </label>
        </div>
      </section>

      <section class="template-form-section">
        <div class="template-section-title"><span>接收路由</span><em>配置消息接收范围、跳转动作和弹框展示形式</em></div>
        <div class="template-grid four-col">
          
<label class="template-field receiver-level-field inline-field">接收层级
  <select class="select" id="msgTplReceiverLevel" onchange="syncReceiverLevel()">
    <option value="enterprise">企业端</option>
    <option value="project">项目端</option>
  </select>
</label>
<label class="template-field">接收人员类型
            <select class="select" id="msgTplTargetType" onchange="syncTemplateTargetSelector()">
              <option value="all">全部人</option>
              <option value="post" selected>岗位</option>
              <option value="org">组织</option>
              <option value="person">指定人</option>
              <option value="dynamic">动态参数</option>
            </select>
          </label>
          <div class="template-field span-1" id="msgTplTargetPicker">${renderTemplateTargetPicker("post")}</div>

          <label class="template-field route-row-2-start">是否跳转
            <div class="message-switch-control template-switch-row no-box"><label class="message-mini-switch"><input id="msgTplJumpSwitch" type="checkbox" onchange="toggleTemplateJumpConfig()"><i></i></label><span id="msgTplJumpSwitchText">关闭</span></div>
          </label>
          <label class="template-field route-row-2-rest" id="msgTplJumpLinkWrap" style="display:none">跳转链接
            ${renderTemplateJumpTreeSelect()}
          </label>

          <label class="template-field route-row-3-start">是否弹框
            <div class="message-switch-control template-switch-row no-box"><label class="message-mini-switch"><input id="msgTplPopupSwitch" type="checkbox" checked onchange="toggleTemplatePopupConfig()"><i></i></label><span id="msgTplPopupSwitchText">开启</span></div>
          </label>
          <label class="template-field route-row-3-rest" id="msgTplPopupStyleWrap">弹框样式
            <select class="select locked-select" id="msgTplPopupStyle" disabled><option>普通样式</option><option>预警样式</option><option>待办样式</option></select>
          </label>
        </div>
      </section>
    
<section class="template-form-section advanced-control-section" id="msgTplAdvancedControl" style="display:none">
        <div class="template-section-title"><span>高级控制</span><em>待办任务专属时效与超期规则</em></div>
        <div class="template-grid four-col">

          <label class="template-field todo-advanced-row1">是否控制时效
            <div class="message-switch-control no-box">
              <label class="message-mini-switch">
                <input type="checkbox" id="msgTplTimeControl" onchange="syncTodoAdvancedControl()">
                <i></i>
              </label>
              <span id="msgTplTimeControlText">关闭</span>
            </div>
          </label>

          <label class="template-field todo-advanced-row1 todo-time-field" id="msgTplTimeValueField" style="display:none">任务时效
            <div class="trigger-time-combo todo-time-combo">
              <input class="input todo-time-number" id="msgTplTimeValue" type="number" min="1" placeholder="请输入正整数" oninput="validateTaskTimeInput()"/>
              <select class="select todo-time-unit" id="msgTplTimeUnit">
                <option value="day">天</option>
                <option value="hour">时</option>
                <option value="minute">分</option>
              </select>
            </div>
          </label>

          <label class="template-field todo-advanced-row2" id="msgTplOverdueNotifyField" style="display:none;grid-row:2;grid-column:1">超期是否通知
            <div class="message-switch-control no-box">
              <label class="message-mini-switch">
                <input type="checkbox" id="msgTplOverdueNotify" onchange="syncTodoAdvancedControl()">
                <i></i>
              </label>
              <span id="msgTplOverdueNotifyText">关闭</span>
            </div>
          </label>

          <label class="template-field todo-advanced-row2" id="msgTplOverdueReceiverLevelField" style="display:none;grid-row:2;grid-column:2">接收层级
            <select class="select" id="msgTplOverdueReceiverLevel" onchange="syncTodoOverdueReceiverLevel()">
              <option value="enterprise">企业端</option>
              <option value="project">项目端</option>
            </select>
          </label>

          <label class="template-field todo-advanced-row2" id="msgTplOverdueTargetTypeField" style="display:none;grid-row:2;grid-column:3">接收人员类型
            <select class="select" id="msgTplOverdueTargetType" onchange="syncTodoOverdueTargetSelector()">
              <option value="all">全部人</option>
              <option value="post">岗位</option>
              <option value="org">组织</option>
              <option value="person">指定人</option>
              <option value="dynamic">动态参数</option>
            </select>
          </label>

          <div class="template-field todo-advanced-row2 todo-overdue-target-picker" id="msgTplOverdueTargetPicker" style="display:none;grid-row:2;grid-column:4">
            ${renderTemplateTargetPicker("post").replaceAll("msgTplTargetValue","msgTplOverdueTargetValue")}
          </div>

        </div>
      </section>
    </div>
  `,isCreateMode?`<button class="btn" onclick="closeModal()">取消</button><button class="btn" onclick="showToast('预览：PC和移动端消息样式已生成')">预览</button><button class="btn primary" onclick="saveMessageTemplateSendForm()">保存</button>`:`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="closeModal();showToast('模板已保存')">保存模板</button>`,"large");
  updateTemplateTitleCount();
  modalBox.classList.add("message-template-modal");
  syncTemplateTriggerRule();
  selectMessageTemplateType("消息通知");
  if(isSendMode)syncMessageTemplateSendTemplate();
  setTimeout(()=>{refreshTemplateTreeStates("msgTplTargetValue");updateTemplateCheckTreeValue("msgTplTargetValue");},0);
}
function normalizeTplTreeNode(node){
  const label=node.label ?? node.name ?? node.value ?? "";
  const value=node.value ?? label;
  const children=(node.children||[]).map(normalizeTplTreeNode);
  return {label,value,children};
}
function escapeTplAttr(value){
  return String(value ?? "").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function renderTplTreeNodes(nodes,id,selected=[],level=1,mode="checkable"){
  const selectedSet=new Set((selected||[]).map(x=>String(x)));
  return (nodes||[]).map(raw=>{
    const node=normalizeTplTreeNode(raw);
    const hasChildren=!!(node.children && node.children.length);
    const checked=selectedSet.has(String(node.value)) || selectedSet.has(String(node.label));
    const safeLabel=escapeTplAttr(node.label);
    const safeValue=escapeTplAttr(node.value);
    if(mode==="single"){
      return `<div class="tpl-tree-item ${hasChildren?'has-children':''}" data-level="${level}" data-value="${safeValue}" data-label="${safeLabel}">
        <div class="tpl-tree-node ${hasChildren?'parent':'leaf single'}" style="--level:${level}" onclick="event.stopPropagation();${hasChildren?'toggleTplTreeBranch(this)':'selectTemplateSingleTreeValue(\'msgTplJumpTree\',\''+safeValue+'\')'}">
          <span class="tpl-tree-arrow">${hasChildren?'▾':''}</span><span class="tpl-tree-label">${node.label}</span>
        </div>
        ${hasChildren?`<div class="tpl-tree-children">${renderTplTreeNodes(node.children,id,selected,level+1,'single')}</div>`:''}
      </div>`;
    }
    return `<div class="tpl-tree-item ${hasChildren?'has-children':''}" data-level="${level}" data-value="${safeValue}" data-label="${safeLabel}">
      <div class="tpl-tree-node ${hasChildren?'parent':'leaf'}" style="--level:${level}" onclick="event.stopPropagation();${hasChildren?'toggleTplTreeBranch(this)':''}">
        <span class="tpl-tree-arrow">${hasChildren?'▾':''}</span>
        <input type="checkbox" value="${safeValue}" data-label="${safeLabel}" ${checked?'checked':''} onclick="event.stopPropagation()" onchange="handleTemplateTreeCheck('${id}',this)"/>
        <span class="tpl-tree-label">${node.label}</span>
      </div>
      ${hasChildren?`<div class="tpl-tree-children">${renderTplTreeNodes(node.children,id,selected,level+1,'checkable')}</div>`:''}
    </div>`;
  }).join("");
}
function renderTemplateCheckTreeSelect(id,tree,placeholder,selected=[]){
  const selectedText=selected.length?selected.join("、"):placeholder;
  const rows=renderTplTreeNodes(tree,id,selected,1,"checkable");
  return `<div class="template-tree-select checkable el-like-tree-select" id="${id}" data-placeholder="${placeholder}">
    <div class="tpl-tree-control" onclick="toggleTemplateTreeDropdown('${id}')"><span class="tpl-tree-value">${selectedText}</span><i>⌄</i></div>
    <div class="tpl-tree-dropdown" onclick="event.stopPropagation()"><div class="tpl-tree-search-row"><span>请选择</span></div>${rows}</div>
  </div>`;
}

function renderTemplateBizFilterTreeSelect(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgTplBizTreeFilter",tree,"请选择业务分类",messageAdminState.templateBizList||[]);
}

function renderTemplateJumpTreeSelect(){
  const tree=[
    {label:"工作台",children:[{label:"工作台首页",value:"工作台"}]},
    {label:"劳务管理",children:[{label:"花名册",value:"劳务管理 / 花名册"},{label:"抽查管理",value:"劳务管理 / 抽查管理"}]},
    {label:"安全管理",children:[{label:"隐患整改",value:"安全管理 / 隐患整改"},{label:"违章管理",value:"安全管理 / 违章管理"}]},
    {label:"设备管理",children:[{label:"视频中心",value:"设备管理 / 视频中心"},{label:"塔机管理",value:"设备管理 / 塔机管理"}]},
    {label:"消息中心",children:[{label:"消息记录",value:"消息中心 / 消息记录"}]}
  ];
  const rows=renderTplTreeNodes(tree,"msgTplJumpTree",[],1,"single");
  return `<div class="template-tree-select single el-like-tree-select" id="msgTplJumpTree" data-placeholder="请选择跳转页面">
    <div class="tpl-tree-control" onclick="toggleTemplateTreeDropdown('msgTplJumpTree')"><span class="tpl-tree-value">请选择跳转页面</span><i>⌄</i></div>
    <div class="tpl-tree-dropdown" onclick="event.stopPropagation()"><div class="tpl-tree-search-row"><span>请选择跳转页面</span></div>${rows}</div>
  </div>`;
}

function toggleTemplateTreeDropdown(id){
  const current=document.getElementById(id);
  if(!current)return;
  document.querySelectorAll(".template-tree-select.open").forEach(el=>{
    if(el!==current){
      el.classList.remove("open");
      resetTemplateDropdownPosition(el);
    }
  });
  current.classList.toggle("open");
  if(current.classList.contains("open") && current.classList.contains("checkable")) refreshTemplateTreeStates(id);
  if(current.classList.contains("open"))positionTemplateDropdown(current);
  else resetTemplateDropdownPosition(current);
  syncModalDropdownLayer();
}

function positionTemplateDropdown(box){
  const control=box?.querySelector(".tpl-tree-control");
  const dropdown=box?.querySelector(".tpl-tree-dropdown");
  if(!control || !dropdown)return;
  const rect=control.getBoundingClientRect();
  const viewportHeight=window.innerHeight || document.documentElement.clientHeight || 800;
  const dropdownHeight=300;
  const gap=4;
  const belowTop=rect.bottom + gap;
  const aboveTop=rect.top - dropdownHeight - gap;
  const top=(belowTop + dropdownHeight <= viewportHeight - 12 || aboveTop < 12)?belowTop:aboveTop;
  dropdown.style.position="fixed";
  dropdown.style.left=Math.max(12,rect.left)+"px";
  dropdown.style.top=Math.max(12,top)+"px";
  dropdown.style.width=Math.max(rect.width,260)+"px";
  dropdown.style.height=dropdownHeight+"px";
  dropdown.style.maxHeight=dropdownHeight+"px";
  dropdown.style.zIndex="200001";
}

function resetTemplateDropdownPosition(box){
  const dropdown=box?.querySelector?.(".tpl-tree-dropdown");
  if(!dropdown)return;
  ["position","left","top","width","height","maxHeight","zIndex"].forEach(prop=>dropdown.style[prop]="");
}
function toggleTplTreeBranch(node){
  const item=node.closest(".tpl-tree-item");
  if(item)item.classList.toggle("collapsed");
}
function handleTemplateTreeCheck(id,cb){
  const item=cb.closest(".tpl-tree-item");
  if(item && item.classList.contains("has-children")){
    item.querySelectorAll(':scope > .tpl-tree-children input[type="checkbox"]').forEach(x=>{
      x.checked=cb.checked;
      x.indeterminate=false;
    });
  }
  refreshTemplateTreeStates(id);
  updateTemplateCheckTreeValue(id);
}
function refreshTemplateTreeStates(id){
  const box=document.getElementById(id);
  if(!box)return;
  const parents=[...box.querySelectorAll('.tpl-tree-item.has-children')].reverse();
  parents.forEach(parentItem=>{
    const parentCb=parentItem.querySelector(':scope > .tpl-tree-node input[type="checkbox"]');
    const childCbs=[...parentItem.querySelectorAll(':scope > .tpl-tree-children > .tpl-tree-item > .tpl-tree-node input[type="checkbox"]')];
    if(!parentCb || !childCbs.length)return;
    const allChecked=childCbs.every(x=>x.checked && !x.indeterminate);
    const anyChecked=childCbs.some(x=>x.checked || x.indeterminate);
    parentCb.checked=allChecked;
    parentCb.indeterminate=anyChecked && !allChecked;
  });
}
function getTemplateTreeCheckedLeaves(box){
  return [...box.querySelectorAll('.tpl-tree-item:not(.has-children) > .tpl-tree-node input[type="checkbox"]:checked')];
}
function updateTemplateCheckTreeValue(id){
  const box=document.getElementById(id);
  if(!box)return;
  const checkedLeaves=getTemplateTreeCheckedLeaves(box);
  const labels=checkedLeaves.map(x=>x.dataset.label || x.value);
  const value=box.querySelector(".tpl-tree-value");
  if(value){
    value.textContent=labels.length?labels.join("、"):(box.dataset.placeholder||"请选择");
    value.title=labels.join("、");
  }
}
function selectTemplateSingleTreeValue(id,value){
  const box=document.getElementById(id);
  if(!box)return;
  const label=box.querySelector(".tpl-tree-value");
  if(label)label.textContent=value;
  box.classList.remove("open");
  resetTemplateDropdownPosition(box);
  syncModalDropdownLayer();
}

function syncModalDropdownLayer(){
  const box=document.getElementById("modalBox");
  if(!box)return;
  const hasOpen=!!box.querySelector(".template-tree-select.open,.template-param-menu.open,.hazard-cascader.single.open");
  box.classList.toggle("modal-dropdown-open",hasOpen);
}

document.addEventListener("click",function(e){
  if(!e.target.closest?.(".template-param-insert"))document.getElementById("msgTplParamMenu")?.classList.remove("open");
  if(!e.target.closest?.(".template-tree-select"))document.querySelectorAll(".template-tree-select.open").forEach(x=>{x.classList.remove("open");resetTemplateDropdownPosition(x);});
  syncModalDropdownLayer();
});

function syncTemplateTargetSelector(){
  const type=document.getElementById("msgTplTargetType")?.value || "all";
  const box=document.getElementById("msgTplTargetPicker");
  if(!box)return;
  if(type==="all"){
    box.style.display="none";
    box.innerHTML="";
  }else{
    box.style.display="flex";
    box.innerHTML=renderTemplateTargetPicker(type);
  }
}

function syncTemplateBizLevel2(){
  const l1=document.getElementById("msgTplBizLevel1")?.value || messageBizDictionary[0].name;
  const cfg=messageBizDictionary.find(x=>x.name===l1) || messageBizDictionary[0];
  const l2=document.getElementById("msgTplBizLevel2");
  if(l2)l2.innerHTML=cfg.children.map(x=>`<option>${x}</option>`).join("");
}

const templateParamOptions=["{项目名称}","{人员姓名}","{整改编号}","{整改截止时间}","{项目数量}","{未完成项目数}","{分包单位}","{隐患类型}","{整改责任人}","{核验人}"];
let templateEditorRange=null;
function renderTemplateParamMenu(){
  return templateParamOptions.map(x=>`<button type="button" onclick="insertTemplateParamFromMenu('${x}')">${x}</button>`).join("");
}
function saveTemplateEditorRange(){
  const editor=document.getElementById("msgTplRichContent");
  const sel=window.getSelection?.();
  if(!editor || !sel || !sel.rangeCount)return;
  const range=sel.getRangeAt(0);
  if(editor.contains(range.commonAncestorContainer))templateEditorRange=range.cloneRange();
}
function restoreTemplateEditorRange(){
  const editor=document.getElementById("msgTplRichContent");
  const sel=window.getSelection?.();
  if(!editor || !sel)return false;
  editor.focus();
  sel.removeAllRanges();
  if(templateEditorRange){sel.addRange(templateEditorRange);return true;}
  const range=document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  sel.addRange(range);
  return true;
}
function toggleTemplateParamMenu(event){
  event?.stopPropagation?.();
  saveTemplateEditorRange();
  const menu=document.getElementById("msgTplParamMenu");
  if(menu)menu.classList.toggle("open");
  syncModalDropdownLayer();
}
function insertTemplateParamFromMenu(param){
  insertTemplateParam(param);
  const menu=document.getElementById("msgTplParamMenu");
  if(menu)menu.classList.remove("open");
  syncModalDropdownLayer();
}
function insertTemplateParam(param){
  const editor=document.getElementById("msgTplRichContent");
  if(!editor)return;
  restoreTemplateEditorRange();
  const sel=window.getSelection?.();
  if(sel && sel.rangeCount){
    const range=sel.getRangeAt(0);
    range.deleteContents();
    const node=document.createTextNode(param);
    range.insertNode(node);
    range.setStartAfter(node);
    range.setEndAfter(node);
    sel.removeAllRanges();
    sel.addRange(range);
    templateEditorRange=range.cloneRange();
  }else{
    editor.textContent=(editor.textContent||"")+param;
  }
  editor.focus();
}

function toggleTemplateJumpConfig(){
  const enabled=document.getElementById("msgTplJumpSwitch")?.checked;
  const wrap=document.getElementById("msgTplJumpLinkWrap");
  const text=document.getElementById("msgTplJumpSwitchText");
  if(wrap)wrap.style.display=enabled?"flex":"none";
  if(text)text.textContent=enabled?"开启":"关闭";
}

function toggleTemplatePopupConfig(){
  const enabled=document.getElementById("msgTplPopupSwitch")?.checked;
  const wrap=document.getElementById("msgTplPopupStyleWrap");
  const text=document.getElementById("msgTplPopupSwitchText");
  if(wrap)wrap.style.display=enabled?"flex":"none";
  if(text)text.textContent=enabled?"开启":"关闭";
}

function updateTemplateTitleCount(){
  const input=document.getElementById("msgTplTitleInput");
  const count=document.getElementById("msgTplTitleCount");
  if(input&&count)count.textContent=`${input.value.length}/100`;
}

const messageCreateTypeOptions=[
  {value:"消息通知",label:"消息通知"},
  {value:"通知公告",label:"通知公告"},
  {value:"待办任务",label:"代办任务"},
  {value:"预警通知",label:"预警通知"}
];

function escapeMessageFormValue(value){
  return String(value ?? "").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function renderMessageCreateTypeOptions(selected){
  return messageCreateTypeOptions.map(x=>`<option value="${x.value}" ${selected===x.value?"selected":""}>${x.label}</option>`).join("");
}

function getEnabledTemplatesByType(type){
  return messageTemplateData.filter(x=>x.type===type && x.type!=="通知公告" && x.status==="启用");
}

function getDefaultTemplateByType(type){
  return getEnabledTemplatesByType(type)[0] || null;
}

function renderMessageCreateTemplateOptions(type,selectedId){
  const list=getEnabledTemplatesByType(type);
  if(!list.length)return `<option value="">暂无该类型可用模板</option>`;
  return list.map(x=>`<option value="${x.id}" ${selectedId===x.id?"selected":""}>${x.title}</option>`).join("");
}

function getMessageCreatePopupStyle(type){
  if(type==="预警通知")return "预警样式";
  if(type==="待办任务" || type==="代办任务")return "待办样式";
  return "普通样式";
}

function renderMessageCreateForm(mode,template){
  const isTemplate=mode==="template";
  const type=template?.type || "消息通知";
  return `
    <input type="hidden" id="msgCreateMode" value="${mode}"/>
    <div class="message-admin-form message-create-form">
      <label>消息类型
        <select class="select" id="msgCreateType" onchange="syncMessageCreateType()">
          ${renderMessageCreateTypeOptions(type)}
        </select>
      </label>
      <label>发送方式
        <select class="select" id="msgCreateSendMode">
          <option>立即发送</option>
          <option>定时发送</option>
        </select>
      </label>
      ${isTemplate?`
        <label class="wide" id="msgCreateTemplateWrap">选择消息模板
          <select class="select" id="msgCreateTemplate" onchange="syncMessageCreateTemplate()">
            ${renderMessageCreateTemplateOptions(type,template?.id)}
          </select>
        </label>
      `:""}
      <label>业务分类
        <input class="input" id="msgCreateBiz" value="${escapeMessageFormValue(template?.biz || "安全>安全每日监督")}"/>
      </label>
      <label>发送通道
        <select class="select" id="msgCreateChannel">
          <option ${template?.channel==="站内信"?"selected":""}>站内信</option>
        </select>
      </label>
      <label>接收范围
        <select class="select" id="msgCreateTargetType">
          <option ${template?.targetType==="指定岗位"?"selected":""}>指定岗位</option>
          <option ${template?.targetType==="指定人"?"selected":""}>指定人</option>
          <option ${template?.targetType==="指定组织"?"selected":""}>指定组织</option>
          <option ${template?.targetType==="动态参数"?"selected":""}>动态参数</option>
          <option ${template?.targetType==="所有人"?"selected":""}>所有人</option>
        </select>
      </label>
      <label>接收目标
        <input class="input" id="msgCreateTargetValue" value="${escapeMessageFormValue(template?.targetValue || "项目经理，安全员")}"/>
      </label>
      <label class="wide">消息标题
        <input class="input" id="msgCreateTitle" value="${escapeMessageFormValue(template?.title || "每日安全监督填报提醒")}"/>
      </label>
      <label class="wide">消息内容
        <textarea class="input message-admin-textarea" id="msgCreateContent">${escapeMessageFormValue(template?.content || "今日共247个项目需进行安全每日监督，剩余66个项目未填报，请关注")}</textarea>
      </label>
      <label>是否跳转
        <select class="select" id="msgCreateJumpSwitch" onchange="toggleMessageCreateJump()">
          <option value="关闭" ${template?.jumpLink?"":"selected"}>关闭</option>
          <option value="开启" ${template?.jumpLink?"selected":""}>开启</option>
        </select>
      </label>
      <label id="msgCreateJumpLinkWrap" style="${template?.jumpLink?"":"display:none"}">跳转链接
        <input class="input" id="msgCreateJumpLink" value="${escapeMessageFormValue(template?.jumpLink || "")}" placeholder="请输入菜单/页面路由"/>
      </label>
      <label>是否弹框
        <select class="select" id="msgCreatePopup" onchange="toggleMessageCreatePopup()">
          <option ${template?.popup==="关闭"?"selected":""}>关闭</option>
          <option ${template?.popup==="开启"?"selected":""}>开启</option>
        </select>
      </label>
      <label id="msgCreatePopupStyleWrap" style="${template?.popup==="开启"?"":"display:none"}">弹框样式
        <select class="select locked-select" id="msgCreatePopupStyle" disabled>
          <option ${getMessageCreatePopupStyle(type)==="普通样式"?"selected":""}>普通样式</option>
          <option ${getMessageCreatePopupStyle(type)==="预警样式"?"selected":""}>预警样式</option>
          <option ${getMessageCreatePopupStyle(type)==="待办样式"?"selected":""}>待办样式</option>
        </select>
      </label>
    </div>
  `;
}

function openMessageTemplateSend(){
  openMessageTemplateForm("send");
}

function openMessageManualSend(){
  openMessageTemplateForm("manual");
}

function syncMessageCreatePopupStyle(){
  const type=document.getElementById("msgCreateType")?.value || "消息通知";
  const style=document.getElementById("msgCreatePopupStyle");
  if(style){
    style.value=getMessageCreatePopupStyle(type);
    style.disabled=true;
  }
}

function toggleMessageCreateJump(){
  const enabled=document.getElementById("msgCreateJumpSwitch")?.value==="开启";
  const wrap=document.getElementById("msgCreateJumpLinkWrap");
  if(wrap)wrap.style.display=enabled?"flex":"none";
}

function toggleMessageCreatePopup(){
  const enabled=document.getElementById("msgCreatePopup")?.value==="开启";
  const wrap=document.getElementById("msgCreatePopupStyleWrap");
  if(wrap)wrap.style.display=enabled?"flex":"none";
  syncMessageCreatePopupStyle();
}

function syncMessageCreateType(){
  const mode=document.getElementById("msgCreateMode")?.value || "manual";
  const type=document.getElementById("msgCreateType")?.value || "消息通知";
  syncMessageCreatePopupStyle();
  if(mode!=="template")return;
  const select=document.getElementById("msgCreateTemplate");
  if(!select)return;
  const next=getDefaultTemplateByType(type);
  select.innerHTML=renderMessageCreateTemplateOptions(type,next?.id || "");
  if(next)applyMessageCreateTemplate(next);
  else clearMessageCreateTemplateFields(type);
}

function syncMessageCreateTemplate(){
  const id=document.getElementById("msgCreateTemplate")?.value;
  applyMessageCreateTemplate(getMessageTemplateById(id));
}

function applyMessageCreateTemplate(template){
  if(!template)return;
  const fields={
    msgCreateBiz:template.biz,
    msgCreateChannel:template.channel,
    msgCreateTargetType:template.targetType,
    msgCreateTargetValue:template.targetValue,
    msgCreateTitle:template.title,
    msgCreateContent:template.content,
    msgCreateJumpSwitch:template.jumpLink?"开启":"关闭",
    msgCreateJumpLink:template.jumpLink || "",
    msgCreatePopup:template.popup || "关闭"
  };
  Object.entries(fields).forEach(([id,value])=>{
    const el=document.getElementById(id);
    if(el)el.value=value;
  });
  toggleMessageCreateJump();
  toggleMessageCreatePopup();
}

function normalizeTemplateBizValue(biz){
  return String(biz || "").replace(/>/g," / ");
}

function getTemplateTargetTypeValue(targetType){
  const map={
    "所有人":"all",
    "全部人":"all",
    "指定岗位":"post",
    "岗位":"post",
    "指定组织":"org",
    "组织":"org",
    "指定人":"person",
    "人员":"person",
    "动态参数":"dynamic"
  };
  return map[targetType] || "post";
}

function getTemplateTargetTypeLabel(type){
  const map={all:"所有人",post:"指定岗位",org:"指定组织",person:"指定人",dynamic:"动态参数"};
  return map[type] || type || "--";
}

function syncMessageTemplateSendTypeTemplates(){
  const type=document.getElementById("msgTplFormType")?.value || "消息通知";
  const select=document.getElementById("msgTplSendTemplateSelect");
  if(!select)return;
  const next=getDefaultTemplateByType(type);
  select.innerHTML=renderMessageCreateTemplateOptions(type,next?.id || "");
  if(next)applyMessageTemplateToSendForm(next);
  else clearMessageTemplateSendForm(type);
}

function syncMessageTemplateSendTemplate(){
  const id=document.getElementById("msgTplSendTemplateSelect")?.value;
  const template=getMessageTemplateById(id);
  if(template)applyMessageTemplateToSendForm(template);
}

function applyMessageTemplateToSendForm(template){
  if(!template)return;
  const typeInput=document.getElementById("msgTplFormType");
  if(typeInput)typeInput.value=template.type;
  document.querySelectorAll(".message-type-card").forEach(card=>card.classList.toggle("active",card.dataset.type===template.type));

  const title=document.getElementById("msgTplTitleInput");
  if(title)title.value=template.title || "";
  const content=document.getElementById("msgTplRichContent");
  if(content)content.textContent=template.content || "";
  const biz=document.getElementById("msgTplBizTree");
  if(biz)biz.value=normalizeTemplateBizValue(template.biz);
  const channel=document.getElementById("msgTplChannel");
  if(channel)channel.value=template.channel || "站内信";

  const targetType=getTemplateTargetTypeValue(template.targetType);
  const targetTypeEl=document.getElementById("msgTplTargetType");
  if(targetTypeEl)targetTypeEl.value=targetType;
  if(typeof syncTemplateTargetSelector==="function")syncTemplateTargetSelector();

  const jump=document.getElementById("msgTplJumpSwitch");
  if(jump)jump.checked=!!template.jumpLink;
  const jumpLink=document.querySelector("#msgTplJumpLinkWrap .tpl-tree-value");
  if(jumpLink)jumpLink.textContent=template.jumpLink || "请选择";
  if(typeof toggleTemplateJumpConfig==="function")toggleTemplateJumpConfig();

  const popup=document.getElementById("msgTplPopupSwitch");
  if(popup)popup.checked=template.popup==="开启";
  if(typeof toggleTemplatePopupConfig==="function")toggleTemplatePopupConfig();
  if(typeof syncTemplatePopupStyleLock==="function")syncTemplatePopupStyleLock();
  if(typeof updateTemplateTitleCount==="function")updateTemplateTitleCount();
}

function clearMessageTemplateSendForm(type){
  const title=document.getElementById("msgTplTitleInput");
  if(title)title.value="";
  const content=document.getElementById("msgTplRichContent");
  if(content)content.textContent="";
  const biz=document.getElementById("msgTplBizTree");
  if(biz)biz.value="";
  const targetTypeEl=document.getElementById("msgTplTargetType");
  if(targetTypeEl)targetTypeEl.value="post";
  if(typeof syncTemplateTargetSelector==="function")syncTemplateTargetSelector();
  const jump=document.getElementById("msgTplJumpSwitch");
  if(jump)jump.checked=false;
  if(typeof toggleTemplateJumpConfig==="function")toggleTemplateJumpConfig();
  const popup=document.getElementById("msgTplPopupSwitch");
  if(popup)popup.checked=type==="预警通知";
  if(typeof toggleTemplatePopupConfig==="function")toggleTemplatePopupConfig();
  if(typeof syncTemplatePopupStyleLock==="function")syncTemplatePopupStyleLock();
  if(typeof updateTemplateTitleCount==="function")updateTemplateTitleCount();
}

function getTemplateTargetValueForSend(){
  const type=document.getElementById("msgTplTargetType")?.value || "post";
  if(type==="all")return "所有人";
  try{
    const checked=getTemplateTreeCheckedLeaves(document.getElementById("msgTplTargetValue"));
    const values=checked.map(x=>x.dataset.label || x.value).filter(Boolean);
    if(values.length)return values.join("，");
  }catch(e){}
  const tpl=getMessageTemplateById(document.getElementById("msgTplSendTemplateSelect")?.value);
  return tpl?.targetValue || "";
}

function saveMessageTemplateSendForm(){
  const type=document.getElementById("msgTplFormType")?.value || "消息通知";
  const targetType=document.getElementById("msgTplTargetType")?.value || "post";
  const tplId=document.getElementById("msgTplSendTemplateSelect")?.value || "";
  const tpl=getMessageTemplateById(tplId);
  const jumpEnabled=!!document.getElementById("msgTplJumpSwitch")?.checked;
  const popupEnabled=!!document.getElementById("msgTplPopupSwitch")?.checked;
  const id=`send-${Date.now()}`;
  const batchNo=`MS${new Date().toISOString().slice(0,10).replace(/-/g,"")}${String(messageSendRecordData.length+1).padStart(4,"0")}`;
  messageSendRecordData.unshift({
    id,
    batchNo,
    source:"手动发布",
    templateId:tplId,
    type,
    biz:document.getElementById("msgTplBizTree")?.value || tpl?.biz || "",
    title:document.getElementById("msgTplTitleInput")?.value || "",
    content:document.getElementById("msgTplRichContent")?.textContent || "",
    channel:document.getElementById("msgTplChannel")?.value || "站内信",
    targetType:getTemplateTargetTypeLabel(targetType),
    targetValue:getTemplateTargetValueForSend(),
    jumpLink:jumpEnabled ? (tpl?.jumpLink || "") : "",
    popup:popupEnabled?"开启":"关闭",
    popupStyle:document.getElementById("msgTplPopupStyle")?.value || getMessageCreatePopupStyle(type),
    shouldCount:0,
    sentCount:0,
    readCount:0,
    clickCount:0,
    failCount:0,
    status:"待发送",
    sendTime:""
  });
  closeModal();
  renderMessageSendRecordPage();
  showToast("消息已创建，待发送");
}

function clearMessageCreateTemplateFields(type){
  const defaults={
    msgCreateBiz:"",
    msgCreateTargetType:"指定岗位",
    msgCreateTargetValue:"",
    msgCreateTitle:"",
    msgCreateContent:"",
    msgCreateJumpSwitch:"关闭",
    msgCreateJumpLink:"",
    msgCreatePopup:type==="预警通知"?"开启":"关闭"
  };
  Object.entries(defaults).forEach(([id,value])=>{
    const el=document.getElementById(id);
    if(el)el.value=value;
  });
  toggleMessageCreateJump();
  toggleMessageCreatePopup();
}

function saveMessageCreateForm(){
  const type=document.getElementById("msgCreateType")?.value || "消息通知";
  const id=`send-${Date.now()}`;
  const batchNo=`MS${new Date().toISOString().slice(0,10).replace(/-/g,"")}${String(messageSendRecordData.length+1).padStart(4,"0")}`;
  messageSendRecordData.unshift({
    id,
    batchNo,
    source:"手动发布",
    templateId:document.getElementById("msgCreateTemplate")?.value || "",
    type,
    biz:document.getElementById("msgCreateBiz")?.value || "",
    title:document.getElementById("msgCreateTitle")?.value || "",
    content:document.getElementById("msgCreateContent")?.value || "",
    channel:document.getElementById("msgCreateChannel")?.value || "站内信",
    targetType:document.getElementById("msgCreateTargetType")?.value || "",
    targetValue:document.getElementById("msgCreateTargetValue")?.value || "",
    jumpLink:document.getElementById("msgCreateJumpSwitch")?.value==="开启" ? (document.getElementById("msgCreateJumpLink")?.value || "") : "",
    popup:document.getElementById("msgCreatePopup")?.value || "关闭",
    popupStyle:document.getElementById("msgCreatePopupStyle")?.value || getMessageCreatePopupStyle(type),
    shouldCount:0,
    sentCount:0,
    readCount:0,
    clickCount:0,
    failCount:0,
    status:"待发送",
    sendTime:""
  });
  closeModal();
  renderMessageSendRecordPage();
  showToast("消息已创建，待发送");
}

function openMessageTemplateDetail(id){
  const x=getMessageTemplateById(id);
  if(!x)return;
  openModal("消息模板详情",`
    <div class="message-admin-detail">
      ${info("模板编码",x.code)}${info("消息类型",x.type)}${info("业务分类",x.biz)}${info("模板状态",x.status)}
      ${info("消息标题",x.title)}${info("默认发送通道",x.channel)}${info("接收范围",x.targetType)}${info("接收目标",x.targetValue)}
      ${info("是否跳转",x.jumpLink?"开启":"关闭")}${info("跳转链接",x.jumpLink||"无")}${info("是否弹框",x.popup)}${info("调用次数",x.callCount)}${info("更新时间",x.updatedAt)}
      <div class="message-admin-content">${x.content}</div>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="openTemplateSendRecords('${x.id}')">查看发送记录</button>`,"large");
}

function openTemplateSendRecords(templateId){
  const tpl=getMessageTemplateById(templateId);
  messageAdminState.sendKeyword=tpl?.title || "";
  closeModal();
  renderMessageSendRecordPage();
}

function toggleMessageTemplateStatus(id){
  const x=getMessageTemplateById(id);
  if(!x)return;
  x.status=x.status==="启用"?"禁用":"启用";
  renderMessageTemplatePage();
  showToast(`模板已${x.status}`);
}

function openMessageSendDetail(id){
  const x=messageSendRecordData.find(item=>item.id===id);
  if(!x)return;
  const details=messageRecordData.filter(r=>r.batchNo===x.batchNo);
  openModal("发送记录详情",`
    <div class="message-admin-detail">
      ${info("发送批次号",x.batchNo)}${info("发送来源",x.source)}${info("消息类型",x.type)}${info("业务分类",x.biz)}
      ${info("发送状态",x.status)}${info("发送通道",x.channel)}${info("接收范围",x.targetType)}${info("接收目标",x.targetValue)}
      ${info("应发人数",x.shouldCount)}${info("实发人数",x.sentCount)}${info("已读人数",x.readCount)}${info("失败人数",x.failCount)}
      <div class="message-admin-content"><strong>${x.title}</strong>${x.content}</div>
      <div class="message-admin-mini-title">接收人明细预览</div>
      <table><thead><tr><th>接收人</th><th>组织/项目</th><th>送达</th><th>阅读</th></tr></thead><tbody>${details.map(r=>`<tr><td>${r.receiver}</td><td>${r.org} / ${r.project}</td><td>${messageStatusTag(r.deliverStatus)}</td><td>${messageStatusTag(r.readStatus)}</td></tr>`).join("")}</tbody></table>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="openSendReadStats('${x.batchNo}')">查看阅读统计</button>`,"large");
}

function openSendReadStats(batchNo){
  openSendRecordDrilldown(batchNo,"read");
}

function sendPendingMessage(id){
  const x=messageSendRecordData.find(item=>item.id===id);
  if(!x)return;
  x.status="已发送";
  x.sentCount=x.shouldCount;
  x.sendTime="2026-06-11 16:45:00";
  renderMessageSendRecordPage();
  showToast("消息已发送");
}

function retrySendRecord(id){
  const x=messageSendRecordData.find(item=>item.id===id);
  if(!x)return;
  x.sentCount=x.shouldCount;
  x.failCount=0;
  x.status="已发送";
  messageRecordData.filter(r=>r.batchNo===x.batchNo&&r.deliverStatus==="发送失败").forEach(r=>{
    r.deliverStatus="发送成功";
    r.failReason="";
  });
  renderMessageSendRecordPage();
  showToast("失败消息已重发成功");
}

function withdrawSendRecord(id){
  const x=messageSendRecordData.find(item=>item.id===id);
  if(!x)return;
  x.status="已撤回";
  messageRecordData.filter(r=>r.batchNo===x.batchNo).forEach(r=>r.deliverStatus="已撤回");
  messageData=messageData.filter(m=>m.title!==x.title);
  renderMessageSendRecordPage();
  showToast("消息已撤回，接收人消息列表已清除");
}

function openMessageRecordDetail(id){
  const x=messageRecordData.find(item=>item.id===id);
  if(!x)return;
  const send=getSendRecordByBatch(x.batchNo);
  openModal("消息记录详情",`
    <div class="message-admin-detail">
      ${info("消息记录ID",x.id)}${info("发送批次号",x.batchNo)}${info("接收人",x.receiver)}${info("账号",x.account)}
      ${info("组织",x.org)}${info("项目",x.project)}${info("岗位",x.post)}${info("消息类型",x.type)}
      ${info("送达状态",x.deliverStatus)}${info("阅读状态",x.readStatus)}${info("点击状态",x.clickStatus)}${info("失败原因",x.failReason||"--")}
      <div class="message-admin-content"><strong>${x.title}</strong>${x.content}</div>
      <div class="message-admin-mini-title">来源批次：${send?send.source:"--"} / ${send?send.status:"--"}</div>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>${x.deliverStatus==="发送失败"?`<button class="btn primary" onclick="retryMessageRecord('${x.id}')">重发</button>`:""}`,"large");
}

function retryMessageRecord(id){
  const x=messageRecordData.find(item=>item.id===id);
  if(!x)return;
  x.deliverStatus="发送成功";
  x.failReason="";
  const send=getSendRecordByBatch(x.batchNo);
  if(send){
    send.failCount=Math.max(0,send.failCount-1);
    send.sentCount=Math.min(send.shouldCount,send.sentCount+1);
    if(send.failCount===0)send.status="已发送";
  }
  closeModal();
  renderMessageRecordPage();
  showToast("该接收人消息已重发成功");
}
