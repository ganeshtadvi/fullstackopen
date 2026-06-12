import { useEffect, useState } from "react";
import getWeatherInfo from "../services/weather";

const Weather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeatherInfo(lat, lon)
      .then(data => setWeather(data));
  }, [lat, lon]);

  if (!weather) {
    return <p>Loading weather...</p>;
  }

  return (
    <div>
      <p>Temperature {weather.main.temp} °C</p>

      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="weather icon"
      />

      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;