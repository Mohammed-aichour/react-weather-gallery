import React, { useState } from 'react';
import { photoDisplayUrl } from '../../api';

export default function CulturePhotoCard({ photo, label, onClick }) {
  const urls = [
    photo.largeImageURL,
    photo.webformatURL,
    photo.previewURL,
    photo.src,
  ].filter((u) => typeof u === 'string' && u.length > 0);

  const [urlIndex, setUrlIndex] = useState(0);
  const src = urls[urlIndex] || photoDisplayUrl(photo);
  const title = label || photo.topic || photo.tags?.split(',')[0] || 'Culture';

  return (
    <button type="button" className="culture-photo-card" onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (urlIndex < urls.length - 1) setUrlIndex((i) => i + 1);
          }}
        />
      ) : (
        <span className="culture-photo-card__placeholder">Photo</span>
      )}
      <span className="culture-photo-card__label">{title}</span>
    </button>
  );
}
