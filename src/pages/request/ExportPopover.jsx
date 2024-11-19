import React from 'react';
import { Popover, List } from 'antd';
import { Button } from '@mui/material';

export default function ExportPopover() {
  const exportOptions = ['PDF', 'CSV', 'Excel']; // Internal options

  const exportContent = (
    <List
      dataSource={exportOptions}
      renderItem={(item) => (
        <List.Item>
          <Button type="link" onClick={() => console.log(`Exporting as ${item}`)}>
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
