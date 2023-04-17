import React, { useRef, useState } from 'react';
import axios from 'axios';

const ImageLoader = ({ defaultImageUrl, apiEndpoint, onResponse }) => {
  const [imageSrc, setImageSrc] = useState(defaultImageUrl);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [firstImageUploaded, setFirstImageUploaded] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setUploadedFile(file);
      if (!firstImageUploaded) {
        setFirstImageUploaded(true);
      }
    };
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSendToServer = async () => {
    if (!uploadedFile) return;

    try {
      await uploadImage(uploadedFile);
      onResponse(); // Call the onResponse callback after the image has been uploaded
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(apiEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response && response.data && response.data.imageUrl) {
        setImageSrc('response.data.imageUrl');
      } else {
        console.error('Invalid API response');
      }
    } catch (error) {
      console.error('Error uploading image:', error.message || 'Unknown error');
    } finally {
      setUploadProgress(0);
      setUploadedFile(null);
    }
  };

  return (
    <div>
      <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%' }} />
      <div className='buttons-container'>
        <button type="button" onClick={handleButtonClick}>
          Upload Image
        </button>
        <input
          type="file"
          accept="image/*"
          capture="user"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        {firstImageUploaded && (
          <button type="button" onClick={handleSendToServer}>
            Send to Server
          </button>
        )}
        {uploadProgress > 0 && (
          <div>
            <progress value={uploadProgress} max="100" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLoader;
