import {
  SafeAreaView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useLocation } from "../../contexts/LocationContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addNewAddress } from "../../redux/UserReducer";

const AddAddress = ({ addAddressVisible, setAddAddressVisible }) => {
  const { width } = useWindowDimensions();
  const selectedLocation = useLocation();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [pincodeError, setPincodeError] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    subAddress1: "",
    subAddress2: "",
    landmark: "",
    pincode: "",
    city: selectedLocation.city,
    state: "",
  });

  const handleInputChange = (field, value) => {
    if (field === "pincode" && value.length === 6) {
      if (value.length === 6) {
        if (!selectedLocation.pincodes.includes(value)) {
          setPincodeError(true);
          setCanProceed(false); // Disable the button if pincode is invalid
          return;
        }
      } else {
        setCanProceed(false);
      }
    } else {
      setPincodeError(false);
    }

    setNewAddress((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const userToken = await AsyncStorage.getItem("user_token");
    setLoading(true);

    const { data } = await axios.post(
      "https://mazinda.com/api/user/shipping-addresses/add-new-address",
      {
        newAddress: {
          name: newAddress.name,
          phone: newAddress.phone,
          subaddress: `${newAddress.subAddress1}, ${newAddress.subAddress2} ${newAddress.landmark}`,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
        },
        userToken,
      }
    );

    dispatch(addNewAddress({ newSavedAddresses: data.newSavedAddresses }));

    setLoading(false);
    setAddAddressVisible(false);
    setNewAddress({
      name: "",
      phone: "",
      subAddress1: "",
      subAddress2: "",
      landmark: "",
      pincode: "",
      city: selectedLocation.city,
      state: "",
    });
  };

  useEffect(() => {
    if (
      newAddress.pincode.length > 0 &&
      !selectedLocation.pincodes.includes(newAddress.pincode)
    ) {
      setPincodeError(true);
    } else {
      setPincodeError(false);
    }
    // Check if all fields except landmark are non-empty
    const allFieldsFilled =
      newAddress.name.trim() !== "" &&
      newAddress.phone.trim() !== "" &&
      newAddress.subAddress1.trim() !== "" &&
      newAddress.subAddress2.trim() !== "" &&
      newAddress.pincode.trim() !== "" &&
      newAddress.city.trim() !== "" &&
      newAddress.state.trim() !== "";

    setCanProceed(allFieldsFilled && newAddress.phone.length === 10);
  }, [newAddress]);

  useEffect(() => {
    if (pincodeError) {
      setCanProceed(false);
    }
  }, [pincodeError]);

  return (
    <Modal
      animationType="slide"
      visible={addAddressVisible}
      presentationStyle="pageSheet"
      onRequestClose={() => setAddAddressVisible(false)}
    >
      <SafeAreaView
        style={{
          position: "relative",
          flex: 1,
        }}
      >
        {/* save button */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 100,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            borderTopColor: "lightgray",
            borderTopWidth: 1,
          }}
        >
          <TouchableOpacity
            disabled={!canProceed}
            style={{
              marginBottom: 10,
              backgroundColor: canProceed ? "black" : "lightgray",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              width: "90%",
            }}
            onPress={handleSave}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Add Address and Continue
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: "#00000010",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={() => setAddAddressVisible(false)}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
            }}
          >
            Add Delivery Address
          </Text>
        </View>

        <View style={{ paddingVertical: 16, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 17, marginBottom: 16, fontWeight: 500 }}>
            Address
          </Text>
          <View>
            <View style={{ marginVertical: 6, gap: 3 }}>
              <Text>Flat, House No, Building, etc</Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 7,
                  padding: 7,
                }}
                onChangeText={(text) => handleInputChange("subAddress1", text)}
              />
            </View>
            <View
              style={{
                marginVertical: 6,
                gap: 3,
              }}
            >
              <Text>Area, Street, Sector, Village, etc</Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 7,
                  padding: 7,
                }}
                onChangeText={(text) => handleInputChange("subAddress2", text)}
              />
            </View>
            <View style={{ marginVertical: 6, gap: 3 }}>
              <Text>Landmark (if any)</Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 7,
                  padding: 7,
                }}
                onChangeText={(text) => handleInputChange("landmark", text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 3 }}>
                <Text>Pincode</Text>
                <TextInput
                  style={{
                    borderColor: "lightgray",
                    borderWidth: 1,
                    borderRadius: 7,
                    padding: 7,
                    width: width / 3.6,
                  }}
                  onChangeText={(text) => handleInputChange("pincode", text)}
                />
              </View>

              <View style={{ gap: 3 }}>
                <Text>Town / City</Text>
                <TextInput
                  value={newAddress.city}
                  style={{
                    borderColor: "lightgray",
                    borderWidth: 1,
                    borderRadius: 7,
                    padding: 7,
                    width: width / 3.6,
                    color: "gray",
                  }}
                />
              </View>

              <View style={{ gap: 3 }}>
                <Text>State</Text>
                <TextInput
                  style={{
                    borderColor: "lightgray",
                    borderWidth: 1,
                    borderRadius: 7,
                    padding: 7,
                    width: width / 3.6,
                  }}
                  onChangeText={(text) => handleInputChange("state", text)}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingVertical: 16, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 17, marginBottom: 16, fontWeight: 500 }}>
            Contact Details
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ gap: 3 }}>
              <Text>Name</Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 7,
                  padding: 7,
                  width: width / 2.3,
                }}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>

            <View style={{ gap: 3 }}>
              <Text>Contact Number</Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 7,
                  padding: 7,
                  width: width / 2.3,
                }}
                onChangeText={(text) => handleInputChange("phone", text)}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "red",
              fontWeight: 500,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {error}
          </Text>

          <Text
            style={{
              color: "gold",
              fontWeight: 500,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {pincodeError
              ? "Sorry, this pincode is currently unservicable"
              : ""}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddAddress;
