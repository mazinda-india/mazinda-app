import { ScrollView, Text, View, Pressable } from "react-native";

const Payment = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  return (
    <ScrollView
      style={{
        backgroundColor: "#b7c9e230",
      }}
    >
      <Text
        style={{
          fontWeight: 500,
          paddingVertical: 15,
          paddingHorizontal: 20,
          fontSize: 18,
          backgroundColor: "white",
        }}
      >
        Choose your payment method
      </Text>
      <Pressable
        // onPress={() => setSelectedPaymentMethod("online")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "white",
          // marginBottom: 5,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderColor: "lightgray",
            borderWidth: 1,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor:
                selectedPaymentMethod === "online" ? "gray" : "white",
              borderRadius: 100,
            }}
          ></View>
        </View>

        <View>
          <Text
            style={{
              color: "lightgray",
            }}
          >
            PAY ONLINE
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => setSelectedPaymentMethod("pod")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "white",
          // marginTop: 5,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor:
                selectedPaymentMethod === "pod" ? "black" : "white",
              borderRadius: 100,
            }}
          ></View>
        </View>

        <View>
          <Text>PAY ON DELIVERY</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default Payment;
