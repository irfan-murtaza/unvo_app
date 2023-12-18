import { configureStore }from '@reduxjs/toolkit';

import userData from './userData';
import products from './products';
import cart from './cart';
import userCart from './userCart';
export const store = configureStore({
  reducer: {
    userData: userData,
    products: products,
    cart: cart,
    userCart: userCart
  }
})