import React, { useState } from 'react';
import SearchBar from './Component/Search/SearchBar';
import RegionsBar from './Component/Search/RegionsBar';
import RenderTours from './Component/Homepage/RenderTours';
import PromoBanner from './Component/Homepage/PromoBanner';
import NavBar from './Component/Homepage/NavBar';
import ProvincesBar from './Component/Search/ProvinceBar/ProvincesBar';
import { HandRaisedIcon } from '@heroicons/react/24/outline';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [tourNames, setTourNames] = useState([]);
    const [filteredTourNames, setFilteredTourNames] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleRegionChange = (value) => {
        setSelectedRegion(value);
        setSearchTerm(""); // Clear search value when region changes
    };

    const handleTabClick = (tab) => {
        console.log(`Tab clicked: ${tab}`);
        // Add logic to handle tab click if needed
    };

    const handlePromoButtonClick = () => {
        console.log('Promo button clicked');
        // Add logic to handle promo button click if needed
    };

    const handleSelection = (location) => {
        setSelectedLocation(location);
        console.log('Selected:', location); // Example: ["northeastern", "อำนาจเจริญ"]
    };

    return (
        <div className="bg-gray-50">
            <header
                className="relative w-full h-96 bg-cover bg-center flex flex-col justify-center items-center text-white bg-gradient-to-b from-black/50 to-black/50"
                style={{ backgroundImage: `url(https://i.pinimg.com/originals/a1/ec/7e/a1ec7e2da8725a41ede055bb0e0fe130.jpg` }}>
                <h1 className="text-5xl font-bold mb-8">Attractions & Tours</h1>
                <div className="flex gap-4 mb-8 w-full max-w-4xl px-4">
                    <ProvincesBar onSelect={handleSelection} />
                    <SearchBar
                        onSearch={handleSearch}
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
                    <RenderTours category="One Day Trip" />
                </div>
            </section>
        </div>
    );
};

export default Home;