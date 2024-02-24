import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useMemo, useCallback } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/UserReducer";
import { useToast } from "react-native-toast-notifications";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import axios from "axios";

const AuthModal = ({ bottomSheetModalRef }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const snapPoints = useMemo(() => ["50%"], []);

  // callbacks
  //   const handlePresentModalPress = useCallback(() => {
  //     bottomSheetModalRef.current?.present();
  //   }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState({
    sms: false,
    whatsapp: false,
  });

  const [canProceedOTP, setCanProceedOTP] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [otp, setOtp] = useState("");
  const [otpIncorrect, setOtpIncorrect] = useState(false);

  const resetComponent = () => {
    setPhoneNumber("");
    setOtpSubmitting({
      sms: false,
      whatsapp: false,
    });
    setCanProceedOTP(false);
    setVerificationCode("");
    setOtp("");
    setOtpIncorrect("false");
  };

  const sendOTP = async (phoneNumber, platform) => {
    let data;

    const generatedVerificationCode = Math.floor(
      1000 + Math.random() * 9000
    ).toString();
    setVerificationCode(generatedVerificationCode);

    if (platform === "sms") {
      const res1 = await axios.post("https://mazinda.com/api/sms", {
        phone: phoneNumber,
        otp: generatedVerificationCode,
      });
      data = res1.data;
    } else if (platform === "whatsapp") {
      const res2 = await axios.post(
        "https://mazinda.com/api/whatsapp/msg-to-phone-no",
        {
          phone_number: phoneNumber,
          message: `${generatedVerificationCode} is the verification code to verify your Mazinda account. DO NOT share this code with anyone. Thanks`,
        }
      );

      data = res2.data;
    }

    return data.success;
  };

  const handleLoginWithOTP = async (platform) => {
    setOtpSubmitting((prev) => ({
      ...prev,
      [platform]: true,
    }));

    try {
      const otpSent = await sendOTP(phoneNumber, platform);

      if (otpSent) {
        setCanProceedOTP(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOtpSubmitting((prev) => ({
        ...prev,
        [platform]: false,
      }));
    }
  };

  const verifyOTP = async () => {
    setOtpSubmitting((prev) => ({
      ...prev,
      ["sms"]: true,
    }));
    if (otp === verificationCode) {
      console.log("Verified");
      try {
        const { data } = await axios.post(
          "https://mazinda.com/api/auth/continue-with-otp",
          { phoneNumber }
        );

        if (data.success) {
          await AsyncStorage.setItem("user_token", data.user_token);
          dispatch(setUser(data.user));
          handleDismissModalPress();
          resetComponent();
        } else {
          console.log("Error has occurred");
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
      }
    } else {
      setOtpIncorrect(true);
    }
    setOtpSubmitting((prev) => ({
      ...prev,
      ["sms"]: false,
    }));
  };

  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,

            elevation: 24,

            // padding: 20,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  marginVertical: 10,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {canProceedOTP
                  ? "Verify OTP"
                  : "Login / Signup for the best experience"}
              </Text>
              <TouchableOpacity onPress={handleDismissModalPress}>
                <AntDesign name="close" size={18} color="black" />
              </TouchableOpacity>
            </View>
            {canProceedOTP ? (
              <View style={{ marginVertical: 15, paddingHorizontal: 20 }}>
                <View
                  style={{
                    alignItems: "left",
                    marginBottom: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "gray",
                      fontSize: 16,
                    }}
                  >
                    We have sent an OTP to +91 {phoneNumber}
                  </Text>
                  <Text
                    style={{
                      color: "gray",
                      fontSize: 16,
                    }}
                  >
                    Please enter it below
                  </Text>
                </View>
                <BottomSheetTextInput
                  value={otp}
                  onChangeText={(text) => setOtp(text)}
                  autoComplete="one-time-code"
                  placeholder="Enter the One-Time-Password sent"
                  maxLength={4}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    borderColor: "lightgray",
                    borderWidth: 1,
                  }}
                />

                {otpIncorrect ? (
                  <Text
                    style={{
                      color: "red",
                      marginTop: 15,
                      marginLeft: 2,
                    }}
                  >
                    The entered One-Time-Password is incorrect
                  </Text>
                ) : null}

                <TouchableOpacity
                  onPress={() => {
                    verifyOTP();
                  }}
                  style={{
                    padding: 12,
                    backgroundColor: "black",
                    // backgroundColor: "#f17e13",
                    width: "100%",
                    borderRadius: 10,
                    marginTop: 25,
                    marginBottom: 20,
                  }}
                >
                  {!otpSubmitting["sms"] ? (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 17,
                        textAlign: "center",
                      }}
                    >
                      Verify OTP
                    </Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20, marginVertical: 15 }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    editable={true}
                    value={"+91"}
                    style={{
                      padding: 12,
                      borderBottomLeftRadius: 10,
                      borderTopLeftRadius: 10,
                      borderColor: "lightgray",
                      borderWidth: 1,
                    }}
                  />
                  <BottomSheetTextInput
                    value={phoneNumber}
                    onChangeText={(value) => {
                      // setPhoneNumber(text)

                      if (value.startsWith("+91") && value.length > 3) {
                        // If so, extract the substring starting from index 3 (after '+91')
                        const phoneNumberWithoutCountryCode =
                          value.substring(3);
                        // Update the state with the extracted phone number
                        setPhoneNumber(phoneNumberWithoutCountryCode);
                      } else {
                        // Otherwise, update the state with the entered value
                        setPhoneNumber(value);
                      }
                    }}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Enter your phone number"
                    maxLength={
                      phoneNumber.startsWith("+91") || phoneNumber === ""
                        ? 13
                        : 10
                    }
                    style={{
                      padding: 12,
                      borderBottomRightRadius: 10,
                      borderTopRightRadius: 10,
                      borderColor: "lightgray",
                      borderWidth: 1,
                      width: "85%",
                    }}
                  />
                </View>

                <TouchableOpacity
                  disabled={phoneNumber.length != 10}
                  onPress={() => {
                    handleLoginWithOTP("sms");
                  }}
                  style={{
                    padding: 12,
                    backgroundColor: "black",
                    // backgroundColor: "#f17e13",
                    width: "100%",
                    borderRadius: 10,
                    marginTop: 25,
                    marginBottom: 20,
                  }}
                >
                  {!otpSubmitting["sms"] ? (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 17,
                        textAlign: "center",
                      }}
                    >
                      Send OTP via SMS
                    </Text>
                  ) : (
                    <ActivityIndicator />
                  )}
                </TouchableOpacity>

                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "gray",
                      textAlign: "center",
                    }}
                  >
                    or
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={phoneNumber.length != 10}
                  onPress={() => {
                    handleLoginWithOTP("whatsapp");
                  }}
                  style={{
                    padding: 12,
                    width: "100%",
                    borderRadius: 10,
                    marginVertical: 25,
                    borderColor: "gray",
                    borderWidth: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                  }}
                >
                  {!otpSubmitting["whatsapp"] ? (
                    <>
                      <Image
                        source={{
                          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png",
                        }}
                        style={{
                          height: 20,
                          width: 20,
                        }}
                      />
                      <Text
                        style={{
                          fontWeight: 600,
                          fontSize: 17,
                          textAlign: "center",
                        }}
                      >
                        Send OTP on WhatsApp
                      </Text>
                    </>
                  ) : (
                    <ActivityIndicator />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

export default AuthModal;
