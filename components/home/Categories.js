import { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Categories = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: 20,
        }}
        horizontal
      >
        {categories.map((item) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Category", {
                categoryName: item.categoryName,
              })
            }
            key={item._id}
            style={{
              marginHorizontal: 3,
              width: width / 3.8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
                overflow: "hidden",
                gap: 8,
              }}
            >
              <Image
                resizeMode="contain"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 100,
                }}
                source={{ uri: item.categoryImage }}
              />
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
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
