import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { PageHeader } from "../generic/PageHeader";
import { FormError } from "../generic/FormError";

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMessage: string;
  isLoading: boolean;
}

export const RegisterForm = (props: Props) => {
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [firstNameMessage, setFirstNameMessage] = useState<string>("");
  const [lastNameMessage, setLastNameMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");
  const [passwordConfirmationMessage, setPasswordConfrimationMessage] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const reset = () => {
    setEmailMessage("");
    setFirstNameMessage("");
    setLastNameMessage("");
    setPasswordMessage("");
    setErrors([]);
  }

  const validateInput = (): boolean => {
    let isError = false;
    const email = document.getElementById("email") as HTMLInputElement;
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const passwordConfirmation = document.getElementById("passwordConfirmation") as HTMLInputElement;

    reset();

    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value.trim())) {
      setErrors(prev => [...prev, "Enter valid email."]);
      setEmailMessage("Enter valid email.")
      isError = true;
    }
    if (!firstName.value.trim()) {
      setErrors(prev => [...prev, "Enter first name."]);
      setFirstNameMessage("Enter first name.")
      isError = true;
    }
    if (!lastName.value.trim()) {
      setErrors(prev => [...prev, "Enter last name."]);
      setLastNameMessage("Enter last name.")
      isError = true;
    }
    if (!password.value.trim()) {
      setErrors(prev => [...prev, "Enter password."]);
      setPasswordMessage("Enter password.")
      isError = true;
    }

    if (password.value !== passwordConfirmation.value) {
      setErrors(prev => [...prev, "Enter password."]);
      setPasswordConfrimationMessage("Enter password.")
      isError = true;
    }

    return isError;
  }
  
  return (
    <>
      <PageHeader text="Register" />
      {props.isLoading &&
        <Button loading>Default</Button>
      }
      <FormError message={props.errorMessage} errors={errors} />
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