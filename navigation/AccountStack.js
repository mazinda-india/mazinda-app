import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screens/Account/AccountScreen";
import OrdersScreen from "../screens/Account/OrdersScreen";
import ViewOrderScreen from "../screens/ViewOrderScreen";
import SettingsScreen from "../screens/Account/SettingsScreen";
import FollowedShopsScreen from "../screens/Account/FollowedShopsScreen";

export default function AccountStack() {
  const Stack = createNativeStackNavigator();
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
