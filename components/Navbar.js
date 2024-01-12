import { Image, Pressable, Text, View, Platform } from "react-native";
import MazindaLogo from "../assets/logo/logo_mazinda_full.png";

import {
  EvilIcons,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLocation } from "../contexts/LocationContext";
import LocationModal from "./modals/LocationModal";
import SearchModal from "./modals/SearchModal";
import { useNavigation } from "@react-navigation/native";

const Navbar = ({
  searchQuery,
  showSearchBar = true,
  allowLocationChange = true,
}) => {
  const [locationsModalVisible, setLocationsModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const selectedLocation = useLocation();

  const navigation = useNavigation();

  return (
    <View
      style={{
        paddingTop: 8,
        paddingBottom: 10,
      }}
    >
      <LocationModal
        locationsModalVisible={locationsModalVisible}
        setLocationsModalVisible={setLocationsModalVisible}
      />

      <SearchModal
        existingSearchQuery={searchQuery}
        searchModalVisible={searchModalVisible}
        setSearchModalVisible={setSearchModalVisible}
      />

      {searchQuery ? null : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            paddingBottom: 5,
          }}
        >
          <Pressable onPress={() => navigation.navigate("Main")}>
            <Image
              source={MazindaLogo}
              style={{
                width: 120,
                height: undefined,
                aspectRatio: 3 / 1,
              }}
              resizeMode="contain"
            />
          </Pressable>

          <View style={{ flexDirection: "row" }}>
            <View>
              <EvilIcons name="location" size={24} color="darkorange" />
            </View>

            <View>
              <Text style={{ fontSize: 11, color: "#4b5563" }}>Deliver To</Text>
              <TouchableOpacity
                disabled={!allowLocationChange}
                onPress={() => setLocationsModalVisible(!locationsModalVisible)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                  minWidth: 80,
                }}
              >
                <Text style={{ fontSize: 16 }}>{selectedLocation.city}</Text>
                {allowLocationChange && (
                  <AntDesign name="down" size={10} color="#4b5563" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showSearchBar ? (
        <View
          style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}
        >
          {!searchQuery ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                marginLeft: 10,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="gray" />
            </TouchableOpacity>
          )}
          <Pressable
            onPress={() => setSearchModalVisible(true)}
            style={{
              borderColor: "lightgray",
              borderWidth: 1,
              padding: 12,
              marginHorizontal: 10,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              width: searchQuery ? "86%" : "95%",
            }}
          >
            <FontAwesome name="search" size={20} color="lightgray" />
            <Text
              style={{
                color: searchQuery ? "black" : "lightgray",
                fontSize: 16,
              }}
            >
              {searchQuery ? searchQuery : "Search Anything ..."}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default Navbar;
