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
import OTPVerify from "../../components/modals/OTPVerify";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import MazindaLogo from "../../assets/logo/logo_mazinda_full.png";
import { useToast } from "react-native-toast-notifications";
import { Pressable } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import PhoneModal from "../../components/modals/PhoneModal";

WebBrowser.maybeCompleteAuthSession();

function generateRandomAlphanumeric() {
  const alphanumericCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomAlphanumeric = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(
      Math.random() * alphanumericCharacters.length
    );
    randomAlphanumeric += alphanumericCharacters.charAt(randomIndex);
  }

  return randomAlphanumeric;
}

const RegisterScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "872492645215-a9jkn8vhig4b57uidk63ns5dljhbb65g.apps.googleusercontent.com",
    iosClientId:
      "872492645215-vjq8n4427v4vfmqele54k6b7nu7v61kk.apps.googleusercontent.com",
  });

  const [canProceed, setCanProceed] = useState(false);
  const [canProceedWithGoogle, setCanProceedWithGoogle] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);

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
    const res1 = await axios.post("https://mazinda.com/api/sms", {
      phone: phoneNumber,
      otp: verificationCode,
    });
    const data1 = res1.data;

    const res2 = await axios.post(
      "https://mazinda.com/api/whatsapp/msg-to-phone-no",
      {
        phone_number: phoneNumber,
        message: `${verificationCode} is the verification code to verify your Mazinda account. DO NOT share this code with anyone. Thanks`,
      }
    );

    const data2 = res2.data;

    return data1.success || data2.success;
  };

  const handleContinueWithGoogle = async () => {
    const user_token = await AsyncStorage.getItem("user_token");

    if (!user_token) {
      if (response) {
        if (response.type === "success") {
          setGoogleLoading(true);
          await getUserInfo(response.authentication.accessToken);
        }
      }
    } else {
      navigation.navigate("Main");
    }
  };

  useEffect(() => {
    handleContinueWithGoogle();
  }, [response]);

  const handleSubmit = async () => {
    setLoading(true);

    console.log("credentials", credentials);

    const { data } = await axios.post(
      "https://mazinda.com/api/auth/credentials-in-use",
      {
        email: credentials.email,
        phone_number: credentials.phone,
        checkEmail: true,
        checkPhoneNumber: true,
      }
    );

    const { usedStatus, message } = data;

    if (usedStatus) {
      toast.show(message);
      setLoading(false);
      return;
    }

    const otpSent = await sendOTP(credentials.phone);

    if (otpSent) {
      setOtpModalVisible(true);
    }
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetched the user data ( name and email ) from google
      const user = await response.json();

      // Checking if the email is already in use or not
      const { data } = await axios.post(
        "https://mazinda.com/api/auth/credentials-in-use",
        {
          email: user.email,
          checkEmail: true,
        }
      );

      // if it is in use, means account exists, then same flow as login with google
      if (data.usedStatus) {
        try {
          const { data } = await axios.post(
            "https://mazinda.com/api/auth/login-with-google",
            {
              name: user.name,
              email: user.email,
            }
          );
          console.log(data);
          if (data.success) {
            AsyncStorage.setItem("user_token", data.token);
            toast.show("Logged In successfully");
            navigation.navigate("Main");
          } else {
            toast.show(data.message);
          }
        } catch (err) {
          toast.show("Oops, a network error occurred");
        }
      } else {
        setCredentials((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
        }));
        // Otherwise first input the phone number
        setPhoneModalVisible(true);
      }
    } catch (error) {
      console.log("Error occurred", error);
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
              password: credentials.password
                ? credentials.password
                : generateRandomAlphanumeric(),
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
          setLoading(false);
        } else {
          toast.show(`Oops, a network error occurred. Please try again`);
        }
      })();
      setGoogleLoading(false);
      setLoading(false);
    }
  }, [otpVerified]);

  useEffect(() => {
    const { name, phone, email } = credentials;
    const fieldsFilled =
      name.trim() !== "" && phone.trim() !== "" && email.trim() !== "";
    if (canProceedWithGoogle && fieldsFilled) {
      handleSubmit();
    }
  }, [credentials, canProceedWithGoogle]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <PhoneModal
        setCredentials={setCredentials}
        phoneModalVisible={phoneModalVisible}
        setPhoneModalVisible={setPhoneModalVisible}
        setCanProceedWithGoogle={setCanProceedWithGoogle}
      />

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
        <Pressable
          onPress={() => navigation.navigate("Main")}
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
        </Pressable>

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
                value={credentials.name}
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                textContentType="name"
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
                value={credentials.phone}
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  fontSize: 17,
                  borderRadius: 100,
                }}
                textContentType="telephoneNumber"
                placeholder="Enter your 10 digit phone number"
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="numeric"
                maxLength={10}
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
                textContentType="emailAddress"
                value={credentials.email}
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
                placeholder="Create a strong password"
                textContentType="newPassword"
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

              {/* <TouchableOpacity>
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
              </TouchableOpacity> */}

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

              {!googleLoading && (
                <TouchableOpacity
                  onPress={() => promptAsync()}
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
              )}

              {googleLoading && (
                <ActivityIndicator
                  size={"small"}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 100,
                    marginTop: 20,
                    borderColor: "lightgray",
                    borderWidth: 1,
                  }}
                />
              )}

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
