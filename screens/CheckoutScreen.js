import {
  Modal,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Entypo, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Overview from "../checkout/Overview";

const CheckoutScreen = () => {
  const steps = [
    { title: "Overview", heading: "Order Overview", buttonText: "Continue" },
    {
      title: "Address",
      heading: "Select Delivery Address",
      buttonText: "Continue",
    },
    {
      title: "Payment",
      heading: "Select Payment Method",
      buttonText: "Continue",
    },
    { title: "Place Order", heading: "Order Summary", buttonText: "Continue" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
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

        {currentStep === 0 ? <Overview /> : null}
      </SafeAreaView>
    </Modal>
  );
};

export default CheckoutModal;
