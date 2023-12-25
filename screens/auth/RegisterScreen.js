import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPVerify from "../../components/Modals/OTPVerify";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import MazindaLogo from "../../assets/logo/logo_mazinda_full.png";
import { useToast } from "react-native-toast-notifications";

const RegisterScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const [canProceed, setCanProceed] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verificationCode, setVerificationCode] = useState(
    Math.floor(1000 + Math.random() * 9000).toString()
  );

  const handleInputChange = (field, value) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [field]: value,
    }));
  };

  const sendOTP = async (phoneNumber) => {
    const { data } = await axios.post(
      "https://mazinda.com/api/whatsapp/msg-to-phone-no",
      {
        phone_number: phoneNumber,
        message: `${verificationCode} is the verification code to verify your Mazinda account. DO NOT share this code with anyone. Thanks`,
      }
    );
    return data;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { data } = await axios.post(
      "https://mazinda.com/api/auth/credentials-in-use",
      { email: credentials.email, phone_number: credentials.phone }
    );

    const { usedStatus, message } = data;

    if (usedStatus) {
      toast.show(message);
      setLoading(false);
      return;
    }

    const otpData = await sendOTP(credentials.phone);

    if (otpData.success) {
      setOtpModalVisible(true);
    }
  };

  useEffect(() => {
    const { name, phone, password, email } = credentials;
    const allFieldsFilled =
      name.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      email.trim() !== "";

    setCanProceed(allFieldsFilled && phone.length === 10);
  }, [credentials]);

  useEffect(() => {
    if (otpVerified) {
      setOtpModalVisible(false);

      setLoading(true);

      (async () => {
        const { data } = await axios.post(
          "https://mazinda.com/api/auth/register",
          {
            credentials: {
              name: credentials.name,
              password: credentials.password,
              phoneNumber: credentials.phone,
              email: credentials.email,
            },
          }
        );

        if (data.success) {
          const { token } = data;
          AsyncStorage.setItem("user_token", token);
          toast.show(`Welcome, ${credentials.name}!`);
          navigation.navigate("Main");
        } else {
          toast.show(`Oops, a network error occurred. Please try again later`);
        }
      })();

      setLoading(false);
    }
  }, [otpVerified]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <OTPVerify
        otpModalVisible={otpModalVisible}
        setOtpModalVisible={setOtpModalVisible}
        credentials={credentials}
        verificationCode={verificationCode}
        setOtpVerified={setOtpVerified}
      />
      <ScrollView
        style={{
          width: "100%",
        }}
      >
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

        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          //   behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              alignItems: "center",
              marginTop: 18,
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "500",
              }}
            >
              Sign Up
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#4b5563",
                }}
              >
                or{" "}
                <Text style={{ textDecorationLine: "underline" }}>
                  log into account
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", marginTop: 15 }}>
            <View
              style={{
                width: 300,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  marginTop: 15,
                  marginBottom: 5,
                }}
              >
                Name
              </Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                placeholder="Enter your name"
                onChangeText={(text) => handleInputChange("name", text)}
              />

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  marginTop: 15,
                  marginBottom: 5,
                }}
              >
                Phone
              </Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                placeholder="Enter your phone number"
                onChangeText={(text) => handleInputChange("phone", text)}
              />

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  marginTop: 15,
                  marginBottom: 5,
                }}
              >
                Email
              </Text>
              <TextInput
                autoCapitalize="none"
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                placeholder="Enter your email"
                onChangeText={(text) => handleInputChange("email", text)}
              />

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  marginTop: 15,
                  marginBottom: 5,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                secureTextEntry
                placeholder="Enter your password"
                onChangeText={(text) => handleInputChange("password", text)}
              />
            </View>

            <View
              style={{
                width: 300,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                disabled={!canProceed}
                onPress={handleSubmit}
                style={{
                  marginTop: 10,
                  backgroundColor: canProceed ? "black" : "lightgray",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 100,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" size={"small"} />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "center",
                  marginTop: 15,
                  fontWeight: "600",
                  fontSize: 20,
                  color: "darkgray",
                }}
              >
                or
              </Text>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 100,
                  marginTop: 20,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png",
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                  }}
                >
                  Continue With Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Main")}
                style={{
                  backgroundColor: "#fe6321",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 100,
                  marginTop: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5
                  name="users"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  Continue As Guest
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  marginVertical: 25,
                  color: "gray",
                }}
              >
                @2023 All Rights Reserved{"\n"}Mazinda Commerce Private Limited
                {"\n"}
                <Text
                  style={{
                    color: "black",
                    fontWeight: "500",
                    textDecorationLine: "underline",
                  }}
                >
                  privacy
                </Text>{" "}
                and
                <Text
                  style={{
                    color: "black",
                    fontWeight: "500",
                    textDecorationLine: "underline",
                  }}
                >
                  terms
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
