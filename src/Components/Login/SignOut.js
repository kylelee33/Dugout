import React from 'react';

import { withFirebase } from '../Firebase';

const SignOut = ({ firebase }) => {
    return (
        <button type="button" onClick={firebase.doSignOut}>
            Sign Out
        </button>
    );
};

export default withFirebase(SignOut);