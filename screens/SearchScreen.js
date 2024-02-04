import {
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/utility/ProductCard";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = ({ route }) => {
  const toast = useToast();
  const user = useSelector((state) => state.user.user);
  const userMode = useSelector((state) => state.user.userMode);

  const userLoggedIn = Object.keys(user).length ? true : false;

  const { searchQuery } = route.params;
  const currentLocation = useSelector((state) => state.location.location);
  const [loading, setLoading] = useState(true);
  const [querySubmitLoading, setQuerySubmitLoading] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const availablePincodes = currentLocation.pincodes;

      const { data } = await axios.post(
        `https://mazinda.com/api/product/fetch-search-products?searchQuery=${searchQuery}&type=${
          userMode === "business" ? "b2b" : "b2c"
        }`,
        {
          availablePincodes,
        }
      );

      console.log("data", data);

      if (data.success) {
        // if (userMode === "business") {
        //   const filterPromises = data.products.map(async (item) => {
        //     const { data: storeData } = await axios.post(
        //       "https://mazinda.com/api/store/fetch-store",
        //       { storeId: item.storeId }
        //     );

        //     if (storeData.success) {
        //       return storeData.store.businessType.includes("b2b");
        //     } else {
        //       return false;
        //     }
        //   });

        //   const filterResults = await Promise.all(filterPromises);
        //   const filteredProducts = data.products.filter(
        //     (item, index) => filterResults[index]
        //   );

        // setProducts(filteredProducts);
        // } else {
        setProducts(data.products);
        // }
      }
      setLoading(false);

      const userToken = await AsyncStorage.getItem("user_token");

      // If products are available with this search query, then add them to the SearchQueryTrack for service improvements
      if (Object.keys(data.products).length) {
        await axios.post("https://mazinda.com/api/track/search-details", {
          userToken,
          searchQuery,
        });
      }
    })();
  }, [searchQuery]);

  const handleReportSearch = async () => {
    setQuerySubmitLoading(true);
    const userToken = await AsyncStorage.getItem("user_token");

    await axios.post(
      "https://mazinda.com/api/whatsapp/msg-to-team/user-search-query",
      {
        userToken,
        search_query: searchQuery,
      }
    );
    toast.show(
      "Your Query has been reported. The team will respond to you shortly"
    );
    setQuerySubmitLoading(false);
  };

  const renderProductItem = ({ item }) => <ProductCard item={item} />;

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Navbar searchQuery={searchQuery} />

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
      <Navbar searchQuery={searchQuery} />
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
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/vectors/no-result-vector.png")}
              alt="No Result"
            />
            <Text
              style={{
                fontSize: 20,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              No results found for "{searchQuery}"
            </Text>
            <Text
              style={{
                paddingHorizontal: 18,
                color: "gray",
                textAlign: "center",
              }}
            >
              Please check the spelling or try searching for something else
            </Text>
          </View>

          {userLoggedIn ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
                marginTop: 50,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                If you want "{searchQuery}" to be added shortly to Mazinda,
                kindly report here.
              </Text>
              <TouchableOpacity
                onPress={handleReportSearch}
                style={{
                  backgroundColor: !querySubmitLoading
                    ? "#f97316"
                    : "lightgray",
                  borderRadius: 10,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  marginTop: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  {!querySubmitLoading ? "Report" : "Reporting..."}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 12,
                padding: 10,
                marginTop: 50,
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                If you want "{searchQuery}" to be added shortly to Mazinda,
                kindly text us here.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://api.whatsapp.com/send?phone=917876901177&text=Hey Mazinda,%20I%20searched%20for%20"${searchQuery}"%20but%20no%20results%20were%20found%20%20Kindly%20get%20the%20product%20available%20as%20soon%20as%20possible.`
                  )
                }
                style={{
                  marginTop: 15,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  borderRadius: 10,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text>Open in</Text>
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG_Qlic-yLMcHdWinAWUOHMs_GYSF8FfjjQtHZD6Xt3hsOeTlD1rYWRxMKPJoJ9Dn6L04&usqp=CAU",
                  }}
                  style={{
                    height: 40,
                    width: 100,
                  }}
                  alt="Whatsapp"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
