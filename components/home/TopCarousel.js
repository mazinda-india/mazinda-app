import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import Carousel from "../../components/utility/Carousel";
import axios from "axios";

const TopCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await axios.post(
          "https://mazinda.com/api/banner/fetch",
          {
            banner_type: "carousel",
          }
        );
        if (data.success) {
          setBanners(data.banners);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <View
      style={{
        height: 120,
      }}
    >
      {!loading ? (
        <Carousel
          banners={banners}
          image_paths={banners.map((banner) => banner.image)}
          showDotsIndicator={false}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

export default TopCarousel;
