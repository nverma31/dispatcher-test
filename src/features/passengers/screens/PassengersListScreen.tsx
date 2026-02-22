import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ds/button';

const DropdownSelectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2487 15.6585C11.6471 16.1138 12.3555 16.1138 12.7539 15.6585L17.5501 10.1771C18.1159 9.53048 17.6567 8.51855 16.7975 8.51855L7.20507 8.51855C6.34591 8.51855 5.88673 9.53048 6.45249 10.1771L11.2487 15.6585Z" fill="currentColor" />
  </svg>
);

// ─── Icons from icons folder (inlined) ────────────────────────────────────────

const PenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.89474 19.1053H6.24474L16.4526 8.89737L15.1026 7.54737L4.89474 17.7553V19.1053ZM3.94737 21C3.67895 21 3.45395 20.9092 3.27237 20.7276C3.09079 20.5461 3 20.3211 3 20.0526V17.7553C3 17.5026 3.04737 17.2618 3.14211 17.0329C3.23684 16.8039 3.37105 16.6026 3.54474 16.4289L16.4526 3.54474C16.6421 3.37105 16.8513 3.23684 17.0803 3.14211C17.3092 3.04737 17.55 3 17.8026 3C18.0553 3 18.3 3.04737 18.5368 3.14211C18.7737 3.23684 18.9789 3.37895 19.1526 3.56842L20.4553 4.89474C20.6447 5.06842 20.7829 5.27368 20.8697 5.51053C20.9566 5.74737 21 5.98421 21 6.22105C21 6.47368 20.9566 6.71447 20.8697 6.94342C20.7829 7.17237 20.6447 7.38158 20.4553 7.57105L7.57105 20.4553C7.39737 20.6289 7.19605 20.7632 6.96711 20.8579C6.73816 20.9526 6.49737 21 6.24474 21H3.94737ZM15.7658 8.23421L15.1026 7.54737L16.4526 8.89737L15.7658 8.23421Z" fill="currentColor" />
  </svg>
);

const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.91794 22C6.39656 22 5.47666 21.1858 5.4059 19.696L4.82211 7.4136H3.99066C3.43342 7.4136 3 7.01516 3 6.46081C3 5.91511 3.43342 5.51667 3.99066 5.51667H7.74103V4.26072C7.74103 2.81421 8.66093 2 10.3061 2H13.6762C15.3214 2 16.2501 2.81421 16.2501 4.26072V5.51667H20.0005C20.5666 5.51667 21 5.91511 21 6.46081C21 7.01516 20.5754 7.4136 20.0005 7.4136H19.169L18.5941 19.696C18.5233 21.1771 17.5946 22 16.0821 22H7.91794ZM9.77543 4.33001V5.51667H14.2157V4.33001C14.2157 3.95756 13.9504 3.73235 13.5258 3.73235H10.4565C10.0408 3.73235 9.77543 3.95756 9.77543 4.33001ZM8.18329 20.0684H15.8079C16.2767 20.0684 16.5774 19.7566 16.5951 19.2369L17.1435 7.4136H6.82998L7.39607 19.2369C7.4226 19.7479 7.72334 20.0684 8.18329 20.0684ZM9.41278 18.8125C9.0059 18.8125 8.714 18.544 8.70516 18.1455L8.44865 9.39714C8.43096 8.99004 8.70516 8.72152 9.13858 8.72152C9.5543 8.72152 9.84619 8.98138 9.85504 9.38848L10.1204 18.1369C10.1292 18.5353 9.85504 18.8125 9.41278 18.8125ZM11.9956 18.8125C11.5799 18.8125 11.288 18.544 11.288 18.1455V9.37982C11.288 8.98138 11.5799 8.72152 11.9956 8.72152C12.4201 8.72152 12.712 8.98138 12.712 9.37982V18.1455C12.712 18.544 12.4201 18.8125 11.9956 18.8125ZM14.5872 18.8125C14.145 18.8125 13.8708 18.5353 13.8796 18.1369L14.145 9.38848C14.1538 8.98138 14.4369 8.72152 14.8614 8.72152C15.286 8.72152 15.5602 8.99004 15.5514 9.39714L15.286 18.1455C15.2772 18.5526 14.9941 18.8125 14.5872 18.8125Z" fill="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="currentColor" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PassengerData {
  id: string;
  name: string;
  passengerId: string;
  phone: string;
  recurrentTrips: string;
  purpose: string;
  status: 'Fehlende Informationen' | 'Vollständig';
  totalTrips?: number;
  lastTripDate?: string;
}

interface PassengersListScreenProps {
  className?: string;
  passengers: PassengerData[];
  onUpdatePassenger: (id: string, updatedData: Partial<PassengerData>) => void;
  onDeletePassenger: (id: string) => void;
  onEditPassenger: (id: string) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PassengerData['status'] }) {
  const isComplete = status === 'Vollständig';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 22, padding: '0 8px', borderRadius: 4,
      backgroundColor: isComplete ? 'var(--palette-green-95, #eaf2ea)' : 'var(--sys/color/negative-container, #fae6ea)',
      color: isComplete ? 'var(--palette-green-20, #1a4a1d)' : 'var(--sys/color/on-negative-container, #790518)',
      fontSize: 14, fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      height: 40, padding: '0 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
      backgroundColor: active ? 'var(--color-sys-on-surface, #1e1a1a)' : 'var(--sys/color/surface-container, #f1efef)',
      color: active ? 'var(--sys/color/surface, #fcfcfc)' : 'var(--color-sys-on-surface, #1e1a1a)',
      fontSize: 16, fontWeight: 500, lineHeight: '24px',
      transition: 'background-color 0.15s, color 0.15s', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button title={title} onClick={onClick} style={{
      width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'none', border: 'none', borderRadius: 8, cursor: 'pointer',
      color: 'var(--color-sys-on-surface-variant, #675b5b)', flexShrink: 0,
      transition: 'background-color 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sys/color/surface-container, #f1efef)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {children}
    </button>
  );
}

// Column header cell
function TH({ children, width }: { children: React.ReactNode; width?: number | string }) {
  return (
    <div style={{
      flex: width ? `0 0 ${typeof width === 'number' ? width + 'px' : width}` : '1 0 0',
      width: width ? (typeof width === 'number' ? width : undefined) : undefined,
      padding: '0 8px', display: 'flex', alignItems: 'center',
      fontSize: 16, fontWeight: 700, color: 'var(--color-sys-on-surface, #1e1a1a)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {children}
    </div>
  );
}

// Data cell
function TD({ children, width, align }: { children: React.ReactNode; width?: number | string; align?: 'start' | 'end' }) {
  return (
    <div style={{
      flex: width ? `0 0 ${typeof width === 'number' ? width + 'px' : width}` : '1 0 0',
      width: width ? (typeof width === 'number' ? width : undefined) : undefined,
      padding: '0 8px', display: 'flex', alignItems: 'center',
      justifyContent: align === 'end' ? 'flex-end' : 'flex-start',
      fontSize: 16, fontWeight: 400, color: 'var(--color-sys-on-surface, #1e1a1a)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>
      {children}
    </div>
  );
}

const DIVIDER = (
  <div style={{ height: 1, backgroundColor: 'var(--color-sys-outline-variant, #e0d9d9)', width: '100%' }} />
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function PassengersListScreen({
  className,
  passengers,
  onDeletePassenger,
  onEditPassenger,
}: PassengersListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  const missingCount = passengers.filter(p => p.status === 'Fehlende Informationen').length;

  const filtered = passengers.filter(p => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.passengerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !showMissingOnly || p.status === 'Fehlende Informationen';
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Fahrgast wirklich löschen?')) {
      onDeletePassenger(id);
    }
  };

  return (
    // Outer page wrapper — p-[40px] gap-[24px] matching Figma Content-Page node
    <div
      className={className}
      style={{ padding: 40, height: '100%', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      {/* Dispatch selector — page-level headline matching Figma node 1530:122863 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <p style={{
          fontSize: 28, fontWeight: 700, lineHeight: '36px',
          color: 'var(--color-sys-on-surface, #1e1a1a)', margin: 0, flexShrink: 0,
        }}>
          Taxi Call Hamburg
        </p>
        <span style={{ color: 'var(--color-sys-on-surface-variant, #675b5b)', display: 'flex', alignItems: 'center' }}>
          <DropdownSelectIcon />
        </span>
      </div>

      {/* White rounded card — matches Figma "Dispatch Trip list" node */}
      <div style={{
        backgroundColor: 'var(--color-sys-surface, var(--color-surface, #fcfcfc))',
        borderRadius: 24,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        maxWidth: 1552,
        boxSizing: 'border-box',
      }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{
            fontSize: 28, fontWeight: 700, lineHeight: '36px',
            color: 'var(--color-sys-on-surface, #1e1a1a)', margin: 0,
          }}>
            Fahrgäste
          </p>
          <Button
            variant="secondary"
            onClick={() => console.log('Add passenger')}
            style={{ height: 56, paddingLeft: 16, paddingRight: 16, gap: 8, flexShrink: 0 }}
          >
            <PlusIcon />
            Fahrgast hinzufügen
          </Button>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <FilterChip
            label={`${missingCount} fehlende Informationen`}
            active={showMissingOnly}
            onClick={() => setShowMissingOnly(v => !v)}
          />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, width: 360, height: 40,
            padding: '0 16px', borderRadius: 12, flexShrink: 0,
            backgroundColor: 'var(--sys/color/surface-container, #f1efef)',
          }}>
            <Search size={24} color="var(--color-sys-on-surface-variant, #675b5b)" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Fahrgast suchen"
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: 16, fontWeight: 500, color: 'var(--color-sys-on-surface, #1e1a1a)',
              }}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {/* Header row */}
          <div style={{ display: 'flex', height: 72, alignItems: 'center', gap: 8, position: 'relative' }}>
            <TH>Passenger name / ID</TH>
            <TH>Phone number</TH>
            <TH>Recurrent trips</TH>
            <TH>Purpose</TH>
            <TH>Status</TH>
            <TH width={104}>Actions</TH>
          </div>
          {DIVIDER}

          {/* Data rows */}
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 120, color: 'var(--color-sys-on-surface-variant, #675b5b)', fontSize: 16,
            }}>
              Keine Fahrgäste gefunden
            </div>
          ) : (
            filtered.map(passenger => (
              <div key={passenger.id}>
                <div style={{ display: 'flex', height: 72, alignItems: 'center', gap: 8 }}>
                  {/* Name + ID */}
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
                      <span style={{
                        fontSize: 16, fontWeight: 400, lineHeight: '24px',
                        color: 'var(--color-sys-on-surface, #1e1a1a)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {passenger.name}
                      </span>
                      <span style={{
                        fontSize: 14, fontWeight: 400, lineHeight: '20px',
                        color: 'var(--color-sys-on-surface-container, #675b5b)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {passenger.passengerId}
                      </span>
                    </div>
                  </TD>
                  <TD>{passenger.phone}</TD>
                  <TD>{passenger.recurrentTrips}</TD>
                  <TD>{passenger.purpose}</TD>
                  <TD>
                    <StatusBadge status={passenger.status} />
                  </TD>
                  {/* Actions — right-aligned */}
                  <TD width={104} align="end">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconBtn title="Bearbeiten" onClick={() => onEditPassenger(passenger.id)}>
                        <PenIcon />
                      </IconBtn>
                      <IconBtn title="Löschen" onClick={() => handleDelete(passenger.id)}>
                        <TrashIcon />
                      </IconBtn>
                    </div>
                  </TD>
                </div>
                {DIVIDER}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}