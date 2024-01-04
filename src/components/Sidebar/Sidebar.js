import React from 'react';
import {Input} from 'antd'


const Sidebar = ({ onSearch, onCategorySelect, categories, selectedCategory }) => {
  return (
    <div style={{ textAlign:'left' ,padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{textAlign:'left'}}>Search</h3>
        <Input 
          type="text"
          placeholder="Search stories..."
          onChange={e => onSearch(e.target.value)}
          style={{ width: "200px", height: "30px" }}
        />
      </div>
      <div>
        {categories.map(category => (
          <p
            key={category}
            onClick={() => onCategorySelect(category)}
            style={{
              cursor: 'pointer',
              fontWeight: selectedCategory === category ? 'bold' : 'normal'
            }}
          >
            {category}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
