import React from 'react';
 // Import the CSS file if using an external stylesheet

const RatingBar = ({ ratings }) => {
  return (
    <div className="rating-bar">
      {Object.keys(ratings)
        .sort((a, b) => b - a) // Sort from 5 stars to 1 star
        .map((star) => (
          <div key={star} className="rating-level">
            <span>
              {star}{' '}
              <span style={{ color: 'yellow' }}>★</span>
            </span>
            <div className="outer">
              <div></div>
            </div>
            <span className="count">{ratings[star] > 0 ? `${ratings[star]} đánh giá` : '0 đánh giá'}</span>
          </div>
        ))}
    </div>
  );
};

export default RatingBar;
