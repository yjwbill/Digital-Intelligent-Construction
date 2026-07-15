(function(){
  function openMobileOverviewPreview(){
    var query=new URLSearchParams(location.search || "");
    if(query.get("mobileOverview")!=="1" && location.hash!=="#mobile-overview")return;
    if(typeof window.renderMobileProjectOverviewPageV2227==="function"){
      setTimeout(function(){ window.renderMobileProjectOverviewPageV2227(); },0);
    }
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",openMobileOverviewPreview);
  }else{
    openMobileOverviewPreview();
  }
})();
