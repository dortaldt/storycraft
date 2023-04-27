import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const ImageLoader = ({ defaultImageUrl, apiEndpoint, onResponse, loaderDescription, turnOffBanner, loaderId, selectedCategory }) => {
  const [imageSrc, setImageSrc] = useState(defaultImageUrl);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showProgress, setShowProgress] = useState(false)
  const [firstImageUploaded, setFirstImageUploaded] = useState(false);
  const [showButtonsContainer, setShowButtonsContainer] = useState(true);

  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const originalImageDataUrl = reader.result;
      const croppedImageBlob = await cropImage(originalImageDataUrl);
      const croppedImageDataUrl = URL.createObjectURL(croppedImageBlob);
      setImageSrc(croppedImageDataUrl);
      setUploadedFile(croppedImageBlob);
      if (!firstImageUploaded) {
        setFirstImageUploaded(true);
      }
    };
  };

  let firstInterval = true;
  const getRandomInterval = () => {
    if (firstInterval) {
      firstInterval = false;
      return 0;
    }
    return Math.random() * (3000 - 0) + 500;
  };
  
  const startProgress = () => {
    if (intervalId) {
      // If there's already an active interval, don't start another one
      return;
    }
  
    // Controls the loader behaviour
    const startNewInterval = () => {
      const newIntervalId = setInterval(() => {
        const randomIncrement = Math.random() * (5 - 0) + 10;
        setUploadProgress((prevValue) => {
          const newValue = prevValue + randomIncrement;
          return newValue > 100 ? 100 : newValue;
        });
        clearInterval(newIntervalId);
        startNewInterval();
      }, getRandomInterval());
  
      setIntervalId(newIntervalId);
    };
  
    startNewInterval();
  };


  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSendToServer = async () => {
    if (!uploadedFile) return;
    setShowProgress(true)
    startProgress()
    setShowButtonsContainer(false);
  
    try {
      const croppedImageBlob = await cropImage(imageSrc);
      await uploadImage(croppedImageBlob);
      onResponse(); // Call the onResponse callback after the image has been uploaded
      setShowButtonsContainer(false);
      setShowProgress(false) // Hide the buttons container
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const cropImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 1024;
        let newWidth, newHeight;
  
        if (img.width > img.height) {
          // Landscape
          newWidth = maxSize;
          newHeight = Math.round((img.height * maxSize) / img.width);
        } else {
          // Portrait
          newWidth = Math.round((img.width * maxSize) / img.height);
          newHeight = maxSize;
        }
  
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1);
      };
    });
  };
  

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file)
      formData.append('id', loaderId);
      formData.append('selectedCategory', selectedCategory)

      const response = await axios.post(apiEndpoint + 'img', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response && response.data && response.data.imageUrl) {
        setImageSrc(response.data.imageUrl);
        setShowProgress(false)
        setUploadProgress(1)
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
        
        {/* <div className={'progbar-container ' + (showProgress ? ' ' : 'transparent')}>
          <progress className='progress' value={uploadProgress} max="100" />
        </div> */}
      <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%' }} />
      <div className={"progress-bar " + 'progbar-container ' + (showProgress ? ' ' : 'transparent') }>
          <div className="progress-bar-inner" id="progress-bar-inner" style={{width: uploadProgress+ '%'}}></div>
        </div>
      {showButtonsContainer && (
        <div className='buttons-container'>
          {firstImageUploaded && (
            <div className='image-loader-buttons'>
            <button type="button"  disabled={showProgress} onClick={handleSendToServer}>
              Transform
            </button>
            <button type="button" className='secondary' disabled={showProgress} onClick={handleButtonClick}>
              Reload another Image
            </button>
            </div>
          )}
          {!firstImageUploaded && (
          <button type="button" onClick={handleButtonClick}>
            Upload Image
          </button>
          )}
          <input
            type="file"
            accept="image/*"
            // capture="user"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <div className='description-container'>
            {loaderDescription}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
