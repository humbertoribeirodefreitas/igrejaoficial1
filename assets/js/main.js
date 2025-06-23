import { configManager } from '../dashboard/api/config.js';

// Gerenciamento geral do site
class SiteManager {
    constructor() {
        this.initializeSite();
    }

    async initializeSite() {
        try {
            const config = await configManager.getAll();
            this.updateSiteInfo(config);
            this.updateContactInfo(config);
            this.updateSocialLinks(config);
            this.updateServiceTimes(config);
        } catch (error) {
            console.error('Erro ao inicializar site:', error);
        }
    }

    updateSiteInfo(config) {
        // Atualizar título
        document.title = config.site.name;

        // Atualizar logo
        const logo = document.querySelector('.navbar-brand img');
        if (logo) {
            logo.src = config.site.logo;
            logo.alt = config.site.name;
        }

        // Atualizar favicon
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = config.site.favicon;
        }

        // Atualizar descrição
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.content = config.site.description;
        }
    }

    updateContactInfo(config) {
        // Atualizar endereço
        const address = document.querySelector('.contact-address');
        if (address) {
            address.textContent = config.contact.address;
        }

        // Atualizar telefone
        const phone = document.querySelector('.contact-phone');
        if (phone) {
            phone.textContent = config.contact.phone;
            phone.href = `tel:${config.contact.phone.replace(/\D/g, '')}`;
        }

        // Atualizar e-mail
        const email = document.querySelector('.contact-email');
        if (email) {
            email.textContent = config.contact.email;
            email.href = `mailto:${config.contact.email}`;
        }

        // Atualizar WhatsApp
        const whatsapp = document.querySelector('.contact-whatsapp');
        if (whatsapp) {
            whatsapp.href = `https://wa.me/${config.contact.whatsapp.replace(/\D/g, '')}`;
        }
    }

    updateSocialLinks(config) {
        // Atualizar Instagram
        const instagram = document.querySelector('.social-instagram');
        if (instagram) {
            instagram.href = config.social.instagram;
        }

        // Atualizar YouTube
        const youtube = document.querySelector('.social-youtube');
        if (youtube) {
            youtube.href = config.social.youtube;
        }

        // Atualizar Facebook
        const facebook = document.querySelector('.social-facebook');
        if (facebook) {
            facebook.href = config.social.facebook;
        }
    }

    updateServiceTimes(config) {
        // Atualizar horários de cultos
        const cultos = document.querySelector('.service-times');
        if (cultos) {
            let html = '';
            
            // Domingo
            if (config.cultos.domingo) {
                html += `
                    <div class="service-time">
                        <h5>Domingo</h5>
                        <p>Manhã: ${config.cultos.domingo.manha}</p>
                        <p>Noite: ${config.cultos.domingo.noite}</p>
                    </div>
                `;
            }

            // Quarta
            if (config.cultos.quarta) {
                html += `
                    <div class="service-time">
                        <h5>Quarta</h5>
                        <p>Noite: ${config.cultos.quarta.noite}</p>
                    </div>
                `;
            }

            // Sábado
            if (config.cultos.sabado) {
                html += `
                    <div class="service-time">
                        <h5>Sábado</h5>
                        <p>Noite: ${config.cultos.sabado.noite}</p>
                    </div>
                `;
            }

            cultos.innerHTML = html;
        }
    }
}

// Inicializar gerenciador do site
const siteManager = new SiteManager();

// Configuração do tema
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Verificar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Alternar tema
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Carregar programação semanal
    loadProgramacaoSemanal();
});

// Função para carregar programação semanal
async function loadProgramacaoSemanal() {
    try {
        const programacaoContainer = document.getElementById('programacao-semanal');
        if (!programacaoContainer) return;

        // Dados de exemplo (substituir por dados reais posteriormente)
        const data = {
            programacao: [
                {
                    dia: 'Domingo',
                    horario: '09:00',
                    atividade: 'Escola Dominical',
                    local: 'Templo Principal'
                },
                {
                    dia: 'Domingo',
                    horario: '10:30',
                    atividade: 'Culto de Adoração',
                    local: 'Templo Principal'
                },
                {
                    dia: 'Quarta',
                    horario: '19:30',
                    atividade: 'Culto de Ensino',
                    local: 'Templo Principal'
                },
                {
                    dia: 'Sexta',
                    horario: '19:30',
                    atividade: 'Culto de Jovens',
                    local: 'Templo Principal'
                }
            ]
        };
        
        data.programacao.forEach(item => {
            const card = createProgramacaoCard(item);
            programacaoContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar programação:', error);
    }
}

// Função para criar card de programação
function createProgramacaoCard(item) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3 mb-4';
    
    col.innerHTML = `
        <div class="card programacao-card">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <i class="fas ${getIconForDay(item.dia)} fa-2x me-3"></i>
                    <h5 class="card-title mb-0">${item.dia}</h5>
                </div>
                <p class="card-text">
                    <strong>Horário:</strong> ${item.horario}<br>
                    <strong>Atividade:</strong> ${item.atividade}<br>
                    <strong>Local:</strong> ${item.local}
                </p>
            </div>
        </div>
    `;
    
    return col;
}

// Função para obter ícone baseado no dia
function getIconForDay(dia) {
    const icons = {
        'Segunda': 'fa-calendar-day',
        'Terça': 'fa-calendar-day',
        'Quarta': 'fa-calendar-day',
        'Quinta': 'fa-calendar-day',
        'Sexta': 'fa-calendar-day',
        'Sábado': 'fa-calendar-week',
        'Domingo': 'fa-church'
    };
    
    return icons[dia] || 'fa-calendar';
}

// Função para criar texto animado
function createMarqueeText(text) {
    const marquee = document.createElement('div');
    marquee.className = 'marquee-text';
    marquee.innerHTML = `<span>${text}</span>`;
    return marquee;
}

// Adicionar texto animado ao carregar a página
window.addEventListener('load', function() {
    const textos = [
        "Bem-vindo à Igreja Admac",
        "Um lugar de fé, esperança e amor",
        "Venha nos visitar e fazer parte da nossa família"
    ];
    
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'container mt-4';
    
    textos.forEach(text => {
        const marquee = createMarqueeText(text);
        marqueeContainer.appendChild(marquee);
    });
    
    document.body.insertBefore(marqueeContainer, document.querySelector('footer'));
}); 