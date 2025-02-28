import { useState, useEffect } from 'react';
import TourCard from "./TourCard/TourCard";
import PaginationComponent from './PaginationComponent';
import ax from '../conf/ax';
import { data } from 'react-router';

// Fetch tours from API
const fetchTour = async () => {
    try {
        const apiUrl = '/tours';
        const params = {
            'populate[0]': 'reviews.users_permissions_user',
            'populate[1]': 'accommodations',
            'populate[2]': 'bookings',
            'populate[3]': 'image',
            'populate[4]': 'tour_categories',
            'populate[5]': 'regions',
            'pagination[start]': 0,
            'pagination[limit]': 100000
        };

        console.log("Fetching data from API:", ax.defaults.baseURL + apiUrl, "with params:", params);
        const response = await ax.get(apiUrl, { params });

        console.log("response", response.data.data);
        return response.data.data
            .filter(item => item.tour_status === "available")
            .map((item) => {
                const reviews = item.reviews?.map(review => ({
                    id: review.id,
                    rating: review.rating || 0,
                    comment: review.comment || "",
                    user: review.user_permissions_user?.username || "Anonymous"
                })) || [];

                const averageRating = reviews.length
                    ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
                    : 0;

                const bookings = item.bookings?.map(booking => ({
                    id: booking.id,
                    date: booking.booking_date,
                    total_price: booking.total_price,
                    booking_status: booking.booking_status,
                    payment_status: booking.payment_status
                })) || [];

                const categories = item.tour_categories?.map(category => category.category_name) || [];

                const images = item.image?.length > 0
                    ? item.image.map(img => `${ax.defaults.baseURL.replace("/api", "")}${img.url}`)
                    : ["http://localhost:1337/uploads/example.png"];

                const regions = item.regions?.map(region => ({
                    id: region.id,
                    name: region.region,
                    province: region.province
                }))

                return {
                    id: item.id,
                    documentId: item.documentId,
                    name: item.tour_name,
                    status: item.tour_status,
                    description: item.description || "No description",
                    reviews,
                    price: item.price,
                    image: images[0] || "http://localhost:1337/uploads/example.png",
                    max_participants: item.max_participants,
                    categories_name: categories,
                    averageRating,
                    bookings,
                    regions
                };
            });

    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

// Get price range for filtering
const getPriceRange = (tours) => {
    if (!tours.length) return [0, 10000]; // Default max price if no tours exist
    const prices = tours.map(tour => tour.price);
    return [0, Math.max(...prices)];
};

// Apply filters
const applyFilters = (tours, selectedFilters, selectedRegion) => {
    if (!selectedFilters) return tours;
    console.log("fil", selectedFilters);

    return tours
        .filter(tour =>
            !selectedFilters.priceRange ||
            (tour.price >= selectedFilters.priceRange[0] && tour.price <= selectedFilters.priceRange[1])
        )
        .filter(tour =>
            !selectedFilters.rating ||
            selectedFilters.rating.length === 0 ||
            selectedFilters.rating.includes(Math.floor(tour.averageRating))
        )
        .filter(tour =>
            selectedRegion === "all" ||
            tour.regions.some(region => region.name === selectedRegion)
        )
        .sort((a, b) => {
            if (selectedFilters.sort === "price-low") return a.price - b.price;
            if (selectedFilters.sort === "price-high") return b.price - a.price;
            if (selectedFilters.sort === "popular") {
                const countA = a.bookings?.filter(booking => booking.booking_status === "confirmed" && booking.payment_status === "paid").length || 0;
                const countB = b.bookings?.filter(booking => booking.booking_status === "confirmed" && booking.payment_status === "paid").length || 0;
                return countB - countA;
            }
            return 0;
        });
};

const TourGrid = ({ selectedCategory, selectedFilters, setPriceRange, setMaxPrice, searchTerm, selectedRegion }) => {
    const [tours, setTours] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(16);

    useEffect(() => {
        fetchTour().then((tourData) => {
            setTours(tourData);
            const priceRange = getPriceRange(tourData);
            setMaxPrice(priceRange[1]);
            setPriceRange(priceRange);
        }).catch(error => console.error("Error in useEffect:", error));
    }, []);

    const filteredTours = applyFilters(
        selectedCategory ? tours.filter(tour => tour.categories_name.includes(selectedCategory)) : tours,
        selectedFilters,
        selectedRegion
    ).filter(tour =>
        !searchTerm || tour.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * pageSize;
    const displayTours = filteredTours.slice(startIndex, startIndex + pageSize);

    //log
    console.log('data:', startIndex, tours);
    console.log('dptours', displayTours);

    return (
        <div>
            {/*Display tours */}
            < div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' >
                {
                    displayTours.length > 0 ? (
                        displayTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
                    ) : (
                        <p className="text-center col-span-4">No tours available.</p>
                    )
                }
            </div >

            {/*Pagination*/}
            <div className='flex justify-center mt-6'>
                <PaginationComponent
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={filteredTours.length}
                    onChange={(page, newPageSize) => {
                        setCurrentPage(page);
                        setPageSize(newPageSize);
                    }}
                />
            </div>
        </div>
    );
};

export default TourGrid;
