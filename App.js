import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { ToastProvider } from "react-native-toast-notifications";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert, Linking } from "react-native";
import axios from "axios";

//       light blue gray : "#b7c9e230",

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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://mazinda.com/api/fetch-app-version"
        );

        if (data.app_version > 2) {
          Alert.alert(
            "App Update Available",
            "A new version of Mazinda is available\nKindly update the app for latest features and bug fixes",
            [
              {
                text: "Update Now",
                onPress: () =>
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.abhey_gupta.MazindaApp"
                  ),
              },
              { text: "Later", style: "cancel" },
            ]
          );
        }
      } catch (err) {
        Alert.alert(`Oops, a network error occurred`);
      }
    })();
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
