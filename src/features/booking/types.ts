// Booking domain models

export interface Trip {
    id: string;
    time: string;
    status: string;
    statusColor: string;
    driverId: string;
    driverType: 'freenow' | 'taxi';
    pickup: string;
    dropoff: string;
    passenger: string;
    phone: string;
    delayed?: string;
    passengerId?: string; // Link to passenger
    date?: string;
    fleet?: string;
    vehicle?: string;
    payment?: string;
    costCenter?: string;
    notes?: string;
    customPrice?: string;
    // Additional fields from booking form
    tripType?: string;
    tripTitle?: string;
    linkedRecurrentTrip?: string;
    insuranceCompany?: string;
    insuranceNumber?: string;
    exemptionCoPayment?: boolean;
    m4Approved?: boolean;
}

export interface BookingData {
    date: string;
    time: string;
    passengerPhone: string;
    passengerName: string;
    pickup: string;
    dropoff: string;
    payment: string;
    costCenter: string;
    fleet: string;
    vehicle: string;
    driverId: string;
    customPrice: string;
    notes: string;
    // Additional fields
    tripType?: string;
    tripTitle?: string;
    linkedRecurrentTrip?: string;
    insuranceCompany?: string;
    insuranceNumber?: string;
    exemptionCoPayment?: boolean;
    m4Approved?: boolean;
}
