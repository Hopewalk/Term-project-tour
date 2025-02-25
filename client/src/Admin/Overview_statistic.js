import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { useParams, useNavigate } from "react-router";

export default function Overview_statistic() {
  const [tours, setTours] = useState([]);
  const { documentId } = useParams();

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
  }, [documentId]);

  return <div>asds</div>;
}
