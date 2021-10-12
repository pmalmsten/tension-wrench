import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, IconButton, List, ListItem, ListItemText} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ComponentsEditorProps {
  components: string[],
  addComponent: (component: string) => void,
  removeComponent: (component: string) => void
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
          return <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => {props.removeComponent(component)}}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={component}
            />
          </ListItem>
        })}
      </List>
      <NewComponentForm handleSubmit={props.addComponent}/>
    </React.Fragment>
    
  );
}
