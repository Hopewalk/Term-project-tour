import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added useNavigate
import FilterSidebar from "./Component/Filters/Filters";
import Category from "./Component/Category/Category";
import Thailandbg from "./Images/Thailand-bg.png";
import SearchBar from "./Component/Search/SearchBar";
import RegionsBar from "./Component/Search/RegionsBar";
import TourGrid from "./Component/TourGrid/TourGrid";
import ax from './conf/ax';

export default function TourPage() {
  const navigate = useNavigate(); // Added for navigation
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ sort: "popular" });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedPriceRange, setPriceRange] = useState([0, maxPrice]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [tourNames, setTourNames] = useState([]);
  const [filteredTourNames, setFilteredTourNames] = useState([]);

  useEffect(() => {
    if (maxPrice !== null) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  useEffect(() => {
    const fetchTourNames = async () => {
      try {
        const response = await ax.get('/tours', {
          params: {
            'fields[0]': 'tour_name',
            'fields[1]': 'tour_status',
            'fields[2]': 'documentId',
            'populate[0]': 'regions',
            'pagination[start]': 0,
            'pagination[limit]': 100000,
          },
        });
        const names = response.data.data
          .filter(tour => tour.tour_status === "available")
          .map(tour => ({
            name: tour.tour_name,
            documentId: tour.documentId,
            regions: tour.regions.map(region => region.region),
            provinces: tour.regions.map(region => region.province),
            status: tour.tour_status,
          }));
        setTourNames(names);
      } catch (error) {
        console.error("Error fetching tour names:", error);
      }
    };
    fetchTourNames();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSearchTerm("");
    if (value !== "all") {
      navigate(`/tour/${value}`); // Navigate to /tour/[region] for specific regions
    }
    // No navigation for "all" since we're already on /Tour
  };

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
          <div className="container mx-auto px-4 py-8">
            <div className="flex gap-4 mb-8">
              <RegionsBar selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
              <SearchBar
                onSearch={handleSearch}
                onChange={handleChange}
                searchValue={searchTerm}
                setSearchValue={setSearchTerm}
                tourNames={tourNames}
                filteredTourNames={filteredTourNames}
                setFilteredTourNames={setFilteredTourNames}
                selectedRegion={selectedRegion}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl pl-8">
          {/* Title */}
          <h2 className="text-2xl font-semibold mb-6">ทัวร์ทั้งหมดในประเทศไทย</h2>
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
                searchTerm={searchTerm}
                selectedRegion={selectedRegion}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}