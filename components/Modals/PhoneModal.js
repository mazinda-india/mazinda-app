import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MazindaLogo from "../../assets/logo/logo_mazinda_full.png";
import { useState } from "react";
import axios from "axios";

const PhoneModal = ({
  setCredentials,
  phoneModalVisible,
  setPhoneModalVisible,
  setCanProceedWithGoogle,
}) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    const { data } = await axios.post(
      "https://mazinda.com/api/auth/credentials-in-use",
      {
        checkPhoneNumber: true,
        phone_number: phone,
      }
    );
    if (data.usedStatus) {
      setError(true);
      setLoading(false);
      return;
    } else {
      setCredentials((prev) => ({ ...prev, phone }));
      setPhoneModalVisible(false);
      setCanProceedWithGoogle(true);
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={phoneModalVisible}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SafeAreaView>
        <View
          style={{
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Image
            source={MazindaLogo}
            style={{
              width: 200,
              height: undefined,
              aspectRatio: 3 / 1,
            }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "500",
            }}
          >
            Phone Number
          </Text>
        </View>

        <View
          style={{
            marginVertical: 40,
            paddingHorizontal: 50,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TextInput
              placeholder="Enter your 10 digit phone number"
              style={{
                borderWidth: 1,
                borderColor: error ? "red" : "lightgray",
                borderRadius: 10,
                fontSize: 18,
                color: "gray",
                padding: 10,
                width: "100%",
              }}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType="numeric"
              maxLength={10}
              textContentType="telephoneNumber"
            />
          </View>

          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {error ? "Phone Number already in use" : ""}
          </Text>

          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{
              backgroundColor: "black",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PhoneModal;
