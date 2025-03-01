import React, { useEffect, useState } from 'react';
import fetchTour from '../TourGrid/fetchTour';
import TourCard from '../TourCard/TourCard';
import Slider from 'react-slick';

// Import the required CSS for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Next Arrow Component
const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                zIndex: 1,
                right: '-50px', // Move arrows outside the slider for better visibility
                transition: 'all 0.3s ease',
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#40a9ff';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', lineHeight: '40px' }}>
            </span>
        </div>
    );
};

// Custom Prev Arrow Component
const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                zIndex: 1,
                left: '-50px', // Move arrows outside the slider
                transition: 'all 0.3s ease',
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#40a9ff';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1890ff';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', lineHeight: '40px' }}>
            </span>
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
                const toursData = await fetchTour(category);
                console.log('Fetched tours:', toursData);
                setTours(Array.isArray(toursData) ? toursData : []);
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
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1, // Scroll one card at a time for smoother UX
        autoplay: true,
        autoplaySpeed: 5000, // Slower autoplay for better user control
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // CSS styles object
    const styles = {
        tourList: {
            backgroundColor: '#fff', // White background for a cleaner look
            padding: '24px 60px', // More padding for breathing room
            overflow: 'visible',
            minHeight: '450px',
        },
        slideWrapper: {
            padding: '0 12px', // Increased gap between cards
            minHeight: '400px', // Taller cards for better visuals
            display: 'flex',
            alignItems: 'stretch', // Ensure cards stretch to the same height
            justifyContent: 'center',
        },
        sliderTrack: {
            display: 'flex',
            alignItems: 'stretch',
            minHeight: '400px',
        },
        slideContent: {
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
        },
        loading: {
            textAlign: 'center',
            padding: '20px',
            fontSize: '18px',
            color: '#666',
        },
        error: {
            textAlign: 'center',
            padding: '20px',
            fontSize: '18px',
            color: '#ff0000',
        },
    };

    if (loading) {
        return <div style={styles.loading}>Loading tours...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!tours || tours.length === 0) {
        return <div style={styles.loading}>No tours available for this category.</div>;
    }

    return (
        <div style={styles.tourList} className="tour-list">
            <Slider
                {...settings}
                className="tour-slider"
                style={{ ...styles.sliderTrack }}
            >
                {tours.map((tour, index) => (
                    <div
                        key={tour.documentId || index}
                        style={styles.slideWrapper}
                        className="slide-item"
                    >
                        <div style={styles.slideContent}>
                            <TourCard tour={tour} />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RenderTours;