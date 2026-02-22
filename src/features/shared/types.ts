// Shared domain entities and primitives

export interface LocationData {
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
}

