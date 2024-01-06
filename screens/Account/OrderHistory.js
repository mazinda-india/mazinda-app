import { View, Text, SafeAreaView } from "react-native";
import OrderList from "../../components/utility/OrderList";

const CurrentOrders = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <OrderList filter={"delivered"} />
    </SafeAreaView>
  );
};

export default CurrentOrders;
