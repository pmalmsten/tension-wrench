// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Checkbox, Container, FormControlLabel, List, ListItem, Paper, Typography } from "@mui/material";
import React from "react";
import YAML from "yaml";

var data = `
questions:
- text: First Question?
  whenTrue:
    taskListToInclude: MediumRiskChangeActionItems
    additionalQuestionsToAsk: []
- text: Second Question?
  whenTrue:
    taskListToInclude: HighRiskChangeActionItems
- text: Third Question? 

taskLists:    
- id: MediumRiskChangeActionItems
  tasks:
  - text: Update the threat model
- id: HighRiskChangeActionItems
  extendsTaskList: MediumRiskChangeActionItems
  tasks:
  - test: Consult with a security engineer
`;


interface TaskData {
    text: string
}

interface TaskListData {
    id: string
    extendsTaskList: string | undefined
    tasks: TaskData[]
}

interface ConditionData {
    taskListToInclude: string | undefined
    additionalQuestionsToAsk: QuestionData[] | undefined
}

interface QuestionData {
    text: string
    whenTrue: ConditionData | undefined
}

interface ChecklistData {
    questions: QuestionData[]
    taskLists: TaskListData
}

export default function PRChecklist() {
    var dataObj: ChecklistData = YAML.parse(data);

    return (
    <React.Fragment>
        <Container component="main" maxWidth='md' sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
                Pull Request Checklist
            </Typography>
                <List>
                    {dataObj.questions.map((question: QuestionData) => {
                        return <ListItem key={question.text}>
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