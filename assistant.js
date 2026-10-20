(() => {
  const root = document.getElementById('agent-messages');
  const $ = selector => document.querySelector(selector);
  const routes = { catalog: 'index.html#catalog', 'request-create': 'index.html#request-create', requests: 'index.html#requests', services: 'index.html#services', 'service-request': 'index.html#service-request' };

  function addBubble(text, user = false) {
    const bubble = document.createElement('div');
    bubble.className = `agent-bubble${user ? ' user' : ''}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.append(paragraph);
    if (user) {
      const time = document.createElement('small');
      time.textContent = '你 · 刚刚';
      bubble.append(time);
      root.append(bubble);
    } else {
      const row = document.createElement('div');
      row.className = 'agent-reply';
      const avatar = document.createElement('img');
      avatar.src = 'assets/haihe-agent-avatar.jpg';
      avatar.alt = '';
      const content = document.createElement('div');
      content.className = 'agent-reply-content';
      const label = document.createElement('small');
      label.textContent = '海禾 · 演示助手';
      content.append(label, bubble);
      row.append(avatar, content);
      root.append(row);
    }
    root.scrollTop = root.scrollHeight;
  }

  function addActions(items) {
    const row = document.createElement('div');
    row.className = 'agent-dynamic-actions';
    items.forEach(([label, route]) => {
      const link = document.createElement('a');
      link.className = 'agent-secondary-action';
      link.href = routes[route] || 'index.html#home';
      link.textContent = `${label} ↗`;
      row.append(link);
    });
    root.append(row);
    root.scrollTop = root.scrollHeight;
  }

  function sendMessage(value) {
    const text = String(value || '').trim();
    if (!text) return;
    addBubble(text, true);
    const query = text.toLowerCase();
    let reply = '我可以继续协助你整理温州产品信息、采购条件或出海资料。当前助手为演示版，资料与规则均需人工核实。';
    let actions = [['浏览温州选品', 'catalog']];
    if (/采购|询价|数量|需求|交货|买家/.test(query)) {
      reply = '我先帮你把市场、数量、包装和交期这些采购条件理清。填写完成后，需求会作为本机演示记录保存。';
      actions = [['整理采购需求', 'request-create'], ['浏览现有需求', 'requests']];
    } else if (/产品|选品|推荐|杨梅|粉丝|茶叶|紫菜/.test(query)) {
      reply = '可以先从温州产品目录挑选候选产品，再向供应方确认当季批次、可供量和交付时间。';
      actions = [['打开产品大厅', 'catalog']];
    } else if (/资料|出口|出海|标签|检测|合规|新加坡|日本|欧盟/.test(query)) {
      reply = '我可以先整理产品资料清单。目的地规则、标签适用性和检测要求尚未完成专业核验，清单不构成合规结论。';
      actions = [['查看出海资料服务', 'services'], ['申请人工协助', 'service-request']];
    }
    window.setTimeout(() => { addBubble(reply); addActions(actions); }, 120);
  }

  function loadExample(name) {
    document.querySelectorAll('.agent-history').forEach(button => button.classList.toggle('active', button.dataset.example === name));
    const sourcing = name === 'sourcing';
    $('#thread-title').textContent = sourcing ? '新加坡餐饮渠道选品' : '文成粉丝出海资料准备';
    $('#context-product').textContent = sourcing ? '文成粉丝、洞头紫菜' : '文成粉丝';
    $('#context-market').textContent = '新加坡';
    if (sourcing) {
      root.innerHTML = '<div class="agent-bubble user"><p>想采购粉丝和紫菜，首单约500箱，希望下月到货并先寄样。</p><small>你 · 今天 10:24</small></div><div class="agent-reply"><img src="assets/haihe-agent-avatar.jpg" alt=""><div class="agent-reply-content"><small>海禾 · 演示助手</small><div class="agent-bubble"><p>我先列出候选产品。包装、起订量和批次供货条件还需要向供应方确认。</p></div><div class="agent-sample-product"><img src="assets/product-4.jpg" alt=""><div><strong>文成粉丝</strong><small>浙江 · 文成 · 常温干制</small><span>包装与检测资料待确认</span></div><a href="index.html#catalog">查看产品 ↗</a></div><div class="agent-sample-product"><img src="assets/product-3.jpg" alt=""><div><strong>洞头紫菜</strong><small>浙江 · 洞头 · 加工批次待核实</small><span>包装规格与检测资料待确认</span></div><a href="index.html#catalog">查看产品 ↗</a></div><div class="agent-bubble"><p>建议核实箱规、样品费用和交期，再整理询价草稿。候选产品为演示数据，不代表已确认供货。</p></div><div class="agent-dynamic-actions"><a class="agent-primary-action" href="index.html#request-create">整理采购需求 ↗</a><a class="agent-secondary-action" href="index.html#catalog">浏览产品目录 ↗</a></div></div></div>';
    } else {
      root.innerHTML = '<div class="agent-bubble user"><p>想把文成粉丝发往新加坡，需要先准备哪些资料？</p><small>你 · 今天 10:24</small></div><div class="agent-reply"><img src="assets/haihe-agent-avatar.jpg" alt=""><div class="agent-reply-content"><small>海禾 · 今天 10:24</small><div class="agent-bubble"><p>我可以先整理准备清单。请补充产品规格、包装信息和进口商资料，市场规则与产品适用要求仍需专业人员核实。</p></div><div class="agent-context-strip"><div><span>◇</span><small>产品<strong>文成粉丝</strong></small></div><div><span>◎</span><small>目的地<strong>新加坡</strong></small></div><div><span>▤</span><small>当前阶段<strong class="agent-pending">资料待补充</strong></small></div></div><article class="agent-checklist"><header><span>▤</span><strong>资料准备清单</strong><em>初步整理</em></header><div class="agent-check-row"><b>01</b><strong>产品规格与配料</strong><span>净含量、保质期、配料与添加剂</span><small>待提供</small></div><div class="agent-check-row"><b>02</b><strong>包装及标签样稿</strong><span>现用包装信息与英文标签样稿</span><small>待核对</small></div><div class="agent-check-row"><b>03</b><strong>生产与出口主体资料</strong><span>企业信息与适用资质</span><small>待核实</small></div><div class="agent-check-row"><b>04</b><strong>进口商与批次信息</strong><span>进口商资料、可供批次与数量</span><small>待补充</small></div><footer>ⓘ 清单用于资料准备，具体要求需结合产品分类由专业机构核实。</footer></article><div class="agent-source"><span>↗ 官方信息入口 · 新加坡食品局 SFA</span><a href="https://www.sfa.gov.sg/" target="_blank" rel="noreferrer">查看来源 ↗</a></div><small class="agent-disclaimer">规则状态：待核实。助手仅整理资料，不作合规结论。</small></div></div></div>';
    }
    root.scrollTop = 0;
  }

  function newChat() {
    document.querySelectorAll('.agent-history').forEach(button => button.classList.remove('active'));
    $('#thread-title').textContent = '开始新的出海协作';
    $('#context-product').textContent = '尚未选择';
    $('#context-market').textContent = '待补充';
    root.innerHTML = '<div class="agent-welcome"><img src="assets/haihe-agent-avatar.jpg" alt=""><h2>你好，我是海禾</h2><p>告诉我你要寻找产品、整理采购条件，或准备目标市场资料。</p><div><a href="index.html#catalog">选品推荐 ↗</a><a href="index.html#request-create">采购需求整理 ↗</a><a href="index.html#services">出海资料准备 ↗</a></div></div>';
    $('#agent-input').focus();
  }

  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action]');
    if (!action) return;
    if (action.dataset.action === 'new-chat') newChat();
    if (action.dataset.action === 'example') loadExample(action.dataset.example || 'docs');
    if (action.dataset.action === 'generate') addBubble('资料清单已整理完成。请按清单补充产品规格、标签样稿、主体信息和进口商资料；专业规则仍待核实。');
    if (action.dataset.action === 'human') window.location.href = routes['service-request'];
    if (action.dataset.action === 'help') window.alert('海禾为演示助手。资料核对与合规判断请咨询专业机构。');
    if (action.dataset.action === 'upload') $('#agent-file').click();
  });
  $('#agent-file').addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (file) window.alert(`${file.name} 仅在本机选择；演示站点不会上传文件。`);
    event.target.value = '';
  });
  $('#agent-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = $('#agent-input');
    sendMessage(input.value);
    input.value = '';
  });
  loadExample('docs');
})();
