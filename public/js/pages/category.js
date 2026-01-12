import { initGlobalLoader } from '../loader.js';

import { fetchWithCache } from '../state/listState.js';
import { renderSkeleton } from '../loader.js';
import { renderAnimeCard } from '../components/animeCard.js';

initGlobalLoader();

let page = 1;
let loading = false;
let section;
let title;

const params = new URLSearchParams(window.location.search);
const genre = params.get('genre');

document.addEventListener('DOMContentLoaded', () => {
  section = document.querySelector('.category-list');
  title = document.getElementById('categoryTitle');

  if (!section || !genre) {
    console.error('❌ Categoria inválida ou section não encontrada');
    return;
  }

  setCategoryTitle(genre);
  loadCategory();
  setupInfiniteScroll();
});

async function loadCategory() {
  if (loading) return;
  loading = true;

  renderSkeleton(section, 6);

  try {
    const animes = await fetchWithCache(
      `genre-${genre}-${page}`,
      `https://api.jikan.moe/v4/anime?genres=${genre}&page=${page}`
    );

    if (!animes?.length) return;

    if (page === 1) section.innerHTML = '';

    section.innerHTML += animes.map(renderAnimeCard).join('');
    page++;
  } catch (err) {
    console.error('Erro ao carregar categoria:', err);
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
      loadCategory();
    }
  });
}

function setCategoryTitle(genreId) {
  const genres = {
    1: 'Ação',
    4: 'Comédia',
    8: 'Drama',
    10: 'Fantasia',
    14: 'Terror',
    22: 'Romance',
    30: 'Esporte',
  };

  title.textContent = genres[genreId] || 'Categoria';
}
