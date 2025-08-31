import { Alert, Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { FormError } from "../generic/FormError";
import { PageHeader } from "../generic/PageHeader";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../utils/API";
import type { User } from "../context/AuthContext";

export const Profile = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [emailMessage, setEmailMessage] = useState<string>("");
  const [firstNameMessage, setFirstNameMessage] = useState<string>("");
  const [lastNameMessage, setLastNameMessage] = useState<string>("");
  const [user, setUser] = useState<User>({
      id: "",
      email: "",
      firstName: "",
      lastName: ""
    });

  const {data: userData, isFetched} = useQuery({
    queryKey: ["user"],
    queryFn: () => API.getUser(),
  });

  useEffect(() => {   
    if (isFetched) {
      setUser({
        email: userData?.data?.email || "",
        firstName: userData?.data?.firstName || "",
        lastName: userData?.data?.lastName || ""
      });
    }    
  }, [isFetched]);

  const reset = () => {
    setEmailMessage("");
    setFirstNameMessage("");
    setLastNameMessage("");
    setErrors([]);
    setIsSubmit(false);
  }

  const { mutate: updateUser } = useMutation({
      mutationFn: API.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries();
            setIsLoading(false);
            setIsSubmit(true);
        },
        onError: (err) => {
            console.error(err);
            setErrorMessage("There is an issue with the update. Please try again.");
        }
    });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUser({...user, [event.target.name]: event.target.value});
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      updateUser({email: user.email || "", firstName: user.firstName || "", lastName: user.lastName || ""});
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("There is an issue with registration. Please try again.")
    }
  }

  const validateInput = (): boolean => {
    let isError = false;
    const email = document.getElementById("email") as HTMLInputElement;
    const firstName = document.getElementById("firstName") as HTMLInputElement;
    const lastName = document.getElementById("lastName") as HTMLInputElement;

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

    return isError;
  }

  return (
    <>
      <PageHeader text="Profile" />
        {isLoading &&
          <Button loading></Button>
        }
        <FormError message={errorMessage} errors={errors} />
        {isSubmit &&
          <Alert severity="success">
              Update is successful.
          </Alert>
        }
        <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 2 }}
            component="form"
            onSubmit={handleSubmit}
        >
          <FormControl fullWidth>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              value={user.email}
              variant="outlined"
              disabled
              onChange={handleChange}
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
              value={user.firstName}
              variant="outlined"
              onChange={handleChange}
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
              value={user.lastName}
              variant="outlined"
              onChange={handleChange}
              error={lastNameMessage !== ""}
              helperText={lastNameMessage}
            />
          </FormControl>
          <Button 
            type="submit"
            variant="contained"
            color="primary"
            onClick={validateInput}>
            Update
          </Button>
        </Box>
    </>
  );
}