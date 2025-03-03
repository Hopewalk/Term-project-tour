import React, { useEffect, useState } from 'react';
import fetchTour from '../TourGrid/fetchTour';
import TourCard from '../TourCard/TourCard';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaceSmileIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Custom Next Arrow Component
const NextArrow = ({ className, style, onClick, currentSlide, slideCount, infinite }) => {
    const isDisabled = currentSlide >= slideCount - 1 && !infinite; // Use the passed infinite prop

    return (
        <div
            className={`${className} slick-arrow`}
            style={{
                ...style,
                display: 'flex !important',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDisabled ? '#D1D5DB' : '#4B5EAA',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                zIndex: 100,
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'all 0.3s ease',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                border: '1px solid #E5E7EB',
                opacity: isDisabled ? 0.5 : 1,
                position: 'absolute',
            }}
            onClick={isDisabled ? null : onClick}
            onMouseEnter={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#6B7280';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#4B5EAA';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
            aria-label="Next slide"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isDisabled) onClick();
                }
            }}
        >
            <ChevronRightIcon className="w-6 h-6 text-white" />
        </div>
    );
};

// Custom Prev Arrow Component
const PrevArrow = ({ className, style, onClick, currentSlide, infinite }) => {
    const isDisabled = currentSlide === 0 && !infinite; // Use the passed infinite prop

    return (
        <div
            className={`${className} slick-arrow`}
            style={{
                ...style,
                display: 'flex !important',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDisabled ? '#D1D5DB' : '#4B5EAA',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                zIndex: 100,
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'all 0.3s ease',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                border: '1px solid #E5E7EB',
                opacity: isDisabled ? 0.5 : 1,
                position: 'absolute',
            }}
            onClick={isDisabled ? null : onClick}
            onMouseEnter={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#6B7280';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.backgroundColor = '#4B5EAA';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
            aria-label="Previous slide"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!isDisabled) onClick();
                }
            }}
        >
            <ChevronLeftIcon className="w-6 h-6 text-black" />
        </div>
    );
};

const RenderTours = ({ category }) => {
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const toursData = await fetchTour();
                const filteredTours = toursData.filter(tour => tour.categories_name.includes(category));
                setTours(Array.isArray(filteredTours) ? filteredTours : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching tours:', err);
                setError('Failed to load tours. Please try again later.');
                setTours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, [category]);

    // Slider settings
    const settings = {
        dots: true,
        infinite: tours.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        nextArrow: <NextArrow infinite={tours.length > 4} />,
        prevArrow: <PrevArrow infinite={tours.length > 4} />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: true } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true } },
        ],
        appendDots: dots => (
            <div style={{ bottom: '-40px' }}>
                <ul style={{ margin: '0px' }}> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <button
                style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#D1D5DB',
                    borderRadius: '50%',
                    border: 'none',
                    margin: '0 5px',
                    opacity: '0.5',
                }}
                className="slick-dot"
            />
        ),
    };

    // CSS styles object
    const styles = {
        tourList: {
            backgroundColor: '#f9fafb',
            padding: '32px 60px',
            overflow: 'visible',
            minHeight: '450px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            maxWidth: '100%',
            margin: '0 auto',
        },
        sliderContainer: {
            position: 'relative',
            width: '100%',
            overflow: 'visible',
        },
        slideWrapper: {
            padding: '0 12px',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
        },
        sliderTrack: {
            display: 'flex',
            alignItems: 'stretch',
            position: 'relative',
            minHeight: '400px',
        },
        slideContent: {
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
        },
        loading: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '1.125rem',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        },
        error: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '1.125rem',
            color: '#EF4444',
        },
        empty: {
            textAlign: 'center',
            padding: '40px',
            fontSize: '1.125rem',
            color: '#6B7280',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
        },
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        fetchTour()
            .then(data => {
                const filtered = data.filter(tour => tour.categories_name.includes(category));
                setTours(filtered);
                setLoading(false);
            })
            .catch(() => setError('Failed to load tours.'));
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                <div className="animate-spin w-6 h-6 border-4 border-t-transparent border-gray-500 rounded-full" />
                Loading tours...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                {error}
                <button
                    onClick={handleRetry}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!tours || tours.length === 0) {
        return (
            <div style={styles.empty}>
                <FaceSmileIcon className="w-12 h-12 text-gray-400" />
                <p>No tours available for this category.</p>
                <a href="/explore" className="text-blue-500 hover:underline">Explore other categories</a>
            </div>
        );
    }

    return (
        <div style={styles.tourList} className="tour-list">
            <div style={styles.sliderContainer}>
                <Slider {...settings} className="tour-slider" style={styles.sliderTrack}>
                    {tours.map((tour, index) => (
                        <div key={tour.documentId || `tour-${index}`} style={styles.slideWrapper} className="slide-item">
                            <div style={styles.slideContent} className="hover:scale-105 transition-transform duration-200">
                                <TourCard tour={tour} />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default RenderTours;

// Add custom CSS to override slick defaults
const globalStyles = `
    .slick-arrow {
        display: flex !important;
    }
    .slick-prev, .slick-next {
        top: 50%;
        transform: translateY(-50%);
    }
    .slick-dots {
        bottom: -40px !important;
    }
    .slick-dots li.slick-active button {
        background-color: #4B5EAA !important;
        opacity: 1 !important;
    }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);