import { Link } from 'react-router-dom';
import { BookmarkPlus, Star } from 'lucide-react';
import type { Anime } from '../types/anime';

interface Props { anime: Anime; index?: number; }

export default function AnimeCard({ anime, index }: Props) {
  const saved = (() => {
    try { return (JSON.parse(localStorage.getItem('otakuhub-library') || '[]') as number[]).includes(anime.mal_id); }
    catch { return false; }
  })();
  const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  return (
    <article className="anime-card">
      <Link to={`/anime/${anime.mal_id}`} className="poster-link" aria-label={`Ver detalhes de ${anime.title}`}>
        <div className="poster-frame">
          {index !== undefined && <span className="poster-rank">{String(index + 1).padStart(2, '0')}</span>}
          <img src={image || '/asset/briefing/oh-logo.webp'} alt={anime.title} loading="lazy" />
          <span className="poster-overlay">Ver detalhes</span>
        </div>
      </Link>
      <div className="anime-card-info">
        <div className="anime-card-title-row">
          <Link to={`/anime/${anime.mal_id}`} className="anime-card-title">{anime.title}</Link>
          {anime.score && <span className="score"><Star size={12} fill="currentColor" />{anime.score.toFixed(1)}</span>}
        </div>
        <p>{[anime.type, anime.year, anime.episodes ? `${anime.episodes} eps` : null].filter(Boolean).join(' · ') || 'Anime'}</p>
      </div>
      <button className={`save-anime ${saved ? 'is-saved' : ''}`} title={saved ? 'Já está na sua lista' : 'Salvar na minha lista'} onClick={() => {
        try {
          const library = JSON.parse(localStorage.getItem('otakuhub-library') || '[]') as number[];
          const next = library.includes(anime.mal_id) ? library.filter(id => id !== anime.mal_id) : [...library, anime.mal_id];
          localStorage.setItem('otakuhub-library', JSON.stringify(next));
          window.dispatchEvent(new Event('otakuhub-library-change'));
        } catch { /* local storage indisponível */ }
      }}><BookmarkPlus size={16} /></button>
    </article>
  );
}