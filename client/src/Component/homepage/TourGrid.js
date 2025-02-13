import { useState, useEffect } from 'react';
import TourCard from "./TourCard";
import ax from '../../conf/ax';

const fetchTour = async () => {
    try {
        const response = await ax.get('/tours?populate=*');
        console.log('response', response.data.data);
        const tourData = response.data.data.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.tour_name,
            description: item.description,
            image: `${ax.defaults.baseURL.replace("/api", "")}${item.image[0].url}`,
            max_participants: item.max_participants,
            category: item.tour_categories[0].category_name
        }))
        console.log('tourData', tourData);
        return tourData;
    } catch (error) {
        console.error(error);
    }
};

const TourGrid = ({ selectedCategory }) => {
    const [tour, setTour] = useState([]);

    useEffect(() => {
        try {
            fetchTour().then((tourData) => setTour(tourData));
        } catch (error) {
            console.error(error);
        }
    }, []);

    const filteredTours = selectedCategory
        ? tour.filter((tour) => tour.category === selectedCategory)
        : tour;
    console.log("tour f", filteredTours)
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
            ))}
        </div>
    );
};

export default TourGrid;