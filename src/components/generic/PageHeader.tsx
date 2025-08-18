import Typography from "@mui/material/Typography";

export const PageHeader = ({text}: {text: string}) => {
  return (
    <>
      <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)", pb: 1 }}
      >
          {text}
      </Typography>
    </>
  );
};