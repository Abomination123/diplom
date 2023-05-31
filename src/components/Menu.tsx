import React from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  businessOutline,
  businessSharp,
  calendarOutline,
  calendarSharp,
} from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Coworkings',
    url: '/Coworkings',
    iosIcon: businessOutline,
    mdIcon: businessSharp,
  },
  {
    title: 'Bookings',
    url: '/Bookings',
    iosIcon: calendarOutline,
    mdIcon: calendarSharp,
  },
];

const Menu: React.FC<{ email?: string, disabled: boolean }> = ({ email, disabled }) => {
  const location = useLocation();

  return (
    <IonMenu contentId='main' type='overlay' disabled={disabled}>
      <IonContent>
        <IonList id='inbox-list'>
          <IonListHeader>Coworking diplom</IonListHeader>
          <IonNote>{email}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? 'selected' : ''
                  }
                  routerLink={appPage.url}
                  routerDirection='none'
                  lines='none'
                  detail={false}
                >
                  <IonIcon
                    aria-hidden='true'
                    slot='start'
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
