import {
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useDispatch } from "react-redux";
import { decrementQuantity, incrementQuantity } from "../../redux/CartReducer";

const Overview = ({
  itemData,
  setItemData,
  itemDataLoading,
  pricing,
  setPricing,
}) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const incrementItemQuantity = (id) => {
    setItemData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const decrementItemQuantity = (id) => {
    setItemData((prevData) =>
      prevData.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
            }
          : item
      )
    );
  };

  if (itemDataLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ecf0ef",
        }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#f5f5f5",
        marginBottom: 60,
      }}
    >
      <FlatList
        data={itemData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              width: width,
              backgroundColor: "white",
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 20,
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Image
              style={{
                width: width / 6.5,
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
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#525252",
                }}
                numberOfLines={1}
              >
                {item.productName.slice(0, 27)}...
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
                    color: "#22c55e",
                    fontWeight: 600,
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "75%",
                  alignItems: "center",
                }}
              >
                <Text>Quantity: {item.quantity}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: "#f17e13",
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      decrementItemQuantity(item._id);
                    }}
                    style={{
                      backgroundColor: "#f17e13",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      paddingHorizontal: 7,
                    }}
                  >
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // dispatch(
                      //   incrementQuantity({
                      //     _id: item._id,
                      //     quantity: item.quantity,
                      //   })
                      // );
                      // dispatch(updateCartOnServer());
                      incrementItemQuantity(item._id);
                    }}
                    style={{
                      backgroundColor: "#f17e13",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

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
            Subtotal
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
              color: "#57e28d",
              fontWeight: 500,
            }}
          >
            Discount
          </Text>

          <Text
            style={{
              fontSize: 15,
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
              fontSize: 15,
              color: "#535353",
            }}
          >
            Service Charge
          </Text>

          <Text
            style={{
              fontSize: 15,
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
              fontSize: 15,
              color: "#535353",
            }}
          >
            Delivery Fees
          </Text>

          <Text
            style={{
              fontSize: 15,
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
              fontSize: 15,
              color: "#535353",
            }}
          >
            Additional Discount
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
            ₹{pricing.total_salesPrice}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Overview;
