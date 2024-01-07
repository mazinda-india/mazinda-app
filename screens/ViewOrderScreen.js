import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  Image,
  ScrollView,
} from "react-native";
import Navbar from "../components/Navbar";

const ViewOrderScreen = ({ route }) => {
  const { item, status, address } = route.params;
  const { height, width } = useWindowDimensions();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Navbar showSearchBar={false} />
      <ScrollView
        style={{
          backgroundColor: "#f5f5f5",
        }}
      >
        <Text
          style={{
            fontSize: 27,
            textAlign: "center",
            paddingVertical: 10,
            backgroundColor: "white",
          }}
        >
          Your Order
        </Text>

        <View
          style={{
            width: width,
            backgroundColor: "white",
            flexDirection: "row",
            paddingVertical: 20,
            gap: 8,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Image
            style={{
              width: width / 6,
              height: 75,
              marginHorizontal: 12,
            }}
            source={{ uri: item.imagePaths[0] }}
            resizeMode="contain"
          />

          <View
            style={{
              flexDirection: "column",
              gap: 5,
              width: (5 * width) / 6.5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 500,
              }}
              numberOfLines={3}
            >
              {item.productName}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "75%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 16,
                }}
              >
                Quantity: {item.quantity}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              padding: 17,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              marginTop: 5,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Live Status -
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "#29c763",
                fontWeight: 600,
              }}
            >
              {" "}
              {status === "delivered"
                ? "Delivered"
                : status === "out_for_delivery"
                ? "Out For Delivery"
                : status}
            </Text>
          </View>

          <View
            style={{
              padding: 17,
              backgroundColor: "white",
              marginTop: 5,
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              Shipping Details
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#40444f",
              }}
            >
              To - {address.name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#40444f",
              }}
            >
              {address.subaddress}, {address.city}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#40444f",
              }}
            >
              {address.state}, {address.pincode}, IN
            </Text>
            <Text
              style={{
                fontSize: 19,
                marginTop: 30,
              }}
            >
              Delivery By Mazinda
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#40444f",
              }}
            >
              Order ID: {"afsndoh"}
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "white",
            paddingVertical: 15,
            marginTop: 5,
            flexDirection: "column",
            gap: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Billing Details
          </Text>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: 19,
                fontWeight: 500,
              }}
            >
              Subtotal
            </Text>

            <Text
              style={{
                fontSize: 19,
                fontWeight: 500,
              }}
            >
              ₹{item.pricing.mrp} /-
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: "#29c763",
                fontWeight: 500,
              }}
            >
              Discount
            </Text>

            <Text
              style={{
                fontSize: 17,
                color: "#29c763",
                fontWeight: 500,
              }}
            >
              - ₹{item.pricing.mrp - item.pricing.salesPrice} /-
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Service Charge
            </Text>

            <Text
              style={{
                fontSize: 16,
              }}
            >
              ₹{"0"} /-
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 17,
              }}
            >
              Delivery Fees
            </Text>

            <Text
              style={{
                fontSize: 17,
              }}
            >
              ₹{"0"} /-
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: 17,
              }}
            >
              Additional Discount
            </Text>

            <Text
              style={{
                fontSize: 17,
              }}
            >
              ₹{"0"} /-
            </Text>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
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
              ₹{item.pricing.salesPrice} /-
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewOrderScreen;
