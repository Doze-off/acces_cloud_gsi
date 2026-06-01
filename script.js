// ========================================
// SITE MODERNO - JAVASCRIPT AVANÇADO
// ========================================

// Traduçðµes
const translations = {
    'pt-BR': {
        'site-title': 'Minhas Builds',
        'hero-title': 'Todas as minhas builds de jogos e projetos',
        'hero-subtitle': 'Encontre aqui todas as versõíes disponõíveis para download',
        'builds-title': 'Builds Disponõíveis',
        'gallery-title': 'Galeria de Imagens',
        'team-title': 'Equipe',
        'donation-title': 'Apoie o Projeto',
        'donation-description': 'Se vocõª gosta do meu trabalho, considere fazer uma doaçaðo para ajudar no desenvolvimento contõínuo!',
        'support-title': 'Grupo de Suporte',
        'support-description': 'Junte-se ao nosso grupo de suporte para tirar dũºvidas, compartilhar feedback e conversar com outros usuõ¡rios',
        'footer-text': 'Feito com ❤️ por Vinicius Sad | 2026',
        'download': 'Baixar Agora',
        'language': 'English'
    },
    'en': {
        'site-title': 'My Builds',
        'hero-title': 'All my game builds and projects',
        'hero-subtitle': 'Find all available versions for download here',
        'builds-title': 'Available Builds',
        'gallery-title': 'Image Gallery',
        'team-title': 'Team',
        'donation-title': 'Support the Project',
        'donation-description': 'If you like my work, consider donating to help with continuous development!',
        'support-title': 'Support Group',
        'support-description': 'Join our support group to ask questions, share feedback, and chat with other users',
        'footer-text': 'Made with ❤️ by Vinicius Sad | 2026',
        'download': 'Download Now',
        'language': 'Português'
    }
};

// Estado atual do idioma
let currentLang = 'pt-BR';
let config = {};

// Efeito de cursor glow
const initCursorGlow = () => {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
};

// Efeito de scroll no header
const initHeaderScroll = () => {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
};

// Animaçaðo ao scroll (Intersection Observer)
const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.build-card, .gallery-item, .team-member, .donation-method, .support-link').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
};

// Carregar config.json
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Failed to load config');
        config = await response.json();
        initializeSite();
    } catch (error) {
        console.error('Erro ao carregar config.json:', error);
        initializeSite();
    }
}

// Inicializar site
function initializeSite() {
    updateLanguage();
    loadBuilds();
    loadGallery();
    loadTeam();
    loadDonation();
    loadSupport();

    // Inicializar efeitos modernos
    initCursorGlow();
    initHeaderScroll();
    initScrollAnimations();
}

// Atualizar idioma
function updateLanguage() {
    const t = translations[currentLang];

    // Atualizar textos estaticos
    const elements = {
        'site-title': t['site-title'],
        'hero-title': t['hero-title'],
        'hero-subtitle': t['hero-subtitle'],
        'builds-title': t['builds-title'],
        'gallery-title': t['gallery-title'],
        'team-title': t['team-title'],
        'donation-title': t['donation-title'],
        'donation-description': t['donation-description'],
        'support-title': t['support-title'],
        'support-description': t['support-description'],
        'footer-text': t['footer-text'],
        'lang-text': t['language']
    };

    Object.entries(elements).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    });

    // Atualizar idioma do documento
    document.documentElement.lang = currentLang;

    // Recarregar conteudos dinamicos
    if (Object.keys(config).length > 0) {
        loadBuilds();
        loadGallery();
        loadTeam();
        loadDonation();
        loadSupport();
    }
}

// Alternar idioma com animangaðo
document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const btn = document.getElementById('lang-toggle');
    btn.style.transform = 'scale(0.95)';

    setTimeout(() => {
        currentLang = currentLang === 'pt-BR' ? 'en' : 'pt-BR';
        updateLanguage();
        btn.style.transform = '';
    }, 150);
});

// Carregar Builds com animagaðo
function loadBuilds() {
    const container = document.getElementById('builds-container');
    if (!config.builds || config.builds.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem;">Nenhuma build disponõível no momento.</p>';
        return;
    }

    container.innerHTML = '';
    const t = translations[currentLang];

    config.builds.forEach((build, index) => {
        const name = build.name[currentLang] || build.name['pt-BR'] || 'Build';
        const description = build.description[currentLang] || build.description['pt-BR'] || '';
        const date = build.date || 'N/A';
        const image = build.image || 'https://via.placeholder.com/400x220/12121a/a855f7?text=Build+Image';
        const version = build.version || '1.0.0';

        const buildCard = document.createElement('div');
        buildCard.className = 'build-card';
        buildCard.style.animationDelay = `${index * 0.1}s`;
        buildCard.innerHTML = `
            <img src="${image}" alt="${name}" class="build-image" 
                 onerror="this.src='https://via.placeholder.com/400x220/12121a/a855f7?text=Build+Image'">
            <div class="build-content">
                <h3>${name}</h3>
                <span class="build-version">v${version}</span>
                <p>${description}</p>
                <p class="build-date">
                    <i class="far fa-calendar"></i> ${formatDate(date)}
                </p>
                <a href="${build.download_url || '#'}" class="download-btn" target="_blank" rel="noopener">
                    <i class="fas fa-download"></i> ${t['download']}
                </a>
            </div>
        `;
        container.appendChild(buildCard);
    });
}

// Formatar data
function formatDate(dateStr) {
    if (dateStr === 'N/A') return dateStr;

    try {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(currentLang === 'pt-BR' ? 'pt-BR' : 'en-US', options);
    } catch {
        return dateStr;
    }
}

// Carregar Galeria
function loadGallery() {
    const container = document.getElementById('gallery-container');
    if (!config.gallery || config.gallery.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem;">Nenhuma imagem na galeria no momento.</p>';
        return;
    }

    container.innerHTML = '';

    config.gallery.forEach((item, index) => {
        const caption = item.caption[currentLang] || item.caption['pt-BR'] || 'Imagem';
        const image = item.image || 'https://via.placeholder.com/400x280/12121a/a855f7?text=Image';

        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.style.animationDelay = `${index * 0.1}s`;
        galleryItem.innerHTML = `
            <img src="${image}" alt="${caption}" 
                 onerror="this.src='https://via.placeholder.com/400x280/12121a/a855f7?text=Image'">
            <div class="gallery-caption">
                <p>${caption}</p>
            </div>
        `;
        container.appendChild(galleryItem);
    });
}

// Carregar Equipe
function loadTeam() {
    const container = document.getElementById('team-container');
    if (!config.team || config.team.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem;">Nenhum membro na equipe no momento.</p>';
        return;
    }

    container.innerHTML = '';

    config.team.forEach((member, index) => {
        const name = member.name[currentLang] || member.name['pt-BR'] || 'Membro';
        const role = member.role[currentLang] || member.role['pt-BR'] || 'Contribuidor';
        const avatar = member.avatar || 'https://via.placeholder.com/130x130/12121a/a855f7?text=Avatar';
        const github = member.social?.github || '#';
        const twitter = member.social?.twitter || '';

        const teamMember = document.createElement('div');
        teamMember.className = 'team-member';
        teamMember.style.animationDelay = `${index * 0.1}s`;

        let socialHTML = `<a href="${github}" target="_blank" rel="noopener" title="GitHub"><i class="fab fa-github"></i></a>`;

        if (twitter) {
            socialHTML += `<a href="${twitter}" target="_blank" rel="noopener" title="Twitter"><i class="fab fa-twitter"></i></a>`;
        }

        teamMember.innerHTML = `
            <img src="${avatar}" alt="${name}" class="team-avatar"
                 onerror="this.src='https://via.placeholder.com/130x130/12121a/a855f7?text=Avatar'">
            <h3>${name}</h3>
            <p class="team-role">${role}</p>
            <div class="team-social">
                ${socialHTML}
            </div>
        `;
        container.appendChild(teamMember);
    });
}

// Carregar Doação
function loadDonation() {
    const container = document.getElementById('donation-container');
    if (!config.donation || !config.donation.methods) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Métodos de doação não configurados.</p>';
        return;
    }

    container.innerHTML = '';

    config.donation.methods.forEach(method => {
        const methodText = method[currentLang] || method['pt-BR'] || method.name;
        const name = method.name;
        const url = method.url || '#';
        const isPix = method.icon === 'pix';

        const donationMethod = document.createElement('div');
        donationMethod.className = 'donation-method';

        if (isPix) {
            donationMethod.innerHTML = `
                <h4><i class="fas fa-qrcode"></i> ${name}</h4>
                <p>${methodText}</p>
            `;
        } else {
            donationMethod.innerHTML = `
                <h4><i class="fas fa-heart"></i> ${name}</h4>
                <p><a href="${url}" target="_blank" rel="noopener">${methodText}</a></p>
            `;
        }

        container.appendChild(donationMethod);
    });
}

// Carregar Suporte
function loadSupport() {
    const container = document.getElementById('support-container');
    if (!config.support) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Links de suporte não configurados.</p>';
        return;
    }

    container.innerHTML = '';

    const supportLinks = [];

    if (config.support.discord) {
        supportLinks.push({ icon: 'fab fa-discord', name: 'Discord', url: config.support.discord });
    }
    if (config.support.telegram) {
        supportLinks.push({ icon: 'fab fa-telegram', name: 'Telegram', url: config.support.telegram });
    }
    if (config.support.whatsapp) {
        supportLinks.push({ icon: 'fab fa-whatsapp', name: 'WhatsApp', url: config.support.whatsapp });
    }

    if (supportLinks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum link de suporte configurado.</p>';
        return;
    }

    supportLinks.forEach(link => {
        const supportLink = document.createElement('a');
        supportLink.className = 'support-link';
        supportLink.href = link.url;
        supportLink.target = '_blank';
        supportLink.rel = 'noopener';
        supportLink.innerHTML = `
            <i class="${link.icon}"></i>
            <span>${link.name}</span>
        `;
        container.appendChild(supportLink);
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();

    // Preloader
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Downloads persistentes (localStorage) =====
function getStorageData() {
    try {
        return JSON.parse(localStorage.getItem('builds_site_data') || '{}') || {};
    } catch {
        return {};
    }
}

function saveStorageData(data) {
    localStorage.setItem('builds_site_data', JSON.stringify(data));
}

function getItemDownloads(key, fallback = 0) {
    const data = getStorageData();
    return Number(data[key]?.downloads ?? fallback);
}

function setItemDownloads(key, value) {
    const data = getStorageData();
    data[key] = data[key] || {};
    data[key].downloads = value;
    saveStorageData(data);
}

function getTotalDownloads() {
    const data = getStorageData();
    return Object.values(data).reduce((acc, item) => acc + Number(item.downloads || 0), 0);
}

function syncConfigDownloadsToStorage() {
    if (config.builds) {
        config.builds.forEach(b => {
            const key = `build_${b.id}`;
            const stored = getItemDownloads(key, b.downloads || 0);
            b.downloads = stored;
            setItemDownloads(key, stored);
        });
    }
    if (config.modulos) {
        config.modulos.forEach(m => {
            const key = `module_${m.id}`;
            const stored = getItemDownloads(key, m.downloads || 0);
            m.downloads = stored;
            setItemDownloads(key, stored);
        });
    }
}

function updateTotalDownloadsUI() {
    const el = document.getElementById('total-downloads-count');
    if (el) el.textContent = getTotalDownloads().toLocaleString(currentLang === 'pt-BR' ? 'pt-BR' : 'en-US');
}

// Atualizar textos extras por idioma
const extraTranslations = {
    'pt-BR': { 'total-downloads-text': 'downloads totais', 'modules-title': 'Módulos', 'modules-description': 'Módulos personalizados para expandir e melhorar suas builds' },
    'en': { 'total-downloads-text': 'total downloads', 'modules-title': 'Modules', 'modules-description': 'Custom modules to expand and improve your builds' }
};

function updateExtraTexts() {
    const t = extraTranslations[currentLang];
    const totalTxt = document.getElementById('total-downloads-text');
    const modTitle = document.getElementById('modules-title');
    const modDesc = document.getElementById('modules-description');
    if (totalTxt) totalTxt.textContent = t['total-downloads-text'];
    if (modTitle) modTitle.textContent = t['modules-title'];
    if (modDesc) modDesc.textContent = t['modules-description'];
}

// Sobrescrever updateLanguage para incluir extras
const _oldUpdateLanguage = updateLanguage;
updateLanguage = function() {
    _oldUpdateLanguage();
    updateExtraTexts();
    updateTotalDownloadsUI();
};

// Carregar módulos
function loadModules() {
    const container = document.getElementById('modules-container');
    if (!container) return;
    if (!config.modulos || config.modulos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);">Nenhum módulo cadastrado no momento.</p>';
        return;
    }
    container.innerHTML = '';
    const t = translations[currentLang];

    config.modulos.forEach((module, index) => {
        const name = module.name[currentLang] || module.name['pt-BR'] || 'Módulo';
        const description = module.description[currentLang] || module.description['pt-BR'] || '';
        const image = module.image || 'https://via.placeholder.com/400x200/12121a/a855f7?text=Module';
        const tags = (module.tags?.[currentLang] || module.tags?.['pt-BR'] || []).map(tag => `<span class="module-tag">${tag}</span>`).join('');
        const downloads = Number(module.downloads || 0);

        const card = document.createElement('div');
        card.className = 'module-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img class="module-image" src="${image}" alt="${name}" onerror="this.src='https://via.placeholder.com/400x200/12121a/a855f7?text=Module'">
            <div class="module-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="module-tags">${tags}</div>
                <div class="module-downloads"><i class="fas fa-download"></i> <span id="module-downloads-${module.id}">${downloads.toLocaleString(currentLang === 'pt-BR' ? 'pt-BR' : 'en-US')}</span></div>
                <a href="${module.download_url || '#'}" class="download-btn" target="_blank" rel="noopener" data-type="module" data-id="${module.id}">
                    <i class="fas fa-download"></i> ${t['download']}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Atualizar cards de download e persistir
function attachDownloadCounters() {
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const id = btn.dataset.id;
            if (!type || !id) return;
            const prefix = type === 'module' ? 'module_' : 'build_';
            const key = `${prefix}${id}`;
            const data = getStorageData();
            const current = Number(data[key]?.downloads || 0) + 1;
            data[key] = { downloads: current };
            saveStorageData(data);

            const counterId = type === 'module' ? `module-downloads-${id}` : `build-downloads-${id}`;
            const el = document.getElementById(counterId);
            if (el) el.textContent = current.toLocaleString(currentLang === 'pt-BR' ? 'pt-BR' : 'en-US');

            updateTotalDownloadsUI();
        });
    });
}

// Sobrescrever loadBuilds para mostrar contador
const _oldLoadBuilds = loadBuilds;
loadBuilds = function() {
    const container = document.getElementById('builds-container');
    if (!config.builds || config.builds.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 1.1rem;">Nenhuma build disponível no momento.</p>';
        return;
    }
    container.innerHTML = '';
    const t = translations[currentLang];
    config.builds.forEach((build, index) => {
        const name = build.name[currentLang] || build.name['pt-BR'] || 'Build';
        const description = build.description[currentLang] || build.description['pt-BR'] || '';
        const date = build.date || 'N/A';
        const image = build.image || 'https://via.placeholder.com/400x220/12121a/a855f7?text=Build+Image';
        const version = build.version || '1.0.0';
        const downloads = Number(build.downloads || 0);
        const card = document.createElement('div');
        card.className = 'build-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <img src="${image}" alt="${name}" class="build-image" onerror="this.src='https://via.placeholder.com/400x220/12121a/a855f7?text=Build+Image'">
            <div class="build-content">
                <h3>${name}</h3>
                <span class="build-version">v${version}</span>
                <p>${description}</p>
                <p class="build-date"><i class="far fa-calendar"></i> ${formatDate(date)}</p>
                <div class="module-downloads"><i class="fas fa-download"></i> <span id="build-downloads-${build.id}">${downloads.toLocaleString(currentLang === 'pt-BR' ? 'pt-BR' : 'en-US')}</span></div>
                <a href="${build.download_url || '#'}" class="download-btn" target="_blank" rel="noopener" data-type="build" data-id="${build.id}">
                    <i class="fas fa-download"></i> ${t['download']}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
    attachDownloadCounters();
};

// Sobrescrever initializeSite para módulos e contadores
const _oldInitializeSite = initializeSite;
initializeSite = function() {
    updateLanguage();
    syncConfigDownloadsToStorage();
    loadBuilds();
    loadModules();
    loadTeam();
    loadDonation();
    loadSupport();
    updateTotalDownloadsUI();
    initCursorGlow();
    initHeaderScroll();
    initScrollAnimations();
};
