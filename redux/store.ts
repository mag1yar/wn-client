import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import { userReducer } from "./reducers/users"

export function makeStore() {
    return configureStore({
        reducer: { user: userReducer },
    })
}

export const store = makeStore()

export type RootStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<RootStore["getState"]>
export type RootDispatch = typeof store.dispatch
export type RootThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export const wrapper = createWrapper<RootStore>(makeStore)
