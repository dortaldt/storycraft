import React, { useState, useEffect } from 'react';
import ImageLoader from './ImageLoader';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


import { type } from 'os';

function ParagraphBanner(props: {
    paragraphs: any;
    imageLoaderTriggerParagraph: number[];
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
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    if (currentIndex < paragraphs.length) {
      const interval = setInterval(() => {
        const currentContent = paragraphs[currentIndex];
        if (currentContent.type === 'paragraph') {
          let targetText = currentContent.value;
          const newCurrentText = targetText.slice(0, currentText.length + 1);
          setCurrentText(newCurrentText);
          if (newCurrentText === targetText) {
            clearInterval(interval);
            setBannerShowing(true);
          }
          // Check if currentIndex is in the imageLoaderTriggerParagraph array
          if (imageLoaderTriggerParagraph.includes(currentIndex + 1) && newCurrentText === targetText) {
            // ...
          }
        } else if (currentContent.type === 'imageLoader') {
          // ...
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [currentIndex, currentText, paragraphs, imageLoaderTriggerParagraph, formSelection, inputValue, formSubmitted]);
  

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
    // setBannerShowing(true);
    setFormSubmitted(true)
  };

  const handleResponse = () => {
    setShowImageLoader(true);
    setBannerShowing(true)
    // Call your desired function here, e.g. anotherFunction();
  };

  const turnOffBanner = () => {
    setBannerShowing(false)
  }

  const createMarkup = (text, index) => {
    let modifiedText = text.replace(/\/n/g, '<br />');
    if (index === 0 && formSelection !== '') {
      modifiedText = `${modifiedText} ${formSelection}`;
    }
    if (index === 0 && inputValue !== '') {
      modifiedText = `${modifiedText} ${inputValue}`;
    }
    return { __html: modifiedText };
  };

  // Find the first object with the 'type' value "imageLoader" in the 'paragraphs' prop
const imageLoaderObject = paragraphs.find(content => content.type === 'imageLoader');

// Access the 'value' key of the found object
const imageLoaderValue = imageLoaderObject.value;

  return (
    <div className="paragraph-banner-container">
      <div className="paragraph-container">
      {paragraphs
        .filter((content) => content.type === 'paragraph')
        .slice(0, currentIndex + 1)
        .map((content, index) => (
          <div className="paragraph" key={index}>
            <p
              className="paragraph-text"
              style={{ opacity: index === currentIndex ? 1 : 0.5 }}
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
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Enter a word"
                    />
                    <button onClick={handleInputSubmission}>Let's start</button>
                  </>
                )}
              </div>
            )}

            {imageLoaderTriggerParagraph.includes(index + 1) && showImageLoader && (
              <div className="image-loader-container">
                <ImageLoader
                  defaultImageUrl={defaultImageUrl}
                  apiEndpoint={apiEndpoint}
                  onResponse={handleResponse}
                  active={showImageLoader}
                  loaderDescription={imageLoaderDescription}
                  turnOffBanner={turnOffBanner}
                />
              </div>
            )}
            <TransitionGroup component={null}>
              {bannerShowing && index === currentIndex && formSubmitted &&(
                <CSSTransition
                key="form-container"
                timeout={300}
                classNames="banner-container-transition"
                >
                <div className="banner-container"  onClick={handleScreenClick}>
                  <p className="banner-text">Click anywhere to continue</p> 
                </div>
                </CSSTransition>     
              )}          
            </TransitionGroup>  
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParagraphBanner;
