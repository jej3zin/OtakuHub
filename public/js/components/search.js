document.addEventListener('DOMContentLoaded', () => {
  /* ==================================================
     SEARCH BAR
  ================================================== */
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearIcon = document.querySelector('.clear-icon');

  if (searchInput && searchResults) {
    let debounceTimer;

    searchInput.addEventListener('input', () => {
      const value = searchInput.value.trim();

      clearTimeout(debounceTimer);

      // limpa se menos de 2 caracteres
      if (value.length < 2) {
        searchResults.classList.remove('show');
        searchResults.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        // 🔥 MOCK de dados (troca por API depois)
        const data = [
          { title: 'Naruto', desc: 'Anime de ação' },
          { title: 'One Piece', desc: 'Piratas e aventura' },
          { title: 'Bleach', desc: 'Shinigamis e espada' },
          { title: 'Dragon Ball', desc: 'Clássico absoluto' },
        ];

        const filtered = data.filter((item) =>
          item.title.toLowerCase().includes(value.toLowerCase())
        );

        renderSearchResults(filtered, value);
      }, 300);
    });

    clearIcon?.addEventListener('click', () => {
      searchInput.value = '';
      searchResults.classList.remove('show');
      searchResults.innerHTML = '';
      searchInput.focus();
    });

    function renderSearchResults(items, term) {
      if (!items.length) {
        searchResults.innerHTML = `<span style="opacity:.6">Nada encontrado</span>`;
        searchResults.classList.add('show');
        return;
      }

      searchResults.innerHTML = items
        .map((item) => {
          const highlighted = item.title.replace(
            new RegExp(`(${term})`, 'gi'),
            '<mark>$1</mark>'
          );

          return `
            <button class="search-item">
              <strong>${highlighted}</strong>
              <span>${item.desc}</span>
            </button>
          `;
        })
        .join('');

      searchResults.classList.add('show');
    }

    // fecha resultados ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        searchResults.classList.remove('show');
      }
    });
  }
});
