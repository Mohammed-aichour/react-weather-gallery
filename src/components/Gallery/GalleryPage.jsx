import React, { useState } from 'react';
import { PER_PAGE } from '../../config';
import { Pagination } from '../Common';
import ImageCard from './ImageCard';
import ImageDetail from './ImageDetail';

export default function GalleryPage({
  images,
  total,
  page,
  activeCity,
  onPage,
  loading,
}) {
  const [detail, setDetail] = useState(null);

  if (detail) {
    return <ImageDetail image={detail} onBack={() => setDetail(null)} />;
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="page">
      {!activeCity && !loading && (
        <p className="empty-hint">
          Choisissez une ville ou un thème marocain sur l&apos;accueil, ou lancez une recherche
          ci-dessus pour découvrir le patrimoine visuel du Maroc (Pixabay).
        </p>
      )}
      {loading && images.length === 0 && activeCity && (
        <p className="empty-hint">Chargement des images…</p>
      )}
      {!loading && activeCity && images.length === 0 && (
        <p className="empty-hint">
          Aucune photo trouvée pour « {activeCity} » sur Pixabay. Essayez un autre nom de ville ou
          vérifiez votre clé API.
        </p>
      )}
      <div className="grid">
        {images.map((img) => (
          <ImageCard key={img.id} image={img} onDetail={setDetail} />
        ))}
      </div>
      {total > PER_PAGE && activeCity && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={onPage}
        />
      )}
    </div>
  );
}
