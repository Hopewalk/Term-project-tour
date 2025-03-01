import React, { useEffect, useState } from "react";
import ax from "../conf/ax";
import { Select, Card, Modal } from "antd";

function Status() {
  const [orders, setOrders] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await ax.get("/bookings?populate=*");
      const data = response.data.data;
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (documentId, status) => {
    try {
      await ax.put(`/bookings/${documentId}`, {
        data: { booking_status: status },
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (documentId, status) => {
    updateStatus(documentId, status);
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Set Status
        </h1>
      </header>
      {[...orders]
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))
        .map((order) => (
          <Card key={order.id} className="mx-auto max-w-7xl mt-2" title="Order">
            <div className="flex justify-between">
              <div>
                {order.image && order.image.url ? (
                  <img
                    src={`${ax.defaults.baseURL.replace("/api", "")}${
                      order.image.url
                    }`}
                    alt={order.tour.tour_name}
                    className="w-32 h-32 object-cover mb-2"
                    onClick={() =>
                      handlePreview(
                        `${ax.defaults.baseURL.replace("/api", "")}${
                          order.image.url
                        }`
                      )
                    }
                  />
                ) : (
                  <p>ไม่มีรูปสลิป</p>
                )}
                <p>{order.tour.tour_name}</p>
                <p>{order.total_price}</p>
                <p>{order.tour.destination}</p>
                <p>
                  ชื่อคนจอง : {order.users_permissions_user.first_name}{" "}
                  {order.users_permissions_user.last_name}
                </p>
                <p>
                  วันที่จอง : {new Date(order.booking_date).toLocaleString()}
                </p>
              </div>
              <div>
                <Select
                  defaultValue={order.booking_status}
                  onChange={(value) =>
                    handleUpdateStatus(order.documentId, value)
                  }
                >
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="confirmed">Confirmed</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
      >
        <img src={previewImage} alt="Preview" className="w-full" />
      </Modal>
    </div>
  );
}

export default Status;
