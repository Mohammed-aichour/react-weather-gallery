import axios from 'axios';
import { OPENWEATHER_ID, isOpenWeatherConfigured, normalizeCityForWeather } from '../config';
import { axiosErrorMessage } from './httpError';

const OW_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const WMO_LABELS = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine',
  55: 'Bruine dense',
  61: 'Pluie faible',
  63: 'Pluie modérée',
  65: 'Pluie forte',
  71: 'Neige faible',
  73: 'Neige modérée',
  75: 'Neige forte',
  80: 'Averses légères',
  81: 'Averses',
  82: 'Averses violentes',
  95: 'Orage',
};

function wmoDescription(code) {
  return WMO_LABELS[code] ?? 'Conditions variables';
}

/** Format unifié compatible avec WeatherHero / ForecastCard. */
function buildForecastPayload(cityName, countryCode, list, provider) {
  return {
    city: { name: cityName, country: countryCode || 'MA' },
    list,
    provider,
  };
}

function mapOpenWeatherData(data) {
  const list = (data.list ?? []).map((item) => ({
    dt_txt: item.dt_txt,
    main: {
      temp: item.main?.temp ?? 0,
      humidity: item.main?.humidity ?? 0,
    },
    weather: [{ description: item.weather?.[0]?.description ?? '' }],
    wind: { speed: item.wind?.speed ?? 0 },
  }));

  if (list.length === 0 && data.list?.[0]) {
    list.push(data.list[0]);
  }

  return buildForecastPayload(
    data.city?.name ?? 'Maroc',
    data.city?.country ?? 'MA',
    list,
    'openweather'
  );
}

async function fetchOpenWeather(city) {
  const { data } = await axios.get(`${OW_BASE}/forecast`, {
    params: {
      q: `${city},MA`,
      appid: OPENWEATHER_ID,
      units: 'metric',
      lang: 'fr',
    },
    timeout: 20000,
  });
  return mapOpenWeatherData(data);
}

async function fetchOpenMeteo(city) {
  const { data: geoData } = await axios.get(GEO_URL, {
    params: {
      name: city,
      country: 'MA',
      count: 1,
      language: 'fr',
      format: 'json',
    },
    timeout: 20000,
  });

  const place = geoData?.results?.[0];
  if (!place) {
    throw new Error(`Ville « ${city} » introuvable au Maroc. Essayez Marrakech, Rabat, Fès…`);
  }

  const { data: forecast } = await axios.get(FORECAST_URL, {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      hourly: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'Africa/Casablanca',
      forecast_days: 5,
    },
    timeout: 20000,
  });

  const list = [];
  const now = forecast.current;

  if (now) {
    list.push({
      dt_txt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      main: {
        temp: now.temperature_2m,
        humidity: now.relative_humidity_2m,
      },
      weather: [{ description: wmoDescription(now.weather_code) }],
      wind: { speed: now.wind_speed_10m ?? 0 },
    });
  }

  const hourly = forecast.hourly;
  if (hourly?.time) {
    for (let i = 3; i < hourly.time.length && list.length < 13; i += 3) {
      list.push({
        dt_txt: hourly.time[i].replace('T', ' '),
        main: {
          temp: hourly.temperature_2m[i],
          humidity: hourly.relative_humidity_2m[i],
        },
        weather: [{ description: wmoDescription(hourly.weather_code[i]) }],
        wind: { speed: hourly.wind_speed_10m[i] ?? 0 },
      });
    }
  }

  return buildForecastPayload(
    place.name,
    place.country_code ?? 'MA',
    list,
    'open-meteo'
  );
}

export async function getForecastByCity(cityInput) {
  const city = normalizeCityForWeather(cityInput);
  if (!city) {
    throw new Error('Indiquez une ville marocaine.');
  }

  if (isOpenWeatherConfigured()) {
    try {
      return await fetchOpenWeather(city);
    } catch (e) {
      try {
        return await fetchOpenMeteo(city);
      } catch {
        throw new Error(axiosErrorMessage(e));
      }
    }
  }

  try {
    return await fetchOpenMeteo(city);
  } catch (e) {
    throw new Error(axiosErrorMessage(e));
  }
}
