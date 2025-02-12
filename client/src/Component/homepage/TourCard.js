import { useState, useEffect } from 'react';
import { Card } from 'antd';
import { conf, UrlPrefix } from '../../conf/main';
import ax from '../../conf/ax';

const { Meta } = Card;

const fetchTour = async () => {
    try {
        const response = await ax.get('/tours?populate=image');
        console.log('response',response.data.data);
        const tourData = response.data.data.map((item) => ({
            id:item.id,
            documentId:item.documentId,
            name: item.tour_name,
            description: item.description,
            image: `${UrlPrefix}${item.image[0].url}`,
            max_participants: item.max_participants,
        }))
        console.log('tourData',tourData);
        return tourData;
    } catch (error) {
        console.error(error);
    }
};

const TourCard = () => {
    const [tour, setTour] = useState([]);

    useEffect(() => {
        try {
            fetchTour().then((tourData) => setTour(tourData));
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tour.map((item) => (
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={item.image} />}
                >
                    <Meta title={item.name} description={item.description} />
                </Card>
            ))}
        </div>
    );
};

export default TourCard;