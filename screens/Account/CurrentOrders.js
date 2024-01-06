import { SafeAreaView } from "react-native";
import OrderList from "../../components/utility/OrderList";

const CurrentOrders = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <OrderList filter={"current"} />
    </SafeAreaView>
  );
};

export default CurrentOrders;
