import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class NotFound extends Component {
  render() {
    return <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
    >
        <Typography variant="h3" gutterBottom>
            404 Page not found.
        </Typography>
    </Grid>;
  }
}
