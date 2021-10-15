import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

interface WarningProps {}

export default function Warning(props: React.PropsWithChildren<WarningProps>) {
  return (
    <Paper variant="outlined" sx={{
      mb: 1,
      p: 0.5,
      px: 1.5
    }}>
      <Typography sx={{ mt: 1, mb: 1 }} color="text.secondary">
        <WarningAmberOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {props.children}
      </Typography>
    </Paper>
  );
}
