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
  const [sortBy, setSortBy] = useState("participants");

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
        "/tours?populate=time_ranges.bookings.users_permissions_user"
      );
      console.log(response.data);

      const tourData = response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.tour_name,
        type: item.tour_type,
        status: item.tour_status,
        description: item.description,
        timeRanges:
          item.time_ranges?.map((range) => {
            const confirmedBookings =
              range.bookings?.filter((b) => b.booking_status === "confirmed") ||
              [];

            return {
              id: range.id,
              start: range.start_date,
              end: range.end_date,
              max_participants: range.max_participants,
              bookings: confirmedBookings,
              participants: confirmedBookings.reduce(
                (sum, b) => sum + (b.participant || 0),
                0
              ),
            };
          }) || [],
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
    return [...tours].sort((a, b) => {
      switch (sortBy) {
        case "participants":
          return (
            b.timeRanges.reduce((sum, range) => sum + range.participants, 0) -
            a.timeRanges.reduce((sum, range) => sum + range.participants, 0)
          );
        case "bookings":
          return (
            b.timeRanges.reduce(
              (sum, range) => sum + range.bookings.length,
              0
            ) -
            a.timeRanges.reduce((sum, range) => sum + range.bookings.length, 0)
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "start":
          const aStart = Math.min(
            ...a.timeRanges.map((range) => new Date(range.start))
          );
          const bStart = Math.min(
            ...b.timeRanges.map((range) => new Date(range.start))
          );
          return aStart - bStart;
        default:
          return 0;
      }
    });
  };

  const oneDayTrips = sortTours(
    tours.filter((tour) => tour.type === "One Day Trip"),
    sortBy
  );
  const packageTrips = sortTours(
    tours.filter((tour) => tour.type === "Package with Accommodation"),
    sortBy
  );

  const showModal = (bookings) => {
    const emailData = bookings.map((b) => ({
      first_name: b.users_permissions_user?.first_name || "N/A",
      last_name: b.users_permissions_user?.last_name || "N/A",
      email: b.users_permissions_user?.email || "N/A",
    }));

    setModalData(emailData);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderTourCard = (tour) => {
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
            <div className="mt-4 pt-4 border-t">
              {tour.timeRanges.map((range) => (
                <div key={range.id} className="mb-4 p-4 border rounded-md">
                  <p className="text-gray-600">
                    ช่วงเวลา: {range.start} - {range.end}
                  </p>
                  <p className="text-gray-600">
                    จำนวนการจอง: {range.bookings.length}
                  </p>
                  <p className="text-gray-600">
                    จำนวนคน / จำนวนคนสูงสุด: {range.participants} /{" "}
                    {range.max_participants}
                  </p>
                  <Button
                    className="w-full md:w-auto mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => showModal(range.bookings)}
                  >
                    ดูรายชื่อลูกค้าที่จอง
                  </Button>
                </div>
              ))}
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
          <Option value="participants">เรียงตามจำนวนคน</Option>
          <Option value="bookings">เรียงตามจำนวนการจอง</Option>
          <Option value="name">เรียงตามชื่อทัวร์</Option>
          <Option value="start">เรียงตามวันเริ่มทัวร์</Option>
        </Select>
      </div>

      <div className="w-full max-w-8xl mx-auto mt-6">
        {tours.length === 0 ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "One Day Trip",
                label: (
                  <span>
                    <FieldTimeOutlined /> One Day Trip
                  </span>
                ),
                children: (
                  <div>
                    <h3 className="text-center text-lg font-semibold mb-4">
                      One Day Trip
                    </h3>
                    {oneDayTrips.length === 0 ? (
                      <p className="text-center text-gray-500">
                        ไม่มีข้อมูลทัวร์
                      </p>
                    ) : (
                      oneDayTrips.map((tour) => renderTourCard(tour))
                    )}
                  </div>
                ),
              },
              {
                key: "Package Tours",
                label: (
                  <span>
                    <AppstoreOutlined /> Package Tours
                  </span>
                ),
                children: (
                  <div>
                    <h3 className="text-center text-lg font-semibold mb-4">
                      Package with Accommodation
                    </h3>
                    {packageTrips.length === 0 ? (
                      <p className="text-center text-gray-500">
                        ไม่มีข้อมูลทัวร์
                      </p>
                    ) : (
                      packageTrips.map((tour) => renderTourCard(tour))
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}

        {/* Modal for displaying customer email list */}
        <Modal
          title="รายชื่อลูกค้า"
          open={isModalVisible}
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
