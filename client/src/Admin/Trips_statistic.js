import React, { useEffect, useState } from "react";
import { Tabs, Card, Button, Dropdown, Menu, Table } from "antd";
import ax from "../conf/ax";
import { FieldTimeOutlined , AppstoreOutlined   } from '@ant-design/icons';

export default function Trip_statistic() {
  const [tours, setTours] = useState([]);
  const [activeTab, setActiveTab] = useState("One Day Trip"); 

  const fetchTour = async () => {
    try {
      const response = await ax.get(
        "/tours?populate[bookings][populate]=users_permissions_user"
      );
      const tourData = response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.tour_name,
        type: item.tour_type,
        status: item.tour_status,
        description: item.description,
        max_participants: item.max_participants,
        booking: item.bookings,
      }));
      console.log("Fetch tours:", tourData);
      setTours(tourData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTour();
  }, []);

  const oneDayTrips = tours.filter((tour) => tour.type === "One Day Trip");
  const packageTrips = tours.filter(
    (tour) => tour.type === "Package with Accommodation"
  );

  const renderTourCard = (tour) => {
    // Columns for the email table
    const columns = [
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
    ];

    // Prepare the data for the table (email list)
    const emailData = tour.booking.map((b) => ({
      key: b.id,
      first_name: b.users_permissions_user?.first_name || "N/A",
      last_name: b.users_permissions_user?.last_name || "N/A",
      email: b.users_permissions_user?.email || "N/A",
    }));

    // Menu with the dropdown to show the customer emails
    const menu = (
      <Menu>
        <Menu.Item>
          <Table columns={columns} dataSource={emailData} pagination={false} />
        </Menu.Item>
      </Menu>
    );

    return (
      <Card
        key={tour.id}
        className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col md:flex-row gap-20">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold mb-2">{tour.name}</h2>
            </div>
            <p className="text-gray-600 mb-2">{tour.description}</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t">
              <div>
                <p className="text-gray-600">จำนวนการจอง</p>
                <p className="font-medium">{tour.booking.length}</p>
              </div>
              <div>
                <p className="text-gray-600">สถานะ</p>
                <p className="font-medium">{tour.status}</p>
              </div>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button className="w-full md:w-auto mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  ดูรายชื่อลูกค้า
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div
      className="bg-white p-8 rounded-lg shadow-lg"
      style={{ width: "1000px", margin: "0 auto", minHeight: "1000px" }}
    >
      <div className="w-full max-w-8xl mx-auto mt-6">
        {tours.length === 0 ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane 
              tab={
                <span>
                  <FieldTimeOutlined   /> One Day Trip
                </span>
              } 
              key="One Day Trip">
              <div>
                <h3 className="text-center text-lg font-semibold mb-4">
                  One Day Trip
                </h3>
                {oneDayTrips.length === 0 ? (
                  <p className="text-center text-gray-500">ไม่มีข้อมูลทัวร์</p>
                ) : (
                  oneDayTrips.map((tour) => renderTourCard(tour))
                )}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane 
              tab={
                <span>
                  <AppstoreOutlined   /> Package with Accommodation
                </span>
              } 
              key="Package with Accommodation">
              <div>
                <h3 className="text-center text-lg font-semibold mb-4">
                  Package with Accommodation
                </h3>
                {packageTrips.length === 0 ? (
                  <p className="text-center text-gray-500">ไม่มีข้อมูลทัวร์</p>
                ) : (
                  packageTrips.map((tour) => renderTourCard(tour))
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </div>
);
}
