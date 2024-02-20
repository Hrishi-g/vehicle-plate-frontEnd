import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = async() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', { image: imageData});
      console.log('Response from Flask API:', response);
    } catch (error) {
      console.error('Error sending image to Flask API:', error);
    }
  };

  // const downloadImage = () => {
  //   if (capturedImage) {
  //     const blob = dataURItoBlob(capturedImage);
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'captured_image.jpg';
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   }
  // };

  // const dataURItoBlob = (dataURI) => {
  //   const byteString = atob(dataURI.split(',')[1]);
  //   const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={capturePhoto}>Capture Photo</button>
      {/* {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" />
          <button onClick={downloadImage}>Download Image</button>
        </div>
      )} */}
    </div>
  );
};

export default CameraComponent;
