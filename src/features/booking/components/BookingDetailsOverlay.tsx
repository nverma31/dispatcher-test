import { X } from 'lucide-react';
import svgPaths from '@/components/icons/svg-e8fa04e7x4';

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

export function BookingDetailsOverlay({ trip, onClose }: BookingDetailsOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dimming overlay */}
      <div 
        className="absolute inset-0 bg-[#1b1b1b] opacity-60"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-[#f1f1f1] rounded-[24px] w-[1304px] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)] transition-colors"
          >
            <X className="size-6 text-[#1b1b1b]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Header */}
          <div className="flex flex-col gap-6 pb-6">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-[24px] text-[#1b1b1b]">
                    Buchung #{trip.id}
                  </h2>
                  <div className="bg-[#fef3ce] px-2 py-1 rounded-[var(--radius-label)] h-[22px] flex items-center">
                    <span className="text-[14px] leading-5 text-[#4c3a02]">
                      {trip.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#5e5e5e]">
                    Fahrer ist auf dem Weg zum Abholort
                  </span>
                  <span className="text-[#d0d0d0]">•</span>
                  <div className="flex items-center gap-1">
                    <svg className="size-3.5" fill="none" viewBox="0 0 14 14">
                      <path d="M7 3.5V7L9.33333 8.16667" stroke="#5e5e5e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                      <path d={svgPaths.pc012c00} stroke="#5e5e5e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    </svg>
                    <span className="text-[14px] text-[#1b1b1b]">Ankunft in 6 Min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button className="bg-[#f1f1f1] h-10 px-4 rounded-[12px] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors">
                <svg className="size-5" fill="none" viewBox="0 0 15 15">
                  <path d={svgPaths.p2f9e4dc0} fill="#1b1b1b" />
                </svg>
                <span className="text-[16px] text-[#1b1b1b]">Fahrer anrufen</span>
              </button>
              <button className="bg-[#f1f1f1] h-10 px-4 rounded-[12px] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors">
                <svg className="size-5" fill="none" viewBox="0 0 15 15">
                  <path d={svgPaths.p1bd00580} fill="#1b1b1b" />
                </svg>
                <span className="text-[16px] text-[#1b1b1b]">Fahrt bearbeiten</span>
              </button>
              <button className="bg-[#f1f1f1] h-10 px-4 rounded-[12px] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors">
                <svg className="size-5" fill="none" viewBox="0 0 17 17">
                  <path d={svgPaths.p2c78c500} fill="#be0038" />
                </svg>
                <span className="text-[16px] text-[#be0038]">Fahrt stornieren</span>
              </button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="flex gap-6">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Map */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <div className="relative h-[325px] bg-[#e5e5e5] rounded-[24px] overflow-hidden">
                  {/* Mock map placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#5e5e5e]">
                    <div className="text-center">
                      <svg className="size-16 mx-auto mb-2 text-[#5e5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-sm">Route Map</p>
                    </div>
                  </div>
                  
                  {/* Zoom controls */}
                  <div className="absolute top-6 right-6 bg-[#fcfcfc] rounded-[12px] shadow-lg p-3 flex gap-1">
                    <button className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                      <svg className="size-6" fill="none" viewBox="0 0 14 14">
                        <path d={svgPaths.pb4d1ef0} fill="#5e5e5e" />
                      </svg>
                    </button>
                    <button className="size-10 flex items-center justify-center hover:bg-[var(--color-surface-variant)] rounded-[var(--radius)]">
                      <svg className="size-6" fill="none" viewBox="0 0 14 2">
                        <path d={svgPaths.p7112900} fill="#5e5e5e" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Booking information */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <h3 className="text-[16px] text-[#1b1b1b] mb-6">Buchungsinformationen</h3>
                <div className="space-y-6">
                  <div className="flex gap-12">
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Status</p>
                      <div className="bg-[#fef3ce] px-2 py-1 rounded-[var(--radius-label)] inline-block">
                        <span className="text-[14px] text-[#4c3a02]">{trip.status}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Buchungstyp</p>
                      <p className="text-[16px] text-[#1b1b1b]">Vorausbuchung</p>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Dispatcher / Flotte</p>
                      <p className="text-[16px] text-[#1b1b1b]">Hamburg Dispatcher</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Fahrttyp</p>
                      <p className="text-[16px] text-[#1b1b1b]">Standard</p>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Dispatcher / Flotte</p>
                      <p className="text-[16px] text-[#1b1b1b]">Hamburg Dispatcher</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e] mb-2">Nachricht an Fahrer / Notiz</p>
                      <p className="text-[16px] text-[#1b1b1b]">-</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time & Location Details */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <h3 className="text-[16px] text-[#1b1b1b] mb-6">Zeit- & Standortdetails</h3>
                <div className="space-y-4">
                  {/* Requested Pick-Up */}
                  <div className="flex gap-3">
                    <svg className="size-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 16 20">
                      <path d={svgPaths.p33900880} fill="#5e5e5e" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e]">Gewünschte Abholung</p>
                      <p className="text-[16px] text-[#1b1b1b]">{trip.time}</p>
                      <p className="text-[14px] text-[#6a7282]">{trip.pickup}</p>
                    </div>
                  </div>

                  {/* Requested Drop-Off */}
                  <div className="flex gap-3">
                    <svg className="size-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 16 20">
                      <path d={svgPaths.p1bfc6d80} fill="#5e5e5e" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e]">Gewünschtes Ziel</p>
                      <p className="text-[16px] text-[#1b1b1b]">{trip.dropoff}</p>
                    </div>
                  </div>

                  {/* Wait Time */}
                  <div className="flex gap-3">
                    <svg className="size-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 20 20">
                      <path d={svgPaths.p13e0ed00} fill="#5e5e5e" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#5e5e5e]">Wartezeit</p>
                      <p className="text-[16px] text-[#1b1b1b]">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="w-[395px] flex flex-col gap-6">
              {/* Driver & Vehicle Details */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <h3 className="text-[16px] text-[#1b1b1b] mb-6">Fahrer- & Fahrzeugdetails</h3>
                <div className="space-y-4">
                  {/* Driver */}
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-[#ffedd4] flex items-center justify-center">
                      <span className="text-[16px] text-neutral-950">
                        {trip.driverId.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[16px] text-neutral-950">Fahrer {trip.driverId}</p>
                      <p className="text-[14px] text-[#6a7282]">***-***-1234</p>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-1">Fahrzeug</p>
                    <p className="text-[16px] text-neutral-950">Toyota Camry</p>
                  </div>

                  {/* License Plate */}
                  <div>
                    <p className="text-[14px] text-[#4a5565] mb-1">Kennzeichen</p>
                    <p className="text-[16px] text-neutral-950">XYZ-789</p>
                  </div>

                  {/* Taxi Concession Number */}
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-1">Taxi-Konzessionsnummer</p>
                    <p className="text-[16px] text-neutral-950">T12345C</p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <h3 className="text-[16px] text-[#1b1b1b] mb-6">Fahrgastdetails</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-1">Name</p>
                    <p className="text-[16px] text-neutral-950">{trip.passenger}</p>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-1">Telefonnummer</p>
                    <p className="text-[16px] text-neutral-950">{trip.phone}</p>
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="bg-[#fcfcfc] rounded-[24px] p-6">
                <h3 className="text-[16px] text-[#1b1b1b] mb-6">Zahlungsdetails</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-2">Geschätzter Preis</p>
                    <p className="text-[16px] text-[#1b1b1b]">$22.00</p>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-2">Endpreis</p>
                    <p className="text-[16px] text-neutral-950">-</p>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#5e5e5e] mb-2">Zahlung</p>
                    <p className="text-[16px] text-[#1b1b1b]">Fahrer direkt bezahlen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}