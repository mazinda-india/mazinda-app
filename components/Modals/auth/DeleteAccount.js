import React from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const DeleteAccountModal = ({
  deleteAccountModalVisible,
  setDeleteAccountModalVisible,
}) => {
  const { width } = useWindowDimensions();
  const [submitting, setSubmitting] = useState(false);

  const user = useSelector((state) => state?.user?.user);

  const handleSubmitRequest = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/auth/delete-account/create-request",
        {
          userId: user._id,
        }
      );

      console.log(data);

      if (data.success) {
        Alert.alert(
          "Request Submitted Successfully",
          "Our review team will respond to you shortly",
          {
            onDismiss: () => setDeleteAccountModalVisible(false),
          }
        );
      } else {
        Alert.alert(
          "Oops, seems like a network error occurred",
          "Please try again later",
          {
            onDismiss: () => setDeleteAccountModalVisible(false),
          }
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      animationType="slide"
      visible={deleteAccountModalVisible}
      presentationStyle="pageSheet"
      onRequestClose={() => setDeleteAccountModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          padding: 15,
          position: "relative",
        }}
      >
        <View
          style={{
            width,
            alignItems: "left",
          }}
        >
          <Entypo name="cross" size={24} color="black" />
        </View>

        <Text style={{ fontSize: 20, fontWeight: 600, marginVertical: 15 }}>
          Submit Account Deletion Request
        </Text>

        <View style={{ marginBottom: 20, gap: 8 }}>
          <Text>- A request for account deletion will be submitted.</Text>
          <Text>
            - You will need to create a new account if you wish to use our
            services again.
          </Text>
          <Text>
            - Your account won't be deleted while you have an active order
            placed.
          </Text>
          <Text>
            - All of the account related data such as order history will be
            deleted forever.
          </Text>
          <Text>
            - Your data will be permanently deleted upon confirmation.
          </Text>
          <Text>- Once deleted, your account cannot be recovered.</Text>
          <Text>
            - Please ensure you want to delete your account before proceeding.
          </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10,
            marginTop: 20,
          }}
        >
          Privacy Policy
        </Text>

        <View
          style={{
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text>
            Mazinda is committed towards the privacy of the users. See the
            details here
          </Text>
          <Pressable
            onPress={() =>
              Linking.openURL("https://mazinda.com/privacy-policy")
            }
          >
            <Text
              style={{
                textDecorationLine: "underline",
              }}
            >
              privacy policy
            </Text>
          </Pressable>
        </View>

        {/* Add Privacy Policy content here */}

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 25,
            width,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Do you want to delete this account",
                "This action cannot be undone",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Request Deletion",
                    onPress: () => handleSubmitRequest(),
                  },
                ]
              )
            }
            style={{
              padding: 10,
              backgroundColor: "black",
              marginHorizontal: 20,
              width: width * 0.87,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
