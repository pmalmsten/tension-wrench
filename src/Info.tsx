// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface InfoProps {}

export default function Info(props: React.PropsWithChildren<InfoProps>) {
  return (
    <Paper variant="outlined" sx={{
      mb: 1,
      p: 0.5,
      px: 1.5
    }}>
      <Typography sx={{ mt: 1, mb: 1 }} color="text.secondary">
        <InfoOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {props.children}
      </Typography>
    </Paper>
  );
}
