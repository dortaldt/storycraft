// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import ImageLoader from './ImageLoader';
import axios from 'axios';



import { type } from 'os';

function ParagraphBanner(props: {
    paragraphs: any;
    imageLoaderTriggerParagraph: number[];
    defaultImageUrl: string;
    apiEndpoint: string;
  }) {
  const { paragraphs, imageLoaderTriggerParagraph, defaultImageUrl, apiEndpoint, selectedCategory } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [bannerShowing, setBannerShowing] = useState(false);
  const [typingEnded, setTypingEnded] = useState(false);
  const [showImageLoader, setShowImageLoader] = useState(false);
  const [imageLoaderDescription, setImageLoaderDescription] = useState('');
  const [formSelection, setFormSelection] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [activeImageLoader, setActiveImageLoader] = useState(0)
  const [defaultImage, setDefaultImage] = useState ('')
  const [currentContent, setCurrentContent] = useState(paragraphs)
  const [loaderTrigger, setLoaderTriggers] = useState(imageLoaderTriggerParagraph)
  const [bannerText, setBannerText] = useState('Continue')
  const [gifsUrl, setGifsUrl] = useState([])
  const [downloadLabels, setDownloadLabels] = useState([])

  // This effect is responsible for updating the current text and handling image loading
useEffect(() => {
  // Check if the currentIndex is within the paragraphs array
  if (currentIndex < currentContent.length) {
    setTypingEnded(false)
    const interval = setInterval(() => {
      const currentContentType = currentContent[currentIndex];

      // Handle paragraph content type
      if (currentContentType.type === 'paragraph') {
        const targetText = currentContentType.value;
        const newCurrentText = targetText.slice(0, currentText.length + 1);
        setCurrentText(newCurrentText);

        // If the newCurrentText matches the targetText, show the banner and clear the interval
        if (newCurrentText === targetText) {
          setBannerShowing(true);
          setTypingEnded(true)
          clearInterval(interval);
          setBannerText('Continue')
        }

        // Handle the image loading trigger
        if (
          loaderTrigger.includes(currentIndex + 1) &&
          newCurrentText === targetText &&
          typingEnded
          ) {
            setShowImageLoader(true);
            setBannerText('Skip')
            // Find the imageLoader object with the activeImageLoader id
            const imageLoaderObject = currentContent.find(
              (content) =>
                content.type === 'imageLoader' && content.id === activeImageLoader + 1
            );
            // Update the imageLoaderDescription state with the value of the found object
            setImageLoaderDescription(imageLoaderObject.value)
            setDownloadLabels((downloadLabels) => [...downloadLabels, imageLoaderObject.downloadLabel]); // Need to change this to the label from the json
            setDefaultImage(imageLoaderObject.default_image);
            setActiveImageLoader(activeImageLoader + 1)
          }
      } 
      // Handle imageLoader content type
      else if (currentContent.type === 'imageLoader') {
        // Add functionality for handling imageLoader content type here
      }
    }, 10);

    // Cleanup function to clear the interval when the effect is no longer needed
    return () => clearInterval(interval);
  }
}, [
  currentIndex,
  currentText,
  currentContent,
  loaderTrigger,
  formSelection,
  inputValue,
  formSubmitted,
]);

  
  const handleScreenClick = () => {
    if (bannerShowing && currentIndex < currentContent.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentText('');
      setBannerShowing(false);
    }
  };

  const downloadFile = async (url, filename) => {
    const gifUrl = url.replace(/\.(jpg|png|jpeg)$/, '.gif');
    try {
      const response = await fetch(gifUrl);
      if (response.ok) {
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.error('Error downloading the file:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };
  
  
  

  const handleToggleSelection = (selection) => {
    setFormSelection(selection);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmission = () => {
    setBannerShowing(true);
    setFormSubmitted(true)
  };

  const submitForm = async () => {
    try {

      handleInputSubmission(); // Need to be removed - testing only
      
      const response = await axios.post(apiEndpoint + 'form', {
        formSelection,
        inputValue,
        selectedCategory,
      });
  
      if (response.status === 200) {
        const updatedParagraphs = response.data.paragraphs;
        const updatedTriggers = response.data.imageLoaderTriggerParagraph
        // Replace existing paragraphs with the updated ones
        setCurrentContent(updatedParagraphs);
        setLoaderTriggers(updatedTriggers)
        setBannerText('Continue')
        handleInputSubmission();
      } else {
        console.error('Error submitting form:', response.status, response.statusText);
        setBannerText('Continue')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    handleScreenClick()
  };
  

  const handleResponse = (gifUrl) => {
    setShowImageLoader(true);
    setBannerShowing(true)
    setBannerText('Continue')
    setGifsUrl((gifsUrl) => [...gifsUrl, gifUrl]);
    console.log(gifsUrl)
    // Call your desired function here, e.g. anotherFunction();
  };

  const turnOffBanner = () => {
    setBannerShowing(false)
  }

  const createMarkup = (text, index) => {
    let modifiedText = text.replace(/\/n/g, '<br />');
    if (index === 0 && formSelection !== '') {
      modifiedText = `${modifiedText} ${formSelection} named `;
    }
    if (index === 0 && inputValue !== '') {
      modifiedText = `${modifiedText} ${inputValue}`;
    }
    return { __html: modifiedText };
  };

  // Find the first object with the 'type' value "imageLoader" in the 'paragraphs' prop
const imageLoaderObject = currentContent.find(content => content.type === 'imageLoader');

// Access the 'value' key of the found object
const imageLoaderValue = imageLoaderObject.value;

  return (
    <div className="paragraph-banner-container">
      <div className="paragraph-container">
      {currentContent
        .filter((content) => content.type === 'paragraph')
        .slice(0, currentIndex + 1)
        .map((content, index) => (
          <div className="paragraph" key={index}>
            <p
              className="paragraph-text"
              style={{ opacity: currentIndex + activeImageLoader === currentContent.length - 1 && typingEnded || index === currentIndex ? 1 : 0.5 }}
              dangerouslySetInnerHTML={createMarkup(index === currentIndex ? currentText : content.value, index)}
            />
            {index === 0 && currentText.length === content.value.length && !formSubmitted &&(
              <div className="form-container">
                {formSelection === '' ? (
                  <>
                    <div className='form-buttons-container'>
                      <button className='toggle toggle-left' onClick={() => handleToggleSelection('boy')}>Boy</button>
                      <button className='toggle toggle-right' onClick={() => handleToggleSelection('girl')}>Girl</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='text-input-container'>
                      <input
                        type="text"
                        className='text-field'
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Child's name"
                        autoFocus
                      />
                      <button onClick={submitForm} disabled={inputValue === ''}>Let&apos;s start</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {loaderTrigger.includes(index + 1) && showImageLoader && activeImageLoader >= index - 1 && (
              <div className="image-loader-container">
                <ImageLoader
                  defaultImageUrl={defaultImage}
                  apiEndpoint={apiEndpoint}
                  onResponse={handleResponse}
                  active={showImageLoader}
                  loaderDescription={imageLoaderDescription}
                  turnOffBanner={turnOffBanner}
                  loaderId={activeImageLoader}
                  selectedCategory={selectedCategory}
                  handleScreenClick={handleScreenClick}
                />
              </div>
            )}

              <div className={'last-paragrah ' + ((index + 1 + activeImageLoader) === currentContent.length && typingEnded ? '' : 'hidden')}>
                <div className='last-para-wrapper'>
                  <div className='gif-buttons-container'>
                    <a href="https://www.storycraft.ai">
                      <button>Continue the story</button>
                    </a>
                    <p className='description-container explaination'>If you&apos;re interested in reading about
                    </p>
                  </div>
                  
                  {gifsUrl.map((url, index) => (
                    <div className='gif-buttons-container' key={index}>
                      <button
                        className='secondary'
                        key={index}
                        onClick={() => downloadFile(url, `gif${index + 1}.gif`)}
                      >
                        Download {downloadLabels[index]}
                      </button>
                    </div>
                  ))}
                  {gifsUrl.length > 0 && (
                  <div className='explaination'>
                        <p>You can find your gifs:</p>
                        <p>iOS: Files &gt; Browse &gt; On My Device &gt; Downloads.</p>
                        <p>Android: Files &gt; Downloads &gt; File.</p>
                      </div>
                  )}
            
                </div>
              </div>

              <div className={"height-trans" + (bannerShowing && index === currentIndex && index + 1 + activeImageLoader !== currentContent.length && formSubmitted ? '' : ' hide') }  onClick={handleScreenClick}>
                <button className='secondary'>{bannerText}</button>
              </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default ParagraphBanner;
