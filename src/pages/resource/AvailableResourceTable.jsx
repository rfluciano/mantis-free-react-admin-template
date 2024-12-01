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


AvailabilityIndicator.propTypes = {
  isavailable: PropTypes.string.isRequired,
};

export default function AvailableResourceTable({ beneficiaryMatricule, resources }) {
  const { user, messageError } = useStateContext();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_resource');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return <StyledValueBox>--//--</StyledValueBox>;
    }
    return value;
  };
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected((resources || []).map((resource) => resource.id_resource));
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

  const sortedAndPaginatedResources = useMemo(() => {
    if (!resources) return [];
    const sortedData = [...resources].sort(getComparator(order, orderBy));
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, resources]);

  return (
    <Box>
        <>
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
                  const isSelected = selected.indexOf(resource.id_resource) !== -1;
                  return (
                    <TableRow
                      key={resource.id_resource}
                      hover
                      role="checkbox"
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onClick={(event) => handleClick(event, resource.id_resource)}
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
                      <TableCell>
                        <ResourceMenu resource={resource} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil((resources || []).length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
    </Box>
  );
}

AvailableResourceTable.propTypes = {
  beneficiaryMatricule: PropTypes.string,
  resources: PropTypes.arrayOf(PropTypes.object), // Ensure PropTypes allow null or undefined
};