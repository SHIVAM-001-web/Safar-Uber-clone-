import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultPosition = [30.3165, 78.0322]; // Dehradun

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultPosition);

    useEffect(() => {
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;

            console.log('Position updated:', latitude, longitude);

            setCurrentPosition([latitude, longitude]);
        };

        navigator.geolocation.getCurrentPosition(updatePosition);

        const watchId = navigator.geolocation.watchPosition(updatePosition);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return (
        <MapContainer
            center={currentPosition}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={currentPosition}>
                <Popup>
                    You are here
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default LiveTracking;