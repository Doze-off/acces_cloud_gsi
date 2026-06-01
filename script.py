import os, json, zipfile

# Gerar versão final completa com frontend + integração GitHub API estilo backend leve
base = 'output/final-github-api-site'
os.makedirs(base, exist_ok=True)
os.makedirs(os.path.join(base, '.github', 'workflows'), exist_ok=True)

index_html = '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Minhas Builds - Builds, módulos, equipe, doações e suporte" />
  <title>Minhas Builds</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</head>
<body>
  <div class="cursor-glow" id="cursorGlow"></div>

  <header class="header" id="header">
    <div class="container header-content">
      <h1 id="site-title">Minhas Builds</h1>
      <button id="lang-toggle" class="lang-btn"><i class="fas fa-globe"></i><span id="lang-text">English</span></button>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <h2 id="hero-title">Todas as minhas builds de jogos e projetos</h2>
      <p id="hero-subtitle">Encontre aqui todas as versões disponíveis para download</p>
      <div class="total-downloads">
        <i class="fas fa-download"></i>
        <span id="total-downloads-count">0</span>
        <span id="total-downloads-text">downloads totais</span>
      </div>
    </div>
  </section>

  <section class="builds-section">
    <div class="container">
      <h2 class="section-title" id="builds-title">Builds Disponíveis</h2>
      <div id="builds-container" class="builds-grid"></div>
    </div>
  </section>

  <section class="modules-section">
    <div class="container">
      <h2 class="section-title" id="modules-title">Módulos</h2>
      <p id="modules-description" class="section-description">Módulos personalizados para expandir e melhorar suas builds</p>
      <div id="modules-container" class="modules-grid"></div>
    </div>
  </section>

  <section class="team-section">
    <div class="container">
      <h2 class="section-title" id="team-title">Equipe</h2>
      <div id="team-container" class="team-grid"></div>
    </div>
  </section>

  <section class="donation-section">
    <div class="container">
      <h2 class="section-title" id="donation-title">Apoie o Projeto</h2>
      <p id="donation-description" class="donation-description">Se você gosta do meu trabalho, considere fazer uma doação para ajudar no desenvolvimento contínuo!</p>
      <div id="donation-container" class="donation-methods"></div>
    </div>
  </section>

  <section class="support-section">
    <div class="container">
      <h2 class="section-title" id="support-title">Grupo de Suporte</h2>
      <p id="support-description" class="support-description">Junte-se ao nosso grupo de suporte para tirar dúvidas, compartilhar feedback e conversar com outros usuários</p>
      <div id="support-container" class="support-links"></div>
    </div>
  </section>

  <footer class="footer">
    <div class="container"><p id="footer-text">Feito com <span>❤️</span> por <span>Vinicius Sad</span> | 2026</p></div>
  </footer>

  <script src="config.json"></script>
  <script src="api.js"></script>
  <script src="script.js"></script>
</body>
</html>'''

style_css = open('output/style.css', 'r', encoding='utf-8').read()
# append GitHub API status / minor UI
style_css += "\n.api-status{margin-top:18px;text-align:center;color:var(--text-secondary);font-size:.95rem}"

config = {
  "site": {"title": {"pt-BR": "Minhas Builds", "en": "My Builds"}, "description": {"pt-BR": "Todas as minhas builds de jogos e projetos", "en": "All my game builds and projects"}},
  "github": {"owner": "SEU_USUARIO", "repo": "SEU_REPOSITORIO", "branch": "main", "dataPath": "data.json"},
  "builds": [
    {"id": 1, "name": {"pt-BR": "Build Alpha v1.0", "en": "Alpha Build v1.0"}, "description": {"pt-BR": "Minha primeira build experimental com recursos básicos", "en": "My first experimental build with basic features"}, "version": "1.0.0", "date": "2026-05-15", "download_url": "#", "image": "images/build1.jpg"},
    {"id": 2, "name": {"pt-BR": "Build Beta v2.0", "en": "Beta Build v2.0"}, "description": {"pt-BR": "Build beta com novos recursos e melhorias de performance", "en": "Beta build with new features and performance improvements"}, "version": "2.0.0", "date": "2026-05-25", "download_url": "#", "image": "images/build2.jpg"}
  ],
  "modulos": [
    {"id": 1, "name": {"pt-BR": "Módulo de Otimização", "en": "Optimization Module"}, "description": {"pt-BR": "Melhora a performance do jogo em 40% com shaders otimizados", "en": "Improves game performance by 40% with optimized shaders"}, "version": "1.0.0", "date": "2026-05-20", "download_url": "#", "image": "images/modulos/modulo1.jpg", "tags": {"pt-BR": ["Performance", "Shaders"], "en": ["Performance", "Shaders"]}},
    {"id": 2, "name": {"pt-BR": "Módulo de Texturas 4K", "en": "4K Textures Module"}, "description": {"pt-BR": "Texturas ultra-realistas em 4K para gráficos incríveis", "en": "Ultra-realistic 4K textures for amazing graphics"}, "version": "2.0.0", "date": "2026-05-28", "download_url": "#", "image": "images/modulos/modulo2.jpg", "tags": {"pt-BR": ["Gráficos", "4K"], "en": ["Graphics", "4K"]}}
  ],
  "team": [{"name": {"pt-BR": "Vinicius Sad", "en": "Vinicius Sad"}, "role": {"pt-BR": "Desenvolvedor Principal", "en": "Lead Developer"}, "avatar": "images/team/vinicius.jpg", "social": {"github": "https://github.com/SEU_USUARIO", "twitter": ""}}],
  "donation": {"title": {"pt-BR": "Apoie o Projeto", "en": "Support the Project"}, "description": {"pt-BR": "Se você gosta do meu trabalho, considere fazer uma doação para ajudar no desenvolvimento contínuo!", "en": "If you like my work, consider donating to help with continuous development!"}, "methods": [{"name": "Pix", "pt-BR": "Chave Pix: seu-email@exemplo.com", "en": "Pix Key: your-email@example.com", "icon": "pix"}]},
  "support": {"title": {"pt-BR": "Grupo de Suporte", "en": "Support Group"}, "description": {"pt-BR": "Junte-se ao nosso grupo de suporte para tirar dúvidas, compartilhar feedback e conversar com outros usuários", "en": "Join our support group to ask questions, share feedback, and chat with other users"}, "discord": "https://discord.gg/seu-codigo"},
  "footer": {"text": {"pt-BR": "Feito com ❤️ por Vinicius Sad | 2026", "en": "Made with ❤️ by Vinicius Sad | 2026"}}
}

data_json = {"totalDownloads": 0, "items": {"build_1": {"downloads": 0}, "build_2": {"downloads": 0}, "module_1": {"downloads": 0}, "module_2": {"downloads": 0}}, "updatedAt": "2026-05-31T22:20:00-03:00"}

api_js = '''window.GitHubDownloadAPI = (() => {
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
    const data = JSON.parse(atob(current.content.replace(/\n/g, '')));
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
})();'''

script_js = '''const translations={"pt-BR":{"site-title":"Minhas Builds","hero-title":"Todas as minhas builds de jogos e projetos","hero-subtitle":"Encontre aqui todas as versões disponíveis para download","builds-title":"Builds Disponíveis","modules-title":"Módulos","modules-description":"Módulos personalizados para expandir e melhorar suas builds","team-title":"Equipe","donation-title":"Apoie o Projeto","donation-description":"Se você gosta do meu trabalho, considere fazer uma doação para ajudar no desenvolvimento contínuo!","support-title":"Grupo de Suporte","support-description":"Junte-se ao nosso grupo de suporte para tirar dúvidas, compartilhar feedback e conversar com outros usuários","footer-text":"Feito com ❤️ por Vinicius Sad | 2026","download":"Baixar Agora","language":"English","total-downloads-text":"downloads totais"},"en":{"site-title":"My Builds","hero-title":"All my game builds and projects","hero-subtitle":"Find all available versions for download here","builds-title":"Available Builds","modules-title":"Modules","modules-description":"Custom modules to expand and improve your builds","team-title":"Team","donation-title":"Support the Project","donation-description":"If you like my work, consider donating to help with continuous development!","support-title":"Support Group","support-description":"Join our support group to ask questions, share feedback, and chat with other users","footer-text":"Made with ❤️ by Vinicius Sad | 2026","download":"Download Now","language":"Português","total-downloads-text":"total downloads"}};
let currentLang='pt-BR';
let config={};
let liveData={totalDownloads:0, items:{}};
function setText(id, txt){const el=document.getElementById(id); if(el) el.textContent=txt;}
function getSavedToken(){return localStorage.getItem(GitHubDownloadAPI.tokenKey||'gh_pat_token');}
async function loadConfig(){ const r=await fetch('config.json',{cache:'no-store'}); config=await r.json(); window.siteConfig=config; await loadData(); initializeSite(); }
async function loadData(){ try{ liveData = await GitHubDownloadAPI.readData(); } catch { liveData = {totalDownloads:0, items:{}}; }
}
function updateLanguage(){ const t=translations[currentLang]; Object.entries(t).forEach(([k,v])=>setText(k,v)); document.documentElement.lang=currentLang; loadBuilds(); loadModules(); loadTeam(); loadDonation(); loadSupport(); updateCountersUI(); }
function updateCountersUI(){ setText('total-downloads-count', Number(liveData.totalDownloads||0).toLocaleString(currentLang==='pt-BR'?'pt-BR':'en-US')); }
function itemCount(type,id){ return Number(liveData.items?.[`${type}_${id}`]?.downloads || 0); }
function initCursorGlow(){const g=document.getElementById('cursorGlow'); if(!g) return; document.addEventListener('mousemove',e=>{g.style.left=e.clientX+'px'; g.style.top=e.clientY+'px';});}
function initHeaderScroll(){const h=document.getElementById('header'); window.addEventListener('scroll',()=>h.classList.toggle('scrolled',window.scrollY>100));}
async function incrementDownload(type,id){ try{ liveData = await GitHubDownloadAPI.updateItem(type,id); updateCountersUI(); const el=document.getElementById(`${type}-${id}-count`); if(el) el.textContent=itemCount(type,id).toLocaleString(currentLang==='pt-BR'?'pt-BR':'en-US'); } catch(e){ console.error(e); alert('Não foi possível atualizar o contador global. Configure o token no navegador.'); } }
function cardBase(title,desc,img,version,date,downloads,btnTxt,extra,downloadUrl,type,id){ return `<img src="${img}" class="build-image" onerror="this.src='https://via.placeholder.com/400x220/12121a/a855f7?text=Image'"><div class="build-content"><h3>${title}</h3><span class="build-version">v${version}</span><p>${desc}</p><p class="build-date"><i class="far fa-calendar"></i> ${date}</p><div class="module-downloads"><i class="fas fa-download"></i> <span id="${type}-${id}-count">${downloads.toLocaleString(currentLang==='pt-BR'?'pt-BR':'en-US')}</span></div>${extra||''}<a href="${downloadUrl||'#'}" class="download-btn" target="_blank" rel="noopener" data-type="${type}" data-id="${id}"><i class="fas fa-download"></i> ${btnTxt}</a></div>`; }
function loadBuilds(){ const c=document.getElementById('builds-container'); c.innerHTML=''; (config.builds||[]).forEach((b,i)=>{ const d=b.name[currentLang]||b.name['pt-BR']; const ds=b.description[currentLang]||b.description['pt-BR']; const card=document.createElement('div'); card.className='build-card'; card.style.animationDelay=`${i*0.1}s`; card.innerHTML=cardBase(d,ds,b.image,b.version,b.date,itemCount('build',b.id),translations[currentLang].download,'',b.download_url,'build',b.id); c.appendChild(card); }); bindDownloads(); }
function loadModules(){ const c=document.getElementById('modules-container'); c.innerHTML=''; (config.modulos||[]).forEach((m,i)=>{ const d=m.name[currentLang]||m.name['pt-BR']; const ds=m.description[currentLang]||m.description['pt-BR']; const tags=(m.tags?.[currentLang]||m.tags?.['pt-BR']||[]).map(t=>`<span class="module-tag">${t}</span>`).join(''); const extra=`<div class="module-tags">${tags}</div>`; const card=document.createElement('div'); card.className='module-card'; card.style.animationDelay=`${i*0.1}s`; card.innerHTML=`<img class="module-image" src="${m.image}" onerror="this.src='https://via.placeholder.com/400x200/12121a/a855f7?text=Module'"><div class="module-content"><h3>${d}</h3><p>${ds}</p>${extra}<div class="module-downloads"><i class="fas fa-download"></i> <span id="module-${m.id}-count">${itemCount('module',m.id).toLocaleString(currentLang==='pt-BR'?'pt-BR':'en-US')}</span></div><a href="${m.download_url||'#'}" class="download-btn" target="_blank" rel="noopener" data-type="module" data-id="${m.id}"><i class="fas fa-download"></i> ${translations[currentLang].download}</a></div>`; c.appendChild(card); }); bindDownloads(); }
function loadTeam(){ const c=document.getElementById('team-container'); c.innerHTML=''; (config.team||[]).forEach(m=>{ const n=m.name[currentLang]||m.name['pt-BR']; const r=m.role[currentLang]||m.role['pt-BR']; c.innerHTML += `<div class="team-member"><img src="${m.avatar}" class="team-avatar" onerror="this.src='https://via.placeholder.com/130x130/12121a/a855f7?text=Avatar'"><h3>${n}</h3><p class="team-role">${r}</p><div class="team-social"><a href="${m.social?.github||'#'}" target="_blank" rel="noopener"><i class="fab fa-github"></i></a></div></div>`; }); }
function loadDonation(){ const c=document.getElementById('donation-container'); c.innerHTML=''; (config.donation?.methods||[]).forEach(m=>{ const txt=m[currentLang]||m['pt-BR']; c.innerHTML += `<div class="donation-method"><h4><i class="fas fa-heart"></i> ${m.name}</h4><p>${m.url?`<a href="${m.url}" target="_blank" rel="noopener">${txt}</a>`:txt}</p></div>`; }); }
function loadSupport(){ const c=document.getElementById('support-container'); c.innerHTML=''; if(config.support?.discord) c.innerHTML += `<a class="support-link" href="${config.support.discord}" target="_blank" rel="noopener"><i class="fab fa-discord"></i><span>Discord</span></a>`; }
function bindDownloads(){ document.querySelectorAll('.download-btn').forEach(btn=>{ btn.onclick = async () => { await incrementDownload(btn.dataset.type, btn.dataset.id); }; }); }
function initializeSite(){ updateLanguage(); initCursorGlow(); initHeaderScroll(); bindDownloads(); }
document.getElementById('lang-toggle').addEventListener('click', ()=>{ currentLang = currentLang==='pt-BR'?'en':'pt-BR'; updateLanguage(); });
document.addEventListener('DOMContentLoaded', loadConfig);
'''

workflow = '''name: Update Download Stats
on:
  workflow_dispatch:
  repository_dispatch:
    types: [download-event]
permissions:
  contents: write
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Update data.json
        run: |
          python - << 'PY'
          import json, os, datetime
          p='data.json'
          with open(p,'r',encoding='utf-8') as f:
              data=json.load(f)
          data['totalDownloads']=int(data.get('totalDownloads',0))+1
          data['updatedAt']=datetime.datetime.now().isoformat()
          with open(p,'w',encoding='utf-8') as f:
              json.dump(data,f,indent=2,ensure_ascii=False)
          PY
      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add data.json
          git commit -m "chore: update download stats" || exit 0
          git push
'''

with open(os.path.join(base, 'index.html'), 'w', encoding='utf-8') as f: f.write(index_html)
with open(os.path.join(base, 'style.css'), 'w', encoding='utf-8') as f: f.write(style_css)
with open(os.path.join(base, 'config.json'), 'w', encoding='utf-8') as f: json.dump(config, f, indent=2, ensure_ascii=False)
with open(os.path.join(base, 'data.json'), 'w', encoding='utf-8') as f: json.dump(data_json, f, indent=2, ensure_ascii=False)
with open(os.path.join(base, 'api.js'), 'w', encoding='utf-8') as f: f.write(api_js)
with open(os.path.join(base, 'script.js'), 'w', encoding='utf-8') as f: f.write(script_js)
with open(os.path.join(base, '.github', 'workflows', 'update-download-stats.yml'), 'w', encoding='utf-8') as f: f.write(workflow)

readme = '''# Minhas Builds

Site moderno em GitHub Pages com builds, módulos, equipe, doação, suporte e contador global de downloads via GitHub API.

## Como funciona o contador global

- O site lê `data.json` hospedado no repositório.
- No clique de download, o frontend atualiza o arquivo usando a GitHub API.
- O total fica salvo no próprio repositório, então vale para todos os visitantes.
- Opcionalmente, você pode usar GitHub Actions para automatizar atualizações.

## O que você precisa fazer

1. Trocar `SEU_USUARIO` e `SEU_REPOSITORIO` em `config.json`.
2. Criar um **Personal Access Token** no GitHub com permissão de `contents:write`.
3. Salvar esse token no navegador com a chave `gh_pat_token`.
4. Fazer deploy no GitHub Pages.

## Estrutura

- `index.html`
- `style.css`
- `script.js`
- `api.js`
- `config.json`
- `data.json`
- `.github/workflows/update-download-stats.yml`

## Observação

GitHub Pages é estático, então a escrita global depende da GitHub API ou do GitHub Actions. Essa é uma solução prática, barata e totalmente integrada ao GitHub.
'''
with open(os.path.join(base, 'README.md'), 'w', encoding='utf-8') as f: f.write(readme)
with open(os.path.join(base, '.gitignore'), 'w', encoding='utf-8') as f: f.write('node_modules/\n.DS_Store\n')

zip_path='output/site-builds-final-github-api.zip'
if os.path.exists(zip_path): os.remove(zip_path)
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for root,_,files in os.walk(base):
        for file in files:
            p=os.path.join(root,file)
            z.write(p, os.path.relpath(p, base))
print(zip_path)