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

  function normalizeMonth(value,fallback){
    const matched=String(value||"").match(/^(\d{4})-(0[1-9]|1[0-2])$/);
    return matched?matched[0]:fallback;
  }

  function currentMonth(){
    const now=new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  }

  function normalizeConfig(config={}){
    const id=String(config.id||`month-picker-${instances.size+1}`);
    const max=normalizeMonth(config.max,currentMonth());
    const value=normalizeMonth(config.value,max);
    return {
      id,
      value,
      max,
      viewYear:Number(config.viewYear||value.slice(0,4)),
      theme:config.theme==="screen"?"screen":"default",
      locale:config.locale==="en"?"en":"zh",
      placeholder:String(config.placeholder||"请选择年月"),
      disabled:Boolean(config.disabled),
      open:false,
      className:String(config.className||""),
      onChange:typeof config.onChange==="function"?config.onChange:null
    };
  }

  function formatLabel(value,locale="zh"){
    const [year,month]=String(value).split("-");
    if(locale==="en")return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(month)-1]} ${year}`;
    return `${year}年${month}月`;
  }

  function renderPanel(state){
    return `
      <div class="MonthPicker__head">
        <button type="button" aria-label="${state.locale==="en"?"Previous year":"上一年"}" title="${state.locale==="en"?"Previous year":"上一年"}" onclick="MonthPicker.moveYear('${escapeHtml(state.id)}',-1,event)">‹</button>
        <strong>${state.viewYear}${state.locale==="en"?"":"年"}</strong>
        <button type="button" aria-label="${state.locale==="en"?"Next year":"下一年"}" title="${state.locale==="en"?"Next year":"下一年"}" onclick="MonthPicker.moveYear('${escapeHtml(state.id)}',1,event)">›</button>
      </div>
      <div class="MonthPicker__grid">
        ${Array.from({length:12},(_,index)=>index+1).map(month=>{
          const monthValue=`${state.viewYear}-${String(month).padStart(2,"0")}`;
          const disabled=monthValue>state.max;
          const selected=monthValue===state.value;
          const monthLabel=state.locale==="en"?["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month-1]:`${month}月`;
          return `<button type="button" class="${selected?"selected":""} ${disabled?"disabled":""}" ${disabled?"disabled":""} onclick="MonthPicker.select('${escapeHtml(state.id)}','${monthValue}',event)"><span>${monthLabel}</span></button>`;
        }).join("")}
      </div>`;
  }

  function render(config={}){
    const state=normalizeConfig(config);
    instances.set(state.id,state);
    const calendar=state.theme==="screen"
      ?'<img class="MonthPicker__calendar" src="./src/assets/economy/economy-month-picker-file.svg" alt="">'
      :'<img class="MonthPicker__calendar" src="./src/components/month-picker/calendar.svg" alt="" aria-hidden="true">';
    const arrow=state.theme==="screen"
      ?'<img class="MonthPicker__arrow" src="./src/assets/economy/economy-month-picker-arrow.svg" alt="">'
      :'<img class="MonthPicker__arrow" src="./src/components/month-picker/chevron-down.svg" alt="" aria-hidden="true">';
    return `<div class="MonthPicker MonthPicker--${state.theme} ${escapeHtml(state.className)}" data-month-picker-id="${escapeHtml(state.id)}" onclick="event.stopPropagation()"><button type="button" class="MonthPicker__input" id="${escapeHtml(state.id)}Input" ${state.disabled?"disabled":""} onclick="MonthPicker.toggle('${escapeHtml(state.id)}',event)">${calendar}<span class="MonthPicker__value" id="${escapeHtml(state.id)}Value">${state.value?formatLabel(state.value,state.locale):escapeHtml(state.placeholder)}</span>${arrow}</button><div class="MonthPicker__panel" id="${escapeHtml(state.id)}Panel"></div></div>`;
  }

  function sync(id){
    const state=instances.get(String(id));
    if(!state)return;
    const input=document.getElementById(`${state.id}Input`);
    const panel=document.getElementById(`${state.id}Panel`);
    const value=document.getElementById(`${state.id}Value`);
    input?.classList.toggle("active",state.open);
    panel?.classList.toggle("open",state.open);
    if(panel)panel.innerHTML=state.open?renderPanel(state):"";
    if(value)value.textContent=state.value?formatLabel(state.value,state.locale):state.placeholder;
  }

  function closeOthers(id){
    instances.forEach((state,key)=>{
      if(key===String(id)||!state.open)return;
      state.open=false;
      sync(key);
    });
  }

  function toggle(id,event){
    event?.stopPropagation?.();
    const state=instances.get(String(id));
    if(!state||state.disabled)return;
    closeOthers(id);
    state.open=!state.open;
    state.viewYear=Number(state.value.slice(0,4));
    sync(id);
  }

  function moveYear(id,delta,event){
    event?.stopPropagation?.();
    const state=instances.get(String(id));
    if(!state)return;
    state.viewYear+=Number(delta)||0;
    sync(id);
  }

  function select(id,value,event){
    event?.stopPropagation?.();
    const state=instances.get(String(id));
    if(!state)return;
    const normalized=normalizeMonth(value,"");
    if(!normalized||normalized>state.max)return;
    state.value=normalized;
    state.open=false;
    sync(id);
    state.onChange?.(normalized);
  }

  function closeAll(){
    instances.forEach((state,id)=>{
      if(!state.open)return;
      state.open=false;
      sync(id);
    });
  }

  function getValue(id){
    return instances.get(String(id))?.value||"";
  }

  document.addEventListener("click",closeAll);
  global.MonthPicker={render,toggle,moveYear,select,closeAll,getValue};
})(window);
