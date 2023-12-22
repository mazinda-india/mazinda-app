import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductScreen from '../screens/ProductScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import CategoriesScreen from '../screens/CategoriesScreen';
import AccountScreen from '../screens/AccountScreen';

import LocationProvider from '../contexts/LocationContext';

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();

    const Tab = createBottomTabNavigator();

    function BottomTabs() {
        return <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: '#fbe4d0',
            },
        }}>
            <Tab.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarLabelStyle: { color: 'black' },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? <Entypo name="home" size={26} color="#676161" /> : <Entypo name="home" size={26} color="#676161" />
                }}
            />
            <Tab.Screen
                name='Cart'
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    tabBarLabelStyle: { color: 'black' },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? <MaterialCommunityIcons name="cart" size={26} color="#676161" /> : <MaterialCommunityIcons name="cart" size={26} color="#676161" />
                }}
            />
            <Tab.Screen
                name='Categories'
                component={CategoriesScreen}
                options={{
                    tabBarLabel: 'Categories',
                    tabBarLabelStyle: { color: 'black' },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? <Ionicons name="grid" size={26} color="#676161" /> : <Ionicons name="grid" size={26} color="#676161" />
                }}
            />
            <Tab.Screen
                name='AccountStack'
                component={AccountStackNavigator}
                options={{
                    tabBarLabel: 'Account',
                    tabBarLabelStyle: { color: 'black' },
                    headerShown: false,
                    tabBarIcon: ({ focused }) =>
                        focused ? <MaterialIcons name="account-circle" size={30} color="#676161" /> : <MaterialIcons name="account-circle" size={30} color="#676161" />
                }}
            />
        </Tab.Navigator>
    }

    function AccountStackNavigator() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        )
    }

    return (
        <LocationProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>

        </LocationProvider>

    )
}

export default StackNavigator;