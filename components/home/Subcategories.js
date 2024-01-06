import { ImageBackground } from "react-native";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const Subcategories = () => {
  const { width } = useWindowDimensions();

  const renderSubcategory = ({ item }) => {
    return (
      <View
        style={{
          width: width / 2,
        }}
      >
        <ImageBackground
          source={{
            uri: `https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/${item}.jpg`,
          }}
          resizeMode="contain"
          style={{
            width: width / 2.2,
            height: width / 2.2,
            position: "relative",
          }}
        ></ImageBackground>
      </View>
    );
  };

  return (
    <>
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
