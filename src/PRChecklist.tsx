// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Checkbox, Container, FormControlLabel, List, ListItem, Paper, Typography } from "@mui/material";
import React from "react";
import YAML from "yaml";

var data = `
questions:
- text: First Question?
  riskLevel: Medium
- text: Second Question?
  riskLevel: Medium
- text: Third Question?
  riskLevel: Medium

riskLevels:
- id: Medium
  checklistItems:
  - text: Update the threat model
`;

interface Question {
    text: string
    riskLevel: string
}

export default function PRChecklist() {
    var dataObj = YAML.parse(data);

    return (
    <React.Fragment>
        <Container component="main" maxWidth='md' sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
                Pull Request Checklist
            </Typography>
                <List>
                    {dataObj["questions"].map((question: Question) => {
                        return <ListItem>
                            <FormControlLabel
                                control={<Checkbox />}
                                label={question.text}
                                />
                        </ListItem>
                    })}
                </List>
            </Paper>
        </Container>
    </React.Fragment>)
}