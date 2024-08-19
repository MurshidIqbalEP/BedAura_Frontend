import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId='1009282809407-sh8h2kgmot2q295a503sl5530pldnaj9.apps.googleusercontent.com'>
  <StrictMode>
    <NextUIProvider>
      <ToastContainer />
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </StrictMode>
  </GoogleOAuthProvider>
);
