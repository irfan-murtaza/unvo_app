import { createSlice } from "@reduxjs/toolkit";

const userData = createSlice({
  name: 'userData',
  initialState: {
    userEmail: '',
    userType: '',
    userName: '',
    brandName: '',
    brandLogo: ''
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload.email
    },
    setUserType: (state, action) => {
      state.userType = action.payload.userType
    },
    setUserName: (state, action) =>{
      state.userName = action.payload.name
    },
    setUserBrandName: (state, action) =>{
      state.brandName = action.payload.brandName
    },
    setBrandLogo: (state, action) =>{
      state.brandLogo = action.payload.brandLogo
    },
    setNameEmailType: (state, action) =>{
      state.userEmail = action.payload.email
      state.userType = action.payload.userType
      state.userName = action.payload.name
    },
    deleteUserState: (state) => {
      state.userEmail = ''
      state.userType = ''
    }
  }
})
export const setUserEmail = userData.actions.setUserEmail
export const setUserType = userData.actions.setUserType
export const setUserName = userData.actions.setUserName
export const setUserBrandName = userData.actions.setUserBrandName
export const setBrandLogo = userData.actions.setBrandLogo
export const setNameEmailType = userData.actions.setNameEmailType
export const deleteUserState = userData.actions.deleteUserState

export default userData.reducer;