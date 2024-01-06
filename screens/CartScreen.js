import {
  ActivityIndicator,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import CheckoutModal from "../components/modals/CheckoutModal";

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  // console.log(cart);
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
    // setItemDataLoading(true);
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

        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            marginTop: 18,
          }}
        >
          Your Shopping Cart
        </Text>

        <Image
          source={require("../assets/vectors/empty_cart.png")}
          style={{
            width: "100%",
            height: 350,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            textAlign: "center",
            fontWeight: 400,
            fontSize: 23,
          }}
        >
          Your Shopping Cart Is Empty
        </Text>

        <Text
          style={{
            textAlign: "center",
            marginTop: 15,
            fontSize: 18,
            color: "#6b7280",
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

      <ScrollView>
        <CheckoutModal
          checkoutModalVisible={checkoutModalVisible}
          setCheckoutModalVisible={setCheckoutModalVisible}
          cart={cart}
        />

        <Text
          style={{
            textAlign: "center",
            fontSize: 24,
            marginVertical: 18,
          }}
        >
          Your Shopping Cart
        </Text>

        {itemData.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              padding: 10,
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Image
              style={{
                width: 75,
                height: 75,
                marginHorizontal: 12,
              }}
              source={{ uri: item.imagePaths[0] }}
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
                {item.productName.slice(0, 31)}...
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
                    color: "green",
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
                }}
              >
                <Text>Quantity: {item.quantity}</Text>
              </View>
            </View>
            {/* <MaterialIcons name="navigate-next" size={24} color="black" /> */}
          </View>
        ))}

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 15,
            borderTopColor: "lightgray",
            borderTopWidth: 1,
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
                color: "#57e28d",
                fontWeight: 500,
              }}
            >
              Discount
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: "#57e28d",
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
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => setCheckoutModalVisible(true)}
            style={{
              backgroundColor: "#212121",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 7,
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
