import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { NumericFormat } from 'react-number-format';
import Dot from 'components/@extended/Dot';
import axis from 'axis';
import PositionMenu from './PositionMenu';

const headCells = [
  { id: 'id_position', align: 'left', label: 'ID Poste' },
  { id: 'title', align: 'left', label: 'Titre' },
  { id: 'isavailable', align: 'left', label: 'Disponibilité' },
  { id: 'created_at', align: 'left', label: 'Created At' },
  { id: 'action', align: 'left', label: 'Action' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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

function AvailabilityIndicator({ isAvailable }) {
  const color = isAvailable ? 'success' : 'error';
  const title = isAvailable ? 'Vacant' : 'Occupé';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function PositionTable() {
  const [positions, setPositions] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_position');
  const [page, setPage] = useState(1);
  const rowsPerPage = 9; // Set max rows per page to 9

  useEffect(() => {
    axis
      .get('/position')
      .then((response) => setPositions(response.data || []))
      .catch((error) => console.error('Error fetching position data:', error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const sortedAndPaginatedData = useMemo(() => {
    const sortedData = [...positions].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, positions]);

  return (
    <Box sx={{margin:-2.5, padding:0}}>
      <TableContainer>
        <Table>
          <PositionTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedAndPaginatedData.map((position) => (
              <TableRow key={position.id_position} hover>
                <TableCell>
                  <Link color="secondary">{position.id_position}</Link>
                </TableCell>
                <TableCell>{position.title}</TableCell>
                <TableCell>
                  <AvailabilityIndicator isAvailable={position.isavailable} />
                </TableCell>
                <TableCell>{new Date(position.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <PositionMenu/>
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
    </Box>
  );
}

PositionTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

AvailabilityIndicator.propTypes = {
  isAvailable: PropTypes.bool.isRequired,
};
