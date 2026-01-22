# Data Architecture Documentation

## Overview

This application manages a taxi/fleet booking system with an integrated passenger management system. The data flows between bookings (trips) and passengers to maintain consistency and track customer history.

## Visual Flow

```
┌─────────────────┐
│  Booking Form   │
│  (User Input)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  App.tsx - addTrip()                    │
│  ┌───────────────────────────────────┐  │
│  │ 1. findOrCreatePassenger()        │  │
│  │    - Check if phone exists        │  │
│  │    - Update or Create             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 2. Create Trip                    │  │
│  │    - Link to passenger            │  │
│  │    - Add to trips array           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┬──────────────────┐
│                 │                  │
▼                 ▼                  │
┌──────────┐  ┌──────────────┐      │
│  Trips   │  │  Passengers  │      │
│  State   │  │    State     │      │
└────┬─────┘  └──────┬───────┘      │
     │               │              │
     ▼               ▼              │
┌──────────┐  ┌──────────────┐     │
│TripTable │  │PassengersPage│     │
│  (View)  │  │    (View)    │     │
└──────────┘  └──────────────┘     │
     │                              │
     └──────────────────────────────┘
            (Click row)
         Shows BookingDetailsOverlay
```

## Data Flow

### 1. Creating a Booking

When a user creates a booking through the BookingForm:

1. **Form Submission** → `BookingForm` component collects all booking details
2. **Trip Creation** → `App.tsx` `addTrip()` function is called
3. **Passenger Lookup** → System checks if a passenger with the same phone number already exists
4. **Passenger Creation/Update**:
   - If passenger exists: Updates their trip count and last trip date
   - If new passenger: Creates a new passenger record with status "Fehlende Informationen" (Missing Information)
5. **Trip Storage** → New trip is added to the trips array with a reference to the passenger ID

### 2. Data Structures

#### Trip
```typescript
{
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
  passengerId?: string;  // Link to Passenger.id
  delayed?: string;
  date?: string;
  fleet?: string;
  vehicle?: string;
  payment?: string;
  costCenter?: string;
  notes?: string;
  customPrice?: string;
}
```

#### Passenger
```typescript
{
  id: string;
  name: string;
  passengerId: string;        // Display ID (e.g., "37001")
  phone: string;              // Unique identifier
  recurrentTrips: string;     // "Ja" or "Nein"
  purpose: string;            // "Medizinisch", "Geschäftlich", "Privat", etc.
  status: 'Fehlende Informationen' | 'Vollständig';
  email?: string;
  totalTrips?: number;        // Auto-incremented with each booking
  lastTripDate?: string;      // Auto-updated with each booking
}
```

### 3. Relationships

- **One-to-Many**: A passenger can have multiple trips
- **Identifier**: Passengers are uniquely identified by phone number
- **Linking**: Trips reference passengers via `passengerId` field

### 4. State Management

All data is managed in `App.tsx`:

```typescript
const [trips, setTrips] = useState<Trip[]>([...]);
const [passengers, setPassengers] = useState<Passenger[]>([...]);
```

**Props flow**:
- `PassengersPage` receives:
  - `passengers`: Current passenger list
  - `onUpdatePassenger`: Function to update passenger data
  - `onDeletePassenger`: Function to delete a passenger

### 5. Key Functions

#### `findOrCreatePassenger(name, phone)`
- Searches for existing passenger by phone number
- If found: Updates trip statistics
- If new: Creates passenger with default values
- Returns the passenger object

#### `addTrip(bookingData)`
- Calls `findOrCreatePassenger()` to get/create passenger
- Creates new trip with all booking details
- Links trip to passenger via `passengerId`
- Adds trip to the beginning of trips array

### 6. Features

✅ **Automatic Passenger Creation**: New passengers are created automatically when booking
✅ **Duplicate Prevention**: Phone number is used to prevent duplicate passenger records
✅ **Trip Tracking**: Each passenger's total trips and last trip date are automatically tracked
✅ **Data Consistency**: All bookings are linked to passengers for historical tracking
✅ **Search & Filter**: Passengers can be searched by name, ID, or phone number
✅ **Real-time Updates**: Passenger statistics update immediately when bookings are created

### 7. Future Enhancements

Potential improvements to consider:

- [ ] Edit passenger details from Passengers page
- [ ] View all trips for a specific passenger
- [ ] Export passenger/trip data
- [ ] Advanced filtering by trip purpose, status, etc.
- [ ] Passenger analytics dashboard
- [ ] Trip history timeline per passenger
- [ ] Email/SMS notifications to passengers
