import React, { useState, useCallback, useEffect } from 'react';
import {
  searchWikipedia,
  getArticleSummary,
  getWikiPageImage,
  getCultureShowcasePhotos,
  getPhotosForSubject,
  photoDisplayUrl,
} from '../../api';
import { CULTURE_TOPICS } from '../../config';
import { SearchBar } from '../Common';
import CulturePhotoCard from './CulturePhotoCard';

function CulturePhotoStrip({ photos, title }) {
  if (!photos?.length) return null;

  return (
    <section className="culture-photo-strip" aria-label={title}>
      <h2 className="section-title">{title}</h2>
      <div className="culture-photo-strip__grid">
        {photos.map((photo, i) => (
          <figure key={photo.id ?? i} className="culture-photo-strip__item">
            <img
              src={photoDisplayUrl(photo)}
              alt={photo.tags || 'Culture marocaine'}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function CulturePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [article, setArticle] = useState(null);
  const [articlePhotos, setArticlePhotos] = useState([]);
  const [heroImage, setHeroImage] = useState(null);
  const [showcase, setShowcase] = useState([]);
  const [showcaseLoading, setShowcaseLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setShowcaseLoading(true);
      try {
        const photos = await getCultureShowcasePhotos();
        if (!cancelled) setShowcase(photos);
      } finally {
        if (!cancelled) setShowcaseLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const runSearch = useCallback(async (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setArticle(null);
    setArticlePhotos([]);
    setHeroImage(null);

    try {
      const { titles, descriptions } = await searchWikipedia(trimmed);
      const items = titles.map((title, i) => ({
        title,
        description: descriptions[i] || '',
      }));
      setResults(items);
      if (items.length === 0) {
        setError('Aucun article trouvé sur Wikipédia (fr).');
      }
    } catch (e) {
      setResults([]);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const openArticle = useCallback(async (title) => {
    setLoading(true);
    setError(null);
    setArticlePhotos([]);

    try {
      const [summary, wikiImg, photoPack] = await Promise.all([
        getArticleSummary(title),
        getWikiPageImage(title),
        getPhotosForSubject(title, 6),
      ]);
      setArticle(summary);
      setHeroImage(summary.thumbnail?.source || wikiImg || photoDisplayUrl(photoPack.hits[0]));
      setArticlePhotos(photoPack.hits);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const openTopic = useCallback(
    (topic) => {
      setQuery(topic);
      runSearch(topic);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [runSearch]
  );

  if (article) {
    return (
      <div className="page culture-page">
        <button
          type="button"
          className="nav-btn"
          onClick={() => {
            setArticle(null);
            setArticlePhotos([]);
            setHeroImage(null);
          }}
          style={{ marginBottom: '20px' }}
        >
          ← Retour aux résultats
        </button>

        {heroImage && (
          <div className="culture-article-hero">
            <img src={heroImage} alt={article.title} />
            <div className="culture-article-hero__overlay">
              <h1>{article.title}</h1>
              {article.description && <p>{article.description}</p>}
            </div>
          </div>
        )}

        <article className="wiki-article">
          {!heroImage && (
            <>
              <h1>{article.title}</h1>
              {article.description && (
                <p className="wiki-article__desc">{article.description}</p>
              )}
            </>
          )}
          {article.thumbnail?.source && heroImage !== article.thumbnail.source && (
            <img
              className="wiki-article__thumb"
              src={article.thumbnail.source}
              alt=""
              loading="lazy"
            />
          )}
          <div
            className="wiki-article__extract"
            dangerouslySetInnerHTML={{ __html: article.extract_html }}
          />
          {article.content_urls?.desktop?.page && (
            <a
              href={article.content_urls.desktop.page}
              target="_blank"
              rel="noreferrer"
              className="btn"
              style={{ marginTop: '24px' }}
            >
              Lire sur Wikipédia
            </a>
          )}
        </article>

        <CulturePhotoStrip photos={articlePhotos} title="Galerie liée au sujet" />
      </div>
    );
  }

  return (
    <div className="page culture-page">
      <header className="culture-header">
        <h1>Culture &amp; patrimoine</h1>
        <p className="section-desc">
          Articles Wikipédia et photos du Maroc — cliquez sur une image ou un sujet pour en savoir plus.
        </p>
      </header>

      <section className="culture-showcase" aria-label="Sujets culturels en images">
        <h2 className="section-title">Explorer en images</h2>
        {showcaseLoading && <p className="empty-hint">Chargement des photos culture…</p>}
        {!showcaseLoading && (
          <div className="culture-showcase__grid">
            {showcase.map((photo) => (
              <CulturePhotoCard
                key={photo.topic || photo.id}
                photo={photo}
                label={photo.topic}
                onClick={() => openTopic(photo.topic || photo.tags)}
              />
            ))}
          </div>
        )}
      </section>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={() => runSearch(query)}
        loading={loading}
        placeholder="Rechercher : tajine, zellige, Gnawa…"
      />

      <section className="chip-section">
        <h2 className="section-title">Sujets suggérés</h2>
        <div className="chips">
          {CULTURE_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="chip"
              onClick={() => openTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="api-banner api-banner--err" role="alert">
          {error}
        </div>
      )}

      {loading && results.length === 0 && (
        <p className="empty-hint">Recherche Wikipédia en cours…</p>
      )}

      <ul className="wiki-results">
        {results.map((item) => (
          <li key={item.title}>
            <button
              type="button"
              className="wiki-result-card"
              onClick={() => openArticle(item.title)}
            >
              <strong>{item.title}</strong>
              {item.description && <span>{item.description}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
