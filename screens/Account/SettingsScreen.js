import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";

const AccountScreen = () => {
    const navigation = useNavigation();
    const toast = useToast();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>

            <View style={{
                paddingHorizontal: 18,
                marginTop: 16
            }}>

                {/* <Text style={{
                    fontSize: 17,
                    marginTop: 20,
                    marginBottom: 10
                }}>
                    Account and Security
                </Text> */}

                <View style={{
                    gap: 18
                }}>
                    <TouchableOpacity
                        onPress={async () => {
                            await AsyncStorage.removeItem('user_token');
                            toast.show("Logged out Successfully");
                            navigation.replace('Main');
                        }}

                        style={{
                            borderColor: 'gray',
                            borderWidth: 1,
                            flexDirection: 'row',
                            width: '100%',
                            padding: 10,
                            alignItems: 'center',
                            gap: 10,
                            borderRadius: 10
                        }}>
                        <MaterialIcons name="logout" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Logout
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    )
}

export default AccountScreen;