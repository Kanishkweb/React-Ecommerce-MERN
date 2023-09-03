import React from 'react'
import profilePng from "../../images/Profile.png"
import ReactStars from "react-rating-stars-component"
import "./Review.css"
const ReviewCard = ({review}) => {
    const options = {
        edit:false,
        color:"rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20:25,
        value: review.rating,
        ifHalf: true,
      };
  return (
    <div className='ReviewCard'>
        <img alt='user' src={profilePng} />
        <p>{review.name}</p>
        <p>{review.comment}</p>
        <ReactStars {...options}/>
    </div>
  )
}

export default ReviewCard