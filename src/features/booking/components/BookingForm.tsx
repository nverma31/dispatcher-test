import { useState, useEffect } from "react";
import { Button } from "@/components/ds/button";
import {
  CreditCard,
  MapPin,
  Navigation,
  RotateCcw,
  ChevronUp,
} from "lucide-react";
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { DateInput } from "./DateInput";
import { TimeInput } from "./TimeInput";
import { AddressLookupField } from "./AddressLookupField";
import { TextField } from "@/components/ds/text-field";
import { Checkbox } from "@/components/ds/checkbox";
import { LocationData, BookingData } from "@/types";
import { toast } from "sonner@2.0.3";

interface BookingFormProps {
  onCreateBooking: (bookingData: BookingData) => void;
  pickupLocation: LocationData | null;
  dropoffLocation: LocationData | null;
  onLocationUpdate: (
    type: "pickup" | "dropoff",
    locationData: LocationData,
  ) => void;
  onCreateRecurrentTrip?: () => void;
}

export function BookingForm({
  onCreateBooking,
  pickupLocation,
  dropoffLocation,
  onLocationUpdate,
  onCreateRecurrentTrip,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    date: "13/09/2025",
    time: "18:17",
    passengerPhone: "+49 123 456789",
    passengerName: "Leo",
    pickup: "",
    dropoff: "",
    payment: "pay_driver",
    costCenter: "marketing",
    fleet: "fleet_01",
    vehicle: "",
    driverId: "",
    customPrice: "",
    notes: "",
    tripType: "krankenfahrten",
    tripTitle: "Post-surgery trip",
    linkedRecurrentTrip: "",
    insuranceCompany: "",
    insuranceNumber: "",
    exemptionCoPayment: false,
    m4Approved: false,
  });

  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] =
    useState(false);

  // Sync location data with form when locations are selected from map
  useEffect(() => {
    if (pickupLocation) {
      setFormData((prev) => ({
        ...prev,
        pickup: pickupLocation.address,
      }));
    }
  }, [pickupLocation?.address]);

  useEffect(() => {
    if (dropoffLocation) {
      setFormData((prev) => ({
        ...prev,
        dropoff: dropoffLocation.address,
      }));
    }
  }, [dropoffLocation?.address]);

  // Dropdown options
  const paymentOptions = [
    { value: "pay_driver", label: "Fahrer direkt bezahlen" },
    { value: "card", label: "Karte" },
  ];

  const costCenterOptions = [{ value: "None", label: "Keine" }];

  const fleetOptions = [
    { value: "fleet_01", label: "FreeNow Flotte" },
    { value: "fleet_02", label: "Eigene Flotte" },
  ];

  const vehicleOptions = [
    { value: "no_vehicles", label: "Kein Fahrzeug verfügbar" },
  ];

  const tripTypeOptions = [
    { value: "krankenfahrten", label: "Krankenfahrten" },
    { value: "other", label: "Sonstige" },
  ];

  const recurrentTripOptions = [
    { value: "", label: "Keine" },
    { value: "trip1", label: "Physiotherapie mit Dr. Rey" },
    { value: "trip2", label: "Psychologe mit Dr. Morales" },
  ];

  const clearForm = () => {
    setFormData({
      date: "Today",
      time: "Now",
      passengerPhone: "",
      passengerName: "",
      pickup: "",
      dropoff: "",
      payment: "pay_driver",
      costCenter: "",
      fleet: "fleet_01",
      vehicle: "",
      driverId: "",
      customPrice: "",
      notes: "",
      tripType: "krankenfahrten",
      tripTitle: "Post-surgery trip",
      linkedRecurrentTrip: "",
      insuranceCompany: "",
      insuranceNumber: "",
      exemptionCoPayment: false,
      m4Approved: false,
    });
  };

  const createBooking = () => {
    console.log("Creating booking with data:", {
      formData,
      pickupLocation,
      dropoffLocation,
    });

    // Basic validation - check both formData and location objects
    const missingFields = [];

    if (!formData.passengerName)
      missingFields.push("Name des Fahrgasts");
    if (!formData.passengerPhone)
      missingFields.push("Telefonnummer");
    if (!pickupLocation || !pickupLocation.address)
      missingFields.push("Abholadresse");
    if (!dropoffLocation || !dropoffLocation.address)
      missingFields.push("Zieladresse");

    if (missingFields.length > 0) {
      const errorMsg = `Bitte füllen Sie alle erforderlichen Felder aus: ${missingFields.join(", ")}`;
      console.error("Validation failed:", errorMsg);
      toast.error("Validierungsfehler", {
        description: errorMsg,
        duration: 5000,
      });
      return;
    }

    // Ensure formData has the latest pickup/dropoff addresses
    const bookingDataToSubmit = {
      ...formData,
      pickup: pickupLocation.address,
      dropoff: dropoffLocation.address,
    };

    try {
      console.log("Submitting booking:", bookingDataToSubmit);
      // Call the parent's function to add the booking
      onCreateBooking(bookingDataToSubmit);

      // Show success message
      toast.success("Fahrt erfolgreich erstellt!", {
        description: `Fahrt von ${pickupLocation.address} nach ${dropoffLocation.address} wurde gebucht.`,
        duration: 4000,
      });

      console.log(
        "Booking created successfully:",
        bookingDataToSubmit,
      );
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Fehler beim Erstellen der Fahrt", {
        description:
          error instanceof Error
            ? error.message
            : "Ein unbekannter Fehler ist aufgetreten",
        duration: 5000,
      });
    }
  };

  return (
    <div className="bg-[var(--color-surface-highest)] rounded-[var(--radius-card)] p-4 md:p-6 w-full lg:max-w-[800px] lg:min-w-[632px]">
      <h1 className="mb-4 md:mb-6">Fahrt buchen</h1>

      <div className="space-y-4 md:space-y-6">
        {/* Time & Date */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="min-w-[140px] sm:min-w-[184px] flex-1 sm:flex-none">
              <DateInput
                label="Datum"
                value={formData.date}
                onChange={(value) =>
                  setFormData({ ...formData, date: value })
                }
              />
            </div>

            <div className="w-28 sm:w-36">
              <TimeInput
                label="Zeit"
                value={formData.time}
                onChange={(value) =>
                  setFormData({ ...formData, time: value })
                }
              />
            </div>
          </div>

          <button
            onClick={onCreateRecurrentTrip}
            className="bg-[var(--color-neutral-95)] box-border content-stretch flex flex-col gap-2 h-12 sm:h-14 items-center justify-center overflow-clip px-4 sm:px-6 py-3 sm:py-4 relative rounded-[var(--radius)] shrink-0 w-full sm:w-auto hover:opacity-80 transition-opacity"
          >
            <div className="content-stretch flex gap-2 items-center justify-center overflow-clip relative shrink-0 w-full">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[var(--color-on-surface)]">
                <p className="leading-[24px] whitespace-pre text-sm sm:text-base">
                  Neue wiederkehrende Fahrt
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Passenger Details */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <TextField
              label="Telefonnummer des Fahrgasts"
              value={formData.passengerPhone}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  passengerPhone: value,
                })
              }
              type="tel"
            />
          </div>

          <div className="flex-1">
            <TextField
              label="Name des Fahrgasts"
              value={formData.passengerName}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  passengerName: value,
                })
              }
            />
          </div>
        </div>

        {/* Pickup & Dropoff - Google Maps Address Lookup */}
        <div className="space-y-4">
          <AddressLookupField
            id="pickup"
            label="Abholadresse"
            placeholder="Nach Abholadresse suchen..."
            value={pickupLocation}
            onChange={(location) =>
              onLocationUpdate("pickup", location)
            }
          />

          <AddressLookupField
            id="dropoff"
            label="Zieladresse"
            placeholder="Nach Zieladresse suchen..."
            value={dropoffLocation}
            onChange={(location) =>
              onLocationUpdate("dropoff", location)
            }
          />
        </div>

        {/* Payment Details */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <SelectField
              label="Zahlung"
              value={formData.payment}
              options={paymentOptions}
              onChange={(value) =>
                setFormData({ ...formData, payment: value })
              }
              slotLeft={
                <CreditCard className="w-6 h-6 text-[var(--color-on-surface-variant)]" />
              }
            />
          </div>

          <div className="flex-1">
            <SelectField
              label="Kostenstelle"
              value={formData.costCenter}
              options={costCenterOptions}
              onChange={(value) =>
                setFormData({ ...formData, costCenter: value })
              }
            />
          </div>
        </div>

        {/* Fleet & Driver Details */}
        <div className="space-y-2">
          <SelectField
            label="Flotte"
            value={formData.fleet}
            options={fleetOptions}
            onChange={(value) =>
              setFormData({ ...formData, fleet: value })
            }
          />

          <SelectField
            label="Fahrzeug"
            value={formData.vehicle}
            options={vehicleOptions}
            onChange={(value) =>
              setFormData({ ...formData, vehicle: value })
            }
            placeholder="Fahrzeug auswählen"
          />

          <div className="flex flex-col sm:flex-row gap-2">
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
                  setFormData({
                    ...formData,
                    customPrice: value,
                  })
                }
              />
            </div>
          </div>

          {/* Notes Field */}
          <TextField
            label="Notiz für Fahrer (optional)"
            value={formData.notes}
            onChange={(value) =>
              setFormData({ ...formData, notes: value })
            }
          />
        </div>

        {/* Additional Options */}
        <div>
          {/* Header with Toggle */}
          <button
            onClick={() =>
              setIsAdditionalOptionsOpen(
                !isAdditionalOptionsOpen,
              )
            }
            className="flex items-center gap-2 h-14 group"
            type="button"
          >
            <h3 className="text-[20px]">Zusätzliche Optionen</h3>
            <ChevronUp
              className={`w-6 h-6 transition-transform ${isAdditionalOptionsOpen ? "" : "rotate-180"
                }`}
            />
          </button>

          {/* Collapsible Content */}
          {isAdditionalOptionsOpen && (
            <div className="space-y-2 mt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <SelectField
                    label="Typ"
                    value={formData.tripType}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        tripType: value,
                      })
                    }
                    options={tripTypeOptions}
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Titel (optional)"
                    value={formData.tripTitle}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        tripTitle: value,
                      })
                    }
                    placeholder=""
                  />
                </div>
              </div>

              <SelectField
                label="Mit wiederkehrender Fahrt verknüpfen (optional)"
                value={formData.linkedRecurrentTrip}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    linkedRecurrentTrip: value,
                  })
                }
                options={recurrentTripOptions}
                placeholder=""
              />

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <TextField
                    label="Versicherungsgesellschaft (optional)"
                    value={formData.insuranceCompany}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        insuranceCompany: value,
                      })
                    }
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Versicherungsnummer (optional)"
                    value={formData.insuranceNumber}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        insuranceNumber: value,
                      })
                    }
                    placeholder=""
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.exemptionCoPayment}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        exemptionCoPayment: checked === true,
                      })
                    }
                  />
                  <span className="text-[16px] select-none">
                    Befreiung von Zuzahlung
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.m4Approved}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        m4Approved: checked === true,
                      })
                    }
                  />
                  <span className="text-[16px] select-none">
                    M4 von Krankenkasse genehmigt
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={clearForm}
            className="bg-[var(--color-neutral-95)] hover:bg-[var(--color-neutral-90)]"
          >
            Formular löschen
          </Button>
          <Button
            onClick={createBooking}
            className="bg-[var(--color-red-50)] text-white hover:bg-[var(--color-red-40)]"
          >
            Buchung erstellen
          </Button>
        </div>
      </div>
    </div>
  );
}