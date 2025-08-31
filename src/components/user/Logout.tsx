import { useContext, useEffect, useState } from "react";
import { API } from "../utils/API";
import { Alert, AlertTitle, Container, Paper } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export const Logout = () => {
  const auth = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    logout();
  }, []);

  const logout = async () => {
    if (auth !== undefined) {
      try {        
          const response = await API.logout(auth?.getUserAuth());
        
          if (response.data !== undefined) {
            setErrorMessage("");
          }
          
          if (response.error != undefined) {
            setErrorMessage(response.error.error);
          }
      } catch (error) {
        console.error("Logout error:", error);
        setErrorMessage("Cannot logout. Please try again.");
      }

      auth.userLogout();
    }
  }
  
  return (
    <Container maxWidth="sm" sx={{p: 2}}>
      <Paper variant="elevation" square={false} sx={{p: 3}}>
        {errorMessage
          ? 
            <Alert severity="error">
              <AlertTitle>Logout</AlertTitle>
              {errorMessage}
            </Alert>
          :
            <Alert severity="success">
              Logout successful.
            </Alert>
        }
      </Paper>
    </Container>
  );
};