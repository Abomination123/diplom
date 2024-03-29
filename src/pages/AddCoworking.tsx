/* eslint-disable */
//@ts-nocheck
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAlert,
  IonTextarea,
} from '@ionic/react';
import React, { useState, useEffect, useRef } from 'react';
import { businessOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  addDoc,
  collection,
  db,
  doc,
  serverTimestamp,
  setDoc,
} from '../firebase/config';
import { CustomizedState } from '../types';
import { DocumentData } from 'firebase/firestore';

// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from 'react-places-autocomplete';

interface BookingsPageProps extends RouteComponentProps {
  user: DocumentData;
}
const AddCoworking: React.FC<BookingsPageProps> = ({ user, history }) => {
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>(['', '', '']);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleImageUrl = (url: string, index: number) => {
    setImageUrls((prevUrls) => {
      const newUrls = [...prevUrls];
      newUrls[index] = url;
      return newUrls;
    });
  };

  const locationInputRef = useRef(null);

  // const handleSelect = async (value: any) => {
  //   const results = await geocodeByAddress(value);
  //   const latLng = await getLatLng(results[0]);
  //   setLocation(value);
  // };

  useEffect(() => {
    if (window.google) {
      new window.google.maps.places.Autocomplete(locationInputRef.current);
    }
  }, []);

  const handleSubmit = async () => {
    if (!name) {
      // setMessage('Please enter the name of your coworking');
      // setIserror(true);
      // return;
    }

    if (!location) {
      // setMessage('Please enter location');
      // setIserror(true);
      // return;
    }

    // if (description.length < 30) {
    //   setMessage('Description must be at least 30 characters');
    //   setIserror(true);
    //   return;
    // }

    // if (imageUrls.filter((url) => url).length === 0) {
    //   setMessage('Please provide at least one image URL');
    //   setIserror(true);
    //   return;
    // }

    // try {
    // const coworkingRef = collection(db, 'coworkings');
    // const timestamp = serverTimestamp();
    //   const coworkings = [
    //     {
    //       id: 1,
    //       name: 'Kyiv Hive',
    //       location: 'Kyiv, Ukraine',
    //       description: 'Bright space with an energetic atmosphere.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 2,
    //       name: 'Lviv Hub',
    //       location: 'Lviv, Ukraine',
    //       description: 'Quiet place for focused work.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 3,
    //       name: 'Dnipro Den',
    //       location: 'Dnipro, Ukraine',
    //       description: 'Dynamic environment with a beautiful view.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 4,
    //       name: 'Odessa Oasis',
    //       location: 'Odessa, Ukraine',
    //       description: 'Comfortable setting with a great community.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 5,
    //       name: 'Kharkiv Hub',
    //       location: 'Kharkiv, Ukraine',
    //       description: 'Modern space for entrepreneurs and creatives.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 6,
    //       name: 'Zaporizhzhia Zone',
    //       location: 'Zaporizhzhia, Ukraine',
    //       description: 'Inspiring location for remote work.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 7,
    //       name: 'Mykolaiv Mingle',
    //       location: 'Mykolaiv, Ukraine',
    //       description: 'Friendly space to network and collaborate.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 8,
    //       name: 'Vinnytsia Venture',
    //       location: 'Vinnytsia, Ukraine',
    //       description: 'Cozy environment with all necessary amenities.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 9,
    //       name: 'Lutsk Loft',
    //       location: 'Lutsk, Ukraine',
    //       description: 'Spacious area with a relaxed vibe.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 10,
    //       name: 'Poltava Place',
    //       location: 'Poltava, Ukraine',
    //       description: 'Ideal spot for meetups and events.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 11,
    //       name: 'Chernihiv Chill',
    //       location: 'Chernihiv, Ukraine',
    //       description: 'Great place for freelancers and startups.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 12,
    //       name: 'Cherkasy Chat',
    //       location: 'Cherkasy, Ukraine',
    //       description: 'Collaborative area with flexible desk options.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 13,
    //       name: 'Kropyvnytskyi Coop',
    //       location: 'Kropyvnytskyi, Ukraine',
    //       description: 'Perfect space for workshops and brainstorming.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 14,
    //       name: 'Sumy Spot',
    //       location: 'Sumy, Ukraine',
    //       description: 'Creative space with a lot of natural light.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //     {
    //       id: 15,
    //       name: 'Chernivtsi Corner',
    //       location: 'Chernivtsi, Ukraine',
    //       description: 'Peaceful place to get things done.',
    //       imageUrls: ['https://picsum.photos/200'],
    //     },
    //   ];

    //   coworkings.map(async (coworking) => {
    //     const data = {
    //       name: coworking.name,
    //       location: coworking.location,
    //       description: coworking.description,
    //       imageUrls: coworking.imageUrls.concat(coworking.imageUrls),
    //       authorID: (window.history as any).state.state.user.id,
    //       createdAt: timestamp,
    //     };
    //     await addDoc(coworkingRef, data);
    //   });
    try {
      const coworkingRef = collection(db, 'coworkings');
      const timestamp = serverTimestamp();
      const data = {
        name,
        location,
        description,
        imageUrls,
        authorID: user.id,
        createdAt: timestamp,
      };
      // if (!id) {
      await addDoc(coworkingRef, data);
      // } else {
      // await setDoc(doc(coworkingRef, id), data);
      // }
      history.push('/WorkingPlaces', { coworkingId: coworkingRef.id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Coworking</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className='ion-padding ion-text-center'>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass='my-custom-class'
                header={'Error!'}
                message={message}
                buttons={['Dismiss']}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonIcon
                style={{ fontSize: '70px', color: '#0040ff' }}
                icon={businessOutline}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Name</IonLabel>
                <IonInput
                  type='text'
                  value={name}
                  onIonInput={(e) => setName(e.detail.value!)}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Location</IonLabel>
                {/* <PlacesAutocomplete
                  value={location}
                  onChange={setLocation}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }: {
                    getInputProps: any;
                    suggestions: any;
                    getSuggestionItemProps: any;
                    loading: any;
                  }) => (
                    <div> */}
                <IonInput
                  type='text'
                  value={location}
                  // ref={locationInputRef}
                  onIonInput={(e) => setLocation(e.detail.value!)}
                />
                {/* <div className='autocomplete-dropdown-container'>
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion: any) => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete> */}
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position='floating'>Description</IonLabel>
                <IonTextarea
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value!)}
                ></IonTextarea>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol
              style={{
                border: '1px solid #000',
                borderRadius: '5px',
                padding: '10px',
                margin: '10px',
              }}
            >
              {imageUrls.map((url, index) => (
                <IonItem key={index}>
                  <IonLabel position='floating'>Image URL {index + 1}</IonLabel>
                  <IonInput
                    type='url'
                    value={url}
                    onIonInput={(e) =>
                      handleImageUrl(e.detail.value || '', index)
                    }
                  ></IonInput>
                </IonItem>
              ))}
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
                  pagination={{ clickable: true }}
                  slidesPerView={1}
                  spaceBetween={10}
                >
                  {imageUrls
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

          <IonRow>
            <IonCol>
              <IonButton size='small' expand='block' onClick={handleSubmit}>
                Submit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddCoworking;
