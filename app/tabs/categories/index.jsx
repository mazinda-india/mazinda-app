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
import Navbar from "../../../components/Navbar";
import axios from "axios";
import { FlatList } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { useNavigation } from "@react-navigation/native";

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderCategory = (item) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Category", {
          categoryName: item.categoryName,
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Navbar />
      <ScrollView>
        <View
          style={{
            marginTop: 17,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 27,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Browse Categories
          </Text>

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;
