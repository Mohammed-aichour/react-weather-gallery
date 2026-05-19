import axios from 'axios';
import { axiosErrorMessage } from './httpError';

const WIKI_API = 'https://fr.wikipedia.org/w/api.php';
const WIKI_REST = 'https://fr.wikipedia.org/api/rest_v1/page/summary';

export async function searchWikipedia(query, limit = 8) {
  const trimmed = query.trim();
  if (!trimmed) return { titles: [], descriptions: [] };

  try {
    const { data } = await axios.get(WIKI_API, {
      params: {
        action: 'opensearch',
        search: trimmed,
        limit,
        namespace: 0,
        format: 'json',
        origin: '*',
      },
      timeout: 20000,
    });

    const [, titles, descriptions] = data ?? [];
    return {
      titles: Array.isArray(titles) ? titles : [],
      descriptions: Array.isArray(descriptions) ? descriptions : [],
    };
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}

export async function getArticleSummary(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  try {
    const { data } = await axios.get(`${WIKI_REST}/${encoded}`, {
      timeout: 20000,
    });
    return data;
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}

/** Image principale d’un article Wikipédia (si disponible). */
export async function getWikiPageImage(title) {
  try {
    const { data } = await axios.get(WIKI_API, {
      params: {
        action: 'query',
        titles: title,
        prop: 'pageimages',
        format: 'json',
        pithumbsize: 800,
        origin: '*',
      },
      timeout: 20000,
    });
    const pages = data?.query?.pages ?? {};
    const page = Object.values(pages)[0];
    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}
