import { fetchWithCache } from '/js/state/listState.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearIcon = document.querySelector('.clear-icon');

  if (!searchInput || !searchResults) return;

  let debounceTimer;
  let controller;

  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim();

    clearTimeout(debounceTimer);

    if (value.length < 2) {
      resetSearch();
      return;
    }

    debounceTimer = setTimeout(() => {
      searchAnime(value);
    }, 300);
  });

  clearIcon?.addEventListener('click', () => {
    searchInput.value = '';
    resetSearch();
    searchInput.focus();
  });

  async function searchAnime(term) {
    // cancela request anterior
    controller?.abort();
    controller = new AbortController();

    searchResults.classList.add('show');
    searchResults.innerHTML = renderLoading();

    try {
      const data = await fetchWithCache(
        `search-${term}`,
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(term)}&limit=6`
      );

      if (!data?.length) {
        searchResults.innerHTML = `<span class="empty">Nada encontrado</span>`;
        return;
      }

      renderResults(data, term);
    } catch (err) {
      if (err.name !== 'AbortError') {
        searchResults.innerHTML = `<span class="empty">Erro na busca</span>`;
        console.error(err);
      }
    }
  }

  function renderResults(items, term) {
    searchResults.innerHTML = items
      .map((anime) => {
        const title = highlight(anime.title, term);
        const img = anime.images?.jpg?.image_url;
        const year = anime.year ?? '—';

        return `
          <a href="/anime.html?id=${anime.mal_id}" class="search-item">
            <img src="${img}" alt="${anime.title}" loading="lazy" />
            <div>
              <strong>${title}</strong>
              <span>${year}</span>
            </div>
          </a>
        `;
      })
      .join('');
  }

  function highlight(text, term) {
    return text.replace(new RegExp(`(${term})`, 'gi'), '<mark>$1</mark>');
  }

  function renderLoading() {
    return Array.from({ length: 4 })
      .map(
        () => `
        <div class="search-item skeleton">
          <div class="thumb"></div>
          <div class="lines"></div>
        </div>
      `
      )
      .join('');
  }

  function resetSearch() {
    searchResults.classList.remove('show');
    searchResults.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      resetSearch();
    }
  });
});
