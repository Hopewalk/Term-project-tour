import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default function RegionsBar({ selectedRegion, onRegionChange }) {
  return (
    <Select
      defaultValue={selectedRegion}
      style={{ width: 200 }}
      onChange={onRegionChange}
    >
      <Option value="all">ทุกภูมิภาค</Option>
      <Option value="northern">ภาคเหนือ</Option>
      <Option value="northeastern">ภาคตะวันออกเฉียงเหนือ</Option>
      <Option value="central">ภาคกลาง</Option>
      <Option value="southern">ภาคใต้</Option>
    </Select>
  );
}