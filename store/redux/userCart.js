import { createSlice } from "@reduxjs/toolkit";

const userCart = createSlice({
  name: 'userCart',
	initialState: {
		userEmail: '',
		designerEmail: '',	
  },
 
  reducers: {
    setCart: (state, action) => {
      state.userEmail = action.payload.userEmail
      state.designerEmail = action.payload.designerEmail

    },

    resetCart: (state, action) =>{
      state.userEmail = ''
      state.designerEmail = ''
    }
  }
})
export const setCart = userCart.actions.setCart
export const resetCart = userCart.actions.resetCart

export default userCart.reducer;
