import React, { useState } from "react";
import SortOptions from './SortOptions';
import PriceRangeFilter from './PriceRangeFilter';
import StarRatingFilter from './StarRatingFilter';

const FilterSidebar = ({ setSelectedFilters, maxPrice }) => {
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, maxPrice]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    setSelectedFilters((prev) => ({ ...prev, sort: newSort }));
  };

  const handlePriceChange = (value) => {
    setSelectedPriceRange(value);
    setSelectedFilters((prev) => ({ ...prev, priceRange: value }));
  };

  const handleRatingChange = (checked, rating) => {
    const newRatings = checked
      ? [...selectedRatings, rating]
      : selectedRatings.filter((r) => r !== rating);

    setSelectedRatings(newRatings);
    setSelectedFilters((prev) => ({ ...prev, rating: newRatings }));
  };

  return (
    <div className="w-64 flex-shrink-0 p-4 border-r space-y-6">
      <SortOptions selectedSort={selectedSort} handleSortChange={handleSortChange} />
      <PriceRangeFilter selectedPriceRange={selectedPriceRange} maxPrice={maxPrice} handlePriceChange={handlePriceChange} />
      <StarRatingFilter selectedRatings={selectedRatings} handleRatingChange={handleRatingChange} />
    </div>
  );
};

export default FilterSidebar;