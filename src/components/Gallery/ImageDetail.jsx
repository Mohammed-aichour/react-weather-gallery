import React, { useMemo, useState } from 'react';

function fullSizeUrl(image) {
  if (!image) return '';
  return (
    image.largeImageURL ||
    image.webformatURL ||
    image.previewURL ||
    ''
  );
}

export default function ImageDetail({ image, onBack }) {
  const candidates = useMemo(() => {
    if (!image) return [];
    return [image.largeImageURL, image.webformatURL, image.previewURL].filter(
      (u) => typeof u === 'string' && u.length > 0
    );
  }, [image]);
  const [idx, setIdx] = useState(0);
  const src = candidates[idx] ?? '';

  const downloadHref = fullSizeUrl(image);

  return (
    <div className="page">
      <button type="button" className="nav-btn" onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Retour
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {src ? (
          <img
            src={src}
            alt={image.tags}
            style={{ width: '100%', borderRadius: '14px' }}
            onError={() => {
              if (idx < candidates.length - 1) setIdx((i) => i + 1);
            }}
          />
        ) : (
          <p className="empty-hint">Image indisponible.</p>
        )}
        <div>
          <h2>Stats</h2>
          <p>Vues: {image.views}</p>
          <p>Likes: {image.likes}</p>
          {downloadHref && (
            <a
              href={downloadHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn--block"
              style={{ marginTop: '20px' }}
            >
              Télécharger
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
