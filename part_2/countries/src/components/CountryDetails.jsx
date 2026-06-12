
import Weather from "./weather.jsx";
const CountryDetails = ({ name, capital, area, lang, imgUrl,latlang }) => {
    const languages = Object.values(lang);

    return (
      <div>
        <h1>{name}</h1>
  
        <p>Capital: {capital}</p>
        <p>Area: {area}</p>
  
        <h2>Languages</h2>
        <ul>
          {languages.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
       
       <img src={imgUrl.png} alt="Flag img"/>
       <h2>Weather in {capital}</h2>
       <Weather
  lat={latlang[0]}
  lon={latlang[1]}
/>
      </div>
    );
  };
  
  export default CountryDetails;