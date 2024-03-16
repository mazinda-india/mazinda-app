import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";

const CarouselProduct = ({ image_paths, showDotsIndicator = true }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

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
        {image_paths.map((dot, index) => {
          if (activeIndex === index) {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#212325",
                  height: 6,
                  width: 6,
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
      style={{
        paddingHorizontal: 10,
      }}
    >
      <Image
        resizeMode="contain"
        source={{ uri: item }}
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
        data={image_paths}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onScroll={handleScroll}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />

      {showDotsIndicator && image_paths.length > 1 ? (
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

export default CarouselProduct;
