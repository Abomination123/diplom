import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonModal,
  IonContent,
  IonInput,
  IonIcon,
  IonRange,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCheckbox,
} from '@ionic/react';
import {
  addCircleOutline,
  removeCircleOutline,
  locationOutline,
} from 'ionicons/icons';
import { newSettings } from '../types';
import './AlgoSettings.css';

interface AlgoSettingsProps {
  location: string;
  skills: string[];
  price: number | null;
  getLocation: (modalIcon?: boolean) => Promise<string>;
  onDismiss: (
    data?:
      | { location: string; price: number | null; skills: string[] }
      | null
      | undefined,
    role?: string
  ) => void;
}

const AlgoSettings: React.FC<AlgoSettingsProps> = ({
  location,
  skills,
  price,
  getLocation,
  onDismiss,
}) => {
  const [userLocation, setUserLocation] = useState(location);
  const [userSkills, setUserSkills] = useState(skills);
  const [userPrice, setUserPrice] = useState<number | null>(price);
  const [useCheckbox, setUseCheckbox] = useState<boolean>(false);

  useEffect(() => {
    setUserLocation(location);
    setUserSkills(skills);
    setUserPrice(price);
  }, [location, skills, price]);

  const handleCheckboxChange = () => {
    setUseCheckbox(!useCheckbox);
    setUserPrice((prevPrice) => (!prevPrice ? 50 : null));
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
          <IonButtons slot='start'>
            <IonButton color='medium' onClick={() => onDismiss(null, 'cancel')}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Algo Settings</IonTitle>
          <IonButtons slot='end'>
            <IonButton
              onClick={() =>
                onDismiss(
                  {
                    location: userLocation,
                    price: useCheckbox ? userPrice : null,
                    skills: userSkills,
                  },
                  'confirm'
                )
              }
              strong={true}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonLabel>Location</IonLabel>
          </IonCardHeader>
          <IonItem lines='none'>
            <IonInput
              value={userLocation}
              placeholder='Enter your location'
              // className='input-location'
              onIonChange={(e) => setUserLocation(e.detail.value || '')}
            />
            <IonIcon
              slot='end'
              size='large'
              icon={locationOutline}
              onClick={async () => {
                const currentLocation = await getLocation(true);
                setUserLocation(currentLocation);
              }}
            />
          </IonItem>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonLabel>Target Price</IonLabel>
          </IonCardHeader>
          <IonItem lines='none'>
            <IonRange
              disabled={!userPrice}
              value={userPrice ? userPrice : undefined}
              onIonInput={(e) => setUserPrice(e.detail.value as number)}
            >
              <IonLabel slot='start'>{10}</IonLabel>
              <IonLabel slot='end'>{60}</IonLabel>
            </IonRange>
            <IonCheckbox
              slot='end'
              className='checkbox-price'
              checked={useCheckbox}
              onIonChange={handleCheckboxChange}
            />
          </IonItem>
        </IonCard>
        {userSkills &&
          userSkills.map((skill, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonLabel>Skill {index + 1}</IonLabel>
              </IonCardHeader>
              <IonItem lines='none'>
                <IonInput
                  value={skill}
                  placeholder='Enter a skill'
                  onIonInput={(e) =>
                    handleSkillChange(e.detail.value || '', index)
                  }
                />
                <IonIcon
                  slot='end'
                  // className='icon-end'
                  icon={removeCircleOutline}
                  onClick={() => removeSkill(index)}
                />
              </IonItem>
            </IonCard>
          ))}
        <div className='add-skill'>
          <IonLabel>Add another skill</IonLabel>
          <IonIcon
            icon={addCircleOutline}
            onClick={addSkill}
            size='large'
            style={{ marginLeft: '10px' }}
          />
        </div>{' '}
      </IonContent>
    </IonPage>
  );
};

export default AlgoSettings;
