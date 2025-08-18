import { Alert, Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { PageHeader } from "../generic/PageHeader";

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMessage: string;
}

export const RegisterForm = (props: Props) => {
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [firstNameMessage, setFirstNameMessage] = useState<string>("");
  const [lastNameMessage, setLastNameMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordConfirmationMessage, setPasswordConfrimationMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const validateInput = (): boolean => {
    const email = document.getElementById("email") as HTMLInputElement;
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const passwordConfirmation = document.getElementById("passwordConfirmation") as HTMLInputElement;

    setEmailMessage("");
    setPasswordMessage("");
    setIsError(false);

    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value.trim())) {
      setEmailMessage("Enter valid email.")
      setIsError(true);
    }
    if (!firstName.value.trim()) {
      setFirstNameMessage("Enter first name.")
      setIsError(true);
    }
    if (!lastName.value.trim()) {
      setLastNameMessage("Enter last name.")
      setIsError(true);
    }
    if (!password.value.trim()) {
      setPasswordMessage("Enter password.")
      setIsError(true);
    }

    if (password.value !== passwordConfirmation.value) {
      setPasswordConfrimationMessage("Enter password.")
      setIsError(true);
    }

    return isError;
  }
  
  return (
    <>
      <PageHeader text="Register" />
      {props.errorMessage &&
        <Alert severity="error">{props.errorMessage}</Alert>
      }
      <Box 
          // sx={{ mt: 4, p: 3,  }}
          sx={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 2 }}
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
            error={firstNameMessage !== ""}
            helperText={firstNameMessage}
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
            error={lastNameMessage !== ""}
            helperText={lastNameMessage}
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
            error={passwordConfirmationMessage !== ""}
            helperText={passwordConfirmationMessage}
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
    </>
  );
};