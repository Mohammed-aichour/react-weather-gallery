import axios from 'axios';
import { PIXABAY_KEY, PER_PAGE, isPixabayConfigured } from '../config';
import { axiosErrorMessage } from './httpError';

/** Enrichit la requête pour cibler le patrimoine et les paysages marocains. */
export function moroccoPhotoQuery(query) {
  const q = query.trim();
  if (!q) return 'Maroc culture';
  const lower = q.toLowerCase();
  if (lower.includes('maroc') || lower.includes('morocco') || lower.includes('maghreb')) {
    return q;
  }
  return `${q} Maroc`;
}

export async function searchPhotos(query, page = 1) {
  if (!isPixabayConfigured()) {
    throw new Error(
      'Clé Pixabay manquante : ajoutez REACT_APP_PIXABAY_KEY dans .env.local (racine de myapp), puis redémarrez npm start.'
    );
  }
  try {
    const { data } = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_KEY,
        q: moroccoPhotoQuery(query),
        per_page: PER_PAGE,
        page,
        image_type: 'photo',
        safesearch: true,
      },
      timeout: 20000,
    });

    if (data && (data.error || data.errors)) {
      const msg =
        typeof data.error === 'string'
          ? data.error
          : JSON.stringify(data.error || data.errors);
      throw new Error(msg);
    }

    return {
      hits: Array.isArray(data?.hits) ? data.hits : [],
      totalHits: data?.totalHits ?? data?.total ?? 0,
    };
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}
