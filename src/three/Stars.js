import * as THREE from 'three';

// creates a spherical shell of stars around earth
export default class Star {
    constructor(scene) {
        this.scene = scene

        const starCount = 2000;                                 // allocate array
        const starPositions = new Float32Array(starCount * 3); // (x, y, z) = 3 values per star

        const innerLimit = 500;
        const outerLimit = 800;

        const innerSq = innerLimit * innerLimit;
        const outerSq = outerLimit * outerLimit;

        // initialize stars about spherical shell around earth
        for (let i = 0; i < starCount * 3; i += 3) { // generate starCount # of star
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
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending, // stars glow when overlapping
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);

        this.scene.add(starField)

    }
}

