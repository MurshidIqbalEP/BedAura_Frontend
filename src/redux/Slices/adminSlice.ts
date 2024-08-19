import {createSlice} from "@reduxjs/toolkit"

const storedAdminInfo = localStorage.getItem('adminInfo');

const initialState = {
    adminInfo: storedAdminInfo ? JSON.parse(storedAdminInfo) : null,
  };

const adminAuthSlice=createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        setAdminCredentials:(state,action)=>{
            state.adminInfo=action.payload;
            localStorage.setItem('adminInfo',JSON.stringify(action.payload));
        },
        adminLogout:(state)=>{
            state.adminInfo=null;
            localStorage.removeItem('adminInfo');
        }

    }
})

export const {setAdminCredentials,adminLogout} = adminAuthSlice.actions

export default adminAuthSlice.reducer
