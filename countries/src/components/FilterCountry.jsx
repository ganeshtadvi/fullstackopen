import CountryDetails from "./CountryDetails.jsx";

const FilterCountry = ({ filterText, countryList,selectedCountry,setSelectedCountry }) => {

    if (filterText === "") {
        return null;
      }

  const filteredCountries = countryList.filter((country) =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase()),
  );

  if(selectedCountry){
    return  <CountryDetails
    name={selectedCountry.name.common}
    capital={selectedCountry.capital}
    area={selectedCountry.area}
    lang={selectedCountry.languages}
    imgUrl={selectedCountry.flags}
    latlang={selectedCountry.latlng}
  />  
  }

  if (filteredCountries.length === 1) {
    return (
      <CountryDetails
        name={filteredCountries[0].name.common}
        capital={filteredCountries[0].capital}
        area={filteredCountries[0].area}
        lang={filteredCountries[0].languages}
        imgUrl={filteredCountries[0].flags}
        latlang={selectedCountry.latlng}
      />
    );
  }

    if(filteredCountries.length>1 && filteredCountries.length<=10){
        return filteredCountries.map(country =>
            <div key={country.cca3}>
              <p>
                {country.name.common}
                <button onClick={() => setSelectedCountry(country)}>show</button>
              </p>
            </div>
          )
}
    if(filteredCountries.length>10){
    return <p>Too many countries, please specify filter query</p>
    }
};

export default FilterCountry
