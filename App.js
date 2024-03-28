import { Provider } from "react-redux";
import { ModalPortal } from "react-native-modals";
import { ToastProvider } from "react-native-toast-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthModal from "./components/modals/auth/AuthModal";
import store from "./store";
import Router from "./navigation/Router";

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <Provider store={store}>
            <Router />
            <ModalPortal />
            <AuthModal />
          </Provider>
        </ToastProvider>
      </GestureHandlerRootView>
    </>
  );
}

// IOS: 872492645215-vjq8n4427v4vfmqele54k6b7nu7v61kk.apps.googleusercontent.com
// Android: 872492645215-a9jkn8vhig4b57uidk63ns5dljhbb65g.apps.googleusercontent.com
