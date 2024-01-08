import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const FollowedShopsScreen = () => {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user.user._id);
  const [followedShops, setFollowedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.post(
        "https://mazinda.com/api/user/fetch-followed-shops",
        { userId }
      );
      setFollowedShops(data.stores);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size={"small"} />
      </SafeAreaView>
    );
  }

  if (!followedShops.length) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Currently you don't follow any shop</Text>
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
      <ScrollView>
        {followedShops.map((shop) => (
          <View
            key={shop._id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 18,
              paddingVertical: 15,
              borderBottomColor: "lightgray",
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                {shop.storeName}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                borderColor: "#134272",
                borderWidth: 1.2,
                borderRadius: 4,
                paddingHorizontal: 10,
                paddingVertical: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
              onPress={() => navigation.navigate("Store", { storeInfo: shop })}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#134272",
                }}
              >
                View Shop
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FollowedShopsScreen;
