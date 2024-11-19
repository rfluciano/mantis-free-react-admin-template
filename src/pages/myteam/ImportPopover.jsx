import React from 'react';
import { Popover, List } from 'antd';
import { Button } from '@mui/material';

export default function ImportPopover() {
  const importOptions = ['CSV', 'Excel']; // Internal options

  const importContent = (
    <List
      dataSource={importOptions}
      renderItem={(item) => (
        <List.Item>
          <Button type="link" onClick={() => console.log(`Importing ${item} file`)}>
            {item}
          </Button>
        </List.Item>
      )}
    />
  );

  return (
    <Popover content={importContent} title="Importer des données" trigger="click">
      <Button variant="outlined">Importer</Button>
    </Popover>
  );
}
