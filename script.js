document.addEventListener('DOMContentLoaded', () => {
    fetch('data/pt-br.json')
        .then(response => {
            if (!response.ok) throw new Error("Falha ao carregar pt-br.json");
            return response.json();
        })
        .then(data => {
            buildPage(data);
            createStarryNightEffect();
        })
        .catch(error => {
            console.error('Erro fatal ao carregar ou processar os dados:', error);
            document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-family: sans-serif;"><h1>Erro ao carregar o site</h1><p>Não foi possível carregar os dados de configuração (pt-br.json).</p></div>`;
        });
});

function buildPage(data) {
    document.title = data.general.siteName;
    document.getElementById('logo').src = data.general.logo;
    document.getElementById('favicon').href = data.general.favicon;

    const nav = document.getElementById('main-nav');
    let navHtml = '';
    data.navigation.forEach(item => {
                navHtml += `
            <a href="${item.link}">
                ${item.icon ? `<img src="${item.icon}" alt="${item.name} icon">` : ''}
                <span>${item.name}</span>
            </a>
        `;
    });
    nav.innerHTML = navHtml;

    loadHome(data.home);
    loadAbout(data.about);
    loadContents(data.contents);
    loadSchedule(data.schedule);
    loadLinks(data.importantLinks);
    loadFooter(data.footer, data.importantLinks.social);
    const navLinks = document.querySelectorAll('#main-nav a');
    const pageSections = document.querySelectorAll('.page-section');

    function syncPageWithHash() {
        const targetId = window.location.hash || '#home';

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetId);
        });

        pageSections.forEach(section => {
            section.classList.toggle('active', '#' + section.id === targetId);
        });
        
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            window.location.hash = targetId;
        });
    });

    window.addEventListener('hashchange', syncPageWithHash);

    syncPageWithHash();
}

function createStarryNightEffect() {
    const backgroundContainer = document.getElementById('starrynight-bg-container');
    if (!backgroundContainer) return;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    const r = document.documentElement;
    const rs = window.getComputedStyle(r);

    const canvasSize = backgroundContainer.clientWidth * backgroundContainer.clientHeight;
    const starsFraction = canvasSize / 4000;
    for (let i = 0; i < starsFraction; i++) {
        const size = Math.random() < 0.5 ? 1 : 2;
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.left = `${random(0, 100)}%`;
        star.style.top = `${random(0, 100)}%`;
        star.style.opacity = random(0.5, 1);
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = rs.getPropertyValue('--spice-star').trim();
        star.style.zIndex = '-1';
        star.style.borderRadius = '50%';

        if (Math.random() < 1 / 5) {
            const animName = `twinkle${Math.floor(Math.random() * 4) + 1}`;
            star.style.animation = `${animName} 5s infinite`;
        }
        backgroundContainer.appendChild(star);
    }

    for (let i = 0; i < 4; i++) {
        const shootingstar = document.createElement('span');
        shootingstar.className = 'shootingstar';

        if (Math.random() < 0.75) {
            shootingstar.style.top = '-4px';
            shootingstar.style.right = `${random(0, 90)}%`;
        } else {
            shootingstar.style.top = `${random(0, 50)}%`;
            shootingstar.style.right = '-4px';
        }

        const glowColor = `rgba(${rs.getPropertyValue('--spice-rgb-shooting-star-glow').trim()}, 0.1)`;
        shootingstar.style.boxShadow = `0 0 0 4px ${glowColor}, 0 0 0 8px ${glowColor}, 0 0 20px ${glowColor}`;
        shootingstar.style.animationDuration = `${Math.floor(Math.random() * 3) + 3}s`;
        shootingstar.style.animationDelay = `${Math.floor(Math.random() * 7)}s`;

        backgroundContainer.appendChild(shootingstar);

        shootingstar.addEventListener('animationend', () => {
            if (Math.random() < 0.75) {
                shootingstar.style.top = '-4px';
                shootingstar.style.right = `${random(0, 90)}%`;
            } else {
                shootingstar.style.top = `${random(0, 50)}%`;
                shootingstar.style.right = '-4px';
            }
            shootingstar.style.animation = 'none';
            void shootingstar.offsetWidth;
            shootingstar.style.animation = '';
            shootingstar.style.animationDuration = `${Math.floor(Math.random() * 4) + 3}s`;
        });
    }
}

function loadHome(homeData) {
    const section = document.getElementById('home');
    
    let buttonsHtml = homeData.buttons.map(btn => `
        <a href="${btn.link}" class="button-item" target="_blank" rel="noopener noreferrer">
            <img src="${btn.icon}" class="button-icon" alt="">
            <span>${btn.text}</span>
        </a>
    `).join('');

    let iconsHtml = homeData.icons.map(iconUrl => `
        <div class="home-icon" style="-webkit-mask-image: url(${iconUrl}); mask-image: url(${iconUrl});"></div>
    `).join('');

    section.innerHTML = `
        <div class="container">
            <h1 style="color: var(--button-primary-bg);">${homeData.title}</h1>
            <p style="color: var(--text-color);">${homeData.subtitle}</p>
            
            <div class="home-layout">
                <div class="home-image-container">
                    <img src="${homeData.mainImage}" alt="Yuzuki Home">
                </div>
                <div class="home-buttons-container">
                    ${buttonsHtml}
                </div>
            </div>

            <div class="home-icons">${iconsHtml}</div>
        </div>`;
}


function loadAbout(aboutData) {
    const section = document.getElementById('sobre');
    let statsHtml = aboutData.stats.map(stat => `<div class="stat-item"><div class="value">${stat.value}</div><div class="label">${stat.label}</div></div>`).join('');
    section.innerHTML = `
        <div class="container">
            <div class="about-content">
                <h2>${aboutData.name}</h2>
                <p class="tagline">${aboutData.description}</p>
                <div class="stats">${statsHtml}</div>
                <div class="bio">${aboutData.bio.map(paragraph => `<p>${paragraph}</p>`).join('')}</div>
            </div>
            <div class="about-image"><img src="${aboutData.image}" alt="Sobre Yuzuki"></div>
        </div>`;
}

function loadContents(contentsData) {
    const section = document.getElementById('conteudos');
    let contentHTML = `<div class="container"><h2 class="section-title">${contentsData.title}</h2>`;
    function getYoutubeVideoId(url) {
        if (!url) return '';
        const match = url.match(/(?:v=|youtu\.be\/|embed\/|\/v\/)([^&?]+)/);
        return match ? match[1] : '';
    }
    contentsData.sections.forEach(contentSection => {
        contentHTML += `<h3 class="clips-container-title">${contentSection.title}</h3><div class="videos-grid">`;
        contentSection.items.forEach(item => {
            let thumbnailUrl = 'assets/images/placeholder.png';
            if (contentSection.platform === 'youtube') {
                const videoId = getYoutubeVideoId(item.url);
                if (videoId) thumbnailUrl = `http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            } else if (item.thumbnail) {
                thumbnailUrl = item.thumbnail;
            }
            contentHTML += `
                <div class="video-card">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                        <img src="${thumbnailUrl}" alt="${item.title}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/placeholder.png';">
                        <h3>${item.title || ''}</h3>
                    </a>
                </div>`;
        });
        contentHTML += `</div>`;
    });
    contentHTML += `</div>`;
    section.innerHTML = contentHTML;
}

function loadSchedule(scheduleData) {
    const section = document.getElementById('agenda');
    if (!scheduleData) return;

    let tableRowsHtml = scheduleData.days.map(day => `
        <tr>
            <td>${day.day}</td>
            <td>${day.program}</td>
        </tr>
    `).join('');

    section.innerHTML = `
        <div class="container">
            <h2 class="section-title">${scheduleData.title}</h2>
            <div class="schedule-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Dia da Semana</th>
                            <th>Programação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function loadLinks(linksData) {
    if (!linksData) return;
    const section = document.getElementById('links');

    let socialCardsHtml = linksData.social.map(social => `
        <a href="${social.url}" class="social-card" target="_blank" rel="noopener noreferrer">
            <img src="${social.icon}" alt="${social.name}">
            <span>${social.name}</span>
        </a>
    `).join('');

    let supportCardsHtml = linksData.support.map(support => `
        <a href="${support.link}" class="support-card" target="_blank" rel="noopener noreferrer">
            <div class="support-card-icon">
                <img src="${support.icon}" alt="${support.text}">
            </div>
            <div class="support-card-text">
                <strong>${support.text}</strong>
                ${support.description ? `<small>${support.description}</small>` : ''}
            </div>
        </a>
    `).join('');

    section.innerHTML = `
        <div class="container">
            <h2 class="section-title">${linksData.title}</h2>
            <p class="links-subtitle">${linksData.subtitle}</p>

            <div class="links-group">
                <h3>Redes Sociais</h3>
                <div class="social-grid">${socialCardsHtml}</div>
            </div>

            <div class="links-group">
                <h3>Apoie o Canal</h3>
                <div class="support-grid">${supportCardsHtml}</div>
            </div>
            
            <div class="links-footer-images">
                <img src="${linksData.mascotImage}" alt="Mascote Yuzuki">
                <img src="${linksData.characterImage}" alt="Yuzuki Personagem">
            </div>
        </div>
    `;
}

function loadFooter(footerData, socialData) {
    if (!footerData) return;
    const footerElement = document.getElementById('page-footer');

    let socialLinksHtml = socialData.map(social => `
        <a href="${social.url}" target="_blank" rel="noopener noreferrer" title="${social.name}">
            <img src="${social.icon}" alt="${social.name} icon">
        </a>
    `).join('');

    footerElement.innerHTML = `
        <div class="container">
            <div class="footer-layout">
                <div class="footer-info-column">
                    <h4>${footerData.contactTitle}</h4>
                    <p class="footer-description">Para propostas comerciais, parcerias ou dúvidas, preencha o formulário ao lado ou envie um email direto.</p>
                    <div class="footer-contact-info">
                        <a href="mailto:${footerData.contactEmail}">${footerData.contactEmail}</a>
                    </div>
                    <div class="footer-socials">${socialLinksHtml}</div>
                </div>

                <div class="footer-form-column">
                    <form id="contact-form" action="https://formspree.io/f/YOUR_UNIQUE_ID" method="POST">
                        <div class="form-group">
                            <label for="form-name">Seu Nome</label>
                            <input type="text" id="form-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="form-email">Seu Email</label>
                            <input type="email" id="form-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="form-message">Mensagem</label>
                            <textarea id="form-message" name="message" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="form-submit-button">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
            <p class="copyright">${footerData.copyrightText}</p>
        </div>
    `;
}