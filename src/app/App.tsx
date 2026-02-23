import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Header } from '@/components/layout/Header';
import { BookingForm } from '@/features/booking/components/BookingForm';
import { MapArea } from '@/components/layout/MapArea';
import { TripTable } from '@/features/dispatch/components/TripTable';
import { PassengersListScreen } from '@/features/passengers/screens/PassengersListScreen';
import { PassengerDetailScreen } from '@/features/passengers/screens/PassengerDetailScreen';
import { RecurrentTripDashboard } from '@/features/recurring/screens/RecurrentTripDashboard';
import { RecurrentTripDetailsScreen } from '@/features/recurring/screens/RecurrentTripDetailsScreen';
import { AddTripToRecurrentPage } from '@/features/booking/screens/AddTripToRecurrentPage';
import { CreateTripPage } from '@/features/booking/screens/CreateTripPage';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { BookingDetailsOverlay } from '@/features/booking/components/BookingDetailsOverlay';
import { Toaster } from '@/components/ds/sonner';
import { toast } from 'sonner@2.0.3';
import type { Trip, Passenger, BookingData, LocationData, RecurrentTrip, UserProfile } from '@/types';
import { generateTripsFromRecurrent } from '@/features/recurring/services/tripGenerator';
// Note: Types seem to be defined IN App.tsx in the original file, I need to check where they are.
// If they are exported from App.tsx, then importing from @/app/App is correct.

// Re-export for backward compatibility
export type { Trip, Passenger, BookingData, LocationData, RecurrentTrip, UserProfile };

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dispatch' | 'passengers' | 'passenger-details' | 'recurrent-trip' | 'recurrent-trip-details' | 'add-adhoc-trip' | 'create-trip' | 'settings'>('dispatch');
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [selectedRecurrentTrip, setSelectedRecurrentTrip] = useState<RecurrentTrip | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'u1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@free-now.com',
    phone: '+49 123 456789',
    language: 'Deutsch'
  });
  const [recurrentTrips, setRecurrentTrips] = useState<RecurrentTrip[]>([
    {
      id: 'rt1',
      passengerId: 'p1',
      title: 'Physiotherapy with Dr Rey',
      purpose: 'medical',
      pickup: 'Home',
      dropoff: 'Medical Center',
      payment: 'pay_driver',
      fleet: 'fleet_01',
      vehicle: 'taxi',
      startDate: '01/01/2025',
      endDate: 'never',
      frequencyWeeks: 4,
      daysOfWeek: [0], // Monday
      pickupTimes: { 0: '09:00' },
      returnTimes: { 0: '11:00' },
      insuranceCompany: 'sanitas',
      patientNumber: '12345'
    },
    {
      id: 'rt2',
      passengerId: 'p1',
      title: 'Psychologist with Dr Morales',
      purpose: 'medical',
      pickup: 'Home',
      dropoff: 'Psychology Clinic',
      payment: 'pay_driver',
      fleet: 'fleet_01',
      vehicle: 'taxi',
      startDate: '01/01/2025',
      endDate: 'never',
      frequencyWeeks: 2,
      daysOfWeek: [2], // Wednesday
      pickupTimes: { 2: '14:00' },
      returnTimes: { 2: '16:00' },
      insuranceCompany: 'sanitas',
      patientNumber: '12345'
    },
    {
      id: 'rt3',
      passengerId: 'p1',
      title: 'School Mario',
      purpose: 'personal',
      pickup: 'Home',
      dropoff: 'School',
      payment: 'pay_driver',
      fleet: 'fleet_01',
      vehicle: 'taxi',
      startDate: '01/01/2025',
      endDate: 'never',
      frequencyWeeks: 1,
      daysOfWeek: [0, 1, 2, 3, 4], // M, T, W, R, F
      pickupTimes: { 0: '08:00', 1: '08:00', 2: '08:00', 3: '08:00', 4: '08:00' },
      returnTimes: { 0: '15:00', 1: '15:00', 2: '15:00', 3: '15:00', 4: '15:00' },
      insuranceCompany: 'sanitas',
      patientNumber: '12345'
    }
  ]);

  // Passengers state - shared across the app
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'p1',
      name: 'Anna Mueller',
      passengerId: '37001',
      phone: '+49 123 456789',
      recurrentTrips: 'Ja',
      purpose: 'Medizinisch',
      status: 'Vollständig',
      totalTrips: 5,
      lastTripDate: '2024-03-15'
    },
    {
      id: 'p2',
      name: 'Hans Schmidt',
      passengerId: '37002',
      phone: '+49 987 654321',
      recurrentTrips: 'Ja',
      purpose: 'Geschäftlich',
      status: 'Vollständig',
      totalTrips: 3,
      lastTripDate: '2024-03-14'
    },
    {
      id: 'p3',
      name: 'Maria Garcia',
      passengerId: '37003',
      phone: '+49 555 123456',
      recurrentTrips: 'Nein',
      purpose: 'Privat',
      status: 'Fehlende Informationen',
      totalTrips: 1,
      lastTripDate: '2024-03-10'
    }
  ]);

  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      time: '14:30',
      date: '13/09/2025',
      status: 'Completed',
      statusColor: 'bg-green-500 text-white',
      driverId: '1008',
      driverType: 'freenow',
      pickup: 'Neumühlen 19, 22765 Hamburg',
      dropoff: 'Schmalenremen 55, 22307 Hamburg',
      passenger: 'Anna Mueller',
      phone: '+49 123 456789',
      passengerId: 'p1'
    },
    {
      id: '2',
      time: '15:45',
      date: '13/09/2025',
      status: 'In Progress',
      statusColor: 'bg-blue-500 text-white',
      driverId: '1009',
      driverType: 'freenow',
      pickup: 'Mühlenstraße 5, 22765 Hamburg',
      dropoff: 'Süderstraße 8, 22305 Hamburg',
      passenger: 'Anna Mueller',
      phone: '+49 123 456789',
      delayed: '+15 min',
      passengerId: 'p1'
    },
    {
      id: '3',
      time: '16:00',
      date: '14/09/2025',
      status: 'Completed',
      statusColor: 'bg-yellow-500 text-white',
      driverId: '1010',
      driverType: 'freenow',
      pickup: 'Hafenstraße 12, 22765 Hamburg',
      dropoff: 'Friedrichstraße 20, 22301 Hamburg',
      passenger: 'Anna Mueller',
      phone: '+49 123 456789',
      passengerId: 'p1'
    },
    {
      id: '4',
      time: '09:15',
      date: '14/09/2025',
      status: 'Completed',
      statusColor: 'bg-green-500 text-white',
      driverId: 'D045',
      driverType: 'taxi',
      pickup: 'Central Station',
      dropoff: 'Business District',
      passenger: 'Hans Schmidt',
      phone: '+49 987 654321',
      passengerId: 'p2'
    },
    {
      id: '5',
      time: '10:30',
      date: '15/09/2025',
      status: 'Pending',
      statusColor: 'bg-yellow-500 text-white',
      driverId: 'D025',
      driverType: 'taxi',
      pickup: 'Plaza Restaurant',
      dropoff: 'Residential Area',
      passenger: 'Maria Garcia',
      phone: '+49 555 123456',
      passengerId: 'p3'
    }
  ]);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', locationData: LocationData) => {
    if (type === 'pickup') {
      setPickupLocation(locationData);
    } else {
      setDropoffLocation(locationData);
    }
  };

  // Function to find or create passenger
  const findOrCreatePassenger = (name: string, phone: string): Passenger => {
    // Check if passenger already exists by both name AND phone number
    const existingPassenger = passengers.find(p =>
      p.phone === phone && p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingPassenger) {
      // Update trip count and last trip date
      const updatedPassenger: Passenger = {
        ...existingPassenger,
        totalTrips: (existingPassenger.totalTrips || 0) + 1,
        lastTripDate: new Date().toISOString().split('T')[0]
      };

      setPassengers(prev =>
        prev.map(p => p.id === existingPassenger.id ? updatedPassenger : p)
      );

      return updatedPassenger;
    } else {
      // Create new passenger
      const newPassenger: Passenger = {
        id: `p${Date.now()}`,
        name: name,
        passengerId: (37000 + passengers.length + 1).toString(),
        phone: phone,
        recurrentTrips: 'Nein',
        purpose: '-',
        status: 'Fehlende Informationen',
        totalTrips: 1,
        lastTripDate: new Date().toISOString().split('T')[0]
      };

      setPassengers(prev => [newPassenger, ...prev]);

      // Show notification about new passenger
      toast.info('Neuer Fahrgast erstellt', {
        description: `${name} wurde zur Fahrgastliste hinzugefügt.`,
        duration: 3000,
      });

      return newPassenger;
    }
  };

  const addTrip = (bookingData: BookingData) => {
    // Find or create passenger
    const passenger = findOrCreatePassenger(bookingData.passengerName, bookingData.passengerPhone);

    const newTrip: Trip = {
      id: Date.now().toString(),
      time: bookingData.time,
      status: 'Pending',
      statusColor: 'bg-yellow-500 text-white',
      driverId: bookingData.driverId || 'To be assigned',
      driverType: 'taxi',
      pickup: bookingData.pickup,
      dropoff: bookingData.dropoff,
      passenger: bookingData.passengerName,
      phone: bookingData.passengerPhone,
      passengerId: passenger.id, // Link to passenger
      date: bookingData.date,
      fleet: bookingData.fleet,
      vehicle: bookingData.vehicle,
      payment: bookingData.payment,
      costCenter: bookingData.costCenter,
      notes: bookingData.notes,
      customPrice: bookingData.customPrice,
      // Include additional fields if provided
      tripType: bookingData.tripType,
      tripTitle: bookingData.tripTitle,
      linkedRecurrentTrip: bookingData.linkedRecurrentTrip,
      insuranceCompany: bookingData.insuranceCompany,
      insuranceNumber: bookingData.insuranceNumber,
      exemptionCoPayment: bookingData.exemptionCoPayment,
      m4Approved: bookingData.m4Approved
    };

    setTrips(prevTrips => [newTrip, ...prevTrips]);

    // Show additional info toast if additional fields were filled
    if (bookingData.tripType || bookingData.insuranceCompany || bookingData.tripTitle) {
      toast.info('Fahrt mit zusätzlichen Details erstellt', {
        description: `Fahrt wurde erstellt und mit dem Konto von ${passenger.name} verknüpft.`,
        duration: 3000,
      });
    }
  };

  const addRecurrentTrip = (tripData: RecurrentTrip) => {
    setRecurrentTrips(prev => [tripData, ...prev]);

    const passenger = passengers.find(p => p.id === tripData.passengerId);
    if (passenger) {
      // Generate individual trips
      const generatedTrips = generateTripsFromRecurrent(
        tripData,
        trips,
        30, // 30 days lookahead
        passenger.name,
        passenger.phone
      );

      if (generatedTrips.length > 0) {
        setTrips(prev => [...generatedTrips, ...prev]);
        toast.success(`${generatedTrips.length} Einzelfahrten wurden generiert`);
      }

      // Update passenger to show they have recurrent trips
      setPassengers(prev =>
        prev.map(p => p.id === tripData.passengerId
          ? { ...p, recurrentTrips: 'Ja', totalTrips: (p.totalTrips || 0) + generatedTrips.length }
          : p
        )
      );
    }

    toast.success('Wiederkehrende Fahrt erfolgreich erstellt');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-sys-background)' }}>
      <Toaster />
      {/* Fixed Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-40">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Main Content - with left margin to account for fixed sidebar and bottom padding for mobile nav */}
      <div className="flex-1 lg:ml-[128px] overflow-y-auto pb-20 lg:pb-0">
        {currentPage === 'dispatch' && (
          <div className="p-4 md:p-6 lg:p-10">
            <Header />

            {/* Booking Section */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
              <BookingForm
                onCreateBooking={addTrip}
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                onLocationUpdate={handleLocationSelect}
                onCreateRecurrentTrip={() => setCurrentPage('recurrent-trip')}
                prefilledDriverId={selectedDriverId || undefined}
              />
              <MapArea
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                onLocationSelect={handleLocationSelect}
                onDriverClick={(id: string) => setSelectedDriverId(id)}
              />
            </div>

            {/* Trip List — white card matching Figma "Dispatch Trip list" frame */}
            <div
              style={{
                backgroundColor: 'var(--color-sys-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                marginTop: '24px',
              }}
            >
              <TripTable trips={trips} onTripClick={setSelectedTrip} />
            </div>

          </div>
        )}

        {currentPage === 'passengers' && (
          <div className="min-h-screen">
            <PassengersListScreen
              className="bg-[var(--color-background)] relative lg:rounded-[var(--radius-card)] size-full"
              passengers={passengers}
              onUpdatePassenger={(id, updatedData) => {
                setPassengers(prev =>
                  prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
                );
                toast.success('Fahrgast erfolgreich aktualisiert');
                setSelectedPassenger(null);
                setCurrentPage('passengers');
              }}
              onDeletePassenger={(id) => {
                const hasTrips = trips.some(t => t.passengerId === id);
                if (hasTrips) {
                  toast.error('Deletion not allowed', {
                    description: 'This passenger has an active trip history and cannot be deleted for data integrity reasons.'
                  });
                } else if (confirm('Möchten Sie diesen Fahrgast wirklich löschen?')) {
                  setPassengers(prev => prev.filter(p => p.id !== id));
                  toast.success('Fahrgast gelöscht');
                }
              }}
              onEditPassenger={(id: string) => {
                const passenger = passengers.find(p => p.id === id);
                if (passenger) {
                  setSelectedPassenger(passenger);
                  setCurrentPage('passenger-details');
                }
              }}
            />
          </div>
        )}

        {currentPage === 'passenger-details' && selectedPassenger && (
          <div className="min-h-screen">
            <PassengerDetailScreen
              passenger={selectedPassenger}
              trips={trips}
              recurrentTrips={recurrentTrips}
              onBack={() => {
                setSelectedPassenger(null);
                setCurrentPage('passengers');
              }}
              onSave={(updatedData: Partial<Passenger>) => {
                setPassengers(prev =>
                  prev.map(p => p.id === selectedPassenger.id ? { ...p, ...updatedData } : p)
                );
                toast.success('Passenger updated successfully');
                setSelectedPassenger(null);
                setCurrentPage('passengers');
              }}
              onCreateTrip={() => {
                setCurrentPage('create-trip');
              }}
              onCreateRecurrentTrip={() => {
                setCurrentPage('recurrent-trip');
              }}
              onEditRecurrentTrip={(recurrentTrip: RecurrentTrip) => {
                setSelectedRecurrentTrip(recurrentTrip);
                setCurrentPage('recurrent-trip-details');
              }}
              onDelete={() => {
                const id = selectedPassenger.id;
                const hasTrips = trips.some(t => t.passengerId === id);
                if (hasTrips) {
                  toast.error('Deletion not allowed', {
                    description: 'This passenger has an active trip history and cannot be deleted for data integrity reasons.'
                  });
                } else if (confirm('Möchten Sie diesen Fahrgast wirklich löschen?')) {
                  setPassengers(prev => prev.filter(p => p.id !== id));
                  setSelectedPassenger(null);
                  setCurrentPage('passengers');
                  toast.success('Fahrgast gelöscht');
                }
              }}
            />
          </div>
        )}

        {currentPage === 'recurrent-trip' && (
          <div className="min-h-screen">
            <RecurrentTripDashboard
              passenger={selectedPassenger || undefined}
              onBack={() => {
                if (selectedPassenger) {
                  setCurrentPage('passenger-details');
                } else {
                  setCurrentPage('dispatch');
                }
              }}
              onSave={(tripData: RecurrentTrip, passengerData?: any) => {
                // Find or create passenger if not already selected
                let targetPassenger = selectedPassenger;

                if (!targetPassenger && passengerData) {
                  // Create or find passenger based on phone number
                  targetPassenger = findOrCreatePassenger(
                    `${passengerData.firstName} ${passengerData.lastName}`.trim(),
                    passengerData.phone
                  );

                  // Update passenger with additional data
                  setPassengers(prev =>
                    prev.map(p => p.id === targetPassenger!.id
                      ? {
                        ...p,
                        email: passengerData.email,
                        recurrentTrips: 'Ja'
                      }
                      : p
                    )
                  );
                }

                if (targetPassenger) {
                  // Update tripData with correct passengerId
                  const updatedTripData = {
                    ...tripData,
                    passengerId: targetPassenger.id
                  };

                  addRecurrentTrip(updatedTripData);

                  // Navigate to passenger details page
                  setSelectedPassenger(targetPassenger);
                  setCurrentPage('passenger-details');
                } else {
                  toast.error('Failed to create passenger');
                }
              }}
            />
          </div>
        )}

        {currentPage === 'recurrent-trip-details' && selectedRecurrentTrip && selectedPassenger && (
          <div className="min-h-screen">
            <RecurrentTripDetailsScreen
              recurrentTrip={selectedRecurrentTrip}
              passenger={selectedPassenger}
              trips={trips}
              onBack={() => {
                setSelectedRecurrentTrip(null);
                setCurrentPage('passenger-details');
              }}
              onSave={(updatedTrip: RecurrentTrip) => {
                setRecurrentTrips(prev =>
                  prev.map(rt => rt.id === updatedTrip.id ? updatedTrip : rt)
                );

                // Regenerate trips for this updated recurrent trip
                const generatedTrips = generateTripsFromRecurrent(
                  updatedTrip,
                  trips,
                  30,
                  selectedPassenger.name,
                  selectedPassenger.phone
                );

                if (generatedTrips.length > 0) {
                  setTrips(prev => [...generatedTrips, ...prev]);
                  toast.success(`${generatedTrips.length} neue Einzelfahrten wurden generiert`);
                }

                toast.success('Wiederkehrende Fahrt erfolgreich aktualisiert');
                setSelectedRecurrentTrip(null);
                setCurrentPage('passenger-details');
              }}
              onAddAdHocTrip={() => {
                setCurrentPage('add-adhoc-trip');
              }}
            />
          </div>
        )}

        {currentPage === 'add-adhoc-trip' && selectedRecurrentTrip && selectedPassenger && (
          <div className="min-h-screen">
            <AddTripToRecurrentPage
              recurrentTrip={selectedRecurrentTrip}
              onBack={() => {
                setCurrentPage('recurrent-trip-details');
              }}
              onSave={(tripData: any) => {
                const newTrip: Trip = {
                  id: `trip-${Date.now()}`,
                  time: tripData.time || '',
                  status: tripData.status || 'Pending',
                  statusColor: tripData.statusColor || '#f8ecee',
                  driverId: tripData.driverId || 'N/A',
                  driverType: tripData.driverType || 'taxi',
                  pickup: tripData.pickup || '',
                  dropoff: tripData.dropoff || '',
                  passenger: selectedPassenger.name,
                  phone: selectedPassenger.phone,
                  passengerId: selectedPassenger.id,
                  date: tripData.date,
                  fleet: tripData.fleet,
                  vehicle: tripData.vehicle,
                  payment: tripData.payment,
                  notes: tripData.notes,
                  customPrice: tripData.customPrice,
                  tripType: tripData.tripType,
                  tripTitle: tripData.tripTitle,
                  linkedRecurrentTrip: selectedRecurrentTrip.id,
                  insuranceCompany: tripData.insuranceCompany,
                  insuranceNumber: tripData.insuranceNumber,
                  exemptionCoPayment: tripData.exemptionCoPayment,
                  m4Approved: tripData.m4Approved,
                };
                setTrips(prev => [...prev, newTrip]);
                toast.success('Fahrt zur wiederkehrenden Buchung hinzugefügt');
                setCurrentPage('recurrent-trip-details');
              }}
            />
          </div>
        )}

        {currentPage === 'create-trip' && selectedPassenger && (
          <div className="min-h-screen">
            <CreateTripPage
              passenger={selectedPassenger}
              onBack={() => {
                setCurrentPage('passenger-details');
              }}
              onSave={(tripData: any) => {
                const newTrip: Trip = {
                  id: Date.now().toString(),
                  time: tripData.time,
                  status: 'Pending',
                  statusColor: 'bg-yellow-500 text-white',
                  driverId: 'To be assigned',
                  driverType: 'taxi',
                  pickup: tripData.pickupAddress,
                  dropoff: tripData.dropoffAddress,
                  passenger: selectedPassenger.name,
                  phone: selectedPassenger.phone,
                  passengerId: selectedPassenger.id,
                  date: tripData.date,
                  vehicle: tripData.vehicleType,
                  notes: tripData.notes
                };
                setTrips(prev => [newTrip, ...prev]);

                // Update passenger trip count
                setPassengers(prev =>
                  prev.map(p => p.id === selectedPassenger.id
                    ? { ...p, totalTrips: (p.totalTrips || 0) + 1, lastTripDate: new Date().toISOString().split('T')[0] }
                    : p
                  )
                );

                toast.success('Fahrt erfolgreich erstellt');
                setCurrentPage('passenger-details');
              }}
            />
          </div>
        )}

        {currentPage === 'settings' && (
          <div className="min-h-screen">
            <AccountScreen
              user={currentUser}
              onUpdateUser={(updatedData: Partial<UserProfile>) => {
                setCurrentUser(prev => ({ ...prev, ...updatedData }));
                toast.success('Profile updated successfully');
              }}
              onSignOut={() => {
                toast.info('Sign out not implemented in MVP');
              }}
            />
          </div>
        )}
        {/* In a real app, logic to clear auth would go here */}

        {/* Booking Details Overlay */}
        {selectedTrip && (
          <BookingDetailsOverlay
            trip={selectedTrip}
            onClose={() => setSelectedTrip(null)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}