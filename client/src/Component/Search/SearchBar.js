import React, { useState, useEffect } from "react";
import { Input, Button, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ax from '../../conf/ax';

const { Search } = Input;

export default function SearchBar({ onSearch, searchValue, setSearchValue, tourNames, filteredTourNames, setFilteredTourNames }) {
  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filtered = tourNames.filter(tour =>
        tour.name.toLowerCase().includes(value.toLowerCase())
      ).map(tour => tour.name);
      setFilteredTourNames(filtered);
    } else {
      setFilteredTourNames([]);
    }
  };

  return (
    <div className="flex-1 relative">
      <Search
        placeholder="ค้นหากิจกรรม"
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        value={searchValue}
        onChange={handleInputChange}
      />
      {filteredTourNames.length > 0 && (
        <div className="absolute bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto z-10">
          <List
            size="small"
            bordered
            dataSource={filteredTourNames}
            renderItem={item => (
              <List.Item onClick={() => {
                setSearchValue(item);
                setFilteredTourNames([]);
              }}>
                {item}
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}