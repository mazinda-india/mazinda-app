import { ImageBackground } from "react-native";
import { FlatList, Text, Pressable, useWindowDimensions } from "react-native";
import { useLocation } from "../../contexts/LocationContext";
import { useNavigation } from "@react-navigation/native";

const Subcategories = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const selectedLocation = useLocation();
  // const foodBakeryVisible = selectedLocation._id === "655f1b9f9f019ff01503fc7b";
  const foodBakeryVisible = false;

  const renderSubcategory = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          if (foodBakeryVisible && item === 1) {
            navigation.navigate("Food And Bakery");
          }
        }}
        style={{
          width: width / 2,
        }}
      >
        <ImageBackground
          source={{
            uri:
              foodBakeryVisible && item === 1
                ? "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/5.png"
                : `https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/${item}.jpg`,
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
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderSubcategory}
        keyExtractor={(item) => item}
        numColumns={2}
        gap={20}
      />
    </>
  );
};

export default Subcategories;
