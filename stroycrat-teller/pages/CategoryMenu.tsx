import React from 'react';

const CategoryMenu = (props) => {
  const handleCategoryClick = (category) => {
    props.onCategorySelect(category);
  };

  return (
    <div className="category-menu">
      {props.categories.map((category) => (
        <div className="category-card" key={category.id} onClick={() => handleCategoryClick(category)}>
          <img
            className="category-image"
            src={category.image}
            alt={category.title}
          />
          <div className="category-info">
            <h2 className="category-title">{category.title}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
