import {
  ScrollView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import AddAddress from "../Modals/AddAddress";

const Address = ({ user, deliveryAddress, setDeliveryAddress }) => {
  const savedAddresses = user?.savedAddresses;
  const [addAddressVisible, setAddAddressVisible] = useState(false);

  return (
    <>
      <AddAddress
        addAddressVisible={addAddressVisible}
        setAddAddressVisible={setAddAddressVisible}
      />

      <ScrollView>
        <TouchableOpacity onPress={() => setAddAddressVisible(true)}>
          <Text
            style={{
              fontWeight: 700,
              textAlign: "center",
              color: "#134272",
              backgroundColor: "white",
              paddingVertical: 12,
            }}
          >
            + Add New Address
          </Text>
        </TouchableOpacity>

        {savedAddresses.map((address) => (
          <Pressable
            key={address.id}
            onPress={() => setDeliveryAddress(address)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
              backgroundColor:
                address.id === deliveryAddress.id ? "#1342721A" : "white",
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderColor: "#134272",
                borderWidth: 1,
                borderRadius: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor:
                    address.id === deliveryAddress.id ? "#134272" : "white",
                  borderRadius: 100,
                }}
              ></View>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 3,
                  color: "#4f5b67",
                }}
              >
                {address.name}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {address.subaddress}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {address.city}
                {", "}
                {address.state}
                {", "}
                {address.pincode}
                {", IN"}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                +91 {address.phone}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
};

export default Address;
