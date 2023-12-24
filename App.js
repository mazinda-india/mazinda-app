import StackNavigator from './navigation/StackNavigator';
import { Provider } from 'react-redux'
import store from './store';
import { ModalPortal } from 'react-native-modals';
import { ToastProvider } from 'react-native-toast-notifications'

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