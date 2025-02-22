import { useState, useEffect } from 'react';
import TourCard from "./TourCard";
import ax from '../../conf/ax';


const fetchTour = async () => {
    try {
        const response = await ax.get('/tours?populate=reviews.users_permissions_user&populate=accommodations&populate=bookings&populate=image&populate=tour_categories');
        console.log('response', response.data.data);

        const tourData = response.data.data.map((item) => {
            const reviews = item.reviews || [];
            const totalRatings = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

            return {
                id: item.id,
                documentId: item.documentId,
                name: item.tour_name,
                description: item.description,
                review: reviews,
                price: item.price,
                image: `${ax.defaults.baseURL.replace("/api", "")}${item.image[0].url}`,
                max_participants: item.max_participants,
                category: item.tour_categories[0].category_name,
                averageRating: averageRating.toFixed(1)
            };
        });

        console.log("tourData",tourData);
        return tourData;
    } catch (error) {
        console.error(error)
    }
};

const getPriceRange = (tours, maxPrice) => {
    if (!tours.length) return [0, maxPrice];
    const prices = tours.map(tour => tour.price);
    return [0, Math.max(...prices)];
};

const applyFilters = (tours, selectedFilters) => {
    if (!selectedFilters) return tours;
 
    const ftours = tours
        .filter(tour =>
        (!selectedFilters.priceRange ||
            (tour.price >= selectedFilters.priceRange[0] &&
                tour.price <= selectedFilters.priceRange[1]))
        )
        .filter(tour =>
            !selectedFilters.rating ||
            selectedFilters.rating.length === 0 ||
            selectedFilters.rating.some(rating => rating === Math.floor(tour.averageRating))
        )
        .sort((a, b) => {
            if (selectedFilters.sort === "price-low") return a.price - b.price;
            if (selectedFilters.sort === "price-high") return b.price - a.price;
            return 0;
        });
    console.log("ftours", ftours);
    return ftours
};

const TourGrid = ({ selectedCategory, selectedFilters, setPriceRange, setMaxPrice, selectedRatings }) => {
    const [tour, setTour] = useState([]);
    //console.log("prange", priceRange);
    useEffect(() => {
        try {
            fetchTour().then((tourData) => {
                setTour(tourData);
                //console.log("log", getPriceRange(tourData));
                const mp = getPriceRange(tourData);
                //console.log("mp",mp);
                setMaxPrice(mp[1]);
                setPriceRange(mp);
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    const categoryfilteredTours = selectedCategory
        ? tour.filter((tour) => tour.category === selectedCategory)
        : tour;

    const filteredTours = applyFilters(categoryfilteredTours, selectedFilters);
    
    console.log("tour f", filteredTours);
    console.log("cur fil", categoryfilteredTours, selectedFilters || "\nno filters selected");
    
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {filteredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
            ))}
        </div>
    );
};

export default TourGrid;