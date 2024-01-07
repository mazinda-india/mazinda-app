import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import CheckoutModal from "../components/modals/CheckoutModal";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  updateCartOnServer,
} from "../redux/CartReducer";

const CartScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const user = useSelector((state) => state.user.user);
  const isLoggedIn = Object.keys(user).length ? true : false;

  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navbar />
      <ScrollView
        style={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <CheckoutModal
          checkoutModalVisible={checkoutModalVisible}
          setCheckoutModalVisible={setCheckoutModalVisible}
          cart={cart}
        />

        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            paddingVertical: 18,
            backgroundColor: "white",
          }}
        >
          Your Shopping Cart
        </Text>

        <FlatList
          data={itemData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: width,
                backgroundColor: "white",
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 20,
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
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

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 12,
            }}
          >
            Billing Details
          </Text>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              Subtotal
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              ₹{pricing.total_mrp}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#22c55e",
                fontWeight: 500,
              }}
            >
              Discount
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#22c55e",
                fontWeight: 500,
              }}
            >
              - ₹{pricing.total_mrp - pricing.total_salesPrice}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              Service Charge
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              ₹{pricing.service_charge}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              Delivery Fees
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              ₹{pricing.delivery_fees}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              Additional Discount
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              ₹{pricing.additional_discount}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginVertical: 8,
              borderTopColor: "lightgray",
              borderTopWidth: 1,
              paddingTop: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Total
            </Text>

            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              ₹{pricing.total_salesPrice}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 15,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (isLoggedIn) {
                setCheckoutModalVisible(true);
              } else {
                toast.show("Login Now and Start Placing Orders Now!");
                navigation.navigate("Login");
              }
            }}
            style={{
              backgroundColor: "#212121",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 7,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              Continue to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;
