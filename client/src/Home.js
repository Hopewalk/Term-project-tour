import React, { useEffect, useState } from "react";
import FilterSidebar from "./Component/Filters";
import Category from "./Component/Category";
import Thailandbg from "./Images/Thailand-bg.png";
import SearchBar from "./Component/Search";
import TourGrid from "./Component/homepage/TourGrid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [PriceBarRange, setPriceRange] = useState([0, maxPrice]);
/*
  console.log("sc", selectedCategory);
  console.log("cf", selectedFilters || "no filters selected");
  console.log("pbr", PriceBarRange);
  console.log("mp", maxPrice);
*/
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="h-[400px] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${Thailandbg})`,
        }}
      >
        <div className="absolute inset-0 flex items-center">
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">ทัวร์และกิจกรรมต่างๆ</h2>
        <Category setSelectedCategory={setSelectedCategory} />
        <div className="flex gap-8 mt-8">
          {maxPrice !== null && maxPrice !== undefined && (
            <FilterSidebar
              setSelectedFilters={setSelectedFilters}
              setSelectedPriceRange={setSelectedPriceRange}
              PriceRange={selectedPriceRange}
              maxPrice={maxPrice} />
          )}
          <TourGrid
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            selectedFilters={selectedFilters}
            setPriceRange={setPriceRange}
            setMaxPrice={setMaxPrice} />
        </div>
      </div>
    </main>
  );
};
