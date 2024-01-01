import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Navbar from "../components/Navbar";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CheckoutModal from "../components/modals/CheckoutModal";
import axios from "axios";

const ProductScreen = ({ route }) => {
  const { item } = route.params;
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const [addedToCart, setAddedToCart] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const [storeInfo, setStoreInfo] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  const dispatch = useDispatch();
  // const cart = useSelector(state => state.cart.cart)

  const addItemToCart = (item) => {
    dispatch(addToCart({ _id: item._id, quantity: item.quantity }));
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    setCheckoutModalVisible(true);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.post(
        "https://mazinda.com/api/store/fetch-store",
        { storeId: item.storeId }
      );
      setStoreInfo(data.store);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Object.keys(storeInfo).length) {
        const { data } = await axios.post(
          "https://mazinda.com/api/product/fetch-store-products",
          { storeId: storeInfo._id }
        );
        setStoreProducts(data.products);
      }
    })();
  }, [storeInfo]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: "black",
              borderWidth: 1.2,
              paddingVertical: 14,
              borderRadius: 4,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={() => addItemToCart(item)}
          >
            {addedToCart ? (
              <>
                <AntDesign name="checkcircle" size={24} color="black" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "black",
                  }}
                >
                  Added To Cart
                </Text>
              </>
            ) : (
              <>
                <AntDesign name="shoppingcart" size={20} color="black" />
                <Text
                  style={{
                    fontSize: 15,
                    color: "black",
                  }}
                >
                  Add To Cart
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            style={{
              backgroundColor: "black",
              paddingVertical: 15,
              borderRadius: 4,
              paddingHorizontal: 30,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <AntDesign name="doubleright" size={20} color="white" />
            <Text
              style={{
                fontSize: 15,
                color: "white",
                fontWeight: 600,
              }}
            >
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Navbar />

      <ScrollView
        style={{
          marginBottom: 60,
        }}
      >
        <CheckoutModal
          checkoutModalVisible={checkoutModalVisible}
          setCheckoutModalVisible={setCheckoutModalVisible}
          cart={[{ _id: item._id, quantity: 1 }]}
        />

        {/* Image Container View */}
        <View style={{ width: width, height: width, padding: 20 }}>
          <Image
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: item.imagePaths[0],
            }}
          />
        </View>

        {/* Product Name, pricing, mazinda features Container View */}
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
            }}
          >
            {item.productName}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginVertical: 30,
              marginHorizontal: 5,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: 500,
              }}
            >
              ₹{item.pricing.salesPrice}
            </Text>

            <Text
              style={{
                fontSize: 18,
                marginTop: 4,
                textDecorationLine: "line-through",
                color: "gray",
              }}
            >
              ₹{item.pricing.mrp}
            </Text>
            <View
              style={{
                backgroundColor: "#d3ffd8",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRadius: 20,
                height: 20,
              }}
            >
              <Text
                style={{
                  color: "#57e28d",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {String(
                  ((item.pricing.mrp - item.pricing.salesPrice) /
                    item.pricing.mrp) *
                    100
                ).slice(0, 4)}
                % OFF
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 8,
              paddingHorizontal: 4,
              borderRadius: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.mazinda_feature_box}>
              <Image
                style={styles.mazinda_feature_image}
                source={require("../assets/item_desc_icons/delivery_30_min.png")}
              />
              <Text style={styles.mazinda_feature_text}>
                Delivery Within 30 Mins
              </Text>
            </View>

            <View style={styles.mazinda_feature_box}>
              <Image
                style={styles.mazinda_feature_image}
                source={require("../assets/item_desc_icons/instant_refund.png")}
              />

              <Text style={styles.mazinda_feature_text}>Instant Return</Text>
            </View>
            <View style={styles.mazinda_feature_box}>
              <Image
                style={styles.mazinda_feature_image}
                source={require("../assets/item_desc_icons/mazinda_delivered.png")}
              />

              <Text style={styles.mazinda_feature_text}>Mazinda Delivered</Text>
            </View>

            <View style={styles.mazinda_feature_box}>
              <Image
                style={styles.mazinda_feature_image}
                source={require("../assets/item_desc_icons/pay_on_delivery.png")}
              />
              <Text style={styles.mazinda_feature_text}>Pay On Delivery</Text>
            </View>
          </View>
        </View>

        {/* Shop Details */}
        {Object.keys(storeInfo).length ? (
          <View
            style={{
              marginHorizontal: 18,
              borderColor: "lightgray",
              borderWidth: 1,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 15,
            }}
          >
            <View
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                Sold By
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                {storeInfo.storeName.toUpperCase()}
              </Text>

              <TouchableOpacity
                style={{
                  // borderColor: "black",
                  // borderWidth: 1.2,
                  backgroundColor: "black",
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
                onPress={() =>
                  navigation.navigate("Store", { storeInfo, storeProducts })
                }
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  View Shop
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                  }}
                >
                  {storeInfo.followers.length}
                </Text>
                <Text>Followers</Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                  }}
                >
                  {storeProducts?.length}
                </Text>
                <Text>Products</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Product Description */}
        <View>
          {item.description.map((desc, index) => (
            <View
              key={index}
              style={{
                marginHorizontal: 18,
                borderColor: "lightgray",
                borderWidth: 1,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  paddingVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  {desc.heading}
                </Text>
              </View>
              <Text
                style={{
                  marginVertical: 15,
                  fontSize: 17,
                  marginHorizontal: 20,
                }}
              >
                {desc.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  mazinda_feature_box: {
    width: "22%",
    alignItems: "center",
    gap: 10,
  },
  mazinda_feature_image: {
    width: 40,
    height: 40,
  },
  mazinda_feature_text: {
    textAlign: "center",
  },
});
