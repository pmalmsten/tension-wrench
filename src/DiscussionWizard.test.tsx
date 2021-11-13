// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import DiscussionWizard from './DiscussionWizard';

describe('DiscussionWizard integrates as intended', () => {
    it("Allows navigation between wizard steps", () => {
        render(<DiscussionWizard />)
        expect(screen.getByRole('heading', {  name: /welcome!/i})).toBeInTheDocument()

        clickWizardNextButton();
        expect(screen.getByRole('heading', {  name: /add components/i})).toBeInTheDocument()

        clickWizardNextButton();
        expect(screen.getByRole('heading', {  name: /add data flows/i})).toBeInTheDocument()

        clickWizardNextButton();
        expect(screen.getByRole('heading', {  name: /discussion guide/i})).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()

        clickWizardBackButton();
        expect(screen.getByRole('heading', {  name: /add data flows/i})).toBeInTheDocument()

        clickWizardBackButton();
        expect(screen.getByRole('heading', {  name: /add components/i})).toBeInTheDocument()

        clickWizardBackButton();
        expect(screen.getByRole('heading', {  name: /welcome!/i})).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument()

    })
})

function clickWizardNextButton() {
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeInTheDocument();
    userEvent.click(nextButton);
}

function clickWizardBackButton() {
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
    userEvent.click(backButton);
}
