import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from 'axios';

function WebcamImage() {
  const webcamRef = useRef(null);
  const [response,setResponse] = useState("");
  const [error,setError] = useState("");

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  useEffect(() => {
    const intervalId = setInterval(capture, 5000); // Capture image every 5 seconds
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []); // Run only once when component mounts

  const capture = async() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(response => response.blob());

    // Create FormData object and append the image file
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg');
    try {
        const response = await axios.post('http://127.0.0.1:5000/upload',formData);
        setResponse(response.data.vehicle_number);
      } catch (error) {
        setError(error.response.data.error);
      }
    }

  return (
    <div className="Container">
      <Webcam
        audio={false}
        mirrored={false}
        height={400}
        width={400}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <h1>Result: 
        {response?response:error}</h1>
    </div>
  );
}

export default WebcamImage;