import * as React from 'react';
import Typography from '@mui/material/Typography';
import ProTip from './ProTip';
import { Box, Button, Paper, Step, StepButton, StepContent, StepLabel, Stepper } from '@mui/material';

interface DiscussionGuideProps {
  components: string[],
  dataFlows: Map<string, Set<string>>
}

interface StepperProps {
  steps: {label: string, description: string}[]
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
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  { !isStepCompleted(index) ? 
                  <React.Fragment>
                    <Button
                      variant="contained"
                      onClick={() => { handleStepToggleCompleted(index); handleNext() } }
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Complete and {index === props.steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === props.steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                  </React.Fragment> : 
                  <React.Fragment>
                    <Button
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === props.steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      onClick={() => {handleStepToggleCompleted(index)}}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Unmark Completed
                    </Button>
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
      {activeStep === props.steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All done!</Typography>
          <Button
              onClick={handleBack}
              sx={{ mt: 1, mr: 1 }}
            >
              Back
            </Button>
        </Paper>
      )}
    </React.Fragment> 
  );
}

function generateSteps(components: string[], dataFlows: Map<string, Set<string>>): {label: string, description: string}[] {
  var steps = components.flatMap(component => {
    var componentSteps = [
      {
        label: `${component}: Tampering`,
        description: "An attacker might try to tamper with this component."
      },
      {
        label: `${component}: Repudiation`,
        description: "An attacker might try to make an action and later claim they did not take that action, or take that action without having been discovered."
      },
      {
        label: `${component}: Information Disclosure`,
        description: "An attacker might try to extract data they should not have from this component."
      },
      {
        label: `${component}: Denial of Service`,
        description: "An attacker might try to cause this component to stop serving legitimate customers/users."
      },
      {
        label: `${component}: Escalation of Privilege`,
        description: "An attacker might try to take advantage of this component in order to gain access they should not have."
      }
    ]

    var dataFlowSteps = Array.from(dataFlows.get(component)?.values() ?? []).flatMap(destComponent => [
      {
        label: `${component} <-> ${destComponent}: Spoofing of '${component}' identity`,
        description: `An attacker might try to pretend to be '${component}' in order to gain access they should not have.`
      },
      {
        label: `${component} <-> ${destComponent}: Spoofing of '${destComponent}' identity`,
        description: `An attacker might try to pretend to be '${destComponent}' in order to gain access they should not have.`
      },
      {
        label: `${component} <-> ${destComponent}: Tampering`,
        description: `An attacker might try to alter information as it flows between these components (for example, as messages transit the public internet).`
      },
      {
        label: `${component} <-> ${destComponent}: Information Disclosure`,
        description: `An attacker might try to spy on information as it flows between these components (for example, as messages transit the public internet).`
      },
      {
        label: `${component} <-> ${destComponent}: Denial of Service`,
        description: `An attacker might try to disrupt the exchange of information between these components (for example, as messages transit the public internet).`
      }
    ])

    return componentSteps.concat(dataFlowSteps)
  })

  return steps;
}

export default function DiscussionGuide(props: DiscussionGuideProps) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Discussion Guide
      </Typography>
      <p>
        Now that you've described your system, you're ready to brainstorm what
        actions attackers might try in order to break in to your system. Grab some
        teammates and think about the following possiblities. Remember, this is
        brainstorming - all ideas are fair game, even if you later decide a possible 
        attack is too unlikely to do anything about.
      </p>
      <ProTip>
        The discussion guide below is based on STRIDE-per-element; see X for detais.
      </ProTip>
      <VerticalLinearStepper steps={generateSteps(props.components, props.dataFlows)} />
      
    </React.Fragment>
  );
}
