import { useState, useMemo } from 'react';
import { experimental } from '@freenow/wave';
import { Search, X, Calendar as CalendarIcon } from 'lucide-react';
import { format, parse, isValid, addDays } from 'date-fns';
import { Trip } from '../../booking/types';

// SVG strings from the icons folder (inlined to avoid TS module issues)
const PhoneCarSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 3C7 3 7.5 3.5 7.5 4C7.5 5.19987 7.70006 6.49969 8 7.59961C8.19998 7.89958 8.09973 8.29962 7.7998 8.59961L5.59961 10.7998C6.99961 13.5998 9.4002 15.9004 12.2002 17.4004L14.4004 15.2002C14.6003 15.0003 14.7999 14.9005 15.0996 14.9004H15.4004C16.5003 15.3003 17.8002 15.5 19 15.5C19.5 15.5 20 16 20 16.5V20C20 20.5 19.5 21 19 21C9.6 21 2 13.4 2 4C2 3.5 2.5 3 3 3H6.5ZM14.2002 18.2002C15.4001 18.6002 16.7001 18.9 18 19V17.4004C17.1001 17.4004 16.2003 17.2 15.4004 17L14.2002 18.2002ZM19.8418 2C20.0679 2 20.2735 2.0626 20.458 2.1875C20.6425 2.31248 20.7694 2.48443 20.8389 2.70312L22 5.75V10.625C22 10.7313 21.9659 10.8207 21.8975 10.8926C21.829 10.9644 21.7437 11 21.6426 11H20.3633C20.2621 11 20.1768 10.9644 20.1084 10.8926C20.0399 10.8207 20.0059 10.7313 20.0059 10.625V9.875H13.9941V10.625C13.9941 10.7313 13.9601 10.8207 13.8916 10.8926C13.8232 10.9644 13.7379 11 13.6367 11H12.3574C12.2563 11 12.171 10.9644 12.1025 10.8926C12.0341 10.8207 12 10.7313 12 10.625V5.75L13.1611 2.70312C13.2306 2.48443 13.3575 2.31248 13.542 2.1875C13.7265 2.0626 13.9321 2 14.1582 2H19.8418ZM4 5C4.09999 6.29992 4.39984 7.59987 4.7998 8.7998L6 7.59961C5.80003 6.7997 5.59998 5.89986 5.5 5H4ZM14.5 6.6875C14.3016 6.6875 14.133 6.76045 13.9941 6.90625C13.8553 7.05208 13.7861 7.22917 13.7861 7.4375C13.7861 7.64583 13.8553 7.82292 13.9941 7.96875C14.133 8.11455 14.3016 8.1875 14.5 8.1875C14.6984 8.1875 14.867 8.11455 15.0059 7.96875C15.1447 7.82292 15.2139 7.64583 15.2139 7.4375C15.2139 7.22917 15.1447 7.05208 15.0059 6.90625C14.867 6.76045 14.6984 6.6875 14.5 6.6875ZM19.5 6.6875C19.3016 6.6875 19.133 6.76045 18.9941 6.90625C18.8553 7.05208 18.7861 7.22917 18.7861 7.4375C18.7861 7.64583 18.8553 7.82292 18.9941 7.96875C19.133 8.11455 19.3016 8.1875 19.5 8.1875C19.6984 8.1875 19.867 8.11455 20.0059 7.96875C20.1447 7.82292 20.2139 7.64583 20.2139 7.4375C20.2139 7.22917 20.1447 7.05208 20.0059 6.90625C19.867 6.76045 19.6984 6.6875 19.5 6.6875ZM13.4434 5.375H20.5566L19.8418 3.5H14.1582L13.4434 5.375Z" fill="currentColor"/></svg>`;

const PenSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.89474 19.1053H6.24474L16.4526 8.89737L15.1026 7.54737L4.89474 17.7553V19.1053ZM3.94737 21C3.67895 21 3.45395 20.9092 3.27237 20.7276C3.09079 20.5461 3 20.3211 3 20.0526V17.7553C3 17.5026 3.04737 17.2618 3.14211 17.0329C3.23684 16.8039 3.37105 16.6026 3.54474 16.4289L16.4526 3.54474C16.6421 3.37105 16.8513 3.23684 17.0803 3.14211C17.3092 3.04737 17.55 3 17.8026 3C18.0553 3 18.3 3.04737 18.5368 3.14211C18.7737 3.23684 18.9789 3.37895 19.1526 3.56842L20.4553 4.89474C20.6447 5.06842 20.7829 5.27368 20.8697 5.51053C20.9566 5.74737 21 5.98421 21 6.22105C21 6.47368 20.9566 6.71447 20.8697 6.94342C20.7829 7.17237 20.6447 7.38158 20.4553 7.57105L7.57105 20.4553C7.39737 20.6289 7.19605 20.7632 6.96711 20.8579C6.73816 20.9526 6.49737 21 6.24474 21H3.94737ZM15.7658 8.23421L15.1026 7.54737L16.4526 8.89737L15.7658 8.23421Z" fill="currentColor"/></svg>`;

const XCircleSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 13.4L14.9 16.3C15.0833 16.4833 15.3167 16.575 15.6 16.575C15.8833 16.575 16.1167 16.4833 16.3 16.3C16.4833 16.1167 16.575 15.8833 16.575 15.6C16.575 15.3167 16.4833 15.0833 16.3 14.9L13.4 12L16.3 9.1C16.4833 8.91667 16.575 8.68333 16.575 8.4C16.575 8.11667 16.4833 7.88333 16.3 7.7C16.1167 7.51667 15.8833 7.425 15.6 7.425C15.3167 7.425 15.0833 7.51667 14.9 7.7L12 10.6L9.1 7.7C8.91667 7.51667 8.68333 7.425 8.4 7.425C8.11667 7.425 7.88333 7.51667 7.7 7.7C7.51667 7.88333 7.425 8.11667 7.425 8.4C7.425 8.68333 7.51667 8.91667 7.7 9.1L10.6 12L7.7 14.9C7.51667 15.0833 7.425 15.3167 7.425 15.6C7.425 15.8833 7.51667 16.1167 7.7 16.3C7.88333 16.4833 8.11667 16.575 8.4 16.575C8.68333 16.575 8.91667 16.4833 9.1 16.3L12 13.4ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="currentColor"/></svg>`;

const CarOutlineSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.75 4.99935C15.5833 4.49935 15.0833 4.16602 14.5833 4.16602H5.41667C4.83333 4.16602 4.41667 4.49935 4.25 4.99935L2.5 9.99935V16.666C2.5 17.0827 2.91667 17.4993 3.33333 17.4993H4.16667C4.66667 17.4993 5 17.0827 5 16.666V15.8327H15V16.666C15 17.0827 15.4167 17.4993 15.8333 17.4993H16.6667C17.0833 17.4993 17.5 17.0827 17.5 16.666V9.99935L15.75 4.99935ZM5.66667 5.83268H14.25L15.1667 8.33268H4.83333L5.66667 5.83268ZM15.8333 14.166H4.16667V9.99935H15.8333V14.166ZM6.25 10.8327C6.91667 10.8327 7.5 11.416 7.5 12.0827C7.5 12.7493 6.91667 13.3327 6.25 13.3327C5.58333 13.3327 5 12.7493 5 12.0827C5 11.416 5.58333 10.8327 6.25 10.8327ZM13.75 10.8327C14.4167 10.8327 15 11.416 15 12.0827C15 12.7493 14.4167 13.3327 13.75 13.3327C13.0833 13.3327 12.5 12.7493 12.5 12.0827C12.5 11.416 13.0833 10.8327 13.75 10.8327Z" fill="currentColor"/></svg>`;

const { Table, TableHeader, TableBody, Column, Row, Cell } = experimental;

// Inline SVG icon helper
function SvgIcon({ raw, size = 24, className }: { raw: string; size?: number; className?: string }) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: raw }}
    />
  );
}

// Status badge matches Figma label colors exactly
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    'In Progress': { bg: 'var(--palette-marooned-95)', color: 'var(--palette-marooned-20)' },
    Arrived: { bg: 'var(--palette-marooned-95)', color: 'var(--palette-marooned-20)' },
    Approach: { bg: 'var(--palette-yellow-95)', color: 'var(--palette-yellow-20)' },
    Pending: { bg: 'var(--palette-neutral-95)', color: 'var(--color-sys-on-surface)' },
    Completed: { bg: 'var(--palette-green-95)', color: 'var(--palette-green-20)' },
    'Completed by FREENOW': { bg: 'var(--palette-green-95)', color: 'var(--palette-green-20)' },
    Cancelled: { bg: 'var(--color-sys-negative)', color: 'var(--color-sys-on-accent)' },
    'No driver': { bg: 'var(--color-sys-negative)', color: 'var(--color-sys-on-accent)' },
  };
  const s = styles[status] ?? styles['Pending'];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: 22, padding: '0 8px',
        borderRadius: 4,
        backgroundColor: s.bg,
        color: s.color,
        fontSize: 'var(--fs-label-2)',
        fontWeight: 'var(--fw-label-2)',
        lineHeight: 'var(--lh-label-2)',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
}

// Filter chip for status filters
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        height: 40, padding: '0 12px',
        borderRadius: 12,
        border: 'none', cursor: 'pointer',
        backgroundColor: active ? 'var(--color-sys-on-surface)' : 'var(--color-sys-surface-container)',
        color: active ? 'var(--color-sys-surface)' : 'var(--color-sys-on-surface)',
        fontSize: 'var(--fs-label-1)', fontWeight: 'var(--fw-label-1)',
        transition: 'background-color 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// Icon button (40x40 hitbox, no background unless hover)
function IconBtn({ children, onClick, disabled = false, title }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', borderRadius: 8,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-sys-surface-container)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {children}
    </button>
  );
}

interface TripTableProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

export function TripTable({ trips, onTripClick }: TripTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach(trip => { counts[trip.status] = (counts[trip.status] || 0) + 1; });
    return counts;
  }, [trips]);

  const filterChipsLeft = [
    { label: 'Ongoing', status: 'In Progress' },
    { label: 'Prebooked', status: 'Pending' },
  ];
  const filterChipsRight = [
    { label: 'Cancelled', status: 'Cancelled' },
    { label: 'Completed', status: 'Completed' },
    { label: 'Completed by FREENOW', status: 'Completed by FREENOW' },
  ];

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch =
        trip.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || trip.status === selectedStatus;
      let matchesDate = true;
      if (selectedDate && trip.date) {
        const tripDate = parse(trip.date, 'dd/MM/yyyy', new Date());
        matchesDate = isValid(tripDate) && format(tripDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      } else if (selectedDate && !trip.date) {
        matchesDate = false;
      }
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [trips, searchTerm, selectedStatus, selectedDate]);

  const chipStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    height: 40, padding: '0 12px',
    borderRadius: 12, border: 'none',
    backgroundColor: 'var(--color-sys-surface-container)',
    color: 'var(--color-sys-on-surface)',
    fontSize: 'var(--fs-label-1)', fontWeight: 'var(--fw-label-1)',
    cursor: 'pointer', flexShrink: 0,
  };

  const dateLabel = selectedDate
    ? `${format(selectedDate, 'dd.MM')}  –  ${format(addDays(selectedDate, 9), 'dd.MM')}`
    : '08.06  –  17.06';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>

      {/* ── Filters row ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>

        {/* Left chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {filterChipsLeft.map(chip => (
            <FilterChip
              key={chip.status}
              label={`${statusCounts[chip.status] || 0} ${chip.label}`}
              active={selectedStatus === chip.status}
              onClick={() => setSelectedStatus(selectedStatus === chip.status ? null : chip.status)}
            />
          ))}

          {/* Vertical divider */}
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--color-sys-divider)', flexShrink: 0 }} />

          {filterChipsRight.map(chip => (
            <FilterChip
              key={chip.status}
              label={`${statusCounts[chip.status] || 0} ${chip.label}`}
              active={selectedStatus === chip.status}
              onClick={() => setSelectedStatus(selectedStatus === chip.status ? null : chip.status)}
            />
          ))}

          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus(null)}
              style={{ ...chipStyle, backgroundColor: 'transparent', color: 'var(--color-sys-on-surface-variant)' }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Right: Date + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Date chip */}
          <button
            style={chipStyle}
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <CalendarIcon size={20} style={{ color: 'var(--color-sys-on-surface)' }} />
            <span style={{ fontSize: 'var(--fs-label-1)', fontWeight: 'var(--fw-label-1)' }}>{dateLabel}</span>
            {selectedDate && (
              <X
                size={14}
                style={{ marginLeft: 2, color: 'var(--color-sys-on-surface-variant)' }}
                onClick={e => { e.stopPropagation(); setSelectedDate(null); }}
              />
            )}
          </button>

          {/* Search chip — compact width so all filters fit in one row */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: 200, height: 40, padding: '0 12px',
              borderRadius: 12,
              backgroundColor: 'var(--color-sys-surface-container)',
              flexShrink: 0,
            }}
          >
            <Search size={24} style={{ color: 'var(--color-sys-on-surface-variant)', flexShrink: 0 }} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search booking"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: 'var(--fs-label-1)', fontWeight: 'var(--fw-label-1)',
                color: 'var(--color-sys-on-surface)',
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
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <Table
          aria-label="Trips Database"
          onRowAction={(key) => {
            const trip = trips.find(t => t.id === key);
            if (trip) onTripClick(trip);
          }}
          selectionMode="single"
        >
          <TableHeader>
            <Column isRowHeader>Time</Column>
            <Column>Status</Column>
            <Column>Driver ID</Column>
            <Column>Pickup</Column>
            <Column>Dropoff</Column>
            <Column>Pass. name</Column>
            <Column>Phone</Column>
            <Column>Actions</Column>
          </TableHeader>
          <TableBody items={filteredTrips}>
            {(trip) => {
              const canEdit = trip.status === 'In Progress' || trip.status === 'Arrived' || trip.status === 'Approach' || trip.status === 'Pending';
              const canCall = !!trip.phone;
              return (
                <Row key={trip.id} textValue={trip.passenger} className="cursor-pointer">
                  <Cell>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {trip.date ? `${trip.date.split('/')[0]}/${trip.date.split('/')[1]}, ${trip.time}` : trip.time}
                    </span>
                  </Cell>
                  <Cell>
                    <StatusBadge status={trip.status} />
                  </Cell>
                  <Cell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                      <SvgIcon raw={CarOutlineSvg} size={20} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.driverId}</span>
                    </div>
                  </Cell>
                  <Cell>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{trip.pickup}</span>
                  </Cell>
                  <Cell>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{trip.dropoff}</span>
                  </Cell>
                  <Cell>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{trip.passenger}</span>
                  </Cell>
                  <Cell>
                    <span style={{ whiteSpace: 'nowrap' }}>{trip.phone}</span>
                  </Cell>
                  <Cell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <IconBtn title="Call driver" onClick={() => onTripClick(trip)} disabled={!canCall}>
                        <SvgIcon raw={PhoneCarSvg} size={24} />
                      </IconBtn>
                      <IconBtn title="Edit trip" onClick={() => onTripClick(trip)} disabled={!canEdit}>
                        <SvgIcon raw={PenSvg} size={24} />
                      </IconBtn>
                      <IconBtn title="Cancel trip" disabled={!canEdit}>
                        <SvgIcon raw={XCircleSvg} size={24} />
                      </IconBtn>
                    </div>
                  </Cell>
                </Row>
              );
            }}
          </TableBody>
        </Table>

        {filteredTrips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-sys-on-surface-variant)' }}>
            <CalendarIcon size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 4, color: 'var(--color-sys-on-surface)' }}>No bookings found</p>
            <p style={{ fontSize: 14 }}>Try using other filters or search terms.</p>
            <button
              style={{ marginTop: 24, padding: '8px 24px', borderRadius: 12, border: '1px solid var(--color-sys-divider)', background: 'none', cursor: 'pointer', fontSize: 14 }}
              onClick={() => { setSearchTerm(''); setSelectedStatus(null); setSelectedDate(null); }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>


    </div>
  );
}