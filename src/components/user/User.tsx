import Container from "@mui/material/Container";
import { UserTransactions } from "./UserTransactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const User = ({children}: {children?: React.ReactNode}) => {
  return (
    <>
      <Container maxWidth="sm" sx={{p: 2}}>
        <QueryClientProvider client={queryClient}>
          {children ? children : <UserTransactions />}          
        </QueryClientProvider>
      </Container>
    </>
  );
};