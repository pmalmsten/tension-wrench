// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, FormControlLabel, IconButton, List, ListItem, ListItemText, Paper} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { Trait, Traits } from './ComponentTraits';

interface ComponentsEditorProps {
  components: string[],
  componentTraitsMap: Map<string, Trait[]>,
  addComponent: (component: string) => void,
  removeComponent: (component: string) => void
  setComponentTraits: (component: string, selectedTraits: Trait[]) => void
  addComponentTrait: (component: string, trait: Trait) => void
  removeComponentTrait: (component: string, trait: Trait) => void
  componentHasTrait: (component: string, trait: Trait) => boolean
}

function NewComponentForm(props: { handleSubmit: (newComponentName: string) => void }) {
  const [currentComponentName, setCurrentComponentName] = React.useState<string | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    if (currentComponentName !== undefined) {
      props.handleSubmit(currentComponentName)
      setCurrentComponentName(undefined)
    }
    event.preventDefault()
  }

  return <React.Fragment>
    <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField id="standard-basic" label="Component Name" variant="standard" required fullWidth 
              value={currentComponentName ?? ""}
              onChange={(event) => setCurrentComponentName(event.target.value)}/>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" type="submit">Add Component</Button>
          </Grid>
        </Grid>
      </form>
  </React.Fragment>
}

export default function ComponentsEditor(props: ComponentsEditorProps) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Add Components
      </Typography>
      <p>
        List the high-level components of the system you are building - these could be a web
        server, a database, a load balancer, etc.
      </p>
      
      <List>
        {props.components.map((component) => {
          return <Paper variant="outlined" sx={{
            marginBottom: 1
          }}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => {props.removeComponent(component)}}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    primary={<Typography variant="h6">{component}</Typography>}
                  />
                </Grid>
                <Grid item xs={10}>
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={12}>
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            onChange={(_event, checked) => { if (checked) { props.addComponentTrait(component, Traits.OutOfScope)} else { props.removeComponentTrait(component, Traits.OutOfScope) }}}
                            checked={props.componentHasTrait(component, Traits.OutOfScope)}
                          />
                        } 
                        label={
                          <div>
                            <Typography variant="subtitle2">
                              Out of Scope
                            </Typography>
                            <Typography variant="caption">
                              Our system interacts with this component, but we are not responsible for securing it.
                            </Typography>
                          </div>
                        } 
                    />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid> 
            </ListItem>
          </Paper>
        })}
      </List>
      <NewComponentForm handleSubmit={props.addComponent}/>
    </React.Fragment>
    
  );
}
