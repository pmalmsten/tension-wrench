// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface TaskData {
    text: string
}

export interface TaskListData {
    extendsTaskList?: string
    tasks: TaskData[]
}

export interface ConditionData {
    taskListToInclude?: string
    additionalQuestionsToAsk?: QuestionData[]
}

export interface QuestionData {
    text: string
    whenTrue?: ConditionData
    isChecked?: boolean
}

export interface ChecklistData {
    questions: QuestionData[]
    taskLists: { 
        [key: string]: TaskListData 
    }
}