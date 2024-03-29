import {
  Image,
  Pressable,
  Text,
  View,
  Platform,
  SafeAreaView,
} from "react-native";
import MazindaLogo from "../assets/logo/logo_mazinda_full.png";
import BusinessLogo from "../assets/logo/business_logo.png";
import {
  EvilIcons,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import LocationModal from "./modals/LocationModal";
import SearchModal from "./modals/SearchModal";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";

const Navbar = () => {
  let searchQuery = useSelector((state) => state.options.searchQuery);
  let showSearchBar = useSelector((state) => state.options.showSearchBar);
  let allowLocationChange = useSelector(
    (state) => state.options.allowLocationChange
  );

  const [locationsModalVisible, setLocationsModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const currentLocationLoading = useSelector(
    (state) => state.location.isLoading
  );
  const currentLocation = useSelector((state) => state.location.location);
  const userMode = useSelector((state) => state.user.userMode);

  const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`bg-white flex`}>
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
            paddingVertical: 5,
          }}
        >
          <Pressable onPress={() => navigation.navigate("Main")}>
            {userMode === "business" ? (
              <Image
                source={BusinessLogo}
                style={{
                  width: 120,
                  height: undefined,
                  aspectRatio: 3 / 1,
                }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={MazindaLogo}
                style={{
                  width: 120,
                  height: undefined,
                  aspectRatio: 3 / 1,
                }}
                resizeMode="contain"
              />
            )}
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
                <Text style={{ fontSize: 16 }}>
                  {currentLocationLoading
                    ? "Fetching Location"
                    : currentLocation?.city
                    ? currentLocation?.city
                    : "Select Location"}
                </Text>
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
          style={{
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
          }}
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
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.15,
              shadowRadius: 3,

              elevation: 2,
              backgroundColor: "white",

              padding: 12,
              marginHorizontal: 10,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 5,
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
    </SafeAreaView>
  );
};

export default Navbar;
