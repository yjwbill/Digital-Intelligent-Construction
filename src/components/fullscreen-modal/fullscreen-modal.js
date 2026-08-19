(function(global){
  function open(options={}){
    const {title="",content="",footer="",className="",onOpened}=options;
    openModal(title,typeof content==="function"?content():content,footer);
    modalBox.classList.add("fullscreen","fullscreen-modal-component");
    if(className)String(className).split(/\s+/).filter(Boolean).forEach(name=>modalBox.classList.add(name));
    const button=document.getElementById("modalFullscreenBtn");
    if(button)button.style.display="none";
    modalTitle.dataset.zhTitle=title;
    modalFooter.dataset.zhHtml=footer||modalFooter.innerHTML;
    if(typeof onOpened==="function")onOpened({box:modalBox,body:modalBody,footer:modalFooter});
  }
  function close(){closeModal();}
  global.FullscreenModal={open,close};
})(window);
