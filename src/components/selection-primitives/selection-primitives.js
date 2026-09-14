(function(global){
  const checkboxInstances=new Map();
  const popoverInstances=new Map();
  const comboboxInstances=new Map();
  const multiSelectInstances=new Map();

  function escapeHtml(value){
    return String(value??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function normalizeOptions(options=[]){
    return options.map((option,index)=>typeof option==="object"
      ?{value:String(option.value??option.label??index),label:String(option.label??option.value??index),disabled:Boolean(option.disabled)}
      :{value:String(option),label:String(option),disabled:false});
  }

  function createId(prefix,size){return `${prefix}-${size+1}`;}

  function checkboxMarkup(state){
    const mixed=state.indeterminate;
    return `<button type="button" id="${escapeHtml(state.id)}" class="DscCheckbox ${state.checked?"is-checked":""} ${mixed?"is-indeterminate":""} ${state.disabled?"is-disabled":""} ${escapeHtml(state.className)}" role="checkbox" aria-checked="${mixed?"mixed":state.checked}" ${state.disabled?"disabled":""} onclick="DscCheckbox.toggle('${escapeHtml(state.id)}',event)"><span class="DscCheckbox__box" aria-hidden="true"></span><span class="DscCheckbox__label">${escapeHtml(state.label)}</span></button>`;
  }

  const DscCheckbox={
    render(config={}){
      const state={id:String(config.id||createId("dsc-checkbox",checkboxInstances.size)),label:String(config.label||""),checked:Boolean(config.checked),indeterminate:Boolean(config.indeterminate),disabled:Boolean(config.disabled),className:String(config.className||""),onChange:typeof config.onChange==="function"?config.onChange:null};
      checkboxInstances.set(state.id,state);
      return checkboxMarkup(state);
    },
    toggle(id,event){
      event?.stopPropagation?.();
      const state=checkboxInstances.get(String(id));
      if(!state||state.disabled)return;
      state.checked=state.indeterminate?true:!state.checked;
      state.indeterminate=false;
      document.getElementById(state.id)?.replaceWith(htmlToElement(checkboxMarkup(state)));
      state.onChange?.(state.checked);
    },
    getValue(id){return Boolean(checkboxInstances.get(String(id))?.checked);},
    setValue(id,checked){const state=checkboxInstances.get(String(id));if(!state)return;state.checked=Boolean(checked);state.indeterminate=false;document.getElementById(state.id)?.replaceWith(htmlToElement(checkboxMarkup(state)));}
  };

  function popoverMarkup(state){
    return `<div class="DscPopover ${state.open?"is-open":""} ${escapeHtml(state.className)}" data-dsc-popover="${escapeHtml(state.id)}"><button type="button" class="DscPopover__trigger ${escapeHtml(state.triggerClassName)}" aria-expanded="${state.open}" aria-controls="${escapeHtml(state.id)}Panel" onclick="DscPopover.toggle('${escapeHtml(state.id)}',event)">${state.triggerHtml}</button><div id="${escapeHtml(state.id)}Panel" class="DscPopover__content DscPopover__content--${escapeHtml(state.align)}" role="dialog" style="--dsc-popover-width:${state.width}px" ${state.open?"":"hidden"} onclick="event.stopPropagation()">${state.contentHtml}</div></div>`;
  }

  const DscPopover={
    render(config={}){
      const state={id:String(config.id||createId("dsc-popover",popoverInstances.size)),triggerHtml:String(config.triggerHtml||"打开"),contentHtml:String(config.contentHtml||""),triggerClassName:String(config.triggerClassName||"btn"),className:String(config.className||""),align:["start","center","end"].includes(config.align)?config.align:"start",width:Math.max(160,Number(config.width)||280),open:false};
      popoverInstances.set(state.id,state);
      return popoverMarkup(state);
    },
    toggle(id,event){event?.stopPropagation?.();const state=popoverInstances.get(String(id));if(!state)return;const next=!state.open;DscPopover.closeAll();state.open=next;syncPopover(state);if(next)setTimeout(()=>DscPopover.position(id),0);},
    close(id){const state=popoverInstances.get(String(id));if(!state||!state.open)return;state.open=false;syncPopover(state);},
    closeAll(){popoverInstances.forEach(state=>{if(state.open){state.open=false;syncPopover(state);}});},
    position(id){
      const state=popoverInstances.get(String(id));
      const root=document.querySelector(`[data-dsc-popover="${cssEscape(id)}"]`);
      const panel=root?.querySelector(".DscPopover__content");
      if(!state?.open||!root||!panel)return;
      panel.classList.remove("is-above");panel.style.marginLeft="0px";
      let rect=panel.getBoundingClientRect();
      const rootRect=root.getBoundingClientRect();
      if(rect.bottom>window.innerHeight-8&&rootRect.top>window.innerHeight-rootRect.bottom){panel.classList.add("is-above");rect=panel.getBoundingClientRect();}
      const shift=rect.left<8?8-rect.left:rect.right>window.innerWidth-8?window.innerWidth-8-rect.right:0;
      panel.style.marginLeft=`${shift}px`;
    }
  };

  function syncPopover(state){
    const root=document.querySelector(`[data-dsc-popover="${cssEscape(state.id)}"]`);
    if(!root)return;
    root.classList.toggle("is-open",state.open);
    root.querySelector(".DscPopover__trigger")?.setAttribute("aria-expanded",String(state.open));
    const panel=root.querySelector(".DscPopover__content");
    if(panel)panel.hidden=!state.open;
  }

  function comboboxMarkup(state){
    const selected=state.options.find(option=>option.value===state.value);
    return `<div class="DscCombobox ${state.open?"is-open":""} ${state.disabled?"is-disabled":""} ${escapeHtml(state.className)}" data-dsc-combobox="${escapeHtml(state.id)}"><button type="button" class="DscCombobox__control" aria-expanded="${state.open}" ${state.disabled?"disabled":""} onclick="DscCombobox.toggle('${escapeHtml(state.id)}',event)"><span class="${selected?"":"is-placeholder"}">${escapeHtml(selected?.label||state.placeholder)}</span><i aria-hidden="true"></i></button><div class="DscCombobox__panel" ${state.open?"":"hidden"} onclick="event.stopPropagation()"><div class="DscCombobox__search"><input value="${escapeHtml(state.query)}" placeholder="${escapeHtml(state.searchPlaceholder)}" oninput="DscCombobox.filter('${escapeHtml(state.id)}',this.value)" onkeydown="DscCombobox.handleKey('${escapeHtml(state.id)}',event)"></div><div class="DscCombobox__options" role="listbox">${renderComboboxOptions(state)}</div></div></div>`;
  }

  function renderComboboxOptions(state){
    const query=state.query.trim().toLowerCase();
    const options=state.options.map((option,index)=>({...option,index})).filter(option=>!query||option.label.toLowerCase().includes(query));
    if(!options.length)return `<div class="DscSelection__empty">暂无匹配项</div>`;
    return options.map(option=>`<button type="button" role="option" aria-selected="${option.value===state.value}" class="DscSelection__option ${option.value===state.value?"is-selected":""} ${option.index===state.activeIndex?"is-active":""}" ${option.disabled?"disabled":""} onclick="DscCombobox.select('${escapeHtml(state.id)}',${option.index},event)"><span>${escapeHtml(option.label)}</span><i aria-hidden="true"></i></button>`).join("");
  }

  const DscCombobox={
    render(config={}){
      const state={id:String(config.id||createId("dsc-combobox",comboboxInstances.size)),options:normalizeOptions(config.options),value:String(config.value??""),placeholder:String(config.placeholder||"请选择"),searchPlaceholder:String(config.searchPlaceholder||"搜索选项"),disabled:Boolean(config.disabled),className:String(config.className||""),open:false,query:"",activeIndex:-1,onChange:typeof config.onChange==="function"?config.onChange:null};
      comboboxInstances.set(state.id,state);
      return comboboxMarkup(state);
    },
    toggle(id,event){event?.stopPropagation?.();const state=comboboxInstances.get(String(id));if(!state||state.disabled)return;const next=!state.open;closeSelectionOverlays();state.open=next;state.query="";state.activeIndex=-1;syncCombobox(state);if(next)setTimeout(()=>document.querySelector(`[data-dsc-combobox="${cssEscape(state.id)}"] input`)?.focus(),0);},
    filter(id,value){const state=comboboxInstances.get(String(id));if(!state)return;state.query=String(value||"");state.activeIndex=-1;refreshComboboxOptions(state);},
    select(id,index,event){event?.stopPropagation?.();const state=comboboxInstances.get(String(id));const option=state?.options[Number(index)];if(!state||!option||option.disabled)return;state.value=option.value;state.open=false;state.query="";syncCombobox(state,true);state.onChange?.(state.value,option);},
    handleKey(id,event){
      const state=comboboxInstances.get(String(id));if(!state)return;
      if(event.key==="Escape"){event.preventDefault();DscCombobox.close(id);return;}
      const query=state.query.trim().toLowerCase();const enabled=state.options.map((option,index)=>({...option,index})).filter(option=>!option.disabled&&(!query||option.label.toLowerCase().includes(query)));
      if(!["ArrowDown","ArrowUp","Enter"].includes(event.key))return;
      event.preventDefault();
      if(event.key==="Enter"&&state.activeIndex>=0){DscCombobox.select(id,state.activeIndex,event);return;}
      if(!enabled.length)return;
      const current=enabled.findIndex(option=>option.index===state.activeIndex);const delta=event.key==="ArrowUp"?-1:1;
      state.activeIndex=enabled[(current+delta+enabled.length)%enabled.length].index;refreshComboboxOptions(state);scrollActiveOption(state.id,"combobox");
    },
    close(id){const state=comboboxInstances.get(String(id));if(!state||!state.open)return;state.open=false;state.query="";state.activeIndex=-1;syncCombobox(state,true);},
    closeAll(){comboboxInstances.forEach(state=>{if(state.open){state.open=false;state.query="";state.activeIndex=-1;syncCombobox(state,true);}});},
    getValue(id){return comboboxInstances.get(String(id))?.value||"";}
  };

  function syncCombobox(state,replace=false){
    const root=document.querySelector(`[data-dsc-combobox="${cssEscape(state.id)}"]`);
    if(!root)return;
    if(replace)root.replaceWith(htmlToElement(comboboxMarkup(state)));
    else{
      root.classList.toggle("is-open",state.open);
      root.querySelector(".DscCombobox__control")?.setAttribute("aria-expanded",String(state.open));
      const panel=root.querySelector(".DscCombobox__panel");if(panel)panel.hidden=!state.open;
    }
  }

  function refreshComboboxOptions(state){
    const root=document.querySelector(`[data-dsc-combobox="${cssEscape(state.id)}"]`);
    const options=root?.querySelector(".DscCombobox__options");
    if(options)options.innerHTML=renderComboboxOptions(state);
  }

  function multiSelectMarkup(state){
    const selected=state.options.filter(option=>state.values.includes(option.value));
    const shown=selected.slice(0,state.maxTagCount);
    return `<div class="DscMultiSelect ${state.open?"is-open":""} ${state.disabled?"is-disabled":""} ${escapeHtml(state.className)}" data-dsc-multi-select="${escapeHtml(state.id)}"><button type="button" class="DscMultiSelect__control" aria-expanded="${state.open}" ${state.disabled?"disabled":""} onclick="DscMultiSelect.toggle('${escapeHtml(state.id)}',event)"><span class="DscMultiSelect__tags">${shown.map(option=>`<span class="DscMultiSelect__tag">${escapeHtml(option.label)}<i role="button" aria-label="移除${escapeHtml(option.label)}" onclick="DscMultiSelect.remove('${escapeHtml(state.id)}','${escapeHtml(option.value)}',event)">×</i></span>`).join("")}${selected.length>shown.length?`<span class="DscMultiSelect__tag DscMultiSelect__tag--count">+${selected.length-shown.length}</span>`:""}${selected.length?"":`<span class="is-placeholder">${escapeHtml(state.placeholder)}</span>`}</span>${selected.length?`<i class="DscMultiSelect__clear" role="button" aria-label="清空" onclick="DscMultiSelect.clear('${escapeHtml(state.id)}',event)">×</i>`:""}<i class="DscMultiSelect__arrow" aria-hidden="true"></i></button><div class="DscMultiSelect__panel" ${state.open?"":"hidden"} onclick="event.stopPropagation()"><div class="DscCombobox__search"><input value="${escapeHtml(state.query)}" placeholder="${escapeHtml(state.searchPlaceholder)}" oninput="DscMultiSelect.filter('${escapeHtml(state.id)}',this.value)" onkeydown="DscMultiSelect.handleKey('${escapeHtml(state.id)}',event)"></div><div class="DscMultiSelect__options" role="listbox" aria-multiselectable="true">${renderMultiSelectOptions(state)}</div></div></div>`;
  }

  function renderMultiSelectOptions(state){
    const query=state.query.trim().toLowerCase();
    const options=state.options.map((option,index)=>({...option,index})).filter(option=>!query||option.label.toLowerCase().includes(query));
    if(!options.length)return `<div class="DscSelection__empty">暂无匹配项</div>`;
    const selectable=state.options.filter(option=>!option.disabled);
    const selectedCount=selectable.filter(option=>state.values.includes(option.value)).length;
    const selectAll=!query&&state.showSelectAll?`<button type="button" role="option" aria-selected="${selectedCount===selectable.length&&selectable.length>0}" class="DscSelection__option DscSelection__select-all ${selectedCount===selectable.length&&selectable.length>0?"is-selected":""} ${selectedCount>0&&selectedCount<selectable.length?"is-indeterminate":""}" onclick="DscMultiSelect.toggleAll('${escapeHtml(state.id)}',event)"><i class="DscSelection__checkbox" aria-hidden="true"></i><span>全部</span></button>`:"";
    return selectAll+options.map(option=>`<button type="button" role="option" aria-selected="${state.values.includes(option.value)}" class="DscSelection__option ${state.values.includes(option.value)?"is-selected":""} ${option.index===state.activeIndex?"is-active":""}" ${option.disabled?"disabled":""} onclick="DscMultiSelect.select('${escapeHtml(state.id)}',${option.index},event)"><i class="DscSelection__checkbox" aria-hidden="true"></i><span>${escapeHtml(option.label)}</span></button>`).join("");
  }

  const DscMultiSelect={
    render(config={}){
      const options=normalizeOptions(config.options);const available=new Set(options.map(option=>option.value));
      const state={id:String(config.id||createId("dsc-multi-select",multiSelectInstances.size)),options,values:[...new Set((config.values||[]).map(String))].filter(value=>available.has(value)),placeholder:String(config.placeholder||"请选择"),searchPlaceholder:String(config.searchPlaceholder||"搜索选项"),maxTagCount:Math.max(1,Number(config.maxTagCount)||2),showSelectAll:config.showSelectAll!==false,disabled:Boolean(config.disabled),className:String(config.className||""),open:false,query:"",activeIndex:-1,onChange:typeof config.onChange==="function"?config.onChange:null};
      multiSelectInstances.set(state.id,state);
      return multiSelectMarkup(state);
    },
    toggle(id,event){event?.stopPropagation?.();const state=multiSelectInstances.get(String(id));if(!state||state.disabled)return;const next=!state.open;closeSelectionOverlays();state.open=next;state.query="";state.activeIndex=-1;syncMultiSelect(state,true);if(next)setTimeout(()=>document.querySelector(`[data-dsc-multi-select="${cssEscape(state.id)}"] input`)?.focus(),0);},
    filter(id,value){const state=multiSelectInstances.get(String(id));if(!state)return;state.query=String(value||"");state.activeIndex=-1;refreshMultiSelectOptions(state);},
    select(id,index,event){event?.stopPropagation?.();const state=multiSelectInstances.get(String(id));const option=state?.options[Number(index)];if(!state||!option||option.disabled)return;state.values=state.values.includes(option.value)?state.values.filter(value=>value!==option.value):state.values.concat(option.value);syncMultiSelect(state,true);setTimeout(()=>document.querySelector(`[data-dsc-multi-select="${cssEscape(state.id)}"] input`)?.focus(),0);state.onChange?.([...state.values]);},
    toggleAll(id,event){event?.stopPropagation?.();const state=multiSelectInstances.get(String(id));if(!state)return;const available=state.options.filter(option=>!option.disabled).map(option=>option.value);const allSelected=available.length&&available.every(value=>state.values.includes(value));state.values=allSelected?state.values.filter(value=>!available.includes(value)):[...new Set(state.values.concat(available))];syncMultiSelect(state,true);setTimeout(()=>document.querySelector(`[data-dsc-multi-select="${cssEscape(state.id)}"] input`)?.focus(),0);state.onChange?.([...state.values]);},
    remove(id,value,event){event?.preventDefault?.();event?.stopPropagation?.();const state=multiSelectInstances.get(String(id));if(!state)return;state.values=state.values.filter(item=>item!==String(value));syncMultiSelect(state,true);state.onChange?.([...state.values]);},
    clear(id,event){event?.preventDefault?.();event?.stopPropagation?.();const state=multiSelectInstances.get(String(id));if(!state)return;state.values=[];syncMultiSelect(state,true);state.onChange?.([]);},
    handleKey(id,event){
      const state=multiSelectInstances.get(String(id));if(!state)return;
      if(event.key==="Escape"){event.preventDefault();DscMultiSelect.close(id);return;}
      const query=state.query.trim().toLowerCase();const enabled=state.options.map((option,index)=>({...option,index})).filter(option=>!option.disabled&&(!query||option.label.toLowerCase().includes(query)));
      if(!["ArrowDown","ArrowUp","Enter"].includes(event.key))return;
      event.preventDefault();
      if(event.key==="Enter"&&state.activeIndex>=0){DscMultiSelect.select(id,state.activeIndex,event);return;}
      if(!enabled.length)return;
      const current=enabled.findIndex(option=>option.index===state.activeIndex);const delta=event.key==="ArrowUp"?-1:1;
      state.activeIndex=enabled[(current+delta+enabled.length)%enabled.length].index;refreshMultiSelectOptions(state);scrollActiveOption(state.id,"multi-select");
    },
    close(id){const state=multiSelectInstances.get(String(id));if(!state||!state.open)return;state.open=false;state.query="";state.activeIndex=-1;syncMultiSelect(state,true);},
    closeAll(){multiSelectInstances.forEach(state=>{if(state.open){state.open=false;state.query="";state.activeIndex=-1;syncMultiSelect(state,true);}});},
    getValue(id){return [...(multiSelectInstances.get(String(id))?.values||[])];},
    setValue(id,values=[]){const state=multiSelectInstances.get(String(id));if(!state)return;const available=new Set(state.options.map(option=>option.value));state.values=[...new Set(values.map(String))].filter(value=>available.has(value));syncMultiSelect(state,true);}
  };

  function syncMultiSelect(state,replace=false){
    const root=document.querySelector(`[data-dsc-multi-select="${cssEscape(state.id)}"]`);
    if(!root)return;
    if(replace)root.replaceWith(htmlToElement(multiSelectMarkup(state)));
    else{
      root.classList.toggle("is-open",state.open);
      root.querySelector(".DscMultiSelect__control")?.setAttribute("aria-expanded",String(state.open));
      const panel=root.querySelector(".DscMultiSelect__panel");if(panel)panel.hidden=!state.open;
    }
  }

  function refreshMultiSelectOptions(state){
    const root=document.querySelector(`[data-dsc-multi-select="${cssEscape(state.id)}"]`);
    const options=root?.querySelector(".DscMultiSelect__options");
    if(options)options.innerHTML=renderMultiSelectOptions(state);
  }

  function scrollActiveOption(id,type){
    const selector=type==="combobox"?`[data-dsc-combobox="${cssEscape(id)}"]`:`[data-dsc-multi-select="${cssEscape(id)}"]`;
    document.querySelector(`${selector} .DscSelection__option.is-active`)?.scrollIntoView?.({block:"nearest"});
  }

  function htmlToElement(html){const template=document.createElement("template");template.innerHTML=html.trim();return template.content.firstElementChild;}
  function cssEscape(value){return global.CSS?.escape?global.CSS.escape(String(value)):String(value).replace(/[^a-zA-Z0-9_-]/g,"\\$&");}
  function closeSelectionOverlays(){DscPopover.closeAll();DscCombobox.closeAll();DscMultiSelect.closeAll();}

  document.addEventListener("click",closeSelectionOverlays);
  document.addEventListener("keydown",event=>{if(event.key==="Escape")closeSelectionOverlays();});
  window.addEventListener("resize",()=>popoverInstances.forEach(state=>{if(state.open)DscPopover.position(state.id);}));
  global.DscCheckbox=DscCheckbox;
  global.DscPopover=DscPopover;
  global.DscCombobox=DscCombobox;
  global.DscMultiSelect=DscMultiSelect;

  // Upgrade organization fields in queries/forms to the shared searchable combobox.
  function upgradeOrganizationComboboxes(root=document){
    root.querySelectorAll?.('.form-item, .field, .query-item').forEach(item=>{
      if(item.querySelector('[data-org-combobox-upgraded]'))return;
      const label=item.querySelector(':scope > label');
      if(!label||!['子公司','分公司','集团下属子公司','子公司管理单位'].includes(label.textContent.trim()))return;
      const control=item.querySelector('select, input'); if(!control||!control.id)return;
      const id=control.id, options=control.tagName==='SELECT'
        ?Array.from(control.options).map(o=>({value:o.value,label:o.textContent.trim()}))
        :['','上海隧道','市政集团','上海路桥','城建集团'].map(v=>({value:v,label:v||'全部'}));
      const value=control.value||''; control.style.display='none'; control.setAttribute('data-org-combobox-upgraded','true');
      const holder=document.createElement('div'); holder.setAttribute('data-org-combobox-upgraded','true'); holder.innerHTML=DscCombobox.render({id:`org-combo-${id}`,options,value,placeholder:'全部',searchPlaceholder:'搜索组织',onChange:(next)=>{control.value=next;control.dispatchEvent(new Event('change',{bubbles:true}));}}); control.insertAdjacentElement('afterend',holder);
    });
  }
  global.upgradeOrganizationComboboxes=upgradeOrganizationComboboxes;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>upgradeOrganizationComboboxes());else upgradeOrganizationComboboxes();
  new MutationObserver(()=>upgradeOrganizationComboboxes()).observe(document.body,{childList:true,subtree:true});
})(window);
