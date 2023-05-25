import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';

const reservations = [
  {
    id: 1,
    location: 'Kyiv, Ukraine',
    date: '2023-05-17',
    time: '19:00 - 20:00',
  },
  {
    id: 2,
    location: 'Lviv, Ukraine',
    date: '2023-05-18',
    time: '18:30 - 20:00',
  },
  // дополните данные
];

const ReservationList: React.FC = () => {
  const handleCancel = (id: number) => {
    console.log(`Отмена резервации ${id}`);
    // Здесь добавьте логику отмены бронирования
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bookings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {reservations.map((reservation) => (
            <IonItem key={reservation.id}>
              <IonLabel>
                <h2 style={{ fontSize: '0.8rem', color: 'black' }}>
                  {reservation.location}
                </h2>
                <h3 style={{ fontSize: '0.6rem', color: 'gray' }}>
                  {reservation.date} {reservation.time}
                </h3>
              </IonLabel>
              <IonButton
                fill='clear'
                slot='end'
                onClick={() => handleCancel(reservation.id)}
              >
                <IonIcon slot='icon-only' icon={closeCircleOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ReservationList;
