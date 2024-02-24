import { ScrollView, Text, View, Pressable } from "react-native";

const Payment = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
  return (
    <ScrollView
      style={{
        backgroundColor: "#b7c9e230",
      }}
    >
      <View
        style={{
          margin: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: 800,
              paddingVertical: 15,
              paddingHorizontal: 20,
              fontSize: 18,
              color: "gray",
              backgroundColor: "white",
            }}
          >
            Payment Method
          </Text>
        </View>

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
      </View>
    </ScrollView>
  );
};

export default Payment;
