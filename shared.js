(() => {
  'use strict';
  const KEY = 'shanhai-cross-workspace-v1';
  const empty = { version: 1, batches: [], links: [], updatedAt: '' };
  function read() {
    try { return { ...empty, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
    catch (_) { return { ...empty }; }
  }
  function write(next) {
    const value = { ...read(), ...next, version: 1, updatedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
    return value;
  }
  function mergeBatches(batches) {
    const byId = new Map(read().batches.map(batch => [batch.id, batch]));
    for (const batch of batches || []) if (batch?.id) byId.set(batch.id, batch);
    return write({ batches: [...byId.values()] });
  }
  window.ShanhaiBridge = {
    key: KEY,
    read,
    batches: () => read().batches,
    getBatch: id => read().batches.find(batch => batch.id === id),
    saveBatches: mergeBatches,
    link(record) {
      const current = read();
      const links = current.links.filter(item => item.id !== record.id);
      links.unshift(record);
      return write({ links });
    }
  };
})();
