import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axis from 'axis';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TableSortLabel,
  Checkbox,
  Button,
  Pagination,
  TextField,
  MenuItem,
} from '@mui/material';
import LongMenu from './MyResourceMenu';
import { useStateContext } from 'contexts/contextProvider';
import Dot from 'components/@extended/Dot';
import ResourceMenu from './RessourceMenu';
import AvailableResourceMenu from './AvailableResourceMenu';

// Comparator functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, orderBy);
}

const headCells = [
  { id: 'id_resource', align: 'left', label: 'ID Ressource' },
  { id: 'label', align: 'left', label: 'Libellé' },
  { id: 'discriminator', align: 'left', label: 'Type' },
  { id: 'description', align: 'left', label: 'Description' },
  { id: 'isavailable', align: 'left', label: 'Disponibilité' },
  { id: 'id_user_chief', align: 'left', label: 'Responsable' },
  { id: 'action', align: 'left', label: 'Action' },
];

function ResourceTableHead({ order, orderBy, onRequestSort, onSelectAllClick, numSelected, rowCount }) {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
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

ResourceTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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

function AvailabilityIndicator({ isavailable }) {
  const statusMap = {
    Libre: { color: 'success', title: 'Disponible' },
    Pend: { color: 'warning', title: 'En attente' },
    Pris: { color: 'error', title: 'Non disponible' },
  };

  const { color, title } = statusMap[isavailable] || { color: 'default', title: 'Statut inconnu' };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

AvailabilityIndicator.propTypes = {
  isavailable: PropTypes.string.isRequired,
};

export default function AvailableResourceTable({ beneficiaryMatricule, resources }) {
  const { user, messageError, messageSuccess } = useStateContext();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_resource');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const rowsPerPage = 8;

  useEffect(() => {
    axis.get('/employee')
      .then((response) => setEmployees(response.data.employees))
      .catch((error) => console.error('Failed to fetch employees:', error));
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(resources.map((resource) => resource.id_resource));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const handleBulkAssign = () => {
    const beneficiary = beneficiaryMatricule || selectedEmployee;

    if (!beneficiary) {
      messageError('Veuillez sélectionner un bénéficiaire.');
      return;
    }

    const requests = selected.map((idResource) => ({
      id_resource: idResource,
      id_beneficiary: beneficiary,
      id_requester: user.matricule,
    }));

    axis
      .post('/request/bulk', { requests })
      .then(() => {
        messageSuccess('Ressources attribuées avec succès.');
        setSelected([]);
        setSelectedEmployee('');
      })
      .catch(() => {
        messageError("Échec de l'attribution des ressources.");
      });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <StyledValueBox>--//--</StyledValueBox>;
    }
    return value;
  };

  const sortedAndPaginatedResources = useMemo(() => {
    if (!resources) return [];
    const sortedData = [...resources].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, resources]);

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      {selected.length > 0 && (
        <Stack direction="row" spacing={8} alignItems="center" sx={{ mb: 2 , margin: '8px 0 0 8px'}}>
          <Typography variant="h6">Attribuer à :</Typography>
          {beneficiaryMatricule ? (
            <Typography variant="subtitle1">{beneficiaryMatricule}</Typography>
          ) : (
            <TextField
              select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              variant="outlined"
              label="Bénéficiaire"
              sx={{ minWidth: 200 }}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.matricule} value={employee.matricule}>
                  {`${employee.matricule} - ${employee.name}`}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button variant="contained" color="primary" onClick={handleBulkAssign}>
            Attribuer
          </Button>
        </Stack>
      )}
      <TableContainer>
        <Table>
          <ResourceTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            onSelectAllClick={handleSelectAllClick}
            numSelected={selected.length}
            rowCount={resources.length}
          />
          <TableBody>
            {sortedAndPaginatedResources.map((resource) => {
              const isItemSelected = selected.indexOf(resource.id_resource) !== -1;
              return (
                <TableRow
                  key={resource.id_resource}
                  hover
                  onClick={(event) => handleClick(event, resource.id_resource)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
<TableCell padding="checkbox">
  <Checkbox
    color="primary"
    checked={isItemSelected}
    onClick={(event) => {
      event.stopPropagation(); // Prevent row selection
      handleClick(event, resource.id_resource);
    }}
  />
</TableCell>
                  <TableCell>{formatValue(resource.id_resource)}</TableCell>
                  <TableCell>{formatValue(resource.label)}</TableCell>
                  <TableCell>{formatValue(resource.discriminator)}</TableCell>
                  <TableCell>{formatValue(resource.description)}</TableCell>
                  <TableCell>
                    <AvailabilityIndicator isavailable={resource.isavailable} />
                  </TableCell>
                  <TableCell>{formatValue(resource.id_user_chief)}</TableCell>
                  <TableCell align="center">
                  <AvailableResourceMenu />
                </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(resources.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Box>
  );
}

AvailableResourceTable.propTypes = {
  beneficiaryMatricule: PropTypes.string,
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      id_resource: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      discriminator: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isavailable: PropTypes.string.isRequired,
      id_user_chief: PropTypes.string.isRequired,
    })
  ).isRequired,
};