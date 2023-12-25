import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useState, useRef } from "react";
import MazindaLogo from "../../assets/logo/logo_mazinda_full.png";
import { useToast } from "react-native-toast-notifications";
// import axios from "axios";

const OTPScreen = ({ route }) => {
  const { credentials, verificationCode } = route.params;

  const toast = useToast();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
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
    console.log(enteredOTP);

    if (enteredOTP !== verificationCode) {
      toast.show("The verification code entered is incorrect");
      return;
    } else {
      setLoading(true);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
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
            +91 {credentials.phoneNumber}
          </Text>
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
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
                borderColor: "gray",
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
      </View>

      <View>
        <TouchableOpacity
          onPress={() => handleSubmit()}
          style={{
            backgroundColor: "#FE6321",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            marginTop: 10,
            marginHorizontal: 40,
          }}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color="white" />
          ) : (
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
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
