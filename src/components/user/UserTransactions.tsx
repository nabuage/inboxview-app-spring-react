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
import type { ColumnDefinition } from "../generic/table/GenericTableHead";
import DataTable from "../generic/table/DataTable";

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

  const userColumns: ColumnDefinition<UserTransaction>[] = [
    {
      title: 'Merchant', accessorKey: 'merchantName',
      id: "merchantName",
      numeric: false,
      disablePadding: false,
      label: 'Merchant'
    },
    {
      title: 'Date', accessorKey: 'transactionDate',
      id: "transactionDate",
      numeric: false,
      disablePadding: false,
      label: 'Transaction Date'
    },
    {
      title: 'Amount', accessorKey: 'amount',
      id: "amount",
      numeric: false,
      disablePadding: false,
      label: 'Amount'
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
        <DataTable data={data ?? []} columns={userColumns} columnId="transactionId" select={false} title=""/>
      </Stack>      
    </>
  );
}