import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import ax from "../conf/ax";

export default function Trip_statistic() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTour = async () => {
    try {
      const response = await ax.get("/tours?populate=*");
      const tourData = response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.tour_name,
        type: item.tour_type,
        status: item.tour_status,
        description: item.description,
        image: item.image.map((img) => ({
          src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
        })),
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

  const openEditModal = (tour) => {
    console.log("Editing tour:", tour);
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/Trip/${tour.documentId}`);
  };

  const oneDayTrips = tours.filter((tour) => tour.type === "One Day Trip");
  const packageTrips = tours.filter(
    (tour) => tour.type === "Package with Accommodation"
  );

  const renderTourCard = (tour) => (
    <Card
      key={tour.id}
      className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row gap-20">
        {tour.image.length > 0 ? (
          tour.image.map((img, index) => (
            <img
              key={index}
              src={img.src}
              className="size-full w-60 h-40 object-cover sm:rounded-lg"
            />
          ))
        ) : (
          <div>No images available</div>
        )}

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
            <Button
              className="w-full md:w-auto mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => openEditModal(tour)}
            >
              ดูรายละเอียดการจอง
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="w-full max-w-8xl mx-auto mt-6">
      {tours.length === 0 ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-center text-lg font-semibold mb-4">
              One Day Trip
            </h3>
            {oneDayTrips.length === 0 ? (
              <p className="text-center text-gray-500">ไม่มีข้อมูลทัวร์</p>
            ) : (
              oneDayTrips.map((tour) => renderTourCard(tour))
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-center text-lg font-semibold mb-4">
              Package with Accommodation
            </h3>
            {packageTrips.length === 0 ? (
              <p className="text-center text-gray-500">ไม่มีข้อมูลทัวร์</p>
            ) : (
              packageTrips.map((tour) => renderTourCard(tour))
            )}
          </div>
        </div>
      )}
      {selectedTour && (
        <EditTour
          tour={selectedTour}
          visible={isModalOpen}
          onClose={closeEditModal}
          onUpdate={fetchTour}
        />
      )}
    </div>
  );
}
