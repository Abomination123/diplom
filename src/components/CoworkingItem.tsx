import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonImg,
  IonLabel,
  IonIcon,
  IonItem,
  IonButton,
} from '@ionic/react';
// import { chevronForward, chevronBack } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/pagination';

interface CoworkingItemProps {
  id: string;
  name: string;
  location: string;
  imageUrls: string[];
  networking: boolean;
  handleClick: () => void;
}

export type CoworkingItemType = {
  id: string;
  name: string;
  location: string;
  imageUrls: string[];
  description?: string;
  networking?: boolean;
};

const CoworkingItem: React.FC<CoworkingItemProps> = ({
  id,
  name,
  location,
  imageUrls,
  networking,
  handleClick,
}) => {
  // const [activeSlide, setActiveSlide] = useState(0);

  // const handleNext = () => {
  //   if (activeSlide < imageUrls.length - 1) {
  //     setActiveSlide(activeSlide + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (activeSlide > 0) {
  //     setActiveSlide(activeSlide - 1);
  //   }
  // };

  return (
    <IonCard key={id} onClick={handleClick}>
      <IonCardHeader>
        <IonCardTitle>{name}</IonCardTitle>
        <IonLabel>{location}</IonLabel>
        <IonButton routerLink={`Coworkings/${id}`} size='small'>
          <IonLabel>Book</IonLabel>
        </IonButton>
      </IonCardHeader>
      <IonCardContent>
        <Swiper modules={[Pagination]} pagination={true}>
          {imageUrls.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <IonImg src={imageUrl} />
            </SwiperSlide>
          ))}
        </Swiper>

        <IonItem slot='end'>
          {networking && (
            <IonBadge slot='end' color='primary'>
              Networking potential
            </IonBadge>
          )}
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default CoworkingItem;
