import React, { useState } from "react";
import Container from "@mui/material/Container";
import { Alert, AlertTitle, Paper } from "@mui/material";
import { API } from "../utils/API";
import { RegisterForm } from "./RegisterForm";

export const Register = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await API.register({
          email: formData.get("email")?.toString() || "",
          firstName: formData.get("firstName")?.toString() || "",
          lastName: formData.get("lastName")?.toString() || "",
          password: formData.get("password")?.toString() || "",
          passwordConfirm: formData.get("passwordConfirm")?.toString() || ""
        }).finally(() => {
          setIsLoading(false);
        });

      if (response.data !== undefined) {
        setIsSubmit(true);
        setErrorMessage("");
      }
      
      if (response.error != undefined) {
        setErrorMessage(response.error.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("There is an issue with registration. Please try again.")
    }    
  }

  return (
    <>            
      <Container maxWidth="sm" sx={{p: 2}}>
        <Paper variant="elevation" square={false} sx={{p: 3}}>
          {isSubmit
            ? 
              <Alert severity="success">
                <AlertTitle>Registration Received</AlertTitle>
                Email has been sent that contains a link to confirm your registration.
                Please click the link to complete your registration.
                Thank you.
              </Alert>
            :
              <RegisterForm handleSubmit={handleSubmit} errorMessage={errorMessage} isLoading={isLoading} />
          }
        </Paper>
      </Container>
    </>
  );
}