import React, { useState, useEffect } from "react";
import { Input, Button, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function SearchBar({ 
  onSearch, 
  onChange, // Added onChange prop
  searchValue, 
  setSearchValue, 
  tourNames, 
  filteredTourNames, 
  setFilteredTourNames, 
  selectedRegion, // Optional prop
  selectedProvince // Optional prop
}) {
  const handleSearch = () => {
    onSearch(searchValue);
    // Find the documentId for the current search value or the first filtered tour
    const selectedTour = tourNames.find(tour => tour.name === searchValue) || 
                         (filteredTourNames.length > 0 ? tourNames.find(tour => tour.name === filteredTourNames[0]) : null);
    if (selectedTour && selectedTour.documentId) {
      window.open(`/trip/${selectedTour.documentId}`, '_blank'); // Open new window with /trip/[documentId]
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onChange) {
      onChange(value); // Call onChange prop with the new value
    }
    if (value) {
      const filtered = tourNames
        .filter(tour => {
          const matchesName = tour.name.toLowerCase().includes(value.toLowerCase());
          const matchesRegion = !selectedRegion || selectedRegion === "all" || 
            tour.regions.some(r => r.toLowerCase() === selectedRegion.toLowerCase());
          const matchesProvince = !selectedProvince || 
            tour.provinces.some(p => p.toLowerCase() === selectedProvince.toLowerCase());
          return matchesName && matchesRegion && matchesProvince;
        })
        .map(tour => tour.name);
      setFilteredTourNames(filtered);
    } else {
      const filtered = tourNames
        .filter(tour => {
          const matchesRegion = !selectedRegion || selectedRegion === "all" || 
            tour.regions.some(r => r.toLowerCase() === selectedRegion.toLowerCase());
          const matchesProvince = !selectedProvince || 
            tour.provinces.some(p => p.toLowerCase() === selectedProvince.toLowerCase());
          return matchesRegion && matchesProvince;
        })
        .map(tour => tour.name);
      setFilteredTourNames(filtered);
    }
  };

  const handleFocus = () => {
    const filtered = tourNames
      .filter(tour => {
        const matchesRegion = !selectedRegion || selectedRegion === "all" || 
          tour.regions.some(r => r.toLowerCase() === selectedRegion.toLowerCase());
        const matchesProvince = !selectedProvince || 
          tour.provinces.some(p => p.toLowerCase() === selectedProvince.toLowerCase());
        return matchesRegion && matchesProvince;
      })
      .map(tour => tour.name);
    setFilteredTourNames(filtered);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFilteredTourNames([]);
    }, 200);
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
        onFocus={handleFocus}
        onBlur={handleBlur}
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
                if (onChange) {
                  onChange(item); // Update parent on selection
                }
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