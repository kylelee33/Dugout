import React from 'react';
import { withFirebase } from './Firebase/';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Home from '@material-ui/icons/Home';


import * as ROUTES from '../Constants/Routes';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      auth: true,
      anchorEl: null,
    };
  }
  

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };


  render() {
    const { classes, firebase } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        
        <AppBar position="static" style={{ backgroundColor: '#001f3f' }}>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <Home style={{ color: 'white' }} />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              
            </Typography>
            {auth && (
              <div>
                <Link to={ROUTES.SIGN_IN} style={{ textDecoration: 'none', color: 'inherit' }} >
                <Button color="inherit">Login</Button>
                </Link>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withFirebase(withStyles(styles)(MenuAppBar));