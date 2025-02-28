import React from 'react';
import { Slider } from 'antd';

const PriceRangeFilter = ({ selectedPriceRange, maxPrice, handlePriceChange }) => (
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
);

export default PriceRangeFilter;