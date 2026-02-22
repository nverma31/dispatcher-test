import { X, Phone, Pen, XCircle, User, MapPin } from 'lucide-react';

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

// Label + value pair used throughout detail cards
function DetailField({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <p className="text-[14px] leading-[20px] text-[#5e5e5e]">{label}</p>
      {children ?? <p className="text-[16px] leading-[24px] text-[#1b1b1b]">{value ?? '—'}</p>}
    </div>
  );
}

// Status chip — green for Completed, neutral otherwise
function StatusBadge({ status }: { status: string }) {
  const isCompleted = status.toLowerCase() === 'completed';
  const isInTrip = status.toLowerCase().includes('trip') || status.toLowerCase() === 'in_trip';
  const isApproaching = status.toLowerCase().includes('approach');

  let bg = '#f1f1f1';
  let color = '#1b1b1b';

  if (isCompleted) { bg = '#eaf2ea'; color = '#123213'; }
  else if (isInTrip) { bg = '#e8f0fb'; color = '#1a5db6'; }
  else if (isApproaching) { bg = '#fff3e0'; color = '#7c4200'; }
  else if (status.toLowerCase() === 'pending') { bg = '#fef3ce'; color = '#4c3a02'; }

  return (
    <span
      className="inline-flex items-center h-[22px] px-2 rounded-[4px] text-[14px] leading-[20px] whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {status}
    </span>
  );
}

const GMAPS_KEY = 'AIzaSyBP0l1p4SS65c9tAz_4jGNcw1_jX15nNwE';

const OSM_URL =
  `https://maps.googleapis.com/maps/api/staticmap?center=53.5503,9.9950&zoom=13&size=800x325&scale=2&maptype=roadmap&key=${GMAPS_KEY}`;

export function BookingDetailsOverlay({ trip, onClose }: BookingDetailsOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-[#1b1b1b] opacity-60"
        onClick={onClose}
      />

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

        {/* ── Trip details content ── */}
        <div className="px-6 pb-8 flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-4">
            {/* Title row */}
            <div className="flex items-center gap-3">
              <h2 className="text-[24px] font-semibold leading-[28px] text-[#1b1b1b]">Booking</h2>
              <StatusBadge status={trip.status} />
            </div>

            {/* Action buttons */}
            <div className="flex gap-[10px]">
              <button className="h-10 px-4 flex items-center gap-2 bg-[#f1f1f1] rounded-[12px] hover:bg-[#e0e0e0] transition-colors border border-[rgba(0,0,0,0.08)]">
                <Phone className="size-5 text-[#1b1b1b]" />
                <span className="text-[16px] font-medium text-[#1b1b1b]">Call Driver</span>
              </button>
              <button className="h-10 px-4 flex items-center gap-2 bg-[#f1f1f1] rounded-[12px] hover:bg-[#e0e0e0] transition-colors border border-[rgba(0,0,0,0.08)] opacity-40">
                <Pen className="size-5 text-[#1b1b1b]" />
                <span className="text-[16px] font-medium text-[#1b1b1b]">Edit Trip</span>
              </button>
              <button className="h-10 px-4 flex items-center gap-2 bg-[#f1f1f1] rounded-[12px] hover:bg-[#e0e0e0] transition-colors border border-[rgba(0,0,0,0.08)] opacity-40">
                <XCircle className="size-5 text-[#be0038]" />
                <span className="text-[16px] font-medium text-[#be0038]">Cancel Trip</span>
              </button>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div className="flex gap-8 items-start">
            {/* LEFT column */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">

              {/* Map card */}
              <div
                className="overflow-hidden relative"
                style={{
                  background: '#fff',
                  borderRadius: 14,
                  border: '1px solid rgba(0,0,0,0.1)',
                  height: 326,
                }}
              >
                <img
                  src={OSM_URL}
                  alt="Route map"
                  className="w-full h-full object-cover"
                />
                {/* Pickup marker overlay (decorative) */}
                <div
                  className="absolute flex flex-col items-center"
                  style={{ top: 115, left: 88, filter: 'drop-shadow(0px 1px 1.5px rgba(0,15,31,0.12)) drop-shadow(0px 0px 1px rgba(0,15,31,0.12))' }}
                >
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1b1b1b]">
                    <User className="size-4 text-white" />
                    <span className="text-[13px] leading-[18px] text-white font-medium">Pickup</span>
                  </div>
                  <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                    <path d="M3 5L0 0H6L3 5Z" fill="#1b1b1b" />
                  </svg>
                </div>
              </div>

              {/* Booking details card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6 flex flex-col gap-6">
                <h3 className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">Booking details</h3>
                <div className="flex flex-col gap-6">
                  {/* Row 1 */}
                  <div className="flex gap-0">
                    <div className="w-[50%]">
                      <DetailField label="Status">
                        <div className="mt-1"><StatusBadge status={trip.status} /></div>
                      </DetailField>
                    </div>
                    <div className="w-[50%]">
                      <DetailField label="Fleet" value="Hamburg Dispatcher" />
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex gap-0">
                    <div className="w-[50%]">
                      <DetailField label="Booking type" value="Ad-hoc" />
                    </div>
                    <div className="w-[50%]">
                      <DetailField label="Message/Note to driver" value="—" />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="flex gap-0">
                    <div className="w-[50%]">
                      <DetailField label="Requested pickup time" value={trip.time} />
                    </div>
                    <div className="w-[50%]">
                      <DetailField label="Booking agent email" value="dispatcher@hamburg.de" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip details card */}
              <div className="bg-[#fcfcfc] rounded-[24px] px-6 py-6 flex flex-col gap-6">
                <h3 className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">Trip details</h3>
                {/* Requested pickup / dropoff */}
                <div className="flex items-start justify-between px-0">
                  <div className="flex items-center gap-3">
                    <User className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">Requested pickup</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">Requested dropoff</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.dropoff}</p>
                    </div>
                  </div>
                </div>
                {/* Actual pickup / dropoff */}
                <div className="flex items-start justify-between px-0">
                  <div className="flex items-center gap-3">
                    <User className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">Actual pickup</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="size-6 text-[#5e5e5e] shrink-0" />
                    <div>
                      <p className="text-[14px] text-[#5e5e5e] leading-[20px]">Actual dropoff</p>
                      <p className="text-[16px] text-[#1b1b1b] leading-[24px]">{trip.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT column */}
            <div className="flex flex-col gap-8" style={{ width: 395, flexShrink: 0 }}>

              {/* Driver & vehicle card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6 flex flex-col gap-6">
                <h3 className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">Driver and vehicle details</h3>
                <div className="flex flex-col gap-4 px-6">
                  <DetailField label="Driver ID" value={trip.driverId} />
                  <DetailField label="License plate" value="XYZ-789" />
                  <DetailField label="Vehicle" value="Toyota Camry" />
                </div>
              </div>

              {/* Passenger card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6 flex flex-col gap-6">
                <h3 className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">Passenger details</h3>
                <div className="flex flex-col gap-4 px-6">
                  <DetailField label="Name" value={trip.passenger} />
                  <DetailField label="Phone number" value={trip.phone} />
                </div>
              </div>

              {/* Payment card */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6 flex flex-col gap-6">
                <h3 className="text-[16px] font-medium leading-[24px] text-[#1b1b1b]">Payment details</h3>
                <div className="flex flex-col gap-4">
                  <DetailField label="Estimated price" value="€22,00 – €28,50" />
                  <DetailField label="Final price" value="€23,00" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}