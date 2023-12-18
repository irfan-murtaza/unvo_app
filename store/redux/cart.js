import { createSlice } from "@reduxjs/toolkit";

const cart = createSlice({
  name: 'cart',
  initialState: {
    cartPrice: 0,
    cartProducts: []
  },
  reducers: {
    setCartPrice: (state, action) => {
      state.cartPrice = action.payload.cartPrice
    },
    addCartPrice: (state, action) => {
      state.cartPrice = state.cartPrice + action.payload.cartPrice
    },
    resetCartPrice: (state, action) =>{
      state.cartPrice = 0
    },
    addProductInCart: (state, action) =>{
      state.cartProducts = [...state.cartProducts, action.payload.product]
    },
    resetCartProduct: (state, action) =>{
      state.cartProducts = []
    }
  }
})
export const setCartPrice = cart.actions.setCartPrice
export const addCartPrice = cart.actions.addCartPrice
export const resetCartPrice = cart.actions.resetCartPrice
export const addProductInCart = cart.actions.addProductInCart
export const resetCartProduct = cart.actions.resetCartProduct

export default cart.reducer;