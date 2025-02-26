import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../context/Auth.context";
import ax from "../conf/ax";
import { Form, Input, InputNumber, Button, message } from "antd";

export default function BookingForm() {
  const { state } = useContext(AuthContext);
  const { documentId } = useParams();
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    phone: "",
    line_id: "",
    participant: 1,
  });
  const navigate = useNavigate();

  const fetchDetail = async () => {
    try {
      const response = await ax.get(`/tours/${documentId}?populate=*`);
      const item = response.data.data;
      const product = {
        documentId: item.documentId,
        name: item.tour_name,
        price: item.price,
        description: item.description,
        location: item.destination,
        start: item.start_date,
        end: item.end_date,
        image:
          item.image?.length > 0
            ? item.image.map((img) => ({
                src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
              }))
            : [{ src: "http://localhost:1337/uploads/example.png" }],
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

  const handleBooking = async () => {
    if (!tour || !formData.phone || formData.participant <= 0) {
      message.error("Please fill out all required fields.");
      return;
    }
    try {
      const bookingData = {
        data: {
          ...formData,
          users_permissions_user: state.user.documentId,
          booking_status: "pending",
          tour: tour.documentId,
          total_price: totalPrice,
          booking_date: new Date().toISOString(),
          payment_status: "unpaid",
        },
      };
      console.log("Sending Booking Data:", bookingData);

      const response = await ax.post("/bookings", bookingData);
      message.success("Booking successful!");
    } catch (error) {
      console.error(error);
      message.error("There was an error with your booking.");
    }
  };

  const totalPrice = tour ? tour.price * formData.participant : 0;

  if (!tour) return <div>Loading...</div>;

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Tour Information</h2>
            {tour.image.length > 0 ? (
              <img
                src={tour.image[tour.image.length - 1].src}
                className="size-full w-60 h-40 object-cover sm:rounded-lg"
                alt="Tour Image"
              />
            ) : (
              <div>No images available</div>
            )}
            <p className="text-lg font-semibold">{tour.name}</p>
            <p className="text-gray-600">Location: {tour.location}</p>
            <p className="text-gray-600">
              Start Date: {new Date(tour.start).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              End Date: {new Date(tour.end).toLocaleDateString()}
            </p>
            <p className="mt-4 text-base text-gray-900">{tour.description}</p>
          </div>

          {/* Middle */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Booking Information</h2>
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
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
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

              <Form.Item
                label="Number of People"
                rules={[
                  { required: true, message: "Please enter number of people" },
                ]}
              >
                <InputNumber
                  min={1}
                  name="participant"
                  value={formData.participant}
                  onChange={(value) =>
                    setFormData({ ...formData, participant: value })
                  }
                  className="w-full"
                />
              </Form.Item>
            </Form>
          </div>

          {/* Right */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Payment</h2>
            <p className="text-lg font-semibold">Total Price: {totalPrice} ฿</p>
            <div className="space-y-4">
              <Button
                type="primary"
                className="w-full bg-green-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-green-500 mt-6"
                onClick={handleBooking}
              >
                ชำระเงิน
              </Button>

              {/* Cancel Button */}
              <Button
                type="default"
                className="w-full bg-red-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-red-500"
                onClick={handleCancel}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
