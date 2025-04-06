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

  // Función para guardar la ubicación en un JSON
  const saveLocationToFile = (lat: number, lng: number) => {
    const locationData = {
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString()
    };

    // Crear el JSON
    const jsonData = JSON.stringify(locationData, null, 2);
    
    // Crear un blob (archivo descargable)
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace temporal para descargar
    const a = document.createElement('a');
    a.href = url;
    a.download = `ubicacion_${Date.now()}.json`;
    a.click();
    
    // Limpiar
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: "Geolocation is not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const { latitude, longitude } = position.coords;

        setLocation({
          lat: latitude,
          lng: longitude,
          error: null
        });
        saveLocationToFile(latitude, longitude); // Guardar automáticamente
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
