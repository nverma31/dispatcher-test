import { useState, useEffect } from 'react';
import svgPaths from "@/components/icons/svg-byb7jysnbs";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ className, currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className={className} data-name=".Pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[var(--radius-label)] shrink-0 size-[32px] hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
        data-name="chevron"
      >
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron left">
          <div className="absolute inset-[20.83%_33.33%]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 12">
              <path d={svgPaths.p2c3906a0} fill="currentColor" className="text-foreground" id="Vector" />
            </svg>
          </div>
        </div>
      </button>
      
      {[...Array(totalPages)].map((_, index) => {
        const pageNum = index + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`box-border content-stretch flex flex-col gap-[8px] items-center justify-center p-[8px] relative rounded-[var(--radius)] shrink-0 size-[32px] transition-colors ${
              pageNum === currentPage 
                ? 'bg-primary' 
                : 'hover:bg-muted'
            }`}
            data-name="Pagination number"
          >
            <p className={`relative shrink-0 text-nowrap whitespace-pre ${
              pageNum === currentPage ? 'text-primary-foreground' : 'text-foreground'
            }`}>
              {pageNum}
            </p>
          </button>
        );
      })}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="box-border content-stretch flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[var(--radius-label)] shrink-0 size-[32px] hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
        data-name="chevron"
      >
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron right">
          <div className="absolute inset-[20.83%_33.33%]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 12">
              <path d={svgPaths.p71b35f0} fill="currentColor" className="text-foreground" id="Vector" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

interface LabelProps {
  className?: string;
  labelText?: string;
  type?: "Default" | "Positive" | "Negative";
}

function Label({ className, labelText = "Label", type = "Default" }: LabelProps) {
  if (type === "Positive") {
    return (
      <div className={className} data-name="Type=Positive">
        <div className="bg-[#eaf2ea] box-border content-stretch flex h-[22px] items-center justify-center px-[8px] py-[4px] relative rounded-[var(--radius-label)] shrink-0" data-name="Label">
          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#1a4a1d] text-nowrap">
            <p className="leading-[20px] whitespace-pre">{labelText}</p>
          </div>
        </div>
      </div>
    );
  }
  if (type === "Negative") {
    return (
      <div className={className} data-name="Type=Negative">
        <div className="bg-[#ffedec] box-border content-stretch flex h-[22px] items-center justify-center px-[8px] py-[4px] relative rounded-[var(--radius-label)] shrink-0" data-name="Label">
          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#920028] text-nowrap">
            <p className="leading-[20px] whitespace-pre">{labelText}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Type=Default">
      <div className="bg-muted box-border content-stretch flex h-[22px] items-center justify-center px-[8px] py-[4px] relative rounded-[var(--radius-label)] shrink-0" data-name="Label">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-foreground text-nowrap">
          <p className="leading-[20px] whitespace-pre">{labelText}</p>
        </div>
      </div>
    </div>
  );
}

interface PassengerData {
  id: string;
  name: string;
  passengerId: string;
  phone: string;
  recurrentTrips: string;
  purpose: string;
  status: "Fehlende Informationen" | "Vollständig";
  totalTrips?: number;
  lastTripDate?: string;
}

interface PassengerCardProps {
  passenger: PassengerData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function PassengerCard({ passenger, onEdit, onDelete }: PassengerCardProps) {
  return (
    <div className="bg-card border border-border rounded-[var(--radius)] p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-foreground">{passenger.name}</h3>
          <p className="text-muted-foreground text-sm">{passenger.passengerId}</p>
        </div>
        <Label 
          labelText={passenger.status} 
          type={passenger.status === "Missing Information" ? "Negative" : "Positive"} 
        />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Telefon:</span>
          <span className="text-foreground">{passenger.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Wiederkehrende Fahrten:</span>
          <span className="text-foreground">{passenger.recurrentTrips}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Zweck:</span>
          <span className="text-foreground">{passenger.purpose}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <button 
          onClick={() => onEdit(passenger.id)}
          className="flex-1 bg-muted hover:bg-secondary transition-colors rounded-[var(--radius)] px-4 py-2 flex items-center justify-center gap-2"
        >
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="pen">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p2a70e6f0} fill="currentColor" className="text-muted-foreground" id="Vector" />
              </svg>
            </div>
          </div>
          <span className="text-sm">Bearbeiten</span>
        </button>
        <button 
          onClick={() => onDelete(passenger.id)}
          className="flex-1 bg-muted hover:bg-secondary transition-colors rounded-[var(--radius)] px-4 py-2 flex items-center justify-center gap-2"
        >
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="trash">
            <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
                <path d={svgPaths.p366ad00} fill="currentColor" className="text-muted-foreground" id="Vector" />
              </svg>
            </div>
          </div>
          <span className="text-sm">Löschen</span>
        </button>
      </div>
    </div>
  );
}

interface PassengerRowProps {
  className?: string;
  passenger: PassengerData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function PassengerRow({ className, passenger, onEdit, onDelete }: PassengerRowProps) {
  return (
    <div className={className} data-name=".passenger row">
      <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Bricks">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[16px] items-center px-[12px] py-0 relative size-full">
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 text-nowrap" data-name="Text">
              <p className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground w-full">
                {passenger.name}
              </p>
              <p className="[white-space-collapse:collapse] leading-[20px] overflow-ellipsis overflow-hidden relative shrink-0 text-muted-foreground w-full">
                {passenger.passengerId}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 7">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
              <p className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                {passenger.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 12">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
              <p className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                {passenger.recurrentTrips}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 14">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
              <p className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                {passenger.purpose}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 13">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
            <Label 
              labelText={passenger.status} 
              type={passenger.status === "Fehlende Informationen" ? "Negative" : "Positive"} 
              className="box-border content-stretch flex flex-col gap-[10px] items-start overflow-clip px-0 py-[2px] relative shrink-0" 
            />
          </div>
        </div>
      </div>
      <div className="box-border content-stretch flex gap-[4px] h-full items-center max-w-[144px] min-w-[104px] overflow-clip px-[8px] py-0 relative shrink-0" data-name="Bricks">
        <button 
          onClick={() => onEdit(passenger.id)}
          className="content-stretch flex items-center justify-center relative shrink-0 size-[40px] hover:bg-muted rounded-[var(--radius)] transition-colors" 
          data-name="Icon Button 2"
        >
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="pen">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <path d={svgPaths.p2a70e6f0} fill="currentColor" className="text-muted-foreground" id="Vector" />
              </svg>
            </div>
          </div>
        </button>
        <button 
          onClick={() => onDelete(passenger.id)}
          className="content-stretch flex items-center justify-center relative shrink-0 size-[40px] hover:bg-muted rounded-[var(--radius)] transition-colors" 
          data-name="Icon Button 3"
        >
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="trash">
            <div className="absolute inset-[8.33%_12.5%]" data-name="Vector">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
                <path d={svgPaths.p366ad00} fill="currentColor" className="text-muted-foreground" id="Vector" />
              </svg>
            </div>
          </div>
        </button>
      </div>
      <div className="absolute bottom-0 box-border content-stretch flex flex-col gap-[4px] items-start justify-center left-0 px-[8px] py-0 right-0" data-name="horizontal">
        <div className="h-0 relative shrink-0 w-full" data-name="Divider">
          <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1472 1">
              <line stroke="currentColor" className="stroke-border" x2="1472" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PassengerHeaderProps {
  className?: string;
  onAddPassenger: () => void;
}

function PassengerHeader({ className, onAddPassenger }: PassengerHeaderProps) {
  return (
    <div className={className} data-name=".passenger header">
      <h1 className="relative shrink-0 text-nowrap whitespace-pre">
        Fahrgäste
      </h1>
      <button 
        onClick={onAddPassenger}
        className="bg-muted box-border content-stretch flex flex-col gap-[8px] h-[48px] md:h-[56px] items-center justify-center overflow-clip px-[12px] md:px-[16px] py-[8px] relative rounded-[var(--radius)] shrink-0 w-full sm:w-[184px] hover:bg-secondary transition-colors" 
        data-name="Book_Button"
      >
        <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="Icon+Label">
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Icon">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-name="plus">
              <div className="absolute inset-[20.833%]" data-name="Vector">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                  <path d={svgPaths.p28466600} fill="currentColor" className="text-foreground" id="Vector" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-foreground text-nowrap">
            <p className="leading-[24px] whitespace-pre text-sm md:text-base">Fahrgast hinzufügen</p>
          </div>
        </div>
      </button>
    </div>
  );
}

interface PassengersListScreenProps {
  className?: string;
  passengers: PassengerData[];
  onUpdatePassenger: (id: string, updatedData: Partial<PassengerData>) => void;
  onDeletePassenger: (id: string) => void;
  onEditPassenger: (id: string) => void;
}

export function PassengersListScreen({ className, passengers, onUpdatePassenger, onDeletePassenger, onEditPassenger }: PassengersListScreenProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  
  // Calculate total pages based on actual passenger count
  const passengersPerPage = 10;
  const totalPages = Math.ceil(passengers.length / passengersPerPage);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter passengers based on search query
  const filteredPassengers = passengers.filter(passenger => 
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.passengerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count passengers with missing information
  const missingInfoCount = passengers.filter(p => p.status === 'Fehlende Informationen').length;

  const handleAddPassenger = () => {
    console.log('Add passenger clicked');
  };

  const handleEdit = (id: string) => {
    onEditPassenger(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Möchten Sie diesen Fahrgast wirklich löschen?')) {
      onDeletePassenger(id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={className} data-name=".dispatch-trip-list">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] md:gap-[24px] items-center overflow-clip p-[16px] md:p-[24px] lg:p-[32px] relative size-full">
          <PassengerHeader 
            className="content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative shrink-0 w-full max-w-[1488px]" 
            onAddPassenger={handleAddPassenger}
          />
          <div className="content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative shrink-0 w-full max-w-[1488px]" data-name="Filters">
            <div className="bg-muted box-border content-stretch flex gap-[4px] h-[36px] md:h-[40px] items-center justify-center overflow-clip px-[12px] py-[8px] relative rounded-[var(--radius)] shrink-0" data-name="Chip">
              <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-foreground text-nowrap">
                <p className="leading-[24px] whitespace-pre text-sm md:text-base">{missingInfoCount} fehlende Informationen</p>
              </div>
            </div>
            <div className="bg-muted box-border content-stretch flex gap-[4px] items-center overflow-clip px-[12px] md:px-[16px] py-[8px] relative rounded-[var(--radius)] shrink-0 w-full sm:w-[280px] md:w-[360px]" data-name="Search bar">
              <div className="overflow-clip relative shrink-0 size-[20px] md:size-[24px]" data-name="search">
                <div className="absolute inset-[12.5%]" data-name="Vector">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                    <path d={svgPaths.p16b4a380} fill="currentColor" className="text-muted-foreground" id="Vector" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Fahrgast suchen"
                className="bg-transparent border-none outline-none flex-1 text-muted-foreground placeholder:text-muted-foreground text-sm md:text-base"
              />
            </div>
          </div>
          
          {/* Mobile Card View */}
          {isMobile ? (
            <div className="w-full space-y-3" data-name="Cards">
              {filteredPassengers.map((passenger) => (
                <PassengerCard 
                  key={passenger.id}
                  passenger={passenger}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full max-w-[1488px] overflow-x-auto" data-name="Table">
            <div className="content-stretch flex gap-[8px] h-[72px] items-center relative shrink-0 w-full" data-name="Table header">
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 1">
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
                    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
                      <h4 className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                        Name / ID des Fahrgasts
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 12">
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
                    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
                      <h4 className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                        Telefonnummer
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 13">
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
                    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
                      <h4 className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                        Wiederkehrende Fahrten
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Cell 14">
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-0 relative size-full">
                    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
                      <h4 className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                        Zweck
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-0 grow h-full min-h-px min-w-[144px] relative shrink-0" data-name="Cell 11">
                <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
                  <div className="box-border content-stretch flex gap-[4px] items-center min-w-inherit px-[8px] py-0 relative size-full">
                    <div className="content-stretch flex flex-col items-start justify-center shrink-0" data-name="Text" />
                  </div>
                </div>
              </div>
              <div className="box-border content-stretch flex gap-[4px] h-full items-center overflow-clip px-[8px] py-0 relative shrink-0 w-[104px]" data-name="Cell 7">
                <div className="content-stretch flex flex-col items-start justify-center relative shrink-0" data-name="Text">
                  <h4 className="[white-space-collapse:collapse] leading-[24px] overflow-ellipsis overflow-hidden relative shrink-0 text-foreground text-nowrap w-full">
                    Aktionen
                  </h4>
                </div>
              </div>
              <div className="absolute bottom-0 box-border content-stretch flex flex-col gap-[4px] items-start justify-center left-0 px-[8px] py-0 right-0" data-name="horizontal">
                <div className="h-0 relative shrink-0 w-full" data-name="Divider">
                  <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1472 1">
                      <line stroke="currentColor" className="stroke-border" x2="1472" y1="0.5" y2="0.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {filteredPassengers.map((passenger) => (
              <PassengerRow 
                key={passenger.id}
                className="content-stretch flex gap-[8px] h-[72px] items-center relative shrink-0 w-[1488px]" 
                passenger={passenger}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            </div>
          )}
          
          <Pagination 
            className="content-stretch flex gap-[12px] md:gap-[24px] items-center justify-center relative shrink-0" 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}