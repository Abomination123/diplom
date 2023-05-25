/* eslint-disable */
//@ts-nocheck
import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  useIonModal,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import { add, timeOutline } from 'ionicons/icons';
import WorkingPlaceCard, { WorkingPlace } from '../components/WorkingPlaceCard';
import BookingModal from '../components/BookingModal';

const WorkingPlaces: React.FC = () => {
  const [workingPlaces, setWorkingPlaces] = useState<WorkingPlace[]>(
    Array(7)
      .fill(0)
      .map(() => ({
        id: `wp_${Math.random()}`,
        seats: 4,
        position: 'North wing',
        pricePerHour: 10,
      }))
  );

  const [present, dismiss] = useIonModal(BookingModal, {
    // dates: [],
    // startTime: ,
    // endTime: ,
    onDismiss: (
      data:
        | {
            location: string;
            startTime: string;
            endTime: string;
            availability: boolean;
          }
        | null
        | undefined,
      role: string
    ) => dismiss(data, role),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const handleAddWorkingPlace = (e: any) => {
    e.preventDefault();
    if (!isEditing) {
      setWorkingPlaces((prevWorkingPlaces) => [
        ...prevWorkingPlaces,
        {
          id: `wp_${Math.random()}`,
          seats: 4,
          position: 'North wing',
          pricePerHour: 10,
        },
      ]);
      setIsEditing(true);
    }
  };

  const handlePlaceSelection = (placeId, isSelected) => {
    if (isSelected) {
      setSelectedPlaces([...selectedPlaces, placeId]);
    } else {
      setSelectedPlaces(selectedPlaces.filter((id) => id !== placeId));
    }
  };

  const openModal = () => {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          //request bd
        }
      },
    });
  };

  const groupedWorkingPlaces = workingPlaces.reduce(
    (accumulator, currentValue, currentIndex, array) => {
      if (currentIndex % 2 === 0) {
        accumulator.push(array.slice(currentIndex, currentIndex + 2));
      }
      return accumulator;
    },
    []
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Working Places</IonTitle>
          <IonButton
            slot='end'
            size='small'
            fill='outline'
            disabled={selectedPlaces.length === 0}
            style={{ marginRight: '10px' }}
            onClick={() => openModal()}
          >
            <small>Set time</small>
            <IonIcon slot='end' icon={timeOutline} />
          </IonButton>
          <IonButton
            slot='end'
            size='small'
            fill='outline'
            disabled={isEditing}
            style={{ marginRight: '10px' }}
            onClick={handleAddWorkingPlace}
          >
            <small>Add place</small>
            <IonIcon slot='end' icon={add} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          {groupedWorkingPlaces.map(([rightPlace, leftPlace], index) => (
            <IonRow key={index + Date.now()}>
              <IonCol size='6'>
                <WorkingPlaceCard
                  place={rightPlace}
                  isEditing={
                    isEditing &&
                    index == groupedWorkingPlaces.length - 1 &&
                    !leftPlace
                  }
                  checked={selectedPlaces.includes(rightPlace.id)}
                  setIsEditing={setIsEditing}
                  onSelectionChange={handlePlaceSelection}
                />
              </IonCol>
              {leftPlace && (
                <IonCol size='6'>
                  <WorkingPlaceCard
                    place={leftPlace}
                    checked={selectedPlaces.includes(leftPlace.id)}
                    isEditing={
                      isEditing && index == groupedWorkingPlaces.length - 1
                    }
                    setIsEditing={setIsEditing}
                    onSelectionChange={handlePlaceSelection}
                  />
                </IonCol>
              )}
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WorkingPlaces;
