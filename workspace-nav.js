(function () {
  'use strict';

  const workspaceRoutes = {
    dashboard: ['.hero-strip', '#userDashboardSection'],
    appstore: ['.appstore-section'],
    runtime: ['#runtime'],
    request: ['#request'],
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

  function q(selector) { return document.querySelector(selector); }
  function qa(selector) { return Array.from(document.querySelectorAll(selector)); }

  function setDrawer(open) {
    document.body.classList.toggle('hu-mobile-nav-open', !!open);
    document.body.classList.toggle('hu-mobile-nav-lock', !!open);
    const toggle = q('.mobile-nav-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(!!open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      toggle.innerHTML = open ? '✕ <span>닫기</span>' : '☰ <span>메뉴</span>';
    }
  }

  function setActiveWorkspaceLink(route) {
    qa('[data-workspace-route]').forEach((link) => {
      link.classList.toggle('active', link.dataset.workspaceRoute === route);
      if (link.dataset.workspaceRoute === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function showWorkspaceRoute(route, options) {
    const opts = options || {};
    const selected = workspaceRoutes[route] ? route : 'dashboard';

    Object.values(workspaceRoutes).flat().forEach((selector) => {
      qa(selector).forEach((el) => el.classList.add('workspace-hidden'));
    });
    workspaceRoutes[selected].forEach((selector) => {
      qa(selector).forEach((el) => el.classList.remove('workspace-hidden'));
    });

    setActiveWorkspaceLink(selected);
    if (selected === 'admin') showAdminRoute('overview');

    if (opts.updateHash !== false) {
      history.replaceState(null, '', '#' + selected);
    }
    if (opts.scroll !== false) window.scrollTo(0, 0);
    return selected;
  }

  function showAdminRoute(route) {
    const selected = adminRoutes[route] ? route : 'overview';
    Object.values(adminRoutes).forEach((selector) => {
      qa(selector).forEach((el) => el.classList.add('admin-panel-hidden'));
    });
    qa(adminRoutes[selected]).forEach((el) => el.classList.remove('admin-panel-hidden'));
    qa('[data-admin-route]').forEach((button) => {
      button.classList.toggle('active', button.dataset.adminRoute === selected);
    });
  }

  function bindWorkspaceLinks() {
    qa('[data-workspace-route]').forEach((link) => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const route = link.dataset.workspaceRoute;
        showWorkspaceRoute(route);
        requestAnimationFrame(() => setDrawer(false));
      }, false);
    });
  }

  function bindAdminButtons() {
    qa('[data-admin-route]').forEach((button) => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        showAdminRoute(button.dataset.adminRoute);
      }, false);
    });
  }

  function init() {
    const toggle = q('.mobile-nav-toggle');
    const backdrop = q('[data-mobile-nav-close]');
    const sideNav = q('.side-nav');

    if (toggle) {
      toggle.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setDrawer(!document.body.classList.contains('hu-mobile-nav-open'));
      }, false);
    }

    if (backdrop) {
      backdrop.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        setDrawer(false);
      }, false);
    }

    if (sideNav) {
      sideNav.addEventListener('click', function (event) {
        event.stopPropagation();
      }, false);
    }

    bindWorkspaceLinks();
    bindAdminButtons();

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setDrawer(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setDrawer(false);
    });

    window.addEventListener('hashchange', function () {
      const route = location.hash.replace('#', '');
      if (workspaceRoutes[route]) showWorkspaceRoute(route, { updateHash: false, scroll: false });
    });

    window.addEventListener('master-auth-role-changed', function (event) {
      const isAdmin = !!(event.detail && event.detail.isAdmin);
      if (!isAdmin && q('[data-workspace-route="admin"].active')) {
        showWorkspaceRoute('dashboard');
      }
    });

    const initial = location.hash.replace('#', '');
    showWorkspaceRoute(workspaceRoutes[initial] ? initial : 'dashboard', { updateHash: false, scroll: false });
    showAdminRoute('overview');
    setDrawer(false);

    window.MasterWorkspace = {
      showRoute: showWorkspaceRoute,
      showAdminRoute,
      openMobileNav: function () { setDrawer(true); },
      closeMobileNav: function () { setDrawer(false); },
      toggleMobileNav: function () { setDrawer(!document.body.classList.contains('hu-mobile-nav-open')); }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
