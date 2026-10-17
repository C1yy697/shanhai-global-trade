(() => {
  'use strict';

  const STORE_KEY = 'shanhai-global-trade-v1';
  const APP_VERSION = '1.1';
  const STORAGE_VERSION = 2;
  const DOC_KEYS = ['testReport', 'originCert', 'marketLabel', 'qualityCert', 'coldChain'];
  const MARKET_RULES = [
    { id: 'jp-residue', market: '日本', category: '果蔬', name: '农残检测报告', detail: '批次应关联有效的农药残留检测报告。', field: 'testReport', required: true, source: '演示规则' },
    { id: 'jp-origin', market: '日本', category: '通用', name: '原产地证明', detail: '出口批次应关联原产地证明文件。', field: 'originCert', required: true, source: '演示规则' },
    { id: 'jp-label', market: '日本', category: '通用', name: '目标市场标签资料', detail: '应维护目标市场对应的标签文件或审核记录。', field: 'marketLabel', required: true, source: '演示规则' },
    { id: 'eu-residue', market: '欧盟', category: '果蔬', name: '农残检测报告', detail: '批次应关联有效的农药残留检测报告。', field: 'testReport', required: true, source: '演示规则' },
    { id: 'eu-gapseal', market: '欧盟', category: '通用', name: '认证资料', detail: '根据产品与采购要求维护适用认证资料。', field: 'qualityCert', required: true, source: '演示规则' },
    { id: 'eu-trace', market: '欧盟', category: '通用', name: '批次追溯记录', detail: '批次至少应有生产、检测、包装等追溯事件。', field: 'traceEvents', required: true, source: '演示规则' },
    { id: 'asean-origin', market: '东南亚', category: '通用', name: '原产地证明', detail: '按目的地和贸易安排核对原产地资料。', field: 'originCert', required: true, source: '演示规则' },
    { id: 'asean-cold', market: '东南亚', category: '水产', name: '冷链温控记录', detail: '水产品批次应维护运输温控记录。', field: 'coldChain', required: true, source: '演示规则' },
    { id: 'asean-label', market: '东南亚', category: '通用', name: '标签与语言资料', detail: '维护目的地要求的标签版本及语言信息。', field: 'marketLabel', required: true, source: '演示规则' }
  ];
  const seed = {
    version: STORAGE_VERSION,
    batches: [
      { id: 'WZ-YM-26018', product: '温州杨梅', category: '果蔬', origin: '温州市瓯海区', target: '日本', quantity: '860 kg', created: '2026-10-15', status: '准备出运', docs: { testReport: true, originCert: true, marketLabel: false, qualityCert: false, coldChain: false }, events: [
        { type: '采收入库', time: '2026-10-12 08:40', actor: '瓯海果品合作社', note: '批次采收完成，完成入库抽检。' },
        { type: '质量检测', time: '2026-10-13 14:15', actor: '温州农产品检测中心', note: '检测报告已归档，待复核。' },
        { type: '包装加工', time: '2026-10-14 10:30', actor: '鲜途包装服务点', note: '完成分级、预冷及出口包装。' }
      ] },
      { id: 'WZ-HY-26011', product: '大黄鱼', category: '水产', origin: '温州市洞头区', target: '东南亚', quantity: '1,240 kg', created: '2026-10-14', status: '待补材料', docs: { testReport: true, originCert: false, marketLabel: true, qualityCert: true, coldChain: false }, events: [
        { type: '养殖出塘', time: '2026-10-10 06:20', actor: '洞头海洋养殖基地', note: '完成出塘称重，关联养殖水域记录。' },
        { type: '质量检测', time: '2026-10-11 16:00', actor: '温州农产品检测中心', note: '检测结果已归档。' },
        { type: '预冷包装', time: '2026-10-12 09:45', actor: '海鲜冷链加工点', note: '完成预冷和包装，待安排冷链运输。' }
      ] },
      { id: 'WZ-OG-26009', product: '瓯柑', category: '果蔬', origin: '温州市苍南县', target: '欧盟', quantity: '520 kg', created: '2026-10-12', status: '合规复核中', docs: { testReport: true, originCert: true, marketLabel: true, qualityCert: false, coldChain: false }, events: [
        { type: '采收入库', time: '2026-10-08 11:10', actor: '苍南柑橘联合社', note: '批次采收并登记果园信息。' },
        { type: '质量检测', time: '2026-10-09 15:35', actor: '温州农产品检测中心', note: '检测文件已关联至批次。' },
        { type: '包装加工', time: '2026-10-10 13:00', actor: '瓯柑出口包装线', note: '完成规格分级和包装标识。' },
        { type: '单证整理', time: '2026-10-11 09:00', actor: '企业出口专员', note: '正在核对目标市场所需资料。' }
      ] },
      { id: 'WZ-TS-26004', product: '文成高山茶', category: '加工食品', origin: '温州市文成县', target: '日本', quantity: '180 kg', created: '2026-10-09', status: '已归档', docs: { testReport: true, originCert: true, marketLabel: true, qualityCert: true, coldChain: false }, events: [
        { type: '原料入库', time: '2026-10-04 08:00', actor: '文成茶业合作社', note: '原料批次登记。' },
        { type: '加工完成', time: '2026-10-05 17:20', actor: '文成茶叶加工厂', note: '加工批次及包装号已登记。' },
        { type: '检测归档', time: '2026-10-06 15:10', actor: '第三方检测机构', note: '检测资料已关联。' },
        { type: '出运归档', time: '2026-10-08 10:20', actor: '企业出口专员', note: '本批次资料归档。' }
      ] }
    ],
    enabledRules: Object.fromEntries(MARKET_RULES.map(r => [r.id, true]))
  };

  const titles = { dashboard: '工作台', batches: '产品批次', compliance: '合规校验', trace: '追溯查询', rules: '市场规则', settings: '数据与设置' };
  let state = loadState();
  let currentPage = pageFromHash();
  let selectedBatchId = state.batches[0]?.id || '';
  let searchTerm = '';
  let batchFilter = '全部状态';
  let marketFilter = '';

  function clone(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeBatch(batch) {
    const item = batch && typeof batch === 'object' ? batch : {};
    return {
      id: String(item.id || '').trim(),
      product: String(item.product || '').trim(),
      category: item.category || '果蔬',
      origin: String(item.origin || '').trim(),
      target: item.target || '日本',
      quantity: String(item.quantity || '').trim(),
      created: item.created || new Date().toISOString().slice(0, 10),
      status: item.status || '待补材料',
      docs: Object.fromEntries(DOC_KEYS.map(key => [key, item.docs?.[key] === true])),
      events: Array.isArray(item.events) ? item.events.filter(event => event && typeof event === 'object') : []
    };
  }

  function normalizeState(parsed) {
    if (!parsed || !Array.isArray(parsed.batches)) return clone(seed);
    return {
      version: STORAGE_VERSION,
      batches: parsed.batches.map(normalizeBatch).filter(batch => batch.id),
      enabledRules: { ...seed.enabledRules, ...(parsed.enabledRules || {}) }
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return clone(seed);
      const parsed = JSON.parse(raw);
      if (![1, STORAGE_VERSION].includes(parsed?.version)) return clone(seed);
      return normalizeState(parsed);
    } catch (_) { return clone(seed); }
  }

  function saveState() {
    state.version = STORAGE_VERSION;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (_) {
      toast('当前浏览器无法保存本地数据，请导出 JSON 备份');
    }
    updateBatchCount();
  }

  function pageFromHash() {
    const page = window.location.hash.replace(/^#/, '');
    return titles[page] ? page : 'dashboard';
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function toast(message) {
    const root = document.getElementById('toast-root');
    const item = document.createElement('div');
    item.className = 'toast';
    item.textContent = message;
    root.append(item);
    setTimeout(() => item.remove(), 3000);
  }

  function updateBatchCount() {
    const el = document.getElementById('batch-nav-count');
    if (el) el.textContent = state.batches.length;
  }

  function setPage(page, syncHash = true) {
    currentPage = titles[page] ? page : 'dashboard';
    if (syncHash && window.location.hash !== `#${currentPage}`) window.history.replaceState(null, '', `#${currentPage}`);
    document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === currentPage));
    document.getElementById('page-crumb').textContent = titles[currentPage];
    document.getElementById('sidebar').classList.remove('open');
    render();
  }

  function pageHeading(title, subtitle, actions = '') {
    return `<div class="page-heading"><div><div class="eyebrow">Wenzhou · Export operations</div><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div><div class="heading-actions">${actions}</div></div>`;
  }

  function statusTag(text) {
    const cls = text === '已归档' || text === '已通过' ? 'ok' : text === '待补材料' || text === '准备出运' ? 'warn' : text === '不通过' ? 'bad' : 'info';
    return `<span class="status ${cls}">${esc(text)}</span>`;
  }

  function batchRow(batch) {
    const docs = Object.values(batch.docs || {}).filter(Boolean).length;
    const total = Object.keys(batch.docs || {}).length;
    return `<tr>
      <td><span class="cell-primary">${esc(batch.id)}</span><span class="cell-secondary">${esc(batch.created)}</span></td>
      <td><span class="cell-primary">${esc(batch.product)}</span><span class="cell-secondary">${esc(batch.category)}</span></td>
      <td>${esc(batch.origin)}</td><td>${esc(batch.target)}</td><td>${esc(batch.quantity)}</td>
      <td>${docs}/${total} 份</td><td>${statusTag(batch.status)}</td>
      <td><button class="table-action" data-action="open-batch" data-id="${esc(batch.id)}">查看</button></td>
    </tr>`;
  }

  function tableMarkup(items, empty = '暂无批次记录') {
    if (!items.length) return `<div class="empty-state"><strong>${empty}</strong><p>调整筛选条件，或新增一条产品批次记录。</p></div>`;
    return `<div class="table-wrap"><table><thead><tr><th>批次编号</th><th>产品</th><th>产地</th><th>目标市场</th><th>数量</th><th>资料</th><th>状态</th><th>操作</th></tr></thead><tbody>${items.map(batchRow).join('')}</tbody></table></div>`;
  }

  function dashboard() {
    const pending = state.batches.filter(b => ['待补材料', '合规复核中', '准备出运'].includes(b.status)).length;
    const docRate = Math.round(state.batches.reduce((sum, b) => sum + Object.values(b.docs || {}).filter(Boolean).length, 0) / Math.max(1, state.batches.reduce((sum, b) => sum + Object.keys(b.docs || {}).length, 0)) * 100);
    const batches = [...state.batches].sort((a, b) => b.created.localeCompare(a.created)).slice(0, 4);
    const months = ['5月', '6月', '7月', '8月', '9月', '10月'];
    const exports = [31, 48, 43, 66, 73, Math.min(92, 34 + state.batches.length * 12)];
    const checks = [22, 32, 40, 51, 58, Math.min(84, 25 + state.batches.length * 10)];
    const chart = months.map((m, i) => `<div class="chart-col"><div class="bar-group"><span class="bar" style="height:${exports[i]}%" title="出口批次 ${exports[i]}"></span><span class="bar secondary" style="height:${checks[i]}%" title="完成校验 ${checks[i]}"></span></div><span class="chart-label">${m}</span></div>`).join('');
    return `${pageHeading('上午好，工作组', '这里汇总温州农产品出口批次与资料准备进度。', '<button class="button" data-action="export-csv">⇩ 导出批次</button><button class="button primary" data-action="new-batch">＋ 新建批次</button>')}
      <section class="metrics-grid">
        <article class="metric-card"><div class="metric-top"><span>管理中批次</span><span class="metric-icon">▤</span></div><div class="metric-value">${state.batches.length}</div><div class="metric-foot"><strong>+2</strong> 本月新增</div></article>
        <article class="metric-card"><div class="metric-top"><span>待处理事项</span><span class="metric-icon" style="background:var(--amber-soft);color:var(--amber)">!</span></div><div class="metric-value">${pending}</div><div class="metric-foot">材料与市场规则待复核</div></article>
        <article class="metric-card"><div class="metric-top"><span>资料归集率</span><span class="metric-icon" style="background:var(--blue-soft);color:var(--blue)">↗</span></div><div class="metric-value">${docRate}<small style="font-size:13px">%</small></div><div class="metric-foot">已登记材料 / 应登记字段</div></article>
        <article class="metric-card"><div class="metric-top"><span>服务目标市场</span><span class="metric-icon" style="background:#f5efe5;color:#a2702d">◎</span></div><div class="metric-value">3</div><div class="metric-foot">日本 · 欧盟 · 东南亚</div></article>
      </section>
      <section class="dashboard-grid">
        <article class="panel"><div class="panel-heading"><div><h2>出口批次与校验进度</h2><p>近 6 个月业务记录概览</p></div><div class="chart-legend"><span><i class="legend-swatch"></i>出口批次</span><span><i class="legend-swatch secondary"></i>完成校验</span></div></div><div class="chart">${chart}</div><div class="chart-note">展示本地演示数据，不代表真实海关或交易统计。</div></article>
        <article class="panel"><div class="panel-heading"><div><h2>需要关注</h2><p>优先补齐影响出运准备的资料</p></div><button class="text-button" data-page="compliance">打开校验 →</button></div><div class="attention-list">${attentionItems()}</div></article>
      </section>
      <section class="panel table-panel"><div class="panel-heading"><div><h2>近期批次</h2><p>最近更新的出口准备记录</p></div><button class="text-button" data-page="batches">查看全部 →</button></div>${tableMarkup(batches)}</section>`;
  }

  function attentionItems() {
    const items = [];
    for (const batch of state.batches) {
      const results = evaluate(batch);
      const missing = results.filter(r => r.state !== 'ok');
      if (missing.length) items.push({ batch, rule: missing[0] });
    }
    if (!items.length) return `<div class="empty-state"><strong>当前没有待处理事项</strong><p>批次资料状态良好。</p></div>`;
    return items.slice(0, 4).map(({ batch, rule }, i) => `<div class="attention-item"><span class="attention-marker ${rule.state === 'miss' ? 'red' : i === 0 ? '' : 'blue'}"></span><div><strong>${esc(rule.name)}待核验</strong><small>${esc(batch.id)} · ${esc(batch.product)} · ${esc(rule.detail)}</small></div><span class="attention-date">${esc(batch.target)}</span></div>`).join('');
  }

  function batchesPage() {
    let items = [...state.batches];
    if (batchFilter !== '全部状态') items = items.filter(b => b.status === batchFilter);
    if (marketFilter) items = items.filter(b => b.target === marketFilter);
    if (searchTerm) items = items.filter(b => [b.id, b.product, b.category, b.origin, b.target].some(x => String(x).toLowerCase().includes(searchTerm.toLowerCase())));
    items.sort((a, b) => b.created.localeCompare(a.created));
    return `${pageHeading('产品批次', '集中维护农产品出口批次、目标市场和随附资料。', '<button class="button" data-action="export-csv">⇩ 导出 CSV</button><button class="button primary" data-action="new-batch">＋ 新建批次</button>')}
      <div class="toolbar"><label class="search-control"><span>⌕</span><input id="batch-search" value="${esc(searchTerm)}" placeholder="搜索编号、产品、产地"></label><select id="batch-filter" class="control select-control"><option>全部状态</option>${['准备出运','待补材料','合规复核中','已归档'].map(s => `<option ${batchFilter === s ? 'selected' : ''}>${s}</option>`).join('')}</select><select id="market-filter" class="control select-control"><option value="">全部市场</option>${['日本','欧盟','东南亚'].map(s => `<option value="${s}" ${marketFilter === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <section class="panel table-panel">${tableMarkup(items)}<div class="table-meta"><span>共 ${items.length} 个批次</span><span>数据保存在当前浏览器</span></div></section>`;
  }

  function getBatch(id) { return state.batches.find(b => b.id === id) || state.batches[0]; }

  function rulesFor(batch, market = batch?.target) {
    return MARKET_RULES.filter(r => state.enabledRules[r.id] !== false && r.market === market && (r.category === '通用' || !batch || r.category === batch.category));
  }

  function evaluate(batch, market = batch?.target) {
    if (!batch) return [];
    return rulesFor(batch, market).map(rule => {
      let exists = false;
      if (rule.field === 'traceEvents') exists = (batch.events || []).length >= 2;
      else exists = Boolean(batch.docs?.[rule.field]);
      return { ...rule, state: exists ? 'ok' : 'miss', message: exists ? '已登记资料' : '缺少资料或尚未确认' };
    });
  }

  function compliancePage() {
    const batch = getBatch(selectedBatchId);
    if (!batch) return `${pageHeading('合规校验', '根据演示规则核对批次资料完整度。')}<div class="panel empty-state"><strong>暂无批次</strong><p>先新增产品批次，再执行资料校验。</p></div>`;
    const market = document.getElementById('compliance-market')?.value || batch.target;
    const results = evaluate(batch, market);
    const missing = results.filter(r => r.state !== 'ok').length;
    const total = results.length;
    return `${pageHeading('合规校验', '按目标市场查看资料完整度；校验结果仅供业务准备参考。', '<button class="button" data-action="print">打印本页</button>')}
      <section class="panel" style="margin-bottom:14px"><div class="batch-selector"><div class="field"><label class="field-label" for="compliance-batch">出口批次</label><select class="control" id="compliance-batch" style="width:100%">${state.batches.map(b => `<option value="${esc(b.id)}" ${b.id === batch.id ? 'selected' : ''}>${esc(b.id)} · ${esc(b.product)}</option>`).join('')}</select></div><div class="field"><label class="field-label" for="compliance-market">目标市场</label><select class="control" id="compliance-market" style="width:100%">${['日本','欧盟','东南亚'].map(m => `<option ${m === market ? 'selected' : ''}>${m}</option>`).join('')}</select></div><button class="button primary" data-action="run-check">重新校验</button></div></section>
      <div class="split-layout"><section class="panel"><div class="panel-heading"><div><h2>${esc(market)} · 资料检查清单</h2><p>${esc(batch.product)} / ${esc(batch.id)} · 命中 ${total} 条已启用演示规则</p></div><span class="status ${missing ? 'warn' : 'ok'}">${missing ? '待补资料' : '资料齐全'}</span></div><div class="rule-list">${results.map(r => `<div class="rule-result"><div><strong>${esc(r.name)}</strong><small>${esc(r.detail)}</small><small>规则来源：${esc(r.source)} · 规则编号：${esc(r.id)}</small></div>${statusTag(r.message)}</div>`).join('') || '<div class="empty-state"><strong>该市场暂无启用规则</strong><p>请在市场规则页维护演示规则。</p></div>'}</div></section>
      <aside class="panel"><h2 style="font-size:13px;margin-bottom:5px">校验摘要</h2><p style="font-size:10px;color:var(--muted);margin-bottom:0">基于批次已登记字段进行确定性检查。</p><div class="result-summary ${missing ? 'warn' : 'ok'}"><span class="result-count">${total - missing}/${total}</span><span><strong>${missing ? `${missing} 项需要处理` : '当前清单已齐全'}</strong><small>清单完成数 / 命中规则数</small></span></div><div class="source-note">此页面使用本地示例规则，不代表海关、检验检疫或认证机构的正式判断。正式业务应由责任人员依据目标市场官方现行要求复核。</div><div style="margin-top:14px"><button class="button" data-action="edit-batch" data-id="${esc(batch.id)}">维护批次资料</button></div></aside></div>`;
  }

  function tracePage() {
    const batch = getBatch(selectedBatchId);
    if (!batch) return `${pageHeading('追溯查询', '按批次查看农产品在采收、加工、检测及物流环节的记录。')}<div class="panel empty-state"><strong>暂无可查询批次</strong></div>`;
    const events = [...(batch.events || [])].sort((a, b) => a.time.localeCompare(b.time));
    return `${pageHeading('追溯查询', '查看批次环节记录和相关责任主体。', '<button class="button primary" data-action="new-event" data-id="'+esc(batch.id)+'">＋ 添加事件</button>')}
      <section class="panel" style="margin-bottom:14px"><div class="batch-selector"><div class="field"><label class="field-label" for="trace-batch">选择批次</label><select class="control" id="trace-batch" style="width:100%">${state.batches.map(b => `<option value="${esc(b.id)}" ${b.id === batch.id ? 'selected' : ''}>${esc(b.id)} · ${esc(b.product)}</option>`).join('')}</select></div><div class="source-note" style="flex:2">${esc(batch.product)} · ${esc(batch.origin)} · ${esc(batch.quantity)} · 目标市场：${esc(batch.target)}</div></div></section>
      <div class="split-layout"><section class="panel"><div class="panel-heading"><div><h2>批次事件</h2><p>${events.length} 条已登记记录，按时间顺序展示</p></div><span class="status info">${esc(batch.id)}</span></div><div class="timeline">${events.map((e, i) => `<div class="timeline-event ${i === events.length - 1 ? 'pending' : ''}"><span class="timeline-dot"></span><div class="timeline-body"><strong>${esc(e.type)}</strong><p>${esc(e.note)}</p><small>${esc(e.actor)}</small></div><span class="attention-date">${esc(e.time)}</span></div>`).join('') || '<div class="empty-state"><strong>尚未添加事件</strong><p>为该批次登记生产、检测、包装或物流事件。</p></div>'}</div></section>
      <aside class="panel"><h2 style="font-size:13px">批次卡片</h2><div class="rule-list"><div class="rule-result"><div><strong>产品</strong><small>${esc(batch.product)} · ${esc(batch.category)}</small></div></div><div class="rule-result"><div><strong>产地</strong><small>${esc(batch.origin)}</small></div></div><div class="rule-result"><div><strong>目标市场</strong><small>${esc(batch.target)}</small></div></div><div class="rule-result"><div><strong>当前状态</strong><small>${esc(batch.status)}</small></div></div></div><div class="source-note">追溯记录为本地演示数据，由当前浏览器保存；本版本不提供区块链存证或官方溯源认证。</div></aside></div>`;
  }

  function rulesPage() {
    const groups = [
      { market: '日本', label: 'JP', desc: '日本市场资料准备清单', color: 'background:var(--red-soft);color:var(--red)' },
      { market: '欧盟', label: 'EU', desc: '欧盟市场资料准备清单', color: 'background:var(--blue-soft);color:var(--blue)' },
      { market: '东南亚', label: 'SEA', desc: '东南亚市场资料准备清单', color: 'background:var(--amber-soft);color:var(--amber)' }
    ];
    return `${pageHeading('市场规则', '维护平台演示用的资料检查项，实际标准需由业务人员核验。', '<button class="button" data-action="reset-rules">恢复默认规则</button>')}
      <div class="source-note" style="margin-bottom:14px">以下规则仅演示规则维护与匹配流程，不构成法律、检验检疫或认证意见。启用/停用会影响合规校验清单。</div><section class="rule-card-grid">${groups.map(g => {
        const rules = MARKET_RULES.filter(r => r.market === g.market);
        const enabled = rules.filter(r => state.enabledRules[r.id] !== false).length;
        return `<article class="panel market-card"><div class="market-top"><span class="market-flag" style="${g.color}">${g.label}</span><span class="status info">${enabled}/${rules.length} 已启用</span></div><h3>${g.market}</h3><p>${g.desc}</p><div class="rule-list">${rules.map(r => `<div class="rule-line"><div><strong>${esc(r.name)}</strong><small>${esc(r.category)} · ${esc(r.detail)}</small></div><span class="attention-date">${esc(r.source)}</span><span class="status ${state.enabledRules[r.id] === false ? '' : 'ok'}">${state.enabledRules[r.id] === false ? '停用' : '启用'}</span><button class="switch ${state.enabledRules[r.id] === false ? '' : 'on'}" role="switch" aria-checked="${state.enabledRules[r.id] !== false}" aria-label="切换${esc(r.name)}" data-action="toggle-rule" data-id="${esc(r.id)}"></button></div>`).join('')}</div></article>`;
      }).join('')}</section>`;
  }

  function settingsPage() {
    const bytes = new Blob([JSON.stringify(state)]).size;
    return `${pageHeading('数据与设置', '查看本地演示空间的数据保存方式及申报前注意事项。', '<button class="button" data-action="export-backup">⇩ 导出 JSON 备份</button>')}
      <section class="settings-grid"><article class="panel"><h2>本地数据</h2><p>批次和规则配置保存在当前浏览器的 localStorage 中，不会上传到服务器。不同浏览器或设备之间不会自动同步。</p><div class="source-note">当前记录：${state.batches.length} 个批次 · 数据体积约 ${Math.ceil(bytes / 1024)} KB</div><div style="margin-top:13px;display:flex;gap:8px"><button class="button" data-action="import-backup">导入 JSON</button><button class="button danger" data-action="clear-data">恢复演示数据</button><input type="file" id="import-file" accept="application/json" hidden></div></article>
      <article class="panel"><h2>软件版本</h2><p><strong>山海鲜途·全球通农产品出海智能赋能平台 V${APP_VERSION}</strong><br>浏览器端单机演示版，采用 HTML、CSS 与原生 JavaScript 编写。适用于流程演示和源码审阅。</p><div class="source-note">本版本没有服务端账号体系、云端数据库、真实外贸接口或区块链存证。正式业务上线前需要安全、数据合规及规则内容评审。</div></article>
      <article class="panel"><h2>著作权登记准备</h2><p>登记申请材料应与实际完成的软件版本一致。源码、说明书、版本信息、开发完成日期、权利人及开发者信息须依据真实情况确认。</p><button class="button" data-action="show-help">查看准备事项</button></article>
      <article class="panel"><h2>演示规则声明</h2><p>目标市场规则为演示数据，用于展示规则启停和批次资料检查。它们没有经过官方法规数据库校验，不应据此判断真实出口合规性。</p></article></section>`;
  }

  function render() {
    const root = document.getElementById('page-content');
    const pages = { dashboard, batches: batchesPage, compliance: compliancePage, trace: tracePage, rules: rulesPage, settings: settingsPage };
    root.innerHTML = pages[currentPage]();
    updateBatchCount();
  }

  function openBatchModal(batch = null) {
    const editing = Boolean(batch);
    const b = batch || { product: '', category: '果蔬', origin: '', target: '日本', quantity: '', id: '', docs: {} };
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" data-action="close-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="batch-modal-title"><div class="modal-header"><div><h2 id="batch-modal-title">${editing ? '维护出口批次' : '新建出口批次'}</h2><p>登记产品基础信息和随附资料状态。</p></div><button class="icon-button" data-action="close-modal" title="关闭" aria-label="关闭">×</button></div><form id="batch-form"><div class="modal-body"><div class="form-row"><div class="field"><label class="field-label" for="batch-id">批次编号</label><input id="batch-id" name="id" required value="${esc(b.id)}" placeholder="例如 WZ-YM-26019" ${editing ? 'readonly' : ''}></div><div class="field"><label class="field-label" for="batch-product">产品名称</label><input id="batch-product" name="product" required value="${esc(b.product)}" placeholder="例如 温州杨梅"></div></div><div class="form-row"><div class="field"><label class="field-label" for="batch-category">产品类别</label><select id="batch-category" name="category"><option ${b.category === '果蔬' ? 'selected' : ''}>果蔬</option><option ${b.category === '水产' ? 'selected' : ''}>水产</option><option ${b.category === '加工食品' ? 'selected' : ''}>加工食品</option><option ${b.category === '畜禽产品' ? 'selected' : ''}>畜禽产品</option></select></div><div class="field"><label class="field-label" for="batch-market">目标市场</label><select id="batch-market" name="target">${['日本','欧盟','东南亚'].map(m => `<option ${b.target === m ? 'selected' : ''}>${m}</option>`).join('')}</select></div></div><div class="form-row"><div class="field"><label class="field-label" for="batch-origin">产地</label><input id="batch-origin" name="origin" required value="${esc(b.origin)}" placeholder="县区 / 基地"></div><div class="field"><label class="field-label" for="batch-quantity">批次数量</label><input id="batch-quantity" name="quantity" required value="${esc(b.quantity)}" placeholder="数量及单位"></div></div><div class="field"><span class="field-label">已归档资料</span><div class="form-row">${[['testReport','检测报告'],['originCert','原产地证明'],['marketLabel','市场标签资料'],['qualityCert','认证资料'],['coldChain','冷链记录']].map(([key, label]) => `<label style="display:flex;align-items:center;gap:7px;font-size:10px;color:#536158"><input type="checkbox" name="doc-${key}" ${b.docs?.[key] ? 'checked' : ''}>${label}</label>`).join('')}</div></div></div><div class="modal-footer"><button type="button" class="button" data-action="close-modal">取消</button><button class="button primary" type="submit">保存批次</button></div></form></section></div>`;
    document.getElementById('batch-form').addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const docs = Object.fromEntries(DOC_KEYS.map(k => [k, form.has(`doc-${k}`)]));
      const saved = { id: String(form.get('id')).trim(), product: String(form.get('product')).trim(), category: form.get('category'), origin: String(form.get('origin')).trim(), target: form.get('target'), quantity: String(form.get('quantity')).trim(), created: editing ? b.created : new Date().toISOString().slice(0,10), status: '待补材料', docs, events: editing ? (b.events || []) : [] };
      const index = state.batches.findIndex(x => x.id === saved.id);
      if (!editing && index >= 0) {
        toast('批次编号已存在，请更换编号');
        return;
      }
      if (index >= 0) { state.batches[index] = { ...state.batches[index], ...saved }; toast('批次资料已更新'); }
      else { state.batches.unshift(saved); selectedBatchId = saved.id; toast('批次已创建'); }
      state.batches.forEach(x => { if (!evaluate(x).some(r => r.state !== 'ok') && x.status !== '已归档') x.status = '合规复核中'; });
      saveState();
      document.getElementById('modal-root').innerHTML = '';
      render();
    });
  }

  function openEventModal(batch) {
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>新增追溯事件</h2><p>${esc(batch.id)} · ${esc(batch.product)}</p></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div><form id="event-form"><div class="modal-body"><div class="form-row"><div class="field"><label class="field-label" for="event-type">事件类型</label><select id="event-type" name="type"><option>生产/采收</option><option>加工包装</option><option>质量检测</option><option>仓储交接</option><option>物流运输</option><option>通关出运</option></select></div><div class="field"><label class="field-label" for="event-actor">责任主体</label><input id="event-actor" name="actor" required placeholder="填写企业或服务方"></div></div><div class="field"><label class="field-label" for="event-note">事件说明</label><textarea id="event-note" name="note" required placeholder="记录本环节信息"></textarea></div></div><div class="modal-footer"><button type="button" class="button" data-action="close-modal">取消</button><button class="button primary" type="submit">保存事件</button></div></form></section></div>`;
    document.getElementById('event-form').addEventListener('submit', e => {
      e.preventDefault(); const data = new FormData(e.currentTarget);
      batch.events.push({ type: data.get('type'), actor: String(data.get('actor')).trim(), note: String(data.get('note')).trim(), time: new Date().toLocaleString('sv-SE').slice(0,16) });
      saveState(); document.getElementById('modal-root').innerHTML = ''; render(); toast('追溯事件已记录');
    });
  }

  function exportCsv() {
    const rows = [['批次编号','产品','类别','产地','目标市场','数量','创建日期','状态','已登记资料'], ...state.batches.map(b => [b.id,b.product,b.category,b.origin,b.target,b.quantity,b.created,b.status,`${Object.values(b.docs || {}).filter(Boolean).length}/${Object.keys(b.docs || {}).length}`])];
    const csv = '\ufeff' + rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    download(csv, '山海鲜途_批次清单.csv', 'text/csv;charset=utf-8');
  }

  function download(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBackup() { download(JSON.stringify(state, null, 2), '山海鲜途_数据备份.json', 'application/json'); toast('数据备份已导出'); }

  function showHelp() {
    document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true"><div class="modal-header"><div><h2>平台说明</h2><p>山海鲜途·全球通农产品出海智能赋能平台 V${APP_VERSION}</p></div><button class="icon-button" data-action="close-modal" aria-label="关闭">×</button></div><div class="modal-body"><p style="font-size:11px;line-height:1.8;color:#59665f">本软件演示农产品出口批次管理、资料清单校验、市场规则启停及追溯事件记录。演示数据保存在当前浏览器，不会发送至服务器。</p><div class="source-note">页面内市场规则均为示例内容，不构成对真实出口合规要求的判断。本版本没有连接海关、跨境电商、物流、区块链或官方检测系统。</div><p style="font-size:10px;color:#7b8780;margin:13px 0 0">登记申请前请确认软件版本、著作权人、开发者、完成日期和源程序材料与实际情况一致。</p></div></section></div>`;
  }

  function handleAction(action, target) {
    const id = target.dataset.id;
    if (action === 'new-batch') openBatchModal();
    else if (action === 'open-batch' || action === 'edit-batch') {
      selectedBatchId = id; openBatchModal(getBatch(id));
    } else if (action === 'new-event') openEventModal(getBatch(id));
    else if (action === 'close-modal') document.getElementById('modal-root').innerHTML = '';
    else if (action === 'export-csv') exportCsv();
    else if (action === 'export-backup') exportBackup();
    else if (action === 'print') window.print();
    else if (action === 'run-check') { toast('校验已根据当前演示规则刷新'); render(); }
    else if (action === 'toggle-rule') { state.enabledRules[id] = state.enabledRules[id] === false; saveState(); render(); toast('规则状态已更新'); }
    else if (action === 'reset-rules') { state.enabledRules = { ...seed.enabledRules }; saveState(); render(); toast('规则已恢复为演示默认值'); }
    else if (action === 'show-help' || action === 'help-button') showHelp();
    else if (action === 'clear-data') { state = clone(seed); saveState(); render(); toast('已恢复演示数据'); }
    else if (action === 'import-backup') document.getElementById('import-file').click();
    else if (action === 'close-backdrop' && target.classList.contains('modal-backdrop')) document.getElementById('modal-root').innerHTML = '';
  }

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-page]');
    if (nav) { setPage(nav.dataset.page); return; }
    const action = event.target.closest('[data-action]');
    if (action) { handleAction(action.dataset.action, action); return; }
    if (event.target.id === 'help-button') showHelp();
  });

  document.addEventListener('change', event => {
    if (event.target.id === 'batch-filter') { batchFilter = event.target.value; render(); }
    if (event.target.id === 'market-filter') {
      marketFilter = event.target.value;
      render();
    }
    if (event.target.id === 'compliance-batch') { selectedBatchId = event.target.value; render(); }
    if (event.target.id === 'compliance-market') render();
    if (event.target.id === 'trace-batch') { selectedBatchId = event.target.value; render(); }
    if (event.target.id === 'import-file' && event.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (![1, STORAGE_VERSION].includes(imported?.version) || !Array.isArray(imported.batches)) throw new Error('文件格式不匹配');
          if (imported.batches.length > 5000) throw new Error('批次数量超过 5000 条限制');
          state = normalizeState(imported);
          saveState(); render(); toast('数据备份已导入');
        } catch (err) { toast(`导入失败：${err.message}`); }
        event.target.value = '';
      };
      reader.readAsText(event.target.files[0]);
    }
  });

  document.addEventListener('input', event => {
    if (event.target.id === 'batch-search') {
      searchTerm = event.target.value;
      const start = event.target.selectionStart;
      render();
      const next = document.getElementById('batch-search'); next?.focus(); next?.setSelectionRange(start, start);
    }
  });

  document.getElementById('menu-toggle').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
  document.getElementById('export-backup').addEventListener('click', exportBackup);
  document.getElementById('help-button').addEventListener('click', showHelp);
  document.getElementById('global-search').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      searchTerm = event.target.value.trim();
      setPage('batches');
      const box = document.getElementById('batch-search'); if (box) box.value = searchTerm;
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.getElementById('global-search').focus(); }
    if (event.key === 'Escape') { document.getElementById('modal-root').innerHTML = ''; document.getElementById('sidebar').classList.remove('open'); }
  });

  window.addEventListener('hashchange', () => setPage(pageFromHash(), false));

  updateBatchCount();
  setPage(currentPage, false);
})();
