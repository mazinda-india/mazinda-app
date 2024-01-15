import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MyOrders from "./MyOrders";
import { useLocation } from "../../contexts/LocationContext";
import { SafeAreaView, Text } from "react-native";
import Navbar from "../../components/Navbar";
import FoodOrdersList from "../../components/utility/FoodOrdersList";

const Tab = createMaterialTopTabNavigator();

const OrdersScreen = ({ route }) => {
  const showFoodOrders = route?.params?.showFoodOrders;
  const selectedLocation = useLocation();
  const foodBakeryVisible = selectedLocation._id === "655f1b9f9f019ff01503fc7b";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Navbar showSearchBar={false} />
      {foodBakeryVisible ? (
        <Tab.Navigator
          initialRouteName={showFoodOrders ? "Food Orders" : "My Orders"}
        >
          <Tab.Screen name="My Orders" component={MyOrders} />
          <Tab.Screen name="Food Orders" component={FoodOrdersList} />
        </Tab.Navigator>
      ) : (
        <>
          <Text
            style={{
              textAlign: "center",
              fontSize: 23,
            }}
          >
            My Orders
          </Text>
          <MyOrders />
        </>
      )}
    </SafeAreaView>
  );
};

export default OrdersScreen;
