import React, { useState, useEffect } from "react";
import { Input, Select, Button, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ax from '../conf/ax';

const { Search } = Input;
const { Option } = Select;

export default function SearchBar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [tourNames, setTourNames] = useState([]);
  const [filteredTourNames, setFilteredTourNames] = useState([]);

  useEffect(() => {
    // Fetch tour names when the component mounts
    const fetchTourNames = async () => {
      try {
        const response = await ax.get('/tours', {
          params: {
            'fields[0]': 'tour_name',
            'populate[0]': 'regions',
            'pagination[start]': 0,
            'pagination[limit]': 100000
          }
        });
        const names = response.data.data.map(tour => ({
          name: tour.tour_name,
          regions: tour.regions.map(region => region.region)
        }));
        setTourNames(names);
      } catch (error) {
        console.error("Error fetching tour names:", error);
      }
    };

    fetchTourNames();
  }, []);

  const handleSearch = () => {
    onSearch(searchValue, selectedRegion);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      const filtered = tourNames.filter(tour =>
        tour.name.toLowerCase().includes(value.toLowerCase()) &&
        (selectedRegion === "all" || tour.regions.includes(selectedRegion))
      ).map(tour => tour.name);
      setFilteredTourNames(filtered);
    } else {
      setFilteredTourNames([]);
    }
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSearchValue(""); // Clear search value when region changes
  };

  useEffect(() => {
    handleSearch();
  }, [selectedRegion]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-8">
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleRegionChange}
        >
          <Option value="all">ทุกภูมิภาค</Option>
          <Option value="northern">ภาคเหนือ</Option>
          <Option value="northeastern">ภาคตะวันออกเฉียงเหนือ</Option>
          <Option value="central">ภาคกลาง</Option>
          <Option value="southern">ภาคใต้</Option>
        </Select>

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

        <Button
          type="primary"
          onClick={handleSearch}
          style={{
            backgroundColor: "white",
            borderColor: "black",
            color: "black",
          }}
        >
          ค้นหา
        </Button>
      </div>
    </div>
  );
}