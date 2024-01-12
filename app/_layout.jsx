import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store";
import { ModalPortal } from "react-native-modals";
import { ToastProvider } from "react-native-toast-notifications";
import LocationProvider from "../contexts/LocationContext";

const RootLayout = () => {
  return (
    <ToastProvider>
      <Provider store={store}>
        <LocationProvider>
          <Stack>
            <Stack.Screen
              name="tabs"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <ModalPortal />
        </LocationProvider>
      </Provider>
    </ToastProvider>
  );
};

export default RootLayout;
