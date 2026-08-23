import { useRef, useEffect } from "react";
import DataSelector from "./DataSelector.jsx";
import AsteroidModal from "./AsteroidModal.jsx";
import SceneManager from "../three/SceneManager.js";
import AsteroidManager from "../three/AsteroidManager.js";

export default function ThreeCanvas(props) { 
    const canvasRef = useRef(null);
    const sceneManagerRef = useRef(null);
    const {data} = props;

    useEffect(() => {
        // ensure HTML canvas is fully rendered before passing to threejs AND ensure we don't generate duplicate rendering engines (unneccesary processing power)
        if (canvasRef.current && !sceneManagerRef.current) { 
            sceneManagerRef.current = new SceneManager(canvasRef.current);

        }
    }, []);

    useEffect(() => {
        if (sceneManagerRef.current && data) {
            sceneManagerRef.current.updateAsteroids(data);
        
        }
    }, [data])
    
    
    return (
        <>
            <canvas ref={canvasRef}/>
        </>
    )
}