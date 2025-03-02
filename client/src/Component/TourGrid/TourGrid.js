import { useState, useEffect } from 'react';
import { Spin } from 'antd'; // Import Spin from Ant Design
import TourCard from "../TourCard/TourCard";
import PaginationComponent from '../Pagination/PaginationComponent';
import fetchTour from './fetchTour';
import applyFilters from './applyFilters';

const getPriceRange = (tours) => {
  if (!tours.length) return [0, 10000];
  const prices = tours.map(tour => tour.price);
  return [0, Math.max(...prices)];
};

const TourGrid = ({ 
  selectedCategory, 
  selectedFilters, 
  setPriceRange, 
  setMaxPrice, 
  searchTerm, 
  selectedRegion, 
  selectedProvince 
}) => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetch and filter changes

  // Fetch tours on mount
  useEffect(() => {
    setIsLoading(true);
    fetchTour()
      .then((tourData) => {
        setTours(tourData);
        const priceRange = getPriceRange(tourData);
        setMaxPrice(priceRange[1]);
        setPriceRange(priceRange);
        setTimeout(() => setIsLoading(false), 300); // Delay for fade effect
      })
      .catch(error => {
        console.error("Error in useEffect:", error);
        setIsLoading(false);
      });
  }, [setMaxPrice, setPriceRange]);

  // Trigger loading effect when filters change
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300); // Fade effect for filter changes
  }, [selectedCategory, selectedFilters, searchTerm, selectedRegion, selectedProvince]);

  const filteredTours = applyFilters(
    selectedCategory 
      ? tours.filter(tour => tour.categories_name.includes(selectedCategory)) 
      : tours,
    selectedFilters,
    selectedRegion
  )
  .filter(tour => {
    const matchesSearch = !searchTerm || tour.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || selectedRegion === "all" || 
      tour.regions.some(region => region.name.toLowerCase() === selectedRegion.toLowerCase());
    const matchesProvince = !selectedProvince || 
      tour.regions.some(region => region.province.toLowerCase() === selectedProvince.toLowerCase());
    return matchesSearch && matchesRegion && matchesProvince;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const displayTours = filteredTours.slice(startIndex, startIndex + pageSize);

  console.log('data:', startIndex, tours);
  console.log('filteredTours:', filteredTours);
  console.log('displayTours:', displayTours);

  return (
    <div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${isLoading ? 'fade-out' : 'fade-in'}`}>
        {isLoading ? (
          <div className="text-center col-span-4">
            <Spin tip="Loading tours..." />
          </div>
        ) : displayTours.length > 0 ? (
          displayTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
        ) : (
          <p className="text-center col-span-4">No tours available.</p>
        )}
      </div>
      {!isLoading && (
        <PaginationComponent
          currentPage={currentPage}
          pageSize={pageSize}
          total={filteredTours.length}
          showTotal={true}
          onChange={(page, newPageSize) => {
            setCurrentPage(page);
            setPageSize(newPageSize);
          }}
        />
      )}
    </div>
  );
};

export default TourGrid;