import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, Button, IconButton, List, ListItem, ListItemText, Paper, Tooltip} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpIcon from '@mui/icons-material/Help';
import { useTheme } from '@mui/material/styles';
import { AllTraits, Trait } from './ComponentTraits';

interface ComponentsEditorProps {
  components: string[],
  componentTraitsMap: Map<string, Trait[]>,
  addComponent: (component: string) => void,
  removeComponent: (component: string) => void
  setComponentTraits: (component: string, selectedTraits: Trait[]) => void
}

function NewComponentForm(props: { handleSubmit: (newComponentName: string) => void }) {
  const [currentComponentName, setCurrentComponentName] = React.useState<string | undefined>(undefined)

  const handleSubmit = (event: React.FormEvent) => {
    if (currentComponentName != undefined) {
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
                    primary={component}
                  />
                </Grid>
                <Grid item xs={7}>
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={11}>
                      <Autocomplete
                        multiple
                        id="tags-standard"
                        options={AllTraits}
                        value={props.componentTraitsMap.get(component) ?? []}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Traits"
                              placeholder="Traits"
                            />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box
                              sx={{
                                flexGrow: 1,
                                '& span': {
                                  color:
                                    theme.palette.mode === 'light' ? '#586069' : '#8b949e',
                                },
                              }}
                            >
                              {option.name}
                              <br />
                              <span>{option.description}</span>
                            </Box>
                          </li>
                        )}
                        onChange={(_event, selectedTraits) => { props.setComponentTraits(component, selectedTraits)}}
                      />
                    </Grid>
                    <Grid item>
                      <Box sx={{marginTop: '1em'}}>
                        <Tooltip title="Add relevant traits to improve the suggestions provided in the discussion guide.">
                          <HelpIcon />
                        </Tooltip>
                      </Box>
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
