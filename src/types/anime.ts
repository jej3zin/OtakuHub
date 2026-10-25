export interface AnimeImageSet {
  jpg?: { image_url?: string | null; large_image_url?: string | null; small_image_url?: string | null };
  webp?: { image_url?: string | null; large_image_url?: string | null; small_image_url?: string | null };
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  synopsis?: string | null;
  year?: number | null;
  score?: number | null;
  episodes?: number | null;
  status?: string;
  type?: string | null;
  rank?: number | null;
  images?: AnimeImageSet;
  genres?: Array<{ mal_id: number; name: string }>;
  studios?: Array<{ mal_id: number; name: string }>;
  trailer?: { embed_url?: string | null };
}

interface JikanResponse<T> {
  data: T;
  pagination?: { has_next_page: boolean; current_page: number; last_visible_page: number };
}

const API_BASE = 'https://api.jikan.moe/v4';

async function request<T>(path: string, signal?: AbortSignal): Promise<JikanResponse<T>> {
  const response = await fetch(`${API_BASE}${path}`, { signal });
  if (!response.ok) {
    if (response.status === 429) throw new Error('A API está recebendo muitas consultas. Tente novamente em alguns segundos.');
    throw new Error('Não foi possível carregar os animes agora.');
  }
  return response.json() as Promise<JikanResponse<T>>;
}

export async function getTopAnime(): Promise<Anime[]> {
  return (await request<Anime[]>('/top/anime?filter=bypopularity&limit=12')).data;
}

export async function getTopRatedAnime(): Promise<Anime[]> {
  return (await request<Anime[]>('/top/anime?limit=12')).data;
}

export async function getSeasonAnime(): Promise<Anime[]> {
  return (await request<Anime[]>('/seasons/now?limit=12')).data;
}

export async function searchAnime(query: string, signal?: AbortSignal): Promise<Anime[]> {
  if (!query.trim()) return [];
  return (await request<Anime[]>(`/anime?q=${encodeURIComponent(query)}&limit=8&sfw=true`, signal)).data;
}

export async function getAnime(id: string): Promise<Anime> {
  return (await request<Anime>(`/anime/${encodeURIComponent(id)}/full`)).data;
}

export async function getAnimeByGenre(genreId: string): Promise<Anime[]> {
  return (await request<Anime[]>(`/anime?genres=${encodeURIComponent(genreId)}&order_by=score&sort=desc&limit=12`)).data;
}