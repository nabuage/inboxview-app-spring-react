import React, { useContext, useEffect, useState } from "react";
import { AuthContext, type User } from "../context/AuthContext";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Alert, Paper } from "@mui/material";
import { API } from "../utils/API";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../generic/PageHeader";

export const Login = () => {
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (Auth?.userIsAuthenticated()) {
      Auth?.userLogout();
    }    
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const response = await API.authenticate({email: email, password: password});

    if (response.data !== undefined) {
      Auth?.setUserAuth(response.data);
      
      const userResponse = await API.getUser();

      if (userResponse.data !== undefined) {
        const authenticatedUser: User = {
          id: userResponse.data.id,
          email: email,
          firstName: userResponse.data.firstName,
          lastName: userResponse.data.lastName
        };

        Auth?.userLogin(authenticatedUser);

        setEmail("");
        setPassword("");
        setIsError(false);

        navigate("/user");
      }      
    }
    else {
      if (response.error !== undefined) {
        setErrorMessage(response.error.error);
        setIsError(true);
      }
    }
  }

  const validateInput = (): boolean => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;        

    setEmail(email.value);
    setPassword(password.value);
    setEmailMessage("");
    setPasswordMessage("");
    setIsError(false);

    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailMessage("Enter valid email.")
      setIsError(true);
    }

    if (!password.value.trim()) {
      setPasswordMessage("Enter password.")
      setIsError(true);
    }

    return isError;
  }

  return (
    <>            
      <Container maxWidth="sm" sx={{p: 2}}>
        <Paper variant="elevation" square={false} sx={{p: 3}}>
          {isError &&
            <Alert severity="error">
              {errorMessage}
            </Alert>
          }
          <PageHeader text="Login" />
          <Box 
              // sx={{ mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              component="form"
              onSubmit={handleSubmit}
          >
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailMessage !== ""}
                helperText={emailMessage}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                id="password"
                type="password"
                placeholder=""
                name="password"
                variant="outlined"
                error={passwordMessage !== ""}
                helperText={passwordMessage}
              />
            </FormControl>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              onClick={validateInput}>
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}