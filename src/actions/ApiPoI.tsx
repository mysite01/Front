import { POI } from '../components/GoogleMaps';

const API_URL = 'http://localhost:3443/pois';

export async function fetchAllPOIs(): Promise<POI[]> {
    const response = await fetch(`${API_URL}/all`);
    if (!response.ok) {
        throw new Error("Fehler beim Abrufen aller POIs");
    }
    return response.json();
}
