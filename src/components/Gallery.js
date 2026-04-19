import axios from 'axios';
import { useState } from 'react';
import ImageCard from './ImageCard';

const API_KEY = 'VOTRE_CLE_PIXABAY';

function Gallery() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);

  const search = async () => {
    const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&per_page=12`;
    const res = await axios.get(url);
    setImages(res.data.hits);
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      <div className="grid">
        {images.map(img => <ImageCard key={img.id} image={img} />)}
      </div>
    </div>
  );
}