import React, { useState } from 'react';

const CategoryMenu = (props: { onCategorySelect: (arg0: any) => void; categories: any[]; }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category: React.SetStateAction<null>) => {
    setSelectedCategory(category);
    props.onCategorySelect(category);
  };

  const getCardClassName = (category: { id: any; }) => {
    if (!selectedCategory) {
      return 'category-card';
    }
    return category.id === selectedCategory.id ? 'category-card selected' : 'category-card hidden';
  };

  return (
    <div className="category-menu">
      <div className='header'>
        <div className='opening-text'>
          <span className={(selectedCategory !== null ? 'hidden' : '')}>I want to </span>
          <span className={'text-highlight ' + (selectedCategory !== null ? 'hidden' : '')} >empower </span>
          <span className={(selectedCategory !== null ? 'hidden' : '')}>my child with</span>
          {selectedCategory !== null &&(
            <span className='value-header'> {selectedCategory.title}</span>
          )}
        </div>
        <div className={'sub-title ' + (selectedCategory !== null ? 'hidden' : 'fade')}>
          <p>Pick a theme to create a fantastic story for your child</p>
        </div>
      </div>
      {props.categories.map((category) => (
        <div
          className={getCardClassName(category)}
          key={category.id}
          onClick={() => handleCategoryClick(category)}
        >
          <img className="category-image" src={category.image} alt={category.title} />
          <div className="category-info">
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        </div>
      ))}
        <div className={'footer ' + (selectedCategory !== null ? 'hidden' : 'fade')}>
          <p>Powered by <a href='www.storycarft.ai'>Storycraft AI</a></p>
        </div>
    </div>
  );
};

export default CategoryMenu;
