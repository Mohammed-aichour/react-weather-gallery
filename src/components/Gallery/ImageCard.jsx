import React, { useMemo, useState } from 'react';

/** URLs possibles selon la doc Pixabay (ordre : meilleure qualité d’abord). */
function collectImageUrls(image) {
  if (!image || typeof image !== 'object') return [];
  return [
    image.webformatURL,
    image.largeImageURL,
    image.previewURL,
  ].filter((u) => typeof u === 'string' && u.length > 0);
}

export default function ImageCard({ image, onDetail }) {
  const urls = useMemo(() => collectImageUrls(image), [image]);
  const [urlIndex, setUrlIndex] = useState(0);
  const src = urls[urlIndex] ?? '';

  return (
    <div className="img-card">
      {src ? (
        <img
          src={src}
          alt={image.tags || 'Photo'}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
          }}
        />
      ) : (
        <div className="img-card__broken">Image indisponible</div>
      )}
      <div className="img-body">
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
          {image.tags}
        </div>
        <button
          className="btn btn--block btn--sm"
          type="button"
          onClick={() => onDetail(image)}
        >
          Détails
        </button>
      </div>
    </div>
  );
}
