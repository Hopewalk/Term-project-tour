import { useState, useEffect } from 'react';
import TourCard from "../TourCard/TourCard";
import PaginationComponent from '../Pagination/PaginationComponent';
import fetchTour from './fetchTour';
import applyFilters from './applyFilters';

const getPriceRange = (tours) => {
  if (!tours.length) return [0, 10000]; // Default max price if no tours exist
  const prices = tours.map(tour => tour.price);
  return [0, Math.max(...prices)];
};

const TourGrid = ({ selectedCategory, selectedFilters, setPriceRange, setMaxPrice, searchTerm, selectedRegion }) => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  useEffect(() => {
    fetchTour().then((tourData) => {
      setTours(tourData);
      const priceRange = getPriceRange(tourData);
      setMaxPrice(priceRange[1]);
      setPriceRange(priceRange);
    }).catch(error => console.error("Error in useEffect:", error));
  }, []);

  const filteredTours = applyFilters(
    selectedCategory ? tours.filter(tour => tour.categories_name.includes(selectedCategory)) : tours,
    selectedFilters,
    selectedRegion
  ).filter(tour =>
    !searchTerm || tour.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const displayTours = filteredTours.slice(startIndex, startIndex + pageSize);

  //log
  console.log('data:', startIndex, tours);
  console.log('dptours', displayTours);

  return (
    <div>
      {/*Display tours */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {
          displayTours.length > 0 ? (
            displayTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
          ) : (
            <p className="text-center col-span-4">No tours available.</p>
          )
        }
      </div>

      {/*Pagination*/}
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
    </div>
  );
};

export default TourGrid;