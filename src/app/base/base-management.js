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
    englishName:item.englishName || "",
    level:Number(item.level),
    parentCode:item.parentCode || ""
  }));
  window.__ORGANIZATION_MASTER_DATA__=organizationMasterData.map(item=>({
    code:item.code,name:item.name,english_name:item.englishName || "",level:String(item.level),parent_code:item.parentCode
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
let organizationManagementOrgKeyword="";
let organizationManagementTreeDepth="branch";
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
  if(!unifiedOrgTreeMatches(node,organizationManagementOrgKeyword))return "";
  const isActive=node.id===currentOrgId;
  const hasChildren=node.children && node.children.length;
  const maxVisibleLevel=organizationManagementTreeDepth==="company"?2:3;
  const showChildren=Boolean(organizationManagementOrgKeyword.trim()) || level<maxVisibleLevel;

  return `
    <div class="org-tree-node org-level-indent-${Math.min(level,5)} ${isActive?"active":""}" onclick="selectOrgNode('${node.id}')">
      <div class="org-node-left">
        <span class="unified-org-level-icon">${getUnifiedOrgTreeIcon(level)}</span>
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

    ${showChildren?(node.children || []).map(child=>renderOrgTreeNodes(child,level+1)).join(""):""}
  `;
}

function setOrganizationManagementTreeDepth(depth){
  const nextDepth=depth==="company"?"company":"branch";
  if(nextDepth===organizationManagementTreeDepth)return;
  organizationManagementTreeDepth=nextDepth;
  renderOrgManagementPagePreservingScroll();
}

function filterOrganizationManagementTree(keyword){
  organizationManagementOrgKeyword=String(keyword||"");
  const body=document.getElementById("orgTreeBody");
  if(body)body.innerHTML=renderOrgTreeNodes() || '<div class="unified-org-tree-empty">暂无匹配的组织</div>';
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

    <div class="base-auth-layout organization-management-layout">
      <section class="org-tree-panel unified-org-tree-panel">
        <div class="org-tree-hd">
          <div class="card-title">组织树</div>
          <div class="actions">
            <button class="btn" onclick="exportMasterData()">导出</button>
            <label class="btn" style="margin:0;cursor:pointer">导入<input type="file" accept="application/json" onchange="importMasterDataFile(this)" style="display:none"/></label>
            <button class="btn primary" onclick="openOrgAddModal('${currentOrgId}')">新增</button>
          </div>
        </div>

        <div class="unified-org-tree-search">
          <input class="input" value="${escapeAttr(organizationManagementOrgKeyword)}" placeholder="请输入组织名称" oninput="filterOrganizationManagementTree(this.value)"/>
          <div class="org-tree-depth-actions" role="group" aria-label="组织树展示层级">
            <button type="button" class="org-tree-depth-btn ${organizationManagementTreeDepth==="company"?"active":""}" title="按子公司展示" aria-label="按子公司展示" aria-pressed="${organizationManagementTreeDepth==="company"}" onclick="setOrganizationManagementTreeDepth('company')">${renderTDesignIcon("view-organization",{size:16})}</button>
            <button type="button" class="org-tree-depth-btn ${organizationManagementTreeDepth==="branch"?"active":""}" title="按分公司展示" aria-label="按分公司展示" aria-pressed="${organizationManagementTreeDepth==="branch"}" onclick="setOrganizationManagementTreeDepth('branch')">${renderTDesignIcon("tree-list",{size:16})}</button>
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
              · 英文名：${current.englishName || "-"}
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
          <span>第 1 / 1 页　每页 50 条</span>
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
          <label>英文名</label>
          <input id="orgFormEnglishName" class="input" placeholder="请输入组织英文名或英文简称"/>
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
  const englishName=document.getElementById("orgFormEnglishName").value.trim() || getOrganizationEnglishNameDefault(name);
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
    englishName,
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
      <div class="form-item"><label>英文名</label><input id="orgEditEnglishName" class="input" value="${escapeAttr(org.englishName || "")}" placeholder="请输入组织英文名或英文简称"/></div>
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
  org.englishName=document.getElementById("orgEditEnglishName").value.trim();
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
        <span>第 1 / 1 页　每页 50 条</span>
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

/* ---------- 项目资源授权 ---------- */
const projectResourceAuthorizationState={projectName:"",projectCode:""};
const projectResourcePermissionState={resourceId:"",draftSelected:[]};
const projectResourceAuthorizationData=[
  {id:"pra-001",name:"标准项目资源包",code:"open_project_right",status:"启用",remark:"集团标准项目资源权限",projects:[{name:"机场联络线工程",code:"PJ20260001"},{name:"大外环西段项目",code:"PJ20260002"}]},
  {id:"pra-002",name:"圆顶管项目资源包",code:"szsg_ydg",status:"启用",remark:"适用于圆顶管类项目",projects:[{name:"湾区金融中心项目",code:"PJ20260003"}]},
  {id:"pra-003",name:"黄河大桥版",code:"szsg_hhdq",status:"启用",remark:"黄河大桥专项资源",projects:[{name:"北方数据中心项目",code:"PJ20260004"}]},
  {id:"pra-004",name:"示范线初始版",code:"szsg_sfx",status:"禁用",remark:"历史示范线资源包",projects:[{name:"奉贤新城18单元项目",code:"PJ20260005"}]},
  {id:"pra-005",name:"标准项目资源-含经济",code:"szsg_jj",status:"启用",remark:"包含经济管理相关资源",projects:[{name:"海南自贸港市政配套",code:"PJ20260006"},{name:"境外港口物流园",code:"PJ20260007"}]},
  {id:"pra-006",name:"S204一体化专版",code:"szsg_yth",status:"启用",remark:"S204项目一体化资源",projects:[{name:"中原快速路提升工程",code:"PJ20260008"}]},
  {id:"pra-007",name:"S32智慧工地专版",code:"szsg_s32",status:"启用",remark:"S32智慧工地专项资源",projects:[]},
  {id:"pra-008",name:"全业务测试资源包",code:"test_all",status:"禁用",remark:"内部联调测试使用",projects:[{name:"机场联络线工程",code:"PJ20260001"}]},
  {id:"pra-009",name:"标准版资源-生产可用",code:"szsg_sc",status:"启用",remark:"生产条线标准资源",projects:[]},
  {id:"pra-010",name:"安全季化备用",code:"szsg_aqfh",status:"禁用",remark:"安全专项备用资源",projects:[]}
];

function getProjectResourceAssignedCount(row){return (row?.projects||[]).length;}

tableColumnDefinitions.projectResourceAuthorization=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>index+1},
  {key:"name",title:"资源包名称",width:230,align:"left",render:row=>row.name},
  {key:"code",title:"资源包编号",width:210,align:"left",render:row=>row.code},
  {key:"projectCount",title:"已分配项目数",width:150,align:"center",render:row=>`<button type="button" class="link project-resource-count-link" onclick="openProjectResourceAssignedProjects('${row.id}')">${getProjectResourceAssignedCount(row)}</button>`},
  {key:"status",title:"状态",width:110,align:"center",render:row=>row.status==="启用"?tag("启用","green"):tag("禁用","gray")},
  {key:"remark",title:"备注",width:300,align:"left",render:row=>row.remark||"-"},
  {key:"operation",title:"操作",width:250,align:"center",render:row=>`<a class="link" onclick="openProjectResourceAuthorizationEdit('${row.id}')">编辑</a> <a class="link" onclick="openProjectResourcePermissionManagement('${row.id}')">权限管理</a> <a class="link" onclick="openProjectResourceAssignmentPlaceholder('${row.id}')">分配项目</a>`}
];

function normalizeProjectResourcePermissionNode(node,prefix){
  const name=String(node.name||node.label||"");
  const key=`${prefix}.${String(node.key||name).replace(/\s+/g,"-")}`;
  return {key,name,children:(node.children||[]).map(child=>normalizeProjectResourcePermissionNode(child,key))};
}

function getProjectResourceMenuCatalog(){
  const pc=(typeof projectPrimaryMenus!=="undefined"?projectPrimaryMenus:[]).map(primary=>normalizeProjectResourcePermissionNode({key:primary.key,name:primary.name,children:(typeof projectPortalMenus!=="undefined"?projectPortalMenus[primary.key]?.menus:[])||[]},"pc.menu"));
  const mobileApps=typeof mobileAppNamesV2256!=="undefined"?mobileAppNamesV2256:[];
  const mobile=[
    normalizeProjectResourcePermissionNode({key:"navigation",name:"底部导航",children:[{key:"home",name:"首页"},{key:"apps",name:"应用"},{key:"message",name:"消息"},{key:"mine",name:"我的"}]},"mobile.menu"),
    normalizeProjectResourcePermissionNode({key:"workbench",name:"工作台应用",children:mobileApps.map((name,index)=>({key:`app-${index+1}`,name}))},"mobile.menu")
  ];
  return {pc,mobile};
}

function getProjectResourceButtonCatalog(){
  const actionNames=(name,platform)=>{
    if(platform==="mobile"){
      if(/考勤|打卡/.test(name))return ["查看记录","定位打卡","补卡申请"];
      if(/巡检|隐患|风险|质量/.test(name))return ["查看详情","新增记录","拍照上传","提交整改","关闭"];
      if(/日报|填报|进度/.test(name))return ["查看详情","新增填报","暂存","提交","撤回"];
      return ["查看详情","新增","编辑","提交"];
    }
    if(/总览|总览|桌面/.test(name))return ["查看","刷新","导出"];
    if(/日志|上报|填报|申请/.test(name))return ["查看","新增","编辑","提交","撤回","导出"];
    if(/清单|管理|名单|台账|节点|整改/.test(name))return ["查看","新增","编辑","删除","导入","导出"];
    return ["查看","新增","编辑","删除","导出"];
  };
  const withPcActions=node=>{
    const children=node.children||[];
    if(children.length)return {...node,children:children.map(withPcActions)};
    return {...node,children:actionNames(node.name,"pc").map((name,index)=>({key:`action-${index+1}`,name}))};
  };
  const pc=(typeof projectPrimaryMenus!=="undefined"?projectPrimaryMenus:[]).map(primary=>normalizeProjectResourcePermissionNode(withPcActions({key:primary.key,name:primary.name,children:(typeof projectPortalMenus!=="undefined"?projectPortalMenus[primary.key]?.menus:[])||[]}),"pc.button"));
  const mobileApps=typeof mobileAppNamesV2256!=="undefined"?mobileAppNamesV2256:[];
  const mobileGroups=[
    {key:"workbench",name:"工作台应用",children:mobileApps.map((name,index)=>({key:`app-${index+1}`,name,children:actionNames(name,"mobile").map((action,actionIndex)=>({key:`action-${actionIndex+1}`,name:action}))}))},
    {key:"message",name:"消息与待办",children:["查看全部","标记已读","办理待办","审批通过","审批驳回"].map((name,index)=>({key:`action-${index+1}`,name}))},
    {key:"mine",name:"我的",children:["版本记录","操作手册","意见反馈","设置"].map((name,index)=>({key:`action-${index+1}`,name}))}
  ];
  return {pc,mobile:mobileGroups.map(node=>normalizeProjectResourcePermissionNode(node,"mobile.button"))};
}

function getProjectResourcePermissionTree(platform){
  return getProjectResourceButtonCatalog()[platform]||[];
}

function getProjectResourcePermissionLeafKeys(nodes){
  return (nodes||[]).flatMap(node=>node.children?.length?getProjectResourcePermissionLeafKeys(node.children):[node.key]);
}

function ensureProjectResourcePermissions(row){
  const all=[...getProjectResourcePermissionLeafKeys(getProjectResourcePermissionTree("pc")),...getProjectResourcePermissionLeafKeys(getProjectResourcePermissionTree("mobile"))];
  if(Array.isArray(row.permissions)){
    const valid=new Set(all);
    row.permissions=row.permissions.filter(key=>valid.has(key));
    return row.permissions;
  }
  const keepCount=Math.max(1,Math.round(all.length*(row.status==="启用"?.72:.38)));
  row.permissions=all.filter((_,index)=>index<keepCount||index%Math.max(2,Number(row.id.slice(-1))||2)===0);
  return row.permissions;
}

function getProjectResourcePermissionNodeState(node,selectedSet){
  const leaves=getProjectResourcePermissionLeafKeys([node]);
  const count=leaves.filter(key=>selectedSet.has(key)).length;
  return {checked:leaves.length>0&&count===leaves.length,indeterminate:count>0&&count<leaves.length};
}

function renderProjectResourcePermissionNodes(nodes,level=1){
  const selectedSet=new Set(projectResourcePermissionState.draftSelected);
  return (nodes||[]).map(node=>{
    const hasChildren=!!node.children?.length;
    const state=getProjectResourcePermissionNodeState(node,selectedSet);
    return `<div class="project-resource-permission-node ${hasChildren?"has-children":""}" data-permission-key="${escapeAttr(node.key)}" data-level="${level}"><div class="project-resource-permission-row" style="--permission-level:${level}"><button type="button" class="project-resource-permission-arrow ${hasChildren?"":"placeholder"}" onclick="toggleProjectResourcePermissionBranch(this)">${hasChildren?"▾":""}</button><input type="checkbox" ${state.checked?"checked":""} data-indeterminate="${state.indeterminate}" onchange="toggleProjectResourcePermissionNode('${escapeAttr(node.key)}',this.checked)"/><span>${escapeAttr(node.name)}</span></div>${hasChildren?`<div class="project-resource-permission-children">${renderProjectResourcePermissionNodes(node.children,level+1)}</div>`:""}</div>`;
  }).join("");
}

function renderProjectResourcePermissionPanel(platform,title){
  const tree=getProjectResourcePermissionTree(platform);
  return `<section class="project-resource-permission-panel"><header><strong>${title}</strong></header><div class="project-resource-permission-tree">${renderProjectResourcePermissionNodes(tree)}</div></section>`;
}

function renderProjectResourcePermissionModalBody(){
  return `<div class="project-resource-permission-layout">${renderProjectResourcePermissionPanel("pc","项目管理端-PC")}${renderProjectResourcePermissionPanel("mobile","项目管理端-移动端")}</div>`;
}

function refreshProjectResourcePermissionModal(){
  const body=document.querySelector(".project-resource-permission-modal .modal-bd");
  if(body)body.innerHTML=renderProjectResourcePermissionModalBody();
  document.querySelectorAll(".project-resource-permission-modal input[data-indeterminate='true']").forEach(input=>input.indeterminate=true);
}

function openProjectResourcePermissionManagement(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  projectResourcePermissionState.resourceId=id;
  projectResourcePermissionState.draftSelected=[...ensureProjectResourcePermissions(row)];
  openModal("权限管理",renderProjectResourcePermissionModalBody(),`<button class="btn" onclick="closeModal()">关闭</button><button class="btn primary" onclick="saveProjectResourcePermissionManagement()">保存</button>`,"large");
  modalBox.classList.add("project-resource-permission-modal");
  refreshProjectResourcePermissionModal();
}

function findProjectResourcePermissionNode(key){
  for(const platform of ["pc","mobile"]){
    const stack=[...getProjectResourcePermissionTree(platform)];
    while(stack.length){const node=stack.shift();if(node.key===key)return node;stack.push(...(node.children||[]));}
  }
  return null;
}

function toggleProjectResourcePermissionNode(key,checked){
  const node=findProjectResourcePermissionNode(key);
  if(!node)return;
  const selected=new Set(projectResourcePermissionState.draftSelected);
  getProjectResourcePermissionLeafKeys([node]).forEach(leaf=>checked?selected.add(leaf):selected.delete(leaf));
  projectResourcePermissionState.draftSelected=[...selected];
  refreshProjectResourcePermissionModal();
}

function toggleProjectResourcePermissionBranch(button){
  const node=button.closest(".project-resource-permission-node");
  node?.classList.toggle("collapsed");
  if(button)button.textContent=node?.classList.contains("collapsed")?"▸":"▾";
}

function saveProjectResourcePermissionManagement(){
  const row=getProjectResourceAuthorizationById(projectResourcePermissionState.resourceId);
  if(!row)return;
  row.permissions=[...projectResourcePermissionState.draftSelected];
  closeModal();
  showToast(`“${row.name}”资源权限已保存`);
}

function getProjectResourceAuthorizationFiltered(){
  const name=projectResourceAuthorizationState.projectName.trim().toLowerCase();
  const code=projectResourceAuthorizationState.projectCode.trim().toLowerCase();
  return projectResourceAuthorizationData.filter(row=>{
    const projectNames=(row.projects||[]).map(project=>project.name).join(" ").toLowerCase();
    const projectCodes=(row.projects||[]).map(project=>project.code).join(" ").toLowerCase();
    const matchName=!name||projectNames.includes(name);
    const matchCode=!code||projectCodes.includes(code);
    return matchName&&matchCode;
  });
}

function queryProjectResourceAuthorization(){
  projectResourceAuthorizationState.projectName=document.getElementById("projectResourceProjectName")?.value||"";
  projectResourceAuthorizationState.projectCode=document.getElementById("projectResourceProjectCode")?.value||"";
  renderProjectResourceAuthorizationPage();
}

function resetProjectResourceAuthorization(){
  projectResourceAuthorizationState.projectName="";
  projectResourceAuthorizationState.projectCode="";
  renderProjectResourceAuthorizationPage();
}

function renderProjectResourceAuthorizationPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const list=getProjectResourceAuthorizationFiltered();
  const queryFields=`
    <div class="form-item"><label>项目名称</label><input class="input" id="projectResourceProjectName" value="${escapeAttr(projectResourceAuthorizationState.projectName)}" placeholder="请输入项目名称" onkeydown="if(event.key==='Enter')queryProjectResourceAuthorization()"/></div>
    <div class="form-item"><label>项目编号</label><input class="input" id="projectResourceProjectCode" value="${escapeAttr(projectResourceAuthorizationState.projectCode)}" placeholder="请输入项目编号" onkeydown="if(event.key==='Enter')queryProjectResourceAuthorization()"/></div>
  `;
  listPage.innerHTML=`
    <div class="compact-title-row"><div class="module-title">项目资源授权</div></div>
    ${renderUnifiedQueryCard(queryFields,{id:"projectResourceAuthorizationQuery",gridClass:"search-grid",queryFn:"queryProjectResourceAuthorization()",resetFn:"resetProjectResourceAuthorization()"})}
    ${renderUnifiedTableCard({
      title:"项目资源授权列表",
      tableKey:"projectResourceAuthorization",
      tableId:"projectResourceAuthorizationTable",
      theadId:"projectResourceAuthorizationThead",
      tbodyId:"projectResourceAuthorizationTbody",
      totalId:"projectResourceAuthorizationTotalText",
      total:list.length,
      renderFnName:"renderProjectResourceAuthorizationPage",
      refreshAction:"renderProjectResourceAuthorizationPage();showToast('已刷新项目资源授权列表')",
      exportAction:"showToast('导出成功：项目资源授权列表.xlsx')"
    })}
  `;
  renderTableByColumns("projectResourceAuthorization",list,"projectResourceAuthorizationTbody");
}

function getProjectResourceAuthorizationById(id){return projectResourceAuthorizationData.find(row=>row.id===id);}

function openProjectResourceAssignedProjects(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  const selectedIds=(row.projects||[]).map(project=>getMessageProjectPickerRows().find(item=>String(item.projectCode||"")===String(project.code||"")||String(item.projectName||"")===String(project.name||""))?.id).filter(Boolean);
  openMessageProjectPicker("projectResourceAuthorizationManager",{mode:"manage",title:`权限管理 - ${row.name}`,resourceId:id,selectedIds,excludeSelected:false});
}

function openProjectResourceAuthorizationDetail(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  openModal("查看项目资源授权",`<div class="form-grid-2"><div class="form-item"><label>资源包名称</label><input class="input" value="${escapeAttr(row.name)}" disabled/></div><div class="form-item"><label>资源包编号</label><input class="input" value="${escapeAttr(row.code)}" disabled/></div><div class="form-item"><label>已分配项目数</label><input class="input" value="${getProjectResourceAssignedCount(row)}" disabled/></div><div class="form-item"><label>状态</label><input class="input" value="${row.status}" disabled/></div><div class="form-item" style="grid-column:1/-1"><label>备注</label><textarea class="input" disabled>${row.remark||""}</textarea></div></div>`,`<button class="btn" onclick="closeModal()">关闭</button>`);
}

function openProjectResourceAuthorizationEdit(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  openModal("编辑项目资源授权",`<div class="project-resource-edit-form"><div class="form-item"><label>资源包名称</label><input class="input" id="projectResourceEditName" value="${escapeAttr(row.name)}"/></div><div class="form-item"><label>资源包编号</label><input class="input" value="${escapeAttr(row.code)}" disabled/></div><div class="form-item"><label>状态</label><select class="select" id="projectResourceEditStatus"><option ${row.status==="启用"?"selected":""}>启用</option><option ${row.status==="禁用"?"selected":""}>禁用</option></select></div><div class="form-item project-resource-edit-remark"><label>备注</label><textarea class="input" id="projectResourceEditRemark" placeholder="请输入备注">${row.remark||""}</textarea></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveProjectResourceAuthorizationEdit('${id}')">保存</button>`,"large");
}

function saveProjectResourceAuthorizationEdit(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  const name=document.getElementById("projectResourceEditName")?.value.trim();
  if(!name)return showToast("请输入资源包名称");
  row.name=name;
  row.status=document.getElementById("projectResourceEditStatus")?.value||row.status;
  row.remark=document.getElementById("projectResourceEditRemark")?.value.trim()||"";
  closeModal();
  renderProjectResourceAuthorizationPage();
  showToast("项目资源授权已保存");
}

function openProjectResourceAssignmentPlaceholder(id){
  const row=getProjectResourceAuthorizationById(id);
  if(!row)return;
  const selectedIds=(row.projects||[]).map(project=>{
    const match=getMessageProjectPickerRows().find(item=>String(item.projectCode||"")===String(project.code||"")||String(item.projectName||"")===String(project.name||""));
    return match?.id;
  }).filter(Boolean);
  openMessageProjectPicker("projectResourceAssignmentTarget",{
    selectedIds,
    onConfirm:ids=>{
      const selectedRows=getMessageProjectPickerRows().filter(project=>ids.includes(String(project.id)));
      row.projects=selectedRows.map(project=>({name:project.projectName,code:project.projectCode}));
      renderProjectResourceAuthorizationPage();
      showToast(`“${row.name}”已完成项目分配，共 ${getProjectResourceAssignedCount(row)} 个项目`);
    }
  });
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
        <span>第 1 / 1 页　每页 50 条</span>
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
  const map={启用:"green",禁用:"gray",已发送:"green",待发送:"orange",发送中:"blue",部分发送:"orange",部分失败:"orange",失败:"red",已撤回:"gray",发送成功:"green",发送失败:"red",已送达:"green",送达失败:"red",未读:"orange",已读:"green",未点击:"gray",已点击:"blue",未办理:"gray",办理中:"orange",已办理:"green",开启:"orange",关闭:"gray"};
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
    if(x.type==="待办任务"||x.type==="代办任务")return false;
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

function getMessageRecordBaseFiltered(){
  return messageRecordData.filter(x=>{
    if(!["消息通知","预警通知","通知公告"].includes(x.type))return false;
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
    const kw=messageAdminState.recordKeyword||"";
    if(kw && !(x.title.includes(kw)||x.content.includes(kw)||x.receiver.includes(kw)||x.account.includes(kw)||x.project.includes(kw)||x.batchNo.includes(kw)))return false;
    return true;
  });
}

function filterMessageRecordStats(rows){
  return rows.filter(x=>(!messageAdminState.recordDeliver||x.deliverStatus===messageAdminState.recordDeliver)&&(!messageAdminState.recordRead||x.readStatus===messageAdminState.recordRead)&&(!messageAdminState.recordClick||x.clickStatus===messageAdminState.recordClick));
}

function getMessageTodoReachBaseFiltered(){
  return messageTodoReachRecordData.filter(x=>{
    const bizList=messageAdminState.todoBizList||[];
    if(bizList.length&&!bizList.some(b=>x.biz.includes(b.replace(/ \/ /g,">").replace(/\//g,">").trim())||x.biz.includes(b.split(" / ").pop())))return false;
    const titleKw=messageAdminState.todoTitle||"";
    if(titleKw&&!x.todoTitle.includes(titleKw))return false;
    const receiverKw=messageAdminState.todoReceiver||"";
    if(receiverKw&&!x.receiver.includes(receiverKw))return false;
    return true;
  });
}

function filterMessageTodoStats(rows){
  return rows.filter(x=>(!messageAdminState.todoDeliver||x.deliverStatus===messageAdminState.todoDeliver)&&(!messageAdminState.todoRead||x.readStatus===messageAdminState.todoRead)&&(!messageAdminState.todoClick||x.clickStatus===messageAdminState.todoClick)&&(!messageAdminState.todoHandle||x.handleStatus===messageAdminState.todoHandle)&&(!messageAdminState.todoOverdue||matchesMessageTodoOverdueStat(x,messageAdminState.todoOverdue)));
}

function getMessageDetailOrgState(scope){
  return scope==="todo"
    ?{aggregate:messageAdminState.todoOrgAggregate,orgId:messageAdminState.todoOrgId}
    :{aggregate:messageAdminState.recordOrgAggregate,orgId:messageAdminState.recordOrgId};
}

function filterMessageDetailOrgRows(scope,rows){
  const state=getMessageDetailOrgState(scope);
  if(!state.aggregate||!state.orgId)return rows;
  const selected=findOrgById(state.orgId)?.node;
  const names=new Set(getUnifiedOrgDescendantNames(selected,[]));
  return rows.filter(row=>names.has(row.org));
}

function getMessageRecordScopedRows(){
  return filterMessageDetailOrgRows("record",getMessageRecordBaseFiltered());
}

function getMessageRecordFiltered(){
  return filterMessageRecordStats(getMessageRecordScopedRows());
}

function getMessageTodoReachScopedRows(){
  return filterMessageDetailOrgRows("todo",getMessageTodoReachBaseFiltered());
}

function getMessageTodoReachFiltered(){
  return filterMessageTodoStats(getMessageTodoReachScopedRows());
}

function captureMessageDetailFilters(scope){
  if(scope==="record"){
    messageAdminState.recordType=document.getElementById("msgRecordType")?.value || "";
    messageAdminState.recordTitle=document.getElementById("msgRecordTitle")?.value.trim() || "";
    messageAdminState.recordContent=document.getElementById("msgRecordContent")?.value.trim() || "";
    messageAdminState.recordBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgRecordBizTreeFilter")).map(x=>x.dataset.label || x.value);
    messageAdminState.recordReceiver=document.getElementById("msgRecordReceiver")?.value.trim() || "";
    messageAdminState.recordOrg=document.getElementById("msgRecordOrg")?.value.trim() || "";
    messageAdminState.recordProject=document.getElementById("msgRecordProject")?.value.trim() || "";
    messageAdminState.recordPost=document.getElementById("msgRecordPost")?.value.trim() || "";
    messageAdminState.recordKeyword="";
    return;
  }
  messageAdminState.todoBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgTodoBizTreeFilter")).map(x=>x.dataset.label||x.value);
  messageAdminState.todoBiz=messageAdminState.todoBizList.join("、");
  messageAdminState.todoTitle=document.getElementById("msgTodoTitle")?.value.trim() || "";
  messageAdminState.todoReceiver=document.getElementById("msgTodoReceiver")?.value.trim() || "";
  messageAdminState.todoDeliver=document.getElementById("msgTodoDeliver")?.value || "";
  messageAdminState.todoRead=document.getElementById("msgTodoRead")?.value || "";
  messageAdminState.todoClick=document.getElementById("msgTodoClick")?.value || "";
  messageAdminState.todoHandle=document.getElementById("msgTodoHandle")?.value || "";
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
    captureMessageDetailFilters("record");
    messageAdminState.recordDeliver=messageAdminState.recordDeliver || "";
    messageAdminState.recordRead=messageAdminState.recordRead || "";
    messageAdminState.recordClick=messageAdminState.recordClick || "";
    renderMessageRecordPage();
  }
  if(scope==="todo"){
    captureMessageDetailFilters("todo");
    renderMessageRecordPage();
  }
}

function resetMessageAdminFilters(scope){
  const preservedKeys=new Set(["recordTab","recordOrgAggregate","recordOrgId","recordOrgKeyword","todoOrgAggregate","todoOrgId","todoOrgKeyword"]);
  Object.keys(messageAdminState).forEach(k=>{
    if(!preservedKeys.has(k)&&k.toLowerCase().startsWith(scope))messageAdminState[k]=Array.isArray(messageAdminState[k])?[]:"";
  });
  if(scope==="template")renderMessageTemplatePage();
  if(scope==="send")renderMessageSendRecordPage();
  if(scope==="record")renderMessageRecordPage();
  if(scope==="todo")renderMessageRecordPage();
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
  {key:"biz",title:"业务分类",width:160,align:"center",render:x=>tag(x.biz,"blue")},
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
  const activeTemplateStat=messageAdminState.templateType?`type|${messageAdminState.templateType}`:messageAdminState.templateStatus?`status|${messageAdminState.templateStatus}`:"";
  const statsHtml=StatisticsFilter.render({id:"message-template-statistics-filter",activeKey:activeTemplateStat,groups:[
    {label:"消息类型",items:[{key:"type|消息通知",label:"消息通知",value:typeNotice},{key:"type|预警通知",label:"预警通知",value:typeWarn}]},
    {label:"模板状态",items:[{key:"status|启用",label:"启用模板",value:enabled},{key:"status|禁用",label:"禁用模板",value:disabled}]},
    {label:"累计调用",items:[{key:"calls",label:"累计调用",value:calls,metric:true},{key:"systemCalls",label:"系统调用",value:systemCalls,metric:true},{key:"manualCalls",label:"手动调用",value:manualCalls,metric:true}]}
  ],onChange:key=>{const [type,value]=key.split("|");setMessageTemplateStatFilter(type,value);}});

  listPage.innerHTML=`
    ${messageAdminHeader("消息模板","配置业务触发和手动发送可复用的消息内容、接收路由与展示方式")}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-template-search-grid",queryFn:"syncMessageAdminFilters('template')",resetFn:"resetMessageAdminFilters('template')"})}
    ${statsHtml}
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
  if(document.getElementById("messageSendDetailReach"))renderMessageSendDetailReach(messageSendDrillState.batchNo);
  else renderSendDrillModalBody();
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
        <div class="pagination"><span>共 ${list.length} 条</span><span>第 1 / 1 页　每页 50 条</span></div>
      </section>
    </div>
  `;
  renderTableByColumns("messageRecord",list,"sendDrillRecordTbody");
}

function renderMessageSendDetailReach(batchNo){
  messageSendDrillState.batchNo=batchNo;
  const list=getSendDrillRecords();
  const container=document.getElementById("messageSendDetailReach");
  if(!container)return;
  container.innerHTML=`
    <section class="card unified-stats-card send-drill-stats-card">
      <div class="card-bd">${renderSendDrillStats()}</div>
    </section>
    <section class="card table-card send-drill-table-card">
      <div class="card-hd">
        <div class="card-title">触达明细</div>
        <div class="actions">
          <button class="btn" onclick="renderMessageSendDetailReach('${batchNo}');showToast('已刷新触达明细')">刷新</button>
          <button class="btn primary" onclick="showToast('导出成功：触达明细.xlsx')">导出</button>
        </div>
      </div>
      <div class="table-wrap roster-table-wrap">
        <table style="min-width:${getTableMinWidth('messageRecord')}px">
          <thead><tr>${renderTableHeaderByColumns('messageRecord')}</tr></thead>
          <tbody id="messageSendDetailReachTbody"></tbody>
        </table>
      </div>
      <div class="pagination"><span>共 ${list.length} 条</span><span>第 1 / 1 页　每页 50 条</span></div>
    </section>
  `;
  renderTableByColumns("messageRecord",list,"messageSendDetailReachTbody");
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
  {key:"biz",title:"业务分类",width:160,align:"center",render:x=>tag(x.biz,"blue")},
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

function setMessageSendBatchTab(tab){
  if(tab!=="message"&&tab!=="todo")return;
  messageAdminState.sendTab=tab;
  renderMessageSendRecordPage();
}

function renderMessageSendBatchTitleRow(){
  const activeTab=messageAdminState.sendTab==="todo"?"todo":"message";
  return `
    <div class="compact-title-row output-forecast-title-row message-record-title-row">
      <div class="module-title">消息&待办管理 / 发送批次明细</div>
      <div class="screen-tabs output-forecast-tabs message-record-tabs">
        <button class="${activeTab==="message"?"active":""}" onclick="setMessageSendBatchTab('message')">消息发送批次</button>
        <button class="${activeTab==="todo"?"active":""}" onclick="setMessageSendBatchTab('todo')">待办触达批次</button>
      </div>
    </div>
  `;
}

function getMessageTodoBatchData(){
  const batches=new Map();
  messageTodoReachRecordData.forEach((item,index)=>{
    if(!batches.has(item.batchNo))batches.set(item.batchNo,{batchNo:item.batchNo,records:[],firstIndex:index});
    batches.get(item.batchNo).records.push(item);
  });
  return Array.from(batches.values()).map((batch,index)=>{
    const records=batch.records;
    const sample=records[0];
    const sentCount=records.filter(x=>x.deliverStatus==="已送达").length;
    const readCount=records.filter(x=>x.readStatus==="已读").length;
    const clickCount=records.filter(x=>x.clickStatus==="已点击").length;
    const handleCount=records.filter(x=>x.handleStatus==="已办理").length;
    const failedCount=records.length-sentCount;
    const withdrawnCount=records.filter(x=>x.deliverStatus==="已撤回").length;
    const pendingCount=records.filter(x=>x.deliverStatus==="待发送").length;
    const modes=["业务接口","定时任务","手动发送"];
    return {
      batchNo:batch.batchNo,
      status:withdrawnCount===records.length?"已撤回":pendingCount===records.length?"待发送":failedCount?(sentCount?"部分发送":"失败"):"已发送",
      biz:sample.biz,todoTitle:sample.todoTitle,todoContent:sample.todoContent,
      sendTime:records.map(x=>x.deliverTime).filter(Boolean).sort()[0]||"--",
      shouldCount:records.length,sentCount,readCount,clickCount,handleCount,
      touchRate:calcPercent(sentCount,records.length),readRate:calcPercent(readCount,sentCount),
      clickRate:calcPercent(clickCount,readCount),handleRate:calcPercent(handleCount,sentCount),
      triggerMode:modes[index%modes.length],targetType:index%3===0?"指定人员":index%3===1?"指定岗位":"组织",
      receivers:records.map(x=>x.receiver),targetValue:records.map(x=>x.receiver).join("、"),jumpLink:"/pages/todo/detail?batchNo="+batch.batchNo,
      jump:"开启",popup:index%2===0?"开启":"关闭",popupStyle:index%2===0?"普通样式":"--"
    };
  });
}

function getMessageTodoBatchFiltered(){
  return getMessageTodoBatchData().filter(x=>{
    const bizList=messageAdminState.todoBatchBizList||[];
    if(bizList.length&&!bizList.some(v=>v===x.biz||x.biz.startsWith(v+">")))return false;
    if(messageAdminState.todoBatchTitle&&!x.todoTitle.includes(messageAdminState.todoBatchTitle))return false;
    if(messageAdminState.todoBatchContent&&!x.todoContent.includes(messageAdminState.todoBatchContent))return false;
    if(messageAdminState.todoBatchReceiver&&!x.receivers.some(name=>name.includes(messageAdminState.todoBatchReceiver)))return false;
    if(messageAdminState.todoBatchStatus&&x.status!==messageAdminState.todoBatchStatus)return false;
    if(messageAdminState.todoBatchTrigger&&x.triggerMode!==messageAdminState.todoBatchTrigger)return false;
    return true;
  });
}

function syncMessageTodoBatchFilters(){
  messageAdminState.todoBatchBizList=getTemplateTreeCheckedLeaves(document.getElementById("msgTodoBatchBizTreeFilter")).map(x=>x.dataset.label||x.value);
  messageAdminState.todoBatchTitle=document.getElementById("msgTodoBatchTitle")?.value.trim()||"";
  messageAdminState.todoBatchContent=document.getElementById("msgTodoBatchContent")?.value.trim()||"";
  messageAdminState.todoBatchReceiver=document.getElementById("msgTodoBatchReceiver")?.value.trim()||"";
  messageAdminState.todoBatchStatus=document.getElementById("msgTodoBatchStatus")?.value||"";
  messageAdminState.todoBatchTrigger=document.getElementById("msgTodoBatchTrigger")?.value||"";
  renderMessageTodoBatchPage();
}

function resetMessageTodoBatchFilters(){
  messageAdminState.todoBatchBizList=[];messageAdminState.todoBatchTitle="";messageAdminState.todoBatchContent="";messageAdminState.todoBatchReceiver="";
  messageAdminState.todoBatchStatus="";messageAdminState.todoBatchTrigger="";
  renderMessageTodoBatchPage();
}

function renderMessageTodoBatchBizFilter(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgTodoBatchBizTreeFilter",tree,"请选择业务分类",messageAdminState.todoBatchBizList||[]);
}

function setMessageTodoBatchStatusFilter(value){
  messageAdminState.todoBatchStatus=messageAdminState.todoBatchStatus===value?"":value;
  renderMessageTodoBatchPage();
}

function renderMessageTodoBatchStatusStat(value,count){
  const active=messageAdminState.todoBatchStatus===value;
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageTodoBatchStatusFilter('${value}')"><strong>${count}</strong><span>${value}</span></button>`;
}

function renderMessageTodoBatchPage(){
  const list=getMessageTodoBatchFiltered();
  const all=getMessageTodoBatchData();
  const queryFields=`
    <div class="form-item"><label>业务分类</label>${renderMessageTodoBatchBizFilter()}</div>
    <div class="form-item"><label>待办标题</label><input class="input" id="msgTodoBatchTitle" placeholder="请输入待办标题" value="${escapeAttr(messageAdminState.todoBatchTitle||'')}"/></div>
    <div class="form-item"><label>待办内容</label><input class="input" id="msgTodoBatchContent" placeholder="请输入待办内容" value="${escapeAttr(messageAdminState.todoBatchContent||'')}"/></div>
    <div class="form-item"><label>触达用户姓名</label><input class="input" id="msgTodoBatchReceiver" placeholder="请输入触达用户姓名" value="${escapeAttr(messageAdminState.todoBatchReceiver||'')}"/></div>
    <div class="form-item"><label>发送状态</label><select class="select" id="msgTodoBatchStatus"><option value="">全部</option><option>待发送</option><option>已发送</option><option>部分发送</option><option>失败</option><option>已撤回</option></select></div>
    <div class="form-item"><label>触发方式</label><select class="select" id="msgTodoBatchTrigger"><option value="">全部</option><option>业务接口</option><option>定时任务</option><option>手动发送</option></select></div>`;
  const sent=all.reduce((n,x)=>n+x.sentCount,0),read=all.reduce((n,x)=>n+x.readCount,0),clicked=all.reduce((n,x)=>n+x.clickCount,0),handled=all.reduce((n,x)=>n+x.handleCount,0);
  const statsHtml=StatisticsFilter.render({id:"message-todo-batch-statistics-filter",activeKey:messageAdminState.todoBatchStatus,groups:[
    {label:"发送状态",items:["待发送","已发送","部分发送","失败","已撤回"].map(status=>({key:status,label:status,value:all.filter(x=>x.status===status).length}))},
    {label:"指标统计",items:[{key:"reachRate",label:"触达率",value:calcPercent(sent,all.reduce((n,x)=>n+x.shouldCount,0)),metric:true},{key:"readRate",label:"阅读率",value:calcPercent(read,sent),metric:true}]},
    {label:"互动统计",items:[{key:"clickRate",label:"点击率",value:calcPercent(clicked,read),metric:true},{key:"handleRate",label:"办理率",value:calcPercent(handled,sent),metric:true}]}
  ],onChange:key=>setMessageTodoBatchStatusFilter(key)});
  listPage.innerHTML=`
    ${renderMessageSendBatchTitleRow()}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-record-search-grid",queryFn:"syncMessageTodoBatchFilters()",resetFn:"resetMessageTodoBatchFilters()"})}
    ${statsHtml}
    ${renderUnifiedTableCard({title:"待办触达批次",tableKey:"messageTodoBatch",tableId:"messageTodoBatchTable",theadId:"messageTodoBatchThead",tbodyId:"messageTodoBatchTbody",totalId:"messageTodoBatchTotalText",total:list.length,renderFnName:"renderMessageTodoBatchPage",refreshAction:"renderMessageTodoBatchPage();showToast('已刷新待办触达批次')",exportAction:"showToast('导出成功：待办触达批次.xlsx')"})}
  `;
  setSelectValue("msgTodoBatchStatus",messageAdminState.todoBatchStatus);
  setSelectValue("msgTodoBatchTrigger",messageAdminState.todoBatchTrigger);
  renderTableByColumns("messageTodoBatch",list,"messageTodoBatchTbody");
  setTimeout(()=>refreshTemplateTreeStates("msgTodoBatchBizTreeFilter"),0);
}

tableColumnDefinitions.messageTodoBatch=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"status",title:"发送状态",width:110,align:"center",render:x=>messageStatusTag(x.status)},
  {key:"biz",title:"业务分类",width:160,align:"center",render:x=>messageTodoBizTag(x.biz)},
  {key:"todoTitle",title:"待办标题",width:220,align:"left",render:x=>x.todoTitle},
  {key:"todoContent",title:"待办内容",width:300,align:"left",render:x=>`<span class="message-admin-ellipsis">${x.todoContent}</span>`},
  {key:"sendTime",title:"发送时间",width:170,align:"center",render:x=>x.sendTime},
  {key:"shouldCount",title:"应发人数",width:100,align:"right",render:x=>x.shouldCount},
  {key:"sentCount",title:"实发人数",width:100,align:"right",render:x=>x.sentCount},
  {key:"touchRate",title:"触达率",width:90,align:"center",render:x=>x.touchRate},
  {key:"readCount",title:"已读人数",width:100,align:"right",render:x=>x.readCount},
  {key:"readRate",title:"阅读率",width:90,align:"center",render:x=>x.readRate},
  {key:"clickCount",title:"点击人数",width:100,align:"right",render:x=>x.clickCount},
  {key:"clickRate",title:"点击率",width:90,align:"center",render:x=>x.clickRate},
  {key:"handleCount",title:"办理人数",width:100,align:"right",render:x=>x.handleCount},
  {key:"handleRate",title:"办理率",width:90,align:"center",render:x=>x.handleRate},
  {key:"triggerMode",title:"触发方式",width:110,align:"center",render:x=>tag(x.triggerMode,x.triggerMode==="业务接口"?"green":x.triggerMode==="定时任务"?"orange":"blue")},
  {key:"targetType",title:"接收人员类型",width:130,align:"center",render:x=>x.targetType},
  {key:"targetValue",title:"接收对象选择",width:190,align:"left",render:x=>x.targetValue},
  {key:"jump",title:"是否跳转",width:100,align:"center",render:x=>messageStatusTag(x.jump)},
  {key:"jumpLink",title:"跳转链接",width:240,align:"left",render:x=>x.jumpLink},
  {key:"popup",title:"是否弹框",width:100,align:"center",render:x=>messageStatusTag(x.popup)},
  {key:"popupStyle",title:"弹框样式",width:110,align:"center",render:x=>x.popupStyle},
  {key:"operation",title:"操作",width:190,align:"center",render:x=>`<a class="link" onclick="openMessageBatchDetail('${x.batchNo}')">查看</a> <a class="link" onclick="retryMessageTodoBatch('${x.batchNo}')">重新触达</a> <a class="link" onclick="withdrawMessageTodoBatch('${x.batchNo}')">撤回</a>`}
];

function retryMessageTodoBatch(batchNo){
  messageTodoReachRecordData.filter(x=>x.batchNo===batchNo&&x.deliverStatus==="送达失败").forEach(x=>{x.deliverStatus="已送达";x.deliverTime="2026-07-25 22:55:00";x.failReason="";x.readStatus="未读";x.clickStatus="未点击";x.handleStatus="未办理";});
  renderMessageTodoBatchPage();showToast("待办已重新触达");
}

function withdrawMessageTodoBatch(batchNo){
  openModal("撤回确认",`<div style="padding:12px 0">确认撤回该待办触达批次吗？</div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="confirmWithdrawMessageTodoBatch('${batchNo}')">确认撤回</button>`);
}

function confirmWithdrawMessageTodoBatch(batchNo){
  messageTodoReachRecordData.filter(x=>x.batchNo===batchNo).forEach(x=>x.deliverStatus="已撤回");
  closeModal();renderMessageTodoBatchPage();showToast("待办触达批次已撤回");
}

function renderMessageSendRecordPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  messageAdminState.sendTab=messageAdminState.sendTab==="todo"?"todo":"message";
  if(messageAdminState.sendTab==="todo"){
    renderMessageTodoBatchPage();
    return;
  }
  const list=getMessageSendFiltered();
  const should=list.reduce((sum,x)=>sum+x.shouldCount,0);
  const sent=list.reduce((sum,x)=>sum+x.sentCount,0);
  const read=list.reduce((sum,x)=>sum+x.readCount,0);
  const clicked=list.reduce((sum,x)=>sum+x.clickCount,0);
  const all=messageSendRecordData.filter(x=>x.type!=="待办任务"&&x.type!=="代办任务");
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
    warning:all.filter(x=>x.type==="预警通知").length
  };
  const queryFields=`
    <div class="form-item"><label>消息类型</label><select class="select" id="msgSendType"><option value="">全部</option><option>消息通知</option><option>通知公告</option><option>预警通知</option></select></div>
    <div class="form-item"><label>消息标题</label><input class="input" id="msgSendTitle" placeholder="请输入消息标题" value="${messageAdminState.sendTitle||''}"/></div>
    <div class="form-item"><label>消息内容</label><input class="input" id="msgSendContent" placeholder="请输入消息内容" value="${messageAdminState.sendContent||''}"/></div>
    <div class="form-item"><label>业务分类</label>${renderMessageSendBizFilterTreeSelect()}</div>
    <div class="form-item"><label>接收人姓名</label><input class="input" id="msgSendReceiver" placeholder="匹配消息记录接收人" value="${messageAdminState.sendReceiver||''}"/></div>
    <div class="form-item"><label>接收人组织</label><input class="input" id="msgSendOrg" placeholder="匹配消息记录组织" value="${messageAdminState.sendOrg||''}"/></div>
    <div class="form-item"><label>接收人项目</label><input class="input" id="msgSendProject" placeholder="匹配消息记录项目" value="${messageAdminState.sendProject||''}"/></div>
    <div class="form-item"><label>接收人岗位</label><input class="input" id="msgSendPost" placeholder="匹配消息记录岗位" value="${messageAdminState.sendPost||''}"/></div>
  `;
  const activeSendStat=messageAdminState.sendType?`type|${messageAdminState.sendType}`:messageAdminState.sendStatus?`status|${messageAdminState.sendStatus}`:messageAdminState.sendTrigger?`trigger|${messageAdminState.sendTrigger}`:"";
  const statsHtml=StatisticsFilter.render({id:"message-send-statistics-filter",activeKey:activeSendStat,groups:[
    {label:"消息类型",items:[{key:"type|消息通知",label:"消息通知",value:typeCounts.notice},{key:"type|通知公告",label:"通知公告",value:typeCounts.announcement},{key:"type|预警通知",label:"预警通知",value:typeCounts.warning}]},
    {label:"发送状态",items:[{key:"status|待发送",label:"待发送",value:statusCounts.wait},{key:"status|已发送",label:"已发送",value:statusCounts.sent},{key:"status|部分发送",label:"部分发送",value:statusCounts.partial},{key:"status|失败",label:"失败",value:statusCounts.failed},{key:"status|已撤回",label:"已撤回",value:statusCounts.withdrawn}]},
    {label:"触发方式",items:[{key:"trigger|手动发送",label:"手动发送",value:triggerCounts.manual},{key:"trigger|业务接口",label:"业务接口",value:triggerCounts.api},{key:"trigger|定时任务",label:"定时任务",value:triggerCounts.timer}]},
    {label:"指标统计",items:[{key:"reachRate",label:"触达率",value:calcPercent(sent,should),metric:true},{key:"readRate",label:"阅读率",value:calcPercent(read,sent),metric:true},{key:"clickRate",label:"点击率",value:calcPercent(clicked,read),metric:true}]}
  ],onChange:key=>{const [type,value]=key.split("|");setMessageSendStatFilter(type,value);}});

  listPage.innerHTML=`
    ${renderMessageSendBatchTitleRow()}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-send-search-grid",queryFn:"syncMessageAdminFilters('send')",resetFn:"resetMessageAdminFilters('send')"})}
    ${statsHtml}
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
  {key:"biz",title:"业务分类",width:160,align:"center",render:x=>tag(x.biz,"blue")},
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
  {key:"batchNo",title:"发送批次号",width:180,align:"left",render:x=>x.batchNo?`<a class="link" onclick="openMessageBatchDetail('${x.batchNo}')">${x.batchNo}</a>`:"--"},
  {key:"channel",title:"发送通道",width:120,align:"center",render:x=>x.channel||"--"},
  {key:"failReason",title:"失败原因",width:180,align:"left",render:x=>x.failReason||"--"},
  {key:"operation",title:"操作",width:120,align:"center",render:x=>`<a class="link" onclick="openMessageRecordDetail('${x.id}')">查看</a> ${x.deliverStatus==="发送失败"?`<a class="link" onclick="retryMessageRecord('${x.id}')">重发</a>`:""}`}
];

function messageTodoBizTag(value){
  const colorMap={安全管理:"orange",生产管理:"blue",劳务管理:"green",设备管理:"red",产值管理:"blue",基础管理:"gray"};
  return tag(value,colorMap[value]||"blue");
}

function getMessageTodoReminderBatchNo(row){
  return `TR${String(row.batchNo||row.id).replace(/\D/g,"").slice(-12).padStart(12,"0")}`;
}

function ensureMessageTodoReminderRecords(row){
  const batchNo=getMessageTodoReminderBatchNo(row);
  if(messageRecordData.some(record=>record.batchNo===batchNo))return batchNo;
  for(let index=0;index<row.reminders;index+=1){
    const read=index<Math.max(0,row.reminders-1);
    const clicked=index<Math.max(0,row.reminders-2);
    const hour=String(9+index).padStart(2,"0");
    messageRecordData.push({
      id:`todo-reminder-${row.id}-${index+1}`,batchNo,receiver:row.receiver,account:`todo${String(row.id).replace(/\D/g,"")}${index+1}`,
      org:row.org,project:row.project,post:row.post,type:"预警通知",biz:row.biz,
      title:`待办超期提醒（第${index+1}次）`,content:`${row.todoTitle}已超期${formatApprovalFlowDuration(row.overdueHours)}，请尽快完成办理。`,channel:"站内信",
      deliverStatus:"发送成功",deliverTime:`2026-07-${String(26+Math.min(index,4)).padStart(2,"0")} ${hour}:00:02`,sendTime:`2026-07-${String(26+Math.min(index,4)).padStart(2,"0")} ${hour}:00:02`,
      readStatus:read?"已读":"未读",readTime:read?`2026-07-${String(26+Math.min(index,4)).padStart(2,"0")} ${hour}:12:18`:"",
      clickStatus:clicked?"已点击":"未点击",clickTime:clicked?`2026-07-${String(26+Math.min(index,4)).padStart(2,"0")} ${hour}:13:06`:"",failReason:""
    });
  }
  return batchNo;
}

function openMessageTodoReminderDrilldown(id){
  const row=messageTodoReachRecordData.find(item=>item.id===id);
  if(!row)return;
  const batchNo=ensureMessageTodoReminderRecords(row);
  openSendRecordDrilldown(batchNo,"sent");
  modalTitle.innerText="超期提醒消息明细";
}

window.openMessageTodoReminderDrilldown=openMessageTodoReminderDrilldown;

tableColumnDefinitions.messageTodoReach=[
  {key:"index",title:"序号",width:70,align:"center",render:(x,i)=>i+1},
  {key:"biz",title:"业务分类",width:160,align:"center",render:x=>messageTodoBizTag(x.biz)},
  {key:"todoTitle",title:"待办标题",width:220,align:"left",render:x=>x.todoTitle||"--"},
  {key:"todoContent",title:"待办内容",width:300,align:"left",render:x=>`<span class="message-admin-ellipsis">${x.todoContent||"--"}</span>`},
  {key:"receiver",title:"接收人",width:120,align:"left",render:x=>x.receiver||"--"},
  {key:"org",title:"接收人组织",width:170,align:"left",render:x=>x.org||"--"},
  {key:"project",title:"接收人项目",width:190,align:"left",render:x=>x.project||"--"},
  {key:"post",title:"接收人岗位",width:130,align:"left",render:x=>x.post||"--"},
  {key:"deliverStatus",title:"送达状态",width:110,align:"center",render:x=>messageStatusTag(x.deliverStatus||"--")},
  {key:"deliverTime",title:"送达时间",width:165,align:"center",render:x=>x.deliverTime||"--"},
  {key:"readStatus",title:"阅读状态",width:100,align:"center",render:x=>messageStatusTag(x.readStatus||"--")},
  {key:"readTime",title:"阅读时间",width:165,align:"center",render:x=>x.readTime||"--"},
  {key:"clickStatus",title:"点击状态",width:100,align:"center",render:x=>messageStatusTag(x.clickStatus||"--")},
  {key:"clickTime",title:"点击时间",width:165,align:"center",render:x=>x.clickTime||"--"},
  {key:"handleStatus",title:"办理状态",width:100,align:"center",render:x=>messageStatusTag(x.handleStatus||"--")},
  {key:"handleTime",title:"办理时间",width:165,align:"center",render:x=>x.handleTime||"--"},
  {key:"overdue",title:"是否超期",width:100,align:"center",render:x=>tag(x.overdue,x.overdue==="是"?"red":"green")},
  {key:"overdueDuration",title:"超期时长",width:100,align:"center",render:x=>formatApprovalFlowDuration(x.overdueHours)},
  {key:"reminders",title:"超期提醒次数",width:120,align:"center",render:x=>`<button type="button" class="link approval-flow-reminder-link" data-todo-reminder-id="${x.id}" onclick="openMessageTodoReminderDrilldown('${x.id}')">${x.reminders}</button>`},
  {key:"batchNo",title:"发送批次号",width:180,align:"left",render:x=>x.batchNo?`<a class="link" onclick="openMessageBatchDetail('${x.batchNo}')">${x.batchNo}</a>`:"--"},
  {key:"failReason",title:"失败原因",width:200,align:"left",render:x=>x.failReason||"--"},
  {key:"operation",title:"操作",width:150,align:"center",render:x=>`<a class="link" onclick="openMessageTodoReachDetail('${x.id}')">查看</a>${x.deliverStatus==="送达失败"?` <a class="link" onclick="retryMessageTodoReach('${x.id}')">重新推送</a>`:""}`}
];

function renderMessageRecordBizFilterTreeSelect(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgRecordBizTreeFilter",tree,"请选择业务分类",messageAdminState.recordBizList||[]);
}
function renderMessageTodoBizFilterTreeSelect(){
  const tree=messageBizDictionary.map(group=>({label:group.name,value:group.name,children:group.children.map(child=>({label:child,value:`${group.name} / ${child}`}))}));
  return renderTemplateCheckTreeSelect("msgTodoBizTreeFilter",tree,"请选择业务分类",messageAdminState.todoBizList||[]);
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

function setMessageRecordTab(tab){
  if(tab!=="message"&&tab!=="todo")return;
  messageAdminState.recordTab=tab;
  renderMessageRecordPage();
}

function renderMessageRecordTitleRow(){
  const activeTab=messageAdminState.recordTab==="todo"?"todo":"message";
  const title=activeTab==="todo"?"待办触达明细":"消息发送明细";
  return `
    <div class="compact-title-row output-forecast-title-row message-record-title-row">
      <div class="module-title">消息&待办管理 / ${title}</div>
    </div>
  `;
}

function setMessageTodoStatFilter(type,value){
  const keyMap={deliver:"todoDeliver",read:"todoRead",click:"todoClick",handle:"todoHandle",overdue:"todoOverdue"};
  const key=keyMap[type];
  if(!key)return;
  messageAdminState[key]=messageAdminState[key]===value?"":value;
  renderMessageRecordPage();
}

function renderMessageTodoStatItem(filterType,value,count,label){
  const keyMap={deliver:"todoDeliver",read:"todoRead",click:"todoClick",handle:"todoHandle",overdue:"todoOverdue"};
  const active=messageAdminState[keyMap[filterType]]===value;
  return `<button class="message-stat-option ${active?'active':''}" onclick="setMessageTodoStatFilter('${filterType}','${value}')"><strong>${count}</strong><span>${label}</span></button>`;
}

function matchesMessageTodoOverdueStat(row,stat){
  if(stat==="dueSoon")return row.dueSoon&&!row.overdueHours;
  if(stat==="overdue")return row.overdueHours>0;
  if(stat==="overdue3")return row.overdueHours>=72;
  if(stat==="overdue7")return row.overdueHours>=168;
  return true;
}

function renderMessageTodoOverdueStatItem(key,label,rows){
  return renderMessageTodoStatItem("overdue",key,rows.filter(row=>matchesMessageTodoOverdueStat(row,key)).length,label);
}

function getMessageDetailOrgCount(scope,orgId){
  const node=findOrgById(orgId)?.node;
  const names=new Set(getUnifiedOrgDescendantNames(node,[]));
  const rows=scope==="todo"
    ?filterMessageTodoStats(getMessageTodoReachBaseFiltered())
    :filterMessageRecordStats(getMessageRecordBaseFiltered());
  return rows.filter(row=>names.has(row.org)).length;
}

function renderMessageDetailOrgNodes(scope,node=orgTreeData,level=1){
  const keyword=scope==="todo"?messageAdminState.todoOrgKeyword:messageAdminState.recordOrgKeyword;
  const activeId=scope==="todo"?messageAdminState.todoOrgId:messageAdminState.recordOrgId;
  if(!unifiedOrgTreeMatches(node,keyword))return "";
  const safeId=escapeAttr(node.id);
  return `
    <div class="org-tree-node org-level-indent-${Math.min(level,5)} ${activeId===node.id?"active":""}" onclick="selectMessageDetailOrg('${scope}','${safeId}')">
      <div class="org-node-left"><span class="approval-flow-org-level-icon" title="${level===1?"集团":level===2?"子公司":"分公司"}">${getUnifiedOrgTreeIcon(level)}</span><span class="org-node-name" title="${escapeAttr(node.name)}">${node.name}</span></div>
      <span class="approval-flow-org-count">${getMessageDetailOrgCount(scope,node.id)}</span>
    </div>
    ${(node.children||[]).map(child=>renderMessageDetailOrgNodes(scope,child,level+1)).join("")}`;
}

function renderMessageDetailOrgPanel(scope){
  const aggregate=scope==="todo"?messageAdminState.todoOrgAggregate:messageAdminState.recordOrgAggregate;
  const keyword=scope==="todo"?messageAdminState.todoOrgKeyword:messageAdminState.recordOrgKeyword;
  if(!aggregate)return "";
  return `<section class="org-tree-panel approval-flow-org-panel unified-org-tree-panel">
    <div class="org-tree-hd"><div class="card-title">组织树</div></div>
    <div class="unified-org-tree-search"><input class="input" value="${escapeAttr(keyword)}" placeholder="请输入组织名称" oninput="filterMessageDetailOrgTree('${scope}',this.value)"/></div>
    <div class="org-tree-body" id="${scope}MessageDetailOrgTreeBody">${renderMessageDetailOrgNodes(scope)}</div>
  </section>`;
}

function renderMessageDetailAggregateSwitch(scope){
  const checked=scope==="todo"?messageAdminState.todoOrgAggregate:messageAdminState.recordOrgAggregate;
  return `<label class="message-switch approval-flow-aggregate-switch">
    <span>按组织聚合</span>
    <input type="checkbox" ${checked?"checked":""} onchange="toggleMessageDetailOrgAggregate('${scope}',this.checked)"/>
    <i></i>
  </label>`;
}

function filterMessageDetailOrgTree(scope,keyword){
  if(scope==="todo")messageAdminState.todoOrgKeyword=String(keyword||"");
  else messageAdminState.recordOrgKeyword=String(keyword||"");
  const body=document.getElementById(`${scope}MessageDetailOrgTreeBody`);
  if(body)body.innerHTML=renderMessageDetailOrgNodes(scope)||'<div class="unified-org-tree-empty">暂无匹配的组织</div>';
}

function toggleMessageDetailOrgAggregate(scope,checked){
  captureMessageDetailFilters(scope);
  if(scope==="todo"){
    messageAdminState.todoOrgAggregate=Boolean(checked);
    messageAdminState.todoOrgId=orgTreeData.id;
  }else{
    messageAdminState.recordOrgAggregate=Boolean(checked);
    messageAdminState.recordOrgId=orgTreeData.id;
  }
  renderMessageRecordPage();
}

function selectMessageDetailOrg(scope,orgId){
  if(scope==="todo")messageAdminState.todoOrgId=orgId;
  else messageAdminState.recordOrgId=orgId;
  renderMessageRecordPage();
}

function renderMessageTodoReachPage(){
  window.openMessageTodoReminderDrilldown=openMessageTodoReminderDrilldown;
  const list=getMessageTodoReachFiltered();
  const all=getMessageTodoReachScopedRows();
  const queryFields=`
    <div class="form-item"><label>业务分类</label>${renderMessageTodoBizFilterTreeSelect()}</div>
    <div class="form-item"><label>待办标题</label><input class="input" id="msgTodoTitle" placeholder="请输入待办标题" value="${escapeAttr(messageAdminState.todoTitle||'')}"/></div>
    <div class="form-item"><label>接收人</label><input class="input" id="msgTodoReceiver" placeholder="请输入接收人姓名" value="${escapeAttr(messageAdminState.todoReceiver||'')}"/></div>
    <div class="form-item"><label>送达状态</label><select class="select" id="msgTodoDeliver"><option value="">全部</option><option>已送达</option><option>送达失败</option></select></div>
    <div class="form-item"><label>阅读状态</label><select class="select" id="msgTodoRead"><option value="">全部</option><option>未读</option><option>已读</option></select></div>
    <div class="form-item"><label>点击状态</label><select class="select" id="msgTodoClick"><option value="">全部</option><option>未点击</option><option>已点击</option></select></div>
    <div class="form-item"><label>办理状态</label><select class="select" id="msgTodoHandle"><option value="">全部</option><option>未办理</option><option>办理中</option><option>已办理</option></select></div>
  `;
  const todoStatEntries=[["deliver",messageAdminState.todoDeliver],["read",messageAdminState.todoRead],["click",messageAdminState.todoClick],["handle",messageAdminState.todoHandle],["overdue",messageAdminState.todoOverdue]];
  const activeTodoStat=todoStatEntries.find(([,value])=>value);
  const statsHtml=StatisticsFilter.render({id:"message-todo-reach-statistics-filter",activeKey:activeTodoStat?`${activeTodoStat[0]}|${activeTodoStat[1]}`:"",groups:[
    {label:"送达状态",items:[{key:"deliver|已送达",label:"已送达",value:all.filter(x=>x.deliverStatus==="已送达").length},{key:"deliver|送达失败",label:"送达失败",value:all.filter(x=>x.deliverStatus==="送达失败").length}]},
    {label:"阅读状态",items:[{key:"read|未读",label:"未读",value:all.filter(x=>x.readStatus==="未读").length},{key:"read|已读",label:"已读",value:all.filter(x=>x.readStatus==="已读").length}]},
    {label:"点击状态",items:[{key:"click|未点击",label:"未点击",value:all.filter(x=>x.clickStatus==="未点击").length},{key:"click|已点击",label:"已点击",value:all.filter(x=>x.clickStatus==="已点击").length}]},
    {label:"办理状态",items:[{key:"handle|未办理",label:"未办理",value:all.filter(x=>x.handleStatus==="未办理").length},{key:"handle|办理中",label:"办理中",value:all.filter(x=>x.handleStatus==="办理中").length},{key:"handle|已办理",label:"已办理",value:all.filter(x=>x.handleStatus==="已办理").length}]},
    {label:"超期状态",items:[["dueSoon","即将超期"],["overdue","已超期"],["overdue3","超期3天以上"],["overdue7","超期7天以上"]].map(([key,label])=>({key:`overdue|${key}`,label,value:all.filter(row=>matchesMessageTodoOverdueStat(row,key)).length}))}
  ],onChange:key=>{const [type,value]=key.split("|");setMessageTodoStatFilter(type,value);}});
  const tableCard=renderUnifiedTableCard({
    title:"待办触达明细",
    tableKey:"messageTodoReach",
    tableId:"messageTodoReachTable",
    theadId:"messageTodoReachThead",
    tbodyId:"messageTodoReachTbody",
    totalId:"messageTodoReachTotalText",
    total:list.length,
    beforeActions:renderMessageDetailAggregateSwitch("todo"),
    renderFnName:"renderMessageRecordPage",
    refreshAction:"renderMessageRecordPage();showToast('已刷新待办触达数据')",
    exportAction:"showToast('导出成功：待办触达明细.xlsx')"
  });

  listPage.innerHTML=`
    ${renderMessageRecordTitleRow()}
    ${renderUnifiedQueryCard(queryFields,{id:"messageTodoQueryCard",gridClass:"search-grid message-record-search-grid",queryFn:"syncMessageAdminFilters('todo')",resetFn:"resetMessageAdminFilters('todo')"})}
    ${statsHtml}
    <div class="approval-flow-detail-layout ${messageAdminState.todoOrgAggregate?"has-org":""}">
      ${renderMessageDetailOrgPanel("todo")}
      ${tableCard}
    </div>
  `;
  setSelectValue("msgTodoDeliver",messageAdminState.todoDeliver);
  setSelectValue("msgTodoRead",messageAdminState.todoRead);
  setSelectValue("msgTodoClick",messageAdminState.todoClick);
  setSelectValue("msgTodoHandle",messageAdminState.todoHandle);
  renderTableByColumns("messageTodoReach",list,"messageTodoReachTbody");
  document.getElementById("messageTodoReachTbody")?.addEventListener("click",event=>{
    const trigger=event.target.closest?.("[data-todo-reminder-id]");
    if(trigger)openMessageTodoReminderDrilldown(trigger.dataset.todoReminderId);
  });
  setTimeout(()=>refreshTemplateTreeStates("msgTodoBizTreeFilter"),0);
}

function openMessageSendDetailPage(){
  messageAdminState.recordTab="message";
  renderMessageRecordPage();
}

function openMessageTodoReachDetailPage(){
  messageAdminState.recordTab="todo";
  renderMessageRecordPage();
}

function renderMessageRecordPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  messageAdminState.recordTab=messageAdminState.recordTab==="todo"?"todo":"message";
  if(messageAdminState.recordTab==="todo"){
    renderMessageTodoReachPage();
    return;
  }
  const list=getMessageRecordFiltered();
  const all=getMessageRecordScopedRows();
  const success=all.filter(x=>x.deliverStatus==="发送成功").length;
  const failed=all.filter(x=>x.deliverStatus==="发送失败").length;
  const unread=all.filter(x=>x.readStatus==="未读").length;
  const read=all.filter(x=>x.readStatus==="已读").length;
  const unclicked=all.filter(x=>x.clickStatus==="未点击").length;
  const clicked=all.filter(x=>x.clickStatus==="已点击").length;
  const queryFields=`
    <div class="form-item"><label>消息类型</label><select class="select" id="msgRecordType"><option value="">全部</option><option>消息通知</option><option>预警通知</option><option>通知公告</option></select></div>
    <div class="form-item"><label>消息标题</label><input class="input" id="msgRecordTitle" placeholder="请输入消息标题" value="${messageAdminState.recordTitle||''}"/></div>
    <div class="form-item"><label>消息内容</label><input class="input" id="msgRecordContent" placeholder="请输入消息内容" value="${messageAdminState.recordContent||''}"/></div>
    <div class="form-item"><label>业务分类</label>${renderMessageRecordBizFilterTreeSelect()}</div>
    <div class="form-item"><label>接收人姓名</label><input class="input" id="msgRecordReceiver" placeholder="请输入接收人姓名" value="${messageAdminState.recordReceiver||''}"/></div>
    <div class="form-item"><label>接收人组织</label><input class="input" id="msgRecordOrg" placeholder="请输入接收人组织" value="${messageAdminState.recordOrg||''}"/></div>
    <div class="form-item"><label>接收人项目</label><input class="input" id="msgRecordProject" placeholder="请输入接收人项目" value="${messageAdminState.recordProject||''}"/></div>
    <div class="form-item"><label>接收人岗位</label><input class="input" id="msgRecordPost" placeholder="请输入接收人岗位" value="${messageAdminState.recordPost||''}"/></div>
  `;
  const recordStatEntries=[["deliver",messageAdminState.recordDeliver],["read",messageAdminState.recordRead],["click",messageAdminState.recordClick]];
  const activeRecordStat=recordStatEntries.find(([,value])=>value);
  const statsHtml=StatisticsFilter.render({id:"message-record-statistics-filter",activeKey:activeRecordStat?`${activeRecordStat[0]}|${activeRecordStat[1]}`:"",groups:[
    {label:"送达状态",items:[{key:"deliver|发送成功",label:"发送成功",value:success},{key:"deliver|发送失败",label:"发送失败",value:failed}]},
    {label:"阅读状态",items:[{key:"read|未读",label:"未读",value:unread},{key:"read|已读",label:"已读",value:read}]},
    {label:"点击状态",items:[{key:"click|未点击",label:"未点击",value:unclicked},{key:"click|已点击",label:"已点击",value:clicked}]}
  ],onChange:key=>{const [type,value]=key.split("|");setMessageRecordStatFilter(type,value);}});
  const tableCard=renderUnifiedTableCard({
    title:"消息发送明细",
    tableKey:"messageRecord",
    tableId:"messageRecordTable",
    theadId:"messageRecordThead",
    tbodyId:"messageRecordTbody",
    totalId:"messageRecordTotalText",
    total:list.length,
    beforeActions:renderMessageDetailAggregateSwitch("record"),
    renderFnName:"renderMessageRecordPage",
    refreshAction:"renderMessageRecordPage();showToast('已刷新消息记录数据')",
    exportAction:"showToast('导出成功：消息记录.xlsx')"
  });

  listPage.innerHTML=`
    ${renderMessageRecordTitleRow()}
    ${renderUnifiedQueryCard(queryFields,{gridClass:"search-grid message-record-search-grid",queryFn:"syncMessageAdminFilters('record')",resetFn:"resetMessageAdminFilters('record')"})}
    ${statsHtml}
    <div class="approval-flow-detail-layout ${messageAdminState.recordOrgAggregate?"has-org":""}">
      ${renderMessageDetailOrgPanel("record")}
      ${tableCard}
    </div>
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
              <option value="person">指定人员</option>
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
              <option value="person">指定人员</option>
              <option value="dynamic">动态参数</option>
            </select>
          </label>

          <div class="template-field todo-advanced-row2 todo-overdue-target-picker" id="msgTplOverdueTargetPicker" style="display:none;grid-row:2;grid-column:4">
            ${renderTemplateTargetPicker("post").replaceAll("msgTplTargetValue","msgTplOverdueTargetValue")}
          </div>

        </div>
      </section>
    </div>
  `,isCreateMode?`<button class="btn" onclick="closeModal()">取消</button><button class="btn" onclick="showToast('预览：PC和移动端消息样式已生成')">预览</button><button class="btn primary" onclick="saveMessageTemplateSendForm()">保存</button>`:`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveMessageTemplateConfigForm()">保存模板</button>`,"large");
  updateTemplateTitleCount();
  modalBox.classList.add("message-template-modal");
  syncTemplateTriggerRule();
  selectMessageTemplateType("消息通知");
  if(isSendMode)syncMessageTemplateSendTemplate();
  setTimeout(()=>{refreshTemplateTreeStates("msgTplTargetValue");updateTemplateCheckTreeValue("msgTplTargetValue");},0);
}

function saveMessageTemplateConfigForm(){
  const targetType=document.getElementById("msgTplTargetType")?.value || "post";
  if(targetType==="person" && typeof getMessagePersonPickerValues==="function" && !getMessagePersonPickerValues("msgTplTargetValue").length){
    showToast("请选择接收人员");
    return;
  }
  closeModal();
  showToast("模板已保存");
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
    <div class="tpl-tree-control" onclick="toggleTemplateTreeDropdown('${id}')"><span class="tpl-tree-value">${selectedText}</span>${renderTDesignIcon("chevron-down",{size:16,className:"tpl-tree-control-arrow"})}</div>
    <div class="tpl-tree-dropdown" onclick="event.stopPropagation()"><div class="tpl-tree-search-row"><span>请选择</span></div>${rows}</div>
  </div>`;
}

function renderMessageRouteMultiSelectTags(id,selected=[]){
  if(!selected.length)return "";
  const first=selected[0];
  const safeValue=escapeTplAttr(first.value);
  const safeLabel=escapeTplAttr(first.label);
  const safeTitle=escapeTplAttr(first.path || first.label);
  return `<span class="base-multi-select__tag message-route-selection-tag" data-value="${safeValue}" title="${safeTitle}">
    <span class="base-multi-select__tag-text">${safeLabel}</span>
    <button class="base-multi-select__tag-remove" type="button" title="移除${safeLabel}" aria-label="移除${safeLabel}" data-value="${safeValue}" onclick="removeMessageRouteMultiTag(event,'${id}',this.dataset.value)">${renderTDesignIcon("close",{size:12})}</button>
  </span>${selected.length>1?`<span class="base-multi-select__tag message-route-selection-tag message-route-count-tag">+${selected.length-1}</span>`:""}`;
}

function renderMessageRouteMultiSelect(id,options=[],selected=[],config={}){
  const normalized=(options||[]).map(option=>{
    const value=typeof option==="string"?option:(option.value ?? option.label ?? "");
    const label=typeof option==="string"?option:(option.label ?? option.value ?? "");
    return {value:String(value),label:String(label)};
  }).filter(option=>option.value);
  const placeholder=config.placeholder || "请选择岗位";
  const searchLabel=config.searchLabel || "搜索岗位";
  const selectedSet=new Set((selected||[]).map(String));
  const selectedOptions=normalized.filter(option=>selectedSet.has(option.value));
  const allSelected=normalized.length>0 && selectedOptions.length===normalized.length;
  const partlySelected=selectedOptions.length>0 && !allSelected;
  return `<div id="${id}" class="base-multi-select message-route-multi-select" data-placeholder="${escapeTplAttr(placeholder)}">
    <div class="base-multi-select__control" tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded="false" onclick="toggleMessageRouteMultiSelect(event,'${id}')">
      <div class="base-multi-select__tags">
        ${renderMessageRouteMultiSelectTags(id,selectedOptions)}
        <input class="base-multi-select__input" value="" placeholder="${selectedOptions.length?"":escapeTplAttr(placeholder)}" aria-label="${escapeTplAttr(searchLabel)}" onclick="event.stopPropagation();openMessageRouteMultiSelect('${id}')" oninput="filterMessageRouteMultiSelect('${id}',this.value)" onkeydown="handleMessageRouteMultiKey(event,'${id}')"/>
      </div>
      <button class="message-route-multi-select__clear" type="button" title="清空已选" aria-label="清空已选" ${selectedOptions.length?"":"hidden"} onclick="clearMessageRouteMultiSelect(event,'${id}')">${renderTDesignIcon("close",{size:14})}</button>
      <span class="base-multi-select__arrow" aria-hidden="true"></span>
    </div>
    <div class="base-multi-select__dropdown" role="listbox" aria-multiselectable="true" style="display:none" onclick="event.stopPropagation()">
      <button type="button" class="base-multi-select__option message-route-select-all ${allSelected?"is-selected":""} ${partlySelected?"is-indeterminate":""}" role="option" aria-selected="${allSelected}" onclick="toggleAllMessageRouteOptions('${id}')">
        <span class="base-multi-select__label">全部</span><span class="base-multi-select__checkbox"></span>
      </button>
      ${normalized.map(option=>{
        const safeValue=escapeTplAttr(option.value);
        const safeLabel=escapeTplAttr(option.label);
        const isSelected=selectedSet.has(option.value);
        return `<button type="button" class="base-multi-select__option ${isSelected?"is-selected":""}" role="option" aria-selected="${isSelected}" data-value="${safeValue}" data-label="${safeLabel}" onclick="toggleMessageRouteMultiOption('${id}',this)">
          <span class="base-multi-select__label">${safeLabel}</span><span class="base-multi-select__checkbox"></span>
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

function renderMessageRouteSingleSelect(id,options=[],config={}){
  const normalized=(options||[]).map(option=>{
    const value=typeof option==="string"?option:(option.value ?? option.label ?? "");
    const label=typeof option==="string"?option:(option.label ?? option.value ?? "");
    return {value:String(value),label:String(label)};
  }).filter(option=>option.value);
  const selectedValue=String(config.selectedValue || normalized[0]?.value || "");
  const ariaLabel=escapeTplAttr(config.ariaLabel || "选择动态参数");
  return `<select class="select message-route-single-select" id="${id}" aria-label="${ariaLabel}">
    ${normalized.map(option=>`<option value="${escapeTplAttr(option.value)}" ${option.value===selectedValue?"selected":""}>${escapeTplAttr(option.label)}</option>`).join("")}
  </select>`;
}

function getMessageOrganizationRouteTree(){
  if(typeof orgTreeData==="undefined" || !orgTreeData)return [];
  const mapNode=(node,level=1,parentPath="")=>{
    if(!node || level>3)return null;
    const label=String(node.name || node.shortName || node.code || "");
    const path=parentPath?`${parentPath} / ${label}`:label;
    const children=(node.children||[]).map(child=>mapNode(child,level+1,path)).filter(Boolean);
    return {
      value:String(node.code || node.id || label),
      label,
      path,
      level,
      children
    };
  };
  const root=mapNode(orgTreeData);
  return root?[root]:[];
}

function flattenMessageOrganizationRouteTree(nodes,result=[]){
  (nodes||[]).forEach(node=>{
    result.push(node);
    flattenMessageOrganizationRouteTree(node.children,result);
  });
  return result;
}

function getMessageOrganizationSelectionState(tree,flat,selected=[]){
  const selectedSet=new Set();
  const indeterminateSet=new Set();
  const selectNode=node=>{
    selectedSet.add(node.value);
    (node.children||[]).forEach(selectNode);
  };
  (selected||[]).map(String).forEach(value=>{
    const labelMatches=flat.filter(option=>option.label===value);
    const matched=flat.find(option=>option.value===value)
      || flat.find(option=>option.path===value)
      || (labelMatches.length===1?labelMatches[0]:null);
    if(matched)selectNode(matched);
  });
  const syncNode=node=>{
    if(!node.children?.length)return selectedSet.has(node.value)?"selected":"empty";
    const childStates=node.children.map(syncNode);
    const allSelected=childStates.every(state=>state==="selected");
    const anySelected=childStates.some(state=>state!=="empty");
    selectedSet.delete(node.value);
    indeterminateSet.delete(node.value);
    if(allSelected)selectedSet.add(node.value);
    else if(anySelected)indeterminateSet.add(node.value);
    return allSelected?"selected":anySelected?"indeterminate":"empty";
  };
  (tree||[]).forEach(syncNode);
  return {selectedSet,indeterminateSet};
}

function renderMessageOrganizationRouteNodes(id,nodes,selectedSet,indeterminateSet,level=1){
  return (nodes||[]).map(node=>{
    const safeValue=escapeTplAttr(node.value);
    const safeLabel=escapeTplAttr(node.label);
    const safePath=escapeTplAttr(node.path);
    const hasChildren=!!node.children?.length;
    const isSelected=selectedSet.has(node.value);
    const isIndeterminate=indeterminateSet.has(node.value);
    return `<div class="message-route-tree-item ${hasChildren&&level>1?"is-collapsed":""}" data-route-tree-item data-level="${level}" data-search="${safeLabel}">
      <button type="button" class="base-multi-select__option message-route-tree-option ${isSelected?"is-selected":""} ${isIndeterminate?"is-indeterminate":""}" role="option" aria-selected="${isSelected}" aria-checked="${isIndeterminate?"mixed":isSelected}" data-value="${safeValue}" data-label="${safeLabel}" data-path="${safePath}" style="--tree-level:${level}" onclick="toggleMessageRouteMultiOption('${id}',this)">
        <span class="message-route-tree-toggle ${hasChildren?"":"is-placeholder"}" role="button" aria-label="${hasChildren?`展开或收起${safeLabel}`:""}" aria-expanded="${hasChildren&&level===1}" onclick="toggleMessageRouteTreeBranch(event,this)">${hasChildren?"▾":""}</span>
        <span class="unified-org-level-icon" aria-hidden="true">${getUnifiedOrgTreeIcon(level)}</span>
        <span class="base-multi-select__checkbox"></span>
        <span class="base-multi-select__label" title="${safePath}">${safeLabel}</span>
      </button>
      ${hasChildren?`<div class="message-route-tree-children">${renderMessageOrganizationRouteNodes(id,node.children,selectedSet,indeterminateSet,level+1)}</div>`:""}
    </div>`;
  }).join("");
}

function renderMessageOrganizationTreeMultiSelect(id,selected=[]){
  const tree=getMessageOrganizationRouteTree();
  const flat=flattenMessageOrganizationRouteTree(tree,[]);
  const {selectedSet,indeterminateSet}=getMessageOrganizationSelectionState(tree,flat,selected);
  const selectedOptions=flat.filter(option=>selectedSet.has(option.value) && !flat.some(parent=>parent.children?.includes(option) && selectedSet.has(parent.value)));
  return `<div id="${id}" class="base-multi-select message-route-multi-select message-route-org-tree" data-route-mode="org-tree" data-placeholder="请选择组织">
    <div class="base-multi-select__control" tabindex="0" role="combobox" aria-haspopup="tree" aria-expanded="false" onclick="toggleMessageRouteMultiSelect(event,'${id}')">
      <div class="base-multi-select__tags">
        ${renderMessageRouteMultiSelectTags(id,selectedOptions)}
        <input class="base-multi-select__input" value="" placeholder="${selectedOptions.length?"":"请选择组织"}" aria-label="搜索组织" onclick="event.stopPropagation();openMessageRouteMultiSelect('${id}')" oninput="filterMessageRouteMultiSelect('${id}',this.value)" onkeydown="handleMessageRouteMultiKey(event,'${id}')"/>
      </div>
      <button class="message-route-multi-select__clear" type="button" title="清空已选组织" aria-label="清空已选组织" ${selectedOptions.length?"":"hidden"} onclick="clearMessageRouteMultiSelect(event,'${id}')">${renderTDesignIcon("close",{size:14})}</button>
      <span class="base-multi-select__arrow" aria-hidden="true"></span>
    </div>
    <div class="base-multi-select__dropdown message-route-tree-dropdown" role="tree" aria-multiselectable="true" style="display:none" onclick="event.stopPropagation()">
      ${renderMessageOrganizationRouteNodes(id,tree,selectedSet,indeterminateSet)}
      ${flat.length?"":`<div class="base-multi-select__empty">暂无组织数据</div>`}
    </div>
  </div>`;
}

function setMessageOrganizationOptionState(option,selected){
  if(!option)return;
  option.classList.toggle("is-selected",selected);
  option.classList.remove("is-indeterminate");
  const item=option.closest(".message-route-tree-item");
  item?.querySelectorAll(":scope > .message-route-tree-children .message-route-tree-option").forEach(child=>{
    child.classList.toggle("is-selected",selected);
    child.classList.remove("is-indeterminate");
  });
}

function refreshMessageOrganizationRouteStates(box){
  if(!box || box.dataset.routeMode!=="org-tree")return;
  const parents=[...box.querySelectorAll(".message-route-tree-item")].reverse();
  parents.forEach(item=>{
    const parentOption=item.querySelector(":scope > .message-route-tree-option");
    const childOptions=[...item.querySelectorAll(":scope > .message-route-tree-children > .message-route-tree-item > .message-route-tree-option")];
    if(!parentOption || !childOptions.length)return;
    const allSelected=childOptions.every(child=>child.classList.contains("is-selected") && !child.classList.contains("is-indeterminate"));
    const anySelected=childOptions.some(child=>child.classList.contains("is-selected") || child.classList.contains("is-indeterminate"));
    parentOption.classList.toggle("is-selected",allSelected);
    parentOption.classList.toggle("is-indeterminate",anySelected && !allSelected);
  });
}

function getMessageRouteSelectionSummaryOptions(box){
  const selected=[...box.querySelectorAll('.base-multi-select__option[data-value].is-selected')];
  if(box.dataset.routeMode!=="org-tree")return selected;
  return selected.filter(option=>{
    let parentItem=option.closest(".message-route-tree-item")?.parentElement?.closest(".message-route-tree-item");
    while(parentItem){
      const parentOption=parentItem.querySelector(":scope > .message-route-tree-option");
      if(parentOption?.classList.contains("is-selected") && !parentOption.classList.contains("is-indeterminate"))return false;
      parentItem=parentItem.parentElement?.closest(".message-route-tree-item");
    }
    return true;
  });
}

function getMessageRouteMultiSelectValues(id){
  const box=document.getElementById(id);
  if(!box)return [];
  return getMessageRouteSelectionSummaryOptions(box).map(option=>option.dataset.value).filter(Boolean);
}

function getMessageRouteMultiSelectLabels(id){
  const box=document.getElementById(id);
  if(!box)return [];
  const usePath=box.dataset.routeMode==="org-tree";
  return getMessageRouteSelectionSummaryOptions(box)
    .map(option=>(usePath?option.dataset.path:option.dataset.label) || option.dataset.label || option.dataset.value)
    .filter(Boolean);
}

function updateMessageRouteMultiSelect(id){
  const box=document.getElementById(id);
  if(!box)return;
  refreshMessageOrganizationRouteStates(box);
  const options=[...box.querySelectorAll('.base-multi-select__option[data-value]')];
  const selectedOptions=getMessageRouteSelectionSummaryOptions(box);
  const selected=selectedOptions.map(option=>({value:option.dataset.value,label:option.dataset.label||option.dataset.value,path:option.dataset.path||""}));
  const tags=box.querySelector(".base-multi-select__tags");
  const input=box.querySelector(".base-multi-select__input");
  tags?.querySelectorAll(".message-route-selection-tag").forEach(tag=>tag.remove());
  if(input)input.insertAdjacentHTML("beforebegin",renderMessageRouteMultiSelectTags(id,selected));
  if(input){input.value="";input.placeholder=selected.length?"":(box.dataset.placeholder||"请选择");}
  if(box.dataset.routeMode==="org-tree")box.querySelectorAll(".message-route-tree-item").forEach(item=>{item.hidden=false;});
  const clear=box.querySelector(".message-route-multi-select__clear");
  if(clear)clear.hidden=!selected.length;
  const selectAll=box.querySelector(".message-route-select-all");
  const allSelected=options.length>0 && selected.length===options.length;
  selectAll?.classList.toggle("is-selected",allSelected);
  selectAll?.classList.toggle("is-indeterminate",selected.length>0 && !allSelected);
  selectAll?.setAttribute("aria-selected",String(allSelected));
  options.forEach(option=>{
    option.hidden=false;
    const optionSelected=option.classList.contains("is-selected");
    const optionIndeterminate=option.classList.contains("is-indeterminate");
    option.setAttribute("aria-selected",String(optionSelected));
    if(box.dataset.routeMode==="org-tree")option.setAttribute("aria-checked",optionIndeterminate?"mixed":String(optionSelected));
  });
  box.dataset.values=JSON.stringify(selected.map(option=>option.value));
}

function setMessageRouteMultiSelectValues(id,values=[]){
  const box=document.getElementById(id);
  if(!box)return;
  const options=[...box.querySelectorAll('.base-multi-select__option[data-value]')];
  if(box.dataset.routeMode==="org-tree"){
    options.forEach(option=>{
      option.classList.remove("is-selected","is-indeterminate");
    });
    (values||[]).map(String).forEach(value=>{
      const labelMatches=options.filter(option=>option.dataset.label===value);
      const matched=options.find(option=>option.dataset.value===value)
        || options.find(option=>option.dataset.path===value)
        || (labelMatches.length===1?labelMatches[0]:null);
      if(matched)setMessageOrganizationOptionState(matched,true);
    });
    refreshMessageOrganizationRouteStates(box);
    updateMessageRouteMultiSelect(id);
    return;
  }
  const selectedOptions=new Set();
  (values||[]).map(String).forEach(value=>{
    const matched=options.find(option=>option.dataset.value===value)
      || options.find(option=>option.dataset.path===value)
      || options.find(option=>option.dataset.label===value);
    if(matched)selectedOptions.add(matched);
  });
  options.forEach(option=>option.classList.toggle("is-selected",selectedOptions.has(option)));
  updateMessageRouteMultiSelect(id);
}

function positionMessageRouteMultiDropdown(box){
  const control=box?.querySelector(".base-multi-select__control");
  const dropdown=box?.querySelector(".base-multi-select__dropdown");
  if(!control || !dropdown)return;
  const rect=control.getBoundingClientRect();
  const viewportHeight=window.innerHeight || document.documentElement.clientHeight || 800;
  const viewportWidth=window.innerWidth || document.documentElement.clientWidth || 1280;
  const gap=4;
  const dropdownHeight=Math.min(dropdown.scrollHeight||260,260);
  const belowTop=rect.bottom+gap;
  const aboveTop=rect.top-dropdownHeight-gap;
  const top=(belowTop+dropdownHeight<=viewportHeight-12 || aboveTop<12)?belowTop:aboveTop;
  const minWidth=box.classList.contains("message-route-org-tree")?360:260;
  const width=Math.min(Math.max(rect.width,minWidth),Math.max(260,viewportWidth-24));
  const left=Math.min(Math.max(12,rect.left),Math.max(12,viewportWidth-width-12));
  dropdown.style.position="fixed";
  dropdown.style.left=left+"px";
  dropdown.style.top=Math.max(12,top)+"px";
  dropdown.style.width=width+"px";
  dropdown.style.maxHeight="260px";
  dropdown.style.zIndex="200001";
}

function resetMessageRouteMultiDropdown(box){
  const dropdown=box?.querySelector(".base-multi-select__dropdown");
  if(!dropdown)return;
  ["position","left","top","width","maxHeight","zIndex"].forEach(prop=>dropdown.style[prop]="");
}

function closeMessageRouteMultiSelect(box){
  if(!box)return;
  box.classList.remove("is-open");
  box.querySelector(".base-multi-select__control")?.setAttribute("aria-expanded","false");
  const dropdown=box.querySelector(".base-multi-select__dropdown");
  if(dropdown)dropdown.style.display="none";
  resetMessageRouteMultiDropdown(box);
}

function openMessageRouteMultiSelect(id){
  const box=document.getElementById(id);
  if(!box)return;
  document.querySelectorAll(".template-tree-select.open").forEach(tree=>{tree.classList.remove("open");resetTemplateDropdownPosition(tree);});
  document.querySelectorAll(".message-route-multi-select.is-open").forEach(other=>{if(other!==box)closeMessageRouteMultiSelect(other);});
  box.classList.add("is-open");
  box.querySelector(".base-multi-select__control")?.setAttribute("aria-expanded","true");
  const dropdown=box.querySelector(".base-multi-select__dropdown");
  if(dropdown)dropdown.style.display="block";
  positionMessageRouteMultiDropdown(box);
  syncModalDropdownLayer();
}

function toggleMessageRouteMultiSelect(event,id){
  event?.stopPropagation?.();
  const box=document.getElementById(id);
  if(!box)return;
  if(box.classList.contains("is-open")){closeMessageRouteMultiSelect(box);syncModalDropdownLayer();}
  else openMessageRouteMultiSelect(id);
}

function toggleMessageRouteMultiOption(id,option){
  const box=document.getElementById(id);
  if(box?.dataset.routeMode==="org-tree"){
    const shouldSelect=option?.classList.contains("is-indeterminate") || !option?.classList.contains("is-selected");
    setMessageOrganizationOptionState(option,shouldSelect);
    refreshMessageOrganizationRouteStates(box);
  }else{
    option?.classList.toggle("is-selected");
  }
  updateMessageRouteMultiSelect(id);
  openMessageRouteMultiSelect(id);
}

function toggleMessageRouteTreeBranch(event,toggle){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const item=toggle?.closest?.(".message-route-tree-item");
  if(!item || toggle.classList.contains("is-placeholder"))return;
  const collapsed=item.classList.toggle("is-collapsed");
  toggle.setAttribute("aria-expanded",String(!collapsed));
}

function toggleAllMessageRouteOptions(id){
  const box=document.getElementById(id);
  if(!box)return;
  const options=[...box.querySelectorAll('.base-multi-select__option[data-value]')];
  const shouldSelect=!options.length || !options.every(option=>option.classList.contains("is-selected"));
  options.forEach(option=>option.classList.toggle("is-selected",shouldSelect));
  updateMessageRouteMultiSelect(id);
  openMessageRouteMultiSelect(id);
}

function clearMessageRouteMultiSelect(event,id){
  event?.stopPropagation?.();
  setMessageRouteMultiSelectValues(id,[]);
  openMessageRouteMultiSelect(id);
}

function removeMessageRouteMultiTag(event,id,value){
  event?.stopPropagation?.();
  const box=document.getElementById(id);
  const option=[...box?.querySelectorAll('.base-multi-select__option[data-value]')||[]].find(item=>item.dataset.value===value);
  if(box?.dataset.routeMode==="org-tree"){
    setMessageOrganizationOptionState(option,false);
    refreshMessageOrganizationRouteStates(box);
  }else{
    option?.classList.remove("is-selected");
  }
  updateMessageRouteMultiSelect(id);
}

function filterMessageRouteMultiSelect(id,keyword){
  const box=document.getElementById(id);
  if(!box)return;
  const normalized=String(keyword||"").trim().toLowerCase();
  if(box.dataset.routeMode==="org-tree"){
    const items=[...box.querySelectorAll(".message-route-tree-item")];
    if(!normalized){
      items.forEach(item=>{item.hidden=false;});
    }else{
      [...items].reverse().forEach(item=>{
        const ownMatch=String(item.dataset.search||"").toLowerCase().includes(normalized);
        const childMatch=[...item.querySelectorAll(":scope > .message-route-tree-children > .message-route-tree-item")].some(child=>!child.hidden);
        item.hidden=!(ownMatch||childMatch);
        if(childMatch)item.classList.remove("is-collapsed");
      });
    }
    openMessageRouteMultiSelect(id);
    return;
  }
  box.querySelectorAll('.base-multi-select__option[data-value]').forEach(option=>{option.hidden=!!normalized && !String(option.dataset.label||"").toLowerCase().includes(normalized);});
  openMessageRouteMultiSelect(id);
}

function handleMessageRouteMultiKey(event,id){
  if(event.key==="Escape"){
    event.preventDefault();
    closeMessageRouteMultiSelect(document.getElementById(id));
    syncModalDropdownLayer();
  }
}

const messagePersonPickerState={
  targetId:"",
  activeOrgId:"",
  orgKeyword:"",
  keyword:"",
  page:1,
  pageSize:50,
  draftSelectedIds:[],
  expandedOrgIds:new Set()
};

function getMessagePersonPickerUsers(){
  return typeof orgUserData==="undefined"?[]:orgUserData;
}

function getMessagePersonOrgPath(orgId){
  const names=[];
  let found=typeof findOrgById==="function"?findOrgById(orgId):null;
  while(found?.node){
    names.unshift(found.node.name || found.node.shortName || found.node.code || "");
    if(!found.parent)break;
    found=findOrgById(found.parent.id);
  }
  return names.filter(Boolean).join(" / ");
}

function resolveMessagePersonPickerIds(values=[]){
  const users=getMessagePersonPickerUsers().filter(user=>user.status!=="禁用");
  const result=[];
  (values||[]).map(value=>String(value||"").trim()).filter(Boolean).forEach(value=>{
    const direct=users.find(user=>String(user.id)===value);
    if(direct){
      if(!result.includes(direct.id))result.push(direct.id);
      return;
    }
    const matches=users.filter(user=>{
      const fullLabel=`${getMessagePersonOrgPath(user.orgId)} / ${user.name}`;
      return user.name===value || user.username===value || fullLabel===value;
    });
    if(matches.length===1 && !result.includes(matches[0].id))result.push(matches[0].id);
  });
  return result;
}

function getMessagePersonPickerSelectedUsers(id){
  const box=document.getElementById(id);
  if(!box)return [];
  let values=[];
  try{values=JSON.parse(box.dataset.values||"[]");}catch(error){values=[];}
  const selectedIds=new Set(resolveMessagePersonPickerIds(values));
  return getMessagePersonPickerUsers().filter(user=>selectedIds.has(user.id));
}

function renderMessagePersonPickerTags(id,users=[]){
  if(!users.length)return "";
  const first=users[0];
  const safeId=escapeTplAttr(first.id);
  const safeName=escapeTplAttr(first.name);
  const safeTitle=escapeTplAttr(`${getMessagePersonOrgPath(first.orgId)} / ${first.name}`);
  return `<span class="base-multi-select__tag message-route-selection-tag" data-value="${safeId}" title="${safeTitle}">
    <span class="base-multi-select__tag-text">${safeName}</span>
    <button class="base-multi-select__tag-remove" type="button" title="移除${safeName}" aria-label="移除${safeName}" data-value="${safeId}" onclick="removeMessagePersonPickerTag(event,'${id}',this.dataset.value)">${renderTDesignIcon("close",{size:12})}</button>
  </span>${users.length>1?`<span class="base-multi-select__tag message-route-selection-tag message-route-count-tag">+${users.length-1}</span>`:""}`;
}

function renderMessagePersonPickerControl(id,selectedIds=[]){
  const selectedSet=new Set(resolveMessagePersonPickerIds(selectedIds));
  const users=getMessagePersonPickerUsers().filter(user=>selectedSet.has(user.id));
  return `<div class="base-multi-select__control" tabindex="0" role="combobox" aria-haspopup="dialog" aria-expanded="false" onclick="openMessagePersonPicker('${id}')" onkeydown="handleMessagePersonPickerControlKey(event,'${id}')">
    <div class="base-multi-select__tags">
      ${renderMessagePersonPickerTags(id,users)}
      ${users.length?"":`<span class="message-person-picker__placeholder">请选择人员</span>`}
    </div>
    <button class="message-route-multi-select__clear" type="button" title="清空已选人员" aria-label="清空已选人员" ${users.length?"":"hidden"} onclick="clearMessagePersonPicker(event,'${id}')">${renderTDesignIcon("close",{size:14})}</button>
    <span class="base-multi-select__arrow" aria-hidden="true"></span>
  </div>`;
}

function renderMessagePersonPicker(id,selected=[]){
  const selectedIds=resolveMessagePersonPickerIds(selected);
  return `<div id="${id}" class="base-multi-select message-route-multi-select message-person-picker" data-placeholder="请选择人员" data-values="${escapeTplAttr(JSON.stringify(selectedIds))}">
    ${renderMessagePersonPickerControl(id,selectedIds)}
  </div>`;
}

function getMessagePersonPickerValues(id){
  return getMessagePersonPickerSelectedUsers(id).map(user=>user.id);
}

function getMessagePersonPickerLabels(id){
  return getMessagePersonPickerSelectedUsers(id).map(user=>user.name);
}

function setMessagePersonPickerValues(id,values=[]){
  const box=document.getElementById(id);
  if(!box)return;
  const selectedIds=resolveMessagePersonPickerIds(values);
  box.dataset.values=JSON.stringify(selectedIds);
  box.innerHTML=renderMessagePersonPickerControl(id,selectedIds);
}

function clearMessagePersonPicker(event,id){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  setMessagePersonPickerValues(id,[]);
}

function removeMessagePersonPickerTag(event,id,userId){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  setMessagePersonPickerValues(id,getMessagePersonPickerValues(id).filter(value=>value!==userId));
}

function handleMessagePersonPickerControlKey(event,id){
  if(event.key==="Enter" || event.key===" "){
    event.preventDefault();
    openMessagePersonPicker(id);
  }
}

function getMessagePersonOrgDescendantIds(orgId){
  const found=typeof findOrgById==="function"?findOrgById(orgId):null;
  if(!found?.node)return [];
  const result=[];
  const collect=node=>{
    if(!node)return;
    result.push(node.id);
    (node.children||[]).forEach(collect);
  };
  collect(found.node);
  return result;
}

function getMessagePersonOrgUsers(orgId){
  const orgIds=new Set(getMessagePersonOrgDescendantIds(orgId));
  return getMessagePersonPickerUsers().filter(user=>orgIds.has(user.orgId));
}

function messagePersonOrgTreeMatches(node,keyword){
  if(!keyword)return true;
  const normalized=String(keyword).trim().toLowerCase();
  const own=String(node?.name||node?.shortName||node?.code||"").toLowerCase().includes(normalized);
  return own || (node?.children||[]).some(child=>messagePersonOrgTreeMatches(child,normalized));
}

function getMessagePersonPopulatedOrgIds(){
  const directOrgIds=new Set(getMessagePersonPickerUsers().filter(user=>user.status!=="禁用").map(user=>user.orgId));
  const populatedOrgIds=new Set();
  const collect=node=>{
    if(!node)return false;
    const childPopulated=(node.children||[]).map(collect).some(Boolean);
    const populated=directOrgIds.has(node.id)||childPopulated;
    if(populated)populatedOrgIds.add(node.id);
    return populated;
  };
  if(typeof orgTreeData!=="undefined")collect(orgTreeData);
  return populatedOrgIds;
}

function renderMessagePersonOrganizationNodes(node,level=1,populatedOrgIds=getMessagePersonPopulatedOrgIds()){
  if(!node || !populatedOrgIds.has(node.id) || !messagePersonOrgTreeMatches(node,messagePersonPickerState.orgKeyword))return "";
  const visibleChildren=(node.children||[]).filter(child=>populatedOrgIds.has(child.id)&&messagePersonOrgTreeMatches(child,messagePersonPickerState.orgKeyword));
  const hasChildren=visibleChildren.length>0;
  const forceExpand=!!messagePersonPickerState.orgKeyword;
  const expanded=forceExpand || messagePersonPickerState.expandedOrgIds.has(node.id);
  const active=messagePersonPickerState.activeOrgId===node.id;
  const safeId=escapeTplAttr(node.id);
  const safeName=escapeTplAttr(node.name || node.shortName || node.code || "");
  return `<div class="message-person-org-tree-item" data-org-id="${safeId}">
    <div class="org-tree-node message-person-org-node ${active?"active":""}" data-org-id="${safeId}" style="--person-org-level:${level}" onclick="selectMessagePersonOrgNode(this.dataset.orgId)">
      <span class="message-person-org-toggle ${hasChildren?"":"is-placeholder"}" aria-hidden="true" onclick="toggleMessagePersonOrgNode(event,this.closest('.message-person-org-node').dataset.orgId)">${hasChildren?(expanded?"▾":"▸"):""}</span>
      <span class="message-person-org-icon unified-org-level-icon" aria-hidden="true">${getUnifiedOrgTreeIcon(level)}</span>
      <span class="org-node-name" title="${safeName}">${safeName}</span>
    </div>
    ${hasChildren&&expanded?`<div class="message-person-org-children">${visibleChildren.map(child=>renderMessagePersonOrganizationNodes(child,level+1,populatedOrgIds)).join("")}</div>`:""}
  </div>`;
}

function getMessagePersonFilteredUsers(){
  const activeOrgId=messagePersonPickerState.activeOrgId || (typeof orgTreeData!=="undefined"?orgTreeData.id:"");
  const keyword=String(messagePersonPickerState.keyword||"").trim().toLowerCase();
  return getMessagePersonOrgUsers(activeOrgId)
    .filter(user=>{
      if(!keyword)return true;
      return [user.name,user.username,user.phone,getMessagePersonOrgPath(user.orgId),getPostNameById(user.postId),getUserRoleNames(user)]
        .some(value=>String(value||"").toLowerCase().includes(keyword));
    })
    .sort((a,b)=>{
      const orgCompare=getMessagePersonOrgPath(a.orgId).localeCompare(getMessagePersonOrgPath(b.orgId),"zh-CN");
      return orgCompare || String(a.name||"").localeCompare(String(b.name||""),"zh-CN");
    });
}

function getMessagePersonPageData(){
  const list=getMessagePersonFilteredUsers();
  const totalPages=Math.max(1,Math.ceil(list.length/messagePersonPickerState.pageSize));
  messagePersonPickerState.page=Math.min(Math.max(1,messagePersonPickerState.page),totalPages);
  const start=(messagePersonPickerState.page-1)*messagePersonPickerState.pageSize;
  return {list,totalPages,start,pageRows:list.slice(start,start+messagePersonPickerState.pageSize)};
}

function renderMessagePersonPickerModalBody(){
  const active=typeof findOrgById==="function"?findOrgById(messagePersonPickerState.activeOrgId)?.node:null;
  const {list,totalPages,start,pageRows}=getMessagePersonPageData();
  const selectedSet=new Set(messagePersonPickerState.draftSelectedIds);
  const selectableRows=pageRows.filter(user=>user.status!=="禁用");
  const allPageSelected=selectableRows.length>0 && selectableRows.every(user=>selectedSet.has(user.id));
  const partlyPageSelected=!allPageSelected && selectableRows.some(user=>selectedSet.has(user.id));
  return `<div class="message-person-picker-layout">
    <aside class="message-person-picker-org-panel">
      <div class="message-person-picker-panel-title">组织树</div>
      <div class="message-person-picker-org-search">
        <input class="input" id="messagePersonOrgKeyword" value="${escapeTplAttr(messagePersonPickerState.orgKeyword)}" placeholder="请输入组织名称" oninput="filterMessagePersonOrgTree(this.value)"/>
      </div>
      <div class="message-person-picker-org-tree" id="messagePersonOrgTreeBody">
        ${(typeof orgTreeData!=="undefined"?renderMessagePersonOrganizationNodes(orgTreeData):"") || '<div class="message-person-picker-empty">暂无匹配的组织</div>'}
      </div>
    </aside>
    <section class="message-person-picker-user-panel">
      <div class="message-person-picker-user-head">
        <div class="message-person-picker-user-title">
          <strong>${escapeTplAttr(active?.name || "全部组织")}人员</strong>
          <span>共 ${list.length} 人</span>
        </div>
        <div class="message-person-picker-query">
          <input class="input" id="messagePersonKeyword" value="${escapeTplAttr(messagePersonPickerState.keyword)}" placeholder="姓名 / 账号 / 手机号" onkeydown="if(event.key==='Enter')searchMessagePersonPicker()"/>
          <button class="btn" type="button" onclick="resetMessagePersonPickerSearch()">重置</button>
          <button class="btn primary" type="button" onclick="searchMessagePersonPicker()">查询</button>
        </div>
      </div>
      <div class="message-person-picker-selection-bar">
        <span>已选 <strong id="messagePersonSelectedCount">${messagePersonPickerState.draftSelectedIds.length}</strong> 人</span>
        <button class="btn text" type="button" onclick="clearMessagePersonDraftSelection()">清空已选</button>
      </div>
      <div class="table-wrap message-person-picker-table-wrap">
        <table class="message-person-picker-table" style="min-width:1040px">
          <thead><tr>
            <th style="width:52px;text-align:center"><input id="messagePersonPageSelectAll" type="checkbox" ${allPageSelected?"checked":""} data-indeterminate="${partlyPageSelected}" onchange="toggleMessagePersonPageSelection(this.checked)" aria-label="全选当前页人员"/></th>
            <th style="width:70px;text-align:center">序号</th>
            <th style="width:100px">姓名</th>
            <th style="width:70px;text-align:center">性别</th>
            <th style="width:130px">手机号</th>
            <th style="width:120px">账号</th>
            <th style="width:190px">所属组织</th>
            <th style="width:110px">岗位</th>
            <th style="width:130px">角色</th>
            <th style="width:80px;text-align:center">状态</th>
          </tr></thead>
          <tbody>
            ${pageRows.map((user,index)=>{
              const disabled=user.status==="禁用";
              return `<tr class="${disabled?"message-person-picker-row-disabled":""}">
                <td style="text-align:center"><input class="message-person-row-check" type="checkbox" value="${escapeTplAttr(user.id)}" ${selectedSet.has(user.id)?"checked":""} ${disabled?"disabled":""} onchange="toggleMessagePersonSelection(this.value,this.checked)" aria-label="选择${escapeTplAttr(user.name)}"/></td>
                <td style="text-align:center">${start+index+1}</td>
                <td>${escapeTplAttr(user.name)}</td>
                <td style="text-align:center">${escapeTplAttr(user.gender||"-")}</td>
                <td>${escapeTplAttr(typeof maskPhone==="function"?maskPhone(user.phone):user.phone||"-")}</td>
                <td>${escapeTplAttr(user.username||"-")}</td>
                <td title="${escapeTplAttr(getMessagePersonOrgPath(user.orgId))}">${escapeTplAttr(getOrgNameById(user.orgId))}</td>
                <td>${escapeTplAttr(getPostNameById(user.postId))}</td>
                <td>${escapeTplAttr(getUserRoleNames(user))}</td>
                <td style="text-align:center">${user.status==="启用"?tag("启用","green"):tag("禁用","gray")}</td>
              </tr>`;
            }).join("") || '<tr><td colspan="10" class="message-person-picker-empty">暂无人员数据</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="pagination message-person-picker-pagination">
        <span>共 ${list.length} 条</span>
        <div class="pager">
          <button class="btn mini" type="button" ${messagePersonPickerState.page<=1?"disabled":""} onclick="changeMessagePersonPickerPage(-1)">上一页</button>
          <b>第 ${messagePersonPickerState.page} / ${totalPages} 页</b>
          <button class="btn mini" type="button" ${messagePersonPickerState.page>=totalPages?"disabled":""} onclick="changeMessagePersonPickerPage(1)">下一页</button>
          <select class="select mini-select" onchange="changeMessagePersonPickerPageSize(this.value)">
            ${[20,50,100].map(size=>`<option value="${size}" ${messagePersonPickerState.pageSize===size?"selected":""}>${size}条/页</option>`).join("")}
          </select>
        </div>
      </div>
    </section>
  </div>`;
}

function syncMessagePersonPageSelectAllState(){
  const checkbox=document.getElementById("messagePersonPageSelectAll");
  if(checkbox)checkbox.indeterminate=checkbox.dataset.indeterminate==="true";
}

function updateMessagePersonPickerModal(){
  const body=document.querySelector(".message-person-picker-modal .modal-bd");
  if(!body)return;
  body.innerHTML=renderMessagePersonPickerModalBody();
  syncMessagePersonPageSelectAllState();
}

function openMessagePersonPicker(targetId){
  if(typeof openNestedModal!=="function"){
    showToast("人员选择组件加载失败");
    return;
  }
  document.querySelectorAll(".nested-modal-mask .message-person-picker-modal").forEach(modal=>modal.closest(".nested-modal-mask")?.remove());
  messagePersonPickerState.targetId=targetId;
  messagePersonPickerState.activeOrgId=typeof orgTreeData!=="undefined"?orgTreeData.id:"";
  messagePersonPickerState.orgKeyword="";
  messagePersonPickerState.keyword="";
  messagePersonPickerState.page=1;
  messagePersonPickerState.pageSize=50;
  messagePersonPickerState.draftSelectedIds=getMessagePersonPickerValues(targetId);
  messagePersonPickerState.expandedOrgIds=new Set(messagePersonPickerState.activeOrgId?[messagePersonPickerState.activeOrgId]:[]);
  openNestedModal("选择人员",renderMessagePersonPickerModalBody(),`<button class="btn" type="button" onclick="cancelMessagePersonPicker(this)">取消</button><button class="btn primary" type="button" onclick="confirmMessagePersonPicker(this)">确定</button>`);
  const modal=document.querySelector(".nested-modal-mask:last-of-type .nested-modal");
  if(modal){
    modal.classList.add("message-person-picker-modal");
    modal.querySelector(".modal-hd span")?.setAttribute("id","messagePersonPickerTitle");
    modal.setAttribute("aria-labelledby","messagePersonPickerTitle");
    modal.querySelector(".modal-hd .close")?.setAttribute("onclick","cancelMessagePersonPicker(this)");
  }
  document.getElementById(targetId)?.querySelector(".base-multi-select__control")?.setAttribute("aria-expanded","true");
  syncMessagePersonPageSelectAllState();
}

function cancelMessagePersonPicker(el){
  document.getElementById(messagePersonPickerState.targetId)?.querySelector(".base-multi-select__control")?.setAttribute("aria-expanded","false");
  closeNestedModal(el);
}

function confirmMessagePersonPicker(el){
  setMessagePersonPickerValues(messagePersonPickerState.targetId,messagePersonPickerState.draftSelectedIds);
  document.getElementById(messagePersonPickerState.targetId)?.querySelector(".base-multi-select__control")?.setAttribute("aria-expanded","false");
  closeNestedModal(el);
}

function toggleMessagePersonOrgNode(event,orgId){
  event?.preventDefault?.();
  event?.stopPropagation?.();
  if(messagePersonPickerState.expandedOrgIds.has(orgId))messagePersonPickerState.expandedOrgIds.delete(orgId);
  else messagePersonPickerState.expandedOrgIds.add(orgId);
  updateMessagePersonPickerModal();
}

function selectMessagePersonOrgNode(orgId){
  messagePersonPickerState.activeOrgId=orgId;
  messagePersonPickerState.page=1;
  updateMessagePersonPickerModal();
}

function filterMessagePersonOrgTree(keyword){
  messagePersonPickerState.orgKeyword=String(keyword||"");
  const tree=document.getElementById("messagePersonOrgTreeBody");
  if(tree){
    const html=typeof orgTreeData!=="undefined"?renderMessagePersonOrganizationNodes(orgTreeData):"";
    tree.innerHTML=html || '<div class="message-person-picker-empty">暂无匹配的组织</div>';
  }
}

function searchMessagePersonPicker(){
  messagePersonPickerState.keyword=document.getElementById("messagePersonKeyword")?.value.trim() || "";
  messagePersonPickerState.page=1;
  updateMessagePersonPickerModal();
}

function resetMessagePersonPickerSearch(){
  messagePersonPickerState.keyword="";
  messagePersonPickerState.page=1;
  updateMessagePersonPickerModal();
}

function toggleMessagePersonSelection(userId,checked){
  const user=getMessagePersonPickerUsers().find(item=>item.id===userId);
  if(!user || user.status==="禁用")return;
  const selected=new Set(messagePersonPickerState.draftSelectedIds);
  if(checked)selected.add(userId);
  else selected.delete(userId);
  messagePersonPickerState.draftSelectedIds=[...selected];
  const count=document.getElementById("messagePersonSelectedCount");
  if(count)count.textContent=messagePersonPickerState.draftSelectedIds.length;
  syncMessagePersonPageSelectAllStateFromRows();
}

function syncMessagePersonPageSelectAllStateFromRows(){
  const checkbox=document.getElementById("messagePersonPageSelectAll");
  if(!checkbox)return;
  const rows=[...document.querySelectorAll(".message-person-picker-modal .message-person-row-check:not(:disabled)")];
  checkbox.checked=rows.length>0 && rows.every(row=>row.checked);
  checkbox.indeterminate=!checkbox.checked && rows.some(row=>row.checked);
}

function toggleMessagePersonPageSelection(checked){
  const selected=new Set(messagePersonPickerState.draftSelectedIds);
  getMessagePersonPageData().pageRows.filter(user=>user.status!=="禁用").forEach(user=>{
    if(checked)selected.add(user.id);
    else selected.delete(user.id);
  });
  messagePersonPickerState.draftSelectedIds=[...selected];
  updateMessagePersonPickerModal();
}

function clearMessagePersonDraftSelection(){
  messagePersonPickerState.draftSelectedIds=[];
  updateMessagePersonPickerModal();
}

function changeMessagePersonPickerPage(step){
  const {totalPages}=getMessagePersonPageData();
  messagePersonPickerState.page=Math.min(totalPages,Math.max(1,messagePersonPickerState.page+Number(step||0)));
  updateMessagePersonPickerModal();
}

function changeMessagePersonPickerPageSize(value){
  messagePersonPickerState.pageSize=Math.max(1,Number(value)||50);
  messagePersonPickerState.page=1;
  updateMessagePersonPickerModal();
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
    <div class="tpl-tree-control" onclick="toggleTemplateTreeDropdown('msgTplJumpTree')"><span class="tpl-tree-value">请选择跳转页面</span>${renderTDesignIcon("chevron-down",{size:16,className:"tpl-tree-control-arrow"})}</div>
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
  const hasOpen=!!box.querySelector(".template-tree-select.open,.message-route-multi-select.is-open,.template-param-menu.open,.hazard-cascader.single.open");
  box.classList.toggle("modal-dropdown-open",hasOpen);
}

document.addEventListener("click",function(e){
  if(!e.target.closest?.(".template-param-insert"))document.getElementById("msgTplParamMenu")?.classList.remove("open");
  if(!e.target.closest?.(".template-tree-select"))document.querySelectorAll(".template-tree-select.open").forEach(x=>{x.classList.remove("open");resetTemplateDropdownPosition(x);});
  if(!e.target.closest?.(".message-route-multi-select"))document.querySelectorAll(".message-route-multi-select.is-open").forEach(closeMessageRouteMultiSelect);
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
          <option ${template?.targetType==="指定人" || template?.targetType==="指定人员"?"selected":""}>指定人员</option>
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
    msgCreateTargetType:template.targetType==="指定人"?"指定人员":template.targetType,
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
    "指定人员":"person",
    "人员":"person",
    "动态参数":"dynamic"
  };
  return map[targetType] || "post";
}

function getTemplateTargetTypeLabel(type){
  const map={all:"所有人",post:"指定岗位",org:"指定组织",person:"指定人员",dynamic:"动态参数"};
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
  const targetValues=String(template.targetValue||"").split(/[，,、]/).map(value=>value.trim()).filter(Boolean);
  if((targetType==="post" || targetType==="org") && typeof setMessageRouteMultiSelectValues==="function"){
    setMessageRouteMultiSelectValues("msgTplTargetValue",targetValues);
  }
  if(targetType==="person" && typeof setMessagePersonPickerValues==="function"){
    const personValues=Array.isArray(template.targetIds) && template.targetIds.length?template.targetIds:targetValues;
    setMessagePersonPickerValues("msgTplTargetValue",personValues);
  }
  if(targetType==="dynamic"){
    const targetSelect=document.getElementById("msgTplTargetValue");
    const targetValue=String(template.targetValue||"").trim();
    if(targetSelect && [...targetSelect.options].some(option=>option.value===targetValue))targetSelect.value=targetValue;
  }

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
  const targetPicker=document.getElementById("msgTplTargetValue");
  if(targetPicker?.classList.contains("message-person-picker")){
    const labels=getMessagePersonPickerLabels("msgTplTargetValue");
    if(labels.length)return labels.join("，");
  }
  if(targetPicker?.classList.contains("message-route-multi-select")){
    return getMessageRouteMultiSelectLabels("msgTplTargetValue").join("，");
  }
  if(targetPicker?.classList.contains("message-route-single-select"))return targetPicker.value || "";
  try{
    const checked=getTemplateTreeCheckedLeaves(targetPicker);
    const values=checked.map(x=>x.dataset.label || x.value).filter(Boolean);
    if(values.length)return values.join("，");
  }catch(e){}
  const tpl=getMessageTemplateById(document.getElementById("msgTplSendTemplateSelect")?.value);
  return tpl?.targetValue || "";
}

function saveMessageTemplateSendForm(){
  const type=document.getElementById("msgTplFormType")?.value || "消息通知";
  const targetType=document.getElementById("msgTplTargetType")?.value || "post";
  if(targetType==="person" && typeof getMessagePersonPickerValues==="function" && !getMessagePersonPickerValues("msgTplTargetValue").length){
    showToast("请选择接收人员");
    return;
  }
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
    targetIds:targetType==="person" && typeof getMessagePersonPickerValues==="function"?getMessagePersonPickerValues("msgTplTargetValue"):[],
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
  messageSendDrillState.batchNo=x.batchNo;
  messageSendDrillState.deliver="";
  messageSendDrillState.read="";
  messageSendDrillState.click="";
  openModal("发送批次记录详情",`
    <div class="message-admin-detail">
      ${info("发送批次号",x.batchNo)}${info("发送来源",x.source)}${info("消息类型",x.type)}${info("业务分类",x.biz)}
      ${info("发送状态",x.status)}${info("发送通道",x.channel)}${info("接收范围",x.targetType)}${info("接收目标",x.targetValue)}
      ${info("应发人数",x.shouldCount)}${info("实发人数",x.sentCount)}${info("已读人数",x.readCount)}${info("失败人数",x.failCount)}
      <div class="message-admin-content message-batch-content">
        <div class="message-batch-content-title">${x.title}</div>
        <div class="message-batch-content-body">${x.content}</div>
      </div>
      <div id="messageSendDetailReach" class="send-drill-modal message-send-detail-reach"></div>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
  modalBox.classList.add("send-drill-modal-box");
  renderMessageSendDetailReach(x.batchNo);
}

function openMessageBatchDetail(batchNo){
  const send=getSendRecordByBatch(batchNo);
  if(send){
    openMessageSendDetail(send.id);
    return;
  }

  const records=messageTodoReachRecordData.filter(item=>item.batchNo===batchNo);
  if(!records.length){
    showToast("未找到该发送批次");
    return;
  }
  const sample=records[0];
  const delivered=records.filter(item=>item.deliverStatus==="已送达").length;
  const failed=records.filter(item=>item.deliverStatus==="送达失败").length;
  const read=records.filter(item=>item.readStatus==="已读").length;
  const handled=records.filter(item=>item.handleStatus==="已办理").length;
  openModal("发送批次详情",`
    <div class="message-admin-detail">
      ${info("发送批次号",batchNo)}${info("消息类型","待办任务")}${info("业务分类",sample.biz)}${info("发送状态",failed?"部分失败":"已发送")}
      ${info("应发人数",records.length)}${info("送达人数",delivered)}${info("失败人数",failed)}${info("已读人数",read)}
      ${info("已办理人数",handled)}${info("首次送达时间",records.map(item=>item.deliverTime).filter(Boolean).sort()[0]||"--")}
      <div class="message-admin-content message-batch-content">
        <div class="message-batch-content-title">${sample.todoTitle}</div>
        <div class="message-batch-content-body">${sample.todoContent}</div>
      </div>
      <div class="message-admin-mini-title">接收人明细</div>
      <table><thead><tr><th>接收人</th><th>组织/项目</th><th>送达</th><th>阅读</th><th>办理</th></tr></thead><tbody>${records.map(item=>`<tr><td>${item.receiver}</td><td>${item.org} / ${item.project}</td><td>${messageStatusTag(item.deliverStatus)}</td><td>${messageStatusTag(item.readStatus)}</td><td>${messageStatusTag(item.handleStatus)}</td></tr>`).join("")}</tbody></table>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

window.openMessageBatchDetail=openMessageBatchDetail;

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

function getMessageOperationTime(){
  const now=new Date();
  const pad=value=>String(value).padStart(2,"0");
  return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function openMessageTodoReachDetail(id){
  const x=messageTodoReachRecordData.find(item=>item.id===id);
  if(!x)return;
  openModal("待办触达详情",`
    <div class="message-admin-detail">
      ${info("业务分类",x.biz)}${info("接收人",x.receiver)}${info("接收人组织",x.org)}${info("接收人项目",x.project)}
      ${info("接收人岗位",x.post)}${info("发送批次号",x.batchNo)}${info("送达状态",x.deliverStatus)}${info("送达时间",x.deliverTime||"--")}
      ${info("阅读状态",x.readStatus)}${info("阅读时间",x.readTime||"--")}${info("点击状态",x.clickStatus)}${info("点击时间",x.clickTime||"--")}
      ${info("办理状态",x.handleStatus)}${info("办理时间",x.handleTime||"--")}${info("失败原因",x.failReason||"--")}
      ${info("是否超期",x.overdue)}${info("超期时长",formatApprovalFlowDuration(x.overdueHours))}${info("超期提醒次数",String(x.reminders))}
      <div class="message-admin-content"><strong>${x.todoTitle}</strong>${x.todoContent}</div>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>${x.deliverStatus==="送达失败"?`<button class="btn primary" onclick="retryMessageTodoReach('${x.id}')">重新推送</button>`:""}`,"large");
}

function retryMessageTodoReach(id){
  const x=messageTodoReachRecordData.find(item=>item.id===id);
  if(!x)return;
  if(x.deliverStatus!=="送达失败"){
    showToast("仅送达失败的待办支持重新推送");
    return;
  }
  x.deliverStatus="已送达";
  x.deliverTime=getMessageOperationTime();
  x.readStatus="未读";
  x.readTime="";
  x.clickStatus="未点击";
  x.clickTime="";
  x.handleStatus="未办理";
  x.handleTime="";
  x.failReason="";
  closeModal();
  renderMessageRecordPage();
  showToast("待办已重新推送成功");
}

/* =========================
   审批流配置
========================= */
const approvalFlowConfigData=[
  {id:1,name:"分公司变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"分公司变更",code:"project_branch_company_change_apply",viewRoute:"ProjectBranchCompanyChangeDetail",editRoute:"ProjectBranchCompanyChangeEdit",formType:"自定义",sort:10,remark:"分公司信息变更审批",nodes:["项目负责人","子公司业务部门","子公司分管领导"]},
  {id:2,name:"II级风险条件验收",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"风险管理",code:"project_risk_list_level2_accept",viewRoute:"ProjectRiskListAccept",editRoute:"ProjectRiskListAcceptEdit",formType:"自定义",sort:20,remark:"II级风险条件验收审批",nodes:["项目安全负责人","项目经理","分公司安全负责人"]},
  {id:3,name:"工程总体筹划-子公司",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"项目状态",code:"project_prepare_subsidiary_major",viewRoute:"ProjectPrepareDetail",editRoute:"/project/overall/prepare",formType:"自定义",sort:30,remark:"子公司重大项目总体筹划",nodes:["项目经理","子公司产运部","子公司分管领导"]},
  {id:4,name:"实际产值上报",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"产值管理",code:"project_month_actual_output_report",viewRoute:"ActualReportDetail",editRoute:"ActualReportApply",formType:"自定义",sort:40,remark:"项目月度实际产值上报",nodes:["分公司产运人员","分公司分管领导","子公司产运部"]},
  {id:5,name:"一体化备案",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"项目状态",code:"project_integration",viewRoute:"ProjectIntegrationApplyDetail",editRoute:"ProjectIntegrationApply",formType:"自定义",sort:50,remark:"股份一体化项目备案",nodes:["项目经理","子公司业务部门","股份产运部"]},
  {id:6,name:"险情解除",initiatorAsApprover:"是",projectInitiated:"是",approvalType:"险情管理",code:"emergency_discharge",viewRoute:"EmergencyDischargeApprovalDetail",editRoute:"EmergencyDischargeApproval",formType:"自定义",sort:60,remark:"项目险情解除审批",nodes:["项目安全负责人","项目经理","子公司安全负责人"]},
  {id:7,name:"重大风险摄像头变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"风险管理",code:"project_major_risk_camera_change",viewRoute:"ProjectMajorRiskCameraChangeDetail",editRoute:"ProjectMajorRiskCameraChange",formType:"自定义",sort:70,remark:"重大风险监控设备变更",nodes:["项目安全负责人","分公司安全负责人","子公司安全负责人"]},
  {id:8,name:"创奖变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"质量管理",code:"project_award_plan",viewRoute:"ProjectAwardPlanDetail",editRoute:"ProjectAwardPlanChange",formType:"自定义",sort:80,remark:"项目创奖计划变更",nodes:["项目质量负责人","项目经理","子公司质量部门"]},
  {id:9,name:"技术方案变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"技术管理",code:"project_technical_plan_change",viewRoute:"ProjectTechnicalPlanChangeDetail",editRoute:"ProjectTechnicalPlanChange",formType:"自定义",sort:90,remark:"项目技术方案变更",nodes:["项目总工程师","项目经理","子公司技术部门"]},
  {id:10,name:"重大风险上传开工令",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"风险管理",code:"project_major_risk_implement",viewRoute:"ProjectMajorRiskImplementDetail",editRoute:"ProjectMajorRiskImplement",formType:"自定义",sort:100,remark:"重大风险开工令审批",nodes:["项目安全负责人","项目经理","分公司安全负责人"]},
  {id:11,name:"重大风险上传技术方案",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"风险管理",code:"project_major_risk_technical",viewRoute:"ProjectMajorRiskTechnicalDetail",editRoute:"ProjectMajorRiskTechnicalDetail",formType:"自定义",sort:110,remark:"重大风险技术方案审批",nodes:["项目总工程师","项目经理","子公司技术部门"]},
  {id:12,name:"保障申请",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"保障管理",code:"project_insurance_apply",viewRoute:"ProjectInsuranceApplyDetail",editRoute:"ProjectInsuranceApplyEdit",formType:"自定义",sort:120,remark:"项目保险保障申请",nodes:["项目经办人","项目经理","子公司保障部门"]},
  {id:13,name:"分公司工程巡查整改",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"质量管理",code:"quality_inspection_problem_branch",viewRoute:"QualityInspectionProblemDetail",editRoute:"QualityInspectionProblemEdit",formType:"自定义",sort:130,remark:"分公司工程巡查整改闭环",nodes:["项目质量负责人","项目经理","分公司质量负责人"]},
  {id:14,name:"子公司工程巡查整改",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"质量管理",code:"quality_inspection_problem_child",viewRoute:"QualityInspectionProblemDetail",editRoute:"QualityInspectionProblemEdit",formType:"自定义",sort:140,remark:"子公司工程巡查整改闭环",nodes:["项目质量负责人","项目经理","子公司质量负责人"]},
  {id:15,name:"工程总体筹划-股份",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"项目状态",code:"project_prepare_group_major",viewRoute:"ProjectPrepareDetail",editRoute:"/project/overall/prepare",formType:"自定义",sort:150,remark:"股份重大项目总体筹划",nodes:["项目经理","子公司产运部","股份产运部"]},
  {id:16,name:"项目经理变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"项目经理变更",code:"project_manager_change_apply",viewRoute:"ProjectManagerChangeDetail",editRoute:"ProjectManagerChangeEdit",formType:"自定义",sort:160,remark:"项目经理变更审批",nodes:["项目负责人","分公司人力部门","子公司分管领导"]},
  {id:17,name:"建筑垃圾计划变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"建筑垃圾计划",code:"project_building_waste_change",viewRoute:"ProjectBuildingWasteChangeDetail",editRoute:"ProjectBuildingWasteChange",formType:"自定义",sort:170,remark:"建筑垃圾处置计划变更",nodes:["项目经办人","项目经理","分公司业务部门"]},
  {id:18,name:"设备计划-变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"设备计划",code:"project_equipment_plan_change",viewRoute:"ProjectEquipmentPlanChangeDetail",editRoute:"ProjectEquipmentPlanChange",formType:"自定义",sort:180,remark:"项目设备计划变更",nodes:["设备管理员","项目经理","分公司设备部门"]},
  {id:19,name:"劳动力计划-变更",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"劳动力计划",code:"project_labor_plan_change",viewRoute:"ProjectLaborPlanChangeDetail",editRoute:"ProjectLaborPlanChange",formType:"自定义",sort:190,remark:"项目劳动力计划变更",nodes:["劳务管理员","项目经理","分公司生产部门"]},
  {id:20,name:"质量事故解除",initiatorAsApprover:"否",projectInitiated:"是",approvalType:"险情管理",code:"quality_accident_discharge",viewRoute:"QualityAccidentDischargeDetail",editRoute:"QualityAccidentDischargeApproval",formType:"自定义",sort:200,remark:"质量事故解除审批",nodes:["项目质量负责人","项目经理","子公司质量部门"]}
];

const approvalFlowConfigState={filters:{keyword:"",name:"",code:"",approvalType:""},selectedIds:[],page:1,pageSize:50};
let approvalFlowConfigCurrent=[...approvalFlowConfigData];

approvalFlowConfigData.forEach((row,index)=>{
  const updateCount=index%5+1;
  row.versionRecords=Array.from({length:updateCount},(_,recordIndex)=>({
    version:`V1.${updateCount-recordIndex}`,
    type:recordIndex===0?"审批流配置更新":recordIndex===1?"审批节点调整":"基础信息维护",
    operator:["王安全","陈审批","系统管理员","李明"][recordIndex%4],
    updateTime:`2026-${String(Math.max(4,8-recordIndex)).padStart(2,"0")}-${String(Math.max(1,12-index%8)).padStart(2,"0")} ${String(9+recordIndex).padStart(2,"0")}:20:00`,
    summary:recordIndex===0?`更新${row.name}的审批流配置及页面路由`:recordIndex===1?`调整${row.name}的审批节点及审批人规则`:`维护${row.name}的表单基础信息`
  }));
});

function approvalFlowConfigBooleanTag(value){return tag(value,value==="是"?"green":"red");}
function approvalFlowConfigEllipsis(value){return `<span class="text-ellipsis" title="${escapeAttr(value||"")}">${value||"-"}</span>`;}

tableColumnDefinitions.approvalFlowConfig=[
  {key:"selection",title:'<input type="checkbox" aria-label="全选审批流" onchange="toggleAllApprovalFlowConfigs(this.checked)"/>',width:54,align:"center",render:row=>`<input type="checkbox" aria-label="选择${escapeAttr(row.name)}" ${approvalFlowConfigState.selectedIds.includes(row.id)?"checked":""} onchange="toggleApprovalFlowConfigSelection(${row.id},this.checked)"/>`},
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(approvalFlowConfigState.page-1)*approvalFlowConfigState.pageSize+index+1},
  {key:"name",title:"表单名称",width:220,render:row=>approvalFlowConfigEllipsis(row.name)},
  {key:"initiatorAsApprover",title:"当前节点审批人为发起人",width:190,align:"center",render:row=>approvalFlowConfigBooleanTag(row.initiatorAsApprover)},
  {key:"projectInitiated",title:"是否从项目端发起",width:160,align:"center",render:row=>approvalFlowConfigBooleanTag(row.projectInitiated)},
  {key:"approvalType",title:"审批流类型",width:150,align:"center",render:row=>tag(row.approvalType,"blue")},
  {key:"flowSetting",title:"审批流设置",width:110,align:"center",render:row=>`<a class="link" onclick="openApprovalFlowNodeSetting(${row.id})">设置</a>`},
  {key:"code",title:"表单代码",width:290,render:row=>approvalFlowConfigEllipsis(row.code)},
  {key:"viewRoute",title:"查看页路由",width:230,render:row=>approvalFlowConfigEllipsis(row.viewRoute)},
  {key:"editRoute",title:"编辑页路由",width:230,render:row=>approvalFlowConfigEllipsis(row.editRoute)},
  {key:"formType",title:"表单类型",width:110,align:"center",render:row=>tag(row.formType,"green")},
  {key:"sort",title:"排序参数",width:100,align:"center",render:row=>row.sort},
  {key:"historyVersion",title:"历史版本",width:100,align:"center",render:row=>`<a class="link" onclick="openApprovalFlowConfigVersionRecords(${row.id})">${row.versionRecords?.length||0}</a>`},
  {key:"remark",title:"备注说明",width:220,render:row=>approvalFlowConfigEllipsis(row.remark)},
  {key:"operation",title:"操作",width:170,align:"center",render:row=>`<span class="approval-row-actions"><a class="link" onclick="openApprovalFlowConfigView(${row.id})">查看</a><a class="link" onclick="openApprovalFlowConfigEdit(${row.id})">编辑</a><a class="link danger-link" onclick="deleteApprovalFlowConfig(${row.id})">删除</a></span>`}
];

function getApprovalFlowConfigFilteredRows(){
  const f=approvalFlowConfigState.filters;
  return approvalFlowConfigData.filter(row=>{
    const searchable=[row.name,row.code,row.approvalType,row.viewRoute,row.editRoute,row.remark].join(" ");
    return (!f.keyword||searchable.includes(f.keyword))&&(!f.name||row.name.includes(f.name))&&(!f.code||row.code.includes(f.code))&&(!f.approvalType||row.approvalType===f.approvalType);
  }).sort((a,b)=>a.sort-b.sort);
}

function applyApprovalFlowConfigFilters(){approvalFlowConfigCurrent=getApprovalFlowConfigFilteredRows();}
function approvalFlowConfigOptions(){return [...new Set(approvalFlowConfigData.map(row=>row.approvalType))];}
function renderApprovalFlowConfigSelect(value=""){return `<select id="approvalFlowConfigType" class="select"><option value="">全部</option>${approvalFlowConfigOptions().map(item=>`<option ${item===value?"selected":""}>${item}</option>`).join("")}</select>`;}

function renderApprovalFlowConfigPagination(){
  const pages=Math.max(1,Math.ceil(approvalFlowConfigCurrent.length/approvalFlowConfigState.pageSize));
  approvalFlowConfigState.page=Math.min(approvalFlowConfigState.page,pages);
  return `<span>共 ${approvalFlowConfigCurrent.length} 条</span><div class="pager"><button class="btn" ${approvalFlowConfigState.page<=1?"disabled":""} onclick="setApprovalFlowConfigPage(${approvalFlowConfigState.page-1})">上一页</button><b>第 ${approvalFlowConfigState.page} / ${pages} 页</b><button class="btn" ${approvalFlowConfigState.page>=pages?"disabled":""} onclick="setApprovalFlowConfigPage(${approvalFlowConfigState.page+1})">下一页</button><select class="mini-select" onchange="setApprovalFlowConfigPageSize(this.value)"><option value="20" ${approvalFlowConfigState.pageSize===20?"selected":""}>20条/页</option><option value="50" ${approvalFlowConfigState.pageSize===50?"selected":""}>50条/页</option><option value="100" ${approvalFlowConfigState.pageSize===100?"selected":""}>100条/页</option></select></div>`;
}

function renderApprovalFlowConfigPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  applyApprovalFlowConfigFilters();
  const f=approvalFlowConfigState.filters;
  const fields=`
    <div class="form-item"><label>关键字</label><input id="approvalFlowConfigKeyword" class="input" placeholder="请输入关键字模糊搜索" value="${escapeAttr(f.keyword)}"/></div>
    <div class="form-item"><label>表单名称</label><input id="approvalFlowConfigName" class="input" placeholder="请输入表单名称" value="${escapeAttr(f.name)}"/></div>
    <div class="form-item"><label>表单代码</label><input id="approvalFlowConfigCode" class="input" placeholder="请输入表单代码" value="${escapeAttr(f.code)}"/></div>
    <div class="form-item"><label>审批类型</label>${renderApprovalFlowConfigSelect(f.approvalType)}</div>`;
  const beforeActions=`<button class="btn primary" onclick="openApprovalFlowConfigEdit()">新增</button><button class="btn danger" onclick="batchDeleteApprovalFlowConfigs()">批量删除</button><button class="btn" onclick="updateApprovalFlowNodes()">更新审批节点</button>`;
  const tableCard=renderUnifiedTableCard({title:"审批流配置",tableKey:"approvalFlowConfig",tableId:"approvalFlowConfigTable",theadId:"approvalFlowConfigThead",tbodyId:"approvalFlowConfigTbody",renderFnName:"renderApprovalFlowConfigTable",beforeActions,refreshAction:"refreshApprovalFlowConfigs()",exportAction:"exportApprovalFlowConfigs()",paginationHtml:renderApprovalFlowConfigPagination(),className:"approval-flow-config-table-card"});
  listPage.innerHTML=`<div class="approval-flow-config-page"><div class="compact-title-row"><div class="module-title">审批流程管理 / 审批流配置</div></div>${renderUnifiedQueryCard(fields,{id:"approvalFlowConfigQueryCard",queryFn:"queryApprovalFlowConfigs()",resetFn:"resetApprovalFlowConfigs()",canCollapse:false})}${tableCard}</div>`;
  renderApprovalFlowConfigTable();
}

function readApprovalFlowConfigFilters(){return {keyword:document.getElementById("approvalFlowConfigKeyword")?.value.trim()||"",name:document.getElementById("approvalFlowConfigName")?.value.trim()||"",code:document.getElementById("approvalFlowConfigCode")?.value.trim()||"",approvalType:document.getElementById("approvalFlowConfigType")?.value||""};}
function queryApprovalFlowConfigs(){approvalFlowConfigState.filters=readApprovalFlowConfigFilters();approvalFlowConfigState.page=1;renderApprovalFlowConfigPage();}
function resetApprovalFlowConfigs(){approvalFlowConfigState.filters={keyword:"",name:"",code:"",approvalType:""};approvalFlowConfigState.page=1;renderApprovalFlowConfigPage();}
function refreshApprovalFlowConfigs(){renderApprovalFlowConfigPage();showToast("审批流配置已刷新");}
function exportApprovalFlowConfigs(){showToast(`导出成功：审批流配置（${approvalFlowConfigCurrent.length}条）.xlsx`);}
function setApprovalFlowConfigPage(page){approvalFlowConfigState.page=Math.max(1,Number(page)||1);renderApprovalFlowConfigPage();}
function setApprovalFlowConfigPageSize(size){approvalFlowConfigState.pageSize=Number(size)||50;approvalFlowConfigState.page=1;renderApprovalFlowConfigPage();}

function renderApprovalFlowConfigTable(){
  const start=(approvalFlowConfigState.page-1)*approvalFlowConfigState.pageSize;
  const rows=approvalFlowConfigCurrent.slice(start,start+approvalFlowConfigState.pageSize);
  const thead=document.getElementById("approvalFlowConfigThead");
  if(thead)thead.innerHTML=renderTableHeaderByColumns("approvalFlowConfig");
  renderTableByColumns("approvalFlowConfig",rows,"approvalFlowConfigTbody");
  const allSelected=rows.length&&rows.every(row=>approvalFlowConfigState.selectedIds.includes(row.id));
  const selectAll=document.querySelector('#approvalFlowConfigThead input[type="checkbox"]');
  if(selectAll)selectAll.checked=Boolean(allSelected);
}

function toggleApprovalFlowConfigSelection(id,checked){
  const selected=new Set(approvalFlowConfigState.selectedIds);
  checked?selected.add(id):selected.delete(id);
  approvalFlowConfigState.selectedIds=[...selected];
  renderApprovalFlowConfigTable();
}

function toggleAllApprovalFlowConfigs(checked){
  const start=(approvalFlowConfigState.page-1)*approvalFlowConfigState.pageSize;
  const ids=approvalFlowConfigCurrent.slice(start,start+approvalFlowConfigState.pageSize).map(row=>row.id);
  const selected=new Set(approvalFlowConfigState.selectedIds);
  ids.forEach(id=>checked?selected.add(id):selected.delete(id));
  approvalFlowConfigState.selectedIds=[...selected];
  renderApprovalFlowConfigTable();
}

function openApprovalFlowConfigView(id){
  const row=approvalFlowConfigData.find(item=>item.id===id);if(!row)return;
  openModal("查看审批流配置",`<div class="form-grid-2"><div class="form-item"><label>表单名称</label><input class="input" value="${escapeAttr(row.name)}" disabled/></div><div class="form-item"><label>表单代码</label><input class="input" value="${escapeAttr(row.code)}" disabled/></div><div class="form-item"><label>审批流类型</label><input class="input" value="${escapeAttr(row.approvalType)}" disabled/></div><div class="form-item"><label>表单类型</label><input class="input" value="${escapeAttr(row.formType)}" disabled/></div><div class="form-item"><label>查看页路由</label><input class="input" value="${escapeAttr(row.viewRoute)}" disabled/></div><div class="form-item"><label>编辑页路由</label><input class="input" value="${escapeAttr(row.editRoute)}" disabled/></div><div class="form-item"><label>是否从项目端发起</label><input class="input" value="${row.projectInitiated}" disabled/></div><div class="form-item"><label>当前节点审批人为发起人</label><input class="input" value="${row.initiatorAsApprover}" disabled/></div><div class="form-item" style="grid-column:1/-1"><label>备注说明</label><textarea class="input" disabled>${row.remark}</textarea></div></div>`,`<button class="btn" onclick="closeModal()">关闭</button>`,`large`);
}

function openApprovalFlowConfigEdit(id){
  const row=approvalFlowConfigData.find(item=>item.id===id)||{name:"",code:"",approvalType:"",formType:"自定义",viewRoute:"",editRoute:"",projectInitiated:"是",initiatorAsApprover:"否",sort:(approvalFlowConfigData.length+1)*10,remark:"",nodes:["项目负责人","部门负责人"]};
  openModal(id?"编辑审批流配置":"新增审批流配置",`<div class="form-grid-2"><div class="form-item"><label>表单名称 *</label><input id="approvalConfigEditName" class="input" value="${escapeAttr(row.name)}" placeholder="请输入表单名称"/></div><div class="form-item"><label>表单代码 *</label><input id="approvalConfigEditCode" class="input" value="${escapeAttr(row.code)}" placeholder="请输入表单代码"/></div><div class="form-item"><label>审批流类型 *</label><input id="approvalConfigEditType" class="input" value="${escapeAttr(row.approvalType)}" placeholder="请输入审批流类型"/></div><div class="form-item"><label>表单类型</label><select id="approvalConfigEditFormType" class="select"><option ${row.formType==="自定义"?"selected":""}>自定义</option><option ${row.formType==="系统"?"selected":""}>系统</option></select></div><div class="form-item"><label>查看页路由</label><input id="approvalConfigEditViewRoute" class="input" value="${escapeAttr(row.viewRoute)}" placeholder="请输入查看页路由"/></div><div class="form-item"><label>编辑页路由</label><input id="approvalConfigEditEditRoute" class="input" value="${escapeAttr(row.editRoute)}" placeholder="请输入编辑页路由"/></div><div class="form-item"><label>是否从项目端发起</label><select id="approvalConfigEditProjectInitiated" class="select"><option ${row.projectInitiated==="是"?"selected":""}>是</option><option ${row.projectInitiated==="否"?"selected":""}>否</option></select></div><div class="form-item"><label>当前节点审批人为发起人</label><select id="approvalConfigEditInitiator" class="select"><option ${row.initiatorAsApprover==="否"?"selected":""}>否</option><option ${row.initiatorAsApprover==="是"?"selected":""}>是</option></select></div><div class="form-item"><label>排序参数</label><input id="approvalConfigEditSort" class="input" type="number" value="${row.sort}"/></div><div class="form-item" style="grid-column:1/-1"><label>备注说明</label><textarea id="approvalConfigEditRemark" class="input" style="height:96px;padding-top:8px" placeholder="请输入备注说明">${row.remark}</textarea></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveApprovalFlowConfig(${id||0})">保存</button>`,`large`);
}

function saveApprovalFlowConfig(id){
  const name=document.getElementById("approvalConfigEditName")?.value.trim();
  const code=document.getElementById("approvalConfigEditCode")?.value.trim();
  const approvalType=document.getElementById("approvalConfigEditType")?.value.trim();
  if(!name||!code||!approvalType)return showToast("请完整填写表单名称、表单代码和审批流类型");
  if(approvalFlowConfigData.some(row=>row.code===code&&row.id!==id))return showToast("表单代码不能重复");
  const values={name,code,approvalType,formType:document.getElementById("approvalConfigEditFormType")?.value||"自定义",viewRoute:document.getElementById("approvalConfigEditViewRoute")?.value.trim()||"",editRoute:document.getElementById("approvalConfigEditEditRoute")?.value.trim()||"",projectInitiated:document.getElementById("approvalConfigEditProjectInitiated")?.value||"是",initiatorAsApprover:document.getElementById("approvalConfigEditInitiator")?.value||"否",sort:Number(document.getElementById("approvalConfigEditSort")?.value)||0,remark:document.getElementById("approvalConfigEditRemark")?.value.trim()||""};
  const row=approvalFlowConfigData.find(item=>item.id===id);
  if(row){
    Object.assign(row,values);
    appendApprovalFlowConfigVersion(row,"审批流配置更新","更新表单基础信息、发起规则及页面路由");
  }else{
    approvalFlowConfigData.push({id:Math.max(0,...approvalFlowConfigData.map(item=>item.id))+1,...values,nodes:["项目负责人","部门负责人"],versionRecords:[]});
  }
  closeModal();renderApprovalFlowConfigPage();showToast(id?"审批流配置已更新":"审批流配置已新增");
}

function openApprovalFlowNodeSetting(id){
  const row=approvalFlowConfigData.find(item=>item.id===id);if(!row)return;
  openModal("审批流设置",`<div class="approval-node-setting"><div class="approval-node-setting-summary"><span>审批表单</span><strong>${row.name}</strong><span>当前共 ${row.nodes.length} 个审批节点</span></div><div class="approval-node-setting-list">${row.nodes.map((node,index)=>`<div class="approval-node-setting-item"><i>${index+1}</i><div><strong>${node}</strong><span>${index===0?"发起后进入首个审批节点":"上一节点通过后进入"}</span></div><button class="btn" onclick="showToast('节点人员配置已打开')">配置审批人</button></div>`).join("")}</div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="saveApprovalFlowNodeSetting(${row.id})">保存</button>`,`large`);
}

function appendApprovalFlowConfigVersion(row,type,summary){
  if(!row)return;
  row.versionRecords=Array.isArray(row.versionRecords)?row.versionRecords:[];
  row.versionRecords.unshift({version:`V1.${row.versionRecords.length+1}`,type,operator:"王安全",updateTime:getMessageOperationTime(),summary});
}

function saveApprovalFlowNodeSetting(id){
  const row=approvalFlowConfigData.find(item=>item.id===id);if(!row)return;
  appendApprovalFlowConfigVersion(row,"审批节点调整","更新审批节点顺序及审批人配置");
  closeModal();renderApprovalFlowConfigPage();showToast("审批流设置已保存");
}

function openApprovalFlowConfigVersionRecords(id){
  const row=approvalFlowConfigData.find(item=>item.id===id);if(!row)return;
  const records=row.versionRecords||[];
  const html=`<div class="safety-eval-version-modal approval-flow-version-modal"><div class="safety-eval-version-model-name">审批表单：${row.name}　共更新 ${records.length} 次</div><div class="safety-eval-detail-table-wrap"><table class="safety-eval-detail-table safety-eval-version-table"><thead><tr><th>序号</th><th>版本号</th><th>更新类型</th><th>更新人</th><th>更新时间</th><th>更新内容</th><th>操作</th></tr></thead><tbody>${records.length?records.map((record,index)=>`<tr><td>${index+1}</td><td>${record.version}</td><td>${record.type}</td><td>${record.operator}</td><td>${record.updateTime}</td><td class="version-summary-cell" title="${escapeAttr(record.summary)}">${record.summary}</td><td><button class="link" onclick="openApprovalFlowConfigVersionDetail(${row.id},${index})">查看</button></td></tr>`).join(""):`<tr><td colspan="7">暂无版本更新记录</td></tr>`}</tbody></table></div></div>`;
  openModal("版本更新记录",html,`<button class="btn" onclick="closeModal()">关闭</button>`,`large`);
}

function openApprovalFlowConfigVersionDetail(id,recordIndex){
  const row=approvalFlowConfigData.find(item=>item.id===id);
  const record=row?.versionRecords?.[recordIndex];if(!row||!record)return;
  const html=`<div class="detail-info-grid safety-eval-version-detail-grid"><span>表单名称：<b>${row.name}</b></span><span>表单代码：<b>${row.code}</b></span><span>版本号：<b>${record.version}</b></span><span>更新类型：<b>${record.type}</b></span><span>更新人：<b>${record.operator}</b></span><span>更新时间：<b>${record.updateTime}</b></span><span class="version-detail-summary">更新内容：<b>${record.summary}</b></span></div>`;
  openModal("版本更新记录详情",html,`<button class="btn" onclick="openApprovalFlowConfigVersionRecords(${row.id})">返回</button><button class="btn primary" onclick="closeModal()">关闭</button>`,`large`);
}

function deleteApprovalFlowConfig(id){
  const index=approvalFlowConfigData.findIndex(item=>item.id===id);if(index<0)return;
  if(!confirm(`确认删除“${approvalFlowConfigData[index].name}”吗？`))return;
  approvalFlowConfigData.splice(index,1);approvalFlowConfigState.selectedIds=approvalFlowConfigState.selectedIds.filter(item=>item!==id);renderApprovalFlowConfigPage();showToast("审批流配置已删除");
}

function batchDeleteApprovalFlowConfigs(){
  if(!approvalFlowConfigState.selectedIds.length)return showToast("请先选择需要删除的审批流配置");
  if(!confirm(`确认删除已选择的 ${approvalFlowConfigState.selectedIds.length} 条审批流配置吗？`))return;
  const ids=new Set(approvalFlowConfigState.selectedIds);for(let index=approvalFlowConfigData.length-1;index>=0;index-=1)if(ids.has(approvalFlowConfigData[index].id))approvalFlowConfigData.splice(index,1);
  approvalFlowConfigState.selectedIds=[];renderApprovalFlowConfigPage();showToast("审批流配置已批量删除");
}

function updateApprovalFlowNodes(){
  const selected=new Set(approvalFlowConfigState.selectedIds);
  const rows=selected.size?approvalFlowConfigData.filter(row=>selected.has(row.id)):approvalFlowConfigCurrent;
  rows.forEach(row=>appendApprovalFlowConfigVersion(row,"审批节点同步","同步最新审批节点及审批人数据"));
  const count=rows.length;
  renderApprovalFlowConfigPage();
  showToast(`已更新 ${count} 条审批流的审批节点`);
}

/* =========================
   审批流程明细
========================= */
const approvalFlowDetailData=[
  {id:1,scope:"项目",name:"上海示范区线工程 SFQSG-15 标",type:"I级风险条件验收",content:"深基坑开挖前置条件验收",initiator:"张建国",startTime:"2026-08-03 09:10",node:"项目负责人审批",approver:"王安全",arrivalTime:"2026-08-03 09:12",stayDuration:"4小时18分钟",reminders:0,status:"审批中"},
  {id:2,scope:"项目",name:"机场联络线工程 JCXSG-4 标",type:"II级风险变更",content:"风险等级及管控措施变更",initiator:"王晨",startTime:"2026-08-03 08:42",node:"分公司安全负责人审批",approver:"陈审批",arrivalTime:"2026-08-03 08:45",stayDuration:"4小时45分钟",overdue:"否",reminders:0,status:"审批中"},
  {id:3,scope:"企业",name:"上海隧道工程有限公司",type:"实际产值上报",content:"2026年7月实际产值上报",initiator:"赵经营",startTime:"2026-08-02 17:30",node:"股份产运部复核",approver:"赵主管",arrivalTime:"2026-08-03 09:00",stayDuration:"4小时30分钟",overdue:"否",reminders:0,status:"审批中"},
  {id:4,scope:"项目",name:"北方数据中心项目",type:"停工申请",content:"申请2026年8月5日起临时停工",initiator:"陈启航",startTime:"2026-08-02 16:05",node:"审批结束",approver:"李经理",arrivalTime:"2026-08-02 18:26",stayDuration:"-",overdue:"否",reminders:0,status:"已驳回"},
  {id:5,scope:"项目",name:"西湖区朝阳污水处理厂收集范围排水单元改造工程",type:"期初产值上报",content:"期初产值及期初营收上报",initiator:"楼力栋",startTime:"2026-08-01 15:43",node:"审批结束",approver:"周经营",arrivalTime:"2026-08-01 17:18",stayDuration:"-",overdue:"否",reminders:0,status:"已通过"},
  {id:6,scope:"项目",name:"内部测试专用（数字集团）",type:"产值滚动更新",content:"三季度计划产值滚动更新",initiator:"楼力栋",startTime:"2026-08-01 11:03",node:"子公司产运部审批",approver:"孙产运",arrivalTime:"2026-08-01 11:15",stayDuration:"1天2小时",overdue:"是",reminders:2,status:"审批中"},
  {id:7,scope:"项目",name:"景德镇陶阳里历史文化街区配套项目酒店工程",type:"进度变更",content:"更新工程开工预计日期及关键节点",initiator:"楼力栋",startTime:"2026-07-30 14:38",node:"审批结束",approver:"钱进度",arrivalTime:"2026-07-30 16:20",stayDuration:"-",overdue:"否",reminders:0,status:"已作废"},
  {id:8,scope:"项目",name:"奉贤新城18单元项目",type:"II级风险条件验收",content:"B1深基坑开挖条件验收",initiator:"俞华杰",startTime:"2026-07-29 10:20",node:"股份安全部审批",approver:"王安全",arrivalTime:"2026-07-29 11:02",stayDuration:"2天6小时",overdue:"是",reminders:3,status:"审批中"},
  {id:9,scope:"企业",name:"市政集团",type:"产值滚动更新",content:"2026年度产值计划调整",initiator:"赵经营",startTime:"2026-07-28 09:12",node:"审批结束",approver:"孙产运",arrivalTime:"2026-07-28 15:36",stayDuration:"-",overdue:"否",reminders:0,status:"已通过"},
  {id:10,scope:"项目",name:"龙华西路站改扩建工程",type:"工程总体筹划",content:"项目工程总体筹划提交审批",initiator:"叶飞",startTime:"2026-07-27 13:32",node:"分公司负责人审批",approver:"陈审批",arrivalTime:"2026-07-27 13:40",stayDuration:"3天1小时",overdue:"是",reminders:4,status:"审批中"},
  {id:11,scope:"项目",name:"漕河泾创新水岸建设工程",type:"项目终止",content:"因实施条件变化申请项目终止",initiator:"孙伟",startTime:"2026-07-25 15:00",node:"审批结束",approver:"李经理",arrivalTime:"2026-07-26 09:16",stayDuration:"-",overdue:"否",reminders:0,status:"已通过"},
  {id:12,scope:"项目",name:"安义县新城区产业园标准厂房建设项目一期",type:"I级风险条件验收",content:"拆除作业前置条件验收",initiator:"应强",startTime:"2026-07-24 08:35",node:"审批结束",approver:"王安全",arrivalTime:"2026-07-24 10:08",stayDuration:"-",overdue:"否",reminders:0,status:"已通过"}
];

const approvalFlowTimingMetrics={
  1:{stayHours:4,stayMinutes:18},
  2:{stayHours:4,stayMinutes:45},
  3:{stayHours:4,stayMinutes:30},
  6:{stayHours:26},
  8:{stayHours:198},
  10:{stayHours:241}
};
approvalFlowDetailData.forEach(row=>Object.assign(row,{stayHours:0,stayMinutes:0},approvalFlowTimingMetrics[row.id]||{}));

const approvalFlowOrgAssignments={
  1:["隧道股份","上海隧道","轨交分公司"],2:["隧道股份","上海隧道","轨交分公司"],3:["隧道股份","上海隧道"],
  4:["隧道股份","上海路桥","北方公司"],5:["隧道股份","市政集团","江西分公司"],6:["隧道股份","数字集团"],
  7:["隧道股份","市政集团","江西分公司"],8:["隧道股份","市政集团","第二建筑"],9:["隧道股份","市政集团"],
  10:["隧道股份","市政集团","市政分公司"],11:["隧道股份","上海隧道","市政分公司"],12:["隧道股份","市政集团","江西分公司"]
};
approvalFlowDetailData.forEach(row=>{row.orgPath=approvalFlowOrgAssignments[row.id]||["隧道股份"];});

const approvalFlowOrgTree={id:"group",name:"隧道股份",children:[
  {id:"tunnel",name:"上海隧道",children:[
    {id:"tunnel-track",name:"轨交分公司",children:[]},
    {id:"tunnel-municipal",name:"市政分公司",children:[]}
  ]},
  {id:"municipal",name:"市政集团",children:[
    {id:"municipal-jiangxi",name:"江西分公司",children:[]},
    {id:"municipal-building",name:"第二建筑",children:[]},
    {id:"municipal-branch",name:"市政分公司",children:[]}
  ]},
  {id:"road",name:"上海路桥",children:[{id:"road-north",name:"北方公司",children:[]}]},
  {id:"digital",name:"数字集团",children:[]}
]};

const approvalFlowDetailState={filters:{},page:1,pageSize:50,orgAggregate:false,orgId:orgTreeData.id,orgKeyword:"",stat:""};
let approvalFlowDetailCurrent=[...approvalFlowDetailData];

function approvalFlowDetailStatusTag(value){
  const color={"审批中":"orange","已通过":"green","已驳回":"red","已作废":"gray"}[value]||"blue";
  return tag(value,color);
}

function formatApprovalFlowDuration(hours=0,minutes=0){
  if(!hours&&!minutes)return "-";
  return `${hours?`${hours}h`:""}${minutes?`${minutes}m`:""}`;
}

tableColumnDefinitions.approvalFlowDetail=[
  {key:"index",title:"序号",width:70,align:"center",render:(row,index)=>(approvalFlowDetailState.page-1)*approvalFlowDetailState.pageSize+index+1},
  {key:"scope",title:"审批对象",width:100,align:"center",render:row=>tag(row.scope,row.scope==="企业"?"red":"blue")},
  {key:"name",title:"对象名称",width:280,render:row=>`<span class="text-ellipsis" title="${escapeAttr(row.name)}">${row.name}</span>`},
  {key:"type",title:"审批类型",width:180,align:"center",render:row=>tag(row.type,"blue")},
  {key:"content",title:"审批内容",width:300,render:row=>`<span class="text-ellipsis" title="${escapeAttr(row.content)}">${row.content}</span>`},
  {key:"initiator",title:"审批发起人",width:120,align:"center",render:row=>row.initiator},
  {key:"startTime",title:"审批发起时间",width:165,align:"center",render:row=>row.startTime},
  {key:"node",title:"当前流程节点",width:180,align:"center",render:row=>row.node},
  {key:"approver",title:"当前审批人",width:120,align:"center",render:row=>row.approver},
  {key:"arrivalTime",title:"流程到达时间",width:165,align:"center",render:row=>row.arrivalTime},
  {key:"stayDuration",title:"已停留时长",width:100,align:"center",render:row=>formatApprovalFlowDuration(row.stayHours,row.stayMinutes)},
  {key:"reminders",title:"提醒次数",width:100,align:"center",render:row=>`<button type="button" class="link approval-flow-reminder-link" data-approval-reminder-id="${row.id}">${row.reminders}</button>`},
  {key:"status",title:"审批状态",width:110,align:"center",render:row=>approvalFlowDetailStatusTag(row.status)},
  {key:"operation",title:"操作",width:130,align:"center",render:row=>`<a class="link" onclick="openApprovalFlowDetail(${row.id})">查看</a>${row.status==="审批中"?` <a class="link" onclick="superviseApprovalFlow(${row.id})">督办</a>`:""}`}
];

function approvalFlowDetailOptions(key){
  return [...new Set(approvalFlowDetailData.map(row=>row[key]).filter(Boolean))];
}

function renderApprovalFlowDetailSelect(id,options,value=""){
  return `<select id="${id}" class="select"><option value="">全部</option>${options.map(option=>`<option ${option===value?"selected":""}>${option}</option>`).join("")}</select>`;
}

function getApprovalFlowBaseFilteredRows(){
  const f=approvalFlowDetailState.filters;
  return approvalFlowDetailData.filter(row=>{
    const day=row.startTime.slice(0,10);
    return (!f.content||row.content.includes(f.content))&&(!f.name||row.name.includes(f.name))&&(!f.initiator||row.initiator.includes(f.initiator))&&(!f.approver||row.approver.includes(f.approver))&&(!f.type||row.type===f.type)&&(!f.status||row.status===f.status)&&(!f.scope||row.scope===f.scope)&&(!f.startDate||day>=f.startDate)&&(!f.endDate||day<=f.endDate);
  });
}

function getApprovalFlowScopedRows(){
  const rows=getApprovalFlowBaseFilteredRows();
  const selected=findOrgById(approvalFlowDetailState.orgId)?.node;
  const names=new Set(getUnifiedOrgDescendantNames(selected,[]));
  return approvalFlowDetailState.orgAggregate&&approvalFlowDetailState.orgId
    ?rows.filter(row=>row.orgPath.some(name=>names.has(name)))
    :rows;
}

function matchesApprovalFlowStat(row,stat=approvalFlowDetailState.stat){
  if(!stat)return true;
  if(stat==="statusPending")return row.status==="审批中";
  if(stat==="statusPassed")return row.status==="已通过";
  if(stat==="statusRejected")return row.status==="已驳回";
  if(stat==="stay3")return row.stayHours>=72;
  if(stat==="stay7")return row.stayHours>=168;
  return true;
}

function applyApprovalFlowDetailFilters(){
  approvalFlowDetailCurrent=getApprovalFlowScopedRows().filter(row=>matchesApprovalFlowStat(row));
}

function getApprovalFlowOrgCount(orgId){
  const node=findOrgById(orgId)?.node;
  const names=new Set(getUnifiedOrgDescendantNames(node,[]));
  return getApprovalFlowBaseFilteredRows().filter(row=>row.orgPath.some(name=>names.has(name))&&matchesApprovalFlowStat(row)).length;
}

function renderApprovalFlowStatOption(key,label,rows){
  const count=rows.filter(row=>matchesApprovalFlowStat(row,key)).length;
  return `<div class="construction-project-stat-item ${approvalFlowDetailState.stat===key?"active":""}" onclick="setApprovalFlowStat('${key}')"><strong>${count}</strong><span>${label}</span></div>`;
}

function renderApprovalFlowStats(){
  const rows=getApprovalFlowScopedRows();
  return StatisticsFilter.render({id:"approval-flow-statistics-filter",className:"approval-flow-stat-card",activeKey:approvalFlowDetailState.stat,groups:[
    {label:"审批状态",items:[["statusPending","审批中"],["statusPassed","已通过"],["statusRejected","已驳回"]].map(([key,label])=>({key,label,value:rows.filter(row=>matchesApprovalFlowStat(row,key)).length}))},
    {label:"停留状态",items:[["stay3","停留3天以上"],["stay7","停留7天以上"]].map(([key,label])=>({key,label,value:rows.filter(row=>matchesApprovalFlowStat(row,key)).length}))}
  ],onChange:key=>setApprovalFlowStat(key)});
}

function setApprovalFlowStat(key){
  approvalFlowDetailState.filters=readApprovalFlowDetailFilters();
  approvalFlowDetailState.stat=approvalFlowDetailState.stat===key?"":key;
  approvalFlowDetailState.page=1;
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
}

function renderApprovalFlowOrgNodes(node=orgTreeData,level=1){
  if(!unifiedOrgTreeMatches(node,approvalFlowDetailState.orgKeyword))return "";
  const active=approvalFlowDetailState.orgId===node.id;
  return `
    <div class="org-tree-node org-level-indent-${Math.min(level,5)} ${active?"active":""}" onclick="selectApprovalFlowOrg('${node.id}')">
      <div class="org-node-left"><span class="approval-flow-org-level-icon" title="${level===1?"集团":level===2?"子公司":"分公司"}">${getUnifiedOrgTreeIcon(level)}</span><span class="org-node-name" title="${node.name}">${node.name}</span></div>
      <span class="approval-flow-org-count">${getApprovalFlowOrgCount(node.id)}</span>
    </div>
    ${(node.children||[]).map(child=>renderApprovalFlowOrgNodes(child,level+1)).join("")}`;
}

function renderApprovalFlowOrgPanel(){
  if(!approvalFlowDetailState.orgAggregate)return "";
  return `<section class="org-tree-panel approval-flow-org-panel unified-org-tree-panel">
    <div class="org-tree-hd"><div class="card-title">组织树</div></div>
    <div class="unified-org-tree-search"><input class="input" value="${escapeAttr(approvalFlowDetailState.orgKeyword)}" placeholder="请输入组织名称" oninput="filterApprovalFlowOrgTree(this.value)"/></div>
    <div class="org-tree-body" id="approvalFlowOrgTreeBody">${renderApprovalFlowOrgNodes()}</div>
  </section>`;
}

function filterApprovalFlowOrgTree(keyword){
  approvalFlowDetailState.orgKeyword=String(keyword||"");
  const body=document.getElementById("approvalFlowOrgTreeBody");
  if(body)body.innerHTML=renderApprovalFlowOrgNodes() || '<div class="unified-org-tree-empty">暂无匹配的组织</div>';
}

function renderApprovalFlowAggregateSwitch(){
  return `<label class="message-switch approval-flow-aggregate-switch">
    <span>按组织聚合</span>
    <input type="checkbox" ${approvalFlowDetailState.orgAggregate?"checked":""} onchange="toggleApprovalFlowOrgAggregate(this.checked)"/>
    <i></i>
  </label>`;
}

function renderApprovalFlowDetailPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";
  const f=approvalFlowDetailState.filters;
  const fields=`
    <div class="form-item"><label>审批内容</label><input id="approvalFlowContent" class="input" placeholder="请输入审批内容" value="${escapeAttr(f.content||"")}"/></div>
    <div class="form-item"><label>审批对象名称</label><input id="approvalFlowName" class="input" placeholder="请输入审批对象名称" value="${escapeAttr(f.name||"")}"/></div>
    <div class="form-item"><label>审批发起人姓名</label><input id="approvalFlowInitiator" class="input" placeholder="请输入审批发起人姓名" value="${escapeAttr(f.initiator||"")}"/></div>
    <div class="form-item"><label>审批人姓名</label><input id="approvalFlowApprover" class="input" placeholder="请输入审批人姓名" value="${escapeAttr(f.approver||"")}"/></div>
    <div class="form-item"><label>审批类型</label>${renderApprovalFlowDetailSelect("approvalFlowType",approvalFlowDetailOptions("type"),f.type)}</div>
    <div class="form-item"><label>审批状态</label>${renderApprovalFlowDetailSelect("approvalFlowStatus",approvalFlowDetailOptions("status"),f.status)}</div>
    <div class="form-item"><label>审批对象类型</label>${renderApprovalFlowDetailSelect("approvalFlowScope",approvalFlowDetailOptions("scope"),f.scope)}</div>
    <div class="form-item"><label>审批发起时间</label><div class="date-range ep-date-range"><input id="approvalFlowStartDate" class="input" type="date" value="${f.startDate||""}"/><span>至</span><input id="approvalFlowEndDate" class="input" type="date" value="${f.endDate||""}"/></div></div>`;
  const pages=Math.max(1,Math.ceil(approvalFlowDetailCurrent.length/approvalFlowDetailState.pageSize));
  const tableCard=renderUnifiedTableCard({title:"审批流程明细",tableKey:"approvalFlowDetail",tableId:"approvalFlowDetailTable",theadId:"approvalFlowDetailThead",tbodyId:"approvalFlowDetailTbody",totalId:"approvalFlowDetailTotalText",total:approvalFlowDetailCurrent.length,renderFnName:"renderApprovalFlowDetailTable",beforeActions:renderApprovalFlowAggregateSwitch(),refreshAction:"refreshApprovalFlowDetails()",exportAction:"exportApprovalFlowDetails()",pageText:`第 ${approvalFlowDetailState.page} / ${pages} 页　每页 ${approvalFlowDetailState.pageSize} 条`});
  listPage.innerHTML=`
    <div class="compact-title-row"><div class="module-title">审批流程管理 / 审批流程明细</div></div>
    ${renderUnifiedQueryCard(fields,{id:"approvalFlowDetailQueryCard",queryFn:"queryApprovalFlowDetails()",resetFn:"resetApprovalFlowDetails()",canCollapse:false})}
    ${renderApprovalFlowStats()}
    <div class="approval-flow-detail-layout ${approvalFlowDetailState.orgAggregate?"has-org":""}">
      ${renderApprovalFlowOrgPanel()}
      ${tableCard}
    </div>`;
  renderApprovalFlowDetailTable();
}

function readApprovalFlowDetailFilters(){
  return {
    content:document.getElementById("approvalFlowContent")?.value.trim()||"",
    name:document.getElementById("approvalFlowName")?.value.trim()||"",
    initiator:document.getElementById("approvalFlowInitiator")?.value.trim()||"",
    approver:document.getElementById("approvalFlowApprover")?.value.trim()||"",
    type:document.getElementById("approvalFlowType")?.value||"",
    status:document.getElementById("approvalFlowStatus")?.value||"",
    scope:document.getElementById("approvalFlowScope")?.value||"",
    startDate:document.getElementById("approvalFlowStartDate")?.value||"",
    endDate:document.getElementById("approvalFlowEndDate")?.value||""
  };
}

function queryApprovalFlowDetails(){
  const f=readApprovalFlowDetailFilters();
  approvalFlowDetailState.filters=f;
  approvalFlowDetailState.page=1;
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
}

function resetApprovalFlowDetails(){
  approvalFlowDetailState.filters={};
  approvalFlowDetailState.stat="";
  approvalFlowDetailState.page=1;
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
}

function toggleApprovalFlowOrgAggregate(checked){
  approvalFlowDetailState.filters=readApprovalFlowDetailFilters();
  approvalFlowDetailState.orgAggregate=Boolean(checked);
  approvalFlowDetailState.orgId=orgTreeData.id;
  approvalFlowDetailState.page=1;
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
}

function selectApprovalFlowOrg(orgId){
  approvalFlowDetailState.orgId=orgId;
  approvalFlowDetailState.page=1;
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
}

function refreshApprovalFlowDetails(){
  queryApprovalFlowDetails();
  showToast("审批流程明细已刷新");
}

function renderApprovalFlowDetailTable(){
  const start=(approvalFlowDetailState.page-1)*approvalFlowDetailState.pageSize;
  const rows=approvalFlowDetailCurrent.slice(start,start+approvalFlowDetailState.pageSize);
  const thead=document.getElementById("approvalFlowDetailThead");
  if(thead)replaceProductionDashboardFragment(thead,renderTableHeaderByColumns("approvalFlowDetail"));
  renderTableByColumns("approvalFlowDetail",rows,"approvalFlowDetailTbody");
}

function exportApprovalFlowDetails(){
  showToast(`导出成功：审批流程明细（${approvalFlowDetailCurrent.length}条）.xlsx`);
}

function getApprovalReminderBatchNo(row){
  return `AR${row.startTime.slice(0,10).replace(/-/g,"")}${String(row.id).padStart(4,"0")}`;
}

function ensureApprovalReminderRecords(row){
  const batchNo=getApprovalReminderBatchNo(row);
  if(messageRecordData.some(record=>record.batchNo===batchNo))return batchNo;
  const receiverNames=[row.approver,"王安全","陈审批","赵主管"];
  const orgName=row.orgPath.includes("上海隧道")?"上海隧道":row.orgPath.includes("市政集团")?"市政集团":row.orgPath.includes("上海路桥")?"上海路桥":row.orgPath.includes("数字集团")?"数字集团":"隧道股份";
  for(let index=0;index<row.reminders;index+=1){
    const read=index<Math.max(0,row.reminders-1);
    const clicked=index<Math.max(0,row.reminders-2);
    const hour=String(9+index).padStart(2,"0");
    messageRecordData.push({
      id:`approval-reminder-${row.id}-${index+1}`,
      batchNo,
      receiver:receiverNames[index%receiverNames.length],
      account:`approval${row.id}${index+1}`,
      org:orgName,
      project:row.scope==="项目"?row.name:"--",
      post:index===0?"当前审批人":"审批管理岗",
      type:"预警通知",
      biz:`基础管理>审批流程管理`,
      title:`审批流程督办提醒（第${index+1}次）`,
      content:`${row.name}的${row.type}流程已停留${formatApprovalFlowDuration(row.stayHours,row.stayMinutes)}，请尽快完成审批。`,
      channel:"站内信",
      deliverStatus:"发送成功",
      deliverTime:`2026-08-0${Math.min(4,index+1)} ${hour}:00:02`,
      sendTime:`2026-08-0${Math.min(4,index+1)} ${hour}:00:02`,
      readStatus:read?"已读":"未读",
      readTime:read?`2026-08-0${Math.min(4,index+1)} ${hour}:12:18`:"",
      clickStatus:clicked?"已点击":"未点击",
      clickTime:clicked?`2026-08-0${Math.min(4,index+1)} ${hour}:13:06`:"",
      failReason:""
    });
  }
  return batchNo;
}

function openApprovalReminderDrilldown(id){
  const row=approvalFlowDetailData.find(item=>item.id===id);
  if(!row)return;
  const batchNo=ensureApprovalReminderRecords(row);
  openSendRecordDrilldown(batchNo,"sent");
  modalTitle.innerText="督办提醒消息明细";
}

function superviseApprovalFlow(id){
  const row=approvalFlowDetailData.find(item=>item.id===id);
  if(!row||row.status!=="审批中")return;
  ensureApprovalReminderRecords(row);
  row.reminders+=1;
  const batchNo=getApprovalReminderBatchNo(row);
  const index=row.reminders-1;
  const hour=String(9+index).padStart(2,"0");
  messageRecordData.push({
    id:`approval-reminder-${row.id}-${row.reminders}`,batchNo,receiver:row.approver,account:`approval${row.id}${row.reminders}`,
    org:row.orgPath[1]||row.orgPath[0],project:row.scope==="项目"?row.name:"--",post:"当前审批人",type:"预警通知",biz:"基础管理>审批流程管理",
    title:`审批流程督办提醒（第${row.reminders}次）`,content:`${row.name}的${row.type}流程已停留${formatApprovalFlowDuration(row.stayHours,row.stayMinutes)}，请尽快完成审批。`,channel:"站内信",
    deliverStatus:"发送成功",deliverTime:`2026-08-05 ${hour}:00:02`,sendTime:`2026-08-05 ${hour}:00:02`,readStatus:"未读",readTime:"",clickStatus:"未点击",clickTime:"",failReason:""
  });
  applyApprovalFlowDetailFilters();
  renderApprovalFlowDetailPage();
  showToast(`督办消息已发送给${row.approver}`);
}

window.openSendRecordDrilldown=openSendRecordDrilldown;
window.openApprovalReminderDrilldown=openApprovalReminderDrilldown;
window.superviseApprovalFlow=superviseApprovalFlow;
if(!window.__approvalReminderDrilldownBound){
  window.__approvalReminderDrilldownBound=true;
  document.addEventListener("click",event=>{
    const trigger=event.target.closest?.(".approval-flow-reminder-link");
    if(!trigger)return;
    if(!trigger.dataset.todoReminderId)openApprovalReminderDrilldown(Number(trigger.dataset.approvalReminderId));
  });
}

function openApprovalFlowDetail(id){
  const row=approvalFlowDetailData.find(item=>item.id===id);
  if(!row)return;
  openModal("审批流程详情",`<div class="message-admin-detail">
    ${info("审批对象",row.scope)}${info("对象名称",row.name)}${info("审批类型",row.type)}${info("审批状态",approvalFlowDetailStatusTag(row.status))}
    ${info("审批发起人",row.initiator)}${info("审批发起时间",row.startTime)}${info("当前流程节点",row.node)}${info("当前审批人",row.approver)}
    ${info("流程到达时间",row.arrivalTime)}${info("已停留时长",formatApprovalFlowDuration(row.stayHours,row.stayMinutes))}${info("提醒次数",String(row.reminders))}
    <div class="message-admin-content"><strong>审批内容</strong>${row.content}</div>
  </div>`,`<button class="btn primary" onclick="closeModal()">关闭</button>`,"large");
}
