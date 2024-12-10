import React from 'react';
import { Popover, List } from 'antd';
import { Button } from '@mui/material';
import jsPDF from 'jspdf'; // For PDF export
import * as XLSX from 'xlsx'; // For Excel export

export default function ExportPopover({ data, columns }) {
  const exportOptions = ['PDF', 'CSV', 'Excel']; // Internal options

  // Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    let content = '';

    // Add column headers
    content += columns.join(' | ') + '\n';

    // Add data rows
    data.forEach((row) => {
      content += columns.map((col) => row[col]).join(' | ') + '\n';
    });

    // Add to PDF
    doc.text(content, 10, 10);
    doc.save('data.pdf');
  };

  // Export as CSV
  const exportAsCSV = () => {
    const csvData = [
      columns.join(','), // Column headers
      ...data.map((row) => columns.map((col) => row[col]).join(',')), // Data rows
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel
  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  // Handle export click
  const handleExport = (type) => {
    switch (type) {
      case 'PDF':
        exportAsPDF();
        break;
      case 'CSV':
        exportAsCSV();
        break;
      case 'Excel':
        exportAsExcel();
        break;
      default:
        console.error('Unknown export type:', type);
    }
  };

  // Popover content
  const exportContent = (
    <List
      dataSource={exportOptions}
      renderItem={(item) => (
        <List.Item>
          <Button type="link" onClick={() => handleExport(item)}>
            {item}
          </Button>
        </List.Item>
      )}
    />
  );

  return (
    <Popover content={exportContent} title="Exporter les données" trigger="click">
      <Button variant="outlined">Exporter</Button>
    </Popover>
  );
}
