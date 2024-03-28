import {
  Image,
  Text,
  View,
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import {
  setAllowLocationChange,
  setShowSearchBar,
} from "../redux/OptionsReducer";

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderCategory = (item) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Category", {
          category_id: item._id,
        })
      }
      style={{
        marginHorizontal: 15,
        alignItems: "center",
        gap: 10,
        width: width / 4,
      }}
    >
      <View
        style={{
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            width: 100,
            height: 100,
          }}
          source={{ uri: item.categoryImage }}
        />
      </View>
      <Text
        numberOfLines={1}
        style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      const { data } = await axios.post(
        "https://mazinda.com/api/category/fetch-categories"
      );

      if (data.success) {
        setCategories(data.categories);
      } else {
        return <Alert>Oops... Something Went Wrong !</Alert>;
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    dispatch(setAllowLocationChange(true));
    dispatch(setShowSearchBar(true));
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Navbar />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size={"small"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <Navbar />
      <ScrollView>
        <View>
          <Text style={tw`font-extrabold text-xl px-8 py-4`}>
            BROWSE CATEGORIES
          </Text>

          <View style={tw`items-center`}>
            <FlatList
              gap={25}
              numColumns={3}
              keyExtractor={(item) => item._id}
              data={categories}
              renderItem={({ item }) => renderCategory(item)}
              style={{
                marginVertical: 10,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
