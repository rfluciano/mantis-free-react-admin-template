import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import Dot from 'components/@extended/Dot';
import axis from 'axis';

const headCells = [
  { id: 'id_request', align: 'left', label: 'ID Requête' },
  { id: 'resource_label', align: 'left', label: 'Ressource concerné' },
  { id: 'receiver_matricule', align: 'left', label: 'Destinataire' },
  { id: 'requester_matricule', align: 'left', label: 'Soliciteur' },
  { id: 'delivery_date', align: 'left', label: 'Date de livraison' },
  { id: 'status', align: 'left', label: 'Status' }
];

function RequestTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
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
      title = 'Approved';
      break;
    case 'pending':
      color = 'warning';
      title = 'En attente';
      break;
    case 'rejected':
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

export default function RequestTable() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axis.get('/request')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch requests:', error);
      });
  }, []);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <RequestTableHead />
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id_request}>
                <TableCell>
                  <Link color="secondary"> {request.id_request}</Link>
                </TableCell>
                <TableCell>{request.resource?.label || 'N/A'}</TableCell>
                <TableCell>{request.receiver?.matricule || 'N/A'}</TableCell>
                <TableCell>{request.requester?.matricule || 'N/A'}</TableCell>
                <TableCell>{request.delivery_date || 'N/A'}</TableCell>
                <TableCell>
                  <StatusIndicator status={request.validation?.status || 'pending'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

StatusIndicator.propTypes = {
  status: PropTypes.string
};
