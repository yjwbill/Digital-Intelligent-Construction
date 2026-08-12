(function(global){
  const defaultFilters={
    projectName:"",projectCode:"",subCompany:"",branchCompany:"",projectManager:"",
    projectStatus:"",region:"",provinceCity:"",projectType:"",implementationMode:"",
    controlLevel:"",generalContractor:"",builder:""
  };

  function normalizeIds(rows=[],values=[]){
    const result=[];
    (values||[]).forEach(value=>{
      const normalized=String(value??"").trim();
      const row=rows.find(item=>String(item.id)===normalized||item.projectCode===normalized||item.projectName===normalized);
      if(row&&!result.includes(String(row.id)))result.push(String(row.id));
    });
    return result;
  }

  function initializeState(state,options={}){
    const rows=options.rows||[];
    const selectedIds=normalizeIds(rows,options.selectedIds||[]);
    state.targetId=options.targetId||"";
    state.confirmHandler=typeof options.onConfirm==="function"?options.onConfirm:null;
    state.initialSelectedIds=[...selectedIds];
    state.excludedSelectedIds=options.excludeSelected===false?[]:[...selectedIds];
    state.draftSelectedIds=options.excludeSelected===false?[...selectedIds]:[];
    state.filters={...defaultFilters};
    state.page=1;
    state.pageSize=Number(options.pageSize)||50;
    return state;
  }

  function getAvailableRows(state,rows=[]){
    const excluded=new Set((state.excludedSelectedIds||[]).map(String));
    return rows.filter(row=>!excluded.has(String(row.id)));
  }

  function toggle(state,id,checked){
    const selected=new Set((state.draftSelectedIds||[]).map(String));
    checked?selected.add(String(id)):selected.delete(String(id));
    state.draftSelectedIds=[...selected];
    return state.draftSelectedIds;
  }

  function getSelectedCount(state){
    return (state.draftSelectedIds||[]).length;
  }

  function getConfirmedIds(state){
    return [...new Set([...(state.initialSelectedIds||[]),...(state.draftSelectedIds||[])].map(String))];
  }

  function renderPagination(state,total,page,pages,pageSize){
    return `<span id="messageReceiverProjectPickerTotalText">共 ${total} 条</span><span id="messageProjectPickerPageText">第 ${page} / ${pages} 页　每页 ${pageSize} 条</span>`;
  }

  function renderFooter(state,actionsHtml){
    return `<span class="project-selector-footer-count">已勾选 <b id="projectSelectorSelectedCount">${getSelectedCount(state)}</b> 条数据</span><span class="project-selector-footer-actions">${actionsHtml||""}</span>`;
  }

  function updateSelectedCount(state){
    const count=document.getElementById("projectSelectorSelectedCount");
    if(count)count.textContent=String(getSelectedCount(state));
  }

  function renderLibraryPreview(){
    return `<div class="project-selector-library-demo">
      <div class="project-selector-library-query"><strong>查询条件</strong><div><label>项目名称<input class="input" placeholder="请输入项目名称"></label><label>项目编号<input class="input" placeholder="请输入项目编号"></label><label>子公司<select class="select"><option>全部</option></select></label><label>分公司<select class="select"><option>全部</option></select></label></div></div>
      <div class="project-selector-library-table"><header><strong>项目列表</strong><span><button class="btn">刷新</button><button class="btn primary">导出</button><button class="column-setting-icon-btn">⚙</button></span></header><table><thead><tr><th><input type="checkbox"></th><th>序号</th><th>项目名称</th><th>子公司</th><th>项目经理</th><th>项目状态</th></tr></thead><tbody><tr><td><input type="checkbox" checked></td><td>1</td><td>机场联络线工程</td><td>上海隧道</td><td>张项目</td><td><span class="tag green">在建</span></td></tr><tr><td><input type="checkbox"></td><td>2</td><td>大外环西段项目</td><td>市政集团</td><td>王经理</td><td><span class="tag orange">停工</span></td></tr></tbody></table><footer><span>共 29 条</span><span>第 1 / 1 页　每页 50 条</span></footer><div class="project-selector-library-modal-footer"><span>已勾选 <b>1</b> 条数据</span><span><button class="btn">取消</button><button class="btn primary">确定</button></span></div></div>
      <p>标准项目选择器统一查询、列表、多选、分页和确认交互；历史已选项目不再进入候选清单，已勾选数量在弹框底部操作栏实时展示。</p>
    </div>`;
  }

  global.ProjectSelector={defaultFilters,normalizeIds,initializeState,getAvailableRows,toggle,getSelectedCount,getConfirmedIds,renderPagination,renderFooter,updateSelectedCount,renderLibraryPreview};
})(window);
