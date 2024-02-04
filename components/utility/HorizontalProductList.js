import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import ProductCard from "../utility/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const HorizontalProductList = ({ filter }) => {
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentLocation = useSelector((state) => state.location.location);
  const locationLoading = useSelector((state) => state.location.isLoading);
  const userMode = useSelector((state) => state.user.userMode);

  const fetchData = async () => {
    const availablePincodes = currentLocation.pincodes;

    const { data } = await axios.post(
      `https://mazinda.com/api/product/fetch-products?filter=${filter}`,
      {
        availablePincodes,
      }
    );
    if (data.success) {
      // setProducts(data.products);

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
    setLoading(false);
  };

  useEffect(() => {
    if (Object.keys(currentLocation).length !== 0) {
      fetchData();
    }
  }, [currentLocation, locationLoading]);

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {products.map((item) => (
        <View
          key={item._id}
          style={{
            width: width / 2.25,
            marginRight: 10,
          }}
        >
          <ProductCard item={item} />
        </View>
      ))}
    </ScrollView>
  );
};

export default HorizontalProductList;
