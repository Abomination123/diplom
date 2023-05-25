import React, { useState, useRef } from 'react';
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
  IonDatetime,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';

interface BookingModalProps {
  onDismiss: (
    data?:
      | {
          dates: string[];
          startTime: string;
          endTime: string;
          availability: boolean;
        }
      | null
      | undefined,
    role?: string
  ) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onDismiss }) => {
  const [userDate, setUserDate] = useState<string[]>([]);
  const [userStartTime, setUserStartTime] = useState('10.00');
  const [userEndTime, setUserEndTime] = useState('18:00');
  const [availability, setAvailability] = useState<boolean>(true);
  const datetimeRef = useRef<HTMLIonDatetimeElement>(null);

  const handleDateChange = (e: any) => {
    setUserDate(e.detail.value);
  };

  const handleStartTimeChange = (e: any) => {
    setUserStartTime(e.detail.value);
  };

  const handleEndTimeChange = (e: any) => {
    setUserEndTime(e.detail.value);
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
          <IonTitle>Set working places time</IonTitle>
          <IonButtons slot='end'>
            <IonButton
              onClick={() =>
                onDismiss(
                  {
                    dates: userDate,
                    startTime: userStartTime,
                    endTime: userEndTime,
                    availability: availability,
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
        <IonItem>
          <IonLabel>Select Date(s)</IonLabel>
          <IonDatetime
            ref={datetimeRef}
            presentation='date'
            multiple={true}
            onIonChange={handleDateChange}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonLabel>Start Time</IonLabel>
          <IonDatetime
            presentation='time'
            onIonChange={handleStartTimeChange}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonLabel>End Time</IonLabel>
          <IonDatetime
            presentation='time'
            onIonChange={handleEndTimeChange}
          ></IonDatetime>
        </IonItem>
        <IonItem>
          <IonLabel>choost type:</IonLabel>
          <IonRadioGroup
            value={availability}
            onIonChange={(e) => setAvailability(e.detail.value)}
          >
            <IonItem>
              <IonLabel>Available</IonLabel>
              <IonRadio slot='start' value={true} />
            </IonItem>
            <IonItem>
              <IonLabel>Booked</IonLabel>
              <IonRadio slot='start' value={false} />
            </IonItem>
          </IonRadioGroup>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default BookingModal;
