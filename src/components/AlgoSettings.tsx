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

export type RangeValue = {
  lower: number;
  upper: number;
};

export type newSettings = {
  location: string;
  skills: string[];
  priceRange: RangeValue;
};

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
  }, [location, skills]);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }, []);

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

  // scdjcjac
  // const handleConfirm = () => {
  //   onAlgorithmRestart({
  //     location: userLocation,
  //     skills: userSkills,
  //     priceRange,
  //   });
  //   setShowModal(false);
  // };

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
          <IonInput
            value={userLocation}
            placeholder='Enter your location'
            style={{ paddingLeft: '10px', color: 'black' }}
            onIonChange={(e) => setUserLocation(e.detail.value || '')}
          />
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonLabel>Price Range</IonLabel>
          </IonCardHeader>
          <IonRange
            aria-label='Dual Knobs Range'
            dualKnobs={true}
            value={{
              lower: userPriceRange?.lower ?? 20,
              upper: userPriceRange?.upper ?? 80,
            }}
            onIonChange={(e) => setUserPriceRange(e.detail.value as RangeValue)}
          >
            <IonLabel slot='start'>{userPriceRange?.lower ?? 0}</IonLabel>
            <IonLabel slot='end'>{userPriceRange?.upper ?? 100}</IonLabel>
          </IonRange>
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
            </IonCard>
          ))}
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
        </div>{' '}
      </IonContent>
    </IonPage>
  );
};

export default AlgoSettings;
