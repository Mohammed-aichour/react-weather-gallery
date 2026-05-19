const PLACEHOLDER_PIX = 'VOTRE_CLE_PIXABAY';
const PLACEHOLDER_OW = 'VOTRE_APPID_OPENWEATHER';

export const PIXABAY_KEY =
  process.env.REACT_APP_PIXABAY_KEY ?? PLACEHOLDER_PIX;
export const OPENWEATHER_ID =
  process.env.REACT_APP_OPENWEATHER_ID ?? PLACEHOLDER_OW;
export const PER_PAGE = 12;

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Essaouira',
  'Chefchaouen',
];

const CITY_ALIASES = {
  fes: 'Fes',
  fès: 'Fes',
  fez: 'Fes',
  meknes: 'Meknes',
  meknès: 'Meknes',
  marrakesh: 'Marrakech',
  casablanca: 'Casablanca',
  rabat: 'Rabat',
  tanger: 'Tanger',
  tangier: 'Tanger',
  agadir: 'Agadir',
  oujda: 'Oujda',
  essaouira: 'Essaouira',
  chefchaouen: 'Chefchaouen',
};

/** Normalise le nom de ville pour les APIs météo / géocodage. */
export function normalizeCityForWeather(input) {
  const raw = String(input ?? '')
    .trim()
    .replace(/,MA$/i, '')
    .trim();
  if (!raw) return '';
  const key = raw
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  return CITY_ALIASES[key] ?? raw;
}

/** Sujets culture + requête photo + image de secours Wikimedia. */
export const CULTURE_TOPIC_PHOTOS = [
  { topic: 'Cuisine marocaine', query: 'tajine cuisine maroc', fallbackId: 'wm-the' },
  { topic: 'Architecture marocaine', query: 'riad architecture maroc', fallbackId: 'wm-marrakech' },
  { topic: 'Médina de Fès', query: 'medina Fes Morocco', fallbackId: 'wm-fes' },
  { topic: 'Artisanat marocain', query: 'artisanat maroc souk', fallbackId: 'wm-fes' },
  { topic: 'Musique marocaine', query: 'musique gnawa maroc', fallbackId: 'wm-essaouira' },
  { topic: 'Festival de Fès', query: 'Fes festival maroc', fallbackId: 'wm-fes' },
  { topic: 'Zellige', query: 'zellige maroc', fallbackId: 'wm-marrakech' },
  { topic: 'Hammam', query: 'hammam maroc', fallbackId: 'wm-fes' },
  { topic: 'Thé à la menthe', query: 'mint tea morocco', fallbackId: 'wm-the' },
  { topic: 'Souk marocain', query: 'souk maroc', fallbackId: 'wm-marrakech' },
];

export const CULTURE_TOPICS = [
  'Cuisine marocaine',
  'Architecture marocaine',
  'Médina de Fès',
  'Artisanat marocain',
  'Musique marocaine',
  'Festival de Fès',
  'Zellige',
  'Hammam',
  'Thé à la menthe',
  'Souk marocain',
];

export const GALLERY_THEMES = [
  'Maroc paysage',
  'Médina Marrakech',
  'Atlas Maroc',
  'Sahara Maroc',
  'Port Essaouira',
  'Chefchaouen bleu',
];

export const HOME_PHOTO_COUNT = 8;

/** Images Wikimedia (sans clé API) pour l’accueil si Pixabay est indisponible. */
export const HOME_FALLBACK_PHOTOS = [
  {
    id: 'wm-chefchaouen',
    tags: 'Chefchaouen, Maroc',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Callej%C3%B3n_azul_Chefchaouen.jpg/640px-Callej%C3%B3n_azul_Chefchaouen.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Callej%C3%B3n_azul_Chefchaouen.jpg/1280px-Callej%C3%B3n_azul_Chefchaouen.jpg',
  },
  {
    id: 'wm-marrakech',
    tags: 'Marrakech, Koutoubia',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Koutoubia_Mosque_and_Minaret_at_sunset%2C_Marrakesh%2C_Morocco.jpg/640px-Koutoubia_Mosque_and_Minaret_at_sunset%2C_Marrakesh%2C_Morocco.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Koutoubia_Mosque_and_Minaret_at_sunset%2C_Marrakesh%2C_Morocco.jpg/1280px-Koutoubia_Mosque_and_Minaret_at_sunset%2C_Marrakesh%2C_Morocco.jpg',
  },
  {
    id: 'wm-sahara',
    tags: 'Sahara, Merzouga',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Erg_Chebbi%2C_Merzouga%2C_Morocco.jpg/640px-Erg_Chebbi%2C_Merzouga%2C_Morocco.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Erg_Chebbi%2C_Merzouga%2C_Morocco.jpg/1280px-Erg_Chebbi%2C_Merzouga%2C_Morocco.jpg',
  },
  {
    id: 'wm-casablanca',
    tags: 'Casablanca, Mosquée Hassan II',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Hassan_II_mosque_Casablanca_morning.JPG/640px-Hassan_II_mosque_Casablanca_morning.JPG',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Hassan_II_mosque_Casablanca_morning.JPG/1280px-Hassan_II_mosque_Casablanca_morning.JPG',
  },
  {
    id: 'wm-fes',
    tags: 'Fès, médina',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fes_Medina.jpg/640px-Fes_Medina.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Fes_Medina.jpg/1280px-Fes_Medina.jpg',
  },
  {
    id: 'wm-essaouira',
    tags: 'Essaouira, port',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Essaouira_harbour%2C_Morocco.jpg/640px-Essaouira_harbour%2C_Morocco.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Essaouira_harbour%2C_Morocco.jpg/1280px-Essaouira_harbour%2C_Morocco.jpg',
  },
  {
    id: 'wm-atlas',
    tags: 'Atlas, montagnes',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/High_Atlas%2C_Morocco.jpg/640px-High_Atlas%2C_Morocco.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/High_Atlas%2C_Morocco.jpg/1280px-High_Atlas%2C_Morocco.jpg',
  },
  {
    id: 'wm-the',
    tags: 'Thé à la menthe, Maroc',
    webformatURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mint_tea_Morocco.jpg/640px-Mint_tea_Morocco.jpg',
    largeImageURL:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mint_tea_Morocco.jpg/1280px-Mint_tea_Morocco.jpg',
  },
];

/** True si la clé ressemble à une vraie valeur (pas le placeholder du dépôt). */
export function isOpenWeatherConfigured() {
  const v = String(OPENWEATHER_ID ?? '').trim();
  return v.length > 0 && v !== PLACEHOLDER_OW && !/^VOTRE_/i.test(v);
}

export function isPixabayConfigured() {
  const v = String(PIXABAY_KEY ?? '').trim();
  return v.length > 0 && v !== PLACEHOLDER_PIX && !/^VOTRE_/i.test(v);
}