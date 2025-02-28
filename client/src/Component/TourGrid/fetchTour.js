import ax from '../../conf/ax';

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

export default fetchTour;