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
    buyNowCart: [],
    isLoading: false,
    isError: false,
  },
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
      const itemPresent = state.cart.find(
        (item) => item._id === action.payload._id
      );

      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload });
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
      console.log(itemPresent);
      if (itemPresent) {
        if (itemPresent.quantity >= itemPresent.minQuantity + 1) {
          itemPresent.quantity--;

          if (itemPresent.quantity === 0) {
            const cart_with_item_removed = state.cart.filter(
              (item) => item._id !== action.payload._id
            );
            state.cart = cart_with_item_removed;
          }
        } else if (itemPresent.quantity == itemPresent.minQuantity) {
          // If quantity is equal to minQuantity, remove the item from the cart
          const cart_with_item_removed = state.cart.filter(
            (item) => item._id !== action.payload._id
          );
          state.cart = cart_with_item_removed;
        }
      }
    },

    clearCart: (state, action) => {
      state.cart = [];
    },
    setBuyNowCart: (state, action) => {
      state.buyNowCart = action.payload;
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
  setBuyNowCart,
} = CartSlice.actions;

export default CartSlice.reducer;
