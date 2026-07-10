const workspaceRoutes = {
  dashboard: ['.hero-strip', '#userDashboardSection'],
  appstore: ['.appstore-section'],
  runtime: ['#runtime'],
  request: ['#request'],
  activity: ['#activity'],
  notifications: ['#notifications'],
  feedback: ['#feedback'],
  admin: ['#admin']
};

const adminRoutes = {
  overview: '[data-admin-panel="overview"]',
  qa: '[data-admin-panel="qa"]',
  members: '[data-admin-panel="members"]',
  approval: '[data-admin-panel="approval"]',
  data: '[data-admin-panel="data"]',
  logs: '[data-admin-panel="logs"]',
  apps: '[data-admin-panel="apps"]',
  details: '[data-admin-panel="details"]',
  official: '[data-admin-panel="official"]',
  deployment: '[data-admin-panel="deployment"]',
  health: '[data-admin-panel="health"]',
  backup: '[data-admin-panel="backup"]',
  developer: '[data-admin-panel="developer"]',
  statistics: '[data-admin-panel="statistics"]',
  security: '[data-admin-panel="security"]',
  tools: '[data-admin-panel="tools"]'
};

function setActiveLink(route) {
  document.querySelectorAll('[data-workspace-route]').forEach((link) => {
    link.classList.toggle('active', link.dataset.workspaceRoute === route);
  });
}

function setMobileNav(open) {
  document.body.classList.toggle('hu-mobile-nav-open', Boolean(open));
  const toggle = document.querySelector('.mobile-nav-toggle');
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
    toggle.innerHTML = open ? '✕ <span>닫기</span>' : '☰ <span>메뉴</span>';
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
}

function closeMobileNav() { setMobileNav(false); }
function toggleMobileNav() { setMobileNav(!document.body.classList.contains('hu-mobile-nav-open')); }

function showWorkspaceRoute(route = 'dashboard', options = {}) {
  const selected = workspaceRoutes[route] ? route : 'dashboard';
  Object.values(workspaceRoutes).flat().forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('workspace-hidden'));
  });
  workspaceRoutes[selected].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove('workspace-hidden'));
  });
  setActiveLink(selected);
  if (selected === 'admin') showAdminRoute('overview');
  if (options.updateHash !== false) history.replaceState(null, '', `#${selected}`);
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });
  return selected;
}

function showAdminRoute(route = 'overview') {
  const selected = adminRoutes[route] ? route : 'overview';
  Object.values(adminRoutes).forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('admin-panel-hidden'));
  });
  document.querySelectorAll(adminRoutes[selected]).forEach((el) => el.classList.remove('admin-panel-hidden'));
  document.querySelectorAll('[data-admin-route]').forEach((button) => {
    button.classList.toggle('active', button.dataset.adminRoute === selected);
  });
  const toolRoutes = new Set(['qa', 'details', 'official', 'deployment', 'health', 'backup', 'developer', 'statistics', 'security', 'tools']);
  document.querySelectorAll('[data-admin-tools-menu]').forEach((menu) => {
    menu.classList.toggle('active', toolRoutes.has(selected));
    if (!toolRoutes.has(selected)) menu.removeAttribute('open');
  });
}

function navigateFromElement(link) {
  const route = link?.dataset?.workspaceRoute;
  if (!route) return false;
  showWorkspaceRoute(route);
  closeMobileNav();
  return true;
}

// Single delegated handler: route first, drawer close second.
document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.mobile-nav-toggle');
  if (toggle) {
    event.preventDefault();
    toggleMobileNav();
    return;
  }

  const closeTarget = event.target.closest('[data-mobile-nav-close]');
  if (closeTarget) {
    event.preventDefault();
    closeMobileNav();
    return;
  }

  const workspaceLink = event.target.closest('[data-workspace-route]');
  if (workspaceLink) {
    event.preventDefault();
    navigateFromElement(workspaceLink);
    return;
  }

  const adminButton = event.target.closest('[data-admin-route]');
  if (adminButton) {
    event.preventDefault();
    showAdminRoute(adminButton.dataset.adminRoute);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});

window.addEventListener('hashchange', () => {
  const route = location.hash.replace('#', '');
  if (workspaceRoutes[route]) showWorkspaceRoute(route, { updateHash: false, scroll: false });
});

window.addEventListener('master-auth-role-changed', (event) => {
  const isAdmin = Boolean(event.detail?.isAdmin);
  if (!isAdmin && document.querySelector('[data-workspace-route="admin"]')?.classList.contains('active')) {
    showWorkspaceRoute('dashboard');
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMobileNav();
});

window.MasterWorkspace = {
  showRoute: showWorkspaceRoute,
  showAdminRoute,
  toggleMobileNav,
  closeMobileNav
};

const initialRoute = location.hash.replace('#', '');
showWorkspaceRoute(workspaceRoutes[initialRoute] ? initialRoute : 'dashboard', { updateHash: false, scroll: false });
showAdminRoute('overview');
