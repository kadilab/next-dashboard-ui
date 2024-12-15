import React, { useEffect, useState, memo } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

interface MarkerType {
  position: {
    lat: number;
    lng: number;
  };
  label?: string;
}

interface GoogleMapWithMarkersProps {
  markers: MarkerType[];
}

const GoogleMapWithMarkers: React.FC<GoogleMapWithMarkersProps> = ({ markers }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Coordonnées par défaut si aucun marqueur n'est présent
  const defaultCenter = { lat: -10.719469, lng: 25.492928 };

  // État local pour le centre
  const [center, setCenter] = useState(defaultCenter);

  // Zoom par défaut
  const defaultZoom = 13;

  // État pour vérifier si l'API Google Maps est prête
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Filtrer les marqueurs valides
  const validMarkers = markers.filter(
    (marker) =>
      isFinite(marker.position?.lat) && isFinite(marker.position?.lng)
  );

  useEffect(() => {
    // Centrer la carte uniquement au premier chargement si des marqueurs existent
    if (validMarkers.length > 0 && center === defaultCenter) {
      setCenter({
        lat: validMarkers[0].position.lat,
        lng: validMarkers[0].position.lng,
      });
    }
  }, [validMarkers, center, defaultCenter]);

  // Vérifier si `window.google` est défini après le chargement de l'API
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setIsGoogleReady(true);
    }
  }, []);

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyA6pjnFNnei_6FyQzfFkGO8UYS48Bj3pHY"}
      onLoad={() => setIsGoogleReady(true)} // Marque l'API comme prête
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={defaultZoom}
        onDragEnd={() => {
          console.log("Carte déplacée.");
        }}
      >
        {isGoogleReady &&
          validMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={{
                lat: marker.position.lat,
                lng: marker.position.lng,
              }}
              label={""}
              icon={{
                url: "/car.png", // Chemin vers l'image de l'icône
                scaledSize: new window.google.maps.Size(20, 50), // Custom size
              }}
            />
          ))}
      </GoogleMap>
    </LoadScriptNext>
  );
};

// Utilisation de React.memo pour éviter des rendus inutiles
export default memo(GoogleMapWithMarkers);
