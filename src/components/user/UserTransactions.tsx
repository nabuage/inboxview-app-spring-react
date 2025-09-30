import { useQuery } from "@tanstack/react-query";
import { API, type UserTransaction } from "../utils/API";
import { useState } from "react";
import { LocalDate } from "@js-joda/core";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { PageHeader } from "../generic/PageHeader";
import { DataTable, type ColumnDefinition } from "../generic/DataTable";

export const UserTransactions = () => {
  const [year, setYear] = useState<number>(LocalDate.now().year());
  const [month, setMonth] = useState<number>(LocalDate.now().monthValue());
  const {data} = useQuery({
    queryKey: ["userTransactions", year, month],
    queryFn: () => API.getUserTransaction(year, month)
  });

  const handleDateChange = (value: dayjs.Dayjs | null, context: { validationError: string | null }) => {
    if (!context.validationError) {
      if (value !== null) {
        setMonth(value?.month() + 1);
        setYear(value?.year());
      }
    }
  }

  const userColumns: ColumnDefinition<UserTransaction, keyof UserTransaction>[] = [
    {
      key: "merchantName",
      header: "Merchant",
      numeric: false
    },
    {
      key: "transactionDate",
      header: "Transaction Date",
      numeric: false
    },
    {
      key: "amount",
      header: "Amount",
      numeric: true
    },
  ];

  return (
    <>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <PageHeader text="Transactions" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              defaultValue={dayjs(LocalDate.now().toString())}
              views={["month", "year"]}
              onAccept={handleDateChange} />
          </LocalizationProvider>        
        </Box>
        <DataTable<UserTransaction, keyof UserTransaction> data={data ?? []} columns={userColumns} />
      </Stack>      
    </>
  );
}