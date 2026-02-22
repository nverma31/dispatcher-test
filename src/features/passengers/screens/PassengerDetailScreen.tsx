import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Pen,
  Trash2,
  Phone,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { TextField } from "@/components/ds/text-field";
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { DateInput } from "@/features/booking/components/DateInput";
import type {
  Passenger,
  Trip,
  RecurrentTrip,
} from "../../types";
import svgPaths from "@/components/icons/svg-6f4bftszzw";

interface PassengerDetailScreenProps {
  passenger: Passenger;
  trips: Trip[];
  recurrentTrips?: RecurrentTrip[];
  onBack: () => void;
  onSave: (updatedPassenger: Partial<Passenger>) => void;
  onCreateTrip?: () => void;
  onCreateRecurrentTrip?: () => void;
  onEditRecurrentTrip?: (recurrentTrip: RecurrentTrip) => void;
  onDelete?: () => void;
}

export function PassengerDetailScreen({
  passenger,
  trips,
  recurrentTrips = [],
  onBack,
  onSave,
  onCreateTrip,
  onCreateRecurrentTrip,
  onEditRecurrentTrip,
  onDelete,
}: PassengerDetailScreenProps) {
  const [formData, setFormData] = useState({
    firstName: passenger.name.split(" ")[0] || "",
    lastName:
      passenger.name.split(" ").slice(1).join(" ") || "",
    dateOfBirth: passenger.dateOfBirth || "20/05/1998",
    phone: passenger.phone,
    email: passenger.email || "david@free-now.com",
    homeAddress: passenger.homeAddress || "Berlin Wall Memorial, Bernauer Straße, Berlin, Germany",
    notes: passenger.notes || "",
    insuranceCompany: passenger.insuranceCompany || "Sanitas",
    patientNumber: passenger.patientNumber || "1212121",
    purpose: passenger.purpose,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const insuranceOptions: SelectOption[] = [
    { value: "sanitas", label: "Sanitas" },
    { value: "axa", label: "AXA" },
    { value: "allianz", label: "Allianz" },
  ];

  const handleCancel = () => {
    onBack();
  };

  const handleSave = () => {
    onSave({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      purpose: formData.purpose,
    });
  };

  // Filter trips for this passenger
  const passengerTrips = trips.filter(
    (trip) => trip.passengerId === passenger.id,
  );

  // Calculate trip statistics
  const ongoingTrips = passengerTrips.filter(
    (t) => t.status === "In Progress",
  ).length;
  const prebookedTrips = passengerTrips.filter(
    (t) => t.status === "Pending",
  ).length;
  const cancelledTrips = passengerTrips.filter(
    (t) => t.status === "Cancelled",
  ).length;
  const completedTrips = passengerTrips.filter(
    (t) => t.status === "Completed",
  ).length;

  const filteredItems = passengerTrips.filter((trip) => {
    const matchesSearch =
      trip.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driverId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = !activeFilter || trip.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 lg:pb-10">
      <div className="p-4 md:p-6 lg:p-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="bg-[#f1f1f1] h-14 px-6 rounded-[var(--radius)] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors mb-6"
        >
          <ArrowLeft className="size-5" />
          <span className="text-[16px]">
            Zurück zu Fahrgästen
          </span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Column - Passenger Account Form */}
          <div className="bg-[var(--surface)] border border-black/5 shadow-sm rounded-[24px] p-6 w-full lg:max-w-[688px] lg:min-w-[688px]">
            <h1 className="text-[28px] mb-6">
              Fahrgastkonto
            </h1>

            {/* Personal Details */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-4">
                Persönliche Angaben
              </h3>

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
                  />
                </div>
              </div>

              <div className="flex gap-2">
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
                  />
                </div>
                <div className="flex-1 opacity-0">
                  <TextField
                    label="Hidden"
                    value=""
                    onChange={() => { }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-4">
                Kontaktinformationen
              </h3>

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
                />
              </div>

              <div className="h-[120px]">
                <textarea
                  placeholder="Notizen (optional)"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full h-full bg-transparent border border-[#777777] rounded-[var(--radius)] px-6 py-4 resize-none text-[16px] text-[#5e5e5e] placeholder:text-[#5e5e5e] focus:outline-none focus:border-[#1b1b1b]"
                />
              </div>
            </div>

            {/* Healthcare & Insurance Information */}
            <div className="mb-6">
              <h3 className="text-[16px] mb-4">
                Gesundheit & Versicherungsinformationen
              </h3>

              <div className="mb-4">
                <SelectField
                  label="Versicherungsunternehmen"
                  value={formData.insuranceCompany.toLowerCase()}
                  options={insuranceOptions}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      insuranceCompany: value,
                    })
                  }
                />
              </div>

              <div>
                <TextField
                  label="Patientennummer"
                  value={formData.patientNumber}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      patientNumber: value,
                    })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-8 justify-end">
              <button
                onClick={onDelete}
                className="bg-white border border-[#e2e2e2] h-14 px-6 rounded-[var(--radius)] hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2 mr-auto"
              >
                <Trash2 className="size-5 text-red-500" />
                <span className="text-[16px] text-red-500 font-medium">Löschen</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-[#f1f1f1] h-14 px-6 rounded-[var(--radius)] hover:bg-[var(--color-surface-variant)] transition-colors"
              >
                <span className="text-[16px]">Abbrechen</span>
              </button>
              <button
                onClick={handleSave}
                className="bg-[#e80046] h-14 px-6 rounded-[var(--radius)] hover:opacity-90 transition-opacity"
              >
                <span className="text-[16px] text-white">
                  Änderungen speichern
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Trips */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {/* Recurrent Trips */}
            <div className="bg-[var(--surface)] border border-black/5 shadow-sm rounded-[24px] p-6 h-[512px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[24px] font-semibold">Trips</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onCreateTrip}
                    className="bg-[#f1efef] h-12 px-4 rounded-[12px] flex items-center gap-2 hover:bg-[#e2e2e2] transition-colors"
                  >
                    <Calendar className="size-5" />
                    <span className="text-[14px] font-medium">Neuer Trip</span>
                  </button>
                  <button
                    onClick={onCreateRecurrentTrip}
                    className="bg-[#f1efef] h-12 px-4 rounded-[12px] flex items-center gap-2 hover:bg-[#e2e2e2] transition-colors"
                  >
                    <RotateCcw className="size-5" />
                    <span className="text-[14px] font-medium">Wiederkehrend</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="bg-[#f1f1f1] rounded-[var(--radius)] px-8 py-4 flex items-center gap-3 w-[360px] ml-auto">
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      d={svgPaths.p16b4a380}
                      fill="#5e5e5e"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Suche Buchung"
                    className="bg-transparent outline-none flex-1 text-[16px] text-[#5e5e5e] placeholder:text-[#5e5e5e]"
                  />
                </div>
              </div>

              {/* Trips Table Header */}
              <div className="overflow-y-auto flex-1">
                <div className="min-w-full">
                  <div className="flex gap-2 h-10 items-center border-b border-[#e2e2e2] bg-[#fcfcfc] sticky top-0 z-10">
                    <div className="flex-1 px-4">
                      <p className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider">Titel</p>
                    </div>
                    <div className="w-[120px] px-4">
                      <p className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider">Typ</p>
                    </div>
                    <div className="w-[144px] px-4">
                      <p className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider">Zeitplan</p>
                    </div>
                    <div className="w-[80px] px-4 text-right">
                      <p className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider">Aktion</p>
                    </div>
                  </div>

                  {/* Recurrent Trips Rows */}
                  {recurrentTrips
                    .filter(
                      (rt) => rt.passengerId === passenger.id,
                    )
                    .map((row, index) => {
                      const dayLabels = [
                        "M",
                        "T",
                        "W",
                        "R",
                        "F",
                        "S",
                        "U",
                      ];
                      const daysDisplay = row.daysOfWeek
                        .map((d) => dayLabels[d])
                        .join(", ");
                      return (
                        <div
                          key={row.id}
                          className="flex gap-2 h-12 items-center border-b border-[#e2e2e2] hover:bg-[var(--color-surface-variant)]/30"
                        >
                          <div className="flex-1 px-4">
                            <p className="text-[16px]">
                              {row.title}
                            </p>
                          </div>
                          <div className="w-[144px] px-4">
                            <span className="text-[14px] leading-5">
                              Recurrent
                            </span>
                          </div>
                          <div className="w-[144px] px-4">
                            <p className="text-[16px]">
                              {daysDisplay}
                            </p>
                          </div>
                          <div className="w-[104px] px-4 flex gap-1">
                            <button
                              onClick={() =>
                                onEditRecurrentTrip?.(row)
                              }
                              className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]"
                            >
                              <Pen className="size-5 text-[#5e5e5e]" />
                            </button>
                            <button className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                              <Trash2 className="size-5 text-[#5e5e5e]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {/* One-time Trips Rows - Show trips with additional details */}
                  {passengerTrips
                    .filter((trip) => trip.tripTitle || trip.tripType || trip.insuranceCompany)
                    .map((trip, index) => {
                      const displayTitle = trip.tripTitle || `${trip.pickup} → ${trip.dropoff}`;
                      const tripTypeLabel = trip.tripType === 'krankenfahrten' ? 'Krankenfahrten' : trip.tripType || '-';

                      return (
                        <div
                          key={trip.id}
                          className="flex gap-2 h-12 items-center border-b border-[#e2e2e2] hover:bg-[var(--color-surface-variant)]/30"
                        >
                          <div className="flex-1 px-4">
                            <p className="text-[16px] truncate">
                              {displayTitle}
                            </p>
                          </div>
                          <div className="w-[144px] px-4">
                            <span className="text-[14px] leading-5">
                              One-time
                            </span>
                          </div>
                          <div className="w-[144px] px-4">
                            <p className="text-[16px]">
                              {trip.date || '-'} {trip.time}
                            </p>
                          </div>
                          <div className="w-[104px] px-4 flex gap-1">
                            <button className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                              <Pen className="size-5 text-[#5e5e5e]" />
                            </button>
                            <button className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                              <Trash2 className="size-5 text-[#5e5e5e]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Trip Rows */}
            {/* Content omitted for brevity in this chunk, will be handled in a full file update if necessary, but focusing on the main structure first */}
          </div>
        </div>
      </div>

      {/* Trips Activity */}
      <div className="bg-[var(--surface)] border border-black/5 shadow-sm rounded-[24px] p-6 h-[600px] flex flex-col mx-4 md:mx-6 lg:mx-10 mt-6 mb-10">
        <h2 className="text-[24px] font-semibold mb-6">Trips activity</h2>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 items-center mb-6">
          {[
            { label: "Ongoing", count: ongoingTrips, value: "In Progress", color: "text-blue-600 bg-blue-50" },
            { label: "Prebooked", count: prebookedTrips, value: "Pending", color: "text-amber-600 bg-amber-50" },
            { label: "Cancelled", count: cancelledTrips, value: "Cancelled", color: "text-red-600 bg-red-50" },
            { label: "Completed", count: completedTrips, value: "Completed", color: "text-green-600 bg-green-50" }
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => setActiveFilter(activeFilter === chip.value ? null : chip.value)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all border ${activeFilter === chip.value
                ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                : "border-transparent bg-[#f1efef] hover:bg-[#e2e2e2]"
                }`}
            >
              <span className={`text-[14px] font-medium`}>
                <span className="opacity-60 mr-1">{chip.count}</span> {chip.label}
              </span>
            </button>
          ))}

          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-[13px] text-muted-foreground hover:text-foreground flex items-center gap-1 ml-2"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="bg-[#f1efef] rounded-[12px] px-4 h-12 flex items-center gap-3 w-full max-w-[360px]">
            <Search className="size-5 text-[#5e5e5e]" />
            <input
              type="text"
              placeholder="Search trips"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-[15px] text-[#1e1a1a] placeholder:text-[#5e5e5e]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={16} className="text-[#5e5e5e]" />
              </button>
            )}
          </div>
        </div>

        {/* Trips Table */}
        <div className="overflow-y-auto flex-1">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="flex gap-2 h-10 items-center border-b border-[#e2e2e2] bg-[#fcfcfc] sticky top-0 z-10">
              <div className="w-[100px] px-4">
                <p className="text-[13px] font-medium text-muted-foreground uppercase">Time</p>
              </div>
              <div className="w-[120px] px-4 text-center">
                <p className="text-[13px] font-medium text-muted-foreground uppercase">Status</p>
              </div>
              <div className="w-[100px] px-4">
                <p className="text-[13px] font-medium text-muted-foreground uppercase">Driver</p>
              </div>
              <div className="flex-1 px-4">
                <p className="text-[13px] font-medium text-muted-foreground uppercase">Pickup</p>
              </div>
              <div className="flex-1 px-4">
                <p className="text-[13px] font-medium text-muted-foreground uppercase">Dropoff</p>
              </div>
            </div>

            {/* Trip Rows */}
            {filteredItems.map((trip) => (
              <div
                key={trip.id}
                className="flex gap-2 min-h-[48px] py-1 items-center border-b border-[#f1f1f1] hover:bg-[#fcfcfc] transition-colors"
              >
                <div className="w-[100px] px-4">
                  <p className="text-[15px]">{trip.time}</p>
                </div>
                <div className="w-[120px] px-4 text-center">
                  <span className={`text-[12px] px-2 py-1 rounded-[4px] font-medium ${trip.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                    trip.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      trip.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                    {trip.status}
                  </span>
                </div>
                <div className="w-[100px] px-4">
                  <span className="text-[15px] font-mono">{trip.driverId}</span>
                </div>
                <div className="flex-1 px-4 overflow-hidden">
                  <p className="text-[14px] truncate text-[#1e1a1a]" title={trip.pickup}>{trip.pickup}</p>
                </div>
                <div className="flex-1 px-4 overflow-hidden">
                  <p className="text-[14px] truncate text-[#1e1a1a]" title={trip.dropoff}>{trip.dropoff}</p>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p>No trips found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}