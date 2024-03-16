import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
} from "react-native";
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
import { setAuthModal } from "../../redux/BottomModalsReducer";

const AccountScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();

  const userMode = useSelector((state) => state.user.userMode);
  const initialRender = useRef(true); // Ref to track initial render

  const user = useSelector((state) => state.user.user);
  const userLoggedIn = user && Object.keys(user).length;

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
      <Text style={{ fontSize: 14 }}>{text}</Text>
    </TouchableOpacity>
  );

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
        <View
          style={{
            paddingHorizontal: 18,
            marginTop: 18,
          }}
        >
          {userLoggedIn ? null : (
            // <View
            //   style={{
            //     elevation: 3,
            //     shadowColor: "gray",
            //     shadowOffset: { width: 0, height: 1 },
            //     shadowOpacity: 0.25,
            //     shadowRadius: 3,
            //     backgroundColor: "white",
            //     padding: 13,
            //     borderRadius: 10,
            //     marginBottom: 20,
            //   }}
            // >
            //   <Text
            //     style={{
            //       fontSize: 20,
            //       fontWeight: 700,
            //       marginBottom: 5,
            //       // color: "gray",
            //     }}
            //   >
            //     <Text
            //       style={{
            //         fontSize: 17,
            //         fontWeight: 700,
            //         // color: "gray",
            //       }}
            //     >
            //       WELCOME
            //     </Text>
            //     , +91 {user.phoneNumber}
            //   </Text>
            // </View>
            <View
              style={{
                elevation: 3,
                shadowColor: "gray",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                backgroundColor: "white",
                padding: 13,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 5,
                }}
              >
                Welcome to Mazinda
              </Text>
              <Text
                style={{
                  color: "gray",
                }}
              >
                Login or Signup to start placing your orders and get them
                delivered in no time
              </Text>

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => dispatch(setAuthModal(true))}
                  style={{
                    padding: 11,
                    backgroundColor: "#f17e13",
                    // backgroundColor: "black",
                    width: "100%",
                    borderRadius: 10,
                    marginTop: 15,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    Login or Signup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {userLoggedIn ? (
            <Text
              style={{
                fontSize: 12,
                marginBottom: 10,
                color: "gray",
              }}
            >
              MY ACTIVITY
            </Text>
          ) : null}

          {userLoggedIn ? (
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
            </View>
          ) : null}

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
              icon={<FontAwesome name="thumbs-o-up" size={22} color="black" />}
              text="Rate Mazinda"
            /> */}
            <OptionItem
              icon={<AntDesign name="team" size={22} color="black" />}
              text={
                userMode === "business"
                  ? "Switch to Mazinda"
                  : "Mazinda For Business"
              }
              onPress={() => {
                dispatch(toggleUserMode());
              }}
            />
            {userLoggedIn ? (
              <OptionItem
                icon={
                  <Ionicons name="settings-outline" size={22} color="black" />
                }
                text="Settings"
                onPress={() => navigation.navigate("Settings")}
              />
            ) : null}
            <OptionItem
              icon={
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={22}
                  color="black"
                />
              }
              text="Terms and Conditions"
              onPress={() =>
                Linking.openURL("https://www.mazinda.com/terms-and-conditions")
              }
            />
            <OptionItem
              icon={<AntDesign name="Safety" size={22} color="black" />}
              text="Privacy Policy"
              onPress={() =>
                Linking.openURL("https://www.mazinda.com/privacy-policy")
              }
            />
            <OptionItem
              icon={<Ionicons name="call-outline" size={22} color="black" />}
              text="Contact Us"
              onPress={() =>
                Linking.openURL(
                  "https://api.whatsapp.com/send?phone=917876901177&text=Hey%20Mazinda,%0APlease%20help%20me%20out."
                )
              }
            />
            <OptionItem
              icon={<Octicons name="graph" size={22} color="black" />}
              text="Become a Seller"
              onPress={() => Linking.openURL("https://store.mazinda.com/")}
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 60,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "lightgray",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            MAZINDA COMMERCE PRIVATE LIMITED
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
