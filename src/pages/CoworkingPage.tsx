
import React, { useState, useEffect } from 'react';
import { DocumentData } from 'firebase/firestore';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonLabel,
  IonTextarea,
  IonItem,
  IonText,
  IonLoading,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardHeader,
  IonAlert,
  IonImg
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/swiper.css';
import 'swiper/css/pagination';

import { WorkingPlace, CoworkingItemType, TimeSlot } from '../types';
import { mockWorkingPlaces } from './WorkingPlaces';
import { getCoworkingInfoById, getWorkingPlaces, createBooking } from '../firebase/functions';

export const mockedAvailableDatesAndTimeSlots = [{ date: '2023-06-01', timeSlots: [{ startTime: { hour: '15', minute: '00' }, endTime: { hour: '17', minute: '15' } }, { startTime: { hour: '17', minute: '30' }, endTime: { hour: '18', minute: '45' } }] }];

interface CoworkingPageProps extends RouteComponentProps<{ id: string; }> {
  user: DocumentData;
}

const CoworkingPage: React.FC<CoworkingPageProps> = ({ user, match, location, history }) => {
  // const { name, location: coworkingLocation, description, imageUrls, networking } = location.state as CoworkingItemType;
  // console.log({ name, location: coworkingLocation, description, imageUrls, networking });

  const [coworking, setCoworking] = useState<CoworkingItemType | null>(null);
  const [workingPlaces, setWorkingPlaces] = useState<WorkingPlace[] | []>([]);
  const [bookingPlaceId, setBookingPlaceId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>();

  console.log(selectedTimeSlot);
  console.log(match.params.id);

  useEffect(() => {
    const fetchCoworkingInfo = async () => {
      const coworkingData = await getCoworkingInfoById(match.params.id);
      setCoworking(coworkingData);
    }

    fetchCoworkingInfo();

    const fetchWorkingPlaces = async () => {
      const workingPlacesData = await getWorkingPlaces(match.params.id);
      if (workingPlacesData.length) {
        const filteredWPAvailableDates = workingPlacesData.filter((workingPlace) => Boolean(Object.keys(workingPlace.availableDates || {}).length));
        setWorkingPlaces(filteredWPAvailableDates);
        setSelectedDate(Object.keys(filteredWPAvailableDates[0].availableDates)[0])
      } else {
        setWorkingPlaces(mockWorkingPlaces);
        setSelectedDate(Object.keys(mockWorkingPlaces[0].availableDates)[0])
      }
    };

    fetchWorkingPlaces();
  }, [match.params.id]);

  const handleBookClick = (place: string) => {
    setBookingPlaceId(place);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    console.log(user.id, bookingPlaceId, coworking!.id, selectedDate, selectedTimeSlot);
    if (!bookingPlaceId!.startsWith('wp')) {
      createBooking({ userId: user.id, workingPlaceId: bookingPlaceId!, coworkingId: coworking!.id, timeSlot: selectedTimeSlot! }, [selectedDate])
    }
    setWorkingPlaces(prevWPs => prevWPs.map(wp => {
      if (wp.id !== bookingPlaceId) {
        return wp;
      } else {
        return {
          ...wp,
          availableDates: {
            ...wp.availableDates,
            [selectedDate]: wp.availableDates[selectedDate].filter(({ startTime, endTime }) => startTime.hour !== selectedTimeSlot!.startTime.hour && endTime.hour !== selectedTimeSlot!.endTime.hour)
          }
        }
      }
    }))
    setSelectedTimeSlot(null);
  };


  const handleDateChange = (e: any) => {
    e.preventDefault()
    setSelectedDate(e.detail.value);
    console.log(e.detail.value);
    e.detail.value !== selectedDate && setSelectedTimeSlot(null);
  };

  const handleTimeSlotChange = (e: any) => {
    console.log(e.detail.value)
    setSelectedTimeSlot(e.detail.value);
  };

  const availableDatesAndTimeSlots = workingPlaces.length
    ? (workingPlaces as WorkingPlace[]).reduce((acc, place) => {
      if (place.availableDates) {
        const datesAndTimeSlots = Object.entries(place.availableDates).map(([date, timeSlots]) => ({
          date,
          timeSlots,
        }));
        return [...acc, ...datesAndTimeSlots];
      }
      return acc;
    }, [] as { date: string; timeSlots: TimeSlot[] }[])
    : mockedAvailableDatesAndTimeSlots;
  console.log(availableDatesAndTimeSlots);
  // const availableDatesAndTimeSlots = workingPlaces.length ? workingPlaces.reduce((acc, place) => {
  //   if (place.availableDates) {
  //     return [...acc, ...place.availableDates];
  //   }
  //   return acc;
  // }, []) : [{ date: '2023-06-01', timeSlots: [{ startTime: { hour: '15', minutes: '00' }, endTime: { hour: '17', minutes: '15' } }, { startTime: { hour: '17', minutes: '30' }, endTime: { hour: '18', minutes: '45' } }] }];

  const availableYears = Array.from(
    new Set(availableDatesAndTimeSlots.map(item => new Date(item.date).getFullYear()))
  );
  console.log(availableYears);


  const availableMonths = Array.from(
    new Set(availableDatesAndTimeSlots
      .filter(item => new Date(item.date).getFullYear() === new Date(selectedDate).getFullYear())
      .map(item => new Date(item.date).getMonth() + 1))
  );
  console.log(availableMonths)

  const availableDays = Array.from(
    new Set(availableDatesAndTimeSlots
      .filter(item => new Date(item.date).getFullYear() === new Date(selectedDate).getFullYear() &&
        new Date(item.date).getMonth() === new Date(selectedDate).getMonth())
      .map(item => new Date(item.date).getDate()))
  );
  console.log(availableDays)

  const availableTimeSlots = selectedDate
    ? availableDatesAndTimeSlots
      .find(slot => slot.date === selectedDate)?.timeSlots || []
    : [];
  console.log(availableTimeSlots)

  const availablePlaces = selectedTimeSlot
    ? workingPlaces.length ?
      workingPlaces.filter(
        place => Object.keys(place.availableDates).includes(selectedDate)
          && place.availableDates[selectedDate].some(
            ({ startTime, endTime }) => startTime.hour === selectedTimeSlot.startTime.hour
              && endTime.hour === selectedTimeSlot.endTime.hour
          )
      )
      : mockWorkingPlaces
    : [];

  const compareWith = (o1: TimeSlot, o2: TimeSlot) => {
    return o1 && o2
      ? o1.startTime.hour === o2.startTime.hour && o1.endTime.hour === o2.endTime.hour
      : o1 === o2;
  };

  if (!coworking) return <IonLoading message={'Loading...'} />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton text='Previous' defaultHref='/Coworkings' />
          </IonButtons>
          <IonTitle>Book Place</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonText>{coworking.name}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonText>{coworking.location}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Description</IonLabel>
                <IonTextarea
                  value={coworking.description}
                  readonly={true}
                ></IonTextarea>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  border: '1px solid #000',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  margin: 'auto',
                }}
              >
                <Swiper
                  modules={[Pagination]}
                  pagination={true}
                >
                  {coworking.imageUrls
                    .filter((url) => url)
                    .map((url, index) => (
                      <SwiperSlide key={index}>
                        <IonImg
                          src={url}
                          alt={`Slide ${index}`}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            </IonCol>
          </IonRow>

          <IonItem lines='none'>
            <IonLabel>Date:</IonLabel>
            <IonDatetime
              presentation='date'
              value={selectedDate}
              onIonChange={handleDateChange}
              yearValues={availableYears}
              monthValues={availableMonths}
              dayValues={availableDays}
              min={new Date().toISOString().split('T')[0]}
            ></IonDatetime>
          </IonItem>

          {selectedDate && (
            <IonItem lines='none'>
              {/* <IonLabel>Time Slot:</IonLabel> */}
              <IonSelect
                aria-label='time-slot'
                placeholder='select time-slot'
                compareWith={compareWith}
                onIonChange={handleTimeSlotChange}
                value={selectedTimeSlot}
                style={{ margin: 'auto', border: '1px solid #000', borderRadius: '5px', padding: '10px', width: 'fit-content' }}
              >
                {availableTimeSlots.map(({ startTime, endTime }, index) => (
                  <IonSelectOption key={index} value={{ startTime, endTime }}>
                    {startTime.hour}:{startTime.minute} - {endTime.hour}:{endTime.minute}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          )}

          {selectedTimeSlot && (
            <IonGrid>
              <IonRow>
                {availablePlaces.map((place, index) => (
                  <IonCol size='6' key={index}>
                    <IonCard style={{ height: '150px', maxHeight: '150px' }}>
                      <IonCardHeader>
                        <IonCardSubtitle>{place.position}</IonCardSubtitle>
                      </IonCardHeader>

                      <IonCardContent>
                        Seats: {place.seats} <br />
                        <small style={{ fontSize: '1.2' }}>Price per hour: {place.pricePerHour}</small>
                        <IonButton
                          size='small'
                          expand='full'
                          onClick={() => handleBookClick(place.id)}
                          style={{ marginTop: '20px' }}
                        >
                          Book
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          )}

          <IonAlert
            isOpen={showConfirm}
            trigger='book-alert'
            // header={'Confirm'}
            message={'Confirm your booking'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  setShowConfirm(false);
                }
              },
              {
                text: 'Confirm',
                role: 'confirm',
                handler: handleConfirm
              }
            ]}
          />

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CoworkingPage;
