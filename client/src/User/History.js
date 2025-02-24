import React, { useEffect, useState } from "react";
import ax from "../conf/ax";
import { useContext } from "react";
import { AuthContext } from "../context/Auth.context";
import { Card } from "antd";

export default function Historylist() {
  const { state } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const userId = state?.user?.id;

      if (!userId) {
        console.error("User is not logged in.");
        return;
      }

      const response = await ax.get(
        `/bookings?filters[users_permissions_users][id][$eq]=${userId}&populate=*`
      );
      const data = response.data.data;
      console.log(data);
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Booking History
        </h1>
      </header>
      {history.length > 0 ? (
        history.map((booking) => (
          <Card
            key={booking.id}
            className="mx-auto max-w-7xl mt-2"
            title={`${booking.tour.tour_name}`}
            bordered={false}
            style={{ marginBottom: "20px" }}
          >
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>ที่ตั้ง :</strong> {booking.tour.destination}
                </p>
                <p>
                  <strong>ประเภททัวร์ :</strong> {booking.tour.tour_type}
                </p>
                <p>
                  <strong>ราคาทัวร์ :</strong> {booking.tour.price}
                </p>
                <p>
                  <strong>วันจอง :</strong>
                  {new Date(booking.booking_date).toLocaleString()}
                </p>
                <p>
                  <strong>วันที่และเวลาเริ่มทัวร์ :</strong>
                  {new Date(booking.tour.start_date).toLocaleString()}
                  <strong> วันที่และเวลาจบทัวร์ :</strong>
                  {new Date(booking.tour.end_date).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <p>No bookings found for the logged-in user.</p>
      )}
    </div>
  );
}
