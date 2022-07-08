// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, FormControlLabel, Step, StepButton, StepContent, Stepper, Switch } from '@mui/material';
import { Trait } from './ComponentTraits';
import GenerateSteps, { DiscussionGuideStep } from './DiscussionGuideSteps';

interface DiscussionGuideProps {
  components: string[],
  componentTraitsMap: Map<string, Trait[]>,
  dataFlows: Map<string, Set<string>>
}

interface StepperProps {
  steps: DiscussionGuideStep[]
}

function VerticalLinearStepper(props: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState(new Set<number>()) 

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  }

  const isStepCompleted = (stepIndex: number) => completedSteps.has(stepIndex)

  const handleStepToggleCompleted = (stepIndex: number) => {
    var copiedCompletedSteps = new Set(completedSteps)

    if (isStepCompleted(stepIndex)) {
      copiedCompletedSteps.delete(stepIndex)
    } else {
      copiedCompletedSteps.add(stepIndex)
    }

    setCompletedSteps(copiedCompletedSteps)
  }

  return (
    <React.Fragment>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {props.steps.map((step, index) => (
          <Step key={step.label} completed={isStepCompleted(index)}>
            <StepButton onClick={() => handleStepClick(index)}>
              {step.label}
            </StepButton>
            <StepContent>
              {step.content}
              <Box sx={{ mb: 2 }}>
                <div>
                  { !isStepCompleted(index) ? 
                  <React.Fragment>
                    <Button
                      variant="contained"
                      onClick={() => { handleStepToggleCompleted(index); if (index < props.steps.length - 1) handleNext() } }
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Complete {index < props.steps.length - 1 ? 'and Continue' : ''}
                    </Button>
                    { index < props.steps.length - 1 &&
                      <Button
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    }
                  </React.Fragment> : 
                  <React.Fragment>
                    <Button
                      onClick={() => {handleStepToggleCompleted(index)}}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Unmark Completed
                    </Button>
                    { index < props.steps.length - 1 &&
                      <Button
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    }
                  </React.Fragment>
                }
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </React.Fragment> 
  );
}

function AllTopicsInOrder(props: StepperProps) {
 return <VerticalLinearStepper steps={props.steps} />
}

function TopicsGroupedByType(props: StepperProps) {
  return <React.Fragment>
    <Typography variant="h6" gutterBottom>
      Spoofing
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Spoofing")} />

    <Typography variant="h6" gutterBottom>
      Tampering
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Tampering")} />

    <Typography variant="h6" gutterBottom>
      Repudiation
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Repudiation")} />

    <Typography variant="h6" gutterBottom>
      Information Disclosure
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Information Disclosure")} />

    <Typography variant="h6" gutterBottom>
      Denial of Service
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Denial of Service")} />

    <Typography variant="h6" gutterBottom>
      Escalation of Priviledge
    </Typography>
    <VerticalLinearStepper steps={props.steps.filter(it => it.type === "Escalation of Priviledge")} />
  </React.Fragment>
}

export default function DiscussionGuide(props: DiscussionGuideProps) {
  var [groupByType, setGroupByType] = React.useState(false);
  var steps = GenerateSteps(props.components, props.componentTraitsMap, props.dataFlows)

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Discussion Guide
      </Typography>
      <p>
        Now that you've described your system, you're ready to brainstorm what
        actions attackers might try in order to break in to your system. Grab some
        teammates and think about the following possiblities. Remember, this is
        brainstorming - all ideas are fair game, even if you later decide a possible 
        attack is too unlikely or too low impact to do anything about.
      </p>

      <FormControlLabel 
        control={
          <Switch 
            checked={groupByType} 
            onChange={(e) => setGroupByType(e.currentTarget.checked) }
          />
        } 
        label="Group Topics by Category"
      />

      {groupByType && <TopicsGroupedByType steps={steps} />}
      {!groupByType && <AllTopicsInOrder steps={steps} />}
      
    </React.Fragment>
  );
}
