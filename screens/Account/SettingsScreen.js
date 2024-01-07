import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/CartReducer";
import { logout } from "../../redux/UserReducer";

const AccountScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          paddingHorizontal: 18,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            // marginTop: 20,
            marginBottom: 20,
            color: "gray",
          }}
        >
          ACCOUNT AND SECURITY
        </Text>

        <View
          style={{
            gap: 18,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("user_token");
              dispatch(clearCart());
              dispatch(logout());
              toast.show("Logged out Successfully");
              navigation.replace("Main");
            }}
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
            <MaterialIcons name="logout" size={24} color="black" />
            <Text
              style={{
                fontSize: 15,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
