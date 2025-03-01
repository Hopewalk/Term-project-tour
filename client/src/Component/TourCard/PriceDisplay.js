import React from 'react';

const PriceDisplay = ({ price, styles }) => (
  <div style={styles.footer}>
    <div style={styles.price}>฿{price.toLocaleString()}</div>
  </div>
);

export default PriceDisplay;