// public/js/api/anime.api.js

import { retryFetch } from '../utils/retryFetch.js';
const API_BASE = 'https://api.jikan.moe/v4';

export async function getTrendingAnimes() {
  const res = await fetch(`${API_BASE}/top/anime`);
  const data = await res.json();
  return data.data;
}

export async function getAnimeEpisodes(id, page = 1) {
  const res = await fetch(`${API_BASE}/anime/${id}/episodes?page=${page}`);
  const data = await res.json();
  return data.data;
}

export async function getAnimeReviews(id, page = 1) {
  const res = await fetch(`${API_BASE}/anime/${id}/reviews?page=${page}`);
  const data = await res.json();
  return data.data;
}

export function fetchTrendingAnimes() {
  return retryFetch(async () => {
    const res = await fetch(`${API_BASE}/top/anime`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data;
  });
}

export async function fetchAnimeById(id) {
  const res = await fetch(`${API_BASE}/anime/${id}`);
  const data = await res.json();
  return data.data;
}
