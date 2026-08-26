import * as THREE from 'three';
import earthTextureImage from '../assets/earth.png';
import cloudTextureImage from '../assets/clouds.png';
import { EARTH_TILT, EARTH_VISUALIZING_SCALER, EARTH_RADIUS } from './Constants.js';

// creates earth class with clouds and white line for orbiting axis
export default class Earth {
    constructor(scene, textureLoader) {
        this.scene = scene;
        
        // create group to tilt rotation axis of Earth
        const group = new THREE.Group();
        const tiltAxis = new THREE.Vector3(-1, 0, 0);
        group.rotateOnAxis(tiltAxis, THREE.MathUtils.degToRad(EARTH_TILT));

        // constants to define geometry of earth and clouds easily
        const radius = EARTH_RADIUS * EARTH_VISUALIZING_SCALER;
        const segments = 256;

        // load earth texture
        const earthTexture = textureLoader.load(earthTextureImage);

        // Earth                                       (radius, widthSegments, heightSegments)
        const earthGeometry = new THREE.SphereGeometry(radius,  segments,      segments)
        const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture, roughness: 1, color: 0xFFFFFF, wireframe: false});
        // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        group.add(this.earth)
        
        // load cloud texture
        const cloudTexture = textureLoader.load(cloudTextureImage)

        // Clouds                                     (radius,        widthSegments, heightSegments)
        const cloudGeometry = new THREE.SphereGeometry(radius * 1.01, segments,      segments)
        // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
        const cloudMaterial = new THREE.MeshStandardMaterial({
            alphaMap: cloudTexture, // use alphaMap to be transparent based on brightness
            transparent: true,
            depthWrite: false,
            // blending: THREE.AdditiveBlending // makes clouds look bright and realistic
        });
        this.clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        group.add(this.clouds);

        // Axis
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff})
        const points = []; //         ( x,      y,       z )
        points.push( new THREE.Vector3( 0, 1.5 * radius, 0 ) ); // North axis end
        points.push( new THREE.Vector3( 0, -1.5 * radius, 0 ) ); // South axis end
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(lineGeometry, lineMaterial)
        group.add(line)

        // add entire group to scene
        this.scene.add(group)

    }

    update(time) {
        this.earth.rotation.y = time / 6000; // bigger number slower rotation
        this.clouds.rotation.y = time / 4100; // bigger number slower rotation

    }
}

