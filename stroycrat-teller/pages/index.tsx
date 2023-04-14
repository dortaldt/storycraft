import React from 'react';
import ParagraphBanner from './ParagraphBanner';

function App() {
  const paragraphs = [
    'As a young girl, Emily had always dreamed of seeing the world beyond her small town',
    'So when she graduated from high school, she decided to embark on a solo backpacking trip around Europe',
    'As she wandered through bustling cities and quaint villages, she discovered a sense of independence and wonder that she never knew existed within herself',
  ];

  return (
    <div className="App">
      <ParagraphBanner paragraphs={paragraphs} />
    </div>
  );
}

export default App;
