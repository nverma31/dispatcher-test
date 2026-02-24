import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TextField } from "@/components/ds/text-field";
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { DateInput } from "@/features/booking/components/DateInput";
import { TimeInput } from "@/features/booking/components/TimeInput";
import { AddressLookupField } from "@/features/booking/components/AddressLookupField";
import type {
  Passenger,
  RecurrentTrip,
  LocationData,
} from "../../types";
import svgPaths from "@/components/icons/svg-m3izrnyafj";

interface RecurrentTripDashboardProps {
  passenger?: Passenger;
  onBack: () => void;
  onSave: (tripData: RecurrentTrip, passengerData?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => void;
}

const dayChips = [
  { short: "Mo", full: "Montag" },
  { short: "Di", full: "Dienstag" },
  { short: "Mi", full: "Mittwoch" },
  { short: "Do", full: "Donnerstag" },
  { short: "Fr", full: "Freitag" },
  { short: "Sa", full: "Samstag" },
  { short: "So", full: "Sonntag" },
];

export function RecurrentTripDashboard({
  passenger,
  onBack,
  onSave,
}: RecurrentTripDashboardProps) {
  const [pickupLocation, setPickupLocation] =
    useState<LocationData | null>({
      address: "123 Main Street, Berlin, Germany",
      coordinates: { lat: 52.52, lng: 13.405 },
    });
  const [dropoffLocation, setDropoffLocation] =
    useState<LocationData | null>({
      address: "456 Hospital Avenue, Berlin, Germany",
      coordinates: { lat: 52.51, lng: 13.395 },
    });

  const [formData, setFormData] = useState({
    purpose: "medical",
    title: "Weekly Medical Appointment",
    phone: passenger?.phone || "+49 123 456789",
    email: "patient@example.com",
    firstName: passenger?.name.split(" ")[0] || "John",
    lastName:
      passenger?.name.split(" ").slice(1).join(" ") || "Doe",
    homeAddress: "123 Main Street, Berlin, Germany",
    dateOfBirth: "15/03/1985",
    notes: "Please call upon arrival",
    sameAsHome: true,
    payment: "pay_driver",
    costCenter: "",
    fleet: "fleet_01",
    vehicle: "taxi",
    driverId: "",
    customPrice: "",
    insuranceCompany: "sanitas",
    patientNumber: "PAT123456",
    startDate: "17/06/2025",
    endDate: "30/12/2025",
    frequencyNumber: "01",
    selectedDays: [1, 4] as number[], // Tuesday and Friday indices
    pickupTimes: { 1: "09:00", 4: "09:00" } as { [key: number]: string }, // times for selected days
    returnTimes: { 1: "11:30", 4: "11:30" } as { [key: number]: string },
  });

  // Recurrence tab state
  const [recurrenceTab, setRecurrenceTab] = useState<
    "specific" | "weekly"
  >("specific");

  // Specific dates state
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2025, 1, 1),
  ); // February 2025
  const [selectedSpecificDates, setSelectedSpecificDates] =
    useState<Date[]>([
      new Date(2025, 1, 17), // Feb 17
      new Date(2025, 1, 22), // Feb 22
      new Date(2025, 1, 25), // Feb 25
      new Date(2025, 2, 17), // Mar 17
      new Date(2025, 2, 22), // Mar 22
      new Date(2025, 2, 25), // Mar 25
    ]);
  const [specificDateTimes, setSpecificDateTimes] = useState<{
    [key: string]: { pickup: string; return: string };
  }>({});

  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const purposeOptions: SelectOption[] = [
    { value: "Krankenfahrten", label: "Krankenfahrten" },
    { value: "Other", label: "Sonstige" },
  ];

  const paymentOptions: SelectOption[] = [
    { value: "pay_driver", label: "Fahrer direkt bezahlen" },
    { value: "card", label: "Karte" },
  ];

  const insuranceOptions: SelectOption[] = [
    { value: "sanitas", label: "Sanitas" },
    { value: "axa", label: "AXA" },
    { value: "allianz", label: "Allianz" },
  ];

  const fleetOptions: SelectOption[] = [
    { value: "fleet_01", label: "FreeNow Flotte" },
    { value: "fleet_02", label: "Eigene Flotte" },
  ];

  const vehicleOptions: SelectOption[] = [
    { value: "taxi", label: "Kein Fahrzeug verfügbar" },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: "01", label: "01" },
    { value: "02", label: "02" },
    { value: "03", label: "03" },
    { value: "04", label: "04" },
  ];

  const toggleDay = (index: number) => {
    setFormData((prev) => {
      const newSelectedDays = prev.selectedDays.includes(index)
        ? prev.selectedDays.filter((d) => d !== index)
        : [...prev.selectedDays, index].sort();
      return { ...prev, selectedDays: newSelectedDays };
    });
  };

  const handleSave = () => {
    // Validation
    if (!formData.title.trim()) {
      return;
    }

    const tripData: RecurrentTrip = {
      id: `rt${Date.now()}`,
      passengerId: passenger?.id || "p1", // TODO: Handle creating passenger if not selected
      title: formData.title,
      purpose: formData.purpose,
      pickup: pickupLocation?.address || "",
      dropoff: dropoffLocation?.address || "",
      payment: formData.payment,
      fleet: formData.fleet,
      vehicle: formData.vehicle,
      startDate: formData.startDate,
      endDate: formData.endDate,
      frequencyWeeks: parseInt(formData.frequencyNumber),
      daysOfWeek: formData.selectedDays,
      pickupTimes: formData.pickupTimes,
      returnTimes: formData.returnTimes,
      specificDates: selectedSpecificDates.map((d: Date) => d.toISOString()),
      specificDateTimes: specificDateTimes,
      insuranceCompany: formData.insuranceCompany,
      patientNumber: formData.patientNumber,
    };

    const passengerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
    };

    onSave(tripData, passengerData);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="p-4 md:p-6 lg:p-10 flex flex-col items-center">
        {/* Back Button */}
        <div className="w-full max-w-[800px] mb-6">
          <button
            onClick={onBack}
            className="h-14 px-6 rounded-[var(--radius)] flex items-center gap-2 transition-colors"
            style={{
              backgroundColor: 'var(--color-sys-surface-container)',
              color: 'var(--color-sys-on-surface)',
              fontSize: 'var(--fs-label-1, 16px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-variant)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-container)'; }}
          >
            <ArrowLeft className="size-5" />
            <span>
              {passenger
                ? "Zurück zum Fahrgast"
                : "Zurück zur Versand"}
            </span>
          </button>
        </div>

        {/* Main Form */}
        <div
          className="rounded-[24px] p-6 w-full max-w-[800px]"
          style={{ backgroundColor: 'var(--color-sys-surface, var(--color-surface, #fcfcfc))' }}
        >
          <h1 className="text-[28px] mb-6">
            Details der wiederkehrenden Fahrt festlegen
          </h1>

          {/* Trip Title and Purpose */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <SelectField
                label="Typ"
                value={formData.purpose}
                options={purposeOptions}
                onChange={(value: string) =>
                  setFormData({ ...formData, purpose: value })
                }
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Titel"
                value={formData.title}
                onChange={(value) =>
                  setFormData({ ...formData, title: value })
                }
              />
            </div>
          </div>

          {/* Personal Details */}
          <h3 className="mb-4">Persönliche Angaben</h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <TextField
                label="Telefonnummer"
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value })
                }
              />
            </div>
            <div className="flex-1">
              <TextField
                label="E-Mail-Adresse"
                value={formData.email}
                onChange={(value) =>
                  setFormData({ ...formData, email: value })
                }
                placeholder="Platzhalter"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <TextField
                label="Vorname"
                value={formData.firstName}
                onChange={(value) =>
                  setFormData({ ...formData, firstName: value })
                }
                placeholder="Platzhalter"
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Nachname (optional)"
                value={formData.lastName}
                onChange={(value) =>
                  setFormData({ ...formData, lastName: value })
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <TextField
              label="Wohnadresse"
              value={formData.homeAddress}
              onChange={(value) =>
                setFormData({ ...formData, homeAddress: value })
              }
              placeholder="Platzhalter"
            />
          </div>

          <div className="box-border content-stretch flex flex-col gap-[4px] items-start min-w-[184px] overflow-clip px-0 py-[8px] relative shrink-0 w-[372px] mb-4">
            <DateInput
              label="Geburtsdatum"
              value={formData.dateOfBirth}
              onChange={(value) =>
                setFormData({ ...formData, dateOfBirth: value })
              }
            />
          </div>

          <div className="mb-6"></div>

          {/* Trip Details */}
          <h3 className="mb-4">Fahrtdetails</h3>

          <div className="mb-4">
            <AddressLookupField
              id="pickup"
              label="Abholung"
              placeholder="Abholung"
              value={pickupLocation}
              onChange={setPickupLocation}
            />
          </div>

          <div className="mb-4">
            <label
              onClick={() =>
                setFormData({
                  ...formData,
                  sameAsHome: !formData.sameAsHome,
                })
              }
              className="flex items-center gap-2 cursor-pointer py-4"
            >
              <div className="size-6">
                {formData.sameAsHome ? (
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d={svgPaths.pa927880}
                      fill="#BE0038"
                    />
                  </svg>
                ) : (
                  <div className="size-5 rounded border-2 border-[#777777]" />
                )}
              </div>
              <span className="text-[16px]">
                Gleich wie Wohnadresse
              </span>
            </label>
          </div>

          <div className="mb-4">
            <AddressLookupField
              id="dropoff"
              label="Ziel"
              placeholder="Ziel"
              value={dropoffLocation}
              onChange={setDropoffLocation}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <SelectField
                label="Zahlung"
                value={formData.payment}
                options={paymentOptions}
                onChange={(value) =>
                  setFormData({ ...formData, payment: value })
                }
                leadingIcon={
                  <div className="overflow-clip relative shrink-0 size-[24px]">
                    <div className="absolute inset-[16.67%_4.17%_16.67%_8.33%]">
                      <svg
                        className="block size-full"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 21 16"
                      >
                        <path
                          clipRule="evenodd"
                          d={svgPaths.p21395c80}
                          fill="#5e5e5e"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                }
              />
            </div>
            <div className="flex-1 opacity-[0.38]">
              <SelectField
                label="Kostenstelle"
                value={formData.costCenter}
                options={[{ value: "", label: "Kostenstelle" }]}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    costCenter: value,
                  })
                }
                disabled
              />
            </div>
          </div>

          <div className="mb-4">
            <SelectField
              label="Flotte"
              value={formData.fleet}
              options={fleetOptions}
              onChange={(value) =>
                setFormData({ ...formData, fleet: value })
              }
            />
          </div>

          <div className="mb-4">
            <SelectField
              label="Fahrzeug"
              value={formData.vehicle}
              options={vehicleOptions}
              onChange={(value) =>
                setFormData({ ...formData, vehicle: value })
              }
            />
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 opacity-[0.38]">
              <TextField
                label="Fahrer-ID (optional)"
                value={formData.driverId}
                onChange={(value) =>
                  setFormData({ ...formData, driverId: value })
                }
                disabled
              />
            </div>
            <div className="flex-1 opacity-[0.38]">
              <TextField
                label="Benutzerdefinierter Preis (optional)"
                value={formData.customPrice}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    customPrice: value,
                  })
                }
                disabled
              />
            </div>
          </div>

          {/* Healthcare & Insurance */}
          <h3 className="mb-4">
            Gesundheits- & Versicherungsinformationen
          </h3>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <SelectField
                label="Versicherungsunternehmen"
                value={formData.insuranceCompany}
                options={insuranceOptions}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    insuranceCompany: value,
                  })
                }
              />
            </div>
            <div className="flex-1">
              <TextField
                label="Patientennummer"
                value={formData.patientNumber}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    patientNumber: value,
                  })
                }
                placeholder="Platzhalter"
              />
            </div>
          </div>

          {/* Recurrence */}
          <h3 className="mb-4">Wiederholung</h3>

          {/* Tab Bar */}
          <div className="content-stretch flex gap-[24px] items-start relative shrink-0 mb-4 px-0 py-[16px]">
            <div
              className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 cursor-pointer"
              onClick={() => setRecurrenceTab("specific")}
            >
              <p
                className={`text-[14px] leading-[20px] ${recurrenceTab === "specific" ? "font-semibold text-[#790518]" : "text-[#5e5e5e]"}`}
              >
                Set specific dates and times
              </p>
              {recurrenceTab === "specific" && (
                <div className="bg-[#790518] h-[3px] rounded-[12px] shrink-0 w-full" />
              )}
            </div>
            <div
              className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 cursor-pointer"
              onClick={() => setRecurrenceTab("weekly")}
            >
              <p
                className={`text-[14px] leading-[20px] ${recurrenceTab === "weekly" ? "font-semibold text-[#790518]" : "text-[#5e5e5e]"}`}
              >
                Set weekly schedule
              </p>
              {recurrenceTab === "weekly" && (
                <div className="bg-[#790518] h-[3px] rounded-[12px] shrink-0 w-full" />
              )}
            </div>
          </div>

          {/* Specific Dates Tab Content */}
          {recurrenceTab === "specific" && (
            <div className="mb-6">
              {/* Two-month Calendar View */}
              <div className="content-stretch flex gap-[16px] items-center justify-center px-0 py-[16px] relative shrink-0 w-full mb-6">
                {/* Previous Button */}
                <div
                  className="content-stretch flex items-center justify-center relative shrink-0 size-[40px] cursor-pointer"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                >
                  <ChevronLeft className="size-6 text-[#675b5b]" />
                </div>

                {/* Two Months Side by Side */}
                <div className="content-stretch flex gap-[32px] items-center relative shrink-0">
                  {[0, 1].map((monthOffset) => {
                    const displayMonth = new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + monthOffset,
                      1,
                    );
                    const daysInMonth = new Date(
                      displayMonth.getFullYear(),
                      displayMonth.getMonth() + 1,
                      0,
                    ).getDate();
                    const firstDay = new Date(
                      displayMonth.getFullYear(),
                      displayMonth.getMonth(),
                      1,
                    ).getDay();
                    const startDay =
                      firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday (1) to 0

                    return (
                      <div
                        key={monthOffset}
                        className="h-[261px] relative shrink-0 w-[281px]"
                      >
                        {/* Month Header */}
                        <div className="absolute top-0 left-0 right-0 pb-3">
                          <p className="text-[16px] leading-[24px] text-[#1e1a1a] text-center">
                            {
                              monthNames[
                              displayMonth.getMonth()
                              ]
                            }{" "}
                            {displayMonth.getFullYear()}
                          </p>
                        </div>

                        {/* Weekday Headers */}
                        <div className="absolute top-[36px] left-0 right-0 grid grid-cols-7 gap-1">
                          {weekDays.map((day) => (
                            <div
                              key={day}
                              className="flex items-center justify-center pb-1"
                            >
                              <p className="text-[16px] leading-[24px] text-[#1e1a1a] text-center">
                                {day}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="absolute top-[61px] left-0 right-0 bottom-0 grid grid-cols-7 gap-1">
                          {/* Empty cells before first day */}
                          {Array.from({ length: startDay }).map(
                            (_, i) => (
                              <div
                                key={`empty-${i}`}
                                className="p-[6px]"
                              />
                            ),
                          )}

                          {/* Days of the month */}
                          {Array.from({
                            length: daysInMonth,
                          }).map((_, i) => {
                            const day = i + 1;
                            const currentDate = new Date(
                              displayMonth.getFullYear(),
                              displayMonth.getMonth(),
                              day,
                            );
                            const isSelected =
                              selectedSpecificDates.some(
                                (d) =>
                                  d.getDate() === day &&
                                  d.getMonth() ===
                                  displayMonth.getMonth() &&
                                  d.getFullYear() ===
                                  displayMonth.getFullYear(),
                              );

                            return (
                              <div
                                key={day}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedSpecificDates(
                                      selectedSpecificDates.filter(
                                        (d) =>
                                          !(
                                            d.getDate() ===
                                            day &&
                                            d.getMonth() ===
                                            displayMonth.getMonth() &&
                                            d.getFullYear() ===
                                            displayMonth.getFullYear()
                                          ),
                                      ),
                                    );
                                  } else {
                                    setSelectedSpecificDates(
                                      [
                                        ...selectedSpecificDates,
                                        currentDate,
                                      ].sort(
                                        (a, b) =>
                                          a.getTime() -
                                          b.getTime(),
                                      ),
                                    );
                                  }
                                }}
                                className={`
                                  p-[6px] cursor-pointer flex items-center justify-center
                                  ${isSelected ? "bg-[#f8ecee] rounded-[12px]" : "hover:bg-[#f1f1f1] rounded-[12px]"}
                                `}
                              >
                                <p
                                  className={`text-[14px] leading-[20px] ${isSelected ? "text-[#1a4a1d]" : "text-[#1e1a1a]"}`}
                                >
                                  {day
                                    .toString()
                                    .padStart(2, "0")}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Next Button */}
                <div
                  className="content-stretch flex items-center justify-center relative shrink-0 size-[40px] cursor-pointer"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                >
                  <ChevronRight className="size-6 text-[#675b5b]" />
                </div>
              </div>

              {/* Set Pickup Times */}
              {selectedSpecificDates.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-[16px] mb-4">
                    Set pickup times
                  </h4>

                  {/* Headers */}
                  <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full mb-4">
                    <div className="w-[121px]" />
                    <div className="w-[144px]">
                      <p className="text-[16px]">Pickup at</p>
                    </div>
                    <div className="w-[144px]">
                      <p className="text-[16px]">
                        Return at (optional)
                      </p>
                    </div>
                  </div>

                  {/* Time inputs for each selected date */}
                  <div className="flex flex-col gap-[16px]">
                    {selectedSpecificDates.map((date) => {
                      const dateKey = date
                        .toISOString()
                        .split("T")[0];
                      const weekdayNames = [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ];
                      const monthNamesShort = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      const dayName =
                        weekdayNames[date.getDay()];
                      const monthName =
                        monthNamesShort[date.getMonth()];
                      const dayNum = date.getDate();

                      return (
                        <div
                          key={dateKey}
                          className="content-stretch flex gap-[16px] items-center relative shrink-0"
                        >
                          <div className="w-[121px]">
                            <p className="text-[16px]">
                              {dayName}, {monthName} {dayNum}
                            </p>
                          </div>
                          <div className="w-[144px]">
                            <TimeInput
                              value={
                                specificDateTimes[dateKey]
                                  ?.pickup || ""
                              }
                              onChange={(value) =>
                                setSpecificDateTimes({
                                  ...specificDateTimes,
                                  [dateKey]: {
                                    ...specificDateTimes[
                                    dateKey
                                    ],
                                    pickup: value,
                                  },
                                })
                              }
                              leadingIcon={
                                <Clock className="size-6 text-[#5e5e5e]" />
                              }
                            />
                          </div>
                          <div className="w-[144px]">
                            <TimeInput
                              value={
                                specificDateTimes[dateKey]
                                  ?.return || ""
                              }
                              onChange={(value) =>
                                setSpecificDateTimes({
                                  ...specificDateTimes,
                                  [dateKey]: {
                                    ...specificDateTimes[
                                    dateKey
                                    ],
                                    return: value,
                                  },
                                })
                              }
                              leadingIcon={
                                <Clock className="size-6 text-[#5e5e5e]" />
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weekly Schedule Tab Content */}
          {recurrenceTab === "weekly" && (
            <>
              <div className="flex gap-2 mb-4">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-start min-w-[184px] overflow-clip px-0 py-[8px] relative shrink-0">
                  <DateInput
                    label="Start date"
                    value={formData.startDate}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        startDate: value,
                      })
                    }
                  />
                </div>
                <div className="box-border content-stretch flex flex-col gap-[4px] items-start min-w-[184px] overflow-clip px-0 py-[8px] relative shrink-0 flex-1">
                  <DateInput
                    label="End date"
                    value={formData.endDate}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        endDate: value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4 items-center mb-6">
                <span className="text-[16px] text-[#5e5e5e]">
                  Every
                </span>
                <div className="box-border content-stretch flex flex-col gap-[4px] h-[72px] items-start min-w-[56px] overflow-clip px-0 py-[8px] relative shrink-0">
                  <SelectField
                    value={formData.frequencyNumber}
                    options={frequencyOptions}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        frequencyNumber: value,
                      })
                    }
                  />
                </div>
                <span className="text-[16px] text-[#5e5e5e]">
                  week on
                </span>
              </div>

              {/* Day Selection */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {dayChips.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => toggleDay(index)}
                      className={`box-border content-stretch flex gap-[12px] h-[40px] items-center justify-center overflow-clip px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[64px] transition-colors ${formData.selectedDays.includes(index)
                        ? "bg-[#e80046] text-white"
                        : "bg-[#f1f1f1] text-[#1b1b1b]"
                        }`}
                    >
                      <span className="text-[16px]">
                        {day.short}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="bg-[#f1f1f1] h-[56px] px-6 rounded-[var(--radius)] flex items-center gap-2">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 16 17"
                  >
                    <path
                      d={svgPaths.p3b674000}
                      fill="#5e5e5e"
                    />
                  </svg>
                  <span className="text-[16px]">
                    Exclude days
                  </span>
                </button>
              </div>

              {/* Time Selection */}
              {formData.selectedDays.length > 0 && (
                <div className="box-border content-stretch flex flex-col gap-[32px] items-start px-0 py-[32px] relative shrink-0">
                  <div className="box-border content-stretch flex gap-[16px] items-center px-0 py-[4px] relative shrink-0 w-full">
                    <div className="w-[104px]" />
                    <div className="w-[144px]">
                      <p className="text-[16px]">Pickup at</p>
                    </div>
                    <div className="w-[144px]">
                      <p className="text-[16px]">
                        Return at (optional)
                      </p>
                    </div>
                  </div>

                  {formData.selectedDays.map((dayIndex) => (
                    <div
                      key={dayIndex}
                      className="content-stretch flex gap-[16px] items-center relative shrink-0"
                    >
                      <div className="w-[104px]">
                        <p className="text-[16px]">
                          {dayChips[dayIndex].full}
                        </p>
                      </div>
                      <div className="w-[144px]">
                        <TimeInput
                          value={
                            formData.pickupTimes[dayIndex] || ""
                          }
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              pickupTimes: {
                                ...formData.pickupTimes,
                                [dayIndex]: value,
                              },
                            })
                          }
                          leadingIcon={
                            <Clock className="size-6 text-[#5e5e5e]" />
                          }
                        />
                      </div>
                      <div className="w-[144px]">
                        <TimeInput
                          value={
                            formData.returnTimes[dayIndex] || ""
                          }
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              returnTimes: {
                                ...formData.returnTimes,
                                [dayIndex]: value,
                              },
                            })
                          }
                          leadingIcon={
                            <Clock className="size-6 text-[#5e5e5e]" />
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-8 items-center justify-end mt-6">
            <button
              onClick={onBack}
              className="bg-[#f1f1f1] h-[56px] px-6 rounded-[var(--radius)] flex items-center hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              <span className="text-[16px]">Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-[#e80046] h-[56px] px-6 rounded-[var(--radius)] flex items-center text-white hover:bg-[#d00040] transition-colors"
            >
              <span className="text-[16px]">
                Create recurrent trip
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}