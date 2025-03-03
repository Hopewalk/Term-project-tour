import React, { useState, useEffect, useRef } from 'react';
import ax from '../../../conf/ax';
import DropdownButton from './DropdownButton';
import TabBar from './TabBar';
import ProvincesSection from './ProvincesSection';

const fetchRegions = async () => {
  try {
    const apiUrl = '/regions';
    const params = {
      'pagination[start]': 0,
      'pagination[limit]': 100000,
    };
    const response = await ax.get(apiUrl, { params });
    return response.data.data.map((item) => ({
      region: item.region,
      province: item.province,
    }));
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
};

const ProvincesBar = ({ onSelect }) => {
  const [regionsData, setRegionsData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      width: '300px',
      paddingLeft: '10px',
    },
    dropdownButton: {
      width: '100%',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
      color: selectedProvince ? '#333' : '#999',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    arrow: {
      width: '16px',
      height: '16px',
      transition: 'transform 0.2s',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: '0',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 1000,
      display: isOpen ? 'block' : 'none',
      padding: '10px',
      width: '806px',
      marginLeft: '10px',
    },
    tabBar: {
      display: 'flex',
      justifyContent: 'space-around',
      borderBottom: '1px solid #ddd',
      marginBottom: '10px',
    },
    tab: {
      padding: '8px 16px',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      position: 'relative',
      outline: 'none',
      flex: '1',
      textAlign: 'center',
    },
    activeTab: {
      color: '#333',
      fontWeight: 'bold',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: '-1px',
      left: '10%',
      right: '10%',
      height: '2px',
      backgroundColor: '#f5a623',
    },
    provincesSection: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '10px 0',
      gap: '10px',
      justifyContent: 'flex-start',
      width: '100%',
    },
    provinceButton: {
      flex: '1 1 100px',
      minWidth: '100px',
      maxWidth: '120px',
      padding: '8px 8px',
      fontSize: '12px',
      color: '#333',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      textAlign: 'center',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.2',
    },
    provinceButtonHover: {
      backgroundColor: '#e0e0e0',
      transform: 'scale(1.02)',
    },
    provinceButtonSelected: {
      backgroundColor: '#007bff',
      color: 'white',
      borderColor: '#007bff',
    },
  };

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoading(true);
        const regions = await fetchRegions();
        const regionsMap = {};
        regions.forEach((item) => {
          const regionName = item.region;
          const province = item.province;
          if (!regionsMap[regionName]) {
            regionsMap[regionName] = new Set();
          }
          regionsMap[regionName].add(province);
        });
        const regionOrder = ['northern', 'northeastern', 'central', 'southern'];
        const processedRegionsData = Object.keys(regionsMap)
          .map((regionName) => ({
            name: regionName,
            provinces: Array.from(regionsMap[regionName])
              .sort((a, b) => a.localeCompare(b, 'th'))
              .map((province) => [regionName.toLowerCase(), province]),
          }))
          .sort((a, b) => regionOrder.indexOf(a.name) - regionOrder.indexOf(b.name));
        setRegionsData(processedRegionsData);
        if (processedRegionsData.length > 0) {
          setSelectedRegion(processedRegionsData[0].name);
        }
      } catch (error) {
        console.error('Error processing regions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedProvince(null);
  };

  const handleProvinceClick = (region, province) => {
    setSelectedProvince(province);
    setIsOpen(false);
    const regionLowerCase = region.toLowerCase();
    onSelect([regionLowerCase, province]);
    window.open(`/tour/${regionLowerCase}/${province.toLowerCase()}`, '_blank'); // Open new window
  };

  if (loading) return <div>Loading...</div>;
  if (regionsData.length === 0) return <div>No regions available.</div>;

  const regionDisplayNames = {
    all: 'ทั้งหมด',
    northeastern: 'ภาคตะวันออกเฉียงเหนือ',
    central: 'ภาคกลาง',
    southern: 'ภาคใต้',
    northern: 'ภาคเหนือ',
  };

  const displayValue = selectedProvince
    ? `${regionDisplayNames[selectedRegion.toLowerCase()] || selectedRegion} - ${selectedProvince}`
    : 'เลือกภาคและจังหวัด';

  const selectedRegionData = regionsData.find((region) => region.name === selectedRegion);
  const provinces = selectedRegionData ? selectedRegionData.provinces : [];

  return (
    <div style={styles.container} ref={dropdownRef}>
      <DropdownButton
        displayValue={displayValue}
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        styles={styles}
      />
      <div style={styles.dropdownMenu}>
        <TabBar
          regionsData={regionsData}
          selectedRegion={selectedRegion}
          handleRegionClick={handleRegionClick}
          styles={styles}
          regionDisplayNames={regionDisplayNames}
        />
        <ProvincesSection
          provinces={provinces}
          selectedProvince={selectedProvince}
          handleProvinceClick={handleProvinceClick}
          styles={styles}
          selectedRegion={selectedRegion}
        />
      </div>
    </div>
  );
};

export default ProvincesBar;