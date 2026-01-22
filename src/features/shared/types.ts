// Shared domain entities and primitives

export interface LocationData {
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}
