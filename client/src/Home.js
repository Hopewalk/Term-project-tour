import React, { useState, useEffect } from 'react';
import SearchBar from './Component/Search/SearchBar';
import RegionsBar from './Component/Search/RegionsBar';
import RenderTours from './Component/Homepage/RenderTours';
import PromoBanner from './Component/Homepage/PromoBanner';
import NavBar from './Component/Homepage/NavBar';
import ProvincesBar from './Component/Search/ProvinceBar/ProvincesBar';
import { HandRaisedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router';
import ax from './conf/ax';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [tourNames, setTourNames] = useState([]);
  const [filteredTourNames, setFilteredTourNames] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourNames = async () => {
      try {
        const response = await ax.get('/tours', {
          params: {
            'fields[0]': 'tour_name',
            'fields[1]': 'tour_status',
            'fields[2]': 'documentId',
            'populate[0]': 'regions',
            'pagination[start]': 0,
            'pagination[limit]': 100000,
          },
        });
        const names = response.data.data
          .filter(tour => tour.tour_status === "available")
          .map(tour => ({
            name: tour.tour_name,
            documentId: tour.documentId,
            regions: tour.regions.map(region => region.region),
            provinces: tour.regions.map(region => region.province),
            status: tour.tour_status,
          }));
        setTourNames(names);
      } catch (error) {
        console.error("Error fetching tour names:", error);
      }
    };
    fetchTourNames();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChange = (value) => {
    setSearchTerm(value); // Sync searchTerm with input changes
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    setSearchTerm("");
  };

  const handleTabClick = (tab) => {
    console.log(`Tab clicked: ${tab}`);
    switch (tab) {
      case 'Attractions':
        navigate('/Tour');
        break;
      case 'Tours':
        navigate('/Tour');
        break;
      case 'One Day Trip':
        navigate('/Onedaytrip');
        break;
      case 'Package with Acommodation':
        navigate('/Trip&Rest');
        break;
      case 'Provinces':
        navigate('/Tour');
        break;
      case 'All':
        navigate('/Tour');
        break;
      default:
        break;
    }
  };

  const handlePromoButtonClick = () => {
    console.log('Promo button clicked');
  };

  const handleSelection = (location) => {
    setSelectedLocation(location);
    console.log('Selected:', location);
  };

  return (
    <div className="bg-gray-50">
      <header
        className="relative w-full h-96 bg-cover bg-center flex flex-col justify-center items-center text-white bg-gradient-to-b from-black/50 to-black/50"
        style={{ backgroundImage: `url(https://i.pinimg.com/originals/a1/ec/7e/a1ec7e2da8725a41ede055bb0e0fe130.jpg)` }}
      >
        <h1 className="text-5xl font-bold mb-8">Attractions & Tours</h1>
        <div className="flex gap-4 mb-8 w-full max-w-4xl px-4">
          <ProvincesBar onSelect={handleSelection} />
          <SearchBar
            onSearch={handleSearch}
            onChange={handleChange} // Added onChange handler
            searchValue={searchTerm}
            setSearchValue={setSearchTerm}
            tourNames={tourNames}
            filteredTourNames={filteredTourNames}
            setFilteredTourNames={setFilteredTourNames}
          />
        </div>
      </header>
      <NavBar
        tabs={['Attractions', 'Tours', 'One Day Trip', 'Package with Acommodation', 'Provinces', 'All']}
        onTabClick={handleTabClick}
      />
      <PromoBanner
        message="Use Code: TRAVEL2025 for 5% OFF your first order!"
        buttonLabel="Claim"
        onButtonClick={handlePromoButtonClick}
      />
      <section className="py-12 text-center">
        <h2 className="text-3xl mb-8">Top Attractions</h2>
        <div className="w-3/4 mx-auto">
          <RenderTours category="Recommend" />
        </div>
      </section>
    </div>
  );
};

export default Home;