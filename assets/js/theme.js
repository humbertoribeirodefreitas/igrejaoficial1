// Tema claro/escuro simples para o site

document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Função para aplicar o tema salvo
  function applyTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  // Carregar tema salvo
  const savedTheme = localStorage.getItem('siteTheme') || 'light';
  applyTheme(savedTheme);

  // Alternar tema ao clicar no botão
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('siteTheme', newTheme);
    });
  }
});

// Exemplo de CSS para dark-theme (adicione no seu style.css):
// body.dark-theme {
//   background: #181818;
//   color: #f1f1f1;
// }
// body.dark-theme .card { background: #232323; color: #f1f1f1; }
// body.dark-theme .navbar, body.dark-theme .footer { background: #222; color: #fff; } 