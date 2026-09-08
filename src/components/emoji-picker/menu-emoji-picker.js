/* Menu icon editor only. Data is bundled locally; no runtime network requests. */
const menuEmojiPickerState={selected:"",category:"all",query:"",recent:[]};
const menuEmojiCategories=[["all","全部"],["recent","🕘 最近使用"],[0,"😀 笑脸和情感"],[1,"👋 人物和身体"],[2,"🐶 动物和自然"],[3,"🍕 食物和饮料"],[4,"✈️ 旅行和地点"],[5,"⚽ 活动"],[6,"💡 物品"],[7,"❤️ 符号"],[8,"🏁 旗帜"]];
function getMenuEmojiRows(){
  const rows=(window.MenuEmojiData||[]).slice();
  const known=new Set(rows.map(row=>row[0]));
  menuManagementIconOptions.forEach(([icon,label])=>{if(!known.has(icon))rows.push([icon,label,"",label,6]);});
  return rows;
}
function isMenuEmojiAvailable(icon){return getMenuEmojiRows().some(row=>row[0]===icon);}
function renderMenuEmojiPicker(selected){
  const category=String(getMenuEmojiRows().find(row=>row[0]===selected)?.[4]??0);
  Object.assign(menuEmojiPickerState,{selected,category,query:"",recent:[]});
  try{
    const recent=JSON.parse(localStorage.getItem("menuEmojiRecent")||"[]");
    if(Array.isArray(recent))menuEmojiPickerState.recent=recent.filter(isMenuEmojiAvailable).slice(0,50);
  }catch(error){/* Recent history is optional. */}
  return `<div class="menu-emoji-picker">
    <div class="menu-emoji-search"><input class="input" aria-label="搜索 Emoji" placeholder="搜索 Emoji：中文、英文或表情" oninput="menuEmojiPickerState.query=this.value;renderMenuEmojiResults()"/></div>
    <div class="menu-emoji-categories" role="group" aria-label="Emoji 分类">${menuEmojiCategories.map(([id,label])=>`<button type="button" data-emoji-category="${id}" class="${String(id)===category?"active":""}" aria-pressed="${String(id)===category}" onclick="setMenuEmojiCategory(this.dataset.emojiCategory)">${label}</button>`).join("")}</div>
    <div class="menu-emoji-results" id="menuEmojiResults" role="group" aria-label="Emoji 列表"></div>
    <div class="menu-emoji-footer"><div id="menuEmojiPreview" aria-live="polite"></div><span id="menuEmojiCount"></span></div>
  </div>`;
}
function setMenuEmojiCategory(category){
  menuEmojiPickerState.category=category;
  menuEmojiPickerState.query="";
  document.querySelector('.menu-emoji-search input').value="";
  document.querySelectorAll('[data-emoji-category]').forEach(button=>{
    const active=button.dataset.emojiCategory===category;
    button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));
  });
  renderMenuEmojiResults();
}
function renderMenuEmojiResults(){
  const state=menuEmojiPickerState,query=state.query.trim().toLowerCase();
  let rows=getMenuEmojiRows();
  if(query)rows=rows.filter(row=>row.slice(0,4).join(" ").toLowerCase().includes(query));
  else if(state.category==="recent")rows=state.recent.map(icon=>rows.find(row=>row[0]===icon)).filter(Boolean);
  else if(state.category!=="all")rows=rows.filter(row=>String(row[4])===state.category);
  const box=document.getElementById("menuEmojiResults");
  box.innerHTML=rows.length?rows.map(row=>{
    const code=Array.from(row[0]).map(char=>"U+"+char.codePointAt(0).toString(16).toUpperCase()).join(" ");
    return `<button type="button" class="menu-management-icon-option ${row[0]===state.selected?"active":""}" data-menu-icon="${escapeAttr(row[0])}" aria-label="${escapeAttr(row[1])}" title="${escapeAttr(row[1]+" · "+code)}" aria-pressed="${row[0]===state.selected}" onclick="chooseMenuEmoji(this)">${escapeAttr(row[0])}</button>`;
  }).join(""):`<div class="menu-emoji-empty">${state.category==="recent"&&!query?"暂无最近使用的 Emoji":"未找到匹配的 Emoji，请尝试其他关键词"}</div>`;
  box.scrollTop=0;
  document.getElementById("menuEmojiCount").textContent=`${rows.length} 个 Emoji`;
  updateMenuEmojiPreview();
}
function chooseMenuEmoji(button){
  menuEmojiPickerState.selected=button.dataset.menuIcon;
  document.querySelectorAll('.menu-emoji-picker [data-menu-icon]').forEach(item=>{
    const active=item.dataset.menuIcon===menuEmojiPickerState.selected;
    item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));
  });
  updateMenuEmojiPreview();
}
function updateMenuEmojiPreview(){
  const row=getMenuEmojiRows().find(item=>item[0]===menuEmojiPickerState.selected);
  const box=document.getElementById("menuEmojiPreview");
  if(box)box.innerHTML=`<span class="menu-emoji-current">${escapeAttr(menuEmojiPickerState.selected)}</span><span>当前选择：${escapeAttr(row?.[1]||menuEmojiPickerState.selected)}</span>`;
}
function rememberMenuEmoji(icon){
  const recent=[icon,...menuEmojiPickerState.recent.filter(value=>value!==icon)].slice(0,50);
  try{localStorage.setItem("menuEmojiRecent",JSON.stringify(recent));}catch(error){/* Saving the menu does not depend on optional history. */}
}
