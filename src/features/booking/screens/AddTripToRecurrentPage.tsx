import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { TextField } from "@/components/ds/text-field";
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { TimeInput } from "@/features/booking/components/TimeInput";
import { DateInput } from "@/features/booking/components/DateInput";
import type { RecurrentTrip, Trip } from "../../types";

interface AddTripToRecurrentPageProps {
  recurrentTrip: RecurrentTrip;
  onBack: () => void;
  onSave: (trip: Partial<Trip>) => void;
}

export function AddTripToRecurrentPage({
  recurrentTrip,
  onBack,
  onSave,
}: AddTripToRecurrentPageProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    tripType: "krankenfahrten",
    tripTitle: recurrentTrip.title,
    pickup: recurrentTrip.pickup,
    dropoff: recurrentTrip.dropoff,
    payment: recurrentTrip.payment,
    fleet: recurrentTrip.fleet,
    vehicle: recurrentTrip.vehicle,
    driverId: "",
    customPrice: "",
    notes: "",
    insuranceCompany: recurrentTrip.insuranceCompany,
    insuranceNumber: recurrentTrip.patientNumber,
    exemptionCoPayment: false,
  });

  const tripTypeOptions: SelectOption[] = [
    { value: "krankenfahrten", label: "Krankenfahrten" },
    { value: "business", label: "Geschäftlich" },
    { value: "personal", label: "Persönlich" },
  ];

  const paymentOptions: SelectOption[] = [
    { value: "pay_driver", label: "Fahrer direkt bezahlen" },
    { value: "invoice", label: "Rechnung" },
    { value: "card", label: "Kreditkarte" },
  ];

  const fleetOptions: SelectOption[] = [
    { value: "fleet_01", label: "Flotte 01" },
    { value: "fleet_02", label: "Flotte 02" },
  ];

  const vehicleOptions: SelectOption[] = [
    { value: "taxi", label: "Taxi" },
    { value: "van", label: "Van" },
    { value: "sedan", label: "Sedan" },
  ];

  const insuranceOptions: SelectOption[] = [
    { value: "sanitas", label: "Sanitas" },
    { value: "axa", label: "AXA" },
    { value: "allianz", label: "Allianz" },
  ];

  const handleSubmit = () => {
    const newTrip: Partial<Trip> = {
      id: `trip-${Date.now()}`,
      date: formData.date,
      time: formData.time,
      status: "Pending",
      statusColor: "#f8ecee",
      driverId: formData.driverId || "N/A",
      driverType: "taxi",
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      passenger: "", // Will be set by parent
      phone: "", // Will be set by parent
      passengerId: recurrentTrip.passengerId,
      fleet: formData.fleet,
      vehicle: formData.vehicle,
      payment: formData.payment,
      notes: formData.notes,
      customPrice: formData.customPrice,
      tripType: formData.tripType,
      tripTitle: formData.tripTitle,
      linkedRecurrentTrip: recurrentTrip.id,
      insuranceCompany: formData.insuranceCompany,
      insuranceNumber: formData.insuranceNumber,
      exemptionCoPayment: formData.exemptionCoPayment,
    };

    onSave(newTrip);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-4 md:p-6 lg:p-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="size-5" />
          <span className="text-[16px]">Zurück zu Details wiederkehrender Fahrten</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-[var(--color-surface-highest)] rounded-[24px] p-6 max-w-[480px] mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-[28px]">Neue Fahrt buchen</h2>
          </div>

          {/* Trip Details Section */}
          <div className="mb-6">
            <h3 className="text-[16px] mb-4">Fahrtdetails</h3>

            {/* Date & Time */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <DateInput
                  label="Datum"
                  value={formData.date}
                  onChange={(value) =>
                    setFormData({ ...formData, date: value })
                  }
                />
              </div>
              <div className="w-[144px]">
                <TimeInput
                  label="Zeit"
                  value={formData.time}
                  onChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                />
              </div>
            </div>

            {/* Type & Title */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <SelectField
                  label="Typ"
                  value={formData.tripType}
                  options={tripTypeOptions}
                  onChange={(value) =>
                    setFormData({ ...formData, tripType: value })
                  }
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="Titel"
                  value={formData.tripTitle}
                  onChange={(value) =>
                    setFormData({ ...formData, tripTitle: value })
                  }
                />
              </div>
            </div>

            {/* Pickup */}
            <div className="mb-4">
              <TextField
                label="Abholung"
                value={formData.pickup}
                onChange={(value) =>
                  setFormData({ ...formData, pickup: value })
                }
              />
            </div>

            {/* Dropoff */}
            <div className="mb-4">
              <TextField
                label="Ziel"
                value={formData.dropoff}
                onChange={(value) =>
                  setFormData({ ...formData, dropoff: value })
                }
              />
            </div>

            {/* Payment */}
            <div className="mb-4">
              <SelectField
                label="Zahlung"
                value={formData.payment}
                options={paymentOptions}
                onChange={(value) =>
                  setFormData({ ...formData, payment: value })
                }
              />
            </div>

            {/* Fleet */}
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

            {/* Vehicle */}
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

            {/* Driver ID & Custom Price */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <TextField
                  label="Fahrer-ID (optional)"
                  value={formData.driverId}
                  onChange={(value) =>
                    setFormData({ ...formData, driverId: value })
                  }
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="Benutzerdefinierter Preis (optional)"
                  value={formData.customPrice}
                  onChange={(value) =>
                    setFormData({ ...formData, customPrice: value })
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <TextField
                label="Notiz an Fahrer (optional)"
                value={formData.notes}
                onChange={(value) =>
                  setFormData({ ...formData, notes: value })
                }
              />
            </div>
          </div>

          {/* Healthcare & Insurance Section */}
          <div className="mb-6">
            <h3 className="text-[16px] mb-4">
              Gesundheits- & Versicherungsinformationen
            </h3>

            {/* Insurance Company & Patient Number */}
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
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="Patientennummer"
                  value={formData.insuranceNumber}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      insuranceNumber: value,
                    })
                  }
                />
              </div>
            </div>

            {/* Exempt from co-payment checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="exemptionCoPayment"
                checked={formData.exemptionCoPayment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    exemptionCoPayment: e.target.checked,
                  })
                }
                className="w-6 h-6 rounded border-2 border-[var(--color-outline)] accent-[var(--color-accent)]"
              />
              <label
                htmlFor="exemptionCoPayment"
                className="text-[16px] cursor-pointer"
              >
                Von Zuzahlung befreit
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={onBack}
              className="bg-[#f1f1f1] h-14 px-6 rounded-[var(--radius)] hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              <span className="text-[16px]">Abbrechen</span>
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#e80046] h-14 px-6 rounded-[var(--radius)] hover:opacity-90 transition-opacity"
            >
              <span className="text-[16px] text-white">
                Buchung erstellen
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}