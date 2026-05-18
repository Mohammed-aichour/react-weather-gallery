import React, { useState, useCallback } from 'react';
import { searchWikipedia, getArticleSummary } from '../../api';
import { CULTURE_TOPICS } from '../../config';
import { SearchBar } from '../Common';

export default function CulturePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  const runSearch = useCallback(async (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setArticle(null);

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
    try {
      const summary = await getArticleSummary(title);
      setArticle(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  if (article) {
    return (
      <div className="page culture-page">
        <button
          type="button"
          className="nav-btn"
          onClick={() => setArticle(null)}
          style={{ marginBottom: '20px' }}
        >
          ← Retour aux résultats
        </button>
        <article className="wiki-article">
          {article.thumbnail?.source && (
            <img
              className="wiki-article__thumb"
              src={article.thumbnail.source}
              alt=""
              width={article.thumbnail.width}
              height={article.thumbnail.height}
              loading="lazy"
            />
          )}
          <h1>{article.title}</h1>
          {article.description && (
            <p className="wiki-article__desc">{article.description}</p>
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
      </div>
    );
  }

  return (
    <div className="page culture-page">
      <header className="culture-header">
        <h1>Culture &amp; patrimoine</h1>
        <p className="section-desc">
          Articles en français via l&apos;API Wikipédia — cuisine, artisanat, médinas, festivals…
        </p>
      </header>

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
          {CULTURE_TOPICS.map(topic => (
            <button
              key={topic}
              type="button"
              className="chip"
              onClick={() => {
                setQuery(topic);
                runSearch(topic);
              }}
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
        {results.map(item => (
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
