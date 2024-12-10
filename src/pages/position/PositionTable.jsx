import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, Pagination } from '@mui/material';
import Dot from 'components/@extended/Dot';
import PositionMenu from './PositionMenu';
import Modify from './Modify';
import View from './View';
import Disable from './Disable';

const headCells = [
  { id: 'id_position', align: 'left', label: 'ID Poste' },
  { id: 'title', align: 'left', label: 'Titre' },
  { id: 'isavailable', align: 'left', label: 'Disponibilité' },
  { id: 'created_at', align: 'left', label: 'Date de création' },
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

function PositionTableHead({ order, orderBy, onRequestSort }) {
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

PositionTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

function AvailabilityIndicator({ isavailable }) {
  const color = isavailable ? 'success' : 'error';
  const title = isavailable ? 'Disponible' : 'Occupé';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

AvailabilityIndicator.propTypes = {
  isavailable: PropTypes.bool.isRequired,
};

export default function PositionTable({ positions }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_position');
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  const handleAction = (action, employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenModal(action);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedEmployeeId(null); // Clear selected employee after closing modal
  };

  const rowsPerPage = 9;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const sortedAndPaginatedPositions = useMemo(() => {
    const sortedPositions = [...positions].sort(getComparator(order, orderBy));
    return sortedPositions.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, positions]);

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer>
        <Table>
          <PositionTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedPositions.map((position) => (
              <TableRow key={position.id_position}>
                <TableCell>{position.id_position}</TableCell>
                <TableCell>{position.title}</TableCell>
                <TableCell>
                  <AvailabilityIndicator isavailable={position.isavailable} />
                </TableCell>
                <TableCell>
                  {new Date(position.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <PositionMenu positionId={position.id_position} onAction={handleAction} /> {/* Replace with your menu */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(positions.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {openModal === 'modify' && (
        <Modify employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
      {openModal === 'view' && (
        <View employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
      {openModal === 'disable' && (
        <Disable employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
    </Box>
  );
}

PositionTable.propTypes = {
  positions: PropTypes.array.isRequired,
};
