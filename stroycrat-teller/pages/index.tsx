// Import required modules and components
import React, { useState, useEffect } from 'react';
import ParagraphBanner from './ParagraphBanner';
import CategoryMenu from './CategoryMenu';

function App() {
  // Default image URL
  const defaultImageUrl = 'https://static.wixstatic.com/media/845144_90be4482dfb04734b9f11bb7bdbfeefe~mv2.png/v1/fill/w_600,h_600,al_c,lg_1,q_85,enc_auto/download__88_-removebg-preview_edited_pn.png';
  
  // API endpoint
  const apiEndpoint = 'https://dortaldt-fictional-barnacle-xrr5xqr4xpph6gg7-7860.preview.app.github.dev/';
  
  // State for selected category and categories list
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Function to fetch content data from an external JSON file
  const fetchCategories = async () => {
    try {
      const response = await fetch('/categories.json');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Call fetchCategories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === category.id ? { ...cat, selected: true } : { ...cat, selected: false }
    );
    setSelectedCategory(category);
    setCategories(updatedCategories);
  };

  return (
    <div className="App">
      {/* Render CategoryMenu component with required props */}
      <CategoryMenu categories={categories} onCategorySelect={handleCategorySelect} setCategories={setCategories} />
      
      {/* Render ParagraphBanner component when a category is selected */}
      {selectedCategory && <ParagraphBanner
        paragraphs={selectedCategory.content}
        imageLoaderTriggerParagraph={selectedCategory.triggerParagraph}
        defaultImageUrl={defaultImageUrl}
        apiEndpoint={apiEndpoint}
        selectedCategory={selectedCategory.id}
      />}
    </div>
  );
}

export default App;
