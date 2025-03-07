import React, { useEffect, useState } from "react";
import { getAllAds } from "../../../services/client/ApiServies";
import { Carousel } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./Ads.scss";

interface Ad {
  _id: string;
  title: string;
  image: string;
  link: string;
}

const AdsDetails: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdDetails, setShowAdDetails] = useState<boolean>(true);


  const shuffleArray = (array: Ad[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAllAds();

        if (data && data.data && Array.isArray(data.data)) {
          const randomAds = shuffleArray(data.data); //random ads
          setAds(randomAds);
        } else {
          setError(
            "Dữ liệu không hợp lệ, không có trường 'data' trong đối tượng"
          );
        }
      } catch (error) {
        setError("Không thể tải quảng cáo, vui lòng thử lại");
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleCloseAd = () => {
    setShowAdDetails(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!showAdDetails) {
    return null;
  }

  return (
    <div className="ads-container">
      <button className="close-btn" onClick={handleCloseAd}>
        <CloseOutlined />
      </button>

      {ads.length === 0 ? (
        <div>No ads</div>
      ) : (
        <Carousel
          autoplay
          dots={false}
          effect="fade"
          autoplaySpeed={5000}
          style={{ height: '100%' }}
        >
          {ads.map((ad) => (
            <div key={ad._id} className="ad-item">
              <a href={ad.link} target="_blank" rel="noopener noreferrer">
                <img src={ad.image} alt={ad.title} />
              </a>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default AdsDetails;
