import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchCart = createAsyncThunk("fethCart", async () => {
  const userToken = await AsyncStorage.getItem("user_token");
  if (!userToken) {
    return;
  }
  const { data } = await axios.post("https://mazinda.com/api/user/fetch-user", {
    userToken,
  });
  return data.user.cart;
});

export const updateCartOnServer = createAsyncThunk(
  "updateCart",
  async (newCart, { getState }) => {
    const state = getState();
    const userToken = await AsyncStorage.getItem("user_token");
    const { data } = await axios.post(
      "https://mazinda.com/api/user/cart/set-cart",
      {
        newCart: state.cart.cart,
        userToken,
      }
    );
  }
);

export const CartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    isLoading: false,
    isError: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );

      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const cart_with_item_removed = state.cart.filter(
        (item) => item._id !== action.payload._id
      );
      state.cart = cart_with_item_removed;
    },
    incrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );
      itemPresent.quantity++;
    },
    decrementQuantity: (state, action) => {
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );
      if (itemPresent.quantity === 1) {
        itemPresent.quantity = 0;
        const cart_with_item_removed = state.cart.filter(
          (item) => item._id !== action.payload._id
        );
        state.cart = cart_with_item_removed;
      } else {
        itemPresent.quantity--;
      }
    },
    clearCart: (state, action) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      (state.isLoading = false), (state.cart = action.payload);
    });
    builder.addCase(fetchCart.rejected, (state) => {
      (state.isLoading = false), (state.isError = true);
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = CartSlice.actions;

export default CartSlice.reducer;
