import {} from 'firebase/auth';
import {} from 'firebase/firestore';
import { addDays, format } from 'date-fns';
import { faker } from '@faker-js/faker';

import {
  db,
  addDoc,
  collection,
  setDoc,
  createUserWithEmailAndPassword,
  getAuth,
  auth,
  serverTimestamp,
  query,
  getDocs,
  where,
  doc,
} from './config'; // Где db - ваша инициализированная база данных Firebase

// const auth = getAuth();

// Функция для генерации случайных скиллов
const generateRandomSkills = (categories) => {
  const skillsByCategory = {
    'IT & Software': [
      'Web Development',
      'Database Management',
      'Network Troubleshooting',
      'IT Support',
      'Software Development',
    ],
    'Design & Creativity': [
      'Graphic Design',
      '3D Modeling',
      'Branding Design',
      'Package Design',
      'Visual Design',
    ],
    'Data & Analytics': [
      'Data Analytics',
      'Business Analytics',
      'Data Visualization',
      'Database Reporting',
    ],
    'Communication & PR': [
      'Social Media Strategy',
      'Content Distribution',
      'Public Relations',
      'Corporate Communication',
    ],
    'Finance & Accounting': [
      'Payroll Processing',
      'Accounting Software',
      'Financial Risk Management',
      'Investment Analysis',
    ],
  };
  const category = categories[Math.floor(Math.random() * categories.length)];
  const skills = skillsByCategory[category];
  const userSkills = [];
  const numSkills = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numSkills; i++) {
    userSkills.push(skills[Math.floor(Math.random() * skills.length)]);
  }
  return userSkills;
};

const categories = [
  'IT & Software',
  'Design & Creativity',
  'Data & Analytics',
  'Communication & PR',
  'Finance & Accounting',
];

let createdUserIds = []; // Массив для хранения ID созданных пользователей
let createdCoworkingIds = []; // Массив для хранения ID созданных коворкингов

// Генерация и запись пользователей в базу данных
export const createUsers = async () => {
  for (let i = 0; i < 20; i++) {
    const email = `user${i}@gmail.com`; // сгенерированный email
    const password = `password${i}`; // сгенерированный пароль
    const userSkills = generateRandomSkills(categories); // сгенерированные навыки
    const resp = await createUserWithEmailAndPassword(auth, email, password);
    const uid = resp.user.uid;
    createdUserIds.push(uid);
    const data = { id: uid, email, userSkills };
    const usersRef = collection(db, 'users');
    await setDoc(doc(usersRef, uid), data);
  }
  console.log('Users created successfully.');
  return createdUserIds;
};

const coworkingNames = [
  'Tech Hive',
  'Creative Space',
  'Innovators Hub',
  "Entrepreneur's Station",
  "Freelancer's Fortress",
  'Startup Harbor',
  'Digital Dock',
  'Ideation Island',
  'Productivity Peak',
  'Brainstorm Beach',
  'Coding Camp',
  'Data Den',
  'Collaboration Cabin',
  'Motivation Mountain',
  'Visionary Valley',
];

const coworkingDescriptions = [
  'A place for tech wizards to weave their magic.',
  'A playground for the innovative and creative minds.',
  'A hub for the innovators of the future.',
  'A place for entrepreneurs to turn dreams into reality.',
  'A fortress for freelancers to focus on their projects.',
  'A safe harbor for startups navigating their way.',
  'A dock for the digital nomads.',
  'An island where ideas are born and nurtured.',
  'A peak where productivity reaches its zenith.',
  'A beach where brains storm up a storm.',
  'A camp where coders can exercise their coding muscles.',
  'A den for data enthusiasts to delve into data.',
  'A cabin where collaboration and creativity thrives.',
  'A mountain where motivation reaches its peak.',
  'A valley where visionaries gather.',
];

const kievStreets = [
  'Khreshchatyk St.',
  'Velyka Vasylkivska St.',
  'Olesia Honchara St.',
  'Reitarska St.',
  'Prorizna St.',
  'Sagaidachnogo St.',
  'Volodymyrska St.',
  'Zolotovoritska St.',
  'Yaroslaviv Val St.',
  'Esplanadna St.',
  'Taras Shevchenko Blvd',
  'Kostelna St.',
  'Mykhailivska St.',
  'Sophiivska St.',
  'Horodetskoho St.',
];

export const createCoworkings = async () => {
  const coworkingRef = collection(db, 'coworkings');
  // const timestamp = serverTimestamp();
  for (let i = 0; i < coworkingNames.length; i++) {
    const data = {
      name: coworkingNames[i],
      location: `Kyiv, ${kievStreets[i]}`,
      description: coworkingDescriptions[i],
      imageUrls: [
        'https://picsum.photos/200/200',
        'https://picsum.photos/200/200',
        'https://picsum.photos/200/200',
      ],
      authorID: 'e0RdRzOUiPhD99pFcf7fzEKwpg13',
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(coworkingRef, data);
    createdCoworkingIds.push(docRef.id);
  }
  return createdCoworkingIds;
};

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return year + '-' + month + '-' + day;
}

let mockedAvailableDates = {};

for (let i = 0; i < 7; i++) {
  let date = new Date();
  date.setDate(date.getDate() + i);

  mockedAvailableDates[getFormattedDate(date)] = [
    {
      startTime: { hour: '10', minute: '00' },
      endTime: { hour: '12', minute: '15' },
    },
    {
      startTime: { hour: '13', minute: '30' },
      endTime: { hour: '15', minute: '45' },
    },
    {
      startTime: { hour: '16', minute: '30' },
      endTime: { hour: '18', minute: '45' },
    },
  ];
}

const positions = [
  'North wing',
  'South wing',
  'East wing',
  'West wing',
  'Center',
];

const timeSlots = [
  {
    startTime: { hour: '08', minute: '00' },
    endTime: { hour: '09', minute: '45' },
  },
  {
    startTime: { hour: '20', minute: '55' },
    endTime: { hour: '22', minute: '30' },
  },
  {
    startTime: { hour: '18', minute: '55' },
    endTime: { hour: '20', minute: '45' },
  },
];

export const createWorkingPlacesAndBookings = async () => {
  const workingPlacesRef = collection(db, 'workingPlaces');
  const bookingsRef = collection(db, 'bookings');

  // Get all user IDs without admin field
  const userQuery = query(collection(db, 'users'), where('admin', '==', null));
  const userSnap = await getDocs(userQuery);
  const userIds = userSnap.docs.map((doc) => doc.id);

  // Get all coworking IDs
  const coworkingSnap = await getDocs(collection(db, 'coworkings'));
  const coworkingIds = coworkingSnap.docs.map((doc) => doc.id);

  for (const coworkingId of coworkingIds) {
    for (let i = 0; i < 5; i++) {
      const seats = Math.floor(Math.random() * 5) + 1;
      const workingPlace = {
        seats: seats,
        position: positions[Math.floor(Math.random() * positions.length)],
        pricePerHour: seats * 10 + Math.floor(Math.random() * 21) - 10,
        availableDates: mockedAvailableDates,
        coworkingId,
        createdAt: serverTimestamp(),
      };

      const wpRef = await addDoc(workingPlacesRef, workingPlace);

      for (let j = 0; j < 7; j++) {
        const randomDays = Math.floor(Math.random() * 15) - 7; // Generate random number from -7 to 7
        const bookingDate = addDays(new Date(), randomDays);
        const formattedBookingDate = format(bookingDate, 'yyyy-MM-dd');

        // Choose random time slot
        const randomSlotIndex = Math.floor(Math.random() * timeSlots.length);
        const randomTimeSlot = timeSlots[randomSlotIndex];

        // Choose random user
        const randomUserIndex = Math.floor(Math.random() * userIds.length);
        const randomUserId = userIds[randomUserIndex];
        const bookingData = {
          userId: randomUserId,
          workingPlaceId: doc(wpRef).id,
          date: formattedBookingDate,
          timeSlot: randomTimeSlot,
          status: 'active',
          coworkingId,
          createdAt: serverTimestamp(),
        };
        await addDoc(bookingsRef, bookingData);
      }
    }
  }
};

// (async () => {
//   let userIds = await createUsers();
//   let coworkingIds = await createCoworkings();

//   console.log('User IDs:', userIds);
//   console.log('Coworking IDs:', coworkingIds);

//   await createWorkingPlacesAndBookings(userIds, coworkingIds);
// })();
