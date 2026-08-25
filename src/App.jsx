import { useEffect, useMemo, useState } from 'react';
import {fetchAPIData} from './api/NasaAPI.js';
import ThreeCanvas from './components/ThreeCanvas.jsx';
import './App.css';
import AsteroidModal from './components/AsteroidModal.jsx';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false) 

      try {
        const {data, date} = await fetchAPIData()
        
        // if data is null, aka error as we specified in ./api/NasaAPI.js, check if a near_earth_objects propery exists
        if (!data || !data.near_earth_objects) { 
          setError(true);
          setLoading(false); 
          return; 
          
        }

        // as long as we have data that means we successfully retrieved data from Nasa API and can assign it to our variable
        setData(data.near_earth_objects[date]) // go deeper by two layers into object to only retrieve data we need for app
        
        // assign date
        setDate(date)

      } catch(error) {
        console.log(error);
        setError(true)

      } finally {
        setLoading(false);
      
      }
    } 
    fetchData()

  }, []); // dependency array is empty so only runs once when page loads, if we put
  //        a variable(s) inside dependency array, then whenever the variable changes
  //        useEffect() is called

  return (
    <>
      {loading && ( // loading screen
        <div id='loading'>
          <i className="fa-solid fa-gear"></i>
        </div>
      )}

      {error && ( // error screen
        <div id='error'>
          Houston we got a error...
        </div>
      )}

      {data && ( // pass down data and callback function to canvas
        <ThreeCanvas data={data} setSelectedAsteroid={setSelectedAsteroid}/>
      )}

      {data && (
        <AsteroidModal selectedAsteroid={selectedAsteroid}/>
      )}

    </>
  )
}

export default App
