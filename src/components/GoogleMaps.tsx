export interface POI {
    id: string;
    name: string;
    description: string;
    category: string;
    location: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };
}