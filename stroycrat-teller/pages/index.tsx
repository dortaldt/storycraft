import React, { useState } from 'react';
import ParagraphBanner from './ParagraphBanner';
import CategoryMenu from './CategoryMenu';
import ImageLoader from './ImageLoader';

function App() {
  const defaultImageUrl = 'https://static.wixstatic.com/media/845144_90be4482dfb04734b9f11bb7bdbfeefe~mv2.png/v1/fill/w_600,h_600,al_c,lg_1,q_85,enc_auto/download__88_-removebg-preview_edited_pn.png';
  const apiEndpoint = 'http://192.168.1.117:7860/submit_room';
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: 'Category 1',
      description: 'This is a short description of category 1',
      image: 'https://static.wixstatic.com/media/845144_f3aae4b50c8445a78166af9355075563~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/wb23-removebg-preview.png',
      content: [
        { type: 'paragraph', value: 'Paragraph 1/nfor Category 1' },
        { type: 'paragraph', value: 'Paragraph 2 for Category 1' },
        { type: 'paragraph', value: 'Paragraph 3 for Category 1' },
        { type: 'imageLoader', value: 'The story starts in your childs room, creating a familiar base for a magical journey. This connection immerses them in the narrative, engaging with characters and plot.'},
      ],
      selected: false,
    },
    {
      id: 2,
      title: 'Category 2',
      description: 'This is a short description of category 2',
      image: 'https://static.wixstatic.com/media/845144_e07869a00e394209b07d7efd22ce799a~mv2.png/v1/fill/w_344,h_344,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/wb17.png',
      content: [
        { type: 'paragraph', value: 'Paragraph 1 for Category 2' },
        { type: 'paragraph', value: 'Paragraph 2 for Category 2' },
        { type: 'paragraph', value: 'Paragraph 3 for Category 2' },
        { type: 'imageLoader', value: 'ImageLoader description for Category 2' },
      ],
      selected: false,
    },
    {
      id: 3,
      title: 'Category 3',
      description: 'This is a short description of category 3',
      image: 'https://via.placeholder.com/150',
      content: [
        { type: 'paragraph', value: 'Paragraph 1 for Category 3' },
        { type: 'paragraph', value: 'Paragraph 2 for Category 3' },
        { type: 'paragraph', value: 'Paragraph 3 for Category 3' },
        { type: 'imageLoader', value: 'ImageLoader description for Category 3' },
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
      {selectedCategory && <ParagraphBanner
        paragraphs={selectedCategory.content}
        imageLoaderTriggerParagraph={3}
        defaultImageUrl={defaultImageUrl}
        apiEndpoint={apiEndpoint}
      />}
    </div>
  );
}

export default App;
