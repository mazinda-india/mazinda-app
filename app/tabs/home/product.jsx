import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import Navbar from "../../../components/Navbar";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  setBuyNowCart,
  updateCartOnServer,
} from "../../../redux/CartReducer";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Carousel from "../../../components/utility/Carousel";
import { ScrollView } from "react-native-virtualized-view";
import { useToast } from "react-native-toast-notifications";
import { router, useLocalSearchParams } from "expo-router";

const ProductScreen = () => {
  const params = useLocalSearchParams();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const [item, setItem] = useState({});

  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart.cart);

  const isLoggedIn = Object.keys(user).length ? true : false;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [storeInfo, setStoreInfo] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);

  const variants = item.variants;
  const variantsInfo = item.variantsInfo;

  const [addedToCart, setAddedToCart] = useState(false);
  const [itemData, setItemData] = useState({
    combinationName: item.combinationName,
    description: item.description,
    imagePaths: item.imagePaths,
    pricing: item.pricing,
    productName: item.productName,
  });

  useEffect(() => {
    if (Object.keys(item).length) {
      setItemData({
        combinationName: item.combinationName,
        description: item.description,
        imagePaths: item.imagePaths,
        pricing: item.pricing,
        productName: item.productName,
      });
    }
  }, [item]);

  const fetchProduct = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `https://mazinda.com/api/product/fetch-product?id=${id}`
      );
      if (data.success) {
        setItem(data.product);
      }
    } catch (err) {
      Alert.alert(
        "Failed to load product",
        "Seems like a network error has occurred. Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.productId) {
      fetchProduct(params.productId);
    }
  }, [params]);

  const handleCombinationChange = async (newVarient, index) => {
    let arr = itemData.combinationName.split("-");
    arr[index] = newVarient;
    newCombination = arr.join("-");
    setItemData((prevData) => ({
      ...prevData,
      combinationName: newCombination,
    }));

    // Fetching the actual product with variant id and combination name

    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/product/fetch-combination-product",
        { variantId: item.variantId, combinationName: newCombination }
      );
      if (data.success) {
        setItem(data.product);
      }
    } catch (err) {
      Alert.alert(
        "Network Error Occurred",
        "Seems like there is an issue with the connectivity"
      );
    }
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
    dispatch(updateCartOnServer(cart));
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleBuyNow = () => {
    if (isLoggedIn) {
      // setCheckoutModalVisible(true);
      // navigation.navigate("Checkout", {
      //   cart: [{ _id: item._id, quantity: 1 }],
      // });
      dispatch(setBuyNowCart([{ _id: item._id, quantity: 1 }]));
      router.push("/checkout");
    } else {
      toast.show("Login Now and Start Placing Orders Now!");
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    if (Object.keys(item).length) {
      (async () => {
        const { data } = await axios.post(
          "https://mazinda.com/api/store/fetch-store",
          { storeId: item.storeId }
        );
        console.log(data);
        setStoreInfo(data.store);
      })();
    }
  }, [item]);

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

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"small"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          gap: 12,
          paddingTop: 15,
          paddingBottom: 25,
          backgroundColor: "white",
          borderTopColor: "lightgray",
          borderTopWidth: 1,
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
      {/* </View> */}

      <Navbar showSearchBar={false} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchProduct(item._id);
              setRefreshing(false);
            }}
          />
        }
        style={{
          marginBottom: 70,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Image Container View */}
        <View
          style={{
            width: width,
            // height: width + 50,
            height: height / 1.8,
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
                key={index}
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
                  {variantsInfo[variantCategory].map((variant, index2) => (
                    <TouchableOpacity
                      key={index2}
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
              source={require("../../../assets/item_desc_icons/delivery_30_min.png")}
            />
            <Text numberOfLines={2} style={styles.mazinda_feature_text}>
              30 Min Delivery
            </Text>
          </View>

          <View style={styles.mazinda_feature_box}>
            <Image
              style={styles.mazinda_feature_image}
              source={require("../../../assets/item_desc_icons/instant_refund.png")}
            />

            <Text style={styles.mazinda_feature_text}>Instant Return</Text>
          </View>
          <View style={styles.mazinda_feature_box}>
            <Image
              style={styles.mazinda_feature_image}
              source={require("../../../assets/item_desc_icons/mazinda_delivered.png")}
            />

            <Text style={styles.mazinda_feature_text}>Mazinda Delivered</Text>
          </View>

          <View style={styles.mazinda_feature_box}>
            <Image
              style={styles.mazinda_feature_image}
              source={require("../../../assets/item_desc_icons/pay_on_delivery.png")}
            />
            <Text style={styles.mazinda_feature_text}>Pay On Delivery</Text>
          </View>
        </View>

        {/* Shop Details */}
        {storeInfo && Object.keys(storeInfo).length ? (
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
                  fontSize: 16,
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
                    fontSize: 17,
                    color: "gray",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {desc.heading.toUpperCase()}
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
