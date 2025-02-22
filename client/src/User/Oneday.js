import React, { useEffect, useState } from "react";
import { Card } from "antd";
import ax from "../conf/ax";
import { useNavigate } from "react-router";

export default function TourCard() {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  const fetchTour = async () => {
    try {
      const response = await ax.get(
        "/tours?populate=*&filters[tour_type][$eq]=One%20Day%20Trip"
      );
      const tourData = response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.tour_name,
        description: item.description,
        start: item.start_date,
        end: item.end_date,
        image: item.image.map((img) => ({
          src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
        })),
        max_participants: item.max_participants,
        price: item.price || "N/A",
      }));
      setTours(tourData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTour();
  }, []);

  const handleClick = (documentId) => {
    navigate(`/Trip/${documentId}`);
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
              {/* Tour Image */}
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

              {/* Tour Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2">{tour.name}</h2>
                </div>
                <p className="text-gray-600 mb-2">{tour.description}</p>

                {/* Tour Date & Price */}
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
                  <button
                    className="w-full md:w-auto mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => handleClick(tour.documentId)}
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
