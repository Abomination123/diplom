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
  IonCol,
  IonRow,
  IonToast,
} from '@ionic/react';
import { addCircleOutline, alertCircleOutline, removeCircleOutline } from 'ionicons/icons';
import './AvailabilityModal.css'

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

const AvailabilityModal: React.FC<BookingModalProps> = ({ onDismiss }) => {
  const [pickedDates, setPickedDates] = useState<string[]>([]);
  const [userStartTime, setStartTime] = useState('10:00');
  const [userEndTime, setEndTime] = useState('18:00');
  const [availability, setAvailability] = useState<boolean>(true);
  const [showToast, setShowToast] = useState(false);
  const datetimeRef = useRef<HTMLIonDatetimeElement>(null);

  const handleDateChange = (e: any) => {
    setPickedDates(e.detail.value);
    console.log(e.detail.value);
  };

  const handleStartTimeChange = (e: any) => {
    console.log(e.detail.value);

    setStartTime(e.detail.value);
  };

  const handleEndTimeChange = (e: any) => {
    setEndTime(e.detail.value);
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
              onClick={() => {
                if (pickedDates.length === 0) {
                  setShowToast(true);
                } else {
                  onDismiss(
                    {
                      dates: pickedDates,
                      startTime: userStartTime,
                      endTime: userEndTime,
                      availability: availability,
                    },
                    'confirm'
                  );
                }
              }}
              strong={true}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonDatetime
            ref={datetimeRef}
            presentation='date'
            multiple={true}
            min={new Date().toISOString().split('T')[0]}
            onIonChange={handleDateChange}
          ></IonDatetime>
        </IonItem>
        <IonRow>
          <IonCol size="6">
            <div className='container'>
              <label>Start Time</label>
              <div>
                <IonDatetime
                  value={userStartTime}
                  presentation='time'
                  hour-cycle='h23'
                  onIonChange={handleStartTimeChange}
                ></IonDatetime>
              </div>
            </div>
          </IonCol>
          <IonCol size="6">
            <div className='container'>
              <label>End Time</label>
              <div>
                <IonDatetime
                  value={userEndTime}
                  presentation='time'
                  hour-cycle='h23'
                  onIonChange={handleEndTimeChange}
                ></IonDatetime>
              </div>
            </div>
          </IonCol>
        </IonRow>
        <IonItem>
          <IonLabel>Choose type:</IonLabel>
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
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Choose date(s) before confirming"
          duration={3000}
          buttons={[
            {
              text: 'OK',
              role: 'cancel',
            },
          ]}
          cssClass="custom-toast"
          icon={alertCircleOutline}
        />
      </IonContent>
    </IonPage>
  );
};

export default AvailabilityModal;
