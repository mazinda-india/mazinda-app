import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  FlatList,
  useWindowDimensions,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OrderList = ({ filter }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const { width } = useWindowDimensions();

  const fetchOrders = async () => {
    try {
      const userToken = await AsyncStorage.getItem("user_token");
      const { data } = await axios.post(
        "https://mazinda.com/api/order/fetch-user-orders",
        { userToken, filter }
      );

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        console.log("An error occurred");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
            textAlign: "center",
          }}
        >
          No {filter === "current" ? "Current" : "Previous"} Orders
        </Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const order = orders.find((order) => order.cart.includes(item));
    console.log("order", order);
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("View Order", {
            item: item,
            status: order.status,
            address: order.address,
          })
        }
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 10,
          paddingVertical: 20,
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 1,
        }}
      >
        <View
          style={{
            width: width / 5,
            paddingLeft: 10,
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              marginVertical: 5,
            }}
            source={{ uri: item.imagePaths[0] }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            gap: 5,
            width: (4 * width) / 5,
            paddingRight: 40,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            {order.status !== "delivered" ? (
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
            ) : null}

            <Text
              style={{
                color: order.status === "delivered" ? "black" : "#83d429",
                fontWeight: 500,
              }}
            >
              {order.status === "out_for_delivery"
                ? "OUT FOR DELIVERY".toUpperCase()
                : order.status === "delivered"
                ? "DELIVERED"
                : order.status.toUpperCase()}
            </Text>
          </View>

          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              color: "#525156",
            }}
          >
            {item.productName}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={orders.flatMap((order) => order.cart)}
      keyExtractor={(item, index) => index}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
      }}
    />
  );
};

export default OrderList;
