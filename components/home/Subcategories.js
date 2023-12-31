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
          padding: 10,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={{
            uri: `https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/square-four-images/${item}.jpg`,
          }}
          resizeMode="cover"
          style={{
            width: width / 2.35,
            height: width / 2.35,
            borderColor: "lightgray",
            borderWidth: 1,
            position: "relative",
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              backgroundColor: "black",
              width: "100%",
              height: 30,
              opacity: 0.5,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: 700,
                marginHorizontal: 7,
              }}
            >
              View More {" >"}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          What are you looking for ?
        </Text>

        <TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              textDecorationLine: "underline",
              marginRight: 10,
            }}
          >
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderSubcategory}
        keyExtractor={(item) => item}
        numColumns={2}
        style={{
          marginTop: 10,
        }}
      />
    </>
  );
};

export default Subcategories;
