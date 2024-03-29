import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const FoodCheckout = ({ route }) => {
  const { selectedCampus, vendor, cart } = route.params;
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [externalDeliveryRequired, setExternalDeliveryRequired] =
    useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const [showCutlery, setShowCutlery] = useState(false);
  const [cutleryQuantity, setCutleryQuantity] = useState(0);

  const [mode, setMode] = useState("");
  const [deliveryPersons, setDeliveryPersons] = useState([]);

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    hostel: "",
    campus: selectedCampus,
    phoneNumber: "",
    instructions: "",
  });
  const handleInputChange = (name, value) => {
    setAddress({ ...address, [name]: value });
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("payondelivery");

  const calculateSubtotal = () =>
    Object.keys(cart)
      .reduce(
        (subtotal, itemName) =>
          subtotal + cart[itemName].quantity * parseFloat(cart[itemName].price),
        0
      )
      .toFixed(2);

  const calculateTotal = () =>
    parseFloat(
      parseFloat(calculateSubtotal()) +
        parseFloat(vendor.packingHandlingCharges) +
        parseFloat(vendor.serviceCharges) +
        parseFloat(10 * cutleryQuantity) +
        deliveryCharge
    ).toFixed(2);

  function generateOTP() {
    return Math.floor(Math.random() * 10000);
  }

  useEffect(() => {
    setTotal(calculateTotal());
  }, [cart, vendor, externalDeliveryRequired, deliveryCharge, cutleryQuantity]);

  useEffect(() => {
    if (
      vendor.deliveryRequirements &&
      selectedCampus in vendor.deliveryRequirements
    ) {
      const subtotal = parseFloat(calculateSubtotal());

      if (
        subtotal > vendor.deliveryRequirements[selectedCampus].minOrder &&
        subtotal < vendor.deliveryRequirements[selectedCampus].maxOrder
      ) {
        setDeliveryCharge(
          parseFloat(vendor.deliveryRequirements[selectedCampus].charge)
        );
        setExternalDeliveryRequired(true);
        // setCutleryQuantity(1);
      } else {
        setDeliveryCharge(parseFloat(vendor.deliveryCharges[selectedCampus]));
      }
    } else {
      setDeliveryCharge(parseFloat(vendor.deliveryCharges[selectedCampus]));
    }
  }, [cart]);

  const handleProceedToPaymentOffline = async () => {
    setLoading(true);
    let isAddressComplete = Object.values(address).every((val) => val !== "");
    if (!isAddressComplete && address.instructions == "") {
      isAddressComplete = true;
    }
    const isValidPhoneNumber = /^\d{10}$/.test(address.phoneNumber);

    if (!isAddressComplete || !isValidPhoneNumber) {
      Alert.alert("Kindly enter complete details");
      if (!isValidPhoneNumber) {
        Alert.alert("Phone number must have 10 digits");
      }
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `https://mazinda.com/api/order/create-food-order`,
        {
          userId: user._id,
          vendorId: vendor._id,
          vendorName: vendor.name,
          products: cart,
          address,
          amount: total,
          externalDeliveryRequired,
          cutleryQuantity: 0,
          userOTP: generateOTP(),
          vendorOTP: generateOTP(),
          paymentMethod: "pod",
        }
      );

      if (data.success) {
        try {
          await axios.post("https://mazinda.com/api/whatsapp/msg-to-group", {
            group_id: vendor.whatsapp_group_id,
            order_id: data.order._id,
            products: cart,
            // user: user.name,
            address,
            instructions: address.instructions,
            amount: total,
            externalDeliveryRequired,
          });
        } catch (err) {
          console.log("Error in sending the WhatsApp message", err);
        }

        // Adding this order in the payouts section of the vendor
        try {
          const payouts_response = await axios.post(
            "https://mazinda.com/api/vendor/get-payouts",
            {
              orderId: data.order._id,
              vendorId: vendor._id,
              totalAmount: parseFloat(total),
              payPercentage: vendor.payPercentage,
              handlingCharge: vendor.packingHandlingCharges,
              serviceCharge: vendor.serviceCharges,
              externalDeliveryRequired,
              cutleryQuantity,
              deliveryCharge,
              orderCreatedAt: data.order.createdAt,
            }
          );

          if (payouts_response.data.success) {
            try {
              await axios.put(
                "https://mazinda.com/api/vendor/update-vendor-payouts",
                {
                  _id: vendor._id,
                  payouts: payouts_response.data.payouts,
                }
              );
            } catch (err) {
              console.log("Error in updating the payouts", err);
            }
          }
        } catch (err) {
          console.log("Error in getting the payouts", err);
        }

        navigation.navigate("Order Placed", { showFoodOrders: true });

        setTimeout(async () => {
          try {
            await axios.post("https://mazinda.com/api/whatsapp/msg-to-user", {
              // userName: user.name,
              userNumber: address.phoneNumber,
              amount: total,
            });
          } catch (err) {
            console.log("Error in sending the WhatsApp message", err);
          }
        }, 2000);

        if (externalDeliveryRequired) {
          setTimeout(async () => {
            if (mode === "automatic") {
              const randomAvailableDeliveryPerson = deliveryPersons.filter(
                (deliveryBoy) => deliveryBoy.isAvailable
              )[
                Math.floor(
                  Math.random() *
                    deliveryPersons.filter(
                      (deliveryBoy) => deliveryBoy.isAvailable
                    ).length
                )
              ];

              try {
                // await axios.post(
                //   "https://mazinda.com/api/whatsapp/msg-to-delivery",
                //   {
                //     userName: user.name,
                //     order_id: data.order._id,
                //     products: cart,
                //     address: address,
                //     amount: total,
                //     vendorName: vendor.name,
                //     group_id: randomAvailableDeliveryPerson.groupid,
                //     cutleryQuantity,
                //   }
                // );
                axios.put(`https://mazinda.com/api/delivery-boy`, {
                  deliveryBoyId: randomAvailableDeliveryPerson._id,
                  groupid: randomAvailableDeliveryPerson.groupid,
                  orderId: data.order._id,
                  vendorName: vendor.name,
                  products: cart,
                  address,
                  amount: total,
                });
              } catch (err) {
                console.log("Error in sending the WhatsApp message", err);
              }
            }
          }, 4000);
        }

        // clearCart();

        // try {
        //   await axios.post("https://citikartt.com/api/orderEmail", {
        //     vendorName: vendor.name,
        //   });
        // } catch (err) {
        //   console.log("Error in sending the email", err);
        // }
      } else {
        Alert.alert("Failed to place the order. Please try again later.", {
          autoClose: 3000,
        });
      }
    } catch (err) {
      Alert.alert("Oops, something went wrong", "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://mazinda.com/api/mode");
        setMode(data?.mode);
        if (data.mode === "manual") {
          const { data } = await axios.get(
            "https://mazinda.com/api/delivery-boy"
          );
          if (data.success) {
            setDeliveryPersons(data.deliveryBoys);
          }
        }
      } catch (err) {
        console.log("Network Error");
        console.log(err);
      }
    })();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Navbar showSearchBar={false} allowLocationChange={false} />

      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          paddingBottom: Platform.OS === "ios" ? 30 : 12,
          backgroundColor: "white",
          zIndex: 2,
          borderTopColor: "lightgray",
          borderTopWidth: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => handleProceedToPaymentOffline()}
          style={{
            marginTop: 12,
            backgroundColor: "black",
            marginHorizontal: 20,
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              PLACE ORDER
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: 800,
            // color: "gray",
            // textAlign: "center",
            marginBottom: 10,
          }}
        >
          CHECKOUT
        </Text>

        {Object.keys(cart).map((itemName, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              paddingVertical: 20,
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  width: (3 * width) / 4,
                }}
                numberOfLines={2}
              >
                {itemName}
              </Text>

              <Text
                style={{
                  color: "gray",
                }}
              >
                Quantity: {cart[itemName].quantity}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 18,
              }}
            >
              ₹{cart[itemName].price}
            </Text>
          </View>
        ))}

        {/* {externalDeliveryRequired && ( */}
        {false && (
          <View style={{ marginVertical: 15 }}>
            <Text style={{ fontSize: 17, fontWeight: 500, marginBottom: 5 }}>
              Cutlery Requirement
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                paddingVertical: 10,
              }}
            >
              <Text>1 Plate + Spoon + Napkin</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  disabled={cutleryQuantity === 0}
                  onPress={() => {
                    setCutleryQuantity((prev) => (prev > 0 ? prev - 1 : prev));
                  }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderWidth: 1,
                    borderColor: "#eee",
                    borderTopLeftRadius: 7,
                    borderBottomLeftRadius: 7,
                  }}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderWidth: 1,
                    borderColor: "#eee",
                    backgroundColor:
                      cutleryQuantity > 0 ? "#eee" : "transparent",
                  }}
                >
                  {cutleryQuantity}
                </Text>
                <TouchableOpacity
                  onPress={() => setCutleryQuantity((prev) => prev + 1)}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderWidth: 1,
                    borderColor: "#eee",
                    borderTopRightRadius: 7,
                    borderBottomRightRadius: 7,
                  }}
                >
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={{ paddingHorizontal: 10, fontWeight: "600" }}>
                  ₹ 10
                </Text>
              </View>
            </View>
          </View>
        )}

        <Pressable
          style={{
            marginVertical: 10,
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Payment Method
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {selectedPaymentMethod === "payondelivery"
                ? "PAY ON DELIVERY / CASH ON DELIVERY"
                : selectedPaymentMethod === "online"
                ? "PAY ONLINE ( UPI, CARD)"
                : null}
            </Text>

            <MaterialIcons name="navigate-next" size={24} color="black" />
          </View>
        </Pressable>

        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 15,
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 18,
            }}
          >
            Shipping Details
          </Text>

          <View>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Hostel / House No
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  padding: 10,
                }}
                value={address.hostel}
                onChangeText={(value) => handleInputChange("hostel", value)}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>Campus</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  padding: 10,
                  color: "gray",
                }}
                value={selectedCampus}
                editable={false}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Phone Number
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  padding: 10,
                }}
                keyboardType="phone-pad"
                value={address.phoneNumber}
                onChangeText={(value) =>
                  handleInputChange("phoneNumber", value)
                }
                textContentType="telephoneNumber"
                maxLength={10}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Any instructions? (optional)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "lightgray",
                  borderRadius: 5,
                  padding: 10,
                  height: 100,
                }}
                multiline
                value={address.instructions}
                onChangeText={(value) =>
                  handleInputChange("instructions", value)
                }
              />
            </View>
          </View>
        </View>

        <View
          style={{
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
              ₹{calculateSubtotal()}
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
              Packing and Handling Charge
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#535353",
              }}
            >
              ₹
              {parseFloat(vendor.packingHandlingCharges) + cutleryQuantity * 10}
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
              ₹{vendor.serviceCharges}
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
              ₹{parseFloat(deliveryCharge)}
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
              ₹{total}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 80,
          }}
        ></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodCheckout;
