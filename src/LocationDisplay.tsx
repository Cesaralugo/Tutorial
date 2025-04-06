import { useState, useEffect } from 'react';

export default function LocationDisplay() {
  const [location, setLocation] = useState<{
    lat: number | null;
    lng: number | null;
    error: string | null;
  }>({
    lat: null,
    lng: null,
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation is not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        position.toJSON();
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null
        });
      },
      (error) => {
        setLocation(prev => ({ ...prev, error: error.message }));
      }
    );
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Device Location</h2>
      {location.error ? (
        <p style={{ color: 'red' }}>Error: {location.error}</p>
      ) : location.lat ? (
        <div>
          <p>Latitude: {location.lat.toFixed(6)}</p>
          <p>Longitude: {location.lng?.toFixed(6)}</p>
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Google Maps
          </a>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}
