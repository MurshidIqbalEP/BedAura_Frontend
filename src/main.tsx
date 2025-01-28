import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner'
const apiUrl = import.meta.env.VITE_GID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={apiUrl}>
  
    <NextUIProvider>
      <ToastContainer />
      <Toaster  position="bottom-right"/>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  
  </GoogleOAuthProvider>
);
