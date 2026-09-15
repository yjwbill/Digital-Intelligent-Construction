(function(global){
  const instances=new Map();

  function escapeHtml(value){
    return String(value??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function normalizeItem(item,index){
    return {
      key:String(item.key??index),
      label:String(item.label??""),
      value:item.value??0,
      metric:Boolean(item.metric),
      disabled:Boolean(item.disabled),
      className:String(item.className||""),
      title:String(item.title||""),
      onClick:typeof item.onClick==="function"?item.onClick:null
    };
  }

  function normalizeConfig(config={}){
    const id=String(config.id||`statistics-filter-${instances.size+1}`);
    const groups=(config.groups||[]).map((group,index)=>({
      key:String(group.key??index),
      label:String(group.label??""),
      className:String(group.className||""),
      items:(group.items||[]).map(normalizeItem)
    }));
    return {
      id,
      groups,
      activeKey:config.activeKey==null?"":String(config.activeKey),
      className:String(config.className||""),
      ariaLabel:String(config.ariaLabel||"筛选统计"),
      onChange:typeof config.onChange==="function"?config.onChange:null
    };
  }

  function render(config={}){
    const normalized=normalizeConfig(config);
    instances.set(normalized.id,normalized);
    const groups=normalized.groups.map(group=>`
      <div class="construction-project-stat-group statistics-filter__group ${escapeHtml(group.className)}">
        <div class="construction-project-stat-name statistics-filter__group-label">${String(group.label??"").split(/\\n|\n/).map(escapeHtml).join("<br>")}</div>
        <div class="construction-project-stat-items statistics-filter__items">
          ${group.items.map(item=>{
            const active=normalized.activeKey===item.key;
            const interactive=!item.metric&&!item.disabled;
            const title=item.title?` title="${escapeHtml(item.title)}"`:"";
            return `<button type="button" class="construction-project-stat-item statistics-filter__item ${active?"active":""} ${item.metric?"metric-only":""} ${item.className}" data-statistics-filter-key="${escapeHtml(item.key)}" ${interactive?`onclick="StatisticsFilter.select('${escapeHtml(normalized.id)}','${escapeHtml(item.key)}')"`:""} ${item.disabled?"disabled":""}${title}><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></button>`;
          }).join("")}
        </div>
      </div>`).join("");
    return `<section class="card construction-project-stat-card statistics-filter ${escapeHtml(normalized.className)}" data-statistics-filter-id="${escapeHtml(normalized.id)}" aria-label="${escapeHtml(normalized.ariaLabel)}"><div class="card-bd"><div class="construction-project-stats statistics-filter__groups">${groups}</div></div></section>`;
  }

  function select(id,key){
    const config=instances.get(String(id));
    if(!config)return;
    const item=config.groups.flatMap(group=>group.items).find(candidate=>candidate.key===String(key));
    if(!item||item.metric||item.disabled)return;
    if(item.onClick)item.onClick(item.key,item);
    else if(config.onChange)config.onChange(item.key,item);
  }

  function clear(id){
    instances.delete(String(id));
  }

  global.StatisticsFilter={render,select,clear};
})(window);
