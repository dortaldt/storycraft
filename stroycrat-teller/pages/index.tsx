import React, { useState } from 'react';
import ParagraphBanner from './ParagraphBanner';
import CategoryMenu from './CategoryMenu';
import ImageLoader from './ImageLoader';

function App() {
  const defaultImageUrl = 'https://example.com/default-image.jpg';
  const apiEndpoint = 'https://your-api-endpoint.com/upload-image';
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: 'Category 1',
      description: 'This is a short description of category 1',
      image: 'https://static.wixstatic.com/media/845144_f3aae4b50c8445a78166af9355075563~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/wb23-removebg-preview.png',
      content: [
        'Jonathan was a shy and timid boy who had never ventured far from home. One day, he decided to explore the world beyond his village. As he traveled through forests and mountains, he faced many challenges that tested his courage.',
        'He encountered fierce animals, climbed treacherous cliffs, and crossed raging rivers. With each obstacle, Jonathan felt fear, but he pushed through it and discovered a newfound sense of bravery within himself.',
        'Finally, after months of traveling, Jonathan returned home, a changed boy. He no longer felt afraid of the world and knew that with courage, anything was possible. The lesson: sometimes the greatest adventure is stepping out of your comfort zone and facing your fears.'
      ],
      selected: false,
    },
    {
      id: 2,
      title: 'Category 2',
      description: 'This is a short description of category 2',
      image: 'https://static.wixstatic.com/media/845144_e07869a00e394209b07d7efd22ce799a~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/wb17.png',
      content: [
        'Paragraph 1 for Category 2',
        'Paragraph 2 for Category 2',
        'Paragraph 3 for Category 2'
      ],
      selected: false,
    },
    {
      id: 3,
      title: 'Category 3',
      description: 'This is a short description of category 3',
      image: 'https://via.placeholder.com/150',
      content: [
        'Paragraph 1 for Category 3',
        'Paragraph 2 for Category 3',
        'Paragraph 3 for Category 3'
      ],
      selected: false,
    }
  ]);

  const handleCategorySelect = (category) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === category.id ? { ...cat, selected: true } : { ...cat, selected: false }
    );
    setSelectedCategory(category);
    setCategories(updatedCategories);
  };

  return (
    <div className="App">
      <CategoryMenu categories={categories} onCategorySelect={handleCategorySelect} setCategories={setCategories} />
      {selectedCategory && <ParagraphBanner paragraphs={selectedCategory.content} imageLoaderTriggerParagraph={1} />}
    </div>
  );
}

export default App;
