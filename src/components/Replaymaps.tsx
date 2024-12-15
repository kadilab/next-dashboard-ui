"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// Define the custom marker icon
const customIcon = L.icon({
  iconUrl: "/cars.svg", // Path to your custom marker icon
  iconSize: [40, 40], // Size of the icon [width, height]
  iconAnchor: [15, 40], // Anchor point of the icon [x, y]
  popupAnchor: [0, -40], // Anchor point for the popup [x, y]
});


// Define the custom marker icon
const start = L.icon({
  iconUrl: "/start.svg", // Path to your custom marker icon
  iconSize: [40, 40], // Size of the icon [width, height]
  iconAnchor: [15, 40], // Anchor point of the icon [x, y]
  popupAnchor: [0, -40], // Anchor point for the popup [x, y]
});

// Define the custom marker icon
const end = L.icon({
  iconUrl: "/end.svg", // Path to your custom marker icon
  iconSize: [40, 40], // Size of the icon [width, height]
  iconAnchor: [15, 40], // Anchor point of the icon [x, y]
  popupAnchor: [0, -40], // Anchor point for the popup [x, y]
});


// Define a type for route data
interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp?: string;
}

// Define the props for the map component
interface MyMapProps {
  position: [number, number]; // Center of the map
  zoom: number; // Zoom level
  route: RoutePoint[]; // Route data
}

export default function MyMap({ position, zoom, route }: MyMapProps) {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Polyline path for the traveled route
  const [traveledPath, setTraveledPath] = useState<
    [number, number][]
  >([]);

  // Ensure route has data and correct order
  if (route.length < 2) {
    console.warn("Route has less than 2 points; playback may not work correctly.");
  }

  const correctedStartPoint = route[0];
  const correctedEndPoint = route[route.length - 1];

  // Play and pause functionality
  const playRoute = () => {
    if (isPlaying) return; // Prevent multiple intervals
    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < route.length - 1) {
          const nextIndex = prevIndex + 1;

          // Update the traveled path with the next point
          setTraveledPath((prevPath) => [
            ...prevPath,
            [route[nextIndex].latitude, route[nextIndex].longitude],
          ]);

          return nextIndex;
        } else {
          clearInterval(intervalRef.current as NodeJS.Timeout); // Stop when the end is reached
          setIsPlaying(false);
          return prevIndex;
        }
      });
    }, 100); // Update marker every second
  };

  const pauseRoute = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button
          onClick={playRoute}
          disabled={isPlaying}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Play
        </button>
        <button
          onClick={pauseRoute}
          disabled={!isPlaying}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Pause
        </button>
      </div>

      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "700px", width: "100%" }}
      >
        {/* Base Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Polyline for traveled route */}
        {traveledPath.length > 0 && (
          <Polyline
            positions={traveledPath}
            color="green"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Full Route Polyline */}
        {route.length > 0 && (
          <Polyline
            positions={route.map((point) => [
              point.latitude,
              point.longitude,
            ])}
            color="blue"
            weight={2}
            opacity={0.4}
          />
        )}

        {/* Moving Marker */}
        {route[currentIndex] && (
          <Marker
            position={[
              route[currentIndex].latitude,
              route[currentIndex].longitude,
            ]}
            icon={customIcon}
          >
            <Popup>
              <b>Current Position</b>
              <br />
              {route[currentIndex].timestamp || "Unknown time"}
            </Popup>
          </Marker>
        )}

        {/* Corrected Start Marker */}
        {correctedStartPoint && (
          <Marker
            position={[correctedStartPoint.latitude, correctedStartPoint.longitude]}
            icon={start}
          >
            <Popup>
              <b>Start Point</b>
              <br />
              {correctedStartPoint.timestamp || "Unknown time"}
            </Popup>
          </Marker>
        )}

        {/* Corrected End Marker */}
        {correctedEndPoint && (
          <Marker
            position={[
              correctedEndPoint.latitude,
              correctedEndPoint.longitude,
            ]}
            icon={end}
          >
            <Popup>
              <b>End Point</b>
              <br />
              {correctedEndPoint.timestamp || "Unknown time"}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
