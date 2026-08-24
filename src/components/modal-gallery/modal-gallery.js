(function(global){
  const definitions={
    standard:{title:"基础标准弹框",group:"PC标准弹框",desc:"标准 Header / Body / Footer 结构，适合表单、详情和普通业务操作。",specs:["Small 480px","Medium 640px","Large 800px","XL 1120px","Header 56px","Footer 56px","Body Padding 24px"]},
    fullscreen:{title:"全屏弹框",group:"PC标准弹框",desc:"占满可用视口，用于完整报表、嵌入式页面和复杂大数据界面。",specs:["视口边距 0px","圆角 0px","头尾固定","正文独立滚动","支持退出全屏"]},
    nested:{title:"嵌套弹框",group:"PC复合弹框",desc:"在已有弹框上打开二级选择或详情，保留上一层上下文。",specs:["独立二级遮罩","高层级 Z-index","建议最多2层","关闭后返回上层","适合选择器"]},
    business:{title:"业务定制弹框",group:"PC扩展弹框",desc:"继承标准弹框骨架，仅通过业务插槽承载特殊工具栏、表格或表单布局。",specs:["复用标准头尾","允许Body布局扩展","禁止重写基础尺寸","业务Class独立","适合权限和项目选择"]},
    immersive:{title:"沉浸式预览弹框",group:"PC扩展弹框",desc:"用于图片、报告和H5预览，正文可使用深色画布或零Padding。",specs:["Body Padding 0px","深色/报告画布","工具栏可选","可默认全屏","适合图片和报告"]},
    mobile:{title:"移动端弹层",group:"移动端弹层",desc:"统一收纳移动端居中Dialog、底部Drawer和ActionSheet三种形态。",specs:["Dialog 居中","Drawer 底部滑入","ActionSheet 操作列表","移动端安全区","手势关闭可选"]},
    lightweight:{title:"轻量浮层",group:"轻量弹层",desc:"无完整头身尾结构，贴近触发区域展示提示、快捷操作或辅助信息。",specs:["非模态","可无全屏遮罩","锚点定位","点击外部关闭","适合Popover和提示"]}
  };
  function definition(type){return definitions[type]||definitions.standard;}
  function renderPreview(type){
    const item=definition(type);
    return `<div class="modal-gallery-preview"><section class="modal-gallery-summary"><span>${item.group}</span><h4>${item.title}</h4><p>${item.desc}</p><div>${item.specs.map(spec=>`<em>${spec}</em>`).join("")}</div><button class="btn primary" type="button" onclick="ModalGallery.open('${type}')">打开示例</button></section>${renderStage(type,item)}</div><p class="modal-gallery-note">当前仅作为组件库候选方案沉淀，不接管现有业务弹框；确认保留后再统一API、Token和迁移范围。</p>`;
  }
  function renderStage(type,item){
    if(type==="mobile")return `<section class="modal-gallery-stage mobile"><div class="modal-gallery-phone"><i></i><article><b>移动端弹层</b><span>Dialog / Drawer / Sheet</span></article></div></section>`;
    if(type==="lightweight")return `<section class="modal-gallery-stage lightweight"><button>触发按钮</button><article><b>${item.title}</b><span>轻量信息或快捷操作</span></article></section>`;
    return `<section class="modal-gallery-stage ${type}"><div class="modal-gallery-window"><header><strong>${item.title}</strong><i>${renderTDesignIcon("close",{size:18})}</i></header><main>${type==="immersive"?"报告 / 图片预览画布":"弹框正文内容区域"}</main><footer><button>取消</button><button>确定</button></footer></div></section>`;
  }
  function open(type){
    close();
    const item=definition(type),layer=document.createElement("div");
    layer.id="modalGalleryDemoLayer";
    layer.className=`modal-gallery-demo-layer ${type}`;
    const mobileBody=type==="mobile"?`<div class="modal-gallery-demo-phone"><header>9:41</header><main>移动端页面内容</main><section><h3>移动端弹层</h3><p>这里展示Dialog、Drawer或ActionSheet内容。</p><button onclick="ModalGallery.close()">确定</button></section></div>`:"";
    const lightBody=type==="lightweight"?`<div class="modal-gallery-demo-popover"><strong>轻量浮层</strong><p>适用于快捷操作与辅助信息。</p><button onclick="ModalGallery.close()">关闭</button></div>`:"";
    const nestedPanel=type==="nested"?`<div class="modal-gallery-demo-submodal"><header><strong>二级选择弹框</strong><button title="关闭" aria-label="关闭" onclick="this.closest('.modal-gallery-demo-submodal').remove()">${renderTDesignIcon("close",{size:18})}</button></header><main>保留主弹框上下文的二级内容</main><footer><button class="btn" onclick="this.closest('.modal-gallery-demo-submodal').remove()">返回上层</button><button class="btn primary" onclick="this.closest('.modal-gallery-demo-submodal').remove()">确定</button></footer></div>`:"";
    const desktopBody=!mobileBody&&!lightBody?`<div class="modal-gallery-demo-modal"><header><strong>${item.title}</strong><button title="关闭" aria-label="关闭" onclick="ModalGallery.close()">${renderTDesignIcon("close",{size:18})}</button></header><main>${type==="immersive"?"<div class='modal-gallery-canvas'>沉浸式预览画布</div>":type==="business"?"<div class='modal-gallery-form'><div>项目名称　<input placeholder='请输入项目名称'></div><div class='modal-gallery-table-placeholder'>业务表格 / 表单内容插槽</div></div>":"标准弹框正文内容"}</main><footer><button class="btn" onclick="ModalGallery.close()">取消</button><button class="btn primary" onclick="ModalGallery.close()">确定</button></footer></div>${nestedPanel}`:"";
    layer.innerHTML=`<div class="modal-gallery-demo-mask" onclick="ModalGallery.close()"></div>${mobileBody||lightBody||desktopBody}`;
    document.body.appendChild(layer);
  }
  function close(){document.getElementById("modalGalleryDemoLayer")?.remove();}
  global.ModalGallery={renderPreview,open,close,definitions};
})(window);
