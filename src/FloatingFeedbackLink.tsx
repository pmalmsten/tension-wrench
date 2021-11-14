// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Link, Paper } from "@mui/material"
import ChatIcon from '@mui/icons-material/Chat';
import { OpenInNew } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

export default function FloatingFeedbackLink() {
    var theme = useTheme()
    return <Paper 
        elevation={3}
        sx={{
            position: "fixed",
            bottom: 10,
            right: 20,
            px: 0.6,
            py: 0.1,
            backgroundColor: theme.palette.primary.light
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}>
                <ChatIcon fontSize="small" />
                <Link href="https://github.com/pmalmsten/tension-wrench/issues/new" 
                    target="_blank"
                    rel="noopener"
                    color="#FFFFFF"
                    variant="body2"
                    sx={{ marginLeft: 0.3, marginRight: 0.1 }}
                    >
                    Feedback?
                </Link>
                <OpenInNew fontSize="small" />
            </div>  
    </Paper>
}