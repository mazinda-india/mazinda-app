import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useState, useEffect, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import {
  decrementQuantity,
  incrementQuantity,
  updateCartOnServer,
} from "../redux/CartReducer";
import AuthModal from "../components/modals/auth/AuthModal";

const CartScreen = () => {
  // const toast = useToast();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = Object.keys(user).length;

  const [continueClicked, setContinueClicked] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const [itemData, setItemData] = useState([]);
  const [itemDataLoading, setItemDataLoading] = useState(true);
  const [pricing, setPricing] = useState({
    total_mrp: 0,
    total_salesPrice: 0,
    total_costPrice: 0,
    service_charge: 0,
    delivery_fees: 0,
    additional_discount: 0,
  });

  const fetchPricing = (cart) => {
    let total_mrp = 0;
    let total_salesPrice = 0;
    let total_costPrice = 0;

    if (cart) {
      cart.forEach((item) => {
        total_mrp += parseFloat(item.pricing.mrp) * item.quantity;
        total_salesPrice += parseFloat(item.pricing.salesPrice) * item.quantity;
        total_costPrice += parseFloat(item.pricing.costPrice) * item.quantity;
      });
    }

    setPricing({
      ...pricing,
      total_mrp,
      total_salesPrice,
      total_costPrice,
    });
  };

  useEffect(() => {
    (async () => {
      const itemDataPromises = cart.map(async (item) => {
        const { data } = await axios.post(
          `https://mazinda.com/api/product/fetch-product?id=${item._id}`
        );
        return { ...data.product, quantity: item.quantity };
      });

      const fetchedItemData = await Promise.all(itemDataPromises);
      setItemData(fetchedItemData);
      fetchPricing(fetchedItemData);
      setItemDataLoading(false);
    })();
  }, [cart]);

  useEffect(() => {
    if (continueClicked && isLoggedIn) {
      navigation.navigate("Checkout", { cart });
    }
  }, [isLoggedIn, continueClicked]);

  if (itemDataLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Navbar />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"small"} />
        </View>
      </SafeAreaView>
    );
  }

  if (!Object.keys(itemData).length && !itemDataLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Navbar />

        <Image
          source={require("../assets/vectors/empty_cart.png")}
          style={{
            width: "100%",
            height: height / 3,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            textAlign: "center",
            fontWeight: 400,
            fontSize: 23,
            marginTop: height / 20,
          }}
        >
          Your Shopping Cart Is Empty
        </Text>

        <Text
          numberOfLines={2}
          style={{
            textAlign: "center",
            marginTop: 15,
            fontSize: 18,
            color: "#6b7280",
            marginHorizontal: 10,
          }}
        >
          Your cart looks empty, time to fill it with some amazing finds.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", position: "relative" }}
    >
      <Navbar />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#b7c9e230",
          paddingTop: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <FlatList
            data={itemData}
            keyExtractor={(item, index) => index.toString()}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}
            renderItem={({ item, index }) => (
              <View
                style={[
                  {
                    width: 0.95 * width,
                    backgroundColor: "white",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                  // Apply border radius based on index
                  index === 0 && {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  },
                  index === itemData.length - 1 && {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                  },
                ]}
              >
                <Image
                  style={{
                    width: width / 6.5,
                    height: 75,
                    marginHorizontal: 12,
                  }}
                  source={{ uri: item.imagePaths[0] }}
                  resizeMode="contain"
                />

                <View
                  style={{
                    flexDirection: "column",
                    gap: 5,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#525252",
                    }}
                    numberOfLines={1}
                  >
                    {item.productName.slice(0, 27)}...
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      ₹{item.pricing.salesPrice}
                    </Text>
                    <Text
                      style={{
                        textDecorationLine: "line-through",
                        color: "gray",
                      }}
                    >
                      ₹{item.pricing.mrp}
                    </Text>
                    <Text
                      style={{
                        color: "#22c55e",
                        fontWeight: 600,
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
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "75%",
                      alignItems: "center",
                    }}
                  >
                    <Text>Quantity: {item.quantity}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: "#f17e13",
                        borderWidth: 1,
                        borderRadius: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            decrementQuantity({
                              _id: item._id,
                              quantity: item.quantity,
                            })
                          );
                          dispatch(updateCartOnServer());
                        }}
                        style={{
                          backgroundColor: "#f17e13",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingHorizontal: 7,
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          dispatch(
                            incrementQuantity({
                              _id: item._id,
                              quantity: item.quantity,
                            })
                          );
                          dispatch(updateCartOnServer());
                        }}
                        style={{
                          backgroundColor: "#f17e13",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: 700,
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>

        <View
          style={{
            height: 80,
          }}
        ></View>
      </ScrollView>
      <AuthModal bottomSheetModalRef={bottomSheetModalRef} />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: Platform.OS === "ios" ? 15 : 10,
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,

          elevation: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate("Checkout", { cart });
            } else {
              setContinueClicked(true);
              handlePresentModalPress();
            }
          }}
          style={{
            backgroundColor: "#f17e13",
            // backgroundColor: "#28282B",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 7,
            marginBottom: 20,
            width: "90%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: 17,
              textAlign: "center",
            }}
          >
            Continue to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
