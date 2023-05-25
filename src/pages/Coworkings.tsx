import React, { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useParams } from 'react-router';
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
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core/components';
import { optionsOutline, analyticsOutline } from 'ionicons/icons';
import CoworkingItem from '../components/CoworkingItem';
import AlgoSettings from '../components/AlgoSettings';
import { newSettings, RangeValue } from '../components/AlgoSettings';
import './Coworkings.css';
import {
  collection,
  db,
  onSnapshot,
  orderBy,
  query,
  where,
} from '../firebase/config';

import { CoworkingItemType } from '../components/CoworkingItem';

// interface CoworkingData {
//   id: string;
//   name: string;
//   location: string;
//   imageUrls: string[];
//   networking: boolean;
// }

const Coworkings: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<CoworkingItemType[]>([]);
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ lower: 20, upper: 80 });
  const [isLoading, setIsLoading] = useState(false);

  const [present, dismiss] = useIonModal(AlgoSettings, {
    location: 'Kyiv, Pechersk',
    skills: ['Ionic', 'Firebase'],
    priceRange: priceRange,
    onDismiss: (
      data:
        | { location: string; priceRange: RangeValue; skills: string[] }
        | null
        | undefined,
      role: string
    ) => dismiss(data, role),
  });

  const coworkingsRef = collection(db, 'coworkings');
  useEffect(() => {
    // setIsLoading(true);
    const q = query(
      coworkingsRef,
      // where('authorID', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newCoworkings: any = [];
        querySnapshot.forEach((doc) => {
          const coworking = doc.data();
          coworking.id = doc.id;
          newCoworkings.push(coworking);
        });
        setData(newCoworkings);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(`https://your-api.com/coworkings?page=${page}&limit=20`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setData((prevData) => [...prevData, ...data]);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Ошибка:', error);
  //       setIsLoading(false);
  //     });
  // }, [page]);

  const handleEndReached = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleItemClick = (id: string) => {
    console.log(`Переход на страницу бронирования для коворкинга ${id}`);
    // Здесь добавьте логику для перехода на страницу бронирования
  };

  const openModal = () => {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === 'confirm') {
          onAlgorithmRestart(ev.detail.data);
        }
      },
    });
  };

  const onAlgorithmRestart = ({
    location,
    skills,
    priceRange,
  }: newSettings) => {
    console.log(`algo restart ${location} ${skills} ${priceRange.upper}`);
    // algo restart
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
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
        <Virtuoso
          data={data}
          itemContent={(index, item) => (
            <CoworkingItem
              id={item.id}
              name={item.name}
              location={item.location}
              imageUrls={item.imageUrls}
              networking={index == 1}
              handleClick={() => handleItemClick(item.id)}
            />
          )}
          endReached={handleEndReached}
        />
        <IonLoading isOpen={isLoading} message={'Loading...'} />
      </IonContent>
    </IonPage>
  );
};

export default Coworkings;
