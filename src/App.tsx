// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import DiscussionWizard from './DiscussionWizard';
import FloatingFeedbackLink from './FloatingFeedbackLink';

export default function App() {
  return (
    <React.Fragment>
      <DiscussionWizard />
      <FloatingFeedbackLink />
    </React.Fragment>
  );
}
