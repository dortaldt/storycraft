import React, { useState, useEffect } from 'react';

function ParagraphBanner(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [bannerShowing, setBannerShowing] = useState(false);

  useEffect(() => {
    if (currentIndex < props.paragraphs.length) {
      const interval = setInterval(() => {
        const newCurrentText = props.paragraphs[currentIndex].slice(0, currentText.length + 1);
        setCurrentText(newCurrentText);
        if (newCurrentText === props.paragraphs[currentIndex]) {
          clearInterval(interval);
          setBannerShowing(true);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentIndex, currentText, props.paragraphs]);

  const handleScreenClick = () => {
    if (bannerShowing && currentIndex < props.paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentText('');
      setBannerShowing(false);
    }
  };

  return (
    <div className="paragraph-banner-container" onClick={handleScreenClick}>
      <div className="paragraph-container">
        {props.paragraphs.slice(0, currentIndex + 1).map((paragraph, index) => (
          <div className="paragraph" key={index}>
            <p className="paragraph-text" style={{ opacity: index === currentIndex ? 1 : 0.5 }}>{index === currentIndex ? currentText : paragraph}</p>
            {index === currentIndex && currentText.length === paragraph.length && (
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
