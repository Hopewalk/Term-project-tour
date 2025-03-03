const styles = {
    card: {
      width: 280,
      height: 350,
      display: 'flex',
      flexDirection: 'column',
    },
    image: {
      height: 150,
      objectFit: 'cover',
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    reviews: {
      display: 'flex',
      alignItems: 'center',
    },
    star: {
      color: '#faad14',
      fontSize: 16,
    },
    rating: {
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    reviewCount: {
      fontSize: 12,
      color: '#888',
      marginLeft: 6,
    },
    description: {
      marginTop: 8,
      fontSize: 14,
      color: '#555',
      height: 46,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    footer: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 8,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginTop: 16,
    },
  };
  
  export default styles;