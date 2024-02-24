import { Pressable, Text, View, TouchableHighlight } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { ScrollView } from "react-native-virtualized-view";
import CouponModal from "../modals/CouponModal";
import { useEffect, useState } from "react";
import ItemList from "./ItemList";
import PricingBox from "./PricingBox";

const PlaceOrder = ({
  itemData,
  deliveryAddress,
  selectedPaymentMethod,
  pricing,
  setPricing,
}) => {
  const [coupon, setCoupon] = useState({});
  const [couponsModalVisible, setCouponsModalVisible] = useState(false);

  useEffect(() => {
    if (Object.keys(coupon).length) {
      if (coupon.discountType === "fixed") {
        if (coupon.discountOn === "delivery") {
          if (coupon.discount > pricing.delivery_fees) {
            setPricing({
              ...pricing,
              coupon_discount: pricing.delivery_fees,
            });
          } else {
            setPricing({
              ...pricing,
              coupon_discount: coupon.discount,
            });
          }
        } else if (coupon.discountOn === "subtotal") {
          if (coupon.discount > pricing.total_salesPrice) {
            setPricing({
              ...pricing,
              coupon_discount: pricing.total_salesPrice,
            });
          } else {
            setPricing({
              ...pricing,
              coupon_discount: coupon.discount,
            });
          }
        }
      }

      // Handle case for coupons based on percentage
      else if (coupon.discountType === "percentage") {
        if (coupon.discountOn === "delivery") {
          if (
            parseFloat((coupon.discount * pricing.delivery_fees) / 100) >
            coupon.maxLimit
          ) {
            setPricing({
              ...pricing,
              coupon_discount: coupon.maxLimit,
            });
          } else {
            setPricing({
              ...pricing,
              coupon_discount: parseFloat(
                (coupon.discount * pricing.delivery_fees) / 100
              ),
            });
          }
        } else if (coupon.discountOn === "subtotal") {
          if (
            parseFloat((coupon.discount * pricing.total_salesPrice) / 100) >
            coupon.maxLimit
          ) {
            setPricing({
              ...pricing,
              coupon_discount: coupon.maxLimit,
            });
          } else {
            setPricing({
              ...pricing,
              coupon_discount: parseFloat(
                (coupon.discount * pricing.total_salesPrice) / 100
              ),
            });
          }
        }
      }
    }
  }, [coupon]);

  useEffect(() => {
    setPricing({
      ...pricing,
      final_price: pricing.coupon_discount
        ? pricing.total_salesPrice +
          pricing.service_charge +
          pricing.delivery_fees -
          pricing.coupon_discount
        : pricing.total_salesPrice +
          pricing.service_charge +
          pricing.delivery_fees,
    });
  }, [pricing.coupon_discount]);

  return (
    <ScrollView
      style={{
        flex: 1,
        marginBottom: 100,
        backgroundColor: "#b7c9e230",
        padding: 10,
      }}
    >
      <CouponModal
        pricing={pricing}
        itemData={itemData}
        setCoupon={setCoupon}
        couponsModalVisible={couponsModalVisible}
        setCouponsModalVisible={setCouponsModalVisible}
      />

      <ItemList itemData={itemData} allowQuantityChange={false} />

      <View
        style={{
          backgroundColor: "white",
          flexDirection: "row",
          paddingHorizontal: 20,
          gap: 8,
          alignItems: "center",
          justifyContent: "space-between",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,

          borderRadius: 10,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 13 }}>DELIVER TO</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginBottom: 3,
                  color: "#4f5b67",
                }}
              >
                {deliveryAddress.name}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {deliveryAddress.subaddress}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                {deliveryAddress.city}
                {", "}
                {deliveryAddress.state}
                {", "}
                {deliveryAddress.pincode}
                {", IN"}
              </Text>

              <Text style={{ fontSize: 14, color: "#777777" }}>
                +91 {deliveryAddress.phone}
              </Text>
            </View>
          </View>
        </View>
        <MaterialIcons name="navigate-next" size={24} color="black" />
      </View>

      <Pressable
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: "white",
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontWeight: 800,
            fontSize: 18,
            marginBottom: 10,
            color: "gray",
          }}
        >
          Payment Method
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
            }}
          >
            {selectedPaymentMethod === "pod"
              ? "PAY ON DELIVERY / CASH ON DELIVERY"
              : selectedPaymentMethod === "online"
              ? "PAY ONLINE ( UPI, CARD)"
              : null}
          </Text>

          {/* <MaterialIcons name="navigate-next" size={24} color="black" /> */}
        </View>
      </Pressable>

      <TouchableHighlight
        underlayColor={"#b7c9e210"}
        onPress={() => setCouponsModalVisible(true)}
        style={{
          paddingVertical: 15,
          paddingHorizontal: 20,
          backgroundColor: "white",
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <>
          {Object.keys(coupon).length ? (
            <View
              style={{
                gap: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <AntDesign name="checkcircle" size={24} color="#22c55e" />
                <View
                  style={{
                    borderColor: "#22c55e",
                    borderStyle: "dashed",
                    borderWidth: 1,
                    padding: 4,
                    borderRadius: 7,
                    marginLeft: 5,
                  }}
                >
                  <Text
                    style={{
                      color: "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    {coupon.code}
                  </Text>
                </View>
                <Text>applied</Text>
              </View>
              <View>
                <Text
                  style={{
                    marginLeft: 35,
                  }}
                >
                  You save: ₹{pricing.coupon_discount}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: "gray",
                }}
              >
                Apply a coupon
              </Text>
              <Text
                style={{
                  color: "gray",
                }}
              >
                Got a Mazinda Coupon? Apply now for exciting discounts on your
                purchase!
              </Text>
            </View>
          )}

          <MaterialIcons name="navigate-next" size={24} color="black" />
        </>
      </TouchableHighlight>

      <PricingBox pricing={pricing} />
      <View
        style={{
          height: 40,
        }}
      ></View>
    </ScrollView>
  );
};

export default PlaceOrder;
