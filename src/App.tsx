import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, CalendarDays, Star, Tv, Users, Search } from 'lucide-react';
import Header from './components/Header';
import AnimeCard from './components/AnimeCard';
import HomePage from './pages/HomePage';
import { getAnime, getAnimeByGenre, getSeasonAnime, getTopAnime, type Anime } from './types/anime';

function CatalogPage({ kind }: { kind: 'popular' | 'season' }) {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (kind === 'popular' ? getTopAnime() : getSeasonAnime()).then(data => { if (active) setItems(data); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind]);
  const title = kind === 'popular' ? 'Animes populares' : 'Lançamentos da temporada';
  return <main className="page-content catalog-page"><div className="breadcrumb"><Link to="/">Início</Link><span>/</span>{title}</div><div className="page-title-row"><div><span className="eyebrow">CATÁLOGO OTAKUHUB</span><h1>{title}</h1><p>{kind === 'popular' ? 'Histórias que conquistaram fãs pelo mundo.' : 'Novos episódios e histórias da temporada atual.'}</p></div><span className="catalog-count">{items.length} títulos</span></div>{loading ? <div className="anime-grid">{Array.from({length: 8}, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton-poster" /><div className="skeleton-line" /></div>)}</div> : <div className="anime-grid">{items.map((anime, i) => <AnimeCard key={anime.mal_id} anime={anime} index={i} />)}</div>}</main>;
}

const genres = [
  { id: 1, name: 'Ação', description: 'Batalhas e adrenalina', emoji: '⚔️' },
  { id: 4, name: 'Comédia', description: 'Ria sem moderação', emoji: '☀️' },
  { id: 8, name: 'Drama', description: 'Histórias que marcam', emoji: '🎭' },
  { id: 10, name: 'Fantasia', description: 'Outros mundos', emoji: '✨' },
  { id: 14, name: 'Terror', description: 'Para sentir arrepios', emoji: '🌘' },
  { id: 22, name: 'Romance', description: 'Encontros e emoções', emoji: '💗' },
  { id: 30, name: 'Esporte', description: 'Superação e equipe', emoji: '🏆' },
  { id: 24, name: 'Sci-Fi', description: 'Futuros possíveis', emoji: '🚀' },
];

function CategoriesPage() {
  return <main className="page-content catalog-page"><div className="breadcrumb"><Link to="/">Início</Link><span>/</span>Categorias</div><div className="page-title-row"><div><span className="eyebrow">ENCONTRE SUA VIBE</span><h1>Explore por gênero</h1><p>Qual tipo de história combina com você hoje?</p></div></div><div className="genre-grid">{genres.map(genre => <Link to={`/categorias/${genre.id}`} key={genre.id} className="genre-card"><span className="genre-emoji">{genre.emoji}</span><strong>{genre.name}</strong><small>{genre.description}</small><span className="genre-arrow">↗</span></Link>)}</div></main>;
}

function GenrePage() {
  const { id = '' } = useParams();
  const genre = genres.find(item => String(item.id) === id);
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { let active = true; getAnimeByGenre(id).then(data => { if (active) setItems(data); }).catch(() => {}).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  return <main className="page-content catalog-page"><div className="breadcrumb"><Link to="/">Início</Link><span>/</span><Link to="/categorias">Categorias</Link><span>/</span>{genre?.name || 'Gênero'}</div><div className="page-title-row"><div><span className="eyebrow">GÊNERO SELECIONADO</span><h1>{genre?.emoji} {genre?.name || 'Animes'}</h1><p>{genre?.description || 'Uma seleção para explorar.'}</p></div></div>{loading ? <p className="search-message">Carregando seleção...</p> : <div className="anime-grid">{items.map((anime, i) => <AnimeCard key={anime.mal_id} anime={anime} index={i} />)}</div>}</main>;
}

function AnimePage() {
  const { id = '' } = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  useEffect(() => { let active = true; getAnime(id).then(data => { if (active) { setAnime(data); try { setSaved((JSON.parse(localStorage.getItem('otakuhub-library') || '[]') as number[]).includes(data.mal_id)); } catch { /* ignore */ } } }).catch(() => {}).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [id]);
  const toggleSaved = () => {
    if (!anime) return;
    const library = JSON.parse(localStorage.getItem('otakuhub-library') || '[]') as number[];
    const next = library.includes(anime.mal_id) ? library.filter(value => value !== anime.mal_id) : [...library, anime.mal_id];
    localStorage.setItem('otakuhub-library', JSON.stringify(next)); setSaved(!saved);
  };
  if (loading) return <main className="page-content catalog-page"><p className="search-message">Carregando detalhes do anime...</p></main>;
  if (!anime) return <main className="page-content catalog-page"><div className="empty-state">Não foi possível encontrar esse anime. <Link to="/popular">Voltar ao catálogo</Link></div></main>;
  const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '';
  return <main className="page-content detail-page"><Link to="/popular" className="back-link"><ArrowLeft size={16} /> Voltar ao catálogo</Link><section className="detail-hero"><div className="detail-cover"><img src={image} alt={anime.title} /></div><div className="detail-copy"><span className="eyebrow">DETALHES DO ANIME</span><h1>{anime.title}</h1>{anime.title_english && <p className="detail-english">{anime.title_english}</p>}<div className="detail-stats"><span><Star size={16} fill="currentColor" /> {anime.score ?? 'N/A'} / 10</span><span><Tv size={16} /> {anime.episodes ?? '?'} episódios</span><span><CalendarDays size={16} /> {anime.year ?? 'Ano desconhecido'}</span></div><p className="detail-synopsis">{anime.synopsis || 'Sinopse não disponível.'}</p><div className="genre-tags">{anime.genres?.map(genre => <Link to={`/categorias/${genre.mal_id}`} key={genre.mal_id}>{genre.name}</Link>)}</div><button className="button-primary" onClick={toggleSaved}><Bookmark size={16} /> {saved ? 'Remover da minha lista' : 'Adicionar à minha lista'}</button></div></section>{anime.trailer?.embed_url && <section className="trailer-section"><h2>Trailer oficial</h2><div className="trailer-frame"><iframe src={anime.trailer.embed_url} title={`Trailer de ${anime.title}`} allowFullScreen loading="lazy" /></div></section>}</main>;
}

function LibraryPage() {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const load = async () => {
      let ids: number[] = [];
      try { ids = JSON.parse(localStorage.getItem('otakuhub-library') || '[]') as number[]; } catch { /* ignore */ }
      const results = await Promise.allSettled(ids.map(id => getAnime(String(id))));
      if (active) setItems(results.filter((result): result is PromiseFulfilledResult<Anime> => result.status === 'fulfilled').map(result => result.value));
      if (active) setLoading(false);
    };
    load();
    const update = () => load();
    window.addEventListener('otakuhub-library-change', update);
    return () => { active = false; window.removeEventListener('otakuhub-library-change', update); };
  }, []);
  return <main className="page-content catalog-page"><div className="breadcrumb"><Link to="/">Início</Link><span>/</span>Minha lista</div><div className="page-title-row"><div><span className="eyebrow">SUA COLEÇÃO PESSOAL</span><h1>Minha lista</h1><p>Os animes que você quer acompanhar, em um só lugar.</p></div><Bookmark size={25} /></div>{loading ? <p className="search-message">Carregando sua lista...</p> : items.length ? <div className="anime-grid">{items.map((anime, i) => <AnimeCard key={anime.mal_id} anime={anime} index={i} />)}</div> : <div className="empty-state"><Bookmark size={28} /><h2>Sua lista está vazia</h2><p>Salve os animes que chamarem sua atenção para encontrá-los aqui depois.</p><Link to="/popular" className="button-primary"><Search size={16} /> Explorar catálogo</Link></div>}</main>;
}

function ProfilePage() {
  const [name, setName] = useState(() => localStorage.getItem('otakuhub-profile-name') || '');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(true); }, []);
  return <main className="page-content catalog-page profile-page"><div className="breadcrumb"><Link to="/">Início</Link><span>/</span>Perfil</div><div className="profile-card"><div className="profile-avatar"><Users size={30} /></div><span className="eyebrow">ESPAÇO DO MEMBRO</span><h1>Seu perfil OtakuHub</h1><p>Personalize como você aparece neste dispositivo.</p><form onSubmit={event => { event.preventDefault(); localStorage.setItem('otakuhub-profile-name', name.trim()); setSaved(true); }}><label htmlFor="profile-name">Como podemos te chamar?</label><input id="profile-name" value={name} onChange={event => { setName(event.target.value); setSaved(false); }} placeholder="Seu apelido otaku" maxLength={32} /><button className="button-primary" type="submit">Salvar perfil</button>{saved && <small className="profile-saved">Preferência salva neste dispositivo.</small>}</form><p className="profile-note">Este perfil é local: ainda não existe sistema de cadastro ou sincronização em servidor.</p></div></main>;
}

function NotFoundPage() { return <main className="page-content not-found"><span>404</span><h1>Você saiu da rota!</h1><p>Essa página não existe por aqui.</p><Link className="button-primary" to="/">Voltar ao início</Link></main>; }

export default function App() {
  return <div className="app-shell"><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/popular" element={<CatalogPage kind="popular" />} /><Route path="/lancamentos" element={<CatalogPage kind="season" />} /><Route path="/categorias" element={<CategoriesPage />} /><Route path="/categorias/:id" element={<GenrePage />} /><Route path="/anime/:id" element={<AnimePage />} /><Route path="/biblioteca" element={<LibraryPage />} /><Route path="/perfil" element={<ProfilePage />} /><Route path="*" element={<NotFoundPage />} /></Routes><footer className="site-footer"><div className="footer-brand"><img src="/asset/briefing/oh-logo.webp" alt="" /><span>Otaku<span className="brand-accent">Hub</span></span></div><p>Feito para quem vive histórias além da tela.</p><span className="footer-credit">Dados de anime fornecidos pela API Jikan · Projeto independente</span></footer></div>;
}