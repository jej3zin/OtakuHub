// js/components/animeCard.js
export function renderAnimeCard(anime) {
  return `
    <article class="anime-card">
      <a href="/pages/anime.html?id=${anime.mal_id}">
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      </a>

      <div class="anime-info">
        <h3 class="anime-title">${anime.title}</h3>

        <span class="anime-rating">
          <ion-icon name="star"></ion-icon>
          ${anime.score ?? 'N/A'}
        </span>

        <span class="anime-episodes">
          <ion-icon name="tv"></ion-icon>
          ${anime.episodes ?? 'N/A'} eps
        </span>
      </div>
    </article>
  `;
}
