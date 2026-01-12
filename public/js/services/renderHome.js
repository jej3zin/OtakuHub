// public/js/services/renderHome.js

import { getHomeAnimes } from '../state/homeState.js';

function renderEmpty(section) {
  section.innerHTML = '<p>Nenhum anime encontrado.</p>';
}

function renderCard(anime) {
  return `
    <a href="/pages/anime.html?id=${anime.id}" class="anime-card">
      <img src="${anime.image}">
      <div class="anime-info">
        <h3 class="anime-title">${anime.title}</h3>
        <span class="anime-rating"><ion-icon name="star"></ion-icon> ${anime.score}</span>
        <span class="anime-episodes"><ion-icon name="tv"></ion-icon> ${anime.episodes} eps</span>
      </div>
    </a>
  `;
}

export async function renderBanner() {
  const animes = await getHomeAnimes();
  const banner = document.querySelector('.slide-banner');

  const slice = animes.slice(0, 5);
  if (!slice.length) return;

  banner.innerHTML = slice
    .map((a) => `<div class="banner-card"><img src="${a.banner}"></div>`)
    .join('');
}

export async function renderSection(selector, start, end) {
  const animes = await getHomeAnimes();
  const section = document.querySelector(selector);

  const slice = animes.slice(start, end);
  if (!slice.length) return renderEmpty(section);

  section.innerHTML = slice.map(renderCard).join('');
}
