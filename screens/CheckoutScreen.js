import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Entypo, Ionicons, FontAwesome } from "@expo/vector-icons";

import { clearCart, updateCartOnServer } from "../redux/CartReducer";
import Overview from "../components/checkout/Overview";
import Address from "../components/checkout/Address";
import Payment from "../components/checkout/Payment";
import PlaceOrder from "../components/checkout/PlaceOrder";

const CheckoutScreen = ({ route }) => {
  const { cart } = route.params;
  const steps = [
    { title: "Overview", heading: "Order Overview", buttonText: "Continue" },
    {
      title: "Address",
      heading: "Select Delivery Address",
      buttonText: "Deliver Here",
    },
    {
      title: "Payment",
      heading: "Select Payment Method",
      buttonText: "Continue",
    },
    {
      title: "Place Order",
      heading: "Order Summary",
      buttonText: "Place Order",
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [deliveryAddress, setDeliveryAddress] = useState(
    user.currentAddress || {}
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [itemData, setItemData] = useState([]);
  const [itemDataLoading, setItemDataLoading] = useState(true);
  const [orderPlacing, setOrderPlacing] = useState(false);
  const [pricing, setPricing] = useState({
    final_price: 0,
    total_mrp: 0,
    total_salesPrice: 0,
    total_costPrice: 0,
    service_charge: 3,
    delivery_fees: 0,
    additional_discount: 0,
  });

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchPricing = (cart) => {
    let total_mrp = 0;
    let total_salesPrice = 0;
    let total_costPrice = 0;

    if (cart) {
      cart.forEach((item) => {
        total_mrp += parseFloat(item.pricing.mrp) * item.quantity;
        total_salesPrice += item.pricing.specialPrice
          ? parseFloat(
              parseFloat(
                parseFloat(item.pricing.salesPrice) -
                  parseFloat(
                    parseFloat(item.pricing.costPrice) -
                      parseFloat(item.pricing.specialPrice)
                  )
              ) * item.quantity
            )
          : parseFloat(parseFloat(item.pricing.salesPrice) * item.quantity);
        total_costPrice += item.pricing.specialPrice
          ? parseFloat(item.pricing.specialPrice) * item.quantity
          : parseFloat(item.pricing.costPrice) * item.quantity;
      });
    }

    setPricing({
      ...pricing,
      total_mrp,
      total_salesPrice,
      total_costPrice,
      final_price: pricing.coupon_discount
        ? total_salesPrice +
          pricing.service_charge +
          pricing.delivery_fees -
          pricing.coupon_discount
        : total_salesPrice + pricing.service_charge + pricing.delivery_fees,
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
      console.log(JSON.parse(JSON.stringify(fetchedItemData, null, 2)));
    })();
  }, [cart]);

  useEffect(() => {
    if (Object.keys(itemData).length) {
      fetchPricing(itemData);
      setItemDataLoading(false);
    }
  }, [itemData]);

  const handlePlaceOrder = async () => {
    const userToken = await AsyncStorage.getItem("user_token");
    try {
      setOrderPlacing(true);
      const { data } = await axios.post(
        "https://mazinda.com/api/order/create-order",
        {
          userToken,
          userCart: itemData,
          pricing,
          address: deliveryAddress,
          paymentMethod: selectedPaymentMethod,
        }
      );

      if (data.success) {
        // Clear the cart after placing the order
        dispatch(clearCart());
        dispatch(updateCartOnServer());

        // Send message to Mazinda Team Group for convienience
        try {
          await axios.post("https://mazinda.com/api/whatsapp/msg-to-group");
        } catch (err) {
          console.log("Group message error", err);
        }

        // Navigate to the Order Placed Screen
        navigation.navigate("Order Placed");
        setOrderPlacing(false);

        // Fetch the store Ids
        let storeIds = [];

        for (let item of cart) {
          const { data } = await axios.post(
            `https://mazinda.com/api/product/fetch-product?id=${item._id}`
          );
          storeIds.push(data.product.storeId);
        }

        // Fetch store Mobile numbers using store Ids
        let storeMobileNumbers = [];

        for (let store_id of storeIds) {
          const { data } = await axios.post(
            "https://mazinda.com/api/store/fetch-store-number",
            {
              id: store_id,
            }
          );
          storeMobileNumbers.push(data.storeMobileNumber);
        }

        // Send a message to individual phone number through whatsapp
        for (let store_mobile_number of storeMobileNumbers) {
          try {
            await axios.post("https://mazinda.com/api/whatsapp/msg-to-store", {
              store_mobile_number,
            });
            await delay(2000); // 2000 milliseconds = 2 seconds
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        Alert.alert(
          "Oops! Something went wrong",
          "There was an issue placing your order. Please try again later"
        );
        setOrderPlacing(false);
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Oops! Something went wrong",
        "There was an issue placing your order. Please try again later"
      );
      setOrderPlacing(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      {/* Header of the page */}
      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        {currentStep === 0 ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: 5,
            }}
          >
            <Entypo name="cross" size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setCurrentStep((prev) => prev - 1)}
            style={{
              position: "absolute",
              left: 5,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        )}

        <Text
          style={{
            fontSize: 15,
          }}
        >
          {steps[currentStep].title.toUpperCase()}
        </Text>
      </View>

      {/* Steps Box */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingVertical: 10,
        }}
      >
        {steps.map((step, index) => (
          <View
            key={index}
            style={{
              alignItems: "center",
            }}
          >
            {currentStep > index ? (
              <View
                style={{
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <FontAwesome name="check-circle" size={24} color="#09ff00" />
                <Text>{step.title}</Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <View
                  style={{
                    borderRadius: 100,
                    backgroundColor: "#dadada",
                    paddingHorizontal: 3,
                    paddingVertical: 4,
                    width: 25,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 800,
                      color: "white",
                    }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text>{step.title}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Bottom Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: Platform.OS === "ios" ? 100 : 80,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,

          elevation: 8,
        }}
      >
        {currentStep === 1 ? (
          !Object.keys(deliveryAddress).length ? (
            <View
              style={{
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                backgroundColor: "lightgray",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
                width: "90%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Select a delivery address
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                backgroundColor: "black",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                width: "90%",
              }}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {steps[currentStep].buttonText}
              </Text>
            </TouchableOpacity>
          )
        ) : currentStep === 2 ? (
          selectedPaymentMethod === "" ? (
            <View
              style={{
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                backgroundColor: "lightgray",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Select a Payment Method
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                marginBottom: Platform.OS === "ios" ? 10 : 0,
                backgroundColor: "black",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              onPress={() => setCurrentStep(currentStep + 1)}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {`Continue with ${
                  selectedPaymentMethod === "online"
                    ? "PAY ONLINE"
                    : "PAY ON DELIVERY"
                }`}
              </Text>
            </TouchableOpacity>
          )
        ) : currentStep === 3 ? (
          <TouchableOpacity
            style={{
              marginBottom: Platform.OS === "ios" ? 10 : 0,
              backgroundColor: orderPlacing ? "lightgray" : "black",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              width: "90%",
              alignItems: "center",
            }}
            onPress={handlePlaceOrder}
          >
            {orderPlacing ? (
              <ActivityIndicator color={"white"} size={"small"} />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Place Your Order
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              marginBottom: Platform.OS === "ios" ? 10 : 0,
              backgroundColor: "black",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              width: "90%",
            }}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {steps[currentStep].buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {currentStep === 0 ? (
        <Overview
          itemData={itemData}
          setItemData={setItemData}
          itemDataLoading={itemDataLoading}
          pricing={pricing}
          setPricing={setPricing}
        />
      ) : currentStep === 1 ? (
        <Address
          user={user}
          deliveryAddress={deliveryAddress}
          setDeliveryAddress={setDeliveryAddress}
        />
      ) : currentStep === 2 ? (
        <Payment
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          pricing={pricing}
        />
      ) : currentStep === 3 ? (
        <PlaceOrder
          itemData={itemData}
          deliveryAddress={deliveryAddress}
          selectedPaymentMethod={selectedPaymentMethod}
          pricing={pricing}
          setPricing={setPricing}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default CheckoutScreen;
