// public/js/index.js
import { initGlobalLoader, renderSkeleton } from './loader.js';
import '/js/components/search.js';
import '/js/layout/header.js';

import { setupSlider } from './components/slider.js';
import { renderBanner, renderSection } from './services/renderHome.js';

initGlobalLoader();

document.addEventListener('DOMContentLoaded', async () => {
  const trending = document.querySelector('.slide-trending');
  const airing = document.querySelector('.slide-TopAiringAnimes');
  const score = document.querySelector('.slide-TopScoreAnimes');

  renderSkeleton(trending);
  renderSkeleton(airing);
  renderSkeleton(score);

  await Promise.all([
    renderBanner(),
    renderSection('.slide-trending', 5, 15),
    renderSection('.slide-TopAiringAnimes', 15, 28),
    renderSection('.slide-TopScoreAnimes', 28, 40),
  ]);

  setupSlider(
    trending,
    document.querySelector('.btn-left'),
    document.querySelector('.btn-right')
  );
});
