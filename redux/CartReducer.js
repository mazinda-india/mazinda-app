import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const itemPresent = state.cart.find(item => item._id === action.payload._id);

            if (itemPresent) {
                itemPresent.quantity++
            } else {
                state.cart.push({ ...action.payload, quantity: 1 })
            }
        },
        removeFromCart: (state, action) => {
            const cart_with_item_removed = state.cart.filter(item => item._id !== action.payload._id);
            state.cart = cart_with_item_removed;
        },
        incrementQuantity: (state, action) => {
            const itemPresent = state.cart.find(item => item._id === action.payload._id);
            itemPresent.quantity++
        },
        decrementQuantity: (state, action) => {
            const itemPresent = state.cart.find(item => item._id === action.payload._id);
            if (itemPresent.quantity === 1) {
                itemPresent.quantity = 0
                const cart_with_item_removed = state.cart.filter(item => item._id !== action.payload._id);
                state.cart = cart_with_item_removed;
            }
            else {
                itemPresent.quantity--
            }
        },
        clearCart: (state, action) => {
            state.cart = [];
        }
    }
})

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = CartSlice.actions;

export default CartSlice.reducer