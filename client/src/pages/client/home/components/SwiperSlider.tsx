import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.scss";
import { Pagination, Autoplay } from "swiper/modules";

export default function SwiperSlider() {
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/representations-user-experience-interface-design_23-2150104491.jpg?semt=ais_hybrid"
            alt="Slide 1"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/premium-photo/child-learns-english-letters-selective-focus_73944-29718.jpg?semt=ais_hybrid"
            alt="Slide 2"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/close-up-education-economy-objects_23-2149113546.jpg?semt=ais_hybrid"
            alt="Slide 3"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/telephone-directory-table-top-view_23-2149854971.jpg?semt=ais_hybrid"
            alt="Slide 4"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/person-holding-books-with-colorful-reminders-stickers_23-2148851090.jpg?semt=ais_hybrid"
            alt="Slide 5"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/premium-photo/teacher-giving-lesson-her-students_107420-32821.jpg?semt=ais_hybrid"
            alt="Slide 6"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/empowered-business-woman-working-city_23-2149589080.jpg?semt=ais_hybrid"
            alt="Slide 7"
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://img.freepik.com/free-photo/flat-lay-composition-back-school-still-life-elements_23-2148969125.jpg?semt=ais_hybrid"
            alt="Slide 8"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
