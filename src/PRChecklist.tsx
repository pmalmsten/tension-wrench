// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Box, Checkbox, CircularProgress, Container, List, ListItem, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import YAML from "yaml";
import "./ChecklistTypes";
import { QuestionData, TaskListData, TaskData, ChecklistData } from "./ChecklistTypes";

interface QuestionComponentProps {
    question: QuestionData
    questionAccessorFn: (allQuestions: QuestionData[]) => QuestionData | undefined
    onCheckedStateChanged: (questionAccessorFn: (allQuestions: QuestionData[]) => QuestionData | undefined, isChecked: boolean) => void
}

const QuestionComponent = (props: QuestionComponentProps): JSX.Element => {
    return <React.Fragment>
        <ListItem>
            <Checkbox checked={props.question.isChecked ?? false} onChange={(event) => props.onCheckedStateChanged(props.questionAccessorFn, event.target.checked)} />{props.question.text}
        </ListItem>
        { props.question.isChecked && 
            props.question.whenTrue?.additionalQuestionsToAsk !== undefined &&
            props.question.whenTrue.additionalQuestionsToAsk.length > 0 && 
            <ListItem>
                <List>
                    {props.question.whenTrue?.additionalQuestionsToAsk?.map((question, index) => 
                        <QuestionComponent 
                            question={question} 
                            key={question.text}
                            questionAccessorFn={(allQuestions) => props.questionAccessorFn(allQuestions)?.whenTrue?.additionalQuestionsToAsk?.at(index)}
                            onCheckedStateChanged={props.onCheckedStateChanged}
                            />
                    )}
                </List>
            </ListItem>
        }
    </React.Fragment>
}

function resolveTasksFor(taskLists: {[key: string]: TaskListData}, taskListName: string): Set<TaskData> {
    var result = new Set<TaskData>();
    const taskData = taskLists[taskListName];
    
    if (taskData.extendsTaskList !== undefined) {
        resolveTasksFor(taskLists, taskData.extendsTaskList).forEach(it => result.add(it))
    }

    taskData.tasks.forEach(it => result.add(it))

    return result;
}

export default function PRChecklist() {
    //const [dataObj, setDataObj] = useState<ChecklistData | undefined>(YAML.parse(data));
    const [dataObj, setDataObj] = useState<ChecklistData | undefined>(undefined);

    useEffect(() => {
        if (dataObj === undefined) {
            fetch("default-pr-checklist.yml")
                .then(response => response.text()
                    .then(data => setDataObj(YAML.parse(data))))
        }
    })

    const handleCheckedStateChanged = (accessor: (allQuestions: QuestionData[]) => QuestionData | undefined, isChecked: boolean) => {
        const copy = JSON.parse(JSON.stringify(dataObj)) as ChecklistData;
        
        const questionReference = accessor(copy.questions);
        if (questionReference === undefined) {
            throw new Error("Question reference was undefined");
        }

        questionReference.isChecked = isChecked;

        setDataObj(copy)
    }

    var tasksToDisplay = new Set<TaskData>();
    dataObj?.questions
        .filter(it => it.isChecked)
        .flatMap(it => it.whenTrue?.taskListToInclude !== undefined ? resolveTasksFor(dataObj.taskLists, it.whenTrue.taskListToInclude) : [])
        .forEach(taskSet => Array.from(taskSet.values()).forEach(it => tasksToDisplay.add(it)))

    return (
    <React.Fragment>
        <Container component="main" maxWidth='md' sx={{ mb: 4 }}>
            {dataObj !== undefined && 
            <React.Fragment>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" gutterBottom>
                        Pull Request Checklist
                    </Typography>
                    <List>
                        {dataObj.questions.map((question, index) => {
                            return <QuestionComponent 
                                question={question} 
                                key={question.text}
                                questionAccessorFn={(allQuestions) => allQuestions[index]}
                                onCheckedStateChanged={handleCheckedStateChanged}
                                />
                        })}
                    </List>
                </Paper>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    {tasksToDisplay.size === 0 && 
                        <Typography variant="h6" gutterBottom>
                            No additional tasks are needed for this PR.
                        </Typography>
                    }
                    {tasksToDisplay.size > 0 &&
                        <React.Fragment>
                            <Typography variant="h6" gutterBottom>
                                Make sure to perform the following additional tasks for this PR:
                            </Typography>
                            <List>
                                {Array.from(tasksToDisplay.values()).map(task => 
                                    <ListItem key={task.text}>
                                        {task.text}
                                    </ListItem>)}
                            </List>
                        </React.Fragment>
                    }
                </Paper>
            </React.Fragment>}
            {dataObj === undefined && 
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: 'flex', "justify-content": 'center' }}>
                        <CircularProgress />
                    </Box>
                </Paper>}
        </Container>
    </React.Fragment>)
}