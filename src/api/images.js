import axios from 'axios';
import {
  PIXABAY_KEY,
  PER_PAGE,
  HOME_PHOTO_COUNT,
  HOME_FALLBACK_PHOTOS,
  CULTURE_TOPIC_PHOTOS,
  isPixabayConfigured,
} from '../config';
import { axiosErrorMessage } from './httpError';

export function photoDisplayUrl(image) {
  if (!image) return '';
  return (
    image.largeImageURL ||
    image.webformatURL ||
    image.previewURL ||
    image.src ||
    ''
  );
}

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

/** Photos d’accueil : Pixabay si configuré, sinon bibliothèque Wikimedia. */
export async function getHomePhotos(count = HOME_PHOTO_COUNT) {
  const fallback = HOME_FALLBACK_PHOTOS.slice(0, count);

  if (!isPixabayConfigured()) {
    return { hits: fallback, source: 'fallback' };
  }

  try {
    const { hits } = await searchPhotos('Maroc paysage médina culture', 1);
    const list = (hits.length > 0 ? hits : fallback).slice(0, count);
    return { hits: list, source: hits.length > 0 ? 'pixabay' : 'fallback' };
  } catch {
    return { hits: fallback, source: 'fallback' };
  }
}

function fallbackById(id) {
  return HOME_FALLBACK_PHOTOS.find((p) => p.id === id) ?? HOME_FALLBACK_PHOTOS[0];
}

/** Une photo pour un sujet culture (Pixabay ou Wikimedia). */
export async function getPhotoForTopic(topicEntry) {
  const fallback = fallbackById(topicEntry.fallbackId);

  if (!isPixabayConfigured()) {
    return { ...fallback, topic: topicEntry.topic };
  }

  try {
    const { hits } = await searchPhotos(topicEntry.query, 1);
    const hit = hits[0];
    if (hit) return { ...hit, topic: topicEntry.topic };
  } catch {
    /* ignore */
  }

  return { ...fallback, topic: topicEntry.topic };
}

/** Grille culture : une image par sujet suggéré. */
export async function getCultureShowcasePhotos() {
  const results = await Promise.all(
    CULTURE_TOPIC_PHOTOS.map((entry) => getPhotoForTopic(entry))
  );
  return results;
}

/** Plusieurs photos liées à un titre (article ou recherche). */
export async function getPhotosForSubject(subject, max = 6) {
  const query = moroccoPhotoQuery(subject);
  const fallback = HOME_FALLBACK_PHOTOS.slice(0, max);

  if (!isPixabayConfigured()) {
    return { hits: fallback, source: 'fallback' };
  }

  try {
    const { hits } = await searchPhotos(query, 1);
    const list = (hits.length > 0 ? hits : fallback).slice(0, max);
    return { hits: list, source: hits.length > 0 ? 'pixabay' : 'fallback' };
  } catch {
    return { hits: fallback, source: 'fallback' };
  }
}
