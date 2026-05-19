import React from 'react';
import { MOROCCAN_CITIES } from '../../config';
import WeatherHero from './WeatherHero';
import ForecastCard from './ForecastCard';

const PROVIDER_LABELS = {
  openweather: 'OpenWeather',
  'open-meteo': 'Open-Meteo (gratuit)',
};

export default function WeatherPage({ data, activeCity, loading, onCitySelect }) {
  if (!activeCity && !loading && !data) {
    return (
      <div className="page">
        <p className="empty-hint">
          Sélectionnez une ville marocaine ci-dessous ou recherchez ci-dessus.
        </p>
        <CityChips onSelect={onCitySelect} />
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="page">
        <p className="empty-hint">Chargement de la météo…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <p className="empty-hint">Aucune donnée météo. Essayez une autre ville.</p>
        <CityChips onSelect={onCitySelect} active={activeCity} />
      </div>
    );
  }

  const provider = PROVIDER_LABELS[data.provider] ?? data.provider;

  return (
    <div className="page">
      {provider && (
        <p className="weather-provider" role="status">
          Source : {provider}
        </p>
      )}
      <WeatherHero city={data.city} current={data.list[0]} />
      <CityChips onSelect={onCitySelect} active={activeCity} />
      <h2 className="section-title" style={{ marginTop: '32px' }}>
        Prévisions
      </h2>
      <div className="fc-grid">
        {data.list.slice(1, 13).map((item, i) => (
          <ForecastCard key={`${item.dt_txt}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function CityChips({ onSelect, active }) {
  if (!onSelect) return null;
  return (
    <section className="chip-section" style={{ marginTop: '24px' }}>
      <h2 className="section-title">Villes du Maroc</h2>
      <div className="chips">
        {MOROCCAN_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            className={`chip${active === city ? ' chip--active' : ''}`}
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </section>
  );
}
