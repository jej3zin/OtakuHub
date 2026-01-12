// /js/state/homeState.js

import { fetchTrendingAnimes } from '../api/anime.api.js';
import { normalizeAnime } from '../dto/anime.dto.js';

const CACHE_KEY = 'home_animes';
const TTL = 1000 * 60 * 10;

let memoryCache = null;

export async function getHomeAnimes() {
  if (memoryCache) return memoryCache;

  const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
  if (cached && Date.now() - cached.time < TTL) {
    memoryCache = cached.data;
    return memoryCache;
  }

  const raw = await fetchTrendingAnimes();
  memoryCache = raw.map(normalizeAnime);

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data: memoryCache, time: Date.now() })
  );

  return memoryCache;
}
