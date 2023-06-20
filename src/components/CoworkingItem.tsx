import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonImg,
  IonLabel,
  IonButton,
  IonRow,
  IonCol,
  IonItem,
  IonCardSubtitle,
  IonIcon,
  IonPopover,
  IonContent,
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { CoworkingItemType } from '../types';

import 'swiper/css';
import 'swiper/css/pagination';
import './CoworkingItem.css'; // добавлен файл со стилями

import {
  arrowForwardCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
interface CoworkingItemProps {
  coworking: CoworkingItemType;
  // onButtonBookClick: (coworking: CoworkingItemType) => void;
}

const CoworkingItem: React.FC<CoworkingItemProps> = ({
  coworking: { id, name, location, description, imageUrls, skillAnalysisTopic },
  // onButtonBookClick
}) => {
  return (
    <IonCard className='coworking-card'>
      <IonCardHeader>
        <IonRow>
          <IonCol size='6'>
            <Swiper
              modules={[Pagination]}
              pagination={true}
              className='image-swiper'
            >
              {imageUrls.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                  <IonImg className='coworking-image' src={imageUrl} />
                </SwiperSlide>
              ))}
            </Swiper>
          </IonCol>
          <IonCol size='6' className='coworking-info'>
            <IonCardTitle className='coworking-title'>{name}</IonCardTitle>
            <IonCardSubtitle>{location}</IonCardSubtitle>
            {skillAnalysisTopic && (
              <>
                <IonBadge className='badge-networking' color='primary'>
                  <small>Networking potential</small>
                  {/* <IonIcon icon={informationCircleOutline} size='small' />
                  <IonLabel>{`Match by ${skillAnalysisTopic.toUpperCase()}`}</IonLabel> */}
                </IonBadge>
                <IonIcon icon={informationCircleOutline} id='right-end' />
                <IonPopover trigger='right-end' side='right' alignment='end'>
                  <IonContent class='ion-padding'>
                    {skillAnalysisTopic}
                  </IonContent>
                </IonPopover>
              </>
            )}
            <IonButton
              // onClick={e => onButtonBookClick(
              //   {
              //     id,
              //     name,
              //     location,
              //     imageUrls,
              //     description,
              //     networking
              //   })}
              routerLink={`/Coworkings/${id}`}
              className='book-button'
              size='small'
            >
              <IonLabel>Book</IonLabel> &nbsp;
              <IonIcon icon={arrowForwardCircleOutline} size='small' />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardHeader>
    </IonCard>
  );
};

export default CoworkingItem;
