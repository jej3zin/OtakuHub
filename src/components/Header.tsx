import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, Menu, Compass, Flame, CalendarDays, Bookmark, Sparkles } from 'lucide-react';
import { searchAnime, type Anime } from '../types/anime';

const links = [
  { to: '/', label: 'Início', icon: Compass },
  { to: '/popular', label: 'Populares', icon: Flame },
  { to: '/lancamentos', label: 'Lançamentos', icon: CalendarDays },
  { to: '/categorias', label: 'Categorias', icon: Sparkles },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setLoading(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try { setResults(await searchAnime(query, controller.signal)); }
      catch { if (!controller.signal.aborted) setResults([]); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const goToAnime = (id: number) => {
    setSearchOpen(false); setQuery(''); setMobileOpen(false); navigate(`/anime/${id}`);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="OtakuHub início">
          <img src="/asset/briefing/oh-logo.webp" alt="" />
          <span>Otaku<span className="brand-accent">Hub</span><small>SEU UNIVERSO ANIME</small></span>
        </Link>
        <button className="mobile-menu icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Abrir menu">
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${mobileOpen ? 'is-open' : ''}`}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Icon size={16} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <div className="search-wrap" ref={searchRef}>
            <label className={`search-box ${searchOpen ? 'search-focused' : ''}`}>
              <Search size={17} />
              <input value={query} onFocus={() => setSearchOpen(true)} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} placeholder="Buscar animes..." aria-label="Buscar animes" />
              {query && <button className="search-clear" type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><X size={15} /></button>}
            </label>
            {searchOpen && query.trim().length >= 2 && (
              <div className="search-dropdown">
                {loading && <p className="search-message">Buscando animes...</p>}
                {!loading && results.length === 0 && <p className="search-message">Nenhum anime encontrado.</p>}
                {results.map(anime => (
                  <button className="search-result" key={anime.mal_id} onClick={() => goToAnime(anime.mal_id)}>
                    <img src={anime.images?.jpg?.image_url || '/asset/briefing/oh-logo.webp'} alt="" />
                    <span>{anime.title}<small>{anime.year || anime.type || 'Anime'}</small></span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link className="library-button" to="/biblioteca"><Bookmark size={17} /><span>Minha lista</span></Link>
        </div>
      </div>
    </header>
  );
}