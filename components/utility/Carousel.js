import { useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Carousel = ({ banners, image_paths, showDotsIndicator = true }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Get the index of current active item
    const index = scrollPosition / width;

    setActiveIndex(index);
  };

  // Render Dot Indicators
  const renderDotIndicators = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {banners.map((dot, index) => {
          if (activeIndex === index) {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#212325",
                  height: 8,
                  width: 15,
                  borderRadius: 5,
                  marginHorizontal: 6,
                }}
              ></View>
            );
          } else {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: "lightgray",
                  height: 6,
                  width: 6,
                  borderRadius: 5,
                  marginHorizontal: 6,
                }}
              ></View>
            );
          }
        })}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        if (item.link_type === "category") {
          navigation.navigate("Category", {
            category_id: item.category_id,
          });
        } else if (item.link_type === "product") {
          navigation.navigate("Product", {
            category_id: item.category_id,
          });
        } else if (item.link_type === "external_link") {
          Linking.openURL(item.external_link);
        }
      }}
      style={{
        paddingHorizontal: 10,
      }}
    >
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={{
          height: "100%",
          width: width - 20,
        }}
      />
    </Pressable>
  );
  return (
    <View>
      <FlatList
        data={banners}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onScroll={handleScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      {showDotsIndicator && banners.length > 1 ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          {renderDotIndicators()}
        </View>
      ) : null}
    </View>
  );
};

export default Carousel;
