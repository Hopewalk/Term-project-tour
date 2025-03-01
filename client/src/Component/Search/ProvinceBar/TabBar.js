import React from 'react';

const TabBar = ({ regionsData, selectedRegion, handleRegionClick, styles, regionDisplayNames }) => (
  <div style={styles.tabBar}>
    {regionsData.map((region) => (
      <button
        key={region.name}
        style={{
          ...styles.tab,
          ...(selectedRegion === region.name ? styles.activeTab : {}),
        }}
        onClick={() => handleRegionClick(region.name)}
      >
        {regionDisplayNames[region.name.toLowerCase()] || region.name}
        {selectedRegion === region.name && (
          <div style={styles.tabIndicator} />
        )}
      </button>
    ))}
  </div>
);

export default TabBar;