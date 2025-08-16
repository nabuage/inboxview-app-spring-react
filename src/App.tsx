
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/home/Home";
import { AuthProvider } from "./components/context/AuthContext";
import { Login } from "./components/home/Login";
import { Navbar } from "./components/Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import { Register } from "./components/user/Register";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserPage } from "./components/user/UserPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CssBaseline /> 
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
          </Routes>
        </AuthProvider>
        
      </BrowserRouter>
    </>
  )
}

export default App;
