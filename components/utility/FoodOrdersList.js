import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

const FoodOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState([]);

  const user = useSelector((state) => state.user.user);

  const { width } = useWindowDimensions();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/order/fetch-user-food-orders",
        { userId: user._id }
      );

      if (data.success) {
        setOrders(data.foodOrders.reverse());
        const times = data.foodOrders.map((item) =>
          calculateRemainingTime(item.createdAt, item.updatedAt)
        );
        setRemainingTimes(times);
      } else {
        console.log("An error occurred");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingTime = (createdAtTimestamp, updatedAtTimestamp) => {
    const currentTime = new Date().getTime();
    console.log(currentTime);
    console.log(createdAtTimestamp);
    const elapsedTime = currentTime - new Date(createdAtTimestamp).getTime();
    console.log("elapsedTime", elapsedTime);
    return Math.max(
      (createdAtTimestamp === updatedAtTimestamp ? 40 : 15) * 60 * 1000 -
        elapsedTime,
      0
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTimes((prevTimes) =>
        prevTimes.map((time) => Math.max(time - 1000, 0))
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const renderItem = ({ item, index }) => {
    const remainingMinutes = Math.floor(remainingTimes[index] / (60 * 1000));
    const remainingSeconds = Math.floor(
      (remainingTimes[index] % (60 * 1000)) / 1000
    );

    return (
      <View
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
            {!item.userVerified ? (
              <LottieView
                source={require("../../assets/status-green.json")}
                style={{
                  height: 25,
                  width: 25,
                  marginBottom: 10,
                }}
                speed={1}
                autoPlay
                loop
              />
            ) : null}

            {item.userVerified ? (
              <Text
                style={{
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                DELIVERED
              </Text>
            ) : (
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                {remainingMinutes > 0 && remainingSeconds > 0 ? (
                  <Text
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    {`${remainingMinutes} MIN ${remainingSeconds} SEC`}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    ARRIVING SOON
                  </Text>
                )}
              </View>
            )}
          </View>

          {Object.keys(item.products).map((productName) => (
            <Text
              key={productName}
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
            <View>
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
            </View>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
              }}
            >
              ₹{item.amount} /-
            </Text>
          </View>
          {!item.userVerified ? (
            <Text
              style={{
                marginTop: 10,
              }}
            >
              OTP: {item.userOTP}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
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
