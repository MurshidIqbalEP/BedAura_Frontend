import {configureStore} from '@reduxjs/toolkit'
import authSlice from './Slices/authSlice'
import adminSlice from './Slices/adminSlice'



const store=configureStore({
    reducer:{
        auth:authSlice,
        adminAuth:adminSlice,


    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch