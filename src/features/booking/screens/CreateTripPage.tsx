import { useState } from 'react';
import { ArrowLeft, ChevronUp } from 'lucide-react';
import { TextField } from '@/components/ds/text-field';
import { SelectField, SelectOption } from '@/components/ds/select-field';
import { DateInput } from '@/features/booking/components/DateInput';
import { TimeInput } from '@/features/booking/components/TimeInput';
import { AddressLookupField } from '@/features/booking/components/AddressLookupField';
import { Checkbox } from '@/components/ds/checkbox';
import svgPaths from '@/components/icons/svg-eqa5bjm81b';
import type { Passenger } from '../../types';

interface CreateTripPageProps {
  passenger: Passenger;
  onBack: () => void;
  onSave?: (tripData: any) => void;
}

export function CreateTripPage({ passenger, onBack, onSave }: CreateTripPageProps) {
  const [formData, setFormData] = useState({
    time: 'Now',
    date: 'Today',
    pickup: '',
    dropoff: '',
    payment: 'pay_driver',
    fleet: 'fleet_01',
    driverId: '',
    vehicle: 'taxi',
    notes: '',
    insuranceCompany: 'sanitas',
    patientNumber: '',
    exemptionCoPayment: false,
    tripType: 'krankenfahrten',
    tripTitle: 'Post-surgery trip',
    linkedRecurrentTrip: '',
    insuranceNumber: '',
    m4Approved: false
  });

  const [isAdditionalOptionsOpen, setIsAdditionalOptionsOpen] = useState(false);

  const paymentOptions: SelectOption[] = [
    { value: 'pay_driver', label: 'Fahrer direkt bezahlen' },
    { value: 'company_card', label: 'Firmenkreditkarte' },
    { value: 'invoice', label: 'Rechnung' }
  ];

  const fleetOptions: SelectOption[] = [
    { value: 'fleet_01', label: 'FREENOW' },
    { value: 'fleet_02', label: 'Lokale Flotte' }
  ];

  const vehicleOptions: SelectOption[] = [
    { value: 'taxi', label: 'Taxi' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'van', label: 'Van' }
  ];

  const tripTypeOptions: SelectOption[] = [
    { value: 'krankenfahrten', label: 'Krankenfahrten' },
    { value: 'dialysis', label: 'Dialyse' },
    { value: 'therapy', label: 'Therapie' },
    { value: 'other', label: 'Sonstige' }
  ];

  const recurrentTripOptions: SelectOption[] = [
    { value: '', label: 'Keine' },
    { value: 'trip1', label: 'Physiotherapie mit Dr. Rey' },
    { value: 'trip2', label: 'Psychologe mit Dr. Morales' },
    { value: 'trip3', label: 'Schule Mario' }
  ];

  const insuranceOptions: SelectOption[] = [
    { value: 'sanitas', label: 'Sanitas' },
    { value: 'axa', label: 'AXA' },
    { value: 'allianz', label: 'Allianz' }
  ];

  const handleClearForm = () => {
    setFormData({
      time: 'Now',
      date: 'Today',
      pickup: '',
      dropoff: '',
      payment: 'pay_driver',
      fleet: 'fleet_01',
      driverId: '',
      vehicle: 'taxi',
      notes: '',
      insuranceCompany: 'sanitas',
      patientNumber: '',
      exemptionCoPayment: false,
      tripType: '',
      tripTitle: '',
      linkedRecurrentTrip: '',
      insuranceNumber: '',
      m4Approved: false
    });
  };

  const handleCreateBooking = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8">
      <div className="max-w-[760px] mx-auto px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="bg-[#f1efef] h-14 px-6 rounded-[var(--radius)] flex items-center gap-2 hover:bg-[var(--color-surface-variant)] transition-colors mb-8"
        >
          <ArrowLeft className="size-5" />
          <span className="text-[16px]">Zurück zur Versand</span>
        </button>

        {/* Header */}
        <h1 className="text-[28px] mb-8">Neue Fahrt buchen</h1>

        {/* Form */}
        <div className="space-y-8">
          {/* Pickup Details Section */}
          <div>
            <h2 className="text-[16px] mb-2">Abholdetails</h2>

            <div className="flex gap-2 mb-4">
              <div className="w-[144px]">
                <TimeInput
                  label="Zeit"
                  value={formData.time}
                  onChange={(value) => setFormData({ ...formData, time: value })}
                />
              </div>
              <div className="w-[184px]">
                <DateInput
                  label="Datum"
                  value={formData.date}
                  onChange={(value) => setFormData({ ...formData, date: value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <AddressLookupField
                id="pickup"
                label="Abholung"
                value={formData.pickup ? { address: formData.pickup, coordinates: { lat: 0, lng: 0 } } : null}
                onChange={(loc) => setFormData({ ...formData, pickup: loc?.address || '' })}
                placeholder=""
              />

              <AddressLookupField
                id="dropoff"
                label="Ziel"
                value={formData.dropoff ? { address: formData.dropoff, coordinates: { lat: 0, lng: 0 } } : null}
                onChange={(loc) => setFormData({ ...formData, dropoff: loc?.address || '' })}
                placeholder=""
              />
            </div>
          </div>

          {/* Payment Details Section */}
          <div>
            <h2 className="text-[16px] mb-2">Zahlungsdetails</h2>

            <div className="w-[288px]">
              <SelectField
                label="Zahlung"
                value={formData.payment}
                onChange={(value) => setFormData({ ...formData, payment: value })}
                options={paymentOptions}
                placeholder=""
                icon={
                  <svg className="size-6" fill="none" viewBox="0 0 24 24">
                    <path clipRule="evenodd" d={svgPaths.p2a812180} fill="#675B5B" fillRule="evenodd" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Taxi Details Section */}
          <div>
            <h2 className="text-[16px] mb-2">Taxi-Details</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SelectField
                    label="Flotte"
                    value={formData.fleet}
                    onChange={(value) => setFormData({ ...formData, fleet: value })}
                    options={fleetOptions}
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Fahrer-ID (optional)"
                    value={formData.driverId}
                    onChange={(value) => setFormData({ ...formData, driverId: value })}
                    placeholder=""
                  />
                </div>
              </div>

              <SelectField
                label="Fahrzeug"
                value={formData.vehicle}
                onChange={(value) => setFormData({ ...formData, vehicle: value })}
                options={vehicleOptions}
                placeholder=""
              />

              <TextField
                label="Notiz an Fahrer (optional)"
                value={formData.notes}
                onChange={(value) => setFormData({ ...formData, notes: value })}
                placeholder=""
              />
            </div>
          </div>

          {/* Additional Options Section */}
          <div>
            {/* Header with Toggle */}
            <button
              onClick={() => setIsAdditionalOptionsOpen(!isAdditionalOptionsOpen)}
              className="flex items-center justify-between h-14 w-full group"
            >
              <h2 className="text-[16px]">Zusätzliche Optionen</h2>
              <div className="flex items-center justify-center size-12 rounded-[4px] transition-colors">
                <ChevronUp
                  className={`size-5 transition-transform ${isAdditionalOptionsOpen ? '' : 'rotate-180'
                    }`}
                />
              </div>
            </button>

            {/* Collapsible Content */}
            {isAdditionalOptionsOpen && (
              <div className="space-y-4 mt-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SelectField
                      label="Typ"
                      value={formData.tripType}
                      onChange={(value) => setFormData({ ...formData, tripType: value })}
                      options={tripTypeOptions}
                      placeholder=""
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      label="Titel (optional)"
                      value={formData.tripTitle}
                      onChange={(value) => setFormData({ ...formData, tripTitle: value })}
                      placeholder=""
                    />
                  </div>
                </div>

                <SelectField
                  label="Mit wiederkehrender Fahrt verknüpfen (optional)"
                  value={formData.linkedRecurrentTrip}
                  onChange={(value) => setFormData({ ...formData, linkedRecurrentTrip: value })}
                  options={recurrentTripOptions}
                  placeholder=""
                />
              </div>
            )}
          </div>

          {/* Healthcare & Insurance Information Section */}
          <div>
            <h2 className="text-[16px] mb-2">Krankenversicherungsinformationen</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <TextField
                    label="Versicherungsunternehmen (optional)"
                    value={formData.insuranceCompany}
                    onChange={(value) => setFormData({ ...formData, insuranceCompany: value })}
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Versicherungsnummer (optional)"
                    value={formData.insuranceNumber}
                    onChange={(value) => setFormData({ ...formData, insuranceNumber: value })}
                    placeholder=""
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.exemptionCoPayment}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, exemptionCoPayment: checked === true })
                    }
                  />
                  <span className="text-[16px] select-none">Von Zuzahlung befreit</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.m4Approved}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, m4Approved: checked === true })
                    }
                  />
                  <span className="text-[16px] select-none">M4 von Krankenkasse genehmigt</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={handleClearForm}
              className="h-14 px-6 rounded-[var(--radius)] border-2 border-[var(--color-outline)] hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              <span className="text-[16px]">Formular löschen</span>
            </button>
            <button
              onClick={handleCreateBooking}
              className="h-14 px-6 rounded-[var(--radius)] bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 transition-opacity"
            >
              <span className="text-[16px]">Buchung erstellen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}