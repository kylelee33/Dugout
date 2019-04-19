import React from 'react';
import { AuthUserContext } from './Session';

import AppBar from '../Components/AppBar';
import AppBarNoAuth from '../Components/AppBarNoAuth';


const Navigation = () => {
    return(
    <div>
    <AuthUserContext.Consumer>{authUser => authUser ? <NavigationAuth /> : <NavigationNoAuth />}
    </AuthUserContext.Consumer>
    </div>
    )
}

const NavigationAuth = () => {
    return (
        <div>
            <AppBar />
           
        </div>
    );
};

const NavigationNoAuth = () => {
    return (
        <div>
            <AppBarNoAuth />
        
        </div>
    )
};

export default Navigation;