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
} from '@ionic/react';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { RangeValue, newSettings } from '../types';
import './AlgoSettings.css';

interface AlgoSettingsProps {
  location: string;
  skills: string[];
  priceRange: RangeValue;
  // onAlgorithmRestart: (newSettings: newSettings) => void;
  onDismiss: (
    data?:
      | { location: string; priceRange: RangeValue; skills: string[] }
      | null
      | undefined,
    role?: string
  ) => void;
}

const AlgoSettings: React.FC<AlgoSettingsProps> = ({
  location,
  skills,
  priceRange,
  // onAlgorithmRestart,
  onDismiss,
}) => {
  const [userLocation, setUserLocation] = useState(location);
  const [userSkills, setUserSkills] = useState(skills);
  const [userPriceRange, setUserPriceRange] = useState<RangeValue>(priceRange);

  useEffect(() => {
    setUserLocation(location);
    setUserSkills(skills);
    setUserPriceRange(priceRange);
  }, [location, skills, priceRange]);

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
                    priceRange: userPriceRange,
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
          </IonItem>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonLabel>Price Range</IonLabel>
          </IonCardHeader>
          <IonItem lines='none'>
            <IonRange
              aria-label='Dual Knobs Range'
              dualKnobs={true}
              value={{
                lower: userPriceRange?.lower ?? 20,
                upper: userPriceRange?.upper ?? 80,
              }}
              onIonInput={(e) =>
                setUserPriceRange(e.detail.value as RangeValue)
              }
            >
              <IonLabel slot='start'>{userPriceRange?.lower ?? 0}</IonLabel>
              <IonLabel slot='end'>{userPriceRange?.upper ?? 100}</IonLabel>
            </IonRange>
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
