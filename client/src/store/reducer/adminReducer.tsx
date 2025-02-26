import { createAction, createReducer } from '@reduxjs/toolkit'

interface Admin {
    role: string,
    token: string
}

interface App {
    email: string,
    nameApp: string,
    logo: string
}

const initalState = {
    admin: { role: "", token: "" },
    app: {
        email: "",
        nameApp: "",
        logo: ""
    }
};

export const adminDoLogin = createAction<Admin>('admin/adminDoLogin')
export const adminDoLogout = createAction('admin/adminDoLogout')
export const adminEditApp = createAction<App>('admin/editApp')

const adminReducer = createReducer(initalState, builder => {
    builder.addCase(adminDoLogin, (state, action) => {
        state.admin = action.payload;
    }).addCase(adminDoLogout, (state) => {
        state.admin = initalState.admin;
    }).addCase(adminEditApp, (state, action) => {
        state.app = action.payload;
    })
})

export default adminReducer;
