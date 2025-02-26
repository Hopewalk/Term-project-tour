import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { EnvironmentOutlined, HomeOutlined } from "@ant-design/icons";

const fetchCategories = async () => [
  { icon: <EnvironmentOutlined />, label: "One Day Trip", params: "One Day Trip" },
  { icon: <HomeOutlined />, label: "แพ็กเกจพร้อมที่พัก", params: "Package with Accommodation" },
];

const Category = ({ setSelectedCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map(({ icon, label, params }, index) => (
        <Button
          key={index}
          icon={icon}
          onClick={() => setSelectedCategory(selectedCategory === params ? "" : params)}
          type="default"
          color={selectedCategory === params ? "primary" : "default"}
          variant={selectedCategory === params ? "outlined" : ""}
          className="flex flex-col items-center justify-center p-10 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default Category;
