import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import UserReducer from "./redux/UserReducer";
import StoryReducer from "./redux/StoryReducer";

export default configureStore({
  reducer: {
    cart: CartReducer,
    user: UserReducer,
    stories: StoryReducer,
  },
});
