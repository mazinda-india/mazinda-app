import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./redux/CartReducer";
import UserReducer from "./redux/UserReducer";
import StoryReducer from "./redux/StoryReducer";
import LocationReducer from "./redux/LocationReducer";
import BottomModalsReducer from "./redux/BottomModalsReducer";
import OptionsReducer from "./redux/OptionsReducer";

export default configureStore({
  reducer: {
    cart: CartReducer,
    user: UserReducer,
    location: LocationReducer,
    stories: StoryReducer,
    bottomSheetModal: BottomModalsReducer,
    options: OptionsReducer,
  },
});
