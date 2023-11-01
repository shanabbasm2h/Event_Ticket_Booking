import React, { useState } from "react";
function EventCard({
  title,
  image,
  textTop,
  textBottom,
  isSelected,
  onGetEvent,
}) {
  return (
    <div
      className={`card mb-3 border-0 form-font ${
        isSelected ? "card-selected" : ""
      }`}
      style={{ maxWidth: "540px", cursor: "pointer" }}
      onClick={onGetEvent}
    >
      <div className='row g-0'>
        <div className='col-md-4'>
          <img
            src={image}
            className='img-fluid rounded-start h-100'
            alt='...'
          />
        </div>
        <div className='col-md-8'>
          <div className='card-body'>
            <h5 className='card-title'>{title}</h5>
            <p className='card-text mb-0'>{textTop}</p>
            <p className='card-text'>{textBottom}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
