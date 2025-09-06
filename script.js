// EcoFinds Welcome Page Scripts
let isLoggedIn = false;

function renderButtons() {
  const container = document.getElementById('auth-buttons');
  if (!container) return;
  container.innerHTML = '';
  if (isLoggedIn) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = logout;
    const profileBtn = document.createElement('button');
    profileBtn.className = 'btn';
    profileBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>';
    profileBtn.onclick = goToProfile;
    container.appendChild(logoutBtn);
    container.appendChild(profileBtn);
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn';
    loginBtn.textContent = 'Login';
    loginBtn.onclick = login;
    const signupBtn = document.createElement('button');
    signupBtn.className = 'btn';
    signupBtn.textContent = 'Sign Up';
    signupBtn.onclick = signup;
    container.appendChild(loginBtn);
    container.appendChild(signupBtn);
  }
}

function login() {
  isLoggedIn = true;
  renderButtons();
  console.log('User logging in');
  window.location.href = './pages/login.html';
}

function signup() {
  isLoggedIn = true;
  renderButtons();
  console.log('User signing up');
  window.location.href = './pages/signup.html';
}

function logout() {
  isLoggedIn = false;
  renderButtons();
  console.log('User logging out');
  window.location.href = 'index.html';
}

function goToProfile() {
  console.log('Navigating to Home Page');
  window.location.href = './pages/home.html';
}

// Theme toggle logic (persistent across site)
function setTheme(dark) {
  if (dark) {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
  } else {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', 'inactive');
  }
}

function updateThemeToggleIcon() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  const svg = themeToggle.querySelectorAll('svg');
  if (svg.length === 2) {
    svg[0].style.display = document.body.classList.contains('darkmode') ? 'none' : 'block';
    svg[1].style.display = document.body.classList.contains('darkmode') ? 'block' : 'none';
  }
}

window.addEventListener('DOMContentLoaded', function() {
  setTheme(localStorage.getItem('darkmode') === 'active');
  updateThemeToggleIcon();
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDark = document.body.classList.contains('darkmode');
      setTheme(!isDark);
      updateThemeToggleIcon();
    });
  }
});

renderButtons();
