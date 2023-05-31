import { TimeSlot } from "../types";

// Convert time to minutes
const convertTimeToMinutes = (time: { hour: string, minute: string }) => {
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
    updatedSlots.push({ startTime: newSlot.startTime, endTime: existingSlot.startTime });
    updatedSlots.push({ startTime: existingSlot.endTime, endTime: newSlot.endTime });
  } else if (startNew > startExisting && endNew > endExisting) {
    updatedSlots.push({ startTime: existingSlot.endTime, endTime: newSlot.endTime });
  } else if (startNew < startExisting && endNew < endExisting) {
    updatedSlots.push({ startTime: newSlot.startTime, endTime: existingSlot.startTime });
  }

  // Ensure all added slots are at least 1 hour long
  updatedSlots = updatedSlots.filter(slot => {
    return convertTimeToMinutes(slot.endTime) - convertTimeToMinutes(slot.startTime) >= 60;
  });

  return updatedSlots;
};

