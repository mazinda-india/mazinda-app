import { Image, ScrollView, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PlaceOrder = ({
  itemData,
  deliveryAddress,
  selectedPaymentMethod,
  pricing,
}) => {
  console.log(itemData);
  return (
    <ScrollView
      style={{
        marginBottom: 60,
      }}
    >
      {itemData.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 20,
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            style={{
              width: 75,
              height: 75,
            }}
            source={{ uri: item.imagePaths[0] }}
          />
          <View
            style={{
              flexDirection: "column",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 15,
              }}
            >
              {item.productName.slice(0, 30)}...
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
            <Text>Quantity: {item.quantity}</Text>
          </View>
          <MaterialIcons name="navigate-next" size={24} color="black" />
        </View>
      ))}

      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 20,
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          borderColor: "lightgray",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 13 }}>DELIVER TO</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 3,
                  color: "#4f5b67",
                }}
              >
                {deliveryAddress.name}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {deliveryAddress.subaddress}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {deliveryAddress.city}
                {", "}
                {deliveryAddress.state}
                {", "}
                {deliveryAddress.pincode}
                {", IN"}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                +91 {deliveryAddress.phone}
              </Text>
            </View>
          </View>
        </View>
        <MaterialIcons name="navigate-next" size={24} color="black" />
      </View>

      <Pressable
        style={{
          padding: 20,
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
        }}
      >
        <Text
          style={{
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          Payment Method
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
            }}
          >
            {selectedPaymentMethod === "pod"
              ? "PAY ON DELIVERY / CASH ON DELIVERY"
              : selectedPaymentMethod === "online"
              ? "PAY ONLINE ( UPI, CARD)"
              : null}
          </Text>

          <MaterialIcons name="navigate-next" size={24} color="black" />
        </View>
      </Pressable>

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
    </ScrollView>
  );
};

export default PlaceOrder;
