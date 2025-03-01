const applyFilters = (tours, selectedFilters, selectedRegion) => {
    if (!selectedFilters) return tours;
    console.log("fil", selectedFilters);
  
    return tours
      .filter(tour =>
        !selectedFilters.priceRange ||
        (tour.price >= selectedFilters.priceRange[0] && tour.price <= selectedFilters.priceRange[1])
      )
      .filter(tour =>
        !selectedFilters.rating ||
        selectedFilters.rating.length === 0 ||
        selectedFilters.rating.includes(Math.floor(tour.averageRating))
      )
      .filter(tour =>
        selectedRegion === "all" ||
        tour.regions.some(region => region.name === selectedRegion)
      )
      .sort((a, b) => {
        if (selectedFilters.sort === "price-low") return a.price - b.price;
        if (selectedFilters.sort === "price-high") return b.price - a.price;
        if (selectedFilters.sort === "popular") {
          const countA = a.bookings?.filter(booking => booking.booking_status === "confirmed" && booking.payment_status === "paid").length || 0;
          const countB = b.bookings?.filter(booking => booking.booking_status === "confirmed" && booking.payment_status === "paid").length || 0;
          return countB - countA;
        }
        return 0;
      });
  };
  
  export default applyFilters;