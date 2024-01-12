import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { BottomModal, SlideAnimation } from "react-native-modals";

const LocationModal = ({
  foodLocationModalVisible,
  setFoodLocationModalVisible,
  selectedCampus,
  setSelectedCampus,
}) => {
  const [locations, setLocations] = useState([
    "North",
    "South",
    "Catalyst",
    "Garpa",
    "Mind Tree",
    "Salgi",
  ]);

  const handleCampusClick = (campus) => {
    setSelectedCampus(campus);
    setFoodLocationModalVisible(false);
  };

  return (
    <BottomModal
      visible={foodLocationModalVisible}
      onBackDropPress={() =>
        setFoodLocationModalVisible(!foodLocationModalVisible)
      }
      swipeDirection={["up", "down"]}
      swipeThreshold={200}
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      onHardwareBackPress={() =>
        setFoodLocationModalVisible(!foodLocationModalVisible)
      }
      onTouchOutside={() =>
        setFoodLocationModalVisible(!foodLocationModalVisible)
      }
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
          <TouchableOpacity onPress={() => setFoodLocationModalVisible(false)}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          {locations.map((location) => (
            <TouchableOpacity
              key={location}
              onPress={() => handleCampusClick(location)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderColor:
                  location === selectedCampus ? "#fe6321" : "lightgray",
                borderWidth: 1,
                marginVertical: 6,
                marginHorizontal: 18,
                borderRadius: 8,
                backgroundColor:
                  location === selectedCampus ? "#ffefe8" : "white",
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
                <Text style={{ fontSize: 16 }}>{location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </BottomModal>
  );
};

export default LocationModal;
