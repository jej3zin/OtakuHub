import { initGlobalLoader } from '../loader.js';

import { fetchWithCache } from '../state/listState.js';
import { renderSkeleton } from '../loader.js';
import { renderAnimeCard } from '../components/animeCard.js';

initGlobalLoader();
let page = 1;
let loading = false;
let section;

document.addEventListener('DOMContentLoaded', () => {
  section = document.querySelector('.news-list');

  if (!section) {
    console.error('❌ .news-list não encontrada no HTML');
    return;
  }

  loadNews();
  setupInfiniteScroll();
});

async function loadNews() {
  if (loading) return;
  loading = true;

  renderSkeleton(section, 6);

  try {
    const animes = await fetchWithCache(
      `news-${page}`,
      `https://api.jikan.moe/v4/seasons/now?page=${page}`
    );

    if (!animes?.length) return;

    if (page === 1) section.innerHTML = '';

    section.innerHTML += animes.map(renderAnimeCard).join('');
    page++;
  } catch (err) {
    console.error('Erro ao carregar news:', err);
  } finally {
    loading = false;
  }
}

function setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 300
    ) {
      loadNews();
    }
  });
}
