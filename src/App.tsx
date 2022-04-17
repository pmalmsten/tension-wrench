// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ThemeProvider } from '@emotion/react';
import { CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import DiscussionWizard from './DiscussionWizard';
import FloatingFeedbackLink from './FloatingFeedbackLink';
import theme from './theme';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.microsoft.com/">
        Microsoft
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Tension Wrench - Learn to Defend against Hackers
          </Typography>
        </Toolbar>
      </AppBar>
      <DiscussionWizard />
      <FloatingFeedbackLink />
      <footer style={{ padding: theme.spacing(2)}}>
          <Copyright />
      </footer>
    </ThemeProvider>
  );
}
