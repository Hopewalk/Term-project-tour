import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth.context";
import ax from "../conf/ax";
import { useParams } from "react-router";
import Review from "./Component/Rate&Review";

export default function TripOverview() {
  const { state } = useContext(AuthContext);
  const { documentId } = useParams();
  const [tour, settour] = useState(null);

  const fetchDetail = async () => {
    try {
      const response = await ax.get(`/tours/${documentId}?populate=*`);
      const detail = response.data.data;

      const product = {
        documentId: detail.documentId,
        name: detail.tour_name,
        price: detail.price,
        description: detail.description,
        location: detail.destination,
        start: detail.start_date,
        end: detail.end_date,
        images: detail.image.map((img) => ({
          src: `${ax.defaults.baseURL.replace("/api", "")}${img.url}`,
        })),
        breadcrumbs: [
          { id: 1, name: "Home", href: "/Home" },
          { id: 2, name: "One day trips", href: "/Onedaytrip" },
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

  if (!tour) return <div>ไม่สามารถดูได้</div>;

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {tour.breadcrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
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
            <li className="text-sm">{tour.name}</li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          {tour.images.length > 0 ? (
            tour.images.map((img, index) => (
              <img
                key={index}
                src={img.src}
                className="aspect-[4/5] size-full object-cover sm:rounded-lg lg:aspect-auto"
              />
            ))
          ) : (
            <div>No images available</div>
          )}
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {tour.name}
            </h1>
            {/* Location */}
            <p className="mt-2 text-lg text-gray-600">
              Location: {tour.location}
            </p>

            {/* Start and End Date */}
            <div className="mt-4 text-lg text-gray-600">
              <p>
                <strong>วันเดินทาง:</strong>{" "}
                {new Date(tour.start).toLocaleDateString()}
              </p>
              <p>
                <strong>วันสิ้นสุดการเดินทาง:</strong>{" "}
                {new Date(tour.end).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              {tour.price} ฿
            </p>

            <form className="mt-10">
              <button
                type="button"
                className="w-full bg-blue-600 text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-500"
              >
                จอง
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">{tour.description}</p>
              </div>
            </div>
          </div>
          <Review />
        </div>
      </div>
    </div>
  );
}
