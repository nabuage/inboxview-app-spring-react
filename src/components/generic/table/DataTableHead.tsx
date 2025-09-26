import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';

export interface ColumnDefinition<T> {
  id: keyof T;
  title: string;
  render?: (row: T) => React.ReactNode;
  accessorKey?: keyof T;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

export type Order = 'asc' | 'desc';

interface DataTableHeadProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  columns: ColumnDefinition<T>[];
  select: boolean;
}

export const DataTableHead = <T,>(props: DataTableHeadProps<T>) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns,select } =
      props;
    const createSortHandler =
      (property: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

  return (
    <TableHead>
      <TableRow>        
        {select && 
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        }
        
        {columns.map((column) => (
          <TableCell
            key={column.id}
            align={column.numeric ? 'right' : 'left'}
            padding={column.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.title}
              {orderBy === column.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}