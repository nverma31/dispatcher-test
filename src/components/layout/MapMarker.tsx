import React from 'react';
// @ts-expect-error - Vite handles SVG imports
import carLocalImg from '../icons/RH Car Annotations.svg';
// @ts-expect-error - Vite handles SVG imports
import carFreenowImg from '../icons/RH Car Annotations FN.svg';

export type MarkerType = 'pickup' | 'dropoff' | 'driver';
export type DriverStatus = 'available' | 'in_trip' | 'approaching';
export type FleetType = 'freenow' | 'local';

interface MapMarkerProps {
    type: MarkerType;
    label?: string;
    status?: DriverStatus;
    fleet?: FleetType;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ type, label, status, fleet }) => {
    let bgColor = 'var(--color-sys-pickup)';
    let onColor = 'var(--color-sys-on-pickup)';
    let Icon: React.ReactNode = null;
    let PlateIcon: React.ReactNode = null;

    if (type === 'pickup') {
        bgColor = 'var(--color-sys-pickup)';
        onColor = 'var(--color-sys-on-pickup)';
        Icon = (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        );
    } else if (type === 'dropoff') {
        bgColor = 'var(--color-sys-destination)';
        onColor = 'var(--color-sys-on-destination)';
        Icon = (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        );
    } else if (type === 'driver') {
        onColor = '#FFFFFF';

        switch (status) {
            case 'available':
                bgColor = 'var(--palette-blue-50)';
                break;
            case 'in_trip':
                bgColor = 'var(--palette-green-50)';
                break;
            case 'approaching':
                bgColor = 'var(--palette-orange-50)';
                break;
            default:
                bgColor = 'var(--palette-blue-50)';
        }

        // Driver Pill Icon: Car Outline as requested
        PlateIcon = (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 4.99935C15.5833 4.49935 15.0833 4.16602 14.5833 4.16602H5.41667C4.83333 4.16602 4.41667 4.49935 4.25 4.99935L2.5 9.99935V16.666C2.5 17.0827 2.91667 17.4993 3.33333 17.4993H4.16667C4.66667 17.4993 5 17.0827 5 16.666V15.8327H15V16.666C15 17.0827 15.4167 17.4993 15.8333 17.4993H16.6667C17.0833 17.4993 17.5 17.0827 17.5 16.666V9.99935L15.75 4.99935ZM5.66667 5.83268H14.25L15.1667 8.33268H4.83333L5.66667 5.83268ZM15.8333 14.166H4.16667V9.99935H15.8333V14.166ZM6.25 10.8327C6.91667 10.8327 7.5 11.416 7.5 12.0827C7.5 12.7493 6.91667 13.3327 6.25 13.3327C5.58333 13.3327 5 12.7493 5 12.0827C5 11.416 5.58333 10.8327 6.25 10.8327ZM13.75 10.8327C14.4167 10.8327 15 11.416 15 12.0827C15 12.7493 14.4167 13.3327 13.75 13.3327C13.0833 13.3327 12.5 12.7493 12.5 12.0827C12.5 11.416 13.0833 10.8327 13.75 10.8327Z" fill="currentColor" />
            </svg>
        );
    }

    return (
        <div
            className="relative flex flex-col items-center"
            style={{
                transform: 'translateY(-50%)',
                filter: 'drop-shadow(0px 1px 1.5px rgba(0, 15, 31, 0.12)) drop-shadow(0px 0px 1px rgba(0, 15, 31, 0.12))'
            }}
        >
            {/* Plate/Pill */}
            <div
                className="flex items-center gap-1 overflow-hidden rounded-full"
                style={{
                    backgroundColor: bgColor,
                    color: onColor,
                    padding: '3px 8px 3px 6px',
                }}
            >
                {type === 'driver' ? (
                    <div className="flex-shrink-0 w-[14px] h-[14px] flex items-center justify-center">
                        {PlateIcon}
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {Icon}
                    </div>
                )}
                <span className="text-[11px] font-bold leading-[14px] whitespace-nowrap tracking-wide">
                    {label || (type === 'pickup' ? 'Pickup' : 'Dropoff')}
                </span>
            </div>

            {/* Pointer tail (SVG triangle for consistent shape) */}
            <svg
                width="8"
                height="6"
                viewBox="0 0 8 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="-mt-[1px] relative z-10"
            >
                <path d="M4 6L0 0H8L4 6Z" fill={bgColor} />
            </svg>

            {/* Car Icon for Drivers */}
            {type === 'driver' && (
                <div className="relative -mt-[1px]">
                    <img
                        src={fleet === 'freenow' ? carFreenowImg : carLocalImg}
                        alt="car"
                        className={`w-[12px] h-auto ${fleet === 'local' ? 'rotate-90' : ''}`}
                    />
                </div>
            )}
        </div>
    );
};
