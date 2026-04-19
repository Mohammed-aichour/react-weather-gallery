import React from 'react';

export default function WeatherHero({ city, current }) {
  return (
    <div className="weather-hero">
      <h1>{city.name}, {city.country}</h1>
      <div className="w-temp">{Math.round(current.main.temp)}°C</div>
      <p style={{textTransform:'capitalize'}}>{current.weather[0].description}</p>
      <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
        <span>Humidité: {current.main.humidity}%</span>
        <span>Vent: {current.wind.speed} m/s</span>
      </div>
    </div>
  );
}