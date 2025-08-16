import { useEffect, useState } from "react";
import { API } from "../utils/API";
import { Alert, AlertTitle, Container, Link, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";

export const VerificationPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [errorMessage, setErrorMessage] = useState<string>("r");

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const response = await API.verifyUser({id: params.get("id") || "", code: params.get("code") || ""});
      
      if (response.data !== undefined) {
        setErrorMessage("");
      }
      
      if (response.error != undefined) {
        setErrorMessage(response.error.error);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("Cannot complete the verification.");
    }
  }
  
  return (
    <Container maxWidth="sm" sx={{p: 2}}>
      <Paper variant="elevation" square={false} sx={{p: 3}}>
        {errorMessage
          ? 
            <Alert severity="error">
              <AlertTitle>Registration Verification</AlertTitle>
              {errorMessage}
            </Alert>
          :
            <Alert severity="success">
              <AlertTitle>Registration Verification</AlertTitle>
              Your registration is complete.<br/>
              <Link href="/login">Click here to login.</Link>
            </Alert>
        }
      </Paper>
    </Container>
  );
};