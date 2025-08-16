import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const RegisterForm = (props: Props) => {
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const validateInput = (): boolean => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;        

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
    <Box 
        // sx={{ mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        component="form"
        onSubmit={props.handleSubmit}
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
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <TextField
          required
          fullWidth
          id="firstName"
          name="firstName"
          variant="outlined"
          error={emailMessage !== ""}
          helperText={emailMessage}
        />
      </FormControl>
      <FormControl fullWidth>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <TextField
          required
          fullWidth
          id="lastName"
          name="lastName"
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
      <FormControl fullWidth>
        <FormLabel htmlFor="passwordConfirmation">Confirm Password</FormLabel>
        <TextField
          required
          fullWidth
          id="passwordConfirmation"
          type="password"
          placeholder=""
          name="passwordConfirmation"
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
        Register
      </Button>
    </Box>
  );
};