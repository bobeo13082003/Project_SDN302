import { createAction, createReducer } from '@reduxjs/toolkit'

interface User {
    _id: string,
    token: string,
    notification: number
}

const initalState = {
    user: { _id: "", token: "" },
    darkMode: false,
    notification: 0
};

export const doLogin = createAction<User>('user/doLogin')
export const doLogout = createAction('user/doLogout')
export const doDarkMode = createAction<boolean>('user/doDarkMode')
export const doLike = createAction<number>('user/doLike')
export const cancelNotif = createAction('user/cancelNotif')
const userReducer = createReducer(initalState, builder => {
    builder.addCase(doLogin, (state, action) => {
        state.user = action.payload;
    }).addCase(doLogout, (state) => {
        state.user = initalState.user;
    }).addCase(doDarkMode, (state, action) => {
        state.darkMode = action.payload
    }).addCase(doLike, (state, action) => {
        state.notification = action.payload
    }).addCase(cancelNotif, (state) => {
        state.notification = initalState.notification;
    })
})

export default userReducer;
