document.addEventListener('DOMContentLoaded', () => {
  const menuButtons = document.querySelectorAll('.menu-ctt');
  const sections = document.querySelectorAll('.sectionContent section');

  function resetActive() {
    menuButtons.forEach((btn) => btn.classList.remove('active'));
    sections.forEach((sec) => sec.classList.remove('active'));
  }

  function activateTab(tab) {
    resetActive();

    const button = document.querySelector(`.menu-ctt[data-tab="${tab}"]`);
    const section = document.querySelector(`section[data-tab="${tab}"]`);

    if (!button || !section) return;

    button.classList.add('active');
    section.classList.add('active');

    localStorage.setItem('accountTab', tab);

    const url = new URL(window.location);
    url.searchParams.set('tab', tab);
    history.replaceState({}, '', url);
  }

  menuButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });
  });

  // prioridade: URL > localStorage > conta
  const params = new URLSearchParams(window.location.search);
  activateTab(
    params.get('tab') || localStorage.getItem('accountTab') || 'cont'
  );
});

/* Account */
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const avatarWrapper = document.querySelector('.avatar-wrapper');
const avatarSize = document.getElementById('avatarSize');

const bgType = document.getElementById('bgType');
const bgColor1 = document.getElementById('bgColor1');
const bgColor2 = document.getElementById('bgColor2');
const section = document.querySelector('.accountCont');

/* Avatar click */
avatarWrapper.addEventListener('click', () => avatarInput.click());

/* Preview avatar */
avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => (avatarPreview.src = e.target.result);
  reader.readAsDataURL(file);
});

/* Background type */
bgType.addEventListener('change', () => {
  bgColor2.style.display = bgType.value === 'gradient' ? 'block' : 'none';
  applyBg();
});

[bgColor1, bgColor2].forEach((input) =>
  input.addEventListener('input', applyBg)
);

function applyBg() {
  if (bgType.value === 'solid') {
    section.style.background = bgColor1.value;
  } else {
    section.style.background = `linear-gradient(135deg, ${bgColor1.value}, ${bgColor2.value})`;
  }
}
