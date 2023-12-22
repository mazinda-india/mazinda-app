import { Image, Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ item }) => {
    const navigation = useNavigation();

  return (
    <Pressable
        onPress={() => {
            navigation.navigate('Product', { item })
        }}
      style={{
        flex: 1,
        borderColor: "#e2e8f0",
        borderWidth: 0.7,
        padding: 10,
      }}
    >
      <Image
        source={{ uri: item.imagePaths[0] }}
        resizeMode="contain"
        style={{
          width: 175,
          height: 175,
        }}
      />

      <View>
        <View
          style={{
            backgroundColor: "#e5e7eb",
            width: "40%",
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
              fontSize: 12,
              textAlign: "center",
            }}
          >
            30 MIN
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 5,
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <View
          style={{
            width: "70%",
          }}
        >
          <Text>{item.productName.slice(0, 40)}...</Text>
        </View>

        <View
          style={{
            marginRight: 2,
          }}
        >
          <Text
            style={{
              fontSize: item.pricing.costPrice.length > 3 ?  14 : 20,
              fontWeight: 600,
            }}
          >
            ₹{item.pricing.salesPrice}
          </Text>

          <Text
            style={{
              textDecorationLine: "line-through",
              fontSize: item.pricing.costPrice.length > 3 ?  11 : 12,
              color: "gray",
              alignSelf: "flex-end",
            }}
          >
            ₹{item.pricing.mrp}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginVertical: 10,
          backgroundColor: "#c2f6c2",
          borderRadius: 10,
          paddingVertical: 2,
          width: 70,
        }}
      >
        <Text
          style={{
            color: "green",
            textAlign: "center",
            fontWeight: 700,
            fontSize: 10,
          }}
        >
          {String(
            ((item.pricing.mrp - item.pricing.salesPrice) / item.pricing.mrp) *
              100
          ).slice(0, 4)}
          % Off
        </Text>
      </View>
    </Pressable>
  );
};

export default ProductCard;
