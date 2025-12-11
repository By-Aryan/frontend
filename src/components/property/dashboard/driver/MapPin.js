'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '550px',
};

const defaultCenter = {
  lat: 25.2048, // Dubai (near Burj Khalifa)
  lng: 55.2708,
};

const MapPin = ({ setLocations, locations }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Use env variable
  });

  const [marker, setMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const hasInitializedLocation = useRef(false);

  // Get current location when component mounts
  useEffect(() => {
    if (!hasInitializedLocation.current && (!locations.latitude || !locations.longitude)) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };

        setMarker(newPosition);
        setMapCenter(newPosition);

        // Update input fields with current location
        setLocations({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        });

        // Pan map to current location if available
        if (mapRef.current) {
          mapRef.current.panTo(newPosition);
        }

        setIsGettingLocation(false);
        hasInitializedLocation.current = true;
      },
      (error) => {
        let errorMessage = 'Unable to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
            break;
        }

        setLocationError(errorMessage);
        setIsGettingLocation(false);
        console.warn('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Update map marker when locations change from input fields
  useEffect(() => {
    const lat = parseFloat(locations.latitude);
    const lng = parseFloat(locations.longitude);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const newPosition = { lat, lng };
      setMarker(newPosition);
      setMapCenter(newPosition);
      
      // Pan the map to the new location if map is available
      if (mapRef.current) {
        mapRef.current.panTo(newPosition);
      }
    }
  }, [locations]);

  const handleMapClick = (e) => {
    if (!e.latLng) return;

    try {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      // Validate coordinates
      if (isNaN(newLat) || isNaN(newLng) || newLat < -90 || newLat > 90 || newLng < -180 || newLng > 180) {
        setLocationError('Invalid coordinates selected');
        return;
      }

      const newPosition = { lat: newLat, lng: newLng };

      setMarker(newPosition);
      setMapCenter(newPosition);
      setLocationError(null); // Clear any previous errors

      setLocations({
        latitude: newLat.toFixed(6),
        longitude: newLng.toFixed(6),
      });
    } catch (error) {
      setLocationError('Error processing map click');
      console.error('Map click error:', error);
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;

    try {
      // If we already have location coordinates, center the map on them
      const lat = parseFloat(locations.latitude);
      const lng = parseFloat(locations.longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        const position = { lat, lng };
        setMarker(position);
        setMapCenter(position);
        map.panTo(position);
      }
    } catch (error) {
      console.error('Error loading map with existing coordinates:', error);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div>
      {isGettingLocation && (
        <div style={{
          padding: '10px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '4px',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Getting your current location...
        </div>
      )}

      {locationError && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px',
          marginBottom: '10px',
          color: '#c62828'
        }}>
          {locationError}
          <button
            onClick={getCurrentLocation}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default MapPin;