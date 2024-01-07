import {
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation, useLocationLoading } from "../contexts/LocationContext";
import axios from "axios";
import ProductCard from "../components/utility/ProductCard";

const CategoryScreen = ({ route }) => {
  const { categoryName } = route.params;

  const [pageLoading, setPageLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const selectedLocation = useLocation();
  const locationLoading = useLocationLoading();

  const fetchData = async () => {
    const availablePincodes = selectedLocation.pincodes;
    const { data } = await axios.post(
      `https://mazinda.com/api/product/fetch-products?category=${categoryName}`,
      { availablePincodes }
    );
    setProducts(data.products);
    setPageLoading(false);
  };

  useEffect(() => {
    if (Object.keys(selectedLocation).length !== 0) {
      fetchData();
    }
  }, [selectedLocation, locationLoading]);

  const renderProductItem = ({ item }) => <ProductCard item={item} />;

  if (pageLoading) {
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
            height: "90%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navbar />

      <Text
        style={{
          textAlign: "center",
          fontSize: 22,
          marginVertical: 10,
          fontWeight: 500,
        }}
      >
        Browsing "{categoryName}"
      </Text>
      {products.length ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          style={{ marginTop: 10 }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "gray",
            }}
          >
            Coming Soon
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CategoryScreen;
