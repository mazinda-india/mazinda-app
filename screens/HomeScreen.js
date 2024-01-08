import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Navbar from "../components/Navbar";
import Story from "../components/home/Story";
import Subcategories from "../components/home/Subcategories";
import Categories from "../components/home/Categories";

import { ScrollView } from "react-native-virtualized-view";
import HorizontalProductList from "../components/utility/HorizontalProductList";
import { fetchUserData } from "../redux/UserReducer";
import { fetchStoriesData } from "../redux/StoryReducer";
import { fetchCart } from "../redux/CartReducer";
import Carousel from "../components/utility/Carousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckInternet from "../components/CheckInternet";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    dispatch(fetchStoriesData());

    (async () => {
      const user_token = await AsyncStorage.getItem("user_token");
      if (user_token) {
        dispatch(fetchUserData());
        dispatch(fetchCart());
      }
    })();
  }, []);

  const top_carousel_img = [1, 2, 3, 4].map(
    (counter) =>
      `https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/top-carousel/${counter}.jpeg`
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navbar showSearchBar={isConnected} />
      {isConnected ? (
        <ScrollView>
          <Story />

          <View
            style={{
              height: 120,
            }}
          >
            <Carousel
              image_paths={top_carousel_img}
              showDotsIndicator={false}
            />
          </View>

          <View style={{ padding: 10 }}>
            <Subcategories />
          </View>

          <View
            style={{
              marginVertical: 20,
            }}
          >
            <Image
              source={{
                uri: "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_one.JPG",
              }}
              style={{
                width: "100%",
                height: 50,
              }}
              resizeMode="contain"
            />
          </View>

          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Categories
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Categories")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textDecorationLine: "underline",
                    marginRight: 10,
                  }}
                >
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <Categories />
          </View>

          <View style={{ padding: 10, marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 15,
              }}
            >
              Mazinda Top Deals
            </Text>
            <HorizontalProductList filter={"top-deal"} />
          </View>

          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 15,
              }}
            >
              Trending Products
            </Text>
            <HorizontalProductList filter={"trending"} />
          </View>

          <Pressable
            onPress={() => Linking.openURL("https://store.mazinda.com")}
            style={{
              marginVertical: 20,
            }}
          >
            <Image
              source={{
                uri: "https://mazindabucket.s3.ap-south-1.amazonaws.com/home-page/banner_end.JPG",
              }}
              style={{
                width: "100%",
                height: 100,
              }}
              resizeMode="contain"
            />
          </Pressable>
        </ScrollView>
      ) : null}

      <CheckInternet
        isConnected={isConnected}
        setIsConnected={setIsConnected}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
