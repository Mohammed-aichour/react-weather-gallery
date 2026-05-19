import React, { useState } from 'react';

function HomePhotoTile({ photo, featured, onClick }) {
  const urls = [
    photo.largeImageURL,
    photo.webformatURL,
    photo.previewURL,
    photo.src,
  ].filter((u) => typeof u === 'string' && u.length > 0);

  const [urlIndex, setUrlIndex] = useState(0);
  const src = urls[urlIndex] ?? '';
  const label = photo.tags?.split(',')[0]?.trim() || 'Maroc';

  return (
    <button
      type="button"
      className={`home-photos__tile${featured ? ' home-photos__tile--featured' : ''}`}
      onClick={() => onClick(photo)}
      aria-label={`Voir plus d’images : ${label}`}
    >
      {src ? (
        <img
          src={src}
          alt={photo.tags || label}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
          }}
        />
      ) : (
        <span className="home-photos__placeholder">Image indisponible</span>
      )}
      <span className="home-photos__caption">{label}</span>
    </button>
  );
}

export default function HomePhotoGrid({ photos, loading, source, onPhotoClick, onGoGallery }) {
  if (loading) {
    return (
      <section className="home-photos-section" aria-labelledby="home-photos-title">
        <h2 id="home-photos-title" className="section-title">
          Le Maroc en images
        </h2>
        <p className="empty-hint">Chargement des photos…</p>
        <div className="home-photos home-photos--skeleton" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="home-photos__tile home-photos__tile--skeleton" />
          ))}
        </div>
      </section>
    );
  }

  if (!photos?.length) return null;

  return (
    <section className="home-photos-section" aria-labelledby="home-photos-title">
      <div className="home-photos-section__head">
        <div>
          <h2 id="home-photos-title" className="section-title">
            Le Maroc en images
          </h2>
          <p className="section-desc">
            {source === 'pixabay'
              ? 'Aperçu via Pixabay — cliquez pour explorer la galerie complète.'
              : 'Sélection Wikimedia Commons — ajoutez une clé Pixabay pour plus de photos.'}
          </p>
        </div>
        <button type="button" className="btn btn--sm" onClick={onGoGallery}>
          Toute la galerie
        </button>
      </div>
      <div className="home-photos">
        {photos.map((photo, index) => (
          <HomePhotoTile
            key={photo.id ?? index}
            photo={photo}
            featured={index === 0}
            onClick={onPhotoClick}
          />
        ))}
      </div>
    </section>
  );
}
