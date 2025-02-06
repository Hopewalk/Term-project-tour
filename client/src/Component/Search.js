import React, { useState } from "react";
import { Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [region, setRegion] = useState("all");

  const onSearch = (value) => {
    console.log("Search term:", value, "Region:", region);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-8">
        <Select
          defaultValue={region}
          onChange={(value) => setRegion(value)}
          style={{ width: 200 }}
        >
          <Option value="all">ทุกภูมิภาค</Option>
          <Option value="north">ภาคเหนือ</Option>
          <Option value="northeast">ภาคตะวันออกเฉียงเหนือ</Option>
          <Option value="central">ภาคกลาง</Option>
          <Option value="south">ภาคใต้</Option>
        </Select>

        <div className="flex-1 relative">
          <Search
            placeholder="ค้นหากิจกรรม"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={onSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <Button
          type="primary"
          onClick={() => onSearch(searchValue)}
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
