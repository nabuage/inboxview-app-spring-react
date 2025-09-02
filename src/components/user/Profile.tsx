import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Stack, TextField } from "@mui/material";
import { FormError } from "../generic/FormError";
import { PageHeader } from "../generic/PageHeader";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../utils/API";
import { AuthContext, type User } from "../context/AuthContext";

export const Profile = () => {
  const auth = useContext(AuthContext);
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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

  const { mutate: deleteUser } = useMutation({
      mutationFn: API.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries();
            auth?.userLogout();
        },
        onError: (err) => {
            console.error(err);
            setErrorMessage("There is an issue with the delete. Please try again.");
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

  const handleDelete = () => {
    setOpenDialog(true);    
  }

  const handleDeleteConfirmation = () => {
    deleteUser();
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{
              justifyContent: "space-between"
            }}
          >
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              onClick={validateInput}>
              Update
            </Button>
            <Button 
              variant="contained"
              color="error"
              onClick={handleDelete}>
              Delete
            </Button>
          </Stack>          
        </Box>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Account Confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your account will be deleted and you will be automatically logged out.
              Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmation} color="error">Yes</Button>
            <Button onClick={handleCloseDialog} color="primary">No</Button>
          </DialogActions>
        </Dialog>
    </>
  );
}