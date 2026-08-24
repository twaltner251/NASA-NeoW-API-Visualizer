import * as THREE from 'three';
import { STAR_SIZE, STAR_COUNT, STARS_INNER_BOUND, STARS_OUTER_BOUND } from './Constants.js';
import { sin } from 'three/src/nodes/math/MathNode.js';

// creates a spherical shell of stars around earth
export default class Star {
    constructor(scene) {
        this.scene = scene

        const starPositions = new Float32Array(STAR_COUNT * 3); // allocate array: (x, y, z) = 3 values per star

        /* 
        Option 3: Vector Star Generation
        Initialize unit vector in random direction and expand to be within range, no regeneration of 
        stars needed, no bias of population of stars like seen in Spherical generation by poles.
        */
        for (let i = 0; i < STAR_COUNT * 3; i += 3) {
            const randomPos = new THREE.Vector3().randomDirection();

            const length = Math.random() * (STARS_OUTER_BOUND - STARS_INNER_BOUND) + STARS_INNER_BOUND;

            randomPos.multiplyScalar(length);

            starPositions[i] = randomPos.x;
            starPositions[i + 1] = randomPos.y;
            starPositions[i + 2] = randomPos.z;

        }

        /* 
        Option 1: XYZ Coords Star Generation
        Initially was deemed less efficient as had to regenrate faulty stars, temporarily switched 
        to Sphere coordinates for star generation but discovered the pole bias, so returned to 
        utilizing XYZ coords.
        */
        /*
        const innerSq = STARS_INNER_BOUND * STARS_INNER_BOUND;
        const outerSq = STARS_OUTER_BOUND * STARS_OUTER_BOUND;

        for (let i = 0; i < STAR_COUNT * 3; i += 3) { // generate starCount # of star
            let x = Math.random() * 2 * outerLimit - outerLimit;
            let y = Math.random() * 2 * outerLimit - outerLimit;
            let z = Math.random() * 2 * outerLimit - outerLimit;
            let distance = (x*x) + (y*y) + (z*z)

            if (distance > innerSq && distance < outerSq) { // if valid star, add to star array
                starPositions[i] = x;
                starPositions[i + 1] = y;
                starPositions[i + 2] = z;
                

            } else { // rejection sampling loop SHEEEESHHHH
                i -= 3

            }
        } */

        /* 
        Option 2: Spherical Coords Star Generation
        Deemed more efficient as can initialize Star within certain range of distance from origin 
        so don't waste compute on regeneration faulty stars, HOWEVER, due to the nature of spherical
        coordinates there is a bias in the distribution of the stars around the z-axis, so we 
        sacrifice slight performance loss for a better end result and evenly distributed stars by 
        using XYZ coords to populate them 
        */

        /* 
        p = rho straight-line distance from origin (basiclaly r)
        theta = angle on flat ground plane (x & y)
        phi = angle on z axis (z)
        x = rho sin(phi) cos(theta)
        y = rho sin(phi) sin(theta)
        z = rho cos(phi)
        1deg = (1deg * pi/180deg) rad
        360deg = (360deg * pi/180deg) rad = (2pi) rad
        */

        /*
        for (let i = 0; i < STAR_COUNT * 3; i += 3) {
            const p = Math.random() * (STARS_OUTER_BOUND - STARS_INNER_BOUND) + STARS_INNER_BOUND;
            const theta = Math.random() * (2 * Math.PI);
            const phi = Math.random() * (2 * Math.PI);

            const x = p * Math.sin(phi) * Math.cos(theta);
            const y = p * Math.sin(phi) * Math.sin(theta);
            const z = p * Math.cos(phi);

            starPositions[i] = x;
            starPositions[i + 1] = y;
            starPositions[i + 2] = z;
    
        } */

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: STAR_SIZE,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending, // stars glow when overlapping
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);

        this.scene.add(starField)

    }
}

