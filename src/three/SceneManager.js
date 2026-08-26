import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Earth from './Earth.js';
import AsteroidManager from './AsteroidManager.js';
import Stars from './Stars.js';
import { EARTH_RADIUS, EARTH_VISUALIZING_SCALER, STARS_INNER_BOUND, STARS_OUTER_BOUND } from './Constants.js';

// handles camera, lighting, and inserting all of our ThreeJS objects onto the canvas
export default class SceneManager {
    constructor(canvas, setSelectedAsteroid) {
        //    create scene
        this.scene = new THREE.Scene();

        //    perspective camera                    FOV, Aspect ratio,                         near, far (elements stop rendngering when outisde of near/far range)
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, STARS_OUTER_BOUND * 2 );
        this.camera.position.x = EARTH_RADIUS * EARTH_VISUALIZING_SCALER * 10; // number is x value

        //    instantiate renderer
        this.renderer = new THREE.WebGLRenderer( {canvas: canvas} );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // smooth deceleration
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = STARS_INNER_BOUND / 3;
        this.controls.minDistance = EARTH_RADIUS;

        // ambient lighting
        const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add(ambLight);

        // directional lighting
        const sunLight = new THREE.DirectionalLight(0xffffff, 2); // main sun directional light
        sunLight.position.set(0, 0, STARS_OUTER_BOUND);
        this.scene.add(sunLight);

        // init textureloader
        const textureLoader = new THREE.TextureLoader();
        
        // init earth
        this.earth = new Earth(this.scene, textureLoader);     

        // init asteroids
        this.asteroids = new AsteroidManager(this.renderer, this.scene, this.camera, textureLoader);

        // init stars
        this.stars = new Stars(this.scene);

        // assign the initial frame to this.FrameID
        this.FrameID = requestAnimationFrame((time) => this.update(time));
        
        // set new camera orbit target on mouse click
        this.renderer.domElement.addEventListener('click', (event) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            
            const intersects = raycaster.intersectObjects(this.scene.children, true);

            // if we clicked on a object
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                
                // update camera position to be cenetered at object
                const position = clickedObject.position;
                this.controls.target.set(position.x, position.y, position.z);
                this.controls.update();

                // pass up object's apiData via react callback func
                const selectedAsteroidData = intersects[0].object.userData.apiData;
                setSelectedAsteroid(selectedAsteroidData);

            }
        });
    }

    updateAsteroids(props) {
        this.asteroids.update(props);

    }

    update(time) {
        // update controls
        this.controls.update();

        // update rendering
        this.renderer.render(this.scene, this.camera);

        // update earth
        this.earth.update(time);

        // track current frame and request new fram to animat
        this.FrameID = requestAnimationFrame((time) => this.update(time))

    }

    dispose() {
        console.log('disposing')
        // stop the animation loop
        cancelAnimationFrame(this.FrameID);
    
        // dispose renderer and controls
        this.renderer.dispose();
        this.controls.dispose();
    
        // traverse and properly dispose of geometries, materials, and textures
        this.scene.traverse((object) => {
            if (!object.isMesh) return;
    
            // dispose Geometry
            if (object.geometry) {
                object.geometry.dispose();

            }
    
            // dispose Material(s)
            if (object.material) {
                // materials can be an array or a single object
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                
                materials.forEach((material) => {
                    material.dispose();
                    
                    // dispose of any textures attached to the material (maps, normalMaps, etc.)
                    for (const key in material) {
                        if (material[key] && material[key].isTexture) {
                            material[key].dispose();
                        }
                    }
                });
            }
        });
    
        // safely remove all children from the scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);

        }
    }
}
