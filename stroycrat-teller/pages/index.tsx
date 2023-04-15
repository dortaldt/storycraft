import React, { useState } from 'react';
import ParagraphBanner from './ParagraphBanner';
import CategoryMenu from './CategoryMenu';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: 'Category 1',
      description: 'This is a short description of category 1',
      image: 'https://via.placeholder.com/150',
      content: [
        'Paragraph 1 for Category 1',
        'Paragraph 2 for Category 1',
        'Paragraph 3 for Category 1'
      ],
      selected: false,
    },
    {
      id: 2,
      title: 'Category 2',
      description: 'This is a short description of category 2',
      image: 'https://via.placeholder.com/150',
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
      {selectedCategory && <ParagraphBanner paragraphs={selectedCategory.content} />}
    </div>
  );
}

export default App;
