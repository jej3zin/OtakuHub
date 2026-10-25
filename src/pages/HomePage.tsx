import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, TrendingUp, CalendarDays, ChevronRight } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import { getSeasonAnime, getTopAnime, type Anime } from '../types/anime';

function AnimeSection({ title, subtitle, icon, items, loading }: { title: string; subtitle: string; icon: React.ReactNode; items: Anime[]; loading: boolean }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div className="section-heading-title"><span className="section-icon">{icon}</span><div><h2>{title}</h2><p>{subtitle}</p></div></div>
        <Link to="/popular" className="text-link">Ver catálogo <ArrowRight size={15} /></Link>
      </div>
      {loading ? <div className="anime-grid">{Array.from({ length: 6 }, (_, i) => <div className="skeleton-card" key={i}><div className="skeleton-poster" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>
        : items.length ? <div className="anime-grid">{items.slice(0, 6).map((anime, i) => <AnimeCard key={anime.mal_id} anime={anime} index={i} />)}</div>
        : <div className="empty-state">Não foi possível carregar esta seleção. Tente novamente em instantes.</div>}
    </section>
  );
}

export default function HomePage() {
  const [top, setTop] = useState<Anime[]>([]);
  const [season, setSeason] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getTopAnime(), getSeasonAnime()]).then(([topResult, seasonResult]) => {
      if (!active) return;
      if (topResult.status === 'fulfilled') setTop(topResult.value);
      if (seasonResult.status === 'fulfilled') setSeason(seasonResult.value);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const hero = top[0];
  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> SEU PRÓXIMO FAVORITO ESTÁ AQUI</span>
          <h1>Seu universo.<br /><span>Seu próximo anime.</span></h1>
          <p>Explore histórias inesquecíveis, descubra novos mundos e monte sua própria coleção otaku.</p>
          <div className="hero-actions"><Link to="/popular" className="button-primary"><Play size={16} fill="currentColor" /> Explorar animes</Link><Link to="/categorias" className="button-secondary">Descobrir gêneros <ChevronRight size={16} /></Link></div>
          <div className="hero-note"><span className="live-dot" /> Catálogo atualizado pela comunidade anime</div>
        </div>
        <div className="hero-art">
          <div className="hero-art-glow" />
          {hero?.images?.webp?.large_image_url || hero?.images?.jpg?.large_image_url ? <img src={hero.images?.webp?.large_image_url || hero.images?.jpg?.large_image_url || ''} alt={hero.title} /> : <div className="hero-placeholder"><span>OTAKU</span><strong>HUB</strong></div>}
          <div className="hero-art-label"><span>EM DESTAQUE</span><strong>{hero?.title || 'Descubra seu próximo anime'}</strong><small>{hero?.score ? `★ ${hero.score} · MAIS BEM AVALIADOS` : 'NOVAS DESCOBERTAS TODOS OS DIAS'}</small></div>
          <div className="hero-sticker">ANIME<br /><b>VERSE</b></div>
        </div>
        <div className="hero-bottom"><span>01 — DESCOBRIR</span><span>02 — EXPLORAR</span><span>03 — COLECIONAR</span><div className="hero-progress"><i /></div></div>
      </section>
      <div className="page-content">
        <div className="discovery-strip"><div className="discovery-icon"><TrendingUp size={20} /></div><div><strong>O que está em alta</strong><span>Os títulos que todo mundo está assistindo</span></div><Link to="/popular" aria-label="Ver animes populares"><ArrowRight size={18} /></Link></div>
        <AnimeSection title="Em alta" subtitle="Os favoritos da comunidade" icon={<TrendingUp size={19} />} items={top} loading={loading} />
        <AnimeSection title="Temporada atual" subtitle="Acompanhe os lançamentos recentes" icon={<CalendarDays size={19} />} items={season} loading={loading} />
      </div>
    </>
  );
}