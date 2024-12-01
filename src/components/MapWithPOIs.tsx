import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { POI } from './GoogleMaps';
import { fetchAllPOIs } from '../actions/ApiPoI';

const containerStyle = {
    width: '100%',
    height: '600px'
};

// Startposition für die Karte (Beispiel: Berlin)
const center = {
    lat: 52.52,
    lng: 13.405
};

const MapWithPOIs: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBtziH_1wrsEKwEbD-5TNtv2AFnaqFUMd0' // Fügen Sie hier Ihren API-Key ein
    });

    const [pois, setPois] = useState<POI[]>([]);
    const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);

    // Alle POIs laden
    useEffect(() => {
        async function loadPOIs() {
            try {
                const pois = await fetchAllPOIs();
                setPois(pois);
            } catch (error) {
                console.error("Fehler beim Laden der POIs:", error);
            }
        }
        loadPOIs();
    }, []);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {pois.map((poi) => (
                <Marker
                    key={poi.id}
                    position={{ lat: poi.location.coordinates[1], lng: poi.location.coordinates[0] }}
                    onClick={() => setSelectedPOI(poi)}
                />
            ))}

            {selectedPOI && (
                <InfoWindow
                    position={{
                        lat: selectedPOI.location.coordinates[1],
                        lng: selectedPOI.location.coordinates[0]
                    }}
                    onCloseClick={() => setSelectedPOI(null)}
                >
                    <div>
                        <h3>{selectedPOI.name}</h3>
                        <p>{selectedPOI.description}</p>
                        <p>Kategorie: {selectedPOI.category}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default MapWithPOIs;
