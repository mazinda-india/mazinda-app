import { Image, Pressable, Text, View, Platform } from 'react-native'
import MazindaLogo from '../assets/logo/logo_mazinda.png';

import { EvilIcons, AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import LocationModal from './Modals/LocationModal';
import SearchModal from './Modals/SearchModal';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ searchQuery }) => {
    const [locationsModalVisible, setLocationsModalVisible] = useState(false);
    const [searchModalVisible, setSearchModalVisible] = useState(false);

    const selectedLocation = useLocation();

    const navigation = useNavigation();

    return (
        <View style={{
            paddingTop: Platform.OS === 'ios' ? 8 : 45,
            paddingBottom: 10
        }}>

            <LocationModal
                locationsModalVisible={locationsModalVisible} setLocationsModalVisible={setLocationsModalVisible} />

            <SearchModal
                existingSearchQuery={searchQuery}
                searchModalVisible={searchModalVisible}
                setSearchModalVisible={setSearchModalVisible} />

            {searchQuery ? null : <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingBottom: 5
                }}>
                <Image
                    source={MazindaLogo}
                    style={{
                        width: 100,
                        height: undefined,
                        aspectRatio: 3 / 1,
                    }}
                    resizeMode="contain" />

                <View style={{ flexDirection: 'row', }}>

                    <View>
                        <EvilIcons name="location" size={24} color="darkorange" />
                    </View>

                    <View>
                        <Text style={{ fontSize: 11, color: '#4b5563' }}>Deliver To</Text>
                        <TouchableOpacity
                            onPress={() => setLocationsModalVisible(!locationsModalVisible)}

                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 3,
                                minWidth: 80
                            }}>
                            <Text style={{ fontSize: 16, }}>{selectedLocation.city}</Text>
                            <AntDesign name="down" size={10} color="#4b5563" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}

            <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                {!searchQuery ? null : <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={{
                        marginLeft: 10
                    }}>
                    <Ionicons name="arrow-back" size={24} color="gray" />
                </TouchableOpacity>}
                <Pressable
                    onPress={() => setSearchModalVisible(true)}
                    style={{
                        borderColor: 'lightgray',
                        borderWidth: 1,
                        padding: 12,
                        marginHorizontal: 10,
                        borderRadius: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        width: searchQuery ? '86%' : '95%'
                    }}
                >
                    <FontAwesome name="search" size={20} color="lightgray" />
                    <Text
                        style={{
                            color: searchQuery ? 'black' : 'lightgray',
                            fontSize: 16
                        }}
                    >
                        {searchQuery ? searchQuery : "Search Anything ..."}
                    </Text>
                </Pressable>
            </View>

        </View>
    )
}

export default Navbar;