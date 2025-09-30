import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, TablePagination } from "@mui/material";
import React from "react";
import { visuallyHidden } from "@mui/utils";

export interface ColumnDefinition<TData, K extends keyof TData> {
  key: K;
  header: string;
  renderCell?: (row: TData) => React.ReactNode;
  numeric: boolean;
}

interface DataTableProps<TData, K extends keyof TData> {
  data: TData[];
  columns: ColumnDefinition<TData, K>[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
      return -1;
  }
  if (b[orderBy] > a[orderBy]) {
      return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

export const DataTable = <TData, K extends keyof TData>({ data, columns }: DataTableProps<TData, K>) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TData>(columns[0].key);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const getComparator = <T, Key extends keyof T>(
      orderBy: Key,
      order: "asc" | "desc"
    ): (a: T, b: T) => number => {
      return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TData) => {
    const isAsc = orderBy === property && order === "asc";
    console.log(typeof event);
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof TData) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(typeof event);
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(orderBy, order))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data],
  );

  // const emptyRows =
  //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                    key={String(column.key)}
                    sortDirection={orderBy === String(column.key) ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === String(column.key)}
                      direction={orderBy === String(column.key) ? order : "asc"}
                      onClick={createSortHandler(column.key)}
                    >
                      {column.header}
                      {orderBy === String(column.key) ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell
                    key={String(column.key)}
                    align={column.numeric ? "right" : "left"}>
                    {column.renderCell ? column.renderCell(row) : String(row[column.key])}
                  </TableCell>                
                ))}
              </TableRow>
            ))}
            {visibleRows.length == 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>No data to display.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
      </TableContainer>
      
    </Paper>
  );
}