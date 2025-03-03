import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../context/Auth.context";
import ax from "../conf/ax";
import { Form, Input, Button, message, Table, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import qr from "qrcode";
import generatePayload from "promptpay-qr";

export default function BookingForm() {
  const { state } = useContext(AuthContext);
  const { documentId } = useParams();
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    line_id: "",
  });
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [slip, setSlip] = useState(null);
  const navigate = useNavigate();

  const fetchDetail = async () => {
    try {
      const response = await ax.get(
        `/tours/${documentId}?populate=time_ranges.bookings&populate=image&populate=reviews&populate=accommodations&populate=tour_categories`
      );
      const item = response.data.data;
      const timeRanges =
        item.time_ranges?.map((range) => {
          const confirmedBookings = range.bookings?.filter(
            (booking) => booking.booking_status === "confirmed"
          );
          const totalConfirmedBooked = confirmedBookings
            ? confirmedBookings.reduce(
                (sum, booking) => sum + booking.participant,
                0
              )
            : 0;
          const timeDocumentId = range.documentId;
          const startDate = range.start_date
            ? new Date(range.start_date)
            : null;
          const endDate = range.end_date ? new Date(range.end_date) : null;
          return {
            timeId: timeDocumentId,
            start: startDate ? startDate.toLocaleDateString("th-TH") : "N/A",
            end: endDate ? endDate.toLocaleDateString("th-TH") : "N/A",
            max_participants: range.max_participants,
            total_booked: totalConfirmedBooked,
          };
        }) || [];
      const product = {
        documentId: item.documentId,
        name: item.tour_name,
        price: item.price,
        description: item.description,
        location: item.destination,
        start: item.start_date,
        end: item.end_date,
        time_ranges: timeRanges,
        image: item.image?.map((img) => ({
          src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
        })),
      };
      setTour(product);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [documentId]);

  const handleCancel = () => {
    navigate(`/trip/${documentId}`);
  };

  const handleModal = () => {
    const totalParticipants = Object.values(selectedParticipants).reduce(
      (sum, value) => sum + value,
      0
    );

    const selectedTimeIds = tour.time_ranges
      .filter((range) => selectedParticipants[range.start] > 0)
      .map((range) => range.timeId);

    if (selectedTimeIds.length > 1) {
      setErrorMessage(
        "การจอง 1 ครั้ง สามารถเลือกได้เพียงช่วงเวลาเดียวเท่านั้น"
      );
      return;
    }
    if (!formData.phone.trim()) {
      setErrorPhone("กรุณากรอกเบอร์โทรศัพท์");
      return;
    } else if (
      !tour ||
      Object.keys(selectedParticipants).length === 0 ||
      totalParticipants === 0
    ) {
      setErrorMessage("โปรดเพิ่มจำนวนคนก่อนทำการจอง");
      return;
    }
    setIsModalVisible(true);
  };
  const handleBooking = async () => {
    const totalParticipants = Object.values(selectedParticipants).reduce(
      (sum, value) => sum + value,
      0
    );

    const selectedTimeIds = tour.time_ranges
      .filter((range) => selectedParticipants[range.start] > 0)
      .map((range) => range.timeId);

    if (!slip) {
      setErrorMessage("กรุณาอัปโหลดสลิปก่อนทำการจอง");
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("files", slip);
      const uploadRes = await ax.post("/upload", formDataUpload);
      const imageUrl = uploadRes.data[0].id;

      const bookingData = {
        data: {
          phone: formData.phone,
          line_id: formData.line_id,
          users_permissions_user: state.user.documentId,
          booking_status: "pending",
          tour: tour.documentId,
          total_price: Object.values(selectedParticipants).reduce(
            (sum, value) => sum + value * tour.price,
            0
          ),
          booking_date: new Date().toISOString(),
          payment_status: "paid",
          time_range: selectedTimeIds,
          participant: totalParticipants,
          image: imageUrl,
        },
      };

      await ax.post("/bookings", bookingData);
      message.success("Booking successful!");
      navigate(`/History`);
      setIsModalVisible(false);
    } catch (error) {
      message.error("ไม่สามารถชำระเงินได้");
    }
  };

  const totalPrice = tour
    ? Object.values(selectedParticipants).reduce(
        (sum, count) => sum + count * tour.price,
        0
      )
    : 0;

  const generateQrCode = () => {
    const phoneNumber = "0842177462";
    const totalPrice = Object.values(selectedParticipants).reduce(
      (sum, count) => sum + count * tour.price,
      0
    );
    if (totalPrice > 0) {
      const payload = generatePayload(phoneNumber, { amount: totalPrice });
      qr.toDataURL(payload, (err, url) => {
        if (!err) setQrCode(url);
      });
    }
  };

  if (!tour) return <div>Loading...</div>;
  const columns = [
    {
      title: "วันเริ่มเดินทาง",
      dataIndex: "start",
      key: "start",
    },
    {
      title: "วันสิ้นสุด",
      dataIndex: "end",
      key: "end",
    },
    {
      title: "จำนวนที่รองรับ",
      dataIndex: "max_participants",
      key: "max_participants",
    },
    {
      title: "จำนวนคนจอง",
      dataIndex: "total_booked",
      key: "total_booked",
    },
    {
      title: "เพิ่มจำนวนคน",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <button
            className="bg-gray-200 px-3 py-1 rounded-full"
            onClick={() =>
              setSelectedParticipants((prev) => ({
                ...prev,
                [record.start]: Math.max((prev[record.start] || 0) - 1, 0),
              }))
            }
          >
            -
          </button>
          <span>{selectedParticipants[record.start] || 0}</span>
          <button
            className="bg-gray-200 px-3 py-1 rounded-full"
            onClick={() =>
              setSelectedParticipants((prev) => ({
                ...prev,
                [record.start]: Math.min(
                  (prev[record.start] || 0) + 1,
                  record.max_participants - record.total_booked
                ),
              }))
            }
          >
            +
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto max-w-16xl px-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr_0.5fr] gap-8">
          {/* Left */}
          <div className="col-span-1 bg-gray-100 p-6 w-full rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Tour Information</h2>
            {tour.image?.length > 0 ? (
              <img
                src={
                  tour.image[tour.image.length - 1].src || "/placeholder.svg"
                }
                className="size-full w-60 h-40 object-cover sm:rounded-lg"
                alt="Tour Image"
              />
            ) : (
              <div>No images available</div>
            )}
            <p className="text-lg font-semibold">{tour.name}</p>
            <p className="text-gray-600">Location: {tour.location}</p>
            <p className="text-gray-600">Price: {tour.price}</p>
            <p className="mt-4 text-base text-gray-900">{tour.description}</p>
          </div>

          {/* Middle */}
          <div className="col-span-1 bg-white p-6 w-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Booking Information</h2>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">ช่วงเวลาเดินทาง</h3>
              <Table
                columns={columns}
                dataSource={tour.time_ranges.map((item, index) => ({
                  ...item,
                  key: item.timeId || index,
                }))}
                pagination={false}
              />
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>
            <Form layout="vertical" className="space-y-4">
              <Form.Item label="First Name">
                <Input
                  value={state.user?.first_name || ""}
                  className="bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </Form.Item>

              <Form.Item label="Last Name">
                <Input
                  value={state.user?.last_name || ""}
                  className="bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  ท่านสามารถเปลี่ยนชื่อได้ใน Profile
                </p>
              </Form.Item>

              <Form.Item
                label="Phone Number"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                />
                {errorPhone && (
                  <p className="text-red-500 mt-1">{errorPhone}</p>
                )}
              </Form.Item>

              <Form.Item label="Line ID" rules={[{ required: false }]}>
                <Input
                  name="line_id"
                  value={formData.line_id}
                  onChange={(e) =>
                    setFormData({ ...formData, line_id: e.target.value })
                  }
                />
              </Form.Item>
            </Form>
          </div>

          {/* Right */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md my-auto">
            <h2 className="text-2xl font-bold">การชำระเงิน</h2>
            <h2 className="text-1xl font-small">Promptpay QR</h2>
            <p className="text-lg font-semibold mb-4">
              ราคารวม : {totalPrice} ฿
            </p>
            <div className="space-y-4">
              <Button
                type="default"
                className="w-full bg-green-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-red-500"
                onClick={() => {
                  generateQrCode();
                  handleModal();
                }}
              >
                ชำระเงิน
              </Button>

              <Button
                type="default"
                className="w-full bg-red-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-red-500"
                onClick={handleCancel}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
          <Modal
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button type="primary" onClick={handleBooking} disabled={!slip}>
                ส่งหลักฐานการชำระเงิน
              </Button>,
              <Button key="close" onClick={() => setIsModalVisible(false)}>
                ปิด
              </Button>,
            ]}
          >
            <div className="text-center app-container">
              <h2 className="text-lg font-semibold">Scan QR เพื่อชำระเงิน</h2>
              <p className="text-gray-600 mb-2">จำนวนเงิน: {totalPrice} ฿</p>
              {qrCode && (
                <img src={qrCode} alt="QR Code" className="mx-auto mt-6" />
              )}
              <div className="mt-4">
                <Upload
                  maxCount={1}
                  beforeUpload={(file) => {
                    setSlip(file);
                    return false;
                  }}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: true,
                  }}
                  onRemove={() => setSlip(null)}
                >
                  {!slip && (
                    <Button icon={<UploadOutlined />}>อัปโหลดสลิป</Button>
                  )}
                </Upload>
                {slip && (
                  <div className="mt-4">
                    <p className="text-gray-600">สลิปที่อัปโหลด:</p>
                    <img
                      src={URL.createObjectURL(slip)}
                      alt="อัปโหลดสลิป"
                      className="w-full max-w-xs mx-auto mt-2 rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
