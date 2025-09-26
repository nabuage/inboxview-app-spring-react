import React from "react";
import type { ColumnDefinition, Order } from "./GenericTableHead";
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from "@mui/material";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHead } from "./DataTableHead";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  columnId: string;
  select: boolean;
  title: string;
}

export default function DataTable<T>(props: DataTableProps<T>) {
  const {data, columns, columnId, select, title} = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof T>();
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n[columnId]);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data],
  );
  
  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {select && 
        <DataTableToolbar numSelected={selected.length} title={title} />
      }      
      <TableContainer>
        <Table
          // sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? 'small' : 'medium'}
        >
          <DataTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            columns={columns}
            select={select}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = selected.includes(row[columnId]);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
                    onClick={(event) => handleClick(event, row[columnId])}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                  //  key={row.id}
                    selected={isItemSelected}
                  //  sx={{ cursor: 'pointer' }}
                >
                  {select && 
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                  }
                  
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>
                      {column.render ? column.render(row) : (column.id ? String(row[column.id]) : "")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6}></TableCell>
              </TableRow>
            )}
            {visibleRows.length == 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6}>No data.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}