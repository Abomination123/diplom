import React, { useEffect, useState } from 'react';
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
  IonAlert,
} from '@ionic/react';
import {
  checkmarkDoneCircleOutline,
  closeCircleOutline,
  sadOutline,
  businessOutline,
  ellipsisHorizontalCircleOutline,
} from 'ionicons/icons';
import { Booking, CustomizedState, DocumentDataInterface } from '../types';
import { bookingsMock } from '../components/WorkingPlaceCard';
import { cancelBooking, getBookingsByUserId } from '../firebase/functions';
import { DocumentData } from 'firebase/firestore';
import { RouteComponentProps } from 'react-router';

interface BookingsPageProps extends RouteComponentProps {
  user: DocumentData;
}

const Bookings: React.FC<BookingsPageProps> = ({
  user,
  history,
  location,
  match,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState<[boolean, string]>([
    false,
    '',
  ]);
  const [bookings, setBookings] = useState<Booking[]>(bookingsMock);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookingsByUserId(user.id);
      data.sort((a, b) => {
        const dateA = new Date(
          `${a.date}T${a.timeSlot.startTime.hour}:${a.timeSlot.startTime.minute}`
        );
        const dateB = new Date(
          `${b.date}T${b.timeSlot.startTime.hour}:${b.timeSlot.startTime.minute}`
        );

        return dateB.getTime() - dateA.getTime();
      });
      if (data.length) {
        setBookings(data);
      } else {
        setBookings(bookingsMock);
      }
    };

    fetchBookings();
  }, [user.id]);

  const handleMoveToCoworkingPage = async (coworkingId: string) => {
    if (coworkingId.startsWith('co')) {
      console.log('not moving cause it is mocked (not existing) coworking');
    } else {
      history.push(`/Coworkings/${coworkingId}`);
    }
  };

  const handleConfirmDelete = async () => {
    console.log('Canceling booking: ', showDeleteAlert[1]);
    if (!showDeleteAlert[1].startsWith('bo')) {
      await cancelBooking(showDeleteAlert[1]);
    }
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === showDeleteAlert[1]
          ? { ...booking, status: 'canceled' }
          : booking
      )
    );
    setShowDeleteAlert([false, '']);
  };

  console.log(bookings);

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
          {bookings.map(
            ({
              id,
              coworkingId,
              date,
              status,
              timeSlot: { startTime, endTime },
            }) => (
              <IonItem
                key={id}
                className='ion-item-booking ion-item-label'
                style={{ display: 'flex' }}
                lines='full'
              >
                <IonIcon
                  slot='start'
                  size='large'
                  color='secondary'
                  icon={businessOutline}
                  onClick={() => handleMoveToCoworkingPage(coworkingId)}
                />
                <p
                  style={{
                    // marginLeft: '14px',
                    marginRight: '7px',
                    // textDecoration: 'solid underline 2px',
                    // width: '50vw',
                    // wordWrap: 'break-word',
                  }}
                >
                  {`${date}`}
                  &emsp;
                  {`${startTime.hour}:${startTime.hour} - ${endTime.hour}:${endTime.minute}`}
                </p>
                {status === 'active' ? (
                  <IonIcon
                    slot='end'
                    size='large'
                    color='danger'
                    icon={ellipsisHorizontalCircleOutline}
                    onClick={() => setShowDeleteAlert([true, id])}
                  />
                ) : status === 'canceled' ? (
                  <IonIcon
                    slot='end'
                    size='large'
                    color='medium'
                    icon={closeCircleOutline}
                  />
                ) : status === 'completed' ? (
                  <IonIcon
                    slot='end'
                    size='large'
                    color='success'
                    icon={checkmarkDoneCircleOutline}
                  />
                ) : null}
              </IonItem>
            )
          )}
        </IonList>
        <IonAlert
          isOpen={showDeleteAlert[0]}
          onDidDismiss={() => setShowDeleteAlert([false, ''])}
          header={'Confirm Cancel'}
          message={'cancel this booking?'}
          className='custom-alert'
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => setShowDeleteAlert([false, '']),
            },
            {
              text: 'Yes',
              role: 'destructive',
              handler: handleConfirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Bookings;
