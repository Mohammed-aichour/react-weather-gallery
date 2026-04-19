const PLACEHOLDER_PIX = 'VOTRE_CLE_PIXABAY';
const PLACEHOLDER_OW = 'VOTRE_APPID_OPENWEATHER';

export const PIXABAY_KEY =
  process.env.REACT_APP_PIXABAY_KEY ?? PLACEHOLDER_PIX;
export const OPENWEATHER_ID =
  process.env.REACT_APP_OPENWEATHER_ID ?? PLACEHOLDER_OW;
export const PER_PAGE = 12;

/** True si la clé ressemble à une vraie valeur (pas le placeholder du dépôt). */
export function isOpenWeatherConfigured() {
  const v = String(OPENWEATHER_ID ?? '').trim();
  return v.length > 0 && v !== PLACEHOLDER_OW && !/^VOTRE_/i.test(v);
}

export function isPixabayConfigured() {
  const v = String(PIXABAY_KEY ?? '').trim();
  return v.length > 0 && v !== PLACEHOLDER_PIX && !/^VOTRE_/i.test(v);
}