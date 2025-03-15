import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from './routes/client/index.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css'
import './i18n/i18n.tsx';
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Index />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StrictMode>
)
