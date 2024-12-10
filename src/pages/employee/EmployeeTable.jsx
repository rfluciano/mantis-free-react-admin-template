import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Pagination,
  Stack,
} from '@mui/material';
import SortableTableHead from './SortableTableHead';
import Dot from 'components/@extended/Dot';
import LongMenu from './EmployeeMenu';
import ModifyModal from './Modify';
import ViewModal from './View';
import DisableModal from './Disable';

const headCells = [
  { id: 'matricule', align: 'left', label: 'Matricule' },
  { id: 'name', align: 'left', label: 'Nom' },
  { id: 'firstname', align: 'left', label: 'Prénom' },
  { id: 'position.title', align: 'left', label: 'Poste' },
  { id: 'isequipped', align: 'left', label: "Statut d'équipement" },
  { id: 'action', align: 'left', label: 'Action' },
];

function getComparator(order, orderBy) {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  if (valueA === null || valueA === undefined || valueA === '') return 1;
  if (valueB === null || valueB === undefined || valueB === '') return -1;
  if (valueB < valueA) return -1;
  if (valueB > valueA) return 1;
  return 0;
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



function EmployeeTable({ employees }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('matricule');
  const [openModal, setOpenModal] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const rowsPerPage = 9;
  const [page, setPage] = useState(1);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const sortedAndPaginatedEmployees = useMemo(() => {
    const sortedData = [...employees].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, employees]);

  const handleAction = (action, employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenModal(action);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSelectedEmployeeId(null); // Clear selected employee after closing modal
  };

  function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (valueA === null || valueA === undefined || valueA === '') return 1;
    if (valueB === null || valueB === undefined || valueB === '') return -1;
    if (valueB < valueA) return -1;
    if (valueB > valueA) return 1;
    return 0;
}

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return <StyledValueBox>--//--</StyledValueBox>;
  }
  return value;
};


  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <SortableTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedEmployees.map((employee) => (
              <TableRow key={employee.matricule}>
                <TableCell>{formatValue(employee.matricule)}</TableCell>
                <TableCell>{formatValue(employee.name)}</TableCell>
                <TableCell>{formatValue(employee.firstname)}</TableCell>
                <TableCell>{formatValue(employee.position.title)}</TableCell>
                <TableCell>
                  <EmployeeStatus isequipped={employee.isequipped} />
                </TableCell>
                <TableCell>
                  <LongMenu employeeId={employee.matricule} onAction={handleAction} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(employees.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {openModal === 'modify' && (
        <ModifyModal employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
      {openModal === 'view' && (
        <ViewModal employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
      {openModal === 'disable' && (
        <DisableModal employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
    </Box>
  );
}

function EmployeeStatus({ isequipped }) {
  const color = isequipped ? 'success' : 'error';
  const statusText = isequipped ? 'Equipé' : 'Non équipé';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{statusText}</Typography>
    </Stack>
  );
}

EmployeeStatus.propTypes = { isequipped: PropTypes.bool.isRequired };

EmployeeTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      matricule: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      firstname: PropTypes.string.isRequired,
      position: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
      isequipped: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default EmployeeTable;
