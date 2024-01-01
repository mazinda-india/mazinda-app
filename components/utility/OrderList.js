import { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";

const OrderList = ({ filter }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userToken = await AsyncStorage.getItem("user_token");
        const { data } = await axios.post(
          "https://mazinda.com/api/order/fetch-user-orders",
          { userToken, filter }
        );

        if (data.success) {
          setOrders(data.orders);
        } else {
          console.log("An error occurred");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

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
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!orders.length) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "gray",
            fontSize: 16,
            // marginVertical: 10,
            textAlign: "center",
          }}
        >
          No {filter === "current" ? "Current" : "Previous"} Orders
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView>
      {orders.map((order) =>
        order.cart.map((item) => (
          <View
            key={item._id}
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              padding: 10,
              gap: 8,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Image
              style={{
                width: 65,
                height: 65,
              }}
              source={{ uri: item.imagePaths[0] }}
              resizeMode="contain"
            />

            <View
              style={{
                flexDirection: "column",
                gap: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <LottieView
                  source={require("../../assets/status-green.json")}
                  style={{
                    height: 25,
                    width: 25,
                  }}
                  speed={1}
                  autoPlay
                  loop
                />

                <Text
                  style={{
                    color: "#83d429",
                    fontWeight: 600,
                  }}
                >
                  {order.status}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  color: "#525156",
                }}
              >
                {item.productName.slice(0, 30)}...
              </Text>

              {/* <Text>Qty. {item.quantity}</Text> */}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default OrderList;
