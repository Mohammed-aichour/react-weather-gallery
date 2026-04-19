import axios from 'axios';

/** Message lisible à partir d’une erreur Axios (OpenWeather, Pixabay, etc.). */
export function axiosErrorMessage(error) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : String(error);
  }
  const d = error.response?.data;
  if (typeof d?.message === 'string') return d.message;
  if (Array.isArray(d?.message)) return d.message.join(' ');
  const status = error.response?.status;
  if (status === 401) return 'Clé API refusée (401) — vérifiez la clé ou l’activation du compte.';
  if (status === 403) return 'Accès refusé (403).';
  if (status === 404) return 'Donnée introuvable (404).';
  if (status === 429) return 'Trop de requêtes (429), réessayez plus tard.';
  return error.message || 'Erreur réseau';
}
