import React from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from './Firebase/';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Home from '@material-ui/icons/Home';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


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
        
        <AppBar position="fixed" style={{ backgroundColor: '#001f3f' }}>
          <Toolbar color="inherit"> 
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <Link to={ROUTES.HOME} style={{ textDecoration: 'none' }}><Home style={{ color: 'white' }} /></Link>
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              
            </Typography>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <Link to={ROUTES.ACCOUNT} style={{ textDecoration: 'none', outline: "none" }}><MenuItem onClick={this.handleClose}>My account</MenuItem></Link>
                  <MenuItem onClick={() => {firebase.doSignOut(); this.handleClose();}}>Sign Out</MenuItem>
                </Menu>
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