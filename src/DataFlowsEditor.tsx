import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Autocomplete, Button, IconButton, List, ListItem, ListItemText} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DataFlowEditorProps {
  components: string[],
  dataFlows: Map<string, Set<string>>,
  addFlow: (sourceComponent: string, destComponent: string) => void,
  removeFlow: (sourceComponent: string, destComponent: string) => void
}

function NewDataFlowForm(props: { 
  componentChoices: string[], 
  handleSubmit: (sourceComponent: string, destComponent: string) => void 
}) {
  const [sourceComponent, setSourceComponent] = React.useState<string | null>(null)
  const [destComponent, setDestComponent] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    if (sourceComponent != undefined && destComponent != undefined) {
      props.handleSubmit(sourceComponent, destComponent)
      setSourceComponent(null)
      setDestComponent(null)
    }
    event.preventDefault()
  }

  return <React.Fragment>
    <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              onChange={(event, value) => { setSourceComponent(value) }}
              value={sourceComponent}
              disablePortal
              options={props.componentChoices}
              renderInput={(params) => <TextField {...params} label="Source Component" required />}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              onChange={(event, value) => { setDestComponent(value) }}
              disabled={sourceComponent == undefined}
              value={destComponent}
              disablePortal
              options={props.componentChoices.filter(choice => choice != sourceComponent)}
              renderInput={(params) => <TextField {...params} label="Destination Component" required />}
            />
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" type="submit">Add Data Flow</Button>
          </Grid>
        </Grid>
      </form>
  </React.Fragment>
}

export default function DataFlowsEditor(props: DataFlowEditorProps) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Add Data Flows
      </Typography>
      <p>
        Describe which components share data with which other components - for example, a browser
        shares data with a web server, and a web server might share data with a database, etc.
      </p>
      <p>
        For simplicity, all data flows are assumed to be bidirectional.
      </p>
      
      <List>
        {Array.from(props.dataFlows).map(([sourceComponent, destComponents]: [string, Set<string>]) => {
          return Array.from(destComponents).map((destComponent: string) => {
            return <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => {props.removeFlow(sourceComponent, destComponent)}}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${sourceComponent} <-> ${destComponent}`} 
            />
          </ListItem>
          })
        })}
      </List>
      <NewDataFlowForm componentChoices={props.components} handleSubmit={props.addFlow}/>
    </React.Fragment>
  );
}
