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
import { useSelector } from "react-redux";

const FoodOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);

  const { width } = useWindowDimensions();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/order/fetch-user-food-orders",
        { userId: user._id }
      );

      console.log(data);

      if (data.success) {
        setOrders(data.foodOrders.reverse());
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
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
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
          No Orders Currently
        </Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    console.log("item", item);
    const products = item.products;
    // console.log("products", orders[0].products);
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
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          marginHorizontal: 15,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 5,
            // width: (4 * width) / 5,
            width,
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
            {item.status !== "delivered" ? (
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
                color: item.status === "delivered" ? "black" : "#83d429",
                fontWeight: 500,
              }}
            >
              {item.status === "out_for_delivery"
                ? "OUT FOR DELIVERY".toUpperCase()
                : item.status === "delivered"
                ? "DELIVERED"
                : item.status.toUpperCase()}
            </Text>
          </View>

          {Object.keys(item.products).map((productName) => (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                color: "#525156",
              }}
            >
              {item.products[productName].quantity} x{" "}
              <Text
                style={{
                  color: "black",
                }}
              >
                {productName}
              </Text>
            </Text>
          ))}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: "gray",
              }}
            >
              {new Date(item.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              ₹{item.amount} /-
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await fetchOrders();
          setRefreshing(false);
        }}
      />
    </SafeAreaView>
  );
};

export default FoodOrdersList;
