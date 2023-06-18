import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { register } from 'swiper/element/bundle';
import Menu from './components/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import AddCoworking from './pages/AddCoworking';
import WorkingPlaces from './pages/WorkingPlaces';
import Bookings from './pages/Bookings';
import Coworkings from './pages/Coworkings';
import CoworkingPage from './pages/CoworkingPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import {
  auth,
  getAuth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
} from './firebase/config';
import { getCoworkingId } from './firebase/functions';
import { DocumentData } from 'firebase/firestore';
import { User } from './types';

setupIonicReact({
  rippleEffect: false,
  scrollAssist: false,
});

// register Swiper custom elements
register();

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DocumentData | undefined | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        // .then((document) => {
        const userData = userSnapshot.data();
        console.log(userData);
        // setLoading(false);
        setUser(userData);
        // })
        // .catch((error) => {
        // alert(error);
        setLoading(false);
        // });
      } else {
        console.error('No currentUser');
        // history.push('/login');
        setLoading(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <IonPage>Loading...</IonPage>;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId='main'>
          <Menu
            disabled={!(user && !user.admin)}
            email={user ? user.email : ''}
          />
          <IonRouterOutlet id='main'>
            <Route
              path='/'
              exact
              render={(props) => <Redirect to='/login' />}
            />
            <Route
              path='/login'
              exact
              render={(props) => <Login {...props} />}
            />
            <Route
              path='/register'
              exact
              render={(props) => <Register {...props} />}
            />
            <Route
              path='/Bookings'
              exact
              render={(props) =>
                user && !user.admin ? (
                  <Bookings user={user} {...props} />
                ) : (
                  <Redirect to='/login' />
                )
              }
            />
            <Route
              path='/Coworkings'
              exact
              render={(props) =>
                user ? (
                  <Coworkings user={user} {...props} />
                ) : (
                  <Redirect to='/login' />
                )
              }
            />
            <Route
              path='/Coworkings/:id'
              exact
              render={(props) =>
                user ? (
                  <CoworkingPage user={user} {...props} />
                ) : (
                  <Redirect to='/login' />
                )
              }
            />

            <Route
              path='/addCoworking'
              exact
              render={(props) =>
                user && user.admin ? (
                  <AddCoworking user={user} {...props} />
                ) : (
                  <Redirect to='/login' />
                )
              }
            />

            <Route
              path='/WorkingPlaces'
              exact
              render={(props) =>
                user && user.admin ? (
                  <WorkingPlaces user={user} {...props} />
                ) : (
                  <Redirect to='/login' />
                )
              }
            />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
