import { useRef, useEffect } from "react";
import SceneManager from "../three/SceneManager.js";

export default function ThreeCanvas(props) { 
    const canvasRef = useRef(null);
    const sceneManagerRef = useRef(null);
    const {data, setSelectedAsteroid} = props;

    useEffect(() => {
        // ensure HTML canvas is fully rendered before passing to threejs AND ensure we don't generate duplicate rendering engines (unneccesary processing power)
        if (!canvasRef.current) return;  
        
        sceneManagerRef.current = new SceneManager(canvasRef.current, setSelectedAsteroid);

        if (sceneManagerRef.current && data) {
            sceneManagerRef.current.updateAsteroids(data);
        
        }

        return() => { // call cleanup function
            if (sceneManagerRef.current) {
                sceneManagerRef.current.dispose();
                sceneManagerRef.current = null;

            }
        };
    }, [setSelectedAsteroid]);    
    
    return (
        <>
            <canvas ref={canvasRef}/>
        </>
    )
}