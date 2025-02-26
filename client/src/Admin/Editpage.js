import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import ax from "../conf/ax";
import EditTour from "./Component/Edit-trip";

export default function TourCard() {
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
        status: item.tour_status,
        description: item.description,
        start: item.start_date,
        end: item.end_date,
        image:
          item.image?.length > 0
            ? item.image.map((img) => ({
              src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
            }))
            : [{ src: "http://localhost:1337/uploads/example.png" }],
        max_participants: item.max_participants,
        price: item.price || "N/A",
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

  const deleteTour = async (documentId, name) => {
    const isConfirmed = window.confirm(`แน่ใจหรือไม่ว่าต้องการลบทัวร์:${name}`);
    if (!isConfirmed) return;
    try {
      await ax.delete(`/tours/${documentId}`);
      console.log("Deleted tour successfully");
      setTours(tours.filter((tour) => tour.documentId !== documentId));
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };
  const openEditModal = (tour) => {
    console.log("Editing tour:", tour);
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6">
      {tours.length === 0 ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        tours.map((tour) => (
          <Card
            key={tour.id}
            className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-20">
              {tour.image.length > 0 ? (
                <img
                  src={tour.image[tour.image.length - 1].src}
                  className="size-full w-60 h-40 object-cover sm:rounded-lg"
                  alt="Tour Image"
                />
              ) : (
                <div>No images available</div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2">{tour.name}</h2>
                </div>
                <p className="text-gray-600 mb-2">{tour.description}</p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 border-t">
                  <div className="flex flex-row gap-20">
                    <div>
                      <p className="text-gray-600">เริ่มเดินทาง</p>
                      <p className="font-medium">
                        {new Date(tour.start).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">สิ้นสุดการเดินทาง</p>
                      <p className="font-medium">
                        {new Date(tour.end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <p className="text-sm text-gray-600">ราคาเริ่มต้น</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tour.price} ฿
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">สถานะ</p>
                    <p className="font-medium">{tour.status}</p>
                  </div>
                  <Button
                    className="w-full md:w-auto mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => openEditModal(tour)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="w-full md:w-auto mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => deleteTour(tour.documentId, tour.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
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
