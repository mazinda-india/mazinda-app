import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { BottomModal, SlideAnimation } from "react-native-modals";
import { useLocation, useUpdateLocation } from "../../contexts/LocationContext";

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
      const { data } = await axios.get(
        "https://mazinda.com/api/location/fetch-locations"
      );
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);
  return (
    <BottomModal
      visible={locationsModalVisible}
      onBackDropPress={() => setLocationsModalVisible(!locationsModalVisible)}
      swipeDirection={["up", "down"]}
      swipeThreshold={200}
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      onHardwareBackPress={() =>
        setLocationsModalVisible(!locationsModalVisible)
      }
      onTouchOutside={() => setLocationsModalVisible(!locationsModalVisible)}
    >
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              fontSize: 17,
              marginLeft: 10,
            }}
          >
            Choose Delivery Location
          </Text>
          <TouchableOpacity onPress={() => setLocationsModalVisible(false)}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          {locations &&
            locations.map((location) => (
              <TouchableOpacity
                key={location._id}
                onPress={() => handleCityClick(location)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderColor:
                    location.city === selectedLocation.city
                      ? "#fe6321"
                      : "lightgray",
                  borderWidth: 1,
                  marginVertical: 6,
                  marginHorizontal: 18,
                  borderRadius: 8,
                  backgroundColor:
                    location.city === selectedLocation.city
                      ? "#ffefe8"
                      : "white",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <EvilIcons name="location" size={25} color="darkorange" />
                  <Text style={{ fontSize: 16 }}>{location.city}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </SafeAreaView>
    </BottomModal>
  );
};

export default LocationModal;

const styles = StyleSheet.create({});
