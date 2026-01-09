document.addEventListener('DOMContentLoaded', () => {
  /* ==================================================
     CHAT & NOTIFICAÇÕES
  ================================================== */

  const openChatBtn = document.getElementById('openChat');
  const openNotifBtn = document.getElementById('openNotif');

  const chatModal = document.getElementById('chatModal'); // se existir
  const notifModal = document.getElementById('notifModal'); // se existir

  const closeChatBtn = document.getElementById('closeChat');
  const closeNotifBtn = document.getElementById('closeNotif');

  /* ---------- CHAT ---------- */
  if (openChatBtn && chatModal) {
    openChatBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatModal.classList.remove('hidden');
    });

    closeChatBtn?.addEventListener('click', () => {
      chatModal.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#chatModal') && !e.target.closest('#openChat')) {
        chatModal.classList.add('hidden');
      }
    });
  }

  /* ---------- NOTIFICAÇÕES ---------- */
  if (openNotifBtn && notifModal) {
    openNotifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifModal.classList.remove('hidden');
    });

    closeNotifBtn?.addEventListener('click', () => {
      notifModal.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#notifModal') && !e.target.closest('#openNotif')) {
        notifModal.classList.add('hidden');
      }
    });
  }

  /* ---------- ESC fecha tudo ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      chatModal?.classList.add('hidden');
      notifModal?.classList.add('hidden');
      headDropdown?.classList.remove('showDropdown');
    }
  });

  /* ==================================================
     DROPDOWN PERFIL
  ================================================== */
  const avatarBtn = document.getElementById('openHeadDrop');
  const headDropdown = document.getElementById('headDropdown');

  if (avatarBtn && headDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      headDropdown.classList.toggle('showDropdown');
    });

    // fecha clicando fora
    document.addEventListener('click', (e) => {
      if (
        !e.target.closest('#headDropdown') &&
        !e.target.closest('#openHeadDrop')
      ) {
        headDropdown.classList.remove('showDropdown');
      }
    });
  }

  /* ==================================================
     (OPCIONAL) MOCK DE ESTADO DE LOGIN
  ================================================== */
  const isLogged = false; // troca por auth real depois

  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const hiUser = document.getElementById('hiUser');
  const viewsBtn = document.getElementById('viewsBtn');
  const myaccountBtn = document.getElementById('myaccountBtn');
  const libraryBtn = document.getElementById('libraryBtn');

  if (isLogged) {
    hiUser.textContent = 'Jean';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'flex';
    viewsBtn.style.display = 'flex';
    myaccountBtn.style.display = 'flex';
    libraryBtn.style.display = 'flex';
  } else {
    hiUser.textContent = 'Visitante';
  }
});
