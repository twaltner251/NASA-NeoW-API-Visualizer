// upon update() takes asteroid api data, transfers into coords and plots them, aka asteroid radius, coordinates, velocity, etc

export default class AsteroidManager {
    constructor(scene, textureLoader) {
        this.scene = scene;
        this.asteroids = []
        this.textureLoader = textureLoader

    }

    update(data) {
        console.log("successfully fetched data in asteroid manager update method:", data)
        
    }

}