import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Earth from './Earth';
import AsteroidManager from './AsteroidManager.js'
import Stars from './Stars.js'

export default class SceneManager {
    constructor(canvas) {
        //    create scene
        this.scene = new THREE.Scene();

        //    perspective camera                    FOV, Aspect ratio,                    near, far (elements stop rendngering when outisde of near/far range)
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 200; // number is z value

        //    instantiate renderer
        this.renderer = new THREE.WebGLRenderer( {canvas: canvas} );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // smooth deceleration
        this.controls.dampingFactor = 0.05;

        // ambient lighting
        const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
        this.scene.add(ambLight);

        // directional lighting
        const sunLight = new THREE.DirectionalLight(0xffffff, 2); // main sun directional light
        sunLight.position.set(10, 5, 10);
        this.scene.add(sunLight);

        // init textureloader
        const textureLoader = new THREE.TextureLoader();
        
        // init earth
        this.earth = new Earth(this.scene, textureLoader);     

        // init asteroids
        this.asteroids = new AsteroidManager(this.scene, textureLoader);

        // init stars
        this.stars = new Stars(this.scene);

        requestAnimationFrame((time) => this.update(time))
    
    }

    updateAsteroids(data) {
        this.asteroids.update(data);

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
