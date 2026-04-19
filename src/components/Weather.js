import axios from 'axios';
import { useState } from 'react';

const APPID = 'VOTRE_APPID_OPENWEATHER';

function Weather() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);

  const getWeather = async () => {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APPID}&units=metric&lang=fr`;
    const res = await axios.get(url);
    setData(res.data);
  };

  return (
    <div>
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="Nom de la ville" />
      <button onClick={getWeather}>Rechercher</button>
      {data && (
        <div>
          <h2>{data.city.name}</h2>
          <p>Temp : {data.list[0].main.temp} °C</p>
          <p>{data.list[0].weather[0].description}</p>
        </div>
      )}
    </div>
  );
}