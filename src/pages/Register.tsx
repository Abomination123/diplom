import {
  IonCard,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';

import { IonGrid, IonRow, IonCol } from '@ionic/react';
import {
  addCircleOutline,
  personCircle,
  removeCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
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
  collection,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
} from '../firebase/config';

function validateEmail(email: string) {
  const re =
    // eslint-disable-next-line
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}
const Register: React.FC = () => {
  const history = useHistory();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [password, setPassword] = useState<string>('');
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleRegister = async () => {
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

    // try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);
    const uid = resp.user.uid;
    const data = isAdmin
      ? { id: uid, email, admin: true }
      : { id: uid, email, userSkills };
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, uid), data);
    /* eslint-disable */
    // @ts-ignore
    // window.IDDD = uid;
    if (!isAdmin) {
      history.push('/Coworkings', { user: data });
    } else {
      history.push('/addCoworking', { user: data });
    }
    // } catch (error) {
    //   alert(error);
    // }
  };

  const addSkill = () => {
    setUserSkills([...userSkills, '']);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...userSkills];
    newSkills.splice(index, 1);
    setUserSkills(newSkills);
  };

  const handleSkillChange = (value: string, index: number) => {
    const newSkills = [...userSkills];
    newSkills[index] = value;
    setUserSkills(newSkills);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
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
              <IonItem>
                <IonToggle
                  onIonChange={(e) => setIsAdmin(!isAdmin)}
                  justify='end'
                >
                  coworking admin
                </IonToggle>
              </IonItem>
            </IonCol>
            <br />
            <br />
            <br />
            <br />
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
                  onIonChange={(e) => setEmail(e.detail.value!)}
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
                  onIonChange={(e) => setPassword(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          {!isAdmin &&
            userSkills &&
            userSkills.map((skill, index) => (
              <IonRow key={index}>
                <IonCol>
                  <IonItem>
                    <IonLabel>Skill {index + 1}</IonLabel>
                    <IonInput
                      value={skill}
                      placeholder='Enter a skill'
                      onIonChange={(e) =>
                        handleSkillChange(e.detail.value || '', index)
                      }
                    />
                    <IonIcon
                      slot='end'
                      icon={removeCircleOutline}
                      onClick={() => removeSkill(index)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            ))}
          {!isAdmin && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '50px',
              }}
            >
              <IonLabel>Add another skill</IonLabel>
              <IonIcon
                icon={addCircleOutline}
                onClick={addSkill}
                size='large'
                style={{ marginLeft: '10px' }}
              />
            </div>
          )}
          <IonRow>
            <IonCol>
              {/* <p style={{ fontSize: 'small' }}>
                By clicking LOGIN you agree to our <a href='#'>Policy</a>
              </p> */}
              <IonButton expand='block' onClick={handleRegister}>
                Sign up
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
