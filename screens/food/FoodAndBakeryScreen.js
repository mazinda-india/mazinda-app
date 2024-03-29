import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  ScrollView,
  Pressable,
  TouchableHighlight,
} from "react-native";
import Navbar from "../../components/Navbar";
import FoodLocationModal from "../../components/modals/food/FoodLocationModal";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const FoodAndBakeryScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [selectedCampus, setSelectedCampus] = useState("");
  const [categorisedVendors, setCategorisedVendors] = useState({});
  const [foodLocationModalVisible, setFoodLocationModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const test_env = false;

  useEffect(() => {
    if (!selectedCampus) {
      setFoodLocationModalVisible(true);
    }
  }, [selectedCampus]);

  useEffect(() => {
    setCategorisedVendors({});
    (async () => {
      const { data } = await axios.post(
        "https://mazinda.com/api/vendor/fetch-all-vendors"
      );

      setLoading(false);
      // Create a copy of the current state
      setCategorisedVendors((prevData) => {
        let updatedData = { ...prevData };

        // Loop through the vendors and categorize them
        for (let vendor of data.vendors) {
          let categoryVendors = updatedData[vendor.category];

          if (categoryVendors) {
            categoryVendors.push(vendor);
          } else {
            categoryVendors = [vendor];
          }

          updatedData[vendor.category] = categoryVendors;
        }

        return updatedData;
      });
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <Navbar showSearchBar={false} allowLocationChange={false} />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"small"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FoodLocationModal
        foodLocationModalVisible={foodLocationModalVisible}
        setFoodLocationModalVisible={setFoodLocationModalVisible}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
      />
      <Navbar showSearchBar={false} allowLocationChange={false} />

      <Pressable
        onPress={() => setFoodLocationModalVisible(!foodLocationModalVisible)}
        style={{
          borderColor: "lightgray",
          borderWidth: 1,
          borderRadius: 8,
          marginHorizontal: 15,
          padding: 10,
        }}
      >
        {selectedCampus ? (
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Selected Campus:{" "}
            <Text style={{ fontWeight: 600 }}>{selectedCampus}</Text>
          </Text>
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
            }}
          >
            Select Your Campus
          </Text>
        )}
      </Pressable>

      <ScrollView
        style={{
          marginTop: 15,
        }}
      >
        {Object.keys(categorisedVendors).map((category, index) => {
          const vendorsWithPriority = categorisedVendors[category]
            .filter((vendor) => vendor.priority !== "")
            .sort((a, b) => a.priority - b.priority);

          return (
            <React.Fragment key={index}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 22,
                }}
              >
                {category[0].toUpperCase() + category.slice(1)}
              </Text>

              {vendorsWithPriority.map((vendor, index) =>
                !vendor.disabled ? (
                  <TouchableHighlight
                    disabled={!vendor.openStatus}
                    underlayColor={"#f7f7f7"}
                    key={index}
                    onPress={() => {
                      if (selectedCampus) {
                        navigation.navigate("Menu", { vendor, selectedCampus });
                      } else {
                        setFoodLocationModalVisible(true);
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      marginVertical: 20,
                      marginHorizontal: 30,
                      borderRadius: 20,
                      borderColor: "lightgray",
                      borderWidth: 1,
                      // display: vendor.name === "test" ? "none" : "flex",
                    }}
                  >
                    <>
                      <Image
                        source={{ uri: vendor.imageURI }}
                        style={{
                          width: width / 3,
                          height: width / 3,
                          borderTopLeftRadius: 20,
                          borderBottomLeftRadius: 20,
                        }}
                        resizeMode="cover"
                      />

                      <View
                        style={{
                          padding: 10,
                          flexDirection: "column",
                          justifyContent: "space-between",
                          width: (2 * width) / 4,
                        }}
                      >
                        <View>
                          <Text
                            numberOfLines={2}
                            style={{
                              fontSize: 18,
                              fontWeight: 600,
                            }}
                          >
                            {vendor.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              color: "gray",
                              marginVertical: 5,
                            }}
                          >
                            {vendor.category[0].toUpperCase() +
                              vendor.category.slice(1)}
                          </Text>
                        </View>

                        <View
                          style={{
                            backgroundColor: vendor.openStatus
                              ? "#00ff0020"
                              : "#ffff0020",
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 10,
                            alignSelf: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              color: vendor.openStatus ? "#5bc236" : "#eedb00",
                              fontSize: 12,
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            {vendor.openStatus
                              ? "ORDER NOW"
                              : "CURRENTLY UNAVAILABLE"}
                          </Text>
                        </View>
                      </View>
                    </>
                  </TouchableHighlight>
                ) : null
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FoodAndBakeryScreen;
