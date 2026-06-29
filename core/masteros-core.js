/* MasterOS Platform Core - STEP12
   공통 상수와 안전 유틸리티 모음입니다.
   기존 화면 로직을 깨뜨리지 않기 위해 전역 오염을 최소화하고 window.MasterOSCore로만 노출합니다.
*/
export const MASTEROS_VERSION = 'STEP12 Platform Core v1';

export function safeText(value, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

export function safeKey(value, fallback = 'item') {
  const raw = safeText(value, fallback).trim().toLowerCase();
  const normalized = raw
    .replace(/[.#$\[\]\/]/g, '-')
    .replace(/[,\s:;|\\]+/g, '-')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');
  return normalized || fallback;
}

export function showToast(message, type = 'info') {
  const text = safeText(message, '알림');
  const toast = document.createElement('div');
  toast.className = `masteros-toast masteros-toast-${type}`;
  toast.textContent = text;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}

export function setLoading(element, isLoading, label = '처리 중') {
  if (!element) return;
  if (isLoading) {
    element.dataset.originalText = element.textContent;
    element.textContent = label;
    element.disabled = true;
  } else {
    element.textContent = element.dataset.originalText || element.textContent;
    element.disabled = false;
  }
}

window.MasterOSCore = { MASTEROS_VERSION, safeText, safeKey, showToast, setLoading };
console.info(`[MasterOS] ${MASTEROS_VERSION} loaded`);
