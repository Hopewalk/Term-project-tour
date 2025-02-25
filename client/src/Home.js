import React, { useState, useEffect } from "react";
import FilterSidebar from "./Component/Filters";
import Category from "./Component/Category";
import Thailandbg from "./Images/Thailand-bg.png";
import SearchBar from "./Component/Search";
import TourGrid from "./Component/homepage/TourGrid";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedPriceRange, setPriceRange] = useState([0, maxPrice]);

  useEffect(() => {
    if (maxPrice !== null) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

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
        <div className="max-w-7xl pl-8">
          {/* Title */}
          <h2 className="text-2xl font-semibold mb-6">ทัวร์และกิจกรรมต่างๆ</h2>
        </div>

        {/* Flexbox for centering Grid, Filters, and Category */}
        <div className="flex flex-col gap-8 mt-8">
          {/* Category Selection */}
          <div className="w-full mb-8">
            <Category
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Filters and Tour Grid (Stacked) */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Filters */}
            <div className="w-full lg:w-1/5">
              {maxPrice !== null && (
                <FilterSidebar
                  setSelectedFilters={setSelectedFilters}
                  setSelectedPriceRange={setPriceRange}
                  setSelectedRatings={setSelectedRatings}
                  selectedPriceRange={selectedPriceRange}
                  maxPrice={maxPrice}
                />
              )}
            </div>

            {/* Right: Tour Grid */}
            <div className="w-full lg:w-4/5">
              <TourGrid
                selectedCategory={selectedCategory}
                selectedFilters={selectedFilters}
                setPriceRange={setPriceRange}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
