import {
    addDays,
    addWeeks,
    format,
    getDay,
    isAfter,
    isBefore,
    parse,
    startOfDay,
    parseISO,
    isValid
} from 'date-fns';
import type { Trip } from '@/features/booking/types';
import type { RecurrentTrip } from '../types';

/**
 * Generates individual Trip instances from a RecurrentTrip template.
 * 
 * @param recurrentTrip The template to expand
 * @param existingTrips Existing trips to avoid duplicates
 * @param lookaheadDays How many days into the future to generate (default 30)
 * @param passengerName Name of the passenger (for the Trip object)
 * @param passengerPhone Phone of the passenger (for the Trip object)
 * @returns Array of generated Trip objects
 */
export function generateTripsFromRecurrent(
    recurrentTrip: RecurrentTrip,
    existingTrips: Trip[],
    lookaheadDays: number = 30,
    passengerName: string,
    passengerPhone: string
): Trip[] {
    const generatedTrips: Trip[] = [];
    const now = new Date();
    const startDate = parse(recurrentTrip.startDate, 'dd/MM/yyyy', new Date());
    const endDate = recurrentTrip.endDate === 'never'
        ? addDays(now, lookaheadDays)
        : parse(recurrentTrip.endDate, 'dd/MM/yyyy', new Date());

    const actualLookaheadEnd = isBefore(addDays(now, lookaheadDays), endDate)
        ? addDays(now, lookaheadDays)
        : endDate;

    // 1. Generate from weekly pattern
    if (recurrentTrip.daysOfWeek.length > 0) {
        let currentDate = isAfter(startDate, now) ? startDate : startOfDay(now);

        while (isBefore(currentDate, actualLookaheadEnd)) {
            const dayIndex = getDay(currentDate); // 0 = Sunday, 1 = Monday, etc.
            // Adjust dayIndex to match our 0=Monday convention if needed
            // Our RecurrentTrip seems to use 0-6 where 0 is Monday in some places?
            // Actually common JS is 0=Sunday. Let's check RecurrentTripDashboard.

            const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // 0=Mon, 6=Sun

            if (recurrentTrip.daysOfWeek.includes(adjustedDayIndex)) {
                // Calculate the week offset from start
                const weeksDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

                if (weeksDiff >= 0 && weeksDiff % recurrentTrip.frequencyWeeks === 0) {
                    const formattedDate = format(currentDate, 'dd/MM/yyyy');

                    // Pickup trip
                    const pickupTime = recurrentTrip.pickupTimes[adjustedDayIndex];
                    if (pickupTime) {
                        pushTripIfUnique(
                            generatedTrips,
                            existingTrips,
                            recurrentTrip,
                            formattedDate,
                            pickupTime,
                            passengerName,
                            passengerPhone,
                            'outbound'
                        );
                    }

                    // Return trip
                    const returnTime = recurrentTrip.returnTimes[adjustedDayIndex];
                    if (returnTime) {
                        pushTripIfUnique(
                            generatedTrips,
                            existingTrips,
                            recurrentTrip,
                            formattedDate,
                            returnTime,
                            passengerName,
                            passengerPhone,
                            'return'
                        );
                    }
                }
            }
            currentDate = addDays(currentDate, 1);
        }
    }

    // 2. Generate from specific dates
    if (recurrentTrip.specificDates) {
        recurrentTrip.specificDates.forEach(isoDate => {
            const dateObj = parseISO(isoDate);
            if (!isValid(dateObj)) return;

            if (isBefore(dateObj, actualLookaheadEnd) && !isBefore(dateObj, startOfDay(now))) {
                const formattedDate = format(dateObj, 'dd/MM/yyyy');
                const specificTime = recurrentTrip.specificDateTimes?.[isoDate];

                if (specificTime) {
                    if (specificTime.pickup) {
                        pushTripIfUnique(
                            generatedTrips,
                            existingTrips,
                            recurrentTrip,
                            formattedDate,
                            specificTime.pickup,
                            passengerName,
                            passengerPhone,
                            'outbound'
                        );
                    }
                    if (specificTime.return) {
                        pushTripIfUnique(
                            generatedTrips,
                            existingTrips,
                            recurrentTrip,
                            formattedDate,
                            specificTime.return,
                            passengerName,
                            passengerPhone,
                            'return'
                        );
                    }
                }
            }
        });
    }

    return generatedTrips;
}

function pushTripIfUnique(
    generatedTrips: Trip[],
    existingTrips: Trip[],
    recurrentTrip: RecurrentTrip,
    date: string,
    time: string,
    passengerName: string,
    passengerPhone: string,
    type: 'outbound' | 'return'
) {
    const isDuplicate = [...generatedTrips, ...existingTrips].some(t =>
        t.passengerId === recurrentTrip.passengerId &&
        t.date === date &&
        t.time === time
    );

    if (!isDuplicate) {
        generatedTrips.push({
            id: `gen-${recurrentTrip.id}-${date.replace(/\//g, '-')}-${time.replace(':', '')}-${type}`,
            time,
            date,
            status: 'Pending',
            statusColor: '#fef3c7', // Yellow background for pending
            driverId: 'To be assigned',
            driverType: 'taxi',
            pickup: type === 'outbound' ? recurrentTrip.pickup : recurrentTrip.dropoff,
            dropoff: type === 'outbound' ? recurrentTrip.dropoff : recurrentTrip.pickup,
            passenger: passengerName,
            phone: passengerPhone,
            passengerId: recurrentTrip.passengerId,
            fleet: recurrentTrip.fleet,
            vehicle: recurrentTrip.vehicle,
            payment: recurrentTrip.payment,
            linkedRecurrentTrip: recurrentTrip.id,
            insuranceCompany: recurrentTrip.insuranceCompany,
            insuranceNumber: recurrentTrip.patientNumber,
            tripType: recurrentTrip.purpose === 'medical' ? 'medical' : 'personal'
        });
    }
}
