
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./components/home/Home";
import { AuthProvider } from "./components/context/AuthContext";
import { Login } from "./components/home/Login";
import { Navbar } from "./components/Navbar";
import CssBaseline from "@mui/material/CssBaseline";
import { Register } from "./components/user/Register";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserPage } from "./components/user/UserPage";
import { createTheme, ThemeProvider } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { VerificationPage } from "./components/user/VerificationPage";
import { LogoutPage } from "./components/user/LogoutPage";

const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: deepPurple,
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <CssBaseline /> 
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/verify" element={<VerificationPage />}></Route>
          <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
          <Route path="/logout" element={<PrivateRoute><LogoutPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;

