import {
  Image,
  SafeAreaView,
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
import Carousel from "../components/utility/Carousel";
import { ScrollView } from "react-native-virtualized-view";

const ProductScreen = ({ route }) => {
  const { item } = route.params;

  const variants = item.variants;
  const variantsInfo = item.variantsInfo;

  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const [addedToCart, setAddedToCart] = useState(false);
  const [itemData, setItemData] = useState({
    combinationName: item.combinationName,
    description: item.description,
    imagePaths: item.imagePaths,
    pricing: item.pricing,
    productName: item.productName,
  });
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  const [storeInfo, setStoreInfo] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  const dispatch = useDispatch();

  const handleCombinationChange = (newVarient, index) => {
    let arr = itemData.combinationName.split("-");
    arr[index] = newVarient;
    newCombination = arr.join("-");
    setItemData((prevData) => ({
      ...prevData,
      combinationName: newCombination,
    }));
  };

  useEffect(() => {
    if (variants && Object.keys(variants).length) {
      if (Object.keys(variants).includes(itemData.combinationName)) {
        const { productName, pricing, imagePaths, description } =
          variants[itemData.combinationName];

        setItemData((prevData) => ({
          ...prevData,
          description,
          imagePaths,
          pricing,
          productName,
        }));
      }
    }
  }, [itemData.combinationName]);

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
          borderTopColor: "lightgray",
          borderTopWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            paddingBottom: 36,
            paddingTop: 12,
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: addedToCart ? "green" : "#2e2f34",
              borderWidth: 1.2,
              paddingVertical: 11,
              borderRadius: 4,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
            onPress={() => addItemToCart(item)}
          >
            {addedToCart ? (
              <>
                <AntDesign name="checkcircle" size={20} color="green" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "green",
                  }}
                >
                  Added To Cart
                </Text>
              </>
            ) : (
              <>
                <AntDesign name="shoppingcart" size={20} color="#2e2f34" />
                <Text
                  style={{
                    fontSize: 15,
                    color: "#2e2f34",
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
              backgroundColor: "#2e2f34",
              paddingVertical: 12,
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
          backgroundColor: "#f5f5f5",
        }}
      >
        <CheckoutModal
          checkoutModalVisible={checkoutModalVisible}
          setCheckoutModalVisible={setCheckoutModalVisible}
          cart={[{ _id: item._id, quantity: 1 }]}
        />

        {/* Image Container View */}
        <View
          style={{
            width: width,
            height: width + 80,
            backgroundColor: "white",
          }}
        >
          <Carousel image_paths={itemData.imagePaths} />
        </View>

        <View
          style={{
            backgroundColor: "white",
            padding: 15,
          }}
        >
          {variantsInfo &&
            Object.keys(variantsInfo).map((variantCategory, index) => (
              <View
                style={{
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1,
                  paddingVertical: 12,
                  gap: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {variantCategory.charAt(0).toUpperCase() +
                      variantCategory.slice(1)}
                    :{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {itemData.combinationName.split("-")[index]}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {variantsInfo[variantCategory].map((variant) => (
                    <TouchableOpacity
                      onPress={() => handleCombinationChange(variant, index)}
                      style={{
                        borderWidth: 1,
                        borderColor:
                          itemData.combinationName.split("-")[index] === variant
                            ? "black"
                            : "lightgray",
                        borderRadius: 5,
                        paddingVertical: 9,
                        paddingHorizontal: 15,
                      }}
                    >
                      <Text>{variant}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
        </View>

        {/* Product Name, pricing*/}
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
            }}
          >
            {itemData.productName}
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
              ₹{itemData.pricing.salesPrice}
            </Text>

            <Text
              style={{
                fontSize: 18,
                marginTop: 4,
                textDecorationLine: "line-through",
                color: "gray",
              }}
            >
              ₹{itemData.pricing.mrp}
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
                  ((itemData.pricing.mrp - itemData.pricing.salesPrice) /
                    itemData.pricing.mrp) *
                    100
                ).slice(0, 4)}
                % OFF
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 8,
            marginTop: 8,
            paddingHorizontal: 18,
            paddingVertical: 12,
            justifyContent: "space-between",
            backgroundColor: "white",
          }}
        >
          <View style={styles.mazinda_feature_box}>
            <Image
              style={styles.mazinda_feature_image}
              source={require("../assets/item_desc_icons/delivery_30_min.png")}
            />
            <Text numberOfLines={2} style={styles.mazinda_feature_text}>
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

        {/* Shop Details */}
        {Object.keys(storeInfo).length ? (
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingVertical: 10,
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
                  fontSize: 18,
                  fontWeight: 500,
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
                    fontSize: 15,
                    color: "gray",
                    fontWeight: 600,
                  }}
                >
                  VIEW SHOP
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
                    fontSize: 22,
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
                    fontSize: 22,
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
        <View
          style={{
            marginTop: 8,
          }}
        >
          {itemData.description.map((desc, index) => (
            <View
              key={index}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: "white",
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
                  marginVertical: 18,
                  fontSize: 17,
                  color: "#2e2f34",
                  // marginHorizontal: 5,
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
    width: "20%",
    alignItems: "center",
    gap: 9,
  },
  mazinda_feature_image: {
    width: 35,
    height: 35,
  },
  mazinda_feature_text: {
    textAlign: "center",
    fontSize: 12,
  },
});
