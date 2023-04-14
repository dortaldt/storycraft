import React, { useState, useEffect } from 'react';

function ParagraphBanner(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (currentIndex < props.paragraphs.length) {
      const interval = setInterval(() => {
        const newCurrentText = props.paragraphs[currentIndex].slice(0, currentText.length + 1);
        setCurrentText(newCurrentText);
        if (newCurrentText === props.paragraphs[currentIndex]) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentIndex, currentText, props.paragraphs]);

  const handleScreenClick = () => {
    if (currentIndex < props.paragraphs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentText('');
    }
  };

  return (
    <div onClick={handleScreenClick}>
      <div className="text-div">
        {props.paragraphs.slice(0, currentIndex + 1).map((paragraph, index) => (
          <div key={index}>
            <p style={{ opacity: index === currentIndex ? 1 : 0.5 }}>{index === currentIndex ? currentText : paragraph}</p>
            {index === currentIndex && (
              <div className="banner-div">
                Click anywhere to continue
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParagraphBanner;
