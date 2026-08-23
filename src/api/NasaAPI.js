// handles fetching data from api as well as caching today's data

export const fetchAPIData = async () => {
    const NASAKEY = import.meta.env.VITE_NASA_API_KEY; 
    const today = new Date().toISOString().split('T')[0];
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASAKEY}`;
    const localKey = `NASA-${today}`; 

    if (localStorage.getItem(localKey)) { 
        const apiData = JSON.parse(localStorage.getItem(localKey));
        console.log((apiData));
        console.log("fetched today's data from cache");
        return apiData;
    
    } else { 
        localStorage.clear() 

        try { 
            const response = await fetch(url);
            const apiData = await response.json();
            localStorage.setItem(localKey, JSON.stringify(apiData));
            console.log("fetched today's data from API");
            return apiData;
        
        } catch(error) { 
            console.log(error.message);
            return null; // if fail

        }  
    } 
}