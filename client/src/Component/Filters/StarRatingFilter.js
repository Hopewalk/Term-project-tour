import React from 'react';
import { Checkbox, Rate } from 'antd';

const StarRatingFilter = ({ selectedRatings, handleRatingChange }) => (
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
);

export default StarRatingFilter;