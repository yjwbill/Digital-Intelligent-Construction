(function(){
  const instances=new Map();

  function text(value){
    return String(value==null?"":value).trim();
  }

  function encode(value){
    return encodeURIComponent(text(value));
  }

  function getRecordValue(record,key){
    if(typeof key==="function")return text(key(record));
    return text(record?.[key]);
  }

  function getOrganizationIndex(){
    const rows=(Array.isArray(window.__ORGANIZATION_MASTER_DATA__)?window.__ORGANIZATION_MASTER_DATA__:[]).map(item=>({
      code:item.code,
      name:item.name,
      level:Number(item.level),
      parentCode:item.parentCode||item.parent_code||""
    }));
    const companies=rows.filter(item=>Number(item.level)===2);
    const companyByName=new Map(companies.map(item=>[item.name,item]));
    const branchesByCompany=new Map(companies.map(item=>[item.name,[]]));
    rows.filter(item=>Number(item.level)===3).forEach(branch=>{
      const company=companies.find(item=>item.code===branch.parentCode);
      if(company)branchesByCompany.get(company.name).push(branch.name);
    });
    return {companies,companyByName,branchesByCompany};
  }

  function derive(records=[],companyKey="company",branchKey="branch"){
    const index=getOrganizationIndex();
    const usedCompanies=new Set();
    const usedBranches=new Map();
    records.forEach(record=>{
      const company=getRecordValue(record,companyKey);
      const branch=getRecordValue(record,branchKey);
      if(!index.companyByName.has(company))return;
      usedCompanies.add(company);
      if(!usedBranches.has(company))usedBranches.set(company,new Set());
      if(index.branchesByCompany.get(company)?.includes(branch))usedBranches.get(company).add(branch);
    });
    const companies=index.companies.map(item=>item.name).filter(name=>usedCompanies.has(name));
    const branches={};
    companies.forEach(company=>{
      branches[company]=(index.branchesByCompany.get(company)||[]).filter(name=>usedBranches.get(company)?.has(name));
    });
    return {companies,branches};
  }

  function normalize(state,options){
    const company=options.companies.includes(text(state?.company))?text(state.company):"";
    const branches=company?(options.branches[company]||[]):[];
    const branch=branches.includes(text(state?.branch))?text(state.branch):"";
    return {company,branch};
  }

  function renderButtons(values,active,id,level){
    return ["",...values].map(value=>{
      const label=value||"全部";
      return `<button type="button" class="${value===active?"active":""}" data-org-level="${level}" data-org-value="${encode(value)}" onclick="DashboardOrgSwitch.select('${id}','${level}','${encode(value)}')">${label}</button>`;
    }).join("");
  }

  function render(config={}){
    const id=text(config.id)||"dashboard-org-switch";
    const options=derive(config.records||[],config.companyKey||"company",config.branchKey||"branch");
    const state=normalize(config.state||{},options);
    instances.set(id,{...config,options,state});
    const branchValues=state.company?(options.branches[state.company]||[]):[];
    return `<div class="dashboard-org-switch" data-dashboard-org-switch="${id}">
      <div class="dashboard-org-switch-row dashboard-org-switch-company" aria-label="子公司切换">${renderButtons(options.companies,state.company,id,"company")}</div>
      ${state.company?`<div class="dashboard-org-switch-row dashboard-org-switch-branch" aria-label="分公司切换">${renderButtons(branchValues,state.branch,id,"branch")}</div>`:""}
    </div>`;
  }

  function select(id,level,encodedValue){
    const instance=instances.get(text(id));
    if(!instance)return;
    const value=decodeURIComponent(text(encodedValue));
    const next={...instance.state};
    if(level==="company"){
      next.company=instance.options.companies.includes(value)?value:"";
      next.branch="";
    }else if(level==="branch"){
      const branches=next.company?(instance.options.branches[next.company]||[]):[];
      next.branch=branches.includes(value)?value:"";
    }
    instance.state=next;
    if(typeof instance.onChange==="function")instance.onChange({...next});
  }

  function filter(records=[],state={},companyKey="company",branchKey="branch"){
    const company=text(state.company);
    const branch=text(state.branch);
    return records.filter(record=>(!company||getRecordValue(record,companyKey)===company)&&(!branch||getRecordValue(record,branchKey)===branch));
  }

  window.DashboardOrgSwitch={derive,normalize,render,select,filter};
})();
