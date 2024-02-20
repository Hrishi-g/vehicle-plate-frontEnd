import React, { useState, useEffect } from "react";
import axios from 'axios';

function Cctv() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const intervalId = setInterval(capture, 5000); // Capture image every 5 seconds
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []); // Run only once when component mounts

  const capture = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/upload');
      setResponse(response.data.vehicle_number);
    //   setError(""); // Reset error if successful
    } catch (error) {
    //   console.error("Error:", error);
      setError(error.response.data.error); // Set generic error message
    }
  }

  return (
    <div className="Container">
      <h1>Result: {response ? response : error}</h1>
    </div>
  );
}

export default Cctv;
