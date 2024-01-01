import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Navbar from "../components/Navbar";
import ProductList from "../components/utility/ProductList";
import { ScrollView } from "react-native-virtualized-view";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";

const ShopScreen = ({ route }) => {
  const { storeInfo, storeProducts } = route.params;

  const [products, setProducts] = useState(storeProducts);

  if (products === undefined) {
    (async () => {
      if (Object.keys(storeInfo).length) {
        const { data } = await axios.post(
          "https://mazinda.com/api/product/fetch-store-products",
          { storeId: storeInfo._id }
        );
        setProducts(data.products);
      }
    })();
  }

  const user = useSelector((state) => state.user.user);

  const [followers, setFollowers] = useState(storeInfo.followers);

  const toggleFollow = async () => {
    let updatedFollowers;
    if (followers.includes(user._id)) {
      updatedFollowers = followers.filter(
        (followerId) => followerId !== user._id
      );
    } else {
      updatedFollowers = [...followers, user._id];
    }

    setFollowers(updatedFollowers);

    await axios.post("https://mazinda.com/api/store/update-store-followers", {
      storeId: storeInfo._id,
      userId: user._id,
    });
  };

  if (!products) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Navbar />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "37%",
          }}
        ></View>
        <ActivityIndicator size={"small"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Navbar />
      <ScrollView>
        <View
          style={{
            marginTop: 15,
            paddingHorizontal: 20,
            paddingTop: 15,
            borderColor: "lightgray",
            borderWidth: 1,
            marginHorizontal: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
            }}
          >
            {storeInfo.storeName.toUpperCase()}
          </Text>

          <View
            style={{
              marginVertical: 25,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                gap: 20,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  4.5/5
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#525254",
                  }}
                >
                  Rating
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {followers.length}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#525254",
                  }}
                >
                  Followers
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {products.length}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#525254",
                  }}
                >
                  Products
                </Text>
              </View>
            </View>

            {followers.includes(user._id) ? (
              <TouchableOpacity
                onPress={toggleFollow}
                style={{
                  borderColor: "black",
                  borderWidth: 1,
                  paddingVertical: 8,
                  marginHorizontal: 25,
                  borderRadius: 6,
                  marginTop: 18,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <AntDesign name="checkcircleo" size={19} color="black" />
                <Text
                  style={{
                    color: "black",
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: 500,
                  }}
                >
                  Following
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={toggleFollow}
                style={{
                  backgroundColor: "black",
                  paddingVertical: 8,
                  marginHorizontal: 25,
                  borderRadius: 6,
                  marginTop: 18,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: 500,
                  }}
                >
                  Follow
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ProductList products={products} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
