window.GitHubDownloadAPI = (() => {
  const cfg = (window.siteConfig && window.siteConfig.github) || { owner: '', repo: '', branch: 'main', dataPath: 'data.json' };
  const tokenKey = 'gh_pat_token';

  async function readData() {
    const r = await fetch(cfg.dataPath || 'data.json', { cache: 'no-store' });
    if (!r.ok) throw new Error('Falha ao ler data.json');
    return await r.json();
  }

  async function updateItem(itemType, id) {
    const token = localStorage.getItem(tokenKey);
    if (!token) throw new Error('Token GitHub não configurado');
    const api = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.dataPath || 'data.json'}`;
    const current = await fetch(api, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }).then(r => r.json());
    const data = JSON.parse(atob(current.content.replace(/
/g, '')));
    const key = `${itemType}_${id}`;
    data.items = data.items || {};
    data.items[key] = data.items[key] || { downloads: 0 };
    data.items[key].downloads = Number(data.items[key].downloads || 0) + 1;
    data.totalDownloads = Object.values(data.items).reduce((a, x) => a + Number(x.downloads || 0), 0);
    data.updatedAt = new Date().toISOString();
    const payload = { message: `chore: update ${key} downloads`, content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))), sha: current.sha, branch: cfg.branch || 'main' };
    const res = await fetch(api, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Falha ao salvar data.json');
    return data;
  }

  return { readData, updateItem, tokenKey };
})();