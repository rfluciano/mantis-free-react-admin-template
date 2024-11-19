import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import axis from 'axis';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TableSortLabel, Pagination } from '@mui/material';
import Dot from 'components/@extended/Dot';
import LongMenu from './UserMenu';

function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  // Handle null or empty values
  const isValueAEmpty = valueA === null || valueA === undefined || valueA === '';
  const isValueBEmpty = valueB === null || valueB === undefined || valueB === '';

  if (isValueAEmpty && !isValueBEmpty) return 1;  // `a` is empty, place it lower
  if (!isValueAEmpty && isValueBEmpty) return -1; // `b` is empty, place it lower
  if (isValueAEmpty && isValueBEmpty) return 0;   // Both are empty, treat as equal

  // Standard descending comparison
  if (valueB < valueA) return -1;
  if (valueB > valueA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'matricule', align: 'left', label: 'Matricule' },
  { id: 'email', align: 'left', label: 'Email' },
  { id: 'discriminator', align: 'left', label: 'Rôle' },
  { id: 'isactive', align: 'left', label: 'Statut' },
  { id: 'action', align: 'left', label: 'Action' },
];

function UserTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UserTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

function StatusIndicator({ isactive }) {
  const color = isactive ? 'success' : 'warning';
  const title = isactive ? 'Actif' : 'Inactif';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

StatusIndicator.propTypes = {
  isactive: PropTypes.bool.isRequired,
};

export default function UserTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('matricule'); // Default column
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1); // Current page (1-based index for Pagination)
  const rowsPerPage = 9; // Max rows per page

  // Fetch users data on component mount
  useEffect(() => {
    axis.get('/users')
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  }, []);

  // Handle sort request
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => setPage(newPage);

  // Sorted and paginated users
  const sortedAndPaginatedUsers = useMemo(() => {
    const sortedData = [...users].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, users]);

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          '& td, & th': { whiteSpace: 'nowrap' },
        }}
      >
        <Table aria-labelledby="tableTitle">
          {/* Pass sorting props to the Table Head */}
          <UserTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedUsers.map((user) => (
              <TableRow key={user.matricule}>
                <TableCell>{user.matricule}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user?.discriminator === 'unitychief' ? "Chef d'unité" : 'Administrateur'}
                </TableCell>
                <TableCell><StatusIndicator isactive={user.isactive} /></TableCell>
                <TableCell><LongMenu /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(users.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
