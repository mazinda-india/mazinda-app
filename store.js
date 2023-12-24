import { configureStore } from '@reduxjs/toolkit';
import CartReducer from './redux/CartReducer';
import AuthReducer from './redux/AuthReducer';

export default configureStore({
    reducer: {
        cart: CartReducer,
        auth: AuthReducer,
    }
})