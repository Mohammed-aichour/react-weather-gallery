import { useLocation } from 'react-router-dom';

function ImageDetail() {
  const { state } = useLocation();
  const { image } = state;

  return (
    <div>
      <h2>{image.tags}</h2>
      <img src={image.largeImageURL} alt={image.tags} />
      <p>Par : {image.user}</p>
      <p>Vues : {image.views} | Likes : {image.likes}</p>
    </div>
  );
}