import React, { useState, useEffect } from 'react';
import ImageLoader from './ImageLoader';

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

  useEffect(() => {
    
    if (currentIndex < paragraphs.length) {
      const interval = setInterval(() => {
        const currentContent = paragraphs[currentIndex];
        if (currentContent.type === 'paragraph') {
          const newCurrentText = currentContent.value.slice(0, currentText.length + 1);
          setCurrentText(newCurrentText);
          if (newCurrentText === currentContent.value) {
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

  const createMarkup = (text: string) => {
    return { __html: text.replace(/\/n/g, '<br />') };
  };

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
              {index === currentIndex && currentText.length === content.value.length && (
                <div className="banner-container">
                  <p className="banner-text">Click anywhere to continue</p>
                </div>
              )}
            </div>
          ))}
        {showImageLoader && (
          <div className="image-loader-container">
            <p className="image-loader-description">{imageLoaderDescription}</p>
            <ImageLoader
              defaultImageUrl={defaultImageUrl}
              apiEndpoint={apiEndpoint}
              onResponse={() => setShowImageLoader(false)}
              active={showImageLoader}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ParagraphBanner;
