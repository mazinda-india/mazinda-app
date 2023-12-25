import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import UserReducer from "./redux/UserReducer";

export default configureStore({
  reducer: {
    cart: CartReducer,
    user: UserReducer,
  },
});
