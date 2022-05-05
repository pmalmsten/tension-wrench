// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Link from '@mui/material/Link';
import DiscussionWizard from './DiscussionWizard';
import FloatingFeedbackLink from './FloatingFeedbackLink';
import theme from './theme';
import PRChecklist from './PRChecklist';

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
    <BrowserRouter>
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
      <Routes>
        <Route path="/" element={<DiscussionWizard />} />
        <Route path="pr-checklist" element={<PRChecklist />} />
        <Route path="pr-checklist/:encodedURL" element={<PRChecklist />} />
      </Routes>
      <FloatingFeedbackLink />
      <footer style={{ padding: theme.spacing(2)}}>
          <Copyright />
      </footer>
    </BrowserRouter>
  );
}
