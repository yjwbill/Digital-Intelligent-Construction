(function(){
  const enterpriseLineRoutes={
    home:"home-project-album",
    production:"src/app/production/dashboard-projects.html",
    safety:"safety-dashboard",
    economy:"economy-cost",
    operation:"operation-production-project",
    base:"base-org-permission"
  };
  const enterpriseSingleRoutes={
    home:{0:"home-project-album",1:"src/app/home/construction-log.html"},
    production:{0:"src/app/production/dashboard-projects.html",1:"src/app/production/dashboard-projects.html"},
    safety:{0:"safety-dashboard",7:"safety-managed-overview"},
    economy:{0:"economy-cost",1:"economy-contract",2:"economy-settlement",3:"economy-analysis",4:"economy-fund-plan"}
  };
  const enterpriseChildRoutes={
    base:{0:"base-org-permission",1:"base-message-management",2:"base-data-config"},
    production:{2:"production-progress",3:"src/app/production/risk-management.html",4:"src/app/production/output-management.html",5:"production-quality",6:"src/app/production/supplier-performance.html",7:"production-low-carbon"},
    safety:{1:"safety-real-name",2:"safety-video",3:"safety-major-risk",4:"safety-minor-accident",5:"safety-daily-supervision",6:"safety-evaluation"},
    operation:{0:"operation-production-project"}
  };
  const projectLineRoutes={
    home:"project-home-overview",
    production:"project-production-progress",
    safety:"project-safety",
    economy:"project-economy"
  };
  const projectSingleRoutes={
    home:{0:"project-home-overview",1:"project-home-workspace",2:"project-home-detail",3:"project-home-planning",4:"project-home-log"},
    safety:{0:"project-safety"},
    economy:{0:"project-economy"}
  };
  const projectChildRoutes={
    production:{
      0:"project-production-progress",
      1:"project-production-risk",
      2:"project-production-output",
      3:"project-production-quality",
      4:"project-production-labor",
      5:"project-production-tech",
      6:"project-production-danger",
      7:"project-production-equipment",
      8:"project-production-material",
      9:"project-production-low-carbon"
    }
  };

  function pageHref(slug,params={}){
    const target=String(slug||"");
    let path=target;
    if(!target.endsWith(".html") && !target.includes("/")){
      if(target.startsWith("base-")){
        path=`src/app/base/${target.replace(/^base-/,"")}.html`;
      }else if(target.startsWith("home-")){
        path=`src/app/home/${target.replace(/^home-/,"")}.html`;
      }else if(target.startsWith("operation-")){
        path=`src/app/operation/${target.replace(/^operation-/,"")}.html`;
      }else if(target.startsWith("economy-")){
        path=`src/app/economy/${target.replace(/^economy-/,"")}.html`;
      }else if(target.startsWith("production-")){
        path=`src/app/production/${target.replace(/^production-/,"")}.html`;
      }else if(target.startsWith("safety-")){
        path=`src/app/safety/${target.replace(/^safety-/,"")}.html`;
      }else if(target.startsWith("project-")){
        path=`src/app/project/${target.replace(/^project-/,"")}.html`;
      }else{
        path=`src/app/pages/${target}.html`;
      }
    }
    const url=new URL(path,document.baseURI);
    Object.entries(params).forEach(([key,value])=>{
      if(value!==undefined&&value!==null&&value!=="")url.searchParams.set(key,String(value));
    });
    return url.href;
  }

  function sameRoute(href){
    const target=new URL(href,document.baseURI);
    const current=new URL(location.href);
    return target.pathname===current.pathname && target.search===current.search;
  }

  function navigateToRoute(slug,params={}){
    if(!slug || window.__APP_APPLYING_INITIAL_ROUTE__)return false;
    const href=pageHref(slug,params);
    if(sameRoute(href))return false;
    location.assign(href);
    return true;
  }

  function routeWithQueryOverride(route,mode){
    const query=new URLSearchParams(location.search || "");
    const line=route.line || (mode==="project"?"home":"production");
    const gi=query.has("gi")?Number(query.get("gi")):null;
    const ci=query.has("ci")?Number(query.get("ci")):null;
    const i=query.has("i")?Number(query.get("i")):null;
    const menus=mode==="project"?(projectPortalMenus?.[line]?.menus||[]):(businessMenus?.[line]?.menus||[]);
    if(Number.isInteger(gi)&&menus[gi]?.children?.length){
      const childIndex=Number.isInteger(ci)?Math.max(0,Math.min(ci,menus[gi].children.length-1)):0;
      return {...route,line,group:menus[gi].name,child:menus[gi].children[childIndex].name};
    }
    if(Number.isInteger(i)&&menus[i]){
      return {...route,line,menu:menus[i].name};
    }
    return route;
  }

  function applyEnterpriseRoute(route){
    route=routeWithQueryOverride(route,"enterprise");
    if(typeof enterDigitalConstructionPc==="function"){
      enterDigitalConstructionPc({skipDefaultRender:true});
    }
    const line=route.line || "production";
    const menus=businessMenus?.[line]?.menus || [];
    const menuName=route.menu || route.group || route.name || "";
    const childName=route.child || "";
    const menuIndex=menus.findIndex(item=>item.name===menuName || item.children?.some(child=>child.name===menuName || child.name===childName));

    pcPortalState.mode="enterprise";
    currentBusinessLine=line;
    if(typeof renderPcTopNavigation==="function")renderPcTopNavigation();
    if(menuIndex<0){
      if(typeof switchBusinessLine==="function")switchBusinessLine(line);
      return;
    }

    const menu=menus[menuIndex];
    if(menu.children?.length){
      const childIndex=Math.max(0,menu.children.findIndex(child=>child.name===(childName || menuName)));
      selectBusinessChildMenu(line,menuIndex,childIndex,menu.children[childIndex].name);
    }else{
      selectBusinessSingleMenu(line,menuIndex,menu.name);
    }
  }

  function applyProjectRoute(route){
    route=routeWithQueryOverride(route,"project");
    if(typeof enterDigitalConstructionPc==="function"){
      enterDigitalConstructionPc({skipDefaultRender:true});
    }
    const line=route.line || "home";
    const menus=projectPortalMenus?.[line]?.menus || [];
    const menuName=route.menu || route.group || route.name || "";
    const childName=route.child || "";
    const menuIndex=menus.findIndex(item=>item.name===menuName || item.children?.some(child=>child.name===menuName || child.name===childName));

    pcPortalState.mode="project";
    pcPortalState.projectLine=line;
    if(menuIndex<0){
      if(typeof switchProjectLine==="function")switchProjectLine(line);
      return;
    }

    const menu=menus[menuIndex];
    if(menu.children?.length){
      const childIndex=Math.max(0,menu.children.findIndex(child=>child.name===(childName || menuName)));
      selectProjectChildMenu(line,menuIndex,childIndex,menu.children[childIndex].name);
    }else{
      selectProjectMenu(line,menuIndex,menu.name);
    }
  }

  function applyInitialRoute(){
    const route=window.__APP_INITIAL_ROUTE__;
    if(!route || window.__APP_INITIAL_ROUTE_APPLIED__)return;
    window.__APP_INITIAL_ROUTE_APPLIED__=true;

    try{
      window.__APP_APPLYING_INITIAL_ROUTE__=true;
      if(route.mode==="project" || route.portal==="project"){
        applyProjectRoute(route);
      }else{
        applyEnterpriseRoute(route);
      }
    }catch(error){
      console.warn("initial route failed",error);
    }finally{
      window.__APP_APPLYING_INITIAL_ROUTE__=false;
    }
  }

  function installRouteNavigation(){
    if(window.__APP_ROUTE_NAVIGATION_INSTALLED__)return;
    window.__APP_ROUTE_NAVIGATION_INSTALLED__=true;
    const originalSwitchBusinessLine=window.switchBusinessLine;
    const originalSelectBusinessSingleMenu=window.selectBusinessSingleMenu;
    const originalSelectBusinessChildMenu=window.selectBusinessChildMenu;
    const originalSwitchProjectLine=window.switchProjectLine;
    const originalSelectProjectMenu=window.selectProjectMenu;
    const originalSelectProjectChildMenu=window.selectProjectChildMenu;
    const originalSwitchPcPortal=window.switchPcPortal;

    window.switchBusinessLine=function(line){
      if(navigateToRoute(enterpriseLineRoutes[line] || enterpriseLineRoutes.production))return;
      return originalSwitchBusinessLine?.apply(this,arguments);
    };
    window.selectBusinessSingleMenu=function(line,index,name){
      const slug=enterpriseSingleRoutes[line]?.[index] || enterpriseLineRoutes[line];
      if(navigateToRoute(slug,{i:index}))return;
      return originalSelectBusinessSingleMenu?.apply(this,arguments);
    };
    window.selectBusinessChildMenu=function(line,groupIndex,childIndex,name){
      const slug=enterpriseChildRoutes[line]?.[groupIndex] || enterpriseLineRoutes[line];
      if(navigateToRoute(slug,{gi:groupIndex,ci:childIndex}))return;
      return originalSelectBusinessChildMenu?.apply(this,arguments);
    };
    window.switchProjectLine=function(line){
      if(navigateToRoute(projectLineRoutes[line] || projectLineRoutes.home))return;
      return originalSwitchProjectLine?.apply(this,arguments);
    };
    window.selectProjectMenu=function(line,index,name){
      const slug=projectSingleRoutes[line]?.[index] || projectLineRoutes[line];
      if(navigateToRoute(slug,{i:index}))return;
      return originalSelectProjectMenu?.apply(this,arguments);
    };
    window.selectProjectChildMenu=function(line,groupIndex,childIndex,name){
      const slug=projectChildRoutes[line]?.[groupIndex] || projectLineRoutes[line];
      if(navigateToRoute(slug,{gi:groupIndex,ci:childIndex}))return;
      return originalSelectProjectChildMenu?.apply(this,arguments);
    };
    window.switchPcPortal=function(event,mode){
      if(mode==="project"&&navigateToRoute(projectLineRoutes.home))return;
      if(mode!=="project"&&navigateToRoute(enterpriseLineRoutes.production))return;
      return originalSwitchPcPortal?.apply(this,arguments);
    };
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{installRouteNavigation();applyInitialRoute();},0));
  }else{
    setTimeout(()=>{installRouteNavigation();applyInitialRoute();},0);
  }
})();
