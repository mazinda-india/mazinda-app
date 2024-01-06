import { Image, Text, View, Pressable, TouchableOpacity } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addToCart } from "../../redux/CartReducer";

const ProductCard = ({ item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [addedToCart, setAddedToCart] = useState(false);

  const addItemToCart = (item) => {
    dispatch(addToCart({ _id: item._id, quantity: item.quantity }));
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Product", { item });
      }}
      style={{
        flex: 1,
        borderColor: "#e2e8f0",
        borderWidth: 0.7,
        padding: 10,
        position: "relative",
        backgroundColor: "white",
        borderRadius: 5,
      }}
    >
      {!(item.pricing.mrp === item.pricing.salesPrice) ? (
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            backgroundColor: "#F17E1395",
            paddingHorizontal: 3,
            paddingVertical: 8,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "white",
            }}
          >
            {String(
              ((item.pricing.mrp - item.pricing.salesPrice) /
                item.pricing.mrp) *
                100
            ).slice(0, 4)}
            %{"\n"}
            off
          </Text>
        </View>
      ) : null}
      <Image
        source={{ uri: item.imagePaths[0] }}
        resizeMode="contain"
        style={{
          width: "100%",
          height: 150,
        }}
      />

      <View
        style={{
          marginTop: 15,
        }}
      >
        <View
          style={{
            backgroundColor: "#e5e7eb",
            width: "45%",
            paddingHorizontal: 5,
            paddingVertical: 3,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          <MaterialIcons name="timer" size={18} color="black" />

          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
            }}
          >
            30 MIN
          </Text>
        </View>
      </View>

      <View
        style={{
          gap: 5,
          marginTop: 12,
        }}
      >
        <View>
          <Text numberOfLines={1}>{item.productName}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginRight: 2,
            marginTop: 5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: item.pricing.costPrice.length > 3 ? 14 : 16,
                fontWeight: 600,
              }}
            >
              ₹{item.pricing.salesPrice}
            </Text>

            <Text
              style={{
                textDecorationLine: "line-through",
                fontSize: 11,
                color: "gray",
                alignSelf: "flex-end",
              }}
            >
              ₹{item.pricing.mrp}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => addItemToCart(item)}
            style={{
              backgroundColor: "#fce5d0",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 10,
              }}
            >
              {addedToCart ? (
                <Feather name="check-circle" size={15} color="#ff4d0299" />
              ) : (
                <MaterialCommunityIcons
                  name="cart-plus"
                  size={15}
                  color="#ff4d0299"
                />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;
