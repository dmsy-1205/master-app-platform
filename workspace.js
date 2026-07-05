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
}

document.addEventListener('click', (event) => {
  const workspaceLink = event.target.closest('[data-workspace-route]');
  if (workspaceLink) {
    event.preventDefault();
    showWorkspaceRoute(workspaceLink.dataset.workspaceRoute);
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

window.MasterWorkspace = { showRoute: showWorkspaceRoute, showAdminRoute };
showWorkspaceRoute('dashboard');
showAdminRoute('overview');
