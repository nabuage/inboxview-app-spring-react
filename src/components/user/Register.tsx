import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";
import { API } from "../utils/API";
import { RegisterForm } from "./RegisterForm";

export const Register = () => {
  // const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const user = API.register({
        email: formData.get("email")?.toString() || "",
        firstName: formData.get("firstName")?.toString() || "",
        lastName: formData.get("lastName")?.toString() || "",
        password: formData.get("password")?.toString() || "",
        passwordConfirm: formData.get("passwordConfirm")?.toString() || ""
      });
    console.log(user);
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
              Register
          </Typography>
          <RegisterForm handleSubmit={handleSubmit} />
        </Card>
      </Container>
    </>
  );
}