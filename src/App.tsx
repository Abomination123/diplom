import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
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

setupIonicReact();

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const userRef = doc(db, 'users', user.uid);
    //     getDoc(userRef)
    //       .then((document) => {
    //         const userData = document.data();
    //         setLoading(false);
    //         setUser(userData);
    //       })
    //       .catch((error) => {
    //         alert(error);
    //         setLoading(false);
    //       });
    //   } else {
    //     setLoading(false);
    //   }});
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId='main'>
          <Menu />
          <IonRouterOutlet id='main'>
            <Route path='/' exact={true}>
              <Redirect to='/login' />
            </Route>
            <Route path='/login' exact={true}>
              <Login />
            </Route>
            <Route path='/register' exact={true}>
              <Register />
            </Route>
            <Route path='/addCoworking' exact={true}>
              <AddCoworking />
            </Route>
            <Route path='/WorkingPlaces' exact={true}>
              <WorkingPlaces />
            </Route>
            <Route path='/Coworkings' exact={true}>
              <Coworkings />
            </Route>
            <Route
              path='/Coworkings/:id'
              exact={true}
              component={CoworkingPage}
            ></Route>
            <Route path='/Bookings' exact={true}>
              <Bookings />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
