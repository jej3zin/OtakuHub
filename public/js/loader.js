//js/loader.js
/* Loader Global */
export function initGlobalLoader() {
  const preloader = document.getElementById('preloader');
  const content = document.getElementById('content');

  if (!preloader) return;

  // esconde o conteúdo enquanto carrega
  if (content) content.style.visibility = 'hidden';

  window.addEventListener('load', () => {
    // delay pequeno pra suavizar (UX)
    setTimeout(() => {
      preloader.classList.add('hide');

      if (content) {
        content.style.visibility = 'visible';
      }

      // remove do DOM depois da animação
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 300);
  });
}

/* Loader Skeleton */
export function renderSkeleton(section, count = 10) {
  section.innerHTML = Array.from({ length: count })
    .map(() => `<div class="anime-card skeleton skeleton-card"></div>`)
    .join('');
}
