import { Carousel } from "antd";
import Lottie from "lottie-react";
import headerBlog1 from "../pages/client/blog/headerBlog1.json";
import headerBlog2 from "../pages/client/blog/headerBlog2.json";
import headerBlog3 from "../pages/client/blog/headerBlog3.json";
import headerBlog4 from "../pages/client/blog/headerBlog4.json";

const CarouselAntd = () => {
  return (
    <Carousel autoplay>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Lottie
          animationData={headerBlog3}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Lottie
          animationData={headerBlog2}
          loop
          autoplay
          style={{
            width: "100%",
            height: "750px",
            border: "2px solid black",
            borderRadius: "20px",
          }}
        />
      </div>
      {/* <div>
        <Lottie
          animationData={headerBlog1}
          loop
          autoplay
          style={{
            width: "100%",
            height: "400px",
            border: "2px solid black",
            borderRadius: "20px",
          }}
        />
      </div> */}
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Lottie
          animationData={headerBlog4}
          loop
          autoplay
          style={{
            width: "100%",
            height: "750px",
            border: "2px solid black",
            borderRadius: "20px",
          }}
        />
      </div>
    </Carousel>
  );
};

export default CarouselAntd;
