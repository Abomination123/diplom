import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router-dom';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import {
  auth,
  db,
  doc,
  getDoc,
  signInWithEmailAndPassword,
} from '../firebase/config';
import { getCoworkingId } from '../firebase/functions';
import { User } from '../types';

const validateEmail = (email: string) => {
  const re =
    // eslint-disable-next-line
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
};

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleLogin = async () => {
    // if (!email) {
    //   setMessage('Please enter a valid email');
    //   setIserror(true);
    //   return;
    // }
    // if (validateEmail(email) === false) {
    //   setMessage('Your email is invalid');
    //   setIserror(true);
    //   return;
    // }

    // if (!password || password.length < 6) {
    //   setMessage('Please enter your password');
    //   setIserror(true);
    //   return;
    // }

    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const uid = resp.user.uid;
      console.log(uid);

      const userRef = doc(db, 'users', uid);

      const firestoreDocument = await getDoc(userRef);
      if (firestoreDocument.exists()) {
        const user = firestoreDocument.data();
        if (!user.admin) {
          history.push('/Coworkings');
        } else {
          const coworkingId = await getCoworkingId(uid);
          console.log(coworkingId);

          if (coworkingId) {
            history.push('/WorkingPlaces', { coworkingId });
          } else {
            history.push('/addCoworking');
          }
        }
      } else {
        alert('User does not exist anymore.');
        return;
      }
    } catch (error) {
      alert(error);
    }

    // const api = axios.create({
    //   baseURL: `https://reqres.in/api`,
    // });
    // api
    //   .post('/login', loginData)
    //   .then((res) => {
    //     history.push('/dashboard/' + email);
    //   })
    //   .catch((error) => {
    //     setMessage('Auth failure! Please create an account');
    //     setIserror(true);
    //   });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding ion-text-center'>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass='my-custom-class'
                header={'Error!'}
                message={message}
                buttons={['Dismiss']}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonIcon
                style={{ fontSize: '70px', color: '#0040ff' }}
                icon={personCircle}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'> Email</IonLabel>
                <IonInput
                  type='email'
                  value={email}
                  autocomplete='email'
                  onIonInput={(e) => setEmail(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'> Password</IonLabel>
                <IonInput
                  type='password'
                  value={password}
                  autocomplete='current-password'
                  onIonInput={(e) => setPassword(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {/* <p style={{ fontSize: 'small' }}>
                By clicking LOGIN you agree to our <a href='#'>Policy</a>
              </p> */}
              <IonButton expand='block' onClick={handleLogin}>
                Login
              </IonButton>
              <IonList>
                <IonItem
                  routerLink={'/register'}
                  routerDirection='none'
                  lines='none'
                  detail={false}
                >
                  Don&apos;t have an account?&nbsp;&nbsp;
                  <IonText color='danger'> Sign up!</IonText>
                </IonItem>
              </IonList>
              {/* <p style={{ fontSize: 'medium' }}>
                Don't have an account? <a href='#'>Sign up!</a>
              </p> */}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
