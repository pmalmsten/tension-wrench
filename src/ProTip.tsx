import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

interface ProTipProps {}

export default function ProTip(props: React.PropsWithChildren<ProTipProps>) {
  return (
    <Paper variant="outlined" sx={{
      mb: 1,
      p: 0.5,
      px: 1.5
    }}>
      <Typography sx={{ mt: 1, mb: 1 }} color="text.secondary">
        <LightbulbOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {props.children}
      </Typography>
    </Paper>
  );
}
