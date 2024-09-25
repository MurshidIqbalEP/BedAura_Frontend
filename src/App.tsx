import AppRoute from "./routes/appRoute";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/socketContext";

function App() {
  return (
   
    <BrowserRouter>
 <SocketProvider>
      <AppRoute />
      </SocketProvider>
    </BrowserRouter>
    
  );
}

export default App;
