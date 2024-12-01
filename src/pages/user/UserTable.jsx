import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Pagination } from '@mui/material';
import Dot from 'components/@extended/Dot';
import UserMenu from './UserMenu'; // Replace with appropriate import path

// Define the table headers
const headCells = [
  { id: 'matricule', align: 'left', label: 'Matricule' },
  { id: 'username', align: 'left', label: 'Nom' },
  { id: 'discriminator', align: 'left', label: 'Rôle' },
  { id: 'isactive', align: 'left', label: 'Statut' },
  { id: 'action', align: 'center', label: 'Action' },
];

// Utility to handle descending comparison with null/empty checks
function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  if (valueA === null || valueA === undefined || valueA === '') return 1;
  if (valueB === null || valueB === undefined || valueB === '') return -1;
  if (valueB < valueA) return -1;
  if (valueB > valueA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
  const color = isactive ? 'success' : 'error';
  const title = isactive ? 'Actif' : 'Inactif';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

const StyledValueBox = ({ children }) => (
  <Box
    sx={{
      display: 'inline-block',
      backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue
      borderRadius: '5px',
      padding: '4px 8px',
      fontWeight: 500,
    }}
  >
    {children}
  </Box>
);

StatusIndicator.propTypes = {
  isactive: PropTypes.bool.isRequired,
};

export default function UserTable({ users }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('matricule');
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <StyledValueBox>--//--</StyledValueBox>;
    }
    return value;
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const sortedAndPaginatedUsers = useMemo(() => {
    const sortedUsers = [...users].sort(getComparator(order, orderBy));
    return sortedUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, users]);

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer>
        <Table>
          <UserTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedUsers.map((user) => (
              <TableRow key={user.matricule}>
                <TableCell>{formatValue(user.matricule)}</TableCell>
                <TableCell>{formatValue(user.username)}</TableCell>
                <TableCell>
                  {formatValue(user.discriminator === 'unitychief' ? "Chef d'unité" : 'Administrateur')}
                </TableCell>
                <TableCell>
                  <StatusIndicator isactive={user.isactive} />
                </TableCell>
                <TableCell align="center">
                  <UserMenu /> {/* Replace with the actual menu component */}
                </TableCell>
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

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
};
