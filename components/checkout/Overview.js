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

const Overview = ({
  itemData,
  setItemData,
  itemDataLoading,
  pricing,
  setPricing,
}) => {
  const { width } = useWindowDimensions();

  const incrementItemQuantity = (id) => {
    setItemData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementItemQuantity = (id) => {
    const updatedItemData = itemData.map((item) => {
      if (item._id === id) {
        const newItem = { ...item }; // Create a copy of the item object
        // Update the quantity
        if (Object.keys(newItem.variants).length) {
          const minQuantity = parseFloat(
            newItem.variants[newItem.combinationName].minQuantity
          );
          if (newItem.quantity > minQuantity) {
            newItem.quantity--;
          }
          // else if (newItem.quantity === minQuantity) {
          //   // If quantity is equal to minQuantity, remove the item from the cart
          //   return null; // Returning null will remove the item from the array
          // }
        } else {
          if (newItem.quantity > newItem.minQuantity) {
            newItem.quantity--;
          } else if (newItem.quantity === newItem.minQuantity) {
            // If quantity is equal to minQuantity, remove the item from the cart
            return null; // Returning null will remove the item from the array
          }
        }
        return newItem;
      }
      return item; // For other items, return them unchanged
    });

    // Filter out any null values (items to be removed) and update the state
    const updatedItemDataWithoutNull = updatedItemData.filter(
      (item) => item !== null
    );
    setItemData(updatedItemDataWithoutNull);
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
        renderItem={({ item, index }) => {
          return (
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
                  {item.pricing.specialPrice ? (
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      ₹
                      {parseFloat(
                        parseFloat(item.pricing.salesPrice) -
                          parseFloat(
                            parseFloat(item.pricing.costPrice) -
                              parseFloat(item.pricing.specialPrice)
                          )
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      ₹{item.pricing.salesPrice}
                    </Text>
                  )}
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
                    {item.pricing.specialPrice
                      ? String(
                          ((item.pricing.mrp - item.pricing.specialPrice) /
                            item.pricing.mrp) *
                            100
                        ).slice(0, 4)
                      : String(
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
          );
        }}
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
