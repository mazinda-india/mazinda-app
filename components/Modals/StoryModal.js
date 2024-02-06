import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  View,
  Modal,
  Text,
  SafeAreaView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";

import MazindaLogo from "../../assets/logo/logo_mazinda.png";

const StoryModal = ({ showStoryModal, setShowStoryModal, vendorStories }) => {
  const [stories, setStories] = useState([...vendorStories]);
  const [addedToCart, setAddedToCart] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();
  const [current, setCurrent] = useState(0);

  const addItemToCart = () => {
    dispatch(
      addToCart({
        _id: stories[current].product._id,
        quantity: stories[current].product.quantity,
      })
    );
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleScroll = (event) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Get the index of current active item
    const index = scrollPosition / width;

    setCurrent(index);
  };

  const renderDotIndicators = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {stories.map((dot, index) => {
          if (current === index) {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: "#212325",
                  height: 10,
                  width: 20,
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
                  height: 10,
                  width: 10,
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

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          flexDirection: "column",
          maxWidth: width,
        }}
      >
        <Image
          resizeMode="contain"
          source={{ uri: item.product.imagePaths[0] }}
          style={{
            height: height / 2.5,
            width: width - 20,
          }}
        />
        <View
          style={{
            paddingHorizontal: 40,
            marginTop: 25,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 24,
              color: "#00000099",
            }}
            numberOfLines={1}
          >
            {item.product.productName}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 35,
              }}
              numberOfLines={1}
            >
              ₹
              {item.product.pricing.salesPrice -
                (item.product.pricing.costPrice - item.specialPrice)}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
                textDecorationLine: "line-through",
                color: "gray",
                alignSelf: "flex-end",
              }}
              numberOfLines={1}
            >
              ₹{item.product.pricing.mrp}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              marginTop: 10,
              borderRadius: 30,
            }}
          >
            <Text
              style={{
                fontWeight: 600,
                color: "#14be47",
                fontSize: 27,
              }}
            >
              {String(
                ((item.product.pricing.mrp -
                  (item.product.pricing.salesPrice -
                    (item.product.pricing.costPrice - item.specialPrice))) /
                  item.product.pricing.mrp) *
                  100
              ).slice(0, 4)}
              % Off
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={showStoryModal} animationType="fade">
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Image
              source={MazindaLogo}
              style={{
                width: 100,
                height: undefined,
                aspectRatio: 3 / 1,
              }}
              resizeMode="contain"
            />

            <TouchableOpacity onPress={() => setShowStoryModal(false)}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* <View
            style={{
              width,
              justifyContent: "space-evenly",
              flexDirection: "row",
              gap: 5,
            }}
          >
            {stories.map((story, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: current > index ? "#FFA500" : "#FFA50030",
                }}
              ></View>
            ))}
          </View> */}

          <View
            style={{
              width: width,
            }}
          >
            <FlatList
              data={stories.map((story) => story)}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              onScroll={handleScroll}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        <View
          style={{
            gap: 20,
            position: "absolute",
            bottom: 35,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 20,
            }}
          >
            {renderDotIndicators()}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowStoryModal(false);
                navigation.navigate("Product", {
                  item: stories[current].product,
                });
              }}
              style={{
                backgroundColor: "#ececec",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                width: width / 2.5,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                VIEW PRODUCT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addItemToCart()}
              style={{
                backgroundColor: "#ececec",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                width: width / 2.5,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                {addedToCart ? "ADDED TO CART" : "ADD TO CART"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ) : null} */}

        {/* View for left right touch */}
        {/* <View
          style={{
            width,
            height,
            position: "absolute",
            top: 110,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (current) {
                setCurrent(current - 1);
              }
            }}
            style={{
              width: "40%",
              height: "100%",
            }}
          ></TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (current !== stories.length - 1) {
                setCurrent(current + 1);
              } else {
                setShowStoryModal(false);
              }
            }}
            style={{
              width: "40%",
              height: "100%",
            }}
          ></TouchableOpacity>
        </View> */}
      </SafeAreaView>
    </Modal>
  );
};

export default StoryModal;
