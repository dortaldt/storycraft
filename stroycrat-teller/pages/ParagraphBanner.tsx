import React, { useState, useEffect } from 'react';
import ImageLoader from './ImageLoader';

// Add imageLoaderTriggerParagraph to the component's props
function ParagraphBanner(props: { paragraphs: any; imageLoaderTriggerParagraph: any; }) {
  const { paragraphs, imageLoaderTriggerParagraph } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [bannerShowing, setBannerShowing] = useState(false);
  const [typingEnded, setTypingEnded] = useState(false);

  useEffect(() => {
    if (currentIndex < paragraphs.length) {
      const interval = setInterval(() => {
        const newCurrentText = paragraphs[currentIndex].slice(0, currentText.length + 1);
        setCurrentText(newCurrentText);
        if (newCurrentText === paragraphs[currentIndex]) {
          clearInterval(interval);
          setBannerShowing(true);
        }
        if (currentIndex === imageLoaderTriggerParagraph - 1 && newCurrentText === paragraphs[currentIndex]) {
          setTypingEnded(true);
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

  return (
    <div className="paragraph-banner-container" onClick={handleScreenClick}>
      <div className="paragraph-container">
        {paragraphs.slice(0, currentIndex + 1).map((paragraph, index) => (
          <div className="paragraph" key={index}>
            <p className="paragraph-text" style={{ opacity: index === currentIndex ? 1 : 0.5 }}>{index === currentIndex ? currentText : paragraph}</p>
            {index === currentIndex && currentText.length === paragraph.length && (
              <div className="banner-container">
                <p className="banner-text">Click anywhere to continue</p>
              </div>
            )}
          </div>
        ))}
        {typingEnded && (
          <div className="image-loader-container">
            <ImageLoader />
          </div>
        )}
      </div>
    </div>
  );
}

export default ParagraphBanner;
