import React from 'react';

const DropdownButton = ({ displayValue, isOpen, toggleDropdown, styles }) => (
  <button style={styles.dropdownButton} onClick={toggleDropdown}>
    <span>{displayValue}</span>
    <svg
      style={styles.arrow}
      fill="#007bff"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 10l5 5 5-5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  </button>
);

export default DropdownButton;