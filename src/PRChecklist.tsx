// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Alert, AlertTitle, Box, Checkbox, CircularProgress, Container, List, ListItem, Paper, Typography } from "@mui/material";
import Ajv, { ValidateFunction } from "ajv";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YAML, { YAMLParseError } from "yaml";
import "./ChecklistTypes";
import { QuestionData, TaskListData, TaskData, ChecklistData } from "./ChecklistTypes";

const ajv = new Ajv()

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

interface LoadError {
    title: string
    messages: string[]
}

export default function PRChecklist() {
    const { encodedURL } = useParams()
    const [loadErrorInfo, setLoadErrorInfo] = useState<LoadError | undefined>(undefined)
    const [checklistDataSchema, setChecklistDataSchema] = useState<ValidateFunction<ChecklistData> | undefined>(undefined)
    const [dataObj, setDataObj] = useState<ChecklistData | undefined>(undefined);

    useEffect(() => {
        if (loadErrorInfo !== undefined) {
            return;
        }

        if (checklistDataSchema === undefined) {
            fetch("/generated/ChecklistDataSchema.json")
                .then(response => {
                    if (!response.ok) {
                        setLoadErrorInfo({
                            title: "Unable to load checklist schema",
                            messages: [
                                response.statusText
                            ]
                        })
                    } else {
                        response.json()
                            .then(json => {
                                try {
                                    var compiled = ajv.compile<ChecklistData>(json)
                                    // Wrap with function so that useState setter doesn't immediately call the validation function
                                    // while attempting to populate the value to store
                                    setChecklistDataSchema(() => compiled)
                                } catch (ex) {
                                    if (ex instanceof Error) {
                                        setLoadErrorInfo({
                                            title: "Unable to load checklist schema",
                                            messages: [
                                                ex.message
                                            ]
                                        })
                                    } else {
                                        setLoadErrorInfo({
                                            title: "Unable to load checklist schema",
                                            messages: [
                                                "Unrecognized exception thrown"
                                            ]
                                        })
                                    }
                                }
                            })
                            .catch(ex => {
                                if (ex instanceof SyntaxError) {
                                    setLoadErrorInfo({
                                        title: "Unable to parse checklist data schema as JSON",
                                        messages: [
                                            ex.message
                                        ]
                                    })
                                } else {
                                    setLoadErrorInfo({
                                        title: "Unable to parse checklist data schema as JSON",
                                        messages: []
                                    })
                                }
                            })
                    }
                })
        } else if (dataObj === undefined) {
            fetch("/default-pr-checklist.yml")
                .then(response => {
                    if (!response.ok) {
                        setLoadErrorInfo({
                            title: "Unable to load checklist data",
                            messages: [
                                response.statusText
                            ]
                        })
                    } else {
                        response.text()
                            .then(data => {
                                try {
                                    var parsed = YAML.parse(data)
                                } catch (ex) {
                                    if (ex instanceof YAMLParseError) {
                                        setLoadErrorInfo({
                                            title: "Unable to parse checklist data as YAML",
                                            messages: [
                                                ex.message
                                            ]
                                        })
                                    } else {
                                        setLoadErrorInfo({
                                            title: "Unable to parse checklist data as YAML",
                                            messages: []
                                        })
                                    }
                                    return
                                }


                                if (checklistDataSchema(parsed)) {
                                    setDataObj(parsed)
                                } else {
                                    setLoadErrorInfo({
                                        title: "Loaded checklist data does not conform to expected schema",
                                        messages: checklistDataSchema.errors?.map(err => `At '${err.instancePath}': ${err.message}`) ?? []
                                    })
                                }
                            })
                    }
                })
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

    const isFullyLoaded = dataObj !== undefined

    var tasksToDisplay = new Set<TaskData>();
    dataObj?.questions
        .filter(it => it.isChecked)
        .flatMap(it => it.whenTrue?.taskListToInclude !== undefined ? resolveTasksFor(dataObj.taskLists, it.whenTrue.taskListToInclude) : [])
        .forEach(taskSet => Array.from(taskSet.values()).forEach(it => tasksToDisplay.add(it)))

    return (
    <React.Fragment>
        <Container component="main" maxWidth='md' sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                {!isFullyLoaded && loadErrorInfo === undefined &&
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>}
                {!isFullyLoaded && loadErrorInfo !== undefined && 
                    <Alert severity="error" >
                        <AlertTitle>{loadErrorInfo.title}</AlertTitle>
                        {loadErrorInfo.messages.length > 0 && 
                            <List>
                                {loadErrorInfo.messages.map(err => <ListItem key={err}>{err}</ListItem>)}
                            </List>
                        }
                    </Alert>}
                {isFullyLoaded && 
                    <React.Fragment>
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
                    </React.Fragment>}
            </Paper>
            {isFullyLoaded &&
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
            }
        </Container>
    </React.Fragment>)
}