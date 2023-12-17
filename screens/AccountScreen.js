import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

const AccountScreen = () => {
    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
            try {
                const user_token = await AsyncStorage.getItem("user_token");

                // console.log(user_token);

                if (!user_token) {
                    navigation.replace('Login');
                }
            } catch (err) {
                console.log('error', err);
            }
        })()
    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
            {/* <Navbar /> */}

            <View><Text style={{ textAlign: 'center', fontSize: 30, marginTop: 10 }}>My Account</Text></View>
        </SafeAreaView>
    )
}

export default AccountScreen

const styles = StyleSheet.create({})