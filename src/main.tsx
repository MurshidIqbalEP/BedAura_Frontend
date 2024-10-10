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

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId='1009282809407-sh8h2kgmot2q295a503sl5530pldnaj9.apps.googleusercontent.com'>
  
    <NextUIProvider>
      <ToastContainer />
      <Toaster  position="bottom-right"/>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  
  </GoogleOAuthProvider>
);
