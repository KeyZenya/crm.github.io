import React, { Component } from 'react';
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography/Typography";
import ListItem from "@material-ui/core/ListItem/ListItem";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';


export default class Product extends Component {
    render() {
        return (
            <ListItem>
                <ListItemText primary={this.props.product.id} secondary={this.props.product.amount} />
                <Typography variant="body2">{this.props.product.price}</Typography>
                <IconButton edge="end" aria-label="comments" onClick={this.props.onDelete}>
                    <HighlightOffIcon />
                </IconButton>
            </ListItem>
        );
    }
}
