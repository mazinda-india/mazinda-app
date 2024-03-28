import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "./BottomTabs";

export default function Router() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
