export function normalizeAnime(anime) {
  return {
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
    banner: anime.images.jpg.large_image_url,
    score: anime.score ?? 'N/A',
    episodes: anime.episodes ?? 'N/A',
  };
}
