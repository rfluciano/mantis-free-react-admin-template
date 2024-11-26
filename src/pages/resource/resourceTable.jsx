import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import axis from 'axis';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination'; // Here is the pagination component
import LongMenu from './MyResourceMenu';
import { useStateContext } from 'contexts/contextProvider';
import Dot from 'components/@extended/Dot';

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
  { id: 'id_resource', align: 'left', label: 'ID Ressource' },
  { id: 'label', align: 'left', label: 'Libellé' },
  { id: 'discriminator', align: 'left', label: 'Type' },
  { id: 'description', align: 'left', label: 'Description' },
  { id: 'isavailable', align: 'left', label: 'Disponibilité' },
  { id: 'id_user_chief', align: 'left', label: 'Responsable' },
  { id: 'id_user_holder', align: 'left', label: 'Propriétaire' },
  { id: 'action', align: 'left', label: '' },
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

function AvailabilityIndicator({ isavailable }) {
  // Map the availability status to color and title
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
  isavailable: PropTypes.bool.isRequired,
};

export default function ResourceTable() {
  const { user, messageSuccess, messageError } = useStateContext();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_resource');
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1); // Use 1-based page
  const rowsPerPage = 9; // You can set rows per page as needed

  useEffect(() => {
    axis.get(`/resource`)
      .then((response) => {
        setResources(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch resources:', error);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = resources.map((resource) => resource.id_resource);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
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
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const sortedAndPaginatedResources = useMemo(() => {
    const sortedData = [...resources].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage); // Adjust for 1-based page
  }, [order, orderBy, page, resources]);

  return (
    <Box sx={{margin:-2.5, padding:0}}>
      {selected.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Selected Resource IDs:', selected)}
          sx={{ marginBottom: 2 }}
        >
          Action Button
        </Button>
      )}
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          '& td, & th': { whiteSpace: 'nowrap' },
        }}
      >
        <Table aria-labelledby="tableTitle">
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
              const isItemSelected = isSelected(resource.id_resource);
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
                      onClick={(event) => handleClick(event, resource.id_resource)}
                    />
                  </TableCell>
                  <TableCell>{resource.id_resource}</TableCell>
                  <TableCell>{resource.label}</TableCell>
                  <TableCell>{resource.discriminator === 'Accès' ? 'Accès' : 'Equipement'}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell><AvailabilityIndicator isavailable={resource.isavailable} /></TableCell>
                  <TableCell>{resource.id_user_chief}</TableCell>
                  <TableCell>{resource.id_user_holder}</TableCell>
                  <TableCell><LongMenu employeeId={resource.id_resource} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(resources.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}
