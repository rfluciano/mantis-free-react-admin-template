import React, { useState } from 'react';
import { Popover, List, message } from 'antd';
import { Button } from '@mui/material';
import axios from 'axios';
import axis from 'axis';

export default function ImportPopover() {
  const [file, setFile] = useState(null); // State for the uploaded file

  // Options for import types (if you want to handle them in the future)
  const importOptions = ['CSV', 'Excel'];

  // Function to handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleImport = async () => {
    if (!file) {
      message.error('Veuillez sélectionner un fichier à importer.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axis.post('/employee/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success(response.data.message || 'Importation réussie !');
    } catch (error) {
      console.error("Error details:", error); // Log the full error
      if (error.response) {
        // Backend responded with an error
        message.error(
          error.response.data.error ||
            `Erreur serveur : ${error.response.statusText} (${error.response.status})`
        );
      } else if (error.request) {
        // No response from the backend
        message.error("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        // Something else went wrong
        message.error(`Erreur : ${error.message}`);
      }
    }
  };
  

  // Content of the popover
  const importContent = (
    <div style={{ width: 250 }}>
      <List
        dataSource={importOptions}
        renderItem={(item) => (
          <List.Item>
            <Button type="link" style={{ textTransform: 'capitalize' }}>
              {item}
            </Button>
          </List.Item>
        )}
      />
      <div style={{ marginTop: 10 }}>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
          style={{ marginBottom: 10 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleImport}
          disabled={!file}
          fullWidth
        >
          Importer
        </Button>
      </div>
    </div>
  );

  return (
    <Popover content={importContent} title="Importer des données" trigger="click">
      <Button variant="outlined">Importer</Button>
    </Popover>
  );
}
