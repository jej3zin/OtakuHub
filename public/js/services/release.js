// js/services/relaese.js
document.addEventListener('DOMContentLoaded', async () => {
  const { GITHUB_USER, GITHUB_REPO } = window.APP_CONFIG || {};

  if (!GITHUB_USER || !GITHUB_REPO) return;

  const notifBtn = document.getElementById('openNotif');
  const notifModal = document.getElementById('notifModal');
  const closeNotif = document.getElementById('closeNotif');
  const notifContent = document.getElementById('notifContent');

  if (!notifBtn || !notifModal || !notifContent) return;

  notifBtn.addEventListener('click', async () => {
    notifModal.classList.remove('hidden');
    await loadRelease();
  });

  closeNotif?.addEventListener('click', () => {
    notifModal.classList.add('hidden');
  });

  async function loadRelease() {
    notifContent.innerHTML = '<p>Carregando release…</p>';

    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/releases/latest`
      );

      if (!res.ok) throw new Error('Release não encontrada');

      const data = await res.json();

      const html = `
        <h4>${data.name || data.tag_name}</h4>
        <small>📅 ${new Date(data.published_at).toLocaleDateString()}</small>
        <div class="markdown-body">
          ${DOMPurify.sanitize(marked.parse(data.body || 'Sem descrição.'))}
        </div>
      `;

      notifContent.innerHTML = html;
    } catch (err) {
      notifContent.innerHTML = `
        <p style="opacity:.7">
          ⚠️ Não foi possível carregar a última release.
        </p>
      `;
      console.error('Erro ao carregar release:', err);
    }
  }
});
