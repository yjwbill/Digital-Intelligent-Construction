(function(global){
  const srcPathIndex=location.pathname.indexOf("/src/");
  const appRoot=srcPathIndex>=0?location.pathname.slice(0,srcPathIndex+1):new URL(".",location.href).pathname;
  const assetRoot=new URL(`${appRoot}src/assets/tdesign-icons/`,location.origin).href;

  function escapeHtml(value){
    return String(value??"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function normalizeName(name){
    const value=String(name||"").trim().toLowerCase();
    return /^[a-z0-9-]+$/.test(value)?value:"file-icon";
  }

  function normalizeSize(size){
    if(typeof size==="number")return `${Math.max(8,size)}px`;
    const value=String(size||"1em").trim();
    return /^\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(value)?value:"1em";
  }

  function render(name,options={}){
    const iconName=normalizeName(name);
    const size=normalizeSize(options.size);
    const label=String(options.label||"").trim();
    const className=String(options.className||"").replace(/[^a-zA-Z0-9_\- ]/g,"").trim();
    const title=String(options.title||label).trim();
    return `<span class="td-icon td-icon--${iconName}${className?` ${className}`:""}" style="--td-icon-url:url('${assetRoot}${iconName}.svg?v=0.4.6-corrected');--td-icon-size:${size}" ${label?`role="img" aria-label="${escapeHtml(label)}"`:'aria-hidden="true"'}${title?` title="${escapeHtml(title)}"`:""}></span>`;
  }

  global.TDesignIcon={assetRoot,render};
  global.renderTDesignIcon=render;
})(window);
