import React from 'react';

const DescriptionDisplay = ({ description, styles }) => (
  <div style={styles.description}>
    {description}
  </div>
);

export default DescriptionDisplay;