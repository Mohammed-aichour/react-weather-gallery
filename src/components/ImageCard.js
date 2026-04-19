import { Link } from 'react-router-dom';

function ImageCard({ image }) {
  return (
    <div>
      <p>{image.tags} | {image.imageWidth}x{image.imageHeight}</p>
      <img src={image.previewURL} alt={image.tags} />
      <Link to={`/image/${image.id}`} state={{ image }}>
        More Details
      </Link>
    </div>
  );
}