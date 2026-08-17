const { createApp, computed, ref } = Vue;
const { ElMessage } = ElementPlus;

/**
 * 当前版本
 */
const CURRENT_VERSION = {
  version: 'V2.8.0',
  title: '项目清单交互重构版'
};

/**
 * 顶部组件
 */
const AppHeader = {
  props: {
    title: {
      type: String,
      required: true
    },
    showBack: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back'],
  template: `
    <header class="app-header">
      <div class="status-line">
        <div>9:41</div>
        <div class="status-icons">
          <div class="signal">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="battery">
            <div class="battery-inner"></div>
          </div>
        </div>
      </div>

      <div class="title-row">
        <button
          v-if="showBack"
          class="back-btn"
          @click="$emit('back')"
        >
          ‹
        </button>
        <div v-else class="header-placeholder"></div>

        <div class="header-title">{{ title }}</div>

        <div class="header-placeholder"></div>
      </div>
    </header>
  `
};

/**
 * 底部导航组件
 */
const BottomNav = {
  props: {
    active: {
      type: String,
      default: 'home'
    }
  },
  emits: ['change'],
  template: `
    <nav class="bottom-nav">
      <button
        class="nav-item"
        :class="{ active: active === 'dashboard' }"
        @click="$emit('change', 'dashboard')"
      >
        <div class="nav-scene-icon dashboard-icon">
          <span></span><span></span><span></span>
        </div>
        <div>看板</div>
      </button>

      <button
        class="nav-item"
        :class="{ active: active === 'home' }"
        @click="$emit('change', 'home')"
      >
        <div class="nav-scene-icon workbench-icon">
          <i></i><i></i><i></i><i></i>
        </div>
        <div>工作台</div>
      </button>

      <button
        class="nav-item"
        :class="{ active: active === 'project' }"
        @click="$emit('change', 'project')"
      >
        <div class="nav-scene-icon project-nav-icon">
          <span></span><i></i>
        </div>
        <div>项目</div>
      </button>

      <button
        class="nav-item"
        :class="{ active: active === 'mine' }"
        @click="$emit('change', 'mine')"
      >
        <div class="nav-scene-icon mine-icon">
          <span></span>
        </div>
        <div>我的</div>
      </button>
    </nav>
  `
};

/**
 * 证明材料组件
 */
const MaterialBox = {
  props: {
    title: String,
    desc: String
  },
  template: `
    <div class="material-box">
      <div class="pdf-icon">
        <div class="pdf-corner"></div>
        <div class="pdf-text">PDF</div>
      </div>
      <div class="material-main">
        <div class="material-name">{{ title }}</div>
        <div class="material-desc">{{ desc }}</div>
      </div>
    </div>
  `
};


/**
 * 信息卡组件
 */
const InfoCard = {
  props: {
    title: String,
    items: {
      type: Array,
      default: () => []
    }
  },
  template: `
    <section class="card">
      <div class="card-header">
        <div class="section-title">{{ title }}</div>
      </div>

      <div class="info-list">
        <div
          v-for="item in items"
          :key="item.label"
          class="info-row"
        >
          <div class="info-label">{{ item.label }}</div>

          <div class="info-value">
            <template v-if="item.type === 'image'">
              <div class="permit-preview-wrap">
                <el-image
                  class="permit-thumb"
                  :src="item.value"
                  :preview-src-list="[item.value]"
                  fit="cover"
                  preview-teleported
                >
                  <template #error>
                    <div class="permit-thumb error">
                      施工许可证
                    </div>
                  </template>
                </el-image>
                <div class="permit-tip">点击缩略图放大查看</div>
              </div>
            </template>

            <template v-else>
              <div class="info-main-value">{{ item.value }}</div>
              <div v-if="item.creditCode" class="info-credit-code">{{ item.creditCode }}</div>
            </template>
          </div>
        </div>
      </div>
    </section>
  `
};


createApp({
  components: {
    AppHeader,
    BottomNav,
    MaterialBox,
    InfoCard
  },

  setup() {
    /**
     * 页面状态
     * home：工作台
     * approval：流程审批
     * mine：我的
     * version：版本记录
     */
    const currentPage = ref('home');

const dashboardFactors = ref([
  { name: '视频监控点位', value: 64 },
  { name: '塔机', value: 64 },
  { name: '扬尘监测设备', value: 64 },
  { name: '安全穿戴设备', value: 64 },
  { name: '关键岗位人员', value: 64 },
  { name: '基坑临边设备', value: 0 }
]);

const evaluationTabs = ref([
  { key: 'total', name: '总分' },
  { key: 'operation', name: '运维管理' },
  { key: 'smallLoop', name: '小闭环管理' },
  { key: 'middleLoop', name: '中闭环处置' }
]);
const evaluationTab = ref('total');

const dashboardBarSets = {
  total: [
    { name: '到岗\n履职', low: 58, high: 82 },
    { name: '基坑\n监测', low: 73, high: 39 },
    { name: '扬尘\n设备运维', low: 58, high: 73 },
    { name: '安全\n穿戴', low: 58, high: 70 },
    { name: '塔机\n监测', low: 58, high: 66 },
    { name: '基坑\n临边', low: 58, high: 86 }
  ],
  operation: [
    { name: '到岗\n履职', low: 62, high: 86 },
    { name: '基坑\n监测', low: 68, high: 78 },
    { name: '扬尘\n设备运维', low: 56, high: 75 },
    { name: '安全\n穿戴', low: 61, high: 81 },
    { name: '塔机\n监测', low: 64, high: 83 },
    { name: '基坑\n临边', low: 55, high: 72 }
  ],
  smallLoop: [
    { name: '到岗\n履职', low: 52, high: 74 },
    { name: '基坑\n监测', low: 60, high: 79 },
    { name: '扬尘\n设备运维', low: 66, high: 84 },
    { name: '安全\n穿戴', low: 57, high: 73 },
    { name: '塔机\n监测', low: 62, high: 80 },
    { name: '基坑\n临边', low: 59, high: 77 }
  ],
  middleLoop: [
    { name: '到岗\n履职', low: 64, high: 88 },
    { name: '基坑\n监测', low: 55, high: 76 },
    { name: '扬尘\n设备运维', low: 60, high: 79 },
    { name: '安全\n穿戴', low: 63, high: 85 },
    { name: '塔机\n监测', low: 58, high: 82 },
    { name: '基坑\n临边', low: 61, high: 84 }
  ]
};
const currentDashboardBars = computed(() => dashboardBarSets[evaluationTab.value] || dashboardBarSets.total);
const dashboardBars = ref(dashboardBarSets.total);

const warningTabs = ref([
  { key: 'day', name: '当日' },
  { key: 'week', name: '近一周' },
  { key: 'month', name: '当月' },
  { key: 'year', name: '当年' }
]);
const warningTab = ref('day');
const warningBoxSets = {
  day: [
    { title: '中闭环', metrics: [{ label: '全部', value: 170 }, { label: '已闭环', value: 150, className: 'green-text' }, { label: '待复核', value: 10, className: 'red-text' }, { label: '待处置', value: 10, className: 'red-text' }] },
    { title: '中闭环预警', metrics: [{ label: '全部', value: 170 }, { label: '已发起', value: 160, className: 'green-text' }] },
    { title: '小闭环', metrics: [{ label: '全部', value: 170 }, { label: '已闭环', value: 160, className: 'green-text' }, { label: '待处置', value: 10, className: 'red-text' }] },
    { title: '小闭环预警', metrics: [{ label: '全部', value: 170 }, { label: '有效', value: 160, className: 'green-text' }, { label: '无效', value: 10, className: 'red-text' }] }
  ],
  week: [
    { title: '中闭环', metrics: [{ label: '全部', value: 860 }, { label: '已闭环', value: 790, className: 'green-text' }, { label: '待复核', value: 38, className: 'red-text' }, { label: '待处置', value: 32, className: 'red-text' }] },
    { title: '中闭环预警', metrics: [{ label: '全部', value: 820 }, { label: '已发起', value: 775, className: 'green-text' }] },
    { title: '小闭环', metrics: [{ label: '全部', value: 920 }, { label: '已闭环', value: 870, className: 'green-text' }, { label: '待处置', value: 50, className: 'red-text' }] },
    { title: '小闭环预警', metrics: [{ label: '全部', value: 900 }, { label: '有效', value: 848, className: 'green-text' }, { label: '无效', value: 52, className: 'red-text' }] }
  ],
  month: [
    { title: '中闭环', metrics: [{ label: '全部', value: 3180 }, { label: '已闭环', value: 2960, className: 'green-text' }, { label: '待复核', value: 120, className: 'red-text' }, { label: '待处置', value: 100, className: 'red-text' }] },
    { title: '中闭环预警', metrics: [{ label: '全部', value: 3050 }, { label: '已发起', value: 2910, className: 'green-text' }] },
    { title: '小闭环', metrics: [{ label: '全部', value: 3420 }, { label: '已闭环', value: 3250, className: 'green-text' }, { label: '待处置', value: 170, className: 'red-text' }] },
    { title: '小闭环预警', metrics: [{ label: '全部', value: 3360 }, { label: '有效', value: 3190, className: 'green-text' }, { label: '无效', value: 170, className: 'red-text' }] }
  ],
  year: [
    { title: '中闭环', metrics: [{ label: '全部', value: 28600 }, { label: '已闭环', value: 26780, className: 'green-text' }, { label: '待复核', value: 960, className: 'red-text' }, { label: '待处置', value: 860, className: 'red-text' }] },
    { title: '中闭环预警', metrics: [{ label: '全部', value: 27100 }, { label: '已发起', value: 25980, className: 'green-text' }] },
    { title: '小闭环', metrics: [{ label: '全部', value: 30420 }, { label: '已闭环', value: 28940, className: 'green-text' }, { label: '待处置', value: 1480, className: 'red-text' }] },
    { title: '小闭环预警', metrics: [{ label: '全部', value: 29870 }, { label: '有效', value: 28420, className: 'green-text' }, { label: '无效', value: 1450, className: 'red-text' }] }
  ]
};
const currentWarningBoxes = computed(() => warningBoxSets[warningTab.value] || warningBoxSets.day);



const middleLoopSearch = ref({ scene: [], overdue: [], keyword: '' });
const middleLoopScenes = ref(['安全穿戴', '基坑临边', '塔机监测', '到岗履职', '扬尘监测', '基坑监测']);
const middleLoopSelectedSummary = ref({ type: 'all', label: '全部' });
const middleLoopSceneFilter = ref([]);
const middleLoopOverdueFilter = ref([]);
const middleLoopProjectFilter = ref('');
const middleLoopFilterPanel = ref('');
const middleLoopFilterVisible = ref({ scene: false, overdue: false });
function middleLoopStatusMatches(item, label) {
  if (label === '全部') return true;
  if (label === '待发起') return item.status === 'pending';
  if (label === '处置中') return item.status === 'processing';
  if (label === '复核中') return item.status === 'review';
  if (label === '已闭环') return item.status === 'done' || item.status === 'initiated';
  return true;
}
const middleLoopSummary = computed(() => {
  const list = middleLoopList.value;
  const count = label => list.filter(item => middleLoopStatusMatches(item, label)).length;
  return [{
    title: '中闭环处置',
    type: 'all',
    metrics: [
      { label: '全部', value: list.length },
      { label: '待发起', value: count('待发起'), color: 'red' },
      { label: '处置中', value: count('处置中'), color: 'orange' },
      { label: '复核中', value: count('复核中'), color: 'gold' },
      { label: '已闭环', value: count('已闭环'), color: 'green' }
    ]
  }];
});
function selectMiddleLoopSummary(card, metric) {
  middleLoopSelectedSummary.value = { type: card.type, label: metric.label };
}
function toggleMiddleLoopFilterPanel(key) {
  middleLoopFilterPanel.value = middleLoopFilterPanel.value === key ? '' : key;
}
function toggleMiddleLoopFilterOption(key, value) {
  const target = key === 'scene' ? middleLoopSceneFilter.value : middleLoopOverdueFilter.value;
  const idx = target.indexOf(value);
  if (idx >= 0) target.splice(idx, 1);
  else target.push(value);
}
function resetMiddleLoopFilter(key) {
  if (key === 'scene') middleLoopSceneFilter.value = [];
  if (key === 'overdue') middleLoopOverdueFilter.value = [];
}
function confirmMiddleLoopFilter(key) {
  middleLoopFilterVisible.value[key] = false;
}
function middleLoopFilterText(key) {
  const target = key === 'scene' ? middleLoopSceneFilter.value : middleLoopOverdueFilter.value;
  const base = key === 'scene' ? '选择场景' : '是否超期';
  return target.length ? `${base}（${target.length}）` : base;
}
function middleLoopOptionCount(key, value) {
  return middleLoopList.value.filter(item => {
    if (key !== 'scene' && middleLoopSceneFilter.value.length && !middleLoopSceneFilter.value.includes(item.scene)) return false;
    if (key !== 'overdue' && middleLoopOverdueFilter.value.length && !middleLoopOverdueFilter.value.includes(item.overdue)) return false;
    return key === 'scene' ? item.scene === value : item.overdue === value;
  }).length;
}
const middleLoopList = ref([
  {
    id: 1,
    type: 'loop',
    scene: '安全穿戴',
    overdue: '否',
    title: '安全穿戴小闭环',
    status: 'done',
    statusText: '已闭环',
    desc: '闵行区华漕镇MHPO-1404单元40-02地块 住宅项目2026年4月12日15时22分11秒在施工区域，发现人员未穿戴安全帽并且持续1分钟以上。',
    projectLabel: '工地名称',
    project: '金海路（杨高中路-华东路东侧）改建工程',
    occurTimeLabel: '发生时间',
    occurTime: '2025-10-26 08:56',
    handleTime: '2025-10-26 08:56',
    handleContent: '已批评教育，劳务人员表示下次必戴安全帽。'
  },
  {
    id: 2,
    type: 'loop',
    scene: '塔机监测',
    overdue: '否',
    title: '塔机运行小闭环',
    status: 'processing',
    statusText: '处置中',
    desc: '塔机运行载重超限',
    projectLabel: '所属项目',
    project: '金海路（杨高中路-华东路东侧）改建工程',
    occurTimeLabel: '发起时间',
    occurTime: '2025-10-26 08:56',
    handleTime: '--',
    handleContent: '--',
    remainText: '🔥 剩余处置时间 3时34分'
  },
  {
    id: 3,
    type: 'loop',
    scene: '塔机监测',
    overdue: '是',
    title: '塔机运行小闭环',
    status: 'processing',
    statusText: '处置中',
    desc: '塔机运行载重超限',
    projectLabel: '所属项目',
    project: '金海路（杨高中路-华东路东侧）改建工程',
    occurTimeLabel: '发起时间',
    occurTime: '2025-10-26 08:56',
    handleTime: '--',
    handleContent: '--',
    remainText: '🔥 已超时23时42分'
  }
  ,
  {
    id: 4,
    type: 'warning',
    scene: '扬尘监测',
    overdue: '否',
    title: '扬尘监测中闭环预警',
    status: 'initiated',
    statusText: '已发起',
    desc: '连续监测发现PM10浓度偏高，已自动发起中闭环预警并推送责任单位核查。',
    projectLabel: '所属项目',
    project: '浦东新区张江科学城配套工程',
    occurTimeLabel: '发起时间',
    occurTime: '2025-10-26 09:12',
    handleTime: '2025-10-26 09:18',
    handleContent: '已发起中闭环任务，等待责任单位反馈。'
  },
  {
    id: 5,
    type: 'warning',
    scene: '基坑临边',
    overdue: '是',
    title: '基坑临边中闭环预警',
    status: 'pending',
    statusText: '待发起',
    desc: '基坑临边防护识别异常，系统建议发起中闭环预警。',
    projectLabel: '所属项目',
    project: '徐汇滨江综合改造项目',
    occurTimeLabel: '预警时间',
    occurTime: '2025-10-26 10:03',
    handleTime: '--',
    handleContent: '--',
    remainText: '🔥 已超时1时12分'
  },
  {
    id: 6,
    type: 'loop',
    scene: '到岗履职',
    overdue: '否',
    title: '到岗履职中闭环',
    status: 'review',
    statusText: '复核中',
    desc: '项目关键岗位人员到岗履职记录异常，责任单位已提交整改材料，等待监管复核。',
    projectLabel: '所属项目',
    project: '虹桥商务区保障房工程',
    occurTimeLabel: '发生时间',
    occurTime: '2025-10-26 11:20',
    handleTime: '--',
    handleContent: '责任单位已提交说明，待监管复核。'
  }

]);
const middleLoopFilteredList = computed(() => {
  const sel = middleLoopSelectedSummary.value;
  const keyword = middleLoopProjectFilter.value.trim();
  return middleLoopList.value.filter(item => {
    if (!middleLoopStatusMatches(item, sel.label)) return false;
    if (middleLoopSceneFilter.value.length && !middleLoopSceneFilter.value.includes(item.scene)) return false;
    if (middleLoopOverdueFilter.value.length && !middleLoopOverdueFilter.value.includes(item.overdue)) return false;
    if (keyword && !item.project.includes(keyword)) return false;
    return true;
  });
});
function goMiddleLoopManage() {
  currentPage.value = 'middleLoopManage';
  scrollTop();
}
function openMiddleLoopDetail(item) {
  showToast('查看详情：' + item.title);
}
function startMiddleLoopDisposal(item) {
  showToast('发起处置：' + item.title);
}
function handleMiddleLoop(item) {
  showToast('处理：' + item.title);
}

const consultTab = ref('guide');
const consultSearch = ref('');

const consultFiles = ref([
  {
    id: 1,
    tab: 'guide',
    name: '闭环管理操作指南.pdf',
    updateTime: '2026-01-23 16:45:11'
  },
  {
    id: 2,
    tab: 'guide',
    name: '场景免接入流程操作指南.pdf',
    updateTime: '2026-01-23 16:45:11'
  },
  {
    id: 3,
    tab: 'guide',
    name: '项目认领应用指南.pdf',
    updateTime: '2026-01-23 16:45:11'
  },
  {
    id: 4,
    tab: 'manual',
    name: '智慧工地监管平台操作手册.pdf',
    updateTime: '2026-01-23 16:45:11'
  },
  {
    id: 5,
    tab: 'manual',
    name: '审批流程操作手册.pdf',
    updateTime: '2026-01-23 16:45:11'
  }
]);

const filteredConsultFiles = computed(() => {
  return consultFiles.value.filter(file => {
    const tabMatched = file.tab === consultTab.value;
    const keywordMatched =
      !consultSearch.value || file.name.includes(consultSearch.value);

    return tabMatched && keywordMatched;
  });
});

const serviceInfo = ref({
  phone: '18266669999',
  serviceDate: '周一至周五（法定节假日除外）',
  workTime: '上午 9:00-11:00  下午 13:30-17:30'
});

function goConsultCenter() {
  currentPage.value = 'consult';
  consultTab.value = 'guide';
  consultSearch.value = '';
  scrollTop();
}

function callService() {
  window.location.href = 'tel:' + serviceInfo.value.phone;
}

/**
 * 角色&场景认领
 */
const roleClaimOptions = ref([
  { key: 'leader', name: '场景闭环监管负责人', desc: '负责全部场景闭环监管统筹，自动认领所有场景' },
  { key: 'member', name: '场景闭环监管组员', desc: '按需认领指定场景，支持多选' }
]);

const sceneClaimOptions = ref([
  '到岗履职',
  '基坑监测',
  '扬尘设备运维',
  '安全穿戴',
  '塔机运行监测',
  '基坑临边防护'
]);

const roleSceneClaimForm = ref({
  role: 'member',
  scenes: ['到岗履职', '安全穿戴']
});

const sceneClaimAllSelected = computed(() => roleSceneClaimForm.value.scenes.length === sceneClaimOptions.value.length);

function goRoleSceneClaim() {
  currentPage.value = 'roleSceneClaim';
  scrollTop();
}

function selectClaimRole(roleKey) {
  roleSceneClaimForm.value.role = roleKey;
  if (roleKey === 'leader') {
    roleSceneClaimForm.value.scenes = [...sceneClaimOptions.value];
  }
}

function isSceneClaimChecked(scene) {
  return roleSceneClaimForm.value.scenes.includes(scene);
}

function toggleSceneClaim(scene) {
  if (roleSceneClaimForm.value.role === 'leader') {
    showToast('场景闭环监管负责人默认认领全部场景');
    return;
  }

  const scenes = roleSceneClaimForm.value.scenes;
  if (scenes.includes(scene)) {
    roleSceneClaimForm.value.scenes = scenes.filter(item => item !== scene);
  } else {
    roleSceneClaimForm.value.scenes = [...scenes, scene];
  }
}

function confirmRoleSceneClaim() {
  if (!roleSceneClaimForm.value.role) {
    showToast('请选择认领角色');
    return;
  }
  if (!roleSceneClaimForm.value.scenes.length) {
    showToast('请至少选择一个认领场景');
    return;
  }
  const role = roleClaimOptions.value.find(item => item.key === roleSceneClaimForm.value.role)?.name || '';
  showToast(role + '认领成功');
  goMine();
}

function resetRoleSceneClaim() {
  if (roleSceneClaimForm.value.role === 'leader') {
    roleSceneClaimForm.value.scenes = [...sceneClaimOptions.value];
  }
}

/**
 * 意见反馈
 */
const feedbackTypes = ref(['投诉用户', '功能异常', '体验问题', '其他']);

const feedbackForm = ref({
  type: '',
  desc: '',
  photos: [],
  contact: '18266669999'
});

const feedbackRecords = ref([
  {
    id: 1,
    type: '体验优化',
    desc: '建议项目详情页增加常用操作入口，便于现场监管人员快速处理。',
    contact: '18266669999',
    photos: [],
    createTime: '2026-06-08 15:20',
    status: '已提交'
  }
]);

function resetFeedbackForm() {
  feedbackForm.value = {
    type: '',
    desc: '',
    photos: [],
    contact: '18266669999'
  };
}

function goFeedback() {
  resetFeedbackForm();
  currentPage.value = 'feedback';
  scrollTop();
}

function goFeedbackHistory() {
  currentPage.value = 'feedbackHistory';
  scrollTop();
}

function cancelFeedback() {
  goMine();
}

function handleFeedbackPhotoChange(event) {
  const files = Array.from(event.target.files || []);
  const remain = 4 - feedbackForm.value.photos.length;

  if (remain <= 0) {
    showToast('最多上传4张照片');
    event.target.value = '';
    return;
  }

  files.slice(0, remain).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      feedbackForm.value.photos.push({
        name: file.name,
        url: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });

  if (files.length > remain) {
    showToast('最多上传4张照片');
  }

  event.target.value = '';
}

function removeFeedbackPhoto(index) {
  feedbackForm.value.photos.splice(index, 1);
}

function submitFeedback() {
  if (!feedbackForm.value.type) {
    showToast('请选择反馈类型');
    return;
  }

  if (!feedbackForm.value.desc.trim()) {
    showToast('请输入反馈描述');
    return;
  }

  if (feedbackForm.value.desc.length > 500) {
    showToast('反馈描述最多500字');
    return;
  }

  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  const createTime =
    now.getFullYear() + '-' +
    pad(now.getMonth() + 1) + '-' +
    pad(now.getDate()) + ' ' +
    pad(now.getHours()) + ':' +
    pad(now.getMinutes());

  feedbackRecords.value.unshift({
    id: Date.now(),
    type: feedbackForm.value.type,
    desc: feedbackForm.value.desc,
    contact: feedbackForm.value.contact,
    photos: feedbackForm.value.photos.map(item => ({ ...item })),
    createTime,
    status: '已提交'
  });

  showToast('意见反馈提交成功');
  resetFeedbackForm();
  goFeedbackHistory();
}


    /**
     * 部门组织
     */
    const orgDrawerVisible = ref(false);
    const currentOrg = ref('市安质监总站 / 工程科');

    const orgList = ref([
      '市安质监总站 / 工程科',
      '市安质监总站',
      '浦东新区建管委监督站',
      '黄浦区建设工程安全质量监督站',
      '闵行区建设工程安全质量监督站'
    ]);


    const selectedNotice = ref(null);
    const noticeCategories = ref(['全部', '政府公告', '党建专栏', '政策通知']);
    const activeNoticeCategory = ref('全部');
    const noticeList = ref([
      {
        id: 1,
        category: '政府公告',
        read: false,
        title: '关于进一步加强房建工程施工现场安全管理工作的通知',
        dept: '市安质监总站',
        time: '2026-06-15 09:30',
        top: true,
        content: '为进一步加强本市房建工程施工现场安全管理，提升智慧工地监管水平，请各区监督机构和项目参建单位做好重点场景巡查与闭环处置。',
        summary: '围绕安全穿戴、基坑临边、塔机监测、到岗履职、扬尘监测、基坑监测等重点场景，进一步压实参建单位主体责任，强化现场监管与问题闭环。',
        richHtml: `
          <h3>一、总体要求</h3>
          <p>各建设、施工、监理单位应严格落实质量安全主体责任，持续完善智慧工地应用接入、现场巡查、预警处置和闭环复核机制。</p>
          <p>各区监督机构应结合项目实际，重点关注深基坑、塔机、临边防护、扬尘设备、视频监控等高频风险场景，提升监管精准性和处置效率。</p>
          <figure>
            <div class="notice-rich-image">智慧工地现场监管示意图</div>
            <figcaption>图示：项目现场重点监管场景联动</figcaption>
          </figure>
          <h3>二、重点工作</h3>
          <ol>
            <li>加强项目关键岗位人员到岗履职核验，确保项目经理、总监等人员履职到位。</li>
            <li>加强安全穿戴、基坑临边、塔机监测等重点场景数据接入和预警闭环。</li>
            <li>对未按要求完成整改的问题，应及时发起闭环处置并跟踪复核结果。</li>
          </ol>
          <blockquote>请各单位于本月底前完成自查，并通过平台提交相关整改和接入情况。</blockquote>
        `,
        attachments: [
          { name: '关于加强施工现场安全管理工作的通知.pdf', size: '1.8MB', type: 'PDF' },
          { name: '智慧工地重点场景检查清单.xlsx', size: '684KB', type: 'XLSX' }
        ]
      },
      {
        id: 2,
        category: '政府公告',
        read: false,
        title: '关于开展智慧工地视频监控在线率专项检查的公告',
        dept: '工程科',
        time: '2026-06-10 15:20',
        top: false,
        content: '本周将重点抽查视频中心设备在线率、历史回放完整性和重点点位覆盖情况。',
        summary: '专项检查聚焦视频点位在线率、历史回放、重点区域覆盖和异常设备整改情况。',
        richHtml: `
          <h3>一、检查范围</h3>
          <p>本次专项检查覆盖已接入平台的视频监控项目，重点核查出入口、塔吊、基坑等点位视频在线情况。</p>
          <h3>二、检查要求</h3>
          <p>各监督人员应及时关注离线设备，督促项目参建单位完成复核和恢复。</p>
        `,
        attachments: [
          { name: '视频监控在线率专项检查表.pdf', size: '912KB', type: 'PDF' }
        ]
      },
      {
        id: 3,
        category: '政策通知',
        read: false,
        title: '关于完善场景闭环监管负责人认领信息的提醒',
        dept: '市安质监总站',
        time: '2026-06-09 11:00',
        top: false,
        content: '请场景闭环监管负责人及时维护本人负责场景，确保预警处置和闭环复核责任清晰。',
        summary: '请相关人员及时确认当前角色与负责场景，确保项目认领、预警处置、闭环复核等工作责任明确。',
        richHtml: `
          <h3>一、维护内容</h3>
          <p>请在“我的-角色与场景认领”中维护本人当前角色和负责场景。</p>
          <h3>二、工作要求</h3>
          <p>负责人应对所负责场景的预警流转、处置进度和闭环结果进行持续跟踪。</p>
        `,
        attachments: []
      },
      {
        id: 4,
        category: '党建专栏',
        read: true,
        title: '关于开展住建监管一线党建共建活动的通知',
        dept: '机关党委',
        time: '2026-06-08 14:00',
        top: false,
        content: '围绕智慧工地监管、质量安全服务和基层治理协同，组织开展党建共建交流活动。',
        summary: '通过党建共建活动，推动一线监管经验交流，提升基层治理协同能力。',
        richHtml: `
          <h3>一、活动主题</h3>
          <p>党建引领智慧监管，服务保障工程质量安全。</p>
          <h3>二、活动安排</h3>
          <p>组织项目现场观摩、监管经验交流和问题闭环案例复盘。</p>
        `,
        attachments: [
          { name: '党建共建活动安排.docx', size: '426KB', type: 'DOCX' }
        ]
      }
    ]);
    const filteredNoticeList = computed(() => {
      if (activeNoticeCategory.value === '全部') return noticeList.value;
      return noticeList.value.filter(item => item.category === activeNoticeCategory.value);
    });
    const unreadNoticeCount = computed(() => noticeList.value.filter(item => !item.read).length);

    /**
     * 应用宫格
     */
    const isEditingApps = ref(false);

    const appList = ref([
      { id: 'scan-code', name: '扫一扫', icon: '', iconSrc: 'assets/icons-png/scan-code.png', colorClass: 'icon-scan-code', badge: null },
      { id: 'notice-list', name: '公告', icon: '', iconSrc: 'assets/icons-png/notice.png', colorClass: 'icon-notice-list', badge: null },
      { id: 'middle-loop-manage', name: '中闭环处置', icon: '', iconSrc: 'assets/icons-png/middle-loop.png', colorClass: 'icon-middle-disposal', badge: null },
      { id: 'project-claim', name: '项目认领', icon: '', iconSrc: 'assets/icons-png/project-claim.png', colorClass: 'icon-project-claim', badge: null },
      { id: 'safety-wear', name: '安全穿戴', icon: '', iconSrc: 'assets/icons-png/safety-wear.png', colorClass: 'icon-safety-wear', badge: null },
      { id: 'pit-edge', name: '基坑临边防护', icon: '', iconSrc: 'assets/icons-png/pit-edge.png', colorClass: 'icon-pit-edge', badge: null },
      { id: 'project-portrait', name: '项目画像', icon: '', iconSrc: 'assets/icons-png/project-portrait.png', colorClass: 'icon-project-portrait', badge: null },
      { id: 'video-list', name: '视频中心', icon: '', iconSrc: 'assets/icons-png/video-center.png', colorClass: 'icon-video-list', badge: null },
      { id: 'crane-list', name: '塔机管理', icon: '', iconSrc: 'assets/icons-png/tower-crane.png', colorClass: 'icon-crane-list', badge: null },
      { id: 'dust-list', name: '扬尘设备管理', icon: '', iconSrc: 'assets/icons-png/dust-device.png', colorClass: 'icon-dust-list', badge: null },
      { id: 'pit-list', name: '基坑管理', icon: '', iconSrc: 'assets/icons-png/foundation-pit.png', colorClass: 'icon-pit-list', badge: null },
      { id: 'duty-report', name: '到岗履职', icon: '', iconSrc: 'assets/icons-png/attendance.png', colorClass: 'icon-duty-report', badge: null }
    ]);

    const tempSelectedApps = ref([]);

    function cloneApp(app) {
      return { ...app };
    }

    const appGroups = ref([
      {
        name: '常用服务',
        apps: [
          { id: 'scan-code', name: '扫一扫', icon: '', iconSrc: 'assets/icons-png/scan-code.png', colorClass: 'icon-scan-code', badge: null },
          { id: 'notice-list', name: '公告', icon: '', iconSrc: 'assets/icons-png/notice.png', colorClass: 'icon-notice-list', badge: null },
          { id: 'project-claim', name: '项目认领', icon: '', iconSrc: 'assets/icons-png/project-claim.png', colorClass: 'icon-project-claim', badge: null },
          { id: 'project-portrait', name: '项目画像', icon: '', iconSrc: 'assets/icons-png/project-portrait.png', colorClass: 'icon-project-portrait', badge: null }
        ]
      },
      {
        name: '业务处置',
        apps: [
          { id: 'middle-loop-manage', name: '中闭环处置', icon: '', iconSrc: 'assets/icons-png/middle-loop.png', colorClass: 'icon-middle-disposal', badge: null },
          { id: 'safety-wear', name: '安全穿戴', icon: '', iconSrc: 'assets/icons-png/safety-wear.png', colorClass: 'icon-safety-wear', badge: null },
          { id: 'pit-edge', name: '基坑临边防护', icon: '', iconSrc: 'assets/icons-png/pit-edge.png', colorClass: 'icon-pit-edge', badge: null }
        ]
      },
      {
        name: '监管要素',
        apps: [
          { id: 'video-list', name: '视频中心', icon: '', iconSrc: 'assets/icons-png/video-center.png', colorClass: 'icon-video-list', badge: null },
          { id: 'crane-list', name: '塔机管理', icon: '', iconSrc: 'assets/icons-png/tower-crane.png', colorClass: 'icon-crane-list', badge: null },
          { id: 'dust-list', name: '扬尘设备管理', icon: '', iconSrc: 'assets/icons-png/dust-device.png', colorClass: 'icon-dust-list', badge: null },
          { id: 'pit-list', name: '基坑管理', icon: '', iconSrc: 'assets/icons-png/pit-list.png', colorClass: 'icon-pit-list', badge: null }
        ]
      },
      {
        name: '业务分析报表',
        apps: [
          { id: 'duty-report', name: '到岗履职', icon: '', iconSrc: 'assets/icons-png/attendance.png', colorClass: 'icon-duty-report', badge: null },
          { id: 'crane-monitor', name: '塔机监测', icon: '', iconSrc: 'assets/icons-png/crane-monitor.png', colorClass: 'icon-crane-monitor-new', badge: null },
          { id: 'crane-install', name: '塔机安拆', icon: '', iconSrc: 'assets/icons-png/crane-install.png', colorClass: 'icon-crane-install-new', badge: null },
          { id: 'more-report', name: '更多报表', icon: '', iconSrc: 'assets/icons-png/more-report.png', colorClass: 'icon-more-report', badge: null }
        ]
      }
    ]);


    /**
     * 项目认领
     */
    const claimActiveTab = ref('pending');
    const claimSearch = ref({
      keyword:'',
      status:[],
      type:[],
      area:[],
      source:[]
    });
    const claimFilterVisible = ref({ status: false, type: false, area: false, source: false });


    const unclaimedProjects = ref([
      {
        id: 201,
        name: '长宁区虹桥临空商务区综合提升工程',
        score: 92,
        level: 'A级',
        levelClass: 'level-a',
        area: '长宁区',
        status: '在监在建',
        type: '建筑工程',
        source: '区站创建',
        contractor: '上海建工集团股份有限公司',
        supervisor: '上海建科工程咨询有限公司',
        owner: '长宁区城市建设发展有限公司'
      },
      {
        id: 202,
        name: '黄浦区外滩历史风貌区城市更新项目',
        score: 78,
        level: 'B级',
        levelClass: 'level-b',
        area: '黄浦区',
        status: '待建',
        type: '建筑工程',
        source: '建管平台推送',
        contractor: '中建八局有限公司',
        supervisor: '上海同济工程项目管理咨询有限公司',
        owner: '黄浦区城市更新投资有限公司'
      },
      {
        id: 203,
        name: '杨浦区滨江公共服务配套建设项目',
        score: 56,
        level: 'C级',
        levelClass: 'level-c',
        area: '杨浦区',
        status: '暂停监督',
        type: '建筑工程',
        source: '项目部创建',
        contractor: '上海城建市政工程集团有限公司',
        supervisor: '上海市工程建设咨询监理有限公司',
        owner: '杨浦区滨江开发建设有限公司'
      }
    ]);

    const claimedProjects = ref([
      {
        id: 301,
        name: '宝山区产业园区标准厂房建设工程',
        score: 86,
        level: 'A级',
        levelClass: 'level-a',
        area: '宝山区',
        status: '在监在建',
        type: '建筑工程',
        source: '区站创建',
        contractor: '上海建工七建集团有限公司',
        supervisor: '上海浦桥工程建设管理有限公司',
        owner: '宝山区产业园区建设发展有限公司',
        leader: '何琨',
        members: ['王磊', '周敏']
      },
      {
        id: 302,
        name: '闵行区城市更新综合体项目',
        score: 73,
        level: 'B级',
        levelClass: 'level-b',
        area: '闵行区',
        status: '施工条件限制',
        type: '建筑工程',
        source: '建管平台推送',
        contractor: '上海隧道工程有限公司',
        supervisor: '上海建通工程建设有限公司',
        owner: '闵行区城市更新建设有限公司',
        leader: '陈建',
        members: ['李娜', '张伟']
      }
    ]);

    
    const claimAreaOptions = ref(['长宁区','黄浦区','杨浦区','宝山区','闵行区','松江区']);
    const claimStatusOptions = ref(['待建','在监在建','暂停监督','节假日停工','施工条件限制','其他停工','未销项','完工','竣工']);
    const claimTypeOptions = ref(['建筑工程']);
    const claimSourceOptions = ref(['建管平台推送', '区站创建', '项目部创建']);
    const claimFilterMeta = {
      status: { label: '工地状态', title: '选择工地状态', field: 'status', optionsRef: claimStatusOptions },
      type: { label: '工程类型', title: '选择工程类型', field: 'type', optionsRef: claimTypeOptions },
      area: { label: '管理区域', title: '选择管理区域', field: 'area', optionsRef: claimAreaOptions },
      source: { label: '项目来源', title: '选择项目来源', field: 'source', optionsRef: claimSourceOptions }
    };

    function matchesClaimFilters(project, ignoredKey = '') {
      const keyword = (claimSearch.value.keyword || '').trim().toLowerCase();
      const keywordMatched = !keyword || [project.name, project.contractor, project.owner, project.supervisor, project.manager]
        .some(value => String(value || '').toLowerCase().includes(keyword));
      if (!keywordMatched) return false;
      return ['status', 'type', 'area', 'source'].every(key => {
        if (key === ignoredKey) return true;
        const selected = normalizeProjectFilterValue(claimSearch.value[key]);
        return !selected.length || selected.includes(project[claimFilterMeta[key].field]);
      });
    }

    function getClaimOptionCount(key, value) {
      return unclaimedProjects.value.filter(project => {
        if (!matchesClaimFilters(project, key)) return false;
        return project[claimFilterMeta[key].field] === value;
      }).length;
    }

    const claimFilterConfigs = computed(() => {
      return ['status', 'type', 'area', 'source'].map(key => {
        const meta = claimFilterMeta[key];
        return {
          key,
          label: meta.label,
          title: meta.title,
          options: meta.optionsRef.value.map(value => ({ value, label: value, count: getClaimOptionCount(key, value) }))
        };
      });
    });

    function clearClaimFilter(key) { claimSearch.value[key] = []; }
    function confirmClaimFilter(key) { claimFilterVisible.value[key] = false; }

    const filteredUnclaimedProjects = computed(() => {
      return unclaimedProjects.value.filter(project => matchesClaimFilters(project));
    });

    const filteredClaimedProjects = computed(() => {
      return claimedProjects.value.filter(project => matchesClaimFilters(project));
    });

const unclaimedCount = computed(() => unclaimedProjects.value.length);

    function refreshClaimBadge() {
      const target = appList.value.find(item => item.id === 'project-claim');
      if (target) {
        target.badge = unclaimedCount.value;
      }

      appGroups.value.forEach(group => {
        group.apps.forEach(item => {
          if (item.id === 'project-claim') {
            item.badge = unclaimedCount.value;
          }
        });
      });
    }

    function goClaimList() {
      refreshClaimBadge();
      claimActiveTab.value = unclaimedCount.value >= 1 ? 'pending' : 'claimed';
      currentPage.value = 'claimList';
      scrollTop();
    }

    function claimProject(project) {
      unclaimedProjects.value = unclaimedProjects.value.filter(item => item.id !== project.id);
      claimedProjects.value.unshift({
        ...project,
        leader: '何琨',
        members: ['王磊', '周敏'],
        claimTime: new Date().toLocaleString('zh-CN', { hour12: false })
      });
      claimHistoryList.value.unshift({
        id: Date.now(),
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        projects: [project.name],
        count: 1,
        operator: '何琨',
        status: '已认领'
      });
      refreshClaimBadge();
      showToast('项目认领成功');
      if (unclaimedProjects.value.length === 0) {
        claimActiveTab.value = 'claimed';
      }
    }

    const claimRoleInfo = ref({
      role: '场景闭环监管负责人',
      scenes: ['安全穿戴', '基坑临边', '塔机监测', '到岗履职', '扬尘监测', '基坑监测']
    });

    const claimSelectedProjects = ref([]);
    const claimHistoryList = ref([
      { id: 1, time: '2026-06-11 16:20:18', projects: ['宝山区产业园区标准厂房建设工程'], count: 1, operator: '何琨', status: '已认领' },
      { id: 2, time: '2026-06-10 10:45:32', projects: ['闵行区城市更新综合体项目'], count: 1, operator: '何琨', status: '已认领' }
    ]);

    const claimedTotalCount = computed(() => claimedProjects.value.length);

    const claimAvailableProjects = computed(() => {
      return filteredUnclaimedProjects.value.filter(project => !claimSelectedProjects.value.some(item => item.id === project.id));
    });

    function goClaimHome() {
      refreshClaimBadge();
      currentPage.value = 'claimHome';
      scrollTop();
    }

    function goClaimNew() {
      currentPage.value = 'claimNew';
      scrollTop();
    }

    function goClaimSearch() {
      currentPage.value = 'claimSearch';
      scrollTop();
    }

    function goClaimHistory() {
      currentPage.value = 'claimHistory';
      scrollTop();
    }

    function addClaimProject(project) {
      if (claimSelectedProjects.value.some(item => item.id === project.id)) {
        showToast('该项目已加入本次认领');
        return;
      }
      claimSelectedProjects.value.push(project);
      showToast('已加入本次认领项目');
      currentPage.value = 'claimNew';
      scrollTop();
    }

    function removeClaimProject(project) {
      claimSelectedProjects.value = claimSelectedProjects.value.filter(item => item.id !== project.id);
    }

    function cancelNewClaim() {
      claimSelectedProjects.value = [];
      goClaimHome();
    }

    function confirmNewClaim() {
      if (!claimSelectedProjects.value.length) {
        showToast('请先添加本次认领项目');
        return;
      }
      const projects = claimSelectedProjects.value.map(item => item.name);
      claimSelectedProjects.value.forEach(project => {
        unclaimedProjects.value = unclaimedProjects.value.filter(item => item.id !== project.id);
        claimedProjects.value.unshift({
          ...project,
          leader: '何琨',
          members: ['王磊', '周敏'],
          claimTime: new Date().toLocaleString('zh-CN', { hour12: false })
        });
      });
      claimHistoryList.value.unshift({
        id: Date.now(),
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        projects,
        count: projects.length,
        operator: '何琨',
        status: '已认领'
      });
      claimSelectedProjects.value = [];
      refreshClaimBadge();
      showToast('认领成功');
      goClaimHome();
    }

    /**
     * 待办任务
     */
    const activeTab = ref('todo');

    const todoList = ref([
      {
        id: 101,
        type: 'approval',
        icon: '审',
        iconColor: '#2563EB',
        title: '场景免开通申请审批',
        time: '刚刚',
        desc: '申请免开通场景为安全穿戴、塔机监测、基坑监测，请及时审批',
        project: '新建银樽路（芳春路—外环）上水管搬迁',
        status: 'pending'
      },
      {
        id: 105,
        type: 'middle-approval',
        icon: '中',
        iconColor: '#F59E0B',
        title: '政企协同中闭环待审批',
        time: '14:28',
        desc: '项目已完成安全穿戴中闭环的处置，请及时审批',
        project: 'SA241420034修路+宝山六村燃气管道改造',
        status: 'pending'
      },
      {
        id: 106,
        type: 'site-code-approval',
        icon: '审',
        iconColor: '#2563EB',
        title: '工地编号变更审批',
        time: '10:12',
        desc: '工地编号变更为GD21324141，请及时审批',
        project: '新建银樽路（芳春路—外环）上水管搬迁',
        status: 'pending'
      },
      {
        id: 107,
        type: 'manager-claim',
        icon: '认',
        iconColor: '#10B981',
        title: '项目经理认领审批',
        time: '昨天',
        desc: '项目经理张建国申请认领项目，请及时审批',
        project: '徐汇区漕河泾园区综合改造项目',
        status: 'pending'
      },
      {
        id: 108,
        type: 'scene-exempt',
        icon: '免',
        iconColor: '#8B5CF6',
        title: '场景免开通审批',
        time: '06-07',
        desc: '项目申请安全穿戴场景免开通，请及时审批',
        project: '虹桥商务区地下空间开发项目',
        status: 'pending'
      },
      {
        id: 109,
        type: 'key-role-change',
        icon: '变',
        iconColor: '#EF4444',
        title: '关键岗位人员变更审批',
        time: '06-06',
        desc: '项目总监变更申请已提交，请及时审批',
        project: '松江新城TOD综合体建设工程',
        status: 'pending'
      }
    ]);

    const pendingTodos = computed(() => {
      return todoList.value.filter(item => item.status === 'pending');
    });

    const approvalTypeOptions = ref([
  '场景免开通审核',
  '政企协同中闭环审批',
  '工地编号变更审批',
  '项目创建',
  '项目经理认领审批',
  '监理单位总监项目认领',
  '业主项目经理项目认领',
  '关键岗位人员变更审批'
]);

const todoSearch = ref({
  approvalType: '',
  siteName: '',
  initiator: ''
});

const todoPageTab = ref('pending');

const projectSearch = ref({
  keyword: '',
  source: [],
  area: [],
  status: [],
  type: [],
  unclaimedOnly: false
});

const projectMapMode = ref(false);
const projectActiveTab = ref('stats');
const projectAggregateMode = ref('card');
const collapsedProjectGroups = ref([]);
const projectFilterVisible = ref({ source: false, status: false, type: false, area: false });

const projectSourceOptions = ref(['建管平台推送', '区站创建', '项目部创建']);
const projectAreaOptions = ref(['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']);
const projectStatusOptions = ref(['待建', '在监在建', '暂停监督', '节假日停工', '施工条件限制', '其他停工', '未销项', '完工', '竣工']);
const projectTypeOptions = ref(['建筑工程']);


const stoppedProjectStatuses = ['节假日停工', '施工条件限制', '其他停工', '暂停监督'];
const nonBuildingTypes = ['园林绿化', '水利工程', '交通工程', '其他工程'];
const supervisionAreaStats = [
  '总站', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区',
  '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区',
  '临港新片区', '化工区', '保税区', '机场地区'
];

function isStoppedProject(project) {
  return stoppedProjectStatuses.includes(project.status);
}

function countProjects(predicate) {
  return projectList.value.filter(predicate).length;
}

const projectStatsOverview = computed(() => {
  const buildingProjects = projectList.value.filter(item => item.type === '建筑工程');
  const buildingTotal = buildingProjects.length;
  const buildingRunning = buildingProjects.filter(item => item.status === '在监在建').length;
  const buildingStopped = buildingProjects.filter(isStoppedProject).length;
  const pushed = buildingProjects.filter(item => item.source === '建管平台推送').length;
  const districtCreated = buildingProjects.filter(item => item.source === '区站创建').length;
  const deptCreated = buildingProjects.filter(item => item.source === '项目部创建').length;

  return {
    building: {
      total: buildingTotal,
      running: buildingRunning,
      stopped: buildingStopped,
      pushed,
      districtCreated,
      deptCreated
    },
    station: {
      total: projectList.value.length,
      running: countProjects(item => item.status === '在监在建'),
      stopped: countProjects(isStoppedProject)
    }
  };
});

const projectAreaStatCards = computed(() => {
  return supervisionAreaStats.filter(area => area !== '总站').map((area, index) => {
    const list = projectList.value.filter(item => item.area === area || item.supervisionDept?.includes(area.replace('区', '')));
    const total = list.length;
    const running = list.filter(item => item.status === '在监在建').length;
    const stopped = list.filter(isStoppedProject).length;
    const fallbackTotal = total || ((index % 4) + 1);
    return {
      area,
      total: fallbackTotal,
      running: total ? running : Math.max(0, fallbackTotal - 1),
      stopped: total ? stopped : (fallbackTotal > 2 ? 1 : 0),
      isSimulated: total === 0
    };
  });
});

function resetProjectListFilters() {
  projectSearch.value.keyword = '';
  projectSearch.value.source = [];
  projectSearch.value.area = [];
  projectSearch.value.status = [];
  projectSearch.value.type = [];
  projectSearch.value.unclaimedOnly = false;
}

function openProjectStatList(payload = {}) {
  resetProjectListFilters();
  if (payload.area) projectSearch.value.area = [payload.area];
  if (payload.type) projectSearch.value.type = [payload.type];
  if (payload.status === 'running') projectSearch.value.status = ['在监在建'];
  if (payload.status === 'stopped') projectSearch.value.status = stoppedProjectStatuses.slice();
  if (payload.statusValue) projectSearch.value.status = [payload.statusValue];
  if (payload.source) projectSearch.value.source = [payload.source];
  projectActiveTab.value = 'list';
  projectMapMode.value = false;
  projectAggregateMode.value = 'card';
  currentPage.value = 'projectList';
  scrollTop();
}

function showStopProjectTip() {
  showToast('停工包含：节假日停工、施工条件限制、其他停工');
}

const projectFilterMeta = {
  source: { label: '项目来源', title: '选择项目来源', field: 'source', optionsRef: projectSourceOptions },
  status: { label: '项目状态', title: '选择项目状态', field: 'status', optionsRef: projectStatusOptions },
  type: { label: '工程类型', title: '选择工程类型', field: 'type', optionsRef: projectTypeOptions },
  area: { label: '管理区域', title: '选择管理区域', field: 'area', optionsRef: projectAreaOptions }
};

function getProjectLevel(score) {
  if (score >= 81) return 'A级';
  if (score >= 61) return 'B级';
  return 'C级';
}

function getProjectLevelClass(score) {
  if (score >= 81) return 'level-a';
  if (score >= 61) return 'level-b';
  return 'level-c';
}

function getProjectTagClass(type, value) {
  const text = String(value || '');
  if (type === 'area') return 'project-tag-area';
  if (type === 'status') {
    if (text === '在监在建') return 'project-tag-status-running';
    if (['暂停监督', '节假日停工', '施工条件限制', '其他停工', '未销项'].includes(text)) return 'project-tag-status-stopped';
    if (['完工', '竣工'].includes(text)) return 'project-tag-status-complete';
    if (text === '待建') return 'project-tag-status-pending';
    return 'project-tag-status-other';
  }
  if (type === 'type') {
    if (text.includes('建筑') || text.includes('房建')) return 'project-tag-type-building';
    if (text.includes('园林')) return 'project-tag-type-garden';
    if (text.includes('交通')) return 'project-tag-type-traffic';
    if (text.includes('水利')) return 'project-tag-type-water';
    return 'project-tag-type-other';
  }
  if (type === 'source') {
    if (text.includes('建管')) return 'project-tag-source-platform';
    if (text.includes('区站')) return 'project-tag-source-district';
    if (text.includes('项目部')) return 'project-tag-source-project';
    return 'project-tag-source-other';
  }
  return '';
}

function getProjectSource(id) {
  if (id % 3 === 1) return '建管平台推送';
  if (id % 3 === 2) return '区站创建';
  return '项目部创建';
}

const projectList = ref([
  { id: 1, claimed: false, name: '金海路（杨高中路-华东路东侧）改建工程2标', score: 85, detailScore: '85.0', area: '黄浦区', status: '在监在建', type: '建筑工程', contractor: '上海建工集团股份有限公司', owner: '黄浦区建设和管理委员会', supervisor: '上海建科工程咨询有限公司', manager: '王伟', startDate: '2025-06-01', endDate: '2028-05-20', reportNo: 'BJ20240618001', siteNo: 'P_202409050001', address: '黄浦区金海路沿线', geoArea: '外环以内', supervisionDept: '黄浦区质安监站', supervisionType: '区管项目', riskLevel: '中风险', permitNo: '沪建施许字（2026）第0101号', contractAmount: '32213.11', contractDays: '1085', buildArea: '330.1㎡', issueOrg: '上海市住房和城乡建设管理委员会', issueDate: '2026-01-23', contractorCode: '91310000132285298E', ownerCode: '91310101703450568L', supervisorCode: '91310106132220104T' },
  { id: 2, claimed: true, name: '金海路（杨高中路-华东路东侧）改建工程2标', score: 85, detailScore: '85.0', area: '杨浦区', status: '在监在建', type: '建筑工程', contractor: '中建八局有限公司', owner: '杨浦区城市建设投资有限公司', supervisor: '上海同济工程项目管理咨询有限公司', manager: '李明', startDate: '2025-05-16', endDate: '2027-12-31', reportNo: 'BJ20240516002', siteNo: 'P_202405160002', address: '杨浦区杨高中路与华东路交叉口', geoArea: '外环以内', supervisionDept: '杨浦区质安监站', supervisionType: '区管项目', riskLevel: '中风险', permitNo: '沪建施许字（2026）第0202号', contractAmount: '28600.00', contractDays: '960', buildArea: '12800㎡', issueOrg: '杨浦区建设和管理委员会', issueDate: '2026-02-18', contractorCode: '91310000132285298E', ownerCode: '91310110579123456X', supervisorCode: '913101106072233445' },
  { id: 3, claimed: true, name: '金海路（杨高中路-华东路东侧）改建工程2标', score: 90, detailScore: '90.0', area: '长宁区', status: '完工', type: '建筑工程', contractor: '上海城建市政工程集团有限公司', owner: '长宁区建设管理委员会', supervisor: '上海市工程建设咨询监理有限公司', manager: '张强', startDate: '2024-09-01', endDate: '2026-12-30', reportNo: 'BJ20240901003', siteNo: 'P_202409010003', address: '长宁区临空经济园区', geoArea: '外环以内', supervisionDept: '长宁区质安监站', supervisionType: '区管项目', riskLevel: '低风险', permitNo: '沪建施许字（2026）第0303号', contractAmount: '19880.50', contractDays: '850', buildArea: '9200㎡', issueOrg: '长宁区建设和管理委员会', issueDate: '2026-03-02', contractorCode: '91310000132211111E', ownerCode: '91310105759567890B', supervisorCode: '91310104425098765D' },
  { id: 4, claimed: false, name: '两湖隧道（东湖段）主体及附属配套工程施工总承包', score: 75, detailScore: '75.0', area: '宝山区', status: '暂停监督', type: '建筑工程', contractor: '中国建筑第二工程局有限公司', owner: '宝山区建设投资有限公司', supervisor: '上海华城工程建设管理有限公司', manager: '陈华', startDate: '2025-03-10', endDate: '2028-10-30', reportNo: 'BJ20250310004', siteNo: 'P_202503100004', address: '宝山区东湖段施工区域', geoArea: '外环以外', supervisionDept: '宝山区质安监站', supervisionType: '重点监督', riskLevel: '高风险', permitNo: '沪建施许字（2026）第0404号', contractAmount: '55000.00', contractDays: '1320', buildArea: '26000㎡', issueOrg: '宝山区建设和管理委员会', issueDate: '2026-04-11', contractorCode: '91110000100024296D', ownerCode: '91310113759512345P', supervisorCode: '91310106132234567K' },
  { id: 5, claimed: true, name: '虹桥商务区核心区综合改造工程', score: 82, detailScore: '82.0', area: '闵行区', status: '节假日停工', type: '建筑工程', contractor: '上海隧道工程有限公司', owner: '闵行区城投集团', supervisor: '上海建通工程建设有限公司', manager: '赵敏', startDate: '2025-01-15', endDate: '2027-06-30', reportNo: 'BJ20250115005', siteNo: 'P_202501150005', address: '闵行区虹桥商务区核心区', geoArea: '外环以内', supervisionDept: '闵行区质安监站', supervisionType: '区管项目', riskLevel: '中风险', permitNo: '沪建施许字（2026）第0505号', contractAmount: '41500.00', contractDays: '896', buildArea: '18100㎡', issueOrg: '闵行区建设和管理委员会', issueDate: '2026-05-06', contractorCode: '91310000132277777Q', ownerCode: '91310112703488888M', supervisorCode: '91310106703499999N' },
  { id: 6, claimed: false, name: '松江新城公共服务中心建设项目', score: 58, detailScore: '58.0', area: '松江区', status: '施工条件限制', type: '建筑工程', contractor: '中铁建工集团有限公司', owner: '松江区城市建设发展有限公司', supervisor: '上海协同工程咨询有限公司', manager: '周磊', startDate: '2025-07-01', endDate: '2027-09-30', reportNo: 'BJ20250701006', siteNo: 'P_202507010006', address: '松江区新城公共服务中心片区', geoArea: '外环以外', supervisionDept: '松江区质安监站', supervisionType: '区管项目', riskLevel: '高风险', permitNo: '沪建施许字（2026）第0606号', contractAmount: '16800.00', contractDays: '820', buildArea: '7600㎡', issueOrg: '松江区建设和管理委员会', issueDate: '2026-06-10', contractorCode: '91110000710912345T', ownerCode: '91310117607245678U', supervisorCode: '91310113703456789V' },
  { id: 7, claimed: true, name: '浦东新区张江科学城配套用房项目', score: 96, detailScore: '96.0', area: '浦东新区', status: '在监在建', type: '建筑工程', contractor: '上海建工七建集团有限公司', owner: '张江集团', supervisor: '上海浦桥工程建设管理有限公司', manager: '吴迪', startDate: '2024-12-01', endDate: '2027-03-31', reportNo: 'BJ20241201007', siteNo: 'P_202412010007', address: '浦东新区张江科学城中区', geoArea: '外环以内', supervisionDept: '浦东新区质安监站', supervisionType: '重点监督', riskLevel: '低风险', permitNo: '沪建施许字（2026）第0707号', contractAmount: '38650.88', contractDays: '850', buildArea: '22500㎡', issueOrg: '浦东新区建设和交通委员会', issueDate: '2026-07-15', contractorCode: '91310000132256789A', ownerCode: '91310115703434567C', supervisorCode: '91310115703465432H' },
  { id: 8, claimed: false, name: '徐汇滨江公共空间提升工程', score: 68, detailScore: '68.0', area: '徐汇区', status: '未销项', type: '建筑工程', contractor: '上海市基础工程集团有限公司', owner: '徐汇区建设管理委', supervisor: '上海上咨工程管理有限公司', manager: '刘洋', startDate: '2025-04-20', endDate: '2026-11-30', reportNo: 'BJ20250420008', siteNo: 'P_202504200008', address: '徐汇区滨江公共空间', geoArea: '内环以内', supervisionDept: '徐汇区质安监站', supervisionType: '区管项目', riskLevel: '中风险', permitNo: '沪建施许字（2026）第0808号', contractAmount: '9600.00', contractDays: '590', buildArea: '4800㎡', issueOrg: '徐汇区建设和管理委员会', issueDate: '2026-08-01', contractorCode: '91310000132224680J', ownerCode: '91310104425013579L', supervisorCode: '91310106703424680R' }
].map(item => {
  const exemptionApplications = [
    {
      id: `EX-${item.id}-01`,
      scenes: ['基坑监测', '安全穿戴'],
      videos: ['基坑及其他危险性较大的分部分项工程作业区'],
      materials: [
        { title: `免开通申请证明材料-${item.id}-01.pdf`, desc: '第一次申请通过，点击预览证明材料' }
      ]
    },
    {
      id: `EX-${item.id}-02`,
      scenes: ['塔机运行监测'],
      videos: item.id % 2 === 0 ? ['塔吊（制高点）'] : [],
      materials: [
        { title: `免开通申请证明材料-${item.id}-02.pdf`, desc: '第二次申请通过，点击预览证明材料' }
      ]
    }
  ];
  return {
    ...item,
    source: item.source || getProjectSource(item.id),
    level: getProjectLevel(item.score),
    levelClass: getProjectLevelClass(item.score),
    exemptionApplications
  };
}));


const selectedProject = ref(null);
const selectedLiveProject = ref(null);
const activeLiveDeviceId = ref(null);


const projectScheduleProgress = computed(() => {
  const p = selectedProject.value || {};
  if (!p.startDate || !p.endDate) return 0;
  const start = new Date(`${p.startDate}T00:00:00`).getTime();
  const end = new Date(`${p.endDate}T00:00:00`).getTime();
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  const percent = Math.round(((current - start) / (end - start)) * 100);
  return Math.min(100, Math.max(0, percent));
});

const projectDetailBasicInfo = computed(() => {
  const p = selectedProject.value || {};
  return [
    { label: '报建编号', value: p.reportNo || '-' },
    { label: '工地编号', value: p.siteNo || '-' },
    { label: '工地状态', value: p.status || '-' },
    { label: '工程类型', value: p.type || '-' },
    { label: '地理区域', value: p.geoArea || '-' },
    { label: '建设地址', value: p.address || '-' },
    { label: '总包项目经理', value: p.manager || '-' }
  ];
});

const projectDetailManageInfo = computed(() => {
  const p = selectedProject.value || {};
  return [
    { label: '所在管理区域', value: p.area || '-' },
    { label: '监督部门', value: p.supervisionDept || '-' },
    { label: '监督类型', value: p.supervisionType || '-' },
    { label: '风险等级', value: p.riskLevel || '-' }
  ];
});

const projectDetailPermitInfo = computed(() => {
  const p = selectedProject.value || {};
  return [
    { label: '施工许可证编号', value: p.permitNo || '-' },
    { label: '合同金额（万元）', value: p.contractAmount || '-' },
    { label: '合同工期（天）', value: p.contractDays || '-' },
    { label: '项目建筑面积', value: p.buildArea || '-' },
    { label: '发证机关', value: p.issueOrg || '-' },
    { label: '发证日期', value: p.issueDate || '-' }
  ];
});

const projectDetailCompanies = computed(() => {
  const p = selectedProject.value || {};
  return [
    { label: '建设单位', name: p.owner || '-', creditCode: p.ownerCode || '-' },
    { label: '监理单位', name: p.supervisor || '-', creditCode: p.supervisorCode || '-' },
    { label: '总包单位', name: p.contractor || '-', creditCode: p.contractorCode || '-' }
  ];
});

const projectApprovedExemptionScenes = computed(() => {
  const apps = selectedProject.value?.exemptionApplications || [];
  return [...new Set(apps.flatMap(item => item.scenes || []))];
});

const projectApprovedExemptionVideos = computed(() => {
  const apps = selectedProject.value?.exemptionApplications || [];
  return [...new Set(apps.flatMap(item => item.videos || []))];
});

const projectExemptionMaterials = computed(() => {
  const apps = selectedProject.value?.exemptionApplications || [];
  return apps.flatMap(item => item.materials || []);
});

function normalizeProjectFilterValue(value) {
  return Array.isArray(value) ? value : (value ? [value] : []);
}

function matchesProjectFilters(item, ignoredKey = '') {
  const keyword = projectSearch.value.keyword.trim().toLowerCase();
  const keywordMatched = !keyword || [item.name, item.contractor, item.owner, item.supervisor, item.manager]
    .some(value => String(value).toLowerCase().includes(keyword));
  if (!keywordMatched) return false;

  return ['source', 'area', 'status', 'type'].every(key => {
    if (key === ignoredKey) return true;
    const selected = normalizeProjectFilterValue(projectSearch.value[key]);
    return !selected.length || selected.includes(item[projectFilterMeta[key].field]);
  });
}

const projectBaseFilteredList = computed(() => {
  return projectList.value.filter(item => matchesProjectFilters(item));
});

function getProjectOptionCount(key, value) {
  return projectList.value.filter(item => {
    if (!matchesProjectFilters(item, key)) return false;
    return item[projectFilterMeta[key].field] === value;
  }).length;
}

const projectFilterConfigs = computed(() => {
  return ['status', 'type', 'area', 'source'].map(key => {
    const meta = projectFilterMeta[key];
    return {
      key,
      label: meta.label,
      title: meta.title,
      options: meta.optionsRef.value.map(value => ({
        value,
        label: value,
        count: getProjectOptionCount(key, value)
      }))
    };
  });
});

const projectSelectedTags = computed(() => {
  return ['status', 'type', 'area', 'source'].flatMap(key => {
    return normalizeProjectFilterValue(projectSearch.value[key]).map(value => ({ key, value }));
  });
});

function clearProjectFilter(key) {
  if (Array.isArray(projectSearch.value[key])) {
    projectSearch.value[key] = [];
  } else {
    projectSearch.value[key] = '';
  }
}

function removeProjectFilterTag(key, value) {
  const selected = normalizeProjectFilterValue(projectSearch.value[key]);
  projectSearch.value[key] = selected.filter(item => item !== value);
}

function confirmProjectFilter(key) {
  projectFilterVisible.value[key] = false;
}

const filteredProjectTotalCount = computed(() => projectBaseFilteredList.value.length);
const filteredProjectUnclaimedCount = computed(() => projectBaseFilteredList.value.filter(item => !item.claimed).length);

const filteredProjectList = computed(() => {
  if (!projectSearch.value.unclaimedOnly) return projectBaseFilteredList.value;
  return projectBaseFilteredList.value.filter(item => !item.claimed);
});

const projectStatusSummary = computed(() => {
  const list = projectBaseFilteredList.value;
  const stoppedCount = list.filter(isStoppedProject).length;
  return [
    { key: 'running', label: '在监在建', count: list.filter(item => item.status === '在监在建').length, statusValue: '在监在建', className: 'status-running' },
    { key: 'stopped', label: '停工', count: stoppedCount, statusGroup: stoppedProjectStatuses.slice(), className: 'status-stopped' },
    { key: 'suspended', label: '中止施工', count: list.filter(item => item.status === '中止施工').length, statusValue: '中止施工', className: 'status-suspended' },
    { key: 'complete', label: '完工', count: list.filter(item => item.status === '完工').length, statusValue: '完工', className: 'status-complete' },
    { key: 'unclosed', label: '未销项', count: list.filter(item => item.status === '未销项').length, statusValue: '未销项', className: 'status-unclosed' }
  ];
});

function applyProjectStatusSummary(item) {
  projectSearch.value.status = item.statusGroup ? item.statusGroup.slice() : [item.statusValue];
  projectMapMode.value = false;
}

function getProjectAreaInitial(area = '') {
  return String(area || '项').replace('新区', '').replace('区', '').slice(0, 1) || '项';
}

function getProjectAreaIconClass(area = '') {
  const map = {
    '黄浦区': 'area-huangpu', '徐汇区': 'area-xuhui', '长宁区': 'area-changning', '静安区': 'area-jingan',
    '普陀区': 'area-putuo', '虹口区': 'area-hongkou', '杨浦区': 'area-yangpu', '浦东新区': 'area-pudong',
    '闵行区': 'area-minhang', '宝山区': 'area-baoshan', '嘉定区': 'area-jiading', '金山区': 'area-jinshan',
    '松江区': 'area-songjiang', '青浦区': 'area-qingpu', '奉贤区': 'area-fengxian', '崇明区': 'area-chongming'
  };
  return map[area] || 'area-default';
}

function normalizeVideoPointLabel(pointType = '') {
  const text = String(pointType || '');
  if (text.includes('出入口')) return '出入口';
  if (text.includes('塔机') || text.includes('塔吊')) return '塔吊';
  if (text.includes('基坑')) return '基坑';
  return '其他';
}

function getProjectVideoPointTags(project) {
  const devices = getProjectVideoDevices(project);
  let tags = [...new Set(devices.map(item => normalizeVideoPointLabel(item.pointType)))].filter(Boolean);
  if (!tags.length) {
    const pool = ['出入口', '塔吊', '基坑'];
    const count = Math.min(3, Math.max(1, (project?.id || 1) % 4));
    tags = pool.slice(0, count);
  }
  return tags.filter(item => item !== '其他').slice(0, 3);
}

function getVideoPointTagClass(tag) {
  if (tag === '出入口') return 'video-point-entrance';
  if (tag === '塔吊') return 'video-point-tower';
  if (tag === '基坑') return 'video-point-pit';
  return 'video-point-other';
}

const projectSceneLabels = [
  { key: 'attendance', label: '到岗' },
  { key: 'dust', label: '扬尘' },
  { key: 'pit', label: '基坑' },
  { key: 'wear', label: '穿戴' },
  { key: 'tower', label: '塔机' },
  { key: 'edge', label: '临边' }
];

function getProjectSceneStatuses(project) {
  const id = project?.id || 1;
  return projectSceneLabels.map((scene, index) => {
    const mod = (id + index) % 5;
    const status = mod === 0 ? '免接' : (mod === 1 || mod === 4 ? '应接未接' : '已接');
    return {
      ...scene,
      status,
      className: status === '已接' ? 'scene-connected' : status === '免接' ? 'scene-exempt' : 'scene-missing'
    };
  });
}

function toggleUnclaimedProjectFilter() {
  projectSearch.value.unclaimedOnly = !projectSearch.value.unclaimedOnly;
  projectMapMode.value = false;
}

function clearProjectAreas() {
  projectSearch.value.area = [];
}

function claimListedProject(project) {
  const target = projectList.value.find(item => item.id === project.id);
  if (target) {
    target.claimed = true;
  }
  showToast('认领成功');
  if (!projectBaseFilteredList.value.some(item => !item.claimed)) {
    projectSearch.value.unclaimedOnly = false;
  }
}


const groupedProjectList = computed(() => {
  const groupMap = new Map();
  filteredProjectList.value.forEach(project => {
    const key = project.supervisionDept || '其他监督部门';
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key).push(project);
  });
  return Array.from(groupMap.entries()).map(([projectName, projects]) => ({ projectName, projects }));
});

function toggleProjectAggregateMode() {
  projectAggregateMode.value = projectAggregateMode.value === 'card' ? 'project' : 'card';
  if (projectAggregateMode.value === 'project') {
    projectMapMode.value = false;
  } else {
    collapsedProjectGroups.value = [];
  }
}

function toggleProjectGroupCollapse(projectName) {
  const current = collapsedProjectGroups.value.slice();
  const index = current.indexOf(projectName);
  if (index >= 0) current.splice(index, 1); else current.push(projectName);
  collapsedProjectGroups.value = current;
}

function isProjectGroupCollapsed(projectName) {
  return collapsedProjectGroups.value.includes(projectName);
}

const projectMapPoints = computed(() => {
  const areaCoords = {
    '黄浦区': { left: 49, top: 52 },
    '徐汇区': { left: 43, top: 58 },
    '长宁区': { left: 39, top: 51 },
    '静安区': { left: 45, top: 47 },
    '普陀区': { left: 40, top: 43 },
    '虹口区': { left: 50, top: 44 },
    '杨浦区': { left: 56, top: 44 },
    '浦东新区': { left: 66, top: 54 },
    '闵行区': { left: 38, top: 67 },
    '宝山区': { left: 51, top: 29 },
    '嘉定区': { left: 33, top: 30 },
    '金山区': { left: 31, top: 82 },
    '松江区': { left: 28, top: 67 },
    '青浦区': { left: 22, top: 53 },
    '奉贤区': { left: 48, top: 79 },
    '崇明区': { left: 61, top: 17 }
  };

  const offset = [
    { x: 0, y: 0 }, { x: 2.2, y: -1.4 }, { x: -2.4, y: 1.8 }, { x: 1.6, y: 2.6 },
    { x: -1.8, y: -2.2 }, { x: 3.2, y: 1.2 }, { x: -3.2, y: -1.2 }
  ];

  return filteredProjectList.value.map((project, index) => {
    const base = areaCoords[project.area] || { left: 50, top: 50 };
    const drift = offset[index % offset.length];
    return {
      ...project,
      pointStyle: {
        left: Math.max(10, Math.min(90, base.left + drift.x)) + '%',
        top: Math.max(8, Math.min(90, base.top + drift.y)) + '%'
      }
    };
  });
});

function setProjectTab(tab) {
  projectActiveTab.value = tab;
  projectAggregateMode.value = 'card';
  projectSearch.value.unclaimedOnly = false;
  if (tab === 'stats') {
    projectMapMode.value = false;
    currentPage.value = 'projectStats';
  } else {
    projectMapMode.value = tab === 'map';
    currentPage.value = 'projectList';
  }
  scrollTop();
}

function toggleProjectMapMode() {
  setProjectTab(projectMapMode.value ? 'list' : 'map');
}

/**
 * 视频中心
 */
const videoSearch = ref({
  keyword: '',
  pointType: [],
  onlineStatus: [],
  accessType: [],
  offlineOnly: false
});

const videoMapMode = ref(false);
const videoAggregateMode = ref('card');
const collapsedVideoProjects = ref([]);
const videoFilterVisible = ref({ aggregateMode: false, pointType: false, onlineStatus: false, accessType: false });
const videoPointTypeOptions = ref(['工地人员出入口', '基坑', '塔机（制高点）', '其他']);
const videoOnlineStatusOptions = ref(['在线', '离线']);
const videoAccessTypeOptions = ref(['天翼']);

const videoFilterMeta = {
  pointType: { label: '安装点位类型', title: '选择安装点位类型', field: 'pointType', optionsRef: videoPointTypeOptions },
  onlineStatus: { label: '在线状态', title: '选择在线状态', field: 'onlineStatus', optionsRef: videoOnlineStatusOptions },
  accessType: { label: '接入方式', title: '选择接入方式', field: 'accessType', optionsRef: videoAccessTypeOptions }
};

const videoDeviceList = ref([
  { id: 1, name: '临边摄像头', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', deviceNo: 'TY202601024111', pointType: '基坑', accessType: '天翼', onlineStatus: '在线', onlineRate: 98.9 },
  { id: 2, name: '出入口摄像头', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '杨浦区', deviceNo: 'TY202601024112', pointType: '工地人员出入口', accessType: '天翼', onlineStatus: '在线', onlineRate: 96.2 },
  { id: 3, name: '塔机全景摄像头', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', deviceNo: 'TY202601024113', pointType: '塔机（制高点）', accessType: '天翼', onlineStatus: '在线', onlineRate: 88.6 },
  { id: 4, name: '基坑东侧摄像头', projectName: '两湖隧道（东湖段）主体及附属配套工程施工总承包', area: '宝山区', deviceNo: 'TY202601024114', pointType: '基坑', accessType: '天翼', onlineStatus: '离线', onlineRate: 66.9 },
  { id: 5, name: '材料堆场摄像头', projectName: '松江新城公共服务中心建设项目', area: '松江区', deviceNo: 'TY202601024115', pointType: '其他', accessType: '天翼', onlineStatus: '在线', onlineRate: 92.4 },
  { id: 6, name: '南门出入口摄像头', projectName: '徐汇滨江公共空间提升工程', area: '徐汇区', deviceNo: 'TY202601024116', pointType: '工地人员出入口', accessType: '天翼', onlineStatus: '离线', onlineRate: 74.5 },
  { id: 7, name: '塔机运行摄像头', projectName: '浦东新区张江科学城配套用房项目', area: '浦东新区', deviceNo: 'TY202601024117', pointType: '塔机（制高点）', accessType: '天翼', onlineStatus: '在线', onlineRate: 99.1 },
  { id: 8, name: '临边摄像头', projectName: '长宁临空经济园区改造项目', area: '长宁区', deviceNo: 'TY202601024118', pointType: '基坑', accessType: '天翼', onlineStatus: '在线', onlineRate: 85.7 },
  { id: 9, name: '北侧围挡摄像头', projectName: '静安区城市更新综合项目', area: '静安区', deviceNo: 'TY202601024119', pointType: '其他', accessType: '天翼', onlineStatus: '离线', onlineRate: 58.3 },
  { id: 10, name: '基坑西侧摄像头', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', deviceNo: 'TY202601024120', pointType: '基坑', accessType: '天翼', onlineStatus: '在线', onlineRate: 91.5 },
  { id: 11, name: '塔机吊装摄像头', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', deviceNo: 'TY202601024121', pointType: '塔机（制高点）', accessType: '天翼', onlineStatus: '在线', onlineRate: 87.2 },
  { id: 12, name: '大门入口处摄像头', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '杨浦区', deviceNo: 'TY202601024122', pointType: '工地人员出入口', accessType: '天翼', onlineStatus: '在线', onlineRate: 98.7 },
  { id: 13, name: '重点区域点位', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '杨浦区', deviceNo: 'TY202601024123', pointType: '其他', accessType: '天翼', onlineStatus: '离线', onlineRate: 69.8 }
].map(item => ({
  ...item,
  pointTypeClass: item.pointType.includes('出入口') ? 'entrance' : item.pointType.includes('塔机') ? 'tower' : item.pointType.includes('基坑') ? 'pit' : 'other'
})));

function normalizeVideoFilterValue(value) {
  return Array.isArray(value) ? value : (value ? [value] : []);
}

function matchesVideoFilters(item, ignoredKey = '') {
  const keyword = videoSearch.value.keyword.trim().toLowerCase();
  const keywordMatched = !keyword || [item.projectName, item.deviceNo, item.name]
    .some(value => String(value).toLowerCase().includes(keyword));
  if (!keywordMatched) return false;

  return ['pointType', 'onlineStatus', 'accessType'].every(key => {
    if (key === ignoredKey) return true;
    const selected = normalizeVideoFilterValue(videoSearch.value[key]);
    return !selected.length || selected.includes(item[videoFilterMeta[key].field]);
  });
}

const videoBaseFilteredList = computed(() => {
  return videoDeviceList.value.filter(item => matchesVideoFilters(item));
});

function getVideoOptionCount(key, value) {
  return videoDeviceList.value.filter(item => {
    if (!matchesVideoFilters(item, key)) return false;
    return item[videoFilterMeta[key].field] === value;
  }).length;
}

const videoFilterConfigs = computed(() => {
  return ['pointType', 'onlineStatus', 'accessType'].map(key => {
    const meta = videoFilterMeta[key];
    return {
      key,
      label: meta.label,
      title: meta.title,
      options: meta.optionsRef.value.map(value => ({
        value,
        label: value,
        count: getVideoOptionCount(key, value)
      }))
    };
  });
});

const videoSelectedTags = computed(() => {
  return ['pointType', 'onlineStatus', 'accessType'].flatMap(key => {
    return normalizeVideoFilterValue(videoSearch.value[key]).map(value => ({ key, value }));
  });
});

function clearVideoFilter(key) {
  videoSearch.value[key] = [];
}

function removeVideoFilterTag(key, value) {
  const selected = normalizeVideoFilterValue(videoSearch.value[key]);
  videoSearch.value[key] = selected.filter(item => item !== value);
}

function confirmVideoFilter(key) {
  videoFilterVisible.value[key] = false;
}

const filteredVideoTotalCount = computed(() => videoBaseFilteredList.value.length);
const filteredVideoOfflineCount = computed(() => videoBaseFilteredList.value.filter(item => item.onlineStatus === '离线').length);

const filteredVideoList = computed(() => {
  if (!videoSearch.value.offlineOnly) return videoBaseFilteredList.value;
  return videoBaseFilteredList.value.filter(item => item.onlineStatus === '离线');
});

const groupedVideoList = computed(() => {
  const groupMap = new Map();
  filteredVideoList.value.forEach(device => {
    if (!groupMap.has(device.projectName)) {
      groupMap.set(device.projectName, []);
    }
    groupMap.get(device.projectName).push(device);
  });
  return Array.from(groupMap.entries()).map(([projectName, devices]) => ({ projectName, devices }));
});

function setVideoAggregateMode(mode) {
  videoAggregateMode.value = mode;
  if (mode === 'project') videoMapMode.value = false;
  if (mode === 'card') {
    collapsedVideoProjects.value = [];
  }
}

function toggleVideoProjectCollapse(projectName) {
  const current = collapsedVideoProjects.value.slice();
  const index = current.indexOf(projectName);
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(projectName);
  }
  collapsedVideoProjects.value = current;
}

function toggleOfflineVideoFilter() {
  videoSearch.value.offlineOnly = !videoSearch.value.offlineOnly;
  videoMapMode.value = false;
}

const videoMapPoints = computed(() => {
  const areaCoords = {
    '黄浦区': { left: 49, top: 52 }, '徐汇区': { left: 43, top: 58 }, '长宁区': { left: 39, top: 51 },
    '静安区': { left: 45, top: 47 }, '普陀区': { left: 40, top: 43 }, '虹口区': { left: 50, top: 44 },
    '杨浦区': { left: 56, top: 44 }, '浦东新区': { left: 66, top: 54 }, '闵行区': { left: 38, top: 67 },
    '宝山区': { left: 51, top: 29 }, '嘉定区': { left: 33, top: 30 }, '金山区': { left: 31, top: 82 },
    '松江区': { left: 28, top: 67 }, '青浦区': { left: 22, top: 53 }, '奉贤区': { left: 48, top: 79 }, '崇明区': { left: 61, top: 17 }
  };
  const offset = [{ x:0, y:0 }, { x:2.2, y:-1.4 }, { x:-2.4, y:1.8 }, { x:1.6, y:2.6 }, { x:-1.8, y:-2.2 }];
  return filteredVideoList.value.map((device, index) => {
    const base = areaCoords[device.area] || { left: 50, top: 50 };
    const drift = offset[index % offset.length];
    return {
      ...device,
      pointStyle: {
        left: Math.max(10, Math.min(90, base.left + drift.x)) + '%',
        top: Math.max(8, Math.min(90, base.top + drift.y)) + '%'
      }
    };
  });
});

function toggleVideoMapMode() {
  videoMapMode.value = !videoMapMode.value;
  if (videoMapMode.value) videoAggregateMode.value = 'card';
}

function goVideoList() {
  currentPage.value = 'videoList';
  scrollTop();
}

function getProjectVideoDevices(project) {
  if (!project) return [];
  let devices = videoDeviceList.value.filter(item => item.projectName === project.name);
  if (!devices.length) {
    devices = videoDeviceList.value.filter(item => item.area === project.area);
  }
  return devices.slice(0, 6);
}

function getProjectVideoCount(project) {
  return getProjectVideoDevices(project).length || Math.max(1, Math.min(6, (project?.id || 1) % 5 + 1));
}

const liveProjectDevices = computed(() => {
  if (selectedLiveProject.value) {
    const devices = getProjectVideoDevices(selectedLiveProject.value);
    if (devices.length) return devices;
  }
  if (activeLiveDeviceId.value) {
    const current = videoDeviceList.value.find(item => item.id === activeLiveDeviceId.value);
    if (current) return videoDeviceList.value.filter(item => item.projectName === current.projectName);
  }
  return videoDeviceList.value.slice(0, 4);
});

const activeLiveDevice = computed(() => {
  return liveProjectDevices.value.find(item => item.id === activeLiveDeviceId.value) || liveProjectDevices.value[0] || null;
});

function openProjectVideoLive(project) {
  selectedLiveProject.value = project;
  const devices = getProjectVideoDevices(project);
  activeLiveDeviceId.value = devices[0]?.id || videoDeviceList.value[0]?.id || null;
  currentPage.value = 'projectVideoLive';
  scrollTop();
}

function selectLiveDevice(device) {
  activeLiveDeviceId.value = device.id;
}

function openVideoLive(device) {
  selectedLiveProject.value = projectList.value.find(project => project.name === device.projectName) || null;
  activeLiveDeviceId.value = device.id;
  currentPage.value = 'projectVideoLive';
  scrollTop();
}

function openVideoHistory(device) {
  showToast('进入历史回放：' + device.deviceNo);
}


/**
 * 塔机管理
 */
const craneSearch = ref({ keyword: '' });
const craneMapMode = ref(false);
const craneAggregateMode = ref('card');
const collapsedCraneProjects = ref([]);
const craneFilterVisible = ref({ aggregateMode: false });

const craneDeviceList = ref([
  { id: 1, name: '1#塔吊', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', onlineStatus: '在线', onlineRate: 98.9, factoryNo: '沪AA-T201300001', model: 'WA7025-12KA平头塔式起重机', manufacturer: '江苏徐工', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-9-6', qrNo: 'SH-TJ-001' },
  { id: 2, name: '2#塔吊', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', onlineStatus: '离线', onlineRate: 78.9, factoryNo: '沪AA-T201300002', model: 'WA7025-12KA平头塔式起重机', manufacturer: '江苏徐工', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-9-6', qrNo: 'SH-TJ-002' },
  { id: 3, name: '1#塔吊', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', onlineStatus: '在线', onlineRate: 92.5, factoryNo: '沪AA-T201300003', model: 'QTZ250塔式起重机', manufacturer: '中联重科', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-8-18', qrNo: 'SH-TJ-003' },
  { id: 4, name: '2#塔吊', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', onlineStatus: '在线', onlineRate: 88.2, factoryNo: '沪AA-T201300004', model: 'QTZ250塔式起重机', manufacturer: '中联重科', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-8-20', qrNo: 'SH-TJ-004' },
  { id: 5, name: '3#塔吊', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', onlineStatus: '离线', onlineRate: 69.6, factoryNo: '沪AA-T201300005', model: 'QTZ160塔式起重机', manufacturer: '浙江建机', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-7-10', qrNo: 'SH-TJ-005' },
  { id: 6, name: '1#塔吊', projectName: '两湖隧道（东湖段）主体及附属配套工程施工总承包', area: '宝山区', onlineStatus: '在线', onlineRate: 95.1, factoryNo: '沪AA-T201300006', model: 'WA7025-12KA平头塔式起重机', manufacturer: '江苏徐工', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-9-12', qrNo: 'SH-TJ-006' },
  { id: 7, name: '1#塔吊', projectName: '松江新城公共服务中心建设项目', area: '松江区', onlineStatus: '在线', onlineRate: 86.4, factoryNo: '沪AA-T201300007', model: 'QTZ200塔式起重机', manufacturer: '上海庞源', inspectionUnit: '上海市特征设备检测研究院', certificateDate: '2025-6-22', qrNo: 'SH-TJ-007' }
]);

const filteredCraneList = computed(() => {
  const keyword = craneSearch.value.keyword.trim().toLowerCase();
  return craneDeviceList.value.filter(item => !keyword || [item.projectName, item.factoryNo, item.name].some(value => String(value).toLowerCase().includes(keyword)));
});

const groupedCraneList = computed(() => {
  const groupMap = new Map();
  filteredCraneList.value.forEach(device => {
    if (!groupMap.has(device.projectName)) groupMap.set(device.projectName, []);
    groupMap.get(device.projectName).push(device);
  });
  return Array.from(groupMap.entries()).map(([projectName, devices]) => ({ projectName, devices }));
});

function setCraneAggregateMode(mode) { craneAggregateMode.value = mode; if (mode === 'project') craneMapMode.value = false; if (mode === 'card') collapsedCraneProjects.value = []; }
function confirmCraneFilter(key) { craneFilterVisible.value[key] = false; }
function toggleCraneProjectCollapse(projectName) {
  const current = collapsedCraneProjects.value.slice();
  const index = current.indexOf(projectName);
  if (index >= 0) current.splice(index, 1); else current.push(projectName);
  collapsedCraneProjects.value = current;
}

const craneMapPoints = computed(() => {
  const areaCoords = { '黄浦区': { left: 49, top: 52 }, '徐汇区': { left: 43, top: 58 }, '长宁区': { left: 39, top: 51 }, '静安区': { left: 45, top: 47 }, '普陀区': { left: 40, top: 43 }, '虹口区': { left: 50, top: 44 }, '杨浦区': { left: 56, top: 44 }, '浦东新区': { left: 66, top: 54 }, '闵行区': { left: 38, top: 67 }, '宝山区': { left: 51, top: 29 }, '嘉定区': { left: 33, top: 30 }, '金山区': { left: 31, top: 82 }, '松江区': { left: 28, top: 67 }, '青浦区': { left: 22, top: 53 }, '奉贤区': { left: 48, top: 79 }, '崇明区': { left: 61, top: 17 } };
  const offset = [{ x:0, y:0 }, { x:2.2, y:-1.4 }, { x:-2.4, y:1.8 }, { x:1.6, y:2.6 }, { x:-1.8, y:-2.2 }];
  return filteredCraneList.value.map((device, index) => {
    const base = areaCoords[device.area] || { left: 50, top: 50 };
    const drift = offset[index % offset.length];
    return { ...device, pointStyle: { left: Math.max(10, Math.min(90, base.left + drift.x)) + '%', top: Math.max(8, Math.min(90, base.top + drift.y)) + '%' } };
  });
});

function toggleCraneMapMode() { craneMapMode.value = !craneMapMode.value; if (craneMapMode.value) craneAggregateMode.value = 'card'; }
function goCraneList() { currentPage.value = 'craneList'; scrollTop(); }

const selectedCraneDevice = ref(null);
const dismantleVideoList = computed(() => {
  const crane = selectedCraneDevice.value || craneDeviceList.value[0];
  return [
    { id: 1, desc: '塔机安装', uploader: '张三', time: '2026-01-23 16:45:11', craneName: crane?.name || '1#塔吊' },
    { id: 2, desc: '塔机顶升', uploader: '张三', time: '2026-01-23 16:45:11', craneName: crane?.name || '1#塔吊' },
    { id: 3, desc: '塔机附着', uploader: '李四', time: '2026-02-02 09:20:08', craneName: crane?.name || '1#塔吊' },
    { id: 4, desc: '塔机拆除', uploader: '王五', time: '2026-03-16 14:12:36', craneName: crane?.name || '1#塔吊' },
    { id: 5, desc: '塔机安全复核', uploader: '赵六', time: '2026-04-01 10:05:23', craneName: crane?.name || '1#塔吊' }
  ];
});
function openCraneInstallVideos(device) { selectedCraneDevice.value = device; currentPage.value = 'craneInstallVideos'; scrollTop(); }
function openCraneCertificate(device) { selectedCraneDevice.value = device; currentPage.value = 'craneCertificate'; scrollTop(); }
function playCraneInstallVideo(video) { showToast('播放安拆视频：' + video.desc); }



/**
 * 扬尘设备管理
 */
const dustSearch = ref({ keyword: '' });
const dustMapMode = ref(false);
const dustAggregateMode = ref('card');
const collapsedDustProjects = ref([]);
const dustAttachmentVisible = ref(false);
const selectedDustDevice = ref(null);

const dustDeviceList = ref([
  { id: 1, name: '1#扬尘监测设备', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', onlineStatus: '在线', installTime: '2025-11-18', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-03 10:28:16', onlineRate: 98.6 },
  { id: 2, name: '2#扬尘监测设备', projectName: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', onlineStatus: '在线', installTime: '2025-11-20', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-02 15:12:44', onlineRate: 91.3 },
  { id: 3, name: '东侧围挡扬尘设备', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', onlineStatus: '离线', installTime: '2025-10-06', maintenanceStatus: '未运维', hasAttachment: false, lastMaintenanceTime: '--', onlineRate: 68.9 },
  { id: 4, name: '南门扬尘监测设备', projectName: '虹桥商务区核心区综合改造工程', area: '闵行区', onlineStatus: '在线', installTime: '2025-10-08', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-01 09:35:22', onlineRate: 87.4 },
  { id: 5, name: '基坑侧扬尘设备', projectName: '两湖隧道（东湖段）主体及附属配套工程施工总承包', area: '宝山区', onlineStatus: '在线', installTime: '2025-12-01', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-04 11:18:02', onlineRate: 95.2 },
  { id: 6, name: '生活区扬尘设备', projectName: '松江新城公共服务中心建设项目', area: '松江区', onlineStatus: '离线', installTime: '2025-09-16', maintenanceStatus: '未运维', hasAttachment: false, lastMaintenanceTime: '--', onlineRate: 72.1 },
  { id: 7, name: '西侧围挡扬尘设备', projectName: '徐汇滨江公共空间提升工程', area: '徐汇区', onlineStatus: '在线', installTime: '2025-10-26', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-05 14:20:11', onlineRate: 89.7 },
  { id: 8, name: '北门扬尘设备', projectName: '浦东新区张江科学城配套用房项目', area: '浦东新区', onlineStatus: '在线', installTime: '2025-12-12', maintenanceStatus: '已运维', hasAttachment: true, lastMaintenanceTime: '2026-06-06 08:46:39', onlineRate: 97.9 }
]);

const filteredDustList = computed(() => {
  const keyword = dustSearch.value.keyword.trim().toLowerCase();
  return dustDeviceList.value.filter(item => !keyword || [item.projectName, item.name].some(value => String(value).toLowerCase().includes(keyword)));
});

const groupedDustList = computed(() => {
  const groupMap = new Map();
  filteredDustList.value.forEach(device => {
    if (!groupMap.has(device.projectName)) groupMap.set(device.projectName, []);
    groupMap.get(device.projectName).push(device);
  });
  return Array.from(groupMap.entries()).map(([projectName, devices]) => ({ projectName, devices }));
});

function setDustAggregateMode(mode) {
  dustAggregateMode.value = mode;
  if (mode === 'project') dustMapMode.value = false;
  if (mode === 'card') collapsedDustProjects.value = [];
}
function toggleDustProjectCollapse(projectName) {
  const current = collapsedDustProjects.value.slice();
  const index = current.indexOf(projectName);
  if (index >= 0) current.splice(index, 1); else current.push(projectName);
  collapsedDustProjects.value = current;
}
const dustMapPoints = computed(() => {
  const areaCoords = { '黄浦区': { left: 49, top: 52 }, '徐汇区': { left: 43, top: 58 }, '长宁区': { left: 39, top: 51 }, '静安区': { left: 45, top: 47 }, '普陀区': { left: 40, top: 43 }, '虹口区': { left: 50, top: 44 }, '杨浦区': { left: 56, top: 44 }, '浦东新区': { left: 66, top: 54 }, '闵行区': { left: 38, top: 67 }, '宝山区': { left: 51, top: 29 }, '嘉定区': { left: 33, top: 30 }, '金山区': { left: 31, top: 82 }, '松江区': { left: 28, top: 67 }, '青浦区': { left: 22, top: 53 }, '奉贤区': { left: 48, top: 79 }, '崇明区': { left: 61, top: 17 } };
  const offset = [{ x:0, y:0 }, { x:2.2, y:-1.4 }, { x:-2.4, y:1.8 }, { x:1.6, y:2.6 }, { x:-1.8, y:-2.2 }];
  return filteredDustList.value.map((device, index) => {
    const base = areaCoords[device.area] || { left: 50, top: 50 };
    const drift = offset[index % offset.length];
    return { ...device, pointStyle: { left: Math.max(10, Math.min(90, base.left + drift.x)) + '%', top: Math.max(8, Math.min(90, base.top + drift.y)) + '%' } };
  });
});
function toggleDustMapMode() { dustMapMode.value = !dustMapMode.value; if (dustMapMode.value) dustAggregateMode.value = 'card'; }
function goDustList() { currentPage.value = 'dustList'; scrollTop(); }
function previewDustAttachment(device) {
  if (!device.hasAttachment) {
    showToast('暂无运维附件');
    return;
  }
  selectedDustDevice.value = device;
  dustAttachmentVisible.value = true;
}

/**
 * 基坑管理
 */
const pitSearch = ref({ keyword: '', risk: [], deep: [], safety: [], unclaimedOnly: false });
const pitMapMode = ref(false);
const pitFilterVisible = ref({ risk: false, deep: false, safety: false });
const selectedPitProject = ref(null);
const collapsedPitAreas = ref([]);

const pitRiskOptions = ref(['风险可控', '一般风险', '严重风险']);
const pitDeepOptions = ref(['是', '否']);
const pitSafetyOptions = ref(['一级', '二级', '三级']);
const pitFilterMeta = {
  risk: { label: '基坑风险', title: '选择基坑风险', field: 'risk', optionsRef: pitRiskOptions },
  deep: { label: '是否深基坑', title: '选择是否深基坑', field: 'deep', optionsRef: pitDeepOptions },
  safety: { label: '安全等级', title: '选择安全等级', field: 'safety', optionsRef: pitSafetyOptions }
};

const pitProjectList = ref([
  { id: 1, name: '金海路（杨高中路-华东路东侧）改建工程2标', area: '黄浦区', risk: '风险可控', deep: '是', safety: '一级', status: '安全可控', monitorStart: '2025-9-6', workEnd: '2025-9-6', pitAreaCount: 5, excavationCount: 5, unclaimed: true, lng: 121.49, lat: 31.23 },
  { id: 2, name: '虹桥商务区核心区综合改造工程', area: '闵行区', risk: '一般风险', deep: '是', safety: '二级', status: '一般风险', monitorStart: '2025-9-8', workEnd: '2025-10-16', pitAreaCount: 3, excavationCount: 2, unclaimed: false, lng: 121.38, lat: 31.17 },
  { id: 3, name: '两湖隧道（东湖段）主体及附属配套工程施工总承包', area: '宝山区', risk: '严重风险', deep: '是', safety: '三级', status: '重点关注', monitorStart: '2025-8-26', workEnd: '2025-12-20', pitAreaCount: 4, excavationCount: 4, unclaimed: true, lng: 121.48, lat: 31.40 },
  { id: 4, name: '松江新城公共服务中心建设项目', area: '松江区', risk: '风险可控', deep: '否', safety: '一级', status: '安全可控', monitorStart: '2025-9-12', workEnd: '2025-11-28', pitAreaCount: 2, excavationCount: 1, unclaimed: false, lng: 121.23, lat: 31.03 },
  { id: 5, name: '浦东新区张江科学城配套用房项目', area: '浦东新区', risk: '一般风险', deep: '是', safety: '二级', status: '一般风险', monitorStart: '2025-9-16', workEnd: '2025-12-10', pitAreaCount: 6, excavationCount: 4, unclaimed: true, lng: 121.62, lat: 31.20 },
  { id: 6, name: '长宁临空经济园区改造项目', area: '长宁区', risk: '风险可控', deep: '否', safety: '一级', status: '安全可控', monitorStart: '2025-10-01', workEnd: '2025-11-30', pitAreaCount: 2, excavationCount: 2, unclaimed: false, lng: 121.36, lat: 31.22 },
  { id: 7, name: '静安区城市更新综合项目', area: '静安区', risk: '一般风险', deep: '是', safety: '二级', status: '一般风险', monitorStart: '2025-10-06', workEnd: '2025-12-12', pitAreaCount: 3, excavationCount: 3, unclaimed: false, lng: 121.45, lat: 31.24 },
  { id: 8, name: '徐汇滨江公共空间提升工程', area: '徐汇区', risk: '风险可控', deep: '否', safety: '一级', status: '安全可控', monitorStart: '2025-10-10', workEnd: '2025-11-26', pitAreaCount: 2, excavationCount: 1, unclaimed: true, lng: 121.44, lat: 31.18 }
]);

function normalizePitFilterValue(value) {
  return Array.isArray(value) ? value : (value ? [value] : []);
}
function matchesPitFilters(item, ignoredKey = '') {
  const keyword = pitSearch.value.keyword.trim().toLowerCase();
  if (keyword && !item.name.toLowerCase().includes(keyword)) return false;
  return ['risk', 'deep', 'safety'].every(key => {
    if (key === ignoredKey) return true;
    const selected = normalizePitFilterValue(pitSearch.value[key]);
    return !selected.length || selected.includes(item[pitFilterMeta[key].field]);
  });
}
const pitBaseFilteredList = computed(() => pitProjectList.value.filter(item => matchesPitFilters(item)));
const filteredPitList = computed(() => pitSearch.value.unclaimedOnly ? pitBaseFilteredList.value.filter(item => item.risk && item.risk !== '风险可控') : pitBaseFilteredList.value);
const filteredPitTotalCount = computed(() => filteredPitList.value.length);

    const filteredPitAreaTotalCount = computed(() => filteredPitList.value.reduce((s,p)=>s + (p.pitAreaCount || 0),0));
    const filteredPitRiskCount = computed(() => filteredPitList.value.filter(p => p.risk && p.risk !== '风险可控').reduce((s,p)=>s + (p.pitAreaCount || 0),0));

const filteredPitUnclaimedCount = computed(() => pitBaseFilteredList.value.filter(item => item.risk && item.risk !== '风险可控').length);
function getPitOptionCount(key, value) {
  return pitProjectList.value.filter(item => matchesPitFilters(item, key) && item[pitFilterMeta[key].field] === value).length;
}
const pitFilterConfigs = computed(() => ['risk', 'deep', 'safety'].map(key => {
  const meta = pitFilterMeta[key];
  return { key, label: meta.label, title: meta.title, options: meta.optionsRef.value.map(value => ({ value, label: value, count: getPitOptionCount(key, value) })) };
}));
function clearPitFilter(key) { pitSearch.value[key] = []; }
function confirmPitFilter(key) { pitFilterVisible.value[key] = false; }
function togglePitUnclaimedFilter() { pitSearch.value.unclaimedOnly = !pitSearch.value.unclaimedOnly; pitMapMode.value = false; }
function togglePitMapMode() { pitMapMode.value = !pitMapMode.value; }
function goPitList() { currentPage.value = 'pitList'; scrollTop(); }
function openPitDetail(project) { selectedPitProject.value = project; currentPage.value = 'pitDetail'; collapsedPitAreas.value = []; scrollTop(); }
function goPitBack() { currentPage.value = 'pitList'; scrollTop(); }
function togglePitAreaCollapse(areaName) {
  const current = collapsedPitAreas.value.slice();
  const index = current.indexOf(areaName);
  if (index >= 0) current.splice(index, 1); else current.push(areaName);
  collapsedPitAreas.value = current;
}
function isPitAreaCollapsed(areaName) { return collapsedPitAreas.value.includes(areaName); }
const selectedPitAreas = computed(() => {
  const project = selectedPitProject.value || pitProjectList.value[0];
  return [
    { name: 'A区', safety: '一级', env: '一级', water: '是', depth: '6.9m', structure: '地下连续墙', structureDepth: '6.9m' },
    { name: 'B区', safety: project.safety === '三级' ? '二级' : '一级', env: project.risk === '严重风险' ? '二级' : '一级', water: '是', depth: project.deep === '是' ? '6.9m' : '3.2m', structure: '地下连续墙', structureDepth: project.deep === '是' ? '6.9m' : '3.2m' }
  ];
});
const selectedPitOrders = computed(() => {
  const project = selectedPitProject.value || pitProjectList.value[0];
  return Array.from({ length: Math.max(3, project.excavationCount || 3) }).map((_, index) => ({
    id: index + 1,
    name: `开挖令${index % 2 === 0 ? 'A区五层' : 'B区四层'}.pdf`,
    uploader: index % 2 === 0 ? '张杰勋' : '李明',
    time: '2026-01-23 16:45:11'
  }));
});
const pitMapPoints = computed(() => {
  const areaCoords = { '黄浦区': { left: 49, top: 52 }, '徐汇区': { left: 43, top: 58 }, '长宁区': { left: 39, top: 51 }, '静安区': { left: 45, top: 47 }, '普陀区': { left: 40, top: 43 }, '虹口区': { left: 50, top: 44 }, '杨浦区': { left: 56, top: 44 }, '浦东新区': { left: 66, top: 54 }, '闵行区': { left: 38, top: 67 }, '宝山区': { left: 51, top: 29 }, '嘉定区': { left: 33, top: 30 }, '金山区': { left: 31, top: 82 }, '松江区': { left: 28, top: 67 }, '青浦区': { left: 22, top: 53 }, '奉贤区': { left: 48, top: 79 }, '崇明区': { left: 61, top: 17 } };
  const offset = [{ x:0, y:0 }, { x:2.2, y:-1.4 }, { x:-2.4, y:1.8 }, { x:1.6, y:2.6 }, { x:-1.8, y:-2.2 }];
  return filteredPitList.value.map((project, index) => {
    const base = areaCoords[project.area] || { left: 50, top: 50 };
    const drift = offset[index % offset.length];
    return { ...project, pointStyle: { left: Math.max(10, Math.min(90, base.left + drift.x)) + '%', top: Math.max(8, Math.min(90, base.top + drift.y)) + '%' } };
  });
});

const todoPageTasks = ref([
  {
    id: 101,
    type: 'approval',
    icon: '审',
    iconColor: '#2563EB',
    title: '场景免开通申请审批',
    approvalType: '场景免开通审核',
    siteName: '新建银樽路（芳春路—外环）上水管搬迁',
    desc: '申请免开通场景为安全穿戴、塔机监测、基坑监测，请及时审批',
    initiator: '张建国',
    createTime: '2026-06-05 09:30',
    status: 'pending'
  },
  {
    id: 105,
    type: 'middle-approval',
    icon: '中',
    iconColor: '#F59E0B',
    title: '政企协同中闭环待审批',
    approvalType: '政企协同中闭环审批',
    siteName: 'SA241420034修路+宝山六村燃气管道改造',
    desc: '项目已完成安全穿戴中闭环的处置，请及时审批',
    initiator: '宝山区监管员',
    createTime: '2026-06-09 14:28',
    status: 'pending'
  },
  {
    id: 106,
    type: 'site-code-approval',
    icon: '审',
    iconColor: '#2563EB',
    title: '工地编号变更审批',
    approvalType: '工地编号变更审批',
    siteName: '新建银樽路（芳春路—外环）上水管搬迁',
    desc: '工地编号变更为GD21324141，请及时审批',
    initiator: '系统管理员',
    createTime: '2026-06-09 10:12',
    status: 'pending'
  },
  {
    id: 107,
    type: 'manager-claim',
    icon: '认',
    iconColor: '#10B981',
    title: '项目经理认领审批',
    approvalType: '项目经理认领审批',
    siteName: '徐汇区漕河泾园区综合改造项目',
    desc: '项目经理张建国申请认领项目，请及时审批',
    initiator: '张建国',
    createTime: '2026-06-08 09:30',
    status: 'pending'
  },
  {
    id: 108,
    type: 'scene-exempt',
    icon: '免',
    iconColor: '#8B5CF6',
    title: '场景免开通审批',
    approvalType: '场景免开通审核',
    siteName: '虹桥商务区地下空间开发项目',
    desc: '项目申请安全穿戴场景免开通，请及时审批',
    initiator: '李明',
    createTime: '2026-06-07 16:45',
    status: 'pending'
  },
  {
    id: 109,
    type: 'key-role-change',
    icon: '变',
    iconColor: '#EF4444',
    title: '关键岗位人员变更审批',
    approvalType: '关键岗位人员变更审批',
    siteName: '松江新城TOD综合体建设工程',
    desc: '项目总监变更申请已提交，请及时审批',
    initiator: '陈华',
    createTime: '2026-06-06 15:20',
    status: 'pending'
  },
  {
    id: 102,
    type: 'projectCreate',
    icon: '建',
    iconColor: '#BD9660',
    title: '项目创建审批',
    approvalType: '项目创建',
    siteName: '浦东新区芳春路市政配套工程',
    desc: '项目创建申请已提交，请及时审批',
    initiator: '李明',
    createTime: '2026-06-04 16:20',
    status: 'pending'
  },
  {
    id: 103,
    type: 'claim',
    icon: '认',
    iconColor: '#10B981',
    title: '监理单位总监项目认领',
    approvalType: '监理单位总监项目认领',
    siteName: '黄浦区外滩街道综合改造项目',
    desc: '监理单位总监项目认领流程已完成',
    initiator: '王磊',
    createTime: '2026-06-03 10:12',
    status: 'done'
  },
  {
    id: 104,
    type: 'claim',
    icon: '认',
    iconColor: '#10B981',
    title: '业主项目经理项目认领',
    approvalType: '业主项目经理项目认领',
    siteName: '闵行区七莘路道路维修工程',
    desc: '业主项目经理认领流程已完成',
    initiator: '陈晨',
    createTime: '2026-06-02 14:45',
    status: 'done'
  }
]);

function matchTodoSearch(task) {
  const approvalTypeMatched =
    !todoSearch.value.approvalType ||
    task.approvalType === todoSearch.value.approvalType;

  const siteNameMatched =
    !todoSearch.value.siteName ||
    task.siteName.includes(todoSearch.value.siteName);

  const initiatorMatched =
    !todoSearch.value.initiator ||
    task.initiator.includes(todoSearch.value.initiator);

  return approvalTypeMatched && siteNameMatched && initiatorMatched;
}

const todoPagePendingList = computed(() => {
  return todoPageTasks.value.filter(
    item => item.status === 'pending' && matchTodoSearch(item)
  );
});

const todoPageDoneList = computed(() => {
  return todoPageTasks.value.filter(
    item => item.status === 'done' && matchTodoSearch(item)
  );
});

const currentTodoPageList = computed(() => {
  return todoPageTab.value === 'pending'
    ? todoPagePendingList.value
    : todoPageDoneList.value;
});

    /**
     * 消息通知
     */
    const messageList = ref([
      {
        id: 1,
        title: '系统通知',
        time: '刚刚',
        desc: '您有 2 个项目场景待认领，请及时处理',
        project: '智慧工地监管平台'
      },
      {
        id: 2,
        title: '待办超时提醒',
        time: '20分钟前',
        desc: 'A 项目塔机监测预警确认已接近超时',
        project: '市安质监总站'
      }
    ]);

    /**
     * 免开通场景
     */
    const sceneOptions = ref([
      { name: '到岗履职', checked: false },
      { name: '基坑监测', checked: true },
      { name: '扬尘设备运维', checked: false },
      { name: '安全穿戴', checked: true },
      { name: '塔机运行监测', checked: true },
      { name: '基坑临边防护', checked: false }
    ]);

    const videoOptions = ref([
      { name: '工地（含红线内生活区）人员出入口', checked: false },
      { name: '塔吊（制高点）', checked: false },
      { name: '基坑及其他危险性较大的分部分项工程作业区', checked: false }
    ]);

    /**
     * 项目基本信息
     */
const projectBaseInfo = ref([
  { label: '工地名称', value: '新建银樽路（芳春路—外环）上水管搬迁' },
  { label: '工地编号', value: 'GD31011520240618001' },
  { label: '工地生产日期', value: '2026-03-01' },
  { label: '工地完工日期', value: '2026-08-31' },
  { label: '项目建筑面积', value: '12,800㎡' },
  { label: '所在地区', value: '浦东新区' },
  { label: '建设地址', value: '芳春路—外环沿线区域' },
  {
    label: '施工许可证',
    type: 'image',
    value: 'https://so1.360tres.com/t010b6fca268e33b9b9.png' 
  }
]);


    /**
     * 项目管理信息
     */
    const projectManageInfo = ref([
      { label: '总包单位', value: '上海市政建设工程有限公司', creditCode: '91310000132285298E' },
      { label: '建设单位', value: '上海浦东城市建设投资有限公司', creditCode: '91310115703450568L' },
      { label: '监理单位', value: '上海建科工程咨询有限公司', creditCode: '91310106132220104T' },
      { label: '监督部门', value: '市安质监总站' }
    ]);

    /**
     * 审批记录
     */
    const approvalFinished = ref(false);

    const approvalRecords = ref([
      {
        id: 1,
        nodeName: '项目经理发起审批',
        handler: '张建国',
        handleTime: '2026-06-05 09:30',
        handleStatus: '发起成功',
        statusText: '已提交',
        statusClass: 'done'
      },
      {
        id: 2,
        nodeName: '监督部门监督员审批',
        handler: '何琨',
        handleTime: '--',
        handleStatus: '待处理',
        statusText: '待审批',
        statusClass: 'current'
      }
    ]);

    /**
     * 版本记录
     */
    const versionRecords = ref([
      {
        version: 'V2.8.0',
        title: '项目清单交互重构版',
        releaseTime: '2026-06-11 19:10',
        content: `
          <p><span class="tag">升级</span><strong>项目清单移除顶部 Tab，地图与统计入口统一上移到搜索框右侧。</strong></p>
          <ul>
            <li>删除项目清单顶部“统计 / 列表 / 地图”Tab，降低页面占高；</li>
            <li>搜索框右侧新增地图/列表切换按钮，地图模式下按钮展示为“列表”；</li>
            <li>统计改为独立页面入口，保留现有统计内容并支持左上角返回项目列表；</li>
            <li>底部“项目”菜单默认进入项目列表，符合底部 Tab 切换关系。</li>
          </ul>
        `
      },
      {
        version: 'V2.7.0',
        title: '项目认领全面升级版',
        releaseTime: '2026-06-11 18:20',
        content: `
          <p><span class="tag">新增</span><strong>项目认领升级为监管人员项目认领工作台。</strong></p>
          <ul>
            <li>新增当前角色与负责场景信息展示；</li>
            <li>新增认领新项目、接手已认领项目两个功能入口，接手功能标记为建设中；</li>
            <li>新增本次认领项目清单、项目检索添加和确认认领流程；</li>
            <li>确认认领后无需审批，直接完成认领并写入认领历史。</li>
          </ul>
        `
      },
  {
    version: 'V2.6.2',
    releaseTime: '2026-06-14 00:20',
    title: '项目瘦身与版本记录合并优化版',
    content: `
      <p><span class="tag">优化</span><strong>清理工程内大量分散的 CHANGELOG-ZJW-*.md 文件，统一维护版本记录数据源。</strong></p>
      <ul>
        <li>删除根目录历史分散版本说明 md 文件，降低压缩包冗余和目录复杂度；</li>
        <li>新增统一 CHANGELOG.md，保留关键版本更新摘要；</li>
        <li>“我的 > 版本记录”继续展示最新版本和历史更新内容，后续版本只维护页面内版本记录与统一 CHANGELOG；</li>
        <li>不修改业务页面、应用入口、筛选、地图、图标和审批等既有功能逻辑。</li>
      </ul>
    `
  },
  {
    version: 'V2.6.1',
    releaseTime: '2026-06-14 00:05',
    title: '工作台图标 V4 替换版',
    content: `
      <p><span class="tag">升级</span><strong>工作台应用图标统一替换为 V4 圆角卡片 PNG 风格。</strong></p>
      <ul>
        <li>扫一扫、公告、中闭环处置、项目认领等 12 个入口统一使用 PNG 图标资源；</li>
        <li>安全穿戴、基坑临边防护、项目画像、视频中心、塔机管理、扬尘设备管理、基坑管理、到岗履职完成同风格替换；</li>
        <li>图标统一圆角底座、轻拟物质感、柔和阴影和视觉重心；</li>
        <li>工作台、我的应用、编辑我的应用保持同一套资源。</li>
      </ul>
    `
  },
  {
    version: 'V2.5.1',
    releaseTime: '2026-06-14 00:00',
    title: '项目列表与地图间距紧凑优化版',
    content: `
      <p><span class="tag">优化</span><strong>收紧项目列表 Tab、地图 Tab 与筛选和内容区域之间的纵向间距。</strong></p>
      <ul>
        <li>优化 Tab 切换与筛选条件之间的间距；</li>
        <li>优化筛选条件与项目卡片列表之间的间距；</li>
        <li>优化筛选条件与地图区域之间的间距，并保持地图高度自适应；</li>
        <li>仅调整视觉间距，不改变筛选、列表、地图和项目操作逻辑。</li>
      </ul>
    `
  },
  {
    version: 'V2.5.0',
    releaseTime: '2026-06-13 23:55',
    title: '项目地图自适应优化版',
    content: `
      <p><span class="tag">优化</span><strong>项目清单地图 Tab 去除白色外框，并提升地图区域高度自适应表现。</strong></p>
      <ul>
        <li>去掉地图外层白色卡片包裹，地图直接承载在页面内容区域中；</li>
        <li>地图高度改为基于视口高度自适应，减少底部空白并提升可视面积；</li>
        <li>仅调整项目清单地图 Tab 样式，不影响列表筛选、项目卡片和其他设备地图页面逻辑。</li>
      </ul>
    `
  },
  {
    version: 'V1.31.3',
    releaseTime: '2026-06-12 11:10',
    title: '项目清单统计间距优化版',
    content: `
      <p><span class="tag">优化</span><strong>调整项目清单统计条与下方项目卡片的垂直间距。</strong></p>
      <ul>
        <li>缩小“共X个项目，其中Y个项目未被认领”统计条与项目卡片之间的间距；</li>
        <li>统一统计条与项目卡片间距为14px，与项目卡片之间的间距保持一致；</li>
        <li>仅调整项目清单视觉间距，不影响筛选、未认领、认领和地图模式逻辑。</li>
      </ul>
    `
  },
  {
    version: 'V1.30.0',
    releaseTime: '2026-06-08 23:50',
    title: '项目视频监控直播版',
    content: `
      <p><span class="tag">新增</span><strong>基于视频中心应用新增列表、筛选、地图和监控操作能力。</strong></p>
      <ul>
        <li>视频中心支持项目名称/设备编号模糊搜索；</li>
        <li>新增安装点位类型、在线状态、接入方式多选筛选，并展示选项数量；</li>
        <li>新增列表/地图模式切换，地图模式复用上海市地图撒点能力；</li>
        <li>列表卡片展示摄像头名称、在线状态、稳定在线率、设备编号、点位类型、接入方式；</li>
        <li>新增实时监控和历史回放操作按钮。</li>
      </ul>
    `
  },
  {
    version: 'V1.28.1',
    releaseTime: '2026-06-11 19:30',
    title: '项目清单未认领统计修复',
    content: `
      <p><span class="tag">修复</span><strong>修复项目清单统计行数据与跳转筛选逻辑。</strong></p>
      <ul>
        <li>项目筛选区下方统计行展示“共X个项目，其中Y个项目未被认领”；</li>
        <li>点击统计行后进入未认领项目清单筛选态，仅展示未被认领项目；</li>
        <li>修复统计数据与点击方法未暴露到页面导致无法渲染/无法点击的问题。</li>
      </ul>
    `
  },
      {
        version: 'V1.28.0',
        releaseTime: '2026-06-08 23:20',
        title: '项目清单体验优化版',
        content: `
          <p><span class="tag">优化</span><strong>项目菜单升级为“项目清单”，并优化搜索、统计与卡片视觉。</strong></p>
          <ul>
            <li>项目菜单顶部标题调整为项目清单；</li>
            <li>搜索框提示语调整为项目名称/总包单位/监督单位…，并优化放大镜图标大小；</li>
            <li>地图模式按钮改为全圆角样式；</li>
            <li>筛选条件下新增项目统计行，支持一键进入未认领项目清单；</li>
            <li>项目卡片左侧图标与右侧评分字号同步缩小，整体更紧凑。</li>
          </ul>
        `
      },
      {
        version: 'V1.27.0',
        title: '角色与场景认领功能版',
        releaseTime: '2026-06-08 23:10',
        content: `
          <p><span class="tag">新增</span><strong>我的页面新增“角色&场景认领”入口与独立认领页。</strong></p>
          <ul>
            <li>在“我的”菜单中新增角色&场景认领模块，位置位于版本记录上方；</li>
            <li>新增认领角色分组，支持场景闭环监管负责人/组员二选一单选；</li>
            <li>新增认领场景分组，包含到岗履职、基坑监测、扬尘设备运维、安全穿戴、塔机运行监测、基坑临边防护六个场景；</li>
            <li>选择负责人时自动全选全部场景且不可修改，选择组员时支持多选认领。</li>
          </ul>
        `
      },
      {
        version: 'V1.26.1',
        releaseTime: '2026-06-11 18:30',
        title: '项目菜单稳定重构版',
        content: `
          <p><span class="tag">新增</span><strong>基于 V1.25.2 稳定源码重新开发底部项目菜单。</strong></p>
          <ul>
            <li>底部菜单升级为看板、工作台、项目、我的四等分布局；</li>
            <li>新增项目菜单并进入项目列表页面；</li>
            <li>项目页面支持项目名称模糊搜索、项目等级、管理区域、工地状态、工程类型筛选；</li>
            <li>新增列表/地图模式切换，地图模式采用上海市地图轮廓与项目撒点；</li>
            <li>复用项目清单卡片样式并保持现有工作台、看板、我的和中闭环处置逻辑稳定。</li>
          </ul>
        `
      },
      {
        version: 'V1.25.2',
        releaseTime: '2026-06-09 19:00',
        title: '中闭环处置筛选与切换优化',
        content: `
          <p><span class="tag">优化</span><strong>继续优化中闭环处置应用细节交互。</strong></p>
          <ul>
            <li>右上角状态标签高度收窄，展示更紧凑自然；</li>
            <li>新增场景、是否超期、工地名称筛选，并与列表数据联动；</li>
            <li>顶部中闭环、中闭环预警统计项支持单选切换，按状态展示对应列表。</li>
          </ul>
        `
      },
      {
        version: 'V1.25.1',
        releaseTime: '2026-06-09 18:30',
        title: '中闭环处置应用开发版',
        content: `
          <p><span class="tag">新增</span><strong>按提供设计图还原开发政企协同中闭环处置页面。</strong></p>
          <ul>
            <li>新增中闭环与中闭环预警统计卡片；</li>
            <li>新增筛选区、列表卡片、状态标签、剩余/超期时间提示；</li>
            <li>新增详情、处理操作入口，保持移动端监管风格。</li>
          </ul>
        `
      },
      {
        version: 'V1.25.0',
        releaseTime: '2026-06-09 18:00',
        title: '应用合并与咨询中心紧凑化优化',
        content: `
          <p><span class="tag">升级</span><strong>基于 V1.24.2-FINAL 完成业务处置应用合并、项目入口更名与咨询中心页面压缩优化。</strong></p>
          <ul>
            <li>业务处置分组中“中闭环处置 / 中闭环预警”合并为“中闭环处置”；</li>
            <li>业务处置分组中“小闭环处置 / 小闭环预警”合并为“小闭环管理”，避免因应用数量变化导致宫格渲染异常；</li>
            <li>“项目画像”应用名称调整为“项目清单”，保留进入项目清单与项目详情的原有业务链路；</li>
            <li>咨询中心页面整体改为紧凑布局，搜索、文件列表、服务电话模块在 1000px 高度内完整展示。</li>
          </ul>
        `
      },
      {
        version: 'V1.24.2',
        releaseTime: '2026-06-09 17:35',
        title: '多项目监管看板样式优化版',
        content: `
          <p><span class="tag">优化</span><strong>根据领导认可版看板进行细节样式和交互优化。</strong></p>
          <ul>
            <li>运行中场景、试点中场景、工程巡查管理的统计项左侧对齐到标题文字位置；</li>
            <li>项目等级饼图占比调整为与 A/B/C 项目数量一致，百分比颜色与饼图区块保持一致；</li>
            <li>管理评价分析、预警闭环监管 Tab 支持点击切换，选中金色、未选中灰色；</li>
            <li>保留 V1.24.0 的整体页面结构与已认可视觉方向。</li>
          </ul>
        `
      },
      {
        version: 'V1.24.0',
        releaseTime: '2026-06-09 17:10',
        title: '多项目监管看板开发版',
        content: `
          <p><span class="tag">新增</span><strong>新增底部菜单“看板”页面，按领导已认可设计图完成多项目监管驾驶舱开发。</strong></p>
          <ul>
            <li>新增项目等级分布、30天全市平均分趋势模块；</li>
            <li>新增运行中场景、试点中场景、工程巡查管理统计模块；</li>
            <li>新增监管要素统计、管理评价分析、预警闭环监管模块；</li>
            <li>底部菜单“看板”可直接进入该页面，并保留工作台、我的入口；</li>
            <li>全部数据使用模拟数据，便于后续对接真实接口。</li>
          </ul>
        `
      },
      {
        version: 'V1.23.0',
        releaseTime: '2026-06-09 16:20',
        title: '意见反馈交互优化',
        content: `
          <p><span class="tag">新增</span><strong>我的页面新增意见反馈功能。</strong></p>
          <ul>
            <li>新增反馈类型、反馈描述、上传照片、联系方式等字段；</li>
            <li>反馈类型支持功能建议、bug上报、体验优化、其他；</li>
            <li>反馈描述最多输入500字；</li>
            <li>上传照片最多4张，支持图片预览和删除；</li>
            <li>联系方式自动带出并支持修改；</li>
            <li>提交后生成反馈记录并跳转意见反馈历史列表。</li>
          </ul>
        `
      },
      {
        version: 'V1.15.0',
        releaseTime: '2026-06-08 20:10',
        title: '统一 SVG 图标库升级版',
        content: `
          <p><span class="tag">升级</span><strong>工作台与“我的应用编辑页”彻底升级为统一 SVG 图标库。</strong></p>
          <ul>
            <li>新增 assets/icons SVG 图标资源库，覆盖业务处置、业务评价管理、监管要素、业务分析报表四大分组；</li>
            <li>工作台应用入口由 class 样式图标改为真实 SVG 图标资源；</li>
            <li>“我的应用编辑页”的已选择应用、可选应用同步使用同一套 SVG 图标；</li>
            <li>保留“项目画像”进入项目清单、项目详情的业务承接逻辑；</li>
            <li>当前版本同步更新为 V1.14.0。</li>
          </ul>
        `
      },
      {
        version: 'V1.13.2',
        releaseTime: '2026-06-08 19:20',
        title: 'PNG应用图标体系升级版',
        content: `
          <p><span class="tag">修复</span><strong>修复项目画像未承接项目清单入口的问题。</strong></p>
          <ul>
            <li>点击工作台“项目画像”后直接进入项目清单页面；</li>
            <li>项目清单中的项目卡片仍可继续进入项目详情；</li>
            <li>保留原“工地清单”兼容入口逻辑，避免历史数据异常；</li>
            <li>当前版本同步更新为 V1.13.2。</li>
          </ul>
        `
      },
      {
        version: 'V1.13.0',
        releaseTime: '2026-06-08 18:30',
        title: '应用图标体系升级版',
        content: `
          <p><span class="tag">优化</span><strong>工作台与我的应用编辑页图标体系统一升级。</strong></p>
          <ul>
            <li>业务处置、业务评价管理、监管要素、业务分析报表四类应用采用统一圆角渐变图标；</li>
            <li>中闭环处置、中闭环预警、小闭环监管、小闭环预警等应用图标按业务语义重新设计；</li>
            <li>视频中心、人员清单、塔机管理、扬尘设备管理、基坑管理等监管要素图标完成替换；</li>
            <li>到岗履职、塔机监测、塔机安拆、更多报表等分析类图标完成替换；</li>
            <li>版本记录同步更新为 V1.13.0。</li>
          </ul>
        `
      },
      {
        version: 'V1.12.0',
        releaseTime: '2026-06-08 18:00',
        title: '我的应用编辑交互优化版',
        content: `
          <p><span class="tag">新增</span><strong>新增完整的我的应用选择页面。</strong></p>
          <ul>
            <li>点击工作台“我的应用-编辑”进入独立应用选择页；</li>
            <li>页面分为已选择应用、可选应用、底部取消/保存操作区；</li>
            <li>可选应用新增业务处置、业务评价管理、监管要素、业务分析报表四个分组；</li>
            <li>支持点击加号添加应用，已添加应用展示勾选状态；</li>
            <li>已选择应用支持点击叉号移除，最多三行共12个；</li>
            <li>点击保存后配置生效到工作台，并提示“应用配置完成”；取消后不保存配置。</li>
          </ul>
        `
      },
      {
        version: 'V1.9.1',
        title: '版本记录同步修复版',
        releaseTime: '2026-06-08 17:40',
        content: `
          <p><span class="tag">修复</span><strong>修复“我的-版本记录”内容与实际迭代不一致的问题。</strong></p>
          <ul>
            <li>版本记录按本次对话中的真实升级路径重新整理；</li>
            <li>当前版本统一更新为 V1.9.1；</li>
            <li>修复多条历史记录重复显示为 V1.8.0 的问题；</li>
            <li>补齐 V1.6.0 至 V1.9.0 的关键升级说明，便于后续持续维护。</li>
          </ul>
        `
      },
      {
        version: 'V1.9.0',
        title: '项目详情场景免开通信息增强版',
        releaseTime: '2026-06-08 16:50',
        content: `
          <p><span class="tag">新增</span><strong>项目详情新增“场景免开通信息”分组。</strong></p>
          <ul>
            <li>在项目详情页底部新增场景免开通信息区域；</li>
            <li>仅展示申请通过的免开通场景和视频接入内容；</li>
            <li>支持多次申请结果合并展示，场景与附件按通过记录累加；</li>
            <li>保留证明材料展示，并沿用流程审批附件缩略图与预览交互。</li>
          </ul>
        `
      },
      {
        version: 'V1.8.1',
        title: '项目详情顶部视觉优化版',
        releaseTime: '2026-06-08 16:20',
        content: `
          <p><span class="tag">优化</span><strong>优化项目详情顶部评分与工期展示。</strong></p>
          <ul>
            <li>计划开工日期至计划完工日期调整为工期进度标尺；</li>
            <li>按今日位置展示项目进度百分比；</li>
            <li>综合评分跟随项目等级颜色展示；</li>
            <li>综合评分使用数字感更强的加粗样式，字号提升至 26px。</li>
          </ul>
        `
      },
      {
        version: 'V1.8.0',
        title: '项目详情页面新增版',
        releaseTime: '2026-06-08 15:55',
        content: `
          <p><span class="tag">新增</span><strong>新增项目详情页。</strong></p>
          <ul>
            <li>项目清单任一项目支持点击进入项目详情；</li>
            <li>顶部展示项目名称、计划开完工日期、综合评分、项目等级；</li>
            <li>新增基本信息、管理信息、施工许可证信息、参建单位信息分组；</li>
            <li>施工许可证附件支持缩略图展示和点击预览；</li>
            <li>参建单位展示单位名称与统一社会信用代码。</li>
          </ul>
        `
      },
      {
        version: 'V1.7.1',
        title: '项目清单卡片样式优化版',
        releaseTime: '2026-06-08 15:25',
        content: `
          <p><span class="tag">优化</span><strong>优化项目清单卡片高度与标签样式。</strong></p>
          <ul>
            <li>项目名称和标签行高度关系优化，卡片高度更自然；</li>
            <li>项目名称一行时卡片整体高度降低；</li>
            <li>项目评分字号减小但保持加粗；</li>
            <li>右上角等级色块高度减小，视觉更轻量。</li>
          </ul>
        `
      },
      {
        version: 'V1.7.0',
        title: '项目清单列表新增版',
        releaseTime: '2026-06-08 15:05',
        content: `
          <p><span class="tag">新增</span><strong>新增项目清单列表页面。</strong></p>
          <ul>
            <li>点击工作台“工地清单”应用进入项目清单；</li>
            <li>以卡片形式展示项目名称、评分、等级、管理区域、工地状态、工程类型；</li>
            <li>项目图标根据项目名称首字生成；</li>
            <li>项目评分按 A/B/C 等级展示绿色、橙色、红色；</li>
            <li>顶部新增模糊搜索和项目等级、管理区域、工地状态、工程类型筛选。</li>
          </ul>
        `
      },
      {
        version: 'V1.6.0',
        title: '工作台应用图标与审批信息优化版',
        releaseTime: '2026-06-08 14:30',
        content: `
          <p><span class="tag">优化</span><strong>优化工作台应用图标和流程审批展示。</strong></p>
          <ul>
            <li>“工地清单、小闭环预警、小闭环管理、中闭环预警、中闭环处置”图标升级为统一渐变风格；</li>
            <li>删除工作台页面底部版本信息；</li>
            <li>删除我的页面底部版本信息；</li>
            <li>流程审批“项目管理信息”中，总包单位、建设单位、监理单位增加信用代码展示。</li>
          </ul>
        `
      },
      {
        version: 'V1.5.0',
        title: '住建委项目初始基线版',
        releaseTime: '2026-06-08 13:50',
        content: `
          <p><span class="tag">发布</span><strong>建立住建委项目基线版本。</strong></p>
          <ul>
            <li>确认为后续迭代基线版本 ZJW-20260608-V1.5.0；</li>
            <li>包含工作台、流程审批、我的等基础页面结构；</li>
            <li>后续版本均基于该基线持续升级维护。</li>
          </ul>
        `
      }
    ]);

    const sortedVersionRecords = computed(() => {
      return [...versionRecords.value].sort((a, b) => {
        const timeA = new Date(a.releaseTime.replace(/-/g, '/')).getTime();
        const timeB = new Date(b.releaseTime.replace(/-/g, '/')).getTime();
        return timeB - timeA;
      });
    });

    /**
     * 方法区
     */
    function showToast(message) {
      ElMessage({
        message,
        type: 'info',
        duration: 1500
      });
    }

    function scrollTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    function goHome() {
      currentPage.value = 'home';
      scrollTop();
    }

    function goMine() {
      currentPage.value = 'mine';
      scrollTop();
    }

    function goVersionRecords() {
      currentPage.value = 'version';
      scrollTop();
    }

    function goApproval() {
      currentPage.value = 'approval';
      scrollTop();
    }

    function goProjectStats() {
      setProjectTab('stats');
    }

    function goProjectList() {
      setProjectTab('list');
    }

    function goScanCode() {
      currentPage.value = 'scanCode';
      scrollTop();
    }

    function goNoticeList() {
      currentPage.value = 'noticeList';
      scrollTop();
    }

    function openNoticeDetail(notice) {
      notice.read = true;
      selectedNotice.value = notice;
      currentPage.value = 'noticeDetail';
      scrollTop();
    }

    function previewNoticeAttachment(file) {
      showToast('预览附件：' + file.name);
    }

    function downloadNoticeAttachment(file) {
      showToast('下载附件：' + file.name);
    }

    function openNoticeImagePreview() {
      showToast('已打开公告图片预览');
    }

    function openProjectDetail(project) {
      selectedProject.value = project;
      currentPage.value = 'projectDetail';
      scrollTop();
    }

    function changeBottomNav(key) {
      if (key === 'dashboard') {
        currentPage.value = 'dashboard';
        scrollTop();
        return;
      }

      if (key === 'home') {
        goHome();
        return;
      }

      if (key === 'project') {
        goProjectList();
        return;
      }

      if (key === 'mine') {
        goMine();
        return;
      }
    }

function chooseOrg(org) {
  currentOrg.value = org;
  orgDrawerVisible.value = false;
  showToast('已切换至：' + org);
}

    function goAppSelect() {
      tempSelectedApps.value = appList.value.map(cloneApp);
      currentPage.value = 'appSelect';
      scrollTop();
    }

    function isTempSelected(app) {
      return tempSelectedApps.value.some(item => item.id === app.id);
    }

    function addOptionalApp(app) {
      if (isTempSelected(app)) {
        showToast('该应用已选择');
        return;
      }

      if (tempSelectedApps.value.length >= 12) {
        showToast('最多选择12个应用');
        return;
      }

      tempSelectedApps.value.unshift(cloneApp(app));
    }

    function removeSelectedApp(app) {
      tempSelectedApps.value = tempSelectedApps.value.filter(item => item.id !== app.id);
    }

    function cancelAppConfig() {
      tempSelectedApps.value = appList.value.map(cloneApp);
      goHome();
    }

    function saveAppConfig() {
      appList.value = tempSelectedApps.value.map(cloneApp);
      showToast('应用配置完成');
      goHome();
    }

    function handleAppClick(app) {
      if (app.id === 'scan-code') {
        goScanCode();
        return;
      }

      if (app.id === 'notice-list') {
        goNoticeList();
        return;
      }

      if (app.id === 'middle-loop-manage') {
        goMiddleLoopManage();
        return;
      }

      if (app.id === 'project-claim') {
        goClaimHome();
        return;
      }

      if (app.id === 'project-portrait' || app.name === '项目清单' || app.name === '项目画像' || app.name === '工地清单') {
        goProjectList();
        return;
      }

      if (app.id === 'video-list' || app.name === '视频中心' || app.name === '视频监控清单') {
        goVideoList();
        return;
      }

      if (app.id === 'crane-list' || app.name === '塔机管理' || app.name === '塔机清单' || app.name === '塔基清单') {
        goCraneList();
        return;
      }

      if (app.id === 'dust-list' || app.name === '扬尘设备管理' || app.name === '扬尘设备清单') {
        goDustList();
        return;
      }

      if (app.id === 'pit-list' || app.name === '基坑管理' || app.name === '基坑清单') {
        goPitList();
        return;
      }

      showToast('进入：' + app.name);
    }

    function openTodo(todo) {
      if (todo.type === 'approval') {
        goApproval();
        return;
      }

      showToast('打开待办：' + todo.title);
    }

    function passApproval() {
      approvalFinished.value = true;

      const todo = todoList.value.find(item => item.id === 101);
      if (todo) {
        todo.status = 'done';
      }
const pageTodo = todoPageTasks.value.find(item => item.id === 101);
if (pageTodo) {
  pageTodo.status = 'done';
}

      const currentNode = approvalRecords.value.find(item => item.id === 2);
      if (currentNode) {
        currentNode.handleTime = '2026-06-05 13:58';
        currentNode.handleStatus = '审批通过，流程结束';
        currentNode.statusText = '审批通过';
        currentNode.statusClass = 'done';
      }

      showToast('审批通过，流程已结束');
    }

    function rejectApproval() {
      showToast('演示：可扩展驳回意见弹窗');
    }

function viewAll() {
  if (activeTab.value === 'todo') {
    openTodoListPage();
  } else {
    showToast('进入全部消息通知');
  }
}

function openTodoListPage() {
  currentPage.value = 'todoList';

  if (todoPagePendingList.value.length > 0) {
    todoPageTab.value = 'pending';
  } else {
    todoPageTab.value = 'done';
  }

  scrollTop();
}


    return {
      CURRENT_VERSION,
      currentPage,
      dashboardFactors,
      dashboardBars,
      evaluationTabs,
      evaluationTab,
      currentDashboardBars,
      warningTabs,
      warningTab,
      currentWarningBoxes,

      projectActiveTab,
      projectStatsOverview,
      projectAreaStatCards,
      openProjectStatList,
      showStopProjectTip,
      goProjectStats,
      setProjectTab,

      projectSearch,
      projectSourceOptions,
      projectAreaOptions,
      projectStatusOptions,
      projectTypeOptions,
      projectFilterConfigs,
      projectSelectedTags,
      clearProjectFilter,
      removeProjectFilterTag,
      confirmProjectFilter,
      projectList,
      filteredProjectList,
      projectStatusSummary,
      applyProjectStatusSummary,
      getProjectAreaInitial,
      getProjectAreaIconClass,
      getProjectVideoPointTags,
      getVideoPointTagClass,
      getProjectSceneStatuses,
      filteredProjectTotalCount,
      filteredProjectUnclaimedCount,
      toggleUnclaimedProjectFilter,
      clearProjectAreas,
      claimListedProject,
      projectMapMode,
      projectAggregateMode,
      groupedProjectList,
      collapsedProjectGroups,
      projectFilterVisible,
      projectMapPoints,
      toggleProjectMapMode,
      toggleProjectAggregateMode,
      toggleProjectGroupCollapse,
      isProjectGroupCollapsed,
      selectedProject,
      projectScheduleProgress,
      projectDetailBasicInfo,
      projectDetailManageInfo,
      projectDetailPermitInfo,
      projectDetailCompanies,
      projectApprovedExemptionScenes,
      projectApprovedExemptionVideos,
      projectExemptionMaterials,
      openProjectDetail,

      videoSearch,
      videoMapMode,
      videoAggregateMode,
      collapsedVideoProjects,
      groupedVideoList,
      setVideoAggregateMode,
      toggleVideoProjectCollapse,
      videoFilterVisible,
      videoFilterConfigs,
      videoSelectedTags,
      clearVideoFilter,
      removeVideoFilterTag,
      confirmVideoFilter,
      filteredVideoList,
      filteredVideoTotalCount,
      filteredVideoOfflineCount,
      toggleOfflineVideoFilter,
      videoMapPoints,
      toggleVideoMapMode,
      goVideoList,
      openVideoLive,
      openVideoHistory,
      craneSearch,
      craneMapMode,
      craneAggregateMode,
      collapsedCraneProjects,
      craneFilterVisible,
      craneDeviceList,
      filteredCraneList,
      groupedCraneList,
      setCraneAggregateMode,
      confirmCraneFilter,
      toggleCraneProjectCollapse,
      craneMapPoints,
      toggleCraneMapMode,
      goCraneList,
      selectedCraneDevice,
      dismantleVideoList,
      openCraneInstallVideos,
      openCraneCertificate,
      playCraneInstallVideo,
      dustSearch,
      dustMapMode,
      dustAggregateMode,
      collapsedDustProjects,
      dustDeviceList,
      filteredDustList,
      groupedDustList,
      setDustAggregateMode,
      toggleDustProjectCollapse,
      dustMapPoints,
      toggleDustMapMode,
      goDustList,
      dustAttachmentVisible,
      selectedDustDevice,
      previewDustAttachment,
      pitSearch,
      pitMapMode,
      pitFilterVisible,
      pitFilterConfigs,
      pitProjectList,
      filteredPitList,
      filteredPitTotalCount,
      filteredPitUnclaimedCount,
      filteredPitAreaTotalCount,
      filteredPitRiskCount,
      clearPitFilter,
      confirmPitFilter,
      togglePitUnclaimedFilter,
      togglePitMapMode,
      pitMapPoints,
      goPitList,
      openPitDetail,
      goPitBack,
      selectedPitProject,
      selectedPitAreas,
      selectedPitOrders,
      togglePitAreaCollapse,
      isPitAreaCollapsed,
      getProjectVideoCount,
      getProjectTagClass,
      openProjectVideoLive,
      selectedLiveProject,
      liveProjectDevices,
      activeLiveDeviceId,
      activeLiveDevice,
      selectLiveDevice,

      orgDrawerVisible,
      currentOrg,
      orgList,
      chooseOrg,

      appList,
      tempSelectedApps,
      appGroups,
      isEditingApps,
      claimActiveTab,
      claimSearch,
      claimAreaOptions,
      claimStatusOptions,
      claimTypeOptions,
      claimSourceOptions,
      claimFilterVisible,
      claimFilterConfigs,
      clearClaimFilter,
      confirmClaimFilter,
      filteredUnclaimedProjects,
      filteredClaimedProjects,
      unclaimedProjects,
      claimedProjects,
      unclaimedCount,
      claimRoleInfo,
      claimSelectedProjects,
      claimAvailableProjects,
      claimHistoryList,
      claimedTotalCount,
      goClaimHome,
      goClaimNew,
      goClaimSearch,
      goClaimHistory,
      addClaimProject,
      removeClaimProject,
      cancelNewClaim,
      confirmNewClaim,
      goClaimList,
      claimProject,
      goAppSelect,
      isTempSelected,
      addOptionalApp,
      removeSelectedApp,
      cancelAppConfig,
      saveAppConfig,
      handleAppClick,

      activeTab,
      todoList,
      pendingTodos,
      messageList,
      openTodo,
      viewAll,

      sceneOptions,
      videoOptions,
      projectBaseInfo,
      projectManageInfo,

      approvalFinished,
      approvalRecords,
      passApproval,
      rejectApproval,

      versionRecords,
      sortedVersionRecords,

      goHome,
      goMine,
      goRoleSceneClaim,
      roleClaimOptions,
      sceneClaimOptions,
      roleSceneClaimForm,
      sceneClaimAllSelected,
      selectClaimRole,
      isSceneClaimChecked,
      toggleSceneClaim,
      confirmRoleSceneClaim,
      resetRoleSceneClaim,
      goVersionRecords,
      goApproval,
      goProjectList,
      goMiddleLoopManage,
      changeBottomNav,

approvalTypeOptions,
todoSearch,
todoPageTab,
todoPageTasks,
todoPagePendingList,
todoPageDoneList,
currentTodoPageList,

middleLoopSearch,
middleLoopScenes,
middleLoopSummary,
middleLoopSelectedSummary,
middleLoopSceneFilter,
middleLoopOverdueFilter,
middleLoopProjectFilter,
middleLoopFilterPanel,
middleLoopFilterVisible,
toggleMiddleLoopFilterPanel,
toggleMiddleLoopFilterOption,
resetMiddleLoopFilter,
confirmMiddleLoopFilter,
middleLoopFilterText,
middleLoopOptionCount,
middleLoopFilteredList,
selectMiddleLoopSummary,
startMiddleLoopDisposal,
middleLoopList,
openMiddleLoopDetail,
handleMiddleLoop,

consultTab,
consultSearch,
consultFiles,
filteredConsultFiles,
serviceInfo,
goConsultCenter,
callService,
      
      feedbackTypes,
feedbackForm,
feedbackRecords,
goFeedback,
goFeedbackHistory,
cancelFeedback,
handleFeedbackPhotoChange,
removeFeedbackPhoto,
submitFeedback,

      noticeCategories,
      activeNoticeCategory,
      noticeList,
      filteredNoticeList,
      unreadNoticeCount,
      selectedNotice,
      goScanCode,
      goNoticeList,
      openNoticeDetail,
      previewNoticeAttachment,
      downloadNoticeAttachment,
      openNoticeImagePreview,
      showToast
    };
  }
})
.use(ElementPlus)
.mount('#app');
