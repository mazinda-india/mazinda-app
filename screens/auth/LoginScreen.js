import { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  Linking,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import OTPVerify from "../../components/modals/OTPVerify";

import { FontAwesome5 } from "@expo/vector-icons";
import MazindaLogoFull from "../../assets/logo/logo_mazinda_full.png";

const LoginScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const [verificationCode, setVerificationCode] = useState(
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [canProceed, setCanProceed] = useState(false);
  const [canProceedOTP, setCanProceedOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const styles = {
    inputLabel: {
      fontSize: 18,
      fontWeight: "500",
      marginTop: 15,
      marginBottom: 5,
    },
    input: {
      borderColor: "lightgray",
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 20,
      fontSize: 17,
      borderRadius: 100,
    },
  };

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

  const handleLoginWithPassword = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post("https://mazinda.com/api/auth/login", {
        credentials,
      });

      if (data.success) {
        await AsyncStorage.setItem("user_token", data.user_token);
        toast.show("Logged in successfully");
        navigation.replace("Main");
      } else {
        toast.show(data.message);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
    setSubmitting(false);
  };

  const handleLoginWithOTP = async () => {
    setSubmitting(true);

    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/user/fetch-user-identifier",
        { identifier: credentials.identifier }
      );

      if (!data.success) {
        toast.show("User doesn't exists. Sign Up instead?");
        setSubmitting(false);
        return;
      }

      const otpSent = await sendOTP(data.user.phoneNumber);

      if (otpSent) {
        setOtpModalVisible(true);
      }
    } catch (e) {
      console.log(e);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const { identifier, password } = credentials;
    const allFieldsFilled = identifier.trim() !== "" && password.trim() !== "";

    setCanProceed(allFieldsFilled);
    setCanProceedOTP(identifier.trim() !== "");
  }, [credentials]);

  useEffect(() => {
    if (otpVerified) {
      setSubmitting(true);
      setOtpModalVisible(false);

      (async () => {
        try {
          const { data } = await axios.post(
            "https://mazinda.com/api/auth/login-otp",
            {
              identifier: credentials.identifier,
            }
          );

          if (data.success) {
            await AsyncStorage.setItem("user_token", data.user_token);
            toast.show("Logged in successfully");
            navigation.replace("Main");
          } else {
            console.log("Error has occurred");
          }
        } catch (error) {
          console.error("An error occurred during login:", error);
        }
      })();
      setSubmitting(false);
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
            marginTop: 50,
          }}
        >
          <Image
            source={MazindaLogoFull}
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              Log In
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#4b5563",
                }}
              >
                or{" "}
                <Text style={{ textDecorationLine: "underline" }}>
                  create account
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center", marginTop: 15 }}>
            <View
              style={{
                width: 300,
                marginTop: 18,
              }}
            >
              <Text style={styles.inputLabel}>Phone/Email</Text>

              <TextInput
                name="identifier"
                value={credentials.identifier}
                onChangeText={(text) => handleInputChange("identifier", text)}
                style={styles.input}
                placeholder="Enter your email or phone"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: 12,
                      color: "gray",
                    }}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                name="password"
                value={credentials.password}
                onChangeText={(text) => handleInputChange("password", text)}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                secureTextEntry
                placeholder="Enter your password"
              />
            </View>

            <View
              style={{
                width: 300,
                marginTop: 18,
              }}
            >
              {submitting ? null : (
                <Pressable
                  style={{
                    backgroundColor: canProceed ? "black" : "lightgray",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 100,
                    justifyContent: "center",
                  }}
                  onPress={handleLoginWithPassword}
                  disabled={!canProceed}
                >
                  {!submitting ? (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "700",
                        textAlign: "center",
                      }}
                    >
                      Log In
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color="white" />
                  )}
                </Pressable>
              )}

              <Pressable
                style={{
                  borderColor: submitting
                    ? "white"
                    : canProceedOTP
                    ? "black"
                    : "lightgray",
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 100,
                  marginTop: 10,
                  justifyContent: "center",
                  backgroundColor: submitting ? "#cccccc50" : "white",
                }}
                onPress={handleLoginWithOTP}
                disabled={!canProceedOTP}
              >
                {!submitting ? (
                  <Text
                    style={{
                      color: canProceedOTP ? "black" : "lightgray",
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    Verify with OTP
                  </Text>
                ) : (
                  <ActivityIndicator size="small" color="gray" />
                )}
              </Pressable>

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

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 15,
                    textAlign: "center",
                    marginTop: 25,
                    color: "gray",
                  }}
                >
                  @2023 All Rights Reserved{"\n"}Mazinda Commerce Private
                  Limited{"\n"}
                </Text>

                <View style={{ flexDirection: "row", gap: 6 }}>
                  <Pressable
                    onPress={() =>
                      Linking.openURL("https://www.mazinda.com/privacy-policy")
                    }
                  >
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "500",
                        textDecorationLine: "underline",
                      }}
                    >
                      privacy
                    </Text>
                  </Pressable>
                  <Text style={{ color: "gray" }}>and</Text>
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        "https://www.mazinda.com/terms-and-conditions"
                      )
                    }
                  >
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "500",
                        textDecorationLine: "underline",
                      }}
                    >
                      terms
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
