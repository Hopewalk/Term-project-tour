import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

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
            {tour.reviews.length > 0 & confirmedBookings > 0 && (
              <div style={styles.reviews}>
                <span style={styles.star}>★</span>
                <span style={styles.rating}>{tour.averageRating.toFixed(1)}</span>
                <span style={styles.reviewCount}>({tour.reviews.length} reviews)</span>
              </div>
            )}

            <div style={styles.description}>{tour.description}</div>

            {/* Display confirmed bookings count */}
            {confirmedBookings > 0 && (
              <div>
                <span style={styles.booking}>({confirmedBookings} bookings)</span>
              </div>
            )}

            <div style={styles.footer}>
              <div style={styles.price}>฿{tour.price.toLocaleString()}</div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

const styles = {
  card: {
    width: 280,
    height: 350,
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 150,
    objectFit: 'cover',
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  reviews: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    color: '#faad14',
    fontSize: 16,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#888',
    marginLeft: 6,
  },
  booking: {
    fontSize: 12,
    color: '#888',
    marginTop: 'auto'
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    height: 48,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
  },
};

export default TourCard;
