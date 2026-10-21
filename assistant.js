(() => {
  const $ = selector => document.querySelector(selector);
  const root = $('#agent-messages');
  const input = $('#agent-input');
  const storageKey = 'shanhai-assistant-conversations-v3';
  const sample = {
    id: 'sample-export-readiness',
    title: '文成粉丝出海资料准备',
    sample: true,
    product: '文成粉丝',
    market: '新加坡',
    stage: '资料整理',
    messages: [
      { role: 'user', text: '想把文成粉丝发往新加坡，需要先准备哪些资料？' },
      { role: 'assistant', text: '我可以先整理准备清单。请补充产品规格、包装信息和进口商资料，市场规则与产品适用要求仍需专业人员核实。' }
    ]
  };
  let conversations = readConversations();
  let activeId = null;
  let activeMeta = { product: '尚未选择', market: '待补充', stage: '对话中', supply: '待确认', rules: '待核实' };

  function readConversations() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(conversations)); } catch { /* local-only demo can continue */ }
  }

  function currentConversation() {
    return conversations.find(item => item.id === activeId);
  }

  function renderHistory() {
    const history = $('#agent-history');
    history.replaceChildren();
    conversations.forEach(conversation => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `agent-history${conversation.id === activeId ? ' active' : ''}`;
      button.dataset.id = conversation.id;
      button.innerHTML = '<span>◌</span><span></span><b>×</b>';
      button.children[1].textContent = conversation.title;
      button.children[1].insertAdjacentHTML('beforeend', '<small>本机对话</small>');
      button.addEventListener('click', event => {
        if (event.target.closest('b')) {
          deleteConversation(conversation.id);
          return;
        }
        openConversation(conversation.id);
      });
      history.append(button);
    });
  }

  function addMessageToView(message) {
    const row = document.createElement('div');
    row.className = `agent-message-row ${message.role}`;
    if (message.role === 'assistant') {
      const avatar = document.createElement('img');
      avatar.src = 'assets/haihe-agent-avatar.jpg';
      avatar.alt = '';
      row.append(avatar);
    }
    const content = document.createElement('div');
    content.className = 'agent-message-content';
    const label = document.createElement('small');
    label.textContent = message.role === 'user' ? '你 · 刚刚' : '海禾 · AI 辅助';
    const bubble = document.createElement('div');
    bubble.className = 'agent-bubble';
    const paragraph = document.createElement('p');
    paragraph.textContent = message.text;
    bubble.append(paragraph);
    content.append(label, bubble);
    row.append(content);
    root.append(row);
  }

  function renderMessages(conversation) {
    root.replaceChildren();
    if (!conversation || !conversation.messages.length) {
      const welcome = document.createElement('div');
      welcome.className = 'agent-welcome';
      welcome.innerHTML = '<img src="assets/haihe-agent-avatar.jpg" alt=""><h2>你好，我是海禾</h2><p>告诉我你要寻找的产品、采购条件或出海资料。</p>';
      root.append(welcome);
    } else {
      conversation.messages.forEach(addMessageToView);
      if (conversation.sample) {
        addContextStrip();
        addChecklist();
      }
    }
    root.scrollTop = root.scrollHeight;
  }

  function addContextStrip() {
    const strip = document.createElement('div');
    strip.className = 'agent-context-strip';
    strip.innerHTML = '<div><span>◇</span><small>产品<strong>文成粉丝</strong></small></div>' +
      '<div><span>◎</span><small>目的地<strong>新加坡</strong></small></div>' +
      '<div><span>▤</span><small>状态<strong class="agent-pending">待补充资料</strong></small></div>';
    root.append(strip);
  }

  function addChecklist() {
    const card = document.createElement('article');
    card.className = 'agent-checklist';
    card.innerHTML = '<header><span>▤</span><strong>资料准备清单</strong><em>初步指引</em></header>' +
      '<div class="agent-check-row"><b>01</b><strong>产品规格与配料</strong><span>净含量、保质期、配料与添加剂。</span><small>待提供</small></div>' +
      '<div class="agent-check-row"><b>02</b><strong>包装及标签样稿</strong><span>提供现用包装与英文标签草稿。</span><small>待核对</small></div>' +
      '<div class="agent-check-row"><b>03</b><strong>生产与出口主体资料</strong><span>确认企业信息及适用资质。</span><small>待核实</small></div>' +
      '<div class="agent-check-row"><b>04</b><strong>进口商与批次信息</strong><span>由当地进口商核实分类及手续。</span><small>待补充</small></div>' +
      '<div class="agent-source"><span>↗ 官方信息入口 · 新加坡食品局 SFA ↗</span><a href="https://www.sfa.gov.sg/" target="_blank" rel="noreferrer">查看来源 ↗</a></div>' +
      '<footer>ⓘ 这份清单用于准备资料，具体要求需结合产品分类由专业机构核实。</footer>';
    root.append(card);
  }

  function updateMeta(meta = {}) {
    activeMeta = { ...activeMeta, ...meta };
    $('#context-product').textContent = activeMeta.product;
    $('#context-market').textContent = activeMeta.market;
    $('#context-stage').textContent = activeMeta.stage;
    $('#context-supply').textContent = activeMeta.supply;
    $('#context-rules').textContent = activeMeta.rules;
  }

  function updateHeading(conversation) {
    $('#thread-title').textContent = conversation?.title || '新的对话';
    $('#thread-subtitle').textContent = conversation?.sample ? '先梳理资料，再由专业主体核实。' : '告诉我你要寻找的产品、采购条件或出海资料。';
  }

  function renderConversation(conversation, meta) {
    activeId = conversation?.id || null;
    updateHeading(conversation);
    updateMeta(meta || conversation?.meta || { product: '尚未选择', market: '待补充', stage: '对话中', supply: '待确认', rules: '待核实' });
    renderMessages(conversation);
    renderHistory();
  }

  function openConversation(id) {
    const conversation = conversations.find(item => item.id === id);
    if (conversation) renderConversation(conversation);
  }

  function startNewConversation() {
    renderConversation(null);
    input.value = '';
    input.style.height = 'auto';
    input.focus();
  }

  function deleteConversation(id) {
    conversations = conversations.filter(item => item.id !== id);
    persist();
    if (activeId === id) startNewConversation();
    else renderHistory();
  }

  function addMessage(conversation, role, text) {
    const message = { role, text, time: Date.now() };
    conversation.messages.push(message);
    addMessageToView(message);
    root.scrollTop = root.scrollHeight;
  }

  function replyFor(text) {
    if (/产品|选品|杨梅|粉丝|紫菜|茶/.test(text)) return '可以先从温州产品目录挑选候选产品，再向供应方确认当季批次、可供量、包装规格和交付时间。当前展示内容为演示信息。';
    if (/采购|需求|询价|买家|数量|交货/.test(text)) return '我先帮你整理市场、数量、包装、交期和交付地点。发布前请补充目标国家或城市、标签语言及检测要求，需求会作为本机演示记录保存。';
    if (/出口|出海|资料|标签|检测|合规|市场/.test(text)) return '可以先整理产品规格、包装标签、生产主体、批次检测和进口商资料。目的地规则需要结合产品分类由专业人员核实，助手不直接作合规结论。';
    if (/平台|山海鲜途/.test(text)) return '山海鲜途聚焦温州农产品出海，提供特色选品、采购需求对接、批次信息和出海服务入口。你可以从左侧工作流或平台首页继续操作。';
    return '我收到你的问题了，可以继续协助你梳理温州产品、采购条件或出海资料。复杂判断请结合实际资料向业务人员或专业机构核实。';
  }

  function sendMessage(value) {
    const text = String(value || '').trim();
    if (!text) return;
    let conversation = currentConversation();
    if (!conversation) {
      conversation = { id: `chat-${Date.now()}`, title: text.slice(0, 24), messages: [], meta: { ...activeMeta } };
      conversations.unshift(conversation);
      activeId = conversation.id;
      updateHeading(conversation);
      root.replaceChildren();
    }
    conversation.sample = false;
    addMessage(conversation, 'user', text);
    persist();
    renderHistory();
    input.value = '';
    input.style.height = 'auto';
    window.setTimeout(() => {
      if (activeId !== conversation.id) return;
      addMessage(conversation, 'assistant', replyFor(text));
      persist();
    }, 240);
  }

  function loadExample() {
    const example = { ...sample, messages: sample.messages.map(message => ({ ...message })) };
    activeId = example.id;
    updateMeta({ product: example.product, market: example.market, stage: example.stage, supply: '待补充', rules: '待核实' });
    updateHeading(example);
    renderMessages(example);
    renderHistory();
  }

  function resizeInput() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
  }

  $('#agent-form').addEventListener('submit', event => { event.preventDefault(); sendMessage(input.value); input.focus(); });
  input.addEventListener('input', resizeInput);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); $('#agent-form').requestSubmit(); }
  });
  document.querySelectorAll('[data-action="new-chat"]').forEach(button => button.addEventListener('click', startNewConversation));
  document.querySelectorAll('[data-action="example"]').forEach(button => button.addEventListener('click', loadExample));
  document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.prompt)));
  $('[data-action="help"]').addEventListener('click', () => window.alert('海禾为演示助手。可以协助整理选品、采购和出海资料，具体供货与合规信息请向相关主体核实。'));
  $('[data-action="human"]').addEventListener('click', () => { window.location.href = 'index.html#service-request'; });
  $('[data-action="language"]').addEventListener('click', event => {
    event.currentTarget.textContent = event.currentTarget.textContent.includes('中文') ? '◉ EN / 中文' : '◉ 中文 / EN';
  });
  document.querySelectorAll('[data-action="upload"]').forEach(button => button.addEventListener('click', () => $('#agent-file').click()));
  $('#agent-file').addEventListener('change', event => { const file = event.target.files?.[0]; if (file) window.alert(`${file.name} 仅在本机选择，演示站点不会上传文件。`); event.target.value = ''; });

  renderHistory();
  const prompt = new URLSearchParams(window.location.search).get('prompt');
  if (prompt) {
    window.history.replaceState(null, '', window.location.pathname);
    startNewConversation();
    sendMessage(prompt);
  } else if (conversations.length) openConversation(conversations[0].id);
  else startNewConversation();
})();
