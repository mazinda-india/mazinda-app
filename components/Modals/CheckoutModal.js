import {
  Modal,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Entypo, Ionicons, FontAwesome } from "@expo/vector-icons";

import Overview from "../checkout/Overview";
import Address from "../checkout/Address";
import Payment from "../checkout/Payment";
import PlaceOrder from "../checkout/PlaceOrder";

const CheckoutModal = ({
  checkoutModalVisible,
  setCheckoutModalVisible,
  cart,
}) => {
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

  const [deliveryAddress, setDeliveryAddress] = useState(user.currentAddress);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

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

  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setCheckoutModalVisible(false)}
      visible={checkoutModalVisible}
    >
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
              onPress={() => setCheckoutModalVisible(false)}
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
            marginTop: 10,
            // borderTopColor: 'lightgray',
            borderBottomColor: "lightgray",
            // borderTopWidth: 1,
            borderBottomWidth: 1,
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
            height: 100,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            borderTopColor: "lightgray",
            borderTopWidth: 1,
          }}
        >
          {currentStep === 2 ? (
            selectedPaymentMethod === "" ? (
              <View
                style={{
                  marginBottom: 10,
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
                  marginBottom: 10,
                  backgroundColor: "#134272",
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
          ) : (
            <TouchableOpacity
              style={{
                marginBottom: 10,
                backgroundColor: "#134272",
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
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
};

export default CheckoutModal;
