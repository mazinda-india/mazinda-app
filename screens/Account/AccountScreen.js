import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import {
  MaterialCommunityIcons,
  Ionicons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import Navbar from "../../components/Navbar";

const AccountScreen = () => {
  const navigation = useNavigation();

  const OptionItem = ({ icon, text, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
      }}
    >
      {icon}
      <Text style={{ fontSize: 15 }}>{text}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      try {
        const user_token = await AsyncStorage.getItem("user_token");

        if (!user_token) {
          navigation.replace("Login");
        }
      } catch (err) {
        console.log("error", err);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navbar showSearchBar={false} />
      <ScrollView
        style={{
          marginBottom: 25,
        }}
      >
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 26,
            }}
          >
            My Account
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 18,
            marginTop: 18,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              marginBottom: 20,
              color: "gray",
            }}
          >
            MY ACTIVITY
          </Text>

          <View
            style={{
              marginTop: 10,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("My Orders")}
              style={{
                backgroundColor: "#f5f5f5",
                flexDirection: "row",
                width: "48%",
                padding: 10,
                alignItems: "center",
                gap: 10,
                borderRadius: 10,
              }}
            >
              <MaterialCommunityIcons
                name="cart-check"
                size={20}
                color="black"
              />
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                My Orders
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("Order History")}
              style={{
                backgroundColor: "#f5f5f5",
                flexDirection: "row",
                width: "48%",
                padding: 10,
                alignItems: "center",
                gap: 10,
                borderRadius: 10,
              }}
            >
              <MaterialIcons
                name="playlist-add-check"
                size={20}
                color="black"
              />
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                Order History
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() => navigation.navigate("Followed Shops")}
              style={{
                backgroundColor: "#f5f5f5",
                flexDirection: "row",
                width: "48%",
                padding: 10,
                alignItems: "center",
                gap: 10,
                borderRadius: 10,
              }}
            >
              <MaterialCommunityIcons
                name="store-check"
                size={20}
                color="black"
              />
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                Followed Shops
              </Text>
            </TouchableOpacity>

            {/* <View
              style={{
                backgroundColor: "#f5f5f5",
                flexDirection: "row",
                width: "48%",
                paddingVertical: 10,
                paddingHorizontal: 8,
                alignItems: "center",
                gap: 8,
                borderRadius: 10,
              }}
            >
              <Foundation name="page-search" size={20} color="black" />
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                Review Purchases
              </Text>
            </View> */}
          </View>

          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              marginBottom: 20,
              color: "gray",
            }}
          >
            OTHERS
          </Text>

          <View style={{ gap: 18 }}>
            {/* <OptionItem
              icon={<FontAwesome name="thumbs-o-up" size={24} color="black" />}
              text="Rate Mazinda"
            /> */}
            <OptionItem
              icon={
                <Ionicons name="settings-outline" size={24} color="black" />
              }
              text="Settings"
              onPress={() => navigation.navigate("Settings")}
            />
            <OptionItem
              icon={
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={24}
                  color="black"
                />
              }
              text="Terms and Conditions"
              onPress={() =>
                Linking.openURL("https://www.mazinda.com/terms-and-conditions")
              }
            />
            <OptionItem
              icon={<AntDesign name="Safety" size={24} color="black" />}
              text="Privacy Policy"
              onPress={() =>
                Linking.openURL("https://www.mazinda.com/privacy-policy")
              }
            />
            {/* <OptionItem
              icon={
                <MaterialCommunityIcons
                  name="comment-question-outline"
                  size={24}
                  color="black"
                />
              }
              text="FAQs"
            /> */}
            {/* <OptionItem
              icon={<Ionicons name="call-outline" size={24} color="black" />}
              text="Contact Us"
            /> */}
            <OptionItem
              icon={<Octicons name="graph" size={24} color="black" />}
              text="Become a Seller"
              onPress={() => Linking.openURL("https://store.mazinda.com/")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
