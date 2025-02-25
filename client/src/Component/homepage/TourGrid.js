import { useState, useEffect } from 'react';
import TourCard from "./TourCard";
import ax from '../../conf/ax';


const fetchTour = async () => {
    try {
        const apiUrl = '/tours';
        const params = {
            'populate[0]': 'reviews.users_permissions_user',
            'populate[1]': 'accommodations',
            'populate[2]': 'bookings',
            'populate[3]': 'image',
            'populate[4]': 'tour_categories',
            'pagination[start]': 0,   // Start from the first item
            'pagination[limit]': 100  // Fetch up to 100 results
        };

        console.log("Fetching data from API:", ax.defaults.baseURL + apiUrl, "with params:", params);

        const response = await ax.get(apiUrl, { params });

        console.log('API Response:', response);

        console.log('Fetched Data:', response.data.data);

        const tourData = response.data.data.map((item) => {
            // reviews
            const reviews = item.reviews?.map((review) => ({
                id: review.id,
                rating: review.rating || 0,
                comment: review.comment || "",
                user: review.user_permissions_user?.username || "Anonymous",
            })) || [];
            const totalRatings = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

            // bookings
            const bookings = item.bookings?.map(booking => ({
                id: booking.id,
                date: booking.booking_date,
                total_price: booking.total_price,
                booking_status: booking.booking_status,
                payment_status: booking.payment_status
            })) || [];

            // categories
            const categories = item.tour_categories?.map(category => ({
                id: category.id,
                name: category.category_name,
                description: category.description || "No description"
            })) || [];
            const categoryName = categories.map(category => category.name);

            // images
            const images = item.image?.map(img => `${ax.defaults.baseURL.replace("/api", "")}${img.url}`) || [];

            return {
                id: item.id,
                documentId: item.documentId,
                name: item.tour_name,
                description: item.description || "no description",
                reviews,
                price: item.price,
                images,
                max_participants: item.max_participants,
                categories_name: categoryName,
                averageRating: parseFloat(averageRating.toFixed(1)),
                bookings
            };
        });

        console.log("Processed tour data:", tourData);
        return tourData;
    } catch (error) {
        console.error("Error fetching data:", error);
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

const TourGrid = ({ selectedCategory, selectedFilters, setPriceRange, setMaxPrice, selectedRatings, setTours }) => {
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
        ? tour.filter((tour) => tour.categories_name.includes(selectedCategory))
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