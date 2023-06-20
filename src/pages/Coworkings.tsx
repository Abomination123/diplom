import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { RouteComponentProps, useParams } from 'react-router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  useIonModal,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonList,
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import { optionsOutline, analyticsOutline } from 'ionicons/icons';
import CoworkingItem from '../components/CoworkingItem';
import AlgoSettings from '../components/AlgoSettings';

import {
  CoworkingItemType,
  DocumentDataInterface,
  newSettings,
  RangeValue,
} from '../types';
import { fetchCoworkings, updateUserDetails } from '../firebase/functions';
import { DocumentData } from 'firebase/firestore';

import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { geocode } from '../utils/utils';

interface CoworkingsPageProps extends RouteComponentProps {
  user: DocumentData;
}
const Coworkings: React.FC<CoworkingsPageProps> = ({ user, history }) => {
  const [data, setData] = useState<CoworkingItemType[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>(user.userSkills);
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [location, setLocation] = useState(user.location);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 15;

  const getLocation = async (modalIcon?: boolean) => {
    try {
      // Check the current permission status
      const status = await Geolocation.checkPermissions();

      // If permissions are not granted, request them
      if (status.location !== 'granted') {
        const newStatus = await Geolocation.requestPermissions();
        if (newStatus.location !== 'granted') {
          console.log('Location permission was not granted.');
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition();
      const locationFromGeocode = await geocode(
        position.coords.latitude,
        position.coords.longitude
      );
      if (!modalIcon) {
        setLocation(locationFromGeocode);
      }
      console.log(locationFromGeocode);
      return locationFromGeocode;
    } catch (err) {
      console.error('Error getting location', err);
    }
  };

  useEffect(() => {
    if (!user.location) {
      getLocation();
    }
  }, []);

  const [present, dismiss] = useIonModal(AlgoSettings, {
    location: location,
    skills: userSkills,
    price: price,
    getLocation: getLocation,
    onDismiss: (
      data:
        | { location: string; price: number | null; skills: string[] }
        | null
        | undefined,
      role: string
    ) => dismiss(data, role),
  });

  const openModal = () => {
    present({
      onWillDismiss: async (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm' && ev.detail.data) {
          const newSkills = ev.detail.data.skills;
          const newLocation = ev.detail.data.location;
          const newPrice = ev.detail.data.price;

          let needUpdate = false;

          if (newSkills !== userSkills) {
            setUserSkills(newSkills);
            needUpdate = true;
          }

          if (newLocation !== location) {
            setLocation(newLocation);
            needUpdate = true;
          }

          if (newPrice !== price) {
            setPrice(newPrice);
            needUpdate = true;
          }

          // setUserSkills(ev.detail.data.skills);
          // updateUserSkills(user.id, ev.detail.data.skills);
          if (needUpdate) {
            await fetchCoworkingsBatch(
              { location: newLocation, skills: newSkills, price: newPrice },
              true
            );

            await updateUserDetails(user.id, newSkills, newLocation);
          }
        }
      },
    });
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchCoworkingsBatch({ location, skills: userSkills, price }, true);
    }
    // const unsubscribe = fetchCoworkings(setData);

    // return () => {
    //   unsubscribe();
    // };
  }, []);

  const fetchCoworkingsBatch = async (data: any, reload?: boolean) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `https://getcoworkings-apuh4o6p2a-uc.a.run.app?userId=${user.id}${
          data && data.location ? `&location=${data.location}` : ''
        }${data && data.skills ? `&newSkills=${data.skills.join(',')}` : ''}${
          data && data.price ? `&price=${data.price}` : ''
        }` //&page=${page}
      );
      const { coworkings } = await res.json();
      if (reload) {
        setData(coworkings);
        setPage(1);
      } else if (data?.page > 1) {
        setData((prevData) => [...prevData, ...coworkings]);
        setPage(data.page);
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleEnd = async (ev: InfiniteScrollCustomEvent) => {
    if (data.length < 45) {
      // await fetchCoworkingsBatch(
      //   { location, skills: userSkills, price },
      //   false
      // );
      // setPage((prevPage) => prevPage + 1);
    }

    ev.target.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{}</IonTitle>
          <IonIcon
            slot='end'
            icon={analyticsOutline}
            size='large'
            style={{ marginRight: '10px' }}
            onClick={() => openModal()}
          />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading
          isOpen={isLoading}
          onDidDismiss={() => setIsLoading(false)}
          message={'Please, wait...'}
          // duration={5000}
        />
        <IonList>
          {data.map((coworking, index) => (
            <CoworkingItem
              key={coworking.id}
              coworking={coworking}
              // onButtonBookClick={handleButtonBookClick}
            />
          ))}
        </IonList>
        <IonInfiniteScroll threshold='5%' onIonInfinite={handleEnd}>
          <IonInfiniteScrollContent
            loadingSpinner='bubbles'
            loadingText='Loading more data...'
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Coworkings;
