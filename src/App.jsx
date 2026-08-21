import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthTextureImage from './assets/earth.png';
import cloudTextureImage from './assets/clouds.png';
import './App.css'

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    //    create scene
    const scene = new THREE.Scene();
    
    //    perspective camera                    FOV, Aspect ratio,                          near, far (elements stop rendngering when outisde of near/far range)
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    //    renders our ojects into scene
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // add renderer to DOM
    currentMount.appendChild(renderer.domElement);

    // ambient lighting
    const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
    scene.add(ambLight)

    // directional lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2); // Main sun directional light
    sunLight.position.set(10, 5, 10)
    scene.add(sunLight);

    // init textureloader
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(earthTextureImage)

    // constants to define geometry of earth and clouds easily
    const radius = 1;
    const segments = 256;

    // Earth                                       (radius, widthSegments, heightSegments)
    const earthGeometry = new THREE.SphereGeometry(radius,  segments,      segments)
    const earthMaterial = new THREE.MeshStandardMaterial({map: earthTexture, roughness: 1, color: 0xFFFFFF, wireframe: false});
    // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

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
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    //create a blue LineBasicMaterial
    const linematerial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    
    // spiralll
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.2 * Math.PI;
      const x = Math.sin(angle) * i * 0.5;
      const y = Math.cos(angle) * i * 0.5;
      const z = i * 0.2;
      points.push(new THREE.Vector3(x, y, z));
    }
    
    // create line geometry from points and line object from line geometry
    const linegeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( linegeometry, linematerial );

    // add line to scene
    scene.add(line)

    camera.position.z = 20; // number is zoom

    // orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enables smooth deceleration/inertia
    controls.dampingFactor = 0.05;

    // render the scene with an animation loop, animates object everytime screen is refreshed, usually 60hz
    function animate(time) {
      // animate rotation
      controls.update()
      earth.rotation.y = time / 6000; // bigger number slower rotation
      clouds.rotation.y = time / 4100; // bigger number slower rotation
      
      // update rendering
      renderer.render(scene, camera);

    }
    renderer.setAnimationLoop(animate); // call animation function

    // 5. Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      controls.dispose();
      
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    
    <div ref={mountRef}/>
    
  )
}

export default App
