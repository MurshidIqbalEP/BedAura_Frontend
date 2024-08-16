import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from '@nextui-org/react'
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NextUIProvider>
    <ToastContainer />
      <App />
    </NextUIProvider>

  </StrictMode>,
)
