import React, { useState, useEffect } from 'react';
import ImageLoader from './ImageLoader';
import { type } from 'os';

function ParagraphBanner(props: {
    paragraphs: any;
    imageLoaderTriggerParagraph: any;
    defaultImageUrl: string;
    apiEndpoint: string;
  }) {
  const { paragraphs, imageLoaderTriggerParagraph, defaultImageUrl, apiEndpoint } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [bannerShowing, setBannerShowing] = useState(false);
  const [typingEnded, setTypingEnded] = useState(false);
  const [showImageLoader, setShowImageLoader] = useState(false);
  const [imageLoaderDescription, setImageLoaderDescription] = useState('');
  const [formSelection, setFormSelection] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    
    if (currentIndex < paragraphs.length) {
      const interval = setInterval(() => {
        const currentContent = paragraphs[currentIndex];
        if (currentContent.type === 'paragraph') {
          const newCurrentText = currentContent.value.slice(0, currentText.length + 1);
          setCurrentText(newCurrentText);
          if (newCurrentText === currentContent.value && inputValue !== '') {
            clearInterval(interval);
            setBannerShowing(true);
          }
          if (currentIndex === imageLoaderTriggerParagraph - 1 && newCurrentText === currentContent.value) {
            setTypingEnded(true);
            setImageLoaderDescription(paragraphs[currentIndex + 1].value);
            setShowImageLoader(true);
          }
        } else if (currentContent.type === 'imageLoader') {
          // setImageLoaderDescription(currentContent.value);
          // setShowImageLoader(true);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [currentIndex, currentText, paragraphs, imageLoaderTriggerParagraph]);

  const handleScreenClick = () => {
    if (bannerShowing && currentIndex < paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentText('');
      setBannerShowing(false);
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
  };

  const handleResponse = () => {
    setShowImageLoader(true);
    setBannerShowing(true)
    // Call your desired function here, e.g. anotherFunction();
  };

  const createMarkup = (text) => {
    let modifiedText = text.replace(/\/n/g, '<br />');
    if (formSelection) {
      modifiedText = modifiedText.replace('{formSelection}', formSelection);
    }
    if (inputValue) {
      modifiedText = modifiedText.replace('{inputValue}', inputValue);
    }
    return { __html: modifiedText };
  };

  // Find the first object with the 'type' value "imageLoader" in the 'paragraphs' prop
const imageLoaderObject = paragraphs.find(content => content.type === 'imageLoader');

// Access the 'value' key of the found object
const imageLoaderValue = imageLoaderObject.value;

  return (
    <div className="paragraph-banner-container" onClick={handleScreenClick}>
      <div className="paragraph-container">
      {paragraphs
        .filter((content) => content.type === 'paragraph')
        .slice(0, currentIndex + 1)
        .map((content, index) => (
          <div className="paragraph" key={index}>
            <p
              className="paragraph-text"
              style={{ opacity: index === currentIndex ? 1 : 0.5 }}
              dangerouslySetInnerHTML={createMarkup(index === currentIndex ? currentText : content.value)}
            />
            {index === 0 && currentText.length === content.value.length && (
              <div className="form-container">
                {formSelection === '' ? (
                  <>
                    <button onClick={() => handleToggleSelection('boy')}>Boy</button>
                    <button onClick={() => handleToggleSelection('girl')}>Girl</button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Enter a word"
                    />
                    <button onClick={handleInputSubmission}>Submit</button>
                  </>
                )}
              </div>
            )}

            {index === imageLoaderTriggerParagraph - 1 && showImageLoader && (
              <div className="image-loader-container">
                <ImageLoader
                  defaultImageUrl={defaultImageUrl}
                  apiEndpoint={apiEndpoint}
                  onResponse={handleResponse}
                  active={showImageLoader}
                  loaderDescription={imageLoaderValue}
                />
              </div>
            )}
            {bannerShowing && (
              <div className="banner-container">
                <p className="banner-text">Click anywhere to continue</p> 
              </div>     
            )}            
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParagraphBanner;
