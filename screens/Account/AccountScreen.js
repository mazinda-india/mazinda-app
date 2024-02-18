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
import { useEffect, useRef } from "react";
import {
  MaterialCommunityIcons,
  Ionicons,
  Octicons,
  AntDesign,
} from "@expo/vector-icons";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { toggleUserMode } from "../../redux/UserReducer";
import { useToast } from "react-native-toast-notifications";

const AccountScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  const userMode = useSelector((state) => state.user.userMode);
  const initialRender = useRef(true); // Ref to track initial render

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

  useEffect(() => {
    // Check if it's not the initial render
    if (!initialRender.current) {
      userMode === "business"
        ? toast.show("Switched to Mazinda for Business")
        : toast.show("Switched to Mazinda");
    } else {
      // If it's the initial render, set the ref to false
      initialRender.current = false;
    }
  }, [userMode]);

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
              icon={<AntDesign name="team" size={24} color="black" />}
              text={
                userMode === "business"
                  ? "Switch to Mazinda"
                  : "Mazinda For Business"
              }
              onPress={() => {
                dispatch(toggleUserMode());
              }}
            />
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
            <OptionItem
              icon={<Ionicons name="call-outline" size={24} color="black" />}
              text="Contact Us"
              onPress={() =>
                Linking.openURL(
                  "https://api.whatsapp.com/send?phone=917876901177&text=Hey%20Mazinda,%0APlease%20help%20me%20out."
                )
              }
            />
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
