import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyBCehhYxRomrDlS9DUaIGVLnyLVPr-L2CE",
    authDomain: "dugout-eec3f.firebaseapp.com",
    databaseURL: "https://dugout-eec3f.firebaseio.com",
    projectId: "dugout-eec3f",
    storageBucket: "dugout-eec3f.appspot.com",
    messagingSenderId: "511353098748"
  };

  class Firebase {
    constructor() {
      app.initializeApp(config);

      this.auth = app.auth();
      this.db = app.database();
      this.serverValue = app.database.ServerValue;
    }

    doCreateUserWithEmailAndPassword = (email, password) => {
      return this.auth.createUserWithEmailAndPassword(email, password);
    }

    doSignInWithEmailAndPassword = (email, password) => {
      return this.auth.signInWithEmailAndPassword(email, password);
    }

    doSignOut = () => {
      return this.auth.signOut();
    }

    doPasswordReset = (email) => {
      return this.auth.sendPasswordResetEmail(email);
    }

    doPasswordUpdate = (password) => {
      return this.auth.currentUser.updatePassword(password);
    }

    doUpdateProfile = (displayName) => {
      return this.auth.currentUser.updateProfile(displayName);
    }

    user = (uid) => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');

    message = (uid) => this.db.ref(`messages/${uid}`);

    messages = () => this.db.ref('messages');

    username = (username) => this.db.ref(`usernames/${username}`);

    usernames = () => this.db.ref('usernames');
  }
  
  export default Firebase;