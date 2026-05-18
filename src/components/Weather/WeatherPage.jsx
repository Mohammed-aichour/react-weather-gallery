import React from 'react';
import WeatherHero from './WeatherHero';
import ForecastCard from './ForecastCard';

export default function WeatherPage({ data, activeCity, loading }) {
  if (!activeCity && !loading) {
    return (
      <div className="page">
        <p className="empty-hint">
          Sélectionnez une ville marocaine sur l&apos;accueil ou recherchez ci-dessus pour la météo
          (OpenWeather).
        </p>
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
        <p className="empty-hint">Aucune donnée météo. Lancez une nouvelle recherche.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <WeatherHero city={data.city} current={data.list[0]} />
      <div className="fc-grid">
        {data.list.slice(1, 13).map((item, i) => (
          <ForecastCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
