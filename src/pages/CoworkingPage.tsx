import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
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
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import WorkingPlaceCard from '../components/WorkingPlaceCard';
import { CoworkingItemType } from '../components/CoworkingItem';

const CoworkingPage: React.FC<{ match: any }> = ({ match }) => {
  // const { id } = useParams();
  const [coworking, setCoworking] = useState<CoworkingItemType | null>({
    id: match.params.id,
    name: 'Limassol',
    location: 'Kyiv, Pechersk',
    description: 'Peaceful place to get things done',
    imageUrls: ['https://picsum.photos/200', 'https://picsum.photos/200'],
    networking: false,
  });
  const [workingPlaces, setWorkingPlaces] = useState([]);

  useEffect(() => {
    const coworkingRef = doc(db, 'coworkings', match.params.id);
    getDoc(coworkingRef).then((document) => {
      const coworkingData = document.data();
      // setCoworking(coworkingData);
    });

    // Assume we have a function getAvailableWorkingPlaces that takes a coworking id and returns an array of working places
    // getAvailableWorkingPlaces(match.params.id).then(setWorkingPlaces);
  }, [match.params.id]);

  // Assume that we have a function handleDateChange that updates some state when a date is selected

  if (!coworking) return <IonLoading message={'Loading...'} />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton text='Previous' defaultHref='/Coworkings' />
          </IonButtons>
          <IonTitle>{coworking.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Name</IonLabel>
                <IonText>{coworking.name}</IonText>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Location</IonLabel>
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
                <Swiper slidesPerView={1} spaceBetween={10}>
                  {coworking.imageUrls
                    .filter((url) => url)
                    .map((url, index) => (
                      <SwiperSlide key={index}>
                        <img
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

          <IonDatetime
            // ref={datetimeRef}
            presentation='date'
            multiple={true}
            // onIonChange={handleDateChange}
          ></IonDatetime>
        </IonGrid>
        {/* <IonGrid>
          {workingPlaces.map((place, index) => (
            <IonRow key={index}>
              <IonCol>
                <WorkingPlaceCard place={place} />
              </IonCol>
            </IonRow>
          ))}
        </IonGrid> */}
      </IonContent>
    </IonPage>
  );
};

export default CoworkingPage;
