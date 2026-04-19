import React from 'react';

export default function ForecastCard({ item }) {
  const date = new Date(item.dt_txt).toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit' });
  return (
    <div className="fc-card">
      <div style={{color:'var(--muted)', fontSize:'12px'}}>{date}</div>
      <div style={{fontSize:'24px', fontWeight:'800', color:'var(--accent2)'}}>{Math.round(item.main.temp)}°</div>
      <div style={{fontSize:'12px'}}>{item.weather[0].description}</div>
    </div>
  );
}