import React,{useRef, useEffect} from 'react';
import {Input} from 'antd'


const Sidebar = ({ onSearch, onCategorySelect, categories, selectedCategory,onOutsideClick }) => {
  const sidebarRef = useRef(); 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onOutsideClick(); // Hàm này sẽ hủy việc lọc
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick]);

  return (
    <div ref={sidebarRef} style={{ textAlign:'left' ,padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{textAlign:'left'}}>Tìm kiếm</h3>
        <Input 
          type="text"
          placeholder="Tìm kiếm câu chuyện...."
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
