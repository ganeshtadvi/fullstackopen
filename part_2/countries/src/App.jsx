import { useState, useEffect } from "react";
import getCountries from "./services/countries.js";
import Filter from "./components/Filter.jsx";
import FilterCountry from "./components/FilterCountry.jsx";
const App = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    getCountries().then((response) => {
      setCountryList(response);
      alert("data come")
    });
  }, []);

  const handleFIlterInput = (event) => {
    setFilterText(event.target.value);
    setSelectedCountry(null)
  };
  return (
    <div>
      <Filter value={filterText} onChange={handleFIlterInput} />
      <FilterCountry
        filterText={filterText}
        countryList={countryList}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </div>
  );
};

export default App;
