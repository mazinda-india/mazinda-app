import { Button, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { EvilIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useUpdateLocation } from '../../contexts/LocationContext';

const LocationModal = ({ locationsModalVisible, setLocationsModalVisible }) => {

    const [locations, setLocations] = useState([]);

    const selectedLocation = useLocation();
    const updateLocation = useUpdateLocation();

    const handleCityClick = (locationInfo) => {
        updateLocation(locationInfo);
        setLocationsModalVisible(false);
    };

    const fetchLocations = async () => {
        try {
            const { data } = await axios.get("https://mazinda.com/api/location/fetch-locations");
            if (data.success) {
                setLocations(data.locations);
            }
            //   setLocationLoading(false);
        } catch (error) {
            console.error("Error fetching locations:", error);
            //   setLocationLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [])
    return (
        <Modal
            onRequestClose={() => setLocationsModalVisible(false)}
            presentationStyle='pageSheet'
            animationType='slide'
            visible={locationsModalVisible}>

            <SafeAreaView>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    paddingVertical: 10
                }}>

                    <Text style={{
                        textAlign: 'center',
                        marginVertical: 10,
                        fontSize: 20,
                        marginLeft: 10
                    }}>Choose Delivery Location</Text>
                    <Button onPress={() => setLocationsModalVisible(false)} title='Close' />
                </View>
                <View>
                    {locations && locations.map(location =>
                        <TouchableOpacity
                            key={location._id}
                            onPress={() => handleCityClick(location)}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderColor: location.city === selectedLocation.city ? '#fe6321' : 'lightgray',
                                borderWidth: 1,
                                margin: 10,
                                borderRadius: 10,
                                backgroundColor: location.city === selectedLocation.city ? '#ffefe8' : 'white'
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <EvilIcons name="location" size={25} color="darkorange" />
                                <Text style={{ fontSize: 20 }}>{location.city}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default LocationModal

const styles = StyleSheet.create({})