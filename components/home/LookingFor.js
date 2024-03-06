import { ActivityIndicator, ImageBackground, Linking } from "react-native";
import { FlatList, Text, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { useState, useEffect } from "react";
import axios from "axios";

const LookingFor = ({ foodBakeryVisible }) => {
  const toast = useToast();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);
  const userLoggedIn = user && Object.keys(user).length;
  const selectedLocation = useSelector((state) => state.location.location);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // const fetchSubcategories = async () => {
  //   setLoading(true);
  //   console.log(selectedLocation._id);
  //   try {
  //     if (selectedLocation && selectedLocation._id) {
  //       const { data } = await axios.post(
  //         `https://mazinda.com/api/fetch-looking-for`,
  //         {
  //           id: selectedLocation._id,
  //         }
  //       );
  //       console.log(data);
  //       if (data.success) {
  //         setSubcategories(data.sections);
  //       }
  //     } else {
  //       // console.error("Selected location or _id is undefined");
  //     }
  //   } catch (error) {
  //     // console.error("Error fetching subcategories:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await axios.post(
          "https://mazinda.com/api/banner/fetch",
          {
            banner_type: "looking-for",
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

  // useEffect(() => {
  //   if (Object.keys(selectedLocation).length) {
  //     fetchSubcategories();
  //   }
  // }, [selectedLocation]);

  const renderBanner = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          if (foodBakeryVisible && index === 0) {
            if (userLoggedIn) {
              navigation.navigate("Food And Bakery");
            } else {
              toast.show("Login now to order your favourite meal");
              navigation.navigate("Login");
            }
          } else {
            if (item.link_type === "category") {
              navigation.navigate("Category", {
                category_id: item.category_id,
              });
            } else if (item.link_type === "product") {
              navigation.navigate("Product", {
                category_id: item.category_id,
              });
            } else if (item.link_type === "external-link") {
              Linking.openURL(item.external_link);
            }
          }
        }}
        style={{
          width: width / 2,
        }}
      >
        <ImageBackground
          source={{
            uri:
              foodBakeryVisible && index === 0
                ? "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/5.png"
                : item.image,
          }}
          resizeMode="contain"
          style={{
            width: width / 2.2,
            height: width / 2.2,
            position: "relative",
          }}
        ></ImageBackground>
      </Pressable>
    );
  };

  return (
    <>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        What are you looking for?
      </Text>
      {!loading ? (
        <FlatList
          data={banners}
          renderItem={renderBanner}
          keyExtractor={(item, index) => index}
          numColumns={2}
          gap={20}
        />
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default LookingFor;
