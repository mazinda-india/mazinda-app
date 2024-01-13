import { SafeAreaView } from "react-native";
import OrderList from "../../components/utility/OrderList";

const MyOrders = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <OrderList filter={"all"} />
    </SafeAreaView>
  );
};

export default MyOrders;
