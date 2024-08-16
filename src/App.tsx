import AppRoute from "./routes/appRoute";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";


axios.defaults.baseURL = "http://127.0.0.1:3000/api"

function App() {
  return (
    <BrowserRouter>
      <AppRoute />
    </BrowserRouter>
  );
}

export default App;
