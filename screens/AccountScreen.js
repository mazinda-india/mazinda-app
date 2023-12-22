import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { MaterialCommunityIcons, MaterialIcons, Foundation, FontAwesome, Ionicons, Octicons, AntDesign } from '@expo/vector-icons';

const AccountScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            try {
                const user_token = await AsyncStorage.getItem("user_token");

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

            <View>
                <Text style={{ textAlign: 'center', fontSize: 30, marginTop: 10 }}>
                    My Account
                </Text>
            </View>

            <View style={{
                paddingHorizontal: 18,
                marginTop: 18
            }}>
                <Text style={{
                    fontSize: 20
                }}>
                    My Activity
                </Text>

                <View style={{
                    marginTop: 10,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    gap: 12
                }}>
                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '48%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <MaterialCommunityIcons name="cart-check" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Current Orders
                        </Text>
                    </View>
                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '48%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <MaterialIcons name="playlist-add-check" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Order History
                        </Text>
                    </View>

                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '48%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <MaterialCommunityIcons name="store-check" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Followed Shops
                        </Text>
                    </View>

                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '48%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <Foundation name="page-search" size={24} color="black" />
                        <Text style={{
                            fontSize: 17
                        }}>
                            Review Purchases
                        </Text>
                    </View>

                </View>

                <Text style={{
                    fontSize: 20,
                    marginTop: 20,
                    marginBottom: 10
                }}>
                    Others
                </Text>

                <View style={{
                    gap: 18
                }}>
                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <FontAwesome name="thumbs-o-up" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Rate Mazinda
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Settings')
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
                        }}
                    >
                        <Ionicons name="settings-outline" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Settings
                        </Text>
                    </TouchableOpacity>

                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Terms and Conditions
                        </Text>
                    </View>

                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <AntDesign name="Safety" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Privacy Policy
                        </Text>
                    </View>

                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <MaterialCommunityIcons name="comment-question-outline" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            FAQs
                        </Text>
                    </View>
                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <Ionicons name="call-outline" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Contact Us
                        </Text>
                    </View>
                    <View style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        flexDirection: 'row',
                        width: '100%',
                        padding: 10,
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10
                    }}>
                        <Octicons name="graph" size={24} color="black" />
                        <Text style={{
                            fontSize: 18
                        }}>
                            Become a Seller
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AccountScreen;