// Verificação de Login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }

    // Carregar dados iniciais
    loadProgramacao();
    loadRedesSociais();
    loadPlaylist();
});

// Funções de Programação
async function loadProgramacao() {
    try {
        const response = await fetch('/api/dados.json');
        const data = await response.json();
        
        const tableBody = document.getElementById('programacaoTable');
        tableBody.innerHTML = '';
        
        data.programacao.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.dia}</td>
                <td>${item.horario}</td>
                <td>${item.atividade}</td>
                <td>${item.local}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="editarProgramacao('${item.dia}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirProgramacao('${item.dia}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        showToast('Erro ao carregar programação', 'error');
    }
}

async function salvarProgramacao() {
    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;
    const atividade = document.getElementById('atividade').value;
    const local = document.getElementById('local').value;

    try {
        // Aqui você implementaria a lógica para salvar no backend
        showToast('Programação salva com sucesso!', 'success');
        loadProgramacao();
        bootstrap.Modal.getInstance(document.getElementById('addProgramacaoModal')).hide();
    } catch (error) {
        showToast('Erro ao salvar programação', 'error');
    }
}

// Funções de Redes Sociais
async function loadRedesSociais() {
    try {
        const response = await fetch('/api/dados.json');
        const data = await response.json();
        
        document.getElementById('instagramUrl').value = data.redes_sociais.instagram;
        document.getElementById('youtubeUrl').value = data.redes_sociais.youtube;
        document.getElementById('facebookUrl').value = data.redes_sociais.facebook;
    } catch (error) {
        showToast('Erro ao carregar redes sociais', 'error');
    }
}

async function salvarRedeSocial(rede) {
    const url = document.getElementById(`${rede}Url`).value;
    
    try {
        // Aqui você implementaria a lógica para salvar no backend
        showToast(`${rede} atualizado com sucesso!`, 'success');
    } catch (error) {
        showToast(`Erro ao atualizar ${rede}`, 'error');
    }
}

// Funções de Playlist
async function loadPlaylist() {
    try {
        const response = await fetch('/api/dados.json');
        const data = await response.json();
        
        document.getElementById('spotifyPlaylist').value = data.musicas.spotify_playlist;
    } catch (error) {
        showToast('Erro ao carregar playlist', 'error');
    }
}

async function salvarPlaylist() {
    const playlistId = document.getElementById('spotifyPlaylist').value;
    
    try {
        // Aqui você implementaria a lógica para salvar no backend
        showToast('Playlist atualizada com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao atualizar playlist', 'error');
    }
}

// Funções de Upload
async function uploadImagens() {
    const fileInput = document.getElementById('imageUpload');
    const files = fileInput.files;
    
    if (files.length === 0) {
        showToast('Selecione pelo menos uma imagem', 'warning');
        return;
    }
    
    try {
        // Aqui você implementaria a lógica para fazer upload no backend
        showToast('Imagens enviadas com sucesso!', 'success');
    } catch (error) {
        showToast('Erro ao enviar imagens', 'error');
    }
}

// Funções de Utilidade
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
});

// Importar módulos da API
import { pageManager } from '../dashboard/api/pages.js';
import { configManager } from '../dashboard/api/config.js';
import { userManager } from '../dashboard/api/users.js';
import { auth } from '../dashboard/api/auth.js';

// Navegação entre seções
class NavigationController {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                
                // Atualizar links ativos
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                // Mostrar seção selecionada
                document.querySelectorAll('.section').forEach(s => s.classList.add('d-none'));
                document.getElementById(section).classList.remove('d-none');
            });
        });
    }
}

// Gerenciamento de Páginas
class PageController {
    constructor() {
        this.pagesList = document.getElementById('pagesList');
        this.editPageModal = document.getElementById('editPageModal');
        this.editPageForm = document.getElementById('editPageForm');
        this.savePageBtn = document.getElementById('savePageBtn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.savePageBtn.addEventListener('click', () => this.savePage());
    }

    async loadPages() {
        try {
            const pages = await pageManager.listPages();
            this.renderPages(pages);
        } catch (error) {
            console.error('Erro ao carregar páginas:', error);
            alert('Erro ao carregar páginas. Por favor, tente novamente.');
        }
    }

    renderPages(pages) {
        this.pagesList.innerHTML = '';
        pages.forEach(page => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${page.title}</td>
                <td>${page.description}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="pageController.editPage('${page.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="pageController.deletePage('${page.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.pagesList.appendChild(row);
        });
    }

    async editPage(pageId) {
        try {
            const page = await pageManager.getPage(pageId);
            document.getElementById('pageId').value = page.id;
            document.getElementById('pageTitle').value = page.title;
            document.getElementById('pageDescription').value = page.description;
            document.getElementById('pageContent').value = page.content;
            
            const modal = new bootstrap.Modal(this.editPageModal);
            modal.show();
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            alert('Erro ao carregar página. Por favor, tente novamente.');
        }
    }

    async savePage() {
        try {
            const pageId = document.getElementById('pageId').value;
            const pageData = {
                title: document.getElementById('pageTitle').value,
                description: document.getElementById('pageDescription').value,
                content: document.getElementById('pageContent').value
            };

            if (pageId) {
                await pageManager.updatePage(pageId, pageData);
            } else {
                await pageManager.createPage(pageData);
            }

            const modal = bootstrap.Modal.getInstance(this.editPageModal);
            modal.hide();
            this.loadPages();
        } catch (error) {
            console.error('Erro ao salvar página:', error);
            alert('Erro ao salvar página. Por favor, tente novamente.');
        }
    }

    async deletePage(pageId) {
        if (confirm('Tem certeza que deseja excluir esta página?')) {
            try {
                await pageManager.deletePage(pageId);
                this.loadPages();
            } catch (error) {
                console.error('Erro ao excluir página:', error);
                alert('Erro ao excluir página. Por favor, tente novamente.');
            }
        }
    }
}

// Gerenciamento de Configurações
class ConfigController {
    constructor() {
        this.configForm = document.getElementById('configForm');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConfig();
        });
    }

    async loadConfig() {
        try {
            const config = await configManager.getAll();
            this.renderConfig(config);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            alert('Erro ao carregar configurações. Por favor, tente novamente.');
        }
    }

    renderConfig(config) {
        Object.entries(config).forEach(([section, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                const input = document.querySelector(`[name="${section}.${key}"]`);
                if (input) input.value = value;
            });
        });
    }

    async saveConfig() {
        try {
            const formData = new FormData(this.configForm);
            const config = {};
            
            for (const [key, value] of formData.entries()) {
                const [section, field] = key.split('.');
                if (!config[section]) config[section] = {};
                config[section][field] = value;
            }

            await configManager.updateAll(config);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            alert('Erro ao salvar configurações. Por favor, tente novamente.');
        }
    }
}

// Gerenciamento de Usuários
class UserController {
    constructor() {
        this.usersList = document.getElementById('usersList');
        this.editUserModal = document.getElementById('editUserModal');
        this.editUserForm = document.getElementById('editUserForm');
        this.saveUserBtn = document.getElementById('saveUserBtn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.saveUserBtn.addEventListener('click', () => this.saveUser());
    }

    async loadUsers() {
        try {
            const users = await userManager.listUsers();
            this.renderUsers(users);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            alert('Erro ao carregar usuários. Por favor, tente novamente.');
        }
    }

    renderUsers(users) {
        this.usersList.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <span class="badge ${user.active ? 'bg-success' : 'bg-danger'}">
                        ${user.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="userController.editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="userController.deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.usersList.appendChild(row);
        });
    }

    async editUser(userId) {
        try {
            const user = await userManager.getUserById(userId);
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userPassword').value = '';
            
            const modal = new bootstrap.Modal(this.editUserModal);
            modal.show();
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            alert('Erro ao carregar usuário. Por favor, tente novamente.');
        }
    }

    async saveUser() {
        try {
            const userId = document.getElementById('userId').value;
            const userData = {
                name: document.getElementById('userName').value,
                username: document.getElementById('userUsername').value,
                email: document.getElementById('userEmail').value,
                role: document.getElementById('userRole').value
            };

            const password = document.getElementById('userPassword').value;
            if (password) userData.password = password;

            if (userId) {
                await userManager.updateUser(userId, userData);
            } else {
                await userManager.createUser(userData);
            }

            const modal = bootstrap.Modal.getInstance(this.editUserModal);
            modal.hide();
            this.loadUsers();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Erro ao salvar usuário. Por favor, tente novamente.');
        }
    }

    async deleteUser(userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await userManager.deactivateUser(userId);
                this.loadUsers();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário. Por favor, tente novamente.');
            }
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!auth.requireAuth()) {
        return;
    }

    // Verificar permissões
    const user = auth.getCurrentUser();
    if (!user) {
        return;
    }

    // Inicializar controladores
    window.navigationController = new NavigationController();
    window.pageController = new PageController();
    window.configController = new ConfigController();
    window.userController = new UserController();

    // Carregar dados iniciais
    pageController.loadPages();
    configController.loadConfig();
    userController.loadUsers();
}); 