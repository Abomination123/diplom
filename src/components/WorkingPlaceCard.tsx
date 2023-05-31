import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  IonCard,
  IonButton,
  IonIcon,
  IonItem,
  IonCheckbox,
  IonInput,
  IonAlert,
  IonList,
  IonRow,
  IonCol,
} from '@ionic/react';
import {
  checkmarkOutline,
  listOutline,
  personCircleOutline,
  removeCircleOutline,
  trashOutline,
  closeCircleOutline,
  sadOutline,
  checkmarkDoneCircleOutline
} from 'ionicons/icons';
import './WorkingPlaceCard.css';
import { cancelBooking, getBookingsByWorkingPlace, getUserInfo } from '../firebase/functions';
import { Booking, User, WorkingPlace, WithRequired, TimeSlot } from '../types';

export const bookingsMock: Booking[] = [
  {
    id: 'bo1',
    userId: 'u1',
    workingPlaceId: 'wp1',
    coworkingId: 'co1',
    status: 'active',
    date: '2023-06-01',
    timeSlot: {
      startTime: { hour: '09', minute: '00' },
      endTime: { hour: '17', minute: '00' },
    },
  },
  {
    id: 'bo2',
    userId: 'u2',
    workingPlaceId: 'wp2',
    coworkingId: 'co2',
    status: 'active',
    date: '2023-06-02',
    timeSlot: {
      startTime: { hour: '10', minute: '30' },
      endTime: { hour: '15', minute: '30' },
    },
  },
  {
    id: 'bo3',
    userId: 'u3',
    workingPlaceId: 'wp3',
    coworkingId: 'co3',
    status: 'completed',
    date: '2023-06-03',
    timeSlot: {
      startTime: { hour: '08', minute: '00' },
      endTime: { hour: '14', minute: '00' },
    },
  },
];


const WorkingPlaceCard: React.FC<{
  place: WorkingPlace;
  handleSaveWorkingPlace: (workingPlace: Omit<WorkingPlace, 'id'>) => void;
  handleDeleteWorkingPlace: (workingPlaceId: string) => void;
  isEditing: boolean;
  checked: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean | string>>;
  onSelectionChange: (placeId: string, isSelected: boolean) => void;
}> = ({
  place,
  handleSaveWorkingPlace,
  handleDeleteWorkingPlace,
  isEditing = false,
  checked,
  setIsEditing,
  onSelectionChange,
}) => {
    const [viewBookings, setViewBookings] = useState(false);
    const [isSelected, setIsSelected] = useState(checked);
    const [seats, setSeats] = useState(place.seats);
    const [position, setPosition] = useState(place.position);
    const [pricePerHour, setPricePerHour] = useState(place.pricePerHour);
    const [availableDates, setAvailableDates] = useState<{ [date: string]: TimeSlot[]; }>(place.availableDates);
    const [bookings, setBookings] = useState<Booking[]>(bookingsMock);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const [bookingUser, setBookingUser] = useState<Omit<WithRequired<User, 'userSkills'>, 'id'> | null>(null);

    useEffect(() => {
      const fetchBookings = async () => {
        if (viewBookings) {
          const data = await getBookingsByWorkingPlace(place.id);
          if (data.length) {
            setBookings(data);
          } else {
            setBookings(bookingsMock);
          }
        }
      };

      fetchBookings();
    }, [place.id, place.availableDates, viewBookings]);

    const handleDelete = async () => {
      if (!isEditing) {
        setShowDeleteAlert(true);
      } else {
        handleDeleteWorkingPlace(place.id);
      }
    };

    const handleConfirmDelete = async () => {
      handleDeleteWorkingPlace(place.id);
      console.log(`Deleting working place: ${place.id}`);
      setShowDeleteAlert(false);
    };

    const handleCancelBooking = async (bookingId: string) => {
      console.log('Canceling booking: ', bookingId);
      if (!bookingId.startsWith('bo')) {
        await cancelBooking(bookingId);
        setAvailableDates(prevAvailableDates => {
          const date = bookings.find(booking => booking.id === bookingId)?.date as string;
          const timeSlot = bookings.find(booking => booking.id === bookingId)?.timeSlot as TimeSlot;
          if (prevAvailableDates[date as string]) {
            prevAvailableDates[date].push(timeSlot);
          } else {
            prevAvailableDates[date] = [timeSlot];
          }
          return prevAvailableDates;
        });
      }
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: 'canceled' } : booking
        )
      );
    };

    const handleConfirmSave = async () => {
      await handleSaveWorkingPlace({
        seats,
        position,
        pricePerHour,
        availableDates: {}
      });
      setIsEditing(false);
    };

    const handleCheckboxChange = (e: any) => {
      const isChecked = e.target.checked;
      setIsSelected(isChecked);
      onSelectionChange(place.id, isChecked);
    };

    const handleUserIconClick = async (userId: string) => {
      let userInfo = null;
      try {
        userInfo = await getUserInfo(userId);
      } catch (error) {
        console.log(`Failed to get user info: ${error}`);
        userInfo = { email: 'admin@gmail.com', userSkills: ['db', 'infra', 'ai/ml'] };
      }

      setBookingUser(userInfo);
      setShowUserInfo(true);
    }

    return (
      <IonCard className={`working-place-card`}>
        <div className='button-bar'>
          {!isEditing && <><IonButton
            fill='clear'
            size='small'
            onClick={() => setViewBookings(!viewBookings)}
          >
            <IonIcon icon={listOutline} />
          </IonButton>
            <IonCheckbox
              onIonChange={handleCheckboxChange}
              checked={isSelected}
            /></>}
          <IonButton
            className={isEditing ? 'button-delete' : ''}
            fill='clear'
            size='small'
            onClick={handleDelete}
          >
            <IonIcon icon={removeCircleOutline} />
          </IonButton>
        </div>
        {viewBookings ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {
              Boolean(Object.keys(availableDates).length) &&
              <IonRow style={{ maxHeight: '70px', overflow: 'auto', border: '1px solid black', padding: '0px', marginBottom: '2px' }}>
                {Object.entries(availableDates).map(([date, timeSlots]) => (
                  <IonCol size='6' key={date}>
                    <div className='ion-item-labell'>{date}</div>
                    {timeSlots.map((timeSlot, tsIndex) => (
                      <div className='ion-item-content' key={tsIndex}>{`${timeSlot.startTime.hour}:${timeSlot.startTime.minute} - ${timeSlot.endTime.hour}:${timeSlot.endTime.minute}`}</div>
                    ))}
                  </IonCol>
                ))}
              </IonRow>
            }

            <IonList style={{ maxHeight: '165px', overflow: 'auto', border: '1px solid black', padding: '0' }}>
              {bookings.map(
                (
                  { id, userId, date, status, timeSlot: { startTime, endTime } }
                ) => (
                  <IonItem key={id} className='ion-item-booking ion-item-label'>
                    <IonIcon
                      size='small'
                      color='secondary'
                      icon={personCircleOutline}
                      onClick={() => handleUserIconClick(userId)}
                    />
                    <small style={{ marginLeft: '14px', marginRight: '7px', width: '20vw' }}>{`${date} ${startTime.hour}:${startTime.hour} - ${endTime.hour}:${endTime.minute}`}</small>
                    {
                      status === 'active' ?
                        <IonIcon
                          size='small'
                          color='danger'
                          icon={trashOutline}
                          onClick={() => handleCancelBooking(id)}
                        /> : status === 'canceled' ?
                          <IonIcon
                            size='small'
                            color='medium'
                            icon={sadOutline}
                          /> : status === 'completed' ?
                            <IonIcon
                              size='small'
                              color='success'
                              icon={checkmarkDoneCircleOutline}
                            /> : null
                    }
                  </IonItem>
                ))}
            </IonList>
            <IonAlert
              isOpen={showUserInfo}
              onDidDismiss={() => setShowUserInfo(false)}
              subHeader={bookingUser ? `${bookingUser.email}` : ''}
              message={bookingUser ? `Skills: ${bookingUser.userSkills.join('\n')}` : ''}
              buttons={['OK']}
            />
          </div>

        ) : (
          <>
            {isEditing ? (
              <>
                <IonItem className='ion-item-label'>
                  <IonInput
                    className='ion-item-contentt'
                    type='number'
                    label={'Seat(s):'}
                    labelPlacement='stacked'
                    placeholder='enter number'
                    value={seats}
                    onIonChange={(e) => setSeats(Number(e.detail.value!))}
                  />
                </IonItem>
                <IonItem className='ion-item-label'>
                  <IonInput
                    className='ion-item-contentt'
                    label={'Position:'}
                    labelPlacement='stacked'
                    placeholder='enter text'
                    value={position}
                    onIonChange={(e) => setPosition(e.detail.value!)}
                  />
                </IonItem>
                <IonItem className='ion-item-label'>
                  <IonInput
                    className='ion-item-contentt'
                    type='number'
                    value={pricePerHour}
                    label={'Price per hour:'}
                    labelPlacement='stacked'
                    placeholder='enter number'
                    onIonChange={(e) => setPricePerHour(Number(e.detail.value!))}
                  />
                </IonItem>
                <IonButton className='button-confirm' size='small' onClick={handleConfirmSave}>
                  <IonIcon icon={checkmarkOutline} />
                </IonButton>
              </>
            ) : (
              <>
                <IonItem className='ion-item-label'>
                  <small>Seat(s): </small>&nbsp;
                  <span className='ion-item-content'>{place.seats}</span>
                </IonItem>
                <IonItem className='ion-item-label'>
                  <small>Position:</small>&nbsp;
                  <span className='ion-item-content'>{place.position}</span>
                </IonItem>
                <IonItem className='ion-item-label'>
                  <small>Price per hour:</small>&nbsp;
                  <span className='ion-item-content'>{place.pricePerHour}$</span>
                </IonItem>
              </>
            )}
          </>
        )}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirm Delete'}
          message={'delete this working place?'}
          className='custom-alert'
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => setShowDeleteAlert(false)
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: handleConfirmDelete
            }
          ]}
        />
      </IonCard>
    );
  };

export default WorkingPlaceCard;
