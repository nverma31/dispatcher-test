// Passenger domain models

export interface Passenger {
    id: string;
    name: string;
    passengerId: string;
    phone: string;
    recurrentTrips: string;
    purpose: string;
    status: 'Fehlende Informationen' | 'Vollständig';
    email?: string;
    dateOfBirth?: string;
    homeAddress?: string;
    notes?: string;
    insuranceCompany?: string;
    patientNumber?: string;
    totalTrips?: number;
    lastTripDate?: string;
}
