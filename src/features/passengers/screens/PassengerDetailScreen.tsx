import { useState } from "react";
import { experimental } from "@freenow/wave";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Plus,
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

const { Button: WaveButton } = experimental;

// Status badge matching dispatch TripTable (Wave palette tokens)
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    "In Progress": { bg: "var(--palette-marooned-95)", color: "var(--palette-marooned-20)" },
    Arrived: { bg: "var(--palette-marooned-95)", color: "var(--palette-marooned-20)" },
    Approach: { bg: "var(--palette-yellow-95)", color: "var(--palette-yellow-20)" },
    Pending: { bg: "var(--palette-neutral-95)", color: "var(--color-sys-on-surface)" },
    Completed: { bg: "var(--palette-green-95)", color: "var(--palette-green-20)" },
    "Completed by FREENOW": { bg: "var(--palette-green-95)", color: "var(--palette-green-20)" },
    Cancelled: { bg: "var(--color-sys-negative)", color: "var(--color-sys-on-accent)" },
    "No driver": { bg: "var(--color-sys-negative)", color: "var(--color-sys-on-accent)" },
  };
  const s = styles[status] ?? styles["Pending"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 22,
        padding: "0 8px",
        borderRadius: 4,
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "var(--fs-label-2)",
        fontWeight: "var(--fw-label-2)",
        lineHeight: "var(--lh-label-2)",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// Icon button matching dispatch TripTable (40x40, hover background)
function IconBtn({
  children,
  onClick,
  disabled = false,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        borderRadius: 8,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.38 : 1,
        flexShrink: 0,
        color: "var(--color-sys-on-surface-variant)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-sys-surface-container)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}

const SearchSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.14583 15.3708 4.8875 14.1125C3.62917 12.8542 3 11.3167 3 9.5C3 7.68333 3.62917 6.14583 4.8875 4.8875C6.14583 3.62917 7.68333 3 9.5 3C11.3167 3 12.8542 3.62917 14.1125 4.8875C15.3708 6.14583 16 7.68333 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8125 13.5625 12.6875 12.6875C13.5625 11.8125 14 10.75 14 9.5C14 8.25 13.5625 7.1875 12.6875 6.3125C11.8125 5.4375 10.75 5 9.5 5C8.25 5 7.1875 5.4375 6.3125 6.3125C5.4375 7.1875 5 8.25 5 9.5C5 10.75 5.4375 11.8125 6.3125 12.6875C7.1875 13.5625 8.25 14 9.5 14Z" fill="currentColor"/>
</svg>`;

// Inline SVG icon helper
function SvgIcon({ raw, size = 24, className, style }: { raw: string; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0, ...style }}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  );
}

// Custom icon components using SVGs from /src/components/icons/
function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.89474 19.1053H6.24474L16.4526 8.89737L15.1026 7.54737L4.89474 17.7553V19.1053ZM3.94737 21C3.67895 21 3.45395 20.9092 3.27237 20.7276C3.09079 20.5461 3 20.3211 3 20.0526V17.7553C3 17.5026 3.04737 17.2618 3.14211 17.0329C3.23684 16.8039 3.37105 16.6026 3.54474 16.4289L16.4526 3.54474C16.6421 3.37105 16.8513 3.23684 17.0803 3.14211C17.3092 3.04737 17.55 3 17.8026 3C18.0553 3 18.3 3.04737 18.5368 3.14211C18.7737 3.23684 18.9789 3.37895 19.1526 3.56842L20.4553 4.89474C20.6447 5.06842 20.7829 5.27368 20.8697 5.51053C20.9566 5.74737 21 5.98421 21 6.22105C21 6.47368 20.9566 6.71447 20.8697 6.94342C20.7829 7.17237 20.6447 7.38158 20.4553 7.57105L7.57105 20.4553C7.39737 20.6289 7.19605 20.7632 6.96711 20.8579C6.73816 20.9526 6.49737 21 6.24474 21H3.94737ZM15.7658 8.23421L15.1026 7.54737L16.4526 8.89737L15.7658 8.23421Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.91794 22C6.39656 22 5.47666 21.1858 5.4059 19.696L4.82211 7.4136H3.99066C3.43342 7.4136 3 7.01516 3 6.46081C3 5.91511 3.43342 5.51667 3.99066 5.51667H7.74103V4.26072C7.74103 2.81421 8.66093 2 10.3061 2H13.6762C15.3214 2 16.2501 2.81421 16.2501 4.26072V5.51667H20.0005C20.5666 5.51667 21 5.91511 21 6.46081C21 7.01516 20.5754 7.4136 20.0005 7.4136H19.169L18.5941 19.696C18.5233 21.1771 17.5946 22 16.0821 22H7.91794ZM9.77543 4.33001V5.51667H14.2157V4.33001C14.2157 3.95756 13.9504 3.73235 13.5258 3.73235H10.4565C10.0408 3.73235 9.77543 3.95756 9.77543 4.33001ZM8.18329 20.0684H15.8079C16.2767 20.0684 16.5774 19.7566 16.5951 19.2369L17.1435 7.4136H6.82998L7.39607 19.2369C7.4226 19.7479 7.72334 20.0684 8.18329 20.0684ZM9.41278 18.8125C9.0059 18.8125 8.714 18.544 8.70516 18.1455L8.44865 9.39714C8.43096 8.99004 8.70516 8.72152 9.13858 8.72152C9.5543 8.72152 9.84619 8.98138 9.85504 9.38848L10.1204 18.1369C10.1292 18.5353 9.85504 18.8125 9.41278 18.8125ZM11.9956 18.8125C11.5799 18.8125 11.288 18.544 11.288 18.1455V9.37982C11.288 8.98138 11.5799 8.72152 11.9956 8.72152C12.4201 8.72152 12.712 8.98138 12.712 9.37982V18.1455C12.712 18.544 12.4201 18.8125 11.9956 18.8125ZM14.5872 18.8125C14.145 18.8125 13.8708 18.5353 13.8796 18.1369L14.145 9.38848C14.1538 8.98138 14.4369 8.72152 14.8614 8.72152C15.286 8.72152 15.5602 8.99004 15.5514 9.39714L15.286 18.1455C15.2772 18.5526 14.9941 18.8125 14.5872 18.8125Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.5 3C7 3 7.5 3.5 7.5 4C7.5 5.19987 7.70006 6.49969 8 7.59961C8.19998 7.89958 8.09973 8.29962 7.7998 8.59961L5.59961 10.7998C6.99961 13.5998 9.4002 15.9004 12.2002 17.4004L14.4004 15.2002C14.6003 15.0003 14.7999 14.9005 15.0996 14.9004H15.4004C16.5003 15.3003 17.8002 15.5 19 15.5C19.5 15.5 20 16 20 16.5V20C20 20.5 19.5 21 19 21C9.6 21 2 13.4 2 4C2 3.5 2.5 3 3 3H6.5ZM14.2002 18.2002C15.4001 18.6002 16.7001 18.9 18 19V17.4004C17.1001 17.4004 16.2003 17.2 15.4004 17L14.2002 18.2002Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  const { t } = useTranslation();
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

  const [searchTerm, setSearchTerm] = useState("");
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
      trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driverId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      !activeFilter ||
      (activeFilter === "medical" ? trip.tripType === "krankenfahrten" : trip.status === activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-20 lg:pb-10" style={{ backgroundColor: 'var(--color-sys-background)' }}>
      <div className="p-4 md:p-6 lg:p-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="h-14 px-6 rounded-[var(--radius)] flex items-center gap-2 transition-colors mb-6"
          style={{
            backgroundColor: 'var(--color-sys-surface-container)',
            color: 'var(--color-sys-on-surface)',
            fontSize: 'var(--fs-label-1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-variant)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-container)'; }}
        >
          <ArrowLeft className="size-5" />
          <span>{t('passenger.back')}</span>
        </button>

        {/* Two-column layout 50-50 (Figma): left = passenger details, right = upcoming trips + trip activity */}
        <style>{`
          .passenger-detail-columns {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            width: 100%;
            max-width: 100%;
            align-items: stretch;
            box-sizing: border-box;
          }
          @media (min-width: 1024px) {
            .passenger-detail-columns {
              grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            }
          }
          .passenger-detail-columns > * {
            min-width: 0;
            box-sizing: border-box;
          }
        `}</style>
        <div className="passenger-detail-columns">
          {/* ── LEFT COLUMN (50%): Passenger details ── */}
          <div
            className="rounded-[var(--radius-card)] p-4 md:p-6 w-full overflow-hidden"
            style={{
              minWidth: 0,
              backgroundColor: 'var(--color-sys-surface)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-[28px] font-semibold" style={{ color: 'var(--color-sys-on-surface)' }}>
                {t('passenger.accountTitle')}
              </h1>
            </div>

            {/* Passenger details */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold mb-4" style={{ color: 'var(--color-sys-on-surface)' }}>
                {t('passenger.detailsTitle')}
              </h3>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <TextField
                    label={t('passenger.firstNameLabel')}
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
                    label={t('passenger.lastNameLabel')}
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
                    label={t('passenger.dateOfBirthLabel')}
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

            {/* Contact details */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold mb-4" style={{ color: 'var(--color-sys-on-surface)' }}>
                {t('passenger.contactDetailsTitle')}
              </h3>

              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <TextField
                    label={t('passenger.phoneNumberLabel')}
                    value={formData.phone}
                    onChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label={t('passenger.emailLabel')}
                    value={formData.email}
                    onChange={(value) =>
                      setFormData({ ...formData, email: value })
                    }
                  />
                </div>
              </div>

              <div className="mb-4">
                <TextField
                  label={t('passenger.homeAddressLabel')}
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
                  placeholder={t('passenger.notesPlaceholder')}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full h-full bg-transparent rounded-[var(--radius)] px-6 py-4 resize-none text-[16px] focus:outline-none border placeholder-[var(--color-sys-on-surface-variant)]"
                  style={{
                    borderColor: 'var(--color-sys-outline)',
                    color: 'var(--color-sys-on-surface)',
                  }}
                />
              </div>
            </div>

            {/* Healthcare & insurance information */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold mb-4" style={{ color: 'var(--color-sys-on-surface)' }}>
                {t('passenger.healthcareInsuranceTitle')}
              </h3>

              <div className="flex gap-2">
                <div className="flex-1">
                  <SelectField
                    label={t('passenger.insuranceCompanyLabel')}
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
                <div className="flex-1">
                  <TextField
                    label={t('passenger.patientNumberLabel')}
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
            </div>

            <div className="flex gap-4 justify-end">
              <button
                disabled
                onClick={handleCancel}
                className="h-14 px-6 rounded-[var(--radius)] transition-colors opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-sys-surface-container)',
                  color: 'var(--color-sys-on-surface)',
                }}
              >
                <span>{t('passenger.cancelButton')}</span>
              </button>
              <button
                disabled
                onClick={handleSave}
                className="h-14 px-6 rounded-[var(--radius)] transition-opacity opacity-50 cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-sys-on-accent)',
                }}
              >
                <span>{t('passenger.saveChangesButton')}</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (50%): Upcoming trips + Trip activity ── */}
          <div className="flex flex-col gap-6 w-full overflow-hidden" style={{ minWidth: 0 }}>

            {/* ── Upcoming trips card ── */}
            <div
              className="overflow-hidden flex flex-col rounded-[var(--radius-card)]"
              style={{
                backgroundColor: 'var(--color-sys-surface)',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header: title + Wave experimental buttons */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <h2 className="text-[24px] font-semibold" style={{ color: 'var(--color-sys-on-surface)' }}>{t('passenger.upcomingTrips')}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <WaveButton emphasis="secondary" onPress={onCreateTrip} isDisabled>
                    <Plus className="size-5" style={{ marginRight: 6 }} />
                    {t('passenger.newRegularTrip')}
                  </WaveButton>
                  <WaveButton emphasis="secondary" onPress={onCreateRecurrentTrip} isDisabled>
                    <Plus className="size-5" style={{ marginRight: 6 }} />
                    {t('passenger.newRecurrentTrip')}
                  </WaveButton>
                </div>
              </div>

              {/* Search */}
              <div className="mb-4 flex justify-end">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', maxWidth: 360, height: 40, padding: '0 12px',
                  borderRadius: 12, flexShrink: 0,
                  backgroundColor: 'var(--color-sys-surface-container, #f1efef)',
                }}>
                  <SvgIcon raw={SearchSvg} size={24} style={{ color: 'var(--color-sys-on-surface-variant)' }} />
                  <input
                    type="text"
                    placeholder={t('passenger.searchBooking')}
                    className="bg-transparent outline-none flex-1"
                    style={{
                      fontSize: 'var(--fs-label-1, 16px)',
                      fontWeight: 'var(--fw-label-1, 500)',
                      color: 'var(--color-sys-on-surface, #1e1a1a)',
                    }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                <div className="min-w-full">
                  {/* Table header */}
                  <div
                    className="flex h-12 items-center border-b sticky top-0 z-10"
                    style={{
                      borderColor: 'var(--color-sys-divider)',
                      backgroundColor: 'var(--color-sys-surface-container)',
                    }}
                  >
                    <div className="flex-1 px-4">
                      <p className="text-[13px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.upcomingTripsTable.tripTitle')}</p>
                    </div>
                    <div className="w-[140px] px-4">
                      <p className="text-[13px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.upcomingTripsTable.type')}</p>
                    </div>
                    <div className="w-[140px] px-4">
                      <p className="text-[13px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.upcomingTripsTable.occurrence')}</p>
                    </div>
                    <div className="w-[100px] px-4">
                      <p className="text-[13px] font-medium uppercase tracking-wider" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.upcomingTripsTable.actions')}</p>
                    </div>
                  </div>

                  {/* Recurrent Trip Rows */}
                  {recurrentTrips
                    .filter((rt) => rt.passengerId === passenger.id)
                    .map((row) => {
                      const dayLabels = ["M", "T", "W", "R", "F", "S", "U"];
                      const daysDisplay = row.daysOfWeek.map((d) => dayLabels[d]).join(", ");
                      return (
                        <div
                          key={row.id}
                          className="flex h-12 items-center border-b transition-colors"
                          style={{ borderColor: 'var(--color-sys-divider)' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-container)'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <div className="flex-1 px-4 overflow-hidden">
                            <p className="text-[15px] truncate" style={{ color: 'var(--color-sys-on-surface)' }}>{row.title}</p>
                          </div>
                          <div className="w-[140px] px-4">
                            <span className="text-[14px]" style={{ color: 'var(--color-sys-on-surface)' }}>{t('passenger.upcomingTripsTable.recurrentType')}</span>
                          </div>
                          <div className="w-[140px] px-4">
                            <p className="text-[14px]" style={{ color: 'var(--color-sys-on-surface)' }}>{daysDisplay}</p>
                          </div>
                          <div className="w-[100px] px-4 flex items-center">
                            <IconBtn onClick={() => onEditRecurrentTrip?.(row)} title="Edit" disabled>
                              <PenIcon className="size-5" />
                            </IconBtn>
                            <IconBtn title="Delete" disabled>
                              <TrashIcon className="size-5" />
                            </IconBtn>
                          </div>
                        </div>
                      );
                    })}

                  {/* One-time Trips Rows */}
                  {passengerTrips
                    .filter((trip) => trip.tripTitle || trip.tripType || trip.insuranceCompany)
                    .map((trip) => {
                      const displayTitle = trip.tripTitle || `${trip.pickup} → ${trip.dropoff}`;
                      return (
                        <div
                          key={trip.id}
                          className="flex h-12 items-center border-b transition-colors"
                          style={{ borderColor: 'var(--color-sys-divider)' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-container)'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <div className="flex-1 px-4 overflow-hidden">
                            <p className="text-[15px] truncate" style={{ color: 'var(--color-sys-on-surface)' }}>{displayTitle}</p>
                          </div>
                          <div className="w-[140px] px-4">
                            <span className="text-[14px]" style={{ color: 'var(--color-sys-on-surface)' }}>{t('passenger.upcomingTripsTable.oneTimeType')}</span>
                          </div>
                          <div className="w-[140px] px-4">
                            <p className="text-[14px]" style={{ color: 'var(--color-sys-on-surface)' }}>{trip.date || '-'} {trip.time}</p>
                          </div>
                          <div className="w-[100px] px-4 flex items-center">
                            <IconBtn title="Edit" disabled>
                              <PenIcon className="size-5" />
                            </IconBtn>
                            <IconBtn title="Delete" disabled>
                              <TrashIcon className="size-5" />
                            </IconBtn>
                          </div>
                        </div>
                      );
                    })}

                  {recurrentTrips.filter((rt) => rt.passengerId === passenger.id).length === 0 &&
                    passengerTrips.filter((trip) => trip.tripTitle || trip.tripType || trip.insuranceCompany).length === 0 && (
                      <div className="text-center py-10" style={{ color: 'var(--color-sys-on-surface-variant)' }}>
                        <p>{t('passenger.upcomingTripsTable.noUpcomingTrips')}</p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* ── Trips activity card ── */}
            <div
              className="flex flex-col rounded-[var(--radius-card)]"
              style={{
                backgroundColor: 'var(--color-sys-surface)',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <h2 className="text-[24px] font-semibold mb-6" style={{ color: 'var(--color-sys-on-surface)' }}>{t('passenger.tripsActivity')}</h2>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
                <div className="flex flex-wrap gap-2 items-center">
                  {[
                    { label: t('passenger.filterOngoing'), count: ongoingTrips, value: "In Progress" },
                    { label: t('passenger.filterPrebooked'), count: prebookedTrips, value: "Pending" },
                    { label: t('passenger.filterCancelled'), count: cancelledTrips, value: "Cancelled" },
                    { label: t('passenger.filterCompleted'), count: completedTrips, value: "Completed" },
                    { label: t('passenger.filterMedical'), count: passengerTrips.filter(t => t.tripType === 'krankenfahrten').length, value: "medical" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => setActiveFilter(activeFilter === chip.value ? null : chip.value)}
                      className="px-4 py-2 rounded-[12px] flex items-center gap-2 transition-all h-10"
                      style={{
                        backgroundColor: activeFilter === chip.value ? 'var(--color-sys-on-surface)' : 'var(--color-sys-surface-container)',
                        color: activeFilter === chip.value ? 'var(--color-sys-surface)' : 'var(--color-sys-on-surface)',
                        fontSize: 'var(--fs-label-1)',
                        fontWeight: 'var(--fw-label-1)',
                      }}
                    >
                      <span className="opacity-60 mr-1">{chip.count}</span> {chip.label}
                    </button>
                  ))}

                  {activeFilter && (
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="text-[13px] flex items-center gap-1 ml-2"
                      style={{ color: 'var(--color-sys-on-surface-variant)' }}
                    >
                      <X size={14} /> {t('passenger.clearFilter')}
                    </button>
                  )}
                </div>

                {/* Search */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  width: '100%', maxWidth: 320, height: 40, padding: '0 12px',
                  borderRadius: 12, flexShrink: 0,
                  backgroundColor: 'var(--color-sys-surface-container, #f1efef)',
                }}>
                  <SvgIcon raw={SearchSvg} size={24} style={{ color: 'var(--color-sys-on-surface-variant)' }} />
                  <input
                    type="text"
                    placeholder={t('passenger.searchTrip')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none flex-1"
                    style={{
                      fontSize: 'var(--fs-label-1, 16px)',
                      fontWeight: 'var(--fw-label-1, 500)',
                      color: 'var(--color-sys-on-surface, #1e1a1a)',
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'var(--color-sys-on-surface-variant)' }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <div className="min-w-full">
                  {/* Table Header */}
                  <div
                    className="flex items-center py-3 border-b sticky top-0 z-10"
                    style={{
                      borderColor: 'var(--color-sys-divider)',
                      backgroundColor: 'var(--color-sys-surface-container)',
                    }}
                  >
                    <div className="w-[100px] px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.time')}</div>
                    <div className="w-[120px] px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.status')}</div>
                    <div className="w-[100px] px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.driverId')}</div>
                    <div className="flex-1 px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.pickup')}</div>
                    <div className="flex-1 px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.dropoff')}</div>
                    <div className="w-[104px] px-4 font-medium text-[12px]" style={{ color: 'var(--color-sys-on-surface-variant)' }}>{t('passenger.table.actions')}</div>
                  </div>

                  {/* Trip Rows */}
                  {filteredItems.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex min-h-[48px] py-1 items-center border-b transition-colors"
                      style={{ borderColor: 'var(--color-sys-divider)' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-sys-surface-container)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <div className="w-[100px] px-4">
                        <p className="text-[14px]" style={{ color: 'var(--color-sys-on-surface)' }}>{trip.time}</p>
                      </div>
                      <div className="w-[120px] px-4">
                        <StatusBadge status={trip.status} />
                      </div>
                      <div className="w-[100px] px-4">
                        <span className="text-[14px] font-mono" style={{ color: 'var(--color-sys-on-surface)' }}>{trip.driverId}</span>
                      </div>
                      <div className="flex-1 px-4 overflow-hidden">
                        <p className="text-[13px] truncate" style={{ color: 'var(--color-sys-on-surface)' }} title={trip.pickup}>{trip.pickup}</p>
                      </div>
                      <div className="flex-1 px-4 overflow-hidden">
                        <p className="text-[13px] truncate" style={{ color: 'var(--color-sys-on-surface)' }} title={trip.dropoff}>{trip.dropoff}</p>
                      </div>
                      <div className="w-[104px] px-4 flex items-center">
                        {trip.phone && (
                          <a
                            href={`tel:${trip.phone.replace(/\s/g, '')}`}
                            style={{
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 8,
                              color: "var(--color-sys-on-surface-variant)",
                              flexShrink: 0,
                              pointerEvents: 'none',
                              opacity: 0.38
                            }}
                            title="Call"
                          >
                            <PhoneIcon className="size-5" />
                          </a>
                        )}
                        <IconBtn title="Edit" disabled>
                          <PenIcon className="size-5" />
                        </IconBtn>
                        <IconBtn title="Delete" disabled>
                          <TrashIcon className="size-5" />
                        </IconBtn>
                      </div>
                    </div>
                  ))}

                  {filteredItems.length === 0 && (
                    <div className="text-center py-16" style={{ color: 'var(--color-sys-on-surface-variant)' }}>
                      <p>{t('passenger.table.noTripsFound')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
          {/* ── end RIGHT COLUMN ── */}

        </div>
      </div>
    </div>
  );
}