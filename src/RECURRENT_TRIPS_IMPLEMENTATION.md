# Recurrent Trips Implementation

## Overview
This document describes the implementation of the recurrent trips feature that allows creating recurring bookings from both the Dispatch page and the Passenger account page.

## Features Implemented

### 1. Data Architecture
- Added `RecurrentTrip` interface to `/types/index.ts`
- Includes all necessary fields: title, purpose, schedule, pickup/dropoff locations, payment details, healthcare information
- Supports weekly recurrence with specific days of the week
- Supports different pickup/return times for each selected day

### 2. Recurrent Trip Creation Page
- Created `/components/passengers/RecurrentTripPage.tsx`
- Full form with all sections matching the Figma design:
  - Trip details (purpose, title)
  - Personal details (phone, email, name, home address, date of birth, notes)
  - Trip details (pickup, dropoff, payment, fleet, vehicle)
  - Healthcare & insurance information
  - Recurrence settings (start/end date, frequency, days of week, times)
- Uses existing form components (TextField, SelectField, DateInput, TimeInput)
- Interactive day selection with chips
- Dynamic time inputs based on selected days
- Proper validation and save functionality

### 3. Navigation from Dispatch Page
- Updated `/components/booking/BookingForm.tsx`:
  - "New Recurring Ride" button now functional
  - Navigates to recurrent trip creation page
  - Returns to Dispatch after completion

### 4. Navigation from Passenger Account
- Updated `/components/passengers/PassengerDetailsPage.tsx`:
  - "New recurrent trip" button now functional
  - Pre-fills passenger information when coming from passenger page
  - Returns to passenger details after completion
  - Displays recurrent trips in table format

### 5. Recurrent Trips Display
- Passenger details page shows all recurrent trips for the passenger
- Table displays: Trip title, Repeat frequency, Days of week, Actions
- Sample data included for demonstration

## Entry Points

### From Dispatch Page
1. Click "New Recurring Ride" button in BookingForm
2. Opens RecurrentTripPage without pre-selected passenger
3. Fill in all details and save
4. Returns to Dispatch page

### From Passenger Account
1. Navigate to Passengers page
2. Click on a passenger to view details
3. In "Recurrent trips" section, click "New recurrent trip"
4. Opens RecurrentTripPage with passenger pre-selected
5. Fill in all details and save
6. Returns to passenger details page

## Data Flow

```
App.tsx (Main State)
├── recurrentTrips: RecurrentTrip[]
├── addRecurrentTrip(tripData)
│
├── Dispatch Page
│   └── BookingForm
│       └── "New Recurring Ride" → setCurrentPage('recurrent-trip')
│
├── Passenger Details Page
│   ├── Shows recurrentTrips filtered by passengerId
│   └── "New recurrent trip" → setCurrentPage('recurrent-trip')
│
└── RecurrentTripPage
    ├── Receives: passenger (optional), onBack, onSave
    └── onSave → addRecurrentTrip → updates state
```

## Components Created/Modified

### Created:
- `/components/passengers/RecurrentTripPage.tsx` - Main recurrent trip creation page

### Modified:
- `/App.tsx` - Added recurrent trips state and routing
- `/types/index.ts` - Added RecurrentTrip interface
- `/components/booking/BookingForm.tsx` - Made button functional
- `/components/passengers/PassengerDetailsPage.tsx` - Added button and display logic

## Design System Adherence
- All components use CSS variables from `styles/globals.css`
- Typography uses only defined font faces
- Colors, spacing, borders, and radius all use design tokens
- Matches Figma design pixel-perfect where possible
- Uses existing form components (TextField, SelectField, DateInput, TimeInput)

## Future Enhancements
- Add edit functionality for existing recurrent trips
- Add delete functionality for recurrent trips
- Add passenger creation flow from recurrent trip page
- Generate individual trips from recurrent trip schedules
- Add conflict detection for overlapping trips
- Add notifications/reminders for recurring trips
