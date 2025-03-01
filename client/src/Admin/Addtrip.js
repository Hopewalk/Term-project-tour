import React, { useState } from "react";
import { Tabs } from 'antd';
import { 
  CompassOutlined , 
  ScheduleOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import AddAccommodation from "./Component/AddAccommodation"; 
import AddTour from "./Component/AddTour"; 
import AddTimeRange from "./Component/AddTimeRange"; 

function AddTrip(){
  const [activeTab, setActiveTab] = useState("Create Tour"); 

  const containerStyle = {
    width: "1000px",
    margin: "0 auto",
    minHeight: activeTab === "Set Tour Schedule" ? "500px" : "1000px"
  };

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg"
      style={containerStyle}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane 
          tab={
            <span>
              <CompassOutlined  /> Create Tour
            </span>
          } 
          key="Create Tour"
        >
          <AddTour />
        </Tabs.TabPane>
        <Tabs.TabPane 
          tab={
            <span>
              <ScheduleOutlined /> Set Tour Schedule
            </span>
          } 
          key="Set Tour Schedule"
        >
          <AddTimeRange />
        </Tabs.TabPane>
        <Tabs.TabPane 
          tab={
            <span>
              <HomeOutlined /> Create Accommodation
            </span>
          } 
          key="Create Accommodation"
        >
          <AddAccommodation />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default AddTrip;