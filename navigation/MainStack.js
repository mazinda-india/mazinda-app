import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import FoodAndBakeryScreen from "../screens/food/FoodAndBakeryScreen";
import MenuScreen from "../screens/food/MenuScreen";
import FoodCheckout from "../screens/food/FoodCheckout";
import SearchScreen from "../screens/SearchScreen";
import ProductScreen from "../screens/ProductScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderPlacedScreen from "../screens/OrderPlacedScreen";
import Navbar from "../components/Navbar";

export default function MainStack() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Navbar />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
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
        {/* <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{ headerShown: false }}
      /> */}
      </Stack.Navigator>
    </>
  );
}
