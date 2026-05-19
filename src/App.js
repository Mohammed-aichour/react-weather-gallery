import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/Home/HomePage';
import GalleryPage from './components/Gallery/GalleryPage';
import WeatherPage from './components/Weather/WeatherPage';
import CulturePage from './components/Culture/CulturePage';
import { SearchBar } from './components/Common';
import { getForecastByCity, searchPhotos, getMoroccoInfo } from './api';
import { isPixabayConfigured } from './config';

function reasonMessage(reason) {
  if (reason instanceof Error) return reason.message;
  return String(reason);
}

function App() {
  const [page, setPage] = useState('home');
  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [galleryHits, setGalleryHits] = useState([]);
  const [galleryTotal, setGalleryTotal] = useState(0);
  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [moroccoCountry, setMoroccoCountry] = useState(null);
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(null);
  const weatherBootstrapped = useRef(false);

  const configHint = useMemo(() => {
    const miss = [];
    if (!isPixabayConfigured()) miss.push('REACT_APP_PIXABAY_KEY (Pixabay)');
    if (miss.length === 0) return null;
    return `Clé Pixabay manquante pour plus de photos : ajoutez REACT_APP_PIXABAY_KEY dans .env.local. La météo fonctionne sans clé (Open-Meteo).`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCountryLoading(true);
      try {
        const data = await getMoroccoInfo();
        if (!cancelled) setMoroccoCountry(data);
      } catch (e) {
        if (!cancelled) {
          setCountryError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) setCountryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const runWeatherSearch = useCallback(async (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setSearchLoading(true);
    setNotice(null);
    setCityInput(trimmed);
    setActiveCity(trimmed);

    try {
      const data = await getForecastByCity(trimmed);
      setWeatherData(data);
    } catch (e) {
      setWeatherData(null);
      setNotice({ kind: 'err', text: reasonMessage(e) });
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const runGallerySearch = useCallback(async (q, imagePage = 1) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setGalleryLoading(true);
    setNotice(null);
    setCityInput(trimmed);
    setActiveCity(trimmed);

    try {
      const pixa = await searchPhotos(trimmed, imagePage);
      setGalleryHits(pixa.hits || []);
      setGalleryTotal(pixa.totalHits ?? 0);
      setGalleryPage(imagePage);
    } catch (e) {
      setGalleryHits([]);
      setGalleryTotal(0);
      setNotice({ kind: 'err', text: reasonMessage(e) });
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  const runCitySearch = useCallback(
    async (q, imagePage = 1, targetPage = null) => {
      const trimmed = q.trim();
      if (!trimmed) return;

      if (targetPage) setPage(targetPage);

      if (targetPage === 'weather') {
        await runWeatherSearch(trimmed);
        return;
      }

      if (targetPage === 'gallery') {
        await runGallerySearch(trimmed, imagePage);
        return;
      }

      setSearchLoading(true);
      setGalleryLoading(true);
      setNotice(null);
      setCityInput(trimmed);

      try {
        const [wResult, pResult] = await Promise.allSettled([
          getForecastByCity(trimmed),
          searchPhotos(trimmed, imagePage),
        ]);

        const weatherOk = wResult.status === 'fulfilled';
        const galleryOk = pResult.status === 'fulfilled';

        if (weatherOk) setWeatherData(wResult.value);
        else setWeatherData(null);

        if (galleryOk) {
          const pixa = pResult.value;
          setGalleryHits(pixa.hits || []);
          setGalleryTotal(pixa.totalHits ?? 0);
          setGalleryPage(imagePage);
        } else {
          setGalleryHits([]);
          setGalleryTotal(0);
        }

        if (weatherOk || galleryOk) setActiveCity(trimmed);
        else setActiveCity('');

        if (!weatherOk && !galleryOk) {
          setNotice({
            kind: 'err',
            text: `Météo : ${reasonMessage(wResult.reason)} — Galerie : ${reasonMessage(pResult.reason)}`,
          });
        } else if (!weatherOk) {
          setNotice({ kind: 'warn', text: `Météo : ${reasonMessage(wResult.reason)}` });
        } else if (!galleryOk) {
          setNotice({ kind: 'warn', text: `Galerie : ${reasonMessage(pResult.reason)}` });
        }
      } finally {
        setSearchLoading(false);
        setGalleryLoading(false);
      }
    },
    [runWeatherSearch, runGallerySearch]
  );

  useEffect(() => {
    if (page !== 'weather' || weatherBootstrapped.current) return;
    weatherBootstrapped.current = true;
    if (!weatherData && !activeCity) {
      runWeatherSearch('Marrakech');
    }
  }, [page, weatherData, activeCity, runWeatherSearch]);

  const handleSearchSubmit = useCallback(() => {
    if (page === 'weather') {
      runWeatherSearch(cityInput);
    } else if (page === 'gallery') {
      runGallerySearch(cityInput, 1);
    } else {
      runCitySearch(cityInput, 1, 'gallery');
    }
  }, [page, cityInput, runWeatherSearch, runGallerySearch, runCitySearch]);

  const handleGalleryPage = useCallback(
    async (p) => {
      if (!activeCity.trim()) return;
      await runGallerySearch(activeCity, p);
    },
    [activeCity, runGallerySearch]
  );

  const exploreCity = useCallback(
    (city) => {
      setPage('weather');
      runWeatherSearch(city);
    },
    [runWeatherSearch]
  );

  const exploreTheme = useCallback(
    (theme) => {
      setPage('gallery');
      runGallerySearch(theme, 1);
    },
    [runGallerySearch]
  );

  const barLoading =
    page === 'weather' ? searchLoading : searchLoading || galleryLoading;
  const showGlobalSearch = page === 'gallery' || page === 'weather';

  return (
    <div className="App">
      <Navbar page={page} setPage={setPage} />
      {configHint && (
        <div className="api-banner api-banner--warn layout-banner" role="status">
          {configHint}
        </div>
      )}
      {showGlobalSearch && (
        <div className="global-search-wrap">
          <SearchBar
            value={cityInput}
            onChange={setCityInput}
            onSearch={handleSearchSubmit}
            loading={barLoading}
            placeholder={
              page === 'weather'
                ? 'Ville marocaine (ex. Marrakech, Fès, Rabat)…'
                : 'Thème ou ville (ex. médina, Sahara)…'
            }
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
      )}
      {page === 'home' && (
        <HomePage
          country={moroccoCountry}
          countryLoading={countryLoading}
          countryError={countryError}
          onExploreCity={exploreCity}
          onExploreTheme={exploreTheme}
          onGoGallery={() => setPage('gallery')}
          onGoCulture={() => setPage('culture')}
        />
      )}
      {page === 'gallery' && (
        <GalleryPage
          images={galleryHits}
          total={galleryTotal}
          page={galleryPage}
          activeCity={activeCity}
          onPage={handleGalleryPage}
          loading={searchLoading || galleryLoading}
        />
      )}
      {page === 'weather' && (
        <WeatherPage
          data={weatherData}
          activeCity={activeCity}
          loading={searchLoading}
          onCitySelect={runWeatherSearch}
        />
      )}
      {page === 'culture' && <CulturePage />}
    </div>
  );
}

export default App;
