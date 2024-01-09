import StackNavigator from "./navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./store";
import { ModalPortal } from "react-native-modals";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
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
