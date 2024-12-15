"use client";
import L from "leaflet";

import { MapContainer, Marker, TileLayer, Tooltip, Popup, LayersControl } from "react-leaflet";
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

// Define a type for markers
interface MarkerData {
  latitude: number;
  longitude: number;
  name?: string;
  speed?: number;
  status?: string;
}

interface MyMapProps {
  position: [number, number]; // Center of the map
  zoom: number; // Zoom level
  markers: MarkerData[]; // Array of markers
}

export default function MyMap({ position, zoom, markers }: MyMapProps) {
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayersControl position="topright">
        {/* OpenStreetMap Layer */}
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        {/* Google Streets Layer */}
        <LayersControl.BaseLayer name="Google Streets">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        </LayersControl.BaseLayer>

        {/* Google Satellite Layer */}
        <LayersControl.BaseLayer name="Google Satellite">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Render markers dynamically */}
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.latitude, marker.longitude]} icon={customIcon}>
          <Popup>
            <b>{marker.name || "Unknown Device"}</b>
            <br />
            Speed: {marker.speed ? `${marker.speed} km/h` : "N/A"}
            <br />
            Status: {marker.status || "Unknown"}
          </Popup>
          <Tooltip>{marker.name || "Device"}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
