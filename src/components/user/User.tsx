import Container from "@mui/material/Container";
import { UserTransactions } from "./UserTransactions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const UserPage = () => {
  return (
    <>
      <Container maxWidth="sm" sx={{p: 2}}>
        <QueryClientProvider client={queryClient}>
          <UserTransactions />
        </QueryClientProvider>        
      </Container>
    </>
  );
};