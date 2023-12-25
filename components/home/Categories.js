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

const Categories = () => {
  const { width, height } = useWindowDimensions();

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
            key={item._id}
            style={{
              marginHorizontal: 5,
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
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
