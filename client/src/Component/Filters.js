import { useState } from "react";
import { Slider, Radio, Checkbox, Rate } from "antd";

const sortOptions = [
  { value: "popular", label: "ยอดนิยม" },
  { value: "price-low", label: "เรียงราคาต่ำสุดก่อน" },
  { value: "price-high", label: "เรียงราคาสูงสุดก่อน" }
];

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
      {/* Sort Options */}
      <div>
        <h3 className="font-semibold mb-4">เรียงผลการค้นหา</h3>
        <Radio.Group value={selectedSort} onChange={handleSortChange}>
          {sortOptions.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2 mb-2">
              <Radio value={value}>{label}</Radio>
            </div>
          ))}
        </Radio.Group>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-4">ช่วงราคา</h3>
        <div className="px-2">
          <Slider
            range
            value={selectedPriceRange}
            max={maxPrice}
            min={0}
            step={5}
            className="mb-2"
            onChange={handlePriceChange}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{selectedPriceRange[0].toLocaleString()} THB</span>
            <span>{selectedPriceRange[1].toLocaleString()} THB</span>
          </div>
        </div>
      </div>

      {/* Star Rating Filter */}
      <div>
        <h3 className="font-semibold mb-4">ระดับดาว</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={selectedRatings.includes(rating)}
                onChange={(e) => handleRatingChange(e.target.checked, rating)}
              />
              <Rate disabled defaultValue={rating} count={5} className="text-yellow-400" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
