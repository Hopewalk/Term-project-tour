import { Card, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const TourCard = ({ tour }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/Trip/${tour.documentId}`);
  };
  return (
    <Card
      hoverable
      style={{ width: 240, height: 300 }}
      cover={<img alt="image" src={tour.image} />}
      onClick={handleClick}
    >
      <Meta
        title={tour.name}
        description={
          <div>
            {/* Review Section */}
            {tour.reviews.length > 0 && (
              <div>
                <span style={{
                  color: '#faad14',
                  fontSize: 16,
                  width: 16,
                }}>
                  ★
                </span>
                <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 2 }}>
                  {tour.averageRating.toFixed(1)}
                </span>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  ({tour.reviews.length} reviews)
                </div>
              </div>
            )
            }
            {/* Tour Description */}
            <div style={{ marginTop: 8 }}>{tour.description}</div>
          </div>
        }
      />


    </Card >
  );
};

export default TourCard;
