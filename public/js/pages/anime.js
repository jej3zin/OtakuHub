// js/pages/anime.js
import { initGlobalLoader } from '../loader.js';
import { fetchWithCache } from '../state/listState.js';

initGlobalLoader();

const params = new URLSearchParams(window.location.search);
const animeId = params.get('id');

const titleEl = document.getElementById('title');
const coverEl = document.getElementById('cover');
const synopsisEl = document.getElementById('synopsis');
const scoreEl = document.getElementById('score');
const episodesEl = document.getElementById('episodes');
const statusEl = document.getElementById('status');
const genresEl = document.getElementById('genres');
const trailerEl = document.getElementById('trailer');
const charactersEl = document.getElementById('characters');
const addLibraryBtn = document.getElementById('addLibrary');

if (!animeId) {
  titleEl.textContent = 'Anime não encontrado';
  throw new Error('ID não informado');
}

async function loadAnime() {
  try {
    const anime = await fetchWithCache(
      `anime-${animeId}`,
      `https://api.jikan.moe/v4/anime/${animeId}/full`
    );

    const data = anime;

    titleEl.textContent = data.title;
    coverEl.src = data.images.jpg.large_image_url;

    scoreEl.innerHTML = `<ion-icon class="star" name="star"></ion-icon> ${
      data.score ?? 'N/A'
    }`;
    episodesEl.innerHTML = `<ion-icon name="tv"></ion-icon> ${
      data.episodes ?? 'N/A'
    } eps`;
    statusEl.innerHTML = `<ion-icon name="hourglass"></ion-icon> ${data.status}`;

    // SINOPSE (Markdown + sanitização)
    synopsisEl.innerHTML = DOMPurify.sanitize(
      marked.parse(data.synopsis || 'Sem sinopse.')
    );

    // GÊNEROS → clicáveis
    genresEl.innerHTML = data.genres
      .map(
        (g) =>
          `<a href="/pages/category.html?genre=${g.mal_id}" class="genre-tag">${g.name}</a>`
      )
      .join('');

    // TRAILER
    if (data.trailer?.embed_url) {
      trailerEl.innerHTML = `
        <iframe
          src="${data.trailer.embed_url}"
          frameborder="0"
          allowfullscreen
        ></iframe>
      `;
    } else {
      trailerEl.innerHTML = '<p>Trailer não disponível.</p>';
    }

    loadCharacters();
  } catch (err) {
    console.error(err);
    titleEl.textContent = 'Erro ao carregar anime 😢';
  }
}

async function loadCharacters() {
  try {
    const chars = await fetchWithCache(
      `chars-${animeId}`,
      `https://api.jikan.moe/v4/anime/${animeId}/characters`
    );

    charactersEl.innerHTML = chars
      .slice(0, 12)
      .map(
        (c) => `
        <div class="character-card">
          <img src="${c.character.images.jpg.image_url}">
          <span>${c.character.name}</span>
        </div>
      `
      )
      .join('');
  } catch {
    charactersEl.innerHTML = '<p>Erro ao carregar personagens.</p>';
  }
}

// BOTÃO → Biblioteca (localStorage simples)
addLibraryBtn.addEventListener('click', () => {
  const lib = JSON.parse(localStorage.getItem('library') || '[]');

  if (!lib.includes(animeId)) {
    lib.push(animeId);
    localStorage.setItem('library', JSON.stringify(lib));
    addLibraryBtn.textContent = '✔ Na biblioteca';
  }
});

document.addEventListener('DOMContentLoaded', loadAnime);
