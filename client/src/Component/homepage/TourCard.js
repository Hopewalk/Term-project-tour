import { Card } from 'antd';

const { Meta } = Card;

const TourCard = ({tour}) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="image" src={tour.image} />}
        >
            <Meta title={tour.name} description={tour.description} />
        </Card>
    );
};

export default TourCard;