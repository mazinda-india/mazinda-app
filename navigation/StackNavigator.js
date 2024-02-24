import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import SearchScreen from "../screens/SearchScreen";
import ProductScreen from "../screens/ProductScreen";
import StoreScreen from "../screens/StoreScreen";
import AccountScreen from "../screens/Account/AccountScreen";
import SettingsScreen from "../screens/Account/SettingsScreen";
import FollowedShopsScreen from "../screens/Account/FollowedShopsScreen";

import {
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import CategoriesScreen from "../screens/CategoriesScreen";
import OrderPlacedScreen from "../screens/OrderPlacedScreen";
import CategoryScreen from "../screens/CategoryScreen";
import ViewOrderScreen from "../screens/ViewOrderScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import FoodAndBakeryScreen from "../screens/food/FoodAndBakeryScreen";
import MenuScreen from "../screens/food/MenuScreen";
import FoodCheckout from "../screens/food/FoodCheckout";
import OrdersScreen from "../screens/Account/OrdersScreen";

import { useSelector } from "react-redux";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  function BottomTabs() {
    const currentLocation = useSelector((state) => state.location.location);
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#fbe4d0",
            display:
              currentLocation && Object.keys(currentLocation).length
                ? "flex"
                : "none",
            paddingTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={26} color="#676161" />
              ) : (
                <Entypo name="home" size={26} color="#676161" />
              ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons name="cart" size={26} color="#676161" />
              ) : (
                <MaterialCommunityIcons name="cart" size={26} color="#676161" />
              ),
          }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{
            tabBarLabel: "Categories",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="grid" size={26} color="#676161" />
              ) : (
                <Ionicons name="grid" size={26} color="#676161" />
              ),
          }}
        />
        <Tab.Screen
          name="AccountStack"
          component={AccountStackNavigator}
          options={{
            tabBarLabel: "Account",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons
                  name="account-circle"
                  size={30}
                  color="#676161"
                />
              ) : (
                <MaterialIcons
                  name="account-circle"
                  size={30}
                  color="#676161"
                />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function AccountStackNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="My Orders"
          component={OrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="View Order"
          component={ViewOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Followed Shops" component={FollowedShopsScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Food And Bakery"
          component={FoodAndBakeryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Food Checkout"
          component={FoodCheckout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Order Placed"
          component={OrderPlacedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Store"
          component={StoreScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
