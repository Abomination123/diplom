import React, { useState } from 'react';
import {
  IonCard,
  IonButton,
  IonIcon,
  IonItem,
  IonCheckbox,
  IonInput,
} from '@ionic/react';
import {
  checkmarkOutline,
  listOutline,
  removeCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import './WorkingPlaceCard.css';

export type WorkingPlace = {
  id: string;
  seats: number;
  position: string;
  pricePerHour: number;
};

const WorkingPlaceCard: React.FC<{
  place: WorkingPlace;
  isEditing: boolean;
  checked: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectionChange: (placeId: string, isSelected: boolean) => void;
}> = ({
  place,
  isEditing = false,
  checked,
  setIsEditing,
  onSelectionChange,
}) => {
  const [viewBookings, setViewBookings] = useState(false);
  const [isSelected, setIsSelected] = useState(checked);
  const [seats, setSeats] = useState(place.seats);
  const [position, setPosition] = useState(place.position);
  const [placeId, setPlaceId] = useState(place.id);
  const [pricePerHour, setPricePerHour] = useState(place.pricePerHour);
  const bookings = ['Booking 1', 'Booking 2', 'Booking 3'];

  const handleDeleteWorkingPlace = async () => {
    console.log(`Deleting working place: ${place.id}`);
  };

  const handleDeleteBooking = (booking: any) => {
    console.log('Deleting booking: ', booking);
  };

  const handleConfirm = async () => {
    // Save data to DB
    console.log(`Saving working place: ${place.id}`);
    setIsEditing(false);
  };

  const handleCheckboxChange = (e: any) => {
    const isChecked = e.target.checked;
    setIsSelected(isChecked);
    onSelectionChange(place.id, isChecked);
  };

  return (
    <IonCard className={`working-place-card`}>
      <div className='button-bar'>
        <IonButton
          fill='clear'
          size='small'
          onClick={() => setViewBookings(!viewBookings)}
        >
          <IonIcon icon={listOutline} />
        </IonButton>
        <div>
          <IonCheckbox
            onIonChange={handleCheckboxChange}
            checked={isSelected}
          />
          <IonButton
            fill='clear'
            size='small'
            onClick={handleDeleteWorkingPlace}
          >
            <IonIcon icon={removeCircleOutline} />
          </IonButton>
        </div>
      </div>
      {viewBookings ? (
        bookings.map((booking, index) => (
          <IonItem key={index} className='ion-item-label'>
            <span>{booking}</span>
            <IonButton
              fill='clear'
              size='small'
              onClick={() => handleDeleteBooking(booking)}
            >
              <IonIcon icon={trashOutline} />
            </IonButton>
          </IonItem>
        ))
      ) : (
        <>
          {isEditing ? (
            <>
              <IonItem className='ion-item-label'>
                {/* <small>Seats: </small> */}
                <IonInput
                  className='ion-item-content'
                  type='number'
                  label={'Seats:'}
                  labelPlacement='stacked'
                  placeholder='enter number'
                  value={seats}
                  onIonChange={(e) => setSeats(Number(e.detail.value!))}
                />
              </IonItem>
              <IonItem className='ion-item-label'>
                {/* <small>Position:</small> */}
                <IonInput
                  className='ion-item-content'
                  label={'Position:'}
                  labelPlacement='stacked'
                  placeholder='enter text'
                  value={position}
                  onIonChange={(e) => setPosition(e.detail.value!)}
                />
              </IonItem>
              <IonItem className='ion-item-label'>
                {/* <small>Price per hour:</small> */}
                <IonInput
                  className='ion-item-content'
                  type='number'
                  value={pricePerHour}
                  label={'Price per hour:'}
                  labelPlacement='stacked'
                  placeholder='enter number'
                  onIonChange={(e) => setPricePerHour(Number(e.detail.value!))}
                />
              </IonItem>
              <IonButton fill='clear' size='small' onClick={handleConfirm}>
                <IonIcon icon={checkmarkOutline} />
              </IonButton>
            </>
          ) : (
            <>
              <IonItem className='ion-item-label'>
                <small>Seats: </small>&nbsp;
                <span className='ion-item-content'>{place.seats}</span>
              </IonItem>
              <IonItem className='ion-item-label'>
                <small>Position:</small> &nbsp;{' '}
                <span className='ion-item-content'>{place.position}</span>
              </IonItem>
              <IonItem className='ion-item-label'>
                <small>Price per hour:</small>{' '}
                <span className='ion-item-content'>{place.pricePerHour}$</span>
              </IonItem>
            </>
          )}
        </>
      )}
    </IonCard>
  );
};

export default WorkingPlaceCard;
