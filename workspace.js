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

function closeMobileNav() {
  document.body.classList.remove('hu-mobile-nav-open');
  document.querySelector('.mobile-nav-toggle')?.setAttribute('aria-expanded', 'false');
}

function toggleMobileNav() {
  const willOpen = !document.body.classList.contains('hu-mobile-nav-open');
  document.body.classList.toggle('hu-mobile-nav-open', willOpen);
  document.querySelector('.mobile-nav-toggle')?.setAttribute('aria-expanded', String(willOpen));
}

function showWorkspaceRoute(route = 'dashboard') {
  const selected = workspaceRoutes[route] ? route : 'dashboard';
  Object.values(workspaceRoutes).flat().forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.add('workspace-hidden'));
  });
  workspaceRoutes[selected].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.remove('workspace-hidden'));
  });
  setActiveLink(selected);
  if (selected === 'admin') showAdminRoute('overview');
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

  const activePanel = document.querySelector(adminRoutes[selected]);
  activePanel?.scrollIntoView({ block: 'start', behavior: 'smooth' });
}


function handleWorkspaceRouteClick(event, link) {
  if (!link) return false;
  event.preventDefault();
  event.stopPropagation();
  const route = link.dataset.workspaceRoute;
  showWorkspaceRoute(route);
  closeMobileNav();
  return true;
}

function bindMobileDrawerRouteLinks() {
  document.querySelectorAll('.side-nav [data-workspace-route]').forEach((link) => {
    if (link.dataset.drawerRouteBound === 'true') return;
    link.dataset.drawerRouteBound = 'true';
    link.setAttribute('role', 'button');
    link.addEventListener('click', (event) => handleWorkspaceRouteClick(event, link), { capture: true });
    link.addEventListener('touchend', (event) => handleWorkspaceRouteClick(event, link), { capture: true, passive: false });
  });
}

document.addEventListener('click', (event) => {
  const navToggle = event.target.closest('.mobile-nav-toggle');
  if (navToggle) {
    event.preventDefault();
    toggleMobileNav();
    return;
  }

  if (event.target.closest('[data-mobile-nav-close]')) {
    event.preventDefault();
    closeMobileNav();
    return;
  }

  const workspaceLink = event.target.closest('[data-workspace-route]');
  if (workspaceLink) {
    handleWorkspaceRouteClick(event, workspaceLink);
    return;
  }

  const adminButton = event.target.closest('[data-admin-route]');
  if (adminButton) {
    event.preventDefault();
    showAdminRoute(adminButton.dataset.adminRoute);
  }
});

window.addEventListener('master-auth-role-changed', (event) => {
  const isAdmin = Boolean(event.detail?.isAdmin);
  if (!isAdmin && document.querySelector('[data-workspace-route="admin"]')?.classList.contains('active')) {
    showWorkspaceRoute('dashboard');
  }
});

window.MasterWorkspace = { showRoute: showWorkspaceRoute, showAdminRoute, toggleMobileNav, closeMobileNav };
bindMobileDrawerRouteLinks();
showWorkspaceRoute('dashboard');
showAdminRoute('overview');


window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMobileNav();
});
