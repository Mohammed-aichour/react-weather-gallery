import React, { useState, useCallback, useMemo } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import GalleryPage from './components/Gallery/GalleryPage';
import WeatherPage from './components/Weather/WeatherPage';
import { SearchBar } from './components/Common';
import { getForecastByCity, searchPhotos } from './api';
import { isOpenWeatherConfigured, isPixabayConfigured } from './config';

function reasonMessage(reason) {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}

function App() {
  const [page, setPage] = useState('gallery');
  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [galleryHits, setGalleryHits] = useState([]);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const configHint = useMemo(() => {
    const miss = [];
    if (!isOpenWeatherConfigured()) miss.push('REACT_APP_OPENWEATHER_ID (OpenWeather)');
    if (!isPixabayConfigured()) miss.push('REACT_APP_PIXABAY_KEY (Pixabay)');
    if (miss.length === 0) return null;
    return `Clés API manquantes : ${miss.join(' et ')}. Créez le fichier myapp/.env.local avec ces variables, puis redémarrez npm start.`;
  }, []);

  const runCitySearch = useCallback(async (q, imagePage = 1) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setSearchLoading(true);
    setNotice(null);

    try {
      const [wResult, pResult] = await Promise.allSettled([
        getForecastByCity(trimmed),
        searchPhotos(trimmed, imagePage),
      ]);

      const weatherOk = wResult.status === 'fulfilled';
      const galleryOk = pResult.status === 'fulfilled';

      if (weatherOk) {
        setWeatherData(wResult.value);
      } else {
        setWeatherData(null);
      }

      if (galleryOk) {
        const pixa = pResult.value;
        setGalleryHits(pixa.hits || []);
        setGalleryTotal(pixa.totalHits ?? 0);
        setGalleryPage(imagePage);
      } else {
        setGalleryHits([]);
        setGalleryTotal(0);
      }

      if (weatherOk || galleryOk) {
        setActiveCity(trimmed);
      } else {
        setActiveCity('');
      }

      if (!weatherOk && !galleryOk) {
        setNotice({
          kind: 'err',
          text: `Météo : ${reasonMessage(wResult.reason)} — Galerie : ${reasonMessage(pResult.reason)}`,
        });
      } else if (!weatherOk) {
        setNotice({
          kind: 'warn',
          text: `Météo : ${reasonMessage(wResult.reason)}`,
        });
      } else if (!galleryOk) {
        setNotice({
          kind: 'warn',
          text: `Galerie : ${reasonMessage(pResult.reason)}`,
        });
      }
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchSubmit = () => runCitySearch(cityInput, 1);

  const handleGalleryPage = useCallback(
    async (p) => {
      if (!activeCity.trim()) return;
      setGalleryLoading(true);
      setNotice(null);
      try {
        const pixa = await searchPhotos(activeCity, p);
        setGalleryHits(pixa.hits || []);
        setGalleryTotal(pixa.totalHits ?? 0);
        setGalleryPage(p);
      } catch (e) {
        setNotice({
          kind: 'err',
          text: reasonMessage(e),
        });
      } finally {
        setGalleryLoading(false);
      }
    },
    [activeCity]
  );

  const barLoading = searchLoading || galleryLoading;

  return (
    <div className="App">
      <Navbar page={page} setPage={setPage} />
      {configHint && (
        <div className="api-banner api-banner--warn" role="status">
          {configHint}
        </div>
      )}
      <div className="global-search-wrap">
        <SearchBar
          value={cityInput}
          onChange={setCityInput}
          onSearch={handleSearchSubmit}
          loading={barLoading}
          placeholder="Entrez une ville (météo + galerie)..."
        />
        {notice && (
          <div
            className={`api-banner api-banner--${notice.kind === 'err' ? 'err' : 'warn'}`}
            role="alert"
          >
            {notice.text}
          </div>
        )}
      </div>
      {page === 'gallery' ? (
        <GalleryPage
          images={galleryHits}
          total={galleryTotal}
          page={galleryPage}
          activeCity={activeCity}
          onPage={handleGalleryPage}
          loading={searchLoading || galleryLoading}
        />
      ) : (
        <WeatherPage
          data={weatherData}
          activeCity={activeCity}
          loading={searchLoading}
        />
      )}
    </div>
  );
}

export default App;
