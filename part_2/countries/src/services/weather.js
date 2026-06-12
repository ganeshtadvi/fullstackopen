import axios from "axios"
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const baseUrl="https://api.openweathermap.org/data/2.5/weather"
console.log(import.meta.env.VITE_WEATHER_API_KEY);

const getWeatherInfo=(lat,lon)=>{
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const request= axios.get(url)
  return request.then(response=>response.data)
}

export default getWeatherInfo