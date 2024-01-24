import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  useWindowDimensions,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CouponModal = ({
  pricing,
  itemData,
  setCoupon,
  couponsModalVisible,
  setCouponsModalVisible,
}) => {
  const currentLocation = useSelector((state) => state.location.location);
  const { height } = useWindowDimensions();

  const [categoryPricing, setCategoryPricing] = useState({});
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to calculate category-wise pricing
    const calculateCategoryPricing = () => {
      const categoryTotals = {};

      // Iterate through each item
      itemData.forEach((item) => {
        const category = item.category;

        // Initialize category totals if not present
        if (!categoryTotals[category]) {
          categoryTotals[category] = {
            total_costPrice: 0,
            total_mrp: 0,
            total_salesPrice: 0,
          };
        }

        // Accumulate prices for all items in the category
        categoryTotals[category].total_costPrice += parseFloat(
          item.pricing.costPrice
        );
        categoryTotals[category].total_mrp += parseFloat(item.pricing.mrp);
        categoryTotals[category].total_salesPrice += parseFloat(
          item.pricing.salesPrice
        );

        setCategoryPricing(categoryTotals);
      });

      setCategoryPricing(categoryTotals);
    };

    // Call the function to calculate category-wise pricing
    calculateCategoryPricing();
  }, [itemData, pricing]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://mazinda.com/api/coupon/fetch-coupon",
        {
          code: appliedCoupon,
        }
      );
      if (data.success) {
        console.log(data);
        if (data.coupon) {
          if (data.coupon.cities.includes(currentLocation.city)) {
            if (data.coupon.isActive) {
              let total = 0;
              for (let key of Object.keys(categoryPricing)) {
                if (data.coupon.categories.includes(key)) {
                  total += parseFloat(categoryPricing[key].total_salesPrice);
                }
              }

              if (total >= data.coupon.minOrder) {
                setCoupon(data.coupon);
                setCouponsModalVisible(false);
              } else {
                setError(
                  `Add items worth ₹${
                    data.coupon.minOrder - total
                  } belonging to ${data.coupon.categories.map(
                    (category) => `'${category}' `
                  )}to avail this coupon.`
                );
              }
            } else {
              setError("Sorry, this coupon has expired.");
            }
          } else {
            setError("Sorry, this coupon is not available in your location.");
          }
        } else {
          setError("Sorry, this coupon is invalid");
        }
      }
    } catch (err) {
      Alert.alert(
        "Oops, something went wrong",
        "A network error occurred. Please try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={couponsModalVisible}
      onBackDropPress={() => setCouponsModalVisible(!couponsModalVisible)}
      animationType="slide"
      onHardwareBackPress={() => setCouponsModalVisible(!couponsModalVisible)}
      onTouchOutside={() => setCouponsModalVisible(!couponsModalVisible)}
    >
      <SafeAreaView
        style={{
          position: "relative",
          height,
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            marginTop: 20,
            gap: 7,
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: "#2e2f34",
              borderWidth: 1.2,
              paddingVertical: 11,
              borderRadius: 4,
              paddingHorizontal: 50,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#2e2f34",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{
              backgroundColor: loading ? "lightgray" : "#2e2f34",
              paddingVertical: 12,
              borderRadius: 4,
              paddingHorizontal: loading ? 45 : 60,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            {loading ? (
              <Text
                style={{
                  fontSize: 15,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Applying...
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 15,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Apply
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              gap: 15,
            }}
          >
            <TouchableOpacity onPress={() => setCouponsModalVisible(false)}>
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                marginVertical: 10,
                fontSize: 19,
                fontWeight: 600,
              }}
            >
              Apply a coupon
            </Text>
          </View>

          <View>
            <TextInput
              value={appliedCoupon}
              onChangeText={(text) => {
                setError("");
                setAppliedCoupon(text.toUpperCase());
              }}
              placeholder="ENTER CODE"
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                fontSize: 19,
                color: "gray",
                fontWeight: "bold",
                paddingVertical: 10,
              }}
            />
          </View>

          <View
            style={{
              marginVertical: 10,
            }}
          >
            {error && (
              <Text
                placeholder="ENTER CODE"
                style={{
                  fontSize: 16,
                  color: "red",
                }}
              >
                {error}
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CouponModal;
