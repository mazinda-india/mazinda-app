import { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { addEventListener } from "@react-native-community/netinfo";
import { fetch } from "@react-native-community/netinfo";
import { Feather } from "@expo/vector-icons";

const CheckInternet = ({ isConnected, setIsConnected }) => {
  useEffect(() => {
    // Subscribe
    const unsubscribe = addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Unsubscribe
      unsubscribe();
    };
  }, []);

  const checkConnection = () => {
    fetch().then((state) => {
      if (!state.isConnected) {
        Alert.alert("No Internet Connection");
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {isConnected ? null : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            paddingHorizontal: 20,
          }}
        >
          <Feather name="wifi-off" size={150} color="darkgray" />
          <Text
            style={{
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            No Internet
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Please check your internet connection and try again
          </Text>

          <TouchableOpacity
            onPress={() => checkConnection()}
            style={{
              backgroundColor: "black",
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CheckInternet;
