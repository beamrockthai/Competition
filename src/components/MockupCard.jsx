// MockupCard.jsx
import React from "react";
import { Card } from "antd";
const { Meta } = Card;

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image5 from "../assets/image5.jpg";
import image from "../assets/image 10.jpg";

const mockupData = [
  {
    image: image,
    title: "Energy Run 2025",
    description: "วิ่งให้สุดพลัง พร้อมพิชิตรางวัลแห่งความฟิต!",
  },
  {
    image: image,
    title: "Street Basketball Showdown",
    description: "รวมดาวบาสสายสตรีท ประลองฝีมือใต้แสงไฟ!",
  },
  {
    image: image,
    title: "Champions Football Cup",
    description: "ศึกฟุตบอลระดับชุมชน ใครจะครองแชมป์ปีนี้?",
  },
  {
    image: image1,
    title: "Extreme Bike Challenge",
    description: "ปั่นสนุกสุดขอบสนาม ปะทะนักปั่นระดับเทพ!",
  },
  {
    image: image1,
    title: "Volleyball Smash Battle",
    description: "ศึกลูกยางสะเทือนสนาม ทีมไหนจะเป็นหนึ่ง!",
  },
  {
    image: image1,
    title: "Teen Tennis League",
    description: "ดวลแร็กเกตสุดมันส์ เปิดโอกาสสู่มือโปร!",
  },
  {
    image: image1,
    title: "Muay Thai Spirit",
    description: "ศิลปะมวยไทย สะท้อนความแข็งแกร่งของไทยแท้!",
  },
];

const MockupCard = () => {
  const RenderCard = ({ image, title, description }) => (
    <Card
      hoverable
      style={{ width: "100%", borderRadius: "10px" }}
      cover={
        <img
          alt={title}
          src={image}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        />
      }
      bodyStyle={{ padding: "16px" }}
    >
      <Meta title={title} description={description} />
    </Card>
  );

  return (
    <div style={{ padding: "20px" }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {mockupData.map((item, index) => (
          <SwiperSlide key={index}>
            <RenderCard
              image={item.image}
              title={item.title}
              description={item.description}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MockupCard;
