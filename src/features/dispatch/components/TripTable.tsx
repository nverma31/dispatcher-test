import { Badge } from '@/components/ds/badge';
import { Button } from '@/components/ds/button';
import { experimental } from '@freenow/wave';
import { Search } from 'lucide-react';
import { TextField } from '@/components/ds/text-field';

const { Table, TableHeader, TableBody, Column, Row, Cell, Chip } = experimental;

import { Trip } from '@/types';

interface TripTableProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

const filterChips = [
  { label: '6 Laufend', group: 'active' },
  { label: '2 Vorgebucht', group: 'active' },
  { label: '4 Storniert', group: 'past' },
  { label: '12 Abgeschlossen', group: 'past' },
  { label: '8 Abgeschlossen von FreeNow', group: 'past' }
];

export function TripTable({ trips, onTripClick }: TripTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'positive';
      case 'Pending': return 'secondary';
      case 'In Progress': return 'default'; // blue-ish
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
          {filterChips.map((chip, index) => (
            <Chip
              key={index}
              onClick={() => { }}
            >
              {chip.label}
            </Chip>
          ))}
          <div className="h-8 w-px bg-border mx-2" />
          <Chip onClick={() => { }}>08.06 - 17.06</Chip>
        </div>

        <div className="w-full lg:w-[360px]">
          <TextField
            label="Buchung suchen"
            placeholder="Buchung suchen"
            slotLeft={<Search className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Trips Database"
        onRowAction={(key) => {
          const trip = trips.find(t => t.id === key);
          if (trip) onTripClick(trip);
        }}
        selectionMode="single"
      >
        <TableHeader>
          <Column isRowHeader>Abholzeit</Column>
          <Column>Status</Column>
          <Column>Fahrer-ID</Column>
          <Column>Abholung</Column>
          <Column>Ziel</Column>
          <Column>Name des Fahrgasts</Column>
          <Column>Telefonnummer</Column>
          <Column>Aktionen</Column>
        </TableHeader>
        <TableBody items={trips}>
          {(trip) => (
            <Row key={trip.id} textValue={trip.passenger} className="cursor-pointer">
              <Cell>{trip.time}</Cell>
              <Cell>
                <div className="flex">
                  <Badge variant={getStatusVariant(trip.status) as any}>
                    {trip.status}
                  </Badge>
                </div>
              </Cell>
              <Cell>{trip.driverId}</Cell>
              <Cell>{trip.pickup}</Cell>
              <Cell>{trip.dropoff}</Cell>
              <Cell>{trip.passenger}</Cell>
              <Cell>{trip.phone}</Cell>
              <Cell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </Cell>
            </Row>
          )}
        </TableBody>
      </Table>

      {/* Load More */}
      <div className="flex justify-center mt-4">
        <Button variant="secondary" className="w-full md:w-auto">
          Mehr laden
        </Button>
      </div>
    </div>
  );
}