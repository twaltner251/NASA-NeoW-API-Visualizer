furture feature add a X button to asteroid modal to stop displaying and have info icon to redisplay

// change control max distance back from infinity
// distance is to scale however sizes have been exaggerated. Earth is scaled 250times up, the halo around asteroids is the same size as the earth, however the asteroids inside are scaled up 50,000times. so another 200times additional from the Earth's 250x. really puts into perspective just how huge interplanetary objects are

# Simple Nasa NeoW API App:
added tilt of earth y-axis
project uses lunar units for distance and sizing of objects but uses a constant
constants.js holds constants for ease of access const artificialVisualizingScaler = 500;
randomized positions for asteroids via polar coords switched stars population to polar coords

// Deemed more efficient as can initialize Star within certain range of distance from origin 
        // so don't waste compute on regeneration faulty stars, HOWEVER, due to the nature of spherical
        // coordinates there is a bias in the distribution of the stars around the z-axis, so we 
        // sacrifice slight performance loss for a better end result and evenly distributed stars by 
        // using XYZ coords to populate them

 ideally use NASA's ephemeris generator tool but JPL is down so can't will update later had to do randomized coords due to JPL websites being down for some reason?

todo:
asteroid coords?
remove asteroid duplicates
star instantiation via vectors
moon?
make sure api key isnt exposed before publishing to netlify and etc...
asteroid rotations
// todo popul menu for asteroids as well as scroll lunar distance and camera x y z position labeled in bottom corner or something in cool font

# Sources:
## NASA NeoW's API:
https://data.nasa.gov/dataset/asteroids-neows-api

## Equirectangular Projected Earth texture from NASA:
https://svs.gsfc.nasa.gov/3615/

## Equirectangular Projected Clouds texture from SolarSystemScope.com:
https://www.solarsystemscope.com/textures/

## Equirectangular Projected Asteroid texture from Wikipedia:
https://commons.wikimedia.org/wiki/File:Generic_Celestia_asteroid_texture.jpg

# Future Features?
* specify dates for lookup 
* today button if just want to see asteroids of today