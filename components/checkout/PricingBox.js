import { View, Text } from "react-native";

const PricingBox = ({ pricing }) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        backgroundColor: "white",
        paddingVertical: 15,
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
            fontSize: 15,
            color: "#535353",
          }}
        >
          SUBTOTAL
        </Text>

        <Text
          style={{
            fontSize: 15,
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
            fontSize: 15,
            color: "#0BDA51",
            fontWeight: 500,
          }}
        >
          DISCOUNT
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#0BDA51",
            fontWeight: 500,
          }}
        >
          - ₹{pricing.total_mrp - pricing.total_salesPrice}
        </Text>
      </View>
      {pricing.coupon_discount ? (
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
              color: "#0BDA51",
              fontWeight: 500,
            }}
          >
            COUPON DISCOUNT
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: "#0BDA51",
              fontWeight: 500,
            }}
          >
            - ₹{pricing.coupon_discount}
          </Text>
        </View>
      ) : null}
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginVertical: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#535353",
          }}
        >
          PLATFORM FEE
        </Text>

        <View
          style={{
            fontSize: 15,

            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text
            style={{
              textDecorationLine: "line-through",
              color: "#535353",
            }}
          >
            ₹5
          </Text>
          <Text
            style={{
              color: "#535353",
            }}
          >
            ₹{pricing.service_charge}
          </Text>
        </View>
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
            fontSize: 15,
            color: "#535353",
          }}
        >
          DELIVERY FEE
        </Text>

        <View
          style={{
            fontSize: 15,

            flexDirection: "row",
            gap: 4,
          }}
        >
          <Text
            style={{
              textDecorationLine: "line-through",
              color: "#535353",
            }}
          >
            ₹20
          </Text>
          <Text
            style={{
              color: "#535353",
            }}
          >
            ₹{pricing.delivery_fees}
          </Text>
        </View>
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
            fontSize: 15,
            color: "#535353",
          }}
        >
          ADDITIONAL DISCOUNT
        </Text>

        <Text
          style={{
            fontSize: 15,
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
          ₹{pricing.final_price}
        </Text>
      </View>
    </View>
  );
};

export default PricingBox;
