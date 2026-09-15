const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/app/operation/production-project-list.js'),'utf8');
const modalSource=fs.readFileSync(path.join(root,'src/app/shared/worker-detail.js'),'utf8');

function setup(){
  const masks=[],elements=new Map(),messages=[];
  let projects=[];
  function classes(){
    const names=new Set();
    return {add:(...values)=>values.forEach(value=>names.add(value)),contains:value=>names.has(value)};
  }
  const document={
    body:{appendChild(mask){mask.isConnected=true;masks.push(mask);}},
    createElement(){
      const mask={style:{},classList:classes(),isConnected:false,innerHTML:'',
        closest(){return mask;},remove(){mask.isConnected=false;masks.splice(masks.indexOf(mask),1);},
        querySelector(){return mask.modal;}};
      mask.modal={classList:classes(),closest(){return mask;}};
      return mask;
    },
    querySelector(selector){
      if(selector==='.nested-modal-mask:last-of-type .nested-modal')return masks.at(-1)?.modal;
      if(selector==='.nested-modal-mask:last-of-type')return masks.at(-1);
      return null;
    },
    getElementById(id){
      const mask=masks.find(item=>item.innerHTML.includes('id="operationOrderPickerTbody"'));
      if(!mask)return null;
      if(!elements.has(id)||elements.get(id).closest()!==mask)elements.set(id,{value:'',innerHTML:'',rows:[],closest:()=>mask});
      return elements.get(id);
    }
  };
  const context=vm.createContext({document,tableColumnDefinitions:{},detailPage:{style:{}},listPage:{style:{},innerHTML:''},
    escapeAttr:value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),
    tag:value=>`<span>${value}</span>`,renderTDesignIcon:()=>'<span></span>',
    renderUnifiedQueryCard:html=>html,renderUnifiedTableCard:()=>'',renderTableHeaderByColumns:()=>'',
    getVisibleColumns:key=>context.tableColumnDefinitions[key],StatisticsFilter:{render:()=>''},
    renderTableByColumns:(key,rows)=>{if(key==='operationProductionProjectList')projects=rows;},
    showToast:message=>messages.push(message)});
  context.window=context;
  vm.runInContext(modalSource.slice(modalSource.indexOf('function openNestedModal('),modalSource.indexOf('function renderAttachmentPreviewHtml(')),context);
  vm.runInContext(source,context);
  context.renderOperationProductionProjectListPage();
  function button(mask=masks.at(-1)){return {disabled:false,closest:()=>mask};}
  function orderCount(id){
    context.renderOrderPickerTable();
    const html=document.getElementById('operationOrderPickerTbody').innerHTML;
    const row=html.split('</tr>').find(row=>row.includes(`openOperationOrderProjectRebindConfirm(${id})`));
    return Number(row.match(/<td class="center"><span>(\d+)<\/span><\/td><td class="center"><button/)[1]);
  }
  return {context,masks,elements,messages,projects,button,orderCount};
}

test('确认选择只展示前后对比，取消保留父弹框、筛选和分页，不修改关联',()=>{
  const {context,masks,elements,projects,button}=setup();
  const original=projects[0].relatedOrderProject;
  context.openOperationOrderProjectRebindPicker(1);
  context.changeOperationOrderPickerPage(1);
  context.document.getElementById('orderPickerName').value='待保留输入';
  const beforeBody=context.document.getElementById('operationOrderPickerTbody').innerHTML;
  const beforePager=context.document.getElementById('operationOrderPickerPager').innerHTML;
  context.openOperationOrderProjectRebindConfirm(12);
  assert.equal(masks.length,2);
  assert.ok(masks[1].innerHTML.includes('订单项目换绑确认'));
  assert.ok(masks[1].innerHTML.includes(original));
  assert.ok(masks[1].innerHTML.includes('ProjectMdm20192112'));
  for(const field of ['订单项目名称','订单项目编号','子公司管理单位','客户名称','中标日期','中标价（万元）','项目类型','区域市场','项目所在地','是否确认换绑？'])assert.ok(masks[1].innerHTML.includes(field));
  assert.equal(projects[0].relatedOrderProject,original);
  context.cancelOperationOrderProjectRebind(button());
  assert.equal(masks.length,1);
  assert.equal(context.document.getElementById('orderPickerName').value,'待保留输入');
  assert.equal(context.document.getElementById('operationOrderPickerTbody').innerHTML,beforeBody);
  assert.equal(context.document.getElementById('operationOrderPickerPager').innerHTML,beforePager);
  assert.equal(projects[0].relatedOrderProject,original);
});

test('确认才生效，更新计数并关闭两层；重复确认不会重复加计数',()=>{
  const {context,masks,projects,button,orderCount}=setup();
  context.openOperationOrderProjectRebindPicker(1);
  const count=orderCount(2);
  context.openOperationOrderProjectRebindConfirm(2);
  assert.equal(orderCount(2),count);
  const confirm=button();
  context.applyOperationOrderProjectRebind(confirm);
  assert.equal(projects[0].relatedOrderProject,'ProjectMdm20192102');
  assert.equal(projects[0].orderStatus,'已关联');
  assert.equal(masks.length,0);
  assert.equal(confirm.disabled,true);
  context.applyOperationOrderProjectRebind(confirm);
  context.openOperationOrderProjectRebindPicker(1);
  assert.equal(orderCount(2),count+1);
});

test('再次换绑可显示上次所选项目；同一订单不重复计数；换到另一订单增减各一次',()=>{
  const {context,masks,button,orderCount}=setup();
  context.openOperationOrderProjectRebindPicker(1);
  context.openOperationOrderProjectRebindConfirm(2);
  context.applyOperationOrderProjectRebind(button());
  context.openOperationOrderProjectRebindPicker(1);
  const count2=orderCount(2),count3=orderCount(3);
  context.openOperationOrderProjectRebindConfirm(2);
  const html=masks.at(-1).innerHTML;
  assert.equal(html.split('ProjectMdm20192102').length-1,2);
  context.applyOperationOrderProjectRebind(button());
  context.openOperationOrderProjectRebindPicker(1);
  assert.equal(orderCount(2),count2);
  context.openOperationOrderProjectRebindConfirm(3);
  context.applyOperationOrderProjectRebind(button());
  context.openOperationOrderProjectRebindPicker(1);
  assert.equal(orderCount(2),count2-1);
  assert.equal(orderCount(3),count3+1);
});

test('右上角关闭后不换绑，可重新选择；关联变更后旧确认不会覆盖新值',()=>{
  const {context,masks,projects,button}=setup();
  context.openOperationOrderProjectRebindPicker(1);
  const original=projects[0].relatedOrderProject;
  context.openOperationOrderProjectRebindConfirm(2);
  const stale=button();
  context.closeNestedModal(stale);
  context.applyOperationOrderProjectRebind(stale);
  assert.equal(projects[0].relatedOrderProject,original);
  assert.equal(masks.length,1);
  context.openOperationOrderProjectRebindConfirm(3);
  assert.equal(masks.length,2);
  projects[0].relatedOrderProject='UpdatedElsewhere';
  context.applyOperationOrderProjectRebind(button());
  assert.equal(projects[0].relatedOrderProject,'UpdatedElsewhere');
  assert.equal(masks.length,1);
});

test('确认内容转义动态字段，缺失旧资料保留编号，未关联记录显示空态',()=>{
  const {context,masks,projects,button}=setup();
  projects[0].relatedOrderProject='<script>unknown</script>';
  context.openOperationOrderProjectRebindPicker(1);
  context.openOperationOrderProjectRebindConfirm(2);
  assert.ok(masks.at(-1).innerHTML.includes('&lt;script&gt;unknown&lt;/script&gt;'));
  assert.ok(!masks.at(-1).innerHTML.includes('<script>unknown</script>'));
  context.cancelOperationOrderProjectRebind(button());
  projects[0].relatedOrderProject='';
  context.openOperationOrderProjectRebindConfirm(2);
  assert.ok(masks.at(-1).innerHTML.includes('未关联订单项目'));
});
