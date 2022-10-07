import { createSlice } from "@reduxjs/toolkit";

const products = createSlice({
  name: 'userData',
  initialState: {
    recentAddedProductName: '',
    recentDeletedProductName: '',
    recentEditedProductName: ''
  },
  reducers: {
    setRecentAddedProductName: (state, action) => {
      state.recentAddedProductName = action.payload.productName
    },
    setRecentDeletedProductName: (state, action) => {
      state.recentDeletedProductName = action.payload.productName
    },
    setRecentEditedProductName: (state, action) =>{
      state.recentEditedProductName = action.payload.productName
    },
  }
})
export const setRecentAddedProductName = products.actions.setRecentAddedProductName
export const setRecentDeletedProductName = products.actions.setRecentDeletedProductName
export const setRecentEditedProductName = products.actions.setRecentEditedProductName

export default products.reducer;