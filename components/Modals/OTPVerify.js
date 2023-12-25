import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useState, useRef } from "react";
import MazindaLogo from "../../assets/logo/logo_mazinda_full.png";
// import axios from "axios";

const OTPVerify = ({
  otpModalVisible,
  setOtpModalVisible,
  credentials,
  verificationCode,
  setOtpVerified,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const refs = Array.from({ length: 4 }, () => useRef());

  const handleOtpChange = (index, value) => {
    if (value.length === 1 && index < 3) {
      refs[index + 1].current.focus();
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    let enteredOTP = "";
    for (digit of otp) {
      enteredOTP += digit;
    }

    if (enteredOTP !== verificationCode) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 4000);
      return;
    } else {
      setOtpVerified(true);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={otpModalVisible}
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
            marginTop: 18,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "500",
            }}
          >
            OTP Verify
          </Text>
        </View>

        <View
          style={{
            marginVertical: 45,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              color: "#BDBDBD",
              fontWeight: "700",
            }}
          >
            Enter the OTP sent to{"  "}
            <Text
              style={{
                color: "black",
                fontWeight: 600,
                fontSize: 19,
              }}
            >
              +91 {credentials.phone}
            </Text>
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={refs[index]}
                style={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  borderColor: error ? "red" : "gray",
                  borderRadius: 22,
                  marginHorizontal: 5,
                  fontSize: 24,
                  textAlign: "center",
                  color: "gray",
                }}
                value={value}
                onChangeText={(text) => handleOtpChange(index, text)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {error ? "The entered verification code is incorrect" : ""}
          </Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{
              backgroundColor: "black",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 100,
              marginHorizontal: 40,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "white",
                fontWeight: "600",
              }}
            >
              Verify OTP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOtpModalVisible(false)}
            style={{
              marginVertical: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                color: "gray",
              }}
            >
              Didn't receive a code? Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default OTPVerify;
