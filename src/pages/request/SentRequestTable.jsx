import React, { useEffect, useState } from 'react';
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
import Dot from 'components/@extended/Dot';
import SentMenu from './SentMenu';
import { useStateContext } from 'contexts/contextProvider';
import axis from 'axis';

const headCells = [
  { id: 'id_request', align: 'left', label: 'ID Requête' },
  { id: 'resource.label', align: 'left', label: 'Ressource concerné' },
  { id: 'receiver.matricule', align: 'left', label: 'Destinataire' },
  { id: 'validation.status', align: 'left', label: 'Statut' },
  { id: 'validation.rejection_reason', align: 'left', label: 'Motif de rejet' },
  { id: 'validation.validation_date', align: 'left', label: 'Date de validation' },
  { id: 'validation.delivery_date', align: 'left', label: 'Date de livraison' },
  { id: 'action', align: 'center', label: 'Action' },
];


function descendingComparator(a, b, orderBy) {
  // Handle nested fields using dot notation
  const keys = orderBy.split('.');
  let valueA = a;
  let valueB = b;

  for (const key of keys) {
    valueA = valueA ? valueA[key] : undefined;
    valueB = valueB ? valueB[key] : undefined;
  }

  // Handle null or empty values
  const isValueAEmpty = valueA === null || valueA === undefined || valueA === '';
  const isValueBEmpty = valueB === null || valueB === undefined || valueB === '';

  if (isValueAEmpty && !isValueBEmpty) return 1; // `a` is empty, place it lower
  if (!isValueAEmpty && isValueBEmpty) return -1; // `b` is empty, place it lower
  if (isValueAEmpty && isValueBEmpty) return 0; // Both are empty, treat as equal

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


function RequestTableHead({ order, orderBy, onRequestSort }) {
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

function StatusIndicator({ status }) {
  let color;
  let title;

  switch (status?.toLowerCase()) {
    case 'approved':
      color = 'success';
      title = 'Approvée';
      break;
    case 'pending':
      color = 'warning';
      title = 'En attente';
      break;
    case 'rejected':
      color = 'error';
      title = 'Rejetée';
      break;
    default:
      color = 'primary';
      title = 'Erreur';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function SentRequestTable({ requests }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id_request');
  const [page, setPage] = useState(1);
  const rowsPerPage = 9;
  const [isLoading, setIsLoading] = useState(true);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const paginatedRequests = React.useMemo(() => {
    const sortedRequests = [...requests].sort(getComparator(order, orderBy));
    return sortedRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [order, orderBy, page, requests]);

  const handlePageChange = (event, newPage) => setPage(newPage);

  return (
    <Box sx={{ margin: -2.5, padding: 0 }}>
      <TableContainer>
        <Table>
          <RequestTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {paginatedRequests.map((request) => (
              <TableRow key={request.id_request}>
                <TableCell>
                  <Link color="secondary">{request.id_request}</Link>
                </TableCell>
                <TableCell>{request.resource?.label || ''}</TableCell>
                <TableCell>
                  {request.receiver?.matricule || ''}
                </TableCell>
                <TableCell>
                  <StatusIndicator status={request.validation?.status || 'pending'} />
                </TableCell>
                <TableCell>{request.validation?.rejection_reason || ''}</TableCell>
                <TableCell>{request.validation?.validation_date || ''}</TableCell>
                <TableCell>{request.validation?.delivery_date || ''}</TableCell>
                <TableCell>
                  <SentMenu />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(requests.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}

SentRequestTable.propTypes = {
  requests: PropTypes.array.isRequired,
};


RequestTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

StatusIndicator.propTypes = {
  status: PropTypes.string,
};
