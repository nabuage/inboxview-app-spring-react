import React, { useContext, useState } from "react";
import { AuthContext, type User } from "../context/AuthContext";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";
import { API } from "../utils/API";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const Auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const response = await API.authenticate({email: email, password: password});

    if (response.accessToken) {
      Auth?.setUserAuth(response);
      
      const userResponse = await API.getUser();

      const authenticatedUser: User = {
          id: userResponse.id,
          email: email,
          firstName: userResponse.firstName,
          lastName: userResponse.lastName
      };

      Auth?.userLogin(authenticatedUser);

      setEmail("");
      setPassword("");
      setIsError(false);

      navigate("/user");
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
        <Card variant="outlined" sx={{p: 3}}>
          <Typography
              component="h1"
              variant="h4"
              sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", pb: 1 }}
          >
              Login
          </Typography>
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
        </Card>
      </Container>
    </>
  );
}