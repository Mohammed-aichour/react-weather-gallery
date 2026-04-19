import axios from 'axios';
import { OPENWEATHER_ID, isOpenWeatherConfigured } from '../config';
import { axiosErrorMessage } from './httpError';

const BASE = 'https://api.openweathermap.org/data/2.5';

export async function getForecastByCity(city) {
  if (!isOpenWeatherConfigured()) {
    throw new Error(
      'Clé OpenWeather manquante : ajoutez REACT_APP_OPENWEATHER_ID dans .env.local (racine de myapp), puis redémarrez npm start.'
    );
  }
  try {
    const { data } = await axios.get(`${BASE}/forecast`, {
      params: {
        q: city.trim(),
        appid: OPENWEATHER_ID,
        units: 'metric',
        lang: 'fr',
      },
      timeout: 20000,
    });
    return data;
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}
