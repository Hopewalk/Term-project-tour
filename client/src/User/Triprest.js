import React, { useEffect, useState } from "react";
import { Card } from "antd";
import ax from "../conf/ax";
import { useNavigate } from "react-router";
import PaginationComponent from "../Component/PaginationComponent";

export default function TourCard() {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalTours, setTotalTours] = useState(0);
  const navigate = useNavigate();

  const fetchTour = async (page = 1) => {
    try {
      const response = await ax.get("/tours", {
        params: {
          populate: "*",
          "filters[tour_type][$eq]": "Package with Accommodation",
          "filters[tour_status][$eq]": "available",
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
        },
      });

      console.log("response", response.data.data);

      const tourData = response.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.tour_name,
        description: item.description,
        image:
          item.image?.length > 0
            ? item.image.map((img) => ({
                src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
              }))
            : [{ src: "http://localhost:1337/uploads/example.png" }],
        price: item.price || "N/A",
      }));

      setTours(tourData);
      setTotalTours(response.data.meta.pagination.total);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchTour(currentPage);
  }, [currentPage]);

  const handleClick = (documentId) => {
    navigate(`/Trip/${documentId}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6">
      {tours.length === 0 ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          {tours.map((tour) => (
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
          ))}

          <PaginationComponent
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalTours}
            onChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
}
