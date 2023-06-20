import { TimeSlot } from '../types';

// Convert time to minutes
const convertTimeToMinutes = (time: { hour: string; minute: string }) => {
  const { hour, minute } = time;
  return parseInt(hour, 10) * 60 + parseInt(minute, 10);
};

// Compare two time slots and return the updated ones
const compareTimeSlots = (existingSlot: TimeSlot, newSlot: TimeSlot) => {
  const startExisting = convertTimeToMinutes(existingSlot.startTime);
  const endExisting = convertTimeToMinutes(existingSlot.endTime);

  const startNew = convertTimeToMinutes(newSlot.startTime);
  const endNew = convertTimeToMinutes(newSlot.endTime);

  let updatedSlots = [];

  if (endNew < startExisting) {
    return [];
  } else if (startNew > endExisting) {
    return [];
  } else if (startNew < startExisting && endNew > endExisting) {
    updatedSlots.push({
      startTime: newSlot.startTime,
      endTime: existingSlot.startTime,
    });
    updatedSlots.push({
      startTime: existingSlot.endTime,
      endTime: newSlot.endTime,
    });
  } else if (startNew > startExisting && endNew > endExisting) {
    updatedSlots.push({
      startTime: existingSlot.endTime,
      endTime: newSlot.endTime,
    });
  } else if (startNew < startExisting && endNew < endExisting) {
    updatedSlots.push({
      startTime: newSlot.startTime,
      endTime: existingSlot.startTime,
    });
  }

  // Ensure all added slots are at least 1 hour long
  updatedSlots = updatedSlots.filter((slot) => {
    return (
      convertTimeToMinutes(slot.endTime) -
        convertTimeToMinutes(slot.startTime) >=
      60
    );
  });

  return updatedSlots;
};

export const geocode = async (lat: any, lng: any) => {
  const apiKey = 'AIzaSyAuTpbyxiry3QOaCZzFwvWEDswiVnNEvYk';
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=en&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    // Usually, you would want the formatted_address of the first result
    // But this might depend on your use case
    return data.results[0].formatted_address;
  } else {
    throw new Error('No location available');
  }
};
