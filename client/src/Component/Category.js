import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { TeamOutlined, EnvironmentOutlined, HomeOutlined, AppstoreOutlined } from "@ant-design/icons";

const fetchCategories = async () => {
  return [
    //{ icon: TeamOutlined, label: "ทัวร์ท่องเที่ยว" },
    { icon: EnvironmentOutlined, label: "One Day Trip", params: "One Day Trip"},
    { icon: HomeOutlined, label: "แพ็กเกจพร้อมที่พัก", params: "Package with Accommodation" },
    { icon: AppstoreOutlined, label: "ทั้งหมด", params: ""},
  ];
};

const Category = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };

    getCategories();
  }, []);

  const handleClick = (params) => {
    setSelectedCategory(params);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat, index) => (
        <Button
          key={index}
          icon={<cat.icon />}
          onClick={() => handleClick(cat.params)}
          className="flex flex-col items-center justify-center p-10 rounded-lg border border-input bg-background hover:bg-accent transition-colors"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
};

export default Category;