import React from 'react';

const ProvincesSection = ({ provinces, selectedProvince, handleProvinceClick, styles, selectedRegion }) => (
  <div style={styles.provincesSection}>
    {provinces.length > 0 ? (
      provinces.map((province) => (
        <button
          key={province[1]}
          style={{
            ...styles.provinceButton,
            ...(selectedProvince === province[1]
              ? styles.provinceButtonSelected
              : {}),
          }}
          onClick={() => handleProvinceClick(selectedRegion, province[1])}
          onMouseEnter={(e) =>
            Object.assign(e.target.style, styles.provinceButtonHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.target.style, {
              backgroundColor:
                selectedProvince === province[1]
                  ? styles.provinceButtonSelected.backgroundColor
                  : styles.provinceButton.backgroundColor,
              transform: 'scale(1)',
            })
          }
        >
          {province[1]}
        </button>
      ))
    ) : (
      <div>ไม่มีจังหวัดในภูมิภาคนี้</div>
    )}
  </div>
);

export default ProvincesSection;