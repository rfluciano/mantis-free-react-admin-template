import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import axis from 'axis';
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
import LongMenu from './UnityMenu';

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
  { id: 'id_unity', align: 'left', label: 'ID Unité' },
  { id: 'parent', align: 'left', label: 'Unité Parent' },
  { id: 'type', align: 'left', label: 'Type' },
  { id: 'title', align: 'left', label: 'Titre' },
  { id: 'action', align: 'left', label: 'Action' },
];

function UnityTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {onRequestSort(event, property) ;console.log("Click")};

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
              onClick={createSortHandler(headCell.id) }
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

UnityTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

export default function UnityTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_unity');
  const [unity, setUnity] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 9;

  useEffect(() => {
    axis
      .get('/unity')
      .then((response) => setUnity(response.data || []))
      .catch((error) => console.error('Failed to fetch unity:', error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    console.log("CLick2");
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const sortedAndPaginatedData = useMemo(() => {
    const sortedData = [...unity].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, unity]);

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
          <UnityTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedData.map((unit) => (
              <TableRow key={unit.id_unity} hover>
                <TableCell>{unit.id_unity}</TableCell>
                <TableCell>
                  {unit.parent
                    ? `${unit.parent.type} ${unit.parent.title}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{unit.type}</TableCell>
                <TableCell>{unit.title}</TableCell>
                <TableCell>
                  <LongMenu />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(unity.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
