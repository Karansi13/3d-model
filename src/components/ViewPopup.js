import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Import OrbitControls

export default function ViewerPopup({ onClose }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Setup THREE.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(500, 500); // Larger viewer size for better experience
    renderer.setClearColor(0xffffff); // Set white canvas background
  
    // Append the canvas only if it doesn't already exist
    if (viewerRef.current && viewerRef.current.children.length === 0) {
      viewerRef.current.appendChild(renderer.domElement);
    }
  
    // Add lighting
    const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    scene.add(light);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
  
    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      "/model/scene.gltf", // Correct path to the GLTF file
      (gltf) => {
        const model = gltf.scene;
         // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector4());
    model.position.sub(center); // Center the model at the origin

    // Set default rotation
    model.rotation.set(0, Math.PI / 4, 0); // Adjust rotation as needed
        model.scale.set(30, 15, 15); // Adjust model size
        scene.add(model);
  
        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update(); // Update controls in animation loop
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined, // Progress callback
      (error) => console.error("Error loading the model:", error)
    );
  
    // Camera position
    camera.position.set(0, 1, 5); 
  
    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth the camera movement
    controls.dampingFactor = 0.25; // Damping factor for smoother transition
    controls.screenSpacePanning = false; // Prevent camera panning beyond screen
    controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below the ground
  
    // Cleanup on unmount
    return () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = ""; // Clear the canvas
      }
    };
  }, []); // Empty dependency array to ensure the effect runs only once
  

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close button */}
        <span className="popup-close" onClick={onClose}>
          ✖
        </span>

        {/* Content */}
        <div className="popup-content">
          {/* Viewer */}
          <div ref={viewerRef} className="viewer"></div>

          {/* Product details */}
          <div className="details">
            <h2>3D Product Viewer</h2>
          </div>
        </div>
      </div>
      {/* Styles */}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-container {
          background: #fff;
          width: 600px;
          max-width: 90%;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .popup-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          color: #333;
        }

        .popup-close:hover {
          color: red;
        }

        .popup-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }


        .details {
          margin-top: 20px;
          text-align: center;
        }

        .details h2 {
          font-size: 22px;
          margin-bottom: 10px;
        }

        .details .price {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
}
