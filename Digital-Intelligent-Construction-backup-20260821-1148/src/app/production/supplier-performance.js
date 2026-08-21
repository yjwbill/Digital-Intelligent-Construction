/* =========================
   供应商基础画像
========================= */
const supplierPerformanceTemplatePath="src/app/production/supplier-performance.html";
let supplierPerformanceTemplatePromise=null;

function getSupplierPerformanceTemplatesFromDocument(){
  const templates=new Map();
  document.querySelectorAll("template[data-supplier-template]").forEach(template=>{
    templates.set(template.dataset.supplierTemplate,template);
  });
  return templates.size?templates:null;
}

function loadSupplierPerformanceTemplates(){
  const inlineTemplates=getSupplierPerformanceTemplatesFromDocument();
  if(inlineTemplates)return Promise.resolve(inlineTemplates);

  if(!supplierPerformanceTemplatePromise){
    supplierPerformanceTemplatePromise=fetch(supplierPerformanceTemplatePath)
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(html=>{
        const doc=new DOMParser().parseFromString(html,"text/html");
        const templates=new Map();
        doc.querySelectorAll("template[data-supplier-template]").forEach(template=>{
          templates.set(template.dataset.supplierTemplate,template);
        });
        return templates;
      })
      .catch(error=>{
        console.warn("load supplier templates failed",error);
        supplierPerformanceTemplatePromise=null;
        return new Map();
      });
  }
  return supplierPerformanceTemplatePromise;
}

async function mountSupplierPerformanceTemplate(name){
  const templates=await loadSupplierPerformanceTemplates();
  const template=templates.get(name);
  if(!template){
    const fallback=document.createElement("div");
    fallback.className="project-log-empty";
    fallback.textContent="供应商页面模板加载失败";
    listPage.replaceChildren(fallback);
    return false;
  }
  listPage.replaceChildren(document.importNode(template.content,true));
  return true;
}

async function renderSupplierLedgerPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  const mounted=await mountSupplierPerformanceTemplate("ledger");
  if(!mounted)return;
  document.querySelector("[data-supplier-ledger-reset]")?.addEventListener("click",resetSupplierFilter);
  document.querySelector("[data-supplier-ledger-query]")?.addEventListener("click",applySupplierFilter);
  document.querySelector("[data-supplier-ledger-refresh]")?.addEventListener("click",()=>showToast("已刷新供应商台账数据"));
  document.querySelector("[data-supplier-ledger-export]")?.addEventListener("click",()=>showToast("导出成功：已生成供应商基础画像台账.xlsx"));
  document.querySelector("[data-supplier-ledger-columns]")?.addEventListener("click",()=>openColumnSetting("supplier","renderSupplierLedgerTable"));

  supplierCurrentList=[...supplierLedgerData];
  supplierActiveStat=null;
  renderSupplierLedgerTable();
}

function renderSupplierLedgerTable(){
  const table=document.getElementById("supplierLedgerTable");
  const thead=document.getElementById("supplierLedgerThead");

  if(table)table.style.minWidth=getTableMinWidth("supplier")+"px";
  replaceProductionDashboardFragment(thead,renderTableHeaderByColumns("supplier"));

  renderTableByColumns("supplier",supplierCurrentList,"supplierLedgerTbody");

  const total=document.getElementById("supplierTotalText");
  if(total)total.innerText=`共 ${supplierCurrentList.length} 条`;
}

function applySupplierFilter(){
  const n=supplierNameFilter.value.trim();
  const p=supplierProjectFilter.value.trim();

  supplierCurrentList=supplierLedgerData.filter(s=>
    (!n||s.name.includes(n))&&
    (!p||s.project.includes(p))
  );

  renderSupplierLedgerTable();
}

function resetSupplierFilter(){
  supplierNameFilter.value="";
  supplierProjectFilter.value="";
  supplierCurrentList=[...supplierLedgerData];
  renderSupplierLedgerTable();
}

/* =========================
   供应商评分记录
========================= */
async function renderSupplierScoreRecordPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  const mounted=await mountSupplierPerformanceTemplate("score");
  if(!mounted)return;
  document.querySelector("[data-supplier-score-reset]")?.addEventListener("click",resetSupplierScoreFilter);
  document.querySelector("[data-supplier-score-query]")?.addEventListener("click",applySupplierScoreFilter);
  document.querySelector("[data-supplier-score-refresh]")?.addEventListener("click",()=>showToast("已刷新供应商评分记录"));
  document.querySelector("[data-supplier-score-export]")?.addEventListener("click",()=>showToast("导出成功：已生成供应商评分记录.xlsx"));
  document.querySelector("[data-supplier-score-columns]")?.addEventListener("click",()=>openColumnSetting("supplierScore","renderSupplierScoreTable"));

  supplierScoreCurrentList=supplierScoreRecordData.filter(x=>x.year==="2026");
  supplierScoreActiveStat=null;
  renderSupplierScoreTable();
}

function renderSupplierScoreTable(){
  const table=document.getElementById("supplierScoreTable");
  const thead=document.getElementById("supplierScoreThead");

  if(table)table.style.minWidth=getTableMinWidth("supplierScore")+"px";
  replaceProductionDashboardFragment(thead,renderTableHeaderByColumns("supplierScore"));

  renderTableByColumns("supplierScore",supplierScoreCurrentList,"supplierScoreTbody");

  const total=document.getElementById("supplierScoreTotalText");
  if(total)total.innerText=`共 ${supplierScoreCurrentList.length} 条`;
}

function applySupplierScoreFilter(){
  const y=scoreYearFilter.value;
  const n=scoreSupplierNameFilter.value.trim();
  const c=scoreCategoryFilter.value;
  const p=scorePurchaserNameFilter.value.trim();

  supplierScoreCurrentList=supplierScoreRecordData.filter(x=>
    (!y||x.year===y)&&
    (!n||x.supplierName.includes(n))&&
    (!c||x.category===c)&&
    (!p||x.purchaserName.includes(p))
  );

  renderSupplierScoreTable();
}

function resetSupplierScoreFilter(){
  scoreYearFilter.value="2026";
  scoreSupplierNameFilter.value="";
  scoreCategoryFilter.value="";
  scorePurchaserNameFilter.value="";
  supplierScoreCurrentList=supplierScoreRecordData.filter(x=>x.year==="2026");
  renderSupplierScoreTable();
}
/* =========================
   履约评价平台
========================= */
async function renderPerformanceEvaluationPage(){
  detailPage.style.display="none";
  listPage.style.display="flex";

  const mounted=await mountSupplierPerformanceTemplate("performance");
  if(!mounted)return;
  const subCompany=document.querySelector("[data-performance-sub-company]");
  if(subCompany)replaceProductionDashboardFragment(subCompany,`<option value="">全部</option>${performanceOptions.subCompanies.map(x=>`<option>${x}</option>`).join("")}`);
  document.querySelector("[data-performance-reset]")?.addEventListener("click",resetPerformanceFilter);
  document.querySelector("[data-performance-query]")?.addEventListener("click",applyPerformanceFilter);
  document.querySelector("[data-performance-create]")?.addEventListener("click",openPerformanceEvaluationModal);
  document.querySelector("[data-performance-refresh]")?.addEventListener("click",()=>showToast("已刷新履约评价数据"));
  document.querySelector("[data-performance-export]")?.addEventListener("click",()=>showToast("导出成功：已生成履约评价列表.xlsx"));
  document.querySelector("[data-performance-columns]")?.addEventListener("click",()=>openColumnSetting("performance","renderPerformanceEvaluationTable"));

  performanceCurrentList=[...performanceEvaluationData];
  renderPerformanceEvaluationTable();
}

function renderPerformanceEvaluationTable(){
  const table=document.getElementById("performanceTable");
  const thead=document.getElementById("performanceThead");

  if(table)table.style.minWidth=getTableMinWidth("performance")+"px";
  replaceProductionDashboardFragment(thead,renderTableHeaderByColumns("performance"));

  renderTableByColumns("performance",performanceCurrentList,"performanceTbody");

  const total=document.getElementById("performanceTotalText");
  if(total)total.innerText=`共 ${performanceCurrentList.length} 条`;
}

function applyPerformanceFilter(){
  const sub=document.getElementById("perfSubCompanyFilter")?.value||"";
  const unit=document.getElementById("perfUnitFilter")?.value.trim()||"";
  const project=document.getElementById("perfProjectFilter")?.value.trim()||"";
  const joint=document.getElementById("perfJointFilter")?.value.trim()||"";
  const manager=document.getElementById("perfManagerFilter")?.value.trim()||"";

  performanceCurrentList=performanceEvaluationData.filter(x=>
    (!sub||x.subCompany===sub)&&
    (!unit||x.projectUnit.includes(unit))&&
    (!project||x.projectName.includes(project))&&
    (!joint||x.jointManager.includes(joint))&&
    (!manager||x.projectManager.includes(manager))
  );

  renderPerformanceEvaluationTable();
}

function resetPerformanceFilter(){
  document.getElementById("perfSubCompanyFilter").value="";
  document.getElementById("perfUnitFilter").value="";
  document.getElementById("perfProjectFilter").value="";
  document.getElementById("perfJointFilter").value="";
  document.getElementById("perfManagerFilter").value="";

  performanceCurrentList=[...performanceEvaluationData];
  renderPerformanceEvaluationTable();
}

function optionHTML(list,value){
  return list.map(x=>`<option value="${x}" ${value===x?"selected":""}>${x}</option>`).join("");
}

function normalizeDecimalInput(input){
  let v=input.value;

  if(v==="")return;

  v=v.replace(/[^\d.]/g,"");

  const parts=v.split(".");
  if(parts.length>2){
    v=parts[0]+"."+parts.slice(1).join("");
  }

  const n=Number(v);
  input.value=isNaN(n)?"":n.toFixed(2);
}

function renderPerformanceEvaluationRows(readonly){
  const disabled=readonly?"disabled":"";
  const uploadText=readonly?"查看附件":"附件上传";

  const groups=[
    {
      no:"一",
      title:"基本要求",
      rows:[
        [
          "1",
          "契约精神",
          "全过程",
          "实施过程中项目联合管理方未发生隐匿成本、擅自决策、利益输送等重大舞弊行为。",
          "符合"
        ],
        [
          "2",
          "协同能力",
          "全过程",
          "项目联合管理方对于一体化管理充分响应，体现应有的协同管理能力，未发生负面事件，未对项目正常实施造成不良影响。",
          "符合"
        ]
      ]
    },
    {
      no:"二",
      title:"经济指标",
      rows:[
        [
          "1",
          "过程项目毛利率",
          "合同完成率达30%以上",
          "实际毛利率达保底经济指标50%以上。",
          "符合"
        ],
        [
          "2",
          "完工项目毛利率",
          "上游结算审计完成、下游成本锁定",
          "完成公司保底经济指标。",
          "符合"
        ]
      ]
    },
    {
      no:"三",
      title:"安全管理",
      rows:[
        [
          "1",
          "安全管理",
          "全过程",
          "符合公司相关安全管理制度，未发生重大安全事故，无重大安全隐患。",
          "符合"
        ]
      ]
    },
    {
      no:"四",
      title:"质量管理",
      rows:[
        [
          "1",
          "质量管理",
          "全过程",
          "符合公司相关工程质量管理制度，未发生重大施工质量问题。",
          "符合"
        ]
      ]
    },
    {
      no:"五",
      title:"其他",
      rows:[
        [
          "1",
          "其他",
          "全过程",
          "是否存在其他重大问题。",
          "无"
        ]
      ]
    }
  ];

  return groups.map(group=>`
    <tr>
      <td>${group.no}</td>
      <td><strong>${group.title}</strong></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    ${group.rows.map((r,idx)=>`
      <tr>
        <td>${r[0]}</td>
        <td>${r[1]}</td>
        <td>${r[2]}</td>
        <td>${r[3]}</td>
        <td>
          <div class="eval-result-options">
            ${
              group.title==="其他"
              ? `
                <label>
                  <input type="radio" name="eval_${group.no}_${idx}" ${r[4]==="有"?"checked":""} ${disabled}/>
                  有
                </label>
                <label>
                  <input type="radio" name="eval_${group.no}_${idx}" ${r[4]==="无"?"checked":""} ${disabled}/>
                  无
                </label>
              `
              : `
                <label>
                  <input type="radio" name="eval_${group.no}_${idx}" ${r[4]==="符合"?"checked":""} ${disabled}/>
                  符合
                </label>
                <label>
                  <input type="radio" name="eval_${group.no}_${idx}" ${r[4]==="不符合"?"checked":""} ${disabled}/>
                  不符合
                </label>
              `
            }
          </div>
        </td>
        <td>
          <span class="upload-link" onclick="showToast('${uploadText}')">${uploadText}</span>
        </td>
      </tr>
    `).join("")}
  `).join("");
}

function renderApprovalFlowPreview(){
  return `
    <div class="performance-flow-panel">
      <div class="flow-title">审批流程预览</div>
      <div class="flow-body">
        <div class="flow-step">
          <div class="flow-dot">1</div>
          <div class="flow-content">
            <div class="flow-name">发起人提交</div>
            <div class="flow-desc">发起人填写项目联合管理方履约评价信息并提交。</div>
          </div>
        </div>

        <div class="flow-step">
          <div class="flow-dot">2</div>
          <div class="flow-content">
            <div class="flow-name">子公司领导审核</div>
            <div class="flow-desc">子公司领导对项目基本信息、评价内容及附件进行审核。</div>
          </div>
        </div>

        <div class="flow-step">
          <div class="flow-dot">3</div>
          <div class="flow-content">
            <div class="flow-name">股份产运部领导复核终审</div>
            <div class="flow-desc">股份产运部领导对履约评价结果进行复核并完成终审。</div>
          </div>
        </div>

        <div class="flow-step">
          <div class="flow-dot gray">4</div>
          <div class="flow-content">
            <div class="flow-name">完成归档</div>
            <div class="flow-desc">审批完成后生成正式履约评价记录并归档。</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
function getApprovalStatusClass(status){
  if(status==="待发起")return "draft";
  if(status==="审批中")return "processing";
  if(status==="已完成")return "done";
  if(status==="已驳回")return "reject";
  return "processing";
}

function getDefaultApprovalRecords(item){
  const now=item.createTime || "2026-06-01 09:00";

  if(item.approvalRecords && Array.isArray(item.approvalRecords)){
    return item.approvalRecords;
  }

  if(item.approvalStatus==="审批中"){
    return [
      {
        node:"发起人提交",
        status:"已完成",
        result:"提交",
        approver:item.projectManager || "张建军",
        time:now,
        comment:"已提交项目联合管理方履约评价。"
      },
      {
        node:"子公司领导审核",
        status:"处理中",
        result:"待审批",
        approver:"王子公司",
        time:"",
        comment:"等待子公司领导审核。"
      },
      {
        node:"股份产运部领导复核终审",
        status:"未开始",
        result:"待审批",
        approver:"刘产运",
        time:"",
        comment:""
      },
      {
        node:"完成归档",
        status:"未开始",
        result:"待归档",
        approver:"系统",
        time:"",
        comment:""
      }
    ];
  }

  if(item.approvalStatus==="已驳回" || item.result==="待整改"){
    return [
      {
        node:"发起人提交",
        status:"已完成",
        result:"提交",
        approver:item.projectManager || "李强",
        time:item.createTime || "2026-04-28 09:45",
        comment:"已提交项目联合管理方履约评价。"
      },
      {
        node:"子公司领导审核",
        status:"已驳回",
        result:"驳回",
        approver:"王子公司",
        time:"2026-04-29 14:20",
        comment:"经济指标预测低于项目保底指标，请补充整改说明和支撑附件后重新提交。"
      },
      {
        node:"股份产运部领导复核终审",
        status:"未开始",
        result:"待审批",
        approver:"刘产运",
        time:"",
        comment:""
      },
      {
        node:"完成归档",
        status:"未开始",
        result:"待归档",
        approver:"系统",
        time:"",
        comment:""
      }
    ];
  }

  return [
    {
      node:"发起人提交",
      status:"已完成",
      result:"提交",
      approver:item.projectManager || "张建军",
      time:item.createTime || now,
      comment:"已提交项目联合管理方履约评价。"
    },
    {
      node:"子公司领导审核",
      status:"已完成",
      result:"审批通过",
      approver:"王子公司",
      time:"2026-05-21 10:18",
      comment:"项目基本信息完整，评价内容符合要求，同意提交复核。"
    },
    {
      node:"股份产运部领导复核终审",
      status:"已完成",
      result:"审批通过",
      approver:"刘产运",
      time:"2026-05-22 15:36",
      comment:"复核通过，评价结果有效。"
    },
    {
      node:"完成归档",
      status:"已完成",
      result:"已归档",
      approver:"系统",
      time:"2026-05-22 15:40",
      comment:"流程已完成，履约评价记录已归档。"
    }
  ];
}

function getPerformanceApprovalStatus(item){
  if(item.approvalStatus)return item.approvalStatus;
  if(item.result==="待整改")return "已驳回";
  return "已完成";
}

function getApprovalDotClass(record){
  if(record.status==="已完成")return "done";
  if(record.status==="处理中")return "processing";
  if(record.status==="已驳回")return "reject";
  return "";
}

function getApprovalResultClass(record){
  if(record.result==="审批通过" || record.result==="提交" || record.result==="已归档")return "pass";
  if(record.result==="驳回")return "reject";
  return "wait";
}

function renderApprovalRecords(item){
  const status=getPerformanceApprovalStatus(item);
  const records=getDefaultApprovalRecords(item);

  return `
    <div class="approval-record-panel">
      <div class="approval-record-title">
        <span>审批记录</span>
        <span class="approval-status-tag ${getApprovalStatusClass(status)}">${status}</span>
      </div>

      <div class="approval-record-body">
        ${records.map((r,index)=>`
          <div class="approval-record-step">
            <div class="approval-record-dot ${getApprovalDotClass(r)}">${index+1}</div>
            <div class="approval-record-content">
              <div class="approval-record-node">${r.node}</div>

              <div class="approval-record-meta">
                ${
                  r.status==="未开始"
                  ? `状态：未开始`
                  : r.status==="处理中"
                    ? `审批人：${r.approver || "-"}状态：处理中`
                    : `审批人：${r.approver || "-"}时间：${r.time || "-"}`
                }
              </div>

              <div class="approval-record-result ${getApprovalResultClass(r)}">
                ${r.result || r.status}
              </div>

              ${
                r.comment
                ? `<div class="approval-record-comment">${r.comment}</div>`
                : ""
              }
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function toggleModalFullscreen(e){
  if(e)e.stopPropagation();

  const box=document.getElementById("modalBox");
  const btn=document.getElementById("modalFullscreenBtn");

  if(!box)return;

  box.classList.toggle("fullscreen");

  const isFullscreen=box.classList.contains("fullscreen");

  if(btn){
    btn.innerText=isFullscreen?"⤢":"⛶";
    btn.title=isFullscreen?"退出全屏":"全屏";
  }
}

function openPerformanceEvaluationModal(){
  const html=`
    <div class="performance-layout">
      <div class="performance-form-panel">
        <div class="performance-form-title">项目联合管理方履约评价</div>

        <table class="performance-table">
          <tr>
            <td class="label-cell required">集团下属子公司</td>
            <td colspan="3">
              <select id="perfFormSubCompany" class="select">
                <option value="">请选择</option>
                ${optionHTML(performanceOptions.subCompanies)}
              </select>
            </td>
          </tr>
          <tr>
            <td class="label-cell required">项目主管单位</td>
            <td colspan="3">
              <select id="perfFormUnit" class="select">
                <option value="">请选择</option>
                ${optionHTML(performanceOptions.projectUnits)}
              </select>
            </td>
          </tr>
          <tr>
            <td class="label-cell required">项目名称</td>
            <td colspan="3">
              <select id="perfFormProject" class="select">
                <option value="">请选择</option>
                ${optionHTML(performanceOptions.projects)}
              </select>
            </td>
          </tr>

          <tr>
            <th colspan="4" class="performance-section-title">项目基本信息</th>
          </tr>

          <tr>
            <td class="label-cell required">项目联合管理方</td>
            <td>
              <select id="perfFormJoint" class="select">
                <option value="">请选择</option>
                ${optionHTML(performanceOptions.jointManagers)}
              </select>
            </td>
            <td class="label-cell required">项目经理</td>
            <td>
              <select id="perfFormManager" class="select">
                <option value="">请选择人员</option>
                ${optionHTML(performanceOptions.managers)}
              </select>
            </td>
          </tr>

          <tr>
            <td class="label-cell required">合同价（万元）</td>
            <td>
              <div class="inline-field">
                <input id="perfFormContractPrice" class="input" type="number" step="0.01" min="0" onblur="normalizeDecimalInput(this)"/>
                <span class="field-unit">万元</span>
              </div>
            </td>
            <td class="label-cell required">项目保底经济指标B（%）</td>
            <td>
              <div class="inline-field">
                <input id="perfFormBaseB" class="input" type="number" step="0.01" min="0" onblur="normalizeDecimalInput(this)"/>
                <span class="field-unit">%</span>
              </div>
            </td>
          </tr>

          <tr>
            <td class="label-cell required">预测项目经济指标A（%）</td>
            <td>
              <div class="inline-field">
                <input id="perfFormForecastA" class="input" type="number" step="0.01" min="0" onblur="normalizeDecimalInput(this)"/>
                <span class="field-unit">%</span>
              </div>
            </td>
            <td class="label-cell required">超A以外公司占比C（%）</td>
            <td>
              <div class="inline-field">
                <input id="perfFormBeyondC" class="input" type="number" step="0.01" min="0" onblur="normalizeDecimalInput(this)"/>
                <span class="field-unit">%</span>
              </div>
            </td>
          </tr>
        </table>

        <div class="performance-section-title">履约评价</div>

        <table class="performance-table">
          <thead>
            <tr>
              <th style="width:70px">序号</th>
              <th style="width:130px">评价要素</th>
              <th style="width:160px">评价时点</th>
              <th>评价内容</th>
              <th style="width:180px">评价结果 <span style="color:var(--danger)">*</span></th>
              <th style="width:110px">附件</th>
            </tr>
          </thead>
          <tbody>
            ${renderPerformanceEvaluationRows(false)}
          </tbody>
        </table>
      </div>

      ${renderApprovalFlowPreview()}
    </div>
  `;

  openModal(
    "项目联合管理方履约评价",
    html,
    `
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn" onclick="savePerformanceDraft()">暂存</button>
      <button class="btn primary" onclick="submitPerformanceEvaluation()">提交</button>
    `,
    "large"
  );
}

function validatePerformanceForm(){
  const fields=[
    ["perfFormSubCompany","集团下属子公司"],
    ["perfFormUnit","项目主管单位"],
    ["perfFormProject","项目名称"],
    ["perfFormJoint","项目联合管理方"],
    ["perfFormManager","项目经理"],
    ["perfFormContractPrice","合同价"],
    ["perfFormBaseB","项目保底经济指标B"],
    ["perfFormForecastA","预测项目经济指标A"],
    ["perfFormBeyondC","超A以外公司占比C"]
  ];

  for(const [id,label] of fields){
    const el=document.getElementById(id);

    if(!el||!el.value){
      showToast(`请填写：${label}`);
      el&&el.focus();
      return false;
    }
  }

  return true;
}

function savePerformanceDraft(){
  showToast("履约评价已暂存");
}

function submitPerformanceEvaluation(){
  if(!validatePerformanceForm())return;

 const submitTime=new Date().toLocaleString();

const item={
  id:Date.now(),
  subCompany:document.getElementById("perfFormSubCompany").value,
  projectUnit:document.getElementById("perfFormUnit").value,
  projectName:document.getElementById("perfFormProject").value,
  jointManager:document.getElementById("perfFormJoint").value,
  projectManager:document.getElementById("perfFormManager").value,
  contractPrice:Number(document.getElementById("perfFormContractPrice").value||0),
  baseEconomicB:Number(document.getElementById("perfFormBaseB").value||0),
  forecastEconomicA:Number(document.getElementById("perfFormForecastA").value||0),
  beyondACompanyC:Number(document.getElementById("perfFormBeyondC").value||0),
  result:"合格",
  approvalStatus:"审批中",
  createTime:submitTime,
  approvalRecords:[
    {
      node:"发起人提交",
      status:"已完成",
      result:"提交",
      approver:document.getElementById("perfFormManager").value,
      time:submitTime,
      comment:"已提交项目联合管理方履约评价。"
    },
    {
      node:"子公司领导审核",
      status:"处理中",
      result:"待审批",
      approver:"王子公司",
      time:"",
      comment:"等待子公司领导审核。"
    },
    {
      node:"股份产运部领导复核终审",
      status:"未开始",
      result:"待审批",
      approver:"刘产运",
      time:"",
      comment:""
    },
    {
      node:"完成归档",
      status:"未开始",
      result:"待归档",
      approver:"系统",
      time:"",
      comment:""
    }
  ]
};


  performanceEvaluationData.unshift(item);
  performanceCurrentList=[...performanceEvaluationData];

  closeModal();

  if(typeof renderPerformanceEvaluationTable==="function"){
    renderPerformanceEvaluationTable();
  }

  showToast("履约评价已提交");
}

function openPerformanceDetail(id){
  const x=performanceEvaluationData.find(item=>String(item.id)===String(id));
  if(!x)return;

  listPage.style.display="none";
  detailPage.style.display="block";

  replaceProductionDashboardFragment(detailPage,`
    <div class="detail-breadcrumb">
      <a class="link" onclick="backPerformanceList()">履约评价</a> / ${x.projectName} / 详情
    </div>

    <div class="performance-detail-head">
      <h1 style="margin:0;font-size:20px;">履约评价详情</h1>
      <div class="actions">
        <button class="btn" onclick="backPerformanceList()">返回</button>
      </div>
    </div>

    <div class="performance-layout">
      <div class="performance-form-panel">
        <div class="performance-form-title">项目联合管理方履约评价</div>

        <table class="performance-table">
          <tr>
            <td class="label-cell">集团下属子公司</td>
            <td colspan="3">${x.subCompany}</td>
          </tr>
          <tr>
            <td class="label-cell">项目主管单位</td>
            <td colspan="3">${x.projectUnit}</td>
          </tr>
          <tr>
            <td class="label-cell">项目名称</td>
            <td colspan="3">${x.projectName}</td>
          </tr>

          <tr>
            <th colspan="4" class="performance-section-title">项目基本信息</th>
          </tr>

          <tr>
            <td class="label-cell">项目联合管理方</td>
            <td>${x.jointManager}</td>
            <td class="label-cell">项目经理</td>
            <td>${x.projectManager}</td>
          </tr>
          <tr>
            <td class="label-cell">合同价（万元）</td>
            <td>${Number(x.contractPrice).toFixed(2)} 万元</td>
            <td class="label-cell">项目保底经济指标B（%）</td>
            <td>${Number(x.baseEconomicB).toFixed(2)}%</td>
          </tr>
          <tr>
            <td class="label-cell">预测项目经济指标A（%）</td>
            <td>${Number(x.forecastEconomicA).toFixed(2)}%</td>
            <td class="label-cell">超A以外公司占比C（%）</td>
            <td>${Number(x.beyondACompanyC).toFixed(2)}%</td>
          </tr>
        </table>

        <div class="performance-section-title">履约评价</div>

        <table class="performance-table">
          <thead>
            <tr>
              <th style="width:70px">序号</th>
              <th style="width:130px">评价要素</th>
              <th style="width:160px">评价时点</th>
              <th>评价内容</th>
              <th style="width:180px">评价结果</th>
              <th style="width:110px">附件</th>
            </tr>
          </thead>
          <tbody>
           ${renderApprovalRecords(x)}
          </tbody>
        </table>
      </div>

      ${renderApprovalFlowPreview()}
    </div>
  `);

  detailPage.scrollTop=0;
}

function backPerformanceList(){
  detailPage.style.display="none";
  listPage.style.display="flex";
}
