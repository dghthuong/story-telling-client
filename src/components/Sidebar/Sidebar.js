import React, { useRef, useState, useEffect } from "react";
import { Input } from "antd";

const Sidebar = ({ onSearch, onCategorySelect, categories, selectedCategory }) => {
  const sidebarRef = useRef();
  const [clickedInside, setClickedInside] = useState(false);

  useEffect(() => {
    const handleClick = () => {
      if (clickedInside) {
        // Nếu đã click vào bên trong, thì không xử lý đóng sidebar
        setClickedInside(false);
        return;
      }

      // Xử lý đóng sidebar khi click bên ngoài
      onCategorySelect(""); // Đặt selectedCategory về trạng thái mặc định
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [clickedInside, onCategorySelect]);

  return (
    <div ref={sidebarRef} style={{ textAlign: "left", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ textAlign: "left" }}>Tìm kiếm</h3>
        <Input
          type="text"
          placeholder="Tìm kiếm câu chuyện...."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div>
        {categories.map((category) => (
          <p
            key={category}
            onClick={() => {
              onCategorySelect(category);
              setClickedInside(true); // Thay đổi trạng thái khi click vào thể loại
            }}
            style={{
              cursor: "pointer",
              fontWeight: selectedCategory === category ? "bold" : "normal",
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
