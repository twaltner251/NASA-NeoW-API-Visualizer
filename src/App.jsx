import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './App.css'

function App() {
  //    create scene
  const scene = new THREE.Scene();
  
  //    perspective camera                    FOV, Aspect ratio,                          near, far (elements stop rendngering when outisde of near/far range)
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  //    renders our ojects into scene
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // add renderer to DOM
  document.body.append(renderer.domElement);

  const geometry = new THREE.BoxGeometry(5, 3, 2);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  // create mesh, object that takes in a geometry and material and can be inserted into our scene and moved around
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  //create a blue LineBasicMaterial
  const linematerial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  const points = [];
  points.push( new THREE.Vector3( - 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 10, 0 ) );
  points.push( new THREE.Vector3( 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, -10, 0 ) );
  points.push( new THREE.Vector3( -10, 0, 0 ) );

  const linegeometry = new THREE.BufferGeometry().setFromPoints( points );

  const line = new THREE.Line( linegeometry, linematerial );

  scene.add(line)


  camera.position.z = 20; // number is zoom

  // render the scene with an animation loop, animates object everytime screen is refreshed, usually 60hz
  function animate(time) {
    // animate rotation
    cube.rotation.x = time / 2000; // bigger number slower rotation
    cube.rotation.y = time / 2000;
    
    // update rendering
    renderer.render(scene, camera);

  }
  renderer.setAnimationLoop(animate); // call animation function

  return (
    <>

    </>
  )
}

export default App
