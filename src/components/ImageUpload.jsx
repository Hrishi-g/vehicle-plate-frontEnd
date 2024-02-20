import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload',formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // console.log(response);
      setResponse(response.data.vehicle_number);
      setError(null);
    } catch (error) {
      setError(error.response.data.error);
      setResponse(null);
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Upload Image</button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
