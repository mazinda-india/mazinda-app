import {
  Image,
  StyleSheet,
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

const CategoriesScreen = () => {
  const { width, height } = useWindowDimensions();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderCategory = (item) => (
    <TouchableOpacity
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
          padding: 5,
          overflow: "hidden",
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            width: 120,
            height: 120,
          }}
          source={{ uri: item.categoryImage }}
        />
      </View>
      <Text
        style={{
          fontWeight: 600,
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {item.storeName}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    setLoading(true);
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
            }}
          >
            Browse Categories
          </Text>

          <FlatList
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

const styles = StyleSheet.create({});
