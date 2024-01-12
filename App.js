import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { ToastProvider } from "react-native-toast-notifications";
import * as Updates from "expo-updates";
import { useEffect } from "react";

export default function App() {
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return (
    <>
      <ToastProvider>
        <Provider store={store}>
          <StackNavigator />
          <ModalPortal />
        </Provider>
      </ToastProvider>
    </>
  );
}

// IOS: 872492645215-vjq8n4427v4vfmqele54k6b7nu7v61kk.apps.googleusercontent.com
// Android: 872492645215-a9jkn8vhig4b57uidk63ns5dljhbb65g.apps.googleusercontent.com
