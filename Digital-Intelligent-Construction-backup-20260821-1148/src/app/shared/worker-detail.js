function renderWorkerAnchorBar(){
  const anchors=[
    ["workerBaseInfo","基础信息"],
    ["workerIdInfo","证件信息"],
    ["workerResume","工作履历"],
    ["workerCertificates","资质证书"],
    ["workerContract","用工合同"],
    ["workerEducation","进场教育"],
    ["workerViolation","违章记录"],
    ["workerCheckRecords","抽查记录"]
  ];

  return `
    <div class="worker-anchor-bar">
      <span class="worker-anchor-title">分组定位：</span>
      ${anchors.map(a=>`
        <span class="worker-anchor-item" onclick="scrollToWorkerSection('${a[0]}')">${a[1]}</span>
      `).join("")}
    </div>
  `;
}

function renderWorkerAttachment(title,hasFile,fileName){
  return `
    <div class="worker-cert-card">
      <div class="worker-cert-card-hd">
        <span>${title}</span>
        ${hasFile?tag("已上传","green"):tag("未上传","gray")}
      </div>
      <div class="worker-cert-card-bd">
        ${
          hasFile
          ? `
            <div class="worker-attachment" onclick="previewFile('${fileName}')">
              <div class="worker-attachment-icon">📎</div>
              <div>
                <div class="worker-attachment-name">${fileName}.pdf</div>
                <div class="worker-attachment-desc">点击查看附件</div>
              </div>
            </div>
          `
          : `
            <div class="worker-section-empty">
              <div style="font-size:28px">📭</div>
              <div>暂无附件</div>
            </div>
          `
        }
      </div>
    </div>
  `;
}

function renderWorkerBaseInfoGroup(w,extra){
  return `
    <section class="detail-group worker-detail-section" id="workerBaseInfo">
      <div class="detail-group-header">
        <div class="detail-group-title">基础信息</div>
      </div>
      <div class="detail-group-body">
        <div class="info-grid">
          ${info("手机号码",maskPhone(w.phone))}
          ${info("出生年月",w.birth || "--")}
          ${info("性别",w.gender)}
          ${info("政治面貌",extra.politics)}
          ${info("文化程度",extra.educationLevel)}
          ${info("婚姻状况",extra.maritalStatus)}
          ${info("民族",extra.nation)}
          ${info("省市区",w.area)}
          ${info("详细地址",w.address)}
          ${info("重大疾病",extra.majorDisease)}
          ${info("紧急联系人",extra.emergencyContact)}
          ${info("紧急联系方式",maskPhone(extra.emergencyPhone))}
          ${info("参加工作日期",extra.workStartDate)}
          ${info("是否加入工会",extra.unionJoined)}
          ${extra.unionJoined==="是" ? info("加入工会日期",extra.unionJoinDate || "--") : ""}
        </div>
      </div>
    </section>
  `;
}

function renderWorkerIdInfoGroup(w,extra){
  return `
    <section class="detail-group worker-detail-section" id="workerIdInfo">
      <div class="detail-group-header">
        <div class="detail-group-title">证件信息</div>
      </div>
      <div class="detail-group-body">
        <div class="info-grid">
          ${info("证件类型",extra.idType)}
          ${info("证件号码",maskIdNo(extra.idNo))}
          ${info("有效期",extra.idValidDate)}
          <div class="info-item">
            <div class="info-label">证件照</div>
            <div class="id-photo-box" onclick="showToast('证件照预览')">🪪</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerResumeGroup(w){
  const list=getWorkerResumeList(w);

  return `
    <section class="detail-group worker-detail-section" id="workerResume">
      <div class="detail-group-header">
        <div class="detail-group-title">工作履历</div>
      </div>
      <div class="detail-group-body">
        <div class="table-wrap">
          <table style="min-width:1180px">
            <thead>
              <tr>
                <th style="width:70px;text-align:center">序号</th>
                <th>项目名称</th>
                <th>子公司</th>
                <th>分公司</th>
                <th>分包单位</th>
                <th>班组</th>
                <th>人员类型</th>
                <th>岗位/工种</th>
                <th>进场日期</th>
                <th>退场日期</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((r,i)=>`
                <tr>
                  <td style="text-align:center">${i+1}</td>
                  <td>${r.project || "--"}</td>
                  <td>${r.sub || "--"}</td>
                  <td>${r.branch || "--"}</td>
                  <td>${r.unit || "--"}</td>
                  <td>${r.team || "--"}</td>
                  <td>${r.type || "--"}</td>
                  <td>${tag(r.job || "--","blue")}</td>
                  <td>${r.inDate || "--"}</td>
                  <td>${r.outDate || "--"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderAttachmentLink(hasFile,fileName){
  if(!hasFile)return tag("未上传","gray");
  return `<button class="link-btn" onclick="previewFile('${fileName}')">查看附件</button>`;
}

function renderWorkerEmptyRow(colspan,text="暂无数据"){
  return `
    <tr>
      <td colspan="${colspan}" style="text-align:center;color:var(--muted);padding:22px 12px">${text}</td>
    </tr>
  `;
}

function getWorkerCertificateList(w){
  if(!(w.special || w.cert))return [];
  return [{
    workType:w.job || "--",
    certType:w.special?"特种作业操作证":"职业资格证书",
    certName:`${w.job || "作业人员"}资格证书`,
    certNo:`CERT-${String(w.id).padStart(3,"0")}-${w.job === "焊工" ? "HJ" : w.job === "架子工" ? "JZ" : "ZG"}-2026`,
    issueDate:w.id===1?"2024-04-18":"2024-03-12",
    expireDate:w.cert?"2030-04-17":"--",
    hasFile:!!w.cert
  }];
}

function getWorkerContractList(w){
  if(!w.contract)return [];
  return [{
    name:`${w.name}劳动用工合同`,
    no:`HT-${w.project.slice(0,2)}-${String(w.id).padStart(4,"0")}`,
    start:w.inDate || "--",
    end:w.outDate && w.outDate!=="--" ? w.outDate : "2027-12-31",
    hasFile:true
  }];
}

function getWorkerEducationList(w){
  if(!w.education)return [];
  return [{
    type:"三级安全教育",
    name:`${w.project}进场安全教育`,
    date:w.inDate || "--",
    hasFile:true
  }];
}

function renderWorkerCertificatesGroup(w){
  const list=getWorkerCertificateList(w);
  return `
    <section class="detail-group worker-detail-section" id="workerCertificates">
      <div class="detail-group-header">
        <div class="detail-group-title">资质证书</div>
      </div>
      <div class="detail-group-body">
        <div class="table-wrap">
          <table style="min-width:1180px">
            <thead>
              <tr>
                <th style="width:70px;text-align:center">序号</th>
                <th>工种</th>
                <th>证书类型</th>
                <th>证件名称</th>
                <th>证件编号</th>
                <th>发证日期</th>
                <th>有效期（截止）</th>
                <th>资质证书附件</th>
              </tr>
            </thead>
            <tbody>
              ${list.length?list.map((r,i)=>`
                <tr>
                  <td style="text-align:center">${i+1}</td>
                  <td>${r.workType}</td>
                  <td>${r.certType}</td>
                  <td>${r.certName}</td>
                  <td>${r.certNo}</td>
                  <td>${r.issueDate}</td>
                  <td>${r.expireDate}</td>
                  <td>${renderAttachmentLink(r.hasFile,"资质证书")}</td>
                </tr>
              `).join(""):renderWorkerEmptyRow(8)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerContractGroup(w){
  const list=getWorkerContractList(w);
  return `
    <section class="detail-group worker-detail-section" id="workerContract">
      <div class="detail-group-header"><div class="detail-group-title">用工合同</div></div>
      <div class="detail-group-body">
        <div class="table-wrap">
          <table style="min-width:880px">
            <thead><tr><th style="width:70px;text-align:center">序号</th><th>合同名称</th><th>合同编号</th><th>开始日期</th><th>结束日期</th><th>合同附件</th></tr></thead>
            <tbody>
              ${list.length?list.map((r,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${r.name}</td><td>${r.no}</td><td>${r.start}</td><td>${r.end}</td><td>${renderAttachmentLink(r.hasFile,"用工合同")}</td></tr>`).join(""):renderWorkerEmptyRow(6)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerEducationGroup(w){
  const list=getWorkerEducationList(w);
  return `
    <section class="detail-group worker-detail-section" id="workerEducation">
      <div class="detail-group-header"><div class="detail-group-title">进场教育</div></div>
      <div class="detail-group-body">
        <div class="table-wrap">
          <table style="min-width:760px">
            <thead><tr><th style="width:70px;text-align:center">序号</th><th>教育类型</th><th>教育名称</th><th>教育日期</th><th>进场教育附件</th></tr></thead>
            <tbody>
              ${list.length?list.map((r,i)=>`<tr><td style="text-align:center">${i+1}</td><td>${r.type}</td><td>${r.name}</td><td>${r.date}</td><td>${renderAttachmentLink(r.hasFile,"进场教育")}</td></tr>`).join(""):renderWorkerEmptyRow(5)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerBuildingGroup(id,title){
  return `
    <section class="detail-group worker-detail-section" id="${id}">
      <div class="detail-group-header"><div class="detail-group-title">${title}</div></div>
      <div class="detail-group-body">
        <div class="worker-module-building">
          <div class="worker-module-building-icon">🚧</div>
          <div class="worker-module-building-text">模块建设中</div>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerViolationGroup(w){
  const records=(w.violations || []).slice().sort((a,b)=>new Date(b.time)-new Date(a.time));

  return `
    <section class="detail-group worker-detail-section" id="workerViolation">
      <div class="detail-group-header">
        <div class="detail-group-title">违章记录</div>
      </div>
      <div class="detail-group-body">
        <div class="table-wrap">
          <table style="min-width:980px">
            <thead>
              <tr>
                <th style="width:70px;text-align:center">序号</th>
                <th>违章时间</th>
                <th>违章内容</th>
                <th>项目名称</th>
                <th>分包单位</th>
              </tr>
            </thead>
            <tbody>
              ${records.length?records.map((r,i)=>`
                <tr>
                  <td style="text-align:center">${i+1}</td>
                  <td>${r.time || "--"}</td>
                  <td>${r.content || "--"}</td>
                  <td>${r.project || "--"}</td>
                  <td>${r.unit || "--"}</td>
                </tr>
              `).join(""):renderWorkerEmptyRow(5)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function renderWorkerCheckRecordsGroup(w){
  const records=w.records || [];

  return `
    <section class="detail-group worker-detail-section" id="workerCheckRecords">
      <div class="detail-group-header">
        <div class="detail-group-title">抽查记录</div>
      </div>
      <div class="detail-group-body">
        ${
          records.length
          ? `
            <div class="table-wrap">
              <table style="min-width:760px">
                <thead>
                  <tr>
                    <th style="width:70px;text-align:center">序号</th>
                    <th>抽查人</th>
                    <th>抽查时间</th>
                    <th>抽查结果</th>
                    <th>备注说明</th>
                  </tr>
                </thead>
                <tbody>
                  ${records.map((r,i)=>`
                    <tr>
                      <td style="text-align:center">${i+1}</td>
                      <td>${r.ai?'AI自动抽查':(r.person||'')}</td>
                      <td>${r.time}</td>
                      <td>${r.result==="合格"?tag("合格","green"):tag("不合格","red")}</td>
                      <td>${r.remark || "--"}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `
          : `
            <div class="worker-section-empty">
              <div style="font-size:30px">📝</div>
              <div>暂无抽查记录</div>
            </div>
          `
        }
      </div>
    </section>
  `;
}

function placeholderHTML(name,icon,desc){
  return `
    <div class="compact-title-row">
      <div class="module-title">${name}</div>
    </div>
    <section class="card table-card">
      <div class="card-bd" style="flex:1;display:flex;align-items:center;justify-content:center;text-align:center;color:var(--muted)">
        <div>
          <div style="font-size:56px;margin-bottom:16px">${icon}</div>
          <div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px">${name}</div>
          <div>${desc}</div>
        </div>
      </div>
    </section>
  `;
}

function openDetail(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;

  listPage.style.display="none";
  detailPage.style.display="block";
  detailPage.innerHTML=renderWorkerDetailContent(w);
  detailPage.scrollTop=0;
}


function renderWorkerDetailContent(w,options={}){
  const extra=getWorkerExtraInfo(w);
  const breadcrumb=options.showBreadcrumb===false?"":`
    <div class="detail-breadcrumb">
      <a class="link" onclick="backList()">劳务工花名册</a> / ${w.name} / 详情
    </div>
  `;

  const header=options.showHeader===false?"":`
    <div class="detail-page-head">
      <h1>劳务工详情</h1>
      <div class="actions">
        <button class="btn" onclick="backList()">返回</button>
        <button class="btn danger" onclick="toggleBlack(${w.id})">${w.black?"移出黑名单":"拉黑"}</button>
      </div>
    </div>
  `;

  const anchor=options.showAnchor===false?"":renderWorkerAnchorBar();

  return `
    ${breadcrumb}
    ${header}

    <section class="worker-detail-hero-card">
      <div class="worker-detail-hero-body">
        <div class="worker-photo">👷</div>

        <div class="worker-main-info">
          <div class="worker-main-name">
            <span>${w.name}</span>
            ${w.type==="特种作业人员"?tag(w.type,"purple"):tag(w.type || "--","gray")}
            ${tag(w.job || "--","blue")}
            ${w.black?tag("黑名单","red"):""}
            ${w.status==="已进场"?tag("已进场","green"):tag(w.status || "未知","gray")}
          </div>

          <div class="worker-main-meta">
            ${workerMeta("当前所在分包单位",w.unit)}
            ${workerMeta("当前所在班组",w.team)}
            ${workerMeta("进场日期",w.inDate)}
            ${workerMeta("退场日期",w.outDate || "--")}
          </div>
        </div>
      </div>
    </section>

    ${anchor}

    ${renderWorkerBaseInfoGroup(w,extra)}
    ${renderWorkerIdInfoGroup(w,extra)}
    ${renderWorkerResumeGroup(w)}
    ${renderWorkerCertificatesGroup(w)}
    ${renderWorkerContractGroup(w)}
    ${renderWorkerEducationGroup(w)}
    ${renderWorkerViolationGroup(w)}
    ${renderWorkerCheckRecordsGroup(w)}
  `;
}

function openWorkerSpotCheck(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;

  openModal(
    `${w.name} - 劳务工抽查`,
    `
      <div class="spot-check-modal">
        <div class="spot-check-detail">
          ${renderWorkerDetailContent(w,{showBreadcrumb:false,showHeader:false,showAnchor:true})}
        </div>
      </div>
    `,
    `
      <div class="spot-check-footer">
        <div class="spot-check-form">
          <div class="spot-check-result">
            <span class="spot-check-label">本次抽查结果：</span>
            <label><input type="radio" name="spotCheckResult" value="合格" checked onchange="onSpotCheckResultChange()"> 合格</label>
            <label><input type="radio" name="spotCheckResult" value="不合格" onchange="onSpotCheckResultChange()"> 不合格</label>
          </div>
          <div class="spot-check-remark">
            <span class="spot-check-label">备注说明：</span>
            <textarea id="spotCheckRemark" placeholder="选择不合格时备注说明必填"></textarea>
          </div>
          <div class="spot-check-error" id="spotCheckError"></div>
        </div>
        <div class="spot-check-actions">
          <button class="btn" onclick="closeModal()">关闭</button>
          <button class="btn primary" onclick="submitWorkerSpotCheck(${w.id})">提交抽查</button>
          <button class="btn primary danger-primary rectify-hidden" id="spotCheckRectifyBtn" onclick="submitWorkerSpotCheckAndRectify(${w.id})">提交抽查结果并发起整改</button>
        </div>
      </div>
    `,
    "large"
  );
  modalBox.classList.add("spot-check-modal-box");
}

function onSpotCheckResultChange(){
  const result=document.querySelector('input[name="spotCheckResult"]:checked')?.value || "合格";
  const remark=document.getElementById("spotCheckRemark");
  const error=document.getElementById("spotCheckError");
  const rectifyBtn=document.getElementById("spotCheckRectifyBtn");

  if(remark){
    remark.placeholder=result==="不合格"?"选择不合格时备注说明必填":"合格时备注说明可选填";
  }
  if(rectifyBtn){
    rectifyBtn.classList.toggle("rectify-hidden", result!=="不合格");
  }
  if(error)error.innerText="";
}

function saveWorkerSpotCheckRecord(id,toastText){
  const w=workers.find(x=>x.id===id);
  if(!w)return null;

  const result=document.querySelector('input[name="spotCheckResult"]:checked')?.value || "合格";
  const remarkEl=document.getElementById("spotCheckRemark");
  const remark=(remarkEl?.value || "").trim();
  const error=document.getElementById("spotCheckError");

  if(result==="不合格" && !remark){
    if(error)error.innerText="选择不合格时，备注说明必填。";
    if(remarkEl)remarkEl.focus();
    return null;
  }

  const now=new Date();
  const pad=n=>String(n).padStart(2,"0");
  const time=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  if(!Array.isArray(w.records)){
    w.records=[];
  }

  w.records.unshift({
    person:"王安全",
    time,
    result,
    remark:remark || (result==="合格"?"本次抽查合格":"")
  });

  showToast(toastText || `${w.name} 抽查记录已提交`);
  return w;
}

function submitWorkerSpotCheck(id){
  const w=saveWorkerSpotCheckRecord(id);
  if(!w)return;

  closeModal();

  if(detailPage.style.display!=="none"){
    openDetail(id);
  }else{
    renderTable();
  }
}

function submitWorkerSpotCheckAndRectify(id){
  const result=document.querySelector('input[name="spotCheckResult"]:checked')?.value || "合格";
  const error=document.getElementById("spotCheckError");
  if(result!=="不合格"){
    if(error)error.innerText="只有抽查结果为不合格时，才能发起整改。";
    return;
  }
  const w=saveWorkerSpotCheckRecord(id,"抽查结果保存成功");
  if(!w)return;
  closeModal();
  openHazardRectificationModal(id);
}

const hazardTypeTree={
  "重大隐患":{
    "起重吊装":["无司索指挥证书上岗","吊装区域未设置警戒线","吊索具磨损超限"],
    "高处作业":["未按规定使用安全带","临边洞口防护缺失","高处抛物"],
    "临时用电":["配电箱防护缺失","一闸多机","电缆拖地破损"]
  },
  "一般隐患":{
    "安全穿戴":["未佩戴安全帽","反光背心穿戴不规范","劳保鞋穿戴不规范"],
    "文明施工":["材料堆放不规范","作业面清理不到位","临时通道堵塞"],
    "动火作业":["作业点灭火器配置不足","动火监护不到位","防火隔离不到位"],
    "临边防护":["作业面临边防护缺失","安全网局部破损","警示标识缺失"]
  }
};

function optionHtml(list,placeholder){
  return `<option value="">${placeholder}</option>` + list.map(x=>`<option value="${x}">${x}</option>`).join("");
}

const hazardCascaderState={level1:"",level2:"",level3:""};
let hazardCascaderInternalClick=false;

function renderHazardTypeCascader(){
  return `
    <div class="hazard-cascader single" id="hazardTypeCascader">
      <div class="hazard-cascader-control" onclick="toggleHazardTypePanel(event)" onmousedown="keepHazardCascaderOpen(event)">
        <input id="hazardTypeDisplay" readonly placeholder="请选择隐患类型" value="">
        <span class="hazard-cascader-arrow">⌄</span>
      </div>
      <input type="hidden" id="hazardType" value="">
      <div class="hazard-cascader-panel" id="hazardTypePanel" onclick="keepHazardCascaderOpen(event)" onmousedown="keepHazardCascaderOpen(event)">
        <div class="hazard-cascader-col" id="hazardTypeCol1"></div>
        <div class="hazard-cascader-col" id="hazardTypeCol2"></div>
        <div class="hazard-cascader-col" id="hazardTypeCol3"></div>
      </div>
    </div>`;
}

function keepHazardCascaderOpen(evt){
  hazardCascaderInternalClick=true;
  window.clearTimeout(window.__hazardCascaderClickTimer);
  window.__hazardCascaderClickTimer=window.setTimeout(()=>{hazardCascaderInternalClick=false;},80);
  if(evt){
    evt.stopPropagation();
    if(evt.type==="mousedown" || evt.type==="pointerdown") evt.preventDefault();
  }
}

function toggleHazardTypePanel(evt){
  keepHazardCascaderOpen(evt);
  const panel=document.getElementById("hazardTypePanel");
  const root=document.getElementById("hazardTypeCascader");
  if(!panel||!root)return;
  const willOpen=!root.classList.contains("open");
  document.querySelectorAll(".hazard-cascader.single.open").forEach(x=>x.classList.remove("open"));
  if(willOpen){
    root.classList.add("open");
    renderHazardTypeColumns(1);
  }
  syncModalDropdownLayer();
}

function renderHazardTypeColumns(activeLevel){
  const col1=document.getElementById("hazardTypeCol1");
  const col2=document.getElementById("hazardTypeCol2");
  const col3=document.getElementById("hazardTypeCol3");
  if(!col1||!col2||!col3)return;
  const l1s=Object.keys(hazardTypeTree);
  const l2s=hazardCascaderState.level1?Object.keys(hazardTypeTree[hazardCascaderState.level1]||{}):[];
  const l3s=(hazardCascaderState.level1&&hazardCascaderState.level2)?(hazardTypeTree[hazardCascaderState.level1][hazardCascaderState.level2]||[]):[];
  col1.innerHTML=l1s.map(x=>renderHazardTypeOption(x,1,x===hazardCascaderState.level1,!!hazardTypeTree[x])).join("");
  col2.innerHTML=l2s.length?l2s.map(x=>renderHazardTypeOption(x,2,x===hazardCascaderState.level2,true)).join(""):`<div class="hazard-cascader-empty">请选择一级分类</div>`;
  col3.innerHTML=l3s.length?l3s.map(x=>renderHazardTypeOption(x,3,x===hazardCascaderState.level3,false)).join(""):`<div class="hazard-cascader-empty">请选择二级分类</div>`;
}

function renderHazardTypeOption(text,level,active,hasChildren){
  return `<div class="hazard-cascader-option ${active?"active":""}" onmousedown="keepHazardCascaderOpen(event)" onclick="selectHazardTypeLevel(event,${level},'${String(text).replace(/'/g,"&#39;")}')"><span>${text}</span>${hasChildren?"<b>›</b>":""}</div>`;
}

function selectHazardTypeLevel(evt,level,value){
  keepHazardCascaderOpen(evt);
  document.getElementById("hazardTypeCascader")?.classList.add("open");
  if(level===1){
    hazardCascaderState.level1=value;
    hazardCascaderState.level2="";
    hazardCascaderState.level3="";
    renderHazardTypeColumns(2);
    syncHazardTypeValue();
    document.getElementById("hazardTypeCascader")?.classList.add("open");
    syncModalDropdownLayer();
    return;
  }
  if(level===2){
    hazardCascaderState.level2=value;
    hazardCascaderState.level3="";
    renderHazardTypeColumns(3);
    syncHazardTypeValue();
    document.getElementById("hazardTypeCascader")?.classList.add("open");
    syncModalDropdownLayer();
    return;
  }
  hazardCascaderState.level3=value;
  renderHazardTypeColumns(3);
  syncHazardTypeValue();
  document.getElementById("hazardTypeCascader")?.classList.remove("open");
  syncModalDropdownLayer();
}

function syncHazardTypeValue(){
  const parts=[hazardCascaderState.level1,hazardCascaderState.level2,hazardCascaderState.level3].filter(Boolean);
  const isLeafSelected=parts.length===3;
  const value=isLeafSelected?parts.join(" / "):"";
  const hidden=document.getElementById("hazardType");
  const display=document.getElementById("hazardTypeDisplay");
  if(hidden)hidden.value=value;
  // 级联基础用法：一级、二级点击只展开下级，不算完成选择；只有点到第三级叶子节点后才回填输入框。
  if(display)display.value=value;
}

document.addEventListener("click",function(evt){
  const root=document.getElementById("hazardTypeCascader");
  if(hazardCascaderInternalClick || (root && root.contains(evt.target))){
    hazardCascaderInternalClick=false;
    return;
  }
  document.querySelectorAll(".hazard-cascader.single.open").forEach(x=>x.classList.remove("open"));
  syncModalDropdownLayer();
});

function renderProjectRosterOptions(worker){
  const sameProject=workers.filter(x=>x.project===worker.project);
  const pool=sameProject.length?sameProject:workers;
  const names=[...new Set(pool.map(x=>x.name).filter(Boolean))];
  return `<option value="">请选择人员</option>` + names.map(name=>`<option value="${name}" ${name===worker.name?"":""}>${name}</option>`).join("");
}

function openHazardRectificationModal(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;
  const rosterOptions=renderProjectRosterOptions(w);
  openModal("发起隐患整改",`
    <div class="hazard-form arco-hazard-form">
      <div class="hazard-group">
        <div class="hazard-group-title"><span>隐患信息</span></div>
        <div class="hazard-grid hazard-grid-top">
          <label class="hazard-field required"><span>整改单类型</span><select id="hazardOrderType"><option selected>日常检查-股份公司</option></select></label>
          <label class="hazard-field required project-span"><span>项目名称</span><input id="hazardProject" value="${w.project || ""}" readonly></label>
          <label class="hazard-field required"><span>隐患类型</span>${renderHazardTypeCascader()}</label>
          <div class="hazard-field required compact"><span>是否重大事故隐患</span><div class="hazard-radio-row"><label><input type="radio" name="hazardMajor" value="一般隐患" checked> 一般隐患</label><label><input type="radio" name="hazardMajor" value="重大事故隐患"> 重大事故隐患</label></div></div>
          <div class="hazard-field required compact"><span>人物管环 <i class="hazard-help">i${renderHazardHelpPanel()}</i></span><div class="hazard-check-row"><label><input type="checkbox" name="hazardFactor" value="人"> 人</label><label><input type="checkbox" name="hazardFactor" value="物"> 物</label><label><input type="checkbox" name="hazardFactor" value="管"> 管</label><label><input type="checkbox" name="hazardFactor" value="环"> 环</label></div></div>
          <label class="hazard-field required compact"><span>升级状态</span><select id="hazardUpgrade"><option selected>不升级</option><option>升级到项目经理</option><option>升级到分公司</option><option>升级到子公司</option></select></label>
          <label class="hazard-field required compact"><span>整改时效</span><select id="hazardLimit"><option selected>8小时</option><option>2天</option><option>3天</option><option>4天</option><option>5天</option><option>6天</option><option>7天</option></select></label>
          <label class="hazard-field required wide"><span>隐患图片</span><div class="hazard-upload"><input id="hazardImages" type="file" accept="image/*" multiple onchange="updateHazardImageTip()"><div><b>点击上传隐患图片</b><small id="hazardImageTip">必传，最多上传9张</small></div></div></label>
          <label class="hazard-field required wide"><span>隐患描述</span><textarea id="hazardDesc" placeholder="请输入隐患描述，例如：${w.name} 抽查不合格，需发起整改闭环。"></textarea></label>
        </div>
      </div>
      <div class="hazard-group">
        <div class="hazard-group-title"><span>整改信息</span></div>
        <div class="hazard-grid hazard-grid-rectify">
          <label class="hazard-field required"><span>所属分包单位</span><input id="hazardUnit" value="${w.unit || ""}" readonly></label>
          <label class="hazard-field required"><span>隐患责任人（违章人员）</span><input id="hazardPerson" value="${w.name || ""}" readonly></label>
          <label class="hazard-field required"><span>落实整改责任人</span><select id="hazardImplementer">${rosterOptions}</select></label>
          <label class="hazard-field required"><span>整改核验人</span><select id="hazardVerifier">${rosterOptions}</select></label>
        </div>
      </div>
      <div class="hazard-error" id="hazardError"></div>
    </div>
  `,`<button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="submitHazardRectification(${id})">发起整改</button>`,"large");
  modalBox.classList.add("hazard-modal-box","arco-hazard-modal");
}

function renderHazardHelpPanel(){
  return `<em class="hazard-help-card">
    <strong><span class="help-ico">👤</span><span>人的原因</span></strong><p>包括人的不安全行为，如操作错误、忽视安全警告、使用不安全设备、冒险进入危险场所、疲劳作业、违规操作等。</p>
    <strong><span class="help-ico">🧰</span><span>物的原因</span></strong><p>涉及设备、工具等的不安全状态，如机械设备失修、防护装置缺失、设备设计缺陷、老化设备故障、安全设施失效等。</p>
    <strong><span class="help-ico">🍃</span><span>环境因素</span></strong><p>包括工作环境的不良条件，如照明不足、通风不良、地面湿滑、无安全通道、高温噪声等。</p>
    <strong><span class="help-ico">📘</span><span>管理因素</span></strong><p>指安全管理中的缺陷，如安全教育不到位、安全管理制度未执行、不完善、应急救援措施缺失等。</p>
  </em>`;
}

function updateHazardImageTip(){
  const input=document.getElementById("hazardImages");
  const tip=document.getElementById("hazardImageTip");
  const count=input?.files?.length || 0;
  if(tip)tip.innerText=count?`已选择 ${count} 张，最多上传9张`:"必传，最多上传9张";
}

function submitHazardRectification(id){
  const required=[
    ["hazardType","请选择隐患类型"],
    ["hazardDesc","请填写隐患描述"],
    ["hazardImplementer","请填写落实整改责任人"],
    ["hazardVerifier","请填写整改核验人"]
  ];
  const error=document.getElementById("hazardError");
  for(const [field,msg] of required){
    const el=document.getElementById(field);
    if(!String(el?.value || "").trim()){
      if(error)error.innerText=msg;
      el?.focus();
      return;
    }
  }
  const factors=[...document.querySelectorAll('input[name="hazardFactor"]:checked')].map(x=>x.value);
  if(!factors.length){
    if(error)error.innerText="请选择人物管环。";
    return;
  }
  const images=document.getElementById("hazardImages");
  const imageCount=images?.files?.length || 0;
  if(imageCount<1){
    if(error)error.innerText="请上传隐患图片。";
    return;
  }
  if(imageCount>9){
    if(error)error.innerText="隐患图片最多上传9张。";
    return;
  }
  closeModal();
  showToast("隐患整改发起成功");
  if(detailPage.style.display!=="none"){
    openDetail(id);
  }else{
    renderTable();
  }
}

function backList(){
  detailPage.style.display="none";
  listPage.style.display="flex";
}

function toggleBlack(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;

  w.black=!w.black;

  showToast(w.black?`${w.name} 已加入黑名单`:`${w.name} 已移出黑名单`);

  openDetail(id);
}


function openWorkHistory(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;
  const rows=getWorkerResumeList(w);

  openModal("工作履历",`
    <div class="table-wrap">
      <table style="width:100%;min-width:1180px">
        <thead>
          <tr>
            <th style="width:70px;text-align:center">序号</th>
            <th>项目名称</th>
            <th>子公司</th>
            <th>分公司</th>
            <th>分包单位</th>
            <th>班组</th>
            <th>人员类型</th>
            <th>岗位/工种</th>
            <th>进场日期</th>
            <th>退场日期</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r,i)=>`
            <tr>
              <td style="text-align:center">${i+1}</td>
              <td>${r.project || "--"}</td>
              <td>${r.sub || "--"}</td>
              <td>${r.branch || "--"}</td>
              <td>${r.unit || "--"}</td>
              <td>${r.team || "--"}</td>
              <td>${r.type || "--"}</td>
              <td>${tag(r.job || "--","blue")}</td>
              <td>${r.inDate || "--"}</td>
              <td>${r.outDate || "--"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

function openViolations(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;
  const rows=(w.violations || []).slice().sort((a,b)=>new Date(b.time)-new Date(a.time));

  openModal("违章记录",`
    <div class="table-wrap">
      <table style="width:100%;min-width:980px">
        <thead>
          <tr>
            <th style="width:70px;text-align:center">序号</th>
            <th>违章时间</th>
            <th>违章内容</th>
            <th>项目名称</th>
            <th>分包单位</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length?rows.map((r,i)=>`
            <tr>
              <td style="text-align:center">${i+1}</td>
              <td>${r.time || "--"}</td>
              <td>${r.content || "--"}</td>
              <td>${r.project || "--"}</td>
              <td>${r.unit || "--"}</td>
            </tr>
          `).join(""):renderWorkerEmptyRow(5)}
        </tbody>
      </table>
    </div>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`,"large");
}

function openChecks(id){
  const w=workers.find(x=>x.id===id);
  if(!w)return;

  openModal("抽查记录",`
    <table style="width:100%">
      <thead>
        <tr>
          <th>序号</th>
          <th>抽查人</th>
          <th>抽查时间</th>
          <th>结果</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        ${(w.records||[]).slice().sort((a,b)=>new Date(b.time)-new Date(a.time)).map((r,i)=>`
          <tr>
            <td>${i+1}</td>
            <td>${r.ai?'AI自动抽查':(r.person||'')}</td>
            <td>${r.time}</td>
            <td>${r.result==="合格"?tag("合格","green"):tag("不合格","red")}</td>
            <td>${r.remark}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `,`<button class="btn" onclick="closeModal()">关闭</button>`);
}

function openNestedModal(title,html,footerHtml){
  const mask=document.createElement("div");
  mask.className="modal-mask nested-modal-mask";
  mask.style.display="flex";
  mask.innerHTML=`
    <div class="modal nested-modal">
      <div class="modal-hd">
        <span>${title}</span>
        <div class="modal-hd-actions">
          <span class="close" onclick="closeNestedModal(this)">×</span>
        </div>
      </div>
      <div class="modal-bd">${html}</div>
      <div class="modal-ft">
        ${footerHtml || `<button class="btn" onclick="closeNestedModal(this)">关闭</button>`}
      </div>
    </div>
  `;
  document.body.appendChild(mask);
}

function closeNestedModal(el){
  const mask=el?.closest(".nested-modal-mask") || document.querySelector(".nested-modal-mask:last-of-type");
  if(mask)mask.remove();
}

function renderAttachmentPreviewHtml(name){
  return `
    <div style="height:260px;border:1px solid var(--border);border-radius:8px;background:#FAFBFC;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px">
      <div style="font-size:46px">📄</div>
      <strong>${name}.pdf</strong>
      <div style="color:var(--muted)">模拟附件在线预览区域</div>
    </div>
  `;
}

function previewFile(name){
  const html=renderAttachmentPreviewHtml(name);

  if(modalMask.style.display==="flex" && modalBox.classList.contains("spot-check-modal-box")){
    openNestedModal("附件预览",html);
    return;
  }

  openModal("附件预览",html,`<button class="btn" onclick="closeModal()">关闭</button>`);
}

function renderSupplierBaseProfileGroup(s){
  return `
    <div class="detail-group">
      <div class="detail-group-header">
        <div class="detail-group-title">基础画像</div>
      </div>
      <div class="detail-group-body">
        <div class="info-grid">
          ${info("所属层级",s.level)}
          ${info("所属子公司",s.subCompany)}
          ${info("分包商",s.name)}
          ${info("企业性质",s.nature)}
          ${info("注册资本",s.capital)}
          ${info("法人代表",s.legal)}
          ${info("联系人",s.contact)}
          ${info("联系电话",s.phone)}
          ${info("主要承建分包工程名称",s.project)}
          ${info("承建主营业务范围",s.mainBiz)}
          ${info("拓展业务范围",s.expandBiz)}
          ${info("合作时间",s.coopYears+" 年")}
          ${info("近三年平均年产值",s.avgOutput)}
          ${info("上年度产值",s.lastOutput)}
          ${info("产值占比",s.outputRatio+"%")}
          ${info("自有员工人数",s.staff)}
          ${info("现场管理团队数量",s.teams)}
          ${info("务工人员人数",s.workers)}
          ${info("民工工资发放程序",s.wage)}
          ${info("主要自有设备、材料等",s.assets)}
          ${info("资产负债率",s.debtRatio+"%")}
          ${info("非行政性固定资产",s.nonAdminAssets)}
          ${info("融资贷款情况",s.loan)}
          ${info("工期节点履约率",s.scheduleRate+"%")}
          ${info("质量验收合格率",s.qualityRate+"%")}
          ${info("安全文明施工",s.safety==="是"?"达标":"未达标")}
          ${info("是否受到处罚",s.punished)}
          ${info("签证变更",s.visa)}
          ${info("结算配合度",s.settlement)}
          ${info("是否有重大投诉",s.complaint)}
        </div>
      </div>
    </div>
  `;
}

function renderSupplierCooperationGroup(s){
  const avgScore=s.punished==="是"?78:92;
  const goodRate=s.punished==="是"?"82%":"96%";

  return `
    <div class="detail-group" id="supplierCooperationEvaluationGroup">
      <div class="detail-group-header">
        <div class="detail-group-title">过往合作评价</div>
      </div>
      <div class="detail-group-body">
        <div class="info-grid">
          ${info("评价次数",s.evalCount)}
          ${info("平均得分",avgScore)}
          ${info("好评率",goodRate)}
          ${info("合作年限",s.coopYears+" 年")}
        </div>

        <div class="table-wrap" style="margin-top:14px">
          <table style="min-width:760px">
            <thead>
              <tr>
                <th>序号</th>
                <th>合作项目</th>
                <th>评价时间</th>
                <th>评价得分</th>
                <th>评价等级</th>
                <th>评价说明</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from({length:s.evalCount}).map((_,i)=>{
                const score=Math.max(70,98-i*3-(s.punished==="是"?5:0));
                const grade=score>=90?"优秀":score>=80?"良好":"一般";

                return `
                  <tr>
                    <td>${i+1}</td>
                    <td>${s.project}</td>
                    <td>202${6-i}-12-18</td>
                    <td>${score}</td>
                    <td>${grade==="优秀"?tag(grade,"green"):grade==="良好"?tag(grade,"blue"):tag(grade,"orange")}</td>
                    <td>整体履约正常，质量、安全、进度及结算配合度表现稳定。</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function openSupplierDetail(id,anchor){
  const s=supplierLedgerData.find(x=>x.id===id);
  if(!s)return;

  listPage.style.display="none";
  detailPage.style.display="block";

  detailPage.innerHTML=`
    <div class="detail-breadcrumb">
      <a class="link" onclick="backSupplierLedgerList()">供应商基础画像</a> / ${s.name} / 详情
    </div>

    <div class="detail-page-head">
      <h1>供应商详情</h1>
      <div class="actions">
        <button class="btn" onclick="backSupplierLedgerList()">返回</button>
      </div>
    </div>

    <section class="card">
      <div class="card-bd">
        <div class="detail-hero">
          <div class="avatar">🏭</div>
          <div class="hero-info">
            <h2>${s.name}</h2>
            <div class="hero-meta">
              <span>所属层级：${s.level}</span>
              <span>所属子公司：${s.subCompany}</span>
              <span>联系人：${s.contact}</span>
              <span>合作时间：${s.coopYears} 年</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${renderSupplierBaseProfileGroup(s)}
    ${renderSupplierCooperationGroup(s)}
  `;

  detailPage.scrollTop=0;

  if(anchor==="cooperation"){
    setTimeout(()=>{
      const el=document.getElementById("supplierCooperationEvaluationGroup");
      if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
    },80);
  }
}

function backSupplierLedgerList(){
  detailPage.style.display="none";
  listPage.style.display="flex";
}

function openSupplierEvaluations(id){
  openSupplierDetail(id,"cooperation");
}

function openSupplierScoreDetail(id){
  const x=supplierScoreRecordData.find(i=>i.id===id);
  if(!x)return;

  openModal(`${x.supplierName} - 评分详情`,`
    <div class="info-grid">
      ${info("评价年份",x.year)}
      ${info("供应商名称",x.supplierName)}
      ${info("供应商分类",x.category)}
      ${info("采购商名称",x.purchaserName)}
      ${info("基础资料评分",x.baseScore+" 分")}
      ${info("投标响应评分",x.bidScore+" 分")}
      ${info("合同履约评分",x.contractScore+" 分")}
      ${info("活跃度评分",x.activeScore+" 分")}
      ${info("总分",x.totalScore+" 分")}
      ${info("评分时间",x.scoreTime)}
    </div>

    <div style="margin-top:16px;border:1px solid var(--border);border-radius:8px;padding:14px;background:#FAFBFC;color:var(--sub);line-height:24px">
      <strong style="color:var(--text)">评价说明：</strong>
      当前评分由基础资料、投标响应、合同履约、活跃度四个维度组成，总分用于供应商分级、准入复核、履约评价和后续采购决策参考。
    </div>
  `);
}

function openModal(title,html,footerHtml,modalSize){
  modalTitle.innerText=title;
  modalBody.innerHTML=html;
  modalFooter.innerHTML=footerHtml || `
    <button class="btn" onclick="closeModal()">关闭</button>
    <button class="btn primary" onclick="closeModal()">确认</button>
  `;

  modalBox.className="modal"+(modalSize==="large"?" large":"");

  const btn=document.getElementById("modalFullscreenBtn");
  if(btn){
    btn.innerText="⛶";
    btn.title="全屏";
    btn.style.display=modalSize==="large"?"inline-flex":"none";
  }

  modalMask.style.display="flex";
}


function closeModal(){
  modalMask.style.display="none";
  modalBox.className="modal";

  const btn=document.getElementById("modalFullscreenBtn");
  if(btn){
    btn.innerText="⛶";
    btn.title="全屏";
  }

  modalFooter.innerHTML=`
    <button class="btn" onclick="closeModal()">关闭</button>
    <button class="btn primary" onclick="closeModal()">确认</button>
  `;
}


function showToast(msg){
  if(window.__toastTimer)clearTimeout(window.__toastTimer);
  toast.innerText=msg;
  toast.style.display="block";

  window.__toastTimer=setTimeout(()=>{
    toast.style.display="none";
  },2200);
}

function toggleUserDropdown(e){
  e.stopPropagation();
  document.querySelector(".org-switch")?.classList.remove("open");
  document.querySelector(".user-menu")?.classList.toggle("open");
}

function toggleOrgDropdown(e){
  e.stopPropagation();
  document.querySelector(".user-menu")?.classList.remove("open");
  document.querySelector(".org-switch")?.classList.toggle("open");
}

function selectOrg(e,name,parentName=""){
  e.stopPropagation();

  currentOrgName.innerText=name;

  const masterItem=parentName
    ? organizationMasterData.find(item=>item.level===3&&item.name===name&&getOrganizationByCode(item.parentCode)?.name===parentName)
    : getOrganizationByName(name);
  const orgDescription=e.currentTarget.querySelector(".org-desc")?.textContent||"";
  const level=orgDescription.includes("分公司 ·")?3:orgDescription.includes("子公司 ·")?2:name==="隧道股份"?1:parentName?3:2;
  const parent=level===3?getOrganizationByCode(masterItem?.parentCode):null;
  window.__CURRENT_ORGANIZATION__={name,level,company:level===2?name:level===3?(parent?.name||parentName):"",branch:level===3?name:""};
  currentOrgName.dataset.orgLevel=String(level);
  currentOrgName.dataset.orgCompany=window.__CURRENT_ORGANIZATION__.company;
  currentOrgName.dataset.orgBranch=window.__CURRENT_ORGANIZATION__.branch;

  document.querySelectorAll(".org-option").forEach(x=>x.classList.remove("active"));
  e.currentTarget.classList.add("active");

  document.querySelector(".org-switch").classList.remove("open");

  showToast(`已切换组织：${name}`);
  document.dispatchEvent(new CustomEvent("organizationchange",{detail:window.__CURRENT_ORGANIZATION__}));
}

function openVersionHistory(e){
  e.stopPropagation();

  document.querySelector(".user-menu")?.classList.remove("open");

  const latest=versionHistory[versionHistory.length-1];

  openModal("历史版本记录",`
    <div class="version-summary">
      <div>
        当前系统版本：
        <strong>${latest.versionNo}</strong>
        <span style="color:var(--muted);margin-left:6px">${latest.versionName}</span>
      </div>
      <div style="color:var(--muted);font-size:13px">共 ${versionHistory.length} 个版本</div>
    </div>

    <div class="version-table-wrap">
      <table class="version-table">
        <thead>
          <tr>
            <th>版本号</th>
            <th>版本名称</th>
            <th>生成时间</th>
            <th>版本描述</th>
          </tr>
        </thead>
        <tbody>
          ${versionHistory.slice().reverse().map(v=>`
            <tr>
              <td><span class="version-no">${v.versionNo}</span></td>
              <td><span class="version-name">${v.versionName}</span></td>
              <td>${v.generateTime}</td>
              <td><div class="version-desc">${v.versionDesc}</div></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `);
}

document.addEventListener("click",()=>{
  document.querySelector(".org-switch")?.classList.remove("open");
  document.querySelector(".user-menu")?.classList.remove("open");
});

modalMask.addEventListener("click",e=>{
  if(e.target.id==="modalMask"){
    closeModal();
  }
});


