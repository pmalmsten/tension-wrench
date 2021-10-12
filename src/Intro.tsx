import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function Intro() {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Welcome!
      </Typography>
      <p>
        This tool will help you think about how attackers might probe a software system
        that you are building. Once you describe a few things about your project,
        Trenchcoat will generate a discussion guide use can use with your team to start
        thinking about what attackers might try in order to break in and ways to stop
        them.
      </p>
      <p>
        Keep your critical thinking hat on! You and your team are the experts about what
        you are building - this tool can't and won't tell you specifically how to secure
        it. This tool will help walk you and your team through a list of things to think
        about, but it's up to you to brainstorm and think critically about what risks your
        project faces and how to mitigate them. 
      </p>
    </React.Fragment>
  );
}
