import { X, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ds/button';
import { useTranslation } from 'react-i18next';

// --- Custom Icons ---

function CallDriverIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.5 3C7 3 7.5 3.5 7.5 4C7.5 5.19987 7.70006 6.49969 8 7.59961C8.19998 7.89958 8.09973 8.29962 7.7998 8.59961L5.59961 10.7998C6.99961 13.5998 9.4002 15.9004 12.2002 17.4004L14.4004 15.2002C14.6003 15.0003 14.7999 14.9005 15.0996 14.9004H15.4004C16.5003 15.3003 17.8002 15.5 19 15.5C19.5 15.5 20 16 20 16.5V20C20 20.5 19.5 21 19 21C9.6 21 2 13.4 2 4C2 3.5 2.5 3 3 3H6.5ZM14.2002 18.2002C15.4001 18.6002 16.7001 18.9 18 19V17.4004C17.1001 17.4004 16.2003 17.2 15.4004 17L14.2002 18.2002ZM19.8418 2C20.0679 2 20.2735 2.0626 20.458 2.1875C20.6425 2.31248 20.7694 2.48443 20.8389 2.70312L22 5.75V10.625C22 10.7313 21.9659 10.8207 21.8975 10.8926C21.829 10.9644 21.7437 11 21.6426 11H20.3633C20.2621 11 20.1768 10.9644 20.1084 10.8926C20.0399 10.8207 20.0059 10.7313 20.0059 10.625V9.875H13.9941V10.625C13.9941 10.7313 13.9601 10.8207 13.8916 10.8926C13.8232 10.9644 13.7379 11 13.6367 11H12.3574C12.2563 11 12.171 10.9644 12.1025 10.8926C12.0341 10.8207 12 10.7313 12 10.625V5.75L13.1611 2.70312C13.2306 2.48443 13.3575 2.31248 13.542 2.1875C13.7265 2.0626 13.9321 2 14.1582 2H19.8418ZM4 5C4.09999 6.29992 4.39984 7.59987 4.7998 8.7998L6 7.59961C5.80003 6.7997 5.59998 5.89986 5.5 5H4ZM14.5 6.6875C14.3016 6.6875 14.133 6.76045 13.9941 6.90625C13.8553 7.05208 13.7861 7.22917 13.7861 7.4375C13.7861 7.64583 13.8553 7.82292 13.9941 7.96875C14.133 8.11455 14.3016 8.1875 14.5 8.1875C14.6984 8.1875 14.867 8.11455 15.0059 7.96875C15.1447 7.82292 15.2139 7.64583 15.2139 7.4375C15.2139 7.22917 15.1447 7.05208 15.0059 6.90625C14.867 6.76045 14.6984 6.6875 14.5 6.6875ZM19.5 6.6875C19.3016 6.6875 19.133 6.76045 18.9941 6.90625C18.8553 7.05208 18.7861 7.22917 18.7861 7.4375C18.7861 7.64583 18.8553 7.82292 18.9941 7.96875C19.133 8.11455 19.3016 8.1875 19.5 8.1875C19.6984 8.1875 19.867 8.11455 20.0059 7.96875C20.1447 7.82292 20.2139 7.64583 20.2139 7.4375C20.2139 7.22917 20.1447 7.05208 20.0059 6.90625C19.867 6.76045 19.6984 6.6875 19.5 6.6875ZM13.4434 5.375H20.5566L19.8418 3.5H14.1582L13.4434 5.375Z" fill="currentColor" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4.89474 19.1053H6.24474L16.4526 8.89737L15.1026 7.54737L4.89474 17.7553V19.1053ZM3.94737 21C3.67895 21 3.45395 20.9092 3.27237 20.7276C3.09079 20.5461 3 20.3211 3 20.0526V17.7553C3 17.5026 3.04737 17.2618 3.14211 17.0329C3.23684 16.8039 3.37105 16.6026 3.54474 16.4289L16.4526 3.54474C16.6421 3.37105 16.8513 3.23684 17.0803 3.14211C17.3092 3.04737 17.55 3 17.8026 3C18.0553 3 18.3 3.04737 18.5368 3.14211C18.7737 3.23684 18.9789 3.37895 19.1526 3.56842L20.4553 4.89474C20.6447 5.06842 20.7829 5.27368 20.8697 5.51053C20.9566 5.74737 21 5.98421 21 6.22105C21 6.47368 20.9566 6.71447 20.8697 6.94342C20.7829 7.17237 20.6447 7.38158 20.4553 7.57105L7.57105 20.4553C7.39737 20.6289 7.19605 20.7632 6.96711 20.8579C6.73816 20.9526 6.49737 21 6.24474 21H3.94737ZM15.7658 8.23421L15.1026 7.54737L16.4526 8.89737L15.7658 8.23421Z" fill="currentColor" />
    </svg>
  );
}

function CancelIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 13.4L14.9 16.3C15.0833 16.4833 15.3167 16.575 15.6 16.575C15.8833 16.575 16.1167 16.4833 16.3 16.3C16.4833 16.1167 16.575 15.8833 16.575 15.6C16.575 15.3167 16.4833 15.0833 16.3 14.9L13.4 12L16.3 9.1C16.4833 8.91667 16.575 8.68333 16.575 8.4C16.575 8.11667 16.4833 7.88333 16.3 7.7C16.1167 7.51667 15.8833 7.425 15.6 7.425C15.3167 7.425 15.0833 7.51667 14.9 7.7L12 10.6L9.1 7.7C8.91667 7.51667 8.68333 7.425 8.4 7.425C8.11667 7.425 7.88333 7.51667 7.7 7.7C7.51667 7.88333 7.425 8.11667 7.425 8.4C7.425 8.68333 7.51667 8.91667 7.7 9.1L10.6 12L7.7 14.9C7.51667 15.0833 7.425 15.3167 7.425 15.6C7.425 15.8833 7.51667 16.1167 7.7 16.3C7.88333 16.4833 8.11667 16.575 8.4 16.575C8.68333 16.575 8.91667 16.4833 9.1 16.3L12 13.4ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="currentColor" />
    </svg>
  );
}

interface Trip {
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
  delayed?: string;
}

interface BookingDetailsOverlayProps {
  trip: Trip;
  onClose: () => void;
}

// Label + value pair — gap-[7px] per Figma spec
function DetailField({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <p className="text-[14px] leading-[20px] text-[#5e5e5e]">{label}</p>
      {children ?? <p className="text-[16px] leading-[24px] text-[#1b1b1b]">{value ?? '—'}</p>}
    </div>
  );
}

// Status chip — matches Figma color tokens exactly
function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();

  let bg = '#f1f1f1';
  let color = '#1b1b1b';

  if (s === 'completed') { bg = '#eaf2ea'; color = '#123213'; }
  else if (s === 'cancelled' || s === 'canceled') { bg = '#fae6ea'; color = '#790518'; }
  else if (s.includes('trip') || s === 'in_trip') { bg = '#e8f0fb'; color = '#1a5db6'; }
  else if (s.includes('approach')) { bg = '#fff3e0'; color = '#7c4200'; }
  else if (s === 'pending') { bg = '#fef3ce'; color = '#4c3a02'; }
  else if (s === 'in progress') { bg = '#e8f0fb'; color = '#1a5db6'; }

  return (
    <span
      className="inline-flex items-center h-[22px] px-[8px] rounded-[4px] text-[14px] leading-[20px] whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {status}
    </span>
  );
}

const GMAPS_KEY = 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';
const OSM_URL = `https://maps.googleapis.com/maps/api/staticmap?center=53.5503,9.9950&zoom=13&size=1024x400&scale=2&maptype=roadmap&key=${GMAPS_KEY}`;

export function BookingDetailsOverlay({ trip, onClose }: BookingDetailsOverlayProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Scrim */}
      <div className="absolute inset-0 bg-[#1b1b1b] opacity-60" onClick={onClose} />

      {/* Modal shell */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          background: '#f1f1f1',
          borderRadius: 24,
          width: 'min(1304px, calc(100vw - 48px))',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
        }}
      >
        {/* ── Top bar: close button ── */}
        <div className="flex items-center justify-end pt-4 px-6">
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center rounded-full hover:bg-[#e0e0e0] transition-colors"
          >
            <X className="size-5 text-[#1b1b1b]" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="px-6 pb-[60px] flex flex-col gap-0">

          {/* Header: title + action buttons — py-[16px] gap-[16px] per Figma */}
          <div className="flex flex-col gap-[16px] py-[16px]">
            <div className="flex items-center gap-[12px]">
              <h2 className="text-[24px] font-semibold leading-[28px] text-[#1b1b1b]">{t('bookingDetails.title')}</h2>
              <StatusBadge status={trip.status} />
            </div>

            {/* Action buttons — gap-[10px], h-[40px], rounded-[12px], px-[4px] */}
            <div className="flex gap-[10px]">
              <Button variant="ghost" className="h-10 px-[4px] flex items-center gap-[8px] rounded-[12px] bg-[#f1f1f1]">
                <CallDriverIcon className="text-[#1b1b1b]" />
                <span className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.callDriver')}</span>
              </Button>
              <Button variant="ghost" className="h-10 px-[4px] flex items-center gap-[8px] rounded-[12px] bg-[#f1f1f1] opacity-[0.38]">
                <EditIcon className="text-[#1b1b1b]" />
                <span className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.editTrip')}</span>
              </Button>
              <Button variant="ghost" className="h-10 px-[4px] flex items-center gap-[8px] rounded-[12px] bg-[#f1f1f1] opacity-[0.38]">
                <CancelIcon className="text-[#be0038]" />
                <span className="text-[16px] font-medium leading-[24px] text-[#be0038]">{t('bookingDetails.cancelTrip')}</span>
              </Button>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div className="flex items-start justify-between gap-[32px]">

            {/* LEFT column — flex-1, gap-[32px] between cards */}
            <div className="flex-1 flex flex-col gap-[32px] min-w-0">

              {/* Map — rounded-[14px], border, h-326, background-image cover */}
              <div
                className="overflow-hidden relative"
                style={{
                  background: `url(${OSM_URL}) center/cover no-repeat #e5e3df`,
                  borderRadius: 14,
                  border: '1px solid rgba(0,0,0,0.1)',
                  height: 326,
                  width: '100%',
                }}
              >
                {/* Pickup marker */}
                <div
                  className="absolute flex flex-col items-center"
                  style={{ top: 114, left: 87.5, filter: 'drop-shadow(0px 1px 1.5px rgba(0,15,31,0.12)) drop-shadow(0px 0px 1px rgba(0,15,31,0.12))' }}
                >
                  <div className="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[6px] rounded-full bg-[#1b1b1b]">
                    <User className="size-[20px] text-white" />
                    <span className="text-[14px] leading-[20px] text-white">{t('bookingDetails.pickup')}</span>
                  </div>
                  <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                    <path d="M3 5L0 0H6L3 5Z" fill="#1b1b1b" />
                  </svg>
                </div>
                {/* Dropoff marker */}
                <div
                  className="absolute flex flex-col items-center"
                  style={{ top: 254, left: 511.5, filter: 'drop-shadow(0px 1px 1.5px rgba(0,15,31,0.12)) drop-shadow(0px 0px 1px rgba(0,15,31,0.12))' }}
                >
                  <div className="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[6px] rounded-full bg-[#e80046]">
                    <MapPin className="size-[20px] text-white" />
                    <span className="text-[14px] leading-[20px] text-white">{t('bookingDetails.dropoff')}</span>
                  </div>
                  <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                    <path d="M3 5L0 0H6L3 5Z" fill="#e80046" />
                  </svg>
                </div>
              </div>

              {/* Booking details card — p-[24px], gap-[24px] inside */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                <p className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.bookingDetailsCard')}</p>
                <div className="flex flex-col gap-[24px]">
                  <div className="flex items-start">
                    <div className="w-[360px]">
                      <DetailField label={t('bookingDetails.status')}>
                        <div className="pt-[2px]"><StatusBadge status={trip.status} /></div>
                      </DetailField>
                    </div>
                    <div className="flex-1">
                      <DetailField label={t('bookingDetails.fleet')} value="Hamburg Dispatcher" />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[360px]">
                      <DetailField label={t('bookingDetails.bookingType')} value="Ad-hoc" />
                    </div>
                    <div className="flex-1">
                      <DetailField label={t('bookingDetails.noteToDriver')} value="—" />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[360px]">
                      <DetailField label={t('bookingDetails.requestedPickupTime')} value={trip.time} />
                    </div>
                    <div className="flex-1">
                      <DetailField label={t('bookingDetails.bookingAgentEmail')} value="dispatcher@hamburg.de" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip details card — p-[24px] */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                <p className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.tripDetailsCard')}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <User className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">{t('bookingDetails.requestedPickup')}</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <MapPin className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">{t('bookingDetails.requestedDropoff')}</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT column — w-[395px], gap-[32px] between cards */}
            <div className="flex flex-col gap-[32px]" style={{ width: 395, flexShrink: 0 }}>

              {/* Driver & vehicle card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                <p className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.driverVehicleCard')}</p>
                <div className="flex flex-col gap-[16px]">
                  <DetailField label={t('bookingDetails.driverId')} value={trip.driverId} />
                  <DetailField label={t('bookingDetails.licensePlate')} value="XYZ-789" />
                  <DetailField label={t('bookingDetails.vehicle')} value="Toyota Camry" />
                </div>
              </div>

              {/* Passenger card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                <p className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.passengerCard')}</p>
                <div className="flex flex-col gap-[16px]">
                  <DetailField label={t('bookingDetails.name')} value={trip.passenger} />
                  <DetailField label={t('bookingDetails.phoneNumber')} value={trip.phone} />
                </div>
              </div>

              {/* Payment card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-[24px] flex flex-col gap-[24px]">
                <p className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">{t('bookingDetails.paymentCard')}</p>
                <div className="flex flex-col gap-[7px]">
                  <DetailField label={t('bookingDetails.estimatedPrice')} value="€22,00 – €28,50" />
                  <DetailField label={t('bookingDetails.finalPrice')} value="€23,00" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}