import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Navbar from "../components/Navbar";
import Story from "../components/home/Story";
import Subcategories from "../components/home/Subcategories";
import Categories from "../components/home/Categories";

import { ScrollView } from "react-native-virtualized-view";
import HorizontalProductList from "../components/utility/HorizontalProductList";
import { fetchUserData } from "../redux/UserReducer";
import { fetchStoriesData } from "../redux/StoryReducer";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchStoriesData());
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navbar />
      <ScrollView>
        <Story />

        <View style={{ padding: 10 }}>
          <Subcategories />
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
            <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
