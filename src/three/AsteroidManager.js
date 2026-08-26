import * as THREE from 'three';
import asteroidTextureImage from '../assets/asteroid.png';
import { ASTEROID_VISUALIZING_SCALER, KM_SCALING_FACTOR, ASTEROID_HALO_RADIUS } from './Constants.js';

// upon update() takes asteroid api data, transfers into coords and plots them, aka asteroid radius, coordinates, velocity, etc
export default class AsteroidManager {
    constructor(renderer, scene, camera, textureLoader) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.textureLoader = textureLoader

    }

    update(data) {
        // arbritrary constant to scale up asteroid sizes to make them visable and clickable to users
        console.log(data)
        Object.entries(data).forEach(([key, value]) => {            
            // max diameter - min diameter = avg diameter (km)
            // avg diameter * LUNAR/KM = avg diameter (LUNAR)
            // avg diameter / 2 = avg radius
            // avg radius * arbritrary_visual_scaler => resize asteroids arbritrarily so are visible  
            const radius = (
                value.estimated_diameter.kilometers.estimated_diameter_max - value.estimated_diameter.kilometers.estimated_diameter_min
                ) * KM_SCALING_FACTOR / 2 * ASTEROID_VISUALIZING_SCALER;
            const segments = 256;
    
            // load earth texture
            const asteroidTexture = this.textureLoader.load(asteroidTextureImage);
    
            // Asteroid                                      (radius, widthSegments, heightSegments)
            const asteroidGeometry = new THREE.SphereGeometry(radius, segments,      segments)
            const asteroidMaterial = new THREE.MeshStandardMaterial({
                map: asteroidTexture, 
                roughness: 1, 
                color: 0xFFFFFF, 
                wireframe: false,
                emissive: 0x444444, // Adds a faint base glow
                emissiveIntensity: 0.3
            });
            // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            const distance = value.close_approach_data["0"].miss_distance.kilometers * KM_SCALING_FACTOR;

            // calculate a random position based off of distance since Nasa JPL API is down...
            const randomPos = new THREE.Vector3().randomDirection(); // generate unit vector in random direction
            
            randomPos.multiplyScalar(distance)

            asteroid.position.copy(randomPos)
            
            // assign a random axes for rotation
            const rotationAxis = new THREE.Vector3().randomDirection();

            // add an animation to spin the asteroid
            asteroid.onBeforeRender = () => {
                const rotationSpeed = Math.random() * 0.3; 
                asteroid.rotateOnAxis(rotationAxis, rotationSpeed);

            };

            this.scene.add(asteroid);

            // add transparent hitbox to asteroid
            const hitBoxGeometry = new THREE.SphereGeometry(Math.max(ASTEROID_HALO_RADIUS, radius * 1.5), segments, segments);
            const hitBoxMaterial = new THREE.MeshBasicMaterial({ visible: false });
            const hitBoxMesh = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
            hitBoxMesh.position.copy(randomPos)
            
            // save data into user_data to be passed up to scene manager to have data of obj stored 
            // in asteroid so we know which asteroid we clicked and can display info on it
            hitBoxMesh.userData['apiData'] = data[key];
            
            this.scene.add(hitBoxMesh)
            
            // create a ring effect around the asteroid
            const haloGeometry = new THREE.RingGeometry(Math.max(ASTEROID_HALO_RADIUS * 0.8, radius * 1.5 * 0.8), Math.max(ASTEROID_HALO_RADIUS, radius * 1.5), 64);
            const haloMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFE0,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide, 
            });
            const halo = new THREE.Mesh(haloGeometry, haloMaterial);

            halo.onBeforeRender = (renderer, scene, camera) => {
                // The camera parameter is automatically passed by Three.js every frame
                halo.lookAt(camera.position);

            };

            halo.position.copy(randomPos)

            this.scene.add(halo);
            
            console.log(radius)

        });
    }
}