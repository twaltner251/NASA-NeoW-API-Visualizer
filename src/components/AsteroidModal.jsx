export default function AsteroidModal(props) {
    const { selectedAsteroid } = props;

    if (!selectedAsteroid) {
        return (
            <>
                <div className='asteroid-modal'>
                    <h1>Asteroid Name: Earth?</h1>
                    <p>ID: 000000</p>
                    <p>Potentially Hazardous: Maybe?</p>
                    <p>Distance From Earth: 0km, 0mi</p>
                    <p>Estimated Avg Diameter: 12,742,000m, 41,804,461ft</p>
                    <p>Relative Velocity: 0km/hr 0mi/hr</p>
                </div>
            </>
        );
    }

    console.log(selectedAsteroid)

    const close_approach_data = selectedAsteroid.close_approach_data['0']
    const miss_distance_km = close_approach_data.miss_distance.kilometers;
    const miss_distance_miles = close_approach_data.miss_distance.miles;
    console.log('distance km:', miss_distance_km, 'distance miles', miss_distance_miles);

    const relative_velocity_km = close_approach_data.relative_velocity.kilometers_per_hour;
    const relative_velocity_miles = close_approach_data.relative_velocity.miles_per_hour;
    console.log('relative velocity km:', relative_velocity_km, 'relative velocity miles', relative_velocity_miles);

    const estimated_diameter = selectedAsteroid.estimated_diameter;
    const min_diameter_meters = estimated_diameter.meters.estimated_diameter_min;
    const max_diameter_meters = estimated_diameter.meters.estimated_diameter_max;
    const avg_diameter_meters = ((max_diameter_meters + min_diameter_meters) / 2);

    const min_diameter_feet = estimated_diameter.feet.estimated_diameter_min;
    const max_diameter_feet = estimated_diameter.feet.estimated_diameter_max;
    const avg_diameter_feet = ((max_diameter_feet + min_diameter_feet) / 2);

    console.log('diameter (meters): max:', max_diameter_meters, 'min:', min_diameter_meters, 'avg:', avg_diameter_meters);
    console.log('diameter (feet): max:', max_diameter_feet, 'min:', min_diameter_feet, 'avg:', avg_diameter_feet);

    const name = selectedAsteroid.name;
    const id = selectedAsteroid.id;
    const is_hazardous = selectedAsteroid.is_potentially_hazardous_asteroid;
    console.log(`Name: ${name}, ID: ${id}, Potentially Hazardous: ${is_hazardous}`);

    return (
        <>
            <div className='asteroid-modal'>
                <h1>Asteroid Name: {name}</h1>
                <p>ID: {id}</p>
                <p>Potentially Hazardous: {is_hazardous ? 'Yes' : 'No'}</p>
                <p>Distance From Earth: {miss_distance_km}km, {miss_distance_miles}mi</p>
                <p>Estimated Avg Diameter: {avg_diameter_meters}m, {avg_diameter_feet}ft</p>
                <p>Relative Velocity: {relative_velocity_km}km/hr {relative_velocity_miles}mi/hr</p>
            </div>
        </>
    );
}