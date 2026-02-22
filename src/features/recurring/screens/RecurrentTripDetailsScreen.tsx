import { useState } from "react";
import {
  ArrowLeft,
  Pen,
  Calendar,
  FileText,
  ChevronRight,
  ChevronLeft,
  Plus,
  Phone,
  RotateCcw,
  Clock,
} from "lucide-react";
import { TextField } from "@/components/ds/text-field";
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { DateInput } from "@/features/booking/components/DateInput";
import { DatePicker } from "@/features/booking/components/DatePicker";
import { TimeInput } from "@/features/booking/components/TimeInput";
import type {
  RecurrentTrip,
  Passenger,
  LocationData,
  Trip,
} from "../../types";

interface RecurrentTripDetailsScreenProps {
  recurrentTrip: RecurrentTrip;
  passenger?: Passenger;
  trips: Trip[];
  onBack: () => void;
  onSave: (updatedTrip: RecurrentTrip) => void;
  onAddAdHocTrip?: () => void;
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

export function RecurrentTripDetailsScreen({
  recurrentTrip,
  passenger,
  trips,
  onBack,
  onSave,
  onAddAdHocTrip,
}: RecurrentTripDetailsScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pickupLocation, setPickupLocation] =
    useState<LocationData | null>({
      address: recurrentTrip.pickup,
      coordinates: { lat: 0, lng: 0 },
    });
  const [dropoffLocation, setDropoffLocation] =
    useState<LocationData | null>({
      address: recurrentTrip.dropoff,
      coordinates: { lat: 0, lng: 0 },
    });

  const [formData, setFormData] = useState({
    purpose: recurrentTrip.purpose,
    title: recurrentTrip.title,
    phone: passenger?.phone || "",
    email: "",
    firstName: passenger?.name.split(" ")[0] || "",
    lastName:
      passenger?.name.split(" ").slice(1).join(" ") || "",
    homeAddress: "",
    dateOfBirth: "17/06/1980",
    notes: "",
    sameAsPickup: true,
    payment: recurrentTrip.payment,
    fleet: recurrentTrip.fleet,
    vehicle: recurrentTrip.vehicle,
    insuranceCompany: recurrentTrip.insuranceCompany,
    patientNumber: recurrentTrip.patientNumber,
    startDate: recurrentTrip.startDate,
    endDate: recurrentTrip.endDate,
    frequencyNumber: recurrentTrip.frequencyWeeks
      .toString()
      .padStart(2, "0"),
    selectedDays: recurrentTrip.daysOfWeek,
    pickupTimes: recurrentTrip.pickupTimes,
    returnTimes: recurrentTrip.returnTimes,
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
    useState<Date[]>(recurrentTrip.specificDates?.map(d => new Date(d)) || []);
  const [specificDateTimes, setSpecificDateTimes] = useState<{
    [key: string]: { pickup: string; return: string };
  }>(recurrentTrip.specificDateTimes || {});

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
    { value: "medical", label: "Medizinisch" },
    { value: "business", label: "Geschäftlich" },
    { value: "personal", label: "Persönlich" },
  ];

  const paymentOptions: SelectOption[] = [
    { value: "pay_driver", label: "Fahrer direkt bezahlen" },
    { value: "invoice", label: "Rechnung" },
    { value: "card", label: "Kreditkarte" },
  ];

  const insuranceOptions: SelectOption[] = [
    { value: "sanitas", label: "Sanitas" },
    { value: "axa", label: "AXA" },
    { value: "allianz", label: "Allianz" },
  ];

  const fleetOptions: SelectOption[] = [
    { value: "fleet_01", label: "Fleet 01" },
    { value: "fleet_02", label: "Fleet 02" },
  ];

  const vehicleOptions: SelectOption[] = [
    { value: "taxi", label: "Taxi" },
    { value: "van", label: "Van" },
    { value: "sedan", label: "Sedan" },
  ];

  const endDateOptions: SelectOption[] = [
    { value: "never", label: "Nie" },
    { value: "custom", label: "Benutzerdefiniertes Datum" },
  ];

  const handleSave = () => {
    const updatedTrip: RecurrentTrip = {
      ...recurrentTrip,
      title: formData.title,
      purpose: formData.purpose,
      pickup: pickupLocation?.address || recurrentTrip.pickup,
      dropoff:
        dropoffLocation?.address || recurrentTrip.dropoff,
      payment: formData.payment,
      fleet: formData.fleet,
      vehicle: formData.vehicle,
      startDate: formData.startDate,
      endDate: formData.endDate,
      frequencyWeeks: parseInt(formData.frequencyNumber),
      daysOfWeek: formData.selectedDays,
      pickupTimes: formData.pickupTimes,
      returnTimes: formData.returnTimes,
      specificDates: selectedSpecificDates.map(d => d.toISOString()),
      specificDateTimes: specificDateTimes,
      insuranceCompany: formData.insuranceCompany,
      patientNumber: formData.patientNumber,
    };
    onSave(updatedTrip);
    setIsEditing(false);
  };

  // Filter trips that were created from this recurrent booking
  const relatedTrips = trips
    .filter((trip) => {
      // In a real app, trips would have a recurrentTripId field
      // For now, we'll show some mock data
      return trip.passengerId === recurrentTrip.passengerId;
    })
    .slice(0, 15); // Show first 15 trips

  // Calculate trip statistics
  const ongoingTrips = relatedTrips.filter(
    (t) => t.status === "In Progress",
  ).length;
  const upcomingTrips = relatedTrips.filter(
    (t) => t.status === "Pending",
  ).length;
  const cancelledTrips = relatedTrips.filter(
    (t) => t.status === "Cancelled",
  ).length;
  const completedTrips = relatedTrips.filter(
    (t) => t.status === "Completed",
  ).length;

  const toggleDay = (index: number) => {
    if (!isEditing) return;

    setFormData((prev) => {
      const newSelectedDays = prev.selectedDays.includes(index)
        ? prev.selectedDays.filter((d) => d !== index)
        : [...prev.selectedDays, index].sort();

      return {
        ...prev,
        selectedDays: newSelectedDays,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="p-4 md:p-6 lg:p-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="bg-[#f1f1f1] h-14 px-6 rounded-[var(--radius)] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors mb-6"
        >
          <ArrowLeft className="size-5" />
          <span className="text-[16px]">
            Zurück zu Fahrgastdetails
          </span>
        </button>

        {/* Main Content */}
        <div className="flex gap-6 items-start">
          {/* Left Column - Recurrent Trip Form */}
          <div className="bg-[var(--color-surface-highest)] rounded-[24px] p-6 max-w-[480px] min-w-[480px]">
            {/* Header */}
            <div className="flex items-center gap-6 mb-6">
              <h1 className="text-[28px] flex-1">
                Details wiederkehrender Fahrten
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#f1f1f1] h-14 px-4 rounded-[var(--radius)] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors"
              >
                <Pen className="size-5" />
                <span className="text-[16px]">
                  {isEditing ? "Abbrechen" : "Details bearbeiten"}
                </span>
              </button>
            </div>

            {/* Trip Details Section */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-4">Fahrtdetails</h3>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <SelectField
                    label="Typ"
                    value={formData.purpose}
                    options={purposeOptions}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        purpose: value,
                      })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Titel"
                    value={formData.title}
                    onChange={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="mb-4">
                <TextField
                  label="Abholung"
                  value={pickupLocation?.address || ""}
                  onChange={(value) =>
                    setPickupLocation({
                      address: value,
                      coordinates: { lat: 0, lng: 0 },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sameAsHome"
                  checked={formData.sameAsPickup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sameAsPickup: e.target.checked,
                    })
                  }
                  disabled={!isEditing}
                  className="w-6 h-6 rounded border-2 border-[var(--color-outline)] accent-[var(--color-accent)]"
                />
                <label
                  htmlFor="sameAsHome"
                  className="text-[16px] cursor-pointer"
                >
                  Gleich wie Wohnadresse
                </label>
              </div>

              <div>
                <TextField
                  label="Ziel"
                  value={dropoffLocation?.address || ""}
                  onChange={(value) =>
                    setDropoffLocation({
                      address: value,
                      coordinates: { lat: 0, lng: 0 },
                    })
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Personal Details Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px]">
                  Persönliche Angaben
                </h3>
                <p className="text-[16px] text-[var(--color-on-surface-variant)]">
                  (Aus Fahrgastkonto bearbeiten)
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <TextField
                    label="Vorname"
                    value={formData.firstName}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        firstName: value,
                      })
                    }
                    disabled={true}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Nachname (optional)"
                    value={formData.lastName}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        lastName: value,
                      })
                    }
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <DateInput
                    label="Geburtsdatum"
                    value={formData.dateOfBirth}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: value,
                      })
                    }
                    disabled={true}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <TextField
                    label="Telefonnummer"
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    type="tel"
                    disabled={true}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="E-Mail-Adresse"
                    value={formData.email}
                    onChange={(value) =>
                      setFormData({ ...formData, email: value })
                    }
                    type="email"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="mb-4">
                <TextField
                  label="Wohnadresse"
                  value={formData.homeAddress}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      homeAddress: value,
                    })
                  }
                  disabled={true}
                />
              </div>

              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sameAsPickup"
                  checked={formData.sameAsPickup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sameAsPickup: e.target.checked,
                    })
                  }
                  disabled={true}
                  className="w-6 h-6 rounded border-2 border-[var(--color-outline)] accent-[var(--color-accent)]"
                />
                <label
                  htmlFor="sameAsPickup"
                  className="text-[16px]"
                >
                  Gleich wie Abholung
                </label>
              </div>

              <div>
                <TextField
                  label="Notizen (optional)"
                  value={formData.notes}
                  onChange={(value) =>
                    setFormData({ ...formData, notes: value })
                  }
                  disabled={true}
                />
              </div>
            </div>

            {/* Healthcare & Insurance Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px]">
                  Gesundheits- & Versicherungsinformationen
                </h3>
                <p className="text-[16px] text-[var(--color-on-surface-variant)]">
                  (Aus Fahrgastkonto bearbeiten)
                </p>
              </div>

              <div className="flex gap-2 mb-4">
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
                    disabled={true}
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
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Recurrence Section */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-4">Wiederholung</h3>

              {/* Tab Bar */}
              <div className="content-stretch flex gap-[24px] items-start relative shrink-0 mb-4 px-0 py-[16px]">
                <div
                  className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 cursor-pointer"
                  onClick={() => setRecurrenceTab("specific")}
                >
                  <p
                    className={`text-[14px] leading-[20px] ${recurrenceTab === "specific"
                      ? "font-semibold text-[#790518]"
                      : "text-[#5e5e5e]"
                      }`}
                  >
                    Spezifische Daten und Zeiten festlegen
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
                    className={`text-[14px] leading-[20px] ${recurrenceTab === "weekly"
                      ? "font-semibold text-[#790518]"
                      : "text-[#5e5e5e]"
                      }`}
                  >
                    Wöchentlichen Zeitplan festlegen
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
                      className={`content-stretch flex items-center justify-center relative shrink-0 size-[40px] ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                      onClick={() =>
                        isEditing &&
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

                    {/* Single Month */}
                    <div className="content-stretch flex items-center relative shrink-0">
                      {(() => {
                        const displayMonth = currentMonth;
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
                          firstDay === 0 ? 6 : firstDay - 1;

                        return (
                          <div className="h-[261px] relative shrink-0 w-[281px]">
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

                            <div className="absolute top-[61px] left-0 right-0 bottom-0 grid grid-cols-7 gap-1">
                              {Array.from({
                                length: startDay,
                              }).map((_, i) => (
                                <div
                                  key={`empty-${i}`}
                                  className="p-[6px]"
                                />
                              ))}

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
                                      if (!isEditing) return;
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
                                      p-[6px] flex items-center justify-center
                                      ${isEditing ? "cursor-pointer" : "cursor-not-allowed"}
                                      ${isSelected ? "bg-[#f8ecee] rounded-[12px]" : isEditing ? "hover:bg-[#f1f1f1] rounded-[12px]" : ""}
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
                      })()}
                    </div>

                    <div
                      className={`content-stretch flex items-center justify-center relative shrink-0 size-[40px] ${isEditing ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                      onClick={() =>
                        isEditing &&
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

                  {selectedSpecificDates.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-[16px] mb-4">
                        Abholzeiten festlegen
                      </h4>

                      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full mb-4">
                        <div className="w-[121px]" />
                        <div className="w-[144px]">
                          <p className="text-[16px]">
                            Abholung um
                          </p>
                        </div>
                        <div className="w-[144px]">
                          <p className="text-[16px]">
                            Rückfahrt um (optional)
                          </p>
                        </div>
                      </div>

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
                                  {dayName}, {monthName}{" "}
                                  {dayNum}
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
                                  disabled={!isEditing}
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
                                  disabled={!isEditing}
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
                    <div className="flex-1">
                      <DatePicker
                        label="Startdatum"
                        value={formData.startDate}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            startDate: value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex-1">
                      <SelectField
                        label="Enddatum"
                        value={formData.endDate}
                        options={endDateOptions}
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            endDate: value,
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 items-center mb-4">
                    <span className="text-[16px]">Alle</span>
                    <input
                      type="text"
                      value={formData.frequencyNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          frequencyNumber: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-16 h-14 px-4 border border-[var(--color-outline)] rounded-[var(--radius)] text-center text-[16px] bg-[var(--color-surface)] disabled:opacity-50"
                    />
                    <span className="text-[16px]">Woche(n) am</span>
                  </div>

                  {/* Day Selector */}
                  <div className="flex gap-2 mb-6">
                    {dayChips.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => toggleDay(index)}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-[var(--radius)] text-[16px] transition-colors ${formData.selectedDays.includes(index)
                          ? "bg-[var(--color-accent)] text-white"
                          : "bg-[#f1f1f1] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-variant)]"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center mb-4">
                    <Calendar className="size-5 text-[var(--color-on-surface-variant)]" />
                    <span className="text-[16px]">
                      Tage ausschließen (17)
                    </span>
                  </div>

                  {/* Time Inputs for Selected Days */}
                  {formData.selectedDays.map((dayIndex) => (
                    <div key={dayIndex} className="mb-4">
                      <h4 className="text-[16px] mb-3">
                        {dayChips[dayIndex].full}
                      </h4>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <TimeInput
                            label="Abholung um"
                            value={
                              formData.pickupTimes[dayIndex] ||
                              ""
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
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="flex-1">
                          <TimeInput
                            label="Rückfahrt um (optional)"
                            value={
                              formData.returnTimes[dayIndex] ||
                              ""
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
                            disabled={!isEditing}
                          />
                        </div>
                        <button
                          className="text-[16px] text-[var(--color-accent)] hover:underline"
                          disabled={!isEditing}
                        >
                          Auf alle kopieren
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-14 bg-[#f1f1f1] rounded-[var(--radius)] text-[16px] hover:bg-[var(--color-surface-variant)] transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-14 bg-[var(--color-accent)] text-white rounded-[var(--radius)] text-[16px] hover:opacity-90 transition-opacity"
                >
                  Änderungen speichern
                </button>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Documents Section */}

            {/* Activity Section */}
            <div className="bg-[var(--color-surface-highest)] rounded-[24px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[28px]">Aktivität</h2>
                <button
                  onClick={onAddAdHocTrip}
                  className="bg-[var(--color-accent)] text-white h-10 px-4 rounded-[var(--radius)] flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Plus className="size-5" />
                  <span className="text-[16px]">
                    Neue Fahrt unter dieser wiederkehrenden Buchung
                  </span>
                </button>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 items-center mb-6 flex-wrap">
                <div className="bg-[#f1f1f1] px-6 py-2 rounded-[var(--radius)] h-10 flex items-center">
                  <span className="text-[16px]">
                    {ongoingTrips} Laufend
                  </span>
                </div>
                <div className="bg-[#f1f1f1] px-6 py-2 rounded-[var(--radius)] h-10 flex items-center">
                  <span className="text-[16px]">
                    {upcomingTrips} Bevorstehend
                  </span>
                </div>
                <div className="h-10 px-2 flex items-center">
                  <div className="bg-[#e2e2e2] h-full w-px" />
                </div>
                <div className="bg-[#f1f1f1] px-6 py-2 rounded-[var(--radius)] h-10 flex items-center">
                  <span className="text-[16px]">
                    {cancelledTrips} Storniert
                  </span>
                </div>
                <div className="bg-[#f1f1f1] px-6 py-2 rounded-[var(--radius)] h-10 flex items-center">
                  <span className="text-[16px]">
                    {completedTrips} Abgeschlossen
                  </span>
                </div>
                <div className="ml-auto">
                  <div className="bg-[#f1f1f1] rounded-[var(--radius)] px-6 py-2 flex items-center gap-3 h-10">
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16a6.5 6.5 0 1 1 0-13m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"
                        fill="currentColor"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Fahrt suchen"
                      className="bg-transparent outline-none flex-1 text-[16px] text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]"
                    />
                  </div>
                </div>
              </div>

              {/* Trips Table */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="flex gap-2 h-12 items-center border-b border-[var(--color-outline-variant)]">
                    <div className="w-20 px-4">
                      <p className="text-[16px]">Zeit</p>
                    </div>
                    <div className="w-28 px-4">
                      <p className="text-[16px]">Status</p>
                    </div>
                    <div className="w-24 px-4">
                      <p className="text-[16px]">Fahrer-ID</p>
                    </div>
                    <div className="flex-1 px-4">
                      <p className="text-[16px]">Abholung</p>
                    </div>
                    <div className="flex-1 px-4">
                      <p className="text-[16px]">Ziel</p>
                    </div>
                    <div className="w-24 px-4">
                      <p className="text-[16px]">Aktionen</p>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {relatedTrips
                    .slice(0, 12)
                    .map((trip, index) => (
                      <div
                        key={trip.id}
                        className="flex gap-2 h-12 items-center border-b border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-variant)]/30"
                      >
                        <div className="w-20 px-4">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="size-4 text-[var(--color-on-surface-variant)]" />
                            <p className="text-[16px]">
                              {trip.time}
                            </p>
                          </div>
                        </div>
                        <div className="w-28 px-4">
                          <div className="px-3 py-1 rounded-full text-[14px] inline-block bg-[#e8f5e9] text-[#2e7d32]">
                            abgeschlossen
                          </div>
                        </div>
                        <div className="w-24 px-4">
                          <div className="flex items-center gap-1">
                            <svg
                              className="size-4"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M13 2L8 7L3 2"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                            <p className="text-[16px]">
                              {trip.driverId}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-[16px] truncate">
                            {trip.pickup}
                          </p>
                        </div>
                        <div className="flex-1 px-4">
                          <p className="text-[16px] truncate">
                            {trip.dropoff}
                          </p>
                        </div>
                        <div className="w-24 px-4 flex gap-1">
                          <button className="size-9 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                            <Phone className="size-5 text-[var(--color-on-surface-variant)]" />
                          </button>
                          <button className="size-9 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                            <svg
                              className="size-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="2"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="5"
                                r="2"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="19"
                                r="2"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Load More Button */}
              <div className="mt-6 flex justify-center">
                <button className="bg-[#f1f1f1] h-10 px-6 rounded-[var(--radius)] text-[16px] hover:bg-[var(--color-surface-variant)] transition-colors">
                  Mehr laden
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}