import {
  CoworkingItemType,
  WorkingPlace,
  AvailableDate,
  NewAvailableDatesTime,
  Booking,
  User,
  TimeSlot,
  CreateBookingData,
} from '../types';
import {
  app,
  auth,
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  serverTimestamp,
  writeBatch,
} from './config';

export const createWorkingPlace = async (
  workingPlace: Omit<WorkingPlace, 'id' | 'createdAt'>,
  coworkingId: string
) => {
  try {
    const timestamp = serverTimestamp();
    const workingPlaceRef = collection(db, 'workingPlaces');
    const wpRef = await addDoc(workingPlaceRef, {
      ...workingPlace,
      coworkingId,
      createdAt: timestamp,
      availableDates: {},
    });
    console.log('WorkingPlace created with ID: ', wpRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const createBooking = async (
  bookingData: CreateBookingData,
  dates: string[]
) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const batch = writeBatch(db);

    const workingPlaceRef = doc(
      db,
      'workingPlaces',
      bookingData.workingPlaceId
    );
    const workingPlaceSnap = await getDoc(workingPlaceRef);

    if (!workingPlaceSnap.exists()) {
      throw new Error('Working place not found');
    }

    const workingPlaceData = workingPlaceSnap.data() as WorkingPlace;
    const availableDates: { [date: string]: TimeSlot[] } =
      workingPlaceData.availableDates || {};

    for (const date of dates) {
      const bookingRef = doc(bookingsRef);
      if (availableDates[date]) {
        availableDates[date] = availableDates[date].filter(
          (timeSlot) =>
            !(
              timeSlot.startTime.hour === bookingData.timeSlot.startTime.hour &&
              timeSlot.endTime.hour === bookingData.timeSlot.endTime.hour
            )
        );

        if (availableDates[date].length === 0) {
          delete availableDates[date];
        }
      }
      batch.set(bookingRef, {
        ...bookingData,
        date,
        createdAt: serverTimestamp(),
        status: 'active',
      });
    }
    batch.update(workingPlaceRef, {
      availableDates: availableDates,
    });

    await batch.commit();
    console.log('Bookings created for certain dates');
  } catch (error) {
    console.error('Error creating booking: ', error);
  }
};

export const deleteWorkingPlace = async (id: string) => {
  const workingPlaceRef = doc(db, 'workingPlaces', id);

  const bookingsQuery = query(
    collection(db, 'bookings'),
    where('workingPlaceId', '==', id),
    where('status', '==', 'active')
  );

  const bookingsSnapshot = await getDocs(bookingsQuery);

  const batch = writeBatch(db);

  if (bookingsSnapshot.docs?.length) {
    bookingsSnapshot.docs.forEach((bookingDoc) => {
      const bookingRef = doc(db, 'bookings', bookingDoc.id);
      batch.update(bookingRef, { status: 'canceled' });
    });
  }

  batch.delete(workingPlaceRef);

  return await batch.commit();
};

export const cancelBooking = async (bookingId: string) => {
  const bookingRef = doc(db, 'bookings', bookingId);
  const bookingSnapshot = await getDoc(bookingRef);

  if (!bookingSnapshot.exists()) {
    throw new Error('Booking does not exist!');
  }
  const booking = bookingSnapshot.data();
  const workingPlaceRef = doc(db, 'workingPlaces', booking.workingPlaceId);
  const workingPlaceSnapshot = await getDoc(workingPlaceRef);

  if (!workingPlaceSnapshot.exists()) {
    throw new Error('WP of booking is empty!');
  }
  const workingPlace = workingPlaceSnapshot.data();

  await updateDoc(bookingRef, { status: 'canceled' });

  const availableDates: { [date: string]: TimeSlot[] } =
    workingPlace.availableDates || {};

  if (availableDates[booking.date]) {
    availableDates[booking.date].push(booking.timeSlot);
  } else {
    availableDates[booking.date] = [booking.timeSlot];
  }

  await updateDoc(workingPlaceRef, { availableDates });
};

export const getUserInfo = async (userId: string) => {
  const userRef = doc(db, 'users', userId);

  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error('User does not exist!');
  }

  const user = userSnapshot.data();
  if (!user.userSkills)
    return {
      email: user.email,
      userSkills: ['admin'],
    };

  return {
    email: user.email,
    userSkills: user.userSkills,
  };
};

export const updateUserDetails = async (
  userId: string,
  newSkills: string[],
  newLocation: string
) => {
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, { userSkills: newSkills, location: newLocation });
};

export const addAvailableDateToWorkingPlaces = async (
  workingPlaceIds: string[],
  newAvailableDatesTime: NewAvailableDatesTime
) => {
  const promises = workingPlaceIds.map(async (id) => {
    const workingPlaceRef = doc(db, 'workingPlaces', id);
    const workingPlaceSnapshot = await getDoc(workingPlaceRef);

    if (!workingPlaceSnapshot.exists()) {
      console.log('Working place does not exist with id: ' + id);
      return;
    }

    const workingPlace = workingPlaceSnapshot.data();
    const availableDates: { [date: string]: TimeSlot[] } =
      workingPlace.availableDates || {};

    for (const date of newAvailableDatesTime.dates) {
      // const existingDateIndex = availableDates.findIndex(ad => ad.date === date);

      if (availableDates[date]) {
        // for (const existingTimeSlot of availableDates[date]) {
        //   const updatedTimeSlots = compareTimeSlots(existingTimeSlot, newAvailableDatesTime.timeSlot);
        // }
        availableDates[date].push(newAvailableDatesTime.timeSlot);
      } else {
        availableDates[date] = [newAvailableDatesTime.timeSlot];
      }
    }

    await updateDoc(workingPlaceRef, { availableDates });
  });

  await Promise.all(promises);
};

export const getWorkingPlaces = async (
  coworkingId: string
): Promise<WorkingPlace[]> => {
  const workingPlaces = collection(db, 'workingPlaces');
  const q = query(
    workingPlaces,
    where('coworkingId', '==', coworkingId),
    orderBy('createdAt')
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return [];
  }
  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as WorkingPlace),
    id: doc.id,
  }));
};

export const getBookingsByWorkingPlace = async (
  workingPlaceId: string
): Promise<Booking[]> => {
  const bookings = collection(db, 'bookings');
  const q = query(
    bookings,
    where('workingPlaceId', '==', workingPlaceId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return [];
  }
  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Booking),
    id: doc.id,
  }));
};

export const getBookingsByUserId = async (
  userId: string
): Promise<Booking[]> => {
  const bookings = collection(db, 'bookings');
  const q = query(
    bookings,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return [];
  }
  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Booking),
    id: doc.id,
  }));
};

export const getCoworkingId = async (userId: string) => {
  const q = query(
    collection(db, 'coworkings'),
    where('authorID', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const coworkingDataId = querySnapshot.docs[0].id;
    return coworkingDataId;
  } else {
    return null;
  }
};

export const getCoworkingInfoById = async (coworkingId: string) => {
  const coworkingRef = doc(db, 'coworkings', coworkingId);

  const coworkingSnapshot = await getDoc(coworkingRef);

  if (!coworkingSnapshot.exists()) {
    throw new Error('coworking does not exist!');
  }

  const coworking = coworkingSnapshot.data();

  return {
    id: coworkingId,
    name: coworking.name,
    location: coworking.location,
    description: coworking.description,
    imageUrls: coworking.imageUrls,
  };
};

export const fetchCoworkings = (
  setData: React.Dispatch<React.SetStateAction<CoworkingItemType[]>>
) => {
  const coworkingsRef = collection(db, 'coworkings');
  const q = query(coworkingsRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const newCoworkings: any[] = [];
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

  return unsubscribe;
};
