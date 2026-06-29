import { db, auth } from './firebase.js';
import { ref, push, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const feedbackType = document.getElementById('feedbackType');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackContent = document.getElementById('feedbackContent');
const feedbackSubmitBtn = document.getElementById('feedbackSubmitBtn');
const feedbackRefreshBtn = document.getElementById('feedbackRefreshBtn');
const feedbackResult = document.getElementById('feedbackResult');
const feedbackList = document.getElementById('feedbackList');

let cachedFeedback = {};
let feedbackRealtimeStarted = false;
let currentIsAdmin = false;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('ko-KR');
}

function typeLabel(type) {
  return { bug: '버그', request: '기능 요청', question: '질문', improvement: '개선사항', notice: '공지', ui: '화면 개선', etc: '기타' }[type] || type || '기타';
}

function statusLabel(status) {
  return { open: '접수', checking: '검토중', developing: '개발중', done: '완료', closed: '보류' }[status] || '접수';
}

function renderFeedback() {
  if (!feedbackList) return;
  const rows = Object.entries(cachedFeedback || {})
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  if (!rows.length) {
    feedbackList.innerHTML = '<p class="placeholder-text">등록된 요청이나 버그가 아직 없습니다.</p>';
    return;
  }

  feedbackList.innerHTML = rows.map(item => `
    <article class="feedback-item status-${escapeHtml(item.status || 'open')}">
      <div class="feedback-item-head">
        <span class="feedback-type">${escapeHtml(typeLabel(item.type))}</span>
        <strong>${escapeHtml(item.title || '제목 없음')}</strong>
        <span class="member-pill status-${escapeHtml(item.status || 'open')}">${escapeHtml(statusLabel(item.status || 'open'))}</span>
      </div>
      <p>${escapeHtml(item.content || '')}</p>
      ${item.adminReply ? `<div class="feedback-reply"><strong>관리자 답변</strong><p>${escapeHtml(item.adminReply)}</p></div>` : ''}
      <small>${escapeHtml(item.email || '알 수 없음')} · ${formatDate(item.createdAt)}</small>
      ${currentIsAdmin ? `<div class="feedback-admin-actions">
        <input type="text" class="feedback-reply-input" data-reply-id="${escapeHtml(item.id)}" placeholder="관리자 답변 입력" value="${escapeHtml(item.adminReply || '')}">
        <button type="button" data-feedback-action="checking" data-id="${escapeHtml(item.id)}">검토중</button>
        <button type="button" data-feedback-action="developing" data-id="${escapeHtml(item.id)}">개발중</button>
        <button type="button" data-feedback-action="done" data-id="${escapeHtml(item.id)}">완료</button>
        <button type="button" data-feedback-action="closed" data-id="${escapeHtml(item.id)}">보류</button>
      </div>` : ''}
    </article>
  `).join('');
}

function startFeedbackRealtime() {
  if (feedbackRealtimeStarted) return;
  feedbackRealtimeStarted = true;
  onValue(ref(db, 'feedbackBoard'), (snapshot) => {
    cachedFeedback = snapshot.val() || {};
    renderFeedback();
  });
}

async function detectAdmin(user) {
  currentIsAdmin = false;
  if (!user) return;
  // auth.js already controls admin UI; this board keeps admin actions optional through local flag event.
}

window.addEventListener('master-auth-role-changed', (event) => {
  currentIsAdmin = Boolean(event.detail?.isAdmin);
  renderFeedback();
});

auth.onAuthStateChanged((user) => {
  detectAdmin(user);
  startFeedbackRealtime();
});

if (feedbackSubmitBtn) {
  feedbackSubmitBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return alert('로그인 후 게시할 수 있습니다.');
    const title = feedbackTitle?.value.trim() || '';
    const content = feedbackContent?.value.trim() || '';
    if (!title) return alert('제목을 입력하세요.');
    if (!content) return alert('내용을 입력하세요.');
    try {
      const itemRef = push(ref(db, 'feedbackBoard'));
      await set(itemRef, {
        uid: user.uid,
        email: user.email || '',
        type: feedbackType?.value || 'etc',
        title,
        content,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      feedbackTitle.value = '';
      feedbackContent.value = '';
      if (feedbackResult) feedbackResult.textContent = '게시글이 등록되었습니다.';
    } catch (error) {
      if (feedbackResult) feedbackResult.textContent = '게시 실패: ' + error.message;
    }
  });
}

if (feedbackRefreshBtn) feedbackRefreshBtn.addEventListener('click', startFeedbackRealtime);
if (feedbackList) {
  feedbackList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-feedback-action]');
    if (!button || !currentIsAdmin) return;
    try {
      const replyInput = feedbackList.querySelector(`[data-reply-id="${button.dataset.id}"]`);
      await update(ref(db, `feedbackBoard/${button.dataset.id}`), {
        status: button.dataset.feedbackAction,
        adminReply: replyInput?.value?.trim() || '',
        updatedAt: new Date().toISOString(),
        processedBy: auth.currentUser?.email || auth.currentUser?.uid || 'admin'
      });
    } catch (error) {
      alert('게시글 상태 변경 실패: ' + error.message);
    }
  });
}
