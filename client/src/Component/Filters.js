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

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    setSelectedFilters((prev) => ({ ...prev, sort: newSort }));
  };

  const handlePriceChange = (value) => {
    console.log("value",value || "nulllll");
    setSelectedPriceRange(value);
    setSelectedFilters((prev) => ({ ...prev, priceRange: value }));
  };
  console.log("sss",selectedPriceRange);
  
  return (
    <div className="w-64 flex-shrink-0 p-4 border-r">
      <div className="space-y-6">
        {/* Sort Options */}
        <div>
          <h3 className="font-semibold mb-4">เรียงผลการค้นหา</h3>
          <Radio.Group value={selectedSort} onChange={handleSortChange}>
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 mb-2">
                <Radio value={option.value}>{option.label}</Radio>
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
              defaultValue={selectedPriceRange}
              value={selectedPriceRange}
              max={maxPrice} //have to fix (use max/min price range that get from get api)
              min={0} // have to fix
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
              <label
                key={rating}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox
                  onChange={(e) => {
                    setSelectedFilters((prev) => {
                      const newRatings = e.target.checked
                        ? [...(prev.ratings || []), rating]
                        : (prev.ratings || []).filter((r) => r !== rating);
                      return { ...prev, ratings: newRatings };
                    });
                  }}
                />
                <Rate disabled defaultValue={rating} count={5} className="text-yellow-400" />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
