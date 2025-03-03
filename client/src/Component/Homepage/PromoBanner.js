import React from 'react';
import PropTypes from 'prop-types';

const PromoBanner = ({ message, buttonLabel, onButtonClick }) => (
    <div className="bg-blue-100 py-4 px-8 flex justify-between items-center">
        <p className="text-gray-600 text-lg">{message}</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={onButtonClick}>
            {buttonLabel}
        </button>
    </div>
);

PromoBanner.propTypes = {
    message: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired,
};

export default PromoBanner;