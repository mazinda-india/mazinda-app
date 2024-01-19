import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import UserReducer from "./redux/UserReducer";
import StoryReducer from "./redux/StoryReducer";
import LocationReducer from "./redux/LocationReducer";

export default configureStore({
  reducer: {
    cart: CartReducer,
    user: UserReducer,
    location: LocationReducer,
    stories: StoryReducer,
  },
});
