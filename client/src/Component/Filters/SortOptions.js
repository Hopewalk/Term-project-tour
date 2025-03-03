import React from 'react';
import { Radio } from 'antd';

const sortOptions = [
  { value: "popular", label: "ยอดนิยม" },
  { value: "price-low", label: "เรียงราคาต่ำสุดก่อน" },
  { value: "price-high", label: "เรียงราคาสูงสุดก่อน" }
];

const SortOptions = ({ selectedSort, handleSortChange }) => (
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
);

export default SortOptions;