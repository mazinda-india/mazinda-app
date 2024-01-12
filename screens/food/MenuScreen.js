import { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";

const MenuScreen = ({ route }) => {
  const { vendor } = route.params;
  const [cart, setCart] = useState({});

  console.log(vendor.menu);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          padding: 15,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
          }}
        >
          {vendor.name}
        </Text>

        <View>
          {Object.keys(vendor.menu).map((category, index) => (
            <View
              key={index}
              style={{
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 10,
                padding: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {category}
              </Text>

              {vendor.menu[category].map((item) => (
                <View>
                  <Text>{item.name}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;
