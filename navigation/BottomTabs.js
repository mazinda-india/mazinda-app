import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import CartScreen from "../screens/CartScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import AccountStack from "./AccountStack";
import MainStack from "./MainStack";

import {
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  const currentLocation = useSelector((state) => state.location.location);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          display:
            currentLocation && Object.keys(currentLocation).length
              ? "flex"
              : "none",
          paddingTop: 2,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="MainStack"
        component={MainStack}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={26} color="#f17e13" />
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
              <MaterialCommunityIcons name="cart" size={26} color="#f17e13" />
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
              <Ionicons name="grid" size={26} color="#f17e13" />
            ) : (
              <Ionicons name="grid" size={26} color="#676161" />
            ),
        }}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{
          //   tabBarLabel: "Account",
          tabBarLabelStyle: { color: "black" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons name="account-circle" size={30} color="#f17e13" />
            ) : (
              <MaterialIcons name="account-circle" size={30} color="#676161" />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
