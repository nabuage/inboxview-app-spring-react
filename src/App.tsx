
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./components/home/Home";
import { AuthProvider } from "./components/context/AuthContext";
import { Login } from "./components/user/Login";
import CssBaseline from "@mui/material/CssBaseline";
import { Register } from "./components/user/Register";
import { User } from "./components/user/User";
import { createTheme, ThemeProvider } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Verification } from "./components/user/Verification";
import { Logout } from "./components/user/Logout";
import { Navbar } from "./components/generic/Navbar";
import { PrivateRoute } from "./components/generic/PrivateRoute";
import { Profile } from "./components/user/Profile";

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
          <Route path="/verify" element={<Verification />}></Route>
          <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><User children={<Profile />} /></PrivateRoute>} />
          <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;

