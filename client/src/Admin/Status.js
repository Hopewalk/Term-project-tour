import React, { useEffect, useState } from "react";
import ax from "../conf/ax";
import { Select, Card } from "antd";

function Status() {
  const [orders, setOrders] = useState([]);

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

  return (
    <div>
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Set Status
        </h1>
      </header>
      {orders.map((order) => (
        <Card className="mx-auto max-w-7xl mt-2" title="Order">
          <div key={order.id} className="flex justify-between">
            <div>
              <p>{order.tour.tour_name}</p>
              <p>{order.total_price}</p>
              <p>{order.tour.destination}</p>
              <p>วันที่จอง : {new Date(order.booking_date).toLocaleString()}</p>
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
    </div>
  );
}

export default Status;
