import Alert from "@mui/material/Alert";

export const FormError = ({message, errors}: {message: string, errors: string[]}) => {
  return (
    <>
      {message !== "" &&
        <Alert severity="error">{message}</Alert>
      }
      {errors.length !== 0 &&
        <Alert severity="error">
          Please fix the errors below:<br/>
          {
            errors.map((error) => (
              <>- {error} <br/></>
            ))
          }
        </Alert>
      }
    </>    
  );
}