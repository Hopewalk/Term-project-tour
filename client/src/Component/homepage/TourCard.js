import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const TourCard = ({ tour }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/Trip/`);
    };
    return (
        <Card
            hoverable
            style={{ width: 240, height: 300 }}
            cover={<img alt="image" src={tour.image} />}
            onClick={handleClick}
        >
            <Meta title={tour.name} description={tour.description} />
        </Card>
    );
};

export default TourCard;