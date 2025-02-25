import { Card } from 'antd';
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
      style={{ width: 280, height: 350 }}
      cover={<img alt="Tour" src={tour.image} />}
      onClick={handleClick}
    >
      <Meta
        title={tour.name}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {tour.reviews.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#faad14', fontSize: 16 }}>★</span>
                <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 4 }}>
                  {tour.averageRating.toFixed(1)}
                </span>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>
                  ({tour.reviews.length} reviews)
                </span>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 14, color: '#555' }}>
              {tour.description}
            </div>
            {/* Container for price */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                ฿{tour.price.toLocaleString()}
              </div>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default TourCard;
