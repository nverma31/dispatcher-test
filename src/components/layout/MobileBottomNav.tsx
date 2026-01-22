import svgPaths from "@/components/icons/svg-kwl2nemlxy";

interface MobileBottomNavProps {
  currentPage: 'dispatch' | 'passengers' | 'passenger-details' | 'recurrent-trip' | 'recurrent-trip-details' | 'settings';
  onNavigate: (page: 'dispatch' | 'passengers' | 'passenger-details' | 'recurrent-trip' | 'recurrent-trip-details' | 'settings') => void;
}

function NavItem({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center flex-1 py-2 cursor-pointer"
    >
      <div 
        className={`flex items-center justify-center p-2 rounded-[var(--radius)] transition-colors ${
          isActive ? 'bg-[var(--color-surface-variant)]' : ''
        }`}
      >
        {icon}
      </div>
      <p className="leading-[16px] text-[var(--color-on-surface)] text-[10px] text-center mt-1">
        {label}
      </p>
    </button>
  );
}

function DispatchIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[12.5%_8.33%]">
        <div className="absolute inset-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
            <path 
              d={svgPaths.p3c876100} 
              fill={isActive ? "var(--color-accent)" : "var(--color-on-surface)"} 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PassengersIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[16.667%]">
        <div className="absolute inset-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path 
              d={svgPaths.p26ff6400} 
              fill={isActive ? "var(--color-accent)" : "var(--color-on-surface)"} 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%_9.46%]">
        <div className="absolute inset-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path 
              d={svgPaths.p3ff9d400} 
              fill={isActive ? "var(--color-accent)" : "var(--color-on-surface)"} 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function MobileBottomNav({ currentPage, onNavigate }: MobileBottomNavProps) {
  const isDispatchActive = currentPage === 'dispatch' || currentPage === 'recurrent-trip';
  const isPassengersActive = currentPage === 'passengers' || currentPage === 'passenger-details' || currentPage === 'recurrent-trip-details';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface-highest)] border-t border-[var(--color-outline-variant)] z-50">
      <div className="flex items-center justify-around px-2">
        <NavItem
          icon={<DispatchIcon isActive={isDispatchActive} />}
          label="Disposition"
          isActive={isDispatchActive}
          onClick={() => onNavigate('dispatch')}
        />
        <NavItem
          icon={<PassengersIcon isActive={isPassengersActive} />}
          label="Fahrgäste"
          isActive={isPassengersActive}
          onClick={() => onNavigate('passengers')}
        />
        <NavItem
          icon={<SettingsIcon isActive={currentPage === 'settings'} />}
          label="Einstellungen"
          isActive={currentPage === 'settings'}
          onClick={() => onNavigate('settings')}
        />
      </div>
    </div>
  );
}