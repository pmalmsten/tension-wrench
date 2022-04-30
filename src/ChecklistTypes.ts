// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface TaskData {
    text: string
}

export interface TaskListData {
    id: string
    extendsTaskList: string | undefined
    tasks: TaskData[]
}

export interface ConditionData {
    taskListToInclude: string | undefined
    additionalQuestionsToAsk: QuestionData[] | undefined
}

export interface QuestionData {
    text: string
    whenTrue: ConditionData | undefined
    isChecked: boolean
}

export interface ChecklistData {
    questions: QuestionData[]
    taskLists: { 
        [key: string]: TaskListData 
    }
}