// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import { ToastContainer } from 'react-toastify'
import './App.css'
import AppRoutes from './routes/Routes'
import { PopupContextProvider } from './context/hooks/usePopUp'
import AuthProvider from './context/hooks/Auth'

function App() {
    return (
    <PopupContextProvider>
        <AuthProvider>
            <AppRoutes />
            {/* <ToastContainer toastClassName={({ type }) =>
                type === "success"
                ? "bg-emerald-600 text-white"
                : type === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white"
            }
            progressClassName="!h-[2px] bg-black/20"
            autoClose={2000}
            /> */}
            <ToastContainer />
        </AuthProvider>
    </PopupContextProvider>)
}

export default App
