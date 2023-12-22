import { ActivityIndicator, ScrollView, Text, View, Pressable, TouchableOpacity } from 'react-native'

const Address = ({ user, userLoading, deliveryAddress, setDeliveryAddress }) => {
    const savedAddresses = user?.savedAddresses;

    if (userLoading) {
        return <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ecf0ef'
        }}>
            <ActivityIndicator size='small' />
        </View>
    }

    return (
        <ScrollView>
            <TouchableOpacity style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
            }}>
                <Text style={{
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#fe6321',
                    backgroundColor: 'white',
                    paddingVertical: 12,
                }}>
                    + Add New Address
                </Text>
            </TouchableOpacity>

            {savedAddresses.map(address =>
                <Pressable
                    key={address.id}
                    onPress={() => setDeliveryAddress(address)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                        borderBottomColor: 'lightgray',
                        borderBottomWidth: 1,
                        backgroundColor: address.id === deliveryAddress.id ? '#ffefe8' : 'white'
                    }}>
                    <View style={{
                        width: 20,
                        height: 20,
                        borderColor: 'lightgray',
                        borderWidth: 1,
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: 12,
                            height: 12,
                            backgroundColor: address.id === deliveryAddress.id ? '#f17e13' : 'white',
                            borderRadius: 100
                        }}>
                        </View>
                    </View>
                    <View>

                        <Text style={{
                            fontSize: 20,
                            fontWeight: 500,
                            marginBottom: 3,
                            color: '#4f5b67'
                        }}>
                            {address.name}
                        </Text>

                        <Text style={{ fontSize: 14, color: '#777777' }}>
                            {address.subaddress}
                        </Text>

                        <Text style={{ fontSize: 14, color: '#777777' }}>
                            {address.city}{", "}{address.state}{", "}{address.pincode}{", IN"}
                        </Text>

                        <Text style={{ fontSize: 14, color: '#777777' }}>
                            +91 {address.phone}
                        </Text>
                    </View>
                </Pressable>
            )}
        </ScrollView>
    )
}

export default Address;