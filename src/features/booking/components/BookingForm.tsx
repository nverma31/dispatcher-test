import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ds/button";
// Dropdown select icon (from icons/dropdown select.svg)
const DropdownSelectIcon = ({ open }: { open: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition-transform ${open ? "rotate-180" : ""}`}
    aria-hidden
  >
    <path d="M11.2487 15.6585C11.6471 16.1138 12.3555 16.1138 12.7539 15.6585L17.5501 10.1771C18.1159 9.53048 17.6567 8.51855 16.7975 8.51855L7.20507 8.51855C6.34591 8.51855 5.88673 9.53048 6.45249 10.1771L11.2487 15.6585Z" fill="currentColor" />
  </svg>
);

// Inline SVG icons from the project icon folder
const EventRepeatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4.16667 18.3337C3.70833 18.3337 3.31597 18.1705 2.98958 17.8441C2.66319 17.5177 2.5 17.1253 2.5 16.667V5.00033C2.5 4.54199 2.66319 4.14963 2.98958 3.82324C3.31597 3.49685 3.70833 3.33366 4.16667 3.33366H5V1.66699H6.66667V3.33366H13.3333V1.66699H15V3.33366H15.8333C16.2917 3.33366 16.684 3.49685 17.0104 3.82324C17.3368 4.14963 17.5 4.54199 17.5 5.00033V10.0003H15.8333V8.33366H4.16667V16.667H10V18.3337H4.16667ZM15.8333 20.0003C14.8194 20.0003 13.934 19.6844 13.1771 19.0524C12.4201 18.4205 11.9444 17.6253 11.75 16.667H13.0417C13.2222 17.2781 13.566 17.7781 14.0729 18.167C14.5799 18.5559 15.1667 18.7503 15.8333 18.7503C16.6389 18.7503 17.3264 18.4656 17.8958 17.8962C18.4653 17.3267 18.75 16.6392 18.75 15.8337C18.75 15.0281 18.4653 14.3406 17.8958 13.7712C17.3264 13.2017 16.6389 12.917 15.8333 12.917C15.4306 12.917 15.0556 12.9899 14.7083 13.1357C14.3611 13.2816 14.0556 13.4864 13.7917 13.7503H15V15.0003H11.6667V11.667H12.9167V12.8545C13.2917 12.4934 13.7292 12.2052 14.2292 11.9899C14.7292 11.7746 15.2639 11.667 15.8333 11.667C16.9861 11.667 17.9688 12.0732 18.7813 12.8857C19.5938 13.6982 20 14.6809 20 15.8337C20 16.9864 19.5938 17.9691 18.7813 18.7816C17.9688 19.5941 16.9861 20.0003 15.8333 20.0003ZM4.16667 6.66699H15.8333V5.00033H4.16667V6.66699Z" fill="currentColor" />
  </svg>
);

const ReverseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M6.76013 5.55091L4.76898 7.53525C4.55939 7.74412 4.31486 7.84421 4.0354 7.83551C3.75594 7.82681 3.51141 7.71801 3.30182 7.50914C3.10969 7.30026 3.00926 7.05657 3.00052 6.77807C2.99179 6.49956 3.09222 6.25587 3.30182 6.047L7.07452 2.28721C7.17932 2.18277 7.29285 2.10879 7.41511 2.06527C7.53738 2.02176 7.66838 2 7.80811 2C7.94783 2 8.07883 2.02176 8.2011 2.06527C8.32336 2.10879 8.43689 2.18277 8.54169 2.28721L12.3144 6.047C12.5065 6.23847 12.6026 6.47781 12.6026 6.76501C12.6026 7.05222 12.5065 7.30026 12.3144 7.50914C12.1048 7.71802 11.8559 7.82245 11.5677 7.82245C11.2795 7.82245 11.0306 7.71802 10.821 7.50914L8.85608 5.55091L8.85608 20.3551C8.85608 20.651 8.75565 20.899 8.55479 21.0992C8.35392 21.2994 8.10503 21.3995 7.8081 21.3995C7.51118 21.3995 7.26228 21.2994 7.06142 21.0992C6.86056 20.899 6.76013 20.651 6.76013 20.3551L6.76013 5.55091ZM15.1439 18.4491L15.1439 3.64491C15.1439 3.349 15.2444 3.10096 15.4452 2.90078C15.6461 2.70061 15.895 2.60052 16.1919 2.60052C16.4888 2.60052 16.7377 2.70061 16.9386 2.90078C17.1394 3.10096 17.2399 3.349 17.2399 3.64491L17.2399 18.4491L19.231 16.4648C19.4406 16.2559 19.6851 16.1558 19.9646 16.1645C20.2441 16.1732 20.4886 16.282 20.6982 16.4909C20.8903 16.6997 20.9907 16.9434 20.9995 17.2219C21.0082 17.5004 20.9078 17.7441 20.6982 17.953L16.9255 21.7128C16.8207 21.8172 16.7071 21.8912 16.5849 21.9347C16.4626 21.9782 16.3316 22 16.1919 22C16.0522 22 15.9212 21.9782 15.7989 21.9347C15.6766 21.8912 15.5631 21.8172 15.4583 21.7128L11.6856 17.953C11.4935 17.7615 11.3974 17.5222 11.3974 17.235C11.3974 16.9478 11.4935 16.6997 11.6856 16.4909C11.8952 16.282 12.1441 16.1775 12.4323 16.1775C12.7205 16.1775 12.9694 16.282 13.179 16.4909L15.1439 18.4491Z" fill="currentColor" />
  </svg>
);

const XCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 13.4L14.9 16.3C15.0833 16.4833 15.3167 16.575 15.6 16.575C15.8833 16.575 16.1167 16.4833 16.3 16.3C16.4833 16.1167 16.575 15.8833 16.575 15.6C16.575 15.3167 16.4833 15.0833 16.3 14.9L13.4 12L16.3 9.1C16.4833 8.91667 16.575 8.68333 16.575 8.4C16.575 8.11667 16.4833 7.88333 16.3 7.7C16.1167 7.51667 15.8833 7.425 15.6 7.425C15.3167 7.425 15.0833 7.51667 14.9 7.7L12 10.6L9.1 7.7C8.91667 7.51667 8.68333 7.425 8.4 7.425C8.11667 7.425 7.88333 7.51667 7.7 7.7C7.51667 7.88333 7.425 8.11667 7.425 8.4C7.425 8.68333 7.51667 8.91667 7.7 9.1L10.6 12L7.7 14.9C7.51667 15.0833 7.425 15.3167 7.425 15.6C7.425 15.8833 7.51667 16.1167 7.7 16.3C7.88333 16.4833 8.11667 16.575 8.4 16.575C8.68333 16.575 8.91667 16.4833 9.1 16.3L12 13.4ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="currentColor" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5973 8.70588C14.0622 8.70588 13.6283 8.2845 13.6283 7.7647C13.6283 7.24491 14.0622 6.82353 14.5973 6.82353L19.927 6.82353L18.7835 5.49075C18.2756 4.89876 18.709 4 19.5024 4C19.7722 4 20.0289 4.11314 20.2066 4.31038L22.7602 7.14494C23.0799 7.49978 23.0799 8.02963 22.7602 8.38447L20.2066 11.219C20.0289 11.4163 19.7722 11.5294 19.5024 11.5294C18.709 11.5294 18.2756 10.6306 18.7835 10.0387L19.927 8.70588L14.5973 8.70588ZM2 8.70588C2 7.66629 2.8677 6.82353 3.93805 6.82353H10.7212C11.2564 6.82353 11.6903 7.24491 11.6903 7.76471C11.6903 8.28451 11.2564 8.70588 10.7212 8.70588H5.87611C5.87611 9.74548 5.00841 10.5882 3.93805 10.5882V18.1176H17.5044C17.5044 17.0781 18.3721 16.2353 19.4425 16.2353V14.3529C19.4425 13.8331 19.8763 13.4118 20.4115 13.4118C20.9467 13.4118 21.3805 13.8331 21.3805 14.3529V18.1176C21.3805 19.1572 20.5128 20 19.4425 20H3.93805C2.8677 20 2 19.1572 2 18.1176V8.70588ZM11.6903 16.2353C13.2958 16.2353 14.5973 14.9712 14.5973 13.4118C14.5973 11.8524 13.2958 10.5882 11.6903 10.5882C10.0847 10.5882 8.78319 11.8524 8.78319 13.4118C8.78319 14.9712 10.0847 16.2353 11.6903 16.2353Z" fill="currentColor" />
  </svg>
);
import { SelectField, SelectOption } from "@/components/ds/select-field";
import { DateInput } from "./DateInput";
import { TimeInput } from "./TimeInput";
import { AddressLookupField } from "./AddressLookupField";
import { TextField } from "@/components/ds/text-field";
import { Checkbox } from "../../../components/ds/checkbox";
import { Switch } from "../../../components/ds/switch";
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
  prefilledDriverId?: string;
}

export function BookingForm({
  onCreateBooking,
  pickupLocation,
  dropoffLocation,
  onLocationUpdate,
  onCreateRecurrentTrip,
  prefilledDriverId,
}: BookingFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    date: "13/09/2025",
    time: "18:17",
    passengerPhone: "",
    passengerName: "",
    pickup: "",
    dropoff: "",
    payment: "pay_driver",
    costCenter: "None",
    fleet: "fleet_01",
    vehicle: "",
    driverId: "",
    customPrice: "",
    notes: "",
    tripType: "other",
    tripTitle: "",
    linkedRecurrentTrip: "",
    insuranceCompany: "",
    insuranceNumber: "",
    exemptionCoPayment: false,
    m4Approved: false,
  });

  // Effect to handle prefilled driver ID from map marker click
  useEffect(() => {
    if (prefilledDriverId) {
      setFormData((prev) => ({
        ...prev,
        driverId: prefilledDriverId,
      }));
      setIsAdditionalOptionsOpen(true);
      toast.info("Fahrzeug ausgewählt", {
        description: `Fahrer-ID ${prefilledDriverId} wurde übernommen.`,
        duration: 3000,
      });
    }
  }, [prefilledDriverId]);

  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] =
    useState(false);

  // Refs for hotkeys
  const phoneRef = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const pickupRef = useRef<any>(null);
  const dropoffRef = useRef<any>(null);

  const focusField = (ref: React.RefObject<any>) => {
    const el = ref.current;
    if (!el) return;

    // If the ref is already an input or textarea, focus it directly
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      (el as HTMLElement).focus();
    } else {
      // Otherwise, query inside the wrapper for the input element
      const input = el.querySelector('input, textarea') as HTMLElement | null;
      if (input) {
        input.focus();
      } else {
        el.focus(); // Fallback
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if any of the hotkey function keys are pressed
      if (['F1', 'F2', 'F3', 'F4', 'F5', 'F8'].includes(e.key)) {
        e.preventDefault(); // Prevent default browser behavior

        switch (e.key) {
          case 'F1':
            createBooking();
            break;
          case 'F2':
            focusField(phoneRef);
            break;
          case 'F3':
            focusField(nameRef);
            break;
          case 'F4':
            focusField(pickupRef);
            break;
          case 'F5':
            focusField(dropoffRef);
            break;
          case 'F8':
            clearForm();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, pickupLocation, dropoffLocation]); // Include dependencies used in createBooking & clearForm

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
    { value: "pay_driver", label: t('dispatch.payDriver') },
    { value: "card", label: "Karte" },
  ];

  const costCenterOptions = [{ value: "None", label: t('dispatch.none') }];

  const fleetOptions = [
    { value: "fleet_01", label: "FreeNow Flotte" },
    { value: "fleet_02", label: "Eigene Flotte" },
  ];

  const vehicleOptions = useMemo(() => {
    return dropoffLocation && dropoffLocation.address ? [
      {
        value: "taxi_5min",
        label: "Taxi in 5 min \u20ac54.60",
        node: (
          <div className="flex justify-between items-center w-full min-w-[300px]">
            <div><span className="font-medium text-[var(--color-on-surface)]">Taxi</span> <span className="text-[var(--color-on-surface-variant)] text-sm ml-1">in 5 min</span></div>
            <div className="font-medium text-[var(--color-on-surface)]">ca. €14-24</div>
          </div>
        )
      },
      {
        value: "mockfleet_taxi_route_2min",
        label: "MockFleet Taxi with real route in 2 min c. \u20ac15-75",
        node: (
          <div className="flex justify-between items-center w-full min-w-[300px]">
            <div><span className="font-medium text-[var(--color-on-surface)]">Taxi Festpreis</span> <span className="text-[var(--color-on-surface-variant)] text-sm ml-1">in 2 min</span></div>
            <div className="font-medium text-[var(--color-on-surface)]">€15,75</div>
          </div>
        )
      },
      {
        value: "mockfleet_turbo_taxi_2min",
        label: "MockFleet Turbo Taxi in 2 min c. \u20ac10-35",
        node: (
          <div className="flex justify-between items-center w-full min-w-[300px]">
            <div><span className="font-medium text-[var(--color-on-surface)]"> Taxi XL</span> <span className="text-[var(--color-on-surface-variant)] text-sm ml-1">in 2 min</span></div>
            <div className="font-medium text-[var(--color-on-surface)]">ca. €20–35</div>
          </div>
        )
      },
    ] : [
      { value: "no_vehicles", label: t('dispatch.none') },
    ];
  }, [dropoffLocation?.address, t]);

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
      costCenter: "None",
      fleet: "fleet_01",
      vehicle: "",
      driverId: "",
      customPrice: "",
      notes: "",
      tripType: "other",
      tripTitle: "",
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
      missingFields.push(t('dispatch.passengerName'));
    if (!formData.passengerPhone)
      missingFields.push(t('dispatch.passengerPhone'));
    if (!pickupLocation || !pickupLocation.address)
      missingFields.push(t('dispatch.pickup'));
    if (!dropoffLocation || !dropoffLocation.address)
      missingFields.push(t('dispatch.dropoff'));

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
    <div className="bg-[var(--color-surface-highest)] rounded-[var(--radius-card)] p-4 md:p-6 w-full lg:basis-1/2 lg:flex-[1_1_50%]">

      <div className="space-y-2 md:space-y-3">
        {/* Time & Date */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="min-w-[140px] sm:min-w-[184px] flex-1 sm:flex-none">
              <DateInput
                label={t('dispatch.date')}
                value={formData.date}
                onChange={(value) =>
                  setFormData({ ...formData, date: value })
                }
              />
            </div>

            <div className="w-28 sm:w-36">
              <TimeInput
                label={t('dispatch.time')}
                value={formData.time}
                onChange={(value) =>
                  setFormData({ ...formData, time: value })
                }
              />
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={onCreateRecurrentTrip}
            className="h-12 sm:h-14 px-4 sm:px-6 w-full sm:w-auto"
          >
            <EventRepeatIcon />
            <span className="ml-2">{t('dispatch.newRecurrentTrip')}</span>
          </Button>
        </div>

        {/* Passenger Details */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <TextField
              ref={phoneRef}
              label={t('dispatch.passengerPhone')}
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
              ref={nameRef}
              label={t('dispatch.passengerName')}
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

        {/* Medical Trip Toggle */}
        <div className="flex items-center gap-3 py-2">
          <Switch
            checked={formData.tripType === "krankenfahrten"}
            onCheckedChange={(checked: boolean) => {
              setFormData({
                ...formData,
                tripType: checked ? "krankenfahrten" : "other",
              });
              if (checked) setIsAdditionalOptionsOpen(true);
            }}
          />
          <span className="font-['Roboto_Flex:Medium',sans-serif] font-medium text-[16px] text-[var(--color-on-surface)]">
            Medical trip
          </span>
        </div>

        {/* Pickup & Dropoff - Google Maps Address Lookup */}
        <div className="space-y-4">
          <AddressLookupField
            id="pickup"
            ref={pickupRef}
            label={t('dispatch.pickup')}
            value={pickupLocation}
            onChange={(location) =>
              onLocationUpdate("pickup", location)
            }
          />

          <AddressLookupField
            id="dropoff"
            ref={dropoffRef}
            label={t('dispatch.dropoff')}
            value={dropoffLocation}
            onChange={(location) =>
              onLocationUpdate("dropoff", location)
            }
          />
        </div>

        {/* Fleet & Vehicle (Moved up from Additional Options area) */}
        <div className="flex flex-col gap-4">
          <SelectField
            label={t('dispatch.fleet')}
            value={formData.fleet}
            options={fleetOptions}
            onChange={(value: string | number) =>
              setFormData({ ...formData, fleet: value as string })
            }
          />
          <SelectField
            label="Vehicle"
            value={formData.vehicle}
            options={vehicleOptions}
            onChange={(value: string | number) =>
              setFormData({ ...formData, vehicle: value as string })
            }
            placeholder="Vehicle"
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
            <h3 className="text-[20px]">{t('dispatch.additionalOptions')}</h3>
            <DropdownSelectIcon open={isAdditionalOptionsOpen} />
          </button>

          {/* Collapsible Content */}
          {isAdditionalOptionsOpen && (
            <div className="space-y-2 mt-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <TextField
                    label={t('dispatch.driverId')}
                    value={formData.driverId}
                    onChange={(value) =>
                      setFormData({ ...formData, driverId: value as string })
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label={t('dispatch.customPrice')}
                    value={formData.customPrice}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        customPrice: value as string,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <SelectField
                    label={t('dispatch.payment')}
                    value={formData.payment}
                    options={paymentOptions}
                    onChange={(value: string | number) =>
                      setFormData({ ...formData, payment: value as string })
                    }
                    slotLeft={<PaymentIcon />}
                  />
                </div>
                <div className="flex-1">
                  <SelectField
                    label={t('dispatch.costCenter')}
                    value={formData.costCenter}
                    options={costCenterOptions}
                    onChange={(value: string | number) =>
                      setFormData({ ...formData, costCenter: value as string })
                    }
                  />
                </div>
              </div>

              <TextField
                label={t('dispatch.noteToDriver')}
                value={formData.notes}
                onChange={(value) =>
                  setFormData({ ...formData, notes: value as string })
                }
              />

              <TextField
                label={t('passenger.detailsTitle')}
                value={formData.tripTitle}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    tripTitle: value as string,
                  })
                }
                placeholder=""
              />

              <SelectField
                label={t('passenger.recurrentTrips')}
                value={formData.linkedRecurrentTrip}
                onChange={(value: string | number) =>
                  setFormData({
                    ...formData,
                    linkedRecurrentTrip: value as string,
                  })
                }
                options={recurrentTripOptions}
                placeholder=""
              />

              <div className="pt-2 pb-1">
                <h4 className="font-['Roboto_Flex:Medium',sans-serif] font-medium text-[16px] text-[var(--color-on-surface)]">
                  {t('passenger.healthcareInsuranceTitle')}
                </h4>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <TextField
                    label={t('passenger.insuranceCompanyLabel')}
                    value={formData.insuranceCompany}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        insuranceCompany: value as string,
                      })
                    }
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label={t('passenger.insuranceNumber')}
                    value={formData.insuranceNumber}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        insuranceNumber: value as string,
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
                    {t('passenger.exemptFromCopayment')}
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
                    {t('passenger.m4Approved')}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={clearForm}
          >
            <span>{t('dispatch.clearForm')}</span>
          </Button>
          <Button
            onClick={createBooking}
            className="bg-[var(--color-red-50)] text-white hover:bg-[var(--color-red-40)]"
          >
            {t('dispatch.createBooking')}
          </Button>
        </div>
      </div>
    </div>
  );
}