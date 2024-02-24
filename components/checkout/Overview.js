import {
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useSelector } from "react-redux";
import PricingBox from "./PricingBox";
import ItemList from "./ItemList";

const Overview = ({
  itemData,
  setItemData,
  itemDataLoading,
  pricing,
  setPricing,
}) => {
  const { width } = useWindowDimensions();
  const userMode = useSelector((state) => state.user.userMode);

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
        console.log("new item", newItem);
        if (newItem.variants && Object.keys(newItem.variants).length) {
          const minQuantity = parseFloat(
            newItem.variants[newItem.combinationName].minQuantity
          );
          if (newItem.quantity > minQuantity) {
            newItem.quantity--;
          } else if (newItem.quantity === minQuantity && minQuantity !== 0) {
            // If quantity is equal to minQuantity and minQuantity is not zero, remove the item from the cart
            return null; // Returning null will remove the item from the array
          }
        } else {
          if (newItem.minQuantity) {
            if (newItem.quantity > newItem.minQuantity) {
              newItem.quantity--;
            } else if (
              newItem.quantity === newItem.minQuantity &&
              newItem.minQuantity !== 0
            ) {
              // If quantity is equal to minQuantity and minQuantity is not zero, remove the item from the cart
              return null; // Returning null will remove the item from the array
            }
          } else {
            if (newItem.quantity > 1) {
              newItem.quantity--;
            }
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
          backgroundColor: "#b7c9e230",
        }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#b7c9e230",
        marginBottom: 60,
        paddingHorizontal: 10,
      }}
    >
      <FlatList
        data={itemData}
        keyExtractor={(item, index) => index.toString()}
        style={{
          marginVertical: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={[
                {
                  width: width * 0.95,
                  backgroundColor: "white",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                },

                // Apply border radius based on index
                index === 0 && {
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                },
                index === itemData.length - 1 && {
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                },
              ]}
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

      <PricingBox pricing={pricing} />

      {Platform.OS === "android" ? (
        <View
          style={{
            height: 40,
          }}
        ></View>
      ) : null}
    </ScrollView>
  );
};

export default Overview;
