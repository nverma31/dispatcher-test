// Recurring Booking domain models

export interface RecurrentTrip {
    id: string;
    passengerId: string;
    title: string;
    purpose: string;
    pickup: string;
    dropoff: string;
    payment: string;
    fleet: string;
    vehicle: string;
    startDate: string;
    endDate: string;
    frequencyWeeks: number;
    daysOfWeek: number[]; // 0 = Monday, 1 = Tuesday, etc.
    pickupTimes: { [key: number]: string }; // day index -> time
    returnTimes: { [key: number]: string };
    insuranceCompany: string;
    patientNumber: string;
}
