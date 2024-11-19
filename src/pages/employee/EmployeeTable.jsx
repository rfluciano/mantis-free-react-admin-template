import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axis from 'axis';
import { Box, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Pagination, Link } from '@mui/material';
import SortableTableHead from './SortableTableHead';
import Dot from 'components/@extended/Dot';
import LongMenu from './EmployeeMenu';
import ModifyModal from './Modify';
import ViewModal from './View';
import DisableModal from './Disable';
import View from './View';
import Disable from './Disable';

const headCells = [
  { id: 'matricule', align: 'left', label: 'Matricule' },
  { id: 'name', align: 'left', label: 'Nom' },
  { id: 'firstname', align: 'left', label: 'Prénom' },
  { id: 'position.title', align: 'left', label: 'Poste' },
  { id: 'isactive', align: 'left', label: 'Statut' },
  { id: 'action', align: 'left', label: '' },
];

function EmployeeTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('matricule');
  const [employees, setEmployees] = useState([]);
  const [openModal, setOpenModal] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [page, setPage] = useState(1); // Current page (1-based index for Pagination)
  const rowsPerPage = 9; // Max rows per page

  useEffect(() => {
    axis.get('/employee')
      .then((response) => setEmployees(response.data.employees))
      .catch((error) => console.error('Error fetching employee data:', error));
  }, []);

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

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <SortableTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {sortedAndPaginatedEmployees.map((employee) => (
              <TableRow key={employee.matricule}>
                <TableCell>{employee.matricule}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.firstname}</TableCell>
                <TableCell>{employee.position.title}</TableCell>
                <TableCell><EmployeeStatus isactive={employee.isactive} /></TableCell>
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
        <View employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
      {openModal === 'disable' && (
        <Disable employeeId={selectedEmployeeId} open={true} onClose={handleCloseModal} />
      )}
    </Box>
  );
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  const keys = orderBy.split('.');
  let aValue = a;
  let bValue = b;

  for (const key of keys) {
    aValue = aValue[key];
    bValue = bValue[key];
  }

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function EmployeeStatus({ isactive }) {
  const color = isactive ? 'success' : 'warning';
  const statusText = isactive ? 'Active' : 'Inactive';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{statusText}</Typography>
    </Stack>
  );
}

EmployeeStatus.propTypes = { isactive: PropTypes.bool.isRequired };

export default EmployeeTable;
