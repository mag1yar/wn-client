import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HYDRATE } from "next-redux-wrapper"
import { RootState } from "../store"
import { UserDto } from "../types/users"

export interface UserState {
    data: UserDto | null
}

const initialState: UserState = {
    data: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserDto | null>) => {
            state.data = action.payload
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.user,
            }
        },
    },
})

export const { setUserData } = userSlice.actions

export const selectUserData = (state: RootState) => state.user.data

export const userReducer = userSlice.reducer
