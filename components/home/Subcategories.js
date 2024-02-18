import { ActivityIndicator, ImageBackground } from "react-native";
import { FlatList, Text, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { useState, useEffect } from "react";
import axios from "axios";

const Subcategories = ({ foodBakeryVisible }) => {
  const toast = useToast();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);
  const userLoggedIn = user && Object.keys(user).length;
  const selectedLocation = useSelector((state) => state.location.location);

  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubcategories = async () => {
    setLoading(true);
    console.log(selectedLocation._id);
    try {
      if (selectedLocation && selectedLocation._id) {
        const { data } = await axios.post(
          `https://mazinda.com/api/fetch-looking-for`,
          {
            id: selectedLocation._id,
          }
        );
        console.log(data);
        if (data.success) {
          setSubcategories(data.sections);
        }
      } else {
        // console.error("Selected location or _id is undefined");
      }
    } catch (error) {
      // console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(selectedLocation).length) {
      fetchSubcategories();
    }
  }, [selectedLocation]);

  const renderSubcategory = ({ item, index }) => {
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
                categoryName: item.category_id.categoryName,
              });
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

  if (loading) {
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
        <ActivityIndicator size={"small"} />
      </>
    );
  }

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
      <FlatList
        data={subcategories}
        renderItem={renderSubcategory}
        keyExtractor={(item, index) => index}
        numColumns={2}
        gap={20}
      />
    </>
  );
};

export default Subcategories;
