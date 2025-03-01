import React from 'react';
import PropTypes from 'prop-types';

const NavBar = ({ tabs, onTabClick }) => (
    <nav className="bg-white py-2 shadow-md flex justify-center">
        {tabs.map(tab => (
            <div
                key={tab}
                className="mx-4 py-2 px-4 rounded-full bg-gray-100 hover:bg-blue-100 cursor-pointer"
                onClick={() => onTabClick(tab)}
            >
                {tab}
            </div>
        ))}
    </nav>
);

NavBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    onTabClick: PropTypes.func.isRequired,
};

export default NavBar;