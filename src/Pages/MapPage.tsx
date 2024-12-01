import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";

interface LatLng {
  lat: number;
  lng: number;
}

interface POI {
  id: string;
  name: string;
  lat: number;
  long: number;
  beschreibung: string;
  punkte: number;
}

const MapPage: React.FC = () => {
  const [game, setGame] = useState<any>(null); // To store the game object with POI data
  const [pois, setPois] = useState<POI[]>([]); // To store the fetched POI data
  const [positionPlayer, setPositionPlayer] = useState<LatLng | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Track which InfoWindow is open
  const mapCenter: LatLng = { lat: 52.544569, lng: 13.354061 };

  useEffect(() => {
    // Fetch the game first, which contains the POI data
    const fetchGame = async () => {
      try {
        const responseGame = await fetch(`http://localhost:3443/api/game/`);
        if (!responseGame.ok) {
          throw new Error("Failed to fetch game");
        }
        const gameData = await responseGame.json();
        const poiIdArray = gameData.poilId;

        if (!Array.isArray(poiIdArray)) {
          throw new Error("poiId is not an array or does not exist");
        }

        const pois = await Promise.all(
          poiIdArray.map(async (id) => {
            const response = await fetch(`http://localhost:3443/api/poi/${id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ID: ${id}`);
            }
            return response.json(); // Assuming the response matches the POI structure
          })
        );
        console.log("POIs:", pois);


        setGame(gameData);
        setPois(pois); // Save the POIs in state
      } catch (error) {
        console.error("Error fetching game:", error);
        console.log("There has been an error fetching POIs");
      }
    };

    fetchGame();

    // Watch for player position
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setPositionPlayer({ lat: latitude, lng: longitude });
          console.log(`Updated Position - Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <div style={{ height: "90vh" }}>
        <Map defaultZoom={10} defaultCenter={mapCenter} mapId={process.env.REACT_APP_GOOGLE_MAPS_MAP_ID || ""}>
          {/* Display POIs from the `pois` array */}
          {pois.map((poi, index) => (
            <AdvancedMarker
              key={poi.id}
              position={{ lat: poi.lat, lng: poi.long }} // Use latitude and longitude from POI
              onClick={() => setOpenIndex(index)}
            >
              <Pin background="green" borderColor="black" glyphColor="black" />
              {openIndex === index && (
                <InfoWindow
                  position={{ lat: poi.lat, lng: poi.long }}
                  onCloseClick={() => setOpenIndex(null)}
                >
                  <div>
                    <h3>{poi.name}</h3>
                    <p>{poi.beschreibung}</p>
                    <p>Points: {poi.punkte}</p>
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}

          {/* Marker for Player Position */}
          {positionPlayer && (
            <AdvancedMarker position={positionPlayer}>
              <Pin background="white" />
            </AdvancedMarker>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapPage;
