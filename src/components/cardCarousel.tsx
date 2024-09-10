import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar } from "@nextui-org/react";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IReview } from '../services/types';
import defaultProfile from "../assets/img/Default_pfp.svg.png";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Rate } from 'antd';

interface CardCarouselProps {
  reviews: IReview[]; 
}

const CardCarousel: React.FC<CardCarouselProps> = ({ reviews }) => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="slider-container m-2">
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index} className="p-2">
              <Card className="max-w-[340px] m-2 shadow-xl min-h-[180px]">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar isBordered radius="full" size="md"  className="bg-black"
                      src={userInfo.profilePicture || defaultProfile}/>
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {review.userId.name}
                      </h4>
                      <Rate disabled defaultValue={review.rating}  style={{ fontSize: '14px' }}  />
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                <p>Rating: {review.rating} / 5</p>
                  <p>{review.review}</p>
                  
                </CardBody>
                <CardFooter className="gap-3">
                  
                </CardFooter>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CardCarousel;
