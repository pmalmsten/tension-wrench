// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import theme from './theme';
import Intro from './Intro'
import ComponentsEditor from './ComponentsEditor';
import DataFlowsEditor from './DataFlowsEditor';
import DiscussionGuide from './DiscussionGuide';
import { Trait } from './ComponentTraits';
import { ThemeProvider } from '@mui/system';
import { List, Set, Map } from 'immutable';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.microsoft.com/">
        Microsoft
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Intro', 'Components', 'Data Flows', 'Discussion Guide'];

type ComponentName = string

interface IComponent {
  readonly name: ComponentName
  readonly outOfScope: boolean
}
interface DataFlow {
  readonly srcComponentName: ComponentName,
  readonly destComponentName: ComponentName
}

type IThreatRef = INonSpoofingThreatRef | ISpoofingRef

interface INonSpoofingThreatRef {
  readonly strideType: "tampering" | "repudiation" | "infoDisclosure" | "denialOfService" | "escalationOfPrivilege",
  readonly appliesTo: ComponentName | DataFlow
}

interface ISpoofingRef { 
  readonly strideType: "spoofing",
  readonly appliesTo: DataFlow,
  readonly relevantComponentIdentity: ComponentName
}

interface DiscussionModel {
  readonly components: List<IComponent>,
  readonly dataFlows: List<DataFlow>,
  readonly completedDiscussionTopics: Set<ITypedMap<IThreatRef>>
}

export default function DiscussionWizard() {
  // Transient states
  const [activeStep, setActiveStep] = React.useState(0);

  // Saved states
  const [components, setComponents] = React.useState<string[]>([]);
  const [componentTraitsMap, setComponentTraitsMap] = React.useState(new Map<string, Trait[]>())
  const [dataFlows, setDataFlows] = React.useState(new Map<string, Set<string>>())
  const [systemModel, setSystemModel] = React.useState<DiscussionModel>({
    components: List<IComponent>(),
    dataFlows: List<DataFlow>(),
    completedDiscussionTopics: Set<IThreatRef>(),
  })

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const setComponentTraits = (component: string, selectedTraits: Trait[] | undefined) => {
    var updatedComponentTraitsMap = new Map(Array.from(componentTraitsMap, ([key, value]: [string, Trait[]]) => [key, Array.from(value)]))

    if (selectedTraits !== undefined) {
      updatedComponentTraitsMap.set(component, selectedTraits)
    } else {
      updatedComponentTraitsMap.delete(component)
    }

    setComponentTraitsMap(updatedComponentTraitsMap)
  }

  const addComponentTrait = (component: string, trait: Trait) => {
    var updatedComponentTraitsMap = new Map(Array.from(componentTraitsMap, ([key, value]: [string, Trait[]]) => [key, Array.from(value)]))

    var componentTraits = updatedComponentTraitsMap.get(component)
    if (componentTraits === undefined) {
      throw new Error("Expected component to exist")
    }

    if (!componentTraits.some(it => it.name === trait.name)) {
      componentTraits.push(trait)
    }

    setComponentTraitsMap(updatedComponentTraitsMap)
  }

  const removeComponentTrait = (component: string, trait: Trait) => {
    var updatedComponentTraitsMap = new Map(Array.from(componentTraitsMap, ([key, value]: [string, Trait[]]) => [key, Array.from(value)]))

    var componentTraits = updatedComponentTraitsMap.get(component)
    if (componentTraits === undefined) {
      throw new Error("Expected component to exist")
    }

    componentTraits = componentTraits.filter(it => it.name !== trait.name)
    updatedComponentTraitsMap.set(component, componentTraits)
    setComponentTraitsMap(updatedComponentTraitsMap)
  }

  const componentHasTrait = (component: string, trait: Trait) => {
    var componentTraits = componentTraitsMap.get(component)
    if (componentTraits === undefined) {
      throw new Error("Expected component to exist")
    }

    return componentTraits.some(it => it.name === trait.name)
  }

  const addComponent = (component: string) => {
    var updatedComponents = new Set(components)
    updatedComponents.add(component)

    setComponents(Array.from(updatedComponents.values()))
    setComponentTraits(component, [])
  };

  const deepCopyDataFlowsMap = () => new Map(Array.from(dataFlows, ([key, value]: [string, Set<string>]) => [key, new Set(value)]))

  const deleteDataFlowsReferencingComponent = (removedComponent: string) => {
    var copiedDataFlowsMap = deepCopyDataFlowsMap()

    if (copiedDataFlowsMap.has(removedComponent)) copiedDataFlowsMap.delete(removedComponent)
    Array.from(copiedDataFlowsMap.values()).forEach(destComponents => {
      destComponents.delete(removedComponent)
    });

    setDataFlows(copiedDataFlowsMap)
  }

  const removeComponent = (removedComponent: string) => {
    setComponents(components.filter(c => c !== removedComponent))
    deleteDataFlowsReferencingComponent(removedComponent)
    setComponentTraits(removedComponent, undefined)
  };

  const dataFlowExists = (sourceComponent: string, destComponent: string) => 
    dataFlows.get(sourceComponent)?.has(destComponent) || 
    dataFlows.get(destComponent)?.has(sourceComponent)

  const addDataFlow = (sourceComponent: string, destComponent: string) => {
    if (dataFlowExists(sourceComponent, destComponent)) return;

    var copiedMap = deepCopyDataFlowsMap()
    if (!copiedMap.has(sourceComponent)) copiedMap.set(sourceComponent, new Set<string>())

    copiedMap.get(sourceComponent)?.add(destComponent)

    setDataFlows(copiedMap)
  }

  const removeDataFlow = (sourceComponent: string, destComponent: string) => {
    if (!dataFlowExists(sourceComponent, destComponent)) return;

    var copiedMap = deepCopyDataFlowsMap()
    copiedMap.get(sourceComponent)?.delete(destComponent)
    copiedMap.get(destComponent)?.delete(sourceComponent)

    setDataFlows(copiedMap)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h5" color="inherit" noWrap>
            Tension Wrench - Learn to Defend against Hackers
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth='md' sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
              <React.Fragment>
                {
                  [
                    <Intro />,
                    <ComponentsEditor 
                      components={components} 
                      componentTraitsMap={componentTraitsMap} 
                      addComponent={addComponent} 
                      removeComponent={removeComponent} 
                      setComponentTraits={setComponentTraits}
                      addComponentTrait={addComponentTrait}
                      removeComponentTrait={removeComponentTrait}
                      componentHasTrait={componentHasTrait}
                    />,
                    <DataFlowsEditor 
                      components={components}
                      dataFlows={dataFlows}
                      addFlow={addDataFlow}
                      removeFlow={removeDataFlow}
                    />,
                    <DiscussionGuide components={components} componentTraitsMap={componentTraitsMap} dataFlows={dataFlows} />
                  ][activeStep]
                }
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {activeStep < steps.length - 1 &&
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 3, ml: 1 }}
                    >
                      Next
                    </Button> 
                  }
                </Box>
              </React.Fragment>
          </React.Fragment>
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
