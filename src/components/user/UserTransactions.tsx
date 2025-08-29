import { useQuery } from "@tanstack/react-query";
import { API, type UserTransaction } from "../utils/API";
import { useMemo, useState } from "react";
import { DataTable } from "../generic/DataTable";
import type { MRT_ColumnDef } from "material-react-table";
import { LocalDate } from "@js-joda/core";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { PageHeader } from "../generic/PageHeader";

export const UserTransactions = () => {
  const [year, setYear] = useState<number>(LocalDate.now().year());
  const [month, setMonth] = useState<number>(LocalDate.now().monthValue());
  const {data} = useQuery({
    queryKey: ["userTransactions", year, month],
    queryFn: () => API.getUserTransaction(year, month)
  });

  const totalAmount = useMemo(() => {
      if (data == null || data?.length == 0) {
        return null;
      }

      return data.reduce((acc, curr) => acc + curr.amount, 0);
    },
    [data]
  );

  const columns = useMemo<MRT_ColumnDef<UserTransaction>[]>(
    () => [
      {
        accessorKey: "merchantName",
        header: "Merchant",
      },
      {
        accessorKey: "transactionDate",
        header: "Transaction Date",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        Footer: () => (
          <>
            {totalAmount != null &&
              <>Total: {totalAmount.toFixed(2)}</>
            }
          </>
        )
      }
    ],
    [totalAmount],
  );

  const handleDateChange = (value: dayjs.Dayjs | null, context: { validationError: string | null }) => {
    if (!context.validationError) {
      if (value !== null) {
        setMonth(value?.month() + 1);
        setYear(value?.year());
      }
    }
  }

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
        <DataTable columns={columns} data={data ?? []} />
      </Stack>      
    </>
  );
}