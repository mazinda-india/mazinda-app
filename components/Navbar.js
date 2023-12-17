import { Button, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import MazindaLogo from '../assets/logo/logo_mazinda.png';

import { EvilIcons, AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';

const Navbar = () => {
    const [locationsModalVisible, setLocationsModalVisible] = useState(false);
    return (
        <View style={{ paddingTop: 8 }}>
            <Modal
                transparent
                onRequestClose={() => setLocationsModalVisible(false)}
                presentationStyle='pageSheet'
                animationType='slide'
                visible={locationsModalVisible}>

                <SafeAreaView>
                    {/* <Pressable onPress={() => setLocationsModalVisible(!locationsModalVisible)}>
                        <Text>Close</Text>
                    </Pressable> */}
                    <View style={{ height: '50%', }}></View>
                    <View style={{ height: '50%', backgroundColor: 'white' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

                            <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 18, marginLeft: 10 }}>Choose Delivery Location</Text>
                            <Button onPress={() => setLocationsModalVisible(false)} title='Close' />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 5 }}>
                <Image source={MazindaLogo} style={{
                    width: 100,
                    height: undefined,
                    aspectRatio: 3 / 1,
                }} resizeMode="contain" />
                <View style={{ flexDirection: 'row', }}>
                    <View><EvilIcons name="location" size={24} color="darkorange" /></View>
                    <View>
                        <Text style={{ fontSize: 11, color: '#4b5563' }}>Deliver To</Text>
                        <TouchableOpacity onPress={() => setLocationsModalVisible(!locationsModalVisible)} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <Text style={{ fontSize: 16, }}>Chandigarh</Text>
                            <AntDesign name="down" size={10} color="#4b5563" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 5, }}>
                <TextInput style={{ borderColor: 'lightgray', borderWidth: 1, padding: 12, marginHorizontal: 10, borderRadius: 5 }} placeholder='Search Anything ...' />
            </View>
        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({})