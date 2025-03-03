import React from 'react';

const ReviewSection = ({ confirmedBookings, tour, styles }) => (
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
);

export default ReviewSection;