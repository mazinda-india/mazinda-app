import { ImageBackground } from "react-native";
import { FlatList, Text, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";

const Subcategories = ({ foodBakeryVisible }) => {
  const toast = useToast();
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const userLoggedIn = Object.keys(user).length;

  const renderSubcategory = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          if (foodBakeryVisible && item === 1) {
            if (userLoggedIn) {
              navigation.navigate("Food And Bakery");
            } else {
              toast.show("Login now to order your favourite meal");
              navigation.navigate("Login");
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
