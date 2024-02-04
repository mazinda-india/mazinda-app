import {
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Text,
} from "react-native";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ProductCard from "../components/utility/ProductCard";

const CategoryScreen = ({ route }) => {
  const { categoryName } = route.params;

  const [pageLoading, setPageLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const currentLocation = useSelector((state) => state.location.location);
  const locationLoading = useSelector((state) => state.location.isLoading);
  const userMode = useSelector((state) => state.user.userMode);

  const fetchData = async () => {
    const availablePincodes = currentLocation.pincodes;
    const { data } = await axios.post(
      `https://mazinda.com/api/product/fetch-products?category=${categoryName}`,
      { availablePincodes }
    );
    if (data.success) {
      if (userMode === "business") {
        const filterPromises = data.products.map(async (item) => {
          const { data: storeData } = await axios.post(
            "https://mazinda.com/api/store/fetch-store",
            { storeId: item.storeId }
          );

          if (storeData.success) {
            console.log(storeData);
            return storeData.store.businessType.includes("b2b");
          } else {
            return false;
          }
        });

        const filterResults = await Promise.all(filterPromises);
        const filteredProducts = data.products.filter(
          (item, index) => filterResults[index]
        );

        setProducts(filteredProducts);
      } else {
        setProducts(data.products);
      }
    }
    setPageLoading(false);
  };

  useEffect(() => {
    if (Object.keys(currentLocation).length !== 0) {
      fetchData();
    }
  }, [currentLocation, locationLoading]);

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
