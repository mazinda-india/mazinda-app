import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MenuScreen = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { vendor, selectedCampus } = route.params;
  // const user = useSelector((state) => state.user.user);
  const [cart, setCart] = useState({});

  const addToCart = (item) => {
    try {
      // Check if the cart is associated with a vendor
      if (Object.keys(cart).length > 0) {
        const vendorNameInCart = Object.values(cart)[0].vendorName;
        if (vendorNameInCart !== vendor.name) {
          // Show the custom alert when trying to add items from different vendors
          Alert.alert(
            "You can't add items from different vendors. Do you want to clear the cart?",
            "",
            [
              {
                text: "Clear",
                onPress: () => {
                  setCart({});
                },
              },
              {
                text: "Cancel",
                style: "cancel",
                // onPress: () => {
                //   // Handle cancel action
                // },
              },
            ]
          );
          return;
        }
      }

      // Check if the item is already in the cart
      if (item.name in cart) {
        // If the item is already in the cart, update its quantity
        const updatedCart = { ...cart };
        updatedCart[item.name].quantity += 1;
        setCart(updatedCart);
      } else {
        // If the item is not in the cart, add it
        const newItem = {
          name: item.name,
          quantity: 1,
          price: item.price,
          vendorName: vendor.name,
        };
        const newCart = { ...cart, [item.name]: newItem };
        setCart(newCart);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = (item) => {
    const updatedCart = { ...cart };

    if (updatedCart[item.name]) {
      const updatedItem = { ...updatedCart[item.name] };

      if (updatedItem.quantity === 1) {
        // Remove the item if the quantity is 1
        delete updatedCart[item.name];
      } else {
        // Decrease the quantity
        updatedItem.quantity -= 1;
        updatedCart[item.name] = updatedItem;
      }

      setCart(updatedCart);
    }
  };

  useEffect(() => {
    (async () => {
      const food_cart = await AsyncStorage.getItem("food_cart");
      if (food_cart) {
        console.log(food_cart);
        setCart(JSON.parse(food_cart));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem("food_cart", JSON.stringify(cart));
    })();
  }, [cart]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
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
          disabled={!Object.keys(cart).length}
          onPress={() =>
            navigation.navigate("Food Checkout", {
              selectedCampus,
              vendor,
              cart,
            })
          }
          style={{
            marginTop: 12,
            backgroundColor: Object.keys(cart).length ? "black" : "lightgray",
            marginHorizontal: 20,
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Continue to Checkout
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          padding: 15,
        }}
      >
        <View>
          {Object.keys(vendor.menu).map((category, index) => (
            <View
              key={index}
              style={{
                borderBottomColor: "lightgray",
                borderBottomWidth: 1,
                borderRadius: 10,
                padding: 8,
                marginVertical: 8,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {category}
              </Text>

              {vendor.menu[category].map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingRight: 10,
                    // paddingLeft: 5,
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text
                    numberOfLines={5}
                    style={{
                      width: width / 2,
                      fontSize: 17,
                    }}
                  >
                    {item.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 17,
                      }}
                    >
                      ₹{item.price} /-
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <TouchableHighlight
                        underlayColor={"#ffffff"}
                        style={{
                          paddingVertical: 3,
                          paddingHorizontal: 8,
                          borderColor:
                            cart && cart[item.name] ? "#f17e13" : "lightgray",
                          backgroundColor:
                            cart && cart[item.name] ? "#f17e1320" : "white",
                          borderWidth: 1,
                          borderTopLeftRadius: 8,
                          borderBottomLeftRadius: 8,
                        }}
                        onPress={() => removeFromCart(item)}
                      >
                        <Text style={{ fontSize: 17 }}>-</Text>
                      </TouchableHighlight>
                      <Text
                        style={{
                          fontSize: 17,
                          paddingVertical: 3,
                          paddingHorizontal: 7,
                          borderTopColor:
                            cart && cart[item.name] ? "#f17e13" : "lightgray",
                          borderBottomColor:
                            cart && cart[item.name] ? "#f17e13" : "lightgray",
                          backgroundColor:
                            cart && cart[item.name] ? "#f17e1320" : "white",
                          borderTopWidth: 1,
                          borderBottomWidth: 1,
                        }}
                      >
                        {cart && cart[item.name]
                          ? cart[item.name].quantity
                          : "0"}
                      </Text>
                      <TouchableHighlight
                        underlayColor={"#ffffff"}
                        onPress={() => addToCart(item)}
                        style={{
                          paddingVertical: 3,
                          paddingHorizontal: 7,
                          borderColor:
                            cart && cart[item.name] ? "#f17e13" : "lightgray",
                          borderWidth: 1,
                          backgroundColor:
                            cart && cart[item.name] ? "#f17e1320" : "white",
                          borderTopRightRadius: 8,
                          borderBottomRightRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>+</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
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

export default MenuScreen;
