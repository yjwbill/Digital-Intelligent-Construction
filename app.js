(function(){
  const version="2.2.274-output-completion-rate";
  const scripts=[
    "src/app/core/00-data-and-utils.js",
    "src/app/project/project-portal.js",
    "src/app/shell/enterprise-navigation.js",
    "src/app/safety/labor-video-roster.js",
    "src/app/production/supplier-performance.js",
    "src/app/base/base-management.js",
    "src/app/safety/evaluation-dashboard.js",
    "src/app/production/dashboard-statistics-data.js",
    "src/app/production/dashboard.js",
    "src/app/production/dashboard-projects.js",
    "src/app/home/construction-log.js",
    "src/app/production/output-management.js",
    "src/app/shared/worker-detail.js",
    "src/app/production/risk-management.js",
    "src/app/shared/message-todo-center.js",
    "src/app/mobile/entry-component-library.js",
    "src/app/mobile/workbench.js",
    "src/app/base/data-dictionary.js",
    "src/app/mobile/polish-monthly-output.js",
    "src/app/operation/production-project-report.js",
    "src/app/mobile/project-overview.js",
    "src/app/core/99-initial-route.js"
  ];
  window.__APP_SCRIPT_CHUNKS__=scripts.slice();
  scripts.forEach(function(src){
    document.write('<script src="./'+src+'?v='+version+'"><\/script>');
  });
})();
