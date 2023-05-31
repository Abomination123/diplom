import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import WorkingPlaceCard from '../components/WorkingPlaceCard'
import { WorkingPlace, AvailableDate, User, TimeSlot, CustomizedState } from '../types';
import AvailabilityModal from '../components/AvailabilityModal';
import {
  getWorkingPlaces,
  createWorkingPlace,
  deleteWorkingPlace,
  addAvailableDateToWorkingPlaces,
  createBooking,
} from '../firebase/functions';
import { RouteComponentProps, useLocation } from 'react-router';
import { DocumentData } from 'firebase/firestore';

export const mockedAvailableDates = {
  '2023-06-01': [
    { startTime: { hour: '10', minute: '00' }, endTime: { hour: '12', minute: '15' } },
    { startTime: { hour: '13', minute: '30' }, endTime: { hour: '15', minute: '45' } },
    { startTime: { hour: '16', minute: '30' }, endTime: { hour: '18', minute: '45' } },
  ],
  '2023-06-02': [
    { startTime: { hour: '09', minute: '00' }, endTime: { hour: '11', minute: '15' } },
    { startTime: { hour: '12', minute: '30' }, endTime: { hour: '14', minute: '45' } },
    { startTime: { hour: '15', minute: '30' }, endTime: { hour: '17', minute: '45' } },
  ],
  '2023-06-03': [
    { startTime: { hour: '10', minute: '00' }, endTime: { hour: '12', minute: '15' } },
    { startTime: { hour: '13', minute: '30' }, endTime: { hour: '15', minute: '45' } },
    { startTime: { hour: '16', minute: '30' }, endTime: { hour: '18', minute: '45' } },
  ],
  '2023-06-04': [
    { startTime: { hour: '11', minute: '00' }, endTime: { hour: '13', minute: '15' } },
    { startTime: { hour: '14', minute: '30' }, endTime: { hour: '16', minute: '45' } },
    { startTime: { hour: '17', minute: '30' }, endTime: { hour: '19', minute: '45' } },
  ],
  '2023-06-05': [
    { startTime: { hour: '10', minute: '00' }, endTime: { hour: '12', minute: '15' } },
    { startTime: { hour: '13', minute: '30' }, endTime: { hour: '15', minute: '45' } },
    { startTime: { hour: '16', minute: '30' }, endTime: { hour: '18', minute: '45' } },
  ],
  '2023-06-06': [
    { startTime: { hour: '09', minute: '00' }, endTime: { hour: '11', minute: '15' } },
    { startTime: { hour: '12', minute: '30' }, endTime: { hour: '14', minute: '45' } },
    { startTime: { hour: '15', minute: '30' }, endTime: { hour: '17', minute: '45' } },
  ],
};

const getRandomSubobject = (obj: any, min: number, max: number) => {
  const keys = Object.keys(obj);
  const size = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomKeys = Array.from({ length: size }, () => {
    const index = Math.floor(Math.random() * keys.length);
    return keys.splice(index, 1)[0];
  });
  return randomKeys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
};

const positions = ['North wing', 'South wing', 'East wing', 'West wing', 'Center'];

export const mockWorkingPlaces = Array.from({ length: Math.floor(Math.random() * 11) + 5 }, () => {
  const seats = Math.floor(Math.random() * 5) + 1;
  const pricePerHour = seats * 10 + Math.floor(Math.random() * 21) - 10;
  const randomAvailableDates = getRandomSubobject(mockedAvailableDates, 1, 5);
  return {
    id: `wp_${Math.random()}`,
    seats: seats,
    position: positions[Math.floor(Math.random() * positions.length)],
    pricePerHour: pricePerHour,
    availableDates: mockedAvailableDates
  };
});

interface WorkingPlacesPageProps extends RouteComponentProps {
  user: DocumentData;
}

const WorkingPlaces: React.FC<WorkingPlacesPageProps> = ({ user, location }) => {
  const [coworkingId, setCoworkingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean | string>(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [workingPlaces, setWorkingPlaces] = useState<WorkingPlace[]>([]);

  const state = location.state as CustomizedState;

  useEffect(() => {
    setCoworkingId(state.coworkingId as string);
  }, []);

  const fetchWorkingPlaces = useCallback(async () => {
    if (coworkingId) {
      const data = await getWorkingPlaces(coworkingId);
      // const timestamp = serverTimestamp();

      if (data.length === 0) {
        setWorkingPlaces(mockWorkingPlaces);
      } else {
        setWorkingPlaces(data);
      }
    }
  }, [coworkingId]);

  useEffect(() => {
    if (coworkingId) {
      fetchWorkingPlaces();
    }
  }, [coworkingId, fetchWorkingPlaces]);

  const handleAddWorkingPlace = (e: any) => {
    e.preventDefault();
    if (!isEditing) {
      // const timestamp = serverTimestamp();
      const newWorkingPlace = {
        id: `wp_${Math.random()}`,
        seats: 1,
        position: 'North wing',
        pricePerHour: 10,
        // createdAt: timestamp,
        availableDates: {}
      };
      setWorkingPlaces((prevWorkingPlaces) => [
        ...prevWorkingPlaces,
        newWorkingPlace
      ]);
      console.log(newWorkingPlace);
      setIsEditing(newWorkingPlace.id);
      // window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const handleSaveWorkingPlace = async (workingPlace: Omit<WorkingPlace, 'id'>) => {
    if (coworkingId) {
      await createWorkingPlace(workingPlace, coworkingId);
      fetchWorkingPlaces();

      if (workingPlaces.some(place => place.id.startsWith('wp_'))) {
        setSelectedPlaces(selectedPlaces.filter(id => !id.startsWith('wp_')));
      }
    }
  }

  const handleDeleteWorkingPlace = async (workingPlaceId: string) => {
    setWorkingPlaces(workingPlaces.filter((place) => place.id !== workingPlaceId));
    setSelectedPlaces(selectedPlaces.filter(id => id !== workingPlaceId));
    if (isEditing) {
      setIsEditing(false);
    } else {
      await deleteWorkingPlace(workingPlaceId);
    }
    console.log(`Deleting working place: ${workingPlaceId}`);
  };

  const handlePlaceSelection = (placeId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPlaces([...selectedPlaces, placeId]);
    } else {
      setSelectedPlaces(selectedPlaces.filter((id) => id !== placeId));
    }
  };

  const [present, dismiss] = useIonModal(AvailabilityModal, {
    onDismiss: (
      data:
        | {
          dates: string[];
          startTime: string;
          endTime: string;
          availability: boolean;
        }
        | null
        | undefined,
      role: string
    ) => dismiss(data, role),
  });

  const openModal = () => {
    present({
      onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          const { dates, startTime, endTime, availability }
            : { dates: string[], startTime: string, endTime: string, availability: boolean } = ev.detail.data;
          const newStartTime = startTime.split(':');
          const newEndTime = endTime.split(':');
          const newTimeSlot: TimeSlot = {
            startTime: { hour: newStartTime[0], minute: newStartTime[1] },
            endTime: { hour: newEndTime[0], minute: newEndTime[1] },
          };
          console.log(ev.detail.data);
          console.log(selectedPlaces);
          if (availability) {
            await addAvailableDateToWorkingPlaces(selectedPlaces, { dates, timeSlot: newTimeSlot });
          } else {
            const bookingPromises = selectedPlaces.map(place => createBooking({
              userId: user.id,
              coworkingId: coworkingId as string,
              timeSlot: newTimeSlot,
              workingPlaceId: place
            }, dates));

            await Promise.all(bookingPromises);
          }
          await fetchWorkingPlaces();
        }
      },
    });
  };

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
            disabled={Boolean(isEditing)}
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
          <IonRow>
            {workingPlaces.map((place, index) => (
              <IonCol size='6' key={place.id}>
                <WorkingPlaceCard
                  place={place}
                  handleSaveWorkingPlace={handleSaveWorkingPlace}
                  handleDeleteWorkingPlace={handleDeleteWorkingPlace}
                  isEditing={
                    Boolean(isEditing) &&
                    (typeof isEditing === 'string'
                      ? isEditing === place.id
                      : true)
                  }
                  checked={selectedPlaces.includes(place.id)}
                  setIsEditing={setIsEditing}
                  onSelectionChange={handlePlaceSelection}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WorkingPlaces;
