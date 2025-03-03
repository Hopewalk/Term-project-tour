import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './TourCardStyles';

const { Meta } = Card;

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/Trip/${tour.documentId}`);

  // Count the number of confirmed and paid bookings
  const confirmedBookings = tour.bookings.filter(
    (booking) => booking.booking_status === "confirmed" && booking.payment_status === "paid"
  ).length;

  return (
    <Card
      hoverable
      style={styles.card}
      cover={<img alt={tour.name} src={tour.image} style={styles.image} />}
      onClick={handleClick}
    >
      <Meta
        title={<div style={styles.title}>{tour.name}</div>}
        description={
          <div style={styles.content}>
            {confirmedBookings > 0 && (
              <div style={styles.reviews}>
                <span style={styles.star}>★</span>
                <span style={styles.rating}>
                  {tour.reviews.length > 0 ? tour.averageRating.toFixed(1) : "0"}
                </span>
                <span style={styles.reviewCount}>
                  {tour.reviews.length > 0
                    ? `(${tour.reviews.length} reviews)`
                    : "(No reviews yet)"}
                  {confirmedBookings > 0 && ` ${confirmedBookings} bookings`}
                </span>
              </div>
            )}
            <div style={styles.description}>
              {tour.description}
            </div>
            <div style={styles.footer}>
              <div style={styles.price}>฿{tour.price.toLocaleString()}</div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default TourCard;