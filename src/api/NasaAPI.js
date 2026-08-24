// handles fetching data from api as well as caching today's data

export const fetchAPIData = async () => {
    const NASAKEY = import.meta.env.VITE_NASA_API_KEY; 

    const date = new Date().toISOString().split('T')[0];

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${NASAKEY}`;
    const localKey = `NASA-${date}`; 

    if (localStorage.getItem(localKey)) { 
        const apiData = JSON.parse(localStorage.getItem(localKey));
        console.log("fetched today's data from cache");
        
        return {data: apiData, date: date};
    
    } else { 
        localStorage.clear() 

        try { 
            const response = await fetch(url);
            const apiData = await response.json();
            localStorage.setItem(localKey, JSON.stringify(apiData));
            console.log("fetched today's data from API");
            
            return {data: apiData, date: date};
        
        } catch(error) { 
            console.log(error.message);
            return null; // if fail

        }  
    } 
}