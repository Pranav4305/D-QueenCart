// shared.js

const ADMIN_EMAIL = 'admin@D-QueenCart.in';

// ── Nav Auth (shows Hi, Admin or Hi, UserName) ──────────────
function initNavAuth() {
  const navSignIn = document.getElementById('navSignIn');
  const navUser = document.getElementById('navUser');
  const navUserName = document.getElementById('navUserName');
  const adminBtn = document.getElementById('navAdminBtn');

  function applyUser(name, isAdmin) {
    if (navSignIn) navSignIn.style.display = 'none';
    if (navUser) navUser.style.display = 'flex';
    if (navUserName) navUserName.textContent = 'Hi, ' + name.split(' ')[0];
    if (adminBtn) adminBtn.style.display = isAdmin ? 'inline-block' : 'none';
  }

  const isAdminSession = sessionStorage.getItem('D-QueenCart_admin') === '1';
  if (isAdminSession) { applyUser('Admin', true); return; }

  try {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
      firebase.auth().onAuthStateChanged(u => {
        if (u) {
          const isAdminFirebase = u.email === ADMIN_EMAIL;
          applyUser(u.displayName || u.email.split('@')[0] || 'User', isAdminFirebase);
        } else { checkLocalUser(); }
      });
    } else { checkLocalUser(); }
  } catch { checkLocalUser(); }

  function checkLocalUser() {
    const su = JSON.parse(localStorage.getItem('dqueencart_user') || 'null');
    if (su && su.name) { applyUser(su.name, su.role === 'admin'); }
  }
}

// ── Shared Account Routing ──────────────────────────────────
window.goToAccount = function(e) {
  if (e) e.preventDefault();
  const isAdmin = sessionStorage.getItem('D-QueenCart_admin') === '1';
  if (isAdmin) { window.location.href = "admin.html"; return; }
  const storedUser = JSON.parse(localStorage.getItem('dqueencart_user') || 'null');
  if (storedUser && storedUser.role === 'admin') { window.location.href = "admin.html"; }
  else { window.location.href = "auth.html"; }
}

// ── Shared Toast Notification ───────────────────────────────
window.showToast = function(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg; 
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Centralized Initialization ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Wait a tick for other scripts to load if needed
  setTimeout(() => {
    initNavAuth();
  }, 50);
});
