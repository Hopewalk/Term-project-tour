import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { Tabs, Card, Button, Modal, Table } from "antd";
import ax from "../conf/ax";
import { FieldTimeOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Trip_statistic() {
  const [tours, setTours] = useState([]);
  const [activeTab, setActiveTab] = useState("One Day Trip");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [sortBy, setSortBy] = useState("bookings");

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
        start: item.start_date,
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

  const sortTours = (tours, sortBy) => {
    switch (sortBy) {
      case "bookings":
        return tours.sort((a, b) => b.booking.length - a.booking.length);
      case "name":
        return tours.sort((a, b) => a.name.localeCompare(b.name));
      case "start":
        return tours.sort((a, b) => new Date(a.start) - new Date(b.start));
      default:
        return tours;
    }
  };

  const oneDayTrips = sortTours(
    tours.filter((tour) => tour.type === "One Day Trip"),
    sortBy
  );
  const packageTrips = sortTours(
    tours.filter((tour) => tour.type === "Package with Accommodation"),
    sortBy
  );

  const showModal = (emailData) => {
    setModalData(emailData);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderTourCard = (tour) => {
    const emailData = tour.booking.map((b) => ({
      key: b.id,
      first_name: b.users_permissions_user?.first_name || "N/A",
      last_name: b.users_permissions_user?.last_name || "N/A",
      email: b.users_permissions_user?.email || "N/A",
    }));

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
                <p className="text-gray-600">จำนวนการจอง / จำนวนคนสูงสุด</p>
                <p className="font-medium">
                  {tour.booking.length} / {tour.max_participants}
                </p>
              </div>
              <div>
                <p className="text-gray-600">สถานะ</p>
                <p className="font-medium">{tour.status}</p>
              </div>
              <Button
                className="w-full md:w-auto mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => showModal(emailData)}
              >
                ดูรายชื่อลูกค้า
              </Button>
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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Trip Statistics</h3>
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: 250 }}
        >
          <Option value="bookings">เรียงตามจำนวนการจอง</Option>
          <Option value="name">เรียงตามชื่อทัวร์</Option>
          <Option value="start">เรียงตามวันเริ่มทัวร์</Option>
        </Select>
      </div>

      <div className="w-full max-w-8xl mx-auto mt-6">
        {tours.length === 0 ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane
              tab={
                <span>
                  <FieldTimeOutlined /> One Day Trip
                </span>
              }
              key="One Day Trip"
            >
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
            <Tabs.TabPane tab="Package Tours" key="Package Tours">
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

        {/* Modal for displaying customer email list */}
        <Modal
          title="รายชื่อลูกค้า"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Table
            columns={columns}
            dataSource={modalData}
            pagination={{ pageSize: 20 }}
          />
        </Modal>
      </div>
    </div>
  );
}
