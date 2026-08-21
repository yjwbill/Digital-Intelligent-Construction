(function(global){
  function escapeHtml(value){return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
  function getValue(row,column,index){return typeof column.render==="function"?column.render(row,index):escapeHtml(row?.[column.key]??"-");}
  function buildSpanMap(rows,columns){
    const spanMap=new Map();
    columns.forEach(column=>{
      if(!column.rowSpan)return;
      if(typeof column.rowSpan==="function"){
        rows.forEach((row,index)=>spanMap.set(`${column.key}:${index}`,Math.max(0,Number(column.rowSpan({row,rowIndex:index,rows}))||0)));
        return;
      }
      const groupKey=column.rowSpan===true?(column.groupKey||column.key):column.rowSpan;
      let start=0;
      while(start<rows.length){
        let end=start+1;
        while(end<rows.length&&rows[end]?.[groupKey]===rows[start]?.[groupKey])end++;
        spanMap.set(`${column.key}:${start}`,end-start);
        for(let index=start+1;index<end;index++)spanMap.set(`${column.key}:${index}`,0);
        start=end;
      }
    });
    return spanMap;
  }
  function render(config={}){
    const rows=Array.isArray(config.data)?config.data:[];
    const columns=Array.isArray(config.columns)?config.columns:[];
    const spanMap=buildSpanMap(rows,columns);
    return `<div class="row-span-table ${escapeHtml(config.className||"")}"><div class="table-wrap"><table><thead><tr>${columns.map(column=>`<th style="${column.width?`width:${Number(column.width)}px;`:""}text-align:${column.align||"left"}">${escapeHtml(column.title||column.key)}</th>`).join("")}</tr></thead><tbody>${rows.map((row,rowIndex)=>`<tr>${columns.map(column=>{const span=column.rowSpan?spanMap.get(`${column.key}:${rowIndex}`):1;if(span===0)return "";return `<td ${span>1?`rowspan="${span}" class="row-span-cell"`:""} style="text-align:${column.align||"left"}">${getValue(row,column,rowIndex)}</td>`;}).join("")}</tr>`).join("")||`<tr><td colspan="${columns.length}" class="empty">暂无数据</td></tr>`}</tbody></table></div></div>`;
  }
  global.RowSpanTable={render,buildSpanMap};
})(window);
