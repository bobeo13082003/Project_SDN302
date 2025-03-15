import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './reducer/userReducer'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminReducer from './reducer/adminReducer';

const persistConfig = {
    key: 'root',
    storage,
}


const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,

});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
