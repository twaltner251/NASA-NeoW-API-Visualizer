import { useEffect, useState } from 'react'
import {fetchAPIData} from './api/NasaAPI.js'
import ThreeCanvas from './components/ThreeCanvas.jsx'
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false)

      try {
        const data = await fetchAPIData()
        
        if (!data) { // if data is null, aka error as we specified in ./api/NasaAPI.js
          setError(true)

        }

        // as long as we have data that means we successfully retrieved data from Nasa API and can assign it to our variable
        setData(data)

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
        <div>
          <i className="fa-solid fa-gear"></i>
        </div>
      )}

      {error && ( // error screen
        <div id='error'>
          Houston we got a error...
        </div>
      )}

      {data && ( // pass down data to canvas
        <ThreeCanvas data={data}/>
      )}

    </>
    
    

    
  )
}

export default App
