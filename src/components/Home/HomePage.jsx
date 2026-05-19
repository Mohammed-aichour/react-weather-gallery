import React, { useEffect, useState } from 'react';
import { getMoroccoInfo, getHomePhotos, photoDisplayUrl } from '../../api';
import { MOROCCAN_CITIES, GALLERY_THEMES } from '../../config';
import HomePhotoGrid from './HomePhotoGrid';

function formatPopulation(n) {
  if (!n) return '—';
  return new Intl.NumberFormat('fr-FR').format(n);
}

export default function HomePage({
  country,
  countryLoading,
  countryError,
  onExploreCity,
  onExploreTheme,
  onGoGallery,
  onGoCulture,
}) {
  const [localCountry, setLocalCountry] = useState(country);
  const [loading, setLoading] = useState(countryLoading);
  const [error, setError] = useState(countryError);
  const [homePhotos, setHomePhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosSource, setPhotosSource] = useState('fallback');

  useEffect(() => {
    setLocalCountry(country);
    setLoading(countryLoading);
    setError(countryError);
  }, [country, countryLoading, countryError]);

  useEffect(() => {
    if (localCountry || loading || error) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMoroccoInfo();
        if (!cancelled) setLocalCountry(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [localCountry, loading, error]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPhotosLoading(true);
      try {
        const { hits, source } = await getHomePhotos();
        if (!cancelled) {
          setHomePhotos(hits);
          setPhotosSource(source);
        }
      } finally {
        if (!cancelled) setPhotosLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const heroPhotoUrl = photoDisplayUrl(homePhotos[0]);
  const heroStyle = heroPhotoUrl
    ? { '--hero-photo': `url("${heroPhotoUrl}")` }
    : undefined;

  const handlePhotoClick = (photo) => {
    const theme = photo.tags?.split(',')[0]?.trim() || 'Maroc';
    onExploreTheme(theme);
  };

  const name = localCountry?.name?.common ?? 'Maroc';
  const flag = localCountry?.flag ?? '🇲🇦';
  const capital = localCountry?.capital?.[0] ?? 'Rabat';
  const region = localCountry?.region ?? 'Afrique';
  const subregion = localCountry?.subregion ?? 'Afrique du Nord';
  const pop = localCountry?.population;
  const languages = localCountry?.languages
    ? Object.values(localCountry.languages).join(', ')
    : 'Arabe, amazigh';
  const currencies = localCountry?.currencies
    ? Object.values(localCountry.currencies)
        .map(c => `${c.name} (${c.symbol})`)
        .join(', ')
    : 'Dirham marocain (MAD)';
  const coat = localCountry?.coatOfArms?.png;

  return (
    <div className="page home-page">
      <section
        className={`hero-maroc${heroPhotoUrl ? ' hero-maroc--photo' : ''}`}
        style={heroStyle}
        aria-labelledby="hero-title"
      >
        <div className="hero-maroc__pattern" aria-hidden="true" />
        <div className="hero-maroc__content">
          <p className="hero-maroc__eyebrow">Royaume du Maroc · المملكة المغربية</p>
          <h1 id="hero-title" className="hero-maroc__title">
            {flag} {name}
          </h1>
          <p className="hero-maroc__lead">
            Découvrez le patrimoine, les villes impériales, la gastronomie et les paysages
            du Maghreb — météo, images et articles via des APIs ouvertes.
          </p>
          <div className="hero-maroc__actions">
            <button type="button" className="btn" onClick={onGoGallery}>
              Explorer en images
            </button>
            <button type="button" className="btn btn--outline" onClick={onGoCulture}>
              Articles culture
            </button>
          </div>
        </div>
        {coat && (
          <img
            className="hero-maroc__coat"
            src={coat}
            alt=""
            width={120}
            height={120}
            loading="lazy"
          />
        )}
      </section>

      <HomePhotoGrid
        photos={homePhotos}
        loading={photosLoading}
        source={photosSource}
        onPhotoClick={handlePhotoClick}
        onGoGallery={onGoGallery}
      />

      <section className="info-grid" aria-label="Informations sur le Maroc">
        <h2 className="section-title">Le pays en bref</h2>
        {loading && <p className="empty-hint">Chargement des données (REST Countries)…</p>}
        {error && (
          <p className="api-banner api-banner--warn" role="alert">
            REST Countries : {error}
          </p>
        )}
        {!loading && !error && localCountry && (
          <div className="stats-cards">
            <article className="stat-card">
              <span className="stat-card__label">Capitale</span>
              <strong>{capital}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Population</span>
              <strong>{formatPopulation(pop)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Région</span>
              <strong>{region}</strong>
              <span className="stat-card__sub">{subregion}</span>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Langues</span>
              <strong>{languages}</strong>
            </article>
            <article className="stat-card stat-card--wide">
              <span className="stat-card__label">Monnaie</span>
              <strong>{currencies}</strong>
            </article>
          </div>
        )}
      </section>

      <section className="chip-section">
        <h2 className="section-title">Villes à explorer</h2>
        <p className="section-desc">Météo OpenWeather + galerie Pixabay</p>
        <div className="chips">
          {MOROCCAN_CITIES.map(city => (
            <button
              key={city}
              type="button"
              className="chip"
              onClick={() => onExploreCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <section className="chip-section">
        <h2 className="section-title">Thèmes visuels</h2>
        <p className="section-desc">Galerie photo du royaume</p>
        <div className="chips">
          {GALLERY_THEMES.map(theme => (
            <button
              key={theme}
              type="button"
              className="chip chip--gold"
              onClick={() => onExploreTheme(theme)}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}