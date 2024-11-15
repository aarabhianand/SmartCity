import React from 'react';
import ReactStars from 'react-rating-stars-component';

const StarRating = ({ rating }) => {
    return (
        <ReactStars
            count={5}
            value={rating / 1} // Assuming rating is out of 5
            size={24}
            activeColor="#ffd700"
            edit={false}
            isHalf={true}
        />
    );
};

export default StarRating;
