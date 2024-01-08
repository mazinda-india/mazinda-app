import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useEffect } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const OrderPlacedScreen = () => {
  const { width, height } = useWindowDimensions();

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("AccountStack", { screen: "My Orders" });
    }, 3200);
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: height / 10,
        }}
      >
        <LottieView
          source={require("../assets/thumbs.json")}
          style={{
            height: 270,
            width: width,
            alignSelf: "center",
            justifyContent: "center",
          }}
          autoPlay
          loop={false}
          speed={0.7}
        />
      </View>
      <Text
        style={{
          marginTop: height / 20,
          fontSize: 22,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        Your Order is Placed Successfully
      </Text>
      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "gray",
          fontWeight: "400",
          textAlign: "center",
        }}
      >
        Thanks for purchasing with Mazinda{"\n"}
        Your order will reach you very soon
      </Text>
      {/* <LottieView
        source={require("../assets/sparkle.json")}
        style={{
          height: 300,
          position: "absolute",
          top: 100,
          width: 300,
          alignSelf: "center",
        }}
        autoPlay
        loop={true}
        speed={0.7}
      /> */}
    </SafeAreaView>
  );
};

export default OrderPlacedScreen;
