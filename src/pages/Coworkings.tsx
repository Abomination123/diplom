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
import { fetchCoworkings, updateUserSkills } from '../firebase/functions';
import { DocumentData } from 'firebase/firestore';

import { Geolocation } from '@capacitor/geolocation';
import { geocode } from '../utils/utils';

interface CoworkingsPageProps extends RouteComponentProps {
  user: DocumentData;
}
const Coworkings: React.FC<CoworkingsPageProps> = ({ user, history }) => {
  const [data, setData] = useState<CoworkingItemType[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>(user.userSkills);
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ lower: 20, upper: 80 });
  const [location, setLocation] = useState(user.location);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 15;

  const [present, dismiss] = useIonModal(AlgoSettings, {
    location: location,
    skills: userSkills,
    priceRange: priceRange,
    onDismiss: (
      data:
        | { location: string; priceRange: RangeValue; skills: string[] }
        | null
        | undefined,
      role: string
    ) => dismiss(data, role),
  });

  const openModal = () => {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          setUserSkills(ev.detail.data.skills);
          updateUserSkills(user.id, ev.detail.data.skills);
          if (!ev.detail.data) {
            fetchCoworkingsBatch(ev.detail.data);
          }
        }
      },
    });
  };

  useEffect(() => {
    const getLocation = async () => {
      if (!user.location) {
        try {
          const position = await Geolocation.getCurrentPosition();
          // Use position.coords.latitude and position.coords.longitude to get the location details
          // This is where you might want to make a call to a geocoding API (like Google's or another) to transform
          // the latitude and longitude into a human readable location
          // Assuming you have a geocoding function, it could look something like this:
          const locationFromGeocode = await geocode(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation(locationFromGeocode);
          console.log(locationFromGeocode);
        } catch (err) {
          console.error('Error getting location', err);
        }
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const unsubscribe = fetchCoworkings(setData);

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchCoworkingsBatch = async (data: any) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `api/algo-restart/${location}/${userSkills[0]}/${priceRange.upper}/${page}`
      );
      const { coworkings } = await res.json();
      setData((prevData) => [...prevData, ...coworkings]);
      setPage(page + 1);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleEnd = async (ev: InfiniteScrollCustomEvent) => {
    if (data.length < 45) {
      await fetchCoworkingsBatch(userSkills);
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
        <IonList>
          {data.map((coworking, index) => (
            <CoworkingItem
              key={coworking.id}
              coworking={coworking}
              networking={index === 1}
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
