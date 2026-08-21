import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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

    const sphere_geometry = new THREE.SphereGeometry(5, 10, 10)
    const material = new THREE.MeshBasicMaterial({color: 0x87CEFA, wireframe: true});
    // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
    const sphere = new THREE.Mesh(sphere_geometry, material);
    scene.add(sphere);

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
      sphere.rotation.x = time / 2000; // bigger number slower rotation
      sphere.rotation.y = time / 2000;
      
      // update rendering
      renderer.render(scene, camera);

    }
    renderer.setAnimationLoop(animate); // call animation function

    // 5. Cleanup
    return () => {
      renderer.setAnimationLoop(null);
      controls.dispose(); // Removes event listeners attached to the canvas
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    
    <div ref={mountRef}/>
    
  )
}

export default App
