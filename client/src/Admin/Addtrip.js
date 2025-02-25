import React, { useState, useEffect } from "react";
import { Tabs } from 'antd';
import AddAccommodation from "./Component/AddAccommodation"; 
import AddTour from "./Component/AddTour"; 

function AddTrip(){
  const [activeTab, setActiveTab] = useState("Create Tour"); // แก้ไขการใช้ useState

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg"
      style={{ width: "1000px", margin: "0 auto", minHeight: "1000px" }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Create Tour" key="Create Tour">
          <AddTour />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Create Accommodation" key="Create Accommodation">
          <AddAccommodation />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default AddTrip;