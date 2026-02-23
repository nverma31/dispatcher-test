import svgPaths from "@/components/icons/svg-kwl2nemlxy";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  currentPage: 'dispatch' | 'passengers' | 'passenger-details' | 'recurrent-trip' | 'recurrent-trip-details' | 'settings';
  onNavigate: (page: 'dispatch' | 'passengers' | 'passenger-details' | 'recurrent-trip' | 'recurrent-trip-details' | 'settings') => void;
}

function FreenowLogo() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <div className="absolute aspect-[24/24] left-[5%] overflow-clip right-[5%] top-1/2 translate-y-[-50%]">
        <div className="absolute h-[27px] left-[8.33%] right-[8.33%] top-1/2 translate-y-[-50%]">
          <div className="absolute inset-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 27">
              <path d={svgPaths.p18b5ad00} fill="var(--color-accent)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
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
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[96px]">
      <button
        onClick={onClick}
        className={`box-border content-stretch flex gap-[8px] items-center p-[12px] relative rounded-[var(--radius)] shrink-0 transition-colors cursor-pointer ${isActive ? 'bg-[var(--color-surface-variant)]' : 'hover:bg-[var(--color-surface-variant)]/50'
          }`}
      >
        {icon}
      </button>
      <p className="leading-[16px] relative shrink-0 text-[var(--color-on-surface)] text-[12px] text-center text-nowrap">
        {label}
      </p>
    </div>
  );
}

function DispatchIcon({ isActive }: { isActive: boolean }) {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
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
    <div className="overflow-clip relative shrink-0 size-[24px]">
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
    <div className="overflow-clip relative shrink-0 size-[24px]">
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

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const isDispatchActive = currentPage === 'dispatch' || currentPage === 'recurrent-trip';
  const isPassengersActive = currentPage === 'passengers' || currentPage === 'passenger-details' || currentPage === 'recurrent-trip-details';

  return (
    <div className="bg-[var(--color-surface-highest)] box-border content-stretch flex flex-col gap-[32px] items-center pb-[32px] pt-[16px] px-0 relative rounded-br-[var(--radius-card)] rounded-tr-[var(--radius-card)] h-full w-[128px]">
      {/* Logo */}
      <div className="box-border content-stretch flex gap-[10px] items-start justify-center px-0 py-[16px] relative shrink-0 w-full">
        <FreenowLogo />
      </div>

      {/* Navigation */}
      <div className="basis-0 content-stretch flex flex-col grow items-center justify-between min-h-px min-w-px relative shrink-0 w-full">
        {/* Main Navigation */}
        <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
          <NavItem
            icon={<DispatchIcon isActive={isDispatchActive} />}
            label={t('sidebar.dispatch')}
            isActive={isDispatchActive}
            onClick={() => onNavigate('dispatch')}
          />
          <NavItem
            icon={<PassengersIcon isActive={isPassengersActive} />}
            label={t('sidebar.passengers')}
            isActive={isPassengersActive}
            onClick={() => onNavigate('passengers')}
          />
        </div>

        {/* Settings at Bottom */}
        <NavItem
          icon={<SettingsIcon isActive={currentPage === 'settings'} />}
          label={t('sidebar.account')}
          isActive={currentPage === 'settings'}
          onClick={() => onNavigate('settings')}
        />
      </div>
    </div>
  );
}