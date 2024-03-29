import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Story from "../components/home/Story";
import LookingFor from "../components/home/LookingFor";
import Categories from "../components/home/Categories";

import { ScrollView } from "react-native-virtualized-view";
import HorizontalProductList from "../components/utility/HorizontalProductList";
import { fetchUserData } from "../redux/UserReducer";
import { fetchStoriesData } from "../redux/StoryReducer";
import { fetchCart } from "../redux/CartReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckInternet from "../components/CheckInternet";
import { fetchLocationByCity } from "../redux/LocationReducer";
import * as Location from "expo-location";
import LottieView from "lottie-react-native";
import LocationModal from "../components/modals/LocationModal";
import TopCarousel from "../components/home/TopCarousel";
import {
  setAllowLocationChange,
  setSearchQuery,
  setShowSearchBar,
} from "../redux/OptionsReducer";
import tw from "tailwind-react-native-classnames";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();
  const currentLocation = useSelector((state) => state.location.location);
  const currentLocationLoading = useSelector(
    (state) => state.location.isLoading
  );

  const locationServiceable = useSelector(
    (state) => state.location.serviceable
  );

  const userMode = useSelector((state) => state.user.userMode);
  const foodBakeryVisible =
    currentLocation &&
    currentLocation._id === "655f1b9f9f019ff01503fc7b" &&
    userMode !== "business";

  const [permissionStatus, setPermissionStatus] = useState();
  const [isConnected, setIsConnected] = useState(true);
  const [address, setAddress] = useState();
  const [locationsModalVisible, setLocationsModalVisible] = useState(false);

  const reverseGeocode = async (currentLocation) => {
    const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
      longitude: currentLocation.coords.longitude,
      latitude: currentLocation.coords.latitude,
    });
    console.log("reverse geocoded address", reverseGeocodedAddress);
    await AsyncStorage.setItem(
      "savedReverseGeocodedAddress",
      JSON.stringify(reverseGeocodedAddress)
    );
    setAddress(reverseGeocodedAddress);
  };

  const getPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); // fill fetch the location permission status
    setPermissionStatus(status);

    if (status !== "granted") {
      console.log("Please grant location permissions");
      return;
    }

    // if status is granted, it will fetch the current location
    let currentLocation = await Location.getCurrentPositionAsync({});
    if (currentLocation) {
      reverseGeocode(currentLocation);
    }
  };

  useEffect(() => {
    (async () => {
      const user_token = await AsyncStorage.getItem("user_token");
      if (user_token) {
        dispatch(fetchUserData());
        dispatch(fetchCart());
      }
    })();
  }, []);

  // Initially this useEffect will run to get the location permission and fetch the location if not present in the async storage
  useEffect(() => {
    (async () => {
      const savedReverseGeocodedAddress = await AsyncStorage.getItem(
        "savedReverseGeocodedAddress"
      );

      if (!savedReverseGeocodedAddress) {
        getPermissions();
      } else {
        setAddress(JSON.parse(savedReverseGeocodedAddress));
      }
    })();
  }, []);

  useEffect(() => {
    if (address) {
      dispatch(fetchLocationByCity(address[0].city));
    }
  }, [address]);

  useEffect(() => {
    if (currentLocation && currentLocation.city) {
      dispatch(fetchStoriesData(currentLocation.city));
    }
  }, [currentLocation]);

  if (!locationServiceable) {
    dispatch(setShowSearchBar(false));
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        {/* <Navbar showSearchBar={false} /> */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LocationModal
            locationsModalVisible={locationsModalVisible}
            setLocationsModalVisible={setLocationsModalVisible}
          />
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
              marginBottom: 100,
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../assets/vectors/no_location.png")}
              style={{
                height: width / 2,
                width: width / 2,
                alignSelf: "center",
                justifyContent: "center",
              }}
            />

            <View
              style={{
                gap: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  textAlign: "center",
                  fontWeight: 500,
                  marginHorizontal: 30,
                }}
              >
                Sorry, we currently don't serve at your location
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  // fontWeight: 500,
                  marginHorizontal: 30,
                  color: "gray",
                }}
              >
                We will be there very soon !
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "black",
              marginHorizontal: 15,
              padding: 10,
              borderRadius: 6,
            }}
            onPress={() => setLocationsModalVisible(true)}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              Choose another location
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (permissionStatus === "granted" && !Object.keys(currentLocation).length) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LocationModal
          locationsModalVisible={locationsModalVisible}
          setLocationsModalVisible={setLocationsModalVisible}
        />
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            source={require("../assets/lottie/fetching_location.json")}
            style={{
              height: 300,
              width: width,
              alignSelf: "center",
              justifyContent: "center",
            }}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </View>
        <Text
          style={{
            fontSize: 22,
            textAlign: "center",
            // fontWeight: 500,
            marginHorizontal: 30,
          }}
        >
          Fetching Your Location ...
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "black",
            marginHorizontal: 15,
            padding: 10,
            borderRadius: 6,
            marginTop: 50,
          }}
          onPress={() => setLocationsModalVisible(true)}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 17,
            }}
          >
            Or Choose Manually
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (currentLocationLoading) {
    dispatch(setShowSearchBar(false));
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <>
          {/* <Navbar showSearchBar={false} /> */}
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        </>
      </SafeAreaView>
    );
  }

  if (currentLocation && !Object.keys(currentLocation).length) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <LocationModal
          locationsModalVisible={locationsModalVisible}
          setLocationsModalVisible={setLocationsModalVisible}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: 600,
            marginHorizontal: 30,
          }}
        >
          Set your location and start exploring your city
        </Text>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            source={require("../assets/lottie/select_location.json")}
            style={{
              height: 350,
              width: width,
              alignSelf: "center",
              justifyContent: "center",
            }}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </View>

        <View
          style={{
            width: "100%",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#f97316",
              marginHorizontal: 15,
              padding: 10,
              borderRadius: 6,
            }}
            onPress={() => {
              if (permissionStatus === "denied") {
                Alert.alert(
                  "Location Not Detected",
                  "Currently, we don't have access to location services on your device. Please go to settings and enable location services to use this feature",
                  [
                    {
                      text: "Settings",
                      style: "default",
                      onPress: () => Linking.openSettings(),
                    },
                    { text: "Cancel", style: "cancel" },
                  ]
                );
              } else {
                getPermissions();
              }
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              Enable Device Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setLocationsModalVisible(true)}
            style={{
              borderColor: "#f97316",
              borderWidth: 1,
              marginHorizontal: 15,
              padding: 10,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "#f97316",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              Select Manually
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  dispatch(setShowSearchBar(true));
  dispatch(setAllowLocationChange(true));
  dispatch(setSearchQuery(""));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <>
        {/* <Navbar showSearchBar={isConnected} /> */}
        {isConnected ? (
          <ScrollView>
            <Story />

            <TopCarousel />

            <View style={{ padding: 10 }}>
              <LookingFor foodBakeryVisible={foodBakeryVisible} />
            </View>

            <View
              style={{
                marginVertical: 20,
                width,
              }}
            >
              <Image
                source={{
                  uri: "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_one.JPG",
                }}
                style={{
                  width,
                  height: 70,
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  CATEGORIES
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Categories")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      textDecorationLine: "underline",
                      marginRight: 10,
                    }}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <Categories />
            </View>

            <View style={[tw`p-3`, { gap: 12 }]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  // marginBottom: 15,
                }}
              >
                TOP DEALS
              </Text>

              <HorizontalProductList filter={"top-deal"} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  // marginBottom: 15,
                }}
              >
                TRENDING PRODUCTS
              </Text>
              <HorizontalProductList filter={"trending"} />
            </View>

            {/* <Pressable
                onPress={() => Linking.openURL("https://store.mazinda.com")}
                style={{
                  marginVertical: 20,
                }}
              >
                <Image
                  source={{
                    uri: "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_end.JPG",
                  }}
                  style={{
                    width: "100%",
                    height: 100,
                  }}
                  resizeMode="contain"
                />
              </Pressable> */}
          </ScrollView>
        ) : null}

        <CheckInternet
          isConnected={isConnected}
          setIsConnected={setIsConnected}
        />
      </>
    </SafeAreaView>
  );
};

export default HomeScreen;
