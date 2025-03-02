import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilterSidebar from "./Component/Filters/Filters";
import Category from "./Component/Category/Category";
import Thailandbg from "./Images/Thailand-bg.png";
import SearchBar from "./Component/Search/SearchBar";
import RegionsBar from "./Component/Search/RegionsBar";
import TourGrid from "./Component/TourGrid/TourGrid";
import ax from './conf/ax';

export default function TourProvince() {
  const { region, province } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({ sort: "popular" });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedPriceRange, setPriceRange] = useState([0, maxPrice]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(region || "all");
  const [tourNames, setTourNames] = useState([]);
  const [filteredTourNames, setFilteredTourNames] = useState([]);

  const regionDisplayNames = {
    central: 'กลาง',
    northern: 'เหนือ',
    northeastern: 'ตะวันออกเฉียงเหนือ',
    southern: 'ใต้',
  };

  const regionDisplay = regionDisplayNames[region?.toLowerCase()] || region;

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

  useEffect(() => {
    setSelectedRegion(region || "all");
  }, [region]);

  const handleSearch = (term, region) => {
    setSearchTerm(term);
    setSelectedRegion(region);
  };

  const handleChange = (value) => {
    setSearchTerm(value);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSearchTerm("");
    if (value === "all") {
      navigate("/Tour"); // Navigate to /Tour if "all" is selected
    } else {
      navigate(`/tour/${value}`); // Navigate to /tour/[region] for other selections
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div
        className="h-[400px] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${Thailandbg})` }}
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
                selectedRegion={region}
                selectedProvince={province}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl pl-8">
          <h2 className="text-2xl font-semibold mb-6">
            {province ? `ทัวร์ทั้งหมดในจังหวัด${province}` : `ทัวร์ทั้งหมดในภาค${regionDisplay}`}
          </h2>
        </div>
        <div className="flex flex-col gap-8 mt-8">
          <div className="w-full mb-8">
            <Category
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="w-full lg:w-4/5">
              <TourGrid
                selectedCategory={selectedCategory}
                selectedFilters={selectedFilters}
                setPriceRange={setPriceRange}
                setMaxPrice={setMaxPrice}
                searchTerm={searchTerm}
                selectedRegion={region}
                selectedProvince={province}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}