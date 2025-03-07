import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth.context";
import ax from "../conf/ax";
import { useParams, useNavigate } from "react-router";
import Review from "./Component/Rate&Review";
import { Table, Modal } from "antd";

export default function TripOverview() {
  const { state } = useContext(AuthContext);
  const { documentId } = useParams();
  const [tour, settour] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDetail = async () => {
    try {
      const response = await ax.get(
        `/tours/${documentId}?populate=time_ranges.bookings&populate=image&populate=reviews&populate=accommodations&populate=tour_categories`
      );
      const detail = response.data.data;

      const timeRanges =
        detail.time_ranges?.map((range) => {
          const confirmedBookings = range.bookings?.filter(
            (booking) => booking.booking_status === "confirmed"
          );
          const totalConfirmedBooked = confirmedBookings
            ? confirmedBookings.reduce(
                (sum, booking) => sum + booking.participant,
                0
              )
            : 0;
          const startDate = range.start_date
            ? new Date(range.start_date)
            : null;
          const endDate = range.end_date ? new Date(range.end_date) : null;

          return {
            start: startDate ? startDate.toLocaleDateString("th-TH") : "N/A",
            end: endDate ? endDate.toLocaleDateString("th-TH") : "N/A",
            max_participants: range.max_participants,
            total_booked: totalConfirmedBooked,
          };
        }) || [];

      let accommodationsInfo = "";
      const tourCategory = detail.tour_type;
      if (tourCategory === "Package with Accommodation") {
        accommodationsInfo =
          detail.accommodations.length > 0
            ? detail.accommodations.map((acc) => acc.name).join(", ")
            : "No accommodation info available";
      } else if (tourCategory === "One Day Trip") {
        accommodationsInfo =
          detail.accommodations[0]?.name || "No accommodation info available";
      }

      const product = {
        documentId: detail.documentId,
        name: detail.tour_name,
        price: detail.price,
        description: detail.description,
        location: detail.destination,
        accomodation: accommodationsInfo,
        time_ranges: timeRanges,
        images: detail.image?.map((img) => ({
          src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
        })),
        breadcrumbs: [
          { id: 1, name: "Home", href: "/Home" },
          {
            id: 2,
            name: detail.tour_categories?.[0]?.category_name || "Unknown",
            href:
              detail.tour_categories?.[0]?.category_name === "One Day Trip"
                ? "/Onedaytrip"
                : detail.tour_categories?.[0]?.category_name ===
                  "Package with Accommodation"
                ? "/Trip&rest"
                : "/OtherCategory",
          },
        ],
      };

      settour(product);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [documentId]);

  const handleBooking = () => {
    if (!state.isLoggedIn) {
      navigate("/Login");
    } else {
      navigate(`/Booking/${documentId}`);
    }
  };

  if (!tour)
    return (
      <div className="text-center text-gray-500 text-xl py-10">
        ไม่สามารถดูได้
      </div>
    );

  const columns = [
    { title: "วันเริ่มเดินทาง", dataIndex: "start", key: "start" },
    { title: "วันสิ้นสุด", dataIndex: "end", key: "end" },
    {
      title: "จำนวนที่รองรับ",
      dataIndex: "max_participants",
      key: "max_participants",
    },
    { title: "จำนวนคนจอง", dataIndex: "total_booked", key: "total_booked" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {tour.breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.id || index}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-sm font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    fill="currentColor"
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li key="tour-name" className="text-sm">
              {tour.name}
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-8 max-w-7xl px-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...tour.images]
              .slice(-3)
              .reverse()
              .map((img, index) => (
                <div
                  key={index}
                  className="relative h-64 w-full overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={img.src}
                    alt={`Tour image ${index + 1}`}
                    className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            {tour.images?.length > 3 && (
              <div
                className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-lg font-semibold">
                  See All {tour.images.length} Photos
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
              {tour.name}
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              จุดหมายปลายทาง: {tour.location}
            </p>
            <p className="mt-3 text-lg text-gray-600">
              ที่พัก: {tour.accomodation}
            </p>

            {/* Description */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900">Description</h3>
              <div className="mt-4 prose prose-lg text-gray-700">
                <p>{tour.description}</p>
              </div>
            </div>

            {/* Time ranges table - Moved below Description */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900">
                ช่วงเวลาเดินทาง
              </h3>
              <Table
                columns={columns}
                dataSource={tour.time_ranges.map((item, index) => ({
                  ...item,
                  key: `timeRange-${index}`,
                }))}
                pagination={false}
                className="mt-4 shadow-sm rounded-lg overflow-hidden"
                rowClassName="hover:bg-gray-100 transition-colors"
              />
            </div>
          </div>

          {/* Booking section */}
          <div className="mt-8 lg:mt-0 lg:row-span-3">
            <p className="text-4xl font-bold text-gray-900 tracking-tight">
              {tour.price} ฿
            </p>

            <form className="mt-10">
              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 text-lg font-semibold"
                onClick={handleBooking}
              >
                จองทริปนี้
              </button>
            </form>
          </div>
          <div className="mt-12 lg:col-span-3">
            <Review />
          </div>
        </div>
      </div>

      {/* Modal for all photos */}
      <Modal
        title={
          <span className="text-xl font-semibold text-gray-900">
            All Photos
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        className="rounded-lg"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
          {tour.images
            .slice()
            .reverse()
            .map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={`Tour image ${index + 1}`}
                className="h-48 w-full object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              />
            ))}
        </div>
      </Modal>
    </div>
  );
}
